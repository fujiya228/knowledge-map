<template>
  <div class="Actions">
    <template v-if="detailsMenu.node">
      <div class="Actions__title">
        <input type="text" v-model="detailsMenu.node.title" />
      </div>
      <div class="Actions__icon-button" @click="delNode(detailsMenu.node)" v-tooltip="'削除'">
        <Icon icon="trash-alt" />
      </div>
    </template>
    <template v-if="isMapFree">
      <div class="Actions__info">{{Math.round(100*scale)}}%</div>
      <div class="Actions__icon-button" @click="actionsResizeGraph(1)" v-tooltip="'拡大'">
        <Icon icon="plus" />
      </div>
      <div class="Actions__icon-button" @click="actionsResizeGraph(-1)" v-tooltip="'縮小'">
        <Icon icon="minus" />
      </div>
      <div class="Actions__text-button" @click="actionsResizeGraph('reset')" v-tooltip="'リセット'">リセット</div>
      <div
        class="Actions__icon-button"
        v-if="detailsMenu.node"
        @click="goToPage('edit')"
        v-tooltip="'編集ページ'"
      >
        <Icon icon="edit" />
      </div>
    </template>
    <template v-if="editorInfo.isEditPage">
      <div class="Actions__icon-button" @click="goToPage('map')" v-tooltip="'マップページ'">
        <Icon icon="project-diagram" />
      </div>
    </template>
    <div
      class="Actions__info"
      v-show="dataInfo.isUserSaving || dataInfo.isMapSaving"
    >{{dataInfo.runningText}}</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Icon from "@/components/atoms/Icon";
export default {
  name: "Actions",
  components: {
    Icon,
  },
  data() {
    return {};
  },
  methods: {
    actionsResizeGraph(abs) {
      if (!this.isMapFree) return;
      this.resizeGraph(abs);
      // Nodeのleftだけscale使っていないので更新かからない
      // このあとにnextTickでwidth_2の更新入れてNodeのleftも更新する
      // width_2の更新
      this.$nextTick(() => {
        this.$store.commit("updateNodeWidth_2");
      });
    },
    goToPage(target) {
      if (target === "map") this.$router.push("."); // . で相対的に移動出来た！/付けたら思った動きをしないので注意
      if (target === "edit")
        this.$router.push(this.$route.path + "/" + this.detailsMenu.node.id);
    },
    ...mapActions(["delNode"]),
    ...mapMutations(["resizeGraph"]),
  },
  watch: {},
  computed: {
    ...mapState([
      "scale",
      "dataInfo",
      "nodes",
      "relations",
      "statuses",
      "tags",
      "detailsMenu",
      "editorInfo",
    ]),
    isMapFree() {
      // これMapFreeにもあるから統一したい TODO
      return this.$route.name === "id_map" || this.$route.name === "non_id_map";
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Actions {
  box-sizing: border-box;
  height: 32px;
  display: flex;
  flex-wrap: wrap;
  z-index: 40;
  &__icon-button {
    width: 24px;
    margin: 4px;
    border-radius: 3px;
    background: #eee;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  &__text-button {
    box-sizing: border-box;
    height: 24px;
    padding: 0 8px;
    margin: 4px;
    background: #eee;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
  }
  &__info {
    box-sizing: border-box;
    min-width: 64px;
    text-align: center;
    height: 32px;
    padding: 4px 8px;
    font-size: 14px;
    line-height: 24px;
    user-select: none;
  }
  &__logo {
    box-sizing: border-box;
    width: 32px;
    height: 32px;
    padding: 4px;
  }
  &__title {
    box-sizing: border-box;
    height: 32px;
    line-height: 24px;
    padding: 4px;
    user-select: none;
    input {
      box-sizing: border-box;
      max-width: 200px;
      font-size: 18px;
      font-weight: bold;
      line-height: 24px;
      border-radius: 3px;
      padding: 0 4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:focus {
        background: #eee;
      }
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>