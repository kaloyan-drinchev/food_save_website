/**
 * FontAwesome, loaded on demand.
 *
 * Only the ten icons the app actually renders are registered, instead of the
 * whole `fas` / `far` / `fab` packs (which added ~1.5 MB to the bundle).
 *
 * This module is pulled in lazily from main.js, so the public pages — which
 * use inline SVG (see components/site/SiteBrandIcon.vue) — never download the
 * FontAwesome runtime at all. It is fetched the first time an admin or legacy
 * page renders a <FontAwesomeIcon>.
 *
 * When adding an icon to a legacy/admin view, import it here too.
 */
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBars,
  faXmark,
  faSun,
  faMoon,
  faGlobe,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons'
import {
  faAppStoreIos,
  faGooglePlay,
  faInstagram,
  faFacebookF,
} from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = true

library.add(
  faBars,
  faXmark,
  faSun,
  faMoon,
  faGlobe,
  faMobileScreen,
  faAppStoreIos,
  faGooglePlay,
  faInstagram,
  faFacebookF,
)

export default FontAwesomeIcon
