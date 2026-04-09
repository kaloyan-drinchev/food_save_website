# FoodSave — Marketing Website Context

> Use this document as the single source of truth when building the FoodSave marketing website.
> It covers brand identity, app features, design system, copy direction, and technical details.

---

## 1. Brand Identity

### Name & Tagline

- **App Name:** FoodSave
- **Primary Tagline:** "Rescue Your Next Meal"
- **Supporting Subtitle:** "Discover surplus food from local restaurants and stores at up to 70% off"
- **Mission Statement:** Reduce food waste while helping consumers save money and businesses recover revenue from surplus inventory.

### Target Market

- **Country:** Bulgaria (initial launch)
- **Languages:** Bulgarian (primary), English
- **Currency:** Euro (€) — all prices displayed as €X.XX
- **Audience Segments:**
  - **Consumers:** Budget-conscious individuals, students, eco-minded shoppers looking to save money on quality meals while reducing food waste.
  - **Businesses:** Restaurants, bakeries, bistros, cafés, grocery stores, fast food chains, and bars looking to monetize surplus food instead of discarding it.

### Logo & Visual Identity

- **App Icon:** A hand-drawn style **orange leaf** on a white background — symbolizing nature, sustainability, and freshness.
- **Logo Files:** SVG (scalable vector), PNG variants available
- **Brand Motif:** The leaf icon is the primary brand mark, used as a standalone symbol and alongside the wordmark "FoodSave."
- **Visual Personality:** Friendly, approachable, modern, eco-conscious, warm.

---

## 2. Color Palette

### Primary Colors

| Name | Hex | Usage |
|---|---|---|
| **Primary Green** | `#388E3C` | Main brand color — trust, nature, sustainability |
| **Primary Green Light** | `#4CAF50` | Dark-theme variant, hover states, WCAG AA accessible |
| **Accent Orange** | `#FF8700` | CTAs, deals, urgency, appetite stimulation |
| **Accent Orange Dark** | `#E67600` | High-contrast orange variant for accessibility |

### Neutral Colors

| Name | Hex | Usage |
|---|---|---|
| **Neutral Dark** | `#2B2B2B` | Primary text, headings |
| **Neutral Mid** | `#424242` | Secondary text, dividers |
| **Neutral Light** | `#F5F5F5` | Card surfaces, backgrounds |
| **White** | `#FAFAFA` | Page backgrounds, lightest surface |

### Semantic Colors

| Name | Hex | Usage |
|---|---|---|
| **Error Red** | `#D32F2F` | Errors, destructive actions |
| **Error Light** | `#EF9A9A` | Error states on dark backgrounds |
| **Outline** | `#BDBDBD` | Borders, dividers (light theme) |
| **Outline Medium** | `#E0E0E0` | Subtle separators |

### Theme Support

The app and website should support **Light** and **Dark** themes:

- **Light Theme:** White/light grey backgrounds, dark text, green primary, orange accent
- **Dark Theme:** Dark charcoal backgrounds (`#2B2B2B`), light text (`#FAFAFA`), brighter green (`#4CAF50`), same orange accent

### Color Psychology

- **Green:** Eco-friendliness, reliability, health, nature — the core sustainability message
- **Orange:** Appetite, urgency, warmth, excitement — drives action on deals and CTAs
- **White Space:** Clean, modern, approachable — comfortable browsing experience

---

## 3. Typography

### Font Families

| Font | Role | Source |
|---|---|---|
| **Montserrat** | Primary UI font — headings, body text, buttons, navigation | Google Fonts (variable weight) |
| **Rubik** | Data/numbers font — prices, savings, statistics, counters | Google Fonts |

### Type Scale

| Level | Size | Weight | Usage |
|---|---|---|---|
| Display Large | 57px | 400 | Hero section headings |
| Display Medium | 45px | 400 | Major section headings |
| Display Small | 36px | 400 | Subheadings, feature titles |
| Headline Large | 32px | 600 (Semi-bold) | Section titles |
| Headline Medium | 28px | 600 | Card titles, modal headers |
| Headline Small | 24px | 600 | Subsection headers |
| Title Large | 22px | 600 | Dialog/panel titles |
| Title Medium | 16px | 600 | Labels, button text |
| Title Small | 14px | 600 | Chips, badges, tags |
| Body Large | 16px | 400 | Primary body text |
| Body Medium | 14px | 400 | Secondary body text |
| Body Small | 12px | 400 | Captions, helper text |
| Label Large | 14px | 500 | Primary CTA labels |
| Label Medium | 12px | 500 | Tags, tertiary labels |
| Label Small | 11px | 500 | Micro labels |
| **Price Tag** (Rubik) | 20px | 700 (Bold) | Deal prices, savings amounts |

### Typography Guidelines

- Use Montserrat for all general UI text
- Use Rubik **exclusively** for prices (€X.XX), statistics, and numerical data — this creates visual distinction for monetary values
- Generous letter spacing for readability
- Never use more than 2 font families

---

## 4. Design Language

### Shape & Spacing

| Element | Value |
|---|---|
| **Spacing Grid** | 4dp base unit |
| **Spacing Scale** | 4 · 8 · 16 · 24 · 32 · 48 · 64 dp |
| **Card Border Radius** | 30dp (large, pill-like) |
| **Button Border Radius** | 30dp (fully rounded) |
| **Input Field Radius** | 100dp (capsule shape) |
| **Badge Radius** | 6dp |
| **Button Height** | 52dp minimum (accessibility) |
| **Screen Padding** | 16dp horizontal, 24dp top |

### Design Principles

- **Rounded & Friendly:** All interactive elements use generous border radius (30dp+). No sharp corners on cards or buttons.
- **Clean & Spacious:** Generous whitespace between sections. The 4dp grid ensures consistent, rhythmic spacing.
- **Accessible:** Minimum 48×48 tap targets. Color is never the sole indicator of state. WCAG AA contrast ratios.
- **Responsive:** Layouts adapt gracefully from mobile phones to tablets with breakpoint at 600dp.

### Iconography

- Material Design icons as the primary icon set
- Custom brand icon: the leaf motif
- Payment method icons: Google Pay, Revolut, PayPal, card

---

## 5. App Features — Consumer Side

### 5.1 Onboarding Experience

A 4-slide animated introduction that sets the stage:

1. **"Rescue Your Next Meal"** — Hero message with illustration. Introduces the 70% savings hook.
2. **"Save Money Every Day"** — Shows daily savings potential with animated illustrations.
3. **"Protect Our Planet"** — Environmental impact messaging: "Every rescued meal prevents CO₂ emissions and keeps food out of landfills."
4. **"Join FoodSave Today"** — Community invitation with a shimmer-animated "Get Started" CTA.

### 5.2 Home Screen

The consumer home screen is a rich, scroll-based discovery experience:

- **Location Bar:** Shows the user's current area with geolocation support. Tap to change location.
- **"Collect Now" Carousel:** Hot items ready for immediate pickup — horizontal scrollable cards with prices, store names, and time indicators.
- **"Flash Deals" Section:** Time-sensitive deals with live countdown timers showing minutes remaining. Creates urgency.
- **Category Chips:** Scrollable filter chips (Bakery, Restaurant, Fast Food, etc.) to narrow deals by type.
- **View Toggle:** Switch between grid and list views.
- **Notification Bell:** Quick access to deal alerts and order updates with unread badge.
- **Cart Badge:** Persistent cart icon showing item count.

### 5.3 Browse & Discovery

A powerful deal discovery engine:

- **Three View Modes:** Grid, List, and **Interactive Map** (Google Maps with store markers)
- **Advanced Filters:** Category, price range, allergens, distance from user, availability
- **Deal Cards:** Show meal photo, title, original price (struck through), discounted price, quantity remaining, store name, and distance
- **Map View:** Full Google Maps integration with custom store markers. Tap a marker to see a callout card with store details and available deals.
- **Quick Actions:** Add to cart directly from browse, toggle favorites with heart icon

### 5.4 Meal Detail Page

Rich product detail screen:

- **Photo Gallery:** Swipeable image carousel
- **Deal Info:** Meal name, full description, allergens list, meal type category
- **Pricing:** Original price (crossed out) and discounted price prominently displayed
- **Store Info:** Store name, address, distance, tap to view on map
- **Ratings & Reviews:** Star rating display (1–5), review count, scrollable customer reviews
- **Write Review:** Submit text review with star rating picker
- **Add to Cart:** Prominent CTA button

### 5.5 Favorites

Two-tab favorites system:

- **Favorite Meals:** Saved deals with heart toggle, quick add-to-cart
- **Favorite Stores:** Starred business locations showing their latest available deals

### 5.6 Shopping Cart

- Item list with quantity controls (increment/decrement)
- Remove items with swipe or tap
- Subtotal calculation grouped by store
- Clear order summary before checkout
- "Proceed to Payment" CTA

### 5.7 Payment & Checkout

Multiple payment options for convenience:

- **Card Payment:** Secure card details form
- **Google Pay:** Native integration
- **Revolut:** Direct payment support
- **PayPal:** Standard online payment
- Order summary with itemized breakdown
- Pickup location confirmation

### 5.8 Rescues (Order History)

Track all past and active orders:

- **Order List:** Shows completed and in-progress rescues
- **QR Pickup Codes:** Each order generates unique QR codes per store for pickup verification
- **Multi-Store Support:** A single order can contain items from multiple stores, each with its own pickup QR code
- **Order Details:** Expandable sheet showing all items, store addresses, and order status

### 5.9 Notifications

Smart notification system:

- **Deal Alerts:** New deals from favorite stores or nearby locations
- **Order Updates:** Status changes (confirmed, ready for pickup, completed)
- **Promotions:** Special offers and app tips
- Grouped by date, mark as read/unread

### 5.10 Consumer Profile & Gamification

- **Profile Overview:** Name, email, phone
- **"Hero" Badge:** Gamification element — e.g., "Studentski Hero • Lvl 3" — encourages engagement through leveling up
- **Total Savings Counter:** Lifetime money saved displayed in € — a powerful retention metric
- **Quick Settings:** Account details, payment methods, preferences, sign out

### 5.11 Consumer Settings

- **Account Management:** Edit personal info (name, phone), change password
- **Preferences:** Language toggle (Bulgarian/English), theme selection (Light/Dark/System)
- **Quick Addresses:** Save Home, Work, and Other addresses for fast location selection — pick from map or text input
- **Notification Controls:** Toggle deal alerts, order updates, and promotional notifications

---

## 6. App Features — Business Side

### 6.1 Business Dashboard

A command center for business operations:

- **KPI Cards:** Three key metrics at a glance:
  - **Meals Saved** — total food items rescued from waste
  - **Revenue** — total earnings in €
  - **Orders** — total completed orders
- **Revenue Chart:** Interactive chart showing revenue and order trends over time
- **Time Ranges:** Today, This Week, This Month, Custom Range, All Time
- **Recent Orders:** Quick-view list of latest incoming orders

### 6.2 Deal Management

Create and manage surplus food deals:

- **Deal Grid/List:** All active and inactive deals with status indicators
- **Deal Cards Show:** Title, photo, original vs. discounted price, quantity left vs. sold, pickup time window
- **Speed FAB Menu:** Floating action button with quick actions:
  - Create new deal
  - Bulk import deals
  - Location management
- **deal Metrics:** Discount percentage, sold percentage, active/inactive toggle

### 6.3 Create New Deal

Rapid deal creation from existing menu:

- **Menu Item Picker:** Select from business's existing catalog
- **Quantity Available:** Set how many portions are available
- **Discounted Price:** Set the surplus price (app calculates % off)
- **Pickup Window:** Define start and end time for customer pickup
- **One-tap Create:** Publish deal instantly

### 6.4 Menu Management

Full catalog system:

- **Menu Items:** Add, edit, and delete items from the permanent catalog
- **Category Filter:** Chips for quick filtering (Bakery, Restaurant, Bistro, Grocery, Fast Food, Bar, Café, Other)
- **Item Details:** Name, description, photo upload, regular price, allergens (multi-select), availability toggle
- **Grid/List View:** Visual catalog management

### 6.5 Order Management

Real-time order processing:

- **Four Status Tabs:** Pending, Ready, Collected, Cancelled
- **Order Cards:** Customer name, quantity, total price, pickup code, status badge
- **Quick Actions:** Mark as ready → Mark as collected → Complete (or Cancel)
- **QR Code Scanner:** Built-in camera scanner to verify customer pickup codes instantly
- **Order Flow:** Pending → Ready → Collected (linear, simple)

### 6.6 QR Code Scanner

- Built-in mobile camera scanner using the device camera
- Scans customer pickup QR codes
- Automatically updates order status upon successful scan
- Camera permission required with clear explanation

### 6.7 Location Management

Multi-location business support:

- **Location List:** View all store branches
- **Add New Location:** Full form with:
  - Store name
  - Address (searchable, auto-geocoded to map coordinates)
  - Category dropdown
  - Phone number
  - Working hours (per-day time picker, e.g., Monday 9:00–21:00)
  - Store photo upload
- **Edit Location:** Modify any details of existing locations
- **Location Picker:** Select which location the dashboard and deals are scoped to

### 6.8 Business Profile

- **Company Info:** Company name, VAT/EIK number, IBAN, verification status
- **Location Overview:** List of all registered locations
- **"Got surplus to sell?" CTA:** Prominent call-to-action for deal creation
- **Settings Access:** Account details, preferences, notifications, sign out

### 6.9 Business Settings

- **Account:** Edit company name, VAT/EIK, IBAN
- **Change Password:** Secure password update form
- **Preferences:** Language (BG/EN), Theme (Light/Dark/System)
- **Notification Controls:** Toggle new order alerts, payment received, system notifications

### 6.10 Business Analytics (Metrics)

Premium analytics dashboard:

- **Time Range Filters:** Today, Week, Month, Custom, All Time
- **Key Metrics:** Meals saved count, revenue (€), order count
- **Charts:** Visual revenue and order trend graphs
- **Data Export:** Analytics data for business intelligence

---

## 7. Shared Features

### 7.1 Authentication

Secure, role-based authentication:

- **Login:** Email + password with autofill support for password managers
- **Forgot Password:** Email-based reset link flow with success confirmation
- **Role Selection:** Clear choice — "I want to save food" (Consumer) or "I'm a business" (Business) with note "You can always switch roles later"
- **Consumer Signup:** Multi-step: Personal Info → Security → Preferences
- **Business Signup:** Multi-step: Account → Store Info (name, category, EIK, address, IBAN) → Compliance (БАБХ food safety checkbox)
- **Social Login:** Google and Facebook login buttons available
- **Session Security:** Tokens stored in encrypted secure storage

### 7.2 Dual Language Support

- Full Bulgarian and English localization
- Every user-facing string loaded from translation files
- Language toggle in settings — instant switch, no restart required

### 7.3 Light & Dark Theme

- Three modes: Light, Dark, System (follows device setting)
- All colors resolve from the theme — consistent across every screen
- Toggle in settings with immediate effect

### 7.4 Maps & Geolocation

- **Google Maps Integration:** Interactive maps for browsing deals by location
- **Geolocation:** Detect user's current position for "Near You" features
- **Geocoding:** Convert addresses to map coordinates and vice versa
- **Store Markers:** Custom pins on map with info callout cards
- **Navigation:** Tap store address to open in device maps app for directions

### 7.5 About & Legal

- App version info and description
- Terms & Conditions (fully localized BG/EN)
- Privacy Policy

---

## 8. Food Categories

The app supports these business/meal categories:

| Category | Bulgarian |
|---|---|
| Bakery | Пекарна |
| Restaurant | Ресторант |
| Bistro | Бистро |
| Grocery | Хранителен магазин |
| Fast Food | Бързо хранене |
| Bar | Бар |
| Café | Кафе |
| Other | Друго |

### Meal Types

Soup, Pizza, Starter, Salad, Sandwich, Pasta, Sushi, Pastry, Dessert, Other

### Allergen Tracking

Full allergen information is displayed on every meal deal, allowing consumers to make safe dietary choices.

---

## 9. Key Selling Points (for Marketing Copy)

### For Consumers

1. **Save Up to 70%** — Rescue surplus meals from top local spots at massive discounts
2. **Fight Food Waste** — Every rescued meal prevents CO₂ emissions and keeps food from landfills
3. **Discover Local Gems** — Browse nearby restaurants, bakeries, and cafés on an interactive map
4. **Flash Deals with Countdown** — Time-limited offers create exciting, gamified shopping
5. **Collect & Go** — Order in-app, show your QR code, pick up your meal — no waiting
6. **Smart Favorites** — Save your favorite stores and meals for quick re-ordering
7. **Track Your Impact** — See your total savings (€) and your "Hero" level as you rescue more meals
8. **Multiple Payment Options** — Card, Google Pay, Revolut, PayPal — pay your way
9. **Allergen Aware** — Full allergen information on every deal for safe choices
10. **Bilingual** — Full Bulgarian and English support

### For Businesses

1. **Recover Lost Revenue** — Turn unsold food into profit instead of waste
2. **Simple Deal Creation** — Create surplus deals from your menu in seconds
3. **Real-Time Dashboard** — Track meals saved, revenue, and orders with interactive charts
4. **Multi-Location Support** — Manage multiple branches from a single account
5. **QR Pickup Verification** — Scan customer QR codes for fast, error-free order fulfillment
6. **Order Management** — Clear status flow: Pending → Ready → Collected
7. **Menu Catalog** — Maintain a permanent menu catalog and create deals from it
8. **БАБХ Compliant** — Built with Bulgarian food safety (БАБХ) regulations in mind
9. **Analytics & Metrics** — Track performance by day, week, month, or custom range
10. **Customizable Hours** — Set working hours per location, per day

---

## 10. Environmental Impact Messaging

Use these themes prominently on the website:

- **"Every rescued meal prevents CO₂ emissions and keeps food out of landfills"**
- **"Join a community making a real difference"**
- Show cumulative stats: total meals saved, total CO₂ prevented, total € saved by all users
- Sustainability is core — the leaf icon, green branding, and eco-messaging should be central to the website

---

## 11. User Journey Flows (for Website Storytelling)

### Consumer Journey
1. **Download** the app → **Onboarding** (4 animated slides)
2. **Sign up** (email, or Google/Facebook) → **Set location**
3. **Browse** deals near you (list, grid, or map) → **Filter** by category/allergens/price
4. **Tap** a deal → View full details, reviews, store info
5. **Add to cart** → Review order → **Pay** (Card/GPay/Revolut/PayPal)
6. **Go to store** → Show **QR code** → **Collect** your meal
7. **Rate & Review** → Level up your **Hero badge** → See **total savings**

### Business Journey
1. **Download** the app → **Register** as business (EIK, IBAN, БАБХ compliance)
2. **Add locations** (address, hours, photos, category)
3. **Build menu** catalog (items, prices, allergens, photos)
4. **End of day:** Create **surplus deals** from menu items (set quantity, price, pickup window)
5. **Monitor dashboard** — watch orders come in real-time
6. **Customer arrives** → **Scan QR code** → Mark as collected
7. **Review analytics** — track revenue, meals saved, trends

---

## 12. Technical Highlights (for "About" / "How It Works" Sections)

| Feature | Detail |
|---|---|
| **Platform** | iOS & Android (native Flutter) |
| **Responsive** | Scales beautifully from phones to tablets |
| **Real-time** | Live order updates and deal countdowns |
| **Secure** | Encrypted token storage, secure payment processing |
| **Fast** | Optimized image caching, skeleton loading states |
| **Offline-ready** | Local data storage with Hive for seamless experience |
| **Maps** | Full Google Maps integration with geolocation |
| **Multi-language** | Bulgarian & English, instant switching |
| **Multi-theme** | Light, Dark, and System-follow modes |
| **Accessible** | WCAG AA colors, 48px tap targets, semantic labels |

---

## 13. Website Design Recommendations

### Match the App's Design Language

- Use the same **Montserrat + Rubik** font combination
- Apply the **green (#388E3C) + orange (#FF8700)** color scheme
- Use **30dp+ border radius** on cards and CTAs (rounded, friendly)
- Implement **light/dark mode** toggle on the website
- Use the **leaf icon** as a recurring motif (favicon, section dividers, decorative elements)

### Suggested Website Sections

1. **Hero Section** — "Rescue Your Next Meal" with app screenshot mockups and download CTAs
2. **How It Works** — 3-step visual flow (Browse → Order → Collect) for consumers
3. **Features Showcase** — Interactive cards highlighting key features (map view, flash deals, QR pickup, etc.)
4. **For Businesses** — Dedicated section with dashboard preview, KPI cards, deal management demo
5. **Impact Counter** — Live/animated stats: meals saved, CO₂ prevented, € saved
6. **Testimonials/Reviews** — User quotes and star ratings
7. **Download Section** — App Store + Google Play badges with QR code
8. **FAQ** — Common questions about pricing, availability, payment methods
9. **Footer** — Links to Terms, Privacy, About, Contact, Social Media

### Imagery Direction

- **App Screenshots:** Clean device mockups showing real app screens (home, browse map, deal detail, QR pickup, dashboard)
- **Illustrations:** Eco-themed illustrations matching the onboarding style (food, nature, community)
- **Photography:** Warm, appetizing food photography — diverse cuisine types (bakery, sushi, pasta, salads)
- **Icons:** Simple, rounded line icons consistent with the app's Material Design aesthetic

---

## 14. App Store / Download Info

- **App Name:** FoodSave
- **Category:** Food & Drink
- **Platforms:** iOS (App Store), Android (Google Play)
- **Price:** Free to download
- **Required Permissions:** Camera (QR scanning), Location (nearby deals)

---

## 15. Compliance & Trust Signals

Display these on the website for credibility:

- **БАБХ Compliant** — All businesses confirm food safety regulations
- **Secure Payments** — Encrypted payment processing
- **Privacy First** — Terms & Conditions and Privacy Policy available in BG and EN
- **Local Focus** — Built specifically for the Bulgarian market
- **Euro Pricing** — Transparent pricing in €, no hidden fees
