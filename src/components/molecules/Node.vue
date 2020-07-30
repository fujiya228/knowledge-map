<template>
  <div
    class="Node"
    :class="{
      drag: moveNodeInfo.id === node.id,
      selected: node.id === detailsMenu.nodeId,
    }"
    :id="node.id"
    :data-relation-id="node.id"
    :style="nodeStyle"
    @click.exact="selectNode(node)"
  >
    {{ node.title }}
    <div class="Node__flame"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import helpers from "@/helpers/helpers";
export default {
  name: "Node",
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  methods: {
    statusColor: helpers.statusColor,
    ...mapActions(["selectNode"]),
  },
  computed: {
    ...mapState(["scale", "statuses", "moveNodeInfo", "detailsMenu"]),
    nodeStyle() {
      return {
        minWidth: 32 * this.scale + "px",
        height: 64 * this.scale + "px",
        paddingLeft: 16 * this.scale + "px",
        paddingRight: 16 * this.scale + "px",
        borderRadius: 32 * this.scale + "px",
        fontSize: 30 * this.scale + "px",
        lineHeight: 64 * this.scale + "px",
        left: this.node.x - this.node.width_2 + "px",
        top: this.node.y - 32 * this.scale + "px",
        backgroundColor: this.statusColor(this.node.status),
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Node {
  position: absolute;
  text-align: center;
  font-weight: bold;
  user-select: none;
  // transition: 0.25s ease-in-out;
  white-space: nowrap;
  cursor: move;
  &.drag,
  &.selected {
    transition: 0s;
  }
  &.relation-target {
    background: #666 !important; // 背景をDOMに直接やっているから仕方なく。この部分さクラスで背景変えるようにしておこうぜ TODO
    cursor: pointer;
    &:hover {
      background: #999 !important;
    }
  }
  &.selected {
    .Node__flame {
      display: block;
    }
  }
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
.Node__flame {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50vh;
  width: 100%;
  height: 100%;
  border: solid 3px #67b7b3;
  box-sizing: border-box;
}
</style>