<template>
  <div class="Navigation">
    <div class="Navigation__open" @click="openSidebar()" v-if="!sidebar.isOpen">
      <Icon icon="angle-double-left" :size="32" :font="20" />
    </div>
    <Actions />
    <div class="Navigation__container">
      <div class="Navigation__button" @click="contactInfo.isOpen = true" v-tooltip="'Contact'">
        <Icon icon="paper-plane" :size="32" :font="16" />
      </div>
      <Help />
    </div>
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
    ...mapState(["sidebar", "contactInfo"]),
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
  &__button {
    width: 32px;
    height: 32px;
    border-radius: 3px;
    cursor: pointer;
    @include button-hover;
  }
  &__container {
    display: flex;
  }
}
</style>