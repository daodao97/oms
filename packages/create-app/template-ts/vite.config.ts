import { defineConfig, loadEnv, ServerOptions, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import copy from 'rollup-plugin-copy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'
// @ts-ignore
import visualizer from 'rollup-plugin-visualizer'
// @ts-ignore
import path from 'path'

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
  splitVendorChunkPlugin(),
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

export default ({ mode }: any) => {
  const env = { ...baseEnv, ...process.env, ...loadEnv(mode, process.cwd()) }
  const server : ServerOptions = {
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
}
