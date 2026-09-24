/* ============================================================
   手寫筆記 —— 編輯器
   ------------------------------------------------------------
   • Apple Pencil 寫、手指捲動（像 GoodNotes）；沒有筆的裝置可開「手指書寫」
   • 壓感：筆畫粗細跟著 pressure 變；getCoalescedEvents 讓快速書寫也不會斷成折線
   • 筆 / 螢光筆 / 橡皮擦（整筆或局部）/ 套索（移動、複製、改色、刪除）
   • 按住不動 0.5 秒 → 自動拉成直線（畫電路圖很好用）
   • 座標一律存「頁面座標」（寬 1000、高 1414），跟螢幕大小、縮放無關
   ============================================================ */
(function () {
  'use strict';
  const S = window.__Notes;
  const PW = 1000, PH = 1414, TAU = Math.PI * 2;
  const MAX_PX = 12e6;                       /* iPad Safari 單一 canvas 約 16.7M 像素上限，留點餘裕 */

  const R = window.__NotesDraw, PAPER = R.PAPER, INKS = R.INKS, HLS = R.HLS;
  const drawPaper = R.drawPaper, drawPiece = R.drawPiece, drawStroke = R.drawStroke;
  const SIZES = { pen: [1.6, 2.8, 4.6], hl: [14, 22, 34], eraser: [7, 15, 30] };
  const TPLS = { grid: '方格', lines: '橫線', dots: '點格', blank: '空白' };

  const $ = s => document.querySelector(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  const st = {
    nb: null, pages: [], tool: 'pen',
    color: { pen: 0, hl: 0 }, size: { pen: 1, hl: 1, eraser: 1 },
    eraseMode: lsGet('ee-notes-erase') === 'area' ? 'area' : 'stroke',
    zoom: 1, fingerDraw: lsGet('ee-notes-finger') === '1', penSeen: false,
    undo: [], redo: [], cur: null, sel: null, current: 0
  };

  const scroller = $('#scroller'), host = $('#pages');
  let io = null;

  /* ---------------- 小工具 ---------------- */
  function toast(msg, ms) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms || 2200);
  }
  const d2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
  function segD2(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay, L = vx * vx + vy * vy;
    let t = L ? ((px - ax) * vx + (py - ay) * vy) / L : 0;
    t = clamp(t, 0, 1);
    return d2(px, py, ax + t * vx, ay + t * vy);
  }
  const inkList = () => (st.tool === 'hl' ? HLS : INKS)[st.nb.paper];
  const curColor = () => { const l = inkList(); return l[st.color[st.tool === 'hl' ? 'hl' : 'pen'] % l.length]; };
  const pageById = id => st.pages.find(p => p.id === id);
  const sortStrokes = arr => arr.sort((a, b) => (a.z - b.z) || (a.id < b.id ? -1 : 1));

  /* ---------------- 頁面與畫布 ---------------- */
  function fitWidth() {
    const w = scroller.clientWidth || 360;
    return Math.max(200, Math.min(w - 24, 880));
  }
  function layoutPages() {
    const w = Math.round(fitWidth() * st.zoom), h = Math.round(w * PH / PW);
    st.pages.forEach(pg => {
      pg.el.style.width = w + 'px'; pg.el.style.height = h + 'px';
      pg.el.style.background = PAPER[st.nb.paper].bg;
    });
  }
  function sizeCanvas(pg) {
    if (!pg.ink) return;
    const cw = pg.el.clientWidth, ch = pg.el.clientHeight;
    if (!cw || !ch) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = Math.min(dpr, Math.sqrt(MAX_PX / (cw * ch)));
    const W = Math.max(1, Math.round(cw * scale)), H = Math.max(1, Math.round(ch * scale));
    if (pg.ink.width === W && pg.ink.height === H) return;
    [pg.ink, pg.live].forEach(c => { c.width = W; c.height = H; });
    pg.k = W / PW;
    pg.ictx.setTransform(pg.k, 0, 0, pg.k, 0, 0);
    pg.lctx.setTransform(pg.k, 0, 0, pg.k, 0, 0);
    renderInk(pg);
    renderLive(pg);
  }
  function attach(pg) {
    if (pg.ink) return;
    pg.ink = document.createElement('canvas');
    pg.live = document.createElement('canvas');
    pg.ink.setAttribute('aria-hidden', 'true'); pg.live.setAttribute('aria-hidden', 'true');
    pg.el.insertBefore(pg.live, pg.el.firstChild);
    pg.el.insertBefore(pg.ink, pg.live);
    pg.ictx = pg.ink.getContext('2d'); pg.lctx = pg.live.getContext('2d');
    sizeCanvas(pg);
  }
  function detach(pg) {
    if (!pg.ink || (st.cur && st.cur.page === pg) || (st.sel && st.sel.page === pg)) return;
    pg.ink.width = pg.ink.height = pg.live.width = pg.live.height = 0;
    pg.ink.remove(); pg.live.remove();
    pg.ink = pg.live = pg.ictx = pg.lctx = null;
  }
  function renderInk(pg) {
    if (!pg.ictx) return;
    const ctx = pg.ictx;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, pg.ink.width, pg.ink.height); ctx.restore();
    drawPaper(ctx, pg.tpl, st.nb.paper);
    const hide = st.sel && st.sel.page === pg ? st.sel.ids : null;
    for (const s of pg.strokes) if (!hide || !hide.has(s.id)) drawStroke(ctx, s);
  }
  function clearLive(pg) {
    if (!pg.lctx) return;
    pg.lctx.save(); pg.lctx.setTransform(1, 0, 0, 1, 0, 0); pg.lctx.clearRect(0, 0, pg.live.width, pg.live.height); pg.lctx.restore();
  }
  function renderLive(pg) {
    if (!pg.lctx) return;
    clearLive(pg);
    const ctx = pg.lctx, c = st.cur;
    if (st.sel && st.sel.page === pg) {
      const off = c && c.type === 'move' ? c.off : [0, 0];
      for (const s of pg.strokes) if (st.sel.ids.has(s.id)) drawStroke(ctx, s, off[0], off[1]);
      const b = st.sel.bbox, pad = 8;
      ctx.save(); ctx.setLineDash([7, 6]); ctx.lineWidth = 1.6; ctx.strokeStyle = PAPER[st.nb.paper].sel;
      ctx.strokeRect(b[0] - pad + off[0], b[1] - pad + off[1], b[2] - b[0] + pad * 2, b[3] - b[1] + pad * 2);
      ctx.restore();
    }
    if (!c || c.page !== pg) return;
    if (c.type === 'draw') drawStroke(ctx, { tool: c.s.tool, color: c.s.color, width: c.s.width, pts: c.pts });
    else if (c.type === 'lasso' && c.poly.length > 2) {
      ctx.save(); ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5; ctx.strokeStyle = PAPER[st.nb.paper].sel;
      ctx.fillStyle = 'rgba(86,212,245,0.06)';
      ctx.beginPath(); ctx.moveTo(c.poly[0], c.poly[1]);
      for (let i = 2; i < c.poly.length; i += 2) ctx.lineTo(c.poly[i], c.poly[i + 1]);
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    } else if (c.type === 'erase' && c.at) {
      ctx.save(); ctx.lineWidth = 1.4; ctx.strokeStyle = PAPER[st.nb.paper].sel; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(c.at[0], c.at[1], Math.max(0, c.r), 0, TAU); ctx.stroke(); ctx.restore();
    }
  }

  function buildPages() {
    host.innerHTML = '';
    if (io) io.disconnect();
    io = new IntersectionObserver(es => {
      es.forEach(e => {
        const pg = st.pages.find(p => p.el === e.target);
        if (!pg) return;
        if (e.isIntersecting) attach(pg); else detach(pg);
      });
    }, { root: scroller, rootMargin: '120% 0px 120% 0px' });
    st.pages.forEach((pg, i) => mountPage(pg, i));
    layoutPages();
  }
  function mountPage(pg, i) {
    const el = document.createElement('div');
    el.className = 'nb-page tool-' + st.tool;
    el.dataset.id = pg.id;
    const no = document.createElement('span'); no.className = 'pg-no';
    el.appendChild(no);
    pg.el = el;
    const next = st.pages[i + 1];
    if (next && next.el && next.el.parentNode === host) host.insertBefore(el, next.el); else host.appendChild(el);
    el.addEventListener('pointerdown', e => onDown(e, pg));
    io.observe(el);
    renumber();
  }
  function renumber() {
    st.pages.forEach((pg, i) => { const n = pg.el && pg.el.querySelector('.pg-no'); if (n) n.textContent = (i + 1) + ' / ' + st.pages.length; });
    updatePageInd();
  }

  /* ---------------- 輸入 ---------------- */
  function toUnits(e, pg) {
    const r = pg.el.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * PW, (e.clientY - r.top) / r.height * PH];
  }
  function pressureOf(e) {
    if (e.pointerType === 'pen') return e.pressure > 0 ? e.pressure : 0.5;
    return 0.5;
  }
  function onDown(e, pg) {
    if (e.pointerType === 'pen' && !st.penSeen) {
      st.penSeen = true;
      if (st.fingerDraw) { setFinger(false); toast('偵測到觸控筆：改成「筆寫字、手指捲動」'); }
    }
    if (e.pointerType === 'touch' && !st.fingerDraw) return;       /* 手指 → 交給瀏覽器捲動 */
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (st.cur) return;
    e.preventDefault();
    closeMenus();
    try { pg.el.setPointerCapture(e.pointerId); } catch (err) {}
    attach(pg);
    setCurrentPage(st.pages.indexOf(pg));
    const [x, y] = toUnits(e, pg);
    const pid = e.pointerId;
    if (st.tool === 'pen' || st.tool === 'hl') {
      if (st.sel) clearSel();
      const s = { id: S.uid('s'), tool: st.tool, color: curColor(), width: SIZES[st.tool][st.size[st.tool]] };
      st.cur = { type: 'draw', page: pg, pid, s, pts: [x, y, pressureOf(e)], anchor: [x, y], len: 0, straight: false, start: [x, y] };
      armHold();
      renderLive(pg);
    } else if (st.tool === 'eraser') {
      if (st.sel) clearSel();
      st.cur = { type: 'erase', page: pg, pid, removed: [], added: [], r: SIZES.eraser[st.size.eraser], at: [x, y], last: [x, y] };
      eraseAt(pg, x, y);
      renderLive(pg);
    } else if (st.tool === 'lasso') {
      if (st.sel && st.sel.page === pg && insideSel(x, y)) {
        st.cur = { type: 'move', page: pg, pid, start: [x, y], off: [0, 0] };
        hideSelBar();
      } else {
        if (st.sel) clearSel();
        st.cur = { type: 'lasso', page: pg, pid, poly: [x, y] };
      }
    }
  }
  function onMove(e) {
    const c = st.cur;
    if (!c || e.pointerId !== c.pid) return;
    e.preventDefault();
    const evs = (e.getCoalescedEvents && e.getCoalescedEvents().length) ? e.getCoalescedEvents() : [e];
    for (const ev of evs) {
      const [x, y] = toUnits(ev, c.page);
      if (c.type === 'draw') addPoint(c, x, y, pressureOf(ev));
      else if (c.type === 'erase') eraseAlong(c, x, y);
      else if (c.type === 'lasso') {
        const n = c.poly.length;
        if (d2(x, y, c.poly[n - 2], c.poly[n - 1]) > 9) c.poly.push(x, y);
      } else if (c.type === 'move') c.off = [x - c.start[0], y - c.start[1]];
    }
    if (c.type === 'draw' && c.s.tool === 'pen' && !c.straight) {
      /* 不透明的筆只要補畫新增的那幾段，不必每一格重畫整條 */
      const n = c.pts.length / 3, ctx = c.page.lctx;
      if (ctx) {
        ctx.lineCap = 'round'; ctx.strokeStyle = c.s.color;
        for (let i = Math.max(0, (c.drawn || 0) - 1); i < n; i++) drawPiece(ctx, c.pts, n, i, c.s.width, 0, 0);
        c.drawn = n;
      }
    } else {
      renderLive(c.page);
    }
  }
  function addPoint(c, x, y, p) {
    const n = c.pts.length;
    if (c.straight) {
      c.end = [x, y];
      const sx = c.start[0], sy = c.start[1], pr = c.avgP;
      c.pts = [sx, sy, pr, x, y, pr];
      return;
    }
    c.raw = [x, y];
    const lx = c.pts[n - 3], ly = c.pts[n - 2], lp = c.pts[n - 1];
    if (d2(x, y, lx, ly) < 0.12) return;
    /* 輕微平滑：抵消手抖，但不拖泥帶水 */
    const sx = lx + (x - lx) * 0.72, sy = ly + (y - ly) * 0.72, sp = lp + (p - lp) * 0.35;
    c.len += Math.sqrt(d2(sx, sy, lx, ly));
    c.pts.push(sx, sy, sp);
    if (d2(x, y, c.anchor[0], c.anchor[1]) > 6) { c.anchor = [x, y]; armHold(); }
  }
  function armHold() {
    clearTimeout(st.holdT);
    st.holdT = setTimeout(() => {
      const c = st.cur;
      if (!c || c.type !== 'draw' || c.straight || c.len < 24) return;
      /* 按住不動 → 變直線，之後筆尖移動只改終點 */
      let sp = 0; const n = c.pts.length / 3;
      for (let i = 0; i < n; i++) sp += c.pts[i * 3 + 2];
      c.avgP = sp / n; c.straight = true;
      /* 終點用筆尖「實際」的位置，不用平滑後（會落後一點）的位置 */
      const x = c.raw ? c.raw[0] : c.pts[(n - 1) * 3], y = c.raw ? c.raw[1] : c.pts[(n - 1) * 3 + 1];
      c.pts = [c.start[0], c.start[1], c.avgP, x, y, c.avgP];
      renderLive(c.page);
      if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
    }, 520);
  }
  function onUp(e) {
    const c = st.cur;
    if (!c || e.pointerId !== c.pid) return;
    clearTimeout(st.holdT);
    st.cur = null;
    const pg = c.page;
    if (c.type === 'draw') {
      if (e.type === 'pointercancel' && e.pointerType === 'touch') { clearLive(pg); return; }
      let pts = c.pts;
      if (c.straight) {
        /* 直線補點：局部橡皮擦才擦得斷 */
        const [x0, y0] = [pts[0], pts[1]], [x1, y1] = [pts[3], pts[4]];
        const L = Math.sqrt(d2(x0, y0, x1, y1)), k = Math.max(1, Math.ceil(L / 3));
        pts = [];
        for (let i = 0; i <= k; i++) pts.push(x0 + (x1 - x0) * i / k, y0 + (y1 - y0) * i / k, c.avgP);
      }
      const s = S.withBBox(Object.assign({}, c.s, { z: nextZ(pg), pts: new Float32Array(pts) }));
      pg.strokes.push(s);
      clearLive(pg);
      if (pg.ictx) drawStroke(pg.ictx, s);
      commit({ page: pg.id, removed: [], added: [s] }, false);
    } else if (c.type === 'erase') {
      clearLive(pg);
      if (c.removed.length || c.added.length) commit({ page: pg.id, removed: c.removed, added: c.added }, false);
    } else if (c.type === 'lasso') {
      clearLive(pg);
      finishLasso(pg, c.poly);
    } else if (c.type === 'move') {
      const [dx, dy] = c.off;
      if (Math.abs(dx) + Math.abs(dy) > 0.5) {
        const olds = pg.strokes.filter(s => st.sel.ids.has(s.id));
        const news = olds.map(s => translated(s, dx, dy));
        replaceStrokes(pg, olds, news);
        st.sel.bbox = unionBBox(news);
        commit({ page: pg.id, removed: olds, added: news }, false);
      }
      renderLive(pg);
      showSelBar();
    }
  }
  const nextZ = pg => pg.strokes.reduce((m, s) => Math.max(m, s.z), 0) + 1;
  function translated(s, dx, dy) {
    const p = new Float32Array(s.pts);
    for (let i = 0; i < p.length; i += 3) { p[i] += dx; p[i + 1] += dy; }
    return S.withBBox(Object.assign({}, s, { pts: p, _pk: null }));
  }
  function replaceStrokes(pg, olds, news) {
    const ids = new Set(olds.map(s => s.id));
    pg.strokes = sortStrokes(pg.strokes.filter(s => !ids.has(s.id)).concat(news));
  }

  /* ---------------- 橡皮擦 ---------------- */
  function hitStroke(s, x, y, r) {
    const b = s.bbox, pad = r + s.width;
    if (x < b[0] - pad || x > b[2] + pad || y < b[1] - pad || y > b[3] + pad) return false;
    const p = s.pts, n = p.length / 3, rr = (r + s.width / 2) * (r + s.width / 2);
    if (n === 1) return d2(x, y, p[0], p[1]) <= rr;
    for (let i = 0; i < n - 1; i++) if (segD2(x, y, p[i * 3], p[i * 3 + 1], p[i * 3 + 3], p[i * 3 + 4]) <= rr) return true;
    return false;
  }
  function splitStroke(s, x, y, r) {
    const p = s.pts, n = p.length / 3, rr = (r + s.width / 2) * (r + s.width / 2), step = Math.max(0.8, r / 3);
    const dense = [];
    for (let i = 0; i < n; i++) {
      if (i) {
        const ax = p[i * 3 - 3], ay = p[i * 3 - 2], ap = p[i * 3 - 1], bx = p[i * 3], by = p[i * 3 + 1], bp = p[i * 3 + 2];
        const L = Math.sqrt(d2(ax, ay, bx, by)), k = Math.floor(L / step);
        for (let j = 1; j < k; j++) dense.push(ax + (bx - ax) * j / k, ay + (by - ay) * j / k, ap + (bp - ap) * j / k);
      }
      dense.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
    }
    const runs = []; let run = [], cut = false;
    for (let i = 0; i < dense.length; i += 3) {
      if (d2(x, y, dense[i], dense[i + 1]) <= rr) { cut = true; if (run.length) runs.push(run); run = []; }
      else run.push(dense[i], dense[i + 1], dense[i + 2]);
    }
    if (run.length) runs.push(run);
    if (!cut) return null;
    return runs.filter(r2 => r2.length >= 6).map(r2 => S.withBBox({
      id: S.uid('s'), z: s.z, tool: s.tool, color: s.color, width: s.width, pts: new Float32Array(r2)
    }));
  }
  function eraseAlong(c, x, y) {
    /* 移動很快時，兩次事件之間補幾個點，才不會「跳過」細的筆畫 */
    const [lx, ly] = c.last, L = Math.sqrt(d2(x, y, lx, ly)), k = Math.max(1, Math.ceil(L / (c.r * 0.6)));
    for (let i = 1; i <= k; i++) eraseAt(c.page, lx + (x - lx) * i / k, ly + (y - ly) * i / k);
    c.last = [x, y]; c.at = [x, y];
  }
  function eraseAt(pg, x, y) {
    const c = st.cur, r = c.r;
    let changed = false;
    if (st.eraseMode === 'stroke') {
      const keep = [];
      for (const s of pg.strokes) {
        if (hitStroke(s, x, y, r)) {
          changed = true;
          const ai = c.added.indexOf(s);
          if (ai >= 0) c.added.splice(ai, 1); else c.removed.push(s);
        } else keep.push(s);
      }
      if (changed) pg.strokes = keep;
    } else {
      const out = [];
      for (const s of pg.strokes) {
        const parts = hitStroke(s, x, y, r) ? splitStroke(s, x, y, r) : null;
        if (!parts) { out.push(s); continue; }
        changed = true;
        const ai = c.added.indexOf(s);
        if (ai >= 0) c.added.splice(ai, 1); else c.removed.push(s);
        parts.forEach(q => { out.push(q); c.added.push(q); });
      }
      if (changed) pg.strokes = sortStrokes(out);
    }
    if (changed) scheduleInk(pg);
  }
  function scheduleInk(pg) {
    if (pg._raf) return;
    pg._raf = requestAnimationFrame(() => { pg._raf = 0; renderInk(pg); });
  }

  /* ---------------- 套索 ---------------- */
  function inPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) {
      const xi = poly[i], yi = poly[i + 1], xj = poly[j], yj = poly[j + 1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi)) inside = !inside;
    }
    return inside;
  }
  function unionBBox(list) {
    const b = [Infinity, Infinity, -Infinity, -Infinity];
    list.forEach(s => { b[0] = Math.min(b[0], s.bbox[0] - s.width / 2); b[1] = Math.min(b[1], s.bbox[1] - s.width / 2);
      b[2] = Math.max(b[2], s.bbox[2] + s.width / 2); b[3] = Math.max(b[3], s.bbox[3] + s.width / 2); });
    return b;
  }
  function finishLasso(pg, poly) {
    if (poly.length < 8) return;
    const ids = new Set(), picked = [];
    for (const s of pg.strokes) {
      const n = s.pts.length / 3, stp = Math.max(1, Math.floor(n / 24));
      let tot = 0, hit = 0;
      for (let i = 0; i < n; i += stp) { tot++; if (inPoly(s.pts[i * 3], s.pts[i * 3 + 1], poly)) hit++; }
      if (tot && hit / tot >= 0.5) { ids.add(s.id); picked.push(s); }
    }
    if (!picked.length) { toast('套索裡沒有圈到筆跡'); return; }
    st.sel = { page: pg, ids, bbox: unionBBox(picked) };
    renderInk(pg); renderLive(pg); showSelBar();
  }
  function insideSel(x, y) {
    const b = st.sel.bbox, pad = 14;
    return x >= b[0] - pad && x <= b[2] + pad && y >= b[1] - pad && y <= b[3] + pad;
  }
  function clearSel() {
    if (!st.sel) return;
    const pg = st.sel.page; st.sel = null;
    hideSelBar(); renderInk(pg); renderLive(pg);
  }
  function hideSelBar() { const b = document.querySelector('.sel-bar'); if (b) b.remove(); }
  function showSelBar() {
    hideSelBar();
    if (!st.sel) return;
    const pg = st.sel.page, k = pg.el.clientWidth / PW, b = st.sel.bbox;
    const bar = document.createElement('div');
    bar.className = 'sel-bar';
    const inks = INKS[st.nb.paper];
    bar.innerHTML =
      inks.map((c, i) => '<button type="button" data-rc="' + i + '" aria-label="改成這個顏色" style="padding:6px 7px"><span style="display:block;width:16px;height:16px;border-radius:50%;background:' + c + ';box-shadow:0 0 0 1px rgba(128,128,128,.5)"></span></button>').join('') +
      '<button type="button" data-act="dup">複製</button><button type="button" data-act="del" class="danger">刪除</button>';
    pg.el.appendChild(bar);
    const bw = bar.offsetWidth, bh = bar.offsetHeight;
    let left = (b[0] + b[2]) / 2 * k - bw / 2;
    left = clamp(left, 4, Math.max(4, pg.el.clientWidth - bw - 4));
    let top = b[1] * k - bh - 14;
    if (top < 4) top = b[3] * k + 14;
    bar.style.left = left + 'px'; bar.style.top = top + 'px';
    bar.addEventListener('pointerdown', ev => ev.stopPropagation());
    bar.addEventListener('click', ev => {
      const t = ev.target.closest('button'); if (!t) return;
      const olds = pg.strokes.filter(s => st.sel.ids.has(s.id));
      if (t.dataset.act === 'del') {
        replaceStrokes(pg, olds, []);
        st.sel = null; hideSelBar();
        commit({ page: pg.id, removed: olds, added: [] }, true);
        renderLive(pg);
      } else if (t.dataset.act === 'dup') {
        let z = nextZ(pg);
        const news = olds.map(s => Object.assign(translated(s, 24, 24), { id: S.uid('s'), z: z++ }));
        pg.strokes = sortStrokes(pg.strokes.concat(news));
        st.sel = { page: pg, ids: new Set(news.map(s => s.id)), bbox: unionBBox(news) };
        commit({ page: pg.id, removed: [], added: news }, true);
        renderLive(pg); showSelBar();
      } else if (t.dataset.rc !== undefined) {
        const col = inks[+t.dataset.rc];
        const news = olds.map(s => Object.assign({}, s, { color: s.tool === 'hl' ? s.color : col, _pk: null }));
        replaceStrokes(pg, olds, news);
        commit({ page: pg.id, removed: olds, added: news }, true);
        renderLive(pg);
      }
    });
  }

  /* ---------------- 復原 / 重做 ---------------- */
  function commit(op, rerender) {
    st.undo.push(op);
    if (st.undo.length > 200) st.undo.shift();
    st.redo = [];
    const pg = pageById(op.page);
    if (rerender && pg) renderInk(pg);
    markDirty(pg);
    updateUndo();
  }
  function applyOp(op, forward) {
    const pg = pageById(op.page); if (!pg) return;
    if (st.sel) clearSel();
    const rem = forward ? op.removed : op.added, add = forward ? op.added : op.removed;
    replaceStrokes(pg, rem, add);
    renderInk(pg); markDirty(pg);
    scrollToPage(st.pages.indexOf(pg), true);
  }
  function undo() { const op = st.undo.pop(); if (!op) return; applyOp(op, false); st.redo.push(op); updateUndo(); }
  function redo() { const op = st.redo.pop(); if (!op) return; applyOp(op, true); st.undo.push(op); updateUndo(); }
  function updateUndo() {
    $('#t-undo').disabled = !st.undo.length;
    $('#t-redo').disabled = !st.redo.length;
  }

  /* ---------------- 自動存檔 ---------------- */
  let saveT = 0, saving = false;
  function markDirty(pg) {
    if (!pg) return;
    pg.dirty = true;
    setSaveState('dirty');
    clearTimeout(saveT);
    saveT = setTimeout(flush, 700);
  }
  async function flush() {
    clearTimeout(saveT);
    const dirty = st.pages.filter(p => p.dirty);
    if (!dirty.length || saving) { if (dirty.length) saveT = setTimeout(flush, 400); return; }
    saving = true;
    try {
      for (const pg of dirty) {
        pg.dirty = false;
        const packed = pg.strokes.map(s => s._pk || (s._pk = S.packStroke(s)));
        await S.savePage(st.nb, { id: pg.id, tpl: pg.tpl, strokes: packed });
      }
      await S.saveNotebook(st.nb);
      setSaveState('saved');
    } catch (e) {
      dirty.forEach(p => { p.dirty = true; });
      setSaveState('error');
    }
    saving = false;
  }
  let saveState = 'saved';
  function setSaveState(s) { saveState = s; paintChip(); }
  function paintChip() {
    const chip = $('#sync-chip'); if (!chip) return;
    let txt, cls = '';
    if (saveState === 'error') { txt = '⚠ 儲存失敗'; cls = 'bad'; }
    else if (saveState === 'dirty') { txt = '儲存中…'; }
    else if (!S.persistent) { txt = '⚠ 只存在記憶體'; cls = 'bad'; }
    else {
      const cs = S.cloudStatus;
      if (cs === 'on') { txt = '☁ 已同步'; cls = 'on'; }
      else if (cs === 'connecting') { txt = '☁ 連線中…'; }
      else if (cs === 'partial') { txt = '☁ 有頁面太大未同步'; cls = 'warn'; }
      else if (cs === 'full') { txt = '☁ 雲端已滿'; cls = 'warn'; }
      else if (cs === 'error') { txt = '☁ 同步失敗（本機有存）'; cls = 'warn'; }
      else { txt = '✓ 已存在這台裝置'; cls = 'on'; }
    }
    chip.textContent = txt; chip.className = 'sync-chip ' + cls;
  }

  /* ---------------- 頁面操作 ---------------- */
  function updatePageInd() {
    const el = $('#pg-ind'); if (el) el.textContent = (st.current + 1) + ' / ' + st.pages.length;
  }
  function setCurrentPage(i) { if (i >= 0 && i !== st.current) { st.current = i; updatePageInd(); } }
  function trackCurrent() {
    const mid = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.4;
    for (let i = 0; i < st.pages.length; i++) {
      const r = st.pages[i].el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { setCurrentPage(i); return; }
    }
  }
  function scrollToPage(i, onlyIfHidden) {
    const pg = st.pages[i]; if (!pg) return;
    const sr = scroller.getBoundingClientRect(), r = pg.el.getBoundingClientRect();
    if (onlyIfHidden && r.bottom > sr.top + 40 && r.top < sr.bottom - 40) return;
    scroller.scrollTop += r.top - sr.top - 12;
  }
  async function addPage() {
    await flush();
    const at = st.current + 1, base = st.pages[st.current];
    const pg = { id: S.uid('p'), tpl: base ? base.tpl : st.nb.tpl, strokes: [], updated: 0 };
    st.pages.splice(at, 0, pg);
    st.nb.pages = st.pages.map(p => p.id);
    mountPage(pg, at); layoutPages();
    await S.savePage(st.nb, { id: pg.id, tpl: pg.tpl, strokes: [] });
    await S.saveNotebook(st.nb);
    setCurrentPage(at); scrollToPage(at); toast('已新增第 ' + (at + 1) + ' 頁');
  }
  async function deletePage() {
    const pg = st.pages[st.current]; if (!pg) return;
    if (st.pages.length === 1) { clearPage(); return; }
    if (!confirm('刪除第 ' + (st.current + 1) + ' 頁？這個動作不能復原。')) return;
    if (st.sel && st.sel.page === pg) clearSel();
    st.pages.splice(st.current, 1);
    st.nb.pages = st.pages.map(p => p.id);
    io.unobserve(pg.el); pg.el.remove();
    st.undo = st.undo.filter(o => o.page !== pg.id); st.redo = st.redo.filter(o => o.page !== pg.id); updateUndo();
    await S.deletePage(st.nb, pg.id);
    await S.saveNotebook(st.nb);
    st.current = Math.min(st.current, st.pages.length - 1);
    renumber(); toast('已刪除這一頁');
  }
  function clearPage() {
    const pg = st.pages[st.current]; if (!pg || !pg.strokes.length) return;
    if (st.sel) clearSel();
    const olds = pg.strokes.slice();
    pg.strokes = [];
    commit({ page: pg.id, removed: olds, added: [] }, true);
    toast('已清空這一頁（可以按復原）');
  }
  function setTemplate(tpl) {
    const pg = st.pages[st.current]; if (!pg) return;
    pg.tpl = tpl; st.nb.tpl = tpl;
    renderInk(pg); markDirty(pg);
  }
  function setPaper(paper) {
    if (paper === st.nb.paper) return;
    /* 換紙色時把「預設色盤裡的顏色」一起換成另一組，白字才不會跑到白紙上 */
    const from = st.nb.paper, map = {};
    INKS[from].forEach((c, i) => { map[c] = INKS[paper][i]; });
    HLS[from].forEach((c, i) => { map[c] = HLS[paper][i]; });
    st.nb.paper = paper;
    st.pages.forEach(pg => {
      let hit = false;
      pg.strokes = pg.strokes.map(s => (map[s.color] ? (hit = true, Object.assign({}, s, { color: map[s.color], _pk: null })) : s));
      if (hit) pg.dirty = true;
      renderInk(pg);
    });
    st.undo = []; st.redo = []; updateUndo();
    layoutPages(); buildSwatches(); markDirty(st.pages[0]);
  }

  /* ---------------- 縮放 ---------------- */
  let resizeT = 0;
  function setZoom(z, cx, cy) {
    z = clamp(z, 0.5, 3);
    if (Math.abs(z - st.zoom) < 0.001) return;
    const r = scroller.getBoundingClientRect();
    if (cx === undefined) { cx = r.left + scroller.clientWidth / 2; cy = r.top + scroller.clientHeight / 2; }
    const ax = scroller.scrollLeft + (cx - r.left), ay = scroller.scrollTop + (cy - r.top), ratio = z / st.zoom;
    st.zoom = z;
    layoutPages();
    scroller.scrollLeft = ax * ratio - (cx - r.left);
    scroller.scrollTop = ay * ratio - (cy - r.top);
    $('#z-ind').textContent = Math.round(z * 100) + '%';
    if (st.sel) hideSelBar();
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { st.pages.forEach(sizeCanvas); if (st.sel) showSelBar(); }, 180);
  }

  /* ---------------- 工具列 ---------------- */
  function setTool(t) {
    st.tool = t;
    if (t !== 'lasso' && st.sel) clearSel();
    document.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === t)));
    st.pages.forEach(pg => { pg.el.className = 'nb-page tool-' + t; });
    buildSwatches(); buildSizes();
  }
  function buildSwatches() {
    const box = $('#swatches'); if (!box) return;
    box.innerHTML = '';
    if (st.tool === 'eraser' || st.tool === 'lasso') { box.hidden = true; return; }
    box.hidden = false;
    const list = inkList(), key = st.tool === 'hl' ? 'hl' : 'pen';
    list.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch'; b.style.background = c;
      b.setAttribute('aria-label', '顏色 ' + (i + 1));
      b.setAttribute('aria-pressed', String(st.color[key] % list.length === i));
      b.addEventListener('click', () => { st.color[key] = i; buildSwatches(); });
      box.appendChild(b);
    });
  }
  function buildSizes() {
    const box = $('#sizes'); if (!box) return;
    box.innerHTML = '';
    if (st.tool === 'lasso') { box.hidden = true; return; }
    box.hidden = false;
    const key = st.tool, dots = key === 'eraser' ? [8, 13, 19] : key === 'hl' ? [8, 12, 17] : [4, 7, 11];
    dots.forEach((d, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'size-dot';
      b.setAttribute('aria-label', ['細', '中', '粗'][i]);
      b.setAttribute('aria-pressed', String(st.size[key] === i));
      b.innerHTML = '<i style="width:' + d + 'px;height:' + d + 'px' + (key === 'eraser' ? ';background:transparent;border:1.5px solid currentColor;color:var(--ink-2)' : '') + '"></i>';
      b.addEventListener('click', () => { st.size[key] = i; buildSizes(); });
      box.appendChild(b);
    });
  }
  function setFinger(on) {
    st.fingerDraw = on;
    lsSet('ee-notes-finger', on ? '1' : '0');
    document.body.classList.toggle('finger-draw', on);
  }

  /* 下拉選單：用頁面座標定位（捲動時不會被關掉） */
  function closeMenus() { document.querySelectorAll('.nb-menu').forEach(m => m.remove()); }
  function openMenu(anchor, items) {
    const open = document.querySelector('.nb-menu');
    closeMenus();
    if (open && open._anchor === anchor) return;
    const m = document.createElement('div');
    m.className = 'nb-menu'; m._anchor = anchor; m.setAttribute('role', 'menu');
    items.forEach(it => {
      if (it === '-') { m.appendChild(document.createElement('hr')); return; }
      if (it.h) { const h = document.createElement('h5'); h.textContent = it.h; m.appendChild(h); return; }
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = it.t; b.setAttribute('role', 'menuitem');
      if (it.checked !== undefined) b.setAttribute('aria-checked', String(!!it.checked));
      if (it.danger) b.className = 'danger';
      b.addEventListener('click', () => { closeMenus(); it.fn(); });
      m.appendChild(b);
    });
    document.body.appendChild(m);
    const r = anchor.getBoundingClientRect(), mw = m.offsetWidth;
    const left = clamp(r.right - mw + window.scrollX, window.scrollX + 12, window.scrollX + document.documentElement.clientWidth - mw - 12);
    m.style.left = left + 'px';
    m.style.top = (r.bottom + window.scrollY + 6) + 'px';
    const maxH = window.innerHeight - r.bottom - 20;
    if (maxH < m.offsetHeight) { m.style.maxHeight = Math.max(160, maxH) + 'px'; m.style.overflowY = 'auto'; }
  }
  function pageMenu(anchor) {
    const pg = st.pages[st.current];
    openMenu(anchor, [
      { h: '這一頁的背景' },
      ...Object.keys(TPLS).map(k => ({ t: TPLS[k], checked: pg && pg.tpl === k, fn: () => setTemplate(k) })),
      { h: '紙張顏色（整本）' },
      { t: '深色紙', checked: st.nb.paper === 'dark', fn: () => setPaper('dark') },
      { t: '白紙', checked: st.nb.paper === 'light', fn: () => setPaper('light') },
      '-',
      { t: '在後面新增一頁', fn: addPage },
      { t: '匯出這一頁（PNG 圖片）', fn: exportPNG },
      { t: '清空這一頁', fn: clearPage },
      { t: '刪除這一頁', danger: true, fn: deletePage }
    ]);
  }
  function settingsMenu(anchor) {
    openMenu(anchor, [
      { h: '書寫方式' },
      { t: '手指也能寫字', checked: st.fingerDraw, fn: () => { setFinger(!st.fingerDraw); toast(st.fingerDraw ? '手指會寫字；捲動請用兩指' : '手指捲動、觸控筆寫字'); } },
      { h: '橡皮擦' },
      { t: '整筆擦掉', checked: st.eraseMode === 'stroke', fn: () => { st.eraseMode = 'stroke'; lsSet('ee-notes-erase', 'stroke'); setTool('eraser'); } },
      { t: '只擦碰到的部分', checked: st.eraseMode === 'area', fn: () => { st.eraseMode = 'area'; lsSet('ee-notes-erase', 'area'); setTool('eraser'); } },
      { h: '說明' },
      { t: '顯示操作提示', fn: showHint }
    ]);
  }

  /* ---------------- 匯出 ---------------- */
  async function saveFile(filename, blob) {
    try {
      if (window.claude && typeof window.claude.use === 'function') {
        const dl = await Promise.race([window.claude.use('downloads'), new Promise(r => setTimeout(() => r(null), 1500))]);
        if (dl) {
          try { await dl.save({ filename, data: blob }); return true; }
          catch (e) { if (e && e.code === 'declined') return false; }
        }
      }
    } catch (e) {}
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return true;
  }
  function exportPNG() {
    const pg = st.pages[st.current]; if (!pg) return;
    const k = 1.6, c = document.createElement('canvas');
    c.width = PW * k; c.height = PH * k;
    const ctx = c.getContext('2d'); ctx.setTransform(k, 0, 0, k, 0, 0);
    drawPaper(ctx, pg.tpl, st.nb.paper);
    pg.strokes.forEach(s => drawStroke(ctx, s));
    c.toBlob(b => { if (b) saveFile(st.nb.title.replace(/[\\/:*?"<>|]/g, '_') + '-p' + (st.current + 1) + '.png', b); }, 'image/png');
  }

  /* ---------------- 講義並排 ---------------- */
  function chapterURL() { return st.nb.chapter ? '../' + st.nb.chapter + '.html' : ''; }
  function toggleRef(force) {
    const pane = $('#ref'), btn = $('#t-ref');
    const on = force !== undefined ? force : pane.hidden;
    if (on && window.innerWidth < 760) { flush().then(() => { location.href = chapterURL(); }); return; }
    pane.hidden = !on;
    if (on && !pane.querySelector('iframe').src) pane.querySelector('iframe').src = chapterURL() + '?embed=1';
    btn.setAttribute('aria-pressed', String(on));
    lsSet('ee-notes-ref', on ? '1' : '0');
    requestAnimationFrame(() => { layoutPages(); st.pages.forEach(sizeCanvas); });
  }

  function showHint() {
    let h = $('#hint');
    if (h) h.remove();
    h = document.createElement('div');
    h.id = 'hint'; h.className = 'nb-hint';
    h.innerHTML = '<b>用 Apple Pencil 寫、手指捲動。</b>兩指捏合可縮放。' +
      '畫線時<b>按住不動半秒</b>會拉成直線；套索圈起來可以移動、複製、改色。' +
      '沒有觸控筆的話，到工具列最右邊的「⚙」打開「手指也能寫字」。' +
      '<button class="btn" type="button">知道了</button>';
    scroller.parentNode.style.position = 'relative';
    scroller.parentNode.appendChild(h);
    h.querySelector('button').addEventListener('click', () => { h.remove(); lsSet('ee-notes-hint', '1'); });
  }

  /* ---------------- 開啟筆記本 ---------------- */
  function parseHash() {
    const out = {};
    location.hash.replace(/^#/, '').split('&').forEach(kv => {
      const i = kv.indexOf('='); if (i > 0) out[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
    });
    return out;
  }
  async function openNotebook() {
    await S.ready;
    const h = parseHash();
    let nb = null;
    if (h.id) nb = await S.getNotebook(h.id);
    if ((!nb || nb.deleted) && h.ch) {
      const list = await S.listNotebooks();
      nb = list.find(n => n.chapter === h.ch) || null;
      if (!nb) nb = await S.createNotebook({ title: h.t || h.ch, chapter: h.ch, chapterTitle: h.t || h.ch, paper: 'dark', tpl: 'grid' });
    }
    if (!nb || nb.deleted) { location.replace('index.html'); return; }
    try { history.replaceState(null, '', '#id=' + nb.id); } catch (e) {}
    st.nb = nb;
    await loadPages();
    render();
    S.connectCloud().then(async () => {
      if (S.cloudStatus !== 'on') return;
      const fresh = await S.getNotebook(nb.id);
      if (fresh && !fresh.deleted && (fresh.updated || 0) > (st.nb.updated || 0) && !st.pages.some(p => p.dirty)) {
        st.nb = fresh;
      }
      const changed = await S.syncPages(st.nb);
      const idsChanged = st.nb.pages.join() !== st.pages.map(p => p.id).join();
      if ((changed.length || idsChanged) && !st.pages.some(p => p.dirty) && !st.cur) {
        await loadPages(); render();
        toast('已載入其他裝置的最新內容');
      }
    });
  }
  async function loadPages() {
    const nb = st.nb;
    if (!nb.pages.length) nb.pages.push(S.uid('p'));
    st.pages = [];
    for (const pid of nb.pages) {
      const p = await S.loadPage(nb, pid);
      st.pages.push({ id: pid, tpl: p.tpl, strokes: sortStrokes(p.strokes), el: null, ink: null, live: null, dirty: false, k: 1 });
    }
    st.undo = []; st.redo = []; st.sel = null; st.current = 0;
  }
  function render() {
    const nb = st.nb;
    document.title = nb.title + ' · 手寫筆記';
    const ti = $('#nb-title'); ti.value = nb.title;
    const refBtn = $('#t-ref');
    refBtn.hidden = !nb.chapter;
    if (nb.chapter) {
      refBtn.title = '邊看講義邊寫：' + (nb.chapterTitle || nb.chapter);
      $('#ref-title').textContent = nb.chapterTitle || nb.chapter;
      $('#ref-open').href = chapterURL();
    }
    buildPages(); setTool(st.tool); updateUndo(); paintChip();
    $('#z-ind').textContent = Math.round(st.zoom * 100) + '%';
    if (nb.chapter && lsGet('ee-notes-ref') === '1' && window.innerWidth >= 760) toggleRef(true);
  }

  /* ---------------- 事件接線 ---------------- */
  function wire() {
    document.body.classList.toggle('finger-draw', st.fingerDraw);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    /* iPad：筆一碰到就擋掉捲動（手指照常捲）；兩指捏合 → 縮放 */
    let pinch = null, pinchRaf = 0;
    scroller.addEventListener('touchstart', e => {
      /* 正在寫字時，手掌碰到螢幕也不准捲動 */
      if (st.cur) { e.preventDefault(); return; }
      const ts = Array.prototype.slice.call(e.touches);
      if (Array.prototype.some.call(e.changedTouches, t => t.touchType === 'stylus') && e.target.closest('.nb-page')) {
        e.preventDefault(); return;
      }
      if (ts.length === 2 && !st.cur) {
        const [a, b] = ts;
        pinch = { d0: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1, z0: st.zoom };
      }
    }, { passive: false });
    scroller.addEventListener('touchmove', e => {
      if (st.cur) { e.preventDefault(); return; }
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      const [a, b] = e.touches;
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), mx = (a.clientX + b.clientX) / 2, my = (a.clientY + b.clientY) / 2;
      if (pinchRaf) return;
      pinchRaf = requestAnimationFrame(() => { pinchRaf = 0; setZoom(pinch ? pinch.z0 * d / pinch.d0 : st.zoom, mx, my); });
    }, { passive: false });
    scroller.addEventListener('touchend', e => { if (e.touches.length < 2) pinch = null; });
    scroller.addEventListener('wheel', e => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom(st.zoom * Math.exp(-e.deltaY * 0.0022), e.clientX, e.clientY);
    }, { passive: false });
    let spyRaf = 0;
    scroller.addEventListener('scroll', () => { if (!spyRaf) spyRaf = requestAnimationFrame(() => { spyRaf = 0; trackCurrent(); }); });
    new ResizeObserver(() => {
      if (!st.nb) return;
      layoutPages();
      clearTimeout(resizeT); resizeT = setTimeout(() => { st.pages.forEach(sizeCanvas); if (st.sel) showSelBar(); }, 150);
    }).observe(scroller);

    document.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));
    $('#t-undo').addEventListener('click', undo);
    $('#t-redo').addEventListener('click', redo);
    $('#t-addpg').addEventListener('click', addPage);
    $('#t-page').addEventListener('click', e => pageMenu(e.currentTarget));
    $('#t-set').addEventListener('click', e => settingsMenu(e.currentTarget));
    $('#t-zin').addEventListener('click', () => setZoom(st.zoom * 1.25));
    $('#t-zout').addEventListener('click', () => setZoom(st.zoom / 1.25));
    $('#z-ind').addEventListener('click', () => setZoom(1));
    $('#t-ref').addEventListener('click', () => toggleRef());
    $('#ref-close').addEventListener('click', () => toggleRef(false));
    document.addEventListener('pointerdown', e => { if (!e.target.closest('.nb-menu') && !e.target.closest('#t-page') && !e.target.closest('#t-set')) closeMenus(); });

    const ti = $('#nb-title');
    ti.addEventListener('change', () => {
      const v = ti.value.trim() || '未命名筆記本';
      ti.value = v; st.nb.title = v; document.title = v + ' · 手寫筆記';
      S.saveNotebook(st.nb).then(() => setSaveState('saved'));
    });
    ti.addEventListener('keydown', e => { if (e.key === 'Enter') ti.blur(); });

    document.addEventListener('keydown', e => {
      if (e.target.closest('input, textarea')) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
      else if (!mod && !e.altKey) {
        const map = { p: 'pen', h: 'hl', e: 'eraser', l: 'lasso' };
        if (map[e.key]) setTool(map[e.key]);
        if ((e.key === 'Delete' || e.key === 'Backspace') && st.sel) {
          const b = document.querySelector('.sel-bar [data-act="del"]'); if (b) b.click();
        }
        if (e.key === 'Escape') { clearSel(); closeMenus(); }
      }
    });
    const bye = () => { flush(); };
    document.addEventListener('visibilitychange', () => { if (document.hidden) bye(); });
    window.addEventListener('pagehide', bye);

    const tb = $('#theme-btn');
    if (tb) tb.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      lsSet('ee-theme', isDark ? 'light' : 'dark');
    });
    S.onCloud(() => paintChip());
  }

  const th = lsGet('ee-theme'); if (th) document.documentElement.setAttribute('data-theme', th);
  wire();
  openNotebook().then(() => { if (!lsGet('ee-notes-hint')) showHint(); })
    .catch(err => { toast('開啟筆記時出錯：' + (err && err.message || err), 5000); });

  /* 給自動化測試用：看得到內部狀態，但不影響使用 */
  window.__Ink = { st, flush, undo, redo, setTool, setZoom, addPage, setPaper, PW, PH };
})();
