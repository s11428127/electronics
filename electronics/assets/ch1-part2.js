/* ============================================================
   電子學 CH1 PART 2 — P 型半導體與載子輸運
   Neamen 4e, Ch.1 投影片 p.31–55（1.1.2 P-Type ~ 1.1.3 Drift & Diffusion）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, TAU, MONO, BODY, pointerPos } = E;

  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n);
  const NI = 1.5e10;          /* 矽在 300K 的本質載子濃度 (cm^-3) */
  const QE = 1.6e-19;         /* 基本電荷 (C) */

  /* ══════════════════════════════════════════════════════════
     ① N 型 vs P 型 摻雜對照實驗室    投影片 p.31–34
     ══════════════════════════════════════════════════════════ */
  (function dopeCompare() {
    const cv = document.getElementById('cv-np'); if (!cv) return;
    const COLS = 5, ROWS = 4;
    let type = 'p', doped = new Set(), carriers = [], hits = [];

    const INFO = {
      n: { el: 'P', name: '磷 phosphorus', val: 5, group: '5A', role: '施體 donor',
           ion: '＋', ionName: 'P⁺（不動的正離子）', carrier: '電子', major: '電子 electron',
           minor: '電洞 hole', why: '磷有 5 個價電子，4 個拿去跟鄰居形成共價鍵，'
             + '第 5 個沒地方去，輕輕一激發就跑到導帶成為自由電子。磷失去電子後變成固定在晶格上的正離子。' },
      p: { el: 'B', name: '硼 boron', val: 3, group: '3A', role: '受體 acceptor',
           ion: '−', ionName: 'B⁻（不動的負離子）', carrier: '電洞', major: '電洞 hole',
           minor: '電子 electron', why: '硼只有 3 個價電子，跟鄰居形成共價鍵時會「少一個」，'
             + '留下一個填不滿的空位。鄰近矽的價電子跑來填補，原本那個位置就變成電洞。'
             + '硼接受了一個電子後變成固定在晶格上的負離子。' }
    };

    function grid(w, h) {
      const padX = w * 0.11, padY = 30;
      const dx = (w - padX * 2) / (COLS - 1), dy = (h - padY * 2) / (ROWS - 1);
      return { at: (c, r) => [padX + c * dx, padY + r * dy] };
    }

    const st = Stage(cv, { ratio: 0.58, minH: 250, maxH: 360, draw(ctx, w, h, dt) {
      const g = grid(w, h), I = INFO[type];
      /* 共價鍵 */
      ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = C['ink-3'];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const [x, y] = g.at(c, r);
        if (c < COLS - 1) { const [x2] = g.at(c + 1, r); [-3.5, 3.5].forEach(o => { ctx.beginPath(); ctx.moveTo(x + 16, y + o); ctx.lineTo(x2 - 16, y + o); ctx.stroke(); }); }
        if (r < ROWS - 1) { const [, y2] = g.at(c, r + 1); [-3.5, 3.5].forEach(o => { ctx.beginPath(); ctx.moveTo(x + o, y + 16); ctx.lineTo(x + o, y2 - 16); ctx.stroke(); }); }
      }
      /* 原子 */
      hits = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const [x, y] = g.at(c, r), id = c + ',' + r, isD = doped.has(id);
        const col = !isD ? C.line : type === 'n' ? C['ion-pos'] : C.electron;
        const bg = !isD ? C['surface-2'] : type === 'n' ? C['ion-pos-w'] : C['electron-w'];
        disc(ctx, x, y, 15, bg, col);
        label(ctx, x, y - (isD ? 3 : 0), isD ? I.el : 'Si', isD ? col : C['ink-2'], isD ? 12 : 11, 'center', '700');
        if (isD) label(ctx, x, y + 7, I.ion, col, 11, 'center', '700');
        hits.push({ x, y, id });
      }
      /* 產生的載子：n 型是自由電子、p 型是電洞 */
      while (carriers.length < doped.size) carriers.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * 100, vy: (Math.random() - .5) * 80 });
      while (carriers.length > doped.size) carriers.pop();
      carriers.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 12 || p.x > w - 12) p.vx *= -1;
        if (p.y < 12 || p.y > h - 12) p.vy *= -1;
        p.x = clamp(p.x, 12, w - 12); p.y = clamp(p.y, 12, h - 12);
        type === 'n' ? electron(ctx, p.x, p.y, 7) : hole(ctx, p.x, p.y, 7);
      });
      labelCJK(ctx, w / 2, h - 12, doped.size
        ? '每摻一個 ' + I.el + ' → 1 個不動的離子 ' + I.ion + ' + 1 個可移動的' + I.carrier
        : '點任一顆 Si，把它換成 ' + I.val + ' 價的 ' + I.el, C['ink-3'], 12);
    }});

    cv.addEventListener('click', ev => {
      const p = pointerPos(cv, ev);
      const hit = hits.find(s => Math.hypot(s.x - p.x, s.y - p.y) < 20);
      if (!hit) return;
      doped.has(hit.id) ? doped.delete(hit.id) : doped.add(hit.id);
      refresh();
    });
    function refresh() {
      const I = INFO[type];
      setText('np-el', I.el + '（' + I.name + '）');
      setText('np-val', I.val + ' 價 · ' + I.group + ' 族');
      setText('np-role', I.role);
      setText('np-ion', I.ionName);
      setText('np-major', I.major);
      setText('np-minor', I.minor);
      setText('np-cnt', doped.size + ' / ' + (COLS * ROWS));
      setText('np-why', I.why);
      document.querySelectorAll('[data-np]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.np === type)));
    }
    document.querySelectorAll('[data-np]').forEach(b => b.addEventListener('click', () => {
      type = b.dataset.np; doped.clear(); carriers = []; refresh();
    }));
    document.getElementById('np-clear').addEventListener('click', () => { doped.clear(); carriers = []; refresh(); });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ② 載子濃度計算器（質量作用定律）    投影片 p.40–41
     n_o·p_o = n_i²；n 型 n_o≈N_d, p_o=n_i²/N_d；p 型 p_o≈N_a, n_o=n_i²/N_a
     ══════════════════════════════════════════════════════════ */
  (function massAction2() {
    const cv = document.getElementById('cv-mass'); if (!cv) return;
    let type = 'n', logN = 16;

    function solve() {
      const N = Math.pow(10, logN);
      /* 完整解（含電中性條件），不是只用近似 */
      const maj = N / 2 + Math.sqrt(N * N / 4 + NI * NI);
      const min = NI * NI / maj;
      return type === 'n' ? { n: maj, p: min, N: N } : { n: min, p: maj, N: N };
    }

    const st = Stage(cv, { animate: false, ratio: 0.42, minH: 210, maxH: 280, draw(ctx, w, h) {
      const r = solve();
      const padL = 60, padR = 18, padT = 26, padB = 32;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const lo = 2, hi = 20;                       /* log10 範圍 */
      const X = v => lerp(x0, x1, (clamp(Math.log10(Math.max(v, 1)), lo, hi) - lo) / (hi - lo));

      /* 對數刻度軸 */
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      for (let k = lo; k <= hi; k += 3) {
        ctx.beginPath(); ctx.moveTo(X(Math.pow(10, k)), y0 - 6); ctx.lineTo(X(Math.pow(10, k)), y1 + 4); ctx.stroke();
        label(ctx, X(Math.pow(10, k)), y1 + 15, '10' + sup(k), C['ink-3'], 10);
      }
      labelCJK(ctx, x0, y0 - 16, '載子濃度（對數刻度，cm⁻³）', C['ink-3'], 11, 'left');

      /* n_i 基準線 */
      ctx.setLineDash([3, 3]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(X(NI), y0 - 6); ctx.lineTo(X(NI), y1 + 4); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, X(NI), y0 - 4, 'ni', C.warn, 10.5, 'center', '700');

      /* 三條棒：電子 n、電洞 p、摻雜 N */
      const rows = [
        ['電子 n', r.n, C.electron, type === 'n'],
        ['電洞 p', r.p, C.hole, type === 'p'],
        [type === 'n' ? '施體 Nd' : '受體 Na', r.N, C['ion-pos'], false]
      ];
      const bh = 17, gap = (y1 - y0 - bh * 3) / 2;
      rows.forEach(([nm, v, col, major], i) => {
        const y = y0 + i * (bh + gap);
        ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, y, x1 - x0, bh);
        ctx.fillStyle = col; ctx.fillRect(x0, y, Math.max(2, X(v) - x0), bh);
        labelCJK(ctx, x0 - 8, y + bh / 2, nm, col, 11, 'right', '600');
        label(ctx, Math.min(X(v) + 7, x1 - 4), y + bh / 2, sci(v, 2),
          col, 11, X(v) > x1 - 90 ? 'right' : 'left', '700');
        if (major) label(ctx, x0 + 6, y + bh / 2, '多數載子', C.surface, 10, 'left', '700');
      });
    }});

    function refresh() {
      const r = solve();
      setText('mass-N', sci(r.N, 2) + ' cm' + sup(-3));
      setText('mass-n', sci(r.n, 2) + ' cm' + sup(-3));
      setText('mass-p', sci(r.p, 2) + ' cm' + sup(-3));
      setText('mass-prod', sci(r.n * r.p, 2) + ' ≈ ni² = ' + sci(NI * NI, 2));
      setText('mass-ratio', '多數載子是少數載子的 ' + sci(Math.max(r.n, r.p) / Math.min(r.n, r.p), 1) + ' 倍');
      setText('mass-type', type === 'n' ? 'n 型：電子為多數載子' : 'p 型：電洞為多數載子');
      setText('mass-approx', r.N > NI * 100
        ? '因為 N ≫ ni，所以多數載子濃度 ≈ 摻雜濃度，少數載子 = ni²/N。'
        : '注意：N 還不夠大（沒有遠大於 ni），此時不能直接用「多數載子 ≈ N」的近似，要解完整的二次式。');
      document.querySelectorAll('[data-mass]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mass === type)));
      st.redraw();
    }
    bindRange('mass-Nr', v => '10' + sup(v) + ' cm' + sup(-3), v => { logN = v; refresh(); });
    document.querySelectorAll('[data-mass]').forEach(b => b.addEventListener('click', () => { type = b.dataset.mass; refresh(); }));
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 漂移方向實驗室 —— 整章最容易搞混的地方    投影片 p.43–45
     電子速度與 E 反向、電洞速度與 E 同向，但兩者電流都與 E 同向
     ══════════════════════════════════════════════════════════ */
  (function driftDir() {
    const cv = document.getElementById('cv-drift'); if (!cv) return;
    let show = 'both', Efield = 1, parts = [], inited = false;

    const st = Stage(cv, { ratio: 0.46, minH: 280, maxH: 340, draw(ctx, w, h, dt) {
      const padX = 44, x0 = padX, x1 = w - padX;
      const LH = 88, gapY = 24, topY = 70;

      /* 位置存成 0~1 的比例：第一次 paint 時版面可能還沒算好（w 會是 1），
         若直接換算成像素，所有粒子會擠在同一點然後一起被邊界折返。 */
      if (!inited) {
        parts = [];
        for (let i = 0; i < 8; i++) {
          parts.push({ k: 'e', t: (i + 0.5) / 8, lane: i % 3 });
          parts.push({ k: 'h', t: (i + 0.5) / 8, lane: (i + 1) % 3 });
        }
        inited = true;
      }
      const spanX = Math.max(1, (x1 - 14) - (x0 + 14));

      /* 電場方向條 */
      ctx.fillStyle = C['surface-2']; ctx.fillRect(0, 0, w, 48);
      const fx0 = w / 2 - 70, fx1 = w / 2 + 70;
      arrow(ctx, Efield > 0 ? fx0 : fx1, 24, Efield > 0 ? fx1 : fx0, 24, C.warn, 2.4);
      label(ctx, (Efield > 0 ? fx0 : fx1) - (Efield > 0 ? 12 : -12), 24, 'E', C.warn, 15, Efield > 0 ? 'right' : 'left', '700');
      labelCJK(ctx, w / 2, 41, '外加電場方向', C['ink-3'], 10.5);

      const lanes = [];
      if (show === 'both' || show === 'n') lanes.push(['n', 'n 型：自由電子', C.electron]);
      if (show === 'both' || show === 'p') lanes.push(['p', 'p 型：電洞', C.hole]);

      lanes.forEach(([kind, title, col], li) => {
        const y = topY + li * (LH + gapY);
        ctx.fillStyle = C.surface; ctx.strokeStyle = C.line; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(x0, y, x1 - x0, LH, 8); ctx.fill(); ctx.stroke();
        labelCJK(ctx, x0, y - 10, title, col, 12, 'left', '600');

        /* 電子逆著 E 跑、電洞順著 E 跑 */
        const vSign = kind === 'n' ? -Efield : Efield;
        parts.filter(p => p.k === (kind === 'n' ? 'e' : 'h')).forEach(p => {
          p.t += vSign * 52 * dt / spanX;
          if (p.t > 1) p.t -= 1;
          if (p.t < 0) p.t += 1;
          const px = lerp(x0 + 14, x1 - 14, p.t), py = y + 14 + p.lane * 12;
          kind === 'n' ? electron(ctx, px, py, 6.5) : hole(ctx, px, py, 6.5);
        });

        /* 分成左右兩欄：左邊是載子速度、右邊是電流方向，都畫在盒子裡面 */
        const cA = x0 + (x1 - x0) * 0.27, cB = x0 + (x1 - x0) * 0.73;
        const ay = y + LH - 16, ly = y + LH - 32, half = 34;
        label(ctx, cA, ly, kind === 'n' ? 'v_dn = −μn·E' : 'v_dp = +μp·E', col, 10.5, 'center', '600');
        arrow(ctx, cA - vSign * half, ay, cA + vSign * half, ay, col, 1.8);
        label(ctx, cB, ly, kind === 'n' ? 'Jn = e·n·μn·E' : 'Jp = e·p·μp·E', C.ok, 10.5, 'center', '700');
        arrow(ctx, cB - Efield * half, ay, cB + Efield * half, ay, C.ok, 2.4);
      });

      labelCJK(ctx, w / 2, h - 11,
        '兩種載子「跑的方向相反」，但「電流方向相同」，都跟 E 同向',
        C.ok, 11.5, 'center', '600');
    }});

    function refresh() {
      setText('drift-e', Efield > 0 ? '向右 →' : '← 向左');
      setText('drift-ve', Efield > 0 ? '← 向左（與 E 反向）' : '向右 →（與 E 反向）');
      setText('drift-vh', Efield > 0 ? '向右 →（與 E 同向）' : '← 向左（與 E 同向）');
      setText('drift-j', Efield > 0 ? '向右 →（與 E 同向）' : '← 向左（與 E 同向）');
      document.querySelectorAll('[data-drift]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.drift === show)));
    }
    document.querySelectorAll('[data-drift]').forEach(b => b.addEventListener('click', () => { show = b.dataset.drift; refresh(); }));
    document.getElementById('drift-flip').addEventListener('click', () => { Efield *= -1; refresh(); });
    refresh();
  })();
})();

/* ============================================================
   CH1 PART 2（續）：導電度、擴散電流、總電流密度、測驗
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, TAU, MONO, BODY, pointerPos } = E;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n);
  const NI = 1.5e10, QE = 1.6e-19;

  /* ══════════════════════════════════════════════════════════
     ④ 導電度計算器    投影片 p.49–51
     σ = e(n·μn + p·μp)，ρ = 1/σ，J = σE
     ══════════════════════════════════════════════════════════ */
  (function conduct() {
    const cv = document.getElementById('cv-sigma'); if (!cv) return;
    let logN = 15.9, type = 'n', Efld = 100, mun = 1350, mup = 480;

    function state() {
      const N = Math.pow(10, logN);
      const maj = N / 2 + Math.sqrt(N * N / 4 + NI * NI), min = NI * NI / maj;
      const n = type === 'n' ? maj : min, p = type === 'n' ? min : maj;
      const sn = QE * n * mun, sp = QE * p * mup;
      return { N, n, p, sn, sp, sigma: sn + sp, rho: 1 / (sn + sp), J: (sn + sp) * Efld };
    }

    const st = Stage(cv, { animate: false, ratio: 0.4, minH: 200, maxH: 260, draw(ctx, w, h) {
      const s = state();
      const padL = 58, padR = 18, padT = 30, padB = 40;
      const x0 = padL, x1 = w - padR, y = padT + 8, bh = 34;

      /* σ 由電子與電洞兩部分組成：用堆疊條顯示誰在主導 */
      const total = Math.max(s.sigma, 1e-30);
      const wn = (x1 - x0) * (s.sn / total), wp = (x1 - x0) * (s.sp / total);
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, y, x1 - x0, bh);
      ctx.fillStyle = C.electron; ctx.fillRect(x0, y, Math.max(wn, 0), bh);
      ctx.fillStyle = C.hole; ctx.fillRect(x0 + wn, y, Math.max(wp, 0), bh);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(x0, y, x1 - x0, bh);
      labelCJK(ctx, x0 - 8, y + bh / 2, 'σ 組成', C['ink-2'], 11.5, 'right', '600');

      const pctN = s.sn / total * 100;
      if (wn > 74) label(ctx, x0 + wn / 2, y + bh / 2, 'e·n·μn　' + pctN.toFixed(1) + '%', C.surface, 11.5, 'center', '700');
      if (wp > 74) label(ctx, x0 + wn + wp / 2, y + bh / 2, 'e·p·μp　' + (100 - pctN).toFixed(1) + '%', C.surface, 11.5, 'center', '700');
      labelCJK(ctx, x0, y + bh + 17, pctN > 99
        ? '電子項幾乎貢獻全部 → σ ≈ e·n·μn，電洞項可以忽略'
        : pctN < 1 ? '電洞項幾乎貢獻全部 → σ ≈ e·p·μp，電子項可以忽略'
        : '兩項都有貢獻，不能隨意忽略', pctN > 99 || pctN < 1 ? C.ok : C.warn, 11.5, 'left', '600');

      /* 等效電路：一塊半導體接電場 */
      const by = y + bh + 42, bx0 = x0 + 10, bx1 = Math.min(x1 - 10, bx0 + 240);
      if (h - by > 30) {
        ctx.fillStyle = C['surface-2']; ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.rect(bx0, by - 14, bx1 - bx0, 30); ctx.fill(); ctx.stroke();
        arrow(ctx, bx0 + 14, by + 1, bx1 - 14, by + 1, C.warn, 1.8);
        label(ctx, (bx0 + bx1) / 2, by - 24, 'E = ' + Efld + ' V/cm', C.warn, 10.5, 'center', '600');
        label(ctx, bx1 + 12, by + 1, 'J = σE = ' + fix(s.J, 1) + ' A/cm²', C.ok, 12, 'left', '700');
      }
    }});

    function refresh() {
      const s = state();
      setText('sig-n', sci(s.n, 2) + ' cm' + sup(-3));
      setText('sig-p', sci(s.p, 2) + ' cm' + sup(-3));
      setText('sig-sigma', fix(s.sigma, 3) + ' (Ω·cm)' + sup(-1));
      setText('sig-rho', fix(s.rho, 3) + ' Ω·cm');
      setText('sig-J', fix(s.J, 1) + ' A/cm²');
      setText('sig-area', '若要通過 1 mA，截面積只需 ' + sci(1e-3 / s.J, 2) + ' cm²');
      document.querySelectorAll('[data-sig]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sig === type)));
      st.redraw();
    }
    bindRange('sig-Nr', v => '10' + sup(v.toFixed(1)) + ' cm' + sup(-3), v => { logN = v; refresh(); });
    bindRange('sig-Er', v => v + ' V/cm', v => { Efld = v; refresh(); });
    bindRange('sig-mun', v => v + ' cm²/V·s', v => { mun = v; refresh(); });
    bindRange('sig-mup', v => v + ' cm²/V·s', v => { mup = v; refresh(); });
    document.querySelectorAll('[data-sig]').forEach(b => b.addEventListener('click', () => { type = b.dataset.sig; refresh(); }));
    document.getElementById('sig-book').addEventListener('click', () => {
      const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input')); };
      type = 'n'; set('sig-Nr', Math.log10(8e15).toFixed(1)); set('sig-Er', 100);
      set('sig-mun', 1350); set('sig-mup', 480);
    });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ 擴散電流實驗室    投影片 p.52–54
     Jn = +e·Dn·(dn/dx)  /  Jp = −e·Dp·(dp/dx)
     ══════════════════════════════════════════════════════════ */
  (function diffusion() {
    const cv = document.getElementById('cv-diff'); if (!cv) return;
    let kind = 'n', slope = 1, dots = [], inited = false;
    const Dn = 35, Dp = 12;          /* 矽的擴散係數 cm²/s */

    const st = Stage(cv, { ratio: 0.54, minH: 280, maxH: 350, draw(ctx, w, h, dt) {
      const padL = 78, padR = 20, padT = 24, padB = 74;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const isN = kind === 'n';
      const col = isN ? C.electron : C.hole;

      /* 濃度剖面（線性） */
      const conc = t => 0.5 + slope * 0.42 * (t - 0.5);     /* t: 0→1 對應 x */
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0, y0 - 4); ctx.lineTo(x0, y1); ctx.stroke();
      labelCJK(ctx, x0 - 10, (y0 + y1) / 2, isN ? '電子濃度 n' : '電洞濃度 p', col, 11, 'right', '600');
      label(ctx, x1, y1 + 15, 'x →', C['ink-3'], 10, 'right');

      const Y = v => lerp(y1, y0, clamp(v, 0, 1));
      ctx.beginPath(); ctx.moveTo(x0, Y(conc(0))); ctx.lineTo(x1, Y(conc(1)));
      ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0, Y(conc(0))); ctx.lineTo(x1, Y(conc(1))); ctx.lineTo(x1, y1); ctx.lineTo(x0, y1);
      ctx.closePath(); ctx.fillStyle = isN ? C['electron-w'] : C['hole-w']; ctx.globalAlpha = .45; ctx.fill(); ctx.globalAlpha = 1;

      /* 粒子：一律從濃處往稀處擴散 */
      if (!inited) { for (let i = 0; i < 26; i++) dots.push({ t: Math.random(), y: Math.random() }); inited = true; }
      const flowDir = slope > 0 ? -1 : 1;       /* 濃度往 +x 增加 → 擴散往 −x */
      dots.forEach(p => {
        const local = clamp(conc(p.t), 0.05, 1);
        if (Math.random() < local * 0.9) p.t += flowDir * dt * 0.16;
        if (p.t < 0) p.t = 1; if (p.t > 1) p.t = 0;
        const px = lerp(x0, x1, p.t);
        const py = lerp(y1 - 5, Y(conc(p.t)) + 6, p.y);
        if (py < y1 - 2) isN ? electron(ctx, px, py, 5.5) : hole(ctx, px, py, 5.5);
      });

      /* 兩組箭頭分左右兩欄：載子實際跑的方向 vs 電流方向 */
      const ay = y1 + 34, half = 36;
      const cA = x0 + (x1 - x0) * 0.28, cB = x0 + (x1 - x0) * 0.72;
      /* 電子帶負電 → 電流與粒子流反向；電洞帶正電 → 同向 */
      const jDir = isN ? -flowDir : flowDir;
      arrow(ctx, cA - flowDir * half, ay, cA + flowDir * half, ay, col, 2);
      labelCJK(ctx, cA, ay + 18, '載子往這邊擴散', col, 10.5);
      arrow(ctx, cB - jDir * half, ay, cB + jDir * half, ay, C.ok, 2.6);
      labelCJK(ctx, cB, ay + 18, (isN ? 'Jn' : 'Jp') + ' 電流方向', C.ok, 10.5);
      labelCJK(ctx, w / 2, h - 10,
        isN ? '電子帶負電 → 電流與載子跑的方向「相反」' : '電洞帶正電 → 電流與載子跑的方向「相同」',
        C['ink-3'], 10.5);
    }});

    function refresh() {
      const isN = kind === 'n', D = isN ? Dn : Dp;
      const grad = slope;   /* 只表示正負與相對大小 */
      setText('diff-D', (isN ? 'Dn = 35' : 'Dp = 12') + ' cm²/s');
      setText('diff-grad', slope > 0 ? 'dn/dx > 0（往 +x 濃度變大）'.replace('n/', isN ? 'n/' : 'p/') : 'd' + (isN ? 'n' : 'p') + '/dx < 0（往 +x 濃度變小）');
      setText('diff-formula', isN ? 'Jn = +e·Dn·(dn/dx)' : 'Jp = −e·Dp·(dp/dx)');
      const sign = isN ? (slope > 0 ? '+' : '−') : (slope > 0 ? '−' : '+');
      setText('diff-sign', sign + '（' + (sign === '+' ? '沿 +x' : '沿 −x') + '）');
      setText('diff-note', isN
        ? '電子往濃度低的地方擴散，但電子帶負電，所以「電流方向」與電子跑的方向相反 —— 這就是 Jn 前面是正號的原因。'
        : '電洞往濃度低的地方擴散，電洞帶正電，所以「電流方向」就是電洞跑的方向 —— 但因為梯度往低處是負的，公式前面要補一個負號。');
      document.querySelectorAll('[data-diff]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.diff === kind)));
    }
    bindRange('diff-slope', v => v > 0 ? '往 +x 遞增' : '往 +x 遞減', v => { slope = v; refresh(); });
    document.querySelectorAll('[data-diff]').forEach(b => b.addEventListener('click', () => { kind = b.dataset.diff; refresh(); }));
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑥ 總電流密度四項組合器    投影片 p.55
     ══════════════════════════════════════════════════════════ */
  (function totalJ() {
    const host = document.getElementById('tot-out'); if (!host) return;
    const ON = { drift: true, diff: true, n: true, p: true };
    function render() {
      const terms = [];
      if (ON.drift && ON.n) terms.push(['e·n·μn·E', '電子漂移', 'electron drift', C => C.electron]);
      if (ON.drift && ON.p) terms.push(['e·p·μp·E', '電洞漂移', 'hole drift', C => C.hole]);
      if (ON.diff && ON.n) terms.push(['+ e·Dn·(dn/dx)', '電子擴散', 'electron diffusion', C => C.electron]);
      if (ON.diff && ON.p) terms.push(['− e·Dp·(dp/dx)', '電洞擴散', 'hole diffusion', C => C.hole]);
      host.innerHTML =
        '<div class="d-eq hi" style="white-space:normal;line-height:2.1">J = ' +
          (terms.length ? terms.map((t, i) => (i && !t[0].startsWith('+') && !t[0].startsWith('−') ? ' + ' : ' ') + t[0]).join('') : '0（沒有任何成分）') +
        '</div>' +
        '<div class="f0-grid" style="margin-top:12px">' +
        terms.map(t => '<div class="f0-card"><div class="f0-t">' + t[2] + '</div>' +
          '<b style="font-size:14.5px">' + t[1] + '</b>' +
          '<span class="d-eq" style="margin-top:8px">' + t[0].replace(/^[+−] /, '') + '</span></div>').join('') +
        '</div>';
      setText('tot-count', terms.length + ' / 4 項');
      setText('tot-note', !ON.drift && !ON.diff ? '兩種機制都關掉就沒有電流了。'
        : ON.drift && !ON.diff ? '只剩漂移：載子被電場推著走。可以整理成 J = σE，也就是歐姆定律的微觀版本。'
        : !ON.drift && ON.diff ? '只剩擴散：沒有電場，純粹因為濃度不均勻造成的淨流動。pn 接面沒加偏壓時就是這種情況。'
        : '完整式子四項都在。課本說：實務上通常只有其中一種機制在某個區域佔主導，所以不必四項都算。');
    }
    document.querySelectorAll('[data-tot]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.tot; ON[k] = !ON[k];
      b.setAttribute('aria-pressed', String(ON[k]));
      render();
    }));
    document.querySelectorAll('[data-tot]').forEach(b => b.setAttribute('aria-pressed', 'true'));
    render();
  })();
})();

/* ============================================================
   CH1 PART 2 觀念小測驗（中英對照）+ 導覽
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '在矽中摻入 3 價的硼（B），會形成哪一種半導體？',
      en: 'Doping silicon with trivalent boron (B) produces which type of semiconductor?',
      o: [['p 型，電洞為多數載子', 'p-type, holes are majority carriers'],
          ['n 型，電子為多數載子', 'n-type, electrons are majority carriers'],
          ['本質半導體', 'intrinsic semiconductor'],
          ['化合物半導體', 'compound semiconductor']], a: 0,
      e: '硼只有 3 個價電子，與矽形成共價鍵時會少一個，留下空位形成電洞。電洞帶正電且為多數載子，所以叫 p 型（positive）。硼是受體（acceptor）雜質。' },

    { zh: '硼原子接受一個電子之後變成什麼？它會導電嗎？',
      en: 'After a boron atom accepts an electron, what does it become, and does it conduct?',
      o: [['不動的負離子 B⁻，不具傳導性', 'a fixed negative ion B⁻, non-conducting'],
          ['可移動的負離子，會導電', 'a mobile negative ion that conducts'],
          ['不動的正離子 B⁺，不具傳導性', 'a fixed positive ion B⁺, non-conducting'],
          ['自由電子', 'a free electron']], a: 0,
      e: '硼被固定在晶格上，接受電子後帶負電成為 B⁻。離子不能移動，所以不導電 —— 導電的是它「製造出來」的那個電洞。對照 n 型：磷失去電子後變成不動的 P⁺。' },

    { zh: 'n 型與 p 型半導體，整體是否帶電？',
      en: 'Are n-type and p-type semiconductors electrically charged overall?',
      o: [['都是電中性', 'both are electrically neutral'],
          ['n 型帶負電、p 型帶正電', 'n-type negative, p-type positive'],
          ['n 型帶正電、p 型帶負電', 'n-type positive, p-type negative'],
          ['視摻雜濃度而定', 'depends on doping concentration']], a: 0,
      e: '4 價的矽和 5 價（或 3 價）的雜質，兩個本來就電中性的東西加在一起，總電荷仍為零。多出來的自由電子被固定的正離子平衡，多出來的電洞被固定的負離子平衡。' },

    { zh: '矽摻雜之後，它還算是「元素半導體」嗎？',
      en: 'After doping, is silicon still an elemental semiconductor?',
      o: [['是，基礎材料仍是單一元素矽', 'yes, the base material is still a single element'],
          ['不是，變成化合物半導體', 'no, it becomes a compound semiconductor'],
          ['n 型是、p 型不是', 'yes for n-type, no for p-type'],
          ['視摻雜濃度而定', 'depends on doping concentration']], a: 0,
      e: '摻雜只是加入極少量雜質（約 1:10⁸）改變導電性，基礎材料仍是單一元素 Si，所以還是元素半導體。化合物半導體指的是本身就由兩種以上元素化合而成，例如 GaAs、InP —— 那不是摻雜。' },

    { zh: '質量作用定律（Law of Mass Action）的內容是？',
      en: 'What does the law of mass action state?',
      o: [['熱平衡下 n₀·p₀ = nᵢ²，與摻雜量無關', 'at thermal equilibrium n₀·p₀ = nᵢ², independent of doping'],
          ['n₀ + p₀ = nᵢ', 'n₀ + p₀ = nᵢ'],
          ['n₀ = p₀ 恆成立', 'n₀ = p₀ always'],
          ['n₀·p₀ 隨摻雜濃度上升', 'n₀·p₀ increases with doping']], a: 0,
      e: '不論摻雜多少，熱平衡下正負載子濃度的乘積都是定值 nᵢ²。所以摻施體讓 n 上升時，p 一定被壓下去 —— 兩者是蹺蹺板關係。注意前提是「熱平衡」：沒有光照、沒有外加電場。' },

    { zh: '矽在 300 K 摻入 N_d = 10¹⁶ cm⁻³ 的磷，少數載子濃度約為多少？（nᵢ = 1.5×10¹⁰）',
      en: 'Silicon at 300 K doped with N_d = 10¹⁶ cm⁻³ phosphorus. What is the minority carrier concentration? (nᵢ = 1.5×10¹⁰)',
      o: [['2.25×10⁴ cm⁻³', '2.25×10⁴ cm⁻³'], ['1.5×10¹⁰ cm⁻³', '1.5×10¹⁰ cm⁻³'],
          ['10¹⁶ cm⁻³', '10¹⁶ cm⁻³'], ['2.25×10²⁰ cm⁻³', '2.25×10²⁰ cm⁻³']], a: 0,
      e: 'n 型的少數載子是電洞：p₀ = nᵢ²/N_d = (1.5×10¹⁰)²/10¹⁶ = 2.25×10²⁰/10¹⁶ = 2.25×10⁴ cm⁻³。比多數載子少了 12 個數量級。這就是課本 Example 1.2(a)。' },

    { zh: '電子的漂移速度 v_dn 與電場 E 的關係為何？',
      en: 'What is the relation between electron drift velocity v_dn and the electric field E?',
      o: [['v_dn = −μn·E，方向與 E 相反', 'v_dn = −μn·E, opposite to E'],
          ['v_dn = +μn·E，方向與 E 相同', 'v_dn = +μn·E, same as E'],
          ['v_dn = μn/E', 'v_dn = μn/E'],
          ['與 E 無關', 'independent of E']], a: 0,
      e: '電子帶負電，受力 F = −qE 與電場反向，所以往 E 的反方向漂移，前面帶負號。電洞帶正電則是 v_dp = +μp·E，與 E 同向。' },

    { zh: '在 n 型半導體中，電子往左跑，那電流密度 Jn 的方向是？',
      en: 'In an n-type semiconductor, electrons drift to the left. What is the direction of Jn?',
      o: [['向右，與電場 E 同向', 'to the right, same direction as E'],
          ['向左，與電子同向', 'to the left, same as the electrons'],
          ['沒有方向', 'no direction'],
          ['視摻雜濃度而定', 'depends on doping']], a: 0,
      e: 'Jn = −e·n·v_dn = −e·n·(−μn·E) = +e·n·μn·E。兩個負號相乘變正，所以電流與 E 同向。重點：電子和電洞「跑的方向相反」，但產生的「電流方向相同」，都跟 E 同向。' },

    { zh: '電子移動率 μn 的正確單位是？',
      en: 'What is the correct unit of electron mobility μn?',
      o: [['cm²/(V·s)', 'cm²/(V·s)'], ['cm³/(V·s)', 'cm³/(V·s)'],
          ['cm/(V·s)', 'cm/(V·s)'], ['V·s/cm²', 'V·s/cm²']], a: 0,
      e: '由 v = μE 反推：μ = v/E，單位 = (cm/s)/(V/cm) = cm²/(V·s)。矽的 μn ≈ 1350 cm²/V·s、μp ≈ 480 cm²/V·s。注意是**平方**不是立方 —— 你的講義這裡寫成 cm³ 了。' },

    { zh: '半導體的導電度 σ 公式為何？',
      en: 'What is the formula for the conductivity σ of a semiconductor?',
      o: [['σ = e(n·μn + p·μp)', 'σ = e(n·μn + p·μp)'],
          ['σ = e(n·μn − p·μp)', 'σ = e(n·μn − p·μp)'],
          ['σ = e·n·p', 'σ = e·n·p'],
          ['σ = (n·μn + p·μp)/e', 'σ = (n·μn + p·μp)/e']], a: 0,
      e: 'J = Jn + Jp = e·n·μn·E + e·p·μp·E = e(n·μn + p·μp)E ≡ σE。兩項相加不是相減，因為兩種載子的電流都與 E 同向。電阻率 ρ = 1/σ，單位 Ω·cm。' },

    { zh: '擴散電流是由什麼造成的？',
      en: 'What causes diffusion current?',
      o: [['濃度梯度 concentration gradient', 'a concentration gradient'],
          ['外加電場 applied electric field', 'an applied electric field'],
          ['溫度梯度 temperature gradient', 'a temperature gradient'],
          ['磁場 magnetic field', 'a magnetic field']], a: 0,
      e: '漂移電流由「電場」造成，擴散電流由「濃度梯度」造成 —— 這是 1.1.3 的核心分類。載子會自然從濃度高的地方往低的地方跑，就像香水味會擴散到整個房間一樣。' },

    { zh: '電子與電洞的擴散電流密度公式，正負號為何不同？',
      en: 'Why do the electron and hole diffusion current density formulas have different signs?',
      o: [['因為電子帶負電、電洞帶正電', 'because electrons are negative and holes are positive'],
          ['因為 Dn ≠ Dp', 'because Dn ≠ Dp'],
          ['因為濃度梯度方向相反', 'because the gradients point in opposite directions'],
          ['這是任意的定義', 'it is an arbitrary convention']], a: 0,
      e: 'Jn = +e·Dn·(dn/dx)，Jp = −e·Dp·(dp/dx)。兩種載子都是「從濃處往稀處」擴散，但電子帶負電，所以電流方向與它跑的方向相反，多了一次變號；電洞帶正電，電流就是它跑的方向。矽的 Dn = 35 cm²/s、Dp = 12 cm²/s。' }
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
    const verdict = pct >= 90 ? '這一段已經很穩，可以往過剩載子與 pn 接面前進了。'
      : pct >= 70 ? '主幹抓到了，把答錯的那幾題回去把對應的互動模組再玩一次。'
      : '建議從「漂移方向實驗室」與「擴散電流實驗室」重新走一遍，那兩個是這段最容易混淆的地方。';
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
