import { defineConfig } from 'vite'

import { resolve, DEV, plugins } from './base'

export default defineConfig({
  root: DEV,
  resolve,
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8787',
        changeOrigin: true,
        // rewrite: path => path.replace(RegExp('/api'), '')
      }
    }
  },
  plugins
})
