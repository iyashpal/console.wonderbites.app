import { defineStore } from 'pinia'

const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebar: false,
  }),

  getters: {
    isSidebarEnabled: (state) => state.sidebar,
  },

  actions: {
    toggleSidebar (payload) {
      this.sidebar = payload ? payload : !this.sidebar
    },
  },
})

export default useLayoutStore
