import { defineConfig, loadEnv, ServerOptions } from 'vite'
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
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'

const _export = process.env.EXPORT === 'true'

const pkgJson = () => JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8').toString())

const external = () : Record<string, string[]> => {
  const tmp : Record<string, string[]> = {}
  Object.keys(pkgJson()['dependencies']).forEach(key => {
    const _key = key.replace('/', '_').replace('@', '')
    tmp[_key] = [key]
  })
  return tmp
}

const pkg : Record<string, string[]> = {
  xlsx: ['xlsx'],
  echarts: ['echarts'],
  lodash: ['lodash'],
  ...external()
}

const ordered = Object.keys(pkg).sort((a, b) => b.length - a.length).reduce<Record<string, string[]>>(
  (obj, key) => {
    obj[key] = pkg[key]
    return obj
  },
  {}
)

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
          manualChunks: ordered
        }
      }
    },
    plugins: [
      ...plugins,
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
      })()
    ]
  })
}
