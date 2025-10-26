import { defineStore } from 'pinia'
import { App, PageSchema, Sidebar } from '../types'
import Cookies from 'js-cookie'

const SIDEBAR_STATUS_KEY = 'sidebarStatus'

function getStoredSidebarStatus() {
  if (typeof window === 'undefined')
    return undefined
  const local = window.localStorage.getItem(SIDEBAR_STATUS_KEY)
  if (local !== null)
    return local === '1'
  const cookie = Cookies.get(SIDEBAR_STATUS_KEY)
  if (cookie !== undefined)
    return !!cookie
}

function persistSidebarStatus(opened: boolean) {
  if (typeof window !== 'undefined')
    window.localStorage.setItem(SIDEBAR_STATUS_KEY, opened ? '1' : '0')
  Cookies.set(SIDEBAR_STATUS_KEY, opened ? '1' : '0')
}

export const appState: App = {
  sidebar: {
    opened: getStoredSidebarStatus() ?? true,
    withoutAnimation: false
  },
  device: 'desktop',
  pages: {},
  currentRouteMeta: {},
  builderSchema: {},
  baseURL: ''
}

export const useAppStore = defineStore('app', {
  state: (): App => ({ ...appState }),
  actions: {
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      persistSidebarStatus(this.sidebar.opened)
    },
    CLOSE_SIDEBAR(withoutAnimation: boolean) {
      this.sidebar.opened = false
      persistSidebarStatus(this.sidebar.opened)
      this.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE(device: string) {
      this.device = device
    },
    SET_PAGE_JSON_SCHEMA({ page, json }: PageSchema) {
      this.pages[page] = json
    },
    SET_CURRENT_META(data: Record<string, any>) {
      this.currentRouteMeta = data
    },
    SET_BUILDER_SCHEMA(data: Record<string, any>) {
      this.builderSchema = data
    },
    SET_BASE_API(data: string) {
      this.baseURL = data
    },

    // Vuex-compat method names
    toggleSideBar() { this.TOGGLE_SIDEBAR() },
    closeSideBar({ withoutAnimation }: Sidebar) { this.CLOSE_SIDEBAR(withoutAnimation) },
    toggleDevice(device: string) { this.TOGGLE_DEVICE(device) },
    setPageJsonSchema(data: PageSchema) { this.SET_PAGE_JSON_SCHEMA(data) },
    setCurrentMeta(data: Record<string, any>) { this.SET_CURRENT_META(data) },
    setBuilderSchema(data: Record<string, any>) { this.SET_BUILDER_SCHEMA(data) },
    setBaseAPI(data: string) { this.SET_BASE_API(data) }
  }
})

export default useAppStore
