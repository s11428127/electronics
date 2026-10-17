/* ============================================================
   電路學 CH2 複習 —— 故事模式（基本定律 Basic Laws）
   謎題（課本 Example 2.16，Fig 2.56）：9 V 電池接三顆燈泡 20 W、15 W、10 W，
     只知道電壓和瓦數，能不能算出每顆燈的電流和電阻？
   答案：p = VI 算總電流 5 A → 20 W 那顆 2.222 A → KCL 剩 2.778 A 給串聯的兩顆
     → R = p/I²：4.05、1.945、1.297 Ω；KVL 檢查 5.4 + 3.6 = 9 V。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__RV) return;
  const R = window.__RV, D = R.D;
  const { g, T, calc, sc, el, bat, wire, dots, strike, ladder, card, f1 } = R;
  const { chip, arrow } = D;

  /* 燈泡（直的）：圓圈 + 燈絲；k 有亮光圈的 key */
  function bulb(x, y1, y2, lbl, opt) {
    opt = opt || {};
    const cy = (y1 + y2) / 2;
    /* 亮光圈：動畫放在子元素上，key 放在外層（不然動畫會蓋掉隱藏） */
    return (opt.glow ? '<g data-k="' + opt.glow + '"><circle class="acc glow" cx="' + x + '" cy="' + cy + '" r="27"/></g>' : '') +
      g(opt.k, wire('M' + x + ' ' + y1 + ' V' + (cy - 16) + ' M' + x + ' ' + (cy + 16) + ' V' + y2) +
        '<circle class="bgw" cx="' + x + '" cy="' + cy + '" r="16"/>' +
        '<path class="ln" style="fill:none;stroke-width:1.6" d="M' + (x - 6) + ' ' + (cy + 9) + ' V' + (cy + 1) + ' Q' + x + ' ' + (cy - 12) + ' ' + (x + 6) + ' ' + (cy + 1) + ' V' + (cy + 9) + '"/>' +
        (lbl ? T(x + 24, cy + 5, lbl, { cls: opt.lc || 't', fs: 13.5, a: 'start' }) : ''));
  }
  /* 課本 Fig 2.56：電池在左，20 W 並在中間，15 W + 10 W 串聯在右邊 */
  const YT = 130, YB = 280;
  const fig = (k, gl) => g(k, bat(100, 205, '9 V') + wire('M100 175 V' + YT + ' H420 M100 235 V' + YB + ' H420') +
    bulb(250, YT, YB, '20 W', { glow: gl ? 'g1' : null }) + bulb(420, YT, 205, '15 W', { glow: gl ? 'g2' : null }) + bulb(420, 205, YB, '10 W', { glow: gl ? 'g3' : null }) +
    R.dot(250, YT) + R.dot(250, YB));

  /* ═════ 00 謎題 ═════ */
  const S0 = sc('三顆燈泡的謎題', 'THE PUZZLE',
    fig('ckt', true) +
    chip(545, 150, '只知道：9 V', '和三顆燈的瓦數', 'c1', { fs: 14 }) +
    chip(545, 230, '每顆燈的電流？', '每顆燈的電阻？', 'q', { fs: 14, acc: true }),
    [{ sub: '課本 Example 2.16：一顆 9 V 電池，接三顆燈泡：20 W、15 W、10 W。', on: 'ckt g1 g2 g3' },
     { sub: '20 W 那顆直接跨在電池上；15 W 和 10 W 那兩顆<b>串在一起</b>再跨上去。', on: '' },
     { sub: '題目只給你 9 V 和瓦數。', on: 'c1' },
     { sub: '能算出每顆燈的<b>電流</b>和<b>電阻</b>嗎？這一章的三條規則就夠了。', on: 'q' }]);

  /* ═════ 01 這章要幹嘛 ═════ */
  const S1 = sc('這一章要幹嘛', 'WHY THIS CHAPTER',
    ladder(2, { k: 'lad', km: 'me', hl: [1] }) +
    chip(220, 118, 'CH1：有尺了', '電流、電壓、功率會量了', 'c1', { fs: 14 }) +
    chip(470, 118, 'CH2：元件之間的規則', '歐姆定律、KCL、KVL', 'c2', { fs: 14, acc: true }),
    [{ sub: '第 2 階。CH1 做好了尺：電流、電壓、功率都會量了。', on: 'lad me lad-hl c1' },
     { sub: 'CH2 要給<b>三條規則</b>：一個元件裡 v 和 i 的關係（歐姆定律），還有很多元件接在一起時要遵守的 KCL、KVL。', on: 'c2' },
     { sub: '這三條規則，之後每一章都會用到。', on: '' }]);

  /* ═════ 02 歐姆定律 ═════ */
  const S2 = sc('規則一：歐姆定律', 'OHM’S LAW',
    g('pipe', '<path class="ln" d="M60 160 H220 V178 H380 V160 H560 M60 240 H220 V222 H380 V240 H560"/>') + dots('M70 200 H550', 'fl', 'slow') +
    T(300, 150, '細管 = 電阻大', { cls: 't', fs: 13, k: 'nar' }) +
    g('res', el('r', 120, 290, 300, 290, '') + arrow(130, 276, 170, 276, null, 'lna') + T(150, 268, 'i', { cls: 'ta', fs: 13 }) +
      T(120, 280, '+', { cls: 'tm', fs: 13 }) + T(300, 280, '−', { cls: 'tm', fs: 13 }) + T(210, 270, 'v', { cls: 't', fs: 14 })) +
    calc(370, 252, 240, [['v = i R', 'r1', 'ta', 17]], { k: 'eq', a: 'middle', lh: 30 }),
    [{ sub: '電阻就像水管變細的那一段：管子越細，水越難流過去。', on: 'pipe fl nar' },
     { sub: '電阻兩端的電壓 v、流過的電流 i，有一條最簡單的關係：<b>v = iR</b>。', on: 'res eq r1' },
     { sub: '例如課本 Example 2.1：熨斗 120 V 吃 2 A，電阻 R = 120 / 2 = 60 Ω。', on: '' },
     { sub: '電阻吃掉的功率也可以換著寫：p = vi = i<sup>2</sup>R = v<sup>2</sup>/R。等一下解謎會用到。', on: '' }]);

  /* ═════ 03 KCL ═════ */
  const S3 = sc('規則二：KCL 進來 = 出去', 'KIRCHHOFF’S CURRENT LAW',
    fig('ckt', false) +
    g('ring', '<circle class="ring" style="stroke-width:2.6" cx="250" cy="' + YT + '" r="14"/>') +
    g('ia', arrow(150, 118, 210, 118, null, 'lna') + T(180, 110, 'I', { cls: 'ta', fs: 14 })) +
    g('ib', arrow(266, 150, 266, 180, null, 'lna') + T(272, 172, 'I<sub>1</sub>', { cls: 'ta', fs: 14, a: 'start' })) +
    g('ic', arrow(300, 118, 360, 118, null, 'lna') + T(330, 110, 'I<sub>2</sub>', { cls: 'ta', fs: 14 })) +
    chip(545, 190, 'I = I<sub>1</sub> + I<sub>2</sub>', '流進節點 = 流出節點', 'eq', { fs: 15, acc: true }) +
    chip(545, 260, '像水管的岔路口', '水不會憑空變多變少', 'c1', { fs: 13 }),
    [{ sub: '電線接在一起的點叫<b>節點</b>。看 20 W 燈泡上面那個節點。', on: 'ckt ring' },
     { sub: '電池送來的電流 I 走到這裡，分成兩路：I<sub>1</sub> 往下、I<sub>2</sub> 往右。', on: 'ia ib ic' },
     { sub: '電荷不會在節點裡堆積，所以<b>流進去 = 流出來</b>：I = I<sub>1</sub> + I<sub>2</sub>。這就是 KCL。', on: 'eq' },
     { sub: '像水管的岔路口：進來多少水，就出去多少水。', on: 'c1' }]);

  /* ═════ 04 KVL ═════ */
  const S4 = sc('規則三：KVL 繞一圈 = 0', 'KIRCHHOFF’S VOLTAGE LAW',
    fig('ckt', false) +
    dots('M100 175 V' + YT + ' H420 V' + YB + ' H100 V235', 'loop', 'slow') +
    g('v1', T(78, 160, '+9 V', { cls: 'ta', fs: 14, a: 'end' })) +
    g('v2', T(396, 172, '−V<sub>2</sub>', { cls: 't', fs: 14, a: 'end' }) + T(396, 247, '−V<sub>3</sub>', { cls: 't', fs: 14, a: 'end' })) +
    chip(545, 140, '9 − V<sub>2</sub> − V<sub>3</sub> = 0', '繞一圈，升 = 降', 'eq', { fs: 14.5, acc: true }) +
    chip(545, 215, '像爬山繞一圈', '回到起點，高度差 = 0', 'c1', { fs: 13 }),
    [{ sub: '再看最外面這一圈：電池 → 15 W → 10 W → 回到電池。', on: 'ckt loop' },
     { sub: '電池把電荷<b>升高</b> 9 V；經過兩顆燈泡各<b>降</b> V<sub>2</sub>、V<sub>3</sub>。', on: 'v1 v2' },
     { sub: '繞一圈回到原點，升的 = 降的：9 − V<sub>2</sub> − V<sub>3</sub> = 0。這就是 KVL。', on: 'eq' },
     { sub: '像爬山繞一圈：不管怎麼上上下下，回到起點時高度差一定是 0。', on: 'c1' }]);

  /* ═════ 05 先整理一下 ═════ */
  const S5 = sc('先整理一下', 'SO FAR',
    calc(110, 110, 420, [['歐姆定律：v = iR（一個元件）', 'r1'], ['KCL：節點，流進 = 流出', 'r2'], ['KVL：迴路，繞一圈電壓和 = 0', 'r3'],
      ['功率：p = vi = i<sup>2</sup>R = v<sup>2</sup>/R', 'r4', 'ta'], ['接下來：用這三條推出兩個捷徑', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '先整理一下三條規則。', on: 'cc r1 r2 r3' },
     { sub: '再加上功率的三種寫法。', on: 'r4' },
     { sub: '接下來用它們推出兩個超常用的捷徑：串聯、並聯。', on: 'r5' }]);

  /* ═════ 06 串聯、分壓 ═════ */
  const S6 = sc('串聯：電流相同，電壓照比例分', 'SERIES AND VOLTAGE DIVISION',
    g('ck', bat(110, 205, 'v') + wire('M110 175 V140 H300 M110 235 V270 H300') + el('r', 300, 140, 300, 205, 'R<sub>1</sub>') + el('r', 300, 205, 300, 270, 'R<sub>2</sub>')) +
    dots('M110 175 V140 H300 V270 H110 V235', 'fl', 'slow') +
    calc(370, 112, 250, [['電流一樣：i 只有一條路', 'r1'], ['R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub>', 'r2', 'ta'], ['v<sub>1</sub> = v · R<sub>1</sub> / (R<sub>1</sub> + R<sub>2</sub>)', 'r3', 'ta'], ['電阻越大，分到的電壓越多', 'r4', 'tm']], { k: 'cc', lh: 32 }),
    [{ sub: '<b>串聯</b>：元件一個接一個，電流只有一條路 → 每個元件的<b>電流都一樣</b>。', on: 'ck fl cc r1' },
     { sub: '總電阻直接相加：R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub>（KVL ＋ 歐姆定律推出來的）。', on: 'r2' },
     { sub: '電壓按電阻的比例分：<b>分壓定理</b>。電阻越大的分越多。', on: 'r3 r4' }]);

  /* ═════ 07 並聯、分流 ═════ */
  const S7 = sc('並聯：電壓相同，電流反比分', 'PARALLEL AND CURRENT DIVISION',
    g('ck', bat(100, 205, 'v') + wire('M100 175 V140 H330 M100 235 V270 H330') + el('r', 220, 140, 220, 270, 'R<sub>1</sub>') + el('r', 330, 140, 330, 270, 'R<sub>2</sub>') + R.dot(220, 140) + R.dot(220, 270)) +
    calc(390, 112, 230, [['電壓一樣：都跨在同兩點', 'r1'], ['R<sub>eq</sub> = R<sub>1</sub>R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)', 'r2', 'ta'], ['i<sub>1</sub> = i · R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>)', 'r3', 'ta'], ['電阻越小，分到的電流越多', 'r4', 'tm']], { k: 'cc', lh: 32 }) +
    T(180, 302, 'i<sub>1</sub> 用的是「另一個」R<sub>2</sub>', { cls: 'ts', fs: 12, k: 'n1' }),
    [{ sub: '<b>並聯</b>：元件都跨在同樣兩個節點上 → 每個元件的<b>電壓都一樣</b>。', on: 'ck cc r1' },
     { sub: '兩個並聯：R<sub>eq</sub> = 積 / 和。並聯後一定比最小的那個還小。', on: 'r2' },
     { sub: '電流反過來分：<b>分流定理</b>。注意分子是<b>另一個</b>電阻。', on: 'r3 n1' },
     { sub: '像高速公路分兩條路：路越寬（電阻越小），走的車越多。', on: 'r4' }]);

  /* ═════ 08 常見錯誤 ═════ */
  const S8 = sc('最常見的兩個錯', 'TWO COMMON MISTAKES',
    T(320, 136, '並聯：R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub>', { cls: 't', fs: 17, k: 'x1' }) + strike(200, 131, 440, 'x1s') +
    T(320, 166, '並聯要用「積 / 和」，越並越小', { cls: 'ta', fs: 15, k: 'o1' }) +
    T(320, 226, 'i<sub>1</sub> = i · R<sub>1</sub> / (R<sub>1</sub> + R<sub>2</sub>)', { cls: 't', fs: 17, k: 'x2' }) + strike(190, 221, 450, 'x2s') +
    T(320, 256, '分流的分子是「另一個」電阻：電阻小的電流大', { cls: 'ta', fs: 15, k: 'o2' }),
    [{ sub: '錯誤一：並聯也直接相加。', on: 'x1' },
     { sub: '不對！並聯是給電流多開一條路，總電阻會<b>變小</b>。', on: 'x1s o1' },
     { sub: '錯誤二：分流也照分壓的樣子寫。', on: 'x2' },
     { sub: '不對！分流的分子要放<b>另一個</b>電阻 —— 電阻小的那條路電流比較大。', on: 'x2s o2' }]);

  /* ═════ 09 Y-Δ ═════ */
  const tri = (cx, cy, s, key) => { const p = [[cx, cy - s], [cx - s * 0.87, cy + s / 2], [cx + s * 0.87, cy + s / 2]];
    return g(key, '<path class="ln" style="fill:none" d="M' + p.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L') + ' Z"/>' + p.map(q => R.dot(f1(q[0]), f1(q[1]))).join('')); };
  const wye = (cx, cy, s, key) => g(key, [[0, -s], [-s * 0.87, s / 2], [s * 0.87, s / 2]].map(q => '<line class="ln" x1="' + cx + '" y1="' + cy + '" x2="' + f1(cx + q[0]) + '" y2="' + f1(cy + q[1]) + '"/>' + R.dot(f1(cx + q[0]), f1(cy + q[1]))).join('') + R.dot(cx, cy));
  const S9 = sc('卡住的時候：Y-Δ 轉換', 'WYE-DELTA',
    tri(150, 200, 70, 'd') + T(150, 300, 'Δ（三角形）', { cls: 't', fs: 14, k: 'dl' }) +
    g('ar', arrow(250, 200, 330, 200, null, 'lna') + arrow(330, 214, 250, 214, null, 'lna')) +
    wye(430, 200, 70, 'y') + T(430, 300, 'Y（星形）', { cls: 't', fs: 14, k: 'yl' }) +
    calc(470, 108, 150, [['平衡：', 'r0', 'ts', 12], ['R<sub>Y</sub> = R<sub>Δ</sub> / 3', 'r1', 'ta']], { k: 'cc', lh: 26 }),
    [{ sub: '有些接法既不是串聯也不是並聯（例如電橋），化簡會卡住。', on: 'd dl' },
     { sub: '這時候把三個電阻圍成的<b>三角形 Δ</b>，換成接在同一點的<b>星形 Y</b>（或反過來）。', on: 'ar y yl' },
     { sub: '三個電阻一樣大的時候最簡單：Y 的每一個 = Δ 的三分之一。CH12 三相電路會再遇到它。', on: 'cc r0 r1' }]);

  /* ═════ 10 解謎（一）：電流 ═════ */
  const S10 = sc('解謎（一）：先算電流', 'SOLVE: THE CURRENTS',
    fig('ckt', true) +
    calc(484, 108, 140, [['總功率 = 45 W', 'r1'], ['I = 45 / 9 = 5 A', 'r2', 'ta'], ['I<sub>1</sub> = 20 / 9', 'r3'], ['　= 2.222 A', 'r3b', 'ta'], ['I<sub>2</sub> = 5 − 2.222', 'r4'], ['　= 2.778 A', 'r4b', 'ta']], { k: 'cc', lh: 27 }),
    [{ sub: '電池送出的功率 = 三顆燈吃掉的功率：15 + 10 + 20 = 45 W。', on: 'ckt g1 g2 g3 cc r1' },
     { sub: 'p = VI → 總電流 I = 45 / 9 = <b>5 A</b>。', on: 'r2' },
     { sub: '20 W 那顆跨在 9 V 上：I<sub>1</sub> = 20 / 9 = 2.222 A。', on: 'r3 r3b' },
     { sub: 'KCL：剩下的 I<sub>2</sub> = 5 − 2.222 = 2.778 A，流過串聯的兩顆。', on: 'r4 r4b' }]);

  /* ═════ 11 解謎（二）：電阻 ═════ */
  const S11 = sc('解謎（二）：再算電阻', 'SOLVE: THE RESISTANCES',
    fig('ckt', true) +
    calc(484, 108, 140, [['R = p / I<sup>2</sup>', 'r0', 'tm'], ['R<sub>1</sub> = 20/2.222<sup>2</sup>', 'r1'], ['　= 4.05 Ω', 'r1b', 'ta'], ['R<sub>2</sub> = 1.945 Ω', 'r2', 'ta'], ['R<sub>3</sub> = 1.297 Ω', 'r3', 'ta'], ['5.4 + 3.6 = 9 V ✓', 'r4']], { k: 'cc', lh: 27 }),
    [{ sub: '電阻用 p = I<sup>2</sup>R 倒過來：R = p / I<sup>2</sup>。', on: 'ckt g1 g2 g3 cc r0' },
     { sub: '20 W 那顆：R<sub>1</sub> = 20 / 2.222<sup>2</sup> = <b>4.05 Ω</b>。', on: 'r1 r1b' },
     { sub: '串聯的兩顆電流都是 2.778 A：R<sub>2</sub> = 1.945 Ω、R<sub>3</sub> = 1.297 Ω。', on: 'r2 r3' },
     { sub: 'KVL 檢查：15 W 那顆分到 5.4 V、10 W 那顆 3.6 V，加起來剛好 9 V。', on: 'r4' }]);

  /* ═════ 12 應用：一顆壞了 ═════ */
  const S12 = sc('應用：一顆燈壞了會怎樣', 'WHEN ONE BULB DIES',
    fig('ckt', true) +
    g('bk', '<path class="lna" style="stroke-width:3" d="M408 156 L432 180 M432 156 L408 180"/>') +
    chip(545, 140, '串聯：一顆壞，整串滅', '聖誕燈串', 'c1', { fs: 13.5 }) +
    chip(545, 220, '並聯：其他照樣亮', '家裡的燈', 'c2', { fs: 13.5, acc: true }),
    [{ sub: '假設 15 W 那顆燒壞了（斷路）。', on: 'ckt g1 g2 g3 bk' },
     { sub: '跟它<b>串聯</b>的 10 W 那顆沒有路可走 → 一起熄滅。', off: 'g2 g3', on: 'c1' },
     { sub: '跟它<b>並聯</b>的 20 W 那顆還是跨在 9 V 上 → 照樣亮。', on: 'c2' },
     { sub: '所以家裡的燈都是並聯：一顆壞了，其他照樣用。', on: '' }]);

  /* ═════ 13 恍然大悟 ═════ */
  const S13 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：只給 9 V 和瓦數，算得出來嗎？', 'r1', 'ta'], ['→ 功率 → 總電流 → KCL 分電流 → R = p/I<sup>2</sup>', 'r2'], ['→ KVL 檢查：5.4 + 3.6 = 9 V', 'r3'],
      ['還缺：電路一大，串並聯化簡不完怎麼辦？', 'r4', 'tm'], ['→ CH3：節點分析、網目分析', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '回頭看謎題：只給 9 V 和瓦數，算得出來。', on: 'cc r1' },
     { sub: '靠的就是這章三條規則：功率、KCL、歐姆定律。', on: 'r2' },
     { sub: '最後用 KVL 檢查。', on: 'r3' },
     { sub: '還缺什麼？電路一大，串並聯化簡不完。', on: 'r4' },
     { sub: '下一章 CH3：不管多亂都能解的系統方法。', on: 'r5' }]);

  __Story('#story', { id: 'cir-rv-ch2', title: 'CH2 基本定律', after: '#sum', afterLabel: '看這章總結 ↓', stamp: { no: 'CH2', name: '定律' },
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13] });
})();
