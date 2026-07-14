<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import windowsAppLogo from '../../assets/images/logo-s-green.png'

const { t, locale } = useI18n()
const showModal = ref(false)
const comingSoonPlatform = ref('')

function updateTitle() {
  document.title = `${t('landing.cf_label')} | FoodSave`
}

function openComingSoon(platformLabel) {
  comingSoonPlatform.value = platformLabel
  showModal.value = true
}

function closeComingSoon() {
  showModal.value = false
}

watch(locale, updateTitle)

onMounted(() => {
  updateTitle()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cv-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 },
  )
  document.querySelectorAll('.cv-fade').forEach((el) => observer.observe(el))
})
</script>

<template>
  <AppNavbar />

  <main class="cv-main">
    <section class="cv-hero cv-fade">
      <div class="cv-container cv-hero-inner">
        <div>
          <span class="cv-label">{{ t('landing.cf_label') }}</span>
          <h1>{{ t('landing.cf_title') }}</h1>
          <p>{{ t('landing.cf_sub') }}</p>
        </div>
        <div class="cv-phones">
          <div class="cv-phone-frame cv-phone-hero">
            <div class="cv-phone-notch"></div>
            <img src="/assets/images/landing/app-browse-list.jpg" alt="List offers" />
            <div class="cv-phone-home-bar" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="cv-section cv-fade">
      <div class="cv-container">
        <h2>{{ t('landing.how_title') }}</h2>
        <div class="cv-steps-combined">
          <div class="cv-steps">
            <article class="cv-step">
              <strong>{{ t('landing.step1_title') }}</strong>
              <p>{{ t('landing.step1_desc') }}</p>
            </article>
            <article class="cv-step">
              <strong>{{ t('landing.step2_title') }}</strong>
              <p>{{ t('landing.step2_desc') }}</p>
            </article>
            <article class="cv-step">
              <strong>{{ t('landing.step3_title') }}</strong>
              <p>{{ t('landing.step3_desc') }}</p>
            </article>
          </div>

          <div class="cv-steps-phone">
            <div class="cv-phone-frame cv-phone-small">
              <div class="cv-phone-notch"></div>
              <img src="/assets/images/landing/app-browse-map.jpg" alt="Map offers" />
              <div class="cv-phone-home-bar" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cv-section cv-fade">
      <div class="cv-container">
        <h2>{{ t('landing.cf4_title') }}</h2>
        <p class="cv-sub">{{ t('landing.cf4_desc') }}</p>
        <div class="cv-payments">
          <article class="cv-pay-card">
            <h3>Card</h3>
            <p>Fast checkout directly in the app, no cash needed at pickup.</p>
          </article>
          <article class="cv-pay-card">
            <h3>Google Pay</h3>
            <p>One-tap mobile payment with secure tokenized transactions.</p>
          </article>
          <article class="cv-pay-card">
            <h3>Revolut</h3>
            <p>Pay from Revolut quickly and keep all your purchases in one place.</p>
          </article>
          <article class="cv-pay-card">
            <h3>PayPal</h3>
            <p>Use PayPal for trusted online payment flows and account protection.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="cv-section cv-fade">
      <div class="cv-container">
        <h2>{{ t('landing.dl_title') }}</h2>
        <p class="cv-sub">{{ t('landing.dl_client_desc') }}</p>

        <div class="cv-store-badges">
          <button
            class="cv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_play_lg'))"
          >
            <FontAwesomeIcon :icon="['fab', 'google-play']" class="cv-store-btn-icon" />
            <span>{{ t('landing.dl_play_lg') }}</span>
          </button>
          <button
            class="cv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_apple_lg'))"
          >
            <FontAwesomeIcon :icon="['fab', 'app-store-ios']" class="cv-store-btn-icon" />
            <span>{{ t('landing.dl_apple_lg') }}</span>
          </button>
          <button
            class="cv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_windows_lg'))"
          >
            <img
              :src="windowsAppLogo"
              alt="Windows app"
              class="cv-store-btn-icon cv-windows-logo"
            />
            <span>{{ t('landing.dl_windows_lg') }}</span>
          </button>
          <button
            class="cv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_web_lg'))"
          >
            <FontAwesomeIcon :icon="'globe'" class="cv-store-btn-icon" />
            <span>{{ t('landing.dl_web_lg') }}</span>
          </button>
        </div>
      </div>
    </section>
  </main>

  <Transition name="cv-modal-fade">
    <div
      v-if="showModal"
      class="cv-coming-modal-backdrop"
      role="dialog"
      aria-modal="true"
      @click.self="closeComingSoon"
    >
      <div class="cv-coming-modal">
        <h3>{{ t('landing.dl_soon') }}</h3>
        <p>{{ t('landing.hero_download_coming', { platform: comingSoonPlatform }) }}</p>
        <button type="button" class="cv-close-btn" @click="closeComingSoon">
          {{ t('landing.modal_ok') }}
        </button>
      </div>
    </div>
  </Transition>

  <AppFooter />
</template>

<style scoped>
.cv-container {
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2.5rem);
}

.cv-main {
  padding-top: calc(var(--nav-height) + 1.5rem);
}

.cv-fade {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.cv-fade.cv-visible {
  opacity: 1;
  transform: translateY(0);
}

.cv-hero {
  padding-block: 2.4rem;
}

.cv-hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.cv-label {
  display: inline-block;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 0.8rem;
}

h1,
h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  margin-bottom: 0.7rem;
}

p {
  color: var(--color-on-surface-var);
}

.cv-phones {
  display: flex;
  justify-content: flex-end;
}

.cv-phone-frame {
  width: min(100%, 290px);
  border: 2px solid #d2dad4;
  border-radius: 2rem;
  background: #eef2ee;
  padding: 0.55rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.cv-phone-hero {
  width: min(100%, 280px);
}

.cv-phone-small {
  width: min(100%, 220px);
  transform: translateY(0.6rem);
}

.cv-phone-notch {
  width: 40%;
  height: 0.9rem;
  border-radius: 0 0 1rem 1rem;
  margin: 0 auto 0.5rem;
  background: var(--color-surface);
}

.cv-phone-home-bar {
  width: 38%;
  height: 0.3rem;
  border-radius: 999px;
  background: #b8c0bb;
  margin: 0.45rem auto 0.15rem;
}

.cv-section {
  padding-block: 3rem;
}

.cv-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.cv-steps-combined {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 1rem;
  align-items: center;
}

.cv-step {
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  background: var(--color-surface-high);
  padding: 1rem;
}

.cv-step p {
  margin-top: 0.4rem;
}

.cv-sub {
  max-width: 70ch;
}

.cv-payments {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.cv-pay-card {
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  background: var(--color-surface-high);
  padding: 1rem;
}

.cv-pay-card h3 {
  margin-bottom: 0.5rem;
}

.cv-steps-phone {
  display: flex;
  justify-content: center;
}

.cv-store-badges {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.cv-store-btn {
  border: 1px solid var(--color-outline-var);
  background: var(--color-surface-high);
  border-radius: 0.9rem;
  min-height: 60px;
  padding: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--color-on-surface);
  cursor: pointer;
}

.cv-store-btn:hover {
  border-color: var(--color-primary);
}

.cv-store-btn-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.cv-windows-logo {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
}

.cv-modal-fade-enter-active,
.cv-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.cv-modal-fade-enter-from,
.cv-modal-fade-leave-to {
  opacity: 0;
}

.cv-coming-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 2000;
}

.cv-coming-modal {
  width: min(92vw, 420px);
  background: var(--color-surface-high);
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  padding: 1.25rem;
}

.cv-coming-modal p {
  color: var(--color-on-surface-var);
  margin: 0.4rem 0 1rem;
}

.cv-close-btn {
  display: inline-flex;
  padding: 0.7rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: var(--color-primary);
  color: var(--btn-primary-text);
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 980px) {
  .cv-hero-inner,
  .cv-steps-combined,
  .cv-steps,
  .cv-payments,
  .cv-store-badges {
    grid-template-columns: 1fr;
  }

  .cv-phones {
    justify-content: center;
  }
}
</style>
