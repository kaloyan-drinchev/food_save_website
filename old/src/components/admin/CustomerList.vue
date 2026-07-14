<script setup>
defineProps({
  customers: { type: Array, required: true },
})

function initials(name) {
  return (name || '?')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function avatarTint(name) {
  const palette = ['#80C49B', '#EB8227', '#3b82f6', '#8b5cf6', '#2dd4bf', '#f472b6']
  let h = 0
  for (const c of name || '') h = (h * 31 + c.charCodeAt(0)) >>> 0
  return palette[h % palette.length]
}
</script>

<template>
  <div class="customer-list-card">
    <header class="customer-list-head">
      <div>
        <h3 class="customer-list-title">Customer list</h3>
        <p class="customer-list-sub">Top customers by total spend</p>
      </div>
    </header>

    <div class="customer-list-table">
      <div class="customer-row customer-row--head">
        <div>Name</div>
        <div class="customer-cell-num">Deals</div>
        <div class="customer-cell-num">Total Value</div>
      </div>

      <div v-for="c in customers" :key="c.id || c.email" class="customer-row">
        <div class="customer-cell-user">
          <span class="customer-avatar" :style="{ background: avatarTint(c.name) }">{{
            initials(c.name)
          }}</span>
          <div class="customer-user-meta">
            <div class="customer-user-name">{{ c.name }}</div>
            <div class="customer-user-email">{{ c.email }}</div>
          </div>
        </div>
        <div class="customer-cell-num">{{ c.deals.toLocaleString() }}</div>
        <div class="customer-cell-num customer-cell-num--accent">{{ c.totalValue }}</div>
      </div>

      <div v-if="customers.length === 0" class="customer-empty">No customer orders yet.</div>
    </div>
  </div>
</template>
