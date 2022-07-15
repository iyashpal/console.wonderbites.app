import './bootstrap'
import 'Scss/app.scss'
import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { createInertiaApp } from '@inertiajs/inertia-vue3'

createInertiaApp({

  resolve: (TemplateName) => {
    const PageModule = import(`./Pages/${TemplateName}`)

    // By default the layout will be User Layout
    PageModule.layout = import('./Layouts/UserLayout.vue')

    // If page namespace starts with "Auth" Use guest layout.
    if (TemplateName.startsWith('Auth')) {
      PageModule.layout = import('./Layouts/GuestLayout.vue')
    }

    return PageModule
  },

  setup: ({ el, App, props, plugin }) => {
    createApp({ render: () => h(App, props) }).use(plugin).use(createPinia()).mount(el)
  },
})
