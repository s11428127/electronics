/* ============================================================
   電路學 CH14 章末練習題（考試範圍到 14.3）：Review Question 14.1、Problems 14.1～14.7（跳過 e⁷d 14.2、14.8）
   出處：Alexander & Sadiku, Fundamentals of Electric Circuits, Chapter 14（使用者 11/5 提供）
   轉移函數用 sympy 驗算過。
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, K = window.__K13;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, parts) => S.svg(w + 50, h, ['<g transform="translate(50,0)">'].concat(parts, ['</g>']));
  const T = (x, y, s, a, fs) => S.t(x, y, s, a || 'middle', ' font-size="' + (fs || 11) + '"');
  const out = (x, yt, yb, lab) => [S.term(x, yt), S.term(x, yb), K.pm(x + 2, yt + 22, yb - 12, lab)].join('');
  const F = {
    f1468: G(300, 140, [S.vs(30, 30, 120, 'v_i(t)'), S.c(30, 30, 200, 30, 'C'), S.r(200, 30, 200, 120, 'R', { side: 'l' }), S.w('30,120', '260,120'), S.w('200,30', '260,30'), out(260, 30, 120, 'v_o(t)')]),
    f1470: G(330, 140, [S.vs(30, 30, 120, 'V_i'), S.r(30, 30, 120, 30, '2 Ω'), S.c(120, 30, 120, 120, '0.1 F', { side: 'l' }), S.dot(120, 30), S.dot(120, 120), S.c(120, 30, 220, 30, '0.2 F'),
      S.r(220, 30, 220, 120, '5 Ω', { side: 'l' }), S.w('30,120', '280,120'), S.w('220,30', '280,30'), out(280, 30, 120, 'V_o')]),
    f1471: G(370, 150, [S.term(15, 30), S.term(15, 120), T(22, 80, 'V_i', 'start'), S.l(15, 30, 80, 30, 'L'), S.c(100, 30, 100, 120, 'C', { side: 'l' }), S.w('80,30', '140,30'), S.dot(100, 30), S.dot(100, 120),
      S.r(140, 30, 140, 120, 'R', { side: 'l' }), S.w('15,120', '160,120'), S.w('140,30', '160,30'), S.term(160, 30), S.term(160, 120), T(168, 80, 'V_o', 'start'), T(85, 145, '(a)'), '<g transform="translate(20,0)">',
      S.term(190, 30), S.term(190, 120), T(197, 80, 'V_i', 'start'), S.c(190, 30, 270, 30, 'C'), S.r(270, 30, 270, 75, 'R', { side: 'l' }), S.l(270, 75, 270, 120, 'L', { side: 'l' }),
      S.w('270,30', '335,30'), S.w('190,120', '335,120'), S.term(335, 30), S.term(335, 120), T(328, 80, 'V_o', 'end'), T(262, 145, '(b)'), '</g>']),
    f1472: G(410, 150, [S.vs(25, 30, 120, 'V_s'), S.r(25, 30, 95, 30, 'R_s'), S.r(110, 30, 110, 120, 'R', { side: 'l' }), S.w('95,30', '160,30'), S.dot(110, 30), S.dot(110, 120), S.l(150, 30, 150, 120, 'L', { side: 'l' }),
      S.w('25,120', '165,120'), K.pm(168, 52, 108, 'V_o'), T(95, 145, '(a)'), '<g transform="translate(30,0)">',
      S.vs(210, 30, 120, 'V_s'), S.l(210, 30, 275, 30, 'L'), S.r(290, 30, 290, 120, 'R', { side: 'l' }), S.w('275,30', '340,30'), S.dot(290, 30), S.dot(290, 120), S.c(330, 30, 330, 120, 'C', { side: 'l' }),
      S.w('210,120', '345,120'), K.pm(355, 52, 108, 'V_o'), T(280, 145, '(b)'), '</g>']),
    f1473: G(330, 140, [S.is(30, 30, 120, 'I_s'), S.w('30,30', '100,30'), S.r(100, 30, 100, 120, '2 Ω', { side: 'l' }), S.dot(100, 30), S.dot(100, 120), S.l(100, 30, 190, 30, '2 H'),
      S.l(190, 30, 190, 120, '2 H', { side: 'l' }), S.dot(190, 30), S.dot(190, 120), S.w('190,30', '270,30'), S.r(270, 30, 270, 120, '2 Ω', { side: 'l' }), S.w('30,120', '270,120'), K.iv(285, 50, 80, 'I_o')])
  };
  const it = (no, sec, title, o) => Object.assign({ id: 'p14-' + no, sec, kind: 'pp', tag: 'Problem 14.' + no, title }, o);
  const items = [
    { id: 'rq14-1', sec: 'rq', kind: 'pp', tag: 'Review Question 14.1', title: '轉移函數的零點在哪',
      q: '轉移函數 H(s) = 10(s + 1)/[(s + 2)(s + 3)] 的零點在：<ol type="a" style="margin:6px 0 0;padding-left:22px"><li>10</li><li>−1</li><li>−2</li><li>−3</li></ol>',
      en: 'A zero of the transfer function H(s) = 10(s + 1)/[(s + 2)(s + 3)] is at (a) 10 (b) −1 (c) −2 (d) −3',
      hint: '零點 = 分子 = 0 的 s；極點 = 分母 = 0 的 s。', steps: [st('想法。', 's + 1 = 0 ⟹ s = −1', '−2、−3 是極點；10 只是增益常數。')], ans: '(b)' },
    it(1, '14.2', 'RC 高通的轉移函數', { fig: F.f1468, cap: '圖 14.68（重畫）',
      q: '求圖 14.68 RC 電路的轉移函數 v<sub>o</sub>/v<sub>i</sub>，用 ω<sub>0</sub> = 1/(RC) 表示。',
      en: 'Find the transfer function v<sub>o</sub>/v<sub>i</sub> of the RC circuit in Fig. 14.68. Express it using ω<sub>0</sub> = 1/(RC).',
      hint: '分壓：輸出在 R 上。',
      steps: [
        st('Step 1　分壓。', 'H(ω) = R/(R + 1/jωC) = jωRC/(1 + jωRC)', ''),
        st('Step 2　換成 ω<sub>0</sub>。', 'H(ω) = j(ω/ω<sub>0</sub>)/(1 + jω/ω<sub>0</sub>)', 'RC = 1/ω<sub>0</sub>。ω → 0 時 H → 0，ω → ∞ 時 H → 1：高通。')
      ],
      ans: 'H(ω) = (jω/ω<sub>0</sub>)/(1 + jω/ω<sub>0</sub>)' }),
    it(3, '14.2', '兩個電容的 RC 網路', { fig: F.f1470, cap: '圖 14.70（重畫）',
      q: '求圖 14.70 電路的 H(s) = V<sub>o</sub>(s)/V<sub>i</sub>(s)。',
      en: 'For the circuit shown in Fig. 14.70, find H(s) = V<sub>o</sub>(s)/V<sub>i</sub>(s).',
      hint: '電容阻抗 1/(sC)：0.1 F → 10/s，0.2 F → 5/s。先分右邊，再分左邊。',
      steps: [
        st('Step 1　右邊分壓。', 'V<sub>o</sub> = V<sub>x</sub> · 5/(5 + 5/s) = V<sub>x</sub> · s/(s + 1)', 'V<sub>x</sub> 是中間節點電壓。'),
        st('Step 2　中間節點對地的阻抗。', 'Z<sub>p</sub> = (10/s) ∥ (5 + 5/s) = 10(s + 1)/[s(s + 3)]', ''),
        st('Step 3　左邊分壓。', 'V<sub>x</sub>/V<sub>i</sub> = Z<sub>p</sub>/(2 + Z<sub>p</sub>) = 5(s + 1)/(s<sup>2</sup> + 8s + 5)', ''),
        st('Step 4　相乘。', 'H(s) = 5(s + 1)/(s<sup>2</sup> + 8s + 5) · s/(s + 1) = 5s/(s<sup>2</sup> + 8s + 5)', '')
      ],
      ans: 'H(s) = 5s/(s<sup>2</sup> + 8s + 5)' }),
    it(4, '14.2', 'LC 網路的轉移函數', { fig: F.f1471, cap: '圖 14.71（重畫）',
      q: '求圖 14.71 兩個電路的 H(s) = V<sub>o</sub>/V<sub>i</sub>。',
      en: 'Find the transfer function H(s) = V<sub>o</sub>/V<sub>i</sub> of the circuits shown in Fig. 14.71.',
      hint: '(a) 輸出在 C ∥ R 上；(b) 輸出在 R + L 上。都是分壓。',
      steps: [
        st('Step 1　(a) 並聯。', 'Z<sub>p</sub> = R ∥ (1/sC) = R/(1 + sRC)', ''),
        st('Step 2　(a) 分壓。', 'H(s) = Z<sub>p</sub>/(sL + Z<sub>p</sub>) = R/(s<sup>2</sup>RLC + sL + R)', ''),
        st('Step 3　(b) 分壓。', 'H(s) = (R + sL)/(R + sL + 1/sC) = (s<sup>2</sup>LC + sRC)/(s<sup>2</sup>LC + sRC + 1)', '分子分母同乘 sC。')
      ],
      ans: '(a) R/(s<sup>2</sup>RLC + sL + R)　(b) s(sLC + RC)/(s<sup>2</sup>LC + sRC + 1)' }),
    it(5, '14.2', '有內阻的電源接 RL、RLC', { fig: F.f1472, cap: '圖 14.72（重畫）',
      q: '求圖 14.72 兩個電路的 H(s) = V<sub>o</sub>/V<sub>s</sub>。',
      en: 'For the circuits shown in Fig. 14.72, find H(s) = V<sub>o</sub>/V<sub>s</sub>.',
      hint: '(a) 輸出在 R ∥ L 上；(b) 輸出在 R ∥ C 上。',
      steps: [
        st('Step 1　(a) 並聯。', 'R ∥ sL = sRL/(R + sL)', ''),
        st('Step 2　(a) 分壓。', 'H(s) = [sRL/(R + sL)]/[R<sub>s</sub> + sRL/(R + sL)] = sRL/[RR<sub>s</sub> + sL(R + R<sub>s</sub>)]', ''),
        st('Step 3　(b) 並聯＋分壓。', 'R ∥ (1/sC) = R/(1 + sRC) ⟹ H(s) = R/(s<sup>2</sup>RLC + sL + R)', '跟 14.4(a) 是同一個電路。')
      ],
      ans: '(a) sRL/[RR<sub>s</sub> + sL(R + R<sub>s</sub>)]　(b) R/(s<sup>2</sup>RLC + sL + R)' }),
    it(6, '14.2', '電流轉移函數', { fig: F.f1473, cap: '圖 14.73（重畫）',
      q: '求圖 14.73 電路的 H(s) = I<sub>o</sub>(s)/I<sub>s</sub>(s)。',
      en: 'For the circuit shown in Fig. 14.73, find H(s) = I<sub>o</sub>(s)/I<sub>s</sub>(s).',
      hint: '分流兩次：先分到右邊那一整支（2s 再串 2s ∥ 2），再分到最右邊的 2 Ω。',
      steps: [
        st('Step 1　最右邊的並聯。', '2s ∥ 2 = 2s/(s + 1)', ''),
        st('Step 2　右邊整支。', 'Z = 2s + 2s/(s + 1) = 2s(s + 2)/(s + 1)', ''),
        st('Step 3　第一次分流。', 'I<sub>b</sub> = I<sub>s</sub> · 2/(2 + Z) = I<sub>s</sub>(s + 1)/(s<sup>2</sup> + 3s + 1)', '左邊 2 Ω 和右邊整支並聯。'),
        st('Step 4　第二次分流。', 'I<sub>o</sub> = I<sub>b</sub> · 2s/(2s + 2) = I<sub>b</sub> · s/(s + 1)', ''),
        st('Step 5　相乘。', 'H(s) = s/(s<sup>2</sup> + 3s + 1)', '')
      ],
      ans: 'H(s) = s/(s<sup>2</sup> + 3s + 1)' }),
    it(7, '14.3', '分貝換回大小', {
      q: '已知 H<sub>dB</sub>，求 |H(ω)|：(a) 0.05 dB (b) −6.2 dB (c) 104.7 dB。',
      en: 'Calculate |H(ω)| if H<sub>dB</sub> equals (a) 0.05 dB (b) −6.2 dB (c) 104.7 dB',
      hint: 'H<sub>dB</sub> = 20 log<sub>10</sub>|H| ⟹ |H| = 10<sup>H<sub>dB</sub>/20</sup>。',
      steps: [
        st('Step 1　(a)。', '|H| = 10<sup>0.0025</sup> = 1.006', '接近 0 dB ⟹ 接近 1。'),
        st('Step 2　(b)。', '|H| = 10<sup>−0.31</sup> = 0.4898', '−6 dB 大約是一半。'),
        st('Step 3　(c)。', '|H| = 10<sup>5.235</sup> = 1.718 × 10<sup>5</sup>', '每 20 dB 是 10 倍：100 dB = 10<sup>5</sup>。')
      ],
      ans: '(a) 1.006　(b) 0.4898　(c) 1.718 × 10<sup>5</sup>' })
  ];
  window.__CH14PB = window.__CH14PB || { book: 'Alexander & Sadiku', items: [] };
  window.__CH14PB.enFirst = true;   /* 11/7：題目英文先、中文收進「中文翻譯」 */
  window.__CH14PB.items = window.__CH14PB.items.concat(items);
})();
