import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import visualizer from 'rollup-plugin-visualizer'
import vueJsx from '@vitejs/plugin-vue-jsx'
import fs from "fs";

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

const external = []
const data = fs.readFileSync('package.json', 'utf8').toString()
Object.keys(JSON.parse(data)['dependencies']).forEach(key => {
  external.push(new RegExp('^' + key))
})

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'OmsPluginDevtool',
      formats: ['umd', 'es']
    },
    sourcemap: false,
    rollupOptions: {
      external: external,
      output: {
        globals: {
          vue: 'Vue',
        }
      }
    }
  },
  plugins: plugins
})
