/* ============================================================
   電路學 CH12 名詞圖鑑（使用者 10/20：相電壓、線電壓、電流全部搞混，介紹要附電路圖）
   每個名詞一張電路圖，在圖上直接標出「它是哪裡」（電錶夾哪兩點、電流箭頭在哪條線）。
   用法：
     頁面：<div class="tpic" data-set="p2"></div>  → 名詞按鈕＋圖＋白話＋關係式
     故事：__CH12T.scenes(['vp', 'vl', …])       → 每個名詞一幕
     名詞彈窗：window.__TERMFIG['相電壓'] = () => SVG（app.js 的 term-pop 會顯示）
   需要：story.js、ch12-kit.js（__K12）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12) return;
  const K = window.__K12, D = K.D;
  const { g, T, sys3, ph, src } = K;
  const RAD = Math.PI / 180;
  const f1 = x => Math.round(x * 10) / 10;

  /* ---------- 底圖（viewBox 0 0 640 300） ---------- */
  const Y = [80, 150, 220];
  const BASE = {
    yy: () => sys3({ src: 'Y', load: 'Y', x0: 90, x1: 530, y: Y, vs: ['', '', ''], z: 'Z' }),
    yyn: z => sys3({ src: 'Y', load: 'Y', x0: 90, x1: 530, y: Y, vs: ['', '', ''], z: z || 'Z', n: true }),
    yyh: () => sys3({ src: 'Y', load: 'Y', x0: 90, x1: 530, y: Y, vs: ['', '', ''], z: 'Z', n: true, hl: 0 }),
    yd: () => sys3({ src: 'Y', load: 'D', x0: 90, x1: 530, y: Y, vs: ['', '', ''], z: 'Z<sub>Δ</sub>' }),
    none: () => ''
  };
  /* 電錶：p1、p2 兩點拉虛線到錶 (mx, my) */
  const VM = (p1, p2, mx, my, lbl, la) => '<path class="lna dsh" style="fill:none;stroke-width:1.6" d="M' + p1[0] + ' ' + p1[1] + ' L' + mx + ' ' + my + ' L' + p2[0] + ' ' + p2[1] + '"/>' +
    '<circle class="accw" cx="' + p1[0] + '" cy="' + p1[1] + '" r="4" style="stroke:var(--s-acc);stroke-width:1.6"/><circle class="accw" cx="' + p2[0] + '" cy="' + p2[1] + '" r="4" style="stroke:var(--s-acc);stroke-width:1.6"/>' +
    '<circle class="card" cx="' + mx + '" cy="' + my + '" r="15" style="stroke:var(--s-acc);stroke-width:2"/>' + T(mx, my + 5, 'V', { cls: 'ta', fs: 14 }) +
    (lbl ? T(mx + (la === 'end' ? -22 : 22), my + 5, lbl, { cls: 'ta', fs: 14, a: la || 'start' }) : '');
  const AR = (x1, y1, x2, y2, lbl, lx, ly, la) => D.arrow(x1, y1, x2, y2, null, 'lna') + '<line class="lna" style="stroke-width:3" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>' +
    (lbl ? T(lx, ly, lbl, { cls: 'ta', fs: 13.5, a: la || 'middle' }) : '');
  const HL = (x, y, w, h) => '<rect class="ring" style="stroke-width:2.6" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6"/>';
  const LINE = (d, w) => '<path class="lna" style="fill:none;stroke-width:' + (w || 5) + ';opacity:.45" d="' + d + '"/>';
  const NOTE = (s, y) => T(320, y || 280, s, { cls: 'ts', fs: 13 });
  const BOX = (x, y, s) => '<rect class="bgw" x="' + (x - 22) + '" y="' + (y - 13) + '" width="44" height="26" rx="4"/>' + T(x, y + 5, s, { cls: 't', fs: 13 });
  /* 負載 a 相的方塊（Y 底圖）：zbox 中心 (485, 80) */
  const LA = [485, 80];
  const pA = [440, 80], pB = [440, 150], pN = [530, 80], pa = [160, 80], pb = [160, 150], pn = [90, 80];

  const yIcon = (cx, cy, r) => [90, 210, 330].map(a => '<line class="ln" style="stroke-width:2.4" x1="' + cx + '" y1="' + cy + '" x2="' + f1(cx + r * Math.cos(a * RAD)) + '" y2="' + f1(cy - r * Math.sin(a * RAD)) + '"/>').join('') + '<circle class="acc" cx="' + cx + '" cy="' + cy + '" r="4.5"/>';
  const dIcon = (cx, cy, r) => '<path class="ln" style="fill:none;stroke-width:2.4" d="M' + cx + ' ' + (cy - r) + ' L' + f1(cx + r * 0.866) + ' ' + (cy + r / 2) + ' L' + f1(cx - r * 0.866) + ' ' + (cy + r / 2) + ' Z"/>';

  /* ---------- 名詞卡 ---------- */
  const C = {
    fire: { t: '火線、中性線', en: 'LINES AND NEUTRAL', base: 'yyn',
      plain: '從電源三個「頭」拉出來的 a、b、c 三條叫<b>火線</b>；把電源中性點 n 接到負載中性點 N 的那條叫<b>中性線</b>。',
      rel: '三條火線 ＋ 一條中性線 = 三相四線',
      ov: LINE('M160 80 H440 M160 150 H440 M160 220 H440') + T(300, 70, '火線 a', { cls: 'ta', fs: 13 }) + T(300, 140, '火線 b', { cls: 'ta', fs: 13 }) + T(300, 210, '火線 c', { cls: 'ta', fs: 13 }) },
    vp: { t: '相電壓', en: 'PHASE VOLTAGE', base: 'yy',
      plain: '一相「自己」的電壓：電錶夾<b>一條火線</b>和<b>中性點</b>。Y 接時就是一顆電源（或一格負載）兩端的電壓。',
      rel: '符號 V<sub>p</sub>，例：V<sub>an</sub>、V<sub>AN</sub>（台灣大樓 220 V）',
      ov: VM(pa, pn, 125, 34, 'V<sub>an</sub>', 'start') + VM(pA, pN, 485, 34, 'V<sub>AN</sub>', 'end') + NOTE('夾「一條火線」和「中性點」：中間只隔一相', 285) },
    vl: { t: '線電壓', en: 'LINE VOLTAGE', base: 'yy',
      plain: '電錶夾<b>兩條火線</b>。中間隔了兩相，而且兩相差 120°，所以是相電壓的 √3 倍，不是 2 倍。',
      rel: 'V<sub>L</sub> = √3 V<sub>p</sub>（Y 接；380 = √3 × 220）',
      ov: VM(pa, pb, 250, 115, 'V<sub>ab</sub>', 'start') + NOTE('夾「兩條火線」：電力公司說的 380 V 就是這個', 285) },
    ip: { t: '相電流', en: 'PHASE CURRENT', base: 'yy',
      plain: '流過<b>一格負載裡面</b>（或一顆電源裡面）的電流。負載會不會燒掉，看的是它。',
      rel: '符號 I<sub>p</sub>，例：流過 a 相負載的 I<sub>AN</sub>',
      ov: HL(458, 64, 54, 32) + AR(462, 104, 508, 104, 'I<sub>AN</sub>', 485, 124) + NOTE('箭頭在「負載那一格」上', 285) },
    il: { t: '線電流', en: 'LINE CURRENT', base: 'yy',
      plain: '<b>電線上</b>流的電流，從電源送到負載。電流表（或勾表）夾在電線上量到的就是它。',
      rel: '符號 I<sub>L</sub>，例：I<sub>a</sub>、I<sub>b</sub>、I<sub>c</sub>',
      ov: '<circle class="card" cx="300" cy="80" r="14" style="stroke:var(--s-acc);stroke-width:2"/>' + T(300, 85, 'A', { cls: 'ta', fs: 13 }) + AR(225, 62, 270, 62, 'I<sub>a</sub>', 215, 66, 'end') + NOTE('箭頭在「電線」上', 285) },
    yeq: { t: 'Y 接：線電流 = 相電流', en: 'IN Y, LINE = PHASE CURRENT', base: 'yy',
      plain: 'Y 接時電線 a 只接到負載 a 這一格，中間沒有岔路，所以電線上的電流就是那一格的電流。',
      rel: 'Y：I<sub>L</sub> = I<sub>p</sub>，V<sub>L</sub> = √3 V<sub>p</sub>',
      ov: LINE('M160 80 H530', 6) + AR(225, 62, 270, 62, 'I<sub>a</sub>', 215, 66, 'end') + AR(462, 104, 508, 104, 'I<sub>AN</sub>', 485, 124) + NOTE('同一條路走到底 → 一樣大', 285) },
    bal: { t: '平衡', en: 'BALANCED', base: 'yy',
      plain: '三顆電源一樣大、差 120°，三格負載阻抗一模一樣。這時三相只是同一件事錯開 120°。',
      rel: '平衡 → 只要算一相，另外兩相轉 ∓120°',
      ov: HL(458, 64, 54, 32) + HL(458, 134, 54, 32) + HL(458, 204, 54, 32) + T(575, 155, '三格都是 Z', { cls: 'ta', fs: 13 }) + NOTE('三格一樣、三顆電源一樣大', 280) },
    per: { t: '單相等效電路', en: 'PER-PHASE EQUIVALENT', base: 'yyh',
      plain: '平衡時中性線上沒有電流，n 和 N 一樣高。把 a 相拿出來，自己就是一個迴路：一顆電源串一格負載。',
      rel: 'I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>',
      ov: NOTE('只算塗色這一圈（a 相 → 經中性線回來）', 285) },
    dvp: { t: 'Δ 的相電壓', en: 'PHASE VOLTAGE IN Δ', base: 'yd',
      plain: 'Δ 負載每一格的兩端<b>直接接在兩條線上</b>，所以它自己的電壓（相電壓）就是線電壓。',
      rel: 'Δ：V<sub>p</sub> = V<sub>L</sub>，例：V<sub>AB</sub> = V<sub>ab</sub>',
      ov: HL(460, 96, 20, 38) + VM([430, 80], [430, 150], 395, 115, 'V<sub>AB</sub>', 'end') + NOTE('這一格夾在 A、B 兩條線之間', 285) },
    dip: { t: 'Δ 的相電流', en: 'PHASE CURRENT IN Δ', base: 'yd',
      plain: '流過 Δ 某一格（例如 AB 那格）裡面的電流，用兩個大寫字母標：I<sub>AB</sub>。',
      rel: 'I<sub>AB</sub> = V<sub>AB</sub> / Z<sub>Δ</sub>',
      ov: HL(460, 96, 20, 38) + AR(498, 98, 498, 132, 'I<sub>AB</sub>', 506, 120, 'start') + NOTE('箭頭在「AB 那一格」上', 285) },
    dil: { t: 'Δ 的線電流', en: 'LINE CURRENT IN Δ', base: 'yd',
      plain: '電線 a 接在角 A，電流到這裡<b>分給 AB、CA 兩格</b>，所以線電流是兩格電流相減，大小變 √3 倍。',
      rel: 'Δ：I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>，I<sub>L</sub> = √3 I<sub>p</sub>',
      ov: '<circle class="acc" cx="470" cy="80" r="6"/>' + AR(330, 62, 380, 62, 'I<sub>a</sub>', 320, 66, 'end') + AR(486, 98, 486, 128, 'I<sub>AB</sub>', 494, 120, 'start') + AR(522, 64, 484, 64, 'I<sub>CA</sub>', 520, 52, 'middle') + NOTE('角 A 是一個路口：一條路進來、分成兩條', 285) },
    cmp: { t: 'Y 和 Δ 對照', en: 'Y vs Δ', base: 'none',
      plain: '分不清時看這張：<b>Y 的電壓</b>差 √3、<b>Δ 的電流</b>差 √3。',
      rel: '線電流要不要乘 √3，只看負載是不是 Δ',
      ov: yIcon(250, 62, 34) + T(250, 122, 'Y 接', { cls: 't', fs: 15 }) + dIcon(470, 70, 40) + T(470, 122, 'Δ 接', { cls: 't', fs: 15 }) +
        T(90, 162, '電壓', { cls: 'ts', fs: 13, a: 'start' }) + T(250, 162, 'V<sub>L</sub> = √3 V<sub>p</sub>', { cls: 'ta', fs: 15 }) + T(470, 162, 'V<sub>L</sub> = V<sub>p</sub>', { cls: 't', fs: 15 }) +
        T(90, 202, '電流', { cls: 'ts', fs: 13, a: 'start' }) + T(250, 202, 'I<sub>L</sub> = I<sub>p</sub>', { cls: 't', fs: 15 }) + T(470, 202, 'I<sub>L</sub> = √3 I<sub>p</sub>', { cls: 'ta', fs: 15 }) +
        T(90, 242, '中性點', { cls: 'ts', fs: 13, a: 'start' }) + T(250, 242, '有', { cls: 't', fs: 15 }) + T(470, 242, '沒有', { cls: 't', fs: 15 }) +
        '<line class="ln2" x1="80" y1="138" x2="580" y2="138"/>' },
    zy: { t: 'Δ 負載換成 Y', en: 'Δ LOAD → Y', base: 'none',
      plain: '從三條線往裡看，Δ 負載可以換成一個看起來一樣的 Y 負載，每相只剩三分之一。換完就能用單相等效。',
      rel: 'Z<sub>Y</sub> = Z<sub>Δ</sub> / 3',
      ov: dIcon(190, 140, 80) + T(190, 152, 'Z<sub>Δ</sub>', { cls: 't', fs: 15 }) + D.arrow(290, 140, 350, 140, null, 'lna') +
        yIcon(450, 130, 70) + T(470, 100, 'Z<sub>Δ</sub>/3', { cls: 'ta', fs: 15, a: 'start' }) + NOTE('三條線上的電流、電壓完全一樣', 270) },
    dsrc: { t: 'Δ 電源換成等效 Y 電源', en: 'Δ SOURCE → Y', base: 'none',
      plain: 'Δ 電源沒有中性點，單相等效沒地方回去。想像一個產生<b>一樣線電壓</b>的 Y 電源來代替它。',
      rel: 'V<sub>an</sub> = V<sub>ab</sub> / √3 ∠−30°',
      ov: ph(200, 150, 100, [{ a: 0, l: 'V<sub>ab</sub>（Δ 電源）', c: 'ln' }, { a: -30, m: 0.577, l: 'V<sub>an</sub>', ld: [4, 10] }], { ax: 120, noTick: true }) +
        T(420, 120, '÷ √3', { cls: 'ta', fs: 18, a: 'start' }) + T(420, 160, '轉 −30°', { cls: 'ta', fs: 18, a: 'start' }) },
    p1: { t: '一相的功率', en: 'POWER IN ONE PHASE', base: 'yy',
      plain: '一格負載吃的功率，用<b>它自己的</b>電壓和電流（相電壓、相電流）算，θ 是那一格的阻抗角。',
      rel: 'P<sub>每相</sub> = V<sub>p</sub> I<sub>p</sub> cos θ',
      ov: HL(458, 64, 54, 32) + VM(pA, pN, 485, 34, 'V<sub>p</sub>', 'end') + AR(462, 104, 508, 104, 'I<sub>p</sub>', 485, 124) + NOTE('電壓、電流都量「這一格」', 285) },
    ptot: { t: '三相總功率', en: 'TOTAL POWER', base: 'yy',
      plain: '三格加起來就是三倍。用電錶好量的線電壓、線電流寫，√3 剛好消掉一個。',
      rel: 'P = 3V<sub>p</sub>I<sub>p</sub>cos θ = √3 V<sub>L</sub>I<sub>L</sub>cos θ',
      ov: HL(458, 64, 54, 32) + HL(458, 134, 54, 32) + HL(458, 204, 54, 32) + T(575, 155, '× 3', { cls: 'ta', fs: 18 }) + NOTE('三格各吃一份，總共三份', 280) },
    theta: { t: 'θ 是哪個角', en: 'WHICH ANGLE IS θ', base: 'none',
      plain: 'θ 是<b>同一格負載</b>的相電壓和相電流的夾角（就是負載阻抗角）。拿線電壓去比會多出 30°。',
      rel: 'θ = ∠Z（例：8 + j6 Ω → θ = 36.87°，pf = 0.8）',
      ov: ph(210, 150, 110, [{ a: 0, l: 'V<sub>AN</sub>（相電壓）', c: 'ln' }, { a: -36.87, m: 0.75, l: 'I<sub>a</sub>' }, { a: 30, m: 1.15, l: 'V<sub>AB</sub>（線電壓）', c: 'ln dsh', ld: [0, -4] }], { ax: 130, noTick: true }) +
        '<path class="lna" style="fill:none" d="M' + (210 + 46) + ' 150 A46 46 0 0 1 ' + f1(210 + 46 * Math.cos(36.87 * RAD)) + ' ' + f1(150 + 46 * Math.sin(36.87 * RAD)) + '"/>' + T(272, 172, 'θ', { cls: 'ta', fs: 16 }) +
        T(470, 240, '✓ θ：V<sub>AN</sub> 和 I<sub>a</sub>', { cls: 'ta', fs: 14 }) + T(470, 266, '✗ 不是 V<sub>AB</sub> 和 I<sub>a</sub>（差 θ + 30°）', { cls: 'ts', fs: 12.5 }) },
    unb: { t: '不平衡', en: 'UNBALANCED', base: 'unb',
      plain: '三格負載不一樣（例如每戶開的電器不同），三個電流不再一樣大，加起來不是 0，多的從<b>中性線</b>回去。',
      rel: 'I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>) ≠ 0',
      ov: LINE('M90 250 H530', 6) + AR(380, 262, 330, 262, 'I<sub>n</sub> ≠ 0', 395, 266, 'start') },
    wire: { t: '三線式、四線式', en: 'THREE-WIRE / FOUR-WIRE', base: 'yyn',
      plain: '有拉中性線（虛線）叫<b>四線式</b>，沒拉叫<b>三線式</b>。平衡時兩種一樣；不平衡時沒有中性線，N 點電壓會浮動。',
      rel: '三線式：I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub> 一定 = 0',
      ov: LINE('M90 220 V250 H530 V220', 6) + T(560, 268, '這條拿掉 → 三線式', { cls: 'ta', fs: 12.5, a: 'end' }) },
    wm: { t: '瓦特計', en: 'WATTMETER', base: 'yyn',
      plain: '兩組線圈：<b>電流線圈串在電線上</b>量電流，<b>電壓線圈並在兩點之間</b>量電壓，讀數是實功率。',
      rel: '讀數 = V × I × cos（兩者夾角）',
      ov: '<rect class="card" x="272" y="66" width="56" height="28" rx="5" style="stroke:var(--s-acc);stroke-width:2"/>' + T(300, 85, 'W', { cls: 'ta', fs: 14 }) +
        '<path class="lna dsh" style="fill:none;stroke-width:1.6" d="M300 94 V250"/>' + '<circle class="accw" cx="300" cy="250" r="4" style="stroke:var(--s-acc);stroke-width:1.6"/>' +
        T(338, 62, '電流線圈：串在線 a 上', { cls: 'ta', fs: 12.5, a: 'start' }) + T(308, 196, '電壓線圈：接到中性線', { cls: 'ta', fs: 12.5, a: 'start' }) },
    w2: { t: '兩瓦特計法', en: 'TWO-WATTMETER METHOD', base: 'yy',
      plain: '兩個瓦特計串在線 a、線 c，電壓線圈的另一端<b>都接到線 b</b>。兩個讀數相加就是總功率。',
      rel: 'P = P<sub>1</sub> + P<sub>2</sub>，Q = √3 (P<sub>2</sub> − P<sub>1</sub>)',
      ov: '<rect class="card" x="272" y="66" width="56" height="28" rx="5" style="stroke:var(--s-acc);stroke-width:2"/>' + T(300, 85, 'W<sub>1</sub>', { cls: 'ta', fs: 14 }) +
        '<rect class="card" x="272" y="206" width="56" height="28" rx="5" style="stroke:var(--s-acc);stroke-width:2"/>' + T(300, 225, 'W<sub>2</sub>', { cls: 'ta', fs: 14 }) +
        '<path class="lna dsh" style="fill:none;stroke-width:1.6" d="M300 94 V150 M300 206 V150"/><circle class="acc" cx="300" cy="150" r="5"/>' + T(312, 140, '都接到線 b', { cls: 'ta', fs: 12.5, a: 'start' }) },
    sp3: { t: '單相三線（家用 120/240 V）', en: 'SINGLE-PHASE THREE-WIRE', base: 'none',
      plain: '變壓器兩個 120 V 線圈串起來，中間接地當中性線（白）。黑對白 120 V 給燈，黑對紅 240 V 給冷氣。',
      rel: '黑 ↔ 白 = 120 V；黑 ↔ 紅 = 240 V',
      ov: '<path class="ln" style="fill:none" d="M130 50 V75 M130 125 V175 M130 225 V250 M130 50 H560 M130 150 H560 M130 250 H560"/>' + src(130, 100, 22) + src(130, 200, 22) +
        T(98, 105, '120 V', { cls: 't', fs: 12.5, a: 'end' }) + T(98, 205, '120 V', { cls: 't', fs: 12.5, a: 'end' }) +
        T(200, 42, '黑（+120 V）', { cls: 't', fs: 12.5, a: 'start' }) + T(200, 142, '白（0 V，接地）', { cls: 'ts', fs: 12.5, a: 'start' }) + T(200, 242, '紅（−120 V）', { cls: 't', fs: 12.5, a: 'start' }) +
        '<path class="ln" d="M130 150 H112 V166 M102 166 H122 M106 171 H118 M110 176 H114"/>' +
        '<path class="ln" d="M360 50 V87 M360 113 V150"/>' + BOX(360, 100, '燈') + T(392, 105, '120 V', { cls: 'ta', fs: 13, a: 'start' }) +
        '<path class="ln" d="M500 50 V137 M500 163 V250"/>' + BOX(500, 150, '冷氣') + T(532, 155, '240 V', { cls: 'ta', fs: 13, a: 'start' }) },
    gfci: { t: '漏電斷路器 GFCI', en: 'GFCI', base: 'none',
      plain: 'GFCI 一直比較「出去的電流」和「回來的電流」。有人碰到火線，一點電流經過人體流進大地沒有回來，兩邊對不上就斷電。',
      rel: '出去 ≠ 回來 → 跳脫（超過約 10 mA 流過人體就很危險）',
      ov: '<path class="ln" style="fill:none;stroke-width:2" d="M80 100 H540 V200 H80"/>' + BOX(540, 150, '電器') +
        '<ellipse class="ring" style="stroke-width:2.6" cx="200" cy="150" rx="26" ry="70"/>' + T(200, 248, 'GFCI', { cls: 'ta', fs: 14 }) +
        AR(110, 88, 160, 88, 'i 出去', 100, 92, 'end') + AR(160, 214, 110, 214, 'i 回來', 100, 218, 'end') +
        '<path class="lna dsh" style="fill:none" d="M420 100 V230"/>' + D.arrow(420, 200, 420, 232, null, 'lna') + '<path class="ln" d="M405 238 H435 M410 244 H430 M416 250 H424"/>' + T(432, 180, '漏到地（經過人）', { cls: 'ta', fs: 12.5, a: 'start' }) }
  };
  /* 30° 跟著誰走（使用者 10/20：線電壓超前、線電流落後？） */
  const arc = (cx, cy, r, a1, a2) => { const x1 = cx + r * Math.cos(a1 * RAD), y1 = cy - r * Math.sin(a1 * RAD), x2 = cx + r * Math.cos(a2 * RAD), y2 = cy - r * Math.sin(a2 * RAD);
    return '<path class="lna" style="fill:none;stroke-width:2" d="M' + f1(x1) + ' ' + f1(y1) + ' A' + r + ' ' + r + ' 0 0 ' + (a2 > a1 ? 0 : 1) + ' ' + f1(x2) + ' ' + f1(y2) + '"/>'; };
  const R0 = 78, O = [190, 165];
  C.vlead = { t: '線電壓為什麼超前 30°', en: 'WHY V_L LEADS', base: 'none',
    plain: 'V<sub>ab</sub> = V<sub>an</sub> − V<sub>bn</sub>。V<sub>bn</sub> 比 V<sub>an</sub> <b>晚</b> 120°，減掉「晚到」的那支，合起來往<b>前</b>歪 30°，長度變 √3 倍。',
    rel: 'Y（abc）：V<sub>ab</sub> = √3 V<sub>an</sub>∠<b>+30°</b>',
    ov: ph(O[0], O[1], R0, [{ a: 0, l: 'V<sub>an</sub>', c: 'ln' }, { a: -120, l: 'V<sub>bn</sub>（晚 120°）', c: 'ln', ld: [-6, 4] }, { a: 60, from: [O[0] + R0, O[1]], l: '−V<sub>bn</sub>', c: 'ln dsh', ld: [8, 24] }, { a: 30, m: 1.732, l: 'V<sub>ab</sub>', ld: [-46, -2] }], { ax: 100, noTick: true }) +
      arc(O[0], O[1], 46, 0, 30) + T(O[0] + 118, O[1] - 28, '+30°', { cls: 'ta', fs: 14, a: 'start' }) +
      T(470, 120, '減掉「晚到」的', { cls: 't', fs: 15 }) + T(470, 150, '→ 往前歪：超前 30°', { cls: 'ta', fs: 16 }) + T(470, 190, '例：V<sub>an</sub> = 100∠10°', { cls: 'tm', fs: 13 }) + T(470, 214, '→ V<sub>AB</sub> = 173.2∠40°', { cls: 'tm', fs: 13 }) };
  C.ilag = { t: '線電流為什麼落後 30°', en: 'WHY I_L LAGS', base: 'none',
    plain: 'Δ 負載的角 A：I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>。I<sub>CA</sub> 比 I<sub>AB</sub> <b>早</b> 120°，減掉「早到」的那支，合起來往<b>後</b>歪 30°，長度變 √3 倍。',
    rel: 'Δ（abc）：I<sub>a</sub> = √3 I<sub>AB</sub>∠<b>−30°</b>',
    ov: ph(O[0], O[1], R0, [{ a: 0, l: 'I<sub>AB</sub>', c: 'ln' }, { a: 120, l: 'I<sub>CA</sub>（早 120°）', c: 'ln', ld: [-4, -4] }, { a: -60, from: [O[0] + R0, O[1]], l: '−I<sub>CA</sub>', c: 'ln dsh', ld: [8, -14] }, { a: -30, m: 1.732, l: 'I<sub>a</sub>', ld: [-30, 14] }], { ax: 100, noTick: true }) +
      arc(O[0], O[1], 46, 0, -30) + T(O[0] + 118, O[1] + 36, '−30°', { cls: 'ta', fs: 14, a: 'start' }) +
      T(470, 120, '減掉「早到」的', { cls: 't', fs: 15 }) + T(470, 150, '→ 往後歪：落後 30°', { cls: 'ta', fs: 16 }) + T(470, 190, '例：I<sub>AB</sub> = 19.36∠13.43°', { cls: 'tm', fs: 13 }) + T(470, 214, '→ I<sub>a</sub> = 33.53∠−16.57°', { cls: 'tm', fs: 13 }) };
  C.deg30 = { t: '30° 跟著誰走', en: 'WHERE THE 30° GOES', base: 'none',
    plain: '30° 只跟著「√3 倍」的那個量走：Y 接是電壓（超前），Δ 接是電流（落後）。另一個量線、相一樣，沒有 30°。',
    rel: '口訣（abc）：電壓超前、電流落後，各 30°；acb 兩個都反過來',
    ov: yIcon(250, 58, 30) + T(250, 110, 'Y 接', { cls: 't', fs: 15 }) + dIcon(470, 64, 34) + T(470, 110, 'Δ 接', { cls: 't', fs: 15 }) +
      '<line class="ln2" x1="70" y1="126" x2="590" y2="126"/>' +
      T(80, 160, '電壓', { cls: 'ts', fs: 13, a: 'start' }) + T(250, 152, 'V<sub>L</sub> = √3 V<sub>p</sub>', { cls: 'ta', fs: 15 }) + T(250, 174, '超前 30°', { cls: 'ta', fs: 14 }) +
      T(470, 152, 'V<sub>L</sub> = V<sub>p</sub>', { cls: 't', fs: 15 }) + T(470, 174, '沒有 30°', { cls: 'ts', fs: 13 }) +
      T(80, 222, '電流', { cls: 'ts', fs: 13, a: 'start' }) + T(250, 214, 'I<sub>L</sub> = I<sub>p</sub>', { cls: 't', fs: 15 }) + T(250, 236, '沒有 30°', { cls: 'ts', fs: 13 }) +
      T(470, 214, 'I<sub>L</sub> = √3 I<sub>p</sub>', { cls: 'ta', fs: 15 }) + T(470, 236, '落後 30°', { cls: 'ta', fs: 14 }) +
      HL(175, 136, 150, 48) + HL(395, 198, 150, 48) + T(320, 280, 'acb 相序：超前 ↔ 落後 對調', { cls: 'tm', fs: 13 }) };
  BASE.unb = () => sys3({ src: 'Y', load: 'Y', x0: 90, x1: 530, y: Y, vs: ['', '', ''], z: ['Z<sub>1</sub>', 'Z<sub>2</sub>', 'Z<sub>3</sub>'], n: true });

  const SETS = {
    p1: ['fire', 'vp', 'vl', 'ip', 'il', 'yeq', 'vlead', 'deg30', 'bal', 'per', 'cmp'],
    p2: ['vp', 'vl', 'ip', 'il', 'yeq', 'dvp', 'dip', 'dil', 'cmp', 'vlead', 'ilag', 'deg30', 'zy', 'dsrc'],
    p3: ['vp', 'vl', 'ip', 'il', 'cmp', 'deg30', 'p1', 'ptot', 'theta', 'unb', 'wire'],
    p4: ['vl', 'il', 'fire', 'wm', 'w2', 'sp3', 'gfci']
  };
  const DEFS = '<defs><filter id="st-sh" x="-20%" y="-30%" width="140%" height="170%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".12"/></filter></defs>';
  const inner = key => { const c = C[key]; return (BASE[c.base] ? BASE[c.base]() : '') + c.ov; };
  const svg = key => '<svg class="st-svg tp-svg" viewBox="0 0 640 300" role="img" aria-label="' + C[key].t + '的電路圖">' + DEFS + inner(key) + '</svg>';

  /* 頁面：名詞圖鑑 */
  function mount(el) {
    const keys = SETS[el.dataset.set] || SETS.p2;
    el.innerHTML = '<div class="tpic-tabs dv-ui" role="tablist">' + keys.map((k, i) => '<button class="btn" type="button" role="tab" data-tk="' + k + '" aria-pressed="' + (i ? 'false' : 'true') + '">' + C[k].t + '</button>').join('') + '</div>' +
      '<div class="tpic-body"><div class="tpic-fig"></div><div class="tpic-txt"><h4></h4><div class="tpic-en"></div><p class="tpic-plain"></p><div class="tpic-rel"></div></div></div>';
    const show = k => {
      const c = C[k];
      el.querySelector('.tpic-fig').innerHTML = svg(k);
      el.querySelector('h4').innerHTML = c.t;
      el.querySelector('.tpic-en').textContent = c.en;
      el.querySelector('.tpic-plain').innerHTML = c.plain;
      el.querySelector('.tpic-rel').innerHTML = c.rel;
      el.querySelectorAll('[data-tk]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tk === k)));
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-tk]'); if (b) show(b.dataset.tk); });
    show(keys[0]);
  }
  document.querySelectorAll('.tpic').forEach(mount);

  /* 故事：每個名詞一幕（圖 → 白話 → 關係式） */
  function scenes(keys) {
    return keys.map(k => {
      const c = C[k];
      const plain = c.plain.replace(/<(?!\/?(b|sub|sup)>)[^>]+>/g, '');
      return K.sc(c.t, c.en,
        g('fig', '<svg x="88" y="86" width="464" height="241" viewBox="60 20 520 270">' + inner(k) + '</svg>'),
        [{ sub: plain, on: 'fig' }, { sub: '記這一條：' + c.rel, on: '' }]);
    });
  }

  /* 名詞彈窗附圖 */
  const TF = window.__TERMFIG = window.__TERMFIG || {};
  [['相電壓', 'vp'], ['線電壓', 'vl'], ['相電流', 'ip'], ['線電流', 'il'], ['中性線', 'fire'], ['火線', 'fire'], ['Y接', 'yeq'], ['Δ接', 'dvp'],
   ['平衡負載', 'bal'], ['單相等效電路', 'per'], ['不平衡系統', 'unb'], ['Δ-Y轉換', 'zy'], ['兩瓦特計法', 'w2'], ['三相四線', 'fire']].forEach(p => { TF[p[0]] = () => svg(p[1]); });

  window.__CH12T = { cards: C, sets: SETS, svg, scenes, mount };
})();
