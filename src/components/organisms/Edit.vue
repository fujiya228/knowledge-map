<template>
  <div class="Edit">
    <!-- 権限あるとき=>エディターを表示 -->
    <template v-if="detailsMenu.node">
      <editor editorClass="Edit__editor" />
    </template>
    <!-- 権限ないとき=>テキストのみ表示 -->
  </div>
</template>

<script>
import { mapState } from "vuex";

import helpers from "@/helpers/helpers.js";
import Editor from "@/components/organisms/Editor";

export default {
  name: "Edit",
  components: {
    Editor
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["nodes", "detailsMenu", "editorInfo", "sidebar"])
  },
  methods: {},
  created() {
    let id = this.$route.params.node_id;
    console.log("Edit.vue created", id);
    this.editorInfo.isEditPage = true;
    // index.vueのinitの方が遅いので読み込まれていない時は行わない
    // index.vueの方で、selectNodeやっているので問題ない
    // index.vueはEdit.vueからのページ遷移ではインスタンスが保持される
    // が、Editは毎回破棄されて作り直しするのでそこの注意が必要
    if (this.nodes.length) {
      let node = helpers.searchNode(id);
      if (node) this.$store.dispatch("selectNode", node);
      else this.$router.push("/404");
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Edit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &__editor {
    height: 100%;
    overflow: auto;
  }
}
</style>