function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function dateLabels(days) {
  const labels = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  }
  return labels
}

function cumulativeGrowth(startVal, days, dailyMin, dailyMax) {
  const arr = [startVal]
  for (let i = 1; i < days; i++) {
    arr.push(arr[i - 1] + rand(dailyMin, dailyMax))
  }
  return arr
}

function randomSeries(days, min, max) {
  return Array.from({ length: days }, () => rand(min, max))
}

function timeAgo(minutes) {
  if (minutes < 60) return `${minutes}m ago`
  const h = Math.floor(minutes / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function generateMockData() {
  const labels90 = dateLabels(90)
  const labels30 = dateLabels(30)

  const businessRevenue = rand(8500, 14200)
  const ourRevenue = Math.round(businessRevenue * 0.25)

  const kpis = [
    { label: 'Total Customers', value: '1,247', desc: 'Registered users', color: '' },
    { label: 'Partner Businesses', value: '38', desc: 'Active food partners', color: '' },
    { label: 'Daily Active Users', value: rand(280, 340).toLocaleString(), desc: 'Today', color: 'green' },
    { label: 'Orders Today', value: rand(75, 100).toLocaleString(), desc: 'Since midnight', color: 'green' },
    { label: 'Food Saved (30d)', value: rand(2200, 2500).toLocaleString() + ' kg', desc: 'Waste prevented', color: 'green' },
    { label: 'CO₂ Prevented (30d)', value: rand(5500, 6200).toLocaleString() + ' kg', desc: 'Environmental impact', color: '' },
    { label: 'Waitlist Signups', value: rand(470, 510).toLocaleString(), desc: 'Pre-launch interest', color: 'accent' },
    { label: 'Avg Order Value', value: randFloat(5.5, 8.0) + ' лв', desc: 'Last 30 days', color: '' },
    { label: 'Business Revenue (30d)', value: businessRevenue.toLocaleString() + ' лв', desc: 'Total partner sales', color: '' },
    { label: 'Our Revenue (30d)', value: ourRevenue.toLocaleString() + ' лв', desc: '25% platform commission', color: 'green' },
  ]

  const userGrowth = { labels: labels90, data: cumulativeGrowth(420, 90, 5, 15) }
  const dau = { labels: labels30, data: randomSeries(30, 220, 400) }
  const ordersPerDay = { labels: labels30, data: randomSeries(30, 50, 120) }
  const foodSavedPerDay = { labels: labels30, data: randomSeries(30, 50, 110) }
  const categories = { labels: ['Restaurants', 'Bakeries', 'Grocery', 'Cafés'], data: [rand(35, 45), rand(20, 30), rand(15, 25), rand(10, 18)] }
  const pickupCompletion = { labels: ['Completed', 'Missed'], data: [rand(82, 92), rand(8, 18)] }
  const waitlistSignups = { labels: labels30, data: randomSeries(30, 5, 25) }
  const waitlistBreakdown = { labels: ['Consumer', 'Business Owner', 'Curious'], data: [rand(55, 65), rand(20, 30), rand(10, 20)] }
  const revenuePerDay = { labels: labels30, data: Array.from({ length: 30 }, () => randFloat(250, 700, 0)) }
  const co2PerDay = { labels: labels30, data: randomSeries(30, 120, 260) }

  const partnerNames = [
    'Happy Bite', 'Green Kitchen', 'Златна Питка', 'Sofia Bistro', 'Фреш Маркет',
    'Sweet Dreams Bakery', 'Café Verde', 'Yummy Box', 'Балкан Грил', 'Panda Express BG',
    'Bread & Butter', 'Хлебна Къща', 'Farm Table', 'Quick Bites', 'Gastro Hub',
  ]

  const categoryPool = ['Restaurant', 'Bakery', 'Grocery', 'Café']

  const partners = partnerNames
    .slice(0, 10)
    .map((name) => ({
      name,
      category: categoryPool[rand(0, 3)],
      orders: rand(40, 320),
      foodSaved: rand(20, 450) + ' kg',
      rating: randFloat(3.8, 5.0, 1),
    }))
    .sort((a, b) => b.orders - a.orders)

  const customerNames = [
    'Ivan P.', 'Maria K.', 'Georgi S.', 'Elena D.', 'Nikolay T.',
    'Tsvetana R.', 'Dimitar H.', 'Silvia M.', 'Petar V.', 'Ralitsa B.',
    'Kalin G.', 'Desislava L.', 'Boyan N.', 'Vesela A.', 'Atanas Z.',
  ]

  const statusPool = ['Collected', 'Reserved', 'Cancelled']
  const itemNames = ['Surprise Bag', 'Bread Box', 'Pastry Mix', 'Salad Set', 'Fruit Box', 'Lunch Deal']

  const recentOrders = Array.from({ length: 15 }, (_, i) => ({
    time: timeAgo(rand(5, 1200)),
    customer: customerNames[rand(0, customerNames.length - 1)],
    partner: partnerNames[rand(0, partnerNames.length - 1)],
    items: itemNames[rand(0, itemNames.length - 1)],
    amount: randFloat(3, 12) + ' лв',
    status: i < 10 ? statusPool[rand(0, 1)] : statusPool[rand(0, 2)],
  }))

  const platformEvents = [
    { name: 'app_open', count: rand(3200, 5000) },
    { name: 'order_placed', count: rand(1800, 2800) },
    { name: 'order_picked_up', count: rand(1600, 2500) },
    { name: 'order_cancelled', count: rand(60, 180) },
    { name: 'waitlist_signup', count: rand(140, 320) },
    { name: 'search_performed', count: rand(4200, 7000) },
    { name: 'partner_viewed', count: rand(5500, 8500) },
    { name: 'review_submitted', count: rand(280, 600) },
    { name: 'share_tapped', count: rand(90, 300) },
    { name: 'login', count: rand(2000, 3800) },
    { name: 'signup', count: rand(200, 500) },
    { name: 'push_opened', count: rand(600, 1400) },
  ]

  return {
    kpis, userGrowth, dau, ordersPerDay, foodSavedPerDay,
    categories, pickupCompletion, waitlistSignups, waitlistBreakdown,
    revenuePerDay, co2PerDay, partners, recentOrders, platformEvents,
  }
}

export { rand, randFloat, timeAgo }
