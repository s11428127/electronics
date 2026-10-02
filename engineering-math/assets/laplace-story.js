/* ============================================================
   工程數學 拉普拉斯轉換 —— 故事模式
   寫法：照電子學 CH1 PART 1 的節奏 —— 先講「微分是什麼、微分方程在問什麼、為什麼要繞路」，
         用對數、翻譯機當比喻；「先整理一下」之後才看積分公式，最後才推導 ℒ(f′) = sF(s) − f(0)。
   主線謎題：一個量 y 一開始是 2，減少的速度 = 3 × 它自己（y′ + 3y = 0，y(0) = 2）。y 長什麼樣子？
   答案：拉普拉斯轉換把「微分」翻譯成「乘以 s」，整題變成一次方程，解完查表換回來：y = 2e^(−3t)。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const P = (fn, x0, x1, n) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + fn(x).toFixed(1); } return d; };
  const path = (d, cls, key, extra) => '<path class="' + cls + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  const box = (cx, cy, w, h, label, key, acc, fs) => g(key, '<rect class="' + (acc ? 'accw' : 'card') + '" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="10" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.5"/>' +
    T(cx, cy, label, { cls: acc ? 'ta' : 't', fs: fs || 14, dy: '.35em' }));
  const dim = keys => keys.split(' ').reduce((o, kk) => (o[kk] = 0.15, o), {});
  /* 小座標系：原點 (x0, y0)，寬 w、高 h */
  const axes = (x0, y0, w, h, key, xl, yl) => g(key, arrow(x0, y0, x0 + w, y0, null, 'ln') + arrow(x0, y0, x0, y0 - h, null, 'ln') +
    (xl ? T(x0 + w + 6, y0, xl, { cls: 'tm', fs: 13, a: 'start', dy: '.35em' }) : '') + (yl ? T(x0 + 8, y0 - h + 4, yl, { cls: 'tm', fs: 13, a: 'start' }) : ''));

  /* ════════════ 00 謎題 ════════════ */
  const X0 = t => 90 + t * 110, Y0 = v => 290 - v * 70;
  const S0 = {
    t: '一個越變越慢的量', en: 'THE QUESTION',
    svg: axes(90, 290, 250, 180, 'ax', 't', 'y') +
      '<circle class="acc" cx="90" cy="' + Y0(2) + '" r="6"' + k('p0') + '/>' + T(100, Y0(2) - 12, 'y(0) = 2', { cls: 'ta', fs: 13, a: 'start', k: 'p0L' }) +
      path(P(x => Y0(2 * Math.exp(-3 * (x - 90) / 110)), 90, 330, 80), 'ln dsh', 'guess', 'stroke-width:2') +
      T(470, 120, '一開始是 2', { cls: 't', fs: 16, k: 'w1' }) +
      T(470, 160, '減少的速度 = 3 × 自己', { cls: 't', fs: 16, k: 'w2' }) +
      T(470, 180, '（越大掉越快）', { cls: 'ts', fs: 12.5, k: 'w2b' }) +
      T(470, 236, 'y′ + 3y = 0，y(0) = 2', { cls: 'ta', fs: 19, k: 'eq' }) +
      T(470, 260, '微分方程', { cls: 'ts', fs: 12.5, k: 'eqL' }) +
      T(215, 210, '?', { cls: 'ta', fs: 80, k: 'q' }),
    steps: [
      { sub: '一道題目：有一個量 y，<b>一開始是 2</b>。', on: 'ax p0 p0L w1' },
      { sub: '它<b>減少的速度 = 3 × 它現在的大小</b>：越大掉越快，越小掉越慢。', on: 'w2 w2b' },
      { sub: '寫成數學：<b>y′ + 3y = 0，y(0) = 2</b>。這種「跟自己的變化速度有關」的式子，叫<b>微分方程</b>。', on: 'eq eqL' },
      { sub: 'y 到底長什麼樣子？這一章要學一個工具，只用<b>加減乘除和查表</b>就能把它算出來。', on: 'guess q' }
    ]
  };

  /* ════════════ 01 微分是什麼 ════════════ */
  const curve1 = x => 280 - 150 * Math.pow((x - 90) / 450, 1.6);
  const tx = 360, ty = curve1(360), sl = (curve1(361) - curve1(359)) / 2;
  const S1 = {
    t: '先複習：y′ 是什麼', en: 'WHAT IS A DERIVATIVE',
    svg: axes(90, 290, 470, 190, 'ax', '時間 t', '位置 y') +
      path(P(curve1, 90, 540, 90), 'ln', 'cv', 'stroke-width:2.6') +
      g('tan', '<line class="lna" x1="' + (tx - 90) + '" y1="' + (ty - 90 * sl) + '" x2="' + (tx + 90) + '" y2="' + (ty + 90 * sl) + '" style="stroke-width:2.4"/>' +
        '<circle class="acc" cx="' + tx + '" cy="' + ty.toFixed(1) + '" r="6"/>') +
      chip(230, 120, 'y′ = 變化得多快', '像車子的速度表', 'c1', { fs: 13, acc: true }) +
      chip(470, 300, 'y′ = 這一點的斜率', '越陡，變得越快', 'c2', { fs: 12.5 }),
    steps: [
      { sub: '先複習：<b>y′</b>（y 的微分）是什麼？', on: 'ax cv' },
      { sub: '就是 y <b>變化得多快</b>。像開車：y 是位置，y′ 就是速度表上的數字。', on: 'c1' },
      { sub: '在圖上，y′ 就是曲線在那一點的<b>斜率</b>：越陡，變得越快。', on: 'tan c2' }
    ]
  };

  /* ════════════ 02 微分方程在問什麼 ════════════ */
  const yd = x => Y0(2 * Math.exp(-3 * (x - 90) / 110));
  const tang = (t) => { const x = X0(t), y = yd(x), s = (yd(x + 1) - yd(x - 1)) / 2, L = 40 / Math.sqrt(1 + s * s);
    return '<line class="lna" x1="' + (x - L).toFixed(1) + '" y1="' + (y - L * s).toFixed(1) + '" x2="' + (x + L).toFixed(1) + '" y2="' + (y + L * s).toFixed(1) + '" style="stroke-width:2.4"/><circle class="acc" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5"/>'; };
  const S2 = {
    t: 'y′ = −3y 在說什麼', en: 'READING THE EQUATION',
    svg: axes(90, 290, 470, 180, 'ax', 't', 'y') +
      T(320, 98, 'y′ + 3y = 0　⟺　y′ = −3y', { cls: 't', fs: 20, k: 'f' }) +
      g('t1', tang(0.12)) + T(X0(0.12) + 16, yd(X0(0.12)) - 14, 'y 大 → 掉很快', { cls: 'ta', fs: 13, a: 'start', k: 't1L' }) +
      g('t2', tang(1.2)) + T(X0(1.2) + 10, yd(X0(1.2)) - 20, 'y 小 → 掉很慢', { cls: 'ta', fs: 13, a: 'start', k: 't2L' }) +
      path(P(yd, 90, 560, 100), 'ln', 'cv', 'stroke-width:2.6') +
      chip(420, 160, '可是它「到底是什麼函數」？', '光看圖猜不出來', 'cQ', { fs: 13, acc: true }),
    steps: [
      { sub: '把題目移項：<b>y′ = −3y</b>。變化的速度 = −3 × 自己。', on: 'f ax' },
      { sub: 'y 很大的時候：y′ 很負 → <b>掉得很快</b>。', on: 't1 t1L' },
      { sub: 'y 變小了：y′ 也變小 → <b>掉得很慢</b>。', on: 't2 t2L' },
      { sub: '所以答案大概長這樣：一開始掉很快，後來越來越平。', on: 'cv' },
      { sub: '可是它<b>到底是什麼函數</b>？光靠看圖說不出來。', on: 'cQ' }
    ]
  };

  /* ════════════ 03 為什麼難 ════════════ */
  const card = (x, key, title, l1, l2, l3, acc) => g(key, '<rect class="card" x="' + x + '" y="98" width="250" height="186" rx="14" filter="url(#st-sh)"/>' +
    T(x + 125, 128, title, { cls: acc ? 'ta' : 't', fs: 16 }) + T(x + 125, 172, l1, { cls: 't', fs: 18 }) +
    T(x + 125, 214, l2, { cls: 'tm', fs: 13 }) + T(x + 125, 252, l3, { cls: acc ? 'ta' : 'tm', fs: 13 }));
  const S3 = {
    t: '為什麼微分方程比較難', en: 'WHY IT IS HARDER',
    svg: card(50, 'A', '國中的方程式', '2x + 3 = 7', '要找的是「一個數」', '移項 → x = 2，搞定') +
      card(340, 'B', '微分方程', 'y′ + 3y = 0', '要找的是「一整條曲線」', '裡面有 y′，不能直接移項', true) +
      chip(320, 316, '如果能把 y′ 變成「乘一個數」，就能像國中一樣移項了', null, 'cI', { fs: 13, acc: true }),
    steps: [
      { sub: '國中的方程式 2x + 3 = 7：要找的是<b>一個數</b>，移項就解完了。', on: 'A' },
      { sub: '微分方程 y′ + 3y = 0：要找的是<b>一整條曲線</b>，而且裡面有 y′，沒辦法直接移項。', on: 'B' },
      { sub: '如果有辦法把「y′」變成「<b>乘一個數</b>」，是不是就能像國中一樣移項了？', on: 'cI' }
    ]
  };

  /* ════════════ 04 繞路的點子：對數 ════════════ */
  const S4 = {
    t: '難的事，換個樣子做', en: 'TAKE A DETOUR',
    svg: box(160, 140, 210, 50, '123 × 456　乘法：難', 'b1', false, 14) +
      box(480, 140, 230, 50, 'log 123 + log 456　加法：簡單', 'b2', true, 13) +
      box(480, 262, 210, 50, '加完再「查表」換回來', 'b3', true, 14) +
      box(160, 262, 210, 50, '答案 56088', 'b4', false, 15) +
      g('a1', arrow(268, 140, 362, 140, null, 'lna') + T(315, 128, '取 log', { cls: 'ta', fs: 13 })) +
      g('a2', arrow(480, 168, 480, 234, null, 'lna')) +
      g('a3', arrow(372, 262, 268, 262, null, 'lna') + T(320, 250, '反查', { cls: 'ta', fs: 13 })) +
      g('hard', '<path class="ln dsh" style="fill:none" d="M160 168 V234"/>' + T(150, 202, '直接算：好累', { cls: 'ts', fs: 12, a: 'end', dy: '.35em' })) +
      chip(320, 320, '繞了一圈，反而比較快', null, 'cF', { fs: 13, acc: true }),
    steps: [
      { sub: '數學家很早就有一招：<b>難的事，換個樣子做</b>。', on: 'b1' },
      { sub: '以前沒有計算機，大數字相乘很痛苦。', on: 'hard' },
      { sub: '取對數 log：<b>乘法變成加法</b>，加法就簡單多了。', on: 'a1 b2' },
      { sub: '加完再查表換回來，就是答案。', on: 'a2 b3 a3 b4' },
      { sub: '繞了一圈，<b>反而比較快</b>。拉普拉斯轉換就是同一招。', on: 'cF' }
    ]
  };

  /* ════════════ 05 拉普拉斯的繞路 ════════════ */
  const S5 = {
    t: '拉普拉斯：同一招', en: 'THE LAPLACE DETOUR',
    svg: box(150, 140, 210, 50, '微分方程（難）', 'b1', false, 14) +
      box(490, 140, 230, 50, '一次方程（國中程度）', 'b2', true, 14) +
      box(490, 262, 210, 50, 'Y = 2 / (s + 3)', 'b3', true, 15) +
      box(150, 262, 210, 50, 'y = 2e^(−3t)', 'b4', false, 15) +
      g('a1', arrow(258, 140, 372, 140, null, 'lna') + T(315, 128, 'ℒ（轉換）', { cls: 'ta', fs: 13 })) +
      g('a2', arrow(490, 168, 490, 234, null, 'lna') + T(500, 201, '移項', { cls: 'ta', fs: 13, a: 'start', dy: '.35em' })) +
      g('a3', arrow(382, 262, 258, 262, null, 'lna') + T(320, 250, 'ℒ⁻¹（查表換回來）', { cls: 'ta', fs: 13 })) +
      chip(320, 320, '在 s 世界裡：微分 → 乘以 s', '這就是讓它變簡單的關鍵', 'cK', { fs: 13, acc: true }),
    steps: [
      { sub: '拉普拉斯轉換 ℒ 是同一招：先把微分方程<b>搬到另一個世界</b>（叫 s 世界）。', on: 'b1 a1' },
      { sub: '在那個世界裡，<b>微分變成乘以 s</b>，整條方程變成國中程度的一次方程。', on: 'b2 cK' },
      { sub: '移項解出來 ——', on: 'a2 b3' },
      { sub: '再查表<b>搬回來</b>，就是答案 y = 2e<sup>−3t</sup>。', on: 'a3 b4' }
    ]
  };

  /* ════════════ 06 轉換是一台機器 ════════════ */
  const row = (y, l, m, r, key) => g(key, T(250, y, l, { cls: 't', fs: 14, a: 'end', dy: '.35em' }) + arrow(260, y, 290, y, null, 'ln') +
    T(320, y, m, { cls: 'ta', fs: 13, dy: '.35em' }) + arrow(350, y, 380, y, null, 'ln') + T(390, y, r, { cls: 't', fs: 14, a: 'start', dy: '.35em' }));
  const S6 = {
    t: '「轉換」就是一台機器', en: 'WHAT IS A TRANSFORM',
    svg: box(320, 120, 120, 52, '機器', 'm', true, 18) +
      g('A', T(170, 120, '進去', { cls: 't', fs: 16, dy: '.35em' }) + arrow(200, 120, 256, 120, null, 'ln')) +
      g('B', arrow(384, 120, 440, 120, null, 'ln') + T(450, 120, '出來的是另一種東西', { cls: 't', fs: 15, a: 'start', dy: '.35em' })) +
      row(204, '中文句子', '翻譯機', 'English sentence', 'r1') +
      row(250, '乘法', 'log', '加法', 'r2') +
      row(296, 'f(t)（時間的函數）', 'ℒ', 'F(s)（s 的函數）', 'r3'),
    steps: [
      { sub: '「轉換」聽起來很玄，其實就是一台<b>機器</b>：東西放進去，出來變成<b>另一種東西</b>。', on: 'm A B' },
      { sub: '像翻譯機：中文進去、英文出來 —— 意思一樣，樣子變了。', on: 'r1' },
      { sub: 'log 也是：乘法進去、加法出來。', on: 'r2' },
      { sub: 'ℒ 也是：時間的函數 f(t) 進去，出來一個 s 的函數 <b>F(s)</b>。', on: 'r3' }
    ]
  };

  /* ════════════ 07 先整理一下 ════════════ */
  const card7 = (x, key, title, l1, l2) => g(key, '<rect class="card" x="' + x + '" y="100" width="176" height="150" rx="14" filter="url(#st-sh)"/>' +
    T(x + 88, 134, title, { cls: 'ta', fs: 17 }) + T(x + 88, 176, l1, { cls: 'tm', fs: 13 }) + T(x + 88, 204, l2, { cls: 'tm', fs: 13 }));
  const S7 = {
    t: '先整理一下', en: 'SO FAR',
    svg: card7(40, 'A', '問題', '微分方程很難解', '因為有 y′') +
      card7(232, 'B', '點子', '繞路：換到 s 世界', '微分 → 乘以 s') +
      card7(424, 'C', '工具', '一台機器 ℒ', 'f(t) → F(s)') +
      chip(320, 296, '觀念到這裡就夠了', '接下來：打開機器，看它裡面怎麼運作', 'cN', { fs: 13, acc: true }),
    steps: [
      { sub: '整理一下。<b>問題</b>：微分方程裡有 y′，沒辦法直接移項。', on: 'A' },
      { sub: '<b>點子</b>：繞路，換到 s 世界，讓微分變成乘以 s。', on: 'B' },
      { sub: '<b>工具</b>：一台叫 ℒ 的機器，把 f(t) 換成 F(s)。', on: 'C' },
      { sub: '觀念就這三個。接下來才打開機器，看它的公式。', on: 'cN' }
    ]
  };

  /* ════════════ 08 機器的說明書 ════════════ */
  const S8 = {
    t: '機器的說明書', en: 'F(s) = ∫ f(t) e^(−st) dt',
    svg: T(140, 140, 'F(s) =', { cls: 't', fs: 26, k: 'pF' }) + T(232, 140, '∫₀^∞', { cls: 't', fs: 26, k: 'pI' }) +
      T(310, 140, 'f(t)', { cls: 't', fs: 26, k: 'pf' }) + T(352, 140, '·', { cls: 't', fs: 26, k: 'pd' }) +
      T(420, 140, 'e^(−st)', { cls: 't', fs: 26, k: 'pe' }) + T(500, 140, 'dt', { cls: 't', fs: 26, k: 'pt' }) +
      g('h1', '<rect x="282" y="112" width="56" height="40" rx="6" class="acc" opacity=".14"/>' + T(310, 186, '① 放進去的函數', { cls: 'ta', fs: 13 })) +
      g('h2', '<rect x="372" y="112" width="96" height="40" rx="6" class="acc" opacity=".14"/>' + T(420, 214, '② 乘上一條往下掉的曲線', { cls: 'ta', fs: 13 })) +
      g('h3', '<rect x="200" y="106" width="64" height="48" rx="6" class="acc" opacity=".14"/><rect x="484" y="112" width="36" height="40" rx="6" class="acc" opacity=".14"/>' +
        T(232, 242, '③ 從 0 加到 ∞（算面積）', { cls: 'ta', fs: 13 })) +
      g('h4', '<rect x="104" y="112" width="72" height="40" rx="6" class="acc" opacity=".14"/>' + T(140, 270, '④ 出來的只跟 s 有關', { cls: 'ta', fs: 13 })) +
      chip(320, 316, '看起來嚇人，其實只有三個動作', null, 'c', { fs: 13 }),
    steps: [
      { sub: '這是 ℒ 的說明書。看起來很嚇人 —— 其實只有<b>三個動作</b>。', on: 'pF pI pf pd pe pt c' },
      { sub: '① 把要轉換的函數 <b>f(t)</b> 放進去。', off: 'c', on: 'h1' },
      { sub: '② 乘上 <b>e<sup>−st</sup></b>，一條會往下掉的曲線（下一個畫面就看它）。', on: 'h2' },
      { sub: '③ 從 t = 0 積分到 ∞ —— <b>積分就是算曲線底下的面積</b>。', on: 'h3' },
      { sub: '④ t 被積掉了，出來的東西只跟 s 有關，叫 <b>F(s)</b>。', on: 'h4' }
    ]
  };

  /* ════════════ 09 e^(−st) 長什麼樣 ════════════ */
  const X9 = t => 90 + t * 96, Y9 = v => 290 - 160 * v;
  const S9 = {
    t: 'e^(−st)：一條往下掉的曲線', en: 'WHAT e^(−st) LOOKS LIKE',
    svg: axes(90, 290, 490, 180, 'ax', 't', null) +
      T(80, Y9(1), '1', { cls: 'tm', fs: 13, a: 'end', dy: '.35em', k: 'one' }) +
      path(P(x => Y9(Math.exp(-0.5 * (x - 90) / 96)), 90, 570, 120), 'ln', 'c05', 'stroke-width:2.2') + T(560, Y9(Math.exp(-0.5 * 4.9)) - 12, 's = 0.5', { cls: 't', fs: 13, a: 'end', k: 'l05' }) +
      path(P(x => Y9(Math.exp(-(x - 90) / 96)), 90, 570, 120), 'lna', 'c1', 'stroke-width:2.6') + T(250, Y9(Math.exp(-1.6)) - 14, 's = 1', { cls: 'ta', fs: 13, a: 'start', k: 'l1' }) +
      path(P(x => Y9(Math.exp(-2 * (x - 90) / 96)), 90, 570, 120), 'lna', 'c2', 'stroke-width:2;stroke-dasharray:6 4') + T(134, Y9(Math.exp(-0.9)) + 4, 's = 2', { cls: 'ta', fs: 13, a: 'start', k: 'l2' }) +
      chip(420, 130, 's 越大，掉得越快', null, 'cS', { fs: 13, acc: true }) +
      chip(420, 176, '它的工作：把尾巴壓到 0', '這樣面積才不會無限大', 'cT', { fs: 12.5 }),
    steps: [
      { sub: 'e<sup>−st</sup> 是一條<b>從 1 開始往下掉</b>的曲線。這是 s = 1 的樣子。', on: 'ax one c1 l1' },
      { sub: '換 s = 0.5：掉得慢；換 s = 2：掉得快。<b>s 越大，掉得越快</b>。', on: 'c05 l05 c2 l2 cS' },
      { sub: '它的工作是把 f(t) 的尾巴<b>壓到 0</b>，這樣底下的面積才算得出來，不會無限大。', on: 'cT' }
    ]
  };

  /* ════════════ 10 算面積：ℒ(1) = 1/s ════════════ */
  let area1 = 'M' + X9(0) + ' 290', area2 = 'M' + X9(0) + ' 290';
  for (let i = 0; i <= 100; i++) { const t = i * 0.05; area1 += ' L' + X9(t).toFixed(1) + ' ' + Y9(Math.exp(-t)).toFixed(1); area2 += ' L' + X9(t).toFixed(1) + ' ' + Y9(Math.exp(-2 * t)).toFixed(1); }
  area1 += ' L' + X9(5) + ' 290 Z'; area2 += ' L' + X9(5) + ' 290 Z';
  const S10 = {
    t: '試一個最簡單的：f(t) = 1', en: 'ℒ(1) = 1/s',
    svg: axes(90, 290, 490, 180, 'ax', 't', null) +
      path('M90 ' + Y9(1) + ' H570', 'ln', 'c1', 'stroke-width:2.4') + T(560, Y9(1) - 10, 'f(t) = 1', { cls: 't', fs: 13, a: 'end', k: 'l1' }) +
      '<path class="acc" opacity=".22" d="' + area1 + '"' + k('area') + '/>' +
      path(P(x => Y9(Math.exp(-(x - 90) / 96)), 90, 570, 120), 'lna', 'c2', 'stroke-width:2.8') + T(170, 196, '乘上 e^(−st) 之後', { cls: 'ta', fs: 13, a: 'start', k: 'l2' }) +
      T(330, 256, '面積 = 1/s = 1', { cls: 'ta', fs: 16, k: 'res' }) +
      '<path class="acc" opacity=".35" d="' + area2 + '"' + k('area2') + '/>' +
      path(P(x => Y9(Math.exp(-2 * (x - 90) / 96)), 90, 570, 120), 'lna', 'c3', 'stroke-width:2;stroke-dasharray:6 4') +
      chip(450, 196, 's = 2：面積 = 1/2', '所以 ℒ(1) = 1/s', 'c4', { fs: 13, acc: true }),
    steps: [
      { sub: '試一個最簡單的：<b>f(t) = 1</b>，一條水平線。', on: 'ax c1 l1' },
      { sub: '動作 ②：乘上 e<sup>−st</sup>，就變成那條往下掉的曲線。', op: { c1: 0.3 }, on: 'c2 l2' },
      { sub: '動作 ③：算底下的面積。s = 1 時剛好是 <b>1</b>。', on: 'area res' },
      { sub: 's = 2 時掉得快，面積剩 <b>1/2</b>。規律是：面積 = <b>1/s</b>。所以 ℒ(1) = 1/s。', on: 'area2 c3 c4' }
    ]
  };

  /* ════════════ 11 s 是什麼 ════════════ */
  const S11 = {
    t: 's 到底是什麼？', en: 'WHAT IS s',
    svg: T(320, 112, 'F(s) 裡的 s ＝ e^(−st) 裡決定「掉多快」的那個數', { cls: 't', fs: 16, k: 'a' }) +
      g('sp', arrow(380, 290, 590, 290, null, 'ln') + arrow(410, 316, 410, 160, null, 'ln') + T(594, 290, 'σ', { cls: 'tm', fs: 14, a: 'start', dy: '.35em' }) + T(418, 166, 'jω', { cls: 'tm', fs: 14, a: 'start' }) +
        '<path class="ln dsh" d="M520 290 V210 M410 210 H520"/><circle class="acc" cx="520" cy="210" r="6"/>' + T(528, 200, 's = σ + jω', { cls: 'ta', fs: 13, a: 'start' })) +
      T(200, 196, '課本：s 是一個複數', { cls: 'tm', fs: 14, k: 'b' }) + T(200, 220, '（平面上的一個點）', { cls: 'ts', fs: 12.5, k: 'b2' }) +
      chip(200, 280, '這一章：把 s 當成 x 就好', '加減乘除、移項，跟國中代數一樣', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: 'F(s) 裡的 s，就是 e<sup>−st</sup> 裡<b>決定曲線掉多快</b>的那個數。', on: 'a' },
      { sub: '課本會說 s 是一個<b>複數</b> s = σ + jω，是平面上的一個點。', on: 'sp b b2' },
      { sub: '別被嚇到：這一章裡，把 s 當成跟 x 一樣的<b>代數符號</b>就好。', on: 'c' }
    ]
  };

  /* ════════════ 12 轉換表 ════════════ */
  const trow = (y, a, b, key) => g(key, T(250, y, a, { cls: 't', fs: 16, a: 'end', dy: '.35em' }) + T(320, y, '→', { cls: 'tm', fs: 16, dy: '.35em' }) + T(390, y, b, { cls: 'ta', fs: 16, a: 'start', dy: '.35em' }));
  const S12 = {
    t: '查表用的對照表', en: 'TABLE OF TRANSFORMS',
    svg: T(250, 100, 'f(t)', { cls: 'tm', fs: 13, a: 'end' }) + T(390, 100, 'F(s)', { cls: 'tm', fs: 13, a: 'start' }) +
      trow(130, '1', '1 / s', 'r1') + trow(166, 't', '1 / s²', 'r2') + trow(202, 'e^(at)', '1 / (s − a)', 'r3') +
      trow(238, 'sin ωt', 'ω / (s² + ω²)', 'r4') + trow(274, 'cos ωt', 's / (s² + ω²)', 'r5') +
      chip(320, 316, '全部用同一招算出來', '乘 e^(−st)、算面積 —— 看懂一條就等於看懂全部', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '剛剛算出來的就是對照表第一列：<b>1 → 1/s</b>。', on: 'r1' },
      { sub: '其他常用的函數也這樣算好，排成一張<b>對照表</b>。最後「搬回來」就是查這張表。', on: 'r2 r3 r4 r5' },
      { sub: '它們全是同一招算出來的：乘 e<sup>−st</sup>、算面積。', on: 'c' }
    ]
  };

  /* ════════════ 13 關鍵：指數函數微分還是自己 ════════════ */
  const S13 = {
    t: '關鍵：指數函數微分後還是自己', en: 'THE KEY PROPERTY',
    svg: T(320, 112, '指數函數微分後，還是自己 × 一個數', { cls: 't', fs: 18, k: 'a' }) +
      T(320, 160, '( e^(2t) )′ = 2 · e^(2t)', { cls: 't', fs: 18, k: 'b1' }) +
      T(320, 196, '( e^(−3t) )′ = −3 · e^(−3t)', { cls: 't', fs: 18, k: 'b2' }) +
      T(320, 240, '( e^(−st) )′ = −s · e^(−st)', { cls: 'ta', fs: 22, k: 'b3' }) +
      chip(320, 300, '微分一次，就吐出一個 s', '機器裡剛好有 e^(−st) → 「微分」會被翻譯成「乘以 s」', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '為什麼 ℒ 能把微分變成乘法？關鍵是指數函數的一個性質：<b>微分後還是自己，只多乘一個數</b>。', on: 'a' },
      { sub: '例：e<sup>2t</sup> 微分 → 2·e<sup>2t</sup>；e<sup>−3t</sup> 微分 → −3·e<sup>−3t</sup>。', on: 'b1 b2' },
      { sub: '所以 e<sup>−st</sup> 微分 → <b>−s</b>·e<sup>−st</sup>：<b>微分一次，就吐出一個 s</b>。', on: 'b3' },
      { sub: 'ℒ 的說明書裡剛好有 e<sup>−st</sup> —— 這就是「微分」會被翻譯成「乘以 s」的原因。', on: 'c' }
    ]
  };

  /* ════════════ 14 再深一點：推導 ════════════ */
  const line14 = (y, s, key, cls) => T(320, y, s, { cls: cls || 't', fs: 16, k: key });
  const S14 = {
    t: '再深一點：ℒ(f′) 的推導', en: 'ℒ(f′) = sF(s) − f(0)',
    svg: line14(108, 'ℒ(f′) = ∫₀^∞ f′(t) · e^(−st) dt', 'l1') +
      line14(150, '分部積分：∫ u dv = uv − ∫ v du', 'l2', 'tm') +
      line14(192, '= [ f(t)·e^(−st) ]₀^∞ − ∫₀^∞ f(t) · (−s e^(−st)) dt', 'l3') +
      line14(234, '= ( 0 − f(0) ) + s · ∫₀^∞ f(t) e^(−st) dt', 'l4') +
      T(320, 282, 'ℒ(f′) = s·F(s) − f(0)', { cls: 'ta', fs: 22, k: 'l5' }) +
      chip(150, 316, 'e^(−st) 微分吐出 −s', '負負得正，s 提到外面', 'c1', { fs: 12, acc: true }) +
      chip(490, 316, '邊界項留下 −f(0)', '初始條件自動被帶進來', 'c2', { fs: 12 }),
    steps: [
      { sub: '把剛剛的直覺寫成數學。照說明書，把 f′ 放進機器。', on: 'l1' },
      { sub: '用<b>分部積分</b>：把微分從 f 身上<b>搬到</b> e<sup>−st</sup> 身上。', on: 'l2 l3' },
      { sub: 'e<sup>−st</sup> 一微分就吐出 <b>−s</b>，負負得正提到外面 —— 剩下的積分就是 F(s)！', on: 'l4 c1' },
      { sub: '方括號那項：t → ∞ 時被 e<sup>−st</sup> 壓成 0，t = 0 時留下 <b>−f(0)</b>。', on: 'c2' },
      { sub: '結論：<b>ℒ(f′) = sF(s) − f(0)</b>。微分變成乘以 s，初始值順便帶進來。', on: 'l5' }
    ]
  };

  /* ════════════ 15 為什麼非要 −f(0) ════════════ */
  const S15 = {
    t: '為什麼非要 −f(0)', en: 'WHY THE −f(0)',
    svg: T(320, 104, '拿 f(t) = 1 來對答案', { cls: 't', fs: 17, k: 'h' }) +
      g('L', T(320, 146, '常數的微分 = 0　⟹　ℒ(f′) 一定要是 0', { cls: 't', fs: 16 })) +
      g('W', T(320, 196, '只寫 sF(s)：s × (1/s) = 1', { cls: 't', fs: 16 }) + T(320, 222, '≠ 0　✗', { cls: 'ts', fs: 16 })) +
      g('R', T(320, 266, '補上 −f(0)：1 − 1 = 0　✓', { cls: 'ta', fs: 18 })) +
      chip(320, 316, '漏掉 −f(0)，常數的微分就不是 0 了', '你筆記上先猜 sF(s)（三個問號），推導完才補上它 —— 這一步做對了', 'c', { fs: 12.5, acc: true }),
    steps: [
      { sub: '那個 −f(0) 為什麼非要不可？拿最簡單的 <b>f(t) = 1</b> 對答案。', on: 'h' },
      { sub: '常數的微分是 0，所以 ℒ(f′) 一定要是 0。', on: 'L' },
      { sub: '如果只寫 sF(s)：s × 1/s = 1，<b>錯了</b>。', on: 'W' },
      { sub: '補上 −f(0) = −1：1 − 1 = 0，<b>對了</b>。', on: 'R c' }
    ]
  };

  /* ════════════ 16 走一整圈 ════════════ */
  const S16 = {
    t: '回到題目：走一整圈', en: 'SOLVING THE ODE',
    svg: T(320, 100, 'y′ + 3y = 0，y(0) = 2', { cls: 't', fs: 18, k: 'q0' }) +
      T(120, 142, '① 兩邊放進機器', { cls: 'tm', fs: 13, a: 'start', k: 's1' }) + T(560, 142, '[ sY − y(0) ] + 3Y = 0', { cls: 'ta', fs: 16, a: 'end', k: 'e1' }) +
      T(120, 182, '② 代 y(0) = 2', { cls: 'tm', fs: 13, a: 'start', k: 's2' }) + T(560, 182, 'sY − 2 + 3Y = 0', { cls: 'ta', fs: 16, a: 'end', k: 'e2' }) +
      T(120, 222, '③ 國中移項', { cls: 'tm', fs: 13, a: 'start', k: 's3' }) + T(560, 222, '(s + 3) Y = 2　⟹　Y = 2 / (s + 3)', { cls: 'ta', fs: 16, a: 'end', k: 'e3' }) +
      T(120, 262, '④ 查表 1/(s − a)', { cls: 'tm', fs: 13, a: 'start', k: 's4' }) + T(560, 262, 'a = −3　⟹　y = 2e^(−3t)', { cls: 'ta', fs: 16, a: 'end', k: 'e4' }) +
      chip(320, 310, '驗算：y(0) = 2 ✓　y′ = −6e^(−3t) = −3y ✓', '沒有積分、沒有猜，只有加減乘除和查表', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '回到開頭那題：<b>y′ + 3y = 0，y(0) = 2</b>。', on: 'q0' },
      { sub: '① 兩邊放進機器：y′ 變成 sY − y(0)，y 變成 Y。', on: 's1 e1' },
      { sub: '② 代進 y(0) = 2 —— <b>初始條件在這裡自己進場</b>。', on: 's2 e2' },
      { sub: '③ 現在只是國中的一次方程：移項得 <b>Y = 2/(s + 3)</b>。', on: 's3 e3' },
      { sub: '④ 查對照表搬回來：<b>y = 2e<sup>−3t</sup></b>。', on: 's4 e4' },
      { sub: '驗算全對。整個過程<b>沒有積分、沒有猜</b>，只有加減乘除和查表。', on: 'c' }
    ]
  };

  /* ════════════ 17 恍然大悟 ════════════ */
  const S17 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 220, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="70" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(188, 124, '為什麼會變簡單', { fs: 16, cls: 'ta' }) + T(188, 156, 'e^(−st) 微分會吐出 s', { cls: 'tm', fs: 13 }) +
        T(188, 182, '微分 → 乘以 s', { cls: 'tm', fs: 13 }) + T(188, 222, 'ℒ(y′) = sY − y(0)', { cls: 'ta', fs: 15 })) +
      g('R', '<rect class="card" x="334" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(452, 124, '答案', { fs: 16 }) + T(452, 156, '繞到 s 世界移項', { cls: 'tm', fs: 13 }) +
        T(452, 182, '再查表搬回來', { cls: 'tm', fs: 13 }) + T(452, 222, 'y = 2e^(−3t)', { cls: 't', fs: 16 })) +
      chip(320, 282, '謎題解開了 ✓', '一開始是 2、越大掉越快的那條曲線，就是 2e^(−3t)', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, '下一個單元：二階 ODE 與特徵方程', '同樣是把微分變成「乘一個數」，只是換一招', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：一開始是 2、減少的速度 = 3 × 自己，y 長什麼樣子？', on: 'q' },
      { sub: '拉普拉斯轉換把<b>微分翻譯成乘以 s</b>，因為 e<sup>−st</sup> 一微分就吐出 s。', off: 'q', on: 'L' },
      { sub: '於是整題變成國中的一次方程，移項、查表，答案是 <b>y = 2e<sup>−3t</sup></b>。', on: 'R' },
      { sub: '「乘 e<sup>−st</sup> 再積分」不是亂湊的，它就是為了做這件翻譯。<b>謎題解開了。</b>', on: 'ans' },
      { sub: '下一個單元：二階 ODE —— 同樣是把微分變成「乘一個數」，只是換一招。', off: 'ans', on: 'next' }
    ]
  };

  window.__laplaceStory = window.__Story('#story', {
    id: 'math-laplace', title: '拉普拉斯轉換', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17]
  });
})();
