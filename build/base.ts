import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import fs from 'fs'
import visualizer from 'rollup-plugin-visualizer'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'

const pkg = process.env.pkg

export const ROOT = path.resolve(__dirname, '../packages/' + pkg)
export const SRC = path.resolve(ROOT, 'src')
export const DEV = path.resolve(ROOT, 'dev')
const autoImports = path.resolve(ROOT, 'auto-imports.d.ts')
const _export = process.env.EXPORT === 'true'

export const resolve = {
  alias: {
    '@': SRC
  }
}

export const plugins = [
  vue(),
  vueJsx(),
  svgLoader(),
  AutoImport({
    dts: autoImports,
    imports: [
      'vue'
    ],
    resolvers: [ElementPlusResolver()]
  }),
  Components({
    resolvers: [ElementPlusResolver()]
  }),
  _export ? visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true
  }) : null
]

export const pkgJson = () => JSON.parse(fs.readFileSync(path.resolve(ROOT, 'package.json'), 'utf8').toString())

export const firstUpperCase = ([first, ...rest]: string) => first.toUpperCase() + rest.join('')
