import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';

interface CodeNode extends Node {
  lang?: string;
  value: string;
  children?: Node[];
}

export function remarkCustomPlugin() {
  return (tree: Node) => {
    visit(tree, 'code', (node: CodeNode, index: number, parent: Parent) => {
      if (node.lang === 'tikz') {
        const tikzCode = node.value.split('\n')
          .map(line => line.trim()).filter(x => x).join('\n');
        const htmlString = `<div class="blog-tikz-done"><script type="text/tikz">${tikzCode}</script></div>`;

        node.type = 'html';
        node.value = htmlString;
        node.children = undefined;
      }
    });

    // This visitor handles turning ==text== into <mark>text</mark>.
    visit(tree, 'text', (node: any, index: number, parent: Parent) => {
      let stack = 0;
      let open = false;
      let alt = "";
      for (let c of node.value) {
        if (open || stack != 0)
          console.log(open, stack, ", next ->", c);

        if (c === '=') {
          console.log("=");
          if (open ? !(open = !(--stack == 0)) : (open = (++stack == 2))) {
            console.log("trigger");
            alt = alt.substring(0, alt.length - 1);
            alt += open ? "<mark>" : "</mark>";
            continue;
          }
        } else
          stack = open ? 2 : 0;
        alt += c;
      }

      node.value = alt;
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

