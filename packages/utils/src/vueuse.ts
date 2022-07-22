export function globalVariables(): Record<string, any> {
  const app = getCurrentInstance()
  return app?.appContext.config.globalProperties || {}
}
