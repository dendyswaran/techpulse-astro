import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.techpulsenews.tech',
  trailingSlash: 'never',
  compressHTML: true,
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
