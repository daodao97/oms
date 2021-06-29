import { createAdmin } from '@vue-oms/core'
// import * as devtool from '@vue-oms/plugin-devtool'
import settings from './settings'
import '@vue-oms/core/style.css'
// import '@vue-oms/plugin-devtool/style.css'
import app from './app'

const env = import.meta.env

createAdmin({
  config: settings,
  mock: {
    enable: env.VITE_APP_ENABLE_MOCK === 'true',
    baseURI: env.VITE_APP_BASE_API
  },
  plugins: [
    app,
    // devtool
  ]
})
