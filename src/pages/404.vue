<template>
  <div class="NotFound">
    <header class="NotFound__header"></header>
    <div class="NotFound__container">
      <div class="NotFound__title">コンテンツが存在しませんでした。</div>
      <router-link to="/graph-free" class="NotFound__link">Topへ戻る</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style lang="scss" scoped>
@import "@/assets/variable.scss";
.NotFound {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  &__container {
    width: 80%;
  }
  &__title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }
  &__link {
    display: block;
    width: 150px;
    height: 32px;
    line-height: 32px;
    margin: 24px auto;
    border-radius: 3px;
    background: $color-main;
    color: white;
    text-decoration: none;
    text-align: center;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>