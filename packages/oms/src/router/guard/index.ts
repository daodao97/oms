import { Router } from 'vue-router'
import nprogress from './nprogress'
import permission from './permission'
import remoteRoutes from './remote-routes'
import setPageTitle from './set-page-title'

export default function(router: Router) {
  permission(router)
  nprogress(router)
  remoteRoutes(router)
  setPageTitle(router)
}
