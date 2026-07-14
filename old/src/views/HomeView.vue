<script setup>
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroCarousel from '@/components/home/HeroCarousel.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import DownloadSection from '@/components/home/DownloadSection.vue'
import WaitlistSection from '@/components/home/WaitlistSection.vue'
import FaqSection from '@/components/home/FaqSection.vue'
import ContactSection from '@/components/home/ContactSection.vue'

const { locale } = useI18n()

function updateTitle() {
  document.title = locale.value === 'bg'
    ? 'FoodSave — Спаси следващото си ястие'
    : 'FoodSave — Save Your Next Meal'
}

watch(locale, updateTitle)

onMounted(() => {
  updateTitle()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
})
</script>

<template>
  <AppNavbar />
  <HeroCarousel />
  <AboutSection />
  <DownloadSection />
  <WaitlistSection />
  <FaqSection />
  <ContactSection />
  <AppFooter />
</template>
