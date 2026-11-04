/* ============================================================
   電子學 CH2 PART 1 — 直流電源供應器方塊圖、變壓器匝數比、半波整流（三種情況、轉移特性、波形）
   Neamen 4e, Ch.2 §2.1.1；課程原講義 CH2 PART 1（V1）投影片 2-1～2-7
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, arrow, bindRange, clamp, lerp, TAU } = E;
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fillStyle = col; ctx.fill(); };
  const wide = w => w >= 560;
  const dash = (ctx, x1, y1, x2, y2, col) => { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };
  /* 在框 (x0..x1, ym ± A) 裡畫 f(u)，u = 0..1，f 回傳 −1..1 */
  const trace = (ctx, x0, x1, ym, A, f, col, lw, ds) => {
    ctx.save(); ctx.setLineDash(ds || []); ctx.strokeStyle = col; ctx.lineWidth = lw || 2; ctx.beginPath();
    for (let k = 0; k <= 120; k++) { const u = k / 120, y = ym - A * f(u); k ? ctx.lineTo(lerp(x0, x1, u), y) : ctx.moveTo(lerp(x0, x1, u), y); }
    ctx.stroke(); ctx.restore();
  };
  /* 半波整流：v_S → (v_O, v_D, i_D) */
  const hw = (vs, Vg, R) => vs > Vg ? { on: true, vo: vs - Vg, vd: Vg, i: (vs - Vg) / R } : { on: false, vo: 0, vd: vs, i: 0 };
  window.__c21 = { hw };

  /* ══════════════════════════════════════════════════════════
     01 方塊圖：每一級出來的波形
     ══════════════════════════════════════════════════════════ */
  (function psu() {
    const cv = document.getElementById('cv-psu'); if (!cv) return;
    let upto = 4, ph = 0;
    const names = ['市電 110 V', '變壓器', '整流電路', '濾波電路', '穩壓電路'];
    const outs = ['交流 155.6 V 峰值', '交流（降壓）', '脈動直流', '有漣波的直流', '平穩 5 V'];
    Stage(cv, { ratio: w => wide(w) ? 0.36 : 1.25, minH: 240, maxH: 460, draw(ctx, w, h, dt) {
      ph += dt * 0.25;
      const n = 5, W = wide(w);
      for (let k = 0; k < n; k++) {
        const bw = W ? (w - 40) / n - 12 : w - 40, bh = W ? h * 0.82 : (h - 20) / n - 8;
        const bx = W ? 20 + k * (bw + 12) : 20, by = W ? h * 0.08 : 10 + k * (bh + 8);
        const on = k <= upto;
        ctx.globalAlpha = on ? 1 : 0.3;
        ctx.fillStyle = k === upto ? (C['p-real-w'] || C['surface-2']) : C['surface-2']; ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = k === upto ? C.accent : C.line; ctx.lineWidth = k === upto ? 2 : 1; ctx.strokeRect(bx, by, bw, bh);
        labelCJK(ctx, bx + 8, by + 13, (k + 1) + '. ' + names[k], k === upto ? C.accent : C.ink, 12, 'left', '700');
        labelCJK(ctx, bx + 8, by + 30, outs[k], C['ink-3'], 10.5, 'left');
        /* 波形 */
        const x0 = bx + 8, x1 = bx + bw - 8, ym = W ? by + bh * 0.62 : by + bh * 0.68, A = W ? bh * 0.24 : bh * 0.26;
        const f = [u => Math.sin(TAU * (2 * u - ph)), u => 0.6 * Math.sin(TAU * (2 * u - ph)),
          u => Math.max(0, 0.6 * Math.sin(TAU * (2 * u - ph)) - 0.05),
          u => { const t = ((2 * u - ph) % 1 + 1) % 1; const pk = 0.55; return t < 0.25 ? Math.max(pk * Math.sin(TAU * t), pk - 0.12 * (t + 0.75)) : pk - 0.12 * (t - 0.25); },
          () => 0.36][k];
        dash(ctx, x0, ym, x1, ym, C['line-soft'] || C.line);
        trace(ctx, x0, x1, ym, A, f, k === upto ? C.accent : C.ink, 2);
        ctx.globalAlpha = 1;
        if (k < n - 1) {
          if (W) arrow(ctx, bx + bw + 1, by + bh / 2, bx + bw + 11, by + bh / 2, C['ink-3'], 1.4);
          else arrow(ctx, w / 2, by + bh + 1, w / 2, by + bh + 7, C['ink-3'], 1.4);
        }
      }
    } });
    const msgs = ['<b>市電</b>：台灣插座是 110 V（rms）、60 Hz 的交流，峰值 110√2 ≈ 155.6 V。手機只要 5 V 直流，差太多了。',
      '<b>變壓器</b>：把 110 V 降成適當的交流電壓（例如十幾伏）。還是交流，只是變小。',
      '<b>整流電路</b>：用二極體「只准單向通過」，把交流變成一顆一顆的<b>脈動直流</b> —— 這一頁的主角（半波整流）。',
      '<b>濾波電路</b>：在整流輸出加一顆電容，駝峰之間由電容放電補上，變得比較平（還有一點漣波）。下一份講義的內容。',
      '<b>穩壓電路</b>：例如 7805 穩壓 IC，把輸入穩成固定 5 V（有回授控制）。PART 6 的齊納二極體也能做簡單的穩壓。'];
    function msg() { setHTML('psu-msg', msgs[upto]); document.querySelectorAll('[data-psu]').forEach(b => b.classList.toggle('solid', +b.dataset.psu === upto)); }
    document.querySelectorAll('[data-psu]').forEach(b => b.addEventListener('click', () => { upto = +b.dataset.psu; msg(); }));
    msg();
  })();

  /* ══════════════════════════════════════════════════════════
     02 變壓器：匝數比
     ══════════════════════════════════════════════════════════ */
  (function xfmr() {
    const cv = document.getElementById('cv-xf'); if (!cv) return;
    let N1 = 10, N2 = 1, ph = 0;
    const VP = 155.6;
    Stage(cv, { ratio: w => wide(w) ? 0.4 : 0.95, minH: 250, maxH: 400, draw(ctx, w, h, dt) {
      ph += dt * 0.4;
      const W = wide(w), cx = W ? w * 0.5 : w * 0.5, cy = W ? h * 0.5 : h * 0.3, H = W ? h * 0.6 : h * 0.4;
      /* 鐵心 */
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 5, cy - H / 2); ctx.lineTo(cx - 5, cy + H / 2); ctx.moveTo(cx + 5, cy - H / 2); ctx.lineTo(cx + 5, cy + H / 2); ctx.stroke();
      /* 線圈：圈數用畫的（最多畫 20 圈） */
      const coil = (x, turns, dir, col) => {
        const nT = Math.min(20, Math.max(1, turns)), step = H / nT;
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, cy - H / 2);
        for (let k = 0; k < nT; k++) { const y0 = cy - H / 2 + k * step; ctx.arc(x, y0 + step / 2, step / 2, -Math.PI / 2, Math.PI / 2, dir < 0); }
        ctx.stroke();
      };
      coil(cx - 22, N1, -1, C.ink); coil(cx + 22, N2, 1, C.accent);
      labelCJK(ctx, cx - 40, cy - H / 2 - 10, 'N<sub>1</sub> = ' + N1, C.ink, 12, 'right', '700');
      labelCJK(ctx, cx + 40, cy - H / 2 - 10, 'N<sub>2</sub> = ' + N2, C.accent, 12, 'left', '700');
      /* 兩邊波形 */
      const VS = VP * N2 / N1;
      const scale = Math.max(VP, VS);
      if (W) {
        const A = h * 0.32;
        trace(ctx, w * 0.04, cx - 70, cy, A * VP / scale, u => Math.sin(TAU * (2 * u - ph)), C.ink, 2);
        trace(ctx, cx + 70, w * 0.96, cy, A * VS / scale, u => Math.sin(TAU * (2 * u - ph)), C.accent, 2.4);
        labelCJK(ctx, w * 0.04, h * 0.08, 'v<sub>I</sub>：一次側（市電）峰值 155.6 V', C.ink, 11.5, 'left', '700');
        labelCJK(ctx, w * 0.96, h * 0.08, 'v<sub>S</sub>：二次側 峰值 ' + VS.toFixed(1) + ' V', C.accent, 11.5, 'right', '700');
      } else {
        const A = h * 0.1, y1 = h * 0.68, y2 = h * 0.88;
        trace(ctx, w * 0.06, w * 0.94, y1, A * VP / scale, u => Math.sin(TAU * (2 * u - ph)), C.ink, 2);
        trace(ctx, w * 0.06, w * 0.94, y2, A * VS / scale, u => Math.sin(TAU * (2 * u - ph)), C.accent, 2.4);
        labelCJK(ctx, w * 0.06, y1 - A - 8, 'v<sub>I</sub> 峰值 155.6 V', C.ink, 11, 'left', '700');
        labelCJK(ctx, w * 0.06, y2 - Math.max(A * VS / scale, 8) - 8, 'v<sub>S</sub> 峰值 ' + VS.toFixed(1) + ' V', C.accent, 11, 'left', '700');
      }
    } });
    function msg() {
      const VS = VP * N2 / N1;
      setHTML('xf-r', N1 + ' : ' + N2);
      setHTML('xf-v', VS.toFixed(1) + ' V（rms ' + (110 * N2 / N1).toFixed(1) + ' V）');
      setHTML('xf-msg', N2 < N1 ? '<b>降壓</b>：二次側圈數比一次側少，電壓按比例變小：v<sub>S</sub>/v<sub>I</sub> = N<sub>2</sub>/N<sub>1</sub> = 1/' + (N1 / N2).toFixed(2).replace(/\.?0+$/, '') + '。'
        : N2 > N1 ? '<b>升壓</b>：二次側圈數比較多，電壓變大。電源供應器通常是降壓。' : '圈數一樣：電壓不變（只做隔離）。');
    }
    bindRange('xf-n1', x => x.toFixed(0) + ' 圈', x => { N1 = x; msg(); });
    bindRange('xf-n2', x => x.toFixed(0) + ' 圈', x => { N2 = x; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     03 半波整流：三種情況 + 轉移特性（VTC）
     ══════════════════════════════════════════════════════════ */
  (function vtc() {
    const cv = document.getElementById('cv-vtc'); if (!cv) return;
    let VS = 3, VG = 0.7, st;
    st = Stage(cv, { animate: false, ratio: w => wide(w) ? 0.46 : 0.9, minH: 260, maxH: 400, draw(ctx, w, h) {
      const x0 = Math.max(48, w * 0.12), x1 = w * 0.94, y0 = h * 0.08, y1 = h * 0.82;
      const X = v => lerp(x0, x1, (v + 6) / 12), Y = v => lerp(y1, y0, (v + 1) / 7);
      /* 三個區塊上色 */
      ctx.fillStyle = C['surface-2']; ctx.fillRect(X(-6), y0, X(0) - X(-6), y1 - y0);
      ctx.fillStyle = C['surface-3'] || C['surface-2']; ctx.fillRect(X(0), y0, X(VG) - X(0), y1 - y0);
      ctx.fillStyle = C['p-real-w'] || C['surface-2']; ctx.fillRect(X(VG), y0, X(6) - X(VG), y1 - y0);
      labelCJK(ctx, X(-3), y0 + 12, '① v<sub>S</sub> ＜ 0：OFF', C['ink-2'], 11.5, 'center', '700');
      labelCJK(ctx, X(VG) + 4, y0 + 30, '② 0～V<sub>γ</sub>：OFF', C['ink-2'], 10.5, 'left', '700');
      labelCJK(ctx, X(3.4), y0 + 12, '③ v<sub>S</sub> ＞ V<sub>γ</sub>：ON', C.accent, 11.5, 'center', '700');
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.moveTo(X(0), y0); ctx.lineTo(X(0), y1); ctx.stroke();
      labelCJK(ctx, x1, Y(0) + 14, 'v<sub>S</sub> (V)', C['ink-3'], 11, 'right');
      labelCJK(ctx, X(0) + 6, y0 + 50, 'v<sub>O</sub> (V)', C['ink-3'], 11, 'left');
      /* VTC */
      ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(-6), Y(0)); ctx.lineTo(X(VG), Y(0)); ctx.lineTo(X(6), Y(6 - VG)); ctx.stroke();
      labelCJK(ctx, X(4.6), Y(4.6 - VG) + 14, '斜率 = 1', C.accent, 11.5, 'left', '700');
      label(ctx, X(VG), Y(0) + 12, 'V<sub>γ</sub>', C['ink-2'], 10.5);
      /* 目前的點 */
      const r = hw(VS, VG, 1);
      dash(ctx, X(VS), Y(0), X(VS), Y(r.vo), C['ink-3']); dash(ctx, X(0), Y(r.vo), X(VS), Y(r.vo), C['ink-3']);
      dot(ctx, X(VS), Y(r.vo), 7, r.on ? C.accent : C.ink);
      labelCJK(ctx, X(VS) + (VS > 3 ? -10 : 10), Y(r.vo) - 14, 'v<sub>O</sub> = ' + r.vo.toFixed(2) + ' V', r.on ? C.accent : C.ink, 12, VS > 3 ? 'right' : 'left', '700');
    } });
    function msg() {
      const r = hw(VS, VG, 1);
      setHTML('vt-c', VS < 0 ? '① OFF' : VS < VG ? '② OFF' : '③ ON');
      setHTML('vt-o', r.vo.toFixed(2) + ' V'); setHTML('vt-d', r.vd.toFixed(2) + ' V');
      setHTML('vt-msg', VS < 0 ? '① v<sub>S</sub> &lt; 0：逆偏，二極體 OFF，I<sub>D</sub> = 0 → 電阻沒壓降，v<sub>O</sub> = 0；整個 v<sub>S</sub> 落在二極體上：v<sub>D</sub> = v<sub>S</sub> = ' + VS.toFixed(2) + ' V（負的，逆偏）。'
        : VS < VG ? '② 雖然是正的，但還不到 V<sub>γ</sub>：推不開門，二極體仍 OFF，v<sub>O</sub> = 0、v<sub>D</sub> = v<sub>S</sub>。'
        : '③ 超過 V<sub>γ</sub>：ON，二極體 = V<sub>γ</sub> 電池 → v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub> = ' + r.vo.toFixed(2) + ' V。v<sub>S</sub> 每多 1 V，v<sub>O</sub> 就多 1 V（斜率 = 1）。');
      st.redraw();
    }
    bindRange('vt-s', x => x.toFixed(2) + ' V', x => { VS = x; msg(); });
    bindRange('vt-g', x => x.toFixed(2) + ' V', x => { VG = x; msg(); });
  })();

  /* ══════════════════════════════════════════════════════════
     04 波形：v_S、v_O、v_D（方法一：公式；方法二：VTC 投影）
     ══════════════════════════════════════════════════════════ */
  (function wave() {
    const cv = document.getElementById('cv-wave'); if (!cv) return;
    let VM = 10, VG = 0.7, ph = 0;
    Stage(cv, { ratio: w => wide(w) ? 0.5 : 1.0, minH: 300, maxH: 440, draw(ctx, w, h, dt) {
      ph = (ph + dt * 0.12) % 1;
      const x0 = Math.max(56, w * 0.12), x1 = w * 0.96, rows = 3, rh = h * 0.9 / rows;
      const vs = u => VM * Math.sin(2 * TAU * u);
      const fns = [['v<sub>S</sub>', u => vs(u), C.ink], ['v<sub>O</sub>', u => hw(vs(u), VG, 1).vo, C.accent], ['v<sub>D</sub>', u => hw(vs(u), VG, 1).vd, C['q-react'] || C.warn]];
      const now = ph;
      fns.forEach((f, k) => {
        const ym = h * 0.04 + k * rh + rh * 0.5, A = rh * 0.4 / VM;
        dash(ctx, x0, ym, x1, ym, C['line-soft'] || C.line);
        labelCJK(ctx, x0 - 8, ym, f[0], f[2], 12, 'right', '700');
        if (k > 0) trace(ctx, x0, x1, ym, A, u => vs(u), C['ink-3'], 1.2, [4, 4]);
        trace(ctx, x0, x1, ym, A, f[1], f[2], 2.4);
        const yv = ym - A * f[1](now); dot(ctx, lerp(x0, x1, now), yv, 5, f[2]);
        if (k === 1) label(ctx, x0 + 4, ym - A * (VM - VG) - 9, '峰值 ' + (VM - VG).toFixed(1) + ' V', C.accent, 10.5, 'left', '700');
        if (k === 2) { label(ctx, lerp(x0, x1, 0.375), ym + A * VM + 9, '−' + VM.toFixed(1) + ' V = PIV', C['q-react'] || C.warn, 10.5, 'center', '700'); label(ctx, x0 + 4, ym - A * VG - 9, 'V<sub>γ</sub>', C['ink-2'], 10.5, 'left'); }
      });
      ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, now), h * 0.03); ctx.lineTo(lerp(x0, x1, now), h * 0.96); ctx.stroke();
    } });
    function msg() {
      const th = Math.asin(Math.min(1, VG / VM)) * 180 / Math.PI;
      setHTML('wv-pk', (VM - VG).toFixed(2) + ' V');
      setHTML('wv-piv', VM.toFixed(1) + ' V');
      setHTML('wv-msg', VM <= VG ? '輸入峰值還不到 V<sub>γ</sub>，二極體從頭到尾 OFF，沒有輸出。'
        : '虛線是 v<sub>S</sub>。ON 的時候 v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>、v<sub>D</sub> 卡在 V<sub>γ</sub>；OFF 的時候 v<sub>O</sub> = 0、v<sub>D</sub> = v<sub>S</sub>。隨時都有 <b>v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub></b>。負半週谷底二極體承受 −' + VM.toFixed(1) + ' V（PIV）。' +
          (VM < 5 ? ' 輸入小，V<sub>γ</sub> 吃掉的比例很明顯。' : ''));
    }
    bindRange('wv-m', x => x.toFixed(1) + ' V', x => { VM = x; msg(); });
    bindRange('wv-g', x => x.toFixed(2) + ' V', x => { VG = x; msg(); });
  })();
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, lerp, liveExample } = E;
  const f1 = x => x.toFixed(1), f2 = x => x.toFixed(2);
  function bars(ctx, w, h, rows, fmt) {
    const x0 = Math.max(w * 0.3, 120), x1 = w * 0.78, mx = Math.max(1e-9, ...rows.map(r => Math.abs(r[1])));
    rows.forEach(([nm, v, col], k) => {
      const y = h * ((k + 0.6) / (rows.length + 0.2)), len = Math.max(2, (x1 - x0) * Math.abs(v) / mx);
      ctx.fillStyle = col; ctx.fillRect(x0, y - 8, len, 16);
      labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
      labelCJK(ctx, Math.min(x0 + len + 6, w - 70), y, fmt(v), col, 11, 'left', '700');
    });
  }

  /* ── 01 從 110 V 到 5 V ── */
  liveExample('#ex-psu', {
    title: '例題 · 市電一路降到整流輸出（自編）',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xp-n', label: '匝數比 N<sub>1</sub>/N<sub>2</sub>', min: 4, max: 30, step: 0.5, value: 10, fmt: v => v.toFixed(1) + ' : 1' },
      { id: 'xp-g', label: 'V<sub>γ</sub>', min: 0.6, max: 0.8, step: 0.05, value: 0.7, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => {
      const n = g['xp-n'], Vg = g['xp-g'], VI = 110 * Math.SQRT2, VS = VI / n, VO = VS - Vg;
      return { n, Vg, VI, VS, VO };
    },
    question: (g, r) => '市電 110 V（rms），經匝數比 N<sub>1</sub>:N<sub>2</sub> = <b>' + f1(r.n) + ' : 1</b> 的變壓器降壓，再用一顆二極體（V<sub>γ</sub> = ' + f2(r.Vg) + ' V）半波整流。求市電峰值、二次側峰值 V<sub>S</sub> 與整流輸出峰值。',
    questionEn: (g, r) => 'The 110 V (rms) line is stepped down by a transformer with N<sub>1</sub>:N<sub>2</sub> = ' + f1(r.n) + ':1 and half-wave rectified by a diode with V<sub>γ</sub> = ' + f2(r.Vg) + ' V. Find the line peak, the secondary peak voltage and the peak output.',
    steps: (g, r) => [
      { t: 'Step 1　rms 換峰值。', note: '110 V 是有效值，弦波峰值要乘 √2。', eq: 'V<sub>I,peak</sub> = 110√2 = ' + f1(r.VI) + ' V' },
      { t: 'Step 2　匝數比。', note: 'v<sub>S</sub>/v<sub>I</sub> = N<sub>2</sub>/N<sub>1</sub>（講義 2-5）。', eq: 'V<sub>S</sub> = ' + f1(r.VI) + ' / ' + f1(r.n) + ' = ' + f2(r.VS) + ' V' },
      { t: 'Step 3　整流輸出峰值。', note: 'ON 時 v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>。' + (r.VS < 3 ? '二次側很小時，V<sub>γ</sub> 吃掉的比例很明顯。' : ''), eq: 'V<sub>O,peak</sub> = ' + f2(r.VS) + ' − ' + f2(r.Vg) + ' = ' + f2(r.VO) + ' V' }
    ],
    answer: (g, r) => 'V<sub>I,peak</sub> = ' + f1(r.VI) + ' V、V<sub>S</sub> = ' + f2(r.VS) + ' V、V<sub>O,peak</sub> = ' + f2(r.VO) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['市電峰值', r.VI, C['ink-3']], ['二次側 V<sub>S</sub>', r.VS, C.ink], ['整流峰值', r.VO, C.accent]], v => f2(v) + ' V')
  });

  /* ── 02 匝數比設計 ── */
  liveExample('#ex-n', {
    title: '例題 · 要多少 V<sub>S</sub>，就選多少匝數比',
    ratio: 0.28, minH: 130, maxH: 190,
    givens: [
      { id: 'xn-v', label: '一次側 v<sub>I</sub>（rms）', min: 100, max: 240, step: 10, value: 110, fmt: v => v.toFixed(0) + ' V' },
      { id: 'xn-s', label: '想要的二次側峰值', min: 3, max: 50, step: 0.5, value: 12, fmt: v => v.toFixed(1) + ' V' }
    ],
    compute: g => { const VI = g['xn-v'], VS = g['xn-s'], VIp = VI * Math.SQRT2; return { VI, VS, VIp, n: VIp / VS }; },
    question: (g, r) => '一次側接 <b>' + r.VI.toFixed(0) + ' V（rms）</b>，想要二次側的弦波<b>峰值 ' + f1(r.VS) + ' V</b>。匝數比 N<sub>1</sub>:N<sub>2</sub> 要多少？',
    questionEn: (g, r) => 'The primary is driven by ' + r.VI.toFixed(0) + ' V (rms). What turns ratio N<sub>1</sub>:N<sub>2</sub> gives a secondary peak voltage of ' + f1(r.VS) + ' V?',
    steps: (g, r) => [
      { t: 'Step 1　一次側峰值。', eq: r.VI.toFixed(0) + ' × √2 = ' + f1(r.VIp) + ' V' },
      { t: 'Step 2　電壓比 = 匝數比。', note: '比的是同一種量：峰值對峰值（或 rms 對 rms）。', eq: 'N<sub>1</sub>/N<sub>2</sub> = v<sub>I</sub>/v<sub>S</sub> = ' + f1(r.VIp) + ' / ' + f1(r.VS) + ' = ' + f2(r.n) },
      { t: 'Step 3　解讀。', note: r.n > 1 ? 'N<sub>1</sub> &gt; N<sub>2</sub>：<b>降壓</b>變壓器，一次側圈數是二次側的 ' + f2(r.n) + ' 倍。' : 'N<sub>1</sub> &lt; N<sub>2</sub>：升壓。' }
    ],
    answer: (g, r) => 'N<sub>1</sub>:N<sub>2</sub> ≈ ' + f2(r.n) + ' : 1',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['一次側峰值', r.VIp, C.ink], ['二次側峰值', r.VS, C.accent]], v => f1(v) + ' V')
  });

  /* ── 03 三種情況 ── */
  liveExample('#ex-hw', {
    title: '例題 · 給一個 v<sub>S</sub>，判斷情況、算 v<sub>O</sub>、v<sub>D</sub>、i<sub>D</sub>',
    ratio: 0.28, minH: 130, maxH: 190,
    givens: [
      { id: 'xh-s', label: 'v<sub>S</sub>', min: -10, max: 10, step: 0.1, value: 5, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xh-g', label: 'V<sub>γ</sub>', min: 0.5, max: 0.8, step: 0.05, value: 0.7, fmt: v => v.toFixed(2) + ' V' },
      { id: 'xh-r', label: 'R', min: 0.1, max: 10, step: 0.1, value: 1, fmt: v => v.toFixed(1) + ' kΩ' }
    ],
    compute: g => { const vs = g['xh-s'], Vg = g['xh-g'], R = g['xh-r']; return Object.assign({ vs, Vg, R }, window.__c21.hw(vs, Vg, R)); },
    question: (g, r) => 'Fig 2.2 半波整流（二極體用 r<sub>f</sub> = 0 的模型，V<sub>γ</sub> = ' + f2(r.Vg) + ' V），R = <b>' + f1(r.R) + ' kΩ</b>。某瞬間 v<sub>S</sub> = <b>' + f1(r.vs) + ' V</b>：屬於哪一種情況？求 i<sub>D</sub>、v<sub>O</sub>、v<sub>D</sub>。',
    questionEn: (g, r) => 'For the half-wave rectifier of Fig 2.2 (r<sub>f</sub> = 0, V<sub>γ</sub> = ' + f2(r.Vg) + ' V, R = ' + f1(r.R) + ' kΩ), at an instant when v<sub>S</sub> = ' + f1(r.vs) + ' V, which case applies? Find i<sub>D</sub>, v<sub>O</sub> and v<sub>D</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　跟 0、V<sub>γ</sub> 比。', note: '三種情況：v<sub>S</sub> &lt; 0、0 &lt; v<sub>S</sub> &lt; V<sub>γ</sub>、v<sub>S</sub> &gt; V<sub>γ</sub>（講義 2-6）。', eq: r.vs < 0 ? '① v<sub>S</sub> &lt; 0 → OFF' : r.vs < r.Vg ? '② 0 &lt; v<sub>S</sub> &lt; V<sub>γ</sub> → OFF' : '③ v<sub>S</sub> &gt; V<sub>γ</sub> → ON' },
      r.on ? { t: 'Step 2　ON：二極體 = V<sub>γ</sub> 電池。', eq: 'i<sub>D</sub> = (v<sub>S</sub> − V<sub>γ</sub>)/R = (' + f1(r.vs) + ' − ' + f2(r.Vg) + ')/' + f1(r.R) + ' = ' + f2(r.i) + ' mA' }
        : { t: 'Step 2　OFF：斷路。', note: '沒有電流，電阻上沒有壓降。', eq: 'i<sub>D</sub> = 0' },
      { t: 'Step 3　v<sub>O</sub>、v<sub>D</sub>。', note: '永遠成立：v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>。', eq: 'v<sub>O</sub> = i<sub>D</sub>R = ' + f2(r.vo) + ' V　｜　v<sub>D</sub> = ' + f1(r.vs) + ' − ' + f2(r.vo) + ' = ' + f2(r.vd) + ' V' }
    ],
    answer: (g, r) => (r.vs < 0 ? '①' : r.vs < r.Vg ? '②' : '③') + '：i<sub>D</sub> = ' + f2(r.i) + ' mA、v<sub>O</sub> = ' + f2(r.vo) + ' V、v<sub>D</sub> = ' + f2(r.vd) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['v<sub>S</sub>', r.vs, C.ink], ['v<sub>O</sub>（電阻）', r.vo, C.accent], ['v<sub>D</sub>（二極體）', r.vd, C['q-react'] || C.warn]], v => f2(v) + ' V')
  });

  /* ── 04 波形與 PIV ── */
  liveExample('#ex-wave', {
    title: '例題 · 弦波輸入：輸出峰值與 PIV',
    ratio: 0.3, minH: 140, maxH: 200,
    givens: [
      { id: 'xw-m', label: 'v<sub>S</sub> 峰值 V<sub>M</sub>', min: 1, max: 40, step: 0.5, value: 12, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xw-g', label: 'V<sub>γ</sub>', min: 0.5, max: 0.8, step: 0.05, value: 0.7, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => { const M = g['xw-m'], Vg = g['xw-g']; return { M, Vg, pk: M - Vg }; },
    question: (g, r) => '半波整流，v<sub>S</sub> = <b>' + f1(r.M) + ' sin ωt</b> V，V<sub>γ</sub> = ' + f2(r.Vg) + ' V（r<sub>f</sub> = 0）。求 (a) v<sub>O</sub> 峰值；(b) 二極體承受的最大逆向電壓（PIV）；(c) 畫 v<sub>O</sub> 波形。',
    questionEn: (g, r) => 'A half-wave rectifier has v<sub>S</sub> = ' + f1(r.M) + ' sin ωt V and V<sub>γ</sub> = ' + f2(r.Vg) + ' V. Find (a) the peak output voltage, (b) the peak inverse voltage across the diode, and (c) sketch v<sub>O</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　(a) 峰值。', note: 'ON 時 v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>，峰值發生在 v<sub>S</sub> = V<sub>M</sub>。', eq: 'v<sub>O,max</sub> = V<sub>M</sub> − V<sub>γ</sub> = ' + f2(r.pk) + ' V' },
      { t: 'Step 2　(b) PIV。', note: '負半週 OFF：v<sub>D</sub> = v<sub>S</sub>，谷底是 −V<sub>M</sub>（講義 2-7 Fig 2.3(c)）。', eq: 'PIV = V<sub>M</sub> = ' + f1(r.M) + ' V' },
      { t: 'Step 3　(c) 波形。', note: r.M < 3 ? 'V<sub>M</sub> 小，扣掉 V<sub>γ</sub> 後駝峰變得很矮、很窄。' : '超過 V<sub>γ</sub> 的部分往下移 V<sub>γ</sub>，其他時候 0：一顆一顆的駝峰。' }
    ],
    answer: (g, r) => '(a) ' + f2(r.pk) + ' V (b) PIV = ' + f1(r.M) + ' V',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.max(40, w * 0.08), x1 = w * 0.96, ym = h * 0.5, A = h * 0.38 / r.M;
      ctx.strokeStyle = C['ink-3']; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.beginPath();
      for (let k = 0; k <= 160; k++) { const u = k / 160, v = r.M * Math.sin(u * 4 * Math.PI); k ? ctx.lineTo(lerp(x0, x1, u), ym - A * v) : ctx.moveTo(lerp(x0, x1, u), ym - A * v); } ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let k = 0; k <= 160; k++) { const u = k / 160, v = Math.max(0, r.M * Math.sin(u * 4 * Math.PI) - r.Vg); k ? ctx.lineTo(lerp(x0, x1, u), ym - A * v) : ctx.moveTo(lerp(x0, x1, u), ym - A * v); } ctx.stroke();
      labelCJK(ctx, x1, h * 0.08, '藍：v<sub>O</sub>　虛線：v<sub>S</sub>', C['ink-3'], 10.5, 'right');
      label(ctx, lerp(x0, x1, 0.375), ym + A * r.M + 2, '−' + f1(r.M) + ' V', C['ink-2'], 10, 'center');
    }
  });
})();

/* ============================================================
   小測驗
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '直流電源供應器的方塊圖，依序是？', en: 'What is the order of blocks in a dc power supply?',
      o: [['變壓器 → 整流 → 濾波 → 穩壓', 'transformer → rectifier → filter → regulator'], ['整流 → 變壓器 → 穩壓 → 濾波', 'rectifier → transformer → regulator → filter'], ['濾波 → 整流 → 變壓器 → 穩壓', 'filter → rectifier → transformer → regulator'], ['穩壓 → 濾波 → 整流 → 變壓器', 'regulator → filter → rectifier → transformer']], a: 0,
      e: '講義 2-2～2-3（Fig 2.1）：先降壓、再變單向、再弄平、最後穩住。' },
    { zh: '整流電路的輸出是什麼？', en: 'What is the output of a rectifier circuit?',
      o: [['脈動直流（方向不變、大小一直變）', 'pulsating dc (constant direction, varying magnitude)'], ['平穩的直流', 'smooth dc'], ['交流', 'ac'], ['方波', 'a square wave']], a: 0,
      e: '二極體只讓單向電流通過，交流變成一顆一顆的駝峰，還要濾波才平。' },
    { zh: '濾波電路最常見的做法是？', en: 'The most common filter is?',
      o: [['在整流器輸出端並聯一顆電容', 'a capacitor across the rectifier output'], ['再串一顆二極體', 'another series diode'], ['加一顆變壓器', 'another transformer'], ['加一顆齊納二極體', 'a Zener diode']], a: 0,
      e: '講義 2-3：電容儲存電荷，在交流波動期間放電補上，提供平穩的輸出。' },
    { zh: '7805 是什麼？', en: 'What is a 7805?',
      o: [['輸出 5 V 的線性穩壓 IC（有回授控制）', 'a linear voltage-regulator IC with a 5 V output (with feedback)'], ['一種二極體', 'a diode'], ['一種變壓器', 'a transformer'], ['一種濾波電容', 'a filter capacitor']], a: 0,
      e: '講義 2-3。' },
    { zh: '變壓器的電壓比與匝數比的關係是？', en: 'How are the voltage ratio and turns ratio of a transformer related?',
      o: [['v<sub>S</sub>/v<sub>I</sub> = N<sub>2</sub>/N<sub>1</sub>', 'v<sub>S</sub>/v<sub>I</sub> = N<sub>2</sub>/N<sub>1</sub>'], ['v<sub>S</sub>/v<sub>I</sub> = N<sub>1</sub>/N<sub>2</sub>', 'v<sub>S</sub>/v<sub>I</sub> = N<sub>1</sub>/N<sub>2</sub>'], ['v<sub>S</sub> = v<sub>I</sub>', 'v<sub>S</sub> = v<sub>I</sub>'], ['v<sub>S</sub>v<sub>I</sub> = N<sub>1</sub>N<sub>2</sub>', 'v<sub>S</sub>v<sub>I</sub> = N<sub>1</sub>N<sub>2</sub>']], a: 0,
      e: '講義 2-5：電壓跟圈數成正比，N<sub>1</sub>/N<sub>2</sub> 叫匝數比。' },
    { zh: '半波整流（r<sub>f</sub> = 0）中，0 &lt; v<sub>S</sub> &lt; V<sub>γ</sub> 時？', en: 'In a half-wave rectifier (r<sub>f</sub> = 0), when 0 &lt; v<sub>S</sub> &lt; V<sub>γ</sub>?',
      o: [['二極體 OFF，v<sub>O</sub> = 0，v<sub>D</sub> = v<sub>S</sub>', 'the diode is off, v<sub>O</sub> = 0 and v<sub>D</sub> = v<sub>S</sub>'], ['二極體 ON，v<sub>O</sub> = v<sub>S</sub>', 'the diode is on and v<sub>O</sub> = v<sub>S</sub>'], ['v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>', 'v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>'], ['二極體崩潰', 'the diode breaks down']], a: 0,
      e: '講義 2-6 情況 2：雖然是正的，但還推不開門。' },
    { zh: 'v<sub>S</sub> &gt; V<sub>γ</sub> 時，v<sub>O</sub> 等於？', en: 'When v<sub>S</sub> &gt; V<sub>γ</sub>, v<sub>O</sub> equals?',
      o: [['v<sub>S</sub> − V<sub>γ</sub>', 'v<sub>S</sub> − V<sub>γ</sub>'], ['v<sub>S</sub>', 'v<sub>S</sub>'], ['V<sub>γ</sub>', 'V<sub>γ</sub>'], ['0', '0']], a: 0,
      e: '講義 2-6 情況 3：二極體 = V<sub>γ</sub> 電池，i<sub>D</sub> = (v<sub>S</sub> − V<sub>γ</sub>)/R，v<sub>O</sub> = i<sub>D</sub>R。' },
    { zh: '半波整流的電壓轉移特性（VTC）在 v<sub>S</sub> &gt; V<sub>γ</sub> 那一段的斜率是？', en: 'What is the slope of the half-wave rectifier VTC for v<sub>S</sub> &gt; V<sub>γ</sub>?',
      o: [['1', '1'], ['0', '0'], ['R', 'R'], ['1/V<sub>γ</sub>', '1/V<sub>γ</sub>']], a: 0,
      e: 'v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>：v<sub>S</sub> 每多 1 V，v<sub>O</sub> 多 1 V（Fig 2.2(b) Slope = 1）。' },
    { zh: '半波整流電路中，二極體電壓 v<sub>D</sub> 隨時等於？', en: 'In the half-wave rectifier, the diode voltage v<sub>D</sub> always equals?',
      o: [['v<sub>S</sub> − v<sub>O</sub>', 'v<sub>S</sub> − v<sub>O</sub>'], ['v<sub>O</sub> − v<sub>S</sub>', 'v<sub>O</sub> − v<sub>S</sub>'], ['V<sub>γ</sub>', 'V<sub>γ</sub>'], ['0', '0']], a: 0,
      e: '講義 2-7 Note：KVL，二極體和電阻分 v<sub>S</sub>。ON 時 = V<sub>γ</sub>，OFF 時 = v<sub>S</sub>。' },
    { zh: 'v<sub>S</sub> = V<sub>M</sub> sin ωt 的半波整流，二極體承受的最大逆向電壓是？', en: 'For v<sub>S</sub> = V<sub>M</sub> sin ωt, the peak inverse voltage across the diode is?',
      o: [['V<sub>M</sub>', 'V<sub>M</sub>'], ['V<sub>M</sub> − V<sub>γ</sub>', 'V<sub>M</sub> − V<sub>γ</sub>'], ['V<sub>γ</sub>', 'V<sub>γ</sub>'], ['2V<sub>M</sub>', '2V<sub>M</sub>']], a: 0,
      e: '負半週 OFF：v<sub>D</sub> = v<sub>S</sub>，最低點 −V<sub>M</sub>。選二極體時 PIV 額定要比它大（CH1 PART 5）。' }
  ];
  let i = 0, score = 0, answered = false, ord = [];
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  function render() {
    const q = Q[i];
    host.innerHTML = '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div><div class="quiz-body"><div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div><div class="q-text">' + q.zh + '</div><div class="q-en">' + q.en + '</div><div class="opts"></div><div class="explain" hidden></div></div>' +
      '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span><button class="btn" id="q-next" hidden>下一題 →</button></div>';
    const opts = host.querySelector('.opts');
    ord = shuffle(q.o.length);
    ord.forEach((src, k) => { const pair = q.o[src], b = document.createElement('button'); b.className = 'opt'; b.type = 'button'; b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + pair[0] + '<span class="en">' + pair[1] + '</span></span>'; b.addEventListener('click', () => pick(k)); opts.appendChild(b); });
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
    const pct = Math.round(score / Q.length * 100);
    host.innerHTML = '<div class="bar"><i style="width:100%"></i></div><div class="quiz-body" style="padding-bottom:18px"><div class="q-no">測驗結果</div><div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + pct + '%）</div>' +
      '<p style="color:var(--ink-2);margin:0 0 14px">' + (pct >= 90 ? '半波整流通了。下一份講義：全波整流與濾波。' : '答錯的回去玩 §03 的轉移特性和 §04 的波形模組。') + '</p><button class="btn solid" id="q-again" type="button">再測一次</button></div>';
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
