import { createI18n } from 'vue-i18n'
import en from './en.js'
import bg from './bg.js'

const savedLang = localStorage.getItem('foodsave-lang') || 'bg'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'en',
  messages: { en, bg },
})

export default i18n
