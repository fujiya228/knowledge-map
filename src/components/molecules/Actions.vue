<template>
  <div class="Actions">
    <div class="Actions__button" @click="saveData()">
      <Icon icon="save" />
    </div>
    <div class="Actions__button" @click="isEditorOpen = true">
      <Icon icon="edit" />
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/functions";
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";
import helpers from "@/helpers/helpers.js";
export default {
  name: "Actions",
  components: {
    Icon
  },
  data() {
    return {
      setData: firebase.functions().httpsCallable("setData")
    };
  },
  methods: {
    saveData() {
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
      this.setData(data).then(response => {
        console.log(response.data);
      });
    }
  },
  watch: {},
  computed: {
    ...mapState(["dataInfo", "nodes", "relations", "statuses", "tags"]),
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
}
</style>