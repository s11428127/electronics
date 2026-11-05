/* ============================================================
   電路學 CH14 PART 1（14.2 轉移函數、14.3 分貝；考試範圍到 14.3）
   互動模組：cv-sweep（RC／RL 頻率掃描，|H| 與 φ）、cv-db（倍數 ↔ dB 換算尺）
   可互動例題：Example 14.1、Example 14.2（零點極點）、Problem 14.7 型（dB 換回倍數）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  if (!E || !X) return;
  const { C, Stage, label, labelCJK, liveExample, bindRange, setText } = E;
  const RAD = Math.PI / 180, log10 = Math.log10;

  /* ── 14.2 頻率掃描 ── */
  (function sweep() {
    const cv = document.getElementById('cv-sweep'); if (!cv) return;
    let lg = 0, hp = false;
    const tb = document.getElementById('sw-kind');
    const Hof = r => hp ? { m: r / Math.sqrt(1 + r * r), p: 90 - Math.atan(r) / RAD } : { m: 1 / Math.sqrt(1 + r * r), p: -Math.atan(r) / RAD };
    const st = Stage(cv, { animate: false, ratio: 0.55, minH: 270, maxH: 380, draw(ctx, w, h) {
      const x0 = 46, x1 = w - 16, top = 16, mid = h * 0.52, bot = h - 26;
      const X_ = l => x0 + (l + 2) / 4 * (x1 - x0);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x0, mid - 8); ctx.lineTo(x1, mid - 8); ctx.moveTo(x0, mid + 8); ctx.lineTo(x0, bot); ctx.lineTo(x1, bot); ctx.stroke();
      [-2, -1, 0, 1, 2].forEach(l => { const x = X_(l); label(ctx, x, bot + 16, ['0.01ω₀', '0.1ω₀', 'ω₀', '10ω₀', '100ω₀'][l + 2], C['ink-3'], 10.5, 'center'); ctx.beginPath(); ctx.moveTo(x, bot); ctx.lineTo(x, bot + 4); ctx.stroke(); });
      const Hy = m => mid - 8 - m * (mid - 8 - top - 6), Py = p => mid + 8 + (90 - p) / 180 * (bot - mid - 8);
      label(ctx, x0 - 6, Hy(1) + 4, '1', C['ink-3'], 10.5, 'right'); label(ctx, x0 - 6, Hy(0.707) + 4, '.707', C['ink-3'], 10.5, 'right');
      label(ctx, x0 - 6, Py(90) + 4, '90°', C['ink-3'], 10, 'right'); label(ctx, x0 - 6, Py(0) + 4, '0°', C['ink-3'], 10, 'right'); label(ctx, x0 - 6, Py(-90) + 4, '−90°', C['ink-3'], 10, 'right');
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let i = 0; i <= 120; i++) { const l = -2 + 4 * i / 120, H = Hof(Math.pow(10, l)); const x = X_(l), y = Hy(H.m); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i <= 120; i++) { const l = -2 + 4 * i / 120, H = Hof(Math.pow(10, l)); const x = X_(l), y = Py(H.p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X_(0), top); ctx.lineTo(X_(0), bot); ctx.moveTo(x0, Hy(0.707)); ctx.lineTo(x1, Hy(0.707)); ctx.stroke(); ctx.setLineDash([]);
      const H = Hof(Math.pow(10, lg)), xm = X_(lg);
      E.disc(ctx, xm, Hy(H.m), 6, C.accent, C.surface); E.disc(ctx, xm, Py(H.p), 5, C.ink, C.surface);
      labelCJK(ctx, x1, top + 10, '|H|（上）', C.accent, 12, 'right', '700'); labelCJK(ctx, x1, mid + 22, '相位 φ（下）', C.ink, 12, 'right', '700');
      setText('sw-w', X.g(Math.pow(10, lg), 3) + ' ω₀'); setText('sw-h', X.g(H.m, 3)); setText('sw-p', X.g(H.p, 3) + '°'); setText('sw-db', X.g(20 * log10(H.m), 3) + ' dB');
    } });
    bindRange('sw-l', v => X.g(Math.pow(10, v), 3) + ' ω₀', v => { lg = v; st.redraw(); });
    if (tb) tb.addEventListener('click', () => { hp = !hp; tb.textContent = hp ? '電路：RL，輸出在 L（Practice 14.1）' : '電路：RC，輸出在 C（Example 14.1）'; st.redraw(); });
  })();

  /* ── 14.3 dB 換算尺 ── */
  (function dbr() {
    const cv = document.getElementById('cv-db'); if (!cv) return;
    let lg = 1, pw = false;
    const tb = document.getElementById('db-kind');
    const st = Stage(cv, { animate: false, ratio: 0.32, minH: 170, maxH: 230, draw(ctx, w, h) {
      const k = pw ? 10 : 20, x0 = 30, x1 = w - 30, y = h * 0.5, X_ = l => x0 + (l + 3) / 6 * (x1 - x0);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      for (let l = -3; l <= 3; l++) {
        const x = X_(l); ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); ctx.stroke();
        label(ctx, x, y - 14, (l < 0 ? '1/' + Math.pow(10, -l) : String(Math.pow(10, l))) + '×', C.ink, 11, 'center', '700');
        label(ctx, x, y + 22, (l * k > 0 ? '+' : '') + l * k + ' dB', C['ink-3'], 11, 'center');
      }
      const xm = X_(lg); E.disc(ctx, xm, y, 8, C.accent, C.surface);
      labelCJK(ctx, Math.min(Math.max(xm, 80), w - 80), y + 46, X.g(Math.pow(10, lg), 4) + ' 倍 = ' + X.g(k * lg, 4) + ' dB', C.accent, 14, 'center', '700');
      setText('db-r', X.g(Math.pow(10, lg), 4) + ' 倍'); setText('db-v', X.g(k * lg, 4) + ' dB');
    } });
    bindRange('db-l', v => X.g(Math.pow(10, v), 3) + ' 倍', v => { lg = v; st.redraw(); });
    if (tb) tb.addEventListener('click', () => { pw = !pw; tb.textContent = pw ? '換算：功率比（× 10）' : '換算：電壓、電流比（× 20）'; st.redraw(); });
  })();

  /* ── Example 14.1 ── */
  liveExample('#ex-141', {
    title: '例題 · RC 電路的轉移函數（課本 Example 14.1）',
    ratio: 0.3, minH: 160, maxH: 210,
    givens: [
      { id: 'd1-r', label: 'R', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => X.g(v, 3) + ' kΩ' },
      { id: 'd1-c', label: 'C', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => X.g(v, 3) + ' μF' },
      { id: 'd1-w', label: '頻率 ω', min: 10, max: 100000, step: 10, value: 1000, fmt: v => X.g(v, 4) + ' rad/s' }
    ],
    compute: g => {
      const R = g['d1-r'] * 1e3, Cc = g['d1-c'] * 1e-6, w = g['d1-w'], w0 = 1 / (R * Cc), r = w / w0;
      const H = 1 / Math.sqrt(1 + r * r), ph = -Math.atan(r) / RAD;
      return { R, Cc, w, w0, r, H, ph, dB: 20 * log10(H) };
    },
    question: (g, r) => 'RC 電路（R = ' + X.g(r.R / 1000, 3) + ' kΩ、C = ' + X.g(r.Cc * 1e6, 3) + ' μF，輸出在電容上），求轉移函數 V<sub>o</sub>/V<sub>s</sub>，以及 ω = ' + X.g(r.w, 4) + ' rad/s 時的大小與相位。',
    questionEn: (g, r) => 'For the RC circuit with R = ' + X.g(r.R / 1000, 3) + ' kΩ and C = ' + X.g(r.Cc * 1e6, 3) + ' μF (output across C), obtain V<sub>o</sub>/V<sub>s</sub> and its magnitude and phase at ω = ' + X.g(r.w, 4) + ' rad/s.',
    steps: (g, r) => [
      { t: 'Step 1　分壓。', eq: 'H(ω) = 1/(1 + jωRC)' },
      { t: 'Step 2　ω<sub>0</sub>。', eq: 'ω<sub>0</sub> = 1/RC = ' + X.g(r.w0, 4) + ' rad/s；ω/ω<sub>0</sub> = ' + X.g(r.r, 4) },
      { t: 'Step 3　大小、相位。', eq: '|H| = 1/√(1 + ' + X.g(r.r * r.r, 4) + ') = ' + X.g(r.H, 4) + '；φ = −tan<sup>−1</sup>(' + X.g(r.r, 3) + ') = ' + X.g(r.ph, 4) + '°',
        after: r.r < 0.1 ? 'ω ≪ ω<sub>0</sub>：電容幾乎斷路，輸出 ≈ 輸入。' : r.r > 10 ? 'ω ≫ ω<sub>0</sub>：電容幾乎短路，輸出 ≈ ω<sub>0</sub>/ω 倍，越來越小。' : 'ω 在 ω<sub>0</sub> 附近：輸出開始明顯變小。' },
      { t: 'Step 4　換成 dB。', eq: '20 log<sub>10</sub>(' + X.g(r.H, 4) + ') = ' + X.g(r.dB, 4) + ' dB' }
    ],
    answer: (g, r) => 'H(ω) = 1/(1 + jωRC)；ω = ' + X.g(r.w, 4) + ' 時 |H| = ' + X.g(r.H, 4) + '、φ = ' + X.g(r.ph, 4) + '°（' + X.g(r.dB, 3) + ' dB）',
    draw: (ctx, w, h, g, r) => {
      const x0 = 40, x1 = w - 20, y0 = h - 22, top = 14, X_ = l => x0 + (l + 2) / 4 * (x1 - x0);
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 80; i++) { const l = -2 + 4 * i / 80, rr = Math.pow(10, l), H = 1 / Math.sqrt(1 + rr * rr); const x = X_(l), y = y0 - H * (y0 - top); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      const lm = Math.max(-2, Math.min(2, log10(r.r))); E.disc(ctx, X_(lm), y0 - r.H * (y0 - top), 6, C.ink, C.surface);
      label(ctx, X_(0), y0 + 14, 'ω₀', C['ink-3'], 11, 'center'); labelCJK(ctx, x1, top + 6, '|H| 對 ω（對數橫軸）', C['ink-3'], 11, 'right');
    }
  });

  /* ── Example 14.2 ── */
  liveExample('#ex-142', {
    title: '例題 · 電流增益的零點與極點（課本 Example 14.2）',
    ratio: 0.3, minH: 160, maxH: 210,
    givens: [
      { id: 'd2-r', label: 'R', min: 0.5, max: 10, step: 0.5, value: 4, fmt: v => v + ' Ω' },
      { id: 'd2-l', label: 'L', min: 0.5, max: 5, step: 0.5, value: 2, fmt: v => v + ' H' },
      { id: 'd2-c', label: 'C', min: 0.05, max: 2, step: 0.05, value: 0.5, fmt: v => X.g(v, 3) + ' F' }
    ],
    compute: g => {
      const R = g['d2-r'], L = g['d2-l'], Cc = g['d2-c'];
      /* I_o/I_i = sC(R + sL)/(LC s² + RC s + 1) → 首項係數化成 1：s(s + R/L)/(s² + (R/L)s + 1/LC) */
      const a = R / L, b = 1 / (L * Cc), disc = a * a - 4 * b;
      let poles, kind;
      if (Math.abs(disc) < 1e-9) { poles = [-a / 2, -a / 2]; kind = 'twice'; }
      else if (disc > 0) { poles = [(-a + Math.sqrt(disc)) / 2, (-a - Math.sqrt(disc)) / 2]; kind = 'real'; }
      else { poles = [X.c(-a / 2, Math.sqrt(-disc) / 2), X.c(-a / 2, -Math.sqrt(-disc) / 2)]; kind = 'cplx'; }
      return { R, L, Cc, a, b, disc, poles, kind };
    },
    question: (g, r) => '電流源 i<sub>i</sub> 接兩條並聯支路：' + r.R + ' Ω 串 ' + r.L + ' H、以及 ' + X.g(r.Cc, 3) + ' F（i<sub>o</sub> 流過電容）。求 I<sub>o</sub>/I<sub>i</sub> 與它的零點、極點。',
    questionEn: (g, r) => 'A current source i<sub>i</sub> feeds two parallel branches: ' + r.R + ' Ω in series with ' + r.L + ' H, and ' + X.g(r.Cc, 3) + ' F (i<sub>o</sub> through the capacitor). Calculate I<sub>o</sub>/I<sub>i</sub> and its poles and zeros.',
    steps: (g, r) => [
      { t: 'Step 1　分流。', eq: 'I<sub>o</sub>/I<sub>i</sub> = (R + sL)/(R + sL + 1/sC) = sC(R + sL)/(LCs<sup>2</sup> + RCs + 1)' },
      { t: 'Step 2　首項化成 1。', eq: 'H(s) = s(s + ' + X.g(r.a, 4) + ')/(s<sup>2</sup> + ' + X.g(r.a, 4) + 's + ' + X.g(r.b, 4) + ')' },
      { t: 'Step 3　零點。', eq: 's = 0、s = −R/L = ' + X.g(-r.a, 4) },
      { t: 'Step 4　極點。', eq: r.kind === 'cplx' ? 's = ' + X.rect(r.poles[0], 3) + '、' + X.rect(r.poles[1], 3) : 's = ' + X.g(r.poles[0], 4) + '、' + X.g(r.poles[1], 4),
        after: r.kind === 'twice' ? '判別式剛好為 0 → 二重極點（課本的情況）。' : r.kind === 'real' ? '判別式 &gt; 0 → 兩個不同的實數極點。' : '判別式 &lt; 0 → 一對共軛複數極點（CH8 的欠阻尼）。' }
    ],
    answer: (g, r) => '零點 0、' + X.g(-r.a, 4) + '；極點 ' + (r.kind === 'cplx' ? X.rect(r.poles[0], 3) + '、' + X.rect(r.poles[1], 3) : X.g(r.poles[0], 4) + '、' + X.g(r.poles[1], 4)),
    draw: (ctx, w, h, g, r) => {
      /* s 平面：× 極點、○ 零點 */
      const cx = w * 0.62, cy = h / 2, span = Math.max(3, r.a * 1.2, ...(r.kind === 'cplx' ? [Math.abs(r.poles[0].im) * 1.3] : r.poles.map(p => Math.abs(p) * 1.1))), sc = Math.min(w * 0.55, h - 20) / 2 / span;
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(14, cy); ctx.lineTo(w - 10, cy); ctx.moveTo(cx, 6); ctx.lineTo(cx, h - 6); ctx.stroke();
      labelCJK(ctx, w - 12, cy - 6, 'σ', C['ink-3'], 12, 'right'); labelCJK(ctx, cx + 6, 14, 'jω', C['ink-3'], 12, 'left');
      const ring = (x, y) => { ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.stroke(); };
      const cross = (x, y) => { ctx.strokeStyle = C.ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6); ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6); ctx.stroke(); };
      ring(cx, cy); ring(cx - r.a * sc, cy);
      r.poles.forEach((p, i) => { const re = typeof p === 'number' ? p : p.re, im = typeof p === 'number' ? 0 : p.im; cross(cx + re * sc, cy - im * sc + (r.kind === 'twice' ? (i ? 5 : -5) : 0)); });
      labelCJK(ctx, 12, 18, '○ 零點　× 極點', C.ink, 12, 'left', '700');
    }
  });

  /* ── Problem 14.7 型：dB → 倍數 ── */
  liveExample('#ex-db', {
    title: '例題 · 分貝換回大小（照課本 Problem 14.7 的型）',
    ratio: 0.22, minH: 120, maxH: 170,
    givens: [{ id: 'd3-db', label: 'H<sub>dB</sub>', min: -60, max: 110, step: 0.1, value: -6.2, fmt: v => X.g(v, 4) + ' dB' }],
    compute: g => { const d = g['d3-db'], m = Math.pow(10, d / 20); return { d, m }; },
    question: (g, r) => '已知 H<sub>dB</sub> = ' + X.g(r.d, 4) + ' dB，求 |H(ω)|。',
    questionEn: (g, r) => 'Calculate |H(ω)| if H<sub>dB</sub> equals ' + X.g(r.d, 4) + ' dB.',
    steps: (g, r) => [
      { t: 'Step 1　倒推。', eq: 'H<sub>dB</sub> = 20 log<sub>10</sub>|H| ⟹ |H| = 10<sup>H<sub>dB</sub>/20</sup> = 10<sup>' + X.g(r.d / 20, 4) + '</sup>' },
      { t: 'Step 2　算。', eq: '|H| = ' + X.g(r.m, 4), after: r.d > 0 ? '正的 dB：放大。' : r.d < 0 ? '負的 dB：衰減（比 1 小）。' : '0 dB：剛好 1 倍。' }
    ],
    answer: (g, r) => '|H| = ' + X.g(r.m, 4),
    draw: (ctx, w, h, g, r) => {
      const x0 = 30, x1 = w - 30, y = h / 2, X_ = d => x0 + (d + 60) / 170 * (x1 - x0);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      [-60, -40, -20, 0, 20, 40, 60, 80, 100].forEach(d => { const x = X_(d); ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke(); label(ctx, x, y + 18, d + '', C['ink-3'], 10, 'center'); });
      E.disc(ctx, X_(r.d), y, 7, C.accent, C.surface); labelCJK(ctx, Math.min(Math.max(X_(r.d), 60), w - 60), y - 14, '|H| = ' + X.g(r.m, 4), C.accent, 13, 'center', '700');
    }
  });

  if (window.__ch12Quiz) window.__ch12Quiz([
    { zh: '頻率響應是在改變輸入的什麼？', en: 'The frequency response is obtained by varying the source’s:', o: [['頻率', 'frequency'], ['振幅', 'amplitude'], ['相位', 'phase'], ['內阻', 'internal resistance']], a: 0, e: '振幅固定、掃頻率。' },
    { zh: 'H(ω) 的定義？', en: 'H(ω) is defined as:', o: [['輸出相量 / 輸入相量', 'output phasor / input phasor'], ['輸入 / 輸出', 'input / output'], ['電壓 × 電流', 'voltage × current'], ['功率 / 頻率', 'power / frequency']], a: 0, e: '式 14.1。' },
    { zh: 'V<sub>o</sub>/I<sub>i</sub> 叫？', en: 'V<sub>o</sub>/I<sub>i</sub> is called:', o: [['轉移阻抗', 'transfer impedance'], ['轉移導納', 'transfer admittance'], ['電壓增益', 'voltage gain'], ['電流增益', 'current gain']], a: 0, e: '電壓除電流 = 阻抗。' },
    { zh: 'H = 1/(1 + jωRC) 在 ω = 1/RC 時 |H| = ？', en: 'For H = 1/(1 + jωRC), |H| at ω = 1/RC is:', o: [['0.707', '0.707'], ['1', '1'], ['0.5', '0.5'], ['0', '0']], a: 0, e: '1/√2，相位 −45°。' },
    { zh: '零點是？', en: 'A zero of H is:', o: [['讓分子為 0 的 s', 'a root of the numerator'], ['讓分母為 0 的 s', 'a root of the denominator'], ['H 的最大值', 'the maximum of H'], ['ω = 0', 'ω = 0']], a: 0, e: '這時 H = 0。' },
    { zh: 'H(s) = 10(s + 1)/[(s + 2)(s + 3)] 的零點？', en: 'The zero of H(s) = 10(s + 1)/[(s + 2)(s + 3)] is at:', o: [['−1', '−1'], ['−2', '−2'], ['−3', '−3'], ['10', '10']], a: 0, e: 'Review Question 14.1。' },
    { zh: '功率變兩倍是幾 dB？', en: 'Doubling the power corresponds to:', o: [['≈ 3 dB', '≈ 3 dB'], ['≈ 6 dB', '≈ 6 dB'], ['2 dB', '2 dB'], ['20 dB', '20 dB']], a: 0, e: '10 log 2。' },
    { zh: '電壓增益 100 倍是幾 dB？', en: 'A voltage gain of 100 is:', o: [['40 dB', '40 dB'], ['20 dB', '20 dB'], ['100 dB', '100 dB'], ['2 dB', '2 dB']], a: 0, e: '20 log 100 = 40。' },
    { zh: '電壓、電流比換成 dB 要乘？', en: 'For voltage or current ratios, the dB factor is:', o: [['20', '20'], ['10', '10'], ['2', '2'], ['1', '1']], a: 0, e: '功率 ∝ V²。' },
    { zh: '−6.2 dB 大約是幾倍？', en: '−6.2 dB is about:', o: [['0.49', '0.49'], ['0.62', '0.62'], ['2', '2'], ['−6.2', '−6.2']], a: 0, e: '10<sup>−0.31</sup>（Problem 14.7(b)）。' }
  ], ['期中考範圍讀完了！去 CH13、CH14 章末練習題刷題。', '再拉一下 dB 換算尺，把 20 dB、−3 dB 這幾個記熟。', '先回故事模式看「大小與相位」那幾幕，再做一次。']);
})();
