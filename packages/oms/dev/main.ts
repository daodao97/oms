import { createAdmin, OmsOptions, setCmp } from '@'
import Test from './views/index.vue'

const options: OmsOptions = {
  mock: true
  // activeSsoKey: 'dingtalk'
}

setCmp('test', Test)

createAdmin(options)
