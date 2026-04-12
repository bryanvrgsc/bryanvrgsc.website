import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  output: 'static',
  site: 'https://bryanvrgsc.com',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-MX',
          en: 'en-US',
        },
      },
    }),
  ],

  vite: {
    plugins: [imagetools()],
    build: {
      cssMinify: 'lightningcss',
    },
    ssr: {
      noExternal: ['@nanostores/react', 'nanostores'],
    },
  },

  server: {
    host: true,
    port: 4321,
  },

  image: {
    domains: ['images.unsplash.com'],
    remotePatterns: [{ protocol: 'https' }],
  },

  env: {
    schema: {
      PUBLIC_FORMSPREE_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_RECAPTCHA_SITE_KEY: envField.string({ context: "client", access: "public", optional: true }),
    },
  },
});
