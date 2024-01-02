import { defineConfig } from 'tsup';
import { basename, join } from 'node:path';
import { readdir } from 'node:fs/promises';
import AdmZip from 'adm-zip';
import * as pkg from '../package.json';

const zip = async (input: string, output: string) => {
  const zip = new AdmZip();
  await zip.addLocalFolderPromise(input, {});
  await zip.writeZipPromise(output);
};

const unzip = (input: string, output: string) => {
  const unzip = new AdmZip(input);
  return unzip.extractAllTo(output, true);
};

const versions = async () => {

  const cwd = process.cwd();
  const { version } = pkg;
  const beta = /-beta\.\d$/.test(version);
  const name = beta ? version.replace(/\.\d-beta\.\d$/, 'x-beta') : version.replace(/\.\d$/, 'x');
  const dir = join(cwd, 'version', `${name}`);
  const files = await readdir(join(cwd, 'version'));

  await zip(join(cwd, 'version'), `${dir}.zip`);

  console.log(`\x1b[36mZIP\x1b[39m version \x1b[1m${name}\x1b[22m copied into \x1b[1mversion\x1b[22m`);

  for (const file of files) {
    if (file.endsWith('.zip')) {
      console.log(file);
      const base = basename(file, '.zip');
      unzip(join(cwd, 'version', file), join(cwd, 'public/v', base));
      console.log(`\x1b[36mZIP\x1b[39m created \x1b[1mv/${base}\x1b[22m in \x1b[1mpublic\x1b[22m`);
    }
  }

};

export default defineConfig({
  entry: [
    'src/app/bundle.ts'
  ],
  outDir: 'public',
  outExtension (ctx) {
    return { js: '.min.js' };
  },
  async onSuccess () {
    if (typeof this.env === 'object' && this.env.NODE_ENV === 'production') {
      await versions();
    }
  },
  clean: false,
  format: [ 'iife' ],
  treeshake: true,
  platform: 'browser'
});
