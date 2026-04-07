const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

function getToken() {
  return sessionStorage.getItem('fs_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
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
}
