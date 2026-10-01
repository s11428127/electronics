/* ============================================================
   工程數學 常係數 ODE 與特徵方程 —— 故事模式
   主線謎題：y″ + 3y′ + 2y = 0 要找一個函數，微分兩次再加起來剛好互相抵消。誰辦得到？
   答案：e^(λt) 微分後還是自己（只多乘 λ），整條方程變成二次方程 λ² + 3λ + 2 = 0。
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

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '誰微分兩次會抵消', en: 'THE QUESTION',
    svg: T(320, 108, 'y″ + 3y′ + 2y = 0', { cls: 't', fs: 26, k: 'eq' }) +
      T(320, 150, 'y(0) = 1，y′(0) = 1', { cls: 'tm', fs: 16, k: 'ic' }) +
      g('try', T(160, 206, 'y = t² ?', { cls: 't', fs: 16 }) + T(160, 232, '2 + 6t + 2t² ≠ 0 ✗', { cls: 'ts', fs: 13 }) +
        T(320, 206, 'y = sin t ?', { cls: 't', fs: 16 }) + T(320, 232, 'sin t + 3cos t ≠ 0 ✗', { cls: 'ts', fs: 13 }) +
        T(480, 206, 'y = e^(λt) ?', { cls: 'ta', fs: 16 }) + T(480, 232, '……試試看', { cls: 'ta', fs: 13 })) +
      chip(320, 296, '要找一個函數：微分兩次、加起來剛好抵消成 0', '這題就是你作業 Exercise 1', 'c', { fs: 13 }) +
      T(320, 250, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '一條二階微分方程：<b>y″ + 3y′ + 2y = 0</b>，加上兩個初始條件。', on: 'eq ic' },
      { sub: '它在問：哪個函數<b>微分兩次、再加起來</b>，會剛好抵消成 0？', on: 'c' },
      { sub: '多項式、三角函數……一試就失敗：微分後長相變了，消不掉。', off: 'c', on: 'try' },
      { sub: '得找一個<b>微分之後還長得跟自己一樣</b>的函數。誰？', op: { eq: 0.15, ic: 0.15, try: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 e^(λt)：微分後還是自己 ════════════ */
  const S1 = {
    t: '微分後還是自己的函數', en: 'WHY GUESS y = e^(λt)',
    svg: T(320, 110, 'y = e^(λt)', { cls: 'ta', fs: 24, k: 'y' }) +
      T(320, 158, 'y′ = λ · e^(λt) = λ · y', { cls: 't', fs: 19, k: 'y1' }) +
      T(320, 200, 'y″ = λ² · e^(λt) = λ² · y', { cls: 't', fs: 19, k: 'y2' }) +
      chip(320, 268, '像一台影印機：每微分一次，只多乘一個 λ', '形狀不變，所以三項可以合併、才有機會抵消', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '答案是指數函數 <b>e<sup>λt</sup></b>。', on: 'y' },
      { sub: '微分一次：還是 e<sup>λt</sup>，只是前面多一個 λ。', on: 'y1' },
      { sub: '再微分一次：多一個 λ²。', on: 'y2' },
      { sub: '它像一台<b>影印機</b>：怎麼微分都還是自己。三項長得一樣，才有機會加起來抵消。', on: 'c' }
    ]
  };

  /* ════════════ 02 特徵方程 ════════════ */
  const S2 = {
    t: '微分方程變成二次方程', en: 'CHARACTERISTIC EQUATION',
    svg: T(320, 108, 'λ²e^(λt) + 3λe^(λt) + 2e^(λt) = 0', { cls: 't', fs: 18, k: 'a' }) +
      T(320, 152, '( λ² + 3λ + 2 ) · e^(λt) = 0', { cls: 't', fs: 19, k: 'b' }) +
      T(320, 196, 'e^(λt) 永遠不是 0　⟹　λ² + 3λ + 2 = 0', { cls: 'ta', fs: 18, k: 'c' }) +
      T(320, 240, '( λ + 1 )( λ + 2 ) = 0　⟹　λ = −1、−2', { cls: 'ta', fs: 18, k: 'd' }) +
      chip(320, 300, '照抄係數：y″ → λ²、y′ → λ、y → 1', '這條叫特徵方程 characteristic equation', 'e', { fs: 13 }),
    steps: [
      { sub: '把 y = e<sup>λt</sup> 代進 y″ + 3y′ + 2y = 0。', on: 'a' },
      { sub: '三項都有 e<sup>λt</sup>，提出來。', on: 'b' },
      { sub: 'e<sup>λt</sup> 永遠不會是 0，所以括號裡必須是 0 —— <b>微分方程變成了二次方程</b>。', on: 'c' },
      { sub: '因式分解：<b>λ = −1、−2</b>。兩個根，兩個解：e<sup>−t</sup> 和 e<sup>−2t</sup>。', on: 'd' },
      { sub: '以後不用每次代：直接<b>照抄係數</b>寫出特徵方程就好。', on: 'e' }
    ]
  };

  /* ════════════ 03 初始條件 ════════════ */
  const X3 = t => 330 + t * 62, Y3 = v => 290 - v * 120;
  const S3 = {
    t: '用初始條件定出 C₁、C₂', en: 'INITIAL CONDITIONS',
    svg: T(170, 104, 'y = C₁e^(−t) + C₂e^(−2t)', { cls: 't', fs: 16, k: 'gen' }) +
      T(170, 146, 'y(0) = C₁ + C₂ = 1', { cls: 't', fs: 15, k: 'e1' }) +
      T(170, 176, 'y′(0) = −C₁ − 2C₂ = 1', { cls: 't', fs: 15, k: 'e2' }) +
      T(170, 214, '相加：−C₂ = 2　⟹　C₂ = −2', { cls: 'ta', fs: 14, k: 'e3' }) +
      T(170, 240, 'C₁ = 1 − (−2) = 3', { cls: 'ta', fs: 14, k: 'e4' }) +
      T(170, 284, 'y(t) = 3e^(−t) − 2e^(−2t)', { cls: 'ta', fs: 18, k: 'ans' }) +
      g('ax', '<path class="ln" d="M326 290 H600 M330 294 V110"/>' + T(604, 290, 't', { cls: 'tm', fs: 13, a: 'start', dy: '.35em' })) +
      path(P(x => Y3(3 * Math.exp(-(x - 330) / 62) - 2 * Math.exp(-2 * (x - 330) / 62)), 330, 600, 120), 'lna', 'cv', 'stroke-width:3') +
      chip(470, 120, 'y(0) = 1、一開始往上（斜率 +1）', '然後衰減回 0', 'cc', { fs: 12.5 }),
    steps: [
      { sub: '兩個解疊起來就是<b>通解</b>：y = C<sub>1</sub>e<sup>−t</sup> + C<sub>2</sub>e<sup>−2t</sup>。', on: 'gen' },
      { sub: '代兩個初始條件，得到兩條聯立式。', on: 'e1 e2' },
      { sub: '兩式相加消去 C<sub>1</sub>：<b>C<sub>2</sub> = −2</b>，再代回去 <b>C<sub>1</sub> = 3</b>。（你作業這一步算錯了，見下面勘誤。）', on: 'e3 e4' },
      { sub: '答案 <b>y = 3e<sup>−t</sup> − 2e<sup>−2t</sup></b>：從 1 出發、先往上一點，再衰減回 0。', on: 'ans ax cv cc' }
    ]
  };

  /* ════════════ 04 根的位置 ↔ 形狀 ════════════ */
  const O4 = [170, 210];
  const S4 = {
    t: '根的位置決定解的長相', en: 'ROOT LOCATION ↔ SOLUTION SHAPE',
    svg: g('pl', arrow(50, 210, 300, 210, null, 'ln') + arrow(170, 320, 170, 96, null, 'ln') + T(304, 210, 'Re', { cls: 'tm', fs: 13, a: 'start', dy: '.35em' }) + T(178, 102, 'Im', { cls: 'tm', fs: 13, a: 'start' }) +
        '<rect x="50" y="96" width="120" height="224" class="acc" opacity=".08"/>' + T(110, 312, '穩定（衰減）', { cls: 'ta', fs: 12 })) +
      g('r1', '<circle class="acc" cx="' + (O4[0] - 60) + '" cy="210" r="7"/>' + T(O4[0] - 60, 232, 'λ &lt; 0', { cls: 'ta', fs: 12 })) +
      g('r2', '<circle class="ink" cx="' + (O4[0] + 60) + '" cy="210" r="7"/>' + T(O4[0] + 60, 232, 'λ &gt; 0', { cls: 't', fs: 12 })) +
      g('r3', '<circle class="acc" cx="' + (O4[0] - 50) + '" cy="150" r="7"/><circle class="acc" cx="' + (O4[0] - 50) + '" cy="270" r="7"/>' + T(O4[0] - 40, 140, 'a ± bi', { cls: 'ta', fs: 12, a: 'start' })) +
      g('s1', path(P(x => 150 - 50 * Math.exp(-(x - 360) / 40), 360, 600, 80), 'lna', null, 'stroke-width:2.6') + T(600, 174, '實部負 → 衰減', { cls: 'ta', fs: 12.5, a: 'end' })) +
      g('s2', path(P(x => 210 - 6 * Math.exp((x - 360) / 60), 360, 520, 80), 'ln', null, 'stroke-width:2.6') + T(600, 210, '實部正 → 爆掉', { cls: 't', fs: 12.5, a: 'end' })) +
      g('s3', path(P(x => 280 - 40 * Math.exp(-(x - 360) / 90) * Math.cos((x - 360) / 14), 360, 600, 200), 'lna', null, 'stroke-width:2.6') + T(600, 322, '虛部 → 振盪', { cls: 'ta', fs: 12.5, a: 'end' })),
    steps: [
      { sub: '把特徵根畫在<b>複平面</b>上：左右是實部、上下是虛部。', on: 'pl' },
      { sub: '根在左邊（實部 &lt; 0）：e<sup>λt</sup> <b>衰減</b>到 0。', on: 'r1 s1' },
      { sub: '根在右邊（實部 &gt; 0）：<b>越長越大</b>，系統不穩定。', on: 'r2 s2' },
      { sub: '根有虛部（成對出現 a ± bi）：<b>邊衰減邊振盪</b>。實部管衰減、虛部管振盪。', on: 'r3 s3' }
    ]
  };

  /* ════════════ 05 三種根 ════════════ */
  const card = (x, key, title, eq, root, sol, fn) => g(key, '<rect class="card" x="' + x + '" y="92" width="184" height="226" rx="14" filter="url(#st-sh)"/>' +
    T(x + 92, 116, title, { cls: 't', fs: 15 }) + T(x + 92, 142, eq, { cls: 'tm', fs: 12.5 }) + T(x + 92, 164, root, { cls: 'ta', fs: 13 }) +
    T(x + 92, 188, sol, { cls: 't', fs: 12 }) +
    '<path class="ln2" d="M' + (x + 16) + ' 280 H' + (x + 168) + '"/>' + path(P(fn, x + 16, x + 168, 80), 'lna', null, 'stroke-width:2.4'));
  const S5 = {
    t: '三種根，三種形狀', en: 'DISTINCT · DOUBLE · COMPLEX ROOTS',
    svg: card(24, 'A', '相異實根', 'λ² + 4λ + 3 = 0', 'λ = −1、−3', 'C₁e^(−t) + C₂e^(−3t)', x => 280 - 70 * (2 * Math.exp(-(x - 40) / 30) - Math.exp(-3 * (x - 40) / 30))) +
      card(228, 'B', '重根', 'λ² + 4λ + 4 = 0', 'λ = −2（兩次）', '(C₁ + C₂t) e^(−2t)', x => 280 - 70 * (1 + 3 * (x - 244) / 30) * Math.exp(-2 * (x - 244) / 30) * 0.8) +
      card(432, 'C', '共軛複根', 'λ² + 4λ + 5 = 0', 'λ = −2 ± i', 'e^(−2t)(A cos t + B sin t)', x => 280 - 70 * Math.exp(-(x - 448) / 60) * Math.cos((x - 448) / 9)),
    steps: [
      { sub: '你作業 Exercise 2 的三小題，剛好是三種情況。<b>相異實根</b>：兩個指數疊加，單純衰減。', on: 'A' },
      { sub: '<b>重根</b>：只有一個 λ，要多乘一個 <b>t</b> 才湊得到兩個解。', on: 'B' },
      { sub: '<b>共軛複根</b>：λ = −2 ± i，衰減乘上 cos、sin —— 邊衰減邊振盪。三小題你都做對了。', on: 'C' }
    ]
  };

  /* ════════════ 06 重根為什麼乘 t ════════════ */
  const S6 = {
    t: '重根為什麼要多一個 t', en: 'REPEATED ROOT',
    svg: T(320, 106, 'λ² + 4λ + 4 = (λ + 2)² = 0', { cls: 't', fs: 18, k: 'a' }) +
      T(320, 148, '只有一個根 λ = −2　⟹　只有一個解 e^(−2t)', { cls: 't', fs: 16, k: 'b' }) +
      chip(320, 196, '二階方程需要兩個「獨立」的解', 'C·e^(−2t) 跟 e^(−2t) 只差一個倍數，不算新的', 'c', { fs: 13 }) +
      T(320, 248, '試 y = t · e^(−2t)：代回去剛好 = 0 ✓', { cls: 'ta', fs: 17, k: 'd' }) +
      T(320, 290, 'y = ( C₁ + C₂ t ) · e^(−2t)', { cls: 'ta', fs: 20, k: 'e' }),
    steps: [
      { sub: '重根：特徵方程只給你<b>一個</b> λ = −2。', on: 'a b' },
      { sub: '但二階方程要<b>兩個獨立</b>的解。再寫一次 e<sup>−2t</sup> 不算數，它只是倍數。', on: 'c' },
      { sub: '乘一個 t 試試：<b>t·e<sup>−2t</sup></b> 代回去剛好也是 0 —— 它就是第二個解。', on: 'd' },
      { sub: '通解：<b>y = (C<sub>1</sub> + C<sub>2</sub>t)e<sup>−2t</sup></b>。這就是「重根要乘 t」的來歷。', on: 'e' }
    ]
  };

  /* ════════════ 07 複數根 → cos、sin ════════════ */
  const C7 = [170, 210], R7 = 80, a7 = 50 * Math.PI / 180;
  const S7 = {
    t: '複數根怎麼變成 cos、sin', en: 'EULER’S FORMULA',
    svg: g('circ', '<circle class="ln2" cx="' + C7[0] + '" cy="' + C7[1] + '" r="' + R7 + '" style="fill:none"/>' + arrow(70, 210, 270, 210, null, 'ln') + arrow(170, 310, 170, 110, null, 'ln') +
        T(274, 210, '實部', { cls: 'tm', fs: 12, a: 'start', dy: '.35em' }) + T(178, 116, '虛部', { cls: 'tm', fs: 12, a: 'start' })) +
      g('vec', arrow(C7[0], C7[1], C7[0] + R7 * Math.cos(a7), C7[1] - R7 * Math.sin(a7), null, 'lna') +
        '<path class="ln dsh" d="M' + (C7[0] + R7 * Math.cos(a7)).toFixed(1) + ' ' + (C7[1] - R7 * Math.sin(a7)).toFixed(1) + ' V210"/>' +
        T(C7[0] + R7 * Math.cos(a7) + 8, C7[1] - R7 * Math.sin(a7) - 6, 'e^(iθ)', { cls: 'ta', fs: 14, a: 'start' }) +
        T(C7[0] + 26, 228, 'cos θ', { cls: 'tm', fs: 12 }) + T(C7[0] + R7 * Math.cos(a7) + 8, 186, 'sin θ', { cls: 'tm', fs: 12, a: 'start' })) +
      T(460, 112, 'e^(iθ) = cos θ + i sin θ', { cls: 't', fs: 17, k: 'eu' }) +
      T(460, 160, 'e^((−2 ± i)t) = e^(−2t) · e^(± it)', { cls: 't', fs: 15, k: 'sp' }) +
      T(460, 200, 'e^(±it) = cos t ± i sin t', { cls: 't', fs: 15, k: 'sp2' }) +
      T(460, 252, 'y = e^(−2t)( A cos t + B sin t )', { cls: 'ta', fs: 16, k: 'res' }) +
      chip(460, 300, 'y 是真實的物理量，不能是複數', '兩個複數解組合一下，虛數部分剛好互相抵消', 'c', { fs: 12.5 }),
    steps: [
      { sub: '複數根代表什麼？關鍵是<b>尤拉公式</b>：e<sup>iθ</sup> 是單位圓上的一個點。', on: 'circ vec eu' },
      { sub: '把 λ = −2 ± i 拆開：e<sup>−2t</sup> 管<b>衰減</b>，e<sup>±it</sup> 管<b>轉圈</b>。', on: 'sp sp2' },
      { sub: '轉圈投影到實軸上就是 cos、sin —— 所以解寫成 <b>e<sup>−2t</sup>(A cos t + B sin t)</b>。', on: 'res' },
      { sub: 'y(t) 是實際存在的量，不能是複數；把兩個複數解組合，虛數部分剛好抵消。', on: 'c' }
    ]
  };

  /* ════════════ 08 恍然大悟 ════════════ */
  const S8 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 220, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="70" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(188, 124, '誰微分兩次會抵消', { fs: 16, cls: 'ta' }) + T(188, 156, 'e^(λt)：微分後還是自己', { cls: 'tm', fs: 12.5 }) +
        T(188, 182, '方程變成 λ² + 3λ + 2 = 0', { cls: 'tm', fs: 12.5 }) + T(188, 222, 'λ = −1、−2', { cls: 'ta', fs: 15 })) +
      g('R', '<rect class="card" x="334" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(452, 124, '根決定形狀', { fs: 16 }) + T(452, 156, '實部 → 衰減或爆掉', { cls: 'tm', fs: 12.5 }) +
        T(452, 182, '虛部 → 振盪；重根 → 乘 t', { cls: 'tm', fs: 12.5 }) + T(452, 222, 'y = 3e^(−t) − 2e^(−2t)', { cls: 't', fs: 14 })) +
      chip(320, 282, '謎題解開了 ✓', '微分方程 → 二次方程，解出根，形狀就決定了', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, '跟拉普拉斯轉換是同一個精神', '把「微分」換成「乘一個數」（λ 或 s），問題就變成代數', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：誰微分兩次、加起來會抵消？', on: 'q' },
      { sub: '<b>e<sup>λt</sup></b>：它微分後還是自己，整條方程變成二次方程，λ = −1、−2。', off: 'q', on: 'L' },
      { sub: '根的位置決定解的長相：實部管衰減、虛部管振盪、重根要乘 t。', on: 'R' },
      { sub: '剩下的只是用初始條件解兩條聯立式。<b>謎題解開了。</b>', on: 'ans' },
      { sub: '跟拉普拉斯是同一個精神：把「微分」換成「乘一個數」，難題就變成代數題。', off: 'ans', on: 'next' }
    ]
  };

  window.__odeStory = window.__Story('#story', {
    id: 'math-ode', title: 'ODE 與特徵方程', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8]
  });
})();
