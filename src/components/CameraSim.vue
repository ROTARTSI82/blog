<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';

const fragSrc = `#version 300 es
precision mediump float;

in vec2 tex_co;
in vec2 sensor_co;
layout(location = 0) out vec4 color;

uniform float iso;
uniform float aperture;
uniform float shutter;
uniform float focus;
uniform float lensFocal;

// makes more sense as an int, but
// this is a shader so this is more convenient
uniform float frame;

uniform sampler2D prevFrame;

int rng(inout int state) {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return state;
}

float rngf(inout int state) {
    return abs(fract(float(rng(state)) / 3599470.1437130086));
}

float square(float v) {
    return v*v;
}

// very cursed mathematical formula
// derived from Solve[Norm[(Origin + x Dir) - S] == r, x]
// this function only returns the multiple M such that rayOrigin + M * rayDir yields a point on the sphere
// PRECONDITION: Assumes that the rayDir vector is normalize (length 1)
float sphereRaycast(vec3 rayOrigin, vec3 rayDir, vec3 sphere, float radius, out bool hit) {
    vec3 sphereToRayOrigin = rayOrigin - sphere;
    float dirDot = dot(rayDir, sphereToRayOrigin);

    float discrim = 4.0 * (square(dirDot) - (square(length(sphereToRayOrigin))-square(radius)));
    hit = discrim >= 0.0;

    float len = (-dirDot - 0.5 * sqrt(discrim));
    return len;
}

struct Material {
    vec3 color;
    vec3 specular;
    vec3 emission;

    float roughness;
    float specularFactor;
};

struct Sphere {
    vec3 center;
    float radius;

    Material mat;
};

const int NUM_SPHERES = 4;
const Sphere spheres[4] = Sphere[NUM_SPHERES](
    Sphere(vec3(0.0,0.0,-5.0), 1.0, Material(vec3(1.0, 0.01, 0.01), vec3(0.0,0.0,0.0), vec3(0.1), 0.5, 0.5)),
    Sphere(vec3(-1.46,0.416,-2.918), 0.598, Material(vec3(0.01, 1.0, 0.01), vec3(0.0,0.0,0.0), vec3(1.0, 0.8, 0.1), 0.5, 0.5)),
    Sphere(vec3(2.187,-1.099,-7.216), 0.598, Material(vec3(0.01, 0.01, 1.0), vec3(0.0,0.0,0.0), vec3(0.1), 0.5, 0.5)),
    Sphere(vec3(0.07,-28.629,-6.806), 26.958, Material(vec3(0.01, 1.0, 1.0), vec3(0.0,0.0,0.0), vec3(0.1), 0.5, 0.5))
);

const float FAR_CLIP = 1000.0;
const float NEAR_CLIP = 0.01;

void main() {
    int state = 0xfa7229ba ^ int(dot(tex_co, vec2(447993.0990638579, 103383.36022113753)));
    state += int(frame * dot(tex_co, vec2(-123723.27260029671, 212688.06612332544)));

    // thin lens equation is 1/object-distance + 1/focus = 1/lensFocal
    // Coordiates: aperture is at 0, 0, 0 and is facing towards the -Z direction (img sensor is +Z)
    // key constraint: focus > lensFocal, otherwise rays diverge instead of focusing on point
    // that abs is not really there
    float objDist = 1.0/abs(1.0/lensFocal - 1.0/focus);

    // sensor_co contains the xy coordinates of the current pixel on the image sensor,
    // and sensor_co is scaled to the correct dimensions of the image sensor (in meters)
    // now i want a coordinate with z = negative objDist
    // in the direction of -(position of pixel on sensor) from 0,0,0
    vec3 focusPoint = -vec3(sensor_co, focus) * (objDist / focus);

    float rad = rngf(state) * 3.141592653 * 2.0;
    vec3 rayOrigin = vec3(cos(rad), sin(rad), 0) * aperture;
    vec3 rayDir = normalize(focusPoint - rayOrigin);

    bool hit = false;
    vec3 rayColor = vec3(1.0,1.0,1.0);
    vec3 accumColor = vec3(0.0, 0.0, 0.0);

    const int BOUNCES = 4;
    for (int i = 0; i < BOUNCES; i++) {
        vec3 sphere = vec3(0.0, 0.0, -5.0);

        float minDist = FAR_CLIP;
        int hitInd = -1;
        for (int j = 0; j < NUM_SPHERES; j++) {
            float dist = sphereRaycast(rayOrigin, rayDir, spheres[j].center, spheres[j].radius, hit);
            if (hit && dist < minDist && dist > NEAR_CLIP) {
                hitInd = j;
                minDist = dist;
            }
        }

        if (hitInd != -1) {
            rayOrigin += minDist * rayDir;
            vec3 normal = normalize(rayOrigin - spheres[hitInd].center);

            // am I *sure* that i have to choose a random magnitude too?
            float rad1 = rngf(state) * 3.141592653 * 2.0;
            float rad2 = rngf(state) * 3.141592653 * 2.0;
            rayDir = normalize(normal + rngf(state)*vec3(cos(rad1), sin(rad1), sin(rad2)));

            accumColor += rayColor * spheres[hitInd].mat.emission;
            rayColor *= spheres[hitInd].mat.color;
        } else {
            // TODO: Better sky emission
            accumColor += rayColor * vec3(135.0, 206.0, 235.0) * 0.005;
            break;
        }
    }

    color = vec4(clamp(accumColor, vec3(0.0,0.0,0.0),vec3(1.0,1.0,1.0)), 1.0);

    if (frame > 0.0) { // average out over multiple frames
        vec4 prevColor = texture(prevFrame, tex_co);
        color /= frame;
        color += (frame - 1.0) * prevColor / frame;
    }
}
`;

const canvasRef = ref<HTMLCanvasElement | null>(null);
const msg = ref("");
let mountedCount = 0;

let fps = ref(0); // variable is set by the render loop

const photoWidth = 4948;
const photoHeight = 3280;
const canvasScale = 8;
const aspect = photoWidth / photoHeight;
const viewWidth = photoWidth / canvasScale;
const viewHeight = photoHeight / canvasScale;

const vertSrc = `#version 300 es
precision mediump float;
layout(location = 0) in vec2 vert_pos;

out vec2 tex_co;
out vec2 sensor_co;

uniform float sensor;

void main() {
    gl_Position = vec4(vert_pos, 0.0, 1.0);
    tex_co = (vert_pos + vec2(1, 1)) / 2.0;
    sensor_co = vert_pos * sensor / 1000.0;
    sensor_co.x *= ${aspect};
}
`;

const uvFragSrc = `#version 300 es
precision mediump float;
layout(location = 0) out vec4 color;
in vec2 tex_co;

uniform sampler2D tex;

void main() {
    // the texture coords should be flipped bc the image
    // appears upside-down on our sensor
    color = texture(tex, vec2(1,1) - tex_co);
}
`;

onMounted(() => {
  const err = runGl();
  if (err !== "")
    msg.value = `Internal Error!
            Check that your browser supports WebGL properly.
            <pre>${err}</pre>`;
});

let frameNo = 0; // this needs to be accessed by HTML too
function runGl(): string {
  if (mountedCount++ > 0)
    return "Double mount";

  let canvas = canvasRef.value;
  if (canvas === null)
    return "Failed to get HTML Canvas";

  const gl = (canvas.getContext("webgl2")
      || canvas.getContext("experimental-webgl")
      || canvas.getContext("webgl")) as WebGL2RenderingContext;
  if (!gl)
    return "WebGL not supported";

  const reportErr = (): string => {
    return `GL error code ${gl.getError()}`;
  };

  console.log(gl.getContextAttributes());
  console.log(`
        ${gl.getParameter(gl.VENDOR)}
        ${gl.getParameter(gl.RENDERER)} ${gl.getParameter(gl.VERSION)}
        ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);

  function loadShader(pipeline: WebGLProgram, type: GLenum, source: string): WebGLShader | string {
    const shader = gl.createShader(type);
    if (!shader)
      return `${reportErr()}: glCreateShader failed for type=${type}`;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const err = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);

      return `${reportErr()}: Shader (type=${type}) compilation failed: ${err}`;
    }

    gl.attachShader(pipeline, shader);
    return shader;
  }

  const shaderPipeline = gl.createProgram();
  if (!shaderPipeline)
    return `${reportErr()}: Failed to create shader pipeline`;

  const frag = loadShader(shaderPipeline, gl.FRAGMENT_SHADER, fragSrc);
  if (typeof frag === "string") return frag;

  const vert = loadShader(shaderPipeline, gl.VERTEX_SHADER, vertSrc);
  if (typeof vert === "string") return vert;

  gl.linkProgram(shaderPipeline);


  const uvPipeline = gl.createProgram();
  if (!uvPipeline)
    return `${reportErr()}: Failed to create shader pipeline (2)`;

  const uvFrag = loadShader(uvPipeline, gl.FRAGMENT_SHADER, uvFragSrc);
  if (typeof uvFrag === "string") return uvFrag;

  const uvVert = loadShader(uvPipeline, gl.VERTEX_SHADER, vertSrc);
  if (typeof uvVert === "string") return uvVert;

  gl.linkProgram(uvPipeline);

  const vertPos = gl.getAttribLocation(shaderPipeline, "vert_pos");

  const s = 1;
  const quadData = new Float32Array([
    -s, -s,
    s, -s,
    s,  s,
    s,  s,
    -s,  s,
    -s, -s
  ]);

  const quadVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
  gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);

  // stride of 0 means tightly packed. size specifies vec2
  gl.vertexAttribPointer(vertPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertPos);

  const isoUniform = gl.getUniformLocation(shaderPipeline, "iso");
  const apertureUniform = gl.getUniformLocation(shaderPipeline, "aperture");
  const shutterUniform = gl.getUniformLocation(shaderPipeline, "shutter");
  const focusUniform = gl.getUniformLocation(shaderPipeline, "focus");
  const lensFocalUniform = gl.getUniformLocation(shaderPipeline, "lensFocal");
  const sensorUniform = gl.getUniformLocation(shaderPipeline, "sensor");

  const frameUniform = gl.getUniformLocation(shaderPipeline, "frame");
  const prevFrameSamplerUniform = gl.getUniformLocation(shaderPipeline, "prevFrame");
  const texSamplerUniform = gl.getUniformLocation(uvPipeline, "tex");

  gl.activeTexture(gl.TEXTURE0);
  let frameBuffers = Array.from([0,1].map(() => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, viewWidth, viewHeight, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    // do i need a renderbuffer? I do not use depth or stencil buffer
    const stat = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (stat !== gl.FRAMEBUFFER_COMPLETE) {
      alert(`fb creation failed: ${stat}`);
      gl.deleteFramebuffer(fb);
      gl.deleteTexture(tex);
      return {fb: null, tex: null}
    }

    return {fb, tex};
  }));

  for (let frameBuf of frameBuffers)
    if (frameBuf.fb === null || frameBuf.tex == null || frameBuffers.length !== 2)
      return `${reportErr()} Framebuffer creation failed`;

  let targetBuf = 0;

  // main rendering loop
  console.log("rendering");
  let prev = 0;

  function render(now: number) {
    let err = gl.getError();
    if (err !== 0)
      console.log(err);

    // now is in milliseconds
    const delta = now - prev;
    prev = now;
    fps.value = 1000 / delta;

    // ray trace the scene to a texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[targetBuf].fb);
    gl.useProgram(shaderPipeline);

    gl.uniform1f(isoUniform, iso.value);
    gl.uniform1f(apertureUniform, aperture.value / 1000);
    gl.uniform1f(shutterUniform, shutterSpeed.value);
    gl.uniform1f(focusUniform, focalLength.value / 1000);
    gl.uniform1f(lensFocalUniform, lensFocalLength.value / 1000);
    gl.uniform1f(sensorUniform, sensorHeight.value);
    gl.uniform1f(frameUniform, frameNo++);

    gl.uniform1i(prevFrameSamplerUniform, 0);
    gl.bindTexture(gl.TEXTURE_2D, frameBuffers[targetBuf ^ 1].tex);

    gl.viewport(0, 0, viewWidth, viewHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // draw everything to the actual viewport
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(uvPipeline);
    gl.uniform1i(texSamplerUniform, 0);
    gl.bindTexture(gl.TEXTURE_2D, frameBuffers[targetBuf].tex);

    gl.viewport(0, 0, viewWidth, viewHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // swap buffers
    targetBuf ^= 1;

    gl.flush();
    gl.finish();

    requestAnimationFrame(render);
    // i should exit out of this loop after a certain number of frames based on shutter speed
  }
  requestAnimationFrame(render);

  return "";
}


const iso = ref(500);
const aperture = ref(4);
const shutterSpeed = ref(200);
const focalLength = ref(105);
const lensFocalLength = ref(100);

// sensor is 23.6 mm × 15.6 mm
const sensorHeight = ref(28);

const fStop = ref(lensFocalLength.value / aperture.value);

function updateFStopBackwards(e: Event) {
  fStop.value = parseFloat((e?.target as HTMLInputElement)?.value);
  aperture.value = lensFocalLength.value / fStop.value;
}

function setFocalLength(e: Event) {
  lensFocalLength.value = parseFloat((e?.target as HTMLInputElement)?.value);
  fStop.value = lensFocalLength.value / aperture.value;
  resetPhoto();
}

function setAperture(e: Event) {
  aperture.value = parseFloat((e?.target as HTMLInputElement)?.value);
  fStop.value = lensFocalLength.value / aperture.value;
  resetPhoto();
}

const focalPlaneDist = computed(() => {
  // thin lens equation, same code as fragment shader
  return 1.0/(1.0/lensFocalLength.value - 1.0/focalLength.value);
});

const resetPhoto = () => {
  frameNo = 0;
}

</script>

<template>
  <main id="camera-main">
      <div slot="in-head">
        <title>Camera Simulator</title>
        <link href="@/public/favicon.ico" rel="shortcut icon" type="image/ico"/>
        <meta content="Camera Simulator" property="og:title"/>
        <meta content="website" property="og:type"/>
        <meta content="A path tracing simulator for cameras [WIP]" property="og:description"/>
        <meta content="" property="og:image"/>
      </div>
    <div id="txt">
      <h1>Camera Simulator</h1>
      <p>
        A ray-traced camera simulator in WebGL by Grant Yang. Does not work on Firefox for some reason, and I honestly
        give up trying to debug it.
        <br/>
        FPS: {{fps.toFixed(1)}}
      </p>
      <p style="color: red;" v-html="msg"></p>
    </div>
    <div id="canvas-container">
      <canvas ref="canvasRef" :style="`aspect-ratio: ${aspect}!important;`" :width="viewWidth" :height="viewHeight">
        ERROR: HTML canvas and WebGL support is required to run this simulator.
      </canvas>
    </div>

    <div class="controls">
      <label>ISO</label>
      <input type="range" v-model.number="iso" @input="resetPhoto()" min="0" max="2000"/>
      <input type="number" v-model.number="iso" @input="resetPhoto()"/>

      <label>Aperture (mm)</label>
      <input type="range" :value="aperture.toFixed(20)" @input="setAperture" min="0" max="100"/>
      <input type="number" :value="aperture.toFixed(2)" @input="setAperture"/>

      <label>Shutter Speed (1/sec)</label>
      <input type="range" v-model.number="shutterSpeed" @input="resetPhoto()" min="0" max="2000"/>
      <input type="number" v-model.number="shutterSpeed" @input="resetPhoto()"/>

      <label>Focus (mm)</label>
      <input type="range" v-model.number="focalLength" @input="resetPhoto()" min="0" max="200"/>
      <input type="number" v-model.number="focalLength" @input="resetPhoto()"/>

      <label>Lens Focal Length (mm)</label>
      <input type="range" :value="lensFocalLength.toFixed(2)" @input="setFocalLength" min="0" max="100"/>
      <input type="number" :value="lensFocalLength.toFixed(2)" @input="setFocalLength"/>

      <label>F-stop</label>
      <input type="range" :value="fStop.toFixed(2)" @input="updateFStopBackwards" min="1" max="32"/>
      <input type="number" :value="fStop.toFixed(2)" @input="updateFStopBackwards"/>

      <label>Sensor Height (mm)</label>
      <input type="range" v-model.number="sensorHeight" @input="resetPhoto()" min="1" max="100"/>
      <input type="number" v-model.number="sensorHeight" @input="resetPhoto()"/>
    </div>

    <!-- I might have to restart the render loop here too once-->
    <button @click="frameNo = 0">New Image</button>
    <p class="bottom-disp">
      Calculated Focal Distance: {{(focalPlaneDist/1000).toFixed(2)}}m
    </p>
  </main>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400&display=swap');

* {
  font-family: 'Source Sans Pro Black', sans-serif;
}

h1 {
  text-align: center;
  font-size: 1.25rem;
  padding: 1rem 0 0.1rem 1rem;
}

#txt {
  text-align: center;
  margin: auto auto 1rem auto;
  max-width: min(40rem, 100%);
}

canvas {
  width: 100%;
  height: 100%;
  margin: auto;
}

#canvas-container {
  width: 100%;
}

main {
  margin: auto;
  max-width: max(80vw, 40rem);
}

input, label {
  margin-top: 1rem;
  display: inline;
}

input[type=number] {
  border: 1rem black;
  line-height: 1rem;
}

.controls {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  column-gap: 0.5rem;
  width: 100%;
  display: grid;
  grid-template-columns: 25% 50% 20%;
}

.bottom-disp {
  margin-top: 0.5rem;
  text-align: center;
}

button {
  border: 1rem black;
  background-color: #c7c7c7;
  border-radius: 0.2rem;
  margin: 1rem auto auto auto;
  padding: 0.25rem;
}

button:hover {
  background-color: #d7d7d7;
}

</style>