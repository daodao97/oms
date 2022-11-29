import type { App, Component, Directive } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { OmsOptions, OmsPlugin, UsePlugin } from './types'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { Module } from 'vuex'

import AppComp from './App.vue'
import { startMock, regMockApis } from './mock'
import { instance } from './utils/request'
import { isObject } from '@okiss/utils'
import { VIcon, setUploadHeaderHandle } from '@okiss/vbtf'
import { getToken } from './utils'
import { merge } from 'lodash'

import 'normalize.css/normalize.css'
import './styles/index.scss'
import '@okiss/vbtf/style.css'

import ElementPlus from './plugins/element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import store from './store'
import router from './router'
import * as directives from './directive'
import { defaultOptions } from './default'

export let http: AxiosInstance

export function useHttp(options?: AxiosRequestConfig): AxiosInstance {
  return options ? instance((merge(defaultOptions.axios, options))) : http
}

export function createAdmin(omsOptions?: OmsOptions) {
  const options = merge(defaultOptions, omsOptions)
  const app: App = createApp(AppComp)
  const omsPlugin = createOmsPlugin(options)
  const plugins = options.plugins || []
  plugins.unshift(omsPlugin)
  plugins.forEach(item => {
    regPlugin(app, item)
  })
  if (options?.mock) {
    startMock()
  }
  http = instance(options.axios)
  store.dispatch('setHttp', http).then()
  store.dispatch('settings/updateSettings', omsOptions?.settings).then()
  app.config.globalProperties.$http = http
  app.config.globalProperties.$router = router
  window.App = app
  window.OmsOptions = options
  setUploadHeaderHandle(() => {
    return {
      'X-Token': getToken()
    }
  })
  router.isReady().then(() => app.mount('#app'))
}

function regComponents(app: App, components: Record<string, Component> = {}) {
  Object.keys(components).forEach((item: string) => {
    app.component(item, components[item])
  })
}

function regRoutes(routes: RouteRecordRaw[] = []) {
  routes.forEach(item => {
    router.addRoute(item)
  })
  store.commit('user/setCustomRoutes', routes)
}

function regUse(app: App, use: UsePlugin[]) {
  use.forEach(item => {
    if (isObject(item)) {
      // @ts-ignore
      item = [item]
    }
    // @ts-ignore
    app.use(...item)
  })
}

function regDirective(app: App, directives: Record<string, Directive> = {}) {
  Object.keys(directives).forEach(item => {
    app.directive(item, directives[item])
  })
}

function regStoreModule(modules: Record<string, Module<any, any>> = {}) {
  const keepModuleNames = ['app', 'settings', 'user']
  Object.keys(modules).forEach(item => {
    if (keepModuleNames.indexOf(item) !== -1) {
      console.warn(`storeModule name [${item}] is use by base, please change it!`)
      return
    }
    store.registerModule(item, modules[item])
  })
}

export function regPlugin(app: App, plugin: OmsPlugin) {
  regComponents(app, plugin.components || {})
  regRoutes(plugin.routes || [])
  regUse(app, plugin.use || [])
  regDirective(app, plugin.directives || {})
  regStoreModule(plugin.storeModules || {})
  regMockApis(plugin.mockApis || [])
}

export function createOmsPlugin(options: OmsOptions): OmsPlugin {
  return {
    components: { VIcon },
    directives: directives,
    use: [
      store,
      router,
      [ElementPlus, { locale, ...options.settings?.ElementPlus }]
    ]
  }
}
