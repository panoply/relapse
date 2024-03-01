import { defineConfig } from 'tsup';
import * as pkg from './package.json';
import { utimes } from 'node:fs/promises';

export default defineConfig({
  entry: [
    './src/index.ts'
  ],
  clean: false,
  format: [ 'esm', 'iife' ],
  treeshake: 'smallest',
  globalName: 'relapse',
  target: 'es6',
  minify: process.env.production ? 'terser' : false,
  minifyIdentifiers: true,
  minifySyntax: true,
  platform: 'browser',

  define: {
    VERSION: `"${pkg.version}"`
  },
  async onSuccess () {
    const time = new Date();
    await utimes('./docs/src/app/bundle.ts', time, time);
    return undefined;
  }
});
