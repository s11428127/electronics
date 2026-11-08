/* 課文快讀＋單字卡（english/read.html） */
(function () {
  'use strict';
  const host = document.getElementById('rd-host'), R = window.__ENGREAD || [];
  let h = '';
  R.forEach(r => {
    h += '<section class="sec rd-sec" id="' + r.id + '"><div class="eyebrow">Unit ' + r.unit + (r.by ? ' · by ' + r.by : '') + '</div><h2>' + r.title + '<span class="h2-en">' + r.zh + '</span></h2>' +
      '<div class="rd-gist"><b>一句話大意：</b>' + r.gist + '</div>' +
      r.paras.map(p => '<div class="rd-p"><div class="no">' + p.p + '</div><div class="en">' + p.en + '</div><div class="zh">' + p.zh + '</div>' +
        (p.tags.length ? '<div class="tags">' + p.tags.map(t => '<span>📝 ' + t + '</span>').join('') + '</div>' : '<div></div>') + '</div>').join('') + '</section>';
  });
  if (host) host.innerHTML = h;
  const tg = (id, cls, a, b) => { const el = document.getElementById(id); if (!el) return; el.addEventListener('click', () => { const on = document.body.classList.toggle(cls); el.textContent = on ? b : a; }); };
  tg('tg-en', 'hide-en', '只看中文', '中英都看');
  tg('tg-zh', 'hide-zh', '只看英文', '中英都看');

  /* ── 單字卡 ── */
  const V = window.__ENV || {}, Z = window.__ENGZH || {};
  const UN = [['1A', '1A'], ['1B', '1B'], ['2A', '2A'], ['2B', '2B'], ['3A', '3A'], ['x1', 'Unit 1 補充'], ['x2', 'Unit 2 補充＋影片'], ['all', '紅字全部']];
  const LS = 'ee-fc-eng';
  let st = { u: '1A', front: 'w', weak: false, bad: {} };
  try { Object.assign(st, JSON.parse(localStorage.getItem(LS) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) {} };
  let deck = [], i = 0;
  const build = () => {
    const src = st.u === 'all' ? ['1A', '1B', '2A', '2B', '3A'] : [st.u];
    deck = []; src.forEach(u => (V[u] || []).forEach(x => deck.push({ w: x[0], d: x[1], u })));
    if (st.weak) deck = deck.filter(c => st.bad[c.w]);
    i = 0; show();
  };
  const card = document.getElementById('fc-card'), F = card && card.querySelector('.fc-f'), B = card && card.querySelector('.fc-b'), prog = document.getElementById('fc-prog');
  const show = () => {
    if (!card) return; card.classList.remove('flip');
    if (!deck.length) { F.innerHTML = '<div class="u">這一組沒有「不熟」的卡 👍</div>'; B.innerHTML = ''; prog.textContent = ''; return; }
    const c = deck[i], z = Z[c.w] || '', lab = c.u === 'x1' ? 'Unit 1 補充' : c.u === 'x2' ? 'Unit 2 補充' : 'Unit ' + c.u;
    const wHTML = '<div class="w">' + c.w + '</div><div class="u">' + lab + (st.bad[c.w] ? ' · 😵 不熟' : '') + '</div>';
    const dHTML = '<div class="d">' + c.d + '</div>' + (z ? '<div class="z">' + z + '</div>' : '') + '<div class="u">' + lab + '</div>';
    if (st.front === 'w') { F.innerHTML = wHTML; B.innerHTML = dHTML; } else { F.innerHTML = dHTML.replace(/<div class="z">.*?<\/div>/, ''); B.innerHTML = wHTML + (z ? '<div class="z">' + z + '</div>' : ''); }
    const nb = Object.keys(st.bad).filter(k => st.bad[k]).length;
    prog.textContent = (i + 1) + ' / ' + deck.length + '　·　不熟：' + nb + ' 個';
  };
  const units = document.getElementById('fc-units');
  if (units) {
    units.innerHTML = UN.map(u => '<button class="btn" type="button" data-u="' + u[0] + '">' + u[1] + '</button>').join('');
    const mark = () => units.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.u === st.u));
    units.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; st.u = b.dataset.u; save(); mark(); build(); });
    mark();
  }
  const on = (id, f) => { const el = document.getElementById(id); if (el) el.addEventListener('click', f); };
  if (card) card.addEventListener('click', () => card.classList.toggle('flip'));
  on('fc-next', () => { if (deck.length) { i = (i + 1) % deck.length; show(); } });
  on('fc-prev', () => { if (deck.length) { i = (i - 1 + deck.length) % deck.length; show(); } });
  on('fc-ok', () => { if (!deck.length) return; delete st.bad[deck[i].w]; save(); if (st.weak) { deck.splice(i, 1); if (i >= deck.length) i = 0; show(); } else { i = (i + 1) % deck.length; show(); } });
  on('fc-bad', () => { if (!deck.length) return; st.bad[deck[i].w] = 1; save(); i = (i + 1) % deck.length; show(); });
  on('fc-shuf', () => { for (let k = deck.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [deck[k], deck[j]] = [deck[j], deck[k]]; } i = 0; show(); });
  const dirB = document.getElementById('fc-dir'), weakB = document.getElementById('fc-weak');
  const lab = () => { if (dirB) dirB.textContent = st.front === 'w' ? '正面：英文單字' : '正面：英文定義'; if (weakB) weakB.classList.toggle('on', st.weak); };
  on('fc-dir', () => { st.front = st.front === 'w' ? 'd' : 'w'; save(); lab(); show(); });
  on('fc-weak', () => { st.weak = !st.weak; save(); lab(); build(); });
  lab(); build();
  document.addEventListener('keydown', e => { if (e.target.closest && e.target.closest('input,textarea,select')) return; if (e.key === 'ArrowRight') document.getElementById('fc-next').click(); if (e.key === 'ArrowLeft') document.getElementById('fc-prev').click(); if (e.key === ' ' && document.activeElement === document.body && card && card.getBoundingClientRect().top < innerHeight && card.getBoundingClientRect().bottom > 0) { e.preventDefault(); card.classList.toggle('flip'); } });
})();
