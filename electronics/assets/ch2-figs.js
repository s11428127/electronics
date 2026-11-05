/* ============================================================
   CH2 電路圖（使用者 11/5：段考範圍都要有電路圖，尤其 CH2）
   - window.__C2F[key]()：回傳 SVG 字串（用 shared/schem.js 畫，線條吃 currentColor）
   - 自動做兩件事：
     1. 每個 CH2 小節在導言後面插一張電路圖（.schem-box）
     2. 把電路圖掛到 CH2 的題目（練習 exbook、填充 hw.js、衝刺頁、HW3）上（題目沒有圖的才掛）
   載入：schem.js 之後、DOMContentLoaded 之前（放在 exbook.js 後面即可）
   接法都照老師板書：二極體尖端＝陰極；電池長線＝正極
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH; if (!S) return;
  const L = (x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
  const T = (x, y, s, a) => S.t(x, y, s, a || 'middle');
  /* 垂直電池：plusTop = 正極在上（長線在上） */
  function bat(x, y1, y2, label, plusTop, side) {
    const cy = (y1 + y2) / 2, a = plusTop ? cy - 4 : cy + 4, b = plusTop ? cy + 4 : cy - 4;
    return L(x, y1, x, Math.min(a, b)) + L(x, Math.max(a, b), x, y2) +
      L(x - 12, a, x + 12, a) + '<line x1="' + (x - 6) + '" y1="' + b + '" x2="' + (x + 6) + '" y2="' + b + '" stroke-width="3"/>' +
      T(x + 16, plusTop ? a - 2 : a + 12, '+', 'start') + (label ? T(side === 'l' ? x - 16 : x + 26, cy + 4, label, side === 'l' ? 'end' : 'start') : '');
  }
  /* 水平電池：plusLeft = 正極在左 */
  function batH(x1, x2, y, label, plusLeft) {
    const cx = (x1 + x2) / 2, a = plusLeft ? cx - 4 : cx + 4, b = plusLeft ? cx + 4 : cx - 4;
    return L(x1, y, Math.min(a, b), y) + L(Math.max(a, b), y, x2, y) +
      L(a, y - 12, a, y + 12) + '<line x1="' + b + '" y1="' + (y - 6) + '" x2="' + b + '" y2="' + (y + 6) + '" stroke-width="3"/>' +
      T(a + (plusLeft ? -8 : 8), y - 14, '+') + (label ? T(cx, y + 26, label) : '');
  }
  const out = (x, yt, yb) => S.term(x, yt) + S.term(x, yb) + T(x + 6, (yt + yb) / 2 + 4, 'v_O', 'start') + T(x, yt - 8, '+') + T(x, yb + 16, '−');
  const coilV = (x, y1, y2, dir) => { let d = 'M' + x + ' ' + y1; const n = Math.round((y2 - y1) / 10); for (let i = 0; i < n; i++) d += ' a5 5 0 0 ' + (dir > 0 ? 1 : 0) + ' 0 10'; return '<path d="' + d + '" fill="none"/>'; };

  const F = {
    /* 半波整流（Fig 2.2）：v_S → D → R */
    hwr: () => S.svg(280, 150, [S.vac(30, 20, 130, 'v_S'), S.w('30,20', '70,20'), S.d(70, 20, 150, 20, 'D'), S.w('150,20', '210,20'), S.r(210, 20, 210, 130, 'R'), S.w('210,130', '30,130'), S.w('210,20', '250,20'), S.w('210,130', '250,130'), out(250, 20, 130)]),
    /* 變壓器＋半波 */
    hwrT: () => S.svg(330, 150, [S.vac(30, 20, 130, 'v_I'), S.w('30,20', '60,20'), S.w('30,130', '60,130'), coilV(60, 25, 125, -1), L(60, 20, 60, 25), L(60, 125, 60, 130), L(77, 20, 77, 130), L(83, 20, 83, 130), coilV(100, 25, 125, 1), L(100, 20, 100, 25), L(100, 125, 100, 130), T(56, 14, 'N_1', 'end'), T(104, 14, 'N_2', 'start'), T(112, 80, 'v_S', 'start'),
      S.w('100,20', '140,20'), S.d(140, 20, 210, 20, 'D'), S.w('210,20', '260,20'), S.r(260, 20, 260, 130, 'R'), S.w('260,130', '100,130'), S.w('260,20', '295,20'), S.w('260,130', '295,130'), out(295, 20, 130)]),
    /* 電池充電器：v_S → D → R → V_B */
    chg: () => S.svg(300, 150, [S.vac(30, 20, 130, 'v_S'), S.w('30,20', '60,20'), S.d(60, 20, 130, 20, 'D'), S.r(130, 20, 210, 20, 'R'), S.w('210,20', '250,20'), bat(250, 20, 130, 'V_B', true), S.w('250,130', '30,130'),
      '<polyline points="160,40 190,40" fill="none"/><polyline points="184,36 190,40 184,44" fill="none"/>', T(175, 56, 'i_D')]),
    /* 中間抽頭全波整流 */
    ct: () => S.svg(320, 160, [S.vac(30, 25, 125, 'v_I'), S.w('30,25', '50,25'), S.w('30,125', '50,125'), coilV(50, 30, 120, -1), L(50, 25, 50, 30), L(50, 120, 50, 125), L(67, 20, 67, 130), L(73, 20, 73, 130),
      coilV(90, 25, 65, 1), coilV(90, 85, 125, 1), L(90, 20, 90, 25), L(90, 65, 90, 85), L(90, 125, 90, 130), T(98, 50, 'v_S', 'start'), T(98, 110, 'v_S', 'start'),
      S.w('90,20', '120,20'), S.d(120, 20, 190, 20, 'D_1'), S.w('190,20', '270,20'),
      S.w('90,130', '120,130'), S.d(120, 130, 190, 130, 'D_2', { side: 'b' }), S.w('190,130', '220,130', '220,20'), S.dot(220, 20),
      S.w('90,75', '270,75'), S.dot(90, 75), T(150, 70, '中間抽頭'), S.r(270, 20, 270, 75, 'R'), S.w('270,20', '300,20'), S.w('270,75', '300,75'), out(300, 20, 75)]),
    /* 橋式全波整流：v_S 接左右角，R 接上下角 */
    bridge: () => S.svg(330, 190, [S.vac(30, 70, 160, 'v_S'), S.w('30,70', '100,70'), S.w('30,160', '230,160', '230,70', '200,70'),
      S.d(100, 70, 150, 20), S.d(150, 120, 200, 70), S.d(200, 70, 150, 20), S.d(150, 120, 100, 70),
      T(112, 38, 'D_1', 'end'), T(188, 108, 'D_2', 'start'), T(188, 38, 'D_3', 'start'), T(112, 108, 'D_4', 'end'),
      S.dot(100, 70), S.dot(200, 70), S.dot(150, 20), S.dot(150, 120),
      S.w('150,20', '280,20'), S.r(280, 20, 280, 140, 'R'), S.w('150,120', '150,140', '280,140'), S.w('280,20', '310,20'), S.w('280,140', '310,140'), out(310, 20, 140)]),
    /* 並聯（基本）截波：D 尖端朝下，電池 + 在上 */
    shunt: () => clip(t => S.d(150, 20, 150, 75, 'D', { side: 'l' }) + bat(150, 75, 140, 'V_B', true)),
    ref1: () => clip(t => S.d(150, 75, 150, 20, 'D', { side: 'l' }) + bat(150, 75, 140, 'V_B', true)),
    ref2: () => clip(t => S.d(150, 20, 150, 75, 'D', { side: 'l' }) + bat(150, 75, 140, 'V_B', false)),
    /* 串聯截波：V_B（+ 在左）→ D（尖端朝左）→ 輸出接 R 到地 */
    series: () => S.svg(300, 150, [S.vac(30, 20, 130, 'v_i'), S.w('30,20', '50,20'), batH(50, 110, 20, 'V_B', true), S.d(180, 20, 110, 20, 'D'), S.w('180,20', '230,20'), S.r(230, 20, 230, 130, 'R'), S.w('230,130', '30,130'), S.w('230,20', '265,20'), S.w('230,130', '265,130'), out(265, 20, 130)]),
    /* 雙向截波 */
    bidir: () => S.svg(320, 160, [S.vac(30, 20, 140, 'v_i'), S.r(30, 20, 120, 20, 'R'), S.w('120,20', '250,20'), S.dot(150, 20), S.dot(220, 20),
      S.d(150, 20, 150, 75, 'D_1', { side: 'l' }), bat(150, 75, 140, 'V_B1', true, 'l'), S.d(220, 75, 220, 20, 'D_2'), bat(220, 75, 140, 'V_B2', false),
      S.w('30,140', '285,140'), S.w('250,20', '285,20'), out(285, 20, 140)]),
    /* 雙向截波變形：D1 支路多串一個 R2（Example 2.7） */
    bidirR2: () => S.svg(330, 200, [S.vac(30, 20, 180, 'v_i'), S.r(30, 20, 120, 20, 'R_1'), S.w('120,20', '260,20'), S.dot(150, 20), S.dot(230, 20),
      S.r(150, 20, 150, 70, 'R_2', { side: 'l' }), S.d(150, 70, 150, 120, 'D_1', { side: 'l' }), bat(150, 120, 180, 'V_B1', true, 'l'), S.d(230, 100, 230, 20, 'D_2'), bat(230, 100, 180, 'V_B2', false),
      S.w('30,180', '295,180'), S.w('260,20', '295,20'), out(295, 20, 180)]),
    /* 箝位器：C 串聯，輸出並 D＋V_B */
    clamp: () => S.svg(300, 162, [S.vac(30, 20, 140, 'v_i'), S.w('30,20', '50,20'), S.c(50, 20, 130, 20, 'C（v_C）'), S.w('130,20', '250,20'), S.dot(170, 20), S.d(170, 20, 170, 75, 'D', { side: 'l' }), bat(170, 75, 140, 'V_B', true), S.w('30,140', '250,140'), out(250, 20, 140)])
  };
  function clip(branch) {
    return S.svg(300, 162, [S.vac(30, 20, 140, 'v_i'), S.r(30, 20, 120, 20, 'R'), S.w('120,20', '240,20'), S.dot(150, 20), branch(), S.w('30,140', '240,140'), out(240, 20, 140)]);
  }
  window.__C2F = F;

  const CAP = { hwr: '半波整流（Fig 2.2）', hwrT: '變壓器＋半波整流', chg: '電池充電器（Example 2.1）', ct: '中間抽頭全波整流', bridge: '橋式全波整流（正半週 D₁、D₂ 通；負半週 D₃、D₄ 通）',
    shunt: '並聯（基本）截波器', ref1: '參考 ①：二極體反接', ref2: '參考 ②：電池反接', series: '串聯截波器', bidir: '雙向截波器', bidirR2: '雙向截波器變形（D₁ 支路多串 R₂，Example 2.7）', clamp: '箝位器' };
  const fig = (k, small) => '<figure class="schem-box c2f' + (small ? ' sm' : '') + '"><div>' + F[k]() + '<figcaption>' + CAP[k] + '</figcaption></div></figure>';
  window.__C2F.fig = fig;

  /* ── 1. 小節電路圖 ── */
  const SEC = { 'ch2-part1': { xfmr: ['hwrT'], hwr: ['hwr'], wave: ['hwr'] }, 'ch2-part2': { chg: ['chg'], fwc: ['ct'], brg: ['bridge'], cmp: ['ct', 'bridge'] },
    'ch2-part3': { shunt: ['shunt', 'ref1', 'ref2'], series: ['series'], bidir: ['bidir', 'bidirR2'], clamp: ['clamp'] } };
  const page = (location.pathname.split('/').pop() || '').replace('.html', '');
  if (SEC[page]) Object.keys(SEC[page]).forEach(id => {
    const sec = document.getElementById(id); if (!sec) return;
    const lede = sec.querySelector(':scope > .lede'); if (!lede || sec.querySelector('.c2f-row')) return;
    const row = document.createElement('div'); row.className = 'c2f-row';
    row.innerHTML = SEC[page][id].map(k => fig(k)).join('');
    lede.after(row);
  });

  /* ── 2. 題目掛圖 ── */
  const pick = (sec, it) => {
    const txt = (it.q || '') + (it.title || '');
    if (sec === 'shunt') return /參考 ①|Reference ①|reversed/.test(txt) ? 'ref1' : /參考 ②/.test(txt) ? 'ref2' : 'shunt';
    if (sec === 'bidir') return /R_?2|R<sub>2<\/sub>|2\.7|變形|[Vv]ariant/.test(txt) ? 'bidirR2' : 'bidir';
    return { hwr: 'hwr', wave: 'hwr', xfmr: 'hwrT', chg: 'chg', fwc: 'ct', brg: 'bridge', series: 'series', clamp: 'clamp' }[sec];
  };
  const MT2 = { 'mt2-k4a': 'bridge', 'mt2-k4b': 'ct', 'mt2-k5a': 'shunt', 'm3-ex21': 'chg', 'm3-ct': 'ct', 'c22-chg1': 'chg', 'c22-chg2': 'chg' };
  ['__CH21C', '__CH21EX', '__CH22C', '__CH22EX', '__CH23C', '__CH23EX', '__MT2EX', '__HW3EX', '__HW3MX'].forEach(name => {
    const b = window[name]; if (!b || !b.items) return;
    b.items.forEach(it => {
      if (it.fig) return;
      const k = MT2[it.id] || pick(it.sec, it);
      if (k && F[k]) { it.fig = '<div class="c2f-q">' + F[k]() + '</div>'; if (it.kind !== 'cf' && !it.cap) it.cap = CAP[k]; }
      else if (it.sec === 'cmp') { it.fig = '<div class="c2f-q two">' + F.ct() + F.bridge() + '</div>'; if (it.kind !== 'cf' && !it.cap) it.cap = '左：中間抽頭　右：橋式'; }
    });
  });
})();
