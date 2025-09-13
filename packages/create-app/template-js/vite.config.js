import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import fs from 'fs'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'
// @ts-ignore
import visualizer from 'rollup-plugin-visualizer'

const _export = process.env.EXPORT === 'true'

const plugins = [
  vue(),
  vueJsx({ transformOn: true }),
  AutoImport({
    imports: ['vue', 'vue-router'],
    resolvers: [ElementPlusResolver()]
  }),
  Components({
    resolvers: [ElementPlusResolver()]
  }),
  svgLoader(),
  (function copyMonaco(){
    return {
      name: 'copy-monaco-editor',
      apply: 'build',
      closeBundle() {
        const src = path.resolve(process.cwd(), 'node_modules/monaco-editor/min/vs')
        const dest = path.resolve(process.cwd(), 'dist/assets/monaco-editor/vs')
        if (fs.existsSync(src)) {
          fs.mkdirSync(path.dirname(dest), { recursive: true })
          fs.cpSync(src, dest, { recursive: true })
        }
      }
    }
  })(),
  _export ? visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true
  }) : null
]

const baseEnv = {
  'VITE_BASE_API': '/api',
  'VITE_BASE': '',
  'VITE_SERVER_API': 'http://127.0.0.1:8000'
}

export default ({ mode }) => {
  const env = { ...baseEnv, ...process.env, ...loadEnv(mode, process.cwd()) }
  const server = {
    open: true,
    port: 3001,
    proxy: {
      [env.VITE_BASE_API]: {
        target: env.VITE_SERVER_API,
        changeOrigin: true,
        rewrite: path => path.replace(RegExp(env.VITE_BASE_API), ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', env.VITE_SERVER_API)
            proxyReq.setHeader('Referer', env.VITE_SERVER_API + '/')
            console.log(
              'Sending Request:',
              req.method,
              req.url,
              ' => TO THE TARGET =>  ',
              proxyReq.method,
              proxyReq.protocol,
              proxyReq.host,
              proxyReq.path,
              JSON.stringify(proxyReq.getHeaders())
            )
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url,
              JSON.stringify(proxyRes.headers)
            )
          })
        }
      }
    }
  }

  const simpleName = (name) => name.split('@').filter(e => e)[0].replace('_', '-').replace('+', '-')

  return defineConfig({
    base: env.VITE_BASE,
    resolve: {
      dedupe: [
        'vue'
      ],
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
        '@': path.resolve(__dirname, '/src')
      }
    },
    server,
    build: {
      // sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/.pnpm')) {
              const m = id.match(/node_modules\/.pnpm\/([^/]+)/)
              return m ? simpleName(m[1]) : undefined
            }
            if (id.includes('node_modules')) {
              const m = id.match(/node_modules\/([^/]+)/)
              return m ? simpleName(m[1]) : undefined
            }
          }
        }
      }
    },
    plugins
  })
}
