<template>
  <div class="AppMain">
    <router-view :key="key" />
  </div>
</template>

<script>
export default {
  name: "AppMain",
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.AppMain {
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - #{$navigation-height});
}
</style>