import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

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
  faPen, faCheck, faSave, faFileImport, faSyncAlt, faEllipsisH, faBoxOpen, faSpinner
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChevronUp, faArchive, faGripLines, faPlus, faMinus, faTimes, faArrowLeft, faExclamationCircle,
  faPen, faCheck, faSave, faFileImport, faSyncAlt, faEllipsisH, faBoxOpen, faSpinner
)
Vue.component('fa-icon', FontAwesomeIcon)
Vue.use(VTooltip)

Vue.config.productionTip = false
console.log('helpers', helpers)

const firebaseConfig = {
  apiKey: "AIzaSyDjBEIpLR7Hbd3Tu63239crG14faGAyGyc",
  authDomain: "fujiya-knowledge-map.firebaseapp.com",
  databaseURL: "https://fujiya-knowledge-map.firebaseio.com",
  projectId: "fujiya-knowledge-map",
  storageBucket: "fujiya-knowledge-map.appspot.com",
  messagingSenderId: "50352065338",
  appId: "1:50352065338:web:507f31e43af62a6c29de03",
  measurementId: "G-BVX20LYH5B"
};

try {
  firebase.initializeApp(firebaseConfig)
} catch (e) {
  console.log(e.message)
}

store.state.auth.auth = firebase.auth()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
