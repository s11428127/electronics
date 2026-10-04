/* ============================================================
   電路學 CH11 PART 3 —— 故事模式（11.6 複功率、11.7 守恆、11.8 功因校正、11.9 應用）
   謎題（課本 Example 11.15）：4 kW 馬達接 120 V，電線扛 41.7 A；並一顆「不耗電」的電容，
         電流降到 35.1 A，馬達照樣 4 kW。為什麼？
   答案：電容的 −Q 就近抵掉馬達的 +Q；電線只扛 |S₂| = 4210.5 VA → 35.1 A。C = 310.5 μF。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const RAD = Math.PI / 180;
  const path = (d, cls, key, extra) => '<path class="' + cls + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  const card = (x, y, w, h, extra) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"' + (extra || '') + '/>';
  const hbar = (x, y, w, hgt, cls) => '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + Math.max(0, w).toFixed(1) + '" height="' + hgt + '" rx="3"/>';
  const kc = (x, y, t1, t2, key, acc) => g(key, card(x, y, 250, 76, acc ? ' style="stroke:var(--s-acc);stroke-width:1.6"' : '') + T(x + 125, y + 32, t1, { cls: acc ? 'ta' : 't', fs: 15 }) + T(x + 125, y + 58, t2, { cls: 'tm', fs: 12.5 }));
  const motor = (x, y, key, lbl) => g(key, '<rect class="bgw" x="' + (x - 36) + '" y="' + (y - 30) + '" width="72" height="60" rx="10"/>' + T(x, y, 'M', { fs: 22, dy: '.35em' }) + (lbl ? T(x, y + 48, lbl, { cls: 'tm', fs: 12 }) : ''));
  const src = (x, y, key) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="24"/>' + path('M' + (x - 14) + ' ' + y + ' C' + (x - 8) + ' ' + (y - 13) + ' ' + (x - 3) + ' ' + (y - 13) + ' ' + x + ' ' + y + ' S' + (x + 8) + ' ' + (y + 13) + ' ' + (x + 14) + ' ' + y, 'ln'));
  const capV = (x, y1, y2, key, lbl) => g(key, '<path class="ln" d="M' + x + ' ' + y1 + ' V' + ((y1 + y2) / 2 - 7) + ' M' + x + ' ' + ((y1 + y2) / 2 + 7) + ' V' + y2 + '"/>' +
    '<path class="lna" d="M' + (x - 18) + ' ' + ((y1 + y2) / 2 - 7) + ' H' + (x + 18) + ' M' + (x - 18) + ' ' + ((y1 + y2) / 2 + 7) + ' H' + (x + 18) + '" style="stroke-width:3"/>' +
    (lbl ? T(x + 24, (y1 + y2) / 2 + 4, lbl, { cls: 'ta', fs: 13, a: 'start' }) : ''));
  /* 功率三角形：原點 o、比例 s（px/W） */
  const tri = (o, s, P, Q, keys, cls) => {
    const p = [o[0] + P * s, o[1]], q = [p[0], o[1] - Q * s];
    return g(keys[0], arrow(o[0], o[1], p[0], p[1], null, 'ln')) + g(keys[1], arrow(p[0], p[1], q[0], q[1], null, 'lna')) + g(keys[2], arrow(o[0], o[1], q[0], q[1], null, cls || 'ln'));
  };

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '一顆不耗電的電容', en: 'THE QUESTION',
    svg: src(110, 206, 'src') + T(78, 210, '120 V', { cls: 'tm', fs: 12, a: 'end', k: 'srcL' }) +
      g('wire', '<path class="ln" d="M110 182 V146 H500 V176 M500 236 V270 H110 V230"/>') +
      motor(500, 206, 'mot') + T(544, 210, '馬達 4 kW', { cls: 'tm', fs: 12, a: 'start', k: 'motL' }) +
      g('am', '<circle class="bgw" cx="170" cy="146" r="17"/>' + T(170, 146, 'A', { fs: 14, dy: '.35em' })) +
      T(170, 120, '41.7 A', { cls: 'ta', fs: 20, k: 'meas' }) +
      capV(380, 146, 270, 'cap', 'C') +
      T(300, 296, '電容不消耗功率', { cls: 'tm', fs: 13, k: 'capL' }) +
      T(320, 240, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '上一段的馬達：吃 <b>4 kW</b>、接 120 V，電線要扛 <b>41.7 A</b>。', on: 'src srcL wire mot motL am meas' },
      { sub: '現在在馬達旁邊，<b>並一顆電容</b>。', on: 'cap' },
      { sub: '電容本身<b>不消耗</b>平均功率（PART 1 學過）。', on: 'capL' },
      { sub: '結果：電流從 41.7 A 降到 <b>35.1 A</b>，馬達照樣 4 kW。', txt: { meas: '35.1 A' } },
      { sub: '加一個不耗電的東西，電流反而變小？這一段就是要搞懂它。', op: { src: 0.15, srcL: 0.15, wire: 0.15, mot: 0.15, motL: 0.15, am: 0.15, meas: 0.15, cap: 0.15, capL: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 複習 ════════════ */
  let foam = '';
  [[120, 120], [142, 114], [164, 120], [186, 114], [204, 122], [132, 140], [156, 136], [178, 142], [198, 140]].forEach(([x, y]) => { foam += D.h(x, y, null, 9); });
  const S1 = {
    t: '先複習上一段', en: 'RECAP OF PART 2',
    svg: g('glass', '<path class="ln" style="fill:none;stroke-width:2.4" d="M104 104 L114 290 H206 L216 104"/>') +
      g('beer', '<path class="acc" opacity=".55" d="M109 150 L115 288 H205 L211 150 Z"/>') + g('foam', foam) +
      T(430, 132, '杯子 S = 5000 VA', { fs: 17, k: 'l1' }) +
      T(430, 170, '酒 P = 4000 W　pf = 0.8', { cls: 'ta', fs: 17, k: 'l2' }) +
      T(430, 214, '5000 ÷ 120 = 41.7 A', { fs: 17, k: 'l3' }) +
      chip(430, 270, '這一段的主角：泡沫', '它到底是什麼？能不能消掉？', 'c', { fs: 14, acc: true }),
    steps: [
      { sub: '先複習上一段：馬達這杯啤酒，杯子 S = <b>5000 VA</b>。', on: 'glass l1' },
      { sub: '酒 P = <b>4000 W</b>，pf = 4000/5000 = 0.8。', on: 'beer l2' },
      { sub: '電線扛的是整個杯子：5000 ÷ 120 = <b>41.7 A</b>。', on: 'l3' },
      { sub: '這一段的主角，是上面那層<b>泡沫</b>。', on: 'foam c' }
    ]
  };

  /* ════════════ 02 虛功率 Q ════════════ */
  const S2 = {
    t: '泡沫的名字：虛功率 Q', en: 'REACTIVE POWER',
    svg: src(130, 196, 'src') + g('coil', '<path class="ln" d="M470 160 c12 0 12 18 0 18 c12 0 12 18 0 18 c12 0 12 18 0 18 c12 0 12 18 0 18"/>' + T(498, 200, '電感', { cls: 'tm', fs: 13, a: 'start' })) +
      g('w', '<path class="ln2" d="M154 196 H458"/>') +
      g('mv', arrow(200, 176, 410, 176, null, 'lna') + arrow(410, 218, 200, 218, null, 'ln') + T(305, 166, '前半拍：送過去（存起來）', { cls: 'ta', fs: 12.5 }) + T(305, 240, '後半拍：送回來', { cls: 't', fs: 12.5 })) +
      chip(320, 112, '虛功率 Q（單位 VAR）', '來回搬的規模', 'cq', { fs: 14, acc: true }) +
      chip(200, 290, '像水塔', '抽上去、放下來，水沒少，水管卻一直很忙', 'tow', { fs: 13 }) +
      chip(470, 290, '電感 Q &gt; 0　電容 Q &lt; 0', '方向剛好相反', 'sg', { fs: 13 }),
    steps: [
      { sub: '那層泡沫有名字：<b>虛功率 Q</b>，單位 <b>VAR</b>。', on: 'cq src coil w' },
      { sub: '它是能量在電源和電感之間<b>來回搬</b>的規模：前半拍送過去存著，後半拍送回來。', on: 'mv' },
      { sub: '像水塔：把水抽上去、再放下來，水沒少，但水管一直很忙。', on: 'tow' },
      { sub: '電感的 Q 是<b>正的</b>，電容的 Q 是<b>負的</b> —— 搬的方向剛好相反。', on: 'sg' }
    ]
  };

  /* ════════════ 03 功率三角形 ════════════ */
  const o3 = [140, 286], s3 = 0.06;
  const S3 = {
    t: '功率三角形', en: 'POWER TRIANGLE',
    svg: tri(o3, s3, 4000, 3000, ['Pv', 'Qv', 'Sv']) +
      T(o3[0] + 120, o3[1] + 20, 'P = 4000 W', { cls: 't', fs: 14, k: 'Pl' }) +
      T(o3[0] + 250, o3[1] - 90, 'Q = 3000 VAR', { cls: 'ta', fs: 14, a: 'start', k: 'Ql' }) +
      T(o3[0] + 100, o3[1] - 104, '|S| = 5000 VA', { cls: 't', fs: 14, a: 'end', k: 'Sl' }) +
      g('ang', '<path class="lna" d="M' + (o3[0] + 50) + ' ' + o3[1] + ' A50 50 0 0 0 ' + (o3[0] + 40).toFixed(1) + ' ' + (o3[1] - 30).toFixed(1) + '"/>' + T(o3[0] + 58, o3[1] - 12, 'θ = 36.9°', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(530, 130, '3 : 4 : 5', '直角三角形', 'r345', { fs: 15 }) +
      chip(530, 256, 'cos θ = 0.8 = pf', null, 'cpf', { fs: 14, acc: true }),
    steps: [
      { sub: '把 P 畫成<b>橫的</b>：4000 W。', on: 'Pv Pl' },
      { sub: '把 Q 畫成<b>直的</b>：3000 VAR。', on: 'Qv Ql' },
      { sub: '斜邊就是 |S| = 5000 VA —— 剛好是 3、4、5 直角三角形！', on: 'Sv Sl r345' },
      { sub: '夾角 θ = 36.9°，cos θ = 0.8 = pf。一張圖，四個量。這叫<b>功率三角形</b>。', on: 'ang cpf' }
    ]
  };

  /* ════════════ 04 一個複數全包 ════════════ */
  const S4 = {
    t: '一個複數全包', en: 'ONE NUMBER: S = P + jQ',
    svg: T(320, 124, 'S = P + jQ', { fs: 26, k: 'f' }) +
      g('map', '<path class="ln2" d="M90 286 H290 M90 286 V160"/>' + arrow(90, 286, 250, 286, null, 'ln') + arrow(250, 286, 250, 166, null, 'lna') +
        T(170, 306, '往東 4000', { cls: 't', fs: 13 }) + T(258, 230, '往北 3000', { cls: 'ta', fs: 13, a: 'start' }) + T(92, 150, '北（虛部）', { cls: 'ts', fs: 11.5, a: 'start' })) +
      T(460, 178, 'S = 4000 + j3000 VA', { cls: 'ta', fs: 18, k: 'num' }) +
      g('four', T(460, 214, '實部 = P　虛部 = Q', { cls: 'tm', fs: 13.5 }) + T(460, 240, '長度 = |S|　角度的 cos = pf', { cls: 'tm', fs: 13.5 })) +
      chip(460, 288, '叫做「複功率」', null, 'cn', { fs: 14, acc: true }),
    steps: [
      { sub: '三角形還可以寫成一個<b>複數</b>：S = P + jQ。', on: 'f' },
      { sub: '像報地址：「往東 4000 步、往北 3000 步」。東是實部、北是虛部。', on: 'map' },
      { sub: '馬達：S = 4000 + j3000 VA，這叫<b>複功率</b>。', on: 'num cn' },
      { sub: '實部 P、虛部 Q、長度 |S|、角度的 cos 是 pf —— 一個數，四個量全有。', on: 'four' }
    ]
  };

  /* ════════════ 05 S = V·I* ════════════ */
  const O5 = [160, 226], ph = (len, deg) => [O5[0] + len * Math.cos(deg * RAD), O5[1] - len * Math.sin(deg * RAD)];
  const V5 = ph(120, 30), I5 = ph(80, -10), Ic5 = ph(80, 10);
  const S5 = {
    t: '從電壓電流算 S', en: 'S = V · I*',
    svg: g('ax', '<path class="ln2" d="M60 226 H300 M160 316 V110"/>') +
      g('Vv', arrow(O5[0], O5[1], V5[0], V5[1], null, 'ln') + T(V5[0] + 6, V5[1] - 6, 'V = 100∠30°', { cls: 't', fs: 13, a: 'start' })) +
      g('Iv', arrow(O5[0], O5[1], I5[0], I5[1], null, 'lna') + T(I5[0] + 6, I5[1] + 16, 'I = 5∠−10°', { cls: 'ta', fs: 13, a: 'start' })) +
      g('Icv', arrow(O5[0], O5[1], Ic5[0], Ic5[1], null, 'lna') + T(Ic5[0] + 6, Ic5[1] - 2, 'I* = 5∠+10°', { cls: 'ta', fs: 13, a: 'start' })) +
      T(480, 136, 'V × I：30° + (−10°) = 20° ✗', { cls: 'tm', fs: 14, k: 'wr' }) +
      T(480, 178, 'V × I*：30° − (−10°) = 40° ✓', { cls: 'ta', fs: 14, k: 'ok' }) +
      chip(480, 240, 'S = V<sub>rms</sub> · I*<sub>rms</sub>', '電流要取共軛（角度變號）', 'f', { fs: 16, acc: true }),
    steps: [
      { sub: '手上有電壓、電流的相量時，S 怎麼算？例：V = 100∠30°、I = 5∠−10°。', on: 'ax Vv Iv' },
      { sub: '直接 V × I 不行：相乘時<b>角度相加</b>，得到 20°，不是我們要的 θ<sub>v</sub> − θ<sub>i</sub>。', on: 'wr' },
      { sub: '把電流的角度<b>變號</b>（共軛 I*），相乘時就變成相減：30° − (−10°) = <b>40°</b>。', op: { Iv: 0.3 }, on: 'Icv ok' },
      { sub: '所以 <b>S = V<sub>rms</sub> · I*<sub>rms</sub></b>。那顆星號就是為了把角度變成相減。', on: 'f' }
    ]
  };

  /* ════════════ 06 算一次 ════════════ */
  const S6 = {
    t: '實際算一次', en: 'WORKED EXAMPLE',
    svg: T(320, 120, '100∠30° × 5∠+10°', { fs: 19, k: 'l1' }) +
      T(320, 160, '大小相乘、角度相加 = 500∠40° VA', { cls: 'ta', fs: 18, k: 'l2' }) +
      T(320, 204, 'P = 500 cos 40° = 383 W', { fs: 17, k: 'l3' }) +
      T(320, 236, 'Q = 500 sin 40° = 321 VAR', { fs: 17, k: 'l4' }) +
      chip(320, 288, 'Q &gt; 0 → 電感性、落後', 'pf = cos 40° = 0.766', 'c', { fs: 14, acc: true }),
    steps: [
      { sub: '例：V = 100∠30°、I* = 5∠+10°，相乘。', on: 'l1' },
      { sub: '大小相乘 100 × 5 = 500、角度相加 30° + 10° = 40° → <b>S = 500∠40° VA</b>。', on: 'l2' },
      { sub: '化成直角座標：<b>P = 383 W、Q = 321 VAR</b>。', on: 'l3 l4' },
      { sub: 'Q 是正的 → 電感性、落後；pf = cos 40° = 0.766。一個 S，全部讀得出來。', on: 'c' }
    ]
  };

  /* ════════════ 07 S = I²Z ════════════ */
  const S7 = {
    t: '另一條：S = I²Z', en: 'S = I²Z',
    svg: T(320, 124, 'S = |I|<sup>2</sup> Z = |I|<sup>2</sup>(R + jX)', { fs: 20, k: 'f' }) +
      g('split', T(200, 182, 'P = |I|<sup>2</sup> R', { cls: 't', fs: 20 }) + T(200, 210, '電阻決定 P', { cls: 'tm', fs: 13 }) +
        T(440, 182, 'Q = |I|<sup>2</sup> X', { cls: 'ta', fs: 20 }) + T(440, 210, '電抗決定 Q', { cls: 'tm', fs: 13 })) +
      chip(200, 274, '純電感 R = 0 → P = 0', 'PART 1 的結論又出現了', 'c1', { fs: 13 }) +
      chip(440, 274, '並聯負載用 S = V<sup>2</sup>/Z*', '電壓相同時最快', 'c2', { fs: 13 }),
    steps: [
      { sub: '已知電流和阻抗時，還有一條：<b>S = |I|² Z</b>。', on: 'f' },
      { sub: '展開：P = |I|²R、Q = |I|²X —— <b>電阻決定 P、電抗決定 Q</b>。', on: 'split' },
      { sub: '純電感 R = 0，所以 P = 0。PART 1 的結論又出現了。', on: 'c1' },
      { sub: '並聯負載（電壓一樣）用 S = V²/Z* 最快。分母也要共軛。', on: 'c2' }
    ]
  };

  /* ════════════ 08 先整理一下 ════════════ */
  const S8 = {
    t: '先整理一下', en: "LET'S RECAP",
    svg: kc(60, 104, 'Q：虛功率（VAR）', '來回搬的泡沫；電感 +、電容 −', 'k1') + kc(330, 104, '功率三角形', 'P 橫、Q 直、|S| 斜邊', 'k2') +
      kc(60, 200, 'S = P + jQ', '一個複數四個量', 'k3') + kc(330, 200, 'S = V · I*', '電流取共軛', 'k4', true),
    steps: [
      { sub: '先整理一下。泡沫叫<b>虛功率 Q</b>，電感是正的、電容是負的。', on: 'k1' },
      { sub: 'P、Q、|S| 畫成<b>功率三角形</b>。', on: 'k2' },
      { sub: '寫成一個複數：<b>S = P + jQ</b>。', on: 'k3' },
      { sub: '從電壓電流算：<b>S = V · I*</b>。接下來看：好幾個負載怎麼加？', on: 'k4' }
    ]
  };

  /* ════════════ 09 守恆：記帳 ════════════ */
  const S9 = {
    t: '功率守恆：像記帳', en: 'CONSERVATION OF AC POWER',
    svg: src(100, 196, 'src') + g('wires', '<path class="ln" d="M100 172 V126 H440 V150 M100 220 V268 H440 V246 M300 126 V150 M300 246 V268"/>') +
      g('L1', '<rect class="bgw" x="268" y="150" width="64" height="96" rx="8"/>' + T(300, 192, '負載 1', { cls: 't', fs: 12.5 }) + T(300, 214, '電感性', { cls: 'ts', fs: 11 })) +
      g('L2', '<rect class="accw" x="408" y="150" width="64" height="96" rx="8" style="stroke:var(--s-acc);stroke-width:1.6"/>' + T(440, 192, '負載 2', { cls: 'ta', fs: 12.5 }) + T(440, 214, '電容性', { cls: 'ts', fs: 11 })) +
      T(530, 132, 'S = S<sub>1</sub> + S<sub>2</sub>', { fs: 18, k: 'f' }) +
      g('nums', T(300, 296, '1000 + j1500', { cls: 't', fs: 13 }) + T(440, 296, '2000 − j500', { cls: 'ta', fs: 13 })) +
      g('sum', T(560, 190, 'P = 3000 W', { cls: 't', fs: 14 }) + T(560, 214, 'Q = 1000 VAR', { cls: 'ta', fs: 14 })),
    steps: [
      { sub: '一個電源接好幾個負載，就像記帳：<b>總支出 = 每一項加起來</b>。', on: 'src wires L1 L2' },
      { sub: '複功率也一樣：<b>S = S<sub>1</sub> + S<sub>2</sub></b>，串聯並聯都成立。', on: 'f' },
      { sub: '例：負載 1 = 1000 + j1500 VA；負載 2 是電容性 = 2000 − j500 VA。', on: 'nums' },
      { sub: 'P 加 P = <b>3000 W</b>；Q 加 Q = 1500 − 500 = <b>1000 VAR</b>（電容的負 Q 抵掉一部分）。', on: 'sum' }
    ]
  };

  /* ════════════ 10 陷阱：|S| 不能加 ════════════ */
  const O10 = [90, 270], sc10 = 0.075;
  const A10 = [O10[0] + 1000 * sc10, O10[1] - 1500 * sc10], B10 = [A10[0] + 2000 * sc10, A10[1] + 500 * sc10];
  const S10 = {
    t: '陷阱：大小不能直接加', en: '|S| IS NOT ADDITIVE',
    svg: g('s1', arrow(O10[0], O10[1], A10[0], A10[1], null, 'ln') + T(O10[0] + 30, A10[1] + 20, 'S₁', { cls: 't', fs: 14, a: 'end' })) +
      g('s2', arrow(A10[0], A10[1], B10[0], B10[1], null, 'ln') + T((A10[0] + B10[0]) / 2 + 6, (A10[1] + B10[1]) / 2 - 12, 'S₂', { cls: 't', fs: 14 })) +
      g('ss', arrow(O10[0], O10[1], B10[0], B10[1], null, 'lna') + T(B10[0] + 8, B10[1] + 4, 'S', { cls: 'ta', fs: 14, a: 'start', dy: '.35em' })) +
      T(480, 124, '|S| = √(3000² + 1000²) = 3162', { cls: 'ta', fs: 14, k: 'ok' }) +
      T(480, 160, '|S₁| + |S₂| = 1803 + 2062 = 3865 ✗', { cls: 'tm', fs: 14, k: 'wr' }) +
      chip(480, 214, '像走路', '先往東北、再往東南，離起點比兩段加起來近', 'walk', { fs: 13 }) +
      chip(480, 276, '先 P 加 P、Q 加 Q', '最後才取大小', 'rule', { fs: 14, acc: true }),
    steps: [
      { sub: '可是「大小」不能直接加。畫成向量：S<sub>1</sub> 往右上、S<sub>2</sub> 往右下。', on: 's1 s2' },
      { sub: '頭接尾，合起來 S = 3000 + j1000，長度 <b>3162 VA</b>。', on: 'ss ok' },
      { sub: '各自的長度：1803 + 2062 = 3865 —— <b>不是 3162</b>！', on: 'wr' },
      { sub: '像走路：先往東北走、再往東南走，離起點的距離比兩段加起來短。', on: 'walk' },
      { sub: '口訣：<b>先 P 加 P、Q 加 Q，最後才取大小</b>。這是整章最常被扣分的地方。', on: 'rule' }
    ]
  };

  /* ════════════ 11 新點子：用電容抵銷 ════════════ */
  const S11 = {
    t: '新點子：用電容抵掉 Q', en: 'THE IDEA',
    svg: T(320, 118, '電感 +Q　＋　電容 −Q　→　抵銷', { fs: 17, k: 'rec' }) +
      src(110, 196, 'src') + g('wire', '<path class="ln" d="M110 172 V146 H480 V166 M480 226 V246 H110 V220"/>') + motor(480, 196, 'mot') +
      capV(360, 146, 246, 'cap', 'C') +
      chip(210, 282, '像在家旁邊蓋小水塔', '來回搬的水就近供應，不必從遠方水庫送', 'tow', { fs: 13 }) +
      chip(470, 282, '這叫「功因校正」', '電線只送真的被用掉的', 'pfc', { fs: 13.5, acc: true }),
    steps: [
      { sub: '剛剛看到：電容的負 Q 會<b>抵掉</b>電感的正 Q。', on: 'rec' },
      { sub: '那就在馬達旁邊<b>並一顆電容</b>，專門抵銷馬達的 Q！', on: 'src wire mot cap' },
      { sub: '像在家旁邊蓋一個小水塔：來回搬的水改由水塔就近供應，不必再從遠方的水庫一路送。', on: 'tow' },
      { sub: '電線只要送真正被用掉的那部分，電流就變小了。這叫<b>功率因數校正</b>。', on: 'pfc' }
    ]
  };

  /* ════════════ 12 三角形變矮 ════════════ */
  const O12 = [110, 286], s12 = 0.06;
  const p12 = [O12[0] + 4000 * s12, O12[1]], q1 = [p12[0], O12[1] - 3000 * s12], q2 = [p12[0], O12[1] - 1314 * s12];
  const S12 = {
    t: '三角形變矮了', en: 'THE TRIANGLE SHRINKS',
    svg: g('t1', arrow(O12[0], O12[1], p12[0], p12[1], null, 'ln') + arrow(p12[0], p12[1], q1[0], q1[1], null, 'ln') + arrow(O12[0], O12[1], q1[0], q1[1], null, 'ln') +
        T((O12[0] + p12[0]) / 2, O12[1] + 18, 'P = 4000 W', { cls: 't', fs: 13 }) + T(q1[0] + 8, q1[1] + 4, 'Q₁ = 3000', { cls: 't', fs: 13, a: 'start' }) + T(214, 186, 'S₁ = 5000', { cls: 't', fs: 13, a: 'end' })) +
      g('qc', arrow(q1[0] + 22, q1[1], q2[0] + 22, q2[1], null, 'lna') + T(q1[0] + 32, (q1[1] + q2[1]) / 2 + 4, '電容 −Q<sub>C</sub>', { cls: 'ta', fs: 13, a: 'start' })) +
      g('t2', arrow(O12[0], O12[1], q2[0], q2[1], null, 'lna') + T(q2[0] + 8, q2[1] + 16, 'Q₂ = 1314', { cls: 'ta', fs: 13, a: 'start' }) + T(300, 264, 'S₂ = 4210', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(500, 130, 'pf：0.8 → 0.95', 'P 一點都沒變', 'cp', { fs: 14, acc: true }),
    steps: [
      { sub: '馬達原本的三角形：P = 4000、Q = 3000、|S| = 5000，pf = 0.8。', on: 't1' },
      { sub: '並上電容：電容的 Q 是<b>負的</b>，直接從 Q 扣掉 —— 三角形的高往下壓。', on: 'qc' },
      { sub: '目標 pf = 0.95：Q 剩 1314 VAR，斜邊 |S| 縮成 <b>4210 VA</b>。', op: { t1: 0.35 }, on: 't2' },
      { sub: '注意底邊 <b>P = 4000 W 一點都沒變</b> —— 馬達照樣做一樣多的事。', on: 'cp' }
    ]
  };

  /* ════════════ 13 電容要多大 ════════════ */
  const S13 = {
    t: '電容要多大？', en: 'HOW BIG IS C?',
    svg: T(320, 118, 'Q<sub>C</sub> = Q<sub>1</sub> − Q<sub>2</sub> = 3000 − 1314 = 1686 VAR', { fs: 17, k: 'l1' }) +
      T(320, 152, 'Q = P tan θ：Q₁ = 4000 × 0.75、Q₂ = 4000 × 0.329', { cls: 'tm', fs: 13.5, k: 'l2' }) +
      T(320, 192, '一顆電容提供：Q<sub>C</sub> = ωCV<sup>2</sup>', { fs: 17, k: 'l3' }) +
      T(320, 236, 'C = Q<sub>C</sub> / (ωV<sup>2</sup>) = 1686 ÷ (377 × 120²) = 310.5 μF', { cls: 'ta', fs: 16, k: 'l4' }) +
      chip(320, 288, 'ω = 2π × 60 = 377；V 用 rms', '課本 Example 11.15', 'c', { fs: 13.5 }),
    steps: [
      { sub: '電容要吃掉的 Q：<b>Q<sub>C</sub> = Q<sub>1</sub> − Q<sub>2</sub> = 3000 − 1314 = 1686 VAR</b>。', on: 'l1' },
      { sub: 'Q<sub>1</sub>、Q<sub>2</sub> 用 tan 算：<b>Q = P tan θ</b>，只要 P，不用先算 S。', on: 'l2' },
      { sub: '一顆電容能提供多少 Q？<b>Q<sub>C</sub> = ωCV²</b>（電容越大、電壓越高，搬得越多）。', on: 'l3' },
      { sub: '反過來解：C = Q<sub>C</sub> / (ωV²) = <b>310.5 μF</b>。', on: 'l4' },
      { sub: 'ω = 2π × 60 = 377，V 一定要用 rms。', on: 'c' }
    ]
  };

  /* ════════════ 14 電流變小 ════════════ */
  const S14 = {
    t: '電流變小、線損變小', en: 'LESS CURRENT, LESS LOSS',
    svg: g('b1', T(170, 140, '校正前', { cls: 't', fs: 14, a: 'end' }) + hbar(184, 126, 300, 22, 'ink3') + T(492, 142, '41.7 A', { cls: 't', fs: 14, a: 'start' })) +
      g('b2', T(170, 186, '校正後', { cls: 'ta', fs: 14, a: 'end' }) + hbar(184, 172, 300 * 35.1 / 41.7, 22, 'acc') + T(184 + 300 * 35.1 / 41.7 + 8, 188, '35.1 A', { cls: 'ta', fs: 14, a: 'start' })) +
      T(320, 236, '電流少 16%　→　線損 I<sup>2</sup>R 少 29%', { fs: 17, k: 'loss' }) +
      chip(320, 288, '同樣 4 kW，電線少熱三成', '這就是電力公司要求高功因的原因', 'c', { fs: 13.5, acc: true }),
    steps: [
      { sub: '校正前：|S| = 5000 VA → 電流 <b>41.7 A</b>。', on: 'b1' },
      { sub: '校正後：|S| = 4210 VA → 電流 <b>35.1 A</b>。', on: 'b2' },
      { sub: '電流少 16%，但線損是 I²R，<b>平方</b>之後少了 <b>29%</b>。', on: 'loss' },
      { sub: '馬達一樣做 4 kW 的事，電線卻少熱將近三成。', on: 'c' }
    ]
  };

  /* ════════════ 15 先整理一下 ════════════ */
  const S15 = {
    t: '先整理一下', en: "LET'S RECAP",
    svg: kc(60, 104, 'P 不變', '電容平均不吃功率', 'k1') + kc(330, 104, 'Q<sub>C</sub> = Q<sub>1</sub> − Q<sub>2</sub>', 'Q = P tan θ', 'k2') +
      kc(60, 200, 'C = Q<sub>C</sub> / (ωV<sup>2</sup>)', 'ω = 2πf，V 用 rms', 'k3') + kc(330, 200, '電流↓、線損↓', 'pf 越接近 1 越好', 'k4', true),
    steps: [
      { sub: '整理功因校正：<b>P 不變</b>，因為電容平均不吃功率。', on: 'k1' },
      { sub: '電容要吃掉 <b>Q<sub>C</sub> = Q<sub>1</sub> − Q<sub>2</sub></b>，用 Q = P tan θ 算。', on: 'k2' },
      { sub: '電容值 <b>C = Q<sub>C</sub> / (ωV²)</b>。', on: 'k3' },
      { sub: '結果：電流變小、線損變小。最後看實際上怎麼量、怎麼收錢。', on: 'k4' }
    ]
  };

  /* ════════════ 16 瓦特計 ════════════ */
  const S16 = {
    t: '瓦特計怎麼量 P', en: 'THE WATTMETER',
    svg: src(90, 196, 'src') + g('wire', '<path class="ln" d="M90 172 V140 H140 M200 140 H470 V166 M470 226 V256 H90 V220"/>') +
      g('load', '<rect class="bgw" x="440" y="166" width="60" height="60" rx="8"/>' + T(470, 200, '負載', { cls: 't', fs: 13 })) +
      g('cc', '<rect class="accw" x="140" y="128" width="60" height="24" rx="6" style="stroke:var(--s-acc);stroke-width:1.6"/>' + T(170, 144, '電流線圈', { cls: 'ta', fs: 11 }) +
        T(170, 118, '串聯・阻抗極低', { cls: 'ta', fs: 12 })) +
      g('vc', '<path class="lna" d="M380 140 V166"/><rect class="accw" x="356" y="166" width="48" height="60" rx="6" style="stroke:var(--s-acc);stroke-width:1.6"/><path class="lna" d="M380 226 V256"/>' +
        T(380, 192, '電壓', { cls: 'ta', fs: 11 }) + T(380, 208, '線圈', { cls: 'ta', fs: 11 }) + T(346, 200, '並聯・阻抗極高', { cls: 'ta', fs: 12, a: 'end' })) +
      chip(560, 112, '讀數 = P', 'v·i 的平均', 'rd', { fs: 14, acc: true }),
    steps: [
      { sub: '實際的電路裡怎麼量 P？用<b>瓦特計</b>。', on: 'src wire load' },
      { sub: '裡面兩個線圈。<b>電流線圈</b>串在負載上，阻抗極低，像一條導線。', on: 'cc' },
      { sub: '<b>電壓線圈</b>並在負載兩端，阻抗極高，像斷路。所以接上去不會改變電路。', on: 'vc' },
      { sub: '指針有慣性，停在 v·i 的平均值 —— 讀到的就是 <b>P</b>。（量 Q 用乏計、量度數用電表。）', on: 'rd' }
    ]
  };

  /* ════════════ 17 電費 ════════════ */
  const S17 = {
    t: '電費怎麼算', en: 'ELECTRICITY COST',
    svg: g('mtr', '<rect class="bgw" x="80" y="110" width="120" height="120" rx="14"/><rect class="accw" x="100" y="140" width="80" height="30" rx="4"/>' +
        T(140, 160, '1234.5', { cls: 'ta', fs: 15, a: 'middle' }) + T(140, 206, 'kWh', { cls: 'tm', fs: 13 }) + T(140, 256, '電表：1 度 = 1 kWh', { cls: 't', fs: 13 })) +
      T(430, 132, '電費 = 固定費 ＋ 電能費', { fs: 17, k: 'f' }) +
      T(430, 160, '（看尖峰 kW）　（看度數 kWh）', { cls: 'tm', fs: 12.5, k: 'f2' }) +
      chip(430, 212, 'pf 每低於 0.85 一個 0.01', '加收電能費的 0.1%', 'pen', { fs: 13.5, acc: true }) +
      chip(430, 276, 'pf 低 → 電流大 → 線損大', '電力公司把這筆帳算給你', 'why', { fs: 13 }),
    steps: [
      { sub: '家裡的電表量的是用了幾度：<b>1 度 = 1 kWh</b>（1000 W 用 1 小時）。', on: 'mtr' },
      { sub: '工廠的電費 = <b>固定費</b>（看用電尖峰）＋ <b>電能費</b>（看度數）。', on: 'f f2' },
      { sub: '功因太低還會被<b>罰錢</b>：pf 每低於 0.85 一個 0.01，加收 0.1%。高於 0.85 反而減免。', on: 'pen' },
      { sub: '理由就是剛剛學的：pf 低 → 電流大 → 線損大。電力公司把這筆損失算給你。', on: 'why' }
    ]
  };

  /* ════════════ 18 恍然大悟 ════════════ */
  const S18 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: g('L', card(60, 100, 250, 140) + T(185, 128, '為什麼本來是 41.7 A', { fs: 15 }) + T(185, 160, 'Q = 3000 VAR 從電廠一路搬', { cls: 'tm', fs: 13 }) +
        T(185, 186, '|S| = 5000 VA', { cls: 'tm', fs: 13 }) + T(185, 220, '5000 ÷ 120 = 41.7 A', { cls: 't', fs: 14 })) +
      g('R', card(330, 100, 250, 140) + T(455, 128, '為什麼電容有用', { cls: 'ta', fs: 15 }) + T(455, 160, '電容就近供應 1686 VAR', { cls: 'tm', fs: 13 }) +
        T(455, 186, '電線只扛 |S| = 4210 VA', { cls: 'tm', fs: 13 })) +
      T(455, 220, '4210 ÷ 120 = 35.1 A', { cls: 'ta', fs: 14, k: 'R2' }) +
      chip(320, 274, '謎題解開了 ✓', '電容不耗電，但它把「泡沫」就近搬，電線就輕鬆了', 'ans', { fs: 13.5, acc: true }),
    steps: [
      { sub: '回到開頭：本來 Q = 3000 VAR 要從電廠一路搬到馬達，電線扛 |S| = 5000 VA → <b>41.7 A</b>。', on: 'L' },
      { sub: '並上電容：1686 VAR 由電容<b>就近供應</b>，電線只要扛 4210 VA。', on: 'R' },
      { sub: '4210 ÷ 120 = <b>35.1 A</b>。', on: 'R2' },
      { sub: '電容自己不耗電，馬達照樣 4 kW —— 改變的只有「泡沫」由誰搬。' },
      { sub: '<b>謎題解開了。</b>', on: 'ans' }
    ]
  };

  /* ════════════ 19 整章一條線 ════════════ */
  const step = (x, y, t1, key, acc) => chip(x, y, t1, null, key, { fs: 13.5, acc });
  const S19 = {
    t: '整章是一條線', en: 'THE WHOLE CHAPTER',
    svg: step(150, 118, 'p = v · i', 'c1') + step(330, 118, 'P = ½V<sub>m</sub>I<sub>m</sub> cos θ', 'c2') + step(520, 118, '有效值 rms', 'c3') +
      step(150, 188, 'S = V<sub>rms</sub>I<sub>rms</sub>、pf', 'c4') + step(340, 188, 'S = P + jQ', 'c5', true) + step(520, 188, 'S = ΣS<sub>i</sub>', 'c6') +
      step(220, 258, '功因校正 C = Q<sub>C</sub>/(ωV<sup>2</sup>)', 'c7') + step(460, 258, '瓦特計、電費', 'c8'),
    steps: [
      { sub: '整章其實是一條線：<b>p = v·i</b> → 取平均得 <b>P</b> → 用 <b>rms</b> 把 ½ 吃掉。', on: 'c1 c2 c3' },
      { sub: '拆出 <b>S 與 pf</b> → 打包成 <b>S = P + jQ</b> → 多個負載直接<b>相加</b>。', on: 'c4 c5 c6' },
      { sub: '最後用電容<b>校正功因</b>，再到現實世界的瓦特計和電費。', on: 'c7 c8' },
      { sub: '核心只有一條：<b>S = P + jQ</b>。', op: { c1: 0.35, c2: 0.35, c3: 0.35, c4: 0.35, c6: 0.35, c7: 0.35, c8: 0.35 } }
    ]
  };

  /* ════════════ 20 解題三步 ════════════ */
  const S20 = {
    t: '計算題三步走', en: 'HOW TO SOLVE',
    svg: kc(60, 104, '① 統一成 rms', '振幅要 ÷ √2', 'k1') + kc(330, 104, '② 每個負載 → (P, Q)', 'Q 的正負看電感／電容', 'k2') +
      g('k3', card(195, 196, 250, 64, ' style="stroke:var(--s-acc);stroke-width:1.6"') + T(320, 224, '③ 加總，最後才取大小', { cls: 'ta', fs: 15 }) + T(320, 248, '|S| = √(P² + Q²)', { cls: 'tm', fs: 12.5 })),
    steps: [
      { sub: '拿到交流功率的計算題：第一步，<b>統一成 rms</b>。', on: 'k1' },
      { sub: '第二步，<b>每個負載都化成一對 (P, Q)</b>，Q 的正負看電感或電容。', on: 'k2' },
      { sub: '第三步，<b>P 加 P、Q 加 Q，最後才取大小</b>。往下看推導、改例題的數字，把手感練起來。', on: 'k3' }
    ]
  };

  window.__ch11p3Story = window.__Story('#story', {
    id: 'circuits-ch11-part3', title: 'CH11 PART 3 複功率與功因校正', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20]
  });
})();
