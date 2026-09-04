import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from './router'
import i18n, { restoreLocale } from './i18n'
import './assets/css/style.css'

const app = createApp(App)

/**
 * FontAwesome is only used by the admin panel and the legacy pages, so it is
 * registered as an async component: the runtime and its icons download the
 * first time one of those pages renders an icon, and never on the public site.
 */
app.component(
  'FontAwesomeIcon',
  defineAsyncComponent(() => import('./plugins/fontawesome.js')),
)

app.use(router)
app.use(i18n)

// Resolve the stored language before the first paint.
restoreLocale().finally(() => app.mount('#app'))
