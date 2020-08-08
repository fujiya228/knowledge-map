<template>
  <div class="Help__container">
    <p>まだまだ、開発途中です。PCで使っていただくことをメインで作成しており、スマホでの表示崩れや操作がおかしい点などはご了承ください。</p>
    <div class="Help__item" v-for="item in HelpContents" :key="item.title">
      <h2 @click="select(item.title)" :class="{selected:isSelect === item.title}">{{item.title}}</h2>
      <div class="Help__sub-container" v-if="isSelect === item.title">
        <div class="Help__item" v-for="sub in item.sub" :key="sub.title">
          <h3>{{sub.title}}</h3>
          <section v-html="sub.content"></section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HelpContents from "@/assets/help-contents";
export default {
  name: "Help",
  components: {},
  data() {
    return {
      isOpen: false,
      HelpContents: HelpContents,
      isSelect: "",
    };
  },
  methods: {
    select(title) {
      if (this.isSelect === title) this.isSelect = "";
      else this.isSelect = title;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/variable";
.Help {
  &__button {
    height: 32px;
    width: 32px;
    border-radius: 3px;
    cursor: pointer;
    @include button-hover;
  }
  &__overlay {
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
  }
  &__container {
    box-sizing: border-box;
    max-width: 700px;
    width: 80%;
    height: 80%;
    padding: 24px;
    overflow: auto;
    background: white;
    border-radius: 3px;
    h2 {
      padding: 0 8px;
      cursor: pointer;
      &:hover,
      &.selected {
        background: #ccc;
      }
    }
    h3 {
      border-bottom: 4px solid black;
    }
  }
}
</style>