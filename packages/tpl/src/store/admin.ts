import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    test: 'default_test'
  }),
  actions: {
    toggleSideBar() {
      this.test = 'abc'
    }
  }
})

export default useAdminStore
