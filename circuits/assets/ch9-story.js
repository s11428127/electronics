/* ============================================================
   電路學 CH9 複習 —— 故事模式（弦波與相量 Sinusoids and Phasors）
   謎題（課本 Example 9.9）：10 cos 4t V 電源、5 Ω、0.1 F 串聯，
     電阻電壓振幅 8.94 V、電容電壓振幅 4.47 V，加起來 13.4 V > 10 V？
   答案：兩個電壓差 90°（不同時到頂），要用箭頭（相量）相加：√(8.94² + 4.47²) = 10。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__RV) return;
  const R = window.__RV, D = R.D;
  const { g, T, calc, ph, sc, el, vac, wire, dots, strike, curve, axes, ladder, f1 } = R;
  const { chip, arrow } = D;
  const PI2 = Math.PI * 2, RAD = Math.PI / 180;

  /* 課本 Fig 9.16：電源在左、5 Ω 在上、0.1 F 在右 */
  function rc(o) {
    const ym = (o.yt + o.yb) / 2;
    return g(o.k, wire('M' + o.x0 + ' ' + (ym - 30) + ' V' + o.yt) + el('r', o.x0, o.yt, o.x1, o.yt, o.r || '5 Ω') +
      el('c', o.x1, o.yt, o.x1, o.yb, o.c || '0.1 F') + wire('M' + o.x1 + ' ' + o.yb + ' H' + o.x0 + ' V' + (ym + 30)) +
      vac(o.x0, ym, o.vs || '10 cos 4t V')) +
      (o.kd ? dots('M' + o.x0 + ' ' + (ym - 18) + ' V' + o.yt + ' H' + o.x1 + ' V' + o.yb + ' H' + o.x0 + ' V' + (ym + 18), o.kd, 'ac') : '');
  }

  /* ═════ 00 謎題 ═════ */
  const S0 = sc('加起來不對的電壓', 'THE PUZZLE',
    rc({ x0: 130, x1: 360, yt: 135, yb: 275, k: 'ckt', kd: 'flow' }) +
    chip(245, 190, '電阻：振幅 8.94 V', '', 'm1', { fs: 13.5 }) +
    chip(500, 250, '電容：振幅 4.47 V', '', 'm2', { fs: 13.5 }) +
    calc(410, 108, 210, [['8.94 + 4.47 = 13.4 V', 'r1', 't'], ['電源才 10 V？', 'r2', 'ta']], { k: 'cc' }) +
    chip(245, 300, 'KVL 壞掉了嗎？', '', 'q', { fs: 15, acc: true }),
    [{ sub: '課本 Example 9.9：一顆<b>交流</b>電源 10 cos 4t V，串一個 5 Ω 電阻和 0.1 F 電容。', on: 'ckt' },
     { sub: '電流在迴路裡<b>來回晃</b> —— 這就是交流。', on: 'flow' },
     { sub: '量一下：電阻上的電壓最大 8.94 V，電容上最大 4.47 V。', on: 'm1 m2' },
     { sub: 'KVL 說繞一圈電壓要平衡。可是 8.94 + 4.47 = 13.4，比電源的 10 V 還大！', on: 'cc r1 r2' },
     { sub: '是 KVL 壞了，還是我們加錯了？這一章就是要解開它。', on: 'q' }]);

  /* ═════ 01 這章要幹嘛 ═════ */
  const S1 = sc('這一章要幹嘛', 'WHY THIS CHAPTER',
    ladder(9, { k: 'lad', km: 'me', hl: [7, 8] }) +
    chip(40, 114, 'CH7、CH8：開關一切 → 解微分方程', '算一題要寫半頁', 'c1', { fs: 13.5, a: 'left' }) +
    chip(40, 156, '插座的電一直在晃（交流）', '每題都解微分方程？太累', 'c2', { fs: 13.5, a: 'left' }) +
    chip(40, 198, 'CH9：換一種語言', '弦波 → 箭頭、微積分 → 乘除', 'c3', { fs: 13.5, a: 'left', acc: true }),
    [{ sub: '先看我們在哪：電路學像一座階梯，現在爬到<b>第 9 階</b>。', on: 'lad me' },
     { sub: 'CH7、CH8 開關一切換，我們解<b>微分方程</b>，算一題要寫半頁。', on: 'lad-hl c1' },
     { sub: '可是家裡插座的電<b>一直在晃</b>（交流）。每題都解微分方程，太累了。', on: 'c2' },
     { sub: 'CH9 的工作：<b>換一種語言</b> —— 弦波變成箭頭，微積分變成乘除。', on: 'c3' }]);

  /* ═════ 02 弦波 = 轉圈的影子 ═════ */
  const W = { cx: 140, cy: 195, r: 65, x: 270, w: 330 };
  const S2 = sc('弦波：摩天輪的高度', 'A SINUSOID',
    g('wheel', '<circle class="ln2" style="fill:none;stroke-width:2" cx="' + W.cx + '" cy="' + W.cy + '" r="' + W.r + '"/>' +
      '<g>' + arrow(W.cx, W.cy, W.cx, W.cy - W.r, null, 'lna') + '<circle class="acc" cx="' + W.cx + '" cy="' + (W.cy - W.r) + '" r="7"/>' +
      '<animateTransform attributeName="transform" type="rotate" from="0 ' + W.cx + ' ' + W.cy + '" to="-360 ' + W.cx + ' ' + W.cy + '" dur="6s" repeatCount="indefinite"/></g>') +
    g('wave', '<line class="ln2" x1="' + W.x + '" y1="' + W.cy + '" x2="' + (W.x + W.w) + '" y2="' + W.cy + '"/>' +
      curve(t => Math.cos(PI2 * 1.5 * t), W.x, W.w, W.cy, W.r, 'lna') +
      '<line class="ln2 dsh" x1="' + W.cx + '" y1="' + (W.cy - W.r) + '" x2="' + W.x + '" y2="' + (W.cy - W.r) + '"/>') +
    g('amp', arrow(W.x + 220, W.cy, W.x + 220, W.cy - W.r + 3, null, 'ln') + T(W.x + 228, W.cy - 30, 'V<sub>m</sub>', { cls: 't', fs: 14, a: 'start' })) +
    g('per', '<path class="ln" style="fill:none" d="M' + W.x + ' 122 V116 H' + (W.x + 220) + ' V122"/>' + T(W.x + 110, 110, '轉一圈 = 一個週期 T', { cls: 'tm', fs: 12.5 })) +
    chip(435, 288, 'v(t) = V<sub>m</sub> cos(ωt + φ)', '', 'eq', { fs: 15, acc: true }),
    [{ sub: '想像摩天輪：車廂一直在轉圈。', on: 'wheel' },
     { sub: '把車廂的<b>高度</b>隨時間畫下來 —— 一上一下，就是一條<b>弦波</b>。', on: 'wave' },
     { sub: '輪子多大 = 波多高，叫<b>振幅</b> V<sub>m</sub>。', on: 'amp' },
     { sub: '轉一圈的時間叫週期 T；轉多快用<b>角頻率</b> ω 表示（每秒轉幾弧度）。', on: 'per' },
     { sub: '再加上「從哪個角度出發」的<b>相位</b> φ：v(t) = V<sub>m</sub> cos(ωt + φ)。電源 10 cos 4t 就是 V<sub>m</sub> = 10、ω = 4、φ = 0。', on: 'eq' }]);

  /* ═════ 03 誰領先 ═════ */
  const X0 = 90, XW = 500, Y0 = 215, H3 = 70;
  const px = th => f1(X0 + th / 540 * XW);          /* 1.5 圈 = 540° */
  const S3 = sc('誰先到頂：領先與落後', 'LEAD AND LAG',
    '<line class="ln2" x1="' + X0 + '" y1="' + Y0 + '" x2="' + (X0 + XW) + '" y2="' + Y0 + '"/>' +
    curve(t => Math.cos(PI2 * 1.5 * t), X0, XW, Y0, H3, 'ln', 'v') +
    curve(t => Math.cos(PI2 * 1.5 * t + Math.PI / 2), X0, XW, Y0, H3, 'lna', 'i') +
    T(X0, 128, 'v（黑）', { cls: 't', fs: 13, a: 'start', k: 'lv' }) + T(X0 + 70, 128, 'i（藍）', { cls: 'ta', fs: 13, a: 'start', k: 'li' }) +
    g('pk', '<line class="ln2 dsh" x1="' + px(270) + '" y1="' + (Y0 - H3) + '" x2="' + px(270) + '" y2="' + (Y0 + H3 + 10) + '"/>' +
      '<line class="ln2 dsh" x1="' + px(360) + '" y1="' + (Y0 - H3) + '" x2="' + px(360) + '" y2="' + (Y0 + H3 + 10) + '"/>' +
      '<circle class="acc" cx="' + px(270) + '" cy="' + (Y0 - H3) + '" r="5"/><circle class="ink" cx="' + px(360) + '" cy="' + (Y0 - H3) + '" r="5"/>' +
      '<path class="ln" style="fill:none" d="M' + px(270) + ' ' + (Y0 + H3 + 4) + ' V' + (Y0 + H3 + 10) + ' H' + px(360) + ' V' + (Y0 + H3 + 4) + '"/>' +
      T((+px(270) + +px(360)) / 2, Y0 + H3 + 26, '差 90°', { cls: 'ta', fs: 13 })) +
    chip(470, 128, '先到頂的 = 領先', '', 'c1', { fs: 14, acc: true }),
    [{ sub: '同一個電路裡，電壓 v 和電流 i 都是弦波，<b>轉得一樣快</b>。', on: 'v lv i li' },
     { sub: '但它們不一定同時到頂：藍色的 i 比黑色的 v <b>早 90°</b> 到頂。', on: 'pk' },
     { sub: '誰先到頂，誰就<b>領先</b>；晚到的叫落後。說「i 領先 v 90°」。', on: 'c1' },
     { sub: '謎題的答案已經露出一點線索：兩個電壓<b>沒有同時到頂</b>，最大值當然不能直接相加。', op: { v: .35, i: .35 } }]);

  /* ═════ 04 拍一張照 = 相量 ═════ */
  const rotA = (cx, cy, r) => '<g>' + arrow(cx, cy, cx + r, cy, null, 'ln') + arrow(cx, cy, f1(cx + r * 0.7 * Math.cos(40 * RAD)), f1(cy - r * 0.7 * Math.sin(40 * RAD)), null, 'lna') +
    '<animateTransform attributeName="transform" type="rotate" from="0 ' + cx + ' ' + cy + '" to="-360 ' + cx + ' ' + cy + '" dur="5s" repeatCount="indefinite"/></g>';
  const S4 = sc('按暫停拍一張照：相量', 'THE PHASOR',
    g('rot', '<circle class="ln2 dsh" style="fill:none" cx="160" cy="195" r="70"/>' + rotA(160, 195, 70)) +
    T(160, 290, '一直在轉', { cls: 'ts', fs: 12.5, k: 'rl' }) +
    g('cam', arrow(260, 195, 360, 195, null, 'ln') + T(310, 183, '拍照', { cls: 'ta', fs: 13 })) +
    ph(470, 195, 65, [{ a: 0, l: 'V', c: 'ln', k: 'pv' }, { a: 40, m: 0.7, l: 'I', k: 'pi' }], { k: 'ax' }) +
    chip(470, 292, '10 cos 4t  →  10∠0°', '', 'eq', { fs: 14.5, acc: true }),
    [{ sub: '電路裡每個電壓、電流都是<b>同樣速度</b>在轉的箭頭（ω 都一樣）。', on: 'rot rl' },
     { sub: '就像旋轉木馬：大家一起轉，<b>彼此的距離永遠不變</b>。', on: '' },
     { sub: '既然一起轉，就不用管它在轉 —— <b>按暫停拍一張照</b>就好。', on: 'cam ax pv pi' },
     { sub: '照片裡的箭頭叫<b>相量</b>：長度 = 振幅，角度 = 相位。寫成 V<sub>m</sub>∠φ。', on: '' },
     { sub: '所以電源 10 cos 4t 的相量就是 <b>10∠0°</b>。ω 先記在旁邊，最後再放回去。', on: 'eq' }]);

  /* ═════ 05 箭頭的兩種寫法 ═════ */
  const O5 = [150, 270], s5 = 100;
  const tip = [O5[0] + 1.6 * s5, O5[1] - 0.8 * s5], tipJ = [O5[0] - 0.8 * s5, O5[1] - 1.6 * s5];
  const S5 = sc('箭頭的兩種寫法', 'TWO WAYS TO WRITE IT',
    g('ax', arrow(40, O5[1], 330, O5[1], null, 'ln2') + arrow(O5[0], 295, O5[0], 108, null, 'ln2') +
      T(330, O5[1] + 18, '實部', { cls: 'ts', fs: 11.5, a: 'end' }) + T(O5[0] + 6, 116, '虛部 j', { cls: 'ts', fs: 11.5, a: 'start' })) +
    g('vec', arrow(O5[0], O5[1], tip[0], tip[1], null, 'lna') + T(205, 212, '1.789', { cls: 'ta', fs: 13, a: 'end' })) +
    g('xy', '<path class="ln dsh" style="fill:none" d="M' + tip[0] + ' ' + tip[1] + ' V' + O5[1] + '"/>' +
      T((O5[0] + tip[0]) / 2, O5[1] + 18, '1.6', { cls: 't', fs: 13 }) + T(tip[0] + 8, (tip[1] + O5[1]) / 2 + 5, 'j0.8', { cls: 't', fs: 13, a: 'start' })) +
    g('ang', '<path class="ln" style="fill:none" d="M' + (O5[0] + 40) + ' ' + O5[1] + ' A40 40 0 0 0 ' + f1(O5[0] + 40 * Math.cos(26.57 * RAD)) + ' ' + f1(O5[1] - 40 * Math.sin(26.57 * RAD)) + '"/>' +
      T(O5[0] + 46, O5[1] - 6, '26.57°', { cls: 'tm', fs: 11.5, a: 'start' })) +
    g('jv', arrow(O5[0], O5[1], tipJ[0], tipJ[1], null, 'ln dsh') + T(tipJ[0] - 4, tipJ[1] - 6, 'j × 箭頭', { cls: 't', fs: 12.5, a: 'end' }) +
      '<path class="ln2" style="fill:none" d="M' + (O5[0] + 22) + ' ' + (O5[1] - 11) + ' A25 25 0 0 0 ' + (O5[0] - 11) + ' ' + (O5[1] - 22) + '"/>') +
    calc(360, 110, 260, [['直角座標：1.6 + j0.8', 'r1'], ['極座標：1.789∠26.57°', 'r2'], ['長度 = √(1.6<sup>2</sup> + 0.8<sup>2</sup>) = 1.789', 'r3', 'tm'],
      ['角度 = tan<sup>−1</sup>(0.8 / 1.6) = 26.57°', 'r4', 'tm'], ['乘 j ＝ 逆時針轉 90°', 'r5', 'ta']], { k: 'cc', lh: 30 }),
    [{ sub: '同一支箭頭有兩種寫法。先畫一支：長 1.789、角度 26.57°。', on: 'ax vec ang cc r2' },
     { sub: '也可以說它「往右走 1.6、往上走 0.8」：寫成 <b>1.6 + j0.8</b>。j 只是「往上那個方向」的記號。', on: 'xy r1' },
     { sub: '兩種寫法互換：長度用畢氏定理，角度用 tan<sup>−1</sup>。', on: 'r3 r4' },
     { sub: '加減用直角座標（x、y 分開加）；乘除用極座標（長度相乘、角度相加）。', on: '' },
     { sub: '最重要的一招：<b>乘上 j = 箭頭逆時針轉 90°</b>。等一下 L、C 都靠它。', on: 'jv r5' }]);

  /* ═════ 06 微積分變乘法 ═════ */
  const S6 = sc('微分變成乘 jω', 'CALCULUS BECOMES ALGEBRA',
    ph(170, 205, 70, [{ a: 0, l: 'V', c: 'ln', k: 'pv' }, { a: 90, l: 'jωV', k: 'pj' }], { k: 'ax' }) +
    chip(170, 296, '微分 = 往前轉 90°、再乘 ω', '', 'c1', { fs: 13 }) +
    calc(320, 110, 300, [['時間的世界　→　相量的世界', 'r0', 'ts', 12], ['dv/dt　→　jω V', 'r1', 'ta'], ['∫ v dt　→　V / (jω)', 'r2', 'ta'], ['微分方程　→　一般的代數', 'r3']], { k: 'cc', lh: 32 }) +
    chip(470, 270, '換個語言，難的變簡單', '', 'c2', { fs: 14, acc: true }),
    [{ sub: '弦波微分會怎樣？cos 微分變 −sin，也就是<b>往前跳 90°</b>，再乘上 ω。', on: 'ax pv pj' },
     { sub: '「往前轉 90°」剛好就是乘 j。所以：<b>微分 = 乘 jω</b>。', on: 'c1 cc r0 r1' },
     { sub: '反過來，<b>積分 = 除以 jω</b>。', on: 'r2' },
     { sub: 'CH7、CH8 那種微分方程，換到相量世界就只剩加減乘除。', on: 'r3' },
     { sub: '就像把一題很難的英文翻成中文來算 —— 換個語言，難的變簡單。', on: 'c2' }]);

  /* ═════ 07 先整理一下 ═════ */
  const S7 = sc('先整理一下', 'SO FAR',
    calc(110, 110, 420, [['弦波 V<sub>m</sub> cos(ωt + φ)　→　相量 V<sub>m</sub>∠φ', 'r1'], ['箭頭兩種寫法：x + jy　⇄　r∠θ', 'r2'], ['乘 j = 轉 90°', 'r3'],
      ['微分 → × jω；積分 → ÷ jω', 'r4', 'ta'], ['接下來：R、L、C 變成什麼樣子？', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '先整理一下。第一件事：弦波拍成照片，就是相量。', on: 'cc r1' },
     { sub: '箭頭可以寫成 x + jy，也可以寫成長度∠角度；乘 j 就是轉 90°。', on: 'r2 r3' },
     { sub: '微分變乘 jω、積分變除 jω。', on: 'r4' },
     { sub: '接下來把這套用到三個元件上。', on: 'r5' }]);

  /* ═════ 08 R、L、C 的相量 ═════ */
  const P8 = [120, 320, 520];
  const S8 = sc('三個元件：誰先誰後', 'R, L AND C',
    T(P8[0], 120, '電阻 R', { cls: 't', fs: 15, k: 'tr' }) + T(P8[1], 120, '電感 L', { cls: 't', fs: 15, k: 'tl' }) + T(P8[2], 120, '電容 C', { cls: 't', fs: 15, k: 'tc' }) +
    ph(P8[0], 200, 52, [{ a: 0, l: 'V', c: 'ln', k: 'rv', ld: [0, -10] }, { a: 0, m: 0.6, l: 'I', k: 'ri', ld: [-14, 14] }], { k: 'ar', noTick: true }) +
    ph(P8[1], 200, 52, [{ a: 90, l: 'V', c: 'ln', k: 'lv' }, { a: 0, m: 0.7, l: 'I', k: 'li' }], { k: 'al', noTick: true }) +
    ph(P8[2], 200, 52, [{ a: 0, l: 'V', c: 'ln', k: 'cv' }, { a: 90, m: 0.7, l: 'I', k: 'ci' }], { k: 'ac', noTick: true }) +
    T(P8[0], 284, 'V = R I', { cls: 'ta', fs: 15, k: 'er' }) + T(P8[1], 284, 'V = jωL I', { cls: 'ta', fs: 15, k: 'el' }) + T(P8[2], 284, 'V = I / (jωC)', { cls: 'ta', fs: 15, k: 'ec' }) +
    T(P8[0], 303, '同時到頂', { cls: 'ts', fs: 11.5, k: 'nr' }) + T(P8[1], 303, 'V 領先 I 90°', { cls: 'ts', fs: 11.5, k: 'nl' }) + T(P8[2], 303, 'I 領先 V 90°', { cls: 'ts', fs: 11.5, k: 'nc' }),
    [{ sub: '電阻最老實：V = RI，電壓、電流<b>同時到頂</b>，兩支箭頭疊在一起。', on: 'tr ar rv ri er nr' },
     { sub: '電感 v = L di/dt，微分變乘 jω：<b>V = jωL·I</b>。多一個 j → 電壓<b>領先</b>電流 90°。', on: 'tl al lv li el nl' },
     { sub: '電容 i = C dv/dt：<b>V = I / (jωC)</b>。除以 j → 電流<b>領先</b>電壓 90°。', on: 'tc ac cv ci ec nc' },
     { sub: '口訣 ELI the ICE man：L 裡 E（電壓）在 I 前面，C 裡 I 在 E 前面。', on: '' }]);

  /* ═════ 09 阻抗 Z ═════ */
  const S9 = sc('阻抗：交流版的電阻', 'IMPEDANCE',
    T(320, 132, 'Z = V / I', { cls: 'ta', fs: 26, k: 'zd' }) +
    calc(170, 152, 300, [['Z<sub>R</sub> = R', 'r1'], ['Z<sub>L</sub> = jωL', 'r2'], ['Z<sub>C</sub> = 1 / (jωC) = −j / (ωC)', 'r3']], { k: 'cc', a: 'middle', lh: 31 }) +
    chip(320, 284, '單位一樣是 Ω；V = Z I 就是交流版的歐姆定律', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '三個元件都長成「V = 某個東西 × I」。這個東西就叫<b>阻抗 Z</b>。', on: 'zd' },
     { sub: '電阻的阻抗就是 R。', on: 'cc r1' },
     { sub: '電感是 jωL；電容是 1/(jωC)，整理成 −j/(ωC)。', on: 'r2 r3' },
     { sub: '阻抗是交流版的電阻：不只決定擋多少，還決定<b>時間錯開多少</b>。V = ZI 就是交流版的歐姆定律。', on: 'c1' }]);

  /* ═════ 10 頻率一變，L、C 就變 ═════ */
  const S10 = sc('頻率越高，L 越擋、C 越通', 'IT DEPENDS ON ω',
    axes(330, 285, 270, 160, 'ax', { xl: '頻率 ω' }) +
    curve(t => t * 0.92, 330, 270, 285, 160, 'ln', 'zl') + T(598, 132, '|Z<sub>L</sub>| = ωL', { cls: 't', fs: 13, a: 'end', k: 'll' }) +
    curve(t => 0.1 / (0.1 + t), 330, 270, 285, 160, 'lna', 'zc') + T(348, 128, '|Z<sub>C</sub>| = 1/(ωC)', { cls: 'ta', fs: 13, a: 'start', k: 'lc' }) +
    chip(170, 140, '電感：頻率越高越擋', '直流（ω = 0）→ 等於一條導線', 'c1', { fs: 13.5 }) +
    chip(170, 200, '電容：頻率越高越通', '直流 → 斷路（完全擋住）', 'c2', { fs: 13.5 }) +
    chip(170, 262, '電感討厭變化、電容討厭不變', '', 'c3', { fs: 13.5, acc: true }),
    [{ sub: 'Z 裡面有 ω，所以頻率一變，L、C 的阻抗就跟著變。', on: 'ax' },
     { sub: '電感 |Z<sub>L</sub>| = ωL：頻率越高越擋。直流（ω = 0）時等於<b>一條導線</b>。', on: 'zl ll c1' },
     { sub: '電容 |Z<sub>C</sub>| = 1/(ωC)：頻率越高越通。直流時是<b>斷路</b>。', on: 'zc lc c2' },
     { sub: '一句話記：電感討厭電流變化，電容討厭電壓不變。這題 ω = 4，Z<sub>C</sub> = −j2.5 Ω。', on: 'c3' }]);

  /* ═════ 11 KVL 照舊，但要用箭頭加 ═════ */
  const S11 = sc('定律照舊，但要用箭頭加', 'SAME LAWS, PHASOR MATH',
    calc(40, 110, 300, [['KVL：繞一圈，相量加起來 = 0', 'r1'], ['KCL：流進 = 流出（相量）', 'r2'], ['串聯：Z = Z<sub>1</sub> + Z<sub>2</sub>', 'r3'],
      ['並聯：1/Z = 1/Z<sub>1</sub> + 1/Z<sub>2</sub>', 'r4'], ['分壓：V<sub>1</sub> = V · Z<sub>1</sub> / (Z<sub>1</sub> + Z<sub>2</sub>)', 'r5']], { k: 'cc', lh: 30 }) +
    T(490, 150, '8.94 + 4.47 = 13.4', { cls: 't', fs: 16, k: 'w1' }) + strike(400, 145, 580, 'x1') +
    T(490, 175, '大小（長度）不能直接相加', { cls: 'ts', fs: 12, k: 'w2' }) +
    T(490, 230, 'V<sub>R</sub> + V<sub>C</sub> = V<sub>s</sub>', { cls: 'ta', fs: 18, k: 'o1' }) +
    T(490, 255, '箭頭頭尾接起來相加', { cls: 'tm', fs: 12.5, k: 'o2' }),
    [{ sub: '好消息：<b>KVL、KCL 照樣成立</b>，只是加的是相量。', on: 'cc r1 r2' },
     { sub: 'CH2 的串聯、並聯、分壓公式也照抄，把 R 換成 Z 就好。', on: 'r3 r4 r5' },
     { sub: '最常見的錯：把兩個電壓的<b>大小</b>直接相加。', on: 'w1' },
     { sub: '不行！長度不能直接加。', on: 'x1 w2' },
     { sub: '要把<b>箭頭頭尾接起來</b>相加。下一步回頭解謎題。', on: 'o1 o2' }]);

  /* ═════ 12 解謎（一）：電流 ═════ */
  const S12 = sc('解謎（一）：先算電流', 'SOLVE: THE CURRENT',
    rc({ x0: 90, x1: 250, yt: 140, yb: 260, vs: '10∠0° V', k: 'ckt', kd: 'flow' }) +
    calc(325, 108, 295, [['ω = 4，V<sub>s</sub> = 10∠0° V', 'r1'], ['Z<sub>C</sub> = 1 / (j · 4 · 0.1) = −j2.5 Ω', 'r2'], ['Z = 5 − j2.5 Ω（串聯直接加）', 'r3'],
      ['I = 10∠0° / (5 − j2.5)', 'r4'], ['= 1.6 + j0.8 = 1.789∠26.57° A', 'r5', 'ta']], { k: 'cc', lh: 30 }),
    [{ sub: '回到謎題。第一步：電源 10 cos 4t 換成相量 10∠0°，記住 ω = 4。', on: 'ckt flow cc r1' },
     { sub: '電容的阻抗：1/(jωC) = 1/(j × 4 × 0.1) = <b>−j2.5 Ω</b>。', on: 'r2' },
     { sub: '串聯，阻抗直接相加：Z = 5 − j2.5 Ω。', on: 'r3' },
     { sub: '交流版歐姆定律 I = V/Z：分子分母乘共軛，得 1.6 + j0.8。', on: 'r4' },
     { sub: '換成極座標：<b>I = 1.789∠26.57° A</b>。', on: 'r5' }]);

  /* ═════ 13 解謎（二）：箭頭相加 ═════ */
  const O = [80, 255], s = 26;
  const pR = [O[0] + 8 * s, O[1] - 4 * s], pC = [pR[0] + 2 * s, pR[1] + 4 * s];
  const u1 = [0.894, -0.447], u2 = [0.447, 0.894];
  const A1 = [pR[0] - 8 * u1[0], pR[1] - 8 * u1[1]];
  const sq = 'M' + f1(A1[0]) + ' ' + f1(A1[1]) + ' L' + f1(A1[0] + 8 * u2[0]) + ' ' + f1(A1[1] + 8 * u2[1]) + ' L' + f1(pR[0] + 8 * u2[0]) + ' ' + f1(pR[1] + 8 * u2[1]);
  const S13 = sc('解謎（二）：箭頭頭尾相接', 'SOLVE: ADD THE ARROWS',
    g('vr', arrow(O[0], O[1], pR[0], pR[1], null, 'lna') + T(172, 186, 'V<sub>R</sub> = 8.94∠26.57°', { cls: 'ta', fs: 13, a: 'end' })) +
    g('vc', arrow(pR[0], pR[1], pC[0], pC[1], null, 'ln') + T(326, 196, 'V<sub>C</sub>', { cls: 't', fs: 13, a: 'start' }) + T(326, 213, '4.47∠−63.43°', { cls: 't', fs: 12, a: 'start' })) +
    g('rt', '<path class="ln" style="fill:none;stroke-width:1.4" d="' + sq + '"/>') +
    g('vs', arrow(O[0], O[1], pC[0], pC[1], null, 'ln dsh') + T((O[0] + pC[0]) / 2, O[1] + 22, 'V<sub>s</sub> = 10∠0°', { cls: 't', fs: 14 })) +
    calc(420, 110, 200, [['8.94 + 4.47 = 13.4', 'r1', 'ts'], ['V<sub>R</sub>、V<sub>C</sub> 差 90°', 'r2'], ['√(8.94<sup>2</sup> + 4.47<sup>2</sup>) = 10 ✓', 'r3', 'ta']], { k: 'cc', lh: 30 }) +
    strike(432, 136, 590, 'x1'),
    [{ sub: '電阻電壓 V<sub>R</sub> = 5 × I = <b>8.94∠26.57°</b>，跟電流同方向。', on: 'vr' },
     { sub: '電容電壓 V<sub>C</sub> = −j2.5 × I = <b>4.47∠−63.43°</b>，比 V<sub>R</sub> 晚 90°。', on: 'vc rt' },
     { sub: '箭頭頭尾接起來：剛好回到 <b>10∠0°</b>，就是電源！', on: 'vs' },
     { sub: '直接加長度 13.4 是錯的；兩支箭頭垂直，用畢氏定理：√(8.94² + 4.47²) = 10。', on: 'cc r1 x1 r2 r3' },
     { sub: 'KVL 沒壞 —— 是我們沒把「時間錯開」算進去。', on: '' }]);

  /* ═════ 14 回到時間 ═════ */
  const Y14 = 248, H14 = 46, X14 = 80, W14 = 510;
  const p14 = th => f1(X14 + th / 540 * W14);
  const S14 = sc('最後：翻譯回時間', 'BACK TO TIME',
    calc(120, 106, 400, [['i(t) = 1.789 cos(4t + 26.57°) A', 'r1', 'ta'], ['v<sub>C</sub>(t) = 4.47 cos(4t − 63.43°) V', 'r2']], { k: 'cc', a: 'middle', lh: 28 }) +
    g('ax', '<line class="ln2" x1="' + X14 + '" y1="' + Y14 + '" x2="' + (X14 + W14) + '" y2="' + Y14 + '"/>') +
    curve(t => 0.62 * Math.cos(PI2 * 1.5 * t + 26.57 * RAD), X14, W14, Y14, H14, 'lna', 'wi') +
    curve(t => Math.cos(PI2 * 1.5 * t - 63.43 * RAD), X14, W14, Y14, H14, 'ln', 'wv') +
    g('pk', '<line class="ln2 dsh" x1="' + p14(333.43) + '" y1="' + (Y14 - H14 - 6) + '" x2="' + p14(333.43) + '" y2="' + (Y14 + H14) + '"/>' +
      '<line class="ln2 dsh" x1="' + p14(423.43) + '" y1="' + (Y14 - H14 - 6) + '" x2="' + p14(423.43) + '" y2="' + (Y14 + H14) + '"/>' +
      T((+p14(333.43) + +p14(423.43)) / 2, Y14 - H14 - 10, 'i 早 90°', { cls: 'ta', fs: 12.5 })),
    [{ sub: '答案要的是時間函數：把相量的長度、角度放回 cos，ω = 4 也放回去。', on: 'cc r1' },
     { sub: '電容電壓也一樣翻譯回來。', on: 'r2' },
     { sub: '畫出來看：電流（藍）比電容電壓（黑）<b>早 90°</b> 到頂 —— 跟電容的規則一樣。', on: 'ax wi wv pk' }]);

  /* ═════ 15 恍然大悟 ═════ */
  const S15 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：8.94 + 4.47 ≠ 10？', 'r1', 'ta'], ['→ 兩個電壓不同時到頂，要用箭頭相加', 'r2'], ['CH9 三招：相量、微分變 jω、阻抗 Z', 'r3'],
      ['還缺：電路一複雜（好幾個迴路）怎麼辦？', 'r4', 'tm'], ['→ CH10：節點、網目、戴維寧，用相量再來一次', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '回頭看謎題：8.94 + 4.47 不等於 10。', on: 'cc r1' },
     { sub: '因為兩個電壓差 90°、不同時到頂，要用箭頭相加。', on: 'r2' },
     { sub: 'CH9 三招：相量、微分變 jω、阻抗 Z。', on: 'r3' },
     { sub: '還缺什麼？電路一複雜就不夠用了。', on: 'r4' },
     { sub: '下一章 CH10：CH3、CH4 的方法用相量再來一次。', on: 'r5' }]);

  __Story('#story', { id: 'cir-rv-ch9', title: 'CH9 弦波與相量', after: '#sum', afterLabel: '看這章總結 ↓', stamp: { no: 'CH9', name: '相量' },
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15] });
})();
