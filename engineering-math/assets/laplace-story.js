/* ============================================================
   工程數學 拉普拉斯轉換 —— 故事模式
   主線謎題：y′ + 3y = 0、y(0) = 2。一個長得莫名其妙的積分，憑什麼能把「微分」變成「乘法」？
   答案：分部積分把微分從 f 搬到 e^(−st) 身上，e^(−st) 一微分就吐出一個 s；邊界項留下 −f(0)。
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

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '繞遠路反而比較快', en: 'THE QUESTION',
    svg: T(320, 102, 'y′ + 3y = 0，y(0) = 2', { cls: 't', fs: 22, k: 'eq' }) +
      box(150, 170, 200, 50, 't 域：微分方程', 'b1', false, 14) +
      box(490, 170, 220, 50, 's 域：sY − 2 + 3Y = 0', 'b2', true, 14) +
      box(490, 286, 200, 50, 'Y = 2 / (s + 3)', 'b3', true, 15) +
      box(150, 286, 200, 50, 'y = 2e^(−3t)', 'b4', false, 15) +
      g('a1', arrow(254, 170, 376, 170, null, 'lna') + T(315, 158, 'ℒ', { cls: 'ta', fs: 16 })) +
      g('a2', arrow(490, 197, 490, 259, null, 'lna') + T(500, 228, '移項（代數）', { cls: 'ta', fs: 13, a: 'start', dy: '.35em' })) +
      g('a3', arrow(388, 286, 252, 286, null, 'lna') + T(320, 274, 'ℒ⁻¹（查表）', { cls: 'ta', fs: 13 })) +
      g('hard', '<path class="ln dsh" style="fill:none" d="M150 197 V259"/>' + T(140, 228, '直接解：要猜、要積分', { cls: 'ts', fs: 12, a: 'end', dy: '.35em' })) +
      T(320, 240, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '一道微分方程：<b>y′ + 3y = 0，y(0) = 2</b>。要找的是一整個函數 y(t)。', on: 'eq b1' },
      { sub: '直接解：要猜解長什麼樣、要積分……一開始會覺得很抽象。', on: 'hard' },
      { sub: '拉普拉斯的走法：先把它<b>搬到 s 世界</b> —— 在那裡它變成一條<b>一次方程</b>。', on: 'a1 b2' },
      { sub: '移項解出 Y，再<b>搬回來</b>，答案就出來了：y = 2e<sup>−3t</sup>。全程只有加減乘除和查表。', on: 'a2 b3 a3 b4' },
      { sub: '問題是：一個長得莫名其妙的積分，憑什麼能把「微分」變成「乘法」？', op: { eq: 0.15, b1: 0.15, b2: 0.15, b3: 0.15, b4: 0.15, a1: 0.15, a2: 0.15, a3: 0.15, hard: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 轉換是一台機器 ════════════ */
  const row = (y, l, m, r, key) => g(key, T(250, y, l, { cls: 't', fs: 14, a: 'end', dy: '.35em' }) + arrow(260, y, 290, y, null, 'ln') +
    T(320, y, m, { cls: 'ta', fs: 13, dy: '.35em' }) + arrow(350, y, 380, y, null, 'ln') + T(390, y, r, { cls: 't', fs: 14, a: 'start', dy: '.35em' }));
  const S1 = {
    t: '轉換是一台機器', en: 'WHAT IS A TRANSFORM',
    svg: box(320, 120, 120, 52, 'T', 'm', true, 22) +
      g('A', T(170, 120, 'A', { cls: 't', fs: 22, dy: '.35em' }) + arrow(190, 120, 256, 120, null, 'ln')) +
      g('B', arrow(384, 120, 450, 120, null, 'ln') + T(470, 120, 'B = T(A)', { cls: 't', fs: 18, a: 'start', dy: '.35em' })) +
      row(200, '中文句子', '翻譯', 'English sentence', 'r1') +
      row(246, '乘法 a × b', 'log', '加法 log a + log b', 'r2') +
      row(292, '微分 f′(t)', 'ℒ', '乘以 s：sF(s) − f(0)', 'r3'),
    steps: [
      { sub: '「轉換」就是一台機器：A 進去，變成<b>另一種東西</b> B 出來。', on: 'm A B' },
      { sub: '熟悉的例子：<b>翻譯</b>。中文進去、英文出來 —— 意思不變，形式變了。', on: 'r1' },
      { sub: '更像的例子：<b>對數</b>。log 把<b>乘法變成加法</b>，以前的計算尺就是靠這招算乘法。', on: 'r2' },
      { sub: '拉普拉斯也一樣：它把<b>微分變成乘以 s</b>。難的運算換成簡單的，算完再轉回來。', on: 'r3' }
    ]
  };

  /* ════════════ 02 實變數 vs 複變數 ════════════ */
  const S2 = {
    t: '實變數 vs 複變數', en: 'REAL VARIABLE VS COMPLEX VARIABLE',
    svg: g('tl', T(160, 110, 'f(t)：輸入是一個實數', { cls: 't', fs: 15 }) + arrow(50, 200, 280, 200, null, 'ln') + T(286, 200, 't', { cls: 'tm', fs: 14, a: 'start', dy: '.35em' }) +
        '<circle class="acc" cx="170" cy="200" r="6"/>' + T(170, 226, 't = 2（一個數字）', { cls: 'ta', fs: 13 })) +
      g('sp', T(480, 110, 'F(s)：輸入是一個複數', { cls: 't', fs: 15 }) + arrow(370, 220, 600, 220, null, 'ln') + arrow(400, 310, 400, 130, null, 'ln') +
        T(604, 220, 'σ', { cls: 'tm', fs: 14, a: 'start', dy: '.35em' }) + T(408, 136, 'jω', { cls: 'tm', fs: 14, a: 'start' })) +
      g('pt', '<path class="ln dsh" d="M520 220 V160 M400 160 H520"/><circle class="acc" cx="520" cy="160" r="6"/>' + T(528, 150, 's = σ + jω', { cls: 'ta', fs: 13, a: 'start' }) + T(528, 186, '一個點', { cls: 'ts', fs: 12, a: 'start' })) +
      chip(320, 296, '這一章 s 大多只是一個代數符號', '像 x 一樣加減乘除就好，不用畫圖', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: 'f(t) 的輸入是一個<b>實數</b> t（時間），畫在一條數線上。', on: 'tl' },
      { sub: 'F(s) 的輸入是一個<b>複數</b> s = σ + jω —— 平面上的一個點。', on: 'sp pt' },
      { sub: '所以 F(s) 畫不出一般的曲線圖。但別怕：這一章裡 s 大多時候只是個<b>代數符號</b>，像 x 一樣運算。', on: 'c' }
    ]
  };

  /* ════════════ 03 乘 e^(−st) 再積分 ════════════ */
  const X3 = t => 90 + t * 96, Y3 = v => 290 - 150 * v;
  let area1 = 'M' + X3(0) + ' 290', area2 = 'M' + X3(0) + ' 290';
  for (let i = 0; i <= 100; i++) { const t = i * 0.05; area1 += ' L' + X3(t).toFixed(1) + ' ' + Y3(Math.exp(-t)).toFixed(1); area2 += ' L' + X3(t).toFixed(1) + ' ' + Y3(Math.exp(-2 * t)).toFixed(1); }
  area1 += ' L' + X3(5) + ' 290 Z'; area2 += ' L' + X3(5) + ' 290 Z';
  const S3 = {
    t: '為什麼是乘 e^(−st) 再積分', en: 'F(s) = ∫ f(t) e^(−st) dt',
    svg: T(320, 100, 'F(s) = ∫₀^∞ f(t) · e^(−st) dt', { cls: 't', fs: 21, k: 'f' }) +
      g('ax', '<path class="ln" d="M86 290 H584 M90 294 V122"/>' + T(590, 290, 't', { cls: 'tm', fs: 13, a: 'start', dy: '.35em' })) +
      path('M90 ' + Y3(1) + ' H570', 'ln', 'c1', 'stroke-width:2.4') + T(560, Y3(1) - 10, 'f(t) = 1', { cls: 't', fs: 13, a: 'end', k: 'l1' }) +
      '<path class="acc" opacity=".22" d="' + area1 + '"' + k('area') + '/>' +
      path(P(x => Y3(Math.exp(-(x - 90) / 96)), 90, 570, 160), 'lna', 'c2', 'stroke-width:2.8') + T(180, 196, 'f(t)·e^(−st)（s = 1）', { cls: 'ta', fs: 13, a: 'start', k: 'l2' }) +
      T(330, 250, '面積 = 1/s = 1', { cls: 'ta', fs: 15, k: 'res' }) +
      '<path class="acc" opacity=".35" d="' + area2 + '"' + k('area2') + '/>' +
      path(P(x => Y3(Math.exp(-2 * (x - 90) / 96)), 90, 570, 160), 'lna', 'c3', 'stroke-width:2;stroke-dasharray:6 4') +
      chip(470, 196, 's = 2：掉得更快，面積 = 1/2', 's 越大 → 面積越小 → 正是 1/s', 'c4', { fs: 12.5, acc: true }),
    steps: [
      { sub: '定義：<b>F(s) = ∫₀^∞ f(t)·e<sup>−st</sup> dt</b>。拆成兩個動作來看。', on: 'f' },
      { sub: '先拿一個 f(t)，最簡單的：f(t) = 1，一條水平線。', on: 'ax c1 l1' },
      { sub: '動作一：乘上 e<sup>−st</sup>。乘完變成一條往下掉的曲線，尾巴被壓到 0 —— <b>這樣積分才不會發散</b>。', op: { c1: 0.3 }, on: 'c2 l2' },
      { sub: '動作二：<b>積分</b>，算底下的面積。t 被積掉了，只剩下 s：ℒ(1) = <b>1/s</b>。', on: 'area res' },
      { sub: '換 s = 2：曲線掉得更快，面積剩 1/2。<b>F(s) 就是「每個 s 對應一塊面積」</b>。', on: 'area2 c3 c4' }
    ]
  };

  /* ════════════ 04 轉換表 ════════════ */
  const trow = (y, a, b, key) => g(key, T(250, y, a, { cls: 't', fs: 16, a: 'end', dy: '.35em' }) + T(320, y, '→', { cls: 'tm', fs: 16, dy: '.35em' }) + T(390, y, b, { cls: 'ta', fs: 16, a: 'start', dy: '.35em' }));
  const S4 = {
    t: '基本轉換表', en: 'TABLE OF TRANSFORMS',
    svg: T(250, 100, 'f(t)', { cls: 'tm', fs: 13, a: 'end' }) + T(390, 100, 'F(s)', { cls: 'tm', fs: 13, a: 'start' }) +
      trow(130, '1', '1 / s', 'r1') + trow(166, 't', '1 / s²', 'r2') + trow(202, 'e^(at)', '1 / (s − a)', 'r3') +
      trow(238, 'sin ωt', 'ω / (s² + ω²)', 'r4') + trow(274, 'cos ωt', 's / (s² + ω²)', 'r5') +
      chip(320, 314, '全部同一招：指數合併 → 代上下限', '例：∫ e^(at)·e^(−st) dt = ∫ e^(−(s−a)t) dt = 1/(s − a)', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '剛剛那塊面積就是表上的第一列：ℒ(1) = 1/s。', on: 'r1' },
      { sub: '其他幾條要背，但它們全是<b>同一招</b>積出來的。', on: 'r2 r3 r4 r5' },
      { sub: '把指數合併成 e<sup>−(s−a)t</sup>，再代上下限 —— 你會發現<b>看懂一條就等於看懂全部</b>。', on: 'c' }
    ]
  };

  /* ════════════ 05 微分性質 ════════════ */
  const line5 = (y, s, key, cls) => T(320, y, s, { cls: cls || 't', fs: 16, k: key });
  const S5 = {
    t: '整章最重要的一條', en: 'ℒ(f′) = sF(s) − f(0)',
    svg: line5(108, 'ℒ(f′) = ∫₀^∞ f′(t) · e^(−st) dt', 'l1') +
      line5(150, '分部積分：∫ u dv = uv − ∫ v du', 'l2', 'tm') +
      line5(192, '= [ f(t)·e^(−st) ]₀^∞ − ∫₀^∞ f(t) · (−s e^(−st)) dt', 'l3') +
      line5(234, '= ( 0 − f(0) ) + s · ∫₀^∞ f(t) e^(−st) dt', 'l4') +
      T(320, 282, 'ℒ(f′) = s·F(s) − f(0)', { cls: 'ta', fs: 22, k: 'l5' }) +
      chip(150, 312, 'e^(−st) 一微分就吐出 −s', '這就是「微分 → 乘以 s」的來源', 'c1', { fs: 12, acc: true }) +
      chip(490, 312, '邊界項留下 −f(0)', '初始條件自動被帶進來', 'c2', { fs: 12 }),
    steps: [
      { sub: '要知道微分方程在 s 世界長怎樣，先看 ℒ(f′)。照定義寫出來。', on: 'l1' },
      { sub: '用<b>分部積分</b>：把微分從 f 身上<b>搬到</b> e<sup>−st</sup> 身上。', on: 'l2 l3' },
      { sub: 'e<sup>−st</sup> 一微分就吐出一個 <b>−s</b>，負負得正提到積分外面 —— 剩下的積分就是 F(s)！', on: 'l4 c1' },
      { sub: '邊界項：t → ∞ 時被 e<sup>−st</sup> 壓成 0，t = 0 時留下 <b>−f(0)</b>。', on: 'c2' },
      { sub: '結論：<b>ℒ(f′) = sF(s) − f(0)</b>。微分變成乘以 s，初始條件順便帶進來。', on: 'l5' }
    ]
  };

  /* ════════════ 06 為什麼非要 −f(0) ════════════ */
  const S6 = {
    t: '為什麼非要 −f(0)', en: 'WHY THE −f(0)',
    svg: T(320, 104, '拿 f(t) = 1 來對答案', { cls: 't', fs: 17, k: 'h' }) +
      g('L', T(320, 146, 'f′(t) = 0　⟹　ℒ(f′) = ℒ(0) = 0', { cls: 't', fs: 16 })) +
      g('W', T(320, 196, '只寫 sF(s)：s · (1/s) = 1', { cls: 't', fs: 16 }) + T(320, 222, '≠ 0　✗', { cls: 'ts', fs: 16 })) +
      g('R', T(320, 266, '補上 −f(0)：1 − 1 = 0　✓', { cls: 'ta', fs: 18 })) +
      chip(320, 314, '漏掉 −f(0)，常數的微分就不是 0 了', '你筆記上先猜 sF(s)（三個問號），推導完才補上它 —— 這一步做對了', 'c', { fs: 12.5, acc: true }),
    steps: [
      { sub: '推導看懂了，但「為什麼非要它不可」？拿最簡單的函數對答案：<b>f(t) = 1</b>。', on: 'h' },
      { sub: '常數的微分是 0，所以 ℒ(f′) 一定要是 0。', on: 'L' },
      { sub: '如果只寫 sF(s)：s × 1/s = 1，<b>錯了</b>。', on: 'W' },
      { sub: '補上 −f(0) = −1：1 − 1 = 0，<b>對了</b>。漏掉它，答案就是錯的。', on: 'R c' }
    ]
  };

  /* ════════════ 07 走一整圈 ════════════ */
  const S7 = {
    t: '用 ℒ 解微分方程', en: 'SOLVING AN ODE WITH ℒ',
    svg: T(320, 100, 'y′ + 3y = 0，y(0) = 2', { cls: 't', fs: 18, k: 'q0' }) +
      T(120, 142, '① 兩邊取 ℒ', { cls: 'tm', fs: 13, a: 'start', k: 's1' }) + T(560, 142, '[ sY − y(0) ] + 3Y = 0', { cls: 'ta', fs: 16, a: 'end', k: 'e1' }) +
      T(120, 182, '② 代初始條件', { cls: 'tm', fs: 13, a: 'start', k: 's2' }) + T(560, 182, 'sY − 2 + 3Y = 0', { cls: 'ta', fs: 16, a: 'end', k: 'e2' }) +
      T(120, 222, '③ 移項（代數）', { cls: 'tm', fs: 13, a: 'start', k: 's3' }) + T(560, 222, '(s + 3) Y = 2　⟹　Y = 2 / (s + 3)', { cls: 'ta', fs: 16, a: 'end', k: 'e3' }) +
      T(120, 262, '④ 查表 1/(s − a)', { cls: 'tm', fs: 13, a: 'start', k: 's4' }) + T(560, 262, 'a = −3　⟹　y(t) = 2e^(−3t)', { cls: 'ta', fs: 16, a: 'end', k: 'e4' }) +
      chip(320, 310, '驗算：y(0) = 2 ✓　y′ = −6e^(−3t) = −3y ✓', '初始條件在第 ② 步就自己進來了，不用最後再解 C', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '回到開頭那題：<b>y′ + 3y = 0，y(0) = 2</b>。', on: 'q0' },
      { sub: '① 兩邊取 ℒ：每個 y′ 換成 sY − y(0)，每個 y 換成 Y。', on: 's1 e1' },
      { sub: '② 代進 y(0) = 2。<b>初始條件在這裡自動進場</b>。', on: 's2 e2' },
      { sub: '③ 剩下的只是一次方程：移項得 <b>Y = 2/(s + 3)</b>。', on: 's3 e3' },
      { sub: '④ 查表：1/(s − a) ↔ e<sup>at</sup>，a = −3 → <b>y = 2e<sup>−3t</sup></b>。', on: 's4 e4' },
      { sub: '驗算全對。整個過程<b>沒有積分、沒有猜</b>，只有加減乘除和查表。', on: 'c' }
    ]
  };

  /* ════════════ 08 恍然大悟 ════════════ */
  const S8 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 220, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="70" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(188, 124, '微分 → 乘以 s', { fs: 16, cls: 'ta' }) + T(188, 156, '分部積分把微分搬給 e^(−st)', { cls: 'tm', fs: 12.5 }) +
        T(188, 182, 'e^(−st) 微分 = −s · e^(−st)', { cls: 'tm', fs: 12.5 }) + T(188, 222, 'ℒ(f′) = sF − f(0)', { cls: 'ta', fs: 15 })) +
      g('R', '<rect class="card" x="334" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(452, 124, '微分方程 → 代數方程', { fs: 16 }) + T(452, 156, '每個 y′ 都變成 sY − y(0)', { cls: 'tm', fs: 12.5 }) +
        T(452, 182, '解一次方程、再查表', { cls: 'tm', fs: 12.5 }) + T(452, 222, 'y = 2e^(−3t)', { cls: 't', fs: 15 })) +
      chip(320, 282, '謎題解開了 ✓', '那個積分的工作，就是把「微分」翻譯成「乘以 s」', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, '下一個單元：二階 ODE 與特徵方程', '同樣是把微分方程變成代數方程，只是換了一招', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：一個積分，憑什麼能把微分變成乘法？', on: 'q' },
      { sub: '因為<b>分部積分</b>把微分從 f 搬到 e<sup>−st</sup> 身上，而 e<sup>−st</sup> 一微分就吐出一個 s。', off: 'q', on: 'L' },
      { sub: '所以每個 y′ 都變成 sY − y(0)，微分方程整個變成<b>代數方程</b>。', on: 'R' },
      { sub: '「乘 e<sup>−st</sup> 再積分」不是亂湊的，它就是為了做這件翻譯。<b>謎題解開了。</b>', on: 'ans' },
      { sub: '下一個單元：二階常係數 ODE —— 用「猜 e<sup>λt</sup>」把它變成二次方程。', off: 'ans', on: 'next' }
    ]
  };

  window.__laplaceStory = window.__Story('#story', {
    id: 'math-laplace', title: '拉普拉斯轉換', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8]
  });
})();
