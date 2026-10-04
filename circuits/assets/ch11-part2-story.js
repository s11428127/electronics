/* ============================================================
   電路學 CH11 PART 2 —— 故事模式（11.4 有效值、11.5 視在功率與功率因數）
   謎題一：插座寫 110 V，示波器量到最高點 155 V —— 110 是什麼？
   謎題二：4 kW 馬達接 120 V，照算 33.3 A，量到 41.7 A —— 多出來的電流哪來的？
   答案：110 V 是有效值（155/√2）；電線扛的是視在功率 S = P/pf = 5000 VA → 41.7 A。
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
  const area = (fn, x0, x1, base, cls, op) => {
    let d = 'M' + x0 + ' ' + base;
    for (let i = 0; i <= 160; i++) { const x = x0 + (x1 - x0) * i / 160; d += ' L' + x.toFixed(1) + ' ' + fn(x).toFixed(1); }
    return '<path class="' + cls + '" opacity="' + op + '" d="' + d + ' L' + x1 + ' ' + base + ' Z"/>';
  };
  const card = (x, y, w, h, extra) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"' + (extra || '') + '/>';
  const brace = (x, y, w) => '<path class="lna" d="M' + (x - w) + ' ' + y + ' Q' + (x - w) + ' ' + (y + 10) + ' ' + (x - w + 10) + ' ' + (y + 10) + ' H' + (x - 5) + ' L' + x + ' ' + (y + 17) + ' L' + (x + 5) + ' ' + (y + 10) + ' H' + (x + w - 10) + ' Q' + (x + w) + ' ' + (y + 10) + ' ' + (x + w) + ' ' + y + '"/>';
  const hbar = (x, y, w, hgt, cls) => '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + Math.max(0, w).toFixed(1) + '" height="' + hgt + '" rx="3"/>';
  const sw = (x0, x1, yc, A, per, f) => P(x => yc - A * f((x - x0) / per), x0, x1, 200);   /* f(週期比例) ∈ [−1, 1] */
  const SIN = u => Math.sin(TAU * u);
  const motor = (x, y, key, lbl) => g(key, '<rect class="bgw" x="' + (x - 40) + '" y="' + (y - 32) + '" width="80" height="64" rx="10"/>' + T(x, y, 'M', { fs: 24, dy: '.35em' }) + T(x, y + 52, lbl || '馬達 4 kW', { cls: 'tm', fs: 12 }));
  /* 電熱水壺 */
  const kettle = (x, y, key) => g(key, '<path class="bgw" d="M' + (x - 30) + ' ' + (y + 30) + ' L' + (x - 24) + ' ' + (y - 22) + ' H' + (x + 24) + ' L' + (x + 30) + ' ' + (y + 30) + ' Z"/>' +
    '<path class="ln" d="M' + (x + 26) + ' ' + (y - 6) + ' L' + (x + 44) + ' ' + (y - 20) + ' M' + (x - 26) + ' ' + (y - 10) + ' Q' + (x - 48) + ' ' + y + ' ' + (x - 28) + ' ' + (y + 18) + '"/>' +
    '<path class="ln" d="M' + (x - 12) + ' ' + (y - 22) + ' V' + (y - 30) + ' H' + (x + 12) + ' V' + (y - 22) + '"/>');
  const steam = (x, y, key) => g(key, path('M' + (x - 10) + ' ' + y + ' q-6 -10 0 -20 t0 -20', 'lna') + path('M' + (x + 4) + ' ' + y + ' q-6 -10 0 -20 t0 -20', 'lna') + path('M' + (x + 18) + ' ' + y + ' q-6 -10 0 -20 t0 -20', 'lna'), ' class="pulse"');

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '110 V 與 41.7 A', en: 'TWO QUESTIONS',
    svg: g('out', '<rect class="bgw" x="70" y="118" width="80" height="80" rx="14"/><rect class="ink" x="92" y="140" width="8" height="24" rx="2"/><rect class="ink" x="120" y="140" width="8" height="24" rx="2"/>' +
        '<circle class="ink" cx="110" cy="180" r="5"/>' + T(110, 222, '插座：110 V', { fs: 14 })) +
      g('scope', '<rect class="bgw" x="172" y="112" width="128" height="92" rx="8"/>' + '<path class="ln2" d="M180 158 H292"/>' + path(sw(180, 292, 158, 34, 56, SIN), 'lna', null, 'stroke-width:2') +
        path('M180 124 H292', 'ln dsh', null, 'stroke-width:1.2') + T(236, 222, '示波器：最高 155 V', { cls: 'ta', fs: 13 })) +
      motor(410, 150, 'mot') +
      T(530, 136, '4000 ÷ 120', { cls: 'tm', fs: 14, k: 'calc' }) + T(530, 160, '= 33.3 A？', { fs: 15, k: 'calc2' }) +
      T(530, 214, '量到 41.7 A', { cls: 'ta', fs: 20, k: 'meas' }) +
      T(320, 250, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '牆上的插座寫 <b>110 V</b>。', on: 'out' },
      { sub: '可是用示波器量，電壓的最高點有 <b>155 V</b>。那 110 到底是什麼？', on: 'scope' },
      { sub: '另一件怪事：工廠的馬達吃 <b>4 kW</b>、接 120 V。照算電流 = 4000 ÷ 120 = <b>33.3 A</b>。', on: 'mot calc calc2' },
      { sub: '實際一量：<b>41.7 A</b>，多了 25%。多出來的電流哪來的？', on: 'meas' },
      { sub: '這一段就是要回答這兩個問題。', op: { out: 0.15, scope: 0.15, mot: 0.15, calc: 0.15, calc2: 0.15, meas: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 複習 PART 1 ════════════ */
  const S1 = {
    t: '先複習上一段', en: 'RECAP OF PART 1',
    svg: g('f', T(150, 150, 'P =', { fs: 28 }) + T(212, 150, '½', { fs: 30 }) + T(282, 150, 'V<sub>m</sub>I<sub>m</sub>', { fs: 28 }) + T(450, 150, 'cos(θ<sub>v</sub> − θ<sub>i</sub>)', { fs: 28 })) +
      g('b1', brace(282, 172, 34) + T(282, 214, '最高點', { cls: 'ta', fs: 14 })) +
      g('b2', brace(212, 172, 18) + T(212, 214, '取平均', { cls: 'ta', fs: 14 }) + brace(450, 172, 92) + T(450, 214, '錯開的打折', { cls: 'ta', fs: 14 })) +
      chip(320, 278, '這一段先處理 ½', '能不能長得跟直流 P = VI 一樣？', 'c', { fs: 13.5, acc: true }),
    steps: [
      { sub: '先複習上一段：交流的平均功率 <b>P = ½V<sub>m</sub>I<sub>m</sub> cos(θ<sub>v</sub> − θ<sub>i</sub>)</b>。', on: 'f' },
      { sub: 'V<sub>m</sub>、I<sub>m</sub> 是電壓、電流的<b>最高點</b>（振幅）。', on: 'b1' },
      { sub: '½ 是因為取平均；cos 是電壓電流錯開造成的打折。', on: 'b2' },
      { sub: '這一段先處理那個 ½：能不能讓公式長得跟直流 P = VI 一樣？', on: 'c' }
    ]
  };

  /* ════════════ 02 交流多大 ════════════ */
  const S2 = {
    t: '交流電到底「多大」？', en: 'HOW BIG IS AC?',
    svg: g('wv', '<path class="ln2" d="M76 200 H584"/>' + path(sw(80, 580, 200, 72, 250, SIN), 'ln', null, 'stroke-width:2.6')) +
      g('avg', path('M80 200 H580', 'lna', null, 'stroke-width:2.4') + T(588, 196, '平均 = 0', { cls: 'ta', fs: 13, a: 'end', dy: '-0.6em' })) +
      g('pk', path('M80 128 H580', 'ln dsh', null, 'stroke-width:1.4') + T(584, 120, '最高點：只有一瞬間', { cls: 'tm', fs: 12.5, a: 'end' })) +
      chip(320, 296, '要找一個「公平」的比法', null, 'c', { fs: 14, acc: true }),
    steps: [
      { sub: '交流電一下正、一下負，它到底「多大」？', on: 'wv' },
      { sub: '取平均？正負抵銷，<b>平均 = 0</b>。不行。', on: 'avg' },
      { sub: '用最高點？只有一瞬間那麼高，大部分時間都比較低。也不公平。', on: 'pk' },
      { sub: '要找一個<b>公平</b>的比法。', on: 'c' }
    ]
  };

  /* ════════════ 03 比發熱 ════════════ */
  const S3 = {
    t: '用「發熱」來比', en: 'COMPARE BY HEAT',
    svg: kettle(180, 200, 'k1') + kettle(460, 200, 'k2') +
      g('dc', '<path class="ln" d="M150 268 H210"/><path class="ln" d="M166 260 V276 M194 254 V282" style="stroke-width:2.6"/>' + T(180, 300, '直流 ? V', { fs: 14 })) +
      g('ac', '<circle class="bgw" cx="460" cy="268" r="16"/>' + path('M450 268 C454 258 458 258 460 268 S466 278 470 268', 'ln') + T(460, 300, '交流（最高 155 V）', { fs: 14 })) +
      steam(178, 158, 's1') + steam(458, 158, 's2') +
      T(320, 206, '一樣熱？', { cls: 'ta', fs: 18, k: 'q' }) +
      chip(320, 120, '有效值 = 發一樣熱的直流電壓', null, 'c', { fs: 14, acc: true }),
    steps: [
      { sub: '用電器最在乎的是<b>做了多少事</b>。拿兩個一模一樣的電熱水壺來比。', on: 'k1 k2' },
      { sub: '左邊接直流、右邊接交流。', on: 'dc ac' },
      { sub: '直流要調到幾伏，才會跟交流<b>燒得一樣熱</b>？', on: 's1 s2 q' },
      { sub: '這個「燒得一樣熱的直流電壓」，就叫交流的<b>有效值</b>。', on: 'c' }
    ]
  };

  /* ════════════ 04 為什麼要平方 ════════════ */
  const SQ = u => Math.pow(Math.sin(TAU * u), 2);
  const S4 = {
    t: '發熱跟「平方」有關', en: 'HEAT GOES WITH v²',
    svg: T(320, 118, '電阻發熱的速率 = v<sup>2</sup> / R', { fs: 19, k: 'f' }) +
      chip(500, 160, '(−100)<sup>2</sup> = (+100)<sup>2</sup>', '電壓是負的，照樣發熱', 'ex', { fs: 13 }) +
      g('v', '<path class="ln2" d="M76 180 H380"/>' + path(sw(80, 380, 180, 34, 150, SIN), 'ln', null, 'stroke-width:2.2') + T(72, 184, 'v', { cls: 't', fs: 13, a: 'end' })) +
      g('sq', '<path class="ln2" d="M76 290 H380"/>' + area(x => 290 - 64 * SQ((x - 80) / 150), 80, 380, 290, 'acc', 0.3) +
        path(sw(80, 380, 290, 64, 150, SQ), 'lna', null, 'stroke-width:2.4') + T(72, 294, 'v²', { cls: 'ta', fs: 13, a: 'end' }) + T(400, 262, '負的全部翻上來', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(500, 220, '比發熱 → 比「平方的平均」', null, 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '電阻發熱的速率是 <b>v² / R</b> —— 跟電壓的<b>平方</b>成正比。', on: 'f' },
      { sub: '電壓是負的也照樣發熱：(−100)² = (+100)²。', on: 'ex v' },
      { sub: '把整條波平方：負的部分全部翻上來，變成正的。', on: 'sq' },
      { sub: '所以要比「發熱」，就要比<b>平方的平均</b>。', on: 'c' }
    ]
  };

  /* ════════════ 05 三步驟 ════════════ */
  const S5 = {
    t: '平方 → 平均 → 開根號', en: 'ROOT · MEAN · SQUARE',
    svg: g('sq', '<path class="ln2" d="M76 286 H400"/>' + area(x => 286 - 150 * SQ((x - 80) / 160), 80, 400, 286, 'acc', 0.25) + path(sw(80, 400, 286, 150, 160, SQ), 'lna', null, 'stroke-width:2.4') +
        T(72, 140, 'V<sub>m</sub><sup>2</sup>', { cls: 'ts', fs: 12, a: 'end' })) +
      g('mean', path('M80 211 H400', 'ln dsh', null, 'stroke-width:2') + T(72, 215, 'V<sub>m</sub><sup>2</sup>/2', { cls: 't', fs: 12, a: 'end' })) +
      T(510, 134, '① 平方 square', { cls: 'ta', fs: 15, k: 's1' }) +
      T(510, 176, '② 平均 mean', { cls: 'ta', fs: 15, k: 's2' }) +
      T(510, 218, '③ 開根號 root', { cls: 'ta', fs: 15, k: 's3' }) +
      T(510, 252, '倒著念：r · m · s', { fs: 15, k: 'rms' }) +
      chip(510, 292, 'V<sub>rms</sub> = √( 平均( v<sup>2</sup> ) )', null, 'fm', { fs: 14, acc: true }),
    steps: [
      { sub: '步驟一<b>平方</b>（square）：v → v²。', on: 'sq s1' },
      { sub: '步驟二<b>平均</b>（mean）：弦波平方的平均，剛好是最高點的一半 <b>V<sub>m</sub>²/2</b>。', on: 'mean s2' },
      { sub: '步驟三<b>開根號</b>（root）：把單位從伏特平方變回伏特。', on: 's3' },
      { sub: '倒著念就是英文名字：<b>R</b>oot <b>M</b>ean <b>S</b>quare，簡稱 <b>rms</b>。', on: 'rms' },
      { sub: '寫成公式：<b>V<sub>rms</sub> = √( 平均( v² ) )</b>。', on: 'fm' }
    ]
  };

  /* ════════════ 06 弦波 ÷ √2 ════════════ */
  const S6 = {
    t: '弦波：除以 √2', en: 'SINE: DIVIDE BY √2',
    svg: T(320, 118, 'V<sub>rms</sub> = √(V<sub>m</sub><sup>2</sup>/2) = V<sub>m</sub> / √2 ≈ 0.707 V<sub>m</sub>', { fs: 18, k: 'f' }) +
      g('wv', '<path class="ln2" d="M76 220 H340"/>' + path(sw(80, 340, 220, 70, 130, SIN), 'ln', null, 'stroke-width:2.4') +
        path('M80 150 H340', 'ln dsh', null, 'stroke-width:1.4') + T(348, 154, '最高 155 V', { cls: 'tm', fs: 13, a: 'start' }) +
        path('M80 ' + (220 - 70 / Math.SQRT2).toFixed(1) + ' H340', 'lna', null, 'stroke-width:2.4') + T(348, 175, '有效值 110 V', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(520, 222, '155 ÷ 1.414 = 110', '插座寫的就是有效值', 'c1', { fs: 13.5, acc: true }) +
      chip(520, 276, '電力題目的「120 V」= rms', '預設不是最高點', 'c2', { fs: 13 }),
    steps: [
      { sub: '弦波平方的平均 = V<sub>m</sub>²/2，開根號：<b>V<sub>rms</sub> = V<sub>m</sub> / √2 ≈ 0.707 V<sub>m</sub></b>。', on: 'f' },
      { sub: '台灣插座：155 ÷ 1.414 = <b>110 V</b>。插座上寫的就是有效值！', on: 'wv c1' },
      { sub: '所以 110 V 的交流，接電熱水壺跟 110 V 的直流<b>一樣熱</b>。' },
      { sub: '以後電力題目說「120 V 電源」，<b>預設就是 rms</b>，不是最高點。', on: 'c2' }
    ]
  };

  /* ════════════ 07 其他波形 ════════════ */
  const SQW = u => ((u % 1) + 1) % 1 < 0.5 ? 1 : -1;
  const TRI = u => 4 * Math.abs((((u + 0.25) % 1) + 1) % 1 - 0.5) - 1;
  const HALF = u => Math.max(0, SIN(u));
  const mini = (x0, y0, f, title, val, key, acc) => g(key, card(x0, y0, 250, 88) + '<path class="ln2" d="M' + (x0 + 14) + ' ' + (y0 + 56) + ' H' + (x0 + 130) + '"/>' +
    path(sw(x0 + 14, x0 + 130, y0 + 56, 24, 58, f), acc ? 'lna' : 'ln', null, 'stroke-width:2') +
    T(x0 + 190, y0 + 34, title, { cls: 't', fs: 14 }) + T(x0 + 190, y0 + 62, val, { cls: acc ? 'ta' : 't', fs: 15 }));
  const S7 = {
    t: '√2 只對弦波成立', en: 'OTHER WAVEFORMS',
    svg: mini(60, 104, SIN, '弦波', 'V<sub>m</sub> / √2', 'w1') + mini(330, 104, SQW, '方波', 'V<sub>m</sub>', 'w2', true) +
      mini(60, 206, TRI, '三角波', 'V<sub>m</sub> / √3', 'w3', true) + mini(330, 206, HALF, '半波整流', 'V<sub>m</sub> / 2', 'w4', true),
    steps: [
      { sub: '注意：除以 √2 <b>只對弦波</b>成立。', on: 'w1' },
      { sub: '方波：一直在 +V<sub>m</sub> 或 −V<sub>m</sub>，平方後全是 V<sub>m</sub>² → rms 就是 <b>V<sub>m</sub></b>。', on: 'w2' },
      { sub: '三角波：大部分時間比較低 → rms = <b>V<sub>m</sub>/√3 ≈ 0.577 V<sub>m</sub></b>。', on: 'w3' },
      { sub: '半波整流（只留正半週）：rms = <b>V<sub>m</sub>/2</b>。不是弦波，就回去做「平方、平均、開根號」。', on: 'w4' }
    ]
  };

  /* ════════════ 08 rms 讓公式變乾淨 ════════════ */
  const S8 = {
    t: '½ 不見了', en: 'THE ½ DISAPPEARS',
    svg: T(320, 120, 'P = ½ V<sub>m</sub>I<sub>m</sub> cos θ', { fs: 20, k: 'l1' }) +
      T(320, 170, 'P = (V<sub>m</sub>/√2)(I<sub>m</sub>/√2) cos θ', { fs: 20, k: 'l2' }) +
      T(320, 222, 'P = V<sub>rms</sub> I<sub>rms</sub> cos θ', { cls: 'ta', fs: 24, k: 'l3' }) +
      chip(320, 284, '跟直流的 P = VI 幾乎一樣', '這就是發明有效值的目的', 'c', { fs: 14, acc: true }),
    steps: [
      { sub: '回到功率公式：P = <b>½</b>V<sub>m</sub>I<sub>m</sub> cos θ。', on: 'l1' },
      { sub: '把 ½ 拆成 (1/√2) × (1/√2)，一份給電壓、一份給電流。', on: 'l2' },
      { sub: 'V<sub>m</sub>/√2 = V<sub>rms</sub>、I<sub>m</sub>/√2 = I<sub>rms</sub> → <b>P = V<sub>rms</sub>I<sub>rms</sub> cos θ</b>。½ 不見了！', on: 'l3' },
      { sub: '長得跟直流的 P = VI 幾乎一樣 —— 這就是發明有效值的目的。', on: 'c' }
    ]
  };

  /* ════════════ 09 先整理一下 ════════════ */
  const kc = (x, y, t1, t2, key, acc) => g(key, card(x, y, 250, 76, acc ? ' style="stroke:var(--s-acc);stroke-width:1.6"' : '') + T(x + 125, y + 32, t1, { cls: acc ? 'ta' : 't', fs: 15 }) + T(x + 125, y + 58, t2, { cls: 'tm', fs: 12.5 }));
  const S9 = {
    t: '先整理一下', en: "LET'S RECAP",
    svg: kc(60, 104, '有效值', '跟它燒得一樣熱的直流值', 'k1') + kc(330, 104, '算法：rms', '平方 → 平均 → 開根號', 'k2') +
      kc(60, 200, '弦波：V<sub>m</sub> / √2', '110 V 插座 = 155 V 最高點', 'k3') + kc(330, 200, 'P = V<sub>rms</sub>I<sub>rms</sub> cos θ', '沒有 ½ 了', 'k4', true),
    steps: [
      { sub: '先整理一下。<b>有效值</b>：跟它燒得一樣熱的那個直流值。', on: 'k1' },
      { sub: '算法叫 <b>rms</b>：平方、平均、開根號。', on: 'k2' },
      { sub: '弦波的有效值 = 最高點 ÷ √2。插座的 110 V 就是它。', on: 'k3' },
      { sub: '用 rms 之後：<b>P = V<sub>rms</sub>I<sub>rms</sub> cos θ</b>。接下來看這條式子還藏了什麼。', on: 'k4' }
    ]
  };

  /* ════════════ 10 馬達謎題 ════════════ */
  const S10 = {
    t: '回到馬達', en: 'BACK TO THE MOTOR',
    svg: motor(140, 180, 'mot', '4000 W、120 V') +
      T(420, 128, '如果 cos θ = 1：4000 ÷ 120 = 33.3 A', { cls: 'tm', fs: 14, k: 'c1' }) +
      T(420, 170, '實際量到：41.7 A', { cls: 'ta', fs: 18, k: 'c2' }) +
      T(420, 214, '120 × 41.7 = 5000', { fs: 20, k: 'c3' }) +
      T(420, 240, '比 4000 還多！', { cls: 'tm', fs: 13, k: 'c3b' }) +
      T(420, 296, '這個 5000 是什麼？', { cls: 'ta', fs: 17, k: 'q' }),
    steps: [
      { sub: '回到馬達：真的用掉的功率 P = <b>4000 W</b>，電壓 V<sub>rms</sub> = <b>120 V</b>。', on: 'mot' },
      { sub: '如果 cos θ = 1（像電阻），電流 = 4000 ÷ 120 = <b>33.3 A</b>。', on: 'c1' },
      { sub: '可是實際量到 <b>41.7 A</b>。', on: 'c2' },
      { sub: '電壓 × 電流 = 120 × 41.7 = <b>5000</b> —— 比 4000 還多！', on: 'c3 c3b' },
      { sub: '這個 5000 是什麼？', on: 'q' }
    ]
  };

  /* ════════════ 11 視在功率 ════════════ */
  const S11 = {
    t: '看起來的功率：視在功率', en: 'APPARENT POWER',
    svg: T(320, 124, 'S = V<sub>rms</sub> × I<sub>rms</sub>', { fs: 24, k: 'f' }) +
      chip(170, 186, '單位：VA（伏安）', '故意不用 W —— 這不是真的瓦特', 'unit', { fs: 13.5 }) +
      chip(470, 186, '電線、發電機要扛的量', '電壓和電流的「規模」', 'c', { fs: 13.5 }) +
      g('nums', T(320, 252, 'S = 120 × 41.7 = 5000 VA', { cls: 't', fs: 17 }) + T(320, 282, 'P = 4000 W（真的用掉的）', { cls: 'ta', fs: 17 })),
    steps: [
      { sub: 'V<sub>rms</sub> × I<sub>rms</sub>「看起來」像功率，所以叫<b>視在功率 S</b>（apparent = 表面上的）。', on: 'f' },
      { sub: '單位故意不用 W，而用 <b>VA</b>（伏安）—— 提醒你「這不是真的瓦特」。', on: 'unit' },
      { sub: '它代表<b>電線、發電機要扛多少</b>：電壓和電流的規模。', on: 'c' },
      { sub: '馬達：S = 120 × 41.7 = <b>5000 VA</b>，但真的用掉的 P 只有 <b>4000 W</b>。', on: 'nums' }
    ]
  };

  /* ════════════ 12 啤酒杯 ════════════ */
  let foam = '';
  [[268, 112], [292, 106], [318, 110], [344, 104], [368, 112], [280, 134], [306, 130], [332, 136], [356, 128], [372, 146], [268, 152], [296, 156], [322, 152], [348, 158]]
    .forEach(([x, y]) => { foam += D.h(x, y, null, 11); });
  const S12 = {
    t: '一杯啤酒', en: 'THE BEER GLASS',
    svg: g('glass', '<path class="ln" style="fill:none;stroke-width:2.4" d="M250 96 L262 290 H378 L390 96"/>' +
        '<path class="ln" d="M410 96 H426 M410 290 H426 M418 96 V290"/>' + T(434, 186, '杯子 = S', { cls: 't', fs: 15, a: 'start', dy: '.35em' }) + T(434, 210, '電線要扛的', { cls: 'ts', fs: 12, a: 'start', dy: '.35em' })) +
      g('beer', '<path class="acc" opacity=".55" d="M256 168 L263 288 H377 L384 168 Z"/>' + T(232, 232, '酒 = P', { cls: 'ta', fs: 15, a: 'end' }) + T(232, 254, '真的用掉的', { cls: 'ts', fs: 12, a: 'end' })) +
      g('foam', foam + T(232, 130, '泡沫', { cls: 't', fs: 15, a: 'end' }) + T(232, 152, '借了又還', { cls: 'ts', fs: 12, a: 'end' })) +
      chip(320, 308, '馬達這杯：杯子 5000 VA、酒 4000 W', null, 'c', { fs: 13.5, acc: true }),
    steps: [
      { sub: '想像一杯啤酒：<b>杯子的大小 = S</b>，是電線要扛的。', on: 'glass' },
      { sub: '酒 = <b>P</b>：真的喝下肚、真的被用掉的。', on: 'beer' },
      { sub: '泡沫：佔位置、但喝不到 —— 就是上一段電感「借了又還」的那部分。', on: 'foam' },
      { sub: '馬達這杯：杯子 5000、酒 4000，有兩成是泡沫。', on: 'c' }
    ]
  };

  /* ════════════ 13 功率因數：拉行李箱 ════════════ */
  const th13 = 36.87 * RAD, L13 = 170, o13 = [120, 270], e13 = [o13[0] + L13 * Math.cos(th13), o13[1] - L13 * Math.sin(th13)];
  const S13 = {
    t: '功率因數：打折率', en: 'POWER FACTOR',
    svg: T(450, 120, 'pf = P / S', { fs: 22, k: 'f' }) +
      g('case', '<rect class="bgw" x="70" y="232" width="56" height="44" rx="6"/><circle class="ink" cx="82" cy="282" r="5"/><circle class="ink" cx="114" cy="282" r="5"/>' +
        arrow(o13[0], o13[1] - 30, e13[0], e13[1] - 30, null, 'ln') + T(e13[0] + 8, e13[1] - 34, '你出的力 = S', { cls: 't', fs: 13, a: 'start' })) +
      g('comp', arrow(o13[0], o13[1] - 30, e13[0], o13[1] - 30, null, 'lna') + T((o13[0] + e13[0]) / 2, o13[1] - 8, '水平那份 = P', { cls: 'ta', fs: 13 }) +
        '<path class="lna" d="M' + (o13[0] + 46) + ' ' + (o13[1] - 30) + ' A46 46 0 0 0 ' + (o13[0] + 46 * Math.cos(th13)).toFixed(1) + ' ' + (o13[1] - 30 - 46 * Math.sin(th13)).toFixed(1) + '"/>' +
        T(o13[0] + 56, o13[1] - 42, 'θ', { cls: 'ta', fs: 14, a: 'start' })) +
      T(450, 170, 'P = S × cos θ', { cls: 'ta', fs: 18, k: 'f2' }) +
      T(450, 206, 'pf = cos(θ<sub>v</sub> − θ<sub>i</sub>)', { fs: 17, k: 'f3' }) +
      chip(450, 264, '馬達：4000 / 5000 = 0.8', 'θ = 36.9°', 'num', { fs: 14, acc: true }),
    steps: [
      { sub: 'P 跟 S 的比值叫<b>功率因數 pf</b>：pf = P / S。', on: 'f' },
      { sub: '像斜斜地拉行李箱：你出的力（S）只有<b>水平那一份</b>真的讓箱子前進（P）。', on: 'case' },
      { sub: '拉得越斜，浪費越多。水平那份 = 力 × <b>cos θ</b>。', on: 'comp f2' },
      { sub: '所以 <b>pf = cos(θ<sub>v</sub> − θ<sub>i</sub>)</b> —— 就是上一段的「打幾折」。', on: 'f3' },
      { sub: '馬達：pf = 4000 / 5000 = <b>0.8</b>，對應 θ = 36.9°。', on: 'num' }
    ]
  };

  /* ════════════ 14 pf 的範圍 ════════════ */
  const prow = (y, nm, pf, note, key) => g(key, T(200, y + 5, nm, { cls: 't', fs: 14, a: 'end' }) + hbar(214, y - 9, 260, 18, 'accw') + hbar(214, y - 9, 260 * pf, 18, 'acc') +
    T(482, y + 5, 'pf = ' + pf.toFixed(1), { cls: 'ta', fs: 13, a: 'start' }) + T(214, y + 26, note, { cls: 'ts', fs: 12, a: 'start' }));
  const S14 = {
    t: 'pf 在 0 到 1 之間', en: 'FROM 0 TO 1',
    svg: prow(116, '電熱水壺、燈泡', 1, '純電阻：杯子裡全是酒', 'r1') + prow(172, '馬達、冷氣', 0.8, '有兩成是泡沫', 'r2') + prow(228, '純電感、純電容', 0, '全是泡沫', 'r3') +
      chip(320, 290, 'pf 算出大於 1 → P 跟 S 弄反了', null, 'c', { fs: 13.5, acc: true }),
    steps: [
      { sub: '電熱水壺、燈泡：純電阻 → pf = <b>1</b>，杯子裡全是酒。', on: 'r1' },
      { sub: '馬達、冷氣：pf ≈ <b>0.8</b>，有兩成是泡沫。', on: 'r2' },
      { sub: '純電感、純電容：pf = <b>0</b>，全是泡沫。', on: 'r3' },
      { sub: 'pf 永遠在 0 到 1 之間。算出大於 1，一定是 P 跟 S 弄反了。', on: 'c' }
    ]
  };

  /* ════════════ 15 落後 vs 超前 ════════════ */
  const runner = (x, y, cls) => '<circle class="' + cls + '" cx="' + x + '" cy="' + (y - 26) + '" r="7"/><path class="' + (cls === 'acc' ? 'lna' : 'ln') + '" d="M' + x + ' ' + (y - 19) + ' L' + (x - 3) + ' ' + (y + 2) + ' L' + (x - 12) + ' ' + (y + 18) + ' M' + (x - 3) + ' ' + (y + 2) + ' L' + (x + 8) + ' ' + (y + 16) + ' M' + (x - 1) + ' ' + (y - 12) + ' L' + (x + 10) + ' ' + (y - 4) + ' M' + (x - 1) + ' ' + (y - 12) + ' L' + (x - 12) + ' ' + (y - 6) + '"/>';
  const S15 = {
    t: '落後還是超前？', en: 'LAGGING OR LEADING?',
    svg: T(320, 118, 'cos(+37°) = cos(−37°) = 0.8', { fs: 18, k: 'two' }) +
      g('lag', '<path class="ln2" d="M70 200 H300"/>' + runner(220, 176, 'ink') + T(220, 154, 'V', { cls: 't', fs: 13 }) + runner(150, 176, 'acc') + T(150, 154, 'I', { cls: 'ta', fs: 13 }) +
        T(185, 224, '電流在後面：落後 lagging', { cls: 't', fs: 13.5 }) + T(185, 244, '電感性（馬達、線圈）', { cls: 'tm', fs: 12.5 })) +
      g('lead', '<path class="ln2" d="M340 200 H570"/>' + runner(420, 176, 'ink') + T(420, 154, 'V', { cls: 't', fs: 13 }) + runner(490, 176, 'acc') + T(490, 154, 'I', { cls: 'ta', fs: 13 }) +
        T(455, 224, '電流在前面：超前 leading', { cls: 'ta', fs: 13.5 }) + T(455, 244, '電容性', { cls: 'tm', fs: 12.5 })) +
      chip(320, 284, '口訣 ELI the ICE man', '電感 L：E 在 I 前；電容 C：I 在 E 前', 'c', { fs: 13 }),
    steps: [
      { sub: 'cos(+37°) 和 cos(−37°) 都是 0.8 —— 光說「pf = 0.8」分不出是哪一種。', on: 'two' },
      { sub: '電流<b>跑在電壓後面</b>：<b>落後 lagging</b> → 電感性（馬達、線圈）。', on: 'lag' },
      { sub: '電流<b>跑在電壓前面</b>：<b>超前 leading</b> → 電容性。', on: 'lead' },
      { sub: '口訣 <b>ELI the ICE man</b>：電感 L 裡電壓 E 在 I 前面；電容 C 裡 I 在 E 前面。', on: 'c' }
    ]
  };

  /* ════════════ 16 阻抗角 = 功因角 ════════════ */
  const o16 = [100, 280], s16 = 6;
  const S16 = {
    t: '只給阻抗也能讀 pf', en: 'IMPEDANCE ANGLE = PF ANGLE',
    svg: T(450, 118, 'Z = V / I', { fs: 20, k: 'f' }) + T(450, 146, '大小相除、角度相減', { cls: 'tm', fs: 13, k: 'f2' }) +
      g('tri', '<path class="ln" d="M' + o16[0] + ' ' + o16[1] + ' H' + (o16[0] + 20 * s16) + ' V' + (o16[1] - 20 * s16) + ' Z"/>' +
        T(o16[0] + 60, o16[1] + 20, 'R = 20', { cls: 't', fs: 13 }) + T(o16[0] + 128, o16[1] - 60, 'X = +20', { cls: 't', fs: 13, a: 'start' }) + T(o16[0] + 40, o16[1] - 80, 'Z = 20 + j20', { cls: 'ta', fs: 13, a: 'end' })) +
      g('ang', '<path class="lna" d="M' + (o16[0] + 40) + ' ' + o16[1] + ' A40 40 0 0 0 ' + (o16[0] + 28.3).toFixed(1) + ' ' + (o16[1] - 28.3).toFixed(1) + '"/>' + T(o16[0] + 48, o16[1] - 12, '45°', { cls: 'ta', fs: 13, a: 'start' }) +
        T(450, 196, 'pf = cos 45° = 0.707', { cls: 'ta', fs: 17 }) + T(450, 222, 'X &gt; 0 → 落後', { cls: 't', fs: 14 })) +
      chip(450, 276, '20 − j20：−45°', '一樣 0.707，但變成超前', 'alt', { fs: 13.5 }),
    steps: [
      { sub: '阻抗 Z = V / I：大小相除、<b>角度相減</b> → Z 的角度剛好就是 θ<sub>v</sub> − θ<sub>i</sub>。', on: 'f f2' },
      { sub: '所以題目只給 Z，就能直接讀出 pf。例：Z = 20 + j20 Ω。', on: 'tri' },
      { sub: '角度 = 45°，pf = cos 45° = <b>0.707</b>。X 是正的 → 電感性 → <b>落後</b>。', on: 'ang' },
      { sub: '換成 20 − j20：角度 −45°，一樣是 0.707，但變成<b>超前</b>。', on: 'alt' }
    ]
  };

  /* ════════════ 17 公式整理 ════════════ */
  const S17 = {
    t: '這一段的公式', en: 'THE FORMULAS',
    svg: kc(60, 104, 'S = V<sub>rms</sub> I<sub>rms</sub>', '視在功率，單位 VA', 'k1') + kc(330, 104, 'pf = P / S = cos θ', '功率因數，0～1', 'k2') +
      kc(60, 200, 'P = S × pf', '實功率，單位 W', 'k3') + kc(330, 200, '一定標落後／超前', 'X &gt; 0 落後、X &lt; 0 超前', 'k4', true),
    steps: [
      { sub: '整理這一段的公式。<b>S = V<sub>rms</sub>I<sub>rms</sub></b>：電線扛的，單位 VA。', on: 'k1' },
      { sub: '<b>pf = P / S = cos θ</b>：打幾折，0 到 1。', on: 'k2' },
      { sub: '<b>P = S × pf</b>：真的用掉的，單位 W。', on: 'k3' },
      { sub: 'pf 一定要標<b>落後</b>或<b>超前</b>。', on: 'k4' }
    ]
  };

  /* ════════════ 18 恍然大悟 ════════════ */
  const S18 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: g('L', card(60, 100, 250, 140) + T(185, 128, '為什麼是 110 V', { fs: 16 }) + T(185, 160, '110 是有效值', { cls: 'tm', fs: 13 }) +
        T(185, 186, '110 × √2 = 155', { cls: 'tm', fs: 13 }) + T(185, 220, '= 示波器的最高點', { cls: 't', fs: 14 })) +
      g('R1', card(330, 100, 250, 140) + T(455, 128, '為什麼是 41.7 A', { cls: 'ta', fs: 16 }) + T(455, 160, 'S = 4000 ÷ 0.8 = 5000 VA', { cls: 'tm', fs: 13 })) +
      g('R2', T(455, 186, '電線扛的是 S', { cls: 'tm', fs: 13 }) + T(455, 220, '5000 ÷ 120 = 41.7 A', { cls: 'ta', fs: 14 })) +
      chip(320, 272, '謎題解開了 ✓', '多出來的電流在搬那兩成「泡沫」', 'ans', { fs: 13.5, acc: true }),
    steps: [
      { sub: '回到第一題：插座的 110 V 是<b>有效值</b>，最高點 = 110 × √2 = <b>155 V</b>。', on: 'L' },
      { sub: '第二題：馬達 P = 4000 W、pf = 0.8 → S = 4000 ÷ 0.8 = <b>5000 VA</b>。', on: 'R1' },
      { sub: '電線扛的是 S：5000 ÷ 120 = <b>41.7 A</b>。', on: 'R2' },
      { sub: '33.3 A 只有在 pf = 1 時才對。多出來的電流，是在搬那兩成「泡沫」。' },
      { sub: '<b>謎題解開了。</b>', on: 'ans' }
    ]
  };

  /* ════════════ 19 預告 ════════════ */
  const S19 = {
    t: '下一段', en: 'WHAT’S NEXT',
    svg: T(320, 120, '泡沫也有名字：虛功率 Q（VAR）', { fs: 17, k: 'q' }) +
      g('tri', '<path class="ln" d="M150 252 H310"/><path class="lna" d="M310 252 V172"/><path class="ln" d="M150 252 L310 172"/>' +
        T(230, 272, 'P', { cls: 't', fs: 14 }) + T(320, 216, 'Q', { cls: 'ta', fs: 14, a: 'start' }) + T(214, 202, 'S', { cls: 't', fs: 14, a: 'end' })) +
      T(470, 180, '能不能把泡沫消掉？', { fs: 16, k: 'kill' }) + T(470, 206, '讓 41.7 A 變小', { cls: 'tm', fs: 13, k: 'kill2' }) +
      chip(470, 250, '下一段：複功率、功因校正', 'S = P + jQ', 'nx', { fs: 13.5, acc: true }),
    steps: [
      { sub: 'P 有了、S 有了。那「泡沫」呢？它也有名字：<b>虛功率 Q</b>。', on: 'q' },
      { sub: 'P、Q、S 剛好可以畫成一個<b>直角三角形</b>。', on: 'tri' },
      { sub: '更重要的是：能不能<b>把泡沫消掉</b>，讓 41.7 A 變小？', on: 'kill kill2' },
      { sub: '下一段：複功率、功率守恆、功因校正。', on: 'nx' }
    ]
  };

  window.__ch11p2Story = window.__Story('#story', {
    id: 'circuits-ch11-part2', title: 'CH11 PART 2 有效值與功率因數', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19]
  });
})();
