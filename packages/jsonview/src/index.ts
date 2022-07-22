import { App } from 'vue'

import JsonView from '@/components/index.vue'

// @ts-ignore
JsonView.install = function install(app: App) {
  app.component('JsonView', JsonView)
}

export default JsonView
