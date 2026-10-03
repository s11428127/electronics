/* ============================================================
   電子學 CH1 PART 2（＋ 原講義 PART 3 投影片 1-1～1-15）—— 故事模式
   （1-16～1-18 愛因斯坦關係、多出載子 10/3 搬到 PART 3 故事開頭）
   寫法：照 PART 1 的節奏 —— 先用生活比喻講直覺，一個畫面只講一件事，最後才把數字和公式放上來。
   主線謎題：一塊矽兩端什麼都沒接，裡面卻有電流（課本 Example 1.4：187 A/cm²）。
   答案：擴散 —— 載子會動只有兩個原因：被電場「推」（漂移）、被濃度差「擠」（擴散）。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { e, h, line, text, arrow, chip, lattice } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280);
  const sup = s => '<tspan font-size="9" dy="-6">' + s + '</tspan><tspan dy="6"></tspan>';
  const fx = parts => { let o = parts[0]; for (let i = 1; i < parts.length; i += 2) o += '<tspan font-size="11" dy="4">' + parts[i] + '</tspan><tspan dy="-4">' + (parts[i + 1] || '') + '</tspan>'; return o; };
  const ring = (x, y, sign, key) => g(key, '<circle class="ring" cx="' + x + '" cy="' + y + '" r="8"/>' + T(x, y, sign, { cls: 'ta', fs: 12, dy: '.35em' }));

  /* 濃度漸層的一條半導體：左稀右濃（pw 越小越集中在右邊） */
  function gradientBar(x0, y0, w, hh, key, dotsKey, seed, pw, n) {
    const r = rnd(seed || 3);
    let dots = '';
    for (let i = 0; i < (n || 70); i++) {
      const t = Math.pow(r(), pw || 0.45);
      dots += e((x0 + 8 + t * (w - 16)).toFixed(1), (y0 + 8 + r() * (hh - 16)).toFixed(1), null, 3.6);
    }
    return g(key, '<rect class="bgw" x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + hh + '" rx="10"/>') + g(dotsKey, dots);
  }
  const dim = keys => keys.split(' ').reduce((o, kk) => (o[kk] = 0.15, o), {});

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '沒接電池的電流', en: 'THE QUESTION',
    svg: gradientBar(120, 130, 400, 90, 'bar', 'dots', 5) +
      g('ends', '<line class="ln" x1="98" y1="175" x2="120" y2="175"/><line class="ln" x1="520" y1="175" x2="542" y2="175"/>' +
        '<circle class="bgw" cx="94" cy="175" r="4"/><circle class="bgw" cx="546" cy="175" r="4"/>') +
      chip(320, 96, '沒有電池', '兩端什麼都沒接', 'nobat', { fs: 13 }) +
      T(150, 246, '左邊：很少', { cls: 'tm', fs: 13, k: 'nl' }) + T(490, 246, '右邊：很多', { cls: 'ta', fs: 13, k: 'nr' }) +
      chip(320, 296, '裡面真的有電流！', '課本 Example 1.4：187 A/cm²，跟接上電池的差不多大', 'J', { fs: 13, acc: true }) +
      T(320, 232, '?', { cls: 'ta', fs: 120, k: 'q' }),
    steps: [
      { sub: '一塊矽，兩端什麼都沒接 —— <b>沒有電池</b>。', on: 'bar ends nobat' },
      { sub: '裡面的電子分布不均勻：<b>左邊很少、右邊很多</b>。', on: 'dots nl nr' },
      { sub: '奇怪的是：裡面<b>真的有電流在流</b>，而且不小。', on: 'J' },
      { sub: '沒有電池推，電子為什麼會動？這一段就要回答這個問題。', op: dim('bar dots ends nobat nl nr J'), on: 'q' }
    ]
  };

  /* ════════════ 01 複習：N 型 ════════════ */
  const S1 = {
    t: '先複習：N 型', en: 'RECAP · N-TYPE',
    svg: lattice(250, 130, 3, 3, 70, 'L', { sym: { '1,1': 'P' } }) +
      e(338, 174, 'e5', 5) +
      chip(150, 120, '純矽', '每個電子都被鍵綁住', 'c0', { fs: 12.5 }) +
      chip(480, 120, '磷 P：5 個價電子', '4 個拿去配對，多 1 個', 'cP', { fs: 12.5 }) +
      chip(480, 300, '自由電子 → N 型', 'Negative：多的是負電', 'cN', { fs: 12.5, acc: true }) +
      chip(170, 300, '這次反過來：少一個呢？', null, 'cQ', { fs: 13, acc: true }),
    steps: [
      { sub: '先複習 PART 1：純矽裡，每個電子都被共價鍵綁得好好的。', on: 'L-b L-e L-a c0' },
      { sub: '把一顆矽換成<b>磷</b>：磷有 5 個價電子，4 個拿去配對，<b>多出 1 個</b>。', off: 'c0', on: 'e5 cP' },
      { sub: '多出來的那個很容易跑掉，變成<b>自由電子</b>。這就是 <b>N 型</b>。', mv: { e5: [96, 44] }, on: 'cN' },
      { sub: '這一段反過來想：如果換成一個<b>少一個電子</b>的原子呢？', on: 'cQ' }
    ]
  };

  /* ════════════ 02 硼：少一隻手 ════════════ */
  const hbX = 320 + 70 * 0.36, e1x = 390, e1y = 200 + 70 * 0.36;
  const S2 = {
    t: '硼：少一隻手', en: 'BORON · ONE BOND SHORT',
    svg: lattice(250, 130, 3, 3, 70, 'L', { sym: { '1,1': 'B' }, skip: { 'L-e-1-1-h-0': 1 } }) +
      h(hbX, 200, 'hb', 6) +
      chip(150, 112, '硼 B：只有 3 個價電子', '3A 族', 'cB3', { fs: 12.5 }) +
      chip(490, 112, '矽：要牽 4 隻手', '跟上下左右的鄰居各共用一對電子', 'c4', { fs: 12.5 }) +
      chip(470, 300, '少一個電子 = 一個空位', '這個空位就是「電洞」', 'cH', { fs: 12.5, acc: true }),
    steps: [
      { sub: '這次換成<b>硼 B</b>。硼的最外層只有 <b>3 個</b>價電子。', on: 'L-b L-e L-a cB3' },
      { sub: '每顆矽都要跟 4 個鄰居「牽手」—— 各共用一對電子。', on: 'c4' },
      { sub: '可是硼只有 3 隻手，有一條鍵就<b>少了一個電子</b>。', on: 'hb' },
      { sub: '這個空位，就是 PART 1 講過的<b>電洞</b>。', on: 'cH', cls: { hb: 'pulse' } }
    ]
  };

  /* ════════════ 03 空位會跑 ════════════ */
  const S3 = {
    t: '空位會跑：電洞', en: 'THE HOLE MOVES',
    svg: lattice(250, 130, 3, 3, 70, 'L', { sym: { '1,1': 'B' }, skip: { 'L-e-1-1-h-0': 1, 'L-e-2-1-v-0': 1 } }) +
      h(hbX, 200, 'hb', 6) + e(e1x, e1y, 'e1', 4) +
      g('bm', '<circle class="ring" cx="320" cy="200" r="19"/>' + T(338, 184, '−', { cls: 'ta', fs: 16 })) +
      chip(150, 112, '像空著的椅子', '旁邊的人坐過來，空位就換到別處', 'cC', { fs: 12.5 }) +
      chip(490, 300, '電洞可以到處跑', '帶正電的「空位」', 'cHole', { fs: 12.5 }) +
      chip(150, 300, 'B⁻：固定不動', '收了一個電子 → 受體 acceptor', 'cBm', { fs: 12.5, acc: true }),
    steps: [
      { sub: '還記得椅子嗎？空位旁邊的人坐過來，空位就換到別處。', on: 'L-b L-e L-a hb e1 cC' },
      { sub: '晶格裡也一樣：旁邊鍵上的電子<b>跳過來補位</b> ——', mv: { e1: [hbX - e1x, 200 - e1y] } },
      { sub: '空位就跑到它原本的地方。所以<b>電洞可以到處跑</b>。', mv: { hb: [e1x - hbX, e1y - 200] }, on: 'cHole' },
      { sub: '硼這下多收了一個電子，變成<b>固定不動的負離子 B⁻</b>。它「接受」電子，所以叫<b>受體</b>。', on: 'bm cBm' }
    ]
  };

  /* ════════════ 04 P 型 ════════════ */
  function box(x0, kind, key, seed) {
    const r = rnd(seed); const s = '<rect class="bgw" x="' + x0 + '" y="104" width="230" height="150" rx="10"/>';
    let carriers = '', ions = '';
    [[0.18, 0.25], [0.5, 0.2], [0.8, 0.3], [0.3, 0.7], [0.66, 0.66], [0.15, 0.85], [0.88, 0.82]].forEach(([a, b]) => {
      ions += ring(x0 + 15 + a * 200, 116 + b * 126, kind === 'n' ? '+' : '−');
    });
    for (let i = 0; i < 13; i++) {
      const x = x0 + 16 + r() * 198, y = 118 + r() * 124;
      carriers += kind === 'n' ? e(x.toFixed(1), y.toFixed(1), null, 4.6) : h(x.toFixed(1), y.toFixed(1), null, 5);
    }
    const minor = kind === 'n' ? h(x0 + 120, 186, null, 5) : e(x0 + 112, 180, null, 4.6);
    return g(key, s) + g(key + 'i', ions) + g(key + 'c', carriers, ' class="shake"') + g(key + 'm', minor);
  }
  const S4 = {
    t: 'P 型半導體', en: 'P-TYPE SEMICONDUCTOR',
    svg: box(205, 'p', 'P', 23) + T(320, 94, '摻很多硼', { fs: 14, k: 'Pl' }) +
      chip(320, 280, '帶正電的電洞變多 → P 型', 'Positive', 'cP', { fs: 13, acc: true }) +
      chip(110, 150, '多數載子：電洞', null, 'cMaj', { fs: 12.5 }) +
      chip(530, 150, '少數載子：電子', '熱擾動來的一點點', 'cMin', { fs: 12.5 }) +
      chip(320, 318, 'B⁻ 的負電抵消電洞的正電', '整塊還是電中性', 'cNeu', { fs: 12.5 }),
    steps: [
      { sub: '摻很多硼：晶體裡就有<b>很多電洞</b>在跑。', on: 'P Pi Pc Pl' },
      { sub: '多出來的是帶<b>正電</b>（Positive）的電洞，所以叫 <b>P 型半導體</b>。', on: 'cP' },
      { sub: '電洞是<b>多數載子</b>；熱擾動產生的一點點電子，是<b>少數載子</b>。', on: 'cMaj cMin Pm' },
      { sub: '別忘了：B⁻ 的負電剛好抵消電洞的正電，整塊還是<b>電中性</b>。', off: 'cP', on: 'cNeu', cls: { Pi: 'pulse' } }
    ]
  };

  /* ════════════ 05 N vs P ════════════ */
  const S5 = {
    t: 'N 型 vs P 型', en: 'N-TYPE VS P-TYPE',
    svg: box(60, 'n', 'N', 11) + box(350, 'p', 'Q', 23) +
      T(175, 94, 'N 型（摻磷）', { fs: 14, k: 'Nl' }) + T(465, 94, 'P 型（摻硼）', { fs: 14, k: 'Ql' }) +
      chip(175, 284, '多數：電子　少數：電洞', '固定離子 P⁺', 'Nch', { fs: 12.5 }) +
      chip(465, 284, '多數：電洞　少數：電子', '固定離子 B⁻', 'Qch', { fs: 12.5 }),
    steps: [
      { sub: '把兩種放在一起比：左邊 N 型、右邊 P 型。', on: 'N Ni Nc Nl Q Qi Qc Ql' },
      { sub: '<b>N 型</b>：多的是電子，固定不動的是 P⁺。', on: 'Nch Nm' },
      { sub: '<b>P 型</b>：多的是電洞，固定不動的是 B⁻。剛好<b>相反</b>。', on: 'Qch Qm' }
    ]
  };

  /* ════════════ 06 蹺蹺板 ════════════ */
  const plank = (y1, y2, key) => g(key, '<line class="ln" x1="360" y1="' + y1 + '" x2="580" y2="' + y2 + '" style="stroke-width:4"/>' +
    T(360, y1 - 14, '電子 n', { cls: 'ta', fs: 13 }) + T(580, y2 - 14, '電洞 p', { cls: 't', fs: 13 }));
  const S6 = {
    t: '電子多了，電洞就少了', en: 'MORE ELECTRONS, FEWER HOLES',
    svg: h(250, 190, 'ch', 8) + e(120, 190, 'ce', 7) +
      g('fl', '<circle class="ring" cx="250" cy="190" r="16"/>') + T(185, 230, '一碰到就互相抵消', { cls: 'ta', fs: 13, k: 'fL' }) +
      '<polygon class="ink" points="470,262 456,290 484,290"' + k('pv') + '/>' +
      plank(262, 262, 'sw0') + plank(226, 298, 'sw1') +
      chip(185, 300, '電子掉回空位 = 復合', null, 'cR', { fs: 12.5 }) +
      chip(470, 108, '像蹺蹺板', '一邊上去，另一邊就下來', 'cS', { fs: 13, acc: true }),
    steps: [
      { sub: '先看一件事：電子跟電洞一碰到，電子就會<b>掉進空位</b>。', on: 'ce ch' },
      { sub: '兩個<b>一起消失</b>，叫做<b>復合</b>。', mv: { ce: [130, 0] }, on: 'cR' },
      { sub: '一碰就抵消：電子越多，電洞越容易被「吃掉」。', off: 'ce ch', on: 'fl fL', cls: { fl: 'pulse' } },
      { sub: '現在摻了很多磷，電子超多 → 電洞一冒出來就被填掉，活下來的<b>更少</b>。', off: 'fl', on: 'pv sw0' },
      { sub: '就像<b>蹺蹺板</b>：電子這邊上去，電洞那邊就下來。', off: 'sw0', on: 'sw1 cS' }
    ]
  };

  /* ════════════ 07 質量作用定律（數字） ════════════ */
  const RX3 = lg => 70 + lg / 20 * 500, ry3 = 236, niX = RX3(10.18);
  let rul = line(70, ry3, 570, ry3, null, 'ln');
  for (let d = 0; d <= 20; d += 2) rul += line(RX3(d), ry3, RX3(d), ry3 + 6, null, 'ln') + T(RX3(d), ry3 + 22, '10' + sup(d), { cls: 'ts mono', fs: 10 });
  const up = (x, lab, key, lk) => g(key, '<polygon class="acc" points="' + (x - 6) + ',' + (ry3 - 10) + ' ' + (x + 6) + ',' + (ry3 - 10) + ' ' + x + ',' + ry3 + '"/>' +
    line(x, ry3 - 34, x, ry3 - 10, null, 'lna') + T(x, ry3 - 42, lab, { cls: 'ta', fs: 13, k: lk }));
  const dn = (x, lab, key, lk) => g(key, '<polygon class="ink" points="' + (x - 6) + ',' + (ry3 + 40) + ' ' + (x + 6) + ',' + (ry3 + 40) + ' ' + x + ',' + (ry3 + 30) + '"/>' +
    line(x, ry3 + 40, x, ry3 + 58, null, 'ln') + T(x, ry3 + 74, lab, { fs: 13, k: lk }));
  const S7 = {
    t: '蹺蹺板的規則：n · p = nᵢ²', en: 'LAW OF MASS ACTION',
    svg: T(320, 110, 'n · p = n<tspan font-size="14" dy="5">i</tspan><tspan font-size="13" dy="-13">2</tspan>', { cls: 't', fs: 30, k: 'f' }) +
      chip(320, 148, '兩邊乘起來永遠一樣', '熱平衡時，不管摻什麼、摻多少', 'cf', { fs: 12.5 }) +
      g('ru', rul) + line(niX, ry3 - 70, niX, ry3 + 4, 'niL', 'ln2 dsh') + T(niX, ry3 - 78, 'nᵢ', { cls: 'ts', fs: 13, k: 'niT' }) +
      up(niX, 'n', 'nm', 'nmT') + dn(niX, 'p', 'pm', 'pmT') +
      g('br', '<path class="lna" d="M' + niX + ' 176 H' + RX3(16) + '"/>' + T((niX + RX3(16)) / 2, 168, '多 5.8 個 0', { cls: 'ta', fs: 12 }) +
        '<path class="ln" d="M' + niX + ' 336 H' + RX3(4.35) + '" style="stroke-dasharray:4 4"/>' + T((niX + RX3(4.35)) / 2, 350, '少 5.8 個 0', { fs: 12 })),
    steps: [
      { sub: '蹺蹺板有個固定規則：<b>電子濃度 × 電洞濃度 = 固定值 nᵢ²</b>。', on: 'f cf' },
      { sub: '純矽：n = p = nᵢ = 1.5×10¹⁰，兩邊一樣高，都在正中間。', off: 'cf', on: 'ru niL niT nm pm nmT pmT' },
      { sub: '摻磷到 N<sub>d</sub> = 10¹⁶：電子衝上去 ——', mv: { nm: [RX3(16) - niX, 0] }, txt: { nmT: 'n = 10¹⁶' } },
      { sub: '電洞就被壓到 nᵢ² ÷ n = <b>2.25×10⁴</b>。', mv: { pm: [RX3(4.35) - niX, 0] }, txt: { pmT: 'p = 2.25×10⁴' } },
      { sub: '在「差幾個 0」的尺上看：<b>一個多幾個 0，另一個就少幾個 0</b>。', on: 'br' }
    ]
  };

  /* ════════════ 08 電流是什麼 ════════════ */
  let car8 = '';
  for (let i = 0; i < 12; i++) car8 += e(118 + i * 38, 150 + ((i * 7) % 3) * 14, null, 5);
  const S8 = {
    t: '電流：每秒過多少', en: 'WHAT IS CURRENT',
    svg: '<defs><clipPath id="st-p2c8"><rect x="100" y="130" width="440" height="62" rx="31"/></clipPath></defs>' +
      g('pipe', '<rect class="bgw" x="100" y="130" width="440" height="62" rx="31"/>') +
      g('car', car8, ' clip-path="url(#st-p2c8)" style="--run:38px"') +
      g('gate', '<line class="lna" x1="400" y1="116" x2="400" y2="206" style="stroke-width:2.4;stroke-dasharray:5 4"/>') +
      T(400, 104, '收費站', { cls: 'ta', fs: 13, k: 'gateL' }) +
      chip(320, 258, '電流 = 每秒通過的電荷', '像收費站數「每秒過幾台車」', 'cI', { fs: 13 }) +
      chip(320, 312, '車越多、跑越快 → 電流越大', '載子濃度 × 速度', 'cMore', { fs: 13, acc: true }),
    steps: [
      { sub: '接下來談<b>載子怎麼動</b>。先複習：電流就是<b>每秒有多少電荷通過</b>。', on: 'pipe car', cls: { car: 'conv' } },
      { sub: '像高速公路的收費站，每秒數一次過了幾台車。', on: 'gate gateL cI' },
      { sub: '車越多、跑越快，每秒通過的就越多 → <b>電流越大</b>。', on: 'cMore' }
    ]
  };

  /* ════════════ 09 I 與 J ════════════ */
  const pipeDots = (x0, y0, w, hh, n, seed) => { const r = rnd(seed); let s = ''; for (let i = 0; i < n; i++) s += e((x0 + 10 + r() * (w - 20)).toFixed(1), (y0 + 8 + r() * (hh - 16)).toFixed(1), null, 3.6); return s; };
  const S9 = {
    t: '電流 I 與電流密度 J', en: 'CURRENT · CURRENT DENSITY',
    svg: g('w', '<rect class="bgw" x="70" y="110" width="230" height="120" rx="12"/>' + pipeDots(70, 110, 230, 120, 40, 3)) +
      g('n', '<rect class="bgw" x="360" y="150" width="210" height="40" rx="12"/>' + pipeDots(360, 150, 210, 40, 13, 9)) +
      T(185, 252, '大的：電流 I 大', { cls: 't', fs: 13, k: 'wL' }) + T(465, 252, '小的：電流 I 小', { cls: 't', fs: 13, k: 'nL' }) +
      g('u', '<rect x="175" y="160" width="20" height="20" class="acc" opacity=".55"/><rect x="455" y="160" width="20" height="20" class="acc" opacity=".55"/>') +
      chip(320, 300, '每 1 cm² 一樣擠 → 電流密度 J 一樣', 'J = I ÷ A：跟元件大小無關', 'cJ', { fs: 13, acc: true }) +
      chip(320, 300, '課本的 187 A/cm²，放在 50 μm 見方上', '只有約 4.7 mA —— J 大，I 不一定大', 'cA', { fs: 13 }),
    steps: [
      { sub: '可是元件有大有小。大的元件電流大，不代表裡面比較「擠」。', on: 'w n wL nL' },
      { sub: '所以物理上比的是：<b>每一平方公分</b>，每秒通過多少電荷。', on: 'u' },
      { sub: '這叫<b>電流密度 J</b> = I ÷ A。課本的公式都用 J，因為它<b>跟元件大小無關</b>。', on: 'cJ' },
      { sub: '換算回來：187 A/cm² 放在 50 μm 見方的元件上，只有大約 <b>4.7 mA</b>。', off: 'cJ', on: 'cA' }
    ]
  };

  /* ════════════ 10 第一招：被推（漂移） ════════════ */
  let hs10 = '', es10 = '';
  for (let i = 0; i < 10; i++) { hs10 += h(68 + i * 50, 156, null, 6); es10 += e(80 + i * 50, 198, null, 5.5); }
  const S10 = {
    t: '第一招：被電場推', en: 'DRIFT',
    svg: '<defs><clipPath id="st-p2c10"><rect x="100" y="132" width="440" height="92" rx="10"/></clipPath></defs>' +
      chip(320, 98, '載子會動，只有兩個原因', '① 被推　② 被擠', 'c2', { fs: 13 }) +
      g('bar', '<rect class="bgw" x="100" y="132" width="440" height="92" rx="10"/>') +
      g('E', arrow(200, 258, 440, 258, null, 'ln') + T(450, 258, '電場 E（像一陣風）', { cls: 't', fs: 13, a: 'start', dy: '.35em' })) +
      g('hs', hs10, ' clip-path="url(#st-p2c10)" style="--run:50px"') +
      g('es', es10, ' clip-path="url(#st-p2c10)" style="--run:-50px"') +
      T(90, 160, '電洞 →', { cls: 'ta', fs: 12, a: 'end', k: 'hl' }) + T(90, 202, '← 電子', { cls: 'ta', fs: 12, a: 'end', k: 'el' }) +
      chip(320, 310, '被電場推著跑 = 漂移 drift', null, 'cD', { fs: 13, acc: true }),
    steps: [
      { sub: '載子會動，只有<b>兩個原因</b>：被<b>推</b>，或被<b>擠</b>。先看「推」。', on: 'c2' },
      { sub: '接上電池，半導體裡就有<b>電場</b> —— 像一陣風一直往右吹。', on: 'bar E' },
      { sub: '電洞帶正電，<b>順著</b>風往右跑；', on: 'hs hl', cls: { hs: 'conv' } },
      { sub: '電子帶負電，<b>逆著</b>風往左跑。', on: 'es el', cls: { es: 'conv' } },
      { sub: '被電場推著跑，叫<b>漂移</b>。', on: 'cD' }
    ]
  };

  /* ════════════ 11 漂移的方向：負負得正 ════════════ */
  const S11 = {
    t: '兩個方向相反，電流會抵消嗎？', en: 'DRIFT CURRENT DIRECTION',
    svg: T(170, 104, '電洞（＋）', { cls: 't', fs: 15, k: 'hT' }) + T(470, 104, '電子（−）', { cls: 't', fs: 15, k: 'eT' }) +
      g('hm', h(110, 150, null, 8) + arrow(130, 150, 230, 150, null, 'ln') + T(170, 176, '往右跑', { cls: 'tm', fs: 12.5 })) +
      g('hj', arrow(100, 222, 240, 222, null, 'lna') + T(170, 246, '電流往右', { cls: 'ta', fs: 13 })) +
      g('em', e(530, 150, null, 7) + arrow(510, 150, 410, 150, null, 'ln') + T(470, 176, '往左跑', { cls: 'tm', fs: 12.5 })) +
      g('ej', arrow(400, 222, 540, 222, null, 'lna') + T(470, 246, '負電往左 = 電流往右', { cls: 'ta', fs: 13 })) +
      chip(320, 300, '負負得正 → 兩個電流同方向，直接相加', 'J = e(nμₙ + pμₚ)E', 'cS', { fs: 13, acc: true }),
    steps: [
      { sub: '電洞往右、電子往左。兩種電流會不會<b>互相抵消</b>？', on: 'hT eT hm em' },
      { sub: '電洞：正電荷往右跑 → 電流<b>往右</b>。', on: 'hj' },
      { sub: '電子：負電荷往左跑，就等於正電荷往右跑 → 電流<b>也往右</b>。', on: 'ej' },
      { sub: '<b>負負得正</b>：兩種漂移電流同方向，直接相加，不會抵消。', on: 'cS' }
    ]
  };

  /* ════════════ 12 撞來撞去：移動率 ════════════ */
  const zig = (x0, y0, n, key, cls, seed, sw) => {
    let d = 'M' + x0 + ' ' + y0, x = x0; const r = rnd(seed);
    for (let i = 0; i < n; i++) { x += 8 + r() * 14; const y = y0 + (r() - 0.5) * 34; d += ' L' + x.toFixed(1) + ' ' + y.toFixed(1); }
    return '<path class="' + cls + '" style="fill:none;stroke-width:' + (sw || 2) + '" d="' + d + '"' + k(key) + '/>';
  };
  let atoms12 = '';
  for (let j = 0; j < 4; j++) for (let i = 0; i < 14; i++) atoms12 += '<circle class="ink3" cx="' + (84 + i * 36 + (j % 2) * 18) + '" cy="' + (128 + j * 34) + '" r="3"/>';
  const S12 = {
    t: '一路撞來撞去：移動率', en: 'MOBILITY',
    svg: g('at', atoms12) + zig(80, 180, 28, 'z', 'lna', 7, 2.4) +
      g('avg', arrow(90, 254, 540, 254, null, 'lna') + T(320, 274, '平均起來：往一個方向前進', { cls: 'ta', fs: 13 })) +
      chip(150, 316, '平均速度 v = μ · E', 'μ：移動率，越少撞越大', 'cV', { fs: 12.5 }) +
      chip(470, 316, '矽：μₙ = 1350、μₚ = 480', '單位 cm²/(V·s)：電子比電洞好跑約 3 倍', 'cMu', { fs: 12.5, acc: true }),
    steps: [
      { sub: '載子不是一路順暢地跑。它一直<b>撞到晶格的原子</b>，像在擁擠的夜市裡走路。', on: 'at z' },
      { sub: '撞來撞去，平均下來還是會<b>往一個方向前進</b>。', on: 'avg' },
      { sub: '平均速度跟電場成正比：<b>v = μE</b>。μ 叫<b>移動率</b>，越不容易撞，μ 越大。', on: 'cV' },
      { sub: '矽的電子 μₙ = 1350、電洞 μₚ = 480：<b>電子比電洞好跑將近 3 倍</b>。', on: 'cMu' }
    ]
  };

  /* ════════════ 13 導電度 ════════════ */
  const S13 = {
    t: '導電度：多 × 順', en: 'CONDUCTIVITY',
    svg: chip(320, 104, '越導電 = 載子越多 × 跑得越順', null, 'cIdea', { fs: 14, acc: true }) +
      T(320, 152, 'σ = e(nμ<tspan font-size="12" dy="4">n</tspan><tspan dy="-4"> + pμ</tspan><tspan font-size="12" dy="4">p</tspan><tspan dy="-4">)　　J = σE</tspan>', { cls: 't', fs: 22, k: 'f' }) +
      T(96, 200, 'nμ<tspan font-size="10" dy="3">n</tspan>', { fs: 15, a: 'end', k: 'b1l' }) + g('b1', '<rect class="acc" x="106" y="188" width="420" height="22" rx="4"/>') +
      T(96, 240, 'pμ<tspan font-size="10" dy="3">p</tspan>', { fs: 15, a: 'end', k: 'b2l' }) + g('b2', '<rect class="ink" x="106" y="228" width="1.5" height="22"/>') +
      T(116, 240, '電洞太少，小到看不見', { cls: 'ts', fs: 12, a: 'start', dy: '.35em', k: 'b2t' }) +
      chip(320, 284, 'N 型 N_d = 8×10¹⁵：σ ≅ eμₙn = 1.73 (Ω·cm)⁻¹', 'Example 1.3', 'c13', { fs: 13 }) +
      T(320, 326, '加 100 V/cm：J = σE = 173 A/cm²', { cls: 'ta', fs: 17, k: 'J' }),
    steps: [
      { sub: '一塊材料多會導電？看兩件事：載子<b>多不多</b>、跑得<b>順不順</b>。', on: 'cIdea' },
      { sub: '寫成數學：<b>導電度 σ</b> = 電荷 ×（濃度 × 移動率），兩種載子加起來。', on: 'f' },
      { sub: 'N 型摻 8×10¹⁵：電子那項超大，電洞那項<b>小到看不見</b>。', on: 'b1 b1l b2 b2l b2t' },
      { sub: '所以只算電子：σ ≅ eμₙn = <b>1.73</b> (Ω·cm)⁻¹（課本 Example 1.3）。', on: 'c13' },
      { sub: '加 100 V/cm 的電場：J = σE = <b>173 A/cm²</b>。', on: 'J' }
    ]
  };

  /* ════════════ 14 第二招：被擠（擴散） ════════════ */
  const r14 = rnd(17); let drop = '', spread = '';
  for (let i = 0; i < 26; i++) {
    const a = r14() * Math.PI * 2, rr = Math.sqrt(r14());
    drop += '<circle class="e" cx="' + (180 + Math.cos(a) * rr * 22).toFixed(1) + '" cy="' + (190 + Math.sin(a) * rr * 22).toFixed(1) + '" r="4"/>';
    spread += '<circle class="e" cx="' + (180 + Math.cos(a) * rr * 105).toFixed(1) + '" cy="' + (190 + Math.sin(a) * rr * 80).toFixed(1) + '" r="4"/>';
  }
  const S14 = {
    t: '第二招：被擠', en: 'DIFFUSION',
    svg: g('cup', '<rect class="bgw" x="60" y="100" width="240" height="180" rx="14"/>') + T(180, 300, '一杯水', { cls: 'tm', fs: 12.5, k: 'cupL' }) +
      g('drop', drop) + g('spread', spread) +
      chip(470, 128, '像擠滿人的捷運車廂', '門一開，人自然往空的車廂走', 'cM', { fs: 12.5 }) +
      gradientBar(340, 170, 240, 80, 'bar', 'bdots', 9) +
      g('ar', arrow(560, 272, 380, 272, null, 'lna') + T(470, 292, '從擠的地方往空的地方', { cls: 'ta', fs: 12.5 })) +
      chip(320, 318, '被濃度差擠著跑 = 擴散 diffusion', '不需要電場', 'cD', { fs: 13, acc: true }),
    steps: [
      { sub: '第二個原因：<b>被擠</b>。滴一滴墨水到水裡 ——', on: 'cup cupL drop' },
      { sub: '沒有人推它，它自己就會從<b>濃的地方往稀的地方</b>散開。', off: 'drop', on: 'spread' },
      { sub: '像擠滿人的捷運車廂，門一打開，人自然往空的車廂走。', on: 'cM' },
      { sub: '半導體裡的載子也一樣：哪邊擠就往空的那邊跑。這叫<b>擴散</b> —— <b>不需要電場</b>。', on: 'bar bdots ar cD' }
    ]
  };

  /* ════════════ 15 擴散的方向 ════════════ */
  function panel(x0, kind) {
    const isN = kind === 'n', key = kind;
    let s = arrow(x0, 228, x0 + 240, 228, null, 'ln') + arrow(x0, 228, x0, 92, null, 'ln') +
      T(x0 + 6, 88, isN ? '電子濃度' : '電洞濃度', { cls: 'tm', fs: 12, a: 'start' }) + T(x0 + 244, 242, 'x', { cls: 'ts', fs: 12 }) +
      '<line class="lna" x1="' + (x0 + 20) + '" y1="214" x2="' + (x0 + 220) + '" y2="108" style="stroke-width:2.6"/>' +
      T(x0 + 120, 120, '右邊擠', { cls: 'ta', fs: 12.5, a: 'end' });
    let dots = '';
    [[0.78, 0.66], [0.9, 0.5], [0.66, 0.78], [0.86, 0.82], [0.55, 0.86], [0.95, 0.72], [0.72, 0.9]].forEach(([a, b]) => {
      const x = x0 + 20 + a * 200, y = 108 + b * 110;
      dots += isN ? e(x, y, null, 4.4) : h(x, y, null, 4.8);
    });
    return g(key + 'p', s + dots) +
      g(key + 'f', arrow(x0 + 170, 256, x0 + 70, 256, null, 'ln') + T(x0 + 180, 256, '往左擠', { cls: 't', fs: 12, a: 'start', dy: '.35em' })) +
      g(key + 'j', isN ? arrow(x0 + 70, 280, x0 + 170, 280, null, 'lna') + T(x0 + 180, 280, '電流往右', { cls: 'ta', fs: 12.5, a: 'start', dy: '.35em' })
        : arrow(x0 + 170, 280, x0 + 70, 280, null, 'lna') + T(x0 + 180, 280, '電流往左', { cls: 'ta', fs: 12.5, a: 'start', dy: '.35em' }));
  }
  const S15 = {
    t: '擴散往哪走？', en: 'DIRECTION OF DIFFUSION',
    svg: panel(50, 'p') + panel(350, 'n') +
      chip(170, 316, 'Jₚ = −eDₚ · dp/dx', '電洞：負號', 'pF', { fs: 13 }) + chip(470, 316, 'Jₙ = +eDₙ · dn/dx', '電子：正號', 'nF', { fs: 13 }) +
      chip(320, 316, '記法：電子 +、電洞 −', '電子帶負電，多變號一次', 'mem', { fs: 13, acc: true }),
    steps: [
      { sub: '擴散的方向很簡單：<b>永遠從擠往空</b>。兩張圖都是右邊擠，所以兩種載子都<b>往左</b>跑。', on: 'pp pf np nf' },
      { sub: '電洞帶正電，往左跑 → 電流<b>往左</b>。', on: 'pj' },
      { sub: '電子帶負電，往左跑 → 電流卻<b>往右</b>（又是負負得正）。', on: 'nj' },
      { sub: '寫成公式時，這個差別變成正負號：電洞有個<b>負號</b>、電子是<b>正號</b>。', on: 'pF nF' },
      { sub: '一句話記住：<b>電子 +、電洞 −</b>。', off: 'pF nF', on: 'mem' }
    ]
  };

  /* ════════════ 16 擠得多兇？ ════════════ */
  const S16 = {
    t: '擠得多兇？', en: 'HOW STRONG IS DIFFUSION',
    svg: gradientBar(60, 120, 240, 80, 'b1', 'd1', 4, 0.8, 45) + gradientBar(340, 120, 240, 80, 'b2', 'd2', 6, 0.18, 45) +
      T(180, 112, '差一點點：慢慢散', { cls: 'tm', fs: 13, k: 'l1' }) + T(460, 112, '差很多、距離又短：擠得很兇', { cls: 'ta', fs: 13, k: 'l2' }) +
      g('a1', arrow(240, 222, 120, 222, null, 'ln')) + g('a2', '<g class="lna" style="stroke-width:4">' + arrow(540, 222, 380, 222, null, 'lna') + '</g>') +
      chip(180, 270, '① 濃度梯度 dn/dx', '濃度差 ÷ 距離', 'cG', { fs: 12.5 }) +
      chip(460, 270, '② 擴散係數 D', '矽：電子 35、電洞 12 cm²/s', 'cDk', { fs: 12.5 }) +
      T(320, 318, '擴散電流 = e × D × 梯度', { cls: 'ta', fs: 18, k: 'f' }),
    steps: [
      { sub: '擠得多兇，看兩件事。第一：<b>濃度差有多陡</b>。', on: 'b1 d1 b2 d2 l1 l2' },
      { sub: '差得越多、距離越短，就擠得越兇。這叫<b>濃度梯度</b>。', on: 'a1 a2 cG' },
      { sub: '第二：載子本身多會散，叫<b>擴散係數 D</b>。矽的電子 35、電洞 12 cm²/s。', on: 'cDk' },
      { sub: '合起來：<b>擴散電流 = e × D × 梯度</b>。', on: 'f' }
    ]
  };

  /* ════════════ 17 四項全家福 ════════════ */
  function cell(x, y, top, f, key) {
    return g(key, '<rect class="card" x="' + (x - 105) + '" y="' + (y - 34) + '" width="210" height="68" rx="10" filter="url(#st-sh)"/>' +
      T(x, y, f + ' ' + top, { cls: 'ta', fs: 16, dy: '.35em' }));
  }
  const S17 = {
    t: '總電流：兩招 × 兩種載子', en: 'TOTAL CURRENT DENSITY',
    svg: T(240, 104, '被推（漂移）', { fs: 14, k: 'h1' }) + T(470, 104, '被擠（擴散）', { fs: 14, k: 'h2' }) +
      T(96, 160, '電子', { fs: 14, a: 'end', k: 'r1' }) + T(96, 246, '電洞', { fs: 14, a: 'end', k: 'r2' }) +
      cell(240, 160, 'e·n·μₙ·E', '+', 'c1') + cell(470, 160, 'e·Dₙ·dn/dx', '+', 'c2') +
      cell(240, 246, 'e·p·μₚ·E', '+', 'c3') + cell(470, 246, 'e·Dₚ·dp/dx', '−', 'c4') +
      chip(355, 318, '實際上通常只有一項是主角', '例：N 型加電場 → 只算電子漂移', 'dom', { fs: 13, acc: true }),
    steps: [
      { sub: '整理一下：兩個原因 × 兩種載子 = <b>四項</b>。', on: 'h1 h2 r1 r2' },
      { sub: '被推（漂移）：電子、電洞都是 <b>+</b>，因為電流都順著電場。', on: 'c1 c3' },
      { sub: '被擠（擴散）：電子 <b>+</b>、電洞 <b>−</b>。', on: 'c2 c4' },
      { sub: '全部加起來就是總電流。好消息：實際上<b>通常只有一項是主角</b>。', on: 'dom' }
    ]
  };

  /* ════════════ 20 恍然大悟 ════════════ */
  const S20 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: gradientBar(120, 96, 400, 84, 'bar', 'dots', 5) + T(320, 168, '?', { cls: 'ta', fs: 70, k: 'q' }) +
      g('ar', arrow(480, 200, 160, 200, null, 'lna') + T(320, 220, '電子從擠的地方往空的地方擠', { cls: 'ta', fs: 13 })) +
      T(320, 246, 'Jₙ = eDₙ · dn/dx = 1.6×10⁻¹⁹ × 35 × (10¹⁶ ÷ 3 μm) ≈ 187 A/cm²', { cls: 't', fs: 15, k: 'f' }) +
      chip(320, 282, '謎題解開了 ✓', '不需要電池：濃度差本身就能推出電流', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, '下一段 PART 3：先補兩塊拼圖，再把 P、N 接起來', '「推」和「擠」會在接面上打一場拉鋸戰', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：沒接電池，電流從哪來？', on: 'bar dots q', op: { dots: 0.25 } },
      { sub: '答案是第二招 <b>擠</b>（擴散）：電子從右邊擠的地方，往左邊空的地方跑。', off: 'q', on: 'ar', op: { dots: 1 } },
      { sub: '課本的數字：濃度差 10¹⁶ 擠在 3 μm 裡，擠得超兇 → <b>187 A/cm²</b>。<b>謎題解開了。</b>', on: 'f ans' },
      { sub: '下一段 PART 3：先補兩塊小拼圖，再把 P 型跟 N 型接在一起 —— 「推」和「擠」會打一場<b>拉鋸戰</b>。', off: 'ans', on: 'next' }
    ]
  };

  window.__ch1p2Story = window.__Story('#story', {
    id: 'ch1-part2', title: 'CH1 PART 2 載子怎麼動', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S20]
  });
})();
