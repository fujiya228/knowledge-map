<template>
  <div
    id="FreeGraph"
    :class="{open: isDetailsOpen && !isEditorOpen}"
    @touchmove.prevent="moveNodeInfo.isOn ? moveNode($event) : null"
    @pointermove.stop="moveNodeInfo.isOn ? moveNode($event) : null"
  >
    <svg
      class="Free__area"
      @dblclick="openAddNodeForm($event)"
      @click.ctrl="openAddNodeForm($event)"
    >
      <path
        class="Line"
        :class="{
            select: detailsMenu.nodeId === line.base.id || detailsMenu.nodeId === line.target.id,
            drag: moveNodeInfo.id === line.base.id || moveNodeInfo.id === line.target.id,
          }"
        v-for="line in relationFilter()"
        :key="line.id"
        :d="graphPath(line)"
        @click.stop="delRelation(line.id)"
      />
    </svg>
    <Node
      class="Node-in-Free"
      v-for="node in nodeFilter()"
      :key="node.id"
      :node="node"
      :style="{
          left: node.x - 32 + 'px',
          top: node.y - 32 + 'px',
        }"
      @touchstart.native="onGhost(node)"
      @touchend.native="endGhost()"
      @pointerdown.native="onGhost(node)"
      @mouseup.native="endGhost()"
      @click.right.prevent.stop.native="openContextMenu(node)"
      @click.ctrl.exact.stop.native="selectRelaitonNode(node)"
      @dblclick.native="selectRelaitonNode(node)"
    />
    <AddNodeForm
      class="Add-node-form"
      v-if="addNodeForm.isFree"
      :style="{
        top: addNodeForm.y + 24 + 'px',
        left: addNodeForm.x - 125 + 'px',
      }"
      @addFunction="addNode()"
    />
    <div class="Editor" v-if="detailsMenu.node && isEditorOpen" @click.self="closeEditor()">
      <div class="Editor__wrapper">
        <h2 class="Editor__title">Title:{{detailsMenu.node.title}}</h2>
        <quill-editor
          ref="MyQuillEditor"
          class="edit-area"
          v-model="detailsMenu.node.detail"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import helpers from "@/helpers/helpers";
import Node from "@/components/molecules/Node";
import AddNodeForm from "@/components/molecules/AddNodeForm";
export default {
  name: "FreeGraph",
  components: {
    Node,
    AddNodeForm,
    quillEditor
  },
  data() {
    return {
      editorOption: {
        theme: "snow"
      }
    };
  },
  methods: {
    async selectRelaitonNode(v_base) {
      if (this.isMakingRelation) return; // ctrlを押しっぱなしでやるとtargetを押したときにも発火するのでそれを回避
      this.isMakingRelation = true;
      await this.selectNode(v_base); // contextMenuを経由してない時用
      let base = document.getElementById(v_base.id);
      this.closeContextMenu();
      let v_target = null;
      let id = null;
      let DOMnodes = document.getElementsByClassName("Node-in-Free");
      // console.log(DOMnodes)
      await this.awaitForClick(base, DOMnodes).then(res => {
        id = res.target.getAttribute("data-relation-id");
        // console.log(res)
        // console.log(id);
      });
      // console.log('await fin')
      this.isMakingRelation = false;
      for (let node of DOMnodes) {
        node.classList.remove("relation-target");
      }
      if (id === null || v_base.id === id) return; // node以外だったらreturn 同じやってもreturn（これに関しては.stopで行けてた気がしてた笑）
      v_target = helpers.searchNode(id);
      // console.log((v_base.id + '_' + v_target.id) in v_base.relations)
      this.makeRelation({
        base: v_base,
        target: v_target
      });
      this.selectNode(v_target);
    },
    awaitForClick(base, DOMnodes) {
      // baseもDOMnodesもDOM
      return new Promise(resolve => {
        const listener = resolve;
        // resolveがCBされることで同期完了？
        document.body.addEventListener("click", listener, { once: true });
        for (let target of DOMnodes) {
          target.addEventListener("click", listener, { once: true });
          target.classList.add("relation-target");
        }
        // console.log('targetNode setting mow')
        base.removeEventListener("click", listener);
        base.classList.remove("relation-target");
      });
    },
    moveNode(event) {
      if (!this.moveNodeInfo.isOn) return;
      if (this.moveNodeInfo.id === -1)
        this.moveNodeInfo.id = this.detailsMenu.nodeId;
      let node = this.detailsMenu.node;
      let e = event.type === "touchmove" ? event.changedTouches[0] : event;
      // console.log(event);
      let FreeGraph = document.getElementById("FreeGraph");
      let x = e.pageX;
      let y = e.pageY;
      let X = x + FreeGraph.scrollLeft; // 現在のポインタ位置
      let Y = y + FreeGraph.scrollTop;
      if (x < 100) FreeGraph.scrollLeft -= 10;
      if (x > this.width - 400 && X < 2000) FreeGraph.scrollLeft += 10;
      if (y < 100) FreeGraph.scrollTop -= 10;
      if (y > this.height - 100 && Y < 2000) FreeGraph.scrollTop += 10;
      node.x = node.free.x = Math.floor(X);
      node.y = node.free.y = Math.floor(Y - 56);
    },
    onGhost(node) {
      this.closeContextMenu();
      this.closeAddNodeForm();
      if (this.moveNodeInfo.isOn) return;
      this.selectNode(node);
      this.moveNodeInfo.isOn = true;
    },
    endGhost() {
      if (!this.moveNodeInfo.isOn) return;
      this.moveNodeInfo.id = -1;
      this.moveNodeInfo.isOn = false;
    },
    graphPath(line) {
      return (
        "M" +
        line.base.node.x +
        "," +
        line.base.node.y +
        " L" +
        line.target.node.x +
        "," +
        line.target.node.y
      );
    },
    nodeFilter() {
      return this.nodes.filter(item => {
        return item.free.isActive && !item.archive;
      });
    },
    relationFilter() {
      return this.relations.filter(
        rel =>
          // 片方でもアーカイブならアウト
          !(rel.base.node.archive || rel.target.node.archive) &&
          rel.base.node.free.isActive &&
          rel.target.node.free.isActive
      );
    },
    searchRelations(id) {
      return this.relations.filter(
        rel => rel.base.id === id || rel.target.id === id
      );
    },
    openAddNodeForm(event) {
      // console.log("openAddNodeForm:" + event.type);
      let FreeGraph = document.getElementById("FreeGraph");
      let x = event.pageX;
      let y = event.pageY - 56;
      let X = x + FreeGraph.scrollLeft; // 現在のポインタ位置
      let Y = y + FreeGraph.scrollTop;
      this.addNodeForm.isFree = true;
      this.addNodeForm.x = X;
      this.addNodeForm.y = Y;
      // this.$nextTick(() => document.querySelector("textarea.Textarea").focus());
    },
    openContextMenu(node = null) {
      // このメニューの位置決めるやつはイベントの起きたページの位置に変えるべき
      // 拡大機能とかつけたらメニュー見えんくなる可能性があるから
      this.contextMenu.x = node.x + 32;
      this.contextMenu.y = node.y + 56;
      this.contextMenu.isOpen = true;
      this.contextMenu.node = node;
      this.selectNode(node);
      this.closeAddNodeForm();
    },
    initFreeNode() {
      this.nodes.forEach(node => {
        node.x = node.free.x;
        node.y = node.free.y;
      });
    },
    ...mapMutations([
      "graphArea",
      "closeContextMenu",
      "closeAddNodeForm",
      "makeRelation"
    ]),
    ...mapActions(["delRelation", "selectNode", "addNode"]),
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
      console.log("fuck");
      this.$store.commit("set_isEditorOpen", false);
    }
  },
  computed: {
    ...mapState([
      "width",
      "height",
      "nodes",
      "relations",
      "moveNodeInfo",
      "addNodeForm",
      "contextMenu",
      "detailsMenu",
      "isEditorOpen"
    ]),
    ...mapGetters(["isDetailsOpen"]),
    isMakingRelation: {
      get() {
        return this.$store.state.isMakingRelation;
      },
      set(val) {
        this.$store.commit("set_isMakingRelation", val);
      }
    },
    editor() {
      return this.detailsMenu.node
        ? this.$refs.MyQuillEditor.quill
        : "not selected";
    }
  },
  mounted() {
    // console.log('mounted')
    this.graphArea();
    console.log("this is current quill instance object", this.editor);
  },
  created() {
    // console.log("created");
    this.initFreeNode();
  },
  destroyed() {}
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
#FreeGraph {
  position: relative;
  overflow: scroll;
  width: 100%;
  height: 100%;
  transition: 0.25s ease-in-out;
}
.Free__area {
  display: block;
  // 固定ではなくてnodeの最大位置とかを元に計算で出せたらいいな
  // あと負の方向も作りたい？初期位置を1000 1000にしたらいける？
  // いや、それやと動的に出しづらいから負にするべきかも
  // いや、最大サイズが変わった時点ですべての座標を再計算でいける
  // TODO
  width: 2000px;
  height: 2000px;
}
.Circle {
  &__center {
    fill: #666;
    stroke: black;
    stroke-width: 2px;
  }
  &__level {
    cursor: pointer;
    fill: none;
    stroke: rgba(red, 1);
    stroke-width: 5px;
    transition: 0.25s ease-in-out;
    &.center {
      fill: #eee;
    }
  }
  &__ghost {
    opacity: 0.3;
  }
}
.Line {
  cursor: pointer;
  fill: none;
  stroke-width: 3px;
  stroke: black;
  transition: 0.25s ease-in-out;
  // 何故かlineにはtransitionが効かなかった pathで代用
  // 後日、いらんくね？
  // 次の日、レベル増減時にこいつだけ先に動くのは気持ちわるいので復活
  &.drag {
    transition: 0s;
  }
  &.select {
    stroke: $color-main;
  }
}
.Editor {
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
  // cursor: pointer;
  user-select: none;
  &__wrapper {
    width: 80%;
    max-width: 800px;
  }
  &__title {
    background: white;
    margin: 0;
    padding: 16px;
  }
}
.quill-editor,
.ql-editor,
.content {
  background-color: white;
}
.edit-area {
  height: 500px;
}
</style>