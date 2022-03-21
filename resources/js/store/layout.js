import { defineStore } from 'pinia'

const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebar: false,
    title: '',
    breadcrumb: [],
  }),

  getters: {
    isSidebarEnabled: (state) => state.sidebar,

    hasBreadcrumb: (state) => !!state.breadcrumb.length,

    backLinkOfBreadcrumb (state) {
      let link = state.breadcrumb.find(({ backlink }) => backlink)

      return link ? link : state.breadcrumb[0]
    },
  },

  actions: {
    leSidebar (payload) {
      this.sidebar = payload ? payload : !this.sidebar
    },

    syncTitle (payload) {
      this.title = payload ? payload : ''
    },

    syncBreadcrumb (payload) {
      this.breadcrumb = payload ? payload : {}
    },
  },

})

export default useLayoutStore
