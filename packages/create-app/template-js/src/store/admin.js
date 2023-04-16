export const store = {
  test: 'default_test'
}

const _module = {
  namespaced: true,
  state: store,
  mutations: {
    TEST: (state, val) => {
      state.test = val
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TEST', 'abc')
    }
  }
}

export default _module
