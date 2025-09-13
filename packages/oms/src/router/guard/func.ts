import { pinia, useUserStore, useSettingsStore } from '../../store'

export function isLodeRemoteRoutes(): boolean {
  return useUserStore(pinia).isLodeRemoteRoutes
}

export function getWhiteRoutes(): Array<string | RegExp> {
  return useSettingsStore(pinia).whiteRoutes || []
}

export function getToken() {
  return useUserStore(pinia).token
}
