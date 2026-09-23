/* ============================================================
   電子學互動講義 — 互動引擎
   CH1 PART 1：半導體材料與性質（Neamen 4e, Ch.1 pp.1–30）
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 主題色票 ---------------- */
  const TOKENS = ['ink', 'ink-2', 'ink-3', 'line', 'line-soft', 'surface', 'surface-2',
    'surface-3', 'electron', 'electron-w', 'hole', 'hole-w', 'ion-pos', 'ion-pos-w',
    'ok', 'warn', 'bad', 'paper', 'accent',
    'p-real', 'p-real-w', 'q-react', 'q-react-w', 's-app', 's-app-w'];
  const C = {};
  function readTokens() {
    /* 從 body 讀，科目主色（body[data-subject]）才會被算進來 */
    const cs = getComputedStyle(document.body || document.documentElement);
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
    ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU);
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
    r = Math.max(0, r || 5);
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


  /* ---------------- 專有名詞小字典 ---------------- */
  /* 用法：<button class="tm" data-t="摻雜">摻雜<i>doping</i></button>
     點一下跳出白話解釋。字典由 shared/terms.js 註冊。 */
  const DICT = {};
  let pop = null;

  function closePop() { if (pop) { pop.remove(); pop = null; } }

  function openPop(btn) {
    closePop();
    const key = btn.dataset.t;
    const d = DICT[key];
    if (!d) return;
    pop = document.createElement('div');
    pop.className = 'term-pop';
    pop.setAttribute('role', 'dialog');
    pop.innerHTML =
      '<button class="tp-close" type="button" aria-label="關閉">✕</button>' +
      '<h5>' + (d.zh || key) + '</h5>' +
      (d.en ? '<div class="tp-en">' + d.en + '</div>' : '') +
      '<div class="tp-plain">' + d.plain + '</div>' +
      (d.unit ? '<span class="tp-unit">' + d.unit + '</span>' : '') +
      (d.why ? '<div class="tp-why"><b>為什麼要有這個詞：</b>' + d.why + '</div>' : '');
    document.body.appendChild(pop);
    pop.querySelector('.tp-close').addEventListener('click', closePop);

    /* 用頁面座標定位（不是視窗座標），這樣捲動時彈窗會跟著名詞一起走，
       不必在 scroll 時把它關掉 —— 手機上輕輕一滑就消失會很難用。 */
    const r = btn.getBoundingClientRect(), pr = pop.getBoundingClientRect();
    const margin = 12, sx = window.scrollX, sy = window.scrollY;
    let top = r.bottom + sy + 8;
    if (r.bottom + pr.height + margin > window.innerHeight) {
      top = Math.max(sy + margin, r.top + sy - pr.height - 8);
    }
    let left = r.left + sx + r.width / 2 - pr.width / 2;
    left = clamp(left, sx + margin, Math.max(sx + margin, sx + window.innerWidth - pr.width - margin));
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
  }

  function registerTerms(map) {
    Object.assign(DICT, map);
    wireTerms();
  }
  function wireTerms() {
    $$('button.tm[data-t]').forEach(b => {
      if (b.dataset.wired) return;
      b.dataset.wired = '1';
      b.type = 'button';
      b.addEventListener('click', e => { e.stopPropagation(); openPop(b); });
    });
    /* 舊寫法 <span class="tm"> 也自動升級成可點的按鈕 */
    $$('span.tm[data-t]').forEach(sp => {
      const b = document.createElement('button');
      b.className = 'tm'; b.type = 'button';
      b.dataset.t = sp.dataset.t; b.innerHTML = sp.innerHTML;
      sp.replaceWith(b);
    });
    $$('button.tm[data-t]').forEach(b => {
      if (b.dataset.wired) return;
      b.dataset.wired = '1';
      b.addEventListener('click', e => { e.stopPropagation(); openPop(b); });
    });
  }
  document.addEventListener('click', e => { if (pop && !pop.contains(e.target)) closePop(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });
  window.addEventListener('resize', closePop);

  /* ---------------- 可互動例題 ---------------- */
  /* 已知條件做成滑桿，每一步的算式與答案即時重算。 */
  function liveExample(sel, cfg) {
    const host = typeof sel === 'string' ? $(sel) : sel;
    if (!host) return;
    const state = {};
    cfg.givens.forEach(g => { state[g.id] = g.value; });

    host.classList.add('example', 'live');
    host.innerHTML =
      '<div class="ex-head"><span>' + cfg.title + '</span>' +
        '<span class="ex-live-tag">可調數字</span>' +
        '<button class="ex-reset" type="button">↺ 回到原題</button></div>' +
      '<div class="ex-given"></div>' +
      (cfg.draw ? '<div class="stage-wrap"><canvas></canvas></div>' : '') +
      '<p class="ex-q"></p><ol></ol><p class="ex-ans"></p>';

    const givenBox = host.querySelector('.ex-given');
    cfg.givens.forEach(g => {
      const d = document.createElement('div');
      d.className = 'ctrl';
      d.innerHTML = '<label for="' + g.id + '">' + g.label +
        '<output for="' + g.id + '"></output></label>' +
        '<input type="range" id="' + g.id + '" min="' + g.min + '" max="' + g.max +
        '" step="' + g.step + '" value="' + g.value + '">';
      givenBox.appendChild(d);
    });

    let stage = null;
    if (cfg.draw) {
      stage = Stage(host.querySelector('canvas'), {
        animate: false, ratio: cfg.ratio || 0.28, minH: cfg.minH || 130, maxH: cfg.maxH || 190,
        draw: (ctx, w, h) => cfg.draw(ctx, w, h, state, cfg.compute(state))
      });
    }

    function render() {
      const r = cfg.compute(state);
      host.querySelector('.ex-q').innerHTML = cfg.question(state, r);
      host.querySelector('ol').innerHTML = cfg.steps(state, r).map(st =>
        '<li><b>' + st.t + '</b>' + (st.note ? ' ' + st.note : '') +
        (st.eq ? '<span class="d-eq">' + st.eq + '</span>' : '') +
        (st.after ? '<div style="margin-top:6px">' + st.after + '</div>' : '') + '</li>').join('');
      host.querySelector('.ex-ans').innerHTML = cfg.answer(state, r);
      if (stage) stage.redraw();
      wireTerms();
    }
    cfg.givens.forEach(g => {
      bindRange(g.id, g.fmt, v => { state[g.id] = v; render(); });
    });
    host.querySelector('.ex-reset').addEventListener('click', () => {
      cfg.givens.forEach(g => {
        const el = document.getElementById(g.id);
        el.value = g.value; el.dispatchEvent(new Event('input'));
      });
    });
    render();
    return { render: render };
  }

  document.addEventListener('DOMContentLoaded', wireTerms);

  window.__EE = { C, Stage, disc, electron, hole, label, labelCJK, arrow, bindRange, setText,
    clamp, lerp, sci, sup, K_EV, TAU, MONO, BODY, REDUCED, pointerPos, $, $$,
    registerTerms, wireTerms, liveExample };
})();
