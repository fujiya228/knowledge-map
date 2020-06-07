<template>
  <FormCard>
    <textarea
      class="Textarea"
      v-model="addNodeForm.title"
      placeholder="タイトルを入力"
      @keyup.ctrl.enter="addNode()"
    ></textarea>
    <div class="Button-container">
      <Btn class="cancel" @click.native="closeAddNodeForm()">キャンセル</Btn>
      <Btn @click.native="addNode()">追加</Btn>
    </div>
  </FormCard>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Btn from "@/components/atoms/Btn";
import FormCard from "@/components/atoms/FormCard";

export default {
  name: "AddNodeForm",
  components: {
    Btn,
    FormCard
  },
  methods: {
    addNode() {
      this.$emit("addFunction");
    },
    ...mapMutations(["closeAddNodeForm"])
  },
  computed: {
    ...mapState(["addNodeForm"])
  }
};
</script>