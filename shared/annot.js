/* ============================================================
   直接在講義上寫：筆／螢光筆／橡皮擦／便條紙／題目下面「＋ 新增空間」
   ------------------------------------------------------------
   - 右下角「✍ 寫筆記」進入筆記模式：Apple Pencil（或滑鼠）寫字，手指照常捲動、按按鈕；
     按「手指也能畫」才讓手指寫。
   - 筆跡「跟著段落走」：每一筆記在它開始的那一段（段落、公式、圖、題目卡片…）上，
     座標存成「那一段寬度的比例」(×1000 的整數)。換螢幕寬度時跟著縮放；
     那一段的換行改變時可能稍微偏一點（使用者同意的取捨）。
   - 便條：可拖曳、可縮小、可打字或手寫；筆記模式外也看得到。
   - 新增空間：只在題目／例題（作業卡、課本題、測驗、可改數字例題）下面；筆記模式才出現按鈕，
     新增的空間平常也看得到。
   - 自動儲存（__SYNC：這台裝置＋claude.ai 帳號），每一筆都可以刪；「清除本頁」一次清光。
   資料：s:<id> 筆跡 {a 錨點, k 顏色, p [x,y,x,y…]}；n:<id> 便條 {a,x,y,txt,ink,mode,min}；sp:<id> 空間 {a,ink,c}
   錨點 key：'<最近有 id 的祖先>:<第幾個區塊>'（-1 表示就是那個有 id 的元素）
   ============================================================ */
(function () {
  'use strict';
  const main = document.querySelector('main');
  if (!main || !window.__SYNC || document.getElementById('mk-book') || document.documentElement.classList.contains('embed')) return;

  const seg = location.pathname.split('/').filter(Boolean);
  const PAGE = (seg.length > 1 ? seg[seg.length - 2] : 'root') + '/' + (seg[seg.length - 1] || 'index.html').replace(/\.html?$/, '');
  const store = __SYNC.open('ann_' + PAGE);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------- 錨點 ---------- */
  const ATOM = '.quiz, .bench, .example, .hw-card, .xb-card, #story, .story, .glossary, table, figure, .eq, .board, .sec-pick, .pad';
  const BLOCK = 'p, li, h1, h2, h3, h4, dt, dd, blockquote, .derive, .howto, .pitfall, .note, .lede, .hero, .chips, .hero-meta, section';
  const ALL = ATOM + ', ' + BLOCK;
  const EXCL = '.ann-layer, .ann-spaces, .ann-add, .ann-bar, .ann-fab, .trk-row, .trk-sum, .trk-list, .trk-b, #mistakes, .mk-list, .term-pop';
  function idBase(el) { const b = el.parentElement && el.parentElement.closest('[id]'); return b && main.contains(b) ? b : main; }
  function list(base) {
    return Array.prototype.filter.call(base.querySelectorAll(ALL), x => {
      if (x.closest(EXCL)) return false;
      const at = x.parentElement && x.parentElement.closest(ATOM);
      return !at || !base.contains(at) || at === base;
    });
  }
  function anchorAt(t) {
    if (!t || !t.closest || !main.contains(t)) return main;
    const ex = t.closest(EXCL); if (ex) t = ex.parentElement || main;
    let a = null;
    for (let x = t.closest(ATOM); x && main.contains(x); x = x.parentElement && x.parentElement.closest(ATOM)) a = x;  /* 最外層的 atom */
    return a || t.closest(BLOCK) || main;
  }
  function keyOf(el) {
    if (el === main) return 'main:-1';
    if (el.id) return el.id + ':-1';
    const base = idBase(el);
    return (base === main ? 'main' : base.id) + ':' + list(base).indexOf(el);
  }
  function resolve(key) {
    const i = key.lastIndexOf(':'), id = key.slice(0, i), n = +key.slice(i + 1);
    const base = id === 'main' ? main : document.getElementById(id);
    if (!base || !main.contains(base)) return null;
    return n < 0 ? base : list(base)[n] || null;
  }
  const shown = el => el && el.getClientRects().length > 0;

  /* ---------- 圖層 ---------- */
  main.classList.add('ann-host');
  const layer = document.createElement('div'); layer.className = 'ann-layer';
  layer.innerHTML = '<svg class="ann-svg" xmlns="http://www.w3.org/2000/svg"></svg><div class="ann-notes"></div>';
  main.appendChild(layer);
  const svg = layer.querySelector('svg'), notesBox = layer.querySelector('.ann-notes');
  const live = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  /* ---------- 工具列 ---------- */
  const fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'ann-fab'; fab.innerHTML = '✍ <span>寫筆記</span>';
  fab.title = '在講義上直接寫字、畫重點、貼便條';
  const bar = document.createElement('div'); bar.className = 'ann-bar'; bar.hidden = true;
  bar.innerHTML =
    '<div class="ann-tools">' +
      '<button type="button" data-tool="pen" data-k="0" class="on" title="黑筆"><i class="dot k0"></i>筆</button>' +
      '<button type="button" data-tool="pen" data-k="1" title="藍筆"><i class="dot k1"></i></button>' +
      '<button type="button" data-tool="pen" data-k="2" title="紅筆"><i class="dot k2"></i></button>' +
      '<button type="button" data-tool="pen" data-k="h" title="螢光筆"><i class="dot kh"></i>螢光</button>' +
      '<button type="button" data-tool="eraser" title="橡皮擦：碰到的那一筆整筆擦掉">⌫ 擦</button>' +
      '<button type="button" data-tool="note" title="點一下講義，貼一張便條">🗒 便條</button>' +
      '<button type="button" data-act="undo" title="復原">↶</button>' +
      '<button type="button" data-act="finger" title="讓手指也能寫（關掉時手指是捲動）">☝ 手指寫</button>' +
      '<button type="button" data-act="clear" title="清除這一頁所有筆跡、便條、新增的空間">🗑 清除本頁</button>' +
      '<button type="button" data-act="done" class="ann-done">完成</button>' +
    '</div><div class="ann-msg"></div>';
  document.body.appendChild(fab); document.body.appendChild(bar);
  const msg = bar.querySelector('.ann-msg');

  let on = false, tool = 'pen', color = '0', finger = false, penSeen = false;
  function setOn(v) {
    on = v; document.body.classList.toggle('ann-on', on); bar.hidden = !on; fab.hidden = on;
    if (on) say(penSeen ? '用 Apple Pencil 直接寫；手指照常捲動。' : '用 Apple Pencil 或滑鼠直接在講義上寫；手指照常捲動。');
  }
  function say(t) { msg.textContent = t + '　' + statusTxt(); }
  const statusTxt = () => (__SYNC.status() === 'on' ? '☁ 自動存到你的帳號' : __SYNC.status() === 'error' ? '⚠ 雲端同步失敗，先存在這台裝置' : '自動存在這台裝置');
  __SYNC.onStatus(() => { if (on) say(''); });
  fab.addEventListener('click', () => setOn(true));
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tool) {
      tool = b.dataset.tool; if (b.dataset.k) color = b.dataset.k;
      bar.querySelectorAll('[data-tool]').forEach(x => x.classList.toggle('on', x === b));
      say(tool === 'note' ? '點一下講義上要貼便條的地方。' : tool === 'eraser' ? '碰到哪一筆就整筆擦掉。' : '寫吧。');
    }
    const a = b.dataset.act;
    if (a === 'done') setOn(false);
    if (a === 'undo') undo();
    if (a === 'finger') { finger = !finger; b.classList.toggle('on', finger); document.body.classList.toggle('ann-finger', finger); say(finger ? '手指現在也會寫字；要捲動請再按一次「手指寫」。' : '手指恢復成捲動。'); }
    if (a === 'clear') {
      const ids = Object.keys(store.all());
      if (!ids.length) { say('這一頁還沒有筆記。'); return; }
      if (window.confirm('清除這一頁所有筆跡、便條和新增的空間？（' + ids.length + ' 筆）')) { store.delMany(ids); undoStack.length = 0; }
    }
  });

  /* ---------- 畫筆跡 ---------- */
  let drawn = [];   /* 目前畫面上每一筆的圖層座標，給橡皮擦用 */
  const Q = 1000;
  function render() {
    const L = layer.getBoundingClientRect(), rects = new Map(), all = store.all();
    const out = { h: [], p: [] }; drawn = [];
    Object.keys(all).forEach(id => {
      if (id.indexOf('s:') !== 0) return;
      const s = all[id];
      let r = rects.get(s.a);
      if (r === undefined) { const el = resolve(s.a); r = shown(el) ? el.getBoundingClientRect() : null; rects.set(s.a, r); }
      if (!r || !r.width) return;
      const ox = r.left - L.left, oy = r.top - L.top, sc = r.width / Q, pts = [];
      for (let i = 0; i + 1 < s.p.length; i += 2) pts.push([ox + s.p[i] * sc, oy + s.p[i + 1] * sc]);
      if (!pts.length) return;
      drawn.push({ id, pts });
      const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + (pts.length === 1 ? 'l0.1 0' : '');
      (s.k === 'h' ? out.h : out.p).push('<path class="ann-s k' + s.k + '" d="' + d + '"/>');
    });
    svg.innerHTML = out.h.join('') + out.p.join('');
    svg.setAttribute('width', layer.clientWidth); svg.setAttribute('height', layer.clientHeight);
    if (cur) svg.appendChild(live);
    renderNotes(L, all); renderSpaces(all);
  }
  let rT = 0; const later = () => { clearTimeout(rT); rT = setTimeout(render, 120); };

  let cur = null, erasing = false, suppress = 0;
  const skip = t => !t.closest || t.closest('.ann-bar, .ann-fab, .ann-note, .ann-space, .ann-add, .pad, .topbar, .term-pop, input, select, textarea');
  function lpos(e) { const L = layer.getBoundingClientRect(); return [e.clientX - L.left, e.clientY - L.top]; }
  document.addEventListener('pointerdown', e => {
    if (!on || e.button > 0 || skip(e.target) || !main.contains(e.target)) return;
    if (e.pointerType === 'pen') penSeen = true;
    if (tool === 'note') { e.preventDefault(); e.stopPropagation(); suppress = Date.now(); addNote(e); return; }
    if (e.pointerType === 'touch' && !finger) return;
    e.preventDefault(); e.stopPropagation(); suppress = Date.now();
    if (tool === 'eraser') { erasing = true; eraseAt(lpos(e)); return; }
    const el = anchorAt(e.target), r = el.getBoundingClientRect();
    if (!r.width) return;
    cur = { el, a: keyOf(el), r, p: [], pid: e.pointerId };
    live.setAttribute('class', 'ann-s k' + color); svg.appendChild(live);
    addPt(e);
  }, { capture: true, passive: false });
  function addPt(e) {
    const r = cur.el.getBoundingClientRect(), sc = Q / r.width;
    const x = Math.round((e.clientX - r.left) * sc), y = Math.round((e.clientY - r.top) * sc), n = cur.p.length;
    if (n && Math.abs(cur.p[n - 2] - x) + Math.abs(cur.p[n - 1] - y) < 2) return;
    cur.p.push(x, y);
    const L = layer.getBoundingClientRect(), ox = r.left - L.left, oy = r.top - L.top, k = r.width / Q;
    let d = ''; for (let i = 0; i < cur.p.length; i += 2) d += (i ? 'L' : 'M') + (ox + cur.p[i] * k).toFixed(1) + ' ' + (oy + cur.p[i + 1] * k).toFixed(1);
    live.setAttribute('d', d + (cur.p.length === 2 ? 'l0.1 0' : ''));
  }
  document.addEventListener('pointermove', e => {
    if (cur && e.pointerId === cur.pid) { e.preventDefault(); (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach(addPt); }
    else if (erasing) { e.preventDefault(); eraseAt(lpos(e)); }
  }, { capture: true, passive: false });
  function end(e) {
    if (erasing) { erasing = false; return; }
    if (!cur || (e && e.pointerId !== cur.pid)) return;
    const s = { a: cur.a, k: color, p: cur.p }; cur = null; live.remove();
    if (s.p.length) { const id = 's:' + uid(); store.put(id, s); undoStack.push({ add: id }); }
  }
  document.addEventListener('pointerup', end, true);
  document.addEventListener('pointercancel', end, true);
  /* 剛剛在按鈕上畫了一筆 → 擋掉放開時的 click，不要誤觸 */
  document.addEventListener('click', e => { if (suppress && Date.now() - suppress < 600 && !skip(e.target)) { e.preventDefault(); e.stopPropagation(); } suppress = 0; }, true);
  /* iPad：Pencil 碰到畫面時擋掉捲動與選字（手指照常） */
  const stylus = e => {
    if (!on || skip(e.target) || !main.contains(e.target)) return;
    if (finger || Array.prototype.some.call(e.touches, t => t.touchType === 'stylus')) e.preventDefault();
  };
  document.addEventListener('touchstart', stylus, { passive: false });
  document.addEventListener('touchmove', stylus, { passive: false });

  function eraseAt(q) {
    const hit = drawn.filter(d => d.pts.some((p, i) => {
      if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 10) return true;
      const o = d.pts[i - 1]; if (!o) return false;
      const dx = p[0] - o[0], dy = p[1] - o[1], L2 = dx * dx + dy * dy; if (!L2) return false;
      const t = Math.max(0, Math.min(1, ((q[0] - o[0]) * dx + (q[1] - o[1]) * dy) / L2));
      return Math.hypot(o[0] + t * dx - q[0], o[1] + t * dy - q[1]) < 8;
    }));
    hit.forEach(h => { const data = store.get(h.id); if (data) { undoStack.push({ del: h.id, data }); store.del(h.id); } });
  }
  const undoStack = [];
  function undo() {
    const u = undoStack.pop(); if (!u) { say('沒有可以復原的了。'); return; }
    if (u.add) store.del(u.add); else if (u.del) { const d = Object.assign({}, u.data); delete d.t; store.put(u.del, d); }
  }

  /* ---------- 小工具：手寫板資料（存的時候把小數縮短，省空間） ---------- */
  const slim = st => ({ h: +st.h.toFixed(2), strokes: st.strokes.map(s => ({ p: s.p.map(q => [+q[0].toFixed(4), +q[1].toFixed(4), +(q[2] || 0.5).toFixed(2)]) })) });
  function patch(id, f) { const cur0 = store.get(id); if (!cur0) return; const d = Object.assign({}, cur0); delete d.t; f(d); store.put(id, d); }

  /* ---------- 便條 ---------- */
  const noteEls = {};
  function addNote(e) {
    const el = anchorAt(e.target), r = el.getBoundingClientRect(); if (!r.width) return;
    const id = 'n:' + uid();
    store.put(id, { a: keyOf(el), x: Math.round((e.clientX - r.left) * Q / r.width), y: Math.round((e.clientY - r.top) * Q / r.width), txt: '', mode: 'txt', min: 0 });
    undoStack.push({ add: id });
    const pen = bar.querySelector('[data-tool="pen"][data-k="' + color + '"]'); if (pen) pen.click();
    setTimeout(() => { const n = noteEls[id]; if (n) n.querySelector('textarea').focus(); }, 160);
  }
  function makeNote(id) {
    const n = document.createElement('div'); n.className = 'ann-note'; n.dataset.id = id;
    n.innerHTML = '<div class="ann-note-bar"><span class="ann-grip" title="拖曳移動">⠿ 便條</span>' +
      '<button type="button" data-n="mode"></button><button type="button" data-n="min" title="縮小">–</button>' +
      '<button type="button" data-n="del" title="刪除這張便條">✕</button></div>' +
      '<textarea rows="3" placeholder="打字…（自動儲存）"></textarea><div class="ann-note-pad"></div>' +
      '<button type="button" class="ann-note-mini" title="打開便條">🗒</button>';
    const ta = n.querySelector('textarea'); let tT = 0;
    ta.addEventListener('input', () => { clearTimeout(tT); tT = setTimeout(() => patch(id, d => { d.txt = ta.value; }), 500); });
    ta.addEventListener('blur', () => { clearTimeout(tT); const s = store.get(id); if (s && s.txt !== ta.value) patch(id, d => { d.txt = ta.value; }); });
    n.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const s = store.get(id); if (!s) return;
      if (b.dataset.n === 'del') {
        const has = (s.txt && s.txt.trim()) || (s.ink && s.ink.strokes && s.ink.strokes.length);
        if (!has || window.confirm('刪除這張便條？')) { undoStack.push({ del: id, data: s }); store.del(id); }
      }
      if (b.dataset.n === 'min') patch(id, d => { d.min = 1; });
      if (b.classList.contains('ann-note-mini')) patch(id, d => { d.min = 0; });
      if (b.dataset.n === 'mode') patch(id, d => { d.mode = d.mode === 'ink' ? 'txt' : 'ink'; });
    });
    /* 拖曳：放開時重新找「底下是哪一段」當錨點 */
    const grip = n.querySelector('.ann-grip');
    grip.addEventListener('pointerdown', e => {
      e.preventDefault(); grip.setPointerCapture(e.pointerId);
      const L = layer.getBoundingClientRect(), r0 = n.getBoundingClientRect(), dx = e.clientX - r0.left, dy = e.clientY - r0.top;
      const mv = ev => { n.style.left = (ev.clientX - dx - L.left) + 'px'; n.style.top = (ev.clientY - dy - L.top) + 'px'; };
      const up = ev => {
        grip.removeEventListener('pointermove', mv); grip.removeEventListener('pointerup', up); grip.removeEventListener('pointercancel', up);
        const x = ev.clientX - dx, y = ev.clientY - dy;
        n.style.visibility = 'hidden';
        const under = document.elementsFromPoint(Math.max(1, x), Math.max(1, y)).find(t => main.contains(t) && !layer.contains(t)) || main;
        n.style.visibility = '';
        const el = anchorAt(under), r = el.getBoundingClientRect(); if (!r.width) return;
        patch(id, d => { d.a = keyOf(el); d.x = Math.round((x - r.left) * Q / r.width); d.y = Math.round((y - r.top) * Q / r.width); });
      };
      grip.addEventListener('pointermove', mv); grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
    });
    notesBox.appendChild(n); noteEls[id] = n;
    return n;
  }
  function renderNotes(L, all) {
    const W = layer.clientWidth, live2 = {};
    Object.keys(all).forEach(id => {
      if (id.indexOf('n:') !== 0) return;
      const s = all[id], el = resolve(s.a); live2[id] = 1;
      const n = noteEls[id] || makeNote(id);
      if (!shown(el)) { n.hidden = true; return; }
      n.hidden = false;
      const r = el.getBoundingClientRect(), k = r.width / Q, w = Math.min(250, W - 4);
      n.style.width = s.min ? '' : w + 'px';
      n.style.left = Math.max(0, Math.min(W - (s.min ? 40 : w), r.left - L.left + s.x * k)) + 'px';
      n.style.top = Math.max(0, r.top - L.top + s.y * k) + 'px';
      n.classList.toggle('min', !!s.min); n.classList.toggle('ink', s.mode === 'ink');
      n.querySelector('[data-n="mode"]').textContent = s.mode === 'ink' ? '⌨ 打字' : '✎ 手寫';
      const ta = n.querySelector('textarea');
      if (document.activeElement !== ta && ta.value !== (s.txt || '')) ta.value = s.txt || '';
      if (s.mode === 'ink') {
        if (!n.__pad) n.__pad = __PAD.mount(n.querySelector('.ann-note-pad'), id, { h: 0.7, load: () => (store.get(id) || {}).ink, save: st => patch(id, d => { d.ink = slim(st); }) });
        else n.__pad.reload();
      }
    });
    Object.keys(noteEls).forEach(id => { if (!live2[id]) { noteEls[id].remove(); delete noteEls[id]; } });
  }

  /* ---------- 題目／例題下面的「新增空間」 ---------- */
  const TARGET = '.hw-card[id], .xb-card[id], .quiz[id], .example[id]';
  const spaceEls = {};
  function boxFor(t) {
    let box = t.nextElementSibling;
    if (box && box.classList.contains('ann-spaces') && box.dataset.for === t.id) return box;
    box = document.createElement('div'); box.className = 'ann-spaces'; box.dataset.for = t.id;
    box.innerHTML = '<div class="ann-sp-list"></div><button type="button" class="ann-add">＋ 新增空間（在這題下面手寫）</button>';
    box.querySelector('.ann-add').addEventListener('click', () => {
      const id = 'sp:' + uid(); store.put(id, { a: t.id, c: Date.now() }); undoStack.push({ add: id });
    });
    t.after(box);
    return box;
  }
  function renderSpaces(all) {
    const alive = {};
    main.querySelectorAll(TARGET).forEach(t => { if (!t.closest('.ann-spaces')) boxFor(t); });
    Object.keys(all).filter(id => id.indexOf('sp:') === 0).sort((a, b) => (all[a].c || 0) - (all[b].c || 0)).forEach(id => {
      const s = all[id], t = document.getElementById(s.a); if (!t) return;
      const listEl = boxFor(t).querySelector('.ann-sp-list'); alive[id] = 1;
      let el = spaceEls[id];
      if (!el) {
        el = document.createElement('div'); el.className = 'ann-space'; el.dataset.id = id;
        el.innerHTML = '<div class="ann-space-head"><span>📝 我的空間 · 自動儲存</span><button type="button" title="刪除這塊空間">✕ 刪除</button></div><div class="ann-space-pad"></div>';
        el.querySelector('button').addEventListener('click', () => {
          const d = store.get(id); if (!d) return;
          if (!(d.ink && d.ink.strokes && d.ink.strokes.length) || window.confirm('刪除這塊空間和裡面寫的東西？')) { undoStack.push({ del: id, data: d }); store.del(id); }
        });
        spaceEls[id] = el;
        el.__pad = __PAD.mount(el.querySelector('.ann-space-pad'), id, { h: 0.45, load: () => (store.get(id) || {}).ink, save: st => patch(id, d => { d.ink = slim(st); }) });
      } else el.__pad.reload();
      if (el.parentElement !== listEl) listEl.appendChild(el);
    });
    Object.keys(spaceEls).forEach(id => { if (!alive[id]) { spaceEls[id].remove(); delete spaceEls[id]; } });
  }

  /* ---------- 什麼時候要重畫 ---------- */
  store.on(remote => { if (!cur) render(); });
  new ResizeObserver(later).observe(main);
  new MutationObserver(ms => { if (ms.some(m => !layer.contains(m.target) && !(m.target.closest && m.target.closest('.ann-space, .ann-note, #story, .bench')))) later(); })
    .observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open', 'class'] });
  document.addEventListener('toggle', later, true);
  window.addEventListener('load', later);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  render();
  window.__ANN = { store, render, setOn, keyOf, resolve, anchorAt };
})();
