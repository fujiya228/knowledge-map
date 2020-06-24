<template>
  <div class="Layout">
    <Sidebar />
    <div class="Layout__container">
      <Navigation />
      <AppMain />
    </div>
  </div>
</template>

<script>
import Navigation from "@/layout/parts/Navigation";
import Sidebar from "@/layout/parts/Sidebar";
import AppMain from "@/layout/parts/AppMain";

export default {
  name: "Layout",
  components: {
    Navigation,
    Sidebar,
    AppMain
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/variable.scss";
.Layout {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  &__container {
    display: flex;
    flex-direction: column;
    width: calc(100% - #{$sidebar-width});
    height: 100vh;
    max-height: 100%;
    background: white;
  }
}
</style>