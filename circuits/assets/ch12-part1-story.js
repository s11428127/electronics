/* ============================================================
   電路學 CH12 PART 1 —— 故事模式（12.1 三相、12.2 平衡電壓與相序、12.3 Y-Y）
   謎題（課本 Example 12.2 的數字）：一台發電機三顆 110 V，三條線送到負載 ——
     (1) 沒有回程線，電流怎麼回來？　(2) 任兩條線之間量到 190.5 V，為什麼？
   答案：三個電流只差 120°，加起來 = 0（回程線上沒電流）；線電壓 = 兩相相減 = √3 × 110 = 190.5 V。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12) return;
  const K = window.__K12, D = K.D;
  const { g, T, calc, ph, sys3, single, wave3, sc } = K;
  const { chip, arrow } = D;
  const RAD = Math.PI / 180;
  const f1 = x => Math.round(x * 10) / 10;
  /* 任意函數畫成曲線 */
  const curve = (fn, x0, w, y0, h, cls, key, n) => {
    let d = ''; n = n || 120;
    for (let i = 0; i <= n; i++) { const t = i / n; d += (i ? ' L' : 'M') + f1(x0 + t * w) + ' ' + f1(y0 - h * fn(t)); }
    return '<path class="' + (cls || 'lna') + '" style="fill:none" d="' + d + '"' + (key ? ' data-k="' + key + '"' : '') + '/>';
  };
  const base = { src: 'Y', load: 'Y', x0: 80, x1: 560, vs: ['110∠0°', '110∠−120°', '110∠120°'], zl: '5 − j2', z: '10 + j8' };
  const S3 = o => sys3(Object.assign({}, base, o));

  /* ═════ 00 謎題 ═════ */
  const S0 = sc('三條線的謎題', 'THE PUZZLE',
    S3({ zl: '', z: 'Z', k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    g('vm', '<circle class="bgw" cx="300" cy="170" r="20"/>' + T(300, 175, 'V', { fs: 15 }) + '<path class="ln dsh" style="fill:none" d="M300 150 V140 M300 190 V200"/>') +
    T(330, 175, '190.5 V？', { cls: 'ta', fs: 20, a: 'start', k: 'vmt' }) +
    chip(320, 294, '只有三條線「去」，沒有線「回來」？', '', 'q1', { fs: 14, acc: true }) +
    T(320, 230, '?', { cls: 'ta', fs: 90, k: 'q' }),
    [{ sub: '發電廠送電：一台發電機、<b>三條電線</b>，接到工廠的負載。', on: 'src line load lbl' },
     { sub: '奇怪的地方一：CH11 的電路都要一條去、一條回。這裡<b>只有三條線出去</b>，電流怎麼回來？', on: 'q1' },
     { sub: '奇怪的地方二：每顆電源都是 110 V，兩條線之間卻量到 <b>190.5 V</b>。', on: 'vm vmt' },
     { sub: '不是 110、也不是 220。這一頁就是要解開這兩個謎。', op: { src: .15, line: .15, load: .15, lbl: .15, vm: .15, vmt: .15, q1: .15 }, on: 'q' }]);

  /* ═════ 01 複習：單相 ═════ */
  const S1 = sc('先複習：單相', 'RECAP: ONE SOURCE',
    single({ x: 150, y: 140, w: 280, h: 120, v: '110∠0°', z: ['Z'], i: '去', k: 'ckt', top: '', bot: '' }) +
    g('back', arrow(330, 278, 200, 278, null, 'ln') + T(265, 300, '回', { cls: 't', fs: 14 })) +
    chip(510, 200, '110∠0°', '相量、rms 值', 'c1', { fs: 14 }),
    [{ sub: '家裡的插座就是 CH11 那種<b>單相</b>電路：一顆電源、一個負載。', on: 'ckt' },
     { sub: '電流從一條線<b>去</b>，從另一條線<b>回來</b>。兩條線缺一不可。', on: 'back' },
     { sub: '電壓寫成相量：110∠0° V（這一章一律是 rms）。', on: 'c1' }]);

  /* ═════ 02 單相的缺點 ═════ */
  const S2 = sc('單相的缺點：一抖一抖', 'ONE PEDAL',
    '<line class="ln2" x1="80" y1="270" x2="580" y2="270"/>' + T(70, 274, '0', { cls: 'ts', fs: 12, a: 'end' }) +
    curve(t => 1 + Math.cos(2 * Math.PI * 3 * t), 80, 500, 270, 70, 'lna', 'pw') +
    T(590, 150, 'p(t)', { cls: 'ta', fs: 14, a: 'end', k: 'pl' }) +
    chip(200, 120, '一個人踩腳踏車', '踩下去有力、到頂點沒力', 'c1', { fs: 13.5 }) +
    chip(450, 120, '馬達也會一抖一抖', '', 'c2', { fs: 13.5 }),
    [{ sub: 'CH11 學過：單相的瞬時功率 p(t) <b>一下大一下小</b>，頻率是電壓的兩倍。', on: 'pw pl' },
     { sub: '像一個人踩腳踏車：踩下去有力，踏板到最高點時沒力。', on: 'c1' },
     { sub: '接在上面的馬達，吃到的力道也是一陣一陣的。', on: 'c2' }]);

  /* ═════ 03 三個人輪流踩 ═════ */
  const S3s = sc('三個人輪流踩', 'THREE RIDERS',
    '<line class="ln2" x1="80" y1="280" x2="580" y2="280"/>' +
    curve(t => 0.5 + 0.5 * Math.cos(2 * Math.PI * 3 * t), 80, 500, 280, 60, 'ln', 'p1') +
    curve(t => 0.5 + 0.5 * Math.cos(2 * Math.PI * 3 * t - 240 * RAD), 80, 500, 280, 60, 'ln dsh', 'p2') +
    curve(t => 0.5 + 0.5 * Math.cos(2 * Math.PI * 3 * t + 240 * RAD), 80, 500, 280, 60, 'ln2', 'p3') +
    g('sum', '<line class="lna" style="stroke-width:4" x1="80" y1="190" x2="580" y2="190"/>' + T(585, 186, '加起來', { cls: 'ta', fs: 13, a: 'end' })) +
    chip(320, 125, '每個人錯開三分之一圈（120°）', '', 'c1', { fs: 14, acc: true }),
    [{ sub: '換成<b>三個人</b>一起踩，每個人錯開三分之一圈。', on: 'p1 c1' },
     { sub: '第二個人、第三個人各晚 120°。', on: 'p2 p3' },
     { sub: '三個人的力氣加起來：<b>變成一條水平線</b> —— 一直很平順。', on: 'sum' },
     { sub: '這就是三相的第一個好處：總功率是常數（12.7 會證明）。', on: '' }]);

  /* ═════ 04 發電機 ═════ */
  const coil = a => { const x = 200 + 82 * Math.cos(a * RAD), y = 205 - 82 * Math.sin(a * RAD); return '<rect class="acc" x="' + f1(x - 7) + '" y="' + f1(y - 13) + '" width="14" height="26" rx="3" transform="rotate(' + (90 - a) + ' ' + f1(x) + ' ' + f1(y) + ')"/>'; };
  const S4 = sc('三相發電機', 'THE GENERATOR',
    g('st', '<circle class="ln" style="fill:none;stroke-width:2.4" cx="200" cy="205" r="82"/>') +
    g('coils', coil(90) + coil(-30) + coil(210) + T(200, 105, 'a', { cls: 'ta', fs: 15 }) + T(290, 262, 'b', { cls: 'ta', fs: 15 }) + T(110, 262, 'c', { cls: 'ta', fs: 15 })) +
    g('rot', '<g><line class="ln" style="stroke-width:9" x1="200" y1="250" x2="200" y2="205"/><line class="lna" style="stroke-width:9" x1="200" y1="205" x2="200" y2="160"/>' +
      T(200, 150, 'N', { cls: 'ta', fs: 13 }) + '<animateTransform attributeName="transform" type="rotate" from="0 200 205" to="-360 200 205" dur="5s" repeatCount="indefinite"/></g>') +
    chip(470, 140, '轉子：一塊會轉的磁鐵', 'rotor', 'c1', { fs: 13.5 }) +
    chip(470, 205, '定子：三組線圈，隔 120°', 'stator', 'c2', { fs: 13.5 }) +
    chip(470, 270, 'N 極掃過誰，誰的電壓最大', '', 'c3', { fs: 13.5, acc: true }),
    [{ sub: '發電機長這樣：外面一圈固定不動的，叫<b>定子</b>。', on: 'st' },
     { sub: '定子上繞三組線圈 a、b、c，<b>各隔 120°</b>。', on: 'coils c2' },
     { sub: '中間一塊磁鐵在轉，叫<b>轉子</b>。', on: 'rot c1' },
     { sub: '磁鐵的 N 極掃過哪組線圈，哪組的電壓就最大 —— 三組輪流。', on: 'c3' }]);

  /* ═════ 05 三個弦波 ═════ */
  const S5 = sc('三個錯開 120° 的弦波', 'THREE SINE WAVES',
    wave3(80, 195, 500, 70, [0, -120, 120], ['wa', 'wb', 'wc'], ['lna', 'ln', 'ln dsh'], 1.5) +
    T(90, 118, 'v<sub>an</sub>（藍）', { cls: 'ta', fs: 13, a: 'start', k: 'la' }) + T(230, 118, 'v<sub>bn</sub>（實線）晚 120°', { cls: 't', fs: 13, a: 'start', k: 'lb' }) + T(420, 118, 'v<sub>cn</sub>（虛線）', { cls: 't', fs: 13, a: 'start', k: 'lc' }) +
    chip(320, 290, '一樣大、一樣頻率，只差 120°', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '線圈 a 發出一個弦波 v<sub>an</sub>。', on: 'wa la' },
     { sub: '磁鐵晚三分之一圈才掃到 b：v<sub>bn</sub> <b>晚 120°</b>。', on: 'wb lb' },
     { sub: '再晚 120° 輪到 c。', on: 'wc lc' },
     { sub: '三個一樣大、一樣頻率，只差 120° —— 這叫<b>平衡三相電壓</b>。', on: 'c1' },
     { sub: '對照一下：如果只有兩組線圈、互相垂直擺，就差 90°，叫<b>兩相</b>系統。三相是 360° ÷ 3 = 120°。', on: '' }]);

  /* ═════ 06 換成相量 ═════ */
  const S6 = sc('換成三支箭頭', 'THREE PHASORS',
    ph(190, 205, 85, [{ a: 0, l: 'V<sub>an</sub>', k: 'pa' }, { a: -120, l: 'V<sub>bn</sub>', c: 'ln', k: 'pb' }, { a: 120, l: 'V<sub>cn</sub>', c: 'ln dsh', k: 'pc' }], { k: 'ax' }) +
    calc(350, 120, 260, [['V<sub>an</sub> = V<sub>p</sub>∠0°', 'r1'], ['V<sub>bn</sub> = V<sub>p</sub>∠−120°', 'r2'], ['V<sub>cn</sub> = V<sub>p</sub>∠+120°', 'r3'], ['V<sub>p</sub>：每相的 rms 值', 'r4', 'tm']], { k: 'cc' }),
    [{ sub: '弦波畫成相量：一支箭頭，長度 = 大小，角度 = 相位。', on: 'ax pa cc r1' },
     { sub: 'b 晚 120° → 往<b>順時針</b>轉 120°。', on: 'pb r2' },
     { sub: 'c 再晚 120°，也就是 +120°。', on: 'pc r3' },
     { sub: '三支一樣長，像賓士的標誌。', on: 'r4' }]);

  /* ═════ 07 加起來 = 0 ═════ */
  const R = 80, o = [230, 250];
  const pA = [o[0] + R, o[1]], pB = [pA[0] + R * Math.cos(-120 * RAD), pA[1] - R * Math.sin(-120 * RAD)];
  const S7 = sc('三支箭頭加起來 = 0', 'THEY CANCEL',
    g('t1', arrow(o[0], o[1], pA[0], pA[1], null, 'lna') + T((o[0] + pA[0]) / 2, o[1] + 20, 'V<sub>an</sub>', { cls: 'ta', fs: 13 })) +
    g('t2', arrow(pA[0], pA[1], f1(pB[0]), f1(pB[1]), null, 'ln') + T(pA[0] + 4, (pA[1] + pB[1]) / 2 - 18, 'V<sub>bn</sub>', { cls: 't', fs: 13, a: 'start' })) +
    g('t3', arrow(f1(pB[0]), f1(pB[1]), o[0], o[1], null, 'ln dsh') + T(o[0] - 6, (o[1] + pB[1]) / 2 - 18, 'V<sub>cn</sub>', { cls: 't', fs: 13, a: 'end' })) +
    g('dot', '<circle class="acc" cx="' + o[0] + '" cy="' + o[1] + '" r="6"/>') +
    chip(470, 140, '頭尾接起來：回到原點', '正三角形', 'c1', { fs: 13.5 }) +
    chip(470, 215, '像三個人往三個方向', '用一樣的力拉一個環 → 環不動', 'c2', { fs: 13.5, acc: true }) +
    calc(345, 250, 250, [['V<sub>an</sub> + V<sub>bn</sub> + V<sub>cn</sub> = 0', 'r1', 'ta']], { k: 'cc', a: 'middle' }),
    [{ sub: '相量相加：把箭頭<b>頭尾接起來</b>。先放 V<sub>an</sub>。', on: 't1' },
     { sub: '在它的尖端接上 V<sub>bn</sub>。', on: 't2' },
     { sub: '再接 V<sub>cn</sub> —— 剛好<b>回到起點</b>！', on: 't3 dot c1' },
     { sub: '就像三個人往三個方向、用一樣的力拉同一個環：環動也不動。', on: 'c2' },
     { sub: '三個平衡電壓加起來 = 0，每一瞬間都是。記住這件事，等一下要用。', on: 'cc r1' }]);

  /* ═════ 08 相序 ═════ */
  const S8 = sc('誰先到：相序', 'PHASE SEQUENCE',
    ph(170, 210, 70, [{ a: 0, l: 'a', k: 'a1' }, { a: -120, l: 'b', c: 'ln', k: 'b1' }, { a: 120, l: 'c', c: 'ln dsh', k: 'c1' }], { k: 'ax1', noTick: true }) +
    ph(470, 210, 70, [{ a: 0, l: 'a', k: 'a2' }, { a: 120, l: 'b', c: 'ln', k: 'b2' }, { a: -120, l: 'c', c: 'ln dsh', k: 'c2' }], { k: 'ax2', noTick: true }) +
    T(170, 120, 'abc 正相序', { cls: 'ta', fs: 15, k: 'l1' }) + T(470, 120, 'acb 負相序', { cls: 't', fs: 15, k: 'l2' }) +
    chip(320, 300, '馬達接反兩條線 → 相序反過來 → 倒轉', '', 'c3', { fs: 13.5, acc: true }),
    [{ sub: '三個人排隊上台，誰第二個上？這就是<b>相序</b>。', on: 'ax1 a1 l1' },
     { sub: 'b 比 a 晚 120°、c 再晚 → 順序 a → b → c：<b>正相序 abc</b>。', on: 'b1 c1' },
     { sub: '如果是 c 比 a 晚 120° → 順序 a → c → b：<b>負相序 acb</b>。', on: 'ax2 a2 b2 c2 l2' },
     { sub: '相序決定三相馬達往哪邊轉：電線對調兩條，馬達就倒轉。', on: 'c3' }]);

  /* ═════ 09 先整理一下 ═════ */
  const S9 = sc('先整理一下', 'SO FAR',
    calc(110, 108, 420, [['平衡三相：一樣大、同頻率、差 120°', 'r1'], ['V<sub>an</sub> + V<sub>bn</sub> + V<sub>cn</sub> = 0', 'r2', 'ta'], ['相序：abc（b 第二）或 acb（c 第二）', 'r3'], ['電壓、電流都用 rms', 'r4'], ['接下來：電源和負載怎麼接？', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: '先整理一下到目前為止的三件事。', on: 'cc r1' },
     { sub: '平衡的三個相電壓，加起來 = 0。', on: 'r2' },
     { sub: '相序只有兩種：abc、acb。', on: 'r3 r4' },
     { sub: '接下來看電源和負載可以怎麼接。', on: 'r5' }]);

  /* ═════ 10 Y 和 Δ ═════ */
  const yShape = (cx, cy, r, key) => g(key, [90, 210, 330].map(a => '<line class="ln" style="stroke-width:2.4" x1="' + cx + '" y1="' + cy + '" x2="' + f1(cx + r * Math.cos(a * RAD)) + '" y2="' + f1(cy - r * Math.sin(a * RAD)) + '"/>').join('') + '<circle class="acc" cx="' + cx + '" cy="' + cy + '" r="6"/>');
  const dShape = (cx, cy, r, key) => g(key, '<path class="ln" style="fill:none;stroke-width:2.4" d="M' + cx + ' ' + (cy - r) + ' L' + f1(cx + r * 0.866) + ' ' + (cy + r / 2) + ' L' + f1(cx - r * 0.866) + ' ' + (cy + r / 2) + ' Z"/>');
  const S10 = sc('兩種接法：Y 和 Δ', 'WYE AND DELTA',
    yShape(180, 200, 75, 'y') + T(180, 300, 'Y 接（星形）', { cls: 't', fs: 15, k: 'yl' }) + T(192, 196, 'n', { cls: 'ta', fs: 14, a: 'start', k: 'yn' }) +
    dShape(460, 210, 80, 'd') + T(460, 300, 'Δ 接（三角形）', { cls: 't', fs: 15, k: 'dl' }) +
    chip(180, 112, '三條繩子綁在同一個結', '中間那個結 = 中性點', 'c1', { fs: 12.5 }) +
    chip(460, 112, '三個人手牽手圍一圈', '每個人跨在兩條線之間', 'c2', { fs: 12.5 }),
    [{ sub: '三個元件（電源或負載）有兩種接法。', on: '' },
     { sub: '<b>Y 接</b>：三個的一端全部綁在同一點 —— 那一點叫<b>中性點</b> n。', on: 'y yl yn c1' },
     { sub: '<b>Δ 接</b>：三個頭尾相接圍成三角形，沒有中性點。', on: 'd dl c2' },
     { sub: 'Δ 的每一個元件，都直接跨在兩條線之間。', on: '' }]);

  /* ═════ 11 四種組合 ═════ */
  const S11 = sc('四種組合', 'FOUR COMBINATIONS',
    chip(170, 140, 'Y-Y', '這一頁', 'c1', { fs: 16, acc: true }) + chip(470, 140, 'Y-Δ', 'PART 2', 'c2', { fs: 16 }) +
    chip(170, 220, 'Δ-Δ', 'PART 2', 'c3', { fs: 16 }) + chip(470, 220, 'Δ-Y', 'PART 2', 'c4', { fs: 16 }) +
    T(320, 290, '全部都能化成 Y-Y 來算 → Y-Y 是基本功', { cls: 'ta', fs: 15, k: 'msg' }),
    [{ sub: '電源 Y 或 Δ、負載 Y 或 Δ：一共四種組合。', on: 'c1 c2 c3 c4' },
     { sub: '好消息：<b>每一種都能換成 Y-Y</b> 來算（Δ 換 Y 的方法在 PART 2）。', on: 'msg' },
     { sub: '所以這一頁先把 Y-Y 練熟。', on: '' }]);

  /* ═════════════ 先補課：Y-Y 到底長什麼樣子（使用者 10/18：Y-Y 講得太抽象） ═════════════ */
  const RV = window.__RV;
  const P = (x, y) => f1(x) + ' ' + f1(y);
  /* 一組線圈：從尾 (x1,y1) 到頭 (x2,y2)，中間一顆交流電源圓圈 */
  const coilSeg = (x1, y1, x2, y2, r) => {
    r = r || 11; const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return '<path class="ln" style="stroke-width:2" d="M' + P(x1, y1) + ' L' + P(mx - ux * r, my - uy * r) + ' M' + P(mx + ux * r, my + uy * r) + ' L' + P(x2, y2) + '"/>' + K.src(f1(mx), f1(my), r);
  };
  /* Y 接的三支腳：中心 (cx,cy)、長 r；角度 a 在上、b 右下、c 左下；kind = 'src' 線圈 | 'load' 電阻 */
  const ANG = [90, 330, 210];
  const tipOf = (cx, cy, r, i) => [cx + r * Math.cos(ANG[i] * RAD), cy - r * Math.sin(ANG[i] * RAD)];
  const yLegs = (cx, cy, r, kind, key) => g(key, [0, 1, 2].map(i => {
    const t = tipOf(cx, cy, r, i);
    return kind === 'load' && RV ? RV.el('r', cx, cy, f1(t[0]), f1(t[1]), '', { L: Math.min(30, r * 0.55) }) : coilSeg(cx, cy, t[0], t[1], Math.min(11, r * 0.17));
  }).join('') + '<circle class="acc" cx="' + cx + '" cy="' + cy + '" r="5.5"/>');
  const heads = (cx, cy, r, names, key, o) => g(key, [0, 1, 2].map(i => {
    const t = tipOf(cx, cy, r, i), dx = [0, 16, -16][i], dy = [-10, 18, 18][i];
    return '<circle class="ink" cx="' + f1(t[0]) + '" cy="' + f1(t[1]) + '" r="3.6"/>' + T(f1(t[0] + dx), f1(t[1] + dy), names[i], { cls: (o && o.cls) || 'ta', fs: (o && o.fs) || 14, a: i === 1 ? 'start' : i === 2 ? 'end' : 'middle' });
  }).join(''));
  const dotsP = (d, key, cls) => (RV ? RV.dots(d, key, cls) : '');

  /* K1 線圈有頭有尾 */
  const K1y = [150, 205, 260];
  const K1 = sc('先補課：每組線圈有兩個頭', 'EACH COIL HAS TWO ENDS',
    g('cl', K1y.map((y, i) => coilSeg(170, y, 330, y, 13) + '<circle class="ink" cx="170" cy="' + y + '" r="3.6"/><circle class="ink" cx="330" cy="' + y + '" r="3.6"/>' +
      T(160, y + 5, '尾', { cls: 'ts', fs: 13, a: 'end' }) + T(330, y - 10, '頭 ' + 'abc'[i], { cls: 'ta', fs: 13 })).join('')) +
    T(110, 210, '發電機裡', { cls: 'ts', fs: 12.5, a: 'middle', k: 'gl' }) +
    g('six', K1y.map(y => '<path class="ln dsh" style="fill:none" d="M330 ' + y + ' H560 M170 ' + y + ' V' + (y + 18) + ' H560"/>').join('')) +
    chip(480, 118, '像三顆電池：各有兩端', '', 'c1', { fs: 13.5 }) +
    chip(470, 300, '各拉兩條線出去 → 6 條電線？太浪費', '', 'c2', { fs: 13.5, acc: true }),
    [{ sub: '先別急著看課本的圖。發電機裡有<b>三組線圈</b> a、b、c。', on: 'cl gl' },
     { sub: '每組線圈都有兩個線頭：一個叫「頭」，一個叫「尾」—— 像一顆電池有兩端。', on: 'c1' },
     { sub: '如果每組各拉兩條線出去，就要 <b>6 條電線</b>。電線很貴，有沒有辦法省？', on: 'six c2' }]);

  /* K2 Y 接：尾巴綁在一起 */
  const yc = [215, 205], yr = 85, ta = tipOf(yc[0], yc[1], yr, 0), tb = tipOf(yc[0], yc[1], yr, 1), tcc = tipOf(yc[0], yc[1], yr, 2);
  const K2 = sc('Y 接：三個尾巴綁在一起', 'TIE THE TAILS → Y',
    yLegs(yc[0], yc[1], yr, 'src', 'legs') +
    g('nn', T(yc[0] + 14, yc[1] - 8, 'n', { cls: 'ta', fs: 16, a: 'start' })) +
    heads(yc[0], yc[1], yr, ['a', 'b', 'c'], 'hd') +
    g('out', '<path class="ln" style="fill:none;stroke-width:2" d="M' + P(ta[0], ta[1]) + ' H580 M' + P(tb[0], tb[1]) + ' H580 M' + P(tcc[0], tcc[1]) + ' V292 H580"/>' +
      T(588, ta[1] + 5, 'a', { cls: 'ta', fs: 14, a: 'start' }) + T(588, tb[1] + 5, 'b', { cls: 'ta', fs: 14, a: 'start' }) + T(588, 297, 'c', { cls: 'ta', fs: 14, a: 'start' })) +
    chip(440, 165, '三條繩子打同一個結', '那個結 = 中性點 n', 'c1', { fs: 13.5 }) +
    chip(440, 205, '三條線（火線）', '', 'c2', { fs: 13, acc: true }),
    [{ sub: '辦法：把三組線圈的<b>尾巴全部接在同一點</b>，畫出來像一個 Y。', on: 'legs' },
     { sub: '就像三條繩子打同一個結。這個結叫<b>中性點 n</b>。', on: 'nn c1' },
     { sub: '三個「頭」各拉一條電線出去：a、b、c 三條<b>火線</b>。', on: 'hd out', off: 'c1' },
     { sub: '6 條線變成 3 條。這就是 <b>Y 接</b>（星形接）。', on: 'c2' }]);

  /* K3 負載也 Y 接 */
  const lc = [430, 205], lr = 85, la = tipOf(lc[0], lc[1], lr, 0), lb2 = tipOf(lc[0], lc[1], lr, 1), lcc = tipOf(lc[0], lc[1], lr, 2);
  const K3 = sc('負載也可以 Y 接', 'A Y-CONNECTED LOAD',
    g('w', '<path class="ln" style="fill:none;stroke-width:2" d="M70 ' + f1(la[1]) + ' H' + f1(la[0]) + ' M70 ' + f1(lb2[1] + 46) + ' H' + f1(lb2[0]) + ' V' + f1(lb2[1]) + ' M70 ' + f1(lcc[1]) + ' H' + f1(lcc[0]) + '"/>' +
      T(62, la[1] + 5, 'a', { cls: 'ta', fs: 14, a: 'end' }) + T(62, lb2[1] + 51, 'b', { cls: 'ta', fs: 14, a: 'end' }) + T(62, lcc[1] + 5, 'c', { cls: 'ta', fs: 14, a: 'end' })) +
    yLegs(lc[0], lc[1], lr, 'load', 'legs') +
    g('nn', T(lc[0] + 14, lc[1] - 8, 'N', { cls: 'ta', fs: 16, a: 'start' })) +
    heads(lc[0], lc[1], lr, ['A', 'B', 'C'], 'hd', { cls: 't', fs: 13 }) +
    chip(200, 185, '三台一樣的電熱器', '一頭接火線、另一頭綁一起', 'c1', { fs: 13.5 }),
    [{ sub: '三條火線送到工廠。', on: 'w' },
     { sub: '工廠有三台一樣的電熱器：每台一頭接一條火線。', on: 'legs hd c1' },
     { sub: '另一頭也全部綁在一起 —— 負載的中性點，叫 <b>N</b>（大寫）。', on: 'nn' },
     { sub: '電源 Y、負載也 Y，合起來就叫 <b>Y-Y</b>。', on: '' }]);

  /* K4 Y-Y 全貌 */
  const sC = [140, 200], lC = [500, 200], r4 = 62;
  const sA = tipOf(sC[0], sC[1], r4, 0), sB = tipOf(sC[0], sC[1], r4, 1), sCc = tipOf(sC[0], sC[1], r4, 2);
  const L4 = (i) => tipOf(lC[0], lC[1], r4, i);
  const dA = 'M' + P(sA[0], sA[1]) + ' H' + f1(L4(0)[0]);
  const dB = 'M' + P(sB[0], sB[1]) + ' H' + f1(L4(2)[0]);
  const dC = 'M' + P(sCc[0], sCc[1]) + ' V300 H' + f1(L4(1)[0]) + ' V' + f1(L4(1)[1]);
  const K4 = sc('Y-Y 的全貌', 'THE WHOLE Y-Y SYSTEM',
    yLegs(sC[0], sC[1], r4, 'src', 'src') + T(sC[0], 116, '發電機（Y）', { cls: 'ts', fs: 12.5, k: 'sl' }) +
    g('load', [0, 1, 2].map(i => { const t = L4(i); return RV ? RV.el('r', lC[0], lC[1], f1(t[0]), f1(t[1]), '', { L: 28 }) : ''; }).join('') + '<circle class="acc" cx="' + lC[0] + '" cy="' + lC[1] + '" r="5.5"/>') +
    T(lC[0], 116, '負載（Y）', { cls: 'ts', fs: 12.5, k: 'll' }) +
    g('lines', '<path class="ln" style="fill:none;stroke-width:2" d="' + dA + ' ' + dB + ' ' + dC + '"/>' +
      T(320, sA[1] - 8, '火線 a', { cls: 'tm', fs: 12 }) + T(320, sB[1] - 8, '火線 b', { cls: 'tm', fs: 12 }) + T(320, 294, '火線 c', { cls: 'tm', fs: 12 })) +
    g('nw', '<path class="ln dsh" style="fill:none" d="M' + sC[0] + ' ' + sC[1] + ' H' + lC[0] + '"/>' + T(320, sC[1] - 8, '中性線', { cls: 'ts', fs: 12 })) +
    dotsP(dA, 'fa', 'ac') + dotsP(dB, 'fb', 'ac') + dotsP(dC, 'fc', 'ac') +
    T(sC[0] + 12, sC[1] - 8, 'n', { cls: 'ta', fs: 14, a: 'start', k: 'sn' }) + T(lC[0] - 12, lC[1] - 8, 'N', { cls: 'ta', fs: 14, a: 'end', k: 'ln2' }),
    [{ sub: '把兩邊接起來：左邊發電機 Y 接，右邊負載 Y 接。', on: 'src sl load ll sn ln2' },
     { sub: '中間三條火線：a 接 A、b 接 B、c 接 C。', on: 'lines' },
     { sub: '電流在三條火線上來回晃（交流），三條各晚 120°。', on: 'fa fb fc' },
     { sub: '還可以再拉一條<b>中性線</b>（虛線）把 n 接到 N。有沒有它，等一下謎題一會講。', on: 'nw' }]);

  /* K5 拉直 = 課本的梯子圖 */
  const K5 = sc('拉直，就是課本的畫法', 'SAME CIRCUIT, TEXTBOOK STYLE',
    S3({ zl: '', z: 'Z', y: [130, 185, 240], x0: 120, x1: 520, vs: ['', '', ''], k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    g('m1', '<rect class="ln" style="fill:none;stroke-width:2.4;stroke:var(--s-acc)" x="108" y="120" width="24" height="130" rx="8"/>') +
    g('m2', '<rect class="ln" style="fill:none;stroke-width:2.4;stroke:var(--s-acc)" x="508" y="120" width="24" height="130" rx="8"/>') +
    chip(140, 292, '左邊這條直線 = 三個尾巴綁在一起（n）', '', 'c1', { fs: 13, a: 'left' }) +
    chip(560, 292, '= N', '', 'c2', { fs: 13, a: 'right' }),
    [{ sub: '課本會把同一個電路<b>拉直</b>，畫成一個梯子。', on: 'src line load lbl' },
     { sub: '左邊那條直的線，就是三個線圈的尾巴接在一起的地方：<b>中性點 n</b>。', on: 'm1 c1' },
     { sub: '右邊那條直線是負載的中性點 N。中間三條橫線就是三條火線。', on: 'm2 c2' },
     { sub: '看到梯子圖，腦中要能還原成兩個 Y 中間拉三條線。', on: '' }]);

  /* K6 電線桿上的三相四線 */
  const wy = [128, 150, 172], ny = 200;
  const K6 = sc('電線桿上就看得到', 'ON THE POLE',
    g('pole', '<rect class="ln" style="fill:var(--s-card);stroke-width:2" x="96" y="112" width="12" height="190"/><line class="ln" style="stroke-width:3" x1="78" y1="124" x2="128" y2="124"/>') +
    g('hw', wy.map((y, i) => '<path class="ln" style="fill:none;stroke-width:2.2" d="M108 ' + y + ' Q 300 ' + (y + 14) + ' 470 ' + y + '"/>' + T(478, y + 5, '火線 ' + 'abc'[i], { cls: 'ta', fs: 12.5, a: 'start' })).join('')) +
    g('nw', '<path class="ln dsh" style="fill:none;stroke-width:2" d="M108 ' + ny + ' Q 300 ' + (ny + 14) + ' 470 ' + ny + '"/>' + T(478, ny + 5, '中性線', { cls: 't', fs: 12.5, a: 'start' }) + '<path class="ln" style="fill:none" d="M96 ' + ny + ' H84 V286"/>' + (RV ? RV.gnd(84, 296) : '')) +
    chip(300, 240, '火線 ↔ 中性線：220 V', '相電壓（給一般電器）', 'c1', { fs: 13.5 }) +
    chip(300, 286, '火線 ↔ 火線：380 V', '線電壓（給三相馬達）', 'c2', { fs: 13.5, acc: true }),
    [{ sub: '台灣大樓、工廠常見的進線：<b>三條火線 ＋ 一條中性線</b>，叫三相四線。', on: 'pole hw' },
     { sub: '第四條就是中性線，接回變壓器的中性點，而且那裡有接地。', on: 'nw' },
     { sub: '一條火線＋中性線：220 V。一般電器只拿一相 —— <b>單相電就是從三相裡拿一相出來</b>。', on: 'c1' },
     { sub: '兩條火線之間：380 V，三相馬達吃這個。為什麼不是 440？下一幕。', on: 'c2' }]);

  /* K7 電錶夾哪裡：相電壓 vs 線電壓 */
  const yc7 = [190, 205], r7 = 80, a7 = tipOf(yc7[0], yc7[1], r7, 0), b7 = tipOf(yc7[0], yc7[1], r7, 1);
  const K7 = sc('電錶夾哪裡：兩種電壓', 'PHASE vs LINE VOLTAGE',
    yLegs(yc7[0], yc7[1], r7, 'src', 'legs') + heads(yc7[0], yc7[1], r7, ['a', 'b', 'c'], 'hd') + T(yc7[0] - 16, yc7[1] + 4, 'n', { cls: 'ta', fs: 15, a: 'end', k: 'nn' }) +
    g('v1', '<path class="ln" style="fill:none" d="M' + P(a7[0], a7[1]) + ' H300 V164 M300 196 V205 H' + yc7[0] + '"/><circle class="ink" cx="300" cy="' + f1(a7[1]) + '" r="3.4"/>' + (RV ? RV.meter(300, 180, 'V') : '') +
      T(324, 176, '220 V', { cls: 'ta', fs: 16, a: 'start' }) + T(324, 196, '相電壓：頭 ↔ 結', { cls: 'ts', fs: 12, a: 'start' })) +
    g('v2', '<path class="ln" style="fill:none" d="M300 ' + f1(a7[1]) + ' H470 V229 M470 261 V' + f1(b7[1] + 28) + ' H' + f1(b7[0]) + ' V' + f1(b7[1]) + '"/>' + (RV ? RV.meter(470, 245, 'V') : '') +
      T(494, 241, '380 V', { cls: 'ta', fs: 16, a: 'start' }) + T(494, 261, '線電壓：頭 ↔ 頭', { cls: 'ts', fs: 12, a: 'start' })) +
    chip(400, 292, '380 = 220 × √3（不是 × 2）', '', 'c1', { fs: 13, acc: true }),
    [{ sub: '同一個 Y 接電源，電錶可以夾兩種地方。', on: 'legs hd nn' },
     { sub: '夾「火線 a」和「中性點 n」：量到一組線圈自己的電壓，叫<b>相電壓</b>。', on: 'v1' },
     { sub: '夾「火線 a」和「火線 b」：中間隔了兩組線圈，叫<b>線電壓</b>。', on: 'v2' },
     { sub: '兩組線圈的電壓差 120°，不是排成一直線，所以只有 √3 倍（1.732），不是 2 倍。謎題二會證明。', on: 'c1' }]);

  /* K8 Y 接的電流只有一種 */
  const K8 = sc('Y 接：電流只有一種', 'ONE CURRENT IN Y',
    g('ckt', '<path class="ln" style="fill:none;stroke-width:2" d="M90 172 V200 H118 M162 200 H400 M460 200 H500 V230"/>' + K.src(140, 200, 14) + (RV ? RV.el('r', 400, 200, 460, 200, '', { L: 40 }) : '') +
      T(140, 178, '線圈 a', { cls: 'ts', fs: 12 }) + T(280, 190, '火線 a', { cls: 'ts', fs: 12 }) + T(430, 182, '負載 A', { cls: 'ts', fs: 12 }) +
      T(84, 168, 'n', { cls: 'ta', fs: 14, a: 'end' }) + T(506, 236, 'N', { cls: 'ta', fs: 14, a: 'start' })) +
    dotsP('M90 200 H500', 'flow', '') +
    chip(320, 128, '一條路走到底，中間沒有岔路', '像單線道：同一批車從頭開到尾', 'c1', { fs: 13.5 }) +
    calc(150, 252, 340, [['Y 接：線電流 I<sub>L</sub> = 相電流 I<sub>p</sub>', 'r1', 'ta', 15]], { k: 'cc', a: 'middle' }),
    [{ sub: '只看 a 相：線圈 a → 火線 a → 負載 A，一路接下去。', on: 'ckt' },
     { sub: '電流從頭走到尾，中間<b>沒有岔路</b>。', on: 'flow c1' },
     { sub: '所以電線上的電流（線電流）就是線圈、負載裡的電流（相電流）。Y 接只有一種電流。', on: 'cc r1' },
     { sub: 'Δ 接就不一樣了，會有岔路 —— 那是 PART 2 的故事。', on: '' }]);

  /* K9 Y-Y 拿來幹嘛 */
  const K9 = sc('Y-Y 拿來幹嘛？', 'WHY USE Y-Y?',
    chip(60, 122, '① 有中性點 → 一次給兩種電壓', '220 V 給電器、380 V 給馬達', 'c1', { fs: 14, a: 'left' }) +
    chip(60, 172, '② 中性點接地 → 比較安全', '火線對地只有相電壓，不是線電壓', 'c2', { fs: 14, a: 'left' }) +
    chip(60, 222, '③ 平衡時中性線沒電流', '長途輸電只拉三條線就夠', 'c3', { fs: 14, a: 'left' }) +
    chip(60, 272, '④ 發電機幾乎都接 Y', 'Δ 電源會有環流（PART 2）', 'c4', { fs: 14, a: 'left', acc: true }),
    [{ sub: 'Y 接有一個 Δ 沒有的東西：<b>中性點</b>。一套線同時給 220 V 和 380 V。', on: 'c1' },
     { sub: '中性點可以接地，火線對地的電壓就只有相電壓，比較安全。', on: 'c2' },
     { sub: '三相平衡時中性線上沒有電流，長途的高壓線乾脆只拉三條。', on: 'c3' },
     { sub: '所以發電機、變壓器出口幾乎都是 Y。<b>Y-Y 也是所有三相題目的基準</b>：別的接法都換成它來算。', on: 'c4' }]);

  /* K10 每一相串了哪些東西 */
  const K10 = sc('每一相串了哪些東西', 'WHAT IS IN SERIES',
    single({ x: 80, y: 132, w: 480, h: 96, v: 'V<sub>an</sub>', z: ['Z<sub>s</sub>', 'Z<sub>ℓ</sub>', 'Z<sub>L</sub>'], k: 'ckt', top: 'a', bot: 'n' }) +
    T(160, 166, '發電機線圈本身', { cls: 'ts', fs: 12, k: 'l1' }) + T(320, 166, '電線', { cls: 'ts', fs: 12, k: 'l2' }) + T(480, 166, '負載', { cls: 'ts', fs: 12, k: 'l3' }) +
    calc(110, 236, 420, [['Z<sub>Y</sub> = Z<sub>s</sub> + Z<sub>ℓ</sub> + Z<sub>L</sub>', 'r1', 'ta'], ['題目沒給 Z<sub>s</sub>、Z<sub>ℓ</sub> → 當成 0', 'r2', 'tm']], { k: 'cc', a: 'middle', lh: 24 }),
    [{ sub: '把 a 相的路一段一段看：電流從線圈 a 出發。', on: 'ckt' },
     { sub: '線圈本身有一點阻抗 Z<sub>s</sub>，電線也有 Z<sub>ℓ</sub>，最後才到負載 Z<sub>L</sub>。', on: 'l1 l2 l3' },
     { sub: '像水從水塔出來，經過出水口、水管、水龍頭：阻力一路<b>串起來</b>。', on: 'cc r1' },
     { sub: '題目沒給線圈、電線的阻抗，就當 0，Z<sub>Y</sub> 只剩負載。', on: 'r2' }]);

  /* K11 先整理一下 */
  const K11 = sc('先整理一下：Y-Y', 'Y-Y SO FAR',
    calc(80, 104, 480, [['Y 接：三個尾巴接在一起 = 中性點 n、N', 'r1'], ['相電壓：火線 ↔ 中性點（220 V）', 'r2'], ['線電壓：火線 ↔ 火線（380 V = √3 倍）', 'r3', 'ta'], ['Y 接：線電流 = 相電流', 'r4'], ['每相：Z<sub>Y</sub> = Z<sub>s</sub> + Z<sub>ℓ</sub> + Z<sub>L</sub>', 'r5'], ['接下來：回到謎題的電路來算', 'r6', 'tm']], { k: 'cc', a: 'middle', lh: 27 }),
    [{ sub: '先整理一下 Y-Y 是什麼。', on: 'cc r1' },
     { sub: '兩種電壓：相電壓夾火線和中性點，線電壓夾兩條火線。', on: 'r2 r3' },
     { sub: '電流只有一種；每相的阻抗串起來相加。', on: 'r4 r5' },
     { sub: '有了這些，回到開頭那兩個謎題。', on: 'r6' }]);

  /* ═════ 12 Y-Y 電路 ═════ */
  const S12 = sc('Y-Y 電路', 'THE Y-Y CIRCUIT',
    S3({ k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    chip(320, 296, '每相串著：線路 5 − j2 ＋ 負載 10 + j8', '', 'c1', { fs: 13.5 }),
    [{ sub: '回到謎題的電路（課本 Example 12.2）：Y 接電源，三顆 110 V。', on: 'src lbl' },
     { sub: '三條線，每條有線路阻抗 5 − j2 Ω。', on: 'line' },
     { sub: 'Y 接負載，每相 10 + j8 Ω，中性點 N。', on: 'load' },
     { sub: '每一相上，線路和負載是<b>串聯</b>的。', on: 'c1' }]);

  /* ═════ 13 解謎一：回程電流 ═════ */
  const S13 = sc('解謎一：回程線在哪？', 'WHERE IS THE RETURN?',
    S3({ n: true, y: [122, 172, 222], k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl', n: 'nl' } }) +
    g('ia', arrow(165, 110, 215, 110, null, 'lna') + T(221, 114, 'I<sub>a</sub>', { cls: 'ta', fs: 13, a: 'start' })) +
    g('ib', arrow(165, 160, 215, 160, null, 'lna') + T(221, 164, 'I<sub>b</sub>', { cls: 'ta', fs: 13, a: 'start' })) +
    g('ic', arrow(165, 210, 215, 210, null, 'lna') + T(221, 214, 'I<sub>c</sub>', { cls: 'ta', fs: 13, a: 'start' })) +
    T(320, 292, 'I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>) = 0', { cls: 'ta', fs: 14, k: 'eq' }),
    [{ sub: '想像有一條回程線（<b>中性線</b>，虛線）把 N 接回 n。', on: 'src line load lbl nl' },
     { sub: '三條線的電流在 N 會合，然後從中性線回去。', on: 'ia ib ic' },
     { sub: '三個電流也是「一樣大、差 120°」—— 跟三個電壓一樣，<b>加起來 = 0</b>！', on: 'eq' },
     { sub: '中性線上根本沒有電流：拿掉也沒差。每條線輪流當別人的回程線。', op: { nl: 0.25 } }]);

  /* ═════ 14 只算一相 ═════ */
  const S14 = sc('平衡 → 只算一相', 'ONE PHASE IS ENOUGH',
    S3({ hl: 0, y: [122, 172, 222], k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl', hl: 'hl' } }) +
    g('nn', '<path class="lna dsh" style="fill:none" d="M80 222 V258 H560 V222"/>') +
    T(320, 284, 'n、N 同電位 → a 相自己成一圈', { cls: 'ta', fs: 13, k: 'nt' }),
    [{ sub: '既然三相只是同一件事錯開 120°…', on: 'src line load lbl' },
     { sub: '…那就<b>只拿出 a 相</b>來算。', on: 'hl' },
     { sub: '中性線沒電流 → n 跟 N 一樣高，a 相自己成一個迴路：叫<b>單相等效電路</b>。', on: 'nn nt' }]);

  /* ═════ 15 算 a 相 ═════ */
  const S15 = sc('算 a 相，再轉 120°', 'SOLVE AND ROTATE',
    single({ x: 70, y: 140, w: 220, h: 115, v: '110∠0°', z: ['5 − j2', '10 + j8'], i: 'I<sub>a</sub>', k: 'ckt' }) +
    calc(320, 108, 295, [['Z<sub>Y</sub> = 15 + j6 = 16.155∠21.8° Ω', 'r1'], ['I<sub>a</sub> = 110∠0° ÷ 16.155∠21.8°', 'r2'], ['= 6.81∠−21.8° A', 'r3', 'ta'], ['I<sub>b</sub> = 6.81∠−141.8° A', 'r4'], ['I<sub>c</sub> = 6.81∠98.2° A', 'r5']], { k: 'cc' }),
    [{ sub: '單相等效電路：一顆 110∠0°，串兩個阻抗。', on: 'ckt' },
     { sub: '串聯相加：Z<sub>Y</sub> = 15 + j6 Ω。', on: 'cc r1' },
     { sub: '歐姆定律：I<sub>a</sub> = 6.81∠−21.8° A。', on: 'r2 r3' },
     { sub: '另外兩相不用重算：<b>轉 −120°、+120°</b> 就好。', on: 'r4 r5' }]);

  /* ═════ 16 解謎二：線電壓 ═════ */
  const tipA = [190 + 70, 210];
  const S16 = sc('解謎二：兩條線之間', 'LINE VOLTAGE',
    ph(190, 210, 70, [{ a: 0, l: 'V<sub>an</sub>', k: 'pa', c: 'ln' }, { a: -120, l: 'V<sub>bn</sub>', k: 'pb', c: 'ln' }, { a: 60, m: 1, from: tipA, l: '−V<sub>bn</sub>', c: 'ln dsh', k: 'nb', ld: [12, 34] }, { a: 30, m: 1.732, l: 'V<sub>ab</sub>', k: 'pab', ld: [-58, -6] }], { k: 'ax', ax: 105 }) +
    calc(345, 110, 270, [['V<sub>ab</sub> = V<sub>an</sub> − V<sub>bn</sub>', 'r1'], ['= √3 V<sub>p</sub>∠30°', 'r2'], ['= 1.732 × 110', 'r3'], ['= 190.5 V', 'r4', 'ta', 18]], { k: 'cc' }),
    [{ sub: '電錶夾在線 a 和線 b 之間，量的是 V<sub>ab</sub> = V<sub>an</sub> − V<sub>bn</sub>。', on: 'ax pa pb cc r1' },
     { sub: '減 V<sub>bn</sub> = 加一支反方向的箭頭。', on: 'nb' },
     { sub: '兩支差 120° 的箭頭這樣相減，合起來變 <b>√3 倍、往前轉 30°</b>。', on: 'pab r2' },
     { sub: '110 × 1.732 = <b>190.5 V</b>。謎題二解開了！', on: 'r3 r4' }]);

  /* ═════ 17 恍然大悟 ═════ */
  const S17 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎一：三個電流加起來 = 0', 'r1', 'ta'], ['→ 中性線沒電流，三條線就夠', 'r2'], ['謎二：線電壓 = √3 × 相電壓', 'r3', 'ta'], ['→ 110 V × 1.732 = 190.5 V', 'r4'], ['下一頁：負載換成 Δ 會怎樣？', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 26 }),
    [{ sub: '回頭看謎題一：三個電流一樣大、差 120°，加起來 = 0。', on: 'cc r1' },
     { sub: '回程線上沒電流 → 三條線就能送三相電。這是三相省電線的原因之一。', on: 'r2' },
     { sub: '謎題二：線電壓是兩相相減，√3 倍。', on: 'r3 r4' },
     { sub: '下一頁（PART 2）：負載接成 Δ，每格吃的就是這個 √3 倍的線電壓了。', on: 'r5' }]);

  __Story('#story', { id: 'cir-ch12-p1', title: 'CH12 PART 1 三相電壓與 Y-Y', after: '#intro',
    scenes: [S0, S1, S2, S3s, S4, S5, S6, S7, S8, S9, S10, S11, K1, K2, K3, K4, K5, K6, K7, K8, K9, K10, K11, S12, S13, S14, S15, S16, S17] });
})();
