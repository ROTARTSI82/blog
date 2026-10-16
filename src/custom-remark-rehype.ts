import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';
import type { Code, Html, Text } from "mdast"
import { h } from 'hastscript';
import { toText } from 'hast-util-to-text';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Scaling factor for TikZ diagrams: scales overall dimensions, text labels, and stroke weights
const TIKZ_SCALE = 1.75;

function renderTikzToSvg(tikzCode: string, scale = TIKZ_SCALE): string {
  const hash = createHash('sha256').update(`scale:${scale}:${tikzCode}`).digest('hex');
  const cacheDir = join(process.cwd(), '.tikz-cache');
  mkdirSync(cacheDir, { recursive: true });
  const cachePath = join(cacheDir, `${hash}.svg`);

  if (existsSync(cachePath)) {
    return readFileSync(cachePath, 'utf-8');
  }

  // Strip explicit \begin{document} and \end{document} if already present
  const codeWithoutDoc = tikzCode
    .replace(/\\begin\{document\}/g, '')
    .replace(/\\end\{document\}/g, '');

  const lines = codeWithoutDoc.trim().split('\n');
  const preamble: string[] = [];
  const body: string[] = [];

  for (const line of lines) {
    const s = line.trim();
    if (s.startsWith('%') || s.startsWith('\\documentclass')) {
      continue;
    }
    if (
      s.startsWith('\\usepackage') ||
      s.startsWith('\\usetikzlibrary') ||
      s.startsWith('\\pgfplotsset') ||
      s.startsWith('\\tikzset')
    ) {
      preamble.push(line);
    } else {
      body.push(line);
    }
  }

  const tex = [
    '\\documentclass[dvisvgm]{standalone}',
    '\\usepackage{tikz}',
    '\\usepackage{amsmath,amssymb}',
    ...preamble,
    '\\begin{document}',
    ...body,
    '\\end{document}'
  ].join('\n');

  const workDir = join(tmpdir(), `tikz-${hash.slice(0, 10)}`);
  mkdirSync(workDir, { recursive: true });

  try {
    const texPath = join(workDir, 'diagram.tex');
    writeFileSync(texPath, tex, 'utf-8');

    const latex = spawnSync('latex', ['-interaction=nonstopmode', 'diagram.tex'], { cwd: workDir });
    if (latex.status !== 0) {
      console.error(`[TikZ] latex compilation error for ${hash}:`, latex.stdout?.toString() || latex.stderr?.toString());
      throw new Error(`LaTeX compilation failed for diagram ${hash}`);
    }

    const dvisvgm = spawnSync('dvisvgm', [
      '--no-fonts',
      '--exact-bbox',
      `-Z${scale}`,
      'diagram.dvi',
      '-o',
      'diagram.svg'
    ], { cwd: workDir });
    if (dvisvgm.status !== 0) {
      console.error(`[TikZ] dvisvgm error for ${hash}:`, dvisvgm.stderr?.toString());
      throw new Error(`dvisvgm failed for diagram ${hash}`);
    }

    const svgPath = join(workDir, 'diagram.svg');
    if (!existsSync(svgPath)) {
      throw new Error(`dvisvgm did not output SVG for diagram ${hash}`);
    }

    let svg = readFileSync(svgPath, 'utf-8');
    // Strip XML declaration and generator comments for inlining
    svg = svg
      .replace(/<\?xml[\s\S]*?\?>/, '')
      .replace(/<!--[\s\S]*?-->/, '')
      .trim();

    writeFileSync(cachePath, svg, 'utf-8');
    return svg;
  } finally {
    try {
      rmSync(workDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}

export function remarkCustomPlugin() {
  return (tree: Node) => {
    visit(tree, 'code', (node: Code, index: number, parent: Parent) => {
      if (node.lang === 'tikz') {
        const tikzCode = node.value.split('\n')
          .map(line => line.trim()).filter(x => x).join('\n');

        let svgContent = '';
        try {
          svgContent = renderTikzToSvg(tikzCode);
        } catch (err: any) {
          console.error('[remarkCustomPlugin] Failed to render TikZ diagram:', err.message);
          svgContent = `<p class="tikz-error text-red-500 font-bold">Failed to compile TikZ diagram</p>`;
        }

        const htmlString = `<div class="blog-tikz-done" role="img" aria-label="TikZ Diagram">
${svgContent}<code class="raw-tex">${escapeHtml(tikzCode)}</code></div>`;

        (node as unknown as Html).type = 'html';
        node.value = htmlString;
      }
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
