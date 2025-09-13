import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**', '**/*.d.ts'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }]
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
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

