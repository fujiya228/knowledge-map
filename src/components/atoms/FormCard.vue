<template>
  <div class="FormCard">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "FormCard",
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.FormCard {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  border-radius: 3px;
  box-sizing: border-box;
  background: #cfcfcf;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  > :not(:last-child) {
    margin-bottom: 8px;
  }
  &.inline > :not(:last-child) {
    margin-bottom: 0;
  }
}
.Add-node-form {
  width: 250px;
  position: absolute;
  z-index: 300;
}
</style>