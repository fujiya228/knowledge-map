<template>
  <div class="Icon" :style="customStyle()">
    <fa-icon :icon="icon" />
  </div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 24
    },
    font: {
      type: Number,
      default: 14
    }
  },
  methods: {
    customStyle() {
      let style = {};
      style.width = this.size + "px";
      style.height = this.size + "px";
      style.padding = (this.size - this.font) / 2 + "px 0";
      style.fontSize = this.font + "px";
      return style;
    }
  }
};
</script>

<style lang="scss">
.Icon {
  box-sizing: border-box;
  svg {
    display: block;
    margin: 0 auto;
    transition: 0.3s ease-in-out;
  }
}
</style>