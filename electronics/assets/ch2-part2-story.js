/* ============================================================
   電子學 CH2 PART 2 —— 故事模式（11/5 重寫：使用者說第一版太抽象）
   改法：每一幕都畫出真的電路，正半週、負半週分開畫「電流走哪條路」（流動的點），旁邊同步長出輸出波形；
   先講實物（手機充電器、電池充電器），每個新觀念先給生活比喻，最後才放數字。
   謎題：牆上插座是一下正一下負的交流，手機電池卻只吃直流 —— 怎麼把電流「趕成同一個方向」？
   數字跟講義一致：Example 2.1（24 V、12 V、0.6 V、100 Ω）、橋式板書（15 V、0.7 V）、Example 2.2（9 V）。
   需要：story.js、ch1-part5-kit.js（__K15）、ch2-skit.js（__C2S）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15 || !window.__C2S) return;
  const PV = window.__C2PIV;
  const K = window.__K15, D = K.D, Q = window.__C2S;
  const { g, T, calc, sc } = K;
  const { chip } = D;
  const { W, dio, res, vac, bat, flow, st, wave, axis, hline, coil, sin2 } = Q;
  const PX = 370, PW = 230, PY = 205, PA = 55;           /* 右邊波形面板 */
  const pos = u => Math.max(0, sin2(u)), neg = u => Math.max(0, -sin2(u));
  const half = u => (u < 0.25 || (u >= 0.5 && u < 0.75)) ? 1 : 0;   /* 正半週 */
  const panel = (key) => axis(PX, PY, PW, 70, key);

  /* 半波整流電路（PART 1 複習）*/
  const hw = (key, on) => g(key, vac(70, 200) + W('M70 184 V140 H156 M184 140 H280 V180 M280 220 V260 H70 V216') + dio(170, 140, 'r', '', 'D', on) + res(280, 200, true, '', 'R') +
    T(305, 150, '+', { cls: 'tm', fs: 13 }) + T(305, 250, '−', { cls: 'tm', fs: 13 }) + T(312, 205, 'v<sub>O</sub>', { cls: 'ta', fs: 14, a: 'start' }));
  const hwFlow = 'M70 184 V140 H156 M184 140 H280 V180 M280 220 V260 H70 V216';

  /* 電池充電器（Example 2.1）*/
  const chg = (key, on) => g(key, vac(60, 200, '', '24 sin ωt') + W('M60 184 V140 H120 M160 140 H206 M234 140 H300 V185 M300 215 V260 H60 V216') +
    res(140, 140, false, '', '100 Ω') + dio(220, 140, 'r', '', 'D', on) + bat(300, 200, true, '', '12 V'));

  /* 中間抽頭 */
  const CT = (key, d1, d2) => g(key, vac(30, 200) + W('M30 184 V120 H62 M30 216 V280 H62') + coil(62, 120, 280, 1) + W('M76 125 V275 M82 125 V275') +
    coil(100, 120, 195) + coil(100, 205, 280) + W('M100 195 V205') + '<circle class="ink" cx="100" cy="200" r="4"/>' +
    W('M100 120 H156 M184 120 H330 M280 120 V140 M280 180 V200 H100 M100 280 H156 M184 280 H330 V120') + '<circle class="ink" cx="280" cy="120" r="4"/>' +
    dio(170, 120, 'r', '', 'D<sub>1</sub>', d1) + dio(170, 280, 'r', '', ['D<sub>2</sub>', 0, 26], d2) + res(280, 160, true, '', 'R') +
    T(116, 160, 'v<sub>S</sub>', { cls: 't', fs: 12, a: 'start' }) + T(116, 244, 'v<sub>S</sub>', { cls: 't', fs: 12, a: 'start' }) + T(112, 216, '中間抽頭', { cls: 'ts', fs: 11, a: 'start' }));
  const ctPos = 'M100 200 V120 H156 M184 120 H280 V140 M280 180 V200 H100';
  const ctNeg = 'M100 200 V280 H156 M184 280 H330 V120 H280 V140 M280 180 V200 H100';

  /* 橋式：L(120,200) T(180,140) R(240,200) B(180,260) */
  const BR = (key, on12, on34) => g(key, vac(50, 230) + W('M50 214 V200 H120 M50 246 V310 H265 V200 H240 M180 140 V112 H320 V180 M320 220 V288 H180 V260') +
    W('M120 200 L180 140 L240 200 L180 260 Z') + dio(150, 170, -45, '', ['D<sub>1</sub>', -18, -6, 'end'], on12) + dio(210, 230, -45, '', ['D<sub>2</sub>', 18, 18, 'start'], on12) +
    dio(210, 170, 225, '', ['D<sub>3</sub>', 18, -6, 'start'], on34) + dio(150, 230, 225, '', ['D<sub>4</sub>', -18, 18, 'end'], on34) + res(320, 200, true, '', 'R') +
    ['120,200', '180,140', '240,200', '180,260'].map(p => '<circle class="ink" cx="' + p.split(',')[0] + '" cy="' + p.split(',')[1] + '" r="4"/>').join('') +
    T(340, 150, '+', { cls: 'tm', fs: 12 }) + T(340, 255, '−', { cls: 'tm', fs: 12 }) + T(28, 236, 'v<sub>S</sub>', { cls: 't', fs: 13, a: 'end' }));
  const brPos = 'M50 214 V200 H120 L180 140 V112 H320 V180 M320 220 V288 H180 V260 L240 200 H265 V310 H50 V246';
  const brNeg = 'M50 246 V310 H265 V200 H240 L180 140 V112 H320 V180 M320 220 V288 H180 V260 L120 200 H50 V214';

  /* ── 00 謎題 ── */
  const S0 = sc('插座是交流，手機要直流', 'THE PUZZLE',
    g('plug', '<rect class="bgw" x="80" y="150" width="90" height="100" rx="10"/><path class="ln" d="M105 150 V125 M145 150 V125" style="stroke-width:4"/>' + T(125, 205, '插座', { cls: 't', fs: 14 }) + T(125, 228, '110 V 交流', { cls: 'ts', fs: 11 })) +
    g('ac', wave(80, 290, 140, 18, sin2, '', 'lna')) +
    g('arr', '<path class="ln" d="M200 200 H270"/>' + T(235, 190, '充電器', { cls: 'tm', fs: 12 })) +
    g('ph', '<rect class="bgw" x="290" y="130" width="70" height="130" rx="12"/>' + T(325, 200, '手機', { cls: 't', fs: 14 }) + T(325, 222, '電池', { cls: 'ts', fs: 11 })) +
    chip(495, 175, '電池只吃單一方向的電流', '交流卻一下往右、一下往左', 'q1', { fs: 13 }) +
    chip(495, 245, '充電器裡怎麼做到的？', '答案就是這一頁', 'q2', { fs: 13, acc: true }),
    [{ sub: '牆上插座的電是<b>交流</b>：電流一下往這邊流、一下往那邊流。', on: 'plug ac' },
     { sub: '手機電池只能吃<b>同一個方向</b>的電流，不然一下充一下放。', on: 'ph q1' },
     { sub: '中間那個充電器，就是把電流「趕成同一個方向」。', on: 'arr' },
     { sub: '它裡面到底怎麼接？這一頁一步一步拆開來看。', on: 'q2' }]);

  /* ── 01 複習：二極體是單向門 ── */
  const S1 = sc('先複習：二極體是單向門', 'RECAP: ONE-WAY DOOR',
    g('d1', dio(200, 170, 'r', '', '', true) + W('M140 170 H186 M214 170 H260') + flow('M140 170 H186 M214 170 H260', 'f1') + T(200, 140, '順著箭頭：可以過（ON）', { cls: 'ta', fs: 13 })) +
    g('d2', dio(200, 260, 'r', '', '', false) + W('M140 260 H186 M214 260 H260') + T(200, 300, '逆著箭頭：擋住（OFF）', { cls: 'tm', fs: 13 })) +
    chip(470, 200, '像捷運的單向閘門', '只准往一個方向走', 'c', { fs: 13 }),
    [{ sub: 'PART 1 學過：二極體像一道<b>單向閘門</b>。', on: 'c' },
     { sub: '電流順著三角形箭頭的方向，可以過（ON，再吃掉 V<sub>γ</sub>）。', on: 'd1 f1' },
     { sub: '反方向就被擋住（OFF，像斷路）。', on: 'd2' }]);

  /* ── 02 複習：半波整流 ── */
  const S2 = sc('先複習：半波整流', 'RECAP: HALF-WAVE',
    hw('c', true) + panel('ax') + wave(PX, PY, PW, PA, sin2, 'in', 'ln dsh') + flow(hwFlow, 'fp') +
    wave(PX, PY, PW, PA, u => half(u) ? pos(u) : 0, 'out') + st(170, 172, true, 'on') + T(PX + PW / 2, PY + 90, '實線 = v<sub>O</sub>　虛線 = v<sub>S</sub>', { cls: 'ts', fs: 11, k: 'lg' }),
    [{ sub: '最簡單的做法：電源、一顆二極體、一個電阻 R（就是 PART 1 的半波整流）。', on: 'c' },
     { sub: '輸入是一上一下的弦波。', on: 'ax in lg' },
     { sub: '正半週：電流順著二極體走，繞一圈經過 R，R 上就有電壓。', on: 'fp on' },
     { sub: '輸出跟著輸入的正半週走（扣掉一點點 V<sub>γ</sub>）。', on: 'out' }]);

  const S3 = sc('負半週呢？', 'THE NEGATIVE HALF',
    hw('c', false) + panel('ax') + wave(PX, PY, PW, PA, sin2, 'in', 'ln dsh') + wave(PX, PY, PW, PA, u => Math.max(0, sin2(u)), 'out') +
    st(170, 172, false, 'off') + T(225, 300, 'R 沒有電流 → v<sub>O</sub> = 0', { cls: 'tm', fs: 13, k: 't' }) +
    g('x', '<path class="lna" d="M' + (PX + PW * 0.25 + 8) + ' 250 L' + (PX + PW * 0.5 - 8) + ' 290 M' + (PX + PW * 0.5 - 8) + ' 250 L' + (PX + PW * 0.25 + 8) + ' 290"/>' + T(PX + PW * 0.375, 310, '浪費掉', { cls: 'ta', fs: 12 })),
    [{ sub: '負半週，電流想反著走，卻撞到二極體的「背面」。', on: 'c off' },
     { sub: '二極體 OFF，整圈都沒有電流，R 上的電壓 = 0。', on: 't' },
     { sub: '所以輸出只剩正半週，一半的時間什麼都沒有。', on: 'ax in out' },
     { sub: '負半週整個被浪費了。等一下的「全波」就是要把它撿回來。', on: 'x' }]);

  /* ── 04 電池充電器 ── */
  const S4 = sc('應用一：電池充電器', 'BATTERY CHARGER',
    chg('c', false) + calc(380, 130, 220, [['電源峰值 24 V', 'r1', 't', 14], ['電池 12 V', 'r2', 't', 14], ['V<sub>γ</sub> = 0.6 V', 'r3', 't', 14], ['R = 100 Ω', 'r4', 't', 14]], { k: 'cc', lh: 30, title: 'Example 2.1' }),
    [{ sub: '同一招拿來充電：講義 Example 2.1，用 24 V 峰值的交流充一顆 12 V 的電池。', on: 'c cc r1 r2' },
     { sub: '中間串一個 100 Ω 限制電流、一顆二極體（V<sub>γ</sub> = 0.6 V）。', on: 'r3 r4' },
     { sub: '問題：二極體什麼時候才會通？', on: '' }]);

  /* 11/5 使用者：電池在半波整流裡是要幹嘛？→ 先講「它是被充電的那個」 */
  const S4b = sc('電池在這裡幹嘛？', 'WHAT IS THE BATTERY FOR?',
    chg('c', false) + '<g data-k="ring"><circle class="lna dsh" cx="300" cy="200" r="28" style="fill:none;stroke-width:2"/></g>' +
    chip(480, 150, '電池 = 要被充電的東西', '不是來幫忙供電的', 'c1', { fs: 13 }) +
    chip(480, 235, '整個電路只為一件事', '把這顆電池充飽', 'c2', { fs: 13, acc: true }),
    [{ sub: '先問一個問題：這顆電池在電路裡是幹嘛的？', on: 'c' },
     { sub: '它<b>不是</b>來幫忙供電的。', on: 'ring c1' },
     { sub: '它就是<b>要被充電的那個東西</b>：整個電路只為了把它充飽。', on: 'c2' }]);

  const S5 = sc('比喻：往水塔裡抽水', 'ANALOGY: WATER TOWER',
    g('tw', '<rect class="bgw" x="420" y="150" width="90" height="130" rx="6"/><rect class="accw" x="422" y="215" width="86" height="63"/>' + T(465, 205, '水位 12 V', { cls: 'ta', fs: 12 }) + T(465, 300, '電池 = 水塔', { cls: 't', fs: 13 })) +
    g('pump', '<circle class="bgw" cx="150" cy="240" r="34"/>' + T(150, 245, '抽水機', { cls: 't', fs: 12 }) + T(150, 300, '電源 = 抽水機', { cls: 't', fs: 13 })) +
    g('pipe', W('M184 240 H300 M330 240 H420') + '<path class="accw" style="stroke:var(--s-ink);stroke-width:2" d="M300 226 L300 254 L328 240 Z"/>' + T(315, 215, '單向閥', { cls: 'tm', fs: 12 })) +
    T(320, 130, '水壓要高過 12 V + 推開閥的 0.6 V', { cls: 'ta', fs: 15, k: 'th' }) +
    g('rr', '<rect class="accw" style="stroke:var(--s-ink);stroke-width:1.6" x="222" y="233" width="40" height="14" rx="3"/>' + T(242, 270, '電阻 = 水管縮小', { cls: 'tm', fs: 12 })) +
    g('bk', '<path class="lna dsh" style="fill:none;stroke-width:2" d="M412 196 H344"/><path class="acc" d="M344 189 L332 196 L344 203 Z"/>' + T(380, 182, '想倒流', { cls: 'ta', fs: 12 })) +
    g('bkx', T(318, 203, '✗', { cls: 'ta', fs: 20 }) + T(300, 182, '被閥擋住', { cls: 't', fs: 12, a: 'end' })),
    [{ sub: '把電池想成一座<b>水塔</b>，裡面已經有 12 V 的水位。', on: 'tw' },
     { sub: '電源是抽水機，二極體是一道單向閥。', on: 'pump pipe' },
     { sub: '抽水機的壓力要先高過水位 12 V，再多 0.6 V 推開閥，水才流得進去。', on: 'th' },
     { sub: '所以門檻是 12 + 0.6 = <b>12.6 V</b>。', on: '' },
     { sub: '電阻就是把水管縮小一點，水才不會一次衝太猛。', on: 'rr' },
     { sub: '電源比 12 V 低的時候呢？水塔反而比較高，水想<b>倒流</b>回去。', on: 'bk' },
     { sub: '單向閥（二極體）把它擋住：電池的電不會跑回電源。', on: 'bkx' }]);

  const S6 = sc('只有一小段時間在充電', 'CONDUCTION WINDOW',
    chg('c', true) + flow('M60 184 V140 H120 M160 140 H206 M234 140 H300 V185 M300 215 V260 H60 V216', 'fp') + st(220, 166, true, 'on') +
    panel('ax') + wave(PX, PY, PW, PA, sin2, 'in', 'ln dsh') + hline(PX, PX + PW, PY - PA * 12.6 / 24, 'th', '12.6 V') +
    wave(PX, PY, PW, PA, u => { const v = 24 * sin2(u); return v > 12.6 ? (v - 12.6) / 24 : 0; }, 'cur') + T(PX + PW / 2, PY + 90, '實線 = 電流的形狀', { cls: 'ts', fs: 11, k: 'lg' }),
    [{ sub: '電源的弦波（虛線）只有在<b>超過 12.6 V</b> 的那一小塊，二極體才 ON。', on: 'c ax in th' },
     { sub: '那一小段時間，電流從電源經過 R、二極體，灌進電池。', on: 'fp on' },
     { sub: '電流的形狀就是「超出去的那一截」：一小塊一小塊的。', on: 'cur lg' }]);

  const S7 = sc('算出什麼時候開、什麼時候關', 'THE ANGLES',
    calc(110, 112, 420, [['開：24 sin ωt = 12.6 ⟹ ωt = 31.7°', 'r1', 't', 15], ['關：對稱 180° − 31.7° = 148.3°', 'r2', 't', 15], ['最大電流 (24 − 0.6 − 12)/100 = 114 mA', 'r3', 'ta', 15], ['導通 (148.3 − 31.7)/360 ≈ 32.4% 的時間', 'r4', 'tm', 14]], { k: 'cc', lh: 38 }),
    [{ sub: '電源爬到 12.6 V 的那一刻就開始導通：24 sin ωt = 12.6，ωt = 31.7°。', on: 'cc r1' },
     { sub: '弦波左右對稱，往下掉回 12.6 V 時關掉：148.3°。', on: 'r2' },
     { sub: '電流最大在峰值：多出來的 24 − 0.6 − 12 = 11.4 V 全落在 100 Ω 上 → 114 mA。', on: 'r3' },
     { sub: '一個週期只有大約三分之一的時間在充電。', on: 'r4' }]);

  const S8 = sc('負半週：二極體要扛多少', 'PEAK INVERSE VOLTAGE',
    chg('c', false) + st(220, 166, false, 'off') + T(220, 115, '扛多少？', { cls: 'ta', fs: 13, k: 'q' }) +
    calc(380, 135, 225, [['電源谷底 −24 V', 'r1', 't', 14], ['電池還頂著 12 V', 'r2', 't', 14], ['二極體兩端 24 + 12', 'r3', 't', 14], ['PIV = 36 V', 'r4', 'ta', 17]], { k: 'cc', lh: 32 }),
    [{ sub: '負半週二極體 OFF，沒有電流，R 上沒有壓降。', on: 'c off' },
     { sub: '這時二極體兩端「被拉開」多少電壓？叫 <b>PIV</b>（最大逆向電壓）。', on: 'q' },
     { sub: '電源在谷底是 −24 V，另一邊電池還頂著 12 V，兩個加起來。', on: 'cc r1 r2 r3' },
     { sub: 'PIV = 36 V：買二極體要買耐得住 36 V 以上的。', on: 'r4' }]);


  /* PIV 看波形（11/5 使用者：PIV 到底是什麼 → 畫圖） */
  const pivScene = (kind, t, en, subs) => sc(t, en, (kind === 'chg' ? chg('c', false) : kind === 'ct' ? CT('c', false, false) : BR('c', false, false)).replace('<g', '<g transform="translate(-10,0) scale(0.92)"') + PV.story(kind, { x: 345, y: 108, w: 260, h: 190 }), subs);
  const S8b = pivScene('chg', '看波形：PIV 就是最低點', 'PIV ON A GRAPH', [
    { sub: '把二極體兩端的電壓 v<sub>D</sub> = 陽極 − 陰極 畫成波形。先畫座標：0 V 是下面那條線。', on: 'c pax' },
    { sub: '虛線是電源（±24 V），實線是電池那一端：一條固定在 +12 V 的水平線。', on: 'pvs pca' },
    { sub: '藍線是 v<sub>D</sub>：掉到 0 以下的那幾段（塗色），就是二極體被反向拉開、OFF 的時候。', on: 'pvd' },
    { sub: '電源掉到谷底那一瞬間，兩端距離最遠：12 − (−24) = 36 V。', on: 'pbr' },
    { sub: '藍線最低點的深度就是 <b>PIV = 36 V</b>：二極體最多要扛的反向電壓。', on: 'ppk' }]);

  /* 11/5：為什麼一定要二極體 */
  const noD = 'M60 184 V140 H120 M160 140 H300 V185 M300 215 V260 H60 V216';
  const S8c = sc('為什麼一定要二極體？', 'WHY THE DIODE?',
    g('c', vac(60, 200, '', '24 sin ωt') + W(noD) + res(140, 140, false, '', '100 Ω') + bat(300, 200, true, '', '12 V')) +
    T(230, 125, '二極體拿掉', { cls: 'ta', fs: 12, k: 'nd' }) +
    flow('M300 185 V140 H160 M120 140 H60 V184 M60 216 V260 H300 V215', 'fb') +
    chip(490, 130, '拿掉二極體、換成導線', '電源比 12 V 低的時候…', 'c1', { fs: 13 }) +
    chip(490, 200, '電池反過來放電', '充了又漏光', 'c2', { fs: 13 }) +
    chip(490, 270, '二極體 = 單向閥', '只准充、不准漏', 'c3', { fs: 13, acc: true }),
    [{ sub: '如果把二極體拿掉，換成一條導線會怎樣？', on: 'c nd c1' },
     { sub: '電源比 12 V 低的時候，電池反過來把電灌回電源：<b>充了又漏光</b>。', on: 'fb c2' },
     { sub: '所以二極體就是那道單向閥：只准充、不准漏。', on: 'c3' }]);

  const S9 = sc('先整理一下', 'SO FAR',
    calc(110, 118, 420, [['二極體 = 單向門，只讓正半週過', 'r1', 't', 15], ['半波：負半週輸出 0，浪費一半', 'r2', 't', 15], ['充電器：電源 &gt; 電池 + V<sub>γ</sub> 才導通', 'r3', 't', 15], ['不導通時看 PIV：二極體要扛的最大逆向電壓', 'r4', 'tm', 14]], { k: 'cc', lh: 38 }),
    [{ sub: '先整理一下到這裡的三件事。', on: 'cc r1' },
     { sub: '半波整流把負半週丟掉了。', on: 'r2' },
     { sub: '充電器只在電源高過「電池 + V<sub>γ</sub>」的時候才充。', on: 'r3' },
     { sub: '每一種電路都要問：關掉的那顆二極體要扛多少電壓（PIV）？', on: 'r4' }]);

  /* ── 10 全波的目標 ── */
  const S10 = sc('目標：負半週也翻上來', 'FULL-WAVE GOAL',
    panel('ax') + wave(PX - 220, PY, PW, PA, sin2, 'in', 'ln') + axis(PX - 220, PY, PW, 70, 'ax0') + T(PX - 105, PY + 95, '輸入 v<sub>S</sub>', { cls: 't', fs: 13, k: 'l0' }) +
    g('arr', '<path class="lna" d="M' + (PX - 50) + ' 205 H' + (PX - 10) + '"/>') +
    wave(PX, PY, PW, PA, u => Math.abs(sin2(u)), 'out') + T(PX + PW / 2, PY + 95, '輸出 |v<sub>S</sub>|', { cls: 'ta', fs: 13, k: 'l1' }),
    [{ sub: '我們想要的：正半週照樣過，負半週也<b>翻上來</b>變成正的。', on: 'ax0 in l0' },
     { sub: '輸出就變成一個接一個的小山丘：|v<sub>S</sub>|。這叫<b>全波整流</b>。', on: 'arr ax out l1' },
     { sub: '關鍵是：不管電源往哪邊推，流過 R 的電流都要<b>同一個方向</b>。講義給兩種接法。', on: '' }]);

  /* ── 11 中間抽頭：實物 ── */
  const S11 = sc('接法一：變壓器中間拉一條線', 'CENTER-TAPPED TRANSFORMER',
    CT('c', false, false) + chip(470, 150, '中間抽頭', '次級線圈正中間接一條線出來', 'c1', { fs: 13 }) +
    chip(470, 230, '上下兩半各是一個 v<sub>S</sub>', '方向剛好一正一反', 'c2', { fs: 13 }),
    [{ sub: '第一種：變壓器的次級線圈，在<b>正中間</b>多拉一條線出來，叫中間抽頭。', on: 'c c1' },
     { sub: '於是上半、下半各自是一個 v<sub>S</sub>，而且一個往上推時另一個往下推。', on: 'c2' },
     { sub: '上面接一顆 D<sub>1</sub>、下面接一顆 D<sub>2</sub>，兩顆的另一頭接在一起再到 R。', on: '' }]);

  const S12 = sc('正半週：上面那顆上班', 'POSITIVE HALF: D1 ON',
    CT('c', true, false) + flow(ctPos, 'fp') + st(170, 148, true, 'o1') + st(170, 262, false, 'o2') +
    panel('ax') + wave(PX, PY, PW, PA, u => half(u) ? pos(u) : 0, 'out'),
    [{ sub: '正半週：上半線圈的頂端是 +，推電流往右。', on: 'c' },
     { sub: 'D<sub>1</sub> 順向 ON，電流經過 D<sub>1</sub>、往下流過 R，再從中間抽頭回去。', on: 'fp o1' },
     { sub: '下半線圈這時推的方向剛好讓 D<sub>2</sub> 逆偏 → OFF。', on: 'o2' },
     { sub: '輸出長出第一個山丘。', on: 'ax out' }]);

  const S13 = sc('負半週：換下面那顆上班', 'NEGATIVE HALF: D2 ON',
    CT('c', false, true) + flow(ctNeg, 'fn') + st(170, 148, false, 'o1') + st(170, 262, true, 'o2') +
    panel('ax') + wave(PX, PY, PW, PA, u => Math.abs(sin2(u)), 'out'),
    [{ sub: '負半週：換下半線圈的底端是 +。', on: 'c' },
     { sub: 'D<sub>2</sub> ON，電流繞上來，<b>一樣由上往下</b>流過 R。', on: 'fn o2' },
     { sub: 'D<sub>1</sub> 這時 OFF。兩顆像值班一樣輪流上班。', on: 'o1' },
     { sub: '流過 R 的方向沒變 → 負半週也變成正的山丘。', on: 'ax out' }]);

  const S14 = sc('中間抽頭：輸出和 PIV', 'CENTER-TAP RESULTS',
    calc(100, 112, 440, [['每瞬間只有一顆 ON：v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>', 'r1', 't', 15], ['|v<sub>S</sub>| &lt; V<sub>γ</sub> 時兩顆都 OFF（不導通區）', 'r2', 't', 14], ['關著那顆跨過整個次級（兩半線圈）：', 'r3', 'tm', 14], ['PIV = 2V<sub>m</sub> − V<sub>γ</sub>', 'r4', 'ta', 17]], { k: 'cc', lh: 38 }),
    [{ sub: '電流每次只經過<b>一顆</b>二極體，所以輸出 = |v<sub>S</sub>| 扣一個 V<sub>γ</sub>。', on: 'cc r1' },
     { sub: '電源還很小（|v<sub>S</sub>| &lt; V<sub>γ</sub>）時，兩顆都推不開 → 輸出 0。', on: 'r2' },
     { sub: '關著的那顆最慘：一邊是自己那半線圈的谷底，一邊是輸出的峰值。', on: 'r3' },
     { sub: '加起來 PIV = 2V<sub>m</sub> − V<sub>γ</sub>，大約是峰值的兩倍。', on: 'r4' }]);


  const S14b = pivScene('ct', '看波形：中間抽頭的 PIV', 'CENTER-TAP PIV ON A GRAPH', [
    { sub: '一樣畫關著那顆 D<sub>2</sub> 的兩端電壓（V<sub>m</sub> = 15 V、V<sub>γ</sub> = 0.7 V，中間抽頭當 0 V）。', on: 'c pax pvs' },
    { sub: '虛線是 D<sub>2</sub> 的陽極（下半線圈 −v<sub>S</sub>），實線是陰極（輸出，永遠 ≥ 0）。', on: 'pan pca' },
    { sub: '一個往下、一個往上，離得最遠時差 15 + 14.3 = 29.3 V。', on: 'pvd pbr' },
    { sub: '<b>PIV = 2V<sub>m</sub> − V<sub>γ</sub> = 29.3 V</b>：跨整個次級，大約兩個峰值。', on: 'ppk' }]);

  /* ── 15 橋式：實物 ── */
  const S15 = sc('接法二：橋式（考試第 4 題）', 'BRIDGE RECTIFIER',
    g('chip', '<rect class="bgw" x="110" y="150" width="120" height="100" rx="8"/>' + T(170, 195, '橋式整流', { cls: 't', fs: 14 }) + T(170, 218, '（四顆二極體）', { cls: 'ts', fs: 11 }) +
      [125, 155, 185, 215].map((x, i) => '<path class="ln" d="M' + x + ' 250 V280" style="stroke-width:3"/>' + T(x, 298, ['~', '+', '−', '~'][i], { cls: 'ta', fs: 14 })).join('')) +
    chip(450, 150, '手機充電器裡就有這顆', '兩隻 ~ 接交流、+ − 出直流', 'c1', { fs: 13 }) +
    chip(450, 235, '不用中間抽頭的變壓器', '代價：要四顆二極體', 'c2', { fs: 13, acc: true }),
    [{ sub: '第二種：<b>橋式整流</b>。充電器裡常見一顆四隻腳的小元件，裡面就是四顆二極體。', on: 'chip' },
     { sub: '兩隻 ~ 腳接交流，+、− 腳出來就是整流後的電。', on: 'c1' },
     { sub: '好處是變壓器不用中間抽頭；代價是要四顆二極體。老師說期中考第 4 題考這個。', on: 'c2' }]);

  const S16 = sc('橋式：正半週 D₁、D₂ 上班', 'POSITIVE HALF: D1, D2',
    BR('c', true, false) + flow(brPos, 'fp') + st(160, 192, true, 'o1') + st(200, 222, true, 'o2') + st(200, 192, false, 'o3') + st(160, 222, false, 'o4') +
    panel('ax') + wave(PX + 20, PY, PW - 20, PA, u => half(u) ? pos(u) : 0, 'out'),
    [{ sub: '四顆排成一個菱形：電源接左右兩個角，R 接上下兩個角。', on: 'c' },
     { sub: '正半週：電源上面是 +，電流從左角出發，只能走 D<sub>1</sub> 往上。', on: 'fp o1' },
     { sub: '由上往下流過 R，到下面的角，再走 D<sub>2</sub> 到右角、回電源。', on: 'o2' },
     { sub: 'D<sub>3</sub>、D<sub>4</sub> 被反向推 → OFF。輸出長出第一個山丘。', on: 'o3 o4 ax out' }]);

  const S17 = sc('橋式：負半週 D₃、D₄ 上班', 'NEGATIVE HALF: D3, D4',
    BR('c', false, true) + flow(brNeg, 'fn') + st(160, 192, false, 'o1') + st(200, 222, false, 'o2') + st(200, 192, true, 'o3') + st(160, 222, true, 'o4') +
    panel('ax') + wave(PX + 20, PY, PW - 20, PA, u => Math.abs(sin2(u)), 'out'),
    [{ sub: '負半週：電源下面變成 +，電流從右角出發。', on: 'c' },
     { sub: '這次走 D<sub>3</sub> 到上角，<b>一樣由上往下</b>流過 R。', on: 'fn o3' },
     { sub: '再走 D<sub>4</sub> 回到左角。D<sub>1</sub>、D<sub>2</sub> 這時 OFF。', on: 'o4 o1 o2' },
     { sub: '流過 R 的方向沒變 → 兩個半週都是正的山丘。', on: 'ax out' }]);

  const S18 = sc('橋式：每次經過兩顆', 'BRIDGE RESULTS',
    calc(90, 108, 460, [['電流一進一出經過兩顆：v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>', 'r1', 't', 15], ['不導通區：|v<sub>S</sub>| &lt; 2V<sub>γ</sub>', 'r2', 't', 15], ['關著的兩顆，每顆都扛：PIV = V<sub>m</sub> − V<sub>γ</sub>', 'r3', 'ta', 15], ['板書：V<sub>m</sub> = 15 V ⟹ 峰值 13.6 V、PIV 14.3 V、|v<sub>S</sub>| &lt; 1.4 V 時 0', 'r4', 'tm', 13]], { k: 'cc', lh: 38 }),
    [{ sub: '回頭看路線：電流每次都要經過<b>兩顆</b> ON 的二極體，所以扣兩個 V<sub>γ</sub>。', on: 'cc r1' },
     { sub: '電源小於 2V<sub>γ</sub> 時推不開兩顆 → 輸出 0。', on: 'r2' },
     { sub: '關著的有<b>兩顆</b>，每一顆都是「電源峰值 V<sub>m</sub> 扣掉旁邊一顆 ON 的 V<sub>γ</sub>」：PIV = V<sub>m</sub> − V<sub>γ</sub>。', on: 'r3' },
     { sub: '套板書的數字：15 V 峰值 → 輸出 13.6 V、PIV 14.3 V。', on: 'r4' }]);


  const S18b = pivScene('br', '看波形：橋式的 PIV', 'BRIDGE PIV ON A GRAPH', [
    { sub: '畫關著的 D<sub>3</sub>（D<sub>4</sub> 一樣）。照 11/3 板書，右角當 0 V。', on: 'c pax pvs' },
    { sub: '虛線是陽極（右角 0 V），實線是陰極（上角 = v<sub>S</sub> − V<sub>γ</sub>）。', on: 'pan pca' },
    { sub: '正半週峰值時兩端差 14.3 − 0 = 14.3 V。', on: 'pvd pbr' },
    { sub: '<b>PIV = V<sub>m</sub> − V<sub>γ</sub> = 14.3 V</b>：只跨一個 v<sub>S</sub>，是中間抽頭的一半。', on: 'ppk' }]);

  const S19 = sc('兩種全波比一比', 'COMPARE',
    calc(80, 108, 480, [['　　　　　中間抽頭　｜　橋式', 'r0', 'ts', 13], ['輸出峰值　V<sub>m</sub> − V<sub>γ</sub>　｜　V<sub>m</sub> − 2V<sub>γ</sub>', 'r1', 't', 14], ['不導通區　±V<sub>γ</sub>　｜　±2V<sub>γ</sub>', 'r2', 't', 14], ['PIV　2V<sub>m</sub> − V<sub>γ</sub>　｜　V<sub>m</sub> − V<sub>γ</sub>', 'r3', 'ta', 14], ['二極體　2 顆（要抽頭）｜　4 顆', 'r4', 't', 14], ['Example 2.2（輸出 9 V）PIV：18.7 V ｜ 9.7 V', 'r5', 'tm', 13]], { k: 'cc', lh: 32 }),
    [{ sub: '把兩種全波放在一起比。', on: 'cc r0' },
     { sub: '橋式每次過兩顆，輸出少一個 V<sub>γ</sub>、不導通區寬一倍。', on: 'r1 r2' },
     { sub: '但橋式的 PIV 只有一半左右 —— 這是它最大的好處。', on: 'r3' },
     { sub: '代價：橋式 4 顆；中間抽頭只要 2 顆，但變壓器要抽頭。', on: 'r4' },
     { sub: 'Example 2.2 同樣要 9 V 輸出：中間抽頭 PIV 18.7 V，橋式只要 9.7 V。', on: 'r5' }]);

  const S20 = sc('恍然大悟', 'GOT IT',
    chip(320, 112, '充電器把電流趕成同一個方向', '靠二極體輪流 ON：不管電源往哪推，R 上方向都一樣', 'c1', { fs: 14 }) +
    chip(320, 172, '橋式：兩顆兩顆輪流', '輸出 |v<sub>S</sub>| − 2V<sub>γ</sub>、PIV = V<sub>m</sub> − V<sub>γ</sub>', 'c2', { fs: 14 }) +
    chip(320, 232, '下一頁：截波與箝位', '同一顆單向門，拿來「削」波形', 'c3', { fs: 14, acc: true }),
    [{ sub: '謎題解開：充電器裡的二極體輪流上班，讓流過負載的電流永遠同一個方向。', on: 'c1' },
     { sub: '橋式是考試重點：每次兩顆 ON，輸出扣 2V<sub>γ</sub>，PIV = V<sub>m</sub> − V<sub>γ</sub>。', on: 'c2' },
     { sub: '下一頁：同樣的單向門，拿來削掉波形太高的部分。', on: 'c3' }]);

  window.__ch2p2Story = window.__Story('#story', {
    id: 'ch2p2v2', title: 'CH2 PART 2 整流電路', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S4b, S5, S6, S7, S8, S8b, S8c, S9, S10, S11, S12, S13, S14, S14b, S15, S16, S17, S18, S18b, S19, S20]
  });
})();
