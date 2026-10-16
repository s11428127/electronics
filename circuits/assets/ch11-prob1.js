/* ============================================================
   電路學 CH11 章末練習題（1/3）：Review Questions 11.1～11.10、Section 11.2～11.3（Problem 11.1～11.21）
   出處：Alexander & Sadiku, Fundamentals of Electric Circuits, Chapter 11 Problems（使用者 10/16 提供）
   - 跳過標 e⁷d（Design a problem）與 ML（PSpice／MultiSim）圖示的題目：11.4、11.14
   - 11.1～11.21 的電壓、電流是「峰值」（P = ½VI cos θ）；11.22 起課本說一律是 rms
   - 數值全部用程式（Python 複數）驗算過
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, dx, dy, parts) => S.svg(w + 70, h, ['<g transform="translate(' + dx + ',' + dy + ')">'].concat(parts, ['</g>']));

  /* ── 圖 ── */
  const F = {
    tri: G(330, 130, 10, 10, [
      S.w('20,90', '120,90', '120,10', '20,90'), S.t(70, 105, '500 W', 'middle'), S.t(42, 82, '60°', 'start', ' font-size="11"'), S.t(70, 120, '(a)', 'middle', ' font-size="11"'),
      S.w('180,10', '300,10', '300,80', '180,10'), S.t(306, 50, '1000 VAR', 'start', ' font-size="11"'), S.t(206, 24, '30°', 'start', ' font-size="11"'), S.t(240, 120, '(b)', 'middle', ' font-size="11"')]),
    f1135: G(330, 160, 50, 10, [
      S.c(20, 30, 20, 130, '−j4 Ω', { side: 'l' }), S.w('20,30', '60,30'), S.l(60, 30, 150, 30, 'j1 Ω'), S.w('150,30', '250,30'),
      S.is(160, 30, 130, '2∠0° A', { side: 'r' }), S.r(250, 30, 250, 130, '5 Ω', { side: 'r' }), S.w('20,130', '250,130'), S.dot(160, 30), S.dot(160, 130)]),
    f1137: G(330, 160, 40, 10, [
      S.vs(30, 30, 130, 'v_s'), S.r(30, 30, 130, 30, '1 Ω'), S.l(130, 30, 130, 130, '3 H', { side: 'r' }), S.r(130, 30, 230, 30, '2 Ω'),
      S.c(230, 30, 230, 130, '0.25 F', { side: 'r' }), S.w('30,130', '230,130'), S.dot(130, 30), S.dot(130, 130)]),
    f1138: G(340, 175, 30, 30, [
      S.is(30, 20, 130, 'i_s'), S.w('30,20', '130,20'), S.r(130, 20, 130, 75, '50 Ω', { side: 'r' }), S.c(130, 75, 130, 130, '40 μF', { side: 'r' }),
      S.t(118, 46, 'i_x↓', 'end', ' font-size="11"'), S.dvsh(130, 250, 20, '20i_x'), S.l(250, 20, 250, 75, '20 mH', { side: 'r' }), S.r(250, 75, 250, 130, '10 Ω', { side: 'r' }),
      S.w('30,130', '250,130'), S.dot(130, 20), S.dot(130, 130)]),
    f1139: G(440, 165, 60, 25, [
      S.vs(10, 25, 125, '8∠20° V'), S.r(10, 25, 110, 25, '4 Ω'), S.t(60, 46, 'I_o →', 'middle', ' font-size="11"'), S.dvs(110, 25, 125, '0.1V_o', { side: 'r' }), S.w('10,125', '110,125'),
      S.dis(235, 25, 125, '8I_o', { down: true, side: 'l' }), S.w('235,25', '285,25'), S.l(285, 25, 285, 125, 'j5 Ω', { side: 'r' }), S.c(285, 25, 360, 25, '−j5 Ω'),
      S.r(360, 25, 360, 125, '10 Ω', { side: 'r' }), S.w('235,125', '360,125'), S.t(412, 60, '+', 'start'), S.t(412, 80, 'V_o', 'start'), S.t(412, 100, '−', 'start'), S.dot(285, 25), S.dot(285, 125)]),
    f1140: G(360, 160, 45, 25, [
      S.is(20, 20, 120, '6∠0° A'), S.l(90, 20, 90, 120, 'j10 Ω', { side: 'r' }), S.w('20,20', '90,20'), S.c(90, 20, 200, 20, '−j20 Ω'), S.t(145, 38, 'I_o →', 'middle', ' font-size="11"'),
      S.dis(200, 20, 120, '0.5I_o', { side: 'r' }), S.w('200,20', '290,20'), S.r(290, 20, 290, 120, '40 Ω', { side: 'r' }), S.w('20,120', '290,120'), S.dot(90, 20), S.dot(90, 120), S.dot(200, 120)]),
    f1141: G(360, 215, 20, 10, [
      S.vs(30, 80, 170, 'V_s'), S.w('30,80', '30,38', '120,38'), S.opamp(120, 50, { plusTop: true }),
      S.w('120,62', '105,62', '105,95'), S.r(105, 95, 168, 95, '10 kΩ', { side: 'b' }), S.l(168, 95, 228, 95, 'j6 kΩ', { side: 'b' }), S.w('228,95', '228,50'), S.w('176,50', '290,50'),
      S.r(105, 95, 105, 140, '2 kΩ', { side: 'l' }), S.l(105, 140, 105, 190, 'j4 kΩ', { side: 'l' }),
      S.r(290, 50, 290, 120, '20 kΩ', { side: 'r' }), S.c(290, 120, 290, 190, '−j12 kΩ', { side: 'r' }), S.w('30,170', '30,190', '290,190'), S.dot(105, 95), S.dot(228, 50), S.dot(105, 190)]),
    f1142: G(380, 200, 20, 10, [
      S.vs(30, 110, 170, 'V_o cos ωt V', { side: 'r' }), S.gnd(30, 170), S.w('30,110', '30,68', '80,68'), S.w('50,68', '50,30', '235,30'),
      S.opamp(80, 80, { plusTop: true }), S.w('136,80', '145,80', '145,112', '65,112', '65,92', '80,92'),
      S.r(145, 80, 215, 80, 'R'), S.w('215,80', '228,80', '228,92', '250,92'), S.w('235,30', '235,68', '250,68'), S.opamp(250, 80, { plusTop: true }),
      S.r(235, 30, 330, 30, 'R'), S.w('306,80', '330,80'), S.w('330,30', '330,140'), S.w('228,92', '228,140'), S.r(228, 140, 330, 140, 'R', { side: 'b' }),
      S.dot(50, 68), S.dot(235, 30), S.dot(228, 92), S.dot(330, 80)]),
    f1143: G(330, 120, 30, 10, [
      S.box(10, 15, 110, 85, ['Linear', 'network']), S.w('120,30', '230,30'), S.w('120,85', '230,85'), S.term(230, 30), S.term(230, 85),
      S.t(244, 34, 'a', 'start'), S.t(244, 89, 'b', 'start'), S.t(222, 52, '+', 'middle'), S.t(222, 63, 'v', 'middle'), S.t(222, 78, '−', 'middle'), S.t(180, 22, '← i', 'middle')]),
    f1144: G(340, 185, 60, 10, [
      S.vs(30, 70, 170, '165∠0° V'), S.w('30,70', '30,25'), S.l(30, 25, 250, 25, 'j2 Ω'), S.r(30, 70, 125, 70, '4 Ω'),
      S.z(125, 70, 125, 170, 'Z_L', { side: 'r' }), S.c(125, 70, 250, 70, '−j3 Ω'), S.w('250,25', '250,70'), S.r(250, 70, 250, 170, '5 Ω', { side: 'r' }), S.w('30,170', '250,170'), S.dot(30, 70), S.dot(250, 70), S.dot(125, 170)]),
    f1146: G(360, 160, 55, 15, [
      S.vs(20, 25, 125, '12∠0° V'), S.r(20, 25, 105, 25, '1 Ω'), S.l(105, 25, 105, 125, 'j1 Ω', { side: 'r' }), S.t(92, 60, '+', 'end'), S.t(92, 78, 'V_o', 'end'), S.t(92, 96, '−', 'end'),
      S.c(105, 25, 200, 25, '−j1 Ω'), S.dis(200, 25, 125, '2V_o', { side: 'r' }), S.w('200,25', '275,25'), S.z(275, 25, 275, 125, 'Z_L', { side: 'r' }), S.w('20,125', '275,125'), S.dot(105, 25), S.dot(200, 25), S.dot(105, 125), S.dot(200, 125)]),
    f1147: G(360, 190, 85, 10, [
      S.vs(20, 75, 170, '10 cos 4t V'), S.r(20, 75, 110, 75, '2 Ω'), S.c(110, 75, 110, 170, '1/20 F', { side: 'r' }), S.t(98, 112, '+', 'end'), S.t(98, 126, 'v_o', 'end'), S.t(98, 140, '−', 'end'),
      S.r(110, 75, 220, 75, '4 Ω'), S.w('110,75', '110,28'), S.dish(110, 220, 28, '0.5 v_o'), S.w('220,28', '220,75'),
      S.l(220, 75, 220, 170, '1 H', { side: 'r' }), S.w('220,75', '280,75'), S.z(280, 75, 280, 170, 'Z_L', { side: 'r' }), S.w('20,170', '280,170'), S.dot(110, 75), S.dot(220, 75), S.dot(110, 170), S.dot(220, 170)]),
    f1148: G(340, 185, 20, 10, [
      S.c(70, 90, 150, 20, ''), S.r(150, 20, 230, 90, ''), S.r(70, 90, 150, 160, ''), S.l(150, 160, 230, 90, ''), S.z(70, 90, 230, 90, ''),
      S.t(92, 46, '−j10 Ω', 'end'), S.t(206, 46, '30 Ω', 'start'), S.t(92, 140, '40 Ω', 'end'), S.t(206, 140, 'j20 Ω', 'start'), S.t(150, 82, 'Z_L', 'middle'),
      S.w('150,20', '290,20'), S.is(290, 20, 160, '5∠90° A', { side: 'r' }), S.w('290,160', '150,160'), S.dot(70, 90), S.dot(230, 90)]),
    f1149: G(360, 190, 40, 10, [
      S.w('20,20', '260,20'), S.r(20, 20, 20, 95, '40 Ω', { side: 'l' }), S.l(20, 95, 20, 170, 'j30 Ω', { side: 'l' }),
      S.vs(140, 20, 95, '60∠0° V', { flip: true, side: 'r' }), S.is(140, 95, 170, '5∠0° A', { side: 'r' }),
      S.r(20, 95, 140, 95, '40 Ω'), S.r(140, 95, 260, 95, '80 Ω'), S.c(260, 20, 260, 95, '−j10 Ω', { side: 'r' }), S.z(260, 95, 260, 170, 'Z_L', { side: 'r' }),
      S.w('20,170', '260,170'), S.dot(140, 20), S.dot(140, 95), S.dot(260, 95), S.dot(140, 170)]),
    f1150: G(330, 160, 45, 15, [
      S.l(20, 25, 20, 125, 'j1 Ω', { side: 'l' }), S.r(20, 25, 120, 25, '3 Ω'), S.is(120, 25, 125, '33∠0° A', { side: 'r' }), S.w('120,25', '200,25'),
      S.r(200, 25, 200, 125, '6 Ω', { side: 'r' }), S.c(200, 25, 270, 25, '−j2 Ω'), S.r(270, 25, 270, 125, 'R（可變）', { side: 'r' }), S.w('20,125', '270,125'), S.dot(120, 25), S.dot(200, 25), S.dot(120, 125), S.dot(200, 125)]),
    f1151: G(380, 160, 60, 20, [
      S.vs(20, 25, 125, '165∠0° V'), S.r(20, 25, 105, 25, '40 Ω'), S.t(55, 44, 'I_o →', 'middle', ' font-size="11"'), S.l(105, 25, 105, 125, 'j20 Ω', { side: 'r' }), S.w('105,25', '170,25'),
      S.c(170, 25, 170, 125, '−j10 Ω', { side: 'r' }), S.dvsh(170, 250, 25, '4I_o'), S.c(250, 25, 250, 125, '−j10 Ω', { side: 'r' }), S.w('250,25', '310,25'),
      S.r(310, 25, 310, 125, 'R_L', { side: 'r' }), S.w('20,125', '310,125'), S.dot(105, 25), S.dot(250, 25)]),
    f1152: G(380, 165, 60, 15, [
      S.vs(20, 25, 130, '120∠60° V'), S.r(20, 25, 110, 25, '100 Ω'), S.r(110, 25, 110, 78, '40 Ω', { side: 'r' }), S.l(110, 78, 110, 130, 'j30 Ω', { side: 'r' }),
      S.c(110, 25, 195, 25, '−j10 Ω'), S.r(195, 25, 195, 130, '50 Ω', { side: 'r' }), S.w('195,25', '265,25'), S.is(265, 25, 130, '2∠90° A', { side: 'r' }),
      S.w('265,25', '310,25'), S.w('265,130', '310,130'), S.term(310, 25), S.term(310, 130), S.t(318, 29, 'a', 'start'), S.t(318, 134, 'b', 'start'), S.w('20,130', '265,130'), S.dot(110, 25), S.dot(195, 25), S.dot(265, 25)])
  };

  const RQ = (n, q, en, opts, a, why) => ({ id: 'rq11-' + n, sec: 'rq', kind: 'pp', tag: 'Review Question 11.' + n, title: q.replace(/<[^>]+>/g, '').slice(0, 26),
    q: q + '<ol type="a" style="margin:6px 0 0;padding-left:22px">' + opts.map(o => '<li>' + o + '</li>').join('') + '</ol>', en,
    hint: '先想清楚定義，再刪掉明顯不對的選項。', steps: [st('想法。', '', why)], ans: '(' + a + ')' });

  const items = [
    /* ═══════════ Review Questions（課本附答案） ═══════════ */
    RQ(1, '電感吸收的平均功率是零。', 'The average power absorbed by an inductor is zero.', ['True', 'False'], 'a', '電感的電壓、電流差 90°，cos 90° = 0；它只是把能量存進去再吐出來。'),
    RQ(2, '從負載端看進去的戴維寧阻抗是 80 + j55 Ω。要最大功率轉移，負載阻抗必須是：', 'The Thevenin impedance of a network seen from the load terminals is 80 + j55 Ω. For maximum power transfer, the load impedance must be:',
      ['−80 + j55 Ω', '−80 − j55 Ω', '80 − j55 Ω', '80 + j55 Ω'], 'c', 'Z<sub>L</sub> = Z<sub>Th</sub>*：實部一樣、虛部變號。'),
    RQ(3, '家裡 60 Hz、120 V 插座的電壓振幅（峰值）是：', 'The amplitude of the voltage available in the 60-Hz, 120-V power outlet in your home is:', ['110 V', '120 V', '170 V', '210 V'], 'c', '120 V 是 rms，峰值 = 120√2 ≈ 170 V。'),
    RQ(4, '負載阻抗 20 − j20 的功率因數是：', 'If the load impedance is 20 − j20, the power factor is', ['∠−45°', '0', '1', '0.7071', 'none of these'], 'd', 'pf = cos(−45°) = 0.7071（超前）。pf 是一個數字，不是角度。'),
    RQ(5, '包含負載所有功率資訊的量是：', 'A quantity that contains all the power information in a given load is the', ['power factor', 'apparent power', 'average power', 'reactive power', 'complex power'], 'e', '複功率 S = P + jQ：實部、虛部、大小、角度全部都在裡面。'),
    RQ(6, '虛功率的單位是：', 'Reactive power is measured in:', ['watts', 'VA', 'VAR', 'none of these'], 'c', 'P 用 W、|S| 用 VA、Q 用 VAR，三個單位故意分開。'),
    { ...RQ(7, '圖 11.34(a) 的功率三角形，虛功率是：', 'In the power triangle shown in Fig. 11.34(a), the reactive power is:', ['1000 VAR leading', '1000 VAR lagging', '866 VAR leading', '866 VAR lagging'], 'd', 'Q = P tan 60° = 500 × 1.732 = 866 VAR；三角形往上（Q &gt; 0）是電感性，落後。'), fig: F.tri, cap: '圖 11.34（重畫）' },
    { ...RQ(8, '圖 11.34(b) 的功率三角形，視在功率是：', 'For the power triangle in Fig. 11.34(b), the apparent power is:', ['2000 VA', '1000 VAR', '866 VAR', '500 VAR'], 'a', '|S| = Q / sin 30° = 1000 / 0.5 = 2000 VA。視在功率的單位是 VA，所以只有 (a) 可能。'), fig: F.tri, cap: '圖 11.34（重畫）' },
    RQ(9, '電源接三個並聯負載 Z<sub>1</sub>、Z<sub>2</sub>、Z<sub>3</sub>。下列何者「不」成立？', 'A source is connected to three loads Z1, Z2, and Z3 in parallel. Which of these is not true?',
      ['P = P<sub>1</sub> + P<sub>2</sub> + P<sub>3</sub>', 'Q = Q<sub>1</sub> + Q<sub>2</sub> + Q<sub>3</sub>', 'S = S<sub>1</sub> + S<sub>2</sub> + S<sub>3</sub>（大小）', '<b>S</b> = <b>S</b><sub>1</sub> + <b>S</b><sub>2</sub> + <b>S</b><sub>3</sub>（複數）'], 'c', '複功率、P、Q 都守恆可以直接加；但視在功率的「大小」不能直接加（向量相加後的長度 ≠ 長度相加）。'),
    RQ(10, '量平均功率的儀器是：', 'The instrument for measuring average power is the:', ['voltmeter', 'ammeter', 'wattmeter', 'varmeter', 'kilowatt-hour meter'], 'c', '瓦特計（wattmeter）量 P；kWh 計量的是能量（P × 時間）。'),

    /* ═══════════ 11.2 瞬時功率與平均功率 ═══════════ */
    { id: 'p11-1', sec: '11.2', kind: 'pp', tag: 'Problem 11.1', title: '瞬時功率與平均功率（i 是 sin）',
      q: '若 v(t) = 160 cos 50t V、i(t) = −33 sin(50t − 30°) A，求瞬時功率與平均功率。',
      en: 'If v(t) = 160 cos 50t V and i(t) = −33 sin(50t − 30°) A, calculate the instantaneous power and the average power.',
      hint: '−sin x = cos(x + 90°)。兩個都換成 cos 再相乘、積化和差。',
      steps: [
        st('Step 1　把 i 換成 cos。', 'i = −33 sin(50t − 30°) = 33 cos(50t − 30° + 90°) = 33 cos(50t + 60°) A', '−sin x = cos(x + 90°)。'),
        st('Step 2　相乘、積化和差。', 'p = 5280 cos 50t cos(50t + 60°) = 5280 × ½[cos(100t + 60°) + cos(−60°)]', '160 × 33 = 5280；cos A cos B = ½[cos(A + B) + cos(A − B)]。'),
        st('Step 3　整理。', 'p(t) = 2640 × 0.5 + 2640 cos(100t + 60°) = 1320 + 2640 cos(100t + 60°) W', '常數項 2640 cos 60° = 1320。'),
        st('Step 4　平均功率。', 'P = ½ V<sub>m</sub>I<sub>m</sub> cos(θ<sub>v</sub> − θ<sub>i</sub>) = ½ × 160 × 33 × cos(0° − 60°) = 1320 W', '跟瞬時功率的常數項一樣（弦波那項平均是 0）。')
      ],
      ans: 'p(t) = 1.32 + 2.64 cos(100t + 60°) kW；P = 1.32 kW' },

    { id: 'p11-2', sec: '11.2', kind: 'pp', tag: 'Problem 11.2', title: '每個元件吸收或供給的平均功率', fig: F.f1135, cap: '圖 11.35（重畫）',
      q: '求圖 11.35 中每個元件供給或吸收的平均功率。',
      en: 'Given the circuit in Fig. 11.35, find the average power supplied or absorbed by each element.',
      hint: '電流源上面那個節點只有一個：5 Ω 一條路、(j1 − j4) 串聯一條路。先求節點電壓 V。',
      steps: [
        st('Step 1　電感和電容串聯。', 'j1 + (−j4) = −j3 Ω', '左邊那條是 j1 和 −j4 串在一起，再接地。'),
        st('Step 2　節點導納。', 'Y = 1/5 + 1/(−j3) = 0.2 + j0.333 S', '電流源看到 5 Ω 和 −j3 Ω 並聯。'),
        st('Step 3　節點電壓。', 'V = 2∠0° / Y = 5.145∠−59.04° V', ''),
        st('Step 4　電阻吸收。', 'P<sub>5Ω</sub> = |V|²/(2 × 5) = 5.145²/10 = 2.647 W', '峰值所以除 2。'),
        st('Step 5　電源供給、L 與 C。', 'P<sub>源</sub> = ½ Re(V · 2*) = ½ × 5.145 × 2 × cos(−59.04°) = 2.647 W；P<sub>L</sub> = P<sub>C</sub> = 0', '電源送出的剛好被 5 Ω 吃掉；電感、電容不吃平均功率。')
      ],
      ans: '電流源供給 2.647 W；5 Ω 吸收 2.647 W；j1 Ω 與 −j4 Ω 都是 0 W' },

    { id: 'p11-3', sec: '11.2', kind: 'pp', tag: 'Problem 11.3', title: 'RC 並聯負載的平均功率',
      q: '負載由 60 Ω 電阻與 90 μF 電容並聯組成，接到 v<sub>s</sub>(t) = 160 cos 2000t 的電壓源，求送到負載的平均功率。',
      en: 'A load consists of a 60-Ω resistor in parallel with a 90-μF capacitor. If the load is connected to a voltage source v<sub>s</sub>(t) = 160 cos 2000t, find the average power delivered to the load.',
      hint: '並聯 → 電阻兩端就是 160 V 峰值；電容不吃平均功率。',
      steps: [
        st('Step 1　電阻兩端電壓。', 'V<sub>R</sub> = 160 V（峰值）', '並聯，所以電阻直接接在電源上。'),
        st('Step 2　只有電阻吃平均功率。', 'P = V<sub>m</sub>²/(2R) = 160²/(2 × 60) = 213.3 W', '電容的平均功率是 0，不用算它的阻抗。')
      ],
      ans: 'P = 213.3 W' },

    { id: 'p11-5', sec: '11.2', kind: 'pp', tag: 'Problem 11.5', title: '每個被動元件的平均功率', fig: F.f1137, cap: '圖 11.37（重畫）',
      q: '圖 11.37 中 v<sub>s</sub> = 8 cos(2t − 40°) V，求送到每個被動元件的平均功率。',
      en: 'Assuming that v<sub>s</sub> = 8 cos(2t − 40°) V in the circuit of Fig. 11.37, find the average power delivered to each of the passive elements.',
      hint: 'ω = 2：3 H → j6 Ω、0.25 F → −j2 Ω。先求總電流，再分流到 2 Ω 那條。',
      steps: [
        st('Step 1　換成阻抗。', '3 H → jωL = j6 Ω；0.25 F → 1/(jωC) = −j2 Ω', 'ω = 2 rad/s。'),
        st('Step 2　並聯部分。', 'j6 ∥ (2 − j2) = 3.6 − j1.2 Ω', '3 H 和「2 Ω + 電容」那條並聯。'),
        st('Step 3　總電流。', 'I = 8∠−40° / (1 + 3.6 − j1.2) = 8∠−40° / 4.754∠−14.62° = 1.683∠−25.38° A', ''),
        st('Step 4　1 Ω 的功率。', 'P<sub>1Ω</sub> = ½ × 1.683² × 1 = 1.416 W', ''),
        st('Step 5　2 Ω 那條的電流。', 'V<sub>1</sub> = I(3.6 − j1.2) = 6.386∠−43.81° V；I<sub>2</sub> = V<sub>1</sub>/(2 − j2) = 2.258∠1.19° A', ''),
        st('Step 6　2 Ω 的功率。', 'P<sub>2Ω</sub> = ½ × 2.258² × 2 = 5.097 W；P<sub>3H</sub> = P<sub>0.25F</sub> = 0', '驗算：兩個電阻合計 6.51 W = 電源送出的平均功率。')
      ],
      ans: 'P<sub>1Ω</sub> = 1.416 W、P<sub>2Ω</sub> = 5.097 W、P<sub>3H</sub> = P<sub>0.25F</sub> = 0' },

    { id: 'p11-6', sec: '11.2', kind: 'pp', tag: 'Problem 11.6', title: '有相依電壓源：50 Ω 的功率', fig: F.f1138, cap: '圖 11.38（重畫）',
      q: '圖 11.38 中 i<sub>s</sub> = 6 cos 10<sup>3</sup>t A，求 50 Ω 電阻吸收的平均功率。',
      en: 'For the circuit in Fig. 11.38, i<sub>s</sub> = 6 cos 10<sup>3</sup>t A. Find the average power absorbed by the 50-Ω resistor.',
      hint: 'ω = 1000：40 μF → −j25、20 mH → j20。左節點 V<sub>1</sub>、右節點 V<sub>2</sub> = V<sub>1</sub> − 20i<sub>x</sub>，用超節點 KCL。',
      steps: [
        st('Step 1　換成阻抗。', '40 μF → −j25 Ω；20 mH → j20 Ω', 'ω = 10<sup>3</sup>。'),
        st('Step 2　兩條關係。', 'i<sub>x</sub> = V<sub>1</sub>/(50 − j25)；V<sub>2</sub> = V<sub>1</sub> − 20i<sub>x</sub>', '相依源 + 在左：V<sub>1</sub> − V<sub>2</sub> = 20i<sub>x</sub>。'),
        st('Step 3　KCL。', '6 = i<sub>x</sub> + V<sub>2</sub>/(10 + j20)', '電流源送進來的 = 往下走的兩條。'),
        st('Step 4　解。', 'V<sub>1</sub> = 186.1∠43.99° V；i<sub>x</sub> = 3.328∠70.56° A', ''),
        st('Step 5　50 Ω 的功率。', 'P = ½ × 3.328² × 50 = 276.9 W', '')
      ],
      ans: 'P<sub>50Ω</sub> ≈ 276.9 W' },

    { id: 'p11-7', sec: '11.2', kind: 'pp', tag: 'Problem 11.7', title: '兩個相依源：10 Ω 的功率', fig: F.f1139, cap: '圖 11.39（重畫）',
      q: '求圖 11.39 中 10 Ω 電阻吸收的平均功率。',
      en: 'Given the circuit of Fig. 11.39, find the average power absorbed by the 10-Ω resistor.',
      hint: '左右兩半靠相依源互相牽制：左邊 I<sub>o</sub> = (8∠20° − 0.1V<sub>o</sub>)/4，右邊兩個節點 KCL。三條式子三個未知數。',
      steps: [
        st('Step 1　左半邊。', 'I<sub>o</sub> = (8∠20° − 0.1V<sub>o</sub>)/4', '4 Ω 兩端是電源減相依電壓源。'),
        st('Step 2　右半邊節點 A（j5 上端）。', '8I<sub>o</sub> + V<sub>A</sub>/(j5) + (V<sub>A</sub> − V<sub>o</sub>)/(−j5) = 0', '8I<sub>o</sub> 箭頭朝下 = 從 A 流出。'),
        st('Step 3　節點 V<sub>o</sub>。', '(V<sub>o</sub> − V<sub>A</sub>)/(−j5) + V<sub>o</sub>/10 = 0', ''),
        st('Step 4　解聯立。', 'I<sub>o</sub> = 1.414∠65° A；V<sub>o</sub> = 56.57∠−25° V', ''),
        st('Step 5　10 Ω 的功率。', 'P = |V<sub>o</sub>|²/(2 × 10) = 56.57²/20 = 160 W', '')
      ],
      ans: 'P<sub>10Ω</sub> = 160 W' },

    { id: 'p11-8', sec: '11.2', kind: 'pp', tag: 'Problem 11.8', title: '相依電流源：40 Ω 的功率', fig: F.f1140, cap: '圖 11.40（重畫）',
      q: '求圖 11.40 中 40 Ω 電阻吸收的平均功率。',
      en: 'In the circuit of Fig. 11.40, determine the average power absorbed by the 40-Ω resistor.',
      hint: '兩個節點：V<sub>1</sub>（左）、V<sub>2</sub>（右）。右節點流進來的是 I<sub>o</sub> + 0.5I<sub>o</sub>。',
      steps: [
        st('Step 1　左節點。', '6 = V<sub>1</sub>/(j10) + I<sub>o</sub>，I<sub>o</sub> = (V<sub>1</sub> − V<sub>2</sub>)/(−j20)', ''),
        st('Step 2　右節點。', 'I<sub>o</sub> + 0.5I<sub>o</sub> = V<sub>2</sub>/40', '相依源箭頭朝上，往右節點送 0.5I<sub>o</sub>。'),
        st('Step 3　解。', 'V<sub>2</sub> = 59.18∠99.46° V', ''),
        st('Step 4　40 Ω 的功率。', 'P = 59.18²/(2 × 40) = 43.78 W', '')
      ],
      ans: 'P<sub>40Ω</sub> ≈ 43.78 W' },

    { id: 'p11-9', sec: '11.2', kind: 'pp', tag: 'Problem 11.9', title: '運算放大器：20 kΩ 的功率', fig: F.f1141, cap: '圖 11.41（重畫）',
      q: '圖 11.41 的運算放大器電路中 V<sub>s</sub> = 10∠30° V，求 20 kΩ 電阻吸收的平均功率。',
      en: 'For the op amp circuit in Fig. 11.41, V<sub>s</sub> = 10∠30° V. Find the average power absorbed by the 20-kΩ resistor.',
      hint: '非反相放大器：V<sub>o</sub> = (1 + Z<sub>f</sub>/Z<sub>g</sub>)V<sub>s</sub>，Z<sub>f</sub> = 10k + j6k、Z<sub>g</sub> = 2k + j4k。',
      steps: [
        st('Step 1　增益。', '1 + (10 + j6)/(2 + j4) = 3.493∠−23.63°', '反饋那條是 Z<sub>f</sub>，接地那條是 Z<sub>g</sub>（kΩ 約掉）。'),
        st('Step 2　輸出電壓。', 'V<sub>o</sub> = 10∠30° × 3.493∠−23.63° = 34.93∠6.37° V', ''),
        st('Step 3　負載電流。', 'I = V<sub>o</sub>/(20k − j12k) = 34.93∠6.37° / 23.32k∠−30.96° = 1.498∠37.33° mA', '負載是 20 kΩ 和 −j12 kΩ 串聯。'),
        st('Step 4　20 kΩ 的功率。', 'P = ½ × (1.498 × 10<sup>−3</sup>)² × 20 × 10<sup>3</sup> = 22.43 mW', '')
      ],
      ans: 'P<sub>20kΩ</sub> ≈ 22.43 mW' },

    { id: 'p11-10', sec: '11.2', kind: 'pp', tag: 'Problem 11.10', title: '運算放大器：電阻總共吃多少？', fig: F.f1142, cap: '圖 11.42（重畫）',
      q: '求圖 11.42 運算放大器電路中所有電阻吸收的平均功率總和。',
      en: 'In the op amp circuit in Fig. 11.42, find the total average power absorbed by the resistors.',
      hint: '第一顆是電壓隨耦器；第二顆的 + 輸入直接接電源。看看每個電阻兩端是不是同電位。',
      steps: [
        st('Step 1　第一顆：電壓隨耦器。', 'v<sub>1</sub> = V<sub>o</sub> cos ωt', '輸出直接接回 − 輸入。'),
        st('Step 2　第二顆的輸入。', 'v<sub>+</sub> = V<sub>o</sub> cos ωt　⟹　v<sub>−</sub> = v<sub>+</sub> = V<sub>o</sub> cos ωt', '理想運放兩個輸入同電位。'),
        st('Step 3　中間的 R。', 'i = (v<sub>1</sub> − v<sub>−</sub>)/R = 0', '兩端都是 V<sub>o</sub> cos ωt。'),
        st('Step 4　下面的 R、上面的 R。', '下面 R 電流 0 ⟹ v<sub>out</sub> = v<sub>−</sub> = V<sub>o</sub> cos ωt；上面 R 兩端都是 V<sub>o</sub> cos ωt ⟹ 電流 0', ''),
        st('Step 5　結論。', 'P<sub>總</sub> = 0', '三個電阻都沒有電流。')
      ],
      ans: '0 W（三個電阻都沒有電流）' },

    { id: 'p11-11', sec: '11.2', kind: 'pp', tag: 'Problem 11.11', title: '已知埠阻抗，求網路吃多少功率', fig: F.f1143, cap: '圖 11.43（重畫）',
      q: '圖 11.43 的網路埠阻抗為 Z<sub>ab</sub> = R/√(1 + ω²R²C²) ∠−tan<sup>−1</sup>ωRC。R = 10 kΩ、C = 200 nF、i = 33 sin(377t + 22°) mA，求網路消耗的平均功率。',
      en: 'For the network in Fig. 11.43, assume that the port impedance is Z<sub>ab</sub> = R/√(1 + ω²R²C²) ∠−tan<sup>−1</sup>ωRC. Find the average power consumed by the network when R = 10 kΩ, C = 200 nF, and i = 33 sin(377t + 22°) mA.',
      hint: 'P = ½|I|² Re(Z)。sin 的相位不影響平均功率。',
      steps: [
        st('Step 1　ωRC。', 'ωRC = 377 × 10<sup>4</sup> × 200 × 10<sup>−9</sup> = 0.754', ''),
        st('Step 2　阻抗。', '|Z| = 10<sup>4</sup>/√(1 + 0.754²) = 7985 Ω，∠−37.02°', ''),
        st('Step 3　實部。', 'Re(Z) = 7985 cos 37.02° = 6375 Ω', '其實就是 R/(1 + ω²R²C²)。'),
        st('Step 4　功率。', 'P = ½ × (0.033)² × 6375 = 3.471 W', '電流峰值 33 mA。')
      ],
      ans: 'P ≈ 3.471 W' },

    /* ═══════════ 11.3 最大平均功率轉移 ═══════════ */
    { id: 'p11-12', sec: '11.3', kind: 'pp', tag: 'Problem 11.12', title: '求 Z<sub>L</sub> 與最大功率', fig: F.f1144, cap: '圖 11.44（重畫）',
      q: '求圖 11.44 中使 Z<sub>L</sub> 得到最大功率的負載阻抗，並求 Z<sub>L</sub> 吸收的最大功率。',
      en: 'For the circuit shown in Fig. 11.44, determine the load impedance Z<sub>L</sub> for maximum power transfer (to Z<sub>L</sub>). Calculate the maximum power absorbed by the load.',
      hint: '把電壓源短路求 Z<sub>Th</sub>：4 Ω 直接接地；−j3 接到 5 Ω 和 j2 並聯（j2 另一端也被短路接地）。',
      steps: [
        st('Step 1　電源短路後的右半邊。', '5 ∥ j2 = 0.690 + j1.724 Ω', 'j2 左端原本接電源正端，短路後變成接地。'),
        st('Step 2　串上 −j3。', '−j3 + (0.690 + j1.724) = 0.690 − j1.276 Ω', ''),
        st('Step 3　再並 4 Ω。', 'Z<sub>Th</sub> = 4 ∥ (0.690 − j1.276) = 0.8234 − j0.8642 Ω', ''),
        st('Step 4　Z<sub>L</sub> = Z<sub>Th</sub>*。', 'Z<sub>L</sub> = 0.8234 + j0.8642 Ω', ''),
        st('Step 5　V<sub>Th</sub>（Z<sub>L</sub> 拿掉，兩節點的節點分析）。', 'V<sub>Th</sub> = 166.9∠−17.47° V', '兩個未知節點：Z<sub>L</sub> 那點、5 Ω 那點。'),
        st('Step 6　最大功率。', 'P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>) = 166.9²/(8 × 0.8234) = 4.23 kW', '峰值所以是 8R（= 2 × 4R）。')
      ],
      ans: 'Z<sub>L</sub> = 0.8234 + j0.8642 Ω；P<sub>max</sub> ≈ 4.23 kW' },

    { id: 'p11-13', sec: '11.3', kind: 'pp', tag: 'Problem 11.13', title: '已知戴維寧等效，最大可用功率',
      q: '某電源的 Z<sub>Th</sub> = 120 + j60 Ω，戴維寧電壓峰值 V<sub>Th</sub> = 165 + j0 V，求電源能提供的最大平均功率。',
      en: 'The Thevenin impedance of a source is Z<sub>Th</sub> = 120 + j60 Ω, while the peak Thevenin voltage is V<sub>Th</sub> = 165 + j0 V. Determine the maximum available average power from the source.',
      hint: 'P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>)（峰值）。',
      steps: [
        st('Step 1　負載取共軛。', 'Z<sub>L</sub> = 120 − j60 Ω', '虛部互相抵消，只剩 R<sub>Th</sub> + R<sub>L</sub> = 240 Ω。'),
        st('Step 2　最大功率。', 'P<sub>max</sub> = 165²/(8 × 120) = 28.36 W', '')
      ],
      ans: 'P<sub>max</sub> ≈ 28.36 W' },

    { id: 'p11-15', sec: '11.3', kind: 'pp', tag: 'Problem 11.15', title: '有相依源的最大功率', fig: F.f1146, cap: '圖 11.46（重畫）',
      q: '求圖 11.46 中使 Z<sub>L</sub> 吸收最大功率的 Z<sub>L</sub>，以及最大功率。',
      en: 'In the circuit of Fig. 11.46, find the value of Z<sub>L</sub> that will absorb the maximum power and the value of the maximum power.',
      hint: '有相依源 → 不能直接看電阻，用 Z<sub>Th</sub> = V<sub>oc</sub>/I<sub>sc</sub>。',
      steps: [
        st('Step 1　開路（Z<sub>L</sub> 拿掉）。', '節點 a：12 − V<sub>o</sub> = V<sub>o</sub>/(j1) + (V<sub>o</sub> − V<sub>b</sub>)/(−j1)；節點 b：2V<sub>o</sub> + (V<sub>o</sub> − V<sub>b</sub>)/(−j1) = 0', ''),
        st('Step 2　解出開路電壓。', 'V<sub>oc</sub> = V<sub>b</sub> = 18.97∠71.57° V', ''),
        st('Step 3　短路（V<sub>b</sub> = 0）。', 'V<sub>o</sub> = 12/(1 + 1/j1 + 1/(−j1)) = 12 V；I<sub>sc</sub> = 2V<sub>o</sub> + V<sub>o</sub>/(−j1) = 24 + j12 = 26.83∠26.57° A', 'j1 和 −j1 並聯的導納剛好抵消。'),
        st('Step 4　Z<sub>Th</sub>。', 'Z<sub>Th</sub> = V<sub>oc</sub>/I<sub>sc</sub> = 0.5 + j0.5 Ω　⟹　Z<sub>L</sub> = 0.5 − j0.5 Ω', ''),
        st('Step 5　最大功率。', 'P<sub>max</sub> = 18.97²/(8 × 0.5) = 90 W', '')
      ],
      ans: 'Z<sub>L</sub> = 0.5 − j0.5 Ω；P<sub>max</sub> = 90 W' },

    { id: 'p11-16', sec: '11.3', kind: 'pp', tag: 'Problem 11.16', title: '時域電源＋相依源的最大功率', fig: F.f1147, cap: '圖 11.47（重畫）',
      q: '求圖 11.47 中能從電路得到最大功率的 Z<sub>L</sub>，並求送到 Z<sub>L</sub> 的功率。',
      en: 'For the circuit in Fig. 11.47, find the value of Z<sub>L</sub> that will receive the maximum power from the circuit. Then calculate the power delivered to the load Z<sub>L</sub>.',
      hint: 'ω = 4：1/20 F → −j5、1 H → j4。用 V<sub>oc</sub> 和 I<sub>sc</sub>。',
      steps: [
        st('Step 1　換成阻抗。', '1/20 F → −j5 Ω；1 H → j4 Ω', 'ω = 4。'),
        st('Step 2　開路：兩個節點。', '節點 v<sub>o</sub>：(10 − V<sub>1</sub>)/2 = V<sub>1</sub>/(−j5) + (V<sub>1</sub> − V<sub>2</sub>)/4 + 0.5V<sub>1</sub>；節點 b：0.5V<sub>1</sub> + (V<sub>1</sub> − V<sub>2</sub>)/4 = V<sub>2</sub>/(j4)', '相依電流源從 v<sub>o</sub> 節點拉到 b 節點。'),
        st('Step 3　開路電壓。', 'V<sub>oc</sub> = V<sub>2</sub> = 11.89∠56.31° V', ''),
        st('Step 4　短路電流。', 'V<sub>2</sub> = 0 ⟹ I<sub>sc</sub> = 0.5V<sub>1</sub> + V<sub>1</sub>/4', ''),
        st('Step 5　Z<sub>Th</sub>。', 'Z<sub>Th</sub> = V<sub>oc</sub>/I<sub>sc</sub> = 1.670 + j3.648 Ω　⟹　Z<sub>L</sub> = 1.670 − j3.648 Ω', ''),
        st('Step 6　功率。', 'P = 11.89²/(8 × 1.670) = 10.57 W', '')
      ],
      ans: 'Z<sub>L</sub> = 1.670 − j3.648 Ω；P ≈ 10.57 W' },

    { id: 'p11-17', sec: '11.3', kind: 'pp', tag: 'Problem 11.17', title: '電橋裡的 Z<sub>L</sub>', fig: F.f1148, cap: '圖 11.48（重畫）',
      q: '求圖 11.48 中使 Z<sub>L</sub> 得到最大平均功率的 Z<sub>L</sub>，以及 Z<sub>L</sub> 收到的最大平均功率。',
      en: 'Calculate the value of Z<sub>L</sub> in the circuit of Fig. 11.48 in order for Z<sub>L</sub> to receive maximum average power. What is the maximum average power received by Z<sub>L</sub>?',
      hint: '電流源開路後，從 Z<sub>L</sub> 兩端看進去是兩條路並聯：(−j10 + 30) 和 (40 + j20)。',
      steps: [
        st('Step 1　電流源開路。', '左→上→右：−j10 + 30；左→下→右：40 + j20', '電流源拿掉後，上、下兩個節點只靠橋臂相連。'),
        st('Step 2　Z<sub>Th</sub>。', 'Z<sub>Th</sub> = (30 − j10) ∥ (40 + j20) = 20.6 + j4.2 Ω', ''),
        st('Step 3　V<sub>Th</sub>：節點分析（下節點接地）。', 'V<sub>Th</sub> = V<sub>左</sub> − V<sub>右</sub> = 70.71∠81.87° V', '電流源 5∠90° A 從下往上打進上節點。'),
        st('Step 4　Z<sub>L</sub> 與 P<sub>max</sub>。', 'Z<sub>L</sub> = 20.6 − j4.2 Ω；P<sub>max</sub> = 70.71²/(8 × 20.6) = 30.34 W', '')
      ],
      ans: 'Z<sub>L</sub> = 20.6 − j4.2 Ω；P<sub>max</sub> ≈ 30.34 W' },

    { id: 'p11-18', sec: '11.3', kind: 'pp', tag: 'Problem 11.18', title: '兩個獨立源，只要 Z<sub>L</sub>', fig: F.f1149, cap: '圖 11.49（重畫）',
      q: '求圖 11.49 中使 Z<sub>L</sub> 得到最大功率的 Z<sub>L</sub>。',
      en: 'Find the value of Z<sub>L</sub> in the circuit of Fig. 11.49 for maximum power transfer.',
      hint: '只問 Z<sub>L</sub>，所以只要 Z<sub>Th</sub>：電壓源短路（上節點 = 中間節點）、電流源開路。',
      steps: [
        st('Step 1　電壓源短路。', '上面那條線和中間節點變成同一點 X', ''),
        st('Step 2　Z<sub>L</sub> 上端到 X。', '80 ∥ (−j10) = 1.231 − j9.846 Ω', '−j10 接到上線、80 Ω 接到中間點，兩個都到 X。'),
        st('Step 3　X 到地。', '40 ∥ 40 = 20 Ω（都到左邊節點），再串 j30 Ω 到地', '兩個 40 Ω 一個從上線、一個從中間點，都到左中節點。電流源開路不算。'),
        st('Step 4　Z<sub>Th</sub>。', 'Z<sub>Th</sub> = 1.231 − j9.846 + 20 + j30 = 21.23 + j20.15 Ω', ''),
        st('Step 5　Z<sub>L</sub>。', 'Z<sub>L</sub> = Z<sub>Th</sub>* = 21.23 − j20.15 Ω', '')
      ],
      ans: 'Z<sub>L</sub> = 21.23 − j20.15 Ω' },

    { id: 'p11-19', sec: '11.3', kind: 'pp', tag: 'Problem 11.19', title: '負載只能是電阻 R', fig: F.f1150, cap: '圖 11.50（重畫）',
      q: '調整圖 11.50 的可變電阻 R 直到它吸收最大平均功率。求 R 與最大平均功率。',
      en: 'The variable resistor R in the circuit of Fig. 11.50 is adjusted until it absorbs the maximum average power. Find R and the maximum average power absorbed.',
      hint: '負載只能是電阻時，R = |Z<sub>Th</sub>|（不是 R<sub>Th</sub>），功率要用實際電流算，不能套 |V|²/8R。',
      steps: [
        st('Step 1　Z<sub>Th</sub>。', 'Z<sub>Th</sub> = −j2 + [6 ∥ (3 + j1)] = −j2 + (2.049 + j0.439) = 2.049 − j1.561 Ω', '電流源開路。'),
        st('Step 2　V<sub>Th</sub>。', 'V<sub>Th</sub> = 33 × [6 ∥ (3 + j1)] = 69.14∠12.09° V', 'R 拿掉後 −j2 沒電流，V<sub>Th</sub> 就是電流源那點的電壓。'),
        st('Step 3　R。', 'R = |Z<sub>Th</sub>| = √(2.049² + 1.561²) = 2.576 Ω', ''),
        st('Step 4　電流。', 'I = V<sub>Th</sub>/(Z<sub>Th</sub> + R) = 69.14∠12.09° / (4.625 − j1.561) = 14.17∠30.75° A', ''),
        st('Step 5　功率。', 'P = ½ × 14.17² × 2.576 = 258.5 W', '')
      ],
      ans: 'R = 2.576 Ω；P<sub>max</sub> ≈ 258.5 W' },

    { id: 'p11-20', sec: '11.3', kind: 'pp', tag: 'Problem 11.20', title: '相依電壓源＋可變 R<sub>L</sub>', fig: F.f1151, cap: '圖 11.51（重畫）',
      q: '調整圖 11.51 的負載電阻 R<sub>L</sub> 直到它吸收最大平均功率，求 R<sub>L</sub> 與最大平均功率。',
      en: 'The load resistance R<sub>L</sub> in Fig. 11.51 is adjusted until it absorbs the maximum average power. Calculate the value of R<sub>L</sub> and the maximum average power.',
      hint: '有相依源：用 V<sub>oc</sub>/I<sub>sc</sub> 求 Z<sub>Th</sub>，再 R<sub>L</sub> = |Z<sub>Th</sub>|。',
      steps: [
        st('Step 1　開路。', 'I<sub>o</sub> = (165 − V<sub>A</sub>)/40；V<sub>A</sub> − V<sub>B</sub> = 4I<sub>o</sub>；I<sub>o</sub> = V<sub>A</sub>/(j20) + V<sub>A</sub>/(−j10) + V<sub>B</sub>/(−j10)', '相依源兩邊是超節點。'),
        st('Step 2　開路電壓。', 'V<sub>oc</sub> = V<sub>B</sub> = 25.98∠−92.43° V', ''),
        st('Step 3　短路（V<sub>B</sub> = 0）。', 'V<sub>A</sub> = 4I<sub>o</sub>，I<sub>o</sub> = 165/44 = 3.75 A；I<sub>sc</sub> = I<sub>o</sub> − V<sub>A</sub>/(j20) − V<sub>A</sub>/(−j10)', ''),
        st('Step 4　Z<sub>Th</sub> 與 R<sub>L</sub>。', 'Z<sub>Th</sub> = V<sub>oc</sub>/I<sub>sc</sub> = 1.049 − j6.711 Ω；R<sub>L</sub> = |Z<sub>Th</sub>| = 6.793 Ω', ''),
        st('Step 5　功率。', 'I = V<sub>oc</sub>/(Z<sub>Th</sub> + R<sub>L</sub>)，P = ½|I|²R<sub>L</sub> = 21.51 W', '')
      ],
      ans: 'R<sub>L</sub> ≈ 6.793 Ω；P<sub>max</sub> ≈ 21.51 W' },

    { id: 'p11-21', sec: '11.3', kind: 'pp', tag: 'Problem 11.21', title: '純電阻負載接在 a-b', fig: F.f1152, cap: '圖 11.52（重畫）',
      q: '若負載只能是純電阻，圖 11.52 的 a-b 端應接多大的負載，才能得到最大功率？',
      en: 'Assuming that the load impedance is to be purely resistive, what load should be connected to terminals a-b of the circuits in Fig. 11.52 so that the maximum power is transferred to the load?',
      hint: '純電阻負載：R<sub>L</sub> = |Z<sub>Th</sub>|。只要 Z<sub>Th</sub>，電源全部關掉。',
      steps: [
        st('Step 1　電壓源短路、電流源開路。', '100 ∥ (40 + j30) = 31.71 + j14.63 Ω', '100 Ω 左端接地。'),
        st('Step 2　串 −j10。', '31.71 + j4.634 Ω', ''),
        st('Step 3　並 50 Ω。', 'Z<sub>Th</sub> = 50 ∥ (31.71 + j4.634) = 19.50 + j1.730 Ω', ''),
        st('Step 4　R<sub>L</sub>。', 'R<sub>L</sub> = |Z<sub>Th</sub>| = 19.58 Ω', '')
      ],
      ans: 'R<sub>L</sub> = |Z<sub>Th</sub>| ≈ 19.58 Ω' }
  ];

  window.__CH11PB = window.__CH11PB || { book: 'Alexander & Sadiku', items: [] };
  window.__CH11PB.items = window.__CH11PB.items.concat(items);
})();
