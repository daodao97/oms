import { createAdmin, OmsOptions, setCmp } from '@'
import Test from './views/index.vue'

const options: OmsOptions = {
  mock: true,
  // activeSsoKey: 'dingtalk'
  settings: {
    captcha: false
  }
}

setCmp('test', Test)

createAdmin(options)
