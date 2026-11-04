/* ============================================================
   電子學 CH2 PART 3 —— 故事模式
   謎題：一個 10 V 峰值的訊號要送進最多只能吃 4.7 V 的電路，怎麼辦？（截波）
   之後：箝位器——不削頭，整個波形往下搬。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15) return;
  const K = window.__K15, D = K.D;
  const { g, T, calc, sc, sine, f1, ansScene } = K;
  const { chip } = D;
  const card = (x, y, w, h, key, inner) => g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"/>' + inner);
  const path = (fn, x0, w, ym, A, key, style) => {
    let d = '';
    for (let i = 0; i <= 200; i++) { const u = i / 200; d += (i ? ' L' : 'M') + f1(x0 + u * w) + ' ' + f1(ym - A * fn(u)); }
    return '<path class="lna" style="fill:none;stroke-width:2.6' + (style || '') + '" d="' + d + '"' + K.k(key) + '/>';
  };
  const sn = u => Math.sin(u * 4 * Math.PI);
  const hl = (y, key, t) => '<line class="ln dsh" x1="80" y1="' + y + '" x2="560" y2="' + y + '"' + K.k(key) + '/>' + T(560, y - 8, t, { cls: 'ta', fs: 12, a: 'end', k: key + 'l' });

  const C0 = sc('10 V 的訊號，只准 4.7 V 進去', 'THE QUESTION',
    sine(80, 200, 480, 60, { cls: 'ln', k: 'ac' }) + hl(158, 'th', '4.7 V') +
    chip(320, 290, '超過的部分怎麼辦？', '用二極體把頭削掉', 'q', { fs: 13, acc: true }),
    [{ sub: '訊號峰值有 <b>10 V</b>，後面的電路最多只吃 <b>4.7 V</b>。', on: 'ac' },
     { sub: '想把超過 4.7 V 的部分削掉。', on: 'th thl' },
     { sub: '這就是<b>截波器</b>（clipper）。', on: 'q' }]);

  const C1 = sc('比喻：水壩的溢洪道', 'ANALOGY',
    card(60, 110, 230, 150, 'A', T(175, 140, '水位超過堤頂', { fs: 15, cls: 'ta' }) + T(175, 170, '多的水從溢洪道排掉', { cls: 'tm', fs: 13 }) + T(175, 198, '水位不會再升高', { cls: 'ts', fs: 12 })) +
    card(350, 110, 230, 150, 'B', T(465, 140, '電壓超過門檻', { fs: 15, cls: 'ta' }) + T(465, 170, '二極體導通，把多的吃掉', { cls: 'tm', fs: 13 }) + T(465, 198, '輸出被釘在門檻', { cls: 'ts', fs: 12 })),
    [{ sub: '水壩：水位超過堤頂，多的水就從溢洪道排走。', on: 'A' },
     { sub: '二極體加電池就是那個溢洪道：<b>超過門檻才導通</b>，把輸出釘住。', on: 'B' }]);

  const C2 = sc('並聯截波器', 'SHUNT CLIPPER',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'in' }) + hl(158, 'th', 'V<sub>B</sub> + V<sub>γ</sub>') + path(u => Math.min(sn(u), 0.5), 80, 480, 200, 60, 'out') +
    chip(320, 290, 'v<sub>i</sub> &gt; V<sub>B</sub> + V<sub>γ</sub>：v<sub>O</sub> = V<sub>B</sub> + V<sub>γ</sub>', '否則 v<sub>O</sub> = v<sub>i</sub>', 'c', { fs: 13, acc: true }),
    [{ sub: '虛線是輸入，水平虛線是門檻 V<sub>B</sub> + V<sub>γ</sub>。', on: 'in th thl' },
     { sub: '超過門檻：二極體 ON，輸出<b>釘在門檻</b>；沒超過：OFF，輸出 = 輸入。', on: 'out c' }]);

  const C3 = sc('串聯截波器（板書）', 'SERIES CLIPPER',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'in' }) + path(u => sn(u) > 0.3 ? 0 : sn(u) - 0.3, 80, 480, 200, 60, 'out') +
    chip(320, 290, 'v<sub>i</sub> &gt; V<sub>B</sub> − V<sub>γ</sub>：v<sub>O</sub> = 0', '否則 v<sub>O</sub> = v<sub>i</sub> − (V<sub>B</sub> − V<sub>γ</sub>)', 'c', { fs: 13, acc: true }),
    [{ sub: '串聯：二極體串在訊號路徑上。', on: 'in' },
     { sub: '板書：大於分界點輸出 0；小於分界點，輸出是輸入<b>平移</b>一個分界點。', on: 'out c' }]);

  const C4 = sc('雙向截波：頭尾一起削', 'TWO-WAY CLIPPER',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'in' }) + hl(158, 'u', '上限 V<sub>B1</sub> + V<sub>γ1</sub>') + hl(250, 'l', '下限 −(V<sub>B2</sub> + V<sub>γ2</sub>)') + path(u => Math.max(-0.55, Math.min(sn(u), 0.5)), 80, 480, 200, 60, 'out') +
    chip(320, 290, '中間：v<sub>O</sub> = v<sub>i</sub>', '兩顆都 OFF', 'c', { fs: 13, acc: true }),
    [{ sub: '上面一顆管上限，下面一顆管下限。', on: 'in u ul l ll' },
     { sub: '兩個門檻之間，兩顆都 OFF，輸出照著輸入走；超過就被削掉。', on: 'out c' },
     { sub: '加了 R<sub>2</sub> 的版本：超過上限的部分只剩 R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>) 倍（分壓）。', on: '' }]);

  const C5 = sc('先整理一下', 'LET\'S RECAP',
    card(60, 116, 250, 130, 'A', T(185, 146, '截波器', { fs: 16, cls: 'ta' }) + T(185, 176, '削掉超過門檻的部分', { cls: 'tm', fs: 13 }) + T(185, 204, '波形被切掉一塊', { cls: 'ts', fs: 12 })) +
    card(330, 116, 250, 130, 'B', T(455, 146, '箝位器', { fs: 16 }) + T(455, 176, '整個波形上下平移', { cls: 'tm', fs: 13 }) + T(455, 204, '形狀完全不變', { cls: 'ts', fs: 12 })),
    [{ sub: '先整理：截波器是<b>切掉一塊</b>。', on: 'A' },
     { sub: '箝位器是<b>整個搬家</b>，形狀不變。接下來看它怎麼做到。', on: 'B' }]);

  const C6 = sc('比喻：電容是記憶的水桶', 'ANALOGY · CLAMPER',
    card(60, 110, 230, 150, 'A', T(175, 140, '輸入上升時', { fs: 15, cls: 'ta' }) + T(175, 170, '二極體 ON，電容充電', { cls: 'tm', fs: 13 }) + T(175, 198, '充到 V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>', { cls: 'ts', fs: 12 })) +
    card(350, 110, 230, 150, 'B', T(465, 140, '輸入下降時', { fs: 15, cls: 'ta' }) + T(465, 170, '二極體 OFF，電容鎖住', { cls: 'tm', fs: 13 }) + T(465, 198, '沒有放電路徑', { cls: 'ts', fs: 12 })),
    [{ sub: '輸入第一次爬上去：二極體導通，電容充到 <b>V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub></b>。', on: 'A' },
     { sub: '輸入往下掉：二極體 OFF，電容<b>沒地方放電</b>，電壓被鎖住。', on: 'B' }]);

  const C7 = sc('輸出 = 輸入 − 電容電壓', 'THE SHIFT',
    sine(80, 170, 480, 40, { cls: 'ln dsh', k: 'in' }) + path(u => sn(u) * 0.67 - 0.9, 80, 480, 215, 60, 'out') +
    T(570, 150, 'v<sub>i</sub>', { cls: 'tm', fs: 12, a: 'end', k: 'l1' }) + T(570, 255, 'v<sub>O</sub> 整個往下搬', { cls: 'ta', fs: 12, a: 'end', k: 'l2' }) +
    chip(320, 290, '最大 V<sub>B</sub> + V<sub>γ</sub>　最小 −2V<sub>M</sub> + V<sub>B</sub> + V<sub>γ</sub>', '擺幅還是 2V<sub>M</sub>', 'c', { fs: 12.5, acc: true }),
    [{ sub: 'v<sub>O</sub> = v<sub>i</sub> − V<sub>C</sub>：每個點都減同一個數。', on: 'in l1' },
     { sub: '整個波形被<b>往下搬</b>，形狀和擺幅都沒變。', on: 'out l2' },
     { sub: '最大值落在 V<sub>B</sub> + V<sub>γ</sub>，最小值是 −2V<sub>M</sub> + V<sub>B</sub> + V<sub>γ</sub>。', on: 'c' }]);

  const C8 = ansScene(['截波器：切掉超過門檻的部分', '雙向：中間 v<sub>O</sub> = v<sub>i</sub>，兩端被釘住', '箝位器：V<sub>C</sub> = V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>，v<sub>O</sub> = v<sub>i</sub> − V<sub>C</sub>'], ['截波：先找分界點，再分區寫 v<sub>O</sub>。', '雙向截波：兩個分界點、三個區間。', '箝位：電容鎖住峰值，輸出整個平移。']);

  window.__ch2p3Story = window.__Story('#story', {
    id: 'ch2-part3', title: 'CH2 PART 3 截波與箝位', after: '#map',
    scenes: [C0, C1, C2, C3, C4, C5, C6, C7, C8]
  });
})();
