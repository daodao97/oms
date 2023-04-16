import { OmsPlugin } from '@okiss/oms'
import { routes } from './router'
import { admin } from './store'
const app : OmsPlugin = {
  routes: routes,
  storeModules: { admin }
}

export default app
