/* ============================================================
   電路學 CH13 課本例題與練習題（13.6 自耦、13.7 三相變壓器、13.9 應用）
   Example 13.10–13.12、13.15–13.17；Practice 13.10–13.12、13.15–13.17（13.8 PSpice 的 13.13、13.14 不收）
   需要：schem.js、ch13-kit.js、ch13-ex.js
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, K = window.__K13;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, parts, pad) => S.svg(w + (pad || 0), h, pad ? ['<g transform="translate(' + pad + ',0)">'].concat(parts, ['</g>']) : parts);
  const T = (x, y, s, a, fs) => S.t(x, y, s, a || 'middle', ' font-size="' + (fs || 11) + '"');
  /* 自耦變壓器：線圈在 x，上段 y1→ym、下段 ym→y2，鐵心在左邊 */
  const auto = (x, y1, ym, y2, l1, l2) => [K.coil(x, y1, ym, -1), K.coil(x, ym, y2, -1), S.w((x - 18) + ',' + (y1 + 8), (x - 18) + ',' + (y2 - 8)), S.w((x - 23) + ',' + (y1 + 8), (x - 23) + ',' + (y2 - 8)),
    K.dt(x + 9, y1 + 12), K.dt(x + 9, ym + 12), T(x + 14, (y1 + ym) / 2 + 4, l1, 'start'), T(x + 14, (ym + y2) / 2 + 4, l2, 'start')].join('');
  const F = {
    f1343: G(400, 190, [S.term(20, 60), S.term(20, 140), T(30, 104, '240 V', 'start'), S.w('20,60', '80,60'), S.w('20,140', '80,140'), K.xf(80, 60, 140, { n: '' }), S.w('106,60', '160,60'), S.w('106,140', '160,140'),
      S.term(160, 60), S.term(160, 140), T(150, 104, '12 V', 'end'), K.ia(30, 58, 48, '0.2 A'), K.ia(118, 148, 48, '4 A'), T(90, 180, '(a) 兩繞組'),
      S.term(220, 140), S.term(220, 170), T(232, 160, '240 V', 'start'), S.w('220,140', '300,140'), S.w('220,170', '300,170'), K.coil(300, 20, 90, -1), K.coil(300, 90, 170, -1), S.w('280,30', '280,165'), S.w('275,30', '275,165'),
      S.w('300,140', '300,140'), S.w('300,20', '370,20'), S.term(370, 20), S.term(370, 170), S.w('300,170', '370,170'), T(312, 58, '12 V', 'start'), T(380, 100, '252 V', 'start'), K.ia(226, 254, 130, '4.2 A'), K.ia(320, 350, 12, '4 A'), T(300, 186, '(b) 自耦（接成升壓）')], 10),
    f1344: G(330, 190, [S.vs(40, 100, 170, '120∠30° V'), S.w('40,100', '150,100'), S.w('40,170', '150,170'), auto(150, 30, 100, 170, '120 匝', '80 匝'), S.dot(150, 100),
      S.w('150,30', '250,30'), S.z(250, 30, 250, 170, 'Z_L', { side: 'r' }), S.w('150,170', '250,170'), K.ia(70, 100, 90, 'I_1'), K.ia(190, 220, 20, 'I_2'), K.iv(162, 160, 132, 'I_o'), T(225, 104, 'V_2', 'end'), T(60, 140, 'V_1', 'start')], 80),
    f1345: G(330, 190, [S.term(30, 30), S.term(30, 170), T(40, 104, 'V_1', 'start'), S.w('30,30', '150,30'), S.w('30,170', '150,170'), auto(150, 30, 100, 170, '', ''), S.dot(150, 100),
      S.w('150,100', '250,100'), S.box(230, 112, 70, 34, ['16 kW', '負載']), S.w('265,100', '265,112'), S.w('265,146', '265,170', '150,170'), T(210, 140, 'V_2', 'end'), K.ia(50, 80, 20, 'I_1'), K.ia(190, 220, 90, 'I_2'), K.iv(162, 160, 128, 'I_o')], 10),
    f1362: G(340, 170, [S.vs(30, 30, 85, '120 V ac'), S.vs(30, 85, 140, '12 V dc'), S.r(30, 30, 120, 30, 'R_s'), K.xf(120, 30, 140, { n: '3 : 1', d1: 't', d2: 't' }), S.w('30,140', '120,140'),
      S.w('146,30', '240,30'), S.r(240, 30, 240, 140, 'R_L = 5 kΩ', { side: 'r' }), S.w('146,140', '240,140')], 80),
    f1368: G(380, 200, [S.term(20, 40), S.term(20, 160), T(28, 104, '2400 V', 'start'), S.w('20,40', '90,40'), S.w('20,160', '90,160'), K.coil(90, 40, 160, 1), S.w('108,45', '108,155'), S.w('113,45', '113,155'),
      K.coil(130, 40, 100, -1), K.coil(130, 100, 160, -1), S.w('130,40', '330,40'), S.w('130,100', '330,100'), S.w('130,160', '330,160'), T(150, 74, '120 V', 'start'), T(150, 134, '120 V', 'start'),
      S.box(200, 52, 50, 34, ['TV']), S.w('225,40', '225,52'), S.w('225,86', '225,100'), S.box(270, 105, 60, 50, ['8 個', '100 W 燈泡']), S.w('300,100', '300,105'), S.w('300,155', '300,160'),
      S.box(340, 60, 40, 80, ['爐子', '15 kW']), S.w('330,40', '360,40', '360,60'), S.w('360,140', '360,160', '330,160'), K.ia(30, 60, 30, 'I_p')], 10)
  };

  const items = [
    /* ═══════════ 13.6 理想自耦變壓器 ═══════════ */
    { id: 'ex13-10', sec: '13.6', kind: 'ex', no: '13.10', title: '自耦變壓器能傳更多功率',
      q: '比較圖 13.43(a) 兩繞組變壓器與圖 13.43(b) 自耦變壓器的功率額定。', en: 'Compare the power ratings of the two-winding transformer in Fig. 13.43(a) and the autotransformer in Fig. 13.43(b).',
      fig: F.f1343, cap: '圖 13.43（重畫）',
      idea: '同一組線圈，每個繞組的電壓、電流都跟兩繞組時一樣；只是接法改成串在一起。',
      steps: [
        st('兩繞組。', 'S<sub>1</sub> = 0.2 × 240 = 48 VA（= S<sub>2</sub> = 4 × 12）', ''),
        st('自耦（240 V 繞組跟 12 V 繞組串在一起）。', 'S<sub>1</sub> = 4.2 × 240 = 1008 VA（= S<sub>2</sub> = 4 × 252）', '一次側電流 = 0.2 + 4 = 4.2 A；輸出電壓 = 240 + 12 = 252 V。'),
        st('比較。', '1008/48 = 21 倍', '大部分功率直接用導線傳過去，不用經過磁通。')
      ],
      ans: '兩繞組 48 VA；自耦 1008 VA（21 倍）' },
    { id: 'pp13-10', sec: '13.6', kind: 'pp', no: '13.10', title: '60 VA 改接成自耦',
      q: '參考圖 13.43。若兩繞組變壓器是 60 VA、120 V/10 V，改接成自耦變壓器的功率額定是多少？', en: 'Refer to Fig. 13.43. If the two-winding transformer is a 60-VA, 120 V/10 V transformer, what is the power rating of the autotransformer?',
      hint: '先求兩個繞組的額定電流，再照 Example 13.10 的接法：輸出 = 120 + 10 V。',
      steps: [
        st('繞組電流。', '120 V 繞組：60/120 = 0.5 A；10 V 繞組：60/10 = 6 A', ''),
        st('自耦接法。', '輸出電壓 = 120 + 10 = 130 V，電流 6 A', '10 V 繞組串在 120 V 繞組上面。'),
        st('額定。', 'S = 130 × 6 = 780 VA（一次側 120 × 6.5 = 780 VA）', '')
      ],
      ans: '780 VA' },
    { id: 'ex13-11', sec: '13.6', kind: 'ex', no: '13.11', title: '升壓自耦變壓器的三個電流',
      q: '圖 13.44 的自耦變壓器電路，Z<sub>L</sub> = 8 + j6 Ω。求 (a) I<sub>1</sub>、I<sub>2</sub>、I<sub>o</sub> (b) 送給負載的複功率。',
      en: 'Refer to the autotransformer circuit in Fig. 13.44. Calculate: (a) I<sub>1</sub>, I<sub>2</sub>, and I<sub>o</sub> if Z<sub>L</sub> = 8 + j6 Ω, and (b) the complex power supplied to the load.',
      fig: F.f1344, cap: '圖 13.44（重畫）',
      idea: '電源跨在 80 匝、負載跨在 120 + 80 匝 → 升壓，N<sub>1</sub> = 80、N<sub>2</sub> = 120，V<sub>1</sub>/V<sub>2</sub> = N<sub>1</sub>/(N<sub>1</sub> + N<sub>2</sub>)。',
      steps: [
        st('(a) V<sub>2</sub>。', 'V<sub>2</sub> = (200/80)V<sub>1</sub> = (200/80)(120∠30°) = 300∠30° V', ''),
        st('(a) I<sub>2</sub>。', 'I<sub>2</sub> = V<sub>2</sub>/Z<sub>L</sub> = 300∠30°/10∠36.87° = 30∠−6.87° A', ''),
        st('(a) I<sub>1</sub>。', 'I<sub>1</sub>/I<sub>2</sub> = (N<sub>1</sub> + N<sub>2</sub>)/N<sub>1</sub> = 200/80 ⟹ I<sub>1</sub> = 75∠−6.87° A', '式 13.68：電流跟電壓反比。'),
        st('(a) I<sub>o</sub>（抽頭 KCL）。', 'I<sub>1</sub> + I<sub>o</sub> = I<sub>2</sub> ⟹ I<sub>o</sub> = 30∠−6.87° − 75∠−6.87° = 45∠173.13° A', ''),
        st('(b) 複功率。', 'S<sub>2</sub> = V<sub>2</sub>I<sub>2</sub>* = |I<sub>2</sub>|<sup>2</sup>Z<sub>L</sub> = 900 × 10∠36.87° = 9∠36.87° kVA', '')
      ],
      ans: 'I<sub>1</sub> = 75∠−6.87° A、I<sub>2</sub> = 30∠−6.87° A、I<sub>o</sub> = 45∠173.13° A；S<sub>2</sub> = 9∠36.87° kVA' },
    { id: 'pp13-11', sec: '13.6', kind: 'pp', no: '13.11', title: '降壓自耦變壓器的電流',
      q: '圖 13.45 的自耦變壓器電路，V<sub>1</sub> = 2.5 kV、V<sub>2</sub> = 1 kV，求 I<sub>1</sub>、I<sub>2</sub>、I<sub>o</sub>。', en: 'In the autotransformer circuit of Fig. 13.45, find currents I<sub>1</sub>, I<sub>2</sub>, and I<sub>o</sub>. Take V<sub>1</sub> = 2.5 kV, V<sub>2</sub> = 1 kV.',
      fig: F.f1345, cap: '圖 13.45（重畫）',
      hint: '理想 → 兩邊功率都是 16 kW（電阻性負載）。I<sub>o</sub> 是下段繞組的電流 = I<sub>2</sub> − I<sub>1</sub>。',
      steps: [
        st('I<sub>2</sub>。', 'I<sub>2</sub> = 16000/1000 = 16 A', ''),
        st('I<sub>1</sub>。', 'I<sub>1</sub> = 16000/2500 = 6.4 A', ''),
        st('I<sub>o</sub>。', 'I<sub>o</sub> = I<sub>2</sub> − I<sub>1</sub> = 9.6 A', '抽頭的 KCL。')
      ],
      ans: 'I<sub>1</sub> = 6.4 A、I<sub>2</sub> = 16 A、I<sub>o</sub> = 9.6 A' },

    /* ═══════════ 13.7 三相變壓器 ═══════════ */
    { id: 'ex13-12', sec: '13.7', kind: 'ex', no: '13.12', title: 'Y-Δ 三相變壓器',
      q: '圖 13.50 的 42 kVA 平衡負載由三相變壓器供電，匝數比 1:5、二次側線電壓 240 V。(a) 判斷接法 (b) 求一次側線電壓、線電流 (c) 每個變壓器的 kVA 額定（假設理想）。',
      en: 'The 42-kVA balanced load depicted in Fig. 13.50 is supplied by a three-phase transformer. (a) Determine the type of transformer connections. (b) Find the line voltage and current on the primary side. (c) Determine the kVA rating of each transformer used in the transformer bank. Assume that the transformers are ideal.',
      idea: '課本圖 13.50：一次側接成 Y、二次側接成 Δ。Y-Δ：V<sub>Ls</sub> = nV<sub>Lp</sub>/√3、I<sub>Ls</sub> = √3 I<sub>Lp</sub>/n。',
      steps: [
        st('(a) 接法。', '一次側 Y、二次側 Δ ⟹ Y-Δ', ''),
        st('(b) 二次側線電流。', 'I<sub>Ls</sub> = S<sub>T</sub>/(√3 V<sub>Ls</sub>) = 42000/(√3 × 240) = 101 A', '式 13.69a。'),
        st('(b) 一次側。', 'I<sub>Lp</sub> = nI<sub>Ls</sub>/√3 = 5 × 101/√3 = 292 A；V<sub>Lp</sub> = √3 V<sub>Ls</sub>/n = √3 × 240/5 = 83.14 V', '式 13.71 反過來用。'),
        st('(c) 每個變壓器。', 'S = S<sub>T</sub>/3 = 14 kVA（檢查：Δ 側每相 240 V × 101/√3 = 58.34 A = 14 kVA）', '平衡 → 三個平分。')
      ],
      ans: '(a) Y-Δ　(b) V<sub>Lp</sub> ≈ 83.14 V、I<sub>Lp</sub> ≈ 292 A　(c) 14 kVA',
      note: '課本 (c) 寫「For the primary side … delta connection … 240 V … I<sub>Lp</sub>/√3 = 58.34 A」—— 240 V、Δ 接其實是二次側，58.34 A 是 I<sub>Ls</sub>/√3。這裡改成二次側；一次側驗算：每相 83.14/√3 = 48 V × 292 A = 14 kVA，一樣。' },
    { id: 'pp13-12', sec: '13.7', kind: 'pp', no: '13.12', title: 'Δ-Δ 降壓供電給工廠',
      q: '三相 Δ-Δ 變壓器把 625 kV 線電壓降到 12.5 kV 供工廠用。工廠吃 40 MW、功率因數 0.85 落後。求 (a) 工廠的電流 (b) 匝數比 (c) 一次側電流 (d) 每個變壓器的負載。',
      en: 'A three-phase Δ-Δ transformer is used to step down a line voltage of 625 kV, to supply a plant operating at a line voltage of 12.5 kV. The plant draws 40 MW with a lagging power factor of 85 percent. Find: (a) the current drawn by the plant, (b) the turns ratio, (c) the current on the primary side of the transformer, and (d) the load carried by each transformer.',
      hint: 'S<sub>T</sub> = P/pf；Δ-Δ：V<sub>Ls</sub> = nV<sub>Lp</sub>、I<sub>Ls</sub> = I<sub>Lp</sub>/n。',
      steps: [
        st('(a)。', 'I<sub>Ls</sub> = 40×10<sup>6</sup>/(√3 × 12.5×10<sup>3</sup> × 0.85) = 2174 A', ''),
        st('(b)。', 'n = 12.5/625 = 0.02', ''),
        st('(c)。', 'I<sub>Lp</sub> = nI<sub>Ls</sub> = 43.47 A', ''),
        st('(d)。', 'S<sub>T</sub>/3 = (40/0.85)/3 = 15.69 MVA', '')
      ],
      ans: '(a) 2.174 kA　(b) 0.02　(c) 43.47 A　(d) 15.69 MVA' },

    /* ═══════════ 13.9 應用 ═══════════ */
    { id: 'ex13-15', sec: '13.9', kind: 'ex', no: '13.15', title: '變壓器擋直流（隔離）',
      q: '求圖 13.62 負載兩端的電壓。', en: 'Determine the voltage across the load in Fig. 13.62.',
      fig: F.f1362, cap: '圖 13.62（重畫）',
      idea: '疊加：直流、交流分開看。變壓器只有「變化的」電流才能感應。',
      steps: [
        st('直流部分。', 'v<sub>L1</sub> = 0', '直流不變 → 二次側感應不到。'),
        st('交流部分。', 'V<sub>2</sub>/V<sub>1</sub> = 1/3 ⟹ V<sub>2</sub> = 120/3 = 40 V', 'R<sub>s</sub> 很小，可以忽略。'),
        st('合起來。', 'v<sub>L</sub> = 0 + 40 cos ωt V', '只有交流傳得過去：直流隔離。')
      ],
      ans: 'v<sub>L</sub> = 40 cos ωt V（只有交流 40 V）' },
    { id: 'pp13-15', sec: '13.9', kind: 'pp', no: '13.15', title: '量高壓線的電壓',
      q: '參考圖 13.61，把 13.2 kV 線電壓降到安全的 120 V，需要多少匝數比？', en: 'Refer to Fig. 13.61. Calculate the turns ratio required to step down the 13.2-kV line voltage to a safe level of 120 V.',
      hint: 'N<sub>1</sub>/N<sub>2</sub> = V<sub>1</sub>/V<sub>2</sub>。',
      steps: [st('匝數比。', '13200/120 = 110（一次側 : 二次側 = 110 : 1，n = 1/110）', '量到 V<sub>2</sub> 再乘 110 就是線電壓。')],
      ans: '110（即 n = 1/110）' },
    { id: 'ex13-16', sec: '13.9', kind: 'ex', no: '13.16', title: '喇叭的阻抗匹配',
      q: '圖 13.65 用理想變壓器把擴大機匹配到喇叭，達到最大功率傳輸。擴大機的戴維寧阻抗 192 Ω，喇叭 12 Ω，求所需匝數比。',
      en: 'The ideal transformer in Fig. 13.65 is used to match the amplifier circuit to the loudspeaker to achieve maximum power transfer. The Thevenin (or output) impedance of the amplifier is 192 Ω, and the internal impedance of the speaker is 12 Ω. Determine the required turns ratio.',
      idea: '最大功率：反射回來的 Z<sub>L</sub>/n<sup>2</sup> = Z<sub>Th</sub>。',
      steps: [
        st('匹配條件。', 'Z<sub>Th</sub> = Z<sub>L</sub>/n<sup>2</sup> ⟹ n<sup>2</sup> = 12/192 = 1/16 ⟹ n = 0.25', 'R<sub>s</sub> &gt; R<sub>L</sub> → 要降壓（n &lt; 1）。'),
        st('沒有變壓器時。', 'P<sub>L</sub> = (V<sub>Th</sub>/204)<sup>2</sup> × 12 = 288 V<sub>Th</sub><sup>2</sup> μW', ''),
        st('有變壓器時。', 'P<sub>L</sub> = (nV<sub>Th</sub>/(n<sup>2</sup>Z<sub>Th</sub> + Z<sub>L</sub>))<sup>2</sup> Z<sub>L</sub> = 1302 V<sub>Th</sub><sup>2</sup> μW', '功率變成約 4.5 倍。')
      ],
      ans: 'n = 0.25（1 : 4 降壓）' },
    { id: 'pp13-16', sec: '13.9', kind: 'pp', no: '13.16', title: '400 Ω 匹配 2.5 kΩ',
      q: '求把 400 Ω 負載匹配到內阻 2.5 kΩ 電源所需的理想變壓器匝數比。電源電壓 60 V 時負載電壓是多少？', en: 'Calculate the turns ratio of an ideal transformer required to match a 400-Ω load to a source with internal impedance of 2.5 kΩ. Find the load voltage when the source voltage is 60 V.',
      hint: '匹配時一次側看到 2.5 kΩ，電源電壓一半落在內阻、一半落在一次側。',
      steps: [
        st('匝數比。', 'n<sup>2</sup> = 400/2500 = 0.16 ⟹ n = 0.4', ''),
        st('一次側電壓。', 'V<sub>1</sub> = 60 × 2500/(2500 + 2500) = 30 V', ''),
        st('負載電壓。', 'V<sub>2</sub> = nV<sub>1</sub> = 0.4 × 30 = 12 V', '')
      ],
      ans: 'n = 0.4；V<sub>L</sub> = 12 V' },
    { id: 'ex13-17', sec: '13.9', kind: 'ex', no: '13.17', title: '家用配電變壓器',
      q: '配電變壓器供電給一戶人家（圖 13.68）：八個 100 W 燈泡、一台 350 W 電視、一個 15 kW 廚房爐子。二次側 72 匝，求 (a) 一次側匝數 (b) 一次側電流 I<sub>p</sub>。',
      en: 'A distribution transformer is used to supply a household as in Fig. 13.68. The load consists of eight 100-W bulbs, a 350-W TV, and a 15-kW kitchen range. If the secondary side of the transformer has 72 turns, calculate: (a) the number of turns of the primary winding, and (b) the current I<sub>p</sub> in the primary winding.',
      fig: F.f1368, cap: '圖 13.68（重畫）',
      idea: '只要大小，點的位置不重要。二次側總電壓 240 V（120 + 120）。',
      steps: [
        st('(a) 匝數。', 'N<sub>p</sub> = N<sub>s</sub>V<sub>p</sub>/V<sub>s</sub> = 72 × 2400/240 = 720 匝', ''),
        st('(b) 總功率。', 'S = 8 × 100 + 350 + 15000 = 16.15 kW', ''),
        st('(b) 一次側電流。', 'I<sub>p</sub> = S/V<sub>p</sub> = 16150/2400 = 6.729 A', '')
      ],
      ans: '(a) 720 匝　(b) I<sub>p</sub> ≈ 6.729 A' },
    { id: 'pp13-17', sec: '13.9', kind: 'pp', no: '13.17', title: '換成冷氣之後',
      q: 'Example 13.17 中若把八個 100 W 燈泡換成十二個 60 W 燈泡、廚房爐子換成 4.5 kW 冷氣，求 (a) 總功率 (b) 一次側電流 I<sub>p</sub>。',
      en: 'In Example 13.17, if the eight 100-W bulbs are replaced by twelve 60-W bulbs and the kitchen range is replaced by a 4.5-kW air-conditioner, find: (a) the total power supplied, (b) the current I<sub>p</sub> in the primary winding.',
      hint: '電視 350 W 不變。',
      steps: [
        st('(a)。', 'S = 12 × 60 + 350 + 4500 = 5570 W', ''),
        st('(b)。', 'I<sub>p</sub> = 5570/2400 = 2.321 A', '')
      ],
      ans: '(a) 5.57 kW　(b) 2.321 A' }
  ];

  window.__CH13EX = window.__CH13EX || { book: 'Alexander & Sadiku', items: [], autoAll: true };
  window.__CH13EX.items = window.__CH13EX.items.concat(items);
  window.__CH13EX.F = Object.assign(window.__CH13EX.F || {}, F);
})();
