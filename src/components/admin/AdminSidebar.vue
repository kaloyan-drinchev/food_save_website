<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'

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
  settings:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
}

function isActive(item) {
  if (item.exact) return route.path === item.route
  return route.path.startsWith(item.route)
}

function navigate(item) {
  router.push(item.route)
  emit('close')
}

const activityItems = ref([])
const activityError = ref('')
let feedInterval = null

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function userName(u) {
  const first = u?.customer?.firstName || ''
  const last = u?.customer?.lastName || ''
  return [first, last].filter(Boolean).join(' ') || u?.email || `User #${u?.id}`
}

async function loadActivity() {
  try {
    const [users, businesses, orders] = await Promise.all([
      api.admin.listUsers().catch(() => []),
      api.admin.listBusinesses().catch(() => []),
      api.admin.listOrders().catch(() => []),
    ])

    const events = []

    for (const u of Array.isArray(users) ? users : []) {
      events.push({
        ts: u.createdAt,
        icon: '🆕',
        html: `<strong>${userName(u)}</strong> registered`,
      })
    }

    for (const b of Array.isArray(businesses) ? businesses : []) {
      events.push({
        ts: b.createdAt,
        icon: '🏪',
        html: `<strong>${b.companyName || 'Business #' + b.id}</strong> registered`,
      })
      if (b.isVerified && b.updatedAt && b.updatedAt !== b.createdAt) {
        events.push({
          ts: b.updatedAt,
          icon: '✅',
          html: `<strong>${b.companyName || 'Business #' + b.id}</strong> was verified`,
        })
      }
    }

    for (const o of Array.isArray(orders) ? orders : []) {
      const who = o.user ? userName(o.user) : `User #${o.userId}`
      events.push({
        ts: o.createdAt,
        icon: '🛒',
        html: `<strong>${who}</strong> placed an order`,
      })
      if (o.status === 'picked_up' || o.status === 'completed') {
        events.push({
          ts: o.updatedAt || o.createdAt,
          icon: '✅',
          html: `<strong>${who}</strong> picked up order`,
        })
      } else if (o.status === 'cancelled') {
        events.push({
          ts: o.updatedAt || o.createdAt,
          icon: '❌',
          html: `<strong>${who}</strong> cancelled order`,
        })
      }
    }

    events.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0))
    activityItems.value = events.slice(0, 8).map((e, i) => ({
      icon: e.icon,
      html: e.html,
      time: timeAgo(e.ts),
      key: (e.ts || '') + '-' + i,
    }))
    activityError.value = ''
  } catch (e) {
    activityError.value = e.message || 'Failed to load activity'
  }
}

onMounted(() => {
  loadActivity()
  feedInterval = setInterval(loadActivity, 30000)
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          v-html="svgPaths[item.icon]"
        ></svg>
        {{ item.label }}
      </button>
    </nav>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section-label">Live Activity</div>
    <div class="activity-feed">
      <div v-if="activityError" class="activity-item" style="color: #ef9a9a">
        <span class="activity-icon">⚠️</span>
        <div>
          <div class="activity-text">{{ activityError }}</div>
        </div>
      </div>
      <div
        v-else-if="activityItems.length === 0"
        class="activity-item"
        style="opacity: 0.6; font-size: 0.85rem"
      >
        <span class="activity-icon">💤</span>
        <div>
          <div class="activity-text">No recent activity</div>
          <div class="activity-time">Waiting for events…</div>
        </div>
      </div>
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
