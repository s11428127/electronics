/* ============================================================
   電路學 CH4 複習 —— 故事模式（電路定理 Circuit Theorems），兩段
   PART 1 線性、重疊、電源轉換（課本 Example 4.1、4.3、4.6）
     謎題（Ex 4.3）：兩個電源一起 v = 10 V；只留 6 V 是 2 V、只留 3 A 是 8 V，剛好相加 —— 巧合？
   PART 2 戴維寧、諾頓、最大功率（課本 Example 4.8）
     謎題：R_L 要換 6、16、36 Ω，每次都重解整個電路？→ 縮成 30 V 串 4 Ω，I = 30/(4 + R_L)
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__RV) return;
  const R = window.__RV, D = R.D;
  const { g, T, calc, sc, el, bat, isrc, wire, strike, ladder, curve, axes, card, f1 } = R;
  const { chip, arrow } = D;

  /* ── 課本 Fig 4.6（Example 4.3）；off: 'v' 電壓源換導線、'i' 電流源拿掉 ── */
  const XS = 110, XN = 300, XI = 470, YU = 130, YD = 285;
  const fig43 = (k, off) => g(k,
    (off === 'v' ? wire('M' + XS + ' ' + YU + ' V' + YD) + T(XS - 10, 212, '短路', { cls: 'ta', fs: 13, a: 'end' })
      : bat(XS, 207, '6 V') + wire('M' + XS + ' ' + (207 - 30) + ' V' + YU + ' M' + XS + ' ' + (207 + 30) + ' V' + YD)) +
    el('r', XS, YU, XN, YU, '8 Ω') + wire('M' + XS + ' ' + YD + ' H' + XN) +
    el('r', XN, YU, XN, YD, '4 Ω', { side: 'l' }) +
    T(XN + 18, 168, '+', { cls: 'tm', fs: 14, a: 'start' }) + T(XN + 18, 213, 'v', { cls: 'ta', fs: 16, a: 'start' }) + T(XN + 18, 258, '−', { cls: 'tm', fs: 14, a: 'start' }) +
    (off === 'i' ? wire('M' + XN + ' ' + YU + ' H' + XI + ' V' + 175 + ' M' + XN + ' ' + YD + ' H' + XI + ' V' + 240) + T(XI + 12, 212, '斷路', { cls: 'ta', fs: 13, a: 'start' })
      : wire('M' + XN + ' ' + YU + ' H' + XI + ' V' + (207 - 30) + ' M' + XN + ' ' + YD + ' H' + XI + ' V' + (207 + 30)) + isrc(XI, 207, '3 A', { side: 'r' })) +
    R.dot(XN, YU) + R.dot(XN, YD));

  /* ═══════════════ PART 1 ═══════════════ */
  const A0 = sc('剛好相加的巧合？', 'THE PUZZLE',
    fig43('ckt') +
    calc(126, 150, 160, [['兩個一起：10 V', 'r1', 'ta'], ['只留 6 V：2 V', 'r2'], ['只留 3 A：8 V', 'r3']], { k: 'cc', lh: 27 }),
    [{ sub: '課本 Example 4.3：一顆 6 V 電壓源、一顆 3 A 電流源，求 4 Ω 上的電壓 v。', on: 'ckt' },
     { sub: '用 CH3 的方法解：v = <b>10 V</b>。', on: 'cc r1' },
     { sub: '奇怪的是：只留 6 V，v = 2 V；只留 3 A，v = 8 V。', on: 'r2 r3' },
     { sub: '2 + 8 剛好 = 10。這是巧合嗎？', on: '' }]);

  const A1 = sc('這一章要幹嘛', 'WHY THIS CHAPTER',
    ladder(4, { k: 'lad', km: 'me', hl: [3] }) +
    chip(230, 118, 'CH3：什麼都解得出來', '但每次都要全部解', 'c1', { fs: 14 }) +
    chip(470, 118, 'CH4：把電路縮小', '重疊、電源轉換、戴維寧', 'c2', { fs: 14, acc: true }),
    [{ sub: '第 4 階。CH3 什麼電路都解得出來 —— 但每一次都要把整個電路解完。', on: 'lad me lad-hl c1' },
     { sub: 'CH4 是一組<b>偷懶的定理</b>：拆開來算、換個樣子、或整坨縮成一顆電源。', on: 'c2' },
     { sub: 'PART 1 先看拆開來算（重疊）和換樣子（電源轉換）。', on: '' }]);

  const A2 = sc('線性：電源加倍，全部加倍', 'LINEARITY',
    g('sp', '<path class="ln" style="fill:none" d="M120 130 V150 l14 8 l-28 16 l28 16 l-28 16 l28 16 l-14 8 V250"/>' + '<rect class="bgw" x="100" y="250" width="40" height="22" rx="3"/>' + T(120, 290, '1 kg', { cls: 't', fs: 13 })) +
    g('sp2', '<path class="ln" style="fill:none" d="M220 130 V150 l14 10 l-28 20 l28 20 l-28 20 l28 20 l-14 10 V270"/>' + '<rect class="accw" x="200" y="270" width="40" height="22" rx="3" style="stroke:var(--s-acc)"/>' + T(220, 308, '2 kg', { cls: 'ta', fs: 13 })) +
    calc(330, 118, 290, [['課本 Example 4.1', 'r0', 'ts', 12], ['v<sub>s</sub> = 12 V → |I<sub>o</sub>| = 157.9 mA', 'r1'], ['v<sub>s</sub> = 24 V → |I<sub>o</sub>| = 315.8 mA', 'r2', 'ta'], ['電源 × 2 → 電流 × 2', 'r3', 'ta']], { k: 'cc', lh: 30 }),
    [{ sub: '彈簧秤：掛 1 kg 伸長一段，掛 2 kg 伸長兩段 —— 這叫<b>線性</b>。', on: 'sp sp2' },
     { sub: '只由 R 和電源組成的電路也是線性的。課本 Example 4.1：電源 12 V 時算出一個電流……', on: 'cc r0 r1' },
     { sub: '電源換成 24 V，電流剛好變兩倍。', on: 'r2 r3' },
     { sub: '線性有兩個性質：<b>加倍</b>（乘幾倍都跟著乘）和<b>相加</b>（兩個輸入的效果可以加起來）。第二個就是重疊定理。', on: '' }]);

  const A3 = sc('重疊：一次只留一個電源', 'SUPERPOSITION',
    g('v0', bat(150, 200, '') + T(150, 260, '電壓源', { cls: 't', fs: 14 })) + g('a1', arrow(190, 200, 250, 200, null, 'lna')) +
    g('v1', wire('M290 170 V230') + T(290, 260, '換成導線（0 V）', { cls: 'ta', fs: 13 })) +
    g('i0', isrc(410, 200, '') + T(410, 260, '電流源', { cls: 't', fs: 14 })) + g('a2', arrow(450, 200, 505, 200, null, 'lna')) +
    g('i1', wire('M545 170 V188 M545 212 V230') + T(545, 260, '拿掉（0 A）', { cls: 'ta', fs: 13 })) +
    chip(320, 128, '像兩個人推鞦韆：分開推，效果加起來', '', 'c1', { fs: 13.5 }),
    [{ sub: '重疊定理：好幾個電源一起作用的結果 = 每個電源<b>單獨</b>作用的結果相加。', on: 'c1' },
     { sub: '「單獨」的意思是把其他電源<b>關掉</b>。電壓源關掉 = 0 V = 換成一條導線（短路）。', on: 'v0 a1 v1' },
     { sub: '電流源關掉 = 0 A = 直接拿掉（斷路）。', on: 'i0 a2 i1' },
     { sub: '注意：只關<b>獨立</b>電源。相依電源要留著。', on: '' }]);

  const A4 = sc('只留 6 V', 'ONLY THE 6 V SOURCE',
    fig43('ckt', 'i') +
    calc(126, 160, 160, [['v<sub>1</sub> = 6 × 4/(4 + 8)', 'r1'], ['　= 2 V', 'r2', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '只留 6 V：3 A 電流源拿掉，右邊變成斷路。', on: 'ckt' },
     { sub: '剩下 8 Ω 和 4 Ω 串聯，分壓：v<sub>1</sub> = 6 × 4/12 = <b>2 V</b>。', on: 'cc r1 r2' }]);

  const A5 = sc('只留 3 A', 'ONLY THE 3 A SOURCE',
    fig43('ckt', 'v') +
    calc(126, 150, 160, [['i<sub>3</sub> = 3 × 8/(4 + 8)', 'r1'], ['　= 2 A', 'r1b', 'ta'], ['v<sub>2</sub> = 4 × 2 = 8 V', 'r2', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '只留 3 A：6 V 電壓源換成一條導線。', on: 'ckt' },
     { sub: '3 A 分給 4 Ω 和 8 Ω 兩條路（並聯），分流：流過 4 Ω 的是 2 A。', on: 'cc r1 r1b' },
     { sub: 'v<sub>2</sub> = 4 × 2 = <b>8 V</b>。', on: 'r2' }]);

  const A6 = sc('加起來，還有一個陷阱', 'ADD THEM — BUT NOT POWER',
    T(320, 136, 'v = v<sub>1</sub> + v<sub>2</sub> = 2 + 8 = 10 V ✓', { cls: 'ta', fs: 20, k: 's1' }) +
    T(320, 190, 'p = p<sub>1</sub> + p<sub>2</sub> = 1 + 16 = 17 W', { cls: 't', fs: 17, k: 'x0' }) + strike(180, 185, 460, 'x1') +
    T(320, 222, 'p = v<sup>2</sup>/R = 10<sup>2</sup>/4 = 25 W', { cls: 'ta', fs: 17, k: 'o1' }) +
    T(320, 250, '功率是平方，不是線性 → 先加電壓電流，最後才算功率', { cls: 'tm', fs: 13, k: 'o2' }),
    [{ sub: '不是巧合：線性電路的效果本來就可以相加。v = 2 + 8 = 10 V。', on: 's1' },
     { sub: '陷阱來了：4 Ω 的功率能不能也分開算再相加？2<sup>2</sup>/4 + 8<sup>2</sup>/4 = 17 W？', on: 'x0' },
     { sub: '不行！功率有平方，不是線性。正確是 10<sup>2</sup>/4 = <b>25 W</b>。', on: 'x1 o1' },
     { sub: '記住：重疊只能加電壓、電流；功率要最後再算。', on: 'o2' }]);

  const A7 = sc('先整理一下', 'SO FAR',
    calc(110, 110, 420, [['線性：電源 × k → 全部 × k', 'r1'], ['重疊：每個電源單獨算，再相加', 'r2'], ['關掉電壓源 = 短路；關掉電流源 = 斷路', 'r3', 'ta'],
      ['功率不能重疊', 'r4', 'ta'], ['接下來：電源換個樣子', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '先整理一下：線性 → 重疊。', on: 'cc r1 r2' },
     { sub: '關電源的方法、還有功率的陷阱。', on: 'r3 r4' },
     { sub: '接下來第二招：電源轉換。', on: 'r5' }]);

  const A8 = sc('電源轉換：換個包裝', 'SOURCE TRANSFORMATION',
    g('L', bat(110, 205, 'v<sub>s</sub>') + wire('M110 175 V140 M110 235 V270 H230') + el('r', 110, 140, 230, 140, 'R') +
      '<circle class="bgw" cx="234" cy="140" r="4"/><circle class="bgw" cx="234" cy="270" r="4"/>' + T(244, 145, 'a', { cls: 'ts', fs: 12, a: 'start' }) + T(244, 275, 'b', { cls: 'ts', fs: 12, a: 'start' })) +
    g('ar', arrow(275, 198, 345, 198, null, 'lna') + arrow(345, 212, 275, 212, null, 'lna')) +
    g('Rr', isrc(400, 205, 'i<sub>s</sub>', {}) + wire('M400 175 V140 H520 M400 235 V270 H520') + el('r', 470, 140, 470, 270, 'R') +
      '<circle class="bgw" cx="524" cy="140" r="4"/><circle class="bgw" cx="524" cy="270" r="4"/>' + T(534, 145, 'a', { cls: 'ts', fs: 12, a: 'start' }) + T(534, 275, 'b', { cls: 'ts', fs: 12, a: 'start' })) +
    chip(320, 300, 'v<sub>s</sub> = i<sub>s</sub> R　箭頭指向 + 端', '', 'eq', { fs: 14, acc: true }),
    [{ sub: '左邊：電壓源<b>串</b>一個電阻。', on: 'L' },
     { sub: '右邊：電流源<b>並</b>一個同樣的電阻。只要 v<sub>s</sub> = i<sub>s</sub>R，從 a、b 看進去<b>一模一樣</b>。', on: 'ar Rr' },
     { sub: '像同一包餅乾換個包裝：外面的人分不出來。電流源的箭頭要指向原本的 + 端。', on: 'eq' },
     { sub: '好處：串聯的電阻換成並聯，就能跟旁邊的電阻合併 —— 一路換、一路併，電路越來越小。', on: '' }]);

  const A9 = sc('一路換下去', 'KEEP TRANSFORMING',
    calc(40, 108, 280, [['課本 Example 4.6', 'r0', 'ts', 12], ['3 A ∥ 4 Ω → 12 V 串 4 Ω', 'r1'], ['12 V 串 3 Ω → 4 A ∥ 3 Ω', 'r2'], ['電阻合併、電流源合併', 'r3'], ['→ 2 A ∥ 2 Ω ∥ 8 Ω', 'r4', 'ta']], { k: 'cc', lh: 29 }) +
    g('fin', isrc(370, 205, '2 A', { side: 'l' }) + wire('M370 175 V140 H580 M370 235 V270 H580') + el('r', 470, 140, 470, 270, '2 Ω') + el('r', 580, 140, 580, 270, '8 Ω', { side: 'l' }) +
      T(596, 190, '+', { cls: 'tm', fs: 13, a: 'start' }) + T(596, 210, 'v<sub>o</sub>', { cls: 'ta', fs: 14, a: 'start' }) + T(596, 232, '−', { cls: 'tm', fs: 13, a: 'start' }) + R.dot(470, 140) + R.dot(470, 270)) +
    chip(480, 300, 'i = 2 × 2/10 = 0.4 A → v<sub>o</sub> = 3.2 V', '', 'ans', { fs: 13.5, acc: true }),
    [{ sub: '課本 Example 4.6：電流源、電壓源、五個電阻。', on: 'cc r0' },
     { sub: '一路換：電流源並電阻 → 電壓源串電阻，串的電阻合併；再換回來……', on: 'r1 r2 r3' },
     { sub: '最後只剩一顆 2 A 電流源，並著 2 Ω 和 8 Ω。', on: 'r4 fin' },
     { sub: '分流：8 Ω 拿到 0.4 A，v<sub>o</sub> = 3.2 V。沒寫半條聯立方程式！', on: 'ans' }]);

  const A10 = sc('PART 1 小結', 'PART 1 RECAP',
    calc(90, 106, 460, [['謎題：2 + 8 = 10 不是巧合', 'r1', 'ta'], ['→ 線性電路可以重疊（功率除外）', 'r2'], ['→ 電源轉換：串 ⇄ 並，一路化簡', 'r3'],
      ['還缺：一整坨電路，能不能縮成一顆電源？', 'r4', 'tm'], ['→ PART 2：戴維寧、諾頓', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：2 + 8 = 10 不是巧合。', on: 'cc r1' },
     { sub: '線性電路可以重疊，但功率不行。', on: 'r2' },
     { sub: '電源轉換讓電路一路縮小。', on: 'r3' },
     { sub: '更狠的：整坨電路縮成<b>一顆電源</b>？', on: 'r4' },
     { sub: '往下看 PART 2：戴維寧。', on: 'r5' }]);

  __Story('#story', { id: 'cir-rv-ch4a', title: 'CH4 PART 1 重疊與電源轉換', after: '#story2-sec', afterLabel: '接著看 PART 2 ↓', stamp: { no: 'CH4', name: '重疊' },
    scenes: [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10] });

  /* ═══════════════ PART 2 ═══════════════ */
  /* 課本 Fig 4.27（Example 4.8） */
  const X0 = 80, X1 = 200, X2 = 310, XA = 420, XL = 520;
  const fig48 = (k, rl) => g(k,
    bat(X0, 207, '32 V') + wire('M' + X0 + ' ' + (207 - 30) + ' V' + YU + ' M' + X0 + ' ' + (207 + 30) + ' V' + YD + ' H' + XA) +
    el('r', X0, YU, X1, YU, '4 Ω') + el('r', X1, YU, X1, YD, '12 Ω', { side: 'l' }) +
    wire('M' + X1 + ' ' + YU + ' H' + X2 + ' V' + (207 - 30) + ' M' + X2 + ' ' + (207 + 30) + ' V' + YD) + isrc(X2, 207, '2 A', { side: 'r' }) +
    el('r', X2, YU, XA, YU, '1 Ω') + R.dot(X1, YU) + R.dot(X1, YD) + R.dot(X2, YU) + R.dot(X2, YD) +
    '<circle class="bgw" cx="' + XA + '" cy="' + YU + '" r="4.5"/><circle class="bgw" cx="' + XA + '" cy="' + YD + '" r="4.5"/>' +
    T(XA, YU - 12, 'a', { cls: 'ts', fs: 13 }) + T(XA, YD + 20, 'b', { cls: 'ts', fs: 13 }) +
    (rl ? wire('M' + (XA + 4) + ' ' + YU + ' H' + XL + ' M' + (XA + 4) + ' ' + YD + ' H' + XL) + el('r', XL, YU, XL, YD, 'R<sub>L</sub>', { hl: true, lc: 'ta' }) : ''));
  const thev = (k, x, vt, rt, rl) => g(k, bat(x, 207, vt) + wire('M' + x + ' ' + (207 - 30) + ' V' + YU + ' M' + x + ' ' + (207 + 30) + ' V' + YD + ' H' + (x + (rl ? 260 : 156))) +
    el('r', x, YU, x + 156, YU, rt) + '<circle class="bgw" cx="' + (x + 160) + '" cy="' + YU + '" r="4.5"/><circle class="bgw" cx="' + (x + 160) + '" cy="' + YD + '" r="4.5"/>' +
    (rl ? wire('M' + (x + 165) + ' ' + YU + ' H' + (x + 260) + ' M' + (x + 165) + ' ' + YD + ' H' + (x + 260)) + el('r', x + 260, YU, x + 260, YD, rl, { hl: true, lc: 'ta' }) : ''));

  const B0 = sc('換三次負載', 'THE PUZZLE',
    fig48('ckt', true) +
    chip(560, 108, 'R<sub>L</sub> = 6、16、36 Ω', '', 'q', { fs: 13.5, acc: true }),
    [{ sub: 'PART 2，課本 Example 4.8：一個電路接到負載 R<sub>L</sub>。', on: 'ckt' },
     { sub: '題目要你把 R<sub>L</sub> 換成 6 Ω、16 Ω、36 Ω，各算一次電流。', on: 'q' },
     { sub: '用 CH3 的話，要解三次聯立。有沒有更聰明的方法？', on: '' }]);

  const B1 = sc('戴維寧：從兩個端點看進去', 'THÉVENIN’S THEOREM',
    fig48('ckt', false) +
    g('box', '<rect class="lna dsh" style="fill:none;stroke-width:2" x="50" y="104" width="' + (XA - 40) + '" height="210" rx="14"/>') +
    g('ar', arrow(450, 207, 500, 207, null, 'lna')) +
    g('eq', bat(540, 207, 'V<sub>Th</sub>', { side: 'r' }) + wire('M540 177 V' + YU + ' M540 237 V' + YD) + el('r', 540, YU, 610, YU, '') + T(575, YU - 14, 'R<sub>Th</sub>', { cls: 'ta', fs: 13 }) + wire('M540 ' + YD + ' H610')),
    [{ sub: '把 R<sub>L</sub> 拿掉，只看 a、b 兩個端點左邊那一整坨。', on: 'ckt box' },
     { sub: '戴維寧定理：任何線性電路，從兩個端點看進去，都等於<b>一顆電壓源 V<sub>Th</sub> 串一個電阻 R<sub>Th</sub></b>。', on: 'ar eq' },
     { sub: '像牆上的插座：你不用知道發電廠長怎樣，只要知道它給多少電壓、內阻多少。', on: '' }]);

  const B2 = sc('R<sub>Th</sub>：電源關掉，看進去', 'FINDING R<sub>Th</sub>',
    g('ck', wire('M' + X0 + ' ' + YU + ' V' + YD + ' H' + XA) + el('r', X0, YU, X1, YU, '4 Ω') + el('r', X1, YU, X1, YD, '12 Ω', { side: 'l' }) +
      wire('M' + X1 + ' ' + YU + ' H' + X2) + el('r', X2, YU, XA, YU, '1 Ω') + R.dot(X1, YU) + R.dot(X1, YD) +
      '<circle class="bgw" cx="' + XA + '" cy="' + YU + '" r="4.5"/><circle class="bgw" cx="' + XA + '" cy="' + YD + '" r="4.5"/>' + T(XA, YU - 12, 'a', { cls: 'ts', fs: 13 }) + T(XA, YD + 20, 'b', { cls: 'ts', fs: 13 }) +
      T(X0 - 10, 212, '短路', { cls: 'ta', fs: 12.5, a: 'end' }) + T(X2, 212, '斷路（2 A 拿掉）', { cls: 'ta', fs: 12.5 })) +
    calc(450, 150, 170, [['R<sub>Th</sub> = 4 ∥ 12 + 1', 'r1'], ['= 3 + 1 = 4 Ω', 'r2', 'ta']], { k: 'cc', lh: 30 }),
    [{ sub: 'R<sub>Th</sub>：把獨立電源全部關掉（電壓源短路、電流源斷路）。', on: 'ck' },
     { sub: '從 a、b 看進去：4 Ω ∥ 12 Ω = 3 Ω，再串 1 Ω → <b>R<sub>Th</sub> = 4 Ω</b>。', on: 'cc r1 r2' }]);

  const B3 = sc('V<sub>Th</sub>：開路電壓', 'FINDING V<sub>Th</sub>',
    fig48('ckt', false) + T(XA + 14, 212, 'V<sub>Th</sub>', { cls: 'ta', fs: 15, a: 'start', k: 'vl' }) +
    calc(470, 108, 155, [['1 Ω 沒電流', 'r0', 'tm'], ['(32 − V)/4 + 2', 'r1'], ['　= V/12', 'r1b'], ['V<sub>Th</sub> = 30 V', 'r2', 'ta']], { k: 'cc', lh: 27 }),
    [{ sub: 'V<sub>Th</sub>：a、b 兩端<b>開路</b>時的電壓。', on: 'ckt vl' },
     { sub: '開路 → 1 Ω 沒有電流、沒有壓降，V<sub>Th</sub> 就是上面那個節點的電壓。', on: 'cc r0' },
     { sub: '對那個節點寫 KCL（CH3 的節點分析）：', on: 'r1 r1b' },
     { sub: '解出 <b>V<sub>Th</sub> = 30 V</b>。', on: 'r2' }]);

  const B4 = sc('一次縮好，負載隨便換', 'SWAP THE LOAD FREELY',
    thev('th', 120, '30 V', '4 Ω', 'R<sub>L</sub>') +
    calc(450, 108, 175, [['I<sub>L</sub> = 30 / (4 + R<sub>L</sub>)', 'r1', 'ta'], ['R<sub>L</sub> = 6 → 3 A', 'r2'], ['R<sub>L</sub> = 16 → 1.5 A', 'r3'], ['R<sub>L</sub> = 36 → 0.75 A', 'r4']], { k: 'cc', lh: 30 }),
    [{ sub: '原本那一大坨，縮成 30 V 串 4 Ω。', on: 'th' },
     { sub: '接上任何負載，電流都只要一行：I<sub>L</sub> = 30 / (4 + R<sub>L</sub>)。', on: 'cc r1' },
     { sub: '6 Ω → 3 A；16 Ω → 1.5 A；36 Ω → 0.75 A。謎題三次一起解完！', on: 'r2 r3 r4' }]);

  const B5 = sc('諾頓：換成電流源的版本', 'NORTON',
    thev('th', 70, '30 V', '4 Ω', '') +
    g('ar', arrow(260, 207, 320, 207, null, 'lna')) +
    g('no', isrc(390, 207, '7.5 A', { side: 'r' }) + wire('M390 177 V' + YU + ' H560 M390 237 V' + YD + ' H560') + el('r', 500, YU, 500, YD, '4 Ω') +
      '<circle class="bgw" cx="564" cy="' + YU + '" r="4.5"/><circle class="bgw" cx="564" cy="' + YD + '" r="4.5"/>') +
    chip(320, 300, 'I<sub>N</sub> = V<sub>Th</sub> / R<sub>Th</sub> = 30/4 = 7.5 A　R<sub>N</sub> = R<sub>Th</sub>', '', 'eq', { fs: 13.5, acc: true }),
    [{ sub: '戴維寧等效是「電壓源串電阻」。', on: 'th' },
     { sub: '用 PART 1 的電源轉換，換成「電流源並電阻」—— 這叫<b>諾頓等效</b>。', on: 'ar no' },
     { sub: 'I<sub>N</sub> = 30/4 = 7.5 A，R<sub>N</sub> = R<sub>Th</sub> = 4 Ω。兩個是同一件事的兩種包裝。', on: 'eq' }]);

  const pw = r => 900 * r / ((4 + r) * (4 + r));
  const S6x = 330, S6y = 285;
  const B6 = sc('負載多大，拿到的功率最多？', 'MAXIMUM POWER TRANSFER',
    axes(S6x, S6y, 275, 165, 'ax', { xl: 'R<sub>L</sub>（Ω）' }) +
    curve(t => pw(20 * t) / 60, S6x, 270, S6y, 160, 'lna', 'cv') +
    g('pk', '<line class="ln2 dsh" x1="' + (S6x + 54) + '" y1="' + f1(S6y - 160 * 56.25 / 60) + '" x2="' + (S6x + 54) + '" y2="' + S6y + '"/>' +
      '<circle class="acc" cx="' + (S6x + 54) + '" cy="' + f1(S6y - 160 * 56.25 / 60) + '" r="5"/>' + T(S6x + 62, f1(S6y - 160 * 56.25 / 60) - 6, '56.25 W', { cls: 'ta', fs: 13, a: 'start' }) +
      T(S6x + 54, S6y + 16, '4', { cls: 'ta', fs: 12 })) +
    chip(170, 140, 'R<sub>L</sub> 太小：電流大，但電壓小', '', 'c1', { fs: 13 }) +
    chip(170, 190, 'R<sub>L</sub> 太大：電壓大，但電流小', '', 'c2', { fs: 13 }) +
    chip(170, 250, 'R<sub>L</sub> = R<sub>Th</sub> 時最大', 'p<sub>max</sub> = V<sub>Th</sub><sup>2</sup> / (4R<sub>Th</sub>)', 'c3', { fs: 14, acc: true }),
    [{ sub: '負載拿到的功率：p = I<sub>L</sub><sup>2</sup>R<sub>L</sub> = [30/(4 + R<sub>L</sub>)]<sup>2</sup> R<sub>L</sub>。畫出來是一座山。', on: 'ax cv' },
     { sub: 'R<sub>L</sub> 太小：電流很大，但電壓幾乎是 0。', on: 'c1' },
     { sub: 'R<sub>L</sub> 太大：電壓很大，但電流幾乎是 0。', on: 'c2' },
     { sub: '剛好 <b>R<sub>L</sub> = R<sub>Th</sub> = 4 Ω</b> 時最大：p<sub>max</sub> = 30<sup>2</sup>/(4 × 4) = 56.25 W。CH11 的交流版本會變成「共軛匹配」。', on: 'pk c3' }]);

  const B7 = sc('常見的錯', 'COMMON MISTAKES',
    T(320, 140, 'R<sub>L</sub> 越大，拿到的功率越大', { cls: 't', fs: 17, k: 'x0' }) + strike(190, 135, 450, 'x1') +
    T(320, 170, 'R<sub>L</sub> = R<sub>Th</sub> 時最大', { cls: 'ta', fs: 16, k: 'o1' }) +
    T(320, 220, '算 R<sub>Th</sub> 時，相依電源也關掉', { cls: 't', fs: 17, k: 'x2' }) + strike(180, 215, 460, 'x3') +
    T(320, 250, '只關獨立電源；有相依電源就外加測試電源', { cls: 'ta', fs: 15, k: 'o2' }),
    [{ sub: '錯誤一：以為負載越大越好。', on: 'x0' },
     { sub: '是一座山，山頂在 R<sub>L</sub> = R<sub>Th</sub>。', on: 'x1 o1' },
     { sub: '錯誤二：找 R<sub>Th</sub> 時把相依電源也關掉。', on: 'x2' },
     { sub: '相依電源要留著；這時在 a、b 外加一個測試電源，算 v/i（課本 Example 4.9、4.10）。', on: 'x3 o2' }]);

  const B8 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：負載換三次？縮一次就好', 'r1', 'ta'], ['→ 30 V 串 4 Ω，I = 30/(4 + R<sub>L</sub>)', 'r2'], ['→ R<sub>L</sub> = R<sub>Th</sub> 時功率最大', 'r3'],
      ['還缺：電路都只會消耗，能不能放大？', 'r4', 'tm'], ['→ CH5：運算放大器', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：負載換三次，只要縮一次。', on: 'cc r1' },
     { sub: '戴維寧把整坨變成 30 V 串 4 Ω。', on: 'r2' },
     { sub: '還順便知道：R<sub>L</sub> = 4 Ω 時拿到最多功率。', on: 'r3' },
     { sub: '到目前為止，電阻只會消耗。能不能把訊號放大？', on: 'r4' },
     { sub: '下一章 CH5：運算放大器。', on: 'r5' }]);

  __Story('#story2', { id: 'cir-rv-ch4b', title: 'CH4 PART 2 戴維寧與最大功率', after: '#sum', afterLabel: '看這章總結 ↓', stamp: { no: 'CH4', name: '戴維寧' },
    scenes: [B0, B1, B2, B3, B4, B5, B6, B7, B8] });
})();
