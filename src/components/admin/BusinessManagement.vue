<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'

const businesses = ref([])
const loading = ref(true)
const search = ref('')
const filterStatus = ref('all')
const filterVerified = ref('all')
const confirmMsg = ref('')
const detailBiz = ref(null)

const showEditModal = ref(false)
const editForm = ref({})
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)
const showVerifyModal = ref(false)
const verifyTarget = ref(null)
const verifyNotes = ref('')
const showEmailModal = ref(false)
const emailTarget = ref(null)
const emailSubject = ref('')
const emailBody = ref('')
const showCertViewer = ref(false)
const certViewerUrl = ref('')
const certViewerName = ref('')
const certFileInput = ref(null)

function mapBusiness(b) {
  const loc = b.locations?.[0] || {}
  return {
    id: String(b.id),
    name: b.companyName || 'Unnamed',
    category: b.businessType?.type || 'Unknown',
    owner: '', // API has no owner name field
    email: '', // API has no business email field
    phone: loc.phoneNumber || '',
    address: loc.address || '',
    status: 'active',
    isVerified: b.isVerified || false,
    joined: b.createdAt
      ? new Date(b.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '',
    totalOrders: 0,
    totalRevenue: '0.00 лв',
    platformRevenue: '0.00 лв',
    rating: b.rating || 0,
    listingsActive: b.products?.length || 0,
    avgPickupTime: '-',
    eik: b.bulstatVat || '',
    babhUploaded: false,
    babhNumber: '',
    companyRegVerified: !!b.bulstatVat,
    foodSafetyCert: false,
    haccpFile: null,
    certStatus: null,
    certRequestedAt: null,
    verifiedAt: b.isVerified
      ? b.updatedAt
        ? new Date(b.updatedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : ''
      : null,
    verificationNotes: '',
    _raw: b,
  }
}

async function loadBusinesses() {
  loading.value = true
  try {
    const data = await api.getBusinesses()
    businesses.value = (Array.isArray(data) ? data : []).map(mapBusiness)
  } catch (e) {
    toast('Failed to load businesses: ' + e.message)
    businesses.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadBusinesses)

const filtered = computed(() => {
  let list = businesses.value
  if (filterStatus.value !== 'all') {
    list = list.filter((b) => b.status === filterStatus.value)
  }
  if (filterVerified.value !== 'all') {
    const wantVerified = filterVerified.value === 'verified'
    list = list.filter((b) => b.isVerified === wantVerified)
  }
  const q = search.value.toLowerCase()
  if (q) {
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.eik.includes(q),
    )
  }
  return list
})

const counts = computed(() => ({
  total: businesses.value.length,
  active: businesses.value.filter((b) => b.status === 'active').length,
  unverified: businesses.value.filter((b) => !b.isVerified).length,
  suspended: businesses.value.filter((b) => b.status === 'suspended').length,
}))

function toast(msg) {
  confirmMsg.value = msg
  setTimeout(() => (confirmMsg.value = ''), 3000)
}

function openDetail(biz) {
  detailBiz.value = biz
}

function closeDetail() {
  detailBiz.value = null
}

function detailAction(fn) {
  const biz = detailBiz.value
  closeDetail()
  if (biz) fn(biz)
}

function suspend(biz) {
  biz.status = 'suspended'
  toast(`${biz.name} has been suspended`)
}

function reactivate(biz) {
  biz.status = 'active'
  toast(`${biz.name} has been reactivated`)
}

function openVerify(biz) {
  verifyTarget.value = biz
  verifyNotes.value = biz.verificationNotes || ''
  showVerifyModal.value = true
}

function confirmVerify() {
  if (!verifyTarget.value) return
  verifyTarget.value.isVerified = true
  verifyTarget.value.verifiedAt = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  verifyTarget.value.verificationNotes = verifyNotes.value
  showVerifyModal.value = false
  toast(`${verifyTarget.value.name} has been verified`)
  verifyTarget.value = null
}

function revokeVerification(biz) {
  biz.isVerified = false
  biz.verifiedAt = null
  toast(`Verification revoked for ${biz.name}`)
}

function openEdit(biz) {
  editForm.value = {
    id: biz.id,
    name: biz.name,
    category: biz.category,
    owner: biz.owner,
    email: biz.email,
    phone: biz.phone,
    address: biz.address,
    eik: biz.eik,
    babhNumber: biz.babhNumber,
  }
  showEditModal.value = true
}

function submitEdit() {
  const biz = businesses.value.find((b) => b.id === editForm.value.id)
  if (!biz) return
  Object.assign(biz, {
    name: editForm.value.name,
    category: editForm.value.category,
    owner: editForm.value.owner,
    email: editForm.value.email,
    phone: editForm.value.phone,
    address: editForm.value.address,
    eik: editForm.value.eik,
    babhNumber: editForm.value.babhNumber,
    babhUploaded: !!editForm.value.babhNumber,
  })
  showEditModal.value = false
  toast(`Updated ${biz.name}`)
}

function openDelete(biz) {
  deleteTarget.value = biz
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  businesses.value = businesses.value.filter((b) => b.id !== deleteTarget.value.id)
  showDeleteConfirm.value = false
  deleteTarget.value = null
  toast(`${name} has been removed`)
}

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
    body: `Dear {owner},\n\nWe reviewed the certificate submitted for {name} on the FoodSave platform and unfortunately found that it is not valid or has expired.\n\nTo complete your business verification and become visible to customers, we need a valid, up-to-date Food Safety / HACCP certificate.\n\nPlease reply directly to this email with your updated certificate attached (PDF or image). There is no need to log in or re-register — simply reply with the file and we will update your profile.\n\nIf you have any questions or need assistance obtaining the certificate, feel free to reach out.\n\nBest regards,\nFoodSave Admin Team\nsupport@foodsavebg.com`,
  },
]

function openEmailModal(biz) {
  emailTarget.value = biz
  emailSubject.value = ''
  emailBody.value = ''
  showEmailModal.value = true
}

function applyTemplate(tpl) {
  emailSubject.value = tpl.subject
  emailBody.value = tpl.body
    .replace(/\{name\}/g, emailTarget.value?.name || '')
    .replace(/\{owner\}/g, emailTarget.value?.owner || '')
    .replace(/\{eik\}/g, emailTarget.value?.eik || '')
}

function sendEmail() {
  if (!emailTarget.value || !emailSubject.value) return
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(emailTarget.value.email)}&su=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`
  window.open(gmailUrl, '_blank')
  showEmailModal.value = false
  toast(`Email drafted for ${emailTarget.value.name} — opening Gmail`)
  emailTarget.value = null
}

function requestCertificate(biz) {
  biz.certStatus = 'awaiting_resubmission'
  biz.certRequestedAt = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  // Open email modal with resubmission template pre-filled
  emailTarget.value = biz
  const tpl = EMAIL_TEMPLATES.find((t) => t.label.includes('Resubmission'))
  emailSubject.value = tpl.subject
  emailBody.value = tpl.body
    .replace(/\{name\}/g, biz.name)
    .replace(/\{owner\}/g, biz.owner)
    .replace(/\{eik\}/g, biz.eik)
  showEmailModal.value = true
  toast(`Certificate resubmission requested for ${biz.name}`)
}

function markCertReceived(biz) {
  biz.certStatus = null
  biz.certRequestedAt = null
  biz.foodSafetyCert = true
  biz.haccpFile = {
    name: `HACCP_certificate_${biz.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    size: 'Manually uploaded',
    uploadedAt: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }
}

function viewCertificate(biz) {
  if (biz.haccpFile?.url) {
    certViewerUrl.value = biz.haccpFile.url
  } else {
    certViewerUrl.value = ''
  }
  certViewerName.value = biz.haccpFile?.name || 'Certificate'
  showCertViewer.value = true
}

function triggerCertUpload(biz) {
  certFileInput.value?.click()
  certFileInput.value._targetBiz = biz
}

function handleCertUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  const biz = event.target._targetBiz
  const url = URL.createObjectURL(file)
  biz.foodSafetyCert = true
  biz.certStatus = null
  biz.certRequestedAt = null
  biz.haccpFile = {
    name: file.name,
    size: (file.size / 1024).toFixed(1) + ' KB',
    uploadedAt: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    url: url,
  }
  toast(`Certificate uploaded for ${biz.name}`)
  event.target.value = ''
  toast(`Certificate marked as received for ${biz.name}`)
}

function statusClass(status) {
  const map = { active: 'badge-active', suspended: 'badge-disabled' }
  return map[status] || ''
}

function statusLabel(status) {
  const map = { active: 'Active', suspended: 'Suspended' }
  return map[status] || status
}

function ratingStars(rating) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half)
}

function toggleDoc(biz, field) {
  biz[field] = !biz[field]
}

function docCheckCount(biz) {
  let done = 0
  if (biz.babhUploaded) done++
  if (biz.companyRegVerified) done++
  if (biz.foodSafetyCert) done++
  return done
}
</script>

<template>
  <div class="ops-panel">
    <!-- Unverified alert banner -->
    <div v-if="counts.unverified > 0" class="biz-alert-banner">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>
        <strong>{{ counts.unverified }} business{{ counts.unverified > 1 ? 'es' : '' }}</strong>
        awaiting verification — review their documents and company details below.
      </span>
      <button class="btn-xs btn-primary" @click="filterVerified = 'unverified'">
        Show Unverified
      </button>
    </div>

    <!-- Summary cards -->
    <div class="ops-summary-grid" style="grid-template-columns: repeat(4, 1fr)">
      <div class="ops-summary-card">
        <div class="ops-summary-value">{{ counts.total }}</div>
        <div class="ops-summary-label">Total Businesses</div>
      </div>
      <div class="ops-summary-card">
        <div class="ops-summary-value green">{{ counts.active }}</div>
        <div class="ops-summary-label">Active</div>
      </div>
      <div class="ops-summary-card">
        <div class="ops-summary-value accent">{{ counts.unverified }}</div>
        <div class="ops-summary-label">Unverified</div>
      </div>
      <div class="ops-summary-card">
        <div class="ops-summary-value red">{{ counts.suspended }}</div>
        <div class="ops-summary-label">Suspended</div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="ops-toolbar">
      <input
        v-model="search"
        type="text"
        class="ops-search"
        placeholder="Search by name, owner, email, EIK..."
      />
      <select v-model="filterVerified" class="ops-filter">
        <option value="all">All Verification</option>
        <option value="unverified">Unverified Only</option>
        <option value="verified">Verified Only</option>
      </select>
      <select v-model="filterStatus" class="ops-filter">
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <div v-if="confirmMsg" class="ops-toast">{{ confirmMsg }}</div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span class="loading-text">Loading businesses...</span>
    </div>

    <template v-else>
      <div class="ops-count">{{ filtered.length }} of {{ businesses.length }} businesses</div>

      <!-- Business cards -->
      <div class="biz-cards-grid">
        <div
          v-for="biz in filtered"
          :key="biz.id"
          class="biz-card"
          :class="{ 'biz-card--unverified': !biz.isVerified }"
          @click="openDetail(biz)"
        >
          <div class="biz-card-header">
            <div class="biz-card-main">
              <div class="biz-card-name">
                {{ biz.name }}
                <span v-if="biz.isVerified" class="biz-verified-badge" title="Verified">✓</span>
                <span v-else class="biz-unverified-badge" title="Awaiting verification"
                  >Unverified</span
                >
                <span
                  v-if="biz.certStatus === 'awaiting_resubmission'"
                  class="biz-cert-badge"
                  title="Awaiting certificate resubmission"
                  >⏳ Cert Pending</span
                >
              </div>
              <div class="biz-card-meta">
                <span class="biz-card-category">{{ biz.category }}</span>
                <span class="biz-card-id">{{ biz.id }}</span>
                <span class="biz-card-eik">EIK: {{ biz.eik }}</span>
              </div>
            </div>
            <div class="biz-card-right">
              <span class="badge" :class="statusClass(biz.status)">{{
                statusLabel(biz.status)
              }}</span>
            </div>
          </div>

          <div class="biz-card-stats">
            <div class="biz-stat">
              <span class="biz-stat-value">{{ biz.totalOrders }}</span>
              <span class="biz-stat-label">Orders</span>
            </div>
            <div class="biz-stat">
              <span class="biz-stat-value">{{ biz.totalRevenue }}</span>
              <span class="biz-stat-label">Revenue</span>
            </div>
            <div class="biz-stat">
              <span class="biz-stat-value">{{ biz.platformRevenue }}</span>
              <span class="biz-stat-label">Platform Rev (25%)</span>
            </div>
            <div class="biz-stat">
              <span class="biz-stat-value biz-rating"
                >{{ biz.rating }} <span class="biz-stars">{{ ratingStars(biz.rating) }}</span></span
              >
              <span class="biz-stat-label">Rating</span>
            </div>
          </div>
        </div>

        <div v-if="filtered.length === 0" class="biz-empty">No businesses match your search.</div>
      </div>
    </template>

    <Teleport to="body">
      <!-- Business Detail Modal -->
      <div v-if="detailBiz" class="ops-modal-overlay" @click.self="closeDetail">
        <div class="biz-detail-modal">
          <div class="biz-detail-modal-header">
            <div>
              <h3 class="biz-detail-modal-name">
                {{ detailBiz.name }}
                <span v-if="detailBiz.isVerified" class="biz-verified-badge" title="Verified"
                  >✓</span
                >
                <span v-else class="biz-unverified-badge">Unverified</span>
              </h3>
              <div class="biz-card-meta" style="margin-top: 4px">
                <span class="biz-card-category">{{ detailBiz.category }}</span>
                <span class="biz-card-id">{{ detailBiz.id }}</span>
                <span class="badge" :class="statusClass(detailBiz.status)">{{
                  statusLabel(detailBiz.status)
                }}</span>
              </div>
            </div>
            <button class="biz-detail-modal-close" @click="closeDetail">&times;</button>
          </div>

          <div class="biz-detail-modal-body">
            <!-- Stats row -->
            <div
              class="biz-card-stats"
              style="border-top: none; border-radius: 8px; overflow: hidden"
            >
              <div class="biz-stat">
                <span class="biz-stat-value">{{ detailBiz.totalOrders }}</span>
                <span class="biz-stat-label">Orders</span>
              </div>
              <div class="biz-stat">
                <span class="biz-stat-value">{{ detailBiz.totalRevenue }}</span>
                <span class="biz-stat-label">Revenue</span>
              </div>
              <div class="biz-stat">
                <span class="biz-stat-value">{{ detailBiz.platformRevenue }}</span>
                <span class="biz-stat-label">Platform Rev (25%)</span>
              </div>
              <div class="biz-stat">
                <span class="biz-stat-value biz-rating"
                  >{{ detailBiz.rating }}
                  <span class="biz-stars">{{ ratingStars(detailBiz.rating) }}</span></span
                >
                <span class="biz-stat-label">Rating</span>
              </div>
            </div>

            <!-- Contact & Company Info -->
            <div class="biz-detail-section-title">Contact & Company Information</div>
            <div class="biz-detail-grid">
              <div class="biz-detail-item">
                <span class="biz-detail-label">Owner</span>
                <span class="biz-detail-value">{{ detailBiz.owner }}</span>
              </div>
              <div class="biz-detail-item">
                <span class="biz-detail-label">Email</span>
                <span class="biz-detail-value">{{ detailBiz.email }}</span>
              </div>
              <div class="biz-detail-item">
                <span class="biz-detail-label">Phone</span>
                <span class="biz-detail-value">{{ detailBiz.phone }}</span>
              </div>
              <div class="biz-detail-item">
                <span class="biz-detail-label">Address</span>
                <span class="biz-detail-value">{{ detailBiz.address }}</span>
              </div>
              <div class="biz-detail-item">
                <span class="biz-detail-label">EIK (Company Reg.)</span>
                <span class="biz-detail-value" style="font-family: monospace">{{
                  detailBiz.eik
                }}</span>
              </div>
              <div class="biz-detail-item">
                <span class="biz-detail-label">Joined</span>
                <span class="biz-detail-value">{{ detailBiz.joined }}</span>
              </div>
              <div class="biz-detail-item">
                <span class="biz-detail-label">Active Listings</span>
                <span class="biz-detail-value">{{ detailBiz.listingsActive }}</span>
              </div>
              <div class="biz-detail-item">
                <span class="biz-detail-label">Avg Pickup Time</span>
                <span class="biz-detail-value">{{ detailBiz.avgPickupTime }}</span>
              </div>
            </div>

            <!-- Verification Panel -->
            <div
              class="biz-verify-panel"
              :class="{ 'biz-verify-panel--verified': detailBiz.isVerified }"
            >
              <div class="biz-verify-header">
                <div class="biz-verify-title">
                  <svg
                    v-if="detailBiz.isVerified"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <svg
                    v-else
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {{ detailBiz.isVerified ? 'Verified Business' : 'Verification Required' }}
                </div>
                <span v-if="detailBiz.isVerified" class="biz-verify-date"
                  >Verified {{ detailBiz.verifiedAt }}</span
                >
              </div>

              <div class="biz-doc-checklist">
                <!-- Company Registration -->
                <div class="biz-doc-item" :class="{ checked: detailBiz.companyRegVerified }">
                  <span class="biz-doc-icon" @click="toggleDoc(detailBiz, 'companyRegVerified')">{{
                    detailBiz.companyRegVerified ? '✓' : '○'
                  }}</span>
                  <div class="biz-doc-info">
                    <span class="biz-doc-name">Търговски регистър (Company Registration)</span>
                    <span class="biz-doc-detail"
                      >EIK: {{ detailBiz.eik }} —
                      {{
                        detailBiz.companyRegVerified
                          ? 'Verified in Commercial Register'
                          : 'Pending verification'
                      }}</span
                    >
                  </div>
                </div>

                <!-- БАБХ Registration -->
                <div class="biz-doc-item" :class="{ checked: detailBiz.babhUploaded }">
                  <span class="biz-doc-icon" @click="toggleDoc(detailBiz, 'babhUploaded')">{{
                    detailBiz.babhUploaded ? '✓' : '○'
                  }}</span>
                  <div class="biz-doc-info">
                    <span class="biz-doc-name">БАБХ Registration (Food Safety Agency)</span>
                    <span class="biz-doc-detail">{{
                      detailBiz.babhUploaded
                        ? `Reg. №: ${detailBiz.babhNumber}`
                        : 'Not submitted — required by Закон за храните'
                    }}</span>
                  </div>
                </div>

                <!-- HACCP Certificate -->
                <div
                  class="biz-doc-item"
                  :class="{
                    checked: detailBiz.foodSafetyCert,
                    'biz-doc-item--awaiting': detailBiz.certStatus === 'awaiting_resubmission',
                  }"
                >
                  <span class="biz-doc-icon" @click="toggleDoc(detailBiz, 'foodSafetyCert')">{{
                    detailBiz.foodSafetyCert ? '✓' : '○'
                  }}</span>
                  <div class="biz-doc-info">
                    <span class="biz-doc-name">Food Safety / HACCP Certificate</span>
                    <span v-if="detailBiz.foodSafetyCert" class="biz-doc-detail"
                      >Certificate uploaded and reviewed</span
                    >
                    <span
                      v-else-if="detailBiz.certStatus === 'awaiting_resubmission'"
                      class="biz-doc-detail biz-doc-detail--awaiting"
                    >
                      ⏳ Awaiting resubmission — requested {{ detailBiz.certRequestedAt }}
                    </span>
                    <span v-else class="biz-doc-detail">Not submitted yet</span>
                    <!-- Certificate has file: show View Certificate -->
                    <div v-if="detailBiz.haccpFile" class="biz-doc-file">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span class="biz-doc-file-name">{{ detailBiz.haccpFile.name }}</span>
                      <span class="biz-doc-file-meta"
                        >{{ detailBiz.haccpFile.size }} · {{ detailBiz.haccpFile.uploadedAt }}</span
                      >
                    </div>
                    <!-- No file: show empty state -->
                    <div v-else class="biz-doc-empty">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>No file uploaded</span>
                    </div>
                    <!-- Certificate action buttons -->
                    <div class="biz-cert-actions">
                      <!-- View Certificate (when file exists) -->
                      <button
                        v-if="detailBiz.haccpFile"
                        class="btn-xs btn-cert-view"
                        @click.stop="viewCertificate(detailBiz)"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View Certificate
                      </button>
                      <!-- Upload Certificate (when no file) -->
                      <button
                        v-if="!detailBiz.haccpFile"
                        class="btn-xs btn-cert-upload"
                        @click.stop="triggerCertUpload(detailBiz)"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload Certificate
                      </button>
                      <!-- Request Certificate via email -->
                      <button
                        v-if="
                          !detailBiz.foodSafetyCert &&
                          detailBiz.certStatus !== 'awaiting_resubmission'
                        "
                        class="btn-xs btn-cert-request"
                        @click.stop="requestCertificate(detailBiz)"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                          />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        Request Certificate
                      </button>
                      <!-- Mark received -->
                      <button
                        v-if="detailBiz.certStatus === 'awaiting_resubmission'"
                        class="btn-xs btn-cert-received"
                        @click.stop="markCertReceived(detailBiz)"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Mark Certificate Received
                      </button>
                      <!-- Resend Request -->
                      <button
                        v-if="detailBiz.certStatus === 'awaiting_resubmission'"
                        class="btn-xs btn-cert-resend"
                        @click.stop="requestCertificate(detailBiz)"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polyline points="1 4 1 10 7 10" />
                          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                        </svg>
                        Request new certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="biz-doc-progress">
                <div class="biz-doc-progress-bar">
                  <div
                    class="biz-doc-progress-fill"
                    :style="{ width: (docCheckCount(detailBiz) / 3) * 100 + '%' }"
                  ></div>
                </div>
                <span class="biz-doc-progress-label"
                  >{{ docCheckCount(detailBiz) }}/3 documents verified</span
                >
              </div>

              <div v-if="detailBiz.verificationNotes" class="biz-verify-notes">
                <span class="biz-detail-label">Admin Notes</span>
                <span class="biz-detail-value">{{ detailBiz.verificationNotes }}</span>
              </div>
            </div>
          </div>

          <!-- Actions footer -->
          <div class="biz-detail-modal-footer">
            <button class="btn-xs btn-edit" @click="detailAction(openEdit)">Edit Details</button>
            <button class="btn-xs btn-email" @click="detailAction(openEmailModal)">
              Contact Business
            </button>
            <button
              v-if="!detailBiz.isVerified"
              class="btn-xs btn-verify"
              @click="detailAction(openVerify)"
            >
              Verify Business
            </button>
            <button
              v-if="detailBiz.isVerified"
              class="btn-xs btn-reset"
              @click="revokeVerification(detailBiz)"
            >
              Revoke Verification
            </button>
            <button
              v-if="detailBiz.status === 'active'"
              class="btn-xs btn-disable"
              @click="suspend(detailBiz)"
            >
              Suspend
            </button>
            <button
              v-if="detailBiz.status === 'suspended'"
              class="btn-xs btn-enable"
              @click="reactivate(detailBiz)"
            >
              Reactivate
            </button>
            <button class="btn-xs btn-delete" @click="detailAction(openDelete)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Verify Modal -->
      <div v-if="showVerifyModal" class="ops-modal-overlay" @click.self="showVerifyModal = false">
        <div class="ops-modal-card" style="max-width: 500px">
          <h3 class="ops-modal-title">Verify Business — {{ verifyTarget?.name }}</h3>

          <div class="biz-verify-modal-summary">
            <div class="biz-detail-item">
              <span class="biz-detail-label">Owner</span>
              <span class="biz-detail-value">{{ verifyTarget?.owner }}</span>
            </div>
            <div class="biz-detail-item">
              <span class="biz-detail-label">Email</span>
              <span class="biz-detail-value">{{ verifyTarget?.email }}</span>
            </div>
            <div class="biz-detail-item">
              <span class="biz-detail-label">EIK</span>
              <span class="biz-detail-value" style="font-family: monospace">{{
                verifyTarget?.eik
              }}</span>
            </div>
            <div class="biz-detail-item">
              <span class="biz-detail-label">Address</span>
              <span class="biz-detail-value">{{ verifyTarget?.address }}</span>
            </div>
          </div>

          <div class="biz-verify-modal-checks">
            <div class="biz-doc-item" :class="{ checked: verifyTarget?.companyRegVerified }">
              <span class="biz-doc-icon">{{ verifyTarget?.companyRegVerified ? '✓' : '✗' }}</span>
              <span class="biz-doc-name">Търговски регистър</span>
            </div>
            <div class="biz-doc-item" :class="{ checked: verifyTarget?.babhUploaded }">
              <span class="biz-doc-icon">{{ verifyTarget?.babhUploaded ? '✓' : '✗' }}</span>
              <span class="biz-doc-name">БАБХ Registration</span>
            </div>
            <div class="biz-doc-item" :class="{ checked: verifyTarget?.foodSafetyCert }">
              <span class="biz-doc-icon">{{ verifyTarget?.foodSafetyCert ? '✓' : '✗' }}</span>
              <span class="biz-doc-name">HACCP Certificate</span>
            </div>
          </div>

          <div class="ops-field">
            <label>Verification Notes (optional)</label>
            <input
              v-model="verifyNotes"
              type="text"
              placeholder="e.g. Checked via Търговски регистър on 04.03.2026"
            />
          </div>

          <div class="ops-modal-actions">
            <button class="btn-sm btn-verify" @click="confirmVerify">Confirm Verification</button>
            <button class="btn-sm btn-cancel" @click="showVerifyModal = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="ops-modal-overlay" @click.self="showEditModal = false">
        <div class="ops-modal-card" style="max-width: 500px">
          <h3 class="ops-modal-title">Edit Business — {{ editForm.name }}</h3>
          <div class="ops-field">
            <label>Business Name</label>
            <input v-model="editForm.name" type="text" />
          </div>
          <div class="ops-field-row">
            <div class="ops-field">
              <label>Category</label>
              <select v-model="editForm.category">
                <option>Restaurant</option>
                <option>Bakery</option>
                <option>Grocery</option>
                <option>Café</option>
                <option>Bistro</option>
                <option>Market</option>
              </select>
            </div>
            <div class="ops-field">
              <label>EIK (Company Reg.)</label>
              <input v-model="editForm.eik" type="text" />
            </div>
          </div>
          <div class="ops-field">
            <label>Owner Name</label>
            <input v-model="editForm.owner" type="text" />
          </div>
          <div class="ops-field-row">
            <div class="ops-field">
              <label>Email</label>
              <input v-model="editForm.email" type="email" />
            </div>
            <div class="ops-field">
              <label>Phone</label>
              <input v-model="editForm.phone" type="text" />
            </div>
          </div>
          <div class="ops-field">
            <label>Address</label>
            <input v-model="editForm.address" type="text" />
          </div>
          <div class="ops-field">
            <label>БАБХ Registration №</label>
            <input v-model="editForm.babhNumber" type="text" placeholder="e.g. 15-2345/2025" />
          </div>
          <div class="ops-modal-actions">
            <button class="btn-sm btn-primary" @click="submitEdit">Save Changes</button>
            <button class="btn-sm btn-cancel" @click="showEditModal = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation -->
      <div
        v-if="showDeleteConfirm"
        class="ops-modal-overlay"
        @click.self="showDeleteConfirm = false"
      >
        <div class="ops-modal-card">
          <h3 class="ops-modal-title">Remove Business</h3>
          <p class="ops-delete-warning">
            Are you sure you want to remove <strong>{{ deleteTarget?.name }}</strong
            >? All associated data including orders and revenue history will be permanently deleted.
          </p>
          <div class="ops-modal-actions">
            <button class="btn-sm btn-delete" @click="confirmDelete">Yes, Remove</button>
            <button class="btn-sm btn-cancel" @click="showDeleteConfirm = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Email Compose Modal -->
      <div v-if="showEmailModal" class="ops-modal-overlay" @click.self="showEmailModal = false">
        <div class="ops-modal-card biz-email-modal">
          <h3 class="ops-modal-title">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact {{ emailTarget?.name }}
          </h3>

          <div class="biz-email-to">
            <span class="biz-detail-label">To</span>
            <span class="biz-email-address">{{ emailTarget?.email }}</span>
          </div>

          <div class="biz-email-templates">
            <span class="biz-detail-label">Quick Templates</span>
            <div class="biz-email-template-list">
              <button
                v-for="(tpl, idx) in EMAIL_TEMPLATES"
                :key="idx"
                class="biz-email-template-btn"
                @click="applyTemplate(tpl)"
              >
                {{ tpl.label }}
              </button>
            </div>
          </div>

          <div class="ops-field">
            <label>Subject</label>
            <input v-model="emailSubject" type="text" placeholder="Email subject..." />
          </div>

          <div class="ops-field">
            <label>Message</label>
            <textarea
              v-model="emailBody"
              class="biz-email-textarea"
              rows="10"
              placeholder="Compose your message..."
            ></textarea>
          </div>

          <div class="ops-modal-actions">
            <button class="btn-sm btn-email-send" :disabled="!emailSubject" @click="sendEmail">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Open in Gmail
            </button>
            <button class="btn-sm btn-cancel" @click="showEmailModal = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Certificate Viewer Modal -->
      <div v-if="showCertViewer" class="ops-modal-overlay" @click.self="showCertViewer = false">
        <div class="ops-modal-card biz-cert-viewer-modal">
          <div class="biz-cert-viewer-header">
            <h3 class="ops-modal-title">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {{ certViewerName }}
            </h3>
            <button class="biz-cert-viewer-close" @click="showCertViewer = false">✕</button>
          </div>
          <div class="biz-cert-viewer-body">
            <img
              v-if="certViewerUrl"
              :src="certViewerUrl"
              :alt="certViewerName"
              class="biz-cert-viewer-img"
            />
            <div v-else class="biz-cert-viewer-placeholder">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>No preview available — certificate was marked manually</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden file input for certificate upload -->
      <input
        ref="certFileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        style="display: none"
        @change="handleCertUpload"
      />
    </Teleport>
  </div>
</template>
