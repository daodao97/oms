import { defineConfig } from 'vite'
import path from 'path'
import { ROOT, resolve, plugins, pkgJson, firstUpperCase } from './base'

export const external = (): Array<RegExp> => {
  const tmp: Array<RegExp> = []
  Object.keys(pkgJson()['dependencies']).forEach(key => {
    tmp.push(new RegExp('^' + key))
  })
  return tmp
}

const libName = () => {
  const token = pkgJson()['name'].split('/')
  const parts = token[token.length - 1].split('-')
  return parts.map((e: string) => firstUpperCase(e)).join('')
}

export default defineConfig({
  resolve,
  plugins,
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import'],
        quietDeps: true
      }
    }
  },
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log', 'console.debug', 'console.trace']
  },
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(ROOT, 'src/index.ts'),
      name: libName(),
      formats: ['es'],
      fileName: (format: string) => `index.${format}.js`
    },
    sourcemap: true,
    rollupOptions: {
      external: [...external(), new RegExp('^dayjs')],
      output: {
        globals: {
          vue: 'Vue'
        },
        inlineDynamicImports: true,
        exports: 'named'
      }
    }
  }
})
