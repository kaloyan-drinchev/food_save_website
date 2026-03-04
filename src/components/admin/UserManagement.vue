<script setup>
import { ref, computed } from 'vue'
import { generateMockUsers } from '@/composables/useAdminMock'

const users = ref(generateMockUsers())
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

const filtered = computed(() => {
  let list = users.value
  if (filterRole.value !== 'all') {
    list = list.filter((u) => u.role === filterRole.value)
  }
  const q = search.value.toLowerCase()
  if (q) {
    list = list.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)
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

function submitCreate() {
  if (!createForm.value.name || !createForm.value.email) return
  const tempPass = 'TMP-' + Math.random().toString(36).slice(2, 10).toUpperCase()
  const newUser = {
    id: `USR-${String(2000 + users.value.length).padStart(4, '0')}`,
    name: createForm.value.name,
    email: createForm.value.email,
    status: 'active',
    role: createForm.value.role,
    registered: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  }
  users.value.unshift(newUser)
  createdPassword.value = tempPass
}

function openEdit(user) {
  editForm.value = { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
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
  const map = { customer: 'badge-role-customer', business: 'badge-role-business', admin: 'badge-role-admin' }
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
            <td><span class="badge" :class="statusClass(user.status)">{{ statusLabel(user.status) }}</span></td>
            <td><span class="badge" :class="roleClass(user.role)">{{ user.role }}</span></td>
            <td>{{ user.registered }}</td>
            <td class="ops-actions">
              <button
                v-if="user.status === 'pending_email'"
                class="btn-xs btn-confirm"
                @click="confirmEmail(user)"
              >Confirm Email</button>
              <button class="btn-xs btn-edit" @click="openEdit(user)">Edit</button>
              <button
                class="btn-xs"
                :class="user.status === 'disabled' ? 'btn-enable' : 'btn-disable'"
                @click="toggleStatus(user)"
              >{{ user.status === 'disabled' ? 'Enable' : 'Disable' }}</button>
              <button class="btn-xs btn-reset" @click="resetPassword(user)">Reset PW</button>
              <button class="btn-xs btn-delete" @click="openDelete(user)">Delete</button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="7" style="text-align: center; padding: 24px; color: var(--fs-outline)">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>

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
                <option value="business">Business</option>
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
              <button class="btn-sm btn-primary" @click="showCreateModal = false" style="margin-top: 16px">Close</button>
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
              <option value="business">Business</option>
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
      <div v-if="showDeleteConfirm" class="ops-modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="ops-modal-card">
          <h3 class="ops-modal-title">Delete User</h3>
          <p class="ops-delete-warning">
            Are you sure you want to permanently delete
            <strong>{{ deleteTarget?.name }}</strong> ({{ deleteTarget?.email }})?
            This action cannot be undone.
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
