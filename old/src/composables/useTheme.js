import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'foodsave-theme'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const saved = localStorage.getItem(STORAGE_KEY)
const initial = saved || (prefersDark.matches ? 'dark' : 'light')

const theme = ref(initial)

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
}

applyTheme(initial)

watchEffect(() => {
  applyTheme(theme.value)
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}
