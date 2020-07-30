<template>
  <div
    class="Context-menu"
    @pointermove.stop
    @click.stop="closeContextMenu"
    v-show="contextMenu.isOpen"
  >
    <div
      class="Context-menu__form"
      v-show="contextMenu.isOpen"
      :class="{ open: contextMenu.isOpen }"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
    >
      <div class="Context-menu__title" v-if="contextMenu.node" @click.stop>
        <input type="text" v-model="contextMenu.node.title" />
      </div>
      <div class="Context-menu__item delete" @click.stop="delNode(contextMenu.node)">削除</div>
      <div class="Context-menu__item" @click.stop="makeRelation()">結ぶ</div>
      <div class="Context-menu__item" @click.stop="goEditPage()">編集ページ</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "ContextMenu",
  data() {
    return {};
  },
  methods: {
    makeRelation() {
      this.$emit("makeRelation");
    },
    goEditPage() {
      this.$router.push("/" + this.contextMenu.node.id);
      this.closeContextMenu();
    },
    ...mapMutations(["closeContextMenu"]),
    ...mapActions(["delNode"]),
  },
  computed: {
    ...mapState(["contextMenu"]),
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Context-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(27, 31, 35, 0.5);
  z-index: 100;
  &__form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    :not(:last-child) {
      margin-bottom: 8px;
    }
  }
  &__title {
    box-sizing: border-box;
    padding: 0 8px;
    font-size: 14px;
    background: white;
    border-radius: 3px;
    input {
      @include ellipse;
      width: 100%;
      height: 32px;
      line-height: 32px;
    }
  }
  &__item {
    width: 200px;
    height: 32px;
    margin: auto;
    line-height: 32px;
    font-size: 14px;
    text-align: center;
    user-select: none;
    background: white;
    border-radius: 3px;
    opacity: 0.8;
    margin: bottom;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    &.delete {
      color: $color-red;
    }
  }
}
</style>