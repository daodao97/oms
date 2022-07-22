import { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../../store'

NProgress.configure({ showSpinner: false })

export default function(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start()
    to.preHash = location.hash.replace('#', '')
    next()
  })
  router.afterEach((to) => {
    if (to.matched.length > 0) {
      store.commit('user/updateState', {
        key: 'path',
        value: to.matched[to.matched.length - 1].path.replace('(\\d+)', '')
      })
    }
    NProgress.done()
  })
}
