/* ============================================================
   手寫筆記 —— 儲存層
   ------------------------------------------------------------
   本機優先（local-first）：
     1. 每一筆都先存進這台裝置的 IndexedDB，離線也能寫。
     2. 在 claude.ai 上打開時，再把同一份資料同步到雲端
        （artifact 的 db，放在「只有你看得到」的 data/users/<你> 底下），
        所以 iPad 寫的東西換到筆電也看得到。
     3. 兩邊都沒有時（例如無痕模式擋掉 IndexedDB），退回記憶體模式，
        頁面照樣能用，只是關掉就沒了 —— 介面會明講。
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 筆跡編碼 ----------------
     每一筆 = 一串 (x, y, 壓力)。x, y 是「頁面座標」（寬 1000、高 1414，跟螢幕大小無關），
     存成 ×10 的整數；壓力 0~1 存成 0~63。先做差分（相鄰兩點很近，差值很小），
     再用 base64 VLQ 編成字串 —— 比 JSON 數字陣列小 5~6 倍，雲端每頁 256 KiB 才夠用。 */
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const B64I = {};
  for (let i = 0; i < 64; i++) B64I[B64[i]] = i;

  function vlq(n, out) {
    let v = n < 0 ? ((-n) * 2) + 1 : n * 2;
    do {
      let d = v & 31; v = Math.floor(v / 32);
      if (v) d |= 32;
      out.push(B64[d]);
    } while (v);
  }
  function encodePts(pts) {
    const out = [];
    let px = 0, py = 0, pp = 0;
    for (let i = 0; i < pts.length; i += 3) {
      const x = Math.round(pts[i] * 10), y = Math.round(pts[i + 1] * 10), p = Math.round(pts[i + 2] * 63);
      vlq(x - px, out); vlq(y - py, out); vlq(p - pp, out);
      px = x; py = y; pp = p;
    }
    return out.join('');
  }
  function decodePts(s) {
    const vals = [];
    let v = 0, mul = 1;
    for (let i = 0; i < s.length; i++) {
      const d = B64I[s[i]];
      if (d === undefined) continue;
      v += (d & 31) * mul;
      if (d & 32) { mul *= 32; continue; }
      vals.push(v % 2 ? -(v - 1) / 2 : v / 2);
      v = 0; mul = 1;
    }
    const n = Math.floor(vals.length / 3), pts = new Float32Array(n * 3);
    let x = 0, y = 0, p = 0;
    for (let i = 0; i < n; i++) {
      x += vals[i * 3]; y += vals[i * 3 + 1]; p += vals[i * 3 + 2];
      pts[i * 3] = x / 10; pts[i * 3 + 1] = y / 10; pts[i * 3 + 2] = p / 63;
    }
    return pts;
  }
  function packStroke(s) {
    return { i: s.id, z: s.z, t: s.tool, c: s.color, w: s.width, d: encodePts(s.pts) };
  }
  function unpackStroke(o) {
    const pts = decodePts(o.d || '');
    return withBBox({ id: o.i, z: o.z || 0, tool: o.t || 'pen', color: o.c || '#ffffff', width: o.w || 3, pts: pts });
  }
  function withBBox(s) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < s.pts.length; i += 3) {
      const x = s.pts[i], y = s.pts[i + 1];
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    s.bbox = [x0, y0, x1, y1];
    return s;
  }

  const uid = (p) => (p || '') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------------- 本機：IndexedDB（失敗就退回記憶體） ---------------- */
  const mem = { notebooks: new Map(), pages: new Map(), meta: new Map() };
  let idb = null;
  let persistent = false;

  function openIDB() {
    return new Promise(resolve => {
      let req;
      try { req = indexedDB.open('ee-notes', 1); } catch (e) { resolve(null); return; }
      const timer = setTimeout(() => resolve(null), 4000);
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains('notebooks')) d.createObjectStore('notebooks', { keyPath: 'id' });
        if (!d.objectStoreNames.contains('pages')) d.createObjectStore('pages', { keyPath: 'key' });
        if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta', { keyPath: 'k' });
      };
      req.onsuccess = () => { clearTimeout(timer); resolve(req.result); };
      req.onerror = () => { clearTimeout(timer); resolve(null); };
      req.onblocked = () => { clearTimeout(timer); resolve(null); };
    });
  }
  function tx(store, mode, fn) {
    if (!idb) {
      return Promise.resolve(fn(null, mem[store]));
    }
    return new Promise((resolve, reject) => {
      let out;
      try {
        const t = idb.transaction(store, mode);
        const os = t.objectStore(store);
        out = fn(os, null);
        t.oncomplete = () => resolve(out && out.__req ? out.__req.result : out);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      } catch (e) { reject(e); }
    });
  }
  const R = req => ({ __req: req });
  function get(store, key) {
    return tx(store, 'readonly', (os, m) => (os ? R(os.get(key)) : m.get(key)));
  }
  function put(store, val) {
    const k = store === 'pages' ? val.key : store === 'meta' ? val.k : val.id;
    return tx(store, 'readwrite', (os, m) => { if (os) os.put(val); else m.set(k, val); });
  }
  function del(store, key) {
    return tx(store, 'readwrite', (os, m) => { if (os) os.delete(key); else m.delete(key); });
  }
  function all(store) {
    return tx(store, 'readonly', (os, m) => (os ? R(os.getAll()) : Array.from(m.values())));
  }

  /* ---------------- 雲端：claude.ai 的 artifact db ---------------- */
  const cloud = { status: 'off', col: null, listeners: [], pending: new Map(), inflight: new Set(), tooBig: new Set() };
  function setCloud(status) {
    cloud.status = status;
    cloud.listeners.forEach(fn => { try { fn(status); } catch (e) {} });
  }
  async function connectCloud() {
    try {
      if (!window.claude || typeof window.claude.use !== 'function') return;
      setCloud('connecting');
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      const id = user ? await user.id() : null;
      if (!db || !id) { setCloud('off'); return; }
      cloud.col = db.collection('data/users/' + id);
      await pullNotebooks();
      setCloud('on');
    } catch (e) {
      setCloud('error');
    }
  }
  const nbDoc = id => 'nb_' + id;
  const pgDoc = (nb, pg) => 'pg_' + nb + '_' + pg;

  /* 同一份文件一次只送一個寫入；還在送的時候又有新內容，就只記住「最新的那一份」 */
  function pushDoc(docId, body) {
    if (!cloud.col) return;
    cloud.pending.set(docId, body);
    pump(docId);
  }
  async function pump(docId) {
    if (cloud.inflight.has(docId) || !cloud.pending.has(docId)) return;
    const body = cloud.pending.get(docId);
    cloud.pending.delete(docId);
    cloud.inflight.add(docId);
    try {
      if (body === null) await cloud.col.doc(docId).delete();
      else await cloud.col.doc(docId).set(body);
      if (cloud.status !== 'on') setCloud('on');
    } catch (e) {
      const code = e && e.code;
      if (code === 'unavailable') {
        /* 暫時性問題：稍後再送一次（若期間沒有更新的內容） */
        if (!cloud.pending.has(docId)) cloud.pending.set(docId, body);
        setTimeout(() => { cloud.inflight.delete(docId); pump(docId); }, 1500 + Math.random() * 1500);
        return;
      }
      setCloud(code === 'quota_exceeded' ? 'full' : 'error');
    }
    cloud.inflight.delete(docId);
    if (cloud.pending.has(docId)) pump(docId);
  }

  async function pullNotebooks() {
    const snap = await cloud.col.where('kind', '==', 'nb').get();
    const remote = new Map();
    snap.docs.forEach(d => { const b = d.data(); if (b && b.nb) remote.set(b.nb.id, b.nb); });
    const locals = await all('notebooks');
    const localMap = new Map(locals.map(n => [n.id, n]));
    for (const [id, rn] of remote) {
      const ln = localMap.get(id);
      if (!ln || (rn.updated || 0) > (ln.updated || 0)) {
        await put('notebooks', Object.assign({}, rn, { pages: (rn.pages || []).slice() }));
        if (rn.deleted) await dropLocalPages(ln || rn);
      }
    }
    for (const ln of locals) {
      const rn = remote.get(ln.id);
      if (!rn || (ln.updated || 0) > (rn.updated || 0)) pushDoc(nbDoc(ln.id), { kind: 'nb', nb: ln });
    }
  }
  async function syncPages(nb) {
    if (!cloud.col) return [];
    const snap = await cloud.col.where('nb', '==', nb.id).get();
    const changed = [];
    const seen = new Set();
    for (const d of snap.docs) {
      const b = d.data();
      if (!b || !b.page) continue;
      const pg = b.page;
      seen.add(pg.id);
      const local = await get('pages', nb.id + '/' + pg.id);
      if (!local || (pg.updated || 0) > (local.updated || 0)) {
        await put('pages', Object.assign({}, pg, { key: nb.id + '/' + pg.id, nb: nb.id }));
        changed.push(pg.id);
      } else if ((local.updated || 0) > (pg.updated || 0)) {
        pushPage(local);
      }
    }
    for (const pid of nb.pages) {
      if (seen.has(pid)) continue;
      const local = await get('pages', nb.id + '/' + pid);
      if (local && local.strokes && local.strokes.length) pushPage(local);
    }
    return changed;
  }
  function pushPage(rec) {
    const body = { kind: 'pg', nb: rec.nb, page: { id: rec.id, tpl: rec.tpl, strokes: rec.strokes, updated: rec.updated } };
    const size = JSON.stringify(body).length;
    const docId = pgDoc(rec.nb, rec.id);
    if (size > 250000) { cloud.tooBig.add(docId); setCloud('partial'); return; }
    cloud.tooBig.delete(docId);
    pushDoc(docId, body);
  }

  async function dropLocalPages(nb) {
    for (const pid of (nb.pages || [])) await del('pages', nb.id + '/' + pid);
  }

  /* ---------------- 對外 API ---------------- */
  const Store = {
    uid, packStroke, unpackStroke, withBBox, encodePts, decodePts,
    get persistent() { return persistent; },
    get cloudStatus() { return cloud.status; },
    get cloudTooBig() { return cloud.tooBig.size; },
    onCloud(fn) { cloud.listeners.push(fn); fn(cloud.status); },

    ready: (async function init() {
      idb = await openIDB();
      persistent = !!idb;
      if (idb && navigator.storage && navigator.storage.persist) {
        /* 請瀏覽器不要在空間不足時自動清掉這份資料 */
        navigator.storage.persist().catch(() => {});
      }
    })(),
    connectCloud,

    async listNotebooks() {
      const list = await all('notebooks');
      return list.filter(n => !n.deleted).sort((a, b) => (b.updated || 0) - (a.updated || 0));
    },
    getNotebook: id => get('notebooks', id),
    async saveNotebook(nb, touch) {
      if (touch !== false) nb.updated = Date.now();
      await put('notebooks', nb);
      pushDoc(nbDoc(nb.id), { kind: 'nb', nb: nb });
      return nb;
    },
    async createNotebook(opts) {
      const now = Date.now();
      const nb = {
        id: uid('n'), title: opts.title || '未命名筆記本', paper: opts.paper || 'dark',
        tpl: opts.tpl || 'grid', chapter: opts.chapter || '', chapterTitle: opts.chapterTitle || '',
        pages: [], created: now, updated: now
      };
      const pg = { id: uid('p'), tpl: nb.tpl, strokes: [], updated: now };
      nb.pages.push(pg.id);
      await Store.savePage(nb, pg);
      await Store.saveNotebook(nb);
      return nb;
    },
    async deleteNotebook(nb) {
      const tomb = { id: nb.id, title: nb.title, deleted: true, pages: [], updated: Date.now() };
      for (const pid of nb.pages) {
        await del('pages', nb.id + '/' + pid);
        pushDoc(pgDoc(nb.id, pid), null);
      }
      await put('notebooks', tomb);
      pushDoc(nbDoc(nb.id), { kind: 'nb', nb: tomb });
    },
    async loadPage(nb, pid) {
      const rec = await get('pages', nb.id + '/' + pid);
      if (!rec) return { id: pid, tpl: nb.tpl, strokes: [], updated: 0 };
      return { id: rec.id, tpl: rec.tpl || nb.tpl, strokes: (rec.strokes || []).map(unpackStroke), updated: rec.updated || 0 };
    },
    async savePage(nb, page) {
      page.updated = Date.now();
      const rec = { key: nb.id + '/' + page.id, nb: nb.id, id: page.id, tpl: page.tpl,
        strokes: page.strokes.map(s => (s.d !== undefined ? s : packStroke(s))), updated: page.updated };
      await put('pages', rec);
      pushPage(rec);
      return rec;
    },
    async deletePage(nb, pid) {
      await del('pages', nb.id + '/' + pid);
      pushDoc(pgDoc(nb.id, pid), null);
    },
    syncPages,

    async getMeta(k) { const r = await get('meta', k); return r ? r.v : undefined; },
    async setMeta(k, v) { await put('meta', { k: k, v: v }); },

    /* 備份：整個書櫃一個 JSON 檔 */
    async exportAll() {
      const nbs = await Store.listNotebooks();
      const out = { format: 'ee-notes', version: 1, exported: new Date().toISOString(), notebooks: [] };
      for (const nb of nbs) {
        const pages = [];
        for (const pid of nb.pages) {
          const rec = await get('pages', nb.id + '/' + pid);
          pages.push({ id: pid, tpl: rec ? rec.tpl : nb.tpl, strokes: rec ? rec.strokes : [], updated: rec ? rec.updated : 0 });
        }
        out.notebooks.push({ nb: nb, pages: pages });
      }
      return out;
    },
    async importAll(obj) {
      if (!obj || obj.format !== 'ee-notes' || !Array.isArray(obj.notebooks)) throw new Error('這不是筆記備份檔');
      let added = 0, skipped = 0;
      for (const item of obj.notebooks) {
        const nb = item.nb;
        if (!nb || !nb.id || !Array.isArray(nb.pages)) continue;
        const local = await get('notebooks', nb.id);
        if (local && !local.deleted && (local.updated || 0) >= (nb.updated || 0)) { skipped++; continue; }
        for (const pg of (item.pages || [])) {
          const rec = { key: nb.id + '/' + pg.id, nb: nb.id, id: pg.id, tpl: pg.tpl, strokes: pg.strokes || [], updated: pg.updated || Date.now() };
          await put('pages', rec);
          pushPage(rec);
        }
        await Store.saveNotebook(Object.assign({}, nb, { deleted: false }), false);
        added++;
      }
      return { added, skipped };
    }
  };

  window.__Notes = Store;
})();
