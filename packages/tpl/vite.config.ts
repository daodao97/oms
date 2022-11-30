import { defineConfig, loadEnv, ServerOptions, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import copy from 'rollup-plugin-copy'
import AutoImport from 'unplugin-auto-import/vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
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
  vueSetupExtend(),
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
  'VITE_BASE': ''
}

export default ({ mode }: any) => {
  const env = { ...baseEnv, ...process.env, ...loadEnv(mode, process.cwd()) }

  const server : ServerOptions = {
    open: true,
    port: 3001,
    proxy: {
      [env.VITE_BASE_API]: {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true,
        rewrite: path => path.replace(RegExp(env.VITE_BASE_API), '')
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
