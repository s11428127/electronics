/* ============================================================
   電子學 CH1 PART 3 — pn 接面：熱平衡、內建電壓、逆向偏壓、接面電容
   Neamen 4e, Ch.1 §1.2.1–1.2.2；課程 PART 3 投影片 1-19～1-37
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, TAU, K_EV, liveExample } = E;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '−');
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  const NI = 1.5e10, QE = 1.6e-19, EPS = 11.7 * 8.85e-14;
  const niT = T => NI * Math.pow(T / 300, 1.5) * Math.exp(-(1.12 / (2 * K_EV)) * (1 / T - 1 / 300));
  const vbiOf = (Na, Nd, VT, ni) => VT * Math.log(Na * Nd / (ni * ni));
  const ion = (ctx, x, y, sign, col, r) => {
    r = r || 6;
    ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.stroke();
    label(ctx, x, y + 0.5, sign, col, r * 1.6, 'center', '700');
  };

  /* ══════════════════════════════════════════════════════════
     ① 接面形成實驗室：擴散 → 離子 → 電場 → 漂移 → 平衡
     ══════════════════════════════════════════════════════════ */
  (function junction() {
    const cv = document.getElementById('cv-jn'); if (!cv) return;
    let joined = false, prog = 0, flights = [], clock = 0;
    const holes = [], elecs = [], ionsP = [], ionsN = [];
    for (let i = 0; i < 26; i++) holes.push({ x: Math.random() * 0.48, y: 0.08 + Math.random() * 0.84, ph: Math.random() * TAU });
    for (let i = 0; i < 26; i++) elecs.push({ x: 0.52 + Math.random() * 0.48, y: 0.08 + Math.random() * 0.84, ph: Math.random() * TAU });
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) {
      ionsP.push({ x: 0.5 - (i + 0.5) * 0.04, y: 0.14 + j * 0.24 });
      ionsN.push({ x: 0.5 + (i + 0.5) * 0.04, y: 0.14 + j * 0.24 });
    }
    const st = Stage(cv, { ratio: 0.44, minH: 250, maxH: 330, draw(ctx, w, h, dt) {
      clock += dt;
      if (joined && prog < 1) prog = Math.min(1, prog + dt / 7);
      const bx0 = w * 0.05, bx1 = w * 0.95, by0 = h * 0.1, by1 = h * 0.64;
      const gap = joined ? 0 : w * 0.05, xm = (bx0 + bx1) / 2;
      const X = r => r < 0.5 ? lerp(bx0, xm - gap / 2, r / 0.5) : lerp(xm + gap / 2, bx1, (r - 0.5) / 0.5);
      const Y = r => lerp(by0, by1, r);
      const halfW = 0.12 * prog;                      /* 空乏區半寬（比例） */
      /* 兩塊 */
      ctx.fillStyle = C['surface-2'];
      ctx.fillRect(bx0, by0, xm - gap / 2 - bx0, by1 - by0); ctx.fillRect(xm + gap / 2, by0, bx1 - xm - gap / 2, by1 - by0);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1.2;
      ctx.strokeRect(bx0, by0, xm - gap / 2 - bx0, by1 - by0); ctx.strokeRect(xm + gap / 2, by0, bx1 - xm - gap / 2, by1 - by0);
      labelCJK(ctx, (bx0 + xm) / 2, by0 - 11, 'P 型（電洞多）', C['ink-2'], 12, 'center', '600');
      labelCJK(ctx, (xm + bx1) / 2, by0 - 11, 'N 型（電子多）', C['ink-2'], 12, 'center', '600');
      /* 空乏區 */
      if (prog > 0) {
        ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = C.surface;
        ctx.fillRect(X(0.5 - halfW), by0, X(0.5 + halfW) - X(0.5 - halfW), by1 - by0); ctx.restore();
        ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
        [0.5 - halfW, 0.5 + halfW].forEach(r => { ctx.beginPath(); ctx.moveTo(X(r), by0); ctx.lineTo(X(r), by1); ctx.stroke(); });
        ctx.setLineDash([]);
      }
      /* 離子：在空乏區內才「露出來」 */
      ionsP.forEach(q => { const on = q.x > 0.5 - halfW; ion(ctx, X(q.x), Y(q.y), '−', on ? C.hole : C['line'], 6.5); });
      ionsN.forEach(q => { const on = q.x < 0.5 + halfW; ion(ctx, X(q.x), Y(q.y), '+', on ? C.hole : C['line'], 6.5); });
      /* 載子：空乏區裡的消失 */
      holes.forEach(q => { q.ph += dt * 2.5; if (q.x > 0.5 - halfW - 0.01) return;
        hole(ctx, X(q.x) + Math.sin(q.ph) * 2, Y(q.y) + Math.cos(q.ph) * 2, 5); });
      elecs.forEach(q => { q.ph += dt * 2.5; if (q.x < 0.5 + halfW + 0.01) return;
        electron(ctx, X(q.x) + Math.sin(q.ph) * 2, Y(q.y) + Math.cos(q.ph) * 2, 4.6); });
      /* 擴散（多數，往對面）與漂移（少數，被掃回來）的飛行粒子 */
      if (joined) {
        const rateD = 6 * Math.pow(1 - prog, 1.2) + 0.9, rateR = 0.9 * Math.min(1, prog * 2.5);
        if (Math.random() < rateD * dt) flights.push({ kind: Math.random() < 0.5 ? 'h' : 'e', dir: 0, t: 0, y: 0.1 + Math.random() * 0.8 });
        if (Math.random() < rateR * dt) flights.push({ kind: Math.random() < 0.5 ? 'h' : 'e', dir: 1, t: 0, y: 0.1 + Math.random() * 0.8 });
      }
      for (let i = flights.length - 1; i >= 0; i--) {
        const f = flights[i]; f.t += dt / 1.4;
        if (f.t >= 1) { flights.splice(i, 1); continue; }
        /* dir 0 = 擴散（h: P→N、e: N→P）；dir 1 = 漂移（h: N→P、e: P→N）*/
        const fromP = (f.kind === 'h') === (f.dir === 0);
        const r = fromP ? lerp(0.36, 0.64, f.t) : lerp(0.64, 0.36, f.t);
        ctx.save(); ctx.globalAlpha = 1 - Math.pow(f.t, 3);
        f.kind === 'h' ? hole(ctx, X(r), Y(f.y), 5) : electron(ctx, X(r), Y(f.y), 4.6);
        ctx.restore();
      }
      /* 電場箭頭（n → p，向左） */
      if (prog > 0.15) {
        const L = (X(0.5 + halfW) - X(0.5 - halfW)) * 0.8;
        arrow(ctx, xm + L / 2, by1 + 16, xm - L / 2, by1 + 16, C.accent, 1.4 + prog * 1.6);
        labelCJK(ctx, xm, by1 + 30, '內建電場 E（n → p）', C.accent, 11.5, 'center', '700');
      }
      /* 兩條電流 bar */
      const jd = 0.18 + 0.82 * Math.pow(1 - prog, 1.5), jr = 0.18 * Math.min(1, prog * 2.5);
      const gx = w * 0.2, gw = w * 0.6, gy = h * 0.82;
      labelCJK(ctx, gx - 8, gy, '擴散 →', C['ink-2'], 11.5, 'right', '600');
      ctx.fillStyle = C['ink-3']; ctx.fillRect(gx, gy - 6, gw * (joined ? jd : 0), 12);
      labelCJK(ctx, gx - 8, gy + 18, '← 漂移', C.accent, 11.5, 'right', '600');
      ctx.fillStyle = C.accent; ctx.fillRect(gx, gy + 12, gw * jr, 12);
      if (prog >= 1) labelCJK(ctx, gx + gw * 0.18 + 10, gy + 9, '一樣長 → 熱平衡，總電流 = 0', C.ok, 11.5, 'left', '700');
      if (((clock * 8) | 0) % 2 === 0) {
        setText('jn-phase', !joined ? '還沒接上' : prog < 0.35 ? '① 濃度差 → 大量擴散' : prog < 1 ? '② 離子露出、電場長大' : '③ 熱平衡（動態）');
        setText('jn-w', joined ? Math.round(prog * 100) + '%（最終約 0.1～1 μm）' : '0');
        setText('jn-j', !joined ? '—' : prog < 1 ? '擴散 > 漂移' : '擴散 = 漂移');
      }
    }});
    function msg() {
      setHTML('jn-msg', joined
        ? '看三件事：<b>(1)</b> 中間的離子一個個「露出來」變成實心；<b>(2)</b> 電場箭頭越來越粗；<b>(3)</b> 灰色的擴散 bar 越縮越短，直到跟藍色的漂移 bar 一樣長。'
        : '按「▶ 接上！」。左邊 P 型電洞多、右邊 N 型電子多，灰色的圈是還被載子「蓋住」的離子。');
    }
    document.getElementById('jn-go').addEventListener('click', () => { joined = true; prog = 0; flights = []; msg(); });
    document.getElementById('jn-reset').addEventListener('click', () => { joined = false; prog = 0; flights = []; msg(); });
    msg();
  })();

  /* ══════════════════════════════════════════════════════════
     ② 電位障實驗室：V_bi = V_T ln(NaNd/ni²)
     ══════════════════════════════════════════════════════════ */
  (function barrier() {
    const cv = document.getElementById('cv-vbi'); if (!cv) return;
    let lNa = 16, lNd = 17, T = 300;
    const base = vbiOf(1e16, 1e17, K_EV * 300, NI);
    const st = Stage(cv, { animate: false, ratio: 0.42, minH: 230, maxH: 300, draw(ctx, w, h) {
      const Na = Math.pow(10, lNa), Nd = Math.pow(10, lNd), VT = K_EV * T, ni = niT(T), V = vbiOf(Na, Nd, VT, ni);
      const x0 = Math.max(w * 0.1, 44), x1 = w * 0.95, xm = (x0 + x1) / 2, y0 = h * 0.12, y1 = h * 0.82;
      const Vmax = 1.1, Y = v => lerp(y1, y0, v / Vmax);
      /* 空乏區寬度（示意）：W ∝ √(V (Na+Nd)/(NaNd))，xn:xp = Na:Nd */
      const Wrel = Math.sqrt(V * (Na + Nd) / (Na * Nd)) / Math.sqrt(0.75 * (1e14 + 1e14) / 1e28);
      const Wpx = clamp(Wrel * (x1 - x0) * 0.62, 6, (x1 - x0) * 0.62);
      const xn = Wpx * Na / (Na + Nd), xp = Wpx * Nd / (Na + Nd);
      ctx.fillStyle = C['surface-2']; ctx.fillRect(xm - xp, y0, xp + xn, y1 - y0);
      labelCJK(ctx, (x0 + xm - xp) / 2, y0 + 12, 'P 側', C['ink-3'], 12, 'center', '600');
      labelCJK(ctx, (xm + xn + x1) / 2, y0 + 12, 'N 側', C['ink-3'], 12, 'center', '600');
      labelCJK(ctx, xm, y1 + 16, '空乏區（偏向摻雜少的一側）', C['ink-3'], 11, 'center');
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      [0, 0.5, 1].forEach(v => { ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke(); label(ctx, x0 - 6, Y(v), v.toFixed(1) + ' V', C['ink-3'], 10, 'right'); });
      /* 電位曲線：兩段拋物線 */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.6; ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = lerp(x0, x1, i / 200);
        let v;
        if (x <= xm - xp) v = 0;
        else if (x >= xm + xn) v = V;
        else if (x <= xm) { const u = (x - (xm - xp)) / Math.max(xp, 1e-6); v = V * (xp / (xp + xn)) * u * u; }
        else { const u = ((xm + xn) - x) / Math.max(xn, 1e-6); v = V - V * (xn / (xp + xn)) * u * u; }
        i ? ctx.lineTo(x, Y(v)) : ctx.moveTo(x, Y(v));
      }
      ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(xm + xn + 8, Y(0)); ctx.lineTo(x1 - 6, Y(0)); ctx.stroke(); ctx.setLineDash([]);
      arrow(ctx, x1 - 18, Y(0), x1 - 18, Y(V), C.accent, 1.8);
      arrow(ctx, x1 - 18, Y(V), x1 - 18, Y(0), C.accent, 1.8);
      /* 窄版時右側放不下，標籤改放左邊（P 側曲線貼地，上方是空的） */
      if (w < 520) labelCJK(ctx, x0 + 6, (Y(0) + Y(V)) / 2, 'V_bi = ' + V.toFixed(3) + ' V', C.accent, 12.5, 'left', '700');
      else labelCJK(ctx, x1 - 26, (Y(0) + Y(V)) / 2, 'V_bi = ' + V.toFixed(3) + ' V', C.accent, 12.5, 'right', '700');
      labelCJK(ctx, x0, h * 0.95, '電位（N 側比 P 側高 V_bi）', C['ink-3'], 11, 'left');
    }});
    function refresh() {
      const VT = K_EV * T, ni = niT(T), V = vbiOf(Math.pow(10, lNa), Math.pow(10, lNd), VT, ni);
      setText('vb-vt', (VT * 1000).toFixed(1) + ' mV');
      setText('vb-ni', sci(ni, 2) + ' cm⁻³');
      setText('vb-v', V.toFixed(3) + ' V');
      const d = V - base;
      setHTML('vb-msg', (Math.abs(lNa - 16) + Math.abs(lNd - 17) > 0 || T !== 300)
        ? '跟 Example 1.5（N<sub>a</sub> = 10¹⁶、N<sub>d</sub> = 10¹⁷、300 K）比：V<sub>bi</sub> ' + (d >= 0 ? '多了 ' : '少了 ') + Math.abs(d * 1000).toFixed(0) + ' mV。' +
          (T !== 300 ? '溫度升高時 nᵢ 暴增，V<sub>bi</sub> 反而<b>變小</b>。' : '摻雜差 10 倍只改變 V<sub>T</sub>·ln10 ≈ <b>60 mV</b> —— 這就是 ln 的威力。')
        : 'Example 1.5 的條件。拉 N<sub>a</sub> 或 N<sub>d</sub> 一格（10 倍），看 V<sub>bi</sub> 只動多少；再把兩邊摻雜拉得很不一樣，看空乏區往哪一側長。');
      st.redraw();
    }
    const fmtL = v => '10' + sup(v % 1 ? v.toFixed(1) : v) + ' cm⁻³';
    bindRange('vb-na', fmtL, v => { lNa = v; refresh(); });
    bindRange('vb-nd', fmtL, v => { lNd = v; refresh(); });
    bindRange('vb-t', v => v + ' K', v => { T = v; refresh(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 逆偏實驗室（N_a = 10¹⁶、N_d = 10¹⁵，跟 Example 1.6 同一顆）
     ══════════════════════════════════════════════════════════ */
  (function reverse() {
    const cv = document.getElementById('cv-rev'); if (!cv) return;
    const Na = 1e16, Nd = 1e15, VBI = vbiOf(Na, Nd, 0.026, NI);
    const W0 = Math.sqrt(2 * EPS * VBI / QE * (Na + Nd) / (Na * Nd));
    const WMAX = Math.sqrt(2 * EPS * (VBI + 10) / QE * (Na + Nd) / (Na * Nd));
    let VR = 0, drifts = [];
    const maj = [];
    for (let i = 0; i < 60; i++) maj.push({ x: Math.random(), y: 0.08 + Math.random() * 0.84, ph: Math.random() * TAU });
    const st = Stage(cv, { ratio: 0.42, minH: 240, maxH: 320, draw(ctx, w, h, dt) {
      const W = Math.sqrt(2 * EPS * (VBI + VR) / QE * (Na + Nd) / (Na * Nd));
      const bx0 = w * 0.05, bx1 = w * 0.95, by0 = h * 0.08, by1 = h * 0.6, xj = lerp(bx0, bx1, 0.36);
      const span = (bx1 - bx0) * 0.6, Wpx = Math.max(4, span * W / WMAX);
      const xp = Wpx * Nd / (Na + Nd), xn = Wpx * Na / (Na + Nd);
      ctx.fillStyle = C['surface-2']; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
      ctx.fillStyle = C.surface; ctx.fillRect(xj - xp, by0, xp + xn, by1 - by0);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1.2; ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      [xj - xp, xj + xn].forEach(x => { ctx.beginPath(); ctx.moveTo(x, by0); ctx.lineTo(x, by1); ctx.stroke(); });
      ctx.setLineDash([]);
      label(ctx, bx0 + 12, by0 + 12, 'p', C['ink-2'], 13, 'left', '700');
      label(ctx, bx1 - 12, by0 + 12, 'n', C['ink-2'], 13, 'right', '700');
      /* 離子：P 側密（N_a 大）、N 側稀 */
      const rows = 5;
      for (let r = 0; r < rows; r++) {
        const y = lerp(by0 + 14, by1 - 14, r / (rows - 1));
        for (let x = xj - 9; x > xj - xp + 2; x -= 13) ion(ctx, x, y, '−', C.hole, 5);
        for (let x = xj + 12; x < xj + xn - 4; x += 30) ion(ctx, x, y, '+', C.hole, 5);
      }
      maj.forEach(q => {
        q.ph += dt * 2.4;
        const x = lerp(bx0 + 6, bx1 - 6, q.x), y = lerp(by0, by1, q.y);
        if (x > xj - xp - 6 && x < xj + xn + 6) return;
        x < xj ? hole(ctx, x + Math.sin(q.ph) * 2, y + Math.cos(q.ph) * 2, 4.4) : (q.x * 7 % 1 < 0.35 ? electron(ctx, x + Math.sin(q.ph) * 2, y + Math.cos(q.ph) * 2, 4) : null);
      });
      /* 少數載子漂移（I_S）：偶爾一顆，數量不隨 V_R 變 */
      if (Math.random() < 0.7 * dt) drifts.push({ kind: Math.random() < 0.5 ? 'h' : 'e', t: 0, y: 0.15 + Math.random() * 0.7 });
      for (let i = drifts.length - 1; i >= 0; i--) {
        const d = drifts[i]; d.t += dt * 0.7;
        if (d.t >= 1) { drifts.splice(i, 1); continue; }
        const y = lerp(by0, by1, d.y);
        if (d.kind === 'h') hole(ctx, lerp(xj + xn + 10, xj - xp - 10, d.t), y, 5);     /* N 區少數電洞 → P */
        else electron(ctx, lerp(xj - xp - 10, xj + xn + 10, d.t), y, 4.6);              /* P 區少數電子 → N */
      }
      /* 電場 */
      const L = Math.max(16, Wpx * 0.8), th = 1.3 + 3 * Math.sqrt((VBI + VR) / (VBI + 10));
      arrow(ctx, xj + L / 2, by1 + 14, xj - L / 2, by1 + 14, C.accent, th);
      labelCJK(ctx, xj + L / 2 + 8, by1 + 14, 'E_total = Ē + E_A', C.accent, 11.5, 'left', '700');
      /* 電池 */
      const cy = h * 0.86;
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(bx0, by1); ctx.lineTo(bx0, cy); ctx.lineTo(w * 0.47, cy); ctx.moveTo(w * 0.53, cy); ctx.lineTo(bx1, cy); ctx.lineTo(bx1, by1); ctx.stroke();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * 0.47, cy - 9); ctx.lineTo(w * 0.47, cy + 9); ctx.stroke();
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(w * 0.53, cy - 15); ctx.lineTo(w * 0.53, cy + 15); ctx.stroke();
      labelCJK(ctx, w * 0.44, cy - 16, '−', C['ink-2'], 15, 'center', '700');
      labelCJK(ctx, w * 0.56, cy - 18, '+', C['ink-2'], 15, 'center', '700');
      labelCJK(ctx, w * 0.5, cy + 24, 'V_R = ' + VR.toFixed(1) + ' V（P 接負、N 接正）', C['ink-2'], 11.5, 'center', '600');
    }});
    bindRange('rv-v', v => v.toFixed(1) + ' V', v => {
      VR = v;
      const W = Math.sqrt(2 * EPS * (VBI + VR) / QE * (Na + Nd) / (Na * Nd));
      setText('rv-b', (VBI + VR).toFixed(2) + ' V（V_bi + V_R）');
      setText('rv-w', (W * 1e4).toFixed(2) + ' μm（' + (W / W0).toFixed(2) + ' 倍）');
      setText('rv-i', '≈ −I_S（約 10⁻¹⁴ A，不隨 V_R 變）');
      setHTML('rv-msg', VR === 0
        ? '這是熱平衡：只有內建電場，空乏區約 0.95 μm。注意它大部分長在 <b>N 側</b> —— N<sub>d</sub> 比 N<sub>a</sub> 小 10 倍，離子稀，要寬一點才湊得到一樣多的電荷。'
        : '逆偏 ' + VR.toFixed(1) + ' V：位障升到 ' + (VBI + VR).toFixed(2) + ' V，空乏區變成 ' + (W / W0).toFixed(2) + ' 倍寬（√ 關係，所以越拉越難變寬）。偶爾飛過去的是<b>少數載子</b> —— 不管 V<sub>R</sub> 多大，它們的數量都一樣，所以電流「飽和」在 −I<sub>S</sub>。');
    });
  })();

  /* ══════════════════════════════════════════════════════════
     ④ 小遊戲：用變容二極體調收音機
     ══════════════════════════════════════════════════════════ */
  (function radio() {
    const cv = document.getElementById('cv-radio'); if (!cv) return;
    const L = 0.1e-6, CJ0 = 60e-12, VB = 0.7;
    const ST = [89.3, 94.3, 99.7, 103.5, 107.7];
    const found = new Set();
    let VR = 0.6, clock = 0;
    const fOf = v => 1 / (2 * Math.PI * Math.sqrt(L * CJ0 * Math.pow(1 + v / VB, -0.5))) / 1e6;
    const st = Stage(cv, { ratio: 0.38, minH: 220, maxH: 290, draw(ctx, w, h, dt) {
      clock += dt;
      const f = fOf(VR), x0 = w * 0.06, x1 = w * 0.94, fy = h * 0.26;
      const F0 = 60, F1 = 135, X = v => lerp(x0, x1, (v - F0) / (F1 - F0));
      /* 刻度盤 */
      const tight = X(ST[1]) - X(ST[0]) < 34;   // 窄版：標籤上下交錯，避免疊在一起
      const top = tight ? 34 : 22;
      ctx.fillStyle = C['surface-2']; ctx.fillRect(X(88), fy - top, X(108) - X(88), 18 + top);
      labelCJK(ctx, (X(88) + X(108)) / 2, fy - (tight ? 42 : 30), 'FM 廣播頻段 88～108 MHz', C['ink-3'], 11, 'center');
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      for (let v = 60; v <= 135; v += 5) {
        ctx.beginPath(); ctx.moveTo(X(v), fy + 10); ctx.lineTo(X(v), fy + (v % 10 ? 16 : 22)); ctx.stroke();
        if (v % 10 === 0) label(ctx, X(v), fy + 32, v + '', C['ink-3'], 10);
      }
      ST.forEach((s, i) => {
        const got = found.has(s);
        ctx.fillStyle = got ? C.ok : C['ink-2'];
        ctx.beginPath(); ctx.moveTo(X(s), fy + 8); ctx.lineTo(X(s) - 5, fy - 2); ctx.lineTo(X(s) + 5, fy - 2); ctx.closePath(); ctx.fill();
        label(ctx, X(s), fy - 10 - (tight && i % 2 ? 12 : 0), s.toFixed(1), got ? C.ok : C['ink-2'], tight ? 8.5 : 9.5, 'center', '700');
      });
      /* 指針 */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(X(clamp(f, F0, F1)), fy - 20); ctx.lineTo(X(clamp(f, F0, F1)), fy + 26); ctx.stroke();
      /* 收訊：最近的電台 */
      let best = null, dmin = 1e9;
      ST.forEach(s => { const d = Math.abs(f - s); if (d < dmin) { dmin = d; best = s; } });
      const sig = Math.exp(-Math.pow(dmin / 0.35, 2));
      if (sig > 0.8 && best && !found.has(best)) { found.add(best); setText('rd-found', '找到 ' + found.size + ' / ' + ST.length + ' 台'); }
      /* 喇叭波形：清楚的正弦 + 雜訊 */
      const wy = h * 0.72, amp = h * 0.13;
      ctx.strokeStyle = sig > 0.5 ? C.accent : C['ink-3']; ctx.lineWidth = 1.8; ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const x = lerp(x0, x1, i / 240), t = i / 240;
        const y = wy + amp * (sig * Math.sin(t * 30 + clock * 9) * Math.sin(t * 3.1 + clock) + (1 - sig) * (Math.random() - 0.5) * 1.6);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      labelCJK(ctx, x0, h * 0.96, sig > 0.8 ? '♪ 收到 ' + best.toFixed(1) + ' MHz！' : sig > 0.3 ? '快到了，再微調一點' : '沙沙沙……（雜訊）', sig > 0.8 ? C.ok : C['ink-3'], 12, 'left', '700');
      if (((clock * 6) | 0) % 2 === 0) setText('rd-s', sig > 0.8 ? '清楚 ✓' : sig > 0.3 ? '有一點' : '雜訊');
    }});
    bindRange('rd-v', v => v.toFixed(2) + ' V', v => {
      VR = v;
      const c = CJ0 * Math.pow(1 + v / VB, -0.5);
      setText('rd-c', (c * 1e12).toFixed(1) + ' pF');
      setText('rd-f', fOf(v).toFixed(2) + ' MHz');
      if (found.size === ST.length) setHTML('rd-msg', '<b>五台全部找到！</b>注意：要往高頻走，V<sub>R</sub> 得加大（C<sub>j</sub> 變小），而且越高頻越要加更多電壓才推得動 —— 因為 f ∝ C<sup>−1/2</sup> ∝ (V<sub>bi</sub> + V<sub>R</sub>)<sup>1/4</sup>。');
    });
  })();
})();

/* ============================================================
   可互動例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, clamp, lerp, sci, sup, K_EV, liveExample } = E;
  const NI = 1.5e10, QE = 1.6e-19, EPS = 11.7 * 8.85e-14;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '−');
  const fmtL = v => '10' + sup(v % 1 ? v.toFixed(1) : v) + ' cm' + sup(-3);
  const niT = T => NI * Math.pow(T / 300, 1.5) * Math.exp(-(1.12 / (2 * K_EV)) * (1 / T - 1 / 300));

  /* ── 例題 A：接面兩側各有多少載子 ──────────────────────── */
  liveExample('#ex-side', {
    title: '例題 · 接面兩側的多數與少數載子（投影片 1-20）',
    ratio: 0.3, minH: 150, maxH: 190,
    givens: [
      { id: 'exs-na', label: 'P 側受體 N<sub>a</sub>', min: 14, max: 18, step: 0.5, value: 16, fmt: fmtL },
      { id: 'exs-nd', label: 'N 側施體 N<sub>d</sub>', min: 14, max: 18, step: 0.5, value: 17, fmt: fmtL }
    ],
    compute: g => {
      const Na = Math.pow(10, g['exs-na']), Nd = Math.pow(10, g['exs-nd']);
      return { Na, Nd, npo: NI * NI / Na, pno: NI * NI / Nd, ratio: Na * Nd / (NI * NI) };
    },
    question: (g, r) => '矽 pn 接面（300 K），P 側 <b>N<sub>a</sub> = ' + sci(r.Na, 1) + ' cm⁻³</b>、N 側 <b>N<sub>d</sub> = ' + sci(r.Nd, 1) + ' cm⁻³</b>。' +
      '求兩側的多數與少數載子濃度，以及兩側<b>電洞濃度差了幾倍</b>。',
    steps: (g, r) => [
      { t: 'Step 1　P 側。', note: '多數載子電洞 ≈ 摻雜；少數載子電子用質量作用定律：', eq: 'p_p0 ≈ ' + sci(r.Na, 2) + '　n_p0 = nᵢ²/N_a = ' + sci(r.npo, 2) + ' cm⁻³' },
      { t: 'Step 2　N 側。', eq: 'n_n0 ≈ ' + sci(r.Nd, 2) + '　p_n0 = nᵢ²/N_d = ' + sci(r.pno, 2) + ' cm⁻³' },
      { t: 'Step 3　兩側電洞濃度的比值。', note: '這個比值就是推動擴散的「濃度差」：', eq: 'p_p0 / p_n0 = N_a·N_d / nᵢ² = ' + sci(r.ratio, 2) },
      { t: 'Step 4　解讀。', note: '差了 ' + Math.log10(r.ratio).toFixed(1) + ' 個數量級 —— 擴散的驅力非常強，必須靠空乏區的電場才擋得住。下一節：取 ln 再乘 V<sub>T</sub> 就是內建電壓。',
        eq: 'ln(' + sci(r.ratio, 2) + ') = ' + Math.log(r.ratio).toFixed(2) + '　→　V_bi ≈ 0.026 × ' + Math.log(r.ratio).toFixed(2) + ' = ' + (0.026 * Math.log(r.ratio)).toFixed(3) + ' V' }
    ],
    answer: (g, r) => '兩側電洞濃度差 ' + sci(r.ratio, 2) + ' 倍（電子也一樣）',
    draw: (ctx, w, h, g, r) => {
      const x0 = w * 0.2, x1 = w * 0.96, lo = 0, hi = 19;
      const X = v => lerp(x0, x1, clamp((Math.log10(Math.max(v, 1)) - lo) / (hi - lo), 0, 1));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let k = lo; k <= hi; k += (w < 520 ? 6 : 3)) { const x = X(Math.pow(10, k)); ctx.beginPath(); ctx.moveTo(x, h * 0.08); ctx.lineTo(x, h * 0.8); ctx.stroke();
        label(ctx, x, h * 0.9, '10' + sup(k), C['ink-3'], 9.5); }
      [['P 側電洞', r.Na, C.hole, 0.16], ['P 側電子', r.npo, C.accent, 0.33], ['N 側電子', r.Nd, C.accent, 0.54], ['N 側電洞', r.pno, C.hole, 0.71]].forEach(([nm, v, col, yy]) => {
        const y = h * yy;
        ctx.fillStyle = col; ctx.globalAlpha = /少|P 側電子|N 側電洞/.test(nm) ? 0.45 : 1;
        ctx.fillRect(x0, y - 6, Math.max(2, X(v) - x0), 12); ctx.globalAlpha = 1;
        labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '600');
      });
    }
  });

  /* ── 例題 B：Example 1.5 內建電壓 ─────────────────────────── */
  liveExample('#ex-vbi', {
    title: '例題 · 內建電壓（課本 Example 1.5）',
    givens: [
      { id: 'exv-na', label: 'N<sub>a</sub>', min: 14, max: 18, step: 0.5, value: 16, fmt: fmtL },
      { id: 'exv-nd', label: 'N<sub>d</sub>', min: 14, max: 18, step: 0.5, value: 17, fmt: fmtL },
      { id: 'exv-t', label: '溫度 T', min: 250, max: 400, step: 10, value: 300, fmt: v => v + ' K' }
    ],
    compute: g => {
      const Na = Math.pow(10, g['exv-na']), Nd = Math.pow(10, g['exv-nd']), T = g['exv-t'];
      const VT = 0.026 * T / 300, ni = T === 300 ? NI : niT(T), ratio = Na * Nd / (ni * ni);
      return { Na, Nd, T, VT, ni, ratio, ln: Math.log(ratio), V: VT * Math.log(ratio) };
    },
    question: (g, r) => '矽 pn 接面在 <b>T = ' + r.T + ' K</b>，P 側 <b>N<sub>a</sub> = ' + sci(r.Na, 1) + '</b>、N 側 <b>N<sub>d</sub> = ' + sci(r.Nd, 1) + ' cm⁻³</b>。求內建電位障 V<sub>bi</sub>。',
    steps: (g, r) => [
      { t: 'Step 1　V_T 與 nᵢ。', note: r.T === 300 ? '室溫：V_T 取 0.026 V，nᵢ = 1.5×10¹⁰（課本 Example 1.1）。' : '溫度變了，<b>兩個都要重算</b>：V_T 正比於 T，nᵢ 用 PART 1 的 BT<sup>3/2</sup>e<sup>−Eg/2kT</sup>：',
        eq: 'V_T = ' + r.VT.toFixed(4) + ' V　nᵢ = ' + sci(r.ni, 2) + ' cm⁻³' },
      { t: 'Step 2　算 ln 裡面的比值。', eq: 'N_a·N_d / nᵢ² = (' + sci(r.Na, 1) + ')(' + sci(r.Nd, 1) + ') / (' + sci(r.ni, 2) + ')² = ' + sci(r.ratio, 3) },
      { t: 'Step 3　取自然對數。', note: '<b>是 ln 不是 log</b>：', eq: 'ln(' + sci(r.ratio, 3) + ') = ' + r.ln.toFixed(2) },
      { t: 'Step 4　乘 V_T。', note: r.V > 0.72 && r.V < 0.82 ? '落在 0.7～0.8 V，典型的矽接面。'
          : r.V <= 0.72 ? '比 0.7 V 小 —— 摻雜較淡或溫度較高，跟「約定俗成取 0.7 V」差得不少。' : '比 0.8 V 大 —— 兩邊都摻得很濃。',
        eq: 'V_bi = ' + r.VT.toFixed(4) + ' × ' + r.ln.toFixed(2) + ' = ' + r.V.toFixed(3) + ' V' }
    ],
    answer: (g, r) => 'V_bi = ' + r.V.toFixed(3) + ' V' + (r.T === 300 && g['exv-na'] === 16 && g['exv-nd'] === 17 ? '（與課本 0.757 V 相符）' : '')
  });

  /* ── 例題 C：空乏區有多寬（課本延伸）────────────────────── */
  liveExample('#ex-w', {
    title: '例題 · 逆偏時空乏區有多寬（課本 1.2.2 延伸）',
    ratio: 0.22, minH: 110, maxH: 150,
    givens: [
      { id: 'exw-na', label: 'N<sub>a</sub>', min: 14, max: 18, step: 0.5, value: 16, fmt: fmtL },
      { id: 'exw-nd', label: 'N<sub>d</sub>', min: 14, max: 18, step: 0.5, value: 15, fmt: fmtL },
      { id: 'exw-vr', label: '逆偏 V<sub>R</sub>', min: 0, max: 20, step: 0.5, value: 5, fmt: v => v + ' V' }
    ],
    compute: g => {
      const Na = Math.pow(10, g['exw-na']), Nd = Math.pow(10, g['exw-nd']), VR = g['exw-vr'];
      const V = 0.026 * Math.log(Na * Nd / (NI * NI));
      const W = Math.sqrt(2 * EPS * (V + VR) / QE * (Na + Nd) / (Na * Nd)), W0 = Math.sqrt(2 * EPS * V / QE * (Na + Nd) / (Na * Nd));
      return { Na, Nd, VR, V, W, W0, xn: W * Na / (Na + Nd), xp: W * Nd / (Na + Nd) };
    },
    question: (g, r) => '矽 pn 接面 <b>N<sub>a</sub> = ' + sci(r.Na, 1) + '</b>、<b>N<sub>d</sub> = ' + sci(r.Nd, 1) + ' cm⁻³</b>，加逆偏 <b>V<sub>R</sub> = ' + r.VR + ' V</b>。求空乏區寬度 W，以及它在兩側各佔多少。（ε<sub>Si</sub> = 11.7 × 8.85×10⁻¹⁴ F/cm）',
    steps: (g, r) => [
      { t: 'Step 1　先算 V_bi。', eq: 'V_bi = 0.026 × ln(N_aN_d/nᵢ²) = ' + r.V.toFixed(3) + ' V' },
      { t: 'Step 2　代空乏區寬度公式。', note: '總位障是 V_bi + V_R，寬度跟它的平方根成正比：',
        eq: 'W = √[ 2ε(V_bi + V_R)/e · (N_a + N_d)/(N_aN_d) ] = ' + (r.W * 1e4).toFixed(3) + ' μm' },
      { t: 'Step 3　跟沒加偏壓比。', eq: 'W(0) = ' + (r.W0 * 1e4).toFixed(3) + ' μm　→　變成 ' + (r.W / r.W0).toFixed(2) + ' 倍' },
      { t: 'Step 4　兩側各佔多少。', note: '兩側離子電荷要一樣多：N_a·x_p = N_d·x_n，所以<b>摻雜少的那側比較寬</b>：',
        eq: 'x_p = ' + (r.xp * 1e4).toFixed(3) + ' μm　x_n = ' + (r.xn * 1e4).toFixed(3) + ' μm' }
    ],
    answer: (g, r) => 'W = ' + (r.W * 1e4).toFixed(2) + ' μm（x_p = ' + (r.xp * 1e4).toFixed(2) + '、x_n = ' + (r.xn * 1e4).toFixed(2) + ' μm）',
    draw: (ctx, w, h, g, r) => {
      const x0 = w * 0.06, x1 = w * 0.94, xm = lerp(x0, x1, 0.5), sc = (x1 - x0) * 0.45 / (Math.sqrt(2 * EPS * (0.9 + 20) / QE * (2e14) / 1e28));
      const xp = r.xp * sc, xn = r.xn * sc, y0 = h * 0.18, y1 = h * 0.7;
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.fillStyle = C['electron-w']; ctx.fillRect(xm - xp, y0, xp + xn, y1 - y0);
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1.4; ctx.strokeRect(xm - xp, y0, xp + xn, y1 - y0);
      ctx.strokeStyle = C['ink-3']; ctx.beginPath(); ctx.moveTo(xm, y0 - 4); ctx.lineTo(xm, y1 + 4); ctx.stroke();
      label(ctx, x0 + 10, (y0 + y1) / 2, 'p', C['ink-2'], 13, 'left', '700');
      label(ctx, x1 - 10, (y0 + y1) / 2, 'n', C['ink-2'], 13, 'right', '700');
      labelCJK(ctx, xm, h * 0.88, 'W = ' + (r.W * 1e4).toFixed(2) + ' μm（藍框，畫在同一把尺上）', C.accent, 11.5, 'center', '700');
    }
  });

  /* ── 例題 D：Example 1.6 接面電容 ──────────────────────────── */
  liveExample('#ex-cj', {
    title: '例題 · 接面電容（課本 Example 1.6）',
    ratio: 0.32, minH: 160, maxH: 210,
    givens: [
      { id: 'exc-na', label: 'N<sub>a</sub>', min: 14, max: 18, step: 0.5, value: 16, fmt: fmtL },
      { id: 'exc-nd', label: 'N<sub>d</sub>', min: 14, max: 18, step: 0.5, value: 15, fmt: fmtL },
      { id: 'exc-c0', label: 'C<sub>j0</sub>', min: 0.1, max: 2, step: 0.1, value: 0.5, fmt: v => v.toFixed(1) + ' pF' },
      { id: 'exc-vr', label: '逆偏 V<sub>R</sub>', min: 0, max: 10, step: 0.5, value: 1, fmt: v => v + ' V' }
    ],
    compute: g => {
      const Na = Math.pow(10, g['exc-na']), Nd = Math.pow(10, g['exc-nd']);
      const V = 0.026 * Math.log(Na * Nd / (NI * NI)), c0 = g['exc-c0'], VR = g['exc-vr'];
      return { Na, Nd, V, c0, VR, k: 1 + VR / V, Cj: c0 * Math.pow(1 + VR / V, -0.5) };
    },
    question: (g, r) => '矽 pn 接面（300 K）<b>N<sub>a</sub> = ' + sci(r.Na, 1) + '</b>、<b>N<sub>d</sub> = ' + sci(r.Nd, 1) + ' cm⁻³</b>，nᵢ = 1.5×10¹⁰，<b>C<sub>j0</sub> = ' + r.c0.toFixed(1) + ' pF</b>。求 <b>V<sub>R</sub> = ' + r.VR + ' V</b> 時的接面電容。（課本原題：V<sub>R</sub> = 1 V 與 5 V）',
    steps: (g, r) => [
      { t: 'Step 1　算 V_bi。', eq: 'V_bi = 0.026 × ln(' + sci(r.Na * r.Nd / (NI * NI), 3) + ') = ' + r.V.toFixed(3) + ' V' },
      { t: 'Step 2　算 1 + V_R/V_bi。', note: 'V_R 代<b>正</b>的：', eq: '1 + ' + r.VR + ' / ' + r.V.toFixed(3) + ' = ' + r.k.toFixed(3) },
      { t: 'Step 3　−1/2 次方。', eq: '(' + r.k.toFixed(3) + ')^(−1/2) = ' + Math.pow(r.k, -0.5).toFixed(4) },
      { t: 'Step 4　乘 C_j0。', note: r.VR === 0 ? 'V_R = 0 時就是 C_j0 本身。' : '比 C_j0 小了 ' + ((1 - r.Cj / r.c0) * 100).toFixed(0) + '% —— 空乏區變寬，電容變小。',
        eq: 'C_j = ' + r.c0.toFixed(1) + ' × ' + Math.pow(r.k, -0.5).toFixed(4) + ' = ' + r.Cj.toFixed(3) + ' pF' }
    ],
    answer: (g, r) => 'C_j = ' + r.Cj.toFixed(3) + ' pF' + (g['exc-na'] === 16 && g['exc-nd'] === 15 && r.c0 === 0.5 && (r.VR === 1 || r.VR === 5) ? '（與課本 ' + (r.VR === 1 ? '0.312' : '0.168') + ' pF 相符）' : ''),
    draw: (ctx, w, h, g, r) => {
      const x0 = w * 0.12, x1 = w * 0.95, y0 = h * 0.1, y1 = h * 0.78;
      const X = v => lerp(x0, x1, v / 10), Y = c => lerp(y1, y0, c / Math.max(r.c0, 0.1));
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      for (let v = 0; v <= 10; v += 2) label(ctx, X(v), y1 + 13, v + ' V', C['ink-3'], 9.5);
      label(ctx, x0 - 6, Y(r.c0), r.c0.toFixed(1), C['ink-3'], 9.5, 'right');
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let i = 0; i <= 100; i++) { const v = i / 10, c = r.c0 * Math.pow(1 + v / r.V, -0.5); i ? ctx.lineTo(X(v), Y(c)) : ctx.moveTo(X(v), Y(c)); }
      ctx.stroke();
      ctx.beginPath(); ctx.arc(X(r.VR), Y(r.Cj), 5.5, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill();
      labelCJK(ctx, X(r.VR) + (r.VR > 7 ? -10 : 10), Y(r.Cj) - 12, r.Cj.toFixed(3) + ' pF', C.accent, 12, r.VR > 7 ? 'right' : 'left', '700');
      labelCJK(ctx, x1, y0 + 4, 'C_j（pF）對 V_R：越逆偏越小', C['ink-3'], 11, 'right');
    }
  });
})();

/* ============================================================
   小測驗（中英對照）
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: 'P 型與 N 型剛接觸的瞬間，首先發生什麼？',
      en: 'At the instant the p- and n-regions are joined, what happens first?',
      o: [['濃度差使電洞往 N 擴散、電子往 P 擴散', 'holes diffuse into n and electrons into p due to the concentration gradient'],
          ['電場使載子漂移', 'carriers drift due to an electric field'],
          ['離子開始移動', 'the ions start to move'],
          ['什麼都不會發生', 'nothing happens']], a: 0,
      e: '一開始還沒有電場，只有濃度差，所以先發生<b>擴散</b>：P 區的電洞往 N、N 區的電子往 P。擴散留下離子之後，電場才慢慢建立起來。' },
    { zh: '空乏區（depletion region）裡面有什麼？',
      en: 'What is present in the depletion region?',
      o: [['只有固定的離子，沒有自由載子', 'only fixed ions, no free carriers'],
          ['大量的自由電子', 'many free electrons'],
          ['大量的電洞', 'many holes'],
          ['電子和電洞各一半', 'equal numbers of electrons and holes']], a: 0,
      e: '載子都擴散走了（被「空乏」了），只剩 P 側的 B⁻ 和 N 側的 P⁺。這些離子固定在晶格上、不導電，只負責建立電場。所以也叫<b>空間電荷區</b>。' },
    { zh: '熱平衡時，pn 接面內建電場的方向是？',
      en: 'In thermal equilibrium, what is the direction of the built-in electric field?',
      o: [['由 n 區指向 p 區', 'from the n-region to the p-region'],
          ['由 p 區指向 n 區', 'from the p-region to the n-region'],
          ['沒有電場', 'there is no field'],
          ['垂直於接面', 'perpendicular to the current']], a: 0,
      e: '電場從正電荷指向負電荷：N 側是 P⁺、P 側是 B⁻，所以由 n 指向 p。這個方向剛好擋住多數載子繼續擴散。' },
    { zh: '熱平衡時，下列關於接面電流的敘述何者正確？',
      en: 'In thermal equilibrium, which statement about the junction currents is correct?',
      o: [['擴散電流與漂移電流大小相等、方向相反，淨電流為零', 'diffusion and drift currents are equal and opposite; net current is zero'],
          ['擴散與漂移電流都等於零', 'both diffusion and drift currents are zero'],
          ['只有擴散電流', 'only diffusion current flows'],
          ['只有漂移電流', 'only drift current flows']], a: 0,
      e: '這是<b>動態</b>熱平衡：擴散（多數載子造成）和漂移（少數載子造成）都還在流，只是剛好抵消，宏觀總電流 = 0。' },
    { zh: '內建電壓 V_bi 的公式為何？',
      en: 'What is the expression for the built-in potential barrier V_bi?',
      o: [['V_T · ln(N_a N_d / nᵢ²)', 'V_T · ln(N_a N_d / nᵢ²)'],
          ['V_T · N_a N_d / nᵢ²', 'V_T · N_a N_d / nᵢ²'],
          ['V_T · log₁₀(N_a N_d / nᵢ²)', 'V_T · log₁₀(N_a N_d / nᵢ²)'],
          ['nᵢ² / (N_a N_d)', 'nᵢ² / (N_a N_d)']], a: 0,
      e: 'V_bi = (kT/e)·ln(N_aN_d/nᵢ²)。是<b>自然對數</b>。可以用熱平衡時電洞電流 = 0、加上愛因斯坦關係推出來。' },
    { zh: '矽 pn 接面 N_a = 10¹⁶、N_d = 10¹⁷ cm⁻³（300 K），V_bi 約為？',
      en: 'For a silicon pn junction with N_a = 10¹⁶ and N_d = 10¹⁷ cm⁻³ at 300 K, V_bi is approximately?',
      o: [['0.757 V', '0.757 V'], ['0.026 V', '0.026 V'], ['1.12 V', '1.12 V'], ['7.57 V', '7.57 V']], a: 0,
      e: 'Example 1.5：0.026 × ln[(10¹⁶)(10¹⁷)/(1.5×10¹⁰)²] = 0.026 × 29.12 = 0.757 V。' },
    { zh: '把 N_a 提高 10 倍，V_bi 大約增加多少？',
      en: 'If N_a is increased by a factor of 10, by about how much does V_bi increase?',
      o: [['約 60 mV', 'about 60 mV'], ['變成 10 倍', 'it becomes 10 times larger'], ['約 0.7 V', 'about 0.7 V'], ['不變', 'it does not change']], a: 0,
      e: 'V_bi 取了 ln，所以乘 10 倍只多 V_T·ln10 = 0.026 × 2.303 ≈ 0.06 V。這就是講義說「V_bi 受 N_a 與 N_d 影響不大」的原因。' },
    { zh: '二極體的逆向偏壓是指？',
      en: 'What does reverse bias of a diode mean?',
      o: [['P 端（陽極）接負、N 端（陰極）接正', 'p-side (anode) at negative, n-side (cathode) at positive potential'],
          ['P 端接正、N 端接負', 'p-side at positive, n-side at negative'],
          ['兩端接同電位', 'both ends at the same potential'],
          ['只在 N 端加電壓', 'voltage applied to the n-side only']], a: 0,
      e: '記法：P 接 Positive 是順向；反過來 P 接負、N 接正就是逆向。逆偏時外加電場跟內建電場同方向。' },
    { zh: '加大逆向偏壓 V_R 時，空乏區寬度 W 如何變化？為什麼？',
      en: 'How does the depletion width W change as the reverse bias V_R increases, and why?',
      o: [['變寬：總電場增強，把更多多數載子推離接面，露出更多離子', 'it widens: the stronger field pushes majority carriers away, exposing more ions'],
          ['變窄：外加電場抵消內建電場', 'it narrows: the applied field cancels the built-in field'],
          ['不變', 'it stays the same'],
          ['先變寬再變窄', 'it first widens then narrows']], a: 0,
      e: '逆偏的 E_A 跟 Ē 同向，E_total 變大，空乏區邊緣的多數載子被拉走，露出更多離子 → W ↑。定量上 W ∝ √(V_bi + V_R)。' },
    { zh: '逆向飽和電流 I_S 是由什麼造成？為何它很小？',
      en: 'What causes the reverse-bias saturation current I_S, and why is it small?',
      o: [['少數載子被電場掃過接面；少數載子濃度很低', 'minority carriers swept across by the field; their concentration is very low'],
          ['多數載子擴散；擴散係數很小', 'majority carrier diffusion; the diffusion coefficient is small'],
          ['離子移動；離子很重', 'ion motion; ions are heavy'],
          ['崩潰效應；電壓不夠大', 'breakdown; the voltage is too small']], a: 0,
      e: 'N 區的少數電洞、P 區的少數電子先擴散到空乏區邊緣，再被電場漂移過去，形成 I_S = I_S,n + I_S,p。少數載子本來就少，所以 I_S 很小（矽約 10⁻¹⁴ A），而且不隨 V_R 增加而增加。' },
    { zh: '接面電容 C_j 隨逆偏電壓 V_R 增大如何變化？',
      en: 'How does the junction capacitance C_j change as V_R increases?',
      o: [['變小，因為空乏區（極板距離）變寬', 'it decreases because the depletion width (plate separation) increases'],
          ['變大，因為電荷變多', 'it increases because there is more charge'],
          ['不變', 'it stays constant'],
          ['先變大再變小', 'it first increases then decreases']], a: 0,
      e: 'C = εA/d，空乏區寬度 W 就是 d。V_R ↑ → W ↑ → C_j ↓。公式 C_j = C_j0(1 + V_R/V_bi)^(−1/2)。' },
    { zh: 'Example 1.6 中 V_bi = 0.637 V、C_j0 = 0.5 pF，V_R = 1 V 時 C_j 約為？',
      en: 'In Example 1.6 with V_bi = 0.637 V and C_j0 = 0.5 pF, C_j at V_R = 1 V is approximately?',
      o: [['0.312 pF', '0.312 pF'], ['0.168 pF', '0.168 pF'], ['0.5 pF', '0.5 pF'], ['0.8 pF', '0.8 pF']], a: 0,
      e: 'C_j = 0.5 × (1 + 1/0.637)^(−1/2) = 0.5 × (2.570)^(−1/2) = 0.312 pF。0.168 pF 是 V_R = 5 V 的答案。' }
  ];
  let i = 0, score = 0, answered = false, ord = [];
  /* 選項順序每次打亂：題庫裡正解都寫在第一個，不打亂的話永遠是 A */
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
    const verdict = pct >= 90 ? 'pn 接面的熱平衡和逆偏已經很穩，可以往 PART 4 的順向偏壓前進了。'
      : pct >= 70 ? '主幹抓到了，把答錯的那幾題回去把對應的互動模組再玩一次。'
      : '建議從「接面形成實驗室」重新看一次，先把「擴散 → 離子 → 電場 → 平衡」這條鏈弄順。';
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
