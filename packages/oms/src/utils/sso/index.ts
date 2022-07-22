import { NavigationGuardNext } from 'vue-router'
import { getQueryParam, obj2Param, strVarReplace, createIFrame } from '@okiss/utils'
import store from '../../store'
import { newSso } from '../../types'
import { merge } from 'lodash'

export type SsoType = 'jump' | 'qrcode'

export interface Sso {
    flag(): string | undefined,

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

  flag(): string | undefined {
    return undefined
  }

  jumpToLoginPage(next: NavigationGuardNext, path: string): void {
    next(path)
  }

  showQrCode(): void {
  }
}

export class DingTalk extends BaseSso {
  type: SsoType = 'qrcode'
  qrCodeUrl = 'https://login.dingtalk.com/login/qrcode.htm?goto={goto}&style={style}'
  reloadUrl = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?response_type=code&scope=snsapi_login&state=&appid={appid}&redirect_uri={redirect_uri}'

  elId: string = ''
  appid: string = ''
  iframe: HTMLIFrameElement = new HTMLIFrameElement()
  redirectUri: string = ''
  style: string = ''

  constructor(options: Record<string, any>) {
    super()
  }

  flag(): string | undefined {
    const code = getQueryParam('code')
    if (code) {
      return code
    }
    return undefined
  }

  showQrCode(): void {
    const getReloadUrl = (extra?: Record<string, any>) => {
      const data = {
        appid: this.appid,
        redirect_uri: encodeURIComponent(this.redirectUri)
      }
      return strVarReplace(this.reloadUrl, data) + '&' + obj2Param(extra || {})
    }
    const getQrCodeUrl = () => {
      const data = {
        goto: encodeURIComponent(getReloadUrl()),
        style: encodeURIComponent(this.style)
      }
      return strVarReplace(this.qrCodeUrl, data)
    }
    const onScanSuccess = (event: any) => {
      const { origin, data } = event
      if (origin === 'https://login.dingtalk.com') {
        window.location.href = getReloadUrl({ loginTmpCode: data })
      }
    }

    this.iframe.src = getQrCodeUrl()
    createIFrame({ elId: this.elId, attrs: this.iframe })
    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener(
        'message',
        event => onScanSuccess(event),
        false
      )
      // @ts-ignore
    } else if (typeof window.attachEvent !== 'undefined') {
      // @ts-ignore
      window.attachEvent('onmessage', event => this.onScanSuccess(event))
    }
  }
}

const defaultSso: Record<string, newSso> = {
  'dingtalk': p => new DingTalk(p)
}

export function allSso(): Record<string, newSso> {
  return merge<Record<string, newSso>, Record<string, newSso>>(store.state.settings.sso || {}, defaultSso)
}

export default function(options: Record<string, any>): Sso | undefined {
  const sso = allSso()
  const key = store.state.settings.activeSsoKey || ''
  const active = sso[key]
  if (active !== undefined) {
    return active(options)
  }
  return undefined
}

