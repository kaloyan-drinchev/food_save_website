import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/css/style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faGooglePlay, faAppStoreIos } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faSun, faMoon, faBars, faXmark, faGooglePlay, faAppStoreIos)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)
app.use(i18n)
app.mount('#app')
