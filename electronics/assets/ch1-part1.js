/* ============================================================
   CH1 PART 1 互動模組
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, K_EV, TAU, MONO, BODY, pointerPos } = E;

  /* ══════════════════════════════════════════════════════════
     ① 訊號極性實驗室 —— DC / AC / 脈動直流   (投影片 p.3)
     ══════════════════════════════════════════════════════════ */
  (function signalLab() {
    const cv = document.getElementById('cv-signal'); if (!cv) return;
    let Vdc = 3, Vac = 1.5, f = 1.2, phase = 0;

    const st = Stage(cv, { ratio: 0.34, minH: 180, maxH: 240, draw(ctx, w, h, dt) {
      phase += dt * f * TAU;
      const padL = 46, padR = 16, padT = 18, padB = 26;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const vMax = 8, mid = (y0 + y1) / 2, sy = (y1 - y0) / 2 / vMax;
      const V = t => Vdc + Vac * Math.sin(t * f * TAU + phase);

      /* 格線與電壓刻度 */
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      for (let v = -8; v <= 8; v += 4) {
        const y = mid - v * sy;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
        label(ctx, x0 - 8, y, v + 'V', C['ink-3'], 10, 'right');
      }
      /* 零線（極性分界） */
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1, mid); ctx.stroke();

      /* 波形：正半週 / 負半週分色填充，讓「極性」看得見 */
      const N = 240, span = 2.2;
      const pt = i => { const t = i / N * span; return [lerp(x0, x1, i / N), mid - clamp(V(t), -vMax, vMax) * sy]; };
      [[1, C.electron, C['electron-w']], [-1, C.hole, C['hole-w']]].forEach(([sign, , fillC]) => {
        ctx.beginPath(); ctx.moveTo(x0, mid);
        for (let i = 0; i <= N; i++) { const [x, y] = pt(i); ctx.lineTo(x, sign > 0 ? Math.min(y, mid) : Math.max(y, mid)); }
        ctx.lineTo(x1, mid); ctx.closePath(); ctx.fillStyle = fillC; ctx.fill();
      });
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const [x, y] = pt(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();

      /* 直流平均線 */
      if (Vac > 0) {
        ctx.setLineDash([4, 4]); ctx.strokeStyle = C.electron; ctx.lineWidth = 1.3;
        const yd = mid - Vdc * sy;
        ctx.beginPath(); ctx.moveTo(x0, yd); ctx.lineTo(x1, yd); ctx.stroke(); ctx.setLineDash([]);
        label(ctx, x1, yd - 9, '平均值 = 直流成分', C.electron, 10, 'right');
      }
      label(ctx, x0, y1 + 14, '時間 t →', C['ink-3'], 10, 'left');
    }});

    function verdict() {
      const flips = (Vdc - Vac) * (Vdc + Vac) < 0;   // 波形是否跨越 0
      let name, why;
      if (Vac < 0.05) { name = '直流 DC'; why = '振幅為 0，電壓恆定、極性不隨時間改變。'; }
      else if (Math.abs(Vdc) < 0.05) { name = '交流 AC'; why = '平均值為 0，每個週期極性正負交替一次。'; }
      else if (!flips) { name = '脈動直流 Pulsating DC'; why = '含交流成分但極性始終不變 —— 直流疊加一個漣波（ripple），整流電路的輸出就是這個樣子。'; }
      else { name = '交流（含直流偏壓）'; why = '直流準位小於交流振幅，波形仍會跨過 0，極性依舊反轉。'; }
      setText('sig-type', name);
      setText('sig-why', why);
      setText('sig-vmax', (Vdc + Vac).toFixed(2) + ' V');
      setText('sig-vmin', (Vdc - Vac).toFixed(2) + ' V');
      setText('sig-flip', flips ? '會反轉' : '不反轉');
      const el = document.getElementById('sig-flip');
      el.className = flips ? 'h' : 'e';
    }
    bindRange('sig-dc', v => v.toFixed(1) + ' V', v => { Vdc = v; verdict(); });
    bindRange('sig-ac', v => v.toFixed(1) + ' V', v => { Vac = v; verdict(); });
    bindRange('sig-f', v => v.toFixed(1) + ' Hz', v => { f = v; });
    document.querySelectorAll('[data-sig]').forEach(b => b.addEventListener('click', () => {
      const [a, c] = b.dataset.sig.split(',');
      document.getElementById('sig-dc').value = a; document.getElementById('sig-ac').value = c;
      document.getElementById('sig-dc').dispatchEvent(new Event('input'));
      document.getElementById('sig-ac').dispatchEvent(new Event('input'));
    }));
    verdict();
  })();

  /* ══════════════════════════════════════════════════════════
     ② 原子殼層建構器 —— 2n²、價電子、族數   (投影片 p.4, 11–15)
     ══════════════════════════════════════════════════════════ */
  const ELEMENTS = [null,
    ['H', '氫'], ['He', '氦'], ['Li', '鋰'], ['Be', '鈹'], ['B', '硼'], ['C', '碳'], ['N', '氮'], ['O', '氧'],
    ['F', '氟'], ['Ne', '氖'], ['Na', '鈉'], ['Mg', '鎂'], ['Al', '鋁'], ['Si', '矽'], ['P', '磷'], ['S', '硫'],
    ['Cl', '氯'], ['Ar', '氬'], ['K', '鉀'], ['Ca', '鈣']];
  /* 主族元素在 Z ≤ 20 的實際排布：K=2, L=8, M=8, N=2 */
  const SHELL_CAP = [2, 8, 8, 2];
  const SHELL_NAME = ['K', 'L', 'M', 'N'];
  function configOf(Z) {
    const out = []; let left = Z;
    for (let i = 0; i < SHELL_CAP.length && left > 0; i++) { const n = Math.min(left, SHELL_CAP[i]); out.push(n); left -= n; }
    return out;
  }

  (function atomBuilder() {
    const cv = document.getElementById('cv-atom'); if (!cv) return;
    let Z = 14, spin = 0, target = 14, shown = 14;

    const st = Stage(cv, { ratio: 0.58, minH: 240, maxH: 340, draw(ctx, w, h, dt) {
      spin += dt * 0.28;
      shown += (target - shown) * Math.min(1, dt * 9);
      const cx = w / 2, cy = h / 2;
      const cfg = configOf(Z);
      const rMax = Math.max(30, Math.min(w, h) / 2 - 30);
      const r0 = Math.min(26, rMax * 0.22);

      /* 原子核 */
      disc(ctx, cx, cy, r0, C['hole-w'], C.hole);
      label(ctx, cx, cy - 4, '+' + Z, C.hole, 13, 'center', '700');
      label(ctx, cx, cy + 9, '質子', C.hole, 8.5);

      cfg.forEach((count, i) => {
        const r = r0 + (rMax - r0) * ((i + 1) / cfg.length);
        const isVal = i === cfg.length - 1;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
        ctx.strokeStyle = isVal ? C.electron : C.line;
        ctx.lineWidth = isVal ? 1.6 : 1;
        ctx.setLineDash(isVal ? [] : [3, 3]); ctx.stroke(); ctx.setLineDash([]);
        label(ctx, cx + r + 2, cy - 9, SHELL_NAME[i] + '殼層 ' + count + 'e', isVal ? C.electron : C['ink-3'], 10, 'left');
        for (let k = 0; k < count; k++) {
          const a = spin * (i % 2 ? -1 : 1) / (i + 1) + k / count * TAU - Math.PI / 2;
          electron(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, isVal ? 6.5 : 4.5);
        }
      });
      labelCJK(ctx, 12, 16, '越外層 → 能量越高、束縛越弱', C['ink-3'], 11.5, 'left');
    }});

    function refresh() {
      const cfg = configOf(Z), val = cfg[cfg.length - 1], [sym, name] = ELEMENTS[Z];
      target = Z;
      setText('at-sym', sym + ' ' + name);
      setText('at-cfg', cfg.join(' + ') + ' = ' + Z);
      setText('at-val', val + ' 個');
      setText('at-group', val <= 8 ? val + 'A 族' : '—');
      const need = 8 - val;
      setText('at-octet', val === 8 || Z === 2 ? '已滿足（惰性氣體）'
        : need <= 4 ? '差 ' + need + ' 個 → 傾向「得到」電子'
        : '多 ' + val + ' 個 → 傾向「失去」電子');
      document.querySelectorAll('[data-z]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.z === Z)));
    }
    bindRange('at-z', v => 'Z = ' + v, v => { Z = v | 0; refresh(); });
    document.querySelectorAll('[data-z]').forEach(b => b.addEventListener('click', () => {
      const el = document.getElementById('at-z'); el.value = b.dataset.z; el.dispatchEvent(new Event('input'));
    }));
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 化學鍵實驗台 —— 離子鍵 vs 共價鍵   (投影片 p.16–19)
     ══════════════════════════════════════════════════════════ */
  (function bondLab() {
    const cv = document.getElementById('cv-bond'); if (!cv) return;
    let mode = 'ionic', t = 0, running = false;

    function drawAtom(ctx, cx, cy, r, Z, valCount, ringColor, fillTxt) {
      disc(ctx, cx, cy, r * 0.34, C['surface-2'], C.line);
      label(ctx, cx, cy, fillTxt, C['ink-2'], 12, 'center', '700');
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
      ctx.strokeStyle = ringColor; ctx.lineWidth = 1.4; ctx.stroke();
      return r;
    }

    const st = Stage(cv, { ratio: 0.38, minH: 200, maxH: 250, draw(ctx, w, h, dt) {
      if (running) { t = Math.min(1, t + dt * 0.7); if (t >= 1) running = false; }
      const cy = h / 2 - 6, r = Math.min(52, h * 0.24), gap = Math.min(w * 0.23, 130);
      const ax = w / 2 - gap, bx = w / 2 + gap;

      if (mode === 'ionic') {
        drawAtom(ctx, ax, cy, r, 11, 1, t > 0.9 ? C.hole : C.line, 'Na');
        drawAtom(ctx, bx, cy, r, 17, 7, t > 0.9 ? C.electron : C.line, 'Cl');
        /* Cl 原有 7 個價電子 */
        for (let k = 0; k < 7; k++) { const a = k / 8 * TAU - Math.PI / 2; electron(ctx, bx + Math.cos(a) * r, cy + Math.sin(a) * r, 6); }
        /* Na 的 1 個價電子沿路徑飛向 Cl 的空位 */
        const sx = ax, sy = cy - r, ex = bx + Math.cos(7 / 8 * TAU - Math.PI / 2) * r, ey = cy + Math.sin(7 / 8 * TAU - Math.PI / 2) * r;
        const ease = t * t * (3 - 2 * t);
        const px = lerp(sx, ex, ease), py = lerp(sy, ey, ease) - Math.sin(ease * Math.PI) * 34;
        if (t > 0.02 && t < 0.99) arrow(ctx, sx + 12, sy - 14, px - 10, py - 10, C.electron, 1.2);
        electron(ctx, px, py, 7);
        if (t >= 1) {
          label(ctx, ax, cy + r + 20, 'Na⁺  (2,8) 八隅體', C.hole, 11.5);
          label(ctx, bx, cy + r + 20, 'Cl⁻  (2,8,8) 八隅體', C.electron, 11.5);
          arrow(ctx, ax + r + 6, cy, bx - r - 6, cy, C['ink-3'], 1.2);
          arrow(ctx, bx - r - 6, cy, ax + r + 6, cy, C['ink-3'], 1.2);
          labelCJK(ctx, w / 2, cy - 6, '靜電吸引', C['ink-2'], 11.5);
        } else {
          label(ctx, ax, cy + r + 20, 'Na (1A)：1 個價電子', C['ink-3'], 11.5);
          label(ctx, bx, cy + r + 20, 'Cl (7A)：7 個價電子', C['ink-3'], 11.5);
        }
      } else {
        drawAtom(ctx, ax, cy, r, 14, 4, C.line, 'Si');
        drawAtom(ctx, bx, cy, r, 14, 4, C.line, 'Si');
        /* 各自 3 個不參與此鍵的價電子，朝外側排列 */
        [[ax, [Math.PI * 0.72, Math.PI, Math.PI * 1.28]],
         [bx, [Math.PI * 0.28, 0, -Math.PI * 0.28]]].forEach(([x, angs]) => {
          angs.forEach(a => electron(ctx, x + Math.cos(a) * r, cy + Math.sin(a) * r, 6));
        });
        /* 共享的一對電子在兩核之間來回 */
        const mx = (ax + bx) / 2;
        const osc = running || t >= 1 ? Math.sin(performance.now() / 520) : 0;
        const spread = lerp(gap * 0.82, 16, Math.min(1, t * 1.2));
        electron(ctx, mx - spread + osc * 9, cy - 9, 7);
        electron(ctx, mx + spread - osc * 9, cy + 9, 7);
        if (t >= 1) {
          ctx.strokeStyle = C.electron; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(ax + r, cy - 9); ctx.lineTo(bx - r, cy - 9);
          ctx.moveTo(ax + r, cy + 9); ctx.lineTo(bx - r, cy + 9); ctx.stroke();
          labelCJK(ctx, mx, cy - 32, '共用電子對 = 一條共價鍵', C.electron, 11.5);
          label(ctx, ax, cy + r + 20, '4 自有 + 4 共享 = 8', C.electron, 11.5);
          label(ctx, bx, cy + r + 20, '4 自有 + 4 共享 = 8', C.electron, 11.5);
        } else {
          label(ctx, ax, cy + r + 20, 'Si (4A)：4 個價電子', C['ink-3'], 11.5);
          label(ctx, bx, cy + r + 20, 'Si (4A)：4 個價電子', C['ink-3'], 11.5);
        }
      }
    }});

    function setMode(m) {
      mode = m; t = 0; running = false;
      document.querySelectorAll('[data-bond]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bond === m)));
      setText('bond-go', m === 'ionic' ? '轉移電子 →' : '共享電子 →');
      setText('bond-desc', m === 'ionic'
        ? '一方「失去」、一方「得到」電子，雙方各自湊滿八隅體後變成帶電的離子，靠靜電吸引結合。離子不具傳導性。'
        : '兩個原子各拿出價電子「共用」，同一對電子同時算進兩邊的最外層。矽晶體就是每個 Si 與 4 個鄰居各形成一條共價鍵。');
    }
    document.querySelectorAll('[data-bond]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.bond)));
    document.getElementById('bond-go').addEventListener('click', function () {
      if (t >= 1) { t = 0; running = false; return; }
      running = true;
    });
    setMode('ionic');
  })();
})();

/* ============================================================
   CH1 PART 1 互動模組（續）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, K_EV, TAU, MONO, BODY, pointerPos } = E;

  /* 本質載子濃度 ni = B·T^(3/2)·exp(−Eg / 2kT)   (Neamen 表 1.3) */
  const MAT = {
    Si:   { name: '矽 Si',      B: 5.23e15, Eg: 1.12 },
    Ge:   { name: '鍺 Ge',      B: 1.66e15, Eg: 0.66 },
    GaAs: { name: '砷化鎵 GaAs', B: 2.10e14, Eg: 1.42 }
  };
  const niOf = (m, T) => m.B * Math.pow(T, 1.5) * Math.exp(-m.Eg / (2 * K_EV * T));

  /* ══════════════════════════════════════════════════════════
     ④ 矽晶格熱擾動 —— 共價鍵斷裂產生電子－電洞對  (p.20, 22)
     ══════════════════════════════════════════════════════════ */
  (function latticeLab() {
    const cv = document.getElementById('cv-lat'); if (!cv) return;
    const COLS = 5, ROWS = 4;
    let T = 300, pairs = [], acc = 0;

    /* 以 log(ni) 做線性壓縮，確保動畫看得見；真實數量級另外用數字呈現 */
    function visRate(T) {
      const lo = Math.log10(niOf(MAT.Si, 150)), hi = Math.log10(niOf(MAT.Si, 650));
      return clamp((Math.log10(niOf(MAT.Si, T)) - lo) / (hi - lo), 0, 1);
    }
    function bonds(w, h) {
      const padX = w * 0.1, padY = 26;
      const dx = (w - padX * 2) / (COLS - 1), dy = (h - padY * 2) / (ROWS - 1);
      return { padX, padY, dx, dy, at: (c, r) => [padX + c * dx, padY + r * dy] };
    }
    function spawn() {
      const c = Math.floor(Math.random() * (COLS - 1)), r = Math.floor(Math.random() * ROWS);
      if (pairs.some(p => p.c === c && p.r === r)) return;
      pairs.push({ c, r, life: 0, max: 3 + Math.random() * 5, ex: 0, ey: 0, vx: (Math.random() - .5) * 90, vy: (Math.random() - .5) * 70, started: false });
    }

    const st = Stage(cv, { ratio: 0.58, minH: 240, maxH: 360, draw(ctx, w, h, dt) {
      const g = bonds(w, h);
      const rate = visRate(T);
      acc += dt * rate * 3.2;
      while (acc >= 1) { acc -= 1; if (pairs.length < 9) spawn(); }

      /* 共價鍵（每個 Si 與左右／上下鄰居） */
      ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const [x, y] = g.at(c, r);
        if (c < COLS - 1) {
          const broken = pairs.some(p => p.c === c && p.r === r);
          const [x2] = g.at(c + 1, r);
          ctx.strokeStyle = broken ? C['line-soft'] : C['ink-3'];
          ctx.setLineDash(broken ? [3, 4] : []);
          [-3.5, 3.5].forEach(o => { ctx.beginPath(); ctx.moveTo(x + 15, y + o); ctx.lineTo(x2 - 15, y + o); ctx.stroke(); });
          ctx.setLineDash([]);
        }
        if (r < ROWS - 1) {
          const [, y2] = g.at(c, r + 1);
          ctx.strokeStyle = C['ink-3']; 
          [-3.5, 3.5].forEach(o => { ctx.beginPath(); ctx.moveTo(x + o, y + 15); ctx.lineTo(x + o, y2 - 15); ctx.stroke(); });
        }
      }
      /* 矽原子核 */
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const [x, y] = g.at(c, r);
        disc(ctx, x, y, 14, C['surface-2'], C.line);
        label(ctx, x, y, 'Si', C['ink-2'], 11, 'center', '600');
      }
      /* 斷鍵處：留下電洞，自由電子四處游走 */
      pairs.forEach(p => {
        const [x1, y1] = g.at(p.c, p.r), [x2] = g.at(p.c + 1, p.r);
        const mx = (x1 + x2) / 2;
        if (!p.started) { p.started = true; p.ex = mx; p.ey = y1; }
        p.life += dt;
        p.ex += p.vx * dt; p.ey += p.vy * dt;
        if (p.ex < 14 || p.ex > w - 14) p.vx *= -1;
        if (p.ey < 14 || p.ey > h - 14) p.vy *= -1;
        p.ex = clamp(p.ex, 14, w - 14); p.ey = clamp(p.ey, 14, h - 14);
        hole(ctx, mx, y1, 7);
        electron(ctx, p.ex, p.ey, 7);
      });
      pairs = pairs.filter(p => p.life < p.max);

      if (rate <= 0.001) labelCJK(ctx, w / 2, h - 10, 'T ≈ 0 K：所有共價鍵完整，沒有自由載子 → 形同絕緣體', C['ink-3'], 12);
      else labelCJK(ctx, w / 2, h - 10, '熱能打斷共價鍵 → 同時產生 1 個自由電子 + 1 個電洞', C['ink-3'], 12);
    }});

    function refresh() {
      const ni = niOf(MAT.Si, T);
      setText('lat-t', T + ' K');
      setText('lat-c', (T - 273.15).toFixed(0) + ' °C');
      setText('lat-ni', sci(ni) + ' cm' + sup(-3));
      setText('lat-n', sci(ni) + ' cm' + sup(-3));
      setText('lat-p', sci(ni) + ' cm' + sup(-3));
    }
    for (let i = 0; i < 3; i++) spawn();
    bindRange('lat-temp', v => v + ' K', v => { T = v | 0; refresh(); });
    document.getElementById('lat-clear').addEventListener('click', () => { pairs = []; });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ 能帶圖 —— Ec / Ev / 禁止能隙 Eg   (投影片 p.20–21)
     ══════════════════════════════════════════════════════════ */
  (function bandLab() {
    const cv = document.getElementById('cv-band'); if (!cv) return;
    let Eg = 1.12, T = 300, jumpers = [], acc = 0, kind = 'semi';

    const PRESET = { metal: 0, semi: 1.12, insul: 5.0 };

    /* 依教科書畫法：能帶厚度固定，Eg 越大中間的禁止能隙就撐得越開 */
    const st = Stage(cv, { ratio: 0.33, minH: 225, maxH: 300, draw(ctx, w, h, dt) {
      const padL = 88, padR = 20, padT = 20, padB = 32;
      const x0 = padL, x1 = w - padR;
      const bandH = 44, top0 = padT, innerBot = h - padB;
      const maxGap = innerBot - top0 - bandH * 2;
      const gapH = clamp(Eg / 6.2 * maxGap, 0, maxGap);
      const innerTop = top0 + (innerBot - top0 - bandH * 2 - gapH) / 2;   /* 整組垂直置中 */
      const yEc = innerTop + bandH;      /* 導帶底緣 */
      const yEv = yEc + gapH;            /* 價帶頂緣 */
      const yVb = yEv + bandH;

      /* 導帶 */
      ctx.fillStyle = C['surface-2']; ctx.fillRect(x0, innerTop, x1 - x0, bandH);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x0, yEc); ctx.lineTo(x1, yEc); ctx.stroke();
      labelCJK(ctx, x0 - 34, innerTop + bandH / 2, '導帶', C.ink, 12.5, 'right', '600');
      label(ctx, x0 - 8, yEc, 'Ec', C.ink, 12, 'right', '700');

      /* 價帶（電子填滿） */
      ctx.fillStyle = C['electron-w']; ctx.fillRect(x0, yEv, x1 - x0, bandH);
      ctx.strokeStyle = C.electron; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(x0, yEv); ctx.lineTo(x1, yEv); ctx.stroke();
      labelCJK(ctx, x0 - 34, yEv + bandH / 2, '價帶', C.electron, 12.5, 'right', '600');
      label(ctx, x0 - 8, yEv, 'Ev', C.electron, 12, 'right', '700');

      /* 禁止能隙：斜線區 */
      const NE = 9, ey = yEv + bandH * 0.52, cy2 = innerTop + bandH * 0.46;
      const exAt = i => lerp(x0 + 34, x1 - 26, i / (NE - 1));
      if (gapH > 1) {
        ctx.save(); ctx.beginPath(); ctx.rect(x0, yEc, x1 - x0, gapH); ctx.clip();
        ctx.strokeStyle = C.line; ctx.lineWidth = 1;
        for (let x = x0 - gapH; x < x1; x += 9) { ctx.beginPath(); ctx.moveTo(x, yEv); ctx.lineTo(x + gapH, yEc); ctx.stroke(); }
        ctx.restore();
        const gx = x0 + 16;
        if (gapH >= 18) { arrow(ctx, gx, yEv - 2, gx, yEc + 2, C['ink-2'], 1.3); arrow(ctx, gx, yEc + 2, gx, yEv - 2, C['ink-2'], 1.3); }
        /* 能隙夠寬就標在裡面；太窄就移到能帶下方，避免壓到躍遷中的電子 */
        if (gapH >= 46) {
          const ly = (yEc + yEv) / 2 - 8;
          ctx.fillStyle = C.surface; ctx.globalAlpha = 0.82; ctx.fillRect(gx + 6, ly - 10, 178, 32); ctx.globalAlpha = 1;
          label(ctx, gx + 10, ly, 'Eg = ' + Eg.toFixed(2) + ' eV', C.ink, 12.5, 'left', '700');
          labelCJK(ctx, gx + 10, ly + 15, '禁止能隙：電子不得存在', C['ink-3'], 11, 'left');
        } else {
          const ly = yVb + 22;
          label(ctx, gx, ly, 'Eg = ' + Eg.toFixed(2) + ' eV', C.ink, 12.5, 'left', '700');
          labelCJK(ctx, gx + 108, ly, '← 禁止能隙：電子不得存在', C['ink-3'], 11, 'left');
        }
      } else {
        labelCJK(ctx, (x0 + x1) / 2, yEc - 12, '導帶與價帶重疊，Eg ≈ 0 → 自由電子極多', C.ok, 12);
      }

      /* 價帶中待命的電子；跳走的留下電洞 */
      const gone = new Set(jumpers.filter(j => j.t < 2.2).map(j => j.idx));
      for (let i = 0; i < NE; i++) {
        if (gone.has(i)) hole(ctx, exAt(i), ey, 6.5);
        else electron(ctx, exAt(i), ey, 6.5);
      }

      /* 熱激發：以相對機率 exp(−Eg/2kT) 決定躍遷頻率（Si@300K 定為 1） */
      const ref = Math.exp(-1.12 / (2 * K_EV * 300));
      const rel = Math.exp(-Eg / (2 * K_EV * T)) / ref;
      const perSec = clamp(0.9 * Math.pow(rel, 0.35), 0, 7);
      acc += dt * perSec;
      while (acc >= 1) {
        acc -= 1;
        const free = [];
        for (let i = 0; i < NE; i++) if (!gone.has(i)) free.push(i);
        if (free.length) jumpers.push({ idx: free[Math.floor(Math.random() * free.length)], t: 0 });
      }
      jumpers.forEach(j => {
        j.t += dt * 0.6;
        const x = exAt(j.idx), pr = clamp(j.t, 0, 1), ease = pr * pr * (3 - 2 * pr);
        const y = lerp(ey, cy2, ease);
        if (pr < 1) { ctx.setLineDash([2, 3]); arrow(ctx, x, ey - 8, x, y + 8, C.electron, 1.1); ctx.setLineDash([]); }
        electron(ctx, x, y, 6.5);
      });
      jumpers = jumpers.filter(j => j.t < 2.2);

      labelCJK(ctx, x0, innerBot + 16, '一次躍遷 = 產生一個電子－電洞對', C['ink-3'], 11, 'left');
      label(ctx, x1, innerBot + 16, '能量 ↑', C['ink-3'], 10, 'right');
    }});

    function refresh() {
      setText('band-eg', Eg.toFixed(2) + ' eV');
      setText('band-t', T + ' K');
      const rel = Math.exp(-Eg / (2 * K_EV * T)) / Math.exp(-1.12 / (2 * K_EV * 300));
      setText('band-prob', Math.abs(rel - 1) < 0.02 ? '基準 (Si @ 300K)' : rel >= 1 ? '×' + sci(rel, 1) : '÷' + sci(1 / rel, 1));
      setText('band-kind', Eg < 0.05 ? '導體' : Eg <= 2.5 ? '半導體' : '絕緣體');
      setText('band-note', Eg < 0.05
        ? '能隙為零、兩帶重疊，價電子不必吸收能量就能導電 —— 這是導體。'
        : Eg <= 2.5
        ? '常溫下少量價電子能跨過 Eg，導電度介於導體與絕緣體之間，而且強烈隨溫度變化。'
        : '能隙太大（一般 3～6 eV），常溫熱能幾乎打不斷共價鍵 —— 這是絕緣體。');
      document.querySelectorAll('[data-band]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.band === kind)));
    }
    bindRange('band-egr', v => v.toFixed(2) + ' eV', v => {
      Eg = v; kind = Eg < 0.05 ? 'metal' : Eg <= 2.5 ? 'semi' : 'insul'; refresh();
    });
    bindRange('band-tr', v => v + ' K', v => { T = v | 0; refresh(); });
    document.querySelectorAll('[data-band]').forEach(b => b.addEventListener('click', () => {
      kind = b.dataset.band;
      const el = document.getElementById('band-egr');
      el.value = PRESET[kind]; el.dispatchEvent(new Event('input'));
    }));
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑥ 電洞移動小遊戲 —— 電洞其實是「電子接力」  (投影片 p.24)
     ══════════════════════════════════════════════════════════ */
  (function holeGame() {
    const cv = document.getElementById('cv-hole'); if (!cv) return;
    const N = 7;
    let holeAt = 3, field = 1, score = 0, streak = 0, best = 0, tries = 0;
    let anim = null, hits = [];

    function sites(w, h) {
      const padX = Math.min(w * 0.1, 56), dx = (w - padX * 2) / (N - 1);
      return { padX, dx, y: h * 0.52, x: i => padX + i * dx };
    }
    function correctIdx() { return field > 0 ? holeAt + 1 : holeAt - 1; }

    const st = Stage(cv, { ratio: 0.36, minH: 195, maxH: 240, draw(ctx, w, h, dt) {
      const g = sites(w, h), y = g.y;

      /* 電場方向 */
      const fy = 26;
      ctx.fillStyle = C['surface-2']; ctx.fillRect(0, 0, w, 46);
      const fx0 = w / 2 - 58, fx1 = w / 2 + 58;
      arrow(ctx, field > 0 ? fx0 : fx1, fy, field > 0 ? fx1 : fx0, fy, C.warn, 2.2);
      label(ctx, (field > 0 ? fx0 : fx1) - (field > 0 ? 10 : -10), fy, 'E', C.warn, 14, field > 0 ? 'right' : 'left', '700');
      labelCJK(ctx, w / 2, 46 + 13, '外加電場方向', C['ink-3'], 11);

      /* 鍵結鏈 */
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 2;
      for (let i = 0; i < N - 1; i++) {
        const broken = (i === holeAt);
        ctx.setLineDash(broken ? [3, 4] : []);
        ctx.strokeStyle = broken ? C['line'] : C['ink-3'];
        [-3.5, 3.5].forEach(o => { ctx.beginPath(); ctx.moveTo(g.x(i) + 15, y + o); ctx.lineTo(g.x(i + 1) - 15, y + o); ctx.stroke(); });
      }
      ctx.setLineDash([]);
      for (let i = 0; i < N; i++) {
        disc(ctx, g.x(i), y, 14, C['surface-2'], C.line);
        label(ctx, g.x(i), y, 'Si', C['ink-2'], 11, 'center', '600');
      }
      /* 電洞 */
      const hx = (g.x(holeAt) + g.x(holeAt + 1)) / 2;
      hole(ctx, hx, y, 9);
      labelCJK(ctx, hx, y - 26, '電洞', C.hole, 11.5);

      /* 可點選的鄰近價電子 */
      hits = [];
      [holeAt - 1, holeAt + 1].forEach(i => {
        if (i < 0 || i >= N - 1) return;
        const ex = (g.x(i) + g.x(i + 1)) / 2;
        if (anim && anim.from === i) return;
        ctx.beginPath(); ctx.arc(ex, y, 14, 0, TAU);
        ctx.strokeStyle = C.electron; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.stroke(); ctx.setLineDash([]);
        electron(ctx, ex, y, 8);
        hits.push({ i, x: ex, y: y });
      });

      /* 跳躍動畫 */
      if (anim) {
        anim.t += dt * 2.1;
        const p = clamp(anim.t, 0, 1), ease = p * p * (3 - 2 * p);
        electron(ctx, lerp(anim.x0, anim.x1, ease), y - Math.sin(ease * Math.PI) * 22, 8);
        if (p >= 1) { holeAt = anim.newHole; anim = null; }
      }
      labelCJK(ctx, w / 2, h - 12, '提示：電子帶負電，受力方向與 E 相反', C['ink-3'], 11.5);
    }});

    function msg(txt, ok) {
      const el = document.getElementById('hole-msg');
      el.textContent = txt; el.className = 'msg ' + (ok === undefined ? '' : ok ? 'good' : 'bad');
    }
    function refresh() {
      setText('hole-score', score + ' / ' + tries);
      setText('hole-streak', streak + ' 連對');
      setText('hole-best', best + ' 連');
      setText('hole-dir', field > 0 ? '向右 →' : '← 向左');
      setText('hole-cur', field > 0 ? '向右 →' : '← 向左');
      setText('hole-edir', field > 0 ? '← 向左' : '向右 →');
    }
    cv.addEventListener('click', ev => {
      if (anim) return;
      const p = pointerPos(cv, ev);
      const hit = hits.find(s => Math.hypot(s.x - p.x, s.y - p.y) < 22);
      if (!hit) return;
      tries++;
      const want = correctIdx();
      if (hit.i === want) {
        score++; streak++; best = Math.max(best, streak);
        const g = sites(st.w, st.h);
        anim = { from: hit.i, t: 0, x0: (g.x(hit.i) + g.x(hit.i + 1)) / 2, x1: (g.x(holeAt) + g.x(holeAt + 1)) / 2, newHole: hit.i };
        msg('✓ 正確。電子往 ' + (field > 0 ? '左' : '右') + '（與 E 相反）遞補進空鍵，空鍵因此往 '
          + (field > 0 ? '右' : '左') + '移 —— 這就是「電洞順著 E 移動」的真相。', true);
      } else {
        streak = 0;
        msg('✗ 這顆電子的移動方向與電場同向了。電子帶負電，受力 F = −qE，必須往 E 的反方向走。', false);
      }
      /* 到邊界就重置 */
      if (holeAt <= 0 || holeAt >= N - 2) { /* 交給動畫結束後判斷 */ }
      refresh();
    });
    document.getElementById('hole-flip').addEventListener('click', () => { field *= -1; msg('電場反向了 —— 想想電子該往哪邊走？'); refresh(); });
    document.getElementById('hole-reset').addEventListener('click', () => {
      holeAt = 3; score = 0; streak = 0; tries = 0; anim = null; msg(''); refresh();
    });
    setInterval(() => { if (!anim && (holeAt <= 0 || holeAt >= N - 2)) holeAt = 3; }, 900);
    refresh();
  })();
})();

/* ============================================================
   CH1 PART 1 互動模組（續二）：定量分析與小測驗
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, K_EV, TAU, MONO, BODY, pointerPos } = E;

  const MAT = {
    Si:   { name: '矽 Si',       B: 5.23e15, Eg: 1.12 },
    Ge:   { name: '鍺 Ge',       B: 1.66e15, Eg: 0.66 },
    GaAs: { name: '砷化鎵 GaAs', B: 2.10e14, Eg: 1.42 }
  };
  const niOf = (m, T) => m.B * Math.pow(T, 1.5) * Math.exp(-m.Eg / (2 * K_EV * T));

  /* ══════════════════════════════════════════════════════════
     ⑦ 本質載子濃度 ni(T) 計算器   (投影片 p.25–26)
     ══════════════════════════════════════════════════════════ */
  (function niLab() {
    const cv = document.getElementById('cv-ni'); if (!cv) return;
    let T = 300, key = 'Si';

    const st = Stage(cv, { animate: false, ratio: 0.52, minH: 250, maxH: 340, draw(ctx, w, h) {
      const padL = 62, padR = 18, padT = 20, padB = 34;
      const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
      const T0 = 200, T1 = 650;
      const yLo = -2, yHi = 18;                       /* log10(ni) 範圍 */
      const X = t => lerp(x0, x1, (t - T0) / (T1 - T0));
      const Y = l => lerp(y1, y0, (clamp(l, yLo, yHi) - yLo) / (yHi - yLo));

      /* 格線 + 刻度（每個標籤都對應曲線實際涵蓋的值） */
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      for (let l = yLo; l <= yHi; l += 4) {
        ctx.beginPath(); ctx.moveTo(x0, Y(l)); ctx.lineTo(x1, Y(l)); ctx.stroke();
        label(ctx, x0 - 7, Y(l), '10' + sup(l), C['ink-3'], 10.5, 'right');
      }
      for (let t = 200; t <= 650; t += 150) {
        ctx.strokeStyle = C['line-soft'];
        ctx.beginPath(); ctx.moveTo(X(t), y0); ctx.lineTo(X(t), y1); ctx.stroke();
        label(ctx, X(t), y1 + 13, t + 'K', C['ink-3'], 10.5);
      }
      ctx.strokeStyle = C.line; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      label(ctx, x0 - 46, y0 - 11, 'ni (cm' + sup(-3) + ')', C['ink-3'], 10.5, 'left');

      /* 三種材料的曲線：能隙越大，曲線越低 */
      const COLORS = { Si: C.electron, Ge: C.ok, GaAs: C.hole };
      Object.keys(MAT).forEach(k => {
        ctx.beginPath();
        for (let t = T0; t <= T1; t += 4) {
          const yy = Y(Math.log10(niOf(MAT[k], t)));
          t === T0 ? ctx.moveTo(X(t), yy) : ctx.lineTo(X(t), yy);
        }
        ctx.strokeStyle = COLORS[k]; ctx.lineWidth = k === key ? 2.4 : 1.1;
        ctx.globalAlpha = k === key ? 1 : 0.45; ctx.stroke(); ctx.globalAlpha = 1;
        const ly = clamp(Y(Math.log10(niOf(MAT[k], T1))), y0 + 8, y1 - 8);
        label(ctx, x1 - 4, ly - 11, k, COLORS[k], 11, 'right', '700');
      });

      /* 目前操作點 */
      const cyv = Y(Math.log10(niOf(MAT[key], T)));
      ctx.setLineDash([3, 3]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(T), y1); ctx.lineTo(X(T), cyv); ctx.lineTo(x0, cyv); ctx.stroke();
      ctx.setLineDash([]);
      disc(ctx, X(T), cyv, 5.5, COLORS[key], C.surface);

      /* 室溫參考線 */
      ctx.strokeStyle = C.warn; ctx.setLineDash([2, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(300), y0); ctx.lineTo(X(300), y1); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, X(300) + 5, y0 + 7, '300K 室溫', C.warn, 10, 'left');
    }});

    function refresh() {
      const m = MAT[key], ni = niOf(m, T);
      setText('ni-mat', m.name);
      setText('ni-eg', m.Eg.toFixed(2) + ' eV');
      setText('ni-B', sci(m.B, 2) + ' cm' + sup(-3) + '·K' + sup(-3) + '/²');
      setText('ni-T', T + ' K');
      setText('ni-Tc', (T - 273.15).toFixed(1) + ' °C');
      setText('ni-val', sci(ni, 2) + ' cm' + sup(-3));
      const si300 = niOf(MAT.Si, 300);
      const rr = ni / si300;
      setText('ni-cmp', Math.abs(rr - 1) < 0.02 ? '基準 (Si @ 300K)' : rr >= 1 ? '×' + sci(rr, 1) : '÷' + sci(1 / rr, 1));
      st.redraw();
    }
    bindRange('ni-temp', v => v + ' K', v => { T = v | 0; refresh(); });
    document.querySelectorAll('[data-mat]').forEach(b => b.addEventListener('click', () => {
      key = b.dataset.mat;
      document.querySelectorAll('[data-mat]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.mat === key)));
      refresh();
    }));
    document.querySelector('[data-mat="Si"]').setAttribute('aria-pressed', 'true');
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑧ N 型摻雜實驗室 —— 施體雜質與多數載子   (投影片 p.27–30)
     ══════════════════════════════════════════════════════════ */
  (function dopeLab() {
    const cv = document.getElementById('cv-dope'); if (!cv) return;
    const COLS = 5, ROWS = 4;
    let doped = new Set(), freeE = [], hits = [];

    function grid(w, h) {
      const padX = w * 0.11, padY = 30;
      const dx = (w - padX * 2) / (COLS - 1), dy = (h - padY * 2) / (ROWS - 1);
      return { at: (c, r) => [padX + c * dx, padY + r * dy] };
    }

    const st = Stage(cv, { ratio: 0.58, minH: 240, maxH: 360, draw(ctx, w, h, dt) {
      const g = grid(w, h);
      ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.strokeStyle = C['ink-3'];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const [x, y] = g.at(c, r);
        if (c < COLS - 1) { const [x2] = g.at(c + 1, r); [-3.5, 3.5].forEach(o => { ctx.beginPath(); ctx.moveTo(x + 16, y + o); ctx.lineTo(x2 - 16, y + o); ctx.stroke(); }); }
        if (r < ROWS - 1) { const [, y2] = g.at(c, r + 1); [-3.5, 3.5].forEach(o => { ctx.beginPath(); ctx.moveTo(x + o, y + 16); ctx.lineTo(x + o, y2 - 16); ctx.stroke(); }); }
      }
      hits = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const [x, y] = g.at(c, r), id = c + ',' + r, isP = doped.has(id);
        disc(ctx, x, y, 15, isP ? C['ion-pos-w'] : C['surface-2'], isP ? C['ion-pos'] : C.line);
        label(ctx, x, y - (isP ? 3 : 0), isP ? 'P' : 'Si', isP ? C['ion-pos'] : C['ink-2'], isP ? 12 : 11, 'center', '700');
        if (isP) label(ctx, x, y + 7, '+', C['ion-pos'], 11, 'center', '700');
        hits.push({ x, y, id });
      }
      /* 每摻一顆 P → 多一顆可自由移動的電子 */
      while (freeE.length < doped.size) freeE.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * 110, vy: (Math.random() - .5) * 90 });
      while (freeE.length > doped.size) freeE.pop();
      freeE.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 12 || p.x > w - 12) p.vx *= -1;
        if (p.y < 12 || p.y > h - 12) p.vy *= -1;
        p.x = clamp(p.x, 12, w - 12); p.y = clamp(p.y, 12, h - 12);
        electron(ctx, p.x, p.y, 7);
      });
      labelCJK(ctx, w / 2, h - 12, doped.size
        ? '每個磷原子 → 1 個不動的正離子 P⁺ + 1 個可自由移動的電子'
        : '點任一顆 Si，把它換成 5 價的磷（P）', C['ink-3'], 12);
    }});

    cv.addEventListener('click', ev => {
      const p = pointerPos(cv, ev);
      const hit = hits.find(s => Math.hypot(s.x - p.x, s.y - p.y) < 20);
      if (!hit) return;
      doped.has(hit.id) ? doped.delete(hit.id) : doped.add(hit.id);
      setText('dope-cnt', doped.size + ' / ' + (COLS * ROWS));
      setText('dope-free', doped.size + ' 個');
    });
    document.getElementById('dope-clear').addEventListener('click', () => {
      doped.clear(); setText('dope-cnt', '0 / ' + (COLS * ROWS)); setText('dope-free', '0 個');
    });
    setText('dope-cnt', '0 / ' + (COLS * ROWS));
    setText('dope-free', '0 個');
  })();

  /* ══════════════════════════════════════════════════════════
     ⑨ 載子濃度定量：n·p = ni²（質量作用定律）
     ══════════════════════════════════════════════════════════ */
  (function massAction() {
    const bar = document.getElementById('ma-bar'); if (!bar) return;
    let logNd = 16, T = 300;
    function refresh() {
      const ni = niOf(MAT.Si, T), Nd = Math.pow(10, logNd);
      const n = Nd / 2 + Math.sqrt(Nd * Nd / 4 + ni * ni);
      const p = ni * ni / n;
      setText('ma-nd', sci(Nd, 2) + ' cm' + sup(-3));
      setText('ma-ni', sci(ni, 2) + ' cm' + sup(-3));
      setText('ma-n', sci(n, 2) + ' cm' + sup(-3));
      setText('ma-p', sci(p, 2) + ' cm' + sup(-3));
      setText('ma-np', sci(n * p, 2) + ' = ni²');
      const ratio = n / ni;
      setText('ma-ratio', ratio >= 1.05 ? '電子濃度是本質值的 ' + sci(ratio, 1) + ' 倍' : '仍由熱擾動主導');
      setText('ma-concl', Nd > ni * 100
        ? 'Nd ≫ ni，所以 n ≈ Nd —— 這就是「電子濃度幾乎等於摻雜濃度」的量化理由。少數載子 p 被壓到極低。'
        : 'Nd 還不夠大，熱擾動產生的電子－電洞對仍佔可觀比例，n 明顯大於 Nd。');
      /* 多數/少數載子比例條 */
      const frac = Math.log10(n) / (Math.log10(n) + Math.log10(Math.max(p, 1)));
      bar.querySelector('i').style.width = clamp(frac * 100, 4, 99) + '%';
    }
    bindRange('ma-ndr', v => '10' + sup(v) + ' cm' + sup(-3), v => { logNd = v; refresh(); });
    bindRange('ma-tr', v => v + ' K', v => { T = v | 0; refresh(); });
    refresh();
  })();

  /* ══════════════════════════════════════════════════════════
     ⑩ 觀念小測驗
     ══════════════════════════════════════════════════════════ */
  (function quiz() {
    const host = document.getElementById('quiz'); if (!host) return;
    const Q = [
      { q: '一個電壓波形在 +2V 到 +8V 之間擺動，它屬於哪一類？',
        o: ['交流（AC）', '脈動直流（Pulsating DC）', '純直流（DC）', '無法判斷'], a: 1,
        e: '判斷關鍵是「極性有沒有反轉」。波形始終為正，極性不變，所以是直流疊加交流成分的脈動直流；整流器輸出就是這個樣子。' },
      { q: '矽（Si，原子序 14）的電子組態與價電子數為何？',
        o: ['2, 8, 4 → 價電子 4 個', '2, 8, 8 → 價電子 8 個', '2, 4, 8 → 價電子 8 個', '8, 4, 2 → 價電子 2 個'], a: 0,
        e: '14 = 2 + 8 + 4。最外層 4 個電子即價電子，因此矽屬 4A 族。族數（A 族）正好等於價電子數。' },
      { q: '關於離子鍵與共價鍵，下列何者正確？',
        o: ['離子鍵靠共用電子對結合', '共價鍵中電子完全轉移給其中一方', '離子鍵是得失電子、共價鍵是共用電子', '兩者都不必滿足八隅體'], a: 2,
        e: 'Na 失去 1 個電子成 Na⁺、Cl 得到 1 個成 Cl⁻，靠靜電吸引 → 離子鍵。Si 與 Si 各出電子共用同一對 → 共價鍵。兩者都是為了湊滿八隅體。' },
      { q: '本質半導體吸收熱能打斷一條共價鍵時，會產生什麼？',
        o: ['只產生 1 個自由電子', '只產生 1 個電洞', '同時產生 1 個電子與 1 個電洞', '產生 1 個正離子'], a: 2,
        e: '斷鍵的電子跳到導帶成為自由電子，原處留下空缺就是電洞 —— 成對出現，所以本質半導體中 n = p = ni。' },
      { q: '禁止能隙 Eg 的定義是？',
        o: ['Ec − Ev', 'Ev − Ec', 'Ec + Ev', '導帶寬度'], a: 0,
        e: 'Ec 是導帶最低能量、Ev 是價帶最高能量，Eg = Ec − Ev。這段區間內電子不得存在，故稱「禁止」能隙。' },
      { q: '能隙大小由大到小，正確排序是？',
        o: ['導體 > 半導體 > 絕緣體', '絕緣體 > 半導體 > 導體', '半導體 > 絕緣體 > 導體', '三者相同'], a: 1,
        e: '絕緣體 Eg 約 3～6 eV，半導體約 1 eV（Si 為 1.12 eV），導體的導帶與價帶重疊、Eg ≈ 0。' },
      { q: '在 ni = B·T^(3/2)·exp(−Eg/2kT) 中，若只把溫度 T 提高，ni 會如何變化？',
        o: ['急遽上升', '線性下降', '幾乎不變', '先升後降'], a: 0,
        e: '指數項 exp(−Eg/2kT) 隨 T 上升而快速變大，主導整個式子。矽從 300K 升到 600K，ni 可以跳好幾個數量級。' },
      { q: '關於電洞的移動，下列敘述何者正確？',
        o: ['電洞是一種會移動的實體粒子', '實際移動的是價電子，電洞只是「看起來」在移動', '電洞移動方向與電流方向相反', '電洞不影響電流大小'], a: 1,
        e: '鄰近鍵的價電子遞補進空缺，空缺位置就跟著換地方 —— 看起來像電洞在動。電洞帶正電，其移動方向即為電流方向。' },
      { q: '在矽中摻入 5 價的磷（P）之後，會發生什麼？',
        o: ['產生 1 個可移動的電洞', '產生 1 個不動的正離子 P⁺ 與 1 個自由電子', '產生 1 個負離子與 1 個電洞', '導電度下降'], a: 1,
        e: '磷的第 5 個價電子不參與共價鍵，容易游離到導帶成為自由電子；磷失去電子後成為固定在晶格上的正離子，不具傳導性。這稱為施體（donor）摻雜，形成 n 型半導體。' },
      { q: '室溫下 n 型矽的摻雜濃度 Nd = 10¹⁶ cm⁻³，ni ≈ 10¹⁰ cm⁻³，則電子濃度 n 約為？',
        o: ['約 10¹⁰ cm⁻³', '約 10¹⁶ cm⁻³', '約 10⁴ cm⁻³', '約 10²⁶ cm⁻³'], a: 1,
        e: '因為 Nd ≫ ni，所以 n ≈ Nd = 10¹⁶ cm⁻³。少數載子 p = ni²/n ≈ 10²⁰/10¹⁶ = 10⁴ cm⁻³，比電子少 12 個數量級。' }
    ];
    let i = 0, score = 0, answered = false;

    function render() {
      const q = Q[i];
      host.innerHTML =
        '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div>' +
        '<div class="quiz-body">' +
          '<div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
          '<div class="q-text">' + q.q + '</div>' +
          '<div class="opts"></div>' +
          '<div class="explain" hidden></div>' +
        '</div>' +
        '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span>' +
          '<button class="btn" id="q-next" hidden>下一題 →</button></div>';
      const opts = host.querySelector('.opts');
      q.o.forEach((text, k) => {
        const b = document.createElement('button');
        b.className = 'opt'; b.type = 'button';
        b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + text + '</span>';
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
      ex.hidden = false; ex.innerHTML = '<b>' + (k === q.a ? '答對了。' : '正確答案是 ' + 'ABCD'[q.a] + '。') + '</b> ' + q.e;
      host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
      const nx = host.querySelector('#q-next');
      nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →';
      nx.classList.add('solid');
    }
    function done() {
      const pct = Math.round(score / Q.length * 100);
      const verdict = pct >= 90 ? '這一段觀念已經很穩了，可以進 PART 2。'
        : pct >= 70 ? '主幹抓到了，把答錯的那幾題回去把對應的互動模組再玩一次。'
        : '建議從「能帶」與「電洞移動」兩個模組重新走一遍，那是後面 pn 接面的基礎。';
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

  /* ══════════════════════════════════════════════════════════
     側欄章節導覽：捲動時高亮目前所在小節
     ══════════════════════════════════════════════════════════ */
  (function scrollSpy() {
    const links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
    if (!links.length) return;
    const map = new Map();
    links.forEach(a => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a); });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.remove('on')); map.get(en.target).classList.add('on'); } });
    }, { rootMargin: '-84px 0px -62% 0px', threshold: 0 });
    map.forEach((a, s) => io.observe(s));
  })();

  /* 明暗主題切換 */
  (function themeToggle() {
    const btn = document.getElementById('theme-btn'); if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      try { localStorage.setItem('ee-theme', isDark ? 'light' : 'dark'); } catch (e) {}
    });
    try { const t = localStorage.getItem('ee-theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch (e) {}
  })();
})();

/* ============================================================
   CH1 PART 1 可互動例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, arrow, disc, clamp, lerp, sci, sup, K_EV, liveExample } = E;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '\u2212');
  const MAT = { Si: { B: 5.23e15, Eg: 1.12 }, Ge: { B: 1.66e15, Eg: 0.66 }, GaAs: { B: 2.10e14, Eg: 1.42 } };

  /* ── 例題：ni 的兩項各貢獻多少 ─────────────────────────── */
  liveExample('#ex-ni', {
    title: '例題 · 拆開來看：T^(3/2) 和 e^(−Eg/2kT) 誰主導',
    ratio: 0.3, minH: 138, maxH: 152,
    givens: [
      { id: 'exni-T', label: '溫度 T', min: 200, max: 650, step: 5, value: 300,
        fmt: v => v + ' K（' + (v - 273.15).toFixed(0) + ' °C）' },
      { id: 'exni-Eg', label: '能隙 Eg', min: 0.5, max: 2.0, step: 0.02, value: 1.12,
        fmt: v => v.toFixed(2) + ' eV' + (Math.abs(v - 1.12) < .01 ? '（矽）' : Math.abs(v - 0.66) < .01 ? '（鍺）' : Math.abs(v - 1.42) < .01 ? '（GaAs）' : '') }
    ],
    compute: g => {
      const T = g['exni-T'], Eg = g['exni-Eg'], B = MAT.Si.B;
      const powT = Math.pow(T, 1.5), expo = Math.exp(-Eg / (2 * K_EV * T));
      const ni = B * powT * expo;
      /* 以 300K 為基準，看兩項各自放大/縮小幾倍 */
      const powRef = Math.pow(300, 1.5), expRef = Math.exp(-Eg / (2 * K_EV * 300));
      return { T, Eg, B, powT, expo, ni, powGain: powT / powRef, expGain: expo / expRef,
        niRef: B * powRef * expRef };
    },
    question: (g, r) => '矽的 B = 5.23×10¹⁵，能隙取 <b>' + r.Eg.toFixed(2) + ' eV</b>，求溫度 <b>' + r.T +
      ' K</b> 時的本質載子濃度 n<sub>i</sub>，並看看公式裡兩項各自貢獻多少。' +
      '<br><span style="font-size:13px;color:var(--ink-3)">↑ 拉溫度看哪一項在主導；拉能隙可以切換成鍺(0.66)或 GaAs(1.42)。</span>',
    steps: (g, r) => [
      { t: 'Step 1　算 T^(3/2) 這一項。',
        note: '這是「導帶裡有幾個位子」的貢獻，隨溫度<b>溫和</b>成長：',
        eq: 'T^(3/2) = ' + r.T + '^1.5 = ' + sci(r.powT, 3) },
      { t: 'Step 2　算指數項 e^(−Eg/2kT)。',
        note: '這是「電子湊得到能量跳過去」的機率。先算指數：',
        eq: '−Eg/(2kT) = −' + r.Eg.toFixed(2) + ' ÷ (2 × 8.617×10⁻⁵ × ' + r.T + ') = ' +
          fix(-r.Eg / (2 * K_EV * r.T), 2) + '　⟹　e^(…) = ' + sci(r.expo, 2) },
      { t: 'Step 3　乘起來。',
        eq: 'nᵢ = (5.23×10¹⁵)(' + sci(r.powT, 2) + ')(' + sci(r.expo, 2) + ') = ' + sci(r.ni, 2) + ' cm' + sup(-3) },
      { t: 'Step 4　跟 300 K 比，看誰在主導。',
        note: '從 300 K 變到 ' + r.T + ' K 時：',
        eq: 'T^(3/2) 項變 ' + fix(r.powGain, 2) + ' 倍　　指數項變 ' + sci(r.expGain, 2) + ' 倍',
        after: r.T === 300 ? '<span style="color:var(--ink-3)">（現在就是基準溫度，兩項都是 1 倍。把溫度拉開就看得出差距。）</span>'
          : '<b style="color:var(--accent)">指數項的變化量是 T^(3/2) 項的 ' +
            sci(Math.abs(Math.log(r.expGain) / Math.log(r.powGain)) > 0 ? r.expGain / r.powGain : 1, 1) +
            ' 倍</b> —— ' + (r.T > 300
              ? '溫度升高時指數項壓倒性地把 nᵢ 往上推。'
              : '溫度降低時指數項也是壓倒性地把 nᵢ 往下拉。') }
    ],
    answer: (g, r) => 'nᵢ(' + r.T + ' K) = ' + sci(r.ni, 2) + ' cm' + sup(-3) +
      (r.T === 300 ? '　（與課本常用的 1.5×10¹⁰ 同數量級）'
        : '　（300 K 時是 ' + sci(r.niRef, 2) + '，差了 ' + sci(r.ni / r.niRef, 2) + ' 倍）'),
    /* 兩條長條：看兩項相對 300K 的變化倍率（對數刻度） */
    draw: (ctx, w, h, g, r) => {
      /* 名稱放在長條「上方」而不是左邊：窄版面也不會被切掉 */
      const narrow = w < 520;
      const padL = 14, padR = 14, y0 = 32, bh = 18, rowH = 34;
      const x0 = padL, x1 = Math.max(x0 + 40, w - padR);
      const lo = -12, hi = 12, stepK = narrow ? 6 : 4;
      const X = v => lerp(x0, x1, clamp((Math.log10(Math.max(v, 1e-30)) - lo) / (hi - lo), 0, 1));
      const zero = X(1);
      const top = y0 - 6, bot = y0 + rowH * 2 - (rowH - bh - 12) + 2;
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      for (let k = lo; k <= hi; k += stepK) {
        const px = X(Math.pow(10, k));
        ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, bot); ctx.stroke();
        label(ctx, clamp(px, x0 + 16, x1 - 16), bot + 15,
          k === 0 ? '×1' : '×10' + sup(k), C['ink-3'], 9);
      }
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(zero, top); ctx.lineTo(zero, bot); ctx.stroke();
      labelCJK(ctx, x0, 13, '相對 300 K 的變化倍率（對數刻度）', C['ink-3'], 10.5, 'left');

      [['T^(3/2) 項', r.powGain, C['ion-pos']], ['e^(−Eg/2kT) 項', r.expGain, C.electron]].forEach(([nm, v, col], i) => {
        const yTop = y0 + i * rowH;
        const px = X(v);
        labelCJK(ctx, x0, yTop, nm + '　×' + sci(v, 1), col, 11, 'left', '600');
        ctx.fillStyle = col;
        ctx.fillRect(Math.min(zero, px), yTop + 8, Math.max(2, Math.abs(px - zero)), bh);
      });
    }
  });

  /* ── 例題：質量作用定律 + 近似何時失效 ────────────────── */
  liveExample('#ex-np', {
    title: '例題 · n ≈ Nd 這個近似什麼時候會壞掉',
    givens: [
      { id: 'exnp-logNd', label: '施體濃度 Nd', min: 8, max: 18, step: 0.25, value: 16,
        fmt: v => '10' + sup(v % 1 ? v.toFixed(2) : v) + ' cm' + sup(-3) },
      { id: 'exnp-T', label: '溫度 T', min: 250, max: 600, step: 10, value: 300,
        fmt: v => v + ' K' }
    ],
    compute: g => {
      const T = g['exnp-T'];
      const ni = MAT.Si.B * Math.pow(T, 1.5) * Math.exp(-MAT.Si.Eg / (2 * K_EV * T));
      const Nd = Math.pow(10, g['exnp-logNd']);
      const nExact = Nd / 2 + Math.sqrt(Nd * Nd / 4 + ni * ni);
      const pExact = ni * ni / nExact;
      const err = Math.abs(nExact - Nd) / nExact * 100;
      return { T, ni, Nd, nExact, pExact, err, ratio: Nd / ni };
    },
    question: (g, r) => '矽在 <b>T = ' + r.T + ' K</b>（此時 nᵢ = ' + sci(r.ni, 2) + ' cm' + sup(-3) +
      '），摻入施體至 <b>N<sub>d</sub> = ' + sci(r.Nd, 2) + ' cm' + sup(-3) +
      '</b>。用完整解算電子濃度，並檢查 n ≈ N<sub>d</sub> 這個近似準不準。' +
      '<br><span style="font-size:13px;color:var(--ink-3)">↑ 把摻雜濃度往左拉（或把溫度拉高讓 nᵢ 變大），看近似在哪裡開始壞掉。</span>',
    steps: (g, r) => [
      { t: 'Step 1　先看 Nd 跟 nᵢ 差多少。',
        eq: 'Nd / nᵢ = ' + sci(r.Nd, 2) + ' ÷ ' + sci(r.ni, 2) + ' = ' + sci(r.ratio, 2) + ' 倍' },
      { t: 'Step 2　用完整解（不偷懶）。',
        note: '由電中性 + 質量作用定律推出來的二次式正根：',
        eq: 'n = Nd/2 + √((Nd/2)² + nᵢ²) = ' + sci(r.nExact, 3) + ' cm' + sup(-3) },
      { t: 'Step 3　跟近似值比。',
        note: '近似說 n ≈ Nd = ' + sci(r.Nd, 3) + '，實際是 ' + sci(r.nExact, 3) + '：',
        eq: '誤差 = ' + (r.err < 0.01 ? '< 0.01' : fix(r.err, 2)) + ' %',
        after: r.err < 1
          ? '<b style="color:var(--ok)">✓ 誤差小於 1%，近似完全可用</b>，考試直接寫 n ≈ Nd 沒問題。'
          : r.err < 20
          ? '<b style="color:var(--warn)">⚠ 誤差已經到 ' + fix(r.err, 1) + '%</b>，近似開始失準，最好用完整解。'
          : '<b style="color:var(--bad)">✗ 誤差高達 ' + fix(r.err, 1) + '%，近似完全不能用</b>。此時摻雜濃度已經接近甚至低於 nᵢ，材料的行為向本質半導體靠攏。' },
      { t: 'Step 4　少數載子與驗算。',
        eq: 'p = nᵢ²/n = ' + sci(r.pExact, 3) + ' cm' + sup(-3) +
          '　⟹　n·p = ' + sci(r.nExact * r.pExact, 3) + ' ≈ nᵢ² = ' + sci(r.ni * r.ni, 3) + ' ✓' }
    ],
    answer: (g, r) => 'n = ' + sci(r.nExact, 3) + ' cm' + sup(-3) + '　｜　p = ' + sci(r.pExact, 3) + ' cm' + sup(-3) +
      '　｜　近似誤差 ' + (r.err < 0.01 ? '< 0.01' : fix(r.err, 2)) + ' %'
  });
})();
