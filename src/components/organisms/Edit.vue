<template>
  <div class="Edit">
    <!-- 権限あるとき=>エディターを表示 -->
    <quill-editor
      v-if="detailsMenu.node"
      ref="MyQuillEditor"
      class="Edit__editor"
      v-model="detailsMenu.node.detail"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    />
    <!-- 権限ないとき=>テキストのみ表示 -->
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { mapState } from "vuex";
import { quillEditor } from "vue-quill-editor";

export default {
  name: "Edit",
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {
        theme: "snow"
      }
    };
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
    console.log("created", this.$route.params.node_id);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/variable.scss";
.Edit {
  width: 100%;
  height: 100%;
  &__editor {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    height: 100%;
    padding: 0 100px;
    margin: 0 auto;
    div {
      border: 0px;
    }
  }
}
</style>