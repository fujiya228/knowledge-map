<template>
  <div class="Edit">
    <!-- 権限あるとき=>エディターを表示 -->
    <template v-if="detailsMenu.node">
      <editor-toolbar />
      <quill-editor
        ref="MyQuillEditor"
        class="Edit__editor"
        v-model="detailsMenu.node.detail"
        :options="editorInfo.option"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      ></quill-editor>
    </template>
    <!-- 権限ないとき=>テキストのみ表示 -->
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { mapState } from "vuex";
import { quillEditor } from "vue-quill-editor";

import EditorToolbar from "@/components/atoms/EditorToolbar";
import helpers from "@/helpers/helpers.js";
export default {
  name: "Edit",
  components: {
    quillEditor,
    EditorToolbar
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["detailsMenu", "editorInfo", "sidebar"])
  },
  methods: {
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },
    closeEditor() {
      console.log("closeEditor");
      this.editorInfo.isOpen = false;
    }
  },
  created() {
    let id = this.$route.params.node_id;
    console.log("created", id);
    this.editorInfo.isEditPage = true;
    this.$store.dispatch("selectNode", helpers.searchNode(id));
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
    width: 100%;
    height: 100%;
    overflow: auto;
    .ql-container {
      width: 80%;
      margin: 0 auto;
    }
  }
}
</style>