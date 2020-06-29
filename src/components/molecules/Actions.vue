<template>
  <div class="Actions">
    <div class="Actions__button" @click="saveData()" v-tooltip="'保存'">
      <Icon icon="save" />
    </div>
    <template v-if="detailsMenu.node">
      <div class="Actions__button" @click="isEditorOpen = true" v-tooltip="'編集'">
        <Icon icon="edit" />
      </div>
      <div class="Actions__button" @click="delNode(detailsMenu.node)" v-tooltip="'削除'">
        <Icon icon="trash-alt" />
      </div>
      <div class="Actions__title">Select:{{detailsMenu.node.title}}</div>
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
    Icon
  },
  data() {
    return {
      setData: firebase.functions().httpsCallable("setData"),
      isSaving: false,
      savingText: ""
    };
  },
  methods: {
    saveData() {
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
        updated_at: Date(Date.now())
      };
      data.nodes.forEach(item => {
        delete item.x;
        delete item.y;
        delete item.byTheDeadline;
      });
      data.relations.forEach(item => {
        delete item.base.node;
        delete item.target.node;
      });
      this.setData(data)
        .then(response => {
          console.log(response.data);
        })
        .then(() => {
          this.savingText = "保存しました";
          setTimeout(() => {
            this.isSaving = false;
          }, 3000);
        });
    },
    ...mapActions(["delNode"])
  },
  watch: {},
  computed: {
    ...mapState([
      "dataInfo",
      "nodes",
      "relations",
      "statuses",
      "tags",
      "detailsMenu"
    ]),
    isEditorOpen: {
      get() {
        return this.$store.state.isEditorOpen;
      },
      set(val) {
        this.$store.commit("set_isEditorOpen", val);
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Actions {
  box-sizing: border-box;
  height: 32px;
  display: flex;
  flex-wrap: wrap;
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
    padding: 8px 8px 0;
    font-size: 14px;
  }
  &__title {
    box-sizing: border-box;
    max-width: 250px;
    height: 32px;
    line-height: 24px;
    padding: 8px 8px 0;
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>