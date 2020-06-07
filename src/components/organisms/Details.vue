<template>
  <div class="Details" :class="{ open:isDetailsOpen }">
    <div class="Details__close" :class="{ open:isDetailsOpen }" @click="switchDetailsMenu()">
      <Icon icon="arrow-left" :font="12" />
    </div>
    <div class="Details__container" v-if="isDetailsOpen">
      <div class="Details__title">
        <input class="Edit-title" type="text" placeholder="タイトル" v-model="detailsMenu.node.title" />
      </div>
      <div class="Details__status">
        <div class="Details__status__bar"></div>
        <label
          class="Details__status__item"
          v-for="status in statuses"
          :key="status.id"
          :for="'status_' + status.id"
          :class="{ on: status.id === detailsMenu.node.status }"
          :style="{ background: status.color }"
        >
          <input
            class="Details__status__input"
            type="radio"
            :id="'status_' + status.id"
            :value="status.id"
            v-model="detailsMenu.node.status"
          />
          <label
            class="Details__status__label"
            :for="'status_' + status.id"
            :class="{ on: status.id === detailsMenu.node.status }"
          >{{ status.title }}</label>
        </label>
      </div>
      <FormCard class="Details__detail">
        <textarea class="Textarea" placeholder="詳細を記述" v-model="detailsMenu.node.detail"></textarea>
      </FormCard>
      <FormCard class="Details__relations">
        <TitleGroup text="関連"></TitleGroup>
        <div class="Details__relations__container">
          <div
            class="Details__relations__node"
            v-for="node in detailsMenu.relations"
            :key="node.id"
            @click="selectNode(node)"
          >
            <div
              class="Details__relations__status"
              :style="{backgroundColor: statusColor(node.status)}"
              :class="{upper: node.level > detailsMenu.node.level}"
            >
              <Icon icon="chevron-up" v-if="node.level !== detailsMenu.node.level" />
            </div>
            <div class="Details__relations__archive">
              <Icon icon="archive" v-if="node.archive" />
            </div>
            <div class="Details__relations__title">{{ node.title }}</div>
          </div>
          <div class="Details__tags__none" v-if="detailsMenu.relations.length === 0">ありません</div>
        </div>
      </FormCard>
      <Btn class="full cancel" @click.native="delNode(detailsMenu.node)">削除</Btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import helpers from "@/helpers/helpers";
import Icon from "@/components/atoms/Icon";
import Btn from "@/components/atoms/Btn";
import FormCard from "@/components/atoms/FormCard";
import TitleGroup from "@/components/atoms/TitleGroup";
export default {
  name: "Details",
  components: {
    Icon,
    Btn,
    FormCard,
    TitleGroup
  },
  methods: {
    switchDetailsMenu() {
      this.detailsMenu.isOpen = !this.detailsMenu.isOpen;
    },
    addTag() {
      this.tags.push({
        id: this.dataForm.tagNum++,
        title: this.tagForm.title,
        description: this.tagForm.description,
        color: this.tagForm.color,
        isActive: false
      });
      this.tagForm.isAdd = false;
      this.tagForm.title = "";
      this.tagForm.description = "";
      this.tagForm.color = "#000000";
      this.loadTag();
    },
    delTag() {
      let id = this.tagForm.id;
      let length;
      this.nodes.forEach(node => {
        // TODO
        // 消すのがこんなに面倒やとtags自体をobjectにするのもありかな...
        // それかnode.tagsをobjectにするか
        length = node.tags.length;
        // console.log(node.id + " :: " + length);
        for (let i = 0; i < length; i++) {
          if (node.tags[i] === id) {
            node.tags.splice(i, 1);
            break;
          }
        }
      });
      length = this.tags.length;
      for (let i = 0; i < length; i++) {
        if (this.tags[i].id === id) {
          this.tags.splice(i, 1);
          break;
        }
      }
      this.tagForm.isEdit = false;
      this.tagForm.id = -1;
    },
    loadTag() {
      this.detailsMenu.isTagForm = true;
      this.detailsMenu.node.tags.forEach(item => {
        let length = this.tags.length;
        for (let i = 0; i < length; i++) {
          if (this.tags[i].id === item) {
            this.tags[i].isActive = true;
            break;
          }
        }
      });
    },
    loadEditTag(tag) {
      // console.log(tag);
      this.tagForm.isEdit = true;
      this.tagForm.id = tag.id;
      this.tagForm.title = tag.title;
      this.tagForm.color = tag.color;
      this.tagForm.description = tag.description;
    },
    saveEditTag() {
      this.tagForm.isEdit = false;
      this.tags[this.tagForm.id].title = this.tagForm.title;
      this.tags[this.tagForm.id].color = this.tagForm.color;
      this.tags[this.tagForm.id].description = this.tagForm.description;
    },
    openAddTagForm() {
      this.tagForm.isAdd = true;
      this.tagForm.title = "";
      this.tagForm.description = "";
      this.tagForm.color = "#000000";
    },
    updateRelationArchive(node) {
      for (let relId in node.relations) {
        // console.log(relId)
        // console.log(node.archive)
        var rel = this.relations.find(rel => rel.id === relId);
        if (rel.base.id === node.id) {
          rel.base.isArchive = node.archive;
        } else {
          rel.target.isArchive = node.archive;
        }
      }
    },
    updateDeadline() {
      this.detailsMenu.node.byTheDeadline = helpers.checkDeadline(
        this.detailsMenu.node.deadline
      );
    },
    tagColor: helpers.tagColor,
    statusColor: helpers.statusColor,
    ...mapMutations(["saveTag"]),
    ...mapActions(["delNode", "selectNode"])
  },
  computed: {
    updatedText() {
      let time = this.detailsMenu.node.updated_at;
      let check;
      let elapsed = Math.floor(Date.now() / 1000) - time;
      // 何月何日（一週間以上前）
      check = elapsed / 86400;
      if (check >= 7) return new Date(time * 1000).toLocaleDateString();
      // 数日前（一週間以内）
      if (check >= 1) return Math.floor(check) + "日前";
      // 数時間前に更新
      check = elapsed / 60;
      if (check >= 60) return Math.floor(check / 60) + "時間前";
      // 数分前に更新
      return Math.floor(check) + "分前";
    },
    ...mapState([
      "statuses",
      "tags",
      "nodes",
      "relations",
      "detailsMenu",
      "tagForm",
      "dataForm",
      "moveNodeInfo"
    ]),
    ...mapGetters(["isDetailsOpen"]),
    tags: {
      // 移動させるためにmapStateではなくこっち使ってる
      get() {
        return this.$store.state.tags;
      },
      set(val) {
        this.$store.commit("set_tags", val);
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Details {
  position: fixed;
  top: 48px;
  right: -300px;
  width: 300px;
  height: calc(100% - 56px);
  background: #fff;
  transition: 0.25s ease-in-out;
  z-index: 300;
  &.open {
    right: 0;
  }
  &__title {
    margin-bottom: 8px;
    width: 100%;
    box-sizing: border-box;
  }
  &__close {
    position: absolute;
    left: -24px;
    width: 24px;
    height: 100%;
    padding: 8px 0;
    border-radius: 3px 0 0 3px;
    background: #ccc;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &.open svg {
      transform: rotate(180deg);
    }
  }
  &__container {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 100%;
    padding: 8px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  &__updated {
    width: 100%;
    height: 16px;
    padding: 0 8px;
    line-height: 16px;
    color: #666;
    font-size: 12px;
  }
  &__status {
    display: flex;
    justify-content: space-between;
    position: relative;
    min-width: 100%;
    height: 40px;
    padding: 8px;
    margin-bottom: 12px;
    box-sizing: border-box;
    &__item {
      display: block;
      position: relative;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      &.on {
        border: solid 2px #888;
        box-sizing: border-box;
        box-shadow: 1px 1px 6px 1px rgba(0, 0, 0, 0.2);
      }
    }
    &__label {
      display: block;
      position: absolute;
      width: 50px;
      bottom: -14px;
      left: -13px;
      font-size: 10px;
      color: #aaa;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      &.on {
        bottom: -16px;
        left: -15px;
      }
    }
    &__input {
      display: none;
    }
    &__bar {
      position: absolute;
      top: 19px;
      left: 20px;
      width: calc(100% - 40px);
      height: 2px;
      background: #ccc;
      z-index: -1;
    }
  }
  &__detail {
    .Textarea {
      height: 120px + 16px;
    }
  }
  &__deadline {
    &__status {
      width: 80px;
      height: 24px;
      line-height: 24px;
      border-radius: 3px;
      font-size: 14px;
      text-align: center;
      background: $color-main;
      color: white;
      &.over {
        background: $color-red;
      }
      &.near {
        background: $color-yellow;
        color: black;
      }
    }
  }
  &__relations {
    max-height: 200px;
    &__container {
      width: 100%;
      max-height: 152px;
      overflow: auto;
    }
    &__node {
      display: flex;
      // justify-content: space-between;
      width: 100%;
      height: 32px;
      line-height: 24px;
      padding: 4px 8px;
      background: #fff;
      border-radius: 3px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background: #67b7b3;
      }
      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }
    &__status {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      &.upper {
        transform: rotate(180deg);
      }
    }
    &__archive {
      width: 24px;
      height: 24px;
    }
    &__title {
      // width: calc(100% - 32px);
      // width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &__tags {
    position: relative;
    &__container {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      min-height: 24px;
      min-width: 100%;
      max-height: 152px;
      padding: 0 0 4px;
      // 以下のふたつについてはツールチップのため一旦削除
      // そんなに多くなることもなく改行することがないと判断
      // overflow-x: auto;
      // overflow-y: hidden;
    }
    &__tag {
      position: relative;
      min-width: 48px;
      max-width: 90%;
      height: 24px;
      line-height: 20px;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 14px;
      box-sizing: border-box;
      margin: 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &.origin {
        width: 70%;
      }
    }
    &__form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: flex-start;
      position: absolute;
      top: -200px;
      right: 0;
      width: 90%;
      height: 400px;
      padding: 8px;
      border-radius: 3px;
      box-sizing: border-box;
      background: #fff;
      box-shadow: 0 3px 12px rgba(27, 31, 35, 0.15);
      z-index: 200;
    }
    &__origin {
      width: 100%;
      height: calc(100% - 32px);
      overflow-y: scroll;
      cursor: pointer;
    }
    &__card {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      padding: 4px;
      box-sizing: border-box;
      border-bottom: solid 1px #ccc;
    }
    &__description {
      width: 100%;
      font-size: 12px;
      word-wrap: break-word;
    }
  }
}
.vdatetime {
  width: 100%;
  &-input {
    display: block;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>