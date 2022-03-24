import 'Scss/app.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MaterialIcons } from './plugins'
import { resolveComponents } from './helpers'
import './bootstrap'

const app = createApp({})

resolveComponents(require.context('./layouts', false, /\.vue$/i), app)

resolveComponents(require.context('./components', true, /\.vue$/i), app)

app.use(MaterialIcons).use(createPinia()).mount('#app')
