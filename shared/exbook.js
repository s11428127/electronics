/* ============================================================
   課本例題（Example）與練習題（Practice Problem）卡片
   用法：<div class="exbook" data-bank="__CH11EX" data-sec="11.2"></div>
   題庫：window.__CH11EX = { book:'Alexander & Sadiku', items:[…] }
   每一題：{ id, sec:'11.2', kind:'ex'|'pp', no:'11.1', tag（選用，自訂標籤文字，例 'TYU 1.3'）, title, q, fig, idea, steps:[{t, eq, why}], ans, hint, note }
   - Example：題目＋圖，詳解一步一步按「下一步」打開（也可以全部展開）
   - Practice：題目＋圖＋手寫板，提示／答案／詳解都先遮起來，寫完再按
   另外 __EXB.picker(host, secs) 做「選小節」：只顯示選中的那一節。
   ============================================================ */
(function () {
  'use strict';
  const stepHTML = (s, i) => '<li' + (i === undefined ? '' : ' data-i="' + i + '"') + '><b>' + s.t + '</b>' + (s.eq ? '<span class="d-eq">' + s.eq + '</span>' : '') + (s.why ? '<div class="why">' + s.why + '</div>' : '') + '</li>';

  function card(it) {
    const el = document.createElement('article');
    el.className = 'xb-card ' + (it.kind === 'ex' ? 'is-ex' : 'is-pp');
    el.id = 'xb-' + it.id;
    const tag = it.tag ? '<span class="xb-tag ' + (it.kind === 'ex' ? 'ex' : 'pp') + '">' + it.tag + '</span>' : it.kind === 'ex' ? '<span class="xb-tag ex">Example ' + it.no + '</span>' : '<span class="xb-tag pp">Practice Problem ' + it.no + '</span>';
    const head = '<header class="xb-head">' + tag + (it.title ? '<b>' + it.title + '</b>' : '') + '</header>' +
      '<div class="xb-q">' + it.q + '</div>' + (it.fig ? '<figure class="xb-fig">' + it.fig + (it.cap ? '<figcaption>' + it.cap + '</figcaption>' : '') + '</figure>' : '');
    const steps = '<ol class="xb-steps">' + it.steps.map((s, i) => stepHTML(s, i)).join('') + '</ol>';
    if (it.kind === 'ex') {
      el.innerHTML = head +
        (it.idea ? '<div class="xb-idea"><b>思路：</b>' + it.idea + '</div>' : '') +
        '<div class="xb-sol">' + steps + '<div class="xb-ans" hidden><b>答案：</b>' + it.ans + '</div>' + (it.note ? '<div class="xb-note" hidden>' + it.note + '</div>' : '') + '</div>' +
        '<div class="xb-act"><button class="btn solid" data-a="next" type="button">看下一步 ▸</button><button class="btn" data-a="all" type="button">全部展開</button><button class="btn" data-a="reset" type="button">收起</button><span class="xb-prog"></span></div>';
      const lis = Array.prototype.slice.call(el.querySelectorAll('.xb-steps > li'));
      let n = 0;
      const show = k => {
        n = Math.max(0, Math.min(k, lis.length));
        lis.forEach((li, i) => { li.hidden = i >= n; });
        const done = n >= lis.length;
        el.querySelector('.xb-ans').hidden = !done;
        if (el.querySelector('.xb-note')) el.querySelector('.xb-note').hidden = !done;
        el.querySelector('[data-a="next"]').hidden = done;
        el.querySelector('.xb-prog').textContent = done ? '' : '第 ' + n + ' / ' + lis.length + ' 步';
      };
      el.querySelector('.xb-act').addEventListener('click', e => {
        const a = e.target.closest('button') && e.target.closest('button').dataset.a;
        if (a === 'next') show(n + 1); else if (a === 'all') show(lis.length); else if (a === 'reset') show(0);
      });
      show(0);
    } else {
      el.innerHTML = head +
        '<div class="pad" data-id="xb-' + it.id + '"></div>' +
        '<div class="xb-act"><button class="btn" data-a="hint" type="button">💡 提示</button><button class="btn" data-a="ans" type="button">看答案</button><button class="btn solid" data-a="sol" type="button">看詳解</button></div>' +
        '<div class="xb-hint" hidden><b>提示：</b>' + (it.hint || it.idea || '') + '</div>' +
        '<div class="xb-ans" hidden><b>答案：</b>' + it.ans +
          '<div class="xb-self">我自己這次：<button type="button" data-s="1">✓ 算對了</button><button type="button" data-s="0">✗ 算錯了</button></div></div>' +
        '<div class="xb-sol" hidden>' + (it.idea ? '<div class="xb-idea"><b>思路：</b>' + it.idea + '</div>' : '') + steps + (it.note ? '<div class="xb-note">' + it.note + '</div>' : '') + '</div>';
      el.querySelector('.xb-act').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b || !b.dataset.a) return;
        const box = el.querySelector('.xb-' + b.dataset.a);
        box.hidden = !box.hidden; b.classList.toggle('on', !box.hidden);
        if (b.dataset.a === 'sol' && !box.hidden) el.querySelector('.xb-ans').hidden = false;
      });
      /* 有 annot.js（講義上寫筆記）就用同一支筆；沒有才退回舊的手寫板 */
      if (window.__ANN && window.__ANN.pad) window.__ANN.pad(el.querySelector('.pad'), 'xb-' + it.id);
      else if (window.__PAD) window.__PAD.mount(el.querySelector('.pad'), 'xb-' + it.id);
    }
    return el;
  }

  function mount(host) {
    const bank = window[host.dataset.bank]; if (!bank) return;
    const items = bank.items.filter(it => it.sec === host.dataset.sec);
    const nEx = items.filter(i => i.kind === 'ex').length, nPp = items.length - nEx;
    host.innerHTML = '<div class="xb-title"><span>📘 課本例題與練習</span><small>Example ' + nEx + ' 題 · Practice Problem ' + nPp + ' 題</small></div>';
    items.forEach(it => host.appendChild(card(it)));
    if (window.__EE && window.__EE.wireTerms) window.__EE.wireTerms();
  }

  /* 選小節：secs = [{id:'inst', no:'11.2', name:'瞬時與平均功率'}…]；只顯示選中的那一節（「全部」顯示全部） */
  function picker(host, secs, opt) {
    opt = opt || {};
    const LS = 'ee-pick:' + (opt.key || location.pathname);
    const all = secs.map(s => document.getElementById(s.id)).filter(Boolean);
    const extra = (opt.alwaysAll || []).map(id => document.getElementById(id)).filter(Boolean);
    host.innerHTML = '<div class="pick-title">選一個小節（題目都放在各小節最下面）</div><div class="pick-row">' +
      '<button type="button" data-p="all">全部</button>' +
      secs.map(s => '<button type="button" data-p="' + s.id + '"><b>' + s.no + '</b><span>' + s.name + '</span>' + (s.count ? '<i>' + s.count + '</i>' : '') + '</button>').join('') + '</div>';
    function pick(p, scroll) {
      host.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.p === p));
      all.forEach(sec => { sec.hidden = p !== 'all' && sec.id !== p; });
      extra.forEach(sec => { sec.hidden = p !== 'all'; });
      try { localStorage.setItem(LS, p); } catch (e) {}
      if (scroll && p !== 'all') { const t = document.getElementById(p); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    host.addEventListener('click', e => { const b = e.target.closest('button[data-p]'); if (b) pick(b.dataset.p, true); });
    /* 側欄或連結跳到被藏起來的小節時，自動切過去 */
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute('href').slice(1), t = document.getElementById(id);
      if (!t) return;
      const sec = t.closest('section');
      if (sec && sec.hidden && secs.some(s => s.id === sec.id)) pick(sec.id, false);
      else if (sec && sec.hidden) pick('all', false);
    }, true);
    let start = 'all';
    try { start = localStorage.getItem(LS) || 'all'; } catch (e) {}
    const h = location.hash.slice(1);
    if (h) { const t = document.getElementById(h), sec = t && t.closest('section'); if (sec && secs.some(s => s.id === sec.id)) start = sec.id; else start = 'all'; }
    if (start !== 'all' && !secs.some(s => s.id === start)) start = 'all';
    pick(start, false);
  }

  function init() { document.querySelectorAll('.exbook[data-bank]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.__EXB = { mount, picker };
})();
