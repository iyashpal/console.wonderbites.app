import './bootstrap'
import 'Scss/app.scss'
import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { createInertiaApp } from '@inertiajs/inertia-vue3'

createInertiaApp({

  resolve: (TemplateName) => {
    const PageModule = import(`./Pages/${TemplateName}`)

    // By default the layout will be User Layout
    let PageLayout = 'UserLayout'

    // If page namespace starts with "Auth" Use guest layout.
    if (TemplateName.startsWith('Auth')) {
      PageLayout = 'GuestLayout'
    }

    // @ts-ignore
    PageModule.layout = import(`./Layouts/${PageLayout}.vue`)

    return PageModule
  },

  setup: ({ el, app, props, plugin }) => {
    createApp({ render: () => h(app, props) }).use(plugin).use(createPinia()).mount(el)
  },
})
