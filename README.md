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

| Path | Description |
|------|-------------|
| `/` | Home — hero carousel, how it works, download, waitlist, FAQ, contact |
| `/privacy` | Privacy Policy (EN/BG) |
| `/terms` | Terms & Conditions (EN/BG) |
| `/admin` | Admin Dashboard (login: `admin` / `guiadmin`) |

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
  composables/useAdminMock.js    Mock data for admin dashboard
```
