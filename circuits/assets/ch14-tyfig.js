/* CH14 題型故事：每個例題、每一步的圖（types-story.js 的 wk） */
(function () {
  'use strict';
  const S = window.__SCH, Y = window.__TY, D = window.__TYPES14, K = window.__K13;
  if (!S || !Y || !D) return;
  const { HL, note, ar, txt } = Y;
  const F = (w, h, dx, dy, p) => ({ w, h, p: ['<g transform="translate(' + dx + ',' + dy + ')">'].concat(p, ['</g>']) });
  const hl = (on, x) => on ? HL(x) : x;

  /* ── 題型 1：Problem 14.1 ── */
  const c141 = o => { o = o || {}; return F(360, 175, 40, 10, [S.vs(30, 30, 120, 'v_i'), hl(o.c, S.c(30, 30, 200, 30, o.c ? '1/(jωC)' : 'C')), hl(o.r, S.r(200, 30, 200, 120, 'R', { side: 'l' })), S.w('30,120', '260,120'), S.w('200,30', '260,30'),
    S.term(260, 30), S.term(260, 120), S.t(268, 80, 'v_o', 'start')].concat(o.add || [])); };
  const hp = () => { let d = ''; for (let i = 0; i <= 60; i++) { const x = i / 60, w = Math.pow(10, -2 + 4 * x), m = w / Math.sqrt(1 + w * w); d += (i ? ' L' : 'M') + (40 + 260 * x) + ' ' + (150 - 110 * m); } return d; };
  const w141 = { id: 'p14-1', figs: [null,
    c141({ c: true, r: true, add: [note(150, 160, '分壓：H = R/(R + 1/jωC) = jωRC/(1 + jωRC)', 'middle', 11.5)] }),
    { w: 340, h: 190, p: [S.w('40,150', '310,150'), S.w('40,150', '40,25'), HL('<path d="' + hp() + '" fill="none"/>'), '<path d="M170 150 L170 72 M40 72 L170 72" fill="none" stroke-dasharray="4 3"/>',
      S.t(170, 166, 'ω_0 = 1/RC', 'middle', ' font-size="11"'), S.t(34, 76, '0.707', 'end', ' font-size="10.5"'), S.t(34, 44, '1', 'end', ' font-size="10.5"'), S.t(310, 166, 'ω（對數）', 'end', ' font-size="10.5"'),
      note(190, 186, '|H|：低頻擋掉、高頻通過 → 高通')] }] };

  /* ── 題型 2：Problem 14.6 ── */
  const c146 = o => { o = o || {}; return F(370, 180, 30, 10, [S.is(30, 30, 120, 'I_s'), S.w('30,30', '100,30'), S.r(100, 30, 100, 120, '2 Ω', { side: 'l' }), S.dot(100, 30), S.dot(100, 120),
    hl(o.top, S.l(100, 30, 190, 30, '2H → 2s')), hl(o.par, S.l(190, 30, 190, 120, '2s', { side: 'l' })), S.dot(190, 30), S.dot(190, 120), S.w('190,30', '270,30'), hl(o.par, S.r(270, 30, 270, 120, '2 Ω', { side: 'l' })),
    S.w('30,120', '270,120'), K ? K.iv(285, 50, 80, 'I_o') : ''].concat(o.add || [])); };
  const w146 = { id: 'p14-6', figs: [null,
    c146({ par: true, add: [note(180, 160, '2s ∥ 2 = 2s/(s + 1)')] }),
    c146({ par: true, top: true, add: [note(180, 160, 'Z = 2s + 2s/(s + 1) = 2s(s + 2)/(s + 1)')] }),
    c146({ top: true, par: true, add: [ar(60, 18, 95, 18, 'I_s', 78, 12), ar(110, 18, 150, 18, 'I_b', 130, 12), note(180, 160, '分流：I_b = I_s · 2/(2 + Z)')] }),
    c146({ par: true, add: [ar(198, 18, 240, 18, '', 0, 0), note(180, 160, '再分流：I_o = I_b · 2s/(2s + 2)')] }),
    { w: 330, h: 170, p: [note(165, 70, 'H(s) = I_o/I_s', 'middle', 15), note(165, 105, '= s/(s² + 3s + 1)', 'middle', 17), txt(165, 140, '兩次分流相乘，(s + 1) 約掉', 'middle', 12)] }] };

  /* ── 題型 3：Problem 14.7（分貝） ── */
  const scale = (hi) => { const x = db => 40 + (db + 20) * 1.95; let s = S.w('30,70', '310,70') + S.w('30,140', '310,140') + S.t(20, 74, 'dB', 'end', ' font-size="11"') + S.t(20, 144, '|H|', 'end', ' font-size="11"');
    [-20, 0, 20, 40, 60, 80, 100, 120].forEach(d => { s += S.w(x(d) + ',65', x(d) + ',75') + S.t(x(d), 60, String(d), 'middle', ' font-size="10"') + S.w(x(d) + ',135', x(d) + ',145') + S.t(x(d), 158, '10' + (d / 20 === 0 ? '⁰' : ''), 'middle', ' font-size="10"') + (d / 20 !== 0 ? S.t(x(d) + 9, 152, String(d / 20), 'start', ' font-size="8"') : ''); });
    hi.forEach(h => { s += HL('<path d="M' + x(h[0]) + ' 70 L' + x(h[0]) + ' 140" fill="none" stroke-dasharray="3 3"/>' + '<circle cx="' + x(h[0]) + '" cy="70" r="4" fill="currentColor"/><circle cx="' + x(h[0]) + '" cy="140" r="4" fill="currentColor"/>') +
      note(h[0] > 60 ? 320 : x(h[0]) - 6, h[2] || 35, h[1], h[0] > 60 ? 'end' : 'start', 11.5); });
    return s; };
  const w147 = { id: 'p14-7', figs: [{ w: 330, h: 190, p: [scale([]), note(165, 182, '每 20 dB = 大小 ×10')] },
    { w: 330, h: 190, p: [scale([[0.05, '0.05 dB → 1.006']]), note(165, 182, '|H| = 10 的 (dB/20) 次方：0.05/20 = 0.0025')] },
    { w: 330, h: 190, p: [scale([[-6.2, '−6.2 dB → 0.4898']]), note(165, 182, '負的 dB：變小（約一半）')] },
    { w: 330, h: 190, p: [scale([[104.7, '104.7 dB → 1.718 × 10⁵']]), note(165, 182, '104.7/20 = 5.235 → 10 的 5.235 次方')] }] };

  [w141, w146, w147].forEach((w, i) => { D.types[i].wk = w; });
  D.bank = '__CH14PB';
})();
