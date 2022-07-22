import { ActionContext, Module } from 'vuex'
import { RootState, strOrNum, User } from '../types'
import { LoginForm, LoginTicket, RemoteModule, UserInfo } from '../../types'
import { ApiResponse } from '../../utils/request/types'
import { getToken, removeToken, setToken } from '../../utils/token'
import { RouteRecordRaw } from 'vue-router'
import Cookies from 'js-cookie'

export const user: User = {
  name: '',
  nickname: '',
  avatar: '',
  token: getToken(),
  customRouter: [],
  remoteRouter: [],
  menuRoutes: [],
  isLodeRemoteRoutes: false,
  resource: {},
  roleIds: [],
  path: ''
}

const userModule: Module<User, any> = {
  namespaced: true,
  state: user,
  mutations: {
    updateToken(state: User, token: string) {
      state.token = token
      setToken(token)
    },
    removeToken(state: User) {
      state.token = ''
      removeToken()
    },
    updateRemoteRouter(state: User, routes: RemoteModule[]) {
      state.remoteRouter = routes
      state.isLodeRemoteRoutes = true
    },
    setCustomRoutes(state: User, routes: RouteRecordRaw[]) {
      state.customRouter = state.customRouter.concat(routes)
    },
    updateState<K extends keyof User>(state: User, { key, value }: { key: K, value: any }) {
      state[key] = value
    },
    resetUser(state: User) {
      state = Object.assign({
        name: '',
        nickname: '',
        avatar: '',
        token: getToken(),
        customRouter: [],
        remoteRouter: [],
        menuRoutes: [],
        isLodeRemoteRoutes: false,
        resource: {},
        roleIds: [],
        path: ''
      })
    }
  },
  actions: {
    login({
      commit,
      state,
      rootState
    }: ActionContext<User, RootState>, data: LoginForm | LoginTicket): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        if (!rootState.http) {
          reject('http client not init')
        } else {
          rootState.http.request<UserInfo, ApiResponse<UserInfo>>({
            url: '/user/login',
            method: 'POST',
            data: data
          }).then((response: ApiResponse<UserInfo>) => {
            commit('updateToken', response.data?.token)
            resolve(true)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    logout({ commit }: ActionContext<User, RootState>) {
      commit('removeToken')
      commit('resetUser')
    },
    info({ commit, rootState }: ActionContext<User, RootState>): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        if (!rootState.http) {
          reject('http client not init')
        } else {
          rootState.http.request<UserInfo, ApiResponse<UserInfo>>({
            url: '/user/info',
            method: 'GET'
          }).then((response: ApiResponse<UserInfo>) => {
            const roleIds: strOrNum[] = response.data?.role_ids || []
            commit('updateState', { key: 'name', value: response.data?.name })
            commit('updateState', { key: 'nickname', value: response.data?.nickname })
            // commit('updateState', { key: 'avatar', value: response.data?.avatar })
            commit('updateState', { key: 'roleIds', value: roleIds })
            // @ts-ignore
            !Cookies.get('username') && Cookies.set('username', response.data?.name)
            resolve(true)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    loadRemoteRoutes({ state, rootState }: ActionContext<User, RootState>): Promise<RemoteModule[]> {
      return new Promise<RemoteModule[]>((resolve, reject) => {
        rootState.http?.request<RemoteModule, ApiResponse<RemoteModule[]>>({
          url: '/user/routes',
          method: 'get'
        }).then((response: ApiResponse<RemoteModule[]>) => {
          if (response.code === 0) {
            const resource: RemoteModule[] = response.data || []
            resolve(resource)
          } else {
            reject('error')
          }
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    }
  }
}

export default userModule
