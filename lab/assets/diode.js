/* ============================================================
   電子實習 第三章 二極體特性 —— 互動模組、可改數字例題、結果（含使用者 9/23 結報數據）、測驗
   二極體模型：用使用者 7 個順偏點擬合 V = ηV_T ln(I/I_S) + I·R_S → η = 1.78、I_S = 2.43 nA、R_S = 0.29 Ω
   PSpice 對照：D1N4002（IS = 14.11 nA、N = 1.984、RS = 33.89 mΩ）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, arrow, bindRange, clamp, lerp, liveExample } = E;
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  const TAU = Math.PI * 2, VT = 0.025865;
  /* 使用者 9/23 結報（1N4004、R1 = 1 kΩ） */
  const MY_F = [{ t: 0.1, vi: 0.605, a: 0.1041, vd: 0.494 }, { t: 0.2, vi: 0.704, a: 0.1767, vd: 0.515 }, { t: 0.5, vi: 1.105, a: 0.5012, vd: 0.562 },
    { t: 1, vi: 1.704, a: 1.0229, vd: 0.596 }, { t: 3, vi: 4.004, a: 3.095, vd: 0.650 }, { t: 5, vi: 6.203, a: 5.1043, vd: 0.675 }, { t: 10, vi: 10.503, a: 10.05, vd: 0.704 }];
  const MY_R = [{ t: 5, a: 0.000, vd: 5.002 }, { t: 10, a: 0.001, vd: 10.109 }, { t: 14.5, a: 0.002, vd: 13.999 }, { t: 15, a: 0.003, vd: 15.033 },
    { t: 15.5, a: 0.003, vd: 15.498 }, { t: 20, a: 0.003, vd: 19.997 }, { t: 25, a: 0.002, vd: 25.032 }, { t: 30, a: 0.003, vd: 29.990 }];
  const FIT = { n: 1.78, is: 2.43e-9, rs: 0.29 }, SP = { n: 1.984, is: 14.11e-9, rs: 0.03389 };
  window.__D3 = { MY_F, MY_R, FIT, SP };
  /* 二極體：給電流求電壓（含 R_S） */
  const vOf = (i, m) => i <= 0 ? 0 : m.n * VT * Math.log(i / m.is + 1) + i * m.rs;
  /* 串聯 R 的解：V_i = I R + V_D(I)，二分法找 I */
  function solve(Vi, R, m) {
    if (Vi <= 0) return { i: -m.is * (1 - Math.exp(Vi / (m.n * VT))), v: Vi };
    let lo = 0, hi = Vi / R;
    for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; (mid * R + vOf(mid, m) > Vi) ? hi = mid : lo = mid; }
    const i = (lo + hi) / 2; return { i, v: Vi - i * R };
  }
  window.__D3.solve = solve;
  const fmtI = i => { const a = Math.abs(i), s = i < 0 ? '−' : ''; return a >= 1e-3 ? s + (a * 1e3).toFixed(a >= 0.01 ? 2 : 3) + ' mA' : a >= 1e-6 ? s + (a * 1e6).toFixed(2) + ' μA' : s + (a * 1e9).toFixed(2) + ' nA'; };
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fillStyle = col; ctx.fill(); };
  function frame(ctx, x0, y0, x1, y1, o) {
    const X = v => lerp(x0, x1, (v - o.x0) / (o.x1 - o.x0)), Y = o.log ? v => lerp(y1, y0, (Math.log10(Math.max(v, 1e-9)) - o.y0) / (o.y1 - o.y0)) : v => lerp(y1, y0, (v - o.y0) / (o.y1 - o.y0));
    ctx.strokeStyle = C['line-soft'] || C.line; ctx.lineWidth = 1;
    (o.xt || []).forEach(v => { ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke(); label(ctx, X(v), y1 + 12, String(v), C['ink-3'], 10); });
    (o.yt || []).forEach(v => { const yy = o.log ? Y(v) : Y(v); ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke(); label(ctx, x0 - 6, yy, String(v), C['ink-3'], 10, 'right'); });
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
    if (o.xl) labelCJK(ctx, x1, y1 - 10, o.xl, C['ink-3'], 11, 'right');
    if (o.yl) labelCJK(ctx, x0 + 6, y0 + 2, o.yl, C['ink-3'], 11, 'left');
    return { X, Y };
  }
  const line = (ctx, pts, X, Y, col, lw, dash) => { ctx.strokeStyle = col; ctx.lineWidth = lw || 2; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))); ctx.stroke(); ctx.setLineDash([]); };

  /* ══════════════════════════════════════════════════════════
     ① 單向旋轉門：順偏／反偏，電流點跑多快
     ══════════════════════════════════════════════════════════ */
  (function dirLab() {
    const cv = document.getElementById('cv-dir'); if (!cv) return;
    let Vi = 5, rev = false, clock = 0;
    const dots = Array.from({ length: 18 }, (_, i) => i / 18);
    Stage(cv, { ratio: w => w < 560 ? 0.75 : 0.42, minH: 230, maxH: 330, draw(ctx, w, h, dt) {
      const s = rev ? { i: -FIT.is, v: Vi } : solve(Vi, 1000, FIT);
      const x0 = w * 0.12, x1 = w * 0.88, y0 = h * 0.22, y1 = h * 0.8, ym = (y0 + y1) / 2, xd = lerp(x0, x1, 0.7);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      /* 電池 */
      ctx.fillStyle = C.surface; ctx.fillRect(x0 - 14, ym - 12, 28, 24);
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 14, ym - 6); ctx.lineTo(x0 + 14, ym - 6); ctx.stroke(); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(x0 - 8, ym + 6); ctx.lineTo(x0 + 8, ym + 6); ctx.stroke();
      labelCJK(ctx, x0 + 18, ym, 'V<sub>i</sub> = ' + Vi.toFixed(1) + ' V', C.ink, 12, 'left', '700');
      /* 電阻 */
      const rx = lerp(x0, x1, 0.3); ctx.fillStyle = C.surface; ctx.fillRect(rx - 24, y0 - 8, 48, 16); ctx.lineWidth = 1.6; ctx.strokeRect(rx - 24, y0 - 7, 48, 14); labelCJK(ctx, rx, y0 - 18, '1 kΩ', C.ink, 12, 'center', '700');
      /* 二極體 */
      ctx.fillStyle = C.surface; ctx.fillRect(xd - 16, y0 - 15, 32, 30);
      const dir = rev ? -1 : 1, on = !rev && s.i > 0.05e-3;
      ctx.beginPath(); ctx.moveTo(xd - 12 * dir, y0 - 12); ctx.lineTo(xd - 12 * dir, y0 + 12); ctx.lineTo(xd + 12 * dir, y0); ctx.closePath(); ctx.fillStyle = on ? C.accent : C.surface; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.lineWidth = 2.8; ctx.beginPath(); ctx.moveTo(xd + 12 * dir, y0 - 12); ctx.lineTo(xd + 12 * dir, y0 + 12); ctx.stroke();
      labelCJK(ctx, xd, y0 - 26, rev ? '反偏：卡住' : on ? '順偏：導通' : '順偏但還沒過門檻', on ? C.accent : C['ink-2'], 12, 'center', '700');
      /* 電流點 */
      const speed = clamp(Math.abs(s.i) * 1e3 * 0.08, 0, 0.6), per = 2 * ((x1 - x0) + (y1 - y0));
      clock += dt * speed;
      if (speed > 0.002) dots.forEach(u => {
        let d = ((u + clock) % 1) * per, x, y;
        if (d < x1 - x0) { x = x0 + d; y = y0; } else if ((d -= x1 - x0) < y1 - y0) { x = x1; y = y0 + d; } else if ((d -= y1 - y0) < x1 - x0) { x = x1 - d; y = y1; } else { d -= x1 - x0; x = x0; y = y1 - d; }
        dot(ctx, x, y, 3.2, C.accent);
      });
      labelCJK(ctx, (x0 + x1) / 2, y1 + 22, 'I = ' + fmtI(s.i) + '　V<sub>D</sub> = ' + s.v.toFixed(3) + ' V', C.ink, 13, 'center', '700');
    } });
    function msg() {
      const s = rev ? { i: -FIT.is, v: Vi } : solve(Vi, 1000, FIT);
      setHTML('dr-i', fmtI(s.i)); setHTML('dr-v', s.v.toFixed(3) + ' V');
      setHTML('dr-msg', rev ? '反偏：電流只剩 I<sub>S</sub>（這顆約 2 nA），電阻沒壓降，<b>V<sub>D</sub> = V<sub>i</sub></b>。你量的 0.001～0.003 mA 是電表的最後一位。'
        : s.i < 0.05e-3 ? '電壓還沒推過門檻：電流不到 0.05 mA，幾乎都卡在二極體上。'
        : '導通了：V<sub>D</sub> 只有 ' + s.v.toFixed(2) + ' V，其餘 ' + (Vi - s.v).toFixed(2) + ' V 都給了 1 kΩ。');
    }
    bindRange('dr-vi', x => x.toFixed(1) + ' V', x => { Vi = x; msg(); });
    document.querySelectorAll('[data-dr]').forEach(b => b.addEventListener('click', () => { rev = b.dataset.dr === 'r'; document.querySelectorAll('[data-dr]').forEach(x => x.classList.toggle('solid', x === b)); msg(); }));
  })();

  /* ══════════════════════════════════════════════════════════
     ② 二極體方程式：η、T、I_S；疊上使用者的 7 個點
     ══════════════════════════════════════════════════════════ */
  (function ivLab() {
    const cv = document.getElementById('cv-iv'); if (!cv) return;
    let n = 2, T = 27, lgIs = Math.log10(2.77e-9), logY = false, st = null;
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.85 : 0.45, minH: 250, maxH: 360, draw(ctx, w, h) {
      const vt = (273 + T) / 11600, Is = Math.pow(10, lgIs);
      const x0 = Math.max(48, w * 0.09), x1 = w - 16;
      const F = logY ? frame(ctx, x0, 16, x1, h - 30, { x0: 0.3, x1: 0.8, y0: -3, y1: 2, log: true, xt: [0.4, 0.5, 0.6, 0.7, 0.8], yt: [0.001, 0.01, 0.1, 1, 10, 100], xl: 'V（V）', yl: 'I（mA，對數）' })
        : frame(ctx, x0, 16, x1, h - 30, { x0: 0.3, x1: 0.8, y0: 0, y1: 12, xt: [0.4, 0.5, 0.6, 0.7, 0.8], yt: [2, 4, 6, 8, 10, 12], xl: 'V（V）', yl: 'I（mA）' });
      const pts = []; for (let k = 0; k <= 250; k++) { const v = 0.3 + 0.5 * k / 250, i = Is * (Math.exp(v / (n * vt)) - 1) * 1e3; if (!logY && i > 13) break; if (logY && i > 120) break; pts.push([v, i]); }
      ctx.save(); ctx.beginPath(); ctx.rect(x0, 14, x1 - x0, h - 42); ctx.clip(); line(ctx, pts, F.X, F.Y, C.accent, 2.8); ctx.restore();
      MY_F.forEach(p => { ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(F.X(p.vd), F.Y(p.a), 5, 0, TAU); ctx.stroke(); });
      labelCJK(ctx, x1 - 4, 30, '藍線：公式　黑圈：你 9/23 量的', C['ink-2'], 11.5, 'right');
    } });
    function msg() {
      const vt = (273 + T) / 11600, Is = Math.pow(10, lgIs), v1 = n * vt * Math.log(1e-3 / Is), dec = n * vt * Math.LN10;
      setHTML('iv-vt', (vt * 1000).toFixed(2) + ' mV'); setHTML('iv-v1', v1.toFixed(3) + ' V'); setHTML('iv-dec', (dec * 1000).toFixed(0) + ' mV');
      const err = MY_F.reduce((s, p) => s + Math.abs(n * vt * Math.log(p.a * 1e-3 / Is) - p.vd), 0) / MY_F.length;
      setHTML('iv-msg', '電流每 ×10 要多 ' + (dec * 1000).toFixed(0) + ' mV；1 mA 時 V = ' + v1.toFixed(3) + ' V（你量 0.596 V）。' +
        (err < 0.006 ? '<b>藍線幾乎穿過你的每個點</b>，平均只差 ' + (err * 1000).toFixed(1) + ' mV。' : '跟你的點平均差 ' + (err * 1000).toFixed(0) + ' mV —— 按「套用擬合值」（η ≈ 1.80、I<sub>S</sub> ≈ 2.8 nA）。'));
      st.redraw();
    }
    bindRange('iv-n', x => x.toFixed(2), x => { n = x; msg(); });
    bindRange('iv-t', x => x + ' °C', x => { T = x; msg(); });
    bindRange('iv-is', x => (Math.pow(10, x) * 1e9).toFixed(2) + ' nA', x => { lgIs = x; msg(); });
    const b = document.getElementById('iv-log'); if (b) b.addEventListener('click', () => { logY = !logY; b.textContent = logY ? '切換：線性刻度' : '切換：對數刻度'; msg(); });
    const fit = document.getElementById('iv-fit'); if (fit) fit.addEventListener('click', () => {
      [['iv-n', 1.80], ['iv-t', 27], ['iv-is', Math.log10(2.77e-9)]].forEach(([id, v]) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input')); });
    });
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 結果：我的結報數據（預設）＋可修改；順偏／反偏圖
     ══════════════════════════════════════════════════════════ */
  (function results() {
    const tf = document.querySelector('#meas-f tbody'), tr = document.querySelector('#meas-r tbody'); if (!tf) return;
    let store = null; const LS = 'ee-lab-diode-meas';
    const getAll = () => { if (store) return store.all(); try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } };
    const put = (id, obj) => { if (store) { obj ? store.put(id, obj) : store.del(id); return; } try { const a = getAll(); if (obj) a[id] = obj; else delete a[id]; localStorage.setItem(LS, JSON.stringify(a)); } catch (e) {} };
    const inp = (k, v, lab) => '<input type="number" inputmode="decimal" step="any" data-k="' + k + '" data-def="' + v + '" aria-label="' + lab + '">';
    MY_F.forEach((p, i) => tf.insertAdjacentHTML('beforeend', '<tr data-id="f' + i + '"><td>' + p.t + ' mA</td><td>' + inp('vi', p.vi, 'Vi') + '</td><td>' + inp('a', p.a, 'A1 mA') + '</td><td>' + inp('vd', p.vd, 'Vd') + '</td><td class="num fit">—</td><td class="num rr">—</td></tr>'));
    MY_R.forEach((p, i) => tr.insertAdjacentHTML('beforeend', '<tr data-id="r' + i + '"><td>' + p.t + ' V</td><td>' + inp('a', p.a, 'A1 mA') + '</td><td>' + inp('vd', p.vd, 'Vd') + '</td></tr>'));
    const val = (row, k) => { const el = row.querySelector('[data-k="' + k + '"]'); return el && el.value !== '' ? parseFloat(el.value) : NaN; };
    function calc(row) {
      if (row.dataset.id[0] !== 'f') return;
      const a = val(row, 'a'), vd = val(row, 'vd'), vi = val(row, 'vi');
      row.querySelector('.fit').textContent = a > 0 ? vOf(a * 1e-3, FIT).toFixed(3) : '—';
      row.querySelector('.rr').textContent = a > 0 && vi > 0 && !isNaN(vd) ? ((vi - vd) / a).toFixed(2) : '—';
    }
    function fill() {
      const all = getAll();
      [tf, tr].forEach(t => t.querySelectorAll('tr').forEach(row => {
        const it = all[row.dataset.id];
        row.querySelectorAll('input').forEach(el => { if (document.activeElement === el) return; el.value = it && it[el.dataset.k] !== undefined ? it[el.dataset.k] : el.dataset.def; });
        calc(row);
      }));
      if (window.__d3plot) window.__d3plot();
    }
    [tf, tr].forEach(t => t.addEventListener('input', e => {
      const row = e.target.closest('tr'); if (!row) return;
      const o = {}; row.querySelectorAll('input').forEach(el => { o[el.dataset.k] = el.value; }); put(row.dataset.id, o); calc(row); if (window.__d3plot) window.__d3plot();
    }));
    document.getElementById('meas-reset').addEventListener('click', () => { if (!confirm('改回結報的原始數據？')) return; MY_F.forEach((p, i) => put('f' + i, null)); MY_R.forEach((p, i) => put('r' + i, null)); fill(); });
    window.__d3rows = () => ({
      f: Array.prototype.map.call(tf.querySelectorAll('tr'), r => [val(r, 'vd'), val(r, 'a')]),
      r: Array.prototype.map.call(tr.querySelectorAll('tr'), r => [val(r, 'vd'), val(r, 'a')])
    });
    fill();
    window.addEventListener('load', () => { if (!window.__SYNC) return; store = window.__SYNC.open('lab_diode_meas'); store.on(fill); fill(); });

    const cv = document.getElementById('cv-res'); if (!cv) return;
    const st = Stage(cv, { animate: false, ratio: w => w < 560 ? 1.2 : 0.42, minH: 280, maxH: 420, draw(ctx, w, h) {
      const narrow = w < 560, d = (window.__d3rows && window.__d3rows()) || { f: [], r: [] };
      const bx = narrow ? [[46, 18, w - 14, h * 0.46], [46, h * 0.58, w - 14, h - 28]] : [[46, 18, w * 0.55, h - 28], [w * 0.64, 18, w - 14, h - 28]];
      const A = frame(ctx, bx[0][0], bx[0][1], bx[0][2], bx[0][3], { x0: 0.4, x1: 0.75, y0: 0, y1: 11, xt: [0.45, 0.55, 0.65, 0.75], yt: [2, 4, 6, 8, 10], xl: 'V<sub>d</sub>（V）', yl: 'A1（mA）' });
      const pf = [], ps = []; for (let k = 0; k <= 120; k++) { const i = 11e-3 * Math.pow(k / 120, 2) + 1e-6; pf.push([vOf(i, FIT), i * 1e3]); ps.push([vOf(i, SP), i * 1e3]); }
      line(ctx, ps, A.X, A.Y, C['ink-3'], 1.6, [5, 4]); line(ctx, pf, A.X, A.Y, C.accent, 2.4);
      d.f.forEach(p => { if (!isNaN(p[0]) && !isNaN(p[1])) dot(ctx, A.X(p[0]), A.Y(p[1]), 5, C.ink); });
      labelCJK(ctx, bx[0][0] + 8, bx[0][1] + 16, '黑點：你的數據　藍：擬合（η 1.78）　虛線：PSpice D1N4002', C['ink-2'], 10.5, 'left');
      const B = frame(ctx, bx[1][0], bx[1][1], bx[1][2], bx[1][3], { x0: 0, x1: 32, y0: 0, y1: 0.01, xt: [10, 20, 30], yt: [0.005, 0.01], xl: '反向 V<sub>d</sub>（V）', yl: 'A1（mA）' });
      d.r.forEach(p => { if (!isNaN(p[0]) && !isNaN(p[1])) dot(ctx, B.X(p[0]), B.Y(p[1]), 5, C.ink); });
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.warn; ctx.beginPath(); ctx.moveTo(B.X(0), B.Y(0.001)); ctx.lineTo(B.X(32), B.Y(0.001)); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, B.X(31), B.Y(0.001) - 9, '電表最後一位 0.001 mA', C.warn, 10.5, 'right', '700');
    } });
    window.__d3plot = () => st.redraw();
  })();

  /* ══════════════════════════════════════════════════════════
     ④ PSpice DC Sweep（講義 p.7：V1 → 100 Ω → D1N4002，0～10 V）
     ══════════════════════════════════════════════════════════ */
  (function pspice() {
    const cv = document.getElementById('cv-ps'); if (!cv) return;
    let V = 5, st = null;
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.75 : 0.4, minH: 230, maxH: 330, draw(ctx, w, h) {
      const x0 = Math.max(48, w * 0.09), x1 = w - 16;
      const F = frame(ctx, x0, 16, x1, h - 30, { x0: 0, x1: 1, y0: 0, y1: 100, xt: [0.2, 0.4, 0.6, 0.8, 1], yt: [20, 40, 60, 80, 100], xl: 'V(D1:1)（V）', yl: 'I(D1)（mA）' });
      const pts = []; for (let k = 0; k <= 200; k++) { const s = solve(10 * k / 200, 100, SP); pts.push([s.v, s.i * 1e3]); }
      line(ctx, pts, F.X, F.Y, C.accent, 2.6);
      const s = solve(V, 100, SP); dot(ctx, F.X(s.v), F.Y(s.i * 1e3), 6, C.ink);
      labelCJK(ctx, F.X(s.v) - 10, F.Y(s.i * 1e3) - 12, 'V1 = ' + V.toFixed(2) + ' V → (' + s.v.toFixed(3) + ' V, ' + (s.i * 1e3).toFixed(1) + ' mA)', C.ink, 11.5, 'right', '700');
    } });
    function msg() { const s = solve(V, 100, SP); setHTML('ps-msg', 'V1 = ' + V.toFixed(2) + ' V：二極體 ' + s.v.toFixed(3) + ' V、電流 ' + (s.i * 1e3).toFixed(2) + ' mA。掃到 10 V 時約 0.805 V、92 mA —— 曲線右邊越來越像一面牆。'); st.redraw(); }
    bindRange('ps-v', x => x.toFixed(2) + ' V', x => { V = x; msg(); });
  })();

  /* ── 電路圖 ── */
  (function schems() {
    const S = window.__SCH; if (!S) return;
    const mk = (id, rev) => { const el = document.getElementById(id); if (!el) return; el.innerHTML = S.svg(330, 190, [
      S.vs(40, 40, 150, 'V1 0~30V'), S.r(40, 40, 120, 40, 'R1 1kΩ'), S.w('120,40', '150,40'),
      '<circle cx="170" cy="40" r="13" fill="none"/>', S.t(170, 44, 'A', 'middle', ' font-weight="700"'), S.t(170, 22, 'DCA（A1）', 'middle', ' font-size="10.5"'), S.w('183,40', '260,40'),
      rev ? S.d(260, 150, 260, 40, 'D1 1N4004') : S.d(260, 40, 260, 150, 'D1 1N4004'), S.w('260,150', '40,150'), S.gnd(150, 150),
      S.dot(220, 40), S.dot(220, 150), S.w('220,40', '220,78'), '<circle cx="220" cy="95" r="13" fill="none"/>', S.t(220, 99, 'V', 'middle', ' font-weight="700"'), S.w('220,108', '220,150'), S.t(205, 128, 'DCV（Vd）', 'end', ' font-size="10.5"')
    ]); };
    mk('schem-f', false); mk('schem-r', true);
    const p = document.getElementById('schem-ps');
    if (p) p.innerHTML = S.svg(300, 170, [S.vs(40, 40, 140, 'V1 0→10V'), S.r(40, 40, 140, 40, 'R4 100Ω'), S.d(140, 40, 240, 40, 'D1 D1N4002'), S.w('240,40', '240,140', '40,140'), S.gnd(140, 140)]);
  })();
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, { C, label, labelCJK, liveExample } = E;
  const D3 = window.__D3, VT0 = 0.025865;
  function bars(ctx, w, h, rows, unit) {
    const x0 = Math.max(w * 0.3, 110), x1 = w * 0.88, mx = Math.max(1e-9, ...rows.map(r => Math.abs(r[1])));
    rows.forEach(([nm, v, col], k) => { const y = h * ((k + 0.6) / (rows.length + 0.2)), len = Math.max(2, (x1 - x0) * Math.abs(v) / mx);
      ctx.fillStyle = col; ctx.fillRect(x0, y - 8, len, 16); labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700'); label(ctx, x0 + len + 6, y, v.toFixed(3) + unit, col, 10.5, 'left', '700'); });
  }

  /* ── 例題 A：從 Vi、Vd 算電流（你的 3 mA 那一點） ── */
  liveExample('#ex-fwd', {
    title: '例題 · 你的 3 mA 那一點：用 V<sub>i</sub>、V<sub>d</sub> 算電流',
    ratio: 0.22, minH: 120, maxH: 160,
    givens: [
      { id: 'xa-vi', label: '電源 V<sub>i</sub>', min: 0.5, max: 12, step: 0.001, value: 4.004, fmt: v => v.toFixed(3) + ' V' },
      { id: 'xa-vd', label: '二極體 V<sub>d</sub>', min: 0.4, max: 0.8, step: 0.001, value: 0.650, fmt: v => v.toFixed(3) + ' V' },
      { id: 'xa-r', label: '電阻 R', min: 0.5, max: 2, step: 0.01, value: 1, fmt: v => v.toFixed(2) + ' kΩ' },
      { id: 'xa-a', label: '電流表讀到', min: 0.05, max: 12, step: 0.0001, value: 3.095, fmt: v => v.toFixed(3) + ' mA' }
    ],
    compute: g => { const vi = g['xa-vi'], vd = g['xa-vd'], R = g['xa-r'], a = g['xa-a'], i = (vi - vd) / R; return { vi, vd, R, a, i, diff: (i - a) / a * 100, rEff: (vi - vd) / a }; },
    question: (g, r) => '順偏量到 <b>V<sub>i</sub> = ' + r.vi.toFixed(3) + ' V</b>、<b>V<sub>d</sub> = ' + r.vd.toFixed(3) + ' V</b>，電阻標 <b>' + r.R.toFixed(2) + ' kΩ</b>。用講義的 I = (V − V<sub>D</sub>)/R 算電流，跟電流表的 ' + r.a.toFixed(3) + ' mA 比。',
    questionEn: (g, r) => 'With V<sub>i</sub> = ' + r.vi.toFixed(3) + ' V, V<sub>d</sub> = ' + r.vd.toFixed(3) + ' V and R = ' + r.R.toFixed(2) + ' kΩ, compute I = (V − V<sub>D</sub>)/R and compare it with the ammeter reading of ' + r.a.toFixed(3) + ' mA.',
    steps: (g, r) => [
      { t: 'Step 1　電阻上的電壓。', eq: 'V<sub>R</sub> = V<sub>i</sub> − V<sub>d</sub> = ' + r.vi.toFixed(3) + ' − ' + r.vd.toFixed(3) + ' = ' + (r.vi - r.vd).toFixed(3) + ' V' },
      { t: 'Step 2　電流。', eq: 'I = V<sub>R</sub>/R = ' + (r.vi - r.vd).toFixed(3) + ' / ' + r.R.toFixed(2) + 'k = ' + r.i.toFixed(3) + ' mA' },
      { t: 'Step 3　跟電流表比。', eq: '差 ' + (r.diff >= 0 ? '+' : '') + r.diff.toFixed(1) + ' %　｜　反推 R<sub>實際</sub> = ' + r.rEff.toFixed(3) + ' kΩ' },
      { t: 'Step 4　解讀。', note: Math.abs(r.diff) < 3 ? '差不到 3%，量測一致。' : '差了 ' + Math.abs(r.diff).toFixed(0) + '%：反推電阻 ' + r.rEff.toFixed(2) + ' kΩ —— 電阻有 ±5% 誤差，<b>電流表串進去也有內阻</b>（幾 Ω～幾十 Ω），都會讓實際的「R」變大。你的 7 個點大多算出 1.07～1.08 kΩ，很一致。' }
    ],
    answer: (g, r) => 'I = ' + r.i.toFixed(3) + ' mA（電流表 ' + r.a.toFixed(3) + ' mA，差 ' + r.diff.toFixed(1) + '%）',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['公式算的', r.i, C['ink-2']], ['電流表讀的', r.a, C.accent]], ' mA')
  });

  /* ── 例題 B：二極體方程式 ── */
  liveExample('#ex-eq', {
    title: '例題 · 用二極體方程式算電流',
    ratio: 0.22, minH: 120, maxH: 160,
    givens: [
      { id: 'xb-v', label: '電壓 V', min: -1, max: 0.8, step: 0.001, value: 0.65, fmt: v => v.toFixed(3) + ' V' },
      { id: 'xb-n', label: 'η', min: 1, max: 2, step: 0.01, value: 1.80, fmt: v => v.toFixed(2) },
      { id: 'xb-is', label: 'I<sub>S</sub>', min: -15, max: -6, step: 0.01, value: Math.log10(2.77e-9), fmt: v => (Math.pow(10, v)).toExponential(2).replace('e', '×10<sup>') + '</sup> A' },
      { id: 'xb-t', label: '溫度 T', min: -20, max: 100, step: 1, value: 27, fmt: v => v + ' °C' }
    ],
    compute: g => { const V = g['xb-v'], n = g['xb-n'], Is = Math.pow(10, g['xb-is']), T = g['xb-t'], vt = (273 + T) / 11600, x = V / (n * vt); return { V, n, Is, T, vt, x, I: Is * (Math.exp(x) - 1) }; },
    question: (g, r) => '二極體 <b>I<sub>S</sub> = ' + r.Is.toExponential(2).replace('e', '×10<sup>') + '</sup> A、η = ' + r.n.toFixed(2) + '</b>，溫度 ' + r.T + ' °C，加 <b>V = ' + r.V.toFixed(3) + ' V</b>。電流多少？',
    questionEn: (g, r) => 'A diode has I<sub>S</sub> = ' + r.Is.toExponential(2).replace('e', '×10<sup>') + '</sup> A and η = ' + r.n.toFixed(2) + ' at ' + r.T + ' °C. Find the current at V = ' + r.V.toFixed(3) + ' V.',
    steps: (g, r) => [
      { t: 'Step 1　熱電壓。', eq: 'V<sub>T</sub> = (273 + ' + r.T + ')/11600 = ' + (r.vt * 1000).toFixed(2) + ' mV' },
      { t: 'Step 2　指數。', eq: 'V/(ηV<sub>T</sub>) = ' + r.V.toFixed(3) + '/(' + r.n.toFixed(2) + ' × ' + r.vt.toFixed(5) + ') = ' + r.x.toFixed(2) },
      { t: 'Step 3　代進公式。', eq: 'I = I<sub>S</sub>(e<sup>' + r.x.toFixed(2) + '</sup> − 1) = ' + (Math.abs(r.I) >= 1e-3 ? (r.I * 1e3).toFixed(3) + ' mA' : Math.abs(r.I) >= 1e-6 ? (r.I * 1e6).toFixed(3) + ' μA' : (r.I * 1e9).toFixed(3) + ' nA') },
      { t: 'Step 4　解讀。', note: r.V < 0 ? '反偏：e 的次方趨近 0，I ≈ −I<sub>S</sub>，極小。' : r.x < 4 ? '電壓太小，還在門檻下面，電流微乎其微。' : '順偏、過了門檻，「−1」可以不管，電流隨電壓指數成長。' + (Math.abs(r.V - 0.65) < 0.003 && Math.abs(r.n - 1.80) < 0.01 ? '這組參數是用你的數據擬合的，所以會接近你量的 3.10 mA。' : '') }
    ],
    answer: (g, r) => 'I ≈ ' + (Math.abs(r.I) >= 1e-3 ? (r.I * 1e3).toFixed(3) + ' mA' : Math.abs(r.I) >= 1e-6 ? (r.I * 1e6).toFixed(3) + ' μA' : (r.I * 1e9).toFixed(3) + ' nA')
  });

  /* ── 例題 C：每 ×10 多幾 mV，反推 η ── */
  liveExample('#ex-dec', {
    title: '例題 · 從兩個點反推 η',
    ratio: 0.22, minH: 120, maxH: 160,
    givens: [
      { id: 'xc-i1', label: 'I<sub>1</sub>', min: 0.05, max: 5, step: 0.0001, value: 0.1041, fmt: v => v.toFixed(4) + ' mA' },
      { id: 'xc-v1', label: 'V<sub>1</sub>', min: 0.3, max: 0.8, step: 0.001, value: 0.494, fmt: v => v.toFixed(3) + ' V' },
      { id: 'xc-i2', label: 'I<sub>2</sub>', min: 0.5, max: 20, step: 0.0001, value: 1.0229, fmt: v => v.toFixed(4) + ' mA' },
      { id: 'xc-v2', label: 'V<sub>2</sub>', min: 0.3, max: 0.9, step: 0.001, value: 0.596, fmt: v => v.toFixed(3) + ' V' }
    ],
    compute: g => { const i1 = g['xc-i1'], v1 = g['xc-v1'], i2 = g['xc-i2'], v2 = g['xc-v2'], ln = Math.log(i2 / i1), n = (v2 - v1) / (VT0 * ln); return { i1, v1, i2, v2, ln, n, dec: n * VT0 * Math.LN10 }; },
    question: (g, r) => '你量到 <b>' + r.i1.toFixed(4) + ' mA → ' + r.v1.toFixed(3) + ' V</b>、<b>' + r.i2.toFixed(4) + ' mA → ' + r.v2.toFixed(3) + ' V</b>。用二極體方程式反推 η（27 °C）。',
    questionEn: (g, r) => 'Measured points: ' + r.i1.toFixed(4) + ' mA at ' + r.v1.toFixed(3) + ' V and ' + r.i2.toFixed(4) + ' mA at ' + r.v2.toFixed(3) + ' V. Find η at 27 °C.',
    steps: (g, r) => [
      { t: 'Step 1　兩點相除，I<sub>S</sub> 消掉。', eq: 'I<sub>2</sub>/I<sub>1</sub> = e<sup>(V<sub>2</sub> − V<sub>1</sub>)/ηV<sub>T</sub></sup>' },
      { t: 'Step 2　取 ln、解 η。', eq: 'η = (V<sub>2</sub> − V<sub>1</sub>) / (V<sub>T</sub> ln(I<sub>2</sub>/I<sub>1</sub>)) = ' + (r.v2 - r.v1).toFixed(3) + ' / (0.02587 × ' + r.ln.toFixed(3) + ') = ' + r.n.toFixed(2) },
      { t: 'Step 3　換成「每 × 10 多幾 mV」。', eq: 'ηV<sub>T</sub> ln 10 = ' + (r.dec * 1000).toFixed(0) + ' mV／decade' },
      { t: 'Step 4　解讀。', note: r.n < 1 || r.n > 2.3 ? 'η 跑出 1～2 的範圍，可能讀錯一個點，或電流太大時 R<sub>S</sub> 的壓降混進來了。' : 'η = ' + r.n.toFixed(2) + '，在 1～2 之間。講義說矽取 2，實際元件通常 1～2；你這顆接近 1.8。' }
    ],
    answer: (g, r) => 'η ≈ ' + r.n.toFixed(2) + '（每 ×10 約 ' + (r.dec * 1000).toFixed(0) + ' mV）'
  });
})();

/* ============================================================
   小測驗
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '二極體最重要的特性是？', en: 'What is the key property of a diode?',
      o: [['電流只能單方向流動', 'current flows in only one direction'], ['電阻固定', 'its resistance is constant'], ['可以儲存電荷', 'it stores charge'], ['可以放大訊號', 'it amplifies signals']], a: 0,
      e: '講義 p.2：二極體是允許電流單方向流動的雙端元件。' },
    { zh: '二極體實物上有色環的那一端是？', en: 'On a real diode, the banded end is the:',
      o: [['陰極（N 側）', 'cathode (n side)'], ['陽極（P 側）', 'anode (p side)'], ['接地端', 'ground'], ['沒有意義', 'meaningless']], a: 0,
      e: '色環＝符號上那條槓＝陰極 K。順偏時陽極接正、陰極接負。' },
    { zh: '反偏時，二極體兩端電壓約為？（串 1 kΩ）', en: 'Under reverse bias with a series 1 kΩ, the diode voltage is about:',
      o: [['等於電源電壓', 'equal to the supply voltage'], ['0.7 V', '0.7 V'], ['0 V', '0 V'], ['電源電壓的一半', 'half of the supply']], a: 0,
      e: '反偏電流 ≈ 0，電阻沒壓降，電壓全落在二極體上（講義圖 3.4(b) V<sub>D</sub> = V；你量 20 V → 19.997 V）。' },
    { zh: '矽二極體的切入電壓約為？', en: 'The cut-in voltage of a silicon diode is about:',
      o: [['0.6 V', '0.6 V'], ['0.2 V', '0.2 V'], ['1.5 V', '1.5 V'], ['5 V', '5 V']], a: 0,
      e: '講義 p.4：矽 0.6 V、鍺 0.2 V。' },
    { zh: '二極體方程式 I = I_S(e^(V/ηV_T) − 1) 中，I_S 代表？', en: 'In the diode equation, I_S is the:',
      o: [['逆向飽和電流', 'reverse saturation current'], ['順向最大電流', 'maximum forward current'], ['短路電流', 'short-circuit current'], ['崩潰電流', 'breakdown current']], a: 0,
      e: '反偏時 e 項 → 0，I → −I<sub>S</sub>；I<sub>S</sub> 很小，矽約 nA 以下。' },
    { zh: '室溫 27 °C 時，V_T = (273 + T)/11600 約為？', en: 'At 27 °C, V_T = (273 + T)/11600 is about:',
      o: [['26 mV', '26 mV'], ['0.6 V', '0.6 V'], ['2.6 V', '2.6 V'], ['11.6 mV', '11.6 mV']], a: 0,
      e: '300/11600 = 0.0259 V ≈ 26 mV。' },
    { zh: '你的數據：電流從 0.1 mA 到 10 mA，電壓只多約 0.21 V。這說明順偏時電流與電壓是？', en: 'Current rose 100× while voltage rose only 0.21 V. This shows the forward current is:',
      o: [['指數關係', 'exponential in voltage'], ['線性關係', 'linear in voltage'], ['平方關係', 'quadratic'], ['與電壓無關', 'independent of voltage']], a: 0,
      e: '每 ×10 約多 0.1 V，對數座標上是一條直線 → 指數。' },
    { zh: '量二極體電流時，三用電表要？', en: 'To measure the diode current, the multimeter must be:',
      o: [['切 DCA，串聯在迴路中', 'on DCA, in series with the circuit'], ['切 DCV，並聯在二極體兩端', 'on DCV, across the diode'], ['切 Ω 檔', 'on the Ω range'], ['切 ACA，並聯', 'on ACA, in parallel']], a: 0,
      e: '電流要穿過電表才量得到，所以串聯；電流檔並聯等於短路，會燒保險絲。' },
    { zh: '為什麼電路要串一顆 1 kΩ？', en: 'Why is a 1 kΩ resistor placed in series?',
      o: [['限流，避免二極體導通後電流過大', 'to limit the current once the diode conducts'], ['讓二極體反偏', 'to reverse-bias the diode'], ['提高切入電壓', 'to raise the cut-in voltage'], ['量電壓用', 'for measuring voltage']], a: 0,
      e: '導通後二極體只吃約 0.7 V，其餘電壓要有東西扛：I = (V<sub>i</sub> − V<sub>d</sub>)/R。' },
    { zh: 'PSpice 要畫出 I-V 曲線，分析類型選？', en: 'To plot the I-V curve in PSpice, choose which analysis?',
      o: [['DC Sweep', 'DC Sweep'], ['Time Domain（Transient）', 'Time Domain (Transient)'], ['AC Sweep', 'AC Sweep'], ['Bias Point', 'Bias Point']], a: 0,
      e: '講義 p.8：DC Sweep，掃電壓源 V1；畫完把 X 軸改成二極體電壓 V(D1:1)。' }
  ];
  let i = 0, score = 0, answered = false, ord = [];
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  const sub = s => s.replace(/e\^\(([^)]*)\)/g, 'e<sup>$1</sup>').replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>');
  function render() {
    const q = Q[i];
    host.innerHTML = '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div><div class="quiz-body"><div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
      '<div class="q-text">' + sub(q.zh) + '</div><div class="q-en">' + sub(q.en) + '</div><div class="opts"></div><div class="explain" hidden></div></div>' +
      '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span><button class="btn" id="q-next" hidden>下一題 →</button></div>';
    const opts = host.querySelector('.opts'); ord = shuffle(q.o.length);
    ord.forEach((src, k) => { const b = document.createElement('button'); b.className = 'opt'; b.type = 'button'; b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + sub(q.o[src][0]) + '<span class="en">' + sub(q.o[src][1]) + '</span></span>'; b.addEventListener('click', () => pick(k)); opts.appendChild(b); });
    host.querySelector('#q-next').addEventListener('click', () => { i++; i < Q.length ? render() : done(); });
    answered = false;
  }
  function pick(k) {
    if (answered) return; answered = true;
    const q = Q[i], A = ord.indexOf(q.a), btns = Array.prototype.slice.call(host.querySelectorAll('.opt'));
    btns.forEach((b, idx) => { b.disabled = true; if (idx === A) b.classList.add('right'); });
    if (k === A) score++; else btns[k].classList.add('wrong');
    const ex = host.querySelector('.explain'); ex.hidden = false; ex.innerHTML = '<b>' + (k === A ? '答對了。' : '正確答案是 ' + 'ABCD'[A] + '。') + '</b> ' + q.e;
    host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
    const nx = host.querySelector('#q-next'); nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →'; nx.classList.add('solid');
  }
  function done() {
    const pct = Math.round(score / Q.length * 100);
    host.innerHTML = '<div class="bar"><i style="width:100%"></i></div><div class="quiz-body" style="padding-bottom:18px"><div class="q-no">測驗結果</div><div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + pct + '%）</div>' +
      '<p style="color:var(--ink-2);margin:0 0 14px">' + (pct >= 80 ? '二極體特性通了，接著看整流器。' : '回去把故事模式第 6～9 個畫面（曲線、門檻、指數）再看一次。') + '</p><button class="btn solid" id="q-again" type="button">再測一次</button></div>';
    host.querySelector('#q-again').addEventListener('click', () => { i = 0; score = 0; render(); });
  }
  render();
})();

/* 側欄高亮 + 主題 */
(function () {
  'use strict';
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
