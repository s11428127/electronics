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
     { sub: '在電線 a 上量電流：<b>33.53 A</b>。', on: 'm1' },
     { sub: '在負載 AB 那一格量電流：只有 <b>19.36 A</b>。', on: 'm2' },
     { sub: '電線送過去 33.53，負載只吃 19.36？多出來的電流跑去哪？', on: 'q' }]);

  /* 01 複習 */
  const S1 = sc('先複習 PART 1', 'RECAP OF PART 1',
    ph(180, 210, 60, [{ a: 0, l: 'V<sub>an</sub>', c: 'ln', k: 'pa' }, { a: -120, l: 'V<sub>bn</sub>', c: 'ln', k: 'pb' }, { a: 30, m: 1.732, l: 'V<sub>ab</sub>', k: 'pab' }], { k: 'ax', ax: 110 }) +
    calc(350, 120, 260, [['線電壓 = 兩相相減', 'r1'], ['V<sub>ab</sub> = √3 V<sub>an</sub>∠+30°', 'r2', 'ta'], ['平衡 → 只算一相', 'r3'], ['I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>', 'r4']], { k: 'cc' }),
    [{ sub: '先複習：兩條線之間的電壓 = 兩個相電壓相減。', on: 'ax pa pb cc r1' },
     { sub: '結果是 <b>√3 倍、往前轉 30°</b>。', on: 'pab r2' },
     { sub: '平衡的話只算 a 相，其他轉 120°。', on: 'r3 r4' }]);

  /* 02 Δ 是什麼 */
  const tri = (cx, cy, r, key) => g(key, '<path class="ln" style="fill:none;stroke-width:2.4" d="M' + cx + ' ' + (cy - r) + ' L' + f1(cx + r * 0.866) + ' ' + (cy + r / 2) + ' L' + f1(cx - r * 0.866) + ' ' + (cy + r / 2) + ' Z"/>' +
    [[cx, cy - r, 'A'], [cx + r * 0.866, cy + r / 2, 'C'], [cx - r * 0.866, cy + r / 2, 'B']].map(p => '<circle class="acc" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="5"/>' + T(p[0] + (p[2] === 'C' ? 14 : p[2] === 'B' ? -14 : 0), p[1] + (p[2] === 'A' ? -12 : 18), p[2], { cls: 'ta', fs: 14 })).join(''));
  const S2 = sc('Δ 接：手牽手圍一圈', 'DELTA',
    tri(200, 215, 85, 'tri') +
    chip(460, 140, '三個人手牽手圍一圈', '每個人左手、右手各抓一條線', 'c1', { fs: 13.5 }) +
    chip(460, 220, '沒有中性點', '不像 Y 有一個共同的結', 'c2', { fs: 13.5 }) +
    chip(460, 290, '每格都跨在兩條線之間', '', 'c3', { fs: 13.5, acc: true }),
    [{ sub: 'Δ 接：三格負載頭尾相接圍成三角形，三個角 A、B、C 接三條線。', on: 'tri' },
     { sub: '像三個人手牽手圍成一圈。', on: 'c1' },
     { sub: '它<b>沒有中性點</b>。', on: 'c2' },
     { sub: '重點：<b>每一格都直接跨在兩條線之間</b>。', on: 'c3' }]);

  /* 03 每格吃線電壓 */
  const S3 = sc('每格吃的是線電壓', 'Δ SEES LINE VOLTAGE',
    YD({ hlz: 0, k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    chip(320, 296, 'V<sub>AB</sub> = V<sub>ab</sub> = √3 × 100∠(10° + 30°) = 173.2∠40° V', '', 'v', { fs: 13.5, acc: true }),
    [{ sub: '看藍色那一格：一端接 A、一端接 B。', on: 'src lbl line load' },
     { sub: '它兩端的電壓就是 A、B 兩條線之間的<b>線電壓</b> —— PART 1 剛複習的 √3 倍！', on: 'v' },
     { sub: '所以 Δ 負載每格吃到 173.2 V，比 Y 接的 100 V 大。', on: '' }]);

  /* 04 兩種電流 */
  const S4 = sc('兩種電流，兩個名字', 'PHASE vs LINE CURRENT',
    YD({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    g('il', arrow(250, 128, 310, 128, null, 'lna') + T(316, 132, 'I<sub>a</sub> 線電流', { cls: 'ta', fs: 13, a: 'start' })) +
    g('ip', arrow(516, 150, 516, 186, null, 'lna') + T(522, 172, 'I<sub>AB</sub>', { cls: 'ta', fs: 13, a: 'start' })),
    [{ sub: '電線上的電流叫<b>線電流</b> I<sub>a</sub>。', on: 'src lbl line load il' },
     { sub: '流過某一格負載的叫<b>相電流</b> I<sub>AB</sub>。', on: 'ip' },
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
     { sub: 'KCL：進 = 出 → <b>I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub></b>。線電流是兩格電流的差！', on: 'cc r1' }]);

  /* 06 相減 */
  const tipAB = [190 + 70 * Math.cos(13.43 * RAD), 210 - 70 * Math.sin(13.43 * RAD)];
  const S6 = sc('兩支差 120° 的箭頭相減', 'SUBTRACTING PHASORS',
    ph(190, 210, 70, [{ a: 13.43, l: 'I<sub>AB</sub>', c: 'ln', k: 'p1' }, { a: 133.43, l: 'I<sub>CA</sub>', c: 'ln', k: 'p3' }, { a: -46.57, from: tipAB, l: '−I<sub>CA</sub>', c: 'ln dsh', k: 'm3' }, { a: -16.57, m: 1.732, l: 'I<sub>a</sub>', k: 'pa', ld: [6, 10] }], { k: 'ax', ax: 120 }) +
    calc(370, 120, 245, [['又是「差 120° 相減」', 'r1', 'tm'], ['大小：√3 倍', 'r2', 'ta'], ['方向：往後轉 30°', 'r3', 'ta'], ['I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°', 'r4']], { k: 'cc' }),
    [{ sub: 'I<sub>AB</sub> 和 I<sub>CA</sub> 一樣大、差 120°。', on: 'ax p1 p3' },
     { sub: '減 I<sub>CA</sub> = 加一支反方向的箭頭。', on: 'm3 cc r1' },
     { sub: '合起來：<b>√3 倍</b> —— 跟 PART 1 的線電壓一模一樣的幾何！', on: 'pa r2' },
     { sub: '方向往後轉 30°（落後）。', on: 'r3 r4' }]);

  /* 07 算出來 */
  const S7 = sc('代數字：謎題解開', 'THE NUMBERS',
    calc(80, 108, 480, [['Z<sub>Δ</sub> = 8 + j4 = 8.944∠26.57° Ω', 'r1'], ['I<sub>AB</sub> = 173.2∠40° ÷ 8.944∠26.57° = 19.36∠13.43° A', 'r2'], ['I<sub>a</sub> = √3 × 19.36∠(13.43° − 30°)', 'r3'], ['= 33.53∠−16.57° A', 'r4', 'ta'], ['33.53 ÷ 19.36 = 1.732 = √3 ✓', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: '負載阻抗換極座標。', on: 'cc r1' },
     { sub: '每格吃 173.2∠40° V：相電流 19.36 A —— 就是電表量到的。', on: 'r2' },
     { sub: '線電流 = √3 倍、往後 30°。', on: 'r3 r4' },
     { sub: '33.53 A！電流沒有多出來 —— 電線上的電流本來就是<b>兩格合起來</b>的。', on: 'r5' }]);

  /* 08 整理 */
  const S8 = sc('先整理一下', 'SO FAR',
    calc(110, 108, 420, [['Δ 負載每格吃線電壓', 'r1'], ['相電流 I<sub>AB</sub> = V<sub>AB</sub> / Z<sub>Δ</sub>', 'r2'], ['線電流 = √3 × 相電流，落後 30°', 'r3', 'ta'], ['（因為 I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>）', 'r4', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: '先整理 Y-Δ：負載每格吃線電壓。', on: 'cc r1 r2' },
     { sub: '線電流是兩格相電流的差，√3 倍、落後 30°。', on: 'r3 r4' }]);

  /* 09 方法二 */
  const S9 = sc('另一條路：Δ 換成 Y', 'METHOD 2: Δ → Y',
    single({ x: 80, y: 140, w: 240, h: 115, v: '100∠10°', z: ['Z<sub>Δ</sub>/3'], i: 'I<sub>a</sub>', k: 'ckt' }) +
    calc(350, 116, 265, [['從外面看，三角形 = 縮小的 Y', 'r1', 'tm'], ['Z<sub>Y</sub> = Z<sub>Δ</sub>/3 = 2.981∠26.57°', 'r2'], ['I<sub>a</sub> = 100∠10° ÷ 2.981∠26.57°', 'r3'], ['= 33.54∠−16.57° A ✓', 'r4', 'ta']], { k: 'cc' }),
    [{ sub: '從三條電線往裡看，Δ 負載可以換成每相只有<b>三分之一</b>的 Y 負載。', on: 'cc r1 r2' },
     { sub: '換完就是 Y-Y：單相等效直接算線電流。', on: 'ckt r3' },
     { sub: '一步就得到 33.54 A，跟方法一一樣。', on: 'r4' }]);

  /* 10 Δ-Δ */
  const DD = o => sys3(Object.assign({ src: 'D', load: 'D', x0: 120, x1: 560, vs: ['330∠0°', '330∠−120°', '330∠120°'], z: '20 − j15' }, o));
  const S10 = sc('電源也接 Δ', 'DELTA-DELTA',
    DD({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    chip(330, 296, '電源每顆也跨在兩條線之間 → 相電壓 = 線電壓', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '電源也可以接成 Δ（課本 Example 12.4）。', on: 'src lbl' },
     { sub: '電源每一顆本身就跨在兩條線之間：<b>電源的相電壓就是線電壓</b>。', on: 'c1' },
     { sub: '中間沒有線路阻抗 → 負載每格吃的就是電源那一顆的電壓。', on: 'line load' }]);

  /* 11 Δ-Δ 好算 */
  const S11 = sc('Δ-Δ 最好算', 'EASIEST CASE',
    calc(80, 116, 480, [['I<sub>AB</sub> = 330∠0° ÷ (20 − j15)', 'r1'], ['= 330∠0° ÷ 25∠−36.87° = 13.2∠36.87° A', 'r2'], ['I<sub>a</sub> = √3 × 13.2∠(36.87° − 30°) = 22.86∠6.87° A', 'r3', 'ta'], ['負載還是 Δ → 線電流照樣 √3 倍', 'r4', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: '直接除：電源電壓 ÷ 負載阻抗。', on: 'cc r1 r2' },
     { sub: '線電流照 Δ 負載的規則：√3 倍、落後 30°。', on: 'r3 r4' }]);

  /* 12 環流 */
  const S12 = sc('Δ 電源的麻煩：環流', 'CIRCULATING CURRENT',
    tri(180, 215, 85, 'tri') + g('loop', '<circle class="lna dsh" style="fill:none" cx="180" cy="230" r="34"/>' + D.arrow(206, 208, 212, 218, null, 'lna')) +
    chip(450, 140, '像三個人推旋轉門', '力氣稍微不平均 → 門一直轉', 'c1', { fs: 13.5 }) +
    chip(450, 220, '三顆電壓加起來 ≠ 0', '圈裡只有很小的線圈電阻 r', 'c2', { fs: 13.5 }) +
    calc(345, 262, 210, [['I = ΣV / 3r → 很大', 'r1', 'ta']], { k: 'cc', a: 'middle' }),
    [{ sub: 'Δ 電源有一個缺點：三顆電源自己繞成一圈。', on: 'tri' },
     { sub: '像三個人推旋轉門：只要力氣稍微不平均，門就一直轉。', on: 'c1 loop' },
     { sub: '三顆電壓加起來只要不是剛好 0，差的那一點點除以很小的電阻 —— 圈裡就有很大的<b>環流</b>。', on: 'c2 cc r1' },
     { sub: '白白發熱，所以實際的電源幾乎都接 Y。', on: '' }]);

  /* 13 Δ-Y 的問題 */
  const DY = o => sys3(Object.assign({ src: 'D', load: 'Y', x0: 120, x1: 560, vs: ['210∠0°', '210∠−120°', '210∠120°'], z: '40 + j25' }, o));
  const S13 = sc('Δ 電源接 Y 負載', 'DELTA-WYE',
    DY({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    chip(330, 296, '問題：Δ 電源沒有 n，單相等效的回程接哪？', '', 'q', { fs: 13.5, acc: true }),
    [{ sub: '最後一種：Δ 電源（線電壓 210 V）接 Y 負載 40 + j25 Ω（課本 Example 12.5）。', on: 'src lbl line load' },
     { sub: '想用單相等效，卻發現電源那邊<b>沒有中性點 n</b>。', on: 'q' }]);

  /* 14 等效 Y 電源 */
  const S14 = sc('換一個「看起來一樣」的 Y 電源', 'EQUIVALENT Y SOURCE',
    ph(180, 210, 75, [{ a: 0, m: 1.2, l: 'V<sub>ab</sub>', c: 'ln', k: 'pab' }, { a: -30, m: 0.69, l: 'V<sub>an</sub>', k: 'pan' }], { k: 'ax', ax: 110 }) +
    calc(350, 120, 265, [['Y 電源：V<sub>ab</sub> = √3 V<sub>an</sub>∠+30°', 'r1', 'tm'], ['倒過來：V<sub>an</sub> = V<sub>ab</sub>/√3 ∠−30°', 'r2'], ['= 121.2∠−30° V', 'r3', 'ta']], { k: 'cc' }),
    [{ sub: '想像一個 Y 電源，它產生的<b>線電壓</b>跟原本的 Δ 完全一樣 —— 從電線看過去分不出來。', on: 'ax pab cc r1' },
     { sub: '把「√3 倍、+30°」倒過來：<b>除 √3、−30°</b>。', on: 'r2 pan' },
     { sub: 'V<sub>an</sub> = 121.2∠−30° V。', on: 'r3' }]);

  /* 15 Δ-Y 數字 */
  const S15 = sc('變回 Y-Y', 'BACK TO Y-Y',
    single({ x: 80, y: 140, w: 230, h: 115, v: '121.2∠−30°', z: ['40 + j25'], i: 'I<sub>a</sub>', k: 'ckt' }) +
    calc(340, 116, 275, [['Z<sub>Y</sub> = 47.17∠32° Ω', 'r1'], ['I<sub>a</sub> = 121.2∠−30° ÷ 47.17∠32°', 'r2'], ['= 2.57∠−62° A', 'r3', 'ta'], ['I<sub>b</sub> = 2.57∠178°　I<sub>c</sub> = 2.57∠58°', 'r4']], { k: 'cc' }),
    [{ sub: '換完就是普通的單相等效。', on: 'ckt cc r1' },
     { sub: 'I<sub>a</sub> = 2.57∠−62° A。', on: 'r2 r3' },
     { sub: '照相序補齊（−182° 換成 +178°；課本這裡印成 −178° 是筆誤）。', on: 'r4' }]);

  /* 16 恍然大悟 */
  const S16 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：線電流是兩格相電流的差', 'r1', 'ta'], ['→ √3 × 19.36 = 33.53 A', 'r2'], ['Δ 負載 → Z<sub>Δ</sub>/3；Δ 電源 → V<sub>ab</sub>/√3∠−30°', 'r3'], ['四種接法全部化回 Y-Y', 'r4', 'ta'], ['下一頁：三相的功率', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 26 }),
    [{ sub: '謎題解開：電線上的電流本來就是兩格負載共用的，I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>。', on: 'cc r1 r2' },
     { sub: '而且不管哪種接法，換一換都能變回 Y-Y。', on: 'r3 r4' },
     { sub: '下一頁（PART 3）：三相的功率為什麼是常數、怎麼算。', on: 'r5' }]);

  __Story('#story', { id: 'cir-ch12-p2', title: 'CH12 PART 2 Y-Δ、Δ-Δ、Δ-Y', after: '#yd',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16] });
})();
