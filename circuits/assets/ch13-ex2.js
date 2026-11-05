/* ============================================================
   電路學 CH13 課本例題與練習題（13.4～13.5：Example 13.4–13.9、Practice 13.4–13.9）
   Practice 的詳解自己解（Python 驗算過）。需要：schem.js、ch13-kit.js、ch13-ex.js（先建 __CH13EX）
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, K = window.__K13;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, parts, pad) => S.svg(w + (pad || 0), h, pad ? ['<g transform="translate(' + pad + ',0)">'].concat(parts, ['</g>']) : parts);
  const T = (x, y, s, a, fs) => S.t(x, y, s, a || 'middle', ' font-size="' + (fs || 11) + '"');
  const F = {
    f1324: G(400, 150, [S.vs(30, 40, 130, '50∠60° V'), S.z(30, 40, 120, 40, 'Z_1'), K.xf(120, 40, 130, { d1: 't', d2: 't', M: 'j5 Ω', l1: 'j20 Ω', l2: 'j40 Ω' }), S.w('30,130', '120,130'),
      S.z(146, 40, 240, 40, 'Z_2'), S.w('240,40', '280,40'), S.z(280, 40, 280, 130, 'Z_L', { side: 'r' }), S.w('146,130', '280,130'), T(75, 92, 'I_1 ↻'), T(205, 92, 'I_2 ↻')], 70),
    f1325: G(380, 160, [S.vs(30, 40, 140, '40∠0° V'), S.r(30, 40, 120, 40, '4 Ω'), K.xf(120, 40, 140, { d1: 't', d2: 'b', M: 'j3 Ω', l1: 'j8 Ω', l2: 'j10 Ω' }), S.w('30,140', '120,140'),
      S.c(146, 40, 240, 40, '−j6 Ω'), S.w('240,40', '270,40'), S.r(270, 40, 270, 90, '6 Ω', { side: 'r' }), S.l(270, 90, 270, 140, 'j4 Ω', { side: 'r' }), S.w('146,140', '270,140')], 70),
    f1326: G(330, 140, [S.term(20, 40), S.term(20, 120), T(10, 44, 'a', 'end', 12), T(10, 124, 'b', 'end', 12), S.w('20,40', '100,40'), S.w('20,120', '100,120'), K.ia(40, 70, 28, 'I_1'),
      K.xf(100, 40, 120, { d1: 't', d2: 't', M: '2 H', l1: '10 H', l2: '4 H' }), S.w('126,40', '200,40'), S.w('126,120', '200,120'), S.term(200, 40), S.term(200, 120), T(210, 44, 'c', 'start', 12), T(210, 124, 'd', 'start', 12), K.ia(185, 155, 28, 'I_2')], 20),
    f1327: G(360, 150, [S.vs(30, 40, 130, '60∠90° V'), S.r(30, 40, 120, 40, '4 Ω'), K.xf(120, 40, 130, { d1: 't', d2: 'b', M: 'j1 Ω', l1: 'j8 Ω', l2: 'j5 Ω' }), S.w('30,130', '120,130'),
      S.w('146,40', '250,40'), S.r(250, 40, 250, 130, '10 Ω', { side: 'l' }), S.w('146,130', '250,130'), K.pm(268, 62, 116, 'V_o'), T(75, 92, 'I_1 ↻'), T(200, 92, 'I_2 ↺')], 70),
    f1337: G(380, 150, [S.vs(30, 40, 130, '120∠0° V'), S.r(30, 40, 90, 40, '4 Ω'), S.c(90, 40, 150, 40, '−j6 Ω'), K.ia(40, 70, 26, 'I_1'), K.xf(150, 40, 130, { d1: 'b', d2: 't', n: '1 : 2' }), S.w('30,130', '150,130'),
      K.pm(136, 62, 116, ''), T(128, 90, 'V_1', 'end'), S.w('176,40', '280,40'), S.w('176,130', '280,130'), T(194, 90, 'V_2', 'start'), S.r(280, 40, 280, 130, '20 Ω', { side: 'l' }), K.pm(300, 62, 116, 'V_o'), K.ia(220, 250, 26, 'I_2')], 70),
    f1338: G(380, 150, [S.vs(30, 40, 130, '240∠0° V'), S.r(30, 40, 110, 40, '2 Ω'), K.ia(120, 150, 26, 'I_1'), K.xf(150, 40, 130, { d1: 't', d2: 'b', n: '1 : 4' }), S.w('110,40', '150,40'), S.w('30,130', '150,130'),
      T(128, 90, 'V_1', 'end'), T(194, 90, 'V_2', 'start'), K.ia(185, 215, 26, 'I_2'), S.r(176, 40, 270, 40, '16 Ω'), S.w('270,40', '290,40'), S.c(290, 40, 290, 130, '−j24 Ω', { side: 'r' }), S.w('176,130', '290,130'), T(260, 90, 'V_o', 'end')], 70),
    f1339: G(380, 200, [S.vs(30, 40, 180, '120∠0° V'), S.r(30, 40, 140, 40, '20 Ω'), K.xf(140, 40, 120, { d1: 't', d2: 'b', n: '2 : 1' }), T(128, 84, 'V_1', 'end'), T(180, 84, 'V_2', 'start'),
      S.w('140,120', '140,130', '166,130', '166,120'), S.dot(153, 130), S.r(153, 130, 153, 180, '30 Ω', { side: 'r' }), S.w('166,40', '280,40'), S.r(280, 40, 280, 180, '10 Ω', { side: 'r' }), S.w('30,180', '280,180'),
      T(80, 120, 'I_1 ↻'), T(225, 120, 'I_2 ↻')], 70),
    f1340: G(360, 180, [S.vs(30, 80, 170, '120∠0° V'), S.r(30, 80, 100, 80, '4 Ω'), S.dot(100, 80), S.w('100,80', '140,80'), K.xf(140, 80, 170, { d1: 't', d2: 'b', n: '1 : 2' }), S.w('30,170', '140,170'),
      S.r(166, 80, 260, 80, '2 Ω'), S.dot(260, 80), S.r(260, 80, 260, 170, '8 Ω', { side: 'r' }), S.w('166,170', '260,170'), S.w('100,80', '100,30'), S.r(100, 30, 260, 30, '8 Ω'), S.w('260,30', '260,80'), T(150, 48, '+'), T(210, 48, '−'), T(180, 50, 'V_o')], 70)
  };

  const items = [
    /* ═══════════ 13.4 線性變壓器 ═══════════ */
    { id: 'ex13-4', sec: '13.4', kind: 'ex', no: '13.4', title: '反射阻抗求 Z<sub>in</sub>、I<sub>1</sub>',
      q: '圖 13.24 中 Z<sub>1</sub> = 60 − j100 Ω、Z<sub>2</sub> = 30 + j40 Ω、Z<sub>L</sub> = 80 + j60 Ω，求輸入阻抗與電流 I<sub>1</sub>。',
      en: 'In the circuit of Fig. 13.24, calculate the input impedance and current I<sub>1</sub>. Take Z<sub>1</sub> = 60 − j100 Ω, Z<sub>2</sub> = 30 + j40 Ω, and Z<sub>L</sub> = 80 + j60 Ω.',
      fig: F.f1324, cap: '圖 13.24（重畫）',
      idea: '直接套式 13.41：Z<sub>in</sub> = 一次側阻抗 + 反射阻抗 ω<sup>2</sup>M<sup>2</sup>/(二次側總阻抗)。點的位置不影響（M 平方）。',
      steps: [
        st('套反射阻抗公式。', 'Z<sub>in</sub> = Z<sub>1</sub> + j20 + (5)<sup>2</sup>/(j40 + Z<sub>2</sub> + Z<sub>L</sub>)', 'ωM = 5 Ω。'),
        st('二次側總阻抗。', 'j40 + 30 + j40 + 80 + j60 = 110 + j140 Ω', ''),
        st('反射阻抗。', '25/(110 + j140) = 0.14∠−51.84° Ω', ''),
        st('加起來。', 'Z<sub>in</sub> = 60 − j80 + 0.14∠−51.84° = 60.09 − j80.11 = 100.14∠−53.1° Ω', ''),
        st('I<sub>1</sub>。', 'I<sub>1</sub> = 50∠60°/100.14∠−53.1° = 0.5∠113.1° A', '')
      ],
      ans: 'Z<sub>in</sub> = 100.14∠−53.1° Ω；I<sub>1</sub> = 0.5∠113.1° A' },
    { id: 'pp13-4', sec: '13.4', kind: 'pp', no: '13.4', title: '反射阻抗：求 Z<sub>in</sub> 與電源電流',
      q: '求圖 13.25 電路的輸入阻抗，以及電壓源送出的電流。', en: 'Find the input impedance of the circuit in Fig. 13.25 and the current from the voltage source.',
      fig: F.f1325, cap: '圖 13.25（重畫）',
      hint: 'Z<sub>22</sub> = j10 − j6 + 6 + j4；反射阻抗 (ωM)<sup>2</sup>/Z<sub>22</sub>，ωM = 3。',
      steps: [
        st('二次側總阻抗。', 'Z<sub>22</sub> = j10 − j6 + 6 + j4 = 6 + j8 Ω', ''),
        st('反射阻抗。', 'Z<sub>R</sub> = 9/(6 + j8) = 0.54 − j0.72 Ω', ''),
        st('Z<sub>in</sub>。', 'Z<sub>in</sub> = 4 + j8 + 0.54 − j0.72 = 4.54 + j7.28 = 8.58∠58.05° Ω', ''),
        st('電流。', 'I = 40/8.58∠58.05° = 4.662∠−58.05° A', '')
      ],
      ans: 'Z<sub>in</sub> ≈ 8.58∠58.05° Ω；I ≈ 4.662∠−58.05° A' },
    { id: 'ex13-5', sec: '13.4', kind: 'ex', no: '13.5', title: '線性變壓器的 T 型等效',
      q: '求圖 13.26(a) 線性變壓器的 T 型等效電路。', en: 'Determine the T-equivalent circuit of the linear transformer in Fig. 13.26(a).',
      fig: F.f1326, cap: '圖 13.26(a)（重畫）',
      idea: '電流方向、電壓極性跟課本圖 13.21 一樣（兩個電流都流進點），直接套式 13.46。',
      steps: [
        st('讀數字。', 'L<sub>1</sub> = 10 H、L<sub>2</sub> = 4 H、M = 2 H', ''),
        st('套 T 型公式。', 'L<sub>a</sub> = L<sub>1</sub> − M = 8 H；L<sub>b</sub> = L<sub>2</sub> − M = 2 H；L<sub>c</sub> = M = 2 H', 'L<sub>a</sub>、L<sub>b</sub> 是兩邊的串聯臂，L<sub>c</sub> 是中間接到下面的那支。')
      ],
      ans: 'L<sub>a</sub> = 8 H、L<sub>b</sub> = 2 H、L<sub>c</sub> = 2 H（不再有互感）' },
    { id: 'pp13-5', sec: '13.4', kind: 'pp', no: '13.5', title: '同一個變壓器的 Π 型等效',
      q: '求圖 13.26(a) 線性變壓器的 Π 型等效電路。', en: 'For the linear transformer in Fig. 13.26(a), find the Π equivalent network.',
      fig: F.f1326, cap: '圖 13.26(a)（重畫）',
      hint: '式 13.48：分子都是 L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>。',
      steps: [
        st('共同分子。', 'L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup> = 40 − 4 = 36', ''),
        st('三支電感。', 'L<sub>A</sub> = 36/(L<sub>2</sub> − M) = 36/2 = 18 H；L<sub>B</sub> = 36/(L<sub>1</sub> − M) = 36/8 = 4.5 H；L<sub>C</sub> = 36/M = 18 H', 'L<sub>A</sub>（一次側並聯）分母是 L<sub>2</sub> − M，別寫反。')
      ],
      ans: 'L<sub>A</sub> = 18 H、L<sub>B</sub> = 4.5 H、L<sub>C</sub> = 18 H' },
    { id: 'ex13-6', sec: '13.4', kind: 'ex', no: '13.6', title: '用 T 型等效解電路（M 變負）',
      q: '用線性變壓器的 T 型等效，求圖 13.27 的 I<sub>1</sub>、I<sub>2</sub>、V<sub>o</sub>（跟 Practice 13.1 同一個電路）。',
      en: 'Solve for I<sub>1</sub>, I<sub>2</sub>, and V<sub>o</sub> in Fig. 13.27 (the same circuit as for Practice Prob. 13.1) using the T-equivalent circuit for the linear transformer.',
      fig: F.f1327, cap: '圖 13.27（重畫）',
      idea: '圖 13.27 二次側的點在下面，跟標準圖 13.21 不一樣 → 套 T 型時把 M 換成 −M。ω 沒給，取 ω = 1 也行（阻抗直接用）。',
      steps: [
        st('換 −M。', 'L<sub>a</sub> = L<sub>1</sub> − (−M) = 8 + 1 = 9；L<sub>b</sub> = 5 + 1 = 6；L<sub>c</sub> = −1（單位 Ω）', '中間支 −j1 像電容，物理上做不出來，但數學上成立。'),
        st('網目 1。', 'j6 = I<sub>1</sub>(4 + j9 − j1) + I<sub>2</sub>(−j1)', '課本這一步用 j6 V（見下方附註）。'),
        st('網目 2。', '0 = I<sub>1</sub>(−j1) + I<sub>2</sub>(10 + j6 − j1)　⟹　I<sub>1</sub> = (5 − j10)I<sub>2</sub>', ''),
        st('代入。', 'j6 = (4 + j8)(5 − j10)I<sub>2</sub> − jI<sub>2</sub> = (100 − j)I<sub>2</sub> ≈ 100I<sub>2</sub> ⟹ I<sub>2</sub> = 0.06∠90° A', '100 ≫ 1，虛部 j 可以忽略。'),
        st('I<sub>1</sub>、V<sub>o</sub>。', 'I<sub>1</sub> = (5 − j10)(j0.06) = 0.6 + j0.3 A；V<sub>o</sub> = −10I<sub>2</sub> = 0.6∠−90° V', 'I<sub>2</sub> 方向跟 Practice 13.1 相反，所以有負號；V<sub>o</sub> 不受影響。')
      ],
      ans: 'I<sub>2</sub> ≈ 0.06∠90° A、I<sub>1</sub> = 0.6 + j0.3 A、V<sub>o</sub> = 0.6∠−90° V（課本用 j6 V）',
      note: '課本圖 13.27 的電源寫 60∠90° V，但解答（和圖 13.29）用 j6 V。照圖上的 60∠90° V 算，每個答案都乘 10：V<sub>o</sub> = 6∠−90° V。請以老師版本為準。' },
    { id: 'pp13-6', sec: '13.4', kind: 'pp', no: '13.6', title: '用 T 型等效重解 Example 13.1',
      q: '用 T 型等效重解 Example 13.1（圖 13.9）。', en: 'Solve the problem in Example 13.1 (see Fig. 13.9) using the T-equivalent model for the magnetically coupled coils.',
      fig: window.__CH13EX && window.__CH13EX.F ? window.__CH13EX.F.f139 : '', cap: '圖 13.9（重畫）',
      hint: '兩個點都在上面、電流方向跟標準圖一樣（I<sub>2</sub> 要改成流進點的方向看）→ L<sub>a</sub> = j5 − j3、L<sub>b</sub> = j6 − j3、L<sub>c</sub> = j3。',
      steps: [
        st('T 型。', 'j2、j3（串聯臂），中間 j3', '兩個點都在上。'),
        st('網目 1。', '12 = (−j4 + j2 + j3)I<sub>1</sub> − j3I<sub>2</sub>', 'I<sub>2</sub> 順時針在中間支上跟 I<sub>1</sub> 反向。'),
        st('網目 2。', '0 = −j3I<sub>1</sub> + (j3 + j3 + 12)I<sub>2</sub>', ''),
        st('解。', 'I<sub>1</sub> = 13.01∠−49.39° A；I<sub>2</sub> = 2.91∠14.04° A', '跟 Example 13.1 一樣 —— 方程式本來就是同一組。')
      ],
      ans: 'I<sub>1</sub> ≈ 13∠−49.4° A；I<sub>2</sub> ≈ 2.91∠14.04° A' },

    /* ═══════════ 13.5 理想變壓器 ═══════════ */
    { id: 'ex13-7', sec: '13.5', kind: 'ex', no: '13.7', title: '理想變壓器的額定',
      q: '一個理想變壓器額定 2400/120 V、9.6 kVA，二次側 50 匝。求 (a) 匝數比 (b) 一次側匝數 (c) 一次、二次側的電流額定。',
      en: 'An ideal transformer is rated at 2400/120 V, 9.6 kVA, and has 50 turns on the secondary side. Calculate: (a) the turns ratio, (b) the number of turns on the primary side, and (c) the current ratings for the primary and secondary windings.',
      idea: '額定 V<sub>1</sub>/V<sub>2</sub> = 2400/120：降壓。n = V<sub>2</sub>/V<sub>1</sub>；理想變壓器 S<sub>1</sub> = S<sub>2</sub>。',
      steps: [
        st('(a) 匝數比。', 'n = V<sub>2</sub>/V<sub>1</sub> = 120/2400 = 0.05', 'V<sub>1</sub> &gt; V<sub>2</sub>，降壓。'),
        st('(b) 一次側匝數。', 'n = N<sub>2</sub>/N<sub>1</sub> ⟹ N<sub>1</sub> = 50/0.05 = 1000 匝', ''),
        st('(c) 電流額定。', 'I<sub>1</sub> = 9600/2400 = 4 A；I<sub>2</sub> = 9600/120 = 80 A（或 I<sub>1</sub>/n = 80 A）', 'S = V<sub>1</sub>I<sub>1</sub> = V<sub>2</sub>I<sub>2</sub>。')
      ],
      ans: '(a) n = 0.05　(b) 1000 匝　(c) 4 A、80 A' },
    { id: 'pp13-7', sec: '13.5', kind: 'pp', no: '13.7', title: '由一次側電流求額定',
      q: '額定 2200/110 V 的理想變壓器，一次側電流 5 A。求 (a) 匝數比 (b) kVA 額定 (c) 二次側電流。',
      en: 'The primary current to an ideal transformer rated at 2200/110 V is 5 A. Calculate: (a) the turns ratio, (b) the kVA rating, (c) the secondary current.',
      hint: 'n = 110/2200；S = V<sub>1</sub>I<sub>1</sub>；I<sub>2</sub> = I<sub>1</sub>/n。',
      steps: [
        st('(a)。', 'n = 110/2200 = 1/20', ''),
        st('(b)。', 'S = 2200 × 5 = 11 kVA', ''),
        st('(c)。', 'I<sub>2</sub> = 5/(1/20) = 100 A', '')
      ],
      ans: '(a) 1/20　(b) 11 kVA　(c) 100 A' },
    { id: 'ex13-8', sec: '13.5', kind: 'ex', no: '13.8', title: '反射阻抗＋點的正負號',
      q: '圖 13.37 的理想變壓器電路，求 (a) 電源電流 I<sub>1</sub> (b) 輸出電壓 V<sub>o</sub> (c) 電源送出的複功率。',
      en: 'For the ideal transformer circuit of Fig. 13.37, find: (a) the source current I<sub>1</sub>, (b) the output voltage V<sub>o</sub>, and (c) the complex power supplied by the source.',
      fig: F.f1337, cap: '圖 13.37（重畫）',
      idea: '先把 20 Ω 反射到一次側求 I<sub>1</sub>；再看點決定 I<sub>2</sub> 的正負號。',
      steps: [
        st('(a) 反射。', 'Z<sub>R</sub> = 20/n<sup>2</sup> = 20/4 = 5 Ω', 'n = 2。'),
        st('(a) 一次側。', 'Z<sub>in</sub> = 4 − j6 + 5 = 9 − j6 = 10.82∠−33.69° Ω ⟹ I<sub>1</sub> = 120/Z<sub>in</sub> = 11.09∠33.69° A', ''),
        st('(b) 看點。', 'I<sub>1</sub>、I<sub>2</sub> 都從點流出 ⟹ I<sub>2</sub> = −I<sub>1</sub>/n = −5.545∠33.69° A', '一次側點在下、I<sub>1</sub> 從上面流進 = 從點流出；二次側點在上、I<sub>2</sub> 從上面流出。'),
        st('(b) V<sub>o</sub>。', 'V<sub>o</sub> = 20I<sub>2</sub> = 110.9∠213.69° V', ''),
        st('(c) 複功率。', 'S = V<sub>s</sub>I<sub>1</sub>* = (120∠0°)(11.09∠−33.69°) = 1330.8∠−33.69° VA', '')
      ],
      ans: '(a) I<sub>1</sub> = 11.09∠33.69° A　(b) V<sub>o</sub> = 110.9∠213.69° V　(c) S = 1330.8∠−33.69° VA' },
    { id: 'pp13-8', sec: '13.5', kind: 'pp', no: '13.8', title: '求 V<sub>o</sub> 與電源複功率',
      q: '求圖 13.38 理想變壓器電路的 V<sub>o</sub>，以及電源送出的複功率。', en: 'In the ideal transformer circuit of Fig. 13.38, find V<sub>o</sub> and the complex power supplied by the source.',
      fig: F.f1338, cap: '圖 13.38（重畫）',
      hint: 'n = 4，反射 (16 − j24)/16。一次側點在上、二次側點在下：V<sub>2</sub> = −4V<sub>1</sub>；I<sub>1</sub> 從點流進、I<sub>2</sub> 從二次側上端流出 = 從下端（點）流進 ⟹ 都進點，I<sub>2</sub> = −I<sub>1</sub>/4。',
      steps: [
        st('反射。', 'Z<sub>R</sub> = (16 − j24)/16 = 1 − j1.5 Ω', ''),
        st('I<sub>1</sub>。', 'I<sub>1</sub> = 240/(2 + 1 − j1.5) = 71.55∠26.57° A', ''),
        st('I<sub>2</sub>。', 'I<sub>2</sub> = −I<sub>1</sub>/4 = 17.89∠−153.43° A', '兩個電流都流進點 → 取負。'),
        st('V<sub>o</sub>。', 'V<sub>o</sub> = −j24 · I<sub>2</sub> = 429.4∠116.57° V', ''),
        st('複功率。', 'S = 240 · I<sub>1</sub>* = 17.17∠−26.57° kVA', '')
      ],
      ans: 'V<sub>o</sub> ≈ 429.4∠116.57° V；S ≈ 17.174∠−26.57° kVA' },
    { id: 'ex13-9', sec: '13.5', kind: 'ex', no: '13.9', title: '一、二次側有共用電阻：不能反射',
      q: '求圖 13.39 理想變壓器電路中 10 Ω 電阻吃的功率。', en: 'Calculate the power supplied to the 10-Ω resistor in the ideal transformer circuit of Fig. 13.39.',
      fig: F.f1339, cap: '圖 13.39（重畫）',
      idea: '30 Ω 把一次、二次側直接連在一起 —— 不能用反射。改用網目分析，再補上變壓器的兩條關係式。',
      steps: [
        st('網目 1。', '−120 + (20 + 30)I<sub>1</sub> − 30I<sub>2</sub> + V<sub>1</sub> = 0　⟹　50I<sub>1</sub> − 30I<sub>2</sub> + V<sub>1</sub> = 120', ''),
        st('網目 2。', '−V<sub>2</sub> + (10 + 30)I<sub>2</sub> − 30I<sub>1</sub> = 0', ''),
        st('變壓器兩端的關係。', 'V<sub>2</sub> = −½V<sub>1</sub>；I<sub>2</sub> = −2I<sub>1</sub>', 'n = ½；V<sub>1</sub> 的 + 在點、V<sub>2</sub> 的 + 不在點 → 負號；電流同理。'),
        st('代入消去。', '−55I<sub>2</sub> − 2V<sub>2</sub> = 120；15I<sub>2</sub> + 40I<sub>2</sub> − V<sub>2</sub> = 0 ⟹ V<sub>2</sub> = 55I<sub>2</sub>', ''),
        st('解 I<sub>2</sub>。', '−165I<sub>2</sub> = 120 ⟹ I<sub>2</sub> = −0.7272 A', ''),
        st('功率。', 'P = (−0.7272)<sup>2</sup>(10) = 5.3 W', '')
      ],
      ans: 'P ≈ 5.3 W' },
    { id: 'pp13-9', sec: '13.5', kind: 'pp', no: '13.9', title: '有外部連線的理想變壓器',
      q: '求圖 13.40 電路中的 V<sub>o</sub>。', en: 'Find V<sub>o</sub> in the circuit of Fig. 13.40.',
      fig: F.f1340, cap: '圖 13.40（重畫）',
      hint: '上面那個 8 Ω 把一次、二次側連起來，不能反射。用節點：V<sub>A</sub>（一次側上端）、V<sub>C</sub>（右上節點），變壓器 V<sub>2</sub> = −2V<sub>1</sub>、I<sub>1</sub> = −2I<sub>2</sub>。',
      steps: [
        st('變壓器關係。', 'V<sub>1</sub> = V<sub>A</sub>，V<sub>2</sub> = −2V<sub>A</sub>（點一上一下）；I<sub>2</sub>（從二次側上端流出）= (V<sub>2</sub> − V<sub>C</sub>)/2，I<sub>1</sub> = −2I<sub>2</sub>', 'I<sub>1</sub> 從點流進、I<sub>2</sub> 從上端流出 = 從下端（點）流進 → 都進點，取負。'),
        st('節點 A。', '(120 − V<sub>A</sub>)/4 = I<sub>1</sub> + (V<sub>A</sub> − V<sub>C</sub>)/8', ''),
        st('節點 C。', '(V<sub>A</sub> − V<sub>C</sub>)/8 + (V<sub>2</sub> − V<sub>C</sub>)/2 = V<sub>C</sub>/8', ''),
        st('解。', 'V<sub>A</sub> = 22.15 V、V<sub>C</sub> = −25.85 V', ''),
        st('V<sub>o</sub>。', 'V<sub>o</sub> = V<sub>A</sub> − V<sub>C</sub> = 48 V', '')
      ],
      ans: 'V<sub>o</sub> = 48 V' }
  ];

  window.__CH13EX = window.__CH13EX || { book: 'Alexander & Sadiku', items: [], autoAll: true };
  window.__CH13EX.items = window.__CH13EX.items.concat(items);
  window.__CH13EX.F = Object.assign(window.__CH13EX.F || {}, F);
})();
