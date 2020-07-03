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
    ...mapState(["detailsMenu", "editorInfo", "sidebar"])
  },
  methods: {},
  created() {
    let id = this.$route.params.node_id;
    console.log("created", id);
    this.editorInfo.isEditPage = true;
    let node = helpers.searchNode(id);
    if (node) this.$store.dispatch("selectNode", node);
    else this.$router.push("/404");
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