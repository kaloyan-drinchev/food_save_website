<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const current = ref(0)
const total = 4
let touchStartX = 0

const slideTransform = computed(() => `translateX(-${current.value * 25}%)`)
const btnKey = computed(() => current.value === total - 1 ? 'hero.cta_start' : 'hero.cta_next')

function goTo(index) {
  current.value = Math.max(0, Math.min(index, total - 1))
}

function next() {
  if (current.value < total - 1) {
    goTo(current.value + 1)
  } else {
    const about = document.getElementById('about')
    if (about) about.scrollIntoView({ behavior: 'smooth' })
  }
}

function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    diff > 0 ? goTo(current.value + 1) : goTo(current.value - 1)
  }
}
</script>

<template>
  <section id="hero">
    <div class="hero-carousel" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <a href="#about" class="slide-skip">{{ t('hero.skip') }}</a>

      <div class="hero-slides" :style="{ transform: slideTransform }">
        <!-- Slide 1: Discovery -->
        <div class="hero-slide" style="background:linear-gradient(160deg,#0d1f0e 0%,#1a2e1b 40%,#2e4a2f 100%)">
          <div class="slide-illustration">
            <div class="orbit-center" style="background:radial-gradient(circle,#2E7D32,#1B5E20);box-shadow:0 0 40px rgba(46,125,50,.35)">🔍</div>
            <div class="orbit-items orbit-spin">
              <div class="orbit-item" style="--a:0deg;background:#FF8F00;box-shadow:0 2px 8px rgba(255,143,0,.3)">🍕</div>
              <div class="orbit-item" style="--a:72deg;background:#4CAF50;box-shadow:0 2px 8px rgba(76,175,80,.3)">🥗</div>
              <div class="orbit-item" style="--a:144deg;background:#FF5722;box-shadow:0 2px 8px rgba(255,87,34,.3)">🥐</div>
              <div class="orbit-item" style="--a:216deg;background:#7B1FA2;box-shadow:0 2px 8px rgba(123,31,162,.3)">🍱</div>
              <div class="orbit-item" style="--a:288deg;background:#00838F;box-shadow:0 2px 8px rgba(0,131,143,.3)">🧁</div>
            </div>
          </div>
          <h2 class="slide-title">{{ t('hero.slide1_title') }}</h2>
          <p class="slide-subtitle">{{ t('hero.slide1_subtitle') }}</p>
        </div>

        <!-- Slide 2: Savings -->
        <div class="hero-slide" style="background:linear-gradient(160deg,#1a0e00 0%,#3E2723 40%,#4E342E 100%)">
          <div class="slide-illustration">
            <div class="orbit-center" style="background:radial-gradient(circle,#FF8F00,#E65100);box-shadow:0 0 40px rgba(255,143,0,.35)">
              <div class="discount-label"><strong>70%</strong><small>OFF</small></div>
            </div>
            <div class="orbit-items orbit-float">
              <div class="orbit-badge" style="--a:30deg">🍕 -50%</div>
              <div class="orbit-badge" style="--a:110deg">🥗 -65%</div>
              <div class="orbit-badge" style="--a:190deg">🥐 -40%</div>
              <div class="orbit-badge" style="--a:280deg">🍱 -70%</div>
            </div>
          </div>
          <h2 class="slide-title">{{ t('hero.slide2_title') }}</h2>
          <p class="slide-subtitle">{{ t('hero.slide2_subtitle') }}</p>
        </div>

        <!-- Slide 3: Eco -->
        <div class="hero-slide" style="background:linear-gradient(160deg,#002910 0%,#004D40 40%,#00695C 100%)">
          <div class="slide-illustration eco-glow">
            <div class="orbit-center" style="background:radial-gradient(circle,#4CAF50,#2E7D32);box-shadow:0 0 50px rgba(76,175,80,.4)">🌍</div>
            <div class="particle" style="--x:15%;--y:20%;--s:10px;--d:0s"></div>
            <div class="particle" style="--x:75%;--y:15%;--s:6px;--d:1.2s"></div>
            <div class="particle" style="--x:80%;--y:70%;--s:12px;--d:2.5s"></div>
            <div class="particle" style="--x:25%;--y:80%;--s:8px;--d:0.8s"></div>
            <div class="particle" style="--x:50%;--y:10%;--s:7px;--d:1.8s"></div>
            <div class="particle" style="--x:10%;--y:55%;--s:9px;--d:3.2s"></div>
            <div class="orbit-items orbit-spin">
              <div class="orbit-item" style="--a:0deg;background:rgba(165,214,167,.25);backdrop-filter:blur(4px)">🌱</div>
              <div class="orbit-item" style="--a:90deg;background:rgba(165,214,167,.25);backdrop-filter:blur(4px)">♻️</div>
              <div class="orbit-item" style="--a:180deg;background:rgba(165,214,167,.25);backdrop-filter:blur(4px)">💚</div>
              <div class="orbit-item" style="--a:270deg;background:rgba(165,214,167,.25);backdrop-filter:blur(4px)">🍃</div>
            </div>
          </div>
          <h2 class="slide-title">{{ t('hero.slide3_title') }}</h2>
          <p class="slide-subtitle">{{ t('hero.slide3_subtitle') }}</p>
        </div>

        <!-- Slide 4: Community -->
        <div class="hero-slide" style="background:linear-gradient(160deg,#0d1f0e 0%,#1B5E20 40%,#2E7D32 100%)">
          <div class="slide-illustration">
            <div class="orbit-center" style="background:radial-gradient(circle,#69F0AE,#00C853);box-shadow:0 0 50px rgba(105,240,174,.4)">🤝</div>
            <div class="orbit-items orbit-spin">
              <div class="orbit-item person-green" style="--a:0deg;box-shadow:0 2px 8px rgba(46,125,50,.4)">👩</div>
              <div class="orbit-item person-orange" style="--a:60deg;box-shadow:0 2px 8px rgba(216,67,21,.4)">🏪</div>
              <div class="orbit-item person-green" style="--a:120deg;box-shadow:0 2px 8px rgba(46,125,50,.4)">👨</div>
              <div class="orbit-item person-orange" style="--a:180deg;box-shadow:0 2px 8px rgba(216,67,21,.4)">🍽️</div>
              <div class="orbit-item person-green" style="--a:240deg;box-shadow:0 2px 8px rgba(46,125,50,.4)">👩‍🍳</div>
              <div class="orbit-item person-orange" style="--a:300deg;box-shadow:0 2px 8px rgba(216,67,21,.4)">🛒</div>
            </div>
          </div>
          <h2 class="slide-title">{{ t('hero.slide4_title') }}</h2>
          <p class="slide-subtitle">{{ t('hero.slide4_subtitle') }}</p>
        </div>
      </div>

      <div class="hero-dots" id="hero-dots">
        <span v-for="i in total" :key="i" class="hero-dot" :class="{ active: current === i - 1 }" @click="goTo(i - 1)"></span>
      </div>

      <button class="hero-carousel-btn" @click="next">{{ t(btnKey) }}</button>
    </div>
  </section>
</template>
