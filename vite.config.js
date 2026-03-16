import { defineConfig } from 'vite';
import vScrollPlugin from './plugins/vite-plugin-v-scroll.js';

export default defineConfig({
  base: '/v-scroller',
  plugins: [
      vScrollPlugin({
        cssInputPath: 'src/components/v-scroll.css',
        jsOutputPath: 'src/components/v-scroll.css.js'
      })
  ],

  resolve: {
    alias: {
      $: '/src/components'
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