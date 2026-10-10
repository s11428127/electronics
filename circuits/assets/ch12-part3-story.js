/* ============================================================
   電路學 CH12 PART 3 —— 故事模式（12.7 平衡三相功率、12.8 不平衡系統）
   謎題：三相馬達每一相吃的功率一秒變 120 次，馬達卻轉得穩穩的？
         （後半）家裡負載不平衡（Example 12.9）：中性線上竟然有 10.06 A。
   答案：三相功率的起伏錯開 120°，加起來 = 3VpIp cos θ 常數；不平衡時三個電流不再抵消。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12) return;
  const K = window.__K12, D = K.D;
  const { g, T, calc, ph, sys3, tri, sc } = K;
  const { chip } = D;
  const RAD = Math.PI / 180;
  const f1 = x => Math.round(x * 10) / 10;
  const curve = (fn, x0, w, y0, h, cls, key) => {
    let d = '';
    for (let i = 0; i <= 140; i++) { const t = i / 140; d += (i ? ' L' : 'M') + f1(x0 + t * w) + ' ' + f1(y0 - h * fn(t)); }
    return '<path class="' + (cls || 'lna') + '" style="fill:none" d="' + d + '"' + (key ? ' data-k="' + key + '"' : '') + '/>';
  };
  const th = 30 * RAD;
  const pk = k => t => (Math.cos(th) + Math.cos(2 * Math.PI * 3 * t - th - k * 240 * RAD)) / 3.2;

  /* 00 謎題 */
  const S0 = sc('穩穩轉的馬達', 'THE PUZZLE',
    '<line class="ln2" x1="70" y1="260" x2="400" y2="260"/>' +
    curve(pk(0), 70, 330, 260, 120, 'lna', 'w1') + curve(pk(1), 70, 330, 260, 120, 'ln', 'w2') + curve(pk(2), 70, 330, 260, 120, 'ln dsh', 'w3') +
    g('mot', '<rect class="bgw" x="470" y="160" width="100" height="80" rx="14"/>' + T(520, 210, 'M', { fs: 30 })) +
    T(520, 270, '轉得很穩', { cls: 'ta', fs: 15, k: 'ok' }) +
    T(235, 120, '每一相的功率：一秒起伏 120 次', { cls: 'tm', fs: 13, k: 'lb' }) +
    T(320, 300, '？', { cls: 'ta', fs: 40, k: 'q' }),
    [{ sub: '三相馬達的 a 相：吃到的功率一秒起伏 120 次（60 Hz 的兩倍）。', on: 'w1 lb' },
     { sub: 'b 相、c 相也一樣在起伏。', on: 'w2 w3' },
     { sub: '可是三相馬達轉起來<b>穩穩的</b>，不像單相那樣一抖一抖。', on: 'mot ok' },
     { sub: '三個都在晃，合起來怎麼不晃？', on: 'q' }]);

  /* 01 複習 */
  const S1 = sc('先複習 CH11 的功率', 'RECAP OF CH11',
    tri(90, 285, 4, 3, 40, { kp: 'p', kq: 'q', ks: 's', lp: 'P（W）', lq: 'Q（VAR）', ls: '|S|（VA）' }) +
    calc(340, 120, 270, [['P = V I cos θ（真的用掉）', 'r1'], ['Q = V I sin θ（來回搬）', 'r2'], ['S = V I* = P + jQ', 'r3', 'ta'], ['θ = 阻抗角', 'r4', 'tm']], { k: 'cc' }),
    [{ sub: 'CH11 的功率三角形：底是實功率 P。', on: 'p cc r1' },
     { sub: '高是虛功率 Q，斜邊是視在功率 |S|。', on: 'q s r2' },
     { sub: '打包成複數 S = V I*；θ 是阻抗角。這一頁全部直接拿來用。', on: 'r3 r4' }]);

  /* 02 一相的 p(t) */
  const S2 = sc('一相的瞬時功率', 'ONE PHASE',
    '<line class="ln2" x1="70" y1="250" x2="570" y2="250"/>' + T(64, 254, '0', { cls: 'ts', fs: 12, a: 'end' }) +
    curve(t => (Math.cos(th) + Math.cos(2 * Math.PI * 3 * t - th)) * 0.62, 70, 500, 250, 80, 'lna', 'w') +
    g('avg', '<line class="ln dsh" x1="70" y1="' + f1(250 - Math.cos(th) * 0.62 * 80) + '" x2="570" y2="' + f1(250 - Math.cos(th) * 0.62 * 80) + '"/>' + T(575, 250 - Math.cos(th) * 0.62 * 80 + 4, '平均 P', { cls: 't', fs: 12, a: 'end' })) +
    chip(320, 125, 'p = V<sub>p</sub>I<sub>p</sub>[cos θ + cos(2ωt − θ)]', '一個常數 ＋ 一個 2ω 的起伏', 'c', { fs: 13.5 }),
    [{ sub: '先看一相：瞬時功率 = 一個<b>常數</b>（平均功率）加一個 <b>2ω 的起伏</b>。', on: 'w c' },
     { sub: '平均是 V<sub>p</sub>I<sub>p</sub>cos θ，上下晃的幅度也是 V<sub>p</sub>I<sub>p</sub>。', on: 'avg' }]);

  /* 03 三相 */
  const S3s = sc('三相的起伏錯開', 'THREE PHASES',
    '<line class="ln2" x1="70" y1="270" x2="570" y2="270"/>' +
    curve(pk(0), 70, 500, 270, 130, 'lna', 'w1') + curve(pk(1), 70, 500, 270, 130, 'ln', 'w2') + curve(pk(2), 70, 500, 270, 130, 'ln dsh', 'w3') +
    chip(320, 120, '起伏在 2ωt 上差 240°（= 差 120°）', '', 'c', { fs: 13.5, acc: true }),
    [{ sub: 'a 相的起伏。', on: 'w1' },
     { sub: 'b、c 相：電壓、電流各晚 120°，起伏也跟著錯開。', on: 'w2 w3 c' },
     { sub: '三個一樣大、平均錯開的起伏…有沒有覺得很眼熟？', on: '' }]);

  /* 04 加起來 */
  const S4 = sc('加起來：一條水平線', 'THEY ADD TO A CONSTANT',
    '<line class="ln2" x1="70" y1="280" x2="570" y2="280"/>' +
    curve(pk(0), 70, 500, 280, 110, 'ln2', 'w1') + curve(pk(1), 70, 500, 280, 110, 'ln2', 'w2') + curve(pk(2), 70, 500, 280, 110, 'ln2', 'w3') +
    g('sum', '<line class="lna" style="stroke-width:4" x1="70" y1="' + f1(280 - 3 * Math.cos(th) / 3.2 * 110) + '" x2="570" y2="' + f1(280 - 3 * Math.cos(th) / 3.2 * 110) + '"/>') +
    calc(170, 108, 300, [['p = 3V<sub>p</sub>I<sub>p</sub>cos θ', 'r1', 'ta']], { k: 'cc', a: 'middle' }),
    [{ sub: '跟 PART 1「三個電壓加起來 = 0」一樣：三個起伏加起來剛好抵消。', on: 'w1 w2 w3' },
     { sub: '只剩三個常數：<b>p = 3V<sub>p</sub>I<sub>p</sub>cos θ</b> —— 一條水平線！', on: 'sum cc r1' },
     { sub: '就像三個人輪流踩腳踏車：總力道一直一樣。謎題一解開。', on: '' }]);

  /* 05 整理 */
  const S5 = sc('先整理一下', 'SO FAR',
    calc(110, 108, 420, [['總瞬時功率 = 常數（= 平均功率）', 'r1', 'ta'], ['P = 3P<sub>p</sub> = 3V<sub>p</sub>I<sub>p</sub>cos θ', 'r2'], ['Q = 3V<sub>p</sub>I<sub>p</sub>sin θ', 'r3'], ['S = 3V<sub>p</sub>I<sub>p</sub>* = 3I<sub>p</sub>²Z<sub>p</sub>', 'r4']], { k: 'cc', a: 'middle' }),
    [{ sub: '平衡三相：瞬時功率是常數。', on: 'cc r1' },
     { sub: '每相的 P、Q、S 跟 CH11 一模一樣，總共乘 3 就好。', on: 'r2 r3 r4' }]);

  /* 06 線值 */
  const S6 = sc('換成線電壓、線電流', 'IN LINE QUANTITIES',
    chip(180, 140, 'Y 接', 'V<sub>p</sub> = V<sub>L</sub>/√3，I<sub>p</sub> = I<sub>L</sub>', 'c1', { fs: 15 }) +
    chip(460, 140, 'Δ 接', 'V<sub>p</sub> = V<sub>L</sub>，I<sub>p</sub> = I<sub>L</sub>/√3', 'c2', { fs: 15 }) +
    calc(150, 196, 340, [['3 × V<sub>L</sub>I<sub>L</sub>/√3 = √3 V<sub>L</sub>I<sub>L</sub>', 'r1'], ['P = √3 V<sub>L</sub>I<sub>L</sub>cos θ（Y、Δ 通用）', 'r2', 'ta']], { k: 'cc', a: 'middle' }),
    [{ sub: '電表量到的通常是線電壓、線電流。', on: '' },
     { sub: 'Y 接：電壓差 √3。Δ 接：電流差 √3。', on: 'c1 c2' },
     { sub: '兩種都剛好消掉一個 √3：<b>P = √3 V<sub>L</sub>I<sub>L</sub>cos θ</b>。', on: 'cc r1 r2' }]);

  /* 07 θ */
  const S7 = sc('θ 是哪一個角？', 'WHICH ANGLE?',
    ph(190, 210, 80, [{ a: 0, l: 'V<sub>AN</sub>', c: 'ln', k: 'v' }, { a: -36.87, m: 0.7, l: 'I<sub>a</sub>', k: 'i' }, { a: 30, m: 1.3, l: 'V<sub>AB</sub>', c: 'ln dsh', k: 'vl' }], { k: 'ax', ax: 115 }) +
    calc(360, 120, 255, [['θ = 阻抗角', 'r1', 'ta'], ['= V<sub>AN</sub> 和 I<sub>a</sub> 的夾角', 'r2'], ['不是 V<sub>AB</sub> 和 I<sub>a</sub>', 'r3', 'tm'], ['（那個是 θ + 30°）', 'r4', 'tm']], { k: 'cc' }),
    [{ sub: '公式裡的 θ 是<b>負載阻抗角</b>：相電壓和相電流的夾角。', on: 'ax v i cc r1 r2' },
     { sub: '線電壓 V<sub>AB</sub> 跟 I<sub>a</sub> 差的是 θ + 30° —— 不要拿錯。', on: 'vl r3 r4' }]);

  /* 08 Ex12.6 守恆 */
  const S8 = sc('電源、線路、負載', 'WHERE THE POWER GOES',
    sys3({ src: 'Y', load: 'Y', x0: 80, x1: 560, y: [125, 170, 215], vs: ['110∠0°', '110∠−120°', '110∠120°'], zl: '5 − j2', z: '10 + j8', k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    calc(70, 240, 500, [['電源送 2087 W ＝ 線路 695.6 W ＋ 負載 1392 W', 'r1', 'ta']], { k: 'cc', a: 'middle' }),
    [{ sub: '回到 PART 1 的電路（Example 12.6）：I<sub>p</sub> = 6.81 A。', on: 'src lbl line load' },
     { sub: '電源送 3 × 110 × 6.81 × cos 21.8° = 2087 W；線路吃 695.6 W、負載吃 1392 W —— 守恆！', on: 'cc r1' }]);

  /* 09 省電線 */
  const wires = (x, n, key) => g(key, Array.from({ length: n }, (_, i) => '<line class="ln" style="stroke-width:' + (n === 2 ? 7 : 5) + '" x1="' + x + '" y1="' + (140 + i * 40) + '" x2="' + (x + 180) + '" y2="' + (140 + i * 40) + '"/>').join(''));
  const S9 = sc('三相省電線', 'LESS COPPER',
    wires(70, 2, 'w1') + T(160, 240, '單相：2 條，要比較粗', { cls: 't', fs: 13, k: 'l1' }) +
    wires(390, 3, 'w3') + T(480, 260, '三相：3 條，細一點', { cls: 't', fs: 13, k: 'l3' }) +
    calc(150, 262, 340, [['同樣功率、損失：三相只用 75% 的銅', 'r1', 'ta']], { k: 'cc', a: 'middle', lh: 24 }),
    [{ sub: '同樣的功率、同樣的線電壓、同樣的損失。', on: '' },
     { sub: '單相兩條線，每條電流比較大，線要比較粗。', on: 'w1 l1' },
     { sub: '三相三條線，每條電流只有 1/√3 倍，可以細很多。', on: 'w3 l3' },
     { sub: '算一下總銅量：三相只要單相的 <b>75%</b>。這是三相的第二個好處。', on: 'cc r1' }]);

  /* 10 Ex12.8 */
  const s = 0.0016;
  const S10 = sc('兩組負載＋功因校正', 'TWO LOADS + PFC',
    tri(80, 290, 90000, 85000, s, { kp: 'p', kq: 'q', ks: 's', lp: 'P = 90 kW', lq: 'Q = 85 kVAR' }) +
    g('new', '<path class="lna" style="fill:none;stroke-width:2.6" d="M80 290 L' + f1(80 + 90000 * s) + ' ' + f1(290 - 43600 * s) + '"/>') +
    calc(360, 116, 255, [['S = (30 + j40) + (60 + j45)', 'r1'], ['pf = 0.727 → 拉到 0.9', 'r2'], ['Q<sub>C</sub> = 41.4 kVAR', 'r3', 'ta'], ['Δ 接電容吃線電壓 240 kV', 'r4'], ['每顆 13.8 kVAR、635.5 pF', 'r5']], { k: 'cc' }),
    [{ sub: '兩組負載：功率三角形頭尾接起來相加（Example 12.8）。', on: 'p q s cc r1' },
     { sub: '要把 pf 從 0.727 拉到 0.9：P 不變、Q 削掉一截。', on: 'new r2 r3' },
     { sub: '三顆電容接成 Δ，每顆兩端是線電壓 —— 跟 CH11 一樣的公式。', on: 'r4 r5' }]);

  /* 11 不平衡 */
  const pull = (cx, cy, Ls, key) => g(key, [90, 210, 330].map((a, i) => D.arrow(cx, cy, f1(cx + Ls[i] * Math.cos(a * RAD)), f1(cy - Ls[i] * Math.sin(a * RAD)), null, i ? 'ln' : 'lna')).join('') + '<circle class="acc" cx="' + cx + '" cy="' + cy + '" r="7"/>');
  const S11 = sc('如果三相不一樣呢？', 'UNBALANCED',
    pull(180, 210, [80, 80, 80], 'b1') + T(180, 310, '一樣大：環不動', { cls: 't', fs: 13, k: 'l1' }) +
    pull(460, 210, [95, 50, 75], 'b2') + T(460, 310, '不一樣：環被拉走', { cls: 'ta', fs: 13, k: 'l2' }),
    [{ sub: '前面全部都假設<b>平衡</b>：三相一樣大、差 120°，加起來 = 0。', on: 'b1 l1' },
     { sub: '如果三相的負載不一樣（家裡每戶開的電器都不同），三個電流就不再一樣大。', on: 'b2' },
     { sub: '三個人用不一樣的力拉環 → 環會被拉走：<b>加起來不是 0 了</b>。', on: 'l2' }]);

  /* 12 四線式 */
  const S12 = sc('有中性線：各算各的', 'FOUR-WIRE',
    sys3({ src: 'Y', load: 'Y', x0: 80, x1: 560, y: [122, 168, 214], vs: ['100∠0°', '100∠120°', '100∠−120°'], z: ['15', '10 + j5', '6 − j8'], n: true, k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl', n: 'n' } }) +
    calc(90, 262, 460, [['I<sub>a</sub> = 6.67∠0°　I<sub>b</sub> = 8.94∠93.44°　I<sub>c</sub> = 10∠−66.87° A', 'r1', 't', 13.5]], { k: 'cc', a: 'middle', lh: 24 }),
    [{ sub: 'Example 12.9：100 V、acb，三個負載 15、10 + j5、6 − j8 Ω。', on: 'src lbl line load' },
     { sub: '有中性線 → 每個負載兩端都是自己那一相的 100 V。', on: 'n' },
     { sub: '三相各用一次歐姆定律 —— <b>不能算一相再轉 120°</b>。', on: 'cc r1' }]);

  /* 13 In */
  const S13 = sc('中性線上的電流', 'NEUTRAL CURRENT',
    ph(230, 205, 9.5, [{ a: 0, m: 6.67, l: 'I<sub>a</sub>', c: 'ln', k: 'a' }, { a: 93.44, m: 8.94, l: 'I<sub>b</sub>', c: 'ln', k: 'b' }, { a: -66.87, m: 10, l: 'I<sub>c</sub>', c: 'ln', k: 'c' }, { a: 178.4, m: 10.06, l: 'I<sub>n</sub>', k: 'n' }], { k: 'ax', ax: 110, noTick: true }) +
    calc(400, 120, 215, [['I<sub>n</sub> = −(I<sub>a</sub>+I<sub>b</sub>+I<sub>c</sub>)', 'r1'], ['= 10.06∠178.4° A', 'r2', 'ta'], ['跟線電流一樣大！', 'r3', 'tm']], { k: 'cc' }),
    [{ sub: '三支箭頭不再對稱。', on: 'ax a b c' },
     { sub: '加起來不是 0，多出來的只能從中性線回去：I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>)。', on: 'cc r1' },
     { sub: '10.06 A —— 謎題二解開：不平衡時中性線很忙，不能拿掉。', on: 'n r2 r3' }]);

  /* 14 三線式 */
  const S14 = sc('沒有中性線呢？', 'THREE-WIRE',
    sys3({ src: 'Y', load: 'Y', x0: 80, x1: 560, y: [122, 168, 214], vs: ['120∠0°', '120∠−120°', '120∠120°'], z: ['j5', '10', '−j10'], k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
    calc(90, 248, 460, [['N 點浮動 → 用網目分析（兩個網目、克拉瑪）', 'r1', 'ta']], { k: 'cc', a: 'middle', lh: 26 }),
    [{ sub: 'Example 12.10：不平衡、而且<b>沒有中性線</b>。', on: 'src lbl line load' },
     { sub: '電流沒地方回去，N 點的電壓會自己「浮」起來 —— 每相負載兩端不再是 120 V。', on: '' },
     { sub: '只好老實解整個電路：<b>網目分析</b>。功率也是三相各算各的再加。', on: 'cc r1' }]);

  /* 15 恍然大悟 */
  const S15 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['平衡：三個起伏抵消 → p = 3V<sub>p</sub>I<sub>p</sub>cos θ', 'r1', 'ta'], ['P = √3 V<sub>L</sub>I<sub>L</sub>cos θ，銅只要 75%', 'r2'], ['不平衡：電流不再抵消 → I<sub>n</sub> ≠ 0', 'r3', 'ta'], ['各相分開算（或網目分析）', 'r4'], ['下一頁：怎麼「量」三相功率', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 26 }),
    [{ sub: '謎題一：三相的功率起伏互相抵消，所以馬達很穩。', on: 'cc r1 r2' },
     { sub: '謎題二：不平衡時三個電流不再抵消，中性線上就有電流。', on: 'r3 r4' },
     { sub: '下一頁（PART 4）：用瓦特計量三相功率、PSpice、家裡的配電。', on: 'r5' }]);

  __Story('#story', { id: 'cir-ch12-p3', title: 'CH12 PART 3 三相功率與不平衡', after: '#pow',
    scenes: [S0, S1, S2, S3s, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15] });
})();
