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
      const ratio = typeof o.ratio === 'function' ? o.ratio(cssW) : o.ratio;
      const cssH = clamp(Math.round(cssW * ratio), o.minH, o.maxH);
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
  /* 乾淨版（跟故事模式同一套）：電洞＝中空的虛線藍圈 */
  const CLEAN = () => document.body && document.body.dataset.look === 'clean';
  function hole(ctx, x, y, r) {
    r = Math.max(0, r || 5);
    const ring = CLEAN() ? C.accent : C.hole;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = CLEAN() ? C.surface : C['hole-w']; ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = ring; ctx.setLineDash([2.6, 2.2]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = ring; ctx.font = '700 ' + (r * 1.5) + 'px ' + MONO;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (r >= 6) ctx.fillText('+', x, y + 0.5);
  }
  /* 文字裡的 <sup>…</sup> 畫成上標、<sub>…</sub> 畫成下標（次方一律這樣寫，不用 ^） */
  function richText(ctx, x, y, text, size, fam, weight, align) {
    const toks = String(text).split(/(<\/?su[pb]>)/);
    if (toks.length === 1) { ctx.textAlign = align; ctx.fillText(text, x, y); return; }
    const fN = weight + ' ' + size + 'px ' + fam, fS = weight + ' ' + Math.round(size * 0.72) + 'px ' + fam;
    const parts = []; let mode = 0;                       /* 0 一般、1 上標、−1 下標 */
    toks.forEach(t => { if (t === '<sup>') mode = 1; else if (t === '<sub>') mode = -1; else if (t === '</sup>' || t === '</sub>') mode = 0; else if (t) parts.push([t, mode]); });
    let W = 0;
    parts.forEach(p => { ctx.font = p[1] ? fS : fN; W += ctx.measureText(p[0]).width; });
    let cx = align === 'center' ? x - W / 2 : align === 'right' ? x - W : x;
    ctx.textAlign = 'left';
    parts.forEach(p => { ctx.font = p[1] ? fS : fN; ctx.fillText(p[0], cx, p[1] > 0 ? y - size * 0.38 : p[1] < 0 ? y + size * 0.24 : y); cx += ctx.measureText(p[0]).width; });
    ctx.font = fN;
  }
  function label(ctx, x, y, text, color, size, align, weight) {
    ctx.fillStyle = color || C['ink-3'];
    ctx.font = (weight || '500') + ' ' + (size || 11) + 'px ' + MONO;
    ctx.textBaseline = 'middle';
    richText(ctx, x, y, text, size || 11, MONO, weight || '500', align || 'center');
  }
  function labelCJK(ctx, x, y, text, color, size, align, weight) {
    ctx.fillStyle = color || C['ink-2'];
    ctx.font = (weight || '500') + ' ' + (size || 12) + 'px ' + BODY;
    ctx.textBaseline = 'middle';
    richText(ctx, x, y, text, size || 12, BODY, weight || '500', align || 'center');
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
    function sync() { if (out) { const s = String(fmt(parseFloat(el.value))); if (/<(sub|sup|b)>/.test(s)) out.innerHTML = s; else out.textContent = s; } onChange && onChange(parseFloat(el.value)); }
    el.addEventListener('input', sync);
    sync();
    return el;
  }
  function setText(id, v) { const el = document.getElementById(id); if (el) { if (/<sup>/.test(v)) el.innerHTML = v; else el.textContent = v; } }


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
  /* 上課筆記的「更正」標記：點一下在旁邊顯示原本寫的是什麼，再點一下收起來 */
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('button.fix[data-was]');
    if (!b) return;
    if (b._was) { b._was.remove(); b._was = null; return; }
    const sp = document.createElement('span');
    sp.className = 'fix-was'; sp.innerHTML = '原本寫：' + b.dataset.was;
    (b.closest('.bl') || b).after(sp);   /* 放在那一行下面，不塞進會橫向捲動的行裡 */
    b._was = sp;
  });
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
      host.querySelector('.ex-q').innerHTML = cfg.question(state, r) + (cfg.questionEn ? '<div class="q-en">' + cfg.questionEn(state, r) + '</div>' : '');
      host.querySelector('ol').innerHTML = cfg.steps(state, r).map(st =>
        '<li><b>' + st.t + '</b>' + (st.note ? ' ' + st.note : '') +
        (st.eq ? '<span class="d-eq">' + st.eq + '</span>' : '') +
        (st.after ? '<div style="margin-top:6px">' + st.after + '</div>' : '') + '</li>').join('');
      host.querySelector('.ex-ans').innerHTML = cfg.answer(state, r);
      if (stage) stage.redraw();
      wireTerms();
      host.dispatchEvent(new CustomEvent('ex:render'));   /* 讓「講義收合」重新套用目前看到第幾步 */
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

/* 被 iframe 嵌入時（網址帶 ?embed=1）加上 .embed，隱藏頂欄 */
(function () {
  if (/[?&]embed=1\b/.test(location.search)) document.documentElement.classList.add('embed');
})();

/* ============================================================
   推導 → 故事卡（使用者 10/12：推導字太多讀不下去，要跟故事模式一樣一步一步）
   每一步只露出「算式 ＋ 一句白話」，原本的長說明收進「看詳細」；按「下一步」才出下一張。
   只用 class 切換顯示、加上的按鈕都是 .dv-ui（annot.js 不把它算進筆跡錨點，舊筆跡不會移位）。
   ============================================================ */
(function () {
  'use strict';
  const LS = 'ee-dv-all';
  const lsGet = () => { try { return localStorage.getItem(LS) === '1'; } catch (e) { return false; } };
  const lsSet = v => { try { localStorage.setItem(LS, v ? '1' : '0'); } catch (e) {} };
  /* 複製一段 HTML，只留到第一個句號（。；！？）為止 */
  function firstSentence(el) {
    const c = el.cloneNode(true);
    let cut = false, len = 0;
    (function walk(n) {
      for (let k = 0; k < n.childNodes.length; k++) {
        const ch = n.childNodes[k];
        if (cut) { n.removeChild(ch); k--; continue; }
        if (ch.nodeType === 3) {
          const s = ch.nodeValue, m = /[。！？；]/.exec(s.slice(Math.max(0, 16 - len)));
          if (m) { const at = Math.max(0, 16 - len) + m.index + 1; ch.nodeValue = s.slice(0, at); cut = true; }
          len += s.length;
        } else if (ch.nodeType === 1) walk(ch);
      }
    })(c);
    return { html: c.innerHTML, rest: cut && el.textContent.trim().length > c.textContent.trim().length + 2 };
  }
  function build(dv) {
    if (dv.dataset.cards) return; dv.dataset.cards = '1';
    const ol = dv.querySelector(':scope > ol'); if (!ol) return;
    const lis = Array.prototype.slice.call(ol.children).filter(x => x.tagName === 'LI');
    if (lis.length < 2) return;
    dv.classList.add('dv-cards');
    lis.forEach(li => {
      const long = li.querySelector(':scope > .why, :scope > p');
      if (!long) return;
      const fs = firstSentence(long);
      if (!fs.rest) return;                       /* 本來就只有一句：照原樣顯示 */
      const s = document.createElement('div'); s.className = 'dv-ui dv-short'; s.innerHTML = fs.html;
      long.parentNode.insertBefore(s, long);
      long.classList.add('dv-long');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'dv-ui dv-more'; b.textContent = '看詳細 ▾';
      b.addEventListener('click', () => { const on = li.classList.toggle('dv-open'); b.textContent = on ? '收起詳細 ▴' : '看詳細 ▾'; });
      long.parentNode.insertBefore(b, long.nextSibling);
    });
    const bar = document.createElement('div'); bar.className = 'dv-ui dv-bar';
    bar.innerHTML = '<button type="button" class="btn solid" data-dv="next">下一步 ▸</button><button type="button" class="btn" data-dv="all">全部展開</button><button type="button" class="btn" data-dv="reset">從第一步</button><span class="dv-prog"></span>';
    dv.appendChild(bar);
    let n = 1;
    function show(k) {
      n = Math.max(1, Math.min(k, lis.length));
      lis.forEach((li, i) => { li.classList.toggle('dv-hide', i >= n); li.classList.toggle('dv-cur', i === n - 1 && n < lis.length); });
      const done = n >= lis.length;
      bar.querySelector('[data-dv="next"]').hidden = done;
      bar.querySelector('[data-dv="all"]').hidden = done;
      bar.querySelector('[data-dv="reset"]').hidden = n === 1;
      bar.querySelector('.dv-prog').textContent = done ? '✓ 全部 ' + lis.length + ' 步' : '第 ' + n + ' / ' + lis.length + ' 步';
    }
    bar.addEventListener('click', e => {
      const a = e.target.closest('[data-dv]'); if (!a) return;
      if (a.dataset.dv === 'next') show(n + 1);
      else if (a.dataset.dv === 'all') { show(lis.length); lsSet(true); }
      else { show(1); lsSet(false); }
    });
    /* 點卡片本身（不是按鈕、名詞、連結）也前進一步 —— 跟故事模式一樣「點一下往下」 */
    ol.addEventListener('click', e => {
      if (e.target.closest('button, a, .tm, input')) return;
      if (window.__ANN && document.body.classList.contains('ann-on')) return;
      const li = e.target.closest('li'); if (li && li.classList.contains('dv-cur')) show(n + 1);
    });
    show(lsGet() ? lis.length : 1);
    dv.__dvShow = show;
  }
  function init() { document.querySelectorAll('.derive').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  /* 從錯題本、連結跳進來時，目標在收起來的步驟裡 → 全部打開 */
  window.addEventListener('hashchange', () => { const t = document.getElementById(location.hash.slice(1)); const d = t && t.closest('.derive'); if (d && d.__dvShow) d.__dvShow(99); });
  window.__EE && (window.__EE.deriveCards = init, window.__EE.firstSentence = firstSentence);
})();

/* 實驗照片：點一下放大、再點一下縮回（.lab-photos） */
document.addEventListener('click', function (e) {
  var img = e.target.closest && e.target.closest('.lab-photos img'); if (!img) return;
  img.closest('figure').classList.toggle('open');
});

/* ============================================================
   電路學講義收合（使用者 10/18：講義字太多，要跟工數一樣「字收起來，按下一步才展開」）
   只套在電路學有推導的講義頁：
   ① 可調數字例題：步驟一次一步（下一步／全部展開），最後一步之後才露出答案；拉滑桿重算時保留看到第幾步。
   ② 小節導言、hero 說明、.note：只露第一句，其餘收進「看詳細」。
   寫筆記模式全部攤開；加的東西都是 .dv-ui（不影響筆跡錨點）。
   ============================================================ */
(function () {
  'use strict';
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(() => {
    const body = document.body;
    if (!body || body.dataset.subject !== 'circuits' || !document.querySelector('.derive')) return;
    body.classList.add('fold-text');
    const FS = window.__EE && window.__EE.firstSentence;

    /* ① 可調數字例題 */
    document.querySelectorAll('.example.live').forEach(ex => {
      const ol = ex.querySelector(':scope > ol'), ans = ex.querySelector(':scope > .ex-ans');
      if (!ol) return;
      ex.classList.add('ex-cards');
      const bar = document.createElement('div'); bar.className = 'dv-ui dv-bar ex-bar';
      bar.innerHTML = '<button type="button" class="btn solid" data-dv="next">下一步 ▸</button><button type="button" class="btn" data-dv="all">全部展開</button><button type="button" class="btn" data-dv="reset">從第一步</button><span class="dv-prog"></span>';
      ol.parentNode.insertBefore(bar, ol.nextSibling);
      let n = 1;
      function show(k) {
        const lis = Array.prototype.slice.call(ol.children);
        n = Math.max(1, Math.min(k, lis.length || 1));
        lis.forEach((li, i) => { li.classList.toggle('dv-hide', i >= n); li.classList.toggle('dv-cur', i === n - 1 && n < lis.length); });
        const done = n >= lis.length;
        if (ans) ans.classList.toggle('dv-hide', !done);
        bar.querySelector('[data-dv="next"]').hidden = done;
        bar.querySelector('[data-dv="all"]').hidden = done;
        bar.querySelector('[data-dv="reset"]').hidden = n === 1;
        bar.querySelector('.dv-prog').textContent = done ? '✓ 全部 ' + lis.length + ' 步' : '第 ' + n + ' / ' + lis.length + ' 步';
      }
      bar.addEventListener('click', e => {
        const a = e.target.closest('[data-dv]'); if (!a) return;
        show(a.dataset.dv === 'next' ? n + 1 : a.dataset.dv === 'all' ? 99 : 1);
      });
      ol.addEventListener('click', e => {
        if (e.target.closest('button, a, .tm, input') || body.classList.contains('ann-on')) return;
        const li = e.target.closest('li'); if (li && li.classList.contains('dv-cur')) show(n + 1);
      });
      ex.addEventListener('ex:render', () => show(n));
      ex.__exShow = show;
      show(1);
    });

    /* ② 長段落只露第一句 */
    if (!FS) return;
    const paras = document.querySelectorAll('main section.sec > p, main section.sec > .note, main .hero > p.sub, main section.sec > .lede');
    paras.forEach(p => {
      if (p.closest('.story, .derive, .example, .howto, .pitfall, .glossary, .quiz, .exbook, .rv-sum')) return;
      if (p.textContent.trim().length < 70) return;
      const fs = FS(p);
      if (!fs.rest) return;
      const s = document.createElement('div'); s.className = 'dv-ui pr-short' + (p.classList.contains('note') ? ' note' : '') + (p.classList.contains('sub') ? ' sub' : '');
      s.innerHTML = fs.html + ' <button type="button" class="dv-more pr-more">看詳細 ▾</button>';
      p.parentNode.insertBefore(s, p);
      p.classList.add('pr-long');
      const close = document.createElement('button'); close.type = 'button'; close.className = 'dv-ui dv-more pr-less'; close.textContent = '收起 ▴';
      p.parentNode.insertBefore(close, p.nextSibling);
      s.querySelector('.pr-more').addEventListener('click', () => { p.classList.add('pr-open'); s.classList.add('pr-hide'); close.classList.add('pr-on'); });
      close.addEventListener('click', () => { p.classList.remove('pr-open'); s.classList.remove('pr-hide'); close.classList.remove('pr-on'); });
    });
    /* 連結跳進收起來的地方 → 打開 */
    function openTarget() {
      const t = location.hash && document.getElementById(location.hash.slice(1)); if (!t) return;
      const ex = t.closest('.example.live'); if (ex && ex.__exShow) ex.__exShow(99);
    }
    window.addEventListener('hashchange', openTarget); openTarget();
  });
})();
