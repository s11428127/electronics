/* CH12 題型故事：每個例題、每一步的圖（types-story.js 的 wk） */
(function () {
  'use strict';
  const S = window.__SCH, Y = window.__TY, D = window.__TYPES12, PB = window.__CH12PB;
  if (!S || !Y || !D) return;
  const { HL, DIM, note, loop, ar, box, phasor, arRaw, tri, txt } = Y;
  const tp = PB && PB.tp;
  const F = (w, h, dx, dy, p) => ({ w, h, p: ['<g transform="translate(' + dx + ',' + dy + ')">'].concat(p, ['</g>']) });
  const hl = (on, x) => on ? HL(x) : x;

  /* 單相等效：電源 src、線路 zl（可省）、負載 zd；o.hl = 'line'|'load'|'all' */
  function spe(src, zl, zd, o) {
    o = o || {};
    const p = [S.vs(30, 30, 140, src)];
    if (zl) p.push(hl(o.hl === 'line' || o.hl === 'all', S.z(30, 30, 150, 30, zl)), S.w('150,30', '240,30'));
    else p.push(S.w('30,30', '240,30'));
    p.push(hl(o.hl === 'load' || o.hl === 'all', S.z(240, 30, 240, 140, zd, { side: 'r' })), S.w('30,140', '240,140'), S.t(30, 156, 'n', 'middle', ' font-size="11"'), S.t(240, 156, 'N', 'middle', ' font-size="11"'),
      S.t(135, 156, '中性線（假想）', 'middle', ' font-size="10.5"'));
    if (o.loop) p.push(loop(135, 85, 32, o.loop));
    return F(420, 192, 70, 5, p.concat(o.add || []));
  }
  /* Δ 三角形：頂點 A(150,25)、B(70,160)、C(230,160)；ls = [AB, BC, CA] 標籤；hi = 要亮的邊 */
  function delta(ls, hi, add, src) {
    const A = [150, 25], B = [70, 160], C = [230, 160];
    const el = (p1, p2, l, i) => hl(hi && hi.indexOf(i) >= 0, (src ? S.vs ? '' : '' : '') + S.z(p1[0], p1[1], p2[0], p2[1], l, { side: i === 1 ? 'b' : undefined }));
    return { w: 300, h: 210, p: [el(A, B, ls[0], 0), el(B, C, ls[1], 1), el(C, A, ls[2], 2), S.dot(A[0], A[1]), S.dot(B[0], B[1]), S.dot(C[0], C[1]),
      S.t(A[0], A[1] - 8, 'A', 'middle'), S.t(B[0] - 10, B[1] + 4, 'B', 'end'), S.t(C[0] + 10, C[1] + 4, 'C', 'start')].concat(add || []) };
  }
  /* 小星形（Y）：中心 (cx,cy)，三支標籤 */
  function star(cx, cy, lab, title) {
    const pts = [[cx, cy - 55], [cx - 50, cy + 32], [cx + 50, cy + 32]];
    return pts.map((q, i) => S.z(cx, cy, q[0], q[1], '') + S.t(q[0] + (i === 1 ? -8 : 8), q[1] + (i === 0 ? -4 : 12), lab[i], i === 1 ? 'end' : 'start', ' font-size="11"')).join('') +
      S.dot(cx, cy) + (title ? S.t(cx, cy + 62, title, 'middle', ' font-size="11.5"') : '');
  }
  function tri3(cx, cy, lab, title) {
    const A = [cx, cy - 50], B = [cx - 50, cy + 35], C = [cx + 50, cy + 35];
    return S.z(A[0], A[1], B[0], B[1], '') + S.z(B[0], B[1], C[0], C[1], '') + S.z(C[0], C[1], A[0], A[1], '') + S.t(cx, cy + 6, lab, 'middle', ' font-size="11"') + (title ? S.t(cx, cy + 62, title, 'middle', ' font-size="11.5"') : '');
  }

  /* ── 題型 1：Problem 12.1 ── */
  const gen = { w: 300, h: 190, p: [S.dot(150, 100), S.w('150,100', '150,30'), S.w('150,100', '80,150'), S.w('150,100', '220,150'),
    '<circle cx="150" cy="65" r="12"/><circle cx="115" cy="125" r="12"/><circle cx="185" cy="125" r="12"/>', S.t(150, 69, '~'), S.t(115, 129, '~'), S.t(185, 129, '~'),
    S.term(150, 30), S.term(80, 150), S.term(220, 150), S.t(160, 30, 'a', 'start'), S.t(70, 154, 'b', 'end'), S.t(230, 154, 'c', 'start'), S.t(158, 104, 'n', 'start', ' font-size="11"'),
    ar(140, 36, 86, 140, 'V_ab = 400 V', 70, 80)] };
  const w121 = { id: 'p12-1', figs: [gen,
    { w: 330, h: 207, p: [phasor(140, 100, [[110, 0, 'V_ab = 400'], [64, -30, 'V_an = 230.9', true]], { ax: 120, ay: 80 }), note(165, 185, '大小 ÷ √3：400/√3 = 230.9 V')] },
    { w: 330, h: 207, p: [DIM(phasor(160, 95, [[110, 0, 'V_ab']], { ax: 120, ay: 80 })), phasor(160, 95, [[64, -30, 'V_an∠−30°', true], [64, -150, 'V_bn∠−150°', true], [64, 90, 'V_cn∠90°', true]], { ax: 0, ay: 0 }), note(165, 185, 'abc：V_an 落後 V_ab 30°，其他 ∓120°')] },
    { w: 330, h: 207, p: [DIM(phasor(160, 95, [[110, 0, 'V_ab']], { ax: 120, ay: 80 })), phasor(160, 95, [[64, 30, 'V_an∠30°', true], [64, 150, 'V_bn∠150°', true], [58, -90, 'V_cn∠−90°', true]], { ax: 0, ay: 0 }), note(165, 185, 'acb：反過來，V_an 超前 30°')] }] };

  /* ── 題型 2：Problem 12.8 ── */
  const f128 = tp ? tp({ src: 'Y', sl: ['100∠20° V', '100∠−100° V', '100∠140° V'], line: ['0.6 + j1.2', '0.6 + j1.2', '0.6 + j1.2'], load: 'Y', ll: ['10 + j14', '10 + j14', '10 + j14'], neutral: true }) : null;
  const w128 = { id: 'p12-8', figs: [f128,
    spe('100∠20° V', '0.6 + j1.2 Ω', '10 + j14 Ω', { hl: 'all', add: [note(135, 186, 'Z總 = 10.6 + j15.2 = 18.53∠55.11° Ω')] }),
    { w: 330, h: 207, p: [phasor(150, 95, [[70, -35.11, 'I_a = 5.396∠−35.11°', true], [70, -155.11, 'I_b ∠−155.11°'], [70, 84.89, 'I_c ∠84.89°']], { ax: 130, ay: 85 }), note(165, 202, '算 I_a = V_an/Z總，另兩相轉 ∓120°')] },
    spe('100∠20° V', '0.6 + j1.2 Ω', '10 + j14 Ω', { hl: 'load', add: [note(135, 186, 'V_AN = I_a × Z = 92.84∠19.35° V')] })] };

  /* ── 題型 3：Problem 12.18 ── */
  const w1218 = { id: 'p12-18', figs: [null,
    { w: 330, h: 207, p: [phasor(140, 120, [[55, 60, 'V_an = 220∠60°'], [95, 90, 'V_AB = 381.1∠90°', true]], { ax: 120, ay: 100 }), note(165, 202, '線電壓 = √3 × 相電壓，角度 +30°')] },
    delta(['12 + j9', '12 + j9', '12 + j9'], [0], [ar(80, 120, 125, 45, 'I_AB', 85, 70), note(150, 203, 'Δ 一相跨的就是線電壓：I_AB = V_AB/Z')]),
    { w: 330, h: 207, p: [phasor(150, 95, [[70, 53.13, 'I_AB ∠53.13°', true], [70, -66.87, 'I_BC ∠−66.87°'], [70, 173.13, 'I_CA ∠173.13°']], { ax: 130, ay: 85 }), note(165, 202, '大小都是 25.40 A，差 120°')] }] };

  /* ── 題型 4：Problem 12.24 ── */
  const f1224 = tp ? tp({ src: 'D', sl: ['416∠30° V', '416∠−90° V', '416∠150° V'], line: ['1 + j1', '1 + j1', '1 + j1'], load: 'D', ll: ['60∠30° Ω', '60∠30° Ω', '60∠30° Ω'] }) : null;
  const w1224 = { id: 'p12-24', figs: [f1224,
    { w: 340, h: 200, p: [tri3(80, 85, '~', 'Δ 電源：V_ab = 416∠30°'), HL(ar(140, 85, 195, 85, '換', 167, 77)), HL(star(260, 85, ['a', 'b', 'c'], 'Y：V_an = 240.2∠0°'))] },
    { w: 340, h: 200, p: [tri3(80, 85, '60∠30°', 'Δ 負載'), HL(ar(140, 85, 195, 85, '÷3', 167, 77)), HL(star(260, 85, ['', '', ''], 'Y：20∠30° = 17.32 + j10'))] },
    spe('240.2∠0° V', '1 + j1 Ω', '17.32 + j10 Ω', { loop: 'I_a', add: [note(135, 186, 'I_a = 240.2/(18.32 + j11) = 11.24∠−30.98° A')] }),
    delta(['60∠30°', '60∠30°', '60∠30°'], [0, 2], [ar(150, 25, 150, -2, ''), S.t(160, 8, 'I_a 進來', 'start', ' font-size="11"'), note(150, 203, '回到 Δ：I_AB = I_a∠30°/√3 = 6.489∠−0.98° A')])] };
  w1224.figs[4].p.unshift('<g transform="translate(0,12)">'); w1224.figs[4].p.push('</g>'); w1224.figs[4].h = 205;

  /* ── 題型 5：Problem 12.31 ── */
  const f1231 = delta(['Z_p', 'Z_p', 'Z_p'], [], [S.t(150, 200, '線電壓 240 V；每相 6 kW、pf 0.8 落後', 'middle', ' font-size="11"')]);
  const w1231 = { id: 'p12-31', figs: [f1231,
    { w: 330, h: 207, p: [tri(70, 150, 6, 4.5, 26, ['P = 6 kW', 'Q = 4.5 kVAR', '', '']), note(150, 75, '|S| = 6/0.8 = 7.5 kVA', 'start'), note(150, 95, 'I_p = 7500/240 = 31.25 A', 'start')] },
    delta(['Z_p', 'Z_p', 'Z_p'], [0], [note(40, 85, '240 V', 'end'), ar(80, 120, 125, 45, 'I_p', 85, 70), note(150, 203, 'Z_p = 240/31.25 ∠36.87° = 6.144 + j4.608 Ω')]),
    { w: 330, h: 207, p: [phasor(150, 100, [[60, 0, 'I_AB'], [60, -60, '−I_CA'], [104, -30, 'I_a = √3 I_p', true]], { ax: 120, ay: 85 }), note(165, 202, 'Δ：線電流 = √3 × 相電流 = 54.13 A')] },
    { w: 330, h: 207, p: [S.z(60, 30, 60, 140, 'Z_p', { side: 'l' }), HL(S.c(140, 30, 140, 140, 'C', { side: 'r' })), S.w('60,30', '140,30'), S.w('60,140', '140,140'), S.t(100, 20, '240 V', 'middle'),
      '<path d="M190 140 L270 140 L270 80" fill="none"/>', HL(arRaw(280, 80, 280, 138)), note(285, 112, 'Q_C', 'start'), note(165, 172, 'C = Q_p/(ωV²) = 4500/(377 × 240²) = 207.2 μF')] }] };

  /* ── 題型 6：Problem 12.54 ── */
  const f1254 = tp ? tp({ src: 'Y', sl: ['210∠0° V', '210∠−120° V', '210∠120° V'], load: 'Y', ll: ['80 Ω', '60 + j90 Ω', 'j80 Ω'], neutral: true }) : null;
  const mini = (x, src, z, I) => S.vs(x, 30, 120, '') + S.t(x, 22, src, 'middle', ' font-size="10.5"') + S.w(x + ',30', (x + 60) + ',30') + S.z(x + 60, 30, x + 60, 120, '', { side: 'r' }) + S.t(x + 70, 80, z, 'start', ' font-size="10.5"') +
    S.w(x + ',120', (x + 60) + ',120') + loop(x + 30, 75, 18, '') + S.t(x + 30, 140, I, 'middle', ' font-size="10.5"');
  const w1254 = { id: 'p12-54', figs: [f1254,
    { w: 360, h: 190, p: [mini(20, '210∠0°', '80', 'I_a = 2.625∠0°'), mini(135, '210∠−120°', '60+j90', 'I_b = 1.941∠−176.31°'), mini(250, '210∠120°', 'j80', 'I_c = 2.625∠30°'),
      note(180, 175, '有中性線：三相各自一個迴路，各算各的')] },
    (() => { const s = 0.18, x0 = 40, y0 = 160; const A = [x0 + 551.3 * s, y0], B = [A[0] + 226.1 * s, y0 - 339.2 * s], C = [B[0], B[1] - 551.3 * s];
      return { w: 330, h: 207, p: [arRaw(x0, y0, A[0], A[1]), S.t((x0 + A[0]) / 2, y0 + 14, 'S_A = 551.3', 'middle', ' font-size="11"'), arRaw(A[0], A[1], B[0], B[1]), S.t(B[0] + 6, (A[1] + B[1]) / 2 + 10, 'S_B', 'start', ' font-size="11"'),
        arRaw(B[0], B[1], C[0], C[1]), S.t(C[0] + 6, (B[1] + C[1]) / 2, 'S_C = j551.3', 'start', ' font-size="11"'), HL(arRaw(x0, y0, C[0], C[1])), note(x0 + 20, C[1] + 4, 'S = 777.4 + j890.5 VA', 'start')] }; })()] };

  /* ── 題型 7：Problem 12.70 ── */
  const wmbox = (x, y, l) => '<rect x="' + (x - 16) + '" y="' + (y - 11) + '" width="32" height="22" rx="3"/>' + S.t(x, y + 4, l, 'middle', ' font-size="11"');
  const f1270 = { w: 340, h: 180, p: [S.w('20,40', '110,40'), S.w('142,40', '250,40'), S.w('20,90', '250,90'), S.w('20,140', '110,140'), S.w('142,140', '250,140'), wmbox(126, 40, 'W1'), wmbox(126, 140, 'W2'),
    '<path d="M126 51 L126 90 M126 129 L126 90" fill="none" stroke-dasharray="4 3"/>', S.dot(126, 90), S.t(12, 44, 'a', 'end'), S.t(12, 94, 'b', 'end'), S.t(12, 144, 'c', 'end'),
    S.box(250, 25, 70, 130, ['三相', '馬達', '（Y）']), S.t(160, 172, '240 V、I_L = 6 A；P_1 = 1200 W、P_2 = −400 W', 'middle', ' font-size="11"')] };
  const bar = (x, v, l, acc) => { const h = v * 0.07; const r = '<rect x="' + x + '" y="' + (100 - Math.max(h, 0)) + '" width="40" height="' + Math.abs(h) + '"' + (acc ? ' fill="currentColor" fill-opacity=".25"' : '') + '/>' + S.t(x + 20, h >= 0 ? 100 - h - 6 : 100 - h + 14, l, 'middle', ' font-size="11"'); return acc ? HL(r) : r; };
  const w1270 = { id: 'p12-70', figs: [f1270,
    { w: 330, h: 207, p: [S.w('20,100', '300,100'), bar(40, 1200, 'P_1 = 1200'), bar(110, -400, 'P_2 = −400'), bar(190, 800, 'P = 800', true),
      note(240, 160, 'P = P_1 + P_2 = 800 W', 'middle', 11.5), note(240, 178, 'Q = √3 (P_2 − P_1)：大小 2771 VAR', 'middle', 11.5)] },
    { w: 330, h: 207, p: [tri(80, 165, 800, 2771, 0.05, ['P = 800', 'Q = 2771', '', '']), note(210, 90, 'θ = 73.90°', 'start'), note(210, 112, 'pf = 0.2774', 'start'), txt(210, 134, '讀值一負 → pf < 0.5', 'start', 11)] },
    { w: 330, h: 207, p: [S.vs(40, 40, 150, '138.6 V'), S.w('40,40', '160,40'), S.w('40,150', '160,150'), HL(S.z(160, 40, 160, 150, 'Z_p', { side: 'r' })), ar(80, 54, 130, 54, '6 A'),
      note(250, 80, '|Z_p| = 138.6/6 = 23.09', 'middle', 11.5), note(250, 100, '∠73.90°', 'middle', 11.5), note(250, 120, '= 6.40 + j22.19 Ω', 'middle', 11.5)].map(x => x).concat([]) }] };
  w1270.figs[3].p = ['<g transform="translate(30,0)">'].concat(w1270.figs[3].p, ['</g>']); w1270.figs[3].w = 360;

  /* ── 題型 8：Problem 12.45 ── */
  const f1245 = { w: 360, h: 170, p: [S.box(10, 30, 70, 110, ['發電機', '（Y）']), S.w('80,45', '120,45'), S.z(120, 45, 200, 45, ''), S.w('200,45', '260,45'), S.w('80,85', '120,85'), S.z(120, 85, 200, 85, ''), S.w('200,85', '260,85'),
    S.w('80,125', '120,125'), S.z(120, 125, 200, 125, ''), S.w('200,125', '260,125'), S.t(160, 30, '每相 0.5 + j2 Ω', 'middle', ' font-size="11"'), S.box(260, 30, 90, 110, ['Y 負載', '450 kW', 'pf 0.708', '440 V'])] };
  const sc = 0.055, LZ = 1719.4 * sc, LL = 254 * sc;
  const w1245 = { id: 'p12-45', figs: [f1245,
    spe('V_g = ?', '0.5 + j2 Ω', '負載 254∠0° V', { add: [ar(160, 44, 210, 44, 'I_L = 834∠−44.92° A', 185, 22)] }),
    { w: 330, h: 207, p: [S.w('30,160', '310,160'), arRaw(40, 160, 40 + LL, 160), S.t(40, 176, 'V_AN = 254∠0°', 'start', ' font-size="11"'),
      arRaw(40 + LL, 160, 40 + LL + LZ * Math.cos(31.04 * Math.PI / 180), 160 - LZ * Math.sin(31.04 * Math.PI / 180)), S.t(150, 120, 'I_L Z_線 = 1719∠31.04°', 'start', ' font-size="11"'),
      HL(arRaw(40, 160, 40 + LL + LZ * Math.cos(31.04 * Math.PI / 180), 160 - LZ * Math.sin(31.04 * Math.PI / 180))), note(60, 70, 'V_g = 1941∠27.17° V', 'start'), txt(165, 186, '相量相加，不能把大小直接加', 'middle', 11)] },
    { w: 330, h: 207, p: [note(165, 70, '發電機端線電壓 = √3 × 1941', 'middle', 15), note(165, 100, '= 3363 V ≈ 3.36 kV', 'middle', 15), txt(165, 140, '負載才 440 V：線路壓降很大', 'middle', 12)] }] };

  D.h = { spe, delta, star, tri3, mini, tp, F };
  [w121, w128, w1218, w1224, w1231, w1254, w1270, w1245].forEach((w, i) => { D.types[i].wk = w; });
  D.bank = '__CH12PB';
})();
