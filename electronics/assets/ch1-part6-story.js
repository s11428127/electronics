/* ============================================================
   電子學 CH1 PART 6（原講義 PART 5 V3，投影片 1-1～1-34）—— 故事模式
   故事一（#story）：小訊號。謎題 = Example 1.11：5 V 直流 + 0.1 V 交流推一顆「彎的」二極體，輸出的交流會被扭曲嗎？多大？
                    答案：二極體對小交流就是一顆 29.5 Ω 的電阻 → 0.0995 V，幾乎沒扭曲。
   故事二（倉庫、開關、二極體家族）10/31 搬到 ch1-part7-story.js。
   寫法：先複習前面（PART 3～5）、生活比喻（湖面、地球、記帳、倉庫、水龍頭）、「先整理一下」分水嶺，最後才上數字。
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

  /* ══════════════════════════ 故事一：小訊號 ══════════════════════════ */

  /* 00 謎題 */
  const A0 = sc('一顆彎的二極體，兩種電', 'THE QUESTION',
    Q.c111(150, 140, 150, 140, 'full', { k: 'cir', vi: '0.1 sin ωt', vps: '5 V', r: '5 kΩ' }) +
    calc(370, 118, 240, [['直流 5 V ＋ 交流 0.1 V', 'r1'], ['二極體是「彎的」（非線性）', 'r2', 'tm'], ['輸出的交流 = ？', 'r3', 'ta']], { k: 'cc' }) +
    T(490, 290, '?', { cls: 'ta', fs: 64, k: 'q' }),
    [{ sub: '一顆二極體、一顆 5 V 電池、一個 0.1 V 的交流訊號，串成一圈（課本 Example 1.11）。', on: 'cir' },
     { sub: '電池負責讓二極體導通；交流才是我們想傳過去的訊號（想成聲音）。', on: 'cc r1' },
     { sub: '可是二極體不是電阻，它的曲線是<b>彎的</b>。交流穿過它，會不會被扭曲？', on: 'r2' },
     { sub: '輸出的交流到底多大？這一段就來解這題。先複習一下 PART 5。', on: 'r3 q' }]);

  /* 01 複習：單向門 */
  const PA = axes(120, 112, 400, 168, { v0: -0.4, v1: 0.8, i0: -0.4, i1: 3, vt: [[0.7, '0.7 V']], it: [] });
  const A1 = sc('先複習：二極體的曲線', 'RECAP · THE CURVE',
    PA.svg + PA.curve(iv14, -0.4, 0.75, 'cv') +
    chip(250, 160, '不到 0.6～0.7 V：門關著', '幾乎沒有電流', 'c1', { fs: 13 }) +
    chip(470, 150, '過了 0.7 V：門打開', '電流往上衝（指數）', 'c2', { fs: 13, acc: true }),
    [{ sub: '先複習：二極體的電流–電壓曲線。', on: 'cv' },
     { sub: '電壓還不到 0.6～0.7 V，門關著，幾乎沒電流。', on: 'c1' },
     { sub: '過了 0.7 V，電流往上衝 —— 一條<b>指數</b>曲線，很彎。', on: 'c2' }]);

  /* 02 複習：Q 點 */
  const PB = axes(70, 112, 290, 168, { v0: 0, v1: 5.4, i0: 0, i1: 2.8, vt: [[5, '5 V']], it: [[2.5, '2.5']] });
  const A2 = sc('複習：Q 點', 'RECAP · Q-POINT',
    PB.svg + PB.curve(iv13, 0, 0.66, 'cv') + PB.seg(0, 2.5, 5, 0, 'll', 'ln', ' style="stroke-width:2.2"') +
    PB.dot(0.619, 2.19, 'q', 6.5) + T(PB.X(0.62) + 12, PB.Y(2.19) - 8, 'Q（0.62 V, 2.19 mA）', { cls: 'ta', fs: 13, a: 'start', k: 'ql' }) +
    circ(440, 150, 150, 120, { k: 'cir', vps: '5 V', r: '2 kΩ' }),
    [{ sub: '再複習 PART 5：二極體接上電池和電阻。', on: 'cir cv' },
     { sub: '外面的電路給一條直線（負載線），二極體給一條曲線。', on: 'll' },
     { sub: '交點就是 <b>Q 點</b>（工作點）：二極體在這裡「停好」。', on: 'q ql' }]);

  /* 03 複習：定電壓降 */
  const A3 = sc('複習：導通時當成 0.7 V 電池', 'RECAP · CONSTANT DROP',
    circ(90, 150, 170, 120, { k: 'cir', vps: 'V<sub>PS</sub>', r: 'R', model: 'cvd', vg: '0.7 V', cur: 'cur' }) +
    calc(360, 130, 250, [['I<sub>DQ</sub> = (V<sub>PS</sub> − 0.7) / R', 'r1', 'ta'], ['電流由外面的電阻決定', 'r2', 'tm']], { k: 'cc' }),
    [{ sub: '定電壓降模型：導通的二極體 = 一顆 <b>0.7 V 的小電池</b>（Example 1.11 用 0.6 V）。', on: 'cir' },
     { sub: '一條 KVL 就算出 Q 點電流。這些是<b>直流</b>的事。', on: 'cur cc r1 r2' }]);

  /* 04 新問題：湖面 */
  const lake = path(wavePath(90, 200, 300, 6, u => Math.sin(u * 8 * Math.PI)), 'lna', 'wv', 'stroke-width:2.6');
  const A4 = sc('新問題：直流上面有交流', 'DC WITH A LITTLE AC',
    g('lk', '<rect class="accw" x="90" y="200" width="300" height="90" style="opacity:.55"/>') + lake +
    '<line class="ln dsh" x1="70" y1="200" x2="410" y2="200"' + K.k('lv') + '/>' +
    arrow(420, 288, 420, 204, 'ar', 'ln') + T(430, 250, '水位 = 直流', { cls: 't', fs: 14, a: 'start', k: 'l1' }) +
    T(240, 180, '小波浪 = 交流', { cls: 'ta', fs: 14, k: 'l2' }) +
    chip(500, 130, '聲音、收音機訊號', '都是很小的交流', 'c1', { fs: 13 }),
    [{ sub: '真實的訊號（聲音、收音機）都是<b>交流</b>，而且很小。', on: 'c1' },
     { sub: '可是二極體要先有<b>直流</b>才會導通。所以兩種電會一起出現。', on: 'lk' },
     { sub: '想像一座湖：<b>水位</b>是直流，把東西「架」在某個高度。', on: 'lv ar l1' },
     { sub: '湖面的<b>小波浪</b>是交流，它騎在水位上面晃。', on: 'wv l2' }]);

  /* 05 符號 */
  const A5 = sc('三個量，三種寫法', 'NOTATION',
    calc(110, 112, 420, [['v<sub>D</sub> = V<sub>DQ</sub> + v<sub>d</sub>', null, 'ta', 22]], { k: 'eq', a: 'middle', lh: 40 }) +
    chip(170, 220, 'v<sub>D</sub>：總量', '小寫 + 大寫下標', 'c1', { fs: 14 }) +
    chip(320, 220, 'V<sub>DQ</sub>：直流', '大寫 + 大寫下標', 'c2', { fs: 14 }) +
    chip(470, 220, 'v<sub>d</sub>：交流', '小寫 + 小寫下標', 'c3', { fs: 14, acc: true }) +
    T(320, 290, '電流也一樣：i<sub>D</sub> = I<sub>DQ</sub> + i<sub>d</sub>', { cls: 'tm', fs: 14, k: 'c4' }),
    [{ sub: '寫成式子：總電壓 = 直流 + 交流（講義 1-2）。', on: 'eq' },
     { sub: '<b>小寫＋大寫下標</b>是總量。', on: 'c1' },
     { sub: '<b>大寫</b>是直流（水位）。', on: 'c2' },
     { sub: '<b>小寫＋小寫下標</b>是交流（波浪）。考卷靠大小寫分這三個量。', on: 'c3 c4' }]);

  /* 06 地球比喻 */
  const A6 = sc('地球是圓的，可是門口是平的', 'ZOOM IN AND IT IS FLAT',
    path('M70 250 A760 760 0 0 1 570 250', 'ln', 'arc', 'stroke-width:2.6') +
    g('me', '<circle class="acc" cx="320" cy="210" r="6"/><rect class="ln" x="308" y="196" width="24" height="16" style="fill:none"/>' + T(320, 238, '你家門口', { cls: 'tm', fs: 12 })) +
    g('zm', '<circle class="ln dsh" cx="320" cy="207" r="26" style="fill:none"/><line class="ln dsh" x1="342" y1="194" x2="430" y2="130"/>' +
      '<rect class="card" x="430" y="104" width="170" height="70" rx="10" filter="url(#st-sh)"/><line class="lna" x1="448" y1="146" x2="582" y2="146" style="stroke-width:3"/>' + T(515, 128, '放大看：一條直線', { cls: 'ta', fs: 13 })) +
    chip(170, 140, '只看一小段', '彎的也會像直的', 'c1', { fs: 13 }),
    [{ sub: '地球是圓的。', on: 'arc' },
     { sub: '可是你家門口看起來是<b>平的</b>。', on: 'me' },
     { sub: '因為你只看<b>一小段</b>。任何平滑的曲線，看得夠近，都像一條直線。', on: 'zm c1' }]);

  /* ── 完整的小訊號圖（課本 Fig 1.34 那種）：曲線在右上、v_D(t) 畫在橫軸下面（時間往下）、i_D(t) 畫在縱軸左邊（時間往左） ── */
  const IQ = 2, VQ = vq14(IQ), SL = IQ / VT;
  const PC = axes(80, 112, 280, 168, { v0: 0.55, v1: 0.75, i0: 0, i1: 6, vt: [[0.6, '0.6'], [0.7, '0.7']], it: [] });
  function FF(amp, opt) {
    opt = opt || {};
    const P = axes(290, 110, 300, 110, { v0: 0.6, v1: 0.75, i0: 0, i1: 7, vt: [[VQ, 'V<sub>DQ</sub>']], it: [] });
    const yb = 228, H = 70, xl = 278, Wl = 170;            /* v 波形：y 228～298；i 波形：x 248 往左到 108 */
    const vAt = u => VQ + amp * Math.sin(u * 4 * Math.PI);
    let vw = '', iw = '';
    for (let n = 0; n <= 100; n++) { const u = n / 100; vw += (n ? ' L' : 'M') + f1(P.X(vAt(u))) + ' ' + f1(yb + u * H); iw += (n ? ' L' : 'M') + f1(xl - u * Wl) + ' ' + f1(P.Y(iv14(vAt(u)))); }
    const pj = (u, key) => { const v = vAt(u), x = P.X(v), y = P.Y(iv14(v)), yv = yb + u * H, xi = xl - u * Wl;
      return g(key, '<path class="ln2 dsh" style="fill:none" d="M' + f1(x) + ' ' + f1(yv) + ' V' + f1(y) + ' H' + f1(xi) + '"/><circle class="acc" cx="' + f1(x) + '" cy="' + f1(y) + '" r="4.5"/><circle class="acc" cx="' + f1(x) + '" cy="' + f1(yv) + '" r="4"/><circle class="acc" cx="' + f1(xi) + '" cy="' + f1(y) + '" r="4"/>'); };
    let seg = '';
    for (let n = 0; n <= 20; n++) { const v = VQ - amp + 2 * amp * n / 20; seg += (n ? ' L' : 'M') + f1(P.X(v)) + ' ' + f1(P.Y(iv14(v))); }
    const yQ = P.Y(IQ);
    return g('ax', P.svg + P.curve(iv14, 0.6, 0.71, null, 'ln') + '<line class="ln2" x1="' + xl + '" y1="' + yQ + '" x2="' + (xl - Wl) + '" y2="' + yQ + '" style="stroke-dasharray:3 4"/>' +
        T(xl - Wl - 6, yQ + 4, 'I<sub>DQ</sub>', { cls: 'tm', fs: 12, a: 'end' })) +
      g('q', P.dot(VQ, IQ, null, 6) + T(P.X(VQ) - 10, yQ - 6, 'Q', { cls: 'ta', fs: 14, a: 'end' })) +
      path(vw, 'lna', 'vw', 'stroke-width:2.4') + g('vl', T(P.X(VQ) + amp * 2000 + 14, 290, 'v<sub>D</sub>(t)', { cls: 'ta', fs: 13, a: 'start' }) + arrow(P.X(VQ) + amp * 2000 + 30, 252, P.X(VQ) + amp * 2000 + 30, 274, null, 'ln') + T(P.X(VQ) + amp * 2000 + 38, 268, '時間', { cls: 'ts', fs: 11, a: 'start' })) +
      path(iw, 'lna', 'iw', 'stroke-width:2.4') + g('il', T(118, yQ + 34, 'i<sub>D</sub>(t)', { cls: 'ta', fs: 13, a: 'start' }) + arrow(200, yQ + 46, 168, yQ + 46, null, 'ln') + T(214, yQ + 50, '時間', { cls: 'ts', fs: 11, a: 'start' })) +
      pj(0.125, 'pj1') + pj(0.375, 'pj2') +
      path(seg, 'lna', 'seg', 'stroke-width:7;opacity:.55') +
      P.seg(VQ - 0.02, IQ - SL * 0.02, VQ + 0.03, IQ + SL * 0.03, 'tg', 'ln', ' style="stroke-width:1.8;stroke-dasharray:6 4"') +
      T(P.X(VQ + 0.03) + 8, P.Y(IQ + SL * 0.03) + 4, '切線', { cls: 'tm', fs: 13, a: 'start', k: 'tgl' }) +
      (opt.extra || '');
  }

  /* 補課 K1～K5（使用者 10/31：「藍色框」看不懂、跟交流什麼關係 → 畫完整的圖） */
  const faucet = (x, key, label, A) => g(key, '<line class="ln2 dsh" x1="' + (x + 16) + '" y1="200" x2="' + (x + 214) + '" y2="200"/>' + path(wavePath(x + 16, 200, 198, A, u => Math.sin(u * 6 * Math.PI)), 'lna', null, 'stroke-width:2.4') + T(x + 115, 246, label, { cls: 'tm', fs: 12 }));
  const K1 = sc('先補課：水龍頭的把手', 'A TAP HANDLE',
    card(50, 112, 250, 150, 'A', T(175, 140, '把手角度（你轉的）', { fs: 15 }) + T(175, 166, '先轉到一半 = 固定的部分', { cls: 'ts', fs: 12 })) +
    card(340, 112, 250, 150, 'B', T(465, 140, '水流（跟著變）', { fs: 15, cls: 'ta' }) + T(465, 166, '固定的水流 + 一點起伏', { cls: 'ts', fs: 12 })) +
    faucet(60, 'wA', '來回小小轉', 10) + faucet(350, 'wB', '一下多、一下少', 16) + arrow(304, 200, 336, 200, 'ar', 'lna') +
    chip(320, 292, '把手 = 電壓 v<sub>D</sub>　水流 = 電流 i<sub>D</sub>', '直流 = 先轉到的位置；交流 = 來回小小轉', 'c1', { fs: 13, acc: true }),
    [{ sub: '先補課。想像水龍頭：把手先轉到一半，水穩穩地流 —— 這是<b>直流</b>。', on: 'A B' },
     { sub: '再把把手<b>來回小小轉</b>：水流就跟著一下多、一下少 —— 這就是<b>交流</b>。', on: 'wA wB ar' },
     { sub: '二極體一模一樣：把手是<b>電壓</b>，水流是<b>電流</b>。', on: 'c1' }]);
  const K2 = sc('電壓隨時間長這樣', 'v<sub>D</sub>(t)',
    arrow(90, 290, 90, 112, null, 'ln') + arrow(84, 284, 590, 284, null, 'ln') + T(98, 122, 'v<sub>D</sub>', { cls: 'tm', fs: 13, a: 'start' }) + T(586, 302, '時間 t', { cls: 'tm', fs: 12, a: 'end' }) +
    g('dc', '<line class="ln dsh" x1="90" y1="200" x2="580" y2="200"/>' + T(100, 232, 'V<sub>DQ</sub> = 0.677 V（直流）', { cls: 't', fs: 13, a: 'start' })) +
    path(wavePath(110, 200, 460, 36, u => Math.sin(u * 4 * Math.PI)), 'lna', 'ac', 'stroke-width:2.6') +
    g('acl', T(380, 146, '± 15 mV（交流，畫得比較大）', { cls: 'ta', fs: 13 })),
    [{ sub: '把二極體上的電壓畫成時間的圖：先是一條<b>直流</b>的線，0.677 V。', on: 'dc' },
     { sub: '上面騎著一個小小的<b>交流</b>：電壓在 0.677 V 上下來回 ±15 mV。', on: 'ac acl' }]);
  const K3 = sc('把電壓波形放到曲線下面', 'PUT v<sub>D</sub>(t) UNDER THE CURVE',
    FF(0.015),
    [{ sub: '右上是二極體曲線。直流 0.677 V 對到曲線上的 <b>Q 點</b>（2 mA）。', on: 'ax q' },
     { sub: '把剛剛的電壓波形<b>轉 90°</b>，畫在橫軸下面：越往下，時間越晚。它在 V<sub>DQ</sub> 左右來回。', on: 'vw vl' }]);
  const K4 = sc('每一刻往上找曲線 → 電流', 'READ THE CURRENT',
    FF(0.015),
    [{ sub: '電壓最大的那一刻：往上碰到曲線，再往左讀電流 —— 電流也最大。', on: 'ax q vw vl pj1' },
     { sub: '電壓最小的那一刻：電流也最小。', on: 'pj2' },
     { sub: '每一刻都這樣找，就畫出電流波形（畫在縱軸左邊，時間往左走）：電流在 2 mA 上下來回。', on: 'iw il' }]);
  const K5 = sc('先整理一下：交流在曲線上做什麼', 'LET\'S RECAP',
    FF(0.015),
    [{ sub: '先整理一下：交流讓工作的那個「點」，在 Q 附近<b>一小段曲線上來回滑</b>（加粗的那段）。', on: 'ax q vw iw seg' },
     { sub: '電壓晃一點 → 電流跟著晃一點。交流越小，用到的那一段就越短。接下來看：這一小段長什麼樣子？', on: '' }]);

  /* 07 那一小段幾乎是直的 */
  const A7 = sc('那一小段，幾乎是直的', 'THE PIECE IS ALMOST STRAIGHT',
    FF(0.015),
    [{ sub: '回到完整的圖：小交流只用到 Q 附近加粗的那一小段。', on: 'ax q vw iw seg' },
     { sub: '把 Q 點的<b>切線</b>（虛線）畫上去：那一小段跟切線幾乎<b>疊在一起</b>。', on: 'tg tgl' },
     { sub: '就像地球上的家門口：只看一小段，彎的看起來就是直的。' }]);

  /* 08 切線 = 電阻 */
  const A8 = sc('直線 = 電阻', 'A STRAIGHT LINE IS A RESISTOR',
    PC.svg + PC.curve(iv14, 0.55, 0.725, 'cv') + PC.dot(VQ, IQ, null, 6) +
    PC.seg(VQ - 0.025, IQ - SL * 0.025, VQ + 0.025, IQ + SL * 0.025, null, 'ln', ' style="stroke-width:2.4"') +
    g('tri', '<path class="lna dsh" style="fill:none" d="M' + PC.X(VQ) + ' ' + PC.Y(IQ) + ' H' + PC.X(VQ + 0.015) + ' V' + PC.Y(IQ + SL * 0.015) + '"/>' +
      T(PC.X(VQ + 0.0075), PC.Y(IQ) + 16, 'Δv', { cls: 'ta', fs: 13 }) + T(PC.X(VQ + 0.015) + 6, PC.Y(IQ + SL * 0.0075) + 4, 'Δi', { cls: 'ta', fs: 13, a: 'start' })) +
    calc(400, 120, 210, [['Δi = Δv / r<sub>d</sub>', 'r1', 'ta'], ['跟 I = V / R 一樣', 'r2', 'tm'], ['二極體 = 電阻 r<sub>d</sub>', 'r3', 'ta']], { k: 'cc' }) +
    chip(505, 280, 'r<sub>d</sub>：增量電阻', 'incremental resistance', 'c1', { fs: 13 }),
    [{ sub: '在這條直線上：電壓多 Δv，電流就多 Δi，兩個<b>成正比</b>。', on: 'tri cc r1' },
     { sub: '成正比 —— 這不就是歐姆定律 I = V/R 嗎？', on: 'r2' },
     { sub: '所以對交流來說，二極體就是<b>一顆電阻</b>，叫增量電阻 <b>r<sub>d</sub></b>（講義 1-3）。', on: 'r3 c1' }]);

  /* 09 先整理一下 */
  const A9 = sc('先整理一下', 'LET\'S RECAP',
    card(50, 112, 170, 130, 'A', T(135, 142, '① 直流', { fs: 16 }) + T(135, 174, '把二極體擺在', { cls: 'tm', fs: 13 }) + T(135, 198, 'Q 點', { cls: 'tm', fs: 13 }) + T(135, 226, '（水位）', { cls: 'ts', fs: 12 })) +
    card(235, 112, 170, 130, 'B', T(320, 142, '② 交流很小', { fs: 16 }) + T(320, 174, '只看 Q 旁邊一小段', { cls: 'tm', fs: 13 }) + T(320, 198, '曲線 ≈ 直線', { cls: 'tm', fs: 13 }) + T(320, 226, '（門口是平的）', { cls: 'ts', fs: 12 })) +
    card(420, 112, 170, 130, 'C', T(505, 142, '③ 二極體 = r<sub>d</sub>', { fs: 16, cls: 'ta' }) + T(505, 174, '對交流就是', { cls: 'tm', fs: 13 }) + T(505, 198, '一顆電阻', { cls: 'tm', fs: 13 }) + T(505, 226, '（小訊號模型）', { cls: 'ts', fs: 12 })) +
    chip(320, 280, '這套想法叫「小訊號分析」', 'small-signal analysis', 'c1', { fs: 13, acc: true }),
    [{ sub: '先整理一下。① 直流把二極體擺在 Q 點。', on: 'A' },
     { sub: '② 交流很小，只看 Q 點旁邊一小段，彎線可以當直線。', on: 'B' },
     { sub: '③ 所以對交流來說，二極體 = 一顆電阻 r<sub>d</sub>。這叫<b>小訊號分析</b>。接下來才上公式。', on: 'C c1' }]);

  /* 補課 D1～D4（使用者 10/31：為什麼要微分？微分後為什麼變成 I_DQ / V_T？） */
  const road = (d, key) => path(d, 'ln', key, 'stroke-width:3');
  const D1 = sc('先補課：斜率是什麼', 'WHAT IS A SLOPE',
    card(50, 112, 250, 160, 'A', T(175, 138, '直的坡道', { fs: 15 }) + road('M80 250 L270 170') +
      '<path class="lna dsh" style="fill:none" d="M140 225 H200 V199"/>' + T(170, 242, '走 Δx', { cls: 'tm', fs: 12 }) + T(206, 216, '爬 Δy', { cls: 'tm', fs: 12, a: 'start' }) + T(175, 264, '哪裡量都一樣', { cls: 'ta', fs: 12 })) +
    card(340, 112, 250, 160, 'B', T(465, 138, '彎的坡道', { fs: 15, cls: 'ta' }) + road('M370 255 C470 255 520 230 560 160') +
      g('pt', '<circle class="acc" cx="497" cy="236" r="5"/>' + '<line class="lna" x1="457" y1="250" x2="540" y2="220" style="stroke-width:2;stroke-dasharray:5 3"/>' + T(465, 264, '每一點的坡度都不同', { cls: 'ta', fs: 12 }))) +
    chip(320, 296, '「某一點的斜率」= 那一點的切線斜率 = 微分', '微分就是在問：在這一點，往前走一小步，爬多高？', 'c1', { fs: 13, acc: true }),
    [{ sub: '先補課：<b>斜率</b> = 爬多高 ÷ 走多遠。直的坡道，哪裡量都一樣。', on: 'A' },
     { sub: '彎的坡道不一樣：越往右越陡，每一點的坡度都不同。', on: 'B' },
     { sub: '想知道「某一點」有多陡，就只看那一點、往前走<b>一小步</b>。這件事的數學名字就叫<b>微分</b>。', on: 'pt c1' }]);
  const D2 = sc('不用微分也算得出來：多推 1 mV', 'JUST NUDGE IT',
    calc(90, 108, 460, [['Q 點：0.677 V → 2 mA', 'r1', 'tm'], ['多推 10 mV：電流多 0.938 mA → 93.8 mA/V', 'r2'], ['多推 1 mV：電流多 0.0784 mA → 78.4 mA/V', 'r3'], ['多推 0.1 mV：電流多 0.0077 mA → 77.1 mA/V', 'r4', 'ta'], ['一步越小，越接近 76.9 mA/V', 'r5', 'ta']], { k: 'cc', fs: 15, lh: 31 }),
    [{ sub: '回到二極體：Q 點是 0.677 V、2 mA。我們想知道「電壓多一點，電流多多少」。', on: 'cc r1' },
     { sub: '多推 10 mV，電流多 0.938 mA：斜率約 93.8 mA/V（一步太大，曲線已經彎了）。', on: 'r2' },
     { sub: '一步改小：1 mV → 78.4；0.1 mV → 77.1。', on: 'r3 r4' },
     { sub: '越小越穩定，最後停在 <b>76.9 mA/V</b>。微分只是把這一步取到「無限小」。', on: 'r5' }]);
  const D3 = sc('為什麼剛好是 I<sub>DQ</sub> ÷ 26 mV？', 'WHY I<sub>DQ</sub>/V<sub>T</sub>?',
    card(50, 112, 250, 140, 'A', T(175, 140, '像存款的利息', { fs: 15 }) + T(175, 170, '存款越多，利息越多', { cls: 'tm', fs: 13 }) + T(175, 196, '利息 = 存款 × 利率', { cls: 'ta', fs: 13 }) + T(175, 226, '（複利 = 指數成長）', { cls: 'ts', fs: 12 })) +
    card(340, 112, 250, 140, 'B', T(465, 140, '二極體電流', { fs: 15, cls: 'ta' }) + T(465, 170, '每多推 1 mV', { cls: 'tm', fs: 13 }) + T(465, 196, '電流多「現在的 1/26」', { cls: 'ta', fs: 13 }) + T(465, 226, '（不管現在是多少）', { cls: 'ts', fs: 12 })) +
    chip(320, 286, '斜率 = 現在的電流 × 1/26 mV = I<sub>DQ</sub> / V<sub>T</sub>', '2 mA ÷ 26 mV = 76.9 mA/V ✓', 'c1', { fs: 14, acc: true }),
    [{ sub: '指數有一個特性：<b>越多長越快</b>，像存款的利息 —— 存款越多，利息越多。', on: 'A' },
     { sub: '二極體電流是 e 的次方：每多推 1 mV，電流就多「現在電流的 1/26」（約 3.8%）。', on: 'B' },
     { sub: '所以斜率 = 現在的電流 ÷ 26 mV = <b>I<sub>DQ</sub>/V<sub>T</sub></b>。2 mA 代進去：76.9 mA/V，跟剛剛一步一步試出來的一樣。', on: 'c1' }]);
  const D4 = sc('先整理一下：r<sub>d</sub> 怎麼來', 'LET\'S RECAP',
    calc(110, 112, 420, [['斜率 = 那一點的 Δi/Δv（微分）', 'r1'], ['指數：斜率 = 電流 ÷ 26 mV = I<sub>DQ</sub>/V<sub>T</sub>', 'r2'], ['電阻 = 電壓 ÷ 電流 → 斜率倒過來', 'r3'], ['r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub>（2 mA → 13 Ω）', 'r4', 'ta']], { k: 'cc', fs: 15, lh: 32 }),
    [{ sub: '先整理一下：微分 = 那一點的斜率 = 電壓多一點、電流多多少。', on: 'cc r1' },
     { sub: '二極體是指數，所以斜率剛好 = 電流 ÷ 26 mV。', on: 'r2' },
     { sub: '電阻是「電壓 ÷ 電流」，剛好是斜率倒過來：<b>r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub></b>。下一幕用課本的寫法再看一次。', on: 'r3 r4' }]);

  /* 10 r_d 公式 */
  const A10 = sc('r<sub>d</sub> 多大？', 'HOW BIG IS r<sub>d</sub>?',
    calc(100, 112, 440, [['二極體：i<sub>D</sub> = I<sub>S</sub>e<sup>v<sub>D</sub>/V<sub>T</sub></sup>', 'r1'], ['切線斜率（微分）= I<sub>DQ</sub> / V<sub>T</sub>', 'r2', 'ta'], ['r<sub>d</sub> = V<sub>T</sub> / I<sub>DQ</sub> = 26 mV ÷ I<sub>DQ</sub>', 'r3', 'ta']], { k: 'cc', fs: 16, lh: 32 }) +
    chip(320, 270, '1 mA → 26 Ω', '電流加倍，r<sub>d</sub> 減半', 'c1', { fs: 14, acc: true }),
    [{ sub: 'r<sub>d</sub> 是切線斜率的倒數。斜率要對指數公式微分。', on: 'cc r1' },
     { sub: '微分 e 的次方會掉出一個 1/V<sub>T</sub>，剩下的剛好是 I<sub>DQ</sub>：斜率 = I<sub>DQ</sub>/V<sub>T</sub>。', on: 'r2' },
     { sub: '倒過來：<b>r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub></b>，就是 26 mV 除以 Q 點電流。', on: 'r3' },
     { sub: '好記的數字：<b>1 mA → 26 Ω</b>。', on: 'c1' }]);

  /* 11 Q 點換位置 */
  const PD = axes(80, 112, 290, 168, { v0: 0.6, v1: 0.75, i0: 0, i1: 10, vt: [[0.65, '0.65'], [0.7, '0.7']], it: [] });
  const tan = (I, key) => { const V = vq14(I), s = I / VT, dv = Math.min(0.03, 2.2 / s * 1.0 + 0.005); return PD.dot(V, I, key + 'd', 5.5) + PD.seg(V - dv, I - s * dv, V + dv, I + s * dv, key, 'lna', ' style="stroke-width:2"'); };
  const A11 = sc('Q 點越高，r<sub>d</sub> 越小', 'HIGHER Q, SMALLER r<sub>d</sub>',
    PD.svg + PD.curve(iv14, 0.6, 0.735, 'cv', 'ln') + tan(1, 't1') + tan(3, 't2') + tan(8, 't3') +
    calc(410, 120, 200, [['1 mA → 26 Ω', 'r1'], ['3 mA → 8.7 Ω', 'r2'], ['8 mA → 3.3 Ω', 'r3', 'ta']], { k: 'cc', title: 'r<sub>d</sub> = 26 mV ÷ I<sub>DQ</sub>' }) +
    chip(510, 280, '越陡 → 越好導電', '→ r<sub>d</sub> 越小', 'c1', { fs: 13 }),
    [{ sub: 'Q 點在 1 mA：切線還不太陡，r<sub>d</sub> = 26 Ω。', on: 'cv t1 t1d cc r1' },
     { sub: '3 mA：曲線更陡，r<sub>d</sub> = 8.7 Ω。', on: 't2 t2d r2' },
     { sub: '8 mA：幾乎垂直，r<sub>d</sub> 只剩 3.3 Ω。', on: 't3 t3d r3' },
     { sub: '所以 r<sub>d</sub> 不是固定的，它<b>跟著 Q 點走</b>（講義 1-3 NOTE）。這也是為什麼一定要先算直流。', on: 'c1' }]);

  /* 12 講義 1-12 */
  const A12 = sc('講義的例子：247 Ω', 'SLIDE 1-12',
    calc(100, 112, 440, [['I<sub>S</sub> = 10<sup>−14</sup> A、V<sub>DQ</sub> = 0.600 V', 'r1', 'tm'], ['I<sub>DQ</sub> = 10<sup>−14</sup> e<sup>0.6/0.026</sup> = 105.24 μA', 'r2'], ['微分：g<sub>d</sub> = 4.048 mA/V → r<sub>d</sub> = 247 Ω', 'r3', 'ta'], ['近似：0.026 ÷ 105.24 μA = 247 Ω ✓', 'r4', 'ta']], { k: 'cc', fs: 15, lh: 31 }) +
    chip(320, 286, 'MATCHED!!', '兩種算法同一個答案', 'c1', { fs: 14, acc: true }),
    [{ sub: '講義 1-12 的例子：I<sub>S</sub> = 10<sup>−14</sup> A，停在 0.6 V。', on: 'cc r1' },
     { sub: '先算 Q 點電流：<b>105.24 μA</b>。', on: 'r2' },
     { sub: '老老實實微分：g<sub>d</sub> = 4.048 mA/V，倒數 <b>247 Ω</b>。', on: 'r3' },
     { sub: '用 26 mV ÷ I<sub>DQ</sub> 一行就得到一樣的答案。考試用這個。', on: 'r4 c1' }]);

  /* 補課 E1～E3（使用者 10/31：r_d 跟 PART 5 的 r_f 什麼關係？） */
  const PF = axes(80, 112, 300, 168, { v0: 0.58, v1: 0.75, i0: 0, i1: 10, vt: [[0.62, 'V<sub>γ</sub>'], [0.7, '0.7']], it: [] });
  const tanAt = (I, key) => { const V = vq14(I), s = I / VT, dv = Math.min(0.03, 4 / s); return g(key, PF.dot(V, I, null, 5.5) + PF.seg(V - dv, I - s * dv, V + dv, I + s * dv, null, 'lna', ' style="stroke-width:2.2;stroke-dasharray:6 3"')); };
  const E1 = sc('r<sub>d</sub> 跟 PART 5 的 r<sub>f</sub> 一樣嗎？', 'r<sub>d</sub> VS r<sub>f</sub>',
    PF.svg + PF.curve(iv14, 0.58, 0.725, 'cv', 'ln') +
    g('pw', PF.seg(0.58, 0, 0.62, 0, null, 'lna', ' style="stroke-width:3.4"') + PF.seg(0.62, 0, 0.72, 10, null, 'lna', ' style="stroke-width:3.4"') + T(PF.X(0.66) - 6, PF.Y(5.5), 'r<sub>f</sub>：一條線用到底', { cls: 'ta', fs: 12.5, a: 'end' })) +
    tanAt(0.5, 't1') + tanAt(5, 't2') +
    calc(410, 120, 200, [['片段線性 r<sub>f</sub> = 10 Ω', 'r1', 'ta'], ['0.5 mA：r<sub>d</sub> = 52 Ω', 'r2'], ['5 mA：r<sub>d</sub> = 5.2 Ω', 'r3']], { k: 'cc', fs: 14 }),
    [{ sub: '都是「斜率倒過來」的小電阻，可是<b>不是同一個東西</b>。先看 PART 5 的 r<sub>f</sub>：', on: 'cv' },
     { sub: '片段線性用<b>一條斜線</b>描整段導通的曲線，斜率 1/r<sub>f</sub>，一條線用到底（這裡 10 Ω）。', on: 'pw cc r1' },
     { sub: 'r<sub>d</sub> 是 <b>Q 點那一點的切線</b>：0.5 mA 時很平（52 Ω），5 mA 時很陡（5.2 Ω）—— 跟著 Q 點變。', on: 't1 t2 r2 r3' }]);
  const E2 = sc('像爬山：平均坡度 vs 腳下的坡度', 'AVERAGE VS LOCAL',
    card(50, 112, 250, 150, 'A', T(175, 140, 'r<sub>f</sub>：整條步道的平均坡度', { fs: 14 }) + T(175, 170, '算「從山腳走到哪」', { cls: 'tm', fs: 13 }) + T(175, 196, '→ 直流：找 Q 點', { cls: 'ta', fs: 13 }) + T(175, 224, '搭配 V<sub>γ</sub> 電池、題目給定', { cls: 'ts', fs: 12 })) +
    card(340, 112, 250, 150, 'B', T(465, 140, 'r<sub>d</sub>：腳下這一步的坡度', { fs: 14, cls: 'ta' }) + T(465, 170, '算「站在這裡晃一下」', { cls: 'tm', fs: 13 }) + T(465, 196, '→ 交流：小訊號', { cls: 'ta', fs: 13 }) + T(465, 224, '= 26 mV ÷ I<sub>DQ</sub>，跟 Q 點變', { cls: 'ts', fs: 12 })),
    [{ sub: '想成爬山。<b>r<sub>f</sub></b> 像整條步道的平均坡度：用來算「從山腳走到哪」—— 直流，找 Q 點。', on: 'A' },
     { sub: '<b>r<sub>d</sub></b> 像你腳下這一步的坡度：用來算「站在這裡前後晃一下」—— 交流，小訊號。', on: 'B' }]);
  const E3 = sc('先整理一下：兩顆小電阻', 'LET\'S RECAP',
    calc(90, 112, 460, [['直流（找 Q 點）：二極體 = V<sub>γ</sub> 電池（＋ r<sub>f</sub>）', 'r1'], ['交流（Q 點旁邊晃）：二極體 = r<sub>d</sub>（沒有電池）', 'r2', 'ta'], ['r<sub>f</sub>：題目給、固定；r<sub>d</sub>：26 mV ÷ I<sub>DQ</sub>', 'r3'], ['交流只看「變化」，固定的 V<sub>γ</sub> 不會變 → 不見了', 'r4', 'tm']], { k: 'cc', fs: 15, lh: 32 }),
    [{ sub: '先整理一下。找 Q 點（直流）：用 PART 5 的 V<sub>γ</sub> 電池（有給 r<sub>f</sub> 就加上）。', on: 'cc r1' },
     { sub: '看 Q 點旁邊的交流：二極體只剩一顆 r<sub>d</sub>。', on: 'r2' },
     { sub: 'r<sub>f</sub> 是題目給的固定值；r<sub>d</sub> 要用 Q 點電流算。', on: 'r3' },
     { sub: '為什麼交流裡沒有 V<sub>γ</sub> 電池？交流只看「變化」，固定不變的 0.6 V 對變化沒有貢獻。', on: 'r4' }]);

  /* 13 拆開算：記帳比喻 */
  const A13 = sc('兩種電一起很亂：分開算', 'SPLIT IT',
    card(70, 120, 200, 100, 'A', T(170, 152, '固定薪水', { fs: 16 }) + T(170, 180, '每個月一樣', { cls: 'tm', fs: 13 }) + T(170, 204, '（像直流）', { cls: 'ts', fs: 12 })) +
    card(370, 120, 200, 100, 'B', T(470, 152, '打工收入', { fs: 16, cls: 'ta' }) + T(470, 180, '一直在變', { cls: 'tm', fs: 13 }) + T(470, 204, '（像交流）', { cls: 'ts', fs: 12 })) +
    T(320, 178, '＋', { cls: 'ta', fs: 30, k: 'plus' }) +
    chip(320, 270, '分開記，月底再加起來', 'DC 電路、AC 電路分開算，最後相加', 'c1', { fs: 14, acc: true }),
    [{ sub: '直流和交流一起在電路裡跑，一起算很亂。', on: '' },
     { sub: '像記帳：固定薪水和打工收入<b>分開記</b>。', on: 'A B plus' },
     { sub: '月底再加起來就是總收入。電路也一樣：<b>DC 電路</b>、<b>AC 電路</b>各算各的，最後相加。', on: 'c1' }]);

  /* 14 DC 電路 */
  const A14 = sc('第一張：DC 電路', 'THE DC CIRCUIT',
    Q.c111(150, 140, 150, 140, 'dc', { k: 'cir', vps: '5 V', r: '5 kΩ' }) +
    calc(380, 118, 230, [['交流源 → 0 V → 短路', 'r1', 'tm'], ['二極體 → 0.6 V 電池', 'r2', 'tm'], ['I<sub>DQ</sub> = (5 − 0.6)/5k = 0.88 mA', 'r3', 'ta'], ['V<sub>O</sub> = 0.88 × 5 = 4.4 V', 'r4', 'ta']], { k: 'cc', fs: 14 }),
    [{ sub: 'DC 電路：把交流源歸零。電壓源是 0 V，等於一條<b>導線</b>（短路）。', on: 'cir cc r1' },
     { sub: '二極體用直流的模型：<b>0.6 V 電池</b>。', on: 'r2' },
     { sub: '一條 KVL：I<sub>DQ</sub> = 4.4 V ÷ 5 kΩ = <b>0.88 mA</b>，V<sub>O</sub> = <b>4.4 V</b>。這是水位。', on: 'r3 r4' }]);

  /* 15 AC 電路規則 */
  const A15 = sc('第二張：AC 電路', 'THE AC CIRCUIT',
    Q.c111(150, 140, 150, 140, 'ac', { k: 'cir', vi: '0.1 sin ωt', r: '5 kΩ', rd: 'r<sub>d</sub>' }) +
    calc(380, 118, 230, [['直流 5 V 永遠不變', 'r1', 'tm'], ['變化量 = 0 → 短路', 'r2', 'ta'], ['叫「交流接地」', 'r3', 'tm'], ['二極體 → r<sub>d</sub> = 29.5 Ω', 'r4', 'ta']], { k: 'cc', fs: 14 }),
    [{ sub: 'AC 電路：交流只看「變化量」。5 V 電池永遠是 5 V，變化量是 0。', on: 'cir cc r1' },
     { sub: '變化量 0 的電壓源 = 一條導線。所以它被<b>短路</b>，叫<b>交流接地</b>。', on: 'r2 r3' },
     { sub: '二極體換成 r<sub>d</sub>：Q 點 0.88 mA → r<sub>d</sub> = 26 mV ÷ 0.88 mA = <b>29.5 Ω</b>。', on: 'r4' }]);

  /* 16 AC 計算 */
  const A16 = sc('算交流', 'SOLVE THE AC',
    Q.c111(150, 140, 150, 140, 'ac', { k: 'cir', vi: '0.1 sin ωt', r: '5 kΩ', rd: '29.5 Ω' }) +
    calc(380, 118, 230, [['0.1 = i<sub>d</sub>(29.5 + 5000)', 'r1'], ['i<sub>d</sub> = 19.9 μA', 'r2', 'ta'], ['v<sub>o</sub> = i<sub>d</sub> × 5k = 0.0995 V', 'r3', 'ta']], { k: 'cc', fs: 14 }) +
    chip(495, 270, 'r<sub>d</sub> ≪ R', '交流幾乎全部到輸出', 'c1', { fs: 13, acc: true }),
    [{ sub: 'r<sub>d</sub> 跟 R 串聯，一條 KVL。', on: 'cir cc r1' },
     { sub: 'i<sub>d</sub> = 0.1 V ÷ 5029.5 Ω = <b>19.9 μA</b>。', on: 'r2' },
     { sub: 'v<sub>o</sub> = 19.9 μA × 5 kΩ = <b>0.0995 V</b>：r<sub>d</sub> 很小，交流幾乎都到了輸出。', on: 'r3 c1' }]);

  /* 17 合起來 */
  const A17 = sc('月底加起來', 'ADD THEM UP',
    '<line class="ln2 dsh" x1="80" y1="190" x2="580" y2="190"' + K.k('dc') + '/>' + T(84, 180, 'V<sub>O</sub> = 4.4 V（直流）', { cls: 'tm', fs: 13, a: 'start', k: 'dcl' }) +
    sine(80, 190, 500, 26, { k: 'ac' }) + T(576, 156, '± 0.0995 V（放大畫）', { cls: 'ta', fs: 12, a: 'end', k: 'acl' }) +
    chip(320, 280, 'v<sub>O</sub>(t) = 4.4 + 0.0995 sin ωt V', '總量 = 直流 + 交流', 'c1', { fs: 14, acc: true }),
    [{ sub: '直流：一條 4.4 V 的水平線（水位）。', on: 'dc dcl' },
     { sub: '交流：在上面晃 ±0.0995 V（波浪）。', on: 'ac acl' },
     { sub: '加起來就是輸出。', on: 'c1' }]);

  /* 18 為什麼能加 */
  const A18 = sc('為什麼可以直接加？', 'WHY CAN WE ADD?',
    card(70, 116, 230, 120, 'A', T(185, 146, '整條曲線', { fs: 16 }) + T(185, 176, '彎的 → 非線性', { cls: 'tm', fs: 13 }) + T(185, 204, '不能疊加', { cls: 'ts', fs: 13 })) +
    card(340, 116, 230, 120, 'B', T(455, 146, 'Q 點旁邊一小段', { fs: 16, cls: 'ta' }) + T(455, 176, '直的 → 線性（r<sub>d</sub>）', { cls: 'tm', fs: 13 }) + T(455, 204, '可以疊加 ✓', { cls: 'ta', fs: 13 })) +
    chip(320, 278, '前提：交流要夠小', '講義 1-8', 'c1', { fs: 13 }),
    [{ sub: '整條二極體曲線是彎的，本來不能把兩個電源的結果直接相加。', on: 'A' },
     { sub: '可是在 Q 點旁邊一小段，二極體就是一顆固定的 r<sub>d</sub> —— 電路變成<b>線性</b>的，才可以加（講義 1-8）。', on: 'B' },
     { sub: '所以一切的前提：<b>交流要夠小</b>。不夠小會怎樣？', on: 'c1' }]);

  /* 19 交流太大 ①：非線性（同一張完整的圖，交流放大到 ±30 mV） */
  const A19 = sc('交流太大 ①：上下不對稱', 'TOO BIG: DISTORTION',
    FF(0.03, { extra: g('cv2', T(56, 124, '+4.3 mA', { cls: 'ta', fs: 12, a: 'start' }) + T(56, 214, '−1.4 mA', { cls: 'tm', fs: 12, a: 'start' })) }),
    [{ sub: '同一張圖，把交流加大到 ±30 mV：用到的那一段變長了（加粗那段）。', on: 'ax q vw vl seg' },
     { sub: '往上那邊曲線很陡、往下那邊很平：電流往上衝 <b>+4.3 mA</b>，往下只掉 <b>1.4 mA</b> —— <b>不對稱</b>。', on: 'pj1 pj2 iw il cv2' },
     { sub: '走太遠，地面就看得出是彎的。這叫<b>非線性失真</b>，r<sub>d</sub> 不能用了。' }]);

  /* 20 交流太大 ②：截止 */
  const clipD = wavePath(80, 240, 480, 1, u => Math.max(0, 0.6 + 1.0 * Math.sin(u * 4 * Math.PI) - 0.0) * 70);
  const A20 = sc('交流太大 ②：被削掉', 'TOO BIG: CLIPPING',
    '<line class="ln2" x1="80" y1="240" x2="570" y2="240"/>' +
    path(wavePath(80, 240, 480, 1, u => (0.6 + 1.0 * Math.sin(u * 4 * Math.PI)) * 70), 'ln dsh', 'in', 'stroke-width:1.8') +
    path(clipD, 'lna', 'out', 'stroke-width:2.8') +
    T(84, 292, '虛線：沒被削的話', { cls: 'tm', fs: 12, a: 'start', k: 'il' }) +
    chip(470, 290, '谷底推不開門 → 二極體 OFF', '輸出被削成 0：截止失真', 'c1', { fs: 13, acc: true }),
    [{ sub: '另一種狀況：直流（水位）太低、交流太大。', on: 'in il' },
     { sub: '負半週的谷底，總推力不到 0.6 V，二極體被推到 <b>OFF</b>，輸出被削成 0。', on: 'out' },
     { sub: '這叫<b>截止失真</b>（講義 1-9）。解法：把 Q 點擺高一點、交流小一點 —— 這就是 Q 點設計。', on: 'c1' }]);

  /* 21 先整理：流程 */
  const A21 = sc('先整理一下：解題流程', 'THE RECIPE',
    calc(110, 108, 420, [['① DC：交流源歸零、二極體 = V<sub>γ</sub> → I<sub>DQ</sub>', 'r1'], ['② r<sub>d</sub> = 26 mV ÷ I<sub>DQ</sub>', 'r2', 'ta'], ['③ AC：直流源短路、二極體 = r<sub>d</sub> → 交流', 'r3'], ['④ 總量 = 直流 + 交流', 'r4', 'ta'], ['⑤ 檢查：二極體上的交流 ≪ 26 mV', 'r5', 'tm']], { k: 'cc', fs: 15, lh: 31 }),
    [{ sub: '先整理一下，拿到這種題目的步驟（講義 1-10）：① 先做 DC，找 Q 點。', on: 'cc r1' },
     { sub: '② 用 Q 點算 r<sub>d</sub>。', on: 'r2' },
     { sub: '③ 再做 AC，二極體換成 r<sub>d</sub>。', on: 'r3' },
     { sub: '④ 加起來。⑤ 最後檢查交流夠不夠小。', on: 'r4 r5' }]);

  /* 22 恍然大悟 */
  const A22 = sc('恍然大悟', 'THE ANSWER',
    T(320, 200, '?', { cls: 'ta', fs: 100, k: 'q' }) +
    card(70, 104, 236, 130, 'L', T(188, 132, '二極體上的交流', { fs: 15 }) + T(188, 160, '19.9 μA × 29.5 Ω', { cls: 'tm', fs: 13 }) + T(188, 188, '≈ 0.59 mV', { cls: 'ta', fs: 16 }) + T(188, 214, '≪ 26 mV：真的很小', { cls: 'ts', fs: 12 })) +
    card(334, 104, 236, 130, 'R', T(452, 132, '輸出的交流', { fs: 15 }) + T(452, 160, 'v<sub>o</sub> = 0.0995 sin ωt V', { cls: 'tm', fs: 13 }) + T(452, 188, '幾乎沒被扭曲', { cls: 'ta', fs: 16 }) + T(452, 214, '因為 r<sub>d</sub> ≪ R', { cls: 'ts', fs: 12 })) +
    chip(320, 266, '答案：0.0995 V ✓', '彎的二極體，對小交流就是一顆 29.5 Ω 的電阻', 'ans', { fs: 13, acc: true }),
    [{ sub: '回到開頭：彎的二極體，會不會把 0.1 V 的交流扭曲？', on: 'q' },
     { sub: '二極體兩端只分到 <b>0.59 mV</b> 的交流，遠小於 26 mV：在曲線上只晃一點點，那一段是直的。', off: 'q', on: 'L' },
     { sub: '所以它就是一顆 29.5 Ω 的電阻，輸出 <b>0.0995 sin ωt V</b>，幾乎原封不動。', on: 'R' },
     { sub: '<b>謎題解開了。</b>', on: 'ans' }]);

  /* 23 預告 */
  const A23 = sc('還沒完：頻率變高呢？', 'WHAT\'S NEXT',
    card(80, 116, 220, 110, 'A', T(190, 148, '頻率拉到 100 MHz', { fs: 15 }) + T(190, 178, '二極體還是 r<sub>d</sub> 嗎？', { cls: 'tm', fs: 13 })) +
    card(340, 116, 220, 110, 'B', T(450, 148, '開關切得很快', { fs: 15 }) + T(450, 178, '二極體馬上關得掉嗎？', { cls: 'tm', fs: 13 })) +
    chip(320, 262, '下一頁 PART 7 的故事', '答案是同一個：倉庫', 'c1', { fs: 13, acc: true }),
    [{ sub: '可是小訊號模型還漏了一件事：<b>頻率</b>。', on: 'A' },
     { sub: '還有：二極體當開關，切得很快的時候呢？', on: 'B' },
     { sub: '這兩題的答案是同一個東西。先看完第 01～04 節，再去 PART 7。', on: 'c1' }]);

  window.__ch1p6Story = window.__Story('#story', {
    id: 'ch1-part6', title: 'CH1 PART 6 故事一：小訊號', after: '#map',
    scenes: [A0, A1, A2, A3, A4, A5, K1, K2, K3, K4, K5, A6, A7, A8, A9, D1, D2, D3, D4, A10, A11, A12, E1, E2, E3, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23]
  });
})();
