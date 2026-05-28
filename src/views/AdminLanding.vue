<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="admin-landing">
    <h1 class="admin-landing-title">Admin Dashboard</h1>
    <p class="admin-landing-subtitle">Choose a section to get started</p>

    <div class="admin-landing-grid">
      <RouterLink to="/admin/metrics" class="admin-landing-card">
        <div class="admin-landing-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <h2 class="admin-landing-card-title">Metrics & Analytics</h2>
        <p class="admin-landing-card-desc">
          KPIs, charts, partner stats, orders, platform events, revenue tracking and environmental
          impact.
        </p>
        <span class="admin-landing-card-link">Open Metrics &rarr;</span>
      </RouterLink>

      <RouterLink to="/admin/operations" class="admin-landing-card admin-landing-card--ops">
        <div class="admin-landing-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h2 class="admin-landing-card-title">Backend Operations</h2>
        <p class="admin-landing-card-desc">
          User management, email confirmations, payment tracking, refund processing, and account
          administration.
        </p>
        <span class="admin-landing-card-link">Open Operations &rarr;</span>
      </RouterLink>

      <RouterLink to="/admin/verifications" class="admin-landing-card">
        <div class="admin-landing-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M9 12l2 2 4-4" />
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2 class="admin-landing-card-title">Business Verifications</h2>
        <p class="admin-landing-card-desc">
          Review pending businesses, inspect uploaded HACCP and БАБХ certificates, and approve or
          reject submissions.
        </p>
        <span class="admin-landing-card-link">Open Verifications &rarr;</span>
      </RouterLink>
    </div>
  </div>
</template>
