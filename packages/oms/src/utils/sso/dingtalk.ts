import { getQueryParam, obj2Param, strVarReplace, createIFrame } from '@okiss/utils'
import { BaseSso, SsoType } from './index'
import type { LoginTicket } from '@/types'

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

  flag(): LoginTicket | undefined {
    const code = getQueryParam('code')
    if (code) {
      return {
        ticket: code,
        key: 'dingtalk'
      }
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
