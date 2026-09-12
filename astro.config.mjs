// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://leodvlpr.github.io',
  base: '/SEDT-porfolio/',
  integrations: [tailwindcss()],
  vite: {
    plugins: [tailwindcss()]
  }
});