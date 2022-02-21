import { createApp } from 'vue'
import { createStore } from 'vuex'


const Store = createStore({
    state: {
        // 
    },


    modules: {
        layout: require('./modules/layout').default
    }
})




export default Store
