<template>
  <div class="Navigation">
    <div class="Navigation__open" @click="openSidebar()" v-if="!sidebar.isOpen">
      <Icon icon="angle-double-left" :size="32" :font="20" />
    </div>
    <Actions />
    <Help />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";
import Actions from "@/components/molecules/Actions";
import Help from "@/components/atoms/Help";
export default {
  name: "Navigation",
  components: {
    Icon,
    Actions,
    Help,
  },
  data() {
    return {};
  },
  methods: {
    openSidebar() {
      this.sidebar.isOpen = true;
    },
  },
  computed: {
    ...mapState(["sidebar"]),
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Navigation {
  @include header;
  justify-content: space-between;
  background: #fff;
  &__open {
    width: 32px;
    height: 32px;
    border-radius: 3px;
    cursor: pointer;
    @include button-hover;
    transform: rotate(180deg);
  }
}
</style>