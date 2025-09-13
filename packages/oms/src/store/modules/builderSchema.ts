/**
 * BuilderSchema
 * 存储pageEditor 编辑模式下时子组件联动相关的状态数据
 */

import { defineStore } from 'pinia'
import { BuilderSchema } from '../types'

export const builderSchemaState: BuilderSchema = {
  currentCellItem: {} // form/sub-form 当前单元格编辑数据
}

export const useBuilderSchemaStore = defineStore('builderSchema', {
  state: (): BuilderSchema => ({ ...builderSchemaState }),
  actions: {
    SET_CURRENT_CELLITEM(data: Record<string, any>) {
      this.currentCellItem = data
    },
    setCurrentCellItem(data: Record<string, any>) {
      this.SET_CURRENT_CELLITEM(data)
    }
  }
})

export default useBuilderSchemaStore
