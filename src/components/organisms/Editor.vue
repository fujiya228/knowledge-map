<template>
  <div class="Editor">
    <div id="toolbar">
      <button class="custom-button" @click="isRelationOpen = !isRelationOpen" v-tooltip="'関連リンク'">
        <Icon icon="list-ul" :class="{iconOn:isRelationOpen}" :size="14" :font="18" />
      </button>
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
      <div class="Editor__link" v-show="isRelationOpen" v-tooltip.right-start="'関連リンク'">
        <div class="Editor__link__item" v-tooltip="'新規作成'" @click="isMakeRelation = true">
          <Icon icon="plus" />
        </div>
        <div
          class="Editor__link__item"
          v-for="node in detailsMenu.relations"
          :key="node.id"
          v-tooltip.top="node.title"
          @click="goToNode(node)"
        >
          <div class="Editor__link__title">{{node.title}}</div>
          <div class="Editor__link__icon" @click.stop="delRel(node)">
            <Icon icon="trash-alt" />
          </div>
        </div>
        <div
          class="Editor__link__not-found"
          v-if="detailsMenu.relations.length === 0"
          v-tooltip.top="notFoundText"
        >{{notFoundText}}</div>
      </div>
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
    <div class="Editor__popup" v-show="isPopupOpen" @click.self="closePopup()">
      <div class="Editor__popup__container">
        <div class="Editor__popup__title">リンク先を選ぶ</div>
        <div class="Editor__popup__search">
          <Icon icon="search" />
          <input type="text" v-model="query" />
        </div>
        <div class="Editor__popup__list" v-if="isMakeCustomLink">
          <div
            class="Editor__popup__item"
            v-for="node in nodeFilter"
            :key="node.id"
            @click="makeLink(node)"
          >{{node.title}}</div>
        </div>
        <div class="Editor__popup__list" v-if="isMakeRelation">
          <div
            class="Editor__popup__item"
            v-for="node in unrelatedFilter"
            :key="node.id"
            @click="makeRel(node)"
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
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";
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
      isMakeCustomLink: false,
      isMakeRelation: false,
      isRelationOpen: true,
      isEditorOpen: true,
      isPreviewOpen: false,
      content: "",
      notFoundText: "関連リンクはありませんでした"
    };
  },
  methods: {
    goToNode(node) {
      if (this.$route.name === "Edit") this.$router.push(node.id);
      else {
        this.$store.dispatch("selectNode", node);
        let FreeGraph = document.getElementById("FreeGraph");
        let area_width = this.width - this.$store.getters["sidebar_width"];
        FreeGraph.scrollLeft = node.x - area_width / 2;
        FreeGraph.scrollTop = node.y - this.height / 2;
      }
    },
    clickCustomLink() {
      // console.log(this.$refs.MyQuillEditor.quill.getSelection()); // 位置とってこれる
      let quill = this.$refs.MyQuillEditor.quill;
      quill.focus();
      let length = quill.getSelection().length;
      if (length === 0) {
        alert("文章を選択してください");
        return;
      }
      this.isMakeCustomLink = true;
    },
    makeLink(node) {
      // 関連付けするかどうかのボタンも用意しておく
      this.$refs.MyQuillEditor.quill.format("link", node.id);
      this.isMakeCustomLink = false;
    },
    makeRel(node) {
      // 関連付けするかどうかのボタンも用意しておく
      this.$store.commit("makeRelation", {
        base: this.detailsMenu.node,
        target: node
      });
      // detailsMenuに反映=>これはmakeRelationがわでやるべき？TODO
      this.$store.dispatch("selectNode", this.detailsMenu.node);
      this.isMakeRelation = false;
    },
    delRel(node) {
      let rels = this.detailsMenu.node.relations; // relsはオブジェクト
      for (let key in rels) {
        if (rels[key].pair_id === node.id) {
          this.$store.dispatch("delRelation", key);
          break;
        }
      }
    },
    closePopup() {
      this.isMakeCustomLink = this.isMakeRelation = false;
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
    ...mapState(["width", "height", "nodes", "editorInfo", "detailsMenu"]),
    isPopupOpen() {
      return this.isMakeCustomLink || this.isMakeRelation;
    },
    nodeFilter() {
      // title部分一致検索（一致する部分がない場合-1を返すのを使う）
      return this.nodes.filter(item => item.title.indexOf(this.query) !== -1);
    },
    unrelatedFilter() {
      return this.detailsMenu.unrelated.filter(
        item => item.title.indexOf(this.query) !== -1
      );
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
  &__link {
    box-sizing: border-box;
    width: 20%;
    min-width: 150px;
    border: 1px solid #ccc;
    overflow: auto;
    &__item {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      width: 100%;
      height: 32px;
      line-height: 24px;
      padding: 4px 8px;
      @include ellipse;
      cursor: pointer;
      &:hover {
        background: #ccc;
      }
    }
    &__title {
      width: calc(100% - 24px);
      @include ellipse;
    }
    &__icon {
      width: 24px;
      height: 24px;
      @include button-hover;
    }
    &__not-found {
      box-sizing: border-box;
      width: 100%;
      height: 32px;
      line-height: 24px;
      padding: 4px 8px;
      @include ellipse;
    }
  }
  &__display {
    display: flex;
    width: 100%;
    background: white;
    .ql-container {
      border: none;
    }
  }
  &__preview {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
  }
  &__not-open {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
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