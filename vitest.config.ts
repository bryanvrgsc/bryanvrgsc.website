import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  // Transform avif/image imports to return an object with a src property
  // (mirrors the Astro image import shape used in constants)
  plugins: [
    {
      name: 'mock-astro-image-assets',
      transform(_code, id) {
        if (/\.(avif|png|jpe?g|webp|gif|svg)$/.test(id)) {
          const ext = id.split('.').pop()?.toLowerCase() ?? 'png';
          const format = ext === 'jpg' ? 'jpeg' : ext;
          return {
            code: `export default { src: ${JSON.stringify(id)}, width: 1, height: 1, format: ${JSON.stringify(format)} };`,
            map: null,
          };
        }
      },
    },
  ],
});
