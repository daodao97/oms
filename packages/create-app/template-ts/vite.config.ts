import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import copy from 'rollup-plugin-copy'
// @ts-ignore
import visualizer from 'rollup-plugin-visualizer'

const plugins = [
  vue(),
  vueJsx()
]

if (process.env.REPORT === 'true') {
  plugins.push(
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  )
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/.pnpm')) {
            const m = id.match(/node_modules\/.pnpm\/([^/]+)/)
            return m ? m[1] : undefined
          }
          if (id.includes('node_modules')) {
            const m = id.match(/node_modules\/([^/]+)/)
            return m ? m[1] : undefined
          }
        }
      },
      plugins: [
        copy({
          targets: [
            {
              src: 'node_modules/monaco-editor/min/vs/**/*',
              dest: 'dist/assets/monaco-editor/vs'
            }
          ],
          hook: 'writeBundle'
        })
      ]
    }
  },
  plugins
})
