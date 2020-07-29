<template>
  <div class="Icon-button">
    <Icon :icon="icon" :size="size" :font="font" />
  </div>
</template>

<script>
import Icon from "@/components/atoms/Icon";
export default {
  name: "IconButton",
  components: {
    Icon,
  },
  props: {
    icon: {
      type: String,
      default: "times",
    },
    size: {
      type: Number,
      default: 24,
    },
    font: {
      type: Number,
      default: 14,
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Icon-button {
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &.active {
    background: $color-main-l;
  }
}
</style>