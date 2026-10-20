/* ============================================================
   電路學 CH12 PART 2 —— 故事模式（12.4 Y-Δ、12.5 Δ-Δ、12.6 Δ-Y）
   謎題（課本 Example 12.3）：Y 電源 100 V 接 Δ 負載 8 + j4 Ω。
     每一格負載只流 19.36 A，電線上卻是 33.53 A —— 多出來的電流哪來的？
   答案：電線的電流在節點 A 被兩格「共用」：I_a = I_AB − I_CA，兩支差 120° 相減 = √3 倍。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12) return;
  const K = window.__K12, D = K.D;
  const { g, T, calc, ph, sys3, single, sc } = K;
  const { chip, arrow } = D;
  const RAD = Math.PI / 180;
  const f1 = x => Math.round(x * 10) / 10;
  const YD = o => sys3(Object.assign({ src: 'Y', load: 'D', x0: 80, x1: 560, vs: ['100∠10°', '100∠−110°', '100∠130°'], z: '8 + j4' }, o));
  const meter = (x, y, txt, key) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="15"/>' + T(x, y + 5, 'A', { fs: 13 }) + T(x, y - 22, txt, { cls: 'ta', fs: 15 }));

  /* 00 謎題 */
  const S0 = sc('多出來的電流', 'THE PUZZLE',
    YD({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    meter(300, 140, '33.53 A', 'm1') + meter(425, 178, '19.36 A', 'm2') +
    T(320, 296, '電線的電流比負載多了 1.73 倍？', { cls: 'ta', fs: 15, k: 'q' }),
    [{ sub: 'Y 接電源 100 V，接到三格 8 + j4 Ω 的負載 —— 這次負載接成<b>三角形（Δ）</b>。', on: 'src lbl line load' },
     { sub: '三條電線各接到三角形的一個角：A、B、C。', on: '' },
     { sub: '在電線 a 上量電流：<b>33.53 A</b>。', on: 'm1' },
     { sub: '在負載 AB 那一格量電流：只有 <b>19.36 A</b>。', on: 'm2' },
     { sub: '電線送過去 33.53，負載只吃 19.36？多出來的電流跑去哪？', on: 'q' }]);

  /* 01 複習 */
  const S1 = sc('先複習 PART 1', 'RECAP OF PART 1',
    ph(180, 210, 60, [{ a: 0, l: 'V<sub>an</sub>', c: 'ln', k: 'pa' }, { a: -120, l: 'V<sub>bn</sub>', c: 'ln', k: 'pb' }, { a: 30, m: 1.732, l: 'V<sub>ab</sub>', k: 'pab' }], { k: 'ax', ax: 110 }) +
    calc(350, 120, 260, [['線電壓 = 兩相相減', 'r1'], ['V<sub>ab</sub> = √3 V<sub>an</sub>∠+30°', 'r2', 'ta'], ['平衡 → 只算一相', 'r3'], ['I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>', 'r4']], { k: 'cc' }),
    [{ sub: '先複習：兩條線之間的電壓 = 兩個相電壓相減。', on: 'ax pa pb cc r1' },
     { sub: '結果是 <b>√3 倍、往前轉 30°</b>。', on: 'pab r2' },
     { sub: '平衡的話只算 a 相，其他轉 120°。', on: 'r3 r4' },
     { sub: '這一頁會一直用到這三件事。', on: '' }]);

  /* 02 Δ 是什麼 */
  const tri = (cx, cy, r, key) => g(key, '<path class="ln" style="fill:none;stroke-width:2.4" d="M' + cx + ' ' + (cy - r) + ' L' + f1(cx + r * 0.866) + ' ' + (cy + r / 2) + ' L' + f1(cx - r * 0.866) + ' ' + (cy + r / 2) + ' Z"/>' +
    [[cx, cy - r, 'A'], [cx + r * 0.866, cy + r / 2, 'C'], [cx - r * 0.866, cy + r / 2, 'B']].map(p => '<circle class="acc" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="5"/>' + T(p[0] + (p[2] === 'C' ? 14 : p[2] === 'B' ? -14 : 0), p[1] + (p[2] === 'A' ? -12 : 18), p[2], { cls: 'ta', fs: 14 })).join(''));
  const S2 = sc('Δ 接：手牽手圍一圈', 'DELTA',
    tri(200, 215, 85, 'tri') +
    chip(460, 140, '三個人手牽手圍一圈', '每個人左手、右手各抓一條線', 'c1', { fs: 13.5 }) +
    chip(460, 220, '沒有中性點', '不像 Y 有一個共同的結', 'c2', { fs: 13.5 }) +
    chip(460, 290, '每格都跨在兩條線之間', '', 'c3', { fs: 13.5, acc: true }),
    [{ sub: 'Δ 接：三格負載頭尾相接，圍成一個三角形。', on: 'tri' },
     { sub: '三個角 A、B、C 各接一條電線。', on: '' },
     { sub: '像三個人手牽手圍成一圈。', on: 'c1' },
     { sub: '它<b>沒有中性點</b>。', on: 'c2' },
     { sub: '重點：<b>每一格都直接跨在兩條線之間</b>。', on: 'c3' }]);

  /* ═════ 補：Δ 實際長什麼樣子（使用者 10/18：太抽象） ═════ */
  const RV = window.__RV;
  const res = (x1, y1, x2, y2, lbl, key, o) => (RV ? RV.el('r', x1, y1, x2, y2, lbl, Object.assign({ L: 30, fs: 12, lc: 'tm' }, o || {})) : '').replace(/^<g>/, '<g' + (key ? ' data-k="' + key + '"' : '') + '>');
  const ly = [130, 175, 220];
  const D2 = sc('Δ 實際怎麼接', 'DELTA IN REAL LIFE',
    g('w', ly.map((y, i) => '<path class="ln" style="stroke-width:2.2" d="M70 ' + y + ' H570"/>' + T(62, y + 5, '火線 ' + 'abc'[i], { cls: 'ta', fs: 12.5, a: 'end' })).join('')) +
    g('h1', '<circle class="ink" cx="220" cy="130" r="3.6"/><circle class="ink" cx="220" cy="175" r="3.6"/>' + res(220, 130, 220, 175, '', '') + T(232, 157, '電熱器 1（a–b）', { cls: 'tm', fs: 12, a: 'start' })) +
    g('h2', '<circle class="ink" cx="360" cy="175" r="3.6"/><circle class="ink" cx="360" cy="220" r="3.6"/>' + res(360, 175, 360, 220, '', '') + T(372, 202, '電熱器 2（b–c）', { cls: 'tm', fs: 12, a: 'start' })) +
    g('h3', '<circle class="ink" cx="500" cy="130" r="3.6"/><circle class="ink" cx="500" cy="220" r="3.6"/>' + res(500, 130, 500, 162, '', '', { L: 24 }) +
      '<path class="ln" style="fill:none" d="M500 162 V168 A7 7 0 0 1 500 182 V220"/>' + T(514, 150, '電熱器 3（c–a）', { cls: 'tm', fs: 12, a: 'start' }) + T(514, 200, '跨過 b，沒接', { cls: 'ts', fs: 11, a: 'start' })) +
    chip(320, 266, '每台直接夾兩條火線 → 吃線電壓', '沒有共同的結、不需要中性線', 'c1', { fs: 13.5, acc: true }) +
    chip(320, 266, '加一台、拿掉一台：只動那兩條線', '', 'c2', { fs: 13.5 }),
    [{ sub: '先看實物。三條火線從左邊拉過來。', on: 'w' },
     { sub: '第一台電熱器：一腳夾火線 a、一腳夾火線 b。', on: 'h1' },
     { sub: '第二台夾 b 和 c，第三台夾 c 和 a。這就是 <b>Δ 接</b>。', on: 'h2 h3' },
     { sub: '每一台都<b>直接跨在兩條火線之間</b>，吃的是線電壓；而且根本不需要中性線。', on: 'c1' },
     { sub: '想多加一台、拿掉一台，只要動那兩條線，其他台完全不受影響 —— 所以負載常常接 Δ。', on: 'c2', off: 'c1' }]);

  /* 馬達接線盒：同一台馬達，換銅片就換 Y／Δ */
  const TX = [240, 320, 400], TOP = ['U1', 'V1', 'W1'], BOT = ['W2', 'U2', 'V2'], yt = 160, yb = 250;
  const term = (x, y, n) => '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="11"/><circle class="ink" cx="' + x + '" cy="' + y + '" r="3"/>' + T(x + 16, y + (y === yt ? -10 : 22), n, { cls: 'tm', fs: 11.5, a: 'start' });
  const bar = (x1, y1, x2, y2) => '<line class="lna" style="stroke-width:7;opacity:.85" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
  const D1 = sc('實物：馬達接線盒', 'MOTOR TERMINAL BOX',
    g('box', '<rect class="card" x="190" y="120" width="260" height="170" rx="12" filter="url(#st-sh)"/>' + TX.map((x, i) => term(x, yt, TOP[i]) + term(x, yb, BOT[i])).join('') +
      TX.map((x, i) => '<path class="ln" d="M' + x + ' 104 V' + (yt - 11) + '"/>' + T(x, 100, 'L' + (i + 1), { cls: 'ts', fs: 11 })).join('')) +
    g('coil', '<path class="ln dsh" style="fill:none;opacity:.5" d="M240 160 L320 250 M320 160 L400 250 M400 160 L240 250"/>') +
    g('yb', bar(240, yb, 400, yb)) + g('db', bar(240, yt, 240, yb) + bar(320, yt, 320, yb) + bar(400, yt, 400, yb)) +
    chip(560, 150, '上排 = 頭', 'U1 V1 W1', 'c1', { fs: 13 }) + chip(560, 250, '下排 = 尾', '故意錯開：W2 U2 V2', 'c2', { fs: 13 }) +
    chip(95, 205, 'Y：一片橫的', '三個尾接一起', 'cy', { fs: 13, acc: true }) + chip(95, 205, 'Δ：三片直的', '頭接到下一組的尾', 'cd', { fs: 13, acc: true }),
    [{ sub: '三相馬達外殼上有個<b>接線盒</b>，打開是六顆螺絲。', on: 'box' },
     { sub: '六顆 = 三組線圈的頭和尾（虛線是盒子裡的線圈）。上排是頭，三條火線 L1、L2、L3 接這裡。', on: 'coil c1 c2' },
     { sub: '<b>Y 接</b>：一片銅片橫著把下排三個尾巴接在一起 —— 那就是中性點。', on: 'yb cy' },
     { sub: '<b>Δ 接</b>：三片銅片直著接，每組的頭接到另一組的尾，三組圍成一圈。', on: 'db cd', off: 'yb cy' },
     { sub: '同一台馬達，換銅片就換接法 —— Y、Δ 是摸得到的東西。', on: '' }]);

  /* 03 每格吃線電壓 */
  const S3 = sc('每格吃的是線電壓', 'Δ SEES LINE VOLTAGE',
    YD({ hlz: 0, k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    chip(320, 296, 'V<sub>AB</sub> = V<sub>ab</sub> = √3 × 100∠(10° + 30°) = 173.2∠40° V', '', 'v', { fs: 13.5, acc: true }),
    [{ sub: '看藍色那一格：一端接 A、一端接 B。', on: 'src lbl line load' },
     { sub: '它兩端的電壓就是 A、B 兩條線之間的<b>線電壓</b> —— PART 1 剛複習的 √3 倍！', on: 'v' },
     { sub: '所以 Δ 負載每格吃到 173.2 V，比 Y 接的 100 V 大。', on: '' },
     { sub: '173.2 ÷ 100 = 1.732，就是 √3。', on: '' }]);

  /* 04 兩種電流 */
  const S4 = sc('兩種電流，兩個名字', 'PHASE vs LINE CURRENT',
    YD({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    g('il', arrow(250, 128, 310, 128, null, 'lna') + T(316, 132, 'I<sub>a</sub> 線電流', { cls: 'ta', fs: 13, a: 'start' })) +
    g('ip', arrow(516, 150, 516, 186, null, 'lna') + T(522, 172, 'I<sub>AB</sub>', { cls: 'ta', fs: 13, a: 'start' })),
    [{ sub: '電線上的電流叫<b>線電流</b> I<sub>a</sub>。', on: 'src lbl line load il' },
     { sub: '流過某一格負載的叫<b>相電流</b> I<sub>AB</sub>。', on: 'ip' },
     { sub: '一個在「路上」跑、一個在「負載那一格裡面」跑。', on: '' },
     { sub: 'Y 接時兩個是同一個電流；Δ 接時就不一樣了 —— 謎題就出在這裡。', on: '' }]);

  /* 05 路口 */
  const S5 = sc('節點 A 像一個路口', 'KCL AT NODE A',
    '<path class="ln" style="stroke-width:3" d="M120 200 H320 M320 200 L470 120 M320 200 L470 280"/>' +
    '<circle class="acc" cx="320" cy="200" r="7"/>' + T(320, 232, 'A', { cls: 'ta', fs: 16 }) +
    g('in', arrow(150, 186, 260, 186, null, 'lna') + T(205, 176, 'I<sub>a</sub>（進來）', { cls: 'ta', fs: 13 })) +
    g('o1', arrow(350, 175, 440, 128, null, 'ln') + T(450, 112, 'I<sub>AB</sub>（出去，往 B）', { cls: 't', fs: 13, a: 'start' })) +
    g('o2', arrow(440, 272, 350, 225, null, 'ln') + T(450, 296, 'I<sub>CA</sub>（從 C 進來）', { cls: 't', fs: 13, a: 'start' })) +
    calc(70, 250, 230, [['I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>', 'r1', 'ta']], { k: 'cc', a: 'middle' }),
    [{ sub: '把節點 A 放大：像一個三岔路口。', on: '' },
     { sub: '電線 a 的電流從左邊流進來。', on: 'in' },
     { sub: '往 AB 那格流出去的是 I<sub>AB</sub>…', on: 'o1' },
     { sub: '…而 CA 那格的電流 I<sub>CA</sub> 是<b>流進</b> A 的（方向從 C 到 A）。', on: 'o2' },
     { sub: 'KCL：進 = 出 → <b>I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub></b>。線電流是兩格電流的差！', on: 'cc r1' },
     { sub: '像水管分岔：主管的水 = 流去一邊的 − 從另一邊流回來的。', on: '' }]);

  /* 06 相減 */
  const tipAB = [190 + 70 * Math.cos(13.43 * RAD), 210 - 70 * Math.sin(13.43 * RAD)];
  const S6 = sc('兩支差 120° 的箭頭相減', 'SUBTRACTING PHASORS',
    ph(190, 210, 70, [{ a: 13.43, l: 'I<sub>AB</sub>', c: 'ln', k: 'p1' }, { a: 133.43, l: 'I<sub>CA</sub>', c: 'ln', k: 'p3' }, { a: -46.57, from: tipAB, l: '−I<sub>CA</sub>', c: 'ln dsh', k: 'm3' }, { a: -16.57, m: 1.732, l: 'I<sub>a</sub>', k: 'pa', ld: [6, 10] }], { k: 'ax', ax: 120 }) +
    calc(370, 120, 245, [['又是「差 120° 相減」', 'r1', 'tm'], ['大小：√3 倍', 'r2', 'ta'], ['方向：往後轉 30°', 'r3', 'ta'], ['I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°', 'r4']], { k: 'cc' }),
    [{ sub: 'I<sub>AB</sub> 和 I<sub>CA</sub> 一樣大、差 120°。', on: 'ax p1 p3' },
     { sub: '箭頭長度 = 電流大小，角度 = 相位。', on: '' },
     { sub: '減 I<sub>CA</sub> = 加一支反方向的箭頭。', on: 'm3 cc r1' },
     { sub: '合起來：<b>√3 倍</b> —— 跟 PART 1 的線電壓一模一樣的幾何！', on: 'pa r2' },
     { sub: '方向往後轉 30°（落後）。', on: 'r3 r4' }]);

  /* 07 算出來 */
  const S7 = sc('代數字：謎題解開', 'THE NUMBERS',
    calc(80, 108, 480, [['Z<sub>Δ</sub> = 8 + j4 = 8.944∠26.57° Ω', 'r1'], ['I<sub>AB</sub> = 173.2∠40° ÷ 8.944∠26.57° = 19.36∠13.43° A', 'r2'], ['I<sub>a</sub> = √3 × 19.36∠(13.43° − 30°)', 'r3'], ['= 33.53∠−16.57° A', 'r4', 'ta'], ['33.53 ÷ 19.36 = 1.732 = √3 ✓', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: '負載阻抗換極座標。', on: 'cc r1' },
     { sub: '每格吃 173.2∠40° V：相電流 19.36 A —— 就是電表量到的。', on: 'r2' },
     { sub: '線電流 = √3 倍、往後 30°。', on: 'r3 r4' },
     { sub: '33.53 ÷ 19.36 = 1.732 = √3。', on: 'r5' },
     { sub: '電流沒有多出來 —— 電線上的電流本來就是<b>兩格合起來</b>的。', on: '' }]);

  /* 08 整理 */
  const S8 = sc('先整理一下', 'SO FAR',
    calc(110, 108, 420, [['Δ 負載每格吃線電壓', 'r1'], ['相電流 I<sub>AB</sub> = V<sub>AB</sub> / Z<sub>Δ</sub>', 'r2'], ['線電流 = √3 × 相電流，落後 30°', 'r3', 'ta'], ['（因為 I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>）', 'r4', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: '先整理 Y-Δ：負載每格吃線電壓。', on: 'cc r1 r2' },
     { sub: '線電流是兩格相電流的差，√3 倍、落後 30°。', on: 'r3 r4' },
     { sub: '解題順序：先算相電流，再乘 √3、轉 −30°。', on: '' }]);

  /* 09 方法二 */
  const S9 = sc('另一條路：Δ 換成 Y', 'METHOD 2: Δ → Y',
    single({ x: 80, y: 140, w: 240, h: 115, v: '100∠10°', z: ['Z<sub>Δ</sub>/3'], i: 'I<sub>a</sub>', k: 'ckt' }) +
    calc(350, 116, 265, [['從外面看，三角形 = 縮小的 Y', 'r1', 'tm'], ['Z<sub>Y</sub> = Z<sub>Δ</sub>/3 = 2.981∠26.57°', 'r2'], ['I<sub>a</sub> = 100∠10° ÷ 2.981∠26.57°', 'r3'], ['= 33.54∠−16.57° A ✓', 'r4', 'ta']], { k: 'cc' }),
    [{ sub: '從三條電線往裡看，Δ 負載可以換成一個等效的 Y 負載。', on: 'cc r1' },
     { sub: '每相只剩<b>三分之一</b>：Z<sub>Y</sub> = Z<sub>Δ</sub>/3。', on: 'r2' },
     { sub: '換完就是 Y-Y：單相等效直接算線電流。', on: 'ckt r3' },
     { sub: '一步就得到 33.54 A，跟方法一一樣。', on: 'r4' }]);

  /* 10 Δ-Δ */
  const DD = o => sys3(Object.assign({ src: 'D', load: 'D', x0: 120, x1: 560, vs: ['330∠0°', '330∠−120°', '330∠120°'], z: '20 − j15' }, o));
  const S10 = sc('電源也接 Δ', 'DELTA-DELTA',
    DD({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    chip(330, 296, '電源每顆也跨在兩條線之間 → 相電壓 = 線電壓', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '電源也可以接成 Δ（課本 Example 12.4）。', on: 'src lbl' },
     { sub: '電源每一顆本身就跨在兩條線之間：<b>電源的相電壓就是線電壓</b>。', on: 'c1' },
     { sub: '中間沒有線路阻抗 → 負載每格吃的就是電源那一顆的電壓。', on: 'line load' },
     { sub: '所以 Δ-Δ 是四種接法裡最好算的。', on: '' }]);

  /* 11 Δ-Δ 好算 */
  const S11 = sc('Δ-Δ 最好算', 'EASIEST CASE',
    calc(80, 116, 480, [['I<sub>AB</sub> = 330∠0° ÷ (20 − j15)', 'r1'], ['= 330∠0° ÷ 25∠−36.87° = 13.2∠36.87° A', 'r2'], ['I<sub>a</sub> = √3 × 13.2∠(36.87° − 30°) = 22.86∠6.87° A', 'r3', 'ta'], ['負載還是 Δ → 線電流照樣 √3 倍', 'r4', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: '直接除：電源電壓 ÷ 負載阻抗。', on: 'cc r1' },
     { sub: '330 ÷ 25 = 13.2 A；角度 0° − (−36.87°) = +36.87°。', on: 'r2' },
     { sub: '線電流照 Δ 負載的規則：√3 倍、落後 30°。', on: 'r3 r4' },
     { sub: '負載是 −j15（電容性）：電流<b>超前</b>電壓。', on: '' }]);

  /* 12 環流 */
  const S12 = sc('Δ 電源的麻煩：環流', 'CIRCULATING CURRENT',
    tri(180, 215, 85, 'tri') + g('loop', '<circle class="lna dsh" style="fill:none" cx="180" cy="230" r="34"/>' + D.arrow(206, 208, 212, 218, null, 'lna')) +
    chip(450, 140, '像三個人推旋轉門', '力氣稍微不平均 → 門一直轉', 'c1', { fs: 13.5 }) +
    chip(450, 220, '三顆電壓加起來 ≠ 0', '圈裡只有很小的線圈電阻 r', 'c2', { fs: 13.5 }) +
    calc(345, 262, 210, [['I = ΣV / 3r → 很大', 'r1', 'ta']], { k: 'cc', a: 'middle' }),
    [{ sub: 'Δ 電源有一個缺點：三顆電源自己繞成一圈。', on: 'tri' },
     { sub: '平衡的時候，三顆加起來剛好 0，相安無事。', on: '' },
     { sub: '像三個人推旋轉門：只要力氣稍微不平均，門就一直轉。', on: 'c1 loop' },
     { sub: '三顆電壓加起來只要不是剛好 0，差的那一點點除以很小的電阻 —— 圈裡就有很大的<b>環流</b>。', on: 'c2 cc r1' },
     { sub: '白白發熱，所以實際的電源幾乎都接 Y。', on: '' }]);

  /* 所以最常見的是 Y-Δ */
  const D3 = sc('所以最常見：Y 電源、Δ 負載', 'THE PRACTICAL COMBO',
    chip(160, 140, '電源 → 接 Y', '', 'h1', { fs: 16, acc: true }) +
    chip(160, 190, 'Δ 電源會有環流、白白發熱', '', 'a1', { fs: 13 }) + chip(160, 232, '有中性點可以接地、拉中性線', '', 'a2', { fs: 13 }) +
    chip(470, 140, '負載 → 接 Δ', '', 'h2', { fs: 16, acc: true }) +
    chip(470, 190, '每格直接跨在兩條線上', '', 'b1', { fs: 13 }) + chip(470, 232, '加減一格不影響別格、不用中性線', '', 'b2', { fs: 13 }) +
    T(320, 290, 'Y-Δ：課本說「最實用」的接法', { cls: 'ta', fs: 16, k: 'msg' }),
    [{ sub: '把 Y、Δ 的優缺點放在一起看。', on: '' },
     { sub: '電源：Δ 會有環流，Y 還有中性點可以接地 → <b>電源幾乎都接 Y</b>。', on: 'h1 a1 a2' },
     { sub: '負載：Δ 每格直接夾兩條線，加減負載最方便 → <b>負載常接 Δ</b>。', on: 'h2 b1 b2' },
     { sub: '所以實務上最常見的是 <b>Y-Δ</b>，也就是這一頁一開始的謎題電路。', on: 'msg' }]);

  /* 13 Δ-Y 的問題 */
  const DY = o => sys3(Object.assign({ src: 'D', load: 'Y', x0: 120, x1: 560, vs: ['210∠0°', '210∠−120°', '210∠120°'], z: '40 + j25' }, o));
  const S13 = sc('Δ 電源接 Y 負載', 'DELTA-WYE',
    DY({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    chip(330, 296, '問題：Δ 電源沒有 n，單相等效的回程接哪？', '', 'q', { fs: 13.5, acc: true }),
    [{ sub: '最後一種：Δ 電源（線電壓 210 V）接 Y 負載 40 + j25 Ω（課本 Example 12.5）。', on: 'src lbl line load' },
     { sub: '想用單相等效，卻發現電源那邊<b>沒有中性點 n</b>。', on: 'q' },
     { sub: '單相等效需要一個 n 當回程的地方，Δ 電源給不出來。', on: '' }]);

  /* ═════ 先補課：沿迴路 aANBba 走一圈（使用者 10/20：方法一看不懂） ═════ */
  /* L1 爬山走一圈 */
  const L1 = sc('先補課：走一圈回到家', 'A ROUND TRIP',
    g('path', '<path class="ln" style="fill:none;stroke-width:2.4" d="M140 235 L320 105 L500 180 Z"/>') +
    g('home', '<path class="bgw" d="M124 237 V221 L140 209 L156 221 V237 Z"/>' + T(140, 257, '家', { cls: 't', fs: 13 })) +
    g('up', D.arrow(170, 203, 290, 116, null, 'lna') + T(205, 145, '上坡 +120 m', { cls: 'ta', fs: 13, a: 'end' })) +
    g('dn1', D.arrow(345, 115, 478, 171, null, 'ln') + T(430, 130, '下坡 −50 m', { cls: 't', fs: 13, a: 'start' })) +
    g('dn2', D.arrow(470, 185, 175, 227, null, 'ln') + T(330, 227, '下坡 −70 m', { cls: 't', fs: 13 })) +
    calc(150, 252, 340, [['+120 − 50 − 70 = 0', 'r1', 'ta', 15]], { k: 'cc', a: 'middle', lh: 22 }),
    [{ sub: '方法一要「沿著一圈寫 KVL」。先補課：從家出發爬山，繞一圈回到家。', on: 'path home' },
     { sub: '先上坡 120 公尺。', on: 'up' },
     { sub: '再下坡 50 公尺、又下坡 70 公尺，回到家門口。', on: 'dn1 dn2' },
     { sub: '回到同一個地方，高度一定一樣：上上下下<b>加起來 = 0</b>。', on: 'cc r1' },
     { sub: '電路裡的「高度」就是電壓。繞一圈回到原點，電壓的升降加起來也是 0 —— 這就是 <b>KVL</b>。', on: '' }]);

  /* L2 迴路名字怎麼讀 */
  const LT = [['a', '電源端 a'], ['A', '負載端 A'], ['N', '負載中性點'], ['B', '負載端 B'], ['b', '電源端 b'], ['a', '回到 a']];
  const L2 = sc('aANBba 是一條路線', 'READING THE LOOP NAME',
    LT.map((p, i) => { const x = 95 + i * 90; return g('n' + i, '<circle class="' + (i === 2 ? 'accw' : 'bgw') + '" cx="' + x + '" cy="160" r="22"' + (i === 2 ? ' style="stroke:var(--s-acc);stroke-width:1.8"' : '') + '/>' + T(x, 167, p[0], { cls: 'ta', fs: 20 }) + T(x, 205, p[1], { cls: 'ts', fs: 11.5 }) +
      (i ? D.arrow(x - 64, 160, x - 26, 160, null, 'ln') : '')); }).join('') +
    chip(320, 252, '小寫 = 電源那頭，大寫 = 負載那頭', '', 'c1', { fs: 13.5 }) +
    chip(320, 292, '12.4 的 aABbna 也是同一種讀法', '', 'c2', { fs: 13, acc: true }),
    [{ sub: '課本寫「沿 aANBba」，其實就是<b>一條路線</b>：照字母一個一個走。', on: 'n0' },
     { sub: '從電源的 a 出發，走電線到負載的 A。', on: 'n1' },
     { sub: '穿過 a 相負載到中性點 N，再穿過 b 相負載到 B。', on: 'n2 n3' },
     { sub: '走電線回到電源的 b，最後穿過電源回到 a —— 一圈。', on: 'n4 n5' },
     { sub: '<b>小寫是電源那頭、大寫是負載那頭</b>。12.4 的 aABbna 也是這樣讀。', on: 'c1 c2' }]);

  /* L3 在電路上走一圈 */
  const seg = (key, d) => '<path class="lna" data-k="' + key + '" style="stroke-width:6;opacity:.45;fill:none" d="' + d + '"/>';
  const L3 = sc('在電路上走一圈', 'WALK THE LOOP',
    DY({ z: 'Z<sub>Y</sub>', k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    g('cur', D.arrow(395, 128, 440, 128, null, 'lna') + T(390, 132, 'I<sub>a</sub>', { cls: 'ta', fs: 12.5, a: 'end' }) + D.arrow(395, 188, 440, 188, null, 'lna') + T(390, 192, 'I<sub>b</sub>', { cls: 'ta', fs: 12.5, a: 'end' })) +
    seg('s1', 'M190 140 H470') + seg('s2', 'M470 140 H560') + seg('s3', 'M560 140 V200 H470') + seg('s4', 'M470 200 H190') + seg('s5', 'M190 200 H160 V140 H190') +
    T(330, 131, '0', { cls: 'ta', fs: 14, k: 't1' }) + T(574, 136, '+Z<sub>Y</sub>I<sub>a</sub>', { cls: 'ta', fs: 13, a: 'start', k: 't2' }) +
    T(574, 176, '−Z<sub>Y</sub>I<sub>b</sub>', { cls: 'ta', fs: 13, a: 'start', k: 't3' }) + T(330, 191, '0', { cls: 'ta', fs: 14, k: 't4' }) +
    T(150, 128, '−V<sub>ab</sub>', { cls: 'ta', fs: 13, a: 'end', k: 't5' }) +
    (RV ? RV.dots('M160 140 H560 V200 H160 Z', 'walk', 'slow') : '') +
    chip(320, 296, '順著電流過阻抗 +ZI；逆著電流 −ZI；電源從 − 走到 + 記 −V', '', 'rule', { fs: 12.5, acc: true }),
    [{ sub: '這是課本 Example 12.5 的 Δ-Y 電路。電流 I<sub>a</sub>、I<sub>b</sub> 都往右流進負載。', on: 'src lbl line load cur' },
     { sub: 'a → A：只是一段電線，沒有阻抗，電壓不變：記 0。', on: 's1 t1 walk' },
     { sub: 'A → N：穿過 a 相負載，方向跟 I<sub>a</sub> 一樣 —— 順著電流是「下坡」：記 +Z<sub>Y</sub>I<sub>a</sub>。', on: 's2 t2' },
     { sub: 'N → B：穿過 b 相負載，但方向跟 I<sub>b</sub> <b>相反</b> —— 逆著電流是「上坡」：記 −Z<sub>Y</sub>I<sub>b</sub>。', on: 's3 t3' },
     { sub: 'B → b：又是電線，記 0。', on: 's4 t4' },
     { sub: 'b → a：穿過電源，從它的 − 端走到 + 端，電壓升高 V<sub>ab</sub>：記 −V<sub>ab</sub>。', on: 's5 t5' },
     { sub: '規則只有三條：順著電流 +ZI、逆著電流 −ZI、電源從 − 到 + 記 −V。', on: 'rule' }]);

  /* L4 把一圈加起來 */
  const L4 = sc('一圈加起來 = 0', 'ADD IT UP',
    calc(120, 104, 400, [['a → A：0', 'r1'], ['A → N：+Z<sub>Y</sub>I<sub>a</sub>', 'r2'], ['N → B：−Z<sub>Y</sub>I<sub>b</sub>', 'r3'], ['B → b：0　　b → a：−V<sub>ab</sub>', 'r4'],
      ['−V<sub>ab</sub> + Z<sub>Y</sub>I<sub>a</sub> − Z<sub>Y</sub>I<sub>b</sub> = 0', 'r5', 'ta'], ['⇒ I<sub>a</sub> − I<sub>b</sub> = V<sub>ab</sub> / Z<sub>Y</sub>', 'r6', 'ta']], { k: 'cc', lh: 27 }),
    [{ sub: '把剛剛記下的五段排起來。', on: 'cc r1 r2 r3 r4' },
     { sub: '全部加起來 = 0：這就是講義上那一行 KVL。', on: 'r5' },
     { sub: '移項：I<sub>a</sub> − I<sub>b</sub> = V<sub>ab</sub> / Z<sub>Y</sub>。可是有兩個未知數，怎麼辦？', on: 'r6' }]);

  /* L5 兩支差 120° 的箭頭相減 */
  const L5 = sc('又是兩支差 120° 的箭頭相減', 'SAME GEOMETRY AGAIN',
    ph(180, 210, 66, [{ a: 0, l: 'I<sub>a</sub>', c: 'ln', k: 'pa' }, { a: -120, l: 'I<sub>b</sub>', c: 'ln', k: 'pb' }, { a: 60, m: 1, from: [246, 210], l: '−I<sub>b</sub>', c: 'ln dsh', k: 'nb', ld: [12, 30] }, { a: 30, m: 1.732, l: 'I<sub>a</sub> − I<sub>b</sub>', k: 'pab', ld: [-70, -6] }], { k: 'ax', ax: 100, noTick: true }) +
    calc(340, 108, 280, [['平衡：I<sub>b</sub> = I<sub>a</sub>∠−120°', 'r1'], ['I<sub>a</sub> − I<sub>b</sub> = √3 I<sub>a</sub>∠30°', 'r2', 'ta'], ['I<sub>a</sub> = V<sub>ab</sub>∠−30° / (√3 Z<sub>Y</sub>)', 'r3', 'ta'], ['= 210∠−30° ÷ (1.732 × 47.17∠32°)', 'r4'], ['= 2.57∠−62° A', 'r5', 'ta', 17]], { k: 'cc', lh: 28 }),
    [{ sub: '平衡的話，I<sub>b</sub> 就是 I<sub>a</sub> 轉 −120°，只剩一個未知數。', on: 'ax pa pb cc r1' },
     { sub: 'I<sub>a</sub> − I<sub>b</sub>：跟 PART 1 的線電壓一模一樣的幾何 —— <b>√3 倍、轉 +30°</b>。', on: 'nb pab r2' },
     { sub: '倒過來解出 I<sub>a</sub>：除以 √3、轉 −30°。', on: 'r3' },
     { sub: '帶課本的數字：2.57∠−62° A。', on: 'r4 r5' }]);

  /* L6 先整理一下 */
  const L6 = sc('先整理一下：沿迴路寫 KVL', 'KVL ROUND TRIP',
    calc(90, 106, 460, [['迴路名字 = 路線：aANBba → a→A→N→B→b→a', 'r1'], ['順著電流過阻抗 +ZI，逆著 −ZI', 'r2'], ['穿過電源從 − 到 +：−V', 'r3'], ['走完一圈加起來 = 0', 'r4', 'ta'], ['接下來：方法二更快 —— 換一個等效 Y 電源', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 28 }),
    [{ sub: '先整理一下方法一。', on: 'cc r1' },
     { sub: '正負號只看你走的方向跟電流、跟電源正負端的關係。', on: 'r2 r3' },
     { sub: '走完一圈加起來 = 0，就能解出電流。', on: 'r4' },
     { sub: '方法一要寫方程式；方法二不用寫，直接換電源。看下去。', on: 'r5' }]);

  /* 14 等效 Y 電源 */
  const S14 = sc('換一個「看起來一樣」的 Y 電源', 'EQUIVALENT Y SOURCE',
    ph(180, 210, 75, [{ a: 0, m: 1.2, l: 'V<sub>ab</sub>', c: 'ln', k: 'pab' }, { a: -30, m: 0.69, l: 'V<sub>an</sub>', k: 'pan' }], { k: 'ax', ax: 110 }) +
    calc(350, 120, 265, [['Y 電源：V<sub>ab</sub> = √3 V<sub>an</sub>∠+30°', 'r1', 'tm'], ['倒過來：V<sub>an</sub> = V<sub>ab</sub>/√3 ∠−30°', 'r2'], ['= 121.2∠−30° V', 'r3', 'ta']], { k: 'cc' }),
    [{ sub: '方法二：想像一個 Y 電源，它產生的<b>線電壓</b>跟原本的 Δ 完全一樣 —— 從電線看過去分不出來。', on: 'ax pab cc r1' },
     { sub: '把「√3 倍、+30°」倒過來：<b>除 √3、−30°</b>。', on: 'r2 pan' },
     { sub: '210 ÷ 1.732 = 121.2；0° − 30° = −30°。', on: '' },
     { sub: 'V<sub>an</sub> = 121.2∠−30° V。', on: 'r3' },
     { sub: '如果 Δ 電源每顆還有內阻 Z<sub>s</sub>，換成 Y 後每相變成 Z<sub>s</sub>/3 —— 跟負載換 Y 同一招。', on: '' }]);

  /* 15 Δ-Y 數字 */
  const S15 = sc('變回 Y-Y', 'BACK TO Y-Y',
    single({ x: 80, y: 140, w: 230, h: 115, v: '121.2∠−30°', z: ['40 + j25'], i: 'I<sub>a</sub>', k: 'ckt' }) +
    calc(340, 116, 275, [['Z<sub>Y</sub> = 47.17∠32° Ω', 'r1'], ['I<sub>a</sub> = 121.2∠−30° ÷ 47.17∠32°', 'r2'], ['= 2.57∠−62° A', 'r3', 'ta'], ['I<sub>b</sub> = 2.57∠178°　I<sub>c</sub> = 2.57∠58°', 'r4']], { k: 'cc' }),
    [{ sub: '換完就是普通的單相等效。', on: 'ckt cc r1' },
     { sub: 'I<sub>a</sub> = 2.57∠−62° A。', on: 'r2 r3' },
     { sub: '121.2 ÷ 47.17 = 2.57；−30° − 32° = −62°。', on: '' },
     { sub: '照相序補齊（−182° 換成 +178°；課本這裡印成 −178° 是筆誤）。', on: 'r4' }]);

  /* 16 恍然大悟 */
  const S16 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：線電流是兩格相電流的差', 'r1', 'ta'], ['→ √3 × 19.36 = 33.53 A', 'r2'], ['Δ 負載 → Z<sub>Δ</sub>/3；Δ 電源 → V<sub>ab</sub>/√3∠−30°', 'r3'], ['四種接法全部化回 Y-Y', 'r4', 'ta'], ['下一頁：三相的功率', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 26 }),
    [{ sub: '謎題解開：電線上的電流本來就是兩格負載共用的，I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>。', on: 'cc r1 r2' },
     { sub: '而且不管哪種接法，換一換都能變回 Y-Y。', on: 'r3 r4' },
     { sub: 'Δ 負載 → 除以 3；Δ 電源 → 除 √3、轉 −30°；最後都是單相等效。', on: '' },
     { sub: '課本表 12.1 把四種接法的公式列成一張表 —— 不用死背，記住「全部換成 Y-Y」就能自己推出來。', on: '' },
     { sub: '下一頁（PART 3）：三相的功率為什麼是常數、怎麼算。', on: 'r5' }]);

  __Story('#story2', { id: 'cir-ch12-p2', title: 'CH12 PART 2 Y-Δ、Δ-Δ、Δ-Y', after: '#yd',
    scenes: [S0, S1, S2, D2, D1, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, D3, S13, L1, L2, L3, L4, L5, L6, S14, S15, S16] });
})();

/* ============================================================
   CH12 PART 2 —— 題目版故事（使用者 10/20：觀念講太抽象，題目有電路圖比較懂）
   直接走課本 Example 12.3、12.4、12.5：每題都先看電路圖、再一步一步算；題與題之間一幕「這題學到什麼」。
   每題的畫面直接用 __CH12EX 裡那題的圖解故事（同一份，不重寫）。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12 || !window.__CH12EX) return;
  const K = window.__K12, D = K.D;
  const { calc, sc } = K;
  const { chip } = D;
  const B = window.__CH12EX;
  const take = (id, n) => {
    const it = B.items.find(x => x.id === id);
    return it && it.story ? it.story().map(x => Object.assign({}, x, { t: '題 ' + n + ' · ' + x.t })) : [];
  };
  const P0 = sc('這一頁就是三題', 'THREE PROBLEMS',
    chip(320, 128, '題 1　Example 12.3：Y 電源 → Δ 負載', '學：Δ 負載每格吃線電壓、線電流 = √3 相電流', 'c1', { fs: 14 }) +
    chip(320, 190, '題 2　Example 12.4：Δ 電源 → Δ 負載', '學：Δ 電源每一顆就是線電壓', 'c2', { fs: 14 }) +
    chip(320, 252, '題 3　Example 12.5：Δ 電源 → Y 負載', '學：Δ 電源換成等效 Y 電源', 'c3', { fs: 14 }),
    [{ sub: '這一頁不先講道理，直接做課本的三題。', on: '' },
     { sub: '題 1：Y 電源接 Δ 負載。', on: 'c1' },
     { sub: '題 2：電源也換成 Δ。', on: 'c2' },
     { sub: '題 3：Δ 電源接 Y 負載。每一題都先看電路圖，再一步一步算。', on: 'c3' }]);
  const note = (t, en, rows, subs) => sc(t, en, calc(90, 106, 460, rows.map((r, i) => [r[0], 'r' + i, r[1] || 't']), { k: 'cc', a: 'middle', lh: 30 }),
    subs.map((x, i) => ({ sub: x[0], on: (i ? '' : 'cc ') + x[1] })));
  const T1 = note('題 1 學到什麼', 'TAKEAWAY 1',
    [['Δ 負載每格夾兩條線 → 吃線電壓（√3 倍）'], ['相電流 = 線電壓 ÷ Z<sub>Δ</sub>'], ['線電流 = √3 × 相電流、落後 30°', 'ta'], ['捷徑：Δ 換成 Y（Z<sub>Δ</sub>/3）直接算線電流', 'tm']],
    [['看電路圖：Δ 的每一格都夾在兩條線之間，所以吃線電壓。', 'r0'], ['相電流就是線電壓除以那一格的阻抗。', 'r1'], ['電線在角上接兩格，所以線電流是 √3 倍。', 'r2'], ['懶得算兩次的話，Δ 換成 Y 一步到位。', 'r3']]);
  const T2 = note('題 2 學到什麼', 'TAKEAWAY 2',
    [['Δ 電源每顆夾兩條線 → 相電壓 = 線電壓'], ['沒有線路阻抗：負載電壓 = 電源電壓，直接除'], ['負載還是 Δ → 線電流一樣 √3 倍、落後 30°', 'ta']],
    [['看電路圖：電源也是三角形，每顆電源本身就夾在兩條線之間。', 'r0'], ['中間沒東西分壓，負載拿到的就是電源那顆的電壓。', 'r1'], ['負載是 Δ，所以線電流的規則跟題 1 一模一樣。', 'r2']]);
  const T3 = note('題 3 學到什麼', 'TAKEAWAY 3',
    [['Δ 電源沒有中性點 n → 換一個等效 Y 電源'], ['V<sub>an</sub> = V<sub>ab</sub> / √3 ∠−30°', 'ta'], ['換完就是 Y-Y：單相等效直接算'], ['Y 負載：線電流 = 相電流']],
    [['看電路圖：Δ 電源沒有中性點，單相等效沒地方回去。', 'r0'], ['換一個線電壓一樣的 Y 電源：除 √3、轉 −30°。', 'r1'], ['之後就是 PART 1 會算的 Y-Y。', 'r2'], ['負載是 Y，所以電線上的電流就是每格的電流。', 'r3']]);
  const END = sc('三題比一比', 'SIDE BY SIDE',
    calc(70, 102, 500, [['題 1　Y → Δ：每格 173.2 V；相 19.36 A → 線 33.53 A', 'r1'], ['題 2　Δ → Δ：每格 330 V；相 13.2 A → 線 22.86 A', 'r2'], ['題 3　Δ → Y：每格 121.2 V；相 = 線 = 2.57 A', 'r3'], ['看負載：Δ → 線電流 √3 倍；Y → 一樣', 'r4', 'ta'], ['看電源：Δ → 先 ÷√3、−30° 換成 Y', 'r5', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '三題排在一起。', on: 'cc r1 r2 r3' },
     { sub: '線電流要不要乘 √3，只看<b>負載</b>是不是 Δ。', on: 'r4' },
     { sub: '電源是 Δ 就先換成 Y。下面每一節也是題目先、公式後。', on: 'r5' }]);
  __Story('#story', { id: 'cir-ch12-p2-prob', title: 'CH12 PART 2 用三題學', after: '#yd', afterLabel: '往下自己做題目 ↓',
    scenes: [P0].concat(take('ex12-3', 1), [T1], take('ex12-4', 2), [T2], take('ex12-5', 3), [T3, END]) });
})();
