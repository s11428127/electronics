/* ============================================================
   電子學 CH1 PART 5 — 崩潰、二極體直流分析（圖形法、片段線性、定電壓降、逆偏）
   Neamen 4e, Ch.1 §1.2.5、§1.3.1～1.3.2；課程 PART 4（V3）投影片 1-89～1-97、1-106～1-126
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
  /* 指數模型的負載線交點：(V − v)/R = I_S(e^(v/V_T) − 1)，二分法 */
  const solveExp = (VPS, Rk, IS) => {
    const R = Rk * 1e3, f = v => (VPS - v) / R - IS * (Math.exp(v / VT) - 1);
    let a = Math.min(VPS, 0) - 1, b = Math.min(Math.max(VPS, 0) + 1, 1.2);
    for (let k = 0; k < 90; k++) { const m = (a + b) / 2; f(m) > 0 ? a = m : b = m; }
    const v = (a + b) / 2; return { v, i: (VPS - v) / R };
  };
  /* 片段線性模型的交點（rf = 0 就是定電壓降） */
  const solvePWL = (VPS, Rk, Vg, rf) => {
    const R = Rk * 1e3;
    if (VPS <= Vg) return { v: VPS, i: 0, on: false };
    const i = (VPS - Vg) / (R + rf); return { v: Vg + i * rf, i, on: true };
  };
  window.__p5 = { solveExp, solvePWL, fmtA };

  /* 座標框小工具：回傳 X(v)、Y(i) 與畫格線的函式 */
  function frame(ctx, w, h, o) {
    const L = o.L || Math.max(46, w * 0.09), R = w - (o.R || 18), T = o.T || 18, B = h - (o.B || 28);
    const X = v => lerp(L, R, (v - o.v0) / (o.v1 - o.v0)), Y = i => lerp(B, T, (i - o.i0) / (o.i1 - o.i0));
    ctx.strokeStyle = C['line-soft'] || C.line; ctx.lineWidth = 1;
    (o.vt || []).forEach(v => { ctx.beginPath(); ctx.moveTo(X(v), T); ctx.lineTo(X(v), B); ctx.stroke(); label(ctx, X(v), B + 13, String(v), C['ink-3'], 10); });
    (o.it || []).forEach(i => { ctx.beginPath(); ctx.moveTo(L, Y(i)); ctx.lineTo(R, Y(i)); ctx.stroke(); label(ctx, L - 6, Y(i), String(i), C['ink-3'], 10, 'right'); });
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.3;
    const y0 = Y(clamp(0, o.i0, o.i1)), x0 = X(clamp(0, o.v0, o.v1));
    ctx.beginPath(); ctx.moveTo(L, y0); ctx.lineTo(R, y0); ctx.moveTo(x0, T); ctx.lineTo(x0, B); ctx.stroke();
    labelCJK(ctx, R, y0 - 10, o.xl || 'v<sub>D</sub> (V)', C['ink-3'], 11, 'right');
    labelCJK(ctx, x0 + 6, T + 2, o.yl || 'i<sub>D</sub> (mA)', C['ink-3'], 11, 'left');
    return { X, Y, L, R, T, B };
  }
  const plot = (ctx, F, fn, va, vb, col, lw, dash) => {
    ctx.save(); ctx.beginPath(); ctx.rect(F.L, F.T - 2, F.R - F.L, F.B - F.T + 4); ctx.clip();
    ctx.strokeStyle = col; ctx.lineWidth = lw || 2.2; ctx.setLineDash(dash || []);
    ctx.beginPath();
    for (let n = 0; n <= 240; n++) { const v = va + (vb - va) * n / 240, y = clamp(F.Y(fn(v)), F.T - 40, F.B + 40); n ? ctx.lineTo(F.X(v), y) : ctx.moveTo(F.X(v), y); }
    ctx.stroke(); ctx.restore();
  };
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fillStyle = col; ctx.fill(); };

  /* ══════════════════════════════════════════════════════════
     ① 複習：實際曲線 vs 三種模型
     ══════════════════════════════════════════════════════════ */
  (function recap() {
    const cv = document.getElementById('cv-recap'); if (!cv) return;
    let mode = 'cvd', v = 0.72, st = null;
    const IS = 1e-14, BV = 5;
    const real = x => x > -BV ? IS * (Math.exp(x / VT) - 1) * 1e3 : -((-BV - x) * 4) - IS * 1e3;  /* 崩潰後很陡 */
    const model = x => mode === 'ideal' ? (x > 0 ? 1e9 : 0) : mode === 'cvd' ? (x > 0.7 ? 1e9 : 0) : (x > 0.6 ? (x - 0.6) / 0.01 : 0);
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.8 : 0.48, minH: 260, maxH: 380, draw(ctx, w, h) {
      const F = frame(ctx, w, h, { v0: -6.2, v1: 1.2, i0: -5, i1: 12, vt: [-5, 0, 0.7], it: [-4, 4, 8], xl: 'v<sub>D</sub> (V)' });
      plot(ctx, F, real, -6.2, 1.2, C['ink-2'], 2.4);
      /* 模型（畫成兩段直線） */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.setLineDash([]);
      const vg = mode === 'ideal' ? 0 : mode === 'cvd' ? 0.7 : 0.6;
      ctx.beginPath(); ctx.moveTo(F.X(-4.95), F.Y(0)); ctx.lineTo(F.X(vg), F.Y(0));
      if (mode === 'pwl') ctx.lineTo(F.X(vg + 0.12), F.Y(12)); else ctx.lineTo(F.X(vg), F.Y(12));
      ctx.stroke();
      /* 崩潰區標示 */
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(F.X(-5), F.T); ctx.lineTo(F.X(-5), F.B); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, F.X(-5) + 6, F.Y(-3.6), '崩潰（BV）', C['ink-2'], 11.5, 'left', '700');
      labelCJK(ctx, F.X(-2.6), F.Y(1.6), 'OFF：i ≈ 0', C['ink-2'], 11.5, 'center');
      labelCJK(ctx, F.X(vg) - 8, F.Y(10.5), mode === 'ideal' ? '理想：牆在 0 V' : mode === 'cvd' ? '定電壓降：牆在 0.7 V' : '片段線性：斜率 1/r<sub>f</sub>', C.accent, 12, 'right', '700');
      /* 目前的點 */
      const ir = real(v);
      if (ir < 12 && ir > -5) dot(ctx, F.X(v), F.Y(ir), 5.5, C['ink']);
    } });
    const msg = () => {
      const ir = real(v), im = model(v);
      setHTML('rc-r', fmtA(ir * 1e-3));
      setHTML('rc-m', im > 1e6 ? '由外部電路決定（ON）' : im > 0 ? (im).toFixed(2) + ' mA' : '0（OFF）');
      setHTML('rc-msg', v <= -BV ? '<b>崩潰區</b>：逆偏超過 BV，真的曲線往下衝，但三種模型<b>都沒畫崩潰</b> —— 模型只負責 OFF 和 ON 兩段。'
        : v < 0 ? '逆偏：真實電流只有 −I<sub>S</sub> 等級，模型直接當 0（OFF）。'
        : v < 0.55 ? '順偏但還沒「推開門」：真實電流小到看不到，模型也是 OFF（理想模型除外，它說 v &gt; 0 就 ON）。'
        : '導通區：真實曲線幾乎垂直。理想模型把牆放在 0 V、定電壓降放在 0.7 V、片段線性讓它稍微斜一點。');
      st.redraw();
    };
    bindRange('rc-v', x => x.toFixed(2) + ' V', x => { v = x; msg(); });
    document.querySelectorAll('[data-rcm]').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.rcm; document.querySelectorAll('[data-rcm]').forEach(x => x.classList.toggle('solid', x === b)); msg();
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     ② 崩潰：逆偏加大，過了 BV 電流暴衝；PIV 標線
     ══════════════════════════════════════════════════════════ */
  (function breakdown() {
    const cv = document.getElementById('cv-bd'); if (!cv) return;
    let BV = 50, VR = 30, st = null;
    const iRev = (vr, bv) => vr < bv ? 1e-14 * 1e3 : Math.min(50, (vr - bv) * 6 + 1e-11);   /* mA，崩潰後由外部限流 */
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.78 : 0.44, minH: 250, maxH: 360, draw(ctx, w, h) {
      const vmax = Math.max(60, BV * 1.25);
      const F = frame(ctx, w, h, { v0: -vmax, v1: 2, i0: -20, i1: 6, vt: [-BV, 0], it: [-15, -5, 5], xl: 'v<sub>D</sub> (V)' });
      /* 順偏的牆 + 逆偏貼地 + 崩潰往下衝 */
      plot(ctx, F, x => x > 0 ? 1e-14 * (Math.exp(x / VT) - 1) * 1e3 : -iRev(-x, BV), -vmax, 2, C['ink-2'], 2.4);
      /* PIV 額定（取 0.8 BV） */
      const piv = BV * 0.8;
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(F.X(-piv), F.T); ctx.lineTo(F.X(-piv), F.B); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, F.X(-piv) + 5, F.T + 10, 'PIV 額定', C.warn, 11, 'left', '700');
      labelCJK(ctx, F.X(-BV) - 5, F.Y(-17), 'BV = ' + BV + ' V', C['ink-2'], 11.5, 'right', '700');
      const ir = -iRev(VR, BV);
      dot(ctx, F.X(-VR), F.Y(Math.max(-19.5, ir)), 6.5, VR >= BV ? C.bad : C.accent);
      arrow(ctx, F.X(-VR), F.Y(0) - 26, F.X(-VR), F.Y(0) - 6, C.accent, 1.6);
      labelCJK(ctx, F.X(-VR), F.Y(0) - 34, '逆偏 ' + VR + ' V', C.accent, 11.5, 'center', '700');
    } });
    function msg() {
      const ir = iRev(VR, BV);
      setHTML('bd-i', VR < BV ? '≈ −10⁻¹⁴ A（−I<sub>S</sub>）' : '−' + ir.toFixed(1) + ' mA');
      setHTML('bd-s', VR < BV * 0.8 ? '安全（&lt; PIV）' : VR < BV ? '超過 PIV，還沒崩潰' : '崩潰！');
      setHTML('bd-msg', VR < BV * 0.8 ? '還在 PIV 以內：逆偏電流就是那一點點 I<sub>S</sub>，幾乎不隨電壓改變。'
        : VR < BV ? '超過額定 PIV 了：還沒崩潰，但已經沒有安全餘裕 —— 電源一抖就可能過去。'
        : '<b>崩潰</b>：空乏區電場強到把共價鍵扯開，電流突然大幅增加。電流只受外部電阻限制；功率太大就會燒壞（講義 1-106 NOTE (2)）。');
      st.redraw();
    }
    bindRange('bd-v', x => x.toFixed(0) + ' V', x => { VR = x; msg(); });
    document.querySelectorAll('[data-bv]').forEach(b => b.addEventListener('click', () => {
      BV = +b.dataset.bv; const s = document.getElementById('bd-v'); s.max = Math.round(BV * 1.2); if (VR > s.max) { s.value = s.max; s.dispatchEvent(new Event('input')); }
      document.querySelectorAll('[data-bv]').forEach(x => x.classList.toggle('solid', x === b)); msg();
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 累增 vs 齊納：摻雜決定空乏區寬度、電場、哪一種崩潰
     ══════════════════════════════════════════════════════════ */
  const NI = 1.5e10, EPS = 11.7 * 8.85e-14, Q = 1.6e-19;
  /* 對稱接面 Na = Nd = N：W = √(2ε(V_bi + V_R)/e · 2/N) */
  const depW = (N, VR) => { const vbi = VT * Math.log(N * N / NI / NI); return { vbi, W: Math.sqrt(2 * EPS * (vbi + VR) / Q * 2 / N) }; };
  /* 崩潰電壓的經驗式（Sze）：BV ≈ 60 (N/10¹⁶)^(−3/4) V（N 是較淡那一側；對稱接面約略取 N/2） */
  const bvOf = N => 60 * Math.pow(N / 2 / 1e16, -0.75);
  const mech = bv => bv < 4.5 ? '齊納' : bv < 6.5 ? '兩種都有' : '累增';
  window.__p5.depW = depW; window.__p5.bvOf = bvOf; window.__p5.mech = mech;
  (function mechanisms() {
    const cv = document.getElementById('cv-av'); if (!cv) return;
    let lg = 16, st = null, clock = 0;
    const parts = [];
    const R = (s => () => (s = (s * 9301 + 49297) % 233280) / 233280)(5);
    st = Stage(cv, { ratio: w => w < 560 ? 0.85 : 0.46, minH: 280, maxH: 400, draw(ctx, w, h, dt) {
      clock += dt;
      const N = Math.pow(10, lg), bv = bvOf(N), m = mech(bv), zen = bv < 5.5;
      const { W } = depW(N, Math.min(bv, 200));
      /* 空乏區寬度：用 log 尺度畫（不然重摻雜看不到） */
      const frac = clamp(0.1 + 0.11 * (Math.log10(W * 1e4) + 1.6), 0.05, 0.8);
      const x0 = w * 0.06, x1 = w * 0.94, y0 = h * 0.12, y1 = h * 0.7, xm = (x0 + x1) / 2;
      const half = (x1 - x0) * frac / 2;
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1.2; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      ctx.fillStyle = C.surface; ctx.fillRect(xm - half, y0, 2 * half, y1 - y0);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3'];
      [xm - half, xm + half].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); });
      ctx.setLineDash([]);
      label(ctx, x0 + 12, y0 + 12, 'p', C['ink-2'], 13, 'left', '700');
      label(ctx, x1 - 12, y0 + 12, 'n', C['ink-2'], 13, 'right', '700');
      /* 共價鍵小格點（空乏區裡） */
      const gx = Math.max(10, Math.min(18, half / 3));
      ctx.fillStyle = C['ink-3'];
      for (let x = xm - half + gx / 2; x < xm + half; x += gx) for (let y = y0 + 14; y < y1 - 8; y += 18) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill(); }
      /* 電場箭頭（n → p，越窄越粗） */
      const thick = clamp(1.2 + 3.5 * (1 - frac / 0.8), 1.2, 5);
      arrow(ctx, xm + half - 6, y1 + 18, xm - half + 6, y1 + 18, C.accent, thick);
      labelCJK(ctx, xm, y1 + 34, '電場 E（n → p）' + (zen ? '：很窄 → 很強' : '：寬 → 要很大逆偏才夠強'), C.accent, 11.5, 'center', '700');
      /* 載子動畫 */
      if (zen) {
        /* 齊納：電子直接從共價鍵被扯出來（空乏區內隨機位置出現，被電場往 n 拉） */
        if (R() < dt * 7) parts.push({ x: xm - half + R() * 2 * half, y: y0 + 14 + R() * (y1 - y0 - 28), t: 0, kind: 'z' });
      } else {
        /* 累增：從 p 側邊緣進來一顆，越跑越快，撞一下變兩顆 */
        if (R() < dt * 0.9 && parts.filter(p => p.kind === 'a').length < 40) parts.push({ x: xm - half, y: y0 + (y1 - y0) * (0.3 + R() * 0.4), t: 0, kind: 'a', gen: 0, vx: 0.15 });
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.t += dt;
        if (p.kind === 'z') {
          p.x += dt * w * 0.12;
          if (p.t > 1.6 || p.x > x1) { parts.splice(i, 1); continue; }
          if (p.t < 0.25) { ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, 7 * (1 - p.t * 3), 0, TAU); ctx.stroke(); }
          dot(ctx, p.x, p.y, 3.6, C.electron);
        } else {
          p.vx += dt * 0.5; p.x += dt * w * p.vx * 0.5;
          if (p.x > xm + half || p.x > x1) { parts.splice(i, 1); continue; }
          /* 跑過一段距離撞一次 */
          if (p.gen < 3 && p.x > xm - half + (p.gen + 1) * (2 * half) / 4.2) {
            p.gen++; p.vx = 0.15;
            parts.push({ x: p.x, y: clamp(p.y + (R() - 0.5) * 30, y0 + 10, y1 - 10), t: 0, kind: 'a', gen: p.gen, vx: 0.15 });
            ctx.strokeStyle = C.accent; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, TAU); ctx.stroke();
          }
          dot(ctx, p.x, p.y, 3.6, C.electron);
        }
      }
      labelCJK(ctx, xm, h * 0.94, zen ? '齊納崩潰：電場直接把共價鍵上的電子扯出來' : '累增崩潰：加速 → 撞斷共價鍵 → 1 變 2、2 變 4…', C['ink'], 12.5, 'center', '700');
    } });
    function msg() {
      const N = Math.pow(10, lg), bv = bvOf(N), m = mech(bv), { W } = depW(N, bv);
      setHTML('av-w', (W * 1e4 >= 1 ? (W * 1e4).toFixed(2) : (W * 1e4).toFixed(3)) + ' μm');
      setHTML('av-bv', bv >= 100 ? bv.toFixed(0) + ' V' : bv.toFixed(1) + ' V');
      setHTML('av-m', m);
      setHTML('av-msg', m === '齊納' ? '<b>高摻雜</b>：空乏區只有 ' + (W * 1e7).toFixed(0) + ' nm，幾伏特就在這麼短的距離上建出超強電場，直接把電子扯離共價鍵 → <b>齊納崩潰</b>，BV 小。'
        : m === '累增' ? '<b>低摻雜</b>：空乏區寬，要很大的逆偏電場才夠強；載子在這麼長的路上被加速，撞斷共價鍵、連鎖反應 → <b>累增崩潰</b>，BV 大。'
        : '中間地帶：BV 約 5～6 V，兩種機制都有。');
      st.redraw && st.redraw();
    }
    bindRange('av-n', x => '10' + E.sup(x % 1 ? x.toFixed(1) : x.toFixed(0)) + ' cm' + E.sup('−3'), x => { lg = x; parts.length = 0; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ④ 理想開關 + 半波整流
     ══════════════════════════════════════════════════════════ */
  (function halfWave() {
    const cv = document.getElementById('cv-sw'); if (!cv) return;
    let Vm = 5, mode = 'cvd', clock = 0;
    Stage(cv, { ratio: w => w < 560 ? 0.95 : 0.46, minH: 300, maxH: 420, draw(ctx, w, h, dt) {
      clock += dt * 0.35;
      const narrow = w < 560, Vg = mode === 'ideal' ? 0 : 0.7;
      const ph = (clock % 2), vin = Vm * Math.sin(ph * Math.PI), on = vin > Vg;
      /* 電路（上方或左方） */
      const cx0 = narrow ? w * 0.1 : w * 0.04, cx1 = narrow ? w * 0.9 : w * 0.34, cy0 = narrow ? h * 0.08 : h * 0.22, cy1 = narrow ? h * 0.34 : h * 0.72;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.strokeRect(cx0, cy0, cx1 - cx0, cy1 - cy0);
      const sy = (cy0 + cy1) / 2, sr = Math.min(16, (cy1 - cy0) * 0.22);
      ctx.fillStyle = C.surface; ctx.beginPath(); ctx.arc(cx0, sy, sr, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); for (let k = 0; k <= 16; k++) { const x = cx0 - sr * 0.6 + sr * 1.2 * k / 16, y = sy - Math.sin(k / 16 * TAU) * sr * 0.4; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      labelCJK(ctx, cx0 + sr + 6, sy, 'v<sub>I</sub>', C.ink, 12, 'left', '700');
      /* 二極體在上面中間 */
      const dx = (cx0 + cx1) / 2, ds = 11;
      ctx.fillStyle = C.surface; ctx.fillRect(dx - ds - 4, cy0 - ds - 2, 2 * ds + 8, 2 * ds + 4);
      ctx.beginPath(); ctx.moveTo(dx - ds, cy0 - ds); ctx.lineTo(dx - ds, cy0 + ds); ctx.lineTo(dx + ds, cy0); ctx.closePath();
      ctx.fillStyle = on ? C.accent : C.surface; ctx.fill(); ctx.strokeStyle = C.ink; ctx.stroke();
      ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(dx + ds, cy0 - ds); ctx.lineTo(dx + ds, cy0 + ds); ctx.stroke(); ctx.lineWidth = 1.6;
      labelCJK(ctx, dx, cy0 - ds - 10, on ? 'ON（' + (Vg ? '0.7 V 電池' : '短路') + '）' : 'OFF（斷路）', on ? C.accent : C['ink-3'], 12, 'center', '700');
      /* 電阻在右邊 */
      const ry = sy;
      ctx.fillStyle = C.surface; ctx.fillRect(cx1 - 8, ry - 22, 16, 44);
      ctx.beginPath(); for (let k = 0; k <= 8; k++) { const y = ry - 22 + 44 * k / 8, x = cx1 + (k % 2 ? 6 : -6) * (k === 0 || k === 8 ? 0 : 1); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      labelCJK(ctx, cx1 - 12, ry, 'R', C.ink, 12, 'right', '700');
      labelCJK(ctx, cx1 + 12, ry, 'v<sub>O</sub>', C.accent, 12, 'left', '700');
      /* 電流點 */
      if (on) { const per = 2 * ((cx1 - cx0) + (cy1 - cy0)); for (let k = 0; k < 8; k++) { let s = ((clock * 0.6 + k / 8) % 1) * per; let x, y;
        if (s < cx1 - cx0) { x = cx0 + s; y = cy0; } else if ((s -= cx1 - cx0) < cy1 - cy0) { x = cx1; y = cy0 + s; } else if ((s -= cy1 - cy0) < cx1 - cx0) { x = cx1 - s; y = cy1; } else { s -= cx1 - cx0; x = cx0; y = cy1 - s; }
        dot(ctx, x, y, 2.6, C.accent); } }
      /* 波形 */
      const px0 = narrow ? w * 0.08 : w * 0.44, px1 = w * 0.96, py0 = narrow ? h * 0.46 : h * 0.1, py1 = narrow ? h * 0.92 : h * 0.86;
      const pm = (py0 + py1) / 2, A = (py1 - py0) / 2 * 0.86 / Math.max(Vm, 1), X = t => lerp(px0, px1, t / 2), Y = v => pm - v * A;
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px0, pm); ctx.lineTo(px1, pm); ctx.stroke();
      if (Vg) { ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(px0, Y(Vg)); ctx.lineTo(px1, Y(Vg)); ctx.stroke(); ctx.setLineDash([]); label(ctx, px1, Y(Vg) - 8, '0.7 V', C['ink-3'], 10, 'right'); }
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (let n = 0; n <= 200; n++) { const t = n / 100; n ? ctx.lineTo(X(t), Y(Vm * Math.sin(t * Math.PI))) : ctx.moveTo(X(t), Y(0)); } ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.6; ctx.beginPath();
      for (let n = 0; n <= 200; n++) { const t = n / 100, vi = Vm * Math.sin(t * Math.PI), vo = Math.max(0, vi - Vg); n ? ctx.lineTo(X(t), Y(vo)) : ctx.moveTo(X(t), Y(vo)); } ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(ph), py0); ctx.lineTo(X(ph), py1); ctx.stroke();
      dot(ctx, X(ph), Y(Math.max(0, vin - Vg)), 5, C.accent);
      labelCJK(ctx, px0 + 4, py0 + 6, '虛線 v<sub>I</sub>　實線 v<sub>O</sub>（脈動直流）', C['ink-2'], 11.5, 'left');
      label(ctx, X(0.5), Y(Vm - Vg) - 10, (Vm - Vg).toFixed(1) + ' V', C.accent, 11, 'center', '700');
    } });
    const msg = () => {
      const Vg = mode === 'ideal' ? 0 : 0.7, frac = Vm > Vg ? (Math.PI - 2 * Math.asin(Vg / Vm)) / TAU : 0;
      setHTML('sw-pk', Math.max(0, Vm - Vg).toFixed(2) + ' V');
      setHTML('sw-f', (frac * 100).toFixed(1) + ' %');
      setHTML('sw-msg', Vm <= 0.7 && mode === 'cvd' ? '峰值還不到 0.7 V：定電壓降模型說二極體<b>永遠 OFF</b>，輸出 0。' :
        mode === 'ideal' ? '理想模型：正半周全部通過、負半周全部擋掉，剛好一半時間導通。' :
        '定電壓降模型：v<sub>I</sub> 超過 0.7 V 才 ON，輸出比輸入矮 0.7 V；' + (Vm < 3 ? '電源小，這 0.7 V 佔了很大比例。' : '電源越大，0.7 V 越不明顯。'));
    };
    bindRange('sw-vm', x => x.toFixed(1) + ' V', x => { Vm = x; msg(); });
    document.querySelectorAll('[data-swm]').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.swm; document.querySelectorAll('[data-swm]').forEach(x => x.classList.toggle('solid', x === b)); msg();
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤⑥⑦⑧ 負載線實驗室（共用）：圖形法、片段線性、Q 點移動、逆偏
     cfg: { id, pre, vps:[min,max,val], r:[min,max,val], model:'exp'|'pwl'|'cvd'|'pick', game, rev }
     ══════════════════════════════════════════════════════════ */
  function loadLab(cfg) {
    const cv = document.getElementById(cfg.id); if (!cv) return;
    const p = cfg.pre;
    let VPS = cfg.vps[2], Rk = cfg.r[2], Vg = 0.6, rf = 10, model = cfg.model === 'pick' ? 'cvd' : cfg.model, target = null, wins = 0, st = null;
    const IS = 1e-13;
    const sol = () => model === 'exp' ? Object.assign(solveExp(VPS, Rk, IS), { on: true }) : solvePWL(VPS, Rk, model === 'cvd' ? 0.7 : Vg, model === 'cvd' ? 0 : rf);
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.82 : 0.48, minH: 270, maxH: 400, draw(ctx, w, h) {
      const vmax = Math.max(Math.abs(VPS), 1) * 1.12, imax = Math.max(Math.abs(VPS) / Rk, 0.3) * 1.25;
      const v0 = cfg.rev ? -Math.max(vmax, 1.5) : -0.15 * vmax, v1 = cfg.rev ? Math.max(vmax, 1.5) : vmax;
      const i0 = cfg.rev ? -imax : -0.08 * imax, i1 = imax;
      const step = imax > 4 ? 2 : imax > 2 ? 1 : imax > 0.8 ? 0.5 : 0.2;
      const it = []; for (let i = Math.ceil(i0 / step) * step; i <= i1; i += step) if (Math.abs(i) > 1e-9) it.push(+i.toFixed(2));
      const vs = Math.abs(VPS) > 6 ? 2 : 1, vt = []; for (let v = Math.ceil(v0 / vs) * vs; v <= v1; v += vs) if (v) vt.push(v);
      const F = frame(ctx, w, h, { v0, v1, i0, i1, vt, it });
      /* 二極體曲線 */
      const fexp = v => IS * (Math.exp(Math.min(v, 1.2) / VT) - 1) * 1e3;
      if (model === 'exp' || cfg.ghost) plot(ctx, F, fexp, v0, Math.min(v1, 0.9), model === 'exp' ? C.accent : C['ink-3'], model === 'exp' ? 2.8 : 1.4, model === 'exp' ? [] : [4, 4]);
      if (model !== 'exp') {
        const vg = model === 'cvd' ? 0.7 : Vg, r = model === 'cvd' ? 0 : rf;
        ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(F.X(v0), F.Y(0)); ctx.lineTo(F.X(vg), F.Y(0));
        ctx.lineTo(F.X(r ? vg + i1 * 1e-3 * r : vg), F.Y(i1)); ctx.stroke();
      }
      /* 負載線：I = (VPS − V)/R */
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.save(); ctx.beginPath(); ctx.rect(F.L, F.T, F.R - F.L, F.B - F.T); ctx.clip();
      ctx.beginPath(); ctx.moveTo(F.X(v0), F.Y((VPS - v0) / Rk)); ctx.lineTo(F.X(v1), F.Y((VPS - v1) / Rk)); ctx.stroke(); ctx.restore();
      /* 截距 */
      dot(ctx, F.X(VPS), F.Y(0), 4.5, C.ink); dot(ctx, F.X(0), F.Y(VPS / Rk), 4.5, C.ink);
      label(ctx, F.X(VPS), F.Y(0) + (VPS > 0 ? -12 : 12), 'V<sub>PS</sub> = ' + VPS.toFixed(1), C.ink, 10.5, VPS > 0 ? 'right' : 'center', '700');
      label(ctx, F.X(0) + 8, F.Y(VPS / Rk), 'V<sub>PS</sub>/R = ' + (VPS / Rk).toFixed(2) + ' mA', C.ink, 10.5, 'left', '700');
      /* 目標（遊戲） */
      if (target) { ctx.setLineDash([5, 4]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(F.L, F.Y(target)); ctx.lineTo(F.R, F.Y(target)); ctx.stroke(); ctx.setLineDash([]);
        labelCJK(ctx, F.R - 4, F.Y(target) - 9, '目標 ' + target.toFixed(2) + ' mA', C.warn, 11, 'right', '700'); }
      /* Q 點 */
      const s = sol(), qi = s.i * 1e3;
      ctx.setLineDash([3, 3]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(F.X(s.v), F.Y(qi)); ctx.lineTo(F.X(s.v), F.Y(0)); ctx.moveTo(F.X(s.v), F.Y(qi)); ctx.lineTo(F.X(0), F.Y(qi)); ctx.stroke(); ctx.setLineDash([]);
      dot(ctx, F.X(s.v), F.Y(qi), 7, C.accent);
      labelCJK(ctx, F.X(s.v) + 10, F.Y(qi) - 12, 'Q (' + s.v.toFixed(2) + ' V, ' + qi.toFixed(qi && Math.abs(qi) < 1 ? 3 : 2) + ' mA)', C.accent, 12, 'left', '700');
    } });
    function msg() {
      const s = sol(), qi = s.i * 1e3;
      setHTML(p + '-vd', s.v.toFixed(3) + ' V');
      setHTML(p + '-id', fmtA(s.i));
      if (cfg.game && target) {
        const ok = Math.abs(qi - target) / target < 0.03;
        setHTML(p + '-msg', ok ? '<b>✓ 中了！</b>R = ' + Rk.toFixed(2) + ' kΩ 讓 Q 點落在 ' + qi.toFixed(2) + ' mA。公式驗算：R = (V<sub>PS</sub> − V<sub>D</sub>)/I<sub>D</sub> = (' + VPS.toFixed(1) + ' − ' + s.v.toFixed(2) + ')/' + qi.toFixed(2) + 'm = ' + ((VPS - s.v) / qi).toFixed(2) + ' kΩ。'
          : '調 R（或 V<sub>PS</sub>）讓 Q 點落在橘色虛線上。現在差 ' + ((qi - target) / target * 100).toFixed(0) + '%。' + (qi > target ? '電流太大 → R 加大（負載線變平）。' : '電流太小 → R 減小（負載線變陡）。'));
        if (ok && !target.done) { target.done = true; wins++; setHTML(p + '-score', '過關 ' + wins); }
      } else {
        setHTML(p + '-msg', cfg.rev && VPS < 0 ? '電源反過來：負載線跑到第三象限，交在 <b>OFF 那段</b>（I<sub>D</sub> = 0），Q = (' + VPS.toFixed(1) + ' V, 0)。整個 ' + (-VPS).toFixed(1) + ' V 都反著落在二極體上。'
          : !s.on ? 'V<sub>PS</sub> 還不夠把二極體推過 V<sub>γ</sub>：交在 OFF 那段，I<sub>D</sub> = 0。'
          : model === 'exp' ? '負載線（外面電路的規矩）和指數曲線（二極體的規矩）的交點就是 Q。電源、電阻怎麼調，Q 點的 V<sub>D</sub> 都卡在 0.6 V 附近 —— 二極體的曲線太陡了。'
          : model === 'cvd' ? '定電壓降：特性曲線是 0.7 V 的垂直線，Q 點只會上下滑，電流 = (V<sub>PS</sub> − 0.7)/R。'
          : '片段線性：交點 V<sub>D</sub> = V<sub>γ</sub> + I<sub>D</sub>r<sub>f</sub>。r<sub>f</sub> 只有幾十 Ω，跟 kΩ 的 R 比幾乎沒影響。');
      }
      st.redraw();
    }
    bindRange(p + '-vps', x => x.toFixed(1) + ' V', x => { VPS = x; msg(); });
    bindRange(p + '-r', x => x.toFixed(2) + ' kΩ', x => { Rk = x; msg(); });
    if (document.getElementById(p + '-vg')) bindRange(p + '-vg', x => x.toFixed(2) + ' V', x => { Vg = x; msg(); });
    if (document.getElementById(p + '-rf')) bindRange(p + '-rf', x => x.toFixed(0) + ' Ω', x => { rf = x; msg(); });
    cv.closest('.bench').querySelectorAll('[data-lm]').forEach(b => b.addEventListener('click', () => {
      model = b.dataset.lm; cv.closest('.bench').querySelectorAll('[data-lm]').forEach(x => x.classList.toggle('solid', x === b)); msg();
    }));
    cv.closest('.bench').querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => {
      const [v, r] = b.dataset.q.split(',').map(Number);
      const sv = document.getElementById(p + '-vps'), sr = document.getElementById(p + '-r');
      sv.value = v; sv.dispatchEvent(new Event('input')); sr.value = r; sr.dispatchEvent(new Event('input'));
    }));
    const nb = document.getElementById(p + '-new');
    if (nb) nb.addEventListener('click', () => { const opts = [0.5, 0.8, 1.2, 1.5, 2.2, 3, 4]; let t; do { t = opts[Math.floor(Math.random() * opts.length)]; } while (target && t === +target); target = new Number(t); msg(); });
    if (cfg.game && nb) nb.click(); else msg();
  }
  loadLab({ id: 'cv-load', pre: 'ld', vps: [1, 10, 5], r: [0.5, 10, 2], model: 'exp', game: true });
  loadLab({ id: 'cv-pwl', pre: 'pw', vps: [1, 10, 5], r: [0.2, 10, 2], model: 'pwl', ghost: true });
  loadLab({ id: 'cv-q', pre: 'qq', vps: [1, 10, 5], r: [0.5, 8, 2], model: 'pick', ghost: true });
  loadLab({ id: 'cv-rev', pre: 'rv', vps: [-10, 10, -5], r: [0.5, 8, 2], model: 'cvd', rev: true });
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, lerp, clamp, sci, sup, liveExample } = E;
  const P5 = window.__p5;
  const f2 = x => x.toFixed(2), f3 = x => x.toFixed(3);
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); };
  /* 橫條比較圖 */
  function bars(ctx, w, h, rows, unit) {
    const x0 = Math.max(w * 0.3, 110), x1 = w * 0.9, mx = Math.max(1e-9, ...rows.map(r => Math.abs(r[1])));
    rows.forEach(([nm, v, col], k) => {
      const y = h * ((k + 0.6) / (rows.length + 0.2)), len = Math.max(2, (x1 - x0) * Math.abs(v) / mx);
      ctx.fillStyle = col; ctx.fillRect(x0, y - 8, len, 16);
      labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
      label(ctx, x0 + len + 6, y, v.toFixed(Math.abs(v) < 1 ? 3 : 2) + unit, col, 10.5, 'left', '700');
    });
  }

  /* ── 複習：同一個電路，三種模型 ── */
  liveExample('#ex-recap', {
    title: '例題 · 5 V、2 kΩ 的電路，三種模型各算多少？',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'xr-v', label: '電源 V<sub>PS</sub>', min: 0.5, max: 15, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xr-r', label: '電阻 R', min: 0.1, max: 10, step: 0.1, value: 2, fmt: v => v.toFixed(1) + ' kΩ' }
    ],
    compute: g => {
      const V = g['xr-v'], R = g['xr-r'], ex = P5.solveExp(V, R, 1e-13);
      return { V, R, I0: V / R, I7: Math.max(0, (V - 0.7) / R), Ie: ex.i * 1e3, ve: ex.v };
    },
    question: (g, r) => '電源 <b>V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V</b> 串 <b>R = ' + r.R.toFixed(1) + ' kΩ</b> 和一顆順向的矽二極體（I<sub>S</sub> = 10<sup>−13</sup> A）。用 (a) 理想模型、(b) 定電壓降模型（0.7 V）、(c) 指數公式各算電流。',
    questionEn: (g, r) => 'A ' + r.V.toFixed(1) + ' V supply drives a ' + r.R.toFixed(1) + ' kΩ resistor in series with a forward-biased Si diode (I<sub>S</sub> = 10<sup>−13</sup> A). Find the current using (a) the ideal model, (b) the constant-voltage-drop model, (c) the diode equation.',
    steps: (g, r) => [
      { t: 'Step 1　理想模型：導通 = 短路。', eq: 'I = V<sub>PS</sub>/R = ' + r.V.toFixed(1) + '/' + r.R.toFixed(1) + 'k = ' + f3(r.I0) + ' mA' },
      { t: 'Step 2　定電壓降：導通 = 0.7 V 電池。', note: r.I7 > 0 ? '' : 'V<sub>PS</sub> &lt; 0.7 V，模型判斷 OFF：', eq: r.I7 > 0 ? 'I = (V<sub>PS</sub> − 0.7)/R = ' + f3(r.I7) + ' mA' : 'I = 0' },
      { t: 'Step 3　指數公式（負載線交點，程式解）。', eq: 'V<sub>D</sub> = ' + f3(r.ve) + ' V，I = ' + (r.Ie >= 0.001 ? f3(r.Ie) + ' mA' : P5.fmtA(r.Ie * 1e-3)) },
      { t: 'Step 4　該用哪個？', note: r.Ie < 0.01 ? '電源太小，二極體幾乎沒導通：理想模型錯得離譜，定電壓降說 OFF 比較接近。'
        : Math.abs(r.I0 - r.Ie) / r.Ie < 0.1 ? '電源遠大於 0.7 V：理想模型只差 ' + ((r.I0 - r.Ie) / r.Ie * 100).toFixed(0) + '%，<b>理想模型就夠</b>。'
        : '理想模型差 ' + ((r.I0 - r.Ie) / r.Ie * 100).toFixed(0) + '%，太多；定電壓降只差 ' + Math.abs((r.I7 - r.Ie) / r.Ie * 100).toFixed(1) + '%。<b>要扣 0.7 V</b>。' }
    ],
    answer: (g, r) => '(a) ' + f2(r.I0) + ' mA　(b) ' + f2(r.I7) + ' mA　(c) ' + (r.Ie >= 0.01 ? f2(r.Ie) + ' mA' : P5.fmtA(r.Ie * 1e-3)),
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['理想', r.I0, C['ink-3']], ['定電壓降', r.I7, C.ink], ['指數（真值）', r.Ie, C.accent]], ' mA')
  });

  /* ── 崩潰：PIV 檢查 ── */
  liveExample('#ex-bd', {
    title: '例題 · 這顆二極體會不會崩潰？',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'xb-rms', label: '交流電源（rms）', min: 6, max: 240, step: 1, value: 110, fmt: v => v + ' V' },
      { id: 'xb-piv', label: '二極體 PIV 額定', min: 25, max: 1000, step: 25, value: 200, fmt: v => v + ' V' }
    ],
    compute: g => { const Vm = Math.SQRT2 * g['xb-rms'], piv = g['xb-piv']; return { rms: g['xb-rms'], Vm, piv, ratio: piv / Vm }; },
    question: (g, r) => '用一顆二極體把 <b>' + r.rms + ' V（rms）</b>的交流電做半波整流（電阻負載）。二極體的 <b>PIV = ' + r.piv + ' V</b>。負半周二極體被反著加的最大電壓是多少？安不安全？',
    questionEn: (g, r) => 'A diode half-wave rectifies a ' + r.rms + ' V (rms) supply into a resistive load. The diode is rated PIV = ' + r.piv + ' V. What is the maximum reverse voltage across the diode? Is it safe?',
    steps: (g, r) => [
      { t: 'Step 1　rms 換峰值。', eq: 'V<sub>m</sub> = √2 × ' + r.rms + ' = ' + r.Vm.toFixed(1) + ' V' },
      { t: 'Step 2　負半周二極體 OFF，電阻沒電流。', note: '輸入全部落在二極體上：', eq: '|v<sub>D</sub>|<sub>max</sub> = V<sub>m</sub> = ' + r.Vm.toFixed(1) + ' V' },
      { t: 'Step 3　跟 PIV 比。', eq: 'PIV / V<sub>m</sub> = ' + r.piv + ' / ' + r.Vm.toFixed(1) + ' = ' + r.ratio.toFixed(2) },
      { t: 'Step 4　結論。', note: r.ratio < 1 ? '<b>不安全</b>：最大逆壓超過額定，負半周會進入崩潰。換一顆 PIV 更大的。'
        : r.ratio < 1.5 ? '勉強撐得住，但餘裕不到 1.5 倍；電源上下浮動、突波一來就可能崩潰。'
        : '<b>安全</b>，而且有 ' + r.ratio.toFixed(1) + ' 倍的餘裕。' }
    ],
    answer: (g, r) => '最大逆壓 ' + r.Vm.toFixed(1) + ' V；' + (r.ratio < 1 ? '會崩潰 ✗' : r.ratio < 1.5 ? '勉強（餘裕不足）' : '安全 ✓'),
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['最大逆壓 V<sub>m</sub>', r.Vm, C.ink], ['PIV 額定', r.piv, r.ratio < 1 ? C.bad : C.accent]], ' V')
  });

  /* ── 齊納 vs 累增：摻雜 → W、平均電場、BV ── */
  liveExample('#ex-zener', {
    title: '例題 · 摻雜多濃，會是哪一種崩潰？',
    ratio: 0.26, minH: 140, maxH: 180,
    givens: [
      { id: 'xz-n', label: '摻雜 N<sub>a</sub> = N<sub>d</sub> = N', min: 14, max: 19, step: 0.5, value: 16, fmt: v => '10' + sup(v % 1 ? v.toFixed(1) : v.toFixed(0)) + ' cm' + sup('−3') },
      { id: 'xz-vr', label: '逆偏 V<sub>R</sub>', min: 1, max: 50, step: 1, value: 5, fmt: v => v + ' V' }
    ],
    compute: g => {
      const N = Math.pow(10, g['xz-n']), VR = g['xz-vr'], d = P5.depW(N, VR), bv = P5.bvOf(N);
      return { lg: g['xz-n'], N, VR, vbi: d.vbi, W: d.W, Eavg: (d.vbi + VR) / d.W, bv, m: P5.mech(bv) };
    },
    question: (g, r) => '對稱的矽 pn 接面，兩邊摻雜都是 <b>N = 10' + sup(r.lg % 1 ? r.lg.toFixed(1) : r.lg.toFixed(0)) + ' cm' + sup('−3') + '</b>，加逆偏 <b>V<sub>R</sub> = ' + r.VR + ' V</b>。求空乏區寬度 W、空乏區平均電場，並判斷崩潰比較可能是哪一種。',
    questionEn: (g, r) => 'A symmetric Si pn junction has N<sub>a</sub> = N<sub>d</sub> = 10' + sup(r.lg % 1 ? r.lg.toFixed(1) : r.lg.toFixed(0)) + ' cm' + sup('−3') + ' and a reverse bias of ' + r.VR + ' V. Find the depletion width, the average field in the depletion region, and the likely breakdown mechanism.',
    steps: (g, r) => [
      { t: 'Step 1　內建電壓。', eq: 'V<sub>bi</sub> = V<sub>T</sub> ln(N<sup>2</sup>/n<sub>i</sub><sup>2</sup>) = ' + f3(r.vbi) + ' V' },
      { t: 'Step 2　空乏區寬度（PART 3 的公式）。', note: '講義 1-110 的 W ∝ √(1/N<sub>A</sub> + 1/N<sub>D</sub>)：', eq: 'W = √(2ε<sub>s</sub>(V<sub>bi</sub> + V<sub>R</sub>)/e · 2/N) = ' + (r.W * 1e4).toFixed(3) + ' μm' },
      { t: 'Step 3　平均電場。', note: '講義 1-109：E ≈ V/W（突變接面的最大電場約是平均的 2 倍）：', eq: 'E ≈ (V<sub>bi</sub> + V<sub>R</sub>)/W = ' + sci(r.Eavg, 2) + ' V/cm' },
      { t: 'Step 4　崩潰電壓（經驗式，課本延伸）。', eq: 'BV ≈ 60 (N<sub>eff</sub>/10<sup>16</sup>)<sup>−3/4</sup> ≈ ' + (r.bv >= 100 ? r.bv.toFixed(0) : r.bv.toFixed(1)) + ' V' },
      { t: 'Step 5　判斷。', note: r.m === '齊納' ? '高摻雜、W 很窄、BV 只有幾伏：<b>齊納崩潰</b>（電場直接扯開共價鍵）。' + (r.VR >= r.bv ? '現在 V<sub>R</sub> 已經超過 BV，<b>正在崩潰</b>。' : '')
        : r.m === '累增' ? '低摻雜、W 寬、BV 大：<b>累增崩潰</b>（加速撞擊、連鎖反應）。' + (r.VR >= r.bv ? '現在 V<sub>R</sub> 已經超過 BV，<b>正在崩潰</b>。' : '現在 V<sub>R</sub> = ' + r.VR + ' V 還離 BV 很遠。')
        : 'BV 在 5～6 V 附近：兩種機制同時存在。' }
    ],
    answer: (g, r) => 'W ≈ ' + (r.W * 1e4).toFixed(3) + ' μm，E ≈ ' + sci(r.Eavg, 2) + ' V/cm，BV ≈ ' + (r.bv >= 100 ? r.bv.toFixed(0) : r.bv.toFixed(1)) + ' V → ' + r.m,
    draw: (ctx, w, h, g, r) => {
      /* 摻雜 10^14～10^19 的 BV（對數座標），標出現在這點 */
      const x0 = Math.max(56, w * 0.12), x1 = w * 0.95, y0 = h * 0.14, y1 = h * 0.78;
      const X = lg => lerp(x0, x1, (lg - 14) / 5), Y = bv => lerp(y1, y0, (Math.log10(bv) + 0.5) / 4);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      [14, 15, 16, 17, 18, 19].forEach(l => { ctx.beginPath(); ctx.moveTo(X(l), y0); ctx.lineTo(X(l), y1); ctx.stroke(); label(ctx, X(l), y1 + 12, '10<sup>' + l + '</sup>', C['ink-3'], 9.5); });
      [1, 10, 100, 1000].forEach(b => { ctx.beginPath(); ctx.moveTo(x0, Y(b)); ctx.lineTo(x1, Y(b)); ctx.stroke(); label(ctx, x0 - 6, Y(b), b + ' V', C['ink-3'], 9.5, 'right'); });
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, Y(5.5), x1 - x0, y1 - Y(5.5));
      labelCJK(ctx, x0 + 6, y1 - 9, '齊納區（BV < 5 V）', C['ink-2'], 10.5, 'left');
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let n = 0; n <= 100; n++) { const lg = 14 + 5 * n / 100, bv = P5.bvOf(Math.pow(10, lg)); const y = clamp(Y(bv), y0, y1); n ? ctx.lineTo(X(lg), y) : ctx.moveTo(X(lg), y); }
      ctx.stroke();
      dot(ctx, X(r.lg), clamp(Y(r.bv), y0, y1), 6, C.accent);
      labelCJK(ctx, x1, y0 - 4, 'BV 對摻雜（低摻雜 → BV 大）', C['ink-3'], 10.5, 'right');
    }
  });

  /* ── 半波整流 ── */
  liveExample('#ex-sw', {
    title: '例題 · 半波整流：輸出峰值與導通時間',
    ratio: 0.26, minH: 140, maxH: 180,
    givens: [
      { id: 'xs-vm', label: '輸入峰值 V<sub>m</sub>', min: 0.5, max: 20, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xs-vg', label: '導通電壓 V<sub>γ</sub>', min: 0, max: 0.8, step: 0.05, value: 0.7, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => {
      const Vm = g['xs-vm'], Vg = g['xs-vg'], on = Vm > Vg;
      const a = on ? Math.asin(Vg / Vm) : Math.PI / 2, frac = on ? (Math.PI - 2 * a) / (2 * Math.PI) : 0;
      /* 平均輸出：(1/2π)∫(Vm sin θ − Vγ) dθ，從 a 到 π − a */
      const vdc = on ? (2 * Vm * Math.cos(a) - Vg * (Math.PI - 2 * a)) / (2 * Math.PI) : 0;
      return { Vm, Vg, on, a, frac, vpk: Math.max(0, Vm - Vg), vdc };
    },
    question: (g, r) => '半波整流：輸入弦波峰值 <b>V<sub>m</sub> = ' + r.Vm.toFixed(1) + ' V</b>，二極體用 <b>V<sub>γ</sub> = ' + r.Vg.toFixed(2) + ' V</b> 的定電壓降模型。求輸出峰值、一個週期裡二極體導通的時間比例、輸出平均值。',
    questionEn: (g, r) => 'A half-wave rectifier has a sinusoidal input with peak V<sub>m</sub> = ' + r.Vm.toFixed(1) + ' V. Using V<sub>γ</sub> = ' + r.Vg.toFixed(2) + ' V, find the peak output, the fraction of each period the diode conducts, and the average output voltage.',
    steps: (g, r) => [
      { t: 'Step 1　輸出峰值。', note: 'ON 時 v<sub>O</sub> = v<sub>I</sub> − V<sub>γ</sub>：', eq: 'v<sub>O,peak</sub> = ' + r.Vm.toFixed(1) + ' − ' + f2(r.Vg) + ' = ' + f2(r.vpk) + ' V' },
      { t: 'Step 2　什麼時候開始導通。', eq: r.on ? 'V<sub>m</sub> sin θ = V<sub>γ</sub>　⟹　θ = sin<sup>−1</sup>(' + f2(r.Vg) + '/' + r.Vm.toFixed(1) + ') = ' + (r.a * 180 / Math.PI).toFixed(1) + '°' : 'V<sub>m</sub> ≤ V<sub>γ</sub>：永遠不導通' },
      { t: 'Step 3　導通時間比例。', eq: '(180° − 2θ) / 360° = ' + (r.frac * 100).toFixed(1) + ' %' },
      { t: 'Step 4　輸出平均值（積分，課本第 2 章會用）。', eq: 'V<sub>avg</sub> = ' + f3(r.vdc) + ' V' + (r.Vg === 0 ? '（= V<sub>m</sub>/π）' : '（理想時 V<sub>m</sub>/π = ' + f3(r.Vm / Math.PI) + ' V）') },
      { t: 'Step 5　解讀。', note: !r.on ? '峰值連 V<sub>γ</sub> 都不到：二極體從頭到尾 OFF，輸出 0。'
        : r.Vg / r.Vm > 0.1 ? 'V<sub>γ</sub> 佔了峰值的 ' + (r.Vg / r.Vm * 100).toFixed(0) + '%：電源小的時候這 0.7 V <b>不能忽略</b>。'
        : 'V<sub>γ</sub> 只佔峰值的 ' + (r.Vg / r.Vm * 100).toFixed(0) + '%：導通將近半個週期，用理想模型也差不多。' }
    ],
    answer: (g, r) => '峰值 ' + f2(r.vpk) + ' V；導通 ' + (r.frac * 100).toFixed(1) + '%；平均 ' + f3(r.vdc) + ' V',
    draw: (ctx, w, h, g, r) => {
      const x0 = w * 0.06, x1 = w * 0.96, ym = h * 0.55, A = h * 0.38 / Math.max(r.Vm, 0.5);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, ym); ctx.lineTo(x1, ym); ctx.stroke();
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.4; ctx.beginPath();
      for (let n = 0; n <= 200; n++) { const t = n / 100, x = lerp(x0, x1, t / 2), y = ym - r.Vm * Math.sin(t * Math.PI) * A; n ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let n = 0; n <= 200; n++) { const t = n / 100, x = lerp(x0, x1, t / 2), y = ym - Math.max(0, r.Vm * Math.sin(t * Math.PI) - r.Vg) * A; n ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x0, ym - r.vdc * A); ctx.lineTo(x1, ym - r.vdc * A); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, x1, ym - r.vdc * A - 9, '平均 ' + f2(r.vdc) + ' V', C.ink, 10.5, 'right', '700');
    }
  });

  /* ── 疊代法（Example 1.8） ── */
  liveExample('#ex-load', {
    title: '例題 · Example 1.8：用疊代法求 Q 點',
    ratio: 0.3, minH: 150, maxH: 200,
    givens: [
      { id: 'xl-v', label: '電源 V<sub>PS</sub>', min: 1, max: 12, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xl-r', label: '電阻 R', min: 0.2, max: 10, step: 0.1, value: 2, fmt: v => v.toFixed(1) + ' kΩ' },
      { id: 'xl-is', label: 'I<sub>S</sub>', min: -16, max: -11, step: 1, value: -13, fmt: v => '10' + sup(v) + ' A' }
    ],
    compute: g => {
      const V = g['xl-v'], R = g['xl-r'], IS = Math.pow(10, g['xl-is']), it = [];
      let vd = 0.6;
      for (let k = 0; k < 4; k++) { const I = (V - vd) / R; const v2 = 0.026 * Math.log(I * 1e-3 / IS); it.push([vd, I, v2]); vd = v2; }
      const ex = P5.solveExp(V, R, IS);
      return { V, R, lg: g['xl-is'], IS, it, v: ex.v, i: ex.i * 1e3 };
    },
    question: (g, r) => '<b>V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V</b>、<b>R = ' + r.R.toFixed(1) + ' kΩ</b>，二極體 <b>I<sub>S</sub> = 10' + sup(r.lg) + ' A</b>（n = 1、V<sub>T</sub> = 0.026 V）。用疊代法求 V<sub>D</sub>、I<sub>D</sub>。',
    questionEn: (g, r) => 'With V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V, R = ' + r.R.toFixed(1) + ' kΩ and I<sub>S</sub> = 10' + sup(r.lg) + ' A, determine the diode voltage and current by iteration.',
    steps: (g, r) => [
      { t: 'Step 1　兩條式子。', eq: 'KVL：I<sub>D</sub> = (V<sub>PS</sub> − V<sub>D</sub>)/R　｜　二極體：V<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub>)' },
      { t: 'Step 2　從 V<sub>D</sub> = 0.6 V 開始輪流代。', eq: r.it.map((p, k) => '第 ' + (k + 1) + ' 輪：V<sub>D</sub> = ' + p[0].toFixed(4) + ' → I<sub>D</sub> = ' + p[1].toFixed(4) + ' mA → V<sub>D</sub> = ' + p[2].toFixed(4) + ' V').join('<br>') },
      { t: 'Step 3　收斂。', note: Math.abs(r.it[1][2] - r.it[0][2]) < 0.001 ? '第 2 輪就只差不到 1 mV，<b>兩輪就夠</b>。' : '前幾輪還在動，多代幾輪。', eq: 'V<sub>D</sub> = ' + f3(r.v) + ' V，I<sub>D</sub> = ' + f3(r.i) + ' mA' },
      { t: 'Step 4　解讀。', note: r.V < 1.5 ? 'V<sub>PS</sub> 不大，V<sub>D</sub> 佔了一大塊，電流對 V<sub>D</sub> 很敏感 —— 這種情況疊代（或負載線）才準。'
        : 'I<sub>S</sub> 每大 10 倍，V<sub>D</sub> 只少 60 mV；電流幾乎只由 V<sub>PS</sub>、R 決定。' }
    ],
    answer: (g, r) => 'V<sub>D</sub> ≈ ' + f3(r.v) + ' V、I<sub>D</sub> ≈ ' + f3(r.i) + ' mA',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(48, w * 0.1), x1 = w * 0.95, y0 = h * 0.1, y1 = h * 0.82;
      const vmax = r.V * 1.05, imax = r.V / r.R * 1.15;
      const X = v => lerp(x0, x1, v / vmax), Y = i => lerp(y1, y0, i / imax);
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let n = 0; n <= 200; n++) { const v = 0.9 * n / 200, i = r.IS * (Math.exp(v / 0.026) - 1) * 1e3; if (i > imax) break; n ? ctx.lineTo(X(v), Y(i)) : ctx.moveTo(X(v), Y(i)); } ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(X(0), Y(r.V / r.R)); ctx.lineTo(X(r.V), Y(0)); ctx.stroke();
      dot(ctx, X(r.v), Y(r.i), 6, C.accent);
      labelCJK(ctx, X(r.v) + 10, Y(r.i) - 10, 'Q (' + f3(r.v) + ' V, ' + f2(r.i) + ' mA)', C.accent, 11.5, 'left', '700');
      label(ctx, X(r.V), y1 + 12, r.V.toFixed(1) + ' V', C['ink-3'], 10);
      label(ctx, x0 - 6, Y(r.V / r.R), f2(r.V / r.R), C['ink-3'], 10, 'right');
    }
  });

  /* ── 設計 R（講義 Problem） ── */
  liveExample('#ex-design', {
    title: '例題 · 講義 Problem：Q 點要設在這裡，R 要多大？',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'xd-v', label: '電源 V<sub>PS</sub>', min: 0.5, max: 12, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xd-vd', label: '想要的 V<sub>D</sub>', min: 0.5, max: 0.75, step: 0.01, value: 0.62, fmt: v => v.toFixed(2) + ' V' },
      { id: 'xd-id', label: '想要的 I<sub>D</sub>', min: 0.1, max: 20, step: 0.1, value: 2.2, fmt: v => v.toFixed(1) + ' mA' }
    ],
    compute: g => { const V = g['xd-v'], vd = g['xd-vd'], id = g['xd-id']; return { V, vd, id, R: (V - vd) / id, P: id * vd }; },
    question: (g, r) => '工作點要設在 <b>(' + f2(r.vd) + ' V, ' + r.id.toFixed(1) + ' mA)</b>，電源 <b>V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V</b>。外接電阻 R 要設計多少？',
    questionEn: (g, r) => 'The Q-point is to be (' + f2(r.vd) + ' V, ' + r.id.toFixed(1) + ' mA) with V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V. What value of R is required?',
    steps: (g, r) => [
      { t: 'Step 1　KVL。', eq: 'V<sub>PS</sub> = I<sub>D</sub>R + V<sub>D</sub>' },
      { t: 'Step 2　解 R。', eq: r.R > 0 ? 'R = (' + r.V.toFixed(1) + ' − ' + f2(r.vd) + ') / ' + r.id.toFixed(1) + ' mA = ' + f3(r.R) + ' kΩ' : 'V<sub>PS</sub> − V<sub>D</sub> ≤ 0：沒有正的 R 能做到' },
      { t: 'Step 3　檢查。', note: r.R <= 0 ? '電源連二極體要的電壓都給不起，這個 Q 點<b>做不到</b>。'
        : r.R < 0.1 ? 'R 只有 ' + (r.R * 1000).toFixed(0) + ' Ω —— 電阻很小時，電源一點點變動 Q 點就大移，實務上不好控制。'
        : '負載線經過 (' + r.V.toFixed(1) + ' V, 0) 和 Q 點，斜率 −1/R。二極體消耗 ' + r.P.toFixed(2) + ' mW。' }
    ],
    answer: (g, r) => r.R > 0 ? 'R ≈ ' + f3(r.R) + ' kΩ' + (Math.abs(r.R - 2) < 0.05 ? '（≈ 2 kΩ，講義答案）' : '') : '做不到（V<sub>PS</sub> 太小）',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(48, w * 0.1), x1 = w * 0.95, y0 = h * 0.12, y1 = h * 0.82;
      const vmax = Math.max(r.V, 1) * 1.05, imax = Math.max(r.id * 1.4, 0.5);
      const X = v => lerp(x0, x1, v / vmax), Y = i => lerp(y1, y0, i / imax);
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
      if (r.R > 0) { ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(X(r.V), Y(0)); ctx.lineTo(X(0), Y(r.V / r.R)); ctx.stroke(); }
      dot(ctx, X(r.V), Y(0), 4.5, C.ink); dot(ctx, X(r.vd), Y(r.id), 6, C.accent);
      labelCJK(ctx, X(r.vd) + 10, Y(r.id) - 10, 'Q', C.accent, 12, 'left', '700');
      labelCJK(ctx, x1, y0, r.R > 0 ? '斜率 −1/R，R = ' + f2(r.R) + ' kΩ' : '做不到', C.ink, 11, 'right', '700');
    }
  });

  /* ── Example 1.9：片段線性 ── */
  liveExample('#ex-pwl', {
    title: '例題 · Example 1.9：片段線性模型',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'xp-v', label: '電源 V<sub>PS</sub>', min: 0.2, max: 12, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xp-r', label: '電阻 R', min: 0.01, max: 10, step: 0.01, value: 2, fmt: v => v.toFixed(2) + ' kΩ' },
      { id: 'xp-vg', label: 'V<sub>γ</sub>', min: 0.5, max: 0.8, step: 0.05, value: 0.6, fmt: v => v.toFixed(2) + ' V' },
      { id: 'xp-rf', label: 'r<sub>f</sub>', min: 0, max: 100, step: 5, value: 10, fmt: v => v + ' Ω' }
    ],
    compute: g => {
      const V = g['xp-v'], R = g['xp-r'], vg = g['xp-vg'], rf = g['xp-rf'], s = P5.solvePWL(V, R, vg, rf);
      return { V, R, vg, rf, on: s.on, i: s.i * 1e3, v: s.v, P: s.i * 1e3 * s.v, i0: Math.max(0, (V - vg) / R) };
    },
    question: (g, r) => '<b>V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V</b>、<b>R = ' + r.R.toFixed(2) + ' kΩ</b>，二極體用片段線性模型：<b>V<sub>γ</sub> = ' + f2(r.vg) + ' V、r<sub>f</sub> = ' + r.rf + ' Ω</b>。求 I<sub>D</sub>、V<sub>D</sub> 與二極體消耗的功率。',
    questionEn: (g, r) => 'With V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V and R = ' + r.R.toFixed(2) + ' kΩ, determine the diode current, voltage and power dissipated using the piecewise linear model with V<sub>γ</sub> = ' + f2(r.vg) + ' V and r<sub>f</sub> = ' + r.rf + ' Ω.',
    steps: (g, r) => [
      { t: 'Step 1　先假設導通，二極體換成 V<sub>γ</sub> 電池 + r<sub>f</sub>。', note: r.on ? '' : 'V<sub>PS</sub> ≤ V<sub>γ</sub>，算出來的電流會 ≤ 0 —— 假設不成立：', eq: r.on ? 'V<sub>PS</sub> = I<sub>D</sub>R + V<sub>γ</sub> + I<sub>D</sub>r<sub>f</sub>' : '二極體 OFF：I<sub>D</sub> = 0、V<sub>D</sub> = V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V' },
      { t: 'Step 2　解 I<sub>D</sub>。', eq: r.on ? 'I<sub>D</sub> = (' + r.V.toFixed(1) + ' − ' + f2(r.vg) + ') / (' + (r.R * 1000).toFixed(0) + ' + ' + r.rf + ') = ' + f3(r.i) + ' mA' : 'I<sub>D</sub> = 0' },
      { t: 'Step 3　V<sub>D</sub>。', eq: r.on ? 'V<sub>D</sub> = V<sub>γ</sub> + I<sub>D</sub>r<sub>f</sub> = ' + f2(r.vg) + ' + ' + f3(r.i) + 'm × ' + r.rf + ' = ' + f3(r.v) + ' V' : 'V<sub>D</sub> = ' + r.V.toFixed(2) + ' V（小於 V<sub>γ</sub>）' },
      { t: 'Step 4　功率。', eq: 'P<sub>D</sub> = I<sub>D</sub>V<sub>D</sub> = ' + f3(r.P) + ' mW' },
      { t: 'Step 5　r<sub>f</sub> 重不重要？', note: !r.on ? '二極體沒導通，r<sub>f</sub> 不用管。'
        : r.rf / (r.R * 1000) < 0.02 ? 'r<sub>f</sub> 只有 R 的 ' + (r.rf / (r.R * 1000) * 100).toFixed(1) + '%：拿掉 r<sub>f</sub>（定電壓降）電流 ' + f3(r.i0) + ' mA，幾乎一樣 —— <b>r<sub>f</sub> ≪ R 可以忽略</b>（講義 1-122 (2)）。'
        : 'r<sub>f</sub> 佔了 R 的 ' + (r.rf / (r.R * 1000) * 100).toFixed(0) + '%：拿掉 r<sub>f</sub> 會算成 ' + f3(r.i0) + ' mA，差了 ' + ((r.i0 - r.i) / r.i * 100).toFixed(0) + '% —— 這時 <b>r<sub>f</sub> 不能省</b>。' }
    ],
    answer: (g, r) => 'I<sub>D</sub> = ' + f3(r.i) + ' mA、V<sub>D</sub> = ' + f3(r.v) + ' V、P<sub>D</sub> = ' + f3(r.P) + ' mW',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['片段線性', r.i, C.accent], ['拿掉 r<sub>f</sub>', r.i0, C.ink]], ' mA')
  });

  /* ── 定電壓降 + 負載線：Q 點怎麼移 ── */
  liveExample('#ex-cvd', {
    title: '例題 · Fig 1.30：定電壓降模型的 Q 點',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'xc-v', label: '電源 V<sub>PS</sub>', min: 0.5, max: 10, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xc-r', label: '電阻 R', min: 0.5, max: 8, step: 0.5, value: 2, fmt: v => v.toFixed(1) + ' kΩ' }
    ],
    compute: g => { const V = g['xc-v'], R = g['xc-r'], ex = P5.solveExp(V, R, 1e-13); return { V, R, i: Math.max(0, (V - 0.7) / R), ie: ex.i * 1e3, ve: ex.v }; },
    question: (g, r) => '定電壓降模型（V<sub>γ</sub> = 0.7 V、r<sub>f</sub> = 0）。<b>V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V</b>、<b>R = ' + r.R.toFixed(1) + ' kΩ</b>，求 Q 點，並跟指數公式（I<sub>S</sub> = 10<sup>−13</sup> A）比較。',
    questionEn: (g, r) => 'Using the constant-voltage-drop model (V<sub>γ</sub> = 0.7 V), find the Q-point for V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V and R = ' + r.R.toFixed(1) + ' kΩ, and compare with the diode equation (I<sub>S</sub> = 10<sup>−13</sup> A).',
    steps: (g, r) => [
      { t: 'Step 1　特性曲線是 0.7 V 的垂直線。', eq: r.V > 0.7 ? 'V<sub>DQ</sub> = 0.7 V' : 'V<sub>PS</sub> ≤ 0.7 V：交在 OFF 段，I<sub>DQ</sub> = 0' },
      { t: 'Step 2　負載線代 V<sub>D</sub> = 0.7 V。', eq: 'I<sub>DQ</sub> = (V<sub>PS</sub> − 0.7)/R = (' + r.V.toFixed(1) + ' − 0.7)/' + r.R.toFixed(1) + 'k = ' + f3(r.i) + ' mA' },
      { t: 'Step 3　指數公式（程式解）。', eq: 'V<sub>D</sub> = ' + f3(r.ve) + ' V、I<sub>D</sub> = ' + f3(r.ie) + ' mA' },
      { t: 'Step 4　誤差。', note: r.ie < 0.01 ? '電源太小，兩個模型都說幾乎沒電流。'
        : '定電壓降差 ' + Math.abs((r.i - r.ie) / r.ie * 100).toFixed(1) + '%（' + (r.i < r.ie ? '偏小' : '偏大') + '）。' + (Math.abs(r.i - r.ie) / r.ie < 0.05 ? '<b>夠用</b>。' : '電源不大時，0.7 V 估太高，<b>誤差變大</b>。') }
    ],
    answer: (g, r) => 'Q = (0.7 V, ' + f3(r.i) + ' mA)；指數公式 (' + f3(r.ve) + ' V, ' + f3(r.ie) + ' mA)',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['定電壓降', r.i, C.ink], ['指數（真值）', r.ie, C.accent]], ' mA')
  });

  /* ── 逆偏 ── */
  liveExample('#ex-rev', {
    title: '例題 · 講義 1-126：電源反過來，Q 點在哪？',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'xv-v', label: '電源 V<sub>PS</sub>（對二極體的方向）', min: -10, max: 10, step: 0.5, value: -5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xv-r', label: '電阻 R', min: 0.5, max: 8, step: 0.5, value: 2, fmt: v => v.toFixed(1) + ' kΩ' }
    ],
    compute: g => { const V = g['xv-v'], R = g['xv-r'], s = P5.solvePWL(V, R, 0.6, 10); return { V, R, on: s.on, v: s.v, i: s.i * 1e3 }; },
    question: (g, r) => '片段線性模型（V<sub>γ</sub> = 0.6 V、r<sub>f</sub> = 10 Ω），電源對二極體來說是 <b>' + r.V.toFixed(1) + ' V</b>，<b>R = ' + r.R.toFixed(1) + ' kΩ</b>。求負載線的兩個截距和 Q 點。',
    questionEn: (g, r) => 'Using the piecewise linear model (V<sub>γ</sub> = 0.6 V, r<sub>f</sub> = 10 Ω), with V<sub>PS</sub> = ' + r.V.toFixed(1) + ' V and R = ' + r.R.toFixed(1) + ' kΩ, find the load-line intercepts and the Q-point.',
    steps: (g, r) => [
      { t: 'Step 1　負載線。', eq: 'I<sub>D</sub> = −V<sub>D</sub>/R + V<sub>PS</sub>/R' },
      { t: 'Step 2　兩個截距。', eq: 'I<sub>D</sub> = 0 → V<sub>D</sub> = ' + r.V.toFixed(1) + ' V　｜　V<sub>D</sub> = 0 → I<sub>D</sub> = ' + (r.V / r.R).toFixed(2) + ' mA' },
      { t: 'Step 3　交點。', note: r.on ? 'V<sub>PS</sub> &gt; V<sub>γ</sub>：交在 ON 那段：' : 'V<sub>PS</sub> ≤ V<sub>γ</sub>：交在 OFF 那段（I<sub>D</sub> = 0）：', eq: 'Q = (' + f3(r.v) + ' V, ' + f3(r.i) + ' mA)' },
      { t: 'Step 4　解讀。', note: r.V < 0 ? '逆偏：負載線整條在第三象限附近，跟特性曲線只交在水平的 OFF 段，<b>電阻沒電流，' + (-r.V).toFixed(1) + ' V 全部反著落在二極體上</b>。' : r.on ? '順偏導通：跟前面一樣。' : '順偏但不到 V<sub>γ</sub>：還是 OFF。' }
    ],
    answer: (g, r) => 'Q = (' + f2(r.v) + ' V, ' + f3(r.i) + ' mA)',
    draw: (ctx, w, h, g, r) => {
      const xm = w / 2, ym = h * 0.5, sx = (w * 0.42) / 10.5, sy = (h * 0.4) / Math.max(10 / r.R, 1);
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(w * 0.06, ym); ctx.lineTo(w * 0.94, ym); ctx.moveTo(xm, h * 0.06); ctx.lineTo(xm, h * 0.94); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * 0.06, ym); ctx.lineTo(xm + 0.6 * sx, ym); ctx.lineTo(xm + 0.6 * sx + 0.3 * sx, h * 0.06); ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(xm + r.V * sx, ym); ctx.lineTo(xm, ym - r.V / r.R * sy); ctx.stroke();
      dot(ctx, xm + r.v * sx, ym - r.i * sy, 6, C.accent);
      labelCJK(ctx, xm + r.v * sx, ym - r.i * sy + (r.V < 0 ? -14 : 16), 'Q', C.accent, 12, 'center', '700');
    }
  });
})();

/* ============================================================
   小測驗（中英對照，選項每次打亂）
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '逆偏電壓超過崩潰電壓（BV）時會發生什麼事？',
      en: 'What happens when the reverse-bias voltage exceeds the breakdown voltage (BV)?',
      o: [['逆向電流突然大幅增加', 'the reverse current increases sharply'],
          ['逆向電流變成零', 'the reverse current drops to zero'],
          ['二極體變成順偏', 'the diode becomes forward biased'],
          ['空乏區消失', 'the depletion region disappears']], a: 0,
      e: '空乏區電場強到破壞共價鍵、產生電子電洞對，電流突然大增（投影片 1-106）。崩潰不一定是損壞，但功率太大會燒掉。' },
    { zh: '累增崩潰（avalanche breakdown）通常發生在哪種二極體？',
      en: 'Avalanche breakdown usually occurs in which kind of diode?',
      o: [['低摻雜、崩潰電壓較大', 'lightly doped, with a larger breakdown voltage'],
          ['高摻雜、崩潰電壓較小', 'heavily doped, with a smaller breakdown voltage'],
          ['本質半導體做的二極體', 'a diode made of intrinsic semiconductor'],
          ['任何順偏的二極體', 'any forward-biased diode']], a: 0,
      e: '低摻雜空乏區寬，需要大逆偏才有夠強的電場；載子在長路上被加速、撞擊游離、連鎖反應（投影片 1-107、1-110）。' },
    { zh: '累增崩潰的「連鎖反應」指的是？',
      en: 'What is the "chain reaction" in avalanche breakdown?',
      o: [['被加速的載子撞斷共價鍵，產生的新載子又被加速去撞，1→2→4→8', 'accelerated carriers break covalent bonds and the new carriers are accelerated in turn: 1→2→4→8'],
          ['電場直接把電子從共價鍵扯出來', 'the field pulls electrons directly out of the covalent bonds'],
          ['電子和電洞不斷復合', 'electrons and holes keep recombining'],
          ['摻雜原子一個接一個游離', 'dopant atoms ionize one after another']], a: 0,
      e: '這叫撞擊游離（impact ionization）。「直接扯出來」是齊納崩潰。' },
    { zh: '齊納崩潰（Zener breakdown）的成因是？',
      en: 'What causes Zener breakdown?',
      o: [['重摻雜使空乏區很窄，小逆偏就產生極強電場，直接把束縛電子拉離共價鍵', 'heavy doping makes the depletion region so narrow that a small reverse bias creates a field strong enough to pull bound electrons out of covalent bonds'],
          ['低摻雜使空乏區很寬，載子被加速撞擊', 'light doping makes the depletion region wide so carriers are accelerated into collisions'],
          ['溫度太高使 n<sub>i</sub> 暴增', 'high temperature makes n<sub>i</sub> explode'],
          ['順偏電流太大', 'excessive forward current']], a: 0,
      e: '投影片 1-108～1-110：W ∝ √(1/N<sub>A</sub> + 1/N<sub>D</sub>)，摻雜高 → W 小 → E ≈ V/W 大。' },
    { zh: '摻雜濃度越高，崩潰電壓的大小（|BV|）會？',
      en: 'As the doping concentration increases, the magnitude of the breakdown voltage?',
      o: [['變小', 'decreases'], ['變大', 'increases'], ['不變', 'stays the same'], ['先變大再變小', 'first increases then decreases']], a: 0,
      e: '高摻雜 → 空乏區窄 → 小電壓就有強電場 → BV 小（Fig 1.21 的 BV1）；低摻雜 → BV 大（BV2）。' },
    { zh: '二極體的 PIV（反向峰值電壓）額定的用途是？',
      en: 'What is the purpose of a diode\'s peak inverse voltage (PIV) rating?',
      o: [['規定逆偏不可超過的電壓，避免進入崩潰', 'it specifies the reverse voltage that must not be exceeded, to avoid breakdown'],
          ['規定順偏導通電壓', 'it specifies the forward turn-on voltage'],
          ['規定最大順向電流', 'it specifies the maximum forward current'],
          ['規定齊納二極體的穩壓值', 'it specifies the regulation voltage of a Zener diode']], a: 0,
      e: '投影片 1-111：一般二極體（低摻雜）BV 約 50～200 V，操作不可超過 PIV；齊納二極體則是故意操作在崩潰區穩壓。' },
    { zh: '為什麼二極體被稱為「非線性」的二端元件？',
      en: 'Why is the diode called a nonlinear two-terminal device?',
      o: [['電流與電壓是指數關係 i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1)，不是直線', 'its current depends exponentially on voltage, i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1), not linearly'],
          ['它有兩個以上的端點', 'it has more than two terminals'],
          ['它的電阻固定', 'its resistance is constant'],
          ['它只能用在交流電路', 'it can only be used in AC circuits']], a: 0,
      e: '投影片 1-112。電阻的 I–V 是直線（線性），二極體是彎線，所以不能直接用 V = IR。' },
    { zh: '用圖形法分析二極體電路時，Q 點（工作點）是哪兩條線的交點？',
      en: 'In graphical analysis of a diode circuit, the Q-point is the intersection of which two curves?',
      o: [['二極體特性曲線與負載線', 'the diode characteristic curve and the load line'],
          ['負載線與 V<sub>D</sub> 軸', 'the load line and the V<sub>D</sub> axis'],
          ['兩條負載線', 'two load lines'],
          ['特性曲線與 I<sub>D</sub> 軸', 'the characteristic curve and the I<sub>D</sub> axis']], a: 0,
      e: '投影片 1-116、1-118：特性曲線是元件自己的規矩，負載線是外面電路的規矩，兩個都要滿足。' },
    { zh: 'V<sub>PS</sub> = 5 V、R = 2 kΩ 的負載線，兩個截距是？',
      en: 'For V<sub>PS</sub> = 5 V and R = 2 kΩ, what are the two intercepts of the load line?',
      o: [['V<sub>D</sub> = 5 V（I<sub>D</sub> = 0）與 I<sub>D</sub> = 2.5 mA（V<sub>D</sub> = 0）', 'V<sub>D</sub> = 5 V (I<sub>D</sub> = 0) and I<sub>D</sub> = 2.5 mA (V<sub>D</sub> = 0)'],
          ['V<sub>D</sub> = 0.7 V 與 I<sub>D</sub> = 2.15 mA', 'V<sub>D</sub> = 0.7 V and I<sub>D</sub> = 2.15 mA'],
          ['V<sub>D</sub> = 2.5 V 與 I<sub>D</sub> = 5 mA', 'V<sub>D</sub> = 2.5 V and I<sub>D</sub> = 5 mA'],
          ['V<sub>D</sub> = 5 V 與 I<sub>D</sub> = 10 mA', 'V<sub>D</sub> = 5 V and I<sub>D</sub> = 10 mA']], a: 0,
      e: 'I<sub>D</sub> = −V<sub>D</sub>/R + V<sub>PS</sub>/R：令 I<sub>D</sub> = 0 得 V<sub>D</sub> = 5 V；令 V<sub>D</sub> = 0 得 I<sub>D</sub> = 5/2k = 2.5 mA（投影片 1-119）。斜率 −1/R。' },
    { zh: '片段線性模型中，二極體導通時等效成什麼？',
      en: 'In the piecewise linear model, what is a conducting diode equivalent to?',
      o: [['電壓源 V<sub>γ</sub> 串聯電阻 r<sub>f</sub>', 'a voltage source V<sub>γ</sub> in series with a resistance r<sub>f</sub>'],
          ['短路', 'a short circuit'],
          ['斷路', 'an open circuit'],
          ['電流源 I<sub>S</sub>', 'a current source I<sub>S</sub>']], a: 0,
      e: 'V<sub>D</sub> = V<sub>γ</sub> + I<sub>D</sub>r<sub>f</sub>（投影片 1-120、1-121）。V<sub>γ</sub> 一般 0.6～0.7 V，r<sub>f</sub> 數十 Ω。' },
    { zh: 'Example 1.9（V<sub>PS</sub> = 5 V、R = 2 kΩ、V<sub>γ</sub> = 0.6 V、r<sub>f</sub> = 10 Ω）的二極體電流約為？',
      en: 'In Example 1.9 (V<sub>PS</sub> = 5 V, R = 2 kΩ, V<sub>γ</sub> = 0.6 V, r<sub>f</sub> = 10 Ω), the diode current is approximately?',
      o: [['2.19 mA', '2.19 mA'], ['2.5 mA', '2.5 mA'], ['440 mA', '440 mA'], ['0.3 mA', '0.3 mA']], a: 0,
      e: 'I<sub>D</sub> = (5 − 0.6)/(2000 + 10) = 2.19 mA；V<sub>D</sub> = 0.6 + 2.19m × 10 = 0.622 V；P<sub>D</sub> = 1.36 mW。' },
    { zh: '定電壓降模型（r<sub>f</sub> = 0）下，改變 V<sub>PS</sub> 或 R，Q 點會怎麼移動？',
      en: 'With the constant-voltage-drop model (r<sub>f</sub> = 0), how does the Q-point move when V<sub>PS</sub> or R changes?',
      o: [['沿著 V<sub>D</sub> = V<sub>γ</sub> 的垂直線上下移動，I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/R', 'it slides up or down the vertical line V<sub>D</sub> = V<sub>γ</sub>, with I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/R'],
          ['沿著 I<sub>D</sub> = 0 的水平線左右移動', 'it slides left or right along I<sub>D</sub> = 0'],
          ['完全不動', 'it does not move'],
          ['沿著負載線移動，V<sub>D</sub> 跟著 V<sub>PS</sub> 變', 'it moves along the load line with V<sub>D</sub> following V<sub>PS</sub>']], a: 0,
      e: 'Fig 1.30：A 5 V/2 kΩ → 2.15 mA、B 5 V/4 kΩ → 1.075 mA、C 2.5 V/2 kΩ → 0.9 mA、D 2.5 V/4 kΩ → 0.45 mA，V<sub>D</sub> 都是 0.7 V。' },
    { zh: '二極體反接（逆偏）、V<sub>PS</sub> = 5 V、R = 2 kΩ，Q 點為？（V<sub>D</sub>、I<sub>D</sub> 照原本定義）',
      en: 'With the diode reversed (reverse biased), V<sub>PS</sub> = 5 V and R = 2 kΩ, what is the Q-point (using the original sign definitions)?',
      o: [['(−5 V, 0 A)', '(−5 V, 0 A)'], ['(0 V, −2.5 mA)', '(0 V, −2.5 mA)'], ['(0.7 V, 2.15 mA)', '(0.7 V, 2.15 mA)'], ['(5 V, 0 A)', '(5 V, 0 A)']], a: 0,
      e: '負載線截距 (−5 V, 0)、(0, −2.5 mA)，跟片段線性模型交在 OFF 段：I<sub>D</sub> = 0，整個 5 V 反著落在二極體上（投影片 1-126）。' }
  ];
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
    const verdict = pct >= 90 ? '崩潰和二極體直流分析都通了。下一步：二極體電路（整流、限幅、齊納穩壓）。'
      : pct >= 70 ? '主幹抓到了。答錯的回去玩對應的負載線實驗室，看 Q 點怎麼跑。'
      : '建議先把「負載線 × 特性曲線 = Q 點」這件事在負載線實驗室裡玩熟，再回來做一次。';
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
