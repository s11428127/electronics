/* ============================================================
   電子學 CH2 PART 3 —— 故事模式（11/5 重寫：使用者說第一版太抽象）
   改法：每個電路都畫出來，分「二極體 OFF」「二極體 ON」兩幕，畫出電流走哪條路（流動的點），
   旁邊同步畫輸入（虛線）和輸出（實線）；解題三步驟（假設 OFF → 找分界點 → 分區寫 v_O）一直重複。
   謎題：訊號峰值 10 V，後面的晶片最多只吃 4.7 V（V_B = 4 V、V_γ = 0.7 V）。
   數字跟講義一致：並聯 V_B = 4 V、雙向 Example 2.7（V_B1 = 2 V、V_B2 = 4 V、R1 = R2、V_γ = 0、v_i 峰值 6 V）、
   箝位器式子 V_C = V_M − V_B − V_γ。
   需要：story.js、ch1-part5-kit.js（__K15）、ch2-skit.js（__C2S）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15 || !window.__C2S) return;
  const K = window.__K15, D = K.D, Q = window.__C2S;
  const { g, T, calc, sc } = K;
  const { chip } = D;
  const { W, dio, res, vac, bat, cap, flow, st, wave, axis, hline, sin2 } = Q;
  const PX = 380, PW = 220, PY = 205, PA = 60, VM = 10;          /* 波形面板：PA 像素 = 10 V */
  const vy = v => PY - PA * v / VM;
  const panel = key => axis(PX, PY, PW, 75, key);
  const vin = (key, m) => wave(PX, PY, PW, PA * (m || VM) / VM, sin2, key, 'ln dsh');
  const vout = (fn, key) => wave(PX, PY, PW, PA / VM, u => fn(VM * sin2(u)), key);
  const vout2 = (m, fn, key) => wave(PX, PY, PW, PA / VM, u => fn(m * sin2(u)), key);
  /* 只畫條件成立的那幾段 */
  const seg = (fn, ok, key) => { let d = '', pen = false; for (let i = 0; i <= 160; i++) { const u = i / 160, v = fn(u); if (ok(v)) { d += (pen ? ' L' : ' M') + (PX + u * PW).toFixed(1) + ' ' + vy(v).toFixed(1); pen = true; } else pen = false; }
    return '<path class="lna" style="fill:none;stroke-width:2.6" data-k="' + key + '" d="' + d.trim() + '"/>'; };
  /* 依輸入 v_i 的條件畫輸出的那幾段（11/6） */
  const segU = (out, ok, key, m) => { m = m || VM; let d = '', pen = false; for (let i = 0; i <= 160; i++) { const u = i / 160, vi = m * sin2(u); if (ok(vi)) { d += (pen ? ' L' : ' M') + (PX + u * PW).toFixed(1) + ' ' + vy(out(vi)).toFixed(1); pen = true; } else pen = false; }
    return '<path class="lna" style="fill:none;stroke-width:2.8" data-k="' + key + '" d="' + d.trim() + '"/>'; };
  const sm = (svg) => svg.replace('<g', '<g transform="translate(-8,6) scale(0.92)"');
  /* 水平電池（長線 = +） */
  const hbat = (x, y, plusLeft, lab) => {
    const a = plusLeft ? -5 : 5;
    return '<line class="ln" x1="' + (x + a) + '" y1="' + (y - 15) + '" x2="' + (x + a) + '" y2="' + (y + 15) + '"/><line class="ln" x1="' + (x - a) + '" y1="' + (y - 8) + '" x2="' + (x - a) + '" y2="' + (y + 8) + '" style="stroke-width:3.6"/>' +
      T(x + (plusLeft ? -14 : 14), y - 18, '+', { cls: 'tm', fs: 12 }) + (lab ? T(x, y + 32, lab, { cls: 't', fs: 13 }) : '');
  };
  const outT = (x, yt, yb) => '<circle class="bgw" cx="' + x + '" cy="' + yt + '" r="4"/><circle class="bgw" cx="' + x + '" cy="' + yb + '" r="4"/>' +
    T(x + 4, yt + 22, '+', { cls: 'tm', fs: 12 }) + T(x + 4, yb - 10, '−', { cls: 'tm', fs: 12 }) + T(x + 10, (yt + yb) / 2 + 5, 'v<sub>O</sub>', { cls: 'ta', fs: 14, a: 'start' });

  /* 並聯截波：dir 'd' 或 'u'、電池 + 在上或下 */
  const SH = (key, on, o) => { o = o || {};
    return g(key, vac(50, 210, '', 'v<sub>i</sub>') + W('M50 194 V140 H110 M150 140 H310 M220 140 V166 M220 194 V222 M220 248 V280 M50 226 V280 H310') + res(130, 140, false, '', 'R') +
      '<circle class="ink" cx="220" cy="140" r="4"/><circle class="ink" cx="220" cy="280" r="4"/>' + dio(220, 180, o.dir || 'd', '', 'D', on) + bat(220, 235, o.plusTop !== false, '', o.vb || 'V<sub>B</sub>') + outT(310, 140, 280)); };
  const shOn = 'M50 194 V140 H220 V166 M220 194 V222 M220 248 V280 H50 V226';

  /* 串聯截波：v_i → V_B（+ 在左）→ D（尖端朝左）→ 輸出接 R 到地 */
  const SE = (key, on) => g(key, vac(50, 210, '', 'v<sub>i</sub>') + W('M50 194 V140 H100 M120 140 H176 M204 140 H310 M260 140 V190 M260 230 V280 M50 226 V280 H310') + hbat(110, 140, true, 'V<sub>B</sub>') +
    dio(190, 140, 'l', '', 'D', on) + res(260, 210, true, '', 'R') + '<circle class="ink" cx="260" cy="140" r="4"/><circle class="ink" cx="260" cy="280" r="4"/>' + outT(310, 140, 280));
  const seOn = 'M260 280 V230 M260 190 V140 H204 M176 140 H120 M100 140 H50 V194 M50 226 V280 H260';

  /* 雙向截波 */
  const BD = (key, on1, on2) => g(key, vac(40, 210, '', 'v<sub>i</sub>') + W('M40 194 V140 H90 M130 140 H320 M190 140 V166 M190 194 V222 M190 248 V280 M270 140 V166 M270 194 V222 M270 248 V280 M40 226 V280 H320') + res(110, 140, false, '', 'R') +
    ['190,140', '270,140', '190,280', '270,280'].map(p => '<circle class="ink" cx="' + p.split(',')[0] + '" cy="' + p.split(',')[1] + '" r="4"/>').join('') +
    dio(190, 180, 'd', '', ['D<sub>1</sub>', -18, 5, 'end'], on1) + bat(190, 235, true, '', 'V<sub>B1</sub>', 'l') + dio(270, 180, 'u', '', 'D<sub>2</sub>', on2) + bat(270, 235, false, '', 'V<sub>B2</sub>') + outT(320, 140, 280));

  /* 箝位器 */
  const CL = (key, on) => g(key, vac(50, 210, '', 'v<sub>i</sub>') + W('M50 194 V140 H126 M134 140 H310 M220 140 V166 M220 194 V222 M220 248 V280 M50 226 V280 H310') + cap(130, 140, false, '', 'C') +
    '<circle class="ink" cx="220" cy="140" r="4"/><circle class="ink" cx="220" cy="280" r="4"/>' + dio(220, 180, 'd', '', 'D', on) + bat(220, 235, true, '', 'V<sub>B</sub>') + outT(310, 140, 280));

  /* ── 00 謎題 ── */
  const S0 = sc('10 V 的訊號，晶片只吃 4.7 V', 'THE PUZZLE',
    g('sig', wave(70, 210, 170, 50, sin2, '', 'lna') + T(155, 290, '訊號峰值 10 V', { cls: 't', fs: 13 })) +
    g('box', '<rect class="bgw" x="300" y="170" width="90" height="80" rx="8"/>' + T(345, 205, '保護', { cls: 't', fs: 13 }) + T(345, 225, '電路', { cls: 't', fs: 13 }) + '<path class="ln" d="M250 210 H300"/>') +
    g('ic', '<path class="ln" d="M390 210 H440"/><rect class="bgw" x="440" y="165" width="110" height="90" rx="6"/>' + T(495, 205, '晶片', { cls: 't', fs: 14 }) + T(495, 228, '最多 4.7 V', { cls: 'ta', fs: 12 })) +
    T(320, 130, '超過 4.7 V 的部分要「削掉」', { cls: 'ta', fs: 15, k: 'q' }),
    [{ sub: '有一個訊號，峰值 <b>10 V</b>。', on: 'sig' },
     { sub: '後面的晶片最多只能吃 <b>4.7 V</b>，太高會燒掉。', on: 'ic' },
     { sub: '中間要放一個電路，把超過 4.7 V 的部分削掉，其他照原樣送過去。', on: 'box q' },
     { sub: '這種電路叫<b>截波器</b>（clipper）。只要一顆二極體加一顆電池就做得到。', on: '' }]);

  const S1 = sc('先複習：二極體的兩種樣子', 'RECAP: ON / OFF',
    g('on', dio(170, 170, 'r', '', '', true) + W('M110 170 H156 M184 170 H230') + T(170, 140, 'ON：像一顆 0.7 V 的小電池', { cls: 'ta', fs: 13 }) + T(170, 200, '兩端固定 V<sub>γ</sub>', { cls: 'ts', fs: 12 })) +
    g('off', dio(170, 260, 'r', '', '', false) + W('M110 260 H156 M184 260 H230') + T(170, 230, 'OFF：像斷路', { cls: 'tm', fs: 13 }) + T(170, 290, '沒有電流', { cls: 'ts', fs: 12 })) +
    chip(460, 215, '解題永遠先問：它 ON 還是 OFF？', '', 'c', { fs: 13, acc: true }),
    [{ sub: 'PART 1 學過：二極體 ON 時，兩端固定是 V<sub>γ</sub>，像一顆 0.7 V 的小電池。', on: 'on' },
     { sub: 'OFF 時就是斷路，沒有電流。', on: 'off' },
     { sub: '這一頁每一個電路，都是先問：二極體現在 ON 還是 OFF？', on: 'c' }]);

  const S2 = sc('比喻：水壩的溢洪道', 'ANALOGY: SPILLWAY',
    g('dam', '<path class="ln" d="M120 300 V160 H260 V300" style="stroke-width:3"/><rect class="accw" x="122" y="200" width="136" height="98"/>' + T(190, 250, '水庫', { cls: 't', fs: 13 })) +
    g('top', '<line class="lna dsh" x1="110" y1="200" x2="300" y2="200"/>' + T(305, 204, '堤頂高度', { cls: 'ta', fs: 12, a: 'start' })) +
    g('sp', '<path class="lna" d="M260 200 Q300 205 320 260" style="stroke-width:3"/>' + T(330, 280, '溢洪道：多的水從這裡排走', { cls: 'ta', fs: 12, a: 'start' })) +
    chip(470, 140, '水位再高，也不會超過堤頂', '', 'c', { fs: 13 }),
    [{ sub: '想像一座水庫：水位沒到堤頂，水庫照常裝水。', on: 'dam top' },
     { sub: '水位一超過堤頂，多出來的水就從<b>溢洪道</b>排走。', on: 'sp' },
     { sub: '所以水位最高就是堤頂，不會再往上。', on: 'c' },
     { sub: '截波器的「二極體 + 電池」就是那個溢洪道；堤頂高度 = V<sub>B</sub> + V<sub>γ</sub>。', on: '' }]);

  /* ── 並聯截波 ── */
  const S3 = sc('並聯截波器長這樣', 'SHUNT CLIPPER',
    SH('c', false, { vb: '4 V' }) + chip(500, 160, '二極體＋電池「並」在輸出上', '多的電流從這條路走', 'c1', { fs: 13 }) +
    chip(500, 240, '門檻 = 4 + 0.7 = 4.7 V', 'V<sub>B</sub> + V<sub>γ</sub>', 'c2', { fs: 13, acc: true }),
    [{ sub: '輸入 v<sub>i</sub> 經過電阻 R，輸出 v<sub>O</sub> 接在後面。', on: 'c' },
     { sub: '輸出旁邊「並」一條路：二極體往下，再接一顆 4 V 電池到地。', on: 'c1' },
     { sub: '這條路要導通，輸出至少要比 4 V 高出 0.7 V：門檻 <b>4.7 V</b>。', on: 'c2' }]);

  const S4 = sc('輸入還小：二極體 OFF', 'BELOW THE LEVEL: OFF',
    SH('c', false, { vb: '4 V' }) + st(262, 206, false, 'off') + T(130, 120, 'R 沒有電流 → 沒有壓降', { cls: 'tm', fs: 12, k: 't1' }) +
    panel('ax') + vin('in') + hline(PX, PX + PW, vy(4.7), 'th', '4.7 V') +
    seg(u => VM * sin2(u), v => v < 4.7, 'out'),
    [{ sub: '第一步：先假設二極體 OFF（斷路）。', on: 'c off' },
     { sub: 'OFF 就沒有電流，R 上沒有壓降，所以 v<sub>O</sub> = v<sub>i</sub>。', on: 't1' },
     { sub: '只要 v<sub>i</sub> 還沒到 4.7 V，這個假設就成立：輸出照著輸入走。', on: 'ax in th out' }]);

  const S5 = sc('輸入超過 4.7 V：二極體 ON', 'ABOVE THE LEVEL: ON',
    SH('c', true, { vb: '4 V' }) + flow(shOn, 'fp') + st(262, 206, true, 'on') + T(130, 120, '多出來的電壓落在 R 上', { cls: 'ta', fs: 12, k: 't1' }) +
    panel('ax') + vin('in') + hline(PX, PX + PW, vy(4.7), 'th', '4.7 V') + vout(v => Math.min(v, 4.7), 'out'),
    [{ sub: '輸入一超過 4.7 V，二極體 ON，電流從 R 流進二極體、電池，再回到地。', on: 'c fp on' },
     { sub: 'ON 的二極體 + 電池兩端固定 4 + 0.7 = 4.7 V，輸出被<b>釘在 4.7 V</b>。', on: 'ax in th out' },
     { sub: '多出來的電壓（v<sub>i</sub> − 4.7）全部落在 R 上。這就是溢洪道在排水。', on: 't1' }]);

  const S6 = sc('解題三步驟', 'THREE STEPS',
    calc(100, 112, 440, [['① 先假設二極體 OFF：v<sub>O</sub> = v<sub>i</sub>', 'r1', 't', 15], ['② 找分界點：二極體剛好要 ON 的 v<sub>i</sub>', 'r2', 't', 15], ['　這題：v<sub>i</sub> = V<sub>B</sub> + V<sub>γ</sub> = 4.7 V', 'r3', 'tm', 14], ['③ 分區寫：v<sub>i</sub> &lt; 4.7 → v<sub>O</sub> = v<sub>i</sub>；v<sub>i</sub> ≥ 4.7 → v<sub>O</sub> = 4.7', 'r4', 'ta', 14]], { k: 'cc', lh: 38 }),
    [{ sub: '所有截波題都是同一個流程。第一步：假設 OFF。', on: 'cc r1' },
     { sub: '第二步：找「二極體剛好要 ON」的那個輸入值，叫<b>分界點</b>。', on: 'r2 r3' },
     { sub: '第三步：分界點兩邊各寫一個 v<sub>O</sub>。', on: 'r4' },
     { sub: '謎題解開了：10 V 的訊號，晶片最多只看到 4.7 V。', on: '' }]);

  const S7 = sc('變型①：二極體反過來', 'VARIANT 1: DIODE FLIPPED',
    SH('c', false, { dir: 'u', vb: 'V<sub>B</sub>' }) + panel('ax') + vin('in') + hline(PX, PX + PW, vy(3 - 0.7), 'th', 'V<sub>B</sub> − V<sub>γ</sub>') +
    vout(v => Math.max(v, 2.3), 'out') + T(PX + PW / 2, PY + 92, '（圖用 V<sub>B</sub> = 3 V）', { cls: 'ts', fs: 11, k: 'n' }),
    [{ sub: '把二極體反過來（尖端朝上）：電流只能從地經過電池、往上流到輸出。', on: 'c' },
     { sub: '輸出要「比 V<sub>B</sub> 低 V<sub>γ</sub>」才會 ON：分界點 = V<sub>B</sub> − V<sub>γ</sub>。', on: 'ax in th n' },
     { sub: '這次削的是<b>下面</b>：輸出最低就是 V<sub>B</sub> − V<sub>γ</sub>（講義參考①）。', on: 'out' }]);

  const S8 = sc('變型②：電池反過來', 'VARIANT 2: BATTERY FLIPPED',
    SH('c', false, { plusTop: false, vb: 'V<sub>B</sub>' }) + panel('ax') + vin('in') + hline(PX, PX + PW, vy(0.7 - 3), 'th', 'V<sub>γ</sub> − V<sub>B</sub>') +
    vout(v => Math.min(v, -2.3), 'out') + T(PX + PW / 2, PY + 92, '（圖用 V<sub>B</sub> = 3 V）', { cls: 'ts', fs: 11, k: 'n' }),
    [{ sub: '二極體照原樣朝下，但電池反過來（+ 在下）。', on: 'c' },
     { sub: '這條路兩端要到 V<sub>γ</sub> − V<sub>B</sub> 就會 ON（電池反而幫忙推）。', on: 'ax in th n' },
     { sub: '輸出最高被釘在 V<sub>γ</sub> − V<sub>B</sub>，連 0 以上都被削掉（講義參考②）。', on: 'out' }]);

  const S9 = sc('先整理一下', 'SO FAR',
    calc(100, 118, 440, [['並聯截波：二極體＋電池並在輸出上', 'r1', 't', 15], ['尖端朝下 → 削上面；朝上 → 削下面', 'r2', 't', 15], ['分界點 = 讓那條路剛好 ON 的電壓', 'r3', 't', 15], ['OFF：v<sub>O</sub> = v<sub>i</sub>；ON：v<sub>O</sub> = 那條路的電壓', 'r4', 'ta', 15]], { k: 'cc', lh: 38 }),
    [{ sub: '先整理一下並聯截波。', on: 'cc r1' },
     { sub: '二極體的方向決定削上面還是下面。', on: 'r2' },
     { sub: '電池的大小、方向決定削在多高（分界點）。', on: 'r3' },
     { sub: 'OFF 時輸出跟著輸入，ON 時輸出被那條路「釘住」。', on: 'r4' }]);

  /* ── 串聯截波 ── */
  const S10 = sc('串聯截波器：二極體串在路上', 'SERIES CLIPPER',
    SE('c', false) + st(190, 168, false, 'off') + chip(490, 150, '二極體 OFF → 整條路斷掉', 'R 沒有電流 → v<sub>O</sub> = 0', 'c1', { fs: 13 }),
    [{ sub: '第二種：二極體不是並在旁邊，而是<b>串在訊號的路上</b>（板書的串聯截波）。', on: 'c' },
     { sub: '路上還串一顆 V<sub>B</sub>，二極體尖端朝左，R 接到地當輸出。', on: '' },
     { sub: '這次反過來：二極體 OFF 時整條路斷掉，R 沒電流，<b>v<sub>O</sub> = 0</b>。', on: 'off c1' }]);

  const S11 = sc('串聯截波：什麼時候 ON', 'SERIES CLIPPER: ON',
    SE('c', true) + flow(seOn, 'fp') + st(190, 168, true, 'on') +
    calc(380, 120, 230, [['KVL：v<sub>i</sub> − V<sub>B</sub> + V<sub>γ</sub> − i R = 0', 'r1', 't', 13], ['ON 的條件：v<sub>i</sub> &lt; V<sub>B</sub> − V<sub>γ</sub>', 'r2', 'ta', 13], ['v<sub>O</sub> = v<sub>i</sub> − (V<sub>B</sub> − V<sub>γ</sub>)', 'r3', 'ta', 14], ['否則 v<sub>O</sub> = 0', 'r4', 't', 13]], { k: 'cc', lh: 32 }),
    [{ sub: '電流要照著二極體的方向（往左）走：從地往上經過 R，再穿過二極體、電池。', on: 'c fp on' },
     { sub: '繞一圈寫 KVL（板書的式子）。', on: 'cc r1' },
     { sub: '要推得動，v<sub>i</sub> 必須低於分界點 V<sub>B</sub> − V<sub>γ</sub>。', on: 'r2' },
     { sub: 'ON 時輸出 = 輸入往下<b>平移</b> V<sub>B</sub> − V<sub>γ</sub>；其他時候是 0。', on: 'r3 r4' }]);

  /* 11/6 使用者：多一點波形 */
  const S11b = sc('串聯截波：看波形', 'SERIES CLIPPER ON A GRAPH',
    sm(SE('c', false)) + panel('ax') + vin('in') + hline(PX, PX + PW, vy(2.3), 'th', '2.3 V') +
    wave(PX, PY, PW, PA / VM, u => VM * sin2(u) - 2.3, 'sh', 'ln2 dsh') +
    segU(() => 0, v => v >= 2.3, 'o0') + segU(v => v - 2.3, v => v < 2.3, 'o1') +
    g('mn', '<circle class="acc" cx="' + (PX + 0.375 * PW) + '" cy="' + vy(-12.3) + '" r="5"/>' + T(PX + 0.375 * PW + 10, vy(-12.3) + 5, '−12.3 V', { cls: 'ta', fs: 13, a: 'start' })) +
    T(PX + PW / 2, 112, 'V<sub>B</sub> = 3 V、V<sub>γ</sub> = 0.7 V', { cls: 'ts', fs: 11, k: 'n' }),
    [{ sub: '用 V<sub>B</sub> = 3 V、V<sub>γ</sub> = 0.7 V 來畫：分界點 = 3 − 0.7 = <b>2.3 V</b>。', on: 'c ax in th n' },
     { sub: '輸入在 2.3 V 以上：D OFF、整條路斷掉，輸出貼在 <b>0</b>。', on: 'o0' },
     { sub: '先把輸入整條往下搬 2.3 V（細虛線）。', on: 'sh' },
     { sub: '輸入低於 2.3 V：D ON，輸出就走那條搬下來的線。', on: 'o1' },
     { sub: '最低點在輸入谷底：−10 − 2.3 = <b>−12.3 V</b>。輸出永遠 ≤ 0。', on: 'mn' }]);

  /* ── 雙向截波 ── */
  const S12 = sc('雙向截波：上下各一個溢洪道', 'TWO-LEVEL CLIPPER',
    BD('c', false, false) + chip(500, 150, 'D<sub>1</sub>、V<sub>B1</sub> 管上限', '尖端朝下 → 削上面', 'c1', { fs: 13 }) +
    chip(500, 235, 'D<sub>2</sub>、V<sub>B2</sub> 管下限', '尖端朝上、電池反接 → 削下面', 'c2', { fs: 13 }),
    [{ sub: '把兩條路一起並上去，就能「頭尾一起削」—— 雙向截波（老師說最重要）。', on: 'c' },
     { sub: '左邊 D<sub>1</sub> + V<sub>B1</sub> 跟剛才一樣，管<b>上限</b>。', on: 'c1' },
     { sub: '右邊 D<sub>2</sub> 尖端朝上、V<sub>B2</sub> 反接，管<b>下限</b>。', on: 'c2' }]);

  const S13 = sc('四種情況，其實只有三種', 'FOUR CASES → THREE',
    calc(20, 112, 340, [['都 OFF：v<sub>O</sub> = v<sub>i</sub>（中間）', 'r1', 't', 14], ['D<sub>1</sub> ON：v<sub>O</sub> = 上限 V<sub>B1</sub> + V<sub>γ</sub>', 'r2', 't', 14], ['D<sub>2</sub> ON：v<sub>O</sub> = 下限 −(V<sub>B2</sub> + V<sub>γ</sub>)', 'r3', 't', 14], ['兩顆都 ON：不可能', 'r4', 'ta', 14]], { k: 'cc', lh: 38 }) +
    panel('ax') + vin('in', 6) + hline(PX, PX + PW, vy(2), 't1', '上限') + hline(PX, PX + PW, vy(-4), 't2', '下限') +
    segU(v => v, v => v <= 2 && v >= -4, 'oM', 6) + segU(() => 2, v => v > 2, 'oT', 6) + segU(() => -4, v => v < -4, 'oB', 6) +
    T(PX + 0.125 * PW, vy(6) - 10, 'D<sub>1</sub> ON', { cls: 'ta', fs: 12, k: 'l1' }) + T(PX + 0.375 * PW, vy(-6) + 20, 'D<sub>2</sub> ON', { cls: 'ta', fs: 12, k: 'l2' }),
    [{ sub: '兩顆二極體，各有 ON、OFF，看起來有四種組合。先看中間：兩顆都 OFF，輸出跟著輸入走。', on: 'cc r1 ax in t1 t2 oM' },
     { sub: '輸入太高：只有 D<sub>1</sub> ON，輸出被釘在上限（波形頭被削平）。', on: 'r2 oT l1' },
     { sub: '輸入太低：只有 D<sub>2</sub> ON，輸出被釘在下限（波形腳被削平）。', on: 'r3 oB l2' },
     { sub: '兩顆同時 ON 不可能 —— 所以只要分三區寫。', on: 'r4' }]);

  const S14 = sc('Example 2.7：上下限', 'EXAMPLE 2.7',
    BD('c', false, false) + panel('ax') + vin('in', 6) + hline(PX, PX + PW, vy(2), 't1', '2 V') + hline(PX, PX + PW, vy(-4), 't2', '−4 V') +
    vout2(6, v => Math.max(-4, Math.min(2, v)), 'out'),
    [{ sub: 'Example 2.7（先不管 R<sub>2</sub>）：V<sub>B1</sub> = 2 V、V<sub>B2</sub> = 4 V，V<sub>γ</sub> = 0，輸入峰值 6 V。', on: 'c ax in' },
     { sub: '上限：輸出最多 2 V。', on: 't1' },
     { sub: '下限：輸出最低 −4 V。', on: 't2' },
     { sub: '中間那段照著輸入走 —— 波形頭尾都被削平。', on: 'out' }]);

  /* VTC：橫軸 v_i、縱軸 v_O（板書 In Summary 的 VTC） */
  const vx = v => 330 + v * 22, vv = v => 205 - v * 20;
  const vl = (pts, key, cls) => '<path class="' + (cls || 'lna') + '" style="fill:none;stroke-width:3"' + (key ? ' data-k="' + key + '"' : '') + ' d="M' + pts.map(q => vx(q[0]) + ' ' + vv(q[1])).join(' L') + '"/>';
  const S14b = sc('換個角度：輸入進去、輸出出來', 'VOLTAGE TRANSFER CURVE',
    g('ax', '<path class="ln2" style="fill:none" d="M' + vx(-6.8) + ' 205 H' + vx(6.8) + ' M330 ' + vv(5) + ' V' + vv(-5) + '"/>' + T(vx(6.8) + 6, 209, 'v<sub>i</sub>', { cls: 't', fs: 13, a: 'start' }) + T(338, vv(5) + 4, 'v<sub>O</sub>', { cls: 't', fs: 13, a: 'start' }) +
      [-6, -4, -2, 2, 4, 6].map(v => T(vx(v), 222, String(v), { cls: 'ts', fs: 10 })).join('') + T(322, vv(2) + 4, '2', { cls: 'ts', fs: 10, a: 'end' }) + T(322, vv(-4) + 4, '−4', { cls: 'ts', fs: 10, a: 'end' })) +
    vl([[-4, -4], [2, 2]], 'm') + T(vx(-1.2), vv(0.6) - 10, '斜率 1：v<sub>O</sub> = v<sub>i</sub>', { cls: 't', fs: 12, a: 'end', k: 'ml' }) +
    vl([[2, 2], [6.3, 2]], 't') + T(vx(4.2), vv(2) + 20, 'D<sub>1</sub> ON：2 V', { cls: 'ta', fs: 12, k: 'tl' }) +
    vl([[-6.3, -4], [-4, -4]], 'b') + T(vx(-5.2), vv(-4) - 10, 'D<sub>2</sub> ON：−4 V', { cls: 'ta', fs: 12, k: 'bl' }) +
    vl([[2, 2], [6.3, 4.15]], 'r2', 'ln dsh') + T(vx(4.4), vv(4.2) - 6, '有 R<sub>2</sub>：斜率 ½', { cls: 'tm', fs: 12, k: 'r2l' }),
    [{ sub: '不畫時間，改畫「v<sub>i</sub> 放進去，v<sub>O</sub> 出來多少」：這張叫 <b>VTC</b>。', on: 'ax' },
     { sub: '中間兩顆都 OFF：輸出 = 輸入，是一條斜率 1 的線。', on: 'm ml' },
     { sub: 'v<sub>i</sub> 超過 2：D<sub>1</sub> ON，輸出平平地停在 2。', on: 't tl' },
     { sub: 'v<sub>i</sub> 低於 −4：D<sub>2</sub> ON，輸出平平地停在 −4。', on: 'b bl' },
     { sub: '多串 R<sub>2</sub> 的版本：上面那段不再是平的，斜率變 ½（虛線）。', on: 'r2 r2l' }]);

  const S15 = sc('加了 R₂：上面不再是平的', 'WITH R2: A SLOPE',
    calc(380, 115, 230, [['D<sub>1</sub> 那條路多串一個 R<sub>2</sub>', 'r1', 't', 13], ['ON 時 R<sub>1</sub>、R<sub>2</sub> 分壓：', 'r2', 'tm', 13], ['v<sub>O</sub> = (v<sub>i</sub> − 2)·½ + 2', 'r3', 'ta', 14], ['= ½v<sub>i</sub> + 1', 'r4', 'ta', 14], ['峰值 6 V → 輸出 4 V', 'r5', 't', 13]], { k: 'cc', lh: 30 }) +
    g('w', axis(60, 205, 260, 75) + wave(60, 205, 260, PA * 6 / VM, sin2, '', 'ln dsh') + wave(60, 205, 260, PA / VM, u => { const v = 6 * sin2(u); return v > 2 ? 0.5 * v + 1 : Math.max(v, -4); }) +
      T(190, 300, '上面斜一點、最高 4 V；下面 −4 V', { cls: 'ts', fs: 12 })),
    [{ sub: '講義的變型：D<sub>1</sub> 那條路多串一個 R<sub>2</sub>（R<sub>1</sub> = R<sub>2</sub> = 10 kΩ）。', on: 'cc r1' },
     { sub: 'D<sub>1</sub> ON 時，超過 2 V 的部分由 R<sub>1</sub>、R<sub>2</sub> 分壓，只剩一半。', on: 'r2 r3' },
     { sub: '整理：v<sub>O</sub> = ½v<sub>i</sub> + 1。', on: 'r4 w' },
     { sub: '所以上面變成一段斜線，最高到 4 V；下面照樣 −4 V。', on: 'r5' }]);

  const S16 = sc('先整理：截波 vs 箝位', 'CLIPPER vs CLAMPER',
    g('a', axis(90, 205, 200, 70) + wave(90, 205, 200, 45, sin2, '', 'ln dsh') + wave(90, 205, 200, 1, u => Math.min(45 * sin2(u), 20)) + T(190, 300, '截波：切掉一塊', { cls: 't', fs: 13 })) +
    g('b', axis(360, 205, 200, 70) + wave(360, 205, 200, 45, sin2, '', 'ln dsh') + wave(360, 205, 200, 1, u => 45 * sin2(u) - 30) + T(460, 300, '箝位：整個搬家', { cls: 'ta', fs: 13 })) +
    T(320, 120, '箝位器：考試清單沒列，有空再看', { cls: 'ts', fs: 12, k: 'n' }),
    [{ sub: '先整理：截波器是把波形<b>切掉一塊</b>。', on: 'a' },
     { sub: '最後一個電路「箝位器」不一樣：形狀不變，整個波形<b>上下搬家</b>。', on: 'b' },
     { sub: '（老師給的考試清單沒有箝位器，這段看懂就好。）', on: 'n' }]);

  const S17 = sc('比喻：電容是記憶的水桶', 'ANALOGY: CAPACITOR BUCKET',
    CL('c', true) + flow('M50 194 V140 H126 M134 140 H220 V166 M220 194 V222 M220 248 V280 H50 V226', 'fp') + st(262, 206, true, 'on') +
    calc(380, 130, 230, [['第一次衝到峰值 V<sub>M</sub>：', 'r1', 't', 13], ['D ON，C 充電', 'r2', 't', 13], ['V<sub>C</sub> = V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>', 'r3', 'ta', 14], ['之後 D OFF，C 沒地方放電', 'r4', 'tm', 13]], { k: 'cc', lh: 30 }),
    [{ sub: '箝位器把截波器的 R 換成電容 C。', on: 'c' },
     { sub: '輸入第一次衝到峰值：二極體 ON，電容像水桶一樣被裝滿。', on: 'fp on cc r1 r2' },
     { sub: '裝了多少？V<sub>C</sub> = V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub>。', on: 'r3' },
     { sub: '輸入一往下掉，二極體 OFF，電容沒地方放電 —— 電壓被「記住」了。', on: 'r4' }]);

  const S18 = sc('輸出 = 輸入 − 電容電壓', 'v<sub>O</sub> = v<sub>i</sub> − V<sub>C</sub>',
    CL('c', false) + st(262, 206, false, 'off') + panel('ax') + wave(PX, PY, PW, PA * 5 / VM, sin2, 'in', 'ln dsh') +
    wave(PX, PY, PW, PA / VM, u => 5 * sin2(u) - 3.3, 'out') + hline(PX, PX + PW, vy(1.7), 't1', '1.7 V') +
    T(PX + PW / 2, PY + 92, '（V<sub>M</sub> = 5、V<sub>B</sub> = 1、V<sub>γ</sub> = 0.7）', { cls: 'ts', fs: 11, k: 'n' }),
    [{ sub: '之後二極體一直 OFF，電容兩端固定 V<sub>C</sub>。', on: 'c off' },
     { sub: '輸出 = 輸入 − V<sub>C</sub>：每一個點都減同一個數。', on: 'ax in n' },
     { sub: '整個波形往下搬：最高 = V<sub>B</sub> + V<sub>γ</sub>，最低 = −2V<sub>M</sub> + V<sub>B</sub> + V<sub>γ</sub>。', on: 'out t1' }]);

  const S19 = sc('恍然大悟', 'GOT IT',
    chip(320, 112, '10 V 變 4.7 V', '二極體＋4 V 電池當溢洪道：v<sub>i</sub> &gt; 4.7 V 就 ON、釘住輸出', 'c1', { fs: 14 }) +
    chip(320, 172, '截波題三步驟', '假設 OFF → 找分界點 → 分區寫 v<sub>O</sub>', 'c2', { fs: 14, acc: true }) +
    chip(320, 232, '雙向截波：最多三區', '兩顆不會同時 ON', 'c3', { fs: 14 }),
    [{ sub: '謎題解開：二極體加一顆 4 V 電池，超過 4.7 V 就 ON，把輸出釘在 4.7 V。', on: 'c1' },
     { sub: '每一題都照三步驟：假設 OFF → 找分界點 → 分區寫 v<sub>O</sub>。', on: 'c2' },
     { sub: '雙向截波兩顆不會同時 ON，所以最多分三區。往下去做題目吧。', on: 'c3' }]);

  window.__ch2p3Story = window.__Story('#story', {
    id: 'ch2p3v2', title: 'CH2 PART 3 截波與箝位', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S11b, S12, S13, S14, S14b, S15, S16, S17, S18, S19]
  });
})();
