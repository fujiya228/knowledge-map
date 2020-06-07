import store from "../store/"

const state = store.state
const Offset = new Date().getTimezoneOffset() * 60; // -9時間（秒単位）

const deep = function (data) {
  return JSON.parse(JSON.stringify(data))
}

const levelsR = function (level) {
  let R = ((state.maxR - 24) / (state.levels.length - 1)) * level;
  return R > 0 ? R : 0;
}
const levelsH = function (level) {
  let H = state.height - ((state.height - 64) / (state.levels.length - 1)) * (state.levels.length - level) - 32;
  return H > 0 ? H : 0;
}
const nodeX = function (level, pie) {
  return state.maxR - state.levels[level].R * Math.cos(pie);
}
const nodeY = function (level, pie) {
  return state.maxR - state.levels[level].R * Math.sin(pie);
}

const calcAngleDegrees = function (x, y) {
  return Math.atan2(y, x) + 3 * Math.PI; // PIだけでも良かったけどグラフの種類を増やす際に、0で非表示にするために更に1周させた
}


const checkDeadline = function (deadline) {
  let Deadline = new Date(deadline);
  let time = new Date(deadline) / 1000;
  let level;
  let check;
  let elapsed = time + Offset - Math.floor(Date.now() / 1000);
  // 期限を過ぎている
  level = 2;
  if (elapsed < 0) return { level: level, text: "期限切れ" };
  // 非表示（4日以上前）
  check = elapsed / 86400;
  level = 0;
  if (check >= 4) return {
    level: level,
    text: Deadline.getFullYear() + "/" + (Deadline.getMonth() + 1) + "/" + Deadline.getDate()
  };
  // 数日前（3日以内）
  if (check >= 1) return { level: level, text: "あと" + Math.floor(check) + "日" };
  // 数時間
  level = 1;
  check = elapsed / 60;
  if (check >= 60) return { level: level, text: "あと" + Math.floor(check / 60) + "時間" };
  // 数分
  return { level: level, text: "あと" + Math.floor(check) + "分" };
}

const getDeadlineClass = function (card) {
  // こんなのでええんかな？cardの参照は必要なので今回は引数としてゆるす
  // これstyle返したら良くない？クラスを元に検索するとかなら別やけど...
  return {
    over: card.byTheDeadline.level === 2,
    near: card.byTheDeadline.level === 1,
    far: card.byTheDeadline.level === 0,
  }
}

const searchNode = function (id) {
  let length = state.nodes.length
  for (let i = 0; i < length; i++) {
    if (state.nodes[i].id === id) return state.nodes[i]
  }
  // return this.nodes.find(item => item.id === id)
  /**
   * パフォーマンスと可読性の問題になってくるのだろうか？
   * ここらにいいのがあった、もっと調べておきたい
   * https://github.com/dg92/Performance-Analysis-JS
   * https://qiita.com/shibukawa/items/4cae2a1410754d519232
   */
};

const statusColor = function (status) {
  let length = state.statuses.length
  for (let i = 0; i < length; i++) {
    if (state.statuses[i].id === status) return state.statuses[i].color
  }
  // return state.statuses.find(item => item.id === status).color
};

const levelColor = function (level) {
  return 'rgb(' + 255 / 5 * level + ', 100, ' + 255 / 5 * (5 - level) + ')'
};

const tagColor = function (id) {
  let length = state.tags.length;
  for (let i = 0; i < length; i++) {
    if (state.tags[i].id === id) {
      return state.tags[i].color;
    }
  }
}

const searchRelationNodes = function (node) {
  return state.nodes.filter(item => {
    for (let rel in node.relations) {
      if (node.relations[rel].pair_id === item.id) return true;
    }
    return false;
  });
}

const helpers = {
  deep: deep,
  levelsR: levelsR,
  levelsH: levelsH,
  nodeX: nodeX,
  nodeY: nodeY,
  calcAngleDegrees: calcAngleDegrees,
  checkDeadline: checkDeadline,
  getDeadlineClass: getDeadlineClass,
  searchNode: searchNode,
  statusColor: statusColor,
  levelColor: levelColor,
  searchRelationNodes: searchRelationNodes,
  tagColor: tagColor,
}
export default helpers