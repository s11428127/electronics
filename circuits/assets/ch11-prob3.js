/* ============================================================
   電路學 CH11 章末練習題（3/3）：Section 11.7～11.9 ＋ Comprehensive（Problem 11.51～11.97）
   跳過 e⁷d：11.55、11.70、11.81、11.84、11.86、11.89、11.90、11.91、11.94、11.95、11.96；ML：11.56～11.59
   講義上 11.95～11.97 印成「10.95～10.97」。rms 值。
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, dx, dy, parts) => S.svg(w + 110, h, ['<g transform="translate(' + (dx + 40) + ',' + dy + ')">'].concat(parts, ['</g>']));
  /* 電源＋並聯負載方塊：boxes = [[x, 文字陣列]]；top 可以在第一個方塊前插串聯方塊 */
  const loads = (src, boxes, o) => {
    o = o || {}; const xe = boxes[boxes.length - 1][0];
    const p = [src, S.w('20,25', xe + ',25'), S.w('20,145', xe + ',145')];
    boxes.forEach(([x, L]) => { p.push(S.w(x + ',25', x + ',60'), S.box(x - 40, 60, 80, 50, L), S.w(x + ',110', x + ',145'), S.dot(x, 25), S.dot(x, 145)); });
    return G(xe + 30, 170, 40, 5, p);
  };

  const abc = lbl => G(300, 150, 30, 15, [
      S.term(20, 20), S.term(20, 125), S.t(20, 76, lbl, 'middle'), S.t(30, 40, '+', 'start'), S.t(30, 115, '−', 'start'), S.t(50, 12, 'I →', 'middle', ' font-size="11"'),
      S.w('20,20', '100,20'), S.z(100, 20, 210, 20, 'A'), S.w('210,20', '250,20'), S.z(80, 20, 80, 125, 'B', { side: 'r' }), S.z(250, 20, 250, 125, 'C', { side: 'r' }), S.w('20,125', '250,125'), S.dot(80, 20), S.dot(80, 125)]);
  const F = {
    f1170: G(330, 160, 45, 15, [
      S.vs(20, 25, 125, '16∠45° V'), S.r(20, 25, 120, 25, '2 Ω'), S.c(120, 25, 120, 75, '−j5 Ω', { side: 'r' }), S.r(120, 75, 120, 125, '10 Ω', { side: 'r' }),
      S.w('120,25', '230,25'), S.l(230, 25, 230, 75, 'j6 Ω', { side: 'r' }), S.r(230, 75, 230, 125, '8 Ω', { side: 'r' }), S.w('20,125', '230,125'), S.dot(120, 25), S.dot(120, 125)]),
    f1171: null,
    f1173: G(300, 150, 55, 15, [
      S.vs(20, 25, 125, '8∠20° V'), S.w('20,25', '230,25'), S.c(120, 25, 120, 75, '−j3 Ω', { side: 'r' }), S.r(120, 75, 120, 125, '4 Ω', { side: 'r' }),
      S.l(230, 25, 230, 125, 'j5 Ω', { side: 'r' }), S.w('20,125', '230,125'), S.dot(120, 25), S.dot(120, 125)]),
    f1179: loads(S.is(20, 25, 145, '6∠0° A'), [[110, ['20 kW', '0.8 pf lagging']], [230, ['16 kW', '0.9 pf lagging']]]),
    f1180: G(370, 175, 55, 10, [
      S.vs(20, 60, 160, '100∠90° V'), S.w('20,60', '20,25', '130,25'), S.t(70, 18, 'I_o →', 'middle', ' font-size="11"'), S.box(130, 5, 100, 40, ['1.2 kW', '0.8 kVAR (cap)']), S.w('230,25', '290,25'),
      S.w('90,25', '90,70'), S.box(45, 70, 90, 45, ['2 kVA', '0.707 pf leading']), S.w('90,115', '90,160'),
      S.w('290,25', '290,70'), S.box(245, 70, 90, 45, ['4 kW', '0.9 pf lagging']), S.w('290,115', '290,160'), S.w('20,160', '290,160'), S.dot(90, 25), S.dot(90, 160)]),
    f1181: G(400, 165, 30, 10, [
      S.vs(20, 40, 140, 'V_s'), S.r(20, 40, 75, 40, '0.2 Ω'), S.l(75, 40, 135, 40, 'j0.04 Ω'), S.w('135,40', '150,40'), S.r(150, 40, 205, 40, '0.3 Ω'), S.l(205, 40, 265, 40, 'j0.15 Ω'), S.w('265,40', '350,40'),
      S.w('140,40', '140,65'), S.box(100, 65, 80, 40, ['10 W', '0.9 pf lagging']), S.w('140,105', '140,140'),
      S.w('280,40', '280,65'), S.box(240, 65, 80, 40, ['15 W', '0.8 pf leading']), S.w('280,105', '280,140'), S.w('20,140', '350,140'),
      S.term(350, 40), S.term(350, 140), S.t(360, 95, '120 V rms', 'start'), S.dot(140, 40), S.dot(280, 40), S.dot(140, 140), S.dot(280, 140)]),
    f1182: loads(S.vs(20, 25, 145, '220∠0° V'), [[110, ['12 kW', '0.866 pf leading']], [210, ['16 kW', '0.85 pf lagging']], [310, ['20 kVAR', '0.6 pf lagging']]]),
    f1183: G(300, 155, 30, 15, [
      S.is(20, 20, 125, 'I_s', { side: 'l' }), S.w('20,20', '210,20'), S.r(115, 20, 115, 72, '8 Ω', { side: 'r' }), S.l(115, 72, 115, 125, 'j12 Ω', { side: 'r' }),
      S.vs(210, 20, 125, '120∠0° V', { side: 'r' }), S.w('20,125', '210,125'), S.dot(115, 20), S.dot(115, 125)]),
    f1184: G(330, 150, 40, 10, [
      S.vs(20, 50, 130, 'v_s'), S.w('20,50', '20,25'), S.r(20, 25, 120, 25, '100 kΩ'), S.c(120, 25, 120, 130, '1 nF', { side: 'r' }), S.w('120,25', '170,25', '170,62', '180,62'),
      S.opamp(180, 50, { plusTop: false }), S.w('180,38', '170,38', '170,10', '250,10', '250,50'), S.w('236,50', '290,50'), S.r(290, 50, 290, 130, '50 kΩ', { side: 'r' }), S.w('20,130', '290,130'), S.dot(120, 25), S.dot(250, 50), S.dot(120, 130)]),
    f1185: G(360, 170, 40, 10, [
      S.vs(20, 80, 150, '4∠45° V'), S.w('20,80', '20,58'), S.r(20, 58, 90, 58, '4 kΩ'), S.l(90, 58, 150, 58, 'j3 kΩ'), S.w('150,58', '180,58'), S.opamp(180, 70),
      S.w('165,58', '165,20'), S.r(165, 20, 220, 20, '2 kΩ'), S.l(220, 20, 270, 20, 'j4 kΩ'), S.w('270,20', '270,70'), S.w('236,70', '300,70'),
      S.w('180,82', '160,82', '160,150'), S.r(300, 70, 300, 110, '6 kΩ', { side: 'r' }), S.c(300, 110, 300, 150, '−j2 kΩ', { side: 'r' }), S.w('20,150', '300,150'), S.dot(165, 58), S.dot(270, 70), S.dot(160, 150)]),
    f1186: G(380, 170, 80, 10, [
      S.vs(20, 80, 150, '600 sin(2t + 20°) mV'), S.w('20,80', '20,58'), S.r(20, 58, 90, 58, '8 Ω'), S.l(90, 58, 150, 58, '3 H'), S.w('150,58', '180,58'), S.opamp(180, 70),
      S.w('165,58', '165,15'), S.r(165, 15, 270, 15, '10 Ω'), S.w('165,40', '200,40'), S.c(200, 40, 240, 40, ''), S.t(220, 32, '100 mF', 'middle'), S.w('240,40', '270,40'), S.w('270,15', '270,70'), S.w('236,70', '300,70'),
      S.w('180,82', '160,82', '160,150'), S.r(300, 70, 300, 150, '12 Ω', { side: 'r' }), S.w('20,150', '300,150'), S.gnd(160, 150), S.dot(165, 40), S.dot(270, 40), S.dot(270, 70)]),
    f1187: G(300, 130, 70, 10, [
      S.is(20, 25, 110, 'I_o cos ωt'), S.r(20, 25, 110, 25, 'R'), S.l(110, 25, 200, 25, 'L'), S.c(200, 25, 200, 110, 'C', { side: 'r' }), S.w('20,110', '200,110')]),
    f1188: G(300, 130, 60, 10, [
      S.vs(20, 25, 110, '120 V rms, 60 Hz'), S.w('20,25', '220,25'), S.w('20,110', '220,110'), S.c(120, 25, 120, 110, 'C（要加的）', { side: 'r' }), S.z(220, 25, 220, 110, 'Z = 10 + j12 Ω', { side: 'r' })]),
    f1189: G(240, 150, 20, 5, [
      S.term(20, 20), S.term(20, 130), S.w('20,20', '230,20'), S.w('20,130', '230,130'),
      S.w('90,20', '90,40'), S.box(45, 40, 90, 70, ['Load 1', '24 kW', 'pf = 0.8 lag']), S.w('90,110', '90,130'),
      S.w('200,20', '200,40'), S.box(155, 40, 90, 70, ['Load 2', '40 kW', 'pf = 0.95 lag']), S.w('200,110', '200,130')]),
    f1190: G(300, 185, 30, 10, [
      S.term(20, 20), S.term(20, 65), S.t(20, 12, '+　240 V rms, 50 Hz', 'start'), S.t(20, 85, '−', 'start'),
      S.w('20,20', '290,20', '290,150'), S.w('20,65', '140,65', '140,150'),
      S.z(140, 65, 290, 65, '80 − j50 Ω', { side: 'b' }), S.z(140, 108, 290, 108, '120 + j70 Ω', { side: 'b' }), S.z(140, 150, 290, 150, '60 + j0 Ω', { side: 'b' })]),
    f1191: G(380, 160, 45, 25, [
      S.vs(20, 25, 125, '12∠0° V'), S.r(20, 25, 80, 25, '4 Ω'), S.c(80, 25, 130, 25, '−j3 Ω'), S.l(130, 25, 130, 125, 'j2 Ω', { side: 'r' }), S.w('130,25', '190,25'),
      S.r(190, 25, 190, 125, '8 Ω', { side: 'r' }), S.wm(190, 25, 280, 125), S.is(320, 25, 125, '3∠30° A', { side: 'r' }), S.w('280,25', '320,25'), S.w('20,125', '320,125'), S.dot(130, 25), S.dot(190, 25)]),
    f1192: G(380, 165, 60, 30, [
      S.vs(20, 25, 125, '120 cos 2t V'), S.r(20, 25, 80, 25, '6 Ω'), S.l(80, 25, 140, 25, '4 H'), S.wm(140, 25, 230, 125), S.w('230,25', '320,25'),
      S.c(260, 25, 260, 125, '0.1 F', { side: 'r' }), S.r(320, 25, 320, 125, '15 Ω', { side: 'r' }), S.w('20,125', '320,125'), S.dot(260, 25)]),
    f1193: G(400, 165, 60, 30, [
      S.vs(20, 25, 125, '20 cos 4t V'), S.r(20, 25, 80, 25, '10 Ω'), S.wm(80, 25, 170, 125), S.r(170, 25, 230, 25, '5 Ω'), S.l(230, 25, 290, 25, '1 H'),
      S.r(290, 25, 290, 125, '4 Ω', { side: 'r' }), S.w('290,25', '350,25'), S.c(350, 25, 350, 125, '1/12 F', { side: 'r' }), S.w('20,125', '350,125'), S.dot(290, 25)]),
    f1194: G(400, 175, 60, 35, [
      S.vs(20, 35, 135, '10 cos 100t'), S.r(20, 35, 80, 35, '40 Ω'), S.wm(80, 35, 170, 135), S.dis(200, 35, 135, '2i_o', { down: true, side: 'r' }), S.w('170,35', '200,35'),
      S.l(200, 35, 320, 35, '10 mH'), S.w('200,35', '200,0'), S.r(200, 0, 320, 0, '20 Ω'), S.t(300, -14, 'i_o →', 'middle', ' font-size="11"'), S.w('320,0', '320,35'),
      S.c(320, 35, 320, 135, '500 μF', { side: 'r' }), S.w('20,135', '320,135'), S.dot(200, 35), S.dot(320, 35)]),
    f1195: G(420, 140, 40, 15, [
      S.vs(20, 25, 115, '110 V'), S.wm(20, 25, 180, 115), S.w('180,25', '230,25'), S.z(230, 25, 230, 115, '|Z_L| = 6.4 Ω, pf = 0.825', { side: 'r' }), S.w('20,115', '230,115')]),
    f1196: G(380, 200, 55, 15, [
      S.vs(20, 25, 90, '120∠0° V'), S.vs(20, 90, 165, '120∠0° V'), S.w('20,25', '300,25'), S.t(60, 18, 'I_1 →', 'middle', ' font-size="11"'),
      S.w('20,90', '150,90'), S.t(60, 105, 'I_n →', 'middle', ' font-size="11"'), S.gnd(110, 90), S.w('20,165', '300,165'), S.t(60, 180, 'I_2 →', 'middle', ' font-size="11"'),
      S.r(150, 25, 150, 90, '10 Ω（燈）', { side: 'r' }), S.r(150, 90, 150, 128, '10 Ω（冰箱）', { side: 'r' }), S.l(150, 128, 150, 165, '15 mH', { side: 'r' }),
      S.r(300, 25, 300, 165, '30 Ω（電爐）', { side: 'r' }), S.dot(150, 25), S.dot(150, 165)]),
    f1197: loads(S.vs(20, 25, 145, '550 V'), [[110, ['馬達 60 kW', 'pf = 0.75']], [210, ['電容 20 kVAR']], [310, ['照明 10 kW']]]),
    f1199: G(330, 168, 30, 15, [
      S.vs(20, 25, 125, 'V_s'), S.r(20, 25, 120, 25, '0.1 Ω'), S.l(120, 25, 220, 25, 'j1 Ω'), S.r(220, 25, 220, 75, '100 Ω', { side: 'r' }), S.l(220, 75, 220, 125, 'j1 Ω', { side: 'r' }),
      S.l(220, 125, 120, 125, 'j1 Ω', { side: 'b' }), S.r(120, 125, 20, 125, '0.1 Ω', { side: 'b' })])
  };
  F.f1171 = abc('V_s'); F.f1172 = abc('120∠30°');

  const it = (no, sec, title, o) => Object.assign({ id: 'p11-' + no, sec, kind: 'pp', tag: 'Problem 11.' + no, title }, o);

  const items = [
    /* ═══════════ 11.7 交流功率守恆 ═══════════ */
    it(51, '11.7', '整個電路的 pf、P、Q、|S|、S', { fig: F.f1170, cap: '圖 11.70（重畫）',
      q: '對圖 11.70 整個電路計算：(a) 功率因數　(b) 電源送出的平均功率　(c) 虛功率　(d) 視在功率　(e) 複功率',
      en: 'For the entire circuit in Fig. 11.70, calculate: (a) the power factor (b) the average power delivered by the source (c) the reactive power (d) the apparent power (e) the complex power',
      hint: '先算從電源看進去的總阻抗，S = VI*（rms）。',
      steps: [
        st('Step 1　兩條並聯。', '(10 − j5) ∥ (8 + j6) = 6.154 + j0.769 Ω', ''),
        st('Step 2　總阻抗。', 'Z = 2 + 6.154 + j0.769 = 8.154 + j0.769 Ω；pf = cos(5.39°) = 0.9956（落後）', ''),
        st('Step 3　電流。', 'I = 16∠45° / Z = 1.954∠39.61° A', ''),
        st('Step 4　複功率。', 'S = VI* = 16∠45° × 1.954∠−39.61° = 31.26∠5.39° = 31.12 + j2.936 VA', '')
      ],
      ans: '(a) 0.9956 落後　(b) 31.12 W　(c) 2.936 VAR　(d) 31.26 VA　(e) 31.12 + j2.936 VA' }),
    it(52, '11.7', '三個裝置：整體 pf 與電流', { fig: F.f1171, cap: '圖 11.71（重畫）',
      q: '圖 11.71 中，裝置 A 接收 2 kW、pf 0.8 落後；裝置 B 接收 3 kVA、pf 0.4 超前；裝置 C 為電感性，消耗 1 kW、接收 500 VAR。(a) 求整個系統的功率因數。(b) 若 V<sub>s</sub> = 120∠45° V rms，求 I。',
      en: 'In the circuit of Fig. 11.71, device A receives 2 kW at 0.8 pf lagging, device B receives 3 kVA at 0.4 pf leading, while device C is inductive and consumes 1 kW and receives 500 VAR. (a) Determine the power factor of the entire system. (b) Find I given that V<sub>s</sub> = 120∠45° V rms.',
      hint: '不管怎麼接，總複功率 = 各裝置複功率相加。I* = S/V。',
      steps: [
        st('Step 1　各裝置。', 'S<sub>A</sub> = 2000 + j1500；S<sub>B</sub> = 1200 − j2749.5；S<sub>C</sub> = 1000 + j500', 'Q<sub>A</sub> = 2000 tan(cos<sup>−1</sup>0.8) = 1500；B 超前取負：3000 sin(cos<sup>−1</sup>0.4) = 2749.5。'),
        st('Step 2　加總。', 'S = 4200 − j749.5 VA；pf = 4200/4266.4 = 0.9844（超前）', ''),
        st('Step 3　電流。', 'I = (S/V)* = (4266.4∠−10.12° / 120∠45°)* = 35.55∠55.12° A', '')
      ],
      ans: '(a) pf ≈ 0.9844 超前　(b) I ≈ 35.55∠55.12° A rms' }),
    it(53, '11.7', '三個負載：電流與整體 pf', { fig: F.f1172, cap: '圖 11.72（重畫，電源 120∠30° V）',
      q: '圖 11.72 中，負載 A 接收 4 kVA、pf 0.8 超前；負載 B 接收 2.4 kVA、pf 0.6 落後；方塊 C 為電感性負載，消耗 1 kW、接收 500 VAR。電源 120∠30° V。(a) 求 I。(b) 求整個組合的功率因數。',
      en: 'In the circuit of Fig. 11.72, load A receives 4 kVA at 0.8 pf leading. Load B receives 2.4 kVA at 0.6 pf lagging. Box C is an inductive load that consumes 1 kW and receives 500 VAR. (a) Determine I. (b) Calculate the power factor of the combination.',
      hint: '同上一題：複功率直接相加，I = (S/V)*。',
      steps: [
        st('Step 1　各負載。', 'S<sub>A</sub> = 3200 − j2400；S<sub>B</sub> = 1440 + j1920；S<sub>C</sub> = 1000 + j500', ''),
        st('Step 2　加總。', 'S = 5640 + j20 VA', '虛功率幾乎互相抵消。'),
        st('Step 3　電流。', 'I = (S/V)* = (5640∠0.20° / 120∠30°)* = 47.0∠29.80° A', ''),
        st('Step 4　pf。', 'pf = 5640/5640.04 ≈ 1.0（極微落後）', '')
      ],
      ans: '(a) I ≈ 47.0∠29.80° A　(b) pf ≈ 1.0（0.99999 落後）' }),
    it(54, '11.7', '每個元件吸收的複功率', { fig: F.f1173, cap: '圖 11.73（重畫）',
      q: '求圖 11.73 網路中每個元件吸收的複功率。',
      en: 'For the network in Fig. 11.73, find the complex power absorbed by each element.',
      hint: '兩條支路都直接接在 8∠20° V 上：S = |I|²Z。',
      steps: [
        st('Step 1　電容＋電阻支路。', 'I<sub>1</sub> = 8∠20° /(4 − j3) = 1.6∠56.87° A', ''),
        st('Step 2　電感支路。', 'I<sub>2</sub> = 8∠20° /(j5) = 1.6∠−70° A', ''),
        st('Step 3　各元件。', 'S<sub>4Ω</sub> = 1.6² × 4 = 10.24 W；S<sub>−j3</sub> = 1.6² × (−j3) = −j7.68 VA；S<sub>j5</sub> = 1.6² × j5 = j12.8 VA', ''),
        st('Step 4　電源（守恆）。', 'S<sub>源</sub> = VI* = 10.24 + j5.12 VA（供給）', '吸收的加起來 = 10.24 + j5.12，守恆成立。')
      ],
      ans: '4 Ω：10.24 W；−j3 Ω：−j7.68 VA；j5 Ω：j12.8 VA；電源供給 10.24 + j5.12 VA' }),
    it(60, '11.7', '電流源驅動兩個負載', { fig: F.f1179, cap: '圖 11.79（重畫）',
      q: '求圖 11.79 中的 V<sub>o</sub> 與輸入功率因數。',
      en: 'For the circuit in Fig. 11.79, find V<sub>o</sub> and the input power factor.',
      hint: '總複功率 S = V<sub>o</sub>I*，電流源 6∠0° A 已知 → V<sub>o</sub> = S/I*。',
      steps: [
        st('Step 1　各負載。', 'S<sub>1</sub> = 20 + j15 kVA；S<sub>2</sub> = 16 + j7.749 kVA', 'Q = P tan(cos<sup>−1</sup>pf)。'),
        st('Step 2　總和。', 'S = 36 + j22.75 kVA = 42.59∠32.29° kVA', ''),
        st('Step 3　V<sub>o</sub>。', 'V<sub>o</sub> = S/I* = 42.59 k∠32.29° / 6 = 7.098∠32.29° kV', ''),
        st('Step 4　pf。', 'pf = cos 32.29° = 0.8454（落後）', '')
      ],
      ans: 'V<sub>o</sub> ≈ 7.098∠32.29° kV；pf ≈ 0.8454 落後' }),
    it(61, '11.7', '串並混合的負載：I<sub>o</sub> 與總複功率', { fig: F.f1180, cap: '圖 11.80（重畫）',
      q: '求圖 11.80 的 I<sub>o</sub> 與電源供給的總複功率。',
      en: 'Given the circuit in Fig. 11.80, find I<sub>o</sub> and the overall complex power supplied.',
      hint: '不管負載怎麼串並，總複功率 = 三個負載相加；I<sub>o</sub> 是電源電流。',
      steps: [
        st('Step 1　各負載。', 'S<sub>1</sub> = 1200 − j800；S<sub>2</sub> = 2000 × (0.707 − j0.707) = 1414 − j1414；S<sub>3</sub> = 4000 + j1937', ''),
        st('Step 2　總和。', 'S = 6614 − j277.1 VA', ''),
        st('Step 3　I<sub>o</sub>。', 'I<sub>o</sub> = (S/V)* = (6619.8∠−2.40° / 100∠90°)* = 66.20∠92.40° A', '')
      ],
      ans: 'I<sub>o</sub> ≈ 66.20∠92.40° A；S ≈ 6614 − j277.1 VA' }),
    it(62, '11.7', '從負載端往回推 V<sub>s</sub>', { fig: F.f1181, cap: '圖 11.81（重畫）',
      q: '求圖 11.81 中的 V<sub>s</sub>。',
      en: 'For the circuit in Fig. 11.81, find V<sub>s</sub>.',
      hint: '從右邊（已知 120 V）往左推：先求 15 W 負載電流，算線路壓降，再求 10 W 負載電流。',
      steps: [
        st('Step 1　右邊負載。', 'S<sub>2</sub> = 15 − j11.25 VA；I<sub>2</sub> = (S<sub>2</sub>/120)* = 0.1563∠36.87° A', ''),
        st('Step 2　中間節點電壓。', 'V<sub>1</sub> = 120 + I<sub>2</sub>(0.3 + j0.15) = 120.02∠0.02° V', ''),
        st('Step 3　中間負載。', 'S<sub>1</sub> = 10 + j4.843 VA；I<sub>1</sub> = (S<sub>1</sub>/V<sub>1</sub>)* = 0.0926∠−25.82° A', ''),
        st('Step 4　V<sub>s</sub>。', 'V<sub>s</sub> = V<sub>1</sub> + (I<sub>1</sub> + I<sub>2</sub>)(0.2 + j0.04) = 120.06∠0.03° V', '電流很小，線路壓降只有幾十 mV。')
      ],
      ans: 'V<sub>s</sub> ≈ 120.06∠0.03° V rms' }),
    it(63, '11.7', '三個並聯負載的總電流', { fig: F.f1182, cap: '圖 11.82（重畫）',
      q: '求圖 11.82 中的 I<sub>o</sub>。',
      en: 'Find I<sub>o</sub> in the circuit of Fig. 11.82.',
      hint: 'S 相加，I<sub>o</sub> = (S/V)*。第三個只給 Q 和 pf：P = Q/tan θ。',
      steps: [
        st('Step 1　各負載。', 'S<sub>1</sub> = 12 − j6.928 kVA；S<sub>2</sub> = 16 + j9.916 kVA；S<sub>3</sub> = 15 + j20 kVA', 'P<sub>3</sub> = 20/tan(cos<sup>−1</sup>0.6) = 15 kW。'),
        st('Step 2　總和。', 'S = 43 + j22.99 kVA', ''),
        st('Step 3　I<sub>o</sub>。', 'I<sub>o</sub> = (S/220)* = 195.5 − j104.5 = 221.6∠−28.13° A', '')
      ],
      ans: 'I<sub>o</sub> ≈ 221.6∠−28.13° A' }),
    it(64, '11.7', '已知電壓源送出的功率，求電流源', { fig: F.f1183, cap: '圖 11.83（重畫）',
      q: '若圖 11.83 的電壓源供給 2.5 kW 與 0.4 kVAR（超前），求 I<sub>s</sub>。',
      en: 'Determine I<sub>s</sub> in the circuit of Fig. 11.83, if the voltage source supplies 2.5 kW and 0.4 kVAR (leading).',
      hint: '負載 8 + j12 吃的 = 電壓源供給的 + 電流源供給的（守恆）。',
      steps: [
        st('Step 1　負載吸收。', 'S<sub>L</sub> = 120²/(8 − j12) = 553.8 + j830.8 VA', ''),
        st('Step 2　電壓源供給。', 'S<sub>v</sub> = 2500 − j400 VA', '超前 → Q 取負。'),
        st('Step 3　電流源要補的。', 'S<sub>i</sub> = S<sub>L</sub> − S<sub>v</sub> = −1946.2 + j1230.8 VA', ''),
        st('Step 4　I<sub>s</sub>。', 'I<sub>s</sub> = (S<sub>i</sub>/120)* = −16.22 − j10.26 = 19.19∠−147.7° A', '實部負：電流源其實在吸收實功率。')
      ],
      ans: 'I<sub>s</sub> ≈ −16.22 − j10.26 A = 19.19∠−147.7° A', note: '「0.4 kVAR (leading)」照課本慣例當成 Q = −400 VAR。若當成 +400 VAR，I<sub>s</sub> = −16.22 − j3.59 A。' }),
    it(65, '11.7', '電壓隨耦器後面的 50 kΩ', { fig: F.f1184, cap: '圖 11.84（重畫）',
      q: '圖 11.84 的運算放大器電路中 v<sub>s</sub> = 4 cos 10<sup>4</sup>t V，求送到 50 kΩ 電阻的平均功率。',
      en: 'In the op amp circuit of Fig. 11.84, v<sub>s</sub> = 4 cos 10<sup>4</sup>t V. Find the average power delivered to the 50-kΩ resistor.',
      hint: '100 kΩ 和 1 nF 分壓，隨耦器把電壓原封不動搬到 50 kΩ。',
      steps: [
        st('Step 1　電容阻抗。', '1/(jωC) = 1/(j10<sup>4</sup> × 10<sup>−9</sup>) = −j100 kΩ', ''),
        st('Step 2　分壓。', 'V = 4 × (−j100k)/(100k − j100k) = 2.828∠−45° V', '隨耦器不吃電流，分壓公式成立。'),
        st('Step 3　功率。', 'P = 2.828²/(2 × 50k) = 80 μW', '時域給的是峰值。')
      ],
      ans: 'P = 80 μW' }),
    it(66, '11.7', '反相放大器的負載功率', { fig: F.f1185, cap: '圖 11.85（重畫）',
      q: '求圖 11.85 運算放大器電路中 6 kΩ 電阻吸收的平均功率。',
      en: 'Obtain the average power absorbed by the 6-kΩ resistor in the op amp circuit in Fig. 11.85.',
      hint: '反相放大器：V<sub>o</sub> = −(Z<sub>f</sub>/Z<sub>1</sub>)V<sub>s</sub>，Z<sub>f</sub> = 2k + j4k、Z<sub>1</sub> = 4k + j3k。',
      steps: [
        st('Step 1　輸出。', 'V<sub>o</sub> = −(2 + j4)/(4 + j3) × 4∠45° = 3.578∠−108.43° V', ''),
        st('Step 2　負載電流。', 'I = V<sub>o</sub>/(6k − j2k)，|I| = 3.578/6.325k = 0.5657 mA', ''),
        st('Step 3　功率。', 'P = |I|² × 6k = 1.92 mW', '11.22 起數值是 rms，不乘 ½。')
      ],
      ans: 'P ≈ 1.92 mW' }),
    it(67, '11.7', '有 RC 反饋的反相放大器', { fig: F.f1186, cap: '圖 11.86（重畫）',
      q: '對圖 11.86 的運算放大器電路，計算：(a) 電壓源送出的複功率　(b) 12 Ω 電阻消耗的平均功率',
      en: 'For the op amp circuit in Fig. 11.86, calculate: (a) the complex power delivered by the voltage source (b) the average power dissipated in the 12-Ω resistor',
      hint: 'ω = 2：3 H → j6、100 mF → −j5。− 輸入是虛接地，所以電源電流 = V<sub>s</sub>/(8 + j6)。',
      steps: [
        st('Step 1　電源相量。', 'v<sub>s</sub> = 0.6 sin(2t + 20°) = 0.6 cos(2t − 70°) ⟹ V<sub>s</sub> = 0.6∠−70° V', ''),
        st('Step 2　電源電流。', 'I<sub>s</sub> = V<sub>s</sub>/(8 + j6) = 0.06∠−106.87° A', '虛接地。'),
        st('Step 3　(a) 複功率。', 'S = ½ V<sub>s</sub>I<sub>s</sub>* = ½ × 0.6 × 0.06∠36.87° = 14.4 + j10.8 mVA', '時域給的是峰值。'),
        st('Step 4　輸出電壓。', 'Z<sub>f</sub> = 10 ∥ (−j5) = 2 − j4 Ω；V<sub>o</sub> = −Z<sub>f</sub>I<sub>s</sub> = 0.2683∠9.70° V', ''),
        st('Step 5　(b) 功率。', 'P = 0.2683²/(2 × 12) = 3.0 mW', '')
      ],
      ans: '(a) S = 14.4 + j10.8 mVA　(b) P = 3 mW' }),
    it(68, '11.7', 'RLC 串聯的複功率（文字解）', { fig: F.f1187, cap: '圖 11.87（重畫）',
      q: '計算圖 11.87 串聯 RLC 電路中電流源供給的複功率。',
      en: 'Compute the complex power supplied by the current source in the series RLC circuit in Fig. 11.87.',
      hint: 'S = ½|I|²Z（峰值），Z = R + j(ωL − 1/ωC)。',
      steps: [
        st('Step 1　總阻抗。', 'Z = R + jωL + 1/(jωC) = R + j(ωL − 1/ωC)', ''),
        st('Step 2　複功率。', 'S = ½ I<sub>o</sub>² Z = ½ I<sub>o</sub>² [R + j(ωL − 1/ωC)]', '電流串過每個元件。')
      ],
      ans: 'S = ½ I<sub>o</sub>²R + j ½ I<sub>o</sub>²(ωL − 1/ωC)' }),

    /* ═══════════ 11.8 功率因數校正 ═══════════ */
    it(69, '11.8', '一個負載：pf、P、補成 1 的電容', { fig: F.f1188, cap: '圖 11.88（重畫）',
      q: '參考圖 11.88。(a) 功率因數是多少？(b) 消耗的平均功率是多少？(c) 並聯多大的電容可以讓功率因數變成 1？',
      en: 'Refer to the circuit shown in Fig. 11.88. (a) What is the power factor? (b) What is the average power dissipated? (c) What is the value of the capacitance that will give a unity power factor when connected to the load?',
      hint: 'S = |V|²/Z*；C = Q/(ωV²)。',
      steps: [
        st('(a)', 'pf = 10/√(10² + 12²) = 0.6402（落後）', ''),
        st('(b)', 'S = 120²/(10 − j12) = 590.2 + j708.2 VA ⟹ P = 590.2 W', ''),
        st('(c)', 'C = 708.2/(377 × 120²) = 130.5 μF', '電容吐出 708.2 VAR，抵掉電感吸收的。')
      ],
      ans: '(a) 0.6402 落後　(b) 590.2 W　(c) C ≈ 130.5 μF' }),
    it(71, '11.8', '三個並聯負載：Z<sub>eq</sub>、pf、I', {
      q: '三個負載並聯在 120∠0° V rms 電源上。負載 1 吸收 60 kVAR、pf = 0.85 落後；負載 2 吸收 90 kW、50 kVAR 超前；負載 3 吸收 100 kW、pf = 1。(a) 求等效阻抗。(b) 求並聯組合的功率因數。(c) 求電源供給的電流。',
      en: 'Three loads are connected in parallel to a 120∠0° V rms source. Load 1 absorbs 60 kVAR at pf = 0.85 lagging, load 2 absorbs 90 kW and 50 kVAR leading, and load 3 absorbs 100 kW at pf = 1. (a) Find the equivalent impedance. (b) Calculate the power factor of the parallel combination. (c) Determine the current supplied by the source.',
      hint: '先把每個負載寫成 P + jQ，加總後 Z = |V|²/S*、I = |S|/|V|。',
      steps: [
        st('Step 1　負載 1。', 'P<sub>1</sub> = 60/tan(cos<sup>−1</sup>0.85) = 96.82 kW ⟹ S<sub>1</sub> = 96.82 + j60 kVA', ''),
        st('Step 2　總和。', 'S = 96.82 + j60 + 90 − j50 + 100 = 286.8 + j10 kVA', ''),
        st('Step 3　(a) Z<sub>eq</sub>。', 'Z = 120²/(286.8k − j10k) = 0.05015 + j0.00175 Ω', ''),
        st('Step 4　(b)、(c)。', 'pf = 286.8/287.0 = 0.9994（落後）；I = 287.0k/120 = 2392 A', '')
      ],
      ans: '(a) Z ≈ 0.05015 + j0.00175 Ω　(b) pf ≈ 0.9994 落後　(c) I ≈ 2392 A' }),
    it(72, '11.8', '第二個負載的 pf、校正到 0.9', {
      q: '兩個並聯負載從 120 V rms、60 Hz 線路共吸取 2.4 kW、pf 0.8 落後。其中一個負載吸收 1.5 kW、pf 0.707 落後。求：(a) 第二個負載的 pf，(b) 要把兩個負載的 pf 校正到 0.9 落後所需並聯的元件。',
      en: 'Two loads connected in parallel draw a total of 2.4 kW at 0.8 pf lagging from a 120-V rms, 60-Hz line. One load absorbs 1.5 kW at a 0.707 pf lagging. Determine: (a) the pf of the second load, (b) the parallel element required to correct the pf to 0.9 lagging for the two loads.',
      hint: 'S<sub>2</sub> = S<sub>總</sub> − S<sub>1</sub>；校正：Q<sub>C</sub> = P(tan θ<sub>舊</sub> − tan θ<sub>新</sub>)。',
      steps: [
        st('Step 1　總和與負載 1。', 'S = 2400 + j1800；S<sub>1</sub> = 1500 + j1500 VA', ''),
        st('Step 2　(a) 負載 2。', 'S<sub>2</sub> = 900 + j300 VA ⟹ pf<sub>2</sub> = 900/948.7 = 0.9487（落後）', ''),
        st('Step 3　(b) 要補的虛功率。', 'Q<sub>新</sub> = 2400 tan(cos<sup>−1</sup>0.9) = 1162.4；Q<sub>C</sub> = 1800 − 1162.4 = 637.6 VAR', ''),
        st('Step 4　電容值。', 'C = 637.6/(377 × 120²) = 117.5 μF', '')
      ],
      ans: '(a) 0.9487 落後　(b) 並聯電容 637.6 VAR，C ≈ 117.5 μF' }),
    it(73, '11.8', '工廠負載：|S|、I、校正到 0.96', {
      q: '240 V rms、60 Hz 電源供應一個負載：10 kW（電阻性）、15 kVAR（電容性）、22 kVAR（電感性）。求：(a) 視在功率　(b) 電源電流　(c) 把功率因數提高到 0.96 落後所需的 kVAR 額定與電容值　(d) 新功率因數下電源的電流',
      en: 'A 240-V rms 60-Hz supply serves a load that is 10 kW (resistive), 15 kVAR (capacitive), and 22 kVAR (inductive). Find: (a) the apparent power (b) the current drawn from the supply (c) the kVAR rating and capacitance required to improve the power factor to 0.96 lagging (d) the current drawn from the supply under the new power-factor conditions',
      hint: 'S = 10 + j(22 − 15) kVA。',
      steps: [
        st('(a)', 'S = 10 + j7 kVA；|S| = 12.21 kVA', ''),
        st('(b)', 'I = 12.21k/240 = 50.86 A', ''),
        st('(c)', 'Q<sub>新</sub> = 10 tan(cos<sup>−1</sup>0.96) = 2.917 kVAR；Q<sub>C</sub> = 7 − 2.917 = 4.083 kVAR；C = 4083/(377 × 240²) = 188.0 μF', ''),
        st('(d)', '|S<sub>新</sub>| = 10/0.96 = 10.42 kVA；I = 10.42k/240 = 43.40 A', 'pf 變好，同樣功率電流變小。')
      ],
      ans: '(a) 12.21 kVA　(b) 50.86 A　(c) 4.083 kVAR、C ≈ 188 μF　(d) 43.40 A' }),
    it(74, '11.8', '兩個負載：pf 與補成 1 的電容', { fig: F.f1189, cap: '圖 11.89（重畫）',
      q: '120 V rms、60 Hz 電源供應圖 11.89 的兩個並聯負載。(a) 求並聯組合的功率因數。(b) 計算並聯多大的電容可把功率因數提高到 1。',
      en: 'A 120-V rms 60-Hz source supplies two loads connected in parallel, as shown in Fig. 11.89. (a) Find the power factor of the parallel combination. (b) Calculate the value of the capacitance connected in parallel that will raise the power factor to unity.',
      hint: 'Q = P tan(cos<sup>−1</sup>pf)，加總後 C = Q/(ωV²)。',
      steps: [
        st('Step 1　各負載。', 'S<sub>1</sub> = 24 + j18 kVA；S<sub>2</sub> = 40 + j13.15 kVA', ''),
        st('Step 2　(a)', 'S = 64 + j31.15 kVA；pf = 64/71.18 = 0.8992（落後）', ''),
        st('Step 3　(b)', 'C = 31.15k/(377 × 120²) = 5.737 mF', '')
      ],
      ans: '(a) pf ≈ 0.8992 落後　(b) C ≈ 5.737 mF' }),
    it(75, '11.8', '三個並聯阻抗：S、pf、「補成 1」', { fig: F.f1190, cap: '圖 11.90（重畫）',
      q: '考慮圖 11.90 的電力系統，計算：(a) 總複功率　(b) 功率因數　(c) 建立單位功率因數所需的並聯電容',
      en: 'Consider the power system shown in Fig. 11.90. Calculate: (a) the total complex power (b) the power factor (c) the parallel capacitance necessary to establish a unity power factor',
      hint: 'S<sub>k</sub> = |V|²/Z<sub>k</sub>*。注意看 Q 的正負號再決定要加電容還是電感。',
      steps: [
        st('Step 1　各負載。', '240²/(80 + j50) = 518.0 − j323.8；240²/(120 − j70) = 357.9 + j208.8；240²/60 = 960 W', ''),
        st('Step 2　(a) 總和。', 'S = 1835.9 − j114.7 VA', ''),
        st('Step 3　(b) pf。', 'pf = 1835.9/1839.5 = 0.9981（超前）', 'Q &lt; 0，整體是電容性。'),
        st('Step 4　(c) 要補什麼？', '已經是電容性 → 再並電容只會更差；要並電感：L = V²/(ωQ) = 240²/(2π50 × 114.7) = 1.599 H', '題目問電容，但算出來 C 是負的（−6.34 μF），代表要用電感。')
      ],
      ans: '(a) 1835.9 − j114.7 VA　(b) 0.9981 超前　(c) 不能用電容；要並聯約 1.60 H 的電感', note: '課本題目問「並聯電容」，但這組負載整體已經是電容性，算出的 C 為負值。實際上要並電感（≈ 1.60 H）。' }),

    /* ═══════════ 11.9 應用 ═══════════ */
    it(76, '11.9', '瓦特計讀值（電流源那邊）', { fig: F.f1191, cap: '圖 11.91（重畫；電流線圈串在 8 Ω 節點與電流源之間，電壓線圈跨在 8 Ω 節點與地）',
      q: '求圖 11.91 中瓦特計的讀值。',
      en: 'Obtain the wattmeter reading of the circuit in Fig. 11.91.',
      hint: '瓦特計讀的是 Re(V I*)：V = 8 Ω 那點的電壓，I = 從 ± 端流進電流線圈的電流（往右）。電流源往上打，所以往右的電流是 −3∠30°。',
      steps: [
        st('Step 1　節點 A（8 Ω 那點）的 KCL。', '(12 − V<sub>A</sub>)/(4 − j3) + 3∠30° = V<sub>A</sub>/(j2) + V<sub>A</sub>/8', '電流源的電流穿過電流線圈流進 A。'),
        st('Step 2　解。', 'V<sub>A</sub> = 11.35∠86.18° V', ''),
        st('Step 3　流進 ± 端的電流。', 'I = −3∠30° = 3∠−150° A（由 A 往電流源方向）', ''),
        st('Step 4　讀值。', 'P = Re(V<sub>A</sub>I*) = 11.35 × 3 × cos(86.18° + 150°) = −18.95 W', '負的：這段其實是功率從電流源流向左邊。')
      ],
      ans: '讀值 ≈ −18.95 W' }),
    it(77, '11.9', '瓦特計量 RC 負載', { fig: F.f1192, cap: '圖 11.92（重畫；瓦特計量右邊 0.1 F ∥ 15 Ω 那一塊）',
      q: '圖 11.92 中瓦特計的讀值是多少？',
      en: 'What is the reading of the wattmeter in the network of Fig. 11.92?',
      hint: 'ω = 2：4 H → j8、0.1 F → −j5。瓦特計量的就是右邊負載吸收的平均功率。',
      steps: [
        st('Step 1　負載阻抗。', '15 ∥ (−j5) = 1.5 − j4.5 Ω', ''),
        st('Step 2　電流。', 'I = 120/(6 + j8 + 1.5 − j4.5) = 14.50∠−25.02° A', '峰值。'),
        st('Step 3　讀值。', 'P = ½ × 14.50² × 1.5 = 157.7 W', '')
      ],
      ans: '讀值 ≈ 157.7 W' }),
    it(78, '11.9', '瓦特計量 RL＋RC', { fig: F.f1193, cap: '圖 11.93（重畫；瓦特計量 10 Ω 右邊的全部）',
      q: '求圖 11.93 電路中瓦特計的讀值。',
      en: 'Find the wattmeter reading of the circuit shown in Fig. 11.93.',
      hint: 'ω = 4：1 H → j4、1/12 F → −j3。讀值 = 10 Ω 右邊那一整塊吸收的平均功率。',
      steps: [
        st('Step 1　右邊阻抗。', '4 ∥ (−j3) = 1.44 − j1.92；加 5 + j4 → Z = 6.44 + j2.08 Ω', ''),
        st('Step 2　電流。', '|I| = 20/|16.44 + j2.08| = 1.207 A', ''),
        st('Step 3　讀值。', 'P = ½ × 1.207² × 6.44 = 4.69 W', '')
      ],
      ans: '讀值 ≈ 4.69 W' }),
    it(79, '11.9', '瓦特計＋相依電流源', { fig: F.f1194, cap: '圖 11.94（重畫；瓦特計量 40 Ω 右邊那一點 X）',
      q: '求圖 11.94 電路中瓦特計的讀值。',
      en: 'Determine the wattmeter reading of the circuit in Fig. 11.94.',
      hint: 'ω = 100：10 mH → j1、500 μF → −j20。兩個節點 X（瓦特計右端）、Y（電容上端）。',
      steps: [
        st('Step 1　節點 X。', '(10 − V<sub>X</sub>)/40 = 2i<sub>o</sub> + (V<sub>X</sub> − V<sub>Y</sub>)/(j1) + i<sub>o</sub>，i<sub>o</sub> = (V<sub>X</sub> − V<sub>Y</sub>)/20', ''),
        st('Step 2　節點 Y。', 'i<sub>o</sub> + (V<sub>X</sub> − V<sub>Y</sub>)/(j1) = V<sub>Y</sub>/(−j20)', ''),
        st('Step 3　解。', 'V<sub>X</sub> = 4.424∠−69.39° V；I = (10 − V<sub>X</sub>)/40', ''),
        st('Step 4　讀值。', 'P = ½ Re(V<sub>X</sub>I*) = −50 mW', '相依源在供給功率，所以右邊整塊是「吐出」功率。')
      ],
      ans: '讀值 ≈ −50 mW' }),
    it(80, '11.9', '瓦特計量一個負載', { fig: F.f1195, cap: '圖 11.95（重畫）',
      q: '圖 11.95 中瓦特計接在交流網路上。(a) 求負載電流大小。(b) 計算瓦特計的讀值。',
      en: 'The circuit of Fig. 11.95 portrays a wattmeter connected into an ac network. (a) Find the magnitude of the load current. (b) Calculate the wattmeter reading.',
      hint: '|I| = |V|/|Z|；P = |V||I| pf。',
      steps: [
        st('(a)', '|I| = 110/6.4 = 17.19 A', ''),
        st('(b)', 'P = 110 × 17.19 × 0.825 = 1.560 kW', '')
      ],
      ans: '(a) 17.19 A　(b) 1.560 kW' }),
    it(82, '11.9', '加熱器＋馬達：功因校正', {
      q: '240 V rms、60 Hz 電源供應一個 5 kW 加熱器和一個 30 kVA、pf 0.82 的感應馬達（並聯）。求：(a) 系統視在功率　(b) 系統虛功率　(c) 把系統 pf 調到 0.9 所需電容的 kVA 額定　(d) 所需電容值',
      en: 'A 240-V rms 60-Hz source supplies a parallel combination of a 5-kW heater and a 30-kVA induction motor whose power factor is 0.82. Determine: (a) the system apparent power (b) the system reactive power (c) the kVA rating of a capacitor required to adjust the system power factor to 0.9 lagging (d) the value of the capacitor required',
      hint: '馬達：P = 30 × 0.82、Q = 30 × sin(cos<sup>−1</sup>0.82)。',
      steps: [
        st('Step 1　馬達。', 'P = 24.6 kW、Q = 17.17 kVAR', ''),
        st('Step 2　(a)(b)', 'S = 29.6 + j17.17 kVA；|S| = 34.22 kVA；Q = 17.17 kVAR', ''),
        st('Step 3　(c)', 'Q<sub>新</sub> = 29.6 tan(cos<sup>−1</sup>0.9) = 14.34；Q<sub>C</sub> = 2.835 kVAR', ''),
        st('Step 4　(d)', 'C = 2835/(377 × 240²) = 130.6 μF', '')
      ],
      ans: '(a) 34.22 kVA　(b) 17.17 kVAR　(c) 2.835 kVA　(d) 130.6 μF' }),
    it(83, '11.9', '示波器量到峰值：P、|S|、Q、pf', {
      q: '示波器量到負載兩端的峰值電壓與流過的峰值電流分別為 210∠60° V 與 8∠25° A。求：(a) 實功率　(b) 視在功率　(c) 虛功率　(d) 功率因數',
      en: 'Oscilloscope measurements indicate that the peak voltage across a load and the peak current through it are, respectively, 210∠60° V and 8∠25° A. Determine: (a) the real power (b) the apparent power (c) the reactive power (d) the power factor',
      hint: '峰值 → S = ½VI*。',
      steps: [
        st('Step 1　複功率。', 'S = ½ × 210 × 8∠(60° − 25°) = 840∠35° VA', ''),
        st('Step 2　拆開。', 'P = 840 cos 35° = 688.1 W；Q = 840 sin 35° = 481.8 VAR；pf = cos 35° = 0.8192（落後）', '')
      ],
      ans: '(a) 688.1 W　(b) 840 VA　(c) 481.8 VAR　(d) 0.8192 落後' }),
    it(85, '11.9', '單相三線式家用電路', { fig: F.f1196, cap: '圖 11.96（重畫）',
      q: '一般家用單相三線式系統可同時使用 120 V 與 240 V、60 Hz 的電器，模型如圖 11.96。計算：(a) 電流 I<sub>1</sub>、I<sub>2</sub>、I<sub>n</sub>　(b) 供給的總複功率　(c) 整個電路的功率因數',
      en: 'A regular household system of a single-phase three-wire circuit allows the operation of both 120-V and 240-V, 60-Hz appliances. The household circuit is modeled as shown in Fig. 11.96. Calculate: (a) the currents I<sub>1</sub>, I<sub>2</sub>, and I<sub>n</sub> (b) the total complex power supplied (c) the overall power factor of the circuit',
      hint: '燈接 120 V（上面那顆電源）、冰箱接 120 V（下面那顆）、電爐跨兩條火線吃 240 V。15 mH → j5.655 Ω。',
      steps: [
        st('Step 1　各負載電流。', '燈 120/10 = 12 A；電爐 240/30 = 8 A；冰箱 120/(10 + j5.655) = 9.087 − j5.139 A', ''),
        st('Step 2　I<sub>1</sub>（上火線）。', 'I<sub>1</sub> = 12 + 8 = 20 A', ''),
        st('Step 3　I<sub>2</sub>（下火線，箭頭向右）。', 'I<sub>2</sub> = −(9.087 − j5.139 + 8) = 17.85∠163.26° A', '電流其實從負載流回電源，所以向右是負的。'),
        st('Step 4　I<sub>n</sub>（中性線）。', 'I<sub>n</sub> = I<sub>冰箱</sub> − I<sub>燈</sub> = −2.913 − j5.139 = 5.907∠−119.5° A', ''),
        st('Step 5　(b)(c)。', 'S = 120²/10 + 240²/30 + 120²/(10 − j5.655) = 4451 + j617 VA；pf = 0.9905（落後）', '')
      ],
      ans: '(a) I<sub>1</sub> = 20 A、I<sub>2</sub> ≈ 17.85∠163.26° A、I<sub>n</sub> ≈ 5.907∠−119.5° A　(b) 4451 + j617 VA　(c) 0.9905 落後', note: 'I<sub>2</sub>、I<sub>n</sub> 的正負號照圖上箭頭方向（向右）定義。' }),

    /* ═══════════ 綜合題 ═══════════ */
    it(87, 'cp', '電視發射機的功率因數', {
      q: '電視發射機中的一個串聯電路阻抗為 3 kΩ，總電流 50 mA。若電阻兩端電壓為 80 V，電路的功率因數是多少？',
      en: 'In a TV transmitter, a series circuit has an impedance of 3 kΩ and a total current of 50 mA. If the voltage across the resistor is 80 V, what is the power factor of the circuit?',
      hint: 'R = V<sub>R</sub>/I；pf = R/|Z|。',
      steps: [
        st('Step 1　電阻。', 'R = 80/0.05 = 1600 Ω', ''),
        st('Step 2　pf。', 'pf = R/|Z| = 1600/3000 = 0.5333', '')
      ],
      ans: 'pf ≈ 0.5333' }),
    it(88, 'cp', '電子電路的實功率與視在功率', {
      q: '某電子電路接在 110 V 交流電源上，吸取的電流 rms 為 2 A，相角 55°。(a) 求電路吸取的實功率。(b) 求視在功率。',
      en: 'A certain electronic circuit is connected to a 110-V ac line. The root-mean-square value of the current drawn is 2 A, with a phase angle of 55°. (a) Find the true power drawn by the circuit. (b) Calculate the apparent power.',
      hint: 'P = VI cos θ；|S| = VI。',
      steps: [
        st('(a)', 'P = 110 × 2 × cos 55° = 126.2 W', ''),
        st('(b)', '|S| = 110 × 2 = 220 VA', '')
      ],
      ans: '(a) 126.2 W　(b) 220 VA' }),
    it(92, 'cp', '工廠饋線：Q、|S|、pf、電流', { fig: F.f1197, cap: '圖 11.97（重畫）',
      q: '如圖 11.97，550 V 饋線供應一座工廠：馬達 60 kW、pf 0.75（電感性）、20 kVAR 電容、照明 20 kW。(a) 求工廠吸收的總虛功率與視在功率。(b) 求整體 pf。(c) 求饋線電流大小。',
      en: 'As shown in Fig. 11.97, a 550-V feeder line supplies an industrial plant consisting of a motor drawing 60 kW at 0.75 pf (inductive), a capacitor with a rating of 20 kVAR, and lighting drawing 20 kW. (a) Calculate the total reactive power and apparent power absorbed by the plant. (b) Determine the overall pf. (c) Find the magnitude of the current in the feeder line.',
      hint: '馬達 Q = 60 tan(cos<sup>−1</sup>0.75)；電容 Q 取負。',
      steps: [
        st('Step 1　馬達。', 'Q = 60 × 0.8819 = 52.92 kVAR', ''),
        st('Step 2　(a)', 'P = 60 + 20 = 80 kW；Q = 52.92 − 20 = 32.92 kVAR；|S| = 86.51 kVA', ''),
        st('Step 3　(b)', 'pf = 80/86.51 = 0.9248（落後）', ''),
        st('Step 4　(c)', 'I = 86.51k/550 = 157.3 A', '')
      ],
      ans: '(a) 32.92 kVAR、86.51 kVA　(b) 0.9248 落後　(c) 157.3 A', note: '圖上照明寫 10 kW，但題目文字寫 20 kW；這裡照文字 20 kW（請確認）。' }),
    it(93, 'cp', '四個主要負載', {
      q: '工廠有四個主要負載：5 hp、pf 0.8 落後的馬達（1 hp = 0.7457 kW）；1.2 kW、pf 1.0 的加熱器；十個 120 W 燈泡；1.6 kVAR、pf 0.6 超前的同步馬達。(a) 計算總實功率與虛功率。(b) 求整體功率因數。',
      en: 'A factory has the following four major loads: a motor rated at 5 hp, 0.8 pf lagging (1 hp = 0.7457 kW); a heater rated at 1.2 kW, 1.0 pf; ten 120-W lightbulbs; a synchronous motor rated at 1.6 kVAR, 0.6 pf leading. (a) Calculate the total real and reactive power. (b) Find the overall power factor.',
      hint: '同步馬達只給 Q：P = Q/tan θ。',
      steps: [
        st('Step 1　各負載。', '馬達 3.729 + j2.796；加熱器 1.2；燈泡 1.2；同步馬達 1.2 − j1.6（kW、kVAR）', 'P = 1.6/tan(cos<sup>−1</sup>0.6) = 1.2 kW。'),
        st('Step 2　(a)', 'P = 7.329 kW；Q = 1.196 kVAR', ''),
        st('Step 3　(b)', 'pf = 7.329/7.426 = 0.9869（落後）', '')
      ],
      ans: '(a) P ≈ 7.329 kW、Q ≈ 1.196 kVAR　(b) 0.9869 落後' }),
    it(97, 'cp', '輸電系統：負載吸收的功率', { fig: F.f1199, cap: '圖 11.99（重畫）',
      q: '輸電系統模型如圖 11.99。若 V<sub>s</sub> = 240∠0° V rms，求負載吸收的平均功率。（講義印成 10.97）',
      en: 'A power transmission system is modeled as shown in Fig. 11.99. If V<sub>s</sub> = 240∠0° V rms, find the average power absorbed by the load.',
      hint: '迴路總阻抗 = 兩段線路 + 負載，全部串聯。',
      steps: [
        st('Step 1　總阻抗。', 'Z = 2(0.1 + j1) + 100 + j1 = 100.2 + j3 Ω', ''),
        st('Step 2　電流。', '|I| = 240/|Z| = 240/100.24 = 2.394 A', ''),
        st('Step 3　負載功率。', 'P = 2.394² × 100 = 573.2 W', '')
      ],
      ans: 'P ≈ 573.2 W' })
  ];

  window.__CH11PB = window.__CH11PB || { book: 'Alexander & Sadiku', items: [] };
  window.__CH11PB.items = window.__CH11PB.items.concat(items);
})();
