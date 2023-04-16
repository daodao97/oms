import { createAdmin, isProdMode, setCmp, OmsOptions, regViews } from '@okiss/oms'
import '@okiss/oms/style.css'
import { defineAsyncComponent } from 'vue'
import app from './app'

// register dashboard
setCmp('test', defineAsyncComponent(() => import('./views/dashboard/index.vue')))

// register custom page views
regViews(import.meta.globEager('./views/**/**.vue'))

const options: OmsOptions = {
  mock: true,
  settings: {
    title: 'Admin',
    logo: 'https://gitee.com/daodao97/asset/raw/master/devbox/rxANG9O3lX.png',
    showPageJsonSchema: !isProdMode()
  },
  plugins: [app],
  axios: {
    baseURL: import.meta.env.VITE_BASE_API + ''
  }
}

createAdmin(options)
