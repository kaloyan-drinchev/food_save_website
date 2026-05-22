<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api } from '@/services/api'

/* ---------- helpers ---------- */
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

function initials(name) {
  return (name || '?')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/* ---------- live activity ---------- */
const activityItems = ref([])
const notifications = ref([])
const partners = ref([])
const loading = ref(true)
let feedInterval = null

async function loadAll() {
  try {
    const [users, businesses, orders] = await Promise.all([
      api.admin.listUsers().catch(() => []),
      api.admin.listBusinesses().catch(() => []),
      api.admin.listOrders().catch(() => []),
    ])

    /* --- activity feed --- */
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
        html: `<strong>${b.companyName || 'Business #' + b.id}</strong> joined`,
      })
    }
    for (const o of Array.isArray(orders) ? orders : []) {
      const who = o.user ? userName(o.user) : `User #${o.userId}`
      events.push({
        ts: o.createdAt,
        icon: '🛒',
        html: `<strong>${who}</strong> placed an order`,
      })
    }
    events.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0))
    activityItems.value = events.slice(0, 6).map((e, i) => ({
      icon: e.icon,
      html: e.html,
      time: timeAgo(e.ts),
      key: (e.ts || '') + '-' + i,
    }))

    /* --- notifications (derived) --- */
    const userCount = (users || []).length
    const orderList = Array.isArray(orders) ? orders : []
    const pending = orderList.filter((o) => o.status === 'pending').length
    const unverified = (businesses || []).filter((b) => !b.isVerified).length
    const completedToday = orderList.filter((o) => {
      if (o.status !== 'completed' && o.status !== 'picked_up') return false
      const d = new Date(o.updatedAt || o.createdAt || 0)
      return d.toDateString() === new Date().toDateString()
    }).length

    notifications.value = [
      {
        id: 'n-users',
        tone: 'positive',
        icon: '👥',
        title: `${userCount} registered users`,
        time: 'Just now',
      },
      {
        id: 'n-pending',
        tone: pending > 0 ? 'warning' : 'neutral',
        icon: '⏳',
        title: `${pending} orders pending confirmation`,
        time: '5 minutes ago',
      },
      {
        id: 'n-completed',
        tone: 'positive',
        icon: '✅',
        title: `${completedToday} orders completed today`,
        time: 'Today',
      },
      {
        id: 'n-unverified',
        tone: unverified > 0 ? 'warning' : 'neutral',
        icon: '🏪',
        title: `${unverified} businesses awaiting verification`,
        time: 'Today 11:59',
      },
    ]

    /* --- business partners --- */
    partners.value = (Array.isArray(businesses) ? businesses : []).slice(0, 8).map((b) => ({
      id: b.id,
      name: b.companyName || 'Unnamed',
      email: b.email || b.contactEmail || `business${b.id}@foodsave.app`,
      type: b.businessType?.type || 'Partner',
      verified: !!b.isVerified,
    }))
  } finally {
    loading.value = false
  }
}

/* ---------- email modal ---------- */
const composeOpen = ref(false)
const composeTo = ref(null)
const composeSubject = ref('')
const composeBody = ref('')
const composeSending = ref(false)
const composeSent = ref(false)

function openCompose(p) {
  composeTo.value = p
  composeSubject.value = `FoodSave \u2014 message for ${p.name}`
  composeBody.value = `Hi ${p.name} team,\n\n`
  composeSent.value = false
  composeOpen.value = true
}

function closeCompose() {
  composeOpen.value = false
  composeTo.value = null
  composeSubject.value = ''
  composeBody.value = ''
  composeSending.value = false
  composeSent.value = false
}

function sendCompose() {
  // UI only — backend wiring later
  composeSending.value = true
  setTimeout(() => {
    composeSending.value = false
    composeSent.value = true
  }, 700)
}

const filteredPartners = computed(() => partners.value)

onMounted(() => {
  loadAll()
  feedInterval = setInterval(loadAll, 30000)
})
onUnmounted(() => {
  if (feedInterval) clearInterval(feedInterval)
})
</script>

<template>
  <aside class="right-sidebar">
    <!-- Notifications -->
    <section class="rs-section">
      <header class="rs-section-header">
        <h3 class="rs-section-title">Notifications</h3>
        <span class="rs-section-badge">{{ notifications.length }}</span>
      </header>
      <ul class="rs-list">
        <li
          v-for="n in notifications"
          :key="n.id"
          class="rs-notification"
          :class="`rs-notification--${n.tone}`"
        >
          <span class="rs-notification-icon">{{ n.icon }}</span>
          <div class="rs-notification-body">
            <div class="rs-notification-title">{{ n.title }}</div>
            <div class="rs-notification-time">{{ n.time }}</div>
          </div>
        </li>
      </ul>
    </section>

    <!-- Live Activity -->
    <section class="rs-section">
      <header class="rs-section-header">
        <h3 class="rs-section-title">Live Activity</h3>
        <span class="rs-pulse-dot" aria-hidden="true"></span>
      </header>
      <ul class="rs-list">
        <li v-if="!loading && activityItems.length === 0" class="rs-activity rs-activity--empty">
          <span class="rs-activity-icon">💤</span>
          <div class="rs-activity-body">
            <div class="rs-activity-text">No recent activity</div>
            <div class="rs-activity-time">Waiting for events…</div>
          </div>
        </li>
        <li v-for="a in activityItems" :key="a.key" class="rs-activity">
          <span class="rs-activity-icon">{{ a.icon }}</span>
          <div class="rs-activity-body">
            <div class="rs-activity-text" v-html="a.html"></div>
            <div class="rs-activity-time">{{ a.time }}</div>
          </div>
        </li>
      </ul>
    </section>

    <!-- Contact Business Partners -->
    <section class="rs-section">
      <header class="rs-section-header">
        <h3 class="rs-section-title">Contact your Business Partners</h3>
      </header>
      <ul class="rs-list rs-partners">
        <li v-for="p in filteredPartners" :key="p.id" class="rs-partner">
          <div class="rs-partner-avatar">{{ initials(p.name) }}</div>
          <div class="rs-partner-body">
            <div class="rs-partner-name">
              {{ p.name }}
              <span v-if="p.verified" class="rs-partner-verified" title="Verified partner">✓</span>
            </div>
            <div class="rs-partner-email">{{ p.email }}</div>
          </div>
          <div class="rs-partner-actions">
            <button type="button" class="rs-icon-btn" title="Send email" @click="openCompose(p)">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </button>
            <button
              type="button"
              class="rs-icon-btn rs-icon-btn--ghost"
              title="Call (coming soon)"
              disabled
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.68 2.74a2 2 0 0 1-.45 2.11L8.1 9.81a16 16 0 0 0 6 6l1.24-1.24a2 2 0 0 1 2.11-.45c.88.32 1.8.55 2.74.68A2 2 0 0 1 22 16.92z"
                />
              </svg>
            </button>
          </div>
        </li>
        <li v-if="!loading && partners.length === 0" class="rs-empty">No business partners yet.</li>
      </ul>
    </section>

    <!-- Compose modal -->
    <div v-if="composeOpen" class="rs-modal-backdrop" @click.self="closeCompose">
      <div class="rs-modal">
        <header class="rs-modal-header">
          <div>
            <h4 class="rs-modal-title">Send email</h4>
            <p class="rs-modal-sub">To {{ composeTo?.name }} &lt;{{ composeTo?.email }}&gt;</p>
          </div>
          <button class="rs-icon-btn" @click="closeCompose" title="Close">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>
        <div v-if="composeSent" class="rs-modal-success">
          ✅ Email queued (UI only — backend pending).
        </div>
        <template v-else>
          <label class="rs-modal-field">
            <span>Subject</span>
            <input v-model="composeSubject" type="text" />
          </label>
          <label class="rs-modal-field">
            <span>Message</span>
            <textarea v-model="composeBody" rows="6"></textarea>
          </label>
        </template>
        <footer class="rs-modal-footer">
          <button class="btn-sm" @click="closeCompose">
            {{ composeSent ? 'Close' : 'Cancel' }}
          </button>
          <button
            v-if="!composeSent"
            class="btn-sm btn-primary"
            :disabled="composeSending || !composeSubject || !composeBody"
            @click="sendCompose"
          >
            {{ composeSending ? 'Sending…' : 'Send' }}
          </button>
        </footer>
      </div>
    </div>
  </aside>
</template>
