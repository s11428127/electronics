/* ============================================================
   電子學 CH1 PART 4（投影片 1-38～1-54）—— 故事模式
   主線謎題：同一顆二極體，+0.70 V 有 4.93 mA，−0.70 V 只剩 10⁻¹⁴ A。為什麼只讓電往一個方向走？
   答案：順偏把坡壓低，翻得過去的多數載子「指數地」變多；逆偏只剩數量固定的少數載子。
   寫法：照 PART 1 的節奏 —— 先複習擋板、看擋板變矮、看 0.7 V 門檻，再進公式。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { e, h, arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const rnd = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const ring = (x, y, sign) => '<circle class="ring" cx="' + x + '" cy="' + y + '" r="8"/>' + T(x, y, sign, { cls: 'ta', fs: 12, dy: '.35em' });
  /* 下標：parts 偶數格是正常字、奇數格是下標（下標後面的字要放在同一個 tspan 裡才會回到基線） */
  const fx = parts => { let o = parts[0]; for (let i = 1; i < parts.length; i += 2) o += '<tspan font-size="11" dy="4">' + parts[i] + '</tspan><tspan dy="-4">' + (parts[i + 1] || '') + '</tspan>'; return o; };

  /* pn 塊：x 90～550、y 118～242，接面在 320 */
  const X0 = 90, X1 = 550, XM = 320, Y0 = 118, Y1 = 242;
  const ROWS = [136, 166, 196, 226];
  const ions = (cols, sign) => { let s = ''; cols.forEach(dx => ROWS.forEach(y => { s += ring(XM + dx, y, sign); })); return s; };
  function carriers(kind, x0, x1, n, seed) {
    const r = rnd(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = Y0 + 12 + r() * (Y1 - Y0 - 24);
      s += kind === 'h' ? h(x.toFixed(1), y.toFixed(1), null, 6) : e(x.toFixed(1), y.toFixed(1), null, 5.5);
    }
    return s;
  }
  const slabs = (key, bare) => g(key, '<rect class="bgw" x="' + X0 + '" y="' + Y0 + '" width="' + (XM - X0) + '" height="' + (Y1 - Y0) + '" rx="8"/>' +
    '<rect class="bgw" x="' + XM + '" y="' + Y0 + '" width="' + (X1 - XM) + '" height="' + (Y1 - Y0) + '" rx="8"/>') +
    (bare ? '' : T((X0 + XM) / 2, Y0 - 10, 'P 型', { cls: 't', fs: 14, k: key + 'Lp' }) + T((XM + X1) / 2, Y0 - 10, 'N 型', { cls: 't', fs: 14, k: key + 'Ln' }));
  const depl = (key, half) => '<rect' + k(key) + ' x="' + (XM - half) + '" y="' + Y0 + '" width="' + (2 * half) + '" height="' + (Y1 - Y0) + '" class="card" style="stroke:var(--s-ink);stroke-dasharray:5 4;stroke-width:1.2"/>';

  /* ════════════ 00 謎題 ════════════ */
  const diode = (x, y, key) => g(key, '<rect class="bgw" x="' + (x - 70) + '" y="' + (y - 26) + '" width="70" height="52" rx="6"/>' +
    '<rect class="bgw" x="' + x + '" y="' + (y - 26) + '" width="70" height="52" rx="6"/>' +
    T(x - 35, y, 'p', { fs: 18, dy: '.35em' }) + T(x + 35, y, 'n', { fs: 18, dy: '.35em' }));
  const S0 = {
    t: '一扇只開一邊的門', en: 'THE QUESTION',
    svg: diode(320, 140, 'd') +
      g('wire', '<path class="ln" d="M250 140 H150 V280 H300 M340 280 H490 V140 H390"/>') +
      g('bF', '<line class="ln" x1="304" y1="258" x2="304" y2="302"/><line class="ln" x1="336" y1="266" x2="336" y2="294" style="stroke-width:3.4"/>' +
        T(290, 254, '+', { fs: 18 }) + T(352, 262, '−', { fs: 18 })) +
      g('bR', '<line class="ln" x1="304" y1="266" x2="304" y2="294" style="stroke-width:3.4"/><line class="ln" x1="336" y1="258" x2="336" y2="302"/>' +
        T(290, 262, '−', { fs: 18 }) + T(352, 254, '+', { fs: 18 })) +
      T(320, 326, 'v_D = +0.70 V', { cls: 't', fs: 15, k: 'vF' }) + T(320, 326, 'v_D = −0.70 V', { cls: 't', fs: 15, k: 'vR' }) +
      g('am', '<circle class="bgw" cx="490" cy="210" r="30"/>' + T(490, 210, 'A', { fs: 18, dy: '.35em' })) +
      chip(150, 96, 'P 接正、N 接負', '順向偏壓', 'cF', { fs: 12.5 }) + chip(150, 96, 'P 接負、N 接正', '逆向偏壓', 'cR', { fs: 12.5 }) +
      T(448, 200, '電流', { cls: 'tm', fs: 12, a: 'end', k: 'iL' }) +
      T(448, 226, '4.93 mA', { cls: 'ta', fs: 17, a: 'end', k: 'iF' }) + T(448, 226, '10⁻¹⁴ A', { cls: 'ta', fs: 17, a: 'end', k: 'iR' }) +
      chip(505, 92, '差了約 5×10¹¹ 倍', '同樣 0.70 V，只是方向反過來', 'cGap', { fs: 13, acc: true }) +
      T(320, 240, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '同一顆二極體（Example 1.7：I<sub>S</sub> = 10⁻¹⁴ A），先<b>順著</b>接 0.70 V：P 接正、N 接負。', on: 'd wire bF vF cF am' },
      { sub: '電流 <b>4.93 mA</b> —— 很正常的電流。', on: 'iL iF' },
      { sub: '把電池<b>反過來</b>，一樣是 0.70 V。', off: 'bF vF cF iF', on: 'bR vR cR' },
      { sub: '電流只剩 <b>10⁻¹⁴ A</b>。電壓大小一樣，電流差了大約 <b>5000 億倍</b>。', on: 'iR cGap' },
      { sub: '二極體為什麼只讓電往一個方向走？逆偏 PART 3 看過了，這一段看<b>順偏</b>。', op: { d: 0.15, wire: 0.15, bR: 0.15, vR: 0.15, cR: 0.15, am: 0.15, iL: 0.15, iR: 0.15, cGap: 0.15 }, on: 'q' }
    ]
  };


  /* ════════════ 複習 PART 3：擋板 ════════════ */
  const wallR = (key, hgt, op) => '<rect' + k(key) + ' x="314" y="' + (242 - hgt) + '" width="12" height="' + hgt + '" rx="3" class="acc" opacity="' + op + '"/>';
  const SA = {
    t: '先複習：中間有一塊擋板', en: 'RECAP · THE BARRIER',
    svg: slabs('s') + g('hF', carriers('h', X0 + 10, XM - 64, 16, 3)) + g('eF', carriers('e', XM + 64, X1 - 10, 16, 7)) +
      depl('dz', 58) + g('iP', ions([-48, -30, -12], '−')) + g('iN', ions([12, 30, 48], '+')) + wallR('wall', 124, 0.45) +
      chip(320, 292, '空乏區的離子 → 內建電場 = 擋板', '擋住多數載子', 'cW', { fs: 13 }) +
      chip(320, 292, 'PART 3：反著接 → 擋板更高 → 幾乎沒電流', '這一段：電池「順著」接', 'cR', { fs: 13, acc: true }),
    steps: [
      { sub: '先複習 PART 3：P 跟 N 接在一起，中間長出一條<b>空乏區</b>。', on: 's sLp sLn hF eF dz iP iN' },
      { sub: '空乏區的離子形成<b>內建電場</b>，像一塊<b>擋板</b>，擋住想擠過去的多數載子。', on: 'wall cW' },
      { sub: 'PART 3 是反著接，擋板<b>更高</b>，幾乎沒電流。這一段把電池<b>順著接</b>。', off: 'cW', on: 'cR' }
    ]
  };

  /* ════════════ 順偏：擋板變矮 ════════════ */
  const SB = {
    t: '順著接：擋板變矮', en: 'FORWARD BIAS LOWERS THE BARRIER',
    svg: slabs('s') + g('hF', carriers('h', X0 + 10, XM - 64, 16, 3)) + g('eF', carriers('e', XM + 64, X1 - 10, 16, 7)) +
      depl('dz', 58) + g('iP', ions([-48, -30, -12], '−')) + g('iN', ions([12, 30, 48], '+')) +
      wallR('wH', 124, 0.45) + wallR('wL', 40, 0.45) +
      g('bat', '<path class="ln" style="fill:none" d="M90 210 V300 H300 M340 300 H550 V210"/>' +
        '<line class="ln" x1="304" y1="286" x2="304" y2="314"/><line class="ln" x1="336" y1="292" x2="336" y2="308" style="stroke-width:3.4"/>' +
        T(290, 284, '+', { fs: 16 }) + T(352, 288, '−', { fs: 16 })) +
      g('Ein', arrow(372, 260, 268, 260, null, 'ln') + T(384, 260, '擋板：N → P', { cls: 't', fs: 12.5, a: 'start', dy: '.35em' })) +
      g('Eex', arrow(268, 278, 372, 278, null, 'lna') + T(256, 278, '電池：P → N', { cls: 'ta', fs: 12.5, a: 'end', dy: '.35em' })),
    steps: [
      { sub: '<b>順向偏壓</b>：P 接正、N 接負。', on: 's sLp sLn hF eF dz iP iN wH bat' },
      { sub: '擋板（內建電場）的方向是 N → P ——', on: 'Ein' },
      { sub: '電池產生的電場剛好<b>反過來</b>：P → N。', on: 'Eex' },
      { sub: '兩個一抵消，擋板就<b>變矮</b>了。', off: 'wH', on: 'wL' }
    ]
  };

  /* ════════════ 01 把坡壓低 ════════════ */
  const sCurve = top => {
    let d = 'M90 270 H250';
    for (let i = 0; i <= 30; i++) { const u = i / 30, y = 270 - (270 - top) * (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)); d += ' L' + (250 + u * 140).toFixed(1) + ' ' + y.toFixed(1); }
    return d + ' L550 ' + top;
  };
  const S1 = {
    t: '換成坡來看', en: 'LOWERING THE BARRIER',
    svg: g('ax', arrow(70, 290, 70, 112, null, 'ln') + T(78, 114, '電位', { cls: 'tm', fs: 12, a: 'start' }) + T(150, 300, 'P 側', { cls: 'ts', fs: 12 }) + T(480, 300, 'N 側', { cls: 'ts', fs: 12 })) +
      '<path class="lna" style="stroke-width:3" d="' + sCurve(150) + '"' + k('cv') + '/>' +
      '<path class="lna" style="stroke-width:3" d="' + sCurve(222) + '"' + k('cv2') + '/>' +
      g('vb', '<path class="ln" d="M560 270 H585 M560 150 H585"/>' + arrow(578, 262, 578, 158, null, 'lna') + arrow(578, 158, 578, 262, null, 'lna') + T(570, 210, 'V_bi', { cls: 'ta', fs: 16, a: 'end' })) +
      g('vb2', '<path class="ln" d="M560 270 H585 M560 222 H585"/>' + arrow(578, 264, 578, 228, null, 'lna') + arrow(578, 228, 578, 264, null, 'lna') + T(570, 250, 'V_bi − v_D', { cls: 'ta', fs: 14, a: 'end' })) +
      g('ball', h(200, 258, null, 9)) +
      g('fE', arrow(390, 92, 270, 92, null, 'ln') + T(398, 92, 'Ē：內建電場（n → p）', { cls: 'tm', fs: 12, a: 'start', dy: '.35em' })) +
      g('fA', arrow(270, 116, 340, 116, null, 'lna') + T(348, 116, 'E_A：外加電場（p → n），比較弱', { cls: 'ta', fs: 12, a: 'start', dy: '.35em' })),
    steps: [
      { sub: '把擋板換成「坡」來看：原本坡高 V<sub>bi</sub>，P 區的電洞要爬上去才過得去。', on: 'ax cv vb ball' },
      { sub: '外加電場 E<sub>A</sub> 跟內建電場 Ē <b>反方向</b>（剛剛那兩個箭頭）。', on: 'fE fA' },
      { sub: '淨電場 Ē − E<sub>A</sub> 變弱了（但還是由 n 指向 p），坡被壓低成 <b>V<sub>bi</sub> − v<sub>D</sub></b>。', op: { cv: 0.2 }, off: 'vb', on: 'cv2 vb2' },
      { sub: '坡變矮，很多電洞爬得過去了。', mv: { ball: [250, -44] } }
    ]
  };

  /* ════════════ 02 空乏區變窄 ════════════ */
  let fillP = '', fillN = '';
  [-48, -30].forEach(dx => ROWS.forEach(y => { fillP += h(XM + dx, y, null, 6); }));
  [30, 48].forEach(dx => ROWS.forEach(y => { fillN += e(XM + dx, y, null, 5.5); }));
  const S2 = {
    t: '空乏區變窄', en: 'NARROWER DEPLETION REGION',
    svg: slabs('s') + depl('dz', 58) + depl('dz2', 22) +
      g('hF', carriers('h', X0 + 10, XM - 64, 16, 3)) + g('eF', carriers('e', XM + 64, X1 - 10, 16, 7)) +
      g('iPo', ions([-48, -30], '−')) + g('iPi', ions([-12], '−')) + g('iNi', ions([12], '+')) + g('iNo', ions([30, 48], '+')) +
      g('fillP', fillP) + g('fillN', fillN) +
      g('bat', arrow(100, 270, 190, 270, null, 'lna') + T(100, 292, '電池送進電洞', { cls: 'ta', fs: 12, a: 'start' }) +
        arrow(540, 270, 450, 270, null, 'lna') + T(540, 292, '電池送進電子', { cls: 'ta', fs: 12, a: 'end' })) +
      chip(320, 300, '空乏區變窄', '離子被補回成中性 → W ↓', 'cW', { fs: 13, acc: true }),
    steps: [
      { sub: '熱平衡時的空乏區：中間一條只有離子、沒有載子的帶子。', on: 's sLp sLn dz iPo iPi iNi iNo hF eF' },
      { sub: '順偏時，電池從兩端送進電洞和電子……', on: 'bat' },
      { sub: '……把空乏區邊緣的離子「補回」成中性的 P 型和 N 型。', off: 'iPo iNo dz', on: 'dz2 fillP fillN' },
      { sub: '露出來的離子少了 → <b>空乏區變窄</b>（投影片 1-40）。', on: 'cW' }
    ]
  };

  /* ════════════ 03 多數載子翻過去 ════════════ */
  let hs3 = '', es3 = '';
  for (let i = 0; i < 13; i++) { hs3 += h(44 + i * 46, 152, null, 6.5); es3 += e(58 + i * 46, 210, null, 6); }
  const S3 = {
    t: '多數載子翻過去', en: 'MAJORITY CARRIERS DIFFUSE ACROSS',
    svg: '<defs><clipPath id="st-p4c3"><rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (Y1 - Y0) + '" rx="8"/></clipPath></defs>' +
      slabs('s') + depl('dz2', 22) + g('iPi', ions([-12], '−')) + g('iNi', ions([12], '+')) +
      g('hF', carriers('h', X0 + 10, XM - 34, 12, 3), ' opacity=".35"') + g('eF', carriers('e', XM + 34, X1 - 10, 12, 7), ' opacity=".35"') +
      g('hs', hs3, ' clip-path="url(#st-p4c3)" style="--run:46px"') +
      g('es', es3, ' clip-path="url(#st-p4c3)" style="--run:-46px"') +
      T(84, 156, '電洞 →', { cls: 'ta', fs: 12, a: 'end', k: 'hl' }) + T(84, 214, '← 電子', { cls: 'ta', fs: 12, a: 'end', k: 'el' }) +
      g('J', arrow(200, 272, 440, 272, null, 'lna') + T(320, 296, '順向電流 i_D：P → N（兩股相加）', { cls: 'ta', fs: 13 })),
    steps: [
      { sub: '坡變矮了，P 區的電洞開始大量<b>擴散</b>到 N 區。', on: 's sLp sLn dz2 iPi iNi hF eF hs hl', cls: { hs: 'conv' } },
      { sub: 'N 區的電子也大量擴散到 P 區。', on: 'es el', cls: { es: 'conv' } },
      { sub: '電洞往右 = 電流往右；電子往左但帶負電 = 電流<b>也往右</b>。兩股加起來就是<b>順向電流 i<sub>D</sub></b>。', on: 'J' }
    ]
  };

  /* ════════════ 04 變成少數載子 ════════════ */
  let injH = '', injE = '';
  { const r = rnd(21); for (let i = 0; i < 16; i++) { const d = 26 + (-Math.log(1 - r() * 0.93)) * 52, y = Y0 + 14 + r() * (Y1 - Y0 - 28); injH += h((XM + d).toFixed(1), y.toFixed(1), null, 6); } }
  { const r = rnd(33); for (let i = 0; i < 16; i++) { const d = 26 + (-Math.log(1 - r() * 0.93)) * 52, y = Y0 + 14 + r() * (Y1 - Y0 - 28); injE += e((XM - d).toFixed(1), y.toFixed(1), null, 5.5); } }
  const S4 = {
    t: '變成對面的少數載子', en: 'MINORITY CARRIER INJECTION',
    svg: slabs('s') + depl('dz2', 22) + g('iPi', ions([-12], '−')) + g('iNi', ions([12], '+')) +
      g('hF', carriers('h', X0 + 10, XM - 34, 12, 3), ' opacity=".3"') + g('eF', carriers('e', XM + 34, X1 - 10, 12, 7), ' opacity=".3"') +
      g('inj', injH) + g('injE', injE) +
      chip(320, 280, '接面邊緣的少數載子暴增', '越靠近接面越多，往外越少', 'cInj', { fs: 13 }) +
      T(320, 322, fx(['p', 'n', '(0) = p', 'n0', ' · e^(v', 'D', ' / V', 'T', ')']), { cls: 'ta', fs: 18, k: 'f' }),
    steps: [
      { sub: '跨過去之後呢？電洞到了 N 區 —— 在那裡，電洞是<b>少數載子</b>。', on: 's sLp sLn dz2 iPi iNi hF eF inj' },
      { sub: '電子到了 P 區也一樣。這叫<b>少數載子注入</b>：接面邊緣的少數載子一下子多了好幾個數量級。', on: 'injE cInj' },
      { sub: '一句話：<b>坡越低，衝過去的越多</b>，邊緣的少數載子就越多。' },
      { sub: '寫成數學：坡每低 V<sub>T</sub> ≈ 26 mV，翻得過去的就多 e ≈ 2.7 倍 → 邊緣濃度 <b>p<sub>n</sub>(0) = p<sub>n0</sub>·e<sup>v<sub>D</sub>/V<sub>T</sub></sup></b>。', on: 'f' }
    ]
  };

  /* ════════════ 05 邊走邊復合 ════════════ */
  let cR = 'M340 120', cL = 'M300 120';
  for (let x = 340; x <= 590; x += 5) cR += ' L' + x + ' ' + (262 - 142 * Math.exp(-(x - 340) / 55)).toFixed(1);
  for (let x = 300; x >= 70; x -= 5) cL += ' L' + x + ' ' + (262 - 142 * Math.exp(-(300 - x) / 55)).toFixed(1);
  const pair = (x, y) => h(x - 6, y, null, 5) + e(x + 6, y, null, 4.5);
  const S5 = {
    t: '邊走邊復合', en: 'EXPONENTIAL DECAY · FIG 1.16',
    svg: g('ax', '<path class="ln" d="M60 290 H600"/><path class="ln dsh" d="M300 100 V290 M340 100 V290"/>' +
        T(150, 308, 'P 型', { cls: 'ts', fs: 12 }) + T(480, 308, 'N 型', { cls: 'ts', fs: 12 })) +
      g('base', '<path class="ln dsh" d="M60 262 H300 M340 262 H600"/>' + T(64, 254, 'n_p0', { cls: 'ts', fs: 11, a: 'start' }) + T(596, 254, 'p_n0', { cls: 'ts', fs: 11, a: 'end' })) +
      '<path class="lna" style="stroke-width:3;fill:none" d="' + cR + '"' + k('cvR') + '/>' +
      '<path class="lna" style="stroke-width:3;fill:none" d="' + cL + '"' + k('cvL') + '/>' +
      T(350, 112, 'p_n(0)', { cls: 'ta', fs: 13, a: 'start', k: 'lR' }) + T(290, 112, 'n_p(0)', { cls: 'ta', fs: 13, a: 'end', k: 'lL' }) +
      g('rc', pair(400, 276) + pair(470, 276) + pair(540, 276) + pair(240, 276) + pair(170, 276)) +
      T(486, 168, 'δp(x) = δp(0) · e^(−x / L_p)', { cls: 'tm', fs: 14, k: 'fx' }) +
      g('J', arrow(430, 124, 540, 124, null, 'lna') + T(548, 124, '擴散', { cls: 'ta', fs: 13, a: 'start', dy: '.35em' })),
    steps: [
      { sub: '把 N 區的電洞濃度畫出來：接面邊緣最高 ——', on: 'ax base cvR lR' },
      { sub: '往右越走越少，因為電洞一路被多數載子（電子）<b>復合</b>掉了。', on: 'rc', cls: { rc: 'pulse' } },
      { sub: '形狀是<b>指數衰減</b>。P 區注入的電子也一樣，左右對稱（Fig 1.16）。', on: 'cvL lL fx' },
      { sub: '有濃度差就有<b>擴散</b>：這條斜坡推著電洞繼續往右走 —— 這就是順向電流的真面目。', on: 'J' }
    ]
  };


  /* ════════════ 門檻 0.7 V ════════════ */
  const ROWS_C = [[0.3, 1.03e-9, '1 nA'], [0.5, 2.24e-6, '2 μA'], [0.6, 1.05e-4, '0.1 mA'], [0.7, 4.93e-3, '4.93 mA']];
  let rowsC = '';
  ROWS_C.forEach(([v, i, lab], n) => {
    const y = 120 + n * 46, len = Math.max(2, 330 * i / 4.93e-3);
    rowsC += g('r' + n, T(150, y, v.toFixed(1) + ' V', { cls: 't', fs: 15, a: 'end', dy: '.35em' }) +
      '<rect x="170" y="' + (y - 11) + '" width="' + len.toFixed(1) + '" height="22" rx="4" class="acc"/>' +
      T(170 + len + 10, y, lab, { cls: n === 3 ? 'ta' : 'tm', fs: 14, a: 'start', dy: '.35em' }));
  });
  const SC = {
    t: '門檻電壓 0.7 V', en: 'THE 0.7 V THRESHOLD',
    svg: rowsC + T(150, 96, '電壓', { cls: 'ts', fs: 12, a: 'end' }) + T(176, 96, '電流（長度照實際比例）', { cls: 'ts', fs: 12, a: 'start' }) +
      chip(320, 310, '矽二極體的門檻電壓 ≈ 0.7 V', '過了門檻才算「打開」—— 但電流其實一直在指數成長', 'cT', { fs: 13, acc: true }),
    steps: [
      { sub: '實際接上去會看到什麼？電壓慢慢加：0.3 V —— 電流只有 1 nA，<b>幾乎看不到</b>。', on: 'r0' },
      { sub: '0.5 V：2 μA，還是看不到。', on: 'r1' },
      { sub: '0.6 V：0.1 mA，冒出一點點。', on: 'r2' },
      { sub: '0.7 V：<b>4.93 mA</b>，突然暴增！多 0.1 V，電流變成將近 50 倍。', on: 'r3' },
      { sub: '所以常說矽二極體的<b>門檻電壓約 0.7 V</b>：過了門檻才算「打開」。', on: 'cT' }
    ]
  };

  /* ════════════ 06 為什麼是指數 ════════════ */
  const HX = [130, 250, 370, 490], HH = [150, 115, 80, 45], MUL = ['× 1', '× 10', '× 100', '× 1000'], LB = ['v_D = 0', '+60 mV', '+120 mV', '+180 mV'];
  let hills = '';
  HX.forEach((cx, i) => {
    const top = 280 - HH[i];
    hills += g('c' + i, '<path class="lna" style="stroke-width:2.4;fill:none" d="M' + (cx - 50) + ' 280 C' + (cx - 22) + ' 280 ' + (cx - 24) + ' ' + top + ' ' + cx + ' ' + top + ' S' + (cx + 22) + ' 280 ' + (cx + 50) + ' 280"/>' +
      h(cx - 40, 272, null, 5) + h(cx - 30, 274, null, 5) + h(cx + 34, 274, null, 5)) +
      T(cx, 300, LB[i], { cls: 'ts', fs: 12, k: 'l' + i }) +
      T(cx, top - 14, MUL[i], { cls: 'ta', fs: 16, k: 'm' + i });
  });
  const S6 = {
    t: '為什麼是指數', en: 'WHY EXPONENTIAL',
    svg: '<path class="ln" d="M70 280 H570"/>' + hills +
      T(320, 98, '翻過去的數量 ∝ e^(v_D / V_T)', { cls: 'ta', fs: 19, k: 'f' }),
    steps: [
      { sub: '為什麼是指數？電洞在坡底亂跳，能量有高有低，只有跳得夠高的才翻得過坡。', on: 'c0 l0 m0' },
      { sub: '坡每低一點（v<sub>D</sub> 多 60 mV），翻得過去的就 <b>× 10</b>。', on: 'c1 l1 m1' },
      { sub: '再低 60 mV，再 × 10 —— <b>× 100</b>。', on: 'c2 l2 m2' },
      { sub: '再低 60 mV，<b>× 1000</b>。電壓一格一格加，電流一個 0 一個 0 地加。', on: 'c3 l3 m3' },
      { sub: '這就是指數：注入量 ∝ e<sup>v<sub>D</sub>/V<sub>T</sub></sup>，電流跟著它走。', on: 'f' }
    ]
  };

  /* ════════════ 07 二極體方程式 ════════════ */
  const X7 = v => 340 + 210 * v, Y7 = mA => 270 - 26 * mA;
  let cv7 = '';
  for (let i = 0; i <= 170; i++) { const v = -1 + i * 0.01, mA = 1e-11 * (Math.exp(v / 0.026) - 1); cv7 += (i ? ' L' : 'M') + X7(v).toFixed(1) + ' ' + Y7(mA).toFixed(1); }
  cv7 += ' L' + X7(0.7024).toFixed(1) + ' ' + Y7(5.5).toFixed(1);
  const S7 = {
    t: '二極體方程式', en: 'i_D = I_S (e^(v_D/nV_T) − 1)',
    svg: T(320, 100, fx(['i', 'D', ' = I', 'S', ' · ( e^(v', 'D', ' / nV', 'T', ') − 1 )']), { cls: 't', fs: 22, k: 'f' }) +
      chip(320, 196, '「−1」從哪來？', 'v_D = 0 → e⁰ − 1 = 0：熱平衡，沒有電流', 'cM1', { fs: 13 }) +
      g('ax', '<path class="ln" d="M120 270 H566 M340 290 V128"/>' + T(572, 270, 'v_D', { cls: 'tm', fs: 12, a: 'start', dy: '.35em' }) + T(334, 132, 'i_D (mA)', { cls: 'tm', fs: 12, a: 'end' }) +
        T(X7(-1), 286, '−1.0', { cls: 'ts', fs: 11 }) + T(X7(1), 286, '1.0 V', { cls: 'ts', fs: 11 }) + T(235, 258, '≈ −I_S（貼地）', { cls: 'ts', fs: 12 })) +
      '<path class="lna" style="stroke-width:3;fill:none" d="' + cv7 + '"' + k('cv') + '/>' +
      g('p7', '<circle class="acc" cx="' + X7(0.7) + '" cy="' + Y7(4.93) + '" r="6"/>' + T(X7(0.7) + 12, Y7(4.93) + 5, '4.93 mA', { cls: 'ta', fs: 14, a: 'start' }) + T(X7(0.7), 286, '0.70', { cls: 'ta', fs: 11 })) +
      chip(190, 170, '放射係數 n', '實際二極體 1 ≤ n ≤ 2，沒說取 1', 'cN', { fs: 12.5 }),
    steps: [
      { sub: '把它寫成公式：<b>i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1)</b>。I<sub>S</sub> 就是 PART 3 的逆向飽和電流。', on: 'f' },
      { sub: '「−1」哪來的？v<sub>D</sub> = 0 時 e⁰ − 1 = 0：熱平衡，沒有電流。', on: 'cM1' },
      { sub: '畫成圖：左邊貼地（逆偏 ≈ −I<sub>S</sub>）、右邊像一道牆往上衝（Fig 1.17）。', off: 'cM1', on: 'ax cv' },
      { sub: '代 Example 1.7：v<sub>D</sub> = 0.70 V → <b>4.93 mA</b>。', on: 'p7' },
      { sub: '實際二極體寫成 e<sup>v<sub>D</sub>/nV<sub>T</sub></sup>，n 叫<b>放射係數</b>，介於 1～2，沒說就取 1。', on: 'cN' }
    ]
  };

  /* ════════════ 08 對數尺 ════════════ */
  const X8 = v => 130 + v / 0.72 * 420, Y8 = L => 290 - (L + 14) * (170 / 12), L8 = v => -14 + v / 0.0599;
  const stair = (va, key, lab) => {
    const vb = va + 0.06, xa = X8(va), xb = X8(vb), ya = Y8(L8(va)), yb = Y8(L8(vb));
    return g(key, '<path class="ln" style="stroke-dasharray:4 3;fill:none" d="M' + xa.toFixed(1) + ' ' + ya.toFixed(1) + ' H' + xb.toFixed(1) + ' V' + yb.toFixed(1) + '"/>' +
      (lab ? T((xa + xb) / 2, ya + 16, '60 mV', { cls: 'tm', fs: 12 }) + T(xb + 8, (ya + yb) / 2, '× 10', { cls: 'ta', fs: 13, a: 'start', dy: '.35em' }) : ''));
  };
  const S8 = {
    t: '每 60 mV 變 10 倍', en: 'ONE DECADE PER 60 mV · FIG 1.18',
    svg: g('ax', '<path class="ln" d="M126 290 H566 M130 294 V112"/>' +
        [-14, -11, -8, -5, -2].map(L => T(122, Y8(L), '10' + (L === -2 ? '⁻²' : L === -5 ? '⁻⁵' : L === -8 ? '⁻⁸' : L === -11 ? '⁻¹¹' : '⁻¹⁴'), { cls: 'ts', fs: 11, a: 'end', dy: '.35em' })).join('') +
        [0, 0.2, 0.4, 0.6].map(v => T(X8(v), 308, v.toFixed(1), { cls: 'ts', fs: 11 })).join('') + T(572, 290, 'v_D', { cls: 'tm', fs: 12, a: 'start', dy: '.35em' })) +
      '<path class="lna" style="stroke-width:3" d="M' + X8(0) + ' ' + Y8(-14) + ' L' + X8(0.72).toFixed(1) + ' ' + Y8(L8(0.72)).toFixed(1) + '"' + k('ln') + '/>' +
      stair(0.30, 'st1', true) + stair(0.42, 'st2') + stair(0.54, 'st3') +
      chip(250, 150, '1 mA → 10 mA：只多 0.06 V', '導通之後，電壓幾乎不動', 'cFix', { fs: 13, acc: true }),
    steps: [
      { sub: '縱軸改成<b>對數</b>（每格差 10 倍），那道牆就變成一條<b>直線</b>（Fig 1.18）。', on: 'ax ln' },
      { sub: '橫的走 60 mV，直的就上一格 —— <b>× 10</b>。', on: 'st1' },
      { sub: '每一階都一樣：0.026 × ln 10 ≈ <b>60 mV</b>。', on: 'st2 st3' },
      { sub: '反過來看：電流從 1 mA 到 10 mA，電壓才多 0.06 V —— 導通之後電壓<b>幾乎不動</b>。', on: 'cFix' }
    ]
  };

  /* ════════════ 09 理想二極體 ════════════ */
  const dsym = (x, y, left) => left
    ? '<path class="ln" style="fill:none" d="M' + (x + 12) + ' ' + (y - 10) + ' L' + (x - 10) + ' ' + y + ' L' + (x + 12) + ' ' + (y + 10) + ' Z M' + (x - 10) + ' ' + (y - 10) + ' V' + (y + 10) + '"/>'
    : '<path class="ln" style="fill:none" d="M' + (x - 12) + ' ' + (y - 10) + ' L' + (x + 10) + ' ' + y + ' L' + (x - 12) + ' ' + (y + 10) + ' Z M' + (x + 10) + ' ' + (y - 10) + ' V' + (y + 10) + '"/>';
  const dotc = (x, y) => '<circle class="ink" cx="' + x + '" cy="' + y + '" r="3"/>';
  const S9 = {
    t: '理想二極體：當成開關', en: 'IDEAL DIODE MODEL',
    svg: g('iv', '<path class="ln" d="M230 190 H414 M320 200 V96"/>' + '<path class="lna" style="stroke-width:3.4;fill:none" d="M230 190 H320 V100"/>' +
        T(420, 190, 'v_D', { cls: 'tm', fs: 12, a: 'start', dy: '.35em' }) + T(328, 104, 'i_D', { cls: 'tm', fs: 12, a: 'start' })) +
      g('on', T(170, 230, '順偏 → ON = 短路', { cls: 'ta', fs: 14 }) +
        '<path class="ln" d="M60 262 H108 M130 262 H146"/>' + dsym(120, 262) + arrow(152, 262, 186, 262, null, 'lna') +
        dotc(200, 262) + '<path class="ln" d="M200 262 H280"/>' + dotc(280, 262) + T(240, 288, '電流由外部電路決定', { cls: 'ts', fs: 11.5 })) +
      g('off', T(470, 230, '逆偏 → OFF = 斷路', { cls: 't', fs: 14 }) +
        '<path class="ln" d="M360 262 H398 M420 262 H436"/>' + dsym(410, 262, true) + arrow(442, 262, 476, 262, null, 'ln') +
        dotc(490, 262) + '<path class="ln" d="M490 262 H516 M544 262 H570"/>' + dotc(516, 262) + dotc(544, 262) + dotc(570, 262) + T(530, 288, '電流 = 0', { cls: 'ts', fs: 11.5 })) +
      chip(320, 314, '再準一點：導通時固定 0.7 V', '定電壓降模型（下一章的 V_γ）', 'c07', { fs: 12.5 }),
    steps: [
      { sub: '解電路時，指數公式太麻煩。工程上把那道牆<b>簡化成開關</b>（投影片 1-49）。', on: 'iv' },
      { sub: '逆偏：電流只有 10⁻¹⁴ A，當成 0 → <b>斷路（OFF）</b>。', on: 'off' },
      { sub: '順偏：電壓幾乎不動 → 當成<b>短路（ON）</b>。電流由外面的電源和電阻決定，<b>不是無限大</b>。', on: 'on' },
      { sub: '再準一點：導通時固定掉 <b>0.7 V</b>，叫定電壓降模型。', on: 'c07' }
    ]
  };

  /* ════════════ 10 溫度 ════════════ */
  const wall = xw => { let d = ''; for (let x = 130; x <= xw + 30; x += 3) { const y = Math.max(120, 288 - 160 * Math.exp((x - xw) / 12)); d += (d ? ' L' : 'M') + x + ' ' + y.toFixed(1); if (y <= 120) break; } return d; };
  const WX = [470, 430, 390], xI = WX.map(x => x + 12 * Math.log(0.55));
  const S10 = {
    t: '溫度：越熱越好過', en: 'TEMPERATURE EFFECTS · FIG 1.20',
    svg: T(320, 98, fx(['i', 'D', ' = I', 'S', '(T) · ( e^(v', 'D', ' / V', 'T', '(T)) − 1 )']), { cls: 't', fs: 19, k: 'f' }) +
      chip(320, 156, '越熱 → 載子越多 → 越好推', 'T ↑ → nᵢ ↑ → I_S ↑↑', 'cIs', { fs: 13, acc: true }) +
      g('ax', '<path class="ln" d="M120 290 H570 M130 294 V112"/>' + T(576, 290, 'v_D', { cls: 'tm', fs: 12, a: 'start', dy: '.35em' })) +
      WX.map((x, i) => '<path class="' + (i === 2 ? 'lna' : 'ln') + '" style="stroke-width:' + (i === 2 ? 3 : 2) + ';fill:none" d="' + wall(x) + '"' + k('c' + i) + '/>' +
        T(x + 4, 140 - (i === 2 ? 0 : 0), ['T₀', 'T₁', 'T₂'][i], { cls: i === 2 ? 'ta' : 't', fs: 13, a: 'start', k: 'cl' + i })).join('') +
      g('hl', '<path class="ln dsh" d="M130 200 H560"/>' + T(136, 192, '同一個電流', { cls: 'ts', fs: 11.5, a: 'start' })) +
      g('dots', xI.map((x, i) => '<circle class="' + (i === 2 ? 'acc' : 'ink') + '" cx="' + x.toFixed(1) + '" cy="200" r="4.5"/>').join('')) +
      g('arr', arrow(xI[0] + 4, 222, xI[2] - 4, 222, null, 'lna') + T(xI[2] - 12, 244, 'v_D ↓　約 −2 mV/°C', { cls: 'ta', fs: 13, a: 'end' })),
    steps: [
      { sub: '溫度也會影響二極體。天氣越熱，熱擾動產生的載子越多 ——', on: 'cIs' },
      { sub: '同樣的電流，越熱就越「好推」，需要的電壓<b>越小</b>：整條曲線<b>往左移</b>（Fig 1.20）。', off: 'cIs', on: 'ax c0 cl0 c1 cl1 c2 cl2' },
      { sub: '大約每升高 1 °C，電壓少 <b>2 mV</b>。', on: 'hl dots arr' },
      { sub: '數學上：公式裡的 I<sub>S</sub> ∝ nᵢ²，每 5 °C 大約翻一倍，比 V<sub>T</sub> 的變化大得多。', on: 'f' }
    ]
  };

  /* ════════════ 11 二極體溫度計 ════════════ */
  const X11 = t => 330 + (t - 250) * (240 / 70), Y11 = v => 270 - (v - 0.56) * (150 / 0.13);
  const pts = [[255.2, 0.676], [300, 0.598], [310.8, 0.579]];
  const S11 = {
    t: '二極體溫度計', en: 'DIODE THERMOMETER · §1.6',
    svg: g('ckt', '<path class="ln" style="fill:none" d="M80 120 H250 V250 H80 Z"/>' +
        '<rect class="bgw" x="70" y="170" width="20" height="30" style="stroke:none"/><path class="ln" d="M68 178 H92 M74 192 H86" style="stroke-width:2.4"/>' +
        T(100, 188, '15 V', { cls: 't', fs: 13, a: 'start' }) +
        '<rect class="bgw" x="135" y="110" width="60" height="20" style="stroke:none"/><path class="ln" style="fill:none" d="M135 120 L142 112 L152 128 L162 112 L172 128 L182 112 L188 120 H195"/>' +
        T(165, 100, '15 kΩ', { cls: 't', fs: 13 }) +
        '<rect class="bgw" x="238" y="168" width="24" height="34" style="stroke:none"/>' +
        '<path class="lna" style="fill:none" d="M240 172 H260 L250 192 Z M240 194 H260"/>' + T(232, 186, 'V_D', { cls: 'ta', fs: 13, a: 'end' }) +
        T(165, 276, 'I_D ≈ 1 mA 固定', { cls: 'ts', fs: 12 })) +
      g('ax', '<path class="ln" d="M326 270 H590 M330 274 V108"/>' + [250, 275, 300].map(t => T(X11(t), 288, t + ' K', { cls: 'ts', fs: 11 })).join('') +
        T(326, 110, 'V_D', { cls: 'tm', fs: 12, a: 'end' })) +
      '<path class="lna" style="stroke-width:3" d="M' + X11(252) + ' ' + Y11(1.12 - 0.522 * 252 / 300).toFixed(1) + ' L' + X11(318) + ' ' + Y11(1.12 - 0.522 * 318 / 300).toFixed(1) + '"' + k('ln') + '/>' +
      g('pts', pts.map(p => '<circle class="ink" cx="' + X11(p[0]).toFixed(1) + '" cy="' + Y11(p[1]).toFixed(1) + '" r="4.5"/>').join('')) +
      g('lab', T(X11(255.2) + 10, Y11(0.676) - 6, '0.676 V · 0 °F', { cls: 't', fs: 12, a: 'start' }) +
        T(X11(300) + 10, Y11(0.598) - 10, '0.598 V · 300 K', { cls: 't', fs: 12, a: 'start' }) +
        T(X11(310.8) - 8, Y11(0.579) + 20, '0.579 V · 100 °F', { cls: 't', fs: 12, a: 'end' })) +
      chip(460, 318, '斜率 −1.74 mV/K', '電壓越低 = 越熱', 'cS', { fs: 13, acc: true }),
    steps: [
      { sub: '缺點反過來用：讓二極體流<b>固定電流</b>（15 V + 15 kΩ ≈ 1 mA）——', on: 'ckt' },
      { sub: '量它的電壓。V<sub>D</sub> 跟溫度幾乎是一條<b>直線</b>（Fig 1.48）。', on: 'ax ln pts' },
      { sub: '300 K 是 0.598 V；100 °F（310.8 K）掉到 0.579 V。<b>電壓越低 = 越熱</b>。', on: 'lab' },
      { sub: '斜率 −1.74 mV/K。量到電壓就能反推溫度 —— 這就是<b>二極體溫度計</b>。', on: 'cS' }
    ]
  };

  /* ════════════ 12 三種狀態 ════════════ */
  const card = (x, key, title, lines, acc) => g(key, '<rect class="card" x="' + x + '" y="96" width="184" height="190" rx="14" filter="url(#st-sh)"/>' +
    T(x + 92, 126, title, { cls: acc ? 'ta' : 't', fs: 17 }) +
    lines.map((s, i) => T(x + 92, 166 + i * 36, s, { cls: i === lines.length - 1 ? (acc ? 'ta' : 't') : 'tm', fs: 13 })).join(''));
  const S12 = {
    t: '三種狀態一次看', en: 'EQUILIBRIUM · REVERSE · FORWARD',
    svg: card(24, 'A', '熱平衡', ['擴散 = 漂移', '空乏區 W₀', '總電流 = 0']) +
      card(228, 'B', '逆偏', ['坡 V_bi + V_R', '空乏區變寬', 'i_D ≈ −I_S（OFF）']) +
      card(432, 'C', '順偏', ['坡 V_bi − v_D', '空乏區變窄', 'i_D 指數暴衝（ON）'], true) +
      chip(320, 314, '投影片 1-41 的 Brief Summary', '比的是「電場阻力」和「濃度驅力」誰大', 'cK', { fs: 12.5 }),
    steps: [
      { sub: '<b>熱平衡</b>：電場阻力 = 濃度驅力，擴散跟漂移打平，總電流 0。', on: 'A' },
      { sub: '<b>逆偏</b>：電場阻力 &gt; 濃度驅力，多數載子過不去，只剩 −I<sub>S</sub>，像開關 OFF。', on: 'B' },
      { sub: '<b>順偏</b>：電場阻力 &lt; 濃度驅力，多數載子大量擴散，電流指數暴衝，像開關 ON。', on: 'C' },
      { sub: '這就是投影片 1-41 那張總整理。', on: 'cK' }
    ]
  };

  /* ════════════ 13 恍然大悟 ════════════ */
  const S13 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 220, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="70" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(188, 124, '+0.70 V（順偏）', { fs: 16, cls: 'ta' }) + T(188, 156, '坡壓低 0.7 V', { cls: 'tm', fs: 13 }) +
        T(188, 182, '翻過去的 × e^(0.7/0.026)', { cls: 'tm', fs: 13 }) + T(188, 222, '4.93 mA', { cls: 'ta', fs: 15 })) +
      g('R', '<rect class="card" x="334" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(452, 124, '−0.70 V（逆偏）', { fs: 16 }) + T(452, 156, '坡墊高，多數載子過不去', { cls: 'tm', fs: 13 }) +
        T(452, 182, '只剩數量固定的少數載子', { cls: 'tm', fs: 13 }) + T(452, 222, '10⁻¹⁴ A', { cls: 't', fs: 15 })) +
      chip(320, 282, '謎題解開了 ✓', '一邊是指數放大，一邊被少數載子的供應量卡住', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, 'CH1 的 pn 接面到這裡完整了', '接下來：用二極體來設計電路（整流、限幅…）', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：同樣 0.70 V，正接 4.93 mA、反接 10⁻¹⁴ A，為什麼？', on: 'q' },
      { sub: '順偏：坡壓低 0.7 V，翻得過去的載子多了 e<sup>0.7/0.026</sup> ≈ 5×10¹¹ 倍 —— 電流指數暴衝。', off: 'q', on: 'L' },
      { sub: '逆偏：坡墊高，多數載子過不去；剩下的少數載子數量固定，電流卡在 I<sub>S</sub>。', on: 'R' },
      { sub: '一邊是<b>指數放大</b>、一邊被<b>少數載子的供應量</b>卡住 —— 所以二極體只讓電往一個方向走。<b>謎題解開了。</b>', on: 'ans' },
      { sub: 'CH1 的 pn 接面到這裡完整了。往下看推導、玩互動模組、做例題。', off: 'ans', on: 'next' }
    ]
  };


  /* ════════════ ⛳ 10/5 考試範圍終點 ════════════ */
  const SX = {
    t: '⛳ 考試範圍到這裡', en: 'EXAM SCOPE ENDS HERE',
    svg: g('fl', '<line class="ln" x1="200" y1="300" x2="200" y2="110" style="stroke-width:3"/>' +
        '<path class="accw" d="M200 112 L300 135 L200 160 Z" style="stroke:var(--s-acc);stroke-width:1.5"/>') +
      T(390, 150, '10/5 考到這裡', { cls: 'ta', fs: 24, k: 't1' }) +
      chip(390, 210, '原講義 PART 4 第 8 頁', '順偏 → 多數載子跨過去 → 變少數載子 → 擴散電流', 'c1', { fs: 13 }) +
      chip(390, 280, '後面還沒教', '60 mV、理想模型、溫度、溫度計', 'c2', { fs: 13 }),
    steps: [
      { sub: '<b>10/5 考試的範圍到這裡</b>：老師教到 PART 4 第 8 頁，二極體方程式在第 7 頁介紹過。', on: 'fl t1 c1' },
      { sub: '後面的畫面（60 mV、理想模型、溫度）<b>還沒教到</b>，想先看可以繼續，考試不用準備。', on: 'c2' }
    ]
  };

  window.__ch1p4Story = window.__Story('#story', {
    id: 'ch1-part4', title: 'CH1 PART 4 順向偏壓與二極體', after: '#map',
    scenes: [S0, SA, SB, S1, S2, S3, S4, S5, SC, S6, S7, SX, S8, S9, S10, S11, S12, S13]
  });
})();
