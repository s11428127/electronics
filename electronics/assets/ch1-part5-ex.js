/* ============================================================
   電子學 CH1 PART 5 —— 課本例題與練習（Example 1.8、1.9 ＋ 講義上的 Problem／圖例 ＋ 自編練習）
   出處：Neamen, Microelectronics: Circuit Analysis and Design, 4th ed., §1.2.5、§1.3.1～1.3.2；
         課程 PART 4（V3）投影片 1-93、1-106～1-126
   - Example 1.8 講義只提到「疊代法可求出」，沒有放題目；題目依課本，請對照課本確認
   - 練習題標籤寫出處（講義第幾頁／自編練習），數值都用程式驗算過
   - 每一題都有 story：「🎬 圖解故事」（畫圖工具 ch1-part5-kit.js → __K15）
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const KK = () => window.__K15;

  /* ---------- 題目圖（schem.js） ---------- */
  /* 電源 — R — 二極體 串聯；rev：二極體反接 */
  function F(vps, r, opt) {
    opt = opt || {};
    const p = [
      S.vs(50, 30, 140, vps),
      S.w('50,30', '110,30'), S.r(110, 30, 190, 30, r), S.w('190,30', '250,30'),
      opt.rev ? S.d(250, 140, 250, 30, '') : S.d(250, 30, 250, 140, ''),
      S.w('250,140', '50,140'),
      S.t(272, 74, '+', 'middle'), S.t(272, 108, '−', 'middle'), S.t(282, 92, 'V_D', 'start'),
      S.t(222, 22, 'I_D →', 'middle', ' font-size="11"')
    ];
    return S.svg(400, 160, ['<g transform="translate(70,0)">'].concat(p, ['</g>']));
  }
  /* 半波整流：交流源 — 二極體 — R（輸出 v_O 在 R 上） */
  function FH(lbl) {
    const p = [
      S.vac(40, 30, 140, lbl || 'v_I'),
      S.w('40,30', '90,30'), S.d(90, 30, 170, 30, 'D'), S.w('170,30', '220,30'),
      S.r(220, 30, 220, 140, 'R'), S.w('220,140', '40,140'),
      S.term(270, 30), S.term(270, 140), S.w('220,30', '270,30'), S.w('220,140', '270,140'),
      S.t(282, 46, '+', 'start'), S.t(282, 132, '−', 'start'), S.t(282, 90, 'v_O', 'start')
    ];
    return S.svg(410, 160, ['<g transform="translate(90,0)">'].concat(p, ['</g>']));
  }

  /* 一張 I–V 小圖（故事用）：VPS（V）、R（kΩ）的負載線 ＋ 二極體指數曲線 */
  const IS13 = v => 1e-13 * (Math.exp(v / 0.026) - 1) * 1e3;   /* mA */

  const items = [
    /* ═══════════ 半波整流（講義 1-93） ═══════════ */
    { id: 'p5-hw', sec: 'sw', kind: 'pp', no: '', tag: '講義 1-93', title: '半波整流的輸出峰值',
      q: '半波整流電路：輸入 v<sub>I</sub> 是峰值 5 V 的弦波，矽二極體用定電壓降模型（V<sub>γ</sub> = 0.7 V）。求輸出 v<sub>O</sub> 的峰值；二極體在輸入多大時才開始導通？若改用理想二極體模型，輸出峰值又是多少？',
      en: 'In a half-wave rectifier, the input v<sub>I</sub> is a sinusoid with a peak of 5 V. Using the constant-voltage-drop model (V<sub>γ</sub> = 0.7 V), find the peak output voltage and the input voltage at which the diode begins to conduct. Repeat with the ideal diode model.',
      fig: FH('v_I（峰值 5 V）'), cap: '二極體串在中間，輸出取在 R 上',
      hint: '正半周、v<sub>I</sub> &gt; 0.7 V：二極體 ON，換成 0.7 V 電池 → v<sub>O</sub> = v<sub>I</sub> − 0.7；其他時候 OFF → v<sub>O</sub> = 0。',
      steps: [
        st('判斷 ON / OFF。', 'v<sub>I</sub> &gt; V<sub>γ</sub> = 0.7 V：ON　｜　v<sub>I</sub> &lt; 0.7 V（含整個負半周）：OFF', '二極體要被「推」過 0.7 V 才會導通；負半周是逆偏，一定 OFF。'),
        st('ON 的時候，二極體換成 0.7 V 電池，寫 KVL。', 'v<sub>I</sub> = 0.7 + v<sub>O</sub>　⟹　v<sub>O</sub> = v<sub>I</sub> − 0.7', '電阻上的電壓 = 輸入扣掉二極體吃掉的 0.7 V。'),
        st('代峰值。', 'v<sub>O,peak</sub> = 5 − 0.7 = 4.3 V', '講義 1-93 圖上的 4.3 V 就是這樣來的。'),
        st('OFF 的時候。', 'i = 0　⟹　v<sub>O</sub> = i·R = 0', '電阻沒有電流，就沒有電壓。'),
        st('理想模型（V<sub>γ</sub> = 0）。', 'v<sub>O,peak</sub> = 5 V，v<sub>I</sub> &gt; 0 就導通', '電源只有 5 V，0.7 V 佔了 14%，用理想模型會高估。')
      ],
      ans: '定電壓降模型：v<sub>O,peak</sub> = 4.3 V，v<sub>I</sub> &gt; 0.7 V 才導通；理想模型：5 V，v<sub>I</sub> &gt; 0 就導通',
      story: () => {
        const { g, T, calc, sc, sine, ansScene, D } = KK();
        return [
          sc('題目：只讓正半周過去', 'HALF-WAVE RECTIFIER',
            g('in', sine(70, 200, 500, 70, { cls: 'ln', k: null })) + T(70, 118, 'v<sub>I</sub>：峰值 5 V', { cls: 't', fs: 13, a: 'start', k: 'li' }) +
            sine(70, 200, 500, 70, { cut: true, shift: 0, k: 'o0' }) +
            D.chip(320, 296, '二極體 = 單向旋轉門', '正的推得動、負的推不動', 'c1', { fs: 13 }),
            [{ sub: '輸入是峰值 5 V 的弦波，一下正、一下負。', on: 'in li' },
             { sub: '二極體像<b>單向旋轉門</b>：只有正半周推得過去，負半周被擋住。', on: 'c1 o0' }]),
          sc('ON 的時候：扣掉 0.7 V', 'ON: SUBTRACT 0.7 V',
            sine(70, 200, 500, 70, { cls: 'ln', k: 'in' }) + sine(70, 200, 500, 70, { cut: true, shift: 9.8, k: 'o1' }) +
            '<line class="ln2 dsh" x1="70" y1="190" x2="570" y2="190"' + KK().k('th') + '/>' +
            T(574, 186, '0.7 V', { cls: 'tm', fs: 11, a: 'start', k: 'thl' }) +
            calc(360, 236, 250, [['ON：v<sub>O</sub> = v<sub>I</sub> − 0.7', 'r1'], ['峰值 = 5 − 0.7 = 4.3 V', 'r2', 'ta']], { k: 'cc', lh: 25 }),
            [{ sub: '定電壓降模型：v<sub>I</sub> 要超過 <b>0.7 V</b> 二極體才 ON。', on: 'in th thl' },
             { sub: 'ON 的時候二極體當成 0.7 V 電池，電阻拿到 v<sub>I</sub> − 0.7。', on: 'o1 cc r1' },
             { sub: '所以輸出峰值 = 5 − 0.7 = <b>4.3 V</b>，整條駝峰比輸入矮 0.7 V。', on: 'r2' }]),
          ansScene(['v<sub>O,peak</sub> = 4.3 V（定電壓降）', 'v<sub>I</sub> &gt; 0.7 V 才導通', '理想模型：5 V，v<sub>I</sub> &gt; 0 就導通'],
            ['答案：輸出峰值 <b>4.3 V</b>。', '理想模型會說 5 V —— 電源只有 5 V 時，0.7 V 不能省。'])
        ];
      } },

    /* ═══════════ 崩潰：PIV（自編） ═══════════ */
    { id: 'p5-piv', sec: 'bd', kind: 'pp', no: '', tag: '自編練習', title: 'PIV 夠不夠？',
      q: '用一顆二極體把家用 110 V（rms）交流電做半波整流，負載是電阻。手邊有兩顆二極體：A 的 PIV = 100 V、B 的 PIV = 200 V。二極體被反著加的最大電壓是多少？該選哪一顆？',
      en: 'A single diode half-wave rectifies the 110 V (rms) household supply into a resistive load. Diode A is rated PIV = 100 V and diode B is rated PIV = 200 V. What is the maximum reverse voltage across the diode, and which diode should be used?',
      fig: FH('110 V rms'), cap: '負半周時二極體 OFF，整個輸入電壓都落在二極體上',
      hint: '負半周二極體 OFF、電流 0，電阻上沒有壓降 → 二極體兩端 = 整個輸入。最大值是峰值 V<sub>m</sub> = √2 × 110。',
      steps: [
        st('rms 換峰值。', 'V<sub>m</sub> = √2 × 110 = 155.6 V', '家用電的 110 V 是有效值（rms），弦波的峰值要乘 √2。'),
        st('負半周，二極體 OFF。', 'i = 0　⟹　v<sub>R</sub> = 0　⟹　v<sub>D</sub> = v<sub>I</sub>', '電阻沒電流就沒壓降，KVL：輸入全部落在二極體上。'),
        st('最大逆壓。', '|v<sub>D</sub>|<sub>max</sub> = V<sub>m</sub> = 155.6 V', '負半周的最低點，二極體被反著加 155.6 V。'),
        st('比 PIV。', 'A：100 V &lt; 155.6 V ✗　｜　B：200 V &gt; 155.6 V ✓', '額定一定要大於實際會碰到的最大逆壓，還要留餘裕。')
      ],
      ans: '最大逆壓 ≈ 156 V；選 B（PIV 200 V）。A 會進入崩潰。',
      note: '這是自編練習（課本 §2.1 整流器會正式算 PIV）。電源電壓會上下浮動 10% 左右，實務上 PIV 通常再留 1.5～2 倍餘裕。',
      story: () => {
        const { g, T, calc, sc, sine, ansScene, D } = KK();
        return [
          sc('負半周：二極體扛下全部', 'REVERSE HALF CYCLE',
            sine(70, 190, 500, 70, { cls: 'ln', k: 'in' }) +
            g('neg', '<circle class="acc" cx="257" cy="260" r="6"/>' + D.arrow(257, 190, 257, 254, null, 'lna') + T(267, 236, '−155.6 V', { cls: 'ta', fs: 14, a: 'start' })) +
            D.chip(440, 292, 'OFF：電阻沒電流 → 沒壓降', '輸入全部落在二極體上', 'c1', { fs: 13 }),
            [{ sub: '110 V 是 rms，峰值 = √2 × 110 = <b>155.6 V</b>。', on: 'in' },
             { sub: '負半周二極體 OFF，電阻沒有電流，所以<b>輸入全部落在二極體上</b>。', on: 'c1' },
             { sub: '最低點時，二極體被反著加 <b>155.6 V</b>。', on: 'neg' }]),
          sc('比一比額定', 'COMPARE WITH PIV',
            g('bar', '<rect class="accw" x="120" y="150" width="400" height="26" rx="6"/>' + T(320, 168, '實際最大逆壓 155.6 V', { cls: 'ta', fs: 13 })) +
            calc(120, 196, 400, [['A：PIV 100 V &lt; 155.6 V → 會崩潰 ✗', 'r1'], ['B：PIV 200 V &gt; 155.6 V → 安全 ✓', 'r2', 'ta']], { k: 'cc' }),
            [{ sub: 'PIV 是「最多能反著加多少伏」的額定值。', on: 'bar cc' },
             { sub: 'A 只能撐 100 V，負半周一來就超過，<b>進入崩潰</b>。', on: 'r1' },
             { sub: 'B 撐得住 200 V，還留了一點餘裕。', on: 'r2' }]),
          ansScene(['選 B（PIV = 200 V）', '最大逆壓 = V<sub>m</sub> = 155.6 V'], ['答案：選 <b>B</b>。'])
        ];
      } },

    /* ═══════════ 1.3.1 疊代法：Example 1.8 ═══════════ */
    { id: 'ex1-8', sec: 'load', kind: 'ex', no: '1.8', title: '用疊代法求二極體的電壓與電流',
      q: '電路如圖：V<sub>PS</sub> = 5 V、R = 2 kΩ，二極體 I<sub>S</sub> = 10<sup>−13</sup> A（n = 1、V<sub>T</sub> = 0.026 V）。求二極體電壓 V<sub>D</sub> 與電流 I<sub>D</sub>。',
      en: 'Determine the diode voltage and current in the circuit shown (V<sub>PS</sub> = 5 V, R = 2 kΩ). Consider a diode with a reverse-saturation current of I<sub>S</sub> = 10<sup>−13</sup> A.',
      fig: F('V_PS = 5 V', 'R = 2 kΩ'), cap: '講義 1-117 的電路（Fig 1.28）',
      idea: 'KVL 給一條式子、二極體方程式給另一條，兩條都含 V<sub>D</sub>、I<sub>D</sub>。因為有 e 的次方，沒辦法直接解 —— 先猜 V<sub>D</sub>，算 I<sub>D</sub>，再用二極體方程式反推 V<sub>D</sub>，重複到數字不再變。',
      steps: [
        st('KVL 繞一圈。', 'V<sub>PS</sub> = I<sub>D</sub>R + V<sub>D</sub>　⟹　I<sub>D</sub> = (5 − V<sub>D</sub>) / 2k', '電源電壓 = 電阻壓降 + 二極體壓降。'),
        st('二極體方程式解成 V<sub>D</sub>。', 'V<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub>)', '順偏時 −1 可以忽略，取 ln 就把 V<sub>D</sub> 拿出來了。'),
        st('第 1 次：先猜 V<sub>D</sub> = 0.6 V。', 'I<sub>D</sub> = (5 − 0.6)/2k = 2.2 mA　→　V<sub>D</sub> = 0.026 ln(2.2×10<sup>−3</sup>/10<sup>−13</sup>) = 0.6192 V', '矽二極體導通大概 0.6～0.7 V，從這裡猜起收斂最快。'),
        st('第 2 次：用 0.6192 V 再算。', 'I<sub>D</sub> = (5 − 0.6192)/2k = 2.1904 mA　→　V<sub>D</sub> = 0.6191 V', 'V<sub>D</sub> 只變了 0.0001 V —— 已經收斂。'),
        st('結論。', 'V<sub>D</sub> ≈ 0.619 V，I<sub>D</sub> ≈ 2.19 mA', '電流對 V<sub>D</sub> 很不敏感（5 V 裡只差幾 mV），所以兩三次就夠準。')
      ],
      ans: 'V<sub>D</sub> ≈ 0.619 V、I<sub>D</sub> ≈ 2.19 mA',
      note: '講義 1-126 只寫「疊代法可求出 (V<sub>D</sub>, I<sub>D</sub>)（解法為 Example 1.8）」，沒有放題目；這裡的題目與數字依課本 Example 1.8，<b>請對照課本確認</b>。程式驗算：精確解 V<sub>D</sub> = 0.61906 V、I<sub>D</sub> = 2.1905 mA。',
      story: () => {
        const { g, T, calc, sc, circ, axes, ansScene, D } = KK();
        const P = axes(330, 112, 260, 170, { v0: 0, v1: 5.4, i0: 0, i1: 2.8, vt: [[0.6, '0.6'], [5, '5']], it: [[2.5, '2.5 mA']] });
        return [
          sc('題目：兩條式子都要滿足', 'TWO EQUATIONS',
            circ(90, 140, 160, 130, { k: 'cir', vps: '5 V', r: '2 kΩ', cur: 'cur' }) +
            calc(330, 120, 280, [['① KVL：5 = I<sub>D</sub>·2k + V<sub>D</sub>', 'r1'], ['② 二極體：I<sub>D</sub> = I<sub>S</sub>e<sup>V<sub>D</sub>/V<sub>T</sub></sup>', 'r2'], ['含 e 的次方 → 解不出來', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '5 V 電源、2 kΩ 電阻、一顆二極體串在一起。', on: 'cir cur' },
             { sub: '繞一圈 KVL：5 V = 電阻壓降 + 二極體壓降。', on: 'cc r1' },
             { sub: '二極體自己也有一條規矩：指數公式。', on: 'r2' },
             { sub: '兩條式子都含 V<sub>D</sub>，但一條有 e 的次方 —— <b>沒辦法直接移項解</b>。', on: 'r3' }]),
          sc('先猜，再修正', 'GUESS AND CORRECT',
            calc(110, 112, 420, [['猜 V<sub>D</sub> = 0.6 V', 'r1', 'tm'], ['I<sub>D</sub> = (5 − 0.6)/2k = 2.2 mA', 'r2'], ['V<sub>D</sub> = 0.026 ln(2.2m / 10<sup>−13</sup>) = 0.6192 V', 'r3', 'ta'], ['I<sub>D</sub> = (5 − 0.6192)/2k = 2.1904 mA', 'r4'], ['V<sub>D</sub> = 0.6191 V（幾乎沒變）', 'r5', 'ta']], { k: 'cc', title: '疊代法　ITERATION' }),
            [{ sub: '<b>疊代法</b>：像調熱水 —— 先轉一點、摸摸看、再轉一點。先猜 V<sub>D</sub> = 0.6 V。', on: 'cc r1' },
             { sub: '用 KVL 算電流：2.2 mA。', on: 'r2' },
             { sub: '把 2.2 mA 丟進二極體公式，反推 V<sub>D</sub> = 0.6192 V。', on: 'r3' },
             { sub: '再用 0.6192 V 算一次電流：2.1904 mA。', on: 'r4' },
             { sub: 'V<sub>D</sub> 只差 0.0001 V，<b>收斂了</b>。', on: 'r5' }]),
          sc('其實就是交點', 'IT IS THE INTERSECTION',
            P.svg + P.curve(IS13, 0, 0.64, 'cv') + P.seg(0, 2.5, 5, 0, 'll', 'ln') + P.proj(0.619, 2.19, 'pj') + P.dot(0.619, 2.19, 'q') +
            T(P.X(0.619) + 14, P.Y(2.19) - 6, 'Q (0.619 V, 2.19 mA)', { cls: 'ta', fs: 13, a: 'start', k: 'ql' }) +
            calc(60, 130, 240, [['藍色：二極體曲線', 'r1', 'ta'], ['黑色：KVL 的直線', 'r2'], ['兩條都滿足 → 交點', 'r3', 'ta']], { k: 'cc', lh: 26 }),
            [{ sub: '疊代其實在找兩條線的交點：二極體曲線……', on: 'cc r1 cv' },
             { sub: '……和 KVL 那條直線（下一節叫它<b>負載線</b>）。', on: 'r2 ll' },
             { sub: '交點 (0.619 V, 2.19 mA) 就是答案。', on: 'r3 pj q ql' }]),
          ansScene(['V<sub>D</sub> ≈ 0.619 V', 'I<sub>D</sub> ≈ 2.19 mA'], ['答案：V<sub>D</sub> ≈ 0.619 V、I<sub>D</sub> ≈ 2.19 mA。'])
        ];
      } },

    /* ═══════════ 1.3.1 講義 Problem：設計 R ═══════════ */
    { id: 'p5-designR', sec: 'load', kind: 'pp', no: '', tag: '講義 Problem（1-119）', title: '反過來：要讓 Q 點落在這裡，R 要多大？',
      q: '工作點要設在 (V<sub>D</sub>, I<sub>D</sub>) = (0.62 V, 2.2 mA)，若 V<sub>PS</sub> = 5 V，外接的 R 要設計多少？',
      en: 'The operating point is to be set at (0.62 V, 2.2 mA). If V<sub>PS</sub> = 5 V, what value of R should be used?',
      fig: F('V_PS = 5 V', 'R = ?'), cap: '同一個電路，這次 R 是未知數',
      hint: '負載線一定經過 (V<sub>PS</sub>, 0) 和 Q 點；或者直接寫 KVL：R = (V<sub>PS</sub> − V<sub>D</sub>)/I<sub>D</sub>。',
      steps: [
        st('KVL。', 'V<sub>PS</sub> = I<sub>D</sub>R + V<sub>D</sub>', '跟上一題同一條，只是這次 V<sub>D</sub>、I<sub>D</sub> 已知、R 未知。'),
        st('解 R。', 'R = (V<sub>PS</sub> − V<sub>D</sub>)/I<sub>D</sub> = (5 − 0.62)/2.2 mA', '電阻要吃掉 5 − 0.62 = 4.38 V，同時讓 2.2 mA 流過。'),
        st('算。', 'R = 4.38 / 0.0022 = 1991 Ω ≈ 2 kΩ', '取標準值 2 kΩ（講義答案）。'),
        st('從圖上看。', '負載線斜率 = −1/R，經過 (5 V, 0) 和 (0.62 V, 2.2 mA)', '兩點決定一條線，斜率就決定了 R。')
      ],
      ans: 'R = (5 − 0.62)/2.2 mA ≈ 1.99 kΩ ≈ 2 kΩ',
      story: () => {
        const { T, calc, sc, axes, ansScene } = KK();
        const P = axes(90, 112, 300, 170, { v0: 0, v1: 5.4, i0: 0, i1: 2.8, vt: [[0.62, '0.62'], [5, '5 V']], it: [[2.2, '2.2']] });
        return [
          sc('兩點決定一條負載線', 'TWO POINTS, ONE LINE',
            P.svg + P.curve(IS13, 0, 0.64, 'cv') + P.dot(0.62, 2.2, 'q') + P.dot(5, 0, 'x', 6, 'acc') + P.seg(0.62, 2.2, 5, 0, 'll', 'lna') +
            T(P.X(0.62) + 12, P.Y(2.2) - 8, 'Q：想要的工作點', { cls: 'ta', fs: 12.5, a: 'start', k: 'ql' }) +
            T(P.X(5), P.Y(0) - 12, '(5 V, 0)', { cls: 'ta', fs: 12.5, k: 'xl' }) +
            calc(420, 130, 190, [['斜率 = −1/R', 'r1'], ['R = 4.38 / 2.2m', 'r2'], ['≈ 2 kΩ', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '先在二極體曲線上點出想要的工作點 Q (0.62 V, 2.2 mA)。', on: 'cv q ql' },
             { sub: '負載線一定經過 (V<sub>PS</sub>, 0)：二極體吃掉全部電壓、電流 0 的那一點。', on: 'x xl' },
             { sub: '兩點連起來，這條線的斜率就是 −1/R。', on: 'll cc r1' },
             { sub: 'R = (5 − 0.62)/2.2 mA = <b>1.99 kΩ ≈ 2 kΩ</b>。', on: 'r2 r3' }]),
          ansScene(['R ≈ 2 kΩ', '(5 − 0.62) / 2.2 mA = 1.99 kΩ'], ['答案：R ≈ <b>2 kΩ</b>，就是 Example 1.8 那顆。'])
        ];
      } },

    /* ═══════════ 1.3.2 片段線性：Example 1.9 ═══════════ */
    { id: 'ex1-9', sec: 'pwl', kind: 'ex', no: '1.9', title: '用片段線性模型求 V<sub>D</sub>、I<sub>D</sub> 與功率',
      q: '同一個電路（V<sub>PS</sub> = 5 V、R = 2 kΩ），二極體改用片段線性模型：V<sub>γ</sub> = 0.6 V、r<sub>f</sub> = 10 Ω。求二極體電流、電壓，以及二極體消耗的功率。',
      en: 'Determine the diode voltage and current in the same circuit using a piecewise linear model. Also determine the power dissipated in the diode. Assume piecewise linear diode parameters of V<sub>γ</sub> = 0.6 V and r<sub>f</sub> = 10 Ω.',
      fig: F('V_PS = 5 V', 'R = 2 kΩ'), cap: '二極體換成「V<sub>γ</sub> 電池 + r<sub>f</sub> 電阻」',
      idea: '模型代入法：二極體導通 → 換成一顆 0.6 V 電池串一顆 10 Ω 電阻。整個電路變成純線性，一條 KVL 就解完。',
      steps: [
        st('二極體換成模型。', '二極體 → V<sub>γ</sub> = 0.6 V（電池）＋ r<sub>f</sub> = 10 Ω（電阻）', '先假設它導通（5 V 遠大於 0.6 V，很合理）。'),
        st('KVL。', 'V<sub>PS</sub> = I<sub>D</sub>R + V<sub>γ</sub> + I<sub>D</sub>r<sub>f</sub>', '電阻、電池、r<sub>f</sub> 三段壓降加起來 = 5 V。'),
        st('解 I<sub>D</sub>。', 'I<sub>D</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/(R + r<sub>f</sub>) = (5 − 0.6)/(2k + 10) = 2.19 mA', 'I<sub>D</sub> &gt; 0，假設成立。'),
        st('求 V<sub>D</sub>。', 'V<sub>D</sub> = V<sub>γ</sub> + I<sub>D</sub>r<sub>f</sub> = 0.6 + 2.19m × 10 = 0.622 V', '二極體兩端 = 電池 + r<sub>f</sub> 上的壓降。'),
        st('功率。', 'P<sub>D</sub> = I<sub>D</sub>V<sub>D</sub> = 2.19 mA × 0.622 V = 1.36 mW', '元件消耗的功率 = 流過的電流 × 兩端電壓。')
      ],
      ans: 'I<sub>D</sub> = 2.19 mA、V<sub>D</sub> = 0.622 V、P<sub>D</sub> = 1.36 mW',
      note: '跟 Example 1.8 的疊代結果（0.619 V、2.19 mA）幾乎一樣，但只算了一條 KVL —— 這就是片段線性模型的好處（講義 1-122 (1)）。程式驗算：I<sub>D</sub> = 2.1891 mA、V<sub>D</sub> = 0.6219 V、P<sub>D</sub> = 1.361 mW。',
      story: () => {
        const { g, T, calc, sc, circ, ansScene, D } = KK();
        return [
          sc('換成模型', 'REPLACE THE DIODE',
            circ(90, 140, 170, 130, { k: 'c0', vps: '5 V', r: '2 kΩ' }) +
            circ(90, 140, 170, 130, { k: 'c1', vps: '5 V', r: '2 kΩ', model: 'pwl', vg: '0.6 V', rf: '10 Ω', cur: 'cur' }) +
            D.chip(470, 160, '導通的二極體 =', '一顆 0.6 V 電池 + 一顆 10 Ω 電阻', 'ch', { fs: 13 }),
            [{ sub: '同一個電路。這次不解指數，改用<b>片段線性模型</b>。', on: 'c0' },
             { sub: '導通的二極體換成：一顆 <b>0.6 V 電池</b> 串一顆 <b>10 Ω 電阻</b>。', off: 'c0', on: 'c1 ch' },
             { sub: '整個電路只剩電池跟電阻 —— 純線性，一條 KVL 就解完。', on: 'cur' }]),
          sc('一條 KVL', 'ONE KVL',
            circ(70, 140, 150, 130, { k: 'c1', vps: '5 V', r: '2 kΩ', model: 'pwl', vg: '0.6', rf: '10', cur: 'cur' }) +
            calc(300, 112, 310, [['5 = I<sub>D</sub>·2k + 0.6 + I<sub>D</sub>·10', 'r1'], ['I<sub>D</sub> = 4.4 / 2010 = 2.19 mA', 'r2', 'ta'], ['V<sub>D</sub> = 0.6 + 2.19m × 10', 'r3'], ['　 = 0.622 V', 'r4', 'ta'], ['P<sub>D</sub> = 2.19m × 0.622 = 1.36 mW', 'r5', 'ta']], { k: 'cc' }),
            [{ sub: 'KVL：5 V = 電阻 + 電池 + r<sub>f</sub>。', on: 'c1 cur cc r1' },
             { sub: 'I<sub>D</sub> = (5 − 0.6)/(2000 + 10) = <b>2.19 mA</b>。10 Ω 跟 2 kΩ 比，幾乎沒影響。', on: 'r2' },
             { sub: '二極體兩端 = 電池 0.6 V + r<sub>f</sub> 上的 0.022 V。', on: 'r3' },
             { sub: 'V<sub>D</sub> = <b>0.622 V</b>。', on: 'r4' },
             { sub: '功率 = 電流 × 電壓 = <b>1.36 mW</b>。', on: 'r5' }]),
          ansScene(['I<sub>D</sub> = 2.19 mA', 'V<sub>D</sub> = 0.622 V', 'P<sub>D</sub> = 1.36 mW'],
            ['答案：I<sub>D</sub> = 2.19 mA、V<sub>D</sub> = 0.622 V、P<sub>D</sub> = 1.36 mW。', '跟疊代法（0.619 V、2.19 mA）幾乎一樣，但簡單多了。'])
        ];
      } },

    /* ═══════════ 1.3.2 講義 1-122 (3)：V_γ 改 0.7 V ═══════════ */
    { id: 'p5-vg07', sec: 'pwl', kind: 'pp', no: '', tag: '講義 1-122 (3)', title: 'V<sub>γ</sub> 改成 0.7 V，電流差多少？',
      q: '同 Example 1.9（V<sub>PS</sub> = 5 V、R = 2 kΩ），把 V<sub>γ</sub> 改成 0.7 V。(a) r<sub>f</sub> = 10 Ω 時 I<sub>D</sub> = ？(b) 再簡化成 r<sub>f</sub> = 0（定電壓降模型）時 I<sub>D</sub> = ？跟 V<sub>γ</sub> = 0.6 V 的 2.19 mA 比差多少？',
      en: 'Repeat Example 1.9 with V<sub>γ</sub> = 0.7 V: (a) with r<sub>f</sub> = 10 Ω; (b) with r<sub>f</sub> = 0 (constant-voltage-drop model). Compare with I<sub>D</sub> = 2.19 mA for V<sub>γ</sub> = 0.6 V.',
      hint: 'I<sub>D</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/(R + r<sub>f</sub>)。',
      steps: [
        st('(a) r<sub>f</sub> = 10 Ω。', 'I<sub>D</sub> = (5 − 0.7)/(2000 + 10) = 4.3/2010 = 2.14 mA', '分子少了 0.1 V。'),
        st('(b) r<sub>f</sub> = 0。', 'I<sub>D</sub> = (5 − 0.7)/2000 = 2.15 mA', '講義 1-122 (3) 寫的 2.15 mA 是這個（也就是 Fig 1.30 的 A 點）。'),
        st('比較。', '2.19 → 2.14 mA，只差約 2%', 'V<sub>PS</sub> = 5 V 比 0.1 V 大很多，所以 V<sub>γ</sub> 取 0.6 還是 0.7 影響不大；r<sub>f</sub> = 10 Ω ≪ R = 2 kΩ，影響更小。')
      ],
      ans: '(a) 2.14 mA　(b) 2.15 mA；都只比 2.19 mA 少約 2%',
      note: '講義 1-122 (3) 說「V<sub>γ</sub> = 0.7 V 可求出 I<sub>D</sub> = 2.15 mA」，但同一頁是 r<sub>f</sub> = 10 Ω 的例子；嚴格算是 2.14 mA，2.15 mA 是 r<sub>f</sub> = 0 的結果（見勘誤）。兩個差 0.01 mA，觀念一樣。<b>請確認老師要的是哪一個。</b>',
      story: () => {
        const { T, calc, sc, ansScene, g } = KK();
        const bar = (y, v, lab, key, cls) => g(key, '<rect class="' + (cls || 'accw') + '" x="200" y="' + y + '" width="' + (v / 2.2 * 330).toFixed(1) + '" height="26" rx="5"' + (cls === 'acc' ? '' : ' style="stroke:var(--s-acc);stroke-width:1.4"') + '/>' +
          T(190, y + 18, lab, { cls: 't', fs: 13, a: 'end' }) + T(200 + v / 2.2 * 330 + 8, y + 18, v.toFixed(2) + ' mA', { cls: 'ta', fs: 13, a: 'start' }));
        return [
          sc('三個數字放一起', 'SIDE BY SIDE',
            bar(122, 2.189, 'V<sub>γ</sub> 0.6、r<sub>f</sub> 10', 'b1', 'acc') + bar(166, 2.139, 'V<sub>γ</sub> 0.7、r<sub>f</sub> 10', 'b2') + bar(210, 2.15, 'V<sub>γ</sub> 0.7、r<sub>f</sub> 0', 'b3') +
            calc(150, 252, 340, [['差不到 2% —— 因為 5 V ≫ 0.1 V、2 kΩ ≫ 10 Ω', 'r1', 'ta']], { k: 'cc', lh: 26, a: 'middle' }),
            [{ sub: 'Example 1.9：V<sub>γ</sub> = 0.6 V、r<sub>f</sub> = 10 Ω → 2.19 mA。', on: 'b1' },
             { sub: 'V<sub>γ</sub> 改 0.7 V：4.3/2010 = <b>2.14 mA</b>。', on: 'b2' },
             { sub: '再把 r<sub>f</sub> 拿掉：4.3/2000 = <b>2.15 mA</b>（講義寫的是這個）。', on: 'b3' },
             { sub: '三個幾乎一樣長：電源夠大、電阻夠大時，模型細節不重要。', on: 'cc r1' }]),
          ansScene(['(a) 2.14 mA　(b) 2.15 mA', '都只比 2.19 mA 少約 2%'], ['答案：(a) 2.14 mA、(b) 2.15 mA。'])
        ];
      } },

    /* ═══════════ 1.3.2 定電壓降＋負載線：Fig 1.30 ═══════════ */
    { id: 'p5-fig130', sec: 'cvd', kind: 'pp', no: '', tag: '講義 Fig 1.30（1-125）', title: '四條負載線，四個 Q 點',
      q: '用定電壓降模型（V<sub>γ</sub> = 0.7 V、r<sub>f</sub> = 0），求四種組合的 Q 點電流：A：V<sub>PS</sub> = 5 V、R = 2 kΩ；B：5 V、4 kΩ；C：2.5 V、2 kΩ；D：2.5 V、4 kΩ。',
      en: 'Using the constant-voltage-drop model (V<sub>γ</sub> = 0.7 V, r<sub>f</sub> = 0), find the Q-point current for A: V<sub>PS</sub> = 5 V, R = 2 kΩ; B: 5 V, 4 kΩ; C: 2.5 V, 2 kΩ; D: 2.5 V, 4 kΩ.',
      hint: '定電壓降模型的特性曲線是一條立在 0.7 V 的垂直線，所以每個 Q 點的 V<sub>D</sub> 都是 0.7 V；I<sub>DQ</sub> = (V<sub>PS</sub> − 0.7)/R。',
      steps: [
        st('Q 點的電壓。', 'V<sub>DQ</sub> = V<sub>γ</sub> = 0.7 V（四個都一樣）', '特性曲線是垂直線，負載線怎麼移，交點都在 0.7 V 上。'),
        st('A、B（V<sub>PS</sub> = 5 V）。', 'A：4.3/2k = 2.15 mA　B：4.3/4k = 1.075 mA', 'R 加倍，負載線變平一倍，電流減半。'),
        st('C、D（V<sub>PS</sub> = 2.5 V）。', 'C：1.8/2k = 0.9 mA　D：1.8/4k = 0.45 mA', '電源變小，負載線整條往左下平移（斜率不變）。'),
        st('結論。', 'Q 點由 (1) 電源電壓、(2) 外接電阻、(3) 二極體 I–V 特性 共同決定', '講義 1-125：(1)(2) 是外接電路，(3) 是元件本身。')
      ],
      ans: 'V<sub>DQ</sub> = 0.7 V；I<sub>DQ</sub>：A 2.15 mA、B 1.075 mA、C 0.9 mA、D 0.45 mA',
      note: '用指數公式（I<sub>S</sub> = 10<sup>−13</sup> A）精算：A 2.19、B 1.10、C 0.951、D 0.480 mA，V<sub>D</sub> 在 0.58～0.62 V。定電壓降模型的電流都偏小一點點，因為它把 V<sub>D</sub> 估成 0.7 V。',
      story: () => {
        const { T, calc, sc, axes, ansScene } = KK();
        const P = axes(80, 112, 330, 170, { v0: 0, v1: 5.4, i0: 0, i1: 2.6, vt: [[0.7, '0.7'], [2.5, '2.5'], [5, '5']], it: [[2.5, '2.5'], [1.25, '1.25']] });
        const L = (V, R, key, cls) => P.seg(0, V / R, V, 0, key, cls);
        return [
          sc('一條垂直線 + 四條負載線', 'FOUR LOAD LINES',
            P.svg + P.seg(0.7, 0, 0.7, 2.6, 'cv', 'lna', ' style="stroke-width:3"') + T(P.X(0.7) + 8, P.Y(2.5), 'V<sub>γ</sub> = 0.7 V', { cls: 'ta', fs: 12, a: 'start', k: 'cvl' }) +
            L(5, 2, 'la') + L(5, 4, 'lb') + L(2.5, 2, 'lc', 'ln dsh') + L(2.5, 4, 'ld', 'ln dsh') +
            P.dot(0.7, 2.15, 'qa', 5) + P.dot(0.7, 1.075, 'qb', 5) + P.dot(0.7, 0.9, 'qc', 5) + P.dot(0.7, 0.45, 'qd', 5) +
            calc(440, 112, 170, [['A　2.15 mA', 'r1', 'ta'], ['B　1.075 mA', 'r2', 'ta'], ['C　0.9 mA', 'r3', 'ta'], ['D　0.45 mA', 'r4', 'ta']], { k: 'cc', title: 'I<sub>DQ</sub> = (V<sub>PS</sub> − 0.7)/R' }),
            [{ sub: '定電壓降模型：二極體的特性曲線是一條<b>立在 0.7 V 的垂直線</b>。', on: 'cv cvl' },
             { sub: 'A：5 V、2 kΩ，負載線從 2.5 mA 拉到 5 V，交點 <b>2.15 mA</b>。', on: 'la qa cc r1' },
             { sub: 'B：R 加倍，負載線變平，電流減半：<b>1.075 mA</b>。', on: 'lb qb r2' },
             { sub: 'C：電源減半，整條線往左下平移：<b>0.9 mA</b>。', on: 'lc qc r3' },
             { sub: 'D：兩個都改：<b>0.45 mA</b>。交點永遠在 0.7 V 那條線上。', on: 'ld qd r4' }]),
          ansScene(['V<sub>DQ</sub> = 0.7 V（四個都一樣）', 'A 2.15　B 1.075　C 0.9　D 0.45（mA）'], ['答案：電壓都是 0.7 V，電流 2.15、1.075、0.9、0.45 mA。'])
        ];
      } },

    /* ═══════════ 逆偏（講義 1-126） ═══════════ */
    { id: 'p5-rev', sec: 'revb', kind: 'pp', no: '', tag: '講義 1-126', title: '二極體反著接，Q 點在哪？',
      q: '電路同上（V<sub>PS</sub> = 5 V、R = 2 kΩ），但二極體反過來接（逆偏）。用負載線加片段線性模型求 Q 點 (V<sub>D</sub>, I<sub>D</sub>)。V<sub>D</sub>、I<sub>D</sub> 的正負號照二極體原本的定義。',
      en: 'The diode in the same circuit is reversed (reverse biased). Using the load line and the piecewise linear model, find the Q-point (V<sub>D</sub>, I<sub>D</sub>), keeping the original sign definitions of V<sub>D</sub> and I<sub>D</sub>.',
      fig: F('V_PS = 5 V', 'R = 2 kΩ', { rev: true }), cap: '二極體反接；V<sub>D</sub>、I<sub>D</sub> 的參考方向不變',
      hint: '照二極體的定義寫 KVL：V<sub>PS</sub> 這次是讓 V<sub>D</sub> 變負 → −5 = I<sub>D</sub>R + V<sub>D</sub>。截距：I<sub>D</sub> = 0 → V<sub>D</sub> = −5 V；V<sub>D</sub> = 0 → I<sub>D</sub> = −2.5 mA。',
      steps: [
        st('照定義寫 KVL。', '−V<sub>PS</sub> = I<sub>D</sub>R + V<sub>D</sub>　⟹　I<sub>D</sub> = −V<sub>D</sub>/R − V<sub>PS</sub>/R', '二極體反接，等於電源對二極體的定義方向來說是 −5 V（講義 1-113：定義的 + − 跟電流方向不變）。'),
        st('兩個截距。', 'I<sub>D</sub> = 0 → V<sub>D</sub> = −5 V　｜　V<sub>D</sub> = 0 → I<sub>D</sub> = −2.5 mA', '負載線在第三象限。'),
        st('跟特性曲線找交點。', 'V<sub>D</sub> &lt; V<sub>γ</sub> 的那段是 I<sub>D</sub> = 0 的水平線　⟹　交在 (−5 V, 0)', '逆偏時二極體 OFF，電流 0，整個 5 V 都落在二極體上（反方向）。'),
        st('結論。', 'Q = (−5 V, 0 A)', '電阻沒電流、沒壓降。')
      ],
      ans: 'Q = (V<sub>D</sub>, I<sub>D</sub>) = (−5 V, 0)',
      story: () => {
        const { T, calc, sc, axes, ansScene, circ } = KK();
        const P = axes(250, 120, 340, 160, { v0: -5.6, v1: 1.2, i0: -2.9, i1: 1.2, xl: 'V<sub>D</sub>', vt: [[-5, '−5 V'], [0.7, '0.7']], it: [[-2.5, '−2.5 mA']] });
        return [
          sc('反著接', 'REVERSED',
            circ(60, 150, 130, 120, { k: 'c0', vps: '5 V', r: '2 kΩ', rev: true }) +
            calc(250, 130, 360, [['I<sub>D</sub> = 0 → V<sub>D</sub> = −5 V', 'r1'], ['V<sub>D</sub> = 0 → I<sub>D</sub> = −2.5 mA', 'r2'], ['負載線落在第三象限', 'r3', 'ta']], { k: 'cc', title: '照原本定義寫 KVL：−5 = I<sub>D</sub>·2k + V<sub>D</sub>' }),
            [{ sub: '二極體反過來接，但 V<sub>D</sub>、I<sub>D</sub> 的<b>定義方向不變</b>。', on: 'c0' },
             { sub: '照定義寫 KVL：對二極體來說電源是 −5 V。', on: 'cc' },
             { sub: '兩個截距：(−5 V, 0) 和 (0, −2.5 mA)。', on: 'r1 r2 r3' }]),
          sc('交點', 'THE Q-POINT',
            P.svg + P.seg(-5.6, 0, 0.7, 0, 'off', 'lna', ' style="stroke-width:3"') + P.seg(0.7, 0, 0.7, 1.2, 'on', 'lna', ' style="stroke-width:3"') +
            P.seg(-5, 0, 0, -2.5, 'll', 'ln') + P.dot(-5, 0, 'q') +
            T(P.X(-5), P.Y(0) - 14, 'Q (−5 V, 0)', { cls: 'ta', fs: 13, k: 'ql' }) +
            calc(40, 140, 190, [['藍：片段線性模型', 'r1', 'ta'], ['黑：負載線', 'r2'], ['交在 OFF 那段', 'r3', 'ta']], { k: 'cc', lh: 26 }),
            [{ sub: '片段線性模型：V<sub>D</sub> &lt; 0.7 V 是一條<b>貼地的水平線</b>（OFF）。', on: 'off on cc r1' },
             { sub: '負載線從 (−5, 0) 拉到 (0, −2.5 mA)。', on: 'll r2' },
             { sub: '兩條交在 <b>(−5 V, 0)</b>：電流 0，5 V 全部反著落在二極體上。', on: 'q ql r3' }]),
          ansScene(['Q = (−5 V, 0 A)', '逆偏 → OFF → 電阻沒壓降'], ['答案：Q = (−5 V, 0)。'])
        ];
      } }
  ];

  window.__CH15EX = window.__CH15EX || { book: 'Neamen', items: [] };
  window.__CH15EX.items = window.__CH15EX.items.concat(items);
})();
