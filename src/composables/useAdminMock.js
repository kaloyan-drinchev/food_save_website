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

function randomDate(daysBack) {
  const d = new Date()
  d.setDate(d.getDate() - rand(0, daysBack))
  d.setHours(rand(0, 23), rand(0, 59))
  return d
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const FIRST_NAMES = [
  'Ivan', 'Maria', 'Georgi', 'Elena', 'Nikolay', 'Tsvetana', 'Dimitar', 'Silvia',
  'Petar', 'Ralitsa', 'Kalin', 'Desislava', 'Boyan', 'Vesela', 'Atanas', 'Daniela',
  'Stefan', 'Nadya', 'Hristo', 'Gergana',
]

const LAST_NAMES = [
  'Petrov', 'Koleva', 'Stefanov', 'Dimitrova', 'Todorov', 'Ruseva', 'Hristov',
  'Marinova', 'Vassilev', 'Borisova', 'Georgiev', 'Lazarova', 'Nikolov', 'Angelova',
  'Zahariev', 'Stoyanova', 'Ivanov', 'Pancheva', 'Mihailov', 'Yordanova',
]

const PARTNER_NAMES = [
  'Happy Bite', 'Green Kitchen', 'Златна Питка', 'Sofia Bistro', 'Фреш Маркет',
  'Sweet Dreams Bakery', 'Café Verde', 'Yummy Box', 'Балкан Грил', 'Panda Express BG',
  'Bread & Butter', 'Хлебна Къща', 'Farm Table', 'Quick Bites', 'Gastro Hub',
]

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

  const categoryPool = ['Restaurant', 'Bakery', 'Grocery', 'Café']

  const partners = PARTNER_NAMES
    .slice(0, 10)
    .map((name) => ({
      name,
      category: categoryPool[rand(0, 3)],
      orders: rand(40, 320),
      foodSaved: rand(20, 450) + ' kg',
      rating: randFloat(3.8, 5.0, 1),
    }))
    .sort((a, b) => b.orders - a.orders)

  const customerNames = FIRST_NAMES.slice(0, 15).map((f, i) => `${f} ${LAST_NAMES[i][0]}.`)

  const statusPool = ['Collected', 'Reserved', 'Cancelled']
  const itemNames = ['Surprise Bag', 'Bread Box', 'Pastry Mix', 'Salad Set', 'Fruit Box', 'Lunch Deal']

  const recentOrders = Array.from({ length: 15 }, (_, i) => ({
    time: timeAgo(rand(5, 1200)),
    customer: customerNames[rand(0, customerNames.length - 1)],
    partner: PARTNER_NAMES[rand(0, PARTNER_NAMES.length - 1)],
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

export function generateMockUsers() {
  const statuses = ['active', 'pending_email', 'disabled']
  const roles = ['customer', 'business', 'admin']
  const roleWeights = [14, 5, 1]

  function pickRole() {
    const r = rand(1, 20)
    if (r <= roleWeights[0]) return roles[0]
    if (r <= roleWeights[0] + roleWeights[1]) return roles[1]
    return roles[2]
  }

  return Array.from({ length: 20 }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length]
    const last = LAST_NAMES[i % LAST_NAMES.length]
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`
    const status = i < 3 ? 'pending_email' : i >= 18 ? 'disabled' : statuses[rand(0, 1) === 0 ? 0 : 0]
    return {
      id: `USR-${String(1000 + i).padStart(4, '0')}`,
      name: `${first} ${last}`,
      email,
      status: i < 3 ? 'pending_email' : i >= 18 ? 'disabled' : 'active',
      role: i === 0 ? 'admin' : pickRole(),
      registered: formatDate(randomDate(180)),
    }
  })
}

export function generateMockPayments() {
  const paymentStatuses = ['pending', 'completed', 'blocked', 'refunded']
  const statusWeights = { pending: 8, completed: 15, blocked: 4, refunded: 3 }

  function pickStatus() {
    const pool = []
    for (const [s, w] of Object.entries(statusWeights)) {
      for (let i = 0; i < w; i++) pool.push(s)
    }
    return pool[rand(0, pool.length - 1)]
  }

  return Array.from({ length: 30 }, (_, i) => {
    const customer = `${FIRST_NAMES[rand(0, FIRST_NAMES.length - 1)]} ${LAST_NAMES[rand(0, LAST_NAMES.length - 1)][0]}.`
    const partner = PARTNER_NAMES[rand(0, PARTNER_NAMES.length - 1)]
    const amount = randFloat(3, 25)
    const d = randomDate(60)
    return {
      id: `TX-${String(5000 + i).padStart(5, '0')}`,
      date: formatDateTime(d),
      dateRaw: d,
      customer,
      partner,
      amount: amount.toFixed(2) + ' лв',
      amountNum: amount,
      status: pickStatus(),
    }
  }).sort((a, b) => b.dateRaw - a.dateRaw)
}

export function generateMockRefunds() {
  const reasons = [
    'Order not received', 'Wrong items', 'Quality issue', 'Late pickup',
    'Duplicate charge', 'Customer request', 'Partner closed', 'Expired items',
  ]

  const pending = Array.from({ length: 8 }, (_, i) => {
    const customer = `${FIRST_NAMES[rand(0, FIRST_NAMES.length - 1)]} ${LAST_NAMES[rand(0, LAST_NAMES.length - 1)][0]}.`
    const amount = randFloat(3, 20)
    return {
      id: `RF-${String(2000 + i).padStart(4, '0')}`,
      txId: `TX-${String(5000 + rand(0, 29)).padStart(5, '0')}`,
      customer,
      amount: amount.toFixed(2) + ' лв',
      amountNum: amount,
      reason: reasons[rand(0, reasons.length - 1)],
      requested: formatDate(randomDate(14)),
      status: 'pending',
    }
  })

  const processedStatuses = ['approved', 'rejected']
  const processed = Array.from({ length: 15 }, (_, i) => {
    const customer = `${FIRST_NAMES[rand(0, FIRST_NAMES.length - 1)]} ${LAST_NAMES[rand(0, LAST_NAMES.length - 1)][0]}.`
    const amount = randFloat(3, 20)
    return {
      id: `RF-${String(1000 + i).padStart(4, '0')}`,
      txId: `TX-${String(5000 + rand(0, 29)).padStart(5, '0')}`,
      customer,
      amount: amount.toFixed(2) + ' лв',
      amountNum: amount,
      reason: reasons[rand(0, reasons.length - 1)],
      requested: formatDate(randomDate(60)),
      processedDate: formatDate(randomDate(30)),
      status: processedStatuses[rand(0, 1)],
    }
  })

  return { pending, processed }
}

const ADDRESSES = [
  'бул. Витоша 45, София', 'ул. Граф Игнатиев 12, София', 'бул. Цариградско шосе 78, София',
  'ул. Раковски 100, София', 'бул. България 60, София', 'ул. Солунска 5, София',
  'бул. Черни връх 33, София', 'ул. Шишман 22, София', 'бул. Дондуков 8, София',
  'ул. Пиротска 15, София', 'бул. Скобелев 55, София', 'ул. Алабин 40, София',
  'бул. Патриарх Евтимий 18, София', 'ул. Ангел Кънчев 7, София', 'бул. Сливница 90, София',
]

const PHONE_PREFIXES = ['087', '088', '089']

export function generateMockBusinesses() {
  const categories = ['Restaurant', 'Bakery', 'Grocery', 'Café', 'Bistro', 'Market']

  return PARTNER_NAMES.map((name, i) => {
    const ownerFirst = FIRST_NAMES[i % FIRST_NAMES.length]
    const ownerLast = LAST_NAMES[i % LAST_NAMES.length]
    const phone = `${PHONE_PREFIXES[rand(0, 2)]} ${rand(100, 999)} ${rand(1000, 9999)}`
    const joined = randomDate(365)
    const totalOrders = rand(20, 500)
    const totalRevenue = randFloat(totalOrders * 4, totalOrders * 12)
    const platformRevenue = totalRevenue * 0.25
    const rating = randFloat(3.2, 5.0, 1)

    const verified = i >= 4
    const status = i === 14 ? 'suspended' : 'active'
    const eik = `${rand(100000000, 999999999)}`
    const babhUploaded = i >= 2
    const babhNumber = babhUploaded ? `${rand(10, 28)}-${rand(1000, 9999)}/${2024 + rand(0, 2)}` : ''
    const companyRegVerified = i >= 3
    const foodSafetyCert = i >= 5

    return {
      id: `BIZ-${String(3000 + i).padStart(4, '0')}`,
      name,
      category: categories[rand(0, categories.length - 1)],
      owner: `${ownerFirst} ${ownerLast}`,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@business.bg`,
      phone,
      address: ADDRESSES[i % ADDRESSES.length],
      status,
      verified,
      joined: formatDate(joined),
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2) + ' лв',
      platformRevenue: platformRevenue.toFixed(2) + ' лв',
      rating: Number(rating),
      listingsActive: rand(1, 8),
      avgPickupTime: rand(5, 30) + ' min',
      eik,
      babhUploaded,
      babhNumber,
      companyRegVerified,
      foodSafetyCert,
      verifiedAt: verified ? formatDate(randomDate(120)) : null,
      verificationNotes: '',
    }
  })
}

export { rand, randFloat, timeAgo }
