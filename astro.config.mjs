// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkToc from "remark-toc";

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: "https://students.washington.edu/",
  base: '/granty29/dist/',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMath, remarkToc],
    rehypePlugins: [rehypeKatex]
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), react(), vue()]
});