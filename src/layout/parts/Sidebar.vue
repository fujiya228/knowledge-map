<template>
  <div class="Sidebar" v-show="sidebar.isOpen">
    <div class="Sidebar__header">
      <div class="Sidebar__button" @click="logout()">ログアウト</div>
      <div class="Sidebar__close" @click="closeSidebar()">
        <Icon icon="angle-double-left" :size="32" :font="20" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";
export default {
  name: "Sidebar",
  components: {
    Icon
  },
  data() {
    return {};
  },
  methods: {
    logout() {
      this.auth.signOut().then(() => {
        this.$store.commit("auth/SET_IS_LOGGED_IN", { isLoggedIn: false });
        this.$router.push("auth");
      });
    },
    closeSidebar() {
      this.sidebar.isOpen = false;
    }
  },
  computed: {
    ...mapState(["sidebar"]),
    ...mapState({
      auth: state => state.auth.auth
    })
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Sidebar {
  box-sizing: border-box;
  width: $sidebar-width;
  height: 100%;
  background: #eee;
  &:hover {
    .Sidebar__close {
      opacity: 1;
    }
  }
  &__header {
    @include header;
    justify-content: space-between;
    @include button-hover;
  }
  &__button {
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
    padding: 0 8px;
    user-select: none;
    cursor: pointer;
    @include button-hover;
  }
  &__close {
    width: 32px;
    height: 32px;
    border-radius: 3px;
    cursor: pointer;
    @include button-hover;
    opacity: 0;
  }
}
</style>