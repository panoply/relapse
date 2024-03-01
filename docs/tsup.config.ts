import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/app/bundle.ts'
  ],
  outDir: 'public',
  outExtension (ctx) {
    return { js: '.min.js' };
  },
  clean: false,
  format: [ 'iife' ],
  treeshake: true,
  platform: 'browser'
});
