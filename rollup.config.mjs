import { rollup, plugin, env } from '@sissel/rollup-config';

export default rollup(
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'es',
        name: 'Accordion',
        file: 'package/accordion.esm.js',
        sourcemap: false,
        preferConst: true
      },
      {
        format: 'umd',
        name: 'Accordion',
        file: 'package/accordion.umd.js',
        sourcemap: false,
        preferConst: true
      }
    ],
    treeshake: 'smallest',
    plugins: env.if('dev')([
      plugin.esbuild(),
      plugin.resolve({
        browser: true,
        extensions: [ '.ts', '.js' ]
      }),
      plugin.commonjs({
        extensions: [ '.ts', '.js' ]
      }),
      plugin.copy({
        copyOnce: env.watch,
        onlyFiles: true,
        targets: [
          {
            src: 'stypes/accordion.d.ts',
            dest: 'package/types'
          }
        ]
      })
    ])([
      plugin.esminify(),
      plugin.filesize()
    ])
  }
);
