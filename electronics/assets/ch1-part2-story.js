/* ============================================================
   電子學 CH1 PART 2（＋ PART 3 投影片 1-1～1-18）—— 故事模式
   主線謎題：一塊矽兩端什麼都沒接，裡面卻有 187 A/cm² 的電流（課本 Example 1.4）。
   答案：擴散。沿途建立 P 型、質量作用定律、I 與 J、漂移、導電度、擴散、愛因斯坦關係、多出載子。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { e, h, atom, line, text, arrow, chip, lattice } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280);
  const sup = s => '<tspan font-size="9" dy="-6">' + s + '</tspan><tspan dy="6"></tspan>';
  const ring = (x, y, sign, key) => g(key, '<circle class="ring" cx="' + x + '" cy="' + y + '" r="8"/>' + T(x, y, sign, { cls: 'ta', fs: 12, dy: '.35em' }));

  /* 濃度漸層的一條半導體：左稀右濃 */
  function gradientBar(x0, y0, w, hh, key, dotsKey, seed) {
    const r = rnd(seed || 3);
    let dots = '';
    for (let i = 0; i < 70; i++) {
      const t = Math.pow(r(), 0.45);                      /* 越靠右越密 */
      dots += e((x0 + 8 + t * (w - 16)).toFixed(1), (y0 + 8 + r() * (hh - 16)).toFixed(1), null, 3.6);
    }
    return g(key, '<rect class="bgw" x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + hh + '" rx="10"/>') + g(dotsKey, dots);
  }

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '沒接電池的電流', en: 'THE QUESTION',
    svg: gradientBar(120, 130, 400, 90, 'bar', 'dots', 5) +
      g('ends', '<line class="ln" x1="98" y1="175" x2="120" y2="175"/><line class="ln" x1="520" y1="175" x2="542" y2="175"/>' +
        '<circle class="bgw" cx="94" cy="175" r="4"/><circle class="bgw" cx="546" cy="175" r="4"/>') +
      chip(320, 96, '沒有電池・沒有電場', '兩端什麼都沒接', 'nobat', { fs: 13 }) +
      T(140, 246, 'n = 10' + sup(12), { cls: 'tm', fs: 13, k: 'nl' }) + T(500, 246, 'n = 10' + sup(16), { cls: 'ta', fs: 13, k: 'nr' }) +
      g('ruler', '<path class="ln2" d="M130 262 V270 H510 V262"/>') + T(320, 286, '3 μm', { cls: 'ts', fs: 12, k: 'rl' }) +
      T(320, 326, 'J = 187 A/cm²', { cls: 'ta', fs: 26, k: 'J' }) +
      T(320, 232, '?', { cls: 'ta', fs: 120, k: 'q' }),
    steps: [
      { sub: '一塊矽，兩端什麼都沒接 —— <b>沒有電池，也沒有電場</b>。', on: 'bar ends nobat' },
      { sub: '可是裡面的電子分布不均勻：左邊每立方公分 10¹² 個，3 μm 外的右邊有 <b>10¹⁶</b> 個。', on: 'dots nl nr ruler rl' },
      { sub: '照課本 Example 1.4 算，這裡有 <b>187 A/cm²</b> 的電流密度 —— 跟接上電場的電流一樣大。', on: 'J' },
      { sub: '沒有電池，電流從哪來？這一段就要搞懂：載子會動，只有<b>兩個原因</b>。', op: { bar: 0.15, dots: 0.15, ends: 0.15, nobat: 0.15, nl: 0.15, nr: 0.15, ruler: 0.15, rl: 0.15, J: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 P 型 ════════════ */
  const hbX = 320 + 70 * 0.36, e1x = 390, e1y = 200 + 70 * 0.36;
  const S1 = {
    t: 'P 型半導體', en: 'P-TYPE · ACCEPTOR',
    svg: lattice(250, 130, 3, 3, 70, 'L', { sym: { '1,1': 'B' }, skip: { 'L-e-1-1-h-0': 1, 'L-e-2-1-v-0': 1 }, keyed: ['L-a-1-1'] }) +
      h(hbX, 200, 'hb', 5.5) + e(e1x, e1y, 'e1', 4) +
      g('bm', '<circle class="ring" cx="320" cy="200" r="19"/>' + T(338, 184, '−', { cls: 'ta', fs: 16 })) +
      chip(470, 128, '少一個電子', '硼只有 3 個價電子', 'cMiss', { fs: 12.5 }) +
      chip(470, 300, '電洞 ⊕ 可以到處跑', '多數載子', 'cHole', { fs: 12.5 }) +
      chip(150, 300, 'B⁻ 固定負離子', '受體 acceptor', 'cB', { fs: 12.5 }) +
      T(150, 120, 'P 型', { cls: 'ta', fs: 22, k: 'P' }) + T(150, 142, 'Positive', { cls: 'ts', fs: 11, k: 'P2' }),
    steps: [
      { sub: 'PART 1 摻的是 5 價的磷。這次換成 <b>3 價的硼 B</b>。', on: 'L-b L-e L-a L-a-1-1 e1' },
      { sub: '硼只有 3 個價電子，跟 4 個鄰居配對時，<b>少了一個</b>。', on: 'hb cMiss' },
      { sub: '旁邊鍵上的電子很容易跳過來補 —— 空位就移到別處，變成可以到處跑的<b>電洞</b>。', mv: { e1: [hbX - e1x, 200 - e1y], hb: [e1x - hbX, e1y - 200] }, on: 'cHole', off: 'cMiss' },
      { sub: '硼多收了一個電子，變成固定不動的負離子 <b>B⁻</b>。它「接受」電子，所以叫<b>受體</b>。', on: 'bm cB' },
      { sub: '多出來的是帶<b>正電</b>的電洞 → <b>P 型半導體</b>（Positive）。', on: 'P P2' }
    ]
  };

  /* ════════════ 02 N vs P ════════════ */
  function box(x0, kind, key, seed) {
    const r = rnd(seed); let s = '<rect class="bgw" x="' + x0 + '" y="104" width="230" height="150" rx="10"/>';
    let carriers = '', ions = '', minor = '';
    [[0.18, 0.25], [0.5, 0.2], [0.8, 0.3], [0.3, 0.7], [0.66, 0.66], [0.15, 0.85], [0.88, 0.82]].forEach(([a, b]) => {
      ions += ring(x0 + 15 + a * 200, 116 + b * 126, kind === 'n' ? '+' : '−');
    });
    for (let i = 0; i < 13; i++) {
      const x = x0 + 16 + r() * 198, y = 118 + r() * 124;
      carriers += kind === 'n' ? e(x.toFixed(1), y.toFixed(1), null, 4.6) : h(x.toFixed(1), y.toFixed(1), null, 5);
    }
    minor = kind === 'n' ? h(x0 + 120, 186, null, 5) : e(x0 + 112, 180, null, 4.6);
    return g(key, s) + g(key + 'i', ions) + g(key + 'c', carriers, ' class="shake"') + g(key + 'm', minor);
  }
  const S2 = {
    t: 'N 型 vs P 型', en: 'N-TYPE VS P-TYPE',
    svg: box(60, 'n', 'N', 11) + box(350, 'p', 'P', 23) +
      T(175, 94, 'N 型（摻磷 P）', { fs: 14, k: 'Nl' }) + T(465, 94, 'P 型（摻硼 B）', { fs: 14, k: 'Pl' }) +
      chip(175, 284, '多數：電子　少數：電洞', '固定離子 P⁺', 'Nch', { fs: 12.5 }) +
      chip(465, 284, '多數：電洞　少數：電子', '固定離子 B⁻', 'Pch', { fs: 12.5 }) +
      chip(320, 322, '兩種都仍然電中性', '離子電荷 = 多出載子的電荷', 'neu', { fs: 12.5, acc: true }),
    steps: [
      { sub: '把兩種摻雜放在一起看：', on: 'N Ni Nc Nl P Pi Pc Pl' },
      { sub: '<b>N 型</b>：施體 P⁺ 固定不動，電子是多數載子，電洞是少數載子。', on: 'Nch Nm', op: { P: 0.3, Pi: 0.3, Pc: 0.3, Pl: 0.3 } },
      { sub: '<b>P 型</b>：受體 B⁻ 固定不動，電洞是多數載子，電子是少數載子。', on: 'Pch Pm', op: { N: 0.3, Ni: 0.3, Nc: 0.3, Nl: 0.3, Nm: 0.3, Nch: 0.3, P: 1, Pi: 1, Pc: 1, Pl: 1 } },
      { sub: '兩種都還是<b>電中性</b>：固定離子的電荷，剛好抵消多出來的載子。', on: 'neu', op: { N: 1, Ni: 1, Nc: 1, Nl: 1, Nm: 1, Nch: 1 } }
    ]
  };

  /* ════════════ 03 質量作用定律 ════════════ */
  const RX3 = lg => 70 + lg / 20 * 500, ry3 = 236, niX = RX3(10.18);
  let rul = line(70, ry3, 570, ry3, null, 'ln');
  for (let d = 0; d <= 20; d += 2) rul += line(RX3(d), ry3, RX3(d), ry3 + 6, null, 'ln') + T(RX3(d), ry3 + 22, '10' + sup(d), { cls: 'ts mono', fs: 10 });
  const up = (x, lab, key, lk) => g(key, '<polygon class="acc" points="' + (x - 6) + ',' + (ry3 - 10) + ' ' + (x + 6) + ',' + (ry3 - 10) + ' ' + x + ',' + ry3 + '"/>' +
    line(x, ry3 - 34, x, ry3 - 10, null, 'lna') + T(x, ry3 - 42, lab, { cls: 'ta', fs: 13, k: lk }));
  const dn = (x, lab, key, lk) => g(key, '<polygon class="ink" points="' + (x - 6) + ',' + (ry3 + 40) + ' ' + (x + 6) + ',' + (ry3 + 40) + ' ' + x + ',' + (ry3 + 30) + '"/>' +
    line(x, ry3 + 40, x, ry3 + 58, null, 'ln') + T(x, ry3 + 74, lab, { fs: 13, k: lk }));
  const S3 = {
    t: '質量作用定律', en: 'LAW OF MASS ACTION',
    svg: T(320, 112, 'n · p = n<tspan font-size="14" dy="5">i</tspan><tspan font-size="13" dy="-13">2</tspan>', { cls: 't', fs: 30, k: 'f' }) +
      chip(320, 150, '熱平衡時永遠成立', '不管摻什麼、摻多少', 'cf', { fs: 12.5 }) +
      g('ru', rul) + line(niX, ry3 - 70, niX, ry3 + 4, 'niL', 'ln2 dsh') + T(niX, ry3 - 78, 'nᵢ', { cls: 'ts', fs: 13, k: 'niT' }) +
      up(niX, 'n', 'nm', 'nmT') + dn(niX, 'p', 'pm', 'pmT') +
      g('br', '<path class="lna" d="M' + niX + ' 176 H' + RX3(16) + '"/>' + T((niX + RX3(16)) / 2, 168, '+5.8 個 0', { cls: 'ta', fs: 12 }) +
        '<path class="ln" d="M' + niX + ' 336 H' + RX3(4.35) + '" style="stroke-dasharray:4 4"/>' + T((niX + RX3(4.35)) / 2, 350, '−5.8 個 0', { fs: 12 })),
    steps: [
      { sub: '熱平衡時有一條鐵律：<b>n·p = nᵢ²</b> —— 不管摻什麼、摻多少。', on: 'f cf' },
      { sub: '純矽：n = p = nᵢ = 1.5×10¹⁰，兩個都站在正中間。', on: 'ru niL niT nm pm nmT pmT', off: 'cf' },
      { sub: '摻施體到 N<sub>d</sub> = 10¹⁶：電子衝上去，電洞就被壓到只剩 <b>2.25×10⁴</b>。', mv: { nm: [RX3(16) - niX, 0], pm: [RX3(4.35) - niX, 0] },
        txt: { nmT: 'n = 10¹⁶', pmT: 'p = 2.25×10⁴' } },
      { sub: '在對數尺上看：兩者永遠<b>對稱地站在 nᵢ 兩邊</b> —— 一個多幾個 0，另一個就少幾個 0。', on: 'br' }
    ]
  };

  /* ════════════ 04 I 與 J ════════════ */
  let car4 = '';
  for (let i = 0; i < 12; i++) car4 += e(118 + i * 38, 150 + ((i * 7) % 3) * 14, null, 5);
  const S4 = {
    t: '電流 I 與電流密度 J', en: 'CURRENT · CURRENT DENSITY',
    svg: '<defs><clipPath id="st-c4"><rect x="100" y="130" width="440" height="62" rx="31"/></clipPath></defs>' +
      g('pipe', '<rect class="bgw" x="100" y="130" width="440" height="62" rx="31"/>') +
      g('car', car4, ' clip-path="url(#st-c4)" style="--run:38px"') +
      g('plane', '<ellipse cx="400" cy="161" rx="11" ry="31" class="accw" style="stroke:var(--s-acc);stroke-width:1.8;stroke-dasharray:4 3"/>') +
      T(400, 118, '截面 A', { cls: 'ta', fs: 12.5, k: 'planeL' }) +
      chip(200, 250, '電流 I = Q / t', '每秒通過「整個截面」的電荷', 'cI', { fs: 13 }) +
      g('unit', '<rect x="391" y="152" width="18" height="18" class="acc" opacity=".55"/>') +
      chip(452, 250, '電流密度 J = I / A', '每秒通過「每 1 cm²」的電荷', 'cJ', { fs: 13 }) +
      T(320, 308, 'J = q·p·v = q·p·μ·E', { cls: 'ta', fs: 20, k: 'f' }) +
      chip(320, 308, '50 μm 見方 × 187 A/cm² ≈ 4.7 mA', 'J 很大，實際電流不一定大', 'cA', { fs: 13 }),
    steps: [
      { sub: '要講電流，先分清兩個量。<b>電流 I</b>：每秒通過整個截面的電荷。', on: 'pipe car plane planeL cI', cls: { car: 'conv' } },
      { sub: '<b>電流密度 J</b>：每秒通過「每一平方公分」的電荷。J = I / A。', on: 'unit cJ' },
      { sub: '推導下去，長度和面積都會消掉：<b>J 只跟載子濃度、速度（電場）有關</b>，跟元件大小無關。', on: 'f' },
      { sub: '所以物理公式都寫 J。實際元件只有 50 μm 見方，187 A/cm² 只對應 <b>約 4.7 mA</b>。', off: 'f', on: 'cA' }
    ]
  };

  /* ════════════ 05 漂移 ════════════ */
  let hs5 = '', es5 = '';
  for (let i = 0; i < 10; i++) { hs5 += h(68 + i * 50, 156, null, 6); es5 += e(80 + i * 50, 198, null, 5.5); }
  const S5 = {
    t: '漂移：電場推著跑', en: 'DRIFT CURRENT',
    svg: '<defs><clipPath id="st-c5"><rect x="100" y="132" width="440" height="92" rx="10"/></clipPath></defs>' +
      g('bar', '<rect class="bgw" x="100" y="132" width="440" height="92" rx="10"/>') +
      g('E', arrow(180, 106, 460, 106, null, 'ln') + T(470, 106, 'E', { fs: 18, a: 'start', dy: '.35em' })) +
      g('hs', hs5, ' clip-path="url(#st-c5)" style="--run:50px"') +
      g('es', es5, ' clip-path="url(#st-c5)" style="--run:-50px"') +
      T(90, 160, '電洞 →', { cls: 'ta', fs: 12, a: 'end', k: 'hl' }) + T(90, 202, '← 電子', { cls: 'ta', fs: 12, a: 'end', k: 'el' }) +
      g('J', arrow(200, 254, 330, 254, null, 'lna') + T(340, 254, 'J（電洞）', { cls: 'ta', fs: 12.5, a: 'start', dy: '.35em' }) +
        arrow(200, 282, 330, 282, null, 'lna') + T(340, 282, 'J（電子）：負負得正，也往右', { cls: 'ta', fs: 12.5, a: 'start', dy: '.35em' })) +
      T(320, 324, 'J = e(nμ<tspan font-size="11" dy="4">n</tspan><tspan dy="-4"> + pμ</tspan><tspan font-size="11" dy="4">p</tspan><tspan dy="-4">)·E</tspan>', { cls: 'ta', fs: 20, k: 'f' }),
    steps: [
      { sub: '第一個原因：<b>電場</b>。接上電池，半導體裡就有電場 E。', on: 'bar E' },
      { sub: '電洞帶正電，<b>順著</b>電場往右跑。', on: 'hs hl', cls: { hs: 'conv' } },
      { sub: '電子帶負電，<b>逆著</b>電場往左跑。', on: 'es el', cls: { es: 'conv' } },
      { sub: '電流方向呢？電洞往右 = 電流往右；電子往左，但帶負電，<b>負負得正</b> —— 電流<b>也往右</b>。', on: 'J' },
      { sub: '兩種載子的漂移電流同方向，可以直接<b>相加</b>。這叫<b>漂移電流</b>。', on: 'f' }
    ]
  };

  /* ════════════ 06 導電度 ════════════ */
  const S6 = {
    t: '導電度 σ', en: 'CONDUCTIVITY',
    svg: T(320, 110, 'σ = e(nμ<tspan font-size="12" dy="4">n</tspan><tspan dy="-4"> + pμ</tspan><tspan font-size="12" dy="4">p</tspan><tspan dy="-4">)　⟹　J = σE</tspan>', { cls: 't', fs: 22, k: 'f' }) +
      chip(320, 148, '括號裡完全沒有 E', '只跟材料（濃度 × 移動率）有關', 'cf', { fs: 12.5 }) +
      T(96, 196, 'nμ<tspan font-size="10" dy="3">n</tspan>', { fs: 15, a: 'end', k: 'b1l' }) + g('b1', '<rect class="acc" x="106" y="184" width="420" height="22" rx="4"/>') +
      T(96, 236, 'pμ<tspan font-size="10" dy="3">p</tspan>', { fs: 15, a: 'end', k: 'b2l' }) + g('b2', '<rect class="ink" x="106" y="224" width="1.5" height="22"/>') +
      T(116, 236, '小 11 個數量級 → 看不見', { cls: 'ts', fs: 12, a: 'start', dy: '.35em', k: 'b2t' }) +
      chip(320, 270, 'n 型：σ ≅ eμₙn', 'Example 1.3：σ = 1.6×10⁻¹⁹ × 1350 × 8×10¹⁵ = 1.73 (Ω·cm)⁻¹', 'c13', { fs: 13 }) +
      T(320, 318, 'E = 100 V/cm　⟹　J = σE = 173 A/cm²', { cls: 'ta', fs: 17, k: 'J' }),
    steps: [
      { sub: '把電場 E 提出來，剩下的只跟材料有關，叫<b>導電度</b> σ。倒數 ρ = 1/σ 是<b>電阻率</b>。', on: 'f cf' },
      { sub: 'N 型（N<sub>d</sub> = 8×10¹⁵）：電子 8×10¹⁵、電洞只有 2.8×10⁴ —— 電洞那項小到看不見。', on: 'b1 b1l b2 b2l b2t', off: 'cf' },
      { sub: '所以 n 型直接用 <b>σ ≅ eμₙn</b>：算出 1.73 (Ω·cm)⁻¹。', on: 'c13' },
      { sub: '加 100 V/cm 的電場：<b>J = 173 A/cm²</b>。摻越多 → σ 越大 → 同樣電場電流越大。', on: 'J' }
    ]
  };

  /* ════════════ 07 擴散 ════════════ */
  const r7 = rnd(17); let drop = '', spread = '';
  for (let i = 0; i < 26; i++) {
    const a = r7() * Math.PI * 2, rr = Math.sqrt(r7());
    drop += '<circle class="e" cx="' + (180 + Math.cos(a) * rr * 22).toFixed(1) + '" cy="' + (190 + Math.sin(a) * rr * 22).toFixed(1) + '" r="4"/>';
    spread += '<circle class="e" cx="' + (180 + Math.cos(a) * rr * 105).toFixed(1) + '" cy="' + (190 + Math.sin(a) * rr * 80).toFixed(1) + '" r="4"/>';
  }
  const S7 = {
    t: '擴散：濃度差推著跑', en: 'DIFFUSION CURRENT',
    svg: g('cup', '<rect class="bgw" x="60" y="100" width="240" height="180" rx="14"/>') + T(180, 300, '一滴墨水', { cls: 'tm', fs: 12.5, k: 'cupL' }) +
      g('drop', drop) + g('spread', spread) +
      gradientBar(340, 140, 240, 90, 'bar', 'bdots', 9) +
      g('ar', arrow(560, 112, 380, 112, null, 'lna') + T(470, 102, '從濃往稀', { cls: 'ta', fs: 12 })) +
      chip(460, 270, '濃度梯度 dn/dx', '濃度隨位置的變化率', 'cG', { fs: 12.5 }) +
      chip(460, 320, '擴散係數 D', '矽：電子 35、電洞 12 cm²/s', 'cD', { fs: 12.5 }),
    steps: [
      { sub: '第二個原因：<b>擴散</b>。滴一滴墨水到水裡 ——', on: 'cup cupL drop' },
      { sub: '沒有人推它，它自己就會從<b>濃的地方往稀的地方</b>散開。', off: 'drop', on: 'spread' },
      { sub: '半導體裡的載子也一樣：只要濃度不均勻（有<b>濃度梯度</b>），就會擴散。', on: 'bar bdots ar cG' },
      { sub: '散得多快看兩件事：梯度有多陡，和<b>擴散係數 D</b>。這種流動形成的電流叫<b>擴散電流</b>。', on: 'cD' }
    ]
  };

  /* ════════════ 08 擴散的正負號 ════════════ */
  function panel(x0, kind) {
    const isN = kind === 'n', key = kind;
    let s = arrow(x0, 228, x0 + 240, 228, null, 'ln') + arrow(x0, 228, x0, 92, null, 'ln') +
      T(x0 + 6, 88, isN ? '電子濃度 n' : '電洞濃度 p', { cls: 'tm', fs: 12, a: 'start' }) + T(x0 + 244, 242, 'x', { cls: 'ts', fs: 12 }) +
      '<line class="lna" x1="' + (x0 + 20) + '" y1="214" x2="' + (x0 + 220) + '" y2="108" style="stroke-width:2.6"/>' +
      T(x0 + 110, 116, isN ? 'dn/dx > 0' : 'dp/dx > 0', { cls: 'ta', fs: 12.5, a: 'end' });
    let dots = '';
    [[0.78, 0.66], [0.9, 0.5], [0.66, 0.78], [0.86, 0.82], [0.55, 0.86], [0.95, 0.72], [0.72, 0.9]].forEach(([a, b]) => {
      const x = x0 + 20 + a * 200, y = 108 + b * 110;
      dots += isN ? e(x, y, null, 4.4) : h(x, y, null, 4.8);
    });
    return g(key + 'p', s + dots) +
      g(key + 'f', arrow(x0 + 170, 256, x0 + 70, 256, null, 'ln') + T(x0 + 180, 256, '擴散', { cls: 't', fs: 12, a: 'start', dy: '.35em' })) +
      g(key + 'j', isN ? arrow(x0 + 70, 280, x0 + 170, 280, null, 'lna') + T(x0 + 180, 280, 'Jₙ 往右', { cls: 'ta', fs: 12.5, a: 'start', dy: '.35em' })
        : arrow(x0 + 170, 280, x0 + 70, 280, null, 'lna') + T(x0 + 180, 280, 'Jₚ 往左', { cls: 'ta', fs: 12.5, a: 'start', dy: '.35em' }));
  }
  const S8 = {
    t: '擴散的正負號', en: 'SIGN OF DIFFUSION CURRENT',
    svg: panel(50, 'p') + panel(350, 'n') +
      chip(170, 316, 'Jₚ = −eDₚ · dp/dx', null, 'pF', { fs: 13 }) + chip(470, 316, 'Jₙ = +eDₙ · dn/dx', null, 'nF', { fs: 13 }) +
      chip(320, 316, '記法：電子 +、電洞 −', '電子帶負電，多變號一次', 'mem', { fs: 13, acc: true }),
    steps: [
      { sub: '擴散方向很好判斷：<b>永遠從濃往稀</b>。兩張圖都是往 +x 越濃，所以兩種載子都往左擴散。', on: 'pp pf np nf' },
      { sub: '電洞帶正電：往左擴散，電流<b>也往左</b> —— 跟 dp/dx 反號，所以公式有個<b>負號</b>。', on: 'pj pF' },
      { sub: '電子帶負電：往左擴散，電流卻<b>往右</b> —— 跟 dn/dx 同號，公式是<b>正號</b>。', on: 'nj nF' },
      { sub: '一句話記住：<b>電子 +、電洞 −</b>。電子多帶一次負號，就多變號一次。', off: 'pF nF', on: 'mem' }
    ]
  };

  /* ════════════ 09 四項全家福 ════════════ */
  function cell(x, y, top, f, key) {
    return g(key, '<rect class="card" x="' + (x - 105) + '" y="' + (y - 34) + '" width="210" height="68" rx="10" filter="url(#st-sh)"/>' +
      T(x, y, f + ' ' + top, { cls: 'ta', fs: 16, dy: '.35em' }));
  }
  const S9 = {
    t: '總電流：四項全家福', en: 'TOTAL CURRENT DENSITY',
    svg: T(240, 104, '漂移（電場）', { fs: 14, k: 'h1' }) + T(470, 104, '擴散（濃度差）', { fs: 14, k: 'h2' }) +
      T(96, 160, '電子', { fs: 14, a: 'end', k: 'r1' }) + T(96, 246, '電洞', { fs: 14, a: 'end', k: 'r2' }) +
      cell(240, 160, 'e·n·μₙ·E', '+', 'c1') + cell(470, 160, 'e·Dₙ·dn/dx', '+', 'c2') +
      cell(240, 246, 'e·p·μₚ·E', '+', 'c3') + cell(470, 246, 'e·Dₚ·dp/dx', '−', 'c4') +
      chip(355, 318, '通常只有一項主導', '例：n 型的漂移 → 只算電子漂移', 'dom', { fs: 13, acc: true }),
    steps: [
      { sub: '兩個機制 × 兩種載子 = <b>四項</b>。', on: 'h1 h2 r1 r2' },
      { sub: '漂移：電子、電洞都是 <b>+</b>，因為電流都順著電場。', on: 'c1 c3' },
      { sub: '擴散：電子 <b>+</b>、電洞 <b>−</b>（上一個畫面的結論）。', on: 'c2 c4' },
      { sub: '全部加起來就是總電流密度。好消息：實際上<b>通常只有一項主導</b>，不用四項都算。', on: 'dom' }
    ]
  };

  /* ════════════ 10 愛因斯坦關係 ════════════ */
  const zig = (x0, y0, steps, key, cls) => {
    let d = 'M' + x0 + ' ' + y0, x = x0, y = y0; const r = rnd(steps * 7);
    for (let i = 0; i < steps; i++) { x += 8 + r() * 14; y = y0 + (r() - 0.5) * 34; d += ' L' + x.toFixed(1) + ' ' + y.toFixed(1); }
    return '<path class="' + cls + '" d="' + d + '"' + k(key) + '/>';
  };
  const S10 = {
    t: '愛因斯坦關係', en: 'EINSTEIN RELATION',
    svg: chip(170, 104, 'μ 移動率', '被電場推，跑得多快', 'cMu', { fs: 13 }) + chip(470, 104, 'D 擴散係數', '自己亂逛，散得多遠', 'cD', { fs: 13 }) +
      zig(70, 176, 26, 'z1', 'lna') + T(70, 150, '撞得少：兩個都快', { cls: 'ta', fs: 12, a: 'start', k: 'z1l' }) +
      zig(70, 236, 10, 'z2', 'ln') + T(70, 210, '撞得多：兩個都慢', { cls: 't', fs: 12, a: 'start', k: 'z2l' }) +
      T(320, 276, 'D / μ = kT / e ≈ 0.026 V', { cls: 'ta', fs: 26, k: 'f' }) +
      chip(320, 316, '35/1350 ≈ 12/480 ≈ 0.026 ✓', '這個 kT/e 下一段改名叫「熱電壓 V_T」', 'chk', { fs: 12.5 }),
    steps: [
      { sub: '移動率 μ（被推得多快）跟擴散係數 D（自己散得多快），看起來是兩件事。', on: 'cMu cD' },
      { sub: '但都取決於同一件事：<b>載子在晶格裡亂撞的難易程度</b>。撞得少的，兩個都快。', on: 'z1 z1l z2 z2l' },
      { sub: '所以兩者的比值固定：<b>D/μ = kT/e</b>，室溫約 0.026 V，<b>只跟溫度有關</b>。', on: 'f' },
      { sub: '驗算課本數字：35/1350 ≈ 12/480 ≈ 0.026 ✓。這個 kT/e 下一段會改名叫<b>熱電壓 V<sub>T</sub></b>。', on: 'chk' }
    ]
  };

  /* ════════════ 11 多出載子 ════════════ */
  const r11 = rnd(29); let maj = '', pairsE = '', pairsH = '', flash = '';
  for (let i = 0; i < 30; i++) maj += '<circle class="ink3" cx="' + (78 + r11() * 254).toFixed(1) + '" cy="' + (128 + r11() * 134).toFixed(1) + '" r="2.4"/>';
  const pp = [[120, 160], [180, 220], [240, 150], [290, 230], [150, 250], [270, 190], [210, 180]];
  pp.forEach(([x, y]) => { pairsE += e(x, y, null, 5); pairsH += h(x + 16, y + 10, null, 5.5); flash += '<circle class="ring" cx="' + (x + 8) + '" cy="' + (y + 5) + '" r="10"/>'; });
  let curve = 'M410 160';
  for (let i = 1; i <= 40; i++) curve += ' L' + (410 + i * 4.5).toFixed(1) + ' ' + (260 - 100 * Math.exp(-i / 11)).toFixed(1);
  const S11 = {
    t: '多出載子', en: 'EXCESS CARRIERS',
    svg: g('box', '<rect class="accw" x="70" y="118" width="270" height="154" rx="10" style="stroke:var(--s-ink);stroke-width:1.4"/>') + g('maj', maj) +
      T(330, 106, 'n 型矽', { cls: 'tm', fs: 12.5, a: 'end', k: 'boxL' }) +
      chip(205, 300, '熱平衡：n·p = nᵢ²', null, 'eq0', { fs: 13 }) +
      g('light', g(null, arrow(118, 82, 140, 116, null, 'lna') + arrow(198, 82, 220, 116, null, 'lna') + arrow(278, 82, 300, 116, null, 'lna'), ' class="glow"')) +
      g('pe', pairsE) + g('ph', pairsH) + g('fl', flash) +
      chip(205, 300, '照光：n·p > nᵢ²', 'δn = δp（成對產生）', 'eq1', { fs: 13, acc: true }) +
      g('ax', arrow(410, 270, 600, 270, null, 'ln') + arrow(410, 270, 410, 140, null, 'ln') + T(600, 286, 't', { cls: 'ts', fs: 12 }) + T(418, 140, 'δn', { cls: 'tm', fs: 12, a: 'start' })) +
      '<path class="lna" d="' + curve + '"' + k('cv') + '/>' +
      chip(505, 318, '生命週期 τ', '過一個 τ 剩約 37%', 'cTau', { fs: 12.5 }),
    steps: [
      { sub: '到目前為止都是<b>熱平衡</b>：n·p = nᵢ²。', on: 'box maj boxL eq0' },
      { sub: '照一道光進去：光子打斷共價鍵，多出一批<b>電子–電洞對</b>。', on: 'light pe ph' },
      { sub: '這時 n·p > nᵢ²，熱平衡被打破。多出來的叫<b>多出載子</b> δn、δp。', off: 'eq0', on: 'eq1' },
      { sub: '關掉光：電子一個個掉回去填電洞（<b>復合</b>），成對消失。', off: 'light pe ph', on: 'fl', cls: { fl: 'pulse' } },
      { sub: '平均能撐多久叫<b>生命週期 τ</b>；多出量隨時間<b>指數衰減</b>，回到熱平衡。', off: 'fl eq1', on: 'ax cv cTau eq0' }
    ]
  };

  /* ════════════ 12 恍然大悟 ════════════ */
  const S12 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: gradientBar(120, 96, 400, 84, 'bar', 'dots', 5) + T(320, 168, '?', { cls: 'ta', fs: 70, k: 'q' }) +
      g('ar', arrow(480, 200, 160, 200, null, 'lna') + T(320, 220, '電子從濃往稀擴散', { cls: 'ta', fs: 13 })) +
      T(320, 254, 'Jₙ = eDₙ·dn/dx = 1.6×10⁻¹⁹ × 35 × (10¹⁶ ÷ 3 μm) ≈ 187 A/cm²', { cls: 't', fs: 15, k: 'f' }) +
      chip(320, 290, '謎題解開了 ✓', '不需要電場，濃度差本身就能推出電流', 'ans', { fs: 13, acc: true }) +
      chip(320, 290, '下一段：pn 接面', '擴散和漂移會在接面上打一場拉鋸戰', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：沒接電池，187 A/cm² 從哪來？', on: 'bar dots q', op: { dots: 0.25 } },
      { sub: '答案是<b>擴散</b>：電子從 10¹⁶ 那邊往 10¹² 這邊擠，不需要電場。', off: 'q', on: 'ar', op: { dots: 1 } },
      { sub: '算一次：濃度差 10¹⁶ 擠在 3 μm 裡，梯度超陡，所以有 <b>187 A/cm²</b>。<b>謎題解開了。</b>', on: 'f ans' },
      { sub: '下一段：把 P 型和 N 型接在一起 —— 擴散和漂移會在接面上打一場<b>拉鋸戰</b>。', off: 'ans', on: 'next' }
    ]
  };

  window.__ch1p2Story = window.__Story('#story', {
    id: 'ch1-part2', title: 'CH1 PART 2 載子輸運', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12]
  });
})();
