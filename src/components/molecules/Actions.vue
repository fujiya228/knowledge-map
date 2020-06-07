<template>
  <div class="Actions">
    <div class="Actions__button" @click="dataForm.isSave = true">
      <Icon icon="save" />
    </div>
    <div class="Actions__button" @click="dataForm.isLoad = true">
      <Icon icon="file-import" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Icon from "@/components/atoms/Icon";
export default {
  name: "Actions",
  components: {
    Icon
  },
  methods: {},
  computed: {
    ...mapState(["dataForm"])
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Actions {
  box-sizing: border-box;
  height: 32px;
  display: flex;
  flex-wrap: wrap;
  &__button {
    width: 24px;
    margin: 4px;
    border-radius: 3px;
    background: #eee;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>