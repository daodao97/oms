import { Router } from 'vue-router'
import store from '../../store'
import { RemoteModule, OmsModule } from '../../types'
import { transRemoteModules } from '../remote'
import Layout from '../../scaffold/layout/index.vue'

function isLodeRemoteRoutes(): boolean {
  return store.state.user.isLodeRemoteRoutes
}

function getWhiteRoutes() {
  return store.state.settings.whiteRoutes
}

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
    const data = await store.dispatch('user/info')
    console.log(1111, data)
    const remoteRoute: RemoteModule[] = await store.dispatch('user/loadRemoteRoutes')
    const routeModules: OmsModule[] = transRemoteModules(remoteRoute)
    routeModules.forEach(item => {
      item.routes.forEach(each => {
        router.addRoute({
          path: '/',
          component: Layout,
          children: [each]
        })
      })
    })
    router.addRoute({ path: '/:catchAll(.*)', redirect: '/404', hidden: true })
    store.commit('user/updateRemoteRouter', routeModules)
    await router.replace(to.path)
    next()
  })
}
