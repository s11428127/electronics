/* ============================================================
   手寫筆記 —— 書櫃（所有筆記本）
   ============================================================ */
(function () {
  'use strict';
  const S = window.__Notes, R = window.__NotesDraw;
  const $ = s => document.querySelector(s);

  /* 可以綁定的章節（新增章節時記得加進來） */
  const CHAPTERS = [
    ['electronics/ch1-part1', '電子學 · CH1 PART 1'],
    ['electronics/ch1-part2', '電子學 · CH1 PART 2'],
    ['circuits/ch11', '電路學 · CH11 交流功率'],
    ['engineering-math/laplace', '工數 · 拉普拉斯轉換'],
    ['engineering-math/ode', '工數 · ODE 與特徵方程']
  ];

  function ago(t) {
    if (!t) return '—';
    const s = (Date.now() - t) / 1000;
    if (s < 60) return '剛剛';
    if (s < 3600) return Math.floor(s / 60) + ' 分鐘前';
    if (s < 86400) return Math.floor(s / 3600) + ' 小時前';
    if (s < 86400 * 30) return Math.floor(s / 86400) + ' 天前';
    return new Date(t).toLocaleDateString('zh-TW');
  }
  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600);
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function drawCover(canvas, nb) {
    const w = canvas.clientWidth || 168, h = Math.round(w * R.PH / R.PW);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
    const k = canvas.width / R.PW, ctx = canvas.getContext('2d');
    ctx.setTransform(k, 0, 0, k, 0, 0);
    const pg = await S.loadPage(nb, nb.pages[0]);
    R.drawPaper(ctx, pg.tpl, nb.paper);
    pg.strokes.forEach(s => R.drawStroke(ctx, s));
  }

  async function renderShelf() {
    const list = await S.listNotebooks();
    const shelf = $('#shelf');
    shelf.innerHTML = '';
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'book new'; add.id = 'new-book';
    add.innerHTML = '<span class="cover">＋</span><b>新筆記本</b><span class="meta">方格 · 深色紙</span>';
    add.addEventListener('click', e => newDialog(e.currentTarget));
    shelf.appendChild(add);
    for (const nb of list) {
      const a = document.createElement('a');
      a.className = 'book'; a.href = 'note.html#id=' + encodeURIComponent(nb.id);
      a.innerHTML = '<span class="cover"><canvas></canvas></span>' +
        '<b>' + esc(nb.title) + '</b>' +
        (nb.chapter ? '<span class="chip-ch">' + esc(nb.chapterTitle || nb.chapter) + '</span>' : '') +
        '<span class="meta">' + nb.pages.length + ' 頁 · ' + ago(nb.updated) + '</span>' +
        '<button class="more" type="button" aria-label="更多動作">⋯</button>';
      a.querySelector('.more').addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); bookMenu(ev.currentTarget, nb); });
      shelf.appendChild(a);
      requestAnimationFrame(() => drawCover(a.querySelector('canvas'), nb).catch(() => {}));
    }
    $('#count').textContent = list.length;
    $('#pages-count').textContent = list.reduce((n, b) => n + b.pages.length, 0);
    $('#empty').hidden = list.length > 0;
  }

  /* ---------------- 對話框（頁面座標定位） ---------------- */
  function closeDlg() { document.querySelectorAll('.dlg, .dlg-scrim, .nb-menu').forEach(el => el.remove()); }
  function placeNear(el, anchor) {
    const r = anchor.getBoundingClientRect(), w = el.offsetWidth, vw = document.documentElement.clientWidth;
    const left = Math.max(12, Math.min(r.left, vw - w - 12)) + window.scrollX;
    el.style.left = left + 'px';
    el.style.top = (r.bottom + window.scrollY + 8) + 'px';
  }
  function dialog(anchor, html, onOk) {
    closeDlg();
    const scrim = document.createElement('div'); scrim.className = 'dlg-scrim';
    scrim.addEventListener('click', closeDlg);
    const d = document.createElement('div'); d.className = 'dlg'; d.setAttribute('role', 'dialog');
    d.innerHTML = html + '<div class="row-end"><button class="btn" type="button" data-x>取消</button><button class="btn solid" type="button" data-ok>確定</button></div>';
    document.body.appendChild(scrim); document.body.appendChild(d);
    placeNear(d, anchor);
    d.querySelector('[data-x]').addEventListener('click', closeDlg);
    d.querySelector('[data-ok]').addEventListener('click', () => onOk(d));
    d.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') onOk(d); if (e.key === 'Escape') closeDlg(); });
    d.querySelectorAll('.seg').forEach(seg => seg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    const inp = d.querySelector('input'); if (inp) setTimeout(() => { inp.focus(); inp.select(); }, 30);
    return d;
  }
  const segVal = (d, name) => { const b = d.querySelector('.seg[data-name="' + name + '"] [aria-pressed="true"]'); return b ? b.dataset.v : ''; };

  function newDialog(anchor) {
    dialog(anchor,
      '<h4>新筆記本</h4>' +
      '<label for="nb-name">名稱</label><input type="text" id="nb-name" value="" placeholder="例：電子學 課堂筆記">' +
      '<label>紙張</label><div class="seg" data-name="paper">' +
        '<button class="btn" type="button" data-v="dark" aria-pressed="true">深色紙</button>' +
        '<button class="btn" type="button" data-v="light" aria-pressed="false">白紙</button></div>' +
      '<label>背景</label><div class="seg" data-name="tpl">' +
        '<button class="btn" type="button" data-v="grid" aria-pressed="true">方格</button>' +
        '<button class="btn" type="button" data-v="lines" aria-pressed="false">橫線</button>' +
        '<button class="btn" type="button" data-v="dots" aria-pressed="false">點格</button>' +
        '<button class="btn" type="button" data-v="blank" aria-pressed="false">空白</button></div>' +
      '<label for="nb-ch">對應的章節（選填，可以邊看講義邊寫）</label>' +
      '<select id="nb-ch"><option value="">不綁章節</option>' +
        CHAPTERS.map(c => '<option value="' + c[0] + '">' + esc(c[1]) + '</option>').join('') + '</select>',
      async d => {
        const ch = d.querySelector('#nb-ch').value;
        const chT = ch ? CHAPTERS.find(c => c[0] === ch)[1] : '';
        const title = d.querySelector('#nb-name').value.trim() || chT || '未命名筆記本';
        const nb = await S.createNotebook({ title, paper: segVal(d, 'paper'), tpl: segVal(d, 'tpl'), chapter: ch, chapterTitle: chT });
        closeDlg();
        location.href = 'note.html#id=' + encodeURIComponent(nb.id);
      });
  }
  function bookMenu(anchor, nb) {
    closeDlg();
    const m = document.createElement('div'); m.className = 'nb-menu'; m.setAttribute('role', 'menu');
    const items = [
      ['打開', () => { location.href = 'note.html#id=' + encodeURIComponent(nb.id); }],
      ['重新命名', () => renameDialog(anchor, nb)],
      ['刪除這本', () => delNotebook(nb), true]
    ];
    items.forEach(([t, fn, danger]) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('role', 'menuitem');
      if (danger) b.className = 'danger';
      b.addEventListener('click', () => { closeDlg(); fn(); });
      m.appendChild(b);
    });
    document.body.appendChild(m);
    const r = anchor.getBoundingClientRect(), w = m.offsetWidth, vw = document.documentElement.clientWidth;
    m.style.left = (Math.max(12, Math.min(r.right - w, vw - w - 12)) + window.scrollX) + 'px';
    m.style.top = (r.bottom + window.scrollY + 6) + 'px';
    setTimeout(() => document.addEventListener('pointerdown', function h(e) {
      if (!e.target.closest('.nb-menu')) { m.remove(); document.removeEventListener('pointerdown', h); }
    }), 0);
  }
  function renameDialog(anchor, nb) {
    const d = dialog(anchor, '<h4>重新命名</h4><label for="rn">名稱</label><input type="text" id="rn" value="' + esc(nb.title) + '">', async dd => {
      const v = dd.querySelector('#rn').value.trim();
      if (v) { nb.title = v; await S.saveNotebook(nb); }
      closeDlg(); renderShelf();
    });
    return d;
  }
  async function delNotebook(nb) {
    if (!confirm('確定刪除「' + nb.title + '」？整本 ' + nb.pages.length + ' 頁都會刪掉，不能復原。\n（建議先按「匯出備份」）')) return;
    await S.deleteNotebook(nb);
    toast('已刪除「' + nb.title + '」');
    renderShelf();
  }

  /* ---------------- 備份 ---------------- */
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
  async function exportBackup() {
    const data = await S.exportAll();
    if (!data.notebooks.length) { toast('書櫃是空的，沒有東西可以備份'); return; }
    const d = new Date(), pad = n => String(n).padStart(2, '0');
    const name = '手寫筆記備份-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '.json';
    const ok = await saveFile(name, new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (ok) { await S.setMeta('lastBackup', Date.now()); paintState(); toast('備份檔已送出：' + name); }
  }
  async function importBackup(file) {
    try {
      const obj = JSON.parse(await file.text());
      const r = await S.importAll(obj);
      toast('匯入完成：新增／更新 ' + r.added + ' 本' + (r.skipped ? '，' + r.skipped + ' 本本機比較新所以略過' : ''));
      renderShelf();
    } catch (e) {
      toast('匯入失敗：' + (e && e.message || '檔案格式不對'));
    }
  }

  /* ---------------- 儲存狀態 ---------------- */
  async function paintState() {
    const local = $('#st-local'), cloud = $('#st-cloud'), bk = $('#st-backup');
    local.innerHTML = S.persistent
      ? '<span class="ok">✓ 存在這台裝置</span>（每一筆畫完 0.7 秒內自動存檔）'
      : '<span class="bad">⚠ 只存在記憶體</span>：這個瀏覽器擋掉了本機儲存（可能是無痕模式），關掉頁面就會消失 —— 請記得匯出備份。';
    const cs = S.cloudStatus;
    cloud.innerHTML =
      cs === 'on' ? '<span class="ok">☁ 已同步</span>：在 claude.ai 上用同一個帳號打開，iPad、筆電都看得到同一份。'
      : cs === 'connecting' ? '☁ 連線中…'
      : cs === 'error' ? '<span class="warn">☁ 同步失敗</span>：本機仍有存，下次打開會再試。'
      : cs === 'full' ? '<span class="warn">☁ 雲端空間已滿</span>：新頁面只存本機，請匯出備份後刪掉不用的筆記本。'
      : cs === 'partial' ? '<span class="warn">☁ 有 ' + S.cloudTooBig + ' 頁太密集，超過雲端單頁上限</span>：那幾頁只存在本機。'
      : '未連線：這個網址不在 claude.ai 裡開啟，只存本機。';
    const last = await S.getMeta('lastBackup');
    bk.innerHTML = last ? '上次備份：' + ago(last) : '<span class="warn">還沒備份過</span>：建議每週按一次「匯出備份」。';
  }

  async function main() {
    const th = (() => { try { return localStorage.getItem('ee-theme'); } catch (e) { return null; } })();
    if (th) document.documentElement.setAttribute('data-theme', th);
    const tb = $('#theme-btn');
    tb.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      try { localStorage.setItem('ee-theme', isDark ? 'light' : 'dark'); } catch (e) {}
    });
    $('#btn-new').addEventListener('click', e => newDialog(e.currentTarget));
    $('#btn-export').addEventListener('click', exportBackup);
    const fi = $('#file-import');
    $('#btn-import').addEventListener('click', () => fi.click());
    fi.addEventListener('change', () => { if (fi.files[0]) importBackup(fi.files[0]); fi.value = ''; });

    await S.ready;
    S.onCloud(() => { paintState(); });
    await renderShelf();
    paintState();
    S.connectCloud().then(() => { if (S.cloudStatus === 'on') renderShelf(); paintState(); });
  }
  main().catch(e => toast('書櫃載入失敗：' + (e && e.message || e)));
  window.__Library = { renderShelf };
})();
