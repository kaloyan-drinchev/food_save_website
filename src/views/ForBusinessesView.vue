<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ContactSection from '@/components/home/ContactSection.vue'
import windowsAppLogo from '../../assets/images/logo-s-green.png'

const { t, locale } = useI18n()
const showModal = ref(false)
const comingSoonPlatform = ref('')

function updateTitle() {
  document.title = `${t('landing.bs_label')} | FoodSave`
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
          entry.target.classList.add('bv-visible', 'visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 },
  )
  document.querySelectorAll('.bv-fade').forEach((el) => observer.observe(el))
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
})
</script>

<template>
  <AppNavbar />

  <main class="bv-main">
    <section class="bv-hero bv-fade">
      <div class="bv-container bv-hero-inner">
        <div>
          <span class="bv-label">{{ t('landing.bs_label') }}</span>
          <h1>{{ t('landing.bs_title') }}</h1>
          <p>{{ t('landing.bs_sub') }}</p>
          <p>
            {{ t('landing.bs_contact_intro') }}
            <a href="mailto:contact@foodsave.tech">contact@foodsave.tech</a>
          </p>
          <a href="#contact" class="bv-btn">{{ t('nav.contact') }}</a>
        </div>
        <div class="bv-phone-wrap">
          <div class="bv-phone-frame">
            <div class="bv-phone-notch"></div>
            <img src="/assets/images/landing/app-business-page.jpg" alt="Business dashboard" />
            <div class="bv-phone-home-bar" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="bv-section bv-fade">
      <div class="bv-container">
        <div class="bv-grid">
          <article class="bv-card">
            <div class="bv-icon">{{ t('landing.bs1_icon') }}</div>
            <h3>{{ t('landing.bs1_title') }}</h3>
            <p>{{ t('landing.bs1_desc') }}</p>
          </article>
          <article class="bv-card">
            <div class="bv-icon">{{ t('landing.bs2_icon') }}</div>
            <h3>{{ t('landing.bs2_title') }}</h3>
            <p>{{ t('landing.bs2_desc') }}</p>
          </article>
          <article class="bv-card">
            <div class="bv-icon">{{ t('landing.bs3_icon') }}</div>
            <h3>{{ t('landing.bs3_title') }}</h3>
            <p>{{ t('landing.bs3_desc') }}</p>
          </article>
          <article class="bv-card">
            <div class="bv-icon">{{ t('landing.bs4_icon') }}</div>
            <h3>{{ t('landing.bs4_title') }}</h3>
            <p>{{ t('landing.bs4_desc') }}</p>
          </article>
          <article class="bv-card">
            <div class="bv-icon">{{ t('landing.bs5_icon') }}</div>
            <h3>{{ t('landing.bs5_title') }}</h3>
            <p>{{ t('landing.bs5_desc') }}</p>
          </article>
          <article class="bv-card">
            <div class="bv-icon">{{ t('landing.bs6_icon') }}</div>
            <h3>{{ t('landing.bs6_title') }}</h3>
            <p>{{ t('landing.bs6_desc') }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bv-section bv-fade">
      <div class="bv-container">
        <span class="bv-label">{{ t('landing.biz_label') }}</span>
        <h2>{{ t('landing.biz_title') }}</h2>
        <p class="bv-sub">{{ t('landing.biz_sub') }}</p>
        <ul class="bv-list">
          <li>{{ t('landing.biz_type1') }}</li>
          <li>{{ t('landing.biz_type2') }}</li>
          <li>{{ t('landing.biz_type3') }}</li>
          <li>{{ t('landing.biz_type4') }}</li>
        </ul>

        <div class="bv-download-block">
          <h3>{{ t('landing.dl_biz_title') }}</h3>
          <p>{{ t('landing.dl_biz_desc') }}</p>
          <div class="bv-store-badges">
            <button
              class="bv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_play_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'google-play']" class="bv-store-btn-icon" />
              <span>{{ t('landing.dl_play_lg') }}</span>
            </button>
            <button
              class="bv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_apple_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'app-store-ios']" class="bv-store-btn-icon" />
              <span>{{ t('landing.dl_apple_lg') }}</span>
            </button>
            <button
              class="bv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_windows_lg'))"
            >
              <img
                :src="windowsAppLogo"
                alt="Windows app"
                class="bv-store-btn-icon bv-windows-logo"
              />
              <span>{{ t('landing.dl_windows_lg') }}</span>
            </button>
            <button
              class="bv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_web_lg'))"
            >
              <FontAwesomeIcon :icon="'globe'" class="bv-store-btn-icon" />
              <span>{{ t('landing.dl_web_lg') }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <ContactSection />
  </main>

  <Transition name="bv-modal-fade">
    <div
      v-if="showModal"
      class="bv-coming-modal-backdrop"
      role="dialog"
      aria-modal="true"
      @click.self="closeComingSoon"
    >
      <div class="bv-coming-modal">
        <h3>{{ t('landing.dl_soon') }}</h3>
        <p>{{ t('landing.hero_download_coming', { platform: comingSoonPlatform }) }}</p>
        <button type="button" class="bv-btn" @click="closeComingSoon">
          {{ t('landing.modal_ok') }}
        </button>
      </div>
    </div>
  </Transition>

  <AppFooter />
</template>

<style scoped>
.bv-container {
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2.5rem);
}

.bv-main {
  padding-top: calc(var(--nav-height) + 1.5rem);
}

.bv-fade {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.bv-fade.bv-visible {
  opacity: 1;
  transform: translateY(0);
}

.bv-hero {
  padding-block: 2.5rem;
}

.bv-hero-inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  align-items: center;
}

.bv-label {
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
  font-size: clamp(1.8rem, 4.2vw, 2.9rem);
  margin-bottom: 0.7rem;
}

p {
  color: var(--color-on-surface-var);
  margin-bottom: 0.8rem;
}

.bv-btn {
  display: inline-flex;
  padding: 0.7rem 1.3rem;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--btn-primary-text);
  font-weight: 700;
}

.bv-phone-frame {
  width: min(100%, 280px);
  margin-inline: auto;
  border: 2px solid #d2dad4;
  border-radius: 2rem;
  background: #eef2ee;
  padding: 0.6rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.bv-phone-notch {
  width: 40%;
  height: 0.9rem;
  border-radius: 0 0 1rem 1rem;
  margin: 0 auto 0.5rem;
  background: var(--color-surface);
}

.bv-phone-home-bar {
  width: 38%;
  height: 0.3rem;
  border-radius: 999px;
  background: #b8c0bb;
  margin: 0.45rem auto 0.15rem;
}

.bv-section {
  padding-block: 3.2rem;
}

.bv-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.bv-card {
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  background: var(--color-surface-high);
  padding: 1rem;
}

.bv-icon {
  margin-bottom: 0.4rem;
}

.bv-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  list-style: none;
  padding: 0;
}

.bv-list li {
  border: 1px solid var(--color-outline-var);
  border-radius: 0.8rem;
  background: var(--color-surface-high);
  padding: 0.75rem;
}

.bv-download-block {
  margin-top: 1.4rem;
}

.bv-download-block h3 {
  margin-bottom: 0.45rem;
  font-size: 1.15rem;
}

.bv-download-block p {
  margin-bottom: 0.85rem;
}

.bv-store-badges {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.bv-store-btn {
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

.bv-store-btn:hover {
  border-color: var(--color-primary);
}

.bv-store-btn-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.bv-windows-logo {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
}

.bv-modal-fade-enter-active,
.bv-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bv-modal-fade-enter-from,
.bv-modal-fade-leave-to {
  opacity: 0;
}

.bv-coming-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 2000;
}

.bv-coming-modal {
  width: min(92vw, 420px);
  background: var(--color-surface-high);
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  padding: 1.25rem;
}

.bv-coming-modal p {
  color: var(--color-on-surface-var);
  margin: 0.4rem 0 1rem;
}

@media (max-width: 980px) {
  .bv-hero-inner,
  .bv-grid,
  .bv-list,
  .bv-store-badges {
    grid-template-columns: 1fr;
  }
}
</style>
