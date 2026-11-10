/* CH14 題型故事 v3（使用者 11/10）：先用講義 Example（你寫過的）講，每一步換一張圖＋這一步用到的公式。
   原本的章末題故事搬進那一題卡片；分貝（14.3）課本沒有 Example → 保留 Problem 14.7。 */
(function () {
  'use strict';
  const S = window.__SCH, Y = window.__TY, D = window.__TYPES14, K = window.__K13;
  if (!S || !Y || !D) return;
  const { HL, note, ar, txt } = Y;
  const F = (w, h, dx, dy, p) => ({ w, h, p: ['<g transform="translate(' + dx + ',' + dy + ')">'].concat(p, ['</g>']) });
  const hl = (on, x) => on ? HL(x) : x;
  const W = (...a) => S.w(...a);
  const EX = '__CH14EX';

  Y.attach('__CH14PB', D.types.map(t => t.wk).filter(Boolean));

  /* ═══ 題型 1：Example 14.1（RC 低通） ═══ */
  const c141 = (fd, add) => F(340, 207, 50, 20, [S.vs(20, 30, 120, fd ? 'V_s' : 'v_s(t)'), hl(fd, S.r(20, 30, 140, 30, 'R')), hl(fd, S.c(140, 30, 140, 120, fd ? '1/(jωC)' : 'C', { side: 'l' })),
    W('140,30', '200,30'), W('20,120', '200,120'), S.term(200, 30), S.term(200, 120), S.t(210, 80, 'V_o', 'start')].concat(add || []));
  const X = x => 40 + 260 * (Math.log10(x) + 2) / 4;   /* ω/ω₀ 從 0.01 到 100 */
  const mag = x => 1 / Math.sqrt(1 + x * x);
  const plot = o => { o = o || {}; let d = ''; for (let i = 0; i <= 60; i++) { const x = Math.pow(10, -2 + 4 * i / 60); d += (i ? ' L' : 'M') + X(x) + ' ' + (150 - 110 * mag(x)); }
    const p = [W('40,150', '305,150'), W('40,150', '40,25'), HL('<path d="' + d + '" fill="none"/>'), S.t(34, 44, '1', 'end', ' font-size="10.5"'), S.t(305, 166, 'ω/ω₀（對數）', 'end', ' font-size="10.5"'), S.t(46, 30, '|H|', 'start', ' font-size="11"')];
    (o.pts || []).forEach(q => p.push(HL('<circle cx="' + X(q[0]) + '" cy="' + (150 - 110 * mag(q[0])) + '" r="4" fill="currentColor"/>'), S.t(X(q[0]) + 6, 150 - 110 * mag(q[0]) - 6, q[1], 'start', ' font-size="10.5"')));
    return { w: 330, h: 207, p: p.concat(o.add || []) }; };
  const w141 = { bank: EX, id: 'ex14-1', more: 'Practice 14.1（RL 電路）',
    fm: ['分壓：H = Z<sub>C</sub>/(Z<sub>R</sub> + Z<sub>C</sub>)；C → 1/(jωC)', '|1/(1 + jx)| = 1/√(1 + x²)；φ = −tan⁻¹x', 'ω = ω₀ = 1/RC：|H| = 0.707、φ = −45°', '低頻通過、高頻擋掉 → 低通濾波器'],
    figs: [null,
      c141(true, [note(110, 165, 'H = (1/jωC) / (R + 1/jωC) = 1/(1 + jωRC)', 'middle', 12)]),
      plot({ add: [note(170, 190, '|H| = 1/√(1 + (ω/ω₀)²)', 'middle', 12.5)] }),
      plot({ pts: [[0.01, '1'], [1, '0.707（−45°）']], add: ['<path d="M' + X(1) + ' 150 L' + X(1) + ' ' + (150 - 110 * 0.707) + '" stroke-dasharray="4 3"/>', S.t(X(1), 166, 'ω₀', 'middle', ' font-size="11"'), note(170, 195, 'ω → ∞：|H| → 0、φ → −90°', 'middle', 12)] }),
      plot({ pts: [[2, '0.45'], [3, '0.32'], [10, '0.1'], [100, '0.01']], add: [note(165, 195, '低頻通過、高頻被擋 → 低通', 'middle', 12.5)] })] };

  /* ═══ 題型 2：Example 14.2（電流增益、零點與極點） ═══ */
  const c142 = (lab, o) => { o = o || {};
    return F(330, 207, 45, 15, [S.is(20, 30, 130, 'I_i'), W('20,30', '200,30'), W('20,130', '200,130'), hl(o.a, S.r(110, 30, 110, 80, lab[0], { side: 'r' }) + S.l(110, 80, 110, 130, lab[1], { side: 'r' })),
      S.dot(110, 30), S.dot(110, 130), hl(o.b, S.c(200, 30, 200, 130, lab[2], { side: 'r' })), K ? K.iv(185, 42, 66, 'I_o') : ''].concat(o.add || [])); };
  const sp = (zs, ps, add) => { const X = s => 250 + s * 70, p = [W('20,100', '310,100'), W('250,30', '250,170'), S.t(306, 116, 'σ', 'end', ' font-size="11"'), S.t(258, 38, 'jω', 'start', ' font-size="11"'),
    [-3, -2, -1].map(s => S.w(X(s) + ',96', X(s) + ',104') + S.t(X(s), 118, String(s), 'middle', ' font-size="10.5"')).join('')];
    zs.forEach(z => p.push(HL('<circle cx="' + X(z) + '" cy="100" r="7" fill="none" stroke-width="2.4"/>')));
    ps.forEach(q => p.push(HL('<path d="M' + (X(q) - 7) + ' 93 L' + (X(q) + 7) + ' 107 M' + (X(q) + 7) + ' 93 L' + (X(q) - 7) + ' 107" stroke-width="2.6"/>')));
    return { w: 330, h: 207, p: p.concat(add || []) }; };
  const w142 = { bank: EX, id: 'ex14-2', more: 'Practice 14.2（轉移阻抗）',
    fm: ['分流：I<sub>o</sub> = I<sub>i</sub> × Z另一支/(Z₁ + Z₂)', '令 s = jω，分子分母同乘 0.5s', '零點：分子 = 0（畫 ○）', '極點：分母 = 0（畫 ×）'],
    figs: [null,
      c142(['4 Ω', 'j2ω', '1/(j0.5ω)'], { a: true, b: true, add: [note(110, 168, 'I_o = I_i × (4 + j2ω) / (4 + j2ω + 1/(j0.5ω))', 'middle', 11.5)] }),
      c142(['4', '2s', '2/s'], { add: [note(110, 168, 'I_o/I_i = s(s + 2) / (s² + 2s + 1)', 'middle', 13)] }),
      sp([0, -2], [], [note(165, 160, '零點：s = 0、s = −2（○）', 'middle', 13)]),
      sp([0, -2], [-1], [note(165, 160, '極點：(s + 1)² = 0 → s = −1，二重（×）', 'middle', 12.5)])] };

  D.types[0].wks = [w141];
  D.types[1].wks = [w142];
  D.intro = 'CH14 考到 14.3，只有這 3 種。前兩種先複習講義 Example；分貝課本沒有例題，用章末 14.7。';
})();
