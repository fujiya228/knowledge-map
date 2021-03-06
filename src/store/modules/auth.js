const auth = {
  strict: process.env.NODE_ENV !== "production",
  namespaced: true,
  state: {
    user: null,
    userData: null,
    isLoggedIn: false,
    isAuthStateChanged: false,
    unsubscribe: null
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user,
  },
  mutations: {
    SET_IS_LOGGED_IN(state, payload) {
      state.isLoggedIn = payload.isLoggedIn
    },
    SET_USER(state, payload) {
      state.user = payload.user
    },
    SET_USER_DATA(state, payload) {
      state.userData = payload.userData
    },
    SET_IS_AUTH_STATE_CHANGED(state, payload) {
      state.isAuthStateChanged = payload.isAuthStateChanged
    },
    UNSBSCRIBE(state) {
      state.unsubscribe()
      state.unsubscribe = null
    }
  },
  actions: {
    sendEmail({ state }) {
      // Auth.vueの中でuserの存在確認済
      state.user
        .sendEmailVerification()
        .then(function () {
          console.log("email sent");
        })
        .catch(function (error) {
          console.log("sendEmailVerification", error.message);
        });
    }
  }
}

export default auth;