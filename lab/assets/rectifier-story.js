/* ============================================================
   電子實習 第四章 整流器 —— 故事模式
   主線謎題（使用者 9/30 結報）：輸入 9.92 Vpp，輸出駝峰只有 4.32 V；電表說平均 1.29 V，不是理論的 1.59 V。差在哪？
   答案：① 二極體吃掉約 0.64 V；② 要超過 0.64 V 才導通，導通不到半個週期 → (2V_m cos α − V_γ(π − 2α))/2π ≈ 1.27 V。
   比喻：旋轉門（二極體）、把駝峰「攤平」（平均值）、雙向旋轉門但出口同一邊（全波）。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const TAU = 2 * Math.PI;
  const card = (x, y, w, h) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"/>';
  const path = (d, cls, key, extra) => '<path class="' + cls + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  const P = (fn, x0, x1, n) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + fn(x).toFixed(1); } return d; };
  const sc = (t, en, svg, steps) => ({ t, en, svg, steps });
  /* 波形：x0..x1 兩個週期，中線 ym，振幅 A（像素）；mode：'sin' | 'half' | 'full' ；drop：扣掉的像素 */
  const wave = (x0, x1, ym, A, mode, drop) => P(x => { const s = Math.sin(TAU * 2 * (x - x0) / (x1 - x0)); let v = A * s;
    if (mode === 'half') v = Math.max(0, v - (drop || 0)); if (mode === 'full') v = Math.max(0, A * Math.abs(s) - (drop || 0)); return ym - v; }, x0, x1, 200);
  const box = (x, y, w, h, lab, key, acc) => g(key, '<rect class="' + (acc ? 'accw' : 'bgw') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.8"/>' + T(x + w / 2, y + h / 2, lab, { cls: acc ? 'ta' : 't', fs: 15, dy: '.35em' }));
  const meter = (x, y, top, big, key, acc) => g(key, '<rect class="bgw" x="' + (x - 82) + '" y="' + (y - 34) + '" width="164" height="68" rx="10"/>' + T(x, y - 12, top, { cls: 'tm', fs: 12 }) + T(x, y + 16, big, { cls: acc ? 'ta' : 't', fs: 20 }));
  const diode = (x, y, rot, cls) => '<g transform="rotate(' + (rot || 0) + ' ' + x + ' ' + y + ')"><path class="' + (cls === 'a' ? 'accw' : 'bgw') + '" style="stroke:' + (cls === 'a' ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:2" d="M' + (x - 10) + ' ' + (y - 11) + ' V' + (y + 11) + ' L' + (x + 10) + ' ' + y + ' Z"/><line class="' + (cls === 'a' ? 'lna' : 'ln') + '" x1="' + (x + 10) + '" y1="' + (y - 11) + '" x2="' + (x + 10) + '" y2="' + (y + 11) + '" style="stroke-width:2.6"/></g>';

  /* ════════════ 00 謎題 ════════════ */
  const S0 = sc('理論 1.59 V，量到 1.29 V', 'THE PUZZLE',
    g('w', '<line class="ln2" x1="70" y1="200" x2="330" y2="200"/>' + path(wave(70, 330, 200, 70, 'sin'), 'ln', null, 'stroke-width:2.2') + path(wave(70, 330, 200, 70, 'half', 9), 'lna', null, 'stroke-width:3') + T(200, 112, '示波器：V1 9.92 Vpp、Vo 4.32 V', { cls: 't', fs: 13 })) +
    meter(490, 150, '理論 V<sub>avg</sub> = V<sub>m</sub>/π', '1.59 V', 'th') + meter(490, 240, '你量到的', '1.29 V', 'me', true) +
    chip(320, 300, '差了快 20%，量錯了嗎？', null, 'q', { fs: 13, acc: true }),
    [{ sub: '9/30 你做半波整流：函數產生器 10 Vpp、60 Hz，接一顆 1N4002 和 1 kΩ。', on: 'w' },
     { sub: '理論課本說：輸出平均 = V<sub>m</sub>/π = 5/π = <b>1.59 V</b>。', on: 'th' },
     { sub: '你量到的是 <b>1.29 V</b>。', on: 'me' },
     { sub: '差了快 20%。<b>是量錯了，還是理論少算了什麼？</b>', on: 'q' }]);

  /* ════════════ 01 複習：旋轉門 ════════════ */
  const S1 = sc('先複習：二極體是單向旋轉門', 'RECAP · ONE-WAY DOOR',
    g('d', diode(320, 190, 0) + path('M220 190 H310 M330 190 H420', 'ln')) +
    g('f', arrow(220, 150, 420, 150, null, 'lna') + T(320, 136, '順偏：過得去（吃掉約 0.6～0.7 V）', { cls: 'ta', fs: 13 })) +
    g('r', arrow(420, 240, 220, 240, null, 'ln') + T(320, 270, '反偏：卡住', { fs: 13 }) + path('M306 228 L334 252 M334 228 L306 252', 'ln', null, 'stroke-width:3')),
    [{ sub: '先複習上一章：二極體是一扇<b>單向旋轉門</b>。', on: 'd' },
     { sub: '順著推：過得去，但要先吃掉約 0.6～0.7 V（門檻）。', on: 'f' },
     { sub: '反著推：卡住。這一章拿這個特性把<b>交流變直流</b>。', on: 'r' }]);

  /* ════════════ 02 交流 ════════════ */
  const S2 = sc('交流：一下正、一下負', 'AC',
    '<line class="ln2" x1="80" y1="200" x2="560" y2="200"' + k('ax') + '/>' + path(wave(80, 560, 200, 80, 'sin'), 'lna', 'w', 'stroke-width:3') +
    T(140, 112, '正半週', { cls: 'ta', fs: 14, k: 'p' }) + T(260, 300, '負半週', { fs: 14, k: 'n' }) +
    chip(470, 112, '插座 AC 110 V、60 Hz', '一秒來回 60 次', 'c1', { fs: 12.5 }),
    [{ sub: '插座給的是<b>交流</b>（AC）：電壓像波浪一樣上上下下。', on: 'ax w' },
     { sub: '上面那半叫<b>正半週</b>……', on: 'p' },
     { sub: '……下面那半叫<b>負半週</b>，電流方向整個反過來。', on: 'n' },
     { sub: '手機、電腦要的是<b>直流</b>（DC）：方向固定。<b>整流器</b>就是把 AC 變 DC 的電路（講義 p.2）。', on: 'c1' }]);

  /* ════════════ 03 四個數字 ════════════ */
  const S3 = sc('一個正弦波，四個數字', 'FOUR NUMBERS',
    '<line class="ln2" x1="90" y1="200" x2="380" y2="200"/>' + path(P(x => 200 - 80 * Math.sin(TAU * (x - 90) / 290), 90, 380, 120), 'lna', null, 'stroke-width:3') +
    g('m', '<line class="ln2 dsh" x1="90" y1="120" x2="400" y2="120"/>' + arrow(400, 200, 400, 124, null, 'lna') + T(410, 160, 'V<sub>m</sub>：最大值', { cls: 'ta', fs: 13, a: 'start' })) +
    g('pp', arrow(470, 120, 470, 278, null, 'ln') + arrow(470, 278, 470, 120, null, 'ln') + T(480, 290, 'V<sub>pp</sub> = 2V<sub>m</sub>', { fs: 13, a: 'start' })) +
    g('rms', '<line class="ln dsh" x1="90" y1="143" x2="380" y2="143"/>' + T(100, 136, 'V<sub>rms</sub> = V<sub>m</sub>/√2（有效值）', { cls: 't', fs: 12.5, a: 'start' })) +
    g('avg', '<line class="lna" x1="90" y1="200" x2="380" y2="200" style="stroke-width:3"/>' + T(100, 222, 'V<sub>avg</sub> = 0（上下抵消）', { cls: 'ta', fs: 12.5, a: 'start' })),
    [{ sub: '一個正弦波要記四個數字（講義 p.4）。第一個：最高點 <b>V<sub>m</sub></b>（最大值）。', on: 'm' },
     { sub: '<b>V<sub>pp</sub></b>（峰對峰值）：最高到最低，= 2V<sub>m</sub>。函數產生器設的 10 Vpp 就是這個，所以 V<sub>m</sub> = 5 V。', on: 'pp' },
     { sub: '<b>V<sub>rms</sub></b>（有效值）：能做同樣多功的直流電壓，= V<sub>m</sub>/√2。', on: 'rms' },
     { sub: '<b>V<sub>avg</sub></b>（平均值）：上下一抵消，完整正弦波的平均是 <b>0</b>。', on: 'avg' },
     { sub: '所以講義問的「V<sub>pp</sub> = ? V<sub>rms</sub>」：V<sub>pp</sub> = 2V<sub>m</sub> = <b>2√2 V<sub>rms</sub> ≈ 2.83 V<sub>rms</sub></b>。' }]);

  /* ════════════ 04 有效值 ════════════ */
  const S4 = sc('電表 AC 檔量的是有效值', 'RMS ON THE METER',
    meter(190, 160, '插座標示', 'AC 110 V', 'a') + g('a2', T(190, 230, '→ 峰值 110 × √2 = 155.6 V', { cls: 'tm', fs: 13 })) +
    meter(450, 160, '你的 V1（AC 檔）', '3.464 V', 'b', true) + g('b2', T(450, 230, '理論 5/√2 = 3.54 V，差 2%', { cls: 'ta', fs: 13 })),
    [{ sub: '市電標的 AC 110 V 是<b>有效值</b>（講義 p.4）。', on: 'a' },
     { sub: '所以插座的最高點其實是 110 × √2 ≈ 155.6 V。', on: 'a2' },
     { sub: '三用電表 AC 檔量到的也是有效值：你的 V1 = <b>3.464 V</b>。', on: 'b' },
     { sub: '理論 5/√2 = 3.54 V，差 2% —— 產生器實際只有 9.92 Vpp，對得上。', on: 'b2' }]);

  /* ════════════ 05 半波 ════════════ */
  const S5 = sc('半波整流：只讓正半週過去', 'HALF-WAVE',
    '<line class="ln2" x1="80" y1="150" x2="560" y2="150"/>' + path(wave(80, 560, 150, 45, 'sin'), 'ln', 'in', 'stroke-width:2.2') + T(76, 112, 'V<sub>i</sub>', { fs: 13, a: 'start', k: 'li' }) +
    '<line class="ln2" x1="80" y1="270" x2="560" y2="270"' + k('ax2') + '/>' + path(wave(80, 560, 270, 45, 'half'), 'lna', 'out', 'stroke-width:3') + T(76, 216, 'V<sub>o</sub>', { cls: 'ta', fs: 13, a: 'start', k: 'lo' }) +
    chip(450, 210, '負半週：門卡住 → 0', null, 'c1', { fs: 12.5 }),
    [{ sub: '最簡單的整流：只用<b>一顆二極體</b>串在電源和負載中間（講義 p.3）。', on: 'in li' },
     { sub: '正半週：順偏，門打開，輸出跟著輸入。', on: 'ax2 out lo' },
     { sub: '負半週：反偏，門卡住，輸出 = 0。', on: 'c1' },
     { sub: '輸出只剩一顆一顆的駝峰：方向固定、大小一直變 —— <b>脈動直流</b>。' }]);

  /* ════════════ 06 半波平均 ════════════ */
  const S6 = sc('把駝峰攤平：平均值', 'AVERAGE VALUE',
    '<line class="ln2" x1="80" y1="250" x2="560" y2="250"/>' + path(wave(80, 560, 250, 120, 'half'), 'lna', 'out', 'stroke-width:3') +
    g('flat', '<rect class="accw" x="80" y="' + (250 - 120 / Math.PI).toFixed(1) + '" width="480" height="' + (120 / Math.PI).toFixed(1) + '" opacity=".8"/>') +
    T(570, 250 - 120 / Math.PI + 5, 'V<sub>m</sub>/π', { cls: 'ta', fs: 14, a: 'end', k: 'lab' }) +
    chip(320, 112, 'V<sub>avg</sub> = V<sub>m</sub>/π = 0.318 V<sub>m</sub> = 0.45 V<sub>rms</sub>', '三用電表 DC 檔量到的就是它', 'c1', { fs: 13, acc: true }),
    [{ sub: '電表 DC 檔量的是<b>平均值</b>：把駝峰「攤平」成一條水平線，有多高？', on: 'out' },
     { sub: '駝峰只佔一半時間，另一半是 0，攤平後只剩 V<sub>m</sub>/π。', on: 'flat lab' },
     { sub: '講義 p.3：<b>V<sub>avg</sub> = V<sub>m</sub>/π = 0.318V<sub>m</sub> = 0.45V<sub>rms</sub></b>。V<sub>m</sub> = 5 V → 1.59 V。', on: 'c1' },
     { sub: '這就是謎題裡那個「理論 1.59 V」—— 但它假設二極體<b>完全不吃電壓</b>。' }]);

  /* ════════════ 07 耐壓 ════════════ */
  const S7 = sc('負半週，二極體扛全部', 'PEAK INVERSE VOLTAGE',
    '<line class="ln2" x1="80" y1="190" x2="560" y2="190"/>' + path(wave(80, 560, 190, 80, 'sin'), 'ln', 'in', 'stroke-width:2.2') +
    g('neg', '<circle class="acc" cx="260" cy="270" r="6"/>' + arrow(260, 190, 260, 264, null, 'lna') + T(272, 250, '−V<sub>m</sub>', { cls: 'ta', fs: 15, a: 'start' })) +
    chip(440, 120, '二極體須能承受 V<sub>m</sub> 的逆向電壓', '講義 p.3', 'c1', { fs: 12.5, acc: true }),
    [{ sub: '負半週門卡住，電阻沒電流、沒壓降……', on: 'in' },
     { sub: '……整個輸入電壓都反著壓在二極體上，最大到 <b>V<sub>m</sub></b>。', on: 'neg' },
     { sub: '所以講義 p.3：半波整流的二極體<b>耐壓要 ≥ V<sub>m</sub></b>。', on: 'c1' }]);

  /* ════════════ 08 先整理一下 ════════════ */
  const S8 = sc('先整理一下', 'LET\'S RECAP',
    g('A', card(40, 110, 175, 140) + T(127, 140, '① 四個數字', { fs: 15 }) + T(127, 172, 'V<sub>pp</sub> = 2V<sub>m</sub>', { cls: 'tm', fs: 12.5 }) + T(127, 198, 'V<sub>m</sub> = √2 V<sub>rms</sub>', { cls: 'tm', fs: 12.5 })) +
    g('B', card(232, 110, 175, 140) + T(320, 140, '② 半波', { fs: 15 }) + T(320, 172, '只留正半週', { cls: 'tm', fs: 12.5 }) + T(320, 198, 'V<sub>avg</sub> = V<sub>m</sub>/π', { cls: 'tm', fs: 12.5 })) +
    g('C', card(424, 110, 175, 140) + T(511, 140, '③ 耐壓', { fs: 15, cls: 'ta' }) + T(511, 172, '負半週扛 V<sub>m</sub>', { cls: 'tm', fs: 12.5 }) + T(511, 198, 'PIV ≥ V<sub>m</sub>', { cls: 'tm', fs: 12.5 })) +
    chip(320, 288, '接下來：負半週也拿來用 → 全波整流', null, 'c1', { fs: 13 }),
    [{ sub: '先整理一下。① V<sub>pp</sub> = 2V<sub>m</sub>、V<sub>m</sub> = √2V<sub>rms</sub>。', on: 'A' },
     { sub: '② 半波整流只留正半週，平均 V<sub>m</sub>/π。', on: 'B' },
     { sub: '③ 二極體要扛得住 V<sub>m</sub>。半波浪費了一半，接下來把負半週也用上。', on: 'C c1' }]);

  /* ════════════ 09 全波 ════════════ */
  const S9 = sc('全波整流：負半週翻上來', 'FULL-WAVE',
    '<line class="ln2" x1="80" y1="150" x2="560" y2="150"/>' + path(wave(80, 560, 150, 45, 'sin'), 'ln', 'in', 'stroke-width:2.2') +
    '<line class="ln2" x1="80" y1="270" x2="560" y2="270"' + k('ax2') + '/>' + path(wave(80, 560, 270, 45, 'full'), 'lna', 'out', 'stroke-width:3') +
    g('flat', '<rect class="accw" x="80" y="' + (270 - 90 / Math.PI).toFixed(1) + '" width="480" height="' + (90 / Math.PI).toFixed(1) + '" opacity=".8"/>') +
    chip(470, 205, 'V<sub>avg</sub> = 2V<sub>m</sub>/π = 0.9V<sub>rms</sub>', '是半波的兩倍', 'c1', { fs: 12.5, acc: true }),
    [{ sub: '<b>全波整流</b>：不管正半週還是負半週，都有電壓輸出（講義 p.5）。', on: 'in' },
     { sub: '負半週被「翻正」：像雙向都推得動的旋轉門，但出口都在同一邊。', on: 'ax2 out' },
     { sub: '駝峰變兩倍多，攤平後是 <b>2V<sub>m</sub>/π = 0.637V<sub>m</sub> = 0.9V<sub>rms</sub></b>。', on: 'flat c1' },
     { sub: '駝峰一秒 120 顆：<b>漣波頻率變成 2f<sub>s</sub></b>，下一章濾波會比較容易。' }]);

  /* ════════════ 10 中間抽頭 ════════════ */
  const ct = (hiTop) => path('M150 130 V270 M150 200 H110', 'ln') + T(100, 205, '中間抽頭', { cls: 'tm', fs: 11, a: 'end' }) +
    path('M150 130 H240 M262 130 H380 V160 M380 240 V270 H262 M240 270 H150', 'ln') + diode(250, 130, 0, hiTop ? 'a' : '') + diode(250, 270, 0, hiTop ? '' : 'a') +
    '<rect class="bgw" x="372" y="160" width="16" height="80"/>' + T(400, 205, 'R<sub>L</sub>', { fs: 13, a: 'start' }) + path('M380 200 H330 M330 200 V200', 'ln');
  const S10 = sc('中間抽頭式：兩顆輪流', 'CENTER-TAPPED',
    g('a', ct(true) + T(250, 112, 'D1 ON', { cls: 'ta', fs: 13 }) + T(250, 300, 'D2 OFF', { cls: 'tm', fs: 13 })) +
    g('b', ct(false) + T(250, 112, 'D1 OFF', { cls: 'tm', fs: 13 }) + T(250, 300, 'D2 ON', { cls: 'ta', fs: 13 })) +
    chip(510, 150, '變壓器中間拉一條線', '上下兩半各接一顆二極體', 'c1', { fs: 12 }) +
    chip(510, 250, '二極體耐壓 2V<sub>m</sub>', '講義 p.8 的表', 'c2', { fs: 12, acc: true }),
    [{ sub: '第一種全波：<b>中間抽頭式</b>。變壓器次級線圈中間拉一條線當地（講義 p.6）。', on: 'c1' },
     { sub: '正半週：<b>D1 導通、D2 截止</b>，電流經 D1 流過 R<sub>L</sub>。', on: 'a' },
     { sub: '負半週：<b>D2 導通、D1 截止</b>，電流經 D2，流過 R<sub>L</sub> 的方向一樣。', off: 'a', on: 'b' },
     { sub: '只要兩顆二極體，但截止那顆要扛 <b>2V<sub>m</sub></b>，而且變壓器要有中間抽頭。', on: 'c2' }]);

  /* ════════════ 11 橋式 ════════════ */
  const bridge = on => {
    const cx = 250, cy = 200, r = 70, pts = { t: [cx, cy - r], b: [cx, cy + r], l: [cx - r, cy], rr: [cx + r, cy] };
    const dd = (a, b2, rot, key) => { const mx = (a[0] + b2[0]) / 2, my = (a[1] + b2[1]) / 2, ang = Math.atan2(b2[1] - a[1], b2[0] - a[0]) * 180 / Math.PI; return path('M' + a[0] + ' ' + a[1] + ' L' + b2[0] + ' ' + b2[1], 'ln') + diode(mx, my, ang, on.includes(key) ? 'a' : '') + T(mx + (mx < cx ? -24 : 24), my + (my < cy ? -8 : 8), key, { cls: on.includes(key) ? 'ta' : 'tm', fs: 12, dy: '.35em' }); };
    return dd(pts.l, pts.t, 0, 'D1') + dd(pts.b, pts.l, 0, 'D2') + dd(pts.rr, pts.t, 0, 'D3') + dd(pts.b, pts.rr, 0, 'D4') +
      path('M' + cx + ' ' + (cy - r) + ' V112 H420 V170 M420 230 V300 H' + cx + ' V' + (cy + r), 'ln') + '<rect class="bgw" x="412" y="170" width="16" height="60"/>' + T(440, 205, 'R<sub>L</sub>', { fs: 13, a: 'start' }) +
      path('M' + (cx - r) + ' ' + cy + ' H120 V256 M120 284 V314 H360 V308 a8 8 0 0 0 0 -16 V' + cy + ' H' + (cx + r), 'ln') +
      '<circle class="bgw" cx="120" cy="270" r="14" style="stroke:var(--s-ink);stroke-width:1.8"/>' + path('M112 270 C115 262 119 262 120 270 S125 278 128 270', 'ln') + T(98, 270, 'V<sub>i</sub>', { fs: 13, a: 'end', dy: '.35em' });
  };
  const S11 = sc('橋式整流：四顆、最常用', 'BRIDGE RECTIFIER',
    g('a', bridge(['D1', 'D4'])) + g('b', bridge(['D2', 'D3'])) +
    chip(540, 140, '正半週：D1、D4', null, 'c1', { fs: 12.5, acc: true }) + chip(540, 200, '負半週：D2、D3', null, 'c2', { fs: 12.5, acc: true }) +
    chip(540, 270, '每次經過兩顆', '峰值少約 1.4 V', 'c3', { fs: 12 }),
    [{ sub: '第二種全波：<b>橋式整流</b>，四顆二極體排成菱形，最常用（講義 p.7）。', on: 'a' },
     { sub: '正半週：<b>D1、D4</b> 導通，D2、D3 截止。', on: 'c1' },
     { sub: '負半週：<b>D2、D3</b> 導通，流過 R<sub>L</sub> 的方向還是一樣。', off: 'a', on: 'b c2' },
     { sub: '不用中間抽頭、耐壓只要 V<sub>m</sub>；代價是電流每次要過<b>兩顆</b>，峰值少約 1.4 V。', on: 'c3' }]);

  /* ════════════ 12 比較表 ════════════ */
  const row = (y, a, b, c, d, key, acc) => g(key, T(150, y, a, { cls: 'tm', fs: 13, a: 'end' }) + T(240, y, b, { fs: 13 }) + T(380, y, c, { fs: 13, cls: acc ? 'ta' : 't' }) + T(520, y, d, { fs: 13, cls: acc ? 'ta' : 't' }));
  const S12 = sc('三種整流比一比', 'COMPARISON',
    card(40, 104, 560, 200) + row(130, '', '半波', '中間抽頭', '橋式', null) +
    row(162, '二極體', '1', '2', '4', 'r1') + row(194, '平均', '0.318V<sub>m</sub>', '0.637V<sub>m</sub>', '0.637V<sub>m</sub>', 'r2', true) +
    row(226, '漣波頻率', 'f<sub>s</sub>', '2f<sub>s</sub>', '2f<sub>s</sub>', 'r3') + row(258, '耐壓', 'V<sub>m</sub>', '2V<sub>m</sub>', 'V<sub>m</sub>', 'r4') + row(290, '加電容後', '2V<sub>m</sub>', '2V<sub>m</sub>', 'V<sub>m</sub>', 'r5'),
    [{ sub: '講義 p.8 的比較表。二極體數量：1、2、4。', on: 'r1' },
     { sub: '平均：全波是半波的兩倍。', on: 'r2' },
     { sub: '漣波頻率：全波兩倍。', on: 'r3' },
     { sub: '耐壓：中間抽頭要 2V<sub>m</sub>。加了濾波電容後，半波也變成 2V<sub>m</sub>（電容撐住 +V<sub>m</sub>，輸入又到 −V<sub>m</sub>）。', on: 'r4 r5' }]);

  /* ════════════ 13 你的數據：峰值 ════════════ */
  const S13 = sc('回到謎題：峰值少了 0.64 V', 'BACK TO THE PUZZLE',
    '<line class="ln2" x1="80" y1="250" x2="420" y2="250"/>' + path(P(x => 250 - 130 * Math.sin(TAU * (x - 80) / 340), 80, 250, 80), 'ln', 'in', 'stroke-width:2.2') +
    path(P(x => 250 - Math.max(0, 130 * Math.sin(TAU * (x - 80) / 340) - 17), 80, 250, 80) + ' L420 250', 'lna', 'out', 'stroke-width:3') +
    g('d', '<line class="ln2 dsh" x1="165" y1="120" x2="440" y2="120"/><line class="ln2 dsh" x1="165" y1="137" x2="440" y2="137"/>' + arrow(430, 137, 430, 122, null, 'lna') + T(450, 132, '0.64 V', { cls: 'ta', fs: 14, a: 'start' })) +
    calc0(),
    [{ sub: '回到開頭。示波器上 V1 = 9.92 Vpp → V<sub>m</sub> = <b>4.96 V</b>。', on: 'in r1' },
     { sub: 'Vo 的最高點 <b>4.32 V</b>。', on: 'out r2' },
     { sub: '少了 <b>0.64 V</b> —— 就是二極體的門檻，跟上一章量到的 0.6～0.7 V 一致。', on: 'd r3' }]);
  function calc0() {
    return g('cc', card(440, 170, 180, 120)) + T(455, 200, 'V<sub>m</sub> = 9.92/2 = 4.96', { fs: 13, a: 'start', k: 'r1' }) + T(455, 230, 'V<sub>o,peak</sub> = 4.32', { fs: 13, a: 'start', k: 'r2' }) + T(455, 262, '差 0.64 V', { cls: 'ta', fs: 14, a: 'start', k: 'r3' });
  }

  /* ════════════ 14 你的數據：平均 ════════════ */
  const S14 = sc('平均值：兩個地方被吃掉', 'WHERE DID THE AVERAGE GO',
    '<line class="ln2" x1="70" y1="270" x2="570" y2="270"/>' +
    path(wave(70, 570, 270, 130, 'half'), 'ln dsh', 'ideal', 'stroke-width:2') + path(wave(70, 570, 270, 130, 'half', 17), 'lna', 'real', 'stroke-width:3') +
    chip(180, 120, '① 每個駝峰矮 0.64 V', null, 'c1', { fs: 12.5 }) +
    chip(470, 120, '② 超過 0.64 V 才開始導通', '導通時間不到半個週期', 'c2', { fs: 12.5 }) +
    chip(320, 300, '(2V<sub>m</sub>cosα − V<sub>γ</sub>(π − 2α)) / 2π ≈ 1.27 V', 'α = sin<sup>−1</sup>(0.64/4.96) = 7.4°', 'c3', { fs: 12.5, acc: true }),
    [{ sub: '虛線是理想二極體的輸出，實線是真的。', on: 'ideal real' },
     { sub: '第一個差別：每個駝峰都<b>矮了 0.64 V</b>。', on: 'c1' },
     { sub: '第二個：輸入要先超過 0.64 V 才導通，所以駝峰也<b>變窄</b>了。', on: 'c2' },
     { sub: '把兩個都算進去，平均 ≈ <b>1.27 V</b>，模擬 1.28 V —— 你的 1.29 V 完全對。', on: 'c3' },
     { sub: '報告裡寫的 (5 − 0.7)/π = 1.37 V 只算了第一個，所以還差一點。' }]);

  /* ════════════ 15 你的量法 ════════════ */
  const S15 = sc('你量平均的方法其實很聰明', 'A CLEVER MEASUREMENT',
    g('c', card(90, 110, 460, 150) + T(110, 140, 'KVL：V1 = V<sub>D</sub> + V<sub>o</sub>（每一瞬間都成立）', { fs: 14, a: 'start' }) +
      T(110, 174, '兩邊取平均：⟨V1⟩ = ⟨V<sub>D</sub>⟩ + ⟨V<sub>o</sub>⟩', { fs: 14, a: 'start', k: 'r1' }) +
      T(110, 208, '⟨V1⟩ = 0 → ⟨V<sub>o</sub>⟩ = −⟨V<sub>D</sub>⟩ = 1.29 V', { cls: 'ta', fs: 15, a: 'start', k: 'r2' }) +
      T(110, 242, '模擬：V<sub>D</sub> 平均 −1.284 V ✓', { cls: 'tm', fs: 13, a: 'start', k: 'r3' })),
    [{ sub: '你的 Vo 那張照片電表在 ACV 檔，所以改用二極體的 DC 電壓 −1.29 V 推回去。', on: 'c' },
     { sub: 'KVL 每一瞬間都成立，所以<b>平均也成立</b>。', on: 'r1' },
     { sub: '正弦波平均是 0，所以 Vo 的平均 = −二極體的平均 = <b>1.29 V</b>。', on: 'r2' },
     { sub: '模擬二極體平均 −1.284 V，跟你量的一樣。', on: 'r3' }]);

  /* ════════════ 16 ACV 檔 ════════════ */
  const S16 = sc('ACV 檔的 1.57 V 是什麼', 'WHAT DID ACV READ',
    '<line class="ln2" x1="70" y1="250" x2="330" y2="250"/>' + path(wave(70, 330, 250, 110, 'half', 14), 'lna', 'w', 'stroke-width:3') +
    g('dc', '<line class="ln dsh" x1="70" y1="' + (250 - 110 * 1.284 / 4.96).toFixed(1) + '" x2="330" y2="' + (250 - 110 * 1.284 / 4.96).toFixed(1) + '"/>' + T(340, 250 - 110 * 1.284 / 4.96 + 4, 'DC 部分 1.28 V', { fs: 12.5, a: 'start' })) +
    chip(470, 140, 'ACV 檔：只量「上下晃」的部分', '模擬 1.64 V，你量 1.57 V', 'c1', { fs: 12.5, acc: true }) +
    chip(480, 285, '量平均要用 DCV 檔', null, 'c2', { fs: 12.5 }),
    [{ sub: '脈動直流 = 一條<b>直流</b>（平均 1.28 V）＋ 疊在上面<b>晃動的交流</b>。', on: 'w dc' },
     { sub: '電表 ACV 檔把直流擋掉，只量晃動那部分的有效值：模擬 1.64 V，你量 1.57 V。', on: 'c1' },
     { sub: '所以量「平均」一定要切 <b>DCV</b>。你心得說的「看清楚 VAC 還是 VDC」就是這個。', on: 'c2' }]);

  /* ════════════ 17 PSpice ════════════ */
  const S17 = sc('回家作業：PSpice 半波 vs 橋式', 'PSPICE',
    T(180, 116, '半波：VAMP 10、100 Ω', { fs: 13 }) + '<line class="ln2" x1="60" y1="250" x2="300" y2="250"/>' + path(wave(60, 300, 250, 100, 'half', 8), 'lna', 'h', 'stroke-width:2.6') + T(180, 280, '峰值 9.19 V', { cls: 'ta', fs: 12.5, k: 'ht' }) +
    T(460, 116, '橋式：VAMP 10、100 Ω', { fs: 13 }) + '<line class="ln2" x1="340" y1="250" x2="580" y2="250"/>' + path(wave(340, 580, 250, 100, 'full', 16), 'lna', 'b', 'stroke-width:2.6') + T(460, 280, '峰值 8.39 V（兩顆壓降）', { cls: 'ta', fs: 12.5, k: 'bt' }),
    [{ sub: '回家作業（講義 p.10～11）：VAMP = 10 V、60 Hz、100 Ω，Time Domain 模擬。', on: 'h' },
     { sub: '半波：駝峰 9.19 V，負半週 0。', on: 'ht' },
     { sub: '橋式：一秒兩倍的駝峰，但峰值只有 8.39 V —— 每次要過兩顆二極體。', on: 'b bt' },
     { sub: '注意：作業 VAMP = 10 是<b>振幅</b> 10 V，課堂是 10 Vpp（振幅 5 V）。' }]);

  /* ════════════ 18 恍然大悟 ════════════ */
  const S18 = sc('恍然大悟', 'THE ANSWER',
    T(320, 190, '?', { cls: 'ta', fs: 96, k: 'q' }) +
    g('L', card(70, 100, 236, 130) + T(188, 128, '理論 1.59 V', { fs: 15 }) + T(188, 158, '假設二極體不吃電壓', { cls: 'tm', fs: 13 }) + T(188, 184, '而且導通整整半週', { cls: 'tm', fs: 13 }) + T(188, 212, 'V<sub>m</sub>/π', { fs: 14 })) +
    g('R', card(334, 100, 236, 130) + T(452, 128, '實際 1.29 V', { fs: 15, cls: 'ta' }) + T(452, 158, '峰值少 0.64 V', { cls: 'tm', fs: 13 }) + T(452, 184, '導通不到半週', { cls: 'tm', fs: 13 }) + T(452, 212, '模擬 1.28 V ✓', { cls: 'ta', fs: 14 })),
    [{ sub: '回到開頭：理論 1.59 V，你量到 1.29 V，量錯了嗎？', on: 'q' },
     { sub: '理論假設二極體不吃電壓、導通整整半週。', off: 'q', on: 'L' },
     { sub: '真的二極體：峰值少 0.64 V、導通不到半週 → 1.28 V。', on: 'R' },
     { sub: '<b>你沒量錯</b>。下一章：加電容把駝峰抹平。' }]);

  window.__rectStory = window.__Story('#story', {
    id: 'lab-rectifier', title: '電子實習 CH4 整流器', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18]
  });
})();
