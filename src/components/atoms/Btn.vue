<template>
  <div class="Button">
    <!-- 問題はButtonがlabelだったとき、今はlabelのままおとなしくしてもらってる -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Btn"
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Button {
  display: block;
  box-sizing: border-box;
  min-width: 64px;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: white;
  background: $color-main;
  user-select: none;
  cursor: pointer;
  &:hover {
    background: rgba($color-main, 0.8);
  }
  &.full {
    width: 100%;
  }
  &.cancel {
    color: $color-red;
    background: none;
    &:hover {
      background: rgba($color-red, 0.1);
    }
  }
  label {
    display: block;
    cursor: pointer;
  }
}
</style>