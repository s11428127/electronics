/* ============================================================
   電子學 CH1 PART 4 — 順向偏壓、理想 I–V、60 mV 規則、理想二極體、溫度效應、二極體溫度計
   Neamen 4e, Ch.1 §1.2.3–1.2.5、§1.6；課程 PART 4 投影片 1-38～1-54
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, TAU, K_EV } = E;
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  const VT = 0.026, IS0 = 1e-14, VBI = 0.7;
  /* 電流顯示：自動挑單位 */
  const fmtA = i => {
    const a = Math.abs(i), s = i < 0 ? '−' : '';
    if (a >= 1e-3) return s + (a * 1e3).toFixed(a >= 0.1 ? 0 : 2) + ' mA';
    if (a >= 1e-6) return s + (a * 1e6).toFixed(2) + ' μA';
    if (a >= 1e-9) return s + (a * 1e9).toFixed(2) + ' nA';
    if (a === 0) return '0 A';
    return s + sci(a, 2) + ' A';
  };
  const ion = (ctx, x, y, sign, col, r) => {
    ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.stroke();
    label(ctx, x, y + 0.5, sign, col, r * 1.6, 'center', '700');
  };

  /* ══════════════════════════════════════════════════════════
     ① 偏壓實驗室：空乏區寬度、多數載子跨越、注入少數載子的分布
     ══════════════════════════════════════════════════════════ */
  (function biasLab() {
    const cv = document.getElementById('cv-fwd'); if (!cv) return;
    let v = 0.6, flights = [], clock = 0;
    const R = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(11);
    const holes = [], elecs = [];
    for (let i = 0; i < 30; i++) holes.push({ x: R() * 0.47, y: 0.12 + R() * 0.76, ph: R() * TAU });
    for (let i = 0; i < 30; i++) elecs.push({ x: 0.53 + R() * 0.47, y: 0.12 + R() * 0.76, ph: R() * TAU });
    const st = Stage(cv, { ratio: w => w < 560 ? 0.95 : 0.56, minH: 330, maxH: 470, draw(ctx, w, h, dt) {
      clock += dt;
      const bx0 = w * 0.05, bx1 = w * 0.95, xm = (bx0 + bx1) / 2, by0 = h * 0.07, by1 = h * 0.4;
      const X = r => lerp(bx0, bx1, r), Y = r => lerp(by0, by1, r);
      const ratio = Math.sqrt(Math.max(VBI - v, 0.004) / VBI);
      const half = clamp(0.075 * ratio, 0.006, 0.2);
      /* 兩塊 + 空乏區 */
      ctx.fillStyle = C['surface-2']; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1.2; ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
      ctx.fillStyle = C.surface; ctx.fillRect(X(0.5 - half), by0, X(0.5 + half) - X(0.5 - half), by1 - by0);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      [0.5 - half, 0.5 + half].forEach(r => { ctx.beginPath(); ctx.moveTo(X(r), by0); ctx.lineTo(X(r), by1); ctx.stroke(); });
      ctx.setLineDash([]);
      label(ctx, bx0 + 10, by0 + 12, 'p', C['ink-2'], 13, 'left', '700');
      label(ctx, bx1 - 10, by0 + 12, 'n', C['ink-2'], 13, 'right', '700');
      /* 離子：只畫在空乏區裡 */
      const step = 0.022, ir = Math.min(6, w * 0.011);
      for (let r = 0.5 - step / 2; r > 0.5 - half; r -= step) for (let j = 0; j < 4; j++) ion(ctx, X(r), Y(0.17 + j * 0.22), '−', C.hole, ir);
      for (let r = 0.5 + step / 2; r < 0.5 + half; r += step) for (let j = 0; j < 4; j++) ion(ctx, X(r), Y(0.17 + j * 0.22), '+', C.hole, ir);
      const cr = Math.max(3, Math.min(5, w * 0.009));
      holes.forEach(q => { q.ph += dt * 2.4; if (q.x > 0.5 - half - 0.012) return; hole(ctx, X(q.x) + Math.sin(q.ph) * 2, Y(q.y) + Math.cos(q.ph) * 2, cr + 0.4); });
      elecs.forEach(q => { q.ph += dt * 2.4; if (q.x < 0.5 + half + 0.012) return; electron(ctx, X(q.x) + Math.sin(q.ph) * 2, Y(q.y) + Math.cos(q.ph) * 2, cr); });
      /* 跨越的載子：順偏時多數載子翻過去（數量 ∝ e^(v/V_T)），逆偏時只剩少數載子被掃過去 */
      const rate = v > 0 ? Math.min(16, 7 * Math.pow(10, (v - 0.6) / 0.06)) : 0.8;
      if (Math.random() < rate * dt) {
        const kind = Math.random() < 0.5 ? 'h' : 'e';
        flights.push({ kind, t: 0, y: 0.12 + Math.random() * 0.76, rev: v <= 0, reach: 0.12 + Math.random() * 0.2 });
      }
      for (let i = flights.length - 1; i >= 0; i--) {
        const f = flights[i]; f.t += dt / (f.rev ? 1.1 : 1.8);
        if (f.t >= 1) { flights.splice(i, 1); continue; }
        let r, a;
        if (!f.rev) {
          /* 順偏：從自己這側的空乏區邊緣出發，跨過去、在對面往外擴散並逐漸被復合掉 */
          const start = f.kind === 'h' ? 0.5 - half - 0.01 : 0.5 + half + 0.01;
          const end = f.kind === 'h' ? 0.5 + half + f.reach : 0.5 - half - f.reach;
          r = lerp(start, end, f.t);
          const past = f.kind === 'h' ? r - (0.5 + half) : (0.5 - half) - r;
          a = past > 0 ? Math.exp(-past / (f.reach * 0.45)) : 1;
        } else {
          /* 逆偏：少數載子（P 區電子、N 區電洞）從邊緣被電場掃過去 */
          const start = f.kind === 'e' ? 0.5 - half - 0.03 : 0.5 + half + 0.03;
          const end = f.kind === 'e' ? 0.5 + half + 0.03 : 0.5 - half - 0.03;
          r = lerp(start, end, f.t); a = 1 - Math.pow(f.t, 4);
        }
        ctx.save(); ctx.globalAlpha = clamp(a, 0, 1);
        f.kind === 'h' ? hole(ctx, X(r), Y(f.y), cr + 0.4) : electron(ctx, X(r), Y(f.y), cr);
        ctx.restore();
      }
      /* 淨電場箭頭（n → p，向左），粗細 ∝ 位障 */
      const eY = h * 0.465, L = clamp((X(0.5 + half) - X(0.5 - half)) * 1.4, 40, w * 0.5);
      arrow(ctx, xm + L / 2, eY, xm - L / 2, eY, C.accent, 1 + 2.4 * clamp((VBI - v) / 2.7, 0, 1) * 1.6);
      labelCJK(ctx, xm + L / 2 + 8, eY, '淨電場（n → p）', C.accent, 11.5, 'left', '700');
      /* 下半：注入少數載子分布（線性，各自以熱平衡值為單位） */
      const py0 = h * 0.56, py1 = h * 0.9;
      const fac = Math.exp(v / VT) - 1, f0 = 1 + fac, fmax = Math.max(f0, 1) * 1.12;
      const PY = f => lerp(py1, py0, clamp(f / fmax, 0, 1));
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(bx0, py1); ctx.lineTo(bx1, py1); ctx.stroke();
      ctx.setLineDash([3, 4]);
      [0.5 - half, 0.5 + half].forEach(r => { ctx.beginPath(); ctx.moveTo(X(r), py0 - 6); ctx.lineTo(X(r), py1); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(bx0, PY(1)); ctx.lineTo(X(0.5 - half), PY(1)); ctx.moveTo(X(0.5 + half), PY(1)); ctx.lineTo(bx1, PY(1)); ctx.stroke();
      ctx.setLineDash([]);
      const Lr = 0.12;
      ctx.lineWidth = 2.4;
      [[-1, C.accent], [1, C.accent]].forEach(([s]) => {
        ctx.strokeStyle = C.accent; ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const d = (i / 80) * (0.5 - half), r = s > 0 ? 0.5 + half + d : 0.5 - half - d;
          const f = 1 + fac * Math.exp(-d / Lr);
          i ? ctx.lineTo(X(r), PY(f)) : ctx.moveTo(X(r), PY(f));
        }
        ctx.stroke();
      });
      const big = Math.abs(fac) > 0.5;
      const tag = v > 0.005 ? '× ' + (f0 >= 1000 ? sci(f0, 1) : f0.toFixed(f0 < 10 ? 2 : 0)) : v < -0.005 ? '≈ 0（被抽乾）' : '× 1（熱平衡）';
      if (w < 560) labelCJK(ctx, xm, py0 - 8, '邊緣少數載子 = 熱平衡 ' + tag, C.accent, 11, 'center', '700');
      else {
        labelCJK(ctx, X(0.5 + half) + 8, py0 + 4, 'p_n(0) = p_n0 ' + tag, C.accent, 11.5, 'left', '700');
        labelCJK(ctx, X(0.5 - half) - 8, py0 + 4, 'n_p(0) = n_p0 ' + tag, C.accent, 11.5, 'right', '700');
      }
      label(ctx, bx1 - 4, PY(1) - 9, big && v > 0 ? '' : 'p_n0', C['ink-3'], 10, 'right');
      label(ctx, bx0 + 4, PY(1) - 9, big && v > 0 ? '' : 'n_p0', C['ink-3'], 10, 'left');
      labelCJK(ctx, xm, h * 0.96, '下圖：少數載子濃度（N 側電洞、P 側電子），邊緣最高、往外指數衰減', C['ink-3'], w < 520 ? 10 : 11, 'center');
    }});
    function update() {
      const i = IS0 * (Math.exp(v / VT) - 1);
      setText('fw-b', (VBI - v).toFixed(2) + ' V');
      setText('fw-w', '× ' + Math.sqrt(Math.max(VBI - v, 0.004) / VBI).toFixed(2));
      setText('fw-i', fmtA(i));
      setHTML('fw-msg', v > 0.45
        ? '<b>順偏</b>：坡只剩 ' + (VBI - v).toFixed(2) + ' V，空乏區變窄。大量多數載子翻過接面，到對面變成少數載子，邊緣濃度是熱平衡的 <b>' + sci(Math.exp(v / VT), 1) + '</b> 倍，往外一路被復合、指數衰減（下圖 = 投影片 1-43 Fig 1.16）。'
        : v > 0.05
          ? '<b>小順偏</b>：坡降了一點，邊緣濃度已經是 ' + Math.exp(v / VT).toFixed(v > 0.2 ? 0 : 1) + ' 倍，但電流還只有 ' + fmtA(i) + ' —— 要到 0.6 V 附近才會到 mA 等級。'
          : v >= -0.05
            ? '<b>熱平衡</b>：擴散 = 漂移，總電流 = 0。少數載子濃度就是 p<sub>n0</sub>、n<sub>p0</sub>，一條水平線。'
            : '<b>逆偏</b>：坡墊高到 ' + (VBI - v).toFixed(2) + ' V，空乏區變寬，多數載子過不去。邊緣的少數載子被電場抽乾（下圖往下凹），只剩 −I<sub>S</sub> = ' + fmtA(i) + '。');
    }
    bindRange('fw-v', x => (x > 0 ? '+' : '') + x.toFixed(2) + ' V', x => { v = x; update(); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-fv]'), b => b.addEventListener('click', () => {
      const el = document.getElementById('fw-v'); el.value = b.dataset.fv; el.dispatchEvent(new Event('input'));
    }));
  })();

  /* ══════════════════════════════════════════════════════════
     ② I–V 曲線探索器：線性 / 對數
     ══════════════════════════════════════════════════════════ */
  (function ivExplorer() {
    const cv = document.getElementById('cv-iv'); if (!cv) return;
    let v = 0.7, lis = -14, n = 1, logY = false, st = null;
    const I = x => Math.pow(10, lis) * (Math.exp(x / (n * VT)) - 1);
    st = Stage(cv, { animate: false, ratio: 0.5, minH: 250, maxH: 340, draw(ctx, w, h) {
      const x0 = Math.max(w * 0.11, 48), x1 = w * 0.96, y0 = h * 0.08, y1 = h * 0.84;
      const V0 = -0.3, V1 = 1.0, X = x => lerp(x0, x1, (x - V0) / (V1 - V0));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let g = -0.2; g <= 1.0001; g += 0.2) { const x = X(g); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); label(ctx, x, y1 + 13, g.toFixed(1), C['ink-3'], 10); }
      labelCJK(ctx, x1, y1 + 28, 'v_D（V）', C['ink-3'], 11, 'right');
      let Y;
      if (!logY) {
        const imax = 5e-3, yz = lerp(y1, y0, 0.08);
        Y = i => lerp(yz, y0, i / imax);
        for (let m = 0; m <= 5; m++) { const y = Y(m * 1e-3); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); label(ctx, x0 - 6, y, m + ' mA', C['ink-3'], 10, 'right'); }
        ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0, yz); ctx.lineTo(x1, yz); ctx.moveTo(X(0), y0); ctx.lineTo(X(0), y1); ctx.stroke();
        labelCJK(ctx, X(-0.15), yz - 10, 'i_D ≈ −I_S（小到看不見）', C['ink-3'], 10.5, 'center');
      } else {
        const L0 = -19, L1 = 0;
        Y = i => lerp(y1, y0, (clamp(Math.log10(Math.max(Math.abs(i), 1e-30)), L0, L1) - L0) / (L1 - L0));
        for (let d = L0 + 1; d <= L1; d += (h < 300 ? 3 : 2)) { const y = Y(Math.pow(10, d)); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); label(ctx, x0 - 6, y, '10' + sup(d), C['ink-3'], 10, 'right'); }
        ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(X(0), y0); ctx.lineTo(X(0), y1); ctx.stroke();
        labelCJK(ctx, x0 + 6, y0 + 8, '|i_D|（A，對數）', C['ink-3'], 11, 'left');
      }
      /* 曲線 */
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 - 2, x1 - x0, y1 - y0 + 4); ctx.clip();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.6; ctx.beginPath();
      for (let k = 0; k <= 400; k++) { const x = lerp(V0, V1, k / 400), y = Y(I(x)); k ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); }
      ctx.stroke();
      if (logY && n === 1) {
        /* 標出一階 60 mV */
        const va = 0.4, vb = va + VT * Math.LN10;
        if (Y(I(va)) < y1 && Y(I(vb)) > y0) {
          ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(X(va), Y(I(va))); ctx.lineTo(X(vb), Y(I(va))); ctx.lineTo(X(vb), Y(I(vb))); ctx.stroke(); ctx.setLineDash([]);
          labelCJK(ctx, (X(va) + X(vb)) / 2, Y(I(va)) + 12, '60 mV', C.ink, 10.5, 'center', '700');
          labelCJK(ctx, X(vb) + 6, (Y(I(va)) + Y(I(vb))) / 2, '× 10', C.ink, 10.5, 'left', '700');
        }
      }
      ctx.restore();
      /* 目前的點 */
      const iv = I(v), yy = Y(iv);
      if (yy >= y0 - 1 && yy <= y1 + 1) {
        ctx.beginPath(); ctx.arc(X(v), yy, 5.5, 0, TAU); ctx.fillStyle = C.accent; ctx.fill();
        const right = X(v) < (x0 + x1) / 2;
        labelCJK(ctx, X(v) + (right ? 10 : -10), Math.max(yy - 12, y0 + 8), fmtA(iv), C.accent, 12, right ? 'left' : 'right', '700');
      } else {
        labelCJK(ctx, X(v), y0 + 10, '↑ ' + fmtA(iv) + '（超出畫面）', C.accent, 11.5, X(v) > (x0 + x1) / 2 ? 'right' : 'left', '700');
      }
    }});
    function update() {
      const x = v / (n * VT), iv = I(v);
      setText('iv-x', x.toFixed(2));
      setText('iv-i', fmtA(iv));
      setText('iv-err', v > 0.001 ? (100 / (Math.exp(x) - 1) < 0.01 ? '< 0.01%' : (100 / (Math.exp(x) - 1)).toFixed(v < 0.05 ? 0 : 2) + '%') : v < -0.001 ? 'e^x = ' + Math.exp(x).toFixed(3) + ' → i ≈ −I_S' : '—');
      const v5 = n * VT * Math.log(5e-3 / Math.pow(10, lis));
      setHTML('iv-msg', (logY
        ? '<b>對數刻度</b>：順偏那段變成一條直線（Fig 1.18），斜率 = 每 ' + (60 * n).toFixed(0) + ' mV 一個數量級。往左延伸會碰到 I<sub>S</sub> = 10' + sup(lis) + ' A。'
        : '<b>線性刻度（mA）</b>：跟 Fig 1.17 一樣 —— 左邊貼地、右邊像一道牆。') +
        ' 電流到 5 mA 需要 v<sub>D</sub> ≈ <b>' + v5.toFixed(2) + ' V</b>' + (v5 > 1 ? '（已經跑出畫面右邊）' : '') + '。試試看：I<sub>S</sub> 每小 10 倍，牆往右移 ' + (60 * n).toFixed(0) + ' mV；n 變 2，曲線變緩。');
    }
    bindRange('iv-v', x => (x > 0 ? '+' : '') + x.toFixed(3) + ' V', x => { v = x; update(); st && st.redraw(); });
    bindRange('iv-is', x => '10' + sup(x) + ' A', x => { lis = x; update(); st && st.redraw(); });
    bindRange('iv-n', x => x.toFixed(1), x => { n = x; update(); st && st.redraw(); });
    document.getElementById('iv-scale').addEventListener('click', e => {
      logY = !logY; e.currentTarget.textContent = logY ? '切換：線性刻度' : '切換：對數刻度'; update(); st.redraw();
    });
    update(); st.redraw();
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 小遊戲：電流階梯（每 60 mV × 10）
     ══════════════════════════════════════════════════════════ */
  (function ladder() {
    const cv = document.getElementById('cv-dec'); if (!cv) return;
    const V0 = 0.6, GOALS = [[10, '× 10'], [100, '× 100'], [0.1, '÷ 10'], [2, '× 2'], [1000, '× 1000']];
    let v = 0.65, gi = 0, solved = new Set(), st = null;
    const ratio = () => Math.exp((v - V0) / VT);
    st = Stage(cv, { animate: false, ratio: 0.46, minH: 240, maxH: 320, draw(ctx, w, h) {
      const x0 = Math.max(w * 0.1, 44), x1 = w * 0.95, y0 = h * 0.08, y1 = h * 0.86;
      const VA = 0.45, VB = 0.85, X = x => lerp(x0, x1, (x - VA) / (VB - VA));
      const DA = -3, DB = 4.5, Y = d => lerp(y1, y0, (d - DA) / (DB - DA));
      /* 每 60 mV 一階的格線 */
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let d = -3; d <= 4; d++) { const y = Y(d); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); label(ctx, x0 - 6, y, d === 0 ? '× 1' : d > 0 ? '× 10' + sup(d) : '× 10' + sup(d), C['ink-3'], 10, 'right'); }
      for (let x = 0.5; x <= 0.8001; x += 0.05) { ctx.beginPath(); ctx.moveTo(X(x), y1); ctx.lineTo(X(x), y1 + 4); ctx.stroke(); label(ctx, X(x), y1 + 14, x.toFixed(2), C['ink-3'], 10); }
      /* 樓梯：從起點往上下每 60 mV 畫一階 */
      const s = VT * Math.LN10;
      ctx.strokeStyle = C['ink-3']; ctx.setLineDash([3, 4]);
      for (let k = -2; k <= 3; k++) {
        const va = V0 + k * s, vb = va + s;
        ctx.beginPath(); ctx.moveTo(X(va), Y(k)); ctx.lineTo(X(vb), Y(k)); ctx.lineTo(X(vb), Y(k + 1)); ctx.stroke();
      }
      ctx.setLineDash([]);
      /* 目標帶 */
      const gd = Math.log10(GOALS[gi][0]);
      ctx.fillStyle = C.accent; ctx.globalAlpha = 0.12; ctx.fillRect(x0, Y(gd + 0.05), x1 - x0, Y(gd - 0.05) - Y(gd + 0.05)); ctx.globalAlpha = 1;
      labelCJK(ctx, x1 - 4, Y(gd) - 10, '目標 ' + GOALS[gi][1], C.accent, 11.5, 'right', '700');
      /* 直線（對數座標下的指數） */
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.beginPath();
      ctx.moveTo(X(VA), Y((VA - V0) / s)); ctx.lineTo(X(VB), Y((VB - V0) / s)); ctx.stroke(); ctx.restore();
      /* 起點、目前點 */
      ctx.beginPath(); ctx.arc(X(V0), Y(0), 5, 0, TAU); ctx.fillStyle = C['ink-2']; ctx.fill();
      labelCJK(ctx, X(V0) + 8, Y(0) + 13, '起點 0.60 V', C['ink-2'], 11, 'left');
      const d = (v - V0) / s, yy = Y(clamp(d, DA, DB));
      ctx.beginPath(); ctx.arc(X(v), yy, 6.5, 0, TAU); ctx.fillStyle = C.accent; ctx.fill();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(X(v), yy); ctx.lineTo(X(v), y1); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, x0 + 6, y0 + 8, '電流（相對起點，對數）：每 60 mV 上一階 = × 10', C['ink-3'], w < 520 ? 10 : 11, 'left');
    }});
    function update() {
      const r = ratio(), dv = (v - V0) * 1000, goal = GOALS[gi][0];
      setText('dc-goal', '電流 ' + GOALS[gi][1]);
      setText('dc-dv', (dv >= 0 ? '+' : '−') + Math.abs(dv).toFixed(0) + ' mV');
      setText('dc-ratio', r >= 100 ? '× ' + r.toFixed(0) : r >= 1 ? '× ' + r.toFixed(2) : '÷ ' + (1 / r).toFixed(2));
      const err = Math.abs(Math.log10(r / goal));
      if (err < 0.05) {
        solved.add(gi);
        setText('dc-score', '過關 ' + solved.size + ' / ' + GOALS.length);
        const need = VT * Math.log(goal) * 1000;
        setHTML('dc-msg', '<b>對了！</b>電流 ' + GOALS[gi][1] + ' 需要 Δv = 0.026 × ln(' + goal + ') = <b>' + (need >= 0 ? '+' : '−') + Math.abs(need).toFixed(0) + ' mV</b>。' +
          (solved.size === GOALS.length ? ' 五題全過 —— 記住：×10 是 60 mV、×2 只要 18 mV。' : ' 按「換下一題」。'));
      } else {
        setHTML('dc-msg', '把 v<sub>D</sub> 拉到讓電流 <b>' + GOALS[gi][1] + '</b> 的位置（藍色帶子）。提示：每 60 mV 是一階（× 10）。');
      }
    }
    bindRange('dc-v', x => x.toFixed(3) + ' V', x => { v = x; update(); st && st.redraw(); });
    document.getElementById('dc-next').addEventListener('click', () => { gi = (gi + 1) % GOALS.length; update(); st.redraw(); });
    update(); st.redraw();
  })();

  /* ══════════════════════════════════════════════════════════
     ④ 三種模型：理想、0.7 V、指數（負載線）
     ══════════════════════════════════════════════════════════ */
  const solveExp = (VS, Rk) => {
    /* (V_S − v)/R = I_S(e^(v/V_T) − 1)，左邊遞減、右邊遞增 → 二分法找 v */
    const Rr = Rk * 1e3, g = x => (VS - x) / Rr - IS0 * (Math.exp(x / VT) - 1);
    let a = Math.min(VS, 0) - 1, b = Math.max(VS, 0) + 1;
    b = Math.min(b, 1.2);
    for (let k = 0; k < 80; k++) { const m = (a + b) / 2; g(m) > 0 ? a = m : b = m; }
    const vD = (a + b) / 2;
    return { vD, I: (VS - vD) / Rr };
  };
  window.__p4solveExp = solveExp;
  (function models() {
    const cv = document.getElementById('cv-ideal'); if (!cv) return;
    let VS = 5, Rk = 1, st = null;
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 1.05 : 0.46, minH: 260, maxH: 420, draw(ctx, w, h) {
      const narrow = w < 560;
      const ex = solveExp(VS, Rk), I0 = VS > 0 ? VS / Rk / 1e3 : 0, I7 = VS > 0.7 ? (VS - 0.7) / Rk / 1e3 : 0;
      /* —— 電路 —— */
      const cx0 = narrow ? w * 0.12 : w * 0.05, cx1 = narrow ? w * 0.88 : w * 0.36;
      const cy0 = narrow ? h * 0.08 : h * 0.2, cy1 = narrow ? h * 0.36 : h * 0.78;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6;
      ctx.strokeRect(cx0, cy0, cx1 - cx0, cy1 - cy0);
      /* 電源（左邊） */
      const bym = (cy0 + cy1) / 2;
      ctx.fillStyle = C.surface; ctx.fillRect(cx0 - 8, bym - 10, 16, 20);
      ctx.beginPath(); ctx.moveTo(cx0 - 12, bym - 6); ctx.lineTo(cx0 + 12, bym - 6); ctx.moveTo(cx0 - 6, bym + 6); ctx.lineTo(cx0 + 6, bym + 6); ctx.stroke();
      labelCJK(ctx, cx0 + 14, bym, 'V_S = ' + VS.toFixed(2) + ' V', C.ink, 12, 'left', '700');
      /* 電阻（上面） */
      const rx = (cx0 + cx1) / 2, rw = Math.min(70, (cx1 - cx0) * 0.4);
      ctx.fillStyle = C.surface; ctx.fillRect(rx - rw / 2, cy0 - 8, rw, 16);
      ctx.beginPath(); for (let k = 0; k <= 8; k++) { const x = rx - rw / 2 + rw * k / 8, y = cy0 + (k % 2 ? -6 : 6) * (k === 0 || k === 8 ? 0 : 1); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      labelCJK(ctx, rx, cy0 - 16, 'R = ' + Rk.toFixed(1) + ' kΩ', C.ink, 12, 'center', '700');
      /* 二極體（右邊，陽極在上） */
      const dym = (cy0 + cy1) / 2, ds = 11;
      ctx.fillStyle = C.surface; ctx.fillRect(cx1 - 10, dym - ds - 2, 20, ds * 2 + 4);
      ctx.beginPath(); ctx.moveTo(cx1 - ds, dym - ds * 0.8); ctx.lineTo(cx1 + ds, dym - ds * 0.8); ctx.lineTo(cx1, dym + ds * 0.8); ctx.closePath();
      ctx.fillStyle = ex.I > 1e-6 ? C.accent : C.surface; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx1 - ds, dym + ds * 0.8); ctx.lineTo(cx1 + ds, dym + ds * 0.8); ctx.stroke();
      labelCJK(ctx, cx1 - 16, dym, ex.I > 1e-6 ? 'ON' : 'OFF', ex.I > 1e-6 ? C.accent : C['ink-3'], 12, 'right', '700');
      if (ex.I > 1e-6) arrow(ctx, rx + rw / 2 + 10, cy0 + 12, rx + rw / 2 + 40, cy0 + 12, C.accent, 1.8);
      /* —— I–V 圖 + 負載線 —— */
      const gx0 = narrow ? Math.max(w * 0.13, 46) : w * 0.47, gx1 = w * 0.96;
      const gy0 = narrow ? h * 0.47 : h * 0.08, gy1 = narrow ? h * 0.9 : h * 0.84;
      const VA = -1, VB = 1.2, X = x => lerp(gx0, gx1, (x - VA) / (VB - VA));
      const Imax = Math.max(Math.abs(VS) / Rk / 1e3, 1e-3) * 1.15;
      const Y = i => lerp(gy1, gy0, (i + Imax * 0.12) / (Imax * 1.12));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      [-1, -0.5, 0, 0.5, 1].forEach(x => { ctx.beginPath(); ctx.moveTo(X(x), gy0); ctx.lineTo(X(x), gy1); ctx.stroke(); label(ctx, X(x), gy1 + 12, x.toFixed(1), C['ink-3'], 10); });
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(gx0, Y(0)); ctx.lineTo(gx1, Y(0)); ctx.moveTo(X(0), gy0); ctx.lineTo(X(0), gy1); ctx.stroke();
      label(ctx, gx0 - 4, Y(Imax), (Imax * 1e3).toFixed(1) + ' mA', C['ink-3'], 9.5, 'right');
      ctx.save(); ctx.beginPath(); ctx.rect(gx0, gy0, gx1 - gx0, gy1 - gy0); ctx.clip();
      /* 理想：牆在 0；0.7 V 模型：牆在 0.7 */
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 5; ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.moveTo(X(VA), Y(0)); ctx.lineTo(X(0), Y(0)); ctx.lineTo(X(0), gy0); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(X(VA), Y(0)); ctx.lineTo(X(0.7), Y(0)); ctx.lineTo(X(0.7), gy0); ctx.stroke(); ctx.setLineDash([]);
      /* 指數 */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.6; ctx.beginPath();
      for (let k = 0; k <= 300; k++) { const x = lerp(VA, VB, k / 300), y = Y(IS0 * (Math.exp(x / VT) - 1)); k ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); if (y < gy0 - 5) break; }
      ctx.stroke();
      /* 負載線 i = (V_S − v)/R */
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(X(VA), Y((VS - VA) / Rk / 1e3)); ctx.lineTo(X(VB), Y((VS - VB) / Rk / 1e3)); ctx.stroke();
      ctx.restore();
      const dot = (x, i, col, r) => { ctx.beginPath(); ctx.arc(X(x), Y(i), r, 0, TAU); ctx.fillStyle = col; ctx.fill(); };
      if (VS > 0) { dot(0, I0, C['ink-3'], 4.5); if (VS > 0.7) dot(0.7, I7, C.ink, 4.5); }
      dot(clamp(ex.vD, VA, VB), ex.I, C.accent, 5.5);
      labelCJK(ctx, (gx0 + gx1) / 2, gy1 + 28, '藍：指數　虛線：0.7 V　灰：理想　黑：負載線', C['ink-3'], narrow ? 9.5 : 10.5, 'center');
    }});
    function update() {
      const ex = solveExp(VS, Rk), I0 = VS > 0 ? VS / Rk / 1e3 : 0, I7 = VS > 0.7 ? (VS - 0.7) / Rk / 1e3 : 0;
      setText('id-i0', fmtA(I0));
      setText('id-i7', fmtA(I7));
      setText('id-ie', fmtA(ex.I) + '（v_D = ' + ex.vD.toFixed(3) + ' V）');
      const e0 = ex.I > 1e-6 ? (I0 - ex.I) / ex.I * 100 : 0, e7 = ex.I > 1e-6 ? (I7 - ex.I) / ex.I * 100 : 0;
      setHTML('id-msg', VS <= 0
        ? '<b>逆偏</b>：三種模型都說「斷路」；指數公式給 ' + fmtA(ex.I) + '，就是 −I<sub>S</sub>。這就是為什麼可以把它當成開關 OFF。'
        : ex.I < 1e-6
          ? 'V<sub>S</sub> 太小，還翻不過那道牆：指數公式只有 ' + fmtA(ex.I) + '。理想模型卻說有 ' + fmtA(I0) + ' —— <b>電源電壓跟 0.7 V 差不多時，理想模型完全不能用</b>。'
          : '理想模型誤差 <b>' + (e0 >= 0 ? '+' : '') + e0.toFixed(0) + '%</b>、0.7 V 模型誤差 <b>' + (e7 >= 0 ? '+' : '') + e7.toFixed(1) + '%</b>。' +
            (Math.abs(e0) < 15 ? 'V<sub>S</sub> 遠大於 0.7 V，連理想模型都夠用。' : 'V<sub>S</sub> 不夠大，理想模型偏差太多，要用 0.7 V 模型。') +
            ' 注意電流是由 V<sub>S</sub> 和 R 決定的有限值，不是無限大。');
    }
    bindRange('id-vs', x => x.toFixed(2) + ' V', x => { VS = x; update(); st && st.redraw(); });
    bindRange('id-r', x => x.toFixed(1) + ' kΩ', x => { Rk = x; update(); st && st.redraw(); });
    update(); st.redraw();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ 溫度實驗室
     ══════════════════════════════════════════════════════════ */
  const EG = 1.12;
  const isT = TK => IS0 * Math.pow(TK / 300, 3) * Math.exp((EG / K_EV) * (1 / 300 - 1 / TK));
  const vAt = (i, TK) => K_EV * TK * Math.log(i / isT(TK) + 1);
  (function tempLab() {
    const cv = document.getElementById('cv-temp'); if (!cv) return;
    let T = 75, st = null;
    st = Stage(cv, { animate: false, ratio: 0.5, minH: 250, maxH: 340, draw(ctx, w, h) {
      const x0 = Math.max(w * 0.11, 48), x1 = w * 0.96, y0 = h * 0.1, y1 = h * 0.84;
      const VA = 0.3, VB = 0.85, X = x => lerp(x0, x1, (x - VA) / (VB - VA));
      const Y = i => lerp(y1, y0, i / 5e-3);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let m = 0; m <= 5; m++) { const y = Y(m * 1e-3); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); label(ctx, x0 - 6, y, m + ' mA', C['ink-3'], 10, 'right'); }
      for (let x = 0.3; x <= 0.8501; x += 0.1) { label(ctx, X(x), y1 + 13, x.toFixed(1), C['ink-3'], 10); }
      labelCJK(ctx, x1, y1 + 28, 'v_D（V）', C['ink-3'], 11, 'right');
      const curve = (TC, col, lw, alpha) => {
        const TK = TC + 273, is = isT(TK), vt = K_EV * TK;
        ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
        ctx.rect(x0, y0 - 4, x1 - x0, y1 - y0 + 4); ctx.clip(); ctx.beginPath();
        for (let k = 0; k <= 300; k++) { const x = lerp(VA, VB, k / 300), y = Y(is * (Math.exp(x / vt) - 1)); k ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); if (y < y0 - 4) break; }
        ctx.stroke(); ctx.restore();
        const vx = vAt(5e-3, TK);
        if (vx > VA && vx < VB) label(ctx, X(vx), y0 - 7, TC + '°', col, 10, 'center', '700');
      };
      [-25, 27, 125].forEach(t => curve(t, C['ink-3'], 1.4, 0.55));
      curve(T, C.accent, 2.8, 1);
      /* 1 mA 水平線與交點 */
      const yI = Y(1e-3);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(x0, yI); ctx.lineTo(x1, yI); ctx.stroke(); ctx.setLineDash([]);
      const v27 = vAt(1e-3, 300), vT = vAt(1e-3, T + 273);
      ctx.beginPath(); ctx.arc(X(v27), yI, 4, 0, TAU); ctx.fillStyle = C['ink-2']; ctx.fill();
      ctx.beginPath(); ctx.arc(X(vT), yI, 6, 0, TAU); ctx.fillStyle = C.accent; ctx.fill();
      if (Math.abs(vT - v27) > 0.012) arrow(ctx, X(v27), yI + 16, X(vT), yI + 16, C.accent, 1.8);
      labelCJK(ctx, (X(v27) + X(vT)) / 2, yI + 30, (vT - v27 >= 0 ? '+' : '−') + Math.abs((vT - v27) * 1000).toFixed(0) + ' mV', C.accent, 12, 'center', '700');
    }});
    function update() {
      const TK = T + 273, v27 = vAt(1e-3, 300), vT = vAt(1e-3, TK);
      setText('tp-is', sci(isT(TK), 2) + ' A');
      setText('tp-v', vT.toFixed(3) + ' V');
      const dT = T - 27;
      setText('tp-dv', dT === 0 ? '基準' : ((vT - v27) * 1000).toFixed(0) + ' mV（' + ((vT - v27) * 1000 / dT).toFixed(2) + ' mV/°C）');
      setHTML('tp-msg', '溫度從 27 °C 變到 <b>' + T + ' °C</b>，I<sub>S</sub> 變成 ' + (isT(TK) / IS0 >= 1 ? '<b>' + sci(isT(TK) / IS0, 1) + '</b> 倍' : '<b>1/' + sci(IS0 / isT(TK), 1) + '</b>') +
        '（V<sub>T</sub> 只變 ' + (TK / 300).toFixed(2) + ' 倍）。整條曲線往' + (T >= 27 ? '左' : '右') + '移：要維持 1 mA，v<sub>D</sub> ' + (T >= 27 ? '少' : '多') + '了 ' + Math.abs((vT - v27) * 1000).toFixed(0) + ' mV。');
    }
    bindRange('tp-t', x => x + ' °C（' + (x + 273) + ' K）', x => { T = x; update(); st && st.redraw(); });
    update(); st.redraw();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑥ 小遊戲：讀二極體溫度計（課本 1.6：V_D = 1.12 − 0.522 T/300）
     ══════════════════════════════════════════════════════════ */
  (function thermometer() {
    const cv = document.getElementById('cv-thermo'); if (!cv) return;
    const VD = TK => 1.12 - 0.522 * TK / 300;
    let secret = 60, guess = 27, shown = false, score = 0, st = null;
    const pick = () => { let t; do { t = Math.round(-20 + Math.random() * 140); } while (Math.abs(t - secret) < 15); secret = t; };
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.9 : 0.42, minH: 260, maxH: 360, draw(ctx, w, h) {
      const narrow = w < 560;
      /* 電壓表 */
      const mx = narrow ? w * 0.5 : w * 0.17, my = narrow ? h * 0.18 : h * 0.42, mw = narrow ? Math.min(220, w * 0.7) : w * 0.26, mh = narrow ? 58 : 76;
      ctx.fillStyle = C.surface; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(mx - mw / 2, my - mh / 2, mw, mh, 10) : ctx.rect(mx - mw / 2, my - mh / 2, mw, mh); ctx.fill(); ctx.stroke();
      labelCJK(ctx, mx, my - mh / 2 - 12, '量到的 V_D（I_D ≈ 1 mA 固定）', C['ink-3'], 11, 'center');
      label(ctx, mx, my + 2, VD(secret + 273.15).toFixed(3) + ' V', C.accent, narrow ? 26 : 30, 'center', '700');
      /* V_D–T 圖 */
      const gx0 = narrow ? Math.max(w * 0.15, 50) : w * 0.4, gx1 = w * 0.95, gy0 = narrow ? h * 0.36 : h * 0.1, gy1 = narrow ? h * 0.88 : h * 0.84;
      const TA = -30, TB = 130, VA = 0.5, VB = 0.72;
      const X = t => lerp(gx0, gx1, (t - TA) / (TB - TA)), Y = vv => lerp(gy1, gy0, (vv - VA) / (VB - VA));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let t = -20; t <= 120; t += 20) { ctx.beginPath(); ctx.moveTo(X(t), gy0); ctx.lineTo(X(t), gy1); ctx.stroke(); label(ctx, X(t), gy1 + 12, t + '', C['ink-3'], 10); }
      for (let vv = 0.5; vv <= 0.7001; vv += 0.05) { ctx.beginPath(); ctx.moveTo(gx0, Y(vv)); ctx.lineTo(gx1, Y(vv)); ctx.stroke(); label(ctx, gx0 - 5, Y(vv), vv.toFixed(2), C['ink-3'], 10, 'right'); }
      labelCJK(ctx, gx1, gy1 + 26, 'T（°C）', C['ink-3'], 11, 'right');
      /* 校正點（Fig 1.48） */
      [[255.2, 0.676], [300, 0.598], [310.8, 0.579]].forEach(([TK, vv]) => {
        ctx.beginPath(); ctx.arc(X(TK - 273.15), Y(vv), 4, 0, TAU); ctx.fillStyle = C.ink; ctx.fill();
      });
      labelCJK(ctx, X(255.2 - 273.15) + 8, Y(0.676) + 13, 'Fig 1.48 的校正點', C['ink-2'], 10.5, 'left');
      /* 讀數水平線 */
      const vs = VD(secret + 273.15);
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(gx0, Y(vs)); ctx.lineTo(gx1, Y(vs)); ctx.stroke();
      /* 猜的溫度 */
      ctx.strokeStyle = C['ink-2']; ctx.beginPath(); ctx.moveTo(X(guess), gy0); ctx.lineTo(X(guess), gy1); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, X(guess) + (guess > 90 ? -6 : 6), gy0 + 8, '你猜 ' + guess + ' °C', C['ink-2'], 11, guess > 90 ? 'right' : 'left', '700');
      if (shown) {
        ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(X(TA), Y(VD(TA + 273.15))); ctx.lineTo(X(TB), Y(VD(TB + 273.15))); ctx.stroke();
        ctx.beginPath(); ctx.arc(X(secret), Y(vs), 6.5, 0, TAU); ctx.fillStyle = C.accent; ctx.fill();
        labelCJK(ctx, X(secret) + (secret > 90 ? -10 : 10), Y(vs) + 16, '答案 ' + secret + ' °C', C.accent, 12, secret > 90 ? 'right' : 'left', '700');
      }
    }});
    function msg() {
      const vs = VD(secret + 273.15);
      if (!shown) { setHTML('th-msg', '電壓表讀到 <b>' + vs.toFixed(3) + ' V</b>。300 K（27 °C）時是 0.598 V，斜率 −1.74 mV/°C —— 算算看現在幾度，拉滑桿猜，再按「對答案」。'); return; }
      const err = guess - secret, Tk = 300 * (1.12 - vs) / 0.522;
      setHTML('th-msg', (Math.abs(err) <= 3 ? '<b>準！</b>' : '差了 <b>' + Math.abs(err) + ' °C</b>。') +
        ' T = 300 × (1.12 − ' + vs.toFixed(3) + ') / 0.522 = ' + Tk.toFixed(1) + ' K = <b>' + (Tk - 273.15).toFixed(1) + ' °C</b>。' +
        (vs < 0.598 ? '電壓比 0.598 V 低 → 比室溫熱。' : '電壓比 0.598 V 高 → 比室溫冷。'));
    }
    bindRange('th-g', x => x + ' °C', x => { guess = x; st && st.redraw(); });
    document.getElementById('th-check').addEventListener('click', () => {
      if (!shown && Math.abs(guess - secret) <= 3) { score++; setText('th-score', '答對 ' + score + ' 題'); }
      shown = true; msg(); st.redraw();
    });
    document.getElementById('th-new').addEventListener('click', () => { pick(); shown = false; msg(); st.redraw(); });
    pick(); msg(); st.redraw();
  })();
})();

/* ============================================================
   可互動例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, clamp, lerp, sci, sup, liveExample } = E;
  const NI = 1.5e10, VT = 0.026;
  const fmtL = v => '10' + sup(v % 1 ? v.toFixed(1) : v) + ' cm' + sup(-3);
  const fmtA = i => {
    const a = Math.abs(i), s = i < 0 ? '−' : '';
    if (a >= 1e-3) return s + (a * 1e3).toFixed(2) + ' mA';
    if (a >= 1e-6) return s + (a * 1e6).toFixed(2) + ' μA';
    if (a >= 1e-9) return s + (a * 1e9).toFixed(2) + ' nA';
    return s + sci(a, 2) + ' A';
  };
  /* 對數長條：[名稱, 數值, 顏色, 淡?] */
  function logBars(ctx, w, h, rows, lo, hi) {
    const x0 = w * 0.24, x1 = w * 0.96;
    const X = v => lerp(x0, x1, clamp((Math.log10(Math.max(v, 1e-30)) - lo) / (hi - lo), 0, 1));
    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    const stp = Math.ceil((hi - lo) / (w < 520 ? 4 : 7));
    for (let k = lo; k <= hi; k += stp) { const x = X(Math.pow(10, k)); ctx.beginPath(); ctx.moveTo(x, h * 0.06); ctx.lineTo(x, h * 0.8); ctx.stroke(); label(ctx, x, h * 0.9, '10' + sup(k), C['ink-3'], 9.5); }
    rows.forEach(([nm, v, col, faint], k) => {
      const y = h * (0.16 + k * (0.62 / Math.max(rows.length - 1, 1)));
      ctx.globalAlpha = faint ? 0.45 : 1; ctx.fillStyle = col; ctx.fillRect(x0, y - 6, Math.max(2, X(v) - x0), 12); ctx.globalAlpha = 1;
      labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
    });
  }

  /* ── 例題 A：注入的少數載子（課本延伸） ─────────────────── */
  liveExample('#ex-inj', {
    title: '例題 · 順偏把多少電洞「打」進 N 區？（課本延伸）',
    ratio: 0.28, minH: 140, maxH: 180,
    givens: [
      { id: 'exi-nd', label: 'N 側施體 N<sub>d</sub>', min: 14, max: 18, step: 0.5, value: 16, fmt: fmtL },
      { id: 'exi-v', label: '順偏 v<sub>D</sub>', min: 0, max: 0.8, step: 0.01, value: 0.6, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => {
      const Nd = Math.pow(10, g['exi-nd']), v = g['exi-v'];
      const pn0 = NI * NI / Nd, fac = Math.exp(v / VT), pn = pn0 * fac;
      return { Nd, v, pn0, fac, pn, frac: pn / Nd };
    },
    question: (g, r) => '矽 pn 接面（300 K），N 側 <b>N<sub>d</sub> = ' + sci(r.Nd, 1) + ' cm⁻³</b>，加順偏 <b>v<sub>D</sub> = ' + r.v.toFixed(2) + ' V</b>。求 N 側空乏區邊緣的電洞濃度 p<sub>n</sub>(0)，並判斷「小注入」（p<sub>n</sub>(0) ≪ N<sub>d</sub>）是否成立。',
    steps: (g, r) => [
      { t: 'Step 1　熱平衡時的少數載子。', note: '質量作用定律：', eq: 'p_n0 = nᵢ² / N_d = (1.5×10¹⁰)² / ' + sci(r.Nd, 1) + ' = ' + sci(r.pn0, 2) + ' cm⁻³' },
      { t: 'Step 2　順偏放大的倍數。', note: '坡低了 v<sub>D</sub>，翻得過去的多了 e<sup>v<sub>D</sub>/V<sub>T</sub></sup> 倍：', eq: 'e^(' + r.v.toFixed(2) + '/0.026) = e^' + (r.v / VT).toFixed(2) + ' = ' + sci(r.fac, 2) },
      { t: 'Step 3　邊緣濃度。', eq: 'p_n(0) = p_n0 · e^(v_D/V_T) = ' + sci(r.pn0, 2) + ' × ' + sci(r.fac, 2) + ' = ' + sci(r.pn, 2) + ' cm⁻³' },
      { t: 'Step 4　跟多數載子比。', note: r.frac < 0.1
          ? '只有 N<sub>d</sub> 的 ' + (r.frac * 100).toFixed(r.frac < 0.001 ? 4 : 2) + '%：<b>小注入成立</b>，多數載子濃度幾乎沒被改變，課本的 I–V 公式可以用。'
          : '已經是 N<sub>d</sub> 的 ' + (r.frac * 100).toFixed(0) + '%：<b>大注入</b>，注入的電洞跟多數載子同等級，理想公式開始不準（n 往 2 走，見勘誤 ④）。',
        eq: 'p_n(0) / N_d = ' + (r.frac < 1e-3 ? sci(r.frac, 2) : r.frac.toFixed(3)) }
    ],
    answer: (g, r) => 'p_n(0) = ' + sci(r.pn, 2) + ' cm⁻³（' + (r.frac < 0.1 ? '小注入' : '大注入') + '）',
    draw: (ctx, w, h, g, r) => logBars(ctx, w, h, [['p_n0', r.pn0, C['ink-3'], true], ['p_n(0)', r.pn, C.accent], ['N_d', r.Nd, C.ink]], 0, 20)
  });

  /* ── 例題 B：Example 1.7 ──────────────────────────────── */
  liveExample('#ex-17', {
    title: '例題 · 二極體電流（課本 Example 1.7）',
    ratio: 0.3, minH: 150, maxH: 190,
    givens: [
      { id: 'ex7-is', label: 'I<sub>S</sub>', min: -16, max: -12, step: 1, value: -14, fmt: v => '10' + sup(v) + ' A' },
      { id: 'ex7-v', label: 'v<sub>D</sub>', min: -0.8, max: 0.8, step: 0.01, value: 0.7, fmt: v => (v > 0 ? '+' : '') + v.toFixed(2) + ' V' },
      { id: 'ex7-n', label: '放射係數 n', min: 1, max: 2, step: 0.1, value: 1, fmt: v => v.toFixed(1) }
    ],
    compute: g => {
      const IS = Math.pow(10, g['ex7-is']), v = g['ex7-v'], n = g['ex7-n'];
      const x = v / (n * VT), ex = Math.exp(x);
      return { IS, v, n, x, ex, i: IS * (ex - 1) };
    },
    question: (g, r) => 'pn 接面 T = 300 K，<b>I<sub>S</sub> = 10' + sup(g['ex7-is']) + ' A</b>、<b>n = ' + r.n.toFixed(1) + '</b>。求 <b>v<sub>D</sub> = ' + (r.v > 0 ? '+' : '') + r.v.toFixed(2) + ' V</b> 時的二極體電流。（課本原題：v<sub>D</sub> = +0.70 V 與 −0.70 V）',
    steps: (g, r) => [
      { t: 'Step 1　算指數。', note: 'V<sub>T</sub> = 0.026 V，v<sub>D</sub> 帶正負號：', eq: 'v_D / (nV_T) = ' + r.v.toFixed(2) + ' / (' + r.n.toFixed(1) + ' × 0.026) = ' + r.x.toFixed(3) },
      { t: 'Step 2　e 的次方。', eq: 'e^' + r.x.toFixed(3) + ' = ' + (r.ex > 1000 || r.ex < 0.001 ? sci(r.ex, 3) : r.ex.toFixed(4)) },
      { t: 'Step 3　減 1、乘 I_S。', eq: 'i_D = 10' + sup(g['ex7-is']) + ' × (' + (r.ex > 1000 || r.ex < 0.001 ? sci(r.ex, 3) : r.ex.toFixed(4)) + ' − 1) = ' + fmtA(r.i) },
      { t: 'Step 4　−1 能不能丟？', note: r.v > 0.1 * r.n
          ? 'e 的次方是 ' + (r.ex > 1000 ? sci(r.ex, 1) : r.ex.toFixed(0)) + '，減 1 只差' + (100 / (r.ex - 1) < 0.01 ? '不到 0.01%' : ' ' + (100 / (r.ex - 1)).toFixed(2) + '%') + '：<b>順偏，−1 可以丟</b>，i<sub>D</sub> ≈ I<sub>S</sub>e<sup>v<sub>D</sub>/nV<sub>T</sub></sup>。'
          : r.v < -0.1 * r.n
            ? 'e 的次方只有 ' + sci(r.ex, 1) + '，跟 1 比可以忽略：<b>逆偏，i<sub>D</sub> ≈ −I<sub>S</sub></b>（負號 = 方向跟 i<sub>D</sub> 的定義相反）。'
            : '|v<sub>D</sub>| 太小，e 的次方跟 1 差不多：<b>兩項都不能丟</b>，要用完整公式。',
        eq: r.v > 0.1 * r.n ? 'I_S·e^x = ' + fmtA(r.IS * r.ex) : r.v < -0.1 * r.n ? '−I_S = ' + fmtA(-r.IS) : 'i_D = ' + fmtA(r.i) }
    ],
    answer: (g, r) => {
      const book = g['ex7-is'] === -14 && r.n === 1 && Math.abs(Math.abs(r.v) - 0.7) < 1e-9;
      return 'i_D = ' + fmtA(r.i) + (book ? '（與課本 ' + (r.v > 0 ? '4.93 mA' : '−10⁻¹⁴ A') + ' 相符）' : '');
    },
    draw: (ctx, w, h, g, r) => {
      /* |i| 對數 vs v：逆偏貼在 I_S，順偏直線往上 */
      const x0 = Math.max(w * 0.12, 46), x1 = w * 0.96, y0 = h * 0.1, y1 = h * 0.8;
      const X = v => lerp(x0, x1, (v + 0.8) / 1.6), L0 = -17, L1 = 0, Y = i => lerp(y1, y0, (clamp(Math.log10(Math.max(Math.abs(i), 1e-30)), L0, L1) - L0) / (L1 - L0));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let d = -16; d <= 0; d += 4) { const y = Y(Math.pow(10, d)); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); label(ctx, x0 - 5, y, '10' + sup(d), C['ink-3'], 9.5, 'right'); }
      [-0.8, -0.4, 0, 0.4, 0.8].forEach(v => label(ctx, X(v), y1 + 12, v.toFixed(1), C['ink-3'], 9.5));
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let k = 0; k <= 200; k++) { const v = -0.8 + 1.6 * k / 200; if (Math.abs(v) < 0.004) continue; const y = Y(r.IS * (Math.exp(v / (r.n * VT)) - 1)); k ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y); }
      ctx.stroke();
      ctx.beginPath(); ctx.arc(X(r.v), Y(r.i), 5.5, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill();
      labelCJK(ctx, X(r.v) + (r.v > 0.3 ? -10 : 10), Y(r.i) - 12, '|i_D| = ' + fmtA(Math.abs(r.i)), C.accent, 11.5, r.v > 0.3 ? 'right' : 'left', '700');
      labelCJK(ctx, x0 + 6, y0 + 2, '|i_D|（對數）對 v_D', C['ink-3'], 10.5, 'left');
    }
  });

  /* ── 例題 C：60 mV 規則 ───────────────────────────────── */
  liveExample('#ex-dec', {
    title: '例題 · 電流變 10 倍，電壓要多少？',
    ratio: 0.26, minH: 130, maxH: 170,
    givens: [
      { id: 'exd-v1', label: '已知 v<sub>1</sub>', min: 0.55, max: 0.75, step: 0.01, value: 0.7, fmt: v => v.toFixed(2) + ' V' },
      { id: 'exd-i1', label: '已知 i<sub>1</sub>', min: -2, max: 1, step: 0.5, value: 0, fmt: v => (Math.pow(10, v) >= 1 ? Math.pow(10, v).toFixed(v % 1 ? 2 : 0) : Math.pow(10, v).toPrecision(2)) + ' mA' },
      { id: 'exd-i2', label: '想要 i<sub>2</sub>', min: -2, max: 2, step: 0.1, value: 1, fmt: v => (Math.pow(10, v) >= 10 ? Math.pow(10, v).toFixed(0) : Math.pow(10, v).toPrecision(2)) + ' mA' },
      { id: 'exd-n', label: '放射係數 n', min: 1, max: 2, step: 0.1, value: 1, fmt: v => v.toFixed(1) }
    ],
    compute: g => {
      const i1 = Math.pow(10, g['exd-i1']), i2 = Math.pow(10, g['exd-i2']), n = g['exd-n'];
      const dv = n * VT * Math.log(i2 / i1);
      return { v1: g['exd-v1'], i1, i2, n, dv, v2: g['exd-v1'] + dv, dec: Math.log10(i2 / i1) };
    },
    question: (g, r) => '二極體在 <b>v<sub>D</sub> = ' + r.v1.toFixed(2) + ' V</b> 時電流 <b>' + r.i1.toPrecision(2) + ' mA</b>（n = ' + r.n.toFixed(1) + '、300 K）。要讓電流變成 <b>' + r.i2.toPrecision(2) + ' mA</b>，v<sub>D</sub> 要調到多少？',
    steps: (g, r) => [
      { t: 'Step 1　兩點相除，I_S 消掉。', eq: 'i₂/i₁ = e^((v₂ − v₁)/nV_T)' },
      { t: 'Step 2　取 ln 解 Δv。', eq: 'Δv = nV_T · ln(i₂/i₁) = ' + r.n.toFixed(1) + ' × 0.026 × ln(' + (r.i2 / r.i1).toPrecision(3) + ') = ' + (r.dv * 1000).toFixed(1) + ' mV' },
      { t: 'Step 3　加回去。', eq: 'v₂ = ' + r.v1.toFixed(2) + ' + (' + (r.dv * 1000).toFixed(1) + ' mV) = ' + r.v2.toFixed(3) + ' V' },
      { t: 'Step 4　用 60 mV 規則驗算。', note: '電流差了 ' + r.dec.toFixed(2) + ' 個數量級，每個數量級 ' + (60 * r.n).toFixed(0) + ' mV：' +
          (Math.abs(r.dec) < 0.5 ? '差不到半個數量級，電壓幾乎不用動 —— 這就是「導通後電壓幾乎固定」。' : Math.abs(r.dv) < 0.25 ? '電流改了 ' + Math.pow(10, Math.abs(r.dec)).toFixed(0) + ' 倍，電壓才動 ' + Math.abs(r.dv * 1000).toFixed(0) + ' mV。' : '跨好幾個數量級，電壓才明顯改變。'),
        eq: r.dec.toFixed(2) + ' × ' + (59.9 * r.n).toFixed(1) + ' mV ≈ ' + (r.dec * 59.9 * r.n).toFixed(1) + ' mV ✓' }
    ],
    answer: (g, r) => 'v₂ = ' + r.v2.toFixed(3) + ' V（Δv = ' + (r.dv >= 0 ? '+' : '−') + Math.abs(r.dv * 1000).toFixed(1) + ' mV）',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(w * 0.12, 46), x1 = w * 0.96, y0 = h * 0.12, y1 = h * 0.78;
      const lo = Math.min(r.v1, r.v2) - 0.03, hi = Math.max(r.v1, r.v2) + 0.03;
      const X = v => lerp(x0, x1, (v - lo) / (hi - lo));
      const dl = Math.log10(Math.min(r.i1, r.i2)) - 0.3, dh = Math.log10(Math.max(r.i1, r.i2)) + 0.3;
      const Y = i => lerp(y1, y0, (Math.log10(i) - dl) / Math.max(dh - dl, 0.6));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      for (let d = Math.ceil(dl); d <= dh; d++) { const y = Y(Math.pow(10, d)); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); label(ctx, x0 - 5, y, (Math.pow(10, d) >= 1 ? Math.pow(10, d) : Math.pow(10, d).toPrecision(1)) + ' mA', C['ink-3'], 9.5, 'right'); }
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
      const i1x = v => r.i1 * Math.exp((v - r.v1) / (r.n * VT));
      ctx.moveTo(X(lo), Y(i1x(lo))); ctx.lineTo(X(hi), Y(i1x(hi))); ctx.stroke();
      [[r.v1, r.i1, '1'], [r.v2, r.i2, '2']].forEach(([v, i, s]) => {
        ctx.beginPath(); ctx.arc(X(v), Y(i), 5.5, 0, Math.PI * 2); ctx.fillStyle = s === '1' ? C['ink-2'] : C.accent; ctx.fill();
        label(ctx, X(v), y1 + 13, v.toFixed(3) + ' V', s === '1' ? C['ink-2'] : C.accent, 10, 'center', '700');
      });
    }
  });

  /* ── 例題 D：三種模型 ─────────────────────────────────── */
  liveExample('#ex-ideal', {
    title: '例題 · 同一個電路，三種二極體模型',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'exm-vs', label: '電源 V<sub>S</sub>', min: 0.5, max: 12, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'exm-r', label: '電阻 R', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' kΩ' }
    ],
    compute: g => {
      const VS = g['exm-vs'], Rk = g['exm-r'], sol = window.__p4solveExp(VS, Rk);
      const I0 = VS / Rk, I7 = Math.max(0, (VS - 0.7) / Rk), Ie = sol.I * 1e3;
      /* 疊代示範：從 0.7 V 出發 */
      const it = [];
      if (I7 > 0) { let vd = 0.7; for (let k = 0; k < 2; k++) { const I = (VS - vd) / Rk; vd = 0.026 * Math.log(I * 1e-3 / 1e-14); it.push([I, vd]); } }
      return { VS, Rk, I0, I7, Ie, vD: sol.vD, it };
    },
    question: (g, r) => '電源 <b>V<sub>S</sub> = ' + r.VS.toFixed(1) + ' V</b> 串聯 <b>R = ' + r.Rk.toFixed(1) + ' kΩ</b> 和一顆矽二極體（I<sub>S</sub> = 10⁻¹⁴ A、n = 1、順向接）。分別用 (a) 理想二極體、(b) 0.7 V 定電壓降、(c) 指數公式求電流。',
    steps: (g, r) => [
      { t: 'Step 1　理想模型：導通 = 短路。', eq: 'I = V_S / R = ' + r.VS.toFixed(1) + ' / ' + r.Rk.toFixed(1) + 'k = ' + r.I0.toFixed(3) + ' mA' },
      { t: 'Step 2　0.7 V 模型：導通 = 0.7 V 電池。', note: r.I7 > 0 ? '' : 'V<sub>S</sub> &lt; 0.7 V，這個模型判斷二極體 OFF：',
        eq: r.I7 > 0 ? 'I = (V_S − 0.7) / R = ' + r.I7.toFixed(3) + ' mA' : 'I = 0' },
      { t: 'Step 3　指數公式：疊代（或負載線交點）。', note: r.it.length ? '從 v<sub>D</sub> = 0.7 V 出發，算 I → 用 v<sub>D</sub> = V<sub>T</sub>ln(I/I<sub>S</sub>) 更新 → 再算 I：' : '電流很小，直接解 (V<sub>S</sub> − v)/R = I<sub>S</sub>e<sup>v/V<sub>T</sub></sup>：',
        eq: r.it.length ? r.it.map((p, k) => '第 ' + (k + 1) + ' 次：I = ' + p[0].toFixed(4) + ' mA → v_D = ' + p[1].toFixed(4) + ' V').join('<br>') + '<br>收斂：I = ' + r.Ie.toFixed(4) + ' mA，v_D = ' + r.vD.toFixed(3) + ' V'
          : 'I = ' + fmtA(r.Ie * 1e-3) + '，v_D = ' + r.vD.toFixed(3) + ' V' },
      { t: 'Step 4　比較。', note: r.Ie > 1e-3
          ? (Math.abs(r.I0 - r.Ie) / r.Ie < 0.15 ? 'V<sub>S</sub> 遠大於 0.7 V：理想模型誤差 ' + ((r.I0 - r.Ie) / r.Ie * 100).toFixed(0) + '%，<b>理想模型就夠用</b>。' : '理想模型誤差 ' + ((r.I0 - r.Ie) / r.Ie * 100).toFixed(0) + '%，<b>太大</b>；0.7 V 模型只差 ' + ((r.I7 - r.Ie) / r.Ie * 100).toFixed(1) + '%。V<sub>S</sub> 不大時一定要扣 0.7 V。')
          : 'V<sub>S</sub> 太小，二極體幾乎沒導通：<b>理想模型錯得離譜</b>，0.7 V 模型說 OFF 比較接近真相。',
        eq: '理想 ' + r.I0.toFixed(3) + '　0.7 V ' + r.I7.toFixed(3) + '　指數 ' + r.Ie.toFixed(3) + '（mA）' }
    ],
    answer: (g, r) => '(a) ' + r.I0.toFixed(2) + ' mA　(b) ' + r.I7.toFixed(2) + ' mA　(c) ' + (r.Ie >= 0.01 ? r.Ie.toFixed(2) + ' mA' : fmtA(r.Ie * 1e-3)),
    draw: (ctx, w, h, g, r) => {
      const x0 = w * 0.3, x1 = w * 0.94, mx = Math.max(r.I0, 0.001);
      [['理想', r.I0, C['ink-3']], ['0.7 V 模型', r.I7, C.ink], ['指數（真值）', r.Ie, C.accent]].forEach(([nm, v, col], k) => {
        const y = h * (0.2 + k * 0.3);
        const len = Math.max(2, (x1 - x0) * 0.8 * v / mx);
        ctx.fillStyle = col; ctx.fillRect(x0, y - 8, len, 16);
        labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
        label(ctx, x0 + len + 6, y, v.toFixed(2) + ' mA', col, 10.5, 'left', '700');
      });
    }
  });

  /* ── 例題 E：溫度效應 ─────────────────────────────────── */
  liveExample('#ex-temp', {
    title: '例題 · 熱起來之後 v_D 跟 I_S 變多少？',
    ratio: 0.26, minH: 130, maxH: 170,
    givens: [
      { id: 'ext-v', label: '27 °C 時的 v<sub>D</sub>', min: 0.55, max: 0.75, step: 0.01, value: 0.65, fmt: v => v.toFixed(2) + ' V' },
      { id: 'ext-t', label: '新溫度 T', min: -40, max: 150, step: 1, value: 100, fmt: v => v + ' °C' },
      { id: 'ext-k', label: '溫度係數', min: -2.5, max: -1.5, step: 0.1, value: -2, fmt: v => v.toFixed(1) + ' mV/°C' }
    ],
    compute: g => {
      const v0 = g['ext-v'], T = g['ext-t'], k = g['ext-k'], dT = T - 27;
      return { v0, T, k, dT, v: v0 + k * dT / 1000, r5: Math.pow(2, dT / 5), r10: Math.pow(2, dT / 10) };
    },
    question: (g, r) => '矽二極體在 27 °C、固定電流下 <b>v<sub>D</sub> = ' + r.v0.toFixed(2) + ' V</b>。溫度變成 <b>' + r.T + ' °C</b>（電流不變），v<sub>D</sub> 變多少？I<sub>S</sub> 大約變幾倍？（溫度係數 ' + r.k.toFixed(1) + ' mV/°C）',
    steps: (g, r) => [
      { t: 'Step 1　溫差。', eq: 'ΔT = ' + r.T + ' − 27 = ' + r.dT + ' °C' },
      { t: 'Step 2　電壓變化。', note: '固定電流時 v<sub>D</sub> 隨溫度線性下降：', eq: 'Δv_D = (' + r.k.toFixed(1) + ' mV/°C) × ' + r.dT + ' = ' + (r.k * r.dT).toFixed(0) + ' mV　→　v_D = ' + r.v.toFixed(3) + ' V' },
      { t: 'Step 3　I_S 的變化。', note: '講義：理論上每 5 °C 翻倍；實際逆偏電流約每 10 °C 翻倍：', eq: '2^(' + r.dT + '/5) = ' + (r.r5 >= 1000 || r.r5 < 0.01 ? sci(r.r5, 2) : r.r5.toFixed(2)) + ' 倍　｜　2^(' + r.dT + '/10) = ' + (r.r10 >= 1000 || r.r10 < 0.01 ? sci(r.r10, 2) : r.r10.toFixed(2)) + ' 倍' },
      { t: 'Step 4　解讀。', note: r.dT > 0
          ? '熱了 ' + r.dT + ' °C，I<sub>S</sub> 暴增，同樣電流只要更小的電壓。' + (r.v < 0.45 ? ' v<sub>D</sub> 已經掉到 ' + r.v.toFixed(2) + ' V，用 0.7 V 模型會差很多。' : '')
          : r.dT < 0 ? '冷了 ' + (-r.dT) + ' °C，I<sub>S</sub> 變小，要更大的電壓才推得動同樣電流。' : '溫度沒變，什麼都不變。',
        eq: 'v_D: ' + r.v0.toFixed(3) + ' V → ' + r.v.toFixed(3) + ' V' }
    ],
    answer: (g, r) => 'v_D ≈ ' + r.v.toFixed(3) + ' V；I_S 約變 ' + (r.r5 >= 1000 || r.r5 < 0.01 ? sci(r.r5, 1) : r.r5.toFixed(1)) + ' 倍（每 5 °C 翻倍）',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(w * 0.12, 46), x1 = w * 0.95, y0 = h * 0.12, y1 = h * 0.78;
      const X = t => lerp(x0, x1, (t + 40) / 190), vA = r.v0 + r.k * 123 / 1000, vB = r.v0 - r.k * 67 / 1000;
      const Y = v => lerp(y1, y0, (v - vA) / (vB - vA));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      [-40, 0, 27, 50, 100, 150].forEach(t => { ctx.beginPath(); ctx.moveTo(X(t), y0); ctx.lineTo(X(t), y1); ctx.stroke(); label(ctx, X(t), y1 + 12, t + '°', C['ink-3'], 9.5); });
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(X(-40), Y(r.v0 + r.k * -67 / 1000)); ctx.lineTo(X(150), Y(r.v0 + r.k * 123 / 1000)); ctx.stroke();
      ctx.beginPath(); ctx.arc(X(27), Y(r.v0), 4.5, 0, Math.PI * 2); ctx.fillStyle = C['ink-2']; ctx.fill();
      ctx.beginPath(); ctx.arc(X(r.T), Y(r.v), 6, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill();
      labelCJK(ctx, X(r.T) + (r.T > 90 ? -10 : 10), Y(r.v) - 12, r.v.toFixed(3) + ' V', C.accent, 11.5, r.T > 90 ? 'right' : 'left', '700');
      labelCJK(ctx, x1, y0 - 2, 'v_D 對 T（固定電流）', C['ink-3'], 10.5, 'right');
    }
  });

  /* ── 例題 F：二極體溫度計 ─────────────────────────────── */
  liveExample('#ex-thermo', {
    title: '例題 · 從電壓反推溫度（課本 1.6，Fig 1.48）',
    ratio: 0.26, minH: 130, maxH: 170,
    givens: [
      { id: 'exh-v', label: '量到的 V<sub>D</sub>', min: 0.5, max: 0.72, step: 0.001, value: 0.579, fmt: v => v.toFixed(3) + ' V' },
      { id: 'exh-c', label: '300 K 校正值', min: 0.56, max: 0.64, step: 0.001, value: 0.598, fmt: v => v.toFixed(3) + ' V' }
    ],
    compute: g => {
      const V = g['exh-v'], Vc = g['exh-c'], c = 1.12 - Vc, TK = 300 * (1.12 - V) / c;
      return { V, Vc, c, TK, TC: TK - 273.15, TF: (TK - 273.15) * 9 / 5 + 32, slope: -c / 300 * 1000 };
    },
    question: (g, r) => '課本的二極體溫度計（15 V、15 kΩ，I<sub>D</sub> ≈ 1 mA 固定）在 300 K 校正時 V<sub>D</sub> = <b>' + r.Vc.toFixed(3) + ' V</b>。現在電壓表讀到 <b>' + r.V.toFixed(3) + ' V</b>，溫度是多少？',
    steps: (g, r) => [
      { t: 'Step 1　寫出直線。', note: 'V<sub>D</sub> = 1.12 − c·(T/300)，用校正點求 c：', eq: 'c = 1.12 − ' + r.Vc.toFixed(3) + ' = ' + r.c.toFixed(3) + ' V　→　斜率 ' + r.slope.toFixed(2) + ' mV/K' },
      { t: 'Step 2　解 T。', eq: 'T = 300 × (1.12 − ' + r.V.toFixed(3) + ') / ' + r.c.toFixed(3) + ' = ' + r.TK.toFixed(1) + ' K' },
      { t: 'Step 3　換成常用單位。', eq: r.TK.toFixed(1) + ' K = ' + r.TC.toFixed(1) + ' °C = ' + r.TF.toFixed(1) + ' °F' },
      { t: 'Step 4　解讀。', note: r.V < r.Vc ? '電壓比校正值低 ' + ((r.Vc - r.V) * 1000).toFixed(0) + ' mV → <b>比 300 K 熱</b>。' : r.V > r.Vc ? '電壓比校正值高 ' + ((r.V - r.Vc) * 1000).toFixed(0) + ' mV → <b>比 300 K 冷</b>。' : '剛好是校正點。',
        eq: r.TK < 200 || r.TK > 450 ? '注意：' + r.TK.toFixed(0) + ' K 已經超出直線近似可靠的範圍' : '（Fig 1.48：0.676 V ↔ 0 °F、0.579 V ↔ 100 °F）' }
    ],
    answer: (g, r) => 'T ≈ ' + r.TK.toFixed(1) + ' K（' + r.TC.toFixed(1) + ' °C）' + (Math.abs(r.V - 0.579) < 1e-9 && Math.abs(r.Vc - 0.598) < 1e-9 ? '　與 Fig 1.48 的 310.8 K 相符' : ''),
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(w * 0.12, 46), x1 = w * 0.95, y0 = h * 0.12, y1 = h * 0.78;
      const TA = 220, TB = 420, X = t => lerp(x0, x1, (t - TA) / (TB - TA));
      const Vf = t => 1.12 - r.c * t / 300, Y = v => lerp(y1, y0, (v - Vf(TB)) / (Vf(TA) - Vf(TB)));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      [250, 300, 350, 400].forEach(t => { ctx.beginPath(); ctx.moveTo(X(t), y0); ctx.lineTo(X(t), y1); ctx.stroke(); label(ctx, X(t), y1 + 12, t + ' K', C['ink-3'], 9.5); });
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(X(TA), Y(Vf(TA))); ctx.lineTo(X(TB), Y(Vf(TB))); ctx.stroke();
      ctx.beginPath(); ctx.arc(X(300), Y(r.Vc), 4.5, 0, Math.PI * 2); ctx.fillStyle = C['ink-2']; ctx.fill();
      const tx = clamp(r.TK, TA, TB);
      ctx.beginPath(); ctx.arc(X(tx), Y(Vf(tx)), 6, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill();
      labelCJK(ctx, X(tx) + (tx > 360 ? -10 : 10), Y(Vf(tx)) - 12, r.TC.toFixed(1) + ' °C', C.accent, 11.5, tx > 360 ? 'right' : 'left', '700');
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
    { zh: '順向偏壓時，pn 接面的淨電場如何變化？',
      en: 'Under forward bias, how does the net electric field in the pn junction change?',
      o: [['變小，但仍由 n 指向 p', 'it decreases but still points from n to p'],
          ['反過來由 p 指向 n', 'it reverses and points from p to n'],
          ['變大', 'it increases'],
          ['變成零', 'it becomes zero']], a: 0,
      e: 'E<sub>total</sub> = Ē − E<sub>A</sub>。只要 v<sub>D</sub> &lt; V<sub>bi</sub>，E<sub>A</sub> &lt; Ē，淨電場仍由 n 指向 p，只是變小（投影片 1-38）。' },
    { zh: '順向偏壓時，空乏區寬度如何變化？',
      en: 'How does the depletion width change under forward bias?',
      o: [['變窄', 'it becomes narrower'], ['變寬', 'it becomes wider'], ['不變', 'it stays the same'], ['先變寬再變窄', 'it first widens then narrows']], a: 0,
      e: '外加電源從兩端補進電子與電洞，把空乏區邊緣的離子「恢復」成中性的 P 型與 N 型（投影片 1-40），所以空乏區變窄。' },
    { zh: '順向電流主要是哪一種電流？',
      en: 'The forward current of a pn junction is mainly which type of current?',
      o: [['少數載子濃度梯度造成的擴散電流', 'diffusion current due to minority-carrier concentration gradients'],
          ['多數載子的漂移電流', 'drift current of majority carriers'],
          ['離子移動造成的電流', 'current due to ion motion'],
          ['位移電流', 'displacement current']], a: 0,
      e: '多數載子翻過接面，到對面變成少數載子，形成濃度梯度 → 擴散電流（投影片 1-45 紅字）。' },
    { zh: '順偏時注入 N 區的多出電洞濃度，隨離接面的距離如何變化？',
      en: 'How does the excess hole concentration injected into the n-region vary with distance from the junction?',
      o: [['近似指數衰減，主因是復合', 'it decays approximately exponentially, mainly due to recombination'],
          ['線性增加', 'it increases linearly'],
          ['保持不變', 'it stays constant'],
          ['先增加再減少', 'it first increases then decreases']], a: 0,
      e: 'Fig 1.16：注入的少數載子邊擴散邊被多數載子復合，δp(x) = δp(0)e<sup>−x/L<sub>p</sub></sup>。' },
    { zh: '理想 pn 接面的電流–電壓關係為何？',
      en: 'What is the ideal current–voltage relationship of a pn junction?',
      o: [['i_D = I_S (e^(v_D/nV_T) − 1)', 'i_D = I_S (e^(v_D/nV_T) − 1)'],
          ['i_D = v_D / R', 'i_D = v_D / R'],
          ['i_D = I_S · v_D / V_T', 'i_D = I_S · v_D / V_T'],
          ['i_D = I_S (1 − e^(−v_D/V_T))', 'i_D = I_S (1 − e^(−v_D/V_T))']], a: 0,
      e: '投影片 1-44。I<sub>S</sub> 是逆向飽和電流、n 是放射係數（1～2，未聲明取 1）、V<sub>T</sub> = kT/e ≈ 26 mV。' },
    { zh: 'Example 1.7：I_S = 10⁻¹⁴ A、n = 1、300 K，v_D = +0.70 V 時 i_D 約為？',
      en: 'Example 1.7: with I_S = 10⁻¹⁴ A, n = 1 at 300 K, what is i_D at v_D = +0.70 V?',
      o: [['4.93 mA', '4.93 mA'], ['0.70 mA', '0.70 mA'], ['10⁻¹⁴ A', '10⁻¹⁴ A'], ['49.3 A', '49.3 A']], a: 0,
      e: 'i<sub>D</sub> = 10⁻¹⁴ × (e<sup>0.70/0.026</sup> − 1) = 10⁻¹⁴ × 4.93×10¹¹ = 4.93 mA。' },
    { zh: '同一題 v_D = −0.70 V 時，i_D 約為？',
      en: 'For the same diode, what is i_D at v_D = −0.70 V?',
      o: [['約 −10⁻¹⁴ A', 'about −10⁻¹⁴ A'], ['−4.93 mA', '−4.93 mA'], ['0 A（完全沒有電流）', 'exactly 0 A'], ['+10⁻¹⁴ A', '+10⁻¹⁴ A']], a: 0,
      e: 'e<sup>−26.9</sup> ≈ 2×10⁻¹² 跟 1 比可以忽略，所以 i<sub>D</sub> ≈ −I<sub>S</sub> = −10⁻¹⁴ A。負號代表方向跟 i<sub>D</sub> 的定義相反；不是剛好 0。' },
    { zh: '順偏時（n = 1，300 K），v_D 每增加約多少，電流約增加 10 倍？',
      en: 'In forward bias (n = 1, 300 K), the diode current increases by about a factor of 10 for every increase in v_D of approximately?',
      o: [['60 mV', '60 mV'], ['0.7 V', '0.7 V'], ['26 mV', '26 mV'], ['6 mV', '6 mV']], a: 0,
      e: 'Δv = V<sub>T</sub> ln 10 = 0.026 × 2.303 ≈ 0.06 V（投影片 1-48、Fig 1.18）。26 mV 是 V<sub>T</sub> 本身，對應電流變 e ≈ 2.72 倍。' },
    { zh: '講義說「v_D > 0.1 V 時 i_D ≈ I_S e^(v_D/nV_T)」，這個 0.1 V 的意思是？',
      en: 'The slides state i_D ≈ I_S e^(v_D/nV_T) for v_D > 0.1 V. What does the 0.1 V mean?',
      o: [['−1 項可以忽略的數學門檻，不是導通電壓', 'the threshold above which the −1 term is negligible, not the turn-on voltage'],
          ['二極體的導通電壓', 'the turn-on voltage of the diode'],
          ['內建電壓', 'the built-in potential'],
          ['崩潰電壓', 'the breakdown voltage']], a: 0,
      e: 'e<sup>0.1/0.026</sup> ≈ 47，忽略 −1 只差約 2%。這時電流仍只有 pA 等級，離「導通」（mA）還很遠（投影片 1-47 旁註）。' },
    { zh: '理想二極體模型中，二極體導通時的特性為何？',
      en: 'In the ideal diode model, what characterizes the diode when it is conducting?',
      o: [['短路：v_D = 0，電流由外部電路決定', 'a short circuit: v_D = 0 and the current is set by the external circuit'],
          ['短路，而且電流無限大', 'a short circuit with infinite current'],
          ['斷路：i_D = 0', 'an open circuit: i_D = 0'],
          ['一顆 1 kΩ 的電阻', 'a 1 kΩ resistor']], a: 0,
      e: 'R<sub>F</sub> = V<sub>F</sub>/I<sub>F</sub> = 0 是因為 V<sub>F</sub> = 0，電流 = (V<sub>S</sub> − 0)/R 是有限值。投影片 1-49 在 I<sub>F</sub> 旁標 ∞ 是錯的（勘誤 ①）。' },
    { zh: '固定順向電流時，溫度升高，二極體電壓 v_D 如何變化？',
      en: 'At a constant forward current, how does the diode voltage v_D change as temperature increases?',
      o: [['下降，約 −2 mV/°C', 'it decreases by about 2 mV/°C'],
          ['上升，約 +2 mV/°C', 'it increases by about 2 mV/°C'],
          ['不變', 'it does not change'],
          ['下降，約 −60 mV/°C', 'it decreases by about 60 mV/°C']], a: 0,
      e: 'T ↑ → nᵢ ↑ → I<sub>S</sub> 暴增（每 5 °C 約翻倍），遠勝過 V<sub>T</sub> 的線性增加，所以同樣電流只要更小的電壓（投影片 1-50、1-51）。' },
    { zh: '二極體溫度計的原理是？',
      en: 'What is the principle of the diode thermometer?',
      o: [['讓電流固定，量 V_D；V_D 隨溫度近似線性下降', 'keep the current constant and measure V_D, which decreases almost linearly with temperature'],
          ['讓電壓固定，量 I_S', 'keep the voltage constant and measure I_S'],
          ['量二極體的電阻', 'measure the diode resistance'],
          ['量接面電容', 'measure the junction capacitance']], a: 0,
      e: '課本 1.6：15 V + 15 kΩ 讓 I<sub>D</sub> ≈ 1 mA 近似固定，V<sub>D</sub> ≈ 1.12 − 0.522(T/300)。量到的電壓越小，溫度越高。' }
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
    const verdict = pct >= 90 ? 'CH1 的 pn 接面整條線都通了：熱平衡 → 逆偏 → 順偏 → I–V → 溫度。可以往二極體電路前進了。'
      : pct >= 70 ? '主幹抓到了，把答錯的那幾題回去把對應的互動模組再玩一次。'
      : '建議從「偏壓實驗室」重新看一次，先把「坡壓低 → 注入 → 擴散電流 → 指數」這條鏈弄順。';
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
