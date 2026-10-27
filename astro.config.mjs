import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://techpulsenews.tech',
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
