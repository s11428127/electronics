/* ============================================================
   電路學 CH11 PART 1 —— 故事模式（11.2 平均功率、11.3 最大功率轉移）
   主線謎題（課本 Example 11.1）：電壓振幅 120 V、電流振幅 10 A，乘起來 1200，
             瓦特計卻只顯示 344 W；換成純電感更是 0 W。為什麼？
   答案：P = ½VmIm cos(θv − θi)，½ 來自取平均、cos 是錯開造成的打折。
   後半：負載怎麼選功率最大 → 共軛匹配（ZTh = 4 + j3、VTh = 10 V：3.125 W vs 2 W vs 2.78 W）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const RAD = Math.PI / 180, TAU = 2 * Math.PI;
  const P = (fn, x0, x1, n) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + fn(x).toFixed(1); } return d; };
  const path = (d, cls, key, extra) => '<path class="' + cls + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  /* 弦波：在 x0 有波峰；lag 度 = 往右錯開 */
  const cosAt = (x, x0, per, lag) => Math.cos(TAU * (x - x0) / per - lag * RAD);
  const sinP = (x0, x1, yc, A, per, lag) => P(x => yc - A * cosAt(x, x0, per, lag), x0, x1, 160);
  /* 曲線與基線之間的面積（sign = 1 只取上方、−1 只取下方） */
  const area = (fn, x0, x1, base, sign, cls, op) => {
    let d = 'M' + x0 + ' ' + base;
    for (let i = 0; i <= 160; i++) { const x = x0 + (x1 - x0) * i / 160, y = fn(x); d += ' L' + x.toFixed(1) + ' ' + (sign > 0 ? Math.min(y, base) : Math.max(y, base)).toFixed(1); }
    return '<path class="' + cls + '" opacity="' + op + '" d="' + d + ' L' + x1 + ' ' + base + ' Z"/>';
  };
  const card = (x, y, w, h, extra) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"' + (extra || '') + '/>';
  const box = (x, y, w, h, label, key, acc, lk) => g(key, '<rect class="' + (acc ? 'accw' : 'bgw') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.6"/>' +
    T(x + w / 2, y + h / 2, label, { cls: acc ? 'ta' : 't', fs: 14, dy: '.35em', k: lk }));
  const src = (x, y, key) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="26"/>' + path('M' + (x - 15) + ' ' + y + ' C' + (x - 9) + ' ' + (y - 14) + ' ' + (x - 3) + ' ' + (y - 14) + ' ' + x + ' ' + y + ' S' + (x + 9) + ' ' + (y + 14) + ' ' + (x + 15) + ' ' + y, 'ln'));
  const brace = (x, y, w) => '<path class="lna" d="M' + (x - w) + ' ' + y + ' Q' + (x - w) + ' ' + (y + 10) + ' ' + (x - w + 10) + ' ' + (y + 10) + ' H' + (x - 5) + ' L' + x + ' ' + (y + 17) + ' L' + (x + 5) + ' ' + (y + 10) + ' H' + (x + w - 10) + ' Q' + (x + w) + ' ' + (y + 10) + ' ' + (x + w) + ' ' + y + '"/>';
  const hbar = (x, y, w, hgt, cls) => '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + Math.max(0, w).toFixed(1) + '" height="' + hgt + '" rx="3"/>';

  /* 上下兩條帶：上面畫 v、i，下面畫 p = v·i（x 80～420，右邊留給說明） */
  function bands(lag, opt) {
    opt = opt || {};
    const x0 = 80, x1 = opt.x1 || 420, per = opt.per || 170, top = 140, base = opt.base || 262, sc = opt.sc || 78;
    const v = x => top - 40 * cosAt(x, x0, per, 0), i = x => top - 28 * cosAt(x, x0, per, lag);
    const p = x => base - sc * cosAt(x, x0, per, 0) * cosAt(x, x0, per, lag);
    return {
      vi: g('vi', '<path class="ln2" d="M76 ' + top + ' H' + (x1 + 4) + '"/>' + path(P(v, x0, x1, 160), 'ln', null, 'stroke-width:2.4') + path(P(i, x0, x1, 160), 'lna', null, 'stroke-width:2.4;stroke-dasharray:6 4') +
        T(x0 - 6, top - 44, 'v', { cls: 't', fs: 13, a: 'end' }) + T(x0 - 6, top + (lag ? 4 : -22), 'i', { cls: 'ta', fs: 13, a: 'end' })),
      pos: g('pos', area(p, x0, x1, base, 1, 'acc', 0.3)),
      neg: g('neg', area(p, x0, x1, base, -1, 'ink3', 0.35)),
      pc: g('pc', '<path class="ln2" d="M76 ' + base + ' H' + (x1 + 4) + '"/>' + path(P(p, x0, x1, 200), 'lna', null, 'stroke-width:2.6') + T(x0 - 6, base - 30, 'p', { cls: 'ta', fs: 13, a: 'end' })),
      avgY: base - sc * 0.5 * Math.cos(lag * RAD), p, v, i, x0, x1, base, top
    };
  }

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '1200 還是 344？', en: 'THE QUESTION',
    svg: g('vw', path(sinP(70, 250, 150, 26, 90, 0), 'ln', null, 'stroke-width:2.4') + T(160, 112, '電壓：振幅 120 V', { fs: 13 })) +
      g('iw', path(sinP(70, 250, 240, 18, 90, 55), 'lna', null, 'stroke-width:2.4') + T(160, 206, '電流：振幅 10 A', { cls: 'ta', fs: 13 })) +
      T(450, 118, '120 × 10 = 1200 W？', { fs: 18, k: 'mul' }) +
      g('met', card(365, 140, 150, 86, ' style="stroke:var(--s-ink);stroke-width:1.4"') + T(440, 164, '瓦特計（平均）', { cls: 'tm', fs: 12 }) + T(440, 206, '344 W', { cls: 'ta', fs: 26 })) +
      chip(440, 272, '換成純電感：0 W', '電壓電流一樣大，瓦特計卻是 0', 'L0', { fs: 13 }) +
      T(320, 240, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '一個負載接上交流電：電壓最高 <b>120 V</b>、電流最高 <b>10 A</b>。', on: 'vw iw' },
      { sub: '照直流的習慣，功率 = 電壓 × 電流 = <b>1200 W</b>？', on: 'mul' },
      { sub: '拿瓦特計一量：平均只有 <b>344 W</b>，連三成都不到。', on: 'met' },
      { sub: '更怪的：換成一個純電感，電壓電流一樣大，瓦特計卻是 <b>0 W</b>。', on: 'L0' },
      { sub: '功率都跑去哪了？這一段就是要把它搞懂。', op: { vw: 0.15, iw: 0.15, mul: 0.15, met: 0.15, L0: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 複習直流 ════════════ */
  const S1 = {
    t: '先複習：直流的功率', en: 'DC POWER',
    svg: g('ckt', '<path class="ln" d="M110 186 V130 H330 V176 M330 224 V270 H110 V214"/>' +
        '<path class="ln" d="M94 194 H126" style="stroke-width:3"/><path class="ln" d="M101 206 H119"/>' +
        T(80, 204, '12 V', { cls: 't', fs: 13, a: 'end' }) +
        '<circle class="bgw" cx="330" cy="200" r="24"/>' + '<path class="lna" d="M313 183 L347 217 M347 183 L313 217"/>' + T(366, 204, '燈泡', { cls: 'tm', fs: 12, a: 'start' }) +
        arrow(190, 116, 250, 116, null, 'lna') + T(220, 104, '2 A', { cls: 'ta', fs: 13 })) +
      g('f', T(510, 140, 'P = V × I', { fs: 20 }) + T(510, 172, '= 12 × 2 = 24 W', { cls: 'ta', fs: 17 })) +
      chip(510, 222, '像水車', '水壓（電壓）× 水流（電流）= 出力', 'wh', { fs: 13 }) +
      g('gr', '<path class="ln2" d="M420 300 H600 M420 300 V256"/>' + '<path class="lna" d="M424 276 H596" style="stroke-width:2.4"/>' + T(510, 268, 'P 一直是 24 W', { cls: 'ts', fs: 11.5 }) + T(604, 304, 't', { cls: 'ts', fs: 11, a: 'start' })),
    steps: [
      { sub: '先複習直流：電池 <b>12 V</b> 接一顆燈泡，電流 <b>2 A</b>。', on: 'ckt' },
      { sub: '功率 = 電壓 × 電流 = 12 × 2 = <b>24 W</b>。', on: 'f' },
      { sub: '像水車：水壓（電壓）越大、水流（電流）越多，轉得越有力。', on: 'wh' },
      { sub: '直流的電壓、電流都不變，所以功率每一秒都是同一個數，很好算。', on: 'gr' }
    ]
  };

  /* ════════════ 02 交流 ════════════ */
  const S2 = {
    t: '交流：一直來回翻', en: 'ALTERNATING CURRENT',
    svg: g('wv', '<path class="ln2" d="M76 200 H584"/>' + path(sinP(80, 580, 200, 60, 250, 0), 'ln', null, 'stroke-width:2.6') + T(588, 160, 'v(t)', { cls: 't', fs: 13, a: 'start' })) +
      g('amp', '<path class="lna" d="M330 200 V140"/><path class="lna" d="M322 140 H338"/>' + T(342, 178, '振幅 V<sub>m</sub> = 120 V', { cls: 'ta', fs: 13, a: 'start' })) +
      g('per', '<path class="lna" d="M80 272 V282 H330 V272"/>' + T(205, 300, '一個週期 = 1/60 秒', { cls: 'ta', fs: 12.5 })) +
      chip(525, 110, 'ω = 2π × 60 = 377 rad/s', '角頻率：擺得多快', 'cw', { fs: 13 }) +
      T(190, 108, 'v(t) = V<sub>m</sub> cos(ωt + θ<sub>v</sub>)', { fs: 17, k: 'f' }),
    steps: [
      { sub: '交流不一樣：電壓像<b>盪鞦韆</b>，一下正、一下負，一秒來回 60 次。', on: 'wv' },
      { sub: '最高點離 0 多遠叫<b>振幅</b>，寫成 V<sub>m</sub>。例子裡是 120 V。', on: 'amp' },
      { sub: '擺多快用<b>角頻率 ω</b> 表示：台灣 60 Hz，ω = 2π × 60 = 377。', on: 'per cw' },
      { sub: '寫成算式：<b>v(t) = V<sub>m</sub> cos(ωt + θ<sub>v</sub>)</b>。θ<sub>v</sub> 是它「什麼時候起跑」。', on: 'f' }
    ]
  };

  /* ════════════ 03 相位差 ════════════ */
  const S3 = {
    t: '電流也是弦波，但會錯開', en: 'PHASE DIFFERENCE',
    svg: g('v', '<path class="ln2" d="M76 195 H584"/>' + path(sinP(80, 580, 195, 62, 250, 0), 'ln', null, 'stroke-width:2.6') + T(80, 112, '— 電壓 v(t)', { cls: 't', fs: 13, a: 'start' })) +
      g('i', path(sinP(80, 580, 195, 42, 250, 55), 'lna', null, 'stroke-width:2.6;stroke-dasharray:7 5') + T(80, 132, '- - 電流 i(t)', { cls: 'ta', fs: 13, a: 'start' })) +
      g('mk', '<path class="ln2 dsh" d="M330 126 V266"/><path class="ln2 dsh" d="M368 146 V266"/>') +
      g('gap', arrow(330, 274, 368, 274, null, 'lna') + T(349, 296, '55°', { cls: 'ta', fs: 14 })) +
      chip(525, 110, '相位差 θ<sub>v</sub> − θ<sub>i</sub> = 55°', null, 'cg', { fs: 13 }) +
      chip(180, 290, '電阻 → 同步；電感、電容 → 錯開', null, 'cR', { fs: 12.5 }),
    steps: [
      { sub: '電流也是一條同頻率的弦波：<b>i(t) = I<sub>m</sub> cos(ωt + θ<sub>i</sub>)</b>。', on: 'v i' },
      { sub: '但兩條波不一定同步 —— 像兩個人盪鞦韆，一個比另一個<b>晚一點</b>到最高點。', on: 'mk' },
      { sub: '錯開多少叫<b>相位差</b>。例子：θ<sub>v</sub> − θ<sub>i</sub> = 45° − (−10°) = <b>55°</b>。', on: 'gap cg' },
      { sub: '電阻讓它們同步；電感、電容會讓它們錯開。這個角度就是功率的關鍵。', on: 'cR' }
    ]
  };

  /* ════════════ 04 瞬時功率 ════════════ */
  const B4 = bands(55, { x1: 560, per: 240 });
  const dot = (x, y, cls) => '<circle class="' + cls + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4.5"/>';
  const probe = (x, lbl, key) => g(key, '<path class="ln2 dsh" d="M' + x + ' 96 V300"/>' + dot(x, B4.v(x), 'ink') + dot(x, B4.i(x), 'acc') + dot(x, B4.p(x), 'acc') +
    T(x + 8, 206, lbl, { cls: 'ta', fs: 12.5, a: 'start' }));
  const S4 = {
    t: '瞬時功率：每一刻相乘', en: 'INSTANTANEOUS POWER',
    svg: B4.vi + probe(108, '正 × 正 = 正', 'd1') + probe(280, '正 × 負 = 負', 'd2') + B4.pc +
      T(590, B4.base - 50, 'p(t) = v · i', { cls: 'ta', fs: 13, a: 'end', k: 'pl' }),
    steps: [
      { sub: '直流是「電壓 × 電流」，交流也一樣 —— 只是要<b>每一瞬間</b>各乘各的。', on: 'vi' },
      { sub: '這一刻：電壓正、電流也正 → 乘起來是<b>正的</b>。', on: 'd1' },
      { sub: '那一刻：電壓正、電流負 → 乘起來是<b>負的</b>。', on: 'd2' },
      { sub: '每一刻都乘一次，連起來就是<b>瞬時功率 p(t) = v(t) · i(t)</b>。', on: 'pc pl' }
    ]
  };

  /* ════════════ 05 純電阻 ════════════ */
  const B5 = bands(0, { base: 296, sc: 84 });
  const S5 = {
    t: '同步：電阻全部吃掉', en: 'IN PHASE · RESISTOR',
    svg: B5.vi + B5.pos + B5.pc +
      chip(520, 140, '能量一路流進電阻', '電熱水壺、燈泡：全部變成熱', 'cH', { fs: 13 }) +
      g('avg', path('M80 ' + (296 - 42) + ' H420', 'ln dsh', null, 'stroke-width:1.6') + T(430, 258, '平均 = ½V<sub>m</sub>I<sub>m</sub>', { cls: 't', fs: 13, a: 'start' })),
    steps: [
      { sub: '先看最單純的<b>電阻</b>（電熱水壺、燈泡）：電壓、電流<b>完全同步</b>。', on: 'vi' },
      { sub: '正 × 正 = 正、負 × 負 = 也是正 → p(t) <b>永遠 ≥ 0</b>。', on: 'pc pos' },
      { sub: '能量一路從電源流進電阻，全部變成熱，沒有回頭。', on: 'cH' },
      { sub: 'p(t) 在 0 和最高點之間擺，平均剛好是最高點的一半：<b>½V<sub>m</sub>I<sub>m</sub></b>。', on: 'avg' }
    ]
  };

  /* ════════════ 06 純電感 ════════════ */
  const B6 = bands(90, { base: 258, sc: 82 });
  const S6 = {
    t: '錯開 90°：電感借了又還', en: '90° APART · INDUCTOR',
    svg: B6.vi + B6.pos + B6.neg + B6.pc +
      T(101, 210, '借', { cls: 'ta', fs: 14, k: 'b1' }) + T(144, 284, '還', { cls: 't', fs: 14, k: 'b2' }) +
      chip(520, 128, '借：存進磁場', 'p &gt; 0，電源 → 電感', 'cB', { fs: 13 }) +
      chip(520, 190, '還：送回電源', 'p &lt; 0，電感 → 電源', 'cRt', { fs: 13 }) +
      chip(520, 260, '平均 = 0', '借 100 元、還 100 元', 'cZ', { fs: 14, acc: true }),
    steps: [
      { sub: '換成<b>純電感</b>（一圈線圈）：電流比電壓<b>晚 90°</b>。', on: 'vi' },
      { sub: '這時 p(t) 一半時間正、一半時間負，而且<b>正負面積一樣大</b>。', on: 'pc pos neg' },
      { sub: '正的時候：電感把能量存進磁場 —— 跟電源<b>借</b>。', on: 'b1 cB' },
      { sub: '負的時候：原封不動<b>還</b>給電源。像跟朋友借 100 元，隔天還 100 元。', on: 'b2 cRt' },
      { sub: '一整個週期算下來，<b>平均 = 0</b>。電感不吃功率，只是借了又還；電容也一樣。', on: 'cZ' }
    ]
  };

  /* ════════════ 07 介於中間 ════════════ */
  const B7 = bands(55, { base: 280, sc: 84 });
  const S7 = {
    t: '大部分負載：介於中間', en: 'MOST LOADS · IN BETWEEN',
    svg: B7.vi + B7.pos + B7.neg + B7.pc +
      g('avg', path('M80 ' + B7.avgY.toFixed(1) + ' H420', 'ln dsh', null, 'stroke-width:1.6') + T(430, B7.avgY + 4, '平均 &gt; 0', { cls: 't', fs: 13, a: 'start' })) +
      chip(520, 130, '電阻 ＋ 電感', '例子：錯開 55°', 'cM', { fs: 13 }) +
      chip(520, 196, '錯開越多', '負的越大 → 剩下越少', 'cMore', { fs: 13, acc: true }),
    steps: [
      { sub: '大部分的負載介於兩者之間（電阻＋電感），例子裡錯開 <b>55°</b>。', on: 'vi cM' },
      { sub: 'p(t) 大部分時間是正的，只有一小段是負的。', on: 'pc pos neg' },
      { sub: '正的面積扣掉負的面積，剩下的才是<b>真的被吃掉</b>的。', on: 'avg' },
      { sub: '錯開越多，負的那段越大，剩下的越少。', on: 'cMore' }
    ]
  };

  /* ════════════ 08 先整理一下 ════════════ */
  const rc = (x, title, l1, l2, l3, key, acc) => g(key, card(x, 104, 176, 168, acc ? ' style="stroke:var(--s-acc);stroke-width:1.6"' : '') +
    T(x + 88, 136, title, { cls: acc ? 'ta' : 't', fs: 16 }) + T(x + 88, 176, l1, { cls: 'tm', fs: 13 }) +
    T(x + 88, 206, l2, { cls: 'tm', fs: 13 }) + T(x + 88, 244, l3, { cls: acc ? 'ta' : 't', fs: 14 }));
  const S8 = {
    t: '先整理一下', en: "LET'S RECAP",
    svg: rc(40, '電阻', '同步 0°', 'p 永遠 ≥ 0', '全部吃掉', 'c1') +
      rc(232, '電感、電容', '錯開 90°', '正負一樣大', '借了又還，平均 0', 'c2') +
      rc(424, '一般負載', '錯開 0°～90°', '大部分是正的', '吃掉一部分', 'c3', true) +
      chip(320, 306, '問題：「一部分」到底是多少？', null, 'cq', { fs: 13.5, acc: true }),
    steps: [
      { sub: '先整理一下。<b>電阻</b>：電壓電流同步，p(t) 永遠 ≥ 0，全部吃掉。', on: 'c1' },
      { sub: '<b>電感、電容</b>：錯開 90°，正負面積一樣大 —— 借了又還，平均 0。', on: 'c2' },
      { sub: '<b>一般負載</b>：錯開 0° 到 90° 之間，吃掉一部分。', on: 'c3' },
      { sub: '下一步：把「一部分」算成一個數字。', on: 'cq' }
    ]
  };

  /* ════════════ 09 取平均 ════════════ */
  const days = [62, 30, 84, -22, 52, 40, 70], avgD = days.reduce((a, b) => a + b, 0) / days.length;
  let bars = '';
  days.forEach((v, j) => { const x = 86 + j * 30; bars += '<rect class="' + (v < 0 ? 'ink3' : 'acc') + '" opacity="' + (v < 0 ? 0.6 : 0.45) + '" x="' + x + '" y="' + (v < 0 ? 236 : 236 - v) + '" width="20" height="' + Math.abs(v) + '"/>'; });
  const p9 = x => 236 - 74 * cosAt(x, 360, 115, 0) * cosAt(x, 360, 115, 55);
  const avg9 = 236 - 74 * 0.5 * Math.cos(55 * RAD);
  const S9 = {
    t: '平均功率：看平均', en: 'AVERAGE POWER',
    svg: g('pc', '<path class="ln2" d="M356 236 H594"/>' + area(p9, 360, 590, 236, 1, 'acc', 0.3) + area(p9, 360, 590, 236, -1, 'ink3', 0.35) +
        path(P(p9, 360, 590, 200), 'lna', null, 'stroke-width:2.4') + T(352, 186, 'p(t)', { cls: 'ta', fs: 13, a: 'end' })) +
      g('bars', '<path class="ln2" d="M80 236 H300"/>' + bars + T(190, 128, '零用錢：每天都不一樣', { cls: 'tm', fs: 12.5 }) +
        path('M80 ' + (236 - avgD).toFixed(1) + ' H300', 'ln dsh', null, 'stroke-width:1.6') + T(190, 284, '月底看「平均每天」', { cls: 't', fs: 13 })) +
      g('pavg', path('M360 ' + avg9.toFixed(1) + ' H590', 'ln dsh', null, 'stroke-width:1.8') + T(475, 284, '平均 = 平均功率 P', { cls: 't', fs: 13 })) +
      T(475, 128, 'p(t) = 固定值 ＋ 兩倍頻擺盪', { cls: 'tm', fs: 13, k: 'split' }),
    steps: [
      { sub: 'p(t) 一直跳，沒辦法拿來報數字。電表看的是它的<b>平均</b>。', on: 'pc' },
      { sub: '就像零用錢：有幾天多、有幾天少（甚至倒貼），月底看的是<b>平均每天</b>多少。', on: 'bars' },
      { sub: 'p(t) 的平均叫<b>平均功率 P</b>。電器標的「800 W」、電費算的，都是它。', on: 'pavg' },
      { sub: '拆開看：p(t) = 一個固定值 ＋ 一個兩倍頻的擺盪。擺盪正負抵銷，平均只剩那個固定值。', on: 'split' }
    ]
  };

  /* ════════════ 10 公式 ════════════ */
  const S10 = {
    t: '平均功率的公式', en: 'P = ½ VmIm cos(θv − θi)',
    svg: g('f', T(160, 150, 'P =', { fs: 28 }) + T(222, 150, '½', { fs: 30 }) + T(292, 150, 'V<sub>m</sub>I<sub>m</sub>', { fs: 28 }) + T(460, 150, 'cos(θ<sub>v</sub> − θ<sub>i</sub>)', { fs: 28 })) +
      g('b2', brace(222, 172, 18) + T(222, 214, '取平均', { cls: 'ta', fs: 14 })) +
      g('b1', brace(292, 172, 34) + T(292, 214, '最高點相乘', { cls: 'ta', fs: 14 })) +
      g('b3', brace(460, 172, 92) + T(460, 214, '錯開造成的打折（0～1）', { cls: 'ta', fs: 14 })) +
      chip(320, 290, '錯開越多 → cos 越小 → P 越小', null, 'cc', { fs: 13.5 }),
    steps: [
      { sub: '算出來是這條：<b>P = ½V<sub>m</sub>I<sub>m</sub> cos(θ<sub>v</sub> − θ<sub>i</sub>)</b>。拆成三塊看。', on: 'f' },
      { sub: 'V<sub>m</sub>I<sub>m</sub>：兩條波的<b>最高點相乘</b> —— 就是開頭那個 1200。', on: 'b1' },
      { sub: '½：弦波一下高一下低，平均只有最高點的一半（電阻那一幕看過）。', on: 'b2' },
      { sub: 'cos(θ<sub>v</sub> − θ<sub>i</sub>)：電壓電流錯開造成的<b>打折</b>。', on: 'b3 cc' }
    ]
  };

  /* ════════════ 11 cos 打折 ════════════ */
  const row = (y, lbl, deg, note, key) => g(key, T(78, y + 5, lbl, { cls: 't', fs: 14, a: 'start' }) +
    hbar(200, y - 9, 300, 18, 'accw') + hbar(200, y - 9, 300 * Math.cos(deg * RAD), 18, 'acc') +
    T(510, y + 5, 'cos = ' + Math.cos(deg * RAD).toFixed(2), { cls: 'ta', fs: 13, a: 'start' }) + T(200, y + 26, note, { cls: 'ts', fs: 12, a: 'start' }));
  const S11 = {
    t: 'cos 就是打幾折', en: 'COS = THE DISCOUNT',
    svg: row(116, '錯開 0°', 0, '電阻：不打折', 'r0') + row(172, '錯開 55°', 55, '例子：打 57 折', 'r55') + row(228, '錯開 90°', 90, '電感、電容：全部打掉', 'r90') +
      chip(320, 290, 'cos(−55°) = cos 55°：誰減誰都一樣', null, 'cs', { fs: 13 }),
    steps: [
      { sub: '錯開 0°：cos 0° = <b>1</b>，不打折 —— 電阻。', on: 'r0' },
      { sub: '錯開 55°：cos 55° = <b>0.57</b>，只剩 57%。', on: 'r55' },
      { sub: '錯開 90°：cos 90° = <b>0</b>，全部打掉 —— 電感、電容。', on: 'r90' },
      { sub: '電流早到還是晚到都一樣：cos(−55°) = cos 55°。P 只看<b>錯開多少</b>。', on: 'cs' }
    ]
  };

  /* ════════════ 12 恍然大悟 ════════════ */
  const S12 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 116, 'V<sub>m</sub> = 120　I<sub>m</sub> = 10　錯開 55°', { cls: 'tm', fs: 16, k: 'a1' }) +
      T(320, 160, '½ × 120 × 10 = 600', { fs: 19, k: 'a2' }) +
      T(320, 204, '600 × cos 55° = 600 × 0.574 = 344 W', { cls: 'ta', fs: 20, k: 'a3' }) +
      T(320, 244, '純電感：600 × cos 90° = 0 W', { fs: 16, k: 'a4' }) +
      chip(320, 296, '謎題解開了 ✓', '1200 只是「最高點相乘」，真正吃掉的是 344 W', 'ans', { fs: 13, acc: true }),
    steps: [
      { sub: '回到開頭：V<sub>m</sub> = 120、I<sub>m</sub> = 10、錯開 55°。', on: 'a1' },
      { sub: '先乘 ½（因為是平均）：½ × 120 × 10 = <b>600</b>。', on: 'a2' },
      { sub: '再打折：600 × cos 55° = <b>344 W</b> —— 跟瓦特計一模一樣！', on: 'a3' },
      { sub: '純電感錯開 90°，cos 90° = 0 → <b>0 W</b>。', on: 'a4' },
      { sub: '1200 只是「最高點相乘」，不是真的被吃掉的。<b>謎題解開了。</b>', on: 'ans' }
    ]
  };

  /* ════════════ 13 新問題：最大功率 ════════════ */
  const hump = x => 300 - 76 * (4 * ((x - 190) / 70) / Math.pow(1 + (x - 190) / 70, 2));
  const S13 = {
    t: '新問題：負載怎麼選？', en: 'MAXIMUM POWER TRANSFER',
    svg: g('amp', card(70, 110, 130, 70, ' style="stroke:var(--s-ink);stroke-width:1.4"') + T(135, 150, '擴大機', { fs: 15 })) +
      g('spk', '<path class="ln" d="M200 135 H470 M200 155 H470"/><rect class="bgw" x="470" y="125" width="22" height="40"/><path class="ln" d="M492 125 L530 100 V190 L492 165"/>' + T(512, 212, '喇叭', { cls: 'tm', fs: 12 })) +
      chip(330, 104, '喇叭選錯，聲音就小', null, 'cs', { fs: 12.5 }) +
      g('cv', '<path class="ln2" d="M190 300 H470 M190 300 V222"/>' + path(P(hump, 192, 468, 120), 'lna', null, 'stroke-width:2.4') +
        '<path class="ln2 dsh" d="M260 224 V300"/>' + T(268, 216, 'R<sub>L</sub> = R<sub>Th</sub> 最大', { cls: 'ta', fs: 12.5, a: 'start' }) + T(474, 304, 'R<sub>L</sub>', { cls: 'ts', fs: 11, a: 'start' }) + T(184, 230, 'P', { cls: 'ts', fs: 11, a: 'end' })) +
      g('ends', T(214, 290, '太小', { cls: 'ts', fs: 12 }) + T(430, 280, '太大', { cls: 'ts', fs: 12 })),
    steps: [
      { sub: '第二個問題：電源固定，<b>負載要選多少</b>，才能拿到最多功率？', on: 'amp spk' },
      { sub: '像擴大機接喇叭：喇叭選錯，聲音就小。', on: 'cs' },
      { sub: '直流學過：負載電阻 = 電源內阻（<b>R<sub>L</sub> = R<sub>Th</sub></b>）時最大。', on: 'cv' },
      { sub: '太小：電流大，但負載分不到電壓；太大：電流太小。剛好相等最好。', on: 'ends' }
    ]
  };

  /* ════════════ 14 交流電源藏著電抗 ════════════ */
  const ckt14 = src(110, 180, 'vs') + g('wire', '<path class="ln" d="M110 154 V120 H190 M330 120 H440 V150 M440 210 V240 H110 V206"/>' +
    T(72, 176, 'V<sub>Th</sub>', { cls: 't', fs: 13, a: 'end' }) + T(72, 196, '10 V', { cls: 'tm', fs: 12, a: 'end' }));
  const S14 = {
    t: '交流電源裡藏著電抗', en: 'THEVENIN · ZTh = R + jX',
    svg: ckt14 + box(190, 102, 140, 36, 'Z<sub>Th</sub> = 4 + j3', 'zth') +
      box(380, 150, 120, 60, '?', 'zl', true, 'zlt') + T(520, 184, '負載 Z<sub>L</sub>', { cls: 'ta', fs: 12.5, a: 'start', k: 'zll' }) +
      chip(200, 282, '+j3：電感成分', '不吃功率，但會擋住電流', 'cx', { fs: 13 }) +
      chip(460, 282, '選一樣的 4 + j3？', '只拿到 2 W', 'nv', { fs: 13, acc: true }),
    steps: [
      { sub: '交流電源化簡後是：電壓源 <b>V<sub>Th</sub></b> 串一個阻抗 <b>Z<sub>Th</sub> = 4 + j3 Ω</b>（戴維寧等效）。', on: 'vs wire zth' },
      { sub: '+j3 是電感的成分。它不吃功率，但會<b>擋住電流</b>。', on: 'cx' },
      { sub: '負載 Z<sub>L</sub> 也可以有電阻和電抗。要怎麼選？', on: 'zl zlt zll' },
      { sub: '照直流的直覺選一樣的 4 + j3？算出來只拿到 <b>2 W</b>。一定還有更好的。', on: 'nv', txt: { zlt: '4 + j3' } }
    ]
  };

  /* ════════════ 15 抵銷電抗 ════════════ */
  const S15 = {
    t: '第一步：抵銷電抗', en: 'CANCEL THE REACTANCE',
    svg: g('ar', arrow(330, 205, 330, 112, null, 'ln') + arrow(330, 205, 330, 298, null, 'lna') + '<circle class="ink" cx="330" cy="205" r="5"/>' +
        T(342, 128, '+j3（電源裡的電感）', { cls: 't', fs: 13, a: 'start' }) + T(342, 292, '−j3（負載放電容）', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(160, 205, '拔河兩邊一樣大力', '繩子不動 = 互相抵銷', 'ct', { fs: 13 }) +
      g('sum', T(490, 196, 'X 總 = +3 − 3 = 0', { fs: 16 }) + T(490, 222, '電路變成純電阻', { cls: 'tm', fs: 13 })) +
      chip(160, 272, '沒有電抗擋路', '電流變到最大', 'cmax', { fs: 13, acc: true }),
    steps: [
      { sub: '電源裡有 <b>+j3</b>（電感）。負載如果放 <b>−j3</b>（電容）：一個往上推、一個往下拉。', on: 'ar' },
      { sub: '像拔河兩邊一樣大力：<b>互相抵銷</b>，繩子不動。', on: 'ct' },
      { sub: '總電抗 = +3 − 3 = <b>0</b>，整個電路變成純電阻。', on: 'sum' },
      { sub: '沒有電抗擋路，電流變到最大。', on: 'cmax' }
    ]
  };

  /* ════════════ 16 再匹配電阻 ════════════ */
  const S16 = {
    t: '第二步：電阻配電阻', en: 'MATCH THE RESISTANCE',
    svg: box(70, 118, 140, 44, '4 + j3', 'A') + T(140, 106, 'Z<sub>Th</sub>（電源）', { cls: 'tm', fs: 12, k: 'Al' }) +
      T(236, 146, '+', { fs: 20, k: 'pl' }) +
      box(262, 118, 140, 44, '4 − j3', 'B', true) + T(332, 106, 'Z<sub>L</sub>（負載）', { cls: 'ta', fs: 12, k: 'Bl' }) +
      g('eq', T(428, 146, '=', { fs: 20 }) + T(510, 146, '8 Ω', { cls: 'ta', fs: 24 }) + T(510, 178, '虛部消失', { cls: 'ts', fs: 12 })) +
      chip(236, 228, '實部照抄、虛部變號', '4 + j3 → 4 − j3：這叫共軛', 'cj', { fs: 13 }) +
      chip(320, 296, '共軛匹配：Z<sub>L</sub> = Z<sub>Th</sub>*', null, 'cm', { fs: 15, acc: true }),
    steps: [
      { sub: '電抗消掉之後，剩下純電阻 —— 回到直流的老規矩：<b>R<sub>L</sub> = R<sub>Th</sub> = 4 Ω</b>。', on: 'A Al pl B Bl' },
      { sub: '所以負載 = <b>4 − j3</b>：實部照抄、虛部變號，數學上叫<b>共軛</b>。', on: 'cj' },
      { sub: '總阻抗 = (4 + j3) + (4 − j3) = <b>8 Ω</b>，乾乾淨淨。', on: 'eq' },
      { sub: '兩步合起來叫<b>共軛匹配：Z<sub>L</sub> = Z<sub>Th</sub>*</b>。', on: 'cm' }
    ]
  };

  /* ════════════ 17 Pmax ════════════ */
  const S17 = {
    t: '最大功率是多少', en: 'HOW MUCH IS P MAX',
    svg: T(320, 124, 'P<sub>max</sub> = |V<sub>Th</sub>|<sup>2</sup> ÷ (8R<sub>Th</sub>)', { fs: 21, k: 'f' }) +
      T(320, 158, '8 = ½（取平均）× 4（總阻抗 2R<sub>Th</sub> 的平方）', { cls: 'tm', fs: 13, k: 'why' }) +
      g('bar1', T(196, 205, '共軛 4 − j3', { cls: 'ta', fs: 13, a: 'end' }) + hbar(206, 192, 240, 20, 'acc') + T(454, 207, '100 ÷ 32 = 3.125 W', { cls: 'ta', fs: 13, a: 'start' })) +
      g('bar2', T(196, 249, '選一樣 4 + j3', { cls: 't', fs: 13, a: 'end' }) + hbar(206, 236, 240 * 2 / 3.125, 20, 'ink3') + T(206 + 154 + 8, 251, '2 W', { cls: 't', fs: 13, a: 'start' })) +
      chip(320, 296, '共軛比「選一樣」多拿 56%', null, 'c56', { fs: 13.5, acc: true }),
    steps: [
      { sub: '共軛匹配時的最大功率：<b>P<sub>max</sub> = |V<sub>Th</sub>|² ÷ (8R<sub>Th</sub>)</b>。', on: 'f' },
      { sub: '8 從哪來？½（取平均）× 4（總阻抗是 2R<sub>Th</sub>，平方變 4）。', on: 'why' },
      { sub: 'V<sub>Th</sub> = 10 V、R<sub>Th</sub> = 4 Ω：100 ÷ 32 = <b>3.125 W</b>。', on: 'bar1' },
      { sub: '跟「選一樣」的 2 W 比，多了 56%。共軛真的有差。', on: 'bar2 c56' }
    ]
  };

  /* ════════════ 18 只能用電阻 ════════════ */
  const S18 = {
    t: '陷阱：負載只能是電阻', en: 'RESISTIVE LOAD ONLY',
    svg: g('tri', '<path class="ln" d="M80 286 H240 V166 Z"/>' + T(160, 306, 'R<sub>Th</sub> = 4', { cls: 't', fs: 13 }) + T(248, 232, 'X<sub>Th</sub> = 3', { cls: 't', fs: 13, a: 'start' }) +
        T(146, 214, '5', { cls: 'ta', fs: 18, a: 'end' })) +
      T(440, 112, '負載只能放一顆電阻', { fs: 15, k: 'q1' }) +
      T(440, 148, 'R<sub>L</sub> = |Z<sub>Th</sub>| = √(4² + 3²) = 5 Ω', { cls: 'ta', fs: 15, k: 'rl' }) +
      g('bars', hbar(330, 186, 180, 16, 'acc') + T(516, 199, '共軛 3.13 W', { cls: 'ta', fs: 12, a: 'start' }) +
        hbar(330, 214, 180 * 2.778 / 3.125, 16, 'acc') + T(330 + 160 + 6, 227, '純電阻 2.78 W', { cls: 't', fs: 12, a: 'start' }) +
        hbar(330, 242, 180 * 2 / 3.125, 16, 'ink3') + T(330 + 115 + 6, 255, '選一樣 2 W', { cls: 'ts', fs: 12, a: 'start' })) +
      chip(440, 300, '能放電抗 → 共軛；只能放電阻 → 取大小', null, 'ck', { fs: 12.5, acc: true }),
    steps: [
      { sub: '考試愛考：如果負載<b>只能是電阻</b>呢？−j3 放不進去，電抗抵銷不掉。', on: 'q1' },
      { sub: '答案變成 <b>R<sub>L</sub> = |Z<sub>Th</sub>|</b>：4 和 3 的直角三角形，斜邊 = <b>5 Ω</b>。', on: 'tri rl' },
      { sub: '這時只拿到 <b>2.78 W</b>，比共軛的 3.125 W 少 —— 合理，電抗沒消掉。', on: 'bars' },
      { sub: '口訣：<b>能放電抗 → 共軛；只能放電阻 → 取大小 |Z<sub>Th</sub>|</b>。', on: 'ck' }
    ]
  };

  /* ════════════ 19 預告 ════════════ */
  const w19 = x => 240 - 32 * cosAt(x, 80, 125, 0);
  const S19 = {
    t: '整理與預告', en: 'WHAT\u2019S NEXT',
    svg: g('k1', card(60, 100, 250, 70) + T(185, 130, 'P = ½V<sub>m</sub>I<sub>m</sub> cos θ', { fs: 17 }) + T(185, 156, '平均功率', { cls: 'ts', fs: 12 })) +
      g('k2', card(330, 100, 250, 70) + T(455, 130, 'Z<sub>L</sub> = Z<sub>Th</sub>*', { fs: 17 }) + T(455, 156, '最大功率轉移', { cls: 'ts', fs: 12 })) +
      T(185, 192, '↑ 這個 ½ 一直跟著，很煩', { cls: 'ta', fs: 13, k: 'half' }) +
      g('wv', '<path class="ln2" d="M76 240 H334"/>' + path(P(w19, 80, 330, 140), 'ln', null, 'stroke-width:2.2') +
        path('M80 208 H330', 'ln dsh', null, 'stroke-width:1.4') + T(336, 212, '最高 155 V', { cls: 'tm', fs: 12, a: 'start' }) +
        path('M80 ' + (240 - 32 / Math.SQRT2).toFixed(1) + ' H330', 'lna', null, 'stroke-width:2') + T(336, 232, '插座：110 V？', { cls: 'ta', fs: 12, a: 'start' })) +
      chip(510, 236, '下一段：有效值 rms', '一次解決 ½ 和 110 V', 'nx', { fs: 13, acc: true }),
    steps: [
      { sub: '這一段整理成兩句：<b>P = ½V<sub>m</sub>I<sub>m</sub> cos θ</b>，和 <b>Z<sub>L</sub> = Z<sub>Th</sub>*</b>。', on: 'k1 k2' },
      { sub: '可是那個 <b>½</b> 一直跟著，每次都要記得乘，很煩。', on: 'half' },
      { sub: '而且插座寫 110 V，示波器量到的最高點卻是 <b>155 V</b>。哪一個才對？', on: 'wv' },
      { sub: '下一段：用<b>有效值</b>一次解決這兩件事。', on: 'nx' }
    ]
  };

  window.__ch11p1Story = window.__Story('#story', {
    id: 'circuits-ch11-part1', title: 'CH11 PART 1 瞬時、平均與最大功率', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19]
  });
})();
