import { defineStore } from 'pinia'
import { Settings } from '../../types'
import { defaultSettings } from '../../default'
import { cloneDeep, merge } from 'lodash'

export const settings: Settings = cloneDeep(defaultSettings)

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({ ...settings }),
  actions: {
    updateSettings(newSettings: Settings) {
      // merge into reactive state
      merge(this, newSettings)
    }
  }
})

export default useSettingsStore
