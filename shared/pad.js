/* ============================================================
   手寫板（給 iPad + Apple Pencil）
   用法：<div class="pad" data-id="唯一 id"></div>，或 __PAD.mount(el, id)
   - 筆跡座標存成「寬度的比例」(x/W, y/W)，換螢幕大小、轉方向都不會跑掉
   - 自動存在這台裝置（localStorage），讀寫都包 try/catch；存不了也能正常寫
   - 偵測到 Apple Pencil 之後，手指在板子上是捲動頁面（不會畫到）；按「手指也能畫」可以切換
   - 墨水色吃網站的 --ink，暗色模式也看得清楚
   ============================================================ */
(function () {
  'use strict';
  const KEY = id => 'ee-pad:' + id;
  const load = id => { try { return JSON.parse(localStorage.getItem(KEY(id)) || 'null'); } catch (e) { return null; } };
  const save = (id, d) => { try { localStorage.setItem(KEY(id), JSON.stringify(d)); } catch (e) {} };
  let penSeen = false;

  function mount(host, id) {
    id = id || host.dataset.id;
    const st = load(id) || { h: 0.62, strokes: [] };
    let tool = 'pen', finger = false, cur = null;
    host.classList.add('pad');
    host.innerHTML =
      '<div class="pad-bar">' +
        '<button type="button" data-t="pen" class="on">✎ 筆</button>' +
        '<button type="button" data-t="eraser">⌫ 橡皮擦</button>' +
        '<button type="button" data-a="undo">↶ 復原</button>' +
        '<button type="button" data-a="clear">清除</button>' +
        '<button type="button" data-a="taller">＋ 加高</button>' +
        '<button type="button" data-a="finger" class="pad-finger">手指也能畫</button>' +
      '</div><div class="pad-wrap"><canvas></canvas><span class="pad-hint">在這裡寫算式（Apple Pencil／滑鼠）</span></div>';
    const cv = host.querySelector('canvas'), wrap = host.querySelector('.pad-wrap'), hint = host.querySelector('.pad-hint');
    const ctx = cv.getContext('2d');
    let W = 1;

    function size() {
      W = Math.max(1, wrap.clientWidth);
      const H = Math.round(W * st.h), dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.style.height = H + 'px'; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function ink() { const cs = getComputedStyle(host); return cs.getPropertyValue('--ink').trim() || '#222'; }
    function line(c) { const cs = getComputedStyle(host); return cs.getPropertyValue(c).trim() || '#ccc'; }
    function drawStroke(s, col) {
      const p = s.p; if (!p.length) return;
      ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (p.length === 1) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p[0][0] * W, p[0][1] * W, 1.4, 0, 6.3); ctx.fill(); return; }
      for (let i = 1; i < p.length; i++) {
        ctx.lineWidth = Math.max(0.8, 2.6 * (p[i][2] || 0.5));
        ctx.beginPath(); ctx.moveTo(p[i - 1][0] * W, p[i - 1][1] * W); ctx.lineTo(p[i][0] * W, p[i][1] * W); ctx.stroke();
      }
    }
    function draw() {
      const H = W * st.h;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = line('--line-soft'); ctx.lineWidth = 1;
      for (let y = 28; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const col = ink();
      st.strokes.forEach(s => drawStroke(s, col));
      hint.style.display = st.strokes.length ? 'none' : '';
    }
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / W, (e.clientY - r.top) / W, e.pressure || 0.5]; };
    function eraseAt(q) {
      const R = 12 / W, before = st.strokes.length;
      st.strokes = st.strokes.filter(s => !s.p.some(p => Math.hypot(p[0] - q[0], p[1] - q[1]) < R));
      if (st.strokes.length !== before) draw();
    }
    cv.addEventListener('pointerdown', e => {
      if (e.pointerType === 'pen') penSeen = true;
      if (e.pointerType === 'touch' && penSeen && !finger) return;   /* 有筆的時候，手指拿來捲動 */
      e.preventDefault(); cv.setPointerCapture(e.pointerId);
      const q = pos(e);
      if (tool === 'eraser') { cur = { erase: true }; eraseAt(q); return; }
      cur = { p: [q] }; st.strokes.push(cur); draw();
    });
    cv.addEventListener('pointermove', e => {
      if (!cur) return; e.preventDefault();
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      evs.forEach(ev => {
        const q = pos(ev);
        if (cur.erase) eraseAt(q);
        else { cur.p.push(q); const n = cur.p.length; drawStroke({ p: cur.p.slice(n - 2) }, ink()); }
      });
    });
    const end = () => { if (cur) { cur = null; save(id, st); draw(); } };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    /* iPad Safari：Apple Pencil 的 touch 要擋掉預設捲動，手指照常捲動 */
    const stylus = e => { if (finger || Array.prototype.some.call(e.touches, t => t.touchType === 'stylus')) e.preventDefault(); };
    cv.addEventListener('touchstart', stylus, { passive: false });
    cv.addEventListener('touchmove', stylus, { passive: false });

    host.querySelector('.pad-bar').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.t) { tool = b.dataset.t; host.querySelectorAll('[data-t]').forEach(x => x.classList.toggle('on', x === b)); }
      const a = b.dataset.a;
      if (a === 'undo') { st.strokes.pop(); save(id, st); draw(); }
      if (a === 'clear' && (!st.strokes.length || window.confirm('清除這一題的手寫？'))) { st.strokes = []; save(id, st); draw(); }
      if (a === 'taller') { st.h = Math.min(3, st.h + 0.35); save(id, st); size(); }
      if (a === 'finger') { finger = !finger; b.classList.toggle('on', finger); cv.style.touchAction = finger ? 'none' : 'pan-y'; }
    });
    cv.style.touchAction = 'pan-y';
    new ResizeObserver(size).observe(wrap);
    size();
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  function init() { document.querySelectorAll('.pad[data-id]').forEach(el => { if (!el.dataset.ok) { el.dataset.ok = 1; mount(el); } }); }
  window.__PAD = { mount, init };
})();
