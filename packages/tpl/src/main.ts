import { createAdmin, setCmp, regViews, OmsOptions, OmsPlugin } from '@okiss/oms'
import '@okiss/oms/style.css'
import { defineAsyncComponent } from 'vue'
import { MySSO } from './util/sso'
import { merge } from 'lodash'
import { routes } from './router'
import { admin } from './store'

setCmp('test', defineAsyncComponent(() => import('./views/dashboard/index.vue')))

regViews(import.meta.globEager('./views/**/**.vue'))

const myapp : OmsPlugin = {
  routes: routes,
  storeModules: { admin }
}

const env = import.meta.env

const isProdMode = env.PROD

const options: OmsOptions = {
  mock: false,
  settings: {
    title: 'OMS',
    showPageJsonSchema: !isProdMode
  },
  plugins: [myapp],
  axios: {
    baseURL: env.VITE_BASE_API + ''
    // cacheTime: 1000
  },
  form: {
    vsPath: isProdMode ? location.pathname + 'assets/monaco-editor/vs' : 'node_modules/monaco-editor/min/vs'
  }
}

if (isProdMode) {
  options.settings = merge(options.settings, {
    sso: {
      mysso: (p: Record<string, any>) => new MySSO(p)
    },
    activeSsoKey: 'mysso'
  })
}

createAdmin(options)
