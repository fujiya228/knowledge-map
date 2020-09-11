<template>
  <div class="Modal" v-show="isModalOpen" @pointerdown.stop.self="closeModal()">
    <div class="Modal__form" v-if="dataInfo.isSave" @click.stop>
      <TitleGroup text="保存">
        <IconButton @click.native="closeModal()" />
      </TitleGroup>
      <input class="Input" type="text" v-model="dataInfo.title" placeholder="タイトル" />
      <Btn class="full" @click.stop.native="modalSaveData('local')">ブラウザに保存</Btn>
      <Btn class="full" @click.stop.native="modalSaveData('file')">ファイルとして保存</Btn>
      <Btn class="full" @click.stop.native="modalSaveData('firebase')">データベースに保存</Btn>
      <Btn class="full cancel" @click.stop.native="dataInfo.isSave = false">キャンセル</Btn>
    </div>
    <div class="Modal__form" v-if="dataInfo.isLoad" @click.stop>
      <TitleGroup text="読み込む">
        <IconButton @click.native="closeModal()" />
      </TitleGroup>
      <Btn class="full" @click.stop.native="loadData(true)">ブラウザから読み込む</Btn>
      <Btn class="full">
        <label @click.stop>
          ファイルを読み込む
          <input type="file" @change="loadData(false)" />
        </label>
      </Btn>
      <Btn
        class="full"
        @click.stop.native="getAnotherData('207f0f6c-4ef4-4df4-88be-67a169f8109c')"
      >サンプルマップ</Btn>
      <TitleGroup v-if="isLoggedIn" text="データベース"></TitleGroup>
      <div class="Modal__list" v-if="isLoggedIn">
        <div class="Modal__item" v-for="item in userItems" :key="item.uuid">
          <Btn class="full" @click.stop.native="getAnotherData(item.uuid)">{{item.title}}</Btn>
          <div class="Modal__delete" @click="deleteMap(item)">
            <IconButton icon="trash-alt" :size="32" />
          </div>
        </div>
        <template v-if="!userItems.length">
          <div class="Modal__not-found">データはありませんでした</div>
        </template>
      </div>
      <Btn class="full cancel" @click.stop.native="dataInfo.isLoad = false">キャンセル</Btn>
    </div>
    <div class="Modal__form" v-if="dataInfo.isAuth" @click.stop>
      <TitleGroup :text="user.email">
        <IconButton @click.native="closeModal()" />
      </TitleGroup>
      <Btn class="full" @click.stop.native="logout()">ログアウト</Btn>
    </div>
    <div class="Modal__form" v-if="statusInfo.isEdit" @click.stop>
      <TitleGroup text="ステータス編集">
        <IconButton @click.native="closeModal()" />
      </TitleGroup>
      <FormCard v-if="statusInfo.isAdd">
        <input
          class="Input status"
          type="text"
          v-model="statusInfo.title"
          placeholder="タイトル"
          @keypress.ctrl.enter="addStatus()"
        />
        <input class="Input color" type="color" v-model="statusInfo.color" />
        <div class="Button-container">
          <Btn class="cancel" @click.native="statusInfo.isAdd = false">キャンセル</Btn>
          <Btn @click.native="addStatus()">追加</Btn>
        </div>
      </FormCard>
      <Btn class="full" v-else @click.native="statusInfo.isAdd = true">ステータスを追加</Btn>
      <draggable v-model="statuses" handle=".Modal__status__handle">
        <FormCard class="inline" v-for="status in statuses" :key="status.id">
          <input class="Input status" type="text" v-model="status.title" placeholder="タイトル" />
          <input class="Input color" type="color" v-model="status.color" />
          <IconButton icon="trash-alt" :size="32" @click.native="delStatus(status.id)" />
          <div class="Modal__status__handle">
            <Icon icon="grip-lines" :size="32" />
          </div>
        </FormCard>
      </draggable>
    </div>
    <div class="Modal__form" v-if="contactInfo.isOpen" @click.stop>
      <TitleGroup text="Contact">
        <IconButton @click.native="closeModal()" />
      </TitleGroup>
      <div class>Email</div>
      <input type="email" class="Input" v-model="contactInfo.email" required />
      <div class>
        Message
        <span>*</span>
      </div>
      <textarea class="Input textarea" cols="30" rows="10" v-model="contactInfo.message" required></textarea>
      <Btn class="full" @click.native="sendMessage()">送信</Btn>
    </div>
    <div class="Modal__form" v-if="dataInfo.isSettings" @click.stop>
      <TitleGroup text="マップ設定">
        <IconButton @click.native="closeModal()" />
      </TitleGroup>
      <div class="Modal__item">
        <div class="Modal__item__title">公開設定（読み取りのみ）</div>
        <ToggleButton
          v-model="dataInfo.public"
          :speed="200"
          :height="24"
          :width="48"
          :sync="true"
          color="#a5d6a7"
        />
      </div>
    </div>
    <Help v-if="dataInfo.isHelp" @click.stop.native />
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/firestore";
import helpers from "@/helpers/helpers";
import draggable from "vuedraggable";
import { ToggleButton } from "vue-js-toggle-button";

import { mapState, mapActions, mapMutations } from "vuex";
import Icon from "@/components/atoms/Icon";
import IconButton from "@/components/atoms/IconButton";
import Btn from "@/components/atoms/Btn";
import TitleGroup from "@/components/atoms/TitleGroup";
import FormCard from "@/components/atoms/FormCard";
import Help from "@/components/atoms/Help";
export default {
  name: "Modal",
  components: {
    draggable,
    ToggleButton,
    Icon,
    IconButton,
    Btn,
    TitleGroup,
    FormCard,
    Help,
  },
  methods: {
    closeModal() {
      this.dataInfo.isSave = false;
      this.dataInfo.isLoad = false;
      this.dataInfo.isAuth = false;
      this.dataInfo.isHelp = false;
      this.dataInfo.isSettings = false;
      this.statusInfo.isEdit = false;
      this.contactInfo.isOpen = false;
    },
    deleteMap(map) {
      if (!confirm(map.title + "：本当に削除しますか？")) return;
      let mapsRef = firebase.firestore().collection("maps");
      mapsRef
        .doc(map.uuid)
        .delete()
        .then(() => {
          console.log("Success delete maps collection", map.uuid);
          console.log(this.userData.latest, map.uuid);
          if (
            this.userData.latest === map.uuid &&
            this.dataInfo.uuid === map.uuid
          )
            this.reset_data(); // deleteItemでlatest消されるのでこちらが先でないと困る
          this.deleteItem(map.uuid);
        })
        .catch((error) => {
          console.log("Error delete maps collection:", error);
        });
    },
    deleteItem(uuid) {
      let usersRef = firebase.firestore().collection("users");
      // itemの削除
      if (this.userData.latest === uuid) this.userData.latest = "";
      for (let i = 0, len = this.userData.items.length; i < len; i++) {
        if (this.userData.items[i].uuid === uuid) {
          this.userData.items.splice(i, 1);
          // 削除したなら更新
          usersRef
            .doc(this.userData.uid)
            .set(this.userData, { merge: true })
            .then(() => {
              console.log(
                "Success update to users collection",
                this.userData.uid
              );
            })
            .catch((error) => {
              console.log("Error update to users collection:", error);
            })
            .then(() => {});
          break;
        }
      }
    },
    modalSaveData(flag) {
      this.saveData(flag)
        .then(() => {
          if (flag === "firebase" && this.$route.path === "/non-id")
            this.$router.replace(this.dataInfo.uuid);
        })
        .catch(() => {
          console.log("保存失敗");
        });
    },
    getAnotherData(uuid) {
      this.dataInfo.isLoading = true;
      // 現在のデータを保存後データをリセット
      if (confirm("現在のマップを保存しますか？")) {
        this.saveData("firebase")
          .then(() => {
            this.getData(uuid);
            this.$router.push(uuid);
          })
          .catch(() => {
            console.log("保存失敗");
          })
          .then(() => {
            this.dataInfo.isLoading = false;
          });
      } else {
        this.getData(uuid);
        this.$router.push(uuid);
      }
    },
    async getData(uuid) {
      console.log("uuid in getData", uuid);
      let mapsRef = firebase.firestore().collection("maps");
      // dataの取得
      if (uuid) {
        this.dataInfo.isLoading = true;
        await mapsRef
          .doc(uuid)
          .get()
          .then((res) => {
            console.log("res", res.data());
            if (res.exists) this.initData(res.data());
            else {
              alert(uuid + "のデータは存在しませんでした。");
              this.deleteItem(uuid);
              this.$router.push("non-id");
            }
          })
          .catch((err) => {
            console.log("err", err);
            alert("マップへのアクセス権がありませんでした。");
            this.$router.push("non-id");
          })
          .then(() => {
            this.dataInfo.isLoading = false;
          });
      }
      this.dataInfo.isLoad = false;
    },
    loadData(flag) {
      this.$store.state.isGraphActive = false;
      var data;
      if (flag) {
        data = JSON.parse(localStorage.getItem("data"));
        if (data === null) {
          alert("データはありませんでした");
          this.dataInfo.isLoad = false;
          return;
        }
        data.uid = null;
        this.initData(data);
      } else {
        var result = event.target.files[0];
        var reader = new FileReader();
        reader.readAsText(result);
        reader.addEventListener("load", () => {
          data = JSON.parse(reader.result);
          data.uid = null;
          this.initData(data);
        });
      }
      this.dataInfo.isLoad = false;
    },
    initData(data) {
      this.updateData(data);
      data.nodes.forEach((item) => {
        item.width_2 = 0;
        item.x = item.free.x * this.scale;
        item.y = item.free.y * this.scale;
      });
      data.relations.forEach((item) => {
        item.base.node = data.nodes.find((x) => x.id === item.base.id);
        item.target.node = data.nodes.find((x) => x.id === item.target.id);
      });
      this.dataInfo.uuid = data.uuid;
      this.dataInfo.title = data.title;
      this.dataInfo.public = data.public;
      this.dataInfo.nodeNum = data.nodeNum;
      this.dataInfo.statusNum = data.statusNum;
      this.dataInfo.tagNum = data.tagNum;
      this.dataInfo.created_at = data.created_at;
      this.dataInfo.updated_at = data.updated_at;
      this.$store.state.nodes = data.nodes;
      this.$store.state.relations = data.relations;
      this.$store.state.statuses = data.statuses;
      this.$store.state.tags = data.tags;
      this.detailsMenu.node = null;
      if (this.$route.params.node_id) {
        console.log("search now", this.$route.params.node_id);
        let node = helpers.searchNode(this.$route.params.node_id);
        // console.log(node);
        if (node) this.$store.dispatch("selectNode", node);
        else {
          this.$router.push("/404");
        }
        this.dataInfo.isLoading = false;
      }
      // width_2の更新
      if (this.$route.name === "id_map" || this.$route.name === "non_id_map") {
        console.log("initData");
        this.$nextTick(() => {
          // width_2の更新
          this.$store.commit("updateNodeWidth_2");
        });
      }
    },
    updateData(data) {
      // 過去のバージョンで足りていないデータを追加
      console.log("updateData", data);
    },
    logout() {
      firebase.auth().signOut();
      this.reset_data();
      if (this.$route.path !== "/non-id") this.$router.push("/non-id");
    },
    sendMessage() {
      if (this.contactInfo.message.length === 0) {
        alert("メッセージは必須項目です");
        return;
      }
      let contactRef = firebase.firestore().collection("contacts");
      this.dataInfo.isLoading = true;
      contactRef
        .doc()
        .set({
          uid: this.userData ? this.userData.uid : "",
          account_email: this.user ? this.user.email : "",
          email: this.contactInfo.email,
          message: this.contactInfo.message,
          sent_at: Date.now(),
        })
        .then(() => {
          console.log("Successful transmission");
          alert("送信完了しました");
          this.contactInfo.message = this.contactInfo.email = "";
          this.closeModal();
        })
        .catch((error) => {
          console.log("Transmission failure:", error);
          alert("送信に失敗しました");
        })
        .then(() => {
          this.dataInfo.isLoading = false;
        });
    },
    ...mapActions(["saveData", "addStatus", "delStatus"]),
    ...mapMutations(["reset_data"]),
  },
  computed: {
    isModalOpen() {
      return (
        this.dataInfo.isSave ||
        this.dataInfo.isLoad ||
        this.dataInfo.isAuth ||
        this.dataInfo.isHelp ||
        this.dataInfo.isSettings ||
        this.statusInfo.isEdit ||
        this.contactInfo.isOpen
      );
    },
    userItems() {
      return this.userData.items.filter(
        (item) => item.uuid !== this.dataInfo.uuid
      );
    },
    statuses: {
      get() {
        return this.$store.state.statuses;
      },
      set(val) {
        this.$store.commit("set_statuses", val);
      },
    },
    ...mapState("auth", [
      "user",
      "userData",
      "isLoggedIn",
      "isAuthStateChanged",
    ]),
    ...mapState([
      "scale",
      "levels",
      "nodes",
      "relations",
      "tags",
      "detailsMenu",
      "dataInfo",
      "statusInfo",
      "addNodeForm",
      "contactInfo",
      "sidebar",
      "editorInfo",
    ]),
  },
  watch: {
    isAuthStateChanged() {
      console.log("params", this.$route.params);
      if (this.$route.params.map_id) this.getData(this.$route.params.map_id);
    },
    userData() {
      if (
        !this.$route.params.map_id &&
        this.isLoggedIn &&
        this.userData.latest
      ) {
        console.log("latest");
        this.$router.push(this.userData.latest);
        this.getData(this.userData.latest);
      }
    },
  },
  created() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        this.modalSaveData("firebase");
      }
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        this.sidebar.isOpen = true;
        this.$nextTick(() => {
          document.querySelector(".Sidebar__search input").focus();
        });
      }
      if (e.ctrlKey && e.key === " " && this.detailsMenu.node) {
        e.preventDefault();
        this.editorInfo.isOpen = !this.editorInfo.isOpen;
      }
    });
  },
};
</script>

<style lang="scss">
@import "@/assets/variable.scss";
.Modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(27, 31, 35, 0.5);
  z-index: 300;
  &__form {
    width: 80%;
    max-width: 400px;
    max-height: 80%;
    padding: 8px;
    border-radius: 3px;
    overflow-y: auto;
    background: #fff;
    input[type="file"] {
      display: none;
    }
    > :not(:last-child) {
      margin-bottom: 8px;
    }
  }
  &__list {
    max-height: calc(100% - 224px); //データベース以外を引いてる
    overflow: auto;
  }
  &__item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    &__title {
    }
  }
  &__not-found {
    text-align: center;
    margin-bottom: 8px;
  }
  &__status__handle {
    cursor: move;
  }
}
</style>