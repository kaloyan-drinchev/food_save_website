<script setup>
/**
 * "Контакти" — mockup FoodSave_Web_site/5_Kontakti. Copy: `hp.contact.*`.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { photos, contact, contactCards, contactTopics } from '@/content/site'
import SiteShell from '@/components/site/SiteShell.vue'
import SitePhotoBanner from '@/components/site/SitePhotoBanner.vue'
import SiteIcon from '@/components/site/SiteIcon.vue'
import SiteButton from '@/components/site/SiteButton.vue'

const { t } = useI18n()
const route = useRoute()

const formEl = ref(null)
const form = ref({ name: '', email: '', topic: '', message: '' })
const status = ref('idle') // idle | sending | success | error

const validTopics = contactTopics.map((x) => x.value)
const topicLabel = computed(
  () => contactTopics.find((x) => x.value === form.value.topic)?.label ?? null,
)

function applyTopicQuery() {
  const q = route.query.topic
  if (typeof q === 'string' && validTopics.includes(q)) form.value.topic = q
}

// Also react to in-page navigation, e.g. the footer's "Стани партньор" while already on /contact.
watch(() => route.query.topic, applyTopicQuery)
onMounted(applyTopicQuery)

async function submit() {
  if (status.value === 'sending') return
  if (formEl.value && !formEl.value.reportValidity()) return
  status.value = 'sending'
  try {
    const data = new FormData()
    data.append('_subject', 'FoodSave — Contact form')
    data.append('name', form.value.name)
    data.append('email', form.value.email)
    data.append('topic', topicLabel.value ? t(topicLabel.value) : form.value.topic)
    data.append('message', form.value.message)

    const res = await fetch(contact.formEndpoint, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    form.value = { name: '', email: '', topic: '', message: '' }
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <SiteShell active="contact" title-key="hp.meta.contact">
    <!-- ── Banner ── -->
    <section class="ct-hero">
      <div class="fs-container">
        <SitePhotoBanner :src="photos.heroContact" :alt="t('hp.contact.bannerAlt')" position="center 28%" eager />
      </div>
    </section>

    <!-- ── Нека поговорим ── -->
    <section class="fs-section ct-intro">
      <div class="fs-container">
        <div class="fs-center">
          <h1 class="fs-h2">{{ t('hp.contact.title') }}</h1>
          <p class="fs-lead ct-intro__text">
            {{ t('hp.contact.text1') }}<br />{{ t('hp.contact.text2') }}
          </p>
        </div>

        <div class="ct-cards">
          <article v-for="c in contactCards" :key="c.topic" class="ct-card">
            <SiteIcon :name="c.icon" size="clamp(52px, 3rem + 1vw, 66px)" />
            <h2 class="ct-card__title">{{ t(c.title) }}</h2>
            <p class="ct-card__text">{{ t(c.text) }}</p>
            <p class="ct-card__links">
              <a :href="contact.phoneHref">{{ contact.phone }}</a>
              <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Форма за контакт ── -->
    <section class="fs-section fs-section--flush-top ct-form-wrap">
      <div class="fs-container">
        <form ref="formEl" class="ct-form" novalidate @submit.prevent="submit">
          <h2 class="ct-form__title">{{ t('hp.contact.form.title') }}</h2>

          <div class="ct-form__fields">
            <div class="ct-field">
              <label for="ct-name">{{ t('hp.contact.form.name') }}</label>
              <input
                id="ct-name"
                v-model.trim="form.name"
                type="text"
                name="name"
                autocomplete="name"
                required
                :placeholder="t('hp.contact.form.namePlaceholder')"
              />
            </div>

            <div class="ct-field">
              <label for="ct-email">{{ t('hp.contact.form.email') }}</label>
              <input
                id="ct-email"
                v-model.trim="form.email"
                type="email"
                name="email"
                autocomplete="email"
                required
                :placeholder="t('hp.contact.form.emailPlaceholder')"
              />
            </div>

            <div class="ct-field">
              <label for="ct-topic">{{ t('hp.contact.form.topic') }}</label>
              <div class="ct-select">
                <select id="ct-topic" v-model="form.topic" name="topic" required>
                  <option value="" disabled>{{ t('hp.contact.form.topicPlaceholder') }}</option>
                  <option v-for="o in contactTopics" :key="o.value" :value="o.value">{{ t(o.label) }}</option>
                </select>
                <span class="ct-select__caret" aria-hidden="true"></span>
              </div>
            </div>

            <div class="ct-field">
              <label for="ct-message">{{ t('hp.contact.form.message') }}</label>
              <textarea
                id="ct-message"
                v-model.trim="form.message"
                name="message"
                required
                rows="8"
                :placeholder="t('hp.contact.form.messagePlaceholder')"
              ></textarea>
            </div>
          </div>

          <SiteButton
            variant="orange"
            size="lg"
            type="submit"
            class="ct-form__submit"
            :disabled="status === 'sending'"
          >
            {{ status === 'sending' ? t('hp.contact.form.sending') : t('hp.contact.form.submit') }}
          </SiteButton>

          <p v-if="status === 'success'" class="ct-form__status ct-form__status--ok" role="status">
            {{ t('hp.contact.form.success') }}
          </p>
          <p v-else-if="status === 'error'" class="ct-form__status ct-form__status--err" role="alert">
            {{ t('hp.contact.form.error') }}
          </p>
          <p v-else class="ct-form__note">{{ t('hp.contact.form.note') }}</p>
        </form>
      </div>
    </section>
  </SiteShell>
</template>

<style scoped>
/* ── Intro ── */
.ct-intro__text {
  margin: clamp(14px, 0.75rem + 0.9vw, 26px) auto 0;
  max-width: 48ch;
  line-height: 1.25;
}

.ct-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--fs-gap);
  margin-top: clamp(32px, 2rem + 2.5vw, 72px);
}

.ct-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(24px, 1rem + 1.2vw, 34px) clamp(20px, 1rem + 1.5vw, 36px) clamp(24px, 1rem + 1.2vw, 34px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-card);
  text-align: center;
}

.ct-card__title {
  margin-top: clamp(16px, 0.75rem + 1vw, 28px);
  font-size: clamp(1.375rem, 1.1rem + 1vw, 1.875rem);
}

.ct-card__text {
  margin-top: clamp(10px, 0.5rem + 0.6vw, 18px);
  max-width: 30ch;
  color: var(--fs-body);
}

.ct-card__links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: clamp(18px, 1rem + 1vw, 30px);
  font-weight: 700;
  color: var(--fs-teal);
}

.ct-card__links a:hover {
  color: var(--fs-orange);
}

/* ── Form ── */
.ct-form {
  width: min(100%, 1120px);
  margin-inline: auto;
  padding: clamp(32px, 2rem + 3vw, 72px) clamp(20px, 1rem + 6vw, 104px) clamp(36px, 2rem + 2.5vw, 70px);
  border-radius: var(--fs-radius-xl);
  background: var(--fs-teal);
  color: var(--fs-white);
}

.ct-form__title {
  color: var(--fs-white);
  font-size: var(--fs-h2);
  text-align: center;
}

.ct-form__fields {
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 0.75rem + 0.6vw, 20px);
  margin-top: clamp(24px, 1.5rem + 1.5vw, 44px);
}

.ct-field {
  --ct-field-pad: clamp(20px, 1rem + 1vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Label text lines up with the field text (mockup). */
.ct-field label {
  padding-left: var(--ct-field-pad);
  font-size: 1rem;
  font-weight: 700;
}

.ct-field input,
.ct-field select,
.ct-field textarea {
  width: 100%;
  min-height: clamp(54px, 2.5rem + 2.5vw, 80px);
  padding: 0 var(--ct-field-pad);
  border: 0;
  border-radius: var(--fs-radius-pill);
  background: var(--fs-card);
  color: var(--fs-teal);
  font-size: var(--fs-text-size);
  outline: none;
  transition: box-shadow var(--fs-transition);
}

.ct-field input::placeholder,
.ct-field textarea::placeholder {
  color: #6d7d7d;
}

.ct-field input:focus,
.ct-field select:focus,
.ct-field textarea:focus {
  box-shadow: 0 0 0 3px rgba(235, 129, 39, 0.55);
}

.ct-field textarea {
  min-height: clamp(200px, 12rem + 8vw, 350px);
  padding-block: clamp(16px, 1rem + 0.5vw, 24px);
  border-radius: var(--fs-radius-lg);
  resize: vertical;
}

.ct-select {
  position: relative;
}

.ct-select select {
  appearance: none;
  padding-right: 64px;
  cursor: pointer;
}

.ct-select select:invalid,
.ct-select select option[value=''] {
  color: #6d7d7d;
}

.ct-select__caret {
  position: absolute;
  right: clamp(22px, 1rem + 1vw, 34px);
  top: 50%;
  width: 0;
  height: 0;
  transform: translateY(-40%);
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-top: 12px solid var(--fs-teal);
  pointer-events: none;
}

.ct-form__submit {
  display: flex;
  width: min(100%, 466px);
  margin: clamp(22px, 1.5rem + 1vw, 40px) auto 0;
}

.ct-form__note {
  margin: clamp(22px, 1.5rem + 1.2vw, 44px) auto 0;
  max-width: 24ch;
  text-align: center;
  font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  color: var(--fs-white);
}

.ct-form__status {
  margin: clamp(18px, 1rem + 1vw, 32px) auto 0;
  max-width: 48ch;
  text-align: center;
  font-size: var(--fs-lead);
  font-weight: 600;
}

.ct-form__status--ok {
  color: #dfe8d6;
}

.ct-form__status--err {
  color: #ffd2b3;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .ct-cards {
    grid-template-columns: minmax(0, 1fr);
    max-width: 520px;
    margin-inline: auto;
  }
}

@media (max-width: 640px) {
  .ct-form {
    margin-inline: calc(-1 * var(--fs-gutter));
    width: auto;
    border-radius: var(--fs-radius-lg);
  }
}
</style>
