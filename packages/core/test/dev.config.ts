import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      oms: '../src'
    }
  },
  server: {
    open: true,
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [vue(), vueJsx()]
})