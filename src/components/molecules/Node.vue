<template>
  <div
    class="Node"
    :class="{
      drag: moveNodeInfo.id === node.id,
      selected: node.id === detailsMenu.nodeId,
    }"
    :id="node.id"
    :data-relation-id="node.id"
    :style="{ backgroundColor: statusColor(node.status) }"
    v-tooltip="node.title"
    @click.exact="selectNode(node)"
  >{{ node.title }}</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import helpers from "@/helpers/helpers";
export default {
  name: "Node",
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  methods: {
    statusColor: helpers.statusColor,
    ...mapActions(["selectNode"])
  },
  computed: {
    ...mapState(["statuses", "moveNodeInfo", "detailsMenu"])
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Node {
  position: absolute;
  min-width: 32px;
  height: 64px;
  padding: 0 16px;
  border-radius: 32px;
  text-align: center;
  line-height: 64px;
  font-size: 30px;
  font-weight: bold;
  user-select: none;
  transition: 0.25s ease-in-out;
  cursor: move;
  &.drag {
    transition: 0s;
  }
  &.relation-target {
    background: #666 !important;
    cursor: pointer;
    &:hover {
      background: #999 !important;
    }
  }
  &.selected::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 32px;
    border: solid 3px #67b7b3;
    box-sizing: border-box;
  }
  &.selected,
  &:hover {
    z-index: 100;
  }
  &.inContainer {
    position: relative;
    margin: 4px;
  }
  &__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    &.over {
      background: $color-red;
      color: white;
    }
    &.near {
      background: $color-yellow;
      color: black;
    }
  }
}
</style>