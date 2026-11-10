/* ============================================================
   電路學章末題「題型故事」引擎（使用者 11/10：刷題前，每個單元的每種題型都用故事講一次：重點公式、寫法思路）
   __TypesStory('#tstory', { id, ch, title, types: [...] })
   每個 type = { n 名稱, en, sec 節, ex: ['11.1', …] 代表題, look: [題目長怎樣的幾行], ask 要你求什麼,
                f: [[公式, 字幕]…], s: [[步驟, 字幕]…], trap: [✗ 錯法, ✓ 對法, 字幕] }
   每個題型 3 幕：長怎樣 → 公式 → 寫法；開頭一幕題型地圖、結尾一幕總整理。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const k = key => (key ? ' data-k="' + key + '"' : '');
  const g = (key, inner) => '<g' + k(key) + '>' + inner + '</g>';
  const T = (x, y, s, o) => D.text(x, y, s, o);
  function rows(x, y, w, list, opt) {
    opt = opt || {};
    const lh = opt.lh || 30, fs = opt.fs || 15, top = opt.title ? 30 : 10;
    let s = '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (top + list.length * lh + 8) + '" rx="12" filter="url(#st-sh)"/>';
    if (opt.title) s += T(x + 14, y + 21, opt.title, { cls: 'ts', fs: 12, a: 'start' });
    list.forEach((r, i) => {
      let f = r[3] || fs; const tw = D.textW(String(r[0]).replace(/<su[bp]>(.*?)<\/su[bp]>/g, '$1'), f);
      if (tw > w - 30) f = Math.max(10.5, f * (w - 30) / tw);
      s += T(x + 16, y + top + lh * i + lh * 0.7, r[0], { cls: r[2] || 't', fs: Math.round(f * 10) / 10, a: 'start', k: r[1] });
    });
    return g(opt.k, s);
  }
  const sc = (t, en, svg, steps) => ({ t, en, svg, steps });

  function build(def) {
    const TY = def.types, scenes = [];
    /* 地圖 */
    const n = TY.length, lh = n > 6 ? 25 : 30;
    scenes.push(sc(def.ch + ' 會考哪幾種題', 'QUESTION TYPES',
      rows(70, 100, 500, TY.map((t, i) => [(i + 1) + '. ' + t.n + '（' + t.sec + '）', 'm' + i, 't', 14.5]), { lh, title: '這一章的題型' }),
      [{ sub: def.intro || (def.ch + ' 的章末題，拆開來只有這 ' + n + ' 種。'), on: TY.map((_, i) => 'm' + i).slice(0, Math.ceil(n / 2)).join(' ') },
       { sub: '每一種我都講三件事：題目長怎樣、要背的公式、寫法步驟。', on: TY.map((_, i) => 'm' + i).join(' ') }]));
    TY.forEach((t, i) => {
      const no = '題型 ' + (i + 1) + '：';
      /* 1 長怎樣 */
      const L = t.look.length;
      scenes.push(sc(no + t.n, t.en,
        rows(70, 100, 500, t.look.map((l, j) => [l, 'l' + j, 't', 14.5]), { lh: 28, title: '題目長這樣（例：Problem ' + t.ex[0] + '）', k: 'lk' }) +
        D.chip(320, 118 + 30 + L * 28 + 34, '要你求：' + t.ask, '同類題：' + t.ex.join('、'), 'ask', { fs: 14, acc: true }),
        [{ sub: '第 ' + (i + 1) + ' 種：' + t.n + '。題目通常長這樣。', on: 'lk ' + t.look.map((_, j) => 'l' + j).join(' ') },
         { sub: '它要你求的是：' + t.ask + '。', on: 'ask' }]));
      /* 2 公式 */
      scenes.push(sc(t.n + '：要背的公式', 'KEY FORMULAS',
        rows(60, 100, 520, t.f.map((r, j) => [r[0], 'f' + j, j === 0 ? 'ta' : 't', 15.5]), { lh: Math.min(36, 190 / t.f.length), title: '公式' }),
        t.f.map((r, j) => ({ sub: r[1], on: 'f' + j }))));
      /* 3 寫法 */
      const sl = t.s.length, slh = Math.min(30, 150 / sl);
      scenes.push(sc(t.n + '：寫法步驟', 'HOW TO SOLVE',
        rows(60, 98, 520, t.s.map((r, j) => [(j + 1) + '. ' + r[0], 's' + j, 't', 14.5]), { lh: slh, title: '拿到題目照這樣寫' }) +
        D.chip(320, 98 + 30 + sl * slh + 40, t.trap[0] + '　→　' + t.trap[1], null, 'tr', { fs: 13.5, acc: true }),
        t.s.map((r, j) => ({ sub: r[1], on: 's' + j })).concat([{ sub: '最常錯：' + t.trap[2], on: 'tr' }])));
    });
    /* 總整理 */
    scenes.push(sc('總整理', 'RECAP',
      rows(60, 100, 520, TY.map((t, i) => [t.n + '：' + t.key, 'r' + i, 't', 14]), { lh: Math.min(26, 170 / n), title: '每種題型一句話' }),
      [{ sub: '最後一句話記住每種題型。', on: TY.map((_, i) => 'r' + i).join(' ') }]));
    scenes.push(sc('開始刷題', 'GO PRACTICE',
      D.chip(320, 150, '刷題順序：照小節一節一節來', '卡住就回來看那種題型的「寫法步驟」', 'g1', { fs: 15, acc: true }) +
      D.chip(320, 220, '每題先在手寫板自己寫，再看提示、答案', '算錯按「算錯了」，會進錯題本', 'g2', { fs: 14 }),
      [{ sub: '往下挑小節開始刷題吧！', on: 'g1 g2' }]));
    return scenes;
  }

  window.__TypesStory = function (sel, def) {
    return window.__Story(sel, { id: def.id, title: def.title, after: '#sec-pick', afterLabel: '往下開始刷題 ↓', scenes: build(def) });
  };
})();
