/* ============================================================
   電子學 CH1 PART 7（原講義 PART 5 V3 後半，投影片 1-13～1-34）—— 故事模式
   倉庫（少數載子庫存）。謎題 = 頻率一高阻抗變小、關掉時電流倒流 → 同一個原因；最後介紹二極體家族。
   10/31 從 CH1 PART 6 的「故事二」拆出來（劇本不變）。
   需要：story.js、ch1-part5-kit.js（__K15）、ch1-part6-ex.js（__K16）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15 || !window.__K16) return;
  const K = window.__K15, D = K.D, Q = window.__K16;
  const { g, T, calc, sc, axes, circ, sine, f1 } = K;
  const { chip, arrow } = D;
  const VT = 0.026;
  const iv14 = v => 1e-14 * (Math.exp(v / VT) - 1) * 1e3;        /* mA */
  const iv13 = v => 1e-13 * (Math.exp(v / VT) - 1) * 1e3;
  const vq14 = i => VT * Math.log(i * 1e-3 / 1e-14);
  const card = (x, y, w, h, key, inner) => g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" filter="url(#st-sh)"/>' + inner);
  const path = (d, cls, key, extra) => '<path class="' + (cls || 'ln') + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + K.k(key) + '/>';
  const wavePath = (x0, ym, w, A, fn, n) => { let d = ''; n = n || 120; for (let k = 0; k <= n; k++) { const u = k / n; d += (k ? ' L' : 'M') + f1(x0 + u * w) + ' ' + f1(ym - A * fn(u)); } return d; };

  /* ══════════════════════════ 故事二：倉庫、開關、二極體家族 ══════════════════════════ */
  /* pn 方塊：p | 空乏區 | n */
  const pnBox = (x0, y0, w, h, key, opt) => {
    opt = opt || {};
    const jl = x0 + w * 0.44, jr = x0 + w * 0.56;
    return g(key, '<rect class="card" x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="6" style="stroke:var(--s-ink);stroke-width:1.6"/>' +
      '<rect class="accw" x="' + jl + '" y="' + y0 + '" width="' + (jr - jl) + '" height="' + h + '" style="opacity:.7"/>' +
      T(x0 + w * 0.22, y0 + (opt.ly || 30), opt.l || 'p', { cls: 't', fs: 20 }) + T(x0 + w * 0.78, y0 + (opt.ly || 30), opt.r || 'n', { cls: 't', fs: 20 }) +
      (opt.dep === false ? '' : T((jl + jr) / 2, y0 + h + 16, '空乏區', { cls: 'ts', fs: 11 })));
  };
  const photon = (x, y, key) => '<path class="lna" style="fill:none;stroke-width:2" d="M' + x + ' ' + y + ' q 4 -5 8 0 q 4 5 8 0 q 4 -5 8 0 q 4 5 8 0"' + K.k(key) + ' transform="rotate(60 ' + x + ' ' + y + ')"/>';

  /* B0 謎題 */
  const B0 = sc('同一顆二極體，兩個怪現象', 'TWO PUZZLES',
    card(60, 112, 250, 130, 'A', T(185, 142, '怪現象 ①', { cls: 'ta', fs: 15 }) + T(185, 172, '低頻：交流阻抗 = r<sub>d</sub>', { cls: 'tm', fs: 13 }) + T(185, 198, '頻率一高，阻抗變小？', { fs: 15 }) + T(185, 224, '（順偏）', { cls: 'ts', fs: 12 })) +
    card(330, 112, 250, 130, 'B', T(455, 142, '怪現象 ②', { cls: 'ta', fs: 15 }) + T(455, 172, '從導通切到逆偏', { cls: 'tm', fs: 13 }) + T(455, 198, '電流先「倒流」一陣子？', { fs: 15 }) + T(455, 224, '（不是馬上停）', { cls: 'ts', fs: 12 })) +
    chip(320, 282, '其實是同一個原因', '猜猜看是什麼', 'c1', { fs: 13, acc: true }),
    [{ sub: '一顆順偏的二極體。上一段說：它對交流就是一顆電阻 r<sub>d</sub>。', on: '' },
     { sub: '可是頻率一拉高，量到的交流阻抗<b>變小了</b>。', on: 'A' },
     { sub: '還有：把它從導通切到逆偏，電流不是馬上停，而是<b>倒流</b>一陣子。', on: 'B' },
     { sub: '兩個怪現象，其實是<b>同一個原因</b>。先複習兩件 PART 3、4 的事。', on: 'c1' }]);

  /* B1 複習：注入 */
  const B1 = sc('複習：順偏時載子衝到對面', 'RECAP · INJECTION',
    pnBox(110, 130, 420, 110, 'pn') +
    g('e', [0, 1, 2, 3].map(k => D.e(400 + k * 26, 190 + (k % 2) * 24)).join('') + arrow(380, 150, 270, 150, null, 'lna')) +
    g('h', [0, 1, 2, 3].map(k => D.h(250 - k * 26, 190 + (k % 2) * 24)).join('') + arrow(260, 225, 370, 225, null, 'lna')) +
    chip(320, 290, '到了對面就變成「少數載子」', '一下子還沒復合掉', 'c1', { fs: 13, acc: true }),
    [{ sub: '複習 PART 4：順偏把坡壓低。', on: 'pn' },
     { sub: 'n 區的電子衝到 p 區……', on: 'e' },
     { sub: 'p 區的電洞衝到 n 區。', on: 'h' },
     { sub: '到了對面，它們就是「多出來的<b>少數載子</b>」，而且不會馬上消失。', on: 'c1' }]);

  /* B2 複習：接面電容 */
  const B2 = sc('複習：空乏區像一個電容', 'RECAP · JUNCTION CAPACITANCE',
    pnBox(110, 130, 420, 110, 'pn', { ly: 62 }) +
    g('ions', [0, 1, 2].map(k => T(320 - 18, 156 + k * 30, '−', { cls: 'ta', fs: 18 }) + T(320 + 18, 156 + k * 30, '+', { cls: 'ta', fs: 18 })).join('')) +
    chip(320, 290, '兩邊的固定電荷 = 平行板', '接面電容 C<sub>j</sub>（PART 3）', 'c1', { fs: 13 }),
    [{ sub: '再複習 PART 3：空乏區兩邊有固定的 − 和 + 離子。', on: 'pn ions' },
     { sub: '像平行板電容，所以有<b>接面電容 C<sub>j</sub></b>。逆偏越大、空乏區越寬、C<sub>j</sub> 越小（變容二極體）。', on: 'c1' }]);

  /* B3 倉庫 */
  const B3 = sc('衝過去的載子：倉庫的庫存', 'A WAREHOUSE OF CARRIERS',
    Q.storeFrame(80, 130, 340, 140) + Q.store(80, 130, 340, 140, 0.85, 'st') +
    calc(445, 128, 165, [['p 區：多的電子', 'r1', 'tm'], ['n 區：多的電洞', 'r2', 'tm'], ['= 儲存電荷 Q', 'r3', 'ta']], { k: 'cc', fs: 14 }) +
    chip(250, 112, '離接面越遠越少', '邊走邊復合', 'c1', { fs: 12 }),
    [{ sub: '順偏時，衝過去的少數載子在兩邊的中性區<b>堆起來</b>。', on: 'st' },
     { sub: '像倉庫的庫存：p 區存電子、n 區存電洞（講義 1-14）。', on: 'cc r1 r2 r3' },
     { sub: '離接面越遠越少，因為它們一邊擴散一邊跟多數載子復合。', on: 'c1' }]);

  /* B4 ΔQ/ΔV */
  const B4 = sc('電壓一動，庫存就漲跌', 'STOCK FOLLOWS VOLTAGE',
    Q.storeFrame(80, 130, 340, 140) + Q.store(80, 130, 340, 140, 0.6, 's0', 'bgw') + Q.store(80, 130, 340, 140, 0.95, 's1') +
    calc(445, 120, 165, [['V + ΔV → 多存', 'r1', 'tm'], ['V − ΔV → 少存', 'r2', 'tm'], ['C<sub>d</sub> = ΔQ / ΔV', 'r3', 'ta']], { k: 'cc', fs: 14 }) +
    chip(510, 270, '叫「擴散電容」', 'diffusion capacitance', 'c1', { fs: 13, acc: true }),
    [{ sub: '電壓小一點，庫存少一點（淺色）。', on: 's0 cc r2' },
     { sub: '電壓大一點，注入多，庫存多一點 —— 像電容在<b>充電</b>（講義 1-13）。', on: 's1 r1' },
     { sub: '庫存的變化 ΔQ 除以電壓變化 ΔV，就是一個電容：<b>擴散電容 C<sub>d</sub></b>。', on: 'r3 c1' }]);

  /* B5 頻率高：搬不及 */
  const B5 = sc('頻率太高：搬不及', 'TOO FAST TO FOLLOW',
    card(70, 112, 240, 120, 'A', T(190, 142, '低頻', { fs: 16 }) + T(190, 172, '電壓慢慢漲、慢慢跌', { cls: 'tm', fs: 13 }) + T(190, 198, '庫存跟得上 → C<sub>d</sub> 完整', { cls: 'ta', fs: 13 })) +
    card(330, 112, 240, 120, 'B', T(450, 142, '高頻', { fs: 16, cls: 'ta' }) + T(450, 172, '剛要進貨又要出貨', { cls: 'tm', fs: 13 }) + T(450, 198, '來不及 → ΔQ 小 → C<sub>d</sub> 變小', { cls: 'ta', fs: 13 })) +
    chip(320, 276, '頻率 ↑ ⟹ C<sub>d</sub> ↓', '講義 1-15', 'c1', { fs: 14, acc: true }),
    [{ sub: '庫存要靠擴散進出，需要時間。低頻時，電壓慢慢變，庫存跟得上。', on: 'A' },
     { sub: '頻率很高：電壓剛往上、馬上又往下，載子<b>來不及</b>進出，ΔQ 變小。', on: 'B' },
     { sub: '所以頻率越高，擴散電容越小。', on: 'c1' }]);

  /* B6 兩種電容比一比 */
  const B6 = sc('兩種電容比一比', 'C<sub>j</sub> VS C<sub>d</sub>',
    card(70, 110, 240, 140, 'A', T(190, 140, '接面電容 C<sub>j</sub>', { fs: 16 }) + T(190, 170, '空乏區的固定電荷', { cls: 'tm', fs: 13 }) + T(190, 196, 'DC、AC、順偏、逆偏都在', { cls: 'tm', fs: 13 }) + T(190, 224, '逆偏時的主角', { cls: 'ts', fs: 12 })) +
    card(330, 110, 240, 140, 'B', T(450, 140, '擴散電容 C<sub>d</sub>', { fs: 16, cls: 'ta' }) + T(450, 170, '中性區的庫存', { cls: 'tm', fs: 13 }) + T(450, 196, '只在順偏＋交流', { cls: 'tm', fs: 13 }) + T(450, 224, '順偏時的主角', { cls: 'ta', fs: 12 })) +
    chip(320, 284, '順偏：C<sub>d</sub> ≫ C<sub>j</sub>', '講義 1-13 Remark 寫反了，見勘誤 ①', 'c1', { fs: 13, acc: true }),
    [{ sub: '接面電容 C<sub>j</sub>：空乏區兩邊的固定電荷。任何偏壓都在（講義 1-18）。', on: 'A' },
     { sub: '擴散電容 C<sub>d</sub>：中性區的庫存。只有順偏、而且有交流時才作用。', on: 'B' },
     { sub: '順偏時庫存很多，<b>C<sub>d</sub> ≫ C<sub>j</sub></b>。', on: 'c1' }]);

  /* B7 等效電路 */
  const B7 = sc('交流眼中的二極體（加上電容）', 'SMALL-SIGNAL MODEL',
    g('rc', path('M200 128 H440 M200 272 H440 M260 128 V170 M260 230 V272 M380 128 V184 M380 216 V272', 'ln') + K.res(260, 170, 60, true) +
      '<line class="ln" x1="360" y1="194" x2="400" y2="194" style="stroke-width:2.4"/><line class="ln" x1="360" y1="206" x2="400" y2="206" style="stroke-width:2.4"/><line class="ln" x1="380" y1="184" x2="380" y2="194"/><line class="ln" x1="380" y1="206" x2="380" y2="216"/>' +
      T(240, 205, 'r<sub>d</sub>', { cls: 't', fs: 16, a: 'end' }) + T(412, 205, 'C<sub>d</sub>', { cls: 'ta', fs: 16, a: 'start' })) +
    g('p1', arrow(170, 150, 250, 150, null, 'lna') + T(165, 142, '穿過去', { cls: 'tm', fs: 12, a: 'end' })) +
    g('p2', arrow(470, 150, 392, 150, null, 'lna') + T(476, 142, '進出倉庫', { cls: 'tm', fs: 12, a: 'start' })) +
    chip(320, 298, 'r<sub>d</sub> 並聯 C<sub>d</sub>：Y = 1/r<sub>d</sub> + jωC<sub>d</sub>', '講義 1-16', 'c1', { fs: 13 }),
    [{ sub: '所以交流眼中的二極體有<b>兩條路</b>：', on: 'rc' },
     { sub: '一條是穿過二極體的電流 —— 電阻 r<sub>d</sub>。', on: 'p1' },
     { sub: '一條是用來讓庫存漲跌的電流 —— 電容 C<sub>d</sub>。', on: 'p2' },
     { sub: '兩條<b>並聯</b>：導納相加，Y = 1/r<sub>d</sub> + jωC<sub>d</sub>。', on: 'c1' }]);

  /* B8 解謎一 */
  const fc = 1 / (2 * Math.PI * 26 * 192e-12);
  const PZ = axes(90, 120, 300, 150, { v0: 3, v1: 9.5, i0: 0, i1: 1.6, vt: [[3.2, '低頻'], [8, '高頻']], it: [[Math.log10(26), 'r<sub>d</sub>']], xl: 'f', yl: '|Z| (Ω)' });
  const B8 = sc('解開怪現象 ①', 'PUZZLE ① SOLVED',
    PZ.svg + PZ.curve(lf => Math.log10(26 / Math.sqrt(1 + Math.pow(Math.pow(10, lf) / fc, 2))), 3, 9.5, 'cv') +
    PZ.dot(3.2, Math.log10(26), 'd1', 6) + PZ.dot(8, Math.log10(7.9), 'd2', 6) +
    calc(420, 130, 190, [['r<sub>d</sub> 並聯 C<sub>d</sub>', 'r1', 'tm'], ['低頻：電容像斷路', 'r2'], ['→ 只看到 r<sub>d</sub>', 'r3', 'ta'], ['高頻：電容好走', 'r4'], ['→ 阻抗下降', 'r5', 'ta']], { k: 'cc', fs: 14, lh: 25 }),
    [{ sub: '二極體 = r<sub>d</sub> 並聯 C<sub>d</sub>（講義 Fig 1.38(a)）。', on: 'cv cc r1' },
     { sub: '低頻：電容那條路很難走（像斷路），交流只走 r<sub>d</sub>。', on: 'd1 r2 r3' },
     { sub: '頻率高：電容那條變好走，交流抄捷徑 → <b>阻抗下降</b>。怪現象 ① 的原因就是<b>倉庫</b>。', on: 'd2 r4 r5' }]);

  /* B9 先整理一下 */
  const B9 = sc('先整理一下', 'LET\'S RECAP',
    card(70, 112, 240, 120, 'A', T(190, 142, '庫存', { fs: 16 }) + T(190, 172, '順偏時存在中性區的', { cls: 'tm', fs: 13 }) + T(190, 196, '少數載子', { cls: 'tm', fs: 13 })) +
    card(330, 112, 240, 120, 'B', T(450, 142, '電容 C<sub>d</sub>', { fs: 16, cls: 'ta' }) + T(450, 172, '庫存跟著電壓漲跌', { cls: 'tm', fs: 13 }) + T(450, 196, '→ 高頻阻抗變小', { cls: 'tm', fs: 13 })) +
    chip(320, 276, '同一個庫存，在「關掉」時也會惹麻煩', '→ 怪現象 ②', 'c1', { fs: 13, acc: true }),
    [{ sub: '先整理一下：順偏時，中性區存著一堆少數載子（庫存）。', on: 'A' },
     { sub: '庫存跟著電壓漲跌，就是擴散電容；它讓高頻時的阻抗變小。', on: 'B' },
     { sub: '同一個庫存，在二極體<b>關掉</b>的時候也會惹麻煩。', on: 'c1' }]);

  /* B10 水龍頭 */
  const B10 = sc('水龍頭關了，水還在流', 'THE TAP IS OFF…',
    g('tap', '<rect class="card" x="90" y="130" width="220" height="40" rx="6" filter="url(#st-sh)"/>' + path('M310 150 H350 V196', 'lna', null, 'stroke-width:6') + T(200, 156, '水管裡存著水', { cls: 't', fs: 13 })) +
    g('drip', path('M350 204 V236 M344 250 V266 M356 258 V276', 'lna', null, 'stroke-width:3') + T(372, 248, '關了還流一陣子', { cls: 'ta', fs: 13, a: 'start' })) +
    chip(320, 300, '二極體裡存的是少數載子', '關掉時它們還在', 'c1', { fs: 13 }),
    [{ sub: '水龍頭一關，水管裡存著的水還是會流一下才停。', on: 'tap drip' },
     { sub: '二極體裡存的是少數載子。從導通切到逆偏，它們不會瞬間消失。', on: 'c1' }]);

  /* B11–B14 開關波形，一段一段畫 */
  const TX = t => 110 + (t + 20) * 5.2, ts = 30, tfK = 9;
  const iY = i => 200 - i * 10;
  const iSeg1 = 'M' + TX(-20) + ' ' + iY(5) + ' H' + TX(0);
  const iSeg2 = 'M' + TX(0) + ' ' + iY(5) + ' V' + iY(-5) + ' H' + TX(ts);
  let iSeg3 = 'M' + TX(ts) + ' ' + iY(-5); for (let n = 1; n <= 30; n++) { const t = ts + n * 1.2; iSeg3 += ' L' + f1(TX(t)) + ' ' + f1(iY(-5 * Math.exp(-(t - ts) / tfK))); }
  const swBase = '<line class="ln2" x1="100" y1="200" x2="600" y2="200"/>' + T(96, 204, 'i<sub>D</sub>', { cls: 'tm', fs: 13, a: 'end' }) +
    '<line class="ln2 dsh" x1="' + TX(0) + '" y1="128" x2="' + TX(0) + '" y2="276"/>' + T(TX(0), 290, 't = 0 切換', { cls: 'ts', fs: 11 });
  const SWS = (t, en, extra, steps) => sc(t, en, swBase + path(iSeg1, 'lna', 's1', 'stroke-width:2.8') + path(iSeg2, 'lna', 's2', 'stroke-width:2.8') + path(iSeg3, 'lna', 's3', 'stroke-width:2.8') + extra, steps);
  const B11 = SWS('t &lt; 0：順偏導通', 'FORWARD BIAS',
    T(TX(-10), iY(5) - 12, '+I<sub>F</sub>', { cls: 'ta', fs: 13, k: 'l1' }) + chip(470, 140, '庫存：滿的', '電流 I<sub>F</sub> 往前流', 'c1', { fs: 13 }),
    [{ sub: '先順偏：電流 +I<sub>F</sub> 往前流，倉庫是滿的（講義 1-23）。', on: 's1 l1 c1' }]);
  const B12 = SWS('t = 0：電源反過來', 'SWITCHED TO REVERSE',
    T(TX(-10), iY(5) - 12, '+I<sub>F</sub>', { cls: 'ta', fs: 13 }) + T(TX(ts / 2), iY(-5) + 22, '−I<sub>R</sub>：倒流！', { cls: 'ta', fs: 13, k: 'l2' }) +
    chip(470, 140, '庫存還在 → 像短路', 'v<sub>D</sub> ≈ 0，−I<sub>R</sub> ≈ V<sub>R</sub>/R', 'c1', { fs: 13, acc: true }),
    [{ sub: '電源突然反過來。可是庫存還在，接面還沒變回逆偏的樣子。', on: 's1 c1' },
     { sub: '二極體還像<b>短路</b>（v<sub>D</sub> ≈ 0），電流<b>反過來</b>流：−I<sub>R</sub> ≈ V<sub>R</sub>/R（講義 1-24）。', on: 's2 l2' }]);
  const B13 = SWS('儲存時間 t<sub>s</sub>：把庫存掃出去', 'STORAGE TIME',
    T(TX(-10), iY(5) - 12, '+I<sub>F</sub>', { cls: 'ta', fs: 13 }) +
    g('tsb', '<line class="ln dsh" x1="' + TX(ts) + '" y1="128" x2="' + TX(ts) + '" y2="276"/>' + '<rect class="accw" x="' + TX(0) + '" y="252" width="' + (TX(ts) - TX(0)) + '" height="16" rx="3"/>' + T((TX(0) + TX(ts)) / 2, 265, 't<sub>s</sub>', { cls: 'ta', fs: 13 })) +
    chip(470, 140, '倒流的電流在「掃庫存」', '掃完之前幾乎固定', 'c1', { fs: 13 }),
    [{ sub: '這股倒流電流在做一件事：把庫存<b>掃出去</b>。', on: 's1 s2 c1' },
     { sub: '掃完之前電流幾乎固定。這段時間叫<b>儲存時間 t<sub>s</sub></b>（講義 1-25）。', on: 'tsb' }]);
  const B14 = SWS('掉落時間 t<sub>f</sub>：電流歸零', 'FALL TIME',
    T(TX(-10), iY(5) - 12, '+I<sub>F</sub>', { cls: 'ta', fs: 13 }) +
    '<line class="ln dsh" x1="' + TX(ts) + '" y1="128" x2="' + TX(ts) + '" y2="276"/>' + '<rect class="accw" x="' + TX(0) + '" y="252" width="' + (TX(ts) - TX(0)) + '" height="16" rx="3"/>' + T((TX(0) + TX(ts)) / 2, 265, 't<sub>s</sub>', { cls: 'ta', fs: 13 }) +
    g('tfb', '<rect class="bgw" x="' + TX(ts) + '" y="252" width="' + (TX(ts + 2.3 * tfK) - TX(ts)) + '" height="16" rx="3" style="stroke:var(--s-ink);stroke-width:1"/>' + T((TX(ts) + TX(ts + 2.3 * tfK)) / 2, 265, 't<sub>f</sub>', { cls: 't', fs: 13 })) +
    chip(480, 140, '空乏區重建、位障升高', '剩下的載子慢慢清光', 'c1', { fs: 13 }),
    [{ sub: '庫存掃得差不多，空乏區才重新長出來，位障升到 V<sub>bi</sub> + V<sub>R</sub>。', on: 's1 s2 c1' },
     { sub: '電流在<b>掉落時間 t<sub>f</sub></b> 內慢慢降到 0（講義 1-27）。', on: 's3 tfb' }]);

  /* B15 解謎二 */
  const B15 = sc('解開怪現象 ②', 'PUZZLE ② SOLVED',
    card(70, 112, 240, 120, 'A', T(190, 142, '開：turn-on', { fs: 16 }) + T(190, 172, '空乏區縮小、開始注入', { cls: 'tm', fs: 13 }) + T(190, 198, '比較快', { cls: 'tm', fs: 13 })) +
    card(330, 112, 240, 120, 'B', T(450, 142, '關：turn-off', { fs: 16, cls: 'ta' }) + T(450, 172, '要先清庫存（t<sub>s</sub> + t<sub>f</sub>）', { cls: 'tm', fs: 13 }) + T(450, 198, '比較慢', { cls: 'ta', fs: 13 })) +
    chip(320, 276, '倒流的原因：庫存還沒清掉', 'turn-off time &gt; turn-on time', 'c1', { fs: 13, acc: true }),
    [{ sub: '打開二極體：只要讓空乏區縮小、開始注入，很快。', on: 'A' },
     { sub: '關掉二極體：要先把庫存清掉（t<sub>s</sub> + t<sub>f</sub>），比較慢。', on: 'B' },
     { sub: '怪現象 ② 的原因，也是<b>倉庫</b>。所以整流器、開關電路都卡在「關」的速度。', on: 'c1' }]);

  /* B16 家族 */
  const fam = (x, key, a, b) => card(x, 120, 104, 120, key, T(x + 52, 160, a, { fs: 15, cls: 'ta' }) + T(x + 52, 192, b, { cls: 'tm', fs: 12 }));
  const B16 = sc('同一個 pn 接面，五種用法', 'THE DIODE FAMILY',
    fam(36, 'f1', '太陽能電池', '光 → 電（發電）') + fam(150, 'f2', '光二極體', '光 → 電（測光）') + fam(264, 'f3', 'LED', '電 → 光') +
    fam(378, 'f4', '蕭特基', '又快又省電壓') + fam(492, 'f5', '齊納', '故意崩潰穩壓') +
    chip(320, 282, '講義 1.5 Other Diode types', '一個一個看', 'c1', { fs: 13 }),
    [{ sub: '最後認識二極體家族：同一個 pn 接面，換個用法。', on: 'c1' },
     { sub: '光進電出：<b>太陽能電池</b>、<b>光二極體</b>。', on: 'f1 f2' },
     { sub: '電進光出：<b>LED</b>。', on: 'f3' },
     { sub: '還有又快又省電壓的<b>蕭特基</b>，和故意住在崩潰區的<b>齊納</b>。', on: 'f4 f5' }]);

  /* B17 太陽能電池 */
  const B17 = sc('太陽能電池：光進來，電出去', 'SOLAR CELL',
    pnBox(120, 130, 400, 90, 'pn') + g('lt', photon(300, 104) + photon(325, 104) + photon(350, 104) + T(390, 112, '光', { cls: 'ta', fs: 14, a: 'start' })) +
    g('ehp', D.e(320, 160) + D.h(320, 190) + arrow(330, 160, 380, 160, null, 'lna') + arrow(310, 190, 260, 190, null, 'lna') + T(355, 150, '電子 → n', { cls: 'tm', fs: 12 }) + T(285, 212, '電洞 → p', { cls: 'tm', fs: 12 })) +
    g('ld', path('M120 175 H96 V262 H290 M350 262 H544 V175 H520', 'ln') + K.res(290, 262, 60) + T(320, 290, '負載：被供電', { cls: 'ta', fs: 13 })),
    [{ sub: '光打進空乏區，把共價鍵敲開，產生<b>電子電洞對</b>（講義 1-19）。', on: 'pn lt' },
     { sub: '空乏區的電場把電子推到 n、電洞推到 p —— 兩邊分開。', on: 'ehp' },
     { sub: '接上負載，電流就流出去：不用電源，它<b>自己發電</b>。材料：Si、GaAs、III-V 化合物。', on: 'ld' }]);

  /* B18 光二極體 */
  const B18 = sc('光二極體：故意逆偏，拿來測光', 'PHOTODIODE',
    pnBox(120, 130, 400, 90, 'pn') + g('lt', photon(300, 104) + photon(325, 104) + photon(350, 104) + T(390, 112, '光越強', { cls: 'ta', fs: 14, a: 'start' })) +
    g('ckt', path('M120 175 H96 V262 H300 M340 262 H544 V175 H520', 'ln') + '<line class="ln" x1="314" y1="250" x2="314" y2="274" style="stroke-width:3.4"/><line class="ln" x1="326" y1="244" x2="326" y2="280"/>' + path('M300 262 H314 M326 262 H340', 'ln') + T(320, 298, '逆偏（p 接負）', { cls: 'tm', fs: 12 })) +
    chip(170, 112, '光電流 ∝ 光強', '光訊號 → 電訊號', 'c1', { fs: 13, acc: true }),
    [{ sub: '光二極體跟太陽能電池很像，但<b>故意加逆偏</b>（講義 1-20）。', on: 'pn ckt' },
     { sub: '沒光時只有很小的逆向飽和電流；光一照，產生的電子電洞被掃出來。', on: 'lt' },
     { sub: '光越強，光電流越大 —— 拿來<b>偵測光</b>。', on: 'c1' }]);

  /* B19 LED */
  const B19 = sc('LED：電進去，光出來', 'LED',
    pnBox(120, 150, 400, 90, 'pn') +
    g('inj', D.e(250, 180) + D.h(390, 210) + arrow(330, 180, 262, 180, null, 'lna') + arrow(310, 210, 378, 210, null, 'lna')) +
    g('rec', '<circle class="ln dsh" cx="250" cy="180" r="16" style="fill:none"/>' + photon(244, 140) + T(250, 116, '復合 → 光子', { cls: 'ta', fs: 13 })) +
    chip(470, 290, '順偏', '多出的少數載子跟多數載子復合', 'c1', { fs: 13 }),
    [{ sub: 'LED 反過來：<b>順偏</b>，電子電洞衝過空乏區，變成多出來的少數載子。', on: 'pn inj c1' },
     { sub: '它們在中性區跟多數載子<b>復合</b>，掉下來的能量變成光放出來（講義 1-20）。', on: 'rec' }]);

  /* B20 光通訊 */
  const B20 = sc('LED + 光纖 + 光二極體 = 光通訊', 'OPTICAL LINK',
    card(50, 140, 130, 70, 'tx', T(115, 170, 'LED', { cls: 'ta', fs: 16 }) + T(115, 194, '電 → 光', { cls: 'tm', fs: 12 })) +
    g('fib', '<rect class="accw" x="180" y="168" width="280" height="14" rx="7"/>' + T(320, 214, '光纖', { cls: 'ts', fs: 12 })) +
    card(460, 140, 130, 70, 'rx', T(525, 170, '光二極體', { cls: 'ta', fs: 15 }) + T(525, 194, '光 → 電', { cls: 'tm', fs: 12 })) +
    chip(320, 270, 'LED + 光學腔 = 雷射二極體', '講義 1-21', 'c1', { fs: 13 }),
    [{ sub: '發射端 LED 把電訊號變成光。', on: 'tx' },
     { sub: '光沿著光纖傳過去，接收端逆偏的光二極體把光變回電（Fig 1.40）。', on: 'fib rx' },
     { sub: 'LED 再加一個讓光來回反射的光學腔，就是<b>雷射二極體</b>。', on: 'c1' }]);

  /* B21 蕭特基 */
  const B21 = sc('蕭特基：金屬接 n 型', 'SCHOTTKY DIODE',
    pnBox(120, 130, 400, 90, 'mn', { l: '金屬', r: 'n 型', ly: 52 }) +
    calc(120, 236, 190, [['多數載子導電', 'r1'], ['沒有庫存 → t<sub>s</sub> ≈ 0', 'r2', 'ta']], { k: 'c1', fs: 14, lh: 25 }) +
    calc(330, 236, 190, [['I<sub>S</sub> 大 10<sup>4</sup> 倍', 'r3'], ['1 mA：0.30 V vs 0.54 V', 'r4', 'ta']], { k: 'c2', fs: 14, lh: 25 }),
    [{ sub: '把 p 型換成<b>金屬</b>，接在 n 型上（講義 1-28）。', on: 'mn' },
     { sub: '電流靠<b>多數載子</b>，跑到金屬裡還是多數 → 沒有庫存，<b>關得很快</b>。', on: 'c1 r1 r2' },
     { sub: 'I<sub>S</sub> 大很多 → 同樣 1 mA 只要 0.30 V（pn 要 0.54 V，Example 1.12）。IC 裡大量用它。', on: 'c2 r3 r4' }]);

  /* B22 齊納 */
  const B22 = sc('齊納：故意住在崩潰區', 'ZENER DIODE',
    Q.zCirc(120, 140, 170, 130, { k: 'cir', vps: '10 V', r: '1.47 kΩ', vz: '5.6 V' }) +
    calc(380, 120, 230, [['崩潰區像一面牆', 'r1', 'tm'], ['輸出卡在 5.6 V', 'r2', 'ta'], ['R 負責限流：3 mA', 'r3'], ['P<sub>Z</sub> = 16.8 mW', 'r4', 'ta']], { k: 'cc', fs: 14 }),
    [{ sub: 'PART 5 說一般二極體要避開崩潰。齊納反過來，<b>故意反著接、住在崩潰區</b>。', on: 'cir' },
     { sub: '崩潰區的電壓幾乎不動，像一面牆：輸出卡在 <b>5.6 V</b> —— <b>穩壓</b>。', on: 'cc r1 r2' },
     { sub: '電阻負責限流：(10 − 5.6) ÷ 1.47 kΩ = 3 mA，齊納吃 16.8 mW（Design Example 1.13）。', on: 'r3 r4' }]);

  /* B23 恍然大悟 */
  const B23 = sc('恍然大悟', 'THE ANSWER',
    card(60, 104, 250, 120, 'A', T(185, 134, '怪現象 ①', { cls: 'ta', fs: 15 }) + T(185, 162, '庫存 → 擴散電容', { cls: 'tm', fs: 13 }) + T(185, 188, '高頻抄捷徑 → 阻抗下降', { fs: 14 })) +
    card(330, 104, 250, 120, 'B', T(455, 134, '怪現象 ②', { cls: 'ta', fs: 15 }) + T(455, 162, '庫存還沒清', { cls: 'tm', fs: 13 }) + T(455, 188, '倒流 t<sub>s</sub>，再掉落 t<sub>f</sub>', { fs: 14 })) +
    chip(320, 256, '答案：都是「少數載子的倉庫」✓', '沒有倉庫的蕭特基 → 又快又沒有 t<sub>s</sub>', 'ans', { fs: 13, acc: true }),
    [{ sub: '回到開頭兩個怪現象。①：庫存跟著電壓漲跌 = 擴散電容，高頻時交流抄捷徑。', on: 'A' },
     { sub: '②：關掉時庫存還在，要先倒流把它掃掉。', on: 'B' },
     { sub: '<b>謎題解開了</b>：兩個都是少數載子的倉庫。', on: 'ans' }]);

  window.__ch1p7Story = window.__Story('#story', {
    id: 'ch1-part7', title: 'CH1 PART 7 故事：倉庫、開關、二極體家族', after: '#map', afterLabel: '往下看第 01～06 節 ↓',
    scenes: [B0, B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14, B15, B16, B17, B18, B19, B20, B21, B22, B23]
  });
})();

