/* ============================================================
   電子學 CH1 PART 1 —— 故事模式（仿解說動畫：一次一個畫面、一句字幕）
   主線謎題：純矽每 3 兆個原子只有 1 個自由電子；每一億個矽換 1 個磷，
   自由電子就多 3 萬倍。為什麼？
   數字依講義：矽原子 5×10²² cm⁻³、nᵢ(300 K) ≈ 1.5×10¹⁰ cm⁻³、摻雜 1 : 10⁸、Eg ≈ 1.1 eV。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { e, h, atom, line, text, arrow, chip, lattice } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);

  /* 波耳模型：shells = [2, 8, 4]；最外層畫成藍色價電子（key: key+'v'），內層小灰點 */
  function bohr(x, y, sym, shells, key, opt) {
    opt = opt || {};
    const r0 = opt.r0 || 24, dr = opt.dr || 18;
    let out = '', val = '';
    shells.forEach((n, i) => {
      const R = r0 + i * dr, last = i === shells.length - 1;
      out += '<circle class="ln2" cx="' + x + '" cy="' + y + '" r="' + R + '"' + (last && opt.outerKey ? k(opt.outerKey) : '') + '/>';
      const slots = last && opt.slots ? opt.slots : n;
      for (let j = 0; j < n; j++) {
        const a = (opt.start !== undefined ? opt.start : -Math.PI / 2) + j * 2 * Math.PI / slots;
        const px = (x + R * Math.cos(a)).toFixed(1), py = (y + R * Math.sin(a)).toFixed(1);
        if (last) val += e(px, py, null, 4.5);
        else out += '<circle class="ink3" cx="' + px + '" cy="' + py + '" r="2.6"/>';
      }
    });
    return g(key, out + atom(x, y, sym, null, 14) + (opt.noVal ? '' : g(key + 'v', val)));
  }
  /* 一把「差幾個 0」的對數尺：10⁸ … 10²³ */
  const RX = lg => 70 + (lg - 8) / 15 * 500;
  function ruler(y, key) {
    let s = line(70, y, 570, y, null, 'ln');
    for (let d = 8; d <= 23; d++) {
      const x = RX(d);
      s += line(x, y, x, y + (d % 2 ? 4 : 7), null, 'ln');
      if (d % 2 === 0) s += T(x, y + 22, '10<tspan font-size="9" dy="-6">' + d + '</tspan>', { cls: 'ts mono', fs: 11 });
    }
    return g(key, s);
  }
  function marker(x, y, label, key, labelKey, cls) {
    return g(key, line(x, y - 22, x, y, null, cls === 'acc' ? 'lna' : 'ln') +
      '<polygon class="' + (cls || 'ink') + '" points="' + (x - 5) + ',' + (y - 8) + ' ' + (x + 5) + ',' + (y - 8) + ' ' + x + ',' + y + '"/>' +
      T(x, y - 30, label, { cls: cls === 'acc' ? 'ta' : 't', fs: 12.5, k: labelKey }));
  }
  function bracket(x1, x2, y, label, key) {
    return g(key, '<path class="lna" d="M' + x1 + ' ' + (y + 6) + ' V' + y + ' H' + x2 + ' V' + (y + 6) + '"/>' +
      T((x1 + x2) / 2, y - 7, label, { cls: 'ta', fs: 13 }));
  }
  function chair(x, y) {
    return '<path class="ln" d="M' + (x - 15) + ' ' + y + ' H' + (x + 15) + ' M' + (x - 13) + ' ' + y + ' V' + (y + 24) +
      ' M' + (x + 13) + ' ' + y + ' V' + (y + 24) + ' M' + (x + 15) + ' ' + y + ' V' + (y - 28) + '"/>';
  }

  /* ════════════ 00 謎題 ════════════ */
  function dotsGrid(x0, y0, w, hh, n, m, cls, r) {
    let s = '';
    for (let j = 0; j < m; j++) for (let i = 0; i < n; i++)
      s += '<circle class="' + cls + '" cx="' + (x0 + (i + 0.5) * w / n).toFixed(1) + '" cy="' + (y0 + (j + 0.5) * hh / m).toFixed(1) + '" r="' + r + '"/>';
    return s;
  }
  const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(7);
  let eB = '';
  for (let i = 0; i < 26; i++) eB += e((392 + rnd() * 146).toFixed(1), (108 + rnd() * 114).toFixed(1), null, 4);
  const S0 = {
    t: '一億分之一的魔法', en: 'THE QUESTION',
    svg: g('all', g('Aside',
      g('A', '<rect class="bgw" x="92" y="98" width="166" height="132" rx="12"/>' + dotsGrid(92, 98, 166, 132, 9, 7, 'ink3', 2)) +
      T(175, 90, '純矽', { fs: 15, k: 'Alab' }) +
      g('Ae', e(214, 163, null, 5.5)) +
      T(175, 256, '矽原子　5×10<tspan font-size="9" dy="-6">22</tspan><tspan dy="6"> /cm³</tspan>', { cls: 'tm', fs: 13, k: 'Acnt' }) +
      T(175, 277, '自由電子 1.5×10<tspan font-size="9" dy="-6">10</tspan>', { cls: 'ta', fs: 13.5, k: 'Ae2' }) +
      chip(175, 310, '差 12 個 0', '約每 3 兆個原子，只有 1 個電子能動', 'cA', { fs: 13 })) +
      arrow(268, 165, 372, 165, 'arr', 'lna') +
      chip(320, 204, '摻雜 1 : 10⁸', '每一億個矽換 1 個磷', 'cDope', { fs: 12 }) +
      g('B', '<rect class="bgw" x="382" y="98" width="166" height="132" rx="12"/>' + dotsGrid(382, 98, 166, 132, 9, 7, 'ink3', 2)) +
      T(465, 90, '摻一點磷', { fs: 15, k: 'Blab' }) +
      g('Be', eB) +
      T(465, 256, '自由電子 5×10<tspan font-size="9" dy="-6">14</tspan>', { cls: 'ta', fs: 13.5, k: 'Be2' }) +
      T(465, 284, '≈ 多 3 萬倍', { cls: 'ta', fs: 20, k: 'x3' })
    ) + T(320, 230, '?', { cls: 'ta', fs: 120, k: 'q' }),
    steps: [
      { sub: '這是一塊純矽。每立方公分裡，大約有 <b>5×10²²</b> 個矽原子。', on: 'all Aside A Alab Acnt', mv: { Aside: [145, 0] } },
      { sub: '可是在室溫下，真正能自由移動的電子，只有大約 <b>1.5×10¹⁰</b> 個。', on: 'Ae Ae2' },
      { sub: '差了 12 個 0 —— 大約每 <b>3 兆</b>個原子，才有 1 個電子能動。', on: 'cA' },
      { sub: '現在，每一億個矽原子裡，偷偷換掉 1 個成磷。', on: 'arr cDope B Blab', mv: { Aside: [0, 0] } },
      { sub: '自由電子一下子變成 <b>5×10¹⁴</b> 個 —— 多了大約 <b>3 萬倍</b>。', on: 'Be Be2 x3' },
      { sub: '一億分之一的雜質，為什麼影響這麼大？這一段就是要把它搞懂。', op: { all: 0.14 }, on: 'q' }
    ]
  };

  /* ════════════ 01 電流 ════════════ */
  let conv = '';
  for (let i = 0; i < 11; i++) conv += e(108 + i * 42, 160, null, 6);
  const S1 = {
    t: '電流', en: 'ELECTRIC CURRENT',
    svg: '<defs><clipPath id="st-clip-w"><rect x="110" y="140" width="420" height="40" rx="20"/></clipPath></defs>' +
      g('tube', '<rect class="bgw" x="110" y="140" width="420" height="40" rx="20"/>') +
      g('eW', conv, ' clip-path="url(#st-clip-w)" style="--run:42px"') +
      g('wires', '<path class="ln" d="M110 160 H84 V292 H306 M323 292 H556 V160 H530"/>' +
        '<line class="ln" x1="309" y1="278" x2="309" y2="306" style="stroke-width:3"/>' +
        '<line class="ln" x1="321" y1="270" x2="321" y2="314"/>' +
        T(297, 276, '−', { fs: 16 }) + T(335, 268, '+', { fs: 16 }) + T(315, 334, '電池', { cls: 'ts', fs: 12 })) +
      arrow(250, 118, 390, 118, 'dir', 'lna') + T(320, 108, '電子流動', { cls: 'ta', fs: 12, k: 'dirL' }) +
      chip(320, 224, '載子 carrier', '能自由移動、搬運電荷的粒子', 'c1', { fs: 13 }),
    steps: [
      { sub: '先回到最基本的：<b>電流</b>到底是什麼？', on: 'tube' },
      { sub: '電流就是「電荷在移動」。金屬導線裡，有很多可以自由跑的電子。', on: 'eW' },
      { sub: '接上電池，這些電子就會一起往同一個方向流動。', on: 'wires dir dirL', cls: { eW: 'conv' } },
      { sub: '反過來說：<b>沒有能自由移動的帶電粒子，就沒有電流。</b>', on: 'c1' },
      { sub: '所以關鍵問題是：材料裡有多少「能自由跑的電荷」？要回答它，得先看原子長什麼樣子。', cls: { eW: '' } }
    ]
  };

  /* ════════════ 02 原子 ════════════ */
  const cx2 = 250, cy2 = 205;
  let shell2 = '';
  [0, 1, 2, 3].forEach(j => { const a = -Math.PI / 4 + j * Math.PI / 2; shell2 += e((cx2 + 86 * Math.cos(a)).toFixed(1), (cy2 + 86 * Math.sin(a)).toFixed(1), null, 5); });
  const S2 = {
    t: '原子', en: 'ATOM',
    svg: g('nuc', '<circle class="bgw" cx="' + cx2 + '" cy="' + cy2 + '" r="19"/>' + T(cx2, cy2, '6+', { fs: 13, dy: '.36em' })) +
      chip(cx2, 324, '原子核', '6 個質子（+）＋ 6 個中子', 'cNuc', { fs: 12.5 }) +
      g('sh', '<circle class="ln2" cx="' + cx2 + '" cy="' + cy2 + '" r="46"/><circle class="ln2" cx="' + cx2 + '" cy="' + cy2 + '" r="86"/>' +
        '<circle class="ink3" cx="' + (cx2 - 46) + '" cy="' + cy2 + '" r="3.4"/><circle class="ink3" cx="' + (cx2 + 46) + '" cy="' + cy2 + '" r="3.4"/>') +
      g('val', shell2) +
      chip(52, 104, '原子序 = 質子數 = 電子數', '碳 C：原子序 6', 'cZ', { fs: 12.5, a: 'left' }) +
      g('cap', T(468, 118, '每層最多 2n² 個', { cls: 'ta', fs: 14 }) +
        T(468, 148, '第 1 層　2 個', { cls: 'tm', fs: 13 }) + T(468, 172, '第 2 層　8 個', { cls: 'tm', fs: 13 }) + T(468, 196, '第 3 層　18 個', { cls: 'tm', fs: 13 })) +
      arrow(cx2 + 64, cy2 - 64, cx2 + 104, cy2 - 104, 'out', 'lna') +
      T(cx2 + 108, cy2 - 112, '能量高、抓得鬆', { cls: 'ta', fs: 11.5, a: 'start', k: 'outL' }) +
      chip(400, 262, '價電子', 'VALENCE ELECTRON · 最外層的電子', 'cVal', { fs: 13.5, a: 'left' }),
    steps: [
      { sub: '原子中間是<b>原子核</b>，裡面有帶正電的質子、和不帶電的中子。', on: 'nuc cNuc' },
      { sub: '外面一層一層的殼層上繞著電子。這是碳：原子序 6，所以有 6 個電子。', on: 'sh val cZ' },
      { sub: '每一層能裝的電子有上限：<b>2n²</b> —— 第 1 層 2 個、第 2 層 8 個、第 3 層 18 個。', on: 'cap' },
      { sub: '越外層的電子能量越高、被原子核抓得越鬆，越容易脫離原子。', on: 'out outL' },
      { sub: '最外層的電子叫<b>價電子</b>。它們決定原子怎麼跟別人結合 —— 也是這一章的主角。', on: 'cVal', cls: { val: 'pulse' } }
    ]
  };

  /* ════════════ 03 族數 ════════════ */
  const S3 = {
    t: '價電子決定族數', en: 'VALENCE ELECTRONS · GROUP',
    svg: bohr(320, 182, 'Si', [2, 8, 4], 'Si', { r0: 22, dr: 17, start: -Math.PI / 4 }) +
      T(320, 268, '矽 Si　14 = 2 + 8 + 4', { cls: 'tm', fs: 12.5, k: 'SiL' }) + T(320, 296, '4A', { cls: 'ta', fs: 22, k: 'SiG' }) +
      bohr(512, 182, 'P', [2, 8, 5], 'P', { r0: 22, dr: 17 }) +
      T(512, 268, '磷 P　15 = 2 + 8 + 5', { cls: 'tm', fs: 12.5, k: 'PL' }) + T(512, 296, '5A', { cls: 'ta', fs: 22, k: 'PG' }) +
      bohr(128, 182, 'B', [2, 3], 'B', { r0: 22, dr: 17 }) +
      T(128, 268, '硼 B　5 = 2 + 3', { cls: 'tm', fs: 12.5, k: 'BL' }) + T(128, 296, '3A', { cls: 'ta', fs: 22, k: 'BG' }) +
      chip(320, 96, '最外層有幾個電子 = 第幾 A 族', null, 'c', { fs: 13 }),
    steps: [
      { sub: '矽 Si，原子序 14：電子排成 2 + 8 + 4。最外層 4 個價電子 → <b>4A 族</b>。', on: 'Si Siv SiL SiG' },
      { sub: '磷 P，原子序 15：2 + 8 + 5。最外層 5 個 → <b>5A 族</b>。', on: 'P Pv PL PG' },
      { sub: '硼 B，原子序 5：2 + 3。最外層 3 個 → <b>3A 族</b>。', on: 'B Bv BL BG' },
      { sub: '記住這三個數字：<b>3、4、5</b>。後面的「摻雜」，就是靠它們差一個。', on: 'c', cls: { Siv: 'pulse', Pv: 'pulse', Bv: 'pulse' } }
    ]
  };

  /* ════════════ 04 八隅體 ════════════ */
  function card(x, y, w, hh, title, sub, key) {
    return g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="12" filter="url(#st-sh)"/>' +
      T(x + 18, y + 30, title, { fs: 15, a: 'start' }) + T(x + 18, y + 54, sub, { cls: 'ta', fs: 12.5, a: 'start' }));
  }
  const S4 = {
    t: '八隅體規則', en: 'OCTET RULE',
    svg: bohr(190, 196, 'Ne', [2, 8], 'Ne', { r0: 30, dr: 30 }) +
      chip(190, 296, '最外層 8 個 → 穩定', '氖 Ne、氬 Ar 幾乎不跟別人反應', 'cNe', { fs: 13 }) +
      chip(190, 92, '八隅體規則', '主族（A 族）元素的簡化規則', 'cOct', { fs: 13 }) +
      card(360, 112, 230, 70, '① 給出去 / 搶過來', '→ 離子鍵 ionic bond', 'k1') +
      card(360, 202, 230, 70, '② 跟鄰居共用', '→ 共價鍵 covalent bond', 'k2'),
    steps: [
      { sub: '最外層剛好 <b>8 個</b>電子的原子最穩定，例如氖 Ne、氬 Ar —— 幾乎不跟別人反應。', on: 'Ne Nev cNe' },
      { sub: '其他原子都想把最外層湊到 8 個。這就是<b>八隅體規則</b>。', on: 'cOct' },
      { sub: '湊法有兩種：把電子直接給出去、或從別人那裡搶過來 —— <b>離子鍵</b>；', on: 'k1' },
      { sub: '或者跟鄰居<b>共用</b>電子 —— <b>共價鍵</b>。矽走的是這一條。', on: 'k2', op: { k1: 0.45 } }
    ]
  };

  /* ════════════ 05 離子鍵 ════════════ */
  const S5 = {
    t: '離子鍵', en: 'IONIC BOND',
    svg: bohr(206, 196, 'Na', [2, 8, 1], 'Na', { r0: 24, dr: 19, start: 0, outerKey: 'NaOut', noVal: true }) +
      bohr(436, 196, 'Cl', [2, 8, 7], 'Cl', { r0: 24, dr: 19, start: Math.PI * 1.25, slots: 8 }) +
      e(206 + 62, 196, 'eNa', 5) +
      T(206, 290, '鈉 Na · 1A', { fs: 13.5, k: 'NaL' }) + T(436, 290, '氯 Cl · 7A', { fs: 13.5, k: 'ClL' }) +
      chip(320, 96, '兩邊最外層都變成 8 個', null, 'chk', { fs: 13 }) +
      g('att', T(206, 316, 'Na⁺', { cls: 'ta', fs: 18 }) + T(436, 316, 'Cl⁻', { cls: 'ta', fs: 18 }) +
        '<path class="lna dsh" d="M246 310 H396"/>' + T(321, 304, '正負相吸', { cls: 'ta', fs: 11.5 })),
    steps: [
      { sub: '鈉 Na 最外層只有 <b>1</b> 個電子；氯 Cl 最外層有 <b>7</b> 個。', on: 'Na Cl Clv eNa NaOut NaL ClL' },
      { sub: '鈉乾脆把那 1 個電子交給氯 ——', mv: { eNa: [106, 0] } },
      { sub: '鈉剩下 2 + 8、氯變成 2 + 8 + 8 —— <b>兩邊最外層都湊到 8 個</b>。', off: 'NaOut', on: 'chk' },
      { sub: '鈉少一個電子變成 <b>Na⁺</b>，氯多一個變成 <b>Cl⁻</b>。正負相吸黏在一起 —— 這就是食鹽。', on: 'att' }
    ]
  };

  /* ════════════ 06 共價鍵 ════════════ */
  const C6x = 320, C6y = 196, d6 = 82;
  let nb = '', bd = '', cv = '', pv = '';
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
    const nx = C6x + dx * d6, ny = C6y + dy * d6;
    nb += atom(nx, ny, 'Si', null, 13);
    bd += line(C6x + dx * 15, C6y + dy * 15, nx - dx * 15, ny - dy * 15, null, 'ln2');
    cv += e(C6x + dx * d6 * 0.34, C6y + dy * d6 * 0.34, null, 4.5);
    pv += e(C6x + dx * d6 * 0.66, C6y + dy * d6 * 0.66, null, 4.5);
  });
  const S6 = {
    t: '共價鍵', en: 'COVALENT BOND',
    svg: g('bd', bd) + g('nb', nb) + g('pv', pv) + g('cv', cv) + atom(C6x, C6y, 'Si', 'c0', 14) +
      '<circle class="ring dsh"' + k('r8') + ' cx="' + C6x + '" cy="' + C6y + '" r="40"/>' +
      chip(C6x + 112, C6y - 66, '共價鍵', '兩個原子共用一對電子', 'cB', { fs: 13, a: 'left' }) +
      lattice(145, 122, 6, 3, 70, 'L') +
      chip(320, 314, 'T = 0 K：沒有自由電子', '純矽 = 絕緣體', 'c0K', { fs: 13 }),
    steps: [
      { sub: '矽有 4 個價電子。要丟掉 4 個、或搶 4 個回來，都太難了。', on: 'c0 cv' },
      { sub: '所以它跟上下左右 4 個鄰居，<b>各共用一對電子</b>。', on: 'nb bd pv cB' },
      { sub: '數數看：中間這顆矽周圍，現在有 <b>8 個電子</b> —— 滿足八隅體了。', on: 'r8', cls: { cv: 'pulse', pv: 'pulse' } },
      { sub: '每一顆矽都這樣做，就排成整整齊齊的<b>晶格</b>（實際上是立體的四面體，這裡畫成平面）。', off: 'c0 cv nb bd pv r8 cB', on: 'L-b L-e L-a' },
      { sub: '所有價電子都被鍵牢牢綁住，沒有能自由跑的電子。所以在 <b>0 K</b> 時，純矽其實是<b>絕緣體</b>。', on: 'c0K' }
    ]
  };

  /* ════════════ 07 能帶 ════════════ */
  let vd = '';
  for (let j = 0; j < 3; j++) for (let i = 0; i < 12; i++) if (!(j === 1 && i === 7)) vd += e(122 + i * 16, 258 + j * 14, null, 3.6);
  function mini(x, title, gap, overlap) {
    const top = 130, bh = 18;
    const cb = overlap ? top + 40 : top, vb = overlap ? top + 52 : top + 18 + gap;
    return T(x + 30, 116, title, { fs: 12.5 }) +
      '<rect class="bgw" x="' + x + '" y="' + cb + '" width="60" height="' + bh + '" rx="3"/>' +
      '<rect class="accw" x="' + x + '" y="' + vb + '" width="60" height="' + bh + '" rx="3" style="stroke:var(--s-ink);stroke-width:1.6"/>' +
      (overlap ? T(x + 30, 264, '重疊', { cls: 'ta', fs: 12 }) : T(x + 30, 264, gap > 60 ? '3～6 eV' : '≈ 1 eV', { cls: 'ta', fs: 12 }));
  }
  const S7 = {
    t: '能帶', en: 'ENERGY BAND',
    svg: arrow(84, 318, 84, 96, 'ax', 'ln') + T(70, 92, '能量', { cls: 'tm', fs: 12, a: 'end', k: 'axL' }) +
      g('vb', '<rect class="accw" x="110" y="248" width="210" height="52" rx="4" style="stroke:var(--s-ink);stroke-width:1.6"/>') +
      g('vdots', vd) + T(215, 318, '價帶 valence band', { cls: 'tm', fs: 12, k: 'vbL' }) +
      g('cb', '<rect class="bgw" x="110" y="112" width="210" height="48" rx="4"/>') +
      T(215, 104, '導帶 conduction band', { cls: 'tm', fs: 12, k: 'cbL' }) +
      g('gap', '<path class="lna" d="M332 160 H342 V248 H332"/>') + T(350, 209, 'E<tspan font-size="9" dy="3">g</tspan>', { cls: 'ta', fs: 16, a: 'start', k: 'gapL' }) +
      T(104, 164, 'E<tspan font-size="8" dy="3">c</tspan>', { cls: 'ts', fs: 12, a: 'end', k: 'Ec' }) +
      T(104, 252, 'E<tspan font-size="8" dy="3">v</tspan>', { cls: 'ts', fs: 12, a: 'end', k: 'Ev' }) +
      g('jarr', '<path class="lna dsh" d="M234 262 V146"/>') +
      h(234, 272, 'hv', 4.6) + e(234, 272, 'jump', 4.6) +
      g('cmp', mini(392, '絕緣體', 78) + mini(470, '半導體', 22) + mini(548, '導體', 0, true)) +
      chip(470, 300, '1 eV ≈ 1.6×10⁻¹⁹ J', '1 個電子跨過 1 伏特得到的能量', 'cEv', { fs: 12.5 }),
    steps: [
      { sub: '換個角度，用<b>能量</b>來看。被鍵綁住的價電子，待在下面的<b>價帶</b>。', on: 'ax axL vb vdots vbL jump' },
      { sub: '能自由移動的電子，待在上面的<b>導帶</b>。', on: 'cb cbL' },
      { sub: '中間這段電子不能停留，叫<b>禁止能隙</b>，寬度 E<sub>g</sub> = E<sub>c</sub> − E<sub>v</sub>。', on: 'gap gapL Ec Ev' },
      { sub: '電子要一口氣吸收至少 E<sub>g</sub> 的能量，才跳得上導帶。矽的 E<sub>g</sub> ≈ <b>1.1 eV</b>。', mv: { jump: [0, -136] }, on: 'hv jarr' },
      { sub: '能隙越大越難導電：<b>絕緣體 3～6 eV</b>、<b>半導體約 1 eV</b>、<b>導體</b>兩個帶重疊，幾乎不用能量。', on: 'cmp' },
      { sub: 'eV（電子伏特）是能量單位：1 個電子跨過 1 伏特得到的能量，約 1.6×10⁻¹⁹ 焦耳。', on: 'cEv' }
    ]
  };

  /* ════════════ 08 熱擾動 ════════════ */
  const fe0 = { x: 180 + 70 + 70 * 0.64, y: 200 };
  const S8 = {
    t: '熱擾動：電子–電洞對', en: 'THERMAL GENERATION',
    svg: lattice(180, 130, 5, 3, 70, 'L', { skip: { 'L-e-1-1-h-1': 1 } }) +
      h(fe0.x, fe0.y, 'ho', 5) + e(fe0.x, fe0.y, 'fe', 4.6) +
      g('th', '<rect class="bgw" x="540" y="112" width="15" height="152" rx="7.5"/><circle class="bgw" cx="547.5" cy="276" r="14"/>' +
        '<circle class="acc" cx="547.5" cy="276" r="9.5"/>') +
      '<rect class="acc"' + k('tLow') + ' x="544" y="246" width="7" height="28" rx="3.5"/>' +
      '<rect class="acc"' + k('tHigh') + ' x="544" y="132" width="7" height="142" rx="3.5"/>' +
      T(547, 104, '0 K', { cls: 'ts mono', fs: 12, k: 'tL0' }) + T(547, 104, '300 K', { cls: 'ta mono', fs: 12, k: 'tL1' }) +
      chip(fe0.x + 60, 96, '自由電子', '跳上導帶，可以到處跑', 'cFe', { fs: 12.5 }) +
      chip(fe0.x - 40, 308, '電洞 hole', '留下來的空位', 'cHo', { fs: 12.5 }) +
      chip(110, 96, 'n = p', '純矽裡電子和電洞一樣多', 'cPair', { fs: 13, a: 'left' }),
    steps: [
      { sub: '回到晶格。在 <b>0 K</b>，每個電子都乖乖待在鍵上，一動也不動。', on: 'L-b L-e L-a fe th tLow tL0' },
      { sub: '溫度升高，原子開始抖動（<b>熱擾動</b>），把能量分給價電子。', off: 'tLow tL0', on: 'tHigh tL1', cls: { 'L-a': 'shake', 'L-e': 'shake' } },
      { sub: '某個電子拿到的能量超過 E<sub>g</sub> —— 掙脫共價鍵，變成<b>自由電子</b>。', mv: { fe: [60, -35] }, on: 'cFe' },
      { sub: '它原本的位置，留下一個空位：<b>電洞</b>（hole）。', on: 'ho cHo' },
      { sub: '電子和電洞一定成對出現，叫<b>電子–電洞對</b>。所以純矽裡：電子濃度 = 電洞濃度，<b>n = p</b>。', on: 'cPair' }
    ]
  };

  /* ════════════ 09 電洞移動 ════════════ */
  const seats = [140, 212, 284, 356, 428, 500];
  let chairs = '', ppl = '';
  seats.forEach((x, i) => { chairs += chair(x, 200); if (i !== 4 && i !== 2 && i !== 3) ppl += e(x, 180, null, 9); });
  const ax = [160, 240, 320, 400, 480], ry = 236;
  let row = '', rowe = '';
  ax.forEach((x, i) => {
    row += atom(x, ry, 'Si', null, 13);
    if (i < 4) {
      row += line(x + 14, ry, x + 66, ry, null, 'ln2');
      [0.36, 0.64].forEach((t, j) => {
        const id = i + '-' + j;
        if (id === '3-0' || id === '2-1' || id === '1-1') return;
        rowe += e(x + 80 * t, ry, null, 4.5);
      });
    }
  });
  const S9 = {
    t: '電洞會「移動」', en: 'MOVEMENT OF HOLES',
    svg: g('chairs', chairs) + g('ppl', ppl) + e(284, 180, 'p2', 9) + e(356, 180, 'p3', 9) +
      '<circle class="h"' + k('emp') + ' cx="428" cy="180" r="9"/>' +
      g('arrP', arrow(250, 128, 380, 128, null, 'lna') + T(315, 118, '人往右', { cls: 'ta', fs: 12 })) +
      g('arrE', arrow(400, 262, 270, 262, null, 'ln') + T(335, 284, '空位往左', { cls: 't', fs: 12 })) +
      g('row', row) + g('rowe', rowe) +
      h(400 + 80 * 0.36, ry, 'hb', 5.2) + e(320 + 80 * 0.64, ry, 'e1', 4.5) + e(240 + 80 * 0.64, ry, 'e2', 4.5) +
      g('arr2', arrow(250, 196, 360, 196, null, 'lna') + T(305, 186, '電子往右跳', { cls: 'ta', fs: 12 }) +
        arrow(430, 278, 300, 278, null, 'ln') + T(365, 298, '電洞往左走', { cls: 't', fs: 12 })) +
      chip(320, 112, '電洞 ⊕', '移動方向 = 電流方向', 'cHole', { fs: 13.5 }),
    steps: [
      { sub: '電洞怎麼「移動」？想像一排椅子，坐滿了人，只空出一個位子。', on: 'chairs ppl p2 p3 emp' },
      { sub: '空位左邊的人往右挪，坐進空位 ——', mv: { p3: [72, 0], emp: [-72, 0] } },
      { sub: '再下一個人也往右挪。<b>明明是人往右移動，看起來卻是空位一路往左跑。</b>', mv: { p2: [72, 0], emp: [-144, 0] }, on: 'arrP arrE' },
      { sub: '晶格裡也一樣。這條鍵上少了一個電子 —— 那就是一個電洞。', off: 'chairs ppl p2 p3 emp arrP arrE', on: 'row rowe hb e1 e2' },
      { sub: '旁邊鍵上的價電子跳過來補位，電洞就跑到它原本的位置。', mv: { e1: [57.6, 0], hb: [-57.6, 0] } },
      { sub: '再一次。<b>電子往右跳，電洞就往左走</b> —— 其實真正在動的，只有電子。', mv: { e2: [80, 0], hb: [-137.6, 0] }, on: 'arr2' },
      { sub: '所以電洞就像一顆帶<b>正電</b>的粒子；電洞移動的方向，就是<b>電流</b>的方向。', on: 'cHole' }
    ]
  };

  /* ════════════ 10 本質載子濃度 ════════════ */
  const ruY = 268;
  const S10 = {
    t: '本質載子濃度 nᵢ', en: 'INTRINSIC CARRIER CONCENTRATION',
    svg: g('f', '<text class="t mono" x="320" y="112" text-anchor="middle" font-size="24">n<tspan font-size="14" dy="5">i</tspan>' +
        '<tspan dy="-5"> = B · T</tspan><tspan font-size="13" dy="-11">3/2</tspan><tspan dy="11"> · e</tspan>' +
        '<tspan font-size="13" dy="-12">−E</tspan><tspan font-size="9" dy="3">g</tspan><tspan font-size="13" dy="-3">/2kT</tspan></text>') +
      chip(205, 150, 'B', '材料常數', 'fB', { fs: 13 }) + chip(320, 150, 'T', '溫度（K）', 'fT', { fs: 13 }) + chip(435, 150, 'E<tspan font-size="8" dy="3">g</tspan>', '能隙', 'fE', { fs: 13 }) +
      ruler(ruY, 'ru') +
      g('ni', marker(RX(10.18), ruY, '', null, null, 'acc') + T(RX(10.18), ruY - 30, '300 K：1.5×10¹⁰', { cls: 'ta', fs: 12.5, k: 'niT' })) +
      marker(RX(22.7), ruY, '矽原子 5×10²²', 'at', null, 'ink') +
      bracket(RX(10.18), RX(22.7), 204, '差了 12 個 0', 'gap') +
      chip(470, 204, 'E<tspan font-size="8" dy="3">g</tspan> 越大 → nᵢ 越小', '絕緣體 3～6 eV：幾乎沒有自由電子', 'cEg', { fs: 12.5 }),
    steps: [
      { sub: '純矽裡電子濃度 = 電洞濃度，這個值叫<b>本質載子濃度 nᵢ</b>。', on: 'f' },
      { sub: 'nᵢ 只看三件事：材料常數 <b>B</b>、溫度 <b>T</b>、能隙 <b>E<sub>g</sub></b>。', on: 'fB fT fE' },
      { sub: '矽在 300 K（約 27 °C）：nᵢ ≈ <b>1.5×10¹⁰ cm⁻³</b> —— 每立方公分 150 億個。', on: 'ru ni niT', off: 'fB fT fE' },
      { sub: '跟矽原子數 5×10²² 放在同一把尺上：<b>差了 12 個 0</b>。所以純矽幾乎不導電。', on: 'at gap' },
      { sub: '可是溫度一升高：400 K（127 °C）時，nᵢ 變成大約 <b>300 倍</b>。', off: 'gap', mv: { ni: [RX(12.69) - RX(10.18), 0] }, txt: { niT: '400 K：≈ 5×10¹²' } },
      { sub: '到 500 K，變成<b>一萬多倍</b>。指數項 e<sup>−Eg/2kT</sup> 對溫度非常敏感。', mv: { ni: [RX(14.22) - RX(10.18), 0] }, txt: { niT: '500 K：≈ 2×10¹⁴' } },
      { sub: '反過來，<b>能隙越大，nᵢ 越小</b> —— 所以絕緣體幾乎沒有自由電子。', mv: { ni: [0, 0] }, txt: { niT: '300 K：1.5×10¹⁰' }, on: 'cEg' }
    ]
  };

  /* ════════════ 11 摻雜 ════════════ */
  const S11 = {
    t: '摻雜', en: 'DOPING',
    svg: lattice(250, 130, 3, 3, 70, 'L', { keyed: ['L-a-1-1'] }) +
      atom(320, 200, 'P', 'Pat', 14, 'p') + e(338, 180, 'e5', 5) +
      '<circle class="ring dsh"' + k('r4') + ' cx="320" cy="200" r="50"/>' +
      g('Pplus', '<circle class="ring" cx="320" cy="200" r="19"/>' + T(336, 184, '+', { cls: 'ta', fs: 15 })) +
      chip(470, 140, '自由電子', '磷的第 5 個價電子', 'cE5', { fs: 12.5 }) +
      chip(150, 300, 'P⁺ 固定正離子', '不會移動、不能導電（≠ 電洞）', 'cP', { fs: 12.5 }) +
      chip(486, 300, '施體 donor', '提供電子的雜質', 'cDonor', { fs: 12.5 }),
    steps: [
      { sub: '那能不能不靠溫度，直接把電子「塞」進去？', on: 'L-b L-e L-a L-a-1-1' },
      { sub: '把晶格裡的一顆矽，換成<b>磷 P</b>。磷有 <b>5 個</b>價電子。', off: 'L-a-1-1', on: 'Pat e5' },
      { sub: '其中 4 個，跟周圍的矽配成共價鍵 —— 剛好用完。', on: 'r4' },
      { sub: '第 5 個電子沒有位子，被抓得很鬆；室溫的一點點能量，就讓它變成<b>自由電子</b>。', off: 'r4', mv: { e5: [110, -38] }, on: 'cE5' },
      { sub: '磷少了一個電子，變成<b>固定不動的正離子 P⁺</b>。它不是電洞 —— 不會移動，也不能導電。', on: 'Pplus cP' },
      { sub: '磷「提供」電子，所以叫<b>施體</b>（donor）。整塊仍然是電中性：+1 和 −1 剛好抵消。', on: 'cDonor' }
    ]
  };

  /* ════════════ 12 N 型 ════════════ */
  const r12 = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(42);
  let es12 = '', ions12 = '', hs12 = '';
  for (let i = 0; i < 14; i++) es12 += e((104 + r12() * 280).toFixed(1), (124 + r12() * 132).toFixed(1), null, 5);
  [[140, 150], [230, 135], [320, 165], [170, 230], [270, 215], [360, 240]].forEach(([x, y]) => {
    ions12 += '<circle class="ring" cx="' + x + '" cy="' + y + '" r="9"/>' + T(x, y, '+', { cls: 'ta', fs: 13, dy: '.35em' });
  });
  hs12 = h(205, 190, null, 5) + h(330, 210, null, 5);
  const S12 = {
    t: 'N 型半導體', en: 'N-TYPE SEMICONDUCTOR',
    svg: g('box', '<rect class="accw" x="90" y="112" width="310" height="156" rx="6" style="stroke:var(--s-ink);stroke-width:1.6"/>') +
      T(110, 102, 'N 型', { cls: 'ta', fs: 16, a: 'start', k: 'boxL' }) +
      g('ions', ions12) + g('es', es12) + g('hs', hs12) +
      chip(245, 300, 'N = Negative', '多出來的是帶負電的電子', 'cN', { fs: 12.5 }) +
      g('bars', T(430, 132, '電子', { fs: 13, a: 'start' }) + '<rect class="acc" x="430" y="142" width="170" height="14" rx="3"/>' +
        T(604, 154, '多數載子', { cls: 'ta', fs: 11.5, a: 'end', dy: '22' }) +
        T(430, 210, '電洞', { fs: 13, a: 'start' }) + '<rect class="h" x="430" y="220" width="7" height="14" rx="2"/>' +
        T(446, 232, '少數載子', { cls: 'ts', fs: 11.5, a: 'start' })) +
      chip(515, 294, '仍然電中性', 'P⁺ 的數目 = 多出的電子數', 'cNeu', { fs: 12.5 }),
    steps: [
      { sub: '摻進很多顆磷，晶體裡就有很多自由電子在跑。', on: 'box boxL ions es', cls: { es: 'shake' } },
      { sub: '多出來的是帶<b>負</b>電（Negative）的電子，所以叫 <b>N 型半導體</b>。', on: 'cN' },
      { sub: '熱擾動還是會產生一點點電子–電洞對，只是少到可以忽略。', on: 'hs' },
      { sub: '數量多的電子叫<b>多數載子</b>；數量少的電洞叫<b>少數載子</b>。', on: 'bars' },
      { sub: '別忘了：P⁺ 離子跟多出來的電子一樣多，整塊仍然是<b>電中性</b>。', on: 'cNeu', cls: { ions: 'pulse' } }
    ]
  };

  /* ════════════ 13 n ≈ Nd ════════════ */
  const S13 = {
    t: '電子有多少？n ≈ Nd', en: 'HOW MANY ELECTRONS',
    svg: T(320, 112, 'N<tspan font-size="11" dy="4">d</tspan><tspan dy="-4"> = 5×10²² ÷ 10⁸ = 5×10¹⁴ cm⁻³</tspan>', { cls: 't', fs: 20, k: 'f' }) +
      ruler(ruY, 'ru') +
      marker(RX(22.7), ruY, '矽原子 5×10²²', 'at', null, 'ink') +
      marker(RX(14.7), ruY, 'N<tspan font-size="9" dy="3">d</tspan><tspan dy="-3"> 5×10¹⁴</tspan>', 'nd', null, 'acc') +
      marker(RX(10.18), ruY, 'nᵢ 1.5×10¹⁰', 'ni', null, 'ink') +
      bracket(RX(10.18), RX(14.7), 206, '小 3 萬倍', 'gap2') +
      chip(470, 196, '1 顆磷 → 1 個自由電子', null, 'cNd', { fs: 12.5 }) +
      T(320, 172, 'n ≈ N<tspan font-size="18" dy="6">d</tspan>', { cls: 'ta mono', fs: 34, k: 'big' }),
    steps: [
      { sub: '摻雜比例 1 : 10⁸。矽原子有 5×10²² 個，所以磷有 <b>5×10¹⁴ 個 /cm³</b>。', on: 'f ru at nd' },
      { sub: '每顆磷貢獻 1 個自由電子 → 光是磷，就給了 5×10¹⁴ 個電子。', on: 'cNd' },
      { sub: '熱擾動那一份呢？只有 1.5×10¹⁰ —— <b>小了 3 萬倍</b>，加進去幾乎看不出差別。', on: 'ni gap2' },
      { sub: '所以：<b>n ≈ N<sub>d</sub></b> —— 電子濃度幾乎就等於摻雜濃度。（嚴格的推導在下面第 08 節。）', off: 'cNd', on: 'big' }
    ]
  };

  /* ════════════ 14 恍然大悟 ════════════ */
  const S14 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 230, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="66" y="88" width="232" height="152" rx="14" filter="url(#st-sh)"/>' +
        T(182, 116, '純矽', { fs: 16 }) + T(182, 152, '1.5×10¹⁰', { cls: 'ink2', fs: 24 }) +
        T(182, 182, '熱擾動：每個電子都要', { cls: 'tm', fs: 12.5 }) + T(182, 202, '跨過 1.1 eV 能隙', { cls: 'tm', fs: 12.5 }) +
        T(182, 226, '很難', { cls: 'ts', fs: 12 })) +
      g('R', '<rect class="card" x="342" y="88" width="232" height="152" rx="14" filter="url(#st-sh)"/>' +
        T(458, 116, '摻磷 1 : 10⁸', { fs: 16 }) + T(458, 152, '5×10¹⁴', { cls: 'ta', fs: 24 }) +
        T(458, 182, '磷的第 5 個電子', { cls: 'tm', fs: 12.5 }) + T(458, 202, '幾乎不用能量就自由', { cls: 'tm', fs: 12.5 }) +
        T(458, 226, '一顆磷 = 一個電子', { cls: 'ta', fs: 12 })) +
      chip(320, 270, '謎題解開了 ✓', '5×10¹⁴ ÷ 1.5×10¹⁰ ≈ 3 萬倍', 'ans', { fs: 14, acc: true }) +
      chip(320, 270, '下一段 PART 2', '摻的是只有 3 個價電子的硼呢？', 'next', { fs: 14 }),
    steps: [
      { sub: '回到一開始的謎題：一億分之一的磷，為什麼能讓自由電子多 3 萬倍？', on: 'q' },
      { sub: '純矽只能靠熱擾動：每個自由電子都得跨過 <b>1.1 eV</b> 的能隙 —— 很難，所以只有 1.5×10¹⁰。', off: 'q', on: 'L' },
      { sub: '磷的第 5 個電子本來就多出來，幾乎不用能量就自由了：<b>一顆磷 = 一個電子</b>。', on: 'R' },
      { sub: '5×10¹⁴ 對 1.5×10¹⁰ —— 這就是那 3 萬倍。<b>謎題解開了。</b>', on: 'ans' },
      { sub: '下一段（PART 2）：如果摻的是只有 <b>3 個</b>價電子的硼，又會怎樣？', off: 'ans', on: 'next' }
    ]
  };

  window.__ch1p1Story = window.__Story('#story', {
    id: 'ch1-part1', title: 'CH1 PART 1 半導體材料', after: '#signal',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]
  });
})();
