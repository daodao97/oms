import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { AxiosRequestConfig } from 'axios'
import { OmsOptions } from './types'
import { Settings } from './types'

const defaultAxios: AxiosRequestConfig = {
  baseURL: '/api',
  withCredentials: true,
  cacheEnable: true
}

export const defaultSettings: Settings = {
  title: 'oms',
  fixedHeader: false,
  sidebarLogo: true,
  logo: '',
  closeNavNotice: false,
  navBarNotice: '',
  hasNewMessage: true,
  showPageJsonSchema: false,
  loginTips: '',
  sso: {},
  ElementPlus: {
    size: 'default',
    zIndex: 3000,
    locale: zhCn
  },
  nav: [],
  whiteRoutes: ['/login'],
  tokenExpire: 7 * 24 * 60 * 60 * 1000,
  defaultAvatar: '',
  envColor: {
    'uat': 'gray',
    'pre': 'green'
  },
  serviceOffLineNotice: '当前页面功能正在维护, 请稍后再试~~~',
  formMutex: true,
  captcha: true,
  themeMode: 'light',
  aestheticMode: 'default'
}

export const defaultOptions: OmsOptions = {
  axios: defaultAxios,
  settings: defaultSettings,
  plugins: [],
  mock: false
}
