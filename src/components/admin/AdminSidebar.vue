<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { rand } from '@/composables/useAdminMock'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()

const navItems = [
  { route: '/admin', label: 'Dashboard Home', icon: 'home', exact: true },
  { route: '/admin/metrics', label: 'Metrics', icon: 'activity' },
  { route: '/admin/operations', label: 'Operations', icon: 'settings' },
]

const svgPaths = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  settings: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
}

function isActive(item) {
  if (item.exact) return route.path === item.route
  return route.path.startsWith(item.route)
}

function navigate(item) {
  router.push(item.route)
  emit('close')
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
</script>

<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Navigation</div>
      <button
        v-for="item in navItems"
        :key="item.route"
        class="sidebar-link"
        :class="{ active: isActive(item) }"
        @click="navigate(item)"
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
