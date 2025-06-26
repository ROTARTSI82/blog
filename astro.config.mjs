// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';
import rehypeMathjax from 'rehype-mathjax/chtml';
import remarkToc from "remark-toc";
import { remarkCustomPlugin, rehypeCustomPlugin } from './src/custom-remark-rehype';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: "https://students.washington.edu/",
  base: '/granty29/',
  outDir: 'public_html/',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkCustomPlugin, remarkMath, remarkToc],
    rehypePlugins: [
      rehypeCustomPlugin,
      [rehypeMathjax, {
        chtml: {
          scale: 1.2,
          fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
        },
        tex: {
          macros: {
            R: '\\mathbf{R}'
          }
        }
      }]
    ],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), react(), vue()]
});
