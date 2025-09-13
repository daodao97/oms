import { defineConfig } from 'vite'

import { resolve, DEV, plugins } from './base'

export default defineConfig({
  root: DEV,
  resolve,
  css: {
    preprocessorOptions: {
      scss: {
        // Silence Sass deprecation warnings at config level
        silenceDeprecations: ['legacy-js-api', 'import'],
        quietDeps: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['@okiss/vbtf', '@okiss/utils'],
    include: ['crypto-js']
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8080',
        changeOrigin: true,
        rewrite: path => path.replace(RegExp('/api'), '/_api')
      }
    }
  },
  plugins
})
