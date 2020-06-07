<template>
  <div id="app">
    <Navigation />
    <Details />
    <router-view />
  </div>
</template>

<script>
import Navigation from "@/components/organisms/Navigation.vue";
import Details from "@/components/organisms/Details.vue";
export default {
  components: {
    Navigation,
    Details
  }
};
</script>

<style lang="scss">
@import "@/assets/common.scss";
@import "@/assets/variable.scss";
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
input,
button,
textarea,
select {
  display: block;
  margin: 0;
  padding: 0;
  background: 0 0;
  border: none;
  border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: $color-main-l;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
