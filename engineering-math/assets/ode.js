/* ============================================================
   工程數學 — 常係數線性 ODE 與特徵方程
   對應 9/23 課堂筆記 Exercise 1 ~ 3
   核心視覺化：特徵根 λ 在複平面的位置  ↔  解 y(t) 的長相
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, TAU, liveExample } = E;
  const MINUS = '\u2212';
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', MINUS);
  /* 把 [係數, 'e^(…)'] 的列表串成「3.00e^(−t) − 2.00e^(−2t)」，不會出現「+ −」 */
  function terms(list) {
    let out = '';
    list.forEach(([c, tail], i) => {
      const m = fix(Math.abs(c)) + tail;
      if (i === 0) out = (c < 0 ? MINUS : '') + m;
      else out += (c < 0 ? ' ' + MINUS + ' ' : ' + ') + m;
    });
    return out || '0';
  }
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  /* 依實際資料範圍決定縱軸，並保證 y = 0 在範圍內，不留大片空白 */
  function yRange(vals) {
    let lo = 0, hi = 0;
    vals.forEach(v => { if (v < lo) lo = v; if (v > hi) hi = v; });
    const span = Math.max(hi - lo, 1e-6), pad = span * 0.1;
    return { lo: lo - pad, hi: hi + pad };
  }

  /* 解 λ² + aλ + b = 0，回傳根與分類 */
  function roots(a, b) {
    const D = a * a - 4 * b;
    if (Math.abs(D) < 1e-9) return { kind: 'double', re: -a / 2, im: 0, l1: -a / 2, l2: -a / 2, D: 0 };
    if (D > 0) {
      const r = Math.sqrt(D);
      return { kind: 'real', l1: (-a + r) / 2, l2: (-a - r) / 2, D: D };
    }
    const r = Math.sqrt(-D);
    return { kind: 'complex', re: -a / 2, im: r / 2, D: D };
  }
  /* 依初始條件 y(0)=y0, y'(0)=v0 求係數，並回傳 y(t) */
  function solver(a, b, y0, v0) {
    const R = roots(a, b);
    if (R.kind === 'real') {
      const C2 = (v0 - R.l1 * y0) / (R.l2 - R.l1), C1 = y0 - C2;
      return { R, C1, C2, f: t => C1 * Math.exp(R.l1 * t) + C2 * Math.exp(R.l2 * t) };
    }
    if (R.kind === 'double') {
      const C1 = y0, C2 = v0 - R.re * y0;
      return { R, C1, C2, f: t => (C1 + C2 * t) * Math.exp(R.re * t) };
    }
    const A = y0, B = (v0 - R.re * y0) / R.im;
    return { R, C1: A, C2: B,
      f: t => Math.exp(R.re * t) * (A * Math.cos(R.im * t) + B * Math.sin(R.im * t)) };
  }

  /* ══════════════════════════════════════════════════════════
     ① 特徵根 ↔ 解的長相（整個單元最重要的一張圖）
     ══════════════════════════════════════════════════════════ */
  (function rootMap() {
    const cv = document.getElementById('cv-root'); if (!cv) return;
    let a = 3, b = 2, y0 = 1, v0 = 2, drag = false;

    const PRESET = {
      distinct: [3, 2], double: [4, 4], complex: [4, 5],
      undamped: [0, 4], unstable: [-1, 2]
    };

    /* 窄版面改成上下排：兩個框各自拿到夠大的面積，不會擠成兩張郵票 */
    function panes(w, h) {
      const gap = 26, pad = 14;
      if (w < 520) {
        const avail = h - 30 - 26 - 30 - 12;                 /* 兩個標題 + 中間留白 + 底部 */
        const size = Math.max(90, Math.min(w - pad * 2, avail * 0.56));
        return { stack: true, size: size, lx: (w - size) / 2, ty: 30,
          rx: pad, rw: w - pad * 2, ry: 30 + size + 26 + 18,
          rh: Math.max(80, avail - size) };
      }
      const pw = Math.max(120, Math.min((w - gap - pad * 2) * 0.42, h - 46));
      return { stack: false, size: pw, lx: pad, ty: 30,
        rx: pad + pw + gap, rw: w - pad - (pad + pw + gap), ry: 30, rh: pw };
    }

    const st = Stage(cv, { animate: false, ratio: w => (w < 520 ? 1.3 : 0.44),
      minH: 150, maxH: 430, draw(ctx, w, h) {
      const g = panes(w, h), S = solver(a, b, y0, v0), R = S.R;
      const RNG = 4;

      /* ── 左：複平面上的特徵根 ── */
      const cx = g.lx + g.size / 2, cy = g.ty + g.size / 2;
      const X = v => cx + v / RNG * (g.size / 2), Y = v => cy - v / RNG * (g.size / 2);
      /* 左半平面（穩定區）上色 */
      ctx.fillStyle = C['p-real-w'] || C['surface-2'];
      ctx.globalAlpha = 0.5; ctx.fillRect(g.lx, g.ty, g.size / 2, g.size); ctx.globalAlpha = 1;
      ctx.fillStyle = C['surface-2']; ctx.globalAlpha = 0.5;
      ctx.fillRect(cx, g.ty, g.size / 2, g.size); ctx.globalAlpha = 1;
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.strokeRect(g.lx, g.ty, g.size, g.size);
      ctx.strokeStyle = C['line-soft'];
      for (let k = -RNG; k <= RNG; k++) {
        ctx.beginPath(); ctx.moveTo(X(k), g.ty); ctx.lineTo(X(k), g.ty + g.size);
        ctx.moveTo(g.lx, Y(k)); ctx.lineTo(g.lx + g.size, Y(k)); ctx.stroke();
      }
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(g.lx, cy); ctx.lineTo(g.lx + g.size, cy);
      ctx.moveTo(cx, g.ty); ctx.lineTo(cx, g.ty + g.size); ctx.stroke();
      labelCJK(ctx, g.lx + g.size / 2, g.ty - 12, 'λ 複平面（拖曳根）', C['ink-2'], 11.5, 'center', '600');
      label(ctx, g.lx + 5, g.ty + 11, '衰減', C.ok, 9.5, 'left');
      label(ctx, g.lx + g.size - 5, g.ty + 11, '發散', C.bad, 9.5, 'right');
      label(ctx, g.lx + g.size - 4, cy - 8, 'Re', C['ink-3'], 9, 'right');
      label(ctx, cx + 6, g.ty + 8, 'Im', C['ink-3'], 9, 'left');

      const pts = R.kind === 'complex'
        ? [[R.re, R.im], [R.re, -R.im]]
        : [[R.l1, 0], [R.l2, 0]];
      pts.forEach(([re, im], i) => {
        const px = X(clamp(re, -RNG, RNG)), py = Y(clamp(im, -RNG, RNG));
        const col = re < -1e-9 ? C.ok : re > 1e-9 ? C.bad : C.warn;
        if (R.kind === 'double' && i === 1) {
          ctx.beginPath(); ctx.arc(px, py, 11, 0, TAU);
          ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
        }
        disc(ctx, px, py, 6.5, col, C.surface);
      });
      if (R.kind === 'double') labelCJK(ctx, cx, g.ty + g.size - 12, '兩根重疊（重根）', C.warn, 10.5);

      /* ── 右：對應的解 y(t) ── */
      const rx0 = g.rx, rx1 = g.rx + g.rw, ry0 = g.ry, ry1 = g.ry + g.rh;
      const T = 6;
      const samp = [];
      for (let k = 0; k <= 200; k++) samp.push(clamp(S.f(k / 200 * T), -1e4, 1e4));
      const rg = yRange(samp);
      const Yv = v => ry1 - (clamp(v, rg.lo, rg.hi) - rg.lo) / (rg.hi - rg.lo) * (ry1 - ry0);
      const mid = Yv(0);
      ctx.fillStyle = C['surface-2']; ctx.fillRect(rx0, ry0, rx1 - rx0, ry1 - ry0);
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(rx0, mid); ctx.lineTo(rx1, mid); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.rect(rx0, ry0, rx1 - rx0, ry1 - ry0); ctx.clip();
      ctx.beginPath();
      for (let k = 0; k <= 200; k++) {
        const py = Yv(samp[k]);
        k ? ctx.lineTo(lerp(rx0, rx1, k / 200), py) : ctx.moveTo(rx0, py);
      }
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();
      labelCJK(ctx, (rx0 + rx1) / 2, ry0 - 12, '解 y(t)', C.accent, 11.5, 'center', '600');
      label(ctx, rx1 - 4, g.stack ? ry1 + 13 : ry1 - 8, 't →', C['ink-3'], 9.5, 'right');
      label(ctx, rx0 + 4, clamp(mid - 7, ry0 + 9, ry1 - 4), '0', C['ink-3'], 9.5, 'left');
    }});

    function pick(ev) {
      const p = E.pointerPos(cv, ev), g = panes(st.w, st.h);
      if (g.stack) { if (p.y > g.ty + g.size + 10) return; }
      else if (p.x > g.lx + g.size + 6) return;
      const cx = g.lx + g.size / 2, cy = g.ty + g.size / 2, RNG = 4;
      const re = clamp((p.x - cx) / (g.size / 2) * RNG, -RNG, RNG);
      const im = clamp(-(p.y - cy) / (g.size / 2) * RNG, -RNG, RNG);
      /* 由拖曳的根反推係數：λ² − (λ1+λ2)λ + λ1λ2 = 0 */
      if (Math.abs(im) < 0.25) { a = -2 * re; b = re * re; }      /* 貼近實軸 → 當成重根 */
      else { a = -2 * re; b = re * re + im * im; }                /* 共軛複根 */
      sync();
    }
    cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); pick(e); });
    cv.addEventListener('pointermove', e => { if (drag) pick(e); });
    cv.addEventListener('pointerup', () => { drag = false; });

    function sync() {
      const ea = document.getElementById('root-a'), eb = document.getElementById('root-b');
      ea.value = clamp(a, -4, 8); eb.value = clamp(b, -4, 16);
      ea.dispatchEvent(new Event('input')); eb.dispatchEvent(new Event('input'));
    }
    function refresh() {
      const S = solver(a, b, y0, v0), R = S.R;
      setText('root-eq', "y″ " + (a >= 0 ? '+ ' : '− ') + fix(Math.abs(a)) + "y′ " +
        (b >= 0 ? '+ ' : '− ') + fix(Math.abs(b)) + 'y = 0');
      setText('root-char', 'λ² ' + (a >= 0 ? '+ ' : '− ') + fix(Math.abs(a)) + 'λ ' +
        (b >= 0 ? '+ ' : '− ') + fix(Math.abs(b)) + ' = 0');
      setText('root-D', fix(a * a - 4 * b, 2));
      const kindTxt = R.kind === 'real' ? '相異實根（D > 0）'
        : R.kind === 'double' ? '重根（D = 0）' : '共軛複根（D < 0）';
      setText('root-kind', kindTxt);
      setText('root-lam', R.kind === 'complex'
        ? 'λ = ' + fix(R.re) + ' ± ' + fix(R.im) + 'i'
        : 'λ₁ = ' + fix(R.l1) + '　λ₂ = ' + fix(R.l2));
      setText('root-form', R.kind === 'real'
        ? 'y = C₁e^(λ₁t) + C₂e^(λ₂t)'
        : R.kind === 'double' ? 'y = (C₁ + C₂t)e^(λt)'
        : 'y = e^(αt)(A cos βt + B sin βt)');
      setText('root-sol', 'y = ' + (R.kind === 'real'
        ? terms([[S.C1, 'e^(' + fix(R.l1) + 't)'], [S.C2, 'e^(' + fix(R.l2) + 't)']])
        : R.kind === 'double' ? '(' + terms([[S.C1, ''], [S.C2, 't']]) + ')e^(' + fix(R.re) + 't)'
        : 'e^(' + fix(R.re) + 't)(' + terms([[S.C1, ' cos ' + fix(R.im) + 't'], [S.C2, ' sin ' + fix(R.im) + 't']]) + ')'));
      const reMax = R.kind === 'complex' ? R.re : Math.max(R.l1, R.l2);
      setText('root-stab', reMax < -1e-9 ? '衰減（穩定）' : reMax > 1e-9 ? '發散（不穩定）' : '不衰減也不發散（臨界）');
      setHTML('root-msg', reMax < -1e-9
        ? '所有根都在<b>左半平面</b>（實部為負）→ e^(負數×t) 隨時間趨近 0 → 解會衰減。'
        : reMax > 1e-9
        ? '有根在<b>右半平面</b>（實部為正）→ e^(正數×t) 爆炸成長 → 解會發散。'
        : '根落在<b>虛軸上</b>（實部為 0）→ 不衰減也不發散，是純振盪或常數。');
      st.redraw();
    }
    bindRange('root-a', v => 'a = ' + fix(v), v => { a = v; refresh(); });
    bindRange('root-b', v => 'b = ' + fix(v), v => { b = v; refresh(); });
    bindRange('root-y0', v => 'y(0) = ' + fix(v), v => { y0 = v; refresh(); });
    bindRange('root-v0', v => "y′(0) = " + fix(v), v => { v0 = v; refresh(); });
    document.querySelectorAll('[data-root]').forEach(btn => btn.addEventListener('click', () => {
      const [pa, pb] = PRESET[btn.dataset.root];
      a = pa; b = pb; sync();
    }));
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ② 三種情況對照：為什麼重根要多一個 t
     ══════════════════════════════════════════════════════════ */
  (function threeCases() {
    const cv = document.getElementById('cv-cases'); if (!cv) return;
    let show = 'all';
    const CASES = [
      { key: 'distinct', a: 4, b: 3, name: '相異實根', form: 'C₁e^(−t) + C₂e^(−3t)', col: () => C['p-real'] },
      { key: 'double', a: 4, b: 4, name: '重根', form: '(C₁ + C₂t)e^(−2t)', col: () => C['q-react'] },
      { key: 'complex', a: 4, b: 5, name: '共軛複根', form: 'e^(−2t)(A cos t + B sin t)', col: () => C['s-app'] }
    ];

    const st = Stage(cv, { animate: false, ratio: 0.44, minH: 230, maxH: 300, draw(ctx, w, h) {
      const padL = 44, padR = 16, padT = 22, padB = 40;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const T = 6;
      const list = CASES.filter(c => show === 'all' || show === c.key);
      const sols = list.map(c => solver(c.a, c.b, 1, 0));
      const all = [];
      sols.forEach(S => { for (let k = 0; k <= 220; k++) all.push(clamp(S.f(k / 220 * T), -1e4, 1e4)); });
      const rg = yRange(all);
      const Yv = v => y1 - (clamp(v, rg.lo, rg.hi) - rg.lo) / (rg.hi - rg.lo) * (y1 - y0);
      const mid = Yv(0);

      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      for (let t = 0; t <= T; t++) {
        ctx.beginPath(); ctx.moveTo(lerp(x0, x1, t / T), y0); ctx.lineTo(lerp(x0, x1, t / T), y1); ctx.stroke();
        label(ctx, lerp(x0, x1, t / T), y1 + 14, t + '', C['ink-3'], 9.5);
      }
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke();
      label(ctx, x0 - 6, mid, '0', C['ink-3'], 9.5, 'right');
      label(ctx, x0 - 6, Yv(1), '1', C['ink-3'], 9.5, 'right');
      label(ctx, x1, y1 + 28, 't →', C['ink-3'], 10, 'right');

      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 - 2, x1 - x0, y1 - y0 + 4); ctx.clip();
      list.forEach((c, i) => {
        const S = sols[i], col = c.col();
        ctx.beginPath();
        for (let k = 0; k <= 220; k++) {
          const py = Yv(S.f(k / 220 * T));
          k ? ctx.lineTo(lerp(x0, x1, k / 220), py) : ctx.moveTo(x0, py);
        }
        ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.stroke();
      });
      ctx.restore();
      list.forEach((c, i) => label(ctx, x1 - 4, y0 + 12 + i * 15, c.name, c.col(), 10.5, 'right', '700'));
      labelCJK(ctx, w < 520 ? 8 : x0, h - 10,
        w < 520 ? '三條初始條件相同，差別只在特徵根'
                : "三者初始條件都是 y(0)=1、y′(0)=0，差別只在特徵根", C['ink-3'], w < 520 ? 10.5 : 11, 'left');
    }});

    document.querySelectorAll('[data-case]').forEach(b => b.addEventListener('click', () => {
      show = b.dataset.case;
      document.querySelectorAll('[data-case]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.case === show)));
      const info = {
        all: '三條一起看：都會衰減（根的實部都是負的），但衰減的「姿態」完全不同。',
        distinct: '兩個不同的實根 → 兩個純指數相加，單調衰減，不會過頭。',
        double: '重根只給一個解 e^(λt)，湊不出兩個獨立解，所以要補一個 <b>t·e^(λt)</b>。前期那個 t 會把曲線頂起來一點，之後才被指數壓下去。',
        complex: '實部負 → 振幅衰減；虛部 → 來回振盪。兩者疊起來就是「愈晃愈小」的衰減振盪。'
      };
      setHTML('cases-msg', info[show]);
      st.redraw();
    }));
    document.querySelector('[data-case="all"]').setAttribute('aria-pressed', 'true');
    setText('cases-msg', '三條一起看：都會衰減（根的實部都是負的），但衰減的「姿態」完全不同。');
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 例題：跟著課堂 Exercise 走一遍（可改數字）
     ══════════════════════════════════════════════════════════ */
  liveExample('#ex-ode', {
    title: '例題 · 跟著課堂 Exercise 1 走一遍',
    givens: [
      { id: 'exo-a', label: "y′ 的係數 a", min: -2, max: 8, step: 1, value: 3, fmt: v => 'a = ' + v },
      { id: 'exo-b', label: 'y 的係數 b', min: -2, max: 16, step: 1, value: 2, fmt: v => 'b = ' + v },
      { id: 'exo-y0', label: '初始值 y(0)', min: -3, max: 3, step: 1, value: 1, fmt: v => 'y(0) = ' + v },
      { id: 'exo-v0', label: "初始值 y′(0)", min: -3, max: 3, step: 1, value: 2, fmt: v => "y′(0) = " + v }
    ],
    compute: g => solver(g['exo-a'], g['exo-b'], g['exo-y0'], g['exo-v0']),
    question: (g, r) => '解 <b>y″ ' + (g['exo-a'] >= 0 ? '+ ' : '− ') + Math.abs(g['exo-a']) + 'y′ ' +
      (g['exo-b'] >= 0 ? '+ ' : '− ') + Math.abs(g['exo-b']) + 'y = 0</b>，' +
      '初始條件 <b>y(0) = ' + g['exo-y0'] + '、y′(0) = ' + g['exo-v0'] + '</b>。' +
      '<br><span style="font-size:13px;color:var(--ink-3)">↑ 改 a、b 可以切換成相異實根／重根／共軛複根三種情況。</span>',
    steps: (g, r) => {
      const a = g['exo-a'], b = g['exo-b'], R = r.R, D = a * a - 4 * b;
      const out = [
        { t: 'Step 1　猜 y = e^(λt)。',
          note: '因為 y、y′、y″ 必須是「同一種函數」才可能相加為零，指數函數微分後還是自己：',
          eq: "y = e^(λt)　⟹　y′ = λe^(λt) = λy　，　y″ = λ²e^(λt) = λ²y" },
        { t: 'Step 2　代回原式，把 y 提出來。',
          eq: '(λ² ' + (a >= 0 ? '+ ' : '− ') + Math.abs(a) + 'λ ' + (b >= 0 ? '+ ' : '− ') + Math.abs(b) +
            ')·y = 0　，因為 y ≠ 0 ⟹ 括號必須為 0' },
        { t: 'Step 3　解特徵方程（characteristic equation）。',
          note: '判別式 D = a² − 4b = ' + fix(D, 2) + ' → <b>' +
            (R.kind === 'real' ? '相異實根' : R.kind === 'double' ? '重根' : '共軛複根') + '</b>：',
          eq: 'λ² ' + (a >= 0 ? '+ ' : '− ') + Math.abs(a) + 'λ ' + (b >= 0 ? '+ ' : '− ') + Math.abs(b) + ' = 0　⟹　' +
            (R.kind === 'complex' ? 'λ = ' + fix(R.re) + ' ± ' + fix(R.im) + 'i'
              : 'λ₁ = ' + fix(R.l1) + '，λ₂ = ' + fix(R.l2)) },
        { t: 'Step 4　寫出通解。',
          note: R.kind === 'double'
            ? '重根只給一個 e^(λt)，<b>要再補一個 t·e^(λt)</b> 才湊得出兩個獨立解：'
            : R.kind === 'complex'
            ? '用尤拉公式把兩個複指數併成實數形式（α 是實部、β 是虛部）：'
            : '兩個相異實根各給一個獨立解，直接線性組合：',
          eq: R.kind === 'real' ? 'y = C₁e^(' + fix(R.l1) + 't) + C₂e^(' + fix(R.l2) + 't)'
            : R.kind === 'double' ? 'y = (C₁ + C₂t)e^(' + fix(R.re) + 't)'
            : 'y = e^(' + fix(R.re) + 't)(A cos ' + fix(R.im) + 't + B sin ' + fix(R.im) + 't)' },
        { t: 'Step 5　用初始條件定係數。',
          note: '代 y(0) = ' + g['exo-y0'] + ' 與 y′(0) = ' + g['exo-v0'] + ' 解聯立：',
          eq: (R.kind === 'complex' ? 'A = ' + fix(r.C1) + '　B = ' + fix(r.C2)
            : 'C₁ = ' + fix(r.C1) + '　C₂ = ' + fix(r.C2)) },
        { t: 'Step 6　驗算（一定要做）。',
          note: '把答案代回去檢查兩個初始條件：',
          eq: 'y(0) = ' + fix(r.f(0), 3) + ' ✓　　y′(0) = ' + fix((r.f(1e-5) - r.f(-1e-5)) / 2e-5, 3) + ' ✓' }
      ];
      return out;
    },
    answer: (g, r) => {
      const R = r.R;
      return 'y(t) = ' + (R.kind === 'real'
        ? terms([[r.C1, 'e^(' + fix(R.l1) + 't)'], [r.C2, 'e^(' + fix(R.l2) + 't)']])
        : R.kind === 'double' ? '(' + terms([[r.C1, ''], [r.C2, 't']]) + ')e^(' + fix(R.re) + 't)'
        : 'e^(' + fix(R.re) + 't)(' + terms([[r.C1, ' cos ' + fix(R.im) + 't'], [r.C2, ' sin ' + fix(R.im) + 't']]) + ')');
    }
  });
})();

/* ============================================================
   小測驗（中英對照）+ 導覽
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '解常係數線性齊次 ODE 時，為什麼一開始要猜 y = e^(λt)？',
      en: 'Why do we start by guessing y = e^(λt) for a linear homogeneous ODE with constant coefficients?',
      o: [['因為 e^(λt) 微分之後還是自己的倍數，y、y′、y″ 才可能相消', 'because differentiating e^(λt) returns a multiple of itself, so y, y′, y″ can cancel'],
          ['因為 e 是自然對數的底', 'because e is the base of the natural logarithm'],
          ['因為課本規定', 'because the textbook says so'],
          ['因為 e^(λt) 一定會收斂', 'because e^(λt) always converges']], a: 0,
      e: 'ay″ + by′ + cy = 0 要成立，三項必須是「同一種函數」才有機會加起來為零。指數函數微分之後只是乘上 λ：y′ = λy、y″ = λ²y，所以整式可以提出 y，剩下純粹關於 λ 的多項式。換成 sin、多項式都做不到這件事。' },

    { zh: 'y″ + 3y′ + 2y = 0 的特徵方程是什麼？',
      en: 'What is the characteristic equation of y″ + 3y′ + 2y = 0?',
      o: [['λ² + 3λ + 2 = 0', 'λ² + 3λ + 2 = 0'], ['λ² + 2λ + 3 = 0', 'λ² + 2λ + 3 = 0'],
          ['λ² + 3λ = 0', 'λ² + 3λ = 0'], ['3λ² + 2λ + 1 = 0', '3λ² + 2λ + 1 = 0']], a: 0,
      e: '把 y″ → λ²、y′ → λ、y → 1 直接照抄係數即可：λ² + 3λ + 2 = 0 → (λ+1)(λ+2) = 0 → λ = −1, −2。係數的順序不能顛倒，這是最常見的抄錯點。' },

    { zh: '判別式 D = a² − 4b 決定什麼？',
      en: 'What does the discriminant D = a² − 4b determine?',
      o: [['特徵根是相異實根、重根，還是共軛複根', 'whether the roots are distinct real, repeated, or complex conjugates'],
          ['解會不會收斂', 'whether the solution converges'],
          ['初始條件的值', 'the values of the initial conditions'],
          ['方程式的階數', 'the order of the equation']], a: 0,
      e: 'D > 0 → 兩個相異實根（純衰減/成長，不振盪）；D = 0 → 重根（臨界，解裡會多一個 t）；D < 0 → 共軛複根（振盪）。收斂與否是由**實部的正負**決定，跟 D 是兩件事。' },

    { zh: '相異實根 λ₁、λ₂ 時，通解長什麼樣子？',
      en: 'For distinct real roots λ₁, λ₂, what is the general solution?',
      o: [['y = C₁e^(λ₁t) + C₂e^(λ₂t)', 'y = C₁e^(λ₁t) + C₂e^(λ₂t)'],
          ['y = (C₁ + C₂t)e^(λ₁t)', 'y = (C₁ + C₂t)e^(λ₁t)'],
          ['y = C₁cos λ₁t + C₂sin λ₂t', 'y = C₁cos λ₁t + C₂sin λ₂t'],
          ['y = C₁e^(λ₁t)·C₂e^(λ₂t)', 'y = C₁e^(λ₁t)·C₂e^(λ₂t)']], a: 0,
      e: '兩個相異根各給一個線性獨立的解，通解就是它們的線性組合（相加，不是相乘）。二階方程需要兩個獨立解、兩個任意常數，才能同時滿足 y(0) 與 y′(0) 兩個條件。' },

    { zh: '重根（D = 0）時為什麼要多補一個 t·e^(λt)？',
      en: 'For a repeated root (D = 0), why do we add t·e^(λt)?',
      o: [['因為只有一個根只給一個解，另一個獨立解必須靠乘上 t 產生', 'one root gives only one solution; multiplying by t produces the second independent one'],
          ['因為這樣比較好看', 'because it looks nicer'],
          ['因為 t 可以讓解收斂', 'because t makes the solution converge'],
          ['因為重根的解一定發散', 'because repeated-root solutions always diverge']], a: 0,
      e: '二階方程一定要兩個線性獨立解。重根時 e^(λ₁t) 與 e^(λ₂t) 變成同一個函數，C₁e^(λt) + C₂e^(λt) = (C₁+C₂)e^(λt) 其實只有一個常數，湊不出兩個初始條件。把 e^(λt) 乘上 t 得到的 te^(λt) 恰好也滿足原式，且與 e^(λt) 獨立。' },

    { zh: '共軛複根 λ = α ± βi 對應的實數形式通解是什麼？',
      en: 'For complex conjugate roots λ = α ± βi, what is the real-form general solution?',
      o: [['y = e^(αt)(A cos βt + B sin βt)', 'y = e^(αt)(A cos βt + B sin βt)'],
          ['y = e^(βt)(A cos αt + B sin αt)', 'y = e^(βt)(A cos αt + B sin αt)'],
          ['y = A cos αt + B sin βt', 'y = A cos αt + B sin βt'],
          ['y = (A + Bt)e^(αt)', 'y = (A + Bt)e^(αt)']], a: 0,
      e: '用尤拉公式 e^(iβt) = cos βt + i sin βt 把兩個複指數併起來：<b>實部 α 管包絡線（衰減或發散的速度），虛部 β 管振盪的快慢</b>。α 與 β 的角色千萬不要對調。' },

    { zh: '解 y(t) 會隨 t → ∞ 衰減到 0 的條件是什麼？',
      en: 'What condition makes y(t) decay to 0 as t → ∞?',
      o: [['所有特徵根的實部都小於 0', 'all characteristic roots have negative real part'],
          ['判別式 D < 0', 'the discriminant D < 0'],
          ['所有根都是實數', 'all roots are real'],
          ['初始條件為 0', 'the initial conditions are zero']], a: 0,
      e: '解的每一項都帶著 e^(λt)（或 e^(αt)）。只要有任何一個根的實部 ≥ 0，那一項就不會消失。這正是互動模組裡「左半平面＝穩定」那條線的意思：複平面上把 λ 拖到虛軸右邊，解立刻炸開。' },

    { zh: 'λ = ±2i（純虛根）時，解的行為是什麼？',
      en: 'For purely imaginary roots λ = ±2i, how does the solution behave?',
      o: [['等幅振盪，不衰減也不發散', 'oscillates with constant amplitude, neither decaying nor growing'],
          ['指數衰減', 'decays exponentially'],
          ['指數發散', 'grows exponentially'],
          ['固定為常數', 'stays constant']], a: 0,
      e: 'α = 0 所以包絡線 e^(0·t) = 1，振幅不變；β = 2 決定振盪角頻率。物理上對應「無阻尼」的 LC 振盪或無摩擦彈簧。' },

    { zh: 'y″ + 4y′ + 4y = 0 的解是什麼？',
      en: 'What is the solution of y″ + 4y′ + 4y = 0?',
      o: [['y = (C₁ + C₂t)e^(−2t)', 'y = (C₁ + C₂t)e^(−2t)'],
          ['y = C₁e^(−2t) + C₂e^(2t)', 'y = C₁e^(−2t) + C₂e^(2t)'],
          ['y = e^(−2t)(A cos 2t + B sin 2t)', 'y = e^(−2t)(A cos 2t + B sin 2t)'],
          ['y = C₁e^(−4t) + C₂e^(−t)', 'y = C₁e^(−4t) + C₂e^(−t)']], a: 0,
      e: 'λ² + 4λ + 4 = (λ+2)² = 0 → λ = −2（重根），D = 16 − 16 = 0。重根要補 t：y = (C₁ + C₂t)e^(−2t)。' },

    { zh: '已知 y″ + 3y′ + 2y = 0、y(0) = 1、y′(0) = 1，C₁、C₂ 為何（設 y = C₁e^(−t) + C₂e^(−2t)）？',
      en: 'For y″ + 3y′ + 2y = 0 with y(0) = 1, y′(0) = 1, find C₁, C₂ where y = C₁e^(−t) + C₂e^(−2t).',
      o: [['C₁ = 3，C₂ = −2', 'C₁ = 3, C₂ = −2'], ['C₁ = 0，C₂ = 1', 'C₁ = 0, C₂ = 1'],
          ['C₁ = 1，C₂ = 0', 'C₁ = 1, C₂ = 0'], ['C₁ = −2，C₂ = 3', 'C₁ = −2, C₂ = 3']], a: 0,
      e: '聯立 C₁ + C₂ = 1 與 −C₁ − 2C₂ = 1。第一式乘 2 再相加：C₁ = 3，代回得 C₂ = −2。驗算：y(0) = 3 − 2 = 1 ✓，y′(0) = −3 + 4 = 1 ✓。<b>這題就是作業 Exercise 1，答案是 y = 3e^(−t) − 2e^(−2t)。</b>寫成 y = e^(−x) 的話 y′(0) = −1，不合。' },

    { zh: '求出 C₁、C₂ 之後，最後一定要做什麼？',
      en: 'After finding C₁ and C₂, what must you always do?',
      o: [['把答案代回去驗算兩個初始條件', 'substitute back and verify both initial conditions'],
          ['把答案化成最簡分數', 'reduce the answer to lowest terms'],
          ['檢查判別式', 'check the discriminant'],
          ['畫出圖形', 'plot the graph']], a: 0,
      e: 'y(0) 與 y′(0) 各代一次，30 秒就能抓出符號錯或聯立解錯。二階題目最常見的失分就是聯立解錯，而驗算一定抓得到。' },

    { zh: '為什麼二階齊次 ODE 的通解需要「兩個」線性獨立解？',
      en: 'Why does a second-order homogeneous ODE need TWO linearly independent solutions?',
      o: [['因為有兩個初始條件要滿足，需要兩個可調的常數', 'because two initial conditions must be satisfied, requiring two adjustable constants'],
          ['因為方程式有兩項', 'because the equation has two terms'],
          ['因為判別式是二次的', 'because the discriminant is quadratic'],
          ['因為要畫兩條曲線', 'because two curves must be drawn']], a: 0,
      e: '階數 = 初始條件個數 = 任意常數個數。二階要 y(0) 與 y′(0)，所以必須有 C₁、C₂ 兩個自由度。若兩個解不獨立（例如重根沒補 t），實際上只剩一個自由度，就湊不出任意的初始條件。' }
  ];
  let i = 0, score = 0, answered = false;

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
    q.o.forEach((pair, k) => {
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
    const q = Q[i], btns = Array.prototype.slice.call(host.querySelectorAll('.opt'));
    btns.forEach((b, idx) => { b.disabled = true; if (idx === q.a) b.classList.add('right'); });
    if (k === q.a) score++; else btns[k].classList.add('wrong');
    const ex = host.querySelector('.explain');
    ex.hidden = false;
    ex.innerHTML = '<b>' + (k === q.a ? '答對了。' : '正確答案是 ' + 'ABCD'[q.a] + '。') + '</b> ' + q.e;
    host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
    const nx = host.querySelector('#q-next');
    nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →';
    nx.classList.add('solid');
  }
  function done() {
    const pct = Math.round(score / Q.length * 100);
    const verdict = pct >= 90 ? '特徵方程這套流程你已經跑得很順，可以往非齊次（undetermined coefficients）前進了。'
      : pct >= 70 ? '主幹抓到了。答錯的那幾題回去把「根的位置 ↔ 解的形狀」那個模組再拖幾次。'
      : '建議從「為什麼猜 e^(λt)」與「根的位置決定解的形狀」兩節重新走一遍，那是這章的地基。';
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
