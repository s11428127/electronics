/* ============================================================
   名詞圖鑑（通用版，10/27 起電子學用；電路學 CH12 是較早的 circuits/assets/ch12-terms.js）
   每個名詞一張圖（viewBox 0 0 640 300），圖上直接標出「它是哪裡」。
   註冊：__TPIC.add({ key: { t, en, plain, rel, svg } }, { setName: [key…] }, { '名詞': key })
   頁面：<div class="tpic" data-set="setName"></div>   → 名詞按鈕＋圖＋白話＋關係式
   故事：__TPIC.scenes([key…])                         → 每個名詞一幕
   名詞彈窗附圖：第三個參數把 shared/terms.js 的名詞對到卡片（app.js term-pop 會顯示）
   需要：story.js（故事用）；CSS 在 app.css「名詞圖鑑」區塊
   ============================================================ */
(function () {
  'use strict';
  const C = {}, SETS = {};
  const DEFS = '<defs><filter id="st-sh" x="-20%" y="-30%" width="140%" height="170%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".12"/></filter></defs>';
  const svg = key => '<svg class="st-svg tp-svg" viewBox="0 0 640 300" role="img" aria-label="' + C[key].t + '的示意圖">' + DEFS + C[key].svg + '</svg>';

  function mount(el) {
    if (el.dataset.tpicDone) return;
    const keys = (SETS[el.dataset.set] || []).filter(k => C[k]);
    if (!keys.length) return;
    el.dataset.tpicDone = '1';
    el.innerHTML = '<div class="tpic-tabs dv-ui" role="tablist">' + keys.map((k, i) => '<button class="btn" type="button" role="tab" data-tk="' + k + '" aria-pressed="' + (i ? 'false' : 'true') + '">' + C[k].t + '</button>').join('') + '</div>' +
      '<div class="tpic-body"><div class="tpic-fig"></div><div class="tpic-txt"><h4></h4><div class="tpic-en"></div><p class="tpic-plain"></p><div class="tpic-rel"></div></div></div>';
    const show = k => {
      const c = C[k];
      el.querySelector('.tpic-fig').innerHTML = svg(k);
      el.querySelector('h4').innerHTML = c.t;
      el.querySelector('.tpic-en').textContent = c.en;
      el.querySelector('.tpic-plain').innerHTML = c.plain;
      el.querySelector('.tpic-rel').innerHTML = c.rel;
      el.querySelectorAll('[data-tk]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tk === k)));
      if (window.__EE && window.__EE.wireTerms) window.__EE.wireTerms();
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-tk]'); if (b) show(b.dataset.tk); });
    show(keys[0]);
  }
  const mountAll = () => document.querySelectorAll('.tpic[data-set]').forEach(mount);

  function scenes(keys) {
    if (!window.__Story) return [];
    const D = window.__Story.draw;
    return keys.filter(k => C[k]).map(k => {
      const c = C[k];
      const plain = c.plain.replace(/<(?!\/?(b|sub|sup)>)[^>]+>/g, '');
      return { t: c.t, en: c.en,
        svg: '<g data-k="fig"><svg x="88" y="86" width="464" height="241" viewBox="60 20 520 270">' + c.svg + '</svg></g>',
        steps: [{ sub: plain, on: 'fig' }, { sub: '記這一條：' + c.rel, on: '' }] };
    });
  }

  function add(cards, sets, figs) {
    Object.assign(C, cards || {});
    Object.keys(sets || {}).forEach(s => { SETS[s] = sets[s]; });
    const TF = window.__TERMFIG = window.__TERMFIG || {};
    Object.keys(figs || {}).forEach(n => { const k = figs[n]; TF[n] = () => (C[k] ? svg(k) : ''); });
    if (document.readyState !== 'loading') mountAll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);

  window.__TPIC = { add, svg, scenes, mount, cards: C, sets: SETS };
})();
