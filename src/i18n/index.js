import { createI18n } from 'vue-i18n'
import bg from './bg.js'

/**
 * Bulgarian ships with the app; English is fetched the first time it is
 * selected. Both files carry the same 248 keys, so nothing but the download
 * differs between them.
 *
 * Always switch languages through `setLocale()` — it loads the messages if
 * needed, stores the choice and keeps <html lang> in sync for screen readers
 * and search engines.
 */
const STORAGE_KEY = 'foodsave-lang'
const DEFAULT_LOCALE = 'bg'

export const SUPPORTED_LOCALES = ['bg', 'en']

/** Locale files that are not bundled with the app. */
const loaders = {
  en: () => import('./en.js'),
}

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { bg },
})

export async function setLocale(lang) {
  if (!SUPPORTED_LOCALES.includes(lang)) return
  if (!i18n.global.availableLocales.includes(lang)) {
    const module = await loaders[lang]()
    i18n.global.setLocaleMessage(lang, module.default)
  }
  i18n.global.locale.value = lang
  document.documentElement.lang = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Private mode — the choice just will not survive a reload.
  }
}

/** Messages for a locale, uncompiled — used by the legal pages, whose content
 *  is raw HTML that must bypass the message compiler. */
export function getMessages(lang) {
  return i18n.global.getLocaleMessage(lang) || i18n.global.getLocaleMessage(DEFAULT_LOCALE)
}

/** Apply the stored preference. Awaited before the app mounts, so a visitor
 *  who chose English never sees a flash of Bulgarian. */
export function restoreLocale() {
  let saved = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Ignore — fall back to the default locale.
  }
  return setLocale(SUPPORTED_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE)
}

export default i18n
