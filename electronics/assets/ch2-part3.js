/* ============================================================
   電子學 CH2 PART 3 — 截波器（並聯、串聯、雙向）與箝位器
   課程原講義 CH2 PART 3（上課板書 10/11 掃描：Clipper / Clamper）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, bindRange, lerp, TAU } = E;
  const { setHTML, dot, wide, dash, trace } = window.__c2.tools;
  const warn = () => C['q-react'] || C.warn;

  /* 共用：上面畫 v_i，下面畫 v_O；fo 是轉移函數；lines = [[電壓, 文字, 顏色]] 畫在 v_O 那一列 */
  function twoRows(id, getP, fo, lines, bind) {
    const cv = document.getElementById(id); if (!cv) return null;
    let ph = 0, st;
    st = Stage(cv, { ratio: w => wide(w) ? 0.5 : 1.0, minH: 300, maxH: 440, draw(ctx, w, h, dt) {
      ph = (ph + dt * 0.12) % 1;
      const P = getP(), x0 = Math.max(56, w * 0.12), x1 = w * 0.96, rh = h * 0.46;
      const vi = u => P.VM * Math.sin(2 * TAU * u);
      const vals = [-P.VM, P.VM];
      for (let k = 0; k <= 60; k++) { const o = fo(vi(k / 60), P); vals.push(o); }
      const lo = Math.min(...vals) - 0.5, hi = Math.max(...vals) + 0.5;
      [[0, 'v<sub>i</sub>', C.ink, vi, -P.VM - 0.5, P.VM + 0.5], [1, 'v<sub>O</sub>', C.accent, u => fo(vi(u), P), lo, hi]].forEach(([k, nm, col, f, a, b]) => {
        const y0 = h * 0.03 + k * (rh + h * 0.02), y1 = y0 + rh, Y = v => lerp(y1, y0, (v - a) / (b - a));
        dash(ctx, x0, Y(0), x1, Y(0), C['line-soft'] || C.line);
        labelCJK(ctx, x0 - 8, Y(0), nm, col, 12, 'right', '700');
        if (k) trace(ctx, x0, x1, 0, 1, u => -Y(vi(u)), C['ink-3'], 1.1, [4, 4]);
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath();
        for (let q = 0; q <= 240; q++) { const u = q / 240, y = Y(f(u)); q ? ctx.lineTo(lerp(x0, x1, u), y) : ctx.moveTo(lerp(x0, x1, u), y); } ctx.stroke(); ctx.restore();
        dot(ctx, lerp(x0, x1, ph), Y(f(ph)), 5, col);
        if (k) (lines(P) || []).forEach(([v, t, c2]) => { dash(ctx, x0, Y(v), x1, Y(v), c2 || warn()); label(ctx, x1 - 2, Y(v) - 8, t, c2 || warn(), 10.5, 'right', '700'); });
      });
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, ph), h * 0.03); ctx.lineTo(lerp(x0, x1, ph), h * 0.97); ctx.stroke();
    } });
    return st;
  }

  const shunt = (v, P) => v > P.VB + P.Vg ? P.VB + P.Vg : v;
  const series = (v, P) => v > P.VB - P.Vg ? 0 : v - (P.VB - P.Vg);
  window.__c23 = { shunt, series };

  function clipperBench(id, p, fo, lim, text) {
    const P = { VM: 8, VB: 3, Vg: 0.7 };
    twoRows(id, () => P, fo, q => [[lim(q), lim(q).toFixed(2) + ' V', null]]);
    const msg = () => {
      setHTML(p + '-lim', lim(P).toFixed(2) + ' V');
      setHTML(p + '-mx', Math.max(...Array.from({ length: 200 }, (_, k) => fo(P.VM * Math.sin(k / 200 * TAU), P))).toFixed(2) + ' V');
      setHTML(p + '-mn', Math.min(...Array.from({ length: 200 }, (_, k) => fo(P.VM * Math.sin(k / 200 * TAU), P))).toFixed(2) + ' V');
      setHTML(p + '-msg', text(P));
    };
    bindRange(p + '-m', x => x.toFixed(1) + ' V', x => { P.VM = x; msg(); });
    bindRange(p + '-b', x => x.toFixed(1) + ' V', x => { P.VB = x; msg(); });
    bindRange(p + '-g', x => x.toFixed(2) + ' V', x => { P.Vg = x; msg(); });
  }
  clipperBench('cv-sh', 'sh', shunt, P => P.VB + P.Vg, P => P.VM > P.VB + P.Vg
    ? '輸入超過 <b>V<sub>B</sub> + V<sub>γ</sub> = ' + (P.VB + P.Vg).toFixed(2) + ' V</b> 的部分，二極體導通、輸出被釘在這個高度；其他時候二極體 OFF，v<sub>O</sub> = v<sub>i</sub>。'
    : '輸入沒超過 V<sub>B</sub> + V<sub>γ</sub>，二極體一直 OFF，輸出 = 輸入，什麼都沒被截。');
  clipperBench('cv-se', 'se', series, P => P.VB - P.Vg, P => '板書的串聯截波：v<sub>i</sub> &gt; V<sub>B</sub> − V<sub>γ</sub> = ' + (P.VB - P.Vg).toFixed(2) + ' V 時 v<sub>O</sub> = 0；小於時 v<sub>O</sub> = v<sub>i</sub> − (V<sub>B</sub> − V<sub>γ</sub>)，整個波形被平移。');

  /* 雙向截波 */
  (function bidir() {
    const P = { VM: 6, VB1: 2, VB2: 4, Vg: 0, k: 0.5 };
    const fo = (v, q) => { const L1 = q.VB1 + q.Vg, L2 = q.VB2 + q.Vg; return v > L1 ? L1 + q.k * (v - L1) : v < -L2 ? -L2 : v; };
    twoRows('cv-bd', () => P, fo, q => [[q.VB1 + q.Vg, '上限 ' + (q.VB1 + q.Vg).toFixed(2) + ' V', null], [-(q.VB2 + q.Vg), '下限 −' + (q.VB2 + q.Vg).toFixed(2) + ' V', C.ink]]);
    const msg = () => {
      setHTML('bd-u', (P.VB1 + P.Vg).toFixed(2) + ' V'); setHTML('bd-l', '−' + (P.VB2 + P.Vg).toFixed(2) + ' V'); setHTML('bd-s', P.k.toFixed(2));
      setHTML('bd-msg', '上面那顆導通時，R<sub>2</sub> 跟 R<sub>1</sub> 分壓：超過上限的部分只剩 <b>R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>) = ' + P.k.toFixed(2) + '</b> 倍（k = 0 就是理想截平）。下面那顆導通時直接釘在 −(V<sub>B2</sub> + V<sub>γ</sub>)。中間兩顆都 OFF，v<sub>O</sub> = v<sub>i</sub>。');
    };
    bindRange('bd-m', x => x.toFixed(1) + ' V', x => { P.VM = x; msg(); });
    bindRange('bd-b1', x => x.toFixed(1) + ' V', x => { P.VB1 = x; msg(); });
    bindRange('bd-b2', x => x.toFixed(1) + ' V', x => { P.VB2 = x; msg(); });
    bindRange('bd-k', x => x.toFixed(2), x => { P.k = x; msg(); });
    bindRange('bd-g', x => x.toFixed(2) + ' V', x => { P.Vg = x; msg(); });
  })();

  /* 箝位器：穩態 v_C = V_M − V_B − V_γ，v_O = v_i − v_C */
  (function clamp() {
    const P = { VM: 5, VB: 1, Vg: 0.7 };
    const cv = document.getElementById('cv-cl'); if (!cv) return;
    let ph = 0;
    Stage(cv, { ratio: w => wide(w) ? 0.5 : 1.0, minH: 300, maxH: 440, draw(ctx, w, h, dt) {
      ph = (ph + dt * 0.12) % 1;
      const x0 = Math.max(56, w * 0.12), x1 = w * 0.96, rh = h * 0.3, VC = P.VM - P.VB - P.Vg;
      const vi = u => P.VM * Math.sin(2 * TAU * u), vo = u => vi(u) - VC;
      const rows = [['v<sub>i</sub>', vi, C.ink, -P.VM, P.VM], ['v<sub>C</sub>', () => VC, C['ink-3'], -P.VM, P.VM], ['v<sub>O</sub>', vo, C.accent, -2 * P.VM, P.VM]];
      rows.forEach(([nm, f, col, a, b], k) => {
        const y0 = h * 0.03 + k * (rh + h * 0.03), y1 = y0 + rh, Y = v => lerp(y1, y0, (v - a) / (b - a) * 0.9 + 0.05);
        dash(ctx, x0, Y(0), x1, Y(0), C['line-soft'] || C.line);
        labelCJK(ctx, x0 - 8, Y(0), nm, col, 12, 'right', '700');
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath();
        for (let q = 0; q <= 240; q++) { const u = q / 240, y = Y(f(u)); q ? ctx.lineTo(lerp(x0, x1, u), y) : ctx.moveTo(lerp(x0, x1, u), y); } ctx.stroke(); ctx.restore();
        dot(ctx, lerp(x0, x1, ph), Y(f(ph)), 5, col);
        if (k === 2) { label(ctx, x0 + 4, Y(P.VB + P.Vg) - 8, '最大 ' + (P.VB + P.Vg).toFixed(2) + ' V', C.accent, 10.5, 'left', '700'); label(ctx, x1 - 2, Y(-2 * P.VM + P.VB + P.Vg) - 8, '最小 ' + (-2 * P.VM + P.VB + P.Vg).toFixed(2) + ' V', C.accent, 10.5, 'right', '700'); }
        if (k === 1) label(ctx, x1 - 2, Y(VC) - 8, VC.toFixed(2) + ' V', C['ink-2'], 10.5, 'right', '700');
      });
    } });
    const msg = () => {
      setHTML('cl-c', (P.VM - P.VB - P.Vg).toFixed(2) + ' V'); setHTML('cl-mx', (P.VB + P.Vg).toFixed(2) + ' V'); setHTML('cl-mn', (-2 * P.VM + P.VB + P.Vg).toFixed(2) + ' V');
      setHTML('cl-msg', '電容被二極體充到 <b>V<sub>C</sub> = V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub></b> 就不再變（二極體 OFF，電容沒地方放電）。之後 v<sub>O</sub> = v<sub>i</sub> − V<sub>C</sub>：整個波形被「往下搬」，擺動幅度不變（還是 2V<sub>M</sub>）。');
    };
    bindRange('cl-m', x => x.toFixed(1) + ' V', x => { P.VM = x; msg(); });
    bindRange('cl-b', x => x.toFixed(1) + ' V', x => { P.VB = x; msg(); });
    bindRange('cl-g', x => x.toFixed(2) + ' V', x => { P.Vg = x; msg(); });
  })();
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, lerp, liveExample } = E;
  const { bars } = window.__c2.tools;
  const f1 = x => x.toFixed(1), f2 = x => x.toFixed(2);
  const { shunt, series } = window.__c23;
  const curve = (ctx, w, h, fi, fo, M, lim) => {
    const x0 = Math.max(40, w * 0.08), x1 = w * 0.96, ym = h * 0.5, A = h * 0.4 / M;
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let k = 0; k <= 160; k++) { const u = k / 160, v = M * Math.sin(u * 4 * Math.PI); k ? ctx.lineTo(lerp(x0, x1, u), ym - A * v) : ctx.moveTo(lerp(x0, x1, u), ym - A * v); } ctx.stroke(); ctx.restore();
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.6; ctx.beginPath();
    for (let k = 0; k <= 160; k++) { const u = k / 160, v = fo(M * Math.sin(u * 4 * Math.PI)); k ? ctx.lineTo(lerp(x0, x1, u), ym - A * v) : ctx.moveTo(lerp(x0, x1, u), ym - A * v); } ctx.stroke();
    label(ctx, x1, h * 0.08, '藍：v<sub>O</sub>　虛線：v<sub>i</sub>', C['ink-3'], 10.5, 'right');
  };

  liveExample('#ex-sh', {
    title: '例題 · 並聯截波器：截在哪、輸出範圍',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'a-m', label: 'v<sub>i</sub> 峰值 V<sub>M</sub>', min: 1, max: 15, step: 0.5, value: 8, fmt: v => f1(v) + ' V' },
      { id: 'a-b', label: 'V<sub>B</sub>', min: 0, max: 8, step: 0.5, value: 3, fmt: v => f1(v) + ' V' },
      { id: 'a-g', label: 'V<sub>γ</sub>', min: 0, max: 0.8, step: 0.1, value: 0.7, fmt: v => f1(v) + ' V' }
    ],
    compute: g => { const M = g['a-m'], B = g['a-b'], Vg = g['a-g'], L = B + Vg; return { M, B, Vg, L, clip: M > L, mx: Math.min(M, L), mn: -M }; },
    question: (g, r) => '並聯截波器：v<sub>i</sub> = <b>' + f1(r.M) + ' sin ωt</b> V，電池 V<sub>B</sub> = <b>' + f1(r.B) + ' V</b>，二極體 V<sub>γ</sub> = ' + f1(r.Vg) + ' V。求 v<sub>O</sub> 的最大值與最小值，並說明哪段被截掉。',
    questionEn: (g, r) => 'A shunt clipper has v<sub>i</sub> = ' + f1(r.M) + ' sin ωt V, V<sub>B</sub> = ' + f1(r.B) + ' V and V<sub>γ</sub> = ' + f1(r.Vg) + ' V. Find the maximum and minimum of v<sub>O</sub> and say which part is clipped.',
    steps: (g, r) => [
      { t: 'Step 1　導通條件。', note: '二極體要被輸入推過「電池 + V<sub>γ</sub>」才 ON。', eq: 'v<sub>i</sub> &gt; V<sub>B</sub> + V<sub>γ</sub> = ' + f2(r.L) + ' V' },
      { t: 'Step 2　ON 時。', note: '二極體 + 電池把輸出釘住。', eq: 'v<sub>O</sub> = V<sub>B</sub> + V<sub>γ</sub> = ' + f2(r.L) + ' V' },
      { t: 'Step 3　OFF 時。', note: 'OFF 就是斷路，電阻沒壓降。', eq: 'v<sub>O</sub> = v<sub>i</sub>（從 −' + f1(r.M) + ' 到 ' + f2(r.L) + ' V）' },
      { t: 'Step 4　結論。', note: r.clip ? '輸入峰值 ' + f1(r.M) + ' V 超過 ' + f2(r.L) + ' V：正峰被截成平頂，負半週完整保留。' : '輸入峰值沒超過門檻：什麼都沒被截。' }
    ],
    answer: (g, r) => 'v<sub>O</sub> 最大 ' + f2(r.mx) + ' V、最小 ' + f2(r.mn) + ' V' + (r.clip ? '（正峰被截）' : '（沒被截）'),
    draw: (ctx, w, h, g, r) => curve(ctx, w, h, null, v => shunt(v, { VB: r.B, Vg: r.Vg }), r.M)
  });

  liveExample('#ex-se', {
    title: '例題 · 串聯截波器（板書公式）',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'b-m', label: 'v<sub>i</sub> 峰值 V<sub>M</sub>', min: 1, max: 15, step: 0.5, value: 8, fmt: v => f1(v) + ' V' },
      { id: 'b-b', label: 'V<sub>B</sub>', min: 0, max: 8, step: 0.5, value: 3, fmt: v => f1(v) + ' V' },
      { id: 'b-g', label: 'V<sub>γ</sub>', min: 0, max: 0.8, step: 0.1, value: 0.7, fmt: v => f1(v) + ' V' }
    ],
    compute: g => { const M = g['b-m'], B = g['b-b'], Vg = g['b-g'], T = B - Vg; return { M, B, Vg, T, mx: 0, mn: -M - T }; },
    question: (g, r) => '串聯截波器：v<sub>i</sub> = <b>' + f1(r.M) + ' sin ωt</b> V，V<sub>B</sub> = <b>' + f1(r.B) + ' V</b>，V<sub>γ</sub> = ' + f1(r.Vg) + ' V。依板書公式，求 v<sub>O</sub> 的最大值與最小值。',
    questionEn: (g, r) => 'For the series clipper with v<sub>i</sub> = ' + f1(r.M) + ' sin ωt V, V<sub>B</sub> = ' + f1(r.B) + ' V, V<sub>γ</sub> = ' + f1(r.Vg) + ' V, use the notes\' equations to find the maximum and minimum of v<sub>O</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　分界點。', eq: 'V<sub>B</sub> − V<sub>γ</sub> = ' + f2(r.T) + ' V' },
      { t: 'Step 2　v<sub>i</sub> 大於分界點。', eq: 'v<sub>O</sub> = 0' },
      { t: 'Step 3　v<sub>i</sub> 小於分界點。', note: '輸出 = 輸入平移一個分界點。', eq: 'v<sub>O</sub> = v<sub>i</sub> − ' + f2(r.T) },
      { t: 'Step 4　最小值在 v<sub>i</sub> = −V<sub>M</sub>。', eq: '−' + f1(r.M) + ' − ' + f2(r.T) + ' = ' + f2(r.mn) + ' V' }
    ],
    answer: (g, r) => '最大 0 V、最小 ' + f2(r.mn) + ' V',
    draw: (ctx, w, h, g, r) => curve(ctx, w, h, null, v => series(v, { VB: r.B, Vg: r.Vg }), r.M)
  });

  liveExample('#ex-bd', {
    title: '例題 2.7 · 雙向截波器（板書，請確認數字）',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'c-m', label: 'v<sub>i</sub> 峰值', min: 1, max: 12, step: 0.5, value: 6, fmt: v => f1(v) + ' V' },
      { id: 'c-1', label: 'V<sub>B1</sub>', min: 0, max: 6, step: 0.5, value: 2, fmt: v => f1(v) + ' V' },
      { id: 'c-2', label: 'V<sub>B2</sub>', min: 0, max: 6, step: 0.5, value: 4, fmt: v => f1(v) + ' V' },
      { id: 'c-r', label: 'R<sub>2</sub>/R<sub>1</sub>', min: 0, max: 4, step: 0.5, value: 1, fmt: v => f1(v) }
    ],
    compute: g => { const M = g['c-m'], B1 = g['c-1'], B2 = g['c-2'], k = g['c-r'] / (1 + g['c-r']); return { M, B1, B2, k, up: M > B1 ? B1 + k * (M - B1) : M, lo: M > B2 ? -B2 : -M }; },
    question: (g, r) => '雙向截波器（V<sub>γ</sub> = 0）：V<sub>B1</sub> = <b>' + f1(r.B1) + ' V</b>、V<sub>B2</sub> = <b>' + f1(r.B2) + ' V</b>，R<sub>2</sub>/R<sub>1</sub> = ' + f1(g['c-r']) + '，v<sub>i</sub> 峰值 <b>' + f1(r.M) + ' V</b>。求 v<sub>O</sub> 的最大、最小值，與三段的 v<sub>O</sub>。',
    questionEn: (g, r) => 'A two-way clipper (V<sub>γ</sub> = 0) has V<sub>B1</sub> = ' + f1(r.B1) + ' V, V<sub>B2</sub> = ' + f1(r.B2) + ' V, R<sub>2</sub>/R<sub>1</sub> = ' + f1(g['c-r']) + ' and a ' + f1(r.M) + ' V peak input. Find the maximum and minimum of v<sub>O</sub> and v<sub>O</sub> in each region.',
    steps: (g, r) => [
      { t: 'Step 1　中間區。', note: '兩顆都 OFF。', eq: '−' + f1(r.B2) + ' &lt; v<sub>i</sub> &lt; ' + f1(r.B1) + '：v<sub>O</sub> = v<sub>i</sub>' },
      { t: 'Step 2　上面那顆 ON。', note: 'R<sub>1</sub>、R<sub>2</sub> 分壓：超過上限的部分只留 k = R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>)。', eq: 'v<sub>O</sub> = ' + f1(r.B1) + ' + ' + f2(r.k) + '(v<sub>i</sub> − ' + f1(r.B1) + ')；峰值時 ' + f2(r.up) + ' V' },
      { t: 'Step 3　下面那顆 ON。', eq: 'v<sub>i</sub> &lt; −' + f1(r.B2) + '：v<sub>O</sub> = −' + f1(r.B2) + ' V' },
      { t: 'Step 4　最大最小。', eq: '最大 ' + f2(r.up) + ' V，最小 ' + f2(r.lo) + ' V' }
    ],
    answer: (g, r) => '最大 ' + f2(r.up) + ' V、最小 ' + f2(r.lo) + ' V',
    draw: (ctx, w, h, g, r) => curve(ctx, w, h, null, v => v > r.B1 ? r.B1 + r.k * (v - r.B1) : v < -r.B2 ? -r.B2 : v, r.M)
  });

  liveExample('#ex-cl', {
    title: '例題 · 箝位器：電容充多少、輸出的最大最小',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'd-m', label: 'v<sub>i</sub> 峰值 V<sub>M</sub>', min: 1, max: 15, step: 0.5, value: 5, fmt: v => f1(v) + ' V' },
      { id: 'd-b', label: 'V<sub>B</sub>', min: 0, max: 6, step: 0.5, value: 1, fmt: v => f1(v) + ' V' },
      { id: 'd-g', label: 'V<sub>γ</sub>', min: 0, max: 0.8, step: 0.1, value: 0.7, fmt: v => f1(v) + ' V' }
    ],
    compute: g => { const M = g['d-m'], B = g['d-b'], Vg = g['d-g'], VC = M - B - Vg; return { M, B, Vg, VC, mx: B + Vg, mn: -2 * M + B + Vg }; },
    question: (g, r) => '箝位器：v<sub>i</sub> = <b>' + f1(r.M) + ' sin ωt</b> V，V<sub>B</sub> = <b>' + f1(r.B) + ' V</b>，V<sub>γ</sub> = ' + f1(r.Vg) + ' V。穩態時電容電壓 V<sub>C</sub> 多少？v<sub>O</sub> 的最大、最小值？',
    questionEn: (g, r) => 'A clamper has v<sub>i</sub> = ' + f1(r.M) + ' sin ωt V, V<sub>B</sub> = ' + f1(r.B) + ' V and V<sub>γ</sub> = ' + f1(r.Vg) + ' V. Find the steady-state capacitor voltage and the maximum and minimum of v<sub>O</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　二極體導通時電容充電。', note: '電容被推到「輸入 − 電池 − V<sub>γ</sub>」。', eq: 'v<sub>C</sub> = v<sub>i</sub> − V<sub>B</sub> − V<sub>γ</sub>' },
      { t: 'Step 2　到輸入峰值後就停了。', note: '之後輸入下降，二極體 OFF，電容沒地方放電，電壓被「鎖」在峰值時的值。', eq: 'V<sub>C</sub> = V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub> = ' + f2(r.VC) + ' V' },
      { t: 'Step 3　輸出 = 輸入 − 電容電壓。', eq: 'v<sub>O</sub> = v<sub>i</sub> − ' + f2(r.VC) },
      { t: 'Step 4　最大、最小。', note: '擺幅還是 2V<sub>M</sub>，整個波形被往下搬。', eq: '最大 = V<sub>B</sub> + V<sub>γ</sub> = ' + f2(r.mx) + ' V；最小 = −2V<sub>M</sub> + V<sub>B</sub> + V<sub>γ</sub> = ' + f2(r.mn) + ' V' }
    ],
    answer: (g, r) => 'V<sub>C</sub> = ' + f2(r.VC) + ' V；v<sub>O</sub> 最大 ' + f2(r.mx) + ' V、最小 ' + f2(r.mn) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['v<sub>i</sub> 最大', r.M, C['ink-3']], ['v<sub>O</sub> 最大', r.mx, C.accent], ['v<sub>O</sub> 最小', r.mn, C['q-react'] || C.warn], ['V<sub>C</sub>', r.VC, C.ink]], v => f2(v) + ' V')
  });
})();

/* ============================================================
   小測驗
   ============================================================ */
window.__c2.quiz([
  { zh: '並聯截波器（二極體與電池 V<sub>B</sub> 並聯到輸出）在 v<sub>i</sub> &gt; V<sub>B</sub> + V<sub>γ</sub> 時，v<sub>O</sub> = ？', en: 'In the shunt clipper, when v<sub>i</sub> &gt; V<sub>B</sub> + V<sub>γ</sub>, v<sub>O</sub> = ?',
    o: [['V<sub>B</sub> + V<sub>γ</sub>', 'V<sub>B</sub> + V<sub>γ</sub>'], ['v<sub>i</sub>', 'v<sub>i</sub>'], ['0', '0'], ['v<sub>i</sub> − V<sub>γ</sub>', 'v<sub>i</sub> − V<sub>γ</sub>']], a: 0, e: '二極體 ON，被電池和 V<sub>γ</sub> 釘住輸出。' },
  { zh: '並聯截波器在 v<sub>i</sub> 小於門檻時，二極體狀態與輸出是？', en: 'Below the threshold, the shunt clipper diode is ___ and v<sub>O</sub> = ___.',
    o: [['OFF，v<sub>O</sub> = v<sub>i</sub>', 'off, v<sub>O</sub> = v<sub>i</sub>'], ['ON，v<sub>O</sub> = v<sub>i</sub>', 'on, v<sub>O</sub> = v<sub>i</sub>'], ['OFF，v<sub>O</sub> = 0', 'off, v<sub>O</sub> = 0'], ['ON，v<sub>O</sub> = 0', 'on, v<sub>O</sub> = 0']], a: 0, e: 'OFF = 斷路，電阻沒壓降。' },
  { zh: '板書的串聯截波器，v<sub>i</sub> &gt; V<sub>B</sub> − V<sub>γ</sub> 時 v<sub>O</sub> = ？', en: 'In the series clipper of the notes, when v<sub>i</sub> &gt; V<sub>B</sub> − V<sub>γ</sub>, v<sub>O</sub> = ?',
    o: [['0', '0'], ['v<sub>i</sub>', 'v<sub>i</sub>'], ['V<sub>B</sub>', 'V<sub>B</sub>'], ['V<sub>γ</sub>', 'V<sub>γ</sub>']], a: 0, e: '板書：v<sub>O</sub> = 0；小於時 v<sub>O</sub> = v<sub>i</sub> − (V<sub>B</sub> − V<sub>γ</sub>)。' },
  { zh: '雙向截波器的上限是？', en: 'The upper limit of the two-way clipper is?',
    o: [['V<sub>B1</sub> + V<sub>γ1</sub>', 'V<sub>B1</sub> + V<sub>γ1</sub>'], ['V<sub>B2</sub> + V<sub>γ2</sub>', 'V<sub>B2</sub> + V<sub>γ2</sub>'], ['−(V<sub>B2</sub> + V<sub>γ2</sub>)', '−(V<sub>B2</sub> + V<sub>γ2</sub>)'], ['V<sub>B1</sub> − V<sub>γ1</sub>', 'V<sub>B1</sub> − V<sub>γ1</sub>']], a: 0, e: '下限是 −(V<sub>B2</sub> + V<sub>γ2</sub>)。' },
  { zh: '雙向截波器中間區（兩顆都 OFF）v<sub>O</sub> = ？', en: 'In the middle region (both diodes off) of the two-way clipper, v<sub>O</sub> = ?',
    o: [['v<sub>i</sub>', 'v<sub>i</sub>'], ['0', '0'], ['V<sub>B1</sub>', 'V<sub>B1</sub>'], ['−V<sub>B2</sub>', '−V<sub>B2</sub>']], a: 0, e: '兩顆都斷路。' },
  { zh: '有 R<sub>2</sub> 的雙向截波器，超過上限的部分輸出只剩 ___ 倍。', en: 'With R<sub>2</sub> in the two-way clipper, the part above the upper limit is scaled by ___.',
    o: [['R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>)', 'R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>)'], ['R<sub>1</sub>/(R<sub>1</sub>+R<sub>2</sub>)', 'R<sub>1</sub>/(R<sub>1</sub>+R<sub>2</sub>)'], ['R<sub>1</sub>R<sub>2</sub>', 'R<sub>1</sub>R<sub>2</sub>'], ['1', '1']], a: 0, e: '分壓：板書 v<sub>O</sub> = (v<sub>i</sub> − V<sub>γ1</sub> − V<sub>B1</sub>)·R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>) + V<sub>γ1</sub> + V<sub>B1</sub>。' },
  { zh: '箝位器穩態時，電容電壓 V<sub>C</sub> = ？', en: 'In steady state, the clamper capacitor voltage V<sub>C</sub> = ?',
    o: [['V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>', 'V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>'], ['V<sub>M</sub>', 'V<sub>M</sub>'], ['V<sub>B</sub> + V<sub>γ</sub>', 'V<sub>B</sub> + V<sub>γ</sub>'], ['2V<sub>M</sub>', '2V<sub>M</sub>']], a: 0, e: '電容在輸入峰值時被充到這個值，之後鎖住。' },
  { zh: '箝位器的輸出 v<sub>O</sub> = ？', en: 'The clamper output v<sub>O</sub> = ?',
    o: [['v<sub>i</sub> − (V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>)', 'v<sub>i</sub> − (V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>)'], ['v<sub>i</sub> + V<sub>C</sub>', 'v<sub>i</sub> + V<sub>C</sub>'], ['v<sub>i</sub>', 'v<sub>i</sub>'], ['V<sub>C</sub>', 'V<sub>C</sub>']], a: 0, e: '輸出 = 輸入 − 電容電壓。' },
  { zh: '箝位器輸出的最大值是？', en: 'The maximum of the clamper output is?',
    o: [['V<sub>B</sub> + V<sub>γ</sub>', 'V<sub>B</sub> + V<sub>γ</sub>'], ['V<sub>M</sub>', 'V<sub>M</sub>'], ['2V<sub>M</sub>', '2V<sub>M</sub>'], ['0', '0']], a: 0, e: 'v<sub>i</sub> = V<sub>M</sub> 時 v<sub>O</sub> = V<sub>B</sub> + V<sub>γ</sub>。' },
  { zh: '箝位器輸出的最小值是？', en: 'The minimum of the clamper output is?',
    o: [['−2V<sub>M</sub> + V<sub>B</sub> + V<sub>γ</sub>', '−2V<sub>M</sub> + V<sub>B</sub> + V<sub>γ</sub>'], ['−V<sub>M</sub>', '−V<sub>M</sub>'], ['−2V<sub>M</sub>', '−2V<sub>M</sub>'], ['V<sub>B</sub> + V<sub>γ</sub>', 'V<sub>B</sub> + V<sub>γ</sub>']], a: 0, e: 'v<sub>i</sub> = −V<sub>M</sub>：−V<sub>M</sub> − (V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>)。' }
], '截波與箝位通了。回到 CH2 PART 2 複習整流器。', '答錯的回去玩 §01～§04 的模組，拉 V<sub>B</sub> 看輸出怎麼動。');
