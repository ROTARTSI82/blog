<script>
export default {
  name: "portfolio"
}
</script>

<script setup>
import ModalImg from "./ModalImg.vue";

// dumb hack because the string with ~ isn't working?
import vertfp1 from "../assets/journoport/vert-fallplay1.webp";
import vertfp2 from "../assets/journoport/vert-fallplay2.webp";
import fp3 from "../assets/journoport/fallplay3.webp";
import wp1 from "../assets/journoport/waterpolo1.webp";
import wp2 from "../assets/journoport/waterpolo2.webp";
import at from "../assets/journoport/230224-GY-AnthonyTongHoH-6-tight.webp";
import ml from "../assets/journoport/matthewlau.webp";
import wp3 from "../assets/journoport/waterpolo3.webp";
import wp4 from "../assets/journoport/waterpolo4.webp";
import juliana from "../assets/journoport/_DSC8758.webp";
import cf1 from "../assets/journoport/clubfair1.webp";
import cf2 from "../assets/journoport/clubfair2.webp";

import wc1 from "../assets/journoport/230113_winterConcert_GY-12.webp";
import wc2 from "../assets/journoport/230113_winterConcert_GY-15.webp";
import wc3 from "../assets/journoport/230113_winterConcert_GY-30.webp";
import {ref} from "vue";

const items = [...Array(128).keys()];

// this is so dumb, but i like this better than v-html
const tabs = "&nbsp;&nbsp;&nbsp;&nbsp;";

const pgidx = ref(0);
const expanded = ref(false);

const incPg = () => {
  pgidx.value++;
  expanded.value=false;
}

const decPg = () => {
  pgidx.value--;
  expanded.value=false;
}

</script>

<template>
  <div id="profile-root">
    <div>
      <title>Grant Yang - Portfolio</title>
      <meta property="og:title" content="Grant Yang - Journalism Portfolio"/>
      <meta property="og:type" content="profile"/>
      <meta property="og:profile:first_name" content="Grant"/>
      <meta property="og:profile:last_name" content="Yang"/>
      <meta property="og:description" content="Hi! I'm Grant, and this is my Journalism portfolio for 2022-23."/>
      <meta property="og:image" content="https://harkeraquila.com/wp-content/uploads/2022/09/Grant-Yang-talon-reporter-599x900.jpg"/>
    </div>
    <div>
      <main>
        <h1>Grant Yang</h1>
        <i>Photos may take a while to load.</i>
        <p>
          <span v-html="tabs"/>Hi! I'm Grant, and I'm applying for Academics editor and
          Student Life editor. Here's what I've been up to in Journalism this year, and
          <a href="https://docs.google.com/document/d/124VyczaxGtLjFg823C6aQ_rHx77Q1NFtchXpYoFRtMc/edit?usp=sharing">here</a> is my cover letter!
        </p>
      </main>

      <h2>TALON Stuff</h2>
      <p>
        <span v-html="tabs"/>This year, I worked on many mods,
        gathering photos and interviews on all of the normal cycles. For the people & seniors section,
        I have worked on the then-vs-now faculty mods and the senior bucket list mods, among others.
        My last 3 pages did not have any copy, but the first two did.
        <br/><br/>

        <span v-html="tabs"/>Here is an example of a page:
      </p>
      <div id="pages">
        <div v-if="pgidx == 0">
          <div class="head">
            <h3>d1: link crew & orientation</h3>
            <p class="desc">
              <span v-html="tabs"/>I interviewed other students about the class trips, link crew members about
              mentoring advisees, and Ms. Callahan, a new freshman advisor.
              <br/>
              <span v-html="tabs"/>Here is some of the copy I wrote:
            </p>
          </div>
          <blockquote :class="expanded ? '' : 'collapsed'">
            <p>
              <span v-html="tabs"/>On the Wednesday morning a week before school started, a peaceful quiet rested almost everywhere on campus. Yet, hidden away in a lively dance studio, sandwiched between Main and the art building, Link Crew members spent the day undergoing training and meeting their partners and advisors for the year.
            </p>
            <p>
              <span v-html="tabs"/>“I was stressed because of matriculation stuff,” Link Crew member Alice Tao said (11). “But it was a really good way to relax. It’s really nice, and also it feels like a community.”
            </p>
            <p>
              <span v-html="tabs"/>The next day, the new faces would arrive on campus for Orientation and Field Day, which would be led by the senior Link Crew. After familiarizing themselves with the high school, the new advisories kicked off the year with team-building exercises, whether it was walking an A-frame or filling a leaking pipe together.
            </p>
            <p>
              <span v-html="tabs"/>Along with the hundreds of new students, also welcomed were our new faculty members. Bronwen Callahan, a new history teacher and 9th-grade advisor, appreciated Harker’s advisory program as a way to connect with students.
            </p>
            <p>
              <span v-html="tabs"/>“I just hope to form a group of students who feel that they have a peer group where they can relax at school and be comfortable,” she said. “I get to see what it’s like for the students to be new at Harker and experience Harker as well.”
            </p>
            <p>
              <span v-html="tabs"/>As for the Link Crew’s part, Rupert Chen (12) prized the opportunity to be a part of the 9th-graders’ high school experience.
            </p>
            <p>
              <span v-html="tabs"/>“The Link Crew when I was a freshman were a lot of fun,” he said. “They had a big role in making my advisory what it is now, shepherding us through that turbulent freshman year. When I had the opportunity to fulfill that same role for other freshmen, I jumped at it.”
            </p>
            <p>
              <span v-html="tabs"/>In Rupert’s experience of Link Crew, Field Day was the biggest event of the year, and the infamous leaking pipe activity was always a standout each time.
            </p>
            <p>
              <span v-html="tabs"/>“You can start with a plan, but then the plan quickly fails,” he said. “And you see how everyone reacts to that and how they face challenges.”
            </p>
            <p>
              <span v-html="tabs"/>Overall, Link Crew’s preparations and the day’s activities paid off.
            </p>
            <p>
              <span v-html="tabs"/>“I really like my Link Crew and they’re extremely helpful because they have experience at this school, so they’re able to help us with whatever we need.” Janam Chahal (9) said.
            </p>
            <br/>
            <a @click="expanded = true" v-if="!expanded">More</a>
            <a style="display: none" v-if="expanded"></a>
            <!-- <a @click="incPg()">Next Page</a> -->
            <a style="display: none"></a>
          </blockquote>
        </div>

        <div v-if="pgidx == 1">
          <div class="head">
            <h3>d2: science</h3>
            <p class="desc">
              <span v-html="tabs"/>I covered AP Physics C and Electronics, doing interviews and
            </p>

            <h3>d5: cs & research</h3>
            <p class="desc">
              <span v-html="tabs"/>
            </p>
            <a @click="decPg()">Previous Page</a>
          </div>
          <!-- <blockquote :class="expanded ? '' : 'collapsed'">
          </blockquote> -->
        </div>
      </div>

      <h2>Photos</h2>
      <p>
        <span v-html="tabs"/>Here are some of the photos I took this year! Although I didn't get to shoot as many events as I would have
        liked, I've included the winter concert, club fair, the fall play, and some water polo photos from our practice.
      </p>
      <div class="photo-grid">
        <div>
          <ModalImg :src="wp1.src"/>
          <ModalImg :src="fp3.src"/>
          <ModalImg :src="wp2.src"/>
          <ModalImg :src="wp3.src"/>
          <ModalImg :src="wp4.src"/>
          <ModalImg :src="cf1.src"/>
          <ModalImg :src="cf2.src"/>
          <ModalImg :src="juliana.src"/>
          <ModalImg :src="wc3.src"/>
          <ModalImg :src="wc1.src"/>

        </div>
        <div class="sidebar">
          <ModalImg :src="vertfp1.src"/>
          <ModalImg :src="vertfp2.src"/>
          <ModalImg :src="wc2.src"/>
        </div>
      </div>

      <h2>Humans of Harker</h2>
      <p>
        <span v-html="tabs"/>I wrote three Humans of Harker articles this year (but I have also included my HoH from last year).
        Only one has been published so far, as the editors are still working on the other two.
      </p>
      <div class="grid-container">
        <a href="https://harkeraquila.com/70783/humans-of-harker/humans-of-harker-pitching-in-to-the-community/">
          <h3>Katelyn Abellera</h3>
          <img src="https://harkeraquila.com/wp-content/uploads/2023/02/KatelynAbelleraHOH_GY-900x805.jpg" alt="katelyn abellera"/>
          <span class="photocred">Photo by me</span>
        </a>
        <a href="https://docs.google.com/document/d/1skR_bklWsMBsKnjafcrxBi8_9ETCpi-XAWakJQmsAio/edit">
          <h3>Anthony Tong</h3> <i>(unpublished)</i>
          <img :src="at.src" alt="anthony tong"/>
          <span class="photocred">Photo by me</span>
        </a>
        <a>
          <h3>Matthew Lau</h3> <i>(unpublished)</i>
          <img :src="ml.src" alt="matthew lau" id="matthewlau"/>
          <span class="photocred">Photo by me</span>
        </a>
        <a href="https://harkeraquila.com/66417/humans-of-harker/humans-of-harker-all-together-now/">
          <h3>Ishaan Mantripragada ('22)</h3>
          <img src="https://harkeraquila.com/wp-content/uploads/2022/03/IshaanMantripragadaHoH_EshaGohil-900x601.jpeg" alt="ishaan mantripragada"/>
          <span class="photocred">Photo by Esha Gohil</span>
        </a>
      </div>

      <h2>Aquila Articles</h2>
      <p>
        <span v-html="tabs"/>
        I have also continued working on Aquila articles! These last few cycles, I have not
        had much work from Aquila, but the most recent APEX article that I wrote with Lindsey
        won Best of Sno.
      </p>
      <div class="grid-container aquila">
        <a href="https://harkeraquila.com/70308/apex/apex-promoting-to-final-rank/">
          <h3>APEX: Promoting to final rank</h3>
          <br/>
          <h3>/w Lindsey Tuckey</h3>

          <img src="https://harkeraquila.com/wp-content/uploads/2023/01/DSC_1234-e1674534078798-647x900.jpg" alt="vyom" style="object-position: 50% -2rem;"/>
          <img id="sno" src="https://harkeraquila.com/wp-content/themes/snoflex/images/boslogo.png" alt="best of sno"/>
          <span class="photocred">Photo by Katelyn Zhao</span>
        </a>
        <a href="https://harkeraquila.com/68833/onlineexclusive/fifth-annual-girls-programming-league-challenge-offers-new-coding-opportunities/">
          <h3>Girls Programming League</h3>
          <br/>
          <h3>/w Vivian Chen</h3>

          <img src="https://harkeraquila.com/wp-content/uploads/2022/10/Screen-Shot-2022-09-25-at-1.48.46-PM-900x671.png" alt=""/>
          <span class="photocred">Photo from Sabrina Zhu</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400&display=swap');

#pages {
  --bgcol: rgb(214, 245, 255);
  background-color: var(--bgcol);
  width: min(48rem, 100%);
  margin: auto;
}

#pages h3 {
  font-size: 1.25rem;
}

#pages h3:not(:first-child) {
  padding-top: 1rem;
}

blockquote {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin: auto;
  position: relative;
}

.collapsed {
  max-height: 20rem;
  overflow: hidden;
}

.collapsed::before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute; /* literally Louis XIV */
  left: 0;
  top: 0;
  background: linear-gradient(transparent 10rem, var(--bgcol));
}

blockquote a {
  font-size: 1.1rem;
  color: blue!important;
  text-decoration: underline;
  cursor: pointer;
  position: absolute;
  width: 100%;
  bottom: 0.5rem;
  left: 0;
}

blockquote a:not(:first-of-type,:last-of-type) {
  width: fit-content;
  left: auto;
  right: 1rem;
}

blockquote a:last-of-type {
  width: fit-content;
  left: 1rem;
  right: auto;
}

blockquote a:hover {
  color: darkblue!important;
}

.desc {
  margin-bottom: 0;
  padding-bottom: 0;
}

p > a {
  text-align: left;
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}

.head {
  background-color: rgb(204, 221, 230);
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  margin: auto;
}

h1, h2 {
  font-family: 'Source Sans Pro Black', sans-serif;
}

h1 {
  font-size: 2rem;
  padding: 0.5rem;
}

h2 {
  font-size: 1.5rem;
  margin: 0.7rem;
}

#profile-root {
  font-family: 'Source Sans Pro', sans-serif;
  margin: auto;
  padding: 1rem;

  justify-content: center;
  text-align: center;

  width: 100%;
  height: 100%;
}

p {
  margin: auto;
  padding-bottom: 1rem;
  text-align: left;
  max-width: max(calc(50% + 2rem), 50rem);
}

.grid-container {
  --bgcol: #d7ffd7;
  display: inline-grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  max-width: min(100%, 50rem);
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
}

.grid-container > a {
  height: min(30rem, min(60vh, 60vw));
  width: min(32rem, 100%);
  margin: auto;
  overflow: hidden;
  background: var(--bgcol);
  position: relative;
}

.grid-container > a > h3, i {
  font-size: 1.1rem;
  display: inline;
}

.aquila > a {
  margin-top: 1rem;
}

#sno {
  object-fit: scale-down;
  object-position: right;
  height: 3rem;
  position: absolute;
  bottom: 0;
  right: 0;

  background: rgba(100%, 100%, 100%, 32%);
  max-width: 50%;
}

.grid-container > a:hover {
  scale: 102%;
}

.grid-container > a img {
  object-fit: cover;
  object-position: 50% top;
  height: 100%;
  width: 100%;
}

#matthewlau {
  object-position: 50% -2rem;
}

.photocred {
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  background: rgba(25%, 25%, 25%, 25%);
  padding: 0.1rem 0.2rem;
}


.photo-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1rem;
  max-width: min(75rem, 100%);
  margin: 0.125rem auto 2rem;
}

.photo-grid > div {
  grid-template-columns: 1fr;
  display: grid;
  gap: min(1rem, min(2vh, 2vw));
}

.photo-grid > div:not(.sidebar) {
  grid-template-columns: 1fr 1fr;
  /*max-height: 0;*/
}

.sidebar {
  max-height: 0;
}

</style>