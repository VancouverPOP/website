import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";

// See configuration guide: https://astro.build/config
export default defineConfig({
  site: 'https://vanpop.ca',
    integrations: [mdx(), sitemap(), robotsTxt()],
  // This below reverts Astro 7 change to compress whitespace in JSX, similar to what React is doing. Eventually
  // we'd need to update our JSX components to not rely on implicit whitespace like we have now.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()]
  },
  output: "static"
});
