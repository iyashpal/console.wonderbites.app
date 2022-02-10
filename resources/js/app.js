import { createApp } from 'vue'
import '../scss/app.scss'
import { resolveComponents } from './helpers';

const app = createApp({});




resolveComponents(require.context('./components', true, /\.vue$/i), app)




app.mount('#app');
