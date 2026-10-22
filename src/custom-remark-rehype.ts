import { visit, SKIP } from 'unist-util-visit';
import type { Node, Parent } from 'unist';
import type { Code, Html, Text } from "mdast"
import { h } from 'hastscript';
import { toText } from 'hast-util-to-text';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import type { VFile } from 'vfile';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Scaling factor for TikZ diagrams: scales overall dimensions, text labels, and stroke weights
const TIKZ_SCALE = 1.75;
const TIKZ_CACHE_DIR = join(process.cwd(), '.tikz-cache');

// \usepackage[opts]{pkgs} and \usetikzlibrary{libs}, which are only legal in the preamble
const PACKAGE_LOAD = /\\(?:usepackage|usetikzlibrary)\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/g;

// Splits a TikZ block into preamble and body. Blocks may wrap their body in
// \begin{document}...\end{document}; otherwise the body starts at the first \begin{...}.
function splitTikzSource(tikzCode: string): { preamble: string, body: string } {
  // drop whole-line comments so that commented-out package loads don't get hoisted
  const src = tikzCode
    .replace(/^\s*%.*$/gm, '')
    .replace(/\\documentclass\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/, '');

  let preamble = '';
  let body = src;
  const docStart = src.indexOf('\\begin{document}');
  if (docStart >= 0) {
    preamble = src.slice(0, docStart);
    body = src.slice(docStart + '\\begin{document}'.length).replace(/\\end\{document\}[\s\S]*$/, '');
  } else {
    const envStart = src.search(/\\begin\{/);
    if (envStart >= 0) {
      preamble = src.slice(0, envStart);
      body = src.slice(envStart);
    }
  }

  // package loads that ended up in the body (e.g. after \begin{document}) get moved up
  const hoisted = body.match(PACKAGE_LOAD) ?? [];
  body = body.replace(PACKAGE_LOAD, '');
  return { preamble: [preamble, ...hoisted].join('\n'), body };
}

// Compiles TikZ source to an SVG file in TIKZ_CACHE_DIR and returns its path.
function renderTikzToSvg(tikzCode: string, scale = TIKZ_SCALE): string {
  // bump the version tag whenever the latex/dvisvgm invocation changes, to invalidate the cache
  const hash = createHash('sha256').update(`v3:scale:${scale}:${tikzCode}`).digest('hex');
  mkdirSync(TIKZ_CACHE_DIR, { recursive: true });
  const cachePath = join(TIKZ_CACHE_DIR, `${hash}.svg`);

  if (existsSync(cachePath)) {
    return cachePath;
  }

  const { preamble, body } = splitTikzSource(tikzCode);
  const tex = [
    '\\documentclass[dvisvgm]{standalone}',
    '\\usepackage{tikz}',
    '\\usepackage{amsmath,amssymb}',
    preamble,
    '\\begin{document}',
    body,
    '\\end{document}'
  ].join('\n');

  const workDir = join(tmpdir(), `tikz-${hash.slice(0, 10)}`);
  mkdirSync(workDir, { recursive: true });

  try {
    writeFileSync(join(workDir, 'diagram.tex'), tex, 'utf-8');

    const latex = spawnSync('latex', ['-interaction=nonstopmode', '-halt-on-error', 'diagram.tex'], { cwd: workDir });
    if (latex.status !== 0) {
      // only print from the first error onwards; the full log is mostly package loading noise
      const log = latex.stdout?.toString() || latex.stderr?.toString() || '';
      const errAt = log.indexOf('\n!');
      console.error(`[TikZ] latex compilation error for ${hash}:\n${errAt >= 0 ? log.slice(errAt + 1) : log}`);
      throw new Error(`LaTeX compilation failed for diagram ${hash}`);
    }

    // embedding the fonts as WOFF2 keeps text as real text, and comes out smaller than --no-fonts paths
    const dvisvgm = spawnSync('dvisvgm', [
      '--font-format=woff2',
      '--optimize',
      '--exact-bbox',
      `-Z${scale}`,
      'diagram.dvi',
      '-o',
      'diagram.svg'
    ], { cwd: workDir });
    const svgPath = join(workDir, 'diagram.svg');
    if (dvisvgm.status !== 0 || !existsSync(svgPath)) {
      console.error(`[TikZ] dvisvgm error for ${hash}:`, dvisvgm.stderr?.toString());
      throw new Error(`dvisvgm failed for diagram ${hash}`);
    }

    copyFileSync(svgPath, cachePath);
    return cachePath;
  } finally {
    try {
      rmSync(workDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}

export function remarkCustomPlugin() {
  return (tree: Node, file: VFile) => {
    visit(tree, 'code', (node: Code, index: number, parent: Parent) => {
      if (node.lang !== 'tikz') return;

      const tikzCode = node.value.split('\n')
        .map(line => line.trim()).filter(x => x).join('\n');
      const rawTex = `<code class="raw-tex">${escapeHtml(tikzCode)}</code>`;

      let replacement: Node[];
      try {
        // emit a regular markdown image pointing at the SVG, relative to the markdown file,
        // so that Astro's asset pipeline bundles it like any other local image
        const url = relative(dirname(file.path), renderTikzToSvg(tikzCode));
        replacement = [
          { type: 'html', value: '<div class="blog-tikz-done">' } as Html,
          { type: 'paragraph', children: [{ type: 'image', url, alt: 'TikZ diagram' }] } as Node,
          { type: 'html', value: `${rawTex}</div>` } as Html,
        ];
      } catch (err: any) {
        console.error('[remarkCustomPlugin] Failed to render TikZ diagram:', err.message);
        // fail CI builds loudly instead of deploying a broken diagram
        if (process.env.CI) throw err;
        replacement = [{
          type: 'html',
          value: `<div class="blog-tikz-done"><p class="tikz-error text-red-500 font-bold">Failed to compile TikZ diagram</p>${rawTex}</div>`
        } as Html];
      }

      parent.children.splice(index, 1, ...replacement);
      return [SKIP, index + replacement.length];
    });

    // This visitor handles turning ==text== into <mark>text</mark>.
    // NOTE: this does NOT handle stuff like ==**text**== correctly because
    // doing **text** internally makes a new AST node that breaks up the ==s.
    visit(tree, 'text', (node: Text, index: number, parent: Parent) => {
      let repl: any[] = []; // list of nodes to replace this node with

      let stack = 0;
      let open = false;
      let buf = "";

      for (let c of node.value) {
        if (c === '=') {
          if (open ? !(open = !(--stack == 0)) : (open = (++stack == 2))) {
            repl.push({type: "text", value: buf.substring(0, buf.length - 1)});
            repl.push({type: "html", value: open ? "<mark>" : "</mark>"});
            buf = "";
            continue;
          }
        } else
          stack = open ? 2 : 0;
        buf += c;
      }

      if (open) {
        console.log("ERROR: unclosed highlight in markdown. Due to AST limitations always use **==text==** instead of ==**text**==.")
        repl.push({type: "html", value: "</mark>"})
      }

      if (buf.length > 0)
        repl.push({type: 'text', value: buf});

      parent.children.splice(index, 1, ...repl);
      return ['skip', index + repl.length];
    });
  };
}

/**
 * Wraps math nodes with a span/div that stores the raw TeX in a data-tex attribute.
 * This runs BEFORE rehype-mathjax to capture the TeX source before it is replaced.
 */
export function rehypeMathjaxWrapper() {
  return (tree: Node) => {
    visit(tree, 'element', (node: any, index: number, parent: any) => {
      const isInline = node.properties?.className?.includes('math-inline');
      const isDisplay = node.properties?.className?.includes('math-display');

      if (isInline || isDisplay) {
        const tex = toText(node);
        const wrapperClass = isInline ? 'math-inline-wrapper' : 'math-display-wrapper';
        const wrapper = h(isInline ? 'span' : 'div', {
          className: [wrapperClass],
          style: isDisplay ? 'display: block; text-align: center;' : undefined,
          'aria-label': tex
        }, [node]);

        parent.children[index] = wrapper;
        return 'skip';
      }
    });
  };
}

/**
 * Finalizes MathJax accessibility by adding aria-labels and raw-tex spans.
 * This runs AFTER rehype-mathjax.
 */
export function rehypeMathjaxProcessor() {
  return (tree: Node) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      const isWrapper = node.properties?.className?.includes('math-inline-wrapper') ||
                        node.properties?.className?.includes('math-display-wrapper');

      if (isWrapper && parent && index !== undefined) {
        // const tex = node.properties.dataTex;
        // node.properties['aria-label'] = tex;
        node.properties.role = 'img';

        // Add the raw-tex code tag for text browsers, Reader Mode, and copy-paste
        const tex = node.properties.ariaLabel;
        const srOnly = h('code', { className: ['raw-tex'] }, [tex]);

        // Hide the rendered MathJax mjx-container from screen readers
        // so they don't try to read the internal structure.
        for (const child of node.children) {
          if (child.tagName === 'mjx-container') {
            child.properties = child.properties || {};
            child.properties['aria-hidden'] = 'true';
          }
        }
        
        // Insert the raw LaTeX
        node.children.push(srOnly);
      }
    });
  };
}

export function rehypeCustomPlugin() {
  return (tree: Node) => {
    visit(tree, 'heading', (node: any, index: number, parent: Parent) => {
      // Scaffolding for custom rehype plugin
    });
  };
}
