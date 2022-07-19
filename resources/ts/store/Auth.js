import { defineStore } from 'pinia'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
  }),

  getters: {
    check: (state) => state.user?.id !== undefined,
  },

  actions: {
    syncUser (user) {
      this.user = user
    },
  },
})

export default useAuthStore
