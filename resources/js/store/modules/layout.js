export default {

    namespaced: true,


    state: {

        sidebar: false

    },

    getters: {

        isSidebarEnabled(state) {
            return state.sidebar
        }

    },


    mutations: {
        toggleSidebar(state, payload = false) {
            state.sidebar = payload ? payload : !state.sidebar
        }
    },

    actions: {

        //

    }


}
