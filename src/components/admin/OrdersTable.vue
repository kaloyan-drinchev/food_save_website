<script setup>
defineProps({ orders: { type: Array, required: true } })
</script>

<template>
  <div class="charts-grid">
    <div class="chart-card full-width">
      <h3>Recent Orders</h3>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead><tr><th>Time</th><th>Customer</th><th>Partner</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="(o, i) in orders" :key="i">
              <td>{{ o.time }}</td>
              <td style="color:#fff">{{ o.customer }}</td>
              <td>{{ o.partner }}</td>
              <td>{{ o.items }}</td>
              <td>{{ o.amount }}</td>
              <td><span :class="'badge badge-' + o.status.toLowerCase()">{{ o.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
