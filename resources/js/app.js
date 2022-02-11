import '../scss/app.scss'
import { createApp } from 'vue'
import App from './components/App.vue'
import { resolveComponents } from './helpers';
import Router from './routes'

const app = createApp(App);



resolveComponents(require.context('./layouts', false, /\.vue$/i), app)

resolveComponents(require.context('./components', true, /\.vue$/i), app)





if (document.getElementById('app')) {

    console.log('asdasdf');

    /************************************************
     * Configuration of Vue SPA Plugins
     ************************************************/
    

    app.use(Router).mount('#app');
}
