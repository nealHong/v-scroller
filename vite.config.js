import { defineConfig } from 'vite';
import vScrollPlugin from './plugins/vite-plugin-v-scroll.js';

export default defineConfig({
  plugins: [
      vScrollPlugin({
        cssInputPath: 'src/components/v-scroll.css',
        jsOutputPath: 'dist/v-scroll.css.js'
      })
  ],

  resolve: {
    alias: {
      $: '/dist'
    }
  },

  server: {
    port: 3000,
    open: true
  },

  build: {
    outDir: 'dist',
    sourcemap: true
  }
});