import { defineStore } from 'pinia'
import { App, PageSchema, Sidebar } from '../types'
import Cookies from 'js-cookie'

export const appState: App = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!Cookies.get('sidebarStatus') : true,
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
      Cookies.set('sidebarStatus', this.sidebar.opened ? '1' : '0')
    },
    CLOSE_SIDEBAR(withoutAnimation: boolean) {
      Cookies.set('sidebarStatus', '0')
      this.sidebar.opened = false
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
