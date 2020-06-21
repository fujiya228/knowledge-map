<template>
  <div class="Auth">
    <h1 v-if="isSignUpMode">Sign Up</h1>
    <h1 v-else>Log In</h1>
    <div class="Auth__icon" v-if="isLoading">
      <Icon icon="spinner" :size="32" :font="24" />
    </div>
    <div class="Auth__container">
      <input class="Input" type="email" v-model="email" placeholder="email" />
      <input class="Input" type="password" v-model="password" placeholder="password" />
      <Btn v-if="isSignUpMode" @click.native="sigin_up()">Sign Up</Btn>
      <Btn v-else @click.native="login()">Log In</Btn>
    </div>
    <div class="Auth__switch" @click="isSignUpMode = !isSignUpMode">{{switchText}}はこちら</div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

import Icon from "@/components/atoms/Icon";
import Btn from "@/components/atoms/Btn";

export default {
  name: "Auth",
  components: {
    Icon,
    Btn
  },
  data() {
    return {
      email: "",
      password: "",
      isSignUpMode: false,
      isLoading: false
    };
  },
  methods: {
    sigin_up() {
      this.isLoading = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("sigin up ok");
          this.login();
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            alert("The password is too weak.");
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
      this.isLoading = false;
    },
    login() {
      this.isLoading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(async () => {
          this.$store.commit("auth/SET_IS_LOGGED_IN", { isLoggedIn: true });
          await this.$store.dispatch("auth/setUser");
          this.email = this.password = "";
          const next = this.$route.query.next || "/";
          this.$router.push(next);
        })
        .catch(err => {
          console.log(err.message);
          alert(err.message);
          this.isLoading = false;
        });
    }
  },
  computed: {
    switchText() {
      return this.isSignUpMode ? "ログイン" : "新規登録";
    }
  }
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
    margin: 32px;
    font-size: 32px;
    animation: spin 1s linear infinite;
  }
  &__container {
    max-width: 300px;
    width: 80%;
  }
  &__switch {
    margin: 16px;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>