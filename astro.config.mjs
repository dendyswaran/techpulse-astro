import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://techpulse-astro.vercel.app',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  },
});
