/* ============================================================
   電子實習 第六章 稽納二極體 —— 互動模組、可改數字例題、結果、測驗
   稽納模型：PSpice D1N5231 的崩潰參數（BV = 5.1、IBV = 27.721 mA、NBV = 1.1779、IBVL = 1.1646 mA、NBVL = 21.894）
   模擬數字與方法見 lab/docs/CONTENT_MAP.md
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, arrow, bindRange, clamp, lerp, liveExample } = E;
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  const VT = 0.025865, TAU = Math.PI * 2;
  /* 稽納反向電流（A），vr = 反向電壓（V） */
  const iz = vr => vr <= 0 ? 0 : 27.721e-3 * Math.exp((vr - 5.1) / (1.1779 * VT)) + 1.1646e-3 * Math.exp((vr - 5.1) / (21.894 * VT));
  const bis = (f, a, b, n) => { let fa = f(a); for (let k = 0; k < (n || 50); k++) { const m = (a + b) / 2, fm = f(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; } return (a + b) / 2; };
  /* 穩壓電路的直流解：Vs —R— 節點（稽納 ∥ RL）；RL = Infinity 表示沒接負載 */
  function solve(Vs, R, RL) {
    if (Vs <= 0) return { vo: 0, iR: 0, iZ: 0, iL: 0 };
    const vo = bis(x => (Vs - x) / R - iz(x) - (isFinite(RL) ? x / RL : 0), 0, Vs);
    const iL = isFinite(RL) ? vo / RL : 0;
    return { vo, iR: (Vs - vo) / R, iZ: iz(vo), iL };
  }
  window.__zsolve = solve;
  const fmtR = r => !isFinite(r) ? '∞（不接）' : r >= 1000 ? (r / 1000).toFixed(r >= 10000 ? 0 : r % 1000 ? 2 : 0) + ' kΩ' : r.toFixed(0) + ' Ω';
  const mA = i => (i * 1e3).toFixed(i * 1e3 >= 10 ? 1 : 2) + ' mA';
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fillStyle = col; ctx.fill(); };
  function frame(ctx, x0, y0, x1, y1, o) {
    const X = v => lerp(x0, x1, (v - o.x0) / (o.x1 - o.x0)), Y = v => lerp(y1, y0, (v - o.y0) / (o.y1 - o.y0));
    ctx.strokeStyle = C['line-soft'] || C.line; ctx.lineWidth = 1;
    (o.xt || []).forEach(v => { ctx.beginPath(); ctx.moveTo(X(v), y0); ctx.lineTo(X(v), y1); ctx.stroke(); label(ctx, X(v), y1 + 12, String(v), C['ink-3'], 10); });
    (o.yt || []).forEach(v => { ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke(); label(ctx, x0 - 6, Y(v), String(v), C['ink-3'], 10, 'right'); });
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
    if (o.xl) labelCJK(ctx, x1, y1 - 10, o.xl, C['ink-3'], 11, 'right');
    if (o.yl) labelCJK(ctx, x0 + 6, y0 + 2, o.yl, C['ink-3'], 11, 'left');
    return { X, Y };
  }
  const line = (ctx, pts, X, Y, col, lw, dash) => { ctx.strokeStyle = col; ctx.lineWidth = lw || 2; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))); ctx.stroke(); ctx.setLineDash([]); };

  /* ══════════════════════════════════════════════════════════
     ① 穩壓前後：輸入晃、負載換，輸出幾乎不動
     ══════════════════════════════════════════════════════════ */
  (function regDemo() {
    const cv = document.getElementById('cv-reg'); if (!cv) return;
    let rip = 1.3, heavy = false, clock = 0, play = true;
    const vin = t => 9.3 - rip * ((t * 2 + 0.25) % 1);   /* 鋸齒漣波：跟 V2 一樣，峰值 9.3 V */
    Stage(cv, { ratio: w => w < 560 ? 0.7 : 0.4, minH: 240, maxH: 340, draw(ctx, w, h, dt) {
      if (play) clock += dt * 0.25;
      const x0 = Math.max(40, w * 0.07), x1 = w - 14, y0 = 16, y1 = h - 28;
      const F = frame(ctx, x0, y0, x1, y1, { x0: 0, x1: 2, y0: 0, y1: 10, yt: [2, 5, 8], xl: '時間（兩個週期）', yl: 'V' });
      const R = 470, RL = heavy ? 1000 : 10000, ptsI = [], ptsO = [];
      for (let n = 0; n <= 160; n++) { const t = n / 80, v = vin(t); ptsI.push([t, v]); ptsO.push([t, solve(v, R, RL).vo]); }
      line(ctx, ptsI, F.X, F.Y, C['ink-3'], 1.8, [5, 4]);
      line(ctx, ptsO, F.X, F.Y, C.accent, 2.8);
      const tc = clock % 2, vi = vin(tc), vo = solve(vi, R, RL).vo;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(F.X(tc), y0); ctx.lineTo(F.X(tc), y1); ctx.stroke();
      dot(ctx, F.X(tc), F.Y(vi), 4.5, C['ink-2']); dot(ctx, F.X(tc), F.Y(vo), 5.5, C.accent);
      labelCJK(ctx, x1 - 4, F.Y(9.6), '虛線：穩壓前（濾波完的 V2）', C['ink-2'], 11.5, 'right');
      labelCJK(ctx, x1 - 4, F.Y(4.0), '實線：穩壓後 V<sub>o</sub>', C.accent, 12, 'right', '700');
    } });
    function msg() {
      const R = 470, RL = heavy ? 1000 : 10000;
      const a = solve(9.3, R, RL).vo, b = solve(9.3 - rip, R, RL).vo;
      setHTML('rg-in', rip.toFixed(2) + ' V');
      setHTML('rg-out', ((a - b) * 1000).toFixed(1) + ' mV');
      setHTML('rg-msg', '輸入晃 ' + rip.toFixed(2) + ' V，輸出只晃 ' + ((a - b) * 1000).toFixed(1) + ' mV（' + (rip > 0 ? '縮小 ' + Math.round(rip / Math.max(a - b, 1e-4)) + ' 倍' : '—') + '）。' +
        (heavy ? '負載 1 kΩ（吃比較多電流），輸出 ' + a.toFixed(2) + ' V —— 稽納少吃一點，電壓幾乎沒掉。' : '負載 10 kΩ，輸出 ' + a.toFixed(2) + ' V。按「換重負載」看看。'));
    }
    bindRange('rg-rip', x => x.toFixed(2) + ' V', x => { rip = x; msg(); });
    const bL = document.getElementById('rg-load'); if (bL) bL.addEventListener('click', () => { heavy = !heavy; bL.textContent = heavy ? '換回輕負載（10 kΩ）' : '換重負載（1 kΩ）'; msg(); });
    const bP = document.getElementById('rg-play'); if (bP) bP.addEventListener('click', () => { play = !play; bP.textContent = play ? '⏸ 暫停' : '▶ 播放'; });
  })();

  /* ══════════════════════════════════════════════════════════
     ② 稽納特性曲線：拖電流看電壓；膝點 I_ZK；線性模型 V_ZO + r_z I_Z
     ══════════════════════════════════════════════════════════ */
  (function ivLab() {
    const cv = document.getElementById('cv-iv'); if (!cv) return;
    let I = 5e-3, st = null;
    const vOf = i => bis(v => iz(v) - i, 0, 6);
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.8 : 0.45, minH: 250, maxH: 360, draw(ctx, w, h) {
      const x0 = Math.max(46, w * 0.09), x1 = w - 16, y0 = 18, y1 = h - 30;
      const F = frame(ctx, x0, y0, x1, y1, { x0: 0, x1: 6, y0: 0, y1: 25, xt: [1, 2, 3, 4, 5, 6], yt: [5, 10, 15, 20], xl: '反向電壓 V<sub>Z</sub>（V）', yl: '反向電流 I<sub>Z</sub>（mA）' });
      /* 穩壓區 */
      const vk = vOf(0.25e-3);
      ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = C.accent;
      ctx.fillRect(F.X(vk), y0, Math.max(0, F.X(vOf(25e-3)) - F.X(vk) + 6), Math.max(0, F.Y(0.25) - y0)); ctx.restore();
      const pts = []; for (let n = 0; n <= 300; n++) { const v = 6 * n / 300, i = iz(v) * 1e3; if (i > 26) break; pts.push([v, i]); }
      line(ctx, pts, F.X, F.Y, C.accent, 2.8);
      /* 膝點 */
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, F.Y(0.25)); ctx.lineTo(x1, F.Y(0.25)); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, x0 + 6, F.Y(0.25) - 9, 'I<sub>ZK</sub> ≈ 0.25 mA（規格書）', C.warn, 11, 'left', '700');
      const v = vOf(I);
      dot(ctx, F.X(v), F.Y(I * 1e3), 7, I < 0.25e-3 ? C.warn : C.accent);
      ctx.setLineDash([3, 3]); ctx.strokeStyle = C['ink-3']; ctx.beginPath(); ctx.moveTo(F.X(v), F.Y(I * 1e3)); ctx.lineTo(F.X(v), y1); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, F.X(v) - 10, F.Y(I * 1e3) - 12, '(' + v.toFixed(3) + ' V, ' + (I * 1e3).toFixed(2) + ' mA)', C.accent, 12, 'right', '700');
      labelCJK(ctx, F.X(2.5), F.Y(12), '還沒崩潰：幾乎沒電流', C['ink-2'], 12, 'center');
    } });
    function msg() {
      const v = vOf(I), v2 = vOf(I + 1e-3), rz = (v2 - v) / 1e-3;
      setHTML('iv-v', v.toFixed(3) + ' V'); setHTML('iv-rz', rz.toFixed(1) + ' Ω');
      setHTML('iv-msg', I < 0.25e-3 ? '電流比 I<sub>ZK</sub> 還小：在膝蓋下面，電壓會隨電流大幅變動 —— <b>穩不住</b>。'
        : '在穩壓區：電流每多 1 mA，電壓只多 ' + rz.toFixed(1) + ' mV，也就是動態電阻 r<sub>z</sub> ≈ ' + rz.toFixed(1) + ' Ω。' + (I > 20e-3 ? ' 電流越大越接近 5.1 V（規格書 I<sub>ZT</sub> = 20 mA 時 V<sub>Z</sub> = 5.1 V）。' : ''));
      st.redraw();
    }
    bindRange('iv-i', x => (x).toFixed(x < 1 ? 2 : 1) + ' mA', x => { I = x * 1e-3; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 穩壓電路實驗室：V_S、R、R_L → 電流分帳；有沒有崩潰
     ══════════════════════════════════════════════════════════ */
  const RLS = [500, 1000, 2000, 5000, 10000, 20000, Infinity];
  (function circLab() {
    const cv = document.getElementById('cv-circ'); if (!cv) return;
    let Vs = 15, R = 1000, RL = 1000, st = null;
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.9 : 0.42, minH: 260, maxH: 380, draw(ctx, w, h) {
      const narrow = w < 560;
      const s = solve(Vs, R, RL), vth = isFinite(RL) ? Vs * RL / (R + RL) : Vs;
      /* 電路 */
      const cx0 = narrow ? w * 0.12 : w * 0.06, cx1 = narrow ? w * 0.88 : w * 0.56, ty = narrow ? h * 0.12 : h * 0.18, by = narrow ? h * 0.5 : h * 0.82;
      const xz = lerp(cx0, cx1, 0.6), xl = cx1, ym = (ty + by) / 2;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(cx0, ym - 10); ctx.lineTo(cx0, ty); ctx.lineTo(xl, ty); ctx.moveTo(cx0, ym + 10); ctx.lineTo(cx0, by); ctx.lineTo(xl, by);
      ctx.moveTo(xz, ty); ctx.lineTo(xz, ym - 12); ctx.moveTo(xz, ym + 12); ctx.lineTo(xz, by); ctx.stroke();
      if (isFinite(RL)) { ctx.beginPath(); ctx.moveTo(xl, ty); ctx.lineTo(xl, ym - 18); ctx.moveTo(xl, ym + 18); ctx.lineTo(xl, by); ctx.stroke(); ctx.strokeRect(xl - 7, ym - 18, 14, 36); labelCJK(ctx, xl + 12, ym, 'R<sub>L</sub>', C.ink, 12, 'left', '700'); }
      /* 電池 */
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx0 - 14, ym - 6); ctx.lineTo(cx0 + 14, ym - 6); ctx.stroke(); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(cx0 - 8, ym + 6); ctx.lineTo(cx0 + 8, ym + 6); ctx.stroke();
      labelCJK(ctx, cx0 + 18, ym, Vs.toFixed(1) + ' V', C.ink, 12, 'left', '700');
      /* R */
      const rx = lerp(cx0, xz, 0.5); ctx.fillStyle = C.surface; ctx.fillRect(rx - 22, ty - 8, 44, 16); ctx.lineWidth = 1.6; ctx.strokeRect(rx - 22, ty - 7, 44, 14);
      labelCJK(ctx, rx, ty - 18, 'R = ' + fmtR(R), C.ink, 12, 'center', '700');
      /* 稽納（陰極在上） */
      ctx.fillStyle = s.iZ > 0.25e-3 ? C.accent : C.surface; ctx.beginPath(); ctx.moveTo(xz - 11, ym + 9); ctx.lineTo(xz + 11, ym + 9); ctx.lineTo(xz, ym - 9); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C.ink; ctx.stroke();
      ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(xz - 15, ym - 14); ctx.lineTo(xz - 11, ym - 9); ctx.lineTo(xz + 11, ym - 9); ctx.lineTo(xz + 15, ym - 4); ctx.stroke();
      /* 電流箭頭（粗細 ∝ 電流） */
      const wI = i => clamp(1 + i * 1e3 * 0.45, 1, 8);
      arrow(ctx, rx + 30, ty + 14, rx + 64, ty + 14, C.accent, wI(s.iR)); labelCJK(ctx, rx + 47, ty + 30, 'I<sub>R</sub> ' + mA(s.iR), C.accent, 11.5, 'center', '700');
      if (s.iZ > 1e-6) { arrow(ctx, xz - 22, ym - 22, xz - 22, ym + 18, C.accent, wI(s.iZ)); }
      labelCJK(ctx, xz - 28, ym + 30, 'I<sub>Z</sub> ' + mA(s.iZ), C.accent, 11.5, 'right', '700');
      if (isFinite(RL)) { arrow(ctx, xl - 18, ym - 26, xl - 18, ym + 14, C.ink, wI(s.iL)); labelCJK(ctx, xl - 24, ym + 30, 'I<sub>L</sub> ' + mA(s.iL), C.ink, 11.5, 'right', '700'); }
      labelCJK(ctx, (xz + xl) / 2, ty - 18, 'V<sub>o</sub> = ' + s.vo.toFixed(3) + ' V', C.accent, 13, 'center', '700');
      /* 右邊：拿掉稽納的分壓 vs 5.1 V */
      const bx0 = narrow ? w * 0.14 : w * 0.66, bx1 = narrow ? w * 0.9 : w * 0.96, byy0 = narrow ? h * 0.62 : h * 0.22, byy1 = narrow ? h * 0.94 : h * 0.86;
      const vmax = Math.max(20, vth * 1.1), Yb = v => lerp(byy1, byy0, v / vmax), bw = (bx1 - bx0) / 5;
      ctx.fillStyle = C['surface-2']; ctx.fillRect(bx0 + bw * 0.5, Yb(vth), bw * 1.5, Yb(0) - Yb(vth));
      ctx.fillStyle = C.accent; ctx.fillRect(bx0 + bw * 3, Yb(s.vo), bw * 1.5, Yb(0) - Yb(s.vo));
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(bx0, Yb(5.1)); ctx.lineTo(bx1, Yb(5.1)); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, bx1, Yb(5.1) - 8, '5.1 V', C.warn, 10, 'right', '700');
      labelCJK(ctx, bx0 + bw * 1.25, byy1 + 12, '拿掉稽納的分壓', C['ink-2'], 10.5, 'center');
      labelCJK(ctx, bx0 + bw * 1.25, Yb(vth) - 9, vth.toFixed(2) + ' V', C.ink, 11, 'center', '700');
      labelCJK(ctx, bx0 + bw * 3.75, byy1 + 12, '實際 V<sub>o</sub>', C.accent, 10.5, 'center', '700');
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx0, byy1); ctx.lineTo(bx1, byy1); ctx.stroke();
    } });
    function msg() {
      const s = solve(Vs, R, RL), vth = isFinite(RL) ? Vs * RL / (R + RL) : Vs;
      setHTML('cc-vo', s.vo.toFixed(3) + ' V'); setHTML('cc-iz', mA(s.iZ));
      setHTML('cc-msg', vth < 4.9 ? '拿掉稽納的分壓只有 <b>' + vth.toFixed(2) + ' V &lt; 5.1 V</b>：水位沒到溢流管，稽納<b>沒崩潰</b>，輸出就是分壓（約 ' + s.vo.toFixed(2) + ' V），電源一晃它就跟著晃。'
        : s.iZ < 0.25e-3 ? '分壓剛好在 5.1 V 附近，稽納電流只有 ' + mA(s.iZ) + '，<b>還在膝蓋下面</b>，穩不太住。'
        : '分壓 ' + vth.toFixed(2) + ' V ≥ 5.1 V：稽納崩潰、開始穩壓。R 送下來 ' + mA(s.iR) + '，負載拿 ' + mA(s.iL) + '，剩下 ' + mA(s.iZ) + ' 給稽納。');
      st.redraw();
    }
    bindRange('cc-vs', x => x.toFixed(1) + ' V', x => { Vs = x; msg(); });
    bindRange('cc-r', x => fmtR(x * 1000), x => { R = x * 1000; msg(); });
    bindRange('cc-rl', x => fmtR(RLS[x]), x => { RL = RLS[x]; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ④ 結果：實驗 1 模擬（表＋圖）＋我的實測
     ══════════════════════════════════════════════════════════ */
  const VSS = [2, 4, 6, 8, 10, 12, 14, 16], LOADS = [1000, 10000, 20000];
  (function results() {
    const tb = document.getElementById('res1'), tb2 = document.getElementById('res2');
    if (!tb) return;
    const sim = VSS.map(v => solve(v, 1000, Infinity));
    tb.innerHTML = '<tr><th>V<sub>S</sub></th>' + VSS.map(v => '<td class="num">' + v + ' V</td>').join('') + '</tr>' +
      '<tr><th>V<sub>D</sub></th>' + sim.map(s => '<td class="num hi">' + s.vo.toFixed(3) + '</td>').join('') + '</tr>' +
      '<tr><th>I<sub>D</sub>（mA）</th>' + sim.map(s => '<td class="num">' + (s.iR * 1e3).toFixed(2) + '</td>').join('') + '</tr>';
    const sim2 = LOADS.map(r => solve(15, 1000, r));
    tb2.innerHTML = '<tr><th>R</th>' + LOADS.map(r => '<td>' + fmtR(r) + '</td>').join('') + '</tr>' +
      '<tr><th>V<sub>D</sub></th>' + sim2.map(s => '<td class="num hi">' + s.vo.toFixed(3) + ' V</td>').join('') + '</tr>' +
      '<tr><th>I<sub>Z</sub>／I<sub>L</sub></th>' + sim2.map(s => '<td class="num">' + mA(s.iZ) + '／' + mA(s.iL) + '</td>').join('') + '</tr>';

    /* 我的實測（__SYNC 雲端同步；sync.js 較晚載入，等 load 再接） */
    let store = null; const LS = 'ee-lab-zener-meas';
    const getAll = () => { if (store) return store.all(); try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } };
    const put = (id, obj) => { if (store) { obj ? store.put(id, obj) : store.del(id); return; } try { const a = getAll(); if (obj) a[id] = obj; else delete a[id]; localStorage.setItem(LS, JSON.stringify(a)); } catch (e) {} };
    const mt = document.querySelector('#meas1 tbody'), mt2 = document.querySelector('#meas2 tbody');
    /* 使用者結報（1 kΩ、改 V_S；V_S = 15 V 並負載） */
    const MY1 = [1.9978, 3.9892, 5.3718, 5.4890, 5.5058, 5.5196, 5.5311, 5.5425], MY2 = [7.4946, 13.622, 14.276];
    VSS.forEach((v, i) => mt.insertAdjacentHTML('beforeend', '<tr data-id="a' + i + '" data-vs="' + v + '"><td>' + v + ' V</td><td><input type="number" inputmode="decimal" step="any" data-k="vd" data-def="' + MY1[i] + '" aria-label="Vs ' + v + ' V 時量到的 VD"></td><td class="num my">—</td><td class="num">' + sim[i].vo.toFixed(3) + '</td><td class="num df">—</td></tr>'));
    LOADS.forEach((r, i) => mt2.insertAdjacentHTML('beforeend', '<tr data-id="b' + i + '"><td>' + fmtR(r) + '</td><td><input type="number" inputmode="decimal" step="any" data-k="vd" data-def="' + MY2[i] + '" aria-label="R ' + fmtR(r) + ' 時量到的 VD"></td><td class="num">' + sim2[i].vo.toFixed(3) + '</td><td class="num df">—</td></tr>'));
    function calc(tr) {
      const vd = parseFloat(tr.querySelector('input').value), df = tr.querySelector('.df'), my = tr.querySelector('.my');
      const simv = tr.dataset.id[0] === 'a' ? sim[+tr.dataset.id.slice(1)].vo : sim2[+tr.dataset.id.slice(1)].vo;
      if (vd >= 0 && !isNaN(vd)) {
        if (my) my.textContent = ((+tr.dataset.vs - vd) / 1).toFixed(2);   /* I_D = (Vs − VD)/1k，單位 mA */
        const d = vd - simv; df.textContent = (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(2) + ' V'; df.className = 'num df ' + (Math.abs(d) <= 0.3 ? 'diff-ok' : 'diff-far');
      } else { if (my) my.textContent = '—'; df.textContent = '—'; df.className = 'num df'; }
    }
    function fill() {
      const all = getAll();
      [mt, mt2].forEach(t => t.querySelectorAll('tr').forEach(tr => { const inp = tr.querySelector('input'), it = all[tr.dataset.id]; if (document.activeElement !== inp) inp.value = it && it.vd !== undefined ? it.vd : inp.dataset.def; calc(tr); }));
      if (window.__zplot) window.__zplot();
    }
    [mt, mt2].forEach(t => t.addEventListener('input', e => { const tr = e.target.closest('tr'); if (!tr) return; const v = tr.querySelector('input').value; put(tr.dataset.id, { vd: v }); calc(tr); if (window.__zplot) window.__zplot(); }));
    document.getElementById('meas-clear').addEventListener('click', () => { if (!confirm('改回結報的原始數據？')) return; VSS.forEach((v, i) => put('a' + i, null)); LOADS.forEach((r, i) => put('b' + i, null)); fill(); });
    window.__zmine = () => Array.prototype.map.call(mt.querySelectorAll('tr'), (tr, i) => { const x = parseFloat(tr.querySelector('input').value); return isNaN(x) ? null : [VSS[i], x]; });
    fill();
    window.addEventListener('load', () => {
      if (!window.__SYNC) return;
      store = window.__SYNC.open('lab_zener_meas');
      try { const old = JSON.parse(localStorage.getItem(LS) || '{}'); Object.keys(old).forEach(k => { if (!store.get(k)) store.put(k, old[k]); }); localStorage.removeItem(LS); } catch (e) {}
      store.on(fill); fill();
    });

    /* 兩張圖：V_D 對 V_S、I_D 對 V_D（模擬實線＋我的實測點） */
    const cv = document.getElementById('cv-res'); if (!cv) return;
    const st = Stage(cv, { animate: false, ratio: w => w < 560 ? 1.2 : 0.42, minH: 280, maxH: 420, draw(ctx, w, h) {
      const narrow = w < 560, mine = (window.__zmine && window.__zmine()) || [];
      const boxes = narrow ? [[46, 18, w - 14, h * 0.45], [46, h * 0.56, w - 14, h - 28]] : [[46, 18, w * 0.48, h - 28], [w * 0.56, 18, w - 14, h - 28]];
      const A = frame(ctx, boxes[0][0], boxes[0][1], boxes[0][2], boxes[0][3], { x0: 0, x1: 16, y0: 0, y1: 6, xt: [4, 8, 12, 16], yt: [2, 4, 5.1, 6].slice(0, 3), xl: 'V<sub>S</sub>（V）', yl: 'V<sub>D</sub>（V）' });
      const pa = []; for (let n = 0; n <= 160; n++) { const v = 16 * n / 160; pa.push([v, solve(v, 1000, Infinity).vo]); }
      line(ctx, pa, A.X, A.Y, C.accent, 2.4);
      VSS.forEach(v => dot(ctx, A.X(v), A.Y(solve(v, 1000, Infinity).vo), 3.5, C.accent));
      mine.forEach(p => { if (p && !isNaN(p[1])) { ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(A.X(p[0]), A.Y(p[1]), 5, 0, TAU); ctx.stroke(); } });
      const B = frame(ctx, boxes[1][0], boxes[1][1], boxes[1][2], boxes[1][3], { x0: 0, x1: 6, y0: 0, y1: 12, xt: [2, 4, 6], yt: [4, 8, 12], xl: 'V<sub>D</sub>（V）', yl: 'I<sub>D</sub>（mA）' });
      const pb = []; for (let n = 0; n <= 160; n++) { const v = 16 * n / 160, s = solve(v, 1000, Infinity); pb.push([s.vo, s.iR * 1e3]); }
      line(ctx, pb, B.X, B.Y, C.accent, 2.4);
      mine.forEach(p => { if (p && !isNaN(p[1])) { ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(B.X(p[1]), B.Y(p[0] - p[1]), 5, 0, TAU); ctx.stroke(); } });
      labelCJK(ctx, w - 16, h - 8, '藍線：模擬　黑圈：我的實測', C['ink-2'], 11, 'right');
    } });
    window.__zplot = () => st.redraw();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ PSpice 波形：V1／V2／V3（照講義）／V3（R_L 換 10 kΩ）
     ══════════════════════════════════════════════════════════ */
  (function pspice() {
    const cv = document.getElementById('cv-ps'); if (!cv || !window.__ZW) return;
    let which = 'v3', st = null;
    const INFO = {
      v1: ['V1：半波整流（D1N4007、1 kΩ）', '峰值 9.31 V，負半週 0 V'],
      v2: ['V2：再並 100 µF', '在 7.99～9.27 V 之間晃（漣波 1.28 V）'],
      v3: ['V3：再加 R3 = 1 kΩ、D1N5231、R_L = 1 kΩ（照講義）', '只有 4.18～4.46 V：分壓 ≈ 4.5 V < 5.1 V，稽納沒崩潰'],
      v3b: ['V3：R_L 改 10 kΩ（自編對照）', '5.02～5.03 V：穩住了，只晃 7 mV']
    };
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.75 : 0.4, minH: 240, maxH: 340, draw(ctx, w, h) {
      const d = window.__ZW[which], x0 = Math.max(40, w * 0.07), x1 = w - 14;
      const F = frame(ctx, x0, 18, x1, h - 28, { x0: 0, x1: d.length - 1, y0: -10.5, y1: 10.5, yt: [-10, -5, 0, 5, 10], xl: '時間（兩個週期，33 ms）' });
      line(ctx, d.map((p, i) => [i, p[0]]), F.X, F.Y, C['ink-3'], 1.6, [5, 4]);
      line(ctx, d.map((p, i) => [i, p[1]]), F.X, F.Y, C.accent, 2.8);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, F.Y(5.1)); ctx.lineTo(x1, F.Y(5.1)); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, x1, F.Y(5.1) - 8, '5.1 V', C.warn, 10, 'right', '700');
      labelCJK(ctx, x0 + 8, F.Y(-8.6), '虛線：Vin（VAMPL = 10 V）　實線：' + which.slice(0, 2).toUpperCase(), C['ink-2'], 11.5, 'left');
    } });
    function msg() { setHTML('ps-t', INFO[which][0].replace('R_L', 'R<sub>L</sub>')); setHTML('ps-msg', INFO[which][1].replace('<', '&lt;')); st.redraw(); }
    document.querySelectorAll('[data-ps]').forEach(b => b.addEventListener('click', () => { which = b.dataset.ps; document.querySelectorAll('[data-ps]').forEach(x => x.classList.toggle('solid', x === b)); msg(); }));
    msg();
  })();

  /* ── 電路圖 ── */
  (function schems() {
    const S = window.__SCH; if (!S) return;
    const a = document.getElementById('schem-611');
    if (a) a.innerHTML = S.svg(300, 190, [
      S.vs(50, 40, 150, 'Vs'), S.w('50,40', '80,40'), S.r(80, 40, 180, 40, 'R1 1kΩ'), S.w('180,40', '210,40'),
      S.zd(210, 150, 210, 40, 'D1 5.1V'), S.w('210,150', '50,150'), S.gnd(130, 150),
      S.t(250, 70, '+', 'middle'), S.t(250, 130, '−', 'middle'), S.t(250, 100, 'VD', 'middle'), S.t(130, 30, 'ID →', 'middle', ' font-size="11"')
    ]);
    const b = document.getElementById('schem-reg');
    if (b) b.innerHTML = S.svg(360, 180, [
      S.vs(40, 40, 150, 'Vs'), S.r(40, 40, 160, 40, 'R'), S.w('160,40', '300,40'), S.dot(200, 40),
      S.zd(200, 150, 200, 40, 'IZ ↓'), S.r(300, 40, 300, 150, 'RL'), S.w('40,150', '300,150'), S.dot(200, 150),
      S.t(250, 30, 'IL →', 'middle', ' font-size="11"'), S.t(100, 30, 'IR →', 'middle', ' font-size="11"'), S.t(250, 100, 'Vo', 'middle', ' font-weight="700"')
    ]);
    const c = document.getElementById('schem-ps');
    if (c) c.innerHTML = S.svg(470, 180, [
      S.vac(40, 40, 150, 'Vin'), S.d(40, 40, 140, 40, 'D2 1N4007'), S.w('140,40', '220,40'), S.dot(170, 40), S.c(170, 40, 170, 150, 'C1 100µ'),
      S.r(220, 40, 320, 40, 'R3 1k'), S.w('320,40', '420,40'), S.dot(350, 40), S.zd(350, 150, 350, 40, 'D1N5231'), S.r(420, 40, 420, 150, 'R2 1k'),
      S.w('40,150', '420,150'), S.dot(170, 150), S.dot(350, 150), S.gnd(230, 150),
      S.t(150, 30, 'V2', 'middle', ' font-weight="700"'), S.t(420, 30, 'V3', 'middle', ' font-weight="700"'), S.t(118, 30, 'V1', 'middle', ' font-weight="700"')
    ]);
  })();
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, lerp, liveExample } = E;
  const f2 = x => x.toFixed(2), f3 = x => x.toFixed(3);
  function bars(ctx, w, h, rows, unit, ref) {
    const x0 = Math.max(w * 0.3, 110), x1 = w * 0.88, mx = Math.max(1e-9, ...rows.map(r => Math.abs(r[1])), ref || 0);
    rows.forEach(([nm, v, col], k) => {
      const y = h * ((k + 0.6) / (rows.length + 0.2)), len = Math.max(2, (x1 - x0) * Math.abs(v) / mx);
      ctx.fillStyle = col; ctx.fillRect(x0, y - 8, len, 16);
      labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
      label(ctx, x0 + len + 6, y, v.toFixed(2) + unit, col, 10.5, 'left', '700');
    });
    if (ref) { const x = x0 + (x1 - x0) * ref / mx; ctx.setLineDash([4, 4]); ctx.strokeStyle = C.warn; ctx.beginPath(); ctx.moveTo(x, 6); ctx.lineTo(x, h - 6); ctx.stroke(); ctx.setLineDash([]); label(ctx, x + 4, 10, ref + unit, C.warn, 10, 'left', '700'); }
  }

  /* ── 例題 A：V_Z = V_ZO + r_z I_Z ── */
  liveExample('#ex-zd', {
    title: '例題 · 電流變了，稽納電壓變多少？',
    ratio: 0.22, minH: 120, maxH: 160,
    givens: [
      { id: 'xa-vzo', label: 'V<sub>ZO</sub>', min: 2, max: 12, step: 0.01, value: 4.76, fmt: v => v.toFixed(2) + ' V' },
      { id: 'xa-rz', label: '動態電阻 r<sub>z</sub>', min: 1, max: 60, step: 1, value: 17, fmt: v => v + ' Ω' },
      { id: 'xa-i1', label: 'I<sub>Z1</sub>', min: 1, max: 40, step: 1, value: 5, fmt: v => v + ' mA' },
      { id: 'xa-i2', label: 'I<sub>Z2</sub>', min: 1, max: 40, step: 1, value: 20, fmt: v => v + ' mA' }
    ],
    compute: g => { const vzo = g['xa-vzo'], rz = g['xa-rz'], i1 = g['xa-i1'], i2 = g['xa-i2']; return { vzo, rz, i1, i2, v1: vzo + rz * i1 / 1000, v2: vzo + rz * i2 / 1000, dv: rz * (i2 - i1) / 1000 }; },
    question: (g, r) => '稽納二極體 <b>V<sub>ZO</sub> = ' + f2(r.vzo) + ' V、r<sub>z</sub> = ' + r.rz + ' Ω</b>。電流從 <b>' + r.i1 + ' mA</b> 變到 <b>' + r.i2 + ' mA</b>，V<sub>Z</sub> 各是多少？變了多少？',
    questionEn: (g, r) => 'A Zener diode has V<sub>ZO</sub> = ' + f2(r.vzo) + ' V and r<sub>z</sub> = ' + r.rz + ' Ω. Find V<sub>Z</sub> at I<sub>Z</sub> = ' + r.i1 + ' mA and ' + r.i2 + ' mA, and the change ΔV.',
    steps: (g, r) => [
      { t: 'Step 1　套等效電路（講義 p.4）。', eq: 'V<sub>Z</sub> = V<sub>ZO</sub> + r<sub>z</sub> × I<sub>Z</sub>' },
      { t: 'Step 2　兩個電流各代一次。', eq: r.i1 + ' mA：' + f2(r.vzo) + ' + ' + r.rz + ' × ' + (r.i1 / 1000).toFixed(3) + ' = ' + f3(r.v1) + ' V<br>' + r.i2 + ' mA：' + f2(r.vzo) + ' + ' + r.rz + ' × ' + (r.i2 / 1000).toFixed(3) + ' = ' + f3(r.v2) + ' V' },
      { t: 'Step 3　差多少。', eq: 'ΔV = r<sub>z</sub> × ΔI = ' + r.rz + ' × ' + ((r.i2 - r.i1) / 1000).toFixed(3) + ' = ' + (r.dv * 1000).toFixed(0) + ' mV' },
      { t: 'Step 4　解讀。', note: Math.abs(r.dv) < 0.05 ? '電流變了 ' + Math.abs(r.i2 - r.i1) + ' mA，電壓只差 ' + Math.abs(r.dv * 1000).toFixed(0) + ' mV —— <b>穩得很好</b>。' : '差了 ' + Math.abs(r.dv * 1000).toFixed(0) + ' mV：r<sub>z</sub> 越大、電流變越多，輸出越不穩。挑 r<sub>z</sub> 小的稽納比較好。' }
    ],
    answer: (g, r) => 'V<sub>Z</sub> = ' + f3(r.v1) + ' V → ' + f3(r.v2) + ' V，ΔV = ' + (r.dv * 1000).toFixed(0) + ' mV',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['I<sub>Z1</sub> = ' + r.i1 + ' mA', r.v1, C['ink-2']], ['I<sub>Z2</sub> = ' + r.i2 + ' mA', r.v2, C.accent]], ' V')
  });

  /* ── 例題 B：穩壓電路，有沒有崩潰、電流怎麼分 ── */
  liveExample('#ex-circ', {
    title: '例題 · 實驗 1：15 V、1 kΩ、負載 1 kΩ，稽納有沒有在穩？',
    ratio: 0.24, minH: 130, maxH: 170,
    givens: [
      { id: 'xb-vs', label: '電源 V<sub>S</sub>', min: 1, max: 24, step: 0.5, value: 15, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xb-r', label: '串聯 R', min: 0.1, max: 5, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' kΩ' },
      { id: 'xb-rl', label: '負載 R<sub>L</sub>', min: 0.1, max: 20, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' kΩ' },
      { id: 'xb-vz', label: 'V<sub>Z</sub>（當成固定）', min: 2.4, max: 12, step: 0.1, value: 5.1, fmt: v => v.toFixed(1) + ' V' }
    ],
    compute: g => {
      const Vs = g['xb-vs'], R = g['xb-r'], RL = g['xb-rl'], Vz = g['xb-vz'], vth = Vs * RL / (R + RL), on = vth >= Vz;
      const vo = on ? Vz : vth, iR = (Vs - vo) / R, iL = vo / RL, iZ = on ? iR - iL : 0;
      return { Vs, R, RL, Vz, vth, on, vo, iR, iL, iZ, rlMin: Vz * R / (Vs - Vz) };
    },
    question: (g, r) => '電源 <b>V<sub>S</sub> = ' + r.Vs.toFixed(1) + ' V</b> 串 <b>R = ' + r.R.toFixed(1) + ' kΩ</b>，接 <b>' + r.Vz.toFixed(1) + ' V</b> 的稽納二極體，並聯負載 <b>R<sub>L</sub> = ' + r.RL.toFixed(1) + ' kΩ</b>。稽納有沒有崩潰？V<sub>o</sub>、I<sub>R</sub>、I<sub>L</sub>、I<sub>Z</sub> 各多少？',
    questionEn: (g, r) => 'A ' + r.Vs.toFixed(1) + ' V source drives a ' + r.R.toFixed(1) + ' kΩ series resistor and a ' + r.Vz.toFixed(1) + ' V Zener diode with a ' + r.RL.toFixed(1) + ' kΩ load in parallel. Is the Zener in breakdown? Find V<sub>o</sub>, I<sub>R</sub>, I<sub>L</sub> and I<sub>Z</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　拿掉稽納，看分壓（講義 p.5）。', eq: 'V<sub>S</sub> × R<sub>L</sub>/(R + R<sub>L</sub>) = ' + r.Vs.toFixed(1) + ' × ' + r.RL.toFixed(1) + '/' + (r.R + r.RL).toFixed(1) + ' = ' + f2(r.vth) + ' V　' + (r.on ? '≥' : '&lt;') + ' ' + r.Vz.toFixed(1) + ' V' },
      { t: 'Step 2　輸出電壓。', note: r.on ? '有崩潰，稽納把輸出撐在 V<sub>Z</sub>：' : '沒崩潰，稽納當斷路，輸出就是分壓：', eq: 'V<sub>o</sub> = ' + f2(r.vo) + ' V' },
      { t: 'Step 3　電流分帳。', eq: 'I<sub>R</sub> = (' + r.Vs.toFixed(1) + ' − ' + f2(r.vo) + ')/' + r.R.toFixed(1) + 'k = ' + f2(r.iR) + ' mA<br>I<sub>L</sub> = ' + f2(r.vo) + '/' + r.RL.toFixed(1) + 'k = ' + f2(r.iL) + ' mA<br>I<sub>Z</sub> = I<sub>R</sub> − I<sub>L</sub> = ' + f2(r.iZ) + ' mA' },
      { t: 'Step 4　穩不穩得住？', note: !r.on ? '分壓不夠，<b>稽納沒工作</b>。要穩壓，R<sub>L</sub> 至少要 ' + (r.rlMin > 0 ? f2(r.rlMin) + ' kΩ' : '—') + '（或 R 改小、V<sub>S</sub> 加大）。'
        : r.iZ < 0.25 ? 'I<sub>Z</sub> 只有 ' + f2(r.iZ) + ' mA，接近膝點電流 I<sub>ZK</sub>（約 0.25 mA），<b>勉強</b>，負載再重一點就穩不住。'
        : '<b>穩住了</b>：I<sub>Z</sub> = ' + f2(r.iZ) + ' mA ≥ I<sub>ZK</sub>。負載最重可以到 R<sub>L</sub> = ' + f2(r.rlMin) + ' kΩ（再小稽納就沒電流了）。' }
    ],
    answer: (g, r) => (r.on ? '有崩潰' : '沒崩潰') + '；V<sub>o</sub> = ' + f2(r.vo) + ' V，I<sub>R</sub> = ' + f2(r.iR) + '、I<sub>L</sub> = ' + f2(r.iL) + '、I<sub>Z</sub> = ' + f2(r.iZ) + ' mA',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['拿掉稽納的分壓', r.vth, C.ink], ['實際 V<sub>o</sub>', r.vo, C.accent]], ' V', r.Vz)
  });

  /* ── 例題 C：PSpice V3 的陷阱 ── */
  liveExample('#ex-v3', {
    title: '例題 · PSpice V3：要多大的負載稽納才會工作？',
    ratio: 0.22, minH: 120, maxH: 160,
    givens: [
      { id: 'xc-vc', label: '電容上的電壓（最低點）', min: 5, max: 12, step: 0.1, value: 8.6, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xc-r3', label: 'R3', min: 0.1, max: 3, step: 0.01, value: 1, fmt: v => v.toFixed(2) + ' kΩ' },
      { id: 'xc-rl', label: '負載 R2', min: 0.1, max: 20, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' kΩ' }
    ],
    compute: g => { const vc = g['xc-vc'], R = g['xc-r3'], RL = g['xc-rl'], vth = vc * RL / (R + RL); return { vc, R, RL, vth, on: vth >= 5.1, rlMin: 5.1 * R / (vc - 5.1), rMax: (vc - 5.1) * RL / 5.1 }; },
    question: (g, r) => '講義 p.10 的 V3：電容上大約 <b>' + r.vc.toFixed(1) + ' V</b>（漣波最低點），經過 <b>R3 = ' + r.R.toFixed(2) + ' kΩ</b> 接 5.1 V 稽納（D1N5231），負載 <b>R2 = ' + r.RL.toFixed(1) + ' kΩ</b>。稽納會崩潰嗎？',
    questionEn: (g, r) => 'In circuit V3, the filter capacitor sits at about ' + r.vc.toFixed(1) + ' V (ripple minimum), feeding a 5.1 V Zener through R3 = ' + r.R.toFixed(2) + ' kΩ with load R2 = ' + r.RL.toFixed(1) + ' kΩ. Does the Zener break down?',
    steps: (g, r) => [
      { t: 'Step 1　拿掉稽納看分壓。', eq: r.vc.toFixed(1) + ' × ' + r.RL.toFixed(1) + '/(' + r.R.toFixed(2) + ' + ' + r.RL.toFixed(1) + ') = ' + f2(r.vth) + ' V' },
      { t: 'Step 2　跟 5.1 V 比。', eq: f2(r.vth) + ' V ' + (r.on ? '≥' : '&lt;') + ' 5.1 V　→　' + (r.on ? '會崩潰、能穩壓' : '不會崩潰') },
      { t: 'Step 3　要穩壓的條件。', eq: 'R2 ≥ 5.1 × R3/(V<sub>C</sub> − 5.1) = ' + f2(r.rlMin) + ' kΩ　或　R3 ≤ (V<sub>C</sub> − 5.1) × R2/5.1 = ' + f2(r.rMax) + ' kΩ' },
      { t: 'Step 4　結論。', note: r.on ? '這組數字稽納有在工作，V3 會穩在 5 V 附近。' : '照講義的數字（1k、1k）分壓只有 ' + f2(r.vth) + ' V，<b>稽納沒崩潰</b>，V3 只是分壓、會跟著漣波晃（模擬 4.18～4.46 V）。<b>請跟老師確認</b>作業是不是要看這個現象，還是負載要改大。' }
    ],
    answer: (g, r) => (r.on ? '會崩潰' : '不會崩潰') + '（分壓 ' + f2(r.vth) + ' V）；要穩壓：R2 ≥ ' + f2(r.rlMin) + ' kΩ',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['分壓', r.vth, r.on ? C.accent : C.ink]], ' V', 5.1)
  });

  /* ── 例題 D：電壓變動率 ── */
  liveExample('#ex-reg', {
    title: '例題 · 電壓變動率：輸入翻倍，輸出變幾 %？',
    ratio: 0.22, minH: 120, maxH: 160,
    givens: [
      { id: 'xd-v1', label: '輸入 V<sub>S1</sub>', min: 6, max: 20, step: 0.5, value: 8, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xd-v2', label: '輸入 V<sub>S2</sub>', min: 6, max: 24, step: 0.5, value: 16, fmt: v => v.toFixed(1) + ' V' }
    ],
    compute: g => { const a = g['xd-v1'], b = g['xd-v2'], s = window.__zsolve, o1 = s(a, 1000, Infinity).vo, o2 = s(b, 1000, Infinity).vo; return { a, b, o1, o2, pin: (b - a) / a * 100, pout: (o2 - o1) / o1 * 100, ratio: (o2 - o1) / (b - a) * 100 }; },
    question: (g, r) => '實驗 1 的電路（R1 = 1 kΩ、5.1 V 稽納、不接負載），電源從 <b>' + r.a.toFixed(1) + ' V</b> 變到 <b>' + r.b.toFixed(1) + ' V</b>。用模擬值算輸出變了幾 %、每 1 V 輸入輸出變多少。',
    questionEn: (g, r) => 'In the circuit of Experiment 1, the supply changes from ' + r.a.toFixed(1) + ' V to ' + r.b.toFixed(1) + ' V. Using the simulated values, find the percentage change of the output and ΔV<sub>o</sub>/ΔV<sub>S</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　兩個輸出（模擬）。', eq: 'V<sub>o1</sub> = ' + f3(r.o1) + ' V，V<sub>o2</sub> = ' + f3(r.o2) + ' V' },
      { t: 'Step 2　輸入、輸出各變幾 %。', eq: '輸入：' + r.pin.toFixed(0) + ' %　輸出：' + r.pout.toFixed(2) + ' %' },
      { t: 'Step 3　每 1 V 輸入，輸出變多少（線路調整率）。', eq: 'ΔV<sub>o</sub>/ΔV<sub>S</sub> = ' + ((r.o2 - r.o1) * 1000).toFixed(0) + ' mV / ' + (r.b - r.a).toFixed(1) + ' V = ' + r.ratio.toFixed(2) + ' %' },
      { t: 'Step 4　解讀。', note: r.a < 6 || r.o1 < 4.9 ? 'V<sub>S1</sub> 太低，稽納還在膝蓋附近，前後根本不在同一段，數字沒意義。' : '輸入變了 ' + r.pin.toFixed(0) + '%，輸出只變 ' + r.pout.toFixed(2) + '% —— 這就是「穩壓」的意思。' }
    ],
    answer: (g, r) => '輸出變 ' + r.pout.toFixed(2) + ' %；ΔV<sub>o</sub>/ΔV<sub>S</sub> ≈ ' + r.ratio.toFixed(2) + ' %',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['輸入變化', r.pin, C.ink], ['輸出變化', r.pout, C.accent]], ' %')
  });
})();

/* ============================================================
   小測驗（中英對照，選項每次打亂）
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '穩壓電路的目的是什麼？', en: 'What is the purpose of a voltage regulator?',
      o: [['電源浮動或負載電流改變時，輸出電壓盡量不變', 'keep the output voltage constant despite supply or load variations'], ['把交流變成直流', 'convert AC to DC'], ['把漣波放大', 'amplify the ripple'], ['提高輸出電流', 'increase the output current']], a: 0,
      e: '講義 p.2：即使電源有浮動，或是負載電流有變化時，盡可能使輸出電壓不變。把交流變直流是整流器的工作。' },
    { zh: '稽納二極體在穩壓電路裡是怎麼接的？', en: 'How is a Zener diode connected in a regulator?',
      o: [['逆偏（反接），工作在崩潰區', 'reverse biased, operating in the breakdown region'], ['順偏，工作在導通區', 'forward biased, in the conduction region'], ['跟負載串聯', 'in series with the load'], ['直接接在電源兩端、不用電阻', 'directly across the source with no resistor']], a: 0,
      e: '稽納就是利用崩潰效應來穩壓（講義 p.3），所以陰極接高電位、反接；而且一定要有串聯電阻限流。' },
    { zh: '為什麼流過稽納的電流不能小於 I_ZK？', en: 'Why must the Zener current never fall below I_ZK?',
      o: [['電流太小就離開了幾乎垂直的穩壓區，電壓會亂掉', 'below it the diode leaves the nearly vertical region and the voltage is no longer regulated'], ['會燒掉', 'it would burn out'], ['二極體會變成順偏', 'the diode becomes forward biased'], ['電源會短路', 'the source would be shorted']], a: 0,
      e: 'I<sub>ZK</sub> 是膝點電流（講義 p.4）。電流大於 I<sub>ZK</sub>，V-I 曲線才幾乎是直線；太小就在膝蓋下面，穩不住。燒掉是電流太大（超過 I<sub>MAX</sub>）的問題。' },
    { zh: '動態電阻 r_z 的意思是？', en: 'What does the dynamic resistance r_z describe?',
      o: [['崩潰區電壓隨電流變化的斜率：ΔV = r_z ΔI', 'the slope in breakdown: ΔV = r_z ΔI'], ['稽納的逆向漏電阻，很大', 'its large reverse leakage resistance'], ['串聯電阻 R 的大小', 'the value of the series resistor R'], ['負載電阻', 'the load resistance']], a: 0,
      e: '講義 p.4：ΔV = r<sub>z</sub>ΔI、V<sub>Z</sub> = V<sub>ZO</sub> + r<sub>z</sub>I<sub>Z</sub>。r<sub>z</sub> 越小，穩得越好。' },
    { zh: '判斷稽納有沒有崩潰，要先算什麼？', en: 'To decide whether the Zener is in breakdown, what do you check first?',
      o: [['拿掉稽納後的分壓 V_S·R_L/(R+R_L) 是否 ≥ V_ZO', 'whether the open-circuit divider voltage V_S·R_L/(R+R_L) ≥ V_ZO'], ['V_S 是否大於 0', 'whether V_S > 0'], ['R 是否大於 R_L', 'whether R > R_L'], ['稽納的順向電壓', 'the forward voltage of the Zener']], a: 0,
      e: '講義 p.5 的判斷式。只看 V<sub>S</sub> ≥ V<sub>ZO</sub> 不夠：負載會把電壓分掉，分壓不夠稽納就沒崩潰。' },
    { zh: '稽納已經在穩壓，負載吃的電流變多時會怎樣？', en: 'With the Zener regulating, what happens when the load draws more current?',
      o: [['稽納電流變少，輸出幾乎不變', 'the Zener current decreases and the output stays almost constant'], ['稽納電流變多', 'the Zener current increases'], ['串聯電阻的電流變成 0', 'the series-resistor current becomes zero'], ['輸出電壓加倍', 'the output voltage doubles']], a: 0,
      e: 'I<sub>R</sub> = I<sub>Z</sub> + I<sub>L</sub>，而 I<sub>R</sub> ≈ (V<sub>S</sub> − V<sub>Z</sub>)/R 幾乎固定，所以負載多拿多少，稽納就少拿多少。只要 I<sub>Z</sub> ≥ I<sub>ZK</sub> 就還穩得住。' },
    { zh: '實驗 1（R1 = 1 kΩ、5.1 V 稽納）V_S = 2 V 時，V_D 大約是？', en: 'In Experiment 1, with V_S = 2 V, V_D is about:',
      o: [['2 V（還沒崩潰，稽納像斷路）', '2 V (not yet in breakdown, the Zener is like an open circuit)'], ['5.1 V', '5.1 V'], ['0.7 V', '0.7 V'], ['0 V', '0 V']], a: 0,
      e: '電源還沒到 V<sub>Z</sub>，稽納幾乎沒電流，電阻沒壓降，V<sub>D</sub> ≈ V<sub>S</sub>（模擬 1.995 V）。' },
    { zh: '實驗 1 的 I_D 怎麼得到？', en: 'How is I_D obtained in Experiment 1?',
      o: [['I_D = (V_S − V_D) / R1', 'I_D = (V_S − V_D) / R1'], ['I_D = V_D / R1', 'I_D = V_D / R1'], ['I_D = V_S / R1', 'I_D = V_S / R1'], ['只能用電流表量', 'only with an ammeter']], a: 0,
      e: '講義寫「量測輸出電壓，計算電流」：R1 上的電壓是 V<sub>S</sub> − V<sub>D</sub>，除以 1 kΩ 就是電流（mA）。' },
    { zh: 'PSpice 的 V3 照講義接（R3 = 1 kΩ、負載 1 kΩ、電容約 9 V），模擬出來約多少？', en: 'In the PSpice V3 circuit as given (R3 = 1 kΩ, 1 kΩ load, about 9 V on the capacitor), the simulated output is about:',
      o: [['約 4.3 V，稽納沒崩潰', 'about 4.3 V; the Zener is not in breakdown'], ['穩穩的 5.1 V', 'a steady 5.1 V'], ['9 V', '9 V'], ['0 V', '0 V']], a: 0,
      e: '分壓 9 × 1k/2k = 4.5 V &lt; 5.1 V，稽納沒崩潰，V3 只是分壓，模擬 4.18～4.46 V。負載換 10 kΩ 才會穩在約 5.03 V（請跟老師確認作業要看哪一個）。' },
    { zh: '稽納二極體和一般二極體最大的差別？', en: 'What is the main difference between a Zener diode and an ordinary diode?',
      o: [['稽納被設計成在準確、較低的電壓崩潰，並故意工作在崩潰區', 'a Zener is designed to break down at a precise, lower voltage and is meant to operate there'], ['稽納不能順偏導通', 'a Zener cannot conduct when forward biased'], ['稽納沒有 PN 接面', 'a Zener has no pn junction'], ['一般二極體不會崩潰', 'ordinary diodes never break down']], a: 0,
      e: '一般二極體也會崩潰，只是要避開（PIV）。稽納是重摻雜、崩潰電壓準，故意住在崩潰區穩壓。它順偏時跟一般二極體一樣導通約 0.7 V。' }
  ];
  let i = 0, score = 0, answered = false, ord = [];
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  const fixSub = s => s.replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>');
  function render() {
    const q = Q[i];
    host.innerHTML = '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div><div class="quiz-body"><div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
      '<div class="q-text">' + fixSub(q.zh) + '</div><div class="q-en">' + fixSub(q.en) + '</div><div class="opts"></div><div class="explain" hidden></div></div>' +
      '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span><button class="btn" id="q-next" hidden>下一題 →</button></div>';
    const opts = host.querySelector('.opts'); ord = shuffle(q.o.length);
    ord.forEach((src, k) => { const b = document.createElement('button'); b.className = 'opt'; b.type = 'button'; b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + fixSub(q.o[src][0]) + '<span class="en">' + fixSub(q.o[src][1]) + '</span></span>'; b.addEventListener('click', () => pick(k)); opts.appendChild(b); });
    host.querySelector('#q-next').addEventListener('click', () => { i++; i < Q.length ? render() : done(); });
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
    const pct = Math.round(score / Q.length * 100);
    host.innerHTML = '<div class="bar"><i style="width:100%"></i></div><div class="quiz-body" style="padding-bottom:18px"><div class="q-no">測驗結果</div><div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + pct + '%）</div>' +
      '<p style="color:var(--ink-2);margin:0 0 14px">' + (pct >= 80 ? '稽納穩壓的觀念通了，實驗前再看一次「實驗流程」就可以上場。' : '回去把故事模式第 10～12 個畫面（電流分帳、有沒有崩潰）再看一次。') + '</p>' +
      '<button class="btn solid" id="q-again" type="button">再測一次</button></div>';
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
