/* ============================================================
   電路學 CH12 PART 3（12.7 平衡三相功率、12.8 不平衡系統）
   可互動例題 + 觀念小測驗。互動模組（cv-p3、cv-unb）在 ch12.js。
   預設數字 = 課本 Example 12.6、12.7、12.8、12.9
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  const { C, label, labelCJK, liveExample } = E;
  const RAD = Math.PI / 180, r3 = Math.sqrt(3);
  const n2 = (x, d) => X.num(x, d === undefined ? 2 : d);
  const jx = v => (v < 0 ? '−j' : 'j') + Math.abs(v);
  const kind = q => Math.abs(q) < 1e-9 ? '純電阻' : q > 0 ? '電感性、落後' : '電容性、超前';

  /* 功率三角形 */
  function tri(ctx, w, h, P, Q, x0, wmax, unit) {
    const S = Math.hypot(P, Q), s = Math.max(1e-9, Math.min(wmax / Math.max(P, 1e-9), (h - 44) / Math.max(Math.abs(Q), 1e-9)));
    const ox = x0, oy = Q >= 0 ? h - 22 : 22, px = ox + P * s, py = oy - Q * s;
    ctx.lineCap = 'round';
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, oy); ctx.stroke();
    ctx.strokeStyle = C['q-react']; ctx.beginPath(); ctx.moveTo(px, oy); ctx.lineTo(px, py); ctx.stroke();
    E.arrow(ctx, ox, oy, px, py, C.accent, 2.4);
    label(ctx, (ox + px) / 2, oy + (Q >= 0 ? 13 : -11), 'P = ' + X.g(P, 4) + ' ' + unit[0], C.ink, 11, 'center', '700');
    label(ctx, px + 8, (oy + py) / 2, 'Q = ' + X.g(Q, 4) + ' ' + unit[1], C['q-react'], 11, 'left', '700');
    label(ctx, (ox + px) / 2 - 8, (oy + py) / 2 + (Q >= 0 ? -10 : 12), '|S| = ' + X.g(S, 4) + ' ' + unit[2], C.accent, 11, 'right', '700');
  }

  /* ── 12.7：電源、線路、負載的複功率（課本 Example 12.6） ── */
  liveExample('#ex-p6', {
    title: '例題 · 電源、線路、負載的複功率（課本 Example 12.6）',
    ratio: 0.3, minH: 160, maxH: 210,
    givens: [
      { id: 'x6-v', label: '相電壓 V<sub>p</sub>', min: 50, max: 240, step: 5, value: 110, fmt: v => v + ' V' },
      { id: 'x6-lr', label: '線路 R', min: 0, max: 10, step: 0.5, value: 5, fmt: v => v + ' Ω' },
      { id: 'x6-lx', label: '線路 X', min: -6, max: 6, step: 0.5, value: -2, fmt: v => jx(v) + ' Ω' },
      { id: 'x6-r', label: '負載 R', min: 1, max: 40, step: 1, value: 10, fmt: v => v + ' Ω' },
      { id: 'x6-x', label: '負載 X', min: -30, max: 30, step: 1, value: 8, fmt: v => jx(v) + ' Ω' }
    ],
    compute: g => {
      const V = g['x6-v'], Zl = X.c(g['x6-lr'], g['x6-lx']), ZL = X.c(g['x6-r'], g['x6-x']);
      const I = X.div(X.c(V, 0), X.add(Zl, ZL)), I2 = X.mag(I) ** 2;
      const Ss = X.sc(X.mul(X.c(V, 0), X.conj(I)), -3), SL = X.sc(ZL, 3 * I2), Sl = X.sc(Zl, 3 * I2);
      return { V, Zl, ZL, I, Ss, SL, Sl };
    },
    question: (g, r) => '平衡 Y-Y：V<sub>an</sub> = ' + r.V + '∠0° V，線路每相 ' + X.rect(r.Zl, 1) + ' Ω，負載每相 ' + X.rect(r.ZL, 0) + ' Ω。求電源端與負載端的總平均功率、虛功率與複功率。',
    questionEn: (g, r) => 'For a balanced Y-Y system with V<sub>an</sub> = ' + r.V + '∠0° V, a line impedance of ' + X.rect(r.Zl, 1) + ' Ω and a load of ' + X.rect(r.ZL, 0) + ' Ω per phase, determine the total average power, reactive power, and complex power at the source and at the load.',
    steps: (g, r) => [
      { t: 'Step 1　單相等效求 I<sub>p</sub>。', eq: 'I<sub>p</sub> = ' + r.V + ' ÷ (' + X.rect(X.add(r.Zl, r.ZL), 1) + ') = ' + X.pol(r.I, 4, 2) + ' A' },
      { t: 'Step 2　電源吸收（負號 = 送出）。', eq: 'S<sub>s</sub> = −3V<sub>p</sub>I<sub>p</sub>* = ' + X.rect(r.Ss, 1) + ' VA' },
      { t: 'Step 3　負載吸收。', eq: 'S<sub>L</sub> = 3|I<sub>p</sub>|²Z<sub>L</sub> = ' + X.rect(r.SL, 1) + ' VA' },
      { t: 'Step 4　線路吸收。', eq: 'S<sub>ℓ</sub> = 3|I<sub>p</sub>|²Z<sub>ℓ</sub> = ' + X.rect(r.Sl, 1) + ' VA' },
      { t: '檢查　守恆。', eq: 'S<sub>s</sub> + S<sub>ℓ</sub> + S<sub>L</sub> = ' + X.rect(X.add(X.add(r.Ss, r.Sl), r.SL), 2) + ' ✓',
        after: '線路吃掉 ' + n2(r.Sl.re / Math.max(-r.Ss.re, 1e-9) * 100, 1) + '% 的實功率' + (r.Sl.re / Math.max(-r.Ss.re, 1e-9) > 0.2 ? ' —— 太浪費了，所以輸電要用高壓、小電流。' : '。') }
    ],
    answer: (g, r) => '電源 S<sub>s</sub> = ' + X.rect(r.Ss, 1) + ' VA；負載 S<sub>L</sub> = ' + X.rect(r.SL, 1) + ' VA；線路 ' + X.rect(r.Sl, 1) + ' VA',
    draw: (ctx, w, h, g, r) => {
      const my = h * 0.42, P = [-r.Ss.re, r.Sl.re, r.SL.re], tot = P[0], x0 = 40, x1 = w - 30, k = (x1 - x0) / Math.max(tot, 1e-9);
      labelCJK(ctx, x0, my - 26, '電源送出的實功率 ' + n2(tot, 0) + ' W', C.ink, 12, 'left', '700');
      ctx.fillStyle = C.accent; ctx.fillRect(x0, my - 14, tot * k, 16);
      ctx.fillStyle = C['ink-3']; ctx.fillRect(x0, my + 14, P[1] * k, 16);
      ctx.fillStyle = C.ink; ctx.fillRect(x0 + P[1] * k, my + 14, P[2] * k, 16);
      labelCJK(ctx, x0 + P[1] * k / 2, my + 44, '線路 ' + n2(P[1], 0) + ' W', C['ink-2'], 11, 'center', '700');
      labelCJK(ctx, x0 + (P[1] + P[2] / 2) * k, my + 44, '負載 ' + n2(P[2], 0) + ' W', C.ink, 11, 'center', '700');
    }
  });

  /* ── 12.7：馬達功率因數（課本 Example 12.7） ─────────────── */
  liveExample('#ex-p7', {
    title: '例題 · 三相馬達的功率因數（課本 Example 12.7）',
    ratio: 0.3, minH: 150, maxH: 200,
    givens: [
      { id: 'x7-p', label: '馬達功率 P', min: 1, max: 20, step: 0.1, value: 5.6, fmt: v => v.toFixed(1) + ' kW' },
      { id: 'x7-v', label: '線電壓 V<sub>L</sub>', min: 110, max: 480, step: 10, value: 220, fmt: v => v + ' V' },
      { id: 'x7-i', label: '線電流 I<sub>L</sub>', min: 2, max: 60, step: 0.1, value: 18.2, fmt: v => v.toFixed(1) + ' A' }
    ],
    compute: g => {
      const P = g['x7-p'] * 1000, V = g['x7-v'], I = g['x7-i'], S = r3 * V * I, pf = P / S;
      return { P, V, I, S, pf, Q: pf <= 1 ? Math.sqrt(Math.max(S * S - P * P, 0)) : 0 };
    },
    question: (g, r) => '三相馬達（看成平衡 Y 負載）在線電壓 ' + r.V + ' V、線電流 ' + n2(r.I, 1) + ' A 時吃 ' + n2(r.P / 1000, 1) + ' kW。求功率因數。',
    questionEn: (g, r) => 'A three-phase motor draws ' + n2(r.P / 1000, 1) + ' kW when the line voltage is ' + r.V + ' V and the line current is ' + n2(r.I, 1) + ' A. Determine the power factor of the motor.',
    steps: (g, r) => [
      { t: 'Step 1　視在功率。', eq: 'S = √3 V<sub>L</sub>I<sub>L</sub> = √3 × ' + r.V + ' × ' + n2(r.I, 1) + ' = ' + n2(r.S, 2) + ' VA' },
      { t: 'Step 2　pf = P/S。', eq: 'pf = ' + n2(r.P, 0) + ' / ' + n2(r.S, 2) + ' = ' + n2(r.pf, 4),
        after: r.pf > 1 ? '<b style="color:var(--bad)">pf 大於 1 —— 不可能！代表這組數字矛盾（實功率不能比視在功率大），把電流或電壓調大一點。</b>' : r.pf > 0.95 ? '接近 1：幾乎是純電阻。' : r.pf < 0.7 ? '很低：電力公司會要求做功因校正。' : '馬達是線圈，一般 pf 落在 0.7～0.9。' }
    ],
    answer: (g, r) => 'pf = ' + n2(r.pf, 4) + (r.pf > 1 ? '（數字矛盾）' : '（落後）'),
    draw: (ctx, w, h, g, r) => { if (r.pf <= 1) tri(ctx, w, h, r.P, r.Q, 60, w * 0.55, ['W', 'VAR', 'VA']); else labelCJK(ctx, w / 2, h / 2, 'P > S：不可能', C.bad, 15, 'center', '700'); }
  });

  /* ── 12.7：兩組負載＋功因校正（課本 Example 12.8） ───────── */
  liveExample('#ex-p8', {
    title: '例題 · 兩組負載＋功因校正（課本 Example 12.8）',
    ratio: 0.32, minH: 170, maxH: 220,
    givens: [
      { id: 'x8-p1', label: '負載 1 實功率', min: 5, max: 100, step: 5, value: 30, fmt: v => v + ' kW' },
      { id: 'x8-f1', label: '負載 1 pf（落後）', min: 0.3, max: 1, step: 0.05, value: 0.6, fmt: v => v.toFixed(2) },
      { id: 'x8-q2', label: '負載 2 虛功率', min: 5, max: 100, step: 5, value: 45, fmt: v => v + ' kVAR' },
      { id: 'x8-f2', label: '負載 2 pf（落後）', min: 0.3, max: 0.95, step: 0.05, value: 0.8, fmt: v => v.toFixed(2) },
      { id: 'x8-t', label: '目標 pf', min: 0.7, max: 1, step: 0.01, value: 0.9, fmt: v => v.toFixed(2) }
    ],
    compute: g => {
      const P1 = g['x8-p1'], f1 = g['x8-f1'], Q1 = P1 * Math.tan(Math.acos(f1)), Q2 = g['x8-q2'], f2 = g['x8-f2'];
      const S2 = Q2 / Math.sin(Math.acos(f2)), P2 = S2 * f2, P = P1 + P2, Q = Q1 + Q2, S = Math.hypot(P, Q), pf = P / S;
      const tgt = g['x8-t'], Qc = Math.max(0, P * (Q / P - Math.tan(Math.acos(tgt)))), IL = S * 1000 / (r3 * 240000);
      const C1 = (Qc / 3) * 1000 / (2 * Math.PI * 60 * 240000 ** 2);
      return { P1, f1, Q1, Q2, f2, S2, P2, P, Q, S, pf, tgt, Qc, IL, C1, already: pf >= tgt - 1e-9 };
    },
    question: (g, r) => '兩組平衡負載接在 240 kV rms、60 Hz 線上。負載 1：' + r.P1 + ' kW、pf ' + r.f1.toFixed(2) + ' 落後；負載 2：' + r.Q2 + ' kVAR、pf ' + r.f2.toFixed(2) + ' 落後。求 (a) 合併負載的 S、P、Q (b) 線電流 (c) 把 pf 拉到 ' + r.tgt.toFixed(2) + ' 落後，Δ 接三顆電容各需多少 kVAR 與電容值。',
    questionEn: (g, r) => 'Two balanced loads are connected to a 240-kV rms 60-Hz line. Load 1 draws ' + r.P1 + ' kW at a power factor of ' + r.f1.toFixed(2) + ' lagging, while load 2 draws ' + r.Q2 + ' kVAR at a power factor of ' + r.f2.toFixed(2) + ' lagging. Determine (a) the complex, real, and reactive powers of the combined load, (b) the line current, and (c) the kVAR rating and capacitance of each of three Δ-connected capacitors that raise the pf to ' + r.tgt.toFixed(2) + ' lagging.',
    steps: (g, r) => [
      { t: 'Step 1　負載 1 化成 (P, Q)。', eq: 'Q<sub>1</sub> = P<sub>1</sub> tan(cos<sup>−1</sup>' + r.f1.toFixed(2) + ') = ' + n2(r.Q1, 2) + ' kVAR → S<sub>1</sub> = ' + r.P1 + ' + j' + n2(r.Q1, 2) + ' kVA' },
      { t: 'Step 2　負載 2：給 Q 和 pf → 先求 |S<sub>2</sub>|。', eq: '|S<sub>2</sub>| = Q<sub>2</sub>/sin θ<sub>2</sub> = ' + n2(r.S2, 2) + ' kVA，P<sub>2</sub> = ' + n2(r.P2, 2) + ' kW' },
      { t: 'Step 3　相加。', eq: 'S = ' + n2(r.P, 2) + ' + j' + n2(r.Q, 2) + ' kVA = ' + n2(r.S, 2) + '∠' + n2(Math.atan2(r.Q, r.P) / RAD, 2) + '° kVA，pf = ' + n2(r.pf, 3), after: '不是兩個 pf 的平均（' + n2((r.f1 + r.f2) / 2, 3) + '）。' },
      { t: 'Step 4　線電流。', eq: 'I<sub>L</sub> = |S|/(√3 × 240 kV) = ' + n2(r.IL * 1000, 2) + ' mA' },
      { t: 'Step 5　功因校正。', eq: r.already ? '現在的 pf ' + n2(r.pf, 3) + ' 已經 ≥ 目標，不用補電容。' : 'Q<sub>C</sub> = P(tan θ<sub>old</sub> − tan θ<sub>new</sub>) = ' + n2(r.Qc, 2) + ' kVAR → 每顆 ' + n2(r.Qc / 3, 2) + ' kVAR',
        after: r.already ? '' : 'Δ 接：每顆兩端是線電壓 240 kV → C = Q′<sub>C</sub>/(ωV<sub>L</sub>²) = ' + n2(r.C1 * 1e12, 1) + ' pF' + (r.tgt > 0.995 ? '（目標 pf = 1：Q 全部抵掉）' : '') }
    ],
    answer: (g, r) => '(a) S = ' + n2(r.P, 1) + ' + j' + n2(r.Q, 1) + ' kVA　(b) I<sub>L</sub> = ' + n2(r.IL * 1000, 1) + ' mA　(c) ' + (r.already ? '不用補' : '每顆 ' + n2(r.Qc / 3, 2) + ' kVAR，C = ' + n2(r.C1 * 1e12, 1) + ' pF'),
    draw: (ctx, w, h, g, r) => {
      tri(ctx, w, h, r.P, r.Q, 60, w * 0.5, ['kW', 'kVAR', 'kVA']);
      if (!r.already) {
        const s = Math.min(w * 0.5 / r.P, (h - 44) / r.Q), px = 60 + r.P * s, ny = h - 22 - (r.Q - r.Qc) * s;
        ctx.setLineDash([4, 4]); E.arrow(ctx, 60, h - 22, px, ny, C.ok, 2); ctx.setLineDash([]);
        labelCJK(ctx, (60 + px) / 2 + 10, (h - 22 + ny) / 2 + 14, '補電容後 pf ' + r.tgt.toFixed(2), C.ok, 11, 'left', '700');
      }
    }
  });

  /* ── 12.8：不平衡 Y 負載（課本 Example 12.9） ────────────── */
  liveExample('#ex-unb', {
    title: '例題 · 不平衡 Y 負載的中性線電流（課本 Example 12.9）',
    ratio: 0.42, minH: 200, maxH: 260,
    givens: [
      { id: 'x9-v', label: '相電壓', min: 50, max: 240, step: 10, value: 100, fmt: v => v + ' V' },
      { id: 'x9-s', label: '相序（0 = abc、1 = acb）', min: 0, max: 1, step: 1, value: 1, fmt: v => v ? 'acb' : 'abc' },
      { id: 'x9-a', label: 'Z<sub>A</sub> 電阻', min: 1, max: 30, step: 1, value: 15, fmt: v => v + ' Ω' },
      { id: 'x9-bx', label: 'Z<sub>B</sub> = 10 + jX，X', min: -20, max: 20, step: 1, value: 5, fmt: v => jx(v) + ' Ω' },
      { id: 'x9-cx', label: 'Z<sub>C</sub> = 6 + jX，X', min: -20, max: 20, step: 1, value: -8, fmt: v => jx(v) + ' Ω' }
    ],
    compute: g => {
      const V = g['x9-v'], acb = g['x9-s'] === 1, off = acb ? [0, 120, -120] : [0, -120, 120];
      const Z = [X.c(g['x9-a'], 0), X.c(10, g['x9-bx']), X.c(6, g['x9-cx'])];
      const I = Z.map((z, i) => X.div(X.p(V, off[i]), z)), In = X.neg(I.reduce((s, x) => X.add(s, x), X.c(0, 0)));
      const P = I.reduce((s, x, i) => s + X.mag(x) ** 2 * Z[i].re, 0);
      return { V, acb, off, Z, I, In, P };
    },
    question: (g, r) => '不平衡 Y 負載（四線式），電源平衡 ' + r.V + ' V、' + (r.acb ? 'acb' : 'abc') + ' 相序。Z<sub>A</sub> = ' + X.rect(r.Z[0], 0) + ' Ω、Z<sub>B</sub> = ' + X.rect(r.Z[1], 0) + ' Ω、Z<sub>C</sub> = ' + X.rect(r.Z[2], 0) + ' Ω。求線電流與中性線電流。',
    questionEn: (g, r) => 'The unbalanced Y-load has balanced voltages of ' + r.V + ' V and the ' + (r.acb ? 'acb' : 'abc') + ' sequence. Calculate the line currents and the neutral current. Take Z<sub>A</sub> = ' + X.rect(r.Z[0], 0) + ' Ω, Z<sub>B</sub> = ' + X.rect(r.Z[1], 0) + ' Ω, Z<sub>C</sub> = ' + X.rect(r.Z[2], 0) + ' Ω.',
    steps: (g, r) => [
      { t: 'Step 1　' + (r.acb ? 'acb：V<sub>BN</sub> 在 +120°、V<sub>CN</sub> 在 −120°。' : 'abc：V<sub>BN</sub> 在 −120°、V<sub>CN</sub> 在 +120°。'), eq: 'V<sub>AN</sub> = ' + r.V + '∠0°、V<sub>BN</sub> = ' + r.V + '∠' + r.off[1] + '°、V<sub>CN</sub> = ' + r.V + '∠' + r.off[2] + '° V' },
      { t: 'Step 2　有中性線 → 每相各用歐姆定律。', eq: ['a', 'b', 'c'].map((n, i) => 'I<sub>' + n + '</sub> = ' + X.pol(r.I[i], 3, 2) + ' A').join('，') },
      { t: 'Step 3　中性線：節點 N 的 KCL。', eq: 'I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>) = ' + X.rect(r.In, 2) + ' = ' + X.pol(r.In, 4, 1) + ' A',
        after: X.mag(r.In) < 0.01 ? '剛好平衡：中性線沒有電流。' : '中性線電流是最大線電流的 ' + n2(X.mag(r.In) / Math.max(...r.I.map(X.mag)) * 100, 0) + '%。不平衡越嚴重，中性線上的電流越大。' },
      { t: '補充　總實功率（只有電阻吃）。', eq: 'P = Σ|I|²R = ' + n2(r.P, 0) + ' W', after: '不平衡：不能「一相乘 3」。' }
    ],
    answer: (g, r) => 'I<sub>a</sub> = ' + X.pol(r.I[0], 3, 2) + '、I<sub>b</sub> = ' + X.pol(r.I[1], 3, 2) + '、I<sub>c</sub> = ' + X.pol(r.I[2], 3, 2) + ' A；I<sub>n</sub> = ' + X.pol(r.In, 4, 1) + ' A',
    draw: (ctx, w, h, g, r) => {
      const col = [C.accent, C['q-react'], C.ink], cx = w * 0.34, cy = h / 2, R = Math.max(10, Math.min(h / 2 - 18, w * 0.28));
      const big = Math.max(...r.I.map(X.mag), X.mag(r.In), 1e-9), k = R / big;
      E.axes12(ctx, cx, cy, R + 8);
      r.I.forEach((x, i) => E.vec12(ctx, cx, cy, X.mag(x) * k, X.ang(x), col[i], 'I<sub>' + 'abc'[i] + '</sub>', 2.2));
      if (X.mag(r.In) * k > 3) E.vec12(ctx, cx, cy, X.mag(r.In) * k, X.ang(r.In), C.bad, 'I<sub>n</sub>', 3);
      labelCJK(ctx, w * 0.66, h * 0.4, '|I<sub>n</sub>| = ' + n2(X.mag(r.In), 2) + ' A', C.bad, 14, 'left', '700');
      labelCJK(ctx, w * 0.66, h * 0.4 + 24, '紅色 = 從中性線流回去的', C['ink-3'], 11, 'left');
    }
  });

  window.__ch12Quiz([
    { zh: '平衡三相系統的總瞬時功率？', en: 'The total instantaneous power in a balanced three-phase system is:',
      o: [['常數，等於平均功率', 'constant and equal to the average power'], ['以 2ω 起伏', 'pulsating at 2ω'], ['每週期變號', 'changing sign each cycle'], ['零', 'zero']], a: 0,
      e: 'p = 3V<sub>p</sub>I<sub>p</sub>cos θ，跟時間無關（課本 Summary 5）。' },
    { zh: '平衡三相負載的總平均功率（用線值）？', en: 'The total average power of a balanced load in terms of line quantities is:',
      o: [['√3 V<sub>L</sub>I<sub>L</sub>cos θ', '√3 V<sub>L</sub>I<sub>L</sub>cos θ'], ['3V<sub>L</sub>I<sub>L</sub>cos θ', '3V<sub>L</sub>I<sub>L</sub>cos θ'], ['V<sub>L</sub>I<sub>L</sub>cos θ', 'V<sub>L</sub>I<sub>L</sub>cos θ'], ['√3 V<sub>L</sub>I<sub>L</sub>', '√3 V<sub>L</sub>I<sub>L</sub>']], a: 0,
      e: '3V<sub>p</sub>I<sub>p</sub>cos θ 換成線值，Y、Δ 都是 √3 V<sub>L</sub>I<sub>L</sub>cos θ。' },
    { zh: '公式 P = √3V<sub>L</sub>I<sub>L</sub>cos θ 裡的 θ 是？', en: 'In P = √3V<sub>L</sub>I<sub>L</sub>cos θ, θ is:',
      o: [['負載阻抗角', 'the load impedance angle'], ['線電壓與線電流的夾角', 'the angle between line voltage and line current'], ['30°', '30°'], ['120°', '120°']], a: 0,
      e: '是相電壓與相電流的夾角（= 阻抗角）。線電壓與線電流差的是 θ ± 30°。' },
    { zh: '同樣功率、線電壓與損失，三相需要的導線材料約是單相的？', en: 'For the same power, line voltage and loss, a three-phase system needs about what fraction of the single-phase material?',
      o: [['75%', '75%'], ['133%', '133%'], ['50%', '50%'], ['100%', '100%']], a: 0,
      e: '單相 / 三相 = 1.333 → 三相只要 75%。' },
    { zh: '三相馬達 5.6 kW、V<sub>L</sub> = 220 V、I<sub>L</sub> = 18.2 A，pf ≈？', en: 'A motor draws 5.6 kW at V<sub>L</sub> = 220 V and I<sub>L</sub> = 18.2 A. The pf is about:',
      o: [['0.8075', '0.8075'], ['0.466', '0.466'], ['1.40', '1.40'], ['0.269', '0.269']], a: 0,
      e: 'S = √3 × 220 × 18.2 = 6935 VA，pf = 5600/6935。忘了 √3 會得 1.40（> 1，不可能）。' },
    { zh: '電源端吸收的複功率寫成 S<sub>s</sub> = −3V<sub>p</sub>I<sub>p</sub>*，負號代表？', en: 'The minus sign in S<sub>s</sub> = −3V<sub>p</sub>I<sub>p</sub>* means:',
      o: [['電源其實在送出功率', 'the source is delivering power'], ['功因超前', 'leading pf'], ['電源壞了', 'the source is faulty'], ['相序是 acb', 'acb sequence']], a: 0,
      e: '被動符號規則下吸收是負的 = 實際上在送出。' },
    { zh: '兩組負載 pf 0.6 與 0.8（都落後），合併後的 pf？', en: 'Two loads with pf 0.6 and 0.8 lagging are combined. The combined pf:',
      o: [['要先把 P、Q 分別相加才能算', 'must be computed from summed P and Q'], ['0.7', '0.7'], ['0.48', '0.48'], ['1.4', '1.4']], a: 0,
      e: 'Example 12.8：P = 90、Q = 85 → pf = 0.727，不是平均。' },
    { zh: '有中性線的不平衡 Y 負載，中性線電流？', en: 'For an unbalanced Y load with a neutral, the neutral current is:',
      o: [['−(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>)，一般不為 0', '−(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>), generally nonzero'], ['永遠為 0', 'always zero'], ['等於 I<sub>a</sub>', 'equal to I<sub>a</sub>'], ['3I<sub>a</sub>', '3I<sub>a</sub>']], a: 0,
      e: '節點 N 的 KCL（式 12.60）。' },
    { zh: '沒有中性線的不平衡系統要怎麼解？', en: 'How is an unbalanced system without a neutral solved?',
      o: [['網目或節點分析', 'mesh or nodal analysis'], ['單相等效', 'the per-phase method'], ['一相乘 3', 'one phase times three'], ['無解', 'it cannot be solved']], a: 0,
      e: 'N 點浮動，各相不能單獨用歐姆定律（課本 Summary 7）。' },
    { zh: '不平衡系統的總功率怎麼算？', en: 'The total power in an unbalanced system is:',
      o: [['三相分別算再相加', 'the sum of the three phase powers'], ['一相乘 3', 'three times one phase'], ['√3V<sub>L</sub>I<sub>L</sub>cos θ', '√3V<sub>L</sub>I<sub>L</sub>cos θ'], ['0', 'zero']], a: 0,
      e: '每相的 I、θ 都不同（課本 p.524）。' }
  ], ['功率和不平衡都穩了，去 PART 4 看怎麼量三相功率。',
      '公式會用了，回去拉一下 Example 12.8 的目標 pf 看三角形怎麼變。',
      '先回故事模式看「三個起伏加起來變水平線」那段，再做一次。']);
})();
