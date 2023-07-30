import { NavigationGuardNext } from 'vue-router'
import { BaseSso, SsoType } from './index'
import { getQueryParam } from '@okiss/utils'
import type { LoginTicket } from '@/types'

export class Github extends BaseSso {
  type: SsoType = 'jump'

  client_id: string = ''

  constructor(options: Record<string, any>) {
    super()
    this.client_id = options.client_id
  }

  flag(): LoginTicket | undefined {
    const code = getQueryParam('code')
    if (code) {
      return {
        ticket: code,
        key: 'github'
      }
    }
    return undefined
  }

  jumpToLoginPage(next: NavigationGuardNext, path: string) {
    const redirect = encodeURIComponent(location.href)
    location.replace(`https://github.com/login/oauth/authorize?client_id=${this.client_id}&redirect_uri${redirect}`)
  }
}
