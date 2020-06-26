<template>
  <div class="Layout">
    <Sidebar />
    <div class="Layout__container" :class="{full: !sidebar.isOpen}">
      <Navigation />
      <AppMain />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navigation from "@/layout/parts/Navigation";
import Sidebar from "@/layout/parts/Sidebar";
import AppMain from "@/layout/parts/AppMain";

export default {
  name: "Layout",
  components: {
    Navigation,
    Sidebar,
    AppMain
  },
  computed: {
    ...mapState(["sidebar"])
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
    &.full {
      width: 100%;
    }
  }
}
</style>