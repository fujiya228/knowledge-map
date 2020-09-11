<template>
  <div class="Admin">
    <h1>Admin</h1>
    <div class="Admin__icon" v-if="isLoading">
      <Icon icon="spinner" :size="32" :font="24" />
    </div>
    <div class="Admin__container">
      <h2>現在のユーザー</h2>
      <p v-if="user">{{user.email}}</p>
      <input
        class="Input"
        type="email"
        v-model="email"
        placeholder="email"
        @keydown.enter="login()"
      />
      <input
        class="Input"
        type="password"
        v-model="password"
        placeholder="password"
        @keydown.enter="login()"
      />
      <input
        class="Input"
        type="password"
        v-model="newPassword"
        placeholder="new password"
        @keydown.enter="updatePassword()"
      />
      <Btn @click.native="updatePassword()">パスワード更新</Btn>
      <Btn @click.native="login()">ログイン</Btn>
      <Btn @click.native="logout()">ログアウト</Btn>
      <Btn @click.native="verifyEmail()">アドレスを確認済にする</Btn>
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
      newPassword: "",
      isLoading: false,
    };
  },
  methods: {
    updatePassword() {
      this.isLoading = true;
      this.user
        .updatePassword(this.newPassword)
        .then(function (res) {
          alert("password更新成功");
          console.log(res);
          this.password = this.newPassword;
          this.newPassword = "";
        })
        .catch(function (error) {
          console.log("error", error);
          alert("更新失敗", error.message);
        })
        .then(async () => {
          this.isLoading = false;
        });
    },
    login() {
      this.isLoading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch((err) => {
          console.log(err.message);
          alert(err.message);
        })
        .then(async () => {
          this.isLoading = false;
        });
    },
    logout() {
      this.isLoading = true;
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.isLoading = false;
        });
    },
    verifyEmail() {
      this.isLoading = true;
      this.user
        .updateProfile({
          emailVerified: true,
        })
        .then(function (res) {
          alert("更新成功");
          console.log(res);
        })
        .catch(function (error) {
          console.log("error", error);
          alert("更新失敗");
        })
        .then(async () => {
          this.isLoading = false;
        });
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/variable";
.Admin {
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
  }
  .Input,
  .Button {
    margin-bottom: 8px;
  }
}
</style>