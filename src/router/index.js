import { createRouter, createWebHistory } from 'vue-router'
import { api } from '@/services/api'

function requireAdmin(to, from, next) {
  if (api.admin.isAuthenticated()) return next()
  return next({ name: 'admin-login', query: { redirect: to.fullPath } })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Public site (2026 redesign) ──────────────────────────
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/LandingView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/for-clients',
      name: 'for-clients',
      component: () => import('@/views/ConsumersView.vue'),
    },
    {
      path: '/for-businesses',
      name: 'for-businesses',
      component: () => import('@/views/BusinessView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
    },

    // ── Previous pages, kept reachable while the redesign is in review ──
    {
      path: '/old',
      name: 'legacy-home-2025',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/legacy-home',
      name: 'legacy-home',
      component: () => import('@/views/HomepageView.vue'),
    },
    {
      path: '/legacy-for-clients',
      name: 'legacy-for-clients',
      component: () => import('@/views/ForClientsView.vue'),
    },
    {
      path: '/legacy-for-businesses',
      name: 'legacy-for-businesses',
      component: () => import('@/views/ForBusinessesView.vue'),
    },

    // ── Admin ────────────────────────────────────────────────
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/AdminLoginView.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/views/AdminView.vue'),
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('@/views/AdminLanding.vue'),
        },
        {
          path: 'metrics',
          name: 'admin-metrics',
          component: () => import('@/views/MetricsView.vue'),
        },
        {
          path: 'operations',
          name: 'admin-operations',
          component: () => import('@/views/OperationsView.vue'),
        },
        {
          path: 'verifications',
          name: 'admin-verifications',
          component: () => import('@/views/VerificationsQueueView.vue'),
          beforeEnter: requireAdmin,
        },
        {
          path: 'verifications/:businessId',
          name: 'admin-verification-review',
          component: () => import('@/views/VerificationReviewView.vue'),
          beforeEnter: requireAdmin,
          props: true,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return new Promise((resolve) => {
        // Lazy-loaded views mount a tick after navigation; give the target
        // a moment to exist, then land just below the sticky nav.
        setTimeout(() => {
          const nav = document.querySelector('.fs-nav')
          resolve({ el: to.hash, top: nav ? nav.offsetHeight : 0, behavior: 'smooth' })
        }, 60)
      })
    }
    return { top: 0 }
  },
})

export default router
