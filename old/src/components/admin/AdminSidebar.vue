<script setup>
import { useRoute, useRouter } from 'vue-router'

defineProps({
  isOpen: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()

const navItems = [
  { route: '/admin', label: 'Dashboard Home', icon: 'home', exact: true },
  { route: '/admin/metrics', label: 'Metrics', icon: 'activity' },
  { route: '/admin/operations', label: 'Operations', icon: 'settings' },
  { route: '/admin/verifications', label: 'Verifications', icon: 'verify' },
]

const svgPaths = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  settings:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  verify: '<path d="M9 12l2 2 4-4"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
}

function isActive(item) {
  if (item.exact) return route.path === item.route
  return route.path.startsWith(item.route)
}

function navigate(item) {
  router.push(item.route)
  emit('close')
}
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
