<template>
  <div class="Sidebar" v-show="sidebar.isOpen">
    <div class="Sidebar__header">
      <div class="Sidebar__title">
        <input type="text" v-model="dataInfo.title" />
      </div>
      <div class="Sidebar__close" @click="closeSidebar()">
        <Icon icon="angle-double-left" :size="32" :font="20" />
      </div>
    </div>
    <div class="Sidebar__group" @click="isMenuOpen = !isMenuOpen">
      <div class="Sidebar__group__title">Menu</div>
      <transition name="group">
        <Icon icon="chevron-up" v-if="isMenuOpen" />
      </transition>
    </div>
    <template v-if="isMenuOpen">
      <div class="Sidebar__item Sidebar__button" @click="openAuth()">
        <Icon icon="user-alt" />
        <div class="Sidebar__button__text" v-if="user">{{user.email}}</div>
        <div class="Sidebar__button__text" v-else>ログイン</div>
      </div>
      <div class="Sidebar__item Sidebar__button" @click="dataInfo.isSave=true">
        <Icon icon="save" />
        <div class="Sidebar__button__text">保存</div>
      </div>
      <div class="Sidebar__item Sidebar__button" @click="dataInfo.isLoad=true">
        <Icon icon="file" />
        <div class="Sidebar__button__text">マップ</div>
      </div>
      <div class="Sidebar__item Sidebar__button" @click="createNewMap()">
        <Icon icon="plus" />
        <div class="Sidebar__button__text">新規作成</div>
      </div>
      <div class="Sidebar__item Sidebar__button" @click="statusInfo.isEdit=true">
        <Icon icon="flag" />
        <div class="Sidebar__button__text">ステータス</div>
      </div>
      <div class="Sidebar__item Sidebar__button" @click="dataInfo.isSettings=true">
        <Icon icon="cog" />
        <div class="Sidebar__button__text">マップ設定</div>
      </div>
    </template>
    <div class="Sidebar__divider" :class="{on:isMenuOpen}"></div>
    <div class="Sidebar__search">
      <Icon icon="search" />
      <input type="text" v-model="query" />
    </div>
    <div class="Sidebar__item">
      <IconButton icon="plus" :class="{active: isAddMode}" @click.native="isAddMode = !isAddMode" />
      <IconButton
        icon="flag"
        :class="{active: isStatusFilter}"
        :style="{background:statusColor(status_query, defaultFlag = false)}"
        @click.native="isStatusFilter = !isStatusFilter"
      />
    </div>
    <div class="Sidebar__form Sidebar__item" v-if="isAddMode">
      <input
        @keydown.enter="sidebarAddNode()"
        type="text"
        v-model="addNodeForm.title"
        placeholder="title"
      />
      <Btn @click.native="sidebarAddNode()">追加する</Btn>
    </div>
    <div class="Sidebar__form Sidebar__item" v-if="isStatusFilter">
      <div class="Sidebar__divider"></div>
      <Btn
        v-for="status in statuses"
        :key="status.id"
        :style="{background:statusColor(status.id)}"
        @click.native="setStatusQuery(status.id)"
      >{{status.title}}</Btn>
    </div>
    <div class="Sidebar__list">
      <div
        class="Sidebar__node Sidebar__item"
        v-for="node in nodeFilter"
        :key="node.id"
        :class="{selected: node == detailsMenu.node}"
        @click="goToNode(node)"
      >
        <div class="Sidebar__node__title">{{node.title}}</div>
        <IconButton icon="trash-alt" @click.native="delNode(node)" />
      </div>
      <div class="Sidebar__item" v-if="!nodeFilter.length">対象の要素はありません</div>
    </div>
  </div>
</template>

<script>
import helpers from "@/helpers/helpers";
import { mapState, mapActions } from "vuex";
import Icon from "@/components/atoms/Icon";
import IconButton from "@/components/atoms/IconButton";
import Btn from "@/components/atoms/Btn";
export default {
  name: "Sidebar",
  components: {
    Icon,
    IconButton,
    Btn,
  },
  data() {
    return {
      query: "",
      status_query: true,
      isMenuOpen: true,
      isAddMode: false,
      isStatusFilter: false,
    };
  },
  methods: {
    openAuth() {
      if (this.user) this.dataInfo.isAuth = true;
      else this.$router.push("/auth");
    },
    createNewMap() {
      this.dataInfo.isCreating = true;
      // 現在のデータを保存後デー タをリセット
      if (this.user) {
        if (confirm("現在のマップを保存しますか？")) {
          this.$store
            .dispatch("saveData", "firebase")
            .then(() => {
              this.$store.commit("reset_data");
              this.$store.commit("graphArea");
            })
            .catch(() => {
              console.log("保存失敗");
            })
            .then(() => {
              this.dataInfo.isCreating = false;
              if (this.$route.path !== "/non-id") this.$router.push("/non-id");
            });
        } else {
          this.$store.commit("reset_data");
          this.dataInfo.isCreating = false;
          if (this.$route.path !== "/non-id") this.$router.push("/non-id");
        }
      } else {
        if (
          !confirm(
            "ログインされていませんので、現在編集中のマップは保存されません。よろしいですか？"
          )
        ) {
          this.dataInfo.isCreating = false;
          return;
        }
        this.$store.commit("reset_data");
        this.$store.commit("graphArea");
        this.dataInfo.isCreating = false;
      }
    },
    closeSidebar() {
      this.sidebar.isOpen = false;
    },
    goToNode(node) {
      // console.log(this.$route.name);
      if (this.$route.name === "Edit") this.$router.push(node.id);
      else {
        this.$store.dispatch("selectNode", node);
        let MapFree = document.getElementById("MapFree");
        let area_width = this.width - this.$store.getters["sidebar_width"];
        MapFree.scrollLeft = node.x - area_width / 2;
        MapFree.scrollTop = node.y - this.height / 2 + 48;
      }
    },
    sidebarAddNode() {
      if (this.$route.name === "id_map" || this.$route.name === "non_id_map") {
        let MapFree = document.getElementById("MapFree");
        this.addNodeForm.x =
          (this.width - this.$store.getters["sidebar_width"]) / 2 +
          MapFree.scrollLeft;
        this.addNodeForm.y = (this.height - 48) / 2 + MapFree.scrollTop;
        this.addNodeForm.status = this.statuses[0].id;
      } else {
        this.addNodeForm.x = this.addNodeForm.y = 100;
      }
      this.addNode();
      // Editページで↑やるならRouterのエラーが出ないようにルーティング忘れない？
      if (this.$route.name === "Edit") {
        this.$router.push(this.detailsMenu.node.id);
      }
    },
    setStatusQuery(status) {
      if (this.status_query === status) this.status_query = true;
      else this.status_query = status;
    },
    statusColor: helpers.statusColor,
    ...mapActions(["delNode", "addNode"]),
  },
  computed: {
    ...mapState([
      "width",
      "height",
      "nodes",
      "statuses",
      "detailsMenu",
      "sidebar",
      "dataInfo",
      "statusInfo",
      "addNodeForm",
    ]),
    ...mapState({
      user: (state) => state.auth.user,
    }),
    nodeFilter() {
      // title部分一致検索（一致する部分がない場合-1を返すのを使う）
      return this.nodes.filter((item) => {
        return (
          item.title.indexOf(this.query) !== -1 &&
          (this.status_query === true || item.status === this.status_query)
        );
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Sidebar {
  box-sizing: border-box;
  width: $sidebar-width;
  height: 100%;
  background: #eee;
  display: flex;
  flex-direction: column;
  letter-spacing: 0;
  &__header {
    @include header;
    justify-content: space-between;
    @include button-hover;
  }
  &__title {
    box-sizing: border-box;
    height: 32px;
    line-height: 24px;
    padding: 4px;
    user-select: none;
    input {
      box-sizing: border-box;
      max-width: 184px;
      font-size: 18px;
      font-weight: bold;
      line-height: 24px;
      border-radius: 3px;
      padding: 0 4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:focus {
        background: #ccc;
      }
      &:hover {
        @include button-hover;
      }
    }
  }
  &__close {
    width: 32px;
    height: 32px;
    border-radius: 3px;
    cursor: pointer;
    @include button-hover;
  }
  &__group {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    padding: 15px 24px 15px;
    line-height: 20px;
    user-select: none;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      @include button-hover;
    }
    .Icon {
      position: absolute;
      right: 19px;
      top: 12px;
    }
  }
  &__divider {
    width: 100%;
    border-bottom: solid 1px #ccc;
    &.on {
      padding-bottom: 14px;
    }
  }
  &__item {
    box-sizing: border-box;
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    height: 32px;
    line-height: 24px;
    padding: 4px 16px;
    font-size: 14px;
    user-select: none;
    &:hover {
      user-select: auto;
    }
  }
  &__button {
    display: flex;
    @include button-hover;
    cursor: pointer;
    &__text {
      padding: 0 4px;
      width: calc(100% - 24px);
      @include ellipsis;
    }
  }
  &__search {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: 48px;
    line-height: 24px;
    padding: 12px 16px;
    input {
      box-sizing: border-box;
      width: calc(100% - 24px);
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: white;
      border: solid 1px black;
      font-size: 16px;
      &:focus {
        border-color: $color-main;
      }
    }
  }
  &__form {
    height: auto;
    flex-direction: column;
    margin-bottom: 8px;
    :not(:last-child) {
      margin-bottom: 8px;
    }
    input {
      box-sizing: border-box;
      width: 100%;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: white;
      border: solid 1px black;
      &:focus {
        border-color: $color-main;
      }
    }
  }
  &__list {
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 24px;
    overflow: auto;
  }
  &__node {
    cursor: pointer;
    &__title {
      width: calc(100% - 24px);
      @include ellipsis;
    }
    &:hover {
      background: #ccc;
    }
    &.selected {
      background: $color-main-l;
    }
  }
}
.group-enter-active,
.group-leave-active {
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.group-enter,
.group-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}
</style>