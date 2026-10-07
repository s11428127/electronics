/* ============================================================
   電路學 CH11 PART 3（11.6 複功率、11.7 守恆、11.8 功因校正、11.9 應用）
   可互動例題 + 觀念小測驗。互動模組（cv-tri、cv-cons、cv-pfc、電費）在 ch11.js。
   預設數字 = 課本 Example 11.11、11.12、11.14、11.15、11.16、11.18
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, arrow, clamp, lerp, liveExample } = E;
  const RAD = Math.PI / 180;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '−');
  const ang = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°';
  const angF = (v, n) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n === undefined ? 2 : n) + '°';
  const cpx = (re, im, n) => fix(re, n) + (im < 0 ? ' − j' : ' + j') + fix(Math.abs(im), n);
  const kind = q => Math.abs(q) < 1e-9 ? '純電阻（unity）' : q > 0 ? '電感性、落後（lagging）' : '電容性、超前（leading）';
  const money = x => '$' + x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* 小功率三角形：P 橫、Q 直（正往上、負往下） */
  function triangle(ctx, w, h, P, Q, unit) {
    const S = Math.hypot(P, Q), s = Math.max(0.0001, Math.min((w - 250) / Math.max(Math.abs(P), 1e-9), (h - 40) / Math.max(Math.abs(Q), 1e-9), (h - 40) / Math.max(S, 1e-9) * 1.6));
    const ox = 110, oy = Q >= 0 ? h - 22 : 22, px = ox + P * s, py = oy - Q * s;
    ctx.lineCap = 'round';
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, oy); ctx.stroke();
    ctx.strokeStyle = C['q-react']; ctx.beginPath(); ctx.moveTo(px, oy); ctx.lineTo(px, py); ctx.stroke();
    arrow(ctx, ox, oy, px, py, C.accent, 2.4);
    label(ctx, (ox + px) / 2, oy + (Q >= 0 ? 13 : -11), 'P = ' + fix(P, 2) + ' W', C.ink, 11, 'center', '700');
    label(ctx, px + 8, (oy + py) / 2, 'Q = ' + fix(Q, 2) + ' ' + (unit || 'VAR'), C['q-react'], 11, 'left', '700');
    label(ctx, (ox + px) / 2 - 8, (oy + py) / 2 + (Q >= 0 ? -10 : 12), '|S| = ' + fix(S, 2), C.accent, 11, 'right', '700');
  }

  /* ── 例題 1（課本 Example 11.11）：由 v(t)、i(t) 求 S、P、Q、pf、Z ───── */
  liveExample('#ex-S', {
    title: '例題 · S、P、Q、pf、Z 一次求（課本 Example 11.11）',
    ratio: 0.3, minH: 150, maxH: 190,
    givens: [
      { id: 'xS-vm', label: '電壓振幅 Vm', min: 10, max: 200, step: 5, value: 60, fmt: v => v + ' V' },
      { id: 'xS-im', label: '電流振幅 Im', min: 0.1, max: 5, step: 0.1, value: 1.5, fmt: v => v.toFixed(1) + ' A' },
      { id: 'xS-tv', label: '電壓相角 θv', min: -90, max: 90, step: 5, value: -10, fmt: ang },
      { id: 'xS-ti', label: '電流相角 θi', min: -90, max: 90, step: 5, value: 50, fmt: ang }
    ],
    compute: g => {
      const Vm = g['xS-vm'], Im = g['xS-im'], tv = g['xS-tv'], ti = g['xS-ti'], d = tv - ti;
      const Sm = Vm * Im / 2, P = Sm * Math.cos(d * RAD), Q = Sm * Math.sin(d * RAD), Zm = Vm / Im;
      return { Vm, Im, tv, ti, d, Sm, P, Q, Zm };
    },
    question: (g, r) => '負載電壓 <b>v(t) = ' + r.Vm + ' cos(ωt ' + (r.tv < 0 ? '− ' : '+ ') + Math.abs(r.tv) + '°) V</b>，流過的電流 <b>i(t) = ' + r.Im.toFixed(1) +
      ' cos(ωt ' + (r.ti < 0 ? '− ' : '+ ') + Math.abs(r.ti) + '°) A</b>。求 (a) 複功率與視在功率 (b) 實功率與虛功率 (c) 功率因數與負載阻抗。',
    questionEn: (g, r) => 'The voltage across a load is <b>v(t) = ' + r.Vm + ' cos(ωt ' + (r.tv < 0 ? '− ' : '+ ') + Math.abs(r.tv) + '°) V</b> and the current through it is <b>i(t) = ' + r.Im.toFixed(1) + ' cos(ωt ' + (r.ti < 0 ? '− ' : '+ ') + Math.abs(r.ti) + '°) A</b>. Find (a) the complex and apparent powers, (b) the real and reactive powers, and (c) the power factor and the load impedance.',
    steps: (g, r) => [
      { t: 'Step 1　換成 rms 相量。', eq: 'V<sub>rms</sub> = (' + r.Vm + '/√2)∠' + angF(r.tv, 0) + '　I<sub>rms</sub> = (' + r.Im.toFixed(1) + '/√2)∠' + angF(r.ti, 0) },
      { t: 'Step 2　S = V<sub>rms</sub>I<sub>rms</sub>*：電流角度變號再相乘。', note: '(V<sub>m</sub>/√2)(I<sub>m</sub>/√2) = ½V<sub>m</sub>I<sub>m</sub>：',
        eq: 'S = ' + fix(r.Sm, 2) + '∠(' + angF(r.tv, 0) + ' − (' + angF(r.ti, 0) + ')) = ' + fix(r.Sm, 2) + '∠' + angF(r.d, 0) + ' VA　→　|S| = ' + fix(r.Sm, 2) + ' VA' },
      { t: 'Step 3　化成直角座標 → P、Q。', eq: 'S = ' + fix(r.Sm, 2) + 'cos(' + angF(r.d, 0) + ') + j' + fix(r.Sm, 2) + 'sin(' + angF(r.d, 0) + ') = ' + cpx(r.P, r.Q, 2) + ' VA',
        after: 'P = ' + fix(r.P, 2) + ' W，Q = ' + fix(r.Q, 2) + ' VAR → <b>' + kind(r.Q) + '</b>' + (r.P < 0 ? '　<b style="color:var(--bad)">（P &lt; 0：這一端其實在送出功率）</b>' : '') },
      { t: 'Step 4　功率因數。', eq: 'pf = cos(' + angF(r.d, 0) + ') = ' + fix(Math.cos(r.d * RAD), 4) },
      { t: 'Step 5　負載阻抗 Z = V/I。', eq: 'Z = ' + r.Vm + '∠' + angF(r.tv, 0) + ' ÷ ' + r.Im.toFixed(1) + '∠' + angF(r.ti, 0) + ' = ' + fix(r.Zm, 2) + '∠' + angF(r.d, 0) + ' Ω',
        after: 'Z 的角度 = S 的角度 = θ<sub>v</sub> − θ<sub>i</sub>：功率三角形和阻抗三角形同一個形狀。' }
    ],
    answer: (g, r) => '(a) S = ' + fix(r.Sm, 2) + '∠' + angF(r.d, 0) + ' VA，|S| = ' + fix(r.Sm, 2) + ' VA　(b) P = ' + fix(r.P, 2) + ' W，Q = ' + fix(r.Q, 2) + ' VAR　(c) pf = ' +
      fix(Math.abs(Math.cos(r.d * RAD)), 3) + (Math.abs(r.Q) < 1e-9 ? '' : r.Q > 0 ? ' lagging' : ' leading') + '，Z = ' + fix(r.Zm, 2) + '∠' + angF(r.d, 0) + ' Ω',
    draw: (ctx, w, h, g, r) => triangle(ctx, w, h, r.P, r.Q)
  });

  /* ── 例題 2（課本 Example 11.12）：由 kVA 與 pf 反推 P、Q、電流、阻抗 ── */
  liveExample('#ex-kva', {
    title: '例題 · 由 kVA 與 pf 反推（課本 Example 11.12）',
    givens: [
      { id: 'xk-s', label: '視在功率 |S|', min: 1, max: 50, step: 0.5, value: 12, fmt: v => v + ' kVA' },
      { id: 'xk-pf', label: '功率因數', min: 0.3, max: 1, step: 0.001, value: 0.856, fmt: v => v.toFixed(3) },
      { id: 'xk-t', label: '落後／超前', min: 0, max: 1, step: 1, value: 0, fmt: v => v ? '超前 leading（電容性）' : '落後 lagging（電感性）' },
      { id: 'xk-v', label: '電源 Vrms', min: 100, max: 480, step: 10, value: 120, fmt: v => v + ' V' }
    ],
    compute: g => {
      const S = g['xk-s'] * 1000, pf = g['xk-pf'], sg = g['xk-t'] ? -1 : 1, V = g['xk-v'];
      const th = sg * Math.acos(pf) / RAD, P = S * pf, Q = S * Math.sin(th * RAD), I = S / V;
      return { S, pf, sg, V, th, P, Q, I, Im: I * Math.SQRT2, Zm: V / I };
    },
    question: (g, r) => '負載 Z 從 <b>' + r.V + ' V（rms）</b>電源吸取 <b>' + fix(r.S / 1000, 1) + ' kVA</b>，功率因數 <b>' + r.pf.toFixed(3) + (r.sg > 0 ? ' 落後' : ' 超前') +
      '</b>。求 (a) 平均功率與虛功率 (b) 峰值電流 (c) 負載阻抗。',
    questionEn: (g, r) => 'A load Z draws <b>' + fix(r.S / 1000, 1) + ' kVA</b> at a power factor of <b>' + r.pf.toFixed(3) + (r.sg > 0 ? ' lagging' : ' leading') + '</b> from a <b>' + r.V + '-V rms</b> sinusoidal source. Calculate (a) the average and reactive powers delivered to the load, (b) the peak current, and (c) the load impedance.',
    steps: (g, r) => [
      { t: 'Step 1　功率角（' + (r.sg > 0 ? '落後取正' : '超前取負') + '）。', eq: 'θ = ' + (r.sg > 0 ? '' : '−') + 'cos⁻¹ ' + r.pf.toFixed(3) + ' = ' + angF(r.th) },
      { t: 'Step 2　P 與 Q。', eq: 'P = |S| cos θ = ' + fix(r.S, 0) + ' × ' + r.pf.toFixed(3) + ' = ' + fix(r.P / 1000, 3) + ' kW　Q = |S| sin θ = ' + fix(r.Q / 1000, 3) + ' kVAR',
        after: r.pf > 0.999 ? '<b style="color:var(--ok)">pf = 1：Q = 0，全部都是實功率。</b>' : (r.sg > 0 ? 'Q &gt; 0：電感性。' : 'Q &lt; 0：電容性。') + '注意 Q 的單位是 <b>kVAR</b>（課本這裡誤寫成 kVA）。' },
      { t: 'Step 3　由 S = VI* 反推電流。', note: '先拿到的是 I 的<b>共軛</b>：', eq: 'I* = S/V = ' + fix(r.S, 0) + '∠' + angF(r.th) + ' ÷ ' + r.V + ' = ' + fix(r.I, 2) + '∠' + angF(r.th) + ' A　⟹　I = ' + fix(r.I, 2) + '∠' + angF(-r.th) + ' A' },
      { t: 'Step 4　峰值電流。', eq: 'I<sub>m</sub> = √2 × ' + fix(r.I, 2) + ' = ' + fix(r.Im, 1) + ' A' },
      { t: 'Step 5　阻抗。', eq: 'Z = ' + r.V + '∠0° ÷ ' + fix(r.I, 2) + '∠' + angF(-r.th) + ' = ' + fix(r.Zm, 3) + '∠' + angF(r.th) + ' Ω' }
    ],
    answer: (g, r) => '(a) P = ' + fix(r.P / 1000, 3) + ' kW，Q = ' + fix(r.Q / 1000, 3) + ' kVAR　(b) I<sub>m</sub> = ' + fix(r.Im, 1) + ' A　(c) Z = ' + fix(r.Zm, 3) + '∠' + angF(r.th) + ' Ω'
  });

  /* ── 例題 3（課本 Example 11.14）：兩個並聯負載的總功率 ────────────── */
  liveExample('#ex-cons', {
    title: '例題 · 並聯負載的總功率（課本 Example 11.14）',
    ratio: 0.34, minH: 170, maxH: 220,
    givens: [
      { id: 'xc-z1', label: '|Z₁|', min: 10, max: 120, step: 5, value: 60, fmt: v => v + ' Ω' },
      { id: 'xc-a1', label: 'Z₁ 角度', min: -90, max: 90, step: 5, value: -30, fmt: ang },
      { id: 'xc-z2', label: '|Z₂|', min: 10, max: 120, step: 5, value: 40, fmt: v => v + ' Ω' },
      { id: 'xc-a2', label: 'Z₂ 角度', min: -90, max: 90, step: 5, value: 45, fmt: ang },
      { id: 'xc-v', label: '電源 Vrms', min: 60, max: 240, step: 10, value: 120, fmt: v => v + ' V' }
    ],
    compute: g => {
      const V = g['xc-v'], L = [[g['xc-z1'], g['xc-a1']], [g['xc-z2'], g['xc-a2']]].map(([z, a]) => {
        const m = V * V / z; return { z, a, m, P: m * Math.cos(a * RAD), Q: m * Math.sin(a * RAD) };
      });
      const P = L[0].P + L[1].P, Q = L[0].Q + L[1].Q, S = Math.hypot(P, Q);
      return { V, L, P, Q, S, pf: P / S, wrong: L[0].m + L[1].m };
    },
    question: (g, r) => '兩個負載並聯在 <b>' + r.V + ' V（rms）</b>電源上：<b>Z₁ = ' + r.L[0].z + '∠' + angF(r.L[0].a, 0) + ' Ω</b>、<b>Z₂ = ' + r.L[1].z + '∠' + angF(r.L[1].a, 0) +
      ' Ω</b>。求電源供給的 (a) 視在功率 (b) 實功率 (c) 虛功率 (d) 功率因數。',
    questionEn: (g, r) => 'Two loads are connected in parallel across a <b>' + r.V + '-V (rms)</b> source: <b>Z<sub>1</sub> = ' + r.L[0].z + '∠' + angF(r.L[0].a, 0) + ' Ω</b> and <b>Z<sub>2</sub> = ' + r.L[1].z + '∠' + angF(r.L[1].a, 0) + ' Ω</b>. Calculate the total (a) apparent power, (b) real power, (c) reactive power, and (d) power factor supplied by the source.',
    steps: (g, r) => [
      { t: 'Step 1　Z₁ 的複功率。', note: '並聯兩端都是 V，用 S = V<sup>2</sup>/Z* 最快：',
        eq: 'S₁ = ' + r.V + '² ÷ ' + r.L[0].z + '∠' + angF(-r.L[0].a, 0) + ' = ' + fix(r.L[0].m, 1) + '∠' + angF(r.L[0].a, 0) + ' = ' + cpx(r.L[0].P, r.L[0].Q, 2) + ' VA' },
      { t: 'Step 2　Z₂ 的複功率。', eq: 'S₂ = ' + r.V + '² ÷ ' + r.L[1].z + '∠' + angF(-r.L[1].a, 0) + ' = ' + fix(r.L[1].m, 1) + '∠' + angF(r.L[1].a, 0) + ' = ' + cpx(r.L[1].P, r.L[1].Q, 2) + ' VA' },
      { t: 'Step 3　P 加 P、Q 加 Q。', eq: 'S = S₁ + S₂ = ' + cpx(r.P, r.Q, 2) + ' VA' },
      { t: 'Step 4　最後才取大小。', eq: '|S| = √(' + fix(r.P, 1) + '² + ' + fix(r.Q, 1) + '²) = ' + fix(r.S, 1) + ' VA　pf = ' + fix(r.P, 1) + ' ÷ ' + fix(r.S, 1) + ' = ' + fix(r.pf, 3),
        after: '總 Q ' + (Math.abs(r.Q) < 1e-6 ? '= 0 → 單位功因。' : r.Q > 0 ? '&gt; 0 → <b>落後</b>。' : '&lt; 0 → <b>超前</b>。') },
      { t: 'Step 5　如果直接把大小相加？', eq: '|S₁| + |S₂| = ' + fix(r.L[0].m, 1) + ' + ' + fix(r.L[1].m, 1) + ' = ' + fix(r.wrong, 1) + ' VA　✗',
        after: Math.abs(r.L[0].a - r.L[1].a) < 0.01 ? '兩個負載角度一樣，向量同方向，這時候剛好相等。'
          : '<b style="color:var(--bad)">多算了 ' + fix(r.wrong - r.S, 1) + ' VA</b> —— 角度不同的向量，長度不能直接相加。' }
    ],
    answer: (g, r) => '(a) ' + fix(r.S, 1) + ' VA　(b) ' + fix(r.P, 1) + ' W　(c) ' + fix(r.Q, 1) + ' VAR　(d) pf = ' + fix(r.pf, 3) + (Math.abs(r.Q) < 1e-6 ? '' : r.Q > 0 ? ' lagging' : ' leading'),
    /* 兩個 S 向量頭接尾 */
    draw: (ctx, w, h, g, r) => {
      const xs = [0, r.L[0].P, r.P], ys = [0, r.L[0].Q, r.Q];
      const minY = Math.min(...ys), maxY = Math.max(...ys), maxX = Math.max(...xs, 1), minX = Math.min(...xs, 0);
      const s = Math.min((w - 170) / (maxX - minX || 1), (h - 40) / (maxY - minY || 1));
      const ox = 40 - minX * s, oy = 20 + maxY * s, X = p => ox + p * s, Y = q => oy - q * s;
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(w - 10, oy); ctx.stroke();
      arrow(ctx, X(0), Y(0), X(r.L[0].P), Y(r.L[0].Q), C['ink-2'], 2);
      arrow(ctx, X(r.L[0].P), Y(r.L[0].Q), X(r.P), Y(r.Q), C['q-react'], 2);
      arrow(ctx, X(0), Y(0), X(r.P), Y(r.Q), C.accent, 2.8);
      label(ctx, (X(0) + X(r.L[0].P)) / 2 - 6, (Y(0) + Y(r.L[0].Q)) / 2 - 8, 'S₁', C['ink-2'], 12, 'right', '700');
      label(ctx, (X(r.L[0].P) + X(r.P)) / 2 + 6, (Y(r.L[0].Q) + Y(r.Q)) / 2 - 8, 'S₂', C['q-react'], 12, 'left', '700');
      label(ctx, Math.min(X(r.P) + 8, w - 120), Y(r.Q) + (r.Q > r.L[0].Q ? -10 : 12), 'S = ' + fix(r.S, 0) + ' VA', C.accent, 12, 'left', '700');
      labelCJK(ctx, w - 10, h - 8, '|S₁| + |S₂| = ' + fix(r.wrong, 0) + '（錯）', C.bad, 11, 'right', '600');
    }
  });

  /* ── 例題 4（課本 Example 11.15）：並聯電容把 pf 拉高 ────────────────── */
  liveExample('#ex-pfc', {
    title: '例題 · 並聯電容把 pf 從 0.8 拉到 0.95（課本 Example 11.15）',
    ratio: 0.34, minH: 170, maxH: 220,
    givens: [
      { id: 'xf-p', label: '負載 P', min: 0.5, max: 20, step: 0.5, value: 4, fmt: v => v + ' kW' },
      { id: 'xf-pf1', label: '校正前 pf₁（落後）', min: 0.5, max: 0.99, step: 0.01, value: 0.8, fmt: v => v.toFixed(2) },
      { id: 'xf-pf2', label: '目標 pf₂（落後）', min: 0.5, max: 1, step: 0.01, value: 0.95, fmt: v => v.toFixed(2) },
      { id: 'xf-v', label: '電源 Vrms（60 Hz）', min: 100, max: 480, step: 10, value: 120, fmt: v => v + ' V' }
    ],
    compute: g => {
      const P = g['xf-p'] * 1000, pf1 = g['xf-pf1'], pf2 = g['xf-pf2'], V = g['xf-v'], w = 2 * Math.PI * 60;
      const t1 = Math.acos(pf1) / RAD, t2 = Math.acos(Math.min(pf2, 1)) / RAD;
      const Q1 = P * Math.tan(t1 * RAD), Q2 = P * Math.tan(t2 * RAD), QC = Q1 - Q2, Cf = QC / (w * V * V);
      const S1 = P / pf1, S2 = P / pf2, I1 = S1 / V, I2 = S2 / V;
      return { P, pf1, pf2, V, w, t1, t2, Q1, Q2, QC, Cf, S1, S2, I1, I2, ok: pf2 > pf1 };
    },
    question: (g, r) => '負載接在 <b>' + r.V + ' V（rms）、60 Hz</b> 電源上，吸收 <b>' + fix(r.P / 1000, 1) + ' kW</b>，功率因數 <b>' + r.pf1.toFixed(2) + ' 落後</b>。求要把 pf 提高到 <b>' + r.pf2.toFixed(2) + '</b> 所需的並聯電容。',
    questionEn: (g, r) => 'When connected to a <b>' + r.V + '-V (rms), 60-Hz</b> power line, a load absorbs <b>' + fix(r.P / 1000, 1) + ' kW</b> at a lagging power factor of <b>' + r.pf1.toFixed(2) + '</b>. Find the value of parallel capacitance necessary to raise the pf to <b>' + r.pf2.toFixed(2) + '</b>.',
    steps: (g, r) => r.ok ? [
      { t: 'Step 1　校正前的角度與 Q₁。', eq: 'θ₁ = cos⁻¹ ' + r.pf1.toFixed(2) + ' = ' + angF(r.t1) + '　Q₁ = P tan θ₁ = ' + fix(r.P, 0) + ' × ' + fix(Math.tan(r.t1 * RAD), 4) + ' = ' + fix(r.Q1, 1) + ' VAR' },
      { t: 'Step 2　校正後的角度與 Q₂（P 不變）。', eq: 'θ₂ = cos⁻¹ ' + r.pf2.toFixed(2) + ' = ' + angF(r.t2) + '　Q₂ = ' + fix(r.P, 0) + ' × ' + fix(Math.tan(r.t2 * RAD), 4) + ' = ' + fix(r.Q2, 1) + ' VAR' },
      { t: 'Step 3　電容要吃掉的虛功率（舊減新）。', eq: 'Q<sub>C</sub> = ' + fix(r.Q1, 1) + ' − ' + fix(r.Q2, 1) + ' = ' + fix(r.QC, 1) + ' VAR' },
      { t: 'Step 4　換成電容值。', note: 'ω = 2π × 60 = 377 rad/s：', eq: 'C = Q<sub>C</sub>/(ωV<sub>rms</sub><sup>2</sup>) = ' + fix(r.QC, 1) + ' ÷ (377 × ' + r.V + '²) = ' + fix(r.Cf * 1e6, 1) + ' μF',
        after: r.P === 4000 && r.pf1 === 0.8 && r.pf2 === 0.95 && r.V === 120 ? '<span style="color:var(--ink-3)">課本先把 θ₂ 四捨五入成 18.19° 再算，得 Q₂ = 1314.4、C = 310.5 μF；這裡用精確值，差在第四位。</span>' : '' },
      { t: 'Step 5　線電流變多少？', eq: 'I₁ = ' + fix(r.S1, 0) + '/' + r.V + ' = ' + fix(r.I1, 2) + ' A　→　I₂ = ' + fix(r.S2, 0) + '/' + r.V + ' = ' + fix(r.I2, 2) + ' A',
        after: '電流少 ' + fix((1 - r.I2 / r.I1) * 100, 1) + ' %，線損 I²R 少 ' + fix((1 - Math.pow(r.I2 / r.I1, 2)) * 100, 1) + ' %。' +
          (r.pf2 >= 0.999 ? '<b style="color:var(--ok)">校正到 pf = 1：Q₂ = 0，電容吃掉全部的 Q。</b>' : '') }
    ] : [
      { t: 'Step 1　先比較兩個 pf。', eq: '目標 pf₂ = ' + r.pf2.toFixed(2) + ' ≤ 現在 pf₁ = ' + r.pf1.toFixed(2),
        after: '<b style="color:var(--warn)">目標沒有比現在好，不需要加電容</b>（再加電容只會讓 pf 更差）。把 pf₂ 拉到比 pf₁ 大再看。' }
    ],
    answer: (g, r) => r.ok ? 'C = ' + fix(r.Cf * 1e6, 1) + ' μF（Q<sub>C</sub> = ' + fix(r.QC, 1) + ' VAR；線電流 ' + fix(r.I1, 1) + ' → ' + fix(r.I2, 1) + ' A）' : '不需要校正（C = 0）',
    /* 校正前（虛線）與校正後（實線）的三角形 */
    draw: (ctx, w, h, g, r) => {
      const s = Math.min((w - 190) / r.P, (h - 36) / Math.max(r.Q1, 1)), ox = 40, oy = h - 18, px = ox + r.P * s;
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, oy); ctx.lineTo(px, oy - r.Q1 * s); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, px + 8, oy - r.Q1 * s + 4, 'S₁ = ' + fix(r.S1, 0) + ' VA', C['ink-3'], 11, 'left', '700');
      if (r.ok) {
        ctx.strokeStyle = C.accent; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, oy); ctx.lineTo(px, oy - r.Q2 * s); ctx.closePath(); ctx.stroke();
        label(ctx, px + 8, oy - r.Q2 * s + (r.Q2 * s < 20 ? -4 : 12), 'S₂ = ' + fix(r.S2, 0) + ' VA', C.accent, 11, 'left', '700');
        ctx.strokeStyle = C['q-react']; ctx.lineWidth = 6; ctx.lineCap = 'butt';
        ctx.beginPath(); ctx.moveTo(px - 10, oy - r.Q1 * s); ctx.lineTo(px - 10, oy - r.Q2 * s); ctx.stroke(); ctx.lineCap = 'round';
        label(ctx, px - 18, oy - (r.Q1 + r.Q2) / 2 * s, 'QC', C['q-react'], 11, 'right', '700');
      }
      label(ctx, (ox + px) / 2, oy - 8, 'P = ' + fix(r.P, 0) + ' W（不變）', C.ink, 11, 'center', '700');
    }
  });

  /* ── 例題 5（課本 Example 11.16）：瓦特計讀數 ─────────────────────── */
  liveExample('#ex-watt', {
    title: '例題 · 瓦特計讀數（課本 Example 11.16）',
    ratio: 0.22, minH: 110, maxH: 140,
    givens: [
      { id: 'xw-v', label: '電源 Vrms', min: 50, max: 240, step: 10, value: 150, fmt: v => v + '∠0° V' },
      { id: 'xw-r', label: '負載電阻 R', min: 1, max: 30, step: 1, value: 8, fmt: v => v + ' Ω' },
      { id: 'xw-x', label: '負載電抗 X', min: -20, max: 20, step: 1, value: -6, fmt: v => (v < 0 ? '−j' + Math.abs(v) : '+j' + v) + ' Ω' }
    ],
    compute: g => {
      const V = g['xw-v'], R = g['xw-r'], X = g['xw-x'], Rt = 12 + R, Xt = 10 + X, Z2 = Rt * Rt + Xt * Xt;
      const I2 = V * V / Z2, P = I2 * R, Q = I2 * X, Pl = I2 * 12;
      return { V, R, X, Rt, Xt, Z2, I: Math.sqrt(I2), I2, P, Q, Pl };
    },
    question: (g, r) => '電源 <b>' + r.V + '∠0° V（rms）</b>經過線路阻抗 <b>12 + j10 Ω</b>，接到負載 <b>' + r.R + (r.X < 0 ? ' − j' : ' + j') + Math.abs(r.X) +
      '&nbsp;Ω</b>。瓦特計的電流線圈串在負載上、電壓線圈並在負載兩端。求瓦特計讀數。',
    questionEn: (g, r) => 'A source <b>' + r.V + '∠0° V (rms)</b> feeds a load <b>' + r.R + (r.X < 0 ? ' − j' : ' + j') + Math.abs(r.X) + '&nbsp;Ω</b> through a line impedance of <b>12 + j10 Ω</b>. The current coil of the wattmeter is in series with the load and the voltage coil is across the load. Find the wattmeter reading.',
    steps: (g, r) => [
      { t: 'Step 1　看線圈接哪：讀的是負載的 P。', note: '電流線圈串在負載、電壓線圈並在負載 → 不含線路那 12 + j10。' },
      { t: 'Step 2　總阻抗與電流。', eq: 'Z = (12 + j10) + (' + cpx(r.R, r.X, 0) + ') = ' + cpx(r.Rt, r.Xt, 0) + ' Ω　|I| = ' + r.V + ' ÷ √' + fix(r.Z2, 0) + ' = ' + fix(r.I, 3) + ' A' },
      { t: 'Step 3　負載的複功率。', eq: 'S = |I|²Z<sub>L</sub> = ' + fix(r.I2, 2) + ' × (' + cpx(r.R, r.X, 0) + ') = ' + cpx(r.P, r.Q, 1) + ' VA' },
      { t: 'Step 4　瓦特計讀實部。', eq: 'P = Re(S) = ' + fix(r.P, 1) + ' W',
        after: '線路那段另外吃掉 ' + fix(r.Pl, 1) + ' W，瓦特計看不到。' + (r.R === 8 && r.X === -6 && r.V === 150 ? '（課本把 S 寫成 423.7 − j324.6，實部應為 432.7，是筆誤。）' : '') }
    ],
    answer: (g, r) => '瓦特計讀數 = ' + fix(r.P, 1) + ' W',
    draw: (ctx, w, h, g, r) => {
      const x0 = 96, bw = Math.max(20, w - x0 - 110), tot = r.P + r.Pl, y1 = h * 0.28, y2 = h * 0.62, bh = Math.max(10, h * 0.2);
      labelCJK(ctx, x0 - 8, y1 + bh / 2, '負載（讀數）', C.accent, 11.5, 'right', '700');
      labelCJK(ctx, x0 - 8, y2 + bh / 2, '線路損失', C['ink-2'], 11.5, 'right', '600');
      ctx.fillStyle = C.accent; ctx.fillRect(x0, y1, bw * r.P / tot, bh);
      ctx.fillStyle = C['ink-3']; ctx.fillRect(x0, y2, bw * r.Pl / tot, bh);
      label(ctx, x0 + bw * r.P / tot + 6, y1 + bh / 2, fix(r.P, 1) + ' W', C.accent, 11, 'left', '700');
      label(ctx, x0 + bw * r.Pl / tot + 6, y2 + bh / 2, fix(r.Pl, 1) + ' W', C['ink-2'], 11, 'left', '700');
    }
  });

  /* ── 例題 6（課本 Example 11.18）：功因罰款／減免 ─────────────────── */
  liveExample('#ex-bill', {
    title: '例題 · 功因罰款（課本 Example 11.18）',
    ratio: 0.2, minH: 100, maxH: 130,
    givens: [
      { id: 'xb-p', label: '負載功率', min: 50, max: 1000, step: 10, value: 300, fmt: v => v + ' kW' },
      { id: 'xb-h', label: '每月運轉', min: 100, max: 720, step: 10, value: 520, fmt: v => v + ' 小時' },
      { id: 'xb-pf', label: '功率因數', min: 0.6, max: 1, step: 0.01, value: 0.8, fmt: v => v.toFixed(2) }
    ],
    compute: g => {
      const P = g['xb-p'], H = g['xb-h'], pf = g['xb-pf'];
      const W = P * H, n = Math.round((0.85 - pf) * 100), pct = n * 0.1, dW = W * pct / 100, Wt = W + dW;
      return { P, H, pf, W, n, pct, dW, Wt, base: 0.06 * W, cost: 0.06 * Wt };
    },
    question: (g, r) => '<b>' + r.P + ' kW</b> 負載由 13 kV（rms）供電，每月運轉 <b>' + r.H + ' 小時</b>，功率因數 <b>' + r.pf.toFixed(2) +
      '</b>。費率：電能費每度 6 美分；pf 每低於 0.85 一個 0.01，罰電能費的 0.1%；每高於 0.85 一個 0.01，減免 0.1%。求每月電費。',
    questionEn: (g, r) => 'A <b>' + r.P + '-kW</b> load supplied at 13 kV (rms) operates <b>' + r.H + ' hours</b> a month at a power factor of <b>' + r.pf.toFixed(2) + '</b>. Rate: energy charge 6 cents per kWh; penalty of 0.1% of the energy charge for every 0.01 that pf falls below 0.85; credit of 0.1% for every 0.01 that pf exceeds 0.85. Find the monthly bill.',
    steps: (g, r) => [
      { t: 'Step 1　用電量。', eq: 'W = ' + r.P + ' kW × ' + r.H + ' h = ' + r.W.toLocaleString('en-US') + ' kWh' },
      { t: 'Step 2　跟 0.85 差幾個 0.01？', eq: '0.85 − ' + r.pf.toFixed(2) + ' = ' + fix(r.n / 100, 2) + ' → ' + Math.abs(r.n) + ' 個 0.01 → ' + (r.n > 0 ? '罰 ' : r.n < 0 ? '減免 ' : '') + fix(Math.abs(r.pct), 1) + ' %',
        after: r.n > 0 ? '<b style="color:var(--bad)">pf 低於 0.85：罰款。</b>' : r.n < 0 ? '<b style="color:var(--ok)">pf 高於 0.85：減免（credit）。</b>' : '剛好 0.85：不罰也不減。' },
      { t: 'Step 3　調整度數。', eq: 'ΔW = ' + r.W.toLocaleString('en-US') + ' × ' + fix(r.pct, 1) + '% = ' + Math.round(r.dW).toLocaleString('en-US') + ' kWh　→　' + Math.round(r.Wt).toLocaleString('en-US') + ' kWh' },
      { t: 'Step 4　電費。', eq: '$0.06 × ' + Math.round(r.Wt).toLocaleString('en-US') + ' = ' + money(r.cost),
        after: '如果 pf 剛好 0.85：' + money(r.base) + '，差 ' + money(Math.abs(r.cost - r.base)) + '。' }
    ],
    answer: (g, r) => '每月電費 ' + money(r.cost),
    draw: (ctx, w, h, g, r) => {
      const x0 = 20, x1 = w - 20, X = pf => lerp(x0, x1, (pf - 0.6) / 0.4), y = h / 2;
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, y - 6, x1 - x0, 12);
      ctx.fillStyle = C.bad; ctx.globalAlpha = 0.35; ctx.fillRect(x0, y - 6, X(0.85) - x0, 12); ctx.globalAlpha = 1;
      ctx.fillStyle = C.ok; ctx.globalAlpha = 0.35; ctx.fillRect(X(0.85), y - 6, x1 - X(0.85), 12); ctx.globalAlpha = 1;
      ctx.fillStyle = C.ink; ctx.fillRect(X(0.85) - 1, y - 12, 2, 24);
      label(ctx, X(0.85), y - 20, '0.85', C.ink, 10.5, 'center', '700');
      ctx.beginPath(); ctx.arc(X(r.pf), y, 7, 0, 2 * Math.PI); ctx.fillStyle = C.accent; ctx.fill();
      labelCJK(ctx, clamp(X(r.pf), x0 + 40, x1 - 40), y + 22, 'pf = ' + r.pf.toFixed(2), C.accent, 11, 'center', '700');
      labelCJK(ctx, x0, y - 20, '罰款', C.bad, 10.5, 'left', '600'); labelCJK(ctx, x1, y - 20, '減免', C.ok, 10.5, 'right', '600');
    }
  });

  /* ── 觀念小測驗 ─────────────────────────────────────────── */
  window.__ch11Quiz([
    { zh: '複功率 S 的正確定義是？',
      en: 'The correct definition of complex power S is:',
      o: [['S = Vrms · I*rms', 'S = Vrms · I*rms'], ['S = Vrms · Irms', 'S = Vrms · Irms'], ['S = V*rms · Irms', 'S = V*rms · Irms'], ['S = Vrms / Irms', 'S = Vrms / Irms']], a: 0,
      e: 'S = Vrms I*rms = P + jQ。取電流的共軛才會得到正確的角度 θv − θi；不取共軛的話角度變成 θv + θi，P、Q 全錯。' },
    { zh: '虛功率 Q 的單位是？',
      en: 'The unit of reactive power Q is:',
      o: [['乏 VAR', 'volt-ampere reactive (VAR)'], ['瓦特 W', 'watt (W)'], ['伏安 VA', 'volt-ampere (VA)'], ['歐姆 Ω', 'ohm (Ω)']], a: 0,
      e: 'P 用 W、Q 用 VAR、|S| 用 VA。三個量的單位故意不同，寫錯單位在考試會被扣分。' },
    { zh: '某負載的 Q < 0，表示它是？',
      en: 'A load with Q < 0 is:',
      o: [['電容性，pf 超前', 'capacitive, leading pf'], ['電感性，pf 落後', 'inductive, lagging pf'], ['純電阻', 'purely resistive'], ['在送出實功率', 'delivering real power']], a: 0,
      e: 'Q = Vrms Irms sin(θv − θi)。電容性時電流超前，θv − θi < 0，sin 為負，所以 Q < 0。電感性則 Q > 0。' },
    { zh: '由 S = I²rms Z 可以得到虛功率 Q 等於？',
      en: 'From S = I²rms Z, the reactive power Q equals:',
      o: [['I²rms X', 'I²rms X'], ['I²rms R', 'I²rms R'], ['I²rms |Z|', 'I²rms |Z|'], ['V²rms / R', 'V²rms / R']], a: 0,
      e: 'S = I²(R + jX) = I²R + jI²X，對照 S = P + jQ：P = I²R（電阻決定）、Q = I²X（電抗決定）。' },
    { zh: '兩個負載並聯在同一電源上，下列哪一個關係式「不成立」？',
      en: 'For two loads connected in parallel across the same source, which relation does NOT hold?',
      o: [['|S| = |S₁| + |S₂|', '|S| = |S₁| + |S₂|'], ['S = S₁ + S₂', 'S = S₁ + S₂'], ['P = P₁ + P₂', 'P = P₁ + P₂'], ['Q = Q₁ + Q₂', 'Q = Q₁ + Q₂']], a: 0,
      e: '複功率、P、Q 都可以直接相加，但視在功率是向量的「長度」，必須先把 S 加起來再取絕對值，一般會小於 Σ|Sᵢ|。' },
    { zh: '負載 1：P₁ = 600 W、Q₁ = +800 VAR；負載 2：P₂ = 900 W、Q₂ = −400 VAR。總視在功率約為？',
      en: 'Load 1: P₁ = 600 W, Q₁ = +800 VAR; Load 2: P₂ = 900 W, Q₂ = −400 VAR. The total apparent power is about:',
      o: [['1552 VA', '1552 VA'], ['1985 VA', '1985 VA'], ['2700 VA', '2700 VA'], ['1500 VA', '1500 VA']], a: 0,
      e: 'P = 1500 W、Q = +400 VAR，|S| = √(1500² + 400²) = 1552.4 VA。1985 是把 1000 + 985 直接相加的錯誤做法。' },
    { zh: '在電感性負載旁並聯一個電容做功因校正，負載消耗的實功率 P 會如何變化？',
      en: 'When a capacitor is connected in parallel with an inductive load for pf correction, the real power P consumed by the load:',
      o: [['維持不變', 'remains unchanged'], ['增加', 'increases'], ['減少', 'decreases'], ['變成零', 'becomes zero']], a: 0,
      e: '理想電容的平均功率為零，它只提供 −Q 去抵銷電感的 +Q。P 完全不變，改變的是 Q、|S| 和線電流 —— 功率三角形變矮、斜邊變短。' },
    { zh: '要把功率因數從 cos θ₁ 提升到 cos θ₂，所需並聯電容值 C 為？',
      en: 'To raise the power factor from cos θ₁ to cos θ₂, the required shunt capacitance C is:',
      o: [['P(tan θ₁ − tan θ₂) / (ωV²rms)', 'P(tan θ₁ − tan θ₂) / (ωV²rms)'], ['P(tan θ₂ − tan θ₁) / (ωV²rms)', 'P(tan θ₂ − tan θ₁) / (ωV²rms)'],
          ['P(cos θ₁ − cos θ₂) / (ωV²rms)', 'P(cos θ₁ − cos θ₂) / (ωV²rms)'], ['ωV²rms / P(tan θ₁ − tan θ₂)', 'ωV²rms / P(tan θ₁ − tan θ₂)']], a: 0,
      e: 'QC = Q₁ − Q₂ = P(tan θ₁ − tan θ₂)，而 QC = ωCV²rms，兩式相等解出 C。順序是 θ₁ 減 θ₂（θ₁ 較大）。' },
    { zh: '瓦特計的電流線圈應該怎麼接？',
      en: 'How is the current coil of a wattmeter connected?',
      o: [['與負載串聯（阻抗極低）', 'in series with the load (very low impedance)'], ['與負載並聯（阻抗極高）', 'in parallel with the load (very high impedance)'],
          ['接在電源兩端', 'across the source'], ['接地', 'to ground']], a: 0,
      e: '電流線圈阻抗極低、串聯在負載上感應電流；電壓線圈阻抗極高、並聯在負載兩端感應電壓。所以接上瓦特計不會干擾原電路，讀數是 P = VrmsIrms cos(θv − θi)。' },
    { zh: '電力公司為什麼對功率因數太低的大用戶收罰款？',
      en: 'Why do utilities penalize large customers with low power factor?',
      o: [['同樣的 P 需要更大的電流，線損 I²R 變大', 'the same P requires a larger current, increasing I²R line losses'],
          ['低功因會讓 P 變大', 'a low power factor increases P'], ['電表量不到虛功率', 'meters cannot measure reactive power'], ['低功因代表用電量少', 'a low power factor means less energy used']], a: 0,
      e: 'I = P/(V·pf)：pf 越低電流越大，電線、變壓器都得做大，線損 I²R 也變大。這筆成本轉嫁給 pf 低的用戶 —— 所以工廠要並電容做功因校正。' }
  ], ['整章觀念很穩，可以直接去寫課本習題了。',
      '主幹抓到了，把答錯的題目回去拉一拉例題的數字。',
      '建議從「功率三角形」跟「功率守恆」兩個模組重新走一遍，那是這章計算題的核心。']);
})();
