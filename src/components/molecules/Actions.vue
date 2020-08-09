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
      <div class="Actions__icon-button" @click="resizeGraph(1)" v-tooltip="'拡大'">
        <Icon icon="plus" />
      </div>
      <div class="Actions__icon-button" @click="resizeGraph(-1)" v-tooltip="'縮小'">
        <Icon icon="minus" />
      </div>
      <div class="Actions__text-button" @click="resizeGraph('reset')" v-tooltip="'リセット'">リセット</div>
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
import { mapState, mapActions } from "vuex";
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
    resizeGraph(abs) {
      if (!this.isMapFree) return;
      let type = "free";
      let before_scale = this.scale * 1;
      let min = 0.5;
      abs === "reset" ? (this.scale = 1) : (this.scale += 0.1 * abs);
      // this.scale = Math.round((this.scale + 0.1 * abs) * 100) / 100;
      if (this.scale < min) {
        this.scale = min;
        return;
      }
      // scroll量の再計算
      let MapFree = document.getElementById("MapFree");
      MapFree.scrollLeft *= this.scale / before_scale;
      MapFree.scrollTop *= this.scale / before_scale;
      // reLocation
      let len = this.nodes.length;
      for (let i = 0; i < len; i++) {
        this.nodes[i].x = this.nodes[i][type].x * this.scale;
        this.nodes[i].y = this.nodes[i][type].y * this.scale;
        // Nodeのleftだけscale使っていないので更新かからない
        // このあとにnextTickでwidth_2の更新入れてNodeのleftも更新する
      }
      // width_2の更新
      this.$nextTick(() => {
        this.$store.commit("updateNodeWidth_2");
      });
    },
    goToPage(target) {
      if (target === "map") this.$router.push("/");
      if (target === "edit") this.$router.push(this.detailsMenu.node.id);
    },
    ...mapActions(["delNode"]),
  },
  watch: {},
  computed: {
    ...mapState([
      "dataInfo",
      "nodes",
      "relations",
      "statuses",
      "tags",
      "detailsMenu",
      "editorInfo",
    ]),
    isMapFree() {
      return this.$route.name === "id_map" || this.$route.name === "non_id_map";
    },
    scale: {
      get() {
        return this.$store.state.scale;
      },
      set(val) {
        this.$store.commit("set_scale", val);
      },
    },
  },
  created() {
    // これはresizeGraphをMutationにいれて、以下の処理をMapのcreatedに入れなかなんな TODO
    this.$nextTick(() => {
      document.getElementById("MapFree").addEventListener("wheel", (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          let abs;
          if (e.deltaY > 0) abs = -1;
          else abs = 1;
          this.resizeGraph(abs);
        }
      });
    });
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