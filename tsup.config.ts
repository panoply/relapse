import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts'
  ],
  outDir: '.',
  clean: false,
  format: ['esm'],
  treeshake: true,
  minify: 'terser',
  platform: 'browser',
})