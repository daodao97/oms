import { createAdmin, setCmp, regViews } from '@okiss/oms'
import '@okiss/oms/style.css'
import { defineAsyncComponent } from 'vue'
import app from './app'

// register dashboard
setCmp('test', defineAsyncComponent(() => import('./views/dashboard/index.vue')))

// register custom page views
regViews(import.meta.globEager('./views/**/**.vue'))

const env = import.meta.env
const isProdMode = env.PROD

const options = {
  // mock: true,
  settings: {
    title: 'OmsAdmin',
    showPageJsonSchema: !isProdMode
  },
  plugins: [app],
  axios: {
    baseURL: env.VITE_BASE_API + ''
  }
}

createAdmin(options)
