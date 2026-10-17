/* ============================================================
   電路學 CH8 複習 —— 故事模式（二階電路 Second-Order Circuits），兩段
   PART 1 無源 RLC、三種阻尼（課本 Example 8.3、8.7）
     謎題（Ex 8.7）：同一個電路只換電阻 R = 5、4、1 Ω，電容電壓走法完全不一樣 —— 為什麼？
     答案：α = R/2L 跟 ω₀ = 1/√(LC) = 2 比：2.5 過阻尼、2 臨界、0.5 欠阻尼（會振盪）。
   PART 2 步階響應、兩個初始條件（課本 Example 8.1、8.7）
     謎題：R = 1 Ω 時，24 V 電源讓電容衝到約 39 V？
     答案：v = 24 + (21.69 sin 1.936t − 12 cos 1.936t)e^(−0.5t)，t ≈ 0.94 s 時最高 38.99 V（程式驗算）。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__RV) return;
  const R = window.__RV, D = R.D;
  const { g, T, calc, sc, el, bat, wire, strike, ladder, curve, axes, card, f1 } = R;
  const { chip, arrow } = D;

  /* Ex 8.7 的三種解（t 秒） */
  const WD = Math.sqrt(3.75);
  const v5 = t => 24 - 64 / 3 * Math.exp(-t) + 4 / 3 * Math.exp(-4 * t);
  const v4 = t => 24 - 19.2 * (1 + t) * Math.exp(-2 * t);
  const v1 = t => 24 + Math.exp(-0.5 * t) * (21.694 * Math.sin(WD * t) - 12 * Math.cos(WD * t));
  const PX = 90, PW = 490, PY = 285, PH = 170, TM = 7, VM = 42;
  const vy = v => f1(PY - v / VM * PH), tx = t => f1(PX + t / TM * PW);
  const resp = (fn, cls, key) => curve(u => fn(u * TM) / VM, PX, PW, PY, PH, cls, key, 200);
  const grid = key => g(key, D.arrow(PX - 4, PY, PX + PW + 14, PY, null, 'ln2') + D.arrow(PX, PY + 4, PX, PY - PH - 10, null, 'ln2') +
    '<line class="ln2 dsh" x1="' + PX + '" y1="' + vy(24) + '" x2="' + (PX + PW) + '" y2="' + vy(24) + '"/>' + T(PX - 6, +vy(24) + 4, '24 V', { cls: 'ts', fs: 12, a: 'end' }) +
    T(PX + PW + 10, PY + 18, 't（s）', { cls: 'ts', fs: 12, a: 'end' }) + T(PX + 8, PY - PH - 4, 'v<sub>C</sub>', { cls: 'ts', fs: 12, a: 'start' }));

  /* 課本 Fig 8.19：24 V、R、1 H、0.25 F，1 Ω 經開關並在電容上（t = 0 打開） */
  const YU = 130, YD = 285;
  const fig = (k, r) => g(k, bat(80, 207, '24 V') + wire('M80 177 V' + YU + ' M80 237 V' + YD + ' H520') +
    el('r', 80, YU, 210, YU, r || 'R') + el('l', 210, YU, 360, YU, '1 H') + el('c', 380, YU, 380, YD, '0.25 F', { side: 'l' }) + wire('M360 ' + YU + ' H420 M470 ' + YU + ' H520') +
    '<circle class="bgw" cx="424" cy="' + YU + '" r="3.6"/><circle class="bgw" cx="466" cy="' + YU + '" r="3.6"/>' +
    '<line class="ln" style="stroke-width:2.4" x1="424" y1="' + YU + '" x2="466" y2="' + YU + '" data-k="swc"/>' +
    '<line class="ln" style="stroke-width:2.4" x1="424" y1="' + YU + '" x2="460" y2="' + (YU - 20) + '" data-k="swo"/>' + T(445, YU - 24, 't = 0', { cls: 'ts', fs: 11 }) +
    el('r', 520, YU, 520, YD, '1 Ω') + T(396, 200, '+', { cls: 'tm', fs: 13, a: 'start' }) + T(396, 222, 'v', { cls: 'ta', fs: 15, a: 'start' }) + T(396, 246, '−', { cls: 'tm', fs: 13, a: 'start' }) +
    R.dot(380, YU) + R.dot(380, YD));

  /* ═══════════════ PART 1 ═══════════════ */
  const A0 = sc('只換一顆電阻', 'THE PUZZLE',
    fig('ckt') +
    grid('gr') + resp(v5, 'ln', 'c5') + resp(v4, 'ln dsh', 'c4') + resp(v1, 'lna', 'c1') +
    g('l5', '<line class="ln" x1="440" y1="112" x2="470" y2="112"/>' + T(478, 117, 'R = 5 Ω', { cls: 't', fs: 13, a: 'start' })) +
    g('l4', '<line class="ln dsh" x1="440" y1="134" x2="470" y2="134"/>' + T(478, 139, 'R = 4 Ω', { cls: 't', fs: 13, a: 'start' })) +
    g('l1', '<line class="lna" x1="440" y1="156" x2="470" y2="156"/>' + T(478, 161, 'R = 1 Ω', { cls: 'ta', fs: 13, a: 'start' })),
    [{ sub: '課本 Example 8.7：24 V 電源、電阻 R、1 H 電感、0.25 F 電容。t = 0 時開關打開。', on: 'ckt swc' },
     { sub: '課本把 R 換成 5 Ω、4 Ω、1 Ω，各算一次電容電壓。', off: 'swc', on: 'swo' },
     { sub: '畫出來：5 Ω、4 Ω 都平平地爬到 24 V……', off: 'ckt swo', on: 'gr c5 c4 l5 l4' },
     { sub: '1 Ω 卻<b>衝過頭、再晃回來</b>。只換一顆電阻，為什麼差這麼多？', on: 'c1 l1' }]);

  const A1 = sc('這一章要幹嘛', 'WHY THIS CHAPTER',
    ladder(8, { k: 'lad', km: 'me', hl: [7] }) +
    chip(230, 118, 'CH7：只有一個 L 或 C', '一路單調地變過去', 'c1', { fs: 14 }) +
    chip(470, 118, 'CH8：L、C 都有', '能量丟來丟去 → 可能振盪', 'c2', { fs: 14, acc: true }),
    [{ sub: '第 8 階。CH7 只有一個儲能元件，電壓一路單調地走到終點。', on: 'lad me lad-hl c1' },
     { sub: 'CH8 同時有 L 和 C：兩個儲能元件會<b>互相丟能量</b>，所以可能會晃。', on: 'c2' },
     { sub: '方程式變成二階微分方程，所以叫<b>二階電路</b>。', on: '' }]);

  const pend = '<g><line class="ln" style="stroke-width:2" x1="170" y1="110" x2="170" y2="240"/><circle class="acc" cx="170" cy="250" r="14"/>' +
    '<animateTransform attributeName="transform" type="rotate" values="32 170 110;-32 170 110;32 170 110" dur="2.4s" repeatCount="indefinite"/></g>';
  const A2 = sc('L 和 C：盪鞦韆', 'TRADING ENERGY',
    g('pd', '<line class="ln2" x1="110" y1="110" x2="230" y2="110"/>' + pend) +
    chip(460, 130, '電容 = 高度（位能）', '能量存在電壓', 'c1', { fs: 13.5 }) +
    chip(460, 195, '電感 = 速度（動能）', '能量存在電流', 'c2', { fs: 13.5 }) +
    chip(460, 260, '電阻 = 摩擦', '每晃一次就少一點', 'c3', { fs: 13.5, acc: true }),
    [{ sub: '想像盪鞦韆：最高點時速度 = 0、高度最大；最低點時高度最小、速度最快。', on: 'pd' },
     { sub: '電容就像「高度」：能量存在電壓。', on: 'c1' },
     { sub: '電感就像「速度」：能量存在電流。LC 電路裡，能量就在兩者之間丟來丟去。', on: 'c2' },
     { sub: '電阻像摩擦：每晃一次就吃掉一點能量。摩擦多大，決定會不會晃。', on: 'c3' }]);

  const A3 = sc('寫成方程式', 'THE EQUATION',
    calc(90, 108, 460, [['串聯 RLC 的 KVL，整理成：', 'r0', 'ts', 13], ['d<sup>2</sup>i/dt<sup>2</sup> + (R/L) di/dt + i/(LC) = 0', 'r1'], ['特徵方程：s<sup>2</sup> + 2αs + ω<sub>0</sub><sup>2</sup> = 0', 'r2', 'ta'],
      ['α = R / (2L)　　ω<sub>0</sub> = 1 / √(LC)', 'r3', 'ta'], ['s = −α ± √(α<sup>2</sup> − ω<sub>0</sub><sup>2</sup>)', 'r4']], { k: 'cc', a: 'middle', lh: 32 }),
    [{ sub: '串聯 RLC 繞一圈寫 KVL，微分一次，得到二階微分方程。', on: 'cc r0 r1' },
     { sub: '猜 i = Ae<sup>st</sup> 代進去，得到<b>特徵方程</b>（工數 ODE 的老朋友）。', on: 'r2' },
     { sub: '兩個關鍵數字：α（阻尼，摩擦多大）、ω<sub>0</sub>（自然頻率，不摩擦時晃多快）。', on: 'r3' },
     { sub: '根號裡面 α<sup>2</sup> − ω<sub>0</sub><sup>2</sup> 是正、零、還是負，決定一切。', on: 'r4' }]);

  const g3 = (fn, cls, key) => curve(fn, 330, 280, 220, 90, cls, key, 160);
  const A4 = sc('三種情況：關門器', 'THREE CASES',
    g('ax', D.arrow(326, 220, 620, 220, null, 'ln2') + D.arrow(330, 300, 330, 115, null, 'ln2')) +
    g3(t => Math.exp(-t * 3) * 1.0 + 0 * t, 'ln', 'o') + g3(t => (1 + t * 9) * Math.exp(-t * 9), 'ln dsh', 'cr') + g3(t => Math.exp(-t * 2.2) * Math.cos(t * 20), 'lna', 'u') +
    calc(30, 110, 285, [['α &gt; ω<sub>0</sub>：過阻尼（兩個實根）', 'r1'], ['　慢慢回去，不晃', 'r1b', 'tm'], ['α = ω<sub>0</sub>：臨界阻尼（重根）', 'r2'], ['　最快回去，剛好不晃', 'r2b', 'tm'],
      ['α &lt; ω<sub>0</sub>：欠阻尼（共軛複根）', 'r3', 'ta'], ['　晃著回去，ω<sub>d</sub> = √(ω<sub>0</sub><sup>2</sup> − α<sup>2</sup>)', 'r3b', 'ta']], { k: 'cc', lh: 29, fs: 13.5 }),
    [{ sub: '像門上的自動關門器。<b>油太濃</b>（α 大）：門慢慢關，不會晃 —— 過阻尼。', on: 'ax o cc r1 r1b' },
     { sub: '<b>剛剛好</b>（α = ω<sub>0</sub>）：最快關上又剛好不晃 —— 臨界阻尼。', on: 'cr r2 r2b' },
     { sub: '<b>油太稀</b>（α 小）：門砰一聲彈回來再晃幾下 —— 欠阻尼，特徵根是共軛複數。', on: 'u r3 r3b' }]);

  const A5 = sc('例題：判斷是哪一種', 'EXAMPLE 8.3',
    calc(110, 108, 420, [['課本 Example 8.3：R = 40 Ω、L = 4 H、C = 1/4 F', 'r0', 'ts', 13], ['α = 40 / (2 × 4) = 5', 'r1'], ['ω<sub>0</sub> = 1 / √(4 × 1/4) = 1', 'r2'],
      ['α &gt; ω<sub>0</sub> → 過阻尼', 'r3', 'ta'], ['s = −5 ± √24 = −0.101、−9.899', 'r4']], { k: 'cc', a: 'middle', lh: 32 }),
    [{ sub: '課本 Example 8.3：先算兩個數字。', on: 'cc r0 r1 r2' },
     { sub: 'α = 5 比 ω<sub>0</sub> = 1 大很多 → 過阻尼。', on: 'r3' },
     { sub: '兩個根都是負實數：答案是兩個指數衰減加起來。', on: 'r4' }]);

  const A6 = sc('先整理一下', 'SO FAR',
    calc(110, 110, 420, [['L、C 互相丟能量，R 是摩擦', 'r1'], ['s<sup>2</sup> + 2αs + ω<sub>0</sub><sup>2</sup> = 0', 'r2', 'ta'], ['串聯：α = R/(2L)，ω<sub>0</sub> = 1/√(LC)', 'r3'],
      ['α 比 ω<sub>0</sub>：大 → 過、等 → 臨界、小 → 欠', 'r4', 'ta'], ['小心：並聯的 α 不一樣', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '先整理一下。', on: 'cc r1 r2' },
     { sub: '只要算 α、ω<sub>0</sub> 比大小，就知道會不會晃。', on: 'r3 r4' },
     { sub: '但小心：並聯 RLC 的 α 公式不一樣。', on: 'r5' }]);

  const A7 = sc('並聯 RLC：α 換了', 'PARALLEL RLC',
    T(320, 140, '並聯也用 α = R/(2L)', { cls: 't', fs: 18, k: 'x0' }) + strike(210, 135, 430, 'x1') +
    T(320, 172, '並聯：α = 1/(2RC)', { cls: 'ta', fs: 18, k: 'o1' }) +
    T(320, 205, 'ω<sub>0</sub> = 1/√(LC) 一樣', { cls: 't', fs: 15, k: 'o2' }) +
    T(320, 250, '串聯 R 越大越不晃；並聯 R 越大越會晃', { cls: 'tm', fs: 14, k: 'o3' }),
    [{ sub: '最常見的錯：並聯 RLC 也套 α = R/(2L)。', on: 'x0' },
     { sub: '並聯要用 <b>α = 1/(2RC)</b>。ω<sub>0</sub> 一樣是 1/√(LC)。', on: 'x1 o1 o2' },
     { sub: '直覺：串聯時 R 越大摩擦越大；並聯時 R 越大，越少電流從它漏掉，反而越會晃。', on: 'o3' }]);

  const A8 = sc('解謎：三個 α', 'SOLVE THE PUZZLE',
    grid('gr') + resp(v5, 'ln', 'c5') + resp(v4, 'ln dsh', 'c4') + resp(v1, 'lna', 'c1') +
    '<line class="ln" x1="440" y1="112" x2="470" y2="112"/>' + T(478, 117, 'R = 5 Ω', { cls: 't', fs: 13, a: 'start' }) +
    '<line class="ln dsh" x1="440" y1="134" x2="470" y2="134"/>' + T(478, 139, 'R = 4 Ω', { cls: 't', fs: 13, a: 'start' }) +
    '<line class="lna" x1="440" y1="156" x2="470" y2="156"/>' + T(478, 161, 'R = 1 Ω', { cls: 'ta', fs: 13, a: 'start' }) +
    calc(300, 196, 320, [['ω<sub>0</sub> = 1/√(1 × 0.25) = 2', 'r0'], ['R = 5：α = 2.5 &gt; 2 → 過阻尼', 'r1'], ['R = 4：α = 2 = 2 → 臨界', 'r2'], ['R = 1：α = 0.5 &lt; 2 → 欠阻尼', 'r3', 'ta']], { k: 'cc', lh: 22, fs: 13 }),
    [{ sub: '回到謎題：L = 1 H、C = 0.25 F → ω<sub>0</sub> = 2，不管 R 是多少都一樣。', on: 'gr c5 c4 c1 cc r0' },
     { sub: 'α = R/2：R = 5 → 2.5，比 2 大 → 過阻尼。', on: 'r1' },
     { sub: 'R = 4 → α = 2，剛好相等 → 臨界阻尼。', on: 'r2' },
     { sub: 'R = 1 → α = 0.5，比 2 小 → <b>欠阻尼</b>：摩擦太小，所以衝過頭再晃回來。', on: 'r3' }]);

  const A9 = sc('PART 1 小結', 'PART 1 RECAP',
    calc(90, 106, 460, [['謎題：只換電阻，走法完全不同', 'r1', 'ta'], ['→ α 跟 ω<sub>0</sub> 比大小，決定晃不晃', 'r2'], ['→ 5 Ω 過、4 Ω 臨界、1 Ω 欠阻尼', 'r3'],
      ['還缺：1 Ω 那條到底衝到多高？', 'r4', 'tm'], ['→ PART 2：步階響應與初始條件', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：只換電阻，走法就不一樣。', on: 'cc r1' },
     { sub: '因為 α 跟 ω<sub>0</sub> 的大小關係變了。', on: 'r2 r3' },
     { sub: '可是 1 Ω 那條，到底衝到多高？', on: 'r4' },
     { sub: '往下看 PART 2：把曲線算出來。', on: 'r5' }]);

  __Story('#story', { id: 'cir-rv-ch8a', title: 'CH8 PART 1 三種阻尼', after: '#story2-sec', afterLabel: '接著看 PART 2 ↓', stamp: { no: 'CH8', name: '阻尼' },
    scenes: [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9] });

  /* ═══════════════ PART 2 ═══════════════ */
  const pk = [0.9417, 38.99];
  const B0 = sc('24 V 電源，衝到 39 V？', 'THE PUZZLE',
    grid('gr') + resp(v1, 'lna', 'c1') +
    g('pk', R.dot(tx(pk[0]), vy(pk[1])) + T(+tx(pk[0]) + 10, +vy(pk[1]) + 4, '≈ 39 V？', { cls: 'ta', fs: 15, a: 'start' })),
    [{ sub: 'PART 2：看 R = 1 Ω 那條。電源只有 24 V。', on: 'gr c1' },
     { sub: '電容電壓卻衝到大約 <b>39 V</b>，比電源還高！', on: 'pk' },
     { sub: '怎麼算出這條曲線？最高點又是怎麼來的？', on: '' }]);

  const B1 = sc('完整響應 = 終點 + 晃動', 'TOTAL RESPONSE',
    calc(90, 110, 460, [['v(t) = v<sub>ss</sub> + v<sub>n</sub>(t)', 'r1', 'ta', 18], ['v<sub>ss</sub>：終點（穩態，C 斷路、L 短路）', 'r2'], ['v<sub>n</sub>：PART 1 的三種樣子之一', 'r3'],
      ['裡面有兩個常數 A<sub>1</sub>、A<sub>2</sub>', 'r4', 'ta'], ['→ 需要兩個初始條件：v(0) 和 dv/dt(0)', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 32 }),
    [{ sub: '有電源時，答案 = <b>終點</b> + <b>自然響應</b>（晃動的部分）。', on: 'cc r1' },
     { sub: '終點跟 CH7 一樣：很久以後 C 斷路、L 短路。', on: 'r2' },
     { sub: '晃動的部分就是 PART 1 的三種樣子之一。', on: 'r3' },
     { sub: '跟 CH7 最大的不同：有<b>兩個</b>常數要定，所以要兩個初始條件。', on: 'r4 r5' }]);

  const B2 = sc('兩個初始條件怎麼找', 'TWO INITIAL CONDITIONS',
    calc(90, 108, 460, [['① v(0)、i(0)：切換前穩態，靠「不能跳」帶過來', 'r1'], ['② dv/dt(0) = i<sub>C</sub>(0) / C', 'r2', 'ta'], ['　di/dt(0) = v<sub>L</sub>(0) / L', 'r2b', 'ta'],
      ['課本 Example 8.1：i(0<sup>+</sup>) = 2 A、v(0<sup>+</sup>) = 4 V', 'r3', 'tm'], ['　dv/dt(0<sup>+</sup>) = 2 / 0.1 = 20 V/s', 'r3b', 'tm']], { k: 'cc', lh: 32 }),
    [{ sub: '第一個條件跟 CH7 一樣：電容電壓、電感電流不能跳。', on: 'cc r1' },
     { sub: '第二個是<b>斜率</b>：電容 i = C dv/dt 倒過來，dv/dt = i<sub>C</sub>/C；電感同理。', on: 'r2 r2b' },
     { sub: '課本 Example 8.1 就是在練這個：先找 0<sup>+</sup> 的電流，再除以 C 得到斜率。', on: 'r3 r3b' }]);

  const B3 = sc('R = 1 Ω：初始條件', 'INITIAL VALUES',
    fig('ckt', '1 Ω') +
    calc(452, 130, 172, [['t &lt; 0：C 斷路、L 短路', 'r0', 'tm', 12.5], ['i(0) = 24/(1 + 1) = 12 A', 'r1'], ['v(0) = 1 × 12 = 12 V', 'r2'], ['dv/dt(0) = 12/0.25', 'r3'], ['= 48 V/s', 'r3b', 'ta']], { k: 'cc', lh: 27, fs: 13 }),
    [{ sub: '開關打開前：C 斷路、L 短路，電流走 R → L → 1 Ω。', on: 'ckt swc cc r0', mv: { ckt: [-80, 8, 0.76] } },
     { sub: 'i(0) = 24/(1 + 1) = 12 A，電容電壓 = 1 Ω 上的電壓 = 12 V。', on: 'r1 r2' },
     { sub: '開關打開後，L 和 C 串在一起：電容電流 = 電感電流 = 12 A → 斜率 48 V/s。', off: 'swc', on: 'swo r3 r3b' }]);

  const B4 = sc('R = 1 Ω：解出常數', 'SOLVE THE CONSTANTS',
    calc(80, 108, 480, [['s = −0.5 ± j1.936（欠阻尼）', 'r1'], ['v = 24 + (A<sub>1</sub> cos 1.936t + A<sub>2</sub> sin 1.936t)e<sup>−0.5t</sup>', 'r2'], ['v(0) = 12 → A<sub>1</sub> = −12', 'r3'],
      ['dv/dt(0) = 48 = 1.936A<sub>2</sub> − 0.5A<sub>1</sub> → A<sub>2</sub> = 21.69', 'r4'], ['v = 24 + (21.69 sin 1.936t − 12 cos 1.936t)e<sup>−0.5t</sup>', 'r5', 'ta']], { k: 'cc', lh: 32 }),
    [{ sub: 'α = 0.5、ω<sub>0</sub> = 2：共軛複根 −0.5 ± j1.936，答案長成 cos、sin 乘上衰減。', on: 'cc r1 r2' },
     { sub: '用 v(0) = 12 V：A<sub>1</sub> = −12。', on: 'r3' },
     { sub: '用斜率 48 V/s：A<sub>2</sub> = 21.69。', on: 'r4' },
     { sub: '曲線就出來了。', on: 'r5' }]);

  const B5 = sc('最高點：衝過頭', 'OVERSHOOT',
    grid('gr') + resp(v1, 'lna', 'c1') +
    g('pk', R.dot(tx(pk[0]), vy(pk[1])) + T(+tx(pk[0]) + 10, +vy(pk[1]) + 4, '38.99 V（t ≈ 0.94 s）', { cls: 'ta', fs: 13.5, a: 'start' })) +
    chip(470, 250, '電感的電流還在推：像鞦韆盪過最低點', '', 'c1', { fs: 12.5 }),
    [{ sub: '畫出來：t ≈ 0.94 s 時最高，<b>38.99 V</b>。謎題解開！', on: 'gr c1 pk' },
     { sub: '為什麼能超過 24 V？電容充到 24 V 時，電感裡還有電流（有「速度」），停不下來，繼續把電荷推進電容。', on: 'c1' },
     { sub: '像鞦韆盪到最低點時速度最快，一定會衝到另一邊。之後被電阻慢慢磨掉，最後停在 24 V。', on: '' }]);

  const B6 = sc('常見的錯', 'COMMON MISTAKES',
    T(320, 140, '電容電壓不可能超過電源電壓', { cls: 't', fs: 17, k: 'x0' }) + strike(190, 135, 450, 'x1') +
    T(320, 170, '欠阻尼會衝過頭（overshoot）', { cls: 'ta', fs: 16, k: 'o1' }) +
    T(320, 220, '只用 v(0) 一個條件', { cls: 't', fs: 17, k: 'x2' }) + strike(230, 215, 410, 'x3') +
    T(320, 250, '二階有兩個常數：還要 dv/dt(0)', { cls: 'ta', fs: 16, k: 'o2' }),
    [{ sub: '錯誤一：以為電容電壓不會超過電源。', on: 'x0' },
     { sub: '欠阻尼一定會衝過頭。', on: 'x1 o1' },
     { sub: '錯誤二：只用一個初始條件。', on: 'x2' },
     { sub: '二階有 A<sub>1</sub>、A<sub>2</sub> 兩個常數，一定要兩個條件。', on: 'x3 o2' }]);

  const B7 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：24 V 電源，衝到 38.99 V', 'r1', 'ta'], ['→ 欠阻尼：電感的電流停不下來', 'r2'], ['→ 終點 + 晃動，兩個初始條件', 'r3'],
      ['還缺：電源一直在晃（交流）呢？', 'r4', 'tm'], ['→ CH9：相量，微分方程變乘除', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：24 V 電源，電容衝到 38.99 V。', on: 'cc r1' },
     { sub: '因為欠阻尼：電感的電流像鞦韆的速度，停不下來。', on: 'r2' },
     { sub: '解法：終點 + 晃動，用兩個初始條件定常數。', on: 'r3' },
     { sub: '還缺什麼？如果電源本身一直在晃（交流），每題都解二階微分方程太累了。', on: 'r4' },
     { sub: '下一章 CH9：相量。', on: 'r5' }]);

  __Story('#story2', { id: 'cir-rv-ch8b', title: 'CH8 PART 2 步階響應', after: '#sum', afterLabel: '看這章總結 ↓', stamp: { no: 'CH8', name: '步階' },
    scenes: [B0, B1, B2, B3, B4, B5, B6, B7] });
})();
