<template>
  <div class="Editor">
    <div id="toolbar">
      <button class="custom-button" @click="isEditorOpen = !isEditorOpen" v-tooltip="'エディター'">
        <Icon icon="edit" :class="{iconOn:isEditorOpen}" :size="14" :font="18" />
      </button>
      <button class="custom-button" @click="isPreviewOpen = !isPreviewOpen" v-tooltip="'プレビュー'">
        <Icon icon="eye" :class="{iconOn:isPreviewOpen}" :size="14" :font="18" />
      </button>
      <button class="custom-button" @click="clickCustomLink()" v-tooltip="'カスタムリンク'">
        <Icon icon="external-link-alt" :size="14" :font="18" />
      </button>
      <button class="ql-bold">Bold</button>
      <button class="ql-italic">Italic</button>
      <button class="ql-underline">Underline</button>
      <button class="ql-strike">Strike</button>
      <button class="ql-blockquote">Blockquote</button>
      <button class="ql-code-block">Code</button>
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
      <button class="ql-indent" value="+1"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-direction" value="rtl"></button>
      <button class="ql-clean"></button>
      <button class="ql-link"></button>
      <button class="ql-video"></button>
      <select class="ql-header">
        <option value="1">h1</option>
        <option value="2">h2</option>
        <option value="3">h3</option>
        <option value="4">h4</option>
        <option value="5">h5</option>
        <option value="6">h6</option>
        <option selected>p</option>
      </select>
      <select class="ql-color"></select>
      <select class="ql-background"></select>
      <select class="ql-align"></select>
      <select class="ql-size">
        <option value="small"></option>
        <option selected></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      <select class="ql-font">
        <option selected="selected"></option>
        <option value="serif"></option>
        <option value="monospace"></option>
      </select>
    </div>
    <div class="Editor__display" :class="editorClass">
      <quill-editor
        v-show="isEditorOpen"
        ref="MyQuillEditor"
        v-model="detailsMenu.node.detail"
        :options="editorInfo.option"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
        @change="onEditorChange($event)"
      />
      <div class="Editor__preview ql-editor" v-html="content" v-show="isPreviewOpen"></div>
      <div class="Editor__not-open" v-if="!isDisplayOpen">
        <h2>何も開かれていません</h2>
      </div>
    </div>
    <div class="Editor__popup" v-show="isPopupOpen" @click.self="isPopupOpen = false">
      <div class="Editor__popup__container">
        <div class="Editor__popup__title">リンク先を選ぶ</div>
        <div class="Editor__popup__search">
          <Icon icon="search" />
          <input type="text" v-model="query" />
        </div>
        <div class="Editor__popup__list">
          <div
            class="Editor__popup__item"
            v-for="node in nodeFilter"
            :key="node.id"
            @click="makeLink(node)"
          >{{node.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";

var Link = Quill.import("formats/link");
const regex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;

class MyLink extends Link {
  static create(value) {
    let node = super.create(value);
    if (value.match(regex)) node.removeAttribute("target");
    value = this.sanitize(value);
    node.setAttribute("href", value);
    return node;
  }
}

Quill.register(MyLink);

export default {
  name: "Editor",
  props: {
    editorClass: {
      type: String
    }
  },
  components: {
    quillEditor,
    Icon
  },
  data() {
    return {
      query: "",
      isPopupOpen: false,
      isEditorOpen: true,
      isPreviewOpen: true,
      content: ""
    };
  },
  methods: {
    clickCustomLink() {
      // console.log(this.$refs.MyQuillEditor.quill.getSelection()); // 位置とってこれる
      this.isPopupOpen = true;
    },
    makeLink(node) {
      this.$refs.MyQuillEditor.quill.format("link", node.id);
      this.isPopupOpen = false;
    },
    onEditorBlur() {
      console.log("editor blur!");
    },
    onEditorFocus() {
      console.log("editor focus!");
    },
    onEditorReady() {
      console.log("editor ready!");
      this.content = this.detailsMenu.node.detail;
    },
    onEditorChange({ html }) {
      // console.log("editor change!", html);
      this.content = html;
    }
  },
  computed: {
    ...mapState(["nodes", "editorInfo", "detailsMenu"]),
    nodeFilter() {
      // title部分一致検索（一致する部分がない場合-1を返すのを使う）
      return this.nodes.filter(item => item.title.indexOf(this.query) !== -1);
    },
    isDisplayOpen() {
      return this.isEditorOpen || this.isPreviewOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/variable.scss";
.Editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  &__display {
    display: flex;
    width: 100%;
    background: white;
    .ql-container {
      border: none;
    }
  }
  &__preview {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
  }
  &__not-open {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__popup {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(27, 31, 35, 0.5);
    z-index: 500;
    user-select: none;
    &__container {
      box-sizing: border-box;
      width: 80%;
      max-width: 500px;
      height: 300px;
      padding: 24px;
      border-radius: 3px;
      background: white;
    }
    &__title {
      margin-bottom: 8px;
      font-size: 24px;
      font-weight: bold;
    }
    &__search {
      margin-bottom: 8px;
      display: flex;
      input {
        box-sizing: border-box;
        width: calc(100% - 24px);
        height: 24px;
        padding: 0 8px;
        border-radius: 12px;
        background: white;
        border: solid 1px black;
      }
    }
    &__list {
      display: flex;
      flex-wrap: wrap;
    }
    &__item {
      max-width: 50%;
      height: 32;
      line-height: 24px;
      border-radius: 3px;
      margin: 2px;
      padding: 4px 8px;
      background: #eee;
      cursor: pointer;
      @include ellipse;
      &:hover {
        background: $color-main-l;
      }
    }
  }
}
.custom-button {
  transition: 0s;
}
.iconOn {
  color: $color-main;
}
#toolbar {
  background: white;
}
.quill-editor,
.ql-editor {
  background-color: white;
  width: 100%;
  height: 100%;
}
</style>