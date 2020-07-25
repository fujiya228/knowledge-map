<template>
  <defs>
    <pattern id="background" x="0" y="0" :width="full" :height="full" patternUnits="userSpaceOnUse">
      <!-- <rect x="0" y="0" width="15" height="15" fill="#bfe4e2" />
      <rect x="0" y="15" width="15" height="15" fill="#fff" />
      <rect x="15" y="15" width="15" height="15" fill="#bfe4e2" />
      <rect x="15" y="0" width="15" height="15" fill="#fff" />-->
      <line x1="0" y1="0" :x2="full" y2="0" stroke="#bfe4e2" />
      <line x1="0" :y1="half" :x2="full" :y2="half" stroke="#bfe4e2" />
      <line x1="0" :y1="full" :x2="full" :y2="full" stroke="#bfe4e2" />
      <line x1="0" y1="0" x2="0" :y2="full" stroke="#bfe4e2" />
      <line :x1="half" y1="0" :x2="half" :y2="full" stroke="#bfe4e2" />
      <line :x1="full" y1="0" :x2="full" :y2="full" stroke="#bfe4e2" />
    </pattern>
  </defs>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Background",
  computed: {
    half() {
      return 15 * this.scale;
    },
    full() {
      return 30 * this.scale;
    },
    ...mapState(["scale"]),
  },
};
</script>