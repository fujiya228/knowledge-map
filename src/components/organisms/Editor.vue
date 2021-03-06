<template>
  <div class="Editor" @touchmove.stop @pointermove.stop>
    <div id="toolbar">
      <div
        class="custom__button"
        @click="editorInfo.isRelationOpen = !editorInfo.isRelationOpen"
        v-tooltip="'関連リンク'"
      >
        <Icon icon="list-ul" :class="{iconOn:editorInfo.isRelationOpen}" :size="24" :font="14" />
      </div>
      <div
        class="custom__button"
        @click="editorInfo.isEditorOpen = !editorInfo.isEditorOpen"
        v-tooltip="'エディター'"
      >
        <Icon icon="edit" :class="{iconOn:editorInfo.isEditorOpen}" :size="24" :font="14" />
      </div>
      <div
        class="custom__button"
        @click="editorInfo.isPreviewOpen = !editorInfo.isPreviewOpen"
        v-tooltip="'プレビュー'"
      >
        <Icon icon="eye" :class="{iconOn:editorInfo.isPreviewOpen}" :size="24" :font="14" />
      </div>
      <div class="custom__button" @click="clickCustomLink()" v-tooltip="'カスタムリンク'">
        <Icon icon="external-link-alt" :size="24" :font="14" />
      </div>
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
      <div
        class="custom__select"
        :style="{borderColor:statusColor(detailsMenu.node.status)}"
        @click="isSelectStatus = !isSelectStatus"
      >
        {{statusTitle(detailsMenu.node.status)}}
        <div class="custom__select__container" v-show="isSelectStatus">
          <div
            class="custom__select__item"
            :style="{background:statusColor(status.id)}"
            @click="detailsMenu.node.status = status.id"
            v-for="status in statuses"
            :key="status.id"
          >{{status.title}}</div>
        </div>
      </div>
    </div>
    <div class="Editor__display" :class="editorClass">
      <div class="Editor__link" v-show="editorInfo.isRelationOpen" v-tooltip.right-start="'関連リンク'">
        <div class="Editor__link__item" v-tooltip="'新規リンク作成'" @click="isMakeRelation = true">
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
        v-show="editorInfo.isEditorOpen"
        ref="MyQuillEditor"
        v-model="detailsMenu.node.detail"
        :options="editorInfo.option"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
        @change="onEditorChange($event)"
      />
      <div
        class="Editor__preview ql-editor"
        v-html="content"
        v-show="editorInfo.isPreviewOpen"
        :class="{divider:editorInfo.isEditorOpen && editorInfo.isPreviewOpen}"
      ></div>
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
          <div class="Editor__popup__not-found" v-if="nodeFilter.length === 0">対象の要素はありませんでした</div>
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
import Quill from "quill";
import MarkdownShortcuts from "quill-markdown-shortcuts";

import helpers from "@/helpers/helpers";
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";

Quill.register("modules/markdownShortcuts", MarkdownShortcuts);
export default {
  name: "Editor",
  props: {
    editorClass: {
      type: String,
    },
  },
  components: {
    quillEditor,
    Icon,
  },
  data() {
    return {
      query: "",
      isMakeCustomLink: false,
      isMakeRelation: false,
      isSelectStatus: false,
      content: "",
      notFoundText: "関連リンクはありませんでした",
    };
  },
  methods: {
    goToNode(node) {
      if (this.$route.name === "Edit") this.$router.push(node.id);
      else {
        this.$store.dispatch("selectNode", node);
        let MapFree = document.getElementById("MapFree");
        let area_width = this.width - this.$store.getters["sidebar_width"];
        MapFree.scrollLeft = node.x - area_width / 2;
        MapFree.scrollTop = node.y - this.height / 2;
      }
    },
    clickCustomLink() {
      // console.log(this.$refs.MyQuillEditor.quill.getSelection()); // 位置とってこれる
      let quill = this.$refs.MyQuillEditor.quill;
      quill.focus();
      let length = quill.getSelection().length;
      if (!this.editorInfo.isEditorOpen) {
        alert("エディターを開いてください");
        return;
      }
      if (length === 0) {
        alert("文章を選択してください");
        return;
      }
      this.isMakeCustomLink = true;
    },
    makeLink(node) {
      // 関連付けするかどうかのボタンも用意しておく
      this.$refs.MyQuillEditor.quill.format(
        "link",
        "/" + this.$store.state.dataInfo.uuid + "/" + node.id
      );
      this.isMakeCustomLink = false;
    },
    makeRel(node) {
      // 関連付けするかどうかのボタンも用意しておく
      this.$store.commit("makeRelation", {
        base: this.detailsMenu.node,
        target: node,
      });
      // detailsMenuに反映=>これはmakeRelationがわでやるべき？TODO
      this.$store.dispatch("selectNode", this.detailsMenu.node);
      this.isMakeRelation = false;
    },
    delRel(node) {
      let rels = this.detailsMenu.node.relations; // relsはオブジェクト
      for (let key in rels) {
        if (rels[key].pair_id === node.id) {
          this.$store.dispatch("delRelation", {
            relId: key,
            force: false,
          });
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
      console.log("editor ready!", Quill.version);
      this.content = this.detailsMenu.node.detail;
    },
    onEditorChange({ html }) {
      // console.log("editor change!", html);
      this.content = html;
    },
    statusColor: helpers.statusColor,
    statusTitle: helpers.statusTitle,
  },
  computed: {
    ...mapState([
      "width",
      "height",
      "nodes",
      "statuses",
      "editorInfo",
      "detailsMenu",
    ]),
    isPopupOpen() {
      return this.isMakeCustomLink || this.isMakeRelation;
    },
    nodeFilter() {
      // title部分一致検索（一致する部分がない場合-1を返すのを使う）
      return this.nodes.filter(
        (item) =>
          item.title.indexOf(this.query) !== -1 &&
          item.id !== this.detailsMenu.nodeId
      );
    },
    unrelatedFilter() {
      return this.detailsMenu.unrelated.filter(
        (item) => item.title.indexOf(this.query) !== -1
      );
    },
    isDisplayOpen() {
      return this.editorInfo.isEditorOpen || this.editorInfo.isPreviewOpen;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  &__link {
    width: 20%;
    min-width: 150px;
    overflow: auto;
    border-right: solid 1px #ccc;
    &__item {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      width: 100%;
      height: 32px;
      line-height: 24px;
      padding: 4px 8px;
      @include ellipsis;
      cursor: pointer;
      &:hover {
        background: #ccc;
      }
    }
    &__title {
      width: calc(100% - 24px);
      @include ellipsis;
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
      @include ellipsis;
    }
  }
  &__display {
    display: flex;
    background: white;
    .ql-container.ql-snow {
      border: none;
    }
  }
  &__preview {
    height: 100%;
    width: 100%;
    &.divider {
      border-left: solid 1px #ccc;
    }
  }
  &__not-open {
    box-sizing: border-box;
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
      align-content: flex-start;
      // 300 - 24*2 - 35 - 8 - 24 - 8
      height: 177px;
      overflow: auto;
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
      @include ellipsis;
      &:hover {
        background: $color-main-l;
      }
    }
  }
}
.custom {
  &__button {
    float: left;
    width: 28px;
    height: 24px;
    padding: 0 2px;
    transition: 0s;
    cursor: pointer;
  }
  &__select {
    box-sizing: border-box;
    position: relative;
    float: left;
    height: 24px;
    width: 100px;
    line-height: 20px;
    padding: 0 8px;
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    border: solid 2px;
    &__container {
      width: 100%;
      padding: 4px 0;
      background: white;
      position: absolute;
      left: 0;
      top: 24px;
      z-index: 1;
    }
    &__item {
      width: 100%;
      font-size: 14px;
      padding: 0 8px;
      margin-bottom: 4px;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
.iconOn {
  color: $color-main;
}
#toolbar {
  width: 100%;
  background: white;
  padding: 12px 8px;
  border: none;
  border-bottom: solid 1px #ccc;
}
.quill-editor,
.ql-editor {
  background-color: white;
  width: 100%;
  height: 100%;
  font-size: 16px;
  word-break: break-all;
  * {
    border: none;
  }
}
.ql-editor {
  padding-bottom: 200px;
}
.ql-editor ul[data-checked="true"] > li {
  text-decoration: line-through;
  opacity: 0.5;
}
</style>