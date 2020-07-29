<template>
  <div class="Layout" @click.stop>
    <Sidebar />
    <div class="Layout__container" :class="{full: !sidebar.isOpen}">
      <Navigation />
      <AppMain />
    </div>
    <Overlay v-if="dataInfo.isCreating || dataInfo.isLoading" />
    <Modal />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Navigation from "@/layout/parts/Navigation";
import Sidebar from "@/layout/parts/Sidebar";
import AppMain from "@/layout/parts/AppMain";
import Overlay from "@/layout/parts/Overlay";
import Modal from "@/layout/parts/Modal";

export default {
  name: "Layout",
  components: {
    Navigation,
    Sidebar,
    AppMain,
    Overlay,
    Modal,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["nodes", "sidebar", "dataInfo", "detailsMenu"]),
  },
  methods: {
    ...mapMutations(["graphArea"]),
  },
  created() {
    window.addEventListener("resize", this.graphArea, false);
    window.addEventListener("beforeunload", (e) => {
      var confirmationMessage = "変更が保存されない可能性があります";
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.graphArea);
  },
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