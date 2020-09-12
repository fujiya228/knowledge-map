import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import helpers from "../helpers/helpers.js";

import * as firebase from "firebase/app";
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scale: 1,
    width: 0,
    height: 0,
    maxR: 0,
    isMakingRelation: false,
    statuses: [
      {
        id: 0,
        title: "status_1",
        color: "#FFE082",
        listForm: {
          isOpen: false,
        },
      },
      {
        id: 1,
        title: "status_2",
        color: "#B0BEC5",
        listForm: {
          isOpen: false,
        },
      },
      {
        id: 2,
        title: "status_3",
        color: "#A5D6A7",
        listForm: {
          isOpen: false,
        },
      },
      {
        id: 3,
        title: "status_4",
        color: "#81D4FA",
        listForm: {
          isOpen: false,
        },
      },
    ],
    tags: [
      {
        id: 0,
        title: "",
        color: "#E91E63",
        description: "",
        isActive: false,
      },
      {
        id: 1,
        title: "",
        color: "#FF5722",
        description: "",
        isActive: false,
      },
      {
        id: 2,
        title: "",
        color: "#FFC107",
        description: "",
        isActive: false,
      },
      {
        id: 3,
        title: "",
        color: "#CDDC39",
        description: "",
        isActive: false,
      },
      {
        id: 4,
        title: "",
        color: "#4CAF50",
        description: "",
        isActive: false,
      },
      {
        id: 5,
        title: "",
        color: "#00BCD4",
        description: "",
        isActive: false,
      },
      {
        id: 6,
        title: "",
        color: "#2196F3",
        description: "",
        isActive: false,
      },
      {
        id: 7,
        title: "",
        color: "#673AB7",
        description: "",
        isActive: false,
      },
      {
        id: 8,
        title: "",
        color: "#607D8B",
        description: "",
        isActive: false,
      },
    ],
    nodes: [],
    relations: [],
    moveNodeInfo: {
      isOn: false,
      id: -1,
      Lv: 0,
      beforeLv: -1, // nodeMove前のレベル数、つまりはレベル上げ判定の基準
      status: -1,
      target: null,
      x: 0,
      y: 0,
    },
    dataInfo: {
      isSave: false,
      isLoad: false,
      isAuth: false,
      isHelp: false,
      isSettings: false,
      isMapSaving: false,
      isUserSaving: false,
      isCreating: false,
      isLoading: false,
      runningText: "保存中...",
      uid: undefined,
      uuid: undefined,
      title: "untitled",
      publicRead: false,
      nodeNum: 0,
      statusNum: 4,
      tagNum: 9,
      created_at: undefined,
      updated_at: undefined,
    },
    statusInfo: {
      isAdd: false,
      isEdit: false,
      title: '',
      color: "#000000"
    },
    addNodeForm: {
      isFree: false,
      isCircle: false,
      isTree: false,
      isCard: false,
      isRelation: false,
      status: 0,
      x: 0,
      y: 0,
      title: "",
      level: 0,
      pie: 0,
    },
    contextMenu: {
      isOpen: false,
      flag_x: false,
      flag_y: false,
      isStatus: false,
      x: 0,
      y: 0,
      node: null,
    },
    detailsMenu: {
      isOpen: false,
      isTagForm: false, // 編集中確認用
      nodeId: null,
      node: null,
      relations: [],
      unrelated: []
    },
    editorInfo: {
      isOpen: false,
      isEditPage: false,
      isRelationOpen: false,
      isEditorOpen: true,
      isPreviewOpen: false,
      ref: null,
      option: {
        theme: "snow",
        // theme: "bubble",
        placeholder: "入力する",
        modules: {
          toolbar: "#toolbar",
          // toolbar: [['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['link', 'image'], ['clean']],
          clipboard: {
            matchVisual: false
          },
          markdownShortcuts: {}
        }
      }
    },
    contactInfo: {
      isOpen: false,
      email: "",
      message: "",
    },
    sidebar: {
      isOpen: true
    },
  },
  getters: {
    isDetailsOpen(state) {
      return (
        !!state.detailsMenu.node && state.detailsMenu.isOpen
        // state.moveNodeInfo.id === -1
        // 各Move系がスタートしたときにisOpen = false にすればええ？
      );
    },
    sidebar_width(state) {
      return state.sidebar.isOpen ? 256 : 0;
    },
    isEditableMap(state) {
      let uid = state.auth.user ? state.auth.user.uid : false;
      return uid === state.dataInfo.uid
    }
  },
  mutations: {
    set_scale: (state, val) => (state.scale = val),
    set_isMakingRelation: (state, val) => (state.isMakingRelation = val),
    set_detailsMenu: (state, val) => (state.detailsMenu = val),
    set_statuses: (state, val) => (state.statuses = val),
    reset_data: (state) => {
      console.log('reset_data')
      state.scale = 1
      state.width = 0
      state.height = 0
      state.maxR = 0
      state.isMakingRelation = false
      state.statuses = [
        {
          id: 0,
          title: "status_1",
          color: "#FFE082",
          listForm: {
            isOpen: false,
          },
        },
        {
          id: 1,
          title: "status_2",
          color: "#B0BEC5",
          listForm: {
            isOpen: false,
          },
        },
        {
          id: 2,
          title: "status_3",
          color: "#A5D6A7",
          listForm: {
            isOpen: false,
          },
        },
        {
          id: 3,
          title: "status_4",
          color: "#81D4FA",
          listForm: {
            isOpen: false,
          },
        },
      ]
      state.tags = [
        {
          id: 0,
          title: "",
          color: "#E91E63",
          description: "",
          isActive: false,
        },
        {
          id: 1,
          title: "",
          color: "#FF5722",
          description: "",
          isActive: false,
        },
        {
          id: 2,
          title: "",
          color: "#FFC107",
          description: "",
          isActive: false,
        },
        {
          id: 3,
          title: "",
          color: "#CDDC39",
          description: "",
          isActive: false,
        },
        {
          id: 4,
          title: "",
          color: "#4CAF50",
          description: "",
          isActive: false,
        },
        {
          id: 5,
          title: "",
          color: "#00BCD4",
          description: "",
          isActive: false,
        },
        {
          id: 6,
          title: "",
          color: "#2196F3",
          description: "",
          isActive: false,
        },
        {
          id: 7,
          title: "",
          color: "#673AB7",
          description: "",
          isActive: false,
        },
        {
          id: 8,
          title: "",
          color: "#607D8B",
          description: "",
          isActive: false,
        },
      ]
      state.nodes = []
      state.relations = []
      state.moveNodeInfo = {
        isOn: false,
        id: -1,
        Lv: 0,
        beforeLv: -1, // nodeMove前のレベル数、つまりはレベル上げ判定の基準
        status: -1,
        target: null,
        x: 0,
        y: 0,
      }
      state.dataInfo = {
        isSave: false,
        isLoad: false,
        isAuth: false,
        isHelp: false,
        isSettings: false,
        isMapSaving: false,
        isUserSaving: false,
        isCreating: false,
        isLoading: false,
        runningText: "保存中...",
        uid: undefined,
        uuid: undefined,
        title: "untitled",
        publicRead: false,
        nodeNum: 0,
        statusNum: 4,
        tagNum: 9,
        created_at: undefined,
        updated_at: undefined,
      }
      state.statusInfo = {
        isAdd: false,
        isEdit: false,
        title: '',
        color: "#000000"
      }
      state.addNodeForm = {
        isFree: false,
        isCircle: false,
        isTree: false,
        isCard: false,
        isRelation: false,
        status: 0,
        x: 0,
        y: 0,
        title: "",
        level: 0,
        pie: 0,
      }
      state.contextMenu = {
        isOpen: false,
        flag_x: false,
        flag_y: false,
        isStatus: false,
        x: 0,
        y: 0,
        node: null,
      }
      state.detailsMenu = {
        isOpen: false,
        isTagForm: false, // 編集中確認用
        nodeId: null,
        node: null,
        relations: [],
        unrelated: []
      }
      state.editorInfo = {
        isOpen: false,
        isEditPage: false,
        isRelationOpen: false,
        isEditorOpen: true,
        isPreviewOpen: false,
        ref: null,
        option: {
          theme: "snow",
          // theme: "bubble",
          placeholder: "入力する",
          modules: {
            toolbar: "#toolbar",
            // toolbar: [['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['link', 'image'], ['clean']],
            clipboard: {
              matchVisual: false
            },
            markdownShortcuts: {}
          }
        }
      }
      state.sidebar = {
        isOpen: true
      }
    },
    closeContextMenu(state) {
      state.contextMenu.isOpen = false;
      state.contextMenu.isStatus = false;
      state.contextMenu.node = null;
    },
    closeAddNodeForm(state) {
      state.addNodeForm.isFree = false;
      state.addNodeForm.isCircle = false;
      state.addNodeForm.isTree = false;
      state.addNodeForm.isCard = false;
      state.addNodeForm.isRelation = false;
      state.addNodeForm.level = 0;
      state.addNodeForm.status = state.statuses[0].id;
      state.addNodeForm.title = "";
      state.addNodeForm.pie = 0;
      state.addNodeForm.x = 0;
      state.addNodeForm.y = 0;
    },
    graphArea(state) {
      // console.log('graphArea')
      var area = document.getElementById("app");
      state.width = area.clientWidth;
      state.height = area.clientHeight;
      state.maxR =
        state.width > state.height ? state.height / 2 : state.width / 2;
      // Objectに対してkeyでアクセスするほうが早いんやろか？
      state.isGraphActive = true; // svgのpathが正しく描画されるように
    },
    resizeGraph(state, abs) {
      let type = "free";
      let before_scale = state.scale * 1;
      let min = 0.5;
      abs === "reset" ? (state.scale = 1) : (state.scale += 0.1 * abs);
      // state.scale = Math.round((state.scale + 0.1 * abs) * 100) / 100;
      if (state.scale < min) {
        state.scale = min;
        return;
      }
      // scroll量の再計算
      let MapFree = document.getElementById("MapFree");
      MapFree.scrollLeft *= state.scale / before_scale;
      MapFree.scrollTop *= state.scale / before_scale;
      // reLocation
      let len = state.nodes.length;
      for (let i = 0; i < len; i++) {
        state.nodes[i].x = state.nodes[i][type].x * state.scale;
        state.nodes[i].y = state.nodes[i][type].y * state.scale;
      }
    },
    updateNodeWidth_2(state) {
      let len = state.nodes.length;
      for (let i = 0; i < len; i++) {
        state.nodes[i].width_2 =
          document.getElementById(state.nodes[i].id).clientWidth / 2;
      }
    },
    saveTag(state) {
      // 編集中だった場合のみ保存作業
      if (!state.detailsMenu.isTagForm || !state.detailsMenu.node) return;
      state.detailsMenu.node.tags = [];
      state.detailsMenu.isTagForm = false;
      state.tags.forEach((item) => {
        if (item.isActive) {
          state.detailsMenu.node.tags.push(item.id);
          item.isActive = false;
        }
      });
    },
    makeRelation(state, payload) {
      // 同じであれば排除
      if (payload.base.id === payload.target.id) return;
      let relationId = payload.base.id + "_" + payload.target.id
      // すでにあったらreturn
      if (relationId in payload.base.relations) return;
      // 逆もすでにあったらreturn
      if (payload.target.id + "_" + payload.base.id in payload.base.relations) return;
      state.relations.push({
        id: relationId,
        base: {
          id: payload.base.id,
          node: payload.base,
        },
        target: {
          id: payload.target.id,
          node: payload.target,
        },
      });
      // relationsプロパティが配列の場合
      // payload.base.relations.push({id:payload.base.id + '_' + payload.target.id,pair_id:payload.target.id})
      // payload.target.relations.push({id:payload.base.id + '_' + payload.target.id,pair_id:payload.base.id})

      // relationsプロパティがObjectの場合
      payload.base.relations[relationId] = {
        pair_id: payload.target.id,
      };
      payload.target.relations[relationId] = {
        pair_id: payload.base.id,
      };
    },
    afterSaveError(state) {
      state.dataInfo.runningText = "保存に失敗しました";
      setTimeout(() => {
        state.dataInfo.isUserSaving = false;
        state.dataInfo.isMapSaving = false;
        state.dataInfo.runningText = "保存中...";
      }, 3000);
    }
  },
  actions: {
    addNode({ state, commit, dispatch }) {
      if (state.addNodeForm.title === "") return;
      // var offset = new Date().getTimezoneOffset() * 60 // -9時間（秒単位）
      let now = Math.floor(Date.now() / 1000);
      // console.log(new Date(now*1000).toISOString())
      // console.log(deadline)
      // console.log(helpers.checkDeadline(deadline))
      let id = uuidv4();
      state.nodes.push({
        id: id,
        archive: false,
        isSelect: false,
        status: state.addNodeForm.status,
        title: state.addNodeForm.title,
        detail: "",
        created_at: now,
        updated_at: now,
        relations: {},
        tags: [],
        width_2: 32,
        x: state.addNodeForm.x,
        y: state.addNodeForm.y,
        free: {
          x: state.addNodeForm.x / state.scale,
          y: state.addNodeForm.y / state.scale,
          isActive: state.addNodeForm.isFree,
        },
      });
      // console.log('addNode')
      dispatch("selectNode", state.nodes[state.nodes.length - 1]);
      commit("closeAddNodeForm");
      // setTimeout(() => {
      //   document.querySelector(".Details__detail > .Textarea").focus();
      // }, 100);
      // iOS 12はまだ0または1のセットでは機能しないため、setTimeout（cb、100）を設定します。
      // https://github.com/vuejs/vuex/issues/1023
    },
    delNode(context, node) {
      // TODO 本当に消すか？を無視する設定？
      // TODO 消すのは聞かずに消したあとに操作を戻す機能？
      if (!confirm("要素と関連付けの削除：本当に削除しますか？")) return;
      for (let rel in node.relations) {
        // このrelationsはObject
        context.dispatch("delRelation", {
          relId: rel,
          force: true
        });
      }
      // 配列からidをもとにindexを取ってくる関数を作れるな TODO findでよくね
      let length = context.state.nodes.length;
      for (let i = 0; i < length; i++) {
        if (context.state.nodes[i].id === node.id) {
          context.state.nodes.splice(i, 1);
          break;
        }
      }
      context.commit("closeContextMenu");
      context.commit("closeAddNodeForm");
      context.state.detailsMenu.node = null;
    },
    addStatus({ state }) {
      if (state.statuses.length >= 10) {
        alert('10個以上は作成できません。')
        return;
      }
      state.statuses.push({
        id: uuidv4(),
        title: state.statusInfo.title,
        color: state.statusInfo.color,
      });
      state.dataInfo.statusNum = state.statuses.length
      state.statusInfo.title = "";
      state.statusInfo.color = "#000000";
    },
    delStatus({ state }, id) {
      // TODO 消すのは聞かずに消したあとに操作を戻す機能？
      if (state.statuses.length <= 1) {
        alert('すべてのステータスを削除することはできません。')
        return;
      }
      let len = state.nodes.length
      let text = "本当に削除しますか？"
      for (let i = 0; i < len; i++) {
        if (state.nodes[i].status === id) {
          text = "対象のステータスをもつ要素があります。削除しますか？"
          break
        }
      }
      if (!confirm("ステータスの削除:" + text)) return;
      // 配列からidをもとにindexを取ってくる関数を作れるな TODO findでよくね
      let length = state.statuses.length;
      for (let i = 0; i < length; i++) {
        if (state.statuses[i].id === id) {
          state.statuses.splice(i, 1);
          break;
        }
      }
    },
    delRelation(context, payload) {
      /**
       * 使われている場所
       *  MapFree
       *  Editor
       * 
       * delNode
       */
      if (!payload.force && !confirm("関連付け削除：本当に削除しますか？")) return;
      let rel = context.state.relations.find((rel) => rel.id === payload.relId);
      let length;
      let base = context.state.nodes.find((node) => node.id === rel.base.id);
      let target = context.state.nodes.find(
        (node) => node.id === rel.target.id
      );
      // console.log(base.relations)
      // Objectでやるとこういう消し方ができて楽でいい、が後でこのrelationsをたどるときに繰り返しだるそう→lodash?
      delete base.relations[rel.id];
      delete target.relations[rel.id];
      length = context.state.relations.length;
      for (let i = 0; i < length; i++) {
        if (context.state.relations[i].id === rel.id) {
          context.state.relations.splice(i, 1); // relationsからの削除
          break;
        }
      }
      // detailsMenuを更新
      if (context.state.detailsMenu.node)
        context.dispatch("selectNode", context.state.detailsMenu.node);
    },
    selectNode({ commit, state }, node) {
      commit("saveTag"); // tagInfoくらい作ってisEditingてきなので解す減らしたい
      state.detailsMenu.nodeId = node.id;
      state.detailsMenu.node = state.nodes.find((item) => item.id === node.id);
      state.detailsMenu.relations = helpers.searchRelationNodes(node)
      state.detailsMenu.unrelated = helpers.searchRelationNodes(node, false)
      state.detailsMenu.isOpen = true;
    },
    saveData({ state }, flag) {
      if (state.dataInfo.isMapSaving || state.dataInfo.isUserSaving) return;
      if (state.dataInfo.title === "") {
        alert("タイトルを入力してください");
        return;
      }
      if (flag === 'firebase' && !state.auth.isLoggedIn) {
        alert('ログインしてください')
        return;
      }
      // 更新日時を設定
      state.dataInfo.updated_at = Date(Date.now())
      if (state.dataInfo.created_at === undefined) state.dataInfo.created_at = state.dataInfo.updated_at
      // firebaseのときにはuuidを必要とする
      console.log('uuid', state.dataInfo.uuid)
      if (flag === "firebase" && !state.auth.userData.paid) {
        console.log(state.auth.userData)
        if (state.auth.userData.items.length >= 3 && state.dataInfo.uuid === undefined) {
          alert('現状、マップの保存を３個に制限しています。今後、上限を増やしたり、条件を設けて開放する予定です。ご了承ください。')
          return;
        }
      }
      if (flag === "firebase" && state.dataInfo.uuid === undefined) {
        state.dataInfo.uuid = uuidv4();
        state.auth.userData.latest = state.dataInfo.uuid
        state.auth.userData.items.push({
          uuid: state.dataInfo.uuid,
          title: state.dataInfo.title,
          updated_at: state.dataInfo.updated_at
        })
      }
      else if (flag === 'firebase') {
        let item = state.auth.userData.items.find(item => item.uuid === state.dataInfo.uuid)
        if (!item) {
          console.log('listにありませんでした')
          return; // 自分のもので無い場合は排除 TODO<=これって共有で編集権限ある場合には保存できんくてまずいからなんとかしてくれ
        }
        item.title = state.dataInfo.title
        item.updated_at = state.dataInfo.updated_at
        state.auth.userData.latest = state.dataInfo.uuid
        state.auth.userData.updated_at = state.dataInfo.updated_at
      }
      // dataの加工
      let data = {
        uid: state.auth.userData.uid,
        uuid: state.dataInfo.uuid,
        title: state.dataInfo.title,
        publicRead: state.dataInfo.publicRead,
        nodeNum: state.dataInfo.nodeNum,
        statusNum: state.dataInfo.statusNum,
        tagNum: state.dataInfo.tagNum,
        created_at: state.dataInfo.created_at,
        updated_at: state.dataInfo.updated_at,
        nodes: helpers.deep(state.nodes),
        relations: helpers.deep(state.relations),
        statuses: state.statuses,
        tags: state.tags,
      };
      data.nodes.forEach((item) => {
        delete item.x;
        delete item.y;
        delete item.byTheDeadline;
        delete item.width_2
      });
      data.relations.forEach((item) => {
        delete item.base.node;
        delete item.target.node;
      });
      var obj = JSON.stringify(data);
      // 各種保存
      return new Promise((resolve) => {
        if (flag === 'local') {
          // LocalStorageの場合
          localStorage.setItem("data", obj);
          resolve()
          // console.log('save localStorage')
        }
        if (flag === 'file') {
          // fileの場合
          let fileName = state.dataInfo.title + "_" + Date.now() + ".knowledge-map";
          let link = document.createElement("a");
          link.href = "data:text/json," + encodeURIComponent(obj);
          link.download = fileName;
          link.click();
          link.remove();
          // console.log("save file");
          resolve()
        }
        if (flag === 'firebase') {
          console.log('saveData firebase')
          let mapsRef = firebase.firestore().collection("maps");
          let usersRef = firebase.firestore().collection("users");
          // firestoreに保存
          state.dataInfo.isMapSaving = true
          state.dataInfo.isUserSaving = true
          // ここで作ったPromiseがfirebaseのreject拾ってくれる
          mapsRef
            .doc(state.dataInfo.uuid)
            .set(data, { merge: true })
            .then(() => {
              console.log("Success update to maps collection", state.dataInfo.uuid);
              state.dataInfo.isMapSaving = false
            })
          usersRef
            .doc(state.auth.userData.uid)
            .set(state.auth.userData, { merge: true })
            .then(() => {
              console.log("Success update to users collection", state.auth.userData.uid);
              state.dataInfo.runningText = "保存しました"
              setTimeout(() => {
                state.dataInfo.isUserSaving = false
                state.dataInfo.runningText = "保存中..."
              }, 3000)
              resolve()
            })
        }
        state.dataInfo.isSave = false;
      })
    },
  },
  modules: {
    auth: auth
  }
});
