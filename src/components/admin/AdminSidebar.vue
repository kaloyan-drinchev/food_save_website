<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { rand } from '@/composables/useAdminMock'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  activeSection: { type: String, default: 'sec-overview' },
})
const emit = defineEmits(['navigate', 'close'])

const navItems = [
  { id: 'sec-overview', label: 'Overview', icon: 'grid' },
  { id: 'sec-analytics', label: 'Analytics', icon: 'activity' },
  { id: 'sec-revenue', label: 'Revenue', icon: 'dollar' },
  { id: 'sec-partners', label: 'Partners', icon: 'users' },
  { id: 'sec-orders', label: 'Orders', icon: 'bag' },
  { id: 'sec-events', label: 'Events', icon: 'zap' },
]

const svgPaths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  zap: '<polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
}

const TEMPLATES = [
  { icon: '🛒', tpl: (n) => `<strong>${n}</strong> placed an order` },
  { icon: '✅', tpl: (n) => `<strong>${n}</strong> picked up order` },
  { icon: '🆕', tpl: (n) => `<strong>${n}</strong> joined the waitlist` },
  { icon: '⭐', tpl: (n) => `<strong>${n}</strong> left a 5-star review` },
  { icon: '🏪', tpl: (n) => `<strong>${n}</strong> added new items` },
  { icon: '📲', tpl: (n) => `<strong>${n}</strong> opened the app` },
  { icon: '🔍', tpl: (n) => `<strong>${n}</strong> searched for deals` },
  { icon: '💚', tpl: (n) => `<strong>${n}</strong> saved 2.3 kg of food` },
]

const NAMES = [
  'Ivan P.', 'Maria K.', 'Georgi S.', 'Elena D.', 'Nikolay T.',
  'Tsvetana R.', 'Happy Bite', 'Green Kitchen', 'Café Verde',
  'Златна Питка', 'Sofia Bistro', 'Dimitar H.', 'Silvia M.',
]

const activityItems = ref([])
let feedInterval = null

function addActivity() {
  const t = TEMPLATES[rand(0, TEMPLATES.length - 1)]
  const name = NAMES[rand(0, NAMES.length - 1)]
  const secs = rand(5, 120)
  const timeStr = secs < 60 ? `${secs}s ago` : `${Math.floor(secs / 60)}m ago`
  activityItems.value.unshift({ icon: t.icon, html: t.tpl(name), time: timeStr, key: Date.now() + Math.random() })
  if (activityItems.value.length > 8) activityItems.value.pop()
}

onMounted(() => {
  for (let i = 0; i < 4; i++) addActivity()
  feedInterval = setInterval(addActivity, rand(3000, 6000))
})

onUnmounted(() => {
  if (feedInterval) clearInterval(feedInterval)
})

function onNav(id) {
  emit('navigate', id)
}
</script>

<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Navigation</div>
      <button
        v-for="item in navItems"
        :key="item.id"
        class="sidebar-link"
        :class="{ active: activeSection === item.id }"
        @click="onNav(item.id)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="svgPaths[item.icon]"></svg>
        {{ item.label }}
      </button>
    </nav>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section-label">Live Activity</div>
    <div class="activity-feed">
      <div v-for="item in activityItems" :key="item.key" class="activity-item">
        <span class="activity-icon">{{ item.icon }}</span>
        <div>
          <div class="activity-text" v-html="item.html"></div>
          <div class="activity-time">{{ item.time }}</div>
        </div>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section-label">System Status</div>
    <div class="system-status">
      <div class="status-row"><span class="status-dot green"></span> API Server</div>
      <div class="status-row"><span class="status-dot green"></span> Database</div>
      <div class="status-row"><span class="status-dot green"></span> Payments</div>
      <div class="status-row"><span class="status-dot yellow"></span> Push Notifications</div>
    </div>
  </aside>

  <div class="sidebar-overlay" :class="{ visible: isOpen }" @click="emit('close')"></div>
</template>
