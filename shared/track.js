/* ============================================================
   學習紀錄：講義小節、故事畫面、題目，「互動到就記一次」，每一筆都可以單獨刪除
   ------------------------------------------------------------
   - 講義小節：碰了該節的互動（滑桿、按鈕、畫布、例題…）或在畫面上停留 30 秒 → 自動記；也可手動「✓ 標記讀過」
   - 故事模式：真的切到某個畫面就記（載入時還原進度不算）
   - 題目：測驗、作業原題／仿作業、課本 Example／Practice；記「做過」＋最近一次對錯
   - 儲存：先存這台裝置（localStorage），在 claude.ai 打開時同步到雲端 data/users/<你>/trk_<章>
     每一筆帶時間；兩邊合併時「時間比較新的那一筆」贏（刪除也是一筆，不會被舊資料復活）
   - 一章一份紀錄（key = 科目資料夾/檔名，例 electronics/ch1-part1）；作業題另存 <科目>/hw1
   - 科目首頁：每張章節卡片下面顯示進度條
   ============================================================ */
(function () {
  'use strict';
  const NOW = () => Date.now();
  const md = t => { const d = new Date(t); return (d.getMonth() + 1) + '/' + d.getDate(); };
  const keyOf = href => {
    const u = new URL(href || location.href, location.href);
    const seg = u.pathname.split('/').filter(Boolean);
    const f = (seg.pop() || 'index.html').replace(/\.html?$/, '');
    return (seg.pop() || 'root') + '/' + f;
  };
  const PAGE = keyOf();
  const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  const plain = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const FILE = (location.pathname.split('/').pop() || 'index.html');
  const headTxt = (el, n) => { if (!el) return ''; const c = el.cloneNode(true); c.querySelectorAll('.trk-b').forEach(x => x.remove()); return plain(c.innerHTML.replace(/<\/(span|b)>/g, ' </$1>')).slice(0, n); };
  const cut = (h, n) => { h = String(h || ''); return h.length > (n || 2000) ? plain(h).slice(0, n || 2000) + '…' : h; };

  /* 使用者 10/3 說：電子學 PART 1 讀到 §05 —— 先標成讀過（刪掉也不會再自動補回來） */
  const SEED = {
    'electronics/ch1-part1': { v: 'v1', t: Date.UTC(2026, 9, 3, 4), keys: ['sec:signal', 'sec:atom', 'sec:bond', 'sec:lattice', 'sec:band'] }
  };

  /* ---------------- 本機 ---------------- */
  const docs = {};
  const norm = d => ({ recs: (d && d.recs) || {}, tot: (d && d.tot) || {}, seed: (d && d.seed) || {} });
  const lsGet = k => { try { return JSON.parse(localStorage.getItem('ee-trk:' + k) || 'null'); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem('ee-trk:' + k, JSON.stringify(v)); } catch (e) {} };
  function doc(k) {
    if (!docs[k]) {
      docs[k] = norm(lsGet(k));
      const s = SEED[k];
      if (s && !docs[k].seed[s.v]) {
        s.keys.forEach(key => { if (!docs[k].recs[key]) docs[k].recs[key] = { t: s.t }; });
        docs[k].seed[s.v] = 1; save(k);
      }
    }
    return docs[k];
  }
  function merge(a, b) {
    const out = norm(JSON.parse(JSON.stringify(a))), r = norm(b);
    Object.keys(r.recs).forEach(k => { const x = out.recs[k], y = r.recs[k]; if (!x || (y.t || 0) > (x.t || 0)) out.recs[k] = y; });
    Object.assign(out.seed, r.seed);
    out.tot = Object.assign({}, r.tot, out.tot);
    return out;
  }
  const listeners = [];
  const emit = () => listeners.forEach(fn => { try { fn(); } catch (e) {} });
  const get = (k, key) => { const r = doc(k).recs[key]; return r && !r.x ? r : null; };
  function set(k, key, data) { doc(k).recs[key] = Object.assign({ t: NOW() }, data || {}); save(k); emit(); }
  /* 作答：ok=最近一次對錯；w=第一次答錯的時間（之後答對也留著 → 顯示「答錯 → 訂正」） */
  function answer(k, key, ok, extra) {
    const prev = get(k, key), r = Object.assign({}, extra || {});
    if (ok === true || ok === false) r.ok = ok; else if (prev && 'ok' in prev) r.ok = prev.ok;
    const w = prev && (prev.w || (prev.ok === false ? prev.t : 0));
    if (w) r.w = w;
    set(k, key, r);
  }
  function del(k, key) { doc(k).recs[key] = { t: NOW(), x: 1 }; save(k); emit(); }
  function save(k) { lsSet(k, docs[k]); push(k); }

  /* ---------------- 雲端 ---------------- */
  const cloud = { col: null, status: 'local', timers: {}, busy: {}, again: {} };
  const docId = k => 'trk_' + k.replace(/[^A-Za-z0-9_-]/g, '_');
  function setStatus(s) { cloud.status = s; emit(); }
  function push(k) {
    if (!cloud.col) return;
    clearTimeout(cloud.timers[k]);
    cloud.timers[k] = setTimeout(() => send(k), 1200);
  }
  async function send(k) {
    if (cloud.busy[k]) { cloud.again[k] = 1; return; }
    cloud.busy[k] = 1;
    try {
      const d = docs[k];
      await cloud.col.doc(docId(k)).set({ kind: 'trk', ch: k, recs: d.recs, tot: d.tot, seed: d.seed, updated: NOW() });
      if (cloud.status !== 'on') setStatus('on');
    } catch (e) { setStatus('error'); }
    cloud.busy[k] = 0;
    if (cloud.again[k]) { cloud.again[k] = 0; send(k); }
  }
  async function pull(k) {
    try {
      const snap = await cloud.col.doc(docId(k)).get();
      const before = JSON.stringify(docs[k] || null);
      const m = snap.exists ? merge(doc(k), snap.data()) : doc(k);
      docs[k] = m; lsSet(k, m);
      if (!snap.exists || JSON.stringify(m.recs) !== JSON.stringify(norm(snap.data()).recs)) send(k);
      if (before !== JSON.stringify(m)) emit();
    } catch (e) { setStatus('error'); }
  }
  async function connect() {
    try {
      if (!window.claude || typeof window.claude.use !== 'function') return false;
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      const id = user ? await user.id() : null;
      if (!db || !id) return true;
      cloud.col = db.collection('data/users/' + id);
      setStatus('on');
      await Promise.all(Object.keys(docs).map(pull));
    } catch (e) { setStatus('error'); }
    return true;
  }
  /* 第一次用到某一份紀錄（例：首頁才知道要看 hw1）→ 已連上雲端就順便拉一次 */
  function ensure(k) { if (!docs[k]) { doc(k); if (cloud.col) pull(k); } return docs[k]; }
  (function tryConnect(n) { connect().then(ok => { if (!ok && n < 5) setTimeout(() => tryConnect(n + 1), 800 * (n + 1)); }); })(0);

  /* ---------------- 小元件 ---------------- */
  const xBtn = (k, key) => '<button type="button" class="trk-x" data-doc="' + k + '" data-key="' + key + '" title="刪除這筆紀錄" aria-label="刪除這筆紀錄">✕</button>';
  /* 內容沒變就不要動 DOM（否則 MutationObserver 會一直觸發自己） */
  const setH = (el, h) => { if (el.__h !== h) { el.__h = h; el.innerHTML = h; } };
  /* 題目紀錄的標籤：答錯＝紅、答錯後訂正＝橘、答對／做過＝綠 */
  const state = r => !r ? '' : r.ok === false ? 'ng' : r.w ? 'fix' : 'ok';
  const tagTxt = r => r.ok === false ? '✗ 答錯 ' + md(r.t) + (r.w && r.w < r.t - 6e4 ? '（' + md(r.w) + ' 起）' : '')
    : r.w ? '✗ ' + md(r.w) + ' 答錯 → ✓ ' + md(r.t) + ' 訂正' : r.ok === true ? '✓ 答對 ' + md(r.t) : '✓ 做過 ' + md(r.t);
  function badge(b, k, key, r, card) {
    const st = state(r);
    b.className = 'trk-b' + (st === 'ok' ? '' : ' ' + st);
    setH(b, r ? tagTxt(r) + ' ' + xBtn(k, key) : '');
    if (card) { card.classList.toggle('trk-wrong', st === 'ng'); card.classList.toggle('trk-fixed', st === 'fix'); }
  }
  document.addEventListener('click', e => {
    const x = e.target.closest && e.target.closest('.trk-x');
    if (x) { e.preventDefault(); e.stopPropagation(); del(x.dataset.doc, x.dataset.key); return; }
    const m = e.target.closest && e.target.closest('.trk-mark');
    if (m) { e.preventDefault(); e.stopPropagation(); set(m.dataset.doc, m.dataset.key, { by: 'hand' }); }
  }, true);

  /* ================= 錯題本（答錯＝紅、答錯後訂正＝橘） ================= */
  const KIND = { q: '測驗', hw: '作業', pp: 'Practice' };
  const fileOf = k => k.split('/').pop() + '.html';
  /* keys：要掃的紀錄；hwPairs：頁面上作業卡片 'doc|cardId'；seen：跨群組去重 */
  function mkCollect(keys, hwPairs, seen) {
    const out = []; seen = seen || {};
    const add = (k, key) => {
      const id = k + '|' + key, r = get(k, key), st = state(r);
      if (seen[id] || !r || !/^(q|hw|pp):/.test(key) || (st !== 'ng' && st !== 'fix')) return;
      seen[id] = 1; out.push({ k, key, r, st });
    };
    (hwPairs || []).forEach(x => { const i = x.indexOf('|'); ensure(x.slice(0, i)); add(x.slice(0, i), 'hw:' + x.slice(i + 1)); });
    keys.forEach(k => { const d = ensure(k); Object.keys(d.recs).forEach(key => add(k, key)); });
    return out.sort((a, b) => (a.st === b.st ? b.r.t - a.r.t : a.st === 'ng' ? -1 : 1));
  }
  function mkItem(m) {
    const r = m.r, p = m.key.split(':')[0], id = m.key.slice(p.length + 1), d = r.d || {};
    const href = r.u || fileOf(m.k) + (p === 'q' ? '#quiz-sec' : '#' + id);
    const body = d.q ? '<details class="mk-d"><summary>看題目和答案</summary><div class="mk-q">' + d.q + '</div>' +
      (d.my ? '<div class="mk-row ng"><b>你選：</b>' + d.my + '</div>' : '') + (d.ans ? '<div class="mk-row ok"><b>正解：</b>' + String(d.ans).replace(/^\s*<b>答案：<\/b>/, '') + '</div>' : '') +
      (d.e ? '<div class="mk-e">' + d.e + '</div>' : '') + '</details>' : '';
    return '<li class="mk-item ' + m.st + '"><div class="mk-top"><span class="mk-kind">' + (/^老師範例/.test(r.s || '') ? '老師範例' : KIND[p]) + '</span>' +
      '<span class="trk-b ' + m.st + '">' + tagTxt(r) + ' ' + xBtn(m.k, m.key) + '</span></div>' +
      '<div class="mk-s">' + (r.s || '（題目）') + '</div>' + body + '<a class="mk-go" href="' + href + '">回原題重做 →</a></li>';
  }
  /* 從錯題本點回原題：題目可能收在 <details> 裡，或是 JS 晚一點才長出來 → 打開並捲過去 */
  function reveal() {
    const id = decodeURIComponent(location.hash.slice(1)), t = id && document.getElementById(id); if (!t) return;
    for (let p = t.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
    setTimeout(() => t.scrollIntoView({ block: 'start' }), 60);
  }
  window.addEventListener('load', () => setTimeout(reveal, 250));
  window.addEventListener('hashchange', reveal);

  /* ================= 科目首頁：章節卡片進度 ================= */
  const cards = Array.prototype.slice.call(document.querySelectorAll('a.chap[href]:not([data-trk-skip])'));
  const mkCard = document.querySelector('a.mk-card');
  if (cards.length) {
    cards.forEach(a => { const k = keyOf(a.getAttribute('href')); (doc(k).tot.hw || []).forEach(s => doc(s.split('|')[0])); a.dataset.trk = k; });
    const paint = () => cards.forEach(a => {
      const k = a.dataset.trk, d = doc(k), recs = Object.keys(d.recs).filter(x => !d.recs[x].x);
      const n = p => recs.filter(x => x.indexOf(p) === 0).length;
      const T = d.tot || {}, own = recs.filter(x => /^(q|ex|pp):/.test(x));
      /* 這一章頁面上的作業卡片，紀錄存在 <科目>/hw1，要另外算進來 */
      const hw = (T.hw || []).map(s => { const i = s.indexOf('|'); ensure(s.slice(0, i)); return get(s.slice(0, i), 'hw:' + s.slice(i + 1)); }).filter(Boolean);
      const sec = n('sec:'), sc = n('sc:'), q = own.length + hw.length;
      const qr = own.map(x => d.recs[x]).concat(hw), ng = qr.filter(r => state(r) === 'ng').length, fix = qr.filter(r => state(r) === 'fix').length;
      let el = a.querySelector('.trk-card');
      if (!el) { el = document.createElement('span'); el.className = 'trk-card'; (a.querySelector('.chap-body') || a).appendChild(el); }
      const pct = T.sec ? Math.round(sec / T.sec * 100) : 0;
      setH(el, !recs.length && !hw.length ? '<span class="trk-none">還沒有學習紀錄</span>' :
        '<span class="trk-bar"><i style="width:' + pct + '%"></i></span>' +
        '<span>講義 ' + sec + (T.sec ? '/' + T.sec : '') + ' · 故事 ' + sc + (T.sc ? '/' + T.sc : '') + ' 畫面 · 題目 ' + q + (T.q ? '/' + T.q : '') + '</span>' + (ng ? '<span class="trk-b ng">✗ 答錯 ' + ng + '</span>' : '') + (fix ? '<span class="trk-b fix">已訂正 ' + fix + '</span>' : ''));
    });
    const paintMk = () => {
      if (!mkCard) return;
      const seen = {}, all = [];
      cards.forEach(a => { all.push.apply(all, mkCollect([a.dataset.trk], doc(a.dataset.trk).tot.hw, seen)); });
      const ng = all.filter(m => m.st === 'ng').length, fix = all.length - ng;
      let el = mkCard.querySelector('.trk-card');
      if (!el) { el = document.createElement('span'); el.className = 'trk-card'; (mkCard.querySelector('.chap-body') || mkCard).appendChild(el); }
      setH(el, !all.length ? '<span class="trk-none">目前沒有錯題</span>' : (ng ? '<span class="trk-b ng">✗ 還沒訂正 ' + ng + '</span>' : '') + (fix ? '<span class="trk-b fix">已訂正 ' + fix + '</span>' : ''));
    };
    listeners.push(paint, paintMk); paint(); paintMk();
    return;
  }

  /* ================= 科目錯題本頁 ================= */
  const book = document.getElementById('mk-book');
  if (book) {
    const chs = JSON.parse(book.dataset.chs || '[]');   /* [[key, 名稱], …]，作業那一份放最後 */
    chs.forEach(c => (ensure(c[0]).tot.hw || []).forEach(x => ensure(x.split('|')[0])));
    let filter = 'all';
    book.innerHTML = '<div class="mk-filter" role="tablist"></div><div class="mk-groups"></div>';
    const fBox = book.querySelector('.mk-filter'), gBox = book.querySelector('.mk-groups');
    fBox.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) { filter = b.dataset.f; paintBook(); } });
    function paintBook() {
      const seen = {}, groups = chs.map(c => ({ c, list: mkCollect([c[0]], doc(c[0]).tot.hw, seen) }));
      const all = [].concat.apply([], groups.map(g => g.list)), ng = all.filter(m => m.st === 'ng').length;
      setH(fBox, [['all', '全部', all.length], ['ng', '還沒訂正', ng], ['fix', '已訂正', all.length - ng]].map(f =>
        '<button type="button" data-f="' + f[0] + '" class="' + (filter === f[0] ? 'on' : '') + '">' + f[1] + ' <i>' + f[2] + '</i></button>').join(''));
      const html = groups.map(g => {
        const list = g.list.filter(m => filter === 'all' || m.st === filter); if (!list.length) return '';
        return '<h3 class="mk-ch"><a href="' + fileOf(g.c[0]) + '">' + g.c[1] + '</a><small>' + list.length + ' 題</small></h3><ol class="mk-list">' + list.map(mkItem).join('') + '</ol>';
      }).join('');
      setH(gBox, html || '<p class="mk-empty">' + (all.length ? '這個分類沒有題目。' : '目前沒有錯題。答錯的測驗、作業、Practice 會自動收進來。') + '</p>');
    }
    listeners.push(paintBook); paintBook();
    return;
  }

  /* ================= 章節頁 ================= */
  const main = document.querySelector('main'); if (!main) return;
  const SKIP = new Set(['story-sec', 'quiz-sec', 'glossary', 'check', 'hw', 'map', 'scope', 'ref', 'later', 'mistakes']);
  const trackSecs = document.body.dataset.trkSec !== '0';
  const secs = trackSecs ? Array.prototype.slice.call(main.querySelectorAll('section.sec[id]')).filter(s => !SKIP.has(s.id) && !/^p\d$/.test(s.id)) : [];
  const secName = s => plain((s.querySelector('h2') || {}).innerHTML).replace(/[A-Z][A-Z0-9 ·&;,'’.\-–()/]+$/, '').trim();

  /* --- 講義小節 --- */
  secs.forEach(s => {
    const row = document.createElement('div'); row.className = 'trk-row'; row.dataset.key = 'sec:' + s.id;
    const h2 = s.querySelector('h2'); if (h2) h2.after(row); else s.prepend(row);
    const mark = () => { if (!get(PAGE, 'sec:' + s.id)) set(PAGE, 'sec:' + s.id, { by: 'auto' }); };
    ['pointerdown', 'input', 'change'].forEach(ev => s.addEventListener(ev, e => { if (!e.target.closest('.trk-row, .trk-x, .trk-mark, .tm')) mark(); }, true));
    s.__mark = mark; s.__dwell = 0;
  });
  if (secs.length && 'IntersectionObserver' in window) {
    const vis = new Set();
    const io = new IntersectionObserver(es => es.forEach(en => {
      const vh = window.innerHeight || 800, r = en.intersectionRect;
      (en.isIntersecting && (r.height > vh * 0.45 || en.intersectionRatio > 0.6)) ? vis.add(en.target) : vis.delete(en.target);
    }), { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    secs.forEach(s => io.observe(s));
    setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      vis.forEach(s => { if (s.hidden) return; s.__dwell++; if (s.__dwell >= 30) s.__mark(); });
    }, 1000);
  }

  /* --- 故事 --- */
  const storyRoot = document.getElementById('story');
  const scKey = t => 'sc:' + plain(t);
  if (storyRoot) storyRoot.addEventListener('story:view', e => { const k = scKey(e.detail.t); if (!get(PAGE, k)) set(PAGE, k, {}); });
  const storyBox = storyRoot ? document.createElement('details') : null;
  if (storyBox) { storyBox.className = 'trk-list'; storyRoot.after(storyBox); }

  /* --- 測驗（各章自己的 quiz 引擎：點選項之後看按鈕是 right 還是 wrong） --- */
  const quizHost = document.querySelector('.quiz');
  const qKey = host => { const t = host.querySelector('.q-text'); return t ? 'q:' + hash(plain(t.innerHTML)) : null; };
  if (quizHost) {
    quizHost.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b) return;
      setTimeout(() => {
        const k = qKey(quizHost); if (!k) return;
        if (!b.classList.contains('right') && !b.classList.contains('wrong')) return;
        /* 錯題本要用：題目、你選的、正解、解釋 */
        const qt = quizHost.querySelector('.q-text'), en = quizHost.querySelector('.q-en'), rt = quizHost.querySelector('.opt.right');
        const optH = o => o ? (o.querySelector('span') || o).innerHTML : '';
        answer(PAGE, k, b.classList.contains('right'), { s: plain(qt.innerHTML).slice(0, 48), u: FILE + '#quiz-sec',
          d: { q: cut(qt.innerHTML) + (en ? '<div class="q-en">' + cut(en.innerHTML, 800) + '</div>' : ''), my: cut(optH(b), 600), ans: cut(optH(rt), 600), e: cut((quizHost.querySelector('.explain') || {}).innerHTML) } });
      }, 0);
    });
    new MutationObserver(() => decorateQuiz()).observe(quizHost, { childList: true });
  }
  const quizBox = quizHost ? document.createElement('details') : null;
  if (quizBox) { quizBox.className = 'trk-list'; quizHost.after(quizBox); }
  function quizTotal() { const t = quizHost && quizHost.querySelector('.q-no'); const m = t && t.textContent.match(/共\s*(\d+)\s*題/); if (m) quizHost.dataset.total = m[1]; return +(quizHost && quizHost.dataset.total || 0); }
  function decorateQuiz() {
    if (!quizHost) return;
    quizTotal();
    const qn = quizHost.querySelector('.q-no'), k = qKey(quizHost); if (!qn || !k) return;
    let b = qn.querySelector('.trk-b'); if (!b) { b = document.createElement('span'); b.className = 'trk-b'; qn.appendChild(b); }
    badge(b, PAGE, k, get(PAGE, k));
  }

  /* --- 作業卡片、課本例題卡片（會被重畫，所以每次都重新貼） --- */
  document.addEventListener('click', e => {
    const hw = e.target.closest && e.target.closest('.hw-card');
    if (hw && e.target.closest('.hw-check')) {
      setTimeout(() => {
        const sels = hw.querySelectorAll('.hw-sel');
        const ok = sels.length ? Array.prototype.every.call(sels, s => s.classList.contains('ok')) : null;
        /* 題目裡的下拉選單換成「你選的 → 正解」 */
        const q = hw.querySelector('.hw-q').cloneNode(true);
        q.querySelectorAll('.hw-sel').forEach(sel => {
          const live = hw.querySelector('.hw-sel[data-i="' + sel.dataset.i + '"]'), tip = live.nextElementSibling;
          const pick = live.selectedIndex > 0 ? live.options[live.selectedIndex].text : '（沒選）';
          const u = document.createElement('span'); u.className = 'mk-pick ' + (live.classList.contains('ok') ? 'ok' : 'ng');
          u.innerHTML = '［' + pick + (live.classList.contains('ok') ? '' : ' <b>' + (tip && tip.classList.contains('hw-right') ? tip.innerHTML : '') + '</b>') + '］';
          sel.replaceWith(u);
        });
        q.querySelectorAll('.hw-right').forEach(t => t.remove());
        answer(hw.dataset.trkDoc || PAGE, 'hw:' + hw.id, ok, { s: headTxt(hw.querySelector('.hw-head'), 40), u: FILE + '#' + hw.id,
          d: { q: cut(q.innerHTML, 3000), e: cut((hw.querySelector('.hw-ans') || {}).innerHTML) } });
      }, 0);
      return;
    }
    const xb = e.target.closest && e.target.closest('.xb-card'); if (!xb) return;
    const isEx = xb.classList.contains('is-ex'), key = (isEx ? 'ex:' : 'pp:') + xb.id;
    const a = e.target.closest('[data-a]'), self = e.target.closest('[data-s]');
    const prev = get(PAGE, key);
    if (self) {
      const ans = xb.querySelector('.xb-ans').cloneNode(true); ans.querySelectorAll('.xb-self').forEach(x => x.remove());
      answer(PAGE, key, self.dataset.s === '1', { s: headTxt(xb.querySelector('.xb-head'), 48), u: FILE + '#' + xb.id,
        d: { q: cut((xb.querySelector('.xb-q') || {}).innerHTML, 3000), ans: cut(ans.innerHTML, 800) } });
    }
    else if (a && (isEx ? /next|all/ : /sol|ans/).test(a.dataset.a) && !prev) set(PAGE, key, {});
  });
  document.addEventListener('pointerup', e => {
    const xb = e.target.closest && e.target.closest('.xb-card.is-pp');
    if (xb && e.target.closest('.pad-wrap, .ann-pad-body')) { const k = 'pp:' + xb.id; if (!get(PAGE, k)) set(PAGE, k, {}); }
  });
  function decorateCards() {
    document.querySelectorAll('.hw-card, .xb-card').forEach(c => {
      const isHw = c.classList.contains('hw-card');
      const k = isHw ? (c.dataset.trkDoc || PAGE) : PAGE, key = isHw ? 'hw:' + c.id : (c.classList.contains('is-ex') ? 'ex:' : 'pp:') + c.id;
      const head = c.querySelector(isHw ? '.hw-head' : '.xb-head'); if (!head) return;
      ensure(k);
      let b = head.querySelector('.trk-b'); if (!b) { b = document.createElement('span'); b.className = 'trk-b'; head.appendChild(b); }
      badge(b, k, key, get(k, key), c);
    });
  }
  let cardTimer = 0;
  new MutationObserver(() => { clearTimeout(cardTimer); cardTimer = setTimeout(decorateCards, 60); }).observe(main, { childList: true, subtree: true });

  /* --- 這一章的錯題（放在頁尾前面） --- */
  const mkSec = document.createElement('section');
  mkSec.className = 'sec'; mkSec.id = 'mistakes'; mkSec.hidden = true;
  mkSec.innerHTML = '<div class="eyebrow">錯題本 · Mistakes</div><h2>這一章的錯題 <span class="h2-en">MISTAKES</span></h2>' +
    '<p class="mk-lead">答錯的題目會自動收進來；之後再做一次答對，會變成橘色的「已訂正」，留著考前複習。<a href="mistakes.html">看整科的錯題本 →</a></p><ol class="mk-list"></ol>';
  const foot = main.querySelector('footer.foot'); if (foot && foot.parentElement === main) main.insertBefore(mkSec, foot); else main.appendChild(mkSec);
  const mkList = mkSec.querySelector('.mk-list');

  /* --- 頁首總覽 --- */
  const hero = main.querySelector('.hero');
  const sum = document.createElement('div'); sum.className = 'trk-sum';
  if (hero) hero.appendChild(sum); else main.prepend(sum);
  sum.addEventListener('click', e => {
    const btn = e.target.closest('[data-clear]'); if (!btn) return;
    const onlyQ = btn.dataset.clear === 'q', isQ = key => /^(q|ex|pp|hw):/.test(key);
    if (!window.confirm(onlyQ ? '清除這一頁所有題目的紀錄？（測驗、作業、Example、Practice；講義和故事的紀錄會留著）' : '清除這一頁的全部學習紀錄？（講義、故事、題目）')) return;
    const d = doc(PAGE); Object.keys(d.recs).forEach(key => { if (!d.recs[key].x && (!onlyQ || isQ(key))) d.recs[key] = { t: NOW(), x: 1 }; });
    document.querySelectorAll('.hw-card').forEach(c => { const k = c.dataset.trkDoc; if (k && get(k, 'hw:' + c.id)) doc(k).recs['hw:' + c.id] = { t: NOW(), x: 1 }; });
    Object.keys(docs).forEach(save); emit();
  });

  function counts() {
    const d = doc(PAGE), recs = Object.keys(d.recs).filter(x => !d.recs[x].x);
    const scenes = storyRoot && storyRoot.__story ? storyRoot.__story.scenes : [];
    const hwCards = Array.prototype.slice.call(document.querySelectorAll('.hw-card'));
    const hwDone = hwCards.filter(c => get(c.dataset.trkDoc || PAGE, 'hw:' + c.id));
    const xbN = document.querySelectorAll('.xb-card').length;
    const qN = (quizTotal() || 0) + hwCards.length + xbN;
    const qDone = recs.filter(x => /^(q|ex|pp):/.test(x)).length + (hwCards.length ? hwDone.length : 0);
    const qRecs = recs.filter(x => /^(q|ex|pp):/.test(x)).map(x => d.recs[x]).concat(hwDone.map(c => get(c.dataset.trkDoc || PAGE, 'hw:' + c.id)));
    const ng = qRecs.filter(r => state(r) === 'ng').length, fix = qRecs.filter(r => state(r) === 'fix').length;
    return { hw: hwCards.map(c => (c.dataset.trkDoc || PAGE) + '|' + c.id), sec: secs.filter(s => get(PAGE, 'sec:' + s.id)).length, secT: secs.length,
      sc: scenes.filter(s => get(PAGE, scKey(s.t))).length, scT: scenes.length, q: qDone, qT: qN, ng, fix };
  }
  function render() {
    const c = counts(), d = doc(PAGE);
    const tot = { sec: c.secT, sc: c.scT, q: c.qT, hw: c.hw };
    if (JSON.stringify(d.tot) !== JSON.stringify(tot)) { d.tot = tot; save(PAGE); }
    const st = cloud.status === 'on' ? '☁ 已同步到你的帳號' : cloud.status === 'error' ? '⚠ 雲端同步失敗，先存在這台裝置' : '只存在這台裝置';
    setH(sum, '<b>📈 學習紀錄</b>' +
      (c.secT ? '<span>講義 ' + c.sec + '/' + c.secT + '</span>' : '') +
      (c.scT ? '<span>故事 ' + c.sc + '/' + c.scT + ' 畫面</span>' : '') +
      (c.qT ? '<span>題目 ' + c.q + '/' + c.qT + (c.ng ? ' <b class="trk-b ng">✗ 答錯 ' + c.ng + '</b>' : '') + (c.fix ? ' <b class="trk-b fix">已訂正 ' + c.fix + '</b>' : '') + '</span>' : '') +
      '<small>' + st + '</small><span class="trk-clears">' + (c.q ? '<button type="button" class="trk-clear" data-clear="q">清除題目紀錄</button>' : '') +
      '<button type="button" class="trk-clear" data-clear="all">清除這一頁的紀錄</button></span>');
    /* 小節 */
    secs.forEach(s => {
      const row = s.querySelector('.trk-row'), k = 'sec:' + s.id, r = get(PAGE, k);
      setH(row, r ? '<span class="trk-b">✓ 已讀 ' + md(r.t) + (r.by === 'hand' ? '（手動）' : '') + ' ' + xBtn(PAGE, k) + '</span>'
        : '<button type="button" class="trk-mark" data-doc="' + PAGE + '" data-key="' + k + '">✓ 標記讀過</button>');
      const a = document.querySelector('.rail a[href="#' + s.id + '"]'); if (a) a.classList.toggle('trk-on', !!r);
    });
    /* 故事清單 */
    if (storyBox && storyRoot.__story) {
      const sc = storyRoot.__story.scenes;
      setH(storyBox, '<summary>故事紀錄：看過 ' + c.sc + ' / ' + sc.length + ' 個畫面</summary><ol>' +
        sc.map((s, i) => { const k = scKey(s.t), r = get(PAGE, k);
          return '<li class="' + (r ? 'on' : '') + '"><a href="#story" data-go="' + i + '">' + plain(s.t) + '</a>' + (r ? '<span class="trk-b">✓ ' + md(r.t) + ' ' + xBtn(PAGE, k) + '</span>' : '<span class="trk-none">未看</span>') + '</li>'; }).join('') + '</ol>');
    }
    /* 測驗清單 */
    if (quizBox) {
      const d2 = doc(PAGE), qs = Object.keys(d2.recs).filter(x => x.indexOf('q:') === 0 && !d2.recs[x].x);
      setH(quizBox, '<summary>測驗紀錄：做過 ' + qs.length + (quizTotal() ? ' / ' + quizTotal() : '') + ' 題' + (qs.some(x => d2.recs[x].ok === false) ? '，答錯 ' + qs.filter(x => d2.recs[x].ok === false).length + ' 題' : '') + '</summary>' +
        (qs.length ? '<ol>' + qs.map(k => { const r = d2.recs[k]; const st = state(r); return '<li>' + (r.s || '（題目）') + '<span class="trk-b' + (st === 'ok' ? '' : ' ' + st) + '">' + tagTxt(r) + ' ' + xBtn(PAGE, k) + '</span></li>'; }).join('') + '</ol>' : '<p class="trk-none">還沒有做過測驗題。</p>'));
    }
    decorateQuiz(); decorateCards();
    /* 錯題清單 */
    const mk = mkCollect([PAGE], c.hw);
    mkSec.hidden = !c.qT && !mk.length;
    setH(mkList, mk.length ? mk.map(mkItem).join('') : '<p class="trk-none">這一章目前沒有錯題。</p>');
  }
  if (storyBox) storyBox.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (!g || !storyRoot.__story) return;
    e.preventDefault(); storyRoot.__story.go(+g.dataset.go, 0); storyRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  listeners.push(render);
  if (storyRoot && !storyRoot.__story) storyRoot.addEventListener('story:ready', render);
  render();
  setTimeout(render, 600);
  window.__TRK = { get, set, del, docs, PAGE };
})();
