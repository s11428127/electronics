/* ============================================================
   故事模式引擎 —— 一次一個畫面、一句字幕（仿解說動畫影片）
   ------------------------------------------------------------
   用法：
     __Story('#story', { id, scenes: [
       { t: '中文標題', en: 'ENGLISH TITLE', svg: '<g data-k="a">…</g>…',
         steps: [ { sub: '字幕', on: 'a b', off: 'c', mv: { a: [dx, dy, scale] },
                    cls: { a: 'shake' }, op: { a: .3 }, txt: { a: '新文字' }, dur: 4000 } ] }
     ]});
   • 有 data-k 的元素一開始是隱藏的；每一步把「到這一步為止」的狀態累加起來套上去，
     所以往前、往後、跳段落都一致。
   • 換步驟時 CSS transition 負責動畫；同一步一起出現的元素會依序錯開浮現。
   • 點畫面 / 往左滑 / → 鍵：下一步；點左側 1/4 / 往右滑 / ← 鍵：上一步。
   • 「自動播放」依字幕長度決定停留時間。
   ============================================================ */
(function () {
  'use strict';
  const VW = 640, VH = 400;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 畫圖小工具（回傳 SVG 字串） ---------------- */
  const k = key => (key ? ' data-k="' + key + '"' : '');
  /* 粗估字寬：中文 1 個字 ≈ 字級，英數 ≈ 0.58 字級 */
  function textW(s, fs) {
    let w = 0;
    for (const ch of String(s).replace(/<[^>]+>/g, '')) w += ch.charCodeAt(0) > 0x2e80 ? fs : fs * 0.6;
    return w;
  }
  /* <sup>…</sup> → SVG 上標；後面接一個零寬字元把基線拉回來（空的 tspan 的 dy 不會生效） */
  const supSvg = (s, fs) => String(s).replace(/<sup>(.*?)<\/sup>/g, (m, x) =>
    '<tspan font-size="' + (fs * 0.7).toFixed(1) + '" dy="' + (-fs * 0.4).toFixed(1) + '">' + x + '</tspan><tspan dy="' + (fs * 0.4).toFixed(1) + '">\u200B</tspan>')
    /* <sub>…</sub> → SVG 下標（同一招） */
    .replace(/<sub>(.*?)<\/sub>/g, (m, x) =>
    '<tspan font-size="' + (fs * 0.7).toFixed(1) + '" dy="' + (fs * 0.25).toFixed(1) + '">' + x + '</tspan><tspan dy="' + (-fs * 0.25).toFixed(1) + '">\u200B</tspan>');
  const D = {
    textW, supSvg,
    e: (x, y, key, r) => '<circle class="e" cx="' + x + '" cy="' + y + '" r="' + (r || 5) + '"' + k(key) + '/>',
    h: (x, y, key, r) => '<circle class="h" cx="' + x + '" cy="' + y + '" r="' + (r || 5.5) + '"' + k(key) + '/>',
    atom: (x, y, sym, key, r, cls) => {
      r = r || 14;
      return '<g class="at ' + (cls || '') + '"' + k(key) + '><circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>' +
        '<text x="' + x + '" y="' + y + '" dy=".36em" text-anchor="middle" font-size="' + Math.round(r * (sym.length > 1 ? 0.8 : 1)) + '">' + esc(sym) + '</text></g>';
    },
    line: (x1, y1, x2, y2, key, cls) => '<line class="' + (cls || 'ln') + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + k(key) + '/>',
    text: (x, y, s, opt) => {
      opt = opt || {};
      return '<text x="' + x + '" y="' + y + '" class="' + (opt.cls || 't') + '" font-size="' + (opt.fs || 14) + '" text-anchor="' + (opt.a || 'middle') + '"' +
        (opt.dy ? ' dy="' + opt.dy + '"' : '') + k(opt.k) + '>' + supSvg(s, opt.fs || 14) + '</text>';
    },
    arrow: (x1, y1, x2, y2, key, cls) => {
      const a = Math.atan2(y2 - y1, x2 - x1), L = 8;
      const p1 = [x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)], p2 = [x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)];
      return '<g class="' + (cls || 'ln') + '"' + k(key) + '><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>' +
        '<polyline points="' + p1.join(',') + ' ' + x2 + ',' + y2 + ' ' + p2.join(',') + '"/></g>';
    },
    /* 標籤卡：藍點 + 粗體主文 + 灰色小字 */
    chip: (x, y, title, sub, key, opt) => {
      opt = opt || {};
      const fs = opt.fs || 13, fs2 = Math.round(fs * 0.72);
      const w = Math.max(textW(title, fs), sub ? textW(sub, fs2) : 0) + 30, h = sub ? fs + fs2 + 16 : fs + 14;
      const x0 = opt.a === 'left' ? x : opt.a === 'right' ? x - w : x - w / 2, y0 = y - h / 2;
      return '<g class="chip"' + k(key) + '><rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="8" filter="url(#st-sh)"/>' +
        '<circle class="cdot" cx="' + (x0 + 12) + '" cy="' + (y0 + (sub ? fs * 0.62 + 7 : h / 2)) + '" r="2.6"/>' +
        '<text class="t" x="' + (x0 + 20) + '" y="' + (y0 + fs + (sub ? 5 : 3)) + '" font-size="' + fs + '"' + (opt.acc ? ' style="fill:var(--s-acc)"' : '') + '>' + supSvg(title, fs) + '</text>' +
        (sub ? '<text class="ts" x="' + (x0 + 20) + '" y="' + (y0 + fs + fs2 + 9) + '" font-size="' + fs2 + '">' + supSvg(sub, fs2) + '</text>' : '') + '</g>';
    },
    /* 2D 晶格：cols × rows 個原子，間距 d；每條鍵上兩顆共用電子
       整組的 key：p-a 原子、p-b 鍵、p-e 鍵上電子。
       個別元素（p-a-i-j、p-e-i-j-h|v-0|1）只有列在 opt.keyed 裡才會有自己的 key ——
       有 key 的元素一開始是隱藏的，全部都給 key 的話整個晶格會看不到。 */
    lattice: (x0, y0, cols, rows, d, p, opt) => {
      opt = opt || {};
      const sym = opt.sym || {}, skip = opt.skip || {}, keyed = new Set(opt.keyed || []);
      const kk = id => (keyed.has(id) ? id : null);
      let bonds = '', dots = '', atoms = '';
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = x0 + i * d, y = y0 + j * d;
        if (i < cols - 1) {
          bonds += D.line(x + 14, y, x + d - 14, y, null, 'ln2');
          [0, 1].forEach(t => { const id = p + '-e-' + i + '-' + j + '-h-' + t; if (!skip[id]) dots += D.e(x + d * (0.36 + 0.28 * t), y, kk(id), 4); });
        }
        if (j < rows - 1) {
          bonds += D.line(x, y + 14, x, y + d - 14, null, 'ln2');
          [0, 1].forEach(t => { const id = p + '-e-' + i + '-' + j + '-v-' + t; if (!skip[id]) dots += D.e(x, y + d * (0.36 + 0.28 * t), kk(id), 4); });
        }
        const s = sym[i + ',' + j] || 'Si';
        atoms += D.atom(x, y, s, kk(p + '-a-' + i + '-' + j), 13, s === 'P' ? 'p' : s === 'B' ? 'b' : '');
      }
      return '<g data-k="' + p + '-b">' + bonds + '</g><g data-k="' + p + '-e">' + dots + '</g><g data-k="' + p + '-a">' + atoms + '</g>';
    }
  };

  /* ---------------- 播放器 ---------------- */
  function Story(sel, def) {
    const root = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!root) return null;
    const scenes = def.scenes;
    const LS = 'ee-story-' + def.id;
    let sc = 0, st = 0, playing = false, timer = 0, svg = null, built = -1, ended = false;

    root.className = 'story'; root.tabIndex = 0;
    root.setAttribute('role', 'region'); root.setAttribute('aria-label', '故事模式：' + (def.title || ''));
    root.innerHTML =
      '<div class="st-stage">' +
        '<div class="st-art"></div>' +
        '<div class="st-title"><b></b><i></i></div>' +
        '<div class="st-sub" aria-live="polite"><span></span></div>' +
        '<div class="st-hint">點畫面或往左滑 → 下一步</div>' +
        '<div class="st-end"><button class="btn" type="button" data-end="again">↺ 從頭再看一次</button>' +
          (def.after ? '<a class="btn solid" href="' + def.after + '" data-end="go" style="text-decoration:none">往下看推導與例題 ↓</a>' : '') + '</div>' +
      '</div>' +
      '<div class="st-bar">' +
        '<button type="button" data-b="prev" aria-label="上一步">‹</button>' +
        '<button type="button" data-b="play" aria-pressed="false">▶ <span class="lbl">自動播放</span></button>' +
        '<button type="button" data-b="next" aria-label="下一步">›</button>' +
        '<div class="st-prog" role="group" aria-label="段落進度"></div>' +
        '<span class="st-count"></span>' +
        '<button type="button" data-b="list" aria-label="段落列表">☰ <span class="lbl">段落</span></button>' +
        '<button type="button" data-b="full" aria-label="全螢幕">⛶</button>' +
      '</div>';
    const $ = s => root.querySelector(s);
    const stage = $('.st-stage'), art = $('.st-art'), titleEl = $('.st-title'), subEl = $('.st-sub'), hint = $('.st-hint');
    const prog = $('.st-prog');
    const total = scenes.reduce((n, s) => n + s.steps.length, 0);

    scenes.forEach((s, i) => {
      const seg = document.createElement('i');
      seg.style.flex = String(s.steps.length);
      seg.title = (i + 1) + '. ' + s.t;
      seg.innerHTML = '<u></u>';
      seg.addEventListener('click', e => { e.stopPropagation(); go(i, 0); });
      prog.appendChild(seg);
    });

    function build(i) {
      const s = scenes[i];
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
      el.setAttribute('class', 'st-svg instant');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<defs><filter id="st-sh" x="-20%" y="-30%" width="140%" height="170%">' +
        '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".12"/></filter></defs>' + s.svg;
      return el;
    }
    /* 把第 0 ~ upto 步的狀態累加起來 */
    function fold(i, upto) {
      const S = {};
      const get = key => S[key] || (S[key] = { on: false, x: 0, y: 0, s: 1, o: null, c: '', t: null });
      for (let n = 0; n <= upto; n++) {
        const p = scenes[i].steps[n];
        if (!p) continue;
        (p.on || '').split(/\s+/).filter(Boolean).forEach(key => { get(key).on = true; });
        (p.off || '').split(/\s+/).filter(Boolean).forEach(key => { get(key).on = false; });
        Object.keys(p.mv || {}).forEach(key => { const v = p.mv[key], g = get(key); g.x = v[0]; g.y = v[1]; if (v[2] !== undefined) g.s = v[2]; });
        Object.keys(p.cls || {}).forEach(key => { get(key).c = p.cls[key]; });
        Object.keys(p.op || {}).forEach(key => { get(key).o = p.op[key]; });
        Object.keys(p.txt || {}).forEach(key => { get(key).t = p.txt[key]; });
      }
      return S;
    }
    function apply(instant, prevStep) {
      const S = fold(sc, st), P = prevStep >= 0 ? fold(sc, prevStep) : {};
      if (instant) svg.classList.add('instant');
      const groups = {};
      svg.querySelectorAll('[data-k]').forEach(el => { (groups[el.dataset.k] = groups[el.dataset.k] || []).push(el); });
      Object.keys(groups).forEach(key => {
        const g = S[key] || { on: false, x: 0, y: 0, s: 1, o: null, c: '', t: null };
        const wasOn = P[key] && P[key].on;
        groups[key].forEach((el, idx) => {
          el.style.opacity = g.on ? (g.o === null ? '' : String(g.o)) : '0';
          el.style.transform = (g.x || g.y || g.s !== 1) ? 'translate(' + g.x + 'px,' + g.y + 'px) scale(' + g.s + ')' : '';
          el.style.transitionDelay = (!instant && g.on && !wasOn) ? Math.min(idx, 14) * 70 + 'ms' : '0ms';
          if (el._dyn !== g.c) {
            if (el._dyn) el._dyn.split(' ').forEach(c => el.classList.remove(c));
            if (g.c) g.c.split(' ').forEach(c => el.classList.add(c));
            el._dyn = g.c;
          }
          if (g.t !== null && el.textContent !== g.t) el.textContent = g.t;
          el.style.pointerEvents = g.on ? '' : 'none';
        });
      });
      if (instant) { void svg.getBoundingClientRect(); requestAnimationFrame(() => svg && svg.classList.remove('instant')); }
    }
    function setSub(html) {
      const span = subEl.querySelector('span');
      if (span.innerHTML === html) return;
      subEl.classList.add('swap');
      setTimeout(() => { span.innerHTML = html; subEl.classList.remove('swap'); }, REDUCED ? 0 : 160);
    }
    function setTitle(s) {
      const b = titleEl.querySelector('b'), i = titleEl.querySelector('i');
      if (b.innerHTML === s.t) return;
      titleEl.classList.add('swap');
      setTimeout(() => { b.innerHTML = s.t; i.innerHTML = s.en || ''; titleEl.classList.remove('swap'); }, REDUCED ? 0 : 200);
    }
    function render(prevSc, prevSt) {
      const s = scenes[sc];
      const sceneChanged = built !== sc;
      if (sceneChanged) {
        const old = svg;
        svg = build(sc); built = sc;
        const enter = () => {
          art.innerHTML = ''; art.appendChild(svg);
          /* 往前進入新段落：先全部藏起來，再淡入第一步；往回跳：直接停在目標那一步 */
          const forward = prevSc < sc && st === 0;
          if (forward) { const keep = st; st = -1; apply(true, -1); st = keep; requestAnimationFrame(() => requestAnimationFrame(() => apply(false, -1))); }
          else apply(true, -1);
        };
        if (old && !REDUCED) { old.classList.add('leave'); setTimeout(enter, 260); } else enter();
        setTitle(s);
      } else {
        apply(Math.abs(st - prevSt) > 1, prevSt);
      }
      setSub(s.steps[st].sub);
      /* 進度 */
      prog.querySelectorAll('i').forEach((seg, i) => {
        const f = i < sc ? 1 : i > sc ? 0 : (st + 1) / scenes[i].steps.length;
        seg.firstChild.style.width = (f * 100) + '%';
      });
      const done = scenes.slice(0, sc).reduce((n, x) => n + x.steps.length, 0) + st + 1;
      $('.st-count').textContent = done + ' / ' + total;
      $('[data-b="prev"]').disabled = sc === 0 && st === 0;
      ended = sc === scenes.length - 1 && st === s.steps.length - 1;
      $('.st-end').classList.toggle('show', ended);
      $('[data-b="next"]').disabled = ended;
      lsSet(LS, sc + ':' + st);
      schedule();
    }
    function go(i, j) {
      i = Math.max(0, Math.min(scenes.length - 1, i));
      j = Math.max(0, Math.min(scenes[i].steps.length - 1, j));
      const ps = sc, pt = st;
      sc = i; st = j;
      render(ps, pt);
      /* 使用者真的看到這個畫面了（載入時還原進度不算），給學習紀錄用 */
      root.dispatchEvent(new CustomEvent('story:view', { detail: { i: sc, t: scenes[sc].t } }));
    }
    function next() {
      hideHint();
      if (st < scenes[sc].steps.length - 1) go(sc, st + 1);
      else if (sc < scenes.length - 1) go(sc + 1, 0);
      else setPlay(false);
    }
    function prev() {
      hideHint();
      if (st > 0) go(sc, st - 1);
      else if (sc > 0) go(sc - 1, scenes[sc - 1].steps.length - 1);
    }
    function hideHint() { if (!hint.classList.contains('gone')) { hint.classList.add('gone'); lsSet('ee-story-hint', '1'); } }

    /* 自動播放：字越多停越久 */
    function dwell() {
      const p = scenes[sc].steps[st];
      if (p.dur) return p.dur;
      const n = String(p.sub).replace(/<[^>]+>/g, '').length;
      return Math.max(2200, Math.min(7000, 900 + n * 140));      /* 約每秒 7 個字，再加 0.9 秒看圖 */
    }
    function schedule() {
      clearTimeout(timer);
      if (!playing) return;
      if (ended) { setPlay(false); return; }
      timer = setTimeout(next, dwell());
    }
    function setPlay(on) {
      playing = on;
      const b = $('[data-b="play"]');
      b.setAttribute('aria-pressed', String(on));
      b.innerHTML = (on ? '❚❚ <span class="lbl">暫停</span>' : '▶ <span class="lbl">自動播放</span>');
      if (on && ended) go(0, 0); else schedule();
    }

    /* ---------------- 輸入 ---------------- */
    let down = null;
    stage.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: Date.now() }; });
    stage.addEventListener('pointerup', e => {
      if (!down) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      const d0 = down; down = null;
      if (e.target.closest('button, a')) return;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { dx < 0 ? next() : prev(); return; }
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && Date.now() - d0.t < 600) {
        const r = stage.getBoundingClientRect();
        (e.clientX - r.left < r.width * 0.25) ? prev() : next();
      }
    });
    root.querySelector('.st-bar').addEventListener('click', e => {
      const b = e.target.closest('[data-b]'); if (!b) return;
      const a = b.dataset.b;
      if (a === 'prev') prev();
      else if (a === 'next') next();
      else if (a === 'play') setPlay(!playing);
      else if (a === 'list') toggleList();
      else if (a === 'full') toggleFull();
    });
    root.querySelector('[data-end="again"]').addEventListener('click', e => { e.stopPropagation(); go(0, 0); });
    const goBtn = root.querySelector('[data-end="go"]');
    if (goBtn) goBtn.addEventListener('click', () => { if (root.classList.contains('full')) toggleFull(); });

    function inView() {
      const r = root.getBoundingClientRect(), vh = window.innerHeight || 800;
      return r.top < vh * 0.6 && r.bottom > vh * 0.4;
    }
    document.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input, textarea, select, button')) return;
      if (!(root.classList.contains('full') || root.contains(document.activeElement) || inView())) return;
      /* 同一頁有好幾個故事（例題的圖解故事）：焦點在別的故事上就不要跟著動 */
      const fo = document.activeElement && document.activeElement.closest && document.activeElement.closest('.story');
      if (fo && fo !== root) return;
      if (!fo && !root.classList.contains('full') && document.querySelector('.story.full')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && root.contains(document.activeElement))) { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === 'Escape' && root.classList.contains('full')) toggleFull();
    });

    function toggleList() {
      const old = root.querySelector('.st-list');
      if (old) { old.remove(); return; }
      const box = document.createElement('div');
      box.className = 'st-list'; box.setAttribute('role', 'menu');
      box.innerHTML = '<button type="button" data-i="0" data-j="0"><i>↺</i>從頭開始</button>' +
        scenes.map((s, i) => '<button type="button" data-i="' + i + '" data-j="0" class="' + (i === sc ? 'on' : '') + '"><i>' + String(i + 1).padStart(2, '0') + '</i>' + s.t + '<small>' + (s.en || '') + '</small></button>').join('');
      box.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        e.stopPropagation(); box.remove(); go(+b.dataset.i, +b.dataset.j);
      });
      root.appendChild(box);
      setTimeout(() => document.addEventListener('pointerdown', function h(ev) {
        if (!box.contains(ev.target) && !ev.target.closest('[data-b="list"]')) { box.remove(); }
        document.removeEventListener('pointerdown', h);
      }), 0);
    }
    function toggleFull() {
      const on = !root.classList.contains('full');
      root.classList.toggle('full', on);
      document.body.classList.toggle('st-lock', on);
      $('[data-b="full"]').setAttribute('aria-pressed', String(on));
      if (on) root.focus();
    }

    /* 離開畫面時暫停自動播放 */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting && playing && !root.classList.contains('full')) setPlay(false); }), { threshold: 0.2 }).observe(root);
    }

    if (lsGet('ee-story-hint')) hint.classList.add('gone');
    const saved = (lsGet(LS) || '').split(':').map(Number);
    if (saved.length === 2 && scenes[saved[0]] && scenes[saved[0]].steps[saved[1]]) { sc = saved[0]; st = saved[1]; }
    render(-1, -1);
    const api = { go, next, prev, setPlay, get pos() { return [sc, st]; }, scenes };
    root.__story = api;
    root.dispatchEvent(new CustomEvent('story:ready'));
    return api;
  }

  window.__Story = Story;
  window.__Story.draw = D;
})();
