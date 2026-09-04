/**
 * Public site content map
 * ---------------------------------------------------------------
 * Structure lives here; the words live in src/i18n/{bg,en}.js under
 * the `hp.*` namespace. Every entry pairs an asset with its i18n keys.
 *
 * To add / reorder / remove an item anywhere on the site, edit the
 * arrays below — the components render whatever they are given.
 */

const IMG = '/assets/images/site'

/** Photography. `null` renders an on-brand placeholder at the reserved size. */
export const photos = {
  heroHome: `${IMG}/photos/hero-home.webp`,
  bandHome: `${IMG}/photos/band-home.webp`,
  heroAbout: `${IMG}/photos/hero-about.webp`,
  heroConsumers: `${IMG}/photos/hero-consumers.webp`,
  bannerConsumers: `${IMG}/photos/banner-consumers.webp`,
  heroBusiness: `${IMG}/photos/hero-business.webp`,
  bannerBusiness: `${IMG}/photos/banner-business.webp`,
  heroContact: `${IMG}/photos/hero-contact.webp`,

  // Stand-in for the designer's consumer portrait (a woman with her phone and
  // a food bag), which was not part of the hand-over: a portrait crop of the
  // cotton food bag. Swap in the real photo when it arrives.
  womanWithPhone: `${IMG}/photos/consumer-bag.webp`, // "За потребители" card (home + about)
  bakerAtCounter: null, // "За бизнеса" hero photo (business page)

  // Business-type photos ("За какви бизнеси е FoodSave?"). Not in the
  // hand-over either; the cutouts below are used as stand-ins.
  typeBakery: null,
  typeCanteen: null,
  typeStore: null,
  typeCafe: null,
  typeRestaurant: null,
}

/** Transparent cut-outs (PNG). */
export const cutouts = {
  phonePlates: `${IMG}/cutouts/phone-plates.webp`, // phone + two plates + basil
  phone: `${IMG}/cutouts/phone.webp`, // single phone with the S logo
  manTablet: `${IMG}/cutouts/man-tablet.webp`, // "За бизнеса" card portrait
  bakery: `${IMG}/cutouts/bakery.webp`,
  restaurant: `${IMG}/cutouts/restaurant.webp`,
  pasta: `${IMG}/cutouts/pasta.webp`, // ready meals — "Столове и обекти с готова храна"
  grocery: `${IMG}/cutouts/grocery.webp`,
  cafe: `${IMG}/cutouts/cafe.webp`,
}

/** Intrinsic pixel sizes of the cut-outs, so the browser reserves space before they load. */
export const cutoutSizes = {
  phonePlates: [1199, 1019],
  phone: [711, 1200],
  manTablet: [916, 1372],
  bakery: [1220, 903],
  restaurant: [1137, 681],
  pasta: [365, 551],
  grocery: [1122, 983],
  cafe: [1138, 836],
}

/** Designer icon set (PNG, transparent). */
export const icons = {
  business: `${IMG}/icons/business.webp`, // handshake
  foodBag: `${IMG}/icons/food-bag.webp`,
  cafe: `${IMG}/icons/cafe.webp`,
  store: `${IMG}/icons/store.webp`,
  search: `${IMG}/icons/search.webp`,
  bakery: `${IMG}/icons/bakery.webp`,
  user: `${IMG}/icons/user.webp`,
  restaurant: `${IMG}/icons/restaurant.webp`,
  co2: `${IMG}/icons/co2.webp`,
  foodBowl: `${IMG}/icons/food-bowl.webp`,
  lessWaste: `${IMG}/icons/less-waste.webp`,
  heart: `${IMG}/icons/heart.webp`,
  newClients: `${IMG}/icons/new-clients.webp`,
  growth: `${IMG}/icons/growth.webp`,
  piggy: `${IMG}/icons/piggy.webp`,
  control: `${IMG}/icons/control.webp`,
}

export const logos = {
  color: '/assets/images/logo-mark.svg', // wordmark only (logo.svg carries the slogan)
  light: '/assets/images/logo-mark-light.svg', // cream "Food" + orange "Save", for teal bands
}

/** App store links. `null` = not published yet (badge renders inert). */
export const stores = {
  appStore: null,
  googlePlay: null,
}

export const social = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
}

export const contact = {
  phone: '+359 889 237 163',
  phoneHref: 'tel:+359889237163',
  email: 'support@foodsave.tech',
  /** Same Formspree inbox the waitlist used; `_subject` tells them apart. */
  formEndpoint: 'https://formspree.io/f/xjkjvbbq',
}

/**
 * Primary navigation. `to` is a router location. Links with a hash scroll
 * to that section when the page is already open.
 */
export const navLinks = [
  { key: 'hp.nav.home', to: '/', match: 'landing' },
  { key: 'hp.nav.about', to: '/about', match: 'about' },
  { key: 'hp.nav.how', to: { path: '/', hash: '#fs-how' }, match: null },
  { key: 'hp.nav.consumers', to: '/for-clients', match: 'consumers' },
  { key: 'hp.nav.business', to: '/for-businesses', match: 'business' },
  { key: 'hp.nav.contact', to: '/contact', match: 'contact' },
]

/** Footer link columns. */
export const footerColumns = [
  {
    title: 'hp.footer.col1Title',
    links: [
      { key: 'hp.footer.col1Link1', to: '/about' },
      { key: 'hp.footer.col1Link2', to: { path: '/', hash: '#fs-how' } },
      { key: 'hp.footer.col1Link3', to: { path: '/', hash: '#fs-faq' } },
      { key: 'hp.footer.col1Link4', to: '/contact' },
    ],
  },
  {
    title: 'hp.footer.col2Title',
    links: [
      { key: 'hp.footer.col2Link1', to: '/for-clients' },
      { key: 'hp.footer.col2Link2', to: { path: '/for-clients', hash: '#fs-download' } },
      { key: 'hp.footer.col2Link3', to: { path: '/for-clients', hash: '#fs-how' } },
      { key: 'hp.footer.col2Link4', to: { path: '/for-clients', hash: '#fs-faq' } },
    ],
  },
  {
    title: 'hp.footer.col3Title',
    links: [
      { key: 'hp.footer.col3Link1', to: '/for-businesses' },
      { key: 'hp.footer.col3Link2', to: { path: '/contact', query: { topic: 'business' } } },
      { key: 'hp.footer.col3Link3', to: { path: '/for-businesses', hash: '#fs-download' } },
      { key: 'hp.footer.col3Link4', to: { path: '/for-businesses', hash: '#fs-faq' } },
    ],
  },
  {
    title: 'hp.footer.col4Title',
    links: [
      { key: 'hp.footer.col4Link1', to: '/terms' },
      { key: 'hp.footer.col4Link2', to: '/privacy' },
      { key: 'hp.footer.col4Link3', to: '/privacy' },
    ],
  },
]

/** Shared FAQ (home, consumers, business). Reads DOWN the left column, then the right. */
export const faqItems = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: `faq-${n}`,
  q: `hp.faq.q${n}`,
  a: `hp.faq.a${n}`,
}))

/* ── Home ─────────────────────────────────────────────────── */

export const homeSteps = [
  { icon: 'business', title: 'hp.home.how.step1Title', text: 'hp.home.how.step1Text' },
  { icon: 'search', title: 'hp.home.how.step2Title', text: 'hp.home.how.step2Text' },
  { icon: 'user', title: 'hp.home.how.step3Title', text: 'hp.home.how.step3Text' },
  { icon: 'foodBag', title: 'hp.home.how.step4Title', text: 'hp.home.how.step4Text' },
]

export const homeStats = [
  { icon: 'store', value: 'hp.home.stats.v1', label: 'hp.home.stats.l1' },
  { icon: 'heart', value: 'hp.home.stats.v2', label: 'hp.home.stats.l2' },
  { icon: 'foodBowl', value: 'hp.home.stats.v3', label: 'hp.home.stats.l3' },
  { icon: 'co2', value: 'hp.home.stats.v4', label: 'hp.home.stats.l4' },
]

/* ── About ────────────────────────────────────────────────── */

export const aboutHelps = [1, 2, 3].map((n) => ({
  n,
  title: `hp.about.helps.item${n}Title`,
  text: `hp.about.helps.item${n}Text`,
}))

/* ── Consumers ────────────────────────────────────────────── */

export const consumerPerks = [1, 2, 3].map((n) => ({
  n,
  title: `hp.consumers.perks.item${n}Title`,
  text: `hp.consumers.perks.item${n}Text`,
}))

export const consumerDiscover = [
  {
    icon: 'bakery',
    cutout: 'bakery',
    title: 'hp.consumers.discover.item1Title',
    text: 'hp.consumers.discover.item1Text',
  },
  {
    icon: 'restaurant',
    cutout: 'restaurant',
    title: 'hp.consumers.discover.item2Title',
    text: 'hp.consumers.discover.item2Text',
  },
  {
    icon: 'store',
    cutout: 'grocery',
    title: 'hp.consumers.discover.item3Title',
    text: 'hp.consumers.discover.item3Text',
  },
  {
    icon: 'cafe',
    cutout: 'cafe',
    title: 'hp.consumers.discover.item4Title',
    text: 'hp.consumers.discover.item4Text',
  },
]

export const consumerSteps = [1, 2, 3, 4].map((n) => ({
  n,
  title: `hp.consumers.how.step${n}Title`,
  text: `hp.consumers.how.step${n}Text`,
}))

export const consumerValues = [
  { icon: 'piggy', label: 'hp.consumers.value.item1' },
  { icon: 'foodBowl', label: 'hp.consumers.value.item2' },
  { icon: 'store', label: 'hp.consumers.value.item3' },
]

/* ── Business ─────────────────────────────────────────────── */

export const businessWhy = [
  { icon: 'growth', tone: 'teal', title: 'hp.business.why.item1Title', text: 'hp.business.why.item1Text' },
  { icon: 'newClients', tone: 'orange', title: 'hp.business.why.item2Title', text: 'hp.business.why.item2Text' },
  { icon: 'control', tone: 'teal', title: 'hp.business.why.item3Title', text: 'hp.business.why.item3Text' },
  { icon: 'lessWaste', tone: 'orange', title: 'hp.business.why.item4Title', text: 'hp.business.why.item4Text' },
]

export const businessSteps = [1, 2, 3, 4].map((n) => ({
  n,
  title: `hp.business.how.step${n}Title`,
  text: `hp.business.how.step${n}Text`,
}))

export const businessTypes = [
  { icon: 'bakery', photo: 'typeBakery', cutout: 'bakery', title: 'hp.business.types.item1Title', text: 'hp.business.types.item1Text' },
  { icon: 'foodBag', photo: 'typeCanteen', cutout: 'pasta', title: 'hp.business.types.item2Title', text: 'hp.business.types.item2Text' },
  { icon: 'store', photo: 'typeStore', cutout: 'grocery', title: 'hp.business.types.item3Title', text: 'hp.business.types.item3Text' },
  { icon: 'cafe', photo: 'typeCafe', cutout: 'cafe', title: 'hp.business.types.item4Title', text: 'hp.business.types.item4Text' },
  { icon: 'restaurant', photo: 'typeRestaurant', cutout: 'restaurant', title: 'hp.business.types.item5Title', text: 'hp.business.types.item5Text' },
]

export const businessTerms = [1, 2, 3, 4].map((n) => ({
  n,
  title: `hp.business.terms.item${n}Title`,
  text: `hp.business.terms.item${n}Text`,
}))

/* ── Contact ──────────────────────────────────────────────── */

export const contactCards = [
  { icon: 'user', topic: 'consumers', title: 'hp.contact.card1Title', text: 'hp.contact.card1Text' },
  { icon: 'business', topic: 'business', title: 'hp.contact.card2Title', text: 'hp.contact.card2Text' },
  { icon: 'heart', topic: 'general', title: 'hp.contact.card3Title', text: 'hp.contact.card3Text' },
]

export const contactTopics = [
  { value: 'consumers', label: 'hp.contact.form.topic1' },
  { value: 'business', label: 'hp.contact.form.topic2' },
  { value: 'general', label: 'hp.contact.form.topic3' },
  { value: 'media', label: 'hp.contact.form.topic4' },
  { value: 'other', label: 'hp.contact.form.topic5' },
]
