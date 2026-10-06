/* ============================================================
   電路學 CH11 交流功率分析 — 互動模組（PART 1～3 三頁共用；頁面上沒有的 canvas 自動跳過）
   Sadiku, Fundamentals of Electric Circuits, Ch.11 AC Power Analysis
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, TAU, MONO, BODY, pointerPos } = E;

  const RAD = Math.PI / 180;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n);

  /* 相量小工具 */
  function polar(mag, angDeg) { return { re: mag * Math.cos(angDeg * RAD), im: mag * Math.sin(angDeg * RAD) }; }
  function magOf(re, im) { return Math.hypot(re, im); }
  function angOf(re, im) { return Math.atan2(im, re) / RAD; }

  /* ══════════════════════════════════════════════════════════
     ① 瞬時功率 p(t) 實驗室    11.2 Instantaneous and Average Power
     p(t) = ½VmIm cos(θv−θi) + ½VmIm cos(2ωt + θv + θi)
     ══════════════════════════════════════════════════════════ */
  (function instPower() {
    const cv = document.getElementById('cv-inst'); if (!cv) return;
    let Vm = 10, Im = 4, thV = 0, thI = -45, t0 = 0, playing = true;

    const st = Stage(cv, { ratio: 0.48, minH: 250, maxH: 330, draw(ctx, w, h, dt) {
      if (playing) t0 += dt * 0.55;
      const padL = 48, padR = 16, padT = 16, padB = 30;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;

      const P = 0.5 * Vm * Im * Math.cos((thV - thI) * RAD);
      const amp = 0.5 * Vm * Im;                       /* 2ω 項的振幅 */
      /* 縱軸涵蓋 p(t) 的實際範圍且一定包含 0（正負號才是重點） */
      const lo = Math.min(0, P - amp), hi = Math.max(0, P + amp);
      const pad = (hi - lo) * 0.14;
      const Yp = v => lerp(y1, y0, (v - (lo - pad)) / ((hi + pad) - (lo - pad)));
      const midP = Yp(0);
      const scaleP = (Yp(0) - Yp(1));

      /* 時間軸：畫兩個電壓週期 = 四個 p(t) 週期 */
      const cycles = 2, wt = ph => (ph / cycles) * TAU * cycles;
      const Xs = i => lerp(x0, x1, i / 260);
      const phase = i => (i / 260) * cycles * TAU + t0;

      /* 零線 */
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x0, midP); ctx.lineTo(x1, midP); ctx.stroke();
      label(ctx, x0 - 7, midP, '0', C['ink-3'], 10.5, 'right');

      /* p(t) 的正負區：正 = 電路吸收，負 = 功率回送電源 */
      const pv = i => P + amp * Math.cos(2 * phase(i) + (thV + thI) * RAD);
      [[1, C['p-real-w']], [-1, C['q-react-w']]].forEach(([sign, fillC]) => {
        ctx.beginPath(); ctx.moveTo(x0, midP);
        for (let i = 0; i <= 260; i++) {
          const y = midP - pv(i) * scaleP;
          ctx.lineTo(Xs(i), sign > 0 ? Math.min(y, midP) : Math.max(y, midP));
        }
        ctx.lineTo(x1, midP); ctx.closePath(); ctx.fillStyle = fillC; ctx.fill();
      });

      /* v(t) 與 i(t)：畫在同一張圖當參考，用細線 */
      const vScale = (y1 - y0) * 0.17 / Math.max(Vm, Im);
      [[Vm, thV, C['s-app'], 'v(t)'], [Im, thI, C['q-react'], 'i(t)']].forEach(([m, th, col, nm]) => {
        ctx.beginPath();
        for (let i = 0; i <= 260; i++) {
          const y = midP - m * Math.cos(phase(i) + th * RAD) * vScale;
          i ? ctx.lineTo(Xs(i), y) : ctx.moveTo(Xs(i), y);
        }
        ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.85; ctx.stroke(); ctx.globalAlpha = 1;
        const yEnd = midP - m * Math.cos(phase(260) + th * RAD) * vScale;
        label(ctx, x1 - 6, clamp(yEnd - 11, y0 + 6, y1 - 6), nm, col, 10.5, 'right', '700');
      });

      /* p(t) 主線 */
      ctx.beginPath();
      for (let i = 0; i <= 260; i++) { const y = midP - pv(i) * scaleP; i ? ctx.lineTo(Xs(i), y) : ctx.moveTo(Xs(i), y); }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke();

      /* 平均功率 P 的水平線 */
      const yP = midP - P * scaleP;
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C['p-real']; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, yP); ctx.lineTo(x1, yP); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, x0 + 6, yP - 10, 'P = ½VmIm cos(θv−θi) = ' + fix(P) + ' W', C['p-real'], 11, 'left', '700');

      labelCJK(ctx, x0, y1 + 15, '藍綠 = 電路吸收功率', C['p-real'], 11, 'left');
      labelCJK(ctx, x1, y1 + 15, '橘 = 功率送回電源', C['q-react'], 11, 'right');
    }});

    function refresh() {
      const d = thV - thI;
      const P = 0.5 * Vm * Im * Math.cos(d * RAD);
      const Q = 0.5 * Vm * Im * Math.sin(d * RAD);
      setText('inst-P', fix(P) + ' W');
      setText('inst-Q', fix(Q) + ' VAR');
      setText('inst-d', fix(d, 1) + '°');
      setText('inst-pf', fix(Math.cos(d * RAD), 3));
      const kind = Math.abs(d) < 0.5 ? '純電阻'
        : Math.abs(Math.abs(d) - 90) < 0.5 ? '純電抗（純電感或純電容）'
        : d > 0 ? '電感性（電流落後電壓，lagging）' : '電容性（電流超前電壓，leading）';
      setText('inst-kind', kind);
      setText('inst-note', Math.abs(d) < 0.5
        ? 'θv = θi：p(t) 全程 ≥ 0，電阻任何時刻都在吸收功率，沒有任何能量送回電源。'
        : Math.abs(Math.abs(d) - 90) < 0.5
        ? 'θv − θi = ±90°：cos(±90°) = 0，所以 P = 0。正負面積完全相等 —— 純電感與純電容平均不消耗功率，只是把能量借來還去。'
        : '正負面積不等，差額就是平均功率 P。負的部分是儲能元件（電感、電容）把能量送回電源。');
    }
    bindRange('inst-vm', v => v.toFixed(0) + ' V', v => { Vm = v; refresh(); });
    bindRange('inst-im', v => v.toFixed(0) + ' A', v => { Im = v; refresh(); });
    bindRange('inst-thv', v => v.toFixed(0) + '°', v => { thV = v; refresh(); });
    bindRange('inst-thi', v => v.toFixed(0) + '°', v => { thI = v; refresh(); });
    document.querySelectorAll('[data-inst]').forEach(b => b.addEventListener('click', () => {
      const [a, c] = b.dataset.inst.split(',');
      const ev = new Event('input');
      const ev2 = document.getElementById('inst-thv'); ev2.value = a; ev2.dispatchEvent(ev);
      const ev3 = document.getElementById('inst-thi'); ev3.value = c; ev3.dispatchEvent(new Event('input'));
    }));
    document.getElementById('inst-play').addEventListener('click', function () {
      playing = !playing; this.textContent = playing ? '暫停' : '播放';
      this.setAttribute('aria-pressed', String(!playing));
    });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ② 最大功率轉移挑戰    11.3 Maximum Average Power Transfer
     ZL = ZTh*  →  Pmax = |VTh|² / (8·RTh)
     ══════════════════════════════════════════════════════════ */
  (function maxPower() {
    const cv = document.getElementById('cv-mpt'); if (!cv) return;
    let RTh = 4, XTh = 3, RL = 8, XL = 6, VTh = 20, best = 0, pulse = 0;

    function powerOf(rl, xl) {
      const den = Math.pow(RTh + rl, 2) + Math.pow(XTh + xl, 2);
      return den === 0 ? 0 : (VTh * VTh * rl / 2) / den;
    }
    const pMax = () => VTh * VTh / (8 * RTh);

    const st = Stage(cv, { ratio: 0.46, minH: 230, maxH: 300, draw(ctx, w, h, dt) {
      pulse += dt;
      const P = powerOf(RL, XL), Pm = pMax(), ratio = clamp(P / Pm, 0, 1);

      /* 左：電路示意（戴維寧等效 + 負載） */
      const cw = Math.min(w * 0.46, 330), cx = 14, cy = h / 2;
      ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      const bx = cx + 26, bw = cw - 56, top = cy - 48, bot = cy + 48;
      ctx.beginPath();
      ctx.moveTo(bx, top); ctx.lineTo(bx + bw, top);
      ctx.moveTo(bx, bot); ctx.lineTo(bx + bw, bot);
      ctx.moveTo(bx, top); ctx.lineTo(bx, cy - 16);
      ctx.moveTo(bx, cy + 16); ctx.lineTo(bx, bot);
      ctx.stroke();
      /* 電源符號 */
      disc(ctx, bx, cy, 16, C.surface, C['ink-2']);
      label(ctx, bx, cy - 4, '∼', C['ink-2'], 15, 'center', '700');
      label(ctx, bx - 8, cy + 30, 'VTh', C['ink-2'], 10.5, 'right');
      /* ZTh 方塊 */
      const zx = bx + bw * 0.42;
      ctx.fillStyle = C['surface-2']; ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.rect(zx - 34, top - 11, 68, 22); ctx.fill(); ctx.stroke();
      label(ctx, zx, top, 'ZTh', C['ink-2'], 11, 'center', '700');
      label(ctx, zx, top - 20, RTh + ' + j' + XTh, C['ink-3'], 10);
      /* ZL 方塊（依匹配程度變色） */
      const lx = bx + bw;
      const lc = ratio > 0.995 ? C['p-real'] : ratio > 0.8 ? C.warn : C['ink-3'];
      ctx.fillStyle = ratio > 0.995 ? C['p-real-w'] : C.surface;
      ctx.strokeStyle = lc; ctx.lineWidth = ratio > 0.995 ? 2.4 : 1.6;
      ctx.beginPath(); ctx.rect(lx - 22, cy - 30, 44, 60); ctx.fill(); ctx.stroke();
      label(ctx, lx, cy - 6, 'ZL', lc, 12, 'center', '700');
      label(ctx, lx, cy + 10, fix(RL, 1) + (XL >= 0 ? '+j' : '−j') + fix(Math.abs(XL), 1), lc, 9.5);
      if (ratio > 0.995) {
        const r = 30 + Math.sin(pulse * 3.4) * 4;
        ctx.beginPath(); ctx.arc(lx, cy, r, 0, TAU);
        ctx.strokeStyle = C['p-real']; ctx.globalAlpha = 0.45; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;
      }

      /* 右：功率計 —— 目前功率 vs 理論最大 */
      const gx0 = cw + 26, gx1 = w - 18, gy0 = 30, gy1 = h - 42;
      ctx.fillStyle = C['surface-2']; ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
      const fillH = (gy1 - gy0) * ratio;
      ctx.fillStyle = ratio > 0.995 ? C['p-real'] : C['s-app'];
      ctx.fillRect(gx0, gy1 - fillH, gx1 - gx0, fillH);
      ctx.strokeStyle = C['p-real']; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(gx0 - 6, gy0); ctx.lineTo(gx1 + 4, gy0); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, gx1 + 2, gy0 - 11, 'Pmax = ' + fix(Pm, 2) + ' W', C['p-real'], 10.5, 'right', '700');
      label(ctx, (gx0 + gx1) / 2, gy1 - fillH - 13, fix(P, 2) + ' W',
        ratio > 0.995 ? C['p-real'] : C['s-app'], 13, 'center', '700');
      labelCJK(ctx, (gx0 + gx1) / 2, gy1 + 15, '負載取得的平均功率', C['ink-3'], 11);
      label(ctx, (gx0 + gx1) / 2, 14, (ratio * 100).toFixed(1) + ' %', C['ink-2'], 11.5, 'center', '700');
    }});

    function refresh() {
      const P = powerOf(RL, XL), Pm = pMax();
      best = Math.max(best, P);
      setText('mpt-P', fix(P, 3) + ' W');
      setText('mpt-Pmax', fix(Pm, 3) + ' W');
      setText('mpt-pct', (clamp(P / Pm, 0, 1) * 100).toFixed(1) + ' %');
      setText('mpt-target', RTh + ' − j' + XTh + '  (= ZTh*)');
      const hit = Math.abs(RL - RTh) < 0.06 && Math.abs(XL + XTh) < 0.06;
      const el = document.getElementById('mpt-msg');
      el.className = 'msg ' + (hit ? 'good' : '');
      el.textContent = hit
        ? '✓ 匹配成功！ZL = ZTh* = ' + RTh + ' − j' + XTh + '，此時 Pmax = |VTh|²/(8RTh) = ' + fix(Pm, 3) + ' W。'
        : (Math.abs(XL + XTh) >= 0.06
            ? '先把電抗抵銷：XL 要等於 −XTh = ' + (-XTh) + '（讓總電抗歸零、電路呈純電阻）。'
            : '電抗已抵銷。再把 RL 調到等於 RTh = ' + RTh + '。');
    }
    bindRange('mpt-rl', v => v.toFixed(1) + ' Ω', v => { RL = v; refresh(); });
    bindRange('mpt-xl', v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + ' Ω', v => { XL = v; refresh(); });
    document.getElementById('mpt-auto').addEventListener('click', () => {
      const a = document.getElementById('mpt-rl'), b = document.getElementById('mpt-xl');
      a.value = RTh; b.value = -XTh;
      a.dispatchEvent(new Event('input')); b.dispatchEvent(new Event('input'));
    });
    document.getElementById('mpt-new').addEventListener('click', () => {
      RTh = 2 + Math.floor(Math.random() * 8);
      XTh = -6 + Math.floor(Math.random() * 13);
      VTh = 10 + Math.floor(Math.random() * 5) * 5;
      setText('mpt-zth', RTh + (XTh >= 0 ? ' + j' : ' − j') + Math.abs(XTh) + ' Ω');
      setText('mpt-vth', VTh + ' V (振幅)');
      const a = document.getElementById('mpt-rl'), b = document.getElementById('mpt-xl');
      a.value = 1; b.value = 0;
      a.dispatchEvent(new Event('input')); b.dispatchEvent(new Event('input'));
    });
    setText('mpt-zth', RTh + ' + j' + XTh + ' Ω');
    setText('mpt-vth', VTh + ' V (振幅)');
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 均方根值 RMS 三步驟    11.4 Effective or RMS Value
     Xrms = √( (1/T)∫x² dt )  —— 平方 → 取平均 → 開根號
     ══════════════════════════════════════════════════════════ */
  (function rmsLab() {
    const cv = document.getElementById('cv-rms'); if (!cv) return;
    let shape = 'sine', stage = 0, Am = 10;   /* stage: 0 原波形 1 平方 2 均值 3 開根號 */

    const SHAPES = {
      sine:   { name: '弦波 sine',        f: t => Math.cos(t * TAU),  rms: A => A / Math.SQRT2, txt: 'Vm/√2 ≈ 0.707 Vm' },
      square: { name: '方波 square',      f: t => (t % 1 < 0.5 ? 1 : -1), rms: A => A,          txt: 'Vm （方波的 rms 就是振幅）' },
      tri:    { name: '三角波 triangle',  f: t => 4 * Math.abs(((t + 0.25) % 1) - 0.5) - 1, rms: A => A / Math.sqrt(3), txt: 'Vm/√3 ≈ 0.577 Vm' },
      saw:    { name: '鋸齒波 sawtooth',  f: t => 2 * ((t % 1)) - 1,  rms: A => A / Math.sqrt(3), txt: 'Vm/√3 ≈ 0.577 Vm' }
    };

    const st = Stage(cv, { animate: false, ratio: 0.46, minH: 230, maxH: 300, draw(ctx, w, h) {
      const padL = 52, padR = 16, padT = 20, padB = 34;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const S = SHAPES[shape];
      const sq = stage >= 1;
      const top = sq ? Am * Am * 1.15 : Am * 1.3;
      const bot = sq ? 0 : -Am * 1.3;
      const Y = v => lerp(y1, y0, (v - bot) / (top - bot));
      const X = i => lerp(x0, x1, i / 300);

      /* 軸 */
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      const ticks = sq ? [0, Am * Am / 2, Am * Am] : [-Am, 0, Am];
      ticks.forEach(v => {
        ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke();
        label(ctx, x0 - 7, Y(v), fix(v, 0), C['ink-3'], 10.5, 'right');
      });
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke();

      /* 波形（第 1 階段以後畫平方） */
      const val = i => { const v = Am * S.f(i / 300 * 2); return sq ? v * v : v; };
      if (sq) {
        ctx.beginPath(); ctx.moveTo(x0, Y(0));
        for (let i = 0; i <= 300; i++) ctx.lineTo(X(i), Y(val(i)));
        ctx.lineTo(x1, Y(0)); ctx.closePath();
        ctx.fillStyle = C['s-app-w']; ctx.fill();
      }
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) { const y = Y(val(i)); i ? ctx.lineTo(X(i), y) : ctx.moveTo(X(i), y); }
      ctx.strokeStyle = sq ? C['s-app'] : C.ink; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke();

      /* 平方的平均值 */
      const meanSq = S.rms(Am) * S.rms(Am);
      if (stage >= 2) {
        ctx.setLineDash([5, 4]); ctx.strokeStyle = C['q-react']; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0, Y(meanSq)); ctx.lineTo(x1, Y(meanSq)); ctx.stroke(); ctx.setLineDash([]);
        label(ctx, x1 - 4, Y(meanSq) - 11, '平均 = ' + fix(meanSq, 1), C['q-react'], 11, 'right', '700');
      }
      if (stage >= 3) {
        ctx.setLineDash([3, 3]); ctx.strokeStyle = C['p-real']; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(x0, Y(Math.sqrt(meanSq) * (sq ? 1 : 1))); ctx.lineTo(x1, Y(Math.sqrt(meanSq))); ctx.stroke(); ctx.setLineDash([]);
        label(ctx, x0 + 6, Y(Math.sqrt(meanSq)) - 11, 'Xrms = √平均 = ' + fix(Math.sqrt(meanSq), 2), C['p-real'], 11.5, 'left', '700');
      }
      const names = ['① 原始波形 x(t)', '② 先平方 x²(t)', '③ 取一週期的平均', '④ 再開根號 → rms'];
      labelCJK(ctx, x0, y1 + 16, names[stage], C['ink-2'], 12, 'left', '600');
    }});

    function refresh() {
      const S = SHAPES[shape], rms = S.rms(Am);
      setText('rms-shape', S.name);
      setText('rms-am', Am + ' V');
      setText('rms-val', fix(rms, 3) + ' V');
      setText('rms-formula', S.txt);
      setText('rms-p', fix(rms * rms / 10, 2) + ' W');
      document.querySelectorAll('[data-shape]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.shape === shape)));
      st.redraw();
    }
    document.querySelectorAll('[data-shape]').forEach(b => b.addEventListener('click', () => { shape = b.dataset.shape; refresh(); }));
    document.getElementById('rms-step').addEventListener('click', function () {
      stage = (stage + 1) % 4;
      this.textContent = ['開始：平方 →', '取平均 →', '開根號 →', '重來 ↺'][stage];
      refresh();
    });
    bindRange('rms-amp', v => v + ' V', v => { Am = v; refresh(); });
    refresh();
  })();
})();

/* ============================================================
   CH11 互動模組（續）：功率因數、複功率、守恆、功因校正、應用
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, TAU, MONO, BODY, pointerPos } = E;
  const RAD = Math.PI / 180;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n);

  /* ══════════════════════════════════════════════════════════
     ④ 相量圖 × 功率因數    11.5 Apparent Power and Power Factor
     pf = cos(θv − θi)，落後 lagging / 超前 leading
     ══════════════════════════════════════════════════════════ */
  (function pfLab() {
    const cv = document.getElementById('cv-pf'); if (!cv) return;
    let Vr = 120, Ir = 5, dth = 36.87, spin = 0, rotate = true;

    const st = Stage(cv, { ratio: 0.5, minH: 250, maxH: 320, draw(ctx, w, h, dt) {
      if (rotate) spin += dt * 48;
      const cx = Math.min(w * 0.28, 170), cy = h / 2;
      const R = Math.max(12, Math.min(cy - 26, cx - 22));

      /* 相量圖：V 當基準，I 落後 dth 度 */
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - R - 8, cy); ctx.lineTo(cx + R + 8, cy);
      ctx.moveTo(cx, cy - R - 8); ctx.lineTo(cx, cy + R + 8); ctx.stroke();

      const aV = -spin * RAD, aI = (-spin - dth) * RAD;
      const rV = R * 0.88, rI = R * 0.62;
      arrow(ctx, cx, cy, cx + Math.cos(aV) * rV, cy + Math.sin(aV) * rV, C['s-app'], 2.4);
      arrow(ctx, cx, cy, cx + Math.cos(aI) * rI, cy + Math.sin(aI) * rI, C['q-react'], 2.4);
      label(ctx, cx + Math.cos(aV) * (rV + 13), cy + Math.sin(aV) * (rV + 13), 'V', C['s-app'], 12, 'center', '700');
      label(ctx, cx + Math.cos(aI) * (rI + 13), cy + Math.sin(aI) * (rI + 13), 'I', C['q-react'], 12, 'center', '700');

      /* 夾角弧 */
      if (Math.abs(dth) > 1) {
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.3, aV, aI, dth > 0);
        ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.6; ctx.stroke();
        const am = (aV + aI) / 2;
        label(ctx, cx + Math.cos(am) * R * 0.42, cy + Math.sin(am) * R * 0.42, fix(Math.abs(dth), 0) + '°', C['ink-2'], 11, 'center', '700');
      }
      labelCJK(ctx, cx, h - 10, '相量圖（逆時針轉）', C['ink-3'], 11);

      /* 右側：S / P 的比例條 */
      const bx0 = cx + R + 40, bx1 = w - 20;
      if (bx1 - bx0 > 90) {
        const S = Vr * Ir, P = S * Math.cos(dth * RAD), Q = S * Math.sin(dth * RAD);
        const rowY = [cy - 46, cy - 6, cy + 34];
        const maxW = bx1 - bx0;
        [[S, S, 'S 視在功率', C['s-app'], 'VA'], [Math.abs(P), S, 'P 實功率', C['p-real'], 'W'],
         [Math.abs(Q), S, 'Q 虛功率', C['q-react'], 'VAR']].forEach(([v, ref, nm, col, unit], k) => {
          const y = rowY[k];
          labelCJK(ctx, bx0, y - 13, nm, C['ink-2'], 11.5, 'left', '600');
          ctx.fillStyle = C['surface-2']; ctx.fillRect(bx0, y, maxW, 15);
          ctx.fillStyle = col; ctx.fillRect(bx0, y, maxW * clamp(v / ref, 0, 1), 15);
          label(ctx, bx1, y + 25, fix(k === 1 ? P : k === 2 ? Q : S, 0) + ' ' + unit, col, 11, 'right', '700');
        });
      }
    }});

    function refresh() {
      const S = Vr * Ir, pf = Math.cos(dth * RAD);
      const P = S * pf, Q = S * Math.sin(dth * RAD);
      setText('pf-S', fix(S, 0) + ' VA');
      setText('pf-P', fix(P, 0) + ' W');
      setText('pf-Q', fix(Q, 0) + ' VAR');
      setText('pf-pf', fix(Math.abs(pf), 3) + (Math.abs(dth) < 0.5 ? '（單位 unity）' : dth > 0 ? ' 落後 lagging' : ' 超前 leading'));
      setText('pf-note', Math.abs(dth) < 0.5
        ? 'θv = θi：pf = 1，S 完全等於 P，沒有虛功率。這是最理想的狀態。'
        : dth > 0
        ? '電流落後電壓 → 電感性負載（馬達、變壓器）→ pf 落後（lagging），Q > 0。'
        : '電流超前電壓 → 電容性負載 → pf 超前（leading），Q < 0。');
    }
    bindRange('pf-v', v => v + ' V', v => { Vr = v; refresh(); });
    bindRange('pf-i', v => v + ' A', v => { Ir = v; refresh(); });
    bindRange('pf-th', v => (v > 0 ? '+' : '') + v.toFixed(0) + '°', v => { dth = v; refresh(); });
    document.getElementById('pf-spin').addEventListener('click', function () {
      rotate = !rotate; this.textContent = rotate ? '停止旋轉' : '開始旋轉';
    });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ 功率三角形    11.6 Complex Power
     S = P + jQ,  |S| = √(P²+Q²),  ∠S = θv − θi
     ══════════════════════════════════════════════════════════ */
  (function triangle() {
    const cv = document.getElementById('cv-tri'); if (!cv) return;
    let P = 800, Q = 600, drag = false;

    const PMAX = 1400, QPOS = 900, QNEG = 700;
    function geom(w, h) {
      const panel = w > 620 ? 190 : 0;          /* 右側性質說明欄 */
      const oy = 24 + (h - 54) * 0.62;          /* 正 Q 給多一點空間 */
      const s = Math.max(0.02, Math.min(
        (w - panel - 130) / PMAX,               /* 水平：留出標籤空間 */
        (oy - 30) / QPOS,                       /* 向上 */
        (h - 26 - oy) / QNEG));                 /* 向下 */
      const dw = PMAX * s;
      const ox = Math.max(52, (w - panel - dw) / 2);
      return { ox, oy, s, panel };
    }

    const st = Stage(cv, { animate: false, ratio: 0.42, minH: 300, maxH: 420, draw(ctx, w, h) {
      const g = geom(w, h), S = Math.hypot(P, Q), th = Math.atan2(Q, P) / RAD;
      const px = g.ox + P * g.s, qy = g.oy - Q * g.s;

      /* 軸 */
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      const axR = g.ox + PMAX * g.s;
      ctx.beginPath(); ctx.moveTo(g.ox - 14, g.oy); ctx.lineTo(axR, g.oy);
      ctx.moveTo(g.ox, h - 16); ctx.lineTo(g.ox, 22); ctx.stroke();
      label(ctx, g.ox - 6, 26, 'Im (Q)', C['ink-3'], 10, 'right');
      label(ctx, axR, g.oy + 16, 'Re (P)', C['ink-3'], 10, 'right');

      /* 三角形填色 */
      ctx.beginPath(); ctx.moveTo(g.ox, g.oy); ctx.lineTo(px, g.oy); ctx.lineTo(px, qy); ctx.closePath();
      ctx.fillStyle = Q >= 0 ? C['q-react-w'] : C['s-app-w']; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1;

      /* P 邊（實功率，水平） */
      ctx.strokeStyle = C['p-real']; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(g.ox, g.oy); ctx.lineTo(px, g.oy); ctx.stroke();
      label(ctx, (g.ox + px) / 2, g.oy + 16, 'P = ' + fix(P, 0) + ' W', C['p-real'], 11.5, 'center', '700');

      /* Q 邊（虛功率，垂直） */
      ctx.strokeStyle = C['q-react']; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(px, g.oy); ctx.lineTo(px, qy); ctx.stroke();
      label(ctx, px + 9, (g.oy + qy) / 2, 'Q = ' + fix(Q, 0) + ' VAR', C['q-react'], 11.5, 'left', '700');

      /* S 斜邊（複功率） */
      arrow(ctx, g.ox, g.oy, px, qy, C['s-app'], 3);
      label(ctx, (g.ox + px) / 2 - 16, (g.oy + qy) / 2 - 12, 'S = ' + fix(S, 0) + ' VA', C['s-app'], 12, 'center', '700');

      /* 夾角 θ */
      if (Math.abs(th) > 1.5) {
        ctx.beginPath(); ctx.arc(g.ox, g.oy, 30, 0, -th * RAD, Q > 0);
        ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.5; ctx.stroke();
        label(ctx, g.ox + 42, g.oy - (Q > 0 ? 13 : -13), 'θ = ' + fix(th, 1) + '°', C['ink-2'], 11, 'left', '700');
      }

      /* 可拖曳的頂點 */
      disc(ctx, px, qy, 7, C['s-app'], C.surface);
      labelCJK(ctx, g.ox - 14, 16, '拖曳紫點改變 P 與 Q', C['ink-3'], 11, 'left');

      /* 右側：象限與負載性質 */
      const rx = w - g.panel + 18;
      if (g.panel) {
        const lines = Q > 1 ? ['Q > 0', '電感性 inductive', 'pf 落後 lagging', 'S 在第一象限']
          : Q < -1 ? ['Q < 0', '電容性 capacitive', 'pf 超前 leading', 'S 在第四象限']
          : ['Q = 0', '純電阻 resistive', 'pf = 1 單位功因', 'S 落在實軸上'];
        const col = Q > 1 ? C['q-react'] : Q < -1 ? C['s-app'] : C['p-real'];
        ctx.fillStyle = C['surface-2']; ctx.fillRect(rx - 10, h / 2 - 54, w - rx + 4, 108);
        lines.forEach((t, i) => labelCJK(ctx, rx, h / 2 - 34 + i * 23, t, i === 0 ? col : C['ink-2'], i === 0 ? 14 : 12, 'left', i === 0 ? '700' : '500'));
      }
    }});

    function pick(ev) {
      const p = pointerPos(cv, ev), g = geom(st.w, st.h);
      P = clamp((p.x - g.ox) / g.s, 0, PMAX);
      Q = clamp((g.oy - p.y) / g.s, -QNEG, QPOS);
      sync();
    }
    cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); pick(e); });
    cv.addEventListener('pointermove', e => { if (drag) pick(e); });
    cv.addEventListener('pointerup', () => { drag = false; });

    function sync() {
      document.getElementById('tri-p').value = Math.round(P);
      document.getElementById('tri-q').value = Math.round(Q);
      document.getElementById('tri-p').dispatchEvent(new Event('input'));
      document.getElementById('tri-q').dispatchEvent(new Event('input'));
    }
    function refresh() {
      const S = Math.hypot(P, Q), th = Math.atan2(Q, P) / RAD;
      setText('tri-S', fix(S, 1) + ' VA');
      setText('tri-th', fix(th, 2) + '°');
      setText('tri-pf', fix(Math.cos(th * RAD), 3) + (Math.abs(Q) < 1 ? '' : Q > 0 ? ' 落後' : ' 超前'));
      setText('tri-kind', Q > 1 ? '電感性（inductive）' : Q < -1 ? '電容性（capacitive）' : '純電阻（resistive）');
      st.redraw();
    }
    bindRange('tri-p', v => v + ' W', v => { P = v; refresh(); });
    bindRange('tri-q', v => v + ' VAR', v => { Q = v; refresh(); });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑥ 交流功率守恆    11.7 Conservation of AC Power
     S 總 = ΣS，P 總 = ΣP，Q 總 = ΣQ，但 |S總| ≠ Σ|Si| ← 考試陷阱
     ══════════════════════════════════════════════════════════ */
  (function conserve() {
    const cv = document.getElementById('cv-cons'); if (!cv) return;
    const loads = [{ P: 600, Q: 800 }, { P: 900, Q: -400 }, { P: 400, Q: 300 }];
    const COL = [C => C['p-real'], C => C['q-react'], C => C['s-app']];

    const st = Stage(cv, { animate: false, ratio: 0.5, minH: 250, maxH: 320, draw(ctx, w, h) {
      const tP = loads.reduce((a, l) => a + l.P, 0), tQ = loads.reduce((a, l) => a + l.Q, 0);
      const tS = Math.hypot(tP, tQ), sumS = loads.reduce((a, l) => a + Math.hypot(l.P, l.Q), 0);

      const s = Math.min((w - 190) / Math.max(tP, 1), (h - 108) / (Math.max(Math.abs(tQ), 400) * 2));
      const oy = h - 46, ox = Math.max(52, (w - 150 - tP * s) / 2);

      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox - 16, oy); ctx.lineTo(ox + tP * s + 30, oy);
      ctx.moveTo(ox, oy + 28); ctx.lineTo(ox, 26); ctx.stroke();
      label(ctx, ox - 6, 30, 'Q', C['ink-3'], 10, 'right');
      label(ctx, w - 18, oy + 16, 'P', C['ink-3'], 10, 'right');

      /* 各負載的 S 向量首尾相接 —— 直接看出向量相加 */
      let cx = ox, cy = oy;
      loads.forEach((l, i) => {
        const nx = cx + l.P * s, ny = cy - l.Q * s;
        arrow(ctx, cx, cy, nx, ny, COL[i](C), 2);
        label(ctx, (cx + nx) / 2, (cy + ny) / 2 - 11, 'S' + (i + 1), COL[i](C), 11, 'center', '700');
        cx = nx; cy = ny;
      });
      /* 總和向量 */
      arrow(ctx, ox, oy, ox + tP * s, oy - tQ * s, C.ink, 3);
      label(ctx, ox + tP * s + 6, oy - tQ * s - 8, 'S總 = ' + fix(tS, 0) + ' VA', C.ink, 12, 'left', '700');
      labelCJK(ctx, ox - 16, 15, '三個 S 向量首尾相接，終點就是總和', C['ink-3'], 11, 'left');
      labelCJK(ctx, w - 16, h - 14, '注意：|S總| ≠ |S1|+|S2|+|S3| = ' + fix(sumS, 0), C.bad, 11.5, 'right', '600');
    }});

    function refresh() {
      const tP = loads.reduce((a, l) => a + l.P, 0), tQ = loads.reduce((a, l) => a + l.Q, 0);
      const tS = Math.hypot(tP, tQ), sumS = loads.reduce((a, l) => a + Math.hypot(l.P, l.Q), 0);
      setText('cons-P', fix(tP, 0) + ' W');
      setText('cons-Q', fix(tQ, 0) + ' VAR');
      setText('cons-S', fix(tS, 1) + ' VA');
      setText('cons-sum', fix(sumS, 1) + ' VA');
      setText('cons-diff', '相差 ' + fix(sumS - tS, 1) + ' VA');
      loads.forEach((l, i) => {
        setText('cons-s' + (i + 1), fix(Math.hypot(l.P, l.Q), 1) + ' VA');
      });
      st.redraw();
    }
    [1, 2, 3].forEach(i => {
      bindRange('cons-p' + i, v => v + ' W', v => { loads[i - 1].P = v; refresh(); });
      bindRange('cons-q' + i, v => v + ' VAR', v => { loads[i - 1].Q = v; refresh(); });
    });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑦ 功率因數校正    11.8 Power Factor Correction
     QC = P(tanθ1 − tanθ2),  C = QC / (ω·Vrms²)
     ══════════════════════════════════════════════════════════ */
  (function pfc() {
    const cv = document.getElementById('cv-pfc'); if (!cv) return;
    let Pw = 4000, pf1 = 0.8, pf2 = 0.95, Vrms = 120, f = 60;

    const th1 = () => Math.acos(clamp(pf1, 0.05, 1)) / RAD;
    const th2 = () => Math.acos(clamp(pf2, 0.05, 1)) / RAD;

    const st = Stage(cv, { animate: false, ratio: 0.5, minH: 250, maxH: 320, draw(ctx, w, h) {
      const t1 = th1(), t2 = th2();
      const Q1 = Pw * Math.tan(t1 * RAD), Q2 = Pw * Math.tan(t2 * RAD);
      const S1 = Pw / Math.cos(t1 * RAD), S2 = Pw / Math.cos(t2 * RAD);

      const s = Math.min((w - 210) / Math.max(Pw, 1), (h - 76) / Math.max(Q1, 1));
      const oy = h - 40, ox = Math.max(50, (w - 180 - Pw * s) / 2);
      const px = ox + Pw * s;

      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox - 14, oy); ctx.lineTo(px + 26, oy);
      ctx.moveTo(ox, oy + 26); ctx.lineTo(ox, 24); ctx.stroke();

      /* 校正前的三角形（虛線） */
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, oy); ctx.lineTo(px, oy - Q1 * s); ctx.closePath(); ctx.stroke();
      ctx.setLineDash([]);
      label(ctx, px + 8, oy - Q1 * s, 'S₁ = ' + fix(S1, 0) + ' VA', C['ink-3'], 11, 'left', '700');
      label(ctx, px + 8, oy - Q1 * s + 14, 'Q₁ = ' + fix(Q1, 0), C['ink-3'], 10.5, 'left');

      /* 校正後的三角形（實線） */
      ctx.strokeStyle = C['p-real']; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, oy); ctx.lineTo(px, oy - Q2 * s); ctx.closePath(); ctx.stroke();
      label(ctx, px + 8, oy - Q2 * s - 12, 'S₂ = ' + fix(S2, 0) + ' VA', C['p-real'], 11.5, 'left', '700');

      /* 電容抵銷掉的 QC */
      ctx.strokeStyle = C['s-app']; ctx.lineWidth = 6; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.moveTo(px - 13, oy - Q1 * s); ctx.lineTo(px - 13, oy - Q2 * s); ctx.stroke();
      label(ctx, px - 20, (oy - Q1 * s + oy - Q2 * s) / 2, 'QC', C['s-app'], 11.5, 'right', '700');
      labelCJK(ctx, ox - 14, 15, '電容「吃掉」的就是這一段 QC，P 完全不變', C['s-app'], 11.5, 'left');
      label(ctx, (ox + px) / 2, oy + 16, 'P = ' + fix(Pw, 0) + ' W（不變）', C['p-real'], 11, 'center', '700');
    }});

    function refresh() {
      const t1 = th1(), t2 = th2();
      const Q1 = Pw * Math.tan(t1 * RAD), Q2 = Pw * Math.tan(t2 * RAD);
      const QC = Q1 - Q2;
      const Cf = QC / (TAU * f * Vrms * Vrms);
      const I1 = (Pw / Math.cos(t1 * RAD)) / Vrms, I2 = (Pw / Math.cos(t2 * RAD)) / Vrms;
      setText('pfc-th1', fix(t1, 2) + '°');
      setText('pfc-th2', fix(t2, 2) + '°');
      setText('pfc-S1', fix(Pw / Math.cos(t1 * RAD), 0) + ' VA');
      setText('pfc-S2', fix(Pw / Math.cos(t2 * RAD), 0) + ' VA');
      setText('pfc-Q1', fix(Q1, 0) + ' VAR');
      setText('pfc-Q2', fix(Q2, 0) + ' VAR');
      setText('pfc-QC', fix(QC, 0) + ' VAR');
      setText('pfc-C', (Cf * 1e6).toFixed(1) + ' µF');
      setText('pfc-I1', fix(I1, 1) + ' A');
      setText('pfc-I2', fix(I2, 1) + ' A');
      setText('pfc-S1b', fix(Pw / Math.cos(t1 * RAD), 0) + ' VA');
      setText('pfc-S2b', fix(Pw / Math.cos(t2 * RAD), 0) + ' VA');
      setText('pfc-drop', '線電流少了 ' + fix(I1 - I2, 1) + ' A（−' + fix((1 - I2 / I1) * 100, 1) + '%）');
      st.redraw();
    }
    bindRange('pfc-p', v => (v / 1000).toFixed(1) + ' kW', v => { Pw = v; refresh(); });
    bindRange('pfc-pf1', v => v.toFixed(2), v => { pf1 = v; if (pf2 < pf1) { pf2 = pf1; document.getElementById('pfc-pf2').value = pf1; } refresh(); });
    bindRange('pfc-pf2', v => v.toFixed(2), v => { pf2 = Math.max(v, pf1); refresh(); });
    bindRange('pfc-v', v => v + ' V', v => { Vrms = v; refresh(); });
    document.getElementById('pfc-book').addEventListener('click', () => {
      const set = (id, val) => { const e = document.getElementById(id); e.value = val; e.dispatchEvent(new Event('input')); };
      set('pfc-p', 4000); set('pfc-pf1', 0.8); set('pfc-pf2', 0.95); set('pfc-v', 120);
    });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑧ 電費計算器    11.9.2 Electricity Consumption Cost
     ══════════════════════════════════════════════════════════ */
  (function billing() {
    const el = document.getElementById('bill-total'); if (!el) return;
    let kw = 1.5, hrs = 4, days = 30, rate = 3.5;
    function refresh() {
      const kwh = kw * hrs * days;
      setText('bill-kwh', kwh.toFixed(1) + ' kWh');
      setText('bill-total', 'NT$ ' + (kwh * rate).toFixed(0));
      setText('bill-day', 'NT$ ' + (kw * hrs * rate).toFixed(1) + ' / 天');
      setText('bill-note', '瓦特計（wattmeter）量的是平均功率 P（瓦）；電表（kilowatt-hour meter）'
        + '量的是 P × 時間（度）。電力公司按「度」收費，所以虛功率 Q 雖然不算進 P，'
        + '卻會讓線電流變大、線損 I²R 增加 —— 這就是工廠要做功因校正的原因。');
    }
    bindRange('bill-kw', v => v.toFixed(1) + ' kW', v => { kw = v; refresh(); });
    bindRange('bill-hrs', v => v.toFixed(1) + ' 小時/天', v => { hrs = v; refresh(); });
    bindRange('bill-days', v => v + ' 天', v => { days = v; refresh(); });
    bindRange('bill-rate', v => v.toFixed(1) + ' 元/度', v => { rate = v; refresh(); });
    refresh();
  })();
})();

/* ============================================================
   CH11 觀念小測驗（三頁共用）：__ch11Quiz(題庫, 結語)
   中英對照（考試用英文、讀書用中文）；選項每次打亂，題庫裡正解寫在哪都沒關係
   ============================================================ */
window.__ch11Quiz = function (Q, verdicts) {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  let i = 0, score = 0, answered = false, ord = [];

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
    const verdict = pct >= 90 ? verdicts[0] : pct >= 70 ? verdicts[1] : verdicts[2];
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
};

/* 側欄捲動高亮 + 明暗主題切換（與電子學共用同一套行為） */
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
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      try { localStorage.setItem('ee-theme', isDark ? 'light' : 'dark'); } catch (e) {}
    });
  }
  try { const t = localStorage.getItem('ee-theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch (e) {}
})();

/* ============================================================
   CH11 PART 1 補課：阻抗平面（Z = R + jX、|Z|、θ、共軛）
   使用者 10/6：「阻抗、負載、j、ZTh 都忘了」→ 拖一個點看 R、X、|Z|、θ，右邊同步畫 v、i 錯開多少
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText, clamp, lerp, TAU, pointerPos } = E;
  const RAD = Math.PI / 180;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '−');
  const cpx = (re, im) => fix(re, 1) + (im < 0 ? ' − j' : ' + j') + fix(Math.abs(im), 1);

  const cv = document.getElementById('cv-zp'); if (!cv) return;
  let R = 4, X = 3, conj = false, drag = false;
  const RMAX = 10, XMAX = 8;

  /* 版面：寬 → 左平面右波形；窄 → 上平面下波形。座標都由 w、h 當下算，不存像素 */
  function geom(w, h) {
    const wide = w >= 560;
    const pw = wide ? Math.min(w * 0.52, 420) : w, ph = wide ? h : h - 150;
    const s = Math.max(0.5, Math.min((pw - 70) / RMAX, (ph - 50) / (2 * XMAX)));
    const ox = Math.max(36, (pw - RMAX * s) / 2 + 4), oy = (wide ? h : ph) / 2 - 6;
    const wave = wide ? { x0: pw + 30, x1: w - 14, y0: 26, y1: h - 30 } : { x0: 34, x1: w - 12, y0: ph + 18, y1: h - 22 };
    return { ox, oy, s, wave, wide, pw, ph };
  }

  const st = Stage(cv, { animate: false, ratio: w => (w >= 560 ? 0.5 : 1.55), minH: 330, maxH: 560, draw(ctx, w, h) {
    const g = geom(w, h), P = (r, x) => [g.ox + r * g.s, g.oy - x * g.s];
    const mag = Math.hypot(R, X), th = Math.atan2(X, R) / RAD;

    /* 上半＝電感性、下半＝電容性 */
    ctx.fillStyle = C['q-react-w']; ctx.globalAlpha = 0.45; ctx.fillRect(g.ox, g.oy - XMAX * g.s, RMAX * g.s, XMAX * g.s);
    ctx.fillStyle = C['s-app-w']; ctx.fillRect(g.ox, g.oy, RMAX * g.s, XMAX * g.s); ctx.globalAlpha = 1;
    labelCJK(ctx, g.ox + RMAX * g.s - 4, g.oy - XMAX * g.s + 12, '電感性 X > 0', C['q-react'], 10.5, 'right');
    labelCJK(ctx, g.ox + RMAX * g.s - 4, g.oy + XMAX * g.s - 8, '電容性 X < 0', C['s-app'], 10.5, 'right');

    /* 軸與刻度 */
    ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(g.ox - 8, g.oy); ctx.lineTo(g.ox + RMAX * g.s + 6, g.oy);
    ctx.moveTo(g.ox, g.oy + XMAX * g.s); ctx.lineTo(g.ox, g.oy - XMAX * g.s); ctx.stroke();
    for (let r = 2; r <= RMAX; r += 2) label(ctx, g.ox + r * g.s, g.oy + 12, String(r), C['ink-3'], 9.5);
    [-8, -4, 4, 8].forEach(x => label(ctx, g.ox - 6, g.oy - x * g.s, (x > 0 ? '+' : '−') + Math.abs(x), C['ink-3'], 9.5, 'right'));

    const [px, py] = P(R, X);
    if (mag < 0.25) {
      disc(ctx, px, py, 7, C.bad, C.surface);
      labelCJK(ctx, px + 12, py - 12, 'Z = 0：短路！', C.bad, 12, 'left', '700');
    } else {
      /* R 邊、X 邊、斜邊 |Z| */
      ctx.lineCap = 'round';
      ctx.strokeStyle = C['p-real']; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(g.ox, g.oy); ctx.lineTo(px, g.oy); ctx.stroke();
      ctx.strokeStyle = C['q-react']; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(px, g.oy); ctx.lineTo(px, py); ctx.stroke();
      arrow(ctx, g.ox, g.oy, px, py, C['s-app'], 2.6);
      if (R > 0.4) label(ctx, (g.ox + px) / 2, g.oy + (X >= 0 ? 26 : -12), 'R = ' + fix(R, 1), C['p-real'], 11, 'center', '700');
      if (Math.abs(X) > 0.4) label(ctx, px + 8, (g.oy + py) / 2, 'X = ' + fix(X, 1), C['q-react'], 11, 'left', '700');
      const mx = (g.ox + px) / 2, my = (g.oy + py) / 2;
      label(ctx, mx - 8, my + (X >= 0 ? -10 : 12), '|Z| = ' + fix(mag, 2), C['s-app'], 11.5, 'right', '700');
      if (Math.abs(th) > 2 && R > 0.4) {
        ctx.beginPath(); ctx.arc(g.ox, g.oy, 24, 0, -th * RAD, X > 0);
        ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.4; ctx.stroke();
        label(ctx, g.ox + 30, g.oy + (X > 0 ? -9 : 11), 'θ', C['ink-2'], 11, 'left', '700');
      }
      disc(ctx, px, py, 7, C['s-app'], C.surface);
      if (conj && Math.abs(X) > 0.01) {
        const [qx, qy] = P(R, -X);
        ctx.setLineDash([5, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(g.ox, g.oy); ctx.lineTo(qx, qy); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke(); ctx.setLineDash([]);
        disc(ctx, qx, qy, 6, C['ink-2'], C.surface);
        label(ctx, qx - 10, qy + (X > 0 ? 14 : -12), 'Z* = ' + cpx(R, -X), C['ink-2'], 11, 'right', '700');
      }
    }
    labelCJK(ctx, g.ox + RMAX * g.s / 2, g.oy + XMAX * g.s + 17, g.s * RMAX > 300 ? '橫軸 = 電阻 R（實部）　直軸 = 電抗 X（虛部，貼 j）' : '橫軸 R（實部）｜直軸 X（虛部）', C['ink-2'], 10.5, 'center');
    if (!g.wide) labelCJK(ctx, w - 10, 14, '拖藍點', C['ink-3'], 10.5, 'right');
    else labelCJK(ctx, 10, h - 10, '拖藍點改變 R、X', C['ink-3'], 10.5, 'left');

    /* 波形：v 固定，i 依 |Z| 變大小、依 θ 錯開 */
    const W = g.wave, ym = (W.y0 + W.y1) / 2, amp = (W.y1 - W.y0) / 2 - 8;
    ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W.x0, ym); ctx.lineTo(W.x1, ym); ctx.stroke();
    const N = 220, X_ = i => lerp(W.x0, W.x1, i / N), ph = i => (i / N) * 2 * TAU;
    const iA = mag < 0.25 ? 1 : clamp(4 / mag, 0.12, 1);
    [[1, 0, C.ink, 2.2, []], [iA, th, C['s-app'], 2.2, [6, 4]]].forEach(([a, d, col, lw, dash]) => {
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const y = ym - a * amp * Math.cos(ph(i) - d * RAD); i ? ctx.lineTo(X_(i), y) : ctx.moveTo(X_(i), y); }
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]);
    });
    label(ctx, W.x0 - 6, ym - amp + 4, 'v', C.ink, 11, 'right', '700');
    label(ctx, W.x0 - 6, ym - iA * amp * Math.cos(-th * RAD) + 4, 'i', C['s-app'], 11, 'right', '700');
    const kind = mag < 0.25 ? '短路：電流爆表' : Math.abs(th) < 0.5 ? '同步（純電阻）' : th > 0 ? '電流落後 ' + fix(th, 1) + '°（電感性）' : '電流超前 ' + fix(-th, 1) + '°（電容性）';
    labelCJK(ctx, W.x1, W.y0 - 10, kind, mag < 0.25 ? C.bad : th > 0.5 ? C['q-react'] : th < -0.5 ? C['s-app'] : C['p-real'], 11.5, 'right', '700');
    labelCJK(ctx, W.x0, W.y1 + 14, '實線 v、虛線 i（|Z| 越大，i 越小）', C['ink-3'], 10.5, 'left');
  }});

  function pick(ev) {
    const p = pointerPos(cv, ev), g = geom(st.w, st.h);
    R = Math.round(clamp((p.x - g.ox) / g.s, 0, RMAX) * 2) / 2;
    X = Math.round(clamp((g.oy - p.y) / g.s, -XMAX, XMAX) * 2) / 2;
    sync();
  }
  cv.addEventListener('pointerdown', e => { const g = geom(st.w, st.h); if (g.wide || pointerPos(cv, e).y < g.ph) { drag = true; cv.setPointerCapture(e.pointerId); pick(e); } });
  cv.addEventListener('pointermove', e => { if (drag) pick(e); });
  cv.addEventListener('pointerup', () => { drag = false; });

  function sync() {
    const a = document.getElementById('zp-r'), b = document.getElementById('zp-x');
    a.value = R; b.value = X; a.dispatchEvent(new Event('input')); b.dispatchEvent(new Event('input'));
  }
  function refresh() {
    const mag = Math.hypot(R, X), th = Math.atan2(X, R) / RAD;
    setText('zp-z', cpx(R, X) + ' Ω');
    setText('zp-mag', fix(mag, 2) + ' Ω');
    setText('zp-th', mag < 0.25 ? '—' : fix(th, 1) + '°');
    setText('zp-i', mag < 0.25 ? '∞（短路）' : fix(10 / mag, 2) + ' A');
    const el = document.getElementById('zp-msg');
    el.className = 'msg' + (mag < 0.25 ? ' bad' : Math.abs(X) < 0.01 ? ' good' : '');
    el.innerHTML = mag < 0.25 ? 'R 和 X 都是 0：完全沒擋，電流無限大 —— 這就是短路。'
      : R < 0.01 ? '只剩電抗、沒有電阻：電流錯開整整 90°，<b>完全不吃平均功率</b>（cos 90° = 0）。純電感或純電容就是這樣。'
      : Math.abs(X) < 0.01 ? '<b>X = 0：純電阻</b>。電流跟電壓同步，cos 0° = 1，功率完全不打折。共軛匹配就是要把總電抗弄成這樣。'
      : (X > 0 ? '點在<b>上半</b>：電抗是正的 → 電感性，電流比電壓<b>晚</b> ' : '點在<b>下半</b>：電抗是負的 → 電容性，電流比電壓<b>早</b> ') + fix(Math.abs(th), 1) + '°。' +
        '總共擋 |Z| = √(' + fix(R, 1) + '² + ' + fix(Math.abs(X), 1) + '²) = ' + fix(mag, 2) + ' Ω，不是 ' + fix(R + Math.abs(X), 1) + ' Ω。' +
        (conj ? '　共軛 Z* = ' + cpx(R, -X) + '（上下翻面）；Z + Z* = ' + fix(2 * R, 1) + ' Ω，虛部消失。' : '');
    st.redraw();
  }
  bindRange('zp-r', v => fix(v, 1) + ' Ω', v => { R = v; refresh(); });
  bindRange('zp-x', v => (v < 0 ? '−j' + fix(-v, 1) : '+j' + fix(v, 1)) + ' Ω', v => { X = v; refresh(); });
  const cb = document.getElementById('zp-conj');
  cb.addEventListener('click', () => { conj = !conj; cb.setAttribute('aria-pressed', conj); cb.textContent = conj ? '隱藏共軛 Z*' : '顯示共軛 Z*'; refresh(); });
  document.getElementById('zp-reset').addEventListener('click', () => { R = 4; X = 3; sync(); });
  refresh();
})();
