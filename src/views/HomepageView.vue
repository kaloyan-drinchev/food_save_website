<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FaqSection from '@/components/home/FaqSection.vue'
import WaitlistSection from '@/components/home/WaitlistSection.vue'
import ContactSection from '@/components/home/ContactSection.vue'
import windowsAppLogo from '../../assets/images/logo-s-green.png'

const { t, locale } = useI18n()
const showModal = ref(false)
const comingSoonPlatform = ref('')

const statConfigs = [
  { prefix: '', target: 70, suffix: ' %', decimals: 0 },
  { prefix: '~', target: 2.5, suffix: ' kg', decimals: 1 },
  { prefix: '', target: 100, suffix: ' %', decimals: 0 },
  { prefix: '', target: null, suffix: 'BG', decimals: 0 },
]
const statValues = ref(
  statConfigs.map((s) => (s.target === null ? s.suffix : `${s.prefix}0${s.suffix}`)),
)

const impactConfigs = [
  { prefix: '', target: 1240, suffix: '+', decimals: 0 },
  { prefix: '', target: 3100, suffix: ' kg', decimals: 0 },
  { prefix: 'EUR ', target: 8500, suffix: '', decimals: 0 },
  { prefix: '', target: 45, suffix: '+', decimals: 0 },
]
const impactValues = ref(impactConfigs.map((c) => `${c.prefix}0${c.suffix}`))

function animateValues(configs, targetRef, duration = 1800) {
  const start = performance.now()
  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 4)
    configs.forEach((cfg, i) => {
      if (cfg.target === null) return
      const cur = cfg.target * eased
      const display = cfg.decimals > 0 ? cur.toFixed(cfg.decimals) : Math.round(cur)
      targetRef.value[i] = `${cfg.prefix}${display}${cfg.suffix}`
    })
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function openComingSoon(platformLabel) {
  comingSoonPlatform.value = platformLabel
  showModal.value = true
}

function closeComingSoon() {
  showModal.value = false
}

function updateTitle() {
  document.title = t('landing.title')
}

watch(locale, updateTitle)

onMounted(() => {
  updateTitle()

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lv-visible', 'visible')
          fadeObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 },
  )

  document.querySelectorAll('.lv-fade').forEach((el) => fadeObserver.observe(el))
  document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el))

  const statsBar = document.querySelector('.lv-stats-bar')
  if (statsBar) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValues(statConfigs, statValues)
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 },
    )
    statsObserver.observe(statsBar)
  }

  const impactCounters = document.querySelector('.lv-impact-counters')
  if (impactCounters) {
    const impactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValues(impactConfigs, impactValues)
            impactObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 },
    )
    impactObserver.observe(impactCounters)
  }
})
</script>

<template>
  <AppNavbar />

  <main class="lv-main">
    <section class="lv-hero">
      <div class="lv-container lv-hero-inner">
        <div class="lv-hero-content">
          <span class="lv-badge">{{ t('landing.hero_badge') }}</span>
          <h1 class="lv-hero-title">
            {{ t('landing.hero_title_line1') }}<br />
            <span class="lv-accent">{{ t('landing.hero_title_line2') }}</span>
          </h1>
          <p class="lv-hero-sub">
            {{ t('landing.hero_sub_before') }}
            <strong>{{ t('landing.hero_sub_highlight') }}</strong>
            {{ t('landing.hero_sub_after') }}
          </p>
          <div class="lv-hero-actions">
            <a href="#waitlist" class="lv-btn lv-btn-primary">{{
              t('landing.hero_cta_waitlist')
            }}</a>
          </div>
          <p class="lv-social-proof">
            <span class="lv-dot"></span> {{ t('landing.hero_social_proof') }}
          </p>
          <div class="lv-hero-downloads">
            <button
              class="lv-hero-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_apple_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'app-store-ios']" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_apple_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_apple_lg') }}</span>
              </div>
            </button>

            <button
              class="lv-hero-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_play_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'google-play']" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_play_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_play_lg') }}</span>
              </div>
            </button>

            <button
              class="lv-hero-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_windows_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'windows']" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_windows_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_windows_lg') }}</span>
              </div>
            </button>

            <button
              class="lv-hero-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_web_lg'))"
            >
              <FontAwesomeIcon :icon="'globe'" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_web_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_web_lg') }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="lv-phone-wrap lv-hero-phone">
          <div class="lv-phone-frame">
            <div class="lv-phone-notch"></div>
            <img src="/assets/images/landing/app-homepage-screen.jpg" alt="App home screen" />
            <div class="lv-phone-home-bar" aria-hidden="true"></div>
          </div>
          <div class="lv-phone-shadow"></div>
        </div>
      </div>
    </section>

    <div class="lv-stats-bar lv-fade">
      <div class="lv-container lv-stats-inner">
        <div class="lv-stat">
          <span class="lv-stat-value">{{ statValues[0] }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_savings_label') }}</span>
        </div>
        <div class="lv-stat-divider" aria-hidden="true"></div>
        <div class="lv-stat">
          <span class="lv-stat-value">{{ statValues[1] }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_waste_label') }}</span>
        </div>
        <div class="lv-stat-divider" aria-hidden="true"></div>
        <div class="lv-stat">
          <span class="lv-stat-value">{{ statValues[2] }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_local_label') }}</span>
        </div>
        <div class="lv-stat-divider" aria-hidden="true"></div>
        <div class="lv-stat">
          <span class="lv-stat-value">{{ statValues[3] }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_country_label') }}</span>
        </div>
      </div>
    </div>

    <section id="how-it-works" class="lv-section lv-fade">
      <div class="lv-container">
        <div class="lv-section-header">
          <span class="lv-section-label">{{ t('landing.how_label') }}</span>
          <h2 class="lv-section-title">{{ t('landing.how_title') }}</h2>
          <p class="lv-section-sub">{{ t('landing.how_sub') }}</p>
        </div>
        <div class="lv-steps">
          <div class="lv-step">
            <div class="lv-step-icon">01</div>
            <h3 class="lv-step-title">{{ t('landing.step1_title') }}</h3>
            <p class="lv-step-desc">{{ t('landing.step1_desc') }}</p>
          </div>
          <div class="lv-step">
            <div class="lv-step-icon">02</div>
            <h3 class="lv-step-title">{{ t('landing.step2_title') }}</h3>
            <p class="lv-step-desc">{{ t('landing.step2_desc') }}</p>
          </div>
          <div class="lv-step">
            <div class="lv-step-icon">03</div>
            <h3 class="lv-step-title">{{ t('landing.step3_title') }}</h3>
            <p class="lv-step-desc">{{ t('landing.step3_desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="lv-section lv-impact lv-fade">
      <div class="lv-container">
        <div class="lv-section-header">
          <span class="lv-section-label">{{ t('landing.impact_label') }}</span>
          <h2 class="lv-section-title">{{ t('landing.impact_title') }}</h2>
          <p class="lv-section-sub">{{ t('landing.impact_sub') }}</p>
        </div>
        <div class="lv-impact-counters">
          <div class="lv-impact-card">
            <div class="lv-impact-icon">Meal</div>
            <span class="lv-impact-value">{{ impactValues[0] }}</span>
            <span class="lv-impact-label">{{ t('landing.impact_meals_label') }}</span>
          </div>
          <div class="lv-impact-card">
            <div class="lv-impact-icon">CO2</div>
            <span class="lv-impact-value">{{ impactValues[1] }}</span>
            <span class="lv-impact-label">{{ t('landing.impact_co2_label') }}</span>
          </div>
          <div class="lv-impact-card">
            <div class="lv-impact-icon">Save</div>
            <span class="lv-impact-value">{{ impactValues[2] }}</span>
            <span class="lv-impact-label">{{ t('landing.impact_saved_label') }}</span>
          </div>
          <div class="lv-impact-card">
            <div class="lv-impact-icon">Biz</div>
            <span class="lv-impact-value">{{ impactValues[3] }}</span>
            <span class="lv-impact-label">{{ t('landing.impact_biz_label') }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="download" class="lv-section lv-download lv-fade">
      <div class="lv-container lv-download-inner">
        <div class="lv-section-header">
          <span class="lv-section-label">{{ t('landing.dl_label') }}</span>
          <h2 class="lv-section-title lv-left">{{ t('landing.dl_title') }}</h2>
          <p class="lv-dl-desc">{{ t('landing.dl_sub') }}</p>

          <div class="lv-dl-highlight">
            <div class="lv-dl-highlight-icon">📱</div>
            <div>
              <strong>{{ t('landing.dl_client_title') }}</strong>
              <p>{{ t('landing.dl_client_desc') }}</p>
            </div>
          </div>

          <div class="lv-store-badges-v2">
            <button
              class="lv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_play_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'google-play']" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_play_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_play_lg') }}</span>
              </div>
              <span class="lv-soon-pill">{{ t('landing.dl_soon') }}</span>
            </button>
            <button
              class="lv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_apple_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'app-store-ios']" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_apple_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_apple_lg') }}</span>
              </div>
              <span class="lv-soon-pill">{{ t('landing.dl_soon') }}</span>
            </button>
            <button
              class="lv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_windows_lg'))"
            >
              <FontAwesomeIcon :icon="['fab', 'windows']" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_windows_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_windows_lg') }}</span>
              </div>
              <span class="lv-soon-pill">{{ t('landing.dl_soon') }}</span>
            </button>
            <button
              class="lv-store-btn"
              type="button"
              @click="openComingSoon(t('landing.dl_web_lg'))"
            >
              <FontAwesomeIcon :icon="'globe'" class="lv-store-btn-icon" />
              <div class="lv-store-btn-text">
                <span class="lv-store-btn-sm">{{ t('landing.dl_web_sm') }}</span>
                <span class="lv-store-btn-lg">{{ t('landing.dl_web_lg') }}</span>
              </div>
              <span class="lv-soon-pill">{{ t('landing.dl_soon') }}</span>
            </button>
          </div>
        </div>

        <div class="lv-dl-highlight">
          <strong>{{ t('landing.dl_client_title') }}</strong>
          <p>{{ t('landing.dl_client_desc') }}</p>
        </div>

        <div class="lv-store-badges">
          <button
            class="lv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_play_lg'))"
          >
            <FontAwesomeIcon :icon="['fab', 'google-play']" class="lv-store-btn-icon" />
            <span>{{ t('landing.dl_play_lg') }}</span>
          </button>
          <button
            class="lv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_apple_lg'))"
          >
            <FontAwesomeIcon :icon="['fab', 'app-store-ios']" class="lv-store-btn-icon" />
            <span>{{ t('landing.dl_apple_lg') }}</span>
          </button>
          <button
            class="lv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_windows_lg'))"
          >
            <img
              :src="windowsAppLogo"
              alt="Windows app"
              class="lv-store-btn-icon lv-windows-logo"
            />
            <span>{{ t('landing.dl_windows_lg') }}</span>
          </button>
          <button
            class="lv-store-btn"
            type="button"
            @click="openComingSoon(t('landing.dl_web_lg'))"
          >
            <FontAwesomeIcon :icon="'globe'" class="lv-store-btn-icon" />
            <span>{{ t('landing.dl_web_lg') }}</span>
          </button>
        </div>
      </div>
    </section>

    <FaqSection />
    <WaitlistSection />
    <ContactSection />
  </main>

  <Transition name="lv-modal-fade">
    <div
      v-if="showModal"
      class="lv-coming-modal-backdrop"
      role="dialog"
      aria-modal="true"
      @click.self="closeComingSoon"
    >
      <div class="lv-coming-modal">
        <h3>{{ t('landing.dl_soon') }}</h3>
        <p>{{ t('landing.hero_download_coming', { platform: comingSoonPlatform }) }}</p>
        <button type="button" class="lv-btn lv-btn-primary" @click="closeComingSoon">
          {{ t('landing.modal_ok') }}
        </button>
      </div>
    </div>
  </Transition>

  <AppFooter />
</template>

<style scoped>
.lv-container {
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2.5rem);
}

.lv-fade {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.65s ease,
    transform 0.65s ease;
}

.lv-fade.lv-visible,
.fade-in.lv-visible {
  opacity: 1;
  transform: translateY(0);
}

.lv-section {
  padding-top: 24px;
  padding-bottom: 24px;
}

.lv-section-header {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 2rem;
}

.lv-section-label {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
  margin-bottom: 0.8rem;
}

.lv-section-title {
  font-size: clamp(1.75rem, 4vw, 2.7rem);
  margin-bottom: 0.7rem;
}

.lv-section-sub {
  color: var(--color-on-surface-var);
}

.lv-hero {
  display: flex;
  align-items: center;
  padding-top: calc(var(--nav-height) + 2rem);
}

.lv-hero-inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2.2rem;
  align-items: center;
}

.lv-badge {
  display: inline-block;
  border-radius: 999px;
  background: var(--color-primary-container);
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.45rem 0.9rem;
  margin-bottom: 1rem;
}

.lv-hero-title {
  font-size: clamp(2.3rem, 5vw, 4rem);
  line-height: 1.08;
}

.lv-accent {
  color: var(--color-primary);
}

.lv-hero-sub {
  color: var(--color-on-surface-var);
  margin-top: 1rem;
  max-width: 62ch;
}

.lv-hero-sub strong {
  color: var(--color-on-surface);
}

.lv-hero-actions {
  margin-top: 1.3rem;
}

.lv-social-proof {
  margin-top: 0.8rem;
  color: var(--color-on-surface-var);
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.lv-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--color-primary);
}

.lv-hero-downloads {
  display: grid;
  grid-template-columns: repeat(4, minmax(168px, 1fr));
  gap: 0.75rem;
  max-width: 760px;
}

.lv-hero-store-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-surface-high);
  border: 1.5px solid var(--color-outline-var);
  border-radius: var(--radius-lg);
  min-height: 72px;
  padding: 0.9rem 1.05rem;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
}

.lv-hero-store-btn:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--color-primary) 15%, transparent);
  transform: translateY(-2px);
}

.lv-store-btn-text {
  display: flex;
  flex-direction: column;
}

.lv-store-btn-sm {
  font-size: 0.65rem;
  color: var(--color-on-surface-var);
  letter-spacing: 0.02em;
}

.lv-store-btn-lg {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--color-on-surface);
  line-height: 1.2;
}

.lv-phone-wrap {
  position: relative;
  margin-inline: auto;
}

.lv-phone-frame {
  width: min(100%, 310px);
  border-radius: 2rem;
  background: #eef2ee;
  border: 2px solid #d2dad4;
  padding: 0.55rem;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.lv-phone-notch {
  width: 44%;
  height: 0.95rem;
  background: var(--color-surface);
  border-radius: 0 0 1rem 1rem;
  margin: 0 auto 0.5rem;
}

.lv-phone-home-bar {
  width: 42%;
  height: 0.3rem;
  border-radius: 1rem;
  background: #b8c0bb;
  margin: 0.45rem auto 0.1rem;
}

.lv-phone-shadow {
  width: 70%;
  height: 1rem;
  margin: 0.7rem auto 0;
  border-radius: 999px;
  filter: blur(10px);
  background: color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.lv-stats-bar {
  border-top: 1px solid var(--color-outline-var);
  border-bottom: 1px solid var(--color-outline-var);
  background: color-mix(in srgb, var(--color-surface-high) 76%, transparent);
}

.lv-stats-inner {
  display: grid;
  grid-template-columns: repeat(7, auto);
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding-block: 1.2rem;
}

.lv-stat {
  display: grid;
  gap: 0.18rem;
  text-align: center;
}

.lv-stat-value {
  font-weight: 800;
  font-size: 1.35rem;
}

.lv-stat-label {
  color: var(--color-on-surface-var);
  font-size: 0.92rem;
}

.lv-stat-divider {
  width: 1px;
  height: 2rem;
  background: var(--color-outline-var);
}

.lv-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.lv-step {
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  background: var(--color-surface-high);
  padding: 1.2rem;
}

.lv-step-icon {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: var(--color-primary-container);
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin-bottom: 0.6rem;
}

.lv-step-desc {
  color: var(--color-on-surface-var);
}

.lv-impact {
  background: color-mix(in srgb, var(--color-primary-container) 35%, transparent);
}

.lv-impact-counters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.lv-impact-card {
  border-radius: 1rem;
  border: 1px solid var(--color-outline-var);
  background: var(--color-surface-high);
  padding: 1rem;
  text-align: center;
}

.lv-impact-icon {
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.lv-impact-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 900;
}

.lv-impact-label {
  color: var(--color-on-surface-var);
  font-size: 0.9rem;
}

.lv-download-inner {
  max-width: 900px;
}

.lv-dl-highlight {
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  background: var(--color-surface-high);
  padding: 1rem;
  margin: 0 auto 1rem;
  max-width: 720px;
}

.lv-dl-highlight p {
  color: var(--color-on-surface-var);
}

.lv-store-badges {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.lv-store-btn {
  border: 1px solid var(--color-outline-var);
  background: var(--color-surface-high);
  border-radius: 0.9rem;
  min-height: 64px;
  padding: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  font-weight: 700;
  color: var(--color-on-surface);
  cursor: pointer;
}

.lv-store-btn:hover {
  border-color: var(--color-primary);
}

.lv-store-btn-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.lv-windows-logo {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
}

.lv-btn {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.8rem 1.5rem;
  font-weight: 800;
  border: none;
}

.lv-btn-primary {
  background: var(--color-primary);
  color: var(--btn-primary-text);
}

.lv-coming-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 2000;
}

.lv-coming-modal {
  width: min(92vw, 420px);
  background: var(--color-surface-high);
  border: 1px solid var(--color-outline-var);
  border-radius: 1rem;
  padding: 1.25rem;
}

.lv-coming-modal p {
  color: var(--color-on-surface-var);
  margin: 0.4rem 0 1rem;
}

@media (max-width: 1024px) {
  .lv-hero-inner {
    grid-template-columns: 1fr;
  }

  .lv-stats-inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lv-stat-divider {
    display: none;
  }

  .lv-steps,
  .lv-impact-counters,
  .lv-store-badges {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lv-hero-downloads {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .lv-steps,
  .lv-impact-counters,
  .lv-store-badges {
    grid-template-columns: 1fr;
  }

  .lv-hero-downloads {
    grid-template-columns: 1fr;
    max-width: 320px;
  }
}
</style>
