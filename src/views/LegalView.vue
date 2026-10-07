<script setup>
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import SiteShell from '@/components/site/SiteShell.vue'
import updated from '@/content/legal/updated.json'

/**
 * Terms, privacy and cookie policy. The documents are HTML generated from the
 * lawyer's .docx files by scripts/legal-docx-to-html.py and exist in Bulgarian
 * only (the Bulgarian version is the binding one); each loads as its own chunk.
 */
const props = defineProps({
  /** terms | privacy | cookies */
  doc: { type: String, required: true },
})

const documents = import.meta.glob('@/content/legal/*.bg.html', { query: '?raw', import: 'default' })

const { t, locale } = useI18n()
const router = useRouter()
const html = ref('')

watchEffect(async () => {
  const doc = props.doc
  const load = documents[`/src/content/legal/${doc}.bg.html`]
  const content = load ? await load() : ''
  if (doc === props.doc) html.value = content
})

/** Links between the documents are plain <a href="/privacy"> in the HTML —
 *  route them in-app instead of reloading the page. */
function onClick(event) {
  const a = event.target.closest('a')
  const href = a?.getAttribute('href')
  if (!href?.startsWith('/') || a.target || event.metaKey || event.ctrlKey || event.shiftKey) return
  event.preventDefault()
  router.push(href)
}
</script>

<template>
  <SiteShell :title-key="`${doc}.title`">
    <header class="legal-hero">
      <div class="fs-container legal-column">
        <h1 class="fs-h1">{{ t(`${doc}.title`) }}</h1>
        <p class="fs-lead legal-hero__lead">{{ t(`${doc}.subtitle`) }}</p>
        <p class="legal-hero__updated">{{ t('legal.updated', { date: updated.date }) }}</p>
      </div>
    </header>

    <div class="fs-container legal-column legal-body">
      <p v-if="locale !== 'bg'" class="legal-notice">{{ t('legal.bgOnly') }}</p>
      <div class="legal-content" lang="bg" @click="onClick" v-html="html"></div>
    </div>
  </SiteShell>
</template>

<style scoped>
.legal-column {
  max-width: calc(860px + 2 * var(--fs-gutter));
}

.legal-hero {
  padding: var(--fs-section-sm) 0;
  background: var(--fs-card);
}

.legal-hero__lead {
  margin-top: 14px;
  color: var(--fs-body-soft);
}

.legal-hero__updated {
  margin-top: 10px;
  font-size: var(--fs-small);
  color: var(--fs-body-soft);
}

.legal-body {
  padding-top: var(--fs-section-sm);
  padding-bottom: var(--fs-section);
}

.legal-notice {
  margin-bottom: 32px;
  padding: 14px 18px;
  font-size: var(--fs-small);
  background: var(--fs-pill);
  border-left: 4px solid var(--fs-orange);
  border-radius: 12px;
}

/* ── The generated document ───────────────────────────────── */
.legal-content {
  font-size: var(--fs-small);
  line-height: 1.7;
  color: var(--fs-body);
  overflow-wrap: break-word;
}

.legal-content :deep(h2) {
  margin: 44px 0 14px;
  padding-bottom: 10px;
  font-size: var(--fs-h4);
  border-bottom: 1px solid var(--fs-line-on-pill);
}

.legal-content :deep(h2:first-child) {
  margin-top: 0;
}

.legal-content :deep(h3) {
  margin: 28px 0 10px;
  font-size: 1.0625rem;
}

.legal-content :deep(p) {
  margin-bottom: 12px;
}

.legal-content :deep(ul) {
  margin: 0 0 16px;
  padding-left: 22px;
  list-style: disc;
}

.legal-content :deep(li) {
  margin-bottom: 4px;
}

.legal-content :deep(li::marker) {
  color: var(--fs-orange);
}

.legal-content :deep(strong) {
  color: var(--fs-text);
}

.legal-content :deep(a) {
  color: var(--fs-orange-deep);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.legal-content :deep(a:hover) {
  color: var(--fs-teal);
}

/* Wide tables scroll sideways on phones instead of widening the page. */
.legal-content :deep(.legal-table) {
  margin: 16px 0 24px;
  overflow-x: auto;
  background: var(--fs-white);
  border: 1px solid var(--fs-card);
  border-radius: 16px;
}

.legal-content :deep(table) {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: var(--fs-xsmall);
  line-height: 1.5;
}

.legal-content :deep(th),
.legal-content :deep(td) {
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--fs-card);
}

.legal-content :deep(th) {
  color: var(--fs-text);
  background: var(--fs-pill);
}

.legal-content :deep(tbody tr:last-child td) {
  border-bottom: 0;
}
</style>
