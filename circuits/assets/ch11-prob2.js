/* ============================================================
   電路學 CH11 章末練習題（2/3）：Section 11.4～11.6（Problem 11.22～11.50）
   跳過 e⁷d：11.23、11.37、11.40、11.43。11.22 起電壓電流一律是 rms（課本註腳）。
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, dx, dy, parts) => S.svg(w + 70, h, ['<g transform="translate(' + dx + ',' + dy + ')">'].concat(parts, ['</g>']));
  /* 波形：pts = [[t, v], …]；ax 照 schem.js 的 wave */
  const W = (pts, ax) => S.svg(380, 170, [S.wave(380, 170, pts, ax)]);
  const rep = (seg, per, t1) => { const out = []; for (let k = 0; k * per < t1; k++) seg.forEach(p => out.push([p[0] + k * per, p[1]])); return out; };
  const fn = (f, t0, t1, n) => { const o = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; o.push([t, f(t)]); } return o; };
  const PI = Math.PI;

  const F = {
    w53: W(fn(t => 2 - 2 * Math.cos(2 * t), 0, 3.3 * PI, 200), { t0: 0, t1: 3.4 * PI, v0: -0.6, v1: 4.6, ticks: [[PI, 'π'], [2 * PI, '2π'], [3 * PI, '3π']], vt: [4], vl: 'i(t)' }),
    w55: W(rep([[0, 5], [1, 5], [1, -5], [2, -5], [2, 5]], 2, 4.4), { t0: 0, t1: 4.6, v0: -6.5, v1: 6.5, ticks: [1, 2, 3, 4], vt: [5, -5], vl: 'v(t)' }),
    w56: W([[-1, 4], [0, 4], [0, -4], [1, -4], [1, 0], [2, 0], [2, 4], [3, 4], [3, -4], [4, -4], [4, 0], [5, 0], [5, 4], [5.5, 4]], { t0: -1.2, t1: 5.7, v0: -5.2, v1: 5.2, ticks: [-1, 1, 2, 3, 4, 5], vt: [4, -4], vl: 'f(t)' }),
    w57: W(rep([[0, 10], [2, 10], [2, 20], [4, 20], [4, 10]], 4, 10.5), { t0: 0, t1: 11, v0: 0, v1: 24, ticks: [2, 4, 6, 8, 10], vt: [10, 20], vl: 'v(t)' }),
    w58: W(rep([[0, 0], [5, 5], [5, 0]], 5, 26), { t0: 0, t1: 27, v0: 0, v1: 6.2, ticks: [5, 10, 15, 20, 25], vt: [5], vl: 'i(t)' }),
    w59: W(rep([[0, 0], [2, 8], [2, 0], [5, 0]], 5, 12.5), { t0: 0, t1: 13, v0: 0, v1: 9.5, ticks: [2, 5, 7, 10, 12], vt: [8], vl: 'v(t)' }),
    w60: W([[0, 0], [5, 30], [15, -30], [25, 30], [32.5, -15]], { t0: 0, t1: 33, v0: -35, v1: 35, ticks: [5, 10, 15, 20, 25, 30], vt: [30, -30], vl: 'i(t)' }),
    w61: W(rep([[0, 0], [2, 2], [2, -1], [4, -1], [4, 0]], 4, 10.5), { t0: 0, t1: 11, v0: -1.6, v1: 2.6, ticks: [2, 4, 6, 8, 10], vt: [2, -1], vl: 'v(t)' }),
    w62: W(rep([[0, 0], [1, 2], [1, -4], [2, -4], [2, 0]], 2, 5.5), { t0: 0, t1: 6, v0: -4.8, v1: 2.8, ticks: [1, 2, 3, 4, 5], vt: [2, -4], vl: 'v(t)' }),
    w63: W(rep(fn(t => 10 * t * t, 0, 1, 20).concat([[1, 0], [2, 0]]), 2, 5.5), { t0: 0, t1: 6, v0: 0, v1: 12, ticks: [1, 2, 3, 4, 5], vt: [10], vl: 'i(t)' }),
    w64: W(rep([[0, 0], [1, 5], [3, 5], [4, 0], [6, 0]], 6, 10.5), { t0: 0, t1: 11, v0: 0, v1: 6.2, ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], vt: [5], vl: 'i(t)' }),
    w65: W([[-1, 6], [0, 6], [0, 0], [2, 6], [3, 6], [3, 0], [5, 6], [6, 6]], { t0: -1.2, t1: 6.3, v0: -0.8, v1: 7.5, ticks: [-1, 1, 2, 3, 4, 5], vt: [6], vl: 'f(t)' }),
    w66: W([[0, 10], [1, 10], [1, 20], [2, 20], [2, 30], [4, 30], [4, 20], [5, 20], [5, 10], [6, 10], [6, 0]], { t0: 0, t1: 6.6, v0: 0, v1: 34, ticks: [1, 2, 3, 4, 5, 6], vt: [10, 20, 30], vl: 'v(t)' }),
    f1167: G(330, 188, 20, 10, [
      S.term(20, 20), S.term(20, 65), S.t(20, 12, '+　220 V, 60 Hz', 'start'), S.t(20, 85, '−', 'start'),
      S.w('20,20', '300,20', '300,155'), S.w('20,65', '150,65', '150,155'),
      S.z(150, 65, 300, 65, '124∠0° Ω', { side: 'b' }), S.z(150, 110, 300, 110, '20 − j25 Ω', { side: 'b' }), S.z(150, 155, 300, 155, '90 + j80 Ω', { side: 'b' })]),
    f1168a: G(300, 140, 20, 10, [
      S.term(10, 25), S.term(10, 105), S.r(10, 25, 100, 25, '4 Ω'), S.c(100, 25, 100, 105, '−j2 Ω', { side: 'r' }), S.l(100, 25, 210, 25, 'j5 Ω'),
      S.c(210, 25, 210, 105, '−j2 Ω', { side: 'r' }), S.w('10,105', '210,105'), S.dot(100, 25), S.dot(100, 105), S.t(150, 125, '(a)', 'middle')]),
    f1168b: G(300, 140, 20, 10, [
      S.term(10, 25), S.term(10, 105), S.w('10,25', '50,25'), S.w('10,105', '50,105'), S.r(50, 25, 50, 105, '1 Ω', { side: 'r' }), S.c(50, 25, 140, 25, '−j1 Ω'),
      S.l(140, 25, 140, 105, 'j2 Ω', { side: 'r' }), S.r(140, 25, 230, 25, '4 Ω'), S.l(230, 25, 230, 105, 'j1 Ω', { side: 'r' }), S.w('50,105', '230,105'),
      S.dot(50, 25), S.dot(140, 25), S.dot(50, 105), S.dot(140, 105), S.t(140, 125, '(b)', 'middle')]),
    f1169: G(330, 160, 35, 15, [
      S.vs(20, 30, 130, 'v_s'), S.r(20, 30, 90, 30, '30 Ω'), S.c(90, 30, 160, 30, '40 μF'), S.l(160, 30, 160, 130, '60 mH', { side: 'r' }), S.t(150, 56, 'i_x↓', 'end', ' font-size="11"'),
      S.r(160, 30, 250, 30, '20 Ω'), S.dvs(250, 30, 130, '4i_x', { side: 'r' }), S.w('20,130', '250,130'), S.dot(160, 30), S.dot(160, 130)])
  };

  const rms = (id, no, title, fig, q, en, steps, ans, extra) => Object.assign({ id: 'p11-' + no, sec: '11.4', kind: 'pp', tag: 'Problem 11.' + no, title, fig, cap: fig ? '圖（重畫）' : '', q, en,
    hint: 'rms = √(一個週期裡 f² 的平均)。先找週期 T，把每一段的 ∫f²dt 加起來除以 T，再開根號。', steps, ans }, extra || {});

  const items = [
    /* ═══════════ 11.4 有效值 ═══════════ */
    rms('', 22, '偏移的正弦波', F.w53, '求圖 11.53 偏移正弦波的 rms 值。', 'Find the rms value of the offset sine wave shown in Fig. 11.53.', [
      st('Step 1　寫出波形。', 'i(t) = 2 − 2 cos 2t = 4 sin² t', '0 時是 0、π/2 時是 4、π 時回到 0，週期 π。'),
      st('Step 2　平方取平均。', '⟨i²⟩ = 16⟨sin⁴ t⟩ = 16 × 3/8 = 6', 'sin⁴ 的平均是 3/8（或：⟨(2 − 2cos 2t)²⟩ = 4 + 4 × ½ = 6）。'),
      st('Step 3　開根號。', 'I<sub>rms</sub> = √6 = 2.449 A', '')], 'I<sub>rms</sub> = √6 ≈ 2.449 A', { cap: '圖 11.53（重畫）' }),
    rms('', 24, '±5 V 方波', F.w55, '求圖 11.55 波形的 rms 值。', 'Determine the rms value of the waveform in Fig. 11.55.', [
      st('Step 1　平方。', 'v² = 25（不管 +5 還是 −5）', ''),
      st('Step 2　開根號。', 'V<sub>rms</sub> = √25 = 5 V', '對稱方波的 rms 就是振幅。')], 'V<sub>rms</sub> = 5 V', { cap: '圖 11.55（重畫）' }),
    rms('', 25, '三階的方波', F.w56, '求圖 11.56 訊號的 rms 值。', 'Find the rms value of the signal shown in Fig. 11.56.', [
      st('Step 1　週期。', 'T = 3：4（1 s）、−4（1 s）、0（1 s）', ''),
      st('Step 2　平方積分。', '∫f² dt = 16 + 16 + 0 = 32', ''),
      st('Step 3　rms。', 'F<sub>rms</sub> = √(32/3) = 3.266', '')], 'F<sub>rms</sub> ≈ 3.266', { cap: '圖 11.56（重畫）' }),
    rms('', 26, '10 V／20 V 階梯', F.w57, '求圖 11.57 電壓波形的有效值。', 'Find the effective value of the voltage waveform in Fig. 11.57.', [
      st('Step 1　週期 T = 4。', '10 V 兩秒、20 V 兩秒', ''),
      st('Step 2　平方平均。', '(100 × 2 + 400 × 2)/4 = 250', ''),
      st('Step 3　rms。', 'V<sub>rms</sub> = √250 = 15.81 V', '比平均值 15 V 稍大。')], 'V<sub>rms</sub> ≈ 15.81 V', { cap: '圖 11.57（重畫）' }),
    rms('', 27, '鋸齒波', F.w58, '計算圖 11.58 電流波形的 rms 值。', 'Calculate the rms value of the current waveform of Fig. 11.58.', [
      st('Step 1　一個週期。', 'i = t（0 &lt; t &lt; 5），T = 5', '5 秒內從 0 爬到 5。'),
      st('Step 2　平方積分。', '∫<sub>0</sub><sup>5</sup> t² dt = 125/3', ''),
      st('Step 3　rms。', 'I<sub>rms</sub> = √(125/3 ÷ 5) = √(25/3) = 2.887 A', '鋸齒波 rms = 峰值/√3。')], 'I<sub>rms</sub> = 5/√3 ≈ 2.887 A', { cap: '圖 11.58（重畫）' }),
    rms('', 28, '斜坡＋休息，還要算功率', F.w59, '求圖 11.59 電壓波形的 rms 值，以及把它加在 2 Ω 電阻上時吸收的平均功率。', 'Find the rms value of the voltage waveform of Fig. 11.59 as well as the average power absorbed by a 2-Ω resistor when the voltage is applied across the resistor.', [
      st('Step 1　一個週期。', 'v = 4t（0 &lt; t &lt; 2）、0（2 &lt; t &lt; 5），T = 5', ''),
      st('Step 2　平方積分。', '∫<sub>0</sub><sup>2</sup> 16t² dt = 128/3', ''),
      st('Step 3　rms。', 'V<sub>rms</sub>² = (128/3)/5 = 8.533　⟹　V<sub>rms</sub> = 2.921 V', ''),
      st('Step 4　功率。', 'P = V<sub>rms</sub>²/R = 8.533/2 = 4.267 W', 'rms 就是為了讓 P = V²/R 照樣成立。')], 'V<sub>rms</sub> ≈ 2.921 V；P ≈ 4.267 W', { cap: '圖 11.59（重畫）' }),
    rms('', 29, '三角波＋12 Ω 功率', F.w60, '計算圖 11.60 電流波形的有效值，以及電流流過 12 Ω 電阻時送到電阻的平均功率。', 'Calculate the effective value of the current waveform in Fig. 11.60 and the average power delivered to a 12-Ω resistor when the current runs through the resistor.', [
      st('Step 1　看四分之一週期。', '0～5 s：i = 6t，從 0 到 30', '三角波四段都一樣，只要算一段。'),
      st('Step 2　平方平均。', '(1/5)∫<sub>0</sub><sup>5</sup> 36t² dt = (1/5)(36 × 125/3) = 300', ''),
      st('Step 3　rms 與功率。', 'I<sub>rms</sub> = √300 = 17.32 A；P = 300 × 12 = 3.6 kW', '三角波 rms = 峰值/√3。')], 'I<sub>rms</sub> ≈ 17.32 A；P = 3.6 kW', { cap: '圖 11.60（重畫）' }),
    rms('', 30, '斜坡＋負平台', F.w61, '計算圖 11.61 波形的 rms 值。', 'Compute the rms value of the waveform depicted in Fig. 11.61.', [
      st('Step 1　週期 T = 4。', '0～2：v = t；2～4：v = −1', ''),
      st('Step 2　平方積分。', '∫<sub>0</sub><sup>2</sup> t² dt + ∫<sub>2</sub><sup>4</sup> 1 dt = 8/3 + 2 = 14/3', ''),
      st('Step 3　rms。', 'V<sub>rms</sub> = √(14/3 ÷ 4) = √1.1667 = 1.080 V', '')], 'V<sub>rms</sub> ≈ 1.080 V', { cap: '圖 11.61（重畫）' }),
    rms('', 31, '斜坡＋−4 V', F.w62, '求圖 11.62 訊號的 rms 值。', 'Find the rms value of the signal shown in Fig. 11.62.', [
      st('Step 1　週期 T = 2。', '0～1：v = 2t；1～2：v = −4', ''),
      st('Step 2　平方積分。', '∫<sub>0</sub><sup>1</sup> 4t² dt + 16 = 4/3 + 16 = 52/3', ''),
      st('Step 3　rms。', 'V<sub>rms</sub> = √(52/3 ÷ 2) = √8.667 = 2.944 V', '')], 'V<sub>rms</sub> ≈ 2.944 V', { cap: '圖 11.62（重畫）' }),
    rms('', 32, '10t² 的脈衝', F.w63, '求圖 11.63 電流波形的 rms 值。', 'Obtain the rms value of the current waveform shown in Fig. 11.63.', [
      st('Step 1　週期 T = 2。', '0～1：i = 10t²；1～2：i = 0', ''),
      st('Step 2　平方積分。', '∫<sub>0</sub><sup>1</sup> 100t⁴ dt = 20', ''),
      st('Step 3　rms。', 'I<sub>rms</sub> = √(20/2) = √10 = 3.162 A', '')], 'I<sub>rms</sub> = √10 ≈ 3.162 A', { cap: '圖 11.63（重畫）' }),
    rms('', 33, '梯形波', F.w64, '求圖 11.64 波形的 rms 值。', 'Determine the rms value for the waveform in Fig. 11.64.', [
      st('Step 1　週期 T = 6。', '0～1 爬到 5、1～3 平 5、3～4 降到 0、4～6 是 0', ''),
      st('Step 2　平方積分。', '兩段斜坡各 ∫<sub>0</sub><sup>1</sup> 25t² dt = 25/3；平台 25 × 2 = 50 ⟹ 合計 200/3', ''),
      st('Step 3　rms。', 'I<sub>rms</sub> = √(200/3 ÷ 6) = √11.11 = 3.333 A', '')], 'I<sub>rms</sub> ≈ 3.333 A', { cap: '圖 11.64（重畫）' }),
    rms('', 34, '斜坡＋平台', F.w65, '求圖 11.65 中 f(t) 的有效值。', 'Find the effective value of f(t) defined in Fig. 11.65.', [
      st('Step 1　週期 T = 3。', '0～2：f = 3t（0 到 6）；2～3：f = 6', ''),
      st('Step 2　平方積分。', '∫<sub>0</sub><sup>2</sup> 9t² dt + 36 × 1 = 24 + 36 = 60', ''),
      st('Step 3　rms。', 'F<sub>rms</sub> = √(60/3) = √20 = 4.472', '')], 'F<sub>rms</sub> = √20 ≈ 4.472', { cap: '圖 11.65（重畫）' }),
    rms('', 35, '階梯金字塔', F.w66, '圖 11.66 是週期電壓的一個週期（t = 0 開始、t = 6 s 結束），求有效值。', 'One cycle of a periodic voltage waveform is depicted in Fig. 11.66. Find the effective value of the voltage. Note that the cycle starts at t = 0 and ends at t = 6 s.', [
      st('Step 1　每一秒的值。', '10、20、30、30、20、10 V', ''),
      st('Step 2　平方加總。', '100 + 400 + 900 + 900 + 400 + 100 = 2800', '每段 1 秒。'),
      st('Step 3　rms。', 'V<sub>rms</sub> = √(2800/6) = 21.60 V', '')], 'V<sub>rms</sub> ≈ 21.60 V', { cap: '圖 11.66（重畫）' }),
    { id: 'p11-36', sec: '11.4', kind: 'pp', tag: 'Problem 11.36', title: '直流＋正弦的 rms',
      q: '計算下列函數的 rms 值：(a) i(t) = 10 A　(b) v(t) = 4 + 3 cos 5t V　(c) i(t) = 8 − 6 sin 2t A　(d) v(t) = 5 sin t + 4 cos t V',
      en: 'Calculate the rms value for each of the following functions: (a) i(t) = 10 A (b) v(t) = 4 + 3 cos 5t V (c) i(t) = 8 − 6 sin 2t A (d) v(t) = 5 sin t + 4 cos t V',
      hint: '直流和正弦「正交」：rms² = 直流² + (振幅/√2)²。同頻率的 sin、cos 先合成一個正弦。',
      steps: [
        st('(a) 直流。', 'I<sub>rms</sub> = 10 A', '直流的 rms 就是它自己。'),
        st('(b) 直流＋正弦。', 'V<sub>rms</sub> = √(4² + 3²/2) = √20.5 = 4.528 V', '交叉項 2 × 4 × 3cos 5t 平均是 0。'),
        st('(c) 同上。', 'I<sub>rms</sub> = √(8² + 6²/2) = √82 = 9.055 A', ''),
        st('(d) 同頻率合成。', '振幅 = √(5² + 4²) = √41　⟹　V<sub>rms</sub> = √(41/2) = 4.528 V', 'sin t 和 cos t 同頻率，合起來還是一個正弦。')
      ],
      ans: '(a) 10 A　(b) 4.528 V　(c) 9.055 A　(d) 4.528 V' },

    /* ═══════════ 11.5 視在功率與功率因數 ═══════════ */
    { id: 'p11-38', sec: '11.5', kind: 'pp', tag: 'Problem 11.38', title: '三個並聯負載：P、Q、pf', fig: F.f1167, cap: '圖 11.67（重畫）',
      q: '求圖 11.67 電力系統的 (a) 平均功率、(b) 虛功率、(c) 功率因數。220 V 是 rms 值。',
      en: 'For the power system in Fig. 11.67, find: (a) the average power, (b) the reactive power, (c) the power factor. Note that 220 V is an rms value.',
      hint: '三個負載並聯，每個都吃 220 V：S = |V|²/Z*，加起來。',
      steps: [
        st('Step 1　每個負載的複功率。', 'S<sub>1</sub> = 220²/124 = 390.3 W；S<sub>2</sub> = 220²/(20 + j25) = 944.4 − j1180；S<sub>3</sub> = 220²/(90 − j80) = 300.4 + j267', 'S = V V*/Z* = |V|²/Z*。'),
        st('Step 2　加總。', 'S = 1635 − j913.5 VA', ''),
        st('Step 3　答案。', 'P = 1.635 kW；Q = −913.5 VAR；pf = 1635/1873 = 0.873（超前）', 'Q 是負的 → 電容性 → 超前。')
      ],
      ans: '(a) P ≈ 1.635 kW　(b) Q ≈ −913.5 VAR　(c) pf ≈ 0.873 超前' },

    { id: 'p11-39', sec: '11.5', kind: 'pp', tag: 'Problem 11.39', title: '交流馬達：pf、P、Q，再補成 1',
      q: '交流馬達阻抗 Z<sub>L</sub> = 4.2 + j3.6 Ω，由 220 V、60 Hz 電源供電。(a) 求 pf、P、Q。(b) 要讓功率因數校正到 1，馬達旁邊要並聯多大的電容？',
      en: 'An ac motor with impedance Z<sub>L</sub> = 4.2 + j3.6 Ω is supplied by a 220-V, 60-Hz source. (a) Find pf, P, and Q. (b) Determine the capacitor required to be connected in parallel with the motor so that the power factor is corrected to unity.',
      hint: 'pf = R/|Z|；S = |V|²/Z*；電容要提供 Q：C = Q/(ωV²)。',
      steps: [
        st('Step 1　pf。', '|Z| = √(4.2² + 3.6²) = 5.532 Ω；pf = 4.2/5.532 = 0.7593（落後）', '電感性。'),
        st('Step 2　S。', 'S = 220²/(4.2 − j3.6) = 6643 + j5694 VA', ''),
        st('Step 3　P、Q。', 'P = 6.643 kW；Q = 5.694 kVAR', ''),
        st('Step 4　電容。', 'C = Q/(ωV²) = 5694/(377 × 220²) = 312.1 μF', '電容要吐出 5694 VAR，把 Q 抵消成 0。')
      ],
      ans: '(a) pf = 0.7593 落後、P ≈ 6.643 kW、Q ≈ 5.694 kVAR　(b) C ≈ 312.1 μF' },

    { id: 'p11-41', sec: '11.5', kind: 'pp', tag: 'Problem 11.41', title: '兩個電路的功率因數', fig: F.f1168a + F.f1168b, cap: '圖 11.68（重畫）',
      q: '求圖 11.68 每個電路的功率因數，並說明是超前還是落後。',
      en: 'Obtain the power factor for each of the circuits in Fig. 11.68. Specify each power factor as leading or lagging.',
      hint: '先把輸入阻抗化簡成 R + jX；pf = cos(∠Z)，X &lt; 0 超前、X &gt; 0 落後。',
      steps: [
        st('(a) 右邊兩條。', 'j5 + (−j2) = j3；−j2 ∥ j3 = (−j2)(j3)/(j1) = −j6', ''),
        st('(a) 輸入阻抗與 pf。', 'Z = 4 − j6 Ω；pf = cos(−56.31°) = 0.5547（超前）', ''),
        st('(b) 由右往左化簡。', 'j2 ∥ (4 + j1) = 0.64 + j1.52；串 −j1：0.64 + j0.52', ''),
        st('(b) 並 1 Ω。', 'Z = 1 ∥ (0.64 + j0.52) = 0.4459 + j0.1757 Ω；pf = cos 21.50° = 0.9304（落後）', '')
      ],
      ans: '(a) 0.5547 超前　(b) 0.9304 落後' },

    { id: 'p11-42', sec: '11.5', kind: 'pp', tag: 'Problem 11.42', title: '已知視在功率與 pf，反推 Z、R、L',
      q: '110 V rms、60 Hz 的電源接到負載阻抗 Z。進入負載的視在功率是 120 VA，功率因數 0.707 落後。(a) 求複功率。(b) 求供給負載的 rms 電流。(c) 求 Z。(d) 若 Z = R + jωL，求 R 與 L。',
      en: 'A 110-V rms, 60-Hz source is applied to a load impedance Z. The apparent power entering the load is 120 VA at a power factor of 0.707 lagging. (a) Calculate the complex power. (b) Find the rms current supplied to the load. (c) Determine Z. (d) Assuming that Z = R + jωL, find the values of R and L.',
      hint: '落後 → θ = +45°。|I| = |S|/|V|，Z = |V|²/S*。',
      steps: [
        st('(a) 複功率。', 'θ = cos<sup>−1</sup>0.707 = 45°；S = 120∠45° = 84.84 + j84.87 VA', ''),
        st('(b) 電流。', 'I<sub>rms</sub> = 120/110 = 1.091 A', ''),
        st('(c) 阻抗。', 'Z = |V|²/S* = 12100/(120∠−45°) = 100.8∠45° = 71.29 + j71.31 Ω', ''),
        st('(d) R、L。', 'R = 71.29 Ω；L = 71.31/377 = 0.1892 H', 'ω = 2π × 60 = 377。')
      ],
      ans: '(a) 84.84 + j84.87 VA　(b) 1.091 A　(c) 71.29 + j71.31 Ω　(d) R ≈ 71.29 Ω、L ≈ 189.2 mH' },

    /* ═══════════ 11.6 複功率 ═══════════ */
    { id: 'p11-44', sec: '11.6', kind: 'pp', tag: 'Problem 11.44', title: '有相依源的網路吃多少複功率', fig: F.f1169, cap: '圖 11.69（重畫）',
      q: '求圖 11.69 中 v<sub>s</sub> 送給網路的複功率。v<sub>s</sub> = 100 cos 2000t V。',
      en: 'Find the complex power delivered by v<sub>s</sub> to the network in Fig. 11.69. Let v<sub>s</sub> = 100 cos 2000t V.',
      hint: 'ω = 2000：40 μF → −j12.5、60 mH → j120。只有一個未知節點 V<sub>A</sub>。這題是時域給的峰值，S = ½VI*。',
      steps: [
        st('Step 1　換成阻抗。', '40 μF → −j12.5 Ω；60 mH → j120 Ω', ''),
        st('Step 2　節點 A 的 KCL。', '(100 − V<sub>A</sub>)/(30 − j12.5) = V<sub>A</sub>/(j120) + (V<sub>A</sub> − 4i<sub>x</sub>)/20，i<sub>x</sub> = V<sub>A</sub>/(j120)', '相依電壓源 4i<sub>x</sub> 在 20 Ω 右邊接地。'),
        st('Step 3　解。', 'V<sub>A</sub> = 39.16∠18.85° V；電源電流 I = (100 − V<sub>A</sub>)/(30 − j12.5) = 1.975∠11.25° A', ''),
        st('Step 4　複功率。', 'S = ½ × 100 × 1.975∠−11.25° = 96.87 − j19.28 VA', '峰值，所以乘 ½。')
      ],
      ans: 'S ≈ 96.87 − j19.28 VA', note: '這題用時域 100 cos 2000t 給電源，所以照峰值算（S = ½VI*）。若當成 rms 則答案乘 2。' },

    { id: 'p11-45', sec: '11.6', kind: 'pp', tag: 'Problem 11.45', title: '直流＋交流的 rms 與功率',
      q: '負載兩端電壓與流過的電流為 v(t) = 20 + 60 cos 100t V、i(t) = 1 − 0.5 sin 100t A。求 (a) 電壓與電流的 rms 值，(b) 負載消耗的平均功率。',
      en: 'The voltage across a load and the current through it are given by v(t) = 20 + 60 cos 100t V, i(t) = 1 − 0.5 sin 100t A. Find: (a) the rms values of the voltage and of the current (b) the average power dissipated in the load',
      hint: '直流和交流分開算：rms² = DC² + AC 振幅²/2；P = 直流功率 + 交流功率。',
      steps: [
        st('(a) 電壓。', 'V<sub>rms</sub> = √(20² + 60²/2) = √2200 = 46.90 V', ''),
        st('(a) 電流。', 'I<sub>rms</sub> = √(1² + 0.5²/2) = √1.125 = 1.061 A', ''),
        st('(b) 直流部分。', 'P<sub>dc</sub> = 20 × 1 = 20 W', ''),
        st('(b) 交流部分。', '−0.5 sin 100t = 0.5 cos(100t + 90°)；P<sub>ac</sub> = ½ × 60 × 0.5 × cos(0° − 90°) = 0', '電壓電流差 90°。'),
        st('(b) 合計。', 'P = 20 W', '直流 × 交流的交叉項平均是 0。')
      ],
      ans: '(a) V<sub>rms</sub> ≈ 46.90 V、I<sub>rms</sub> ≈ 1.061 A　(b) P = 20 W' },

    { id: 'p11-46', sec: '11.6', kind: 'pp', tag: 'Problem 11.46', title: '四組相量的 S、|S|、P、Q',
      q: '對下列電壓、電流相量，計算複功率、視在功率、實功率、虛功率，並說明 pf 是超前還是落後。(a) V = 220∠30° V rms、I = 0.5∠60° A rms　(b) V = 250∠−10° V rms、I = 6.2∠−25° A rms　(c) V = 120∠0° V rms、I = 2.4∠−15° A rms　(d) V = 160∠45° V rms、I = 8.5∠90° A rms',
      en: 'For the following voltage and current phasors, calculate the complex power, apparent power, real power, and reactive power. Specify whether the pf is leading or lagging. (a) V = 220∠30° V rms, I = 0.5∠60° A rms (b) V = 250∠−10° V rms, I = 6.2∠−25° A rms (c) V = 120∠0° V rms, I = 2.4∠−15° A rms (d) V = 160∠45° V rms, I = 8.5∠90° A rms',
      hint: 'S = VI*：大小相乘、角度 θ<sub>v</sub> − θ<sub>i</sub>。θ &gt; 0 落後、θ &lt; 0 超前。',
      steps: [
        st('(a)', 'S = 110∠−30° = 95.26 − j55 VA；|S| = 110 VA、P = 95.26 W、Q = −55 VAR', '超前。'),
        st('(b)', 'S = 1550∠15° = 1497.2 + j401.2 VA；|S| = 1550 VA', '落後。'),
        st('(c)', 'S = 288∠15° = 278.2 + j74.54 VA；|S| = 288 VA', '落後。'),
        st('(d)', 'S = 1360∠−45° = 961.7 − j961.7 VA；|S| = 1360 VA', '超前。')
      ],
      ans: '(a) 95.26 − j55 VA 超前　(b) 1497.2 + j401.2 VA 落後　(c) 278.2 + j74.54 VA 落後　(d) 961.7 − j961.7 VA 超前' },

    { id: 'p11-47', sec: '11.6', kind: 'pp', tag: 'Problem 11.47', title: '時域、相量、阻抗四種給法',
      q: '求下列各情形的複功率、平均功率與虛功率：(a) v(t) = 112 cos(ωt + 10°) V、i(t) = 4 cos(ωt − 50°) A　(b) v(t) = 160 cos 377t V、i(t) = 4 cos(377t + 45°) A　(c) V = 80∠60° V rms、Z = 50∠30° Ω　(d) I = 10∠60° A rms、Z = 100∠45° Ω',
      en: 'For each of the following cases, find the complex power, the average power, and the reactive power: (a) v(t) = 112 cos(ωt + 10°) V, i(t) = 4 cos(ωt − 50°) A (b) v(t) = 160 cos(377t) V, i(t) = 4 cos(377t + 45°) A (c) V = 80∠60° V rms, Z = 50∠30° Ω (d) I = 10∠60° A rms, Z = 100∠45° Ω',
      hint: '時域給的是峰值 → S = ½VI*；rms 相量 → S = VI* = |V|²/Z* = |I|²Z。',
      steps: [
        st('(a) 峰值。', 'S = ½ × 112 × 4∠60° = 224∠60° = 112 + j194 VA', ''),
        st('(b) 峰值。', 'S = ½ × 160 × 4∠−45° = 320∠−45° = 226.3 − j226.3 VA', ''),
        st('(c) rms，已知 V、Z。', 'S = |V|²/Z* = 6400/(50∠−30°) = 128∠30° = 110.9 + j64 VA', ''),
        st('(d) rms，已知 I、Z。', 'S = |I|²Z = 100 × 100∠45° = 7071 + j7071 VA', '')
      ],
      ans: '(a) 112 + j194 VA　(b) 226.3 − j226.3 VA　(c) 110.9 + j64 VA　(d) 7.071 + j7.071 kVA（P 是實部、Q 是虛部）' },

    { id: 'p11-48', sec: '11.6', kind: 'pp', tag: 'Problem 11.48', title: '用部分資訊組出 S',
      q: '求下列各情形的複功率：(a) P = 269 W、Q = 150 VAR（電容性）　(b) Q = 2000 VAR、pf = 0.9（超前）　(c) S = 600 VA、Q = 450 VAR（電感性）　(d) V<sub>rms</sub> = 220 V、P = 1 kW、|Z| = 40 Ω（電感性）',
      en: 'Determine the complex power for the following cases: (a) P = 269 W, Q = 150 VAR (capacitive) (b) Q = 2000 VAR, pf = 0.9 (leading) (c) S = 600 VA, Q = 450 VAR (inductive) (d) V<sub>rms</sub> = 220 V, P = 1 kW, |Z| = 40 Ω (inductive)',
      hint: '電容性／超前 → Q 取負號。功率三角形：|S|² = P² + Q²、Q = P tan θ。',
      steps: [
        st('(a)', 'S = 269 − j150 VA', '電容性 Q &lt; 0。'),
        st('(b)', 'tan θ = tan(cos<sup>−1</sup>0.9) = 0.4843；P = 2000/0.4843 = 4129.5 W；S = 4129.5 − j2000 VA', '超前 Q &lt; 0。'),
        st('(c)', 'P = √(600² − 450²) = 396.9 W；S = 396.9 + j450 VA', ''),
        st('(d)', '|S| = V²/|Z| = 48400/40 = 1210 VA；Q = √(1210² − 1000²) = 681.2 VAR；S = 1000 + j681.2 VA', '')
      ],
      ans: '(a) 269 − j150 VA　(b) 4129.5 − j2000 VA　(c) 396.9 + j450 VA　(d) 1000 + j681.2 VA' },

    { id: 'p11-49', sec: '11.6', kind: 'pp', tag: 'Problem 11.49', title: '再四種給法求 S',
      q: '求下列各情形的複功率：(a) P = 4 kW、pf = 0.86（落後）　(b) S = 2 kVA、P = 1.6 kW（電容性）　(c) V<sub>rms</sub> = 208∠20° V、I<sub>rms</sub> = 6.5∠−50° A　(d) V<sub>rms</sub> = 120∠30° V、Z = 40 + j60 Ω',
      en: 'Find the complex power for the following cases: (a) P = 4 kW, pf = 0.86 (lagging) (b) S = 2 kVA, P = 1.6 kW (capacitive) (c) V<sub>rms</sub> = 208∠20° V, I<sub>rms</sub> = 6.5∠−50° A (d) V<sub>rms</sub> = 120∠30° V, Z = 40 + j60 Ω',
      hint: 'Q = P tan(cos<sup>−1</sup>pf)；S = VI*；S = |V|²/Z*。',
      steps: [
        st('(a)', 'Q = 4000 tan(cos<sup>−1</sup>0.86) = 2373 VAR；S = 4000 + j2373 VA', ''),
        st('(b)', 'Q = −√(2000² − 1600²) = −1200 VAR；S = 1600 − j1200 VA', '電容性取負。'),
        st('(c)', 'S = 208∠20° × 6.5∠50° = 1352∠70° = 462.4 + j1270.5 VA', 'I* 的角度變號：−(−50°) = +50°。'),
        st('(d)', 'S = 120²/(40 − j60) = 110.8 + j166.2 VA', '')
      ],
      ans: '(a) 4 + j2.373 kVA　(b) 1.6 − j1.2 kVA　(c) 462.4 + j1270.5 VA　(d) 110.8 + j166.2 VA' },

    { id: 'p11-50', sec: '11.6', kind: 'pp', tag: 'Problem 11.50', title: '由功率反推阻抗',
      q: '求下列各情形的總阻抗：(a) P = 1000 W、pf = 0.8（超前）、V<sub>rms</sub> = 220 V　(b) P = 1500 W、Q = 2000 VAR（電感性）、I<sub>rms</sub> = 12 A　(c) S = 4500∠60° VA、V = 120∠45° V',
      en: 'Obtain the overall impedance for the following cases: (a) P = 1000 W, pf = 0.8 (leading), V<sub>rms</sub> = 220 V (b) P = 1500 W, Q = 2000 VAR (inductive), I<sub>rms</sub> = 12 A (c) S = 4500∠60° VA, V = 120∠45° V',
      hint: 'Z = |V|²/S*（已知電壓）或 Z = S/|I|²（已知電流）。',
      steps: [
        st('(a)', '|S| = 1000/0.8 = 1250 VA，S = 1000 − j750；Z = 220²/(1000 + j750) = 30.98 − j23.23 Ω', '超前 → Q &lt; 0。'),
        st('(b)', 'Z = S/|I|² = (1500 + j2000)/144 = 10.42 + j13.89 Ω', ''),
        st('(c)', 'Z = |V|²/S* = 14400/(4500∠−60°) = 3.2∠60° = 1.6 + j2.771 Ω', 'V 的相角不影響 |V|²。')
      ],
      ans: '(a) 30.98 − j23.23 Ω　(b) 10.42 + j13.89 Ω　(c) 1.6 + j2.771 Ω' }
  ];

  window.__CH11PB = window.__CH11PB || { book: 'Alexander & Sadiku', items: [] };
  window.__CH11PB.items = window.__CH11PB.items.concat(items);
})();
