/* ============================================================
   電子實習 第六章 稽納二極體 —— 故事模式
   主線謎題：實驗 1 把電源從 8 V 一路轉到 16 V（翻倍），稽納兩端只從 5.02 V 變到 5.07 V。誰在撐？
   比喻：稽納二極體＝水塔的溢流管（水位到管口，多的水就流走）；R＝進水管上的節流閥。
   轉折：PSpice 作業 V3 照講義接（R3 = 1 kΩ、R_L = 1 kΩ）只有約 4.3 V —— 分壓 9 × 1k/2k = 4.5 < 5.1，根本沒崩潰。
   數字全部是模擬值（D1N5231、D1N4007 的 SPICE 模型），見 lab/docs/CONTENT_MAP.md。
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

  /* 元件 */
  const resH = (x, y, len) => { const s = (len - 40) / 2; let d = 'M' + x + ' ' + y + ' H' + (x + s); for (let i = 1; i <= 6; i++) d += ' L' + (x + s + i * 40 / 6 - 3.3) + ' ' + (y + (i % 2 ? -7 : 7)); d += ' L' + (x + s + 40) + ' ' + y + ' H' + (x + len); return path(d, 'ln'); };
  const resV = (x, y, len) => { const s = (len - 40) / 2; let d = 'M' + x + ' ' + y + ' V' + (y + s); for (let i = 1; i <= 6; i++) d += ' L' + (x + (i % 2 ? -7 : 7)) + ' ' + (y + s + i * 40 / 6 - 3.3); d += ' L' + x + ' ' + (y + s + 40) + ' V' + (y + len); return path(d, 'ln'); };
  /* 稽納（垂直，陰極在上：反向接在穩壓電路裡） */
  const zen = (x, y, cls) => '<path class="' + (cls === 'a' ? 'accw' : 'bgw') + '" style="stroke:' + (cls === 'a' ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:2" d="M' + (x - 13) + ' ' + (y + 10) + ' H' + (x + 13) + ' L' + x + ' ' + (y - 10) + ' Z"/>' +
    path('M' + (x - 17) + ' ' + (y - 16) + ' L' + (x - 13) + ' ' + (y - 10) + ' H' + (x + 13) + ' L' + (x + 17) + ' ' + (y - 4), cls === 'a' ? 'lna' : 'ln', null, 'stroke-width:2.6');
  const bat = (x, y) => '<line class="ln" x1="' + (x - 16) + '" y1="' + (y - 6) + '" x2="' + (x + 16) + '" y2="' + (y - 6) + '"/><line class="ln" x1="' + (x - 9) + '" y1="' + (y + 6) + '" x2="' + (x + 9) + '" y2="' + (y + 6) + '" style="stroke-width:3.4"/>';
  /* 穩壓電路：電源 x0、R 在上、稽納在 xz、負載在 xl；y 上線、y2 下線 */
  function reg(x0, y, xz, xl, y2, opt) {
    opt = opt || {};
    const ym = (y + y2) / 2;
    let s = path('M' + x0 + ' ' + (ym - 8) + ' V' + y + ' H' + (x0 + 30) + ' M' + (xz - 30) + ' ' + y + ' H' + (opt.noLoad ? xz : xl) + ' M' + xz + ' ' + y + ' V' + (ym - 12) + ' M' + xz + ' ' + (ym + 12) + ' V' + y2 + ' M' + x0 + ' ' + (ym + 8) + ' V' + y2 + ' H' + (opt.noLoad ? xz : xl), 'ln');
    s += bat(x0, ym) + T(x0 - 22, ym + 5, opt.vs || 'V<sub>S</sub>', { cls: 't', fs: 14, a: 'end' });
    s += resH(x0 + 30, y, xz - x0 - 60) + T((x0 + xz) / 2, y - 14, opt.r || 'R', { cls: 't', fs: 14 });
    s += zen(xz, ym, opt.za ? 'a' : '');
    if (!opt.noLoad) s += path('M' + xl + ' ' + y + ' V' + (ym - 20), 'ln') + resV(xl, ym - 20, 40) + path('M' + xl + ' ' + (ym + 20) + ' V' + y2, 'ln') + T(xl + 14, ym + 5, opt.rl || 'R<sub>L</sub>', { cls: 't', fs: 14, a: 'start' });
    return s;
  }
  /* 座標軸 */
  function ax(x0, y0, w, h, xl, yl, key) {
    return g(key, arrow(x0, y0 + h, x0 + w + 10, y0 + h, null, 'ln') + arrow(x0, y0 + h, x0, y0 - 10, null, 'ln') +
      T(x0 + w + 10, y0 + h + 18, xl, { cls: 'tm', fs: 12, a: 'end' }) + T(x0 + 8, y0 - 4, yl, { cls: 'tm', fs: 12, a: 'start' }));
  }

  /* 實驗 1 的模擬數字（R1 = 1 kΩ、D1N5231） */
  const EXP = [[2, 1.995], [4, 3.868], [6, 4.945], [8, 5.020], [10, 5.042], [12, 5.054], [14, 5.064], [16, 5.071]];

  /* ════════════ 00 謎題 ════════════ */
  const knob = (x, y, v, key) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="34"/>' + T(x, y - 4, v + ' V', { cls: 'ta', fs: 18, dy: '.35em' }) + T(x, y + 50, '電源 V<sub>S</sub>', { cls: 'tm', fs: 12 }));
  const meter = (x, y, v, key) => g(key, '<rect class="bgw" x="' + (x - 60) + '" y="' + (y - 30) + '" width="120" height="60" rx="10"/>' + T(x, y, v + ' V', { fs: 20, dy: '.35em' }) + T(x, y + 50, '稽納兩端 V<sub>D</sub>', { cls: 'tm', fs: 12 }));
  const S0 = sc('電源翻倍，輸出不動', 'THE PUZZLE',
    knob(150, 175, 8, 'k8') + knob(150, 175, 12, 'k12') + knob(150, 175, 16, 'k16') +
    g('ar', arrow(200, 175, 400, 175, null, 'lna') + T(300, 160, 'R = 1 kΩ ＋ 稽納', { cls: 'ta', fs: 12.5 })) +
    meter(490, 175, '5.02', 'm8') + meter(490, 175, '5.05', 'm12') + meter(490, 175, '5.07', 'm16') +
    chip(320, 288, '電源 8 → 16 V（翻倍），輸出只多 0.05 V', '誰在撐住這個電壓？', 'q', { fs: 13, acc: true }),
    [{ sub: '實驗 1：電源接一顆 1 kΩ 電阻，再接一顆<b>稽納二極體</b>。先把電源轉到 8 V。', on: 'k8 ar' },
     { sub: '稽納兩端量到 <b>5.02 V</b>。', on: 'm8' },
     { sub: '電源轉到 12 V，輸出 5.05 V。', off: 'k8 m8', on: 'k12 m12' },
     { sub: '轉到 16 V —— 電源<b>翻倍</b>了 —— 輸出還是 5.07 V。', off: 'k12 m12', on: 'k16 m16' },
     { sub: '電阻、二極體都很普通，<b>是誰把電壓撐在 5 V？</b>', on: 'q' }]);

  /* ════════════ 01 複習：電源供應器四個方塊 ════════════ */
  const blk = (x, lab, key, acc) => g(key, '<rect class="' + (acc ? 'accw' : 'bgw') + '" x="' + x + '" y="150" width="110" height="56" rx="8" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.8"/>' + T(x + 55, 178, lab, { cls: acc ? 'ta' : 't', fs: 15, dy: '.35em' }));
  const S1 = sc('先複習：電源供應器', 'RECAP · POWER SUPPLY',
    blk(30, '變壓', 'b0') + blk(180, '整流', 'b1') + blk(330, '濾波', 'b2') + blk(480, '穩壓', 'b3', true) +
    g('arr', arrow(142, 178, 178, 178, null, 'ln') + arrow(292, 178, 328, 178, null, 'ln') + arrow(442, 178, 478, 178, null, 'ln')) +
    g('w1', path(P(x => 250 - 22 * Math.max(0, Math.sin(TAU * (x - 190) / 45)), 190, 280, 80), 'lna', null, 'stroke-width:2.2')) +
    g('w2', path(P(x => 238 - 4 * ((x - 340) % 30) / 30 + 2, 340, 430, 60), 'lna', null, 'stroke-width:2.2')) +
    g('w3', path('M490 236 H580', 'lna', null, 'stroke-width:2.6')) +
    chip(535, 290, '這一章：最後一關', '把剩下的晃動壓平', 'c1', { fs: 13, acc: true }),
    [{ sub: '先複習整條電源供應器：<b>變壓 → 整流 → 濾波 → 穩壓</b>（講義 p.2）。', on: 'b0 b1 b2 b3 arr' },
     { sub: '整流完是一顆一顆的駝峰（CH4 整流器）。', on: 'w1' },
     { sub: '濾波後變得比較平，但還有一點<b>漣波</b>在晃（CH4 濾波）。', on: 'w2' },
     { sub: '最後一關<b>穩壓</b>：把剩下的晃動也壓平，給出一條直線。這一章就在講它。', on: 'w3 c1' }]);

  /* ════════════ 02 為什麼要穩壓 ════════════ */
  const S2 = sc('為什麼還要再穩一次', 'WHY REGULATE',
    g('L', card(60, 110, 240, 150) + T(180, 140, '① 電源會浮動', { fs: 16 }) + path(P(x => 200 - 14 * Math.sin(TAU * (x - 90) / 70) - 6 * Math.sin(TAU * (x - 90) / 23), 90, 270, 120), 'ln', null, 'stroke-width:2') + T(180, 240, '插座電壓、漣波', { cls: 'tm', fs: 13 })) +
    g('R', card(340, 110, 240, 150) + T(460, 140, '② 負載會變', { fs: 16 }) + T(460, 186, '手機：待機 → 打遊戲', { cls: 't', fs: 14 }) + T(460, 214, '吃的電流忽多忽少', { cls: 'tm', fs: 13 }) + T(460, 240, '電壓跟著掉', { cls: 'tm', fs: 13 })) +
    chip(320, 292, '穩壓：不管哪一個在變，輸出都盡量不變', null, 'c1', { fs: 13, acc: true }),
    [{ sub: '輸出會晃，原因有兩個。第一：<b>電源本身會浮動</b>（插座電壓、濾波剩下的漣波）。', on: 'L' },
     { sub: '第二：<b>負載會變</b> —— 手機從待機到打遊戲，吃的電流差很多。', on: 'R' },
     { sub: '<b>穩壓電路</b>的工作：不管哪一個在變，輸出電壓都盡量不變（講義 p.2）。', on: 'c1' }]);

  /* ════════════ 03 比喻：水塔的溢流管 ════════════ */
  const S3 = sc('生活比喻：溢流管', 'THE OVERFLOW PIPE',
    g('tank', '<rect class="bgw" x="200" y="110" width="200" height="180" rx="6"/>') +
    g('w1', '<rect class="accw" x="202" y="210" width="196" height="78"/>') +
    g('w2', '<rect class="accw" x="202" y="160" width="196" height="128"/>') +
    g('pipe', '<rect class="bgw" x="300" y="150" width="14" height="140"/>' + T(330, 156, '溢流管', { cls: 't', fs: 13, a: 'start' })) +
    g('in1', arrow(120, 130, 196, 130, null, 'lna') + T(120, 118, '進水', { cls: 'ta', fs: 12, a: 'start' })) +
    g('in2', arrow(120, 140, 196, 140, null, 'lna') + arrow(120, 124, 196, 124, null, 'lna') + T(116, 108, '進水變多', { cls: 'ta', fs: 12, a: 'start' })) +
    g('spill', arrow(307, 158, 307, 300, null, 'lna') + T(318, 300, '多的水從這流走', { cls: 'ta', fs: 12, a: 'start' })) +
    '<line class="ln2 dsh" x1="190" y1="160" x2="470" y2="160"' + k('lv') + '/>' + T(476, 164, '水位 = 管口高度', { cls: 'ta', fs: 13, a: 'start', k: 'lvt' }),
    [{ sub: '先想一個水塔，中間立一根<b>溢流管</b>，管口在某個高度。', on: 'tank pipe w1 in1' },
     { sub: '水慢慢加，水位一路升到管口……', off: 'w1', on: 'w2' },
     { sub: '再多的水就從溢流管流走，水位<b>停在管口</b>。', on: 'spill lv lvt' },
     { sub: '進水變多也一樣：只是溢流管流得比較多，水位還是在管口。<b>稽納二極體就是這根溢流管。</b>', off: 'in1', on: 'in2' }]);

  /* ════════════ 04 複習崩潰 ════════════ */
  const S4 = sc('複習：二極體反著推', 'RECAP · BREAKDOWN',
    ax(150, 110, 340, 170, 'V', 'I', 'axs') +
    path('M150 200 L345 200 L352 200 C356 200 360 200 362 190 L372 112', 'lna', 'fw', 'stroke-width:2.6') +
    path('M150 280 L190 278 C200 276 205 210 212 200 L345 200', 'lna', 'bd', 'stroke-width:2.6') +
    chip(430, 150, '順偏：門打開', null, 'c1', { fs: 13 }) +
    chip(300, 236, '反著推：擋住，電流 ≈ 0', null, 'c2', { fs: 13 }) +
    chip(120, 145, '推太用力：崩潰', '電流突然往下衝', 'c3', { fs: 13, acc: true }),
    [{ sub: '先複習二極體的電流–電壓曲線（電子學 CH1 PART 5）。', on: 'axs fw' },
     { sub: '順著接，過 0.7 V 門就打開。', on: 'c1' },
     { sub: '反著接，門關著，電流幾乎是 0。', on: 'c2' },
     { sub: '反著推<b>太用力</b>，超過崩潰電壓，電流突然往下衝 —— 這叫<b>崩潰</b>。一般二極體很怕它。', on: 'bd c3' }]);

  /* ════════════ 05 稽納 = 住在崩潰區 ════════════ */
  const S5 = sc('稽納二極體：故意住在崩潰區', 'ZENER DIODE',
    g('sym', zen(130, 190, 'a') + path('M130 120 V174 M130 200 V262', 'ln') + T(130, 290, '電路符號', { cls: 'tm', fs: 12 }) + T(152, 160, '彎的那條＝稽納', { cls: 'ta', fs: 12, a: 'start' })) +
    ax(300, 110, 280, 170, 'V', 'I', 'axs') +
    path('M300 200 L520 200 C530 200 535 196 540 186 L548 112', 'ln', 'fw', 'stroke-width:2.2') +
    path('M330 282 L342 220 C346 206 350 200 362 200 L520 200', 'lna', 'bd', 'stroke-width:3') +
    '<line class="ln2 dsh" x1="340" y1="110" x2="340" y2="290"' + k('vz') + '/>' + T(340, 304, '−V<sub>Z</sub>', { cls: 'ta', fs: 13, k: 'vzt' }) +
    chip(470, 262, '一般二極體怕崩潰', '稽納故意住在這裡', 'c1', { fs: 13, acc: true }),
    [{ sub: '<b>稽納二極體</b>長得跟一般二極體很像，只是陰極那條線兩端是彎的（講義 p.3）。', on: 'sym' },
     { sub: '它的曲線右半邊一樣：順偏過 0.7 V 就導通。', on: 'axs fw' },
     { sub: '不一樣的是左邊：它被做成在一個很準的電壓 <b>V<sub>Z</sub></b> 崩潰。', on: 'bd vz vzt' },
     { sub: '一般二極體怕崩潰，稽納二極體反過來，<b>故意反接、住在崩潰區</b>。', on: 'c1' }]);

  /* ════════════ 06 曲線很陡 ════════════ */
  const S6 = sc('為什麼它撐得住電壓', 'A STEEP WALL',
    ax(160, 110, 320, 180, '反向電壓', '反向電流', 'axs') +
    path('M160 285 L300 284 C320 283 330 270 336 230 L346 110', 'lna', 'cv', 'stroke-width:3') +
    '<line class="ln2 dsh" x1="160" y1="240" x2="480" y2="240"' + k('i1') + '/>' + '<line class="ln2 dsh" x1="160" y1="130" x2="480" y2="130"' + k('i2') + '/>' +
    g('dI', arrow(420, 236, 420, 134, null, 'lna') + T(430, 190, '電流差很多 ΔI', { cls: 'ta', fs: 13, a: 'start' })) +
    g('dV', '<rect class="accw" x="334" y="292" width="14" height="10"/>' + T(341, 318, 'ΔV 很小', { cls: 'ta', fs: 13 })) +
    chip(230, 160, 'ΔV = r<sub>z</sub> · ΔI', 'r<sub>z</sub>：動態電阻，只有幾 Ω', 'c1', { fs: 13 }),
    [{ sub: '把崩潰那一段放大來看（畫成正的，比較好讀）。', on: 'axs cv' },
     { sub: '電流從少（下面那條虛線）變到多（上面那條）……', on: 'i1 i2 dI' },
     { sub: '……電壓只往右挪了一點點。這段線<b>幾乎垂直</b>。', on: 'dV' },
     { sub: '那一點點斜率叫<b>動態電阻 r<sub>z</sub></b>：ΔV = r<sub>z</sub>ΔI（講義 p.4）。r<sub>z</sub> 越小，穩得越好。', on: 'c1' }]);

  /* ════════════ 07 膝點 IZK ════════════ */
  const S7 = sc('別掉到膝蓋下面', 'STAY ABOVE I<sub>ZK</sub>',
    ax(160, 110, 320, 180, '反向電壓', '反向電流', 'axs') +
    path('M160 285 L300 284 C320 283 330 270 336 230 L346 110', 'ln', 'cv', 'stroke-width:2.6') +
    '<circle class="acc" cx="331" cy="262" r="7"' + k('knee') + '/>' + T(300, 250, '膝點', { cls: 'ta', fs: 14, a: 'end', k: 'kt' }) +
    '<line class="ln2 dsh" x1="160" y1="262" x2="480" y2="262"' + k('izk') + '/>' + T(484, 266, 'I<sub>ZK</sub>', { cls: 'ta', fs: 14, a: 'start', k: 'izkt' }) +
    g('ok', '<rect class="accw" x="336" y="110" width="40" height="150" rx="4" opacity=".55"/>' + T(384, 150, '穩壓區', { cls: 'ta', fs: 13, a: 'start' })) +
    chip(260, 160, '電流永遠不能小於 I<sub>ZK</sub>', '像溢流管：水剛好到管口時還不穩', 'c1', { fs: 13, acc: true }),
    [{ sub: '曲線轉彎的地方像一個<b>膝蓋</b>。', on: 'axs cv knee kt' },
     { sub: '膝蓋那點的電流叫 <b>I<sub>ZK</sub></b>（膝點電流）。', on: 'izk izkt' },
     { sub: '電流比 I<sub>ZK</sub> 大，才在直直的穩壓區；比它小，電壓就亂掉。', on: 'ok' },
     { sub: '所以講義說：<b>流過稽納的電流永遠不得小於 I<sub>ZK</sub></b>。', on: 'c1' }]);

  /* ════════════ 08 等效電路 ════════════ */
  const S8 = sc('換成一顆電池加一顆小電阻', 'EQUIVALENT CIRCUIT',
    g('z', zen(150, 200, 'a') + path('M150 130 V184 M150 210 V270', 'ln')) +
    T(250, 205, '≡', { fs: 30, k: 'eqv' }) +
    g('m', path('M370 120 V150', 'ln') + resV(370, 150, 50) + path('M370 200 V214', 'ln') + bat(370, 220) + path('M370 226 V280', 'ln') +
      T(388, 180, 'r<sub>z</sub>', { cls: 'ta', fs: 15, a: 'start' }) + T(394, 226, 'V<sub>ZO</sub>', { cls: 'ta', fs: 15, a: 'start' })) +
    chip(480, 140, 'V<sub>Z</sub> = V<sub>ZO</sub> + r<sub>z</sub> · I<sub>Z</sub>', '電流越大，電壓多一點點', 'c1', { fs: 13, acc: true }),
    [{ sub: '在穩壓區，稽納可以換成一個簡單的模型（講義 p.3、p.4）……', on: 'z' },
     { sub: '……一顆電池 <b>V<sub>ZO</sub></b> 串一顆很小的電阻 <b>r<sub>z</sub></b>。', on: 'eqv m' },
     { sub: '寫成式子：<b>V<sub>Z</sub> = V<sub>ZO</sub> + r<sub>z</sub>I<sub>Z</sub></b>。電流越大，電壓多一點點 —— 就是剛剛那點斜率。', on: 'c1' }]);

  /* ════════════ 09 先整理一下 ════════════ */
  const S9 = sc('先整理一下', 'LET\'S RECAP',
    g('A', card(40, 110, 175, 140) + T(127, 140, '① 住在崩潰區', { fs: 15 }) + T(127, 172, '反接、到 V<sub>Z</sub> 就導通', { cls: 'tm', fs: 12.5 }) + T(127, 198, '像溢流管', { cls: 'tm', fs: 12.5 })) +
    g('B', card(232, 110, 175, 140) + T(320, 140, '② 曲線很陡', { fs: 15 }) + T(320, 172, 'ΔV = r<sub>z</sub>ΔI', { cls: 'tm', fs: 12.5 }) + T(320, 198, '電流變、電壓幾乎不變', { cls: 'tm', fs: 12.5 })) +
    g('C', card(424, 110, 175, 140) + T(511, 140, '③ 不能太少電流', { fs: 15, cls: 'ta' }) + T(511, 172, 'I<sub>Z</sub> ≥ I<sub>ZK</sub>', { cls: 'tm', fs: 12.5 }) + T(511, 198, '不然穩不住', { cls: 'tm', fs: 12.5 })) +
    chip(320, 288, '接下來：把它放進電路，真的拿來穩壓', null, 'c1', { fs: 13 }),
    [{ sub: '先整理一下。稽納二極體：<b>反接、住在崩潰區</b>，像溢流管。', on: 'A' },
     { sub: '崩潰那段<b>很陡</b>：電流變很多，電壓幾乎不動。', on: 'B' },
     { sub: '但電流<b>不能少於 I<sub>ZK</sub></b>，不然掉到膝蓋下面就穩不住。接下來放進電路。', on: 'C c1' }]);

  /* ════════════ 10 穩壓電路 ════════════ */
  const S10 = sc('穩壓電路：一顆電阻＋一顆稽納', 'THE REGULATOR',
    reg(90, 130, 330, 470, 270, { vs: 'V<sub>S</sub>', r: 'R', rl: 'R<sub>L</sub>', za: true }) +
    g('lab', T(350, 205, 'V<sub>o</sub>', { cls: 'ta', fs: 15, a: 'start' })) +
    chip(470, 104, '負載 R<sub>L</sub>：手機', null, 'c2', { fs: 12.5 }) +
    chip(210, 304, 'R 像進水管上的節流閥', '多出來的電壓都讓它吃掉', 'c1', { fs: 12.5, acc: true }),
    [{ sub: '穩壓電路只有兩顆零件：一顆<b>電阻 R</b>，一顆<b>反接的稽納</b>（講義 p.5 圖 6.5）。', on: 'lab' },
     { sub: '負載 R<sub>L</sub>（例如手機）並在稽納旁邊，所以它拿到的就是稽納的電壓 V<sub>o</sub>。', on: 'c2' },
     { sub: 'R 像進水管上的<b>節流閥</b>：電源比 V<sub>Z</sub> 多出來的那些電壓，全部讓 R 吃掉。', on: 'c1' }]);

  /* ════════════ 11 電流分帳 ════════════ */
  const S11 = sc('電流怎麼分帳', 'WHERE THE CURRENT GOES',
    reg(90, 130, 330, 470, 270, { za: true }) +
    g('iR', arrow(150, 148, 230, 148, null, 'lna') + T(190, 168, 'I<sub>R</sub>', { cls: 'ta', fs: 14 })) +
    g('iZ', arrow(306, 160, 306, 220, null, 'lna') + T(296, 192, 'I<sub>Z</sub>', { cls: 'ta', fs: 14, a: 'end' })) +
    g('iL', arrow(500, 160, 500, 220, null, 'lna') + T(510, 192, 'I<sub>L</sub>', { cls: 'ta', fs: 14, a: 'start' })) +
    calc0(),
    [{ sub: '電源經過 R 送下來的電流 <b>I<sub>R</sub></b>，到了節點分成兩路：', on: 'iR' },
     { sub: '一路給負載 <b>I<sub>L</sub></b>，剩下的流進稽納 <b>I<sub>Z</sub></b>：I<sub>R</sub> = I<sub>Z</sub> + I<sub>L</sub>。', on: 'iZ iL r1' },
     { sub: '電源變大 → I<sub>R</sub> 變大 → 多出來的全被稽納吃掉（溢流管流多一點），V<sub>o</sub> 不變。', off: 'r1', on: 'r2' },
     { sub: '負載吃多一點 → 稽納就少吃一點。只要 I<sub>Z</sub> 一直 ≥ I<sub>ZK</sub>，輸出就穩。', off: 'r2', on: 'r3' }]);
  function calc0() {
    return T(320, 292, 'I<sub>R</sub> = I<sub>Z</sub> + I<sub>L</sub>', { cls: 'ta', fs: 15, k: 'r1' }) +
      T(320, 292, 'V<sub>S</sub> ↑ → I<sub>R</sub> ↑ → I<sub>Z</sub> ↑，V<sub>o</sub> 不動', { cls: 'ta', fs: 14, k: 'r2' }) +
      T(320, 292, 'I<sub>L</sub> ↑ → I<sub>Z</sub> ↓，只要 I<sub>Z</sub> ≥ I<sub>ZK</sub>', { cls: 'ta', fs: 14, k: 'r3' });
  }

  /* ════════════ 12 有沒有崩潰：拿掉稽納看分壓 ════════════ */
  const S12 = sc('先檢查：它真的崩潰了嗎', 'IS IT IN BREAKDOWN?',
    reg(90, 130, 330, 470, 270, { noLoad: false }) +
    g('cross', '<path class="lna" style="stroke-width:4" d="M312 182 L348 218 M348 182 L312 218"/>') +
    g('calc', card(380, 110, 230, 112) + T(395, 140, '拿掉稽納，看分壓：', { cls: 'tm', fs: 13, a: 'start' }) +
      T(395, 172, 'V<sub>S</sub> × R<sub>L</sub>/(R + R<sub>L</sub>)', { fs: 15, a: 'start' }) + T(395, 202, '≥ V<sub>ZO</sub> 才會崩潰', { cls: 'ta', fs: 15, a: 'start' })) +
    chip(200, 304, '電阻分到的電壓不夠高 → 溢流管根本沒碰到水', null, 'c1', { fs: 12.5, acc: true }),
    [{ sub: '有一個陷阱：<b>稽納不一定有崩潰</b>。怎麼檢查？先假裝把它拿掉。', on: 'cross' },
     { sub: '剩下 R 和 R<sub>L</sub> 分壓：V<sub>S</sub> × R<sub>L</sub>/(R + R<sub>L</sub>)（講義 p.5）。', on: 'calc' },
     { sub: '這個電壓 ≥ V<sub>ZO</sub>，放回稽納它才會崩潰、開始穩壓。', on: 'calc' },
     { sub: '不夠高的話，就像水位根本沒到溢流管 —— 稽納<b>不工作</b>，輸出就只是分壓。', on: 'c1' }]);

  /* ════════════ 13 實驗 1：V_D 對 V_S ════════════ */
  const X0 = 90, Y0 = 112, W = 260, H = 170, XS = v => X0 + v / 16 * W, YS = v => Y0 + H - v / 6 * H;
  let expPath = ''; EXP.forEach((p, i) => { expPath += (i ? ' L' : 'M') + XS(p[0]).toFixed(1) + ' ' + YS(p[1]).toFixed(1); });
  const S13 = sc('實驗 1：電源從 2 V 轉到 16 V', 'EXPERIMENT 1',
    ax(X0, Y0, W, H, 'V<sub>S</sub>（V）', 'V<sub>D</sub>（V）', 'axs') +
    '<line class="ln2 dsh" x1="' + X0 + '" y1="' + YS(5.1) + '" x2="' + (X0 + W) + '" y2="' + YS(5.1) + '"' + k('vz') + '/>' + T(X0 + W + 4, YS(5.1) + 4, '5.1 V', { cls: 'ta', fs: 12, a: 'start', k: 'vzt' }) +
    path(expPath, 'lna', 'cv', 'stroke-width:2.6') +
    EXP.map((p, i) => '<circle class="acc" cx="' + XS(p[0]).toFixed(1) + '" cy="' + YS(p[1]).toFixed(1) + '" r="4.5"' + k('p' + i) + '/>').join('') +
    D.chip(630, 150, '2 V → 2.00 V', '還沒崩潰：V<sub>D</sub> ≈ V<sub>S</sub>', 'c1', { fs: 12.5, a: 'right' }) +
    D.chip(630, 210, '4 V → 3.87 V', '膝蓋附近：開始漏一點電流', 'c2', { fs: 12.5, a: 'right' }) +
    D.chip(630, 270, '8～16 V → 5.02～5.07 V', '崩潰區：幾乎平的', 'c3', { fs: 12.5, acc: true, a: 'right' }),
    [{ sub: '實驗 1（講義 p.9 圖 6.11）：R1 = 1 kΩ 固定，電源 V<sub>S</sub> 從 2 V 轉到 16 V，量稽納兩端 V<sub>D</sub>。', on: 'axs vz vzt' },
     { sub: '2 V：還沒崩潰，稽納像斷路，V<sub>D</sub> ≈ V<sub>S</sub> = 2.00 V。', on: 'p0 c1' },
     { sub: '4 V：3.87 V，稍微被拉低一點 —— 已經靠近膝蓋，開始漏一點電流。', on: 'p1 c2' },
     { sub: '6 V 以後：4.95、5.02、5.04、5.05、5.06、5.07 V……', on: 'p2 p3 p4 p5 p6 p7 cv' },
     { sub: '線<b>突然變平</b>：電源再加，V<sub>D</sub> 都卡在 5 V 附近。這就是穩壓。', on: 'c3' }]);

  /* ════════════ 14 實驗 1：I_D 對 V_D ════════════ */
  const IDS = [0.005, 0.132, 1.055, 2.98, 4.96, 6.95, 8.94, 10.93];
  const XV = v => 150 + v / 6 * 300, YI = i => 282 - i / 12 * 170;
  let ivPath = ''; EXP.forEach((p, i) => { ivPath += (i ? ' L' : 'M') + XV(p[1]).toFixed(1) + ' ' + YI(IDS[i]).toFixed(1); });
  const S14 = sc('同一組數字，畫成 V-I 曲線', 'EXPERIMENT 1 · V-I CURVE',
    ax(150, 112, 300, 170, 'V<sub>D</sub>（V）', 'I<sub>D</sub>（mA）', 'axs') +
    path(ivPath, 'lna', 'cv', 'stroke-width:2.6') +
    EXP.map((p, i) => '<circle class="acc" cx="' + XV(p[1]).toFixed(1) + '" cy="' + YI(IDS[i]).toFixed(1) + '" r="4"/>').join('') +
    T(XV(5.07) - 8, YI(10.93) - 6, '16 V：10.9 mA', { cls: 'ta', fs: 12, a: 'end', k: 'l1' }) +
    chip(520, 220, 'I<sub>D</sub> = (V<sub>S</sub> − V<sub>D</sub>) / 1 kΩ', '電流用算的，不用另外量', 'c1', { fs: 12.5 }),
    [{ sub: '電流不用另外量：<b>I<sub>D</sub> = (V<sub>S</sub> − V<sub>D</sub>)/R1</b>，例如 16 V 時 (16 − 5.07)/1k = 10.9 mA。', on: 'axs c1' },
     { sub: '把 (V<sub>D</sub>, I<sub>D</sub>) 畫起來，就是稽納崩潰區的 V-I 曲線（講義要用 Excel 畫的第二張圖）。', on: 'cv' },
     { sub: '電流從 1 mA 衝到 11 mA，電壓只從 4.95 走到 5.07 V —— 就是剛剛那面<b>很陡的牆</b>。', on: 'l1' }]);

  /* ════════════ 15 實驗 1：並負載 ════════════ */
  const S15 = sc('換負載試試：15 V，並 1k／10k／20k', 'CHANGE THE LOAD',
    reg(90, 130, 300, 430, 270, { vs: '15 V', r: '1 kΩ', rl: 'R', za: true }) +
    g('tb', card(490, 110, 130, 140) + T(510, 136, 'R', { cls: 'tm', fs: 13, a: 'start' }) + T(605, 136, 'V<sub>D</sub>', { cls: 'tm', fs: 13, a: 'end' }) +
      T(510, 168, '1k', { fs: 14, a: 'start' }) + T(510, 198, '10k', { fs: 14, a: 'start' }) + T(510, 228, '20k', { fs: 14, a: 'start' })) +
    T(605, 168, '5.04', { cls: 'ta', fs: 14, a: 'end', k: 'v1' }) + T(605, 198, '5.07', { cls: 'ta', fs: 14, a: 'end', k: 'v2' }) + T(605, 228, '5.07', { cls: 'ta', fs: 14, a: 'end', k: 'v3' }) +
    chip(270, 304, '1k 時稽納只剩 4.9 mA；20k 時 9.7 mA', '負載吃多少，稽納就讓多少', 'c1', { fs: 12.5, acc: true }),
    [{ sub: '實驗 1 第二部分：電源固定 15 V，在稽納旁邊並一顆負載電阻 R。', on: 'tb' },
     { sub: 'R = 1 kΩ：輸出 <b>5.04 V</b>。', on: 'v1' },
     { sub: 'R = 10 kΩ、20 kΩ：都是 <b>5.07 V</b>。負載差了 20 倍，電壓只差 0.03 V。', on: 'v2 v3' },
     { sub: '電流怎麼分帳？R1 總共送 9.9 mA；1k 負載吃掉 5 mA，稽納就只拿 4.9 mA。負載吃多少，稽納就讓多少。', on: 'c1' }]);

  /* ════════════ 16 PSpice：一路串起來 ════════════ */
  const wv = (x0, yb, w, fn, cls, key) => path(P(x => yb - 10 * fn((x - x0) / w), x0, x0 + w, 120), cls, key, 'stroke-width:2.2');
  const S16 = sc('PSpice：整流 → 濾波 → 穩壓', 'PSPICE · AC TO DC',
    g('h1', T(110, 112, 'V1：半波整流', { fs: 13 }) + '<line class="ln2" x1="40" y1="240" x2="180" y2="240"/>' + wv(40, 240, 140, u => 9 * Math.max(0, Math.sin(TAU * 2 * u)), 'lna') + T(110, 272, '峰值 9.3 V', { cls: 'ta', fs: 12.5 })) +
    g('h2', T(320, 112, 'V2：加 100 µF 濾波', { fs: 13 }) + '<line class="ln2" x1="250" y1="240" x2="390" y2="240"/>' + wv(250, 240, 140, u => 9 * (0.93 - 0.13 * ((u * 2 + 0.75) % 1)), 'lna') + T(320, 272, '8.0～9.3 V', { cls: 'ta', fs: 12.5 })) +
    g('h3', T(530, 112, 'V3：加 1k ＋ 稽納', { fs: 13 }) + '<line class="ln2" x1="460" y1="240" x2="600" y2="240"/>' + wv(460, 240, 140, u => 9 * (0.48 - 0.03 * ((u * 2 + 0.75) % 1)), 'lna') + T(530, 272, '約 4.3 V？', { cls: 'ta', fs: 12.5 })) +
    g('q', T(530, 160, '?', { cls: 'ta', fs: 38 })),
    [{ sub: 'PSpice 回家作業把整條電源供應器接起來（講義 p.10），輸入是 VAMPL = 10 V、60 Hz。', on: 'h1' },
     { sub: 'V1 半波整流：一顆一顆的駝峰，峰值 9.3 V（二極體吃掉 0.7 V）。', on: 'h1' },
     { sub: 'V2 加 100 µF 濾波：在 8.0～9.3 V 之間晃。', on: 'h2' },
     { sub: 'V3 再加 1 kΩ 和 5.1 V 稽納，負載 1 kΩ……結果只有 <b>約 4.3 V</b>，不是 5.1 V？', on: 'h3 q' }]);

  /* ════════════ 17 V3 的陷阱 ════════════ */
  const S17 = sc('V3 為什麼不是 5.1 V', 'THE V3 TRAP',
    g('c', card(60, 110, 300, 150) + T(80, 140, '拿掉稽納，看分壓：', { cls: 'tm', fs: 13, a: 'start' }) +
      T(80, 174, '≈ 9 V × 1k / (1k + 1k)', { fs: 15, a: 'start', k: 'r1' }) + T(80, 206, '= 4.5 V &lt; 5.1 V', { cls: 'ta', fs: 16, a: 'start', k: 'r2' }) + T(80, 238, '→ 稽納根本沒崩潰', { cls: 'ta', fs: 14, a: 'start', k: 'r3' })) +
    g('fix', card(390, 110, 210, 150) + T(405, 140, '想看到穩 5 V：', { cls: 'tm', fs: 13, a: 'start' }) + T(405, 174, 'R<sub>L</sub> 換 10 kΩ', { fs: 15, a: 'start' }) + T(405, 206, '→ 5.03 V，晃 7 mV', { cls: 'ta', fs: 14, a: 'start' }) + T(405, 238, '（或 R3 換 470 Ω）', { cls: 'tm', fs: 13, a: 'start' })) +
    chip(320, 296, '模擬：照講義接 V3 ≈ 4.2～4.5 V（請跟老師確認）', null, 'c1', { fs: 12.5, acc: true }),
    [{ sub: '用剛剛的檢查法：先假裝把稽納拿掉。', on: 'c' },
     { sub: '電容上大約 9 V，R3 = 1 kΩ 和負載 1 kΩ 對半分……', on: 'r1' },
     { sub: '只分到 <b>4.5 V，比 5.1 V 還低</b> —— 水位沒到溢流管，稽納根本沒崩潰。', on: 'r2 r3' },
     { sub: '想看到穩穩的 5 V，負載換 10 kΩ 就好：模擬 5.03 V，只晃 7 mV。<b>這點請跟老師確認作業要不要改。</b>', on: 'fix c1' }]);

  /* ════════════ 18 恍然大悟 ════════════ */
  const S18 = sc('恍然大悟', 'THE ANSWER',
    T(320, 190, '?', { cls: 'ta', fs: 96, k: 'q' }) +
    g('L', card(70, 100, 236, 130) + T(188, 128, '電源 8 → 16 V', { fs: 15 }) + T(188, 158, 'R 多吃掉的電壓', { cls: 'tm', fs: 13 }) + T(188, 184, '多送下來的電流', { cls: 'tm', fs: 13 }) + T(188, 212, '全部流進稽納', { cls: 'ta', fs: 14 })) +
    g('R', card(334, 100, 236, 130) + T(452, 128, '稽納兩端', { fs: 15 }) + T(452, 158, '崩潰區幾乎垂直', { cls: 'tm', fs: 13 }) + T(452, 184, '電流 3 → 11 mA', { cls: 'tm', fs: 13 }) + T(452, 212, '電壓只動 0.05 V', { cls: 'ta', fs: 14 })) +
    chip(320, 254, '撐住電壓的是稽納 —— 溢流管 ✓', '前提：分壓夠高，而且 I<sub>Z</sub> ≥ I<sub>ZK</sub>', 'ans', { fs: 13, acc: true }),
    [{ sub: '回到開頭：電源翻倍，輸出只多 0.05 V，誰在撐？', on: 'q' },
     { sub: '電源多出來的電壓讓 R 吃掉，多送下來的電流全部流進稽納。', off: 'q', on: 'L' },
     { sub: '稽納的崩潰區幾乎垂直：電流 3 → 11 mA，電壓只動 0.05 V。', on: 'R' },
     { sub: '<b>謎題解開了</b>：稽納就是溢流管。', on: 'ans' }]);

  window.__zenerStory = window.__Story('#story', {
    id: 'lab-zener', title: '電子實習 CH6 稽納二極體', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18]
  });
})();
