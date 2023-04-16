import { App, Plugin } from 'vue'
import { ElDialog, ElSwitch } from 'element-plus'

export { regCustomFormComps, customFormComps, getComponentName, setUploadHeaderHandle } from './util'
export type { FormProps } from './types'

import VForm from './index.vue'
const install: Exclude<Plugin['install'], undefined> = function install(app: App) {
  app.component('VForm', VForm)
  app.component(ElDialog.name, ElDialog)
  app.component(ElSwitch.name, ElSwitch)
}

export default install

