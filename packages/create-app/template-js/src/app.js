import { routes } from './router'
import { admin } from './store'
const app = {
  routes: routes,
  storeModules: { admin }
}

export default app
