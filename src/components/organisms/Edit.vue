<template>
  <div class="Edit">
    <!-- 権限あるとき=>エディターを表示 -->
    <template v-if="detailsMenu.node">
      <div id="toolbar">
        <!-- Add a bold button -->
        <button class="ql-bold">Bold</button>
        <button class="ql-italic">Italic</button>
        <!-- Add font size dropdown -->
        <select class="ql-size">
          <option value="small"></option>
          <!-- Note a missing, thus falsy value, is used to reset to default -->
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <select class="ql-font">
          <option selected="selected"></option>
          <option value="serif"></option>
          <option value="monospace"></option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
        <!-- You can also add your own -->
      </div>
      <quill-editor
        ref="MyQuillEditor"
        class="Edit__editor"
        v-model="detailsMenu.node.detail"
        :options="editorOption"
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

export default {
  name: "Edit",
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: "#toolbar"
        }
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
    this.editorInfo.isEditPage = true;
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
#toolbar {
}
</style>