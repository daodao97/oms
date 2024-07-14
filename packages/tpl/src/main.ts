import { createAdmin, setCmp, regViews, OmsOptions, OmsPlugin, Github } from '@okiss/oms'
import '@okiss/oms/style.css'
import { defineAsyncComponent } from 'vue'
import { MySSO } from './util/sso'
import { merge } from 'lodash'
import { routes } from './router'
import { admin } from './store'
import { regCustomFormComps } from '@okiss/vbtf'
import VTest from './components/VTest.vue'

setCmp('dashboard', defineAsyncComponent(() => import('./views/dashboard/index.vue')))

regCustomFormComps({ VTest })
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
  // plugins: [myapp],
  axios: {
    // @ts-ignore
    baseURL: (window?.BASE_URL || env.VITE_BASE_API) + ''
    // cacheTime: 1000
  },
  form: {
    vsPath: isProdMode ? location.pathname + 'assets/monaco-editor/vs' : 'node_modules/monaco-editor/min/vs'
  }
}

// if (isProdMode) {
//   options.settings = merge(options.settings, {
//     sso: {
//       mysso: () => new MySSO({})
//       // github: () => new Github({ client_id: '' })
//     },
//     activeSsoKey: 'mysso'
//   })
// }

createAdmin(options)
