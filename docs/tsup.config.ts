import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
   'src/assets/scripts/bundle.ts'
  ],
  outDir: 'public',
  outExtension(ctx) {
    return {
      js: '.min.js'
    }
  },
  clean: false,
  format: ['iife'],
  treeshake: true,
  minify: 'terser',
  platform: 'browser',
})