/* ============================================================
   工程數學期中考（11/12 週三晚上）—— 其他班考古題逐步詳解
   使用者 11/9：「工數一個字都沒讀，請幫我逐步理解這次期中考：四題基本題、三題進階題」
   答案全部用 sympy 驗算過（ℒ、ℒ⁻¹、dsolve；摺積用數值積分驗）。
   window.__EMMID：sec t1 ℒ 正轉換、t2 ℒ⁻¹、t3 解 ODE、t4 RLC 電路、t5 摺積
   ============================================================ */
(function () {
  'use strict';
  const st = (t, eq, why) => ({ t, eq, why });
  const S = window.__SCH;
  const fr = (a, b) => '<span class="frac"><span>' + a + '</span><span>' + b + '</span></span>';

  /* ── 圖 ── */
  const figs = {};
  if (S) {
    figs.b31 = S.svg(260, 150, [S.l(30, 30, 200, 30, '6 H'), S.r(200, 30, 200, 120, '4 Ω'), S.w('30,30', '30,120', '200,120'),
      S.t(115, 62, '→ i₀ = 2 A'), S.t(115, 92, '↻ i(t)')]);
    figs.b32 = S.svg(280, 150, [S.vs(40, 30, 120, '10 V'), S.r(40, 30, 220, 30, '5 Ω'), S.c(220, 30, 220, 120, '6 F'), S.w('40,120', '220,120'),
      S.t(205, 62, '+', 'end'), S.t(205, 110, '−', 'end'), S.t(258, 96, 'v₀ = 4 V', 'middle'), S.t(130, 80, '↻ i(t)')]);
    figs.a31 = S.svg(300, 160, [S.vs(40, 30, 130, '5 V'), S.r(40, 30, 230, 30, '12 Ω'), S.l(230, 30, 230, 130, '2 H'), S.c(230, 130, 40, 130, '1/20 F'),
      S.t(205, 148, '+', 'middle'), S.t(70, 148, '−', 'middle'), S.t(140, 155, 'v₀ = 3 V（右 +）'), S.t(212, 90, 'i₀ = 3 A ↓', 'end'), S.t(135, 85, '↻ i(t)')]);
  }
  /* 方塊函數圖：segs = [[起, 終(null = 一直延伸), 高]] */
  function blk(name, segs, xmax) {
    const W = 230, H = 90, x0 = 26, y0 = 70, sx = (W - x0 - 20) / xmax, sy = 14;
    let s = '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - 6) + '" y2="' + y0 + '"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="8"/>' +
      '<text x="' + (x0 + 6) + '" y="14" font-size="12" fill="currentColor" stroke="none">' + name + '</text><text x="' + (W - 4) + '" y="' + (y0 + 14) + '" font-size="12" text-anchor="end" fill="currentColor" stroke="none">t</text>';
    segs.forEach(([a, b, h]) => {
      const xa = x0 + a * sx, xb = b == null ? W - 12 : x0 + b * sx, yh = y0 - h * sy;
      s += '<polyline points="' + xa + ',' + y0 + ' ' + xa + ',' + yh + ' ' + xb + ',' + yh + (b == null ? '' : ' ' + xb + ',' + y0) + '" fill="none" stroke-width="2"/>' +
        '<text x="' + (x0 - 5) + '" y="' + (yh + 4) + '" font-size="12" text-anchor="end" fill="currentColor" stroke="none">' + h + '</text>' +
        (b == null ? '' : '<text x="' + xb + '" y="' + (y0 + 14) + '" font-size="12" text-anchor="middle" fill="currentColor" stroke="none">' + b + '</text>');
    });
    return '<svg class="schem" viewBox="0 0 ' + W + ' ' + (H + 6) + '" width="' + W + '" style="max-width:48%;height:auto" fill="none" stroke="currentColor" stroke-width="1.4">' + s + '</svg>';
  }
  figs.c1 = blk('f(t)', [[0, null, 3]], 8) + ' ' + blk('g(t)', [[0, 4, 2]], 8);
  figs.c2 = blk('f(t)', [[0, 5, 1]], 8) + ' ' + blk('g(t)', [[0, null, 3]], 8);
  figs.c3 = blk('f(t)', [[0, 10, 2]], 14) + ' ' + blk('g(t)', [[0, 7, 3]], 14);

  const items = [
    /* ═════ 一、ℒ 正轉換 ═════ */
    { id: 'emm-b11', sec: 't1', kind: 'ex', tag: '基本題 一-1（10%）', title: '查表題：四項分開轉',
      q: 'ℒ( ½ u(t) + 4e<sup>2t</sup> t<sup>4</sup> + ½ cos 4t + sinh 5t )',
      steps: [
        st('Step 1　線性：常數提出來、一項一項轉。', 'ℒ(½u) + 4ℒ(e<sup>2t</sup>t<sup>4</sup>) + ½ℒ(cos 4t) + ℒ(sinh 5t)', 'ℒ 是線性的，所以可以拆開。這是每一題的第一步。'),
        st('Step 2　½ u(t)：查表 ℒ(u) = 1/s。', '½ · 1/s = 1/(2s)', '小抄表第 1 行。'),
        st('Step 3　e<sup>2t</sup>t<sup>4</sup>：先轉 t<sup>4</sup>，再用第一位移。', 'ℒ(t<sup>4</sup>) = 4!/s<sup>5</sup> = 24/s<sup>5</sup> ⇒ 乘 e<sup>2t</sup> 就把 s 換成 s − 2 ⇒ 24/(s − 2)<sup>5</sup>', '第一位移定理：t 那邊乘 e<sup>at</sup> ＝ s 那邊往右挪 a（s → s − a）。'),
        st('　乘上前面的 4。', '4 · 24/(s − 2)<sup>5</sup> = 96/(s − 2)<sup>5</sup>', ''),
        st('Step 4　½ cos 4t：查表 s/(s² + ω²)，ω = 4。', '½ · s/(s² + 16) = s/(2(s² + 16))', 'cos 對應分子是 s，sin 對應分子是 ω。'),
        st('Step 5　sinh 5t：查表 a/(s² − a²)，a = 5。', '5/(s² − 25)', 'sinh、cosh 的分母是「減」，sin、cos 是「加」。'),
        st('Step 6　加起來。', '1/(2s) + 96/(s − 2)<sup>5</sup> + s/(2(s² + 16)) + 5/(s² − 25)', '')
      ],
      ans: '1/(2s) + 96/(s − 2)<sup>5</sup> + s/(2(s² + 16)) + 5/(s² − 25)' },

    { id: 'emm-a11', sec: 't1', kind: 'ex', tag: '進階題 一-1（7.5%）', title: '加了兩種位移：e<sup>at</sup> 和 u(t − a)',
      q: 'ℒ( e<sup>5t</sup> sinh 2t + 4(t − 5)<sup>5</sup> u(t − 5) + 2e<sup>−3t</sup> t<sup>4</sup> + ½ cosh 3(t − 3) u(t − 3) )',
      steps: [
        st('Step 1　先分類：哪幾項乘 e<sup>at</sup>（第一位移）、哪幾項有 u(t − a)（第二位移）。', 'e<sup>5t</sup>sinh 2t、2e<sup>−3t</sup>t<sup>4</sup> → 第一位移；(t − 5)<sup>5</sup>u(t − 5)、cosh 3(t − 3)u(t − 3) → 第二位移', '看到 e<sup>at</sup> 乘在前面 → s 換 s − a；看到「整個函數都寫成 (t − a)，後面跟著 u(t − a)」→ 乘 e<sup>−as</sup>。'),
        st('Step 2　e<sup>5t</sup> sinh 2t。', 'ℒ(sinh 2t) = 2/(s² − 4) ⇒ s → s − 5 ⇒ 2/((s − 5)² − 4)', '第一位移：只換 s，其他不動。'),
        st('Step 3　4(t − 5)<sup>5</sup> u(t − 5)。', 'ℒ(t<sup>5</sup>) = 5!/s<sup>6</sup> = 120/s<sup>6</sup> ⇒ 乘 e<sup>−5s</sup> ⇒ 4 · 120e<sup>−5s</sup>/s<sup>6</sup> = 480e<sup>−5s</sup>/s<sup>6</sup>', '第二位移：f(t − a)u(t − a) → e<sup>−as</sup>F(s)。先把 (t − 5) 當成 t 轉，再乘 e<sup>−5s</sup>。'),
        st('Step 4　2e<sup>−3t</sup> t<sup>4</sup>。', 'ℒ(t<sup>4</sup>) = 24/s<sup>5</sup> ⇒ s → s + 3 ⇒ 2 · 24/(s + 3)<sup>5</sup> = 48/(s + 3)<sup>5</sup>', 'e<sup>−3t</sup> 的 a = −3，所以 s − a = s + 3。正負號最容易錯。'),
        st('Step 5　½ cosh 3(t − 3) u(t − 3)。', 'ℒ(cosh 3t) = s/(s² − 9) ⇒ 乘 e<sup>−3s</sup> ⇒ ½ · s e<sup>−3s</sup>/(s² − 9)', '括號裡是 3(t − 3)，函數的 t 全部被換成 (t − 3)，跟 u(t − 3) 對得上，可以直接用第二位移。'),
        st('Step 6　加起來。', '2/((s − 5)² − 4) + 480e<sup>−5s</sup>/s<sup>6</sup> + 48/(s + 3)<sup>5</sup> + s e<sup>−3s</sup>/(2(s² − 9))', '')
      ],
      ans: '2/((s − 5)² − 4) + 480e<sup>−5s</sup>/s<sup>6</sup> + 48/(s + 3)<sup>5</sup> + s e<sup>−3s</sup>/(2(s² − 9))',
      note: '第二位移有個陷阱：u(t − a) 前面的函數一定要是「f(t − a)」的樣子。這題兩項都已經寫好了，所以直接套。' },

    /* ═════ 二、ℒ⁻¹ ═════ */
    { id: 'emm-b12', sec: 't2', kind: 'ex', tag: '基本題 一-2（10%）', title: '反轉換：認形狀、配方',
      q: 'ℒ<sup>−1</sup>( 1/4 + 2/(s + 4)<sup>3</sup> + (s + 1)/(s² + 4s + 6) + (s − 2)/(s² + 2s − 4) )',
      steps: [
        st('Step 1　1/4：常數的反轉換是 δ 函數。', 'ℒ(δ(t)) = 1 ⇒ ℒ<sup>−1</sup>(1/4) = ¼ δ(t)', '小抄 (4)-2。如果題目其實是 1/s（手寫看不清），答案就是 u(t)＝1。'),
        st('Step 2　2/(s + 4)<sup>3</sup>：長得像 n!/s<sup>n+1</sup> 被平移。', '2/s<sup>3</sup> = 2!/s<sup>3</sup> ⇒ t² ；s 被換成 s + 4 ⇒ 乘 e<sup>−4t</sup> ⇒ t² e<sup>−4t</sup>', '分母次方 3 → t 的次方是 2，分子剛好要 2! = 2。'),
        st('Step 3　(s + 1)/(s² + 4s + 6)：分母不能因式分解 → 配方。', 's² + 4s + 6 = (s + 2)² + 2', '配方：s 係數 4 的一半是 2，(s + 2)² = s² + 4s + 4，還差 2。'),
        st('　分子湊成 (s + 2)。', 's + 1 = (s + 2) − 1 ⇒ (s + 2)/((s + 2)² + 2) − 1/((s + 2)² + 2)', '分子要湊成跟分母括號一樣的 (s + 2)，多出來的常數另外放。'),
        st('　查表（ω = √2），再乘 e<sup>−2t</sup>。', 'e<sup>−2t</sup>( cos √2 t − (1/√2) sin √2 t )', '(s+2)/((s+2)²+ω²) → e<sup>−2t</sup>cos ωt；1/((s+2)²+ω²) = (1/ω)·ω/(…) → (1/ω)e<sup>−2t</sup>sin ωt。'),
        st('Step 4　(s − 2)/(s² + 2s − 4)：配方。', 's² + 2s − 4 = (s + 1)² − 5', '這次是「減」→ 最後會是 cosh、sinh。'),
        st('　分子湊 (s + 1)。', 's − 2 = (s + 1) − 3 ⇒ e<sup>−t</sup>( cosh √5 t − (3/√5) sinh √5 t )', '(s+1)/((s+1)²−a²) → e<sup>−t</sup>cosh at；1/((s+1)²−a²) → (1/a)e<sup>−t</sup>sinh at，a = √5。'),
        st('Step 5　加起來。', '¼δ(t) + t²e<sup>−4t</sup> + e<sup>−2t</sup>(cos √2t − (1/√2) sin √2t) + e<sup>−t</sup>(cosh √5t − (3/√5) sinh √5t)', '')
      ],
      ans: '¼δ(t) + t²e<sup>−4t</sup> + e<sup>−2t</sup>(cos √2t − (√2/2) sin √2t) + e<sup>−t</sup>(cosh √5t − (3/√5) sinh √5t)',
      note: '第一項「1/4」請對照考卷：如果是 1/s，答案換成 u(t)。其餘三項已用 sympy 驗算。' },

    { id: 'emm-a12', sec: 't2', kind: 'ex', tag: '進階題 一-2（7.5%）', title: '反轉換＋e<sup>−as</sup>：算完再往右挪',
      q: 'ℒ<sup>−1</sup>( e<sup>−3s</sup>(2s + 1)/(s² − 2) + (2s + 1)/(s² + 4s + 8) + e<sup>−2s</sup>/s<sup>7</sup> + (s + 1)/(s² − 2s − 4) )',
      steps: [
        st('Step 1　處理 e<sup>−as</sup> 的固定做法：先蓋住 e<sup>−as</sup> 算 f(t)，最後把 t 換成 t − a、乘 u(t − a)。', 'e<sup>−as</sup>F(s) → f(t − a)u(t − a)', '小抄「2nd 位移」反過來用。'),
        st('Step 2　(2s + 1)/(s² − 2)（先不管 e<sup>−3s</sup>）。', '2·s/(s² − 2) + 1/(s² − 2) ⇒ 2cosh √2t + (1/√2) sinh √2t', 's² − a² 型，a = √2。'),
        st('　補上 e<sup>−3s</sup>：t → t − 3，乘 u(t − 3)。', '[2cosh √2(t − 3) + (1/√2) sinh √2(t − 3)] u(t − 3)', ''),
        st('Step 3　(2s + 1)/(s² + 4s + 8)：配方。', 's² + 4s + 8 = (s + 2)² + 4；2s + 1 = 2(s + 2) − 3', '考卷上手寫的「(s + 1)² + 4」是錯的，要 (s + 2)²。'),
        st('　查表（ω = 2），乘 e<sup>−2t</sup>。', 'e<sup>−2t</sup>( 2cos 2t − (3/2) sin 2t )', '−3/((s+2)²+4) = −(3/2)·2/(…) → −(3/2)e<sup>−2t</sup>sin 2t。'),
        st('Step 4　e<sup>−2s</sup>/s<sup>7</sup>。', '1/s<sup>7</sup> = (1/6!)·6!/s<sup>7</sup> ⇒ t<sup>6</sup>/720 ⇒ (t − 2)<sup>6</sup>/720 · u(t − 2)', '分母 s<sup>7</sup> → t<sup>6</sup>，要除以 6! = 720。'),
        st('Step 5　(s + 1)/(s² − 2s − 4)：配方。', 's² − 2s − 4 = (s − 1)² − 5；s + 1 = (s − 1) + 2', '考卷上手寫「(s − 1)² − 3」是錯的，1 + 4 = 5。'),
        st('　查表（a = √5），乘 e<sup>t</sup>。', 'e<sup>t</sup>( cosh √5t + (2/√5) sinh √5t )', '(s − 1) 對應 e<sup>+t</sup>。'),
        st('Step 6　加起來。', '[2cosh √2(t−3) + (1/√2)sinh √2(t−3)]u(t−3) + e<sup>−2t</sup>(2cos 2t − 1.5 sin 2t) + (t−2)<sup>6</sup>u(t−2)/720 + e<sup>t</sup>(cosh √5t + (2/√5)sinh √5t)', '')
      ],
      ans: '[2cosh √2(t−3) + (√2/2) sinh √2(t−3)] u(t−3) + e<sup>−2t</sup>(2cos 2t − (3/2) sin 2t) + (t−2)<sup>6</sup>u(t−2)/720 + e<sup>t</sup>(cosh √5t + (2/√5) sinh √5t)' },

    /* ═════ 三、解 ODE ═════ */
    { id: 'emm-b21', sec: 't3', kind: 'ex', tag: '基本題 二-1（7.5%）', title: '二階、相異實根',
      q: '用 Laplace Transform 解 y″ + 5y′ + 4y = 0，y(0) = 1，y′(0) = 3。',
      steps: [
        st('Step 1　兩邊取 ℒ，套微分公式。', '[s²Y − s·y(0) − y′(0)] + 5[sY − y(0)] + 4Y = 0', 'ℒ(y′) = sY − y(0)，ℒ(y″) = s²Y − sy(0) − y′(0)。'),
        st('Step 2　代初值。', 's²Y − s − 3 + 5sY − 5 + 4Y = 0', 'y(0) = 1、y′(0) = 3。'),
        st('Step 3　Y 集合起來。', '(s² + 5s + 4)Y = s + 8 ⇒ Y = (s + 8)/((s + 1)(s + 4))', '分母就是特徵方程式；能分解就分解。'),
        st('Step 4　部分分式。', '(s + 8)/((s + 1)(s + 4)) = A/(s + 1) + B/(s + 4)；A = (−1 + 8)/(−1 + 4) = 7/3，B = (−4 + 8)/(−4 + 1) = −4/3', '遮蓋法：求 A 就把 (s + 1) 蓋住，s 代 −1。'),
        st('Step 5　反轉換。', 'y(t) = (7/3)e<sup>−t</sup> − (4/3)e<sup>−4t</sup>', '1/(s − a) → e<sup>at</sup>。'),
        st('驗算。', 'y(0) = 7/3 − 4/3 = 1 ✓；y′(0) = −7/3 + 16/3 = 3 ✓', '考試時花 10 秒驗初值，錯了馬上知道。')
      ],
      ans: 'y(t) = (7/3)e<sup>−t</sup> − (4/3)e<sup>−4t</sup>' },

    { id: 'emm-b22', sec: 't3', kind: 'ex', tag: '基本題 二-2（7.5%）', title: '二階、重根',
      q: '用 Laplace Transform 解 2y″ + 4y′ + 2y = 0，y(0) = 1，y′(0) = 2。',
      steps: [
        st('Step 1　先整個除以 2。', 'y″ + 2y′ + y = 0', '最高次係數變 1，後面比較好算。'),
        st('Step 2　取 ℒ、代初值。', '[s²Y − s − 2] + 2[sY − 1] + Y = 0', ''),
        st('Step 3　解 Y。', '(s² + 2s + 1)Y = s + 4 ⇒ Y = (s + 4)/(s + 1)²', '分母是完全平方 → 重根。'),
        st('Step 4　分子湊 (s + 1)。', '(s + 4)/(s + 1)² = 1/(s + 1) + 3/(s + 1)²', 's + 4 = (s + 1) + 3。'),
        st('Step 5　反轉換。', 'y(t) = e<sup>−t</sup> + 3t e<sup>−t</sup> = (1 + 3t)e<sup>−t</sup>', '1/(s + 1)² → t e<sup>−t</sup>（1/s² → t，再第一位移）。'),
        st('驗算。', 'y(0) = 1 ✓；y′ = 3e<sup>−t</sup> − (1 + 3t)e<sup>−t</sup> ⇒ y′(0) = 2 ✓', '')
      ],
      ans: 'y(t) = (1 + 3t)e<sup>−t</sup>' },

    { id: 'emm-a21', sec: 't3', kind: 'ex', tag: '進階題 二-1（7.5%）', title: '一階＋右邊有 e<sup>2t</sup>',
      q: '用 Laplace Transform 解 y′ + 4y = e<sup>2t</sup>，y(0) = 1。',
      steps: [
        st('Step 1　兩邊取 ℒ。', '[sY − 1] + 4Y = 1/(s − 2)', '右邊不是 0 了，e<sup>2t</sup> 也要轉：1/(s − 2)。'),
        st('Step 2　解 Y。', '(s + 4)Y = 1 + 1/(s − 2) ⇒ Y = 1/(s + 4) + 1/((s − 2)(s + 4))', ''),
        st('Step 3　部分分式（第二項）。', '1/((s − 2)(s + 4)) = (1/6)/(s − 2) − (1/6)/(s + 4)', '遮蓋法：s = 2 → 1/6；s = −4 → 1/(−6)。'),
        st('Step 4　合併、反轉換。', 'Y = (1/6)/(s − 2) + (5/6)/(s + 4) ⇒ y = (1/6)e<sup>2t</sup> + (5/6)e<sup>−4t</sup>', '1 − 1/6 = 5/6。'),
        st('驗算。', 'y(0) = 1/6 + 5/6 = 1 ✓', '')
      ],
      ans: 'y(t) = (1/6)e<sup>2t</sup> + (5/6)e<sup>−4t</sup>',
      note: '考卷上劃掉的 y′(0) = 1 不用管：一階方程式只要一個初值。' },

    { id: 'emm-a22', sec: 't3', kind: 'ex', tag: '進階題 二-2（7.5%）', title: '二階、複數根（配方）',
      q: '用 Laplace Transform 解 y″ + 6y′ + 12y = 0，y(0) = 1，y′(0) = 1。',
      steps: [
        st('Step 1　取 ℒ、代初值。', '[s²Y − s − 1] + 6[sY − 1] + 12Y = 0', ''),
        st('Step 2　解 Y。', '(s² + 6s + 12)Y = s + 7 ⇒ Y = (s + 7)/(s² + 6s + 12)', ''),
        st('Step 3　分母不能分解 → 配方。', 's² + 6s + 12 = (s + 3)² + 3', '判別式 36 − 48 &lt; 0，複數根。'),
        st('Step 4　分子湊 (s + 3)。', 's + 7 = (s + 3) + 4 ⇒ Y = (s + 3)/((s + 3)² + 3) + 4/((s + 3)² + 3)', ''),
        st('Step 5　反轉換（ω = √3）。', 'y = e<sup>−3t</sup>( cos √3t + (4/√3) sin √3t )', '4/((s+3)²+3) = (4/√3)·√3/(…) → (4/√3)e<sup>−3t</sup>sin √3t。'),
        st('驗算。', 'y(0) = 1 ✓；y′(0) = −3 + 4 = 1 ✓', '')
      ],
      ans: 'y(t) = e<sup>−3t</sup>( cos √3t + (4/√3) sin √3t )' },

    /* ═════ 四、RLC 電路 ═════ */
    { id: 'emm-b31', sec: 't4', kind: 'ex', tag: '基本題 三-1（7.5%）', title: 'RL 放電（沒有電源）', fig: figs.b31, cap: '考卷圖重畫：i(t) 跟 i₀ 同方向（順時針）',
      q: '6 H 電感和 4 Ω 電阻接成一圈，電感初始電流 i₀ = 2 A，用 Laplace Transform 求 i(t)。',
      steps: [
        st('Step 1　每個元件換成 s 域。', '電感 → sL = 6s，再串一個 Li₀ = 12 的電壓源；電阻 → 4', '小抄 (7)-2：V(s) = sL·I(s) − L i₀。'),
        st('Step 2　KVL 繞一圈。', '6(sI − 2) + 4I = 0', '電感壓降 L(sI − i₀)，電阻壓降 4I，沒有電源所以 = 0。'),
        st('Step 3　解 I。', '(6s + 4)I = 12 ⇒ I = 12/(6s + 4) = 2/(s + 2/3)', '分子分母同除 6。'),
        st('Step 4　反轉換。', 'i(t) = 2e<sup>−2t/3</sup> A', '1/(s + a) → e<sup>−at</sup>。'),
        st('驗算。', 'i(0) = 2 = i₀ ✓；時間常數 L/R = 6/4 = 1.5 s，2/3 = 1/1.5 ✓', '')
      ],
      ans: 'i(t) = 2e<sup>−2t/3</sup> A',
      note: '方向照考卷 i₀ 的箭頭（順時針）。如果你把 i(t) 畫成反方向，答案差一個負號。' },

    { id: 'emm-b32', sec: 't4', kind: 'ex', tag: '基本題 三-2（7.5%）', title: 'RC 充電（電容有初電壓）', fig: figs.b32, cap: '考卷圖重畫',
      q: '10 V 電源、5 Ω、6 F 電容串聯，電容初電壓 v₀ = 4 V（上 +），用 Laplace Transform 求 i(t)。',
      steps: [
        st('Step 1　換成 s 域。', '10 V → 10/s；電容 → 1/(6s) 再串一個 v₀/s = 4/s', '小抄 (7)-3、(7)-4：直流電源 V → V/s。'),
        st('Step 2　KVL（順時針）。', '10/s = 5I + I/(6s) + 4/s', '電源升壓 = 電阻壓降 + 電容壓降（含初電壓）。'),
        st('Step 3　解 I。', 'I(5 + 1/(6s)) = 6/s ⇒ I = 6/(5s + 1/6) = (6/5)/(s + 1/30)', '左右乘 s 再整理。'),
        st('Step 4　反轉換。', 'i(t) = (6/5)e<sup>−t/30</sup> = 1.2e<sup>−t/30</sup> A', ''),
        st('驗算。', 'i(0) = (10 − 4)/5 = 1.2 ✓；τ = RC = 5 × 6 = 30 ✓', '一開始電容像一顆 4 V 電池，電阻扛 6 V。')
      ],
      ans: 'i(t) = 1.2e<sup>−t/30</sup> A' },

    { id: 'emm-a31', sec: 't4', kind: 'ex', tag: '進階題 三-1（7.5%）', title: 'RLC 串聯（電感、電容都有初值）', fig: figs.a31, cap: '考卷圖重畫：v₀ 右 +、左 −',
      q: '5 V 電源、12 Ω、2 H、1/20 F 串聯，i₀ = 3 A（順時針），v₀ = 3 V，用 Laplace Transform 求 i(t)。',
      steps: [
        st('Step 1　換成 s 域。', '5 V → 5/s；2 H → 2s，串 Li₀ = 6；1/20 F → 20/s，串 v₀/s = 3/s', ''),
        st('Step 2　確認電容初電壓的方向。', '順時針走，電流在下面那條線是由右往左，經過電容是從 + 到 −', '所以 3/s 是「壓降」，放在等號右邊。'),
        st('Step 3　KVL。', '5/s = 12I + 2(sI − 3) + 20I/s + 3/s', ''),
        st('Step 4　整理。', 'I(2s + 12 + 20/s) = 2/s + 6 ⇒ I = (6s + 2)/(2s² + 12s + 20) = (3s + 1)/(s² + 6s + 10)', '兩邊乘 s，再約掉 2。'),
        st('Step 5　配方、湊分子。', 's² + 6s + 10 = (s + 3)² + 1；3s + 1 = 3(s + 3) − 8', ''),
        st('Step 6　反轉換（ω = 1）。', 'i(t) = e<sup>−3t</sup>( 3cos t − 8 sin t ) A', ''),
        st('驗算。', 'i(0) = 3 = i₀ ✓', '另外用微分方程 2i″ + 12i′ + 20i = 0、i′(0) = −17 驗過，一樣。')
      ],
      ans: 'i(t) = e<sup>−3t</sup>(3cos t − 8 sin t) A',
      note: '電容方向請對照考卷：如果 v₀ 是左 +、右 −，3/s 要移到左邊，答案會變。' },

    /* ═════ 五、摺積 ═════ */
    { id: 'emm-b41', sec: 't5', kind: 'ex', tag: '基本題 四-1（7.5%）', title: '無限長 × 方塊', fig: figs.c1,
      q: 'f(t) = 3（t ≥ 0），g(t) = 2（0 ≤ t ≤ 4），求 f ∗ g(t)。',
      steps: [
        st('Step 1　公式。', 'f ∗ g(t) = ∫₀<sup>t</sup> f(τ) g(t − τ) dτ', '把 g 翻過來，從左邊滑過去，算重疊面積。'),
        st('Step 2　g(t − τ) 長什麼樣。', 'g(t − τ) = 2，在 τ ∈ [t − 4, t]', '翻轉後右端在 τ = t，寬度 4。'),
        st('Step 3　0 ≤ t ≤ 4：方塊只有一部分進來。', '∫₀<sup>t</sup> 3 · 2 dτ = 6t', '重疊寬度 t。'),
        st('Step 4　t ≥ 4：方塊整個在 f 上面。', '∫<sub>t−4</sub><sup>t</sup> 6 dτ = 24', '重疊寬度固定 4。'),
        st('Step 5　寫成分段。', 'f ∗ g = 6t（0 ≤ t ≤ 4）；24（t ≥ 4）', '畫出來：斜坡上去，然後平的。跟小抄例 2 一樣。')
      ],
      ans: 'f ∗ g(t) = 6t（0 ≤ t ≤ 4）、24（t &gt; 4）' },

    { id: 'emm-b42', sec: 't5', kind: 'ex', tag: '基本題 四-2（7.5%）', title: '方塊 × 無限長', fig: figs.c2,
      q: 'f(t) = 1（0 ≤ t ≤ 5），g(t) = 3（t ≥ 0），求 f ∗ g(t)。',
      steps: [
        st('Step 1　摺積可以交換。', 'f ∗ g = g ∗ f', '翻哪個都可以，翻方塊比較直觀。'),
        st('Step 2　0 ≤ t ≤ 5。', '∫₀<sup>t</sup> 1 · 3 dτ = 3t', ''),
        st('Step 3　t ≥ 5：f 的方塊整個都在重疊區。', '∫₀<sup>5</sup> 3 dτ = 15', ''),
        st('Step 4　分段。', 'f ∗ g = 3t（0 ≤ t ≤ 5）；15（t ≥ 5）', '高度 = 1 × 3 × 寬度 5。')
      ],
      ans: 'f ∗ g(t) = 3t（0 ≤ t ≤ 5）、15（t &gt; 5）' },

    { id: 'emm-a32', sec: 't5', kind: 'ex', tag: '進階題 三-2（15% 的一半）', title: '兩個方塊：梯形', fig: figs.c3,
      q: 'f(t) = 2（0 ≤ t ≤ 10），g(t) = 3（0 ≤ t ≤ 7），求 f ∗ g(t)。',
      steps: [
        st('Step 1　兩個都是方塊 → 答案一定是梯形（或三角形）。', '高度 = 2 × 3 × 短邊 7 = 42；上升到 t = 7、平到 t = 10、降到 t = 17', '轉折點：短邊 7、長邊 10、兩個相加 17。'),
        st('Step 2　0 ≤ t ≤ 7：還在進場。', '∫₀<sup>t</sup> 6 dτ = 6t', ''),
        st('Step 3　7 ≤ t ≤ 10：g 整個在 f 上面。', '∫<sub>t−7</sub><sup>t</sup> 6 dτ = 42', ''),
        st('Step 4　10 ≤ t ≤ 17：開始離場。', '∫<sub>t−7</sub><sup>10</sup> 6 dτ = 6(17 − t) = 102 − 6t', '重疊區右端卡在 f 的終點 10。'),
        st('Step 5　t ≥ 17：沒有重疊。', '0', ''),
        st('Step 6　分段寫答案。', '6t（0–7）；42（7–10）；102 − 6t（10–17）；0（t &gt; 17）', '小抄例 4 的同型：那題 18、48 − 6t。')
      ],
      ans: 'f ∗ g = 6t（0 ≤ t ≤ 7）、42（7 ≤ t ≤ 10）、102 − 6t（10 ≤ t ≤ 17）、0（t &gt; 17）' }
  ];
  window.__EMMID = { name: 'em-mid', items };
})();
