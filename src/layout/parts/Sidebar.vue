<template>
  <div class="Sidebar" v-show="sidebar.isOpen">
    <div class="Sidebar__header">
      <div class="Sidebar__button" @click="logout()">ログアウト</div>
      <div class="Sidebar__close" @click="closeSidebar()">
        <Icon icon="angle-double-left" :size="32" :font="20" />
      </div>
    </div>
    <div class="Sidebar__search Sidebar__item">
      <Icon icon="search" />
      <input type="text" v-model="query" />
    </div>
    <div class="Sidebar__list">
      <div
        class="Sidebar__node Sidebar__item"
        v-for="node in nodeFilter"
        :key="node.id"
        :class="{selected: node == detailsMenu.node}"
        @click="goToNode(node)"
      >{{node.title}}</div>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";
export default {
  name: "Sidebar",
  components: {
    Icon
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    logout() {
      this.detailsMenu.node = null;
      this.$store.commit("reset_data");
      firebase.auth().signOut();
    },
    closeSidebar() {
      this.sidebar.isOpen = false;
    },
    goToNode(node) {
      // console.log(this.$route.name);
      if (this.$route.name === "Edit") this.$router.push(node.id);
      else {
        this.$store.dispatch("selectNode", node);
        let FreeGraph = document.getElementById("FreeGraph");
        let area_width = this.width - this.$store.getters["sidebar_width"];
        FreeGraph.scrollLeft = node.x - area_width / 2;
        FreeGraph.scrollTop = node.y - this.height / 2;
      }
    }
  },
  watch: {
    user() {
      if (!this.user) this.$router.push("/auth");
    }
  },
  computed: {
    ...mapState(["width", "height", "nodes", "detailsMenu", "sidebar"]),
    ...mapState({
      user: state => state.auth.user
    }),
    nodeFilter() {
      // title部分一致検索（一致する部分がない場合-1を返すのを使う）
      return this.nodes.filter(item => item.title.indexOf(this.query) !== -1);
    }
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
  &__item {
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    padding: 4px 16px;
  }
  &__search {
    display: flex;
    input {
      box-sizing: border-box;
      width: calc(100% - 24px);
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: white;
      border: solid 1px black;
    }
  }
  &__list {
    box-sizing: border-box;
    height: calc(100% - 80px);
    width: 100%;
    overflow: auto;
    padding-bottom: 24px;
  }
  &__node {
    @include ellipse;
    cursor: pointer;
    &:hover {
      background: #ccc;
    }
    &.selected {
      background: $color-main-l;
    }
  }
}
</style>