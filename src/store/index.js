import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import helpers from "../helpers/helpers.js";
import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
      nodeNum: 0,
      statusNum: 4,
      tagNum: 9,
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
    },
    editorInfo: {
      isOpen: false,
      isEditPage: false,
      ref: null,
      option: {
        theme: "snow",
        placeholder: "入力する",
        modules: {
          toolbar: "#toolbar"
        }
      }
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
    }
  },
  mutations: {
    set_isMakingRelation: (state, val) => (state.isMakingRelation = val),
    set_detailsMenu: (state, val) => (state.detailsMenu = val),
    reset_data: (state) => {
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
        nodeNum: 0,
        statusNum: 4,
        tagNum: 9,
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
      }
      state.editorInfo = {
        isOpen: false,
        isEditPage: false,
        option: {
          theme: "snow",
          placeholder: "入力する",
          modules: {
            toolbar: "#toolbar"
          }
        }
      }
      state.sidebar = {
        isOpen: true
      }
    },
    closeContextMenu(state) {
      state.contextMenu.isOpen = false;
      state.contextMenu.node = null;
    },
    closeAddNodeForm(state) {
      state.addNodeForm.isFree = false;
      state.addNodeForm.isCircle = false;
      state.addNodeForm.isTree = false;
      state.addNodeForm.isCard = false;
      state.addNodeForm.isRelation = false;
      state.addNodeForm.level = 0;
      state.addNodeForm.status = 0;
      state.addNodeForm.title = "";
      state.addNodeForm.pie = 0;
      state.addNodeForm.x = 0;
      state.addNodeForm.y = 0;
    },
    graphArea(state) {
      // console.log('graphArea')
      var area = document.getElementById("app");
      // this.$ref使えるくね？ TODO
      state.width = area.clientWidth;
      state.height = area.clientHeight;
      state.maxR =
        state.width > state.height ? state.height / 2 : state.width / 2;
      // Objectに対してkeyでアクセスするほうが早いんやろか？
      state.isGraphActive = true; // svgのpathが正しく描画されるように
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
          x: state.addNodeForm.x,
          y: state.addNodeForm.y,
          isActive: state.addNodeForm.isFree,
        },
      });
      // console.log('addNode')
      dispatch("selectNode", state.nodes[state.nodes.length - 1]);
      commit("closeAddNodeForm");
      setTimeout(() => {
        // console.log(document.getElementById(id).clientWidth)
        state.nodes[state.nodes.length - 1].width_2 = document.getElementById(id).clientWidth / 2;
      }, 100);
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
    delRelation(context, payload) {
      /**
       * 使われている場所
       *  GraphFree
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
  },
  modules: {
    auth: auth
  }
});
