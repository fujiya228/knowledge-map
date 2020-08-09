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
      <div class="Context-menu__sub" v-if="contextMenu.isStatus">
        <TitleGroup text="ステータス">
          <IconButton @click.native.stop="contextMenu.isStatus = false" />
        </TitleGroup>
        <div class="Context-menu__sub__container">
          <div
            class="Context-menu__sub__item"
            v-for="status in statuses"
            :key="status.id"
            @click.stop="contextMenu.node.status = status.id"
          >
            <div class="Context-menu__sub__check">
              <Icon icon="check" :size="30" v-if="status.id === contextMenu.node.status" />
            </div>
            <div class="Context-menu__sub__color" :style="{background:statusColor(status.id)}"></div>
            <div class="Context-menu__sub__title">{{status.title}}</div>
          </div>
        </div>
      </div>
      <div class="Context-menu__title" v-if="contextMenu.node" @click.stop>
        <input type="text" v-model="contextMenu.node.title" />
      </div>
      <div class="Context-menu__item delete" @click.stop="delNode(contextMenu.node)">削除</div>
      <div class="Context-menu__item" @click.stop="makeRelation()">関連付ける</div>
      <div
        class="Context-menu__item"
        @click.stop="contextMenu.isStatus = !contextMenu.isStatus"
      >ステータス</div>
      <div class="Context-menu__item" @click.stop="goEditPage()">編集ページ</div>
    </div>
  </div>
</template>

<script>
import helpers from "@/helpers/helpers";
import { mapState, mapMutations, mapActions } from "vuex";
import Icon from "@/components/atoms/Icon";
import IconButton from "@/components/atoms/IconButton";
import TitleGroup from "@/components/atoms/TitleGroup";
export default {
  name: "ContextMenu",
  components: {
    Icon,
    IconButton,
    TitleGroup,
  },
  data() {
    return {};
  },
  methods: {
    makeRelation() {
      this.$emit("makeRelation");
    },
    goEditPage() {
      this.$router.push(this.$route.path + "/" + this.contextMenu.node.id);
      this.closeContextMenu();
    },
    ...mapMutations(["closeContextMenu"]),
    ...mapActions(["delNode"]),
    statusColor: helpers.statusColor,
  },
  computed: {
    ...mapState(["contextMenu", "statuses"]),
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
  }
  &__title {
    box-sizing: border-box;
    padding: 0 8px;
    font-size: 14px;
    background: white;
    border-radius: 3px;
    margin-bottom: 8px;
    input {
      @include ellipse;
      width: 100%;
      height: 32px;
      line-height: 32px;
    }
  }
  &__item {
    position: relative;
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
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
  &__sub {
    box-sizing: border-box;
    width: 200px;
    height: 100%;
    padding: 4px;
    border-radius: 3px;
    background: white;
    position: absolute;
    right: -208px;
    &__container {
      width: 100%;
      height: calc(100% - 32px);
      overflow: auto;
    }
    &__item {
      display: flex;
      width: 100%;
      height: 30px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
    &__check {
      width: 30px;
      height: 30px;
    }
    &__color {
      width: 24px;
      height: 24px;
      margin: 3px;
      border-radius: 50%;
    }
    &__title {
      width: calc(100% - 60px);
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      user-select: none;
      @include ellipse;
    }
  }
}
</style>