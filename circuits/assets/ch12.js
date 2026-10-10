/* ============================================================
   電路學 CH12 三相電路 — 互動模組（PART 1～4 四頁共用；頁面上沒有的 canvas 自動跳過）
   Sadiku, Fundamentals of Electric Circuits, Ch.12 Three-Phase Circuits
   另外匯出：window.__CX（複數小工具，例題共用）、window.__ch12Quiz（測驗）
   ============================================================ */
(function () {
  'use strict';
  const RAD = Math.PI / 180;

  /* ---------------- 複數小工具（{re, im}） ---------------- */
  const CX = {
    c: (re, im) => ({ re, im: im || 0 }),
    p: (m, a) => ({ re: m * Math.cos(a * RAD), im: m * Math.sin(a * RAD) }),
    add: (a, b) => ({ re: a.re + b.re, im: a.im + b.im }),
    sub: (a, b) => ({ re: a.re - b.re, im: a.im - b.im }),
    mul: (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }),
    div: (a, b) => { const d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; },
    sc: (a, k) => ({ re: a.re * k, im: a.im * k }),
    conj: a => ({ re: a.re, im: -a.im }),
    neg: a => ({ re: -a.re, im: -a.im }),
    mag: a => Math.hypot(a.re, a.im),
    ang: a => Math.atan2(a.im, a.re) / RAD,
    /* 角度收進 (−180, 180] */
    wrap: d => { d = ((d + 180) % 360 + 360) % 360 - 180; return d === -180 ? 180 : d; }
  };
  const num = (x, n) => { const v = Math.abs(x) < 5e-12 ? 0 : x; return v.toFixed(n === undefined ? 2 : n).replace('-', '−'); };
  CX.num = num;
  /* 3 位有效數字左右的漂亮格式 */
  CX.g = (x, sig) => {
    sig = sig || 4; if (!isFinite(x)) return '∞';
    if (Math.abs(x) < 1e-12) return '0';
    const d = Math.max(0, sig - 1 - Math.floor(Math.log10(Math.abs(x))));
    return num(x, Math.min(d, 4));
  };
  CX.angS = (d, n) => '∠' + num(CX.wrap(d), n === undefined ? 2 : n) + '°';
  CX.pol = (z, n, an) => CX.g(CX.mag(z), n || 4) + CX.angS(CX.ang(z), an);
  CX.rect = (z, n) => { n = n === undefined ? 2 : n; return num(z.re, n) + (z.im < 0 ? ' − j' : ' + j') + num(Math.abs(z.im), n); };
  window.__CX = CX;

  const E = window.__EE;
  if (!E) return;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText, clamp, lerp, TAU } = E;
  const PHC = () => [C.accent, C['q-react'], C.ink];          /* a、b、c 三相的顏色 */

  /* 相量圖座標軸 */
  function axes(ctx, cx, cy, R) {
    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    label(ctx, cx + R - 2, cy + 10, 'Re', C['ink-3'], 9.5, 'right');
    label(ctx, cx + 4, cy - R + 8, 'Im', C['ink-3'], 9.5, 'left');
  }
  /* 從 (x0,y0) 畫一個相量（大小 m 像素、角度 a 度） */
  function vec(ctx, x0, y0, m, a, color, text, w, off) {
    const x1 = x0 + m * Math.cos(a * RAD), y1 = y0 - m * Math.sin(a * RAD);
    if (m > 3) arrow(ctx, x0, y0, x1, y1, color, w || 2.2);
    if (text) {
      const o = off || 13, lx = x1 + o * Math.cos(a * RAD), ly = y1 - o * Math.sin(a * RAD);
      label(ctx, lx, ly, text, color, 11, Math.cos(a * RAD) > 0.3 ? 'left' : Math.cos(a * RAD) < -0.3 ? 'right' : 'center', '700');
    }
    return [x1, y1];
  }
  E.vec12 = vec; E.axes12 = axes;

  /* ══════════════════════════════════════════════════════════
     ① 三相發電機（12.1）：轉子轉一圈，三個線圈各自發出一個弦波
     ══════════════════════════════════════════════════════════ */
  (function gen() {
    const cv = document.getElementById('cv-gen'); if (!cv) return;
    let Vm = 170, th = 30, playing = true;
    const btn = document.getElementById('gen-play');
    if (btn) btn.addEventListener('click', () => { playing = !playing; btn.textContent = playing ? '❚❚ 暫停' : '▶ 播放'; btn.setAttribute('aria-pressed', String(!playing)); st.redraw && st.redraw(); });
    const st = Stage(cv, { ratio: 0.5, minH: 250, maxH: 340, draw(ctx, w, h, dt) {
      if (playing) th = (th + dt * 40) % 360;
      const col = PHC();
      const narrow = w < 520;
      const gw = narrow ? w : w * 0.4, R = Math.max(20, Math.min(gw * 0.36, (narrow ? h * 0.42 : h * 0.4)));
      const gx = narrow ? w * 0.27 : gw / 2, gy = narrow ? h * 0.5 : h / 2;
      /* 定子 */
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(gx, gy, R, 0, TAU); ctx.stroke();
      /* 三個線圈（a 在上，b、c 依序往順時針 120°） */
      ['a', 'b', 'c'].forEach((n, i) => {
        const a = 90 - 120 * i;
        const x = gx + R * Math.cos(a * RAD), y = gy - R * Math.sin(a * RAD);
        ctx.save(); ctx.translate(x, y); ctx.rotate(-a * RAD);
        ctx.fillStyle = col[i]; ctx.fillRect(-6, -11, 12, 22); ctx.restore();
        label(ctx, gx + (R + 16) * Math.cos(a * RAD), gy - (R + 16) * Math.sin(a * RAD), n, col[i], 13, 'center', '700');
      });
      /* 轉子（磁鐵）：角度 th 逆時針轉 */
      const ra = th * RAD, L = R * 0.62;
      ctx.lineCap = 'round';
      ctx.strokeStyle = C.ink; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(gx - L * Math.cos(ra), gy + L * Math.sin(ra)); ctx.lineTo(gx, gy); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + L * Math.cos(ra), gy - L * Math.sin(ra)); ctx.stroke();
      label(ctx, gx + (L + 9) * Math.cos(ra), gy - (L + 9) * Math.sin(ra), 'N', C.accent, 11, 'center', '700');
      label(ctx, gx - (L + 9) * Math.cos(ra), gy + (L + 9) * Math.sin(ra), 'S', C.ink, 11, 'center', '700');
      disc(ctx, gx, gy, 4, C.surface, C.ink);
      /* 波形：磁鐵 N 極對準線圈時電壓最大 → v_a = Vm cos(θ − 90°)，以 a 為 0° 參考 */
      const x0 = narrow ? w * 0.56 : gw + 20, x1 = w - 14, my = narrow ? h * 0.5 : h / 2, A = Math.max(10, (narrow ? h * 0.36 : h * 0.38));
      const phase = th - 90;                       /* 目前的 ωt（度） */
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, my); ctx.lineTo(x1, my); ctx.stroke();
      const span = 540;                             /* 顯示 1.5 個週期，最右邊 = 現在 */
      const vals = [];
      [0, -120, 120].forEach((p, i) => {
        ctx.strokeStyle = col[i]; ctx.lineWidth = 2; ctx.beginPath();
        for (let n = 0; n <= 120; n++) {
          const t = phase - span + span * n / 120, x = lerp(x0, x1, n / 120), y = my - A * Math.cos((t + p) * RAD);
          n ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        const v = Vm * Math.cos((phase + p) * RAD); vals.push(v);
        disc(ctx, x1, my - A * v / Vm, 4, col[i]);
      });
      labelCJK(ctx, x1, my - A - 8 < 10 ? 10 : my - A - 8, '現在 →', C['ink-3'], 10.5, 'right');
      setText('gen-a', num(vals[0], 1) + ' V'); setText('gen-b', num(vals[1], 1) + ' V'); setText('gen-c', num(vals[2], 1) + ' V');
      setText('gen-sum', num(vals[0] + vals[1] + vals[2], 1) + ' V');
    } });
    bindRange('gen-vm', v => v + ' V', v => { Vm = v; });
  })();

  /* ══════════════════════════════════════════════════════════
     ② 相序判斷（12.2）：相量逆時針轉，記下通過「固定點」的順序
     ══════════════════════════════════════════════════════════ */
  (function seq() {
    const cv = document.getElementById('cv-seq'); if (!cv) return;
    let mode = 'abc', th = 20, order = [], last = null, playing = true;
    const pass = [];                                       /* 每一相上一刻的角度 */
    document.querySelectorAll('[data-seq]').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.seq; order = []; last = null; pass.length = 0;
      document.querySelectorAll('[data-seq]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    const btn = document.getElementById('seq-play');
    if (btn) btn.addEventListener('click', () => { playing = !playing; btn.textContent = playing ? '❚❚ 暫停' : '▶ 播放'; });
    let speed = 50;
    bindRange('seq-sp', v => v + ' °/s', v => { speed = v; });
    Stage(cv, { ratio: 0.5, minH: 250, maxH: 330, draw(ctx, w, h, dt) {
      const d = playing ? dt * speed : 0;
      const col = PHC(), cx = Math.min(w * 0.36, h * 0.62), cy = h / 2, R = Math.max(10, Math.min(cx - 26, h / 2 - 26));
      const offs = mode === 'abc' ? [0, -120, 120] : [0, 120, -120];
      axes(ctx, cx, cy, R + 14);
      /* 固定點：正實軸上的小旗子 */
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(cx + R + 6, cy); ctx.lineTo(cx + R + 18, cy - 7); ctx.lineTo(cx + R + 18, cy + 7); ctx.closePath(); ctx.fill();
      labelCJK(ctx, cx + R + 4, cy + 20, '固定點', C.ink, 10.5, 'center', '600');
      ['a', 'b', 'c'].forEach((n, i) => {
        const prev = ((th + offs[i]) % 360 + 360) % 360, now = ((th + d + offs[i]) % 360 + 360) % 360;
        if (d > 0 && now < prev) { if (last !== n) { order.push(n); last = n; if (order.length > 9) order.shift(); } }
        vec(ctx, cx, cy, R, th + d + offs[i], col[i], 'V' + n + 'n', 2.6);
      });
      th = (th + d) % 360;
      /* 右邊：通過順序 */
      const x0 = Math.min(w - 150, cx * 2 + 16), y0 = 30;
      labelCJK(ctx, x0, y0, '通過固定點的順序', C['ink-2'], 12, 'left', '700');
      order.forEach((n, i) => {
        const r = Math.min(13, (w - x0 - 10) / 10);
        const x = x0 + r + i * (r * 2.4), y = y0 + 34;
        if (x > w - 10) return;
        disc(ctx, x, y, r, col['abc'.indexOf(n)]);
        label(ctx, x, y + 1, n, C.surface, 12, 'center', '700');
      });
      labelCJK(ctx, x0, y0 + 78, mode === 'abc' ? 'a → b → c → a …　正相序（abc）' : 'a → c → b → a …　負相序（acb）', C.accent, 12, 'left', '700');
      labelCJK(ctx, x0, y0 + 102, mode === 'abc' ? 'Vbn 比 Van 晚 120°' : 'Vcn 比 Van 晚 120°', C['ink-2'], 11.5, 'left');
      setText('seq-kind', mode === 'abc' ? 'abc（正相序）' : 'acb（負相序）');
      setText('seq-b', mode === 'abc' ? 'Vp∠−120°' : 'Vp∠+120°');
      setText('seq-c', mode === 'abc' ? 'Vp∠+120°' : 'Vp∠−120°');
    } });
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 線電壓 = 兩個相電壓相減（12.3）：Vab = Van − Vbn = √3 Vp∠(θ+30°)
     ══════════════════════════════════════════════════════════ */
  (function vl() {
    const cv = document.getElementById('cv-vl'); if (!cv) return;
    let Vp = 120, th0 = 0, which = 'ab';
    document.querySelectorAll('[data-vl]').forEach(b => b.addEventListener('click', () => {
      which = b.dataset.vl; document.querySelectorAll('[data-vl]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); st.redraw();
    }));
    const st = Stage(cv, { animate: false, ratio: 0.55, minH: 260, maxH: 360, draw(ctx, w, h) {
      const col = PHC(), cx = w / 2 - Math.min(40, w * 0.06), cy = h / 2 + 10, R = Math.max(10, Math.min(w, h) * 0.24);
      const k = R / 120;   /* 120 V 畫成 R 像素；Vp 改變只縮放數字 */
      axes(ctx, cx, cy, R * 1.9);
      const A = [th0, th0 - 120, th0 + 120];
      A.forEach((a, i) => vec(ctx, cx, cy, R, a, col[i], 'V' + 'abc'[i] + 'n', 2.2));
      const pair = { ab: [0, 1], bc: [1, 2], ca: [2, 0] }[which];
      /* −Vx 從 Vy 的尖端接過去 */
      const tip = [cx + R * Math.cos(A[pair[0]] * RAD), cy - R * Math.sin(A[pair[0]] * RAD)];
      ctx.setLineDash([5, 4]);
      const e = vec(ctx, tip[0], tip[1], R, A[pair[1]] + 180, col[pair[1]], '−V' + 'abc'[pair[1]] + 'n', 1.8);
      ctx.setLineDash([]);
      const L = Math.hypot(e[0] - cx, e[1] - cy), ang = Math.atan2(-(e[1] - cy), e[0] - cx) / RAD;
      vec(ctx, cx, cy, L, ang, C.ink, 'V' + which, 3, 14);
      /* 30° 弧 */
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.arc(cx, cy, R * 0.42, -(A[pair[0]] + 30) * RAD, -A[pair[0]] * RAD); ctx.stroke();
      const ma = (A[pair[0]] + 15) * RAD;
      label(ctx, cx + R * 0.56 * Math.cos(ma), cy - R * 0.56 * Math.sin(ma), '30°', C['ink-2'], 10.5, 'center', '700');
      setText('vl-rp', num(Vp, 1) + ' V'); setText('vl-vl', num(Vp * Math.sqrt(3), 1) + ' V');
      setText('vl-ang', 'V' + which + ' = ' + num(Vp * Math.sqrt(3), 1) + '∠' + num(CX.wrap(A[pair[0]] + 30), 0) + '°');
      void k;
    } });
    bindRange('vl-vp', v => v + ' V', v => { Vp = v; st.redraw(); });
    bindRange('vl-th', v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°', v => { th0 = v; st.redraw(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ④ Δ 負載的線電流（12.4、12.5）：Ia = IAB − ICA = √3 IAB∠−30°
     ══════════════════════════════════════════════════════════ */
  (function dI() {
    const cv = document.getElementById('cv-di'); if (!cv) return;
    let Ip = 10, th0 = 0;
    const st = Stage(cv, { animate: false, ratio: 0.55, minH: 260, maxH: 360, draw(ctx, w, h) {
      const col = PHC(), cx = w / 2 - Math.min(50, w * 0.08), cy = h / 2, R = Math.max(10, Math.min(w, h) * 0.24);
      axes(ctx, cx, cy, R * 1.9);
      const A = [th0, th0 - 120, th0 + 120], nm = ['I<sub>AB</sub>', 'I<sub>BC</sub>', 'I<sub>CA</sub>'];
      A.forEach((a, i) => vec(ctx, cx, cy, R, a, col[i], nm[i], 2.2));
      const tip = [cx + R * Math.cos(A[0] * RAD), cy - R * Math.sin(A[0] * RAD)];
      ctx.setLineDash([5, 4]);
      const e = vec(ctx, tip[0], tip[1], R, A[2] + 180, col[2], '−I<sub>CA</sub>', 1.8);
      ctx.setLineDash([]);
      const L = Math.hypot(e[0] - cx, e[1] - cy), ang = Math.atan2(-(e[1] - cy), e[0] - cx) / RAD;
      vec(ctx, cx, cy, L, ang, C.ink, 'I<sub>a</sub>', 3, 14);
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.arc(cx, cy, R * 0.42, -A[0] * RAD, -(A[0] - 30) * RAD); ctx.stroke();
      const ma = (A[0] - 15) * RAD;
      label(ctx, cx + R * 0.56 * Math.cos(ma), cy - R * 0.56 * Math.sin(ma), '30°', C['ink-2'], 10.5, 'center', '700');
      setText('di-rp', num(Ip, 2) + ' A'); setText('di-il', num(Ip * Math.sqrt(3), 2) + ' A');
      setText('di-ang', 'I<sub>a</sub> = ' + num(Ip * Math.sqrt(3), 2) + '∠' + num(CX.wrap(th0 - 30), 0) + '°');
      const el = document.getElementById('di-ang'); if (el) el.innerHTML = 'I<sub>a</sub> = ' + num(Ip * Math.sqrt(3), 2) + '∠' + num(CX.wrap(th0 - 30), 0) + '°';
    } });
    bindRange('di-ip', v => v + ' A', v => { Ip = v; st.redraw(); });
    bindRange('di-th', v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°', v => { th0 = v; st.redraw(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ④b Δ-Δ（12.5）：電源電壓直接就是負載電壓；負載角 θ 決定相電流落後多少
     ══════════════════════════════════════════════════════════ */
  (function dd() {
    const cv = document.getElementById('cv-dd'); if (!cv) return;
    let V = 330, Zm = 25, th = -36.87;
    const st = Stage(cv, { animate: false, ratio: 0.55, minH: 260, maxH: 360, draw(ctx, w, h) {
      const col = PHC(), cx = w * 0.42, cy = h / 2, R = Math.max(10, Math.min(w * 0.28, h * 0.4));
      axes(ctx, cx, cy, R * 1.15);
      const Ip = V / Zm, IL = Math.sqrt(3) * Ip, kI = R * 0.9 / Math.max(IL, 1e-9);
      ['ab', 'bc', 'ca'].forEach((n, i) => { ctx.globalAlpha = 0.35; vec(ctx, cx, cy, R, -120 * i, col[i], i ? null : 'V<sub>ab</sub> = V<sub>AB</sub>', 1.6); ctx.globalAlpha = 1; });
      vec(ctx, cx, cy, Ip * kI, -th, col[0], 'I<sub>AB</sub>', 2.4);
      vec(ctx, cx, cy, IL * kI, -th - 30, C.ink, 'I<sub>a</sub>', 3);
      labelCJK(ctx, w * 0.72, h * 0.3, th < -0.5 ? '電容性：電流超前' : th > 0.5 ? '電感性：電流落後' : '純電阻：同相', C.accent, 12.5, 'left', '700');
      setText('dd-ip', num(Ip, 2) + ' A'); setText('dd-il', num(IL, 2) + ' A');
      const e = document.getElementById('dd-ang'); if (e) e.innerHTML = 'I<sub>AB</sub> = ' + num(Ip, 2) + '∠' + num(-th, 2) + '°，I<sub>a</sub> = ' + num(IL, 2) + '∠' + num(CX.wrap(-th - 30), 2) + '°';
    } });
    bindRange('dd-v', v => v + ' V', v => { V = v; st.redraw(); });
    bindRange('dd-z', v => v + ' Ω', v => { Zm = v; st.redraw(); });
    bindRange('dd-t', v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2) + '°', v => { th = v; st.redraw(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ 四種接法 → 全部化成 Y-Y 的單相等效（12.6、表 12.1）
     ══════════════════════════════════════════════════════════ */
  (function conn() {
    const cv = document.getElementById('cv-conn'); if (!cv) return;
    let s = 'Y', l = 'D';
    const INFO = {
      YY: { v: 'V<sub>L</sub> = √3 V<sub>p</sub>，線電壓超前相電壓 30°', i: 'I<sub>L</sub> = I<sub>p</sub>（線電流就是相電流）', eq: 'I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>', how: '本來就是 Y-Y，直接取 a 相。' },
      YD: { v: 'V<sub>AB</sub> = V<sub>ab</sub> = √3 V<sub>p</sub>∠30°（負載每相吃線電壓）', i: 'I<sub>L</sub> = √3 I<sub>p</sub>，線電流落後相電流 30°', eq: 'I<sub>a</sub> = V<sub>an</sub> / (Z<sub>Δ</sub>/3)', how: '負載 Δ → Y：Z<sub>Y</sub> = Z<sub>Δ</sub>/3。' },
      DD: { v: '線電壓 = 相電壓（電源每相就跨在兩條線之間）', i: 'I<sub>L</sub> = √3 I<sub>p</sub>，線電流落後相電流 30°', eq: 'I<sub>AB</sub> = V<sub>ab</sub> / Z<sub>Δ</sub>，I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°', how: '電源 Δ → Y：V<sub>an</sub> = V<sub>ab</sub>/√3∠−30°；負載 Z<sub>Δ</sub>/3。' },
      DY: { v: '線電壓 = 電源相電壓；負載每相只吃 V<sub>L</sub>/√3', i: 'I<sub>L</sub> = I<sub>p</sub>', eq: 'I<sub>a</sub> = V<sub>p</sub>∠−30° / (√3 Z<sub>Y</sub>)', how: '電源 Δ → Y：V<sub>an</sub> = V<sub>ab</sub>/√3∠−30°。' }
    };
    const st = Stage(cv, { animate: false, ratio: 0.42, minH: 220, maxH: 300, draw(ctx, w, h) {
      const key = s + l, narrow = w < 560;
      /* 左：原本的接法；右：化成的單相等效電路 */
      const half = w / 2, r = Math.max(10, Math.min(half * 0.28, h * 0.3));
      const cy = h * 0.5;
      const drawY = (x, y, col, lbl) => {
        [90, 210, 330].forEach(a => { ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r * Math.cos(a * RAD), y - r * Math.sin(a * RAD)); ctx.stroke(); });
        disc(ctx, x, y, 3.5, col);
        labelCJK(ctx, x, y + r * 0.5 + 22, lbl, col, 11.5, 'center', '700');
      };
      const drawD = (x, y, col, lbl) => {
        ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath();
        [90, 210, 330].forEach((a, i) => { const px = x + r * Math.cos(a * RAD), py = y - r * Math.sin(a * RAD); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
        ctx.closePath(); ctx.stroke();
        labelCJK(ctx, x, y + r * 0.5 + 22, lbl, col, 11.5, 'center', '700');
      };
      const sx = half * 0.28, lx = half * 0.75;
      (s === 'Y' ? drawY : drawD)(sx, cy - 6, C.ink, '電源 ' + (s === 'Y' ? 'Y' : 'Δ'));
      (l === 'Y' ? drawY : drawD)(lx, cy - 6, C.accent, '負載 ' + (l === 'Y' ? 'Y' : 'Δ'));
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(sx + r * 0.9, cy - 6); ctx.lineTo(lx - r * 0.9, cy - 6); ctx.stroke(); ctx.setLineDash([]);
      arrow(ctx, half - 10, cy - 6, half + 14, cy - 6, C['ink-2'], 2);
      /* 右邊單相等效 */
      const x0 = half + 30, x1 = w - 20, yt = cy - h * 0.22, yb = cy + h * 0.2;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, yt); ctx.lineTo(x1, yt); ctx.lineTo(x1, yb); ctx.lineTo(x0, yb); ctx.lineTo(x0, cy + 12); ctx.moveTo(x0, cy - 12); ctx.lineTo(x0, yt); ctx.stroke();
      ctx.beginPath(); ctx.arc(x0, cy, 12, 0, TAU); ctx.fillStyle = C.surface; ctx.fill(); ctx.stroke();
      const zx = (x0 + x1) / 2;
      ctx.fillStyle = C.surface; ctx.fillRect(zx - 22, yt - 8, 44, 16); ctx.strokeStyle = C.accent; ctx.strokeRect(zx - 22, yt - 8, 44, 16);
      label(ctx, zx, yt - 18, l === 'Y' ? 'Z<sub>Y</sub>' : 'Z<sub>Δ</sub>/3', C.accent, 12, 'center', '700');
      label(ctx, x0 + 18, cy, s === 'Y' ? 'V<sub>an</sub>' : 'V<sub>ab</sub>/√3∠−30°', C.ink, narrow ? 10 : 11.5, 'left', '700');
      labelCJK(ctx, (x0 + x1) / 2, yb + 18, '只算 a 相', C['ink-3'], 11, 'center');
      const I = INFO[key];
      const el = id => document.getElementById(id);
      if (el('conn-name')) el('conn-name').textContent = (s === 'Y' ? 'Y' : 'Δ') + '-' + (l === 'Y' ? 'Y' : 'Δ');
      if (el('conn-v')) el('conn-v').innerHTML = I.v;
      if (el('conn-i')) el('conn-i').innerHTML = I.i;
      if (el('conn-eq')) el('conn-eq').innerHTML = I.eq;
      if (el('conn-how')) el('conn-how').innerHTML = I.how;
    } });
    document.querySelectorAll('[data-conn-s]').forEach(b => b.addEventListener('click', () => { s = b.dataset.connS; document.querySelectorAll('[data-conn-s]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); st.redraw(); }));
    document.querySelectorAll('[data-conn-l]').forEach(b => b.addEventListener('click', () => { l = b.dataset.connL; document.querySelectorAll('[data-conn-l]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); st.redraw(); }));
  })();

  /* ══════════════════════════════════════════════════════════
     ⑥ 三相瞬時功率相加 = 常數（12.7）
     ══════════════════════════════════════════════════════════ */
  (function p3() {
    const cv = document.getElementById('cv-p3'); if (!cv) return;
    let th = 30, t0 = 0, playing = true, showSum = true;
    const btn = document.getElementById('p3-play');
    if (btn) btn.addEventListener('click', () => { playing = !playing; btn.textContent = playing ? '❚❚ 暫停' : '▶ 播放'; });
    const tg = document.getElementById('p3-sum');
    if (tg) tg.addEventListener('click', () => { showSum = !showSum; tg.setAttribute('aria-pressed', String(showSum)); });
    Stage(cv, { ratio: 0.46, minH: 240, maxH: 320, draw(ctx, w, h, dt) {
      if (playing) t0 += dt * 1.2;
      const col = PHC(), x0 = 44, x1 = w - 14, y0 = 14, y1 = h - 26;
      const pmax = 3.4, Y = p => lerp(y1, y0, (p + 0.4) / (pmax + 0.4));
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
      [0, 1, 2, 3].forEach(v => label(ctx, x0 - 6, Y(v), String(v), C['ink-3'], 10, 'right'));
      label(ctx, x0 - 6, y0 + 2, 'p/V<sub>p</sub>I<sub>p</sub>', C['ink-3'], 9.5, 'left');
      const N = 160, cyc = 2;
      const f = (t, k) => 2 * Math.cos(t + k) * Math.cos(t + k - th * RAD);   /* (√2)² = 2 */
      [0, -2 * Math.PI / 3, 2 * Math.PI / 3].forEach((k, i) => {
        ctx.strokeStyle = col[i]; ctx.lineWidth = 1.8; ctx.beginPath();
        for (let n = 0; n <= N; n++) { const t = t0 + n / N * cyc * 2 * Math.PI, x = lerp(x0, x1, n / N), y = Y(f(t, k)); n ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      });
      const tot = 3 * Math.cos(th * RAD);
      if (showSum) {
        ctx.strokeStyle = C.ink; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(x0, Y(tot)); ctx.lineTo(x1, Y(tot)); ctx.stroke();
        labelCJK(ctx, x1 - 4, Y(tot) - 10, '三相加起來 = ' + num(tot, 2) + '（一條水平線）', C.ink, 11.5, 'right', '700');
      }
      setText('p3-tot', num(tot, 3) + ' V<sub>p</sub>I<sub>p</sub>');
      const e = document.getElementById('p3-tot'); if (e) e.innerHTML = num(tot, 3) + ' V<sub>p</sub>I<sub>p</sub>';
      setText('p3-pf', num(Math.cos(th * RAD), 3));
      setText('p3-one', num(Math.cos(th * RAD) - 1, 2) + ' ～ ' + num(Math.cos(th * RAD) + 1, 2));
    } });
    bindRange('p3-th', v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°', v => { th = v; });
  })();

  /* ══════════════════════════════════════════════════════════
     ⑦ 不平衡 Y 負載：中性線電流 In = −(Ia + Ib + Ic)（12.8）
     ══════════════════════════════════════════════════════════ */
  (function unb() {
    const cv = document.getElementById('cv-unb'); if (!cv) return;
    const Z = [{ m: 15, a: 0 }, { m: 11.18, a: 26.57 }, { m: 10, a: -53.13 }];
    let Vp = 100, seq = 'acb';
    const st = Stage(cv, { animate: false, ratio: 0.55, minH: 270, maxH: 370, draw(ctx, w, h) {
      const col = PHC();
      const off = seq === 'abc' ? [0, -120, 120] : [0, 120, -120];
      const I = Z.map((z, i) => CX.p(Vp / z.m, off[i] - z.a));
      const sum = I.reduce((s, x) => CX.add(s, x), CX.c(0, 0)), In = CX.neg(sum);
      const big = Math.max(...I.map(CX.mag), CX.mag(sum), 1);
      const cx = w * 0.42, cy = h / 2, R = Math.max(10, Math.min(w * 0.3, h * 0.36)), k = R / big;
      axes(ctx, cx, cy, R * 1.25);
      const nm = ['I<sub>a</sub>', 'I<sub>b</sub>', 'I<sub>c</sub>'];
      I.forEach((x, i) => vec(ctx, cx, cy, CX.mag(x) * k, CX.ang(x), col[i], nm[i], 2.2));
      /* 首尾相接 */
      let px = cx, py = cy;
      ctx.globalAlpha = 0.45; ctx.setLineDash([4, 4]);
      I.forEach((x, i) => { const e = vec(ctx, px, py, CX.mag(x) * k, CX.ang(x), col[i], null, 1.6); px = e[0]; py = e[1]; });
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      if (CX.mag(sum) * k > 4) vec(ctx, cx, cy, CX.mag(In) * k, CX.ang(In), C.bad, 'I<sub>n</sub>', 3);
      else { disc(ctx, cx, cy, 6, C.ok); labelCJK(ctx, cx + 10, cy + 18, '加起來 = 0', C.ok, 11.5, 'left', '700'); }
      setText('unb-ia', CX.pol(I[0], 3, 1) + ' A'); setText('unb-ib', CX.pol(I[1], 3, 1) + ' A'); setText('unb-ic', CX.pol(I[2], 3, 1) + ' A');
      setText('unb-in', CX.pol(In, 3, 1) + ' A');
      const P = I.reduce((s, x, i) => s + CX.mag(x) ** 2 * Z[i].m * Math.cos(Z[i].a * RAD), 0);
      setText('unb-p', num(P, 0) + ' W');
    } });
    ['a', 'b', 'c'].forEach((n, i) => {
      bindRange('unb-m' + n, v => v + ' Ω', v => { Z[i].m = v; st.redraw(); });
      bindRange('unb-t' + n, v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°', v => { Z[i].a = v; st.redraw(); });
    });
    const bal = document.getElementById('unb-bal');
    if (bal) bal.addEventListener('click', () => {
      const v = document.getElementById('unb-ma').value, t = document.getElementById('unb-ta').value;
      ['b', 'c'].forEach(n => { const m = document.getElementById('unb-m' + n), a = document.getElementById('unb-t' + n); m.value = v; a.value = t; m.dispatchEvent(new Event('input')); a.dispatchEvent(new Event('input')); });
    });
    const sq = document.getElementById('unb-seq');
    if (sq) sq.addEventListener('click', () => { seq = seq === 'abc' ? 'acb' : 'abc'; sq.textContent = '相序：' + seq + '（點一下切換）'; st.redraw(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ⑧ Δ 電源的環流（12.9）：三顆電壓源接成一圈，只要加起來不是 0，電流就只受內阻限制
     ══════════════════════════════════════════════════════════ */
  (function loop() {
    const cv = document.getElementById('cv-loop'); if (!cv) return;
    let dv = 1, lr = -2, ph = 0;
    Stage(cv, { ratio: 0.46, minH: 240, maxH: 320, draw(ctx, w, h, dt) {
      const Vp = 208, r = Math.pow(10, lr);
      const sumV = CX.add(CX.add(CX.p(Vp * (1 + dv / 100), 0), CX.p(Vp, -120)), CX.p(Vp, 120));
      const I = CX.mag(sumV) / (3 * r);
      const cx = w * 0.3, cy = h * 0.54, R = Math.max(10, Math.min(w * 0.22, h * 0.36));
      const pts = [90, 210, 330].map(a => [cx + R * Math.cos(a * RAD), cy - R * Math.sin(a * RAD)]);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.stroke();
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % 3], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        ctx.beginPath(); ctx.arc(mx, my, 13, 0, TAU); ctx.fillStyle = C.surface; ctx.fill(); ctx.strokeStyle = C.ink; ctx.stroke();
        label(ctx, mx, my, '~', C.ink, 14, 'center', '700');
      });
      /* 環流的點：速度跟電流的對數成正比，避免爆表 */
      const sp = I > 1e-6 ? clamp(Math.log10(I + 1) * 0.35, 0.03, 1.6) : 0;
      ph = (ph + dt * sp) % 1;
      const per = 3 * R * Math.sqrt(3);
      for (let n = 0; n < 18; n++) {
        let s = ((n / 18 + ph) % 1) * per;
        const side = Math.floor(s / (per / 3)); s -= side * per / 3;
        const p = pts[side % 3], q = pts[(side + 1) % 3], t = s / (per / 3);
        if (sp > 0) disc(ctx, lerp(p[0], q[0], t), lerp(p[1], q[1], t), 3.6, I > 100 ? C.bad : C.accent);
      }
      const x0 = Math.min(w * 0.58, w - 210);
      labelCJK(ctx, x0, h * 0.2, '三個電壓相加：' + num(CX.mag(sumV), 2) + ' V', C.ink, 12.5, 'left', '700');
      labelCJK(ctx, x0, h * 0.2 + 26, '環路電阻：3r = ' + (3 * r < 0.01 ? (3 * r * 1e6).toPrecision(3) + ' μΩ' : num(3 * r, 3) + ' Ω'), C['ink-2'], 12, 'left');
      labelCJK(ctx, x0, h * 0.2 + 56, '環流 = ' + (I > 1e6 ? (I / 1e6).toPrecision(3) + ' MA' : I > 1e3 ? (I / 1e3).toPrecision(3) + ' kA' : num(I, 2) + ' A'), I > 100 ? C.bad : C.ok, 15, 'left', '700');
      labelCJK(ctx, x0, h * 0.2 + 84, I > 100 ? '線圈會燒掉 → Δ 電源很少用' : dv === 0 ? '完美平衡：沒有環流' : '還好，但很少有這麼大的內阻', C['ink-2'], 11.5, 'left');
      setText('loop-sum', num(CX.mag(sumV), 2) + ' V'); setText('loop-i', I > 1e3 ? (I / 1e3).toPrecision(3) + ' kA' : num(I, 2) + ' A');
    } });
    bindRange('loop-dv', v => v.toFixed(1) + ' %', v => { dv = v; });
    bindRange('loop-r', v => { const r = Math.pow(10, v); return r < 1e-3 ? (r * 1e6).toPrecision(2) + ' μΩ' : r < 1 ? (r * 1e3).toPrecision(2) + ' mΩ' : r.toPrecision(2) + ' Ω'; }, v => { lr = v; });
  })();

  /* ══════════════════════════════════════════════════════════
     ⑨ 兩瓦特計法（12.10）：P1 = VLIL cos(θ+30°)、P2 = VLIL cos(θ−30°)
     ══════════════════════════════════════════════════════════ */
  (function w2() {
    const cv = document.getElementById('cv-2w'); if (!cv) return;
    let th = 36.87, VL = 208, IL = 12;
    const st = Stage(cv, { animate: false, ratio: 0.46, minH: 240, maxH: 320, draw(ctx, w, h) {
      const P1 = VL * IL * Math.cos((th + 30) * RAD), P2 = VL * IL * Math.cos((th - 30) * RAD);
      const PT = P1 + P2, QT = Math.sqrt(3) * (P2 - P1), S = VL * IL;
      /* 長條：P1、P2、PT（同一個比例尺） */
      const x0 = 50, x1 = w - 16, my = h * 0.55, sc = (Math.min(h * 0.4, 120)) / (Math.sqrt(3) * S);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 - 10, my); ctx.lineTo(x1, my); ctx.stroke();
      const bars = [['P₁', P1, C['q-react']], ['P₂', P2, C['p-real']], ['P₁ + P₂', PT, C.accent]];
      const bw = Math.min(70, (x1 - x0) / 5), gap = (x1 - x0 - bw * 3) / 4;
      bars.forEach((b, i) => {
        const x = x0 + gap + i * (bw + gap), hh = b[1] * sc;
        ctx.fillStyle = b[2]; ctx.fillRect(x, hh >= 0 ? my - hh : my, bw, Math.abs(hh));
        labelCJK(ctx, x + bw / 2, hh >= 0 ? my - hh - 10 : my - hh + 12, num(b[1], 0) + ' W', b[2], 11.5, 'center', '700');
        labelCJK(ctx, x + bw / 2, hh >= 0 ? my + 14 : my - 12, b[0], C['ink-2'], 12, 'center', '700');
      });
      labelCJK(ctx, x0 - 6, 16, th > 60 ? 'θ > 60°：P₁ 變成負的（瓦特計反打）' : th < -60 ? 'θ < −60°：P₂ 變成負的' : Math.abs(th) < 0.5 ? 'θ = 0：P₁ = P₂，純電阻' : th > 0 ? 'P₂ > P₁：電感性' : 'P₁ > P₂：電容性', C.ink, 12, 'left', '700');
      setText('w2-p1', num(P1, 1) + ' W'); setText('w2-p2', num(P2, 1) + ' W'); setText('w2-pt', num(PT, 1) + ' W'); setText('w2-qt', num(QT, 1) + ' VAR');
      setText('w2-pf', num(Math.cos(th * RAD), 4) + (th > 0.5 ? ' lagging' : th < -0.5 ? ' leading' : ''));
    } });
    bindRange('w2-th', v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2) + '°', v => { th = v; st.redraw(); });
    bindRange('w2-vl', v => v + ' V', v => { VL = v; st.redraw(); });
    bindRange('w2-il', v => v + ' A', v => { IL = v; st.redraw(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ⑩ 家用單相三線 120/240 V 與漏電斷路器 GFCI（12.10.2）
     ══════════════════════════════════════════════════════════ */
  (function home() {
    const cv = document.getElementById('cv-home'); if (!cv) return;
    let P1 = 1200, P2 = 600, P3 = 2400, leak = 0, ph = 0;
    const tg = document.getElementById('home-leak');
    if (tg) tg.addEventListener('click', () => { leak = leak ? 0 : 0.03; tg.setAttribute('aria-pressed', String(!!leak)); tg.textContent = leak ? '⚡ 有人碰到黑線（漏電 30 mA）' : '模擬漏電（有人碰到黑線）'; });
    Stage(cv, { ratio: 0.5, minH: 260, maxH: 340, draw(ctx, w, h, dt) {
      const I1 = P1 / 120, I2 = P2 / 120, I3 = P3 / 240;
      const iB = I1 + I3 + leak, iR = -(I2 + I3), iW = -(I1 - I2);   /* 流出變壓器為正：黑線出、紅線回 */
      const sum = iB + iR + iW;
      const trip = Math.abs(sum) > 0.005;
      const yB = h * 0.22, yW = h * 0.5, yR = h * 0.78, x0 = 70, x1 = w - 20;
      /* 變壓器二次側：兩個 120 V 線圈串聯，中間抽頭接白線（中性） */
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      for (let i = 0; i < 2; i++) {
        const ya = i ? yW : yB, yb = i ? yR : yW;
        ctx.beginPath(); for (let n = 0; n < 4; n++) ctx.arc(x0 - 18, ya + (yb - ya) * (n + 0.5) / 4, (yb - ya) / 8, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        labelCJK(ctx, x0 - 32, (ya + yb) / 2, '120 V', C['ink-2'], 10.5, 'right', '600');
      }
      const wires = [[yB, '黑（火線）B', C.ink, iB], [yW, '白（中性線）W', C['ink-3'], iW], [yR, '紅（火線）R', C.bad, iR]];
      wires.forEach(([y, n, c, I]) => {
        ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 - 18, y); ctx.lineTo(x1, y); ctx.stroke();
        labelCJK(ctx, x0, y - 11, n, c, 11, 'left', '700');
        labelCJK(ctx, x0 + 128, y - 11, num(I, 2) + ' A', c, 11, 'left', '700');
      });
      /* 負載：B-W 之間 120 V、W-R 之間 120 V、B-R 之間 240 V */
      const lx = [x0 + (x1 - x0) * 0.52, x0 + (x1 - x0) * 0.68, x0 + (x1 - x0) * 0.86];
      const box = (x, ya, yb, t) => {
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, yb); ctx.stroke();
        const m = (ya + yb) / 2; ctx.fillStyle = C.surface; ctx.fillRect(x - 15, m - 14, 30, 28); ctx.strokeRect(x - 15, m - 14, 30, 28);
        labelCJK(ctx, x, m, t, C.ink, 10.5, 'center', '700');
      };
      box(lx[0], yB, yW, P1 + 'W'); box(lx[1], yW, yR, P2 + 'W'); box(lx[2], yB, yR, P3 + 'W');
      labelCJK(ctx, lx[0], yB - 26 < 8 ? 8 : yB - 26, '120 V', C['ink-3'], 10, 'center');
      labelCJK(ctx, lx[2], yB - 26 < 8 ? 8 : yB - 26, '240 V', C['ink-3'], 10, 'center');
      /* GFCI */
      const gx = x0 + 90;
      ctx.strokeStyle = trip ? C.bad : C.ok; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.strokeRect(gx - 16, yB - 20, 32, yR - yB + 40); ctx.setLineDash([]);
      labelCJK(ctx, gx, yR + 30 > h - 6 ? h - 6 : yR + 30, trip ? 'GFCI 跳脫！' : 'GFCI：iB+iW+iR = 0', trip ? C.bad : C.ok, 11, 'center', '700');
      if (leak) {
        ph = (ph + dt) % 1;
        const px = lx[0] - 40;
        ctx.strokeStyle = C.bad; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(px, yB); ctx.lineTo(px, h - 8); ctx.stroke(); ctx.setLineDash([]);
        labelCJK(ctx, px + 6, (yB + yW) / 2 + 6, '人體 → 大地', C.bad, 10.5, 'left', '700');
        disc(ctx, px, lerp(yB, h - 8, ph), 4, C.bad);
      }
      setText('home-ib', num(iB, 2) + ' A'); setText('home-iw', num(iW, 2) + ' A'); setText('home-ir', num(iR, 2) + ' A');
      setText('home-sum', num(sum * 1000, 0) + ' mA' + (trip ? '（跳脫）' : ''));
    } });
    bindRange('home-p1', v => v + ' W', v => { P1 = v; });
    bindRange('home-p2', v => v + ' W', v => { P2 = v; });
    bindRange('home-p3', v => v + ' W', v => { P3 = v; });
  })();
})();

/* ============================================================
   CH12 觀念小測驗（四頁共用）：__ch12Quiz(題庫, 結語) —— 中英對照、選項每次打亂
   ============================================================ */
window.__ch12Quiz = function (Q, verdicts) {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  let i = 0, score = 0, answered = false, ord = [];
  function render() {
    const q = Q[i];
    host.innerHTML =
      '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div>' +
      '<div class="quiz-body"><div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
      '<div class="q-text">' + q.zh + '</div><div class="q-en">' + q.en + '</div><div class="opts"></div><div class="explain" hidden></div></div>' +
      '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span><button class="btn" id="q-next" hidden>下一題 →</button></div>';
    const opts = host.querySelector('.opts');
    ord = shuffle(q.o.length);
    ord.forEach((src, k) => {
      const pair = q.o[src], b = document.createElement('button');
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
    const nx = host.querySelector('#q-next'); nx.hidden = false; nx.textContent = i < Q.length - 1 ? '下一題 →' : '看結果';
  }
  function done() {
    const r = score / Q.length;
    host.innerHTML = '<div class="bar"><i style="width:100%"></i></div><div class="quiz-body"><div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題</div>' +
      '<p>' + (r >= 0.8 ? verdicts[0] : r >= 0.5 ? verdicts[1] : verdicts[2]) + '</p></div>' +
      '<div class="quiz-foot"><span class="spacer"></span><button class="btn" id="q-again">再做一次</button></div>';
    host.querySelector('#q-again').addEventListener('click', () => { i = 0; score = 0; render(); });
  }
  render();
};
