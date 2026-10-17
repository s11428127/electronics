/* ============================================================
   電路學 CH3 複習 —— 故事模式（分析方法 Methods of Analysis），兩段
   PART 1 節點分析（課本 Example 3.1、3.3 超節點）
     謎題：兩個電流源卡在中間，串並聯化簡不了 → v1、v2 = ?（答：13.333 V、20 V）
   PART 2 網目分析（課本 Example 3.5、3.7 超網目）
     謎題：中間那條有 10 Ω 和 10 V 電源，電流 I3 = ?（答：0 A）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__RV) return;
  const R = window.__RV, D = R.D;
  const { g, T, calc, sc, el, bat, batH, isrc, wire, dots, strike, ladder, loopA, f1 } = R;
  const { chip, arrow } = D;

  /* 橫的電流源（箭頭朝左 / 右） */
  const isrcH = (x, y, lbl, left, key) => g(key, '<path class="ln" d="M' + (x - 30) + ' ' + y + ' H' + (x - 16) + ' M' + (x + 16) + ' ' + y + ' H' + (x + 30) + '"/>' +
    '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="16"/>' + (left ? arrow(x + 9, y, x - 9, y, null, 'ln') : arrow(x - 9, y, x + 9, y, null, 'ln')) +
    (lbl ? T(x + 24, y - 6, lbl, { cls: 't', fs: 13, a: 'start' }) : ''));

  /* ── 課本 Fig 3.3（Example 3.1） ── */
  const N1 = 200, N2 = 440, YN = 152, YT = 112, YG = 285;
  const fig31 = k => g(k,
    wire('M' + N1 + ' ' + YN + ' V' + YT + ' H' + (320 - 30) + ' M' + (320 + 30) + ' ' + YT + ' H' + N2 + ' V' + YN) + isrcH(320, YT, '5 A', true) +
    el('r', N1, YN, N2, YN, '4 Ω', { side: 'b' }) +
    el('r', N1, YN, N1, YG, '2 Ω', { side: 'l' }) + el('r', N2, YN, N2, YG, '6 Ω') +
    wire('M' + N2 + ' ' + YN + ' H540 V' + (218 - 30) + ' M540 ' + (218 + 30) + ' V' + YG + ' H' + N1) + isrc(540, 218, '10 A', { side: 'r' }) +
    R.dot(N1, YN) + R.dot(N2, YN) + R.dot(N2, YG) + R.dot(N1 + 120, YG) + R.gnd(N1 + 120, YG + 12));
  const nlab = k => g(k, T(N1 - 8, YN - 8, 'v<sub>1</sub>', { cls: 'ta', fs: 15, a: 'end' }) + T(N2 + 8, YN - 8, 'v<sub>2</sub>', { cls: 'ta', fs: 15, a: 'start' }));

  /* ── 課本 Fig 3.9（Example 3.3 超節點） ── */
  const fig33 = k => g(k,
    wire('M100 ' + (218 - 30) + ' V' + YN + ' H' + N1 + ' M100 ' + (218 + 30) + ' V' + YG + ' H540') + isrc(100, 218, '2 A', {}) +
    el('r', N1, YN, N1, YG, '2 Ω', { side: 'l' }) +
    wire('M' + N1 + ' ' + YN + ' H' + (320 - 30) + ' M' + (320 + 30) + ' ' + YN + ' H' + N2) + batH(320, YN, '2 V', { plusRight: true }) +
    wire('M' + N1 + ' ' + YN + ' V' + YT + ' M' + N2 + ' ' + YN + ' V' + YT) + el('r', N1, YT, N2, YT, '10 Ω') +
    el('r', N2, YN, N2, YG, '4 Ω') +
    wire('M' + N2 + ' ' + YN + ' H540 V' + (218 - 30) + ' M540 ' + (218 + 30) + ' V' + YG) + isrc(540, 218, '7 A', { side: 'r', down: true }) +
    R.dot(N1, YN) + R.dot(N2, YN) + R.dot(N1, YG) + R.dot(N2, YG));

  /* ═══════════════ PART 1 節點分析 ═══════════════ */
  const A0 = sc('化簡不了的電路', 'THE PUZZLE',
    fig31('ckt') + nlab('nl') +
    chip(560, 120, 'v<sub>1</sub> = ?　v<sub>2</sub> = ?', '', 'q', { fs: 15, acc: true }),
    [{ sub: '課本 Example 3.1：兩個電流源、三個電阻。', on: 'ckt' },
     { sub: 'CH2 的串聯、並聯在這裡用不太上：電流源卡在中間，化簡不下去。', on: '' },
     { sub: '題目要上面兩個點的電壓 v<sub>1</sub>、v<sub>2</sub>。怎麼辦？', on: 'nl q' }]);

  const A1 = sc('這一章要幹嘛', 'WHY THIS CHAPTER',
    ladder(3, { k: 'lad', km: 'me', hl: [2] }) +
    chip(230, 118, 'CH2：串並聯化簡', '電路一亂就卡住', 'c1', { fs: 14 }) +
    chip(470, 118, 'CH3：一套固定步驟', '不管多亂都能解', 'c2', { fs: 14, acc: true }),
    [{ sub: '第 3 階。CH2 的化簡很好用，可是電路一亂就卡住。', on: 'lad me lad-hl c1' },
     { sub: 'CH3 給你兩套<b>固定步驟</b>：節點分析、網目分析。照做一定解得出來。', on: 'c2' },
     { sub: '之後 CH10 的交流電路，也是用同一套。', on: '' }]);

  const A2 = sc('想法：每個節點標一個「高度」', 'NODE VOLTAGES',
    fig31('ckt') + nlab('nl') +
    T(N1 + 150, YG - 8, '0 V（參考點）', { cls: 'ta', fs: 13, a: 'start', k: 'gl' }) +
    chip(560, 120, '像地圖上標海拔', '水流量 = 高度差 / 阻力', 'c1', { fs: 13 }),
    [{ sub: '先選一個點當<b>參考點</b>（接地），規定它是 0 V。通常選接最多東西的那個。', on: 'ckt gl' },
     { sub: '其他每個節點標一個電壓 v<sub>1</sub>、v<sub>2</sub>：就是它比參考點高多少。', on: 'nl' },
     { sub: '像地圖上每個點標海拔。電阻上的電流 = 兩端高度差 / 電阻：i = (v<sub>a</sub> − v<sub>b</sub>)/R。', on: 'c1' }]);

  const A3 = sc('節點分析：四步', 'THE RECIPE',
    calc(110, 110, 420, [['① 選參考點（0 V）', 'r1'], ['② 其他節點標 v<sub>1</sub>、v<sub>2</sub>…（n − 1 個未知數）', 'r2'], ['③ 每個節點寫 KCL：流進 = 流出', 'r3'],
      ['　電阻的電流一律寫成 (v<sub>a</sub> − v<sub>b</sub>)/R', 'r4', 'ta'], ['④ 解聯立方程式', 'r5']], { k: 'cc', lh: 31 }),
    [{ sub: '節點分析只有四步。', on: 'cc r1 r2' },
     { sub: '第三步是重點：每個節點寫 KCL，電流全部用節點電壓表示。', on: 'r3 r4' },
     { sub: 'n 個節點就有 n − 1 條方程式。最後解聯立。', on: 'r5' }]);

  const A4 = sc('節點 1 的 KCL', 'KCL AT NODE 1',
    g('all', fig31() + nlab() + '<circle class="ring" style="stroke-width:2.6" cx="' + N1 + '" cy="' + YN + '" r="14"/>') +
    calc(452, 150, 175, [['5 = (v<sub>1</sub>−v<sub>2</sub>)/4 + v<sub>1</sub>/2', 'r1'], ['3v<sub>1</sub> − v<sub>2</sub> = 20', 'r2', 'ta']], { k: 'cc', lh: 30 }),
    [{ sub: '看節點 1：上面的電流源送 5 A 進來。', on: 'all', mv: { all: [-95, 6, 0.78] } },
     { sub: '出去的有兩條：往右經過 4 Ω、往下經過 2 Ω。流進 = 流出。', on: 'cc r1' },
     { sub: '整理一下（乘 4）：3v<sub>1</sub> − v<sub>2</sub> = 20。', on: 'r2' }]);

  const A5 = sc('節點 2 的 KCL', 'KCL AT NODE 2',
    g('all', fig31() + nlab() + '<circle class="ring" style="stroke-width:2.6" cx="' + N2 + '" cy="' + YN + '" r="14"/>') +
    calc(452, 150, 175, [['(v<sub>1</sub>−v<sub>2</sub>)/4 + 10', 'r1'], ['　= 5 + v<sub>2</sub>/6', 'r1b'], ['−3v<sub>1</sub> + 5v<sub>2</sub> = 60', 'r2', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '節點 2：流進來的有 4 Ω 那條、還有 10 A 電流源。', on: 'all cc r1', mv: { all: [-95, 6, 0.78] } },
     { sub: '流出去的：上面的 5 A 電流源、往下的 6 Ω。', on: 'r1b' },
     { sub: '整理（乘 12）：−3v<sub>1</sub> + 5v<sub>2</sub> = 60。', on: 'r2' }]);

  const A6 = sc('解聯立', 'SOLVE',
    calc(110, 108, 420, [['3v<sub>1</sub> − v<sub>2</sub> = 20', 'r1'], ['−3v<sub>1</sub> + 5v<sub>2</sub> = 60', 'r2'], ['兩式相加：4v<sub>2</sub> = 80 → v<sub>2</sub> = 20 V', 'r3', 'ta'],
      ['代回去：v<sub>1</sub> = 40/3 = 13.333 V', 'r4', 'ta'], ['或用克拉瑪：Δ = 15 − 3 = 12', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '兩條方程式、兩個未知數。', on: 'cc r1 r2' },
     { sub: '兩式相加，v<sub>1</sub> 消掉：v<sub>2</sub> = <b>20 V</b>。', on: 'r3' },
     { sub: '代回第一式：v<sub>1</sub> = <b>13.333 V</b>。謎題解開！', on: 'r4' },
     { sub: '未知數多的時候用矩陣、克拉瑪公式（或計算機的聯立功能）。', on: 'r5' }]);

  const A7 = sc('先整理一下', 'SO FAR',
    calc(110, 110, 420, [['節點分析：未知數 = 節點電壓', 'r1'], ['n 個節點 → n − 1 條 KCL', 'r2'], ['電流一律寫 (v<sub>a</sub> − v<sub>b</sub>)/R', 'r3'],
      ['電流源：電流直接寫進去', 'r4', 'ta'], ['那電壓源呢？它的電流不知道……', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 31 }),
    [{ sub: '先整理一下：節點分析 = 每個節點寫 KCL。', on: 'cc r1 r2 r3' },
     { sub: '電流源最好處理：電流已知，直接寫進去。', on: 'r4' },
     { sub: '麻煩的是<b>電壓源</b>：流過它的電流不知道，KCL 寫不下去。', on: 'r5' }]);

  const A8 = sc('電壓源卡在兩個節點之間', 'THE SUPERNODE',
    fig33('ckt') + nlab('nl') +
    g('sn', '<rect class="lna dsh" style="fill:none;stroke-width:2" x="' + (N1 - 22) + '" y="' + (YT - 22) + '" width="' + (N2 - N1 + 44) + '" height="' + (YN - YT + 44) + '" rx="18"/>') +
    T(320, 205, '超節點', { cls: 'ta', fs: 15, k: 'snl' }) +
    chip(320, 252, '把兩個節點圈成一個大節點', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '課本 Example 3.3：一顆 2 V 電壓源直接接在節點 1、2 之間。', on: 'ckt nl' },
     { sub: '流過電壓源的電流不知道，節點 1、2 的 KCL 都寫不出來。', on: '' },
     { sub: '解法：把兩個節點連同電壓源<b>圈成一個大節點</b>，叫<b>超節點</b>。', on: 'sn snl c1' },
     { sub: '對整個圈圈寫 KCL —— 電壓源的電流在圈圈裡面，不用管它。', on: '' }]);

  const A9 = sc('超節點：一條 KCL ＋ 一條限制', 'SOLVE THE SUPERNODE',
    g('all', fig33() + nlab() + '<rect class="lna dsh" style="fill:none;stroke-width:2" x="' + (N1 - 22) + '" y="' + (YT - 22) + '" width="' + (N2 - N1 + 44) + '" height="' + (YN - YT + 44) + '" rx="18"/>') +
    calc(445, 140, 185, [['KCL：2 = v<sub>1</sub>/2 + v<sub>2</sub>/4 + 7', 'r1'], ['限制：v<sub>2</sub> = v<sub>1</sub> + 2', 'r2'], ['v<sub>1</sub> = −7.333 V', 'r3', 'ta'], ['v<sub>2</sub> = −5.333 V', 'r3b', 'ta']], { k: 'cc', lh: 28 }),
    [{ sub: '圈圈的 KCL：2 A 流進來；流出去的有 2 Ω、4 Ω、7 A。', on: 'all cc r1', mv: { all: [-100, 6, 0.76] } },
     { sub: '再加一條<b>限制式</b>：電壓源規定兩個節點差 2 V。', on: 'r2' },
     { sub: '兩條聯立：v<sub>1</sub> = −7.333 V、v<sub>2</sub> = −5.333 V。', on: 'r3 r3b' },
     { sub: '注意：跟電壓源並聯的 10 Ω 完全沒用到 —— 它兩端的電壓已經被電壓源定死了。', on: '' }]);

  const A10 = sc('常見的錯', 'COMMON MISTAKE',
    T(320, 150, '超節點：寫一條 KCL 就好', { cls: 't', fs: 18, k: 'x0' }) + strike(200, 144, 440, 'x1') +
    T(320, 190, '還要一條：電壓源的限制式', { cls: 'ta', fs: 17, k: 'o1' }) +
    T(320, 222, '兩個未知數，就要兩條方程式', { cls: 'tm', fs: 14, k: 'o2' }),
    [{ sub: '最常見的錯：圈了超節點，只寫一條 KCL。', on: 'x0' },
     { sub: '不夠！兩個未知數要兩條方程式。另一條就是電壓源給的：v<sub>2</sub> − v<sub>1</sub> = 2。', on: 'x1 o1 o2' }]);

  const A11 = sc('PART 1 小結', 'PART 1 RECAP',
    calc(90, 106, 460, [['謎題：v<sub>1</sub> = 13.333 V、v<sub>2</sub> = 20 V', 'r1', 'ta'], ['→ 每個節點寫 KCL，電流用電壓差 / R', 'r2'], ['→ 電壓源：超節點 ＋ 限制式', 'r3'],
      ['換個角度：不標電壓，改標電流？', 'r4', 'tm'], ['→ PART 2：網目分析', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題解開：v<sub>1</sub> = 13.333 V、v<sub>2</sub> = 20 V。', on: 'cc r1' },
     { sub: '靠的是每個節點寫 KCL。', on: 'r2' },
     { sub: '電壓源就用超節點。', on: 'r3' },
     { sub: '換個角度：如果不標電壓、改成每個「窗格」標一個電流呢？', on: 'r4' },
     { sub: '往下看 PART 2：網目分析。', on: 'r5' }]);

  __Story('#story', { id: 'cir-rv-ch3a', title: 'CH3 PART 1 節點分析', after: '#story2-sec', afterLabel: '接著看 PART 2 ↓', stamp: { no: 'CH3', name: '節點' },
    scenes: [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11] });

  /* ═══════════════ PART 2 網目分析 ═══════════════ */
  /* 課本 Fig 3.18（Example 3.5） */
  const XL = 110, XM = 320, XR = 530, YU = 130, YD = 285;
  const fig35 = (k, hl) => g(k,
    bat(XL, 207, '15 V') + wire('M' + XL + ' ' + (207 - 30) + ' V' + YU + ' M' + XL + ' ' + (207 + 30) + ' V' + YD + ' H' + XR) +
    el('r', XL, YU, XM, YU, '5 Ω') + el('r', XM, YU, XR, YU, '6 Ω') +
    el('r', XM, YU, XM, 200, '10 Ω', { side: 'l', hl }) + wire('M' + XM + ' 200 V' + (240 - 30) + ' M' + XM + ' ' + (240 + 30) + ' V' + YD) + bat(XM, 240, '10 V', { side: 'r' }) +
    el('r', XR, YU, XR, YD, '4 Ω') + R.dot(XM, YU) + R.dot(XM, YD));

  const B0 = sc('中間那條的電流', 'THE PUZZLE',
    fig35('ckt') +
    chip(XM, 108, 'I<sub>3</sub> = ?', '', 'q', { fs: 15, acc: true }) +
    g('i3', arrow(XM + 16, 150, XM + 16, 178, null, 'lna')),
    [{ sub: 'PART 2，課本 Example 3.5：兩個電源、四個電阻。', on: 'ckt' },
     { sub: '中間那條有 10 Ω 電阻，還有一顆 10 V 電源。', on: '' },
     { sub: '問：中間那條的電流 I<sub>3</sub> 是多少？答案會讓你嚇一跳。', on: 'q i3' }]);

  const B1 = sc('網目 = 窗格', 'MESHES',
    g('w1', '<rect class="accw" x="' + (XL + 12) + '" y="' + (YU + 12) + '" width="' + (XM - XL - 24) + '" height="' + (YD - YU - 24) + '" rx="8" style="opacity:.8"/>') +
    g('w2', '<rect class="accw" x="' + (XM + 12) + '" y="' + (YU + 12) + '" width="' + (XR - XM - 24) + '" height="' + (YD - YU - 24) + '" rx="8" style="opacity:.8"/>') + fig35('ckt') +
    chip(580, 108, '像窗戶的格子', '', 'c1', { fs: 13 }),
    [{ sub: '把電路看成一扇窗戶：線把平面切成一格一格。', on: 'ckt' },
     { sub: '每一格裡面沒有別的線穿過，這樣的迴路叫<b>網目</b>。', on: 'w1 w2 c1' },
     { sub: '這個電路有兩格 → 兩個網目。', on: '' }]);

  const B2 = sc('每一格一個繞圈的電流', 'MESH CURRENTS',
    fig35('ckt', true) + loopA(215, 207, 38, 'i<sub>1</sub>', 'l1') + loopA(425, 207, 38, 'i<sub>2</sub>', 'l2') +
    chip(XM, 108, '中間那條：i<sub>1</sub> − i<sub>2</sub>', '', 'c1', { fs: 14, acc: true }),
    [{ sub: '每一格假設一個<b>順時針</b>繞圈的電流：i<sub>1</sub>、i<sub>2</sub>。', on: 'ckt l1 l2' },
     { sub: '外圍的元件只被一個網目電流經過。', on: '' },
     { sub: '中間那條被兩個網目<b>共用</b>：i<sub>1</sub> 往下、i<sub>2</sub> 往上 → 實際電流是 i<sub>1</sub> − i<sub>2</sub>。', on: 'c1' }]);

  const B3 = sc('網目分析：四步', 'THE RECIPE',
    calc(110, 110, 420, [['① 每一格畫一個順時針電流 i<sub>1</sub>、i<sub>2</sub>…', 'r1'], ['② 每一格繞一圈寫 KVL', 'r2'], ['③ 共用的元件用電流差：i<sub>1</sub> − i<sub>2</sub>', 'r3', 'ta'], ['④ 解聯立方程式', 'r4']], { k: 'cc', lh: 32 }),
    [{ sub: '網目分析跟節點分析剛好對稱：', on: 'cc r1' },
     { sub: '節點分析每個節點寫 KCL；網目分析<b>每一格寫 KVL</b>。', on: 'r2' },
     { sub: '重點：共用的元件用電流差。', on: 'r3 r4' }]);

  const B4 = sc('兩格各寫一條 KVL', 'KVL FOR EACH MESH',
    fig35('ckt') + loopA(215, 207, 38, 'i<sub>1</sub>', 'l1') + loopA(425, 207, 38, 'i<sub>2</sub>', 'l2') +
    chip(172, 108, '−15 + 5i<sub>1</sub> + 10(i<sub>1</sub>−i<sub>2</sub>) + 10 = 0', '', 'e1', { fs: 12.5 }) +
    chip(472, 108, '6i<sub>2</sub> + 4i<sub>2</sub> + 10(i<sub>2</sub>−i<sub>1</sub>) − 10 = 0', '', 'e2', { fs: 12.5 }),
    [{ sub: '網目 1 從左下開始繞：經過 15 V 是升壓（−15），5 Ω、10 Ω 降壓，10 V 從 + 進去也是降壓。', on: 'ckt l1 e1' },
     { sub: '網目 2：6 Ω、4 Ω 降壓，中間 10 Ω 用 i<sub>2</sub> − i<sub>1</sub>，10 V 從 − 進去是升壓。', on: 'l2 e2' },
     { sub: '整理：3i<sub>1</sub> − 2i<sub>2</sub> = 1、i<sub>1</sub> = 2i<sub>2</sub> − 1。', on: '' }]);

  const B5 = sc('解出來：中間是 0', 'THE ANSWER IS ZERO',
    fig35('ckt', true) + loopA(215, 207, 38, 'i<sub>1</sub>', 'l1') + loopA(425, 207, 38, 'i<sub>2</sub>', 'l2') +
    chip(215, 108, 'i<sub>1</sub> = 1 A', '', 'a1', { fs: 14 }) + chip(470, 108, 'i<sub>2</sub> = 1 A', '', 'a2', { fs: 14 }) +
    chip(XM, 108, 'I<sub>3</sub> = i<sub>1</sub> − i<sub>2</sub> = 0', '', 'a3', { fs: 14.5, acc: true }),
    [{ sub: '代入解出：i<sub>1</sub> = 1 A、i<sub>2</sub> = 1 A。', on: 'ckt l1 l2 a1 a2' },
     { sub: '中間那條：I<sub>3</sub> = i<sub>1</sub> − i<sub>2</sub> = <b>0</b>！', off: 'a1 a2', on: 'a3' },
     { sub: '為什麼？左邊 15 V 經過 5 Ω 降 5 V，剩 10 V —— 剛好跟中間的 10 V 電源打平，兩邊推不動。', on: '' }]);

  /* 超網目：中間換成電流源 */
  const B6 = sc('電流源卡在兩格之間', 'THE SUPERMESH',
    g('ck', bat(XL, 207, '') + wire('M' + XL + ' ' + (207 - 30) + ' V' + YU + ' H' + XR + ' V' + YD + ' H' + XL + ' V' + (207 + 30)) +
      wire('M' + XM + ' ' + YU + ' V' + (207 - 30) + ' M' + XM + ' ' + (207 + 30) + ' V' + YD) + isrc(XM, 207, '5 A', { side: 'r' }) + R.dot(XM, YU) + R.dot(XM, YD)) +
    loopA(215, 207, 34, 'i<sub>1</sub>', 'l1') + loopA(425, 207, 34, 'i<sub>2</sub>', 'l2') +
    g('sm', '<rect class="lna dsh" style="fill:none;stroke-width:2" x="' + (XL + 14) + '" y="' + (YU + 14) + '" width="' + (XR - XL - 28) + '" height="' + (YD - YU - 28) + '" rx="16"/>') +
    chip(XM, 108, '外圍 KVL ＋ 限制：i<sub>2</sub> − i<sub>1</sub> = 5', '', 'c1', { fs: 13.5, acc: true }),
    [{ sub: '反過來的麻煩：中間那條是<b>電流源</b>。它兩端的電壓不知道，KVL 寫不下去。', on: 'ck l1 l2' },
     { sub: '解法：把兩格合起來，沿著<b>外圍</b>繞一圈寫 KVL，叫<b>超網目</b>。', on: 'sm' },
     { sub: '再加一條限制式：電流源規定兩格電流差多少（課本 Example 3.7：i<sub>2</sub> = i<sub>1</sub> + 5）。', on: 'c1' },
     { sub: '跟超節點完全對稱：一條方程式不夠，補一條電源給的限制。', on: '' }]);

  const B7 = sc('節點還是網目？', 'NODAL OR MESH?',
    calc(60, 108, 520, [['比一比：哪個方程式比較少？', 'r1', 'ta'], ['電流源多、節點少 → 節點分析', 'r2'], ['電壓源多、網目少 → 網目分析', 'r3'], ['要求電壓 → 節點；要求電流 → 網目', 'r4', 'tm']], { k: 'cc', lh: 28 }) +
    T(320, 268, '共用電阻的電流 = i<sub>1</sub>', { cls: 't', fs: 16, k: 'x0' }) + strike(220, 263, 420, 'x1') +
    T(320, 294, '共用的元件要用 i<sub>1</sub> − i<sub>2</sub>', { cls: 'ta', fs: 15, k: 'o1' }),
    [{ sub: '兩套方法都一定解得出來。選方程式比較少的那套。', on: 'cc r1' },
     { sub: '電流源多 → 節點分析；電壓源多 → 網目分析。', on: 'r2 r3' },
     { sub: '題目要電壓就先想節點，要電流就先想網目。', on: 'r4' },
     { sub: '網目分析最常見的錯：共用的元件只寫自己那格的電流。', on: 'x0' },
     { sub: '要用電流差！', on: 'x1 o1' }]);

  const B8 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['謎題：中間 I<sub>3</sub> = 0', 'r1', 'ta'], ['→ 每格一個網目電流，共用的元件用差', 'r2'], ['→ 電流源：超網目 ＋ 限制式', 'r3'],
      ['還缺：只想知道一個元件，也要全部解？', 'r4', 'tm'], ['→ CH4：重疊、戴維寧，把電路縮小', 'r5', 'ta']], { k: 'cc', a: 'middle', lh: 29 }),
    [{ sub: '謎題：中間那條的電流是 0。', on: 'cc r1' },
     { sub: '靠的是網目分析：每格寫 KVL。', on: 'r2' },
     { sub: '電流源就用超網目。', on: 'r3' },
     { sub: '還缺什麼？只想知道一個元件，卻要把整個電路解完，好浪費。', on: 'r4' },
     { sub: '下一章 CH4：把電路縮小的定理。', on: 'r5' }]);

  __Story('#story2', { id: 'cir-rv-ch3b', title: 'CH3 PART 2 網目分析', after: '#sum', afterLabel: '看這章總結 ↓', stamp: { no: 'CH3', name: '網目' },
    scenes: [B0, B1, B2, B3, B4, B5, B6, B7, B8] });
})();
