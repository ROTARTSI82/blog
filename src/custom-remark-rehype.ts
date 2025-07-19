import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';
import type { Code, Html, Text } from "mdast"

export function remarkCustomPlugin() {
  return (tree: Node) => {
    visit(tree, 'code', (node: Code, index: number, parent: Parent) => {
      if (node.lang === 'tikz') {
        const tikzCode = node.value.split('\n')
          .map(line => line.trim()).filter(x => x).join('\n');
        const htmlString = `<div class="blog-tikz-done"><script type="text/tikz">${tikzCode}</script></div>`;

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

export function rehypeCustomPlugin() {
  return (tree: Node) => {
    visit(tree, 'heading', (node: any, index: number, parent: Parent) => {
      // Scaffolding for custom rehype plugin
    });
  };
}

