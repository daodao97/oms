import { NavigationGuardNext } from 'vue-router'
import type { LoginTicket } from '@/types'

export type SsoType = 'jump' | 'qrcode'

export interface Sso {
    flag(): LoginTicket | undefined,

    type: SsoType,

    jumpToLoginPage(next: NavigationGuardNext, path: string): void,

    showQrCode(): void

    qrCodeUrl?: string,
    appid?: string,
    style?: string,
    redirectUri?: string,
    elId?: string
}

export class BaseSso implements Sso {
  type: SsoType = 'qrcode'

  flag(): LoginTicket | undefined {
    return undefined
  }

  jumpToLoginPage(next: NavigationGuardNext, path: string): void {
    next(path)
  }

  showQrCode(): void {
  }
}
