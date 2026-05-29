<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const props = defineProps({
  businessId: { type: String, required: true },
})

const router = useRouter()

const business = ref(null)
const loading = ref(true)
const error = ref('')
const acting = ref(false) // approve/reject in flight
const toastMsg = ref('')
const toastKind = ref('ok') // 'ok' | 'err'

// Loaded certificates: [{ id, type, url, createdAt }]
const certs = ref([])
const certError = ref('')

// Aggregated stats (loaded from listOrders)
const orderStats = ref({ totalOrders: 0, totalRevenue: 0, platformRevenue: 0 })

// Reject modal
const showRejectModal = ref(false)
const rejectReason = ref('')

// Delete modal
const showDeleteModal = ref(false)
// Suspend modal
const showSuspendModal = ref(false)
// Approve modal
const showApproveModal = ref(false)

// Email modal
const showEmailModal = ref(false)
const emailSubject = ref('')
const emailBody = ref('')

const EMAIL_TEMPLATES = [
  {
    label: 'Missing БАБХ Registration',
    subject: 'Action Required: БАБХ Registration Missing — FoodSave',
    body: `Dear {owner},\n\nThank you for registering {name} on FoodSave.\n\nDuring our verification process, we noticed that your БАБХ (Bulgarian Food Safety Agency) registration number has not been submitted. Under Bulgarian food law (Закон за храните), all food businesses are required to hold a valid БАБХ registration.\n\nPlease submit your БАБХ registration number at your earliest convenience so we can complete your verification.\n\nIf you have any questions, feel free to reply to this email.\n\nBest regards,\nFoodSave Admin Team`,
  },
  {
    label: 'Missing HACCP Certificate',
    subject: 'Action Required: HACCP Certificate Needed — FoodSave',
    body: `Dear {owner},\n\nWe are in the process of verifying {name} on the FoodSave platform.\n\nWe require a copy of your Food Safety / HACCP certificate to proceed. This helps us ensure the quality and safety of all food offered through our platform.\n\nPlease upload or send us a copy of your certificate.\n\nThank you,\nFoodSave Admin Team`,
  },
  {
    label: 'EIK / Company Registration Issue',
    subject: 'Verification Issue: Company Registration — FoodSave',
    body: `Dear {owner},\n\nWe attempted to verify the company registration for {name} (EIK: {eik}) via the Търговски регистър but encountered an issue.\n\nCould you please confirm that the EIK number provided is correct? If there has been a recent change in your company details, please update them in your profile or reply to this email with the correct information.\n\nBest regards,\nFoodSave Admin Team`,
  },
  {
    label: 'General Verification Issue',
    subject: 'Registration Details Review — FoodSave',
    body: `Dear {owner},\n\nThank you for joining FoodSave with {name}.\n\nWe noticed some details in your registration that need attention before we can complete your verification. Please review the following:\n\n[Please describe the issue here]\n\nFeel free to reply to this email or contact us if you have any questions.\n\nBest regards,\nFoodSave Admin Team`,
  },
  {
    label: 'Invalid Certificate — Resubmission',
    subject: 'Action Required: Please Resubmit Your Certificate — FoodSave',
    body: `Dear {owner},\n\nWe reviewed the certificate submitted for {name} on the FoodSave platform and unfortunately found that it is not valid or has expired.\n\nTo complete your business verification and become visible to customers, we need a valid, up-to-date Food Safety / HACCP certificate.\n\nPlease reply directly to this email with your updated certificate attached (PDF or image). There is no need to log in or re-register — simply reply with the file and we will update your profile.\n\nIf you have any questions or need assistance obtaining the certificate, feel free to reach out.\n\nBest regards,\nFoodSave Admin Team\ncontact@foodsave.tech`,
  },
]

function showToast(msg, kind = 'ok') {
  toastMsg.value = msg
  toastKind.value = kind
  setTimeout(() => (toastMsg.value = ''), 3500)
}

async function loadBusiness() {
  loading.value = true
  error.value = ''
  try {
    const [b, c, orders] = await Promise.all([
      api.admin.getBusiness(props.businessId),
      api.admin.listCertificates(props.businessId).catch((e) => {
        certError.value = e.message || 'Failed to load certificates'
        return []
      }),
      api.admin.listOrders().catch(() => []),
    ])
    business.value = b
    certs.value = Array.isArray(c) ? c : []
    // Geocode any locations whose lat/lng is missing or 0,0 (BE often stores 0,0).
    buildBranches()
    // Aggregate this business's orders
    const bizId = String(props.businessId)
    const mine = (Array.isArray(orders) ? orders : []).filter(
      (o) => String(o.businessId ?? o.business?.id ?? '') === bizId,
    )
    const totalRevenue = mine.reduce((s, o) => s + Number(o.totalAmount ?? o.total ?? 0), 0)
    orderStats.value = {
      totalOrders: mine.length,
      totalRevenue,
      platformRevenue: totalRevenue * 0.25,
    }
  } catch (e) {
    error.value = e.message || 'Failed to load business'
  } finally {
    loading.value = false
  }
}

onMounted(loadBusiness)

const displayName = computed(() => business.value?.companyName || business.value?.name || '—')
const ownerName = computed(() => {
  const o = business.value?.owner || {}
  return [o.firstName, o.lastName].filter(Boolean).join(' ') || '—'
})
const ownerEmail = computed(() => business.value?.ownerEmail || business.value?.owner?.email || '—')

// All branches (the BE returns multiple `locations`). Each branch is enriched
// with geocoded lat/lng if the stored values are missing or 0,0.
const branches = ref([]) // [{ id, name, address, phoneNumber, lat, lng, geocoded, geocoding, error, mapSrc, coordSource }]

function makeMapSrc(la, ln) {
  const d = 0.005
  const bbox = `${ln - d},${la - d},${ln + d},${la + d}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${la},${ln}`
}

function hasRealCoords(la, ln) {
  const a = Number(la)
  const b = Number(ln)
  return Number.isFinite(a) && Number.isFinite(b) && (a !== 0 || b !== 0)
}

// Cache geocodes for the lifetime of the SPA so we don't hammer Nominatim
// (its usage policy is max 1 request/second).
const geocodeCache = new Map()

async function geocodeAddress(address) {
  if (!address) return null
  if (geocodeCache.has(address)) return geocodeCache.get(address)
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
    encodeURIComponent(address)
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Geocode HTTP ${res.status}`)
  const json = await res.json()
  const hit = Array.isArray(json) && json[0]
  if (!hit) {
    geocodeCache.set(address, null)
    return null
  }
  const result = { lat: Number(hit.lat), lng: Number(hit.lon), displayName: hit.display_name }
  geocodeCache.set(address, result)
  return result
}

async function buildBranches() {
  const list = Array.isArray(business.value?.locations) ? business.value.locations : []
  branches.value = list.map((l) => ({
    id: l.id,
    name: l.name || '',
    address: l.address || '',
    phoneNumber: l.phoneNumber || '',
    lat: l.latitude ?? l.lat ?? null,
    lng: l.longitude ?? l.lng ?? null,
    geocoded: false,
    geocoding: false,
    error: '',
    coordSource: hasRealCoords(l.latitude ?? l.lat, l.longitude ?? l.lng) ? 'stored' : null,
    mapSrc: hasRealCoords(l.latitude ?? l.lat, l.longitude ?? l.lng)
      ? makeMapSrc(Number(l.latitude ?? l.lat), Number(l.longitude ?? l.lng))
      : '',
  }))

  // Geocode any branch with missing/0,0 coords. Stagger 1.2s between calls to
  // respect Nominatim's 1 req/sec policy.
  for (let i = 0; i < branches.value.length; i++) {
    const b = branches.value[i]
    if (b.coordSource === 'stored') continue
    if (!b.address) continue
    b.geocoding = true
    branches.value = [...branches.value]
    try {
      const hit = await geocodeAddress(b.address)
      if (hit) {
        b.lat = hit.lat
        b.lng = hit.lng
        b.mapSrc = makeMapSrc(hit.lat, hit.lng)
        b.coordSource = 'geocoded'
        b.geocoded = true
      } else {
        b.error = 'Address not found'
      }
    } catch (e) {
      b.error = e.message || 'Geocoding failed'
    } finally {
      b.geocoding = false
      branches.value = [...branches.value]
    }
    if (i < branches.value.length - 1) await new Promise((r) => setTimeout(r, 1200))
  }
}

// Profile fields come from the FIRST branch (matches the previous UI).
const location = computed(() => business.value?.locations?.[0] || {})
const address = computed(() => location.value.address || '—')
const city = computed(() => location.value.city || business.value?.city || '—')
const phone = computed(() => location.value.phoneNumber || business.value?.phone || '—')
const registeredAt = computed(() => formatDate(business.value?.createdAt))
const submittedAt = computed(() =>
  formatDate(business.value?.submittedAt || business.value?.createdAt),
)
const status = computed(() => business.value?.status || 'notValidated')

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

function certTypeLabel(t) {
  if (!t) return 'Certificate'
  const v = String(t).toLowerCase()
  if (v.includes('haccp')) return 'HACCP'
  if (v.includes('babkh') || v.includes('babh') || v.includes('бабх')) return 'БАБХ (BABKH)'
  return t
}

function fileNameFromUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    return decodeURIComponent(u.pathname.split('/').pop() || '') || url
  } catch {
    return url.split('/').pop() || url
  }
}

function isPdf(c) {
  return /\.pdf(\?|$)/i.test(c.url || '')
}

function isImage(c) {
  return /\.(png|jpe?g|gif|webp)(\?|$)/i.test(c.url || '')
}

async function approve() {
  showApproveModal.value = true
}

async function confirmApprove() {
  acting.value = true
  showApproveModal.value = false
  try {
    await api.admin.setBusinessStatus(props.businessId, 'validated')
    showToast('Business approved')
    setTimeout(() => router.push({ name: 'admin-verifications' }), 600)
  } catch (e) {
    showToast(e.message || 'Approval failed', 'err')
    acting.value = false
  }
}

function openReject() {
  rejectReason.value = ''
  showRejectModal.value = true
}

async function submitReject() {
  // Note: the BE PATCH /admin/businesses/:id/status only accepts { status }.
  // The reason is captured here for the admin's reference but is NOT sent yet
  // (no field defined in the spec). Wire it through once BE supports a `reason`.
  if (!rejectReason.value.trim()) {
    showToast('Please provide a reason', 'err')
    return
  }
  acting.value = true
  showRejectModal.value = false
  try {
    await api.admin.setBusinessStatus(props.businessId, 'notValidated')
    showToast('Business rejected')
    setTimeout(() => router.push({ name: 'admin-verifications' }), 600)
  } catch (e) {
    showToast(e.message || 'Rejection failed', 'err')
    acting.value = false
  }
}

function downloadCert(c) {
  if (!c.url) return
  window.open(c.url, '_blank', 'noopener')
}

// ── Stats helpers ──────────────────────────────────────────
const rating = computed(() => Number(business.value?.rating || 0))
const listingsActive = computed(() => business.value?.products?.length || 0)
function ratingStars(r) {
  const full = Math.floor(r)
  const half = r - full >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half)
}
function fmtMoney(n) {
  return `${Number(n || 0).toFixed(2)} лв`
}

// ── Suspend / Reactivate / Delete ──────────────────────────
const accountActive = computed(() => (business.value?.accountStatus || 'active') !== 'suspended')

async function suspend() {
  showSuspendModal.value = true
}

async function confirmSuspend() {
  acting.value = true
  showSuspendModal.value = false
  try {
    await api.admin.updateBusiness(props.businessId, { status: 'suspended' })
    business.value = { ...business.value, accountStatus: 'suspended' }
    showToast('Business suspended')
  } catch (e) {
    showToast(e.message || 'Suspend failed', 'err')
  } finally {
    acting.value = false
  }
}

async function reactivate() {
  acting.value = true
  try {
    await api.admin.updateBusiness(props.businessId, { status: 'active' })
    business.value = { ...business.value, accountStatus: 'active' }
    showToast('Business reactivated')
  } catch (e) {
    showToast(e.message || 'Reactivate failed', 'err')
  } finally {
    acting.value = false
  }
}

function openDelete() {
  showDeleteModal.value = true
}

async function confirmDelete() {
  acting.value = true
  showDeleteModal.value = false
  try {
    await api.admin.deleteBusiness(props.businessId)
    showToast('Business deleted')
    setTimeout(() => router.push({ name: 'admin-verifications' }), 600)
  } catch (e) {
    showToast(e.message || 'Delete failed', 'err')
    acting.value = false
  }
}

// ── Email templates (opens Gmail compose in new tab) ───────
function openEmail() {
  emailSubject.value = ''
  emailBody.value = ''
  showEmailModal.value = true
}

function applyTemplate(tpl) {
  emailSubject.value = tpl.subject
  emailBody.value = tpl.body
    .replace(/\{name\}/g, displayName.value)
    .replace(/\{owner\}/g, ownerName.value !== '—' ? ownerName.value : ownerEmail.value)
    .replace(/\{eik\}/g, business.value?.bulstatVat || '')
}

function sendEmail() {
  if (!ownerEmail.value || ownerEmail.value === '—') {
    showToast('No owner email on file', 'err')
    return
  }
  if (!emailSubject.value) {
    showToast('Subject is required', 'err')
    return
  }
  const url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(ownerEmail.value)}&su=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`
  window.open(url, '_blank', 'noopener')
  showEmailModal.value = false
  showToast('Opening Gmail compose…')
}
</script>

<template>
  <div class="rev-page">
    <div class="rev-top">
      <button class="ver-btn" @click="router.push({ name: 'admin-verifications' })">
        ‹ Back to queue
      </button>
      <span :class="['badge', status === 'validated' ? 'badge--ok' : 'badge--warn']">
        {{ status === 'validated' ? 'Approved' : 'Pending' }}
      </span>
    </div>

    <div v-if="loading" class="rev-empty">Loading business…</div>
    <div v-else-if="error" class="rev-error">⚠ {{ error }}</div>

    <template v-else-if="business">
      <header class="rev-header">
        <h1 class="rev-title">{{ displayName }}</h1>
        <p class="rev-sub">Submitted {{ submittedAt }}</p>
      </header>

      <!-- Stats panel -->
      <section class="rev-stats">
        <div class="rev-stat">
          <span class="rev-stat-value">{{ orderStats.totalOrders }}</span>
          <span class="rev-stat-label">Orders</span>
        </div>
        <div class="rev-stat">
          <span class="rev-stat-value">{{ fmtMoney(orderStats.totalRevenue) }}</span>
          <span class="rev-stat-label">Revenue</span>
        </div>
        <div class="rev-stat">
          <span class="rev-stat-value">{{ fmtMoney(orderStats.platformRevenue) }}</span>
          <span class="rev-stat-label">Platform Rev (25%)</span>
        </div>
        <div class="rev-stat">
          <span class="rev-stat-value"
            >{{ rating.toFixed(1) }} <span class="rev-stars">{{ ratingStars(rating) }}</span></span
          >
          <span class="rev-stat-label">Rating</span>
        </div>
        <div class="rev-stat">
          <span class="rev-stat-value">{{ listingsActive }}</span>
          <span class="rev-stat-label">Active listings</span>
        </div>
      </section>

      <!-- Secondary actions toolbar -->
      <section class="rev-secondary-actions">
        <button class="ver-btn ver-btn--mail" :disabled="acting" @click="openEmail">
          📧 Email owner
        </button>
        <button
          v-if="accountActive"
          class="ver-btn ver-btn--warn"
          :disabled="acting"
          @click="suspend"
        >
          ⏸ Suspend
        </button>
        <button v-else class="ver-btn ver-btn--ok" :disabled="acting" @click="reactivate">
          ▶ Reactivate
        </button>
        <button class="ver-btn ver-btn--danger" :disabled="acting" @click="openDelete">
          🗑 Delete
        </button>
      </section>

      <section class="rev-grid">
        <div class="rev-card">
          <h2 class="rev-card-title">Business profile</h2>
          <dl class="rev-dl">
            <div>
              <dt>Owner</dt>
              <dd>{{ ownerName }}</dd>
            </div>
            <div>
              <dt>Owner email</dt>
              <dd>{{ ownerEmail }}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{{ phone }}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{{ address }}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{{ city }}</dd>
            </div>
            <div>
              <dt>Registered</dt>
              <dd>{{ registeredAt }}</dd>
            </div>
            <div>
              <dt>EIK/VAT</dt>
              <dd>{{ business.bulstatVat || '—' }}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{{ business.businessType?.type || '—' }}</dd>
            </div>
          </dl>
        </div>

        <div class="rev-card">
          <h2 class="rev-card-title">Locations ({{ branches.length }})</h2>
          <p v-if="!branches.length" class="rev-empty-inline">No locations on file.</p>
          <div v-else class="rev-branch-list">
            <article v-for="b in branches" :key="b.id" class="rev-branch">
              <header class="rev-branch-head">
                <div class="rev-branch-name">
                  {{ b.name || 'Branch' }}
                  <span v-if="b.geocoding" class="badge">Locating…</span>
                  <span v-else-if="b.mapSrc" class="badge badge--ok">Location found</span>
                  <span v-else class="badge badge--err">No location</span>
                </div>
                <div class="rev-branch-meta">
                  {{ b.address || 'No address'
                  }}<span v-if="b.phoneNumber"> · {{ b.phoneNumber }}</span>
                </div>
              </header>

              <div v-if="b.mapSrc" class="rev-map">
                <iframe
                  :src="b.mapSrc"
                  width="100%"
                  height="240"
                  frameborder="0"
                  scrolling="no"
                  referrerpolicy="no-referrer-when-downgrade"
                  loading="lazy"
                  :title="'Map of ' + (b.name || 'branch')"
                ></iframe>
              </div>
              <p v-else-if="b.geocoding" class="rev-empty-inline">Locating address…</p>
              <p v-else-if="b.error" class="rev-error rev-error--sm">⚠ {{ b.error }}</p>
              <p v-else class="rev-empty-inline">No coordinates available.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="rev-card">
        <h2 class="rev-card-title">Certificates ({{ certs.length }})</h2>
        <p v-if="certError" class="rev-error rev-error--sm">⚠ {{ certError }}</p>
        <p v-if="!certs.length && !certError" class="rev-empty-inline">No certificates uploaded.</p>
        <div v-if="certs.length" class="rev-cert-grid">
          <article v-for="c in certs" :key="c.id" class="rev-cert">
            <header class="rev-cert-head">
              <div>
                <span class="badge badge--ok">{{ certTypeLabel(c.type) }}</span>
                <div class="rev-cert-name">{{ fileNameFromUrl(c.url) }}</div>
                <div class="rev-cert-meta">Uploaded {{ formatDate(c.createdAt) }}</div>
              </div>
              <button class="ver-btn" :disabled="!c.url" @click="downloadCert(c)">Open</button>
            </header>

            <div class="rev-cert-preview">
              <img
                v-if="isImage(c) && c.url"
                :src="c.url"
                :alt="certTypeLabel(c.type)"
                class="rev-cert-img"
              />
              <iframe
                v-else-if="isPdf(c) && c.url"
                :src="c.url"
                class="rev-cert-pdf"
                title="Certificate PDF"
              ></iframe>
              <div v-else-if="c.url" class="rev-empty-inline">
                Cannot preview this file type. Use Open to view it.
              </div>
              <div v-else class="rev-empty-inline">No file URL.</div>
            </div>
          </article>
        </div>
      </section>

      <footer class="rev-actions">
        <button
          class="rev-btn rev-btn--secondary"
          :disabled="acting || status === 'notValidated'"
          @click="openReject"
        >
          {{ status === 'validated' ? 'Revoke verification' : 'Reject' }}
        </button>
        <button
          class="rev-btn rev-btn--primary"
          :disabled="acting || status === 'validated'"
          @click="approve"
        >
          <span v-if="acting" class="rev-spinner" aria-hidden="true"></span>
          {{ acting ? 'Working…' : 'Approve' }}
        </button>
      </footer>
    </template>

    <!-- Approve modal -->
    <div v-if="showApproveModal" class="rev-modal-backdrop" @click.self="showApproveModal = false">
      <div class="rev-modal" role="dialog" aria-modal="true">
        <h3>Approve business?</h3>
        <p class="rev-sub">
          <strong>{{ displayName }}</strong> will be marked as verified and visible as approved.
        </p>
        <div class="rev-modal-actions">
          <button class="ver-btn" @click="showApproveModal = false">Cancel</button>
          <button class="rev-btn rev-btn--primary" @click="confirmApprove">Approve</button>
        </div>
      </div>
    </div>

    <!-- Reject modal -->
    <div v-if="showRejectModal" class="rev-modal-backdrop" @click.self="showRejectModal = false">
      <div class="rev-modal" role="dialog" aria-modal="true">
        <h3>Reject verification</h3>
        <p class="rev-sub">Provide a clear reason. This will be visible to the business owner.</p>
        <textarea
          v-model="rejectReason"
          class="rev-textarea"
          rows="4"
          placeholder="e.g. HACCP certificate is expired (valid only until 01.01.2025)…"
        ></textarea>
        <div class="rev-modal-actions">
          <button class="ver-btn" @click="showRejectModal = false">Cancel</button>
          <button class="rev-btn rev-btn--danger" @click="submitReject">Confirm rejection</button>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <div v-if="showDeleteModal" class="rev-modal-backdrop" @click.self="showDeleteModal = false">
      <div class="rev-modal" role="dialog" aria-modal="true">
        <h3>Delete business?</h3>
        <p class="rev-sub">
          This permanently removes <strong>{{ displayName }}</strong> and all associated data. This
          cannot be undone.
        </p>
        <div class="rev-modal-actions">
          <button class="ver-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="rev-btn rev-btn--danger" @click="confirmDelete">Delete permanently</button>
        </div>
      </div>
    </div>

    <!-- Suspend modal -->
    <div v-if="showSuspendModal" class="rev-modal-backdrop" @click.self="showSuspendModal = false">
      <div class="rev-modal" role="dialog" aria-modal="true">
        <h3>Suspend business?</h3>
        <p class="rev-sub">
          <strong>{{ displayName }}</strong> will be blocked from operations until reactivated.
        </p>
        <div class="rev-modal-actions">
          <button class="ver-btn" @click="showSuspendModal = false">Cancel</button>
          <button class="rev-btn rev-btn--danger" @click="confirmSuspend">Suspend</button>
        </div>
      </div>
    </div>

    <!-- Email modal -->
    <div v-if="showEmailModal" class="rev-modal-backdrop" @click.self="showEmailModal = false">
      <div class="rev-modal rev-modal--wide" role="dialog" aria-modal="true">
        <h3>Email owner</h3>
        <p class="rev-sub">To: {{ ownerEmail }} (opens Gmail compose in a new tab)</p>

        <div class="rev-tpl-row">
          <span class="rev-tpl-label">Templates:</span>
          <button
            v-for="tpl in EMAIL_TEMPLATES"
            :key="tpl.label"
            class="ver-btn ver-btn--sm"
            @click="applyTemplate(tpl)"
          >
            {{ tpl.label }}
          </button>
        </div>

        <label class="rev-field">
          <span>Subject</span>
          <input v-model="emailSubject" class="rev-input" type="text" />
        </label>
        <label class="rev-field">
          <span>Body</span>
          <textarea v-model="emailBody" class="rev-textarea" rows="10"></textarea>
        </label>

        <div class="rev-modal-actions">
          <button class="ver-btn" @click="showEmailModal = false">Cancel</button>
          <button class="rev-btn rev-btn--primary" @click="sendEmail">Open in Gmail</button>
        </div>
      </div>
    </div>

    <div
      v-if="toastMsg"
      :class="['rev-toast', toastKind === 'err' ? 'rev-toast--err' : 'rev-toast--ok']"
    >
      {{ toastMsg }}
    </div>
  </div>
</template>

<style scoped>
.rev-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.rev-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rev-header {
  border-bottom: 1px solid var(--fs-outline-var);
  padding-bottom: 12px;
}
.rev-title {
  font-size: 1.6rem;
  color: var(--fs-on-surface);
}
.rev-sub {
  color: var(--fs-on-surface-var);
  font-size: 0.9rem;
}

/* Stats panel */
.rev-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: var(--fs-outline-var);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius);
  overflow: hidden;
}
@media (max-width: 900px) {
  .rev-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
.rev-stat {
  background: var(--fs-surface-mid);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.rev-stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--fs-on-surface);
}
.rev-stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--fs-on-surface-var);
  font-weight: 600;
}
.rev-stars {
  color: var(--fs-accent);
  font-size: 0.9rem;
}

/* Secondary actions */
.rev-secondary-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
}
.ver-btn.ver-btn--danger {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}
.ver-btn.ver-btn--danger:hover:not(:disabled) {
  background: #b91c1c;
}
.ver-btn.ver-btn--mail {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.ver-btn.ver-btn--mail:hover:not(:disabled) {
  background: #1d4ed8;
}
.ver-btn.ver-btn--warn {
  background: #ea580c;
  color: #fff;
  border-color: #ea580c;
}
.ver-btn.ver-btn--warn:hover:not(:disabled) {
  background: #c2410c;
}
.ver-btn.ver-btn--ok {
  background: rgba(128, 196, 155, 0.2);
  color: var(--fs-primary);
  border-color: rgba(128, 196, 155, 0.35);
}
.ver-btn.ver-btn--ok:hover:not(:disabled) {
  background: rgba(128, 196, 155, 0.3);
}
.ver-btn--sm {
  padding: 6px 10px;
  font-size: 0.8rem;
}

/* Email templates */
.rev-modal--wide {
  width: min(640px, 96vw);
}
.rev-tpl-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--fs-outline-var);
}
.rev-tpl-label {
  color: var(--fs-on-surface-var);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: 4px;
}
.rev-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rev-field > span {
  color: var(--fs-on-surface-var);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.rev-input {
  background: var(--fs-surface);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius-sm);
  color: var(--fs-on-surface);
  font-family: var(--fs-font);
  padding: 10px 12px;
  font-size: 0.95rem;
}
.rev-input:focus {
  outline: none;
  border-color: var(--fs-primary);
}

.rev-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .rev-grid {
    grid-template-columns: 1fr;
  }
}
.rev-card {
  background: var(--fs-surface-mid);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius);
  padding: 20px;
}
.rev-card-title {
  font-size: 1rem;
  color: var(--fs-on-surface-var);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
}
.rev-dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}
.rev-dl > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.rev-dl dt {
  color: var(--fs-on-surface-var);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}
.rev-dl dd {
  color: var(--fs-on-surface);
  font-size: 0.95rem;
}

.rev-map iframe {
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius-sm);
  background: var(--fs-surface);
}

.rev-branch-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.rev-branch {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--fs-outline-var);
  padding-top: 14px;
}
.rev-branch:first-child {
  border-top: none;
  padding-top: 0;
}
.rev-branch-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rev-branch-name {
  font-weight: 600;
  color: var(--fs-on-surface);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.rev-branch-meta {
  color: var(--fs-on-surface-var);
  font-size: 0.85rem;
}

.rev-cert-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .rev-cert-grid {
    grid-template-columns: 1fr;
  }
}
.rev-cert {
  background: var(--fs-surface);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius-sm);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rev-cert-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.rev-cert-name {
  margin-top: 6px;
  font-weight: 600;
  color: var(--fs-on-surface);
  word-break: break-all;
}
.rev-cert-meta {
  color: var(--fs-on-surface-var);
  font-size: 0.8rem;
}
.rev-cert-preview {
  background: #0008;
  border-radius: var(--fs-radius-sm);
  min-height: 320px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}
.rev-cert-img {
  max-width: 100%;
  max-height: 480px;
  object-fit: contain;
  display: block;
  margin: auto;
}
.rev-cert-pdf {
  width: 100%;
  height: 480px;
  border: 0;
}

.rev-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  position: sticky;
  bottom: 0;
  padding: 16px 0;
  background: linear-gradient(to top, var(--fs-surface) 70%, transparent);
}
.rev-btn {
  padding: 12px 24px;
  border-radius: var(--fs-radius-sm);
  font-family: var(--fs-font);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--fs-transition);
}
.rev-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.rev-btn--primary {
  background: var(--fs-primary);
  color: var(--fs-on-primary);
}
.rev-btn--primary:hover:not(:disabled) {
  filter: brightness(1.05);
}
.rev-btn--secondary {
  background: var(--fs-surface-mid);
  color: var(--fs-on-surface);
  border-color: var(--fs-outline-var);
}
.rev-btn--secondary:hover:not(:disabled) {
  background: var(--fs-surface-high);
}
.rev-btn--danger {
  background: var(--fs-error);
  color: #fff;
}

.rev-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: rev-spin 0.8s linear infinite;
}
@keyframes rev-spin {
  to {
    transform: rotate(360deg);
  }
}

.rev-modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--fs-scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.rev-modal {
  background: var(--fs-surface-high);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius);
  padding: 24px;
  width: min(480px, 92vw);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rev-textarea {
  width: 100%;
  background: var(--fs-surface);
  border: 1px solid var(--fs-outline-var);
  border-radius: var(--fs-radius-sm);
  color: var(--fs-on-surface);
  font-family: var(--fs-font);
  padding: 10px 12px;
  resize: vertical;
}
.rev-textarea:focus {
  outline: none;
  border-color: var(--fs-primary);
}
.rev-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.rev-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 20px;
  border-radius: var(--fs-radius-sm);
  font-weight: 600;
  z-index: 2000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.rev-toast--ok {
  background: var(--fs-primary);
  color: var(--fs-on-primary);
}
.rev-toast--err {
  background: var(--fs-error);
  color: #fff;
}

.rev-error {
  background: rgba(239, 154, 154, 0.1);
  border: 1px solid var(--fs-error);
  color: var(--fs-error);
  padding: 12px 16px;
  border-radius: var(--fs-radius-sm);
}
.rev-error--sm {
  padding: 8px 12px;
  font-size: 0.85rem;
}
.rev-empty,
.rev-empty-inline {
  color: var(--fs-on-surface-var);
  text-align: center;
  padding: 16px;
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
</style>
