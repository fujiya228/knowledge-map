<template>
  <div class="Navigation">
    <Actions />
  </div>
</template>

<script>
import Actions from "@/components/molecules/Actions";
export default {
  name: "Navigation",
  components: {
    Actions
  },
  data() {
    return {};
  },
  methods: {},
  computed: {}
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Navigation {
  @include header;
  background: #fff;
}
</style>