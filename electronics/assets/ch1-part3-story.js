/* ============================================================
   電子學 CH1 PART 3（投影片 1-19～1-37）—— 故事模式
   主線謎題：電池反接，1 V 跟 10 V 的電流都只有約 10⁻¹⁴ A，一動也不動。為什麼？
   答案：逆偏把位障墊高，多數載子過不去；剩下的電流只靠「數量固定」的少數載子。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { e, h, line, text, arrow, chip } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const rnd = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const ring = (x, y, sign) => '<circle class="ring" cx="' + x + '" cy="' + y + '" r="8"/>' + T(x, y, sign, { cls: 'ta', fs: 12, dy: '.35em' });
  const ringGray = (x, y, sign) => '<circle cx="' + x + '" cy="' + y + '" r="8" style="fill:none;stroke:var(--s-line);stroke-width:1.3"/>' + T(x, y, sign, { cls: 'ts', fs: 12, dy: '.35em' });

  /* pn 塊：x 90～550、y 118～242，接面在 320 */
  const X0 = 90, X1 = 550, XM = 320, Y0 = 118, Y1 = 242;
  const ROWS = [136, 166, 196, 226];
  function ions(cols, sign, gray) {
    let s = '';
    cols.forEach(dx => ROWS.forEach(y => { s += (gray ? ringGray : ring)(XM + dx, y, sign); }));
    return s;
  }
  function carriers(kind, x0, x1, n, seed, avoid) {
    const r = rnd(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = Y0 + 12 + r() * (Y1 - Y0 - 24);
      if (avoid && Math.abs(x - XM) < avoid) continue;
      s += kind === 'h' ? h(x.toFixed(1), y.toFixed(1), null, 6) : e(x.toFixed(1), y.toFixed(1), null, 5.5);
    }
    return s;
  }
  const slabs = (key, bare) => g(key, '<rect class="bgw" x="' + X0 + '" y="' + Y0 + '" width="' + (XM - X0) + '" height="' + (Y1 - Y0) + '" rx="8"/>' +
    '<rect class="bgw" x="' + XM + '" y="' + Y0 + '" width="' + (X1 - XM) + '" height="' + (Y1 - Y0) + '" rx="8"/>') +
    (bare ? '' : T((X0 + XM) / 2, Y0 - 10, 'P 型', { cls: 't', fs: 14, k: key + 'Lp' }) + T((XM + X1) / 2, Y0 - 10, 'N 型', { cls: 't', fs: 14, k: key + 'Ln' }));
  const depl = (key, half) => '<rect' + k(key) + ' x="' + (XM - half) + '" y="' + Y0 + '" width="' + (2 * half) + '" height="' + (Y1 - Y0) + '" class="card" style="stroke:var(--s-ink);stroke-dasharray:5 4;stroke-width:1.2"/>';

  /* ════════════ 00 謎題 ════════════ */
  function diode(x, y, key) {
    return g(key, '<rect class="bgw" x="' + (x - 70) + '" y="' + (y - 26) + '" width="70" height="52" rx="6"/>' +
      '<rect class="bgw" x="' + x + '" y="' + (y - 26) + '" width="70" height="52" rx="6"/>' +
      T(x - 35, y, 'p', { fs: 18, dy: '.35em' }) + T(x + 35, y, 'n', { fs: 18, dy: '.35em' }));
  }
  const S0 = {
    t: '反接的電池', en: 'THE QUESTION',
    svg: diode(320, 140, 'd') +
      g('wire', '<path class="ln" d="M250 140 H150 V280 H300 M340 280 H490 V140 H390"/>' +
        '<line class="ln" x1="304" y1="266" x2="304" y2="294" style="stroke-width:3.4"/><line class="ln" x1="336" y1="258" x2="336" y2="302"/>' +
        T(290, 262, '−', { fs: 18 }) + T(352, 254, '+', { fs: 18 })) +
      T(320, 326, 'V_R = 1 V', { cls: 't', fs: 15, k: 'v' }) +
      g('am', '<circle class="bgw" cx="490" cy="210" r="30"/>' + T(490, 210, 'A', { fs: 18, dy: '.35em' })) +
      chip(150, 96, 'P 接負、N 接正', '逆向偏壓', 'cR', { fs: 12.5 }) +
      T(448, 200, '電流', { cls: 'tm', fs: 12, a: 'end', k: 'iL' }) + T(448, 226, '≈ 10⁻¹⁴ A', { cls: 'ta', fs: 17, a: 'end', k: 'i' }) +
      T(320, 240, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '一顆 pn 接面，接上電池 —— 但是<b>反著接</b>：P 接負、N 接正。', on: 'd wire v cR' },
      { sub: '接上電流錶：只有大約 <b>10⁻¹⁴ A</b>，比一兆分之一安培還小一百倍。', on: 'am iL i' },
      { sub: '把電池加到 <b>10 V</b>，電壓變 10 倍 —— 電流還是 10⁻¹⁴ A，<b>一動也不動</b>。', txt: { v: 'V_R = 10 V' } },
      { sub: '電壓加大、電流卻不變，歐姆定律好像失效了。要搞懂，得先看 P 型跟 N 型接在一起時發生什麼事。', op: { d: 0.15, wire: 0.15, v: 0.15, cR: 0.15, am: 0.15, iL: 0.15, i: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 接起來的瞬間 ════════════ */
  const S1 = {
    t: '接起來的瞬間', en: 'JOINING P AND N',
    svg: slabs('s') +
      g('hF', carriers('h', X0 + 10, XM - 60, 16, 3)) + g('hN', carriers('h', XM - 58, XM - 10, 6, 5)) +
      g('eF', carriers('e', XM + 60, X1 - 10, 16, 7)) + g('eN', carriers('e', XM + 10, XM + 58, 6, 9)) +
      chip(205, 290, '電洞很多', 'P 區的多數載子', 'cp', { fs: 12.5 }) + chip(435, 290, '電子很多', 'N 區的多數載子', 'cn', { fs: 12.5 }) +
      g('ar', arrow(250, 96, 390, 96, null, 'lna') + T(320, 86, '電洞 → N', { cls: 'ta', fs: 12 }) +
        arrow(390, 268, 250, 268, null, 'ln') + T(320, 284, '電子 → P', { cls: 't', fs: 12 })),
    steps: [
      { sub: '左邊 P 型：電洞很多。右邊 N 型：電子很多。把它們接在一起。', on: 's sLp sLn hF hN eF eN cp cn' },
      { sub: '一接上，<b>濃度差</b>就出現了：P 區電洞多、N 區電洞少 —— 就跟墨水一樣，開始擴散。', off: 'cp cn', on: 'ar' },
      { sub: '接面附近的電洞往 N 跑、電子往 P 跑。', mv: { hN: [70, 0], eN: [-70, 0] } },
      { sub: '跑過去的載子遇到對面的多數載子，就<b>復合</b>消失了。', off: 'hN eN' }
    ]
  };

  /* ════════════ 02 空乏區 ════════════ */
  const S2 = {
    t: '空乏區', en: 'DEPLETION REGION',
    svg: slabs('s') + g('hF', carriers('h', X0 + 10, XM - 60, 16, 3)) + g('eF', carriers('e', XM + 60, X1 - 10, 16, 7)) +
      g('gP', ions([-12, -30, -48], '−', true)) + g('gN', ions([12, 30, 48], '+', true)) +
      depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      chip(150, 292, 'B⁻ 受體離子', '固定、不會動', 'cB', { fs: 12.5 }) + chip(490, 292, 'P⁺ 施體離子', '固定、不會動', 'cP', { fs: 12.5 }) +
      chip(320, 300, '空乏區（空間電荷區）', '沒有載子，只有離子', 'cD', { fs: 13, acc: true }),
    steps: [
      { sub: '可是原子不會跑。每個硼本來就「配著」一個電洞、每個磷配著一個電子。', on: 's sLp sLn hF eF gP gN' },
      { sub: '電洞走了，P 側接面附近就只剩下帶負電的 <b>B⁻</b>。', on: 'iP cB', off: 'gP' },
      { sub: '電子走了，N 側只剩下帶正電的 <b>P⁺</b>。', on: 'iN cP', off: 'gN' },
      { sub: '中間這條帶子沒有任何可以動的載子，只有固定的離子 —— 叫<b>空乏區</b>（又叫空間電荷區）。', on: 'dz', off: 'cB cP' },
      { sub: '空乏區沒有載子，所以<b>不導電</b>。離子的唯一作用，是建立電場。', on: 'cD' }
    ]
  };

  /* ════════════ 03 內建電場 ════════════ */
  const S3 = {
    t: '內建電場', en: 'BUILT-IN ELECTRIC FIELD',
    svg: slabs('s') + g('hF', carriers('h', X0 + 10, XM - 60, 16, 3)) + g('eF', carriers('e', XM + 60, X1 - 10, 16, 7)) +
      depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      g('E', arrow(372, 264, 268, 264, null, 'lna') + T(320, 282, '內建電場 E（n → p）', { cls: 'ta', fs: 12.5 })) +
      g('hb', h(150, 296, null, 6.5) + arrow(160, 290, 205, 290, null, 'ln') + arrow(205, 306, 160, 306, null, 'lna')) +
      chip(150, 334, '電洞想往右 → 被推回左', null, 'cH', { fs: 12 }) +
      g('eb', e(490, 296, null, 6) + arrow(480, 290, 435, 290, null, 'ln') + arrow(435, 306, 480, 306, null, 'lna')) +
      chip(490, 334, '電子想往左 → 被推回右', null, 'cE', { fs: 12 }),
    steps: [
      { sub: '正離子在右、負離子在左。電場從正電荷指向負電荷 —— 所以是<b>由 n 指向 p</b>。', on: 's sLp sLn hF eF dz iP iN E' },
      { sub: '電洞想往右擴散，可是電場把正電荷往左推 —— <b>擋住了</b>。', on: 'hb cH' },
      { sub: '電子想往左擴散，電場把負電荷往右推 —— <b>也擋住了</b>。', on: 'eb cE' },
      { sub: '擴散越多，離子越多，電場越強，擋得越用力。擴散<b>自己把自己停下來</b>。', off: 'hb eb cH cE' }
    ]
  };

  /* ════════════ 04 拉鋸戰 ════════════ */
  const S4 = {
    t: '拉鋸戰：動態熱平衡', en: 'DYNAMIC EQUILIBRIUM',
    svg: slabs('s', 1) + g('hF', carriers('h', X0 + 10, XM - 60, 16, 3)) + g('eF', carriers('e', XM + 60, X1 - 10, 16, 7)) +
      depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      g('dif', arrow(230, 92, 410, 92, null, 'ln') + T(420, 92, '擴散電流（多數載子）', { cls: 't', fs: 12.5, a: 'start', dy: '.35em' })) +
      g('dri', arrow(410, 276, 230, 276, null, 'lna') + T(220, 276, '漂移電流（少數載子）', { cls: 'ta', fs: 12.5, a: 'end', dy: '.35em' })) +
      g('mn', h(470, 200, null, 6) + arrow(462, 200, 380, 200, null, 'lna') + e(170, 160, null, 5.5) + arrow(178, 160, 262, 160, null, 'lna')) +
      chip(320, 318, '|J_diff| = |J_drift|　總電流 = 0', '一直在流，只是剛好抵消', 'cEq', { fs: 13, acc: true }),
    steps: [
      { sub: '但擴散不會完全停：總有一些能量夠大的多數載子翻得過去 —— 這是<b>擴散電流</b>（P → N）。', on: 's hF eF dz iP iN dif', op: { hF: 0.3, eF: 0.3 } },
      { sub: '同一個電場，對<b>少數載子</b>卻是順風：N 區零星的電洞、P 區零星的電子，一碰到就被掃過去。', on: 'mn' },
      { sub: '這是<b>漂移電流</b>，方向 N → P，跟擴散電流相反。', on: 'dri' },
      { sub: '兩股電流<b>大小相等、方向相反</b>，宏觀上總電流 = 0 —— 這叫<b>動態熱平衡</b>。', on: 'cEq' }
    ]
  };

  /* ════════════ 05 電位障 ════════════ */
  let curve5 = 'M90 270 L250 270';
  for (let i = 0; i <= 30; i++) { const u = i / 30, y = 270 - 130 * (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)); curve5 += ' L' + (250 + u * 140).toFixed(1) + ' ' + y.toFixed(1); }
  curve5 += ' L550 140';
  const S5 = {
    t: '電位障：一道坡', en: 'POTENTIAL BARRIER',
    svg: g('ax', arrow(70, 290, 70, 100, null, 'ln') + T(78, 100, '電位', { cls: 'tm', fs: 12, a: 'start' }) + T(150, 300, 'P 側', { cls: 'ts', fs: 12 }) + T(480, 300, 'N 側', { cls: 'ts', fs: 12 })) +
      '<path class="lna" style="stroke-width:3" d="' + curve5 + '"' + k('cv') + '/>' +
      g('vb', '<path class="ln" d="M560 270 H585 M560 140 H585"/>' + arrow(578, 262, 578, 148, null, 'lna') + arrow(578, 148, 578, 262, null, 'lna') + T(570, 205, 'V_bi', { cls: 'ta', fs: 16, a: 'end' })) +
      g('ball', h(200, 258, null, 9)) +
      chip(240, 126, '多數載子要翻過這道坡', '坡越高，擴散越難', 'cU', { fs: 12.5 }) +
      chip(450, 102, '矽：約 0.6～0.8 V', '內建電壓 built-in voltage', 'cV', { fs: 12.5 }),
    steps: [
      { sub: '把空乏區兩側的電位畫出來：N 側比 P 側高出一截。這個電位差叫<b>內建電壓 V<sub>bi</sub></b>。', on: 'ax cv vb' },
      { sub: '對 P 區的電洞來說，這就是一道<b>坡</b>：要擴散到 N 區，得先爬上去。', on: 'ball cU' },
      { sub: '大部分電洞爬不上去，只有少數能量夠大的翻得過去。', mv: { ball: [90, -60] } },
      { sub: '矽的 V<sub>bi</sub> 大約 0.6～0.8 V。注意：它是 <b>built</b>-in（內建的），不是 build-in。', mv: { ball: [0, 0] }, on: 'cV' }
    ]
  };

  /* ════════════ 06 ln 的威力 ════════════ */
  const S6 = {
    t: '內建電壓怎麼算', en: 'V_bi = V_T · ln(NaNd / nᵢ²)',
    svg: T(320, 112, 'V<tspan font-size="13" dy="5">bi</tspan><tspan dy="-5"> = V</tspan><tspan font-size="13" dy="5">T</tspan><tspan dy="-5"> · ln( N</tspan><tspan font-size="13" dy="5">a</tspan><tspan dy="-5">N</tspan><tspan font-size="13" dy="5">d</tspan><tspan dy="-5"> / n</tspan><tspan font-size="13" dy="5">i</tspan><tspan font-size="12" dy="-14">2</tspan><tspan dy="9"> )</tspan>', { cls: 't', fs: 25, k: 'f' }) +
      chip(320, 152, 'V_T = kT/e ≈ 26 mV（熱電壓）', '就是 PART 2 愛因斯坦關係的那個 kT/e', 'cVt', { fs: 12.5 }) +
      T(320, 206, '(0.026) · ln[ (10¹⁶)(10¹⁷) / (1.5×10¹⁰)² ]', { cls: 'tm', fs: 16, k: 's1' }) +
      T(320, 238, '= 0.026 × 29.1 = 0.757 V', { cls: 'ta', fs: 22, k: 's2' }) +
      chip(320, 296, 'N_a 乘 10 倍 → V_bi 只多 60 mV', 'ln 把十幾個數量級壓成一個小數字', 'cLn', { fs: 13, acc: true }),
    steps: [
      { sub: '坡有多高？只看兩件事：<b>兩邊摻多少</b>，和<b>溫度</b>。', on: 'f' },
      { sub: 'V<sub>T</sub> = kT/e 叫<b>熱電壓</b>，室溫約 26 mV —— 就是上一段愛因斯坦關係裡的那個 kT/e。', on: 'cVt' },
      { sub: '代課本 Example 1.5：N<sub>a</sub> = 10¹⁶、N<sub>d</sub> = 10¹⁷ ——', off: 'cVt', on: 's1' },
      { sub: '得到 <b>0.757 V</b>。', on: 's2' },
      { sub: '因為取了 ln，摻雜差 10 倍，V<sub>bi</sub> 只差 <b>60 mV</b>。所以不管怎麼摻，矽的 V<sub>bi</sub> 都在 0.6～0.8 V 附近。', on: 'cLn' }
    ]
  };

  /* ════════════ 07 接法 ════════════ */
  function circuit(cx, key, rev) {
    const x0 = cx - 120, x1 = cx + 120;
    return g(key, '<rect class="bgw" x="' + (cx - 60) + '" y="112" width="60" height="44" rx="5"/><rect class="bgw" x="' + cx + '" y="112" width="60" height="44" rx="5"/>' +
      T(cx - 30, 134, 'p', { fs: 16, dy: '.35em' }) + T(cx + 30, 134, 'n', { fs: 16, dy: '.35em' }) +
      '<path class="ln" d="M' + (cx - 60) + ' 134 H' + x0 + ' V220 H' + (cx - 10) + ' M' + (cx + 10) + ' 220 H' + x1 + ' V134 H' + (cx + 60) + '"/>' +
      '<line class="ln" x1="' + (cx + (rev ? -6 : 6)) + '" y1="208" x2="' + (cx + (rev ? -6 : 6)) + '" y2="232" style="stroke-width:3.4"/>' +
      '<line class="ln" x1="' + (cx + (rev ? 6 : -6)) + '" y1="200" x2="' + (cx + (rev ? 6 : -6)) + '" y2="240"/>' +
      T(cx - 22, 202, rev ? '−' : '+', { fs: 16 }) + T(cx + 22, 202, rev ? '+' : '−', { fs: 16 }));
  }
  const S7 = {
    t: '順向還是逆向', en: 'FORWARD VS REVERSE BIAS',
    svg: circuit(170, 'fw', false) + circuit(470, 'rv', true) +
      T(170, 96, '順向偏壓', { cls: 'ta', fs: 15, k: 'fwL' }) + T(470, 96, '逆向偏壓', { cls: 't', fs: 15, k: 'rvL' }) +
      chip(170, 278, 'P 接 +、N 接 −', '外加電場跟內建電場「反向」', 'cF', { fs: 12.5 }) +
      chip(470, 278, 'P 接 −、N 接 +', '外加電場跟內建電場「同向」', 'cR', { fs: 12.5 }) +
      chip(320, 318, '記法：P 接 Positive 就是順向', '這一段先看逆偏，順偏在 PART 4', 'cM', { fs: 12.5, acc: true }),
    steps: [
      { sub: '現在外加電壓。接法只有兩種 ——', on: 'fw fwL rv rvL' },
      { sub: '<b>順向偏壓</b>：P 接正、N 接負。外加電場跟內建電場反方向，把坡<b>壓低</b>。', on: 'cF' },
      { sub: '<b>逆向偏壓</b>：P 接負、N 接正。外加電場跟內建電場同方向，把坡<b>墊高</b>。', on: 'cR' },
      { sub: '記法：<b>P 接 Positive 就是順向</b>。這一段先看逆偏，順偏留到 PART 4。', on: 'cM' }
    ]
  };

  /* ════════════ 08 逆偏：空乏區變寬 ════════════ */
  const S8 = {
    t: '逆偏：空乏區變寬', en: 'REVERSE BIAS · WIDER DEPLETION',
    svg: slabs('s', 1) + g('hF', carriers('h', X0 + 10, XM - 110, 14, 3)) + g('hM', carriers('h', XM - 108, XM - 62, 5, 13)) +
      g('eF', carriers('e', XM + 110, X1 - 10, 14, 7)) + g('eM', carriers('e', XM + 62, XM + 108, 5, 15)) +
      depl('dz', 58) + depl('dz2', 104) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      g('iP2', ions([-66, -84], '−')) + g('iN2', ions([66, 84], '+')) +
      g('E1', arrow(372, 268, 268, 268, null, 'lna') + T(320, 286, 'Ē', { cls: 'ta', fs: 13 })) +
      g('E2', arrow(430, 300, 210, 300, null, 'lna') + T(440, 300, 'E_total = Ē + E_A', { cls: 'ta', fs: 13, a: 'start', dy: '.35em' })) +
      chip(150, 88, '位障：V_bi → V_bi + V_R', null, 'cB', { fs: 12.5 }) +
      chip(470, 88, 'W ∝ √(V_bi + V_R)', '越拉越難變寬', 'cW', { fs: 12.5 }),
    steps: [
      { sub: '加上逆偏：外加電場 E<sub>A</sub> 跟內建電場 Ē 同方向，總電場<b>變強</b>。', on: 's hF hM eF eM dz iP iN E1' },
      { sub: '更強的電場把空乏區邊緣的電洞往左拉、電子往右拉 ——', off: 'E1', on: 'E2', mv: { hM: [-50, 0], eM: [50, 0] } },
      { sub: '露出更多離子，<b>空乏區變寬</b>。', off: 'hM eM dz', on: 'dz2 iP2 iN2' },
      { sub: '坡也從 V<sub>bi</sub> 墊高到 <b>V<sub>bi</sub> + V<sub>R</sub></b>。寬度跟它的平方根成正比，所以電壓越大越難再變寬。', on: 'cB cW' }
    ]
  };

  /* ════════════ 09 只剩少數載子 ════════════ */
  const S9 = {
    t: '只剩少數載子：I_S', en: 'REVERSE SATURATION CURRENT',
    svg: slabs('s', 1) + g('hF', carriers('h', X0 + 10, XM - 110, 14, 3)) + g('eF', carriers('e', XM + 110, X1 - 10, 14, 7)) +
      depl('dz2', 104) + g('iP', ions([-12, -30, -48, -66, -84], '−')) + g('iN', ions([12, 30, 48, 66, 84], '+')) +
      g('blk', h(196, 182, null, 7) + arrow(204, 182, 236, 182, null, 'ln') + T(196, 206, '過不去', { cls: 't', fs: 11.5 })) +
      h(450, 150, 'mh', 8) + e(190, 216, 'me', 7.5) +
      chip(320, 88, '少數載子：被電場「順風」帶過去', 'N 區的電洞、P 區的電子', 'cM', { fs: 12.5 }) +
      chip(320, 296, 'i_D ≈ −I_S（矽約 10⁻¹⁴ A）', '數量受限於少數載子，跟 V_R 無關', 'cI', { fs: 13, acc: true }),
    steps: [
      { sub: '坡太高了：P 區的電洞、N 區的電子（多數載子）<b>統統翻不過去</b>，擴散電流 ≈ 0。', on: 's hF eF dz2 iP iN blk' },
      { sub: '剩下的只有<b>少數載子</b>：N 區零星的電洞、P 區零星的電子。這個電場對它們是順風。', on: 'mh me cM' },
      { sub: '它們先擴散到空乏區邊緣，再被電場一掃就過去了。', mv: { mh: [-260, 0], me: [260, 0] } },
      { sub: '少數載子本來就少得可憐，所以電流極小：這叫<b>逆向飽和電流 I<sub>S</sub></b>。', on: 'cI' }
    ]
  };

  /* ════════════ 10 空乏區＝電容 ════════════ */
  const plate = (x, key) => '<rect' + (key ? k(key) : '') + ' x="' + (x - 4) + '" y="112" width="8" height="136" class="ink" rx="2"/>';
  const S10 = {
    t: '空乏區就是一顆電容', en: 'JUNCTION CAPACITANCE',
    svg: slabs('s') + depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      g('cap', plate(255, null) + plate(385, null) + '<rect x="262" y="118" width="116" height="124" class="accw" opacity=".6"/>' +
        T(320, 262, '絕緣層（空乏區）', { cls: 'ta', fs: 13 }) + T(175, 262, 'P 區（導體）＝ 極板', { cls: 'tm', fs: 12 }) + T(465, 262, 'N 區（導體）＝ 極板', { cls: 'tm', fs: 12 })) +
      T(320, 92, 'C = εA / d', { cls: 'ta', fs: 22, k: 'f' }) +
      chip(320, 312, 'd 就是空乏區寬度 W', 'V_R ↑ → W ↑ → C ↓', 'cD', { fs: 13, acc: true }),
    steps: [
      { sub: '再看一次空乏區：沒有載子 → 不導電 → 像一層<b>絕緣體</b>。', on: 's sLp sLn dz iP iN' },
      { sub: '兩側的 P 區和 N 區可以導電，像兩塊<b>極板</b>。中間夾一層絕緣體 —— 這不就是電容嗎？', on: 'cap' },
      { sub: '平行板電容：<b>C = εA/d</b>。', on: 'f' },
      { sub: '這裡的 d 就是空乏區寬度 W。逆偏越大 → W 越寬 → <b>電容越小</b>。', on: 'cD' }
    ]
  };

  /* ════════════ 11 C_j 公式 ════════════ */
  let cj = '';
  for (let i = 0; i <= 60; i++) { const v = i / 6, c = Math.pow(1 + v / 0.637, -0.5); cj += (i ? ' L' : 'M') + (120 + v * 40).toFixed(1) + ' ' + (290 - 160 * c).toFixed(1); }
  const S11 = {
    t: '接面電容 C_j', en: 'C_j = C_j0 (1 + V_R / V_bi)^−1/2',
    svg: T(320, 100, 'C<tspan font-size="13" dy="5">j</tspan><tspan dy="-5"> = C</tspan><tspan font-size="13" dy="5">j0</tspan><tspan dy="-5"> · (1 + V</tspan><tspan font-size="13" dy="5">R</tspan><tspan dy="-5"> / V</tspan><tspan font-size="13" dy="5">bi</tspan><tspan dy="-5">)</tspan><tspan font-size="13" dy="-12">−1/2</tspan>', { cls: 't', fs: 24, k: 'f' }) +
      g('ax', arrow(120, 290, 540, 290, null, 'ln') + arrow(120, 290, 120, 120, null, 'ln') + T(540, 306, 'V_R', { cls: 'ts', fs: 12 }) + T(128, 122, 'C_j', { cls: 'ts', fs: 12, a: 'start' })) +
      '<path class="lna" style="stroke-width:2.8" d="' + cj + '"' + k('cv') + '/>' +
      g('p1', '<circle class="e" cx="160" cy="' + (290 - 160 * 0.624).toFixed(1) + '" r="6"/>' + T(172, 290 - 160 * 0.624 - 12, '1 V：0.312 pF', { cls: 'ta', fs: 12.5, a: 'start' })) +
      g('p5', '<circle class="e" cx="320" cy="' + (290 - 160 * 0.336).toFixed(1) + '" r="6"/>' + T(332, 290 - 160 * 0.336 - 12, '5 V：0.168 pF', { cls: 'ta', fs: 12.5, a: 'start' })) +
      chip(430, 160, 'Example 1.6', 'V_bi = 0.637 V、C_j0 = 0.5 pF', 'cEx', { fs: 12.5 }),
    steps: [
      { sub: '把 W ∝ √(V<sub>bi</sub> + V<sub>R</sub>) 代進 C = εA/W，再用 V<sub>R</sub> = 0 時的 C<sub>j0</sub> 當基準 ——', on: 'f' },
      { sub: '畫出來：逆偏越大，電容越小，而且一開始掉得最快。', on: 'ax cv' },
      { sub: '課本 Example 1.6：V<sub>R</sub> = 1 V 時 <b>0.312 pF</b> ——', on: 'cEx p1' },
      { sub: 'V<sub>R</sub> = 5 V 時只剩 <b>0.168 pF</b>。都是 pF 等級，很小。', on: 'p5' }
    ]
  };

  /* ════════════ 12 變容二極體 ════════════ */
  let dial = '';
  for (let v = 60; v <= 130; v += 10) dial += line(70 + (v - 60) * 7, 214, 70 + (v - 60) * 7, 226, null, 'ln') + T(70 + (v - 60) * 7, 244, String(v), { cls: 'ts mono', fs: 11 });
  const fX = f => 70 + (f - 60) * 7;
  const S12 = {
    t: '變容二極體：用電壓調頻率', en: 'VARACTOR DIODE',
    svg: T(320, 104, 'f = 1 / (2π√(L·C<tspan font-size="12" dy="4">j</tspan><tspan dy="-4">))</tspan>', { cls: 't', fs: 22, k: 'f' }) +
      g('dial', '<rect x="' + fX(88) + '" y="196" width="' + (fX(108) - fX(88)) + '" height="36" class="accw"/>' + dial + line(70, 214, 560, 214, null, 'ln') +
        T(fX(98), 188, 'FM 88～108 MHz', { cls: 'ta', fs: 12 })) +
      '<line class="lna"' + k('ptr') + ' x1="' + fX(65) + '" y1="196" x2="' + fX(65) + '" y2="232" style="stroke-width:3.2"/>' +
      T(320, 272, 'V_R = 0 V → 65 MHz', { cls: 'ta', fs: 13, k: 'pl' }) +
      chip(320, 150, 'V_R ↑ → C_j ↓ → f ↑', '轉電壓就能選台', 'cR', { fs: 13, acc: true }) +
      chip(320, 314, '收音機、手機的調諧電路', '不用機械式的可變電容', 'cU', { fs: 12.5 }),
    steps: [
      { sub: '電壓可以改電容，這件事很好用：LC 電路的<b>共振頻率</b> f = 1/(2π√LC)。', on: 'f' },
      { sub: '把變容二極體當成 C。V<sub>R</sub> = 0 時電容最大，頻率最低（這裡是 65 MHz）。', on: 'dial ptr pl' },
      { sub: '把逆偏加到 3 V：C<sub>j</sub> 變小，頻率爬到 98.5 MHz —— 進到 FM 廣播頻段了。', on: 'cR', mv: { ptr: [fX(98.5) - fX(65), 0] }, txt: { pl: 'V_R = 3 V → 98.5 MHz' } },
      { sub: '轉電壓就能選台。這種刻意拿來當電容的二極體叫<b>變容二極體</b>（varactor）。', on: 'cU' }
    ]
  };

  /* ════════════ 13 恍然大悟 ════════════ */
  const S13 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 220, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="70" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(188, 124, '多數載子', { fs: 16 }) + T(188, 156, '要翻過 V_bi + V_R 的坡', { cls: 'tm', fs: 13 }) +
        T(188, 182, 'V_R 越大越翻不過去', { cls: 'tm', fs: 13 }) + T(188, 222, '電流 ≈ 0', { cls: 'ts', fs: 14 })) +
      g('R', '<rect class="card" x="334" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(452, 124, '少數載子', { fs: 16 }) + T(452, 156, '電場本來就把它們全掃過去', { cls: 'tm', fs: 13 }) +
        T(452, 182, '多加電壓也不會變多', { cls: 'tm', fs: 13 }) + T(452, 222, '電流 = I_S（固定）', { cls: 'ta', fs: 14 })) +
      chip(320, 282, '謎題解開了 ✓', '1 V 和 10 V 都只有 I_S —— 它被少數載子的「供應量」卡住', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, '下一段 PART 4：順向偏壓', '把坡壓低，電流會怎樣？（每多 60 mV 就變 10 倍）', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：反接 1 V 或 10 V，電流都卡在 10⁻¹⁴ A，為什麼？', on: 'q' },
      { sub: '多數載子：逆偏把坡墊到 V<sub>bi</sub> + V<sub>R</sub>，根本翻不過去，貢獻 ≈ 0。', off: 'q', on: 'L' },
      { sub: '少數載子：電場本來就把跑到邊緣的<b>全部</b>掃過去了。電壓再大，它們的數量也不會變多。', on: 'R' },
      { sub: '所以電流被少數載子的「供應量」卡住，固定在 I<sub>S</sub> —— 這就是「飽和」。<b>謎題解開了。</b>', on: 'ans' },
      { sub: '下一段 PART 4：反過來把坡<b>壓低</b>（順向偏壓），電流會怎樣？', off: 'ans', on: 'next' }
    ]
  };

  window.__ch1p3Story = window.__Story('#story', {
    id: 'ch1-part3', title: 'CH1 PART 3 pn 接面', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]
  });
})();
