/* ============================================================
   電子實習 第三章 二極體特性 —— 故事模式
   主線謎題（使用者 9/23 結報的數字）：順偏電流 0.1 → 10 mA（100 倍），電壓只從 0.494 → 0.704 V；
   反偏加到 30 V，電流卻只有 0.003 mA。為什麼這麼不對稱？
   比喻：二極體＝單向旋轉門；切入電壓＝門檻；指數＝每多 0.1 V 電流 ×10。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const card = (x, y, w, h) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"/>';
  const path = (d, cls, key, extra) => '<path class="' + cls + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  const sc = (t, en, svg, steps) => ({ t, en, svg, steps });

  /* 使用者的量測（9/23，1N4004、R = 1 kΩ） */
  const FW = [[0.494, 0.1041], [0.515, 0.1767], [0.562, 0.5012], [0.596, 1.0229], [0.650, 3.095], [0.675, 5.1043], [0.704, 10.05]];
  /* 水平二極體（往右導通） */
  const diode = (x, y, cls) => '<path class="' + (cls === 'a' ? 'accw' : 'bgw') + '" style="stroke:' + (cls === 'a' ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:2" d="M' + (x - 12) + ' ' + (y - 13) + ' V' + (y + 13) + ' L' + (x + 12) + ' ' + y + ' Z"/>' +
    '<line class="' + (cls === 'a' ? 'lna' : 'ln') + '" x1="' + (x + 12) + '" y1="' + (y - 13) + '" x2="' + (x + 12) + '" y2="' + (y + 13) + '" style="stroke-width:2.8"/>';
  const resH = (x, y, len) => { const s = (len - 40) / 2; let d = 'M' + x + ' ' + y + ' H' + (x + s); for (let i = 1; i <= 6; i++) d += ' L' + (x + s + i * 40 / 6 - 3.3) + ' ' + (y + (i % 2 ? -7 : 7)); d += ' L' + (x + s + 40) + ' ' + y + ' H' + (x + len); return path(d, 'ln'); };
  const bat = (x, y, flip) => { const a = flip ? 6 : -6; return '<line class="ln" x1="' + (x - 16) + '" y1="' + (y + a) + '" x2="' + (x + 16) + '" y2="' + (y + a) + '"/><line class="ln" x1="' + (x - 9) + '" y1="' + (y - a) + '" x2="' + (x + 9) + '" y2="' + (y - a) + '" style="stroke-width:3.4"/>'; };
  /* 迴路：左電池、上電阻、右二極體（rev：反接） */
  function loop(x0, y0, w, h, opt) {
    opt = opt || {};
    const x1 = x0 + w, y1 = y0 + h, ym = (y0 + y1) / 2, xd = x0 + w * 0.68;
    let s = path('M' + x0 + ' ' + (ym - 8) + ' V' + y0 + ' H' + (x0 + w * 0.12) + ' M' + (x0 + w * 0.42) + ' ' + y0 + ' H' + (xd - 14) + ' M' + (xd + 14) + ' ' + y0 + ' H' + x1 + ' V' + y1 + ' H' + x0 + ' V' + (ym + 8), 'ln');
    s += bat(x0, ym) + T(x0 - 22, ym + 5, opt.v || 'V', { cls: 't', fs: 14, a: 'end' });
    s += resH(x0 + w * 0.12, y0, w * 0.3) + T(x0 + w * 0.27, y0 - 14, opt.r || 'R = 1 kΩ', { cls: 't', fs: 13 });
    s += opt.rev ? '<g transform="rotate(180 ' + xd + ' ' + y0 + ')">' + diode(xd, y0, opt.a) + '</g>' : diode(xd, y0, opt.a);
    s += T(xd, y0 - 22, opt.rev ? 'K　　A' : 'A　　K', { cls: 'tm', fs: 12 });
    return s;
  }
  function ax(x0, y0, w, h, xl, yl, key) {
    return g(key, arrow(x0, y0 + h, x0 + w + 10, y0 + h, null, 'ln') + arrow(x0, y0 + h, x0, y0 - 10, null, 'ln') +
      T(x0 + w + 10, y0 + h + 18, xl, { cls: 'tm', fs: 12, a: 'end' }) + T(x0 + 8, y0 - 4, yl, { cls: 'tm', fs: 12, a: 'start' }));
  }

  /* ════════════ 00 謎題 1：順偏 ════════════ */
  const meter = (x, y, top, big, key, acc) => g(key, '<rect class="bgw" x="' + (x - 78) + '" y="' + (y - 34) + '" width="156" height="68" rx="10"/>' + T(x, y - 12, top, { cls: 'tm', fs: 12 }) + T(x, y + 16, big, { cls: acc ? 'ta' : 't', fs: 20 }));
  const S0 = sc('電流變 100 倍，電壓只多一點點', 'THE PUZZLE',
    meter(180, 160, '電流 A1', '0.1 mA', 'a1') + meter(180, 160, '電流 A1', '10 mA', 'a2', true) +
    meter(460, 160, '二極體電壓 Vd', '0.494 V', 'v1') + meter(460, 160, '二極體電壓 Vd', '0.704 V', 'v2', true) +
    g('ar', arrow(268, 160, 372, 160, null, 'ln')) +
    chip(320, 262, '電流 × 100，電壓只多 0.21 V', '這是你 9/23 量到的 1N4004', 'q', { fs: 13, acc: true }),
    [{ sub: '這是你 9/23 的實驗：1N4004 順向接，先調到電流 <b>0.1 mA</b>。', on: 'a1 ar' },
     { sub: '二極體兩端量到 <b>0.494 V</b>。', on: 'v1' },
     { sub: '把電流調到 <b>10 mA</b> —— 變成 100 倍。', off: 'a1', on: 'a2' },
     { sub: '電壓只變成 <b>0.704 V</b>，多 0.21 V 而已。電阻可不是這樣的。', off: 'v1', on: 'v2 q' }]);

  /* ════════════ 01 謎題 2：反偏 ════════════ */
  const S1 = sc('反過來加 30 V，幾乎沒電流', 'THE OTHER WAY',
    meter(180, 160, '反向電壓', '30 V', 'v') + meter(460, 160, '電流 A1', '0.003 mA', 'i', true) + g('ar', arrow(268, 160, 372, 160, null, 'ln')) +
    chip(320, 262, '順向 0.7 V 就有 10 mA；反向 30 V 只有 0.003 mA', '同一顆二極體，為什麼差這麼多？', 'q', { fs: 13, acc: true }),
    [{ sub: '再把二極體<b>反過來</b>接。電壓從 5 V 開始加。', on: 'ar' },
     { sub: '一路加到 <b>30 V</b>。', on: 'v' },
     { sub: '電流只有 <b>0.003 mA</b>，幾乎是 0。', on: 'i' },
     { sub: '順著接 0.7 V 就 10 mA，反著接 30 V 卻沒電流。<b>這顆元件到底在幹嘛？</b>', on: 'q' }]);

  /* ════════════ 02 單向旋轉門 ════════════ */
  const S2 = sc('二極體＝單向旋轉門', 'A ONE-WAY TURNSTILE',
    g('door', '<rect class="bgw" x="290" y="120" width="60" height="150" rx="8"/>' + path('M300 195 H340 M320 140 V250', 'ln', null, 'stroke-width:3')) +
    g('in', arrow(150, 170, 280, 170, null, 'lna') + T(150, 156, '這個方向：推得過', { cls: 'ta', fs: 13, a: 'start' }) + '<circle class="e" cx="190" cy="170" r="8"/><circle class="e" cx="225" cy="170" r="8"/><circle class="e" cx="400" cy="170" r="8"/>') +
    g('out', arrow(490, 230, 360, 230, null, 'ln') + T(490, 258, '反方向：卡住', { fs: 13, a: 'end' }) + path('M370 216 L398 244 M398 216 L370 244', 'ln', null, 'stroke-width:3')) +
    chip(320, 300, '電流只能單方向流動（講義 p.2）', null, 'c1', { fs: 13 }),
    [{ sub: '把二極體想成捷運站的<b>單向旋轉門</b>。', on: 'door' },
     { sub: '從這邊推，門會轉，人（電流）過得去。', on: 'in' },
     { sub: '從另一邊推，門卡住，誰都過不去。', on: 'out' },
     { sub: '講義 p.2：二極體是<b>允許電流單方向流動</b>的雙端元件。', on: 'c1' }]);

  /* ════════════ 03 P、N、陽極、陰極 ════════════ */
  const S3 = sc('長相：P、N、陽極、陰極', 'ANODE AND CATHODE',
    g('pn', '<rect class="bgw" x="110" y="130" width="100" height="70"/><rect class="bgw" x="210" y="130" width="100" height="70"/>' + T(160, 170, 'P', { fs: 22 }) + T(260, 170, 'N', { fs: 22 }) + path('M60 165 H110 M310 165 H360', 'ln')) +
    g('sym', diode(470, 165) + path('M410 165 H458 M482 165 H540', 'ln')) +
    T(160, 230, '陽極 A（+）', { cls: 'ta', fs: 14, k: 'la' }) + T(260, 230, '陰極 K（−）', { fs: 14, k: 'lk' }) +
    g('real', '<rect class="bgw" x="400" y="215" width="110" height="34" rx="8"/><rect class="acc" x="486" y="215" width="12" height="34"/>' + path('M360 232 H400 M510 232 H560', 'ln') + T(492, 272, '有環那端＝陰極', { cls: 'ta', fs: 12.5 })),
    [{ sub: '裡面是一塊 <b>P 型</b>接一塊 <b>N 型</b>半導體（電子學 CH1 的 pn 接面）。', on: 'pn' },
     { sub: 'P 那端叫<b>陽極 A</b>，N 那端叫<b>陰極 K</b>。', on: 'la lk' },
     { sub: '電路符號：三角形指的方向就是電流能走的方向，那條槓是陰極。', on: 'sym' },
     { sub: '實物上<b>有色環的那端是陰極</b>。接線時先找這條環。', on: 'real' }]);

  /* ════════════ 04 順偏 ════════════ */
  const S4 = sc('順著接：順偏', 'FORWARD BIAS',
    loop(110, 130, 360, 140, { v: 'V', a: 'a' }) +
    g('i', arrow(200, 116, 280, 116, null, 'lna') + T(240, 104, 'I', { cls: 'ta', fs: 15 })) +
    T(355, 160, '+ V<sub>D</sub> −', { cls: 'ta', fs: 13, k: 'vd' }) +
    chip(480, 300, 'I = (V − V<sub>D</sub>) / R', '講義 p.3 圖 3.4(a)', 'c1', { fs: 13, acc: true }),
    [{ sub: '<b>順偏</b>：陽極接電源正、陰極接負 —— 順著旋轉門的方向推。', on: 'vd' },
     { sub: '電流流得過去。', on: 'i' },
     { sub: '電阻上的電壓 = V − V<sub>D</sub>，所以 <b>I = (V − V<sub>D</sub>)/R</b>（講義 p.3）。', on: 'c1' },
     { sub: '那顆 1 kΩ 是<b>限流電阻</b>：二極體一導通幾乎不擋電流，沒有它電流會衝到燒掉。' }]);

  /* ════════════ 05 反偏 ════════════ */
  const S5 = sc('反著接：反偏', 'REVERSE BIAS',
    loop(110, 130, 360, 140, { v: 'V', rev: true }) +
    T(355, 160, '− V<sub>D</sub> +', { cls: 'ta', fs: 13, k: 'vd' }) +
    g('x', path('M226 104 L254 128 M254 104 L226 128', 'lna', null, 'stroke-width:3') + T(240, 96, 'I = 0', { cls: 'ta', fs: 14 })) +
    chip(480, 300, '電阻沒電流 → 沒壓降 → V<sub>D</sub> = V', '講義 p.3 圖 3.4(b)', 'c1', { fs: 13, acc: true }),
    [{ sub: '<b>反偏</b>：陰極接正、陽極接負 —— 反方向推旋轉門。', on: 'vd' },
     { sub: '門卡住，<b>電流 ≈ 0</b>。', on: 'x' },
     { sub: '電阻沒有電流就沒有壓降，所以<b>電源電壓全部落在二極體上</b>：V<sub>D</sub> = V。', on: 'c1' },
     { sub: '你的數據：Vi = 20 V 時 Vd = 19.997 V，一模一樣。' }]);

  /* ════════════ 06 曲線 ════════════ */
  const S6 = sc('畫成一張圖：V-I 特性曲線', 'THE V-I CURVE',
    ax(130, 110, 400, 180, 'V', 'I', 'axs') +
    path('M130 250 H400 C420 250 430 240 440 200 L452 110', 'lna', 'fw', 'stroke-width:3') +
    path('M330 250 H140', 'lna', 'rv', 'stroke-width:3') +
    '<line class="ln2" x1="330" y1="110" x2="330" y2="290"' + k('y') + '/>' +
    chip(470, 150, '順偏：過門檻後往上衝', null, 'c1', { fs: 12.5 }) +
    chip(230, 220, '反偏：貼著 0（−I<sub>S</sub>）', null, 'c2', { fs: 12.5 }),
    [{ sub: '把「加多少電壓 → 流多少電流」畫成一張圖，就是 <b>V-I 特性曲線</b>（講義 p.4）。', on: 'axs y' },
     { sub: '右邊順偏：一開始幾乎沒電流，過了某個電壓突然往上衝。', on: 'fw c1' },
     { sub: '左邊反偏：一直貼著 0，只有極小的<b>逆向飽和電流 I<sub>S</sub></b>。', on: 'rv c2' },
     { sub: '這張圖就是旋轉門的「個性表」。' }]);

  /* ════════════ 07 切入電壓 ════════════ */
  const S7 = sc('門檻：切入電壓', 'CUT-IN VOLTAGE',
    ax(130, 110, 400, 180, 'V', 'I', 'axs') +
    path('M130 280 H300 C315 280 322 270 330 230 L340 110', 'lna', 'ge', 'stroke-width:3') +
    path('M130 280 H420 C435 280 442 270 450 230 L460 110', 'ln', 'si', 'stroke-width:3') +
    '<line class="ln2 dsh" x1="322" y1="110" x2="322" y2="290"' + k('l1') + '/>' + T(322, 306, '0.2 V', { cls: 'ta', fs: 12, k: 't1' }) +
    '<line class="ln2 dsh" x1="442" y1="110" x2="442" y2="290"' + k('l2') + '/>' + T(442, 306, '0.6 V', { fs: 12, k: 't2' }) +
    T(300, 150, '鍺 Ge', { cls: 'ta', fs: 14, a: 'end', k: 'tg' }) + T(480, 150, '矽 Si', { fs: 14, a: 'start', k: 'ts' }) +
    chip(230, 190, '像門檻：要推過才走得動', null, 'c1', { fs: 12.5 }),
    [{ sub: '曲線開始往上衝的那個電壓叫<b>切入電壓 V<sub>r</sub></b>，像門口的門檻。', on: 'axs si c1' },
     { sub: '<b>矽</b>二極體約 <b>0.6 V</b>（講義 p.4）。', on: 'l2 t2 ts' },
     { sub: '<b>鍺</b>二極體門檻比較低，約 <b>0.2 V</b>。', on: 'ge l1 t1 tg' },
     { sub: '你的 1N4004 是矽：0.596 V 時剛好 1 mA，之後電流衝很快 —— 對得上。' }]);

  /* ════════════ 08 指數：每多約 0.1 V × 10 ════════════ */
  const X0 = 130, Y0 = 112, W = 300, H = 170;
  const XV = v => X0 + (v - 0.45) / 0.3 * W, YL = i => Y0 + H - (Math.log10(i) + 1.2) / 2.4 * H;
  const S8 = sc('你的數據：每多 0.1 V，電流 × 10', 'TEN TIMES PER 0.1 V',
    ax(X0, Y0, W, H, 'V<sub>d</sub>（V）', 'A1（mA，對數）', 'axs') +
    [0.1, 1, 10].map(i => '<line class="ln2 dsh" x1="' + X0 + '" y1="' + YL(i).toFixed(1) + '" x2="' + (X0 + W) + '" y2="' + YL(i).toFixed(1) + '"/>' + T(X0 - 6, YL(i) + 4, String(i), { cls: 'ts', fs: 11, a: 'end' })).join('') +
    FW.map((p, i) => '<circle class="acc" cx="' + XV(p[0]).toFixed(1) + '" cy="' + YL(p[1]).toFixed(1) + '" r="5"' + k('p' + i) + '/>').join('') +
    path('M' + XV(0.494).toFixed(1) + ' ' + YL(0.1041).toFixed(1) + ' L' + XV(0.704).toFixed(1) + ' ' + YL(10.05).toFixed(1), 'lna', 'ln1', 'stroke-width:2') +
    chip(530, 170, '0.494 → 0.596 V：× 10', '0.596 → 0.704 V：再 × 10', 'c1', { fs: 12.5, acc: true }) +
    chip(530, 250, '每 × 10 約多 0.1 V', '指數成長的招牌', 'c2', { fs: 12.5 }),
    [{ sub: '把你的 7 個點畫起來，但電流軸改成<b>對數</b>（0.1、1、10 等距）。', on: 'axs p0 p1 p2 p3 p4 p5 p6' },
     { sub: '7 個點幾乎排成<b>一條直線</b>。', on: 'ln1' },
     { sub: '0.1 → 1 mA 多了 0.10 V；1 → 10 mA 又多了 0.11 V。', on: 'c1' },
     { sub: '電壓每加一點，電流就<b>乘</b>一個倍數 —— 這就是<b>指數</b>。所以 100 倍電流只要多 0.21 V。', on: 'c2' }]);

  /* ════════════ 09 先整理一下 ════════════ */
  const S9 = sc('先整理一下', 'LET\'S RECAP',
    g('A', card(40, 110, 175, 140) + T(127, 140, '① 單向', { fs: 15 }) + T(127, 172, '順偏通、反偏擋', { cls: 'tm', fs: 12.5 }) + T(127, 198, '像旋轉門', { cls: 'tm', fs: 12.5 })) +
    g('B', card(232, 110, 175, 140) + T(320, 140, '② 有門檻', { fs: 15 }) + T(320, 172, '矽 0.6 V、鍺 0.2 V', { cls: 'tm', fs: 12.5 }) + T(320, 198, '過了才導通', { cls: 'tm', fs: 12.5 })) +
    g('C', card(424, 110, 175, 140) + T(511, 140, '③ 指數', { fs: 15, cls: 'ta' }) + T(511, 172, '每 × 10 約 +0.1 V', { cls: 'tm', fs: 12.5 }) + T(511, 198, '電壓幾乎不動', { cls: 'tm', fs: 12.5 })) +
    chip(320, 288, '接下來：把這些寫成一條公式', null, 'c1', { fs: 13 }),
    [{ sub: '先整理一下。二極體 ① <b>單向</b>：順偏通、反偏擋。', on: 'A' },
     { sub: '② 有<b>門檻</b>：矽要推過約 0.6 V。', on: 'B' },
     { sub: '③ 過了門檻是<b>指數</b>：電流變很多，電壓只多一點點。接下來寫成公式。', on: 'C c1' }]);

  /* ════════════ 10 公式 ════════════ */
  const S10 = sc('寫成公式：二極體方程式', 'THE DIODE EQUATION',
    g('eq', card(110, 115, 420, 70) + T(320, 158, 'I = I<sub>S</sub>(e<sup>V/ηV<sub>T</sub></sup> − 1)', { cls: 'ta', fs: 24 })) +
    chip(150, 230, 'I<sub>S</sub>：逆向飽和電流', '反偏時那一點點電流', 'c1', { fs: 12.5, a: 'left' }) +
    chip(150, 280, 'η：常數（講義：矽 2、鍺 1）', '決定曲線多「陡」', 'c2', { fs: 12.5, a: 'left' }) +
    chip(400, 230, 'V<sub>T</sub>：熱電壓', '室溫約 26 mV', 'c3', { fs: 12.5, a: 'left' }) +
    chip(400, 280, '−1：反偏時 e 項 → 0', '所以 I → −I<sub>S</sub>', 'c4', { fs: 12.5, a: 'left' }),
    [{ sub: '把剛剛那些行為寫成一條式子，就是講義 p.4 的<b>二極體方程式</b>。', on: 'eq' },
     { sub: '看起來很長，其實只有三個參數，一個一個來。' },
     { sub: '<b>I<sub>S</sub></b>：逆向飽和電流，反偏時那一點點電流。', on: 'c1' },
     { sub: '<b>η</b>：決定曲線多陡的常數。', on: 'c2' },
     { sub: '<b>V<sub>T</sub></b>：熱電壓，室溫約 26 mV。', on: 'c3' },
     { sub: '順偏時 e 的次方很大，「−1」可以不管；反偏時 e 項趨近 0，I → <b>−I<sub>S</sub></b>。', on: 'c4' }]);

  /* ════════════ 11 V_T ════════════ */
  const S11 = sc('熱電壓 V<sub>T</sub>', 'THERMAL VOLTAGE',
    g('c', card(150, 115, 340, 150) + T(320, 152, 'V<sub>T</sub> = (273 + T°C) / 11600', { fs: 18 }) + T(320, 196, '27 °C：300 / 11600 = 0.0259 V', { cls: 'ta', fs: 16, k: 'r1' }) + T(320, 232, '溫度越高，V<sub>T</sub> 越大', { cls: 'tm', fs: 14, k: 'r2' })),
    [{ sub: '講義 p.4：<b>V<sub>T</sub> = (273 + T°C)/11600</b>，把攝氏換成絕對溫度再除 11600。', on: 'c' },
     { sub: '室溫 27 °C：300/11600 ≈ <b>26 mV</b>。', on: 'r1' },
     { sub: 'V<sub>T</sub> 跟溫度有關 —— 所以二極體的曲線會隨溫度跑（電子學 CH1 PART 4）。', on: 'r2' }]);

  /* ════════════ 12 η 從你的數據算 ════════════ */
  const S12 = sc('從你的數據算 η', 'FINDING η FROM YOUR DATA',
    g('c', card(90, 112, 460, 170) +
      T(110, 142, '電流 × 10，電壓多 ΔV = η V<sub>T</sub> ln 10', { fs: 15, a: 'start' }) +
      T(110, 178, '你的數據：ΔV ≈ 0.103 V（0.1 → 1 mA）', { fs: 15, a: 'start', k: 'r1' }) +
      T(110, 214, 'η = 0.103 / (0.0259 × 2.303) ≈ 1.7～1.8', { cls: 'ta', fs: 16, a: 'start', k: 'r2' }) +
      T(110, 252, '講義說矽 η = 2 → 接近 ✓', { cls: 'tm', fs: 14, a: 'start', k: 'r3' })),
    [{ sub: '從公式可以推出：電流每 × 10，電壓要多 <b>η V<sub>T</sub> ln 10</b>。', on: 'c' },
     { sub: '你的數據：0.1 → 1 mA 多了 0.103 V。', on: 'r1' },
     { sub: '倒回去算：<b>η ≈ 1.7～1.8</b>（用 7 個點擬合是 1.78）。', on: 'r2' },
     { sub: '講義說矽 η = 2；實際上 η 在 1～2 之間，你這顆量到 1.78，<b>合理</b>。', on: 'r3' }]);

  /* ════════════ 13 反偏 I_S ════════════ */
  const S13 = sc('反偏那 0.003 mA 是什麼', 'REVERSE CURRENT',
    g('m', '<rect class="bgw" x="110" y="130" width="200" height="90" rx="10"/>' + T(210, 160, '電流檔（mA）', { cls: 'tm', fs: 12 }) + T(210, 196, '0.003', { fs: 26 })) +
    g('arrow', arrow(310, 190, 380, 190, null, 'ln')) +
    g('c', card(390, 120, 210, 120) + T(495, 150, '最後一位 = 0.001 mA', { fs: 13 }) + T(495, 180, '＝電表的極限', { cls: 'ta', fs: 14 }) + T(495, 210, '真正的 I<sub>S</sub> 更小', { cls: 'tm', fs: 13 })) +
    chip(320, 290, '5 V 到 30 V，電流都卡在 0.000～0.003 mA', '不隨電壓變 → 這就是「飽和」電流', 'c1', { fs: 12.5, acc: true }),
    [{ sub: '反偏時你量到 0.000～0.003 mA。', on: 'm' },
     { sub: '這已經是電表<b>最後一位數</b>（0.001 mA）了，真正的逆向電流可能更小。', on: 'arrow c' },
     { sub: '而且從 5 V 加到 30 V 都差不多 —— 電流<b>不隨電壓變</b>，所以叫「飽和」電流。', on: 'c1' }]);

  /* ════════════ 14 實驗怎麼量 ════════════ */
  const S14 = sc('實驗怎麼量：電流串、電壓並', 'HOW TO MEASURE',
    loop(110, 130, 360, 140, { v: 'V<sub>i</sub>', a: 'a' }) +
    g('am', '<circle class="bgw" cx="380" cy="130" r="16"/>' + T(380, 135, 'A', { cls: 'ta', fs: 14 }) + T(380, 104, '電流表串進去', { cls: 'ta', fs: 12 })) +
    g('vm', '<circle class="bgw" cx="440" cy="205" r="16"/>' + T(440, 210, 'V', { cls: 'ta', fs: 14 }) + path('M440 189 V170 M440 221 V270', 'ln2 dsh') + T(462, 210, '電壓表並在兩端', { cls: 'ta', fs: 12, a: 'start' })) +
    chip(270, 304, '一顆電表兩用：DCA 量 A1、DCV 量 Vd，每點切一次檔', null, 'c1', { fs: 12.5 }),
    [{ sub: '講義 p.5 的電路：電源 V<sub>i</sub>、1 kΩ、1N4004。', on: 'c1' },
     { sub: '量電流：電表切 <b>DCA</b>，<b>串</b>進迴路（電流要「穿過」電表）。', on: 'am' },
     { sub: '量電壓：電表切 <b>DCV</b>，<b>並</b>在二極體兩端。', on: 'vm' },
     { sub: '你每一點都要切一次檔 —— 心得寫的「切來切去」就是這個。<b>電流檔並聯會燒保險絲</b>，要小心。' }]);

  /* ════════════ 15 順偏怎麼調到 0.1 mA ════════════ */
  const S15 = sc('為什麼電流這麼難調準', 'HARD TO DIAL IN',
    ax(130, 110, 380, 180, 'V<sub>i</sub>（V）', 'A1（mA）', 'axs') +
    path('M130 290 L150 289 L170 285 L190 276 L230 255 L300 218 L380 176 L510 110', 'lna', 'cv', 'stroke-width:3') +
    chip(410, 245, 'V<sub>i</sub> 小時：電壓都卡在二極體', '一點點 V<sub>i</sub> 就讓電流倍增', 'c1', { fs: 12.5 }) +
    chip(270, 150, 'V<sub>i</sub> 大時：多的電壓都給 R', 'I ≈ (V<sub>i</sub> − 0.7)/1k，變直線', 'c2', { fs: 12.5, acc: true }),
    [{ sub: '你的心得說：過了 0.6 V，電流「一下子衝很快」，很難剛好調到。', on: 'axs cv' },
     { sub: 'V<sub>i</sub> 小的時候，電壓幾乎全卡在二極體上，一點點變化電流就倍增（0.605 → 0.704 V，電流 0.1 → 0.18 mA）。', on: 'c1' },
     { sub: 'V<sub>i</sub> 大了以後，多出來的電壓都給 1 kΩ：<b>I ≈ (V<sub>i</sub> − 0.7)/1 kΩ</b>，變成直線，就好調了。', on: 'c2' }]);

  /* ════════════ 16 PSpice ════════════ */
  const S16 = sc('回家作業：PSpice DC Sweep', 'PSPICE · DC SWEEP',
    g('c', card(90, 112, 460, 150) +
      T(110, 142, '電路：V1 → 100 Ω → D1N4002', { fs: 15, a: 'start' }) +
      T(110, 176, 'DC Sweep：V1 從 0 到 10 V，每次 0.01 V', { fs: 15, a: 'start', k: 'r1' }) +
      T(110, 210, 'Y 軸 I(D1)、X 軸 V(D1:1)', { fs: 15, a: 'start', k: 'r2' }) +
      T(110, 244, '→ 畫出跟你量的一樣的曲線', { cls: 'ta', fs: 15, a: 'start', k: 'r3' })),
    [{ sub: '回家作業（講義 p.7～11）：用 PSpice 把同一條曲線<b>掃</b>出來。', on: 'c' },
     { sub: '分析選 <b>DC Sweep</b>：電源從 0 掃到 10 V，每次加 0.01 V。', on: 'r1' },
     { sub: 'Y 軸放電流 I(D1)、<b>X 軸改成二極體電壓</b> V(D1:1)。', on: 'r2' },
     { sub: '畫出來就跟你 Excel 畫的那條曲線一樣。', on: 'r3' }]);

  /* ════════════ 17 恍然大悟 ════════════ */
  const S17 = sc('恍然大悟', 'THE ANSWER',
    T(320, 190, '?', { cls: 'ta', fs: 96, k: 'q' }) +
    g('L', card(70, 100, 236, 130) + T(188, 128, '順偏', { fs: 15, cls: 'ta' }) + T(188, 158, '過了 0.6 V 門檻', { cls: 'tm', fs: 13 }) + T(188, 184, '電流指數成長', { cls: 'tm', fs: 13 }) + T(188, 212, '× 100 只要 +0.21 V', { cls: 'ta', fs: 14 })) +
    g('R', card(334, 100, 236, 130) + T(452, 128, '反偏', { fs: 15 }) + T(452, 158, '旋轉門卡住', { cls: 'tm', fs: 13 }) + T(452, 184, '只剩一點點 I<sub>S</sub>', { cls: 'tm', fs: 13 }) + T(452, 212, '30 V 也只有 μA 等級', { fs: 14 })) +
    chip(320, 254, '二極體＝有門檻的單向旋轉門 ✓', '下一章：拿它來把交流變直流（整流器）', 'ans', { fs: 13, acc: true }),
    [{ sub: '回到開頭：為什麼順偏、反偏差這麼多？', on: 'q' },
     { sub: '順偏：過了門檻，電流<b>指數</b>成長，所以 100 倍電流只要多 0.21 V。', off: 'q', on: 'L' },
     { sub: '反偏：旋轉門卡住，只剩極小的 I<sub>S</sub>。', on: 'R' },
     { sub: '<b>謎題解開了</b>。下一章拿它來整流。', on: 'ans' }]);

  window.__diodeStory = window.__Story('#story', {
    id: 'lab-diode', title: '電子實習 CH3 二極體特性', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17]
  });
})();
