/* ============================================================
   電路學 CH14 課本例題與練習題（14.2 轉移函數：Example 14.1–14.2、Practice 14.1–14.2；14.3 沒有例題）
   課本：Alexander & Sadiku, Ch.14 Frequency Response（使用者 11/5 提供，考試範圍到 14.3）
   Practice 的詳解自己解（sympy 驗算）。需要：schem.js、ch13-kit.js
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, K = window.__K13;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, parts) => S.svg(w + 60, h, ['<g transform="translate(60,0)">'].concat(parts, ['</g>']));
  const F = {
    f142: G(260, 140, [S.vs(20, 30, 120, 'v_s(t)'), S.r(20, 30, 140, 30, 'R'), S.c(140, 30, 140, 120, 'C', { side: 'l' }), S.w('140,30', '200,30'), S.w('20,120', '200,120'), S.term(200, 30), S.term(200, 120), K.pm(212, 52, 106, 'v_o(t)')]),
    f144: G(260, 140, [S.vs(20, 30, 120, 'v_s'), S.r(20, 30, 140, 30, 'R'), S.l(140, 30, 140, 120, 'L', { side: 'l' }), S.w('140,30', '200,30'), S.w('20,120', '200,120'), S.term(200, 30), S.term(200, 120), K.pm(212, 52, 106, 'v_o')]),
    f146: G(260, 150, [S.is(20, 30, 130, 'i_i(t)'), S.w('20,30', '200,30'), S.w('20,130', '200,130'), S.r(110, 30, 110, 80, '4 Ω', { side: 'r' }), S.l(110, 80, 110, 130, '2 H', { side: 'r' }), S.dot(110, 30), S.dot(110, 130),
      S.c(200, 30, 200, 130, '0.5 F', { side: 'r' }), K.iv(185, 42, 66, 'i_o(t)')]),
    f147: G(270, 150, [S.vs(20, 40, 130, 'v_o(t)'), S.w('20,40', '210,40'), S.w('20,130', '210,130'), K.ia(60, 90, 30, 'i_i(t)'), S.r(120, 40, 120, 85, '10 Ω', { side: 'r' }), S.c(120, 85, 120, 130, '50 mF', { side: 'r' }), S.dot(120, 40), S.dot(120, 130),
      S.r(210, 40, 210, 85, '6 Ω', { side: 'r' }), S.l(210, 85, 210, 130, '2 H', { side: 'r' })])
  };
  const items = [
    { id: 'ex14-1', sec: '14.2', kind: 'ex', no: '14.1', title: 'RC 電路的轉移函數與頻率響應',
      q: '求圖 14.2(a) RC 電路的轉移函數 V<sub>o</sub>/V<sub>s</sub> 與頻率響應，v<sub>s</sub> = V<sub>m</sub> cos ωt。', en: 'For the RC circuit in Fig. 14.2(a), obtain the transfer function V<sub>o</sub>/V<sub>s</sub> and its frequency response. Let v<sub>s</sub> = V<sub>m</sub> cos ωt.',
      fig: F.f142, cap: '圖 14.2(a)（重畫）',
      idea: '先換頻域（C → 1/jωC），分壓得到 H(ω)，再寫成大小和相位，代幾個關鍵頻率畫圖。',
      steps: [
        st('分壓。', 'H(ω) = V<sub>o</sub>/V<sub>s</sub> = (1/jωC)/(R + 1/jωC) = 1/(1 + jωRC)', '分子分母同乘 jωC。'),
        st('大小與相位。', 'H = 1/√(1 + (ω/ω<sub>0</sub>)<sup>2</sup>)，φ = −tan<sup>−1</sup>(ω/ω<sub>0</sub>)，ω<sub>0</sub> = 1/RC', '跟式 9.18e 的極座標換算一樣。'),
        st('關鍵頻率。', 'ω = 0：H = 1、φ = 0°；ω = ω<sub>0</sub>：H = 1/√2 = 0.707、φ = −45°；ω → ∞：H → 0、φ → −90°', ''),
        st('多算幾點畫圖（表 14.1）。', 'ω/ω<sub>0</sub> = 2：0.45、−63°；3：0.32、−72°；10：0.1、−84°；100：0.01、−89°', '低頻通過、高頻被擋：低通濾波器（14.6 會講）。')
      ],
      ans: 'H(ω) = 1/(1 + jωRC)；H = 1/√(1 + (ω/ω<sub>0</sub>)<sup>2</sup>)、φ = −tan<sup>−1</sup>(ω/ω<sub>0</sub>)，ω<sub>0</sub> = 1/RC' },
    { id: 'pp14-1', sec: '14.2', kind: 'pp', no: '14.1', title: 'RL 電路的轉移函數',
      q: '求圖 14.4 RL 電路的轉移函數 V<sub>o</sub>/V<sub>s</sub>（v<sub>s</sub> = V<sub>m</sub> cos ωt），並畫出頻率響應的樣子。', en: 'Obtain the transfer function V<sub>o</sub>/V<sub>s</sub> of the RL circuit in Fig. 14.4, assuming v<sub>s</sub> = V<sub>m</sub> cos ωt. Sketch its frequency response.',
      fig: F.f144, cap: '圖 14.4（重畫）',
      hint: '輸出在 L 上：分壓 jωL/(R + jωL)。看 ω = 0、ω = R/L、ω → ∞ 三點。',
      steps: [
        st('分壓。', 'H(ω) = jωL/(R + jωL)', ''),
        st('大小與相位。', 'H = (ω/ω<sub>0</sub>)/√(1 + (ω/ω<sub>0</sub>)<sup>2</sup>)，φ = 90° − tan<sup>−1</sup>(ω/ω<sub>0</sub>)，ω<sub>0</sub> = R/L', ''),
        st('關鍵頻率。', 'ω = 0：H = 0、φ = 90°；ω = ω<sub>0</sub>：H = 0.707、φ = 45°；ω → ∞：H → 1、φ → 0°', '低頻被擋、高頻通過（課本圖 14.5）。')
      ],
      ans: 'H(ω) = jωL/(R + jωL)；從 0 升到 1（ω<sub>0</sub> = R/L 時 0.707），相位從 90° 降到 0°' },
    { id: 'ex14-2', sec: '14.2', kind: 'ex', no: '14.2', title: '電流增益、零點與極點',
      q: '求圖 14.6 電路的增益 I<sub>o</sub>(ω)/I<sub>i</sub>(ω)，以及它的極點和零點。', en: 'For the circuit in Fig. 14.6, calculate the gain I<sub>o</sub>(ω)/I<sub>i</sub>(ω) and its poles and zeros.',
      fig: F.f146, cap: '圖 14.6（重畫）',
      idea: '兩條並聯支路：4 Ω + 2 H、0.5 F。用分流。為了好算，先把 jω 換成 s，最後再換回來。',
      steps: [
        st('分流。', 'I<sub>o</sub> = (4 + j2ω)/(4 + j2ω + 1/j0.5ω) · I<sub>i</sub>', 'I<sub>o</sub> 走電容那支，分到的比例 = 另一支阻抗 ÷ 總和。'),
        st('整理（s = jω）。', 'I<sub>o</sub>/I<sub>i</sub> = j0.5ω(4 + j2ω)/(1 + j2ω + (jω)<sup>2</sup>) = s(s + 2)/(s<sup>2</sup> + 2s + 1)', '分子分母同乘 j0.5ω。'),
        st('零點。', 's(s + 2) = 0 ⟹ z<sub>1</sub> = 0、z<sub>2</sub> = −2', ''),
        st('極點。', 's<sup>2</sup> + 2s + 1 = (s + 1)<sup>2</sup> = 0 ⟹ p = −1（二重極點）', '')
      ],
      ans: 'I<sub>o</sub>/I<sub>i</sub> = s(s + 2)/(s + 1)<sup>2</sup>；零點 0、−2；二重極點 −1' },
    { id: 'pp14-2', sec: '14.2', kind: 'pp', no: '14.2', title: '轉移阻抗的零點與極點',
      q: '求圖 14.7 電路的轉移函數 V<sub>o</sub>(ω)/I<sub>i</sub>(ω)，以及它的零點和極點。', en: 'Find the transfer function V<sub>o</sub>(ω)/I<sub>i</sub>(ω) for the circuit in Fig. 14.7. Obtain its zeros and poles.',
      fig: F.f147, cap: '圖 14.7（重畫）',
      hint: 'V<sub>o</sub>/I<sub>i</sub> 就是兩條支路並聯的阻抗：(10 + 20/s) ∥ (6 + 2s)。50 mF → 1/(0.05s) = 20/s。',
      steps: [
        st('兩條支路。', 'Z<sub>1</sub> = 10 + 20/s = (10s + 20)/s；Z<sub>2</sub> = 6 + 2s', ''),
        st('並聯。', 'H = Z<sub>1</sub>Z<sub>2</sub>/(Z<sub>1</sub> + Z<sub>2</sub>) = (10s + 20)(2s + 6)/(2s<sup>2</sup> + 16s + 20)', '分子分母同乘 s。'),
        st('化簡。', 'H(s) = 10(s + 2)(s + 3)/(s<sup>2</sup> + 8s + 10)', '分子分母各提一個 2。'),
        st('零點、極點。', '零點：−2、−3；極點：s = −4 ± √6 = −1.5505、−6.449', '')
      ],
      ans: 'H(s) = 10(s + 2)(s + 3)/(s<sup>2</sup> + 8s + 10)；零點 −2、−3；極點 −1.5505、−6.449',
      note: '課本答案寫成 10(s + 2)(s + 3)/(s<sup>2</sup> + 10s + 10)，但課本給的極點 −1.5505、−6.449 是 s<sup>2</sup> + 8s + 10 的根（s<sup>2</sup> + 10s + 10 的根是 −1.127、−8.873）；照圖用 sympy 算也是 8s。應該是課本分母印錯，請確認。' }
  ];
  window.__CH14EX = window.__CH14EX || { book: 'Alexander & Sadiku', items: [], autoAll: true };
  window.__CH14EX.items = window.__CH14EX.items.concat(items);
})();
