# FoodSave Website

FoodSave connects customers with local restaurants and stores that have surplus food at up to 70% off. Save money, eat well, reduce waste.

Built with **Vue 3 + Vite**, **Vue Router**, **vue-i18n** (BG/EN), and **vue-chartjs** for the admin dashboard.

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

## Production Build

```sh
npm run build
npm run preview   # preview the build locally
```

## Routes

| Path              | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `/`               | Home (2026 redesign) — hero, audience cards, how it works, stats, FAQ, download band |
| `/about`          | За FoodSave — mission, how FoodSave helps                          |
| `/for-clients`    | За потребители — perks, what you can find, steps, value, FAQ       |
| `/for-businesses` | За бизнеса — why, steps, business types, partnership terms, FAQ    |
| `/contact`        | Контакти — contact cards + form (Formspree)                        |
| `/privacy`        | Privacy Policy (EN/BG)                                             |
| `/terms`          | Terms & Conditions (EN/BG)                                         |
| `/admin`          | Admin Dashboard (login: `admin` / `guiadmin`)                      |

Previous pages stay reachable while the redesign is reviewed: `/legacy-home`, `/legacy-for-clients`, `/legacy-for-businesses`, `/old`.

### Public site (redesign) — where things live

- `src/assets/css/site.css` — design tokens (colours, type scale, radii, spacing) scoped under `.fs`
- `src/components/site/` — nav, footer, buttons, store badges, FAQ, CTA band, audience cards, steps, banners
- `src/content/site.js` — structure/config: nav & footer links, photo slots, icons, store links, contact details
- `src/i18n/{bg,en}.js` → `hp.*` — every string on the public pages
- `public/assets/images/site/` — optimised WebP photos, cut-outs and the designer's icon set
- `design-source/` (git-ignored) — raw design drop; the mockups themselves live in `~/Downloads/FoodSave_Web_site`

## Admin verification workflow

Routes (guarded by the admin JWT `role === "admin"` claim):

| Path                               | View                         |
| ---------------------------------- | ---------------------------- |
| `/admin/verifications`             | `VerificationsQueueView.vue` |
| `/admin/verifications/:businessId` | `VerificationReviewView.vue` |

Backend endpoints consumed (all require `Authorization: Bearer <admin JWT>`):

| Method  | Path                                                             | Body / Notes                                                                                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`   | `/admin/businesses` (optionally `?status=&page=&limit=&search=`) | Array (or `{ items: [] }`) of businesses. Used to populate the queue.                                                                                                                                                                                     |
| `GET`   | `/admin/businesses/:id`                                          | Detail. Expected fields: `companyName`, `bulstatVat`, `businessType.type`, `status`, `isVerified`, `createdAt`, `submittedAt?`, `locations[0].{latitude, longitude, address, city, phoneNumber}`, `owner.{firstName, lastName, email}` (or `ownerEmail`). |
| `GET`   | `/certificates?businessId=:id`                                   | `[{ id, type, url, createdAt }]`. `type` ∈ `"HACCP"` \| `"BABKH"`. `url` is a direct MinIO/S3 URL; the admin UI uses it directly in `<img>` / `<iframe>`.                                                                                                 |
| `PATCH` | `/admin/businesses/:id/status`                                   | `{ "status": "validated" }` to approve, `{ "status": "notValidated" }` to reject / revoke. There is no `"rejected"` state — rejection puts the business back in the unverified pool.                                                                      |

All four are wrapped in `src/services/api.js` under `api.admin.*`:

- `api.admin.listBusinessesByStatus({ status, page, limit, search })`
- `api.admin.getBusiness(id)`
- `api.admin.listCertificates(businessId)`
- `api.admin.setBusinessStatus(id, 'validated' | 'notValidated')`

Post-approval side effects (OneSignal push with `data.type: "business_verified"`, `isVerified` flip, welcome email) are owned by the backend — the admin app only triggers the `PATCH`.

## Project Structure

```
src/
  main.js                        App entry
  App.vue                        Root with <RouterView>
  router/index.js                4 routes (lazy-loaded)
  i18n/{en,bg,index}.js          Full EN/BG translations
  assets/css/style.css           Main site styles
  assets/css/admin.css           Admin dashboard styles
  components/
    layout/                      AppNavbar, AppFooter
    home/                        HeroCarousel, About, Download, Waitlist, FAQ, Contact
    admin/                       Login, Header, Sidebar, KpiGrid, Charts, Tables, Events
  views/                         HomeView, PrivacyView, TermsView, AdminView
```
