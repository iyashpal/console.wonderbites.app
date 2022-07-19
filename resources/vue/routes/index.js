import { createRouter, createWebHistory } from 'vue-router'


const Router = createRouter({
    
    history: createWebHistory('/'),

    routes: require('./WebRoutes').default

})




export default Router
