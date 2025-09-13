import type { App } from 'vue'
import { createPinia } from 'pinia'

export const pinia = createPinia()

export function setupStore(app: App<Element>) {
  app.use(pinia)
}

export * from './modules/user'
export * from './modules/app'
export * from './modules/settings'
export * from './modules/builderSchema'
export * from './http'

export default pinia
