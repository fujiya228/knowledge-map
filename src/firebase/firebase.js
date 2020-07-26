import store from "../store"
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions"
import "firebase/analytics"

const state = store.state

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

const init = function () {
  try {
    firebase.initializeApp(firebaseConfig)
  } catch (e) {
    console.log(e.message)
  }
  // 認証状態の維持 LOCALを指定することでブラウザを閉じても続く
  // routerより実行されるタイミングが遅いので注意
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  firebase.analytics();
  setOnAuth()
  console.log('setOnAuth')
}

const setOnAuth = function () {
  store.commit("auth/SET_IS_AUTH_STATE_CHANGED", { isAuthStateChanged: false })
  state.auth.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    user = user ? user : false
    store.commit("auth/SET_USER", { user: user })
    store.commit("auth/SET_IS_LOGGED_IN", { isLoggedIn: user })
    store.commit("auth/SET_IS_AUTH_STATE_CHANGED", { isAuthStateChanged: true })
    console.log('onAuthStateChanged')
  })
}

const Firebase = {
  init: init,
  setOnAuth: setOnAuth
}
export default Firebase