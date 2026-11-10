/* ============================================================
   電路學期中考模擬卷（使用者 11/10）：範圍 CH11 ～ 14.3
   - 只挑「有電路圖」的題目（Example、Practice、章末 Problem；純文字、波形圖、相量圖的題不收）
   - 不考的節（12.9、12.10、13.8、13.9）和 14.3 之後不收；Review Question 不收
   - 一回 4 題：CH11、CH12、CH13、CH14 各一題；用固定亂數種子分配，每次打開都一樣
   - 卡片都當 Practice（手寫板＋提示／答案／詳解先遮），英文題目在前（考卷是英文）
   輸出 window.__CMID（exbook 題庫，sec = 'r1'…），window.__CMID.rounds = 回數
   載入順序：所有題庫 → story.js、ch11-ex-story.js、prob-story.js → 本檔 → exbook.js
   ============================================================ */
(function () {
  'use strict';
  const CH = { 11: ['__CH11PB', '__CH11EX'], 12: ['__CH12PB', '__CH12EX'], 13: ['__CH13PB', '__CH13EX'], 14: ['__CH14PB', '__CH14EX'] };
  const SKIP = /^(12\.9|12\.10|13\.8|13\.9)$/;
  /* 電路元件的筆畫：電阻鋸齒、線圈半圓、電容兩槓、阻抗方塊 */
  const CKT = /L3\.33 |a[\d.]+ [\d.]+ 0 0 [01] |x1="17"|width="32" height="16"/;
  const ROUNDS = 10;

  const secOk = (c, s) => { s = String(s || ''); if (SKIP.test(s)) return false; if (c === 14) return /^14\.[123]$/.test(s); return s.indexOf(String(c)) === 0; };
  const label = (c, it) => it.tag || ((it.kind === 'ex' ? 'Example ' : 'Practice Problem ') + it.no);

  function pool(c) {
    const out = [], seen = {};
    CH[c].forEach(b => {
      const B = window[b]; if (!B || !B.items) return;
      B.items.forEach(it => {
        if (seen[it.id] || !it.fig || !CKT.test(it.fig) || !it.ans || !(it.steps && it.steps.length)) return;
        if (/Review/.test(it.tag || '') || !secOk(c, it.sec)) return;
        seen[it.id] = 1; out.push(it);
      });
    });
    return out;
  }
  /* 固定種子的洗牌 */
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  const items = [], stat = {};
  [11, 12, 13, 14].forEach(c => {
    const p = shuffle(pool(c), rng(1110 + c));
    stat[c] = p.length;
    for (let r = 1; r <= ROUNDS && p.length; r++) {
      const it = p[(r - 1) % p.length];
      items.push(Object.assign({}, it, {
        id: 'mk' + r + '-' + it.id, sec: 'r' + r, kind: 'pp',
        tag: 'CH' + c + ' · ' + label(c, it) + (it.kind === 'ex' ? '（講義寫過）' : ''),
        hint: it.hint || it.idea || '', story: it.story
      }));
    }
  });
  window.__CMID = { book: 'Alexander & Sadiku', name: 'cmid', enFirst: true, items, rounds: ROUNDS, pool: stat };
})();
