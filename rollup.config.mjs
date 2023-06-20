import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import autoPreprocess from 'svelte-preprocess';
import svelte from 'rollup-plugin-svelte';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import { spawn } from 'child_process';

const production = !process.env.ROLLUP_WATCH;

function typeCheck() {
  let proc;

  function toExit() {
    if (proc) proc.kill(0);
  }

  return {
    writeBundle() {
      if (proc) return;

      spawn('svelte-check', {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    }
  }
}

export default {
  input: './src/main.js',
  output: {
    name: 'app',
    sourcemap: !production,
    format: 'iife',
    file: './dist/bundle.js',
  },
  plugins: [
    typeCheck(),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    svelte({
      preprocess: autoPreprocess(),
      compilerOptions: {
        dev: !production,
      },
    }),
    typescript({ sourceMap: !production }),
    css({ output: 'bundle.css' }),
    production && terser(),
  ],
};
