<template>
  <div class="Overlay">
    <div class="Overlay__icon">
      <Icon icon="spinner" :size="32" :font="24" />
    </div>
  </div>
</template>

<script>
import Icon from "@/components/atoms/Icon";

export default {
  name: "Overlay",
  components: {
    Icon
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/variable";
.Overlay {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(black, 0.4);
  color: white;
  &__icon {
    @include loading-icon;
  }
}
</style>