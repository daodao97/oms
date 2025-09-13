import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  js.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: { vue },
    rules: {
      ...vue.configs['vue3-recommended'].rules
    }
  }
]

