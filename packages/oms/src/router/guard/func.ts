import store from '../../store'

export function isLodeRemoteRoutes(): boolean {
  return store.state.user.isLodeRemoteRoutes
}

export function getWhiteRoutes(): Array<string | RegExp> {
  return store.state.settings.whiteRoutes || []
}

export function getToken() {
  return store.state.user.token
}
