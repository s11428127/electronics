/* ============================================================
   直接在講義上寫：筆（鋼筆／原子筆／畫筆）、螢光筆、橡皮擦、便條（手寫）、題目下面「＋ 新增空間」
   ------------------------------------------------------------
   - 右下「✍ 寫筆記」進入筆記模式，上方出現工具列（復原／重做、工具、粗細、顏色）。
     再點一次「筆」或 ▾ 打開筆的設定：種類、粗細（0.2～4 px）、筆畫穩定（0～100%）。
   - Apple Pencil（或滑鼠）寫字，手指照常捲動、按按鈕；「☝」讓手指也能寫。
   - 切橡皮擦：兩指在畫面上點一下（Pencil 側邊連點兩下網頁收不到，Apple 只給原生 App）；
     有橡皮擦鍵的觸控筆（按著鍵寫）也會直接擦。
   - 筆跡「跟著段落走」：每一筆記在開始的那一段上，座標 = 那段寬度的比例 × z（新的 z = 10000）。
   - 便條、新增空間都是一塊「可以寫的區域」，用同一支筆寫；它們本身也是錨點（id = ann-nb-* / ann-sp-*）。
   - 儲存：__SYNC（這台裝置＋claude.ai 帳號）。每一筆都能擦／刪，「清除本頁」一次清光，可復原。
   資料：s:<id> 筆跡 {a 錨點, y 種類 b|f|r|h（t 是同步用的時間，不能拿來用）, c 顏色, w 粗細 px, z, p [x,y,…], r [壓力 0–99…]}
         n:<id> 便條 {a, x, y, h 高寬比, min}；sp:<id> 空間 {a 題目 id, c 建立時間, h 高寬比}
   舊格式（第一版）：s {a, k, p}，z = 1000。
   ============================================================ */
(function () {
  'use strict';
  const main = document.querySelector('main');
  if (!main || !window.__SYNC || document.getElementById('mk-book') || document.documentElement.classList.contains('embed')) return;

  const seg = location.pathname.split('/').filter(Boolean);
  const PAGE = (seg.length > 1 ? seg[seg.length - 2] : 'root') + '/' + (seg[seg.length - 1] || 'index.html').replace(/\.html?$/, '');
  const store = __SYNC.open('ann_' + PAGE);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const Z = 10000;

  /* ---------- 筆的設定（存在這台裝置） ---------- */
  const TYPES = { f: '鋼筆', b: '原子筆', r: '畫筆' };
  const PRESET = { pen: [0.4, 0.8, 1.5], hl: [8, 14, 22] };
  const COLORS = ['0', '1', '2', '3', '4', '5'];
  let cfg = { tool: 'pen', type: 'b', color: { pen: '0', hl: '5' }, w: { pen: 0.8, hl: 14 }, stab: 30 };
  try { const s = JSON.parse(localStorage.getItem('ee-pen') || 'null'); if (s) cfg = Object.assign(cfg, s, { tool: 'pen' }); } catch (e) {}
  const saveCfg = () => { try { localStorage.setItem('ee-pen', JSON.stringify(cfg)); } catch (e) {} };
  const kindOf = () => (cfg.tool === 'hl' ? 'hl' : 'pen');

  /* ---------- 錨點 ---------- */
  const ATOM = '.quiz, .bench, .example, .hw-card, .xb-card, #story, .story, .glossary, table, figure, .eq, .board, .sec-pick, .pad';
  const BLOCK = 'p, li, h1, h2, h3, h4, dt, dd, blockquote, .derive, .howto, .pitfall, .note, .lede, .hero, .chips, .hero-meta, section';
  const ALL = ATOM + ', ' + BLOCK;
  const EXCL = '.ann-layer, .ann-spaces, .ann-add, .trk-row, .trk-sum, .trk-list, .trk-b, #mistakes, .mk-list, .term-pop';
  const AREA = '.ann-space-body, .ann-note-body';
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
    const area = t.closest(AREA); if (area) return area;
    const ex = t.closest(EXCL); if (ex) t = ex.parentElement || main;
    let a = null;
    for (let x = t.closest(ATOM); x && main.contains(x); x = x.parentElement && x.parentElement.closest(ATOM)) a = x;
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
  layer.innerHTML = '<div class="ann-notes"></div><svg class="ann-svg" xmlns="http://www.w3.org/2000/svg"></svg>';
  main.appendChild(layer);
  const svg = layer.querySelector('svg'), notesBox = layer.querySelector('.ann-notes');
  const live = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  /* ---------- 筆跡 → SVG ---------- */
  const f1 = v => Math.round(v * 10) / 10;
  function center(pts) {   /* 經過中點的二次曲線，線條比較圓滑 */
    if (pts.length === 1) return 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]) + 'l0.01 0';
    let d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) d += 'Q' + f1(pts[i][0]) + ' ' + f1(pts[i][1]) + ' ' + f1((pts[i][0] + pts[i + 1][0]) / 2) + ' ' + f1((pts[i][1] + pts[i + 1][1]) / 2);
    const z = pts[pts.length - 1]; return d + 'L' + f1(z[0]) + ' ' + f1(z[1]);
  }
  function widthAt(t, w, pr, i, n) {
    if (t === 'f') return w * (0.35 + 1.3 * pr);
    const taper = Math.min(1, (i + 1) / 4, (n - i) / 4);
    return w * (0.15 + 2.1 * pr) * (0.35 + 0.65 * taper);
  }
  function outline(pts, t, w) {   /* 鋼筆／畫筆：粗細跟著壓力變，畫成一個填色的外框 */
    const n = pts.length, ws = pts.map((p, i) => Math.max(0.15, widthAt(t, w, p[2], i, n)));
    if (n === 1) { const r = ws[0] / 2, p = pts[0]; return 'M' + f1(p[0] - r) + ' ' + f1(p[1]) + 'a' + r + ' ' + r + ' 0 1 0 ' + f1(2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + f1(-2 * r) + ' 0Z'; }
    const L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
      const h = ws[i] / 2; L.push([pts[i][0] - ty * h, pts[i][1] + tx * h]); R.push([pts[i][0] + ty * h, pts[i][1] - tx * h]);
    }
    const pt = p => f1(p[0]) + ' ' + f1(p[1]), re = f1(ws[n - 1] / 2), rs = f1(ws[0] / 2);
    return 'M' + L.map(pt).join('L') + 'A' + re + ' ' + re + ' 0 0 1 ' + pt(R[n - 1]) + 'L' + R.reverse().map(pt).join('L') + 'A' + rs + ' ' + rs + ' 0 0 1 ' + pt(L[0]) + 'Z';
  }
  const norm = s => ({ t: s.y || (s.k === 'h' ? 'h' : 'b'), c: s.c != null ? s.c : (s.k === 'h' ? '5' : String(s.k || 0)), w: s.w || (s.k === 'h' ? 15 : 2.2), z: s.z || 1000 });
  function pathOf(n, pts) {
    if (n.t === 'b' || n.t === 'h') return '<path class="ann-u ' + (n.t === 'h' ? 'ann-h ' : '') + 'c' + n.c + '" stroke-width="' + n.w + '" d="' + center(pts) + '"/>';
    return '<path class="ann-o c' + n.c + '" d="' + outline(pts, n.t, n.w) + '"/>';
  }
  function setLive(n, pts) { const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); tmp.innerHTML = pathOf(n, pts); const q = tmp.firstChild; live.setAttribute('class', q.getAttribute('class')); live.setAttribute('d', q.getAttribute('d')); if (q.getAttribute('stroke-width')) live.setAttribute('stroke-width', q.getAttribute('stroke-width')); else live.removeAttribute('stroke-width'); }

  let drawn = [];
  function render() {
    rafOn = false;
    const L = layer.getBoundingClientRect(), rects = new Map(), all = store.all();
    const hl = [], pen = []; drawn = [];
    renderNotes(L, all); renderSpaces(all);
    Object.keys(all).forEach(id => {
      if (id.indexOf('s:') !== 0) return;
      const s = all[id], n = norm(s);
      let r = rects.get(s.a);
      if (r === undefined) { const el = resolve(s.a); r = shown(el) ? el.getBoundingClientRect() : null; rects.set(s.a, r); }
      if (!r || !r.width || !s.p || !s.p.length) return;
      const ox = r.left - L.left, oy = r.top - L.top, sc = r.width / n.z, pts = [];
      for (let i = 0; i + 1 < s.p.length; i += 2) pts.push([ox + s.p[i] * sc, oy + s.p[i + 1] * sc, s.r ? s.r[i / 2] / 99 : 0.5]);
      drawn.push({ id, pts, rad: Math.max(7, n.w / 2 + 4) });
      (n.t === 'h' ? hl : pen).push(pathOf(n, pts));
    });
    svg.innerHTML = hl.join('') + pen.join('');
    if (cur) svg.appendChild(live);
  }
  let rafOn = false;
  const schedule = () => { if (!rafOn) { rafOn = true; requestAnimationFrame(render); } };
  let rT = 0; const later = () => { clearTimeout(rT); rT = setTimeout(schedule, 120); };

  /* ---------- 復原／重做（一個動作可以包含好幾筆） ---------- */
  const hist = [], fut = []; let tx = null;
  const clean = d => { if (!d) return null; const o = Object.assign({}, d); delete o.t; return o; };
  function begin() { tx = {}; }
  function rec(id) { if (tx && !(id in tx)) tx[id] = [clean(store.get(id)), null]; }
  function put(id, d) { rec(id); store.put(id, d); if (tx) tx[id][1] = clean(d); }
  function del(id) { rec(id); store.del(id); if (tx) tx[id][1] = null; }
  function commit() { if (tx && Object.keys(tx).length) { hist.push(tx); fut.length = 0; if (hist.length > 200) hist.shift(); } tx = null; paintBar(); }
  function apply(t, side) { Object.keys(t).forEach(id => { const v = t[id][side]; if (v) store.put(id, v); else store.del(id); }); }
  function undo() { const t = hist.pop(); if (!t) return toast('沒有可以復原的了'); apply(t, 0); fut.push(t); paintBar(); }
  function redo() { const t = fut.pop(); if (!t) return toast('沒有可以重做的了'); apply(t, 1); hist.push(t); paintBar(); }
  /* 刪掉便條／空間時，寫在上面的筆跡一起刪 */
  function delArea(id, bodyId) { const all = store.all(); begin(); del(id); Object.keys(all).forEach(k => { if (k.indexOf('s:') === 0 && all[k].a === bodyId + ':-1') del(k); }); commit(); }

  /* ---------- 工具列 ---------- */
  const fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'ann-fab'; fab.innerHTML = '✍ <span>寫筆記</span>';
  fab.title = '在講義上直接寫字、畫重點、貼便條';
  const bar = document.createElement('div'); bar.className = 'ann-bar'; bar.hidden = true;
  bar.innerHTML =
    '<div class="ann-row">' +
      '<span class="ann-grp"><button type="button" data-act="undo" title="復原">↶</button><button type="button" data-act="redo" title="重做">↷</button></span>' +
      '<span class="ann-grp">' +
        '<button type="button" data-tool="pen" title="筆（再點一次調整種類、粗細、穩定度）">✒︎<small>筆</small><i class="ann-caret">▾</i></button>' +
        '<button type="button" data-tool="hl" title="螢光筆（再點一次調粗細）">🖍<small>螢光</small></button>' +
        '<button type="button" data-tool="eraser" title="橡皮擦：碰到的那一筆整筆擦掉（兩指點一下也能切換）">⌫<small>擦</small></button>' +
        '<button type="button" data-tool="note" title="點一下講義，貼一張便條">🗒<small>便條</small></button>' +
      '</span>' +
      '<span class="ann-grp ann-ws">' + [0, 1, 2].map(i => '<button type="button" data-w="' + i + '" title="粗細"><i></i></button>').join('') + '</span>' +
      '<span class="ann-grp ann-cs">' + COLORS.map(c => '<button type="button" data-c="' + c + '" title="顏色"><i class="c' + c + '"></i></button>').join('') + '</span>' +
      '<span class="ann-grp">' +
        '<button type="button" data-act="finger" title="讓手指也能寫（關掉時手指是捲動）">☝</button>' +
        '<button type="button" data-act="clear" title="清除這一頁所有筆跡、便條、新增的空間">🗑</button>' +
        '<button type="button" data-act="done" class="ann-done">完成</button>' +
      '</span>' +
    '</div>';
  const pop = document.createElement('div'); pop.className = 'ann-pop'; pop.hidden = true;
  const tst = document.createElement('div'); tst.className = 'ann-toast'; tst.hidden = true;
  [fab, bar, pop, tst].forEach(x => document.body.appendChild(x));

  let on = false, finger = false, penSeen = false, prevTool = 'pen', tT = 0;
  function toast(t, ms) { tst.textContent = t; tst.hidden = false; clearTimeout(tT); tT = setTimeout(() => { tst.hidden = true; }, ms || 2200); }
  const statusTxt = () => (__SYNC.status() === 'on' ? '☁ 自動存到你的帳號' : __SYNC.status() === 'error' ? '⚠ 雲端同步失敗，先存在這台裝置' : '自動存在這台裝置');
  function setOn(v) {
    on = v; document.body.classList.toggle('ann-on', on); bar.hidden = !on; fab.hidden = on; pop.hidden = true;
    if (on) { paintBar(); toast('Pencil 直接寫，手指捲動；兩指點一下切換橡皮擦。' + statusTxt(), 3500); }
  }
  function setTool(t) { if (t !== 'eraser') prevTool = t === 'note' ? prevTool : t; cfg.tool = t; saveCfg(); paintBar(); }
  function paintBar() {
    bar.querySelectorAll('[data-tool]').forEach(b => b.classList.toggle('on', b.dataset.tool === cfg.tool));
    const k = kindOf(), ws = PRESET[k];
    bar.querySelectorAll('[data-w]').forEach(b => {
      const w = ws[+b.dataset.w]; b.querySelector('i').style.height = Math.max(1, Math.min(10, k === 'hl' ? w / 2.4 : w * 2.4)) + 'px';
      b.classList.toggle('on', Math.abs(cfg.w[k] - w) < 0.05);
    });
    bar.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === cfg.color[k] && (cfg.tool === 'pen' || cfg.tool === 'hl')));
    bar.querySelector('[data-act="undo"]').disabled = !hist.length; bar.querySelector('[data-act="redo"]').disabled = !fut.length;
    bar.querySelector('[data-act="finger"]').classList.toggle('on', finger);
  }
  /* 筆的設定面板（像 GoodNotes）：種類、粗細、筆畫穩定 */
  function openPop(kind) {
    const isPen = kind === 'pen';
    pop.innerHTML = '<b class="ann-pop-t">' + (isPen ? TYPES[cfg.type] : '螢光筆') + '</b>' +
      '<svg class="ann-prev" viewBox="0 0 280 70"></svg>' +
      (isPen ? '<div class="ann-types">' + Object.keys(TYPES).map(t => '<button type="button" data-type="' + t + '" class="' + (cfg.type === t ? 'on' : '') + '"><b>' + ({ f: '✒︎', b: '🖊', r: '🖌' })[t] + '</b><span>' + TYPES[t] + '</span></button>').join('') + '</div>' : '') +
      '<label class="ann-sl"><span>粗細</span><b data-v="w"></b><input type="range" data-s="w" min="' + (isPen ? 0.2 : 4) + '" max="' + (isPen ? 4 : 30) + '" step="' + (isPen ? 0.1 : 1) + '" value="' + cfg.w[kind] + '"></label>' +
      (isPen ? '<label class="ann-sl"><span>筆畫穩定</span><b data-v="stab"></b><input type="range" data-s="stab" min="0" max="100" step="1" value="' + cfg.stab + '"></label>' +
        '<p class="ann-pop-n">穩定度越高，手抖的地方越平滑，但線會稍微「跟在筆後面」。鋼筆、畫筆會跟著下筆力道變粗變細。</p>' : '') +
      '<p class="ann-pop-n">' + statusTxt() + '</p>';
    pop.dataset.kind = kind; pop.hidden = false;
    const btn = bar.querySelector('[data-tool="' + kind + '"]').getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(window.innerWidth - pop.offsetWidth - 8, btn.left - 10)) + 'px';
    paintPop();
  }
  function paintPop() {
    if (pop.hidden) return;
    const kind = pop.dataset.kind, isPen = kind === 'pen';
    const wv = pop.querySelector('[data-v="w"]'); if (wv) wv.textContent = cfg.w[kind] + ' px';
    const sv = pop.querySelector('[data-v="stab"]'); if (sv) sv.textContent = cfg.stab + '%';
    pop.querySelectorAll('[data-type]').forEach(b => b.classList.toggle('on', b.dataset.type === cfg.type));
    const t = pop.querySelector('.ann-pop-t'); if (t) t.textContent = isPen ? TYPES[cfg.type] : '螢光筆';
    const pts = []; for (let i = 0; i <= 40; i++) { const x = 20 + i * 6; pts.push([x, 35 - 18 * Math.sin(i / 40 * Math.PI * 2), 0.25 + 0.7 * Math.sin(i / 40 * Math.PI)]); }
    pop.querySelector('.ann-prev').innerHTML = pathOf({ t: isPen ? cfg.type : 'h', c: cfg.color[kind], w: cfg.w[kind] }, pts);
  }
  pop.addEventListener('input', e => {
    const s = e.target.dataset.s; if (!s) return;
    if (s === 'w') cfg.w[pop.dataset.kind] = +e.target.value; else cfg.stab = +e.target.value;
    saveCfg(); paintPop(); paintBar();
  });
  pop.addEventListener('click', e => { const b = e.target.closest('[data-type]'); if (b) { cfg.type = b.dataset.type; saveCfg(); paintPop(); } });
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('.ann-bar [data-tool]')) pop.hidden = true; }, true);

  fab.addEventListener('click', () => setOn(true));
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tool) {
      const t = b.dataset.tool;
      if ((t === 'pen' || t === 'hl') && (cfg.tool === t || e.target.closest('.ann-caret'))) { if (pop.hidden || pop.dataset.kind !== t) openPop(t); else pop.hidden = true; }
      else pop.hidden = true;
      setTool(t);
      if (t === 'note') toast('點一下講義上要貼便條的地方');
    }
    if (b.dataset.w) { const k = kindOf(); cfg.w[k] = PRESET[k][+b.dataset.w]; if (cfg.tool !== 'hl') setTool('pen'); saveCfg(); paintBar(); paintPop(); }
    if (b.dataset.c) { const k = cfg.tool === 'hl' ? 'hl' : 'pen'; cfg.color[k] = b.dataset.c; if (cfg.tool !== 'hl') setTool('pen'); saveCfg(); paintBar(); paintPop(); }
    const a = b.dataset.act;
    if (a === 'done') setOn(false);
    if (a === 'undo') undo();
    if (a === 'redo') redo();
    if (a === 'finger') { finger = !finger; document.body.classList.toggle('ann-finger', finger); paintBar(); toast(finger ? '手指現在也會寫字；要捲動再按一次 ☝' : '手指恢復成捲動'); }
    if (a === 'clear') {
      const ids = Object.keys(store.all());
      if (!ids.length) return toast('這一頁還沒有筆記');
      if (window.confirm('清除這一頁所有筆跡、便條和新增的空間？（' + ids.length + ' 筆，可以按 ↶ 復原）')) { begin(); ids.forEach(del); commit(); }
    }
  });
  function toggleEraser() {
    if (cfg.tool === 'eraser') { setTool(prevTool || 'pen'); toast(prevTool === 'hl' ? '🖍 螢光筆' : '✒︎ 筆'); }
    else { prevTool = cfg.tool === 'note' ? 'pen' : cfg.tool; setTool('eraser'); toast('⌫ 橡皮擦（兩指再點一下切回來）'); }
  }

  /* ---------- 輸入 ---------- */
  let cur = null, erasing = null, suppress = 0;
  const skip = t => !t.closest || t.closest('.ann-bar, .ann-pop, .ann-fab, .ann-toast, .ann-note-bar, .ann-note-mini, .ann-space-head, .ann-add, .pad, .topbar, .term-pop, input, select, textarea');
  function lpos(e) { const L = layer.getBoundingClientRect(); return [e.clientX - L.left, e.clientY - L.top]; }
  document.addEventListener('pointerdown', e => {
    if (!on || skip(e.target) || !main.contains(e.target)) return;
    if (e.pointerType === 'pen') penSeen = true;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (cfg.tool === 'note') { e.preventDefault(); e.stopPropagation(); suppress = Date.now(); addNote(e); return; }
    if (e.pointerType === 'touch' && !finger) return;
    e.preventDefault(); e.stopPropagation(); suppress = Date.now();
    if (cfg.tool === 'eraser' || (e.buttons & 32)) { begin(); erasing = e.pointerId; eraseAt(lpos(e)); return; }
    const el = anchorAt(e.target), r = el.getBoundingClientRect();
    if (!r.width) return;
    const k = kindOf();
    cur = { el, a: keyOf(el), pid: e.pointerType + e.pointerId, touch: e.pointerType === 'touch', n: { t: k === 'hl' ? 'h' : cfg.type, c: cfg.color[k], w: cfg.w[k], z: Z }, raw: [], sm: null, pr: !!(cfg.type !== 'b' && k === 'pen') };
    svg.appendChild(live); addPt(e);
  }, { capture: true, passive: false });
  const pres = e => (e.pointerType === 'mouse' || !e.pressure ? 0.5 : Math.max(0.05, Math.min(1, e.pressure)));
  /* 筆畫穩定：讓筆尖位置「慢慢追上」真的筆尖（指數平滑），stab 越大越平滑 */
  function addPt(e, final) {
    const a = 1 - 0.92 * Math.min(1, cfg.stab / 100) * (kindOf() === 'hl' ? 0.6 : 1);
    const q = [e.clientX, e.clientY, e.type === 'pointerup' && cur.sm ? cur.sm[2] : pres(e)];
    if (!cur.sm) cur.sm = q.slice();
    else { cur.sm[0] += (q[0] - cur.sm[0]) * a; cur.sm[1] += (q[1] - cur.sm[1]) * a; cur.sm[2] += (q[2] - cur.sm[2]) * Math.max(a, 0.35); }
    if (final) { cur.sm[0] = q[0]; cur.sm[1] = q[1]; }
    const s = cur.sm, last = cur.raw[cur.raw.length - 1];
    if (last && Math.hypot(last[0] - s[0], last[1] - s[1]) < 0.6 && !final) return;
    cur.raw.push([s[0], s[1], s[2]]);
    const L = layer.getBoundingClientRect();
    setLive(cur.n, cur.raw.map(p => [p[0] - L.left, p[1] - L.top, p[2]]));
  }
  document.addEventListener('pointermove', e => {
    if (cur && e.pointerType + e.pointerId === cur.pid) { e.preventDefault(); (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach(ev => addPt(ev)); }
    else if (erasing === e.pointerId) { e.preventDefault(); eraseAt(lpos(e)); }
  }, { capture: true, passive: false });
  function end(e) {
    if (erasing != null && e.pointerId === erasing) { erasing = null; commit(); return; }
    if (!cur || e.pointerType + e.pointerId !== cur.pid) return;
    if (cfg.stab > 0 && e.type === 'pointerup') { for (let i = 0; i < 3; i++) addPt(e); addPt(e, true); }
    const r = cur.el.getBoundingClientRect(), sc = Z / r.width, s = { a: cur.a, y: cur.n.t, c: cur.n.c, w: cur.n.w, z: Z, p: [] };
    if (cur.pr) s.r = [];
    cur.raw.forEach(p => { s.p.push(Math.round((p[0] - r.left) * sc), Math.round((p[1] - r.top) * sc)); if (s.r) s.r.push(Math.round(p[2] * 99)); });
    cur = null; live.remove();
    if (s.p.length) { begin(); put('s:' + uid(), s); commit(); }
  }
  document.addEventListener('pointerup', end, true);
  document.addEventListener('pointercancel', end, true);
  /* 剛在按鈕上寫了一筆 → 擋掉放開時的 click，不要誤觸 */
  document.addEventListener('click', e => { if (suppress && Date.now() - suppress < 800 && !skip(e.target)) { e.preventDefault(); e.stopPropagation(); } suppress = 0; }, true);
  /* iPad：Pencil 碰到畫面時擋掉捲動與選字（手指照常）；兩指點一下 = 切換橡皮擦 */
  let two = null;
  document.addEventListener('touchstart', e => {
    if (!on) return;
    if (e.touches.length === 2 && !Array.prototype.some.call(e.touches, t => t.touchType === 'stylus')) {
      two = { t: Date.now(), x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2 };
      if (cur && cur.touch) { cur = null; live.remove(); }
    } else if (e.touches.length > 2) two = null;
    if (skip(e.target) || !main.contains(e.target)) return;
    if ((finger && e.touches.length === 1) || Array.prototype.some.call(e.touches, t => t.touchType === 'stylus')) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!on) return;
    if (two && e.touches.length === 2) { const x = (e.touches[0].clientX + e.touches[1].clientX) / 2, y = (e.touches[0].clientY + e.touches[1].clientY) / 2; if (Math.hypot(x - two.x, y - two.y) > 14) two = null; }
    if (skip(e.target) || !main.contains(e.target)) return;
    if ((finger && e.touches.length === 1) || Array.prototype.some.call(e.touches, t => t.touchType === 'stylus')) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', e => { if (two && e.touches.length === 0) { if (Date.now() - two.t < 350) toggleEraser(); two = null; } });

  function eraseAt(q) {
    drawn.filter(d => d.pts.some((p, i) => {
      if (Math.hypot(p[0] - q[0], p[1] - q[1]) < d.rad) return true;
      const o = d.pts[i - 1]; if (!o) return false;
      const dx = p[0] - o[0], dy = p[1] - o[1], L2 = dx * dx + dy * dy; if (!L2) return false;
      const t = Math.max(0, Math.min(1, ((q[0] - o[0]) * dx + (q[1] - o[1]) * dy) / L2));
      return Math.hypot(o[0] + t * dx - q[0], o[1] + t * dy - q[1]) < d.rad;
    })).forEach(h => { if (store.get(h.id)) del(h.id); });
  }

  /* ---------- 便條（手寫） ---------- */
  const noteEls = {}; let dragId = null;
  const nbId = id => 'ann-nb-' + id.slice(2), spId = id => 'ann-sp-' + id.slice(3);
  function addNote(e) {
    const el = anchorAt(e.target), r = el.getBoundingClientRect(); if (!r.width) return;
    begin(); put('n:' + uid(), { a: keyOf(el), x: Math.round((e.clientX - r.left) * Z / r.width), y: Math.round((e.clientY - r.top) * Z / r.width), h: 0.7, min: 0, z: Z }); commit();
    setTool(prevTool === 'hl' ? 'pen' : prevTool || 'pen');
    toast('便條貼好了，直接用筆寫在上面');
  }
  function patchN(id, f) { const d = clean(store.get(id)); if (!d) return; f(d); begin(); put(id, d); commit(); }
  function makeNote(id) {
    const n = document.createElement('div'); n.className = 'ann-note'; n.dataset.id = id;
    n.innerHTML = '<div class="ann-note-bar"><span class="ann-grip" title="拖曳移動">⠿ 便條</span>' +
      '<button type="button" data-n="taller" title="加長">↧</button><button type="button" data-n="min" title="縮小">–</button>' +
      '<button type="button" data-n="del" title="刪除這張便條">✕</button></div>' +
      '<div class="ann-note-body" id="' + nbId(id) + '"></div>' +
      '<button type="button" class="ann-note-mini" title="打開便條">🗒</button>';
    n.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.n === 'del') {
        const has = Object.keys(store.all()).some(k => k.indexOf('s:') === 0 && store.get(k).a === nbId(id) + ':-1');
        if (!has || window.confirm('刪除這張便條和上面寫的字？（可以按 ↶ 復原）')) delArea(id, nbId(id));
      }
      if (b.dataset.n === 'min') patchN(id, d => { d.min = 1; });
      if (b.dataset.n === 'taller') patchN(id, d => { d.h = Math.min(2.5, (d.h || 0.7) + 0.35); });
      if (b.classList.contains('ann-note-mini')) patchN(id, d => { d.min = 0; });
    });
    /* 拖曳：放開時重新找「底下是哪一段」當錨點；寫在便條上的字跟著走 */
    const grip = n.querySelector('.ann-grip');
    grip.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); grip.setPointerCapture(e.pointerId); dragId = id;
      const L = layer.getBoundingClientRect(), r0 = n.getBoundingClientRect(), dx = e.clientX - r0.left, dy = e.clientY - r0.top;
      const mv = ev => { n.style.left = (ev.clientX - dx - L.left) + 'px'; n.style.top = (ev.clientY - dy - L.top) + 'px'; schedule(); };
      const up = ev => {
        grip.removeEventListener('pointermove', mv); grip.removeEventListener('pointerup', up); grip.removeEventListener('pointercancel', up);
        const x = ev.clientX - dx, y = ev.clientY - dy;
        n.style.visibility = 'hidden';
        const under = document.elementsFromPoint(Math.max(1, x), Math.max(1, y)).find(t => main.contains(t) && !layer.contains(t)) || main;
        n.style.visibility = ''; dragId = null;
        const el = anchorAt(under), r = el.getBoundingClientRect(); if (!r.width) return schedule();
        patchN(id, d => { d.a = keyOf(el); d.z = Z; d.x = Math.round((x - r.left) * Z / r.width); d.y = Math.round((y - r.top) * Z / r.width); });
      };
      grip.addEventListener('pointermove', mv); grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
    });
    notesBox.appendChild(n); noteEls[id] = n;
    return n;
  }
  function renderNotes(L, all) {
    const W = layer.clientWidth, alive = {};
    Object.keys(all).forEach(id => {
      if (id.indexOf('n:') !== 0) return;
      const s = all[id], el = resolve(s.a); alive[id] = 1;
      const n = noteEls[id] || makeNote(id);
      if (!shown(el)) { n.hidden = true; return; }
      n.hidden = false;
      const w = Math.min(250, W - 4);
      n.classList.toggle('min', !!s.min);
      n.querySelector('.ann-note-body').style.height = Math.round(w * (s.h || 0.7)) + 'px';
      n.style.width = s.min ? '' : w + 'px';
      if (dragId === id) return;
      const r = el.getBoundingClientRect(), k = r.width / (s.z || 1000);
      n.style.left = Math.max(0, Math.min(W - (s.min ? 40 : w), r.left - L.left + s.x * k)) + 'px';
      n.style.top = Math.max(0, r.top - L.top + s.y * k) + 'px';
    });
    Object.keys(noteEls).forEach(id => { if (!alive[id]) { noteEls[id].remove(); delete noteEls[id]; } });
  }

  /* ---------- 題目／例題下面的「新增空間」 ---------- */
  const TARGET = '.hw-card[id], .xb-card[id], .quiz[id], .example[id]';
  const spaceEls = {};
  function boxFor(t) {
    let box = t.nextElementSibling;
    if (box && box.classList.contains('ann-spaces') && box.dataset.for === t.id) return box;
    box = document.createElement('div'); box.className = 'ann-spaces'; box.dataset.for = t.id;
    box.innerHTML = '<div class="ann-sp-list"></div><button type="button" class="ann-add">＋ 新增空間（在這題下面手寫）</button>';
    box.querySelector('.ann-add').addEventListener('click', () => { begin(); put('sp:' + uid(), { a: t.id, c: Date.now(), h: 0.4 }); commit(); });
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
        el.innerHTML = '<div class="ann-space-head"><span>📝 我的空間 · 筆記模式下用筆寫</span><span class="ann-sp-btns">' +
          '<button type="button" data-sp="taller">＋ 加高</button><button type="button" data-sp="shorter">－</button><button type="button" data-sp="del">✕ 刪除</button></span></div>' +
          '<div class="ann-space-body" id="' + spId(id) + '"></div>';
        el.querySelector('.ann-space-head').addEventListener('click', e => {
          const b = e.target.closest('[data-sp]'); if (!b) return;
          if (b.dataset.sp === 'taller') patchN(id, d => { d.h = Math.min(3, (d.h || 0.4) + 0.25); });
          if (b.dataset.sp === 'shorter') patchN(id, d => { d.h = Math.max(0.15, (d.h || 0.4) - 0.25); });
          if (b.dataset.sp === 'del') {
            const has = Object.keys(store.all()).some(k => k.indexOf('s:') === 0 && store.get(k).a === spId(id) + ':-1');
            if (!has || window.confirm('刪除這塊空間和裡面寫的東西？（可以按 ↶ 復原）')) delArea(id, spId(id));
          }
        });
        spaceEls[id] = el;
      }
      if (el.parentElement !== listEl) listEl.appendChild(el);
      const body = el.querySelector('.ann-space-body'), h = Math.round((body.clientWidth || listEl.clientWidth || 300) * (s.h || 0.4)) + 'px';
      if (body.style.height !== h) body.style.height = h;
    });
    Object.keys(spaceEls).forEach(id => { if (!alive[id]) { spaceEls[id].remove(); delete spaceEls[id]; } });
  }

  /* ---------- 什麼時候要重畫 ---------- */
  store.on(() => { if (!cur) schedule(); });
  new ResizeObserver(later).observe(main);
  new MutationObserver(ms => { if (ms.some(m => !layer.contains(m.target) && !(m.target.closest && m.target.closest('.ann-space, #story, .bench')))) later(); })
    .observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open', 'class'] });
  document.addEventListener('toggle', later, true);
  window.addEventListener('load', later);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  render();
  window.__ANN = { store, render, setOn, keyOf, resolve, anchorAt, toggleEraser, cfg: () => cfg };
})();
