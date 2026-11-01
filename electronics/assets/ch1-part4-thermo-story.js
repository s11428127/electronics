/* ============================================================
   電子學 CH1 PART 4 §06 二極體溫度計 —— 補課故事（11/1 使用者：「溫度計那邊看不懂、公式亂七八糟」）
   謎題：電壓表讀到 0.579 V，現在幾度？ → 生活比喻（水銀溫度計、量體溫不能剛跑完步）→ 先整理一下 →
   直線公式 V_D = 1.12 − 0.522·T/300 每個數字的意思 → 斜率 → 反過來解 T → 回頭解謎（311 K ≈ 38 °C ≈ 100 °F）。
   數字全部照課本 §1.6（Fig 1.47、1.48）：15 V、15 kΩ、300 K 時 0.598 V、0 °F 0.676 V、100 °F 0.579 V。
   需要：story.js、ch1-part5-kit.js（__K15）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15 || !document.getElementById('thermo-story')) return;
  const K = window.__K15, D = K.D;
  const { g, T, calc, sc, circ } = K;
  const { chip, arrow } = D;

  /* 電壓表（接在二極體兩端）：迴路右邊 xr、中線 ym */
  const meter = (xr, ym, key, val) => g(key,
    '<path class="ln" style="fill:none" d="M' + xr + ' ' + (ym - 40) + ' H' + (xr + 60) + ' V' + (ym - 22) + ' M' + (xr + 60) + ' ' + (ym + 22) + ' V' + (ym + 40) + ' H' + xr + '"/>' +
    '<circle class="bgw" cx="' + (xr + 60) + '" cy="' + ym + '" r="22" style="stroke:var(--s-ink);stroke-width:1.8"/>' + T(xr + 60, ym + 6, 'V', { fs: 17 }) +
    (val ? '<rect class="card" x="' + (xr + 96) + '" y="' + (ym - 22) + '" width="120" height="44" rx="10" filter="url(#st-sh)"/>' + T(xr + 156, ym + 8, val, { cls: 'ta', fs: 22 }) : ''));
  /* 水銀溫度計：x 中心、y 頂、h 管長、lv 0～1 液面高度 */
  const thermo = (x, y, h, lv, key, lab) => g(key,
    '<rect class="bgw" x="' + (x - 9) + '" y="' + y + '" width="18" height="' + h + '" rx="9" style="stroke:var(--s-ink);stroke-width:1.8"/>' +
    '<circle class="bgw" cx="' + x + '" cy="' + (y + h + 10) + '" r="16" style="stroke:var(--s-ink);stroke-width:1.8"/>' +
    '<circle class="acc" cx="' + x + '" cy="' + (y + h + 10) + '" r="11"/>' +
    '<rect class="acc" x="' + (x - 4) + '" y="' + (y + h * (1 - lv)) + '" width="8" height="' + (h * lv + 8) + '"/>' +
    (lab ? T(x, y - 10, lab, { cls: 'tm', fs: 13 }) : ''));

  /* 共用的 V_D–T 圖：240～330 K、0.55～0.70 V */
  const X = Tk => 140 + (Tk - 240) / 90 * 400, Y = v => 290 - (v - 0.55) / 0.15 * 180;
  const VD = Tk => 1.12 - 0.522 * Tk / 300;
  const axes = g(null,
    arrow(130, 290, 560, 290, null, 'ln') + arrow(140, 296, 140, 100, null, 'ln') +
    T(560, 306, 'T（K）', { cls: 'tm', fs: 12, a: 'end' }) + T(148, 108, 'V<sub>D</sub>（V）', { cls: 'tm', fs: 12, a: 'start' }) +
    [250, 275, 300].map(t => '<line class="ln2" x1="' + X(t) + '" y1="286" x2="' + X(t) + '" y2="294"/>' + T(X(t), 306, String(t), { cls: 'ts', fs: 11 })).join('') +
    [0.6, 0.65].map(v => '<line class="ln2" x1="136" y1="' + Y(v) + '" x2="144" y2="' + Y(v) + '"/>' + T(130, Y(v) + 4, v.toFixed(2), { cls: 'ts', fs: 11, a: 'end' })).join(''));
  const line = '<line class="lna" x1="' + X(245) + '" y1="' + Y(VD(245)) + '" x2="' + X(325) + '" y2="' + Y(VD(325)) + '" style="stroke-width:2.6" data-k="ln"/>';
  const pt = (Tk, v, lab, key, dx, dy) => g(key, '<circle class="acc" cx="' + X(Tk) + '" cy="' + Y(v) + '" r="6"/>' +
    '<path class="ln2 dsh" style="fill:none" d="M' + X(Tk) + ' ' + Y(v) + ' V290 M' + X(Tk) + ' ' + Y(v) + ' H140"/>' +
    T(X(Tk) + (dx || 12), Y(v) + (dy || -10), lab, { cls: 'ta', fs: 12.5, a: (dx || 12) > 0 ? 'start' : 'end' }));

  /* ── 0 謎題 ── */
  const S0 = sc('一顆二極體，怎麼當溫度計？', 'THE PUZZLE',
    circ(90, 140, 170, 130, { k: 'c', vps: '15 V', r: '15 kΩ' }) + meter(260, 205, 'm', '0.579 V') +
    chip(470, 124, '現在幾度？', '只看電壓表 0.579 V', 'q', { fs: 15, acc: true }),
    [{ sub: '課本的溫度計只有三樣東西：15 V 電源、15 kΩ 電阻、一顆二極體。', on: 'c' },
     { sub: '電壓表夾在二極體兩端，現在讀到 <b>0.579 V</b>。', on: 'm' },
     { sub: '<b>謎題</b>：只看這個電壓，怎麼知道現在幾度？', on: 'q' }]);

  /* ── 1 複習：越熱，電壓越低 ── */
  const S1 = sc('先複習上一節：越熱，電壓越低', 'RECAP · −2 mV PER °C',
    thermo(200, 120, 110, 0.15, 'cold', '很冷') + T(200, 290, 'V<sub>D</sub> = 0.676 V', { cls: 't', fs: 15, k: 'cv' }) +
    thermo(440, 120, 110, 0.85, 'hot', '很熱') + T(440, 290, 'V<sub>D</sub> = 0.579 V', { cls: 'ta', fs: 15, k: 'hv' }) +
    chip(320, 175, '同一個電流', '越熱 → 越好過 → 要的電壓越小', 'ch', { fs: 13 }),
    [{ sub: '§05 講過：<b>電流固定</b>的時候，溫度一升高，二極體的電壓就往下掉。', on: 'ch' },
     { sub: '很冷時（0 °F）量到 0.676 V。', on: 'cold cv' },
     { sub: '很熱時（100 °F）只剩 0.579 V。大約每升 1 度少 2 mV。', on: 'hot hv' }]);

  /* ── 2 比喻：水銀溫度計 ── */
  const S2 = sc('缺點反過來就是優點', 'TURN THE BUG INTO A FEATURE',
    thermo(170, 125, 110, 0.6, 'hg') +
    '<rect class="card" x="230" y="135" width="150" height="54" rx="10" filter="url(#st-sh)" data-k="c1"/>' + T(305, 158, '水銀溫度計', { fs: 14, k: 'c1t' }) + T(305, 178, '溫度 → 長度', { cls: 'ta', fs: 14, k: 'c1u' }) +
    '<rect class="card" x="400" y="135" width="170" height="54" rx="10" filter="url(#st-sh)" data-k="c2"/>' + T(485, 158, '二極體溫度計', { fs: 14, k: 'c2t' }) + T(485, 178, '溫度 → 電壓', { cls: 'ta', fs: 14, k: 'c2u' }) +
    chip(400, 262, '量電壓 → 反推溫度', '電壓表就是刻度', 'rev', { fs: 14, acc: true }),
    [{ sub: '想想水銀溫度計：越熱，水銀柱越長。看長度就知道溫度。', on: 'hg c1 c1t c1u' },
     { sub: '二極體也一樣：越熱，電壓越低。溫度被「翻譯」成電壓。', on: 'c2 c2t c2u' },
     { sub: '所以反過來：<b>量電壓，就能反推溫度</b>。電壓表就是刻度。', on: 'rev' }]);

  /* ── 3 條件：電流要固定 ── */
  const S3 = sc('條件：電流一定要固定', 'THE CURRENT MUST BE CONSTANT',
    chip(320, 128, '量體溫不能剛跑完步', '別的東西也會改讀數 → 分不出是誰造成的', 'run', { fs: 14 }) +
    calc(150, 168, 340, [['電流變 10 倍 → V<sub>D</sub> 差 60 mV', 'r1'], ['60 mV ÷ 1.74 mV/度 ≈ 34 度', 'r2'], ['電流一亂，溫度就差 30 多度 ✗', 'r3', 'ta']], { k: 'cc' }),
    [{ sub: '量體溫不能剛跑完步：體溫計會被別的事影響。', on: 'run' },
     { sub: '二極體的電壓除了看溫度，也看電流：電流變 10 倍，電壓差 60 mV（§03）。', on: 'cc r1' },
     { sub: '這 60 mV 會被誤認成 30 多度的溫差。所以<b>電流一定要固定</b>。', on: 'r2 r3' }]);

  /* ── 4 怎麼固定：大電源＋大電阻 ── */
  const S4 = sc('15 V ＋ 15 kΩ：電流幾乎不動', 'A BIG SUPPLY HOLDS THE CURRENT',
    circ(70, 150, 170, 120, { k: 'c', vps: '15 V', r: '15 kΩ', cur: 'cur' }) +
    calc(310, 118, 300, [['I<sub>D</sub> = (15 − V<sub>D</sub>) ÷ 15 kΩ', 'r1'], ['V<sub>D</sub> = 0.6 V → 0.960 mA', 'r2'], ['V<sub>D</sub> = 0.5 V → 0.967 mA', 'r3'], ['只差 0.7% → 當成固定 ✓', 'r4', 'ta']], { k: 'cc' }),
    [{ sub: '電流 = 電阻上的電壓 ÷ 電阻。電阻上的電壓是 15 − V<sub>D</sub>。', on: 'c cur cc r1' },
     { sub: 'V<sub>D</sub> = 0.6 V 時，電流 0.960 mA。', on: 'r2' },
     { sub: '就算 V<sub>D</sub> 掉了 0.1 V，電流也只變成 0.967 mA。', on: 'r3' },
     { sub: '15 V 比 0.6 V 大太多，V<sub>D</sub> 怎麼變都影響不了電流 —— <b>近似固定</b>。', on: 'r4' }]);

  /* ── 5 先整理一下 ── */
  const S5 = sc('先整理一下', "LET'S RECAP",
    chip(320, 130, '① 15 V ＋ 15 kΩ 讓電流固定（約 1 mA）', '', 'a', { fs: 15 }) +
    chip(320, 190, '② 量二極體兩端的電壓 V<sub>D</sub>', '', 'b', { fs: 15 }) +
    chip(320, 250, '③ 電壓越低 = 越熱', '', 'c', { fs: 15, acc: true }),
    [{ sub: '觀念講完了，先整理：第一步，大電源＋大電阻讓電流固定。', on: 'a' },
     { sub: '第二步，用電壓表量二極體的電壓。', on: 'b' },
     { sub: '第三步，電壓越低代表越熱。接下來才上公式。', on: 'c' }]);

  /* ── 6 畫成一條直線 ── */
  const S6 = sc('三個點連起來：一條直線', 'IT IS A STRAIGHT LINE',
    axes + line + pt(255.2, 0.676, '0 °F：0.676 V', 'p1') + pt(300, 0.598, '300 K：0.598 V', 'p2') + pt(310.8, 0.579, '100 °F：0.579 V', 'p3', 12, 22),
    [{ sub: '把課本 Fig 1.48 的數字畫出來：橫軸溫度（K），縱軸電壓。', on: 'p1' },
     { sub: '室溫 300 K（27 °C）量到 0.598 V。', on: 'p2' },
     { sub: '100 °F 量到 0.579 V。', on: 'p3' },
     { sub: '三個點剛好在<b>一條往下的直線</b>上。', on: 'ln' }]);

  /* ── 7 直線的公式 ── */
  const S7 = sc('這條直線的公式', 'THE FORMULA',
    calc(120, 112, 400, [['V<sub>D</sub> = 1.12 − 0.522 × T ÷ 300', 'f', 'ta', 20]], { k: 'fc', a: 'middle' }) +
    calc(120, 182, 400, [['1.12 V：直線的起點（矽的能隙，直接背）', 'r1'], ['0.522 = 1.12 − 0.598（300 K 量到的）', 'r2'], ['T 一定用 K（°C ＋ 273）', 'r3', 'ta']], { k: 'cc' }),
    [{ sub: '課本把這條直線寫成：<b>V<sub>D</sub> = 1.12 − 0.522 × T ÷ 300</b>。', on: 'fc f' },
     { sub: '1.12 V 是直線的起點，剛好等於矽的能隙。照背就好。', on: 'cc r1' },
     { sub: '0.522 從哪來？300 K 時量到 0.598 V，1.12 − 0.598 = 0.522。', on: 'r2' },
     { sub: '公式裡的 T 一定用 <b>K</b>：攝氏要先加 273。', on: 'r3' }]);

  /* ── 8 斜率 ── */
  const S8 = sc('每熱 1 度，少 1.74 mV', 'THE SLOPE',
    axes + line.replace(' data-k="ln"', '') + pt(300, 0.598, '', null) +
    calc(330, 108, 260, [['斜率 = 0.522 ÷ 300', 'r1'], ['= 0.00174 V/K', 'r2'], ['= −1.74 mV/K', 'r3', 'ta']], { k: 'cc' }),
    [{ sub: '直線往下斜。斜率是 0.522 ÷ 300。', on: 'cc r1' },
     { sub: '= 0.00174 V，也就是每熱 1 K，電壓少 <b>1.74 mV</b>。', on: 'r2 r3' },
     { sub: '跟上一節的「約 −2 mV/°C」同一個等級 ✓（1 K 跟 1 °C 一樣大）。' }]);

  /* ── 9 反過來解 T ── */
  const S9 = sc('反過來：從電壓求溫度', 'SOLVE FOR T',
    calc(140, 112, 360, [['V<sub>D</sub> = 1.12 − 0.522 × T ÷ 300', 'r1'], ['0.522 × T ÷ 300 = 1.12 − V<sub>D</sub>', 'r2'], ['T = 300 × (1.12 − V<sub>D</sub>) ÷ 0.522', 'r3', 'ta', 17]], { k: 'cc' }),
    [{ sub: '考試給你電壓、要你求溫度，就把公式反過來。', on: 'cc r1' },
     { sub: '把 0.522 那項移到左邊、V<sub>D</sub> 移到右邊。', on: 'r2' },
     { sub: '兩邊乘 300、除 0.522：<b>T = 300 × (1.12 − V<sub>D</sub>) ÷ 0.522</b>。', on: 'r3' }]);

  /* ── 10 回頭解謎 ── */
  const S10 = sc('回頭解謎：0.579 V 是幾度？', 'PUZZLE SOLVED',
    calc(150, 108, 340, [['1.12 − 0.579 = 0.541', 'r1'], ['0.541 ÷ 0.522 = 1.036', 'r2'], ['1.036 × 300 ≈ 311 K', 'r3', 'ta'], ['311 − 273 = 38 °C（約 100 °F）', 'r4', 'ta']], { k: 'cc' }),
    [{ sub: '帶進去：1.12 − 0.579 = 0.541。', on: 'cc r1' },
     { sub: '除以 0.522 得 1.036。', on: 'r2' },
     { sub: '乘 300：約 <b>311 K</b>。', on: 'r3' },
     { sub: '減 273 是 <b>38 °C</b>，也就是課本的 100 °F。<b>謎題解開了</b>。', on: 'r4' }]);

  /* ── 11 恍然大悟 ── */
  const S11 = sc('恍然大悟', 'THE ANSWER',
    calc(140, 104, 360, [['0.676 V → 255 K（0 °F，很冷）', 'r1'], ['0.598 V → 300 K（27 °C，室溫）', 'r2'], ['0.579 V → 311 K（100 °F，很熱）', 'r3', 'ta']], { k: 'cc', title: '課本 Fig 1.48 的三個點' }) +
    chip(320, 246, '電壓越低 → 越熱', '電流要固定、T 用 K', 'k', { fs: 14, acc: true }),
    [{ sub: '課本的三個點：電壓高是冷，電壓低是熱。', on: 'cc r1 r2 r3' },
     { sub: '記住：<b>電流固定、電壓越低越熱、T 用 K</b>。', on: 'k' }]);

  window.__ch1p4Thermo = window.__Story('#thermo-story', {
    id: 'ch1-part4-thermo', title: 'CH1 PART 4 補課：二極體溫度計', after: '#thermo-eq', afterLabel: '往下看公式和小遊戲 ↓',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11]
  });
})();
