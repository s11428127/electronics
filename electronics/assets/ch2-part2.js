/* ============================================================
   電子學 CH2 PART 2 — 電池充電器、中間抽頭全波、橋式全波、比較與設計
   Neamen 4e, Ch.2 §2.1；課程原講義 CH2 PART 2（上課板書 11/2～11/3 + 2.1.2 Full-wave）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, bindRange, lerp, TAU } = E;
  const { setHTML, dot, wide, dash, trace } = window.__c2.tools;
  const D2R = 180 / Math.PI;

  /* ══ 01 電池充電器（半波 + 電池） ══ */
  (function chg() {
    const cv = document.getElementById('cv-chg'); if (!cv) return;
    let VM = 24, VB = 12, VG = 0.6, ph = 0;
    const R = 100;
    const calc = () => {
      const th = VB + VG, on = VM > th, t1 = on ? Math.asin(th / VM) : 0;
      return { th, on, t1, t2: Math.PI - t1, imax: on ? (VM - th) / R * 1000 : 0, frac: on ? (Math.PI - 2 * t1) / TAU : 0, piv: VB + VM };
    };
    Stage(cv, { ratio: w => wide(w) ? 0.5 : 1.0, minH: 280, maxH: 440, draw(ctx, w, h, dt) {
      ph = (ph + dt * 0.12) % 1;
      const r = calc(), x0 = Math.max(56, w * 0.12), x1 = w * 0.96, A = h * 0.2 / 40;
      const ym1 = h * 0.3, ym2 = h * 0.8, A2 = h * 0.28 / Math.max(1, (VM - r.th) / R * 1000 || 100);
      const vs = u => VM * Math.sin(2 * TAU * u);
      dash(ctx, x0, ym1, x1, ym1, C['line-soft'] || C.line);
      /* V_B + V_γ 門檻 */
      ctx.save(); ctx.strokeStyle = C['q-react'] || C.warn; ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(x0, ym1 - A * r.th); ctx.lineTo(x1, ym1 - A * r.th); ctx.stroke(); ctx.restore();
      label(ctx, x1 - 2, ym1 - A * r.th - 9, 'V<sub>B</sub> + V<sub>γ</sub> = ' + r.th.toFixed(1) + ' V', C['q-react'] || C.warn, 10.5, 'right', '700');
      /* 導通區塗色 */
      if (r.on) {
        for (let c = 0; c < 2; c++) {
          ctx.fillStyle = (C['p-real-w'] || C['surface-2']);
          ctx.fillRect(lerp(x0, x1, c * 0.5 + r.t1 / (2 * TAU)), h * 0.04, lerp(x0, x1, c * 0.5 + r.t2 / (2 * TAU)) - lerp(x0, x1, c * 0.5 + r.t1 / (2 * TAU)), h * 0.92);
        }
      }
      trace(ctx, x0, x1, ym1, A, vs, C.ink, 2.2);
      labelCJK(ctx, x0 - 8, ym1, 'v<sub>S</sub>', C.ink, 12, 'right', '700');
      /* i_D */
      dash(ctx, x0, ym2, x1, ym2, C['line-soft'] || C.line);
      labelCJK(ctx, x0 - 8, ym2 - 10, 'i<sub>D</sub>', C.accent, 12, 'right', '700');
      trace(ctx, x0, x1, ym2 + h * 0.1, A2, u => Math.max(0, (vs(u) - r.th) / R * 1000), C.accent, 2.6);
      if (r.on) label(ctx, lerp(x0, x1, 0.25), ym2 + h * 0.1 - A2 * r.imax - 8, r.imax.toFixed(0) + ' mA', C.accent, 10.5, 'center', '700');
      const nowv = vs(ph); dot(ctx, lerp(x0, x1, ph), ym1 - A * nowv, 5, C.ink);
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, ph), h * 0.03); ctx.lineTo(lerp(x0, x1, ph), h * 0.96); ctx.stroke();
    } });
    function msg() {
      const r = calc();
      setHTML('cg-a', r.on ? (r.t1 * D2R).toFixed(1) + '° ～ ' + (r.t2 * D2R).toFixed(1) + '°' : '不導通');
      setHTML('cg-f', (r.frac * 100).toFixed(1) + ' %');
      setHTML('cg-i', r.imax.toFixed(0) + ' mA');
      setHTML('cg-p', r.piv.toFixed(1) + ' V');
      setHTML('cg-msg', r.on ? '二極體要等 v<sub>S</sub> 爬過 <b>V<sub>B</sub> + V<sub>γ</sub> = ' + r.th.toFixed(1) + ' V</b> 才通，通的時間比半個週期還短（' + (r.frac * 100).toFixed(1) + ' %）。電池越大、門檻越高、導通越短。'
        : '輸入峰值還沒超過 V<sub>B</sub> + V<sub>γ</sub>，電池充不到電。');
    }
    bindRange('cg-m', x => x.toFixed(0) + ' V', x => { VM = x; msg(); });
    bindRange('cg-b', x => x.toFixed(1) + ' V', x => { VB = x; msg(); });
    bindRange('cg-g', x => x.toFixed(2) + ' V', x => { VG = x; msg(); });
  })();

  /* ══ 02、03 全波：中間抽頭 / 橋式 ══ */
  function fullwave(id, p, nDiode) {
    const cv = document.getElementById(id); if (!cv) return;
    let VM = 10, VG = 0.7, ph = 0;
    const out = v => Math.max(0, Math.abs(v) - nDiode * VG);
    Stage(cv, { ratio: w => wide(w) ? 0.46 : 0.95, minH: 270, maxH: 420, draw(ctx, w, h, dt) {
      ph = (ph + dt * 0.12) % 1;
      const x0 = Math.max(56, w * 0.12), x1 = w * 0.96, rows = 2, rh = h * 0.92 / rows;
      const vs = u => VM * Math.sin(2 * TAU * u);
      const A = rh * 0.42 / VM;
      [['v<sub>S</sub>', vs, C.ink], ['v<sub>O</sub>', u => out(vs(u)), C.accent]].forEach((f, k) => {
        const ym = h * 0.04 + k * rh + rh * (k ? 0.82 : 0.5);
        dash(ctx, x0, ym, x1, ym, C['line-soft'] || C.line);
        labelCJK(ctx, x0 - 8, ym - (k ? 20 : 0), f[0], f[2], 12, 'right', '700');
        if (k) { trace(ctx, x0, x1, ym, A, vs, C['ink-3'], 1.1, [4, 4]); trace(ctx, x0, x1, ym, A, f[1], f[2], 2.6); label(ctx, x0 + 4, ym - A * (VM - nDiode * VG) - 9, '峰值 ' + (VM - nDiode * VG).toFixed(1) + ' V', C.accent, 10.5, 'left', '700'); }
        else trace(ctx, x0, x1, ym, A, f[1], f[2], 2.2);
        const yv = ym - A * f[1](ph); dot(ctx, lerp(x0, x1, ph), yv, 5, f[2]);
      });
      /* 不導通區：|v_S| < nVγ 的地方塗淺色 */
      const dz = Math.asin(Math.min(1, nDiode * VG / VM)) / (2 * TAU);
      for (let c = 0; c <= 4; c++) { const zc = c * 0.25, xa = lerp(x0, x1, Math.max(0, zc - dz)), xb = lerp(x0, x1, Math.min(1, zc + dz)); ctx.fillStyle = 'rgba(180,120,40,0.18)'; ctx.fillRect(xa, h * 0.5, xb - xa, h * 0.46); }
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, ph), h * 0.03); ctx.lineTo(lerp(x0, x1, ph), h * 0.96); ctx.stroke();
    } });
    function msg() {
      const pk = VM - nDiode * VG, piv = nDiode === 1 ? 2 * VM - VG : VM - VG;
      setHTML(p + '-pk', Math.max(0, pk).toFixed(2) + ' V');
      setHTML(p + '-dz', '±' + (nDiode * VG).toFixed(2) + ' V');
      setHTML(p + '-piv', piv.toFixed(2) + ' V');
      setHTML(p + '-msg', VM <= nDiode * VG ? '輸入峰值不到 ' + nDiode + ' 個 V<sub>γ</sub>，完全沒輸出。' :
        (nDiode === 1 ? '每一瞬間<b>只有一顆</b>二極體導通（上半或下半），所以只吃 1 個 V<sub>γ</sub>：v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>。' : '每一瞬間電流<b>經過兩顆</b>二極體（一進一出），所以吃 2 個 V<sub>γ</sub>：v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>。') +
        ' 淺色帶是「不導通區」：|v<sub>S</sub>| 還沒爬過 ' + (nDiode * VG).toFixed(2) + ' V 時輸出是 0。');
    }
    bindRange(p + '-m', x => x.toFixed(1) + ' V', x => { VM = x; msg(); });
    bindRange(p + '-g', x => x.toFixed(2) + ' V', x => { VG = x; msg(); });
  }
  fullwave('cv-fwc', 'fc', 1);
  fullwave('cv-brg', 'bg', 2);

  /* ══ 04 比較：同樣輸出，兩種電路要多少 ══ */
  (function cmp() {
    const cv = document.getElementById('cv-cmp'); if (!cv) return;
    let VO = 9, VG = 0.7, st;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.34 : 0.8, minH: 200, maxH: 320, draw(ctx, w, h) {
      const ct = { vs: VO + VG, piv: 2 * (VO + VG) - VG }, br = { vs: VO + 2 * VG, piv: VO + VG };
      const mx = Math.max(ct.piv, br.vs, ct.vs, br.piv), x0 = Math.max(w * 0.34, 130), x1 = w * 0.9;
      const rows = [['中間抽頭 次級每半邊峰值', ct.vs, C.ink], ['橋式 次級峰值', br.vs, C.accent], ['中間抽頭 PIV', ct.piv, C.ink], ['橋式 PIV', br.piv, C.accent]];
      rows.forEach(([nm, v, col], k) => {
        const y = h * ((k + 0.6) / 4.3), len = Math.max(2, (x1 - x0) * v / mx);
        ctx.fillStyle = col; ctx.globalAlpha = k >= 2 ? 0.55 : 1; ctx.fillRect(x0, y - 8, len, 16); ctx.globalAlpha = 1;
        labelCJK(ctx, x0 - 8, y, nm, col, 10.5, 'right', '700');
        labelCJK(ctx, Math.min(x0 + len + 6, w - 60), y, v.toFixed(2) + ' V', col, 11, 'left', '700');
      });
    } });
    function msg() {
      const ct = { vs: VO + VG, piv: 2 * (VO + VG) - VG }, br = { vs: VO + 2 * VG, piv: VO + VG };
      setHTML('cp-msg', '同樣要 ' + VO.toFixed(1) + ' V 峰值輸出：橋式次級峰值 ' + br.vs.toFixed(2) + ' V（多吃一個 V<sub>γ</sub>），但 PIV 只要 ' + br.piv.toFixed(2) + ' V，比中間抽頭的 ' + ct.piv.toFixed(2) + ' V 小一半左右。');
      st.redraw();
    }
    bindRange('cp-o', x => x.toFixed(1) + ' V', x => { VO = x; msg(); });
    bindRange('cp-g', x => x.toFixed(2) + ' V', x => { VG = x; msg(); });
  })();
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, lerp, liveExample } = E;
  const { bars } = window.__c2.tools;
  const f1 = x => x.toFixed(1), f2 = x => x.toFixed(2), f0 = x => x.toFixed(0);
  const D = 180 / Math.PI;

  /* 01 Example 2.1 */
  liveExample('#ex-chg', {
    title: '例題 2.1 · 電池充電器（課本原題）',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'e1-m', label: 'v<sub>S</sub> 峰值 V<sub>M</sub>', min: 5, max: 40, step: 1, value: 24, fmt: v => f0(v) + ' V' },
      { id: 'e1-b', label: '電池 V<sub>B</sub>', min: 0, max: 30, step: 1, value: 12, fmt: v => f0(v) + ' V' },
      { id: 'e1-r', label: 'R', min: 20, max: 500, step: 10, value: 100, fmt: v => f0(v) + ' Ω' },
      { id: 'e1-g', label: 'V<sub>γ</sub>', min: 0.4, max: 0.9, step: 0.1, value: 0.6, fmt: v => f1(v) + ' V' }
    ],
    compute: g => { const M = g['e1-m'], B = g['e1-b'], R = g['e1-r'], Vg = g['e1-g'], th = B + Vg, on = M > th, t1 = on ? Math.asin(th / M) * D : 0; return { M, B, R, Vg, th, on, t1, t2: 180 - t1, i: on ? (M - th) / R * 1000 : 0, frac: on ? (180 - 2 * t1) / 360 : 0, piv: B + M }; },
    question: (g, r) => '電池充電器：v<sub>S</sub> = <b>' + f0(r.M) + ' sin ωt</b> V，電池 V<sub>B</sub> = <b>' + f0(r.B) + ' V</b>，R = <b>' + f0(r.R) + ' Ω</b>，二極體 V<sub>γ</sub> = ' + f1(r.Vg) + ' V。求 (a) 最大電流；(b) 二極體導通的角度範圍；(c) 導通時間佔一週期的百分比；(d) PIV。',
    questionEn: (g, r) => 'Battery charger: v<sub>S</sub> = ' + f0(r.M) + ' sin ωt V, V<sub>B</sub> = ' + f0(r.B) + ' V, R = ' + f0(r.R) + ' Ω, V<sub>γ</sub> = ' + f1(r.Vg) + ' V. Find (a) the peak current, (b) the conduction angles, (c) the percentage of each cycle the diode conducts, (d) the PIV.',
    steps: (g, r) => [
      { t: 'Step 1　什麼時候導通。', note: '要同時推開二極體（V<sub>γ</sub>）和電池（V<sub>B</sub>）。', eq: 'v<sub>S</sub> &gt; V<sub>B</sub> + V<sub>γ</sub> = ' + f1(r.th) + ' V' },
      { t: 'Step 2　(a) 最大電流在 v<sub>S</sub> 峰值。', eq: r.on ? 'i<sub>D,max</sub> = (V<sub>M</sub> − V<sub>γ</sub> − V<sub>B</sub>)/R = (' + f0(r.M) + ' − ' + f1(r.Vg) + ' − ' + f0(r.B) + ')/' + f0(r.R) + ' = ' + f0(r.i) + ' mA' : '峰值 ' + f0(r.M) + ' V 沒超過 ' + f1(r.th) + ' V，沒有電流。' },
      { t: 'Step 3　(b) 導通角。', note: '解 V<sub>M</sub> sin ωt<sub>1</sub> = V<sub>B</sub> + V<sub>γ</sub>；sin 對 90° 左右對稱，所以 ωt<sub>2</sub> = 180° − ωt<sub>1</sub>。', eq: r.on ? 'ωt<sub>1</sub> = sin<sup>−1</sup>(' + f1(r.th) + '/' + f0(r.M) + ') = ' + f1(r.t1) + '°，ωt<sub>2</sub> = ' + f1(r.t2) + '°' : '—' },
      { t: 'Step 4　(c) 佔多少比例。', eq: r.on ? '(' + f1(r.t2) + ' − ' + f1(r.t1) + ')/360 = ' + (r.frac * 100).toFixed(1) + ' %' : '0 %', note: r.frac > 0 && r.frac < 0.3 ? '導通時間不到三成：電池越大，門檻越高，二極體越晚通、越早關。' : '' },
      { t: 'Step 5　(d) PIV。', note: '負半週谷底：二極體一邊是 −V<sub>M</sub>，另一邊是電池 +V<sub>B</sub>，兩個疊起來。', eq: 'PIV = V<sub>B</sub> + V<sub>M</sub> = ' + f0(r.B) + ' + ' + f0(r.M) + ' = ' + f0(r.piv) + ' V' }
    ],
    answer: (g, r) => r.on ? '(a) ' + f0(r.i) + ' mA (b) ' + f1(r.t1) + '°～' + f1(r.t2) + '° (c) ' + (r.frac * 100).toFixed(1) + '% (d) ' + f0(r.piv) + ' V' : '峰值沒超過 V<sub>B</sub> + V<sub>γ</sub>，不導通；PIV = ' + f0(r.piv) + ' V',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(40, w * 0.08), x1 = w * 0.96, ym = h * 0.5, A = h * 0.4 / r.M;
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.4; ctx.beginPath();
      for (let k = 0; k <= 160; k++) { const u = k / 160, v = r.M * Math.sin(u * 2 * Math.PI); k ? ctx.lineTo(lerp(x0, x1, u), ym - A * v) : ctx.moveTo(lerp(x0, x1, u), ym - A * v); } ctx.stroke();
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = C['q-react'] || C.warn; ctx.beginPath(); ctx.moveTo(x0, ym - A * r.th); ctx.lineTo(x1, ym - A * r.th); ctx.stroke(); ctx.restore();
      label(ctx, x1, ym - A * r.th - 8, 'V<sub>B</sub> + V<sub>γ</sub>', C['q-react'] || C.warn, 10, 'right');
      if (r.on) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 160; k++) { const u = k / 160, th = u * 360; if (th < r.t1 || th > r.t2) continue; const v = r.M * Math.sin(u * 2 * Math.PI); (k && th > r.t1 + 2) ? ctx.lineTo(lerp(x0, x1, u), ym - A * v) : ctx.moveTo(lerp(x0, x1, u), ym - A * v); } ctx.stroke(); }
    }
  });

  /* 02 中間抽頭 */
  liveExample('#ex-fwc', {
    title: '例題 · 中間抽頭全波：給次級，算輸出與 PIV',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'e2-m', label: '每半邊次級峰值 V<sub>M</sub>', min: 2, max: 40, step: 0.5, value: 10, fmt: v => f1(v) + ' V' },
      { id: 'e2-g', label: 'V<sub>γ</sub>', min: 0.5, max: 0.8, step: 0.1, value: 0.7, fmt: v => f1(v) + ' V' }
    ],
    compute: g => { const M = g['e2-m'], Vg = g['e2-g']; return { M, Vg, pk: M - Vg, piv: 2 * M - Vg }; },
    question: (g, r) => '中間抽頭全波整流（理想接地在中間抽頭），上下<b>每半邊</b>次級的峰值都是 V<sub>M</sub> = <b>' + f1(r.M) + ' V</b>，V<sub>γ</sub> = ' + f1(r.Vg) + ' V。求 v<sub>O</sub> 的峰值與每顆二極體的 PIV。',
    questionEn: (g, r) => 'A center-tapped full-wave rectifier has V<sub>M</sub> = ' + f1(r.M) + ' V peak on each half of the secondary and V<sub>γ</sub> = ' + f1(r.Vg) + ' V. Find the peak output voltage and the PIV of each diode.',
    steps: (g, r) => [
      { t: 'Step 1　誰在導通。', note: '正半週上面那顆通、下半邊那顆關；負半週反過來。每個瞬間只有一顆在通。', eq: 'v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>' },
      { t: 'Step 2　輸出峰值。', eq: 'V<sub>O,peak</sub> = ' + f1(r.M) + ' − ' + f1(r.Vg) + ' = ' + f2(r.pk) + ' V' },
      { t: 'Step 3　PIV：看關著的那一顆。', note: '導通的那半邊把輸出推到 V<sub>M</sub> − V<sub>γ</sub>；關著的那半邊自己是 −V<sub>M</sub>。兩個差多少，二極體就扛多少。', eq: 'PIV = V<sub>M</sub> + (V<sub>M</sub> − V<sub>γ</sub>) = 2V<sub>M</sub> − V<sub>γ</sub> = ' + f2(r.piv) + ' V' }
    ],
    answer: (g, r) => 'v<sub>O</sub> 峰值 ' + f2(r.pk) + ' V；PIV = ' + f2(r.piv) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['每半邊 V<sub>M</sub>', r.M, C.ink], ['輸出峰值', r.pk, C.accent], ['PIV', r.piv, C['q-react'] || C.warn]], v => f2(v) + ' V')
  });

  /* 03 橋式 */
  liveExample('#ex-brg', {
    title: '例題 · 橋式全波：給次級，算輸出與 PIV',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'e3-m', label: '次級峰值 V<sub>M</sub>', min: 2, max: 40, step: 0.5, value: 10, fmt: v => f1(v) + ' V' },
      { id: 'e3-g', label: 'V<sub>γ</sub>', min: 0.5, max: 0.8, step: 0.1, value: 0.7, fmt: v => f1(v) + ' V' }
    ],
    compute: g => { const M = g['e3-m'], Vg = g['e3-g']; return { M, Vg, pk: M - 2 * Vg, piv: M - Vg, dz: 2 * Vg }; },
    question: (g, r) => '橋式全波整流，次級峰值 V<sub>M</sub> = <b>' + f1(r.M) + ' V</b>，V<sub>γ</sub> = ' + f1(r.Vg) + ' V。求 v<sub>O</sub> 峰值、不導通區範圍、每顆二極體的 PIV。',
    questionEn: (g, r) => 'A bridge full-wave rectifier has a secondary peak of ' + f1(r.M) + ' V and V<sub>γ</sub> = ' + f1(r.Vg) + ' V. Find the peak output, the dead zone, and the PIV of each diode.',
    steps: (g, r) => [
      { t: 'Step 1　電流走過幾顆。', note: '一進一出：每個瞬間有兩顆二極體串在電流路徑上。', eq: 'v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>' },
      { t: 'Step 2　輸出峰值與不導通區。', note: '|v<sub>S</sub>| 要先爬過 2V<sub>γ</sub> 才有輸出。', eq: 'V<sub>O,peak</sub> = ' + f1(r.M) + ' − ' + f1(2 * r.Vg) + ' = ' + f2(r.pk) + ' V；不導通區 |v<sub>S</sub>| &lt; ' + f1(r.dz) + ' V' },
      { t: 'Step 3　PIV。', note: '關著的那顆，一邊接輸出 (+V<sub>M</sub> − 2V<sub>γ</sub>) 附近，另一邊被二次側拉到 −V<sub>M</sub>，扣掉旁邊導通那顆的 V<sub>γ</sub>。', eq: 'PIV = V<sub>M</sub> − V<sub>γ</sub> = ' + f2(r.piv) + ' V' }
    ],
    answer: (g, r) => 'v<sub>O</sub> 峰值 ' + f2(r.pk) + ' V；不導通區 ±' + f1(r.dz) + ' V；PIV = ' + f2(r.piv) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['次級 V<sub>M</sub>', r.M, C.ink], ['輸出峰值', r.pk, C.accent], ['PIV', r.piv, C['q-react'] || C.warn]], v => f2(v) + ' V')
  });

  /* 04 Example 2.2 */
  liveExample('#ex-cmp', {
    title: '例題 2.2 · 同樣的輸出，兩種電路要什麼變壓器（課本原題）',
    ratio: 0.34, minH: 160, maxH: 220,
    givens: [
      { id: 'e4-o', label: '要的輸出峰值 V<sub>O</sub>', min: 3, max: 30, step: 0.5, value: 9, fmt: v => f1(v) + ' V' },
      { id: 'e4-i', label: '市電 rms', min: 100, max: 240, step: 10, value: 120, fmt: v => f0(v) + ' V' },
      { id: 'e4-g', label: 'V<sub>γ</sub>', min: 0.5, max: 0.8, step: 0.1, value: 0.7, fmt: v => f1(v) + ' V' }
    ],
    compute: g => {
      const O = g['e4-o'], I = g['e4-i'], Vg = g['e4-g'], Ip = I * Math.SQRT2;
      const ct = { vs: O + Vg, piv: 2 * (O + Vg) - Vg }, br = { vs: O + 2 * Vg, piv: O + Vg };
      ct.rms = ct.vs / Math.SQRT2; br.rms = br.vs / Math.SQRT2; ct.n = Ip / ct.vs; br.n = Ip / br.vs;
      return { O, I, Vg, Ip, ct, br };
    },
    question: (g, r) => '市電 <b>' + f0(r.I) + ' V（rms）</b>，要整流出峰值 <b>' + f1(r.O) + ' V</b> 的輸出，二極體 V<sub>γ</sub> = ' + f1(r.Vg) + ' V。分別用<b>中間抽頭</b>與<b>橋式</b>全波整流，求 (a) 次級最大電壓；(b) 次級 rms；(c) 匝數比 N<sub>1</sub>/N<sub>2</sub>；(d) 每顆二極體的 PIV。（中間抽頭的 N<sub>2</sub> 取「半邊」。）',
    questionEn: (g, r) => 'The line is ' + f0(r.I) + ' V (rms). A peak output of ' + f1(r.O) + ' V is required with V<sub>γ</sub> = ' + f1(r.Vg) + ' V. For (i) a center-tapped and (ii) a bridge full-wave rectifier, find the maximum secondary voltage, its rms value, the turns ratio N<sub>1</sub>/N<sub>2</sub>, and the diode PIV.',
    steps: (g, r) => [
      { t: 'Step 1　(a) 次級最大電壓。', note: '輸出 = 次級 − 導通路徑上的 V<sub>γ</sub>。中間抽頭 1 顆、橋式 2 顆。', eq: '中間抽頭：' + f1(r.O) + ' + ' + f1(r.Vg) + ' = <b>' + f1(r.ct.vs) + ' V</b>　｜　橋式：' + f1(r.O) + ' + ' + f1(2 * r.Vg) + ' = <b>' + f1(r.br.vs) + ' V</b>' },
      { t: 'Step 2　(b) rms。', note: '峰值 ÷ √2。', eq: f1(r.ct.vs) + '/√2 = <b>' + f2(r.ct.rms) + ' V</b>　｜　' + f1(r.br.vs) + '/√2 = <b>' + f2(r.br.rms) + ' V</b>' },
      { t: 'Step 3　(c) 匝數比。', note: '市電峰值 ' + f0(r.I) + '√2 = ' + f1(r.Ip) + ' V，除以次級峰值。', eq: '中間抽頭：' + f1(r.Ip) + '/' + f1(r.ct.vs) + ' = <b>' + f1(r.ct.n) + '</b>　｜　橋式：' + f1(r.Ip) + '/' + f1(r.br.vs) + ' = <b>' + f1(r.br.n) + '</b>' },
      { t: 'Step 4　(d) PIV。', note: '中間抽頭 2V<sub>M</sub> − V<sub>γ</sub>；橋式 V<sub>M</sub> − V<sub>γ</sub>（V<sub>M</sub> 是各自的次級峰值）。', eq: '中間抽頭：<b>' + f1(r.ct.piv) + ' V</b>　｜　橋式：<b>' + f1(r.br.piv) + ' V</b>' },
      { t: 'Step 5　比一比。', note: r.ct.piv > 1.5 * r.br.piv ? '橋式 PIV 約只有中間抽頭的一半：二極體不用耐那麼高的壓，缺點是要 4 顆、而且多吃一個 V<sub>γ</sub>。' : '' }
    ],
    answer: (g, r) => '中間抽頭：' + f1(r.ct.vs) + ' V、' + f2(r.ct.rms) + ' V rms、' + f1(r.ct.n) + '、PIV ' + f1(r.ct.piv) + ' V；橋式：' + f1(r.br.vs) + ' V、' + f2(r.br.rms) + ' V rms、' + f1(r.br.n) + '、PIV ' + f1(r.br.piv) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['中間抽頭 次級', r.ct.vs, C.ink], ['橋式 次級', r.br.vs, C.accent], ['中間抽頭 PIV', r.ct.piv, C['ink-3']], ['橋式 PIV', r.br.piv, C['q-react'] || C.warn]], v => f1(v) + ' V')
  });
})();

/* ============================================================
   小測驗
   ============================================================ */
window.__c2.quiz([
  { zh: '電池充電器（半波）中，二極體什麼時候導通？', en: 'In the half-wave battery charger, when does the diode conduct?',
    o: [['v<sub>S</sub> &gt; V<sub>B</sub> + V<sub>γ</sub>', 'v<sub>S</sub> &gt; V<sub>B</sub> + V<sub>γ</sub>'], ['v<sub>S</sub> &gt; V<sub>γ</sub>', 'v<sub>S</sub> &gt; V<sub>γ</sub>'], ['v<sub>S</sub> &gt; V<sub>B</sub>', 'v<sub>S</sub> &gt; V<sub>B</sub>'], ['v<sub>S</sub> &gt; 0', 'v<sub>S</sub> &gt; 0']], a: 0,
    e: '要同時推開二極體 (V<sub>γ</sub>) 和電池 (V<sub>B</sub>)。' },
  { zh: '電池充電器的導通起始角 ωt<sub>1</sub> = ？', en: 'What is the starting conduction angle ωt<sub>1</sub> of the charger?',
    o: [['sin<sup>−1</sup>[(V<sub>B</sub>+V<sub>γ</sub>)/V<sub>M</sub>]', 'sin<sup>−1</sup>[(V<sub>B</sub>+V<sub>γ</sub>)/V<sub>M</sub>]'], ['sin<sup>−1</sup>(V<sub>γ</sub>/V<sub>M</sub>)', 'sin<sup>−1</sup>(V<sub>γ</sub>/V<sub>M</sub>)'], ['cos<sup>−1</sup>[(V<sub>B</sub>+V<sub>γ</sub>)/V<sub>M</sub>]', 'cos<sup>−1</sup>[(V<sub>B</sub>+V<sub>γ</sub>)/V<sub>M</sub>]'], ['(V<sub>B</sub>+V<sub>γ</sub>)/V<sub>M</sub>', '(V<sub>B</sub>+V<sub>γ</sub>)/V<sub>M</sub>']], a: 0,
    e: 'V<sub>M</sub> sin ωt<sub>1</sub> = V<sub>B</sub> + V<sub>γ</sub>，ωt<sub>2</sub> = 180° − ωt<sub>1</sub>。' },
  { zh: '電池充電器二極體承受的 PIV 是？', en: 'What is the PIV of the diode in the battery charger?',
    o: [['V<sub>B</sub> + V<sub>M</sub>', 'V<sub>B</sub> + V<sub>M</sub>'], ['V<sub>M</sub>', 'V<sub>M</sub>'], ['V<sub>M</sub> − V<sub>B</sub>', 'V<sub>M</sub> − V<sub>B</sub>'], ['2V<sub>M</sub>', '2V<sub>M</sub>']], a: 0,
    e: '負半週谷底：電源 −V<sub>M</sub>，電池 +V<sub>B</sub> 在同一邊疊加。Example 2.1：12 + 24 = 36 V。' },
  { zh: '中間抽頭全波整流的輸出是？', en: 'The output of a center-tapped full-wave rectifier is?',
    o: [['v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>', 'v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>'], ['|v<sub>S</sub>| − 2V<sub>γ</sub>', '|v<sub>S</sub>| − 2V<sub>γ</sub>'], ['v<sub>S</sub> − V<sub>γ</sub>', 'v<sub>S</sub> − V<sub>γ</sub>'], ['|v<sub>S</sub>|', '|v<sub>S</sub>|']], a: 0,
    e: '每個瞬間只有一顆二極體導通。' },
  { zh: '橋式全波整流的輸出是？', en: 'The output of a bridge full-wave rectifier is?',
    o: [['v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>', 'v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>'], ['|v<sub>S</sub>| − V<sub>γ</sub>', '|v<sub>S</sub>| − V<sub>γ</sub>'], ['|v<sub>S</sub>| − 4V<sub>γ</sub>', '|v<sub>S</sub>| − 4V<sub>γ</sub>'], ['|v<sub>S</sub>|', '|v<sub>S</sub>|']], a: 0,
    e: '電流一進一出，經過兩顆二極體。' },
  { zh: '中間抽頭全波整流每顆二極體的 PIV 是？', en: 'The PIV of each diode in the center-tapped rectifier is?',
    o: [['2V<sub>m</sub> − V<sub>γ</sub>', '2V<sub>m</sub> − V<sub>γ</sub>'], ['V<sub>m</sub> − V<sub>γ</sub>', 'V<sub>m</sub> − V<sub>γ</sub>'], ['V<sub>m</sub>', 'V<sub>m</sub>'], ['4V<sub>m</sub>', '4V<sub>m</sub>']], a: 0,
    e: '關著的那邊 −V<sub>m</sub>，導通的那邊輸出 V<sub>m</sub> − V<sub>γ</sub>，相差 2V<sub>m</sub> − V<sub>γ</sub>。' },
  { zh: '橋式全波整流每顆二極體的 PIV 是？', en: 'The PIV of each diode in the bridge rectifier is?',
    o: [['V<sub>m</sub> − V<sub>γ</sub>', 'V<sub>m</sub> − V<sub>γ</sub>'], ['2V<sub>m</sub> − V<sub>γ</sub>', '2V<sub>m</sub> − V<sub>γ</sub>'], ['2V<sub>m</sub>', '2V<sub>m</sub>'], ['V<sub>m</sub> − 2V<sub>γ</sub>', 'V<sub>m</sub> − 2V<sub>γ</sub>']], a: 0,
    e: '橋式的 PIV 比中間抽頭小約一半。' },
  { zh: '橋式相較於中間抽頭的優點，下列何者「不是」？', en: 'Which is NOT an advantage of the bridge over the center-tapped rectifier?',
    o: [['用的二極體比較少', 'it uses fewer diodes'], ['次級圈數只要一半', 'half as many secondary turns'], ['整個次級線圈都用到', 'the whole secondary winding is used'], ['二極體的 PIV 比較低', 'a lower diode PIV']], a: 0,
    e: '橋式要 4 顆二極體，中間抽頭只要 2 顆；其他三項都是橋式的優點。' },
  { zh: '橋式整流在負半週，二極體導通的條件是？', en: 'In the negative half-cycle of a bridge rectifier, the diodes conduct when?',
    o: [['−v<sub>S</sub> &gt; 2V<sub>γ</sub>', '−v<sub>S</sub> &gt; 2V<sub>γ</sub>'], ['−v<sub>S</sub> &gt; V<sub>γ</sub>', '−v<sub>S</sub> &gt; V<sub>γ</sub>'], ['v<sub>S</sub> &gt; 2V<sub>γ</sub>', 'v<sub>S</sub> &gt; 2V<sub>γ</sub>'], ['永遠導通', 'always']], a: 0,
    e: '板書負半週：−v<sub>S</sub> − V<sub>γ</sub> − i<sub>L</sub>R − V<sub>γ</sub> = 0，剛導通 i<sub>L</sub> = 0 ⇒ −v<sub>S</sub> = 2V<sub>γ</sub>。' },
  { zh: '橋式全波的「不導通區」寬度是？', en: 'The dead zone of a bridge rectifier is?',
    o: [['|v<sub>S</sub>| &lt; 2V<sub>γ</sub>', '|v<sub>S</sub>| &lt; 2V<sub>γ</sub>'], ['|v<sub>S</sub>| &lt; V<sub>γ</sub>', '|v<sub>S</sub>| &lt; V<sub>γ</sub>'], ['|v<sub>S</sub>| &lt; 4V<sub>γ</sub>', '|v<sub>S</sub>| &lt; 4V<sub>γ</sub>'], ['沒有不導通區', 'no dead zone']], a: 0,
    e: '要先爬過兩個 V<sub>γ</sub>，輸出才開始。中間抽頭的不導通區是 ±V<sub>γ</sub>。' }
], '全波整流通了。下一份講義：截波器與箝位器。', '答錯的回去玩 §02、§03 的全波模組，注意 V<sub>γ</sub> 吃幾個、PIV 看誰。');
