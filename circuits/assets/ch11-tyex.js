/* CH11 題型故事 v3（使用者 11/10）：先用講義 Example（你寫過的）講，每一步換一張圖＋這一步用到的公式。
   原本的章末題故事（ch11-tyfig.js 的 wk）搬進那一題卡片的「🎬 圖解詳解」。 */
(function () {
  'use strict';
  const S = window.__SCH, Y = window.__TY, D = window.__TYPES11;
  if (!S || !Y || !D) return;
  const { HL, DIM, note, loop, ar, xm, box, thev, phasor, arRaw, tri, txt } = Y;
  const F = (w, h, dx, dy, p) => ({ w, h, p: ['<g transform="translate(' + dx + ',' + dy + ')">'].concat(p, ['</g>']) });
  const hl = (on, x) => on ? HL(x) : x;
  const W = (...a) => S.w(...a);
  const EX = '__CH11EX';

  /* 舊的章末題故事 → 卡片 */
  Y.attach('__CH11PB', D.types.map(t => t.wk).filter(Boolean));

  /* ═══ 題型 1：Example 11.4（兩個電源） ═══ */
  const c114 = o => { o = o || {};
    return F(420, 207, 60, 12, [hl(o.is, S.is(30, 30, 135, '4∠0° A')), hl(o.r, S.r(30, 30, 150, 30, '20 Ω')), hl(o.l, S.l(150, 30, 150, 135, 'j10 Ω')),
      hl(o.c, S.c(150, 30, 270, 30, '−j5 Ω')), hl(o.vs, S.vs(270, 30, 135, '60∠30° V', { side: 'r' })), W('30,135', '270,135'), S.dot(150, 30), S.dot(150, 135)].concat(o.add || [])); };
  const bar = (x, v, l, acc, sc) => { sc = sc || 0.2; const h = v * sc, y0 = 110;
    const r = '<rect x="' + x + '" y="' + (y0 - Math.max(h, 0)) + '" width="54" height="' + Math.abs(h) + '"' + (acc ? ' fill="currentColor" fill-opacity=".22"' : '') + '/>' +
      S.t(x + 27, h >= 0 ? y0 - h - 6 : y0 - h + 15, l, 'middle', ' font-size="11"');
    return acc ? HL(r) : r; };
  const w114 = { bank: EX, id: 'ex11-4', more: 'Practice 11.4（五個元件）',
    fm: ['電流源在外圍 → 網目電流 = 電流源', 'KVL：共用支路用 (I₂ − I₁)', '複數除法：大小相除、角度相減', 'P = ½V<sub>m</sub>I<sub>m</sub> cos(θ<sub>v</sub> − θ<sub>i</sub>)', '電流從 + 端流出 → P 加負號（供給）', 'P<sub>R</sub> = ½|I|²R；L、C 的 P = 0', 'Σ供給 = Σ吸收'],
    figs: [null,
      c114({ is: true, add: [loop(90, 88, 28, 'I₁'), note(90, 182, 'I₁ = 4 A（網目 1 外圍只有電流源）')] }),
      c114({ l: true, c: true, vs: true, add: [loop(210, 88, 28, 'I₂'), note(190, 182, 'j10(I₂ − I₁) − j5I₂ + 60∠30° = 0')] }),
      c114({ add: [loop(90, 88, 28, '4 A'), HL(loop(210, 88, 28, 'I₂')), note(190, 182, 'I₂ = 2 + j10.39 = 10.58∠79.1° A')] }),
      c114({ vs: true, add: [ar(285, 150, 285, 120, '', 0, 0), note(300, 112, 'I₂ 從 + 進', 'start', 11), note(170, 182, 'P = ½(60)(10.58) cos(30° − 79.1°) = 207.8 W 吸收')] }),
      c114({ is: true, add: [note(52, 60, '+', 'middle', 13), note(52, 112, '−', 'middle', 13), note(58, 88, 'V₁', 'start'), note(170, 182, 'V₁ = 184.98∠6.21° → P = −367.8 W（供給）')] }),
      c114({ r: true, add: [note(90, 60, '160 W'), DIM(''), note(122, 100, '0 W', 'end', 11.5), note(210, 58, '0 W', 'middle', 11.5), note(170, 182, '只有電阻吃平均功率：½(4)²(20) = 160 W')] }),
      { w: 330, h: 207, p: [W('20,110', '310,110'), bar(30, -367.8, '電流源 −367.8', true), bar(110, 160, '20 Ω 160'), bar(190, 207.8, '電壓源 207.8'),
        note(165, 200, '−367.8 + 160 + 207.8 = 0 ✓')] }] };

  /* ═══ 題型 2：Example 11.5（共軛匹配） ═══ */
  const c115 = o => { o = o || {};
    const p = [o.short ? HL(W('30,30', '30,145')) + note(20, 92, '短路', 'end') : S.vs(30, 30, 145, '10∠0° V'), hl(o.four, S.r(30, 30, 140, 30, '4 Ω')),
      hl(o.br, S.r(140, 30, 140, 88, '8 Ω', { side: 'r' }) + S.c(140, 88, 140, 145, '−j6 Ω', { side: 'r' })), hl(o.j5, S.l(140, 30, 250, 30, 'j5 Ω')), W('250,30', '290,30'),
      W('30,145', '290,145'), S.dot(140, 30), S.dot(140, 145)];
    p.push(o.open ? S.term(290, 30) + S.term(290, 145) + S.t(300, 34, 'a', 'start') + S.t(300, 149, 'b', 'start') : S.z(290, 30, 290, 145, 'Z_L', { side: 'r' }));
    return F(380, 207, 25, 12, p.concat(o.add || [])); };
  const w115 = { bank: EX, id: 'ex11-5', more: 'Practice 11.5（電流源電路）、11.6（純電阻負載）',
    fm: ['Z<sub>Th</sub>：獨立電源歸零，從負載端往回看', 'Z₁∥Z₂ = Z₁Z₂/(Z₁ + Z₂)', 'V<sub>Th</sub> = 開路電壓（分壓）', 'Z<sub>L</sub> = Z<sub>Th</sub>*（實部一樣、虛部變號）', 'P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>)'],
    figs: [null,
      c115({ short: true, open: true, four: true, br: true, j5: true, add: [box(55, 18, 140, 140, '4 ∥ (8 − j6)', 110, 172), note(160, 196, 'Z_Th = j5 + 4 ∥ (8 − j6)')] }),
      F(380, 207, 25, 12, [S.term(20, 30), S.term(20, 145), HL(S.z(20, 30, 140, 30, '2.933 − j0.533')), HL(S.l(140, 30, 250, 30, 'j5')), W('250,30', '290,30'), S.term(290, 30), W('20,145', '290,145'), S.term(290, 145),
        note(155, 100, '2.933 − j0.533 + j5', 'middle', 13), note(155, 125, '= 2.933 + j4.467 Ω', 'middle', 13)]),
      c115({ open: true, br: true, add: [xm(195, 30), note(195, 58, 'I = 0', 'middle', 11), note(110, 92, '+', 'middle', 13), note(110, 130, '−', 'middle', 13),
        note(160, 192, 'V_Th = 10 × (8 − j6)/(12 − j6) = 7.454∠−10.3° V')] }),
      (() => { const f = thev('7.454∠−10.3° V', '2.933 + j4.467', 'Z_L', { hl: true }); f.p.push(note(195, 175, 'Z_L = Z_Th* = 2.933 − j4.467 Ω')); f.h = 207; return f; })(),
      (() => { const f = thev('7.454∠−10.3° V', '2.933 + j4.467', 'Z_L', { cur: 'I' }); f.p.push(note(195, 172, 'j4.467 和 −j4.467 抵消，只剩 2R_Th'), note(195, 192, 'P_max = 7.454²/(8 × 2.933) = 2.368 W')); f.h = 207; return f; })()] };

  /* ═══ 題型 3：Example 11.7（rms） ═══ */
  const saw = o => { o = o || {}; const X = t => 40 + t * 34, Yv = v => 95 - v * 5.5;
    const seg = (a, b) => 'M' + X(a[0]) + ' ' + Yv(a[1]) + ' L' + X(b[0]) + ' ' + Yv(b[1]);
    let d1 = seg([0, 0], [2, 10]) + ' M' + X(2) + ' ' + Yv(10) + ' L' + X(2) + ' ' + Yv(-10) + ' L' + X(4) + ' ' + Yv(-10) + ' L' + X(4) + ' ' + Yv(0);
    let d2 = seg([4, 0], [6, 10]) + ' M' + X(6) + ' ' + Yv(10) + ' L' + X(6) + ' ' + Yv(-10) + ' L' + X(8) + ' ' + Yv(-10);
    const p = [W('30,95', '330,95'), W('40,30', '40,165'), S.t(332, 108, 't (s)', 'end', ' font-size="10.5"'), S.t(34, Yv(10) + 4, '10', 'end', ' font-size="10.5"'), S.t(34, Yv(-10) + 4, '−10', 'end', ' font-size="10.5"'),
      [2, 4, 6, 8].map(t => S.t(X(t), 108, String(t), 'middle', ' font-size="10"')).join(''),
      hl(o.p1, '<path d="' + d1 + '" fill="none"/>'), '<path d="' + d2 + '" fill="none"' + (o.p1 ? ' opacity=".3"' : '') + '/>'];
    if (o.p1) p.push(box(40, 32, 136, 128, 'T = 4', 108, 28));
    return { w: 340, h: 207, p: p.concat(o.add || []) }; };
  const sq = o => { o = o || {}; const X = t => 50 + t * 60, Yv = v => 160 - v * 1.1;
    let d = 'M' + X(0) + ' ' + Yv(0); for (let i = 1; i <= 20; i++) { const t = i / 10; d += ' L' + X(t) + ' ' + Yv(25 * t * t); }
    const area1 = d + ' L' + X(2) + ' ' + Yv(0) + ' Z', area2 = 'M' + X(2) + ' ' + Yv(0) + ' L' + X(2) + ' ' + Yv(100) + ' L' + X(4) + ' ' + Yv(100) + ' L' + X(4) + ' ' + Yv(0) + ' Z';
    const p = [W('40,160', '310,160'), W('50,40', '50,170'), S.t(44, Yv(100) + 4, '100', 'end', ' font-size="10.5"'), S.t(302, 174, 't', 'end', ' font-size="10.5"'),
      [2, 4].map(t => S.t(X(t), 174, String(t), 'middle', ' font-size="10"')).join(''), S.t(60, 44, 'i²(t)', 'start', ' font-size="11"'),
      HL('<path d="' + d + ' M' + X(2) + ' ' + Yv(100) + ' L' + X(4) + ' ' + Yv(100) + '" fill="none"/>')];
    if (o.area) p.push('<g style="color:var(--s-acc)"><path d="' + area1 + '" fill="currentColor" fill-opacity=".2" stroke="none"/><path d="' + area2 + '" fill="currentColor" fill-opacity=".12" stroke="none"/></g>',
      note(X(1.45), Yv(18), '200/3'), note(X(3), Yv(50), '200'));
    if (o.avg) p.push(HL('<path d="M' + X(0) + ' ' + Yv(66.67) + ' L' + X(4) + ' ' + Yv(66.67) + '" stroke-dasharray="6 4"/>'), note(X(4) + 6, Yv(66.67) + 4, '平均 66.67', 'start', 11.5));
    return { w: 340, h: 207, p: p.concat(o.add || []) }; };
  const w117 = { bank: EX, id: 'ex11-7', more: 'Practice 11.7（三角波）、Example 11.8（半波整流）',
    fm: ['先找週期 T，寫出每一段的式子', 'I<sub>rms</sub> = √[(1/T)∫₀<sup>T</sup> i² dt]', '∫t² dt = t³/3；平方後負號消失', 'rms = √(平方的平均)', 'P = I<sub>rms</sub>²R（用 rms 就不用 ½）'],
    figs: [null,
      saw({ p1: true, add: [note(250, 190, '0～2：i = 5t；2～4：i = −10', 'middle', 12)] }),
      sq({ add: [note(185, 200, 'I_rms² = ¼[∫₀²(5t)² dt + ∫₂⁴ 100 dt]', 'middle', 12)] }),
      sq({ area: true, add: [note(185, 200, '面積 = 200/3 + 200 = 266.7', 'middle', 12)] }),
      sq({ area: true, avg: true, add: [note(185, 200, '266.7 ÷ 4 = 66.67 → I_rms = √66.67 = 8.165 A', 'middle', 12)] }),
      F(330, 207, 40, 15, [S.is(40, 20, 140, 'i(t)'), W('40,20', '180,20'), W('40,140', '180,140'), HL(S.r(180, 20, 180, 140, '2 Ω', { side: 'r' })), ar(80, 8, 140, 8, 'I_rms = 8.165 A', 110, 2),
        note(110, 180, 'P = 66.67 × 2 = 133.3 W')])] };

  /* ═══ 題型 4：Example 11.10（整個電路的 pf） ═══ */
  const c1110 = o => { o = o || {};
    return F(380, 207, 70, 15, [hl(o.vs, S.vs(40, 30, 140, '30∠0° V rms')), hl(o.six, S.r(40, 30, 160, 30, '6 Ω')), hl(o.par, S.c(160, 30, 160, 140, '−j2 Ω', { side: 'r' })), W('160,30', '250,30'),
      hl(o.par, S.r(250, 30, 250, 140, '4 Ω', { side: 'r' })), W('40,140', '250,140'), S.dot(160, 30), S.dot(160, 140)].concat(o.add || [])); };
  const w1110 = { bank: EX, id: 'ex11-10', more: 'Practice 11.10、Example 11.9（反推元件）',
    fm: ['Z = 串 + (並)；Z₁∥Z₂ = Z₁Z₂/(Z₁ + Z₂)', 'pf = cos θ<sub>Z</sub>；θ < 0 → 超前（電容性）', 'I = V/Z（電源是 rms，電流也是 rms）', 'P = V<sub>rms</sub>I<sub>rms</sub>·pf = I<sub>rms</sub>²R'],
    figs: [null,
      c1110({ par: true, six: true, add: [box(145, 18, 140, 136, '4 ∥ (−j2) = 0.8 − j1.6', 215, 12), note(160, 186, 'Z = 6 + 0.8 − j1.6 = 6.8 − j1.6 = 7∠−13.24° Ω')] }),
      { w: 330, h: 207, p: [tri(60, 70, 6.8, -1.6, 32, ['R = 6.8', 'X = −1.6', '', 'θ = −13.24°']), note(165, 160, 'pf = cos(−13.24°) = 0.9734', 'middle', 13), note(165, 182, '虛部負 → 電容性 → 超前（leading）', 'middle', 12)] },
      c1110({ vs: true, add: [ar(70, 16, 130, 16, 'I = 4.286∠13.24° A', 100, 9), note(160, 186, 'I = 30∠0° ÷ 7∠−13.24°')] }),
      F(350, 207, 70, 15, [S.vs(40, 30, 140, '30 V rms'), W('40,30', '200,30'), W('40,140', '200,140'), HL(S.z(200, 30, 200, 140, '6.8 − j1.6', { side: 'r' })), ar(80, 16, 140, 16, '4.286 A', 110, 9),
        note(120, 175, 'P = 30 × 4.286 × 0.9734 = 125 W'), note(120, 193, '或 I²R = 4.286² × 6.8 = 125 W', 'middle', 11.5)])] };

  /* ═══ 題型 5：Example 11.11（S、P、Q） ═══ */
  const ld = (lab, add) => F(330, 207, 20, 10, [S.term(60, 30), S.term(60, 150), W('60,30', '170,30'), W('60,150', '170,150'), S.box(170, 20, 100, 140, lab),
    S.t(50, 50, '+', 'middle', ' font-size="13"'), S.t(50, 140, '−', 'middle', ' font-size="13"'), S.t(46, 95, 'v(t)', 'end'), ar(85, 18, 140, 18, 'i(t)', 112, 11)].concat(add || []));
  const w1111 = { bank: EX, id: 'ex11-11', more: 'Practice 11.11、Example 11.12（由 kVA 反推）',
    fm: ['rms 相量：大小 ÷ √2，角度不變', 'S = V<sub>rms</sub>I<sub>rms</sub>* → 角度 = θ<sub>v</sub> − θ<sub>i</sub>', '|S| = 視在功率（VA）', 'S = P + jQ；Q < 0 → 電容性', 'pf = cos(θ<sub>v</sub> − θ<sub>i</sub>)；Z = V/I'],
    figs: [ld(['負載', 'Z = ?'], [note(165, 192, 'v = 60 cos(ωt − 10°)，i = 1.5 cos(ωt + 50°)', 'middle', 12)]),
      { w: 330, h: 207, p: [phasor(150, 100, [[95, -10, 'V = 42.43∠−10°'], [60, 50, 'I = 1.061∠50°', true]], { ax: 130, ay: 85 }), note(165, 200, 'V、I 都換成 rms：÷ √2')] },
      { w: 330, h: 207, p: [phasor(150, 95, [[60, 50, 'I'], [60, -50, 'I*', true], [70, -60, 'S = 45∠−60°', true]], { ax: 130, ay: 85 }), note(165, 204, 'S = V I*：角度 −10° − 50° = −60°')] },
      { w: 330, h: 207, p: [tri(70, 50, 22.5, -38.97, 3.2, ['P = 22.5', 'Q = −38.97', '', '']), note(220, 150, '|S| = 45 VA', 'middle', 13), txt(220, 172, 'S = 22.5 − j38.97 VA', 'middle', 11.5)] },
      { w: 330, h: 207, p: [HL(tri(70, 50, 22.5, -38.97, 3.2, ['P = 22.5 W', 'Q = −38.97 VAR', '', ''])), note(220, 160, 'Q 為負 → 電容性', 'middle', 12)] },
      ld(['Z = 40∠−60°', '電容性'], [note(165, 192, 'pf = cos(−60°) = 0.5 超前')])] };

  /* ═══ 題型 6：Example 11.13（電源、線路、負載） ═══ */
  const c1113 = o => { o = o || {};
    return F(400, 207, 85, 10, [hl(o.s, S.vs(30, 40, 140, '220∠0° V rms')), hl(o.line, S.r(30, 40, 130, 40, '4 Ω') + S.l(130, 40, 230, 40, 'j2 Ω')), W('230,40', '270,40'),
      hl(o.load, S.r(270, 40, 270, 90, '15 Ω', { side: 'r' }) + S.c(270, 90, 270, 140, '−j10 Ω', { side: 'r' })), W('30,140', '270,140'),
      S.t(30, 160, 'Source', 'middle', ' font-size="11"'), S.t(130, 160, 'Line', 'middle', ' font-size="11"'), S.t(270, 160, 'Load', 'middle', ' font-size="11"')].concat(o.add || [])); };
  const vecs = () => { const sc = 0.105, x0 = 40, y0 = 60, L = [455.4 * sc, -227.7 * sc], Ld = [1708 * sc, 1139 * sc];
    const A = [x0 + L[0], y0 + L[1]], B = [A[0] + Ld[0], A[1] + Ld[1]];
    return [W('30,' + y0, '320,' + y0), arRaw(x0, y0, A[0], A[1]), S.t(A[0] - 6, A[1] - 8, 'S_line', 'middle', ' font-size="11"'), arRaw(A[0], A[1], B[0], B[1]), S.t((A[0] + B[0]) / 2 + 6, (A[1] + B[1]) / 2 - 6, 'S_L', 'start', ' font-size="11"'),
      HL(arRaw(x0, y0, B[0], B[1])), note((x0 + B[0]) / 2 - 10, (y0 + B[1]) / 2 + 22, 'S_s', 'end')]; };
  const w1113 = { bank: EX, id: 'ex11-13', more: 'Practice 11.13、Example 11.14（並聯負載）',
    fm: ['串聯：Z 直接相加', 'I = V/Z', 'S = V I*（電源送出）', '串聯元件：S = |I|²Z', 'S = |I|²Z', '複功率守恆：ΣS供給 = ΣS吸收'],
    figs: [null,
      c1113({ line: true, load: true, add: [note(150, 192, 'Z = (4 + j2) + (15 − j10) = 19 − j8 Ω')] }),
      c1113({ add: [ar(55, 26, 110, 26, 'I', 82, 18), note(150, 192, 'I = 220 ÷ 20.62∠−22.83° = 10.67∠22.83° A')] }),
      c1113({ s: true, add: [note(150, 192, 'S_s = 220 × 10.67∠−22.83° = 2163.5 − j910.8 VA')] }),
      c1113({ line: true, add: [note(150, 192, 'S_line = 10.67² × (4 + j2) = 455.4 + j227.7 VA')] }),
      c1113({ load: true, add: [note(150, 192, 'S_L = 10.67² × (15 − j10) = 1708 − j1139 VA')] }),
      { w: 330, h: 207, p: vecs().concat([note(165, 200, 'S_line + S_L = 2163 − j911 = S_s ✓')]) }] };

  /* ═══ 題型 7：Example 11.15（功因校正） ═══ */
  const pfc = (cHL, add) => F(380, 207, 85, 15, [S.vs(30, 30, 140, '120 V, 60 Hz'), W('30,30', '230,30'), W('30,140', '230,140'), S.box(180, 55, 80, 60, ['4 kW', 'pf 0.8']), W('220,30', '220,55'), W('220,115', '220,140'),
    cHL ? HL(S.c(120, 30, 120, 140, 'C', { side: 'r' })) : '<g stroke-dasharray="4 3">' + S.c(120, 30, 120, 140, 'C = ?', { side: 'r' }) + '</g>', S.dot(120, 30), S.dot(120, 140)].concat(add || []));
  const pt = (o) => { const sc = 0.04, x0 = 40, y0 = 170, x1 = x0 + 4000 * sc;
    const p = [tri(x0, y0, 4000, 3000, sc, ['P = 4000 W', o.q2 ? '' : 'Q₁ = 3000', '', ''])];
    if (o.q2) p.push(HL(tri(x0, y0, 4000, 1314.4, sc, ['', '', '', ''])), note(x1 + 8, y0 - 1314.4 * sc / 2 + 4, 'Q₂ = 1314', 'start', 11.5), S.t(x1 + 8, y0 - 3000 * sc + 10, 'Q₁ = 3000', 'start', ' font-size="11"'));
    if (o.qc) p.push(HL('<path d="M' + (x1 + 3) + ' ' + (y0 - 3000 * sc) + ' L' + (x1 + 3) + ' ' + (y0 - 1314.4 * sc) + '" stroke-width="5"/>'), note(x1 + 70, y0 - 2150 * sc, 'Q_C = 1685.6', 'start', 12));
    return { w: 330, h: 207, p: p.concat(o.add || []) }; };
  const w1115 = { bank: EX, id: 'ex11-15', more: 'Practice 11.15（校正到 pf = 1）',
    fm: ['|S| = P/pf，Q = |S| sin θ', '並聯電容 P 不變：Q₂ = P tan θ₂', 'Q<sub>C</sub> = P(tan θ₁ − tan θ₂)', 'C = Q<sub>C</sub>/(ωV<sub>rms</sub>²)'],
    figs: [pfc(false, [note(150, 185, '並聯一顆電容，把 pf 拉到 0.95')]),
      pt({ add: [note(170, 40, 'θ₁ = 36.87°，|S₁| = 5000 VA', 'start', 12)] }),
      pt({ q2: true, add: [note(170, 40, 'θ₂ = 18.19°，P 一樣 4000', 'start', 12)] }),
      pt({ q2: true, qc: true, add: [note(165, 200, '少掉的 Q 由電容提供')] }),
      pfc(true, [note(150, 178, 'C = 1685.6 / (2π·60·120²)'), note(150, 196, '= 310.5 μF')])] };

  /* ═══ 題型 8：Example 11.16（瓦特計）＋ 11.18（電費） ═══ */
  const c1116 = o => { o = o || {};
    return F(420, 207, 90, 10, [S.vs(30, 30, 145, '150∠0° V rms'), hl(o.src, S.r(30, 30, 120, 30, '12 Ω') + S.l(120, 30, 210, 30, 'j10 Ω')), hl(o.wm, S.wm(210, 30, 290, 145)),
      hl(o.load, S.r(290, 30, 290, 88, '8 Ω', { side: 'r' }) + S.c(290, 88, 290, 145, '−j6 Ω', { side: 'r' })), W('30,145', '290,145')].concat(o.add || [])); };
  const w1116 = { bank: EX, id: 'ex11-16', more: 'Practice 11.16',
    fm: ['I = V/Z總', 'V負載 = I·Z負載', 'S = V I*；(a + jb)(a − jb) = a² + b²', '瓦特計讀數 = Re S（電流線圈的電流 × 電壓線圈的電壓）'],
    figs: [null,
      c1116({ src: true, load: true, add: [loop(160, 95, 30, 'I'), note(160, 192, 'I = 150 / (20 + j4) A')] }),
      c1116({ load: true, add: [note(318, 60, '+', 'middle', 13), note(318, 140, '−', 'middle', 13), note(322, 100, 'V', 'start'), note(160, 192, 'V = I(8 − j6)')] }),
      c1116({ wm: true, add: [note(160, 192, 'S = V I* = 22500(8 − j6)/416 = 432.7 − j324.5 VA')] }),
      c1116({ wm: true, load: true, add: [note(160, 186, '讀數 = P = 432.7 W'), note(160, 202, '驗算：|I|²R = 7.354² × 8 = 432.7 W', 'middle', 11.5)] })] };
  const bill = (rows, add) => ({ w: 330, h: 207, p: [S.box(60, 20, 210, 30 + rows.length * 22, [])].concat(rows.map((r, i) => (r[1] ? note : txt)(165, 46 + i * 22, r[0], 'middle', 13)), add || []) });
  const w1118 = { bank: EX, id: 'ex11-18', more: 'Practice 11.18（pf 高於 0.85 有減免）、Example 11.17（兩段式電費）',
    fm: ['電能 W = P × t（kWh = 度）', '差幾個 0.01 × 0.1%', '罰款 = 多算的度數', '電費 = 度數 × 單價'],
    figs: [bill([['300 kW 負載，13 kV'], ['每月運轉 520 h'], ['pf = 0.80'], ['每度 6 美分'], ['pf 每低於 0.85 一個 0.01 → 罰 0.1%']]),
      { w: 330, h: 207, p: [HL('<rect x="60" y="50" width="210" height="90" fill="currentColor" fill-opacity=".15"/>'), S.t(165, 158, '520 h', 'middle', ' font-size="11.5"'), S.t(52, 99, '300 kW', 'end', ' font-size="11.5"'),
        note(165, 100, '156,000 kWh', 'middle', 15), note(165, 190, '面積 = 功率 × 時間')] },
      { w: 330, h: 207, p: [W('40,100', '300,100'), [0, 1, 2, 3, 4, 5].map(i => S.w((60 + i * 44) + ',94', (60 + i * 44) + ',106') + S.t(60 + i * 44, 124, (0.80 + i * 0.01).toFixed(2), 'middle', ' font-size="10.5"')).join(''),
        HL('<path d="M60 100 L280 100" stroke-width="5"/>'), note(60, 80, '你：0.80', 'middle', 12), note(280, 80, '標準 0.85', 'middle', 12), note(165, 160, '差 5 格 × 0.1% = 0.5% 罰款')] },
      { w: 330, h: 207, p: [bar(80, 156, '156,000', false, 0.6), HL('<rect x="80" y="' + (110 - 156 * 0.6 - 0.78 * 0.6 * 8) + '" width="54" height="' + (0.78 * 0.6 * 8) + '" fill="currentColor" fill-opacity=".5"/>'), note(150, 20, '+ 780 kWh（0.5%）', 'start', 12),
        W('40,110', '300,110'), note(200, 70, 'W_t = 156,780 kWh', 'start', 12.5)] },
      bill([['$0.06 × 156,780'], ['= $9,406.80', true]], [note(165, 160, '罰款用「多算度數」的方式加上去', 'middle', 12)])] };

  [[w114], [w115], [w117], [w1110], [w1111], [w1113], [w1115], [w1116, w1118]].forEach((ws, i) => { D.types[i].wks = ws; });
  D.intro = 'CH11 的題目拆開來只有這 8 種。每種先複習你寫過的講義 Example。';
})();
