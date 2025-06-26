import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';

interface CodeNode extends Node {
  lang?: string;
  value: string;
  children?: Node[];
}

export default function remarkCustomPlugin() {
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
  };
}
