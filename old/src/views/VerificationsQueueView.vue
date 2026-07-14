<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const router = useRouter()

const businesses = ref([])
const loading = ref(true)
const error = ref('')

// Filters
const filterStatus = ref('notValidated') // 'notValidated' | 'validated' | 'all'
const search = ref('')
const sortDir = ref('desc') // 'desc' = newest first

// Pagination (client-side until BE pagination is wired)
const page = ref(1)
const pageSize = 20

const statusOptions = [
  { value: 'notValidated', label: 'Pending / Rejected' },
  { value: 'validated', label: 'Approved' },
  { value: 'all', label: 'All' },
]

function mapRow(b) {
  // Cert count is filled in lazily by load() (per-business GET /certificates?businessId=).
  const loc = b.locations?.[0] || {}
  return {
    id: String(b.id),
    name: b.companyName || b.name || 'Unnamed',
    ownerEmail: b.ownerEmail || b.owner?.email || b.email || '—',
    city: loc.city || b.city || '—',
    submittedAt: b.submittedAt || b.createdAt || null,
    submittedAtLabel: formatDate(b.submittedAt || b.createdAt),
    submittedAtSort: new Date(b.submittedAt || b.createdAt || 0).getTime(),
    certificateCount: null, // null = unknown / loading
    status: b.status || (b.isVerified ? 'validated' : 'notValidated'),
  }
}

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await api.admin.listBusinessesByStatus({
      status: filterStatus.value,
      page: 1,
      limit: 200,
    })
    const list = Array.isArray(data) ? data : data?.items || data?.data || []
    const rows = list.map(mapRow)
    businesses.value = rows
    // Fan-out cert counts in parallel (best-effort; failures leave count as null).
    await Promise.all(
      rows.map(async (row) => {
        try {
          const certs = await api.admin.listCertificates(row.id)
          row.certificateCount = Array.isArray(certs) ? certs.length : 0
        } catch {
          row.certificateCount = 0
        }
      }),
    )
    businesses.value = [...rows]
  } catch (e) {
    error.value = e.message || 'Failed to load businesses'
    businesses.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)

const filtered = computed(() => {
  let list = businesses.value
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.ownerEmail.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q),
    )
  }
  list = [...list].sort((a, b) =>
    sortDir.value === 'desc'
      ? b.submittedAtSort - a.submittedAtSort
      : a.submittedAtSort - b.submittedAtSort,
  )
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function review(b) {
  router.push({ name: 'admin-verification-review', params: { businessId: b.id } })
}

function statusBadgeClass(s) {
  if (s === 'validated') return 'badge badge--ok'
  if (s === 'rejected') return 'badge badge--err'
  return 'badge badge--warn'
}

function statusLabel(s) {
  if (s === 'validated') return 'Approved'
  if (s === 'rejected') return 'Rejected'
  return 'Pending'
}
</script>

<template>
  <div class="ver-page">
    <div class="ver-header">
      <div>
        <h1 class="ver-title">Business Verifications</h1>
        <p class="ver-subtitle">
          Review pending businesses and approve or reject their certificates.
        </p>
      </div>
      <button class="ver-refresh" :disabled="loading" @click="load">
        {{ loading ? 'Loading…' : '↻ Refresh' }}
      </button>
    </div>

    <div class="ver-toolbar">
      <div class="ver-filter-group">
        <label class="ver-label">Status</label>
        <select v-model="filterStatus" class="ver-select" @change="load">
          <option v-for="o in statusOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
      <div class="ver-filter-group">
        <label class="ver-label">Search</label>
        <input
          v-model="search"
          class="ver-input"
          type="text"
          placeholder="Name, owner email, or city…"
        />
      </div>
      <div class="ver-filter-group">
        <label class="ver-label">Sort by submission</label>
        <select v-model="sortDir" class="ver-select">
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="ver-error">⚠ {{ error }}</div>

    <div class="ver-table-wrap">
      <table class="ver-table">
        <thead>
          <tr>
            <th>Business</th>
            <th>Owner email</th>
            <th>City</th>
            <th>Submitted</th>
            <th>Certificates</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="ver-empty">Loading…</td>
          </tr>
          <tr v-else-if="!paged.length">
            <td colspan="7" class="ver-empty">No businesses match the current filters.</td>
          </tr>
          <tr v-for="b in paged" :key="b.id">
            <td class="ver-cell-strong">{{ b.name }}</td>
            <td>{{ b.ownerEmail }}</td>
            <td>{{ b.city }}</td>
            <td>{{ b.submittedAtLabel }}</td>
            <td>
              <span
                :class="
                  b.certificateCount == null
                    ? 'badge'
                    : b.certificateCount === 2
                      ? 'badge badge--ok'
                      : 'badge badge--warn'
                "
              >
                {{ b.certificateCount == null ? '…' : b.certificateCount }} / 2
              </span>
            </td>
            <td>
              <span :class="statusBadgeClass(b.status)">{{ statusLabel(b.status) }}</span>
            </td>
            <td class="ver-cell-actions">
              <button class="ver-btn ver-btn--primary" @click="review(b)">Review</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="ver-pagination">
      <button class="ver-btn" :disabled="page === 1" @click="page--">‹ Prev</button>
      <span class="ver-page-info">Page {{ page }} / {{ totalPages }}</span>
      <button class="ver-btn" :disabled="page === totalPages" @click="page++">Next ›</button>
    </div>
  </div>
</template>

<style scoped>
.ver-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ver-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.ver-title {
  font-size: 1.6rem;
  color: var(--fs-on-surface);
  margin-bottom: 4px;
}
.ver-subtitle {
  color: var(--fs-on-surface-var);
  font-size: 0.9rem;
}
.ver-refresh {
  background: var(--fs-surface-mid);
  color: var(--fs-on-surface);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius-sm);
  padding: 10px 16px;
  cursor: pointer;
  font-family: var(--fs-font);
  font-weight: 600;
  transition: background var(--fs-transition);
}
.ver-refresh:hover:not(:disabled) {
  background: var(--fs-surface-high);
}
.ver-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ver-toolbar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  background: var(--fs-surface-mid);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius);
  padding: 16px;
}
.ver-filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
  flex: 1;
}
.ver-label {
  color: var(--fs-on-surface-var);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.ver-select,
.ver-input {
  background: var(--fs-surface);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius-sm);
  color: var(--fs-on-surface);
  padding: 10px 12px;
  font-family: var(--fs-font);
  font-size: 0.95rem;
}
.ver-select:focus,
.ver-input:focus {
  outline: none;
  border-color: var(--fs-primary);
}

.ver-error {
  background: rgba(239, 154, 154, 0.1);
  border: 1px solid var(--fs-error);
  color: var(--fs-error);
  padding: 12px 16px;
  border-radius: var(--fs-radius-sm);
}

.ver-table-wrap {
  background: var(--fs-surface-mid);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius);
  overflow: auto;
}
.ver-table {
  width: 100%;
  border-collapse: collapse;
}
.ver-table th,
.ver-table td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--fs-outline-var);
  font-size: 0.9rem;
}
.ver-table th {
  background: var(--fs-surface-high);
  color: var(--fs-on-surface-var);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.75rem;
}
.ver-table tbody tr:hover {
  background: var(--fs-surface-high);
}
.ver-cell-strong {
  font-weight: 600;
  color: var(--fs-on-surface);
}
.ver-cell-actions {
  text-align: right;
}
.ver-empty {
  text-align: center;
  color: var(--fs-on-surface-var);
  padding: 40px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}
.badge--ok {
  background: rgba(128, 196, 155, 0.15);
  color: var(--fs-primary);
}
.badge--warn {
  background: rgba(235, 130, 39, 0.15);
  color: var(--fs-accent);
}
.badge--err {
  background: rgba(239, 154, 154, 0.15);
  color: var(--fs-error);
}

.ver-btn {
  background: var(--fs-surface-high);
  color: var(--fs-on-surface);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius-sm);
  padding: 8px 14px;
  cursor: pointer;
  font-family: var(--fs-font);
  font-weight: 600;
  font-size: 0.85rem;
  transition: all var(--fs-transition);
}
.ver-btn:hover:not(:disabled) {
  background: var(--fs-surface-mid);
}
.ver-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.ver-btn--primary {
  background: var(--fs-primary);
  color: var(--fs-on-primary);
  border-color: var(--fs-primary);
}
.ver-btn--primary:hover:not(:disabled) {
  filter: brightness(1.05);
}

.ver-pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}
.ver-page-info {
  color: var(--fs-on-surface-var);
  font-size: 0.9rem;
}
</style>
