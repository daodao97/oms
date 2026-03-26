import { createApp, watch, type App, type Component, type Directive } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'
import type { OmsOptions, OmsPlugin, UsePlugin } from './types'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
// Vuex Module removed in Pinia migration

import AppComp from './App.vue'
import { startMock, regMockApis } from './mock'
import { instance } from './utils/request'
import { isObject } from '@okiss/utils'
import { VIcon, setUploadHeaderHandle } from '@okiss/vbtf'
import { getRolesFromJwt, getToken } from './utils'
import { merge } from 'lodash'

import 'normalize.css/normalize.css'
import './styles/index.scss'
import '@okiss/vbtf/style.css'

import ElementPlus from './plugins/element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { setupStore, pinia, useAppStore, useSettingsStore, useUserStore, setHttp } from './store'
import { resolveOmsRouter, setActiveOmsRouter } from './router'
import { filterRoutesByRole } from './router/permission'
import * as directives from './directive'
import { defaultOptions } from './default'

export let http: AxiosInstance

interface RouteState {
  pendingRoutes: RouteRecordRaw[]
  registeredRouteKeys: Set<string>
}

const routeStateMap = new WeakMap<Router, RouteState>()

const getRouteKey = (route: RouteRecordRaw): string => {
  if (route.path === '/' && !route.name && route.children && route.children.length === 1) {
    const child = route.children[0]
    return typeof child.name === 'string' ? `layout:${child.name}` : `layout:${child.path}`
  }
  return typeof route.name === 'string' ? route.name : route.path
}

function normalizePluginRoute(route: RouteRecordRaw): RouteRecordRaw {
  const normalized = { ...route }
  const isLayoutRoot = normalized.path === '/' && Array.isArray(normalized.children)
  if (isLayoutRoot) {
    return normalized
  }
  return {
    path: '/',
    children: [normalized]
  }
}

function getRouteState(router: Router): RouteState {
  let state = routeStateMap.get(router)
  if (!state) {
    state = {
      pendingRoutes: [],
      registeredRouteKeys: new Set<string>()
    }
    routeStateMap.set(router, state)
  }
  return state
}

export function useHttp(options?: AxiosRequestConfig): AxiosInstance {
  return options ? instance((merge(defaultOptions.axios, options))) : http
}

export function createAdmin(omsOptions?: OmsOptions) {
  const options = merge(defaultOptions, omsOptions)
  const router = resolveOmsRouter(options.router)
  const app: App = createApp(AppComp)
  const omsPlugin = createOmsPlugin(options, router)
  const plugins = options.plugins || []
  plugins.unshift(omsPlugin)
  plugins.forEach(item => {
    regPlugin(app, item, router)
  })
  if (options?.mock) {
    startMock()
  }
  http = instance(options.axios)
  // install pinia
  setupStore(app)
  const appStore = useAppStore(pinia)
  const settingsStore = useSettingsStore(pinia)
  const userStore = useUserStore(pinia)
  setHttp(http)
  settingsStore.updateSettings(omsOptions?.settings || {})
  appStore.setBaseAPI(options?.axios.baseURL as any)
  app.config.globalProperties.$http = http
  app.config.globalProperties.$router = router
  setActiveOmsRouter(router)
  window.App = app
  window.OmsOptions = options
  setUploadHeaderHandle(() => {
    return {
      'X-Token': getToken()
    }
  })
  watch(() => userStore.token, () => {
    syncRoutesWithRoles(router)
  }, { immediate: true })
  router.isReady().then(() => app.mount('#app'))
}

function regComponents(app: App, components: Record<string, Component> = {}) {
  Object.keys(components).forEach((item: string) => {
    app.component(item, components[item])
  })
}

function syncRoutesWithRoles(router: Router) {
  const routeState = getRouteState(router)
  const userRoles = getRolesFromJwt(getToken())
  const permittedRoutes = filterRoutesByRole(routeState.pendingRoutes, userRoles)
  const userStore = useUserStore(pinia)
  const existedKeys = new Set(userStore.customRouter.map(item => getRouteKey(item)))
  const newRoutes = permittedRoutes.filter(route => {
    const key = getRouteKey(route)
    if (routeState.registeredRouteKeys.has(key) || existedKeys.has(key)) {
      return false
    }
    routeState.registeredRouteKeys.add(key)
    return true
  })
  newRoutes.forEach(item => {
    router.addRoute(item)
  })
  if (newRoutes.length) {
    userStore.setCustomRoutes(newRoutes)
  }
}

function regRoutes(router: Router, routes: RouteRecordRaw[] = []) {
  getRouteState(router).pendingRoutes.push(...routes.map(normalizePluginRoute))
  syncRoutesWithRoles(router)
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

function regStoreModule(modules: Record<string, any> = {}) {
  const keepModuleNames = ['app', 'settings', 'user']
  Object.keys(modules).forEach(item => {
    if (keepModuleNames.indexOf(item) !== -1) {
      console.warn(`storeModule name [${item}] is use by base, please change it!`)
      return
    }
    // Pinia does not support dynamic Vuex-style module registration
    console.warn('[store] plugin storeModules are not supported under Pinia. Ignored:', item)
  })
}

export function regPlugin(app: App, plugin: OmsPlugin, router: Router = resolveOmsRouter()) {
  regComponents(app, plugin.components || {})
  regRoutes(router, plugin.routes || [])
  regUse(app, plugin.use || [])
  regDirective(app, plugin.directives || {})
  regStoreModule(plugin.storeModules || {})
  regMockApis(plugin.mockApis || [])
}

export function createOmsPlugin(options: OmsOptions, router: Router = resolveOmsRouter(options.router)): OmsPlugin {
  return {
    components: { VIcon },
    directives: directives,
    use: [
      router,
      [ElementPlus, { locale: zhCn, ...options.settings?.ElementPlus }]
    ]
  }
}
