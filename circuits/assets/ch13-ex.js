/* ============================================================
   電路學 CH13 課本例題與練習題（13.2～13.3：Example 13.1–13.3、Practice 13.1–13.3）
   課本：Alexander & Sadiku, Fundamentals of Electric Circuits, Ch.13（使用者 11/5 提供）
   - Example：照課本解法拆成「做什麼 + 算式 + 為什麼」；Practice：課本只給答案，詳解自己解（Python 驗算）
   - 🎬 圖解故事：prob-story.js 依 bank.autoAll 自動產生（圖 → 每一步 → 答案）
   下一部分（13.4～13.9）在 ch13-ex2.js，都塞進 window.__CH13EX.items
   需要：schem.js、ch13-kit.js
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, K = window.__K13;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, parts, pad) => S.svg(w + (pad || 0), h, pad ? ['<g transform="translate(' + pad + ',0)">'].concat(parts, ['</g>']) : parts);
  const T = (x, y, s, a, fs) => S.t(x, y, s, a || 'middle', ' font-size="' + (fs || 11) + '"');
  const F = {
    f139: G(330, 150, [S.vs(30, 40, 130, '12∠0° V'), S.c(30, 40, 120, 40, '−j4 Ω'), K.xf(120, 40, 130, { d1: 't', d2: 't', M: 'j3 Ω', l1: 'j5 Ω', l2: 'j6 Ω' }), S.w('30,130', '120,130'),
      S.w('146,40', '250,40'), S.r(250, 40, 250, 130, '12 Ω', { side: 'r' }), S.w('146,130', '250,130'), T(75, 92, 'I_1 ↻'), T(200, 92, 'I_2 ↻')], 70),
    f1310: G(350, 150, [S.vs(30, 40, 130, '200∠45° V'), S.r(30, 40, 120, 40, '4 Ω'), K.xf(120, 40, 130, { d1: 't', d2: 'b', M: 'j1 Ω', l1: 'j8 Ω', l2: 'j5 Ω' }), S.w('30,130', '120,130'),
      S.w('146,40', '260,40'), S.r(260, 40, 260, 130, '10 Ω', { side: 'l' }), S.w('146,130', '260,130'), S.w('260,40', '300,40'), S.w('260,130', '300,130'), S.term(300, 40), S.term(300, 130), K.pm(310, 62, 116, 'V_o'),
      T(75, 92, 'I_1 ↻'), T(200, 92, 'I_2 ↻')], 80),
    f1311: G(340, 170, [S.vs(30, 50, 150, '100∠0° V'), S.r(30, 50, 90, 50, '4 Ω'), S.c(90, 50, 150, 50, '−j3 Ω'), S.dot(160, 50), S.w('150,50', '160,50'),
      K.coil(160, 50, 150, 1), K.dt(150, 80), T(176, 104, 'j6 Ω', 'start'), S.w('30,150', '260,150'),
      S.w('160,50', '190,50'), K.hcoil(190, 240, 50), S.w('240,50', '260,50'), K.dt(244, 40), T(215, 36, 'j8 Ω'),
      S.r(260, 50, 260, 150, '5 Ω', { side: 'r' }), K.arc2(170, 96, 228, 60, 214, 96, 'j2 Ω', 236, 100), T(95, 104, 'I_1 ↻'), T(215, 128, 'I_2 ↻')], 70),
    f1313: G(340, 170, [S.vs(30, 50, 150, '100∠60° V'), S.r(30, 50, 90, 50, '5 Ω'), K.hcoil(90, 140, 50), K.dt(92, 40), T(115, 36, 'j2 Ω'), S.w('140,50', '170,50'), S.dot(170, 50),
      K.coil(170, 50, 150, 1), K.dt(160, 124), T(186, 104, 'j6 Ω', 'start'), K.arc2(118, 60, 160, 118, 122, 112, 'j3 Ω', 102, 100),
      S.w('170,50', '270,50'), S.c(270, 50, 270, 150, '−j4 Ω', { side: 'r' }), S.w('30,150', '270,150'), S.dot(170, 150), T(80, 120, 'I_1 ↻'), T(225, 104, 'I_2 ↻')], 80),
    f1316: G(340, 150, [S.vs(30, 40, 130, 'v'), S.r(30, 40, 120, 40, '10 Ω'), K.xf(120, 40, 130, { d1: 't', d2: 'b', M: '2.5 H', l1: '5 H', l2: '4 H' }), S.w('30,130', '120,130'),
      S.w('146,40', '250,40'), S.c(250, 40, 250, 130, '1/16 F', { side: 'r' }), S.w('146,130', '250,130')], 40),
    f1318: G(360, 150, [S.vs(30, 40, 130, '100 cos 2t V'), S.r(30, 40, 80, 40, '4 Ω'), S.c(80, 40, 130, 40, '1/8 F'), K.xf(130, 40, 130, { d1: 'b', d2: 'b', M: '1 H', l1: '2 H', l2: '1 H' }), S.w('30,130', '130,130'),
      S.w('156,40', '260,40'), S.r(260, 40, 260, 130, '2 Ω', { side: 'r' }), S.w('156,130', '260,130')], 100)
  };

  const items = [
    /* ═══════════ 13.2 互感 ═══════════ */
    { id: 'ex13-1', sec: '13.2', kind: 'ex', no: '13.1', title: '兩個網目、一組耦合線圈',
      q: '求圖 13.9 電路的相量電流 I<sub>1</sub> 和 I<sub>2</sub>。', en: 'Calculate the phasor currents I<sub>1</sub> and I<sub>2</sub> in the circuit of Fig. 13.9.',
      fig: F.f139, cap: '圖 13.9（重畫）',
      idea: '兩個網目各寫 KVL。互感項的正負：I<sub>1</sub> 從點流進線圈 1；I<sub>2</sub>（順時針）從線圈 2 的點流出 → 一進一出，取 −j3。',
      steps: [
        st('迴路 1 的 KVL。', '−12 + (−j4 + j5)I<sub>1</sub> − j3I<sub>2</sub> = 0　⟹　jI<sub>1</sub> − j3I<sub>2</sub> = 12', '−j4 是電容、j5 是線圈 1 的自感；I<sub>2</sub> 從線圈 2 的點流出，在線圈 1 感應的電壓取負。'),
        st('迴路 2 的 KVL。', '−j3I<sub>1</sub> + (12 + j6)I<sub>2</sub> = 0', '同理，I<sub>1</sub> 從點流進線圈 1、I<sub>2</sub> 從點流出線圈 2，互感項一樣取負。'),
        st('從迴路 2 解出 I<sub>1</sub>。', 'I<sub>1</sub> = (12 + j6)I<sub>2</sub>/(j3) = (2 − j4)I<sub>2</sub>', '除以 j3：(12 + j6)/j3 = 2 − j4。'),
        st('代回迴路 1。', '(j2 + 4 − j3)I<sub>2</sub> = (4 − j)I<sub>2</sub> = 12　⟹　I<sub>2</sub> = 2.91∠14.04° A', 'j(2 − j4) = j2 + 4。'),
        st('求 I<sub>1</sub>。', 'I<sub>1</sub> = (2 − j4)I<sub>2</sub> = (4.472∠−63.43°)(2.91∠14.04°) = 13.01∠−49.39° A', '')
      ],
      ans: 'I<sub>1</sub> = 13.01∠−49.39° A；I<sub>2</sub> = 2.91∠14.04° A' },
    { id: 'pp13-1', sec: '13.2', kind: 'pp', no: '13.1', title: '求負載電壓 V<sub>o</sub>',
      q: '求圖 13.10 電路中的電壓 V<sub>o</sub>。', en: 'Determine the voltage V<sub>o</sub> in the circuit of Fig. 13.10.',
      fig: F.f1310, cap: '圖 13.10（重畫）',
      hint: 'I<sub>1</sub> 從線圈 1 的點流進；I<sub>2</sub> 順時針是從線圈 2 下面（有點）往上流 → 也是流進點 ⟹ 互感取 +j1。',
      steps: [
        st('迴路 1。', '200∠45° = (4 + j8)I<sub>1</sub> + j1·I<sub>2</sub>', '兩個電流都流進點，互感項取 +。'),
        st('迴路 2。', '0 = j1·I<sub>1</sub> + (10 + j5)I<sub>2</sub>', ''),
        st('解聯立。', 'I<sub>1</sub> = 22.36∠−17.86° A；I<sub>2</sub> = 2∠−134.43° A', ''),
        st('V<sub>o</sub>。', 'V<sub>o</sub> = 10I<sub>2</sub> = 20∠−134.43° V', 'I<sub>2</sub> 順時針由上往下流過 10 Ω，跟 V<sub>o</sub> 的 + 在上一致。')
      ],
      ans: 'V<sub>o</sub> ≈ 20∠−134.4° V（課本答案 20∠−135° V）' },
    { id: 'ex13-2', sec: '13.2', kind: 'ex', no: '13.2', title: '共用支路上的耦合線圈',
      q: '求圖 13.11 電路的網目電流。', en: 'Calculate the mesh currents in the circuit of Fig. 13.11.',
      fig: F.f1311, cap: '圖 13.11（重畫）',
      idea: '線圈 1（j6）在兩個網目共用的支路上，線圈 2（j8）只在網目 2。每個線圈都先寫「流過它的電流」，再判斷互感正負；課本建議把相關部分重畫成相依電壓源（圖 13.12）。',
      steps: [
        st('線圈 1 上的互感電壓。', 'I<sub>2</sub> 從線圈 2 的點流出，順時針 KVL ⟹ 線圈 1 上多一項 −j2I<sub>2</sub>', '線圈 1 是 j6，線圈 2 是 j8。'),
        st('網目 1。', '−100 + I<sub>1</sub>(4 − j3 + j6) − j6I<sub>2</sub> − j2I<sub>2</sub> = 0　⟹　100 = (4 + j3)I<sub>1</sub> − j8I<sub>2</sub>', 'j6 支路的電流是 I<sub>1</sub> − I<sub>2</sub>。'),
        st('網目 2。', '0 = −j2I<sub>1</sub> − j6I<sub>1</sub> + (j6 + j8 + j2 × 2 + 5)I<sub>2</sub>　⟹　0 = −j8I<sub>1</sub> + (5 + j18)I<sub>2</sub>', 'I<sub>2</sub> 兩次都從點流出（串聯加成，式 13.18）→ +2 × j2；I<sub>1</sub> 經線圈 1 在線圈 2 感應 −j2I<sub>1</sub>。'),
        st('克拉瑪法則。', 'Δ = 30 + j87；Δ<sub>1</sub> = 100(5 + j18)；Δ<sub>2</sub> = j800', ''),
        st('網目電流。', 'I<sub>1</sub> = Δ<sub>1</sub>/Δ = 20.3∠3.5° A；I<sub>2</sub> = Δ<sub>2</sub>/Δ = 8.693∠19° A', '')
      ],
      ans: 'I<sub>1</sub> = 20.3∠3.5° A；I<sub>2</sub> = 8.693∠19° A' },
    { id: 'pp13-2', sec: '13.2', kind: 'pp', no: '13.2', title: '共用支路：求 I<sub>1</sub>、I<sub>2</sub>',
      q: '求圖 13.13 電路的相量電流 I<sub>1</sub> 和 I<sub>2</sub>。', en: 'Determine the phasor currents I<sub>1</sub> and I<sub>2</sub> in the circuit of Fig. 13.13.',
      fig: F.f1313, cap: '圖 13.13（重畫）',
      hint: 'j2 線圈只有 I<sub>1</sub> 流過（從點進）；j6 線圈流過 I<sub>1</sub> − I<sub>2</sub>（往下，點在下面 → 流進點的是往上的 I<sub>2</sub> − I<sub>1</sub>）。',
      steps: [
        st('兩個線圈「點端對非點端」的電壓。', 'V<sub>j2</sub> = j2I<sub>1</sub> + j3(I<sub>2</sub> − I<sub>1</sub>)；V<sub>j6</sub> = j6(I<sub>2</sub> − I<sub>1</sub>) + j3I<sub>1</sub>', '自感乘自己流進點的電流，互感乘對方流進點的電流。'),
        st('網目 1。', '100∠60° = 5I<sub>1</sub> + V<sub>j2</sub> − V<sub>j6</sub> = (5 + j2)I<sub>1</sub> − j3I<sub>2</sub>', 'j2 由左到右是點→非點（+V）；j6 由上到下是非點→點（−V）。'),
        st('網目 2。', '0 = −j4I<sub>2</sub> + V<sub>j6</sub> = −j3I<sub>1</sub> + j2I<sub>2</sub>', 'j6 由下到上是點→非點。'),
        st('解聯立。', 'I<sub>1</sub> = 17.89∠86.57° A；I<sub>2</sub> = 26.83∠86.57° A', '')
      ],
      ans: 'I<sub>1</sub> ≈ 17.889∠86.57° A；I<sub>2</sub> ≈ 26.83∠86.57° A' },

    /* ═══════════ 13.3 耦合電路的能量 ═══════════ */
    { id: 'ex13-3', sec: '13.3', kind: 'ex', no: '13.3', title: '耦合係數與儲存能量',
      q: '圖 13.16 中，求耦合係數。若 v = 60 cos(4t + 30°) V，求 t = 1 s 時耦合線圈儲存的能量。',
      en: 'Consider the circuit in Fig. 13.16. Determine the coupling coefficient. Calculate the energy stored in the coupled inductors at time t = 1 s if v = 60 cos(4t + 30°) V.',
      fig: F.f1316, cap: '圖 13.16（重畫）',
      idea: '先用 k = M/√(L<sub>1</sub>L<sub>2</sub>)；能量要瞬時電流，所以先在頻域解出 I<sub>1</sub>、I<sub>2</sub>，再換回時域代 t = 1 s。',
      steps: [
        st('耦合係數。', 'k = M/√(L<sub>1</sub>L<sub>2</sub>) = 2.5/√20 = 0.56', '&gt; 0.5，緊耦合。'),
        st('換成頻域（ω = 4）。', '60∠30°；5 H → j20、2.5 H → j10、4 H → j16、1/16 F → −j4 Ω', ''),
        st('網目 1、網目 2。', '(10 + j20)I<sub>1</sub> + j10I<sub>2</sub> = 60∠30°；j10I<sub>1</sub> + (j16 − j4)I<sub>2</sub> = 0', 'I<sub>1</sub> 從點流進線圈 1，I<sub>2</sub> 從下面（點）流進線圈 2 → 互感取 +。'),
        st('解。', 'I<sub>1</sub> = −1.2I<sub>2</sub>；I<sub>2</sub> = 3.254∠160.6° A、I<sub>1</sub> = 3.905∠−19.4° A', ''),
        st('換回時域，代 t = 1 s。', '4t = 4 rad = 229.2°：i<sub>1</sub> = 3.905 cos(229.2° − 19.4°) = −3.389 A；i<sub>2</sub> = 3.254 cos(229.2° + 160.6°) = 2.824 A', ''),
        st('能量。', 'w = ½(5)(−3.389)<sup>2</sup> + ½(4)(2.824)<sup>2</sup> + 2.5(−3.389)(2.824) = 20.73 J', '兩個電流都流進點 → 互感項取 +。')
      ],
      ans: 'k = 0.56；w(1 s) = 20.73 J' },
    { id: 'pp13-3', sec: '13.3', kind: 'pp', no: '13.3', title: '求 k 和 t = 1.5 s 的能量',
      q: '求圖 13.18 電路的耦合係數，以及 t = 1.5 s 時耦合線圈儲存的能量。', en: 'For the circuit in Fig. 13.18, determine the coupling coefficient and the energy stored in the coupled inductors at t = 1.5 s.',
      fig: F.f1318, cap: '圖 13.18（重畫）',
      hint: 'ω = 2：2 H → j4、1 H → j2、M → j2、1/8 F → −j4。兩個點都在下面；I<sub>1</sub>（順時針）從上面流進線圈 1，I<sub>2</sub>（順時針）從下面流進線圈 2 ⟹ 一進一出。',
      steps: [
        st('耦合係數。', 'k = 1/√(2 × 1) = 0.7071', ''),
        st('網目 1。', '100 = (4 − j4 + j4)I<sub>1</sub> − j2I<sub>2</sub> = 4I<sub>1</sub> − j2I<sub>2</sub>', '一進一出 → 互感取負。電容和自感剛好抵消。'),
        st('網目 2。', '0 = −j2I<sub>1</sub> + (2 + j2)I<sub>2</sub>', ''),
        st('解。', 'I<sub>1</sub> = 19.61∠11.31° A；I<sub>2</sub> = 13.87∠56.31° A', ''),
        st('t = 1.5 s（2t = 3 rad = 171.9°）。', 'i<sub>1</sub> = −19.58 A；i<sub>2</sub> = −9.244 A', ''),
        st('能量。', 'w = ½(2)i<sub>1</sub><sup>2</sup> + ½(1)i<sub>2</sub><sup>2</sup> − (1)i<sub>1</sub>i<sub>2</sub> = 383.4 + 42.7 − 181.0 = 245.1 J', '一進一出 → 互感項取 −。')
      ],
      ans: 'k ≈ 0.7071；w ≈ 245 J（課本答案 246.2 J）',
      note: '程式驗算（Python 複數，沒有中途四捨五入）得 245.1 J，課本答案 246.2 J；差約 0.4%，推測是課本中間值四捨五入造成，請確認。' }
  ];

  window.__CH13EX = window.__CH13EX || { book: 'Alexander & Sadiku', items: [], autoAll: true };
  window.__CH13EX.items = window.__CH13EX.items.concat(items);
  window.__CH13EX.F = Object.assign(window.__CH13EX.F || {}, F);
})();
