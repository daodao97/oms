import { defineStore } from 'pinia'
import { strOrNum, User } from '../types'
import { LoginForm, LoginTicket, RemoteModule, Settings, UserInfo } from '../../types'
import { ApiResponse } from '../../utils/request/types'
import { getToken, removeToken, setToken } from '../../utils/token'
import { RouteRecordRaw } from 'vue-router'
import Cookies from 'js-cookie'
import { getHttp } from '../http'
import { useSettingsStore } from './settings'

export const userState: User = {
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
  path: '',
  env: '',
  expired: false
}

const getRouteKey = (route: RouteRecordRaw): string => {
  return typeof route.name === 'string' ? route.name : route.path
}

export const useUserStore = defineStore('user', {
  state: (): User => ({ ...userState }),
  actions: {
    updateToken(token: string) {
      this.token = token
      setToken(token)
    },
    removeToken() {
      this.token = ''
      removeToken()
    },
    updateRemoteRouter(routes: RemoteModule[]) {
      this.remoteRouter = routes
      this.isLodeRemoteRoutes = true
    },
    setCustomRoutes(routes: RouteRecordRaw[]) {
      const existed = new Set(this.customRouter.map(route => getRouteKey(route)))
      const append = routes.filter(route => !existed.has(getRouteKey(route)))
      if (append.length) {
        this.customRouter = this.customRouter.concat(append)
      }
    },
    updateState<K extends keyof User>({ key, value }: { key: K, value: any }) {
      // @ts-ignore
      this[key] = value
    },
    resetUser() {
      const fresh: User = { ...userState, token: getToken() }
      Object.assign(this, fresh)
    },
    SET_EXPIRED() {
      this.expired = !this.expired
    },

    // async actions
    login(data: LoginForm | LoginTicket): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        const http = getHttp()
        if (!http) {
          reject('http client not init')
          return
        }
        http.request<UserInfo, ApiResponse<UserInfo>>({
          url: '/user/login',
          method: 'POST',
          data
        }).then((response: ApiResponse<UserInfo>) => {
          this.updateToken(response.data?.token || '')
          resolve(true)
        }).catch(error => reject(error))
      })
    },
    logout() {
      this.removeToken()
      this.resetUser()
    },
    info(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        const http = getHttp()
        if (!http) {
          reject('http client not init')
          return
        }
        http.request<UserInfo, ApiResponse<UserInfo>>({
          url: '/user/info',
          method: 'GET'
        }).then((response: ApiResponse<UserInfo>) => {
          const roleIds: strOrNum[] = response.data?.role_ids || []
          this.updateState({ key: 'name', value: response.data?.name })
          this.updateState({ key: 'nickname', value: response.data?.nickname })
          this.updateState({ key: 'roleIds', value: roleIds })
          this.updateState({ key: 'env', value: response.data?.env })
          const website = (response.data?.website || {}) as Settings
          useSettingsStore().updateSettings(website)
          // @ts-ignore
          !Cookies.get('username') && Cookies.set('username', response.data?.name)
          // We cannot directly import settings store here without circular concerns in some flows.
          resolve(true)
        }).catch(error => reject(error))
      })
    },
    loadRemoteRoutes(): Promise<RemoteModule[]> {
      return new Promise<RemoteModule[]>((resolve, reject) => {
        const http = getHttp()
        http?.request<RemoteModule, ApiResponse<RemoteModule[]>>({
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
    },
    SetExpired() {
      this.SET_EXPIRED()
    }
  }
})

export default useUserStore
