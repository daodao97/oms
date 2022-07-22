import type { App } from 'vue'
import user from './modules/user'
import settings from './modules/settings'
import app from './modules/app'
import builderSchema from './modules/builderSchema'
import { ActionContext, createStore } from 'vuex'
import { RootState } from './types'
import { AxiosInstance } from 'axios'

const store = createStore<RootState>({
  state: undefined,
  getters: {
    http: state => state.http,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    nickname: state => state.user.nickname,
    remoteRouter: state => state.user.remoteRouter,
    customRouter: state => state.user.customRouter,
    nav: state => state.settings.nav,
    builderSchema: state => state.app.builderSchema,
    currentCellItem: state => state.builderSchema.currentCellItem
  },
  mutations: {
    setHttp(state: RootState, http: AxiosInstance) {
      state.http = http
    }
  },
  actions: {
    setHttp({ commit, state }: ActionContext<RootState, any>, http: AxiosInstance) {
      commit('setHttp', http)
    }
  },
  modules: {
    user,
    settings,
    app,
    builderSchema
  }
})

export function setupStore(app: App<Element>) {
  app.use(store)
}

export default store
