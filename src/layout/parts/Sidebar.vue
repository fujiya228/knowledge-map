<template>
  <div class="Sidebar">
    <div class="Sidebar__header">
      <div class="Sidebar__button">ログアウト</div>
      <div class="Sidebar__close">
        <Icon icon="angle-double-left" :size="32" :font="20" />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/atoms/Icon";
export default {
  name: "Sidebar",
  components: {
    Icon
  },
  data() {
    return {};
  },
  methods: {},
  computed: {}
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Sidebar {
  box-sizing: border-box;
  width: $sidebar-width;
  height: 100%;
  background: #eee;
  &__header {
    @include header;
    justify-content: space-between;
    @include button-hover;
  }
  &__button {
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
    user-select: none;
    cursor: pointer;
    @include button-hover;
  }
  &__close {
    width: 32px;
    height: 32px;
    border-radius: 3px;
    cursor: pointer;
    @include button-hover;
  }
}
</style>