import { getCurrentInstance } from 'vue'

export function globalProperties() {
  const app = getCurrentInstance()
  return app!.appContext.config.globalProperties
}
