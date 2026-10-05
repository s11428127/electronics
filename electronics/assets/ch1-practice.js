/* ============================================================
   電子學 CH1 課本練習題（考試範圍：1.1 全部 ＋ 1.2 到順向偏壓）
   出處：Neamen, Microelectronics: Circuit Analysis and Design, 4th ed., Chapter 1
   - Exercise Problem（Ex）、Test Your Understanding（TYU）：課本有附答案，已用程式驗算
   - End-of-chapter Problems：課本沒附答案，詳解自己解，數值用程式驗算
   - Review Questions：觀念題，答案自己寫
   題目先中文、下面附英文原文（.q-en）。
   常數照課本 Table 1.3：Si B = 5.23×10¹⁵、Eg = 1.1 eV；GaAs 2.10×10¹⁴、1.4 eV；Ge 1.66×10¹⁵、0.66 eV；
   k = 86×10⁻⁶ eV/K；300 K 時 nᵢ(Si) = 1.5×10¹⁰、nᵢ(GaAs) = 1.8×10⁶、nᵢ(Ge) = 2.4×10¹³ cm⁻³；V_T = 0.026 V。
   ============================================================ */
(function () {
  'use strict';
  const st = (t, eq, why) => ({ t, eq, why });
  const X = (m, p) => m + ' × 10<sup>' + p + '</sup>';          /* 科學記號 */
  const cm3 = ' cm<sup>−3</sup>';
  const Q = (zh, en) => zh + '<div class="q-en">' + en + '</div>';
  const NI = 'n<sub>i</sub> = BT<sup>3/2</sup> e<sup>−E<sub>g</sub>/2kT</sup>';
  const VBI = 'V<sub>bi</sub> = V<sub>T</sub> ln(N<sub>a</sub>N<sub>d</sub>/n<sub>i</sub><sup>2</sup>)';
  const CJ = 'C<sub>j</sub> = C<sub>jo</sub>(1 + V<sub>R</sub>/V<sub>bi</sub>)<sup>−1/2</sup>';

  const items = [
    /* ═══════════ ★ 作業指定的進階題（PART II Advanced，會考） ═══════════ */
    { id: 'p1-2', sec: 'hw', kind: 'pp', tag: 'Problem 1.2', title: '★ 作業指定 · n<sub>i</sub> 不能超過多少 → 最高溫度',
      q: Q('(a) 矽的本質載子濃度不能大於 n<sub>i</sub> = ' + X('1', 12) + cm3 + '，求最高可容許溫度。(b) 若改成 n<sub>i</sub> = ' + X('1', 9) + cm3 + '，重做 (a)。',
        '(a) The intrinsic carrier concentration in silicon is to be no larger than n<sub>i</sub> = 10<sup>12</sup> cm<sup>−3</sup>. Determine the maximum allowable temperature. (b) Repeat part (a) for n<sub>i</sub> = 10<sup>9</sup> cm<sup>−3</sup>.'),
      hint: 'n<sub>i</sub> 隨溫度單調增加，所以「n<sub>i</sub> 不超過」就是「T 不超過」。把 ' + NI + ' 設成等於目標值，用試誤法（代幾個溫度）逼近。',
      steps: [
        st('Step 1　寫出條件。', X('5.23', 15) + ' × T<sup>3/2</sup> × e<sup>−1.1/(2 × 86×10<sup>−6</sup> × T)</sup> = ' + X('1', 12), 'T 同時出現在 T<sup>3/2</sup> 和指數裡，沒辦法直接解，只能試誤或數值解。'),
        st('Step 2　先代 300 K 當起點。', 'n<sub>i</sub>(300 K) = ' + X('1.5', 10) + ' ≪ 10<sup>12</sup>', '還差將近 100 倍，所以溫度要往上加。'),
        st('Step 3　試 350 K、370 K。', 'n<sub>i</sub>(350) = ' + X('3.97', 11) + '；n<sub>i</sub>(370) = ' + X('1.16', 12), '跨過 10<sup>12</sup> 了 → 答案在 350～370 K 之間，再細分。'),
        st('Step 4　(a) 逼近。', 'T ≈ 367 K（約 94 °C）', '指數項主導，溫度差 17 K 就讓 n<sub>i</sub> 變 2.5 倍。'),
        st('Step 5　(b) 同樣做法。', 'n<sub>i</sub> = 10<sup>9</sup> → T ≈ 268 K（約 −5 °C）', '要比室溫的 1.5×10<sup>10</sup> 還小，溫度必須降到室溫以下。')
      ],
      ans: '(a) T<sub>max</sub> ≈ 367 K　(b) T<sub>max</sub> ≈ 268 K' },

    { id: 'p1-9', sec: 'hw', kind: 'pp', tag: 'Problem 1.9', title: '★ 作業指定 · 已知電子濃度反推',
      q: Q('矽在 T = 300 K 的電子濃度 n<sub>o</sub> = ' + X('5', 15) + cm3 + '。(a) 求電洞濃度。(b) 是 n 型還是 p 型？(c) 雜質摻雜濃度是多少？',
        'The electron concentration in silicon at T = 300 K is n<sub>o</sub> = 5 × 10<sup>15</sup> cm<sup>−3</sup>. (a) Determine the hole concentration. (b) Is the material n-type or p-type? (c) What is the impurity doping concentration?'),
      hint: '質量作用定律 n<sub>o</sub>p<sub>o</sub> = n<sub>i</sub><sup>2</sup>；n<sub>o</sub> 遠大於 n<sub>i</sub> 表示摻的是施體。',
      steps: [
        st('Step 1　(a) 質量作用定律。', 'p<sub>o</sub> = n<sub>i</sub><sup>2</sup>/n<sub>o</sub> = (1.5×10<sup>10</sup>)<sup>2</sup> / (5×10<sup>15</sup>) = ' + X('4.5', 4) + cm3, '熱平衡下 n·p 固定是 n<sub>i</sub><sup>2</sup> = 2.25×10<sup>20</sup>。'),
        st('Step 2　(b) 比大小。', 'n<sub>o</sub> = 5×10<sup>15</sup> ≫ p<sub>o</sub> = 4.5×10<sup>4</sup> → n 型', '電子是多數載子。'),
        st('Step 3　(c) 摻雜濃度。', 'n<sub>o</sub> ≈ N<sub>d</sub> → N<sub>d</sub> = ' + X('5', 15) + cm3 + '（施體）', 'N<sub>d</sub> ≫ n<sub>i</sub>，每個施體給一個電子，熱產生的那一點點可以忽略。')
      ],
      ans: '(a) p<sub>o</sub> = 4.5 × 10<sup>4</sup> cm<sup>−3</sup>　(b) n 型　(c) N<sub>d</sub> = 5 × 10<sup>15</sup> cm<sup>−3</sup>（施體）' },

    { id: 'p1-14', sec: 'hw', kind: 'pp', tag: 'Problem 1.14', title: '★ 作業指定 · 要多少導電度 → 摻多少',
      q: Q('(a) 矽的導電度必須是 σ = 1.5 (Ω·cm)<sup>−1</sup>。若 μ<sub>n</sub> = 1000、μ<sub>p</sub> = 375 cm<sup>2</sup>/V·s，要加多少濃度的施體？(b) 導電度必須是 σ = 0.8 (Ω·cm)<sup>−1</sup>，μ<sub>n</sub> = 1200、μ<sub>p</sub> = 400 cm<sup>2</sup>/V·s，要加多少濃度的受體？',
        '(a) The required conductivity of a silicon material must be σ = 1.5 (Ω–cm)<sup>−1</sup>. If μ<sub>n</sub> = 1000 cm<sup>2</sup>/V–s and μ<sub>p</sub> = 375 cm<sup>2</sup>/V–s, what concentration of donor atoms must be added? (b) The required conductivity of a silicon material must be σ = 0.8 (Ω–cm)<sup>−1</sup>. If μ<sub>n</sub> = 1200 cm<sup>2</sup>/V–s and μ<sub>p</sub> = 400 cm<sup>2</sup>/V–s, what concentration of acceptor atoms must be added?'),
      hint: 'σ = e(μ<sub>n</sub>n + μ<sub>p</sub>p)。n 型只剩電子那一項，p 型只剩電洞那一項。',
      steps: [
        st('Step 1　(a) n 型：少數載子那項可以丟掉。', 'σ ≈ eμ<sub>n</sub>N<sub>d</sub>', '電洞濃度只有 n<sub>i</sub><sup>2</sup>/N<sub>d</sub>，小到可以忽略。'),
        st('Step 2　(a) 解 N<sub>d</sub>。', 'N<sub>d</sub> = σ/(eμ<sub>n</sub>) = 1.5 / (1.6×10<sup>−19</sup> × 1000) = ' + X('9.375', 15) + cm3, ''),
        st('Step 3　(b) p 型：只剩電洞那項。', 'N<sub>a</sub> = σ/(eμ<sub>p</sub>) = 0.8 / (1.6×10<sup>−19</sup> × 400) = ' + X('1.25', 16) + cm3, '注意 (b) 用的是 μ<sub>p</sub> = 400，不是 μ<sub>n</sub>。')
      ],
      ans: '(a) N<sub>d</sub> = 9.375 × 10<sup>15</sup> cm<sup>−3</sup>　(b) N<sub>a</sub> = 1.25 × 10<sup>16</sup> cm<sup>−3</sup>' },

    { id: 'p1-16', sec: 'hw', kind: 'pp', tag: 'Problem 1.16', title: '★ 作業指定 · 兩條斜線：總擴散電流',
      q: Q('矽樣品的電子、電洞濃度如圖 P1.16：<b>電子濃度從 x = 0 的 10<sup>16</sup> 直線降到 x = 0.001 cm 的 10<sup>12</sup> cm<sup>−3</sup></b>；<b>電洞濃度從 x = 0 的 10<sup>12</sup> 直線升到 x = 0.001 cm 的 10<sup>16</sup> cm<sup>−3</sup></b>。遷移率同 Problem 1.12（μ<sub>n</sub> = 1250、μ<sub>p</sub> = 450 cm<sup>2</sup>/V·s）。求 0 ≤ x ≤ 0.001 cm 的總擴散電流密度對 x 的關係。',
        'The electron and hole concentrations in a sample of silicon are shown in Figure P1.16. Assume the electron and hole mobilities are the same as in Problem 1.12. Determine the total diffusion current density versus distance x for 0 ≤ x ≤ 0.001 cm.'),
      hint: '擴散係數用愛因斯坦關係 D = μV<sub>T</sub>。J<sub>n</sub> = eD<sub>n</sub> dn/dx、J<sub>p</sub> = −eD<sub>p</sub> dp/dx（電洞那條有負號）。直線 → 斜率是常數。',
      steps: [
        st('Step 1　擴散係數（愛因斯坦關係）。', 'D<sub>n</sub> = 1250 × 0.026 = 32.5 cm<sup>2</sup>/s　D<sub>p</sub> = 450 × 0.026 = 11.7 cm<sup>2</sup>/s', 'D/μ = kT/e = V<sub>T</sub>。'),
        st('Step 2　兩條直線的斜率。', 'dn/dx = (10<sup>12</sup> − 10<sup>16</sup>)/0.001 ≈ −10<sup>19</sup> cm<sup>−4</sup>　dp/dx ≈ +10<sup>19</sup> cm<sup>−4</sup>', '10<sup>12</sup> 比 10<sup>16</sup> 小四個數量級，差不多就是 −10<sup>16</sup>/0.001。'),
        st('Step 3　電子擴散電流。', 'J<sub>n</sub> = eD<sub>n</sub> dn/dx = 1.6×10<sup>−19</sup> × 32.5 × (−10<sup>19</sup>) = −52.0 A/cm<sup>2</sup>', '電子往 +x 擴散（從高往低），帶負電 → 電流往 −x。'),
        st('Step 4　電洞擴散電流。', 'J<sub>p</sub> = −eD<sub>p</sub> dp/dx = −1.6×10<sup>−19</sup> × 11.7 × 10<sup>19</sup> = −18.7 A/cm<sup>2</sup>', '電洞往 −x 擴散（從高往低），帶正電 → 電流也往 −x。兩個方向一致，會疊加。'),
        st('Step 5　總和。', 'J = J<sub>n</sub> + J<sub>p</sub> = −70.7 A/cm<sup>2</sup>（0 ≤ x ≤ 0.001 cm 內都一樣）', '直線 → 斜率固定 → 電流密度跟 x 無關。')
      ],
      ans: 'J = −70.7 A/cm<sup>2</sup>（J<sub>n</sub> = −52.0、J<sub>p</sub> = −18.7），在整段 0～0.001 cm 都是常數',
      note: '圖 P1.16 的兩條虛線是直線（線性變化），斜率用 (10<sup>12</sup> − 10<sup>16</sup>)/0.001 = −9.999×10<sup>18</sup> 精確算是 J = −70.7 A/cm<sup>2</sup>。' },

    { id: 'p1-17', sec: 'hw', kind: 'pp', tag: 'Problem 1.17', title: '★ 作業指定 · 指數衰減的電洞擴散',
      q: Q('矽中的電洞濃度為 p(x) = 10<sup>4</sup> + 10<sup>15</sup> exp(−x/L<sub>p</sub>)，x ≥ 0。L<sub>p</sub> = 10 μm，電洞擴散係數 D<sub>p</sub> = 15 cm<sup>2</sup>/s。求 (a) x = 0、(b) x = 10 μm、(c) x = 30 μm 的電洞擴散電流密度。',
        'The hole concentration in silicon is given by p(x) = 10<sup>4</sup> + 10<sup>15</sup> exp(−x/L<sub>p</sub>), x ≥ 0. The value of L<sub>p</sub> is 10 μm. The hole diffusion coefficient is D<sub>p</sub> = 15 cm<sup>2</sup>/s. Determine the hole diffusion current density at (a) x = 0, (b) x = 10 μm, and (c) x = 30 μm.'),
      hint: 'J<sub>p</sub> = −eD<sub>p</sub> dp/dx。常數 10<sup>4</sup> 微分後消失。L<sub>p</sub> 要換成 cm：10 μm = 10<sup>−3</sup> cm。',
      steps: [
        st('Step 1　微分。', 'dp/dx = −(10<sup>15</sup>/L<sub>p</sub>) e<sup>−x/L<sub>p</sub></sup>', '10<sup>4</sup> 是常數（背景的少數載子），對擴散沒有貢獻。'),
        st('Step 2　代入擴散電流。', 'J<sub>p</sub> = −eD<sub>p</sub> dp/dx = (eD<sub>p</sub>·10<sup>15</sup>/L<sub>p</sub>) e<sup>−x/L<sub>p</sub></sup>', '兩個負號抵銷：電洞往 +x 擴散，電流往 +x。'),
        st('Step 3　係數。', '1.6×10<sup>−19</sup> × 15 × 10<sup>15</sup> / 10<sup>−3</sup> = 2.4 A/cm<sup>2</sup>', '單位全用 cm。'),
        st('Step 4　三個位置。', '(a) x = 0：2.4　(b) x = L<sub>p</sub>：2.4e<sup>−1</sup> = 0.883　(c) x = 3L<sub>p</sub>：2.4e<sup>−3</sup> = 0.119 A/cm<sup>2</sup>', '每走一個 L<sub>p</sub>，電流就剩 1/e。')
      ],
      ans: '(a) 2.4 A/cm<sup>2</sup>　(b) 0.883 A/cm<sup>2</sup>　(c) 0.119 A/cm<sup>2</sup>' },

    { id: 'p1-20', sec: 'hw', kind: 'pp', tag: 'Problem 1.20', title: '★ 作業指定 · 由 V<sub>bi</sub> 反推 N<sub>a</sub>',
      q: Q('一個矽 pn 接面，n 區摻雜 N<sub>d</sub> = ' + X('1', 16) + cm3 + '。內建電位障要是 V<sub>bi</sub> = 0.712 V，求 p 區需要的摻雜濃度。',
        'Consider a silicon pn junction. The n-region is doped to a value of N<sub>d</sub> = 10<sup>16</sup> cm<sup>−3</sup>. The built-in potential barrier is to be V<sub>bi</sub> = 0.712 V. Determine the required p-type doping concentration.'),
      hint: VBI + '，把 ln 拿掉：N<sub>a</sub>N<sub>d</sub> = n<sub>i</sub><sup>2</sup> e<sup>V<sub>bi</sub>/V<sub>T</sub></sup>。',
      steps: [
        st('Step 1　反解乘積。', 'N<sub>a</sub>N<sub>d</sub> = n<sub>i</sub><sup>2</sup> e<sup>V<sub>bi</sub>/V<sub>T</sub></sup> = 2.25×10<sup>20</sup> × e<sup>0.712/0.026</sup>', '兩邊取 e 的次方，把 ln 消掉。'),
        st('Step 2　指數。', 'e<sup>27.385</sup> = ' + X('7.82', 11), ''),
        st('Step 3　除以 N<sub>d</sub>。', 'N<sub>a</sub> = 2.25×10<sup>20</sup> × 7.82×10<sup>11</sup> / 10<sup>16</sup> = ' + X('1.76', 16) + cm3, '驗算：V<sub>T</sub> ln(1.76×10<sup>32</sup>/2.25×10<sup>20</sup>) = 0.712 V ✓')
      ],
      ans: 'N<sub>a</sub> ≈ 1.76 × 10<sup>16</sup> cm<sup>−3</sup>' },

    { id: 'p1-25', sec: 'hw', kind: 'pp', tag: 'Problem 1.25', title: '★ 作業指定 · 接面電容 + 電感 = 可調共振',
      q: Q('矽 pn 接面摻雜 N<sub>d</sub> = ' + X('5', 15) + '、N<sub>a</sub> = ' + X('1', 17) + cm3 + '，零偏壓接面電容 C<sub>jo</sub> = 0.60 pF。把 1.50 mH 的電感跟 pn 接面並聯，求逆向偏壓 (a) V<sub>R</sub> = 1 V、(b) 3 V、(c) 5 V 時電路的共振頻率 f<sub>o</sub>。',
        'The doping concentrations in a silicon pn junction are N<sub>d</sub> = 5 × 10<sup>15</sup> cm<sup>−3</sup> and N<sub>a</sub> = 10<sup>17</sup> cm<sup>−3</sup>. The zero-bias junction capacitance is C<sub>jo</sub> = 0.60 pF. An inductance of 1.50 mH is connected in parallel with the pn junction. Calculate the resonant frequency f<sub>o</sub> of the circuit for reverse-bias voltages of (a) V<sub>R</sub> = 1 V, (b) V<sub>R</sub> = 3 V, and (c) V<sub>R</sub> = 5 V.'),
      hint: '先算 V<sub>bi</sub>，再用 ' + CJ + '，最後 f<sub>o</sub> = 1/(2π√(LC<sub>j</sub>))。',
      steps: [
        st('Step 1　內建電壓。', 'V<sub>bi</sub> = 0.026 ln[(10<sup>17</sup>)(5×10<sup>15</sup>)/(1.5×10<sup>10</sup>)<sup>2</sup>] = 0.026 × 28.43 = 0.739 V', ''),
        st('Step 2　三個偏壓的 C<sub>j</sub>。', 'V<sub>R</sub> = 1：0.6/√(1 + 1/0.739) = 0.391 pF　3 V：0.267 pF　5 V：0.215 pF', '逆偏越大，空乏區越寬，電容越小（像電容器兩片板子拉開）。'),
        st('Step 3　共振頻率。', 'f<sub>o</sub> = 1/(2π√(1.5×10<sup>−3</sup> × C<sub>j</sub>))', 'LC 並聯共振。'),
        st('Step 4　代入。', '(a) 6.57 MHz　(b) 7.96 MHz　(c) 8.86 MHz', '電容變小 → 頻率變高。這就是變容二極體拿來調頻率的原理。')
      ],
      ans: '(a) f<sub>o</sub> ≈ 6.57 MHz　(b) ≈ 7.96 MHz　(c) ≈ 8.86 MHz（C<sub>j</sub> = 0.391、0.267、0.215 pF）' },

    { id: 'p1-36', sec: 'hw', kind: 'pp', tag: 'Problem 1.36', title: '★ 作業指定（延伸：溫度效應還沒教）· I<sub>S</sub> 的溫度範圍',
      q: Q('矽 pn 接面二極體在 T = 300 K 的逆向飽和電流 I<sub>S</sub> = 10<sup>−12</sup> A。求 I<sub>S</sub> 從 0.5×10<sup>−12</sup> A 變到 50×10<sup>−12</sup> A 的溫度範圍。',
        'The reverse-saturation current of a silicon pn junction diode at T = 300 K is I<sub>S</sub> = 10<sup>−12</sup> A. Determine the temperature range over which I<sub>S</sub> varies from 0.5 × 10<sup>−12</sup> A to 50 × 10<sup>−12</sup> A.'),
      hint: '課本 1.2.5：I<sub>S</sub> 大約每升 5 °C 加倍 → I<sub>S</sub>(T) = I<sub>S</sub>(300) × 2<sup>ΔT/5</sup>。',
      steps: [
        st('Step 1　寫成加倍規則。', 'I<sub>S</sub>(T) = 10<sup>−12</sup> × 2<sup>(T − 300)/5</sup>', '課本：「I<sub>S</sub> approximately doubles for every 5 °C increase」。'),
        st('Step 2　下限 0.5×10<sup>−12</sup>。', '2<sup>ΔT/5</sup> = 0.5 → ΔT = −5 K → T = 295 K', '少一半 = 降一個 5 °C。'),
        st('Step 3　上限 50×10<sup>−12</sup>。', '2<sup>ΔT/5</sup> = 50 → ΔT = 5 log<sub>2</sub>50 = 28.2 K → T ≈ 328 K', 'log<sub>2</sub>50 = ln50/ln2 = 5.64。')
      ],
      ans: '約 295 K ≤ T ≤ 328 K（22 °C 到 55 °C）',
      note: '溫度效應在原講義 PART 4 第 8 頁之後（10/5 考試範圍外），作業列為進階題所以放在這裡。這裡用課本「每 5 °C 加倍」的近似。' },

    { id: 'p1-37', sec: 'hw', kind: 'pp', tag: 'Problem 1.37', title: '★ 作業指定（延伸：溫度效應還沒教）· 100 °C 與 −55 °C 的電流比',
      q: Q('矽 pn 接面二極體加 0.6 V 順向偏壓。求 100 °C 時的電流與 −55 °C 時電流的比值。',
        'A silicon pn junction diode has an applied forward-bias voltage of 0.6 V. Determine the ratio of current at 100 °C to that at −55 °C.'),
      hint: 'i<sub>D</sub> ≈ I<sub>S</sub>e<sup>v<sub>D</sub>/V<sub>T</sub></sup>：I<sub>S</sub> 會變（每 5 °C 加倍），V<sub>T</sub> = kT/e 也會變。',
      steps: [
        st('Step 1　I<sub>S</sub> 的比。', 'ΔT = 100 − (−55) = 155 °C → 2<sup>155/5</sup> = 2<sup>31</sup> = ' + X('2.15', 9), ''),
        st('Step 2　兩個溫度的 V<sub>T</sub>。', 'V<sub>T</sub>(373 K) = 86×10<sup>−6</sup> × 373.15 = 0.0321 V　V<sub>T</sub>(218 K) = 0.0188 V', '溫度越低，V<sub>T</sub> 越小，指數越大。'),
        st('Step 3　指數項的比。', 'e<sup>0.6/0.0321</sup> / e<sup>0.6/0.0188</sup> = e<sup>18.70 − 31.98</sup> = ' + X('1.70', '−6'), '低溫時指數大，但 I<sub>S</sub> 小非常多。'),
        st('Step 4　相乘。', 'I(100 °C)/I(−55 °C) ≈ 2.15×10<sup>9</sup> × 1.70×10<sup>−6</sup> ≈ ' + X('3.7', 3), 'I<sub>S</sub> 的增加贏過 V<sub>T</sub> 變大造成的減少。')
      ],
      ans: '約 3.7 × 10<sup>3</sup> 倍',
      note: '同樣是溫度效應（範圍外的延伸題）。用課本「I<sub>S</sub> 每 5 °C 加倍」＋ V<sub>T</sub> = kT/e（k = 86×10<sup>−6</sup> eV/K）算出約 3.65×10<sup>3</sup>；不同近似會有些出入。' },

    /* ═══════════ Exercise Problems（課本附答案） ═══════════ */
    { id: 'ex1-1', sec: 'ex', kind: 'pp', tag: 'Exercise 1.1', title: 'GaAs、Ge 的 n<sub>i</sub>',
      q: Q('計算 T = 300 K 時砷化鎵（GaAs）與鍺（Ge）的本質載子濃度。', 'Calculate the intrinsic carrier concentration in gallium arsenide and germanium at T = 300 K.'),
      hint: NI + '，B 和 E<sub>g</sub> 查 Table 1.3。',
      steps: [
        st('Step 1　GaAs（B = 2.10×10<sup>14</sup>、E<sub>g</sub> = 1.4 eV）。', 'T<sup>3/2</sup> = 300<sup>1.5</sup> = 5196；−E<sub>g</sub>/2kT = −1.4/(2 × 86×10<sup>−6</sup> × 300) = −27.13', ''),
        st('Step 2　GaAs 相乘。', 'n<sub>i</sub> = 2.10×10<sup>14</sup> × 5196 × e<sup>−27.13</sup> = ' + X('1.80', 6) + cm3, '能隙大 → 指數項很小 → n<sub>i</sub> 比矽少四個數量級。'),
        st('Step 3　Ge（B = 1.66×10<sup>15</sup>、E<sub>g</sub> = 0.66 eV）。', '−0.66/(2 × 86×10<sup>−6</sup> × 300) = −12.79 → n<sub>i</sub> = 1.66×10<sup>15</sup> × 5196 × e<sup>−12.79</sup> = ' + X('2.40', 13) + cm3, '能隙小 → n<sub>i</sub> 比矽多三個數量級。')
      ],
      ans: 'GaAs：n<sub>i</sub> = 1.80 × 10<sup>6</sup> cm<sup>−3</sup>；Ge：n<sub>i</sub> = 2.40 × 10<sup>13</sup> cm<sup>−3</sup>' },

    { id: 'ex1-2', sec: 'ex', kind: 'pp', tag: 'Exercise 1.2', title: '多數、少數載子（Si 與 GaAs）',
      q: Q('(a) 計算 T = 300 K 矽的多數與少數載子濃度：(i) N<sub>d</sub> = ' + X('2', 16) + cm3 + '、(ii) N<sub>a</sub> = ' + X('1', 15) + cm3 + '。(b) GaAs 重做 (a)。',
        '(a) Calculate the majority and minority carrier concentrations in silicon at T = 300 K for (i) N<sub>d</sub> = 2 × 10<sup>16</sup> cm<sup>−3</sup> and (ii) N<sub>a</sub> = 10<sup>15</sup> cm<sup>−3</sup>. (b) Repeat part (a) for GaAs.'),
      hint: '多數載子 ≈ 摻雜濃度；少數載子 = n<sub>i</sub><sup>2</sup>/多數。',
      steps: [
        st('Step 1　Si (i) n 型。', 'n<sub>o</sub> = 2×10<sup>16</sup>；p<sub>o</sub> = 2.25×10<sup>20</sup>/2×10<sup>16</sup> = 1.125×10<sup>4</sup>', ''),
        st('Step 2　Si (ii) p 型。', 'p<sub>o</sub> = 10<sup>15</sup>；n<sub>o</sub> = 2.25×10<sup>20</sup>/10<sup>15</sup> = 2.25×10<sup>5</sup>', ''),
        st('Step 3　GaAs：n<sub>i</sub><sup>2</sup> = (1.8×10<sup>6</sup>)<sup>2</sup> = 3.24×10<sup>12</sup>。', '(i) p<sub>o</sub> = 3.24×10<sup>12</sup>/2×10<sup>16</sup> = 1.62×10<sup>−4</sup>　(ii) n<sub>o</sub> = 3.24×10<sup>12</sup>/10<sup>15</sup> = 3.24×10<sup>−3</sup>', '少數載子濃度小於 1 cm<sup>−3</sup> —— 意思是一大塊材料裡幾乎找不到一個。')
      ],
      ans: '(a)(i) n<sub>o</sub> = 2×10<sup>16</sup>、p<sub>o</sub> = 1.125×10<sup>4</sup>；(ii) p<sub>o</sub> = 10<sup>15</sup>、n<sub>o</sub> = 2.25×10<sup>5</sup>　(b)(i) n<sub>o</sub> = 2×10<sup>16</sup>、p<sub>o</sub> = 1.62×10<sup>−4</sup>；(ii) p<sub>o</sub> = 10<sup>15</sup>、n<sub>o</sub> = 3.24×10<sup>−3</sup>（單位 cm<sup>−3</sup>）' },

    { id: 'ex1-3', sec: 'ex', kind: 'pp', tag: 'Exercise 1.3', title: 'GaAs 的電阻率與電場',
      q: Q('n 型 GaAs，T = 300 K，N<sub>d</sub> = ' + X('2', 16) + cm3 + '，μ<sub>n</sub> = 6800、μ<sub>p</sub> = 300 cm<sup>2</sup>/V·s。(a) 求電阻率。(b) 要產生 175 A/cm<sup>2</sup> 的漂移電流密度，需要多大的電場？',
        'Consider n-type GaAs at T = 300 K doped to a concentration of N<sub>d</sub> = 2 × 10<sup>16</sup> cm<sup>−3</sup>. Assume mobility values of μ<sub>n</sub> = 6800 cm<sup>2</sup>/V–s and μ<sub>p</sub> = 300 cm<sup>2</sup>/V–s. (a) Determine the resistivity of the material. (b) Determine the applied electric field that will induce a drift current density of 175 A/cm<sup>2</sup>.'),
      hint: 'σ ≈ eμ<sub>n</sub>N<sub>d</sub>、ρ = 1/σ、J = σE。',
      steps: [
        st('Step 1　導電度。', 'σ = 1.6×10<sup>−19</sup> × 6800 × 2×10<sup>16</sup> = 21.76 (Ω·cm)<sup>−1</sup>', '電洞濃度 ~10<sup>−4</sup>，那一項完全可以忽略。'),
        st('Step 2　電阻率。', 'ρ = 1/21.76 = 0.0460 Ω·cm', ''),
        st('Step 3　電場。', 'E = J/σ = 175/21.76 = 8.04 V/cm', '')
      ],
      ans: '(a) ρ = 0.0460 Ω·cm　(b) E = 8.04 V/cm' },

    { id: 'ex1-4', sec: 'ex', kind: 'pp', tag: 'Exercise 1.4', title: '指數分布的電洞擴散電流',
      q: Q('矽，T = 300 K，電洞濃度 p = 10<sup>16</sup> e<sup>−x/L<sub>p</sub></sup> (cm<sup>−3</sup>)，L<sub>p</sub> = 10<sup>−3</sup> cm，D<sub>p</sub> = 10 cm<sup>2</sup>/s。求 (a) x = 0、(b) x = 10<sup>−3</sup> cm 的電洞擴散電流密度。',
        'Consider silicon at T = 300 K. Assume the hole concentration is given by p = 10<sup>16</sup> e<sup>−x/L<sub>p</sub></sup> (cm<sup>−3</sup>), where L<sub>p</sub> = 10<sup>−3</sup> cm. Calculate the hole diffusion current density at (a) x = 0 and (b) x = 10<sup>−3</sup> cm. Assume D<sub>p</sub> = 10 cm<sup>2</sup>/s.'),
      hint: 'J<sub>p</sub> = −eD<sub>p</sub> dp/dx。',
      steps: [
        st('Step 1　微分。', 'dp/dx = −(10<sup>16</sup>/L<sub>p</sub>) e<sup>−x/L<sub>p</sub></sup>', ''),
        st('Step 2　代入。', 'J<sub>p</sub> = (eD<sub>p</sub>10<sup>16</sup>/L<sub>p</sub>) e<sup>−x/L<sub>p</sub></sup> = 16 e<sup>−x/L<sub>p</sub></sup> A/cm<sup>2</sup>', '1.6×10<sup>−19</sup> × 10 × 10<sup>16</sup> / 10<sup>−3</sup> = 16。'),
        st('Step 3　兩個位置。', '(a) 16 A/cm<sup>2</sup>　(b) 16e<sup>−1</sup> = 5.89 A/cm<sup>2</sup>', '')
      ],
      ans: '(a) 16 A/cm<sup>2</sup>　(b) 5.89 A/cm<sup>2</sup>' },

    { id: 'ex1-5', sec: 'ex', kind: 'pp', tag: 'Exercise 1.5', title: 'GaAs、Ge 的 V<sub>bi</sub>',
      q: Q('(a) 計算 GaAs pn 接面在 T = 300 K、N<sub>a</sub> = 10<sup>16</sup>、N<sub>d</sub> = 10<sup>17</sup> cm<sup>−3</sup> 的 V<sub>bi</sub>。(b) 同樣摻雜換成鍺，重做 (a)。',
        '(a) Calculate V<sub>bi</sub> for a GaAs pn junction at T = 300 K for N<sub>a</sub> = 10<sup>16</sup> cm<sup>−3</sup> and N<sub>d</sub> = 10<sup>17</sup> cm<sup>−3</sup>. (b) Repeat part (a) for a Germanium pn junction with the same doping concentrations.'),
      hint: VBI + '；只差在 n<sub>i</sub>。',
      steps: [
        st('Step 1　GaAs。', 'V<sub>bi</sub> = 0.026 ln[10<sup>33</sup>/(1.8×10<sup>6</sup>)<sup>2</sup>] = 0.026 × 47.18 = 1.23 V', 'n<sub>i</sub> 小 → 分母小 → V<sub>bi</sub> 大。'),
        st('Step 2　Ge。', 'V<sub>bi</sub> = 0.026 ln[10<sup>33</sup>/(2.4×10<sup>13</sup>)<sup>2</sup>] = 0.026 × 14.37 = 0.374 V', '能隙小的材料，內建電壓也小。')
      ],
      ans: '(a) V<sub>bi</sub> = 1.23 V　(b) V<sub>bi</sub> = 0.374 V' },

    { id: 'ex1-6', sec: 'ex', kind: 'pp', tag: 'Exercise 1.6', title: '由 C<sub>j</sub> 反推 C<sub>jo</sub>',
      q: Q('矽 pn 接面，T = 300 K，N<sub>d</sub> = 10<sup>16</sup>、N<sub>a</sub> = 10<sup>17</sup> cm<sup>−3</sup>。逆向偏壓 V<sub>R</sub> = 5 V 時接面電容要是 C<sub>j</sub> = 0.8 pF，求零偏壓接面電容 C<sub>jo</sub>。',
        'A silicon pn junction at T = 300 K is doped at N<sub>d</sub> = 10<sup>16</sup> cm<sup>−3</sup> and N<sub>a</sub> = 10<sup>17</sup> cm<sup>−3</sup>. The junction capacitance is to be C<sub>j</sub> = 0.8 pF when a reverse-bias voltage of V<sub>R</sub> = 5 V is applied. Find the zero-biased junction capacitance C<sub>jo</sub>.'),
      hint: '先算 V<sub>bi</sub>，再把 ' + CJ + ' 反過來：C<sub>jo</sub> = C<sub>j</sub>√(1 + V<sub>R</sub>/V<sub>bi</sub>)。',
      steps: [
        st('Step 1　V<sub>bi</sub>。', 'V<sub>bi</sub> = 0.026 ln[10<sup>33</sup>/2.25×10<sup>20</sup>] = 0.757 V', '跟 Example 1.5 同一組摻雜。'),
        st('Step 2　反推。', 'C<sub>jo</sub> = 0.8 × √(1 + 5/0.757) = 0.8 × 2.758 = 2.21 pF', '零偏壓時空乏區最窄，電容最大。')
      ],
      ans: 'C<sub>jo</sub> = 2.21 pF' },

    /* ═══════════ Test Your Understanding（課本附答案） ═══════════ */
    { id: 'tyu1-1', sec: 'tyu', kind: 'pp', tag: 'TYU 1.1', title: '三種材料在 400 K、250 K 的 n<sub>i</sub>',
      q: Q('求矽、鍺、GaAs 在 (a) T = 400 K、(b) T = 250 K 的本質載子濃度。', 'Determine the intrinsic carrier concentration in silicon, germanium, and GaAs at (a) T = 400 K and (b) T = 250 K.'),
      hint: NI + '。T 變了，T<sup>3/2</sup> 和指數兩項都要重算。',
      steps: [
        st('Step 1　400 K：kT = 0.0344 eV，2kT = 0.0688。', 'Si：5.23×10<sup>15</sup> × 8000 × e<sup>−1.1/0.0688</sup> = 4.76×10<sup>12</sup>', '400<sup>1.5</sup> = 8000。'),
        st('Step 2　400 K 的 Ge、GaAs。', 'Ge：9.06×10<sup>14</sup>　GaAs：2.44×10<sup>9</sup>', ''),
        st('Step 3　250 K：2kT = 0.043，250<sup>1.5</sup> = 3953。', 'Si：1.61×10<sup>8</sup>　Ge：1.42×10<sup>12</sup>　GaAs：6.02×10<sup>3</sup>', '溫度降 50 K，矽的 n<sub>i</sub> 掉了兩個數量級。')
      ],
      ans: '(a) Si 4.76×10<sup>12</sup>、Ge 9.06×10<sup>14</sup>、GaAs 2.44×10<sup>9</sup>　(b) Si 1.61×10<sup>8</sup>、Ge 1.42×10<sup>12</sup>、GaAs 6.02×10<sup>3</sup>（cm<sup>−3</sup>）' },

    { id: 'tyu1-2', sec: 'tyu', kind: 'pp', tag: 'TYU 1.2', title: '導電度與電阻率',
      q: Q('矽，T = 300 K，μ<sub>n</sub> = 1350、μ<sub>p</sub> = 480 cm<sup>2</sup>/V·s。求導電度與電阻率：(a) N<sub>a</sub> = ' + X('2', 15) + cm3 + '、(b) N<sub>d</sub> = ' + X('2', 17) + cm3 + '。',
        'Consider silicon at T = 300 K. Assume that μ<sub>n</sub> = 1350 cm<sup>2</sup>/V–s and μ<sub>p</sub> = 480 cm<sup>2</sup>/V–s. Determine the conductivity and resistivity if (a) N<sub>a</sub> = 2 × 10<sup>15</sup> cm<sup>−3</sup> and (b) N<sub>d</sub> = 2 × 10<sup>17</sup> cm<sup>−3</sup>.'),
      hint: 'p 型只留電洞項 σ ≈ eμ<sub>p</sub>N<sub>a</sub>；n 型只留電子項 σ ≈ eμ<sub>n</sub>N<sub>d</sub>。',
      steps: [
        st('Step 1　(a) p 型。', 'σ = 1.6×10<sup>−19</sup> × 480 × 2×10<sup>15</sup> = 0.154 (Ω·cm)<sup>−1</sup>，ρ = 6.51 Ω·cm', ''),
        st('Step 2　(b) n 型。', 'σ = 1.6×10<sup>−19</sup> × 1350 × 2×10<sup>17</sup> = 43.2 (Ω·cm)<sup>−1</sup>，ρ = 0.0231 Ω·cm', '摻雜多 100 倍、μ 也比較大 → 導電度差了快 300 倍。')
      ],
      ans: '(a) σ = 0.154 (Ω·cm)<sup>−1</sup>、ρ = 6.51 Ω·cm　(b) σ = 43.2 (Ω·cm)<sup>−1</sup>、ρ = 0.0231 Ω·cm' },

    { id: 'tyu1-3', sec: 'tyu', kind: 'pp', tag: 'TYU 1.3', title: '漂移電流密度',
      q: Q('用 TYU 1.2 的結果，若加 4 V/cm 的電場，求漂移電流密度。', 'Using the results of TYU 1.2, determine the drift current density if an electric field of 4 V/cm is applied to the semiconductor.'),
      hint: 'J = σE。',
      steps: [st('Step 1　(a)。', 'J = 0.154 × 4 = 0.616 A/cm<sup>2</sup>', ''), st('Step 2　(b)。', 'J = 43.2 × 4 = 172.8 A/cm<sup>2</sup>', '')],
      ans: '(a) 0.616 A/cm<sup>2</sup>　(b) 172.8 A/cm<sup>2</sup>',
      note: '用 σ 的精確值 0.1536 算是 0.614；課本用四捨五入後的 0.154，答案寫 0.616。' },

    { id: 'tyu1-4', sec: 'tyu', kind: 'pp', tag: 'TYU 1.4', title: '線性濃度的擴散電流',
      q: Q('矽的 D<sub>n</sub> = 35、D<sub>p</sub> = 12.5 cm<sup>2</sup>/s。求電子、電洞擴散電流密度：(a) 電子濃度從 x = 0 的 10<sup>15</sup> 線性變到 x = 2.5 μm 的 10<sup>16</sup> cm<sup>−3</sup>；(b) 電洞濃度從 x = 0 的 10<sup>14</sup> 線性變到 x = 4.0 μm 的 5×10<sup>15</sup> cm<sup>−3</sup>。',
        'The electron and hole diffusion coefficients in silicon are D<sub>n</sub> = 35 cm<sup>2</sup>/s and D<sub>p</sub> = 12.5 cm<sup>2</sup>/s, respectively. Calculate the electron and hole diffusion current densities (a) if an electron concentration varies linearly from n = 10<sup>15</sup> cm<sup>−3</sup> to n = 10<sup>16</sup> cm<sup>−3</sup> over the distance from x = 0 to x = 2.5 μm and (b) if a hole concentration varies linearly from p = 10<sup>14</sup> cm<sup>−3</sup> to p = 5 × 10<sup>15</sup> cm<sup>−3</sup> over the distance from x = 0 to x = 4.0 μm.'),
      hint: 'J<sub>n</sub> = +eD<sub>n</sub> dn/dx、J<sub>p</sub> = −eD<sub>p</sub> dp/dx；μm 換成 cm（1 μm = 10<sup>−4</sup> cm）。',
      steps: [
        st('Step 1　(a) 斜率。', 'dn/dx = (10<sup>16</sup> − 10<sup>15</sup>)/(2.5×10<sup>−4</sup>) = 3.6×10<sup>19</sup> cm<sup>−4</sup>', ''),
        st('Step 2　(a) 電流。', 'J<sub>n</sub> = 1.6×10<sup>−19</sup> × 35 × 3.6×10<sup>19</sup> = 202 A/cm<sup>2</sup>', '電子往 −x 擴散，帶負電 → 電流往 +x，正的。'),
        st('Step 3　(b)。', 'dp/dx = 4.9×10<sup>15</sup>/4×10<sup>−4</sup> = 1.225×10<sup>19</sup>；J<sub>p</sub> = −1.6×10<sup>−19</sup> × 12.5 × 1.225×10<sup>19</sup> = −24.5 A/cm<sup>2</sup>', '電洞往 −x 擴散，電流也往 −x，負的。')
      ],
      ans: '(a) J<sub>n</sub> = 202 A/cm<sup>2</sup>　(b) J<sub>p</sub> = −24.5 A/cm<sup>2</sup>' },

    { id: 'tyu1-5', sec: 'tyu', kind: 'pp', tag: 'TYU 1.5', title: '平衡濃度 + 多出載子',
      q: Q('矽，T = 300 K，N<sub>d</sub> = ' + X('8', 15) + cm3 + '。(a) 求 n<sub>o</sub>、p<sub>o</sub>。(b) 若產生多出的電子電洞 δn = δp = 10<sup>14</sup> cm<sup>−3</sup>，求電子與電洞的總濃度。',
        'A sample of silicon at T = 300 K is doped to N<sub>d</sub> = 8 × 10<sup>15</sup> cm<sup>−3</sup>. (a) Calculate n<sub>o</sub> and p<sub>o</sub>. (b) If excess holes and electrons are generated such that their respective concentrations are δn = δp = 10<sup>14</sup> cm<sup>−3</sup>, determine the total concentrations of holes and electrons.'),
      hint: 'n = n<sub>o</sub> + δn、p = p<sub>o</sub> + δp。',
      steps: [
        st('Step 1　(a) 平衡。', 'n<sub>o</sub> = 8×10<sup>15</sup>；p<sub>o</sub> = 2.25×10<sup>20</sup>/8×10<sup>15</sup> = 2.81×10<sup>4</sup>', ''),
        st('Step 2　(b) 電子。', 'n = 8×10<sup>15</sup> + 10<sup>14</sup> = 8.1×10<sup>15</sup>', '多數載子只多了約 1%。'),
        st('Step 3　(b) 電洞。', 'p = 2.81×10<sup>4</sup> + 10<sup>14</sup> ≈ 10<sup>14</sup>', '少數載子暴增了十個數量級 —— 多出載子影響最大的是少數載子。')
      ],
      ans: '(a) n<sub>o</sub> = 8×10<sup>15</sup>、p<sub>o</sub> = 2.81×10<sup>4</sup>　(b) n = 8.1×10<sup>15</sup>、p ≈ 10<sup>14</sup>（cm<sup>−3</sup>）' },

    { id: 'tyu1-6', sec: 'tyu', kind: 'pp', tag: 'TYU 1.6', title: '三種材料的 V<sub>bi</sub>',
      q: Q('(a) 求矽 pn 接面在 T = 300 K、N<sub>a</sub> = 10<sup>15</sup>、N<sub>d</sub> = 5×10<sup>16</sup> cm<sup>−3</sup> 的 V<sub>bi</sub>。(b) GaAs 重做。(c) Ge 重做。',
        '(a) Determine V<sub>bi</sub> for a silicon pn junction at T = 300 K for N<sub>a</sub> = 10<sup>15</sup> cm<sup>−3</sup> and N<sub>d</sub> = 5 × 10<sup>16</sup> cm<sup>−3</sup>. (b) Repeat part (a) for a GaAs pn junction. (c) Repeat part (a) for a Ge pn junction.'),
      hint: VBI + '，N<sub>a</sub>N<sub>d</sub> = 5×10<sup>31</sup>。',
      steps: [
        st('Step 1　Si。', '0.026 ln(5×10<sup>31</sup>/2.25×10<sup>20</sup>) = 0.026 × 26.13 = 0.679 V', ''),
        st('Step 2　GaAs。', '0.026 ln(5×10<sup>31</sup>/3.24×10<sup>12</sup>) = 0.026 × 44.18 = 1.15 V', ''),
        st('Step 3　Ge。', '0.026 ln(5×10<sup>31</sup>/5.76×10<sup>26</sup>) = 0.026 × 11.37 = 0.296 V', '同樣摻雜，能隙越大 V<sub>bi</sub> 越大。')
      ],
      ans: '(a) 0.679 V　(b) 1.15 V　(c) 0.296 V' },

    /* ═══════════ 章末 Problems：Section 1.1 ═══════════ */
    { id: 'p1-1', sec: 'p11', kind: 'pp', tag: 'Problem 1.1', title: 'n<sub>i</sub> 對溫度（Si、GaAs）',
      q: Q('(a) 計算矽在 (i) T = 250 K、(ii) T = 350 K 的本質載子濃度。(b) GaAs 重做 (a)。', '(a) Calculate the intrinsic carrier concentration in silicon at (i) T = 250 K and (ii) T = 350 K. (b) Repeat part (a) for gallium arsenide.'),
      hint: NI + '。',
      steps: [
        st('Step 1　Si。', '250 K：1.61×10<sup>8</sup>　350 K：3.97×10<sup>11</sup>', '只差 100 K，差了三千倍。'),
        st('Step 2　GaAs。', '250 K：6.02×10<sup>3</sup>　350 K：1.09×10<sup>8</sup>', '')
      ],
      ans: '(a) Si：1.61×10<sup>8</sup>、3.97×10<sup>11</sup>　(b) GaAs：6.02×10<sup>3</sup>、1.09×10<sup>8</sup>（cm<sup>−3</sup>）' },

    { id: 'p1-3', sec: 'p11', kind: 'pp', tag: 'Problem 1.3', title: 'Si、Ge 在 100／300／500 K',
      q: Q('計算矽與鍺在 (a) T = 100 K、(b) 300 K、(c) 500 K 的本質載子濃度。', 'Calculate the intrinsic carrier concentration in silicon and germanium at (a) T = 100 K, (b) T = 300 K, and (c) T = 500 K.'),
      hint: NI + '。100 K 時指數會非常小。',
      steps: [
        st('Step 1　Si。', '100 K：8.79×10<sup>−10</sup>　300 K：1.50×10<sup>10</sup>　500 K：1.63×10<sup>14</sup>', '100 K 的矽幾乎沒有自由載子（比 1 個/cm<sup>3</sup> 還少很多）。'),
        st('Step 2　Ge。', '100 K：35.9　300 K：2.40×10<sup>13</sup>　500 K：8.62×10<sup>15</sup>', '')
      ],
      ans: 'Si：8.79×10<sup>−10</sup>、1.50×10<sup>10</sup>、1.63×10<sup>14</sup>；Ge：35.9、2.40×10<sup>13</sup>、8.62×10<sup>15</sup>（cm<sup>−3</sup>）' },

    { id: 'p1-4', sec: 'p11', kind: 'pp', tag: 'Problem 1.4', title: '摻 10<sup>15</sup> 施體：Ge 與 Si',
      q: Q('(a) 鍺摻施體 10<sup>15</sup> cm<sup>−3</sup>，求電子與電洞濃度，是 n 型還是 p 型？(b) 矽重做。',
        '(a) Find the concentration of electrons and holes in a sample of germanium that has a concentration of donor atoms equal to 10<sup>15</sup> cm<sup>−3</sup>. Is the semiconductor n-type or p-type? (b) Repeat part (a) for silicon.'),
      hint: '先比 N<sub>d</sub> 和 n<sub>i</sub>：差很多倍才能用 n<sub>o</sub> ≈ N<sub>d</sub>。鍺的 n<sub>i</sub> = 2.4×10<sup>13</sup>，只差 42 倍。',
      steps: [
        st('Step 1　Ge：檢查近似。', 'N<sub>d</sub>/n<sub>i</sub> = 10<sup>15</sup>/2.4×10<sup>13</sup> ≈ 42', '還算 ≫，但完整解比較保險。'),
        st('Step 2　Ge 完整解。', 'n<sub>o</sub> = N<sub>d</sub>/2 + √((N<sub>d</sub>/2)<sup>2</sup> + n<sub>i</sub><sup>2</sup>) = 1.0006×10<sup>15</sup>；p<sub>o</sub> = n<sub>i</sub><sup>2</sup>/n<sub>o</sub> = 5.76×10<sup>11</sup>', '近似誤差只有 0.06%，n<sub>o</sub> ≈ 10<sup>15</sup> 也可以。n 型。'),
        st('Step 3　Si。', 'n<sub>o</sub> = 10<sup>15</sup>；p<sub>o</sub> = 2.25×10<sup>20</sup>/10<sup>15</sup> = 2.25×10<sup>5</sup>', 'n 型。')
      ],
      ans: '(a) Ge：n<sub>o</sub> ≈ 10<sup>15</sup>、p<sub>o</sub> ≈ 5.76×10<sup>11</sup>，n 型　(b) Si：n<sub>o</sub> = 10<sup>15</sup>、p<sub>o</sub> = 2.25×10<sup>5</sup>，n 型（cm<sup>−3</sup>）' },

    { id: 'p1-5', sec: 'p11', kind: 'pp', tag: 'Problem 1.5', title: 'GaAs 摻受體 10<sup>16</sup>',
      q: Q('GaAs 摻受體濃度 10<sup>16</sup> cm<sup>−3</sup>。(a) 求電子、電洞濃度，是 n 型還是 p 型？(b) 鍺重做。',
        'Gallium arsenide is doped with acceptor impurity atoms at a concentration of 10<sup>16</sup> cm<sup>−3</sup>. (a) Find the concentration of electrons and holes. Is the semiconductor n-type or p-type? (b) Repeat part (a) for germanium.'),
      hint: 'p<sub>o</sub> ≈ N<sub>a</sub>，n<sub>o</sub> = n<sub>i</sub><sup>2</sup>/N<sub>a</sub>。',
      steps: [
        st('Step 1　GaAs。', 'p<sub>o</sub> = 10<sup>16</sup>；n<sub>o</sub> = 3.24×10<sup>12</sup>/10<sup>16</sup> = 3.24×10<sup>−4</sup>', 'p 型。'),
        st('Step 2　Ge。', 'p<sub>o</sub> = 10<sup>16</sup>；n<sub>o</sub> = 5.76×10<sup>26</sup>/10<sup>16</sup> = 5.76×10<sup>10</sup>', 'p 型。')
      ],
      ans: '(a) p<sub>o</sub> = 10<sup>16</sup>、n<sub>o</sub> = 3.24×10<sup>−4</sup>，p 型　(b) p<sub>o</sub> = 10<sup>16</sup>、n<sub>o</sub> = 5.76×10<sup>10</sup>，p 型（cm<sup>−3</sup>）' },

    { id: 'p1-6', sec: 'p11', kind: 'pp', tag: 'Problem 1.6', title: '摻砷：300 K 與 350 K',
      q: Q('矽摻 5×10<sup>16</sup> 個砷原子/cm<sup>3</sup>。(a) 是 n 型還是 p 型？(b) 求 T = 300 K 的電子與電洞濃度。(c) T = 350 K 重做 (b)。',
        'Silicon is doped with 5 × 10<sup>16</sup> arsenic atoms/cm<sup>3</sup>. (a) Is the material n- or p-type? (b) Calculate the electron and hole concentrations at T = 300 K. (c) Repeat part (b) for T = 350 K.'),
      hint: '砷是 5 族 → 施體。溫度變了要重算 n<sub>i</sub>。',
      steps: [
        st('Step 1　(a)。', '砷（As）是 5A 族 → 施體 → n 型', ''),
        st('Step 2　(b) 300 K。', 'n<sub>o</sub> = 5×10<sup>16</sup>；p<sub>o</sub> = 2.25×10<sup>20</sup>/5×10<sup>16</sup> = 4.5×10<sup>3</sup>', ''),
        st('Step 3　(c) 350 K。', 'n<sub>i</sub>(350) = 3.97×10<sup>11</sup> ≪ N<sub>d</sub> → n<sub>o</sub> = 5×10<sup>16</sup>；p<sub>o</sub> = (3.97×10<sup>11</sup>)<sup>2</sup>/5×10<sup>16</sup> = 3.15×10<sup>6</sup>', '多數載子不變，少數載子跟著 n<sub>i</sub><sup>2</sup> 漲了快一千倍。')
      ],
      ans: '(a) n 型　(b) n<sub>o</sub> = 5×10<sup>16</sup>、p<sub>o</sub> = 4.5×10<sup>3</sup>　(c) n<sub>o</sub> = 5×10<sup>16</sup>、p<sub>o</sub> ≈ 3.15×10<sup>6</sup>（cm<sup>−3</sup>）' },

    { id: 'p1-7', sec: 'p11', kind: 'pp', tag: 'Problem 1.7', title: '摻受體 5×10<sup>16</sup>：Si 與 GaAs',
      q: Q('(a) 矽摻受體 5×10<sup>16</sup> cm<sup>−3</sup>，求電子與電洞濃度，是 n 型還是 p 型？(b) GaAs 重做。',
        '(a) Calculate the concentration of electrons and holes in silicon that has a concentration of acceptor atoms equal to 5 × 10<sup>16</sup> cm<sup>−3</sup>. Is the semiconductor n-type or p-type? (b) Repeat part (a) for GaAs.'),
      hint: 'p<sub>o</sub> ≈ N<sub>a</sub>。',
      steps: [
        st('Step 1　Si。', 'p<sub>o</sub> = 5×10<sup>16</sup>；n<sub>o</sub> = 2.25×10<sup>20</sup>/5×10<sup>16</sup> = 4.5×10<sup>3</sup>', 'p 型。'),
        st('Step 2　GaAs。', 'p<sub>o</sub> = 5×10<sup>16</sup>；n<sub>o</sub> = 3.24×10<sup>12</sup>/5×10<sup>16</sup> = 6.48×10<sup>−5</sup>', 'p 型。')
      ],
      ans: '(a) p<sub>o</sub> = 5×10<sup>16</sup>、n<sub>o</sub> = 4.5×10<sup>3</sup>，p 型　(b) p<sub>o</sub> = 5×10<sup>16</sup>、n<sub>o</sub> = 6.48×10<sup>−5</sup>，p 型（cm<sup>−3</sup>）' },

    { id: 'p1-8', sec: 'p11', kind: 'pp', tag: 'Problem 1.8', title: '要 p<sub>o</sub> = 2×10<sup>17</sup>：加什麼？加多少？',
      q: Q('矽樣品的電洞濃度要做到 p<sub>o</sub> = 2×10<sup>17</sup> cm<sup>−3</sup>。(a) 應該在本質矽中加硼還是砷？(b) 雜質要加多少濃度？(c) 電子濃度是多少？',
        'A silicon sample is fabricated such that the hole concentration is p<sub>o</sub> = 2 × 10<sup>17</sup> cm<sup>−3</sup>. (a) Should boron or arsenic atoms be added to the intrinsic silicon? (b) What concentration of impurity atoms must be added? (c) What is the concentration of electrons?'),
      hint: '要電洞多 → 加 3 族受體。',
      steps: [
        st('Step 1　(a)。', '電洞要多 → 受體 → 硼（B，3A 族）', '砷是 5 族施體，會給電子。'),
        st('Step 2　(b)。', 'N<sub>a</sub> = p<sub>o</sub> = 2×10<sup>17</sup> cm<sup>−3</sup>', ''),
        st('Step 3　(c)。', 'n<sub>o</sub> = 2.25×10<sup>20</sup>/2×10<sup>17</sup> = 1.125×10<sup>3</sup> cm<sup>−3</sup>', '')
      ],
      ans: '(a) 硼　(b) N<sub>a</sub> = 2×10<sup>17</sup> cm<sup>−3</sup>　(c) n<sub>o</sub> = 1.125×10<sup>3</sup> cm<sup>−3</sup>' },

    { id: 'p1-10', sec: 'p11', kind: 'pp', tag: 'Problem 1.10', title: '設計 n<sub>o</sub> 與最高溫度',
      q: Q('(a) 矽要設計成多數載子電子濃度 n<sub>o</sub> = 7×10<sup>15</sup> cm<sup>−3</sup>。該加施體還是受體？要加多少？(b) 這塊矽的少數載子電洞濃度不能超過 p<sub>o</sub> = 10<sup>6</sup> cm<sup>−3</sup>，求最高可容許溫度。',
        '(a) A silicon semiconductor material is to be designed such that the majority carrier electron concentration is n<sub>o</sub> = 7 × 10<sup>15</sup> cm<sup>−3</sup>. Should donor or acceptor impurity atoms be added to intrinsic silicon to achieve this electron concentration? What concentration of dopant impurity atoms is required? (b) In this silicon material, the minority carrier hole concentration is to be no larger than p<sub>o</sub> = 10<sup>6</sup> cm<sup>−3</sup>. Determine the maximum allowable temperature.'),
      hint: 'p<sub>o</sub> = n<sub>i</sub><sup>2</sup>/N<sub>d</sub> ≤ 10<sup>6</sup> → n<sub>i</sub> ≤ √(7×10<sup>21</sup>)，再像 Problem 1.2 反推溫度。',
      steps: [
        st('Step 1　(a)。', '要電子多 → 施體，N<sub>d</sub> = 7×10<sup>15</sup> cm<sup>−3</sup>', ''),
        st('Step 2　(b) 換成 n<sub>i</sub> 的上限。', 'n<sub>i</sub><sup>2</sup> ≤ 7×10<sup>15</sup> × 10<sup>6</sup> = 7×10<sup>21</sup> → n<sub>i</sub> ≤ 8.37×10<sup>10</sup>', '溫度升高時多數載子還是 ≈ N<sub>d</sub>，但少數載子跟著 n<sub>i</sub><sup>2</sup> 長。'),
        st('Step 3　反推溫度（試誤）。', 'n<sub>i</sub>(320 K) = 6.26×10<sup>10</sup>，n<sub>i</sub>(325 K) = 8.72×10<sup>10</sup> → T ≈ 324 K', '')
      ],
      ans: '(a) 施體，N<sub>d</sub> = 7×10<sup>15</sup> cm<sup>−3</sup>　(b) T<sub>max</sub> ≈ 324 K' },

    { id: 'p1-11', sec: 'p11', kind: 'pp', tag: 'Problem 1.11', title: '漂移電流、反推電場',
      q: Q('(a) p 型矽加電場 E = 10 V/cm，導電度 σ = 1.5 (Ω·cm)<sup>−1</sup>，截面積 A = 10<sup>−5</sup> cm<sup>2</sup>，求漂移電流。(b) 截面積 A = 2×10<sup>−4</sup> cm<sup>2</sup>、電阻率 ρ = 0.4 Ω·cm，若漂移電流 I = 1.2 mA，要加多大的電場？',
        '(a) The applied electric field in p-type silicon is E = 10 V/cm. The semiconductor conductivity is σ = 1.5 (Ω–cm)<sup>−1</sup> and the cross-sectional area is A = 10<sup>−5</sup> cm<sup>2</sup>. Determine the drift current. (b) The cross-sectional area of a semiconductor is A = 2 × 10<sup>−4</sup> cm<sup>2</sup> and the resistivity is ρ = 0.4 (Ω–cm). If the drift current is I = 1.2 mA, what applied electric field must be applied?'),
      hint: 'J = σE、I = JA；ρ = 1/σ → E = Jρ。',
      steps: [
        st('Step 1　(a)。', 'J = 1.5 × 10 = 15 A/cm<sup>2</sup>；I = 15 × 10<sup>−5</sup> = 1.5×10<sup>−4</sup> A = 0.15 mA', ''),
        st('Step 2　(b)。', 'J = I/A = 1.2×10<sup>−3</sup>/2×10<sup>−4</sup> = 6 A/cm<sup>2</sup>；E = Jρ = 6 × 0.4 = 2.4 V/cm', '')
      ],
      ans: '(a) I = 0.15 mA　(b) E = 2.4 V/cm' },

    { id: 'p1-12', sec: 'p11', kind: 'pp', tag: 'Problem 1.12', title: '由漂移電流密度反推摻雜',
      q: Q('n 型矽加 18 V/cm 電場，產生 120 A/cm<sup>2</sup> 的漂移電流密度。μ<sub>n</sub> = 1250、μ<sub>p</sub> = 450 cm<sup>2</sup>/V·s，求需要的摻雜濃度。',
        'A drift current density of 120 A/cm<sup>2</sup> is established in n-type silicon with an applied electric field of 18 V/cm. If the electron and hole mobilities are μ<sub>n</sub> = 1250 cm<sup>2</sup>/V–s and μ<sub>p</sub> = 450 cm<sup>2</sup>/V–s, respectively, determine the required doping concentration.'),
      hint: 'σ = J/E，再 N<sub>d</sub> = σ/(eμ<sub>n</sub>)。',
      steps: [
        st('Step 1　導電度。', 'σ = 120/18 = 6.67 (Ω·cm)<sup>−1</sup>', ''),
        st('Step 2　摻雜。', 'N<sub>d</sub> = 6.67/(1.6×10<sup>−19</sup> × 1250) = 3.33×10<sup>16</sup> cm<sup>−3</sup>', 'n 型只用 μ<sub>n</sub>。')
      ],
      ans: 'N<sub>d</sub> ≈ 3.33 × 10<sup>16</sup> cm<sup>−3</sup>' },

    { id: 'p1-13', sec: 'p11', kind: 'pp', tag: 'Problem 1.13', title: '由電阻率反推摻雜與電場',
      q: Q('n 型矽電阻率 ρ = 0.65 Ω·cm。(a) 若 μ<sub>n</sub> = 1250 cm<sup>2</sup>/V·s，施體濃度是多少？(b) 要產生 J = 160 A/cm<sup>2</sup> 的漂移電流密度，需要多大的電場？',
        'An n-type silicon material has a resistivity of ρ = 0.65 Ω–cm. (a) If the electron mobility is μ<sub>n</sub> = 1250 cm<sup>2</sup>/V–s, what is the concentration of donor atoms? (b) Determine the required electric field to establish a drift current density of J = 160 A/cm<sup>2</sup>.'),
      hint: 'N<sub>d</sub> = 1/(ρeμ<sub>n</sub>)；E = Jρ。',
      steps: [
        st('Step 1　(a)。', 'N<sub>d</sub> = 1/(0.65 × 1.6×10<sup>−19</sup> × 1250) = 7.69×10<sup>15</sup> cm<sup>−3</sup>', ''),
        st('Step 2　(b)。', 'E = Jρ = 160 × 0.65 = 104 V/cm', '')
      ],
      ans: '(a) N<sub>d</sub> = 7.69 × 10<sup>15</sup> cm<sup>−3</sup>　(b) E = 104 V/cm' },

    { id: 'p1-15', sec: 'p11', kind: 'pp', tag: 'Problem 1.15', title: 'GaAs 導電度範圍',
      q: Q('GaAs 的 μ<sub>n</sub> = 8500、μ<sub>p</sub> = 400 cm<sup>2</sup>/V·s。(a) 施體濃度在 10<sup>15</sup> ≤ N<sub>d</sub> ≤ 10<sup>19</sup> cm<sup>−3</sup> 之間時，導電度的範圍是多少？(b) 用 (a) 的結果，加 E = 0.10 V/cm，漂移電流密度的範圍是多少？',
        'In GaAs, the mobilities are μ<sub>n</sub> = 8500 cm<sup>2</sup>/V–s and μ<sub>p</sub> = 400 cm<sup>2</sup>/V–s. (a) Determine the range in conductivity for a range in donor concentration of 10<sup>15</sup> ≤ N<sub>d</sub> ≤ 10<sup>19</sup> cm<sup>−3</sup>. (b) Using the results of part (a), determine the range in drift current density if the applied electric field is E = 0.10 V/cm.'),
      hint: 'σ ≈ eμ<sub>n</sub>N<sub>d</sub>（題目假設遷移率固定）。',
      steps: [
        st('Step 1　(a) 兩端。', 'N<sub>d</sub> = 10<sup>15</sup>：σ = 1.6×10<sup>−19</sup> × 8500 × 10<sup>15</sup> = 1.36；N<sub>d</sub> = 10<sup>19</sup>：σ = 1.36×10<sup>4</sup> (Ω·cm)<sup>−1</sup>', 'σ 跟 N<sub>d</sub> 成正比。'),
        st('Step 2　(b)。', 'J = σE：0.136 ～ 1360 A/cm<sup>2</sup>', '')
      ],
      ans: '(a) 1.36 ≤ σ ≤ 1.36×10<sup>4</sup> (Ω·cm)<sup>−1</sup>　(b) 0.136 ≤ J ≤ 1360 A/cm<sup>2</sup>',
      note: '實際上摻雜很高時遷移率會下降，這裡照題目當成固定值。' },

    { id: 'p1-18', sec: 'p11', kind: 'pp', tag: 'Problem 1.18', title: 'GaAs + 多出載子',
      q: Q('GaAs 摻雜 N<sub>a</sub> = 10<sup>17</sup> cm<sup>−3</sup>。(a) 求 n<sub>o</sub>、p<sub>o</sub>。(b) 產生多出的電子電洞 δn = δp = 10<sup>15</sup> cm<sup>−3</sup>，求電子與電洞的總濃度。',
        'GaAs is doped to N<sub>a</sub> = 10<sup>17</sup> cm<sup>−3</sup>. (a) Calculate n<sub>o</sub> and p<sub>o</sub>. (b) Excess electrons and holes are generated such that δn = δp = 10<sup>15</sup> cm<sup>−3</sup>. Determine the total concentration of electrons and holes.'),
      hint: 'n = n<sub>o</sub> + δn、p = p<sub>o</sub> + δp。',
      steps: [
        st('Step 1　(a)。', 'p<sub>o</sub> = 10<sup>17</sup>；n<sub>o</sub> = 3.24×10<sup>12</sup>/10<sup>17</sup> = 3.24×10<sup>−5</sup>', ''),
        st('Step 2　(b)。', 'n = 3.24×10<sup>−5</sup> + 10<sup>15</sup> ≈ 10<sup>15</sup>；p = 10<sup>17</sup> + 10<sup>15</sup> = 1.01×10<sup>17</sup>', '少數載子（電子）完全由多出的那份決定。')
      ],
      ans: '(a) p<sub>o</sub> = 10<sup>17</sup>、n<sub>o</sub> = 3.24×10<sup>−5</sup>　(b) n ≈ 10<sup>15</sup>、p = 1.01×10<sup>17</sup>（cm<sup>−3</sup>）' },

    /* ═══════════ 章末 Problems：Section 1.2（到逆向偏壓為止） ═══════════ */
    { id: 'p1-19', sec: 'p12', kind: 'pp', tag: 'Problem 1.19', title: '三組摻雜的 V<sub>bi</sub>（Si、GaAs）',
      q: Q('(a) 求矽 pn 接面的 V<sub>bi</sub>：(i) N<sub>d</sub> = N<sub>a</sub> = 5×10<sup>15</sup>；(ii) N<sub>d</sub> = 5×10<sup>17</sup>、N<sub>a</sub> = 10<sup>15</sup>；(iii) N<sub>a</sub> = N<sub>d</sub> = 10<sup>18</sup> cm<sup>−3</sup>。(b) GaAs 重做 (a)。',
        '(a) Determine the built-in potential barrier V<sub>bi</sub> in a silicon pn junction for (i) N<sub>d</sub> = N<sub>a</sub> = 5 × 10<sup>15</sup> cm<sup>−3</sup>; (ii) N<sub>d</sub> = 5 × 10<sup>17</sup> cm<sup>−3</sup> and N<sub>a</sub> = 10<sup>15</sup> cm<sup>−3</sup>; (iii) N<sub>a</sub> = N<sub>d</sub> = 10<sup>18</sup> cm<sup>−3</sup>. (b) Repeat part (a) for GaAs.'),
      hint: VBI + '。',
      steps: [
        st('Step 1　Si（n<sub>i</sub><sup>2</sup> = 2.25×10<sup>20</sup>）。', '(i) 0.661 V　(ii) 0.739 V　(iii) 0.937 V', '摻雜多四個數量級，V<sub>bi</sub> 也只多不到 0.3 V —— ln 很遲鈍。'),
        st('Step 2　GaAs（n<sub>i</sub><sup>2</sup> = 3.24×10<sup>12</sup>）。', '(i) 1.13 V　(ii) 1.21 V　(iii) 1.41 V', '')
      ],
      ans: '(a) 0.661、0.739、0.937 V　(b) 1.13、1.21、1.41 V' },

    { id: 'p1-21', sec: 'p12', kind: 'pp', tag: 'Problem 1.21', title: 'V<sub>bi</sub> 對 N<sub>a</sub>（畫圖題）',
      q: Q('矽 pn 接面 n 區施體濃度 N<sub>d</sub> = 10<sup>16</sup> cm<sup>−3</sup>。畫出 V<sub>bi</sub> 對 N<sub>a</sub> 的關係，範圍 10<sup>15</sup> ≤ N<sub>a</sub> ≤ 10<sup>18</sup> cm<sup>−3</sup>。（先算四個十的次方點，就能畫出來。）',
        'The donor concentration in the n-region of a silicon pn junction is N<sub>d</sub> = 10<sup>16</sup> cm<sup>−3</sup>. Plot V<sub>bi</sub> versus N<sub>a</sub> over the range 10<sup>15</sup> ≤ N<sub>a</sub> ≤ 10<sup>18</sup> cm<sup>−3</sup> where N<sub>a</sub> is the acceptor concentration in the p-region.'),
      hint: 'N<sub>a</sub> 每乘 10，V<sub>bi</sub> 就加 V<sub>T</sub> ln10 = 0.0599 V。',
      steps: [
        st('Step 1　四個點。', 'N<sub>a</sub> = 10<sup>15</sup>：0.638 V　10<sup>16</sup>：0.697 V　10<sup>17</sup>：0.757 V　10<sup>18</sup>：0.817 V', ''),
        st('Step 2　形狀。', '橫軸取 log N<sub>a</sub> → 是一條直線，斜率 0.0599 V/decade', '因為 V<sub>bi</sub> = V<sub>T</sub>[ln N<sub>a</sub> + ln(N<sub>d</sub>/n<sub>i</sub><sup>2</sup>)]，對 ln N<sub>a</sub> 是線性的。')
      ],
      ans: '0.638、0.697、0.757、0.817 V；半對數圖上是斜率約 60 mV/decade 的直線' },

    { id: 'p1-23', sec: 'p12', kind: 'pp', tag: 'Problem 1.23', title: '接面電容對逆偏',
      q: Q('矽 pn 接面零偏壓接面電容 C<sub>jo</sub> = 0.4 pF，摻雜 N<sub>a</sub> = 1.5×10<sup>16</sup>、N<sub>d</sub> = 4×10<sup>15</sup> cm<sup>−3</sup>。求 (a) V<sub>R</sub> = 1 V、(b) 3 V、(c) 5 V 的接面電容。',
        'The zero-biased junction capacitance of a silicon pn junction is C<sub>jo</sub> = 0.4 pF. The doping concentrations are N<sub>a</sub> = 1.5 × 10<sup>16</sup> cm<sup>−3</sup> and N<sub>d</sub> = 4 × 10<sup>15</sup> cm<sup>−3</sup>. Determine the junction capacitance at (a) V<sub>R</sub> = 1 V, (b) V<sub>R</sub> = 3 V, and (c) V<sub>R</sub> = 5 V.'),
      hint: '先 V<sub>bi</sub>，再 ' + CJ + '。',
      steps: [
        st('Step 1　V<sub>bi</sub>。', '0.026 ln(6×10<sup>31</sup>/2.25×10<sup>20</sup>) = 0.684 V', ''),
        st('Step 2　代入。', '(a) 0.4/√(1 + 1/0.684) = 0.255 pF　(b) 0.172 pF　(c) 0.139 pF', '電壓變 5 倍，電容只降到一半左右（−1/2 次方）。')
      ],
      ans: '(a) 0.255 pF　(b) 0.172 pF　(c) 0.139 pF' },

    /* ═══════════ Review Questions（觀念題） ═══════════ */
    { id: 'rq1', sec: 'rq', kind: 'pp', tag: 'Review Q1', title: '本質半導體',
      q: Q('描述本質半導體材料。本質載子濃度是什麼意思？', 'Describe an intrinsic semiconductor material. What is meant by the intrinsic carrier concentration?'),
      hint: '沒有摻雜；n = p。',
      steps: [st('重點', '本質 = 純的單晶、沒有摻雜。電子和電洞只靠熱產生（打斷共價鍵）、成對出現 → n = p = n<sub>i</sub>', 'n<sub>i</sub> = BT<sup>3/2</sup>e<sup>−E<sub>g</sub>/2kT</sup>，只跟材料（B、E<sub>g</sub>）和溫度有關。')],
      ans: '純單晶、無雜質的半導體；熱打斷共價鍵產生電子－電洞對，所以 n = p。n<sub>i</sub> 就是這時的電子（也等於電洞）濃度，n<sub>i</sub> = BT<sup>3/2</sup>e<sup>−E<sub>g</sub>/2kT</sup>，隨溫度急遽增加。' },
    { id: 'rq2', sec: 'rq', kind: 'pp', tag: 'Review Q2', title: '電子與電洞',
      q: Q('描述電子與電洞作為半導體中電荷載子的概念。', 'Describe the concept of an electron and a hole as charge carriers in the semiconductor material.'),
      hint: '電洞是空位，會被旁邊的價電子填補。',
      steps: [st('重點', '電子：跳到導帶、能自由移動的負電荷。電洞：共價鍵留下的空位；鄰近的價電子跳進來填，空位就換位置 → 看起來像正電荷在移動', '電洞帶 +e，跟電子電荷大小一樣。')],
      ans: '電子是導帶中能自由移動的負電荷；電洞是價帶（共價鍵）中的空位，鄰近價電子遞補使空位移動，等效為一個帶 +e、能移動的載子。兩者都能產生電流。' },
    { id: 'rq3', sec: 'rq', kind: 'pp', tag: 'Review Q3', title: '非本質半導體',
      q: Q('描述非本質半導體材料。用施體濃度表示的電子濃度是多少？用受體濃度表示的電洞濃度是多少？', 'Describe an extrinsic semiconductor material. What is the electron concentration in terms of the donor impurity concentration? What is the hole concentration in terms of the acceptor impurity concentration?'),
      hint: '摻雜；N<sub>d</sub> ≫ n<sub>i</sub> 時的近似。',
      steps: [st('重點', 'n 型：n<sub>o</sub> ≈ N<sub>d</sub>、p<sub>o</sub> = n<sub>i</sub><sup>2</sup>/N<sub>d</sub>；p 型：p<sub>o</sub> ≈ N<sub>a</sub>、n<sub>o</sub> = n<sub>i</sub><sup>2</sup>/N<sub>a</sub>', '條件是摻雜濃度遠大於 n<sub>i</sub>。')],
      ans: '摻入受控雜質的半導體。摻 5 族施體 → n 型，n<sub>o</sub> ≈ N<sub>d</sub>；摻 3 族受體 → p 型，p<sub>o</sub> ≈ N<sub>a</sub>（摻雜 ≫ n<sub>i</sub> 時）。少數載子由 n<sub>o</sub>p<sub>o</sub> = n<sub>i</sub><sup>2</sup> 求。' },
    { id: 'rq4', sec: 'rq', kind: 'pp', tag: 'Review Q4', title: '漂移與擴散',
      q: Q('描述半導體中漂移電流與擴散電流的概念。', 'Describe the concepts of drift current and diffusion current in a semiconductor material.'),
      hint: '一個靠電場、一個靠濃度差。',
      steps: [st('重點', '漂移：J = e(μ<sub>n</sub>n + μ<sub>p</sub>p)E　擴散：J<sub>n</sub> = eD<sub>n</sub> dn/dx、J<sub>p</sub> = −eD<sub>p</sub> dp/dx', 'D/μ = V<sub>T</sub>（愛因斯坦關係）。')],
      ans: '漂移電流：電場推動載子（電洞順著 E、電子逆著 E），J = σE = e(μ<sub>n</sub>n + μ<sub>p</sub>p)E。擴散電流：載子從濃度高往濃度低擴散，跟濃度梯度成正比，J<sub>n</sub> = eD<sub>n</sub> dn/dx、J<sub>p</sub> = −eD<sub>p</sub> dp/dx。' },
    { id: 'rq5', sec: 'rq', kind: 'pp', tag: 'Review Q5', title: 'pn 接面與內建電位障',
      q: Q('pn 接面是怎麼形成的？內建電位障是什麼意思？它是怎麼形成的？', 'How is a pn junction formed? What is meant by a built-in potential barrier, and how is it formed?'),
      hint: '擴散 → 留下離子 → 電場 → 電位差。',
      steps: [st('重點', '同一塊晶體一邊摻 p、一邊摻 n。多數載子往對面擴散，接面附近留下不能動的離子（n 側 +、p 側 −）→ 空乏區 → 電場 → 電位差 ' + VBI, '這個電位差擋住多數載子繼續擴散，達到熱平衡。')],
      ans: '在同一塊單晶中一側摻受體、一側摻施體即形成 pn 接面。接面兩側濃度差使電子、電洞擴散到對面，留下帶電的不動離子形成空乏區，產生由 n 指向 p 的電場與電位差 V<sub>bi</sub> = V<sub>T</sub> ln(N<sub>a</sub>N<sub>d</sub>/n<sub>i</sub><sup>2</sup>)，它阻止多數載子進一步擴散，維持平衡（用電表量不到）。' },
    { id: 'rq6', sec: 'rq', kind: 'pp', tag: 'Review Q6', title: '逆偏的接面電容',
      q: Q('逆向偏壓的 pn 接面二極體，接面電容是怎麼產生的？', 'How is a junction capacitance created in a reverse-biased pn junction diode?'),
      hint: '電壓變 → 空乏區兩側電荷變。',
      steps: [st('重點', '逆偏加大 → 空乏區變寬 → 兩側不動的正負電荷增加。電荷隨電壓變化 = 電容（像平行板電容，板距 = 空乏區寬度）', CJ + '，逆偏越大電容越小。')],
      ans: '逆偏使空乏區變寬，兩側不能動的正、負離子電荷隨之增加；電荷 ΔQ 隨電壓 ΔV 改變就是電容（類似板距等於空乏區寬度的平行板電容）。C<sub>j</sub> = C<sub>jo</sub>(1 + V<sub>R</sub>/V<sub>bi</sub>)<sup>−1/2</sup>，V<sub>R</sub> 越大 C<sub>j</sub> 越小。' },
    { id: 'rq7', sec: 'rq', kind: 'pp', tag: 'Review Q7', title: '理想二極體 I–V（只考公式）',
      q: Q('寫出理想二極體的電流－電壓關係，說明 I<sub>S</sub> 與 V<sub>T</sub> 的意義。', 'Write the ideal diode current–voltage relationship. Describe the meaning of I<sub>S</sub> and V<sub>T</sub>.'),
      hint: '老師第 7 頁介紹過的那條。',
      steps: [st('重點', 'i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/nV<sub>T</sub></sup> − 1)', 'I<sub>S</sub>：逆向飽和電流（很小，∝ 面積、∝ n<sub>i</sub><sup>2</sup>）；V<sub>T</sub> = kT/e ≈ 0.026 V 熱電壓；n 是放射係數（1～2）。')],
      ans: 'i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/nV<sub>T</sub></sup> − 1)。I<sub>S</sub> 是逆向飽和電流（逆偏時的電流大小，很小、與接面面積和 n<sub>i</sub><sup>2</sup> 成正比、對溫度很敏感）；V<sub>T</sub> = kT/e 是熱電壓，300 K 約 0.026 V。' },

    /* ═══════════ 延伸：I–V 公式代入（Example 1.7 還沒教） ═══════════ */
    { id: 'ex1-7', sec: 'ext', kind: 'pp', tag: 'Exercise 1.7', title: '延伸 · 由 I<sub>D</sub> 求順偏電壓',
      q: Q('(a) 矽 pn 接面 T = 300 K，逆向飽和電流 I<sub>S</sub> = 2×10<sup>−14</sup> A。求產生 (i) I<sub>D</sub> = 50 μA、(ii) I<sub>D</sub> = 1 mA 所需的順向偏壓。(b) I<sub>S</sub> = 2×10<sup>−12</sup> A 重做。',
        '(a) A silicon pn junction at T = 300 K has a reverse-saturation current of I<sub>S</sub> = 2 × 10<sup>−14</sup> A. Determine the required forward-bias voltage to produce a current of (i) I<sub>D</sub> = 50 μA and (ii) I<sub>D</sub> = 1 mA. (b) Repeat part (a) for I<sub>S</sub> = 2 × 10<sup>−12</sup> A.'),
      hint: 'v<sub>D</sub> &gt; 0.1 V 時 −1 可以丟掉：v<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub>)。',
      steps: [
        st('Step 1　(a)。', '(i) 0.026 ln(50×10<sup>−6</sup>/2×10<sup>−14</sup>) = 0.563 V　(ii) 0.026 ln(10<sup>−3</sup>/2×10<sup>−14</sup>) = 0.641 V', '電流變 20 倍，電壓只多 78 mV。'),
        st('Step 2　(b)。', '(i) 0.443 V　(ii) 0.521 V', 'I<sub>S</sub> 大 100 倍 → 同樣電流電壓少 V<sub>T</sub> ln100 = 0.12 V。')
      ],
      ans: '(a) 0.563 V、0.641 V　(b) 0.443 V、0.521 V',
      note: '老師第 7 頁只介紹了 I–V 公式，Example 1.7 還沒教，這題當延伸練習。' },
    { id: 'tyu1-7', sec: 'ext', kind: 'pp', tag: 'TYU 1.7', title: '延伸 · 順偏、逆偏電流',
      q: Q('矽 pn 接面二極體 T = 300 K，I<sub>S</sub> = 10<sup>−16</sup> A。(a) 求順偏電流：(i) V<sub>D</sub> = 0.55 V、(ii) 0.65 V、(iii) 0.75 V。(b) 求逆偏電流：(i) V<sub>D</sub> = −0.55 V、(ii) −2.5 V。',
        'A silicon pn junction diode at T = 300 K has a reverse-saturation current of I<sub>S</sub> = 10<sup>−16</sup> A. (a) Determine the forward-bias diode current for (i) V<sub>D</sub> = 0.55 V, (ii) V<sub>D</sub> = 0.65 V, and (iii) V<sub>D</sub> = 0.75 V. (b) Find the reverse-bias diode current for (i) V<sub>D</sub> = −0.55 V and (ii) V<sub>D</sub> = −2.5 V.'),
      hint: 'i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1)。逆偏時指數項幾乎是 0。',
      steps: [
        st('Step 1　(a)。', '(i) 10<sup>−16</sup>e<sup>21.15</sup> = 0.154 μA　(ii) 7.20 μA　(iii) 0.337 mA', '每多 0.1 V，電流大約變 47 倍。'),
        st('Step 2　(b)。', 'e<sup>−21</sup> ≈ 0 → i<sub>D</sub> ≈ −I<sub>S</sub> = −10<sup>−16</sup> A（兩個都是）', '逆偏電流飽和在 −I<sub>S</sub>，跟逆偏多大無關。')
      ],
      ans: '(a) 0.154 μA、7.20 μA、0.337 mA　(b) 都是 −10<sup>−16</sup> A',
      note: '同上，I–V 代入計算當延伸練習。' }
  ];

  window.__CH1PR = { book: 'Neamen, Microelectronics 4e, Chapter 1', items };
})();
