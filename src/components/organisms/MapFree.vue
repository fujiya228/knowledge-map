<template>
  <div
    id="MapFree"
    :class="{open: isDetailsOpen && !editorInfo.isOpen}"
    @pointerdown.left="onGraphMove($event)"
    @pointerup="endGraphMove()"
    @touchmove.prevent="moveNodeInfo.isOn ? moveNode($event) : moveGraph($event)"
    @pointermove.stop="moveNodeInfo.isOn ? moveNode($event) : moveGraph($event)"
  >
    <svg
      class="Free__area"
      :class="{moving: isGraphMove}"
      @click="openAddNodeForm($event)"
      :width="3000*scale"
      :height="3000*scale"
    >
      <rect width="100%" height="100%" fill="url(#background)" />
      <Background />
      <path
        class="Line"
        :class="{
            select: detailsMenu.nodeId === line.base.id || detailsMenu.nodeId === line.target.id,
            drag: moveNodeInfo.id === line.base.id || moveNodeInfo.id === line.target.id,
          }"
        v-for="line in relationFilter()"
        :key="line.id"
        :d="graphPath(line)"
        @click.stop="delRelation({relId:line.id,force:false})"
      />
    </svg>
    <Node
      class="Node-in-Free"
      v-for="node in nodeFilter()"
      :key="node.id"
      :node="node"
      @pointerdown.left.native="onGhost(node)"
      @pointerup.left.native="endGhost()"
      @click.right.prevent.stop.native="openContextMenu($event,node)"
      @click.shift.exact.stop.native="selectRelaitonNode(node)"
      @dblclick.native="editorInfo.isOpen = true"
    />
    <AddNodeForm
      class="Add-node-form"
      v-if="addNodeForm.isFree"
      :style="{
        top: addNodeForm.y + 24 + 'px',
        left: addNodeForm.x - 125 + 'px',
      }"
      @addFunction="addNode()"
      @touchmove.stop.native
      @pointermove.stop.native
    />
    <ContextMenu @makeRelation="selectRelaitonNode(contextMenu.node)" />
    <div
      class="Free__editor"
      v-if="detailsMenu.node && editorInfo.isOpen"
      @click.self="closeEditor()"
      @touchmove.stop
      @pointermove.stop
    >
      <div class="Free__editor__wrapper">
        <h2 class="Free__editor__title">
          <input class="Free__editor__input" type="text" v-model="detailsMenu.node.title" />
          <div class="Free__editor__to-edit" @click="goToEdit()">編集ページへ</div>
        </h2>
        <editor editorClass="free-editor" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import helpers from "@/helpers/helpers";
import Background from "@/components/atoms/Background";
import Node from "@/components/molecules/Node";
import AddNodeForm from "@/components/molecules/AddNodeForm";
import ContextMenu from "@/components/molecules/ContextMenu";
import Editor from "@/components/organisms/Editor";
export default {
  name: "MapFree",
  components: {
    Background,
    Node,
    ContextMenu,
    AddNodeForm,
    Editor,
  },
  data() {
    return {
      isGraphMove: false,
      canOpenAddNodeForm: true,
      pointerX: 0,
      pointerY: 0,
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
      await this.awaitForClick(base, DOMnodes).then((res) => {
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
        target: v_target,
      });
      this.selectNode(v_target);
    },
    awaitForClick(base, DOMnodes) {
      // baseもDOMnodesもDOM
      return new Promise((resolve) => {
        const listener = resolve;
        // resolveがCBされることで同期完了？
        document.body.addEventListener("click", listener, { once: true });
        document
          .getElementById("MapFree")
          .addEventListener("click", listener, { once: true });
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
      let MapFree = document.getElementById("MapFree");
      let x = e.pageX;
      let y = e.pageY;
      let X = x + MapFree.scrollLeft - this.sidebar_width; // 現在のポインタ位置
      let Y = y + MapFree.scrollTop;
      if (x < 100 + this.sidebar_width) MapFree.scrollLeft -= 10;
      if (x > this.width - 100 && X < 3000) MapFree.scrollLeft += 10;
      if (y < 100) MapFree.scrollTop -= 10;
      if (y > this.height - 100 && Y < 3000) MapFree.scrollTop += 10;
      node.x = Math.floor(X);
      node.free.x = Math.floor(node.x / this.scale);
      node.y = Math.floor(Y - 48);
      node.free.y = Math.floor(node.y / this.scale);
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
    moveGraph(event) {
      if (!this.isGraphMove) return;
      this.canOpenAddNodeForm = false;
      let e = event.type === "touchmove" ? event.changedTouches[0] : event;
      let MapFree = document.getElementById("MapFree");
      let x = e.pageX;
      let y = e.pageY;
      MapFree.scrollLeft += this.pointerX - x;
      MapFree.scrollTop += this.pointerY - y;
      this.pointerX = x;
      this.pointerY = y;
    },
    onGraphMove(event) {
      this.canOpenAddNodeForm = true;
      if (this.isGraphMove) return;
      this.isGraphMove = true;
      let e = event.type === "touchmove" ? event.changedTouches[0] : event;
      this.pointerX = e.pageX;
      this.pointerY = e.pageY;
    },
    endGraphMove() {
      if (!this.isGraphMove) return;
      this.isGraphMove = false;
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
      return this.nodes.filter((item) => {
        return !item.archive;
      });
    },
    relationFilter() {
      return this.relations.filter(
        (rel) => !(rel.base.node.archive || rel.target.node.archive)
      );
    },
    searchRelations(id) {
      return this.relations.filter(
        (rel) => rel.base.id === id || rel.target.id === id
      );
    },
    openAddNodeForm(event) {
      // console.log("openAddNodeForm:" + event.type);
      if (!this.canOpenAddNodeForm) return;
      let MapFree = document.getElementById("MapFree");
      let x = event.pageX - this.sidebar_width;
      let y = event.pageY - 48;
      let X = x + MapFree.scrollLeft; // 現在のポインタ位置
      let Y = y + MapFree.scrollTop;
      this.addNodeForm.isFree = true;
      this.addNodeForm.x = X;
      this.addNodeForm.y = Y;
      this.addNodeForm.status = this.statuses[0].id;
      // this.$nextTick(() => document.querySelector("textarea.Textarea").focus());
    },
    openContextMenu(event, node = null) {
      let e = event.type === "touchmove" ? event.changedTouches[0] : event;
      let x = e.pageX;
      let y = e.pageY;
      this.contextMenu.flag_x = x < (this.width + this.sidebar_width) / 2;
      this.contextMenu.flag_y = y < (this.height + 48) / 2;
      this.contextMenu.x = this.contextMenu.flag_x ? x : x - 120;
      this.contextMenu.y = this.contextMenu.flag_y ? y : y - 208;
      this.contextMenu.isOpen = true;
      this.contextMenu.node = node;
      this.selectNode(node);
      this.closeAddNodeForm();
    },
    goToEdit() {
      this.$router.push(this.detailsMenu.node.id);
    },
    initFreeNode() {
      this.nodes.forEach((node) => {
        node.x = node.free.x * this.scale;
        node.y = node.free.y * this.scale;
      });
    },
    ...mapMutations([
      "graphArea",
      "closeContextMenu",
      "closeAddNodeForm",
      "makeRelation",
    ]),
    ...mapActions(["delRelation", "selectNode", "addNode"]),
    closeEditor() {
      console.log("closeEditor");
      this.editorInfo.isOpen = false;
    },
  },
  computed: {
    ...mapState([
      "scale",
      "width",
      "height",
      "nodes",
      "statuses",
      "relations",
      "moveNodeInfo",
      "addNodeForm",
      "contextMenu",
      "detailsMenu",
      "editorInfo",
      "sidebar",
    ]),
    ...mapGetters(["isDetailsOpen"]),
    sidebar_width() {
      return this.sidebar.isOpen ? 256 : 0;
    },
    isMakingRelation: {
      get() {
        return this.$store.state.isMakingRelation;
      },
      set(val) {
        this.$store.commit("set_isMakingRelation", val);
      },
    },
    editor() {
      return this.detailsMenu.node && this.editorInfo.isOpen
        ? this.$refs.MyQuillEditor.quill
        : "not selected";
    },
  },
  watch: {
    "detailsMenu.node.title"() {
      let node = this.detailsMenu.node;
      if (node) {
        this.$nextTick(() => {
          node.width_2 = document.getElementById(node.id).clientWidth / 2;
        });
      }
    },
  },
  mounted() {
    // console.log("mounted");
    this.graphArea();
    this.$nextTick(() => {
      console.log("this is current quill instance object", this.editor);
      // width_2の更新
      this.$store.commit("updateNodeWidth_2");
    });
  },
  created() {
    // console.log("created");
    this.initFreeNode();
    this.editorInfo.isEditPage = false;
  },
  destroyed() {},
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
#MapFree {
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
  // いや、普通にスクロールをJSで与えておいたら問題ない
  // width: 3000px;
  // height: 3000px;
  // background: $color-main-l;
  cursor: pointer;
  &.moving {
    cursor: move;
  }
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
  // transition: 0.25s ease-in-out;
  // 何故かlineにはtransitionが効かなかった pathで代用
  // 後日、いらんくね？
  // 次の日、レベル増減時にこいつだけ先に動くのは気持ちわるいので復活
  &.drag {
    transition: 0s;
  }
  &.select {
    stroke: $color-main;
  }
  &:hover {
    stroke-width: 6px;
  }
}
.Free__editor {
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
    display: flex;
    background: white;
    margin: 0;
    padding: 16px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  &__input {
    width: calc(100% - 100px);
    height: 28px;
    font-size: 24px;
  }
  &__to-edit {
    box-sizing: border-box;
    width: 100px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    text-align: center;
    background: #eee;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
.free-editor {
  height: 500px;
}
</style>