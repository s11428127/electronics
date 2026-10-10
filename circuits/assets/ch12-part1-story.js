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
     { sub: '三個一樣大、一樣頻率，只差 120° —— 這叫<b>平衡三相電壓</b>。', on: 'c1' }]);

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
    scenes: [S0, S1, S2, S3s, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17] });
})();
