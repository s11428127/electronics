/* ============================================================
   電子學互動講義 — 互動引擎
   CH1 PART 1：半導體材料與性質（Neamen 4e, Ch.1 pp.1–30）
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 主題色票 ---------------- */
  const TOKENS = ['ink', 'ink-2', 'ink-3', 'line', 'line-soft', 'surface', 'surface-2',
    'surface-3', 'electron', 'electron-w', 'hole', 'hole-w', 'ion-pos', 'ion-pos-w',
    'ok', 'warn', 'bad', 'paper'];
  const C = {};
  function readTokens() {
    const cs = getComputedStyle(document.documentElement);
    TOKENS.forEach(k => { C[k] = cs.getPropertyValue('--' + k).trim() || '#888'; });
  }
  readTokens();
  const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  mqDark.addEventListener && mqDark.addEventListener('change', readTokens);
  new MutationObserver(readTokens).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 常數與小工具 ---------------- */
  const K_EV = 8.617e-5;               // 波茲曼常數 (eV/K)
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  function sci(x, digits) {
    if (!isFinite(x) || x <= 0) return '0';
    const e = Math.floor(Math.log10(x));
    const m = x / Math.pow(10, e);
    return m.toFixed(digits === undefined ? 2 : digits) + '×10' + sup(e);
  }
  const SUPS = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function sup(n) { return String(n).split('').map(c => SUPS[c] || c).join(''); }

  /* ---------------- 畫布舞台 ---------------- */
  /* 處理 DPR、尺寸變化、rAF 迴圈；draw(ctx, w, h, dt) 以 CSS 像素為座標單位 */
  function Stage(canvas, opts) {
    const o = Object.assign({ ratio: 0.5, minH: 180, maxH: 420, animate: true }, opts);
    const ctx = canvas.getContext('2d');
    const wantAnim = o.animate !== false;
    let w = 0, h = 0, raf = 0, last = 0, visible = true;

    function resize() {
      const cssW = Math.max(1, canvas.parentElement.clientWidth);
      const cssH = clamp(Math.round(cssW * o.ratio), o.minH, o.maxH);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cssW; h = cssH;
      canvas.style.height = cssH + 'px';
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now());          /* 尺寸一變就重畫，靜態圖也才有內容 */
    }
    function paint(t) {
      const dt = Math.min(Math.max((t - last) / 1000, 0) || 0, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      o.draw(ctx, w, h, dt);
    }
    function frame(t) { raf = 0; paint(t); if (wantAnim && visible) raf = requestAnimationFrame(frame); }
    function play() { if (!wantAnim || !visible || raf) return; last = performance.now(); raf = requestAnimationFrame(frame); }
    function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    const api = {
      get w() { return w; }, get h() { return h; }, ctx: ctx, canvas: canvas,
      redraw() { paint(performance.now()); },
      stop: pause, start: play
    };
    new ResizeObserver(resize).observe(canvas.parentElement);
    resize();

    /* 只在畫面可見時跑動畫：省電，也避免離開視窗後就再也動不起來 */
    new IntersectionObserver(es => {
      es.forEach(e => {
        visible = e.isIntersecting;
        if (!visible) { pause(); return; }
        wantAnim ? play() : api.redraw();
      });
    }, { threshold: 0 }).observe(canvas);

    document.addEventListener('visibilitychange', () => { document.hidden ? pause() : play(); });
    play();
    return api;
  }

  function pointerPos(canvas, ev) {
    const r = canvas.getBoundingClientRect();
    const p = ev.touches ? ev.touches[0] : ev;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }

  /* ---------------- 繪圖原語 ---------------- */
  function disc(ctx, x, y, r, fill, stroke) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.lineWidth = 1.2; ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  function electron(ctx, x, y, r) {
    disc(ctx, x, y, r || 5, C.electron);
    ctx.fillStyle = C.surface; ctx.font = '700 ' + ((r || 5) * 1.5) + 'px ' + MONO;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if ((r || 5) >= 6) ctx.fillText('−', x, y + 0.5);
  }
  function hole(ctx, x, y, r) {
    r = r || 5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = C['hole-w']; ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = C.hole; ctx.setLineDash([2.6, 2.2]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.hole; ctx.font = '700 ' + (r * 1.5) + 'px ' + MONO;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (r >= 6) ctx.fillText('+', x, y + 0.5);
  }
  function label(ctx, x, y, text, color, size, align, weight) {
    ctx.fillStyle = color || C['ink-3'];
    ctx.font = (weight || '500') + ' ' + (size || 11) + 'px ' + MONO;
    ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }
  function labelCJK(ctx, x, y, text, color, size, align, weight) {
    ctx.fillStyle = color || C['ink-2'];
    ctx.font = (weight || '500') + ' ' + (size || 12) + 'px ' + BODY;
    ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }
  function arrow(ctx, x1, y1, x2, y2, color, width) {
    const a = Math.atan2(y2 - y1, x2 - x1), hd = 6.5;
    ctx.strokeStyle = color; ctx.lineWidth = width || 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hd * 0.6, y2 - Math.sin(a) * hd * 0.6); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(a - 0.42) * hd, y2 - Math.sin(a - 0.42) * hd);
    ctx.lineTo(x2 - Math.cos(a + 0.42) * hd, y2 - Math.sin(a + 0.42) * hd);
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  }
  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  const BODY = '"Noto Sans TC", system-ui, sans-serif';

  /* 綁一組滑桿：自動同步 output 顯示 */
  function bindRange(id, fmt, onChange) {
    const el = document.getElementById(id);
    const out = document.querySelector('output[for="' + id + '"]');
    function sync() { if (out) out.textContent = fmt(parseFloat(el.value)); onChange && onChange(parseFloat(el.value)); }
    el.addEventListener('input', sync);
    sync();
    return el;
  }
  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

  window.__EE = { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, K_EV, TAU, MONO, BODY, REDUCED, pointerPos, $, $$ };
})();
