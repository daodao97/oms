import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import visualizer from 'rollup-plugin-visualizer'
import svgLoader from 'vite-svg-loader'
import fs from 'fs'
import { createRequire } from 'module'

const pkg = process.env.pkg

export const ROOT = path.resolve(__dirname, '../packages/' + pkg)
export const SRC = path.resolve(ROOT, 'src')
export const DEV = path.resolve(ROOT, 'dev')
const autoImports = path.resolve(ROOT, 'auto-imports.d.ts')
const components = path.resolve(ROOT, 'components.d.ts')
const _export = process.env.EXPORT === 'true'

const VBTFSrc = path.resolve(__dirname, '../packages/vbtf/src')
const VBTFCss = path.resolve(__dirname, '../packages/vbtf/dist/style.css')
const EMPTYCSS = path.resolve(__dirname, './empty.css')
const VBTFCssAlias = fs.existsSync(VBTFCss) ? VBTFCss : EMPTYCSS
const UtilsSrc = path.resolve(__dirname, '../packages/utils/src')
const require_ = createRequire(import.meta.url)
let CRYPTO_JS = ''
let CRYPTO_JS_MD5 = ''
try {
  CRYPTO_JS = require_.resolve('crypto-js')
  CRYPTO_JS_MD5 = require_.resolve('crypto-js/md5')
} catch {}

const alias: Array<{ find: string | RegExp; replacement: string }> = [
  { find: '@', replacement: SRC },
  { find: '@okiss/vbtf/style.css', replacement: VBTFCssAlias }
]
if (fs.existsSync(VBTFSrc)) alias.push({ find: '@okiss/vbtf', replacement: VBTFSrc })
if (fs.existsSync(UtilsSrc)) alias.push({ find: '@okiss/utils', replacement: UtilsSrc })
if (CRYPTO_JS) alias.push({ find: 'crypto-js', replacement: CRYPTO_JS })
if (CRYPTO_JS_MD5) alias.push({ find: 'crypto-js/md5', replacement: CRYPTO_JS_MD5 })

export const resolve = { alias }

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
    dts: components,
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
