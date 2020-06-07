<template>
  <div class="Header">
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
.Header {
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  padding: 8px 16px 8px;
  display: flex;
  background: #fff;
}
</style>