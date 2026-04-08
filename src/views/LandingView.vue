<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import WaitlistSection from '@/components/home/WaitlistSection.vue'
import ContactSection from '@/components/home/ContactSection.vue'

const { t, locale } = useI18n()
const submitting = ref(false)
const showModal = ref(false)

async function onWaitlistSubmit(e) {
  const form = e.target
  submitting.value = true
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      form.reset()
      showModal.value = true
    }
  } finally {
    submitting.value = false
  }
}

function updateTitle() {
  document.title = t('landing.title')
}
watch(locale, updateTitle)

onMounted(() => {
  updateTitle()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lv-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  document.querySelectorAll('.lv-fade').forEach((el) => observer.observe(el))

  // Also handle .fade-in elements used by reused components (WaitlistSection, ContactSection)
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          fadeObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el))
})
</script>

<template>
  <AppNavbar />

  <main class="lv-main">

    <!-- ═══════════════════════════════════════════
         HERO
    ════════════════════════════════════════════ -->
    <section class="lv-hero">
      <div class="lv-container lv-hero-inner">
        <div class="lv-hero-content">
          <span class="lv-badge">{{ t('landing.hero_badge') }}</span>
          <h1 class="lv-hero-title">
            {{ t('landing.hero_title_line1') }}<br />
            <span class="lv-accent">{{ t('landing.hero_title_line2') }}</span>
          </h1>
          <p class="lv-hero-sub" v-html="t('landing.hero_sub')"></p>
          <div class="lv-hero-actions">
            <a href="#waitlist" class="lv-btn lv-btn-primary">{{ t('landing.hero_cta_waitlist') }}</a>
            <a href="#how-it-works" class="lv-btn lv-btn-ghost">{{ t('landing.hero_cta_how') }}</a>
          </div>
          <p class="lv-social-proof">
            <span class="lv-dot"></span> {{ t('landing.hero_social_proof') }}
          </p>
        </div>

        <!-- ══ Phone mockup placeholder ══ -->
        <div class="lv-phone-wrap lv-hero-phone">
          <div class="lv-phone-frame">
            <div class="lv-phone-notch"></div>
            <img src="/assets/images/landing/app-homepage-screen.jpg" alt="">
            <div class="lv-phone-home-bar" aria-hidden="true"></div>
          </div>
          <div class="lv-phone-shadow"></div>
        </div>
      </div>

      <!-- Decorative blobs -->
      <div class="lv-blob lv-blob-1" aria-hidden="true"></div>
      <div class="lv-blob lv-blob-2" aria-hidden="true"></div>
    </section>

    <!-- ═══════════════════════════════════════════
         STATS BAR
    ════════════════════════════════════════════ -->
    <div class="lv-stats-bar lv-fade">
      <div class="lv-container lv-stats-inner">
        <div class="lv-stat">
          <span class="lv-stat-value">{{ t('landing.stats_savings_value') }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_savings_label') }}</span>
        </div>
        <div class="lv-stat-divider" aria-hidden="true"></div>
        <div class="lv-stat">
          <span class="lv-stat-value">{{ t('landing.stats_waste_value') }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_waste_label') }}</span>
        </div>
        <div class="lv-stat-divider" aria-hidden="true"></div>
        <div class="lv-stat">
          <span class="lv-stat-value">{{ t('landing.stats_local_value') }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_local_label') }}</span>
        </div>
        <div class="lv-stat-divider" aria-hidden="true"></div>
        <div class="lv-stat">
          <span class="lv-stat-value">{{ t('landing.stats_country_value') }}</span>
          <span class="lv-stat-label">{{ t('landing.stats_country_label') }}</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════
         HOW IT WORKS
    ════════════════════════════════════════════ -->
    <section id="how-it-works" class="lv-section lv-fade">
      <div class="lv-container">
        <div class="lv-section-header">
          <span class="lv-section-label">{{ t('landing.how_label') }}</span>
          <h2 class="lv-section-title">{{ t('landing.how_title') }}</h2>
          <p class="lv-section-sub">{{ t('landing.how_sub') }}</p>
        </div>

        <div class="lv-steps">
          <div class="lv-step">
            <div class="lv-step-num">{{ t('landing.step1_num') }}</div>
            <div class="lv-step-icon">🔍</div>
            <h3 class="lv-step-title">{{ t('landing.step1_title') }}</h3>
            <p class="lv-step-desc">{{ t('landing.step1_desc') }}</p>
          </div>
          <div class="lv-step-arrow" aria-hidden="true">→</div>
          <div class="lv-step">
            <div class="lv-step-num">{{ t('landing.step2_num') }}</div>
            <div class="lv-step-icon">🛍️</div>
            <h3 class="lv-step-title">{{ t('landing.step2_title') }}</h3>
            <p class="lv-step-desc">{{ t('landing.step2_desc') }}</p>
          </div>
          <div class="lv-step-arrow" aria-hidden="true">→</div>
          <div class="lv-step">
            <div class="lv-step-num">{{ t('landing.step3_num') }}</div>
            <div class="lv-step-icon">✅</div>
            <h3 class="lv-step-title">{{ t('landing.step3_title') }}</h3>
            <p class="lv-step-desc">{{ t('landing.step3_desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         APP PREVIEW
    ════════════════════════════════════════════ -->
    <!-- ═══════════════════════════════════════════
         CONSUMER FEATURES
    ════════════════════════════════════════════ -->
    <section class="lv-section lv-cf lv-fade">
      <div class="lv-container">
        <div class="lv-section-header">
          <span class="lv-section-label">{{ t('landing.cf_label') }}</span>
          <h2 class="lv-section-title">{{ t('landing.cf_title') }}</h2>
          <p class="lv-section-sub">{{ t('landing.cf_sub') }}</p>
        </div>
        <div class="lv-cf-grid">
          <div class="lv-cf-card">
            <div class="lv-cf-icon">🔄</div>
            <h3 class="lv-cf-title">{{ t('landing.cf1_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf1_desc') }}</p>
          </div>
          <div class="lv-cf-card">
            <div class="lv-cf-icon">🗺️</div>
            <h3 class="lv-cf-title">{{ t('landing.cf2_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf2_desc') }}</p>
          </div>
          <div class="lv-cf-card">
            <div class="lv-cf-icon">❤️</div>
            <h3 class="lv-cf-title">{{ t('landing.cf3_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf3_desc') }}</p>
          </div>
          <div class="lv-cf-card">
            <div class="lv-cf-icon">💳</div>
            <h3 class="lv-cf-title">{{ t('landing.cf4_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf4_desc') }}</p>
          </div>
          <div class="lv-cf-card">
            <div class="lv-cf-icon">🎟️</div>
            <h3 class="lv-cf-title">{{ t('landing.cf5_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf5_desc') }}</p>
          </div>
          <div class="lv-cf-card">
            <div class="lv-cf-icon">⭐</div>
            <h3 class="lv-cf-title">{{ t('landing.cf6_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf6_desc') }}</p>
          </div>
          <div class="lv-cf-card">
            <div class="lv-cf-icon">🔔</div>
            <h3 class="lv-cf-title">{{ t('landing.cf7_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf7_desc') }}</p>
          </div>
          <div class="lv-cf-card">
            <div class="lv-cf-icon">🥦</div>
            <h3 class="lv-cf-title">{{ t('landing.cf8_title') }}</h3>
            <p class="lv-cf-desc">{{ t('landing.cf8_desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="lv-section lv-preview lv-fade">
      <div class="lv-container lv-preview-inner">
        <div class="lv-preview-phones">
          <!-- Phone 1 placeholder -->
          <div class="lv-phone-wrap lv-phone-back">
            <div class="lv-phone-frame lv-phone-sm">
              <div class="lv-phone-notch"></div>
              <img src="/assets/images/landing/app-browse-map.jpg" alt="">
              <div class="lv-phone-home-bar" aria-hidden="true"></div>
            </div>
          </div>
          <!-- Phone 2 placeholder -->
          <div class="lv-phone-wrap lv-phone-front">
            <div class="lv-phone-frame">
              <div class="lv-phone-notch"></div>
             <img src="/assets/images/landing/app-browse-list.jpg" alt="">
              <div class="lv-phone-home-bar" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <div class="lv-preview-features">
          <span class="lv-section-label">{{ t('landing.app_label') }}</span>
          <h2 class="lv-section-title lv-left">{{ t('landing.app_title') }}</h2>
          <ul class="lv-feature-list">
            <li class="lv-feature-item">
              <span class="lv-feature-icon">🗺️</span>
              <div>
                <strong>{{ t('landing.feat1_title') }}</strong>
                <p>{{ t('landing.feat1_desc') }}</p>
              </div>
            </li>
            <li class="lv-feature-item">
              <span class="lv-feature-icon">⚡</span>
              <div>
                <strong>{{ t('landing.feat2_title') }}</strong>
                <p>{{ t('landing.feat2_desc') }}</p>
              </div>
            </li>
            <li class="lv-feature-item">
              <span class="lv-feature-icon">🎟️</span>
              <div>
                <strong>{{ t('landing.feat3_title') }}</strong>
                <p>{{ t('landing.feat3_desc') }}</p>
              </div>
            </li>
            <li class="lv-feature-item">
              <span class="lv-feature-icon">🌍</span>
              <div>
                <strong>{{ t('landing.feat4_title') }}</strong>
                <p>{{ t('landing.feat4_desc') }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         FOR BUSINESSES
    ════════════════════════════════════════════ -->
    <!-- ═══════════════════════════════════════════
         BUSINESS SUITE
    ════════════════════════════════════════════ -->
    <section class="lv-section lv-bs lv-fade">
      <div class="lv-container">
        <div class="lv-section-header">
          <span class="lv-section-label">{{ t('landing.bs_label') }}</span>
          <h2 class="lv-section-title">{{ t('landing.bs_title') }}</h2>
          <p class="lv-section-sub">{{ t('landing.bs_sub') }}</p>
        </div>
        <div class="lv-bs-grid">
          <div class="lv-bs-card">
            <div class="lv-bs-icon">{{ t('landing.bs1_icon') }}</div>
            <h3 class="lv-bs-title">{{ t('landing.bs1_title') }}</h3>
            <p class="lv-bs-desc">{{ t('landing.bs1_desc') }}</p>
          </div>
          <div class="lv-bs-card lv-bs-card--accent">
            <div class="lv-bs-icon">{{ t('landing.bs2_icon') }}</div>
            <h3 class="lv-bs-title">{{ t('landing.bs2_title') }}</h3>
            <p class="lv-bs-desc">{{ t('landing.bs2_desc') }}</p>
          </div>
          <div class="lv-bs-card">
            <div class="lv-bs-icon">{{ t('landing.bs3_icon') }}</div>
            <h3 class="lv-bs-title">{{ t('landing.bs3_title') }}</h3>
            <p class="lv-bs-desc">{{ t('landing.bs3_desc') }}</p>
          </div>
          <div class="lv-bs-card">
            <div class="lv-bs-icon">{{ t('landing.bs4_icon') }}</div>
            <h3 class="lv-bs-title">{{ t('landing.bs4_title') }}</h3>
            <p class="lv-bs-desc">{{ t('landing.bs4_desc') }}</p>
          </div>
          <div class="lv-bs-card lv-bs-card--accent">
            <div class="lv-bs-icon">{{ t('landing.bs5_icon') }}</div>
            <h3 class="lv-bs-title">{{ t('landing.bs5_title') }}</h3>
            <p class="lv-bs-desc">{{ t('landing.bs5_desc') }}</p>
          </div>
          <div class="lv-bs-card">
            <div class="lv-bs-icon">{{ t('landing.bs6_icon') }}</div>
            <h3 class="lv-bs-title">{{ t('landing.bs6_title') }}</h3>
            <p class="lv-bs-desc">{{ t('landing.bs6_desc') }}</p>
          </div>
        </div>
        <div class="lv-bs-cta">
          <a href="#waitlist" class="lv-btn lv-btn-primary">{{ t('landing.biz_cta') }}</a>
        </div>
      </div>
    </section>

    <section class="lv-section lv-biz lv-fade">
      <div class="lv-container lv-biz-inner">
        <div class="lv-biz-content">
          <span class="lv-section-label">{{ t('landing.biz_label') }}</span>
          <h2 class="lv-section-title lv-left">{{ t('landing.biz_title') }}</h2>
          <p class="lv-biz-sub">{{ t('landing.biz_sub') }}</p>
          <ul class="lv-biz-list">
            <li><span>🍞</span> {{ t('landing.biz_type1') }}</li>
            <li><span>🍕</span> {{ t('landing.biz_type2') }}</li>
            <li><span>🛒</span> {{ t('landing.biz_type3') }}</li>
            <li><span>🍹</span> {{ t('landing.biz_type4') }}</li>
          </ul>
          <a href="#waitlist" class="lv-btn lv-btn-primary" style="margin-top:1.5rem">
            {{ t('landing.biz_cta') }}
          </a>
        </div>

        <!-- Phone 3 placeholder -->
        <div class="lv-phone-wrap lv-biz-phone">
          <div class="lv-phone-frame">
            <div class="lv-phone-notch"></div>
            <img src="/assets/images/landing/app-browse-list.jpg" alt="">
            <div class="lv-phone-home-bar" aria-hidden="true"></div>
          </div>
          <div class="lv-phone-shadow"></div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         DOWNLOAD
    ════════════════════════════════════════════ -->
    <section id="download" class="lv-section lv-download lv-fade">
      <div class="lv-container">
        <div class="lv-section-header">
          <span class="lv-section-label">{{ t('landing.dl_label') }}</span>
          <h2 class="lv-section-title">{{ t('landing.dl_title') }}</h2>
          <p class="lv-section-sub">{{ t('landing.dl_sub') }}</p>
        </div>

        <div class="lv-dl-grid">
          <div class="lv-dl-card">
            <div class="lv-dl-icon">📱</div>
            <h3>{{ t('landing.dl_client_title') }}</h3>
            <p>{{ t('landing.dl_client_desc') }}</p>
            <div class="lv-store-badges">
              <div class="lv-store-badge">
                <FontAwesomeIcon :icon="['fab', 'google-play']" class="lv-badge-icon" />
                <div>
                  <div class="lv-badge-sm">{{ t('landing.dl_play_sm') }}</div>
                  <div class="lv-badge-lg">{{ t('landing.dl_play_lg') }}</div>
                </div>
                <span class="lv-soon">{{ t('landing.dl_soon') }}</span>
              </div>
              <div class="lv-store-badge">
                <FontAwesomeIcon :icon="['fab', 'app-store-ios']" class="lv-badge-icon" />
                <div>
                  <div class="lv-badge-sm">{{ t('landing.dl_apple_sm') }}</div>
                  <div class="lv-badge-lg">{{ t('landing.dl_apple_lg') }}</div>
                </div>
                <span class="lv-soon">{{ t('landing.dl_soon') }}</span>
              </div>
            </div>
          </div>

          <div class="lv-dl-card lv-dl-card-biz">
            <div class="lv-dl-icon">🏪</div>
            <h3>{{ t('landing.dl_biz_title') }}</h3>
            <p>{{ t('landing.dl_biz_desc') }}</p>
            <div class="lv-store-badges">
              <div class="lv-store-badge">
                <FontAwesomeIcon :icon="['fab', 'google-play']" class="lv-badge-icon" />
                <div>
                  <div class="lv-badge-sm">{{ t('landing.dl_play_sm') }}</div>
                  <div class="lv-badge-lg">{{ t('landing.dl_play_lg') }}</div>
                </div>
                <span class="lv-soon">{{ t('landing.dl_soon') }}</span>
              </div>
              <div class="lv-store-badge">
                <FontAwesomeIcon :icon="['fab', 'app-store-ios']" class="lv-badge-icon" />
                <div>
                  <div class="lv-badge-sm">{{ t('landing.dl_apple_sm') }}</div>
                  <div class="lv-badge-lg">{{ t('landing.dl_apple_lg') }}</div>
                </div>
                <span class="lv-soon">{{ t('landing.dl_soon') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         WAITLIST  (reused component)
    ════════════════════════════════════════════ -->
    <WaitlistSection />

    <!-- ═══════════════════════════════════════════
         CONTACT  (reused component)
    ════════════════════════════════════════════ -->
    <ContactSection />

  </main>

  <AppFooter />
</template>

<style scoped>
/* ══════════════════════════════════════════════
   Layout & base
══════════════════════════════════════════════ */
.lv-main {
  overflow-x: hidden;
}

.lv-container {
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2.5rem);
}

/* ── Fade-in animation ─────────────────────── */
.lv-fade {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.lv-fade.lv-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ══════════════════════════════════════════════
   Common section chrome
══════════════════════════════════════════════ */
.lv-section {
  padding-block: clamp(4rem, 8vw, 6rem);
}

.lv-section-header {
  text-align: center;
  max-width: 640px;
  margin-inline: auto;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.lv-section-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-primary);
  margin-bottom: 0.75rem;
}

.lv-section-title {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.75rem;
  color: var(--color-on-surface);
}
.lv-section-title.lv-left {
  text-align: left;
}

.lv-section-sub {
  font-size: 1.05rem;
  color: var(--color-on-surface-var);
  line-height: 1.7;
}

/* ══════════════════════════════════════════════
   Hero
══════════════════════════════════════════════ */
.lv-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-top: calc(var(--nav-height) + 2rem);
  padding-bottom: 4rem;
  overflow: hidden;
  background: var(--color-surface);
}

.lv-hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .lv-hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .lv-hero-content {
    align-items: center;
  }
  .lv-hero-phone {
    order: -1;
    display: flex;
    justify-content: center;
  }
  .lv-hero-actions {
    justify-content: center;
  }
  .lv-social-proof {
    justify-content: center;
  }
  .lv-hero-sub {
    max-width: 100%;
  }
}

.lv-hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lv-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-full);
  background: var(--color-primary-container);
  color: var(--color-primary);
  width: fit-content;
}

.lv-hero-title {
  font-size: clamp(2.5rem, 5.5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.08;
  color: var(--color-on-surface);
}

.lv-accent {
  color: var(--color-primary);
}

.lv-hero-sub {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: var(--color-on-surface-var);
  line-height: 1.7;
  max-width: 480px;
}

.lv-hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

/* Buttons */
.lv-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 1.75rem;
  border-radius: var(--radius-full);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
  text-decoration: none;
  border: none;
}

.lv-btn-primary {
  background: var(--color-primary);
  color: var(--btn-primary-text);
}
.lv-btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  color: var(--btn-primary-text);
}

.lv-btn-ghost {
  background: transparent;
  color: var(--color-on-surface);
  border: 2px solid var(--color-outline);
}
.lv-btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.lv-social-proof {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-on-surface-var);
}

.lv-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
  animation: lv-pulse 2s infinite;
}

@keyframes lv-pulse {
  0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent); }
  50%       { box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-primary) 10%, transparent); }
}

/* Blobs */
.lv-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.35;
}
.lv-blob-1 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
  top: -100px; right: -80px;
}
.lv-blob-2 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%);
  bottom: -60px; left: -60px;
}

/* ══════════════════════════════════════════════
   Phone frames
══════════════════════════════════════════════ */
.lv-phone-wrap {
  position: relative;
  display: flex;
  justify-content: center;
}

.lv-phone-frame {
  position: relative;
  width: 240px;
  border-radius: 36px;
  background: #f5f5f5;
  border: 3px solid var(--color-outline-var);
  overflow: hidden;
  box-shadow:
    0 30px 60px rgba(0,0,0,0.3),
    inset 0 0 0 1px var(--color-glass-border);
}

.lv-phone-notch {
  width: 80px;
  height: 22px;
  background: var(--color-surface-high);
  border-radius: 0 0 14px 14px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  border: 3px solid var(--color-outline-var);
  border-top: none;
}

.lv-phone-screen {
  width: 100%;
  aspect-ratio: 400/785;
}

.lv-phone-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--color-surface-mid);
  padding: 1rem;
  border: 2px dashed var(--color-outline);
}

.lv-ph-icon {
  font-size: 2.5rem;
  line-height: 1;
  opacity: 0.5;
}

.lv-ph-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-on-surface-var);
  text-align: center;
}

.lv-ph-hint {
  font-size: 0.6rem;
  color: var(--color-outline);
  text-align: center;
}

.lv-phone-home-bar {
  width: 34%;
  height: 4px;
  background: var(--color-on-surface);
  opacity: 0.25;
  border-radius: var(--radius-full);
  margin: 6px auto 10px;
}

.lv-phone-shadow {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 24px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%);
  filter: blur(6px);
}

.lv-phone-sm .lv-phone-screen {
  aspect-ratio: 400/785;
}

/* ══════════════════════════════════════════════
   Stats bar
══════════════════════════════════════════════ */
.lv-stats-bar {
  background: var(--color-surface-mid);
  border-top: 1px solid var(--color-outline-var);
  border-bottom: 1px solid var(--color-outline-var);
  padding-block: 1.75rem;
}

.lv-stats-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.lv-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.lv-stat-value {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  color: var(--color-primary);
  font-family: var(--font-heading);
}

.lv-stat-label {
  font-size: 0.78rem;
  color: var(--color-on-surface-var);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}

.lv-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-outline-var);
}

@media (max-width: 480px) {
  .lv-stat-divider { display: none; }
}

/* ══════════════════════════════════════════════
   How It Works
══════════════════════════════════════════════ */
.lv-steps {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.lv-step {
  flex: 1;
  min-width: 200px;
  max-width: 280px;
  background: var(--color-surface-mid);
  border: 1px solid var(--color-outline-var);
  border-radius: var(--radius-lg);
  padding: 2rem 1.5rem;
  text-align: center;
  position: relative;
  transition: transform var(--transition), box-shadow var(--transition);
}
.lv-step:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--color-card-glow);
}

.lv-step-num {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.lv-step-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.lv-step-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--color-on-surface);
}

.lv-step-desc {
  font-size: 0.9rem;
  color: var(--color-on-surface-var);
  line-height: 1.65;
}

.lv-step-arrow {
  font-size: 1.5rem;
  color: var(--color-outline);
  align-self: center;
  flex-shrink: 0;
}

@media (max-width: 680px) {
  .lv-step-arrow { display: none; }
}

/* ══════════════════════════════════════════════
   App Preview
══════════════════════════════════════════════ */
.lv-preview {
  background: var(--color-surface-mid);
}

.lv-preview-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 768px) {
  .lv-preview-inner {
    grid-template-columns: 1fr;
  }
}

.lv-preview-phones {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: -1rem;
  height: 520px;
}

.lv-phone-back {
  position: absolute;
  left: 0;
  bottom: 0;
  transform: rotate(-6deg) scale(0.88);
  z-index: 0;
  opacity: 0.7;
}

.lv-phone-front {
  position: relative;
  z-index: 1;
  right: -20px;
  bottom: 0;
}

@media (max-width: 768px) {
  .lv-preview-phones {
    height: auto;
    min-height: 340px;
    order: -1;
    justify-content: center;
  }
  .lv-phone-back {
    left: auto;
    right: 50%;
    margin-right: -30px;
  }
}

.lv-feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.lv-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.lv-feature-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 2px;
}

.lv-feature-item strong {
  display: block;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: var(--color-on-surface);
}

.lv-feature-item p {
  font-size: 0.9rem;
  color: var(--color-on-surface-var);
  line-height: 1.6;
  margin: 0;
}

/* ══════════════════════════════════════════════
   Consumer Features Grid
══════════════════════════════════════════════ */
.lv-cf {
  background: var(--color-surface);
}

.lv-section-sub {
  max-width: 600px;
  margin: 0.75rem auto 0;
  color: var(--color-on-surface-var);
  font-size: 1rem;
  line-height: 1.7;
  text-align: center;
}

.lv-cf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.lv-cf-card {
  background: var(--color-surface-mid);
  border: 1px solid var(--color-outline-var);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.25rem;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lv-cf-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.lv-cf-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.lv-cf-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 0.5rem;
}

.lv-cf-desc {
  font-size: 0.875rem;
  color: var(--color-on-surface-var);
  line-height: 1.6;
  margin: 0;
}

/* ══════════════════════════════════════════════
   Business Suite
══════════════════════════════════════════════ */
.lv-bs {
  background: var(--color-surface-high);
}

.lv-bs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.lv-bs-card {
  background: var(--color-surface-mid);
  border: 1px solid var(--color-outline-var);
  border-radius: var(--radius-lg);
  padding: 1.75rem 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.lv-bs-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}

.lv-bs-card--accent {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-mid));
}

.lv-bs-icon {
  font-size: 2rem;
  margin-bottom: 0.85rem;
  line-height: 1;
}

.lv-bs-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 0.5rem;
}

.lv-bs-desc {
  font-size: 0.875rem;
  color: var(--color-on-surface-var);
  line-height: 1.65;
  margin: 0;
}

.lv-bs-cta {
  text-align: center;
  margin-top: 2.5rem;
}

@media (max-width: 768px) {
  .lv-cf-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .lv-bs-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .lv-cf-grid {
    grid-template-columns: 1fr;
  }
}

/* ══════════════════════════════════════════════
   For Businesses
══════════════════════════════════════════════ */
.lv-biz {
  background: var(--color-surface);
}

.lv-biz-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 768px) {
  .lv-biz-inner {
    grid-template-columns: 1fr;
  }
  .lv-biz-phone {
    order: -1;
    justify-content: center;
  }
}

.lv-biz-sub {
  font-size: 1.05rem;
  color: var(--color-on-surface-var);
  line-height: 1.7;
  margin-top: 0.75rem;
  max-width: 480px;
}

.lv-biz-list {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.lv-biz-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-on-surface);
  background: var(--color-surface-mid);
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-outline-var);
}

@media (max-width: 480px) {
  .lv-biz-list {
    grid-template-columns: 1fr;
  }
}

/* ══════════════════════════════════════════════
   Download
══════════════════════════════════════════════ */
.lv-download {
  background: var(--color-surface-mid);
}

.lv-dl-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .lv-dl-grid { grid-template-columns: 1fr; }
}

.lv-dl-card {
  background: var(--color-surface);
  border: 1px solid var(--color-outline-var);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

.lv-dl-card-biz {
  border-color: var(--color-accent-container);
}

.lv-dl-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.lv-dl-card h3 {
  font-weight: 800;
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
  color: var(--color-on-surface);
}

.lv-dl-card p {
  font-size: 0.9rem;
  color: var(--color-on-surface-var);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.lv-store-badges {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lv-store-badge {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: var(--color-surface-mid);
  border: 1px solid var(--color-outline-var);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  position: relative;
}

.lv-badge-icon {
  font-size: 1.4rem;
  width: 1.4rem;
  height: 1.4rem;
  flex-shrink: 0;
  color: var(--color-on-surface);
}

.lv-badge-sm {
  font-size: 0.65rem;
  color: var(--color-on-surface-var);
}

.lv-badge-lg {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.lv-soon {
  margin-left: auto;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
  background: var(--color-primary-container);
  color: var(--color-primary);
}
</style>
