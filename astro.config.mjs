// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://pet-life-navi.com',
  trailingSlash: 'always',

  build: {
    inlineStylesheets: 'always',
  },

  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});