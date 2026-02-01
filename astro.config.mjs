import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";

// See configuration guide: https://astro.build/config
export default defineConfig({
  site: 'https://vanpop.ca',
  integrations: [mdx(), sitemap(), robotsTxt()],
  vite: {
    plugins: [tailwindcss()]
  },
  output: "static"
});