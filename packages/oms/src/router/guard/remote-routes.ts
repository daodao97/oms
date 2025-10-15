import { Router } from 'vue-router'
import { pinia, useUserStore } from '../../store'
import { OmsModule, RemoteModule } from '../../types'
import { transRemoteModules } from '../remote'
import Layout from '../../scaffold/layout/index.vue'
import { getWhiteRoutes, isLodeRemoteRoutes } from './func'
import { filterRoutesByRole } from '../permission'
import { getRolesFromJwt, getToken } from '../../utils'

export default function(router: Router) {
  router.beforeEach(async(to, form, next) => {
    if (getWhiteRoutes().indexOf(to.path) !== -1) {
      next()
      return
    }
    if (isLodeRemoteRoutes()) {
      next()
      return
    }
    const user = useUserStore(pinia)
    await user.info()
    const remoteRoute: RemoteModule[] = await user.loadRemoteRoutes()
    const routeModules: OmsModule[] = transRemoteModules(remoteRoute)
    const userRoles = getRolesFromJwt(getToken())
    const filteredModules: OmsModule[] = routeModules.map(item => {
      const permittedRoutes = filterRoutesByRole(item.routes, userRoles)
      return {
        ...item,
        routes: permittedRoutes
      }
    }).filter(item => item.routes.length > 0)

    filteredModules.forEach(item => {
      item.routes.forEach(each => {
        router.addRoute({
          path: '/',
          component: Layout,
          children: [each]
        })
      })
    })
    router.addRoute({ name: '404', path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
    user.updateRemoteRouter(filteredModules)
    await router.replace(to)
    next()
  })
}
