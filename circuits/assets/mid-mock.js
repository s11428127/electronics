/* ============================================================
   電路學期中考模擬卷（使用者 11/10 → 11/11 改版）：範圍 CH11 ～ 14.3（到 The Decibel Scale）
   v2（11/11）：只出課本章末 Problems（Review Question 不出、講義 Example／Practice 不出），
   一回 4 題（CH11、12、13、14 各一），10 回輪完每一種題型都練到：
   - 依 chN-types.js 的題型順序輪流出（第 r 回出第 (r−1) mod n 型），同一型第二輪換下一題
   - 不考的 12.9、12.10、13.8、13.9 排除（兩瓦特計那型拿掉）
   - 卡片一律當 Practice、英文先；章末題有題型故事的逐步圖解（chN-tyfig.js 的 wk）就掛到「🎬 圖解詳解」
   載入順序：PB 題庫 → story.js、prob-story.js、types-story.js、chN-types.js、chN-tyfig.js → 本檔 → exbook.js
   ============================================================ */
(function () {
  'use strict';
  const SKIP = /^(12\.9|12\.10|13\.8|13\.9)$/;
  const ROUNDS = 10;
  const items = [], cover = {};

  [11, 12, 13, 14].forEach(c => {
    const B = window['__CH' + c + 'PB'], TD = window['__TYPES' + c];
    if (!B || !TD) return;
    /* 有題型故事的章末題：把每步換圖的版本掛上去 */
    if (window.__TY && window.__TY.attach) window.__TY.attach('__CH' + c + 'PB', TD.types.map(t => t.wk).filter(Boolean));
    const byNo = {};
    B.items.forEach(it => { const m = /^Problem (\d+\.\d+)$/.exec(it.tag || ''); if (m && !SKIP.test(String(it.sec)) && it.ans) byNo[m[1]] = it; });
    const types = TD.types.filter(t => !SKIP.test(String(t.sec).split('–')[0]) && t.ex.some(n => byNo[n]));
    const used = {}, ptr = types.map(() => 0);
    cover[c] = types.length;
    for (let r = 1; r <= ROUNDS; r++) {
      const ti = (r - 1) % types.length, t = types[ti], list = t.ex.filter(n => byNo[n]);
      /* 這一型還沒出過的題先出；出完了才重複 */
      let n = list.find(x => !used[x]);
      if (!n) { n = list[ptr[ti] % list.length]; ptr[ti]++; }
      used[n] = 1;
      const it = byNo[n];
      items.push(Object.assign({}, it, {
        id: 'mk' + r + '-' + it.id, sec: 'r' + r, kind: 'pp',
        tag: 'CH' + c + ' · ' + it.tag + ' · ' + t.n, story: it.story
      }));
    }
  });
  window.__CMID = { book: 'Alexander & Sadiku', name: 'cmid2', enFirst: true, items, rounds: ROUNDS, cover };
})();
