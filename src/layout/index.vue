<template>
  <div class="Layout" @click.stop>
    <Sidebar />
    <div class="Layout__container" :class="{full: !sidebar.isOpen}">
      <Navigation />
      <AppMain />
    </div>
    <Overlay v-if="isLoading" />
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/functions";
import { mapState, mapMutations } from "vuex";
import Navigation from "@/layout/parts/Navigation";
import Sidebar from "@/layout/parts/Sidebar";
import AppMain from "@/layout/parts/AppMain";
import Overlay from "@/layout/parts/Overlay";

import helpers from "@/helpers/helpers";
export default {
  name: "Layout",
  components: {
    Navigation,
    Sidebar,
    AppMain,
    Overlay,
  },
  data() {
    return {
      getData: firebase.functions().httpsCallable("getData"),
      isLoading: false,
    };
  },
  computed: {
    ...mapState(["nodes", "sidebar", "dataInfo", "detailsMenu"]),
  },
  methods: {
    initData(data) {
      data.nodes.forEach((item) => {
        item.x = item.free.x;
        item.y = item.free.y;
      });
      data.relations.forEach((item) => {
        item.base.node = data.nodes.find((x) => x.id === item.base.id);
        item.target.node = data.nodes.find((x) => x.id === item.target.id);
      });
      this.dataInfo.nodeNum = data.nodeNum;
      this.dataInfo.statusNum = data.statusNum;
      this.dataInfo.tagNum = data.tagNum;
      this.$store.state.nodes = data.nodes;
      this.$store.state.relations = data.relations;
      this.$store.state.statuses = data.statuses;
      this.$store.state.tags = data.tags;
      this.detailsMenu.node = null;
      console.log("init fin");
    },
    ...mapMutations(["graphArea"]),
  },
  created() {
    this.isLoading = true;
    window.addEventListener("resize", this.graphArea, false);
    window.addEventListener("beforeunload", (e) => {
      var confirmationMessage = "変更が保存されない可能性があります";
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    });
    this.getData()
      .then((result) => {
        console.log(result);
        this.initData(result.data);
        if (this.$route.params.node_id) {
          console.log("search now", this.$route.params.node_id);
          let node = helpers.searchNode(this.$route.params.node_id);
          // console.log(node);
          if (node) this.$store.dispatch("selectNode", node);
          else this.$router.push("/404");
        }
      })
      .then(() => {
        this.isLoading = false;
        // width_2の更新
        this.$nextTick(() => {
          this.$store.commit("updateNodeWidth_2");
        });
      });
  },
  destroyed() {
    // console.log("destroyed");
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