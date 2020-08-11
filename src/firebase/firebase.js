import store from "../store"
import * as firebase from "firebase/app";
import "firebase/auth";
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
    store.commit("auth/SET_IS_LOGGED_IN", { isLoggedIn: !!user })
    store.commit("auth/SET_IS_AUTH_STATE_CHANGED", { isAuthStateChanged: true })
    console.log('onAuthStateChanged')
    if (user) getUserData(user)
  })
}

const getUserData = async function (user) {
  let usersRef = firebase.firestore().collection("users");
  let uid = user.uid;
  let userData;
  // ユーザー情報の取得
  await usersRef
    .doc(uid)
    .get()
    .then((res) => {
      console.log("res", res.data());
      userData = res.data();
    })
    .catch((err) => {
      console.log("err", err);
    });
  // ユーザーの存在確認
  if (!userData) {
    // ユーザー情報作成
    let date = Date(Date.now());
    userData = {
      uid: uid,
      email: user.email,
      items: [],
      latest: "",
      paid: null,
      created_at: date,
      updated_at: date,
    };
    // Firebaseにセット
    usersRef
      .doc(uid)
      .set(userData)
      .then(() => {
        console.log("Success add to users collection", uid);
      })
      .catch((error) => {
        console.log("Error add to users collection:", error);
      });
  }
  // ユーザー情報をセット
  store.commit("auth/SET_USER_DATA", { userData: userData });
}

const Firebase = {
  init: init,
  setOnAuth: setOnAuth
}
export default Firebase