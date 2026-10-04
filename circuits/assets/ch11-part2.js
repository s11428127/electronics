/* ============================================================
   電路學 CH11 PART 2（11.4 有效值、11.5 視在功率與功率因數）
   可互動例題 + 觀念小測驗。互動模組（cv-rms、cv-pf）在 ch11.js。
   預設數字 = 課本 Example 11.8、Example 11.9、Practice 11.9
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, arrow, clamp, lerp, liveExample } = E;
  const RAD = Math.PI / 180, TAU = 2 * Math.PI;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '−');
  const ang = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°';
  const angF = (v, n) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n === undefined ? 2 : n) + '°';
  const eng = (x, unit) => { const a = Math.abs(x); return a >= 1e-3 ? fix(x * 1e3, 1) + ' m' + unit : fix(x * 1e6, 1) + ' μ' + unit; };

  /* ── 例題 1（課本 Example 11.8 半波整流，可換波形）：rms 三步驟 + 功率 ── */
  const SH = [
    { nm: '弦波', k: 0.5, f: t => Math.sin(TAU * t), per: 'v = V<sub>m</sub> sin t，整個週期都有', avg: '弦波平方的平均 = V<sub>m</sub><sup>2</sup> × ½', ratio: 'V<sub>m</sub>/√2' },
    { nm: '半波整流', k: 0.25, f: t => Math.max(0, Math.sin(TAU * t)), per: 'v = V<sub>m</sub> sin t（0 &lt; t &lt; π），0（π &lt; t &lt; 2π）', avg: '前半週的 sin² 平均是 ½，但後半週是 0 → 再打一半 → V<sub>m</sub><sup>2</sup> × ¼', ratio: 'V<sub>m</sub>/2' },
    { nm: '全波整流', k: 0.5, f: t => Math.abs(Math.sin(TAU * t)), per: 'v = |V<sub>m</sub> sin t|，負半週翻上來', avg: '平方之後跟弦波一模一樣 → V<sub>m</sub><sup>2</sup> × ½', ratio: 'V<sub>m</sub>/√2' },
    { nm: '方波', k: 1, f: t => (t % 1 < 0.5 ? 1 : -1), per: 'v = +V<sub>m</sub>（前半）、−V<sub>m</sub>（後半）', avg: '平方之後一直是 V<sub>m</sub><sup>2</sup> → 平均 = V<sub>m</sub><sup>2</sup> × 1', ratio: 'V<sub>m</sub>' },
    { nm: '三角波', k: 1 / 3, f: t => 4 * Math.abs(((t + 0.25) % 1) - 0.5) - 1, per: 'v 在 −V<sub>m</sub> 和 +V<sub>m</sub> 之間直線上下', avg: '∫t² dt = t³/3 → 平均 = V<sub>m</sub><sup>2</sup> × ⅓', ratio: 'V<sub>m</sub>/√3' }
  ];
  liveExample('#ex-rms', {
    title: '例題 · 半波整流的 rms 與功率（課本 Example 11.8）',
    ratio: 0.32, minH: 160, maxH: 200,
    givens: [
      { id: 'xs-sh', label: '波形', min: 0, max: 4, step: 1, value: 1, fmt: v => SH[v].nm },
      { id: 'xs-vm', label: '最高點 V<sub>m</sub>', min: 1, max: 200, step: 1, value: 10, fmt: v => v + ' V' },
      { id: 'xs-r', label: '電阻 R', min: 1, max: 100, step: 1, value: 10, fmt: v => v + ' Ω' }
    ],
    compute: g => {
      const s = SH[g['xs-sh']], Vm = g['xs-vm'], R = g['xs-r'];
      const ms = s.k * Vm * Vm, rms = Math.sqrt(ms), P = ms / R;
      const wrong = Vm / Math.SQRT2, Pw = wrong * wrong / R;
      return { s, sh: g['xs-sh'], Vm, R, ms, rms, P, wrong, Pw };
    },
    question: (g, r) => '一個最高點 <b>V<sub>m</sub> = ' + r.Vm + ' V</b> 的<b>' + r.s.nm + '</b>電壓，求它的 rms 值，以及接在 <b>' + r.R + ' Ω</b> 電阻上消耗的平均功率。' +
      '<br><span style="font-size:13px;color:var(--ink-3)">↑ 拉「波形」換成方波、三角波，看 √2 什麼時候不能用。</span>',
    steps: (g, r) => [
      { t: 'Step 1　寫出一個週期。', eq: r.s.per },
      { t: 'Step 2　平方（square）。', note: '負的部分平方後變正 —— 電壓是負的也照樣發熱：', eq: 'v² 在 0 到 ' + (r.Vm * r.Vm) + ' 之間' },
      { t: 'Step 3　取一週期的平均（mean）。', note: r.s.avg + '：', eq: '平均(v²) = ' + fix(r.s.k, 4).replace(/0+$/, '').replace(/\.$/, '') + ' × ' + r.Vm + '² = ' + fix(r.ms, 2) },
      { t: 'Step 4　開根號（root）。', eq: 'V<sub>rms</sub> = √' + fix(r.ms, 2) + ' = ' + fix(r.rms, 3) + ' V　（= ' + r.s.ratio + '）' },
      { t: 'Step 5　平均功率。', note: '用 rms 算，不用再乘 ½：',
        eq: 'P = V<sub>rms</sub><sup>2</sup>/R = ' + fix(r.ms, 2) + ' ÷ ' + r.R + ' = ' + fix(r.P, 3) + ' W',
        after: Math.abs(r.s.k - 0.5) < 1e-9
          ? '<b style="color:var(--ok)">這個波形平方後跟弦波一樣，V<sub>m</sub>/√2 可以直接用。</b>'
          : '<b style="color:var(--bad)">如果照套 V<sub>m</sub>/√2</b>：會算成 ' + fix(r.wrong, 3) + ' V、P = ' + fix(r.Pw, 3) + ' W，' +
            (r.Pw > r.P ? '高估了 ' : '低估了 ') + fix(Math.abs(r.Pw / r.P - 1) * 100, 0) + ' %。不是弦波就要回去做三步驟。' }
    ],
    answer: (g, r) => 'V<sub>rms</sub> = ' + fix(r.rms, 3) + ' V，P = ' + fix(r.P, 3) + ' W',
    /* 原波形（墨色）＋ 平方（淺藍底）＋ rms 線 */
    draw: (ctx, w, h, g, r) => {
      const x0 = 40, x1 = w - 14, yM = h / 2 + 4, A = Math.max(10, h / 2 - 26);
      const X = t => lerp(x0, x1, t / 2), Y = v => yM - A * v;
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yM); ctx.lineTo(x1, yM); ctx.stroke();
      label(ctx, x0 - 6, Y(1), fix(r.Vm, 0), C['ink-3'], 10, 'right'); label(ctx, x0 - 6, yM, '0', C['ink-3'], 10, 'right');
      ctx.beginPath();
      for (let i = 0; i <= 240; i++) { const t = 2 * i / 240, y = Y(r.s.f(t)); i ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y); }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
      const yr = Y(r.rms / r.Vm);
      ctx.setLineDash([6, 4]); ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, yr); ctx.lineTo(x1, yr); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, x1 - 4, yr - 10, 'Vrms = ' + fix(r.rms, 2) + ' V', C.accent, 11, 'right', '700');
      ctx.setLineDash([2, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, Y(1)); ctx.lineTo(x1, Y(1)); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, x0 + 4, h - 8, r.s.nm + '：rms = 最高點 × ' + fix(Math.sqrt(r.s.k), 3), C['ink-2'], 11, 'left', '600');
    }
  });

  /* ── 例題 2（課本 Example 11.9）：S、pf、反推串聯元件 ────────────── */
  liveExample('#ex-pf', {
    title: '例題 · 視在功率、功率因數、反推元件（課本 Example 11.9）',
    ratio: 0.24, minH: 120, maxH: 150,
    givens: [
      { id: 'xp-vm', label: '電壓振幅 Vm', min: 10, max: 340, step: 10, value: 120, fmt: v => v + ' V' },
      { id: 'xp-im', label: '電流振幅 Im', min: 1, max: 20, step: 1, value: 4, fmt: v => v + ' A' },
      { id: 'xp-tv', label: '電壓相角 θv', min: -90, max: 90, step: 5, value: -20, fmt: ang },
      { id: 'xp-ti', label: '電流相角 θi', min: -90, max: 90, step: 5, value: 10, fmt: ang }
    ],
    compute: g => {
      const Vm = g['xp-vm'], Im = g['xp-im'], tv = g['xp-tv'], ti = g['xp-ti'], w = 100 * Math.PI;
      const d = tv - ti, Vr = Vm / Math.SQRT2, Ir = Im / Math.SQRT2, S = Vr * Ir, pf = Math.cos(d * RAD), P = S * pf;
      const Zm = Vm / Im, R = Zm * Math.cos(d * RAD), X = Zm * Math.sin(d * RAD);
      return { Vm, Im, tv, ti, w, d, Vr, Ir, S, pf, P, Zm, R, X, L: X / w, Cc: 1 / (w * Math.abs(X)) };
    },
    question: (g, r) => '串聯負載的電流 <b>i(t) = ' + r.Im + ' cos(100πt ' + (r.ti < 0 ? '− ' : '+ ') + Math.abs(r.ti) + '°) A</b>，外加電壓 <b>v(t) = ' + r.Vm +
      ' cos(100πt ' + (r.tv < 0 ? '− ' : '+ ') + Math.abs(r.tv) + '°) V</b>。求視在功率與功率因數，並求構成此串聯負載的元件值。',
    steps: (g, r) => [
      { t: 'Step 1　換成有效值。', eq: 'V<sub>rms</sub> = ' + r.Vm + '/√2 = ' + fix(r.Vr, 2) + ' V　I<sub>rms</sub> = ' + r.Im + '/√2 = ' + fix(r.Ir, 3) + ' A' },
      { t: 'Step 2　視在功率：有效值相乘，不管相位。', eq: 'S = ' + fix(r.Vr, 2) + ' × ' + fix(r.Ir, 3) + ' = ' + fix(r.S, 1) + ' VA' },
      { t: 'Step 3　功率因數。', eq: 'pf = cos(θ<sub>v</sub> − θ<sub>i</sub>) = cos(' + angF(r.tv, 0) + ' − (' + angF(r.ti, 0) + ')) = cos(' + angF(r.d, 0) + ') = ' + fix(r.pf, 4),
        after: Math.abs(r.d) < 0.01 ? '<b style="color:var(--ok)">θ<sub>v</sub> = θ<sub>i</sub>：單位功因（unity）</b>，負載是純電阻。'
          : Math.abs(r.d) > 90 ? '<b style="color:var(--bad)">相差超過 90°，cos 變負</b>：這一端其實在送出功率，不是被動負載。'
          : r.d < 0 ? '電流角度比較大 → 電流<b>早到</b> → <b>超前（leading）</b>，電容性。'
          : '電流角度比較小 → 電流<b>晚到</b> → <b>落後（lagging）</b>，電感性。' },
      { t: 'Step 4　負載阻抗 Z = V/I。', note: '大小相除、角度相減：',
        eq: 'Z = ' + r.Vm + '∠' + angF(r.tv, 0) + ' ÷ ' + r.Im + '∠' + angF(r.ti, 0) + ' = ' + fix(r.Zm, 2) + '∠' + angF(r.d, 0) + ' = ' + fix(r.R, 2) + (r.X < 0 ? ' − j' : ' + j') + fix(Math.abs(r.X), 2) + ' Ω' },
      { t: 'Step 5　實部是電阻、虛部看正負。', note: 'ω = 100π rad/s：',
        eq: Math.abs(r.X) < 1e-9 ? 'X = 0：只有電阻 R = ' + fix(r.R, 2) + ' Ω'
          : r.X < 0 ? 'R = ' + fix(r.R, 2) + ' Ω；−1/(ωC) = −' + fix(Math.abs(r.X), 2) + '　⟹　C = 1/(' + fix(Math.abs(r.X), 2) + ' × 100π) = ' + eng(r.Cc, 'F')
          : 'R = ' + fix(r.R, 2) + ' Ω；ωL = ' + fix(r.X, 2) + '　⟹　L = ' + fix(r.X, 2) + ' ÷ 100π = ' + eng(r.L, 'H') }
    ],
    answer: (g, r) => 'S = ' + fix(r.S, 1) + ' VA，pf = ' + fix(Math.abs(r.pf), 3) + (Math.abs(r.d) < 0.01 ? '（unity）' : r.d < 0 ? '（leading）' : '（lagging）') + '；' +
      (Math.abs(r.X) < 1e-9 ? fix(r.R, 2) + ' Ω 電阻' : fix(r.R, 2) + ' Ω 串聯 ' + (r.X < 0 ? eng(r.Cc, 'F') : eng(r.L, 'H'))),
    /* 杯子 S 與酒 P */
    draw: (ctx, w, h, g, r) => {
      const x0 = 74, x1 = w - 20, bw = x1 - x0, y1 = h * 0.3, y2 = h * 0.66, bh = Math.max(10, h * 0.2);
      labelCJK(ctx, x0 - 8, y1 + bh / 2, 'S', C['ink-2'], 13, 'right', '700');
      labelCJK(ctx, x0 - 8, y2 + bh / 2, 'P', C.accent, 13, 'right', '700');
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.4; ctx.strokeRect(x0, y1, bw, bh);
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, y2, bw, bh);
      ctx.fillStyle = C.accent; ctx.fillRect(x0, y2, bw * clamp(r.pf, 0, 1), bh);
      label(ctx, x0 + 6, y1 + bh / 2, fix(r.S, 0) + ' VA（電線扛的）', C['ink-2'], 11, 'left', '700');
      label(ctx, Math.min(x0 + bw * clamp(r.pf, 0, 1) + 6, x1 - 120), y2 + bh / 2, fix(r.P, 0) + ' W = S × ' + fix(r.pf, 3), r.pf > 0.6 ? C.ink : C.accent, 11, 'left', '700');
    }
  });

  /* ── 例題 3（課本 Practice 11.9）：只給阻抗，直接讀 pf ────────────── */
  liveExample('#ex-pfz', {
    title: '例題 · 只給阻抗，直接讀出功率因數（課本 Practice 11.9）',
    ratio: 0.3, minH: 150, maxH: 190,
    givens: [
      { id: 'xz-r', label: '電阻 R', min: 0, max: 100, step: 1, value: 60, fmt: v => v + ' Ω' },
      { id: 'xz-x', label: '電抗 X', min: -100, max: 100, step: 1, value: 40, fmt: v => (v < 0 ? '−j' + Math.abs(v) : '+j' + v) + ' Ω' },
      { id: 'xz-vm', label: '電壓振幅 Vm', min: 10, max: 400, step: 10, value: 320, fmt: v => v + ' V' }
    ],
    compute: g => {
      const R = g['xz-r'], X = g['xz-x'], Vm = g['xz-vm'];
      const Zm = Math.hypot(R, X) || 1e-9, th = Math.atan2(X, R) / RAD, pf = Math.cos(th * RAD);
      const Vr = Vm / Math.SQRT2, Ir = Vr / Zm, S = Vr * Ir, P = S * pf;
      return { R, X, Vm, Zm, th, pf, Vr, Ir, S, P };
    },
    question: (g, r) => '負載阻抗 <b>Z = ' + r.R + (r.X < 0 ? ' − j' : ' + j') + Math.abs(r.X) + '&nbsp;Ω</b>，外加電壓 <b>v(t) = ' + r.Vm + ' cos(377t + 10°) V</b>。求功率因數與視在功率。',
    steps: (g, r) => [
      { t: 'Step 1　阻抗化成極座標。', note: '阻抗角 = 功因角：',
        eq: '|Z| = √(' + r.R + '² + ' + r.X + '²) = ' + fix(r.Zm, 2) + ' Ω　θ = arctan(' + r.X + '/' + r.R + ') = ' + angF(r.th) },
      { t: 'Step 2　功率因數。', eq: 'pf = cos ' + angF(r.th) + ' = ' + fix(r.pf, 4),
        after: Math.abs(r.X) < 1e-9 ? '<b style="color:var(--ok)">X = 0：純電阻，單位功因。</b>'
          : r.R === 0 ? '<b style="color:var(--warn)">R = 0：純電抗，pf = 0</b> —— 杯子裡全是泡沫。'
          : r.X > 0 ? 'X &gt; 0 → 電感性 → <b>落後（lagging）</b>。' : 'X &lt; 0 → 電容性 → <b>超前（leading）</b>。' },
      { t: 'Step 3　有效值。', eq: 'V<sub>rms</sub> = ' + r.Vm + '/√2 = ' + fix(r.Vr, 2) + ' V　I<sub>rms</sub> = ' + fix(r.Vr, 2) + ' ÷ ' + fix(r.Zm, 2) + ' = ' + fix(r.Ir, 3) + ' A' },
      { t: 'Step 4　視在功率。', eq: 'S = V<sub>rms</sub>I<sub>rms</sub> = ' + fix(r.S, 1) + ' VA' },
      { t: 'Step 5　順便算 P（驗算）。', eq: 'P = S × pf = ' + fix(r.P, 1) + ' W　＝　I<sub>rms</sub><sup>2</sup>R = ' + fix(r.Ir * r.Ir * r.R, 1) + ' W ✓' }
    ],
    answer: (g, r) => 'pf = ' + fix(r.pf, 4) + (Math.abs(r.X) < 1e-9 ? '（unity）' : r.X > 0 ? '（lagging）' : '（leading）') + '，S = ' + fix(r.S, 1) + ' VA',
    /* 阻抗三角形 */
    draw: (ctx, w, h, g, r) => {
      const s = Math.max(0.01, Math.min((w - 220) / Math.max(r.R, 1), (h - 48) / Math.max(Math.abs(r.X), 1)));
      const ox = 70, oy = r.X >= 0 ? h - 24 : 24, px = ox + r.R * s, py = oy - r.X * s;
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox - 10, oy); ctx.lineTo(w - 20, oy); ctx.stroke();
      ctx.lineWidth = 3; ctx.strokeStyle = C.ink;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, oy); ctx.stroke();
      ctx.strokeStyle = C['ink-2']; ctx.beginPath(); ctx.moveTo(px, oy); ctx.lineTo(px, py); ctx.stroke();
      arrow(ctx, ox, oy, px, py, C.accent, 2.4);
      label(ctx, (ox + px) / 2, oy + (r.X >= 0 ? 14 : -12), 'R = ' + r.R, C.ink, 11, 'center', '700');
      label(ctx, px + 8, (oy + py) / 2, 'X = ' + r.X, C['ink-2'], 11, 'left', '700');
      label(ctx, (ox + px) / 2 - 10, (oy + py) / 2 + (r.X >= 0 ? -10 : 12), '|Z| = ' + fix(r.Zm, 1), C.accent, 11, 'right', '700');
      if (w > 380) labelCJK(ctx, w - 16, 14, 'θ = ' + angF(r.th, 1) + ' → pf = ' + fix(r.pf, 3), C.accent, 12, 'right', '700');
    }
  });

  /* ── 觀念小測驗 ─────────────────────────────────────────── */
  window.__ch11Quiz([
    { zh: '弦波訊號的有效值（rms 值）等於什麼？',
      en: 'The effective (rms) value of a sinusoidal signal is equal to:',
      o: [['Vm/√2', 'Vm/√2'], ['Vm', 'Vm'], ['Vm/√3', 'Vm/√3'], ['2Vm/π', '2Vm/π']], a: 0,
      e: '「先平方 → 取一週期平均 → 再開根號」。弦波平方的平均是 Vm²/2，開根號得 Vm/√2 ≈ 0.707Vm。√2 只適用於弦波。' },
    { zh: '「有效值」這個名稱的物理意義是什麼？',
      en: 'What is the physical meaning of the term "effective value"?',
      o: [['能對電阻送出相同平均功率的等效直流值', 'the dc value delivering the same average power to a resistor'],
          ['波形的最大值', 'the peak value of the waveform'], ['波形一週期的平均值', 'the average value over one period'], ['波形的瞬時值', 'the instantaneous value']], a: 0,
      e: '一個週期性電流的有效值，等於能對同一個電阻送出相同平均功率（發一樣多熱）的那個直流電流。所以才能用 P = Irms²R 這種跟直流一樣的式子。' },
    { zh: '台灣插座標示 110 V（rms），電壓的最高點約是多少？',
      en: 'A household outlet is rated 110 V (rms). Its peak voltage is approximately:',
      o: [['155 V', '155 V'], ['110 V', '110 V'], ['78 V', '78 V'], ['220 V', '220 V']], a: 0,
      e: 'Vm = √2 × Vrms = 1.414 × 110 ≈ 155.6 V。電力系統講的電壓預設是 rms，最高點要乘 √2。' },
    { zh: '振幅 Vm 的方波，rms 值是多少？',
      en: 'The rms value of a square wave of amplitude Vm is:',
      o: [['Vm', 'Vm'], ['Vm/√2', 'Vm/√2'], ['Vm/√3', 'Vm/√3'], ['Vm/2', 'Vm/2']], a: 0,
      e: '方波的值只有 +Vm 和 −Vm，平方後永遠是 Vm²，平均還是 Vm²，開根號就是 Vm。不是弦波就不能套 √2。' },
    { zh: '半波整流正弦波（最高點 10 V）的 rms 值是？（課本 Example 11.8）',
      en: 'The rms value of a half-wave rectified sine wave with a peak of 10 V is:',
      o: [['5 V', '5 V'], ['7.07 V', '7.07 V'], ['10 V', '10 V'], ['3.18 V', '3.18 V']], a: 0,
      e: '前半週 sin² 的平均是 ½，後半週是 0，整個週期平均變 ¼：Vrms = √(100/4) = 5 V = Vm/2。7.07 是誤套 √2；3.18 是平均值 Vm/π。' },
    { zh: '用 rms 值表示時，平均功率公式是？',
      en: 'In terms of rms values, the average power is:',
      o: [['P = Vrms Irms cos(θv − θi)', 'P = Vrms Irms cos(θv − θi)'], ['P = ½ Vrms Irms cos(θv − θi)', 'P = ½ Vrms Irms cos(θv − θi)'],
          ['P = Vrms Irms sin(θv − θi)', 'P = Vrms Irms sin(θv − θi)'], ['P = 2 Vrms Irms cos(θv − θi)', 'P = 2 Vrms Irms cos(θv − θi)']], a: 0,
      e: '½VmIm = (Vm/√2)(Im/√2) = VrmsIrms，那個 ½ 已經被 rms 吃掉了。用了 rms 還乘 ½ 是常見錯誤。' },
    { zh: '視在功率 S 的單位是什麼？',
      en: 'What is the unit of apparent power S?',
      o: [['伏安 VA', 'volt-ampere (VA)'], ['瓦特 W', 'watt (W)'], ['乏 VAR', 'volt-ampere reactive (VAR)'], ['焦耳 J', 'joule (J)']], a: 0,
      e: '實功率 P 用 W、虛功率 Q 用 VAR、視在功率 S 用 VA。故意用不同單位，就是為了提醒「S 不是真的被用掉的瓦特」。' },
    { zh: '功率因數 pf 的定義是？',
      en: 'The power factor (pf) is defined as:',
      o: [['P/S', 'P/S'], ['Q/S', 'Q/S'], ['S/P', 'S/P'], ['P/Q', 'P/Q']], a: 0,
      e: 'pf = P/S = cos(θv − θi)，也等於負載阻抗角的餘弦。因為是比值，所以沒有單位，範圍 0～1。' },
    { zh: '電流落後電壓的負載，它的功率因數與負載性質分別是？',
      en: 'For a load whose current lags the voltage, the power factor and load type are:',
      o: [['落後，電感性', 'lagging, inductive'], ['超前，電容性', 'leading, capacitive'], ['落後，電容性', 'lagging, capacitive'], ['單位，電阻性', 'unity, resistive']], a: 0,
      e: '電流晚到 → 電感性 → pf 落後（lagging）。馬達、變壓器、冷氣都屬於這一類。口訣 ELI：電感中 E 在 I 前面。' },
    { zh: '一個負載阻抗 Z = 20 − j20 Ω，它的功率因數是？',
      en: 'A load impedance Z = 20 − j20 Ω has a power factor of:',
      o: [['0.707 超前 leading', '0.707 leading'], ['0.707 落後 lagging', '0.707 lagging'], ['1.0 單位 unity', '1.0 unity'], ['0.5 超前 leading', '0.5 leading']], a: 0,
      e: '阻抗角 θ = arctan(−20/20) = −45°，pf = cos(−45°) = 0.707。X 為負代表電容性，電流超前電壓，所以是超前（leading）。' }
  ], ['這一頁觀念很穩，可以往 PART 3 的複功率前進了。',
      '主幹抓到了，把答錯的題目回去拉一拉例題的數字。',
      '建議先把故事模式再看一次，特別是「啤酒杯」和「斜著拉行李箱」那兩幕。']);
})();
