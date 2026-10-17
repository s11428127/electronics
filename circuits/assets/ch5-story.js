/* ============================================================
   電路學 CH5 複習 —— 故事模式（運算放大器 Operational Amplifiers）
   謎題（課本 Example 5.1）：741 運放本身增益 2 × 10⁵，接上 10 kΩ、20 kΩ 之後，
     整個電路增益 = −1.99997 ≈ −2 —— 二十萬倍去哪了？為什麼只看兩個電阻？
   答案：負回授 ＋ 理想運放兩條規則（不吃電流、v₊ = v₋）→ v_o/v_s = −R_f/R₁ = −2。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__RV) return;
  const R = window.__RV, D = R.D;
  const { g, T, calc, sc, el, bat, wire, strike, ladder, card, f1 } = R;
  const { chip, arrow } = D;

  /* 運放三角形：輸入在 (x, y∓14)，輸出 (x + 64, y)；opt.plusTop = + 在上 */
  function opamp(x, y, opt) {
    opt = opt || {};
    const top = opt.plusTop ? '+' : '−', bot = opt.plusTop ? '−' : '+';
    return g(opt.k, '<path class="bgw" style="stroke-width:2" d="M' + (x + 4) + ' ' + (y - 34) + ' L' + (x + 64) + ' ' + y + ' L' + (x + 4) + ' ' + (y + 34) + ' Z"/>' +
      '<path class="ln" d="M' + x + ' ' + (y - 14) + ' H' + (x + 4) + ' M' + x + ' ' + (y + 14) + ' H' + (x + 4) + '"/>' +
      T(x + 14, y - 9, top, { cls: 't', fs: 15 }) + T(x + 14, y + 19, bot, { cls: 't', fs: 15 }));
  }
  /* 反相放大器：輸入 v_s 經 R₁ 到 −，R_f 從輸出回授到 −，+ 接地 */
  const YG = 285;
  function inv(k, o) {
    o = o || {};
    const xs = 100, x1 = 250, xo = 290, yi = 186, yo = 200, xf = 410;
    return g(k, bat(xs, 236, o.vs || 'v<sub>s</sub>') + wire('M' + xs + ' 206 V' + yi + ' M' + xs + ' 266 V' + YG + ' H' + (xo - 10) + ' M' + (xo - 10) + ' ' + YG + ' V' + (yo + 14) + ' H' + xo) +
      el('r', xs, yi, x1, yi, o.r1 || 'R<sub>1</sub>') + wire('M' + x1 + ' ' + yi + ' H' + xo + ' M' + x1 + ' ' + yi + ' V128') +
      el('r', x1, 128, xf, 128, o.rf || 'R<sub>f</sub>') + wire('M' + xf + ' 128 V' + yo + ' M' + (xo + 64) + ' ' + yo + ' H470') +
      opamp(xo, yo) + R.dot(x1, yi) + R.dot(xf, yo) + '<circle class="bgw" cx="474" cy="' + yo + '" r="4.5"/>' + T(486, yo + 5, 'v<sub>o</sub>', { cls: 'ta', fs: 15, a: 'start' }) +
      R.gnd(xo - 10, YG + 12));
  }

  /* ═════ 00 謎題 ═════ */
  const S0 = sc('二十萬倍去哪了？', 'THE PUZZLE',
    inv('ckt', { r1: '10 kΩ', rf: '20 kΩ' }) +
    chip(540, 130, '運放本身：20 萬倍', '741，課本 Example 5.1', 'c1', { fs: 13 }) +
    chip(540, 268, '電路：−1.99997 倍', '≈ −2', 'c2', { fs: 13.5, acc: true }),
    [{ sub: '課本 Example 5.1：741 運算放大器，本身能把電壓放大 <b>二十萬倍</b>。', on: 'ckt c1' },
     { sub: '接上一個 10 kΩ、一個 20 kΩ 電阻之後，整個電路的放大倍數算出來是 −1.99997。', on: 'c2' },
     { sub: '幾乎剛好是 −20/10 = −2。二十萬倍跑去哪了？為什麼答案只跟兩個電阻有關？', on: '' }]);

  /* ═════ 01 這章要幹嘛 ═════ */
  const S1 = sc('這一章要幹嘛', 'WHY THIS CHAPTER',
    ladder(5, { k: 'lad', km: 'me', hl: [4] }) +
    chip(230, 118, 'CH1～4：只有電阻和電源', '只會消耗、不會放大', 'c1', { fs: 14 }) +
    chip(470, 118, 'CH5：第一個主動元件', '放大、相加、相減', 'c2', { fs: 14, acc: true }),
    [{ sub: '第 5 階。到目前為止，電路裡只有電阻和電源 —— 只會消耗，不會放大。', on: 'lad me lad-hl c1' },
     { sub: 'CH5 認識第一個能<b>放大</b>的元件：運算放大器（op amp）。', on: 'c2' },
     { sub: '好消息：分析它不用新方法，CH3 的節點分析加兩條規則就夠了。', on: '' }]);

  /* ═════ 02 運放長怎樣 ═════ */
  const S2 = sc('運放：超級靈敏的比較器', 'THE OP AMP',
    g('sym', opamp(200, 200) + wire('M150 186 H200 M150 214 H200 M264 200 H330') + T(142, 191, 'v<sub>1</sub>', { cls: 't', fs: 14, a: 'end' }) + T(142, 219, 'v<sub>2</sub>', { cls: 't', fs: 14, a: 'end' }) + T(338, 205, 'v<sub>o</sub>', { cls: 'ta', fs: 15, a: 'start' })) +
    calc(400, 120, 220, [['v<sub>o</sub> = A (v<sub>2</sub> − v<sub>1</sub>)', 'r1', 'ta'], ['A ≈ 10<sup>5</sup>～10<sup>8</sup>', 'r2'], ['差 0.0001 V → 輸出 10 V', 'r3', 'tm']], { k: 'cc', lh: 30 }) +
    chip(320, 285, '輸出最多到電源電壓（±V<sub>CC</sub>），超過就「飽和」', '', 'c1', { fs: 13 }),
    [{ sub: '運放長得像一個三角形：兩個輸入（− 反相、+ 非反相），一個輸出。', on: 'sym' },
     { sub: '它只做一件事：把兩個輸入的<b>差</b>放大 A 倍。A 非常大，十萬倍起跳。', on: 'cc r1 r2' },
     { sub: '輸入差一點點，輸出就衝很大 —— 像超級靈敏的天平。', on: 'r3' },
     { sub: '不過輸出不能超過接給它的電源電壓，超過就卡住（飽和）。', on: 'c1' }]);

  /* ═════ 03 理想運放兩條規則 ═════ */
  const S3 = sc('理想運放：只要記兩條', 'TWO GOLDEN RULES',
    g('sym', opamp(130, 205) + wire('M80 191 H130 M80 219 H130 M194 205 H240') +
      arrow(88, 178, 118, 178, null, 'ln') + T(103, 170, 'i = 0', { cls: 'ta', fs: 13 }) + arrow(88, 236, 118, 236, null, 'ln') + T(103, 252, 'i = 0', { cls: 'ta', fs: 13 })) +
    calc(290, 112, 330, [['規則一：輸入端不吃電流', 'r1', 'ta'], ['　i<sub>1</sub> = i<sub>2</sub> = 0', 'r1b'], ['規則二：有負回授時 v<sub>+</sub> = v<sub>−</sub>', 'r2', 'ta'], ['　（虛短路：電壓一樣，但沒有電流）', 'r2b', 'tm']], { k: 'cc', lh: 30 }) +
    chip(450, 270, '像勤勞的管家：一直調輸出，直到兩邊一樣', '', 'c1', { fs: 13 }),
    [{ sub: '實際運放的輸入電阻很大、A 很大。直接當成無限大，就得到<b>理想運放</b>。', on: 'sym' },
     { sub: '規則一：輸入電阻無限大 → 兩個輸入端<b>不吃電流</b>。', on: 'cc r1 r1b' },
     { sub: '規則二：A 無限大，輸出又回授到 − 端時，它會一直調整輸出，讓 <b>v<sub>+</sub> = v<sub>−</sub></b>。', on: 'r2 r2b' },
     { sub: '像一個勤勞的管家：哪邊高一點就馬上調，直到兩邊一樣。這叫「虛短路」。', on: 'c1' }]);

  /* ═════ 04 反相放大器 ═════ */
  const S4 = sc('反相放大器', 'INVERTING AMPLIFIER',
    inv('ckt') + T(290 - 4, 176, '0 V', { cls: 'ta', fs: 12.5, a: 'end', k: 'z' }) +
    g('i', arrow(150, 200, 200, 200, null, 'lna') + T(175, 216, 'i', { cls: 'ta', fs: 14 }) + arrow(300, 144, 360, 144, null, 'lna') + T(330, 160, 'i', { cls: 'ta', fs: 14 })) +
    calc(470, 228, 150, [['i = v<sub>s</sub> / R<sub>1</sub>', 'r1'], ['v<sub>o</sub> = −i R<sub>f</sub>', 'r2'], ['v<sub>o</sub>/v<sub>s</sub> = −R<sub>f</sub>/R<sub>1</sub>', 'r3', 'ta']], { k: 'cc', lh: 22, fs: 13 }),
    [{ sub: '最經典的接法：輸入經過 R<sub>1</sub> 進 − 端，R<sub>f</sub> 把輸出接回 − 端（負回授），+ 端接地。', on: 'ckt' },
     { sub: '規則二：+ 端是 0 V，所以 − 端也是 <b>0 V</b>。', on: 'z' },
     { sub: 'R<sub>1</sub> 上的電流 i = v<sub>s</sub>/R<sub>1</sub>。規則一：運放不吃電流 → i 全部走 R<sub>f</sub>。', on: 'i cc r1' },
     { sub: 'v<sub>o</sub> = 0 − iR<sub>f</sub>，所以增益 = <b>−R<sub>f</sub>/R<sub>1</sub></b>。負號：輸出跟輸入反相。', on: 'r2 r3' }]);

  /* ═════ 05 解謎 ═════ */
  const S5 = sc('解謎：只看兩個電阻', 'SOLVE THE PUZZLE',
    inv('ckt', { r1: '10 kΩ', rf: '20 kΩ' }) +
    calc(470, 108, 155, [['理想：−20/10 = −2', 'r1', 'ta'], ['實際（A = 2×10<sup>5</sup>）：', 'r2', 'tm'], ['−1.99997', 'r3'], ['v<sub>s</sub> = 2 V → i = 0.2 mA', 'r4']], { k: 'cc', lh: 26, fs: 13 }),
    [{ sub: '回到謎題：理想運放的答案是 −R<sub>f</sub>/R<sub>1</sub> = −20/10 = <b>−2</b>。', on: 'ckt cc r1' },
     { sub: '課本用真實的 741（A = 200,000）硬算，得到 −1.99997。差不到十萬分之二。', on: 'r2 r3' },
     { sub: '二十萬倍的增益被<b>負回授</b>「用掉」了：它的工作是讓 v<sub>+</sub> = v<sub>−</sub>，所以結果只剩電阻說了算。', on: '' },
     { sub: '這正是運放好用的原因：電阻很準，放大倍數就很準。', on: 'r4' }]);

  /* ═════ 06 先整理一下 ═════ */
  const S6 = sc('先整理一下', 'SO FAR',
    calc(110, 110, 420, [['運放：把兩個輸入的差放大 A 倍', 'r1'], ['理想：輸入不吃電流、v<sub>+</sub> = v<sub>−</sub>', 'r2', 'ta'], ['反相放大：v<sub>o</sub> = −(R<sub>f</sub>/R<sub>1</sub>) v<sub>s</sub>', 'r3'],
      ['分析法：在 − 端寫 KCL（節點分析）', 'r4'], ['接下來：同一招變出更多電路', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '先整理一下。', on: 'cc r1 r2' },
     { sub: '反相放大器的推導，其實就是在 − 端寫一條 KCL。', on: 'r3 r4' },
     { sub: '同一招，換個接法就變出別的電路。', on: 'r5' }]);

  /* ═════ 07 四種常用電路 ═════ */
  const box4 = (x, y, t, f, n, key) => g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="265" height="82" rx="12" filter="url(#st-sh)"/>' +
    T(x + 14, y + 24, t, { cls: 't', fs: 14, a: 'start' }) + T(x + 14, y + 52, f, { cls: 'ta', fs: 14, a: 'start' }) + T(x + 14, y + 72, n, { cls: 'ts', fs: 11.5, a: 'start' }));
  const S7 = sc('同一招，四種電路', 'FOUR CLASSIC CIRCUITS',
    box4(40, 108, '反相放大', 'v<sub>o</sub> = −(R<sub>f</sub>/R<sub>1</sub>) v<sub>i</sub>', '輸出跟輸入反相', 'b1') +
    box4(335, 108, '非反相放大', 'v<sub>o</sub> = (1 + R<sub>f</sub>/R<sub>1</sub>) v<sub>i</sub>', '輸入接 + 端；R<sub>f</sub> = 0 → 電壓隨耦器', 'b2') +
    box4(40, 205, '加法器', 'v<sub>o</sub> = −R<sub>f</sub>(v<sub>1</sub>/R<sub>1</sub> + v<sub>2</sub>/R<sub>2</sub> + …)', '像混音器：好幾個訊號加起來', 'b3') +
    box4(335, 205, '差動放大', 'v<sub>o</sub> = (R<sub>2</sub>/R<sub>1</sub>)(v<sub>2</sub> − v<sub>1</sub>)', '條件：R<sub>1</sub>/R<sub>2</sub> = R<sub>3</sub>/R<sub>4</sub>', 'b4'),
    [{ sub: '反相放大：剛剛推過的。', on: 'b1' },
     { sub: '<b>非反相</b>：訊號接 + 端，增益 1 + R<sub>f</sub>/R<sub>1</sub>，不會反相。R<sub>f</sub> = 0 時增益 1，叫電壓隨耦器（當緩衝用）。', on: 'b2' },
     { sub: '<b>加法器</b>：好幾個輸入各經一個電阻接到 − 端，電流在那裡加起來 —— 像混音器。', on: 'b3' },
     { sub: '<b>差動放大</b>：放大兩個輸入的差。推導全部一樣：− 端寫 KCL ＋ 兩條規則。', on: 'b4' }]);

  /* ═════ 08 組合起來：Example 5.5 ═════ */
  const S8 = sc('組合題：兩個輸入', 'COMBINE THEM',
    calc(60, 108, 520, [['課本 Example 5.5：6 V 接 −（經 4 kΩ），4 V 接 +，R<sub>f</sub> = 10 kΩ', 'r0', 'ts', 12.5], ['重疊：只留 6 V → 反相：−(10/4)(6) = −15 V', 'r1'],
      ['只留 4 V → 非反相：(1 + 10/4)(4) = 14 V', 'r2'], ['v<sub>o</sub> = −15 + 14 = −1 V', 'r3', 'ta']], { k: 'cc', lh: 34 }) +
    chip(320, 285, 'CH4 的重疊定理，在運放電路照樣能用', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '課本 Example 5.5：一個輸入接 − 端、一個接 + 端。', on: 'cc r0' },
     { sub: '用 CH4 的重疊：只留 6 V 時，就是反相放大器 → −15 V。', on: 'r1' },
     { sub: '只留 4 V 時，就是非反相放大器 → 14 V。', on: 'r2' },
     { sub: '加起來 v<sub>o</sub> = <b>−1 V</b>。前面學的工具全部都能拿來用。', on: 'r3 c1' }]);

  /* ═════ 09 常見的錯 ═════ */
  const S9 = sc('常見的錯', 'COMMON MISTAKES',
    T(320, 140, '虛短路 → 兩個輸入之間有電流流過', { cls: 't', fs: 16.5, k: 'x0' }) + strike(170, 135, 470, 'x1') +
    T(320, 170, '電壓一樣，但電流是 0', { cls: 'ta', fs: 16, k: 'o1' }) +
    T(320, 220, '沒有回授也能用 v<sub>+</sub> = v<sub>−</sub>', { cls: 't', fs: 16.5, k: 'x2' }) + strike(190, 215, 450, 'x3') +
    T(320, 250, '規則二只在負回授時成立；沒有回授 → 輸出飽和', { cls: 'ta', fs: 15, k: 'o2' }),
    [{ sub: '錯誤一：「虛短路」以為真的接在一起，有電流流過。', on: 'x0' },
     { sub: '不是！只是電壓一樣，電流還是 0（規則一）。', on: 'x1 o1' },
     { sub: '錯誤二：不管怎麼接都用 v<sub>+</sub> = v<sub>−</sub>。', on: 'x2' },
     { sub: '只有輸出回授到 − 端（負回授）才成立。沒有回授，運放會直接衝到飽和。', on: 'x3 o2' }]);

  /* ═════ 10 恍然大悟 ═════ */
  const S10 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：二十萬倍 → 只剩 −2？', 'r1', 'ta'], ['→ 負回授讓 v<sub>+</sub> = v<sub>−</sub>，增益只看電阻', 'r2'], ['→ 分析：− 端 KCL ＋ 兩條規則', 'r3'],
      ['還缺：電阻只看「現在」，電路沒有記憶', 'r4', 'tm'], ['→ CH6：電容、電感 —— 會存能量的元件', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：二十萬倍的放大器，接成電路只剩 −2 倍。', on: 'cc r1' },
     { sub: '因為負回授讓兩端電壓一樣，增益只剩電阻說了算。', on: 'r2' },
     { sub: '分析方法沒有新的：− 端 KCL ＋ 兩條規則。', on: 'r3' },
     { sub: '還缺什麼？目前的元件只看「現在」，沒有記憶。', on: 'r4' },
     { sub: '下一章 CH6：電容和電感。', on: 'r5' }]);

  __Story('#story', { id: 'cir-rv-ch5', title: 'CH5 運算放大器', after: '#sum', afterLabel: '看這章總結 ↓', stamp: { no: 'CH5', name: '運放' },
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10] });
})();
