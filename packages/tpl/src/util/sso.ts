import Cookies from 'js-cookie'
import { NavigationGuardNext } from 'vue-router'
import { BaseSso, SsoType } from '@okiss/oms'

export class MySSO extends BaseSso {
  type: SsoType = 'jump'

  constructor(options: Record<string, any>) {
    super()
  }

  flag(): string | undefined {
    return Cookies.get('username')
  }

  jumpToLoginPage(next: NavigationGuardNext, path: string) {
    if (location.origin.includes('localhost')) {
      next('/login')
      return
    }
    const redirect = encodeURIComponent(location.href)
    location.replace(`https://xxx.com&redirect=${redirect}`)
  }
}
