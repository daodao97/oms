import { Router } from 'vue-router'
import store from '../../store'
import { getToken, getWhiteRoutes } from './func'
import sso from '../../utils/sso'
import { isObject } from 'lodash'

export default function(router: Router) {
  router.beforeEach(async(to, form, next) => {
    if (getWhiteRoutes().indexOf(to.path) !== -1) {
      next()
      return
    }

    const token = getToken()
    if (token) {
      if (to.query?.redirect) {
        next(to.query?.redirect as string)
      } else {
        next()
      }
      return
    }
    const redirect = to.query.redirect || to.path

    const s = sso()
    if (!s) {
      next(`/login?redirect=${redirect}`)
      return
    }

    const flag = s.flag()
    if (flag && await store.dispatch('user/login', isObject(flag) ? flag : { ticket: flag })) {
      next()
      return
    }
    s.jumpToLoginPage(next, `/login?redirect=${redirect}`)
  })
}
