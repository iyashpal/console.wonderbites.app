import './bootstrap'
import 'Scss/app.scss'
import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { UserLayout, GuestLayout } from './Layouts'
import { InertiaProgress } from '@inertiajs/progress'
import { createInertiaApp } from '@inertiajs/inertia-vue3'

createInertiaApp({

  resolve: (TemplateName: string) => import(`./Pages/${TemplateName}`).then(Module => {
    const Page = Module.default

    if (Page.layout === undefined) {
      // By default the layout will be User Layout
      Page.layout = UserLayout

      // If page namespace starts with "Auth" Use guest layout.
      if (TemplateName.startsWith('Auth')) {
        Page.layout = GuestLayout
      }
    }

    return Page
  }),

  setup: ({ el, app, props, plugin }) => {
    createApp({ render: () => h(app, props) }).use(plugin).use(createPinia()).mount(el)
  },
})

// Progress bar
InertiaProgress.init({ color: '#E1251B', showSpinner: true })
