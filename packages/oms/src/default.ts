import locale from 'element-plus/lib/locale/lang/zh-cn'
import { AxiosRequestConfig } from 'axios'
import { OmsOptions } from './types'
import { Settings } from './types'

const defaultAxios: AxiosRequestConfig = {
  baseURL: '/api',
  withCredentials: true,
  timeout: 5000
}

export const defaultSettings: Settings = {
  title: 'oms',
  fixedHeader: false,
  sidebarLogo: true,
  logo: 'http://assest.daodao.run/logo.png',
  closeNavNotice: false,
  navBarNotice: '',
  hasNewMessage: true,
  showPageJsonSchema: true,
  loginTips: '',
  sso: {},
  ElementPlus: {
    size: 'default',
    zIndex: 3000,
    locale: locale
  },
  nav: [],
  whiteRoutes: ['/login'],
  tokenExpire: 7 * 24 * 60 * 60 * 1000,
  defaultAvatar: 'http://assest.daodao.run/avatar.jpg'
}

export const defaultOptions: OmsOptions = {
  axios: defaultAxios,
  settings: defaultSettings,
  plugins: [],
  mock: false
}
