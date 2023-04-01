import { createApp } from 'vue'
import 'mdb-vue-ui-kit/css/mdb.min.css'
import router from "./router"
import {createVuetify} from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import VueHtmlToPaper from './plugins/VueHtmlToPaper';

const options = {
    name: '_blank',
    specs: [
        'fullscreen=yes',
        'titlebar=yes',
        'scrollbars=yes'
    ],
    styles: [
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'https://unpkg.com/kidlat-css/css/kidlat.css'
    ],
    timeout: 1000, // default timeout before the print window appears
    autoClose: true, // if false, the window will not close after printing
    windowTitle: window.document.title, // override the window title
}


const vuetify = createVuetify();
createApp(App)
    .use(router)
    .use(vuetify)
    .use(VueHtmlToPaper, options)
    .mount('#app');

