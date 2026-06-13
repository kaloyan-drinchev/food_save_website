import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/css/style.css'

import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = true;

library.add(fas, far, fab);

import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)
app.use(i18n)
app.use(VueApexCharts)
app.mount('#app')
