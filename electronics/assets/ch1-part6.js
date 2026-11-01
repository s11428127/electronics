/* ============================================================
   電子學 CH1 PART 6 — 小訊號分析、二極體電容、開關暫態、其他二極體
   Neamen 4e, Ch.1 §1.3.3、§1.4、§1.5（＋§1.2.5 開關暫態）；課程原講義 PART 5（V3）投影片 1-1～1-34
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, arrow, bindRange, clamp, lerp, sci, TAU } = E;
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  const VT = 0.026;
  const fmtA = i => {
    const a = Math.abs(i), s = i < 0 ? '−' : '';
    if (a >= 1e-3) return s + (a * 1e3).toFixed(a >= 0.1 ? 1 : 3) + ' mA';
    if (a >= 1e-6) return s + (a * 1e6).toFixed(2) + ' μA';
    if (a >= 1e-9) return s + (a * 1e9).toFixed(2) + ' nA';
    if (a === 0) return '0 A';
    return s + sci(a, 2) + ' A';
  };
  const fmtR = r => r >= 1e3 ? (r / 1e3).toFixed(2) + ' kΩ' : r >= 10 ? r.toFixed(1) + ' Ω' : r.toFixed(2) + ' Ω';
  const fmtF = f => f >= 1e9 ? (f / 1e9).toFixed(2) + ' GHz' : f >= 1e6 ? (f / 1e6).toFixed(2) + ' MHz' : f >= 1e3 ? (f / 1e3).toFixed(2) + ' kHz' : f.toFixed(1) + ' Hz';
  const fmtC = c => c >= 1e-9 ? (c * 1e9).toFixed(2) + ' nF' : (c * 1e12).toFixed(2) + ' pF';
  /* 串聯電路的精確交點（指數模型）：(V − v)/R = I_S(e^(v/V_T) − 1)，二分法；R 用 Ω */
  const solveExp = (V, R, IS) => {
    const f = v => (V - v) / R - IS * (Math.exp(v / VT) - 1);
    let a = Math.min(V, 0) - 1, b = Math.min(Math.max(V, 0) + 1, 1.2);
    for (let k = 0; k < 70; k++) { const m = (a + b) / 2; f(m) > 0 ? a = m : b = m; }
    const v = (a + b) / 2; return { v, i: (V - v) / R };
  };
  window.__p6 = { solveExp, fmtA, fmtR, fmtF, fmtC };

  function frame(ctx, F0, o) {
    const L = F0.x0, R = F0.x1, T = F0.y0, B = F0.y1;
    const lg = !!o.logy, lx = !!o.logx;
    const X = v => lerp(L, R, ((lx ? Math.log10(v) : v) - o.v0) / (o.v1 - o.v0));
    const Y = i => lerp(B, T, ((lg ? Math.log10(Math.max(i, 1e-30)) : i) - o.i0) / (o.i1 - o.i0));
    ctx.strokeStyle = C['line-soft'] || C.line; ctx.lineWidth = 1;
    (o.vt || []).forEach(t => { const v = t[0]; ctx.beginPath(); ctx.moveTo(X(v), T); ctx.lineTo(X(v), B); ctx.stroke(); label(ctx, X(v), B + 12, t[1], C['ink-3'], 10); });
    (o.it || []).forEach(t => { const i = t[0]; ctx.beginPath(); ctx.moveTo(L, Y(i)); ctx.lineTo(R, Y(i)); ctx.stroke(); label(ctx, L - 5, Y(i), t[1], C['ink-3'], 10, 'right'); });
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.3;
    const y0 = lg ? B : Y(clamp(0, o.i0, o.i1)), x0 = lx ? L : X(clamp(0, o.v0, o.v1));
    ctx.beginPath(); ctx.moveTo(L, y0); ctx.lineTo(R, y0); ctx.moveTo(x0, T); ctx.lineTo(x0, B); ctx.stroke();
    if (o.xl) labelCJK(ctx, R, y0 - 10, o.xl, C['ink-3'], 11, 'right');
    if (o.yl) labelCJK(ctx, x0 + 6, T + 4, o.yl, C['ink-3'], 11, 'left');
    return { X, Y, L, R, T, B };
  }
  const plot = (ctx, F, fn, va, vb, col, lw, dash, n) => {
    n = n || 240;
    ctx.save(); ctx.beginPath(); ctx.rect(F.L, F.T - 2, F.R - F.L, F.B - F.T + 4); ctx.clip();
    ctx.strokeStyle = col; ctx.lineWidth = lw || 2.2; ctx.setLineDash(dash || []);
    ctx.beginPath();
    for (let k = 0; k <= n; k++) { const v = va + (vb - va) * k / n, y = clamp(F.Y(fn(v)), F.T - 40, F.B + 40); k ? ctx.lineTo(F.X(v), y) : ctx.moveTo(F.X(v), y); }
    ctx.stroke(); ctx.restore();
  };
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fillStyle = col; ctx.fill(); };
  const dashLine = (ctx, x1, y1, x2, y2, col, lw) => { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col; ctx.lineWidth = lw || 1.2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };
  const box = (w, h, fx0, fy0, fx1, fy1, padL) => ({ x0: Math.max(padL || 44, w * fx0), x1: w * fx1, y0: h * fy0, y1: h * fy1 });
  const wide = w => w >= 560;


  /* ══════════════════════════════════════════════════════════
     00 補課：完整的小訊號圖（電壓波形在下、曲線在右上、電流波形在左）
     ══════════════════════════════════════════════════════════ */
  function fullPic(ctx, w, h, VQ, amp, ph, IS) {
    const iv = v => IS * (Math.exp(v / VT) - 1) * 1e3;
    const L = Math.max(w * 0.42, 120), R = w * 0.96, T = h * 0.06, B = h * 0.5;
    const v0 = 0.55, v1 = 0.76, i1 = Math.max(iv(VQ + amp) * 1.12, iv(VQ) * 2, 0.5);
    const X = v => lerp(L, R, (v - v0) / (v1 - v0)), Y = i => lerp(B, T, i / i1);
    const yv0 = B + 10, Hv = h * 0.96 - yv0, xi0 = L - 10, Wi = xi0 - w * 0.03;
    const vAt = u => VQ + amp * Math.sin(u * 4 * Math.PI), IQ = iv(VQ);
    /* 軸 */
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.moveTo(L, B); ctx.lineTo(L, T); ctx.stroke();
    labelCJK(ctx, R, B - 10, 'v<sub>D</sub>', C['ink-3'], 11, 'right'); labelCJK(ctx, L + 6, T + 4, 'i<sub>D</sub>', C['ink-3'], 11, 'left');
    /* 曲線 */
    ctx.save(); ctx.beginPath(); ctx.rect(L, T - 2, R - L, B - T + 4); ctx.clip();
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let n = 0; n <= 200; n++) { const v = v0 + (v1 - v0) * n / 200, y = Y(iv(v)); n ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y); } ctx.stroke();
    /* 用到的那一段 */
    ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.globalAlpha = 0.45; ctx.beginPath();
    for (let n = 0; n <= 30; n++) { const v = VQ - amp + 2 * amp * n / 30, y = Y(iv(v)); n ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y); } ctx.stroke(); ctx.globalAlpha = 1;
    ctx.restore();
    /* 直流的虛線 */
    dashLine(ctx, X(VQ), B, X(VQ), h * 0.97, C['ink-3']); dashLine(ctx, L, Y(IQ), w * 0.02, Y(IQ), C['ink-3']);
    label(ctx, X(VQ) + 4, B + 6, 'V<sub>DQ</sub>', C['ink-3'], 10, 'left'); label(ctx, w * 0.02, Y(IQ) - 9, 'I<sub>DQ</sub>', C['ink-3'], 10, 'left');
    /* 兩條波形 */
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let n = 0; n <= 160; n++) { const u = n / 160, x = X(vAt(u)), y = yv0 + u * Hv; n ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    ctx.beginPath();
    for (let n = 0; n <= 160; n++) { const u = n / 160, x = xi0 - u * Wi, y = Y(iv(vAt(u))); n ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    labelCJK(ctx, X(VQ) + 8, h * 0.95, 'v<sub>D</sub>(t)：時間往下 ↓', C.accent, 11, 'left', '700');
    labelCJK(ctx, w * 0.03, Math.min(B + 14, h * 0.6), '← 時間往左：i<sub>D</sub>(t)', C.accent, 11, 'left', '700');
    /* 這一刻 */
    const u = ph % 1, v = vAt(u), x = X(v), yv = yv0 + u * Hv, yc = Y(iv(v)), xi = xi0 - u * Wi;
    ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, yv); ctx.lineTo(x, yc); ctx.lineTo(xi, yc); ctx.stroke(); ctx.restore();
    dot(ctx, x, yv, 5, C.ink); dot(ctx, x, yc, 6, C.accent); dot(ctx, xi, yc, 5, C.ink);
    return { IQ, imax: iv(VQ + amp), imin: iv(VQ - amp) };
  }
  window.__p6.fullPic = (ctx, w, h, VQ, amp, ph) => fullPic(ctx, w, h, VQ, amp, ph, 1e-14);
  (function basics() {
    const cv = document.getElementById('cv-bs'); if (!cv) return;
    let VQ = 0.677, AMP = 0.015, ph = 0, run = true;
    Stage(cv, { ratio: w => wide(w) ? 0.62 : 1.05, minH: 320, maxH: 520, draw(ctx, w, h, dt) {
      if (run) ph += dt * 0.12;
      fullPic(ctx, w, h, VQ, AMP, ph, 1e-14);
    } });
    function msg() {
      const iv = v => 1e-14 * Math.exp(v / VT) * 1e3, IQ = iv(VQ), up = iv(VQ + AMP) - IQ, dn = IQ - iv(VQ - AMP);
      setHTML('bs-iq', IQ.toFixed(3) + ' mA');
      setHTML('bs-i', '+' + up.toFixed(3) + '／−' + dn.toFixed(3) + ' mA');
      setHTML('bs-msg', '看那條<b>虛線</b>：下面的黑點是「這一刻的電壓」，往上碰到曲線（藍點），再往左就是「這一刻的電流」。整個交流期間，藍點只在 Q 附近<b>加粗的那一段</b>來回滑。' +
        (AMP <= 0.006 ? ' 交流很小：那一段幾乎是直的，電流波形上下對稱。' : AMP < 0.02 ? ' 那一段開始看得出彎，電流往上比往下多一點。' : ' <b>交流太大</b>：那一段明顯是彎的，電流上下差很多（失真）。'));
    }
    bindRange('bs-vq', x => x.toFixed(3) + ' V', x => { VQ = x; msg(); });
    bindRange('bs-ac', x => (x * 1e3).toFixed(0) + ' mV', x => { AMP = x; msg(); });
    const pb = document.getElementById('bs-play');
    if (pb) pb.addEventListener('click', () => { run = !run; pb.textContent = run ? '⏸ 暫停' : '▶ 播放'; });
  })();

  /* ══════════════════════════════════════════════════════════
     01 小訊號：直流上面疊一個小交流
     ══════════════════════════════════════════════════════════ */
  (function smallSignal() {
    const cv = document.getElementById('cv-ss'); if (!cv) return;
    const IS = 1e-14;
    let VQ = 0.65, AMP = 0.005, ph = 0, trace = [];
    const iv = v => IS * (Math.exp(v / VT) - 1) * 1e3;
    Stage(cv, { ratio: w => wide(w) ? 0.46 : 1.05, minH: 280, maxH: 420, draw(ctx, w, h, dt) {
      ph += dt * 1.6;
      const IQ = iv(VQ), g = IQ / VT;                     /* mA/V */
      const v = VQ + AMP * Math.sin(ph * TAU / 2), i = iv(v), il = IQ + g * (v - VQ);
      trace.push([i, il]); if (trace.length > 220) trace.shift();
      const imax = iv(VQ + Math.max(AMP, 0.004)) * 1.25;
      /* 左（或上）：I–V */
      const A = wide(w) ? box(w, h, 0.08, 0.08, 0.48, 0.86) : box(w, h, 0.12, 0.05, 0.94, 0.44);
      const F = frame(ctx, A, { v0: 0.5, v1: Math.max(0.75, VQ + AMP + 0.02), i0: 0, i1: imax, vt: [[VQ, 'V<sub>DQ</sub>']], it: [[IQ, IQ.toFixed(2)]], xl: 'v<sub>D</sub> (V)', yl: 'i<sub>D</sub> (mA)' });
      plot(ctx, F, iv, 0.5, Math.max(0.75, VQ + AMP + 0.02), C['ink-2'], 2.2);
      /* 切線 */
      const span = Math.max(AMP * 2.2, 0.01);
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = C.accent; ctx.lineWidth = 1.4; ctx.beginPath();
      ctx.moveTo(F.X(VQ - span), F.Y(IQ - g * span)); ctx.lineTo(F.X(VQ + span), F.Y(IQ + g * span)); ctx.stroke(); ctx.restore();
      /* 掃動範圍 */
      ctx.fillStyle = C['p-real-w'] || C['surface-2'];
      ctx.globalAlpha = 0.55; ctx.fillRect(F.X(VQ - AMP), F.T, Math.max(1, F.X(VQ + AMP) - F.X(VQ - AMP)), F.B - F.T); ctx.globalAlpha = 1;
      dot(ctx, F.X(VQ), F.Y(IQ), 4, C.ink);
      dot(ctx, F.X(v), F.Y(i), 6.5, C.accent);
      labelCJK(ctx, F.X(VQ) - 8, F.Y(IQ) - 12, 'Q', C.ink, 12, 'right', '700');
      /* 右（或下）：i_D(t) */
      const B2 = wide(w) ? box(w, h, 0.58, 0.08, 0.97, 0.86, 0) : box(w, h, 0.12, 0.56, 0.94, 0.94, 0);
      const lo = Math.min(...trace.map(p => Math.min(p[0], p[1]))), hi = Math.max(...trace.map(p => Math.max(p[0], p[1])));
      const pad = Math.max((hi - lo) * 0.15, IQ * 0.02);
      const G = frame(ctx, B2, { v0: 0, v1: 220, i0: lo - pad, i1: hi + pad, it: [[IQ, IQ.toFixed(2)]], yl: 'i<sub>D</sub>(t) (mA)' });
      const draw = (k, col, lw, dash) => { ctx.save(); ctx.setLineDash(dash || []); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); trace.forEach((p, n) => { const x = G.X(n), y = G.Y(p[k]); n ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore(); };
      dashLine(ctx, G.L, G.Y(IQ), G.R, G.Y(IQ), C['ink-3']);
      draw(1, C['ink-3'], 1.4, [5, 4]);
      draw(0, C.accent, 2.4);
      labelCJK(ctx, G.R, G.T + 6, '藍：真的電流　虛線：切線（直線）預測', C['ink-3'], 10.5, 'right');
      labelCJK(ctx, G.L + 4, G.Y(IQ) - 9, '直流 I<sub>DQ</sub>', C['ink-3'], 10.5, 'left');
    } });
    function msg() {
      const IQ = IS * Math.exp(VQ / VT), up = IQ * (Math.exp(AMP / VT) - 1), dn = IQ * (1 - Math.exp(-AMP / VT)), lin = IQ * AMP / VT;
      setHTML('ss-iq', fmtA(IQ));
      setHTML('ss-up', '+' + fmtA(up) + '／−' + fmtA(dn));
      const asym = (up - dn) / (up + dn) * 100;
      setHTML('ss-as', asym.toFixed(1) + ' %');
      setHTML('ss-msg', AMP <= 0.0052 ? '<b>v<sub>d</sub> ≪ V<sub>T</sub>（26 mV）</b>：電流往上、往下晃的量幾乎一樣，藍線和虛線疊在一起 —— 這一小段曲線可以當成<b>直線</b>，這就是「小訊號」。'
        : AMP < 0.015 ? 'v<sub>d</sub> 開始不夠小：往上晃比往下晃多一點（曲線往上彎），直線預測差了 ' + asym.toFixed(0) + '% 左右。'
        : '<b>太大了</b>：指數曲線往上越來越陡，電流上半週被拉高、下半週被壓扁 —— 波形不再是正弦，叫<b>失真</b>。切線（r<sub>d</sub>）的近似不能用了。');
      trace = [];
    }
    bindRange('ss-vq', x => x.toFixed(3) + ' V', x => { VQ = x; msg(); });
    bindRange('ss-ac', x => (x * 1e3).toFixed(0) + ' mV', x => { AMP = x; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     02 增量電阻：Q 點的切線
     ══════════════════════════════════════════════════════════ */
  (function incr() {
    const cv = document.getElementById('cv-rd'); if (!cv) return;
    const IS = 1e-14; let lg = Math.log10(2), st;
    const iv = v => IS * (Math.exp(v / VT) - 1) * 1e3;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.46 : 0.85, minH: 260, maxH: 400, draw(ctx, w, h) {
      const IQ = Math.pow(10, lg), VQ = VT * Math.log(IQ * 1e-3 / IS), g = IQ / VT;
      const A = box(w, h, 0.1, 0.07, 0.96, 0.88);
      const F = frame(ctx, A, { v0: 0.55, v1: 0.78, i0: 0, i1: 12, vt: [[0.6, '0.60'], [0.65, '0.65'], [0.7, '0.70'], [0.75, '0.75']], it: [[4, '4'], [8, '8']], xl: 'v<sub>D</sub> (V)', yl: 'i<sub>D</sub> (mA)' });
      plot(ctx, F, iv, 0.55, 0.78, C['ink-2'], 2.4);
      /* 切線：從 i = 0 畫到 i = 12 */
      const va = VQ - IQ / g, vb = VQ + (12 - IQ) / g;
      ctx.save(); ctx.beginPath(); ctx.rect(F.L, F.T, F.R - F.L, F.B - F.T); ctx.clip();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(F.X(va), F.Y(0)); ctx.lineTo(F.X(vb), F.Y(12)); ctx.stroke(); ctx.restore();
      /* 三角形 Δv、Δi */
      const dv = 0.012, di = g * dv;
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1.3; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(F.X(VQ), F.Y(IQ)); ctx.lineTo(F.X(VQ + dv), F.Y(IQ)); ctx.lineTo(F.X(VQ + dv), F.Y(Math.min(12, IQ + di))); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, F.X(VQ + dv / 2), F.Y(IQ) + 11, 'Δv', C.accent, 10.5, 'center', '700');
      label(ctx, F.X(VQ + dv) + 5, F.Y(Math.min(12, IQ + di / 2)), 'Δi', C.accent, 10.5, 'left', '700');
      dot(ctx, F.X(VQ), F.Y(IQ), 6.5, C.accent);
      labelCJK(ctx, F.X(VQ) - 10, F.Y(IQ) - 2, 'Q', C.accent, 13, 'right', '700');
      labelCJK(ctx, F.L + 8, F.T + 12, '切線斜率 = 1/r<sub>d</sub> = I<sub>DQ</sub>/V<sub>T</sub>', C.accent, 12, 'left', '700');
      labelCJK(ctx, F.L + 8, F.T + 30, 'r<sub>d</sub> = ' + fmtR(VT / (IQ * 1e-3)), C.ink, 12, 'left', '700');
    } });
    function msg() {
      const IQ = Math.pow(10, lg), VQ = VT * Math.log(IQ * 1e-3 / IS), rd = VT / (IQ * 1e-3);
      setHTML('rd-vq', VQ.toFixed(3) + ' V');
      setHTML('rd-r', fmtR(rd));
      setHTML('rd-g', (1 / rd * 1e3).toFixed(2) + ' mA/V');
      setHTML('rd-msg', IQ < 0.3 ? '電流小，Q 點在曲線<b>平坦</b>的地方：電壓動一點、電流只動一點點 → r<sub>d</sub> <b>大</b>（' + fmtR(rd) + '）。'
        : IQ < 3 ? '中間：r<sub>d</sub> = 26 mV ÷ I<sub>DQ</sub>。電流加倍，r<sub>d</sub> 就減半。'
        : 'Q 點在曲線<b>很陡</b>的地方：電壓動一點、電流動很多 → r<sub>d</sub> <b>很小</b>（' + fmtR(rd) + '），二極體像一條「幾乎短路」的線。');
      st.redraw();
    }
    bindRange('rd-i', x => fmtA(Math.pow(10, x) * 1e-3), x => { lg = x; msg(); });
  })();


  /* ══════════════════════════════════════════════════════════
     02+ 補課：割線 → 切線（為什麼要微分）＋ 片段線性的 r_f 對照
     ══════════════════════════════════════════════════════════ */
  (function secant() {
    const cv = document.getElementById('cv-rf'); if (!cv) return;
    const IS = 1e-14, VG = 0.62, RF = 10; let lg = Math.log10(2), DV = 0.01, st;
    const iv = v => IS * (Math.exp(v / VT) - 1) * 1e3;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.46 : 0.85, minH: 260, maxH: 400, draw(ctx, w, h) {
      const IQ = Math.pow(10, lg), VQ = VT * Math.log(IQ * 1e-3 / IS), sl = IQ / VT, I2 = iv(VQ + DV), ss = (I2 - IQ) / DV;
      const A = box(w, h, 0.1, 0.07, 0.96, 0.88);
      const F = frame(ctx, A, { v0: 0.56, v1: 0.76, i0: 0, i1: 14, vt: [[0.6, '0.60'], [0.65, '0.65'], [0.7, '0.70'], [0.75, '0.75']], it: [[5, '5'], [10, '10']], xl: 'v<sub>D</sub> (V)', yl: 'i<sub>D</sub> (mA)' });
      plot(ctx, F, iv, 0.56, 0.76, C['ink-2'], 2.4);
      /* 片段線性 r_f（固定的一條斜線） */
      ctx.save(); ctx.beginPath(); ctx.rect(F.L, F.T, F.R - F.L, F.B - F.T); ctx.clip();
      ctx.strokeStyle = C['q-react'] || C.warn; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(F.X(0.56), F.Y(0)); ctx.lineTo(F.X(VG), F.Y(0)); ctx.lineTo(F.X(0.76), F.Y((0.76 - VG) * 1000 / RF)); ctx.stroke();
      /* 切線 */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(F.X(VQ - IQ / sl), F.Y(0)); ctx.lineTo(F.X(VQ + (14 - IQ) / sl), F.Y(14)); ctx.stroke();
      /* 割線（Q 到 Q + Δv） */
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.beginPath();
      ctx.moveTo(F.X(VQ - 0.02), F.Y(IQ - ss * 0.02)); ctx.lineTo(F.X(VQ + 0.04), F.Y(IQ + ss * 0.04)); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(F.X(VQ), F.Y(IQ)); ctx.lineTo(F.X(VQ + DV), F.Y(IQ)); ctx.lineTo(F.X(VQ + DV), F.Y(Math.min(14, I2))); ctx.stroke(); ctx.setLineDash([]);
      dot(ctx, F.X(VQ), F.Y(IQ), 6, C.accent); if (I2 < 14) dot(ctx, F.X(VQ + DV), F.Y(I2), 5, C.ink);
      labelCJK(ctx, F.L + 30, F.T + 26, '藍：Q 點切線（微分 → r<sub>d</sub>）', C.accent, 11.5, 'left', '700');
      labelCJK(ctx, F.L + 30, F.T + 44, '黑虛線：往前一步 Δv 的斜線', C.ink, 11.5, 'left', '700');
      labelCJK(ctx, F.L + 30, F.T + 62, '橘：片段線性（固定 r<sub>f</sub> = 10 Ω）', C['q-react'] || C.warn, 11.5, 'left', '700');
    } });
    function msg() {
      const IQ = Math.pow(10, lg), VQ = VT * Math.log(IQ * 1e-3 / IS), sl = IQ / VT, ss = (iv(VQ + DV) - IQ) / DV, rd = VT / (IQ * 1e-3);
      setHTML('rf-s', ss.toFixed(1) + ' mA/V'); setHTML('rf-t', sl.toFixed(1) + ' mA/V'); setHTML('rf-r', fmtR(rd));
      const err = (ss / sl - 1) * 100;
      setHTML('rf-msg', (err < 2 ? '一步只有 ' + (DV * 1e3).toFixed(1) + ' mV：虛線跟藍色切線幾乎重疊（差 ' + err.toFixed(1) + '%）—— 這就是微分在算的東西。' : '一步 ' + (DV * 1e3).toFixed(1) + ' mV 太大：虛線比切線陡 ' + err.toFixed(0) + '%（曲線已經彎上去了）。把 Δv 拉小看看。') +
        ' 現在 r<sub>d</sub> = 26 mV ÷ ' + IQ.toFixed(2) + ' mA = ' + fmtR(rd) + '；橘線的 r<sub>f</sub> 一直是 10 Ω —— ' + (rd > 15 ? 'Q 點低，r<sub>d</sub> 比 r<sub>f</sub> 大很多。' : rd < 7 ? 'Q 點高，r<sub>d</sub> 比 r<sub>f</sub> 還小。' : '這附近兩者剛好差不多，但意義不同。'));
      st.redraw();
    }
    bindRange('rf-i', x => fmtA(Math.pow(10, x) * 1e-3), x => { lg = x; msg(); });
    bindRange('rf-d', x => (x * 1e3).toFixed(1) + ' mV', x => { DV = x; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     03 DC / AC 拆開算：Example 1.11 的電路
     ══════════════════════════════════════════════════════════ */
  /* canvas 小電路元件 */
  const CK = {
    wire(ctx, pts, col) { ctx.strokeStyle = col || C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); },
    resV(ctx, x, y1, y2, col) {
      const m = (y1 + y2) / 2, a = 16; ctx.strokeStyle = col || C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, m - a);
      for (let k = 0; k < 6; k++) ctx.lineTo(x + (k % 2 ? -6 : 6), m - a + (k + 0.5) * a / 3); ctx.lineTo(x, m + a); ctx.lineTo(x, y2); ctx.stroke();
    },
    resH(ctx, x1, x2, y, col) {
      const m = (x1 + x2) / 2, a = 16; ctx.strokeStyle = col || C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(m - a, y);
      for (let k = 0; k < 6; k++) ctx.lineTo(m - a + (k + 0.5) * a / 3, y + (k % 2 ? -6 : 6)); ctx.lineTo(m + a, y); ctx.lineTo(x2, y); ctx.stroke();
    },
    diodeH(ctx, x1, x2, y, col) {
      const m = (x1 + x2) / 2; ctx.strokeStyle = col || C.ink; ctx.fillStyle = col || C.ink; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m - 9, y - 9); ctx.lineTo(m + 7, y); ctx.lineTo(m - 9, y + 9); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(m + 8, y - 9); ctx.lineTo(m + 8, y + 9); ctx.lineWidth = 2.4; ctx.stroke();
    },
    batH(ctx, x1, x2, y, col) {      /* 正端在左 */
      const m = (x1 + x2) / 2; ctx.strokeStyle = col || C.ink; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(m - 4, y); ctx.moveTo(m + 4, y); ctx.lineTo(x2, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m - 4, y - 11); ctx.lineTo(m - 4, y + 11); ctx.stroke();
      ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(m + 4, y - 6); ctx.lineTo(m + 4, y + 6); ctx.stroke();
    },
    batV(ctx, x, y1, y2, col) {      /* 正端在上 */
      const m = (y1 + y2) / 2; ctx.strokeStyle = col || C.ink; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, m - 4); ctx.moveTo(x, m + 4); ctx.lineTo(x, y2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 12, m - 4); ctx.lineTo(x + 12, m - 4); ctx.stroke();
      ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(x - 6, m + 4); ctx.lineTo(x + 6, m + 4); ctx.stroke();
    },
    acV(ctx, x, y1, y2, col) {
      const m = (y1 + y2) / 2, r = 13; ctx.strokeStyle = col || C.ink; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, m - r); ctx.moveTo(x, m + r); ctx.lineTo(x, y2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, m, r, 0, TAU); ctx.stroke();
      ctx.beginPath(); for (let k = 0; k <= 20; k++) { const u = k / 20; ctx[k ? 'lineTo' : 'moveTo'](x - 7 + 14 * u, m - 5 * Math.sin(u * TAU)); } ctx.stroke();
    }
  };
  window.__p6.CK = CK;

  (function split() {
    const cv = document.getElementById('cv-split'); if (!cv) return;
    let mode = 'full', VPS = 5, R = 5, VI = 0.1, ph = 0;
    const VG = 0.6;
    Stage(cv, { ratio: w => wide(w) ? 0.46 : 1.1, minH: 300, maxH: 430, draw(ctx, w, h, dt) {
      ph += dt * 1.4;
      const IQ = Math.max(0, (VPS - VG) / R), VO = IQ * R, rd = IQ > 0 ? VT / IQ : Infinity, vo = IQ > 0 ? VI * R / (R + rd) : 0;   /* kΩ、mA */
      /* 電路 */
      const W = wide(w) ? w * 0.48 : w, H = wide(w) ? h : h * 0.52;
      const x0 = Math.max(48, W * 0.16), x1 = W * 0.82, yT = H * 0.16, yB = H * 0.86, ym1 = lerp(yT, yB, 0.32), ym2 = lerp(yT, yB, 0.7);
      const dim = C['ink-3'], acc = C.accent;
      const viOn = mode !== 'dc', vpsOn = mode !== 'ac';
      CK.wire(ctx, [[x0, ym1 - 26], [x0, yT], [x0 + (x1 - x0) * 0.3, yT]]);
      CK.wire(ctx, [[x0 + (x1 - x0) * 0.7, yT], [x1, yT], [x1, yT + (yB - yT) * 0.25]]);
      CK.wire(ctx, [[x1, yT + (yB - yT) * 0.75], [x1, yB], [x0, yB], [x0, ym2 + 26]]);
      CK.wire(ctx, [[x0, ym1 + 26], [x0, ym2 - 26]]);
      if (viOn) { CK.acV(ctx, x0, ym1 - 26, ym1 + 26, mode === 'ac' ? acc : C.ink); labelCJK(ctx, x0 - 18, ym1, 'v<sub>i</sub>', mode === 'ac' ? acc : C.ink, 12, 'right', '700'); }
      else { CK.wire(ctx, [[x0, ym1 - 26], [x0, ym1 + 26]], acc); labelCJK(ctx, x0 - 8, ym1, 'v<sub>i</sub> = 0 → 短路', acc, 11, 'right', '700'); }
      if (vpsOn) { CK.batV(ctx, x0, ym2 - 26, ym2 + 26, mode === 'dc' ? acc : C.ink); labelCJK(ctx, x0 - 18, ym2, 'V<sub>PS</sub>', mode === 'dc' ? acc : C.ink, 12, 'right', '700'); }
      else { CK.wire(ctx, [[x0, ym2 - 26], [x0, ym2 + 26]], acc); labelCJK(ctx, x0 - 8, ym2, 'V<sub>PS</sub> → 交流接地', acc, 11, 'right', '700'); }
      const dA = x0 + (x1 - x0) * 0.3, dB = x0 + (x1 - x0) * 0.7;
      if (mode === 'full') { CK.diodeH(ctx, dA, dB, yT); labelCJK(ctx, (dA + dB) / 2, yT - 18, '二極體', C['ink-2'], 11, 'center'); }
      else if (mode === 'dc') { CK.batH(ctx, dA, dB, yT, acc); labelCJK(ctx, (dA + dB) / 2, yT - 18, 'V<sub>γ</sub> = 0.6 V', acc, 11, 'center', '700'); }
      else { CK.resH(ctx, dA, dB, yT, acc); labelCJK(ctx, (dA + dB) / 2, yT - 18, 'r<sub>d</sub> = ' + (isFinite(rd) ? fmtR(rd * 1e3) : '∞'), acc, 11, 'center', '700'); }
      CK.resV(ctx, x1, yT + (yB - yT) * 0.25, yT + (yB - yT) * 0.75);
      labelCJK(ctx, x1 + 12, (yT + yB) / 2, 'R', C.ink, 12, 'left', '700');
      labelCJK(ctx, x1 + 12, (yT + yB) / 2 + 18, 'v<sub>O</sub>', C['ink-2'], 11, 'left');
      /* 電流點：DC 流動 + AC 晃 */
      const sp = mode === 'ac' ? 0 : 0.35 * Math.min(1, IQ), wob = mode === 'dc' ? 0 : 0.04 * Math.min(1, VI / 0.1) * Math.sin(ph * TAU / 2);
      const per = 2 * ((x1 - x0) + (yB - yT));
      for (let k = 0; k < 9; k++) {
        let s = ((k / 9 + ph * sp * 0.25 + wob) % 1 + 1) % 1 * per, px, py;
        if (s < x1 - x0) { px = x0 + s; py = yT; } else if ((s -= x1 - x0) < yB - yT) { px = x1; py = yT + s; } else if ((s -= yB - yT) < x1 - x0) { px = x1 - s; py = yB; } else { s -= x1 - x0; px = x0; py = yB - s; }
        if (IQ > 0 || mode === 'ac') dot(ctx, px, py, 3.2, acc);
      }
      labelCJK(ctx, W / 2, H - 6, mode === 'full' ? '原電路：直流 + 交流一起' : mode === 'dc' ? 'DC 電路：只留直流，二極體 = V<sub>γ</sub> 電池' : 'AC 電路：只留交流，二極體 = r<sub>d</sub>', C['ink-2'], 11.5, 'center', '700');
      /* 波形 */
      const B2 = wide(w) ? { x0: w * 0.56, x1: w * 0.97, y0: h * 0.1, y1: h * 0.86 } : { x0: Math.max(48, w * 0.12), x1: w * 0.95, y0: h * 0.6, y1: h * 0.95 };
      const top = mode === 'ac' ? Math.max(vo * 1.5, 0.02) : Math.max(VO + vo, 0.5) * 1.25, bot = mode === 'ac' ? -top : 0;
      const G = frame(ctx, B2, { v0: 0, v1: 1, i0: bot, i1: top, it: mode === 'ac' ? [[vo, '+' + vo.toFixed(3)], [-vo, '−' + vo.toFixed(3)]] : [[VO, VO.toFixed(2)]], yl: mode === 'ac' ? 'v<sub>o</sub>(t) (V)' : 'v<sub>O</sub>(t) (V)' });
      ctx.strokeStyle = acc; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let k = 0; k <= 160; k++) { const u = k / 160, s = Math.sin(u * 3 * TAU - ph * 2); const y = mode === 'dc' ? VO : mode === 'ac' ? vo * s : VO + vo * s; k ? ctx.lineTo(G.X(u), G.Y(y)) : ctx.moveTo(G.X(u), G.Y(y)); }
      ctx.stroke();
      if (mode === 'full') labelCJK(ctx, G.R, G.T + 6, '看起來是直線？交流只有 ±' + vo.toFixed(3) + ' V', C['ink-3'], 10.5, 'right');
    } });
    function msg() {
      const IQ = (VPS - VG) / R;
      if (IQ <= 0) { setHTML('sp-iq', '0（OFF）'); setHTML('sp-rd', '∞'); setHTML('sp-vo', '0'); setHTML('sp-msg', 'V<sub>PS</sub> 比 0.6 V 還小，二極體根本沒導通，沒有 Q 點 —— 小訊號分析的前提不成立。'); return; }
      const rd = VT / IQ, vo = VI * R / (R + rd);
      setHTML('sp-iq', IQ.toFixed(3) + ' mA'); setHTML('sp-rd', fmtR(rd * 1e3)); setHTML('sp-vo', (IQ * R).toFixed(2) + ' V ＋ ' + vo.toFixed(4) + ' sin ωt V');
      setHTML('sp-msg', mode === 'full' ? '兩個電源一起作用很難算。按「DC 電路」「AC 電路」把它拆開，各算各的，最後加起來。'
        : mode === 'dc' ? '<b>DC</b>：交流源歸零（電壓源 = 短路），二極體換成 V<sub>γ</sub> 電池 → I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/R = ' + IQ.toFixed(3) + ' mA。'
        : '<b>AC</b>：直流電壓源的「變化量」是 0 → 短路（交流接地）；二極體換成 r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub> = ' + fmtR(rd * 1e3) + ' → 跟 R 分壓。' + (rd < R * 0.02 ? ' r<sub>d</sub> ≪ R，交流幾乎全部落在 R 上。' : ''));
    }
    bindRange('sp-vps', x => x.toFixed(1) + ' V', x => { VPS = x; msg(); });
    bindRange('sp-r', x => x.toFixed(1) + ' kΩ', x => { R = x; msg(); });
    bindRange('sp-vi', x => x.toFixed(2) + ' V', x => { VI = x; msg(); });
    document.querySelectorAll('[data-sp]').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.sp; document.querySelectorAll('[data-sp]').forEach(x => x.classList.toggle('solid', x === b)); msg();
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     04 Q 點設計與失真：v_i 太大會怎樣
     ══════════════════════════════════════════════════════════ */
  (function dist() {
    const cv = document.getElementById('cv-dist'); if (!cv) return;
    let VPS = 5, VI = 0.1, st;
    const R = 5e3, IS = 1e-13;
    const N = 200;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.42 : 0.8, minH: 260, maxH: 380, draw(ctx, w, h) {
      const q = solveExp(VPS, R, IS), VO = q.i * R, rd = VT / Math.max(q.i, 1e-12), gain = R / (R + rd);
      const real = [], lin = [];
      for (let k = 0; k <= N; k++) { const u = k / N, vi = VI * Math.sin(u * 2 * TAU); real.push(solveExp(VPS + vi, R, IS).i * R); lin.push(VO + gain * vi); }
      const hi = Math.max(...real, ...lin), lo = Math.min(...real, ...lin, 0);
      const A = box(w, h, 0.1, 0.08, 0.97, 0.86);
      const F = frame(ctx, A, { v0: 0, v1: 1, i0: lo - (hi - lo) * 0.08, i1: hi + (hi - lo) * 0.12 + 0.01, it: [[VO, VO.toFixed(2)]], yl: 'v<sub>O</sub>(t) (V)' });
      dashLine(ctx, F.L, F.Y(VO), F.R, F.Y(VO), C['ink-3']);
      /* 削掉的地方（二極體 OFF）塗色 */
      ctx.fillStyle = C['q-react-w'] || C['surface-2'];
      real.forEach((y, k) => { if (y < 1e-3 && k < N) ctx.fillRect(F.X(k / N), F.T, (F.R - F.L) / N + 0.5, F.B - F.T); });
      const line = (arr, col, lw, dash) => { ctx.save(); ctx.setLineDash(dash || []); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); arr.forEach((y, k) => { const x = F.X(k / N), yy = F.Y(y); k ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }); ctx.stroke(); ctx.restore(); };
      line(lin, C['ink-3'], 1.5, [5, 4]);
      line(real, C.accent, 2.6);
      labelCJK(ctx, F.R, F.T + 6, '藍：真的輸出　虛線：小訊號（r<sub>d</sub>）預測', C['ink-3'], 10.5, 'right');
      if (real.some(y => y < 1e-3)) labelCJK(ctx, F.L + 8, F.B - 10, '塗色＝二極體 OFF（截止）', C['q-react'] || C.warn, 11, 'left', '700');
    } });
    function msg() {
      const q = solveExp(VPS, R, IS), rd = VT / Math.max(q.i, 1e-12), vd = VI * rd / (R + rd);
      setHTML('ds-q', q.i > 1e-9 ? (q.i * 1e3).toFixed(3) + ' mA、' + q.v.toFixed(3) + ' V' : '≈ 0（OFF）');
      setHTML('ds-vd', (vd * 1e3).toFixed(2) + ' mV');
      const clip = VPS - VI < 0.5;
      setHTML('ds-s', clip ? '截止削波' : vd > 0.01 ? '非線性失真' : '小訊號 OK');
      setHTML('ds-msg', clip ? '<b>截止失真（cutoff clipping）</b>：負半週 v<sub>i</sub> 把 V<sub>PS</sub> 整個抵消，二極體被推到 OFF，輸出被削成 0。要嘛把 V<sub>PS</sub>（Q 點）調高，要嘛把 v<sub>i</sub> 調小。'
        : vd > 0.01 ? '二極體兩端的交流 v<sub>d</sub> = ' + (vd * 1e3).toFixed(1) + ' mV，已經跟 V<sub>T</sub> = 26 mV 比得上，r<sub>d</sub> 不是定值 → <b>非線性失真</b>（上下半週不對稱）。'
        : '二極體上的交流 v<sub>d</sub> 只有 ' + (vd * 1e3).toFixed(2) + ' mV ≪ 26 mV：小訊號模型很準，藍線跟虛線疊在一起。Q 點也夠高，負半週不會 OFF。');
      st.redraw();
    }
    bindRange('ds-vps', x => x.toFixed(1) + ' V', x => { VPS = x; msg(); });
    bindRange('ds-vi', x => x.toFixed(2) + ' V', x => { VI = x; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     05 擴散電容：少數載子「倉庫」跟著電壓漲跌
     ══════════════════════════════════════════════════════════ */
  (function diffCap() {
    const cv = document.getElementById('cv-cd'); if (!cv) return;
    let lf = -1, DV = 0.01, ph = 0;          /* lf = log10(ωτ) */
    Stage(cv, { ratio: w => wide(w) ? 0.42 : 0.78, minH: 250, maxH: 370, draw(ctx, w, h, dt) {
      const wt = Math.pow(10, lf), resp = 1 / Math.sqrt(1 + wt * wt), lag = Math.atan(wt);
      ph += dt * 1.1;
      const s = Math.sin(ph * TAU / 2), sl = Math.sin(ph * TAU / 2 - lag);
      const x0 = Math.max(16, w * 0.04), x1 = w * 0.96, jl = w * 0.47, jr = w * 0.53, yb = h * 0.82, yt = h * 0.12;
      /* 區域 */
      ctx.fillStyle = C['surface-2']; ctx.fillRect(jl, yt, jr - jl, yb - yt);
      labelCJK(ctx, (jl + jr) / 2, yb + 14, '空乏區', C['ink-3'], 10.5, 'center');
      labelCJK(ctx, x0 + 6, yb + 14, 'p 區（多出來的電子）', C['ink-2'], 11, 'left', '700');
      labelCJK(ctx, x1 - 6, yb + 14, 'n 區（多出來的電洞）', C['ink-2'], 11, 'right', '700');
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
      const H0 = (yb - yt) * 0.62, L = (jl - x0) * 0.32;
      const amp = Math.exp(DV / VT) - 1;     /* 相對高度變化 */
      const prof = (k, side) => { const d = side < 0 ? jl - k : k - jr; return Math.exp(-d / L); };
      const drawSide = (side, mult, col, fill) => {
        const xa = side < 0 ? x0 : jr, xb = side < 0 ? jl : x1;
        ctx.beginPath(); ctx.moveTo(xa, yb);
        for (let k = 0; k <= 80; k++) { const x = lerp(xa, xb, k / 80); ctx.lineTo(x, yb - H0 * mult * prof(x, side)); }
        ctx.lineTo(xb, yb); ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); } else { ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.stroke(); }
      };
      const kk = Math.min(amp, 0.6), mNow = 1 + kk * resp * sl;
      [-1, 1].forEach(side => {
        drawSide(side, 1 + kk * resp, null, C['p-real-w'] || C['surface-3']);
        drawSide(side, 1, C['ink-3']);
        drawSide(side, mNow, C.accent);
      });
      labelCJK(ctx, w / 2, yt - 2, '外加電壓 V<sub>DQ</sub> ± ΔV：' + (s >= 0 ? '↑ 推多一點' : '↓ 放鬆一點'), C['ink-2'], 11.5, 'center', '700');
      labelCJK(ctx, x0 + 6, yt + 14, '灰線：直流時的庫存　藍：現在　淺色：庫存跟得上的範圍', C['ink-3'], 10.5, 'left');
      /* 右上角：跟得上幾 % */
      labelCJK(ctx, x1 - 4, yt + 34, 'ΔQ 跟得上 ' + Math.round(resp * 100) + '%', C.accent, 13, 'right', '700');
    } });
    function msg() {
      const wt = Math.pow(10, lf), resp = 1 / Math.sqrt(1 + wt * wt);
      setHTML('cd-r', Math.round(resp * 100) + ' %');
      setHTML('cd-msg', wt < 0.3 ? '<b>頻率低</b>：電壓變得慢，少數載子有時間進出「倉庫」，ΔQ 完全跟上 → 擴散電容 C<sub>d</sub> = ΔQ/ΔV 完整表現出來。'
        : wt < 3 ? '頻率跟少數載子壽命 τ 差不多：倉庫只跟得上一部分，而且<b>慢半拍</b>（相位落後）→ C<sub>d</sub> 開始變小。'
        : '<b>頻率太高</b>：電壓才剛往上、馬上又往下，載子來不及進出，ΔQ 很小 → C<sub>d</sub> = dQ/dV 變小（講義 1-15）。');
    }
    bindRange('cd-f', x => 'ωτ = ' + (Math.pow(10, x) < 1 ? Math.pow(10, x).toFixed(2) : Math.pow(10, x).toFixed(1)), x => { lf = x; msg(); });
    bindRange('cd-dv', x => (x * 1e3).toFixed(0) + ' mV', x => { DV = x; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     06 小訊號等效電路：r_d ∥ C 的阻抗 vs 頻率
     ══════════════════════════════════════════════════════════ */
  (function zin() {
    const cv = document.getElementById('cv-zin'); if (!cv) return;
    let lI = 0, lT = Math.log10(10), CJ = 2e-12, st;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.44 : 0.8, minH: 250, maxH: 380, draw(ctx, w, h) {
      const I = Math.pow(10, lI) * 1e-3, tau = Math.pow(10, lT) * 1e-9, rd = VT / I, Cd = tau * I / (2 * VT), Ct = Cd + CJ;
      const Z = f => rd / Math.sqrt(1 + Math.pow(TAU * f * rd * Ct, 2));
      const A = box(w, h, 0.12, 0.08, 0.96, 0.84);
      const F = frame(ctx, A, { logx: true, logy: true, v0: 3, v1: 10, i0: -1, i1: 3, vt: [[1e3, '1k'], [1e5, '100k'], [1e7, '10M'], [1e9, '1G']], it: [[0.1, '0.1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1k']], xl: 'f (Hz)', yl: '|Z| (Ω)' });
      plot(ctx, { X: v => F.X(Math.pow(10, v)), Y: F.Y, L: F.L, R: F.R, T: F.T, B: F.B }, v => Z(Math.pow(10, v)), 3, 10, C.accent, 2.6);
      const fc = 1 / (TAU * rd * Ct);
      if (fc > 1e3 && fc < 1e10) {
        dashLine(ctx, F.X(fc), F.T, F.X(fc), F.B, C['ink-3']);
        dot(ctx, F.X(fc), F.Y(rd / Math.SQRT2), 5.5, C.accent);
        labelCJK(ctx, F.X(fc) + 6, F.T + 12, 'f<sub>c</sub> = ' + fmtF(fc), C.accent, 11.5, 'left', '700');
      }
      labelCJK(ctx, F.L + 8, F.Y(Math.min(rd, 900)) - 12, '低頻：|Z| = r<sub>d</sub> = ' + fmtR(rd), C.ink, 11.5, 'left', '700');
      labelCJK(ctx, F.R - 4, F.B - 12, '高頻：電容把它「短路」', C['ink-3'], 11, 'right');
    } });
    function msg() {
      const I = Math.pow(10, lI) * 1e-3, tau = Math.pow(10, lT) * 1e-9, rd = VT / I, Cd = tau * I / (2 * VT), fc = 1 / (TAU * rd * (Cd + CJ));
      setHTML('zi-rd', fmtR(rd)); setHTML('zi-cd', fmtC(Cd)); setHTML('zi-fc', fmtF(fc));
      setHTML('zi-msg', 'Y = 1/r<sub>d</sub> + jωC：頻率低時電容像斷路，看到的就是 r<sub>d</sub>；過了 f<sub>c</sub> 電容的阻抗 1/(ωC) 比 r<sub>d</sub> 小，交流從電容「抄捷徑」，|Z| 一路往下掉。' +
        (Cd > 5 * CJ ? '這個電流下 <b>C<sub>d</sub> ≫ C<sub>j</sub></b>，順偏主角是擴散電容。' : '電流小，C<sub>d</sub> 不大，C<sub>j</sub> 也要算進去。'));
      st.redraw();
    }
    bindRange('zi-i', x => fmtA(Math.pow(10, x) * 1e-3), x => { lI = x; msg(); });
    bindRange('zi-t', x => Math.pow(10, x).toFixed(1) + ' ns', x => { lT = x; msg(); });
    bindRange('zi-cj', x => x.toFixed(1) + ' pF', x => { CJ = x * 1e-12; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     07 開關暫態：順偏切到逆偏，電流倒流一陣子
     ══════════════════════════════════════════════════════════ */
  const swModel = (IF, IR, tau, sbd) => {
    const ts = sbd ? 0 : tau * Math.log(1 + IF / IR), tf = sbd ? tau * 0.05 : tau * 0.5;    /* t_f：降到 10 % 的時間（示意） */
    return { ts, tf, k: tf / Math.log(10) };
  };
  window.__p6.swModel = swModel;
  (function swTrans() {
    const cv = document.getElementById('cv-sw'); if (!cv) return;
    let IF = 5, IR = 5, TAU_ = 20, sbd = false, play = 0;
    const VR = 5;
    Stage(cv, { ratio: w => wide(w) ? 0.52 : 1.0, minH: 300, maxH: 440, draw(ctx, w, h, dt) {
      const m = swModel(IF, IR, TAU_, sbd), Tend = Math.max(60, (m.ts + 4 * m.tf) * 1.35), T0 = -Tend * 0.22;
      play = (play + dt * Tend * 0.32) % (Tend - T0 + 10);
      const tNow = T0 + play;
      const iD = t => t < 0 ? IF : t < m.ts ? -IR : -IR * Math.exp(-(t - m.ts) / m.k);
      const vD = t => t < 0 ? 0.7 : t < m.ts ? 0.7 - 0.5 * (t / Math.max(m.ts, 1e-9)) : -VR * (1 - Math.exp(-(t - m.ts) / m.k)) + 0.2 * Math.exp(-(t - m.ts) / m.k);
      const Q = t => t < 0 ? 1 : t < m.ts ? Math.max(0.05, 1 - t / Math.max(m.ts, 1e-9) * 0.95) : 0.05 * Math.exp(-(t - m.ts) / m.k);
      const x0 = Math.max(56, w * 0.11), x1 = w * 0.96;
      const rows = [['v<sub>S</sub>', -VR - 0.6, VR + 0.6, t => t < 0 ? VR : -VR], ['i<sub>D</sub> (mA)', -IR * 1.25, IF * 1.25, iD], ['v<sub>D</sub> (V)', -VR - 0.6, 1.2, vD]];
      const rh = (h * 0.74) / 3;
      const X = t => lerp(x0, x1, (t - T0) / (Tend - T0));
      rows.forEach((r, k) => {
        const y0 = h * 0.04 + k * rh + 8, y1 = y0 + rh - 16;
        const Y = v => lerp(y1, y0, (v - r[1]) / (r[2] - r[1]));
        ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke();
        labelCJK(ctx, x0 - 6, (y0 + y1) / 2, r[0], C['ink-2'], 11, 'right', '700');
        ctx.strokeStyle = k === 1 ? C.accent : C.ink; ctx.lineWidth = k === 1 ? 2.6 : 2; ctx.beginPath();
        for (let n = 0; n <= 300; n++) { const t = T0 + (Tend - T0) * n / 300; const y = Y(r[3](t)); n ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y); }
        ctx.stroke();
        if (k === 1) {
          label(ctx, X(T0) + 4, Y(IF) - 9, '+I<sub>F</sub>', C.accent, 10.5, 'left', '700');
          label(ctx, X(m.ts / 2 + 0.01), Y(-IR) + 10, '−I<sub>R</sub>', C.accent, 10.5, 'center', '700');
        }
      });
      /* t_s、t_f 區間 */
      const yb = h * 0.04 + 3 * rh;
      ctx.fillStyle = C['p-real-w'] || C['surface-2']; ctx.globalAlpha = 0.5;
      if (m.ts > 0) ctx.fillRect(X(0), h * 0.04, X(m.ts) - X(0), yb - h * 0.04);
      ctx.globalAlpha = 1;
      dashLine(ctx, X(0), h * 0.03, X(0), yb, C['ink-3']); dashLine(ctx, X(m.ts), h * 0.03, X(m.ts), yb, C['ink-3']); dashLine(ctx, X(m.ts + m.tf), h * 0.03, X(m.ts + m.tf), yb, C['ink-3']);
      if (m.ts > 0) labelCJK(ctx, (X(0) + X(m.ts)) / 2, yb + 10, 't<sub>s</sub> 儲存', C.accent, 11, 'center', '700');
      labelCJK(ctx, (X(m.ts) + X(m.ts + m.tf)) / 2 + (m.ts > 0 ? 0 : 12), yb + (m.ts > 0 ? 24 : 10), 't<sub>f</sub> 掉落', C['ink-2'], 11, 'center', '700');
      /* 播放線 + 庫存條 */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(X(Math.min(tNow, Tend)), h * 0.03); ctx.lineTo(X(Math.min(tNow, Tend)), yb); ctx.stroke();
      const q = Q(Math.min(tNow, Tend));
      const bw = Math.min(160, w * 0.3);
      ctx.fillStyle = C['surface-3'] || C['surface-2']; ctx.fillRect(x1 - bw, h - 14, bw, 9);
      ctx.fillStyle = C.accent; ctx.fillRect(x1 - bw, h - 14, bw * q, 9);
      labelCJK(ctx, x1 - bw - 6, h - 10, '儲存的少數載子', C['ink-2'], 10.5, 'right');
    } });
    function msg() {
      const m = swModel(IF, IR, TAU_, sbd);
      setHTML('sw-ts', sbd ? '≈ 0' : m.ts.toFixed(1) + ' ns');
      setHTML('sw-tf', m.tf.toFixed(1) + ' ns');
      setHTML('sw-msg', sbd ? '<b>蕭特基二極體</b>：電流靠多數載子，沒有少數載子「庫存」→ 幾乎沒有 t<sub>s</sub>，一切就關（§09）。'
        : '順偏時塞滿了少數載子。一切到逆偏，這些載子還在，二極體像短路，電流<b>反過來</b>流（−I<sub>R</sub>）把它們掃出去 —— 這段是 <b>t<sub>s</sub></b>。掃完了空乏區才重建，電流在 <b>t<sub>f</sub></b> 內掉回 0。' +
          (IF > IR * 1.5 ? ' I<sub>F</sub> 大（庫存多）、I<sub>R</sub> 小（掃得慢）→ t<sub>s</sub> 長。' : IR > IF * 1.5 ? ' I<sub>R</sub> 大，掃得快 → t<sub>s</sub> 短。' : ''));
    }
    bindRange('sw-if', x => x.toFixed(1) + ' mA', x => { IF = x; msg(); });
    bindRange('sw-ir', x => x.toFixed(1) + ' mA', x => { IR = x; msg(); });
    bindRange('sw-tau', x => x.toFixed(0) + ' ns', x => { TAU_ = x; msg(); });
    document.querySelectorAll('[data-swd]').forEach(b => b.addEventListener('click', () => {
      sbd = b.dataset.swd === 'sbd'; document.querySelectorAll('[data-swd]').forEach(x => x.classList.toggle('solid', x === b)); msg();
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     08 光電元件：太陽能電池、光二極體、LED
     ══════════════════════════════════════════════════════════ */
  (function opto() {
    const cv = document.getElementById('cv-opto'); if (!cv) return;
    let mode = 'solar', LV = 0.6, ps = [], acc = 0, ph = 0;
    Stage(cv, { ratio: w => wide(w) ? 0.42 : 0.8, minH: 250, maxH: 360, draw(ctx, w, h, dt) {
      ph += dt;
      const x0 = w * 0.08, x1 = w * 0.92, yt = h * 0.2, yb = h * 0.62, jl = lerp(x0, x1, 0.44), jr = lerp(x0, x1, 0.56);
      const X = f => lerp(x0, x1, f), Y = f => lerp(yt, yb, f);
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, yt, x1 - x0, yb - yt);
      ctx.fillStyle = C['p-real-w'] || C['surface-3']; ctx.fillRect(jl, yt, jr - jl, yb - yt);
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.4; ctx.strokeRect(x0, yt, x1 - x0, yb - yt);
      labelCJK(ctx, lerp(x0, jl, 0.5), yb + 14, 'p', C.ink, 15, 'center', '700');
      labelCJK(ctx, lerp(jr, x1, 0.5), yb + 14, 'n', C.ink, 15, 'center', '700');
      labelCJK(ctx, (jl + jr) / 2, yb + 14, '空乏區', C['ink-3'], 10.5, 'center');
      /* 外電路 */
      const yc = h * 0.86;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x0, (yt + yb) / 2); ctx.lineTo(x0 - 10, (yt + yb) / 2); ctx.lineTo(x0 - 10, yc); ctx.lineTo(x1 + 10, yc); ctx.lineTo(x1 + 10, (yt + yb) / 2); ctx.lineTo(x1, (yt + yb) / 2); ctx.stroke();
      const mx = w / 2;
      ctx.fillStyle = C.surface; ctx.fillRect(mx - 30, yc - 12, 60, 24);
      if (mode === 'solar') { CK.resH(ctx, mx - 30, mx + 30, yc); labelCJK(ctx, mx, yc + 22, '負載 R<sub>L</sub>：被供電', C['ink-2'], 11, 'center', '700'); }
      else { CK.batH(ctx, mode === 'pd' ? mx + 20 : mx - 20, mode === 'pd' ? mx - 20 : mx + 20, yc); CK.wire(ctx, [[mx - 30, yc], [mx - 20, yc]]); CK.wire(ctx, [[mx + 20, yc], [mx + 30, yc]]);
        labelCJK(ctx, mx, yc + 22, mode === 'pd' ? '逆偏（p 接負）' : '順偏（p 接正）', C['ink-2'], 11, 'center', '700'); }
      /* 粒子 */
      const rate = mode === 'led' ? LV * 9 : LV * 10;
      acc += dt * rate;
      while (acc > 1) {
        acc -= 1;
        if (mode === 'led') { ps.push({ k: 'e', x: 0.98, y: Math.random(), vx: -0.35 }); ps.push({ k: 'h', x: 0.02, y: Math.random(), vx: 0.35 }); }
        else { const y = 0.15 + Math.random() * 0.7, x = 0.45 + Math.random() * 0.1; ps.push({ k: 'g', x, y, life: 0.25 }); ps.push({ k: 'e', x, y, vx: 0.5 }); ps.push({ k: 'h', x, y, vx: -0.5 }); }
      }
      ps.forEach(p => {
        if (p.k === 'g' || p.k === 'p') { p.life -= dt; if (p.k === 'p') p.y -= dt * 0.9; return; }
        p.x += p.vx * dt * (mode === 'led' ? 0.8 : 1);
        if (mode === 'led' && ((p.k === 'e' && p.x < 0.36) || (p.k === 'h' && p.x > 0.64)) && Math.random() < dt * 3) { p.dead = 1; ps.push({ k: 'p', x: p.x, y: p.y, life: 0.6 }); }
      });
      ps = ps.filter(p => !p.dead && (p.life === undefined || p.life > 0) && p.x > -0.02 && p.x < 1.02 && p.y > -0.6);
      if (ps.length > 400) ps.splice(0, ps.length - 400);
      ps.forEach(p => {
        const px = X(p.x), py = Y(p.y);
        if (p.k === 'e') dot(ctx, px, py, 3.4, C.accent);
        else if (p.k === 'h') { ctx.strokeStyle = C.accent; ctx.lineWidth = 1.3; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.arc(px, py, 3.6, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
        else if (p.k === 'g') { ctx.strokeStyle = C.warn; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(px, py, 8 * (1 - p.life / 0.25) + 2, 0, TAU); ctx.stroke(); }
        else { ctx.strokeStyle = C.warn; ctx.lineWidth = 1.6; ctx.beginPath(); for (let k = 0; k <= 10; k++) ctx[k ? 'lineTo' : 'moveTo'](px + 3 * Math.sin(k * 1.2), py - k * 2.2); ctx.stroke(); }
      });
      /* 進來的光 */
      if (mode !== 'led') for (let k = 0; k < 3; k++) {
        const bx = lerp(jl, jr, 0.2 + 0.3 * k), off = ((ph * 1.4 + k * 0.33) % 1);
        ctx.globalAlpha = LV; ctx.strokeStyle = C.warn; ctx.lineWidth = 1.8; ctx.beginPath();
        for (let n = 0; n <= 12; n++) ctx[n ? 'lineTo' : 'moveTo'](bx + 4 * Math.sin(n * 1.3), yt - 40 + off * 30 + n * 2.4); ctx.stroke(); ctx.globalAlpha = 1;
      }
      labelCJK(ctx, w / 2, h * 0.07, mode === 'solar' ? '光 → 電：產生的電子電洞被空乏區電場分開，推電流給負載' : mode === 'pd' ? '光 → 電：逆偏只有很小的 I<sub>S</sub>，照光多出光電流 I<sub>ph</sub>' : '電 → 光：注入的少數載子跟多數載子復合，放出光子', C['ink-2'], 11.5, 'center', '700');
    } });
    function msg() {
      setHTML('op-i', mode === 'led' ? '光 ∝ 電流：' + Math.round(LV * 20) + ' mA' : 'I<sub>ph</sub> ∝ 光強：' + Math.round(LV * 100) + ' %');
      setHTML('op-msg', mode === 'solar' ? '<b>太陽能電池</b>：不加電源。光在空乏區生出電子電洞對，電場把電子推到 n、電洞推到 p，就像一顆電池在推電流 → <b>發電</b>（材料 Si、GaAs、III-V 化合物）。'
        : mode === 'pd' ? '<b>光二極體</b>：故意<b>逆偏</b>。沒光時只有很小的逆向飽和電流；光越強，被掃出來的電子電洞越多，光電流 ∝ 光強 → 拿來<b>偵測光</b>。'
        : '<b>LED</b>：<b>順偏</b>。電子、電洞擴散過空乏區變成「多出來的少數載子」，跟對面的多數載子<b>復合</b>，能量用光子放出來。');
    }
    bindRange('op-l', x => Math.round(x * 100) + ' %', x => { LV = x; msg(); });
    document.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.op; ps = []; document.querySelectorAll('[data-op]').forEach(x => x.classList.toggle('solid', x === b));
      const lb = document.querySelector('label[for="op-l"]'); if (lb) lb.firstChild.textContent = mode === 'led' ? '順向電流 ' : '光強 ';
      msg();
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     09 蕭特基 vs pn：同樣的電流，電壓差多少
     ══════════════════════════════════════════════════════════ */
  (function sbd() {
    const cv = document.getElementById('cv-sbd'); if (!cv) return;
    let lI = 0, logy = false, st;
    const ISP = 1e-12, ISS = 1e-8;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.44 : 0.82, minH: 250, maxH: 380, draw(ctx, w, h) {
      const I = Math.pow(10, lI), vp = VT * Math.log(I * 1e-3 / ISP + 1), vs = VT * Math.log(I * 1e-3 / ISS + 1);
      const A = box(w, h, 0.1, 0.08, 0.96, 0.86);
      const F = logy ? frame(ctx, A, { logy: true, v0: 0, v1: 0.75, i0: -4, i1: 1.3, vt: [[0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6']], it: [[1e-3, '0.001'], [1e-2, '0.01'], [0.1, '0.1'], [1, '1'], [10, '10']], xl: 'v<sub>D</sub> (V)', yl: 'i<sub>D</sub> (mA, 對數)' })
        : frame(ctx, A, { v0: 0, v1: 0.75, i0: 0, i1: 5, vt: [[0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6']], it: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], xl: 'v<sub>D</sub> (V)', yl: 'i<sub>D</sub> (mA)' });
      plot(ctx, F, v => ISS * (Math.exp(v / VT) - 1) * 1e3, 0.001, 0.75, C.accent, 2.6);
      plot(ctx, F, v => ISP * (Math.exp(v / VT) - 1) * 1e3, 0.001, 0.75, C.ink, 2.4);
      dashLine(ctx, F.L, F.Y(I), F.R, F.Y(I), C['ink-3']);
      dot(ctx, F.X(vs), F.Y(I), 6, C.accent); dot(ctx, F.X(vp), F.Y(I), 6, C.ink);
      arrow(ctx, F.X(vs) + 6, F.Y(I) - 14, F.X(vp) - 6, F.Y(I) - 14, C['ink-2'], 1.4);
      labelCJK(ctx, (F.X(vs) + F.X(vp)) / 2, F.Y(I) - 26, '差 ' + ((vp - vs) * 1e3).toFixed(0) + ' mV', C['ink-2'], 11.5, 'center', '700');
      labelCJK(ctx, F.X(vs) - 8, F.Y(I) + 14, '蕭特基', C.accent, 12, 'right', '700');
      labelCJK(ctx, F.X(vp) + 8, F.Y(I) + 14, 'pn', C.ink, 12, 'left', '700');
    } });
    function msg() {
      const I = Math.pow(10, lI) * 1e-3, vp = VT * Math.log(I / ISP + 1), vs = VT * Math.log(I / ISS + 1);
      setHTML('sb-vp', vp.toFixed(3) + ' V'); setHTML('sb-vs', vs.toFixed(3) + ' V'); setHTML('sb-dv', ((vp - vs) * 1e3).toFixed(0) + ' mV');
      setHTML('sb-msg', '不管電流多少，差距都是 V<sub>T</sub> ln(I<sub>S,SBD</sub>/I<sub>S,pn</sub>) = 0.026 × ln(10<sup>4</sup>) ≈ <b>0.24 V</b>：I<sub>S</sub> 大 10<sup>4</sup> 倍 → 同樣電流電壓少 4 × 60 mV。' + (logy ? '對數座標下兩條是<b>平行線</b>，水平距離固定。' : '按「對數座標」看兩條線其實平行。'));
      st.redraw();
    }
    bindRange('sb-i', x => fmtA(Math.pow(10, x) * 1e-3), x => { lI = x; msg(); });
    document.querySelectorAll('[data-sby]').forEach(b => b.addEventListener('click', () => {
      logy = b.dataset.sby === 'log'; document.querySelectorAll('[data-sby]').forEach(x => x.classList.toggle('solid', x === b)); msg();
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     10 齊納穩壓：電源亂動，輸出不動
     ══════════════════════════════════════════════════════════ */
  const zener = (VPS, Rk, rz, VZ0) => {
    const R = Rk * 1e3;
    if (VPS <= VZ0) return { on: false, I: 0, V: VPS };
    const I = (VPS - VZ0) / (R + rz); return { on: true, I, V: VZ0 + I * rz };
  };
  window.__p6.zener = zener;
  (function zd() {
    const cv = document.getElementById('cv-zd'); if (!cv) return;
    let VPS = 10, R = 1.47, RZ = 0, st;
    const VZ0 = 5.6, PMAX = 0.25;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.44 : 0.82, minH: 250, maxH: 380, draw(ctx, w, h) {
      const z = zener(VPS, R, RZ, VZ0), imax = Math.max(5, (VPS / R) * 1.15);
      const A = box(w, h, 0.1, 0.08, 0.96, 0.86);
      const F = frame(ctx, A, { v0: 0, v1: 20.5, i0: 0, i1: imax, vt: [[5.6, '5.6'], [10, '10'], [15, '15'], [20, '20']], it: [], xl: 'V<sub>Z</sub> (V)', yl: 'I<sub>Z</sub> (mA)' });
      /* 齊納特性（正值畫：V_Z、I_Z 用齊納自己的定義） */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(F.X(0), F.Y(0)); ctx.lineTo(F.X(VZ0), F.Y(0));
      const slope = RZ > 0 ? 1000 / RZ : 1e9; ctx.lineTo(F.X(VZ0 + imax / slope), F.Y(imax)); ctx.stroke();
      /* 負載線 */
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(F.X(0), F.Y(Math.min(imax, VPS / R))); ctx.lineTo(F.X(VPS), F.Y(0)); ctx.stroke();
      dot(ctx, F.X(z.V), F.Y(z.I * 1e3), 7, z.on ? C.accent : C.warn);
      labelCJK(ctx, F.X(z.V) + 10, F.Y(z.I * 1e3) - 10, 'Q', z.on ? C.accent : C.warn, 13, 'left', '700');
      labelCJK(ctx, F.X(VZ0) + 6, F.T + 10, '崩潰區：牆在 V<sub>Z0</sub> = 5.6 V', C.accent, 11.5, 'left', '700');
      labelCJK(ctx, F.X(Math.min(VPS, 19)) - 4, F.Y(0) - 12, '負載線', C['ink-2'], 11, 'right');
    } });
    function msg() {
      const z = zener(VPS, R, RZ, VZ0), P = z.I * z.V;
      setHTML('zd-v', z.V.toFixed(2) + ' V'); setHTML('zd-i', (z.I * 1e3).toFixed(2) + ' mA'); setHTML('zd-p', (P * 1e3).toFixed(1) + ' mW');
      setHTML('zd-msg', !z.on ? 'V<sub>PS</sub> 還不到 5.6 V，推不進崩潰區：齊納二極體 OFF，輸出 = V<sub>PS</sub>，沒有穩壓。'
        : P > PMAX ? '<b>功率 ' + (P * 1e3).toFixed(0) + ' mW 超過額定（這裡假設 250 mW）</b>：齊納二極體會燒掉。把 R 調大，限制電流。'
        : 'V<sub>PS</sub> 從 6 V 拉到 20 V 試試看：負載線一直平移，但 Q 點都卡在 5.6 V 那面牆上 —— <b>輸出穩住了</b>，多出來的電壓全部落在 R 上。' + (RZ > 0 ? ' r<sub>z</sub> = ' + RZ + ' Ω 讓牆稍微斜一點，輸出會跟著電流多 ' + (z.I * RZ * 1e3).toFixed(0) + ' mV。' : ''));
      st.redraw();
    }
    bindRange('zd-vps', x => x.toFixed(1) + ' V', x => { VPS = x; msg(); });
    bindRange('zd-r', x => x.toFixed(2) + ' kΩ', x => { R = x; msg(); });
    bindRange('zd-rz', x => x.toFixed(0) + ' Ω', x => { RZ = x; msg(); });
  })();
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, lerp, sup, liveExample } = E;
  const P6 = window.__p6, VT = 0.026;
  const f2 = x => x.toFixed(2), f3 = x => x.toFixed(3), f4 = x => x.toFixed(4);
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); };
  /* 橫條比較圖 */
  function bars(ctx, w, h, rows, fmt) {
    const x0 = Math.max(w * 0.3, 120), x1 = w * 0.78, mx = Math.max(1e-30, ...rows.map(r => Math.abs(r[1])));
    rows.forEach(([nm, v, col], k) => {
      const y = h * ((k + 0.6) / (rows.length + 0.2)), len = Math.max(2, (x1 - x0) * Math.abs(v) / mx);
      ctx.fillStyle = col; ctx.fillRect(x0, y - 8, len, 16);
      labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
      labelCJK(ctx, Math.min(x0 + len + 6, w - 70), y, fmt(v), col, 11, 'left', '700');
    });
  }
  /* 對數橫條：差幾個 0 變成看得見的距離 */
  function logBars(ctx, w, h, rows, lo, hi, unit) {
    const x0 = Math.max(w * 0.3, 120), x1 = w * 0.9;
    const X = v => lerp(x0, x1, (Math.log10(v) - lo) / (hi - lo));
    for (let d = Math.ceil(lo); d <= hi; d++) { ctx.strokeStyle = C['line-soft'] || C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(Math.pow(10, d)), h * 0.08); ctx.lineTo(X(Math.pow(10, d)), h * 0.88); ctx.stroke(); label(ctx, X(Math.pow(10, d)), h * 0.95, '10' + sup(d), C['ink-3'], 9.5); }
    rows.forEach(([nm, v, col], k) => {
      const y = h * ((k + 0.6) / (rows.length + 0.4)) * 0.9;
      ctx.fillStyle = col; ctx.fillRect(x0, y - 8, Math.max(2, X(v) - x0), 16);
      labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
    });
    if (unit) labelCJK(ctx, x1, h * 0.04 + 4, unit, C['ink-3'], 10, 'right');
  }


  /* ── 00 補課：讀小訊號圖 ── */
  liveExample('#ex-bs', {
    title: '例題 · 從圖上讀電流：電壓最大、最小時電流多少？',
    ratio: 0.55, minH: 240, maxH: 380,
    givens: [
      { id: 'xbs-v', label: '直流 V<sub>DQ</sub>', min: 0.62, max: 0.7, step: 0.001, value: 0.677, fmt: v => v.toFixed(3) + ' V' },
      { id: 'xbs-a', label: '交流峰值', min: 1, max: 40, step: 1, value: 15, fmt: v => v.toFixed(0) + ' mV' }
    ],
    compute: g => {
      const IS = 1e-14, VQ = g['xbs-v'], A = g['xbs-a'] * 1e-3, iv = v => IS * Math.exp(v / VT) * 1e3;
      return { VQ, A, IQ: iv(VQ), imax: iv(VQ + A), imin: iv(VQ - A) };
    },
    question: (g, r) => '二極體 I<sub>S</sub> = 10<sup>−14</sup> A，電壓 v<sub>D</sub>(t) = <b>' + f3(r.VQ) + '</b> + <b>' + (r.A * 1e3).toFixed(0) + ' mV</b>·sin ωt。照圖上的做法（電壓往上找曲線、再往左讀電流），求電壓最大、最小那一刻的電流，以及直流電流 I<sub>DQ</sub>。',
    questionEn: (g, r) => 'A diode (I<sub>S</sub> = 10<sup>−14</sup> A) has v<sub>D</sub>(t) = ' + f3(r.VQ) + ' + ' + (r.A * 1e3).toFixed(0) + ' mV · sin ωt. Using the curve, find the current at the maximum and minimum of the voltage, and the dc current I<sub>DQ</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　沒有交流的時候（直流）。', note: '電壓停在 V<sub>DQ</sub>，往上碰到曲線就是 Q 點。', eq: 'I<sub>DQ</sub> = 10<sup>−14</sup> e<sup>' + f3(r.VQ) + '/0.026</sup> = ' + f3(r.IQ) + ' mA' },
      { t: 'Step 2　電壓最大那一刻。', note: '下面的電壓波形最靠右的那一點，往上碰到曲線。', eq: 'v<sub>D</sub> = ' + f3(r.VQ + r.A) + ' V → i<sub>D</sub> = ' + f3(r.imax) + ' mA（多 ' + f3(r.imax - r.IQ) + '）' },
      { t: 'Step 3　電壓最小那一刻。', eq: 'v<sub>D</sub> = ' + f3(r.VQ - r.A) + ' V → i<sub>D</sub> = ' + f3(r.imin) + ' mA（少 ' + f3(r.IQ - r.imin) + '）' },
      { t: 'Step 4　看形狀。', note: (r.imax - r.IQ) / (r.IQ - r.imin) < 1.15 ? '多的和少的差不多：用到的那一段幾乎是直線 → 小訊號近似可以用。' : '往上多、往下少，差了 ' + (((r.imax - r.IQ) / (r.IQ - r.imin) - 1) * 100).toFixed(0) + '%：那一段已經看得出彎，交流不夠小。' }
    ],
    answer: (g, r) => 'I<sub>DQ</sub> = ' + f3(r.IQ) + ' mA；最大 ' + f3(r.imax) + ' mA、最小 ' + f3(r.imin) + ' mA',
    draw: (ctx, w, h, g, r) => { P6.fullPic(ctx, w, h, r.VQ, r.A, 0.125); }
  });

  /* ── 01 小訊號：上下晃的量一不一樣 ── */
  liveExample('#ex-ss', {
    title: '例題 · 二極體上疊 5 mV 交流，電流晃多少？',
    ratio: 0.32, minH: 150, maxH: 210,
    givens: [
      { id: 'xs-v', label: '直流 V<sub>DQ</sub>', min: 0.55, max: 0.72, step: 0.005, value: 0.6, fmt: v => v.toFixed(3) + ' V' },
      { id: 'xs-a', label: '交流峰值 V<sub>m</sub>', min: 1, max: 60, step: 1, value: 5, fmt: v => v.toFixed(0) + ' mV' }
    ],
    compute: g => {
      const IS = 1e-14, VQ = g['xs-v'], A = g['xs-a'] * 1e-3, IQ = IS * Math.exp(VQ / VT);
      const up = IQ * (Math.exp(A / VT) - 1), dn = IQ * (1 - Math.exp(-A / VT)), lin = IQ * A / VT;
      return { VQ, A, IQ, up, dn, lin, err: (up - lin) / lin * 100 };
    },
    question: (g, r) => '二極體 I<sub>S</sub> = 10<sup>−14</sup> A、V<sub>T</sub> = 0.026 V。兩端電壓 v<sub>D</sub> = <b>' + f3(r.VQ) + '</b> + <b>' + (r.A * 1e3).toFixed(0) + ' mV</b>·sin ωt。求直流電流 I<sub>DQ</sub>，以及電流往上、往下最多晃多少；跟「直線近似」i<sub>d</sub> = v<sub>d</sub>/r<sub>d</sub> 比較。',
    questionEn: (g, r) => 'A diode with I<sub>S</sub> = 10<sup>−14</sup> A has v<sub>D</sub> = ' + f3(r.VQ) + ' + ' + (r.A * 1e3).toFixed(0) + ' mV · sin ωt. Find I<sub>DQ</sub> and the positive and negative current excursions, and compare them with the linear estimate i<sub>d</sub> = v<sub>d</sub>/r<sub>d</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　先算直流（只看 V<sub>DQ</sub>）。', note: '順偏時 e 的次方遠大於 1，−1 可以丟掉。', eq: 'I<sub>DQ</sub> ≈ I<sub>S</sub>e<sup>V<sub>DQ</sub>/V<sub>T</sub></sup> = 10<sup>−14</sup> × e<sup>' + f3(r.VQ) + '/0.026</sup> = ' + P6.fmtA(r.IQ) },
      { t: 'Step 2　把總電壓代進指數，拆成兩個相乘。', note: 'e 的「加」變成「乘」：直流那一項就是 I<sub>DQ</sub>。', eq: 'i<sub>D</sub> = I<sub>S</sub>e<sup>(V<sub>DQ</sub> + v<sub>d</sub>)/V<sub>T</sub></sup> = I<sub>DQ</sub> · e<sup>v<sub>d</sub>/V<sub>T</sub></sup>' },
      { t: 'Step 3　代峰值、谷值。', note: '往上用 e<sup>+V<sub>m</sub>/V<sub>T</sub></sup>，往下用 e<sup>−V<sub>m</sub>/V<sub>T</sub></sup>。', eq: '往上 +' + P6.fmtA(r.up) + '　｜　往下 −' + P6.fmtA(r.dn) },
      { t: 'Step 4　跟直線（切線）近似比。', note: 'r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub>，i<sub>d</sub> = V<sub>m</sub>/r<sub>d</sub> = I<sub>DQ</sub>·V<sub>m</sub>/V<sub>T</sub>。', eq: '直線近似 ±' + P6.fmtA(r.lin) + '，往上那邊差 ' + r.err.toFixed(1) + ' %' },
      { t: 'Step 5　結論。', note: r.A <= 0.0052 ? 'V<sub>m</sub> = ' + (r.A * 1e3).toFixed(0) + ' mV ≪ 26 mV：上下幾乎對稱，誤差不到 10%，<b>小訊號近似成立</b>。'
        : r.A < 0.026 ? 'V<sub>m</sub> 跟 26 mV 越來越接近：上下開始不對稱，直線近似誤差 ' + r.err.toFixed(0) + '%，勉強。'
        : 'V<sub>m</sub> ≥ V<sub>T</sub>：往上衝的比往下的多很多，<b>已經不是小訊號</b>，r<sub>d</sub> 模型不能用。' }
    ],
    answer: (g, r) => 'I<sub>DQ</sub> = ' + P6.fmtA(r.IQ) + '；電流 +' + P6.fmtA(r.up) + '／−' + P6.fmtA(r.dn) + '（直線近似 ±' + P6.fmtA(r.lin) + '）',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['往上晃', r.up, C.accent], ['直線近似', r.lin, C['ink-3']], ['往下晃', r.dn, C.ink]], v => P6.fmtA(v))
  });

  /* ── 02 增量電阻（講義 1-12 的數字） ── */
  liveExample('#ex-rd', {
    title: '例題 · 講義 1-12：V<sub>DQ</sub> = 0.6 V，r<sub>d</sub> 多大？',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xr-is', label: 'I<sub>S</sub>', min: -16, max: -12, step: 1, value: -14, fmt: v => '10' + sup(v) + ' A' },
      { id: 'xr-v', label: 'V<sub>DQ</sub>', min: 0.45, max: 0.8, step: 0.005, value: 0.6, fmt: v => v.toFixed(3) + ' V' }
    ],
    compute: g => {
      const IS = Math.pow(10, g['xr-is']), V = g['xr-v'], I = IS * Math.exp(V / VT), gd = I / VT;
      return { IS, lg: g['xr-is'], V, I, gd, rd: 1 / gd, ex: Math.exp(V / VT) };
    },
    question: (g, r) => '二極體 I<sub>S</sub> = 10' + sup(r.lg) + ' A、n = 1、V<sub>T</sub> = 0.026 V，工作點 V<sub>DQ</sub> = <b>' + f3(r.V) + ' V</b>。求 I<sub>DQ</sub>、增量電導 g<sub>d</sub>、增量電阻 r<sub>d</sub>。',
    questionEn: (g, r) => 'A diode has I<sub>S</sub> = 10' + sup(r.lg) + ' A, n = 1, V<sub>T</sub> = 0.026 V, biased at V<sub>DQ</sub> = ' + f3(r.V) + ' V. Find I<sub>DQ</sub>, the incremental conductance g<sub>d</sub> and the incremental resistance r<sub>d</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　工作點電流。', note: '順偏、指數項 ≫ 1，−1 丟掉。', eq: 'I<sub>DQ</sub> ≈ I<sub>S</sub>e<sup>V<sub>DQ</sub>/V<sub>T</sub></sup> = 10' + sup(r.lg) + ' × ' + r.ex.toExponential(4).replace('e+', ' × 10<sup>') + '</sup> = ' + P6.fmtA(r.I) },
      { t: 'Step 2　對曲線微分 = 切線斜率 = 增量電導。', note: '微分 e<sup>V/V<sub>T</sub></sup> 會掉出一個 1/V<sub>T</sub>，剩下的就是 I<sub>DQ</sub>。', eq: 'g<sub>d</sub> = di<sub>D</sub>/dv<sub>D</sub>|<sub>Q</sub> = I<sub>DQ</sub>/V<sub>T</sub> = ' + (r.gd * 1e3).toFixed(3) + ' mA/V' },
      { t: 'Step 3　倒數就是增量電阻。', eq: 'r<sub>d</sub> = 1/g<sub>d</sub> = ' + P6.fmtR(r.rd) },
      { t: 'Step 4　用近似式檢查。', note: r.I < 1e-6 ? '電流不到 1 μA，r<sub>d</sub> 到幾十 kΩ —— Q 點在曲線平坦處。' : r.I > 5e-3 ? '電流好幾 mA，r<sub>d</sub> 只剩幾 Ω，二極體幾乎像短路。' : '跟講義一樣 MATCHED：兩種算法同一個答案。', eq: 'r<sub>d</sub> ≈ V<sub>T</sub>/I<sub>DQ</sub> = 0.026 / ' + r.I.toExponential(3) + ' = ' + P6.fmtR(VT / r.I) }
    ],
    answer: (g, r) => 'I<sub>DQ</sub> = ' + P6.fmtA(r.I) + '、g<sub>d</sub> = ' + (r.gd * 1e3).toFixed(3) + ' mA/V、r<sub>d</sub> = ' + P6.fmtR(r.rd),
    draw: (ctx, w, h, g, r) => logBars(ctx, w, h, [['r<sub>d</sub>', r.rd, C.accent], ['講義 247 Ω', 247, C['ink-3']]], 0, 6, 'Ω（對數）')
  });


  /* ── 02+ 用「往前推一小步」算斜率 ── */
  liveExample('#ex-rf', {
    title: '例題 · 不會微分也能算 r<sub>d</sub>：往前推一小步',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xf-i', label: 'I<sub>DQ</sub>', min: 0.1, max: 10, step: 0.1, value: 2, fmt: v => v.toFixed(1) + ' mA' },
      { id: 'xf-d', label: '一步 Δv', min: 0.1, max: 30, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' mV' }
    ],
    compute: g => {
      const I = g['xf-i'], dv = g['xf-d'] * 1e-3, I2 = I * Math.exp(dv / VT), ss = (I2 - I) / dv, sl = I / VT;
      return { I, dv, I2, ss, sl, err: (ss / sl - 1) * 100, rd: VT / (I * 1e-3), rs: 1 / ss * 1e3 };
    },
    question: (g, r) => '二極體停在 I<sub>DQ</sub> = <b>' + r.I.toFixed(1) + ' mA</b>（V<sub>T</sub> = 26 mV）。電壓多推 Δv = <b>' + (r.dv * 1e3).toFixed(1) + ' mV</b>，電流變多少？用 Δi/Δv 估斜率和 r<sub>d</sub>，跟微分的答案 I<sub>DQ</sub>/V<sub>T</sub> 比。',
    questionEn: (g, r) => 'A diode is biased at I<sub>DQ</sub> = ' + r.I.toFixed(1) + ' mA. If the voltage increases by Δv = ' + (r.dv * 1e3).toFixed(1) + ' mV, find the new current, estimate the slope Δi/Δv and r<sub>d</sub>, and compare with I<sub>DQ</sub>/V<sub>T</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　多推 Δv，電流變成幾倍？', note: '指數的加法變乘法：i = I<sub>DQ</sub> · e<sup>Δv/V<sub>T</sub></sup>。', eq: 'i = ' + r.I.toFixed(1) + ' × e<sup>' + (r.dv * 1e3).toFixed(1) + '/26</sup> = ' + r.I2.toFixed(4) + ' mA' },
      { t: 'Step 2　斜率 ≈ Δi/Δv。', eq: '(' + r.I2.toFixed(4) + ' − ' + r.I.toFixed(1) + ') / ' + (r.dv * 1e3).toFixed(1) + ' mV = ' + r.ss.toFixed(2) + ' mA/V → r ≈ ' + r.rs.toFixed(2) + ' Ω' },
      { t: 'Step 3　微分的答案。', note: '每多 1 mV，電流多「現在的 1/26」。', eq: 'I<sub>DQ</sub>/V<sub>T</sub> = ' + r.sl.toFixed(2) + ' mA/V → r<sub>d</sub> = 26 mV ÷ ' + r.I.toFixed(1) + ' mA = ' + r.rd.toFixed(2) + ' Ω' },
      { t: 'Step 4　比一比。', note: r.err < 2 ? '只差 ' + r.err.toFixed(1) + '%：一步夠小，就是微分（切線）的答案。' : '差了 ' + r.err.toFixed(0) + '%：一步太大，曲線已經彎了。把 Δv 改小（例如 0.1 mV）就會對上。' }
    ],
    answer: (g, r) => 'Δi/Δv ≈ ' + r.ss.toFixed(2) + ' mA/V（微分：' + r.sl.toFixed(2) + '）；r<sub>d</sub> = ' + r.rd.toFixed(2) + ' Ω',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['這一步的斜率', r.ss, C.ink], ['微分 I<sub>DQ</sub>/V<sub>T</sub>', r.sl, C.accent]], v => v.toFixed(1) + ' mA/V')
  });

  /* ── 03 Example 1.11 ── */
  liveExample('#ex-111', {
    title: '例題 · Example 1.11：先 DC 再 AC',
    ratio: 0.32, minH: 150, maxH: 210,
    givens: [
      { id: 'x1-v', label: 'V<sub>PS</sub>', min: 1, max: 12, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'x1-r', label: 'R', min: 0.5, max: 20, step: 0.5, value: 5, fmt: v => v.toFixed(1) + ' kΩ' },
      { id: 'x1-a', label: 'v<sub>i</sub> 峰值', min: 0.01, max: 1, step: 0.01, value: 0.1, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => {
      const V = g['x1-v'], R = g['x1-r'], A = g['x1-a'], IQ = (V - 0.6) / R, rd = VT / IQ, id = A / (rd + R), vo = id * R;   /* kΩ、mA */
      return { V, R, A, IQ, VO: IQ * R, rd, id, vo, vd: id * rd };
    },
    question: (g, r) => '電路：v<sub>i</sub> 與 V<sub>PS</sub> 串聯，經過二極體接到 R，輸出 v<sub>O</sub> 取在 R 上。V<sub>PS</sub> = <b>' + r.V.toFixed(1) + ' V</b>、R = <b>' + r.R.toFixed(1) + ' kΩ</b>、V<sub>γ</sub> = 0.6 V、v<sub>i</sub> = <b>' + f2(r.A) + ' sin ωt</b> V。求 I<sub>DQ</sub>、V<sub>O</sub>、r<sub>d</sub>、i<sub>d</sub>、v<sub>o</sub>。',
    questionEn: (g, r) => 'Analyze the circuit with V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V, R = ' + r.R.toFixed(1) + ' kΩ, V<sub>γ</sub> = 0.6 V and v<sub>i</sub> = ' + f2(r.A) + ' sin ωt (V). Find the dc quiescent current, the dc output voltage, the small-signal diode resistance, and the ac diode current and output voltage.',
    steps: (g, r) => [
      { t: 'Step 1　DC 分析：令 v<sub>i</sub> = 0（短路），二極體換成 0.6 V 電池。', note: '先把 Q 點找出來，r<sub>d</sub> 要靠它。', eq: 'I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/R = (' + r.V.toFixed(1) + ' − 0.6)/' + r.R.toFixed(1) + ' = ' + f3(r.IQ) + ' mA' },
      { t: 'Step 2　直流輸出。', eq: 'V<sub>O</sub> = I<sub>DQ</sub>R = ' + f3(r.IQ) + ' × ' + r.R.toFixed(1) + ' = ' + f2(r.VO) + ' V' },
      { t: 'Step 3　用 Q 點算 r<sub>d</sub>。', note: '交流阻抗跟直流工作點有關（講義 1-10）。', eq: 'r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub> = 0.026/' + f3(r.IQ) + ' mA = ' + P6.fmtR(r.rd * 1e3) },
      { t: 'Step 4　AC 分析：令 V<sub>PS</sub> = 0（交流接地），二極體換成 r<sub>d</sub>，寫 KVL。', eq: 'v<sub>i</sub> = i<sub>d</sub>(r<sub>d</sub> + R)　⟹　i<sub>d</sub> = ' + f2(r.A) + '/(' + f4(r.rd) + ' + ' + r.R.toFixed(1) + ') kΩ = ' + (r.id * 1e3).toFixed(1) + ' sin ωt μA' },
      { t: 'Step 5　交流輸出。', eq: 'v<sub>o</sub> = i<sub>d</sub>R = ' + f4(r.vo) + ' sin ωt V' },
      { t: 'Step 6　合起來，順便檢查小訊號假設。', note: r.vd < 0.0026 ? '二極體上的交流 v<sub>d</sub> = i<sub>d</sub>r<sub>d</sub> = ' + (r.vd * 1e3).toFixed(2) + ' mV ≪ 26 mV，小訊號成立 ✓。' : '二極體上的 v<sub>d</sub> = ' + (r.vd * 1e3).toFixed(1) + ' mV，已經不算 ≪ 26 mV，結果只能當估計。',
        eq: 'v<sub>O</sub>(t) = ' + f2(r.VO) + ' + ' + f4(r.vo) + ' sin ωt V' + (r.A > r.V - 0.6 ? '　⚠ 峰值 v<sub>i</sub> 大於 V<sub>PS</sub> − V<sub>γ</sub>，負半週會截止！' : '') }
    ],
    answer: (g, r) => 'I<sub>DQ</sub> = ' + f3(r.IQ) + ' mA、V<sub>O</sub> = ' + f2(r.VO) + ' V、r<sub>d</sub> = ' + P6.fmtR(r.rd * 1e3) + '、i<sub>d</sub> = ' + (r.id * 1e3).toFixed(1) + ' sin ωt μA、v<sub>o</sub> = ' + f4(r.vo) + ' sin ωt V',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(52, w * 0.12), x1 = w * 0.95, top = r.VO + r.vo * 1.6 + 0.2;
      const Y = v => lerp(h * 0.88, h * 0.1, v / top);
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.moveTo(x0, h * 0.06); ctx.lineTo(x0, Y(0)); ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.beginPath(); ctx.moveTo(x0, Y(r.VO)); ctx.lineTo(x1, Y(r.VO)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let n = 0; n <= 200; n++) { const u = n / 200, v = r.VO + r.vo * Math.sin(u * 6 * Math.PI); n ? ctx.lineTo(lerp(x0, x1, u), Y(v)) : ctx.moveTo(lerp(x0, x1, u), Y(v)); } ctx.stroke();
      label(ctx, x0 - 6, Y(r.VO), f2(r.VO), C['ink-2'], 10, 'right');
      labelCJK(ctx, x1, h * 0.08, 'v<sub>O</sub>(t)：直流 ' + f2(r.VO) + ' V，上面只晃 ±' + f4(r.vo) + ' V', C.accent, 11, 'right', '700');
    }
  });

  /* ── 04 Q 點夠不夠高 ── */
  liveExample('#ex-q', {
    title: '例題 · 這個 Q 點撐得住多大的 v<sub>i</sub>？',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xq-v', label: 'V<sub>PS</sub>', min: 0.8, max: 10, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xq-r', label: 'R', min: 0.5, max: 20, step: 0.5, value: 5, fmt: v => v.toFixed(1) + ' kΩ' },
      { id: 'xq-a', label: 'v<sub>i</sub> 峰值', min: 0.05, max: 8, step: 0.05, value: 1, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => {
      const V = g['xq-v'], R = g['xq-r'], A = g['xq-a'], IQ = (V - 0.6) / R, rd = VT / IQ, vd = A * rd / (rd + R), lim = V - 0.6;
      return { V, R, A, IQ, rd, vd, lim, clip: A > lim };
    },
    question: (g, r) => '同 Example 1.11 的電路（V<sub>γ</sub> = 0.6 V）：V<sub>PS</sub> = <b>' + r.V.toFixed(1) + ' V</b>、R = <b>' + r.R.toFixed(1) + ' kΩ</b>，輸入 v<sub>i</sub> 峰值 <b>' + f2(r.A) + ' V</b>。(a) 負半週二極體會不會 OFF？(b) 二極體兩端的交流 v<sub>d</sub> 夠不夠「小」？',
    questionEn: (g, r) => 'For the circuit of Example 1.11 with V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V, R = ' + r.R.toFixed(1) + ' kΩ and an input peak of ' + f2(r.A) + ' V: (a) does the diode turn off during the negative half-cycle? (b) is the ac diode voltage small enough for the small-signal model?',
    steps: (g, r) => [
      { t: 'Step 1　Q 點。', eq: 'I<sub>DQ</sub> = (' + r.V.toFixed(1) + ' − 0.6)/' + r.R.toFixed(1) + ' = ' + f3(r.IQ) + ' mA' },
      { t: 'Step 2　負半週最低點，二極體還推得開嗎？', note: '定電壓降模型：只要 V<sub>PS</sub> + v<sub>i</sub> &gt; 0.6 V 就 ON。最低點 v<sub>i</sub> = −峰值。', eq: 'V<sub>PS</sub> − V<sub>m</sub> = ' + r.V.toFixed(1) + ' − ' + f2(r.A) + ' = ' + (r.V - r.A).toFixed(2) + ' V ' + (r.clip ? '&lt;' : '&gt;') + ' 0.6 V' },
      { t: 'Step 3　二極體上的交流有多大。', note: 'AC 電路裡 r<sub>d</sub> 跟 R 分壓。', eq: 'v<sub>d</sub> = V<sub>m</sub> · r<sub>d</sub>/(r<sub>d</sub> + R) = ' + f2(r.A) + ' × ' + P6.fmtR(r.rd * 1e3) + '/(' + P6.fmtR(r.rd * 1e3) + ' + ' + r.R.toFixed(1) + ' kΩ) = ' + (r.vd * 1e3).toFixed(2) + ' mV' },
      { t: 'Step 4　判斷。', note: r.clip ? '<b>(a) 會 OFF</b>：輸出負半週被削平（截止失真）。要把 V<sub>PS</sub> 提高到大於 V<sub>m</sub> + 0.6 = ' + (r.A + 0.6).toFixed(2) + ' V。'
        : r.vd > 0.0026 ? '(a) 不會 OFF；但 (b) v<sub>d</sub> 不算 ≪ 26 mV，會有<b>非線性失真</b>。'
        : '(a) 不會 OFF、(b) v<sub>d</sub> ≪ 26 mV：Q 點設計 OK，小訊號模型可以用。' }
    ],
    answer: (g, r) => (r.clip ? '(a) 會 OFF（截止削波）' : '(a) 不會 OFF') + '；(b) v<sub>d</sub> ≈ ' + (r.vd * 1e3).toFixed(2) + ' mV' + (r.vd > 0.0026 ? '（不算小）' : '（≪ 26 mV ✓）'),
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['V<sub>PS</sub> − 0.6', r.lim, C.ink], ['v<sub>i</sub> 峰值', r.A, r.clip ? C.bad : C.accent]], v => f2(v) + ' V')
  });

  /* ── 05 擴散電容 ── */
  liveExample('#ex-cd', {
    title: '例題 · 擴散電容 vs 接面電容，誰大？',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xc-i', label: 'I<sub>DQ</sub>', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' mA' },
      { id: 'xc-t', label: '少數載子壽命 τ', min: 1, max: 100, step: 1, value: 10, fmt: v => v.toFixed(0) + ' ns' },
      { id: 'xc-j', label: 'C<sub>j</sub>', min: 0.5, max: 20, step: 0.5, value: 2, fmt: v => v.toFixed(1) + ' pF' }
    ],
    compute: g => {
      const I = g['xc-i'] * 1e-3, tau = g['xc-t'] * 1e-9, Cj = g['xc-j'] * 1e-12, Cd = tau * I / (2 * VT);
      return { I, tau, Cj, Cd, ratio: Cd / Cj, rd: VT / I };
    },
    question: (g, r) => '順偏二極體 I<sub>DQ</sub> = <b>' + (r.I * 1e3).toFixed(1) + ' mA</b>，少數載子壽命 τ = <b>' + (r.tau * 1e9).toFixed(0) + ' ns</b>，接面電容 C<sub>j</sub> = <b>' + (r.Cj * 1e12).toFixed(1) + ' pF</b>。用課本式子 C<sub>d</sub> = τI<sub>DQ</sub>/(2V<sub>T</sub>) 算擴散電容，跟 C<sub>j</sub> 比。',
    questionEn: (g, r) => 'A forward-biased diode has I<sub>DQ</sub> = ' + (r.I * 1e3).toFixed(1) + ' mA, minority-carrier lifetime τ = ' + (r.tau * 1e9).toFixed(0) + ' ns and junction capacitance C<sub>j</sub> = ' + (r.Cj * 1e12).toFixed(1) + ' pF. Find the diffusion capacitance C<sub>d</sub> = τI<sub>DQ</sub>/(2V<sub>T</sub>) and compare it with C<sub>j</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　擴散電容 = 「庫存」跟著電壓變多少。', note: '電流越大，注入的少數載子越多，ΔQ/ΔV 越大。', eq: 'C<sub>d</sub> = τI<sub>DQ</sub>/(2V<sub>T</sub>) = ' + (r.tau * 1e9).toFixed(0) + 'n × ' + (r.I * 1e3).toFixed(1) + 'm / 0.052 = ' + P6.fmtC(r.Cd) },
      { t: 'Step 2　比一比。', eq: 'C<sub>d</sub>/C<sub>j</sub> = ' + P6.fmtC(r.Cd) + ' / ' + P6.fmtC(r.Cj) + ' = ' + (r.ratio >= 10 ? r.ratio.toFixed(0) : r.ratio.toFixed(2)) },
      { t: 'Step 3　結論。', note: r.ratio > 5 ? '順偏、電流夠大：<b>C<sub>d</sub> ≫ C<sub>j</sub></b>，擴散電容是主角（講義 1-18）。' : r.ratio > 1 ? 'C<sub>d</sub> 比 C<sub>j</sub> 大，但沒有大很多，兩個都要算。' : '電流很小（或 τ 很短）：C<sub>d</sub> 還比 C<sub>j</sub> 小 —— 這時接面電容反而不能忽略。逆偏時 C<sub>d</sub> ≈ 0，只剩 C<sub>j</sub>。' }
    ],
    answer: (g, r) => 'C<sub>d</sub> = ' + P6.fmtC(r.Cd) + '，C<sub>d</sub>/C<sub>j</sub> ≈ ' + (r.ratio >= 10 ? r.ratio.toFixed(0) : r.ratio.toFixed(2)),
    draw: (ctx, w, h, g, r) => logBars(ctx, w, h, [['C<sub>d</sub> 擴散', r.Cd * 1e12, C.accent], ['C<sub>j</sub> 接面', r.Cj * 1e12, C.ink]], -1, 5, 'pF（對數）')
  });

  /* ── 06 小訊號等效電路的阻抗 ── */
  liveExample('#ex-z', {
    title: '例題 · 頻率變高，二極體的交流阻抗剩多少？',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xz-i', label: 'I<sub>DQ</sub>', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' mA' },
      { id: 'xz-c', label: 'C<sub>d</sub>', min: 1, max: 1000, step: 1, value: 192, fmt: v => v.toFixed(0) + ' pF' },
      { id: 'xz-f', label: '頻率 f', min: 4, max: 9.5, step: 0.1, value: 7, fmt: v => P6.fmtF(Math.pow(10, v)) }
    ],
    compute: g => {
      const I = g['xz-i'] * 1e-3, Cd = g['xz-c'] * 1e-12, f = Math.pow(10, g['xz-f']), rd = VT / I, gd = 1 / rd, wC = 2 * Math.PI * f * Cd;
      const Y = Math.hypot(gd, wC), Z = 1 / Y, ph = -Math.atan2(wC, gd) * 180 / Math.PI, fc = 1 / (2 * Math.PI * rd * Cd);
      return { I, Cd, f, rd, gd, wC, Z, ph, fc };
    },
    question: (g, r) => '小訊號等效電路：r<sub>d</sub> 並聯 C<sub>d</sub>（忽略 C<sub>j</sub>、r<sub>s</sub>）。I<sub>DQ</sub> = <b>' + (r.I * 1e3).toFixed(1) + ' mA</b>、C<sub>d</sub> = <b>' + (r.Cd * 1e12).toFixed(0) + ' pF</b>、f = <b>' + P6.fmtF(r.f) + '</b>。求導納 Y、阻抗大小 |Z| 與角度。',
    questionEn: (g, r) => 'Use the small-signal model r<sub>d</sub> in parallel with C<sub>d</sub> (neglect C<sub>j</sub> and r<sub>s</sub>). With I<sub>DQ</sub> = ' + (r.I * 1e3).toFixed(1) + ' mA, C<sub>d</sub> = ' + (r.Cd * 1e12).toFixed(0) + ' pF and f = ' + P6.fmtF(r.f) + ', find the admittance Y and the magnitude and angle of Z.',
    steps: (g, r) => [
      { t: 'Step 1　r<sub>d</sub> 與 g<sub>d</sub>。', eq: 'r<sub>d</sub> = 0.026/' + (r.I * 1e3).toFixed(1) + ' mA = ' + P6.fmtR(r.rd) + '　g<sub>d</sub> = ' + (r.gd * 1e3).toFixed(2) + ' mS' },
      { t: 'Step 2　電容那一支的導納。', note: '並聯就把導納相加：Y = g<sub>d</sub> + jωC<sub>d</sub>（講義 1-16）。', eq: 'ωC<sub>d</sub> = 2π × ' + P6.fmtF(r.f) + ' × ' + (r.Cd * 1e12).toFixed(0) + 'p = ' + (r.wC * 1e3).toFixed(3) + ' mS' },
      { t: 'Step 3　導納大小、阻抗大小。', eq: '|Y| = √(g<sub>d</sub><sup>2</sup> + (ωC<sub>d</sub>)<sup>2</sup>) = ' + (1 / r.Z * 1e3).toFixed(3) + ' mS　⟹　|Z| = ' + P6.fmtR(r.Z) + '，角度 ' + r.ph.toFixed(1) + '°' },
      { t: 'Step 4　解讀。', note: r.f < r.fc / 5 ? 'f 遠低於轉折頻率 f<sub>c</sub> = ' + P6.fmtF(r.fc) + '：電容那支幾乎斷路，|Z| ≈ r<sub>d</sub>。' : r.f < r.fc * 5 ? 'f 在轉折頻率 f<sub>c</sub> = ' + P6.fmtF(r.fc) + ' 附近：兩支差不多，|Z| 掉到 r<sub>d</sub> 的 ' + Math.round(r.Z / r.rd * 100) + '%。' : 'f 遠高於 f<sub>c</sub> = ' + P6.fmtF(r.fc) + '：交流從電容抄捷徑，|Z| 只剩 r<sub>d</sub> 的 ' + Math.round(r.Z / r.rd * 100) + '%。' }
    ],
    answer: (g, r) => 'Y = ' + (r.gd * 1e3).toFixed(2) + ' + j' + (r.wC * 1e3).toFixed(3) + ' mS；|Z| = ' + P6.fmtR(r.Z) + '、∠' + r.ph.toFixed(1) + '°',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['r<sub>d</sub>', r.rd, C['ink-3']], ['|Z|', r.Z, C.accent]], v => P6.fmtR(v))
  });

  /* ── 07 儲存時間 ── */
  liveExample('#ex-ts', {
    title: '例題 · 關掉二極體要多久？',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xt-f', label: '順偏電源 V<sub>F</sub>', min: 1, max: 15, step: 0.1, value: 5.7, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xt-r', label: '逆偏電源 V<sub>R</sub>', min: 1, max: 15, step: 0.5, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xt-k', label: '串聯電阻 R', min: 0.5, max: 10, step: 0.5, value: 1, fmt: v => v.toFixed(1) + ' kΩ' },
      { id: 'xt-t', label: '少數載子壽命 τ', min: 1, max: 100, step: 1, value: 20, fmt: v => v.toFixed(0) + ' ns' }
    ],
    compute: g => {
      const VF = g['xt-f'], VR = g['xt-r'], R = g['xt-k'], tau = g['xt-t'], IF = (VF - 0.7) / R, IR = VR / R, ts = tau * Math.log(1 + IF / IR);
      return { VF, VR, R, tau, IF, IR, ts };
    },
    question: (g, r) => '二極體串 R = <b>' + r.R.toFixed(1) + ' kΩ</b>，電源從 +' + r.VF.toFixed(1) + ' V 突然切到 −' + r.VR.toFixed(1) + ' V。少數載子壽命 τ = ' + r.tau.toFixed(0) + ' ns。求順向電流 I<sub>F</sub>、反向恢復電流 I<sub>R</sub>，並用近似式 t<sub>s</sub> ≈ τ ln(1 + I<sub>F</sub>/I<sub>R</sub>) 估儲存時間。',
    questionEn: (g, r) => 'A diode in series with R = ' + r.R.toFixed(1) + ' kΩ is switched from +' + r.VF.toFixed(1) + ' V to −' + r.VR.toFixed(1) + ' V. With τ = ' + r.tau.toFixed(0) + ' ns, find I<sub>F</sub> and I<sub>R</sub>, and estimate the storage time using t<sub>s</sub> ≈ τ ln(1 + I<sub>F</sub>/I<sub>R</sub>).',
    steps: (g, r) => [
      { t: 'Step 1　順偏時的電流（定電壓降 0.7 V）。', eq: 'I<sub>F</sub> = (V<sub>F</sub> − 0.7)/R = ' + f2(r.IF) + ' mA' },
      { t: 'Step 2　剛切到逆偏：二極體還在「近短路」，v<sub>D</sub> ≈ 0。', note: '儲存的少數載子還沒掃完，電壓建立不起來（講義 1-24），所以整個 V<sub>R</sub> 落在 R 上。', eq: 'I<sub>R</sub> ≈ V<sub>R</sub>/R = ' + f2(r.IR) + ' mA（方向反過來）' },
      { t: 'Step 3　估儲存時間。', note: '庫存（∝ I<sub>F</sub>）越多、掃的電流（I<sub>R</sub>）越小，就越久。這條近似式是課本延伸（電荷控制模型），講義只講觀念。', eq: 't<sub>s</sub> ≈ ' + r.tau.toFixed(0) + ' × ln(1 + ' + f2(r.IF) + '/' + f2(r.IR) + ') = ' + r.ts.toFixed(1) + ' ns' },
      { t: 'Step 4　解讀。', note: r.IF > 2 * r.IR ? 'I<sub>F</sub> 比 I<sub>R</sub> 大很多：庫存多、掃得慢，t<sub>s</sub> 比 τ 還長。想關得快 → 加大逆向電流或減少順向電流。' : r.IR > 2 * r.IF ? 'I<sub>R</sub> 很大：用力掃，t<sub>s</sub> 比 τ 短很多。' : 'I<sub>F</sub> ≈ I<sub>R</sub>：t<sub>s</sub> ≈ τ ln 2 ≈ 0.69τ。' }
    ],
    answer: (g, r) => 'I<sub>F</sub> = ' + f2(r.IF) + ' mA、I<sub>R</sub> = ' + f2(r.IR) + ' mA、t<sub>s</sub> ≈ ' + r.ts.toFixed(1) + ' ns',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['τ', r.tau, C['ink-3']], ['t<sub>s</sub>', r.ts, C.accent]], v => v.toFixed(1) + ' ns')
  });

  /* ── 08 LED 限流電阻 ── */
  const LEDS = [['紅', 1.8], ['黃', 2.0], ['綠', 2.1], ['藍', 3.0], ['白', 3.2]];
  liveExample('#ex-led', {
    title: '例題 · 點亮一顆 LED，電阻要多大？（自編）',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xl-s', label: '電源 V<sub>S</sub>', min: 2, max: 12, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xl-c', label: 'LED 顏色', min: 0, max: 4, step: 1, value: 0, fmt: v => LEDS[v][0] + '（' + LEDS[v][1].toFixed(1) + ' V）' },
      { id: 'xl-i', label: '想要的電流', min: 2, max: 30, step: 1, value: 10, fmt: v => v.toFixed(0) + ' mA' }
    ],
    compute: g => {
      const VS = g['xl-s'], c = LEDS[g['xl-c']], VL = c[1], I = g['xl-i'], R = (VS - VL) / I;
      return { VS, nm: c[0], VL, I, R, PR: (VS - VL) * I, PL: VL * I, ok: VS > VL };
    },
    question: (g, r) => '用 <b>' + r.VS.toFixed(1) + ' V</b> 電源點亮一顆<b>' + r.nm + '色</b> LED（導通時壓降約 ' + r.VL.toFixed(1) + ' V），想讓它流 <b>' + r.I.toFixed(0) + ' mA</b>。串聯電阻要多大？電阻和 LED 各吃多少功率？',
    questionEn: (g, r) => 'A ' + r.VS.toFixed(1) + ' V supply drives an LED with a forward drop of about ' + r.VL.toFixed(1) + ' V. What series resistance gives ' + r.I.toFixed(0) + ' mA, and how much power do the resistor and the LED dissipate?',
    steps: (g, r) => r.ok ? [
      { t: 'Step 1　LED 也是二極體：順偏導通，當成一顆固定電壓的電池。', note: '跟定電壓降模型一樣，只是 LED 的「V<sub>γ</sub>」比較大（顏色越偏藍越大）。', eq: 'V<sub>S</sub> = I·R + V<sub>LED</sub>' },
      { t: 'Step 2　解 R。', eq: 'R = (' + r.VS.toFixed(1) + ' − ' + r.VL.toFixed(1) + ')/' + r.I.toFixed(0) + ' mA = ' + P6.fmtR(r.R * 1e3) },
      { t: 'Step 3　功率。', eq: 'P<sub>R</sub> = ' + (r.VS - r.VL).toFixed(1) + ' × ' + r.I.toFixed(0) + 'm = ' + r.PR.toFixed(1) + ' mW　｜　P<sub>LED</sub> = ' + r.VL.toFixed(1) + ' × ' + r.I.toFixed(0) + 'm = ' + r.PL.toFixed(1) + ' mW' },
      { t: 'Step 4　為什麼一定要電阻？', note: 'LED 的 I–V 跟一般二極體一樣陡：直接接電源，電壓多 0.1 V 電流就暴增，會燒掉。電阻負責<b>限流</b>（跟齊納那節一樣的道理）。' }
    ] : [{ t: 'Step 1　電源不夠大。', note: 'V<sub>S</sub> = ' + r.VS.toFixed(1) + ' V 還沒超過 LED 的 ' + r.VL.toFixed(1) + ' V，推不開門，LED 不亮。' }],
    answer: (g, r) => r.ok ? 'R ≈ ' + P6.fmtR(r.R * 1e3) + '；P<sub>R</sub> = ' + r.PR.toFixed(1) + ' mW、P<sub>LED</sub> = ' + r.PL.toFixed(1) + ' mW' : 'LED 不亮（V<sub>S</sub> &lt; V<sub>LED</sub>）',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['電阻吃掉', Math.max(0, r.VS - r.VL), C['ink-3']], ['LED 吃掉', Math.min(r.VS, r.VL), C.accent]], v => v.toFixed(1) + ' V')
  });

  /* ── 09 Example 1.12 ── */
  liveExample('#ex-112', {
    title: '例題 · Example 1.12：同樣 1 mA，pn 和蕭特基各要多少電壓？',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xb-i', label: '電流 I<sub>D</sub>', min: 0.01, max: 10, step: 0.01, value: 1, fmt: v => v.toFixed(2) + ' mA' },
      { id: 'xb-p', label: 'pn 的 I<sub>S</sub>', min: -16, max: -10, step: 1, value: -12, fmt: v => '10' + sup(v) + ' A' },
      { id: 'xb-s', label: '蕭特基的 I<sub>S</sub>', min: -10, max: -6, step: 1, value: -8, fmt: v => '10' + sup(v) + ' A' }
    ],
    compute: g => {
      const I = g['xb-i'] * 1e-3, ISP = Math.pow(10, g['xb-p']), ISS = Math.pow(10, g['xb-s']);
      const vp = VT * Math.log(I / ISP + 1), vs = VT * Math.log(I / ISS + 1);
      return { I, lp: g['xb-p'], ls: g['xb-s'], vp, vs, dv: vp - vs, k: g['xb-s'] - g['xb-p'] };
    },
    question: (g, r) => 'pn 接面二極體 I<sub>S</sub> = 10' + sup(r.lp) + ' A、蕭特基二極體 I<sub>S</sub> = 10' + sup(r.ls) + ' A。要讓兩者都流 <b>' + (r.I * 1e3).toFixed(2) + ' mA</b>，各需要多少順向電壓？',
    questionEn: (g, r) => 'A pn junction diode has I<sub>S</sub> = 10' + sup(r.lp) + ' A and a Schottky diode has I<sub>S</sub> = 10' + sup(r.ls) + ' A. Determine the forward-bias voltage required to produce ' + (r.I * 1e3).toFixed(2) + ' mA in each diode.',
    steps: (g, r) => [
      { t: 'Step 1　把二極體方程式反過來解電壓。', note: 'i = I<sub>S</sub>(e<sup>v/V<sub>T</sub></sup> − 1) ⟹ v = V<sub>T</sub> ln(i/I<sub>S</sub> + 1)。', eq: 'V<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub> + 1)' },
      { t: 'Step 2　pn 接面。', eq: 'V<sub>pn</sub> = 0.026 × ln(' + (r.I * 1e3).toFixed(2) + 'm/10' + sup(r.lp) + ' + 1) = ' + f3(r.vp) + ' V' },
      { t: 'Step 3　蕭特基。', eq: 'V<sub>SBD</sub> = 0.026 × ln(' + (r.I * 1e3).toFixed(2) + 'm/10' + sup(r.ls) + ' + 1) = ' + f3(r.vs) + ' V' },
      { t: 'Step 4　差多少、為什麼。', note: 'I<sub>S</sub> 差 10' + sup(r.k) + ' 倍 → 電壓差 V<sub>T</sub> ln(10' + sup(r.k) + ') ≈ ' + (r.k * 60).toFixed(0) + ' mV（每 10 倍 60 mV，PART 4 的口訣）。' + (r.vs < 0.1 ? ' 電流太小時「+1」不能丟，近似會不準。' : ''), eq: 'ΔV = ' + f3(r.vp) + ' − ' + f3(r.vs) + ' = ' + f3(r.dv) + ' V' }
    ],
    answer: (g, r) => 'V<sub>pn</sub> = ' + f3(r.vp) + ' V、V<sub>SBD</sub> = ' + f3(r.vs) + ' V（差 ' + f3(r.dv) + ' V）',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['pn', r.vp, C.ink], ['蕭特基', r.vs, C.accent]], v => f3(v) + ' V')
  });

  /* ── 10 Design Example 1.13 ── */
  liveExample('#ex-113', {
    title: '例題 · Design Example 1.13：齊納電路的限流電阻',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xz2-v', label: 'V<sub>PS</sub>', min: 6, max: 24, step: 0.1, value: 10, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xz2-z', label: 'V<sub>Z</sub>', min: 2.4, max: 5.6, step: 0.1, value: 5.6, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xz2-i', label: '想要的 I<sub>Z</sub>', min: 1, max: 30, step: 0.5, value: 3, fmt: v => v.toFixed(1) + ' mA' }
    ],
    compute: g => {
      const V = g['xz2-v'], VZ = g['xz2-z'], I = g['xz2-i'], R = (V - VZ) / I;
      return { V, VZ, I, R, PZ: I * VZ, PR: I * (V - VZ) };
    },
    question: (g, r) => '齊納二極體崩潰電壓 V<sub>Z</sub> = <b>' + r.VZ.toFixed(1) + ' V</b>、r<sub>z</sub> = 0，接在 V<sub>PS</sub> = <b>' + r.V.toFixed(1) + ' V</b> 和電阻 R 下面（逆偏、操作在崩潰區）。要把電流限制在 <b>' + r.I.toFixed(1) + ' mA</b>，R 要多大？齊納二極體消耗多少功率？',
    questionEn: (g, r) => 'A Zener diode with V<sub>Z</sub> = ' + r.VZ.toFixed(1) + ' V and r<sub>z</sub> = 0 is biased in breakdown by V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V through a resistor R. Design R so that the current is limited to ' + r.I.toFixed(1) + ' mA, and find the power dissipated in the Zener diode.',
    steps: (g, r) => [
      { t: 'Step 1　崩潰區的齊納二極體 = 一顆 V<sub>Z</sub> 的電池。', note: 'r<sub>z</sub> = 0：牆是垂直的，兩端被釘在 V<sub>Z</sub>（講義 1-33）。', eq: 'V<sub>PS</sub> = I·R + V<sub>Z</sub>' },
      { t: 'Step 2　解 R。', eq: 'R = (V<sub>PS</sub> − V<sub>Z</sub>)/I = (' + r.V.toFixed(1) + ' − ' + r.VZ.toFixed(1) + ')/' + r.I.toFixed(1) + ' mA = ' + P6.fmtR(r.R * 1e3) },
      { t: 'Step 3　齊納的功率。', note: '齊納二極體一定要撐得住這個功率，不然會燒壞。', eq: 'P<sub>Z</sub> = I<sub>Z</sub>V<sub>Z</sub> = ' + r.I.toFixed(1) + 'm × ' + r.VZ.toFixed(1) + ' = ' + r.PZ.toFixed(1) + ' mW' },
      { t: 'Step 4　這電路在幹嘛。', note: '外接電阻限流；輸出穩在 ' + r.VZ.toFixed(1) + ' V，V<sub>PS</sub> 變大只會讓 R 上的電壓變大。電阻吃掉 ' + r.PR.toFixed(1) + ' mW。' }
    ],
    answer: (g, r) => 'R = ' + P6.fmtR(r.R * 1e3) + '、P<sub>Z</sub> = ' + r.PZ.toFixed(1) + ' mW',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['R 上', r.V - r.VZ, C['ink-3']], ['齊納（輸出）', r.VZ, C.accent]], v => v.toFixed(1) + ' V')
  });
})();

/* ============================================================
   小測驗（中英對照，選項每次打亂）
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '「小訊號分析」的前提是什麼？',
      en: 'What is the basic assumption of small-signal analysis?',
      o: [['交流訊號比直流小很多，在 Q 點附近曲線可用切線（直線）近似', 'the ac signal is small compared with the dc component, so the curve near the Q-point can be approximated by its tangent line'],
          ['交流訊號比直流大很多', 'the ac signal is much larger than the dc component'],
          ['二極體一定要逆偏', 'the diode must be reverse biased'],
          ['電路裡沒有直流電源', 'there is no dc source in the circuit']], a: 0,
      e: '講義 1-3、1-4：v<sub>d</sub> 很小（≪ V<sub>T</sub>），那一小段指數曲線看起來是直的，才能把非線性的二極體變成線性的 r<sub>d</sub>。' },
    { zh: '二極體的增量電阻 r<sub>d</sub> 等於？',
      en: 'The diode incremental (small-signal) resistance r<sub>d</sub> equals?',
      o: [['V<sub>T</sub>/I<sub>DQ</sub>', 'V<sub>T</sub>/I<sub>DQ</sub>'], ['V<sub>DQ</sub>/I<sub>DQ</sub>', 'V<sub>DQ</sub>/I<sub>DQ</sub>'], ['I<sub>DQ</sub>/V<sub>T</sub>', 'I<sub>DQ</sub>/V<sub>T</sub>'], ['V<sub>γ</sub>/I<sub>S</sub>', 'V<sub>γ</sub>/I<sub>S</sub>']], a: 0,
      e: '在 Q 點對 i<sub>D</sub> = I<sub>S</sub>e<sup>v/V<sub>T</sub></sup> 微分得 g<sub>d</sub> = I<sub>DQ</sub>/V<sub>T</sub>，倒數 r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub>。V<sub>DQ</sub>/I<sub>DQ</sub> 是「直流電阻」，不是切線斜率。' },
    { zh: 'I<sub>DQ</sub> 從 1 mA 加大到 2 mA，r<sub>d</sub> 會？',
      en: 'If I<sub>DQ</sub> increases from 1 mA to 2 mA, r<sub>d</sub> will?',
      o: [['減半（26 Ω → 13 Ω）', 'halve (26 Ω → 13 Ω)'], ['加倍', 'double'], ['不變', 'stay the same'], ['變成 0', 'become zero']], a: 0,
      e: 'r<sub>d</sub> ∝ 1/I<sub>DQ</sub>：Q 點越高，曲線越陡，電阻越小。' },
    { zh: '做 DC 分析時，獨立的交流電壓源要怎麼處理？',
      en: 'In dc analysis, how is an independent ac voltage source treated?',
      o: [['設為 0 V，等效為短路', 'set to 0 V, i.e. replaced by a short circuit'], ['設為 0 A，等效為開路', 'set to 0 A, i.e. replaced by an open circuit'], ['保留', 'kept as is'], ['換成 r<sub>d</sub>', 'replaced by r<sub>d</sub>']], a: 0,
      e: '講義 1-7：DC 分析把獨立交流訊號設為零；電壓源 = 0 V → 短路，電流源 = 0 A → 開路。' },
    { zh: '做 AC 小訊號分析時，直流電壓源 V<sub>PS</sub> 要怎麼處理？',
      en: 'In ac small-signal analysis, how is the dc voltage source V<sub>PS</sub> treated?',
      o: [['交流增量為 0，等效為短路（交流接地）', 'its ac increment is zero, so it becomes a short circuit (ac ground)'], ['等效為開路', 'it becomes an open circuit'], ['保留原值', 'it is kept at its dc value'], ['換成 V<sub>γ</sub> 電池', 'it is replaced by a V<sub>γ</sub> battery']], a: 0,
      e: '直流電壓源的「變化量」是 0，所以 AC 電路裡是一條導線（AC ground）。' },
    { zh: 'Example 1.11（V<sub>PS</sub> = 5 V、R = 5 kΩ、V<sub>γ</sub> = 0.6 V）的 r<sub>d</sub> 約多少？',
      en: 'In Example 1.11 (V<sub>PS</sub> = 5 V, R = 5 kΩ, V<sub>γ</sub> = 0.6 V), r<sub>d</sub> is about?',
      o: [['29.5 Ω', '29.5 Ω'], ['5 kΩ', '5 kΩ'], ['0.88 Ω', '0.88 Ω'], ['682 Ω', '682 Ω']], a: 0,
      e: 'I<sub>DQ</sub> = 4.4/5k = 0.88 mA，r<sub>d</sub> = 0.026/0.88 mA = 29.5 Ω。' },
    { zh: '輸入交流太大、把二極體推到 OFF，輸出被削平，這叫？',
      en: 'When the ac input is so large that it turns the diode off and the output is clipped, this is called?',
      o: [['截止失真（cutoff clipping）', 'cutoff clipping'], ['崩潰', 'breakdown'], ['儲存時間', 'storage time'], ['頻率響應', 'frequency response']], a: 0,
      e: '講義 1-9：Q 點太低或 v<sub>i</sub> 太大，負半週把二極體推到截止區，波形被削掉。' },
    { p: 7, zh: '順偏且有交流訊號時，二極體主要的電容是？',
      en: 'Under forward bias with an ac signal, the dominant diode capacitance is?',
      o: [['擴散電容 C<sub>d</sub>', 'the diffusion capacitance C<sub>d</sub>'], ['接面電容 C<sub>j</sub>', 'the junction capacitance C<sub>j</sub>'], ['兩者一樣大', 'both are equal'], ['沒有電容', 'there is no capacitance']], a: 0,
      e: '順偏注入大量少數載子，「庫存」ΔQ 隨電壓變很多 → C<sub>d</sub> ≫ C<sub>j</sub>（講義 1-13 Remark 寫反了，見勘誤）。' },
    { p: 7, zh: '頻率升高時，擴散電容會？',
      en: 'As frequency increases, the diffusion capacitance?',
      o: [['變小，因為少數載子來不及跟著充放電', 'decreases, because the minority carriers cannot charge and discharge fast enough'], ['變大', 'increases'], ['不變', 'stays the same'], ['變成負的', 'becomes negative']], a: 0,
      e: '講義 1-15：dQ 跟不上 dV，C = dQ/dV 變小。' },
    { p: 7, zh: '二極體從順偏切到逆偏，儲存時間 t<sub>s</sub> 內發生什麼事？',
      en: 'When a diode is switched from forward to reverse bias, what happens during the storage time t<sub>s</sub>?',
      o: [['儲存的少數載子還在，二極體近乎短路，逆向電流約固定為 I<sub>R</sub>', 'the stored minority carriers are still present, the diode is nearly a short, and the reverse current stays at about I<sub>R</sub>'],
          ['電流立刻變 0', 'the current drops to zero immediately'], ['空乏區已經重建，二極體承受全部逆壓', 'the depletion region is already rebuilt and the diode holds the full reverse voltage'], ['二極體崩潰', 'the diode breaks down']], a: 0,
      e: '講義 1-23～1-25：載子不會瞬間消失，要靠反向電流掃出去；掃完空乏區才重建，進入掉落時間 t<sub>f</sub>。' },
    { p: 7, zh: '光二極體（photodiode）通常操作在什麼偏壓？',
      en: 'A photodiode is normally operated under which bias?',
      o: [['逆偏', 'reverse bias'], ['順偏', 'forward bias'], ['零偏且接負載發電', 'zero bias, driving a load to generate power'], ['崩潰區', 'breakdown']], a: 0,
      e: '講義 1-20：光二極體類似太陽能電池，但操作於逆偏，光電流正比於入射光。太陽能電池才是不加偏壓、推動負載。' },
    { p: 7, zh: '跟 pn 二極體比，蕭特基二極體的特點是？',
      en: 'Compared with a pn junction diode, a Schottky diode has?',
      o: [['I<sub>S</sub> 大很多、順向壓降小、幾乎沒有儲存時間', 'a much larger I<sub>S</sub>, a smaller forward drop, and almost no storage time'],
          ['I<sub>S</sub> 小很多、順向壓降大', 'a much smaller I<sub>S</sub> and a larger forward drop'],
          ['靠少數載子導電、切換慢', 'conduction by minority carriers and slow switching'],
          ['只能操作在崩潰區', 'operation only in breakdown']], a: 0,
      e: '講義 1-29：多數載子導電，沒有少數載子儲存 → 切換快；I<sub>S</sub> 大 → 同樣電流電壓小（Example 1.12：0.539 V vs 0.299 V）。' },
    { p: 7, zh: 'Design Example 1.13：V<sub>PS</sub> = 10 V、V<sub>Z</sub> = 5.6 V、限流 3 mA，R 要多少？',
      en: 'Design Example 1.13: with V<sub>PS</sub> = 10 V, V<sub>Z</sub> = 5.6 V and a 3 mA current limit, R must be?',
      o: [['1.47 kΩ', '1.47 kΩ'], ['3.33 kΩ', '3.33 kΩ'], ['1.87 kΩ', '1.87 kΩ'], ['5.6 kΩ', '5.6 kΩ']], a: 0,
      e: 'R = (10 − 5.6)/3 mA = 1.47 kΩ；P<sub>Z</sub> = 3 mA × 5.6 V = 16.8 mW。' }
  ].filter(q => (q.p === 7) === (document.body.dataset.part === '7'));  /* PART 6／PART 7 各自的題目 */
  let i = 0, score = 0, answered = false, ord = [];
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  function render() {
    const q = Q[i];
    host.innerHTML =
      '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div>' +
      '<div class="quiz-body">' +
        '<div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
        '<div class="q-text">' + q.zh + '</div>' +
        '<div class="q-en">' + q.en + '</div>' +
        '<div class="opts"></div>' +
        '<div class="explain" hidden></div>' +
      '</div>' +
      '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span>' +
        '<button class="btn" id="q-next" hidden>下一題 →</button></div>';
    const opts = host.querySelector('.opts');
    ord = shuffle(q.o.length);
    ord.forEach((src, k) => {
      const pair = q.o[src];
      const b = document.createElement('button');
      b.className = 'opt'; b.type = 'button';
      b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + pair[0] + '<span class="en">' + pair[1] + '</span></span>';
      b.addEventListener('click', () => pick(k));
      opts.appendChild(b);
    });
    host.querySelector('#q-next').addEventListener('click', () => { i++; answered = false; i < Q.length ? render() : done(); });
    answered = false;
  }
  function pick(k) {
    if (answered) return; answered = true;
    const q = Q[i], A = ord.indexOf(q.a), btns = Array.prototype.slice.call(host.querySelectorAll('.opt'));
    btns.forEach((b, idx) => { b.disabled = true; if (idx === A) b.classList.add('right'); });
    if (k === A) score++; else btns[k].classList.add('wrong');
    const ex = host.querySelector('.explain');
    ex.hidden = false;
    ex.innerHTML = '<b>' + (k === A ? '答對了。' : '正確答案是 ' + 'ABCD'[A] + '。') + '</b> ' + q.e;
    host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
    const nx = host.querySelector('#q-next');
    nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →';
    nx.classList.add('solid');
  }
  function done() {
    const pct = Math.round(score / Q.length * 100);
    const verdict = pct >= 90 ? 'CH1 全部收工。下一步：CH2 二極體電路（整流器）。'
      : pct >= 70 ? '主幹抓到了。答錯的回去玩對應小節的互動模組。'
      : '建議先把「先 DC 找 Q 點、再 AC 用 r<sub>d</sub>」這條主線在 §03 的拆電路模組玩熟，再回來做一次。';
    host.innerHTML =
      '<div class="bar"><i style="width:100%"></i></div>' +
      '<div class="quiz-body" style="padding-bottom:18px">' +
        '<div class="q-no">測驗結果</div>' +
        '<div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + pct + '%）</div>' +
        '<p style="color:var(--ink-2);margin:0 0 14px">' + verdict + '</p>' +
        '<button class="btn solid" id="q-again" type="button">再測一次</button>' +
      '</div>';
    host.querySelector('#q-again').addEventListener('click', () => { i = 0; score = 0; render(); });
  }
  render();
})();

/* 側欄捲動高亮 + 明暗主題切換 */
(function () {
  'use strict';
  const links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
  if (links.length) {
    const map = new Map();
    links.forEach(a => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a); });
    const io = new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.remove('on')); map.get(en.target).classList.add('on'); } });
    }, { rootMargin: '-84px 0px -62% 0px', threshold: 0 });
    map.forEach((a, s) => io.observe(s));
  }
  const btn = document.getElementById('theme-btn');
  if (btn) btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    try { localStorage.setItem('ee-theme', isDark ? 'light' : 'dark'); } catch (e) {}
  });
  try { const t = localStorage.getItem('ee-theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch (e) {}
})();
