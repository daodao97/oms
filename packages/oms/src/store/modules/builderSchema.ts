/**
 * BuilderSchema
 * 存储pageEditor 编辑模式下时子组件联动相关的状态数据
 */

import { ActionContext, Module } from 'vuex'

import { BuilderSchema } from '../types'

export const builderSchema: BuilderSchema = {
  currentCellItem: {} // form/sub-form 当前单元格编辑数据
}

const builderSchemaModule: Module<BuilderSchema, any> = {
  namespaced: true,
  state: builderSchema,
  mutations: {
    SET_CURRENT_CELLITEM: (state: BuilderSchema, data: Record<string, any>) => {
      state.currentCellItem = data
    }
  },
  actions: {
    setCurrentCellItem({ commit }: ActionContext<BuilderSchema, BuilderSchema>, data: Record<string, any>) {
      commit('SET_CURRENT_CELLITEM', data)
    }
  }
}

export default builderSchemaModule
