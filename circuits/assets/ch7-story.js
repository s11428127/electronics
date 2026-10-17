/* ============================================================
   電路學 CH7 複習 —— 故事模式（一階電路 First-Order Circuits），兩段
   PART 1 無源響應（放電）、時間常數（課本 Example 7.1、7.20 閃光燈）
     謎題：同一顆 2000 μF 電容，充電要 1 分鐘、放電只要 0.12 秒 —— 為什麼？
     答案：τ = RC，充電 6 kΩ → τ = 12 s，放電 12 Ω → τ = 0.024 s；5τ 就差不多完成。
   PART 2 步階響應（課本 Example 7.10）
     謎題：開關從 A 切到 B，電容從 15 V 走向 30 V，1 秒後是幾伏？
     答案：v(t) = v(∞) + [v(0) − v(∞)]e^(−t/τ) = 30 − 15e^(−0.5t)，v(1) = 20.9 V。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__RV) return;
  const R = window.__RV, D = R.D;
  const { g, T, calc, sc, el, bat, wire, strike, ladder, curve, axes, card, f1 } = R;
  const { chip, arrow } = D;

  /* 單刀雙投開關：pivot 接 A 或 B（兩條刀片各有 key，切換時 on/off） */
  const sw = (p, a, b, ka, kb) => '<circle class="bgw" cx="' + a[0] + '" cy="' + a[1] + '" r="3.6"/><circle class="bgw" cx="' + b[0] + '" cy="' + b[1] + '" r="3.6"/>' + R.dot(p[0], p[1]) +
    '<line class="ln" style="stroke-width:2.4" x1="' + p[0] + '" y1="' + p[1] + '" x2="' + a[0] + '" y2="' + (a[1] + 3) + '" data-k="' + ka + '"/>' +
    '<line class="ln" style="stroke-width:2.4" x1="' + p[0] + '" y1="' + p[1] + '" x2="' + b[0] + '" y2="' + (b[1] + 3) + '" data-k="' + kb + '"/>';
  /* 指數曲線的座標圖：ax(x, y, w, h) 原點，fn(t) t∈[0,1] → 0~1 */
  const plot = (key, x, y, w, h, fn, cls) => curve(fn, x, w, y, h, cls || 'lna', key);

  /* ═══════════════ PART 1 ═══════════════ */
  const YU = 130, YD = 285;
  /* 閃光燈（Example 7.20） */
  const flash = k => g(k, bat(80, 207, '240 V') + wire('M80 177 V' + YU + ' M80 237 V' + YD + ' H430') + el('r', 80, YU, 230, YU, '6 kΩ') +
    sw([270, 165], [236, YU], [304, YU], 'sa', 'sb') + T(236, YU - 12, '充電', { cls: 'ts', fs: 11.5 }) + T(304, YU - 12, '閃光', { cls: 'ts', fs: 11.5 }) +
    el('c', 270, 165, 270, YD, '2000 μF', { side: 'l' }) + wire('M308 ' + YU + ' H430') + el('r', 430, YU, 430, YD, '燈 12 Ω'));

  const A0 = sc('充電一分鐘，放電一眨眼', 'THE PUZZLE',
    flash('ckt') +
    calc(500, 112, 125, [['充電：60 秒', 'r1'], ['放電：0.12 秒', 'r2', 'ta'], ['閃光：480 W', 'r3', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '課本 Example 7.20：相機閃光燈。一顆 2000 μF 電容，先經過 6 kΩ 充到 240 V。', on: 'ckt sa' },
     { sub: '充電大約要 <b>60 秒</b>。', on: 'cc r1' },
     { sub: '按下快門，開關切到燈泡（12 Ω），同一顆電容放電只要 <b>0.12 秒</b>，燈泡瞬間吃到 480 W。', off: 'sa', on: 'sb r2 r3' },
     { sub: '同一顆電容，為什麼一個慢、一個快？', on: '' }]);

  const A1 = sc('這一章要幹嘛', 'WHY THIS CHAPTER',
    ladder(7, { k: 'lad', km: 'me', hl: [6] }) +
    chip(230, 118, 'CH6：L、C 不能瞬間改變', '會存能量', 'c1', { fs: 14 }) +
    chip(470, 118, 'CH7：開關一切，怎麼慢慢變？', '一個 L 或一個 C = 一階', 'c2', { fs: 14, acc: true }),
    [{ sub: '第 7 階。CH6 說：電容電壓、電感電流不能瞬間改變。', on: 'lad me lad-hl c1' },
     { sub: 'CH7 要回答：開關一切，它們<b>怎麼從舊的值慢慢走到新的值</b>？', on: 'c2' },
     { sub: '電路裡只有一個電容（或一個電感），叫<b>一階電路</b>。PART 1 先看放電。', on: '' }]);

  const A2 = sc('放電：水桶從小洞漏水', 'DISCHARGING',
    g('bk', '<path class="ln" style="fill:none" d="M80 120 V270 H190 V120"/><rect class="accw" x="82" y="150" width="106" height="118"/>' +
      '<path class="ln" d="M190 255 H230"/>') + R.dots('M192 262 H236', 'fl', 'slow') +
    T(135, 290, '水越少，壓力越小，流得越慢', { cls: 'ts', fs: 12, k: 'bt' }) +
    axes(330, 270, 270, 150, 'ax', { xl: 't', yl: 'v' }) + plot('cv', 330, 270, 260, 140, t => Math.exp(-t * 4)) +
    T(470, 180, '指數衰減', { cls: 'ta', fs: 14, k: 'cl' }),
    [{ sub: '充好電的電容接上電阻，就像裝滿水的水桶，底下開一個小洞。', on: 'bk fl' },
     { sub: '剛開始水多、壓力大，漏得快；水越少，漏得越慢。', on: 'bt' },
     { sub: '電容也是：電壓越低，電流越小，掉得越慢。畫出來就是<b>指數衰減</b>。', on: 'ax cv cl' }]);

  const A3 = sc('寫成方程式', 'THE EQUATION',
    calc(110, 108, 420, [['KCL：C dv/dt + v/R = 0', 'r1'], ['dv/v = −dt/(RC)　兩邊積分', 'r2', 'tm'], ['v(t) = V<sub>0</sub> e<sup>−t/τ</sup>', 'r3', 'ta', 20], ['τ = RC（時間常數，單位秒）', 'r4', 'ta']], { k: 'cc', a: 'middle', lh: 34 }),
    [{ sub: '電容的電流 C dv/dt 全部流進電阻 v/R：KCL 加起來 = 0。', on: 'cc r1' },
     { sub: '這是一條一階微分方程。移項、兩邊積分（工數的分離變數）。', on: 'r2' },
     { sub: '答案：v(t) = V<sub>0</sub>e<sup>−t/τ</sup>，V<sub>0</sub> 是一開始的電壓。', on: 'r3' },
     { sub: 'τ = RC 叫<b>時間常數</b>：決定掉得多快。', on: 'r4' }]);

  const TX = 90, TW = 480, TY = 270, TH = 150;
  const tm = n => f1(TX + n * TW / 5.5);
  const A4 = sc('時間常數 τ：放電的尺', 'THE TIME CONSTANT',
    axes(TX, TY, TW + 20, TH + 10, 'ax', { xl: 't' }) + plot('cv', TX, TY, TW, TH, t => Math.exp(-t * 5.5)) +
    g('m1', '<line class="ln2 dsh" x1="' + tm(1) + '" y1="' + f1(TY - TH * Math.exp(-1)) + '" x2="' + tm(1) + '" y2="' + TY + '"/>' + R.dot(tm(1), f1(TY - TH * Math.exp(-1))) +
      T(tm(1) + 8, f1(TY - TH * Math.exp(-1)) - 8, '36.8%', { cls: 'ta', fs: 13, a: 'start' }) + T(tm(1), TY + 16, 'τ', { cls: 'ta', fs: 13 })) +
    g('m5', '<line class="ln2 dsh" x1="' + tm(5) + '" y1="' + (TY - 30) + '" x2="' + tm(5) + '" y2="' + TY + '"/>' + T(tm(5), TY + 16, '5τ', { cls: 'ta', fs: 13 }) + T(tm(5), TY - 36, '剩 0.7%', { cls: 'ta', fs: 13 })) +
    chip(430, 140, 'τ 越大，放得越慢', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '經過一個 τ，電壓剩下原本的 e<sup>−1</sup> = <b>36.8%</b>。', on: 'ax cv m1' },
     { sub: '經過 5τ，只剩 0.7% —— 工程上就當作<b>放完了</b>。', on: 'm5' },
     { sub: 'τ = RC：電阻越大（洞越小）、電容越大（桶子越大），放得越慢。', on: 'c1' }]);

  /* Example 7.1 */
  const A5 = sc('例題：先求 R<sub>eq</sub>', 'EXAMPLE 7.1',
    g('ck', el('r', 120, YU, 120, YD, '5 Ω', { side: 'l' }) + el('c', 230, YU, 230, YD, '0.1 F', { side: 'l' }) + wire('M120 ' + YU + ' H230 M120 ' + YD + ' H380') +
      el('r', 230, YU, 380, YU, '8 Ω') + el('r', 380, YU, 380, YD, '12 Ω', { side: 'l' }) + R.dot(230, YU) + R.dot(230, YD) +
      T(246, 196, '+', { cls: 'tm', fs: 13, a: 'start' }) + T(246, 218, 'v<sub>C</sub>', { cls: 't', fs: 14, a: 'start' }) + T(246, 244, '−', { cls: 'tm', fs: 13, a: 'start' }) +
      T(396, 218, 'v<sub>x</sub>', { cls: 't', fs: 14, a: 'start' })) +
    calc(445, 108, 180, [['v<sub>C</sub>(0) = 15 V', 'r0', 'tm'], ['R<sub>eq</sub> = 5 ∥ (8 + 12) = 4 Ω', 'r1'], ['τ = 4 × 0.1 = 0.4 s', 'r2'], ['v<sub>C</sub> = 15e<sup>−2.5t</sup> V', 'r3', 'ta'], ['v<sub>x</sub> = 9e<sup>−2.5t</sup> V', 'r4'], ['i<sub>x</sub> = 0.75e<sup>−2.5t</sup> A', 'r5']], { k: 'cc', lh: 28, fs: 13.5 }),
    [{ sub: '課本 Example 7.1：電容一開始 15 V，旁邊接了一堆電阻。', on: 'ck cc r0' },
     { sub: '從電容看出去，所有電阻合成一個 R<sub>eq</sub>（就是 CH4 的戴維寧電阻）：4 Ω。', on: 'r1' },
     { sub: 'τ = R<sub>eq</sub>C = 0.4 s，所以 v<sub>C</sub> = 15e<sup>−2.5t</sup> V。', on: 'r2 r3' },
     { sub: '有了 v<sub>C</sub>，其他都用分壓、歐姆定律算：v<sub>x</sub> = 12/20 × v<sub>C</sub>。', on: 'r4 r5' }]);

  const A6 = sc('先整理一下', 'SO FAR',
    calc(110, 110, 420, [['無源 RC：v(t) = V<sub>0</sub> e<sup>−t/τ</sup>', 'r1'], ['τ = R<sub>eq</sub> C（從電容看出去的電阻）', 'r2', 'ta'], ['τ 後剩 36.8%，5τ 後當作完成', 'r3'],
      ['先求 v<sub>C</sub>，其他再從 v<sub>C</sub> 算', 'r4'], ['接下來：電感版本', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '先整理一下 RC 放電。', on: 'cc r1 r2' },
     { sub: 'τ 是時間的尺：一個 τ 剩 36.8%，五個 τ 就完成。', on: 'r3 r4' },
     { sub: '電感也有一模一樣的版本。', on: 'r5' }]);

  const A7 = sc('RL：電流慢慢停下來', 'THE RL CIRCUIT',
    g('ck', el('l', 120, YU, 120, YD, 'L', { side: 'l' }) + el('r', 260, YU, 260, YD, 'R') + wire('M120 ' + YU + ' H260 M120 ' + YD + ' H260')) +
    R.dots('M120 ' + YU + ' H260 V' + YD + ' H120 Z', 'fl', 'slow') +
    calc(330, 112, 290, [['i(t) = I<sub>0</sub> e<sup>−t/τ</sup>', 'r1', 'ta', 18], ['τ = L / R', 'r2', 'ta', 18], ['R 越大，停得越快', 'r3']], { k: 'cc', lh: 34 }) +
    chip(190, 300, '像慢慢停下來的飛輪', '', 'c1', { fs: 13 }),
    [{ sub: '電感版本：一開始有電流 I<sub>0</sub> 在電感和電阻裡繞。', on: 'ck fl' },
     { sub: '電感電流不能跳，只能慢慢減少：i(t) = I<sub>0</sub>e<sup>−t/τ</sup>。', on: 'cc r1 c1' },
     { sub: '時間常數變成 <b>τ = L/R</b>。注意：R 在分母，電阻越大，電流停得越快。', on: 'r2 r3' }]);

  const A8 = sc('常見的錯', 'COMMON MISTAKES',
    T(320, 140, 'RL 電路：τ = RL', { cls: 't', fs: 17, k: 'x0' }) + strike(240, 135, 400, 'x1') +
    T(320, 170, 'τ = L / R（R 越大越快）', { cls: 'ta', fs: 16, k: 'o1' }) +
    T(320, 220, 'τ 直接用題目上某一顆電阻', { cls: 't', fs: 17, k: 'x2' }) + strike(200, 215, 440, 'x3') +
    T(320, 250, '用「從 L 或 C 看出去」的等效電阻 R<sub>Th</sub>', { cls: 'ta', fs: 16, k: 'o2' }),
    [{ sub: '錯誤一：RL 也寫成 τ = RL。', on: 'x0' },
     { sub: '單位就不對！RC 是秒，L/R 才是秒。', on: 'x1 o1' },
     { sub: '錯誤二：τ 隨便抓一顆電阻。', on: 'x2' },
     { sub: '要先把電源關掉，從電容或電感兩端看出去，求戴維寧等效電阻。', on: 'x3 o2' }]);

  const A9 = sc('解謎：兩個 τ', 'SOLVE THE PUZZLE',
    flash('ckt') +
    calc(505, 108, 125, [['充電 τ = 6k × 2000μ', 'r1'], ['= 12 s → 5τ = 60 s', 'r1b', 'ta'], ['放電 τ = 12 × 2000μ', 'r2'], ['= 0.024 s → 0.12 s', 'r2b', 'ta'], ['57.6 J / 0.12 s', 'r3'], ['= 480 W', 'r3b', 'ta']], { k: 'cc', lh: 26, fs: 13 }),
    [{ sub: '充電經過 6 kΩ：τ = 6000 × 0.002 = 12 s，5τ = <b>60 秒</b>。', on: 'ckt sa cc r1 r1b' },
     { sub: '放電經過 12 Ω 的燈：τ = 12 × 0.002 = 0.024 s，5τ = <b>0.12 秒</b>。', off: 'sa', on: 'sb r2 r2b' },
     { sub: '電容存的 ½CV<sup>2</sup> = 57.6 J 在 0.12 秒內全部倒給燈泡 → 平均 480 W。', on: 'r3 r3b' },
     { sub: '同一顆電容，差別全在<b>電阻</b>：小電阻 → 小 τ → 一瞬間放完，這就是閃光。', on: '' }]);

  const A10 = sc('PART 1 小結', 'PART 1 RECAP',
    calc(90, 106, 460, [['謎題：充電 60 s、放電 0.12 s', 'r1', 'ta'], ['→ τ = RC，電阻差 500 倍，τ 就差 500 倍', 'r2'], ['→ 5τ 後當作完成', 'r3'],
      ['還缺：如果有電源一直推（充電）呢？', 'r4', 'tm'], ['→ PART 2：步階響應', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：充電 60 秒、放電 0.12 秒。', on: 'cc r1' },
     { sub: '因為兩條路的電阻差 500 倍，τ 也差 500 倍。', on: 'r2' },
     { sub: '5τ 後當作完成。', on: 'r3' },
     { sub: '剛剛都是「放掉」。如果有電源一直推呢？', on: 'r4' },
     { sub: '往下看 PART 2：步階響應。', on: 'r5' }]);

  __Story('#story', { id: 'cir-rv-ch7a', title: 'CH7 PART 1 放電與時間常數', after: '#story2-sec', afterLabel: '接著看 PART 2 ↓', stamp: { no: 'CH7', name: '放電' },
    scenes: [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10] });

  /* ═══════════════ PART 2 ═══════════════ */
  /* 課本 Fig 7.43（Example 7.10） */
  const fig710 = k => g(k, bat(70, 207, '24 V') + wire('M70 177 V' + YU + ' M70 237 V' + YD + ' H480') + el('r', 70, YU, 200, YU, '3 kΩ') +
    el('r', 200, YU, 200, YD, '5 kΩ', { side: 'l' }) + wire('M200 ' + YU + ' H246') + R.dot(200, YU) + R.dot(200, YD) +
    sw([290, 165], [250, YU], [330, YU], 'sa', 'sb') + T(250, YU - 12, 'A', { cls: 'ts', fs: 12 }) + T(330, YU - 12, 'B', { cls: 'ts', fs: 12 }) +
    el('c', 290, 165, 290, YD, '0.5 mF', { side: 'l' }) + T(306, 212, '+', { cls: 'tm', fs: 13, a: 'start' }) + T(306, 234, 'v', { cls: 'ta', fs: 15, a: 'start' }) + T(306, 258, '−', { cls: 'tm', fs: 13, a: 'start' }) +
    el('r', 334, YU, 480, YU, '4 kΩ') + bat(480, 207, '30 V', { side: 'r' }) + wire('M480 ' + YU + ' V177 M480 237 V' + YD) + R.dot(290, YD));

  const B0 = sc('15 V 到 30 V 的路上', 'THE PUZZLE',
    fig710('ckt') +
    chip(560, 112, 'v(1 s) = ?', '', 'q', { fs: 15, acc: true }),
    [{ sub: 'PART 2，課本 Example 7.10：開關在 A 很久了，電容兩端是 15 V。', on: 'ckt sa' },
     { sub: 't = 0 時開關切到 B，接上 30 V 電源。', off: 'sa', on: 'sb' },
     { sub: '電容會從 15 V 慢慢走向 30 V。問：<b>1 秒後是幾伏？</b>', on: 'q' }]);

  const B1 = sc('開關 = 步階函數', 'THE UNIT STEP',
    axes(90, 250, 220, 120, 'a1', { xl: 't' }) + g('u', '<path class="lna" style="fill:none;stroke-width:3" d="M90 250 H180 V170 H300"/>' + T(180, 266, '0', { cls: 'ts', fs: 12 }) + T(240, 160, 'u(t)', { cls: 'ta', fs: 15 })) +
    axes(370, 250, 240, 120, 'a2', { xl: 't' }) + g('p', '<path class="lna" style="fill:none;stroke-width:3" d="M370 250 H430 V170 H520 V250 H600"/>' + T(430, 266, '2', { cls: 'ts', fs: 12 }) + T(520, 266, '5', { cls: 'ts', fs: 12 }) + T(475, 160, '脈波 = 兩個步階相減', { cls: 'ta', fs: 13 })) +
    chip(320, 296, '單位步階 u(t)：t &lt; 0 是 0，t &gt; 0 是 1', '', 'c1', { fs: 13 }),
    [{ sub: '開關「啪」一下打開，數學上用<b>單位步階函數</b> u(t) 表示：之前是 0、之後是 1。', on: 'a1 u c1' },
     { sub: '晚一點才開的開關寫成 u(t − t<sub>0</sub>)。', on: '' },
     { sub: '一個脈波（例如 2 秒開、5 秒關）= 兩個步階相減：u(t − 2) − u(t − 5)。', on: 'a2 p' }]);

  const B2 = sc('步階響應：從起點走向終點', 'THE STEP RESPONSE',
    axes(90, 280, 500, 175, 'ax', { xl: 't', yl: 'v' }) +
    g('st', '<line class="ln2 dsh" x1="90" y1="200" x2="590" y2="200"/>' + T(84, 204, 'v(0)', { cls: 't', fs: 13, a: 'end' })) +
    g('en', '<line class="ln2 dsh" x1="90" y1="120" x2="590" y2="120"/>' + T(84, 124, 'v(∞)', { cls: 'ta', fs: 13, a: 'end' })) +
    curve(t => (80 + 80 * (1 - Math.exp(-t * 5))) / 175, 90, 500, 280, 175, 'lna', 'cv') +
    calc(300, 210, 310, [['v(t) = v(∞) + [v(0) − v(∞)] e<sup>−t/τ</sup>', 'r1', 'ta', 15]], { k: 'cc', a: 'middle', lh: 34 }),
    [{ sub: '有電源一直推時，電容電壓從<b>起點 v(0)</b> 出發……', on: 'ax st' },
     { sub: '指數地走向<b>終點 v(∞)</b>，越接近走得越慢。', on: 'en cv' },
     { sub: '整條曲線只需要三個數字：起點、終點、τ。', on: 'cc r1' },
     { sub: 'PART 1 的放電只是終點 = 0 的特例。這一條公式通吃所有一階電路。', on: '' }]);

  const B3 = sc('三個數字怎麼找', 'THREE NUMBERS',
    calc(90, 108, 460, [['① v(0)：開關切換「前」的穩態，C 當斷路', 'r1'], ['　電容電壓不能跳 → v(0<sup>+</sup>) = v(0<sup>−</sup>)', 'r1b', 'ta'], ['② v(∞)：切換「後」很久的穩態，C 當斷路', 'r2'],
      ['③ τ = R<sub>Th</sub> C：切換後，電源關掉從 C 看出去', 'r3'], ['像導航：起點、終點、車速', 'r4', 'tm']], { k: 'cc', lh: 32 }),
    [{ sub: '三個數字各有固定找法。起點 v(0)：用<b>切換前</b>的電路算穩態。', on: 'cc r1' },
     { sub: '電容電壓不能跳，所以切換後一瞬間還是這個值。', on: 'r1b' },
     { sub: '終點 v(∞)：<b>切換後</b>很久，電容又變回斷路。', on: 'r2' },
     { sub: 'τ：切換後的電路，從電容看出去的等效電阻 × C。', on: 'r3 r4' }]);

  const B4 = sc('解謎（一）：起點', 'SOLVE: v(0)',
    fig710('ckt') +
    calc(445, 130, 180, [['開關在 A', 'r0', 'tm'], ['v(0) = 24 × 5/8', 'r1'], ['= 15 V', 'r2', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '切換前：開關在 A，很久了 → 電容是斷路。', on: 'ckt sa cc r0', mv: { ckt: [-62, 8, 0.8] } },
     { sub: '電容電壓 = 5 kΩ 上的電壓：24 × 5/(5 + 3) = <b>15 V</b>。', on: 'r1 r2' }]);

  const B5 = sc('解謎（二）：終點與 τ', 'SOLVE: v(∞) AND τ',
    fig710('ckt') +
    calc(445, 120, 180, [['開關在 B', 'r0', 'tm'], ['v(∞) = 30 V', 'r1', 'ta'], ['R<sub>Th</sub> = 4 kΩ', 'r2'], ['τ = 4k × 0.5m', 'r3'], ['= 2 s', 'r3b', 'ta']], { k: 'cc', lh: 27 }),
    [{ sub: '切換後：開關在 B。很久以後電容斷路，沒有電流 → 4 kΩ 沒壓降，v(∞) = <b>30 V</b>。', on: 'ckt sb cc r0 r1', mv: { ckt: [-62, 8, 0.8] } },
     { sub: 'τ：30 V 關掉（短路），從電容看出去只有 4 kΩ。', on: 'r2' },
     { sub: 'τ = 4000 × 0.0005 = <b>2 s</b>。', on: 'r3 r3b' }]);

  const v710 = t => 30 - 15 * Math.exp(-0.5 * t);
  const PX = 90, PW = 480, PY = 280, PH = 170, tx = t => f1(PX + t / 10 * PW), vy = v => f1(PY - v / 32 * PH);
  const B6 = sc('答案：代進公式', 'THE ANSWER',
    axes(PX, PY, PW + 20, PH + 4, 'ax', { xl: 't（s）' }) +
    g('lv', '<line class="ln2 dsh" x1="' + PX + '" y1="' + vy(30) + '" x2="' + (PX + PW) + '" y2="' + vy(30) + '"/>' + T(PX - 6, +vy(30) + 4, '30', { cls: 'ta', fs: 12, a: 'end' }) + T(PX - 6, +vy(15) + 4, '15', { cls: 't', fs: 12, a: 'end' })) +
    curve(t => v710(10 * t) / 32, PX, PW, PY, PH, 'lna', 'cv') +
    g('p1', R.dot(tx(1), vy(v710(1))) + T(+tx(1) + 8, +vy(v710(1)) + 18, 'v(1) = 20.9 V', { cls: 'ta', fs: 13, a: 'start' })) +
    g('p4', R.dot(tx(4), vy(v710(4))) + T(+tx(4) + 8, +vy(v710(4)) + 18, 'v(4) = 27.97 V', { cls: 't', fs: 13, a: 'start' })) +
    calc(300, 210, 290, [['v(t) = 30 + (15 − 30)e<sup>−t/2</sup>', 'r1'], ['= 30 − 15e<sup>−0.5t</sup> V', 'r2', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '三個數字代進去：v(t) = 30 + (15 − 30)e<sup>−t/2</sup> = 30 − 15e<sup>−0.5t</sup> V。', on: 'ax lv cv cc r1 r2' },
     { sub: '1 秒後：30 − 15e<sup>−0.5</sup> = <b>20.9 V</b>。謎題解開！', on: 'p1' },
     { sub: '4 秒後（2τ）：27.97 V。再等到 5τ = 10 秒，就差不多到 30 V 了。', on: 'p4' }]);

  const B7 = sc('常見的錯', 'COMMON MISTAKES',
    T(320, 140, 'v(0) 用切換「後」的電路算', { cls: 't', fs: 17, k: 'x0' }) + strike(200, 135, 440, 'x1') +
    T(320, 170, '用切換「前」的穩態，再靠「不能跳」帶過來', { cls: 'ta', fs: 15, k: 'o1' }) +
    T(320, 220, '電感：電壓不能跳', { cls: 't', fs: 17, k: 'x2' }) + strike(240, 215, 400, 'x3') +
    T(320, 250, '不能跳的是電容「電壓」、電感「電流」', { cls: 'ta', fs: 15, k: 'o2' }),
    [{ sub: '錯誤一：起點用切換後的電路算。', on: 'x0' },
     { sub: '起點要用切換<b>前</b>的電路，再靠「不能跳」帶到切換後。', on: 'x1 o1' },
     { sub: '錯誤二：搞混誰不能跳。', on: 'x2' },
     { sub: '電容管電壓、電感管電流。電感電壓、電容電流都可以瞬間跳。', on: 'x3 o2' }]);

  const B8 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：1 秒後 20.9 V', 'r1', 'ta'], ['→ 一條公式：起點、終點、τ', 'r2'], ['→ v(t) = v(∞) + [v(0) − v(∞)]e<sup>−t/τ</sup>', 'r3'],
      ['還缺：電路裡同時有 L 和 C 呢？', 'r4', 'tm'], ['→ CH8：二階電路，會振盪', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：1 秒後 20.9 V。', on: 'cc r1' },
     { sub: '一階電路只要找三個數字。', on: 'r2 r3' },
     { sub: '還缺什麼？電路裡同時有 L 和 C 時，它們會互相丟能量。', on: 'r4' },
     { sub: '下一章 CH8：二階電路。', on: 'r5' }]);

  __Story('#story2', { id: 'cir-rv-ch7b', title: 'CH7 PART 2 步階響應', after: '#sum', afterLabel: '看這章總結 ↓', stamp: { no: 'CH7', name: '步階' },
    scenes: [B0, B1, B2, B3, B4, B5, B6, B7, B8] });
})();
