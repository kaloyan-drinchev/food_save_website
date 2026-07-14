import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/css/style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faBars, faXmark, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faGooglePlay, faAppStoreIos } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueApexCharts from 'vue3-apexcharts'
library.add(faSun, faMoon, faBars, faXmark, faGlobe, faGooglePlay, faAppStoreIos)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)
app.use(i18n)
app.use(VueApexCharts)
app.mount('#app')
