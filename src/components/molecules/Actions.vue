<template>
  <div class="Actions">
    <div class="Actions__pages">
      <div class="Actions__pages__current">{{curtPageName}}</div>
      <div class="Actions__pages__container">
        <div class="Actions__pages__item" v-for="page in pagesFilter" :key="page.path">
          <router-link :to="page.path">{{page.name}}</router-link>
        </div>
        <div class="Actions__pages__item" v-if="isEditLinkActive">
          <router-link :to="detailsMenu.node.id">Edit {{detailsMenu.node.title}}</router-link>
        </div>
      </div>
    </div>
    <div class="Actions__button" @click="saveData()" v-tooltip="'保存 (Ctrl + S)'">
      <Icon icon="save" />
    </div>
    <template v-if="isGraphFree">
      <div class="Actions__info">{{Math.round(100*scale)}}%</div>
      <div class="Actions__button" @click="resizeGraph(1)" v-tooltip="'拡大'">
        <Icon icon="plus" />
      </div>
      <div class="Actions__button" @click="resizeGraph(-1)" v-tooltip="'縮小'">
        <Icon icon="minus" />
      </div>
    </template>
    <template v-if="detailsMenu.node">
      <div
        class="Actions__button"
        v-if="!editorInfo.isEditPage"
        @click="editorInfo.isOpen = true"
        v-tooltip="'編集'"
      >
        <Icon icon="edit" />
      </div>
      <div class="Actions__button" @click="delNode(detailsMenu.node)" v-tooltip="'削除'">
        <Icon icon="trash-alt" />
      </div>
      <div class="Actions__title">
        Select:
        <input type="text" v-model="detailsMenu.node.title" />
      </div>
    </template>
    <div class="Actions__info" v-show="isSaving">{{savingText}}</div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/functions";
import { mapState, mapActions } from "vuex";
import Icon from "@/components/atoms/Icon";
import helpers from "@/helpers/helpers.js";
export default {
  name: "Actions",
  components: {
    Icon,
  },
  data() {
    return {
      setData: firebase.functions().httpsCallable("setData"),
      isSaving: false,
      savingText: "",
      pages: [
        {
          name: "free graph",
          path: "/graph-free",
        },
      ],
    };
  },
  methods: {
    saveData() {
      if (this.isSaving) return;
      this.savingText = "保存中...";
      this.isSaving = true;
      let data = {
        nodeNum: this.dataInfo.nodeNum,
        statusNum: this.dataInfo.statusNum,
        tagNum: this.dataInfo.tagNum,
        nodes: helpers.deep(this.nodes),
        relations: helpers.deep(this.relations),
        statuses: this.statuses,
        tags: this.tags,
        updated_at: Date(Date.now()),
      };
      data.nodes.forEach((item) => {
        delete item.x;
        delete item.y;
        delete item.byTheDeadline;
      });
      data.relations.forEach((item) => {
        delete item.base.node;
        delete item.target.node;
      });
      this.setData(data).then((response) => {
        console.log(response.data);
        if (response.data.response) {
          this.savingText = "保存しました";
        } else {
          this.savingText = "保存に失敗しました";
        }
        setTimeout(() => {
          this.isSaving = false;
        }, 3000);
      });
    },
    resizeGraph(abs) {
      if (!this.isGraphFree) return;
      let type = "free";
      let before_scale = this.scale * 1;
      let min = 0.5;
      this.scale += 0.1 * abs;
      // this.scale = Math.round((this.scale + 0.1 * abs) * 100) / 100;
      if (this.scale < min) {
        this.scale = min;
        return;
      }
      // scroll量の再計算
      let FreeGraph = document.getElementById("FreeGraph");
      FreeGraph.scrollLeft *= this.scale / before_scale;
      FreeGraph.scrollTop *= this.scale / before_scale;
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
    curtPageName() {
      let page = this.pages.find((item) => item.path === this.$route.path);
      return page ? page.name : "editor";
    },
    pagesFilter() {
      return this.pages.filter((item) => item.path !== this.$route.path);
    },
    isGraphFree() {
      return this.$route.path === "/graph-free";
    },
    isEditLinkActive() {
      // 選択済みで編集ページのidと被っていなかったら
      return (
        this.detailsMenu.node &&
        "/" + this.detailsMenu.node.id !== this.$route.path
      );
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
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        this.saveData();
      }
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
  &__pages {
    width: 100px;
    height: 24px;
    line-height: 24px;
    margin: 4px;
    background: #eee;
    border-radius: 3px;
    text-align: center;
    &:hover {
      border-radius: 3px 3px 0 0;
      > .Actions__pages__container {
        display: block;
      }
    }
    &__current {
      box-sizing: border-box;
      width: 100%;
      padding: 0 8px;
    }
    &__container {
      display: none;
      background: #eee;
      width: 100px;
    }
    &__item {
      a {
        display: block;
        text-decoration: none;
        color: black;
        font-size: 14px;
        padding: 0 8px;
        @include ellipse;
        &:hover {
          color: $color-link;
          background: #ccc;
        }
      }
    }
  }
  &__button {
    width: 24px;
    margin: 4px;
    border-radius: 3px;
    background: #eee;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  &__info {
    box-sizing: border-box;
    height: 32px;
    padding: 4px 8px;
    font-size: 14px;
    line-height: 24px;
  }
  &__title {
    box-sizing: border-box;
    max-width: 250px;
    height: 32px;
    line-height: 24px;
    padding: 4px 8px;
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    input {
      display: inline;
      line-height: 24px;
      border-radius: 3px;
      padding: 0 4px;
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