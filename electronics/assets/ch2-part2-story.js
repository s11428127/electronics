/* ============================================================
   電子學 CH2 PART 2 —— 故事模式
   謎題：24 V 的交流要幫 12 V 的電池充電，二極體到底「什麼時候」通？
   之後：半波浪費了負半週 → 全波（中間抽頭、橋式）→ 比一比。
   需要：story.js、ch1-part5-kit.js（__K15）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15) return;
  const K = window.__K15, D = K.D;
  const { g, T, calc, sc, sine, f1, ansScene } = K;
  const { chip } = D;
  const card = (x, y, w, h, key, inner) => g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"/>' + inner);
  const path = (fn, x0, w, ym, A, n, key, style) => {
    let d = '';
    for (let i = 0; i <= n; i++) { const u = i / n; d += (i ? ' L' : 'M') + f1(x0 + u * w) + ' ' + f1(ym - A * fn(u)); }
    return '<path class="lna" style="fill:none;stroke-width:2.6' + (style || '') + '" d="' + d + '"' + K.k(key) + '/>';
  };
  const sn = u => Math.sin(u * 2 * Math.PI * 2);

  /* 0 謎題 */
  const C0 = sc('24 V 的交流，充 12 V 的電池', 'THE QUESTION',
    sine(80, 200, 480, 60, { cls: 'ln', k: 'ac' }) +
    '<line class="lna dsh" x1="80" y1="164" x2="560" y2="164" style="stroke-width:1.6"' + K.k('th') + '/>' + T(560, 154, '12.6 V', { cls: 'ta', fs: 13, a: 'end', k: 'thl' }) +
    chip(320, 285, '二極體什麼時候會通？', '電源 24 sin ωt、電池 12 V', 'q', { fs: 13, acc: true }),
    [{ sub: '有一顆 12 V 的電池要充電，電源是 <b>24 V 峰值</b>的交流，中間串一顆二極體。', on: 'ac' },
     { sub: '電源超過 12 V 就通嗎？還要多推開二極體的 0.6 V，所以門檻是 <b>12.6 V</b>。', on: 'th thl' },
     { sub: '那它一個週期裡，到底通多久？', on: 'q' }]);

  /* 1 水塔比喻 */
  const C1 = sc('比喻：往水塔裡抽水', 'ANALOGY',
    card(60, 110, 230, 150, 'A', T(175, 140, '電池 = 水塔', { fs: 15, cls: 'ta' }) + T(175, 170, '水位 12 V', { cls: 'tm', fs: 13 }) + T(175, 198, '水要高過水位才進得去', { cls: 'ts', fs: 12 })) +
    card(350, 110, 230, 150, 'B', T(465, 140, '二極體 = 單向閥', { fs: 15, cls: 'ta' }) + T(465, 170, '還要再推開 0.6 V', { cls: 'tm', fs: 13 }) + T(465, 198, '門檻 12 + 0.6 = 12.6 V', { cls: 'ts', fs: 12 })),
    [{ sub: '電池像一座水塔，水位 12 V：電源的「水壓」沒高過它，水進不去。', on: 'A' },
     { sub: '二極體像單向閥，還要多花 0.6 V 才推得開。<b>電源高過 12.6 V 才有電流。</b>', on: 'B' }]);

  /* 2 導通角 */
  const C2 = sc('導通的時間不到一半', 'CONDUCTION ANGLE',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'ac' }) +
    '<line class="ln dsh" x1="80" y1="164" x2="560" y2="164"/>' +
    path(u => Math.max(0, sn(u) - 0.525) * 1, 80, 480, 200, 60, 160, 'on', ';stroke-dasharray:none') +
    T(180, 262, '31.7°', { cls: 'ta', fs: 13, k: 'a1' }) + T(300, 262, '148.3°', { cls: 'ta', fs: 13, k: 'a2' }) +
    chip(470, 112, '只有高過 12.6 V 的那一塊', '才有電流', 'c', { fs: 13, acc: true }),
    [{ sub: '虛線是電源。只有<b>超過 12.6 V 的那一小塊</b>，二極體才通。', on: 'ac on c' },
     { sub: '起始角：24 sin ωt = 12.6 ⇒ <b>31.7°</b>。', on: 'a1' },
     { sub: '結束角對稱：180° − 31.7° = <b>148.3°</b>。', on: 'a2' }]);

  /* 3 公式 */
  const C3 = sc('Example 2.1 一次算完', 'EXAMPLE 2.1',
    calc(110, 108, 420, [['最大電流 (24 − 0.6 − 12)/100 = 114 mA', 'r1', 'ta', 15], ['導通角 31.7° ～ 148.3°', 'r2'], ['導通比例 (148.3 − 31.7)/360 = 32.4 %', 'r3'], ['PIV = V<sub>B</sub> + V<sub>M</sub> = 12 + 24 = 36 V', 'r4', 'ta']], { k: 'cc', fs: 15, lh: 36 }),
    [{ sub: '電流最大在峰值：<b>114 mA</b>。', on: 'cc r1' },
     { sub: '導通角 31.7° 到 148.3°，約只佔 <b>32.4 %</b> 的時間。', on: 'r2 r3' },
     { sub: '負半週谷底，二極體扛 −24 V 加電池 12 V：PIV = <b>36 V</b>。', on: 'r4' }]);

  /* 4 先整理 */
  const C4 = sc('先整理一下', 'LET\'S RECAP',
    card(60, 116, 250, 130, 'A', T(185, 146, '半波整流', { fs: 16 }) + T(185, 176, '只用正半週', { cls: 'tm', fs: 13 }) + T(185, 204, '負半週整個浪費', { cls: 'ts', fs: 12 })) +
    card(330, 116, 250, 130, 'B', T(455, 146, '全波整流', { fs: 16, cls: 'ta' }) + T(455, 176, '兩個半週都用', { cls: 'tm', fs: 13 }) + T(455, 204, '輸出頻率變兩倍', { cls: 'ts', fs: 12 })),
    [{ sub: '先整理：半波只用正半週，負半週整個白白浪費。', on: 'A' },
     { sub: '<b>全波</b>把負半週翻成正的，兩個半週都用，輸出一秒有 120 顆駝峰。', on: 'B' }]);

  /* 5 翻正 */
  const C5 = sc('把負半週翻上來', 'FLIP THE NEGATIVE HALF',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'in' }) + path(u => Math.abs(sn(u)), 80, 480, 250, 60, 200, 'abs') +
    T(320, 120, '輸入 v<sub>S</sub>（虛線）', { cls: 'tm', fs: 12, k: 'l1' }) + T(320, 282, '輸出 |v<sub>S</sub>| − 損失（藍色）', { cls: 'ta', fs: 12, k: 'l2' }),
    [{ sub: '輸入是一上一下的弦波（虛線）。', on: 'in l1' },
     { sub: '全波整流的目標：負的那半也翻上來，變成 <b>|v<sub>S</sub>|</b>。', on: 'abs l2' }]);

  /* 6 中間抽頭 */
  const C6 = sc('中間抽頭：兩顆輪流上班', 'CENTER-TAPPED',
    card(60, 110, 240, 140, 'A', T(180, 138, '正半週', { fs: 15, cls: 'ta' }) + T(180, 168, '上面那顆通', { cls: 'tm', fs: 13 }) + T(180, 196, '下面那顆關', { cls: 'ts', fs: 12 })) +
    card(340, 110, 240, 140, 'B', T(460, 138, '負半週', { fs: 15, cls: 'ta' }) + T(460, 168, '下面那顆通', { cls: 'tm', fs: 13 }) + T(460, 196, '上面那顆關', { cls: 'ts', fs: 12 })) +
    chip(320, 285, 'v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>', '每瞬間只有一顆通 → 只扣 1 個 V<sub>γ</sub>', 'c', { fs: 13, acc: true }),
    [{ sub: '次級線圈中間引出一個抽頭：正半週上面那顆通。', on: 'A' },
     { sub: '負半週換下面那顆通 —— 兩顆輪流。', on: 'B' },
     { sub: '每瞬間<b>只有一顆</b>通：v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>。關著的那顆 PIV = 2V<sub>m</sub> − V<sub>γ</sub>。', on: 'c' }]);

  /* 7 橋式 */
  const C7 = sc('橋式：四顆，一進一出', 'THE BRIDGE',
    card(60, 110, 240, 140, 'A', T(180, 138, '正半週', { fs: 15, cls: 'ta' }) + T(180, 168, '電流從一顆進', { cls: 'tm', fs: 13 }) + T(180, 196, '再從對角那顆出', { cls: 'ts', fs: 12 })) +
    card(340, 110, 240, 140, 'B', T(460, 138, '負半週', { fs: 15, cls: 'ta' }) + T(460, 168, '換另一對通', { cls: 'tm', fs: 13 }) + T(460, 196, '輸出方向不變', { cls: 'ts', fs: 12 })) +
    chip(320, 285, 'v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>', '電流經過兩顆 → 扣 2 個 V<sub>γ</sub>；PIV = V<sub>m</sub> − V<sub>γ</sub>', 'c', { fs: 13, acc: true }),
    [{ sub: '橋式用四顆：正半週一對通。', on: 'A' },
     { sub: '負半週換另一對通，電流流過負載的方向<b>一樣</b>。', on: 'B' },
     { sub: '電流<b>一進一出</b>經過兩顆：多吃一個 V<sub>γ</sub>，但 PIV 小一半。', on: 'c' }]);

  /* 8 比一比 */
  const C8 = sc('三個數字比一比', 'COMPARE',
    calc(90, 110, 460, [['輸出　中間抽頭 −V<sub>γ</sub>　｜　橋式 −2V<sub>γ</sub>', 'r1', 't', 15], ['死區　±V<sub>γ</sub>　｜　±2V<sub>γ</sub>', 'r2', 't', 15], ['PIV　2V<sub>m</sub> − V<sub>γ</sub>　｜　V<sub>m</sub> − V<sub>γ</sub>', 'r3', 'ta', 15], ['二極體　2 顆　｜　4 顆', 'r4', 't', 15]], { k: 'cc', fs: 15, lh: 36 }),
    [{ sub: '輸出和死區：橋式多扣一個 V<sub>γ</sub>。', on: 'cc r1 r2' },
     { sub: 'PIV：橋式小一半 —— 這是橋式最大的好處。', on: 'r3' },
     { sub: '代價：橋式要 4 顆二極體；中間抽頭只要 2 顆但次級要抽頭。', on: 'r4' }]);

  /* 9 答案 */
  const C9 = ansScene(['120 V rms、輸出峰值 9 V、V<sub>γ</sub> = 0.7 V', '中間抽頭：9.7 V、6.86 V、17.5、PIV 18.7 V', '橋式：10.4 V、7.35 V、16.3、PIV 9.7 V'], ['Example 2.2：兩種電路各自算出次級電壓、匝數比、PIV。', '橋式匝數比較小、PIV 約一半。']);

  window.__ch2p2Story = window.__Story('#story', {
    id: 'ch2-part2', title: 'CH2 PART 2 整流器', after: '#map',
    scenes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9]
  });
})();
