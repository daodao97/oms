import mitt from 'mitt'
import type { App } from 'vue'

const eventBus = mitt()

const defaultOptions = {
  global: true,
  inject: true,
  globalPropertyName: '$eventBus',
  injectName: '$eventBus'
}

// eventBus.install = install
export default eventBus
export const bus = eventBus

export function install(app: App, options = {}) {
  const opt = {
    ...defaultOptions,
    ...options
  }
  if (opt.global) {
    app.config.globalProperties[opt.globalPropertyName] = eventBus
  }
  if (opt.inject) {
    app.provide(opt.injectName, eventBus)
  }
  return eventBus
}
