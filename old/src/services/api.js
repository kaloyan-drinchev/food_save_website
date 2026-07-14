const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1'
// Origin for endpoints that are NOT under /api/v1 (e.g. POST /admin/login).
// Empty string => same origin as the site.
const ORIGIN = import.meta.env.VITE_API_ORIGIN || ''

function getToken() {
  return sessionStorage.getItem('fs_token')
}

function getAdminToken() {
  return sessionStorage.getItem('fs_admin_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function adminAuthHeaders() {
  const token = getAdminToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function decodeAdminJwt() {
  const token = getAdminToken()
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

function isAdminAuthenticated() {
  const claims = decodeAdminJwt()
  if (!claims) return false
  if (claims.exp && Date.now() / 1000 > claims.exp) return false
  return claims.role === 'admin'
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw Object.assign(new Error(err.message || res.statusText), { status: res.status })
  }
  return res.json()
}

async function rawRequest(method, url, body, extraHeaders = {}) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw Object.assign(new Error(err.message || res.statusText), { status: res.status })
  }
  return res.json()
}

export const api = {
  // Auth
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  register: (data) => request('POST', '/auth/register', data),

  // Users
  getProfile: () => request('GET', '/auth/users/profile'),
  updateProfile: (data) => request('PUT', '/auth/users/profile', data),

  // Businesses
  getBusinesses: (category) =>
    request(
      'GET',
      category ? `/businesses?category=${encodeURIComponent(category)}` : '/businesses',
    ),
  getBusinessById: (id) => request('GET', `/businesses/${id}`),
  updateBusiness: (data) => request('PUT', '/business', data),
  getBusinessTypes: () => request('GET', '/business-types'),
  getBusinessReviews: (businessId) => request('GET', `/reviews/business/${businessId}`),

  // Orders
  getOrders: () => request('GET', '/orders'),
  getOrderById: (id) => request('GET', `/orders/${id}`),
  confirmOrder: (id) => request('PUT', `/orders/${id}/confirm`),
  pickupOrder: (id) => request('PUT', `/orders/${id}/pickup`),
  cancelOrder: (id) => request('DELETE', `/orders/${id}`),

  // Payments
  getPayments: () => request('GET', '/payments'),
  getOrderPayments: (orderId) => request('GET', `/orders/${orderId}/payments`),
  createPayment: (data) => request('POST', '/payments', data),

  // Products
  getProducts: (page, limit) => request('GET', `/menu?page=${page || 1}&limit=${limit || 50}`),
  getBusinessProducts: () => request('GET', '/business/menu'),

  // Categories & Allergens
  getCategories: () => request('GET', '/categories'),
  getAllergens: () => request('GET', '/allergens'),

  // Notifications
  getNotifications: () => request('GET', '/notifications'),

  // Admin
  admin: {
    async login(username, password) {
      const data = await rawRequest('POST', `${ORIGIN}/admin/login`, { username, password })
      const token = data?.token || data?.accessToken || data?.jwt
      if (!token) {
        throw new Error('Login response did not contain a token')
      }
      sessionStorage.setItem('fs_admin_token', token)
      return data
    },
    logout() {
      sessionStorage.removeItem('fs_admin_token')
    },
    getToken: getAdminToken,
    authHeaders: adminAuthHeaders,
    decodeToken: decodeAdminJwt,
    isAuthenticated: isAdminAuthenticated,

    // Users
    listUsers: () => adminRequest('GET', '/admin/users'),
    getUser: (id) => adminRequest('GET', `/admin/users/${id}`),
    updateUser: (id, data) => adminRequest('PUT', `/admin/users/${id}`, data),
    deleteUser: (id) => adminRequest('DELETE', `/admin/users/${id}`),

    // Businesses
    listBusinesses: () => adminRequest('GET', '/admin/businesses'),
    getBusiness: (id) => adminRequest('GET', `/admin/businesses/${id}`),
    updateBusiness: (id, data) => adminRequest('PUT', `/admin/businesses/${id}`, data),
    deleteBusiness: (id) => adminRequest('DELETE', `/admin/businesses/${id}`),

    // Verification workflow (BE-confirmed)
    // GET /admin/businesses — list, filtered client-side or by ?status=
    listBusinessesByStatus: ({ status, page = 1, limit = 50, search } = {}) => {
      const params = new URLSearchParams()
      if (status && status !== 'all') params.set('status', status)
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (search) params.set('search', search)
      const qs = params.toString()
      return adminRequest('GET', `/admin/businesses${qs ? `?${qs}` : ''}`)
    },
    // PATCH /admin/businesses/:id/status — body { status: 'validated' | 'notValidated' }
    // 'notValidated' is used both for "pending" and "rejected" (no separate rejected state).
    setBusinessStatus: (id, status) =>
      adminRequest('PATCH', `/admin/businesses/${id}/status`, { status }),
    // GET /certificates?businessId=X — returns [{ id, type, url, createdAt }]
    // `url` is a direct file URL (MinIO/S3); use it for <img> or PDF <iframe> sources.
    listCertificates: (businessId) =>
      adminRequest('GET', `/certificates?businessId=${encodeURIComponent(businessId)}`),

    // Orders
    listOrders: () => adminRequest('GET', '/admin/orders'),
    getOrder: (id) => adminRequest('GET', `/admin/orders/${id}`),
    confirmOrder: (id) => adminRequest('PUT', `/admin/orders/${id}/confirm`),
    pickupOrder: (id) => adminRequest('PUT', `/admin/orders/${id}/pickup`),
    cancelOrder: (id) => adminRequest('PUT', `/admin/orders/${id}/cancel`),

    // Products / Reviews / Images
    deleteProduct: (id) => adminRequest('DELETE', `/admin/products/${id}`),
    deleteReview: (id) => adminRequest('DELETE', `/admin/reviews/${id}`),
    deleteImage: (objectName) =>
      adminRequest('DELETE', `/admin/images/${encodeURIComponent(objectName)}`),
  },
}

async function adminRequest(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    sessionStorage.removeItem('fs_admin_token')
    throw Object.assign(new Error('Admin session expired'), { status: 401 })
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw Object.assign(new Error(err.message || res.statusText), { status: res.status })
  }
  if (res.status === 204) return null
  return res.json()
}
