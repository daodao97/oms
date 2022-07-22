import { ActionContext, Module } from 'vuex'

interface Store {
  test : string
}

export const store: Store = {
  test: 'default_test'
}

const _module: Module<Store, any> = {
  namespaced: true,
  state: store,
  mutations: {
    TEST: (state: Store, val) => {
      state.test = val
    }
  },
  actions: {
    toggleSideBar({ commit }: ActionContext<Store, Store>) {
      commit('TEST', 'abc')
    }
  }
}

export default _module
