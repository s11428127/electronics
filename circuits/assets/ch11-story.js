/* ============================================================
   電路學 CH11 交流功率分析 —— 故事模式
   主線謎題：4 kW 馬達接 120 V，照理 33.3 A，實際量到 41.7 A；
             並一顆不耗電的電容，電流降到 35.1 A，馬達照樣 4 kW。為什麼？
   答案：電線扛的是視在功率 S，其中虛功率 Q 只是來回搬；電容就近供應 Q。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const P = (fn, x0, x1, n) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + fn(x).toFixed(1); } return d; };
  const path = (d, cls, key, extra) => '<path class="' + cls + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  const fx = parts => { let o = parts[0]; for (let i = 1; i < parts.length; i += 2) o += '<tspan font-size="11" dy="4">' + parts[i] + '</tspan><tspan dy="-4">' + (parts[i + 1] || '') + '</tspan>'; return o; };
  const RAD = Math.PI / 180;

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '多出來的電流', en: 'THE QUESTION',
    svg: g('src', '<circle class="bgw" cx="120" cy="200" r="30"/>' + path('M104 200 C110 186 116 186 120 200 S130 214 136 200', 'ln') + T(120, 252, '120 V（rms）', { cls: 'tm', fs: 12 })) +
      g('wire', '<path class="ln" style="fill:none" d="M120 170 V130 H515 V160 M515 240 V270 H120 V230"/>') +
      g('mot', '<rect class="card" x="470" y="160" width="90" height="80" rx="10" style="stroke:var(--s-ink);stroke-width:1.6"/>' + T(515, 194, 'M', { fs: 22, dy: '.35em' }) + T(515, 222, '馬達 4 kW', { cls: 'tm', fs: 11.5 })) +
      g('am', '<circle class="bgw" cx="260" cy="130" r="18"/>' + T(260, 130, 'A', { fs: 14, dy: '.35em' })) +
      T(260, 96, '照直流算：4000 / 120 = 33.3 A', { cls: 'ts', fs: 13, k: 'guess' }) +
      T(260, 176, '41.7 A', { cls: 'ta', fs: 20, k: 'meas' }) +
      g('cap', '<path class="ln" style="fill:none" d="M390 130 V192 M390 208 V270"/><path class="lna" d="M370 192 H410 M370 208 H410" style="stroke-width:3"/>' + T(418, 200, 'C', { cls: 'ta', fs: 14, a: 'start', dy: '.35em' })) +
      T(320, 240, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '一間工廠的馬達：吃 <b>4 kW</b>，接 <b>120 V</b> 的市電。', on: 'src wire mot' },
      { sub: '照直流的算法，電流應該是 4000 ÷ 120 = <b>33.3 A</b>。', on: 'guess' },
      { sub: '實際一量：<b>41.7 A</b>，多了 25%。電線要更粗、線損更大 —— 多出來的電流跑去哪了？', on: 'am meas' },
      { sub: '更怪的是：在馬達旁邊並一顆<b>電容</b>（電容不消耗功率），電流降到 <b>35.1 A</b>，馬達照樣 4 kW。', on: 'cap', txt: { meas: '35.1 A' } },
      { sub: '要解開它，得先搞懂交流電的「功率」到底是什麼。', op: { src: 0.15, wire: 0.15, mot: 0.15, am: 0.15, guess: 0.15, meas: 0.15, cap: 0.15 }, on: 'q' }
    ]
  };

  /* ════════════ 01 瞬時功率 ════════════ */
  const th = 50 * RAD, W = 2 * Math.PI / 250;            /* 一個週期 250 px */
  const vY = x => 150 - 46 * Math.sin(W * (x - 80));
  const iY = x => 150 - 30 * Math.sin(W * (x - 80) - th);
  const pv = x => Math.sin(W * (x - 80)) * Math.sin(W * (x - 80) - th);   /* 介於 −0.82～0.18 … 0.82 */
  const pY = x => 292 - 62 * pv(x);
  const avg = 0.5 * Math.cos(th);
  let neg = '';
  for (let x = 80; x < 580; x += 2) if (pv(x) < 0) neg += '<rect x="' + x + '" y="292" width="2" height="' + (-62 * pv(x)).toFixed(1) + '" class="acc" opacity=".35"/>';
  const S1 = {
    t: '瞬時功率 p(t) = v · i', en: 'INSTANTANEOUS POWER',
    svg: g('ax1', '<path class="ln2" d="M76 150 H584"/>') +
      path(P(vY, 80, 580, 200), 'ln', 'v', 'stroke-width:2.4') + path(P(iY, 80, 580, 200), 'lna', 'i', 'stroke-width:2.4;stroke-dasharray:6 4') +
      T(590, vY(580) - 6, 'v(t)', { cls: 't', fs: 13, a: 'end', k: 'lv' }) + T(80, 92, 'i(t)：落後一個角度', { cls: 'ta', fs: 12, a: 'start', k: 'li' }) +
      g('ax2', '<path class="ln2" d="M76 292 H584"/>') +
      path(P(pY, 80, 580, 250), 'lna', 'p', 'stroke-width:2.8') + T(80, 222, 'p(t) = v · i', { cls: 'ta', fs: 13, a: 'start', k: 'lp' }) +
      g('neg', neg) + T(470, 316, '負的 = 能量送回電源', { cls: 'tm', fs: 12, k: 'negL' }) +
      path('M80 ' + (292 - 62 * avg).toFixed(1) + ' H580', 'ln dsh', 'avg', 'stroke-width:1.6') +
      T(584, 292 - 62 * avg, '平均 P', { cls: 't', fs: 12.5, a: 'start', dy: '.35em', k: 'lavg' }),
    steps: [
      { sub: '交流電的電壓 v(t) 跟電流 i(t) 都是弦波，而且通常<b>不同步</b>：電流落後一個角度。', on: 'ax1 v i lv li' },
      { sub: '某一瞬間吸收功率的速率 = v × i，叫<b>瞬時功率 p(t)</b>。', on: 'ax2 p lp' },
      { sub: 'p(t) 用<b>兩倍頻率</b>擺盪，有一小段還是<b>負的</b> —— 負的代表那段時間能量被送回電源。', on: 'neg negL' },
      { sub: '真正被吃掉的是它的<b>平均值</b>：P = ½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub> − θ<sub>i</sub>)，叫平均功率。', on: 'avg lavg' }
    ]
  };

  /* ════════════ 02 電阻 vs 電感 ════════════ */
  const mini = (x0, phase, key, title, cls) => {
    const w = 220, Wm = 2 * Math.PI / 110;
    const f = x => Math.sin(Wm * (x - x0)) * Math.sin(Wm * (x - x0) - phase);
    let fill = '';
    for (let x = x0; x < x0 + w; x += 2) { const v = f(x); fill += '<rect x="' + x + '" y="' + (v > 0 ? 210 - 70 * v : 210).toFixed(1) + '" width="2" height="' + Math.abs(70 * v).toFixed(1) + '" class="acc" opacity="' + (v > 0 ? '.28' : '.12') + '"/>'; }
    return g(key, T(x0 + w / 2, 98, title, { cls: cls, fs: 16 }) + '<path class="ln2" d="M' + (x0 - 4) + ' 210 H' + (x0 + w + 4) + '"/>' + fill +
      path(P(x => 210 - 70 * f(x), x0, x0 + w, 120), 'lna', null, 'stroke-width:2.6'));
  };
  const S2 = {
    t: '電阻吃掉、電感借了又還', en: 'RESISTOR VS INDUCTOR',
    svg: mini(70, 0, 'R', '純電阻：θ = 0°', 't') + mini(350, Math.PI / 2, 'L', '純電感：電流落後 90°', 't') +
      T(180, 126, '平均 = ½V_mI_m（全部吃掉）', { cls: 'ta', fs: 13, k: 'rA' }) + T(460, 126, '平均 = 0（一正一負抵銷）', { cls: 'ta', fs: 13, k: 'lA' }) +
      chip(180, 300, '實功率 P（W）', '電阻決定 P：變成熱、真的被用掉', 'cR', { fs: 13 }) +
      chip(460, 300, '虛功率 Q（VAR）', '電抗決定 Q：存進磁場又還回去', 'cL', { fs: 13, acc: true }),
    steps: [
      { sub: '純電阻：v、i 同步，p(t) 永遠 ≥ 0 —— 能量<b>全部被吃掉</b>變成熱。', on: 'R rA' },
      { sub: '純電感：電流落後 90°，p(t) 一正一負、面積剛好抵銷，<b>平均 = 0</b>。', on: 'L lA' },
      { sub: '電感是在「<b>借了又還</b>」：前半拍把能量存進磁場，後半拍還給電源。這種來回搬的叫<b>虛功率 Q</b>。', on: 'cL' },
      { sub: '一句話：<b>電阻決定 P、電抗決定 Q</b>。馬達裡有大線圈，所以有一大堆 Q。', on: 'cR' }
    ]
  };

  /* ════════════ 03 有效值 ════════════ */
  const Wr = 2 * Math.PI / 250, sY = x => 210 - 110 * Math.sin(Wr * (x - 80));
  const S3 = {
    t: '有效值：110 V 是什麼意思', en: 'EFFECTIVE (RMS) VALUE',
    svg: '<path class="ln2" d="M76 210 H584"/>' +
      path(P(sY, 80, 580, 200), 'ln', 'w', 'stroke-width:2.6') +
      g('pk', path('M80 100 H580', 'ln dsh', null) + T(84, 92, '波峰 155 V', { cls: 'tm', fs: 12.5, a: 'start' })) +
      g('rm', path('M80 ' + (210 - 110 / Math.SQRT2).toFixed(1) + ' H580', 'lna', null, 'stroke-width:2.6') + T(584, 210 - 110 / Math.SQRT2, '110 V', { cls: 'ta', fs: 14, a: 'start', dy: '.35em' })) +
      chip(320, 292, '有效值 = 發一樣熱的直流電壓', '110 V 交流 ≈ 110 V 直流，接同一顆電阻一樣燙', 'cE', { fs: 13 }) +
      chip(320, 292, '√( 平均( v² ) )', '先 square、再 mean、最後 root', 'f', { fs: 15, acc: true }) +
      chip(320, 314, '弦波：V_rms = V_m / √2 = 155 / 1.414 ≈ 110', '用 rms 之後，P = V_rms·I_rms·cos θ，跟直流長得一樣', 'cS', { fs: 12.5 }),
    steps: [
      { sub: '台灣市電叫「110 V」，但波峰其實有 <b>155 V</b>。', on: 'w pk' },
      { sub: '110 是<b>有效值</b>：讓同一顆電阻發出一樣多熱的那個<b>直流</b>電壓。', on: 'rm cE' },
      { sub: '算法照英文名字<b>倒著唸</b>：先平方（square）、再平均（mean）、再開根號（root）。', off: 'cE', on: 'f' },
      { sub: '弦波的有效值 = 振幅 ÷ √2。以後功率公式全部用 rms，就跟直流一模一樣。', off: 'f', on: 'cS' }
    ]
  };

  /* ════════════ 04 視在功率與功率因數：啤酒杯 ════════════ */
  let foam = '';
  [[268, 112], [292, 106], [318, 110], [344, 104], [368, 112], [280, 136], [306, 132], [332, 138], [356, 130], [372, 148], [268, 156], [296, 160], [322, 156], [348, 162]]
    .forEach(([x, y]) => { foam += D.h(x, y, null, 11); });
  const S4 = {
    t: '視在功率與功率因數', en: 'APPARENT POWER · POWER FACTOR',
    svg: g('glass', '<path class="ln" style="fill:none;stroke-width:2.4" d="M250 92 L262 300 H378 L390 92"/>') +
      g('beer', '<path class="acc" opacity=".55" d="M256 172 L263 298 H377 L384 172 Z"/>') + g('foam', foam) +
      g('lS', '<path class="ln" d="M410 92 H426 M410 300 H426 M418 92 V300"/>' + T(434, 196, '杯子 = S（VA）', { cls: 't', fs: 14, a: 'start', dy: '.35em' }) + T(434, 220, '電線要扛的量', { cls: 'ts', fs: 12, a: 'start', dy: '.35em' })) +
      T(230, 240, '酒 = P（W）', { cls: 'ta', fs: 14, a: 'end', k: 'lP' }) + T(230, 132, '泡沫 = Q（VAR）', { cls: 't', fs: 14, a: 'end', k: 'lQ' }) +
      T(230, 264, '真的被用掉', { cls: 'ts', fs: 12, a: 'end', k: 'lP2' }) +
      chip(320, 318, 'S = V_rms · I_rms　pf = P / S = cos θ', '馬達：S = 5000 VA、P = 4000 W → pf = 0.8', 'cF', { fs: 13, acc: true }),
    steps: [
      { sub: 'V<sub>rms</sub> × I<sub>rms</sub> 看起來像功率，叫<b>視在功率 S</b>（單位 VA）—— 這是<b>電線真正要扛的量</b>。', on: 'glass lS' },
      { sub: '但真正被用掉的只有一部分：<b>實功率 P</b>。', on: 'beer lP lP2' },
      { sub: '剩下的是來回搬的 <b>Q</b>。像一杯啤酒：你喝的是酒，但杯子得大到裝得下泡沫。', on: 'foam lQ' },
      { sub: 'P/S 叫<b>功率因數 pf = cos θ</b>。馬達的 pf = 0.8：杯子 5000 VA，酒只有 4000 W。', on: 'cF' }
    ]
  };

  /* ════════════ 05 功率三角形 ════════════ */
  const O5 = [150, 290], sc5 = 0.065;
  const tP = [O5[0] + 4000 * sc5, O5[1]], tS = [O5[0] + 4000 * sc5, O5[1] - 3000 * sc5];
  const S5 = {
    t: '功率三角形', en: 'POWER TRIANGLE · S = P + jQ',
    svg: g('Pv', arrow(O5[0], O5[1], tP[0], tP[1], null, 'ln') + T((O5[0] + tP[0]) / 2, O5[1] + 20, 'P = 4000 W', { cls: 't', fs: 14 })) +
      g('Qv', arrow(tP[0], tP[1], tS[0], tS[1], null, 'lna') + T(tS[0] + 10, (tP[1] + tS[1]) / 2, 'Q = 3000 VAR', { cls: 'ta', fs: 14, a: 'start', dy: '.35em' })) +
      g('Sv', arrow(O5[0], O5[1], tS[0], tS[1], null, 'ln') + T((O5[0] + tS[0]) / 2 - 16, (O5[1] + tS[1]) / 2 - 8, '|S| = 5000 VA', { cls: 't', fs: 14, a: 'end' })) +
      g('ang', path('M' + (O5[0] + 54) + ' ' + O5[1] + ' A54 54 0 0 0 ' + (O5[0] + 54 * 0.8).toFixed(1) + ' ' + (O5[1] - 54 * 0.6).toFixed(1), 'lna', null, 'stroke-width:1.8') +
        T(O5[0] + 64, O5[1] - 14, 'θ = 36.9°', { cls: 'ta', fs: 13, a: 'start' })) +
      T(150, 108, '3 : 4 : 5', { cls: 'tm', fs: 16, k: 'r345' }) +
      chip(530, 250, 'Q &gt; 0：電感性（落後）', 'Q &lt; 0：電容性（超前）', 'cQ', { fs: 12.5 }),
    steps: [
      { sub: '把 P 畫成橫的、Q 畫成直的，S 就是斜邊：<b>S = P + jQ</b>，叫<b>複功率</b>。', on: 'Pv Qv Sv' },
      { sub: '馬達的三個數字剛好是 3-4-5 直角三角形：4000、3000、5000。', on: 'r345' },
      { sub: '夾角 θ 就是電壓跟電流的相位差：cos θ = 4000/5000 = <b>0.8</b> = 功率因數。', on: 'ang' },
      { sub: 'Q 往上（&gt; 0）是電感性、電流落後；往下（&lt; 0）是電容性。馬達是電感性。', on: 'cQ' }
    ]
  };

  /* ════════════ 06 S = V·I* ════════════ */
  const O6 = [170, 230], ph = (len, deg) => [O6[0] + len * Math.cos(deg * RAD), O6[1] - len * Math.sin(deg * RAD)];
  const V6 = ph(130, 30), I6 = ph(80, -10), Ic = ph(80, 10);
  const S6 = {
    t: '從相量算複功率', en: 'S = V_rms · I*_rms',
    svg: g('ax', '<path class="ln2" d="M60 230 H330 M170 340 V100"/>') +
      g('Vv', arrow(O6[0], O6[1], V6[0], V6[1], null, 'ln') + T(V6[0] + 6, V6[1] - 6, 'V = 100∠30°', { cls: 't', fs: 13, a: 'start' })) +
      g('Iv', arrow(O6[0], O6[1], I6[0], I6[1], null, 'lna') + T(I6[0] + 6, I6[1] + 14, 'I = 5∠−10°', { cls: 'ta', fs: 13, a: 'start' })) +
      g('Icv', arrow(O6[0], O6[1], Ic[0], Ic[1], null, 'lna') + T(Ic[0] + 6, Ic[1] - 2, 'I* = 5∠+10°', { cls: 'ta', fs: 13, a: 'start' })) +
      T(470, 118, fx(['S = V', 'rms', ' · I*', 'rms']), { cls: 't', fs: 20, k: 'f' }) +
      T(490, 156, '相乘：大小相乘、角度相加', { cls: 'tm', fs: 13, k: 'r1' }) +
      T(490, 190, '100∠30° × 5∠10° = 500∠40°', { cls: 'ta', fs: 16, k: 'r2' }) +
      T(490, 226, 'P = 500 cos40° = 383 W', { cls: 't', fs: 14, k: 'r3' }) + T(490, 252, 'Q = 500 sin40° = 321 VAR', { cls: 't', fs: 14, k: 'r4' }) +
      chip(470, 300, '40° = θv − θi ✓', '不取共軛的話會變成 30° + (−10°) = 20°，全錯', 'cW', { fs: 12.5, acc: true }),
    steps: [
      { sub: '手上有電壓、電流相量時：<b>S = V<sub>rms</sub> · I*<sub>rms</sub></b>，電流要取<b>共軛</b>（角度變號）。', on: 'ax Vv Iv f' },
      { sub: '為什麼要共軛？相量相乘時<b>角度相加</b>。把 I 的角度變號，加起來才會是 θ<sub>v</sub> − θ<sub>i</sub>。', op: { Iv: 0.3 }, on: 'Icv r1' },
      { sub: '例：100∠30° × 5∠+10° = <b>500∠40°</b> VA。', on: 'r2' },
      { sub: '化成直角座標：<b>P = 383 W、Q = 321 VAR</b>。一個 S 在手，P、Q、|S|、pf 全有。', on: 'r3 r4 cW' }
    ]
  };

  /* ════════════ 07 守恆 ════════════ */
  const O7 = [110, 280], sc7 = 0.1;
  const A7 = [O7[0] + 1000 * sc7, O7[1] - 1500 * sc7], B7 = [A7[0] + 2000 * sc7, A7[1] + 500 * sc7];
  const S7 = {
    t: '功率守恆', en: 'CONSERVATION OF AC POWER',
    svg: g('s1', arrow(O7[0], O7[1], A7[0], A7[1], null, 'ln') + T(A7[0] - 74, A7[1] + 40, 'S₁ = 1000 + j1500', { cls: 't', fs: 13, a: 'end' }) + T(A7[0] - 74, A7[1] + 60, '|S₁| = 1803 VA', { cls: 'ts', fs: 12, a: 'end' })) +
      g('s2', arrow(A7[0], A7[1], B7[0], B7[1], null, 'ln') + T((A7[0] + B7[0]) / 2 + 10, (A7[1] + B7[1]) / 2 - 34, 'S₂ = 2000 − j500', { cls: 't', fs: 13 }) + T((A7[0] + B7[0]) / 2 + 10, (A7[1] + B7[1]) / 2 - 16, '|S₂| = 2062 VA（電容性）', { cls: 'ts', fs: 12 })) +
      g('ss', arrow(O7[0], O7[1], B7[0], B7[1], null, 'lna') + T(B7[0] + 10, B7[1] + 4, 'S = 3000 + j1000', { cls: 'ta', fs: 14, a: 'start', dy: '.35em' })) +
      T(480, 228, 'P = 1000 + 2000 = 3000 W ✓', { cls: 't', fs: 13, k: 'pq' }) + T(480, 250, 'Q = 1500 − 500 = 1000 VAR ✓', { cls: 't', fs: 13, k: 'pq2' }) +
      chip(470, 300, '|S| = 3162 ≠ 1803 + 2062', '斜邊不能直接相加 —— 最常被扣分的地方', 'cX', { fs: 13, acc: true }),
    steps: [
      { sub: '兩個負載接在一起：電源送出的複功率 = 各負載的總和，<b>S = S<sub>1</sub> + S<sub>2</sub></b>。', on: 's1 s2 ss' },
      { sub: '實際做法：P 跟 Q <b>各自直接相加</b>。', on: 'pq pq2' },
      { sub: '但大小不能直接加：<b>|S| ≠ |S<sub>1</sub>| + |S<sub>2</sub>|</b>。它們是向量，要頭接尾。', on: 'cX' }
    ]
  };

  /* ════════════ 08 最大功率轉移 ════════════ */
  const box = (x, y, w, h, label, key, acc) => g(key, '<rect class="' + (acc ? 'accw' : 'bgw') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.6"/>' + T(x + w / 2, y + h / 2, label, { cls: acc ? 'ta' : 't', fs: 13, dy: '.35em' }));
  const S8 = {
    t: '最大功率轉移', en: 'MAXIMUM AVERAGE POWER TRANSFER',
    svg: g('ckt', '<circle class="bgw" cx="110" cy="200" r="28"/>' + path('M95 200 C101 187 107 187 110 200 S120 213 126 200', 'ln') + T(110, 248, 'V_Th', { cls: 't', fs: 13 }) +
        '<path class="ln" style="fill:none" d="M110 172 V130 H190 M330 130 H440 V170 M440 230 V270 H110 V228"/>') +
      box(190, 112, 140, 36, 'Z_Th = R + jX', 'zth') + box(380, 170, 120, 60, '', 'zl', true) + T(440, 200, 'Z_L = ?', { cls: 'ta', fs: 13, dy: '.35em', k: 'zlq' }) +
      T(440, 200, 'Z_L = R − jX', { cls: 'ta', fs: 13, dy: '.35em', k: 'zl2' }) +
      chip(470, 300, '① 先用 −jX 把 +jX 抵銷', '電抗互相抵掉 → 電流最大', 'c1', { fs: 12.5 }) +
      chip(170, 300, '② 再用 R 匹配 R', '跟直流的 R_L = R_Th 一樣', 'c2', { fs: 12.5 }) +
      T(320, 92, 'Z_L = Z_Th*　⟹　P_max = |V_Th|² / (8R_Th)', { cls: 'ta', fs: 16, k: 'f' }),
    steps: [
      { sub: '電源用戴維寧等效：V<sub>Th</sub> 串 Z<sub>Th</sub> = R + jX。負載 Z<sub>L</sub> 要選多少，才能拿到最多平均功率？', on: 'ckt zth zl zlq' },
      { sub: '第一步：讓負載的電抗是 <b>−jX</b>，把電源那邊的 +jX 抵銷掉。', on: 'c1' },
      { sub: '第二步：剩下純電阻，就跟直流一樣 <b>R<sub>L</sub> = R<sub>Th</sub></b>。', on: 'c2' },
      { sub: '合起來：<b>Z<sub>L</sub> = Z<sub>Th</sub>*</b>（共軛匹配），P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>)。', off: 'zlq', on: 'zl2 f' }
    ]
  };

  /* ════════════ 09 功因校正 ════════════ */
  const O9 = [120, 290], sc9 = 0.07;
  const p9 = [O9[0] + 4000 * sc9, O9[1]], q1 = [p9[0], O9[1] - 3000 * sc9], q2 = [p9[0], O9[1] - 1314 * sc9];
  const S9 = {
    t: '功率因數校正', en: 'POWER FACTOR CORRECTION',
    svg: g('t1', arrow(O9[0], O9[1], p9[0], p9[1], null, 'ln') + arrow(p9[0], p9[1], q1[0], q1[1], null, 'ln') + arrow(O9[0], O9[1], q1[0], q1[1], null, 'ln') +
        T((O9[0] + p9[0]) / 2, O9[1] + 20, 'P = 4000 W', { cls: 't', fs: 13 }) + T(250, 178, 'S₁ = 5000 VA', { cls: 't', fs: 13, a: 'end' })) +
      g('qc', arrow(q1[0] + 22, q1[1], q2[0] + 22, q2[1], null, 'lna') + T(q1[0] + 32, (q1[1] + q2[1]) / 2, '電容 −Q_C = −1686 VAR', { cls: 'ta', fs: 13, a: 'start', dy: '.35em' })) +
      g('t2', arrow(O9[0], O9[1], q2[0], q2[1], null, 'lna') + T(q2[0] + 10, q2[1] + 20, 'S₂ = 4210 VA', { cls: 'ta', fs: 13, a: 'start' })) +
      T(q1[0] + 10, q1[1] - 8, 'Q₁ = 3000', { cls: 'tm', fs: 12, a: 'start', k: 'q1L' }) +
      chip(185, 104, 'pf：0.8 → 0.95　P 不變', '線電流 41.7 A → 35.1 A，線損 −29%', 'cI', { fs: 13, acc: true }) +
      chip(185, 104, 'C = Q_C / (ωV²) = 310.5 μF', '= 1686 / (377 × 120²)', 'cC', { fs: 13 }),
    steps: [
      { sub: '馬達的三角形：P = 4000 W、Q = 3000 VAR、S = 5000 VA，pf = 0.8。', on: 't1 q1L' },
      { sub: '在馬達旁<b>並一顆電容</b>。電容的 Q 是<b>負的</b>，直接從三角形的 Q 扣掉。', on: 'qc' },
      { sub: '目標 pf = 0.95：Q 從 3000 壓到 1314 VAR，斜邊 S 縮成 <b>4210 VA</b>。<b>P 一點都沒變</b>。', op: { t1: 0.35 }, on: 't2' },
      { sub: '電容值：C = Q<sub>C</sub>/(ωV²<sub>rms</sub>) = <b>310.5 μF</b>（課本例題 11.15）。', on: 'cC' },
      { sub: '結果：電線上的電流從 41.7 A 降到 <b>35.1 A</b>，線損少了將近三成。', off: 'cC', on: 'cI' }
    ]
  };

  /* ════════════ 10 恍然大悟 ════════════ */
  const S10 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 220, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="70" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(188, 124, '為什麼是 41.7 A', { fs: 16 }) + T(188, 156, '電線扛的是 S，不是 P', { cls: 'tm', fs: 13 }) +
        T(188, 182, '5000 VA ÷ 120 V', { cls: 'tm', fs: 13 }) + T(188, 222, '= 41.7 A', { cls: 't', fs: 15 })) +
      g('R', '<rect class="card" x="334" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(452, 124, '為什麼電容有用', { fs: 16, cls: 'ta' }) + T(452, 156, 'Q 改由旁邊的電容就近供應', { cls: 'tm', fs: 13 }) +
        T(452, 182, '電線只扛 4210 VA', { cls: 'tm', fs: 13 }) + T(452, 222, '= 35.1 A', { cls: 'ta', fs: 15 })) +
      chip(320, 282, '謎題解開了 ✓', '多出來的電流在搬 Q：借了又還，不耗電但佔電線', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, '電表收的是 P（kWh），電力公司卻要扛 S', '所以會要求工廠維持高功因，否則加收費用', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：4 kW 的馬達，為什麼電線要扛 41.7 A？', on: 'q' },
      { sub: '因為電線扛的是<b>視在功率 S</b> = 5000 VA，除以 120 V 就是 41.7 A。', off: 'q', on: 'L' },
      { sub: '並上電容之後，Q 改由電容<b>就近供應</b>，電線只要扛 4210 VA → 35.1 A。', on: 'R' },
      { sub: '多出來的那些電流，是在電源跟馬達之間<b>搬虛功率 Q</b>：不耗電，但佔用電線。<b>謎題解開了。</b>', on: 'ans' },
      { sub: '電表收費看 P，但發電廠和電線得扛 S —— 所以電力公司會要求工廠把功因做高。', off: 'ans', on: 'next' }
    ]
  };

  window.__ch11Story = window.__Story('#story', {
    id: 'circuits-ch11', title: 'CH11 交流功率分析', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]
  });
})();
