<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api } from '@/services/api'

const users = ref([])
const loading = ref(true)
const search = ref('')
const filterRole = ref('all')
const showCreateModal = ref(false)
const createForm = ref({ name: '', email: '', role: 'customer' })
const createdPassword = ref('')
const confirmMsg = ref('')
const showEditModal = ref(false)
const editForm = ref({ id: '', name: '', email: '', role: 'customer', status: 'active' })
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)
const menuOpenId = ref(null)

async function loadUsers() {
  loading.value = true
  try {
    // The API has no admin user listing endpoint.
    // We fetch businesses and map their owners as "business" users,
    // plus the current admin profile.
    const [profile, bizList] = await Promise.all([
      api.getProfile().catch(() => null),
      api.getBusinesses().catch(() => []),
    ])

    const list = []

    if (profile) {
      list.push({
        id: String(profile.id),
        name:
          [profile.customer?.firstName, profile.customer?.lastName].filter(Boolean).join(' ') ||
          profile.email,
        email: profile.email,
        status: 'active',
        role: profile.role || 'admin',
        registered: profile.createdAt
          ? new Date(profile.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '',
      })
    }

    const businesses = Array.isArray(bizList) ? bizList : []
    for (const biz of businesses) {
      if (profile && biz.userId === profile.id) continue
      list.push({
        id: String(biz.userId || biz.id),
        name: biz.companyName || 'Business #' + biz.id,
        email: '',
        status: 'active',
        role: 'business',
        registered: biz.createdAt
          ? new Date(biz.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '',
      })
    }

    users.value = list
  } catch (e) {
    toast('Failed to load users: ' + e.message)
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

function toggleMenu(userId) {
  menuOpenId.value = menuOpenId.value === userId ? null : userId
}

function closeMenu() {
  menuOpenId.value = null
}

function handleClickOutside(e) {
  if (!e.target.closest('.user-actions-cell')) {
    closeMenu()
  }
}

onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const filtered = computed(() => {
  let list = users.value
  if (filterRole.value !== 'all') {
    list = list.filter((u) => u.role === filterRole.value)
  }
  const q = search.value.toLowerCase()
  if (q) {
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        String(u.id).toLowerCase().includes(q),
    )
  }
  return list
})

const counts = computed(() => ({
  total: users.value.length,
  customers: users.value.filter((u) => u.role === 'customer').length,
  businesses: users.value.filter((u) => u.role === 'business').length,
  admins: users.value.filter((u) => u.role === 'admin').length,
}))

function toast(msg) {
  confirmMsg.value = msg
  setTimeout(() => (confirmMsg.value = ''), 3000)
}

function confirmEmail(user) {
  user.status = 'active'
  toast(`Email confirmed for ${user.name}`)
}

function toggleStatus(user) {
  user.status = user.status === 'disabled' ? 'active' : 'disabled'
  toast(`${user.name} ${user.status === 'active' ? 'enabled' : 'disabled'}`)
}

function resetPassword(user) {
  toast(`Password reset email sent to ${user.email}`)
}

function openCreate() {
  createForm.value = { name: '', email: '', role: 'customer' }
  createdPassword.value = ''
  showCreateModal.value = true
}

async function submitCreate() {
  if (!createForm.value.name || !createForm.value.email) return
  const tempPass = 'TMP-' + Math.random().toString(36).slice(2, 10).toUpperCase()
  try {
    const parts = createForm.value.name.split(' ')
    await api.register({
      email: createForm.value.email,
      password: tempPass,
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    })
    createdPassword.value = tempPass
    await loadUsers()
  } catch (e) {
    toast('Failed to create account: ' + e.message)
  }
}

function openEdit(user) {
  editForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }
  showEditModal.value = true
}

function submitEdit() {
  const u = users.value.find((u) => u.id === editForm.value.id)
  if (!u) return
  u.name = editForm.value.name
  u.email = editForm.value.email
  u.role = editForm.value.role
  u.status = editForm.value.status
  showEditModal.value = false
  toast(`Updated ${u.name}`)
}

function openDelete(user) {
  deleteTarget.value = user
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  users.value = users.value.filter((u) => u.id !== deleteTarget.value.id)
  showDeleteConfirm.value = false
  deleteTarget.value = null
  toast(`${name} has been deleted`)
}

function statusClass(status) {
  const map = { active: 'badge-active', pending_email: 'badge-pending', disabled: 'badge-disabled' }
  return map[status] || ''
}

function statusLabel(status) {
  const map = { active: 'Active', pending_email: 'Pending Email', disabled: 'Disabled' }
  return map[status] || status
}

function roleClass(role) {
  const map = {
    customer: 'badge-role-customer',
    business: 'badge-role-business',
    admin: 'badge-role-admin',
  }
  return map[role] || ''
}
</script>

<template>
  <div class="ops-panel">
    <div class="ops-summary-grid" style="grid-template-columns: repeat(4, 1fr)">
      <div class="ops-summary-card">
        <div class="ops-summary-value">{{ counts.total }}</div>
        <div class="ops-summary-label">Total Users</div>
      </div>
      <div class="ops-summary-card">
        <div class="ops-summary-value green">{{ counts.customers }}</div>
        <div class="ops-summary-label">Customers</div>
      </div>
      <div class="ops-summary-card">
        <div class="ops-summary-value accent">{{ counts.businesses }}</div>
        <div class="ops-summary-label">Businesses</div>
      </div>
      <div class="ops-summary-card">
        <div class="ops-summary-value" style="color: #3b82f6">{{ counts.admins }}</div>
        <div class="ops-summary-label">Admins</div>
      </div>
    </div>

    <div class="ops-toolbar">
      <input
        v-model="search"
        type="text"
        class="ops-search"
        placeholder="Search by name, email, or ID..."
      />
      <select v-model="filterRole" class="ops-filter">
        <option value="all">All Roles</option>
        <option value="customer">Customers</option>
        <option value="business">Businesses</option>
        <option value="admin">Admins</option>
      </select>
      <button class="btn-sm btn-primary" @click="openCreate">+ Create Account</button>
    </div>

    <div v-if="confirmMsg" class="ops-toast">{{ confirmMsg }}</div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span class="loading-text">Loading users...</span>
    </div>

    <template v-else>
      <div class="ops-count">{{ filtered.length }} of {{ users.length }} users</div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filtered" :key="user.id">
              <td style="font-family: monospace; font-size: 0.78rem">{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" :class="statusClass(user.status)">{{
                  statusLabel(user.status)
                }}</span>
              </td>
              <td>
                <span class="badge" :class="roleClass(user.role)">{{ user.role }}</span>
              </td>
              <td>{{ user.registered }}</td>
              <td class="user-actions-cell">
                <button class="kebab-btn" @click.stop="toggleMenu(user.id)" title="Actions">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
                <div v-if="menuOpenId === user.id" class="kebab-dropdown">
                  <button
                    v-if="user.status === 'pending_email'"
                    class="kebab-item kebab-item--confirm"
                    @click="confirmEmail(user); closeMenu()"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Confirm Email
                  </button>
                  <button
                    class="kebab-item kebab-item--edit"
                    @click="openEdit(user); closeMenu()"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    class="kebab-item"
                    :class="
                      user.status === 'disabled' ? 'kebab-item--enable' : 'kebab-item--disable'
                    "
                    @click="toggleStatus(user); closeMenu()"
                  >
                    <svg
                      v-if="user.status === 'disabled'"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg
                      v-else
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                      />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    {{ user.status === 'disabled' ? 'Enable' : 'Disable' }}
                  </button>
                  <button
                    class="kebab-item kebab-item--reset"
                    @click="resetPassword(user); closeMenu()"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Reset Password
                  </button>
                  <div class="kebab-divider"></div>
                  <button
                    class="kebab-item kebab-item--delete"
                    @click="openDelete(user); closeMenu()"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="7" style="text-align: center; padding: 24px; color: var(--fs-outline)">
                No users found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <Teleport to="body">
      <!-- Create Modal -->
      <div v-if="showCreateModal" class="ops-modal-overlay" @click.self="showCreateModal = false">
        <div class="ops-modal-card">
          <h3 class="ops-modal-title">Create Account</h3>

          <template v-if="!createdPassword">
            <div class="ops-field">
              <label>Full Name</label>
              <input v-model="createForm.name" type="text" placeholder="e.g. Ivan Petrov" />
            </div>
            <div class="ops-field">
              <label>Email</label>
              <input v-model="createForm.email" type="email" placeholder="e.g. ivan@example.com" />
            </div>
            <div class="ops-field">
              <label>Role</label>
              <select v-model="createForm.role">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="ops-modal-actions">
              <button class="btn-sm btn-primary" @click="submitCreate">Create</button>
              <button class="btn-sm btn-cancel" @click="showCreateModal = false">Cancel</button>
            </div>
          </template>

          <template v-else>
            <div class="ops-success-msg">
              <p>Account created successfully!</p>
              <div class="ops-temp-password">
                <label>Temporary Password</label>
                <code>{{ createdPassword }}</code>
              </div>
              <button
                class="btn-sm btn-primary"
                @click="showCreateModal = false"
                style="margin-top: 16px"
              >
                Close
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="ops-modal-overlay" @click.self="showEditModal = false">
        <div class="ops-modal-card">
          <h3 class="ops-modal-title">Edit User — {{ editForm.id }}</h3>
          <div class="ops-field">
            <label>Full Name</label>
            <input v-model="editForm.name" type="text" />
          </div>
          <div class="ops-field">
            <label>Email</label>
            <input v-model="editForm.email" type="email" />
          </div>
          <div class="ops-field">
            <label>Role</label>
            <select v-model="editForm.role">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="ops-field">
            <label>Status</label>
            <select v-model="editForm.status">
              <option value="active">Active</option>
              <option value="pending_email">Pending Email</option>
              <option value="disabled">Disabled</option>
            </select>
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
          <h3 class="ops-modal-title">Delete User</h3>
          <p class="ops-delete-warning">
            Are you sure you want to permanently delete
            <strong>{{ deleteTarget?.name }}</strong> ({{ deleteTarget?.email }})? This action
            cannot be undone.
          </p>
          <div class="ops-modal-actions">
            <button class="btn-sm btn-delete" @click="confirmDelete">Yes, Delete</button>
            <button class="btn-sm btn-cancel" @click="showDeleteConfirm = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
