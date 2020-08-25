<template>
  <div class="Auth">
    <template v-if="isAuthStateChanged">
      <h1>{{titleText}}</h1>
      <div class="Auth__icon" v-if="isLoading">
        <Icon icon="spinner" :size="32" :font="24" />
      </div>
      <div class="Auth__container">
        <input
          class="Input"
          type="email"
          v-model="email"
          placeholder="email"
          @keydown.enter="clickBtn()"
        />
        <input
          class="Input"
          type="password"
          v-model="password"
          placeholder="password"
          @keydown.enter="clickBtn()"
        />
        <Btn @click.native="clickBtn()">{{titleText}}</Btn>
      </div>
      <div class="Auth__switch" @click="isSignUpMode = !isSignUpMode">{{switchText}}はこちら</div>
      <div class="Auth__switch">
        <router-link to="/map-free">お試しはこちら</router-link>
      </div>
    </template>
    <div class="Auth__icon" v-else>
      <Icon icon="spinner" :size="32" :font="24" />
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import { mapState } from "vuex";

import Icon from "@/components/atoms/Icon";
import Btn from "@/components/atoms/Btn";

export default {
  name: "Auth",
  components: {
    Icon,
    Btn,
  },
  data() {
    return {
      email: "",
      password: "",
      isSignUpMode: false,
      isLoading: false,
      isSmapleUser: false,
    };
  },
  methods: {
    clickBtn() {
      let error = {
        email: "",
        password: "",
      };
      if (this.email == "") error.email = " [email]";
      if (this.password == "") error.password = " [password]";
      if (error.email || error.password) {
        alert("Please enter" + error.email + error.password);
        return;
      }
      this.isSignUpMode ? this.sign_up() : this.login();
    },
    sign_up() {
      this.isLoading = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("sigin up ok");
          this.login();
        })
        .catch(function (error) {
          console.log(error);
          error.code == "auth/weak-password"
            ? alert("The password is too weak.")
            : alert(error.message);
        })
        .then(() => {
          this.isLoading = false;
        });
    },
    login(email = this.email, password = this.password) {
      this.isLoading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((err) => {
          console.log(err.message);
          alert(err.message);
          this.isSignUpMode = true;
        })
        .then(async () => {
          this.isLoading = false;
        });
    },
    verifiedEmail() {
      firebase.auth().signOut();
      this.isSignUpMode = false;
      this.isEmailVerifyMode = false;
    },
  },
  watch: {
    user() {
      if (this.user) {
        this.email = this.password = "";
        const next = this.$route.query.next || "/map-free";
        this.$router.push(next);
      }
    },
  },
  computed: {
    titleText() {
      return this.isSignUpMode ? "Sign Up" : "Log In";
    },
    switchText() {
      return this.isSignUpMode ? "ログイン" : "新規登録";
    },
    ...mapState({
      user: (state) => state.auth.user,
      isAuthStateChanged: (state) => state.auth.isAuthStateChanged,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/variable";
.Auth {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: $color-dark;
  color: white;
  &__icon {
    @include loading-icon;
  }
  &__container {
    max-width: 300px;
    width: 80%;
    :not(:last-child) {
      margin-bottom: 8px;
    }
  }
  &__switch {
    margin: 16px;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
    a {
      color: white;
    }
  }
}
</style>