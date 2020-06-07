<template>
  <div class="TitleGroup">
    <div class="TitleGroup__text">{{ text }}</div>
    <div class="TitleGroup__buttons" v-if="this.$slots.default && this.$slots.default.length > 1">
      <slot />
    </div>
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: "TitleGroup",
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.TitleGroup {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
  user-select: none;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  &__text {
    font-weight: bold;
    height: 24px;
    padding-top: 3px;
    line-height: 20px; // 半角はこっちかな
    // vertical-align: middle; // 全角はこっちかな？ これについては調査・対策が必要
    box-sizing: border-box;
  }
  &__buttons {
    display: flex;
  }
}
</style>