/* ============================================================
   電路學複習頁共用：章節階梯（hero 下方）＋ 上一章／下一章
   <ol class="rv-ladder" data-cur="9"></ol>、<nav class="rv-nav" data-cur="9"></nav>
   做好一章就把它的 href 填進 CH（沒有 href = 還沒做）。
   ============================================================ */
(function () {
  'use strict';
  const CH = [
    { no: 1, name: '基本概念', href: 'ch1.html' },
    { no: 2, name: '基本定律' },
    { no: 3, name: '分析方法' },
    { no: 4, name: '電路定理' },
    { no: 5, name: '運算放大器' },
    { no: 6, name: '電容與電感' },
    { no: 7, name: '一階電路' },
    { no: 8, name: '二階電路' },
    { no: 9, name: '弦波與相量', href: 'ch9.html' },
    { no: 10, name: '弦波穩態分析', href: 'ch10.html' },
    { no: 11, name: '交流功率', href: 'ch11-part1.html' },
    { no: 12, name: '三相電路', href: 'ch12-part1.html' }
  ];
  window.__RVCH = CH;
  document.querySelectorAll('.rv-ladder[data-cur]').forEach(ol => {
    const cur = +ol.dataset.cur;
    ol.setAttribute('aria-label', '電路學章節階梯');
    ol.innerHTML = CH.map(c => {
      const inner = '<b>CH' + c.no + '</b>' + c.name;
      if (c.no === cur) return '<li class="on"><span aria-current="page">' + inner + '</span></li>';
      return c.href ? '<li><a href="' + c.href + '">' + inner + '</a></li>' : '<li class="soon"><span title="還沒做">' + inner + '</span></li>';
    }).join('');
  });
  document.querySelectorAll('.rv-nav[data-cur]').forEach(nav => {
    const cur = +nav.dataset.cur, p = CH[cur - 2], n = CH[cur];
    const card = (c, cls, lab) => c ? (c.href ? '<a class="' + cls + '" href="' + c.href + '"><small>' + lab + '</small>CH' + c.no + ' ' + c.name + '</a>'
      : '<a class="' + cls + '" aria-disabled="true" style="opacity:.5;pointer-events:none"><small>' + lab + '（還沒做）</small>CH' + c.no + ' ' + c.name + '</a>') : '<span></span>';
    nav.innerHTML = card(p, 'pv', '← 上一章') + card(n, 'nx', '下一章 →');
  });
})();
