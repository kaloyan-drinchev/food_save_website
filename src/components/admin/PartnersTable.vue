<script setup>
defineProps({ partners: { type: Array, required: true } })

function badgeClass(cat) {
  const map = { Restaurant: 'restaurant', Bakery: 'bakery', Grocery: 'grocery', 'Café': 'cafe' }
  return 'badge badge-' + (map[cat] || 'restaurant')
}
</script>

<template>
  <div class="charts-grid">
    <div class="chart-card full-width">
      <h3>Top Partner Businesses</h3>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead><tr><th>Name</th><th>Category</th><th>Orders</th><th>Food Saved</th><th>Rating</th></tr></thead>
          <tbody>
            <tr v-for="p in partners" :key="p.name">
              <td style="color:#fff;font-weight:600">{{ p.name }}</td>
              <td><span :class="badgeClass(p.category)">{{ p.category }}</span></td>
              <td>{{ p.orders }}</td>
              <td>{{ p.foodSaved }}</td>
              <td>⭐ {{ p.rating }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
