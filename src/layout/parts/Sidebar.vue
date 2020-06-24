<template>
  <div class="Sidebar"></div>
</template>

<script>
export default {
  name: "Sidebar",
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {}
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Sidebar {
  box-sizing: border-box;
  width: $sidebar-width;
  height: 100%;
  background: #eee;
}
</style>