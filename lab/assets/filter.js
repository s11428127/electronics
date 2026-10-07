/* ============================================================
   電子實習 第四章 整流器濾波 — 互動模組、可改數字例題、結果、測驗
   模擬：1N4002 SPICE 模型（IS 14.11 nA、N 1.984、RS 33.89 mΩ），隱式尤拉法每步解二極體電壓，
   C = 0 也能算（就是沒濾波）。Python 版（40 週期）驗算過的數字放在 RESULTS。
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, arrow, disc, bindRange, setText, clamp, lerp, liveExample } = E;

  /* ── 數字格式 ── */
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '−');
  const fmtR = r => r >= 1000 ? fix(r / 1000, r >= 10000 ? 0 : 1).replace(/\.0$/, '') + ' kΩ' : Math.round(r) + ' Ω';
  const fmtC = c => c <= 0 ? '沒有電容' : (c >= 1e-4 ? Math.round(c * 1e6) : c >= 1e-5 ? fix(c * 1e6, 0) : fix(c * 1e6, 1)) + ' µF';
  const fmtT = s => s >= 1 ? (Math.round(s * 100) / 100) + ' s' : s >= 1e-3 ? fix(s * 1e3, s >= 0.1 ? 0 : 1).replace(/\.0$/, '') + ' ms' : fix(s * 1e6, 0) + ' µs';
  const pct = x => (x >= 100 ? fix(x, 0) : x >= 10 ? fix(x, 1) : fix(x, 2)) + '%';
  const mA = a => (a >= 1 ? fix(a, 2) + ' A' : fix(a * 1e3, a * 1e3 >= 100 ? 0 : 1) + ' mA');
  /* 滑桿 = 10 的次方（對數），避免浮點誤差先四捨五入到 0.05 */
  const pow10 = v => Math.pow(10, Math.round(v * 20) / 20);
  const sliderR = v => pow10(v);                  /* 2～4 → 100 Ω～10 kΩ */
  const sliderC = v => pow10(v) * 1e-6;           /* 0～3 → 1 µF～1000 µF */

  /* ══════════════════════════════════════════════════════════
     模擬器：半波／橋式整流 + RC 負載
     ══════════════════════════════════════════════════════════ */
  const IS = 14.11e-9, NVT = 1.984 * 0.025852, RS = 0.03389;
  const cache = new Map();
  function simulate(R, Cap, opt) {
    opt = opt || {};
    const bridge = !!opt.bridge, Vm = opt.Vm || 5, f = opt.f || 60, spc = opt.spc || 1000;
    const key = [R, Cap, bridge, Vm, f, spc].join('|');
    if (cache.has(key)) return cache.get(key);
    const T = 1 / f, dt = T / spc, Cdt = Cap / dt, G = 1 / R, nd = bridge ? 2 : 1;
    const settle = Math.max(6, Math.min(40, Math.ceil(5 * R * Cap / T) + 6)), rec = 2;
    let v = 0, vd = 0;
    const t = [], vs = [], vo = [], id = [];
    for (let k = 0; k < (settle + rec) * spc; k++) {
      const s = Vm * Math.sin(2 * Math.PI * k / spc), vin = bridge ? Math.abs(s) : s;
      /* 解 vd：Cdt·(vo − v) + vo/R − i = 0，vo = vin − nd·(vd + i·RS) */
      let i = 0;
      for (let it = 0; it < 60; it++) {
        const ex = Math.exp(Math.min(vd, 1.3) / NVT);
        i = IS * (ex - 1); const g = IS / NVT * ex;
        const von = vin - nd * (vd + i * RS);
        const fv = Cdt * (von - v) + von * G - i;
        const df = -(Cdt + G) * nd * (1 + RS * g) - g;
        let step = -fv / df;
        if (vd + step > 0.4 && step > 0.05) step = 0.05;
        vd += step;
        if (Math.abs(step) < 1e-10) break;
      }
      i = IS * (Math.exp(Math.min(vd, 1.3) / NVT) - 1);
      v = vin - nd * (vd + i * RS);
      if (k >= settle * spc) { t.push((k - settle * spc) * dt); vs.push(s); vo.push(v); id.push(Math.max(0, i)); }
    }
    let vmax = -1e9, vmin = 1e9, sum = 0, ipk = 0;
    vo.forEach(x => { vmax = Math.max(vmax, x); vmin = Math.min(vmin, x); sum += x; });
    id.forEach(x => { ipk = Math.max(ipk, x); });
    const vdc = sum / vo.length;
    const vrms = Math.sqrt(vo.reduce((a, x) => a + (x - vdc) * (x - vdc), 0) / vo.length);
    const on = id.filter(x => x > 0.02 * ipk).length / id.length;
    const r = { R, C: Cap, bridge, T, t, vs, vo, id, vmax, vmin, vdc, vpp: vmax - vmin, vrms, ipk, idc: vdc / R,
      onFrac: on, onPulse: on * T / (bridge ? 2 : 1) };
    if (cache.size > 120) cache.clear();
    cache.set(key, r);
    return r;
  }
  window.__FLSIM = simulate;

  /* Python（40 週期穩態）驗算過的 6 組＋橋式 */
  const RESULTS = [
    { R: 100, C: 10e-6, vmax: 4.234, vmin: 0.000, vdc: 1.298, vpp: 4.233, rr: 121.6, ipk: 0.0452 },
    { R: 100, C: 100e-6, vmax: 4.230, vmin: 1.157, vdc: 2.559, vpp: 3.072, rr: 37.8, ipk: 0.1764 },
    { R: 1000, C: 10e-6, vmax: 4.348, vmin: 1.195, vdc: 2.638, vpp: 3.153, rr: 37.7, ipk: 0.0178 },
    { R: 1000, C: 100e-6, vmax: 4.301, vmin: 3.712, vdc: 4.010, vpp: 0.589, rr: 4.4, ipk: 0.0725 },
    { R: 10000, C: 10e-6, vmax: 4.419, vmin: 3.815, vdc: 4.120, vpp: 0.604, rr: 4.4, ipk: 0.0074 },
    { R: 10000, C: 100e-6, vmax: 4.334, vmin: 4.269, vdc: 4.302, vpp: 0.065, rr: 0.5, ipk: 0.0105 }
  ];

  /* ── 共用：畫一張「時間 vs 電壓」 ── */
  function plotFrame(ctx, x0, y0, x1, y1, vlo, vhi, opt) {
    opt = opt || {};
    const Y = v => lerp(y1, y0, (v - vlo) / (vhi - vlo));
    ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
    (opt.ticks || []).forEach(v => { label(ctx, x0 - 5, Y(v), (v < 0 ? '−' : '') + Math.abs(v), C['ink-3'], 9.5, 'right'); });
    return Y;
  }
  function trace(ctx, xs, ys, X, Y, col, lw, dash) {
    ctx.beginPath();
    for (let k = 0; k < xs.length; k++) { const px = X(xs[k]), py = Y(ys[k]); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.lineJoin = 'round'; ctx.stroke(); ctx.setLineDash([]);
  }
  /* 有底色的小標籤（壓在曲線上也看得清楚）；minX：不要超出左邊界 */
  function tag(ctx, x, y, txt, align, minX) {
    ctx.font = '500 10px "Noto Sans TC", system-ui, sans-serif';
    const w = ctx.measureText(txt.replace(/<[^>]+>/g, '')).width + 8;
    let left = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    if (minX !== undefined && left < minX) left = minX;
    ctx.fillStyle = C.surface; ctx.globalAlpha = 0.9; ctx.fillRect(left, y - 8, w, 16); ctx.globalAlpha = 1;
    labelCJK(ctx, left + 4, y, txt, C['ink-2'], 10, 'left');
  }
  /* 畫二極體導通的區間（淡色底） */
  function shadeOn(ctx, r, X, y0, y1) {
    ctx.fillStyle = C['accent']; ctx.globalAlpha = 0.12;
    let st = -1;
    for (let k = 0; k <= r.t.length; k++) {
      const on = k < r.t.length && r.id[k] > 0.02 * r.ipk;
      if (on && st < 0) st = k;
      if (!on && st >= 0) { ctx.fillRect(X(r.t[st]), y0, Math.max(1, X(r.t[k - 1]) - X(r.t[st])), y1 - y0); st = -1; }
    }
    ctx.globalAlpha = 1;
  }

  /* ══════════════════════════════════════════════════════════
     ① 電源供應器四個方塊    p.2
     ══════════════════════════════════════════════════════════ */
  (function chain() {
    const cv = document.getElementById('cv-chain'); if (!cv) return;
    let Cv = 1e-4, ph = 0, playing = true;
    const R = 1000, VREG = 3.3, DROP = 0.3;
    const st = Stage(cv, { ratio: w => (w >= 620 ? 0.3 : 0.72), minH: 230, maxH: 320, draw(ctx, w, h, dt) {
      if (playing) ph = (ph + dt * 0.25) % 1;
      const wide = w >= 620, cols = wide ? 4 : 2, rows = wide ? 1 : 2;
      const pw = w / cols, phh = h / rows;
      const half = simulate(R, 0), filt = simulate(R, Cv);
      const reg = filt.vo.map(x => Math.min(VREG, Math.max(0, x - DROP)));
      const panels = [
        ['① 交流 v<sub>s</sub>', half.t, half.vs, -5.5, 5.5],
        ['② 整流：脈動直流', half.t, half.vo, -0.5, 5],
        ['③ 濾波：' + fmtC(Cv), filt.t, filt.vo, -0.5, 5],
        ['④ 穩壓 3.3 V', filt.t, reg, -0.5, 5]
      ];
      panels.forEach((p, i) => {
        const cx = (i % cols) * pw, cy = Math.floor(i / cols) * phh;
        const x0 = cx + 30, x1 = cx + pw - 14, y0 = cy + 26, y1 = cy + phh - 12;
        labelCJK(ctx, cx + 12, cy + 14, p[0], C.ink, 11.5, 'left', '700');
        const Y = plotFrame(ctx, x0, y0, x1, y1, p[3], p[4], { ticks: i === 0 ? [-5, 5] : [4] });
        const X = tt => lerp(x0, x1, tt / (2 * half.T));
        if (i === 2 && Cv > 0) trace(ctx, half.t, half.vo, X, Y, C['ink-3'], 1, [3, 3]);
        trace(ctx, p[1], p[2], X, Y, i === 0 ? C['ink-2'] : C.accent, 2);
        const k = Math.floor(ph * (p[1].length - 1));
        disc(ctx, X(p[1][k]), Y(p[2][k]), 3.6, C.accent, C.surface);
        if (wide && i < 3) arrow(ctx, cx + pw - 10, cy + phh / 2, cx + pw + 6, cy + phh / 2, C['ink-3'], 1.4);
      });
    }});
    function msg() {
      const r = simulate(R, Cv), el = document.getElementById('chain-msg');
      el.className = 'msg' + (r.vmin > VREG + DROP ? ' good' : '');
      el.innerHTML = Cv <= 0 ? '沒有電容：③ 跟 ② 一樣是一顆一顆的駝峰，穩壓器在駝峰之間沒東西可以穩，④ 也跟著掉到 0。'
        : r.vmin > VREG + DROP ? '濾波後最低點 ' + fix(r.vmin, 2) + ' V 還高於 3.6 V，穩壓器就能一直輸出平平的 3.3 V。<b>濾波的任務：讓最低點不要掉太低。</b>'
        : '濾波後最低點只有 ' + fix(r.vmin, 2) + ' V，低於穩壓器需要的 3.6 V，④ 在最低點附近會跟著掉下去。把 C 拉大試試。';
    }
    bindRange('chain-c', v => (v <= 0.001 ? '沒有電容' : fmtC(sliderC(v))), v => { Cv = v <= 0.001 ? 0 : sliderC(v); msg(); st.redraw && st.redraw(); });
    const pb = document.getElementById('chain-play');
    pb.addEventListener('click', () => { playing = !playing; pb.setAttribute('aria-pressed', playing); pb.textContent = playing ? '⏸ 暫停' : '▶ 播放'; });
  })();

  /* ══════════════════════════════════════════════════════════
     ② 濾波模擬器：充電與放電    p.3
     ══════════════════════════════════════════════════════════ */
  (function filterSim() {
    const cv = document.getElementById('cv-sim'); if (!cv) return;
    let R = 1000, Cv = 1e-4, bridge = false, ph = 0, playing = true;
    const st = Stage(cv, { ratio: w => (w >= 620 ? 0.42 : 0.9), minH: 260, maxH: 380, draw(ctx, w, h, dt) {
      if (playing) ph = (ph + dt * 0.22) % 1;
      const r = simulate(R, Cv, { bridge });
      const wide = w >= 620;
      const pw = wide ? w * 0.66 : w, x0 = 34, x1 = pw - 12, y0 = 30, y1 = wide ? h - 26 : h * 0.62;
      const Y = plotFrame(ctx, x0, y0, x1, y1, -5.6, 5.6, { ticks: [-5, 5] });
      const X = tt => lerp(x0, x1, tt / (2 * r.T));
      shadeOn(ctx, r, X, y0, y1);
      trace(ctx, r.t, r.vs, X, Y, C['ink-3'], 1.4, [5, 4]);
      if (bridge) trace(ctx, r.t, r.vs.map(Math.abs), X, Y, C['ink-3'], 1, [2, 3]);
      trace(ctx, r.t, r.vo, X, Y, C.accent, 2.4);
      label(ctx, x1, Y(r.vmax) - 10, 'Vo', C.accent, 11, 'right', '700');
      labelCJK(ctx, x0 + 4, 14, '虛線 v<sub>s</sub>　實線 v<sub>o</sub>　色塊＝二極體導通（充電）', C['ink-3'], 10.5, 'left');
      const k = Math.floor(ph * (r.t.length - 1)), on = r.id[k] > 0.02 * r.ipk;
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(X(r.t[k]), y0); ctx.lineTo(X(r.t[k]), y1); ctx.stroke(); ctx.setLineDash([]);
      disc(ctx, X(r.t[k]), Y(r.vo[k]), 5, C.accent, C.surface);
      /* 右邊（窄版在下面）：電路狀態 */
      const bx = wide ? pw + 10 : 14, by = wide ? 40 : y1 + 30, bw = wide ? w - pw - 22 : w - 28, bh = wide ? h - 70 : h - y1 - 44;
      drawState(ctx, bx, by, bw, bh, on, r.vo[k], r.id[k]);
    }});
    function drawState(ctx, bx, by, bw, bh, on, v, i) {
      const cx = bx + bw / 2, top = by + 50, bot = by + Math.max(84, bh - 10);
      labelCJK(ctx, cx, by + 10, on ? '充電中：二極體導通' : '放電中：二極體截止', on ? C.accent : C['ink-2'], 12.5, 'center', '700');
      const xs = bx + 18, xd = bx + bw * 0.38, xc = bx + bw * 0.62, xr = bx + bw - 18;
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(xs, top); ctx.lineTo(xr, top); ctx.moveTo(xs, bot); ctx.lineTo(xr, bot);
      ctx.moveTo(xs, top); ctx.lineTo(xs, bot); ctx.stroke();
      disc(ctx, xs, (top + bot) / 2, 11, C.surface, C['ink-2']);
      label(ctx, xs, (top + bot) / 2, '∼', C['ink-2'], 13, 'center', '700');
      /* 二極體 */
      ctx.fillStyle = on ? C.accent : C.surface; ctx.strokeStyle = on ? C.accent : C['ink-3'];
      ctx.beginPath(); ctx.moveTo(xd - 8, top - 8); ctx.lineTo(xd - 8, top + 8); ctx.lineTo(xd + 8, top); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xd + 8, top - 8); ctx.lineTo(xd + 8, top + 8); ctx.lineWidth = 2; ctx.stroke();
      if (!on) { ctx.strokeStyle = C.bad; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xd - 6, top - 14); ctx.lineTo(xd + 6, top + 14); ctx.stroke(); }
      /* 電容、電阻（垂直） */
      const my = (top + bot) / 2;
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(xc, top); ctx.lineTo(xc, my - 4); ctx.moveTo(xc, my + 4); ctx.lineTo(xc, bot);
      ctx.moveTo(xc - 10, my - 4); ctx.lineTo(xc + 10, my - 4); ctx.moveTo(xc - 10, my + 4); ctx.lineTo(xc + 10, my + 4);
      ctx.moveTo(xr, top); ctx.lineTo(xr, my - 14);
      for (let q = 0; q < 6; q++) ctx.lineTo(xr + (q % 2 ? -5 : 5), my - 14 + (q + 0.5) * 28 / 6);
      ctx.lineTo(xr, my + 14); ctx.lineTo(xr, bot); ctx.stroke();
      label(ctx, xc - 13, my, 'C', C['ink-2'], 11, 'right', '700');
      label(ctx, xr - 9, my, 'R', C['ink-2'], 11, 'right', '700');
      /* 電流方向 */
      if (on) {
        arrow(ctx, xd + 14, top - 10, xc - 6, top - 10, C.accent, 1.8);
        labelCJK(ctx, (xd + xc) / 2, top - 20, '電源→C、R', C.accent, 10, 'center');
      } else {
        arrow(ctx, xc + 6, top + 10, xr - 8, top + 10, C.accent, 1.8);
        labelCJK(ctx, (xc + xr) / 2, bot + 12, 'C 自己供電給 R', C.accent, 10, 'center');
      }
      labelCJK(ctx, cx, by + 28, 'v<sub>o</sub> = ' + fix(v, 2) + ' V', C.ink, 10.5, 'center', '700');
    }
    function refresh() {
      const r = simulate(R, Cv, { bridge }), Teff = r.T / (bridge ? 2 : 1), ratio = R * Cv / Teff;
      setText('sim-mm', fix(r.vmax, 2) + ' / ' + fix(r.vmin, 2) + ' V');
      setText('sim-dc', fix(r.vdc, 3) + ' V');
      setText('sim-pp', fix(r.vpp, 3) + ' V');
      setText('sim-r100', pct(r.vpp / r.vdc * 100));
      setText('sim-tau', Cv > 0 ? fix(ratio, ratio < 10 ? 2 : 0) + '×' : '—');
      setText('sim-on', fmtT(r.onPulse) + '／' + fmtT(Teff));
      const el = document.getElementById('sim-msg');
      el.className = 'msg' + (ratio >= 5 ? ' good' : '');
      el.innerHTML = Cv <= 0 ? '沒有電容：就是第 1 節的半波整流，色塊幾乎是整個正半週。'
        : ratio < 1 ? 'RC（' + fmtT(R * Cv) + '）比' + (bridge ? '補充間隔 T/2' : '週期 T') + '（' + fmtT(Teff) + '）還小：電容一下就放光，幾乎沒濾到。'
        : ratio < 5 ? 'RC 是 ' + (bridge ? 'T/2' : 'T') + ' 的 ' + fix(ratio, 1) + ' 倍：有濾到，但每個週期還是掉很多（漣波 ' + fix(r.vpp, 2) + ' V）。'
        : 'RC 是 ' + (bridge ? 'T/2' : 'T') + ' 的 ' + fix(ratio, 0) + ' 倍：電容只掉 ' + fix(r.vpp, 3) + ' V，二極體只在峰值前 ' + fmtT(r.onPulse) + ' 導通補一下。' +
          (bridge ? '' : '　按「改成橋式全波」看漣波怎麼砍半。');
      st.redraw && st.redraw();
    }
    bindRange('sim-r', v => fmtR(sliderR(v)), v => { R = sliderR(v); refresh(); });
    bindRange('sim-c', v => fmtC(sliderC(v)), v => { Cv = sliderC(v); refresh(); });
    const pb = document.getElementById('sim-play'), bb = document.getElementById('sim-bridge');
    pb.addEventListener('click', () => { playing = !playing; pb.setAttribute('aria-pressed', playing); pb.textContent = playing ? '⏸ 暫停' : '▶ 播放'; });
    bb.addEventListener('click', () => { bridge = !bridge; bb.setAttribute('aria-pressed', bridge); bb.textContent = bridge ? '改回半波' : '改成橋式全波'; refresh(); });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 漣波只看 RC    p.4–5
     ══════════════════════════════════════════════════════════ */
  (function rcMap() {
    const cv = document.getElementById('cv-rcmap'); if (!cv) return;
    let R = 1000, Cv = 1e-4, curve = null;
    const RCLO = 1e-4, RCHI = 10, RLO = 0.5, RHI = 500;
    function buildCurve() {
      curve = [];
      for (let k = 0; k <= 36; k++) {
        const rc = RCLO * Math.pow(RCHI / RCLO, k / 36), r = simulate(1000, rc / 1000, { spc: 400 });
        curve.push([rc, r.vpp / r.vdc * 100]);
      }
    }
    const st = Stage(cv, { animate: false, ratio: w => (w >= 620 ? 0.46 : 0.85), minH: 260, maxH: 380, draw(ctx, w, h) {
      if (!curve) { labelCJK(ctx, w / 2, h / 2, '模擬中…', C['ink-3'], 12); return; }
      const x0 = 50, x1 = w - 16, y0 = 24, y1 = h - 40;
      const X = rc => lerp(x0, x1, Math.log10(rc / RCLO) / Math.log10(RCHI / RCLO));
      const Y = p => lerp(y1, y0, Math.log10(clamp(p, RLO, RHI) / RLO) / Math.log10(RHI / RLO));
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      [[1e-4, '0.1 ms'], [1e-3, '1 ms'], [1e-2, '10 ms'], [0.1, '100 ms'], [1, '1 s'], [10, '10 s']].forEach((p, i) => { ctx.beginPath(); ctx.moveTo(X(p[0]), y0); ctx.lineTo(X(p[0]), y1); ctx.stroke();
        if (w > 420 || i % 2 === 0 || i === 5) label(ctx, X(p[0]), y1 + 13, p[1], C['ink-3'], 9.5, i === 0 ? 'left' : i === 5 ? 'right' : 'center'); });
      [1, 10, 100].forEach(p => { ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke(); label(ctx, x0 - 5, Y(p), p + '%', C['ink-3'], 9.5, 'right'); });
      labelCJK(ctx, (x0 + x1) / 2, h - 8, '橫軸 RC（對數）　縱軸 r%＝V<sub>pp</sub>/V<sub>dc</sub>（對數）', C['ink-3'], 10.5, 'center');
      /* T 的位置 */
      ctx.strokeStyle = C['ink-2']; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(1 / 60), y0); ctx.lineTo(X(1 / 60), y1); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, X(1 / 60) + 4, y0 + 8, 'T = 16.7 ms', C['ink-2'], 10, 'left', '700');
      /* 估算公式 ΔV/Vdc，ΔV = Vp/(fRC) */
      ctx.beginPath(); let first = true;
      for (let k = 0; k <= 60; k++) {
        const rc = RCLO * Math.pow(RCHI / RCLO, k / 60), dv = 4.3 / (60 * rc);
        if (dv > 4.3) continue;
        const p = dv / (4.3 - dv / 2) * 100;
        first ? ctx.moveTo(X(rc), Y(p)) : ctx.lineTo(X(rc), Y(p)); first = false;
      }
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.4; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
      /* 模擬曲線 */
      ctx.beginPath(); curve.forEach((p, k) => { k ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); });
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.stroke();
      if (w > 420) { labelCJK(ctx, X(0.3), Y(3) - 22, '虛線：估算 V<sub>p</sub>/(fRC)', C['ink-3'], 10.5, 'left'); labelCJK(ctx, X(2e-4), Y(250) + 16, '實線：模擬', C.accent, 10.5, 'left', '700'); }
      /* 實驗 6 組 */
      const pts = {};
      RESULTS.forEach(d => { const rc = d.R * d.C, k = rc.toPrecision(2); (pts[k] = pts[k] || []).push(d); });
      Object.keys(pts).forEach(k => {
        const g = pts[k], rc = g[0].R * g[0].C, p = g[0].vpp / g[0].vdc * 100;
        disc(ctx, X(rc), Y(p), 4.5, C.ink, C.surface);
        const txt = g.map(d => fmtR(d.R).replace(' ', '') + '/' + fmtC(d.C).replace(' ', '')).join('、');
        /* 標籤一律放在點的左下方（曲線往右下走，左下是空的），加底色避免壓到線 */
        tag(ctx, X(rc) - 8, Y(p) + 13, txt, 'right', x0 + 2);
      });
      /* 目前滑桿那一點 */
      const r = simulate(R, Cv), p = r.vpp / r.vdc * 100;
      disc(ctx, X(clamp(R * Cv, RCLO, RCHI)), Y(p), 7, C.accent, C.surface);
    }});
    function refresh() {
      const r = simulate(R, Cv), rc = R * Cv, same = RESULTS.filter(d => Math.abs(d.R * d.C - rc) / rc < 0.02);
      const el = document.getElementById('rcm-msg');
      el.innerHTML = 'R = ' + fmtR(R) + '、C = ' + fmtC(Cv) + ' → RC = ' + fmtT(rc) + '，r% = ' + pct(r.vpp / r.vdc * 100) + '。' +
        (same.length ? '　實驗裡 RC 一樣的是：' + same.map(d => fmtR(d.R) + '／' + fmtC(d.C)).join('、') + ' —— 它們會落在同一點。' : '　換一個 R、把 C 反方向換一樣的倍數，點不會動。');
      st.redraw();
    }
    bindRange('rcm-r', v => fmtR(sliderR(v)), v => { R = sliderR(v); refresh(); });
    bindRange('rcm-c', v => fmtC(sliderC(v)), v => { Cv = sliderC(v); refresh(); });
    refresh();
    /* 37 點的曲線要算一下，等頁面先畫好再算 */
    setTimeout(() => { buildCurve(); st.redraw(); }, 60);
  })();

  /* ══════════════════════════════════════════════════════════
     ④ 漣波長相：真實 vs 正弦 vs 鋸齒    p.6–7
     ══════════════════════════════════════════════════════════ */
  (function shape() {
    const cv = document.getElementById('cv-shape'); if (!cv) return;
    let R = 1000, Cv = 1e-4;
    const st = Stage(cv, { animate: false, ratio: w => (w >= 620 ? 0.36 : 0.7), minH: 220, maxH: 320, draw(ctx, w, h) {
      const r = simulate(R, Cv), a = r.vpp / 2 || 1e-9;
      const x0 = 50, x1 = w - 14, y0 = 24, y1 = h - 34;
      const Y = plotFrame(ctx, x0, y0, x1, y1, -1.25, 1.25, {});
      [-1, 1].forEach(s => { label(ctx, x0 - 5, Y(s), (s > 0 ? '+' : '−') + fix(a * 1000 >= 1000 ? a : a * 1000, a >= 1 ? 2 : 0) + (a >= 1 ? ' V' : ' mV'), C['ink-3'], 9.5, 'right'); });
      const X = tt => lerp(x0, x1, tt / (2 * r.T));
      /* 鋸齒：在每個峰值時刻跳到 +a，然後直線掉到 −a */
      let kpk = 0; for (let k = 0; k < r.t.length / 2; k++) if (r.vo[k] > r.vo[kpk]) kpk = k;
      const tpk = r.t[kpk];
      const saw = r.t.map(tt => { const u = (((tt - tpk) / r.T) % 1 + 1) % 1; return 1 - 2 * u; });
      const sine = r.t.map(tt => Math.cos(2 * Math.PI * (tt - tpk) / r.T - 0.0));
      trace(ctx, r.t, sine, X, Y, C['ink-3'], 1.4, [6, 4]);
      trace(ctx, r.t, saw, X, Y, C['ink-2'], 1.2, [2, 3]);
      trace(ctx, r.t, r.vo.map(x => (x - (r.vmax + r.vmin) / 2) / a), X, Y, C.accent, 2.4);
      labelCJK(ctx, x0 + 4, 12, '實線＝模擬的漣波（扣掉直流、放大）　虛線＝同峰對峰的正弦　點線＝鋸齒', C['ink-3'], 10.5, 'left');
      labelCJK(ctx, (x0 + x1) / 2, h - 10, '兩個週期（33.3 ms）', C['ink-3'], 10, 'center');
    }});
    function refresh() {
      const r = simulate(R, Cv);
      setText('shp-a', pct(r.vpp / r.vdc * 100));
      setText('shp-b', pct(r.vpp / (2 * Math.SQRT2) / r.vdc * 100));
      setText('shp-c2', pct(r.vpp / (2 * Math.sqrt(3)) / r.vdc * 100));
      setText('shp-d', pct(r.vrms / r.vdc * 100));
      const sine = r.vpp / (2 * Math.SQRT2), saw = r.vpp / (2 * Math.sqrt(3));
      const near = Math.abs(r.vrms - saw) < Math.abs(r.vrms - sine) ? '鋸齒' : '正弦';
      document.getElementById('shp-msg').innerHTML = 'V<sub>pp</sub> = ' + fix(r.vpp, 3) + ' V、V<sub>dc</sub> = ' + fix(r.vdc, 3) + ' V。真實 rms ' + fix(r.vrms * 1000, 1) + ' mV，比較接近<b>' + near + '</b>版（正弦 ' + fix(sine * 1000, 1) + '、鋸齒 ' + fix(saw * 1000, 1) + ' mV）。' +
        (R * Cv < 0.02 ? '　RC 太小時漣波根本不是小波紋，三種公式都只是粗估。' : '');
      st.redraw();
    }
    bindRange('shp-r', v => fmtR(sliderR(v)), v => { R = sliderR(v); refresh(); });
    bindRange('shp-c', v => fmtC(sliderC(v)), v => { Cv = sliderC(v); refresh(); });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ 二極體峰值電流    p.5
     ══════════════════════════════════════════════════════════ */
  (function peak() {
    const cv = document.getElementById('cv-ipk'); if (!cv) return;
    let R = 1000, Cv = 1e-4;
    const st = Stage(cv, { animate: false, ratio: w => (w >= 620 ? 0.42 : 0.85), minH: 260, maxH: 360, draw(ctx, w, h) {
      const r = simulate(R, Cv);
      const x0 = 52, x1 = w - 14, mid = h * 0.5;
      const X = tt => lerp(x0, x1, tt / (2 * r.T));
      /* 上：v_s、v_o */
      const Yv = plotFrame(ctx, x0, 22, x1, mid - 10, -0.3, 5.3, { ticks: [4] });
      trace(ctx, r.t, r.vs, X, Yv, C['ink-3'], 1.2, [5, 4]);
      trace(ctx, r.t, r.vo, X, Yv, C.accent, 2.2);
      labelCJK(ctx, x0 + 4, 12, '上：v<sub>s</sub>（虛線）與 v<sub>o</sub>　下：二極體電流 i<sub>D</sub>', C['ink-3'], 10.5, 'left');
      /* 下：i_D，縱軸固定到 200 mA 才看得出大小差別 */
      const imax = Math.max(0.2, r.ipk * 1.1), y0 = mid + 14, y1 = h - 22;
      const Yi = v => lerp(y1, y0, v / imax);
      ctx.strokeStyle = C['line-soft']; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
      label(ctx, x0 - 5, Yi(imax * 0.9), mA(imax * 0.9), C['ink-3'], 9.5, 'right');
      ctx.beginPath(); ctx.moveTo(X(r.t[0]), y1);
      r.t.forEach((tt, k) => ctx.lineTo(X(tt), Yi(r.id[k])));
      ctx.lineTo(X(r.t[r.t.length - 1]), y1); ctx.closePath();
      ctx.fillStyle = C.accent; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1;
      trace(ctx, r.t, r.id, X, Yi, C.accent, 1.8);
      ctx.strokeStyle = C['ink-2']; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0, Yi(r.idc)); ctx.lineTo(x1, Yi(r.idc)); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, x1, Yi(r.idc) - 9, 'I<sub>DC</sub> = ' + mA(r.idc), C['ink-2'], 10, 'right', '700');
      let kp = 0; r.id.forEach((x, k) => { if (x > r.id[kp]) kp = k; });
      label(ctx, clamp(X(r.t[kp]) + 6, x0 + 30, x1 - 70), Yi(r.ipk) - 2, '峰值 ' + mA(r.ipk), C.accent, 10.5, 'left', '700');
    }});
    function refresh() {
      const r = simulate(R, Cv);
      setText('ipk-idc', mA(r.idc));
      setText('ipk-pk', mA(r.ipk));
      setText('ipk-ratio', fix(r.ipk / r.idc, 1) + ' 倍');
      setText('ipk-dt', fmtT(r.onPulse));
      const el = document.getElementById('ipk-msg');
      el.className = 'msg' + (r.ipk / r.idc > 40 ? ' bad' : '');
      el.innerHTML = '負載平均只要 ' + mA(r.idc) + '，但二極體每個週期只開 ' + fmtT(r.onPulse) + '（週期的 ' + fix(r.onFrac * 100, 0) + '%），所以要用 ' + mA(r.ipk) + ' 的脈衝一次補回來 —— <b>' + fix(r.ipk / r.idc, 1) + ' 倍</b>。把 C 往右拉，脈衝會變更窄、更高。';
      st.redraw();
    }
    bindRange('ipk-r', v => fmtR(sliderR(v)), v => { R = sliderR(v); refresh(); });
    bindRange('ipk-c', v => fmtC(sliderC(v)), v => { Cv = sliderC(v); refresh(); });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     可改數字例題
     ══════════════════════════════════════════════════════════ */
  /* ── 例題 1：半波整流（不濾波）的直流值 ── */
  liveExample('#ex-dc', {
    title: '例題 · 半波整流（還沒濾波）輸出多少直流',
    ratio: 0.32, minH: 150, maxH: 200,
    givens: [
      { id: 'xd-pp', label: '函數產生器 Vpp', min: 2, max: 20, step: 1, value: 10, fmt: v => v + ' V' },
      { id: 'xd-g', label: '二極體壓降 Vγ（0 = 理想二極體）', min: 0, max: 1, step: 0.05, value: 0.7, fmt: v => fix(v, 2) + ' V' }
    ],
    compute: g => { const Vm = g['xd-pp'] / 2, Vp = Math.max(0, Vm - g['xd-g']); return { Vm, Vp, Vg: g['xd-g'], Vdc: Vp / Math.PI, pp: g['xd-pp'] }; },
    question: (g, r) => '函數產生器 <b>Vpp = ' + r.pp + ' V</b>、60 Hz，接一顆二極體（壓降 <b>' + fix(r.Vg, 2) + ' V</b>）和負載電阻做半波整流，<b>還沒加電容</b>。求輸出最高點 V<sub>p</sub>、直流值 V<sub>dc</sub>、簡化漣波因數。',
    steps: (g, r) => [
      { t: 'Step 1　峰對峰換成振幅。', note: 'Vpp 是最高到最低，振幅是一半：', eq: 'V<sub>m</sub> = ' + r.pp + ' ÷ 2 = ' + fix(r.Vm, 2) + ' V' },
      { t: 'Step 2　扣掉二極體壓降。', note: '二極體要先吃掉 Vγ 才導通：', eq: 'V<sub>p</sub> = ' + fix(r.Vm, 2) + ' − ' + fix(r.Vg, 2) + ' = ' + fix(r.Vp, 2) + ' V' },
      { t: 'Step 3　半波的平均值。', note: '一個週期只有一顆駝峰，平均 = 峰值 ÷ π：', eq: 'V<sub>dc</sub> = ' + fix(r.Vp, 2) + ' ÷ π = ' + fix(r.Vdc, 3) + ' V' },
      { t: 'Step 4　簡化漣波因數。', note: '輸出在 0 和 V<sub>p</sub> 之間跳，V<sub>pp</sub> = V<sub>p</sub>：', eq: 'r% = ' + fix(r.Vp, 2) + ' ÷ ' + fix(r.Vdc, 3) + ' × 100% = ' + (r.Vp > 0 ? '314%（就是 π）' : '—'),
        after: r.Vp <= 0 ? '<b style="color:var(--bad)">V<sub>m</sub> 比 Vγ 還小，二極體永遠不導通，輸出是 0。</b>'
          : r.Vg === 0 ? '理想二極體不扣壓降，V<sub>p</sub> = V<sub>m</sub>。不管電壓多大，沒濾波的半波 r% 永遠是 π ≈ 314%。'
          : r.Vg / r.Vm > 0.25 ? '<b style="color:var(--warn)">壓降佔了振幅的 ' + fix(r.Vg / r.Vm * 100, 0) + '%</b>：電壓小的時候，二極體這 0.7 V 很傷，所以低壓電源常用壓降小的蕭特基二極體。'
          : '不管 V<sub>p</sub> 多少，沒濾波的半波 r% 永遠是 π ≈ 314%（漣波比直流還大）。這就是要加電容的原因。' }
    ],
    answer: (g, r) => 'V<sub>p</sub> = ' + fix(r.Vp, 2) + ' V，V<sub>dc</sub> = ' + fix(r.Vdc, 3) + ' V，r%（簡化）≈ 314%',
    draw: (ctx, w, h, g, r) => {
      const x0 = 40, x1 = w - 12, y0 = 14, y1 = h - 16, top = Math.max(r.Vm, 1) * 1.1;
      const Y = v => lerp(y1, y0, (v + top) / (2 * top)), X = u => lerp(x0, x1, u / 2);
      ctx.strokeStyle = C['line-soft']; ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke();
      const xs = [], a = [], b = [];
      for (let k = 0; k <= 300; k++) { const u = k / 150, s = r.Vm * Math.sin(Math.PI * 2 * u); xs.push(u); a.push(s); b.push(Math.max(0, s - r.Vg)); }
      trace(ctx, xs, a, X, Y, C['ink-3'], 1.2, [5, 4]);
      trace(ctx, xs, b, X, Y, C.accent, 2.2);
      ctx.strokeStyle = C.ink; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x0, Y(r.Vdc)); ctx.lineTo(x1, Y(r.Vdc)); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, x1, Y(r.Vdc) - 9, 'V<sub>dc</sub> = ' + fix(r.Vdc, 2) + ' V', C.ink, 10.5, 'right', '700');
      label(ctx, x0 - 4, Y(r.Vm), fix(r.Vm, 1), C['ink-3'], 9.5, 'right');
    }
  });

  /* ── 例題 2：估算漣波，跟模擬比 ── */
  liveExample('#ex-rc', {
    title: '例題 · 用 ΔV ≈ V<sub>p</sub>/(fRC) 估漣波，再跟模擬對答案',
    ratio: 0.36, minH: 170, maxH: 220,
    givens: [
      { id: 'xr-r', label: '負載電阻 R', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => fmtR(v * 1000) },
      { id: 'xr-c', label: '濾波電容 C', min: 10, max: 1000, step: 10, value: 100, fmt: v => v + ' µF' },
      { id: 'xr-b', label: '整流方式（1 = 半波、2 = 橋式全波）', min: 1, max: 2, step: 1, value: 1, fmt: v => (v === 2 ? '橋式全波' : '半波') }
    ],
    compute: g => {
      const R = g['xr-r'] * 1000, Cv = g['xr-c'] * 1e-6, bridge = g['xr-b'] === 2;
      const Vp = bridge ? 5 - 1.4 : 5 - 0.7, fe = bridge ? 120 : 60, dv = Vp / (fe * R * Cv);
      const vdc = Vp - dv / 2, sim = simulate(R, Cv, { bridge });
      return { R, Cv, bridge, Vp, fe, dv, vdc, rr: dv / vdc * 100, sim, ratio: R * Cv * fe };
    },
    question: (g, r) => 'Vpp = 10 V、60 Hz，' + (r.bridge ? '<b>橋式全波</b>' : '<b>半波</b>') + '整流，負載 <b>R = ' + fmtR(r.R) + '</b>、濾波電容 <b>C = ' + fmtC(r.Cv) + '</b>。二極體壓降取 0.7 V，估算漣波 ΔV、V<sub>dc</sub> 與簡化漣波因數。',
    steps: (g, r) => [
      { t: 'Step 1　輸出最高點。', note: r.bridge ? '橋式每半週經過兩顆二極體，扣 2 × 0.7：' : '半波經過一顆二極體：', eq: 'V<sub>p</sub> = 5 − ' + (r.bridge ? '1.4' : '0.7') + ' = ' + fix(r.Vp, 1) + ' V' },
      { t: 'Step 2　電容多久補一次。', note: r.bridge ? '全波每半個週期就補一次，等效頻率變兩倍：' : '半波一個週期補一次：', eq: 'f<sub>補</sub> = ' + r.fe + ' Hz　（間隔 ' + fmtT(1 / r.fe) + '）' },
      { t: 'Step 3　估漣波。', note: '電容掉的電荷 = 負載拿走的電荷，I<sub>DC</sub> ≈ V<sub>p</sub>/R：', eq: 'ΔV ≈ ' + fix(r.Vp, 1) + ' ÷ (' + r.fe + ' × ' + fmtR(r.R).replace(' ', '') + ' × ' + fmtC(r.Cv).replace(' ', '') + ') = ' + fix(r.dv, 3) + ' V' },
      { t: 'Step 4　直流值與漣波因數。', note: '鋸齒在 V<sub>p</sub> 和 V<sub>p</sub> − ΔV 之間，平均約在中間：', eq: 'V<sub>dc</sub> ≈ ' + fix(r.Vp, 1) + ' − ' + fix(r.dv, 3) + '/2 = ' + fix(r.vdc, 3) + ' V，r% ≈ ' + pct(r.rr) },
      { t: 'Step 5　跟模擬對答案。', note: '用 1N4002 模型模擬：', eq: '模擬 V<sub>pp</sub> = ' + fix(r.sim.vpp, 3) + ' V、V<sub>dc</sub> = ' + fix(r.sim.vdc, 3) + ' V、r% = ' + pct(r.sim.vpp / r.sim.vdc * 100),
        after: r.dv > r.Vp ? '<b style="color:var(--bad)">估算的 ΔV 比 V<sub>p</sub> 還大 —— 公式失效。</b>RC（' + fmtT(r.R * r.Cv) + '）跟補充間隔差不多，電容早就放光，不能用這條近似。'
          : r.ratio < 5 ? '<b style="color:var(--warn)">RC 只有補充間隔的 ' + fix(r.ratio, 1) + ' 倍，近似很粗</b>：估算 ' + fix(r.dv, 2) + ' V 對模擬 ' + fix(r.sim.vpp, 2) + ' V。放電不是直線，掉得越多誤差越大。'
          : '<b style="color:var(--ok)">RC 是補充間隔的 ' + fix(r.ratio, 0) + ' 倍，近似可以用</b>：估算稍微偏大（' + fix(r.dv, 3) + ' 對 ' + fix(r.sim.vpp, 3) + ' V），因為實際放電時間比整個間隔短一點。' }
    ],
    answer: (g, r) => '估算 ΔV ≈ ' + fix(r.dv, 3) + ' V、V<sub>dc</sub> ≈ ' + fix(r.vdc, 2) + ' V、r% ≈ ' + pct(r.rr) + '（模擬 ' + pct(r.sim.vpp / r.sim.vdc * 100) + '）',
    draw: (ctx, w, h, g, r) => {
      const s = r.sim, x0 = 36, x1 = w - 12, y0 = 14, y1 = h - 16;
      const Y = plotFrame(ctx, x0, y0, x1, y1, -0.3, 5.3, { ticks: [4] }), X = tt => lerp(x0, x1, tt / (2 * s.T));
      trace(ctx, s.t, s.vs.map(v => Math.max(-0.3, r.bridge ? Math.abs(v) : v)), X, Y, C['ink-3'], 1.1, [4, 4]);
      trace(ctx, s.t, s.vo, X, Y, C.accent, 2.2);
      const lo = Math.max(0, r.Vp - r.dv);
      ctx.fillStyle = C.ink; ctx.globalAlpha = 0.07; ctx.fillRect(x0, Y(r.Vp), x1 - x0, Y(lo) - Y(r.Vp)); ctx.globalAlpha = 1;
      ctx.strokeStyle = C['ink-2']; ctx.setLineDash([3, 3]);
      [r.Vp, lo].forEach(v => { ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke(); }); ctx.setLineDash([]);
      labelCJK(ctx, x1, Y(lo) + 12, '灰帶＝估算的 ΔV', C['ink-2'], 10, 'right');
    }
  });

  /* ── 例題 3：漣波因數三種算法 ── */
  liveExample('#ex-r', {
    title: '例題 · 同一組量測，算出三種漣波因數',
    ratio: 0.3, minH: 140, maxH: 190,
    givens: [
      { id: 'xf-pp', label: '示波器量到 V<sub>o(p-p)</sub>', min: 0.01, max: 4.5, step: 0.001, value: 0.589, fmt: v => fix(v, 3) + ' V' },
      { id: 'xf-dc', label: '三用電表量到 V<sub>o,dc</sub>', min: 0.5, max: 5, step: 0.001, value: 4.01, fmt: v => fix(v, 3) + ' V' }
    ],
    compute: g => { const pp = g['xf-pp'], dc = g['xf-dc']; return { pp, dc, a: pp / dc * 100, b: pp / (2 * Math.SQRT2) / dc * 100, c: pp / (2 * Math.sqrt(3)) / dc * 100 }; },
    question: (g, r) => '濾波電路量到 <b>V<sub>o(p-p)</sub> = ' + fix(r.pp, 3) + ' V</b>、<b>V<sub>o,dc</sub> = ' + fix(r.dc, 3) + ' V</b>（預設是 1 kΩ／100 µF 的模擬值）。分別用課堂簡化版、講義正弦版、鋸齒版算漣波因數。',
    steps: (g, r) => [
      { t: 'Step 1　課堂簡化版（填表格用這個）。', note: '直接拿峰對峰除以直流：', eq: 'r% = ' + fix(r.pp, 3) + ' ÷ ' + fix(r.dc, 3) + ' × 100% = ' + pct(r.a) },
      { t: 'Step 2　講義 p.6（當正弦）。', note: '振幅 = V<sub>pp</sub>/2，正弦 rms = 振幅/√2：', eq: 'V<sub>r(rms)</sub> = ' + fix(r.pp, 3) + ' ÷ 2√2 = ' + fix(r.pp / (2 * Math.SQRT2), 4) + ' V → r% = ' + pct(r.b) },
      { t: 'Step 3　鋸齒波（較接近真實形狀）。', note: '鋸齒 rms = V<sub>pp</sub>/(2√3)：', eq: 'V<sub>r(rms)</sub> = ' + fix(r.pp, 3) + ' ÷ 2√3 = ' + fix(r.pp / (2 * Math.sqrt(3)), 4) + ' V → r% = ' + pct(r.c),
        after: r.a > 100 ? '<b style="color:var(--warn)">漣波比直流還大</b>（r% &gt; 100%），這時波形根本不是「直流加小波紋」，三種算法都只是參考，看簡化版就好。'
          : '三個數字比例固定：簡化版 ÷ 2.83 = 正弦版，÷ 3.46 = 鋸齒版。<b>報告寫清楚用哪一個</b>，跟同學比較時才不會以為誰量錯。' }
    ],
    answer: (g, r) => '簡化 ' + pct(r.a) + '、正弦 ' + pct(r.b) + '、鋸齒 ' + pct(r.c),
    draw: (ctx, w, h, g, r) => {
      const rows = [['簡化 V<sub>pp</sub>/V<sub>dc</sub>', r.a], ['講義（正弦）', r.b], ['鋸齒', r.c]];
      const x0 = Math.min(150, w * 0.38), x1 = w - 70, mx = Math.max(r.a, 1);
      rows.forEach((row, i) => {
        const y = 18 + i * ((h - 30) / 3);
        labelCJK(ctx, x0 - 8, y + 9, row[0], C['ink-2'], 11, 'right');
        ctx.fillStyle = i === 0 ? C.accent : C['ink-3']; ctx.fillRect(x0, y, Math.max(0, (x1 - x0) * row[1] / mx), 18);
        label(ctx, x0 + (x1 - x0) * row[1] / mx + 6, y + 9, pct(row[1]), C.ink, 11, 'left', '700');
      });
    }
  });

  /* ── 例題 4：峰值電流估算 ── */
  liveExample('#ex-ipk', {
    title: '例題 · 估算二極體峰值電流',
    ratio: 0.3, minH: 140, maxH: 190,
    givens: [
      { id: 'xp-r', label: '負載電阻 R', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => fmtR(v * 1000) },
      { id: 'xp-c', label: '濾波電容 C', min: 10, max: 1000, step: 10, value: 100, fmt: v => v + ' µF' }
    ],
    compute: g => {
      const R = g['xp-r'] * 1000, Cv = g['xp-c'] * 1e-6, s = simulate(R, Cv), T = 1 / 60;
      return { R, Cv, s, T, est: 2 * s.idc * T / s.onPulse };
    },
    question: (g, r) => '半波整流濾波，Vpp = 10 V、60 Hz，<b>R = ' + fmtR(r.R) + '</b>、<b>C = ' + fmtC(r.Cv) + '</b>。模擬得 V<sub>dc</sub> = ' + fix(r.s.vdc, 3) + ' V、二極體每週期導通 Δt = ' + fmtT(r.s.onPulse) + '。估算二極體峰值電流。',
    steps: (g, r) => [
      { t: 'Step 1　負載平均電流。', note: '負載是電阻，平均電流 = 平均電壓 ÷ R：', eq: 'I<sub>DC</sub> = ' + fix(r.s.vdc, 3) + ' ÷ ' + fmtR(r.R).replace(' ', '') + ' = ' + mA(r.s.idc) },
      { t: 'Step 2　一個週期要補回的電荷。', note: '用掉多少就要補多少：', eq: 'Q = I<sub>DC</sub> × T = ' + mA(r.s.idc) + ' × 16.7 ms = ' + fix(r.s.idc * r.T * 1e6, 1) + ' µC' },
      { t: 'Step 3　只能在 Δt 內補，電流脈衝當三角形。', note: '面積 ½ × 峰值 × Δt = Q：', eq: 'I<sub>D,peak</sub> ≈ 2Q / Δt = 2 × ' + fix(r.s.idc * r.T * 1e6, 1) + ' µC ÷ ' + fmtT(r.s.onPulse) + ' = ' + mA(r.est) },
      { t: 'Step 4　跟模擬比。', note: '模擬的峰值：', eq: 'I<sub>D,peak</sub>（模擬）= ' + mA(r.s.ipk) + '，是 I<sub>DC</sub> 的 ' + fix(r.s.ipk / r.s.idc, 1) + ' 倍',
        after: r.s.ipk / r.s.idc > 15 ? '<b style="color:var(--warn)">峰值是平均的 ' + fix(r.s.ipk / r.s.idc, 0) + ' 倍</b>：電容大、導通時間很短，二極體要扛很猛的脈衝。'
          : '電容不算大，導通時間比較長，峰值只是平均的幾倍。代價是漣波比較大。' }
    ],
    answer: (g, r) => 'I<sub>D,peak</sub> ≈ ' + mA(r.est) + '（模擬 ' + mA(r.s.ipk) + '）',
    draw: (ctx, w, h, g, r) => {
      const s = r.s, x0 = 46, x1 = w - 12, y0 = 14, y1 = h - 16, im = Math.max(s.ipk, r.est) * 1.15;
      const X = tt => lerp(x0, x1, tt / (2 * s.T)), Y = v => lerp(y1, y0, v / im);
      ctx.strokeStyle = C['line-soft']; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      trace(ctx, s.t, s.id, X, Y, C.accent, 2);
      ctx.strokeStyle = C['ink-2']; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(s.idc)); ctx.lineTo(x1, Y(s.idc)); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, x0 - 4, Y(s.ipk), mA(s.ipk), C.accent, 9.5, 'right');
      labelCJK(ctx, x1, Y(s.idc) - 8, '虛線＝I<sub>DC</sub>', C['ink-2'], 10, 'right');
    }
  });

  /* ══════════════════════════════════════════════════════════
     結果：6 組模擬波形 + 表格 + 我的實測
     ══════════════════════════════════════════════════════════ */
  (function results() {
    const grid = document.getElementById('res-grid'), tb = document.getElementById('res-tbl');
    if (!grid || !tb) return;
    RESULTS.forEach((d, i) => {
      const fig = document.createElement('figure');
      fig.innerHTML = '<figcaption><b>R1 = ' + fmtR(d.R) + '、C1 = ' + fmtC(d.C) + '</b><span>r% = ' + pct(d.vpp / d.vdc * 100) + '</span></figcaption><canvas aria-label="R1 ' + fmtR(d.R) + ' C1 ' + fmtC(d.C) + ' 的 V1 與 Vo 波形"></canvas>';
      grid.appendChild(fig);
      Stage(fig.querySelector('canvas'), { animate: false, ratio: 0.5, minH: 130, maxH: 190, draw(ctx, w, h) {
        const r = simulate(d.R, d.C), x0 = 26, x1 = w - 8, y0 = 8, y1 = h - 8;
        const Y = plotFrame(ctx, x0, y0, x1, y1, -5.4, 5.4, { ticks: [-5, 5] }), X = tt => lerp(x0, x1, tt / (2 * r.T));
        trace(ctx, r.t, r.vs, X, Y, C['ink-3'], 1.1, [4, 3]);
        trace(ctx, r.t, r.vo, X, Y, C.accent, 2.2);
        label(ctx, x1, Y(-4.6), 'Vpp ' + fix(d.vpp, 2) + ' V　Vdc ' + fix(d.vdc, 2) + ' V', C['ink-2'], 9.5, 'right', '700');
      }});
      const rc = d.R * d.C, a = d.vpp / d.vdc * 100;
      tb.insertAdjacentHTML('beforeend', '<tr><td>' + fmtR(d.R) + '</td><td>' + fmtC(d.C) + '</td><td class="num">' + fmtT(rc) + '</td><td class="num">' + fix(d.vpp, 3) + ' V</td><td class="num">' + fix(d.vdc, 3) + ' V</td><td class="num hi">' + pct(a) + '</td><td class="num">' +
        pct(a / (2 * Math.SQRT2)) + '</td><td class="num">' + pct(a / (2 * Math.sqrt(3))) + '</td><td class="num">' + mA(d.ipk) + '</td></tr>');
    });

    /* 我的實測：存 __SYNC（sync.js 比這支晚載入，所以等 load 再接） */
    const mt = document.querySelector('#meas-tbl tbody');
    let store = null;
    const LS = 'ee-lab-filter-meas';
    const getAll = () => { if (store) return store.all(); try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } };
    const put = (id, obj) => {
      if (store) { obj ? store.put(id, obj) : store.del(id); return; }
      try { const a = getAll(); if (obj) a[id] = obj; else delete a[id]; localStorage.setItem(LS, JSON.stringify(a)); } catch (e) {}
    };
    RESULTS.forEach((d, i) => {
      mt.insertAdjacentHTML('beforeend', '<tr data-i="' + i + '"><td>' + fmtR(d.R) + '</td><td>' + fmtC(d.C) + '</td>' +
        '<td><input type="number" inputmode="decimal" step="any" min="0" data-k="pp" aria-label="' + fmtR(d.R) + ' ' + fmtC(d.C) + ' 量到的峰對峰"></td>' +
        '<td><input type="number" inputmode="decimal" step="any" min="0" data-k="dc" aria-label="' + fmtR(d.R) + ' ' + fmtC(d.C) + ' 量到的直流"></td>' +
        '<td class="num my">—</td><td class="num">' + pct(d.vpp / d.vdc * 100) + '</td><td class="num df">—</td></tr>');
    });
    function calc(tr) {
      const i = +tr.dataset.i, d = RESULTS[i];
      const pp = parseFloat(tr.querySelector('[data-k="pp"]').value), dc = parseFloat(tr.querySelector('[data-k="dc"]').value);
      const my = tr.querySelector('.my'), df = tr.querySelector('.df');
      if (pp > 0 && dc > 0) {
        const a = pp / dc * 100, s = d.vpp / d.vdc * 100, rel = (a - s) / s * 100;
        my.textContent = pct(a); df.textContent = (rel >= 0 ? '+' : '−') + fix(Math.abs(rel), 0) + '%';
        df.className = 'num df ' + (Math.abs(rel) <= 25 ? 'diff-ok' : 'diff-far');
      } else { my.textContent = '—'; df.textContent = '—'; df.className = 'num df'; }
    }
    function fill() {
      const all = getAll();
      mt.querySelectorAll('tr').forEach(tr => {
        const it = all['r' + tr.dataset.i];
        tr.querySelectorAll('input').forEach(inp => { if (document.activeElement !== inp) inp.value = it && it[inp.dataset.k] !== undefined && it[inp.dataset.k] !== '' ? it[inp.dataset.k] : ''; });
        calc(tr);
      });
    }
    mt.addEventListener('input', e => {
      const tr = e.target.closest('tr'); if (!tr) return;
      const pp = tr.querySelector('[data-k="pp"]').value, dc = tr.querySelector('[data-k="dc"]').value;
      put('r' + tr.dataset.i, pp === '' && dc === '' ? null : { pp, dc });
      calc(tr);
    });
    document.getElementById('meas-clear').addEventListener('click', () => {
      if (!confirm('清空 6 組實測數字？')) return;
      RESULTS.forEach((d, i) => put('r' + i, null)); fill();
    });
    fill();
    window.addEventListener('load', () => {
      if (!window.__SYNC) return;
      store = window.__SYNC.open('lab_filter_meas');
      /* 第一次接上雲端：把只存在本機的舊數字搬過去 */
      try { const old = JSON.parse(localStorage.getItem(LS) || '{}'); Object.keys(old).forEach(k => { if (!store.get(k)) store.put(k, old[k]); }); localStorage.removeItem(LS); } catch (e) {}
      store.on(fill); fill();
    });
  })();

  /* ── 電路圖 ── */
  (function schems() {
    const S = window.__SCH; if (!S) return;
    const hw = document.getElementById('schem-hw');
    if (hw) hw.innerHTML = S.svg(330, 190, [
      S.vac(50, 50, 150, 'V1', {}), S.t(12, 168, 'Vpp=10V 60Hz', 'start', ' font-size="10.5"'),
      S.d(50, 30, 170, 30, 'D1 1N4002'), S.w(50, 50, 50, 30), S.dot(200, 30),
      S.w(170, 30, 290, 30), S.r(200, 30, 200, 150, 'R1'), S.c(290, 30, 290, 150, 'C1'),
      S.w(50, 150, 290, 150), S.dot(200, 150), S.gnd(200, 150), S.t(290, 20, 'Vo', 'middle', ' font-weight="700"')
    ]);
    const br = document.getElementById('schem-br');
    if (br) br.innerHTML = S.svg(420, 300, [
      S.w(120, 40, 370, 40), S.w(120, 260, 370, 260),
      S.d(120, 130, 120, 40, 'D1', { side: 'l' }), S.d(120, 260, 120, 130, 'D2', { side: 'l' }),
      S.d(220, 190, 220, 40, 'D3'), S.d(220, 260, 220, 190, 'D4'),
      S.dot(120, 130), S.dot(220, 190),
      S.vac(40, 130, 210, 'V1'), S.w(40, 130, 120, 130), S.w(40, 210, 40, 225, 170, 225, 170, 190, 220, 190),
      S.r(300, 40, 300, 260, 'R1'), S.c(370, 40, 370, 260, 'C1'),
      S.dot(220, 40), S.dot(300, 40), S.dot(220, 260), S.dot(300, 260), S.gnd(245, 260),
      S.t(370, 30, 'Vo', 'middle', ' font-weight="700"'), S.t(14, 250, 'Vpp=10V 60Hz', 'start', ' font-size="10.5"')
    ]);
  })();

  /* ══════════════════════════════════════════════════════════
     觀念小測驗（選項 render 時打亂）
     ══════════════════════════════════════════════════════════ */
  (function quiz() {
    const host = document.getElementById('quiz'); if (!host) return;
    const Q = [
      { zh: '半波整流後並聯一顆電容，主要目的是什麼？', en: 'What is the main purpose of adding a shunt capacitor after a half-wave rectifier?',
        o: [['降低輸出漣波', 'to reduce the output ripple'], ['提高輸出頻率', 'to raise the output frequency'], ['讓二極體不用導通', 'so the diode never conducts'], ['把直流變回交流', 'to convert DC back to AC']], a: 0,
        e: '電容在電源高的時候充電、電源低的時候供電給負載，把脈動直流的起伏抹平。' },
      { zh: '函數產生器設 Vpp = 10 V，正弦波的振幅 V<sub>m</sub> 是多少？', en: 'A function generator is set to 10 Vpp. What is the sine amplitude Vm?',
        o: [['5 V', '5 V'], ['10 V', '10 V'], ['7.07 V', '7.07 V'], ['14.1 V', '14.1 V']], a: 0, e: '峰對峰 = 2 × 振幅，V<sub>m</sub> = 10/2 = 5 V。' },
      { zh: '加了濾波電容後，二極體在每個週期什麼時候導通？', en: 'With a filter capacitor, when does the diode conduct in each cycle?',
        o: [['只在電源追上電容電壓到峰值那一小段', 'only during a short interval just before the peak'], ['整個正半週', 'during the entire positive half-cycle'], ['整個負半週', 'during the entire negative half-cycle'], ['一直導通', 'all the time']], a: 0,
        e: '電容把陰極「頂」在高電壓，電源要爬到比它高才導通，過了峰值就截止。' },
      { zh: '漣波峰對峰值的近似公式是？', en: 'The approximate peak-to-peak ripple of a capacitor filter is:',
        o: [['ΔV ≈ V<sub>p</sub>/(fRC)', 'ΔV ≈ Vp/(fRC)'], ['ΔV ≈ V<sub>p</sub>·fRC', 'ΔV ≈ Vp·fRC'], ['ΔV ≈ V<sub>p</sub>/π', 'ΔV ≈ Vp/π'], ['ΔV ≈ RC/V<sub>p</sub>', 'ΔV ≈ RC/Vp']], a: 0,
        e: '電荷收支：CΔV = I<sub>DC</sub>T，I<sub>DC</sub> ≈ V<sub>p</sub>/R，所以 ΔV ≈ V<sub>p</sub>T/(RC) = V<sub>p</sub>/(fRC)。' },
      { zh: 'R 加大 10 倍、C 縮小 10 倍，漣波會怎樣？', en: 'If R is increased tenfold and C is reduced tenfold, the ripple:',
        o: [['大致不變', 'stays about the same'], ['變 10 倍', 'becomes 10 times larger'], ['變 1/10', 'becomes 10 times smaller'], ['變 100 倍', 'becomes 100 times larger']], a: 0,
        e: '漣波只看 RC 乘積，RC 沒變。實驗的 1 kΩ／100 µF 和 10 kΩ／10 µF 都是 14.7%。' },
      { zh: '課堂表格用的「簡化漣波因數」是？', en: 'The simplified ripple factor used in the lab table is:',
        o: [['V<sub>o(p-p)</sub>/V<sub>dc</sub> × 100%', 'Vo(p-p)/Vdc × 100%'], ['V<sub>r(rms)</sub>/V<sub>dc</sub> × 100%', 'Vr(rms)/Vdc × 100%'], ['V<sub>dc</sub>/V<sub>o(p-p)</sub> × 100%', 'Vdc/Vo(p-p) × 100%'], ['V<sub>max</sub>/V<sub>min</sub> × 100%', 'Vmax/Vmin × 100%']], a: 0,
        e: '直接用示波器最好量的峰對峰值。正式定義用 rms，數字會小約 3 倍。' },
      { zh: '把漣波當鋸齒波時，它的有效值是？', en: 'Treating the ripple as a sawtooth, its rms value is:',
        o: [['V<sub>r(p-p)</sub>/(2√3)', 'Vr(p-p)/(2√3)'], ['V<sub>r(p-p)</sub>/(2√2)', 'Vr(p-p)/(2√2)'], ['V<sub>r(p-p)</sub>/√2', 'Vr(p-p)/√2'], ['V<sub>r(p-p)</sub>/2', 'Vr(p-p)/2']], a: 0,
        e: '鋸齒在 ±a 之間直線變化，rms = a/√3，a = V<sub>pp</sub>/2。/(2√2) 是講義把它當正弦的版本。' },
      { zh: '濾波電容加大，會帶來什麼缺點？', en: 'What is a drawback of a larger filter capacitor?',
        o: [['二極體峰值電流變大', 'higher peak diode current'], ['漣波變大', 'larger ripple'], ['直流值變低', 'lower DC output'], ['頻率改變', 'the frequency changes']], a: 0,
        e: '導通時間變短，要在更短時間內補回一整個週期的電荷，所以電流脈衝更高。講義 p.5。' },
      { zh: '相同 R、C 下，橋式全波整流濾波的漣波比半波？', en: 'For the same R and C, the ripple of a bridge rectifier filter compared with half-wave is:',
        o: [['約一半', 'about half'], ['約兩倍', 'about twice'], ['一樣', 'the same'], ['變成 0', 'zero']], a: 0,
        e: '全波每半個週期就補一次電，放電時間變成 T/2，ΔV 約減半。模擬 100 Ω／100 µF：3.07 V → 1.46 V。' },
      { zh: '量 V<sub>o,dc</sub> 應該用？', en: 'To measure Vo,dc you should use:',
        o: [['三用電表 DC 電壓檔', 'a multimeter on DC volts'], ['三用電表 AC 電壓檔', 'a multimeter on AC volts'], ['示波器 AC 耦合', 'the scope with AC coupling'], ['三用電表電阻檔', 'a multimeter on ohms']], a: 0,
        e: 'DC 檔顯示平均值。示波器 AC 耦合會把直流擋掉，平均變 0。' }
    ];
    const verdicts = ['原理和實驗都抓到了，可以直接去做 PSpice 作業。', '主幹有了，答錯的回去把模擬器的 R、C 拉一拉。', '建議先把故事模式再看一次，再玩「濾波模擬器」。'];
    const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
    let i = 0, score = 0, answered = false, ord = [];
    function render() {
      const q = Q[i];
      host.innerHTML = '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div><div class="quiz-body"><div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
        '<div class="q-text">' + q.zh + '</div><div class="q-en">' + q.en + '</div><div class="opts"></div><div class="explain" hidden></div></div>' +
        '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span><button class="btn" id="q-next" hidden>下一題 →</button></div>';
      const opts = host.querySelector('.opts');
      ord = shuffle(q.o.length);
      ord.forEach((src, k) => {
        const b = document.createElement('button'); b.className = 'opt'; b.type = 'button';
        b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + q.o[src][0] + '<span class="en">' + q.o[src][1] + '</span></span>';
        b.addEventListener('click', () => pick(k)); opts.appendChild(b);
      });
      host.querySelector('#q-next').addEventListener('click', () => { i++; answered = false; i < Q.length ? render() : done(); });
      answered = false;
    }
    function pick(k) {
      if (answered) return; answered = true;
      const q = Q[i], A = ord.indexOf(q.a), btns = Array.prototype.slice.call(host.querySelectorAll('.opt'));
      btns.forEach((b, idx) => { b.disabled = true; if (idx === A) b.classList.add('right'); });
      if (k === A) score++; else btns[k].classList.add('wrong');
      const ex = host.querySelector('.explain'); ex.hidden = false;
      ex.innerHTML = '<b>' + (k === A ? '答對了。' : '正確答案是 ' + 'ABCD'[A] + '。') + '</b> ' + q.e;
      host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
      const nx = host.querySelector('#q-next'); nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →'; nx.classList.add('solid');
    }
    function done() {
      const p = Math.round(score / Q.length * 100), v = p >= 90 ? verdicts[0] : p >= 70 ? verdicts[1] : verdicts[2];
      host.innerHTML = '<div class="bar"><i style="width:100%"></i></div><div class="quiz-body" style="padding-bottom:18px"><div class="q-no">測驗結果</div>' +
        '<div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + p + '%）</div><p style="color:var(--ink-2);margin:0 0 14px">' + v + '</p><button class="btn solid" id="q-again" type="button">再測一次</button></div>';
      host.querySelector('#q-again').addEventListener('click', () => { i = 0; score = 0; render(); });
    }
    render();
  })();

  /* 側欄捲動高亮 + 明暗主題 */
  (function () {
    const links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
    if (links.length) {
      const map = new Map();
      links.forEach(a => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a); });
      const io = new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.remove('on')); map.get(en.target).classList.add('on'); } }); }, { rootMargin: '-84px 0px -62% 0px', threshold: 0 });
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
})();
