/* ============================================================
   電路學 CH12 章末練習題（2/2）：Section 12.7、12.8、12.10 ＋ Comprehensive（Problem 12.30～12.87）
   跳過：e⁷d 12.32、12.53、12.56、12.62、12.67、12.76、12.85；ML 12.51；小筆電 12.29、12.35、12.38、12.39、12.40、12.43、12.44、12.48；
         Section 12.9（PSpice，整節標小筆電）12.58～12.65
   rms 值。數值全部用程式驗算。
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, PB = window.__CH12PB, tp = PB.tp, G = PB.G, vsh = PB.vsh;
  const st = (t, eq, why) => ({ t, eq, why });
  const it = (no, sec, title, o) => Object.assign({ id: 'p12-' + no, sec, kind: 'pp', tag: 'Problem 12.' + no, title }, o);
  const term3 = (ys) => ys.map(y => S.term(20, y)).join('');

  const F = {
    f1244: tp({ src: 'Y', sl: ['240∠0° V', '240∠−120° V', '240∠120° V'], load: 'D', ll: ['2 − j3 Ω', '2 − j3 Ω', '2 − j3 Ω'] }),
    f1256: tp({ src: 'Y', sl: ['V_a', 'V_b', 'V_c'], load: 'Y', ll: ['30∠45° Ω', '30∠45° Ω', '30∠45° Ω'] }),
    f1264: tp({ src: 'Y', sl: ['110∠0° V', '110∠−120° V', '110∠120° V'], load: 'Y', ll: ['80 + j50 Ω', '20 + j30 Ω', '60 − j40 Ω'], cur: true }),
    f1262: G(330, 215, 0, 15, [term3([30, 100, 170]), S.w('20,30', '150,30'), S.w('20,100', '150,100'), S.w('20,170', '150,170'),
      S.z(150, 30, 150, 100, 'j25 Ω', { side: 'r' }), S.z(150, 100, 150, 170, '30∠30° Ω', { side: 'r' }), S.w('150,30', '260,30'), S.w('150,170', '260,170'), S.z(260, 30, 260, 170, '40 Ω', { side: 'r' }),
      S.t(150, 22, 'A', 'middle'), S.t(140, 104, 'B', 'end'), S.t(150, 188, 'C', 'middle'), S.dot(150, 30), S.dot(150, 100), S.dot(150, 170)]),
    f1271: G(380, 250, 0, 15, [term3([30, 100, 170, 220]), S.t(12, 224, '中性', 'end', ' font-size="10.5"'),
      S.wm(20, 30, 120, 220), S.wm(20, 100, 120, 220), S.wm(20, 170, 120, 220), S.w('120,30', '250,30'), S.w('120,100', '250,100'), S.w('120,170', '250,170'), S.w('20,220', '320,220', '320,100'),
      S.t(160, 22, 'I_1 →', 'middle', ' font-size="10.5"'), S.t(160, 92, 'I_2 →', 'middle', ' font-size="10.5"'), S.t(160, 162, 'I_3 →', 'middle', ' font-size="10.5"'), S.t(160, 212, 'I_n →', 'middle', ' font-size="10.5"'),
      S.r(250, 30, 320, 100, ''), S.r(250, 100, 320, 100, ''), S.r(250, 170, 320, 100, ''), S.t(296, 56, '48 Ω', 'start', ' font-size="11"'), S.t(285, 90, '40 Ω', 'middle', ' font-size="11"'), S.t(296, 150, '60 Ω', 'start', ' font-size="11"'),
      S.dot(320, 100), S.t(328, 96, 'n', 'start'), S.t(70, 14, 'W_1', 'middle', ' font-size="10.5"'), S.t(70, 84, 'W_2', 'middle', ' font-size="10.5"'), S.t(70, 154, 'W_3', 'middle', ' font-size="10.5"')]),
    f1273: G(380, 220, 0, 15, [term3([30, 100, 170]), S.t(12, 34, 'a', 'end'), S.t(12, 104, 'b', 'end'), S.t(12, 174, 'c', 'end'),
      S.wm(20, 30, 120, 100), S.wm(20, 170, 120, 100), S.w('20,100', '200,100'), S.w('120,30', '200,30'), S.w('120,170', '200,170'),
      S.z(200, 30, 200, 100, '20 Ω', { side: 'r' }), S.z(200, 100, 200, 170, '10 − j10 Ω', { side: 'r' }), S.w('200,30', '300,30'), S.w('200,170', '300,170'), S.z(300, 30, 300, 170, '12 + j5 Ω', { side: 'r' }),
      S.t(200, 22, 'A', 'middle'), S.t(190, 112, 'B', 'end'), S.t(200, 188, 'C', 'middle'), S.t(70, 14, 'W_1', 'middle', ' font-size="10.5"'), S.t(70, 194, 'W_2', 'middle', ' font-size="10.5"'), S.dot(200, 100), S.dot(70, 100)]),
    f1274: G(430, 222, 60, 15, [S.vs(20, 30, 100, '240∠−60° V'), S.vs(20, 100, 170, '240∠−120° V', { flip: true }), S.gnd(20, 100),
      S.wm(20, 30, 120, 100), S.wm(20, 170, 120, 100), S.w('20,100', '240,100'), S.w('120,30', '320,30'), S.w('120,170', '320,170'),
      S.z(240, 30, 240, 100, 'Z', { side: 'r' }), S.z(240, 100, 240, 170, 'Z', { side: 'r' }), S.z(320, 30, 320, 170, 'Z = 10 + j30 Ω', { side: 'r' }),
      S.t(70, 14, 'W_1', 'middle', ' font-size="10.5"'), S.t(70, 194, 'W_2', 'middle', ' font-size="10.5"'), S.dot(240, 100), S.dot(70, 100), S.dot(240, 30), S.dot(240, 170)]),
    f1275: G(380, 222, 60, 15, [S.vs(20, 30, 100, '208∠0° V'), S.vs(20, 100, 170, '208∠−60° V', { flip: true }),
      S.wm(20, 30, 120, 100), S.wm(20, 170, 120, 100), S.w('20,100', '210,100'), S.w('120,30', '210,30'), S.w('120,170', '210,170'),
      S.z(210, 30, 300, 30, 'Z'), S.z(210, 100, 300, 100, 'Z'), S.z(210, 170, 300, 170, 'Z = 60 − j30 Ω', { side: 'b' }), S.w('300,30', '300,170'), S.dot(300, 100), S.t(306, 104, 'N', 'start'),
      S.t(70, 14, 'W_1', 'middle', ' font-size="10.5"'), S.t(70, 194, 'W_2', 'middle', ' font-size="10.5"'), S.dot(70, 100)]),
    f1276: G(380, 225, 0, 10, [term3([25, 75, 125, 175]), ['a', 'b', 'c', 'd'].map((s, i) => S.t(12, 29 + 50 * i, s, 'end')).join(''),
      S.w('20,25', '260,25'), S.w('20,75', '260,75'), S.w('20,125', '260,125'), S.w('20,175', '120,175'),
      S.c(150, 25, 150, 75, '1.8 kVAR', { side: 'r' }), S.box(260, 15, 90, 120, ['馬達負載', '4 kVA', 'pf = 0.72', '落後']),
      S.w('90,125', '90,145'), S.box(70, 145, 40, 30, ['燈']), S.t(90, 200, '800 W 照明（c 對中性線）', 'middle', ' font-size="10.5"'), S.w('90,175', '120,175'),
      ['I_a →', 'I_b →', 'I_c →', 'I_n →'].map((s, i) => S.t(50, 18 + 50 * i, s, 'middle', ' font-size="10.5"')).join(''), S.dot(150, 25), S.dot(150, 75), S.dot(90, 125)]),
    f1277: G(360, 215, 55, 15, [S.vs(20, 30, 100, '120∠0° V rms'), S.vs(20, 100, 170, '120∠0° V rms'), S.r(20, 30, 140, 30, '1 Ω'), S.r(20, 100, 140, 100, '1 Ω'), S.r(20, 170, 140, 170, '1 Ω', { side: 'b' }),
      S.z(140, 30, 140, 100, '24 − j2 Ω', { side: 'r' }), S.z(140, 100, 140, 170, '15 + j4 Ω', { side: 'r' }),
      S.t(10, 26, 'a', 'end'), S.t(10, 104, 'n', 'end'), S.t(10, 178, 'b', 'end'), S.t(148, 22, 'A', 'start'), S.t(148, 112, 'N', 'start'), S.t(148, 188, 'B', 'start'), S.dot(140, 100), S.dot(20, 100)]),
    f1278: G(360, 215, 30, 15, [S.vs(20, 30, 100, 'V_s'), S.vs(20, 100, 170, 'V_s'), S.r(20, 30, 140, 30, '1 Ω'), S.r(20, 100, 140, 100, '2 Ω'), S.r(20, 170, 140, 170, '1 Ω', { side: 'b' }),
      S.r(140, 30, 140, 100, '20 Ω', { side: 'r' }), S.r(140, 100, 140, 170, '30 Ω', { side: 'r' }), S.w('140,30', '230,30'), S.w('140,170', '230,170'),
      S.r(230, 30, 230, 100, '15 Ω', { side: 'r' }), S.l(230, 100, 230, 170, '50 mH', { side: 'r' }), S.dot(140, 100), S.dot(20, 100), S.dot(140, 30), S.dot(140, 170)])
  };

  const items = [
    /* ═══════════ 12.7 平衡系統的功率 ═══════════ */
    it(30, '12.7', 'Y-Y 負載的平均功率', { fig: F.f1256, cap: '圖 12.56（重畫）',
      q: '圖 12.56 中線電壓 rms 值為 208 V，求送到負載的平均功率。',
      en: 'In Fig. 12.56, the rms value of the line voltage is 208 V. Find the average power delivered to the load.',
      hint: 'V<sub>p</sub> = 208/√3；P = 3 V<sub>p</sub>I<sub>p</sub> cos θ。',
      steps: [
        st('Step 1　相電壓與電流。', 'V<sub>p</sub> = 120.1 V；I<sub>p</sub> = 120.1/30 = 4.003 A', ''),
        st('Step 2　功率。', 'P = 3 × 120.1 × 4.003 × cos 45° = 1019.7 W', '或 √3 V<sub>L</sub>I<sub>L</sub> cos θ，一樣。')
      ],
      ans: 'P ≈ 1.020 kW' }),
    it(31, '12.7', 'Δ 負載：Z、I<sub>L</sub>、補償電容', {
      q: '平衡 Δ 接負載由線電壓 240 V、60 Hz 的三相電源供電。每相吸收 6 kW、pf 0.8 落後。求：(a) 每相負載阻抗　(b) 線電流　(c) 每相要並聯多大的電容，才能讓電源電流最小',
      en: 'A balanced delta-connected load is supplied by a 60-Hz three-phase source with a line voltage of 240 V. Each load phase draws 6 kW at a lagging power factor of 0.8. Find: (a) the load impedance per phase (b) the line current (c) the value of capacitance needed to be connected in parallel with each load phase to minimize the current from the source',
      hint: 'Δ：每相電壓就是 240 V。電流最小 ⟺ pf = 1，電容要抵掉每相的 Q。',
      steps: [
        st('Step 1　每相。', '|S<sub>p</sub>| = 6/0.8 = 7.5 kVA；Q<sub>p</sub> = 4.5 kVAR；I<sub>p</sub> = 7500/240 = 31.25 A', ''),
        st('Step 2　(a) Z<sub>p</sub>。', 'Z<sub>p</sub> = 240/31.25 ∠36.87° = 7.68∠36.87° = 6.144 + j4.608 Ω', ''),
        st('Step 3　(b) I<sub>L</sub>。', 'I<sub>L</sub> = √3 × 31.25 = 54.13 A', ''),
        st('Step 4　(c) 電容。', 'C = Q<sub>p</sub>/(ωV<sub>p</sub>²) = 4500/(377 × 240²) = 207.2 μF', '')
      ],
      ans: '(a) 6.144 + j4.608 Ω　(b) 54.13 A　(c) 207.2 μF（每相）' }),
    it(33, '12.7', '由 kVA 求線電流與線電壓', {
      q: '三相電源送 4.8 kVA 給相電壓 208 V、pf 0.9 落後的 Y 接負載。計算電源線電流與電源線電壓。',
      en: 'A three-phase source delivers 4.8 kVA to a wye-connected load with a phase voltage of 208 V and a power factor of 0.9 lagging. Calculate the source line current and the source line voltage.',
      hint: '|S| = 3V<sub>p</sub>I<sub>p</sub>；Y 接 I<sub>L</sub> = I<sub>p</sub>、V<sub>L</sub> = √3V<sub>p</sub>。',
      steps: [
        st('Step 1　線電流。', 'I<sub>L</sub> = 4800/(3 × 208) = 7.692 A', 'pf 不影響視在功率的計算。'),
        st('Step 2　線電壓。', 'V<sub>L</sub> = √3 × 208 = 360.3 V', '')
      ],
      ans: 'I<sub>L</sub> ≈ 7.692 A；V<sub>L</sub> ≈ 360.3 V' }),
    it(34, '12.7', 'Y 負載的線電流與複功率', {
      q: '每相阻抗 10 − j16 Ω 的平衡 Y 接負載，接到線電壓 220 V 的平衡三相發電機。求線電流與負載吸收的複功率。',
      en: 'A balanced wye-connected load with a phase impedance of 10 − j16 Ω is connected to a balanced three-phase generator with a line voltage of 220 V. Determine the line current and the complex power absorbed by the load.',
      hint: 'V<sub>p</sub> = 220/√3；S = 3|I|²Z。',
      steps: [
        st('Step 1　線電流。', 'I<sub>L</sub> = 127.0 / |10 − j16| = 127.0/18.87 = 6.732 A', ''),
        st('Step 2　複功率。', 'S = 3 × 6.732² × (10 − j16) = 1359.6 − j2175.3 VA', '電容性負載，Q &lt; 0。')
      ],
      ans: 'I<sub>L</sub> ≈ 6.732 A；S ≈ 1.360 − j2.175 kVA' }),
    it(36, '12.7', '4200 V 輸電線：損失與送端電壓', {
      q: '4200 V 三相輸電線每相阻抗 4 + j Ω。若供應 1 MVA、pf 0.75（落後）的負載，求：(a) 複功率　(b) 線路的功率損失　(c) 送端電壓',
      en: 'A 4200-V, three-phase transmission line has an impedance of 4 + j Ω per phase. If it supplies a load of 1 MVA at 0.75 power factor (lagging), find: (a) the complex power (b) the power loss in the line (c) the voltage at the sending end',
      hint: '4200 V 當成負載端線電壓。I<sub>L</sub> = |S|/(√3V<sub>L</sub>)；送端相電壓 = 負載相電壓 + I × Z<sub>line</sub>。',
      steps: [
        st('Step 1　(a)', 'S = 1∠41.41° MVA = 750 + j661.4 kVA', ''),
        st('Step 2　線電流。', 'I<sub>L</sub> = 10<sup>6</sup>/(√3 × 4200) = 137.5 A', ''),
        st('Step 3　(b) 損失。', 'P<sub>loss</sub> = 3 × 137.5² × 4 = 226.8 kW', '一相 4 Ω，三相都要算。'),
        st('Step 4　(c) 送端。', 'V<sub>s,p</sub> = 2424.9 + 137.5∠−41.41° × (4 + j1) = 2940∠−5.09° V；V<sub>s,L</sub> = √3 × 2940 = 5092 V', '')
      ],
      ans: '(a) 750 + j661.4 kVA　(b) 226.8 kW　(c) 送端線電壓 ≈ 5.09 kV', note: '題目沒說 4200 V 是送端還是負載端，這裡當成負載端。' }),
    it(37, '12.7', '超前 pf 的 Y 負載', {
      q: '平衡 Y 接負載的三相系統，總功率 12 kW、pf 0.6 超前。若線電壓 208 V，求線電流 I<sub>L</sub> 與負載阻抗 Z<sub>Y</sub>。',
      en: 'The total power measured in a three-phase system feeding a balanced wye-connected load is 12 kW at a power factor of 0.6 leading. If the line voltage is 208 V, calculate the line current I<sub>L</sub> and the load impedance Z<sub>Y</sub>.',
      hint: 'P = √3V<sub>L</sub>I<sub>L</sub> pf；|Z<sub>Y</sub>| = V<sub>p</sub>/I<sub>L</sub>，角度 −53.13°（超前）。',
      steps: [
        st('Step 1　線電流。', 'I<sub>L</sub> = 12000/(√3 × 208 × 0.6) = 55.51 A', ''),
        st('Step 2　阻抗。', '|Z<sub>Y</sub>| = 120.1/55.51 = 2.163 Ω；Z<sub>Y</sub> = 2.163∠−53.13° = 1.298 − j1.731 Ω', '')
      ],
      ans: 'I<sub>L</sub> ≈ 55.51 A；Z<sub>Y</sub> ≈ 1.298 − j1.731 Ω' }),
    it(41, '12.7', 'Δ 負載的線電流', {
      q: '平衡 Δ 接負載吸取 5 kW、pf 0.8 落後。若三相系統的有效線電壓為 400 V，求線電流。',
      en: 'A balanced delta-connected load draws 5 kW at a power factor of 0.8 lagging. If the three-phase system has an effective line voltage of 400 V, find the line current.',
      hint: 'P = √3V<sub>L</sub>I<sub>L</sub> cos θ（Y、Δ 都一樣）。',
      steps: [st('Step 1', 'I<sub>L</sub> = 5000/(√3 × 400 × 0.8) = 9.021 A', '')],
      ans: 'I<sub>L</sub> ≈ 9.021 A' }),
    it(42, '12.7', '由功率求 I<sub>L</sub> 與 V<sub>L</sub>', {
      q: '平衡三相發電機送 7.2 kW 給每相 30 − j40 Ω 的 Y 接負載。求線電流 I<sub>L</sub> 與線電壓 V<sub>L</sub>。',
      en: 'A balanced three-phase generator delivers 7.2 kW to a wye-connected load with impedance 30 − j40 Ω per phase. Find the line current I<sub>L</sub> and the line voltage V<sub>L</sub>.',
      hint: '只有電阻吃功率：P = 3I²R。',
      steps: [
        st('Step 1　電流。', '7200 = 3I² × 30 ⟹ I<sub>L</sub> = √80 = 8.944 A', ''),
        st('Step 2　電壓。', 'V<sub>p</sub> = 8.944 × |30 − j40| = 8.944 × 50 = 447.2 V；V<sub>L</sub> = √3 × 447.2 = 774.6 V', '')
      ],
      ans: 'I<sub>L</sub> ≈ 8.944 A；V<sub>L</sub> ≈ 774.6 V' }),
    it(45, '12.7', '線路壓降：求發電機端線電壓', {
      q: '平衡 Y 接負載經每相 0.5 + j2 Ω 的平衡輸電線接到發電機。負載額定 450 kW、pf 0.708 落後、線電壓 440 V，求發電機端的線電壓。',
      en: 'A balanced wye-connected load is connected to the generator by a balanced transmission line with an impedance of 0.5 + j2 Ω per phase. If the load is rated at 450 kW, 0.708 power factor lagging, 440-V line voltage, find the line voltage at the generator.',
      hint: '負載相電壓 254∠0°，I = P/(√3V<sub>L</sub>pf) ∠−44.92°；發電機相電壓 = 負載相電壓 + I × Z<sub>line</sub>。',
      steps: [
        st('Step 1　線電流。', 'I<sub>L</sub> = 450000/(√3 × 440 × 0.708) = 834.0 A，角度 −44.92°', ''),
        st('Step 2　發電機相電壓。', 'V<sub>g,p</sub> = 254.0 + 834∠−44.92° × (0.5 + j2) = 1941∠27.17° V', '線路壓降 834 × 2.06 ≈ 1.7 kV，非常大。'),
        st('Step 3　線電壓。', 'V<sub>g,L</sub> = √3 × 1941 = 3363 V', '')
      ],
      ans: '發電機端線電壓 ≈ 3.36 kV' }),
    it(46, '12.7', '同樣三個電阻：Y 接還是 Δ 接吃比較多？', {
      q: '三相負載由三個 100 Ω 電阻組成，可接成 Y 或 Δ。接到線電壓 110 V 的三相電源，哪一種接法吸收的平均功率最多？（線路阻抗為零）',
      en: 'A three-phase load consists of three 100-Ω resistors that can be wye- or delta-connected. Determine which connection will absorb the most average power from a three-phase source with a line voltage of 110 V. Assume zero line impedance.',
      hint: 'Y 接每個電阻吃相電壓 V<sub>L</sub>/√3；Δ 接吃線電壓。',
      steps: [
        st('Step 1　Y 接。', 'P = 3 × (110/√3)²/100 = 121 W', ''),
        st('Step 2　Δ 接。', 'P = 3 × 110²/100 = 363 W', '電壓大 √3 倍 → 功率大 3 倍。')
      ],
      ans: 'Δ 接吸收較多：363 W（Y 接只有 121 W）' }),
    it(47, '12.7', '三個並聯負載的線電流與 pf', {
      q: '下列三個並聯的三相負載由平衡三相電源供電：負載 1：250 kVA、pf 0.8 落後；負載 2：300 kVA、pf 0.95 超前；負載 3：450 kVA、pf = 1。若線電壓 13.8 kV，求線電流與電源的功率因數。線路阻抗為零。',
      en: 'The following three parallel-connected three-phase loads are fed by a balanced three-phase source: Load 1: 250 kVA, 0.8 pf lagging; Load 2: 300 kVA, 0.95 pf leading; Load 3: 450 kVA, unity pf. If the line voltage is 13.8 kV, calculate the line current and the power factor of the source. Assume that the line impedance is zero.',
      hint: '複功率相加，I<sub>L</sub> = |S|/(√3V<sub>L</sub>)。',
      steps: [
        st('Step 1　各負載。', 'S<sub>1</sub> = 200 + j150；S<sub>2</sub> = 285 − j93.67；S<sub>3</sub> = 450（kVA）', ''),
        st('Step 2　總和。', 'S = 935 + j56.33 kVA；|S| = 936.7 kVA', ''),
        st('Step 3　答案。', 'I<sub>L</sub> = 936.7k/(√3 × 13.8k) = 39.19 A；pf = 935/936.7 = 0.9982（落後）', '')
      ],
      ans: 'I<sub>L</sub> ≈ 39.19 A；pf ≈ 0.9982 落後' }),
    it(49, '12.7', '20 Ω＋j10 Ω：Δ 接與 Y 接的功率', {
      q: '每相負載由 20 Ω 電阻與 10 Ω 感抗組成。線電壓 220 V rms，求負載吸收的平均功率：(a) 三相負載接成 Δ　(b) 接成 Y',
      en: 'Each phase load consists of a 20-Ω resistor and a 10-Ω inductive reactance. With a line voltage of 220 V rms, calculate the average power taken by the load if: (a) the three-phase loads are delta-connected (b) the loads are wye-connected',
      hint: '|Z|² = 500。P = 3 V<sub>p</sub>² R/|Z|²。',
      steps: [
        st('(a) Δ 接。', 'P = 3 × 220² × 20/500 = 5808 W', ''),
        st('(b) Y 接。', 'P = 3 × 127.0² × 20/500 = 1936 W', '剛好是 Δ 的 1/3。')
      ],
      ans: '(a) 5.808 kW　(b) 1.936 kW', note: '題目沒說串聯或並聯，這裡當成 20 Ω 與 j10 Ω 串聯（Z = 20 + j10）。' }),
    it(50, '12.7', '兩個並聯 Y 負載：求第二個的阻抗', {
      q: 'V<sub>L</sub> = 240 V rms 的平衡三相電源供應 8 kVA、pf 0.6 落後給兩個並聯的 Y 接負載。其中一個吸收 3 kW、pf = 1，求第二個負載每相的阻抗。',
      en: 'A balanced three-phase source with V<sub>L</sub> = 240 V rms is supplying 8 kVA at 0.6 power factor lagging to two wye-connected parallel loads. If one load draws 3 kW at unity power factor, calculate the impedance per phase of the second load.',
      hint: 'S<sub>2</sub> = S<sub>總</sub> − S<sub>1</sub>，除以 3 得每相，再 Z = V<sub>p</sub>²/S*。',
      steps: [
        st('Step 1　總和。', 'S = 8∠53.13° = 4.8 + j6.4 kVA', ''),
        st('Step 2　第二個負載（三相）。', 'S<sub>2</sub> = 1.8 + j6.4 kVA ⟹ 每相 0.6 + j2.133 kVA', ''),
        st('Step 3　阻抗。', 'Z<sub>2</sub> = 138.6²/(600 − j2133) = 2.346 + j8.34 Ω', '')
      ],
      ans: 'Z<sub>2</sub> ≈ 2.346 + j8.34 Ω（每相）' }),

    /* ═══════════ 12.8 不平衡三相 ═══════════ */
    it(52, '12.8', '不平衡四線式：中性線電流', {
      q: '四線式 Y-Y 電路 V<sub>an</sub> = 120∠120°、V<sub>bn</sub> = 120∠0°、V<sub>cn</sub> = 120∠−120° V，阻抗 Z<sub>AN</sub> = 20∠60°、Z<sub>BN</sub> = 30∠0°、Z<sub>CN</sub> = 40∠30° Ω。求中性線電流。',
      en: 'A four-wire wye-wye circuit has V<sub>an</sub> = 120∠120°, V<sub>bn</sub> = 120∠0°, V<sub>cn</sub> = 120∠−120° V. If the impedances are Z<sub>AN</sub> = 20∠60°, Z<sub>BN</sub> = 30∠0°, Z<sub>CN</sub> = 40∠30° Ω, find the current in the neutral line.',
      hint: '有中性線：每相各自 I = V/Z，中性線電流 = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>)。',
      steps: [
        st('Step 1　各相。', 'I<sub>a</sub> = 6∠60°、I<sub>b</sub> = 4∠0°、I<sub>c</sub> = 3∠−150° A', ''),
        st('Step 2　中性線。', 'I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>) = 5.748∠−139.98° A', '方向：從 n 流到 N（電源往負載）。')
      ],
      ans: '|I<sub>n</sub>| ≈ 5.748 A（I<sub>n</sub> = 5.748∠−139.98° A）' }),
    it(54, '12.8', '不平衡 Y 負載（有中性線）', {
      q: 'V<sub>P</sub> = 210 V rms 的平衡三相 Y 電源驅動 Y 接負載，Z<sub>A</sub> = 80 Ω、Z<sub>B</sub> = 60 + j90 Ω、Z<sub>C</sub> = j80 Ω。中性點相連，求線電流與送到負載的總複功率。',
      en: 'A balanced three-phase Y-source with V<sub>P</sub> = 210 V rms drives a Y-connected three-phase load with phase impedance Z<sub>A</sub> = 80 Ω, Z<sub>B</sub> = 60 + j90 Ω, and Z<sub>C</sub> = j80 Ω. Calculate the line currents and total complex power delivered to the load. Assume that the neutrals are connected.',
      hint: '中性點相連：每相直接 V/Z；S = Σ |V|²/Z*。',
      steps: [
        st('Step 1　線電流。', 'I<sub>a</sub> = 210/80 = 2.625∠0°；I<sub>b</sub> = 210∠−120°/108.2∠56.31° = 1.941∠−176.31°；I<sub>c</sub> = 210∠120°/80∠90° = 2.625∠30° A', '取 V<sub>an</sub> = 210∠0°。'),
        st('Step 2　複功率。', 'S = 551.3 + (226.1 + j339.2) + j551.3 = 777.4 + j890.5 VA', '')
      ],
      ans: 'I<sub>a</sub> = 2.625∠0°、I<sub>b</sub> = 1.941∠−176.31°、I<sub>c</sub> = 2.625∠30° A；S ≈ 777.4 + j890.5 VA' }),
    it(55, '12.8', '不平衡 Δ 負載', { fig: F.f1262, cap: '圖 12.62（重畫）',
      q: '線電壓 240 V rms、正相序的三相電源，接到圖 12.62 的不平衡 Δ 負載。求相電流與送到負載的總複功率。',
      en: 'A three-phase supply, with the line voltage 240 V rms positively phased, has an unbalanced delta-connected load as shown in Fig. 12.62. Find the phase currents and the total complex power delivered to the load.',
      hint: 'Δ 每一相直接跨在線電壓上，各算各的：V<sub>AB</sub> = 240∠0°、V<sub>BC</sub> = 240∠−120°、V<sub>CA</sub> = 240∠120°。',
      steps: [
        st('Step 1　相電流。', 'I<sub>AB</sub> = 240/j25 = 9.6∠−90°；I<sub>BC</sub> = 240∠−120°/30∠30° = 8∠−150°；I<sub>CA</sub> = 240∠120°/40 = 6∠120° A', ''),
        st('Step 2　複功率。', 'S = j2304 + (1662.8 + j960) + 1440 = 3102.8 + j3264 VA', '每相 |V|²/Z*。')
      ],
      ans: 'I<sub>AB</sub> = 9.6∠−90°、I<sub>BC</sub> = 8∠−150°、I<sub>CA</sub> = 6∠120° A；S ≈ 3.103 + j3.264 kVA' }),
    it(57, '12.8', '不平衡 Y 負載（沒有中性線）', { fig: F.f1264, cap: '圖 12.64（重畫）',
      q: '求圖 12.64 三相電路的線電流。V<sub>a</sub> = 110∠0°、V<sub>b</sub> = 110∠−120°、V<sub>c</sub> = 110∠120° V。',
      en: 'Determine the line currents for the three-phase circuit of Fig. 12.64. Let V<sub>a</sub> = 110∠0°, V<sub>b</sub> = 110∠−120°, V<sub>c</sub> = 110∠120° V.',
      hint: '沒有中性線 → N 點電壓不是 0。先用節點分析（以 n 為參考）求 V<sub>N</sub>。',
      steps: [
        st('Step 1　N 點 KCL。', 'Σ (V<sub>k</sub> − V<sub>N</sub>)/Z<sub>k</sub> = 0 ⟹ V<sub>N</sub> = Σ(V<sub>k</sub>/Z<sub>k</sub>) / Σ(1/Z<sub>k</sub>)', '三條線的電流加起來要是 0。'),
        st('Step 2　V<sub>N</sub>。', 'V<sub>N</sub> = 82.35∠−147.37° V', '負載不平衡，中性點偏移了。'),
        st('Step 3　線電流。', 'I<sub>a</sub> = (110 − V<sub>N</sub>)/(80 + j50) = 1.959∠−18.10° A；I<sub>b</sub> = 1.466∠−130.55° A；I<sub>c</sub> = 1.947∠117.82° A', '驗算：三個加起來是 0。')
      ],
      ans: 'I<sub>a</sub> ≈ 1.959∠−18.10° A、I<sub>b</sub> ≈ 1.466∠−130.55° A、I<sub>c</sub> ≈ 1.947∠117.82° A' }),

    /* ═══════════ 12.10 應用 ═══════════ */
    it(66, '12.10', '三瓦特計法量 Y 電阻負載', { fig: F.f1271, cap: '圖 12.71（重畫）',
      q: '圖 12.71 是線電壓 208 V 的三相四線系統，電源平衡。Y 接電阻負載的功率用三瓦特計法量測。計算：(a) 對中性點的電壓　(b) 電流 I<sub>1</sub>、I<sub>2</sub>、I<sub>3</sub>、I<sub>n</sub>　(c) 瓦特計讀值　(d) 負載吸收的總功率',
      en: 'A three-phase, four-wire system operating with a 208-V line voltage is shown in Fig. 12.71. The source voltages are balanced. The power absorbed by the resistive wye-connected load is measured by the three-wattmeter method. Calculate: (a) the voltage to neutral (b) the currents I<sub>1</sub>, I<sub>2</sub>, I<sub>3</sub>, and I<sub>n</sub> (c) the readings of the wattmeters (d) the total power absorbed by the load',
      hint: '有中性線 → 每個電阻都吃 120.1 V。取 V<sub>1</sub> = 120.1∠0°、abc 相序。',
      steps: [
        st('(a)', 'V<sub>p</sub> = 208/√3 = 120.1 V', ''),
        st('(b)', 'I<sub>1</sub> = 120.1/48 = 2.502∠0°；I<sub>2</sub> = 120.1/40 = 3.002∠−120°；I<sub>3</sub> = 120.1/60 = 2.002∠120° A；I<sub>n</sub> = −(I<sub>1</sub> + I<sub>2</sub> + I<sub>3</sub>) = 0.867∠90° A', 'I<sub>n</sub> 照圖上箭頭（往負載）方向。'),
        st('(c)', 'W<sub>1</sub> = 120.1²/48 = 300.4 W；W<sub>2</sub> = 360.5 W；W<sub>3</sub> = 240.4 W', '純電阻，電壓電流同相。'),
        st('(d)', 'P = 901.3 W', '')
      ],
      ans: '(a) 120.1 V　(b) 2.502、3.002、2.002 A，I<sub>n</sub> ≈ 0.867 A　(c) 300.4、360.5、240.4 W　(d) 901.3 W' }),
    it(68, '12.10', '由儀表讀值求 VA、pf', {
      q: '供電給馬達的三相 Y 接交流發電機，儀表顯示線電壓 330 V、線電流 8.4 A、總線路功率 4.5 kW。求：(a) 負載 VA　(b) 負載 pf　(c) 相電流　(d) 相電壓',
      en: 'Meter readings for a three-phase wye-connected alternator supplying power to a motor indicate that the line voltages are 330 V, the line currents are 8.4 A, and the total line power is 4.5 kW. Find: (a) the load in VA (b) the load pf (c) the phase current (d) the phase voltage',
      hint: '|S| = √3V<sub>L</sub>I<sub>L</sub>；Y 接 I<sub>p</sub> = I<sub>L</sub>、V<sub>p</sub> = V<sub>L</sub>/√3。',
      steps: [
        st('(a)', '|S| = √3 × 330 × 8.4 = 4801 VA', ''),
        st('(b)', 'pf = 4500/4801 = 0.9372', ''),
        st('(c)(d)', 'I<sub>p</sub> = 8.4 A；V<sub>p</sub> = 330/√3 = 190.5 V', '')
      ],
      ans: '(a) 4.801 kVA　(b) 0.9372　(c) 8.4 A　(d) 190.5 V' }),
    it(69, '12.10', '商店的三個負載', {
      q: '某商店有三個平衡三相負載：負載 1：16 kVA、pf 0.85 落後；負載 2：12 kVA、pf 0.6 落後；負載 3：8 kW、pf = 1。負載端線電壓 208 V rms、60 Hz，線路阻抗 0.4 + j0.8 Ω。求線電流與送到負載的複功率。',
      en: 'A certain store contains three balanced three-phase loads. The three loads are: Load 1: 16 kVA at 0.85 pf lagging; Load 2: 12 kVA at 0.6 pf lagging; Load 3: 8 kW at unity pf. The line voltage at the load is 208 V rms at 60 Hz, and the line impedance is 0.4 + j0.8 Ω. Determine the line current and the complex power delivered to the loads.',
      hint: '負載端電壓已知，複功率直接相加；線路阻抗在這兩個答案用不到。',
      steps: [
        st('Step 1　各負載。', 'S<sub>1</sub> = 13.6 + j8.429；S<sub>2</sub> = 7.2 + j9.6；S<sub>3</sub> = 8（kVA）', ''),
        st('Step 2　總和。', 'S = 28.8 + j18.03 kVA；|S| = 33.98 kVA', ''),
        st('Step 3　線電流。', 'I<sub>L</sub> = 33.98k/(√3 × 208) = 94.31 A', '')
      ],
      ans: 'I<sub>L</sub> ≈ 94.31 A；S ≈ 28.8 + j18.03 kVA' }),
    it(70, '12.10', '兩瓦特計：一正一負', {
      q: '兩瓦特計法量 240 V 線路上運轉的三相馬達，P<sub>1</sub> = 1200 W、P<sub>2</sub> = −400 W。假設馬達負載為 Y 接、線電流 6 A，求馬達的 pf 與每相阻抗。',
      en: 'The two-wattmeter method gives P<sub>1</sub> = 1200 W and P<sub>2</sub> = −400 W for a three-phase motor running on a 240-V line. Assume that the motor load is wye-connected and that it draws a line current of 6 A. Calculate the pf of the motor and its phase impedance.',
      hint: 'P = P<sub>1</sub> + P<sub>2</sub>；Q = √3(P<sub>1</sub> − P<sub>2</sub>)；tan θ = Q/P。',
      steps: [
        st('Step 1　P、Q。', 'P = 800 W；Q = √3 × 1600 = 2771 VAR', ''),
        st('Step 2　pf。', 'θ = tan<sup>−1</sup>(2771/800) = 73.90°；pf = 0.2774', '有一個讀負的 → pf &lt; 0.5。'),
        st('Step 3　阻抗。', '|Z<sub>p</sub>| = (240/√3)/6 = 23.09 Ω；Z<sub>p</sub> = 23.09∠73.90° = 6.40 + j22.19 Ω', '馬達是電感性，取 +θ。')
      ],
      ans: 'pf ≈ 0.2774；Z<sub>p</sub> ≈ 6.40 + j22.19 Ω' }),
    it(71, '12.10', '不平衡 Δ 負載的兩瓦特計', { fig: F.f1273, cap: '圖 12.73（重畫）',
      q: '圖 12.73 中兩個瓦特計正確接在由平衡電源（V<sub>ab</sub> = 208∠0° V、正相序）供電的不平衡負載上。(a) 求每個瓦特計的讀值。(b) 計算負載吸收的總視在功率。',
      en: 'In Fig. 12.73, two wattmeters are properly connected to the unbalanced load supplied by a balanced source such that V<sub>ab</sub> = 208∠0° V with positive phase sequence. (a) Determine the reading of each wattmeter. (b) Calculate the total apparent power absorbed by the load.',
      hint: 'W<sub>1</sub>：電流 I<sub>a</sub>、電壓 V<sub>ab</sub>；W<sub>2</sub>：電流 I<sub>c</sub>、電壓 V<sub>cb</sub>。先求三個 Δ 相電流。',
      steps: [
        st('Step 1　相電流。', 'I<sub>AB</sub> = 208/20 = 10.4∠0°；I<sub>BC</sub> = 208∠−120°/(10 − j10) = 14.71∠−75°；I<sub>CA</sub> = 208∠120°/(12 + j5) = 16∠97.38° A', ''),
        st('Step 2　線電流。', 'I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub> = 20.17∠−51.87° A；I<sub>c</sub> = I<sub>CA</sub> − I<sub>BC</sub> = 30.64∠101.03° A', ''),
        st('Step 3　(a) 讀值。', 'W<sub>1</sub> = Re(V<sub>ab</sub>I<sub>a</sub>*) = 2591 W；W<sub>2</sub> = Re(V<sub>cb</sub>I<sub>c</sub>*) = 4808 W', '合計 7398 W = 三個電阻吃的 2163 + 2164 + 3072。'),
        st('Step 4　(b) 視在功率。', 'S = 7398.4 − j883.2 VA；|S| = 7451 VA', '')
      ],
      ans: '(a) W<sub>1</sub> ≈ 2.591 kW、W<sub>2</sub> ≈ 4.808 kW　(b) |S| ≈ 7.451 kVA' }),
    it(72, '12.10', '兩瓦特計量圖 12.44 的負載', { fig: F.f1244, cap: '圖 12.44（重畫）',
      q: '若瓦特計 W<sub>1</sub>、W<sub>2</sub> 分別正確接在 a 與 b 線、c 與 b 線之間，量測圖 12.44 Δ 接負載吸收的功率，預測它們的讀值。',
      en: 'If wattmeters W<sub>1</sub> and W<sub>2</sub> are properly connected respectively between lines a and b and lines b and c to measure the power absorbed by the delta-connected load in Fig. 12.44, predict their readings.',
      hint: '接 12.11：I<sub>a</sub> = 199.7∠56.31° A、V<sub>ab</sub> = 415.7∠30° V。平衡時 W = V<sub>L</sub>I<sub>L</sub>cos(θ ± 30°)。',
      steps: [
        st('Step 1　負載角。', 'Z<sub>p</sub> = 2 − j3 ⟹ θ = −56.31°（電容性）', ''),
        st('Step 2　W<sub>1</sub>。', 'W<sub>1</sub> = 415.7 × 199.7 × cos(30° − 56.31°) = 74.41 kW', ''),
        st('Step 3　W<sub>2</sub>。', 'W<sub>2</sub> = Re(V<sub>cb</sub>I<sub>c</sub>*) = 415.7 × 199.7 × cos(90° − 176.31°) = 5.34 kW', ''),
        st('Step 4　驗算。', 'W<sub>1</sub> + W<sub>2</sub> = 79.75 kW = 3 × 199.7² × 0.667', '')
      ],
      ans: 'W<sub>1</sub> ≈ 74.41 kW、W<sub>2</sub> ≈ 5.34 kW' }),
    it(73, '12.10', '兩個電源、兩個瓦特計', { fig: F.f1274, cap: '圖 12.74（重畫；三個 Z 都是 10 + j30 Ω）',
      q: '求圖 12.74 電路的瓦特計讀值。',
      en: 'For the circuit displayed in Fig. 12.74, find the wattmeter readings.',
      hint: '以中間那條線（接地）為參考：V<sub>上</sub> = 240∠−60°、V<sub>下</sub> = 240∠−120°。W<sub>1</sub> = Re(V<sub>上</sub>I<sub>上</sub>*)、W<sub>2</sub> = Re(V<sub>下</sub>I<sub>下</sub>*)。',
      steps: [
        st('Step 1　上、下兩線的電流。', 'I<sub>上</sub> = V<sub>上</sub>/Z + (V<sub>上</sub> − V<sub>下</sub>)/Z；I<sub>下</sub> = V<sub>下</sub>/Z + (V<sub>下</sub> − V<sub>上</sub>)/Z', '|V<sub>上</sub> − V<sub>下</sub>| = 240 V，其實是平衡三相。'),
        st('Step 2　讀值。', 'W<sub>1</sub> = 2360.5 W；W<sub>2</sub> = −632.5 W', ''),
        st('Step 3　驗算。', 'W<sub>1</sub> + W<sub>2</sub> = 1728 W = 3 × (240/31.62)² × 10', '')
      ],
      ans: 'W<sub>1</sub> ≈ 2.360 kW、W<sub>2</sub> ≈ −632.5 W', note: '圖上三個負載都標 Z，只有右邊那個寫出 Z = 10 + j30 Ω，這裡當成三個都一樣。' }),
    it(74, '12.10', 'Y 負載的兩瓦特計', { fig: F.f1275, cap: '圖 12.75（重畫；三個 Z 都是 60 − j30 Ω）',
      q: '預測圖 12.75 電路的瓦特計讀值。',
      en: 'Predict the wattmeter readings for the circuit in Fig. 12.75.',
      hint: '以中間線為參考：V<sub>上</sub> = 208∠0°、V<sub>下</sub> = 208∠−60°。Y 負載中性點 V<sub>N</sub> = (V<sub>上</sub> + V<sub>下</sub>)/3。',
      steps: [
        st('Step 1　中性點。', 'V<sub>N</sub> = (208 + 208∠−60°)/3 = 120.1∠−30° V', ''),
        st('Step 2　線電流。', 'I<sub>上</sub> = (208 − V<sub>N</sub>)/(60 − j30) = 1.790∠56.57° A；I<sub>下</sub> = (V<sub>下</sub> − V<sub>N</sub>)/(60 − j30)', ''),
        st('Step 3　讀值。', 'W<sub>1</sub> = Re(208 × I<sub>上</sub>*) = 205.2 W；W<sub>2</sub> = Re(V<sub>下</sub>I<sub>下</sub>*) = 371.7 W', ''),
        st('Step 4　驗算。', 'W<sub>1</sub> + W<sub>2</sub> = 576.9 W = 3 × 1.790² × 60', '')
      ],
      ans: 'W<sub>1</sub> ≈ 205.2 W、W<sub>2</sub> ≈ 371.7 W' }),
    it(75, '12.10', '人體電阻的觸電電流', {
      q: '某人身體電阻 600 Ω。在沒有接地的情況下，流過他身體的電流是多少？(a) 摸到 12 V 汽車電池兩端　(b) 手指插進 120 V 燈座',
      en: 'A man has a body resistance of 600 Ω. How much current flows through his ungrounded body: (a) when he touches the terminals of a 12-V autobattery? (b) when he sticks his finger into a 120-V light socket?',
      hint: 'I = V/R。',
      steps: [
        st('(a)', 'I = 12/600 = 20 mA', ''),
        st('(b)', 'I = 120/600 = 200 mA', '100 mA 以上就可能致命。')
      ],
      ans: '(a) 20 mA　(b) 200 mA' }),

    /* ═══════════ 綜合題 ═══════════ */
    it(77, 'cp', '發電機本身損失多少？', {
      q: '三相發電機供應 3.6 kVA、pf 0.85 落後。若送到負載 2500 W，線路損失每相 80 W，發電機內部的損失是多少？',
      en: 'A three-phase generator supplied 3.6 kVA at a power factor of 0.85 lagging. If 2,500 W are delivered to the load and line losses are 80 W per phase, what are the losses in the generator?',
      hint: '發電機輸出實功率 = 3.6k × 0.85，扣掉負載和線路。',
      steps: [
        st('Step 1　發電機送出。', 'P = 3600 × 0.85 = 3060 W', ''),
        st('Step 2　扣掉。', '3060 − 2500 − 3 × 80 = 320 W', '')
      ],
      ans: '320 W' }),
    it(78, 'cp', '感性負載校正到 0.95', {
      q: '三相 440 V、51 kW、60 kVA 的感性負載操作在 60 Hz，Y 接。要把功率因數校正到 0.95 落後，每相負載要並聯多大的電容？',
      en: 'A three-phase 440-V, 51-kW, 60-kVA inductive load operates at 60 Hz and is wye-connected. It is desired to correct the power factor to 0.95 lagging. What value of capacitor should be placed in parallel with each load impedance?',
      hint: 'Q<sub>C</sub> = P(tan θ<sub>舊</sub> − tan θ<sub>新</sub>)，分成三相，每相電壓 254 V。',
      steps: [
        st('Step 1　原本的 Q。', 'Q = √(60² − 51²) = 31.61 kVAR', ''),
        st('Step 2　新的 Q。', 'Q<sub>新</sub> = 51 tan(cos<sup>−1</sup>0.95) = 16.76 kVAR', ''),
        st('Step 3　每相要補的。', 'Q<sub>C</sub> = (31.61 − 16.76)/3 = 4.948 kVAR', ''),
        st('Step 4　電容。', 'C = 4948/(377 × 254.0²) = 203.4 μF', 'Y 接每個電容吃相電壓。')
      ],
      ans: 'C ≈ 203.4 μF（每相）' }),
    it(79, 'cp', '感應馬達：線電流與負載電壓', {
      q: 'abc 相序的平衡三相發電機，相電壓 V<sub>an</sub> = 255∠0° V，供電給可用每相 12 + j5 Ω 的平衡 Y 接負載表示的感應馬達。線路阻抗每相 2 Ω，求線電流與負載電壓。',
      en: 'A balanced three-phase generator has an abc phase sequence with phase voltage V<sub>an</sub> = 255∠0° V. The generator feeds an induction motor which may be represented by a balanced Y-connected load with an impedance of 12 + j5 Ω per phase. Find the line currents and the load voltages. Assume a line impedance of 2 Ω per phase.',
      hint: '單相：I<sub>a</sub> = V<sub>an</sub>/(2 + 12 + j5)。',
      steps: [
        st('Step 1　線電流。', 'I<sub>a</sub> = 255/(14 + j5) = 17.15∠−19.65° A；I<sub>b</sub> = 17.15∠−139.65°、I<sub>c</sub> = 17.15∠100.35° A', ''),
        st('Step 2　負載電壓。', 'V<sub>AN</sub> = I<sub>a</sub>(12 + j5) = 223.0∠2.97° V；V<sub>BN</sub> = 223.0∠−117.03°、V<sub>CN</sub> = 223.0∠122.97° V', '')
      ],
      ans: 'I<sub>a</sub> ≈ 17.15∠−19.65° A（另兩相 ∓120°）；V<sub>AN</sub> ≈ 223.0∠2.97° V（另兩相 ∓120°）' }),
    it(80, 'cp', '求未知負載', {
      q: '平衡三相電源供電給三個負載：負載 1：6 kVA、pf 0.83 落後；負載 2：未知；負載 3：8 kW、pf 0.7071 超前。若線電流 84.6 A rms、負載端線電壓 208 V rms，且合起來 pf 0.8 落後，求未知負載。',
      en: 'A balanced three-phase source furnishes power to the following three loads: Load 1: 6 kVA at 0.83 pf lagging; Load 2: unknown; Load 3: 8 kW at 0.7071 pf leading. If the line current is 84.6 A rms, the line voltage at the load is 208 V rms, and the combined load has a 0.8 pf lagging, determine the unknown load.',
      hint: 'S<sub>總</sub> = √3 × 208 × 84.6 ∠36.87°；S<sub>2</sub> = S<sub>總</sub> − S<sub>1</sub> − S<sub>3</sub>。',
      steps: [
        st('Step 1　總和。', 'S = 30.48∠36.87° = 24.38 + j18.29 kVA', ''),
        st('Step 2　已知的兩個。', 'S<sub>1</sub> = 4.98 + j3.346；S<sub>3</sub> = 8 − j8（kVA）', ''),
        st('Step 3　未知負載。', 'S<sub>2</sub> = 11.40 + j22.94 kVA', '')
      ],
      ans: 'S<sub>2</sub> ≈ 11.40 + j22.94 kVA（25.6 kVA、pf ≈ 0.445 落後）' }),
    it(81, 'cp', '專業中心：送端線電壓', {
      q: '某專業中心由平衡三相電源供電，有四個平衡三相負載：負載 1：150 kVA、pf 0.8 超前；負載 2：100 kW、pf = 1；負載 3：200 kVA、pf 0.6 落後；負載 4：80 kW、95 kVAR（感性）。若每相線路阻抗 0.02 + j0.05 Ω、負載端線電壓 480 V，求電源端線電壓大小。',
      en: 'A professional center is supplied by a balanced three-phase source. The center has four balanced three-phase loads as follows: Load 1: 150 kVA at 0.8 pf leading; Load 2: 100 kW at unity pf; Load 3: 200 kVA at 0.6 pf lagging; Load 4: 80 kW and 95 kVAR (inductive). If the line impedance is 0.02 + j0.05 Ω per phase and the line voltage at the loads is 480 V, find the magnitude of the line voltage at the source.',
      hint: '總 S → I<sub>a</sub> = (S/(3V<sub>p</sub>))*；V<sub>s,p</sub> = V<sub>p</sub> + I<sub>a</sub>Z<sub>line</sub>。',
      steps: [
        st('Step 1　總和。', 'S = (120 − j90) + 100 + (120 + j160) + (80 + j95) = 420 + j165 kVA', ''),
        st('Step 2　線電流。', 'I<sub>a</sub> = (420k + j165k)*/(3 × 277.1) = 542.8∠−21.45° A', ''),
        st('Step 3　送端。', 'V<sub>s,p</sub> = 277.1 + 542.8∠−21.45° × (0.02 + j0.05) = 297.9∠4.10° V；V<sub>s,L</sub> = 516.0 V', '')
      ],
      ans: '電源端線電壓 ≈ 516.0 V' }),
    it(82, 'cp', 'Y 負載＋Δ 負載＋線路', {
      q: '平衡三相系統的配電線每相阻抗 2 + j6 Ω，供應兩個並聯三相負載：第一個是平衡 Y 接負載，吸收 400 kVA、pf 0.8 落後；第二個是每相 10 + j8 Ω 的平衡 Δ 接負載。若負載端線電壓 2400 V rms，求電源端線電壓大小，以及送到兩個負載的總複功率。',
      en: 'A balanced three-phase system has a distribution wire with impedance 2 + j6 Ω per phase. The system supplies two three-phase loads that are connected in parallel. The first is a balanced wye-connected load that absorbs 400 kVA at a power factor of 0.8 lagging. The second load is a balanced delta-connected load with impedance of 10 + j8 Ω per phase. If the magnitude of the line voltage at the loads is 2400 V rms, calculate the magnitude of the line voltage at the source and the total complex power supplied to the two loads.',
      hint: 'Δ 負載：S = 3V<sub>L</sub>²/Z*。',
      steps: [
        st('Step 1　兩個負載。', 'S<sub>1</sub> = 320 + j240 kVA；S<sub>2</sub> = 3 × 2400²/(10 − j8) = 1053.7 + j842.9 kVA', ''),
        st('Step 2　總和。', 'S = 1373.7 + j1082.9 kVA', ''),
        st('Step 3　線電流。', 'I<sub>a</sub> = (S/(3 × 1385.6))* = 420.8∠−38.25° A', ''),
        st('Step 4　送端。', 'V<sub>s,p</sub> = 1385.6 + I<sub>a</sub>(2 + j6)；V<sub>s,L</sub> = 6745 V', '線路壓降很大。')
      ],
      ans: '電源端線電壓 ≈ 6.745 kV；S ≈ 1.374 + j1.083 MVA' }),
    it(83, 'cp', '馬達＋加熱器的線電流', {
      q: '市售三相感應馬達全載 120 hp（1 hp = 746 W），效率 95%、pf 0.707 落後。馬達與 80 kW 的平衡三相加熱器（pf = 1）並聯。若線電壓 480 V rms，求線電流。',
      en: 'A commercially available three-phase inductive motor operates at a full load of 120 hp (1 hp = 746 W) at 95 percent efficiency at a lagging power factor of 0.707. The motor is connected in parallel to a 80-kW balanced three-phase heater at unity power factor. If the magnitude of the line voltage is 480 V rms, calculate the line current.',
      hint: '馬達「輸入」功率 = 輸出/效率。',
      steps: [
        st('Step 1　馬達輸入。', 'P = 120 × 746/0.95 = 94.23 kW；Q = 94.23 tan 45° ≈ 94.26 kVAR', ''),
        st('Step 2　加上加熱器。', 'S = 174.23 + j94.26 kVA；|S| = 198.1 kVA', ''),
        st('Step 3　線電流。', 'I<sub>L</sub> = 198.1k/(√3 × 480) = 238.3 A', '')
      ],
      ans: 'I<sub>L</sub> ≈ 238.3 A' }),
    it(84, 'cp', '★ 馬達＋電容＋照明（不平衡）', { fig: F.f1276, cap: '圖 12.76（重畫）',
      q: '圖 12.76 是一個 Δ 接三相馬達負載，接在 440 V 線電壓上，吸取 4 kVA、pf 72% 落後。另外 a、b 線之間接了一顆 1.8 kVAR 電容，c 線與中性線之間接了 800 W 照明負載。假設 abc 相序、V<sub>an</sub> = V<sub>p</sub>∠0°，求 I<sub>a</sub>、I<sub>b</sub>、I<sub>c</sub>、I<sub>n</sub> 的大小與相角。',
      en: 'Figure 12.76 displays a three-phase delta-connected motor load which is connected to a line voltage of 440 V and draws 4 kVA at a power factor of 72 percent lagging. In addition, a single 1.8 kVAR capacitor is connected between lines a and b, while a 800-W lighting load is connected between line c and neutral. Assuming the abc sequence and taking V<sub>an</sub> = V<sub>p</sub>∠0°, find the magnitude and phase angle of currents I<sub>a</sub>, I<sub>b</sub>, I<sub>c</sub>, and I<sub>n</sub>.',
      hint: '三個負載的電流分開算再疊加：馬達（平衡）、電容（只在 a、b）、照明（只在 c、n）。',
      steps: [
        st('Step 1　馬達（每相 1333 VA∠43.95°）。', 'I<sub>a,m</sub> = (S<sub>p</sub>/V<sub>an</sub>)* = 5.249∠−43.95° A（另兩相 ∓120°）', 'V<sub>p</sub> = 254.0 V。'),
        st('Step 2　電容。', 'X<sub>C</sub> = 440²/1800 = 107.6 Ω；I<sub>cap</sub> = V<sub>ab</sub>/(−jX<sub>C</sub>) = 4.091∠120° A（a → b）', ''),
        st('Step 3　照明。', 'I<sub>燈</sub> = 800/254.0 ∠120° = 3.149∠120° A（c → n）', '純電阻，跟 V<sub>cn</sub> 同相。'),
        st('Step 4　疊加。', 'I<sub>a</sub> = I<sub>a,m</sub> + I<sub>cap</sub> = 1.736∠−3.29° A；I<sub>b</sub> = I<sub>b,m</sub> − I<sub>cap</sub> = 5.825∠−120.98° A；I<sub>c</sub> = I<sub>c,m</sub> + I<sub>燈</sub> = 7.827∠92.27° A；I<sub>n</sub> = −I<sub>燈</sub> = 3.149∠−60° A', 'I<sub>n</sub> 照圖上箭頭（往負載）方向。')
      ],
      ans: 'I<sub>a</sub> ≈ 1.736∠−3.29° A、I<sub>b</sub> ≈ 5.825∠−120.98° A、I<sub>c</sub> ≈ 7.827∠92.27° A、I<sub>n</sub> ≈ 3.149∠−60° A' }),
    it(86, 'cp', '單相三線式：網目分析', { fig: F.f1277, cap: '圖 12.77（重畫）',
      q: '求圖 12.77 單相三線式系統的電流 I<sub>aA</sub>、I<sub>bB</sub>、I<sub>nN</sub>。',
      en: 'For the single-phase three-wire system in Fig. 12.77, find currents I<sub>aA</sub>, I<sub>bB</sub>, and I<sub>nN</sub>.',
      hint: '兩個網目：上面 I<sub>1</sub>（順時針 = I<sub>aA</sub>）、下面 I<sub>2</sub>（順時針，從 n 往 N）。中性線 1 Ω 兩個網目共用。',
      steps: [
        st('Step 1　上網目。', '120 = I<sub>1</sub>(1 + 24 − j2 + 1) − I<sub>2</sub>(1)', ''),
        st('Step 2　下網目。', '120 = −I<sub>1</sub>(1) + I<sub>2</sub>(1 + 15 + j4 + 1)', ''),
        st('Step 3　解。', 'I<sub>1</sub> = 4.869∠3.67° A；I<sub>2</sub> = 7.149∠−13.10° A', ''),
        st('Step 4　答案。', 'I<sub>aA</sub> = I<sub>1</sub> = 4.869∠3.67° A；I<sub>bB</sub> = −I<sub>2</sub> = 7.149∠166.90° A；I<sub>nN</sub> = I<sub>2</sub> − I<sub>1</sub> = 2.856∠−42.55° A', '')
      ],
      ans: 'I<sub>aA</sub> ≈ 4.869∠3.67° A、I<sub>bB</sub> ≈ 7.149∠166.90° A、I<sub>nN</sub> ≈ 2.856∠−42.55° A' }),
    it(87, 'cp', '單相三線式：中性線電流與各電源功率', { fig: F.f1278, cap: '圖 12.78（重畫）',
      q: '考慮圖 12.78 的單相三線式系統，V<sub>s</sub> = 115∠0° V、60 Hz。求中性線電流，以及每個電源供給的複功率。',
      en: 'Consider the single-phase three-wire system shown in Fig. 12.78. Find the current in the neutral wire and the complex power supplied by each source. Take V<sub>s</sub> as a 115∠0°-V, 60-Hz source.',
      hint: '50 mH → j18.85 Ω。以電源中間點為參考：上線 +115、下線 −115，三個未知節點（右上 X、中 Y、右下 Z）。',
      steps: [
        st('Step 1　節點方程。', 'X：(X − 115)/1 + (X − Y)/20 + (X − Z)/(15 + j18.85) = 0；Y：(Y − X)/20 + Y/2 + (Y − Z)/30 = 0；Z：(Z + 115)/1 + (Z − Y)/30 + (Z − X)/(15 + j18.85) = 0', ''),
        st('Step 2　解。', 'V<sub>X</sub> = 104.3∠3.40°、V<sub>Y</sub> = 2.897∠3.40°、V<sub>Z</sub> = 105.7∠−176.60° V', ''),
        st('Step 3　中性線。', 'I<sub>n</sub> = V<sub>Y</sub>/2 = 1.449∠3.40° A', ''),
        st('Step 4　電源複功率。', '上：S<sub>1</sub> = 115 × I<sub>上</sub>* = 1252 + j711.6 VA；下：S<sub>2</sub> = 115 × I<sub>下</sub>* = 1085.5 + j721.5 VA', 'I<sub>上</sub> = 115 − V<sub>X</sub> = 12.52∠−29.62° A；I<sub>下</sub> = V<sub>Z</sub> + 115 = 11.33∠−33.61° A。')
      ],
      ans: '|I<sub>n</sub>| ≈ 1.449 A；S<sub>1</sub> ≈ 1252 + j711.6 VA、S<sub>2</sub> ≈ 1085.5 + j721.5 VA' })
  ];

  window.__CH12PB.items = window.__CH12PB.items.concat(items);
})();
