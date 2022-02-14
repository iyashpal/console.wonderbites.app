import '../scss/app.scss'
import { createApp } from 'vue'
import { resolveComponents } from './helpers';

const app = createApp({});



resolveComponents(require.context('./layouts', false, /\.vue$/i), app)

resolveComponents(require.context('./components', true, /\.vue$/i), app)


app.mount('#app');
