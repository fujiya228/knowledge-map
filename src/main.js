import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import helpers from "./helpers/helpers"; // こいつをstoreより先に読み込まなくてはならんかった TODO
import router from './router'
import store from './store'
import VTooltip from 'v-tooltip'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronUp, faArchive, faGripLines, faPlus, faMinus, faTimes, faArrowLeft, faExclamationCircle,
  faPen, faCheck, faSave, faFileImport, faSyncAlt, faEllipsisH, faBoxOpen
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChevronUp, faArchive, faGripLines, faPlus, faMinus, faTimes, faArrowLeft, faExclamationCircle,
  faPen, faCheck, faSave, faFileImport, faSyncAlt, faEllipsisH, faBoxOpen
)
Vue.component('fa-icon', FontAwesomeIcon)
Vue.use(VTooltip)

Vue.config.productionTip = false
console.log(helpers)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
