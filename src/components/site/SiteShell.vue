<script setup>
import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import '@/assets/css/site.css'
import SiteNav from './SiteNav.vue'
import SiteFooter from './SiteFooter.vue'

/**
 * Page chrome for every public page: design-system scope, sticky nav,
 * footer and the document title.
 */
const props = defineProps({
  /** Nav item to highlight: landing | about | consumers | business | contact */
  active: { type: String, default: '' },
  /** i18n key for the document title (page name; " | FoodSave" is appended). */
  titleKey: { type: String, default: '' },
  /** The key already holds the full title (home page). */
  standaloneTitle: { type: Boolean, default: false },
})

const { t, locale } = useI18n()

function updateTitle() {
  if (!props.titleKey) return
  const name = t(props.titleKey)
  document.title = props.standaloneTitle ? name : `${name} | FoodSave`
}

watch(locale, updateTitle)
onMounted(updateTitle)
</script>

<template>
  <div class="fs">
    <SiteNav :active="active" />
    <main class="fs-main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.fs-main {
  overflow-x: clip;
}
</style>
