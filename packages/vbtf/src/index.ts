import { App, Plugin } from 'vue'

import * as vforms from './form/index'
import * as vtables from './table/index'
import * as vbuttons from './button/index'

const components = { ...vforms, ...vtables, ...vbuttons }

const install: Exclude<Plugin['install'], undefined> = function install(app: App) {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component)
  })
}

export default install

export { default as VIcon } from './VIcon'
export { default as VChart } from './vchart/index.vue'
export { default as JsonView } from './jsonview/index.vue'
export * from './form/index'
export * from './table/index'
export * from './button/index'

