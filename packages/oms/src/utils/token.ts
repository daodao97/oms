import Cookies from 'js-cookie'
import { pinia, useSettingsStore } from '../store'

const TokenKey = 'oms:token'

export function getToken(): string {
  return Cookies.get(TokenKey) || ''
}

export function setToken(token: string) {
  const settings = useSettingsStore(pinia)
  const expires = new Date(new Date().getTime() + (settings.tokenExpire || 24 * 60 * 60 * 1000))
  return Cookies.set(TokenKey, token, { expires })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
