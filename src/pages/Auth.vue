<template>
  <div class="Auth">
    <template v-if="isAuthStateChanged">
      <h1>{{titleText}}</h1>
      <div class="Auth__icon" v-if="isLoading">
        <Icon icon="spinner" :size="32" :font="24" />
      </div>
      <!-- アドレス未確認 -->
      <div class="EmailVerify__container" v-if="isEmailVerifyMode">
        <p>{{email}}</p>
        <p>上記のアドレスに確認用メールを送信しました。</p>
        <Btn @click.native="isEmailVerifyMode = false">アドレスを確認済</Btn>
      </div>
      <!-- 上記以外 -->
      <template v-else>
        <div class="Auth__container">
          <input class="Input" type="email" v-model="email" placeholder="email" />
          <input class="Input" type="password" v-model="password" placeholder="password" />
          <Btn @click.native="clickBtn()">{{titleText}}</Btn>
        </div>
        <div class="Auth__switch" @click="isSignUpMode = !isSignUpMode">{{switchText}}はこちら</div>
      </template>
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
    Btn
  },
  data() {
    return {
      email: "",
      password: "",
      isSignUpMode: false,
      isEmailVerifyMode: false,
      isLoading: false
    };
  },
  methods: {
    clickBtn() {
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
        .catch(function(error) {
          console.log(error);
          error.code == "auth/weak-password"
            ? alert("The password is too weak.")
            : alert(error.message);
        })
        .then(() => {
          this.isLoading = false;
        });
    },
    login() {
      this.isLoading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(err => {
          console.log(err.message);
          alert(err.message);
          this.isSignUpMode = true;
        })
        .then(async () => {
          this.isLoading = false;
        });
    }
  },
  watch: {
    user() {
      // メールアドレス確認
      if (this.user.emailVerified) {
        // メールアドレス確認済み
        this.email = this.password = "";
        const next = this.$route.query.next || "/";
        this.$router.push(next);
      } else {
        // メールアドレス未確認
        this.isEmailVerifyMode = true;
        this.$store.dispatch("auth/sendEmail");
      }
    }
  },
  computed: {
    titleText() {
      if (this.isEmailVerifyMode) return "メールアドレス確認";
      return this.isSignUpMode ? "Sign Up" : "Log In";
    },
    switchText() {
      return this.isSignUpMode ? "ログイン" : "新規登録";
    },
    ...mapState({
      user: state => state.auth.user,
      isAuthStateChanged: state => state.auth.isAuthStateChanged
    })
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