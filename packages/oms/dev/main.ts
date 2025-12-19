import { createAdmin, OmsOptions, setCmp, Layout } from '@'
import Test from './views/index.vue'
import Dash from './views/dash.vue'


const app = {
  routes: [
    {
      path: '/',
      component: Layout,
      meta: {
        menuType: 1
      },
      children: [
        {
          path: '/dash',
          name: 'dash',
          component: Dash,
          meta: { title: 'dash', icon: 'el-icon-help', menuType: 2, keepAlive: true },
          role: "root"
        },
      ]
    }
  ]
}

const options: OmsOptions = {
  // mock: true,
  // activeSsoKey: 'dingtalk'
  settings: {
    captcha: false,
    aestheticMode: 'theme1'
  },
  plugins: [app]
}

setCmp('test', Test)

createAdmin(options)
