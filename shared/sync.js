/* ============================================================
   通用同步儲存：一份資料 = 很多「帶時間的項目」，存在這台裝置＋你的 claude.ai 帳號
   用法：const st = __SYNC.open('ann_electronics_ch1-part1');
         st.all() → {id: item}（不含已刪除）；st.get(id)；st.put(id, obj)；st.del(id)；st.on(fn)
   - 每一項都帶 t（時間）；刪除是 {t, x:1}（墓碑），合併時「t 比較新的」贏，所以刪掉的不會被別台裝置復活
   - 本機：localStorage 'ee-sync:<name>'；雲端：data/users/<id>/sync_<name>（太大會切成 __1、__2… 好幾份）
   - 墓碑放 45 天後清掉
   ============================================================ */
(function () {
  'use strict';
  const LIMIT = 200000, TOMB = 45 * 864e5;
  const stores = {}, statusFns = [];
  const cloud = { col: null, status: 'local' };
  const enc = window.TextEncoder ? new TextEncoder() : null;
  const bytes = s => enc ? enc.encode(s).length : s.length * 3;
  const safe = s => s.replace(/[^A-Za-z0-9_-]/g, '_');
  function setStatus(s) { if (cloud.status !== s) { cloud.status = s; statusFns.forEach(f => { try { f(s); } catch (e) {} }); } }

  /* 依大小切成好幾份 */
  function pack(items) {
    const out = [{}]; let size = 0;
    Object.keys(items).forEach(id => {
      const n = bytes(JSON.stringify(id) + JSON.stringify(items[id])) + 2;
      if (size + n > LIMIT && Object.keys(out[out.length - 1]).length) { out.push({}); size = 0; }
      out[out.length - 1][id] = items[id]; size += n;
    });
    return out;
  }

  function open(name) {
    if (stores[name]) return stores[name];
    const LS = 'ee-sync:' + name, fns = [];
    let items = {}, timer = 0, busy = false, again = false, parts = 1, sent = [];
    try { items = JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { items = {}; }
    const now = Date.now();
    Object.keys(items).forEach(id => { if (items[id].x && now - (items[id].t || 0) > TOMB) delete items[id]; });
    const docId = i => 'sync_' + safe(name) + (i ? '__' + i : '');
    const keep = () => { try { localStorage.setItem(LS, JSON.stringify(items)); } catch (e) {} };
    const emit = remote => fns.forEach(f => { try { f(remote); } catch (e) {} });
    function save() { keep(); push(); }
    function push() { if (!cloud.col) return; clearTimeout(timer); timer = setTimeout(send, 1500); }
    async function send() {
      if (busy) { again = true; return; }
      busy = true;
      try {
        const chunks = pack(items), n = chunks.length;
        for (let i = 0; i < Math.max(n, parts); i++) {
          const body = JSON.stringify(chunks[i] || {}) + '|' + n;
          if (sent[i] === body) continue;   /* 沒變的那幾份不用重寫 */
          await cloud.col.doc(docId(i)).set({ kind: 'sync', name, part: i, parts: n, items: chunks[i] || {}, updated: Date.now() });
          sent[i] = body;
        }
        sent.length = n;
        parts = n; setStatus('on');
      } catch (e) { setStatus('error'); }
      busy = false;
      if (again) { again = false; send(); }
    }
    async function pull() {
      try {
        const first = await cloud.col.doc(docId(0)).get(), remote = {};
        if (first.exists) {
          const d = first.data() || {}; parts = Math.max(1, d.parts || 1); Object.assign(remote, d.items || {});
          for (let i = 1; i < parts; i++) { const s = await cloud.col.doc(docId(i)).get(); if (s.exists) Object.assign(remote, (s.data() || {}).items || {}); }
        }
        let changed = false, needPush = !first.exists && Object.keys(items).length > 0;
        Object.keys(remote).forEach(id => { const a = items[id], b = remote[id]; if (b && (!a || (b.t || 0) > (a.t || 0))) { items[id] = b; changed = true; } });
        Object.keys(items).forEach(id => { const b = remote[id]; if (!b || (items[id].t || 0) > (b.t || 0)) needPush = true; });
        if (changed) { keep(); emit(true); }
        if (needPush) send();
      } catch (e) { setStatus('error'); }
    }
    const api = {
      name,
      all() { const o = {}; Object.keys(items).forEach(id => { if (!items[id].x) o[id] = items[id]; }); return o; },
      get(id) { const r = items[id]; return r && !r.x ? r : null; },
      put(id, obj) { items[id] = Object.assign({}, obj, { t: Date.now() }); delete items[id].x; save(); emit(false); },
      del(id) { if (!items[id] || items[id].x) return; items[id] = { t: Date.now(), x: 1 }; save(); emit(false); },
      delMany(ids) { const t = Date.now(); ids.forEach(id => { if (items[id] && !items[id].x) items[id] = { t, x: 1 }; }); save(); emit(false); },
      on(fn) { fns.push(fn); },
      _pull: pull
    };
    stores[name] = api;
    if (cloud.col) pull();
    return api;
  }

  async function connect() {
    try {
      if (!window.claude || typeof window.claude.use !== 'function') return false;
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      const id = user ? await user.id() : null;
      if (!db || !id) return true;
      cloud.col = db.collection('data/users/' + id);
      setStatus('on');
      await Promise.all(Object.keys(stores).map(k => stores[k]._pull()));
    } catch (e) { setStatus('error'); }
    return true;
  }
  (function tryConnect(n) { connect().then(ok => { if (!ok && n < 5) setTimeout(() => tryConnect(n + 1), 800 * (n + 1)); }); })(0);

  window.__SYNC = { open, status: () => cloud.status, onStatus: fn => statusFns.push(fn), safe };
})();
