/* ============================================================
   電子學 第一次期中考複習 —— 故事模式（10 個畫面）
   用老師範例題組的數字，把「本質矽 → 摻雜 → 多數／少數 → 漂移 → V_bi → 逆偏 → C_j」走一遍。
   謎題：一塊純矽，怎麼一路算到一顆二極體的 0.174 pF？
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { e, h, text, arrow, chip } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const rnd = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const dim = keys => keys.split(' ').reduce((o, kk) => (o[kk] = 0.15, o), {});
  const box = (x, y, w, hh, key, inner) => g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="14" filter="url(#st-sh)"/>' + (inner || ''));
  function dots(kind, x0, y0, w, hh, n, seed, r) {
    const R = rnd(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = (x0 + 8 + R() * (w - 16)).toFixed(1), y = (y0 + 8 + R() * (hh - 16)).toFixed(1); s += kind === 'h' ? h(x, y, null, r || 5) : e(x, y, null, r || 4.5); }
    return s;
  }

  /* ── 00 謎題 ── */
  const M0 = {
    t: '一條鏈的謎題', en: 'THE QUESTION',
    svg: box(56, 118, 150, 110, 'si', T(131, 160, '一塊純矽', { fs: 16 }) + T(131, 192, 'Si，300 K', { cls: 'tm', fs: 12.5 })) +
      box(434, 118, 150, 110, 'cap', T(509, 160, '一顆二極體', { fs: 16 }) + T(509, 194, '0.174 pF', { cls: 'ta', fs: 20 })) +
      g('ar', arrow(216, 173, 424, 173, null, 'lna')) +
      chip(320, 270, '老師的範例題組：五小題串成一條鏈', '每一題都要用上一題的答案', 'c5', { fs: 13, acc: true }) +
      T(320, 186, '?', { cls: 'ta', fs: 70, k: 'q' }),
    steps: [
      { sub: '老師給的複習題，起點是一塊<b>純矽</b>。', on: 'si' },
      { sub: '終點是一顆<b>二極體</b>的電容：0.174 pF。', on: 'cap' },
      { sub: '中間怎麼接起來的？', on: 'ar q' },
      { sub: '答案是五小題串成的一條鏈：<b>每一題都用上一題的答案</b>。一題錯，後面全錯。', off: 'q', on: 'c5' }
    ]
  };

  /* ── 01 ① 本質矽 ── */
  const M1 = {
    t: '① 起點：純矽裡有多少載子', en: 'INTRINSIC SILICON',
    svg: g('blk', '<rect class="bgw" x="70" y="104" width="250" height="160" rx="10"/>') +
      g('pairs', dots('e', 70, 104, 250, 160, 6, 3) + dots('h', 70, 104, 250, 160, 6, 9)) +
      T(80, 122, '純矽（300 K）', { cls: 'tm', fs: 12.5, a: 'start', k: 'blkL' }) +
      chip(480, 136, '熱擾動打斷共價鍵', '一次生出一對：電子＋電洞', 'c1', { fs: 12.5 }) +
      chip(480, 196, '所以 n₀ = p₀ = nᵢ', '電子、電洞一樣多', 'c2', { fs: 12.5 }) +
      chip(320, 290, 'nᵢ = B·T<sup>3/2</sup>·e<sup>−E<sub>g</sub>/2kT</sup> = 1.50×10¹⁰ cm⁻³', '照題目常數：k = 86×10⁻⁶ eV/K、E<sub>g</sub> = 1.10 eV', 'f', { fs: 13, acc: true }),
    steps: [
      { sub: '純矽裡本來每個電子都被共價鍵綁住。', on: 'blk blkL' },
      { sub: '室溫的熱擾動偶爾打斷一個鍵，<b>一次生出一對</b>電子跟電洞。', on: 'pairs c1' },
      { sub: '所以純矽裡電子跟電洞一樣多，這個數叫 <b>nᵢ</b>。', on: 'c2' },
      { sub: '代老師給的數字：<b>nᵢ = 1.50×10¹⁰ cm⁻³</b>。它是後面所有計算的基準尺。', on: 'f' }
    ]
  };

  /* ── 02 ② 摻硼 ── */
  const M2 = {
    t: '② 摻硼：P 型', en: 'P-TYPE DOPING',
    svg: g('blk', '<rect class="bgw" x="70" y="104" width="250" height="160" rx="10"/>') +
      g('hs', dots('h', 70, 104, 250, 160, 30, 21, 5)) +
      T(80, 122, 'P 型矽', { cls: 'tm', fs: 12.5, a: 'start', k: 'blkL' }) +
      chip(480, 140, '每顆硼收一個電子', '= 留下一個電洞', 'c1', { fs: 12.5 }) +
      chip(480, 204, '電洞是多數載子', '多到跟硼一樣多', 'c2', { fs: 12.5 }) +
      chip(320, 290, 'p<sub>p0</sub> ≈ N<sub>a</sub> = 1.0×10¹⁶ cm⁻³', 'N<sub>a</sub> 是 nᵢ 的一百萬倍，熱產生的那一點點可以忽略', 'f', { fs: 13, acc: true }),
    steps: [
      { sub: '在矽裡加入硼（3 個價電子），就是 <b>P 型</b>。', on: 'blk blkL' },
      { sub: '每顆硼都缺一個電子，收一個電子 = <b>留下一個電洞</b>。', on: 'hs c1' },
      { sub: '電洞變成<b>多數載子</b>，數量幾乎就是硼的數量。', on: 'c2' },
      { sub: '老師的數字：<b>p<sub>p0</sub> ≈ N<sub>a</sub> = 1.0×10¹⁶ cm⁻³</b>。', on: 'f' }
    ]
  };

  /* ── 03 翹翹板：少數載子 ── */
  const M3 = {
    t: '翹翹板：少數載子', en: 'MASS-ACTION LAW',
    svg: g('saw', '<polygon class="bgw" points="320,236 300,266 340,266"/><line class="ln" x1="150" y1="196" x2="490" y2="276" style="stroke-width:4"/>') +
      g('L', '<rect class="accw" x="130" y="152" width="70" height="42" rx="8" style="stroke:var(--s-ink)"/>' + T(165, 177, '電洞', { fs: 14 })) +
      g('R', '<circle class="bgw" cx="470" cy="252" r="14"/>' + T(470, 257, '電子', { fs: 10.5 })) +
      chip(165, 128, '多數：1.0×10¹⁶', null, 'cL', { fs: 12.5 }) + chip(470, 214, '少數：？', null, 'cR', { fs: 12.5 }) +
      chip(320, 300, '乘積永遠固定：n·p = nᵢ²', '熱平衡時', 'cP', { fs: 13, acc: true }) +
      chip(320, 300, 'n<sub>p0</sub> = nᵢ²/N<sub>a</sub> = 2.25×10²⁰ / 10¹⁶ = 2.25×10⁴', '少了 12 個數量級', 'f', { fs: 13, acc: true }),
    steps: [
      { sub: '電子少了多少？想成一座<b>翹翹板</b>。', on: 'saw' },
      { sub: '一邊是多數的電洞，重得往下沉 ——', on: 'L cL' },
      { sub: '另一邊的電子就被翹得很高、很少。', on: 'R cR' },
      { sub: '規則是：兩邊的<b>乘積固定</b>，n·p = nᵢ²（質量作用定律）。', on: 'cP' },
      { sub: '所以 <b>n<sub>p0</sub> = nᵢ²/N<sub>a</sub> = 2.25×10⁴ cm⁻³</b>。小心：nᵢ 要平方。', off: 'cP', on: 'f' }
    ]
  };

  /* ── 04 先整理一下 ── */
  const row = (y, a, b, c, key, cls) => g(key, T(150, y, a, { fs: 14, a: 'start' }) + T(330, y, b, { cls: cls || 'ta', fs: 15 }) + T(500, y, c, { cls: 't', fs: 15 }));
  const M4 = {
    t: '先整理一下：兩塊材料', en: 'SUMMARY · MAJORITY AND MINORITY',
    svg: box(110, 92, 420, 186, 'tb') + row(124, '', '多數載子', '少數載子', 'hd', 'tm') +
      row(170, 'P 型（摻硼）', 'p = 1.0×10¹⁶', 'n = 2.25×10⁴', 'r1') +
      row(222, 'N 型（摻磷）', 'n = 8.0×10¹⁵', 'p = 2.81×10⁴', 'r2') +
      T(320, 258, '單位都是 cm⁻³', { cls: 'ts', fs: 11.5, k: 'u' }) +
      chip(320, 304, 'N 型一樣：多數 ≈ N<sub>d</sub>，少數 = nᵢ²/N<sub>d</sub>', null, 'c', { fs: 12.5 }),
    steps: [
      { sub: '先整理一下。P 型：電洞 1.0×10¹⁶，電子只剩 2.25×10⁴。', on: 'tb hd r1 u' },
      { sub: 'N 型（摻磷）同一招反過來：電子 8.0×10¹⁵，電洞 2.81×10⁴。', on: 'r2 c' },
      { sub: '這四個數字，就是下一題算電流的材料。', op: { r1: 1, r2: 1 } }
    ]
  };

  /* ── 05 ③ 誰在扛電流 ── */
  const M5 = {
    t: '③ 加電場：誰在扛電流？', en: 'DRIFT CURRENT',
    svg: g('E', arrow(90, 124, 550, 124, null, 'lna') + T(560, 128, 'E = 100 V/cm', { cls: 'ta', fs: 12, a: 'end', dy: '-.9em' })) +
      T(80, 160, 'P 型', { fs: 14, a: 'start', k: 'pl' }) +
      g('pb', '<rect class="accw" x="150" y="148" width="300" height="22" rx="4" style="stroke:var(--s-ink)"/>' + T(462, 164, '電洞 76.8 A/cm²', { cls: 'ta', fs: 13, a: 'start' })) +
      g('pe', '<rect class="bgw" x="150" y="178" width="2" height="14"/>' + T(160, 190, '電子 4.86×10⁻¹⁰（小到看不見）', { cls: 'ts', fs: 11.5, a: 'start' })) +
      T(80, 230, 'N 型', { fs: 14, a: 'start', k: 'nl' }) +
      g('nb', '<rect class="accw" x="150" y="218" width="300" height="22" rx="4" style="stroke:var(--s-ink)"/>' + T(462, 234, '電子 172.8', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(320, 282, 'N 型摻得比較少，電流卻比較大', '因為電子跑得比電洞快 2.8 倍（μ<sub>n</sub> = 1350 vs μ<sub>p</sub> = 480）', 'why', { fs: 12.5, acc: true }),
    steps: [
      { sub: '兩塊材料各加 100 V/cm 的電場，電子、電洞都被推著跑。', on: 'E pl' },
      { sub: 'P 型：電洞那項 <b>76.8 A/cm²</b>。', on: 'pb' },
      { sub: '電子那項只有 10⁻¹⁰ —— 像整條高速公路的車流旁邊多一隻螞蟻。<b>電流全靠多數載子。</b>', on: 'pe' },
      { sub: 'N 型：電子扛起 <b>172.8 A/cm²</b>。', on: 'nl nb' },
      { sub: '奇怪，N 型摻得比較少，電流反而比較大？因為<b>電子跑得比較快</b>。', on: 'why' }
    ]
  };

  /* ── 06 ④ 接起來：坡 ── */
  let slope = 'M110 286 H250';
  for (let i = 0; i <= 30; i++) { const u = i / 30, y = 286 - 60 * (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)); slope += ' L' + (250 + u * 140).toFixed(1) + ' ' + y.toFixed(1); }
  slope += ' L530 226';
  const M6 = {
    t: '④ 接起來：長出一道坡', en: 'BUILT-IN POTENTIAL',
    svg: g('pn', '<rect class="bgw" x="110" y="110" width="210" height="80" rx="8"/><rect class="bgw" x="320" y="110" width="210" height="80" rx="8"/>' +
        T(215, 156, 'P', { fs: 22 }) + T(425, 156, 'N', { fs: 22 })) +
      g('dz', '<rect x="290" y="110" width="68" height="80" class="card" style="stroke:var(--s-ink);stroke-dasharray:5 4"/>' + T(324, 104, '空乏區', { cls: 'tm', fs: 11.5 })) +
      '<path class="lna" d="' + slope + '"' + k('sl') + ' style="fill:none;stroke-width:2.4"/>' +
      g('vb', arrow(548, 286, 548, 228, null, 'lna') + T(556, 262, 'V<sub>bi</sub>', { cls: 'ta', fs: 14, a: 'start' })) +
      chip(320, 318, 'V<sub>bi</sub> = 0.026 × ln(3.56×10¹¹) = 0.026 × 26.6 = 0.692 V', '是 ln，不是 log', 'f', { fs: 12.5, acc: true }),
    steps: [
      { sub: '把 P 型和 N 型接在一起。', on: 'pn' },
      { sub: '多數載子往對面擴散、碰到就抵消，接面附近留下不會動的離子：<b>空乏區</b>。', on: 'dz' },
      { sub: '離子的電場擋住擴散，像長出一道<b>坡</b>。', on: 'sl' },
      { sub: '坡的高度叫<b>內建電壓 V<sub>bi</sub></b>：兩邊濃度差越大，坡越高。', on: 'vb' },
      { sub: '老師的數字：<b>V<sub>bi</sub> = 0.692 V</b>。', on: 'f' }
    ]
  };

  /* ── 07 ⑤ 反接：空乏區變寬 ── */
  const M7 = {
    t: '⑤ 反接：空乏區變寬', en: 'REVERSE BIAS',
    svg: g('pn', '<rect class="bgw" x="110" y="120" width="210" height="80" rx="8"/><rect class="bgw" x="320" y="120" width="210" height="80" rx="8"/>' +
        T(160, 166, 'P', { fs: 22 }) + T(480, 166, 'N', { fs: 22 })) +
      '<rect' + k('w1') + ' x="290" y="120" width="68" height="80" class="card" style="stroke:var(--s-ink);stroke-dasharray:5 4"/>' +
      '<rect' + k('w2') + ' x="222" y="120" width="195" height="80" class="card" style="stroke:var(--s-ink);stroke-dasharray:5 4"/>' +
      chip(170, 240, 'P 接負、N 接正', '反著接 = 逆向偏壓 V<sub>R</sub> = 5 V', 'cR', { fs: 12.5 }) +
      chip(470, 240, '坡變高：V<sub>bi</sub> + V<sub>R</sub>', '要露出更多離子才擋得住', 'c1', { fs: 12.5 }) +
      chip(320, 296, '空乏區 W 變成 √(1 + 5/0.692) = 2.87 倍', 'W ∝ √(V<sub>bi</sub> + V<sub>R</sub>)', 'c2', { fs: 12.5, acc: true }),
    steps: [
      { sub: '同一顆接面，平常空乏區只有窄窄一條。', on: 'pn w1' },
      { sub: '加上 5 V 的<b>逆向偏壓</b>（P 接負、N 接正）。', on: 'cR' },
      { sub: '外加電壓幫電場一把，坡變成 V<sub>bi</sub> + V<sub>R</sub>，要露出更多離子才擋得住 ——', on: 'c1' },
      { sub: '所以空乏區<b>變寬</b>，大約變成原本的 2.87 倍。', off: 'w1', on: 'w2 c2' }
    ]
  };

  /* ── 08 電容 = 兩片板子 ── */
  const plates = (x, gap, key, lab) => g(key, '<line class="ln" x1="' + x + '" y1="130" x2="' + x + '" y2="230" style="stroke-width:5"/>' +
    '<line class="ln" x1="' + (x + gap) + '" y1="130" x2="' + (x + gap) + '" y2="230" style="stroke-width:5"/>' +
    T(x + gap / 2, 254, lab, { cls: 'tm', fs: 12.5 }));
  const M8 = {
    t: '電容：兩片板子拉開', en: 'JUNCTION CAPACITANCE',
    svg: plates(130, 40, 'pa', '靠很近：電容大') + plates(380, 130, 'pb', '拉很開：電容小') +
      chip(320, 296, '空乏區 = 中間的絕緣層，P、N 區 = 兩片極板', null, 'c0', { fs: 12.5 }) +
      chip(320, 300, 'C<sub>j</sub> = 0.50 ÷ √8.23 = 0.174 pF', '指數是 −1/2：逆偏越大，電容越小', 'f', { fs: 13, acc: true }),
    steps: [
      { sub: '電容就是兩片板子隔一層絕緣。板子<b>靠得越近，電容越大</b>。', on: 'pa' },
      { sub: '板子<b>拉得越開，電容越小</b>。', on: 'pb' },
      { sub: 'pn 接面也一樣：空乏區是絕緣層，兩邊是極板。空乏區變寬 = 板子拉開。', on: 'c0' },
      { sub: '老師的數字：C<sub>j</sub> 從 0.50 pF 降到 <b>0.174 pF</b>。', off: 'c0', on: 'f' }
    ]
  };

  /* ── 09 恍然大悟 ── */
  const vals = [['① nᵢ', '1.50×10¹⁰'], ['② 少數', '2.25×10⁴／2.81×10⁴'], ['③ J', '76.8／172.8'], ['④ V<sub>bi</sub>', '0.692 V'], ['⑤ C<sub>j</sub>', '0.174 pF']];
  const M9 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: vals.map((v, i) => box(26 + i * 120, 116, 108, 92, 'v' + i, T(80 + i * 120, 146, v[0], { fs: 14 }) + T(80 + i * 120, 180, v[1], { cls: 'ta', fs: i === 1 ? 10.5 : 13 }))).join('') +
      g('ars', [0, 1, 2, 3].map(i => arrow(134 + i * 120, 162, 146 + i * 120, 162, null, 'lna')).join('')) +
      chip(320, 236, '謎題解開了 ✓', '每一步的答案，就是下一步的輸入', 'ans', { fs: 13, acc: true }) +
      chip(320, 274, '考前三個提醒：nᵢ 要平方、用 ln 不是 log、電容指數是 −1/2', null, 'tip', { fs: 12.5 }),
    steps: [
      { sub: '回到開頭：純矽怎麼一路算到 0.174 pF？', on: 'v0 v1 v2 v3 v4', op: dim('v0 v1 v2 v3 v4') },
      { sub: 'nᵢ → 少數載子 → 電流 → V<sub>bi</sub> → C<sub>j</sub>，一格接一格。', op: { v0: 1, v1: 1, v2: 1, v3: 1, v4: 1 }, on: 'ars' },
      { sub: '<b>謎題解開了</b>：每一步的答案就是下一步的輸入。', on: 'ans' },
      { sub: '考前三個提醒：nᵢ 要平方、用 ln 不是 log、電容的指數是 −1/2。往下就能一題一題自己算。', on: 'tip' }
    ]
  };

  window.__mt1Story = window.__Story('#story', {
    id: 'midterm1', title: '期中考 1 複習：一條鏈', after: '#given',
    scenes: [M0, M1, M2, M3, M4, M5, M6, M7, M8, M9]
  });
})();
