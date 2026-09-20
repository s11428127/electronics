/* ============================================================
   工程數學 — 拉普拉斯轉換 Laplace Transform
   互動模組（對應課堂筆記 9/17 ~ 9/20）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, TAU, MONO, BODY, pointerPos } = E;

  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n);
  const sgn = x => (x < 0 ? '−' : '+');

  /* ══════════════════════════════════════════════════════════
     ① 轉換機器 —— 「什麼是 transform」
     A --T--> B，B = T(A)
     ══════════════════════════════════════════════════════════ */
  (function machine() {
    const cv = document.getElementById('cv-machine'); if (!cv) return;
    let mode = 'life', sel = -1, anim = 0, running = false;

    const SETS = {
      life: {
        aName: '原料', bName: '成品', tName: '加工',
        items: [['黃豆', '豆漿'], ['攝氏 100°', '華氏 212°'], ['小麥', '麵粉'], ['木材', '紙']],
        note: '轉換 = 一台機器：東西從 A 進去，變成 B 出來。B = T(A)。'
      },
      laplace: {
        aName: '{ f(t) | t ∈ ℝ }　實變數函數', bName: '{ F(s) | s = σ+jω ∈ ℂ }　複變數函數', tName: 'ℒ',
        items: [['f(t) = 1', 'F(s) = 1/s'], ['f(t) = t', 'F(s) = 1/s²'],
                ['f(t) = e²ᵗ', 'F(s) = 1/(s−2)'], ['f(t) = cos 3t', 'F(s) = s/(s²+9)']],
        note: 'ℒ 也是一台機器：吃進「t 的實變數函數」，吐出「s 的複變數函數」。'
      }
    };

    const st = Stage(cv, { ratio: 0.52, minH: 260, maxH: 340, draw(ctx, w, h, dt) {
      const S = SETS[mode];
      if (running) { anim = Math.min(1, anim + dt * 0.9); if (anim >= 1) running = false; }

      const colW = Math.min((w - 40) * 0.33, 210);
      const ax = 16, bx = w - 16 - colW, mx = w / 2;
      const top = 44, rowH = Math.min(38, (h - top - 30) / S.items.length);

      /* 兩個集合的框 */
      [[ax, S.aName, C['p-real']], [bx, S.bName, C['s-app']]].forEach(([x, name, col]) => {
        ctx.fillStyle = C['surface-2'];
        ctx.fillRect(x, top - 8, colW, rowH * S.items.length + 16);
        ctx.strokeStyle = col; ctx.lineWidth = 1.4;
        ctx.strokeRect(x, top - 8, colW, rowH * S.items.length + 16);
        labelCJK(ctx, x + colW / 2, top - 20, name, col, mode === 'life' ? 12.5 : 11, 'center', '600');
      });

      /* 中間的機器 */
      const mw = 58, mh = 44, my = top + rowH * S.items.length / 2 - 4;
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.roundRect(mx - mw / 2, my - mh / 2, mw, mh, 9); ctx.fill();
      label(ctx, mx, my, S.tName, C.surface, mode === 'life' ? 13 : 17, 'center', '700');
      labelCJK(ctx, mx, my + mh / 2 + 13, mode === 'life' ? '轉換 T' : '拉普拉斯轉換', C['ink-3'], 10.5);

      /* 項目列 */
      S.items.forEach((pair, i) => {
        const y = top + rowH * i + rowH / 2;
        const on = i === sel;
        label(ctx, ax + colW / 2, y, pair[0], on ? C['p-real'] : C['ink-2'], 12.5, 'center', on ? '700' : '500');
        const revealed = on && anim >= 1;
        label(ctx, bx + colW / 2, y, revealed ? pair[1] : '?', revealed ? C['s-app'] : C['ink-3'],
          12.5, 'center', revealed ? '700' : '500');
        if (on) {
          ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.globalAlpha = .5;
          ctx.strokeRect(ax + 4, y - rowH / 2 + 3, colW - 8, rowH - 6);
          ctx.globalAlpha = 1;
        }
      });

      /* 飛行中的 token */
      if (sel >= 0) {
        const y = top + rowH * sel + rowH / 2;
        const p = anim, ease = p * p * (3 - 2 * p);
        const x0 = ax + colW, x1 = bx;
        const px = lerp(x0, x1, ease);
        const pyy = lerp(y, my, Math.min(1, ease * 2)) * (ease < .5 ? 1 : 0) + lerp(my, y, Math.max(0, ease * 2 - 1)) * (ease < .5 ? 0 : 1);
        arrow(ctx, x0 + 4, y, mx - mw / 2 - 4, my, C['ink-3'], 1.2);
        arrow(ctx, mx + mw / 2 + 4, my, x1 - 4, y, C['ink-3'], 1.2);
        if (p < 1) {
          disc(ctx, px, pyy, 7, ease < .5 ? C['p-real'] : C['s-app'], C.surface);
        }
      }
      labelCJK(ctx, w / 2, h - 12, S.note, C['ink-3'], 11.5);
    }});

    function pick(i) { sel = i; anim = 0; running = true; refresh(); }
    function refresh() {
      const S = SETS[mode];
      document.querySelectorAll('[data-mach]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mach === mode)));
      const box = document.getElementById('mach-btns');
      box.innerHTML = '';
      S.items.forEach((pair, i) => {
        const b = document.createElement('button');
        b.className = 'btn'; b.type = 'button'; b.textContent = pair[0];
        b.setAttribute('aria-pressed', String(i === sel));
        b.addEventListener('click', () => pick(i));
        box.appendChild(b);
      });
      setText('mach-msg', mode === 'life'
        ? '轉換就是「把一個東西變成另一個東西」的規則。重點是：進去的和出來的，是兩種不同的東西。'
        : 'ℒ 把「時間 t 的函數」變成「複數 s 的函數」。左邊是你熟悉的微積分世界，右邊是可以用代數解決問題的世界。');
    }
    document.querySelectorAll('[data-mach]').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.mach; sel = -1; anim = 0; refresh();
    }));
    refresh();
    pick(0);
  })();

  /* ══════════════════════════════════════════════════════════
     ② 複變數函數視覺化 —— f(z) 把 z 平面變成什麼樣
     ══════════════════════════════════════════════════════════ */
  (function complexFn() {
    const cv = document.getElementById('cv-cplx'); if (!cv) return;
    let kind = 'sq', zx = 1.2, zy = 0.8, drag = false;

    const FN = {
      sq: { name: 'f(z) = z² + 2', range: 9,
            f: (x, y) => [x * x - y * y + 2, 2 * x * y],
            steps: (x, y) => ['z = x + iy = ' + fix(x) + ' ' + sgn(y) + ' ' + fix(Math.abs(y)) + 'i',
              'f(z) = (x+iy)² + 2 = x² + 2ixy + (iy)² + 2',
              'i² = −1　⟹　= (x² − y² + 2) + i(2xy)',
              'Re = ' + fix(x * x - y * y + 2) + '　Im = ' + fix(2 * x * y)] },
      exp: { name: 'f(z) = e⁻ᶻ', range: 6,
            f: (x, y) => [Math.exp(-x) * Math.cos(y), -Math.exp(-x) * Math.sin(y)],
            steps: (x, y) => ['z = x + iy = ' + fix(x) + ' ' + sgn(y) + ' ' + fix(Math.abs(y)) + 'i',
              'e⁻ᶻ = e⁻⁽ˣ⁺ⁱʸ⁾ = e⁻ˣ · e⁻ⁱʸ',
              '尤拉公式：e⁻ⁱʸ = cos y − i·sin y　（注意是減號）',
              '⟹ = e⁻ˣcos y − i·e⁻ˣsin y',
              'Re = ' + fix(Math.exp(-x) * Math.cos(y)) + '　Im = ' + fix(-Math.exp(-x) * Math.sin(y))] }
    };

    function panes(w, h) {
      const gap = 30, pad = 16;
      const size = Math.min((w - gap - pad * 2) / 2, h - 44);
      return { size, lx: (w - gap) / 2 - size, rx: (w + gap) / 2, ty: (h - size) / 2 + 8 };
    }

    const st = Stage(cv, { animate: false, ratio: 0.58, minH: 290, maxH: 380, draw(ctx, w, h) {
      const F = FN[kind], g = panes(w, h);
      const zR = 3, wR = F.range;

      function grid(ox, oy, size, R, title, col) {
        ctx.fillStyle = C['surface-2']; ctx.fillRect(ox, oy, size, size);
        ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
        for (let k = -R; k <= R; k++) {
          const t = (k / R + 1) / 2;
          ctx.beginPath(); ctx.moveTo(ox + t * size, oy); ctx.lineTo(ox + t * size, oy + size);
          ctx.moveTo(ox, oy + t * size); ctx.lineTo(ox + size, oy + t * size); ctx.stroke();
          if (k % (R > 5 ? 3 : 1) === 0 && k !== 0) {
            label(ctx, ox + t * size, oy + size / 2 + 9, String(k), C['ink-3'], 8.5);
          }
        }
        ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(ox, oy + size / 2); ctx.lineTo(ox + size, oy + size / 2);
        ctx.moveTo(ox + size / 2, oy); ctx.lineTo(ox + size / 2, oy + size); ctx.stroke();
        labelCJK(ctx, ox + size / 2, oy - 12, title, col, 12, 'center', '600');
        label(ctx, ox + size - 4, oy + size / 2 - 9, 'Re', C['ink-3'], 9, 'right');
        label(ctx, ox + size / 2 + 12, oy + 8, 'Im', C['ink-3'], 9, 'left');
      }
      const Zx = v => g.lx + (v / zR + 1) / 2 * g.size;
      const Zy = v => g.ty + (1 - (v / zR + 1) / 2) * g.size;
      const Wx = v => g.rx + (clamp(v, -wR, wR) / wR + 1) / 2 * g.size;
      const Wy = v => g.ty + (1 - (clamp(v, -wR, wR) / wR + 1) / 2) * g.size;

      grid(g.lx, g.ty, g.size, zR, 'z 平面（輸入）', C['p-real']);
      grid(g.rx, g.ty, g.size, wR, 'w = f(z) 平面（輸出）', C['s-app']);

      /* 把 z 平面上的水平線映射過去，看得出整個平面被扭成什麼樣。
         兩邊都要 clip 在自己的框內，否則曲線會跑出格子外。 */
      ctx.lineWidth = 1.2; ctx.globalAlpha = 0.55;
      ctx.save(); ctx.beginPath(); ctx.rect(g.rx, g.ty, g.size, g.size); ctx.clip();
      for (let yy = -2; yy <= 2; yy++) {
        ctx.strokeStyle = yy === 0 ? C.accent : C['p-real'];
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const x = lerp(-zR, zR, i / 120), o = F.f(x, yy);
          i ? ctx.lineTo(Wx(o[0]), Wy(o[1])) : ctx.moveTo(Wx(o[0]), Wy(o[1]));
        }
        ctx.stroke();
      }
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(g.lx, g.ty, g.size, g.size); ctx.clip();
      for (let yy = -2; yy <= 2; yy++) {
        ctx.strokeStyle = yy === 0 ? C.accent : C['p-real'];
        ctx.beginPath(); ctx.moveTo(Zx(-zR), Zy(yy)); ctx.lineTo(Zx(zR), Zy(yy)); ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      /* 目前的點 */
      const o = F.f(zx, zy);
      disc(ctx, Zx(zx), Zy(zy), 7, C['p-real'], C.surface);
      const out = Math.abs(o[0]) > wR || Math.abs(o[1]) > wR;
      disc(ctx, Wx(o[0]), Wy(o[1]), 7, out ? C['ink-3'] : C['s-app'], C.surface);
      if (out) label(ctx, g.rx + g.size / 2, g.ty + g.size + 14, '（輸出超出顯示範圍）', C['ink-3'], 9.5);
      arrow(ctx, g.lx + g.size + 6, g.ty + g.size / 2, g.rx - 6, g.ty + g.size / 2, C.accent, 2);
      label(ctx, (g.lx + g.size + g.rx) / 2, g.ty + g.size / 2 - 12, 'f', C.accent, 13, 'center', '700');
      labelCJK(ctx, w / 2, h - 10, '拖曳左邊的點', C['ink-3'], 11);
    }});

    function pickPt(ev) {
      const p = pointerPos(cv, ev), g = panes(st.w, st.h);
      if (p.x < g.lx - 10 || p.x > g.lx + g.size + 10) return;
      zx = clamp((p.x - g.lx) / g.size * 2 - 1, -1, 1) * 3;
      zy = clamp(1 - (p.y - g.ty) / g.size * 2, -1, 1) * 3;
      refresh();
    }
    cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); pickPt(e); });
    cv.addEventListener('pointermove', e => { if (drag) pickPt(e); });
    cv.addEventListener('pointerup', () => { drag = false; });

    function refresh() {
      const F = FN[kind], o = F.f(zx, zy);
      setText('cplx-z', fix(zx) + ' ' + sgn(zy) + ' ' + fix(Math.abs(zy)) + 'i');
      setText('cplx-re', fix(o[0]));
      setText('cplx-im', fix(o[1]));
      const box = document.getElementById('cplx-steps');
      box.innerHTML = F.steps(zx, zy).map(t => '<span class="d-eq">' + t + '</span>').join('');
      document.querySelectorAll('[data-cf]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cf === kind)));
      st.redraw();
    }
    document.querySelectorAll('[data-cf]').forEach(b => b.addEventListener('click', () => { kind = b.dataset.cf; refresh(); }));
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 為什麼要乘 e^(−st) 再積分 —— 整章最重要的直覺
     F(s) = ∫₀^∞ f(t)·e^(−st) dt　＝　乘積曲線下的面積
     ══════════════════════════════════════════════════════════ */
  (function whyEst() {
    const cv = document.getElementById('cv-why'); if (!cv) return;
    let s = 2, key = 'exp2';

    const FS = {
      one:  { name: 'f(t) = 1',      f: () => 1,                        F: s => 1 / s,            Ftxt: '1/s',        min: 0 },
      t:    { name: 'f(t) = t',      f: t => t,                         F: s => 1 / (s * s),      Ftxt: '1/s²',       min: 0 },
      exp2: { name: 'f(t) = e²ᵗ',    f: t => Math.exp(2 * t),           F: s => 1 / (s - 2),      Ftxt: '1/(s−2)',    min: 2 },
      expm: { name: 'f(t) = e⁻ᵗ',    f: t => Math.exp(-t),              F: s => 1 / (s + 1),      Ftxt: '1/(s+1)',    min: -1 },
      cos:  { name: 'f(t) = cos 3t', f: t => Math.cos(3 * t),           F: s => s / (s * s + 9),  Ftxt: 's/(s²+9)',   min: 0 }
    };

    /* 數值積分（Simpson），用來驗證「面積真的等於 F(s)」 */
    function area(fn, s, T, n) {
      n = n || 2000; const hh = T / n; let sum = 0;
      for (let i = 0; i <= n; i++) {
        const t = i * hh, v = fn(t) * Math.exp(-s * t);
        sum += v * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
      }
      return sum * hh / 3;
    }

    const st = Stage(cv, { animate: false, ratio: 0.72, minH: 330, maxH: 430, draw(ctx, w, h) {
      const F = FS[key], diverge = s <= F.min + 1e-9;
      const padL = 46, padR = w > 620 ? 176 : 16, padT = 26, padB = 26;
      const x0 = padL, x1 = w - padR;
      const rowH = (h - padT - padB) / 3;
      const T = 4;
      const X = t => lerp(x0, x1, t / T);

      function row(i, title, fn, col, fill) {
        const yTop = padT + rowH * i, yBot = yTop + rowH - 12;
        let hi = 0;
        for (let k = 0; k <= 80; k++) hi = Math.max(hi, Math.abs(fn(k / 80 * T)));
        hi = Math.max(hi, 0.6);
        const mid = (yTop + yBot) / 2, sc = (yBot - yTop) / 2 / (hi * 1.12);
        ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke();
        if (fill) {
          ctx.beginPath(); ctx.moveTo(x0, mid);
          for (let k = 0; k <= 160; k++) ctx.lineTo(X(k / 160 * T), mid - fn(k / 160 * T) * sc);
          ctx.lineTo(x1, mid); ctx.closePath();
          ctx.fillStyle = fill; ctx.fill();
        }
        ctx.beginPath();
        for (let k = 0; k <= 160; k++) {
          const t = k / 160 * T, y = clamp(mid - fn(t) * sc, yTop - 4, yBot + 4);
          k ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y);
        }
        ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke();
        labelCJK(ctx, x0 + 2, yTop + 4, title, col, 11.5, 'left', '600');
        label(ctx, x0 - 6, mid, '0', C['ink-3'], 9.5, 'right');
      }

      row(0, '① f(t) 原函數', FS[key].f, C['p-real'], null);
      row(1, '② e^(−st) 衰減包絡　s = ' + fix(s, 2), t => Math.exp(-s * t), C['q-react'], null);
      row(2, '③ 乘積 f(t)·e^(−st)　← 這塊面積就是 F(s)',
        t => FS[key].f(t) * Math.exp(-s * t), C['s-app'],
        diverge ? 'rgba(200,60,40,.18)' : C['s-app-w']);
      label(ctx, x1, h - 10, 't →', C['ink-3'], 10, 'right');

      /* 右側：F(s) 曲線與目前的 s */
      const gx0 = x1 + 24, gx1 = w - 14, gy0 = padT + 6, gy1 = h - padB - 18;
      if (gx1 - gx0 > 90) {
        const sLo = Math.max(F.min + 0.15, 0.2), sHi = sLo + 6;
        let vmax = 0;
        for (let k = 0; k <= 40; k++) vmax = Math.max(vmax, Math.abs(F.F(lerp(sLo, sHi, k / 40))));
        vmax = Math.max(vmax, 1e-6);
        const SX = v => lerp(gx0, gx1, (v - sLo) / (sHi - sLo));
        const SY = v => lerp(gy1, gy0, clamp(v / (vmax * 1.1), -0.1, 1));
        ctx.fillStyle = C['surface-2']; ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
        ctx.save(); ctx.beginPath(); ctx.rect(gx0, gy0, gx1 - gx0, gy1 - gy0); ctx.clip();
        ctx.beginPath();
        for (let k = 0; k <= 120; k++) {
          const sv = lerp(sLo, sHi, k / 120);
          k ? ctx.lineTo(SX(sv), SY(F.F(sv))) : ctx.moveTo(SX(sv), SY(F.F(sv)));
        }
        ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();
        if (!diverge) {
          const cs = clamp(s, sLo, sHi);
          ctx.setLineDash([3, 3]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(SX(cs), gy1); ctx.lineTo(SX(cs), SY(F.F(cs))); ctx.stroke(); ctx.setLineDash([]);
          disc(ctx, SX(cs), SY(F.F(cs)), 5, C.accent, C.surface);
        }
        labelCJK(ctx, (gx0 + gx1) / 2, gy0 - 13, 'F(s) = ' + F.Ftxt, C.accent, 11, 'center', '600');
        label(ctx, gx0, gy1 + 12, 's →', C['ink-3'], 9.5, 'left');
        labelCJK(ctx, (gx0 + gx1) / 2, gy1 + 12, '每個 s 對應一塊面積', C['ink-3'], 9.5);
      }
    }});

    function refresh() {
      const F = FS[key], diverge = s <= F.min + 1e-9;
      setText('why-s', fix(s, 2));
      setText('why-formula', F.Ftxt);
      const el = document.getElementById('why-msg');
      if (diverge) {
        setText('why-area', '發散 ∞');
        setText('why-exact', '不存在');
        el.className = 'msg bad';
        el.textContent = '✗ s = ' + fix(s, 2) + ' 太小了：f(t) 長得比 e^(−st) 衰減得還快，'
          + '乘積不但沒有變小反而爆炸，積分發散、F(s) 不存在。'
          + '這個函數必須 s > ' + fix(F.min, 0) + ' 才收斂 —— 這就是「收斂區（ROC）」的意思。';
      } else {
        const num = area(F.f, s, Math.min(60, 40 / Math.max(s - F.min, 0.2)));
        setText('why-area', fix(num, 4));
        setText('why-exact', fix(F.F(s), 4));
        el.className = 'msg good';
        el.textContent = '✓ 數值算出的面積 ' + fix(num, 4) + ' 幾乎等於公式值 ' + fix(F.F(s), 4)
          + '。把 s 從小滑到大，面積就一路變小 —— 右邊那條 F(s) 曲線，就是這樣一格一格描出來的。';
      }
      document.querySelectorAll('[data-why]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.why === key)));
      st.redraw();
    }
    bindRange('why-sr', v => 's = ' + v.toFixed(2), v => { s = v; refresh(); });
    document.querySelectorAll('[data-why]').forEach(b => b.addEventListener('click', () => { key = b.dataset.why; refresh(); }));
    refresh();
  })();
})();

/* ============================================================
   拉普拉斯轉換（續）：轉換對照表、微分性質、解 ODE
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, TAU, MONO, BODY, pointerPos } = E;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n);

  /* ══════════════════════════════════════════════════════════
     ④ 轉換對照表 —— 點一個 f(t)，看它怎麼被積出來
     ══════════════════════════════════════════════════════════ */
  (function pairs() {
    const host = document.getElementById('pair-list'); if (!host) return;
    const P = [
      { f: 'f(t) = 1', Fs: 'F(s) = 1/s', roc: 's > 0',
        steps: ['∫₀^∞ 1 · e^(−st) dt',
                '= [ −(1/s)·e^(−st) ]₀^∞',
                '= 0 − ( −1/s )　（t→∞ 時 e^(−st)→0，需要 s > 0）',
                '= 1/s'] },
      { f: 'f(t) = t', Fs: 'F(s) = 1/s²', roc: 's > 0',
        steps: ['∫₀^∞ t · e^(−st) dt　← 用分部積分，取 u = t、dv = e^(−st)dt',
                '= [ −(t/s)e^(−st) ]₀^∞ + (1/s)∫₀^∞ e^(−st) dt',
                '第一項在 t→∞ 與 t=0 都是 0',
                '= (1/s) · (1/s) = 1/s²'] },
      { f: 'f(t) = e^(at)', Fs: 'F(s) = 1/(s−a)', roc: 's > a',
        steps: ['∫₀^∞ e^(at) · e^(−st) dt = ∫₀^∞ e^(−(s−a)t) dt',
                '兩個指數合併：指數相加',
                '= [ −1/(s−a) · e^(−(s−a)t) ]₀^∞',
                '= 0 − ( −1/(s−a) ) = 1/(s−a)　（要 s > a 才收斂）'] },
      { f: 'f(t) = cos ωt', Fs: 'F(s) = s/(s²+ω²)', roc: 's > 0',
        steps: ['用尤拉公式：cos ωt = (e^(jωt) + e^(−jωt)) / 2',
                '= ½[ ℒ(e^(jωt)) + ℒ(e^(−jωt)) ]',
                '= ½[ 1/(s−jω) + 1/(s+jω) ]　← 直接套上一條的結果',
                '通分：= ½ · 2s/(s²+ω²) = s/(s²+ω²)'] },
      { f: 'f(t) = sin ωt', Fs: 'F(s) = ω/(s²+ω²)', roc: 's > 0',
        steps: ['sin ωt = (e^(jωt) − e^(−jωt)) / (2j)',
                '= (1/2j)[ 1/(s−jω) − 1/(s+jω) ]',
                '= (1/2j) · 2jω/(s²+ω²)',
                '= ω/(s²+ω²)'] }
    ];
    let open = 0;
    function render() {
      host.innerHTML = '';
      P.forEach((p, i) => {
        const row = document.createElement('div');
        row.className = 'pair-row' + (i === open ? ' on' : '');
        row.innerHTML =
          '<button class="pair-head" type="button" aria-expanded="' + (i === open) + '">' +
            '<span class="pf">' + p.f + '</span>' +
            '<span class="arr">—— ℒ ——▸</span>' +
            '<span class="pF">' + p.Fs + '</span>' +
            '<span class="roc">' + p.roc + '</span>' +
          '</button>' +
          (i === open ? '<div class="pair-body">' +
            p.steps.map(t => '<span class="d-eq">' + t + '</span>').join('') + '</div>' : '');
        row.querySelector('.pair-head').addEventListener('click', () => { open = open === i ? -1 : i; render(); });
        host.appendChild(row);
      });
    }
    render();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ 微分性質逐步推導 —— ℒ(f') = sF(s) − f(0)
     ══════════════════════════════════════════════════════════ */
  (function derivProp() {
    const cv = document.getElementById('cv-deriv'); if (!cv) return;
    let step = 0;

    const STEPS = [
      { eq: 'ℒ( f′(t) ) = ∫₀^∞ f′(t) · e^(−st) dt',
        why: '從定義開始：要轉換的對象換成 f′(t)，其他照抄。' },
      { eq: '= ∫₀^∞ e^(−st) · df(t)',
        why: '因為 f′(t)dt = df(t)。這樣寫是為了湊出分部積分的形狀。' },
      { eq: '分部積分：∫ f dg = f·g − ∫ g df',
        why: '取 f ← e^(−st)、g ← f(t)。這是整個推導唯一的技巧。' },
      { eq: '= [ e^(−st)·f(t) ]₀^∞ − ∫₀^∞ f(t) · d(e^(−st))',
        why: '套進去。注意後面那項還留著一個 d(e^(−st)) 要處理。' },
      { eq: 'd(e^(−st))/dt = −s·e^(−st)　⟹　d(e^(−st)) = −s·e^(−st) dt',
        why: '把微分算出來。關鍵：跑出一個常數 −s，它等一下會被提到積分外面。' },
      { eq: '= [ e^(−st)f(t) ]₀^∞ + s∫₀^∞ f(t)e^(−st) dt',
        why: '負負得正，而且 s 是常數可以提出來。右邊那個積分你已經認得了。' },
      { eq: '邊界項：lim(t→∞) e^(−st)f(t) = 0，　lim(t→0) e^(−st)f(t) = 1·f(0) = f(0)',
        why: 't→0 時 e⁰ = 1，所以只剩 f(0)。t→∞ 那項要為 0，需要 f 不能長得比 e^(st) 還快（指數階條件）。' },
      { eq: '= ( 0 − f(0) ) + s·F(s)',
        why: '把兩個邊界值代進去。那個 −f(0) 就是這樣冒出來的 —— 它來自積分的下限 t = 0。' },
      { eq: 'ℒ( f′(t) ) = s·F(s) − f(0)',
        why: '完成。這條就是拉普拉斯能拿來解微分方程的原因：微分變成了「乘 s」再扣掉初始值。' }
    ];

    const st = Stage(cv, { animate: false, ratio: 0.46, minH: 230, maxH: 300, draw(ctx, w, h) {
      /* 視覺化：兩個世界的對應關係 */
      const cy = h / 2;
      const bw = Math.min((w - 90) / 2, 230), bh = 64;
      const lx = (w - 40) / 2 - bw, rx = (w + 40) / 2;

      [[lx, 't 域（時間）', ['f(t)', 'f′(t)'], C['p-real']],
       [rx, 's 域（複數）', ['F(s)', 's·F(s) − f(0)'], C['s-app']]].forEach(([x, title, rows, col]) => {
        ctx.fillStyle = C['surface-2'];
        ctx.beginPath(); ctx.roundRect(x, cy - bh, bw, bh * 2, 9); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.roundRect(x, cy - bh, bw, bh * 2, 9); ctx.stroke();
        labelCJK(ctx, x + bw / 2, cy - bh - 13, title, col, 12, 'center', '600');
        rows.forEach((t, i) => {
          const done = step >= (i === 0 ? 0 : STEPS.length - 1);
          label(ctx, x + bw / 2, cy + (i ? bh / 2 : -bh / 2), t,
            i === 1 && step < STEPS.length - 1 ? C['ink-3'] : col,
            i === 1 ? 13 : 14, 'center', '700');
        });
        ctx.strokeStyle = C['line']; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x + 10, cy); ctx.lineTo(x + bw - 10, cy); ctx.stroke();
      });

      /* 水平：ℒ 轉換；垂直：微分 */
      [[cy - bh / 2], [cy + bh / 2]].forEach(([y], i) => {
        const shown = i === 0 || step >= STEPS.length - 1;
        ctx.globalAlpha = shown ? 1 : .25;
        arrow(ctx, lx + bw + 6, y, rx - 6, y, C.accent, 2);
        label(ctx, (lx + bw + rx) / 2, y - 11, 'ℒ', C.accent, 13, 'center', '700');
        ctx.globalAlpha = 1;
      });
      [[lx + bw / 2, C['p-real'], 'd/dt'], [rx + bw / 2, C['s-app'], '×s 再 −f(0)']].forEach(([x, col, t], i) => {
        const shown = i === 0 || step >= STEPS.length - 1;
        ctx.globalAlpha = shown ? 1 : .25;
        arrow(ctx, x, cy - bh / 2 + 14, x, cy + bh / 2 - 14, col, 1.8);
        labelCJK(ctx, x + 8, cy, t, col, 11, 'left', '600');
        ctx.globalAlpha = 1;
      });
      labelCJK(ctx, w / 2, h - 10,
        step >= STEPS.length - 1 ? '微分 → 在 s 域變成「乘以 s，再扣掉初始值」' : '按「下一步」把右下角推出來',
        step >= STEPS.length - 1 ? C.accent : C['ink-3'], 11.5, 'center', step >= STEPS.length - 1 ? '600' : '500');
    }});

    function render() {
      const box = document.getElementById('deriv-steps');
      box.innerHTML = STEPS.slice(0, step + 1).map((s, i) =>
        '<div class="dv-step' + (i === step ? ' on' : '') + '">' +
          '<span class="dv-no">' + (i + 1) + '</span>' +
          '<div><span class="d-eq' + (i === STEPS.length - 1 ? ' hi' : '') + '">' + s.eq + '</span>' +
          '<p class="dv-why">' + s.why + '</p></div></div>').join('');
      setText('deriv-count', (step + 1) + ' / ' + STEPS.length);
      const btn = document.getElementById('deriv-next');
      btn.textContent = step >= STEPS.length - 1 ? '從頭再看一次 ↺' : '下一步 →';
      st.redraw();
      box.scrollTop = box.scrollHeight;
    }
    document.getElementById('deriv-next').addEventListener('click', () => {
      step = step >= STEPS.length - 1 ? 0 : step + 1; render();
    });
    document.getElementById('deriv-all').addEventListener('click', () => { step = STEPS.length - 1; render(); });
    render();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑥ 為什麼會多一個 −f(0)？ 直接對算給你看
     ══════════════════════════════════════════════════════════ */
  (function whyF0() {
    const host = document.getElementById('f0-out'); if (!host) return;
    let key = 'e2t';
    const CASES = {
      e2t: { f: 'f(t) = e²ᵗ', f0: '1', F: '1/(s−2)',
             fp: 'f′(t) = 2e²ᵗ', direct: '2/(s−2)',
             naive: 's/(s−2)',
             correct: 's/(s−2) − 1 = (s − (s−2))/(s−2) = 2/(s−2)' },
      t:   { f: 'f(t) = t', f0: '0', F: '1/s²',
             fp: 'f′(t) = 1', direct: '1/s',
             naive: 's·(1/s²) = 1/s',
             correct: 's·(1/s²) − 0 = 1/s' },
      cos: { f: 'f(t) = cos 3t', f0: '1', F: 's/(s²+9)',
             fp: 'f′(t) = −3 sin 3t', direct: '−9/(s²+9)',
             naive: 's²/(s²+9)',
             correct: 's²/(s²+9) − 1 = (s² − (s²+9))/(s²+9) = −9/(s²+9)' }
    };
    function render() {
      const c = CASES[key];
      const ok = c.naive.replace(/\s/g, '') === c.direct.replace(/\s/g, '');
      host.innerHTML =
        '<div class="f0-grid">' +
          '<div class="f0-card">' +
            '<div class="f0-t">已知</div>' +
            '<span class="d-eq">' + c.f + '　f(0) = ' + c.f0 + '</span>' +
            '<span class="d-eq">F(s) = ' + c.F + '</span>' +
          '</div>' +
          '<div class="f0-card">' +
            '<div class="f0-t">直接微分再轉換（標準答案）</div>' +
            '<span class="d-eq">' + c.fp + '</span>' +
            '<span class="d-eq hi">ℒ(f′) = ' + c.direct + '</span>' +
          '</div>' +
          '<div class="f0-card ' + (ok ? 'good' : 'bad') + '">' +
            '<div class="f0-t">若天真地用 s·F(s)（漏掉 −f(0)）</div>' +
            '<span class="d-eq">' + c.naive + '</span>' +
            '<div class="f0-verdict">' + (ok
              ? '✓ 剛好對 —— 但只是因為 f(0) = 0，運氣好而已。'
              : '✗ 錯！跟標準答案 ' + c.direct + ' 不一樣。') + '</div>' +
          '</div>' +
          '<div class="f0-card good">' +
            '<div class="f0-t">用 s·F(s) − f(0)</div>' +
            '<span class="d-eq">' + c.correct + '</span>' +
            '<div class="f0-verdict">✓ 與標準答案完全一致。</div>' +
          '</div>' +
        '</div>';
      document.querySelectorAll('[data-f0]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f0 === key)));
      setText('f0-msg', key === 't'
        ? '這個例子 f(0) = 0，所以漏掉也不會錯 —— 但這是特例。考試不會這麼好心。'
        : 'f(0) ≠ 0 的時候，漏掉 −f(0) 的答案就是錯的。初始值不是裝飾品，它是解的一部分。');
    }
    document.querySelectorAll('[data-f0]').forEach(b => b.addEventListener('click', () => { key = b.dataset.f0; render(); }));
    render();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑦ 用 ℒ 解微分方程 —— 走完一整圈
     ══════════════════════════════════════════════════════════ */
  (function solveOde() {
    const cv = document.getElementById('cv-ode'); if (!cv) return;
    let stage = 0, prob = 'a';

    const PROBS = {
      a: { title: "y′ + 3y = 0,　y(0) = 2",
           steps: [
             { box: 1, eq: "y′ + 3y = 0,　y(0) = 2", why: '原始的微分方程，連同初始條件。在 t 域裡要解它得用分離變數或積分因子。' },
             { box: 2, eq: "ℒ: [ sY(s) − y(0) ] + 3Y(s) = 0", why: '兩邊同時做 ℒ。微分項用 ℒ(y′) = sY(s) − y(0)，初始值就在這裡進來。' },
             { box: 2, eq: "sY(s) − 2 + 3Y(s) = 0", why: '代入 y(0) = 2。到這裡已經沒有微分了，只剩代數。' },
             { box: 2, eq: "Y(s)(s + 3) = 2　⟹　Y(s) = 2/(s+3)", why: '像國中解方程一樣把 Y(s) 移項解出來。這就是 ℒ 的威力：微分方程變成一次方程。' },
             { box: 3, eq: "ℒ⁻¹: y(t) = 2·e^(−3t)", why: '查表反轉換：1/(s−a) ↔ e^(at)，這裡 a = −3，前面的係數 2 直接跟著走。' },
             { box: 3, eq: "驗算：y(0) = 2 ✓　y′ = −6e^(−3t)，y′+3y = −6e^(−3t)+6e^(−3t) = 0 ✓", why: '代回原式確認。養成驗算的習慣，這一步只要十秒。' }
           ], ans: 'y(t) = 2e^(−3t)', fn: t => 2 * Math.exp(-3 * t) },
      b: { title: "y′ − 2y = 0,　y(0) = 1",
           steps: [
             { box: 1, eq: "y′ − 2y = 0,　y(0) = 1", why: '這次是正的指數，注意符號。' },
             { box: 2, eq: "ℒ: sY(s) − 1 − 2Y(s) = 0", why: '同樣代 ℒ(y′) = sY(s) − y(0)，y(0) = 1。' },
             { box: 2, eq: "Y(s)(s − 2) = 1　⟹　Y(s) = 1/(s−2)", why: '整理。分母出現 (s−2)，等一下反轉換會對應到 e^(2t)。' },
             { box: 3, eq: "ℒ⁻¹: y(t) = e^(2t)", why: '1/(s−a) ↔ e^(at)，這裡 a = +2。' },
             { box: 3, eq: "注意：F(s) = 1/(s−2) 的收斂區是 s > 2", why: '解會發散（t→∞ 時爆掉），這也反映在收斂區的限制上。' }
           ], ans: 'y(t) = e^(2t)', fn: t => Math.exp(2 * t) }
    };

    const st = Stage(cv, { animate: false, ratio: 0.44, minH: 220, maxH: 290, draw(ctx, w, h) {
      const P = PROBS[prob], cur = P.steps[Math.min(stage, P.steps.length - 1)];
      const bw = Math.min((w - 70) / 3, 190), bh = 74, cy = h / 2 - 12;
      const xs = [(w - bw * 3 - 50) / 2, 0, 0];
      xs[1] = xs[0] + bw + 25; xs[2] = xs[1] + bw + 25;
      const TITLES = ['① t 域\n微分方程', '② s 域\n代數方程', '③ 解回 t 域\n答案'];
      const COLS = [C['p-real'], C['s-app'], C.accent];

      xs.forEach((x, i) => {
        const active = cur.box === i + 1;
        ctx.fillStyle = active ? C['surface-2'] : C.surface;
        ctx.beginPath(); ctx.roundRect(x, cy - bh / 2, bw, bh, 10); ctx.fill();
        ctx.strokeStyle = active ? COLS[i] : C.line; ctx.lineWidth = active ? 2.4 : 1.2;
        ctx.beginPath(); ctx.roundRect(x, cy - bh / 2, bw, bh, 10); ctx.stroke();
        TITLES[i].split('\n').forEach((t, k) =>
          labelCJK(ctx, x + bw / 2, cy - 10 + k * 17, t, active ? COLS[i] : C['ink-3'], k ? 12 : 12.5, 'center', '600'));
        if (active) { disc(ctx, x + bw / 2, cy + bh / 2 - 14, 4, COLS[i]); }
      });

      [[0, 'ℒ 轉換'], [1, 'ℒ⁻¹ 反轉換']].forEach(([i, t]) => {
        const x0 = xs[i] + bw + 4, x1 = xs[i + 1] - 4;
        const on = cur.box >= i + 2;
        ctx.globalAlpha = on ? 1 : .3;
        arrow(ctx, x0, cy, x1, cy, C.accent, 2);
        labelCJK(ctx, (x0 + x1) / 2, cy - 15, t, C.accent, 10.5, 'center', '600');
        ctx.globalAlpha = 1;
      });
      labelCJK(ctx, w / 2, h - 14, '繞這一圈，是為了避開在 t 域直接解微分方程', C['ink-3'], 11.5);
    }});

    function render() {
      const P = PROBS[prob];
      stage = clamp(stage, 0, P.steps.length - 1);
      const box = document.getElementById('ode-steps');
      box.innerHTML = P.steps.slice(0, stage + 1).map((s, i) =>
        '<div class="dv-step' + (i === stage ? ' on' : '') + '">' +
          '<span class="dv-no">' + (i + 1) + '</span>' +
          '<div><span class="d-eq' + (i === P.steps.length - 1 ? ' hi' : '') + '">' + s.eq + '</span>' +
          '<p class="dv-why">' + s.why + '</p></div></div>').join('');
      setText('ode-title', P.title);
      setText('ode-count', (stage + 1) + ' / ' + P.steps.length);
      const b = document.getElementById('ode-next');
      b.textContent = stage >= P.steps.length - 1 ? '從頭再看一次 ↺' : '下一步 →';
      document.querySelectorAll('[data-ode]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.ode === prob)));
      st.redraw();
      box.scrollTop = box.scrollHeight;
    }
    document.getElementById('ode-next').addEventListener('click', () => {
      const P = PROBS[prob];
      stage = stage >= P.steps.length - 1 ? 0 : stage + 1; render();
    });
    document.querySelectorAll('[data-ode]').forEach(b => b.addEventListener('click', () => {
      prob = b.dataset.ode; stage = 0; render();
    }));
    render();
  })();
})();

/* ============================================================
   小測驗（中英對照）+ 導覽
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '拉普拉斯轉換的定義是什麼？',
      en: 'What is the definition of the Laplace transform?',
      o: [['∫₀^∞ f(t)e^(−st) dt', '∫₀^∞ f(t)e^(−st) dt'], ['∫₀^∞ f(t)e^(st) dt', '∫₀^∞ f(t)e^(st) dt'],
          ['∫₋∞^∞ f(t)e^(−st) dt', '∫₋∞^∞ f(t)e^(−st) dt'], ['∫₀^∞ f(t)e^(−t) dt', '∫₀^∞ f(t)e^(−t) dt']], a: 0,
      e: 'ℒ(f(t)) = F(s) = ∫₀^∞ f(t)e^(−st)dt。三個重點：指數是「負」的 st（要讓它衰減才收斂）、積分下限是 0（所以 f(0) 才會在微分性質中冒出來）、積分變數是 t（積完之後 t 消失，只剩 s）。' },

    { zh: 'ℒ 把哪一種函數轉換成哪一種函數？',
      en: 'The Laplace transform maps which kind of function to which?',
      o: [['實變數函數 f(t) → 複變數函數 F(s)', 'real function f(t) → complex function F(s)'],
          ['複變數函數 → 實變數函數', 'complex function → real function'],
          ['實變數函數 → 實變數函數', 'real function → real function'],
          ['複變數函數 → 複變數函數', 'complex function → complex function']], a: 0,
      e: '定義域是 { f(t) | t ∈ ℝ }（實變數函數），值域是 { F(s) | s = σ + jω ∈ ℂ }（複變數函數）。這就是筆記上 A --ℒ--> B 那張圖的意思：轉換就是把一個集合的東西送到另一個集合。' },

    { zh: '為什麼被積函數要乘上 e^(−st)？',
      en: 'Why is the integrand multiplied by e^(−st)?',
      o: [['讓積分有機會收斂，並且讓每個 s 對應一個數值', 'to make the integral converge and map each s to a number'],
          ['為了讓答案變成實數', 'to make the answer real'],
          ['因為 e 是自然對數的底', 'because e is the base of natural log'],
          ['純粹是歷史習慣', 'purely historical convention']], a: 0,
      e: 'e^(−st) 是一個衰減因子，把 f(t) 壓下去讓 ∫₀^∞ 有機會收斂；同時 e^(λt) 本來就是常係數 ODE 的解的形式，所以用它當「探針」特別自然。換一個 s，面積就不同 —— 掃過所有 s 就描出整條 F(s)。' },

    { zh: 'e^(at) 的拉普拉斯轉換與其收斂條件為何？',
      en: 'What is the Laplace transform of e^(at) and its condition of convergence?',
      o: [['1/(s−a)，須 s > a', '1/(s−a), requires s > a'], ['1/(s+a)，須 s > a', '1/(s+a), requires s > a'],
          ['1/(s−a)，無條件', '1/(s−a), no condition'], ['a/(s²+a²)，須 s > 0', 'a/(s²+a²), requires s > 0']], a: 0,
      e: '∫₀^∞ e^(at)e^(−st)dt = ∫₀^∞ e^(−(s−a)t)dt = 1/(s−a)。指數必須是負的才會在 t→∞ 時趨近 0，所以需要 s − a > 0，即 s > a。這個範圍叫收斂區（ROC）。' },

    { zh: 'ℒ(f′(t)) 等於什麼？',
      en: 'What does ℒ(f′(t)) equal?',
      o: [['sF(s) − f(0)', 'sF(s) − f(0)'], ['sF(s)', 'sF(s)'],
          ['sF(s) + f(0)', 'sF(s) + f(0)'], ['F(s)/s', 'F(s)/s']], a: 0,
      e: '用分部積分推出來：邊界項 [e^(−st)f(t)]₀^∞ 給出 0 − f(0) = −f(0)，剩下的積分給出 sF(s)。那個 −f(0) 來自積分下限 t = 0，不是可以省略的裝飾。' },

    { zh: '在推導 ℒ(f′) 時，用到的核心技巧是什麼？',
      en: 'What is the key technique used in deriving ℒ(f′)?',
      o: [['分部積分', 'integration by parts'], ['變數變換', 'change of variables'],
          ['部分分式', 'partial fractions'], ['泰勒展開', 'Taylor expansion']], a: 0,
      e: '∫ f dg = fg − ∫ g df，取 f ← e^(−st)、g ← f(t)。分部積分把「對 f′ 積分」轉成「對 f 積分」，這樣右邊才會出現 F(s) 本身。' },

    { zh: 'ℒ(f″(t)) 等於什麼？',
      en: 'What does ℒ(f″(t)) equal?',
      o: [['s²F(s) − sf(0) − f′(0)', 's²F(s) − sf(0) − f′(0)'],
          ['s²F(s) − f(0) − f′(0)', 's²F(s) − f(0) − f′(0)'],
          ['s²F(s) − sf′(0) − f(0)', 's²F(s) − sf′(0) − f(0)'],
          ['s²F(s)', 's²F(s)']], a: 0,
      e: '把微分性質用兩次：ℒ(f″) = sℒ(f′) − f′(0) = s[sF(s) − f(0)] − f′(0) = s²F(s) − sf(0) − f′(0)。注意 f(0) 前面帶著一個 s，f′(0) 沒有 —— 順序不能寫反。' },

    { zh: '若 f(0) = 0，漏寫 −f(0) 會怎樣？',
      en: 'If f(0) = 0, what happens if you omit the −f(0) term?',
      o: [['剛好不影響答案，但這只是特例', 'answer happens to be right, but only in this special case'],
          ['一定會錯', 'the answer is always wrong'],
          ['會差一個常數 1', 'the answer differs by a constant 1'],
          ['積分會發散', 'the integral diverges']], a: 0,
      e: 'f(0) = 0 時 sF(s) − 0 = sF(s)，剛好一樣。但只要初始值不為零（例如 f(t) = e^(2t)，f(0) = 1）就會錯。不能養成漏寫的習慣。' },

    { zh: '複數 z = x + iy，則 e^(−z) 的展開為何？',
      en: 'For a complex number z = x + iy, what is the expansion of e^(−z)?',
      o: [['e⁻ˣ(cos y − i sin y)', 'e^(−x)(cos y − i sin y)'],
          ['e⁻ˣ(cos y + i sin y)', 'e^(−x)(cos y + i sin y)'],
          ['e⁻ˣ(sin y − i cos y)', 'e^(−x)(sin y − i cos y)'],
          ['eˣ(cos y + i sin y)', 'e^(x)(cos y + i sin y)']], a: 0,
      e: 'e^(−z) = e^(−x−iy) = e^(−x)·e^(−iy)。尤拉公式 e^(iθ) = cos θ + i sin θ，代 θ = −y 得 e^(−iy) = cos(−y) + i sin(−y) = cos y − i sin y。所以是**減號**：Re = e^(−x)cos y，Im = −e^(−x)sin y。這個負號很容易抄錯。' },

    { zh: '用拉普拉斯解 ODE 的核心好處是什麼？',
      en: 'What is the main advantage of solving an ODE with the Laplace transform?',
      o: [['微分方程變成代數方程，且初始條件自動代入', 'the ODE becomes algebra, with initial conditions built in'],
          ['不需要初始條件', 'no initial conditions are needed'],
          ['可以解任何非線性方程', 'it solves any nonlinear equation'],
          ['計算量一定比較少', 'it always requires less computation']], a: 0,
      e: '在 s 域裡，微分變成「乘 s」，所以微分方程直接變成一次方程，移項就解得出 Y(s)。而且 y(0)、y′(0) 在轉換當下就被吃進去了，不必像傳統做法那樣先求通解再代初始條件定常數。' },

    { zh: '解 y′ + 3y = 0、y(0) = 2，在 s 域的方程式為何？',
      en: 'For y′ + 3y = 0 with y(0) = 2, what is the equation in the s-domain?',
      o: [['sY(s) − 2 + 3Y(s) = 0', 'sY(s) − 2 + 3Y(s) = 0'],
          ['sY(s) + 2 + 3Y(s) = 0', 'sY(s) + 2 + 3Y(s) = 0'],
          ['sY(s) + 3Y(s) = 0', 'sY(s) + 3Y(s) = 0'],
          ['s²Y(s) − 2 + 3Y(s) = 0', 's²Y(s) − 2 + 3Y(s) = 0']], a: 0,
      e: 'ℒ(y′) = sY(s) − y(0) = sY(s) − 2，ℒ(3y) = 3Y(s)，ℒ(0) = 0。整理得 Y(s)(s+3) = 2 → Y(s) = 2/(s+3) → y(t) = 2e^(−3t)。' },

    { zh: '關於收斂區（ROC），下列敘述何者正確？',
      en: 'Which statement about the region of convergence (ROC) is correct?',
      o: [['s 必須夠大，e^(−st) 才壓得住 f(t) 的成長', 's must be large enough for e^(−st) to dominate the growth of f(t)'],
          ['所有函數的 ROC 都是 s > 0', 'the ROC is always s > 0'],
          ['ROC 與 f(t) 無關', 'the ROC does not depend on f(t)'],
          ['s 越小積分越容易收斂', 'smaller s makes convergence easier']], a: 0,
      e: 'f(t) = e^(2t) 時，乘積是 e^((2−s)t)；只有 s > 2 這個指數才是負的、積分才收斂。若 s ≤ 2，乘積不減反增，積分發散、F(s) 根本不存在。ROC 取決於 f(t) 成長得多快。' }
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
    const verdict = pct >= 90 ? '拉普拉斯的觀念已經很穩，可以往反轉換與部分分式前進了。'
      : pct >= 70 ? '主幹抓到了，把答錯的那幾題回去把對應的互動模組再玩一次。'
      : '建議從「為什麼要乘 e^(−st)」與「微分性質推導」兩個模組重新走一遍，那是這章的地基。';
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
