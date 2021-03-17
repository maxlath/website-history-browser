// Adapted from https://github.com/sveltejs/template/tree/5de3d089
// via https://gitlab.com/kanthaus/task-lottery/-/blob/main/rollup.config.js

import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-css-only'

const production = !process.env.ROLLUP_WATCH

const build = (entry, dest) => {
  return {
    input: entry,
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'main',
      file: dest
    },
    plugins: [
      svelte({
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production
        }
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: 'bundle.css' }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: [ 'svelte' ]
      }),

      commonjs(),
    ],
    watch: {
      clearScreen: false
    }
  }
}

export default [
  build('src/main.js', 'extension/main.js'),
  build('src/background.js', 'extension/background.js'),
]
