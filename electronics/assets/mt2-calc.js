/* ============================================================
   電子學期中考 2 衝刺 —— 計算題（老師 11/4 公布的六類計算題）
   考卷全英文 → 題目英文在前，中文翻譯收在「中文翻譯」裡。
   出處：HW2、HW3、10/21、10/28、11/3 板書、課本 Example；數值都用程式驗算（docs/MIDTERM2.md）
   window.__MT2EX（衝刺頁）、window.__HW3EX（hw3.html，只收 HW3 的題目）
   ============================================================ */
(function () {
  'use strict';
  const st = (t, eq, why) => ({ t, eq, why });
  const zh = s => '<details class="hw-zh dv-ui"><summary>中文翻譯</summary><div>' + s + '</div></details>';
  const items = [
    /* ═══ 1 順偏求 Q：作圖法／方程式 vs Model 代入法 ═══ */
    { id: 'mt2-k1a', sec: 'k1', kind: 'pp', no: '', tag: 'HW2 第 2 題', title: 'Load line ∩ simplified curve vs piecewise-linear model',
      q: 'V<sub>PS</sub> = 5 V, R = 2 kΩ. The simplified diode characteristic for V<sub>D</sub> &gt; V<sub>γ</sub> is a straight line with slope 1/10 (so r<sub>f</sub> = 10 Ω) and V<sub>γ</sub> = 0.6 V. (1) Write the simplified characteristic equation. (2) Write the load line by KVL. (4) Solve both equations simultaneously for V<sub>DQ</sub>, I<sub>DQ</sub>. (5) Use the piecewise-linear model to find V<sub>DQ</sub>, I<sub>DQ</sub>. (6) Are (4) and (5) the same?',
      en: zh('V<sub>PS</sub> = 5 V、R = 2 kΩ；化簡特性 V<sub>D</sub> &gt; V<sub>γ</sub> 後為斜率 1/10 的直線（r<sub>f</sub> = 10 Ω）、V<sub>γ</sub> = 0.6 V。(1) 寫化簡特性方程式 (2) KVL 寫 load line (4) 聯立求 V<sub>DQ</sub>、I<sub>DQ</sub> (5) 用片段線性模型求 (6) 兩者相同嗎？'),
      hint: '化簡特性：V<sub>D</sub> = I<sub>D</sub> r<sub>f</sub> + V<sub>γ</sub>；load line：V<sub>PS</sub> = I<sub>D</sub>R + V<sub>D</sub>。',
      steps: [
        st('(1) Simplified curve (slope = 1/r<sub>f</sub>).', 'I<sub>D</sub> = (V<sub>D</sub> − V<sub>γ</sub>)/r<sub>f</sub> ⇒ V<sub>D</sub> = I<sub>D</sub> r<sub>f</sub> + V<sub>γ</sub> = 10 I<sub>D</sub> + 0.6', '板書：slope = Δy/Δx = I<sub>D</sub>/(V<sub>D</sub> − V<sub>γ</sub>) = 1/r<sub>f</sub>。'),
        st('(2) Load line (KVL).', '5 − I<sub>D</sub>(2000) − V<sub>D</sub> = 0', '兩個端點：(5 V, 0) 與 (0, 2.5 mA)。'),
        st('(4) Solve simultaneously.', '5 − 2000 I<sub>D</sub> − (10 I<sub>D</sub> + 0.6) = 0 ⇒ I<sub>DQ</sub> = 4.4/2010 = 2.19 mA；V<sub>DQ</sub> = 0.6 + 10(2.19 m) = 0.622 V', '把 (1) 代進 (2)。'),
        st('(5) Piecewise-linear model: diode = V<sub>γ</sub> battery + r<sub>f</sub>.', 'V<sub>PS</sub> − I<sub>D</sub>(R + r<sub>f</sub>) − V<sub>γ</sub> = 0 ⇒ I<sub>DQ</sub> = 4.4/2010 = 2.19 mA，V<sub>DQ</sub> = 0.622 V', '板書：By KVL，V<sub>PS</sub> − I<sub>D</sub>(R + r<sub>f</sub>) − V<sub>γ</sub> = 0。'),
        st('(6) Compare.', 'Same answer.', '模型就是那條化簡直線的電路版本，兩種方法解的是同一組方程式。')
      ],
      ans: 'I<sub>DQ</sub> = 2.19 mA、V<sub>DQ</sub> = 0.622 V；兩法相同', note: 'HW2 第 2 題＝老師說的第 1 類考題。Q 點功率 P<sub>D</sub> = V<sub>DQ</sub>I<sub>DQ</sub> = 1.36 mW（10/21 板書有算）。' },
    { id: 'mt2-k1b', sec: 'k1', kind: 'pp', no: '', tag: 'HW2 第 3 題', title: 'Same circuit with r<sub>f</sub> = 0 (constant-voltage-drop)',
      q: 'Repeat with the simplified characteristic V<sub>D</sub> ≈ V<sub>γ</sub> = 0.6 V after turn-on (slope → ∞, r<sub>f</sub> = 0). Find V<sub>DQ</sub> and I<sub>DQ</sub> by both methods.',
      en: zh('同一個電路，但導通後斜率無限大（r<sub>f</sub> = 0、V<sub>D</sub> = V<sub>γ</sub> = 0.6 V），用兩種方法求 V<sub>DQ</sub>、I<sub>DQ</sub>。'),
      hint: '垂直線 V<sub>D</sub> = 0.6 V 和 load line 的交點。',
      steps: [
        st('Characteristic: vertical line.', 'V<sub>D</sub> = 0.6 V', ''),
        st('Load line at V<sub>D</sub> = 0.6.', 'I<sub>DQ</sub> = (5 − 0.6)/2 kΩ = 2.2 mA', ''),
        st('Model method.', 'V<sub>PS</sub> − I<sub>D</sub>R − V<sub>γ</sub> = 0 ⇒ 2.2 mA', '一樣。')
      ],
      ans: 'V<sub>DQ</sub> = 0.6 V、I<sub>DQ</sub> = 2.2 mA', note: '跟 r<sub>f</sub> = 10 Ω 比：電流只差 0.01 mA，因為 r<sub>f</sub> ≪ R（板書 Note：r<sub>f</sub> ≪ R 可忽略）。' },

    /* ═══ 2 AC + DC ═══ */
    { id: 'mt2-k2a', sec: 'k2', kind: 'pp', no: '', tag: '10/21 板書', title: 'AC + DC analysis: V<sub>PS</sub> = 5 V, v<sub>i</sub> = 0.1 sin ωt',
      q: 'A diode is in series with v<sub>i</sub> = 0.1 sin ωt (V), V<sub>PS</sub> = 5 V and R = 5 kΩ (V<sub>γ</sub> = 0.6 V, V<sub>T</sub> = 26 mV). (1) Find V<sub>DQ</sub>, I<sub>DQ</sub> (DC analysis). (2) Find v<sub>d</sub>, i<sub>d</sub> (AC analysis). (3) Find v<sub>O</sub> = V<sub>O</sub> + v<sub>o</sub>. (4) Plot the waveforms.',
      en: zh('v<sub>i</sub> = 0.1 sin ωt、V<sub>PS</sub> = 5 V、R = 5 kΩ 串聯一顆二極體（V<sub>γ</sub> = 0.6 V）。(1) 直流分析求 V<sub>DQ</sub>、I<sub>DQ</sub> (2) 交流分析求 v<sub>d</sub>、i<sub>d</sub> (3) 求 v<sub>O</sub> (4) 畫波形。'),
      hint: '先關掉交流源（短路）做 DC；再關掉直流源（短路）、二極體換 r<sub>d</sub> 做 AC。',
      steps: [
        st('(1) DC equivalent: short v<sub>i</sub>, diode = V<sub>γ</sub>.', 'V<sub>DQ</sub> = 0.6 V；5 − 0.6 − I<sub>DQ</sub>(5k) = 0 ⇒ I<sub>DQ</sub> = 0.88 mA', '獨立交流電壓源短路（HW3 選擇第 1 題）。'),
        st('(2) Small-signal resistance.', 'r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub> = 26 mV/0.88 mA = 29.5 Ω', '工作點決定 r<sub>d</sub>。'),
        st('(2) AC equivalent: short V<sub>PS</sub>, diode = r<sub>d</sub>.', 'i<sub>d</sub> = v<sub>i</sub>/(r<sub>d</sub> + R) = 0.1 sin ωt/5.0295 k = 19.9 sin ωt (μA)', ''),
        st('(2) Diode ac voltage.', 'v<sub>d</sub> = i<sub>d</sub> r<sub>d</sub> = 19.9 μA × 29.5 Ω = 0.587 sin ωt (mV)', ''),
        st('(3) Total output.', 'V<sub>O</sub> = 0.88 mA × 5k = 4.4 V；v<sub>o</sub> = 19.9 μA × 5k = 0.0995 sin ωt V ⇒ v<sub>O</sub> = 4.4 + 0.0995 sin ωt (V)', '重疊：直流＋交流。'),
        st('(4) Waveforms.', 'v<sub>D</sub> = 0.6 V + 0.587 sin ωt mV；i<sub>D</sub> = 0.88 mA + 19.9 sin ωt μA；v<sub>O</sub> = 4.4 V + 0.0995 sin ωt V', '每條都是「一條直流水平線＋上面一點小正弦」。')
      ],
      ans: 'I<sub>DQ</sub> = 0.88 mA、r<sub>d</sub> = 29.5 Ω、i<sub>d</sub> = 19.9 sin ωt μA、v<sub>d</sub> = 0.587 sin ωt mV、v<sub>O</sub> = 4.4 + 0.0995 sin ωt V', note: '10/21 板書原題，數字跟板書一致。' },
    { id: 'mt2-k2b', sec: 'k2', kind: 'pp', no: '', tag: 'HW3 第 2 題', hw: 1, title: 'AC + DC: V<sub>PS</sub> = 8 V, R = 20 kΩ, v<sub>i</sub> = 0.25 sin ωt',
      q: 'The diode circuit parameters are V<sub>PS</sub> = 8 V, R = 20 kΩ, V<sub>γ</sub> = 0.7 V and v<sub>i</sub> = 0.25 sin ωt (V). (a) Determine the DC operating point (V<sub>DQ</sub>, I<sub>DQ</sub>). (b) Determine the AC resistance r<sub>d</sub>. (c) Draw the AC equivalent circuit. (d) Determine v<sub>D</sub>, i<sub>D</sub> and v<sub>O</sub> (equations and waveforms).',
      en: zh('同上一題的電路：V<sub>PS</sub> = 8 V、R = 20 kΩ、V<sub>γ</sub> = 0.7 V、v<sub>i</sub> = 0.25 sin ωt。(a) 直流工作點 (b) 交流電阻 r<sub>d</sub> (c) 畫交流等效電路 (d) 求 v<sub>D</sub>、i<sub>D</sub>、v<sub>O</sub>（式子與波形）。'),
      hint: '跟 10/21 板書同一套流程。',
      steps: [
        st('(a) DC.', 'V<sub>DQ</sub> = 0.7 V；I<sub>DQ</sub> = (8 − 0.7)/20k = 0.365 mA', ''),
        st('(b) r<sub>d</sub>.', 'r<sub>d</sub> = 26 mV/0.365 mA = 71.2 Ω', ''),
        st('(c) AC circuit.', 'v<sub>i</sub> — r<sub>d</sub> — R in series (V<sub>PS</sub> shorted)', ''),
        st('(d) AC quantities.', 'i<sub>d</sub> = 0.25/(20k + 71.2) = 12.5 sin ωt μA；v<sub>d</sub> = 0.887 sin ωt mV；v<sub>o</sub> = 0.249 sin ωt V', ''),
        st('(d) Totals.', 'v<sub>D</sub> = 0.7 + 0.000887 sin ωt V；i<sub>D</sub> = 0.365 + 0.0125 sin ωt mA；v<sub>O</sub> = 7.3 + 0.249 sin ωt V', '')
      ],
      ans: 'I<sub>DQ</sub> = 0.365 mA、r<sub>d</sub> = 71.2 Ω、v<sub>O</sub> = 7.3 + 0.249 sin ωt V', note: '自解，程式驗算。' },

    /* ═══ 3 Zener ═══ */
    { id: 'mt2-k3a', sec: 'k3', kind: 'pp', no: '', tag: 'Design Example 1.13', title: 'Design R for a Zener reference',
      q: 'V<sub>PS</sub> = 10 V, Zener breakdown voltage V<sub>Z</sub> = 5.6 V, r<sub>z</sub> = 0. The diode current is to be limited to 3 mA. (1) Design R. (2) Find the power dissipated in the Zener diode.',
      en: zh('V<sub>PS</sub> = 10 V、V<sub>Z</sub> = 5.6 V、r<sub>z</sub> = 0，齊納電流限制 3 mA。(1) 設計 R (2) 求 P<sub>Z</sub>。'),
      hint: 'KVL：V<sub>PS</sub> − I<sub>Z</sub>R − V<sub>Z</sub> = 0。',
      steps: [
        st('(1) KVL.', '10 − (3 mA)R − 5.6 = 0 ⇒ R = 1.47 kΩ', ''),
        st('(2) Power.', 'P<sub>Z</sub> = I<sub>Z</sub>V<sub>Z</sub> = 3 mA × 5.6 V = 16.8 mW', '齊納要能承受 16.8 mW。')
      ],
      ans: 'R = 1.47 kΩ、P<sub>Z</sub> = 16.8 mW', note: '課本原題。Comment：外接電阻在崩潰區限制電流；V<sub>PS</sub>、R 小幅變動時輸出仍維持 5.6 V。' },
    { id: 'mt2-k3b', sec: 'k3', kind: 'pp', no: '', tag: '10/21 板書延伸', title: 'Redo with r<sub>z</sub> = 10 Ω: find (V<sub>Z</sub>, I<sub>Z</sub>)',
      q: 'Same circuit with R = 1.47 kΩ and V<sub>PS</sub> = 10 V, but now the Zener model is V<sub>Z0</sub> = 5.6 V in series with r<sub>z</sub> = 10 Ω. (1) Find I<sub>Z</sub> and V<sub>Z</sub>. (2) Solve it graphically (load line ∩ breakdown line). (3) If instead I<sub>Z</sub> must stay 3 mA, what R is needed?',
      en: zh('板書：①若給 r<sub>z</sub> = 10 Ω 重作此題 ②用作圖法解此題（求 V<sub>Z</sub>、I<sub>Z</sub>）③給 V<sub>PS</sub>、R 求 (V<sub>Z</sub>, I<sub>Z</sub>)。V<sub>Z0</sub> = 5.6 V。'),
      hint: '崩潰區模型：V<sub>Z0</sub> 電池串 r<sub>z</sub>。',
      steps: [
        st('(1) KVL with the model.', '10 − I<sub>Z</sub>(1470) − 5.6 − I<sub>Z</sub>(10) = 0 ⇒ I<sub>Z</sub> = 4.4/1480 = 2.97 mA', ''),
        st('(1) Zener voltage.', 'V<sub>Z</sub> = V<sub>Z0</sub> + I<sub>Z</sub>r<sub>z</sub> = 5.6 + 0.0297 = 5.63 V', '比 r<sub>z</sub> = 0 時多 30 mV。'),
        st('(2) Graphical.', 'Load line: V<sub>PS</sub> − I<sub>Z</sub>R − V<sub>Z</sub> = 0 (intercepts 10 V and 10/1.47 = 6.8 mA)；breakdown line slope 1/r<sub>z</sub> from V<sub>Z0</sub> ⇒ intersection Q = (5.63 V, 2.97 mA)', '板書右邊那張圖。'),
        st('(3) Keep I<sub>Z</sub> = 3 mA.', 'V<sub>Z</sub> = 5.6 + 0.03 = 5.63 V；R = (10 − 5.63)/3 mA = 1.457 kΩ；P<sub>Z</sub> = 16.9 mW', '')
      ],
      ans: 'I<sub>Z</sub> = 2.97 mA、V<sub>Z</sub> = 5.63 V（R 固定）；R = 1.457 kΩ（I<sub>Z</sub> 固定 3 mA）', note: '板書寫了三種延伸，這裡都做；考試看題目給什麼。' },
    { id: 'mt2-k3c', sec: 'k3', kind: 'pp', no: '', tag: 'HW3 第 5 題（P1.57）', hw: 1, title: 'Zener with r<sub>z</sub> and a load',
      q: 'The Zener breakdown voltage is V<sub>Z</sub> = 5.6 V at I<sub>Z</sub> = 0.1 mA and the incremental Zener resistance is r<sub>z</sub> = 10 Ω. R = 0.5 kΩ, V<sub>PS</sub> = 10 V. (a) Determine V<sub>O</sub> with no load (R<sub>L</sub> = ∞). (b) Find the change in the output voltage if V<sub>PS</sub> changes by ±1 V. (c) Find V<sub>O</sub> if V<sub>PS</sub> = 10 V and R<sub>L</sub> = 2 kΩ.',
      en: zh('齊納在 I<sub>Z</sub> = 0.1 mA 時 V<sub>Z</sub> = 5.6 V、r<sub>z</sub> = 10 Ω；R = 0.5 kΩ、V<sub>PS</sub> = 10 V。(a) 無負載的 V<sub>O</sub> (b) V<sub>PS</sub> 變 ±1 V 時輸出變多少 (c) R<sub>L</sub> = 2 kΩ 時的 V<sub>O</sub>。'),
      hint: '先求 V<sub>Z0</sub> = 5.6 − 0.1 mA × 10 Ω。',
      steps: [
        st('Model.', 'V<sub>Z0</sub> = 5.6 − (0.1 mA)(10) = 5.599 V', ''),
        st('(a) No load.', 'I<sub>Z</sub> = (10 − 5.599)/(500 + 10) = 8.63 mA；V<sub>O</sub> = 5.599 + 0.0863 = 5.685 V', ''),
        st('(b) ΔV<sub>O</sub>.', 'ΔV<sub>O</sub> = ΔV<sub>PS</sub> · r<sub>z</sub>/(R + r<sub>z</sub>) = ±1 × 10/510 = ±19.6 mV', '分壓。'),
        st('(c) With R<sub>L</sub> = 2 kΩ (node equation).', '(10 − V<sub>O</sub>)/500 = (V<sub>O</sub> − 5.599)/10 + V<sub>O</sub>/2000 ⇒ V<sub>O</sub> = 5.658 V', '')
      ],
      ans: '(a) 5.685 V (b) ±19.6 mV (c) 5.658 V', note: '自解，程式驗算；HW3 不用交的參考：Exercise 1.13、TYU 1.17。' },

    /* ═══ 4 全波整流 ═══ */
    { id: 'mt2-k4a', sec: 'k4', kind: 'pp', no: '', tag: '10/28 板書', title: 'Full-wave bridge rectifier: conduction, VTC, waveform, PIV',
      q: 'For the full-wave bridge rectifier with v<sub>S</sub> = V<sub>M</sub> sin ωt and diode cut-in V<sub>γ</sub>, find (1) the conduction conditions and expressions for i<sub>L</sub> and v<sub>O</sub>, (2) the VTC, (3) the v<sub>O</sub> waveform, (4) the PIV of each diode. Then evaluate for V<sub>M</sub> = 10 V, V<sub>γ</sub> = 0.7 V, R = 1 kΩ.',
      en: zh('橋式全波整流，v<sub>S</sub> = V<sub>M</sub> sin ωt。(1) 導通條件、i<sub>L</sub>、v<sub>O</sub> (2) VTC (3) v<sub>O</sub> 波形 (4) 每顆 PIV。再代 V<sub>M</sub> = 10 V、V<sub>γ</sub> = 0.7 V、R = 1 kΩ。'),
      hint: '分三種 case：v<sub>S</sub> ≥ 2V<sub>γ</sub>、|v<sub>S</sub>| &lt; 2V<sub>γ</sub>、−v<sub>S</sub> ≥ 2V<sub>γ</sub>。',
      steps: [
        st('Case 1: v<sub>S</sub> ≥ 2V<sub>γ</sub> (D<sub>1</sub>, D<sub>2</sub> on).', 'KVL: v<sub>S</sub> − V<sub>γ</sub> − i<sub>L</sub>R − V<sub>γ</sub> = 0 ⇒ i<sub>L</sub> = (v<sub>S</sub> − 2V<sub>γ</sub>)/R，v<sub>O</sub> = v<sub>S</sub> − 2V<sub>γ</sub>', '板書：考慮剛要導通 v<sub>S</sub> = 2V<sub>γ</sub>。'),
        st('Case 2: |v<sub>S</sub>| &lt; 2V<sub>γ</sub> (all off).', 'i<sub>L</sub> = 0，v<sub>O</sub> = 0', ''),
        st('Case 3: −v<sub>S</sub> ≥ 2V<sub>γ</sub> (D<sub>3</sub>, D<sub>4</sub> on).', 'i<sub>L</sub> = (−v<sub>S</sub> − 2V<sub>γ</sub>)/R，v<sub>O</sub> = −v<sub>S</sub> − 2V<sub>γ</sub>', '負載電流方向不變。'),
        st('(2) VTC.', 'V-shape: v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>, flat zero for |v<sub>S</sub>| &lt; 2V<sub>γ</sub>, slopes ±1', ''),
        st('(3) Waveform.', 'Humps every half cycle, peak V<sub>M</sub> − 2V<sub>γ</sub> = 8.6 V；i<sub>L,peak</sub> = 8.6 mA', ''),
        st('(4) PIV (11/3 板書).', 'PIV = (−V<sub>γ</sub> + V<sub>M</sub>) − 0 = V<sub>M</sub> − V<sub>γ</sub> = 9.3 V', '板書：D<sub>1</sub> 由 ①② 得知。')
      ],
      ans: 'v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>（|v<sub>S</sub>| ≥ 2V<sub>γ</sub>），否則 0；峰值 8.6 V、8.6 mA；PIV = V<sub>M</sub> − V<sub>γ</sub> = 9.3 V', note: '老師說第 4 題考這個（10/28 板書）。數值部分是自編，用來對答案。' },
    { id: 'mt2-k4b', sec: 'k4', kind: 'pp', no: '', tag: 'HW3 第 7 題', hw: 1, title: 'Center-tapped full-wave rectifier by derivation',
      q: 'Considering the full-wave rectifier with a center-tapped transformer in figure 1, with diode forward voltage V<sub>γ</sub> and peak secondary voltage V<sub>M</sub> (each half), find (1) the conduction conditions and output expressions, (2) the transfer characteristic, (3) the output waveform v<sub>O</sub>, (4) the PIV of each diode.',
      en: zh('中間抽頭全波整流（題目文字寫 bridge，但圖 1 是中間抽頭，照圖做）。V<sub>γ</sub>、每半邊峰值 V<sub>M</sub>。(1) 導通條件與輸出式 (2) 轉移特性 (3) 輸出波形 (4) 每顆 PIV。'),
      hint: '每瞬間只有一顆在通。',
      steps: [
        st('v<sub>S</sub> ≥ V<sub>γ</sub>: D<sub>1</sub> on, D<sub>2</sub> off.', 'v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>，i<sub>L</sub> = (v<sub>S</sub> − V<sub>γ</sub>)/R', ''),
        st('|v<sub>S</sub>| &lt; V<sub>γ</sub>: both off.', 'v<sub>O</sub> = 0', ''),
        st('−v<sub>S</sub> ≥ V<sub>γ</sub>: D<sub>2</sub> on, D<sub>1</sub> off.', 'v<sub>O</sub> = −v<sub>S</sub> − V<sub>γ</sub>', ''),
        st('(2)(3) VTC and waveform.', 'v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>；peak V<sub>M</sub> − V<sub>γ</sub>；output frequency doubles', ''),
        st('(4) PIV.', 'PIV = V<sub>M</sub> + (V<sub>M</sub> − V<sub>γ</sub>) = 2V<sub>M</sub> − V<sub>γ</sub>', '關著那顆：一端 −V<sub>M</sub>、一端是輸出峰值。')
      ],
      ans: 'v<sub>O</sub> = |v<sub>S</sub>| − V<sub>γ</sub>；PIV = 2V<sub>M</sub> − V<sub>γ</sub>', note: '自解；推導格式照 10/28 板書的橋式。' },
    { id: 'mt2-k4c', sec: 'k4', kind: 'pp', no: '', tag: 'Example 2.2', title: 'Center-tapped vs bridge: transformer and PIV',
      q: 'The input line is 120 V (rms) and a 9 V peak output is required with V<sub>γ</sub> = 0.7 V. For a center-tapped and a bridge rectifier find the peak secondary voltage, its rms value, the turns ratio N<sub>1</sub>/N<sub>2</sub>, and the diode PIV.',
      en: zh('市電 120 V rms，要 9 V 峰值輸出，V<sub>γ</sub> = 0.7 V。中間抽頭與橋式各求次級峰值、rms、匝數比、PIV。'),
      hint: '中間抽頭扣 1 個 V<sub>γ</sub>，橋式扣 2 個。',
      steps: [
        st('Center-tapped.', '9.7 V、6.86 V rms、169.7/9.7 = 17.5、PIV = 2(9.7) − 0.7 = 18.7 V', ''),
        st('Bridge.', '10.4 V、7.35 V rms、169.7/10.4 = 16.3、PIV = 10.4 − 0.7 = 9.7 V', '')
      ],
      ans: '中間抽頭 9.7 V／6.86 V／17.5／18.7 V；橋式 10.4 V／7.35 V／16.3／9.7 V', note: '課本原題。' },

    /* ═══ 5 截波 ═══ */
    { id: 'mt2-k5a', sec: 'k5', kind: 'pp', no: '', tag: '11/3 板書 · 基本截波', title: 'Basic (parallel) clipper',
      q: 'In the basic clipper, a diode in series with a battery V<sub>B</sub> is connected across the output, R in series with the input. With v<sub>I</sub> = 10 sin ωt V, V<sub>B</sub> = 4 V and V<sub>γ</sub> = 0.7 V, find the conduction condition, v<sub>O</sub> in each region, the VTC and the output range.',
      en: zh('基本截波：二極體串電池 V<sub>B</sub> 並在輸出，R 串在輸入。v<sub>I</sub> = 10 sin ωt、V<sub>B</sub> = 4 V、V<sub>γ</sub> = 0.7 V。求導通條件、各區 v<sub>O</sub>、VTC、輸出範圍。'),
      hint: '板書：考慮剛要導通 i<sub>D</sub> = 0、V<sub>D</sub> = V<sub>γ</sub>。',
      steps: [
        st('KVL at the edge of conduction (i<sub>D</sub> = 0).', 'v<sub>I</sub> − 0·R − V<sub>γ</sub> − V<sub>B</sub> = 0 ⇒ v<sub>I</sub> = V<sub>B</sub> + V<sub>γ</sub> = 4.7 V', ''),
        st('v<sub>I</sub> &gt; 4.7 V: D on.', 'v<sub>O</sub> = V<sub>B</sub> + V<sub>γ</sub> = 4.7 V，i<sub>D</sub> = (v<sub>I</sub> − 4.7)/R', ''),
        st('v<sub>I</sub> &lt; 4.7 V: D off.', 'v<sub>O</sub> = v<sub>I</sub>', ''),
        st('VTC / range.', 'slope 1 up to 4.7 V, then flat；v<sub>O</sub> from −10 V to 4.7 V', '')
      ],
      ans: '門檻 4.7 V；v<sub>O</sub> 範圍 −10 V ～ 4.7 V', note: '截波板書（使用者之後會再給）到了再對一次；Example 2.7 雙向截波見 CH2 PART 3。' }
  ];

  window.__MT2EX = { book: 'Neamen', items };
  window.__HW3EX = { book: 'Neamen', items: items.filter(i => i.hw).map(i => Object.assign({}, i, { sec: 'hw3' })) };

  /* HW3 其他計算題（只放 hw3 頁與衝刺頁第 6 類） */
  const more = [
    { id: 'mt2-k6a', kind: 'pp', no: '', tag: 'HW3 第 3 題（P1.46）', title: 'Design R<sub>1</sub>, R<sub>2</sub> to keep the diode on',
      q: 'The cut-in voltage of the diode is V<sub>γ</sub> = 0.7 V. The diode is to remain biased "on" for a power supply voltage in the range 5 ≤ V<sub>PS</sub> ≤ 10 V. The minimum diode current is I<sub>D</sub>(min) = 2 mA. The maximum power dissipated in the diode is to be no more than 10 mW. Determine appropriate values of R<sub>1</sub> and R<sub>2</sub>. (R<sub>1</sub> in series; R<sub>2</sub> in parallel with the diode.)',
      en: zh('V<sub>γ</sub> = 0.7 V；V<sub>PS</sub> 在 5～10 V 都要導通；I<sub>D</sub> 最小 2 mA；二極體功率不超過 10 mW。求 R<sub>1</sub>（串聯）、R<sub>2</sub>（與二極體並聯）。'),
      hint: 'V<sub>PS</sub> = 5 V 對應 I<sub>D,min</sub>，V<sub>PS</sub> = 10 V 對應 I<sub>D,max</sub> = 10 mW/0.7 V。',
      steps: [
        st('Max diode current.', 'I<sub>D,max</sub> = 10 mW/0.7 V = 14.29 mA', ''),
        st('At V<sub>PS</sub> = 5 V.', '(5 − 0.7)/R<sub>1</sub> = 2 mA + 0.7/R<sub>2</sub>', 'R<sub>1</sub> 的電流 = 二極體 + R<sub>2</sub>。'),
        st('At V<sub>PS</sub> = 10 V.', '(10 − 0.7)/R<sub>1</sub> = 14.29 mA + 0.7/R<sub>2</sub>', ''),
        st('Subtract.', '5/R<sub>1</sub> = 12.29 mA ⇒ R<sub>1</sub> = 0.407 kΩ', ''),
        st('Back-substitute.', '0.7/R<sub>2</sub> = 4.3/0.407k − 2 mA = 8.57 mA ⇒ R<sub>2</sub> = 81.7 Ω', '')
      ],
      ans: 'R<sub>1</sub> = 0.407 kΩ、R<sub>2</sub> = 81.7 Ω', note: '自解，程式驗算。' },
    { id: 'mt2-k6b', kind: 'pp', no: '', tag: 'HW3 第 4 題（P1.53）', title: 'Current-source bias with coupling capacitor',
      q: 'The diode is biased with a constant current source I. A sinusoidal signal v<sub>s</sub> is coupled through R<sub>S</sub> and C (C large: short to the signal). (a) Show that the sinusoidal component of the diode voltage is v<sub>o</sub> = v<sub>s</sub>·V<sub>T</sub>/(V<sub>T</sub> + I R<sub>S</sub>). (b) If R<sub>S</sub> = 260 Ω, find v<sub>o</sub>/v<sub>s</sub> for I = 1 mA, 0.1 mA and 0.01 mA.',
      en: zh('定電流源 I 偏壓二極體；訊號 v<sub>s</sub> 經 R<sub>S</sub>、大電容 C 耦合。(a) 證明 v<sub>o</sub> = v<sub>s</sub>·V<sub>T</sub>/(V<sub>T</sub> + IR<sub>S</sub>) (b) R<sub>S</sub> = 260 Ω，I = 1、0.1、0.01 mA 時 v<sub>o</sub>/v<sub>s</sub>。提示：直流時電容開路。'),
      hint: 'DC：電容開路 ⇒ I<sub>DQ</sub> = I。AC：電流源開路，二極體換 r<sub>d</sub> = V<sub>T</sub>/I。',
      steps: [
        st('DC (capacitor open).', 'I<sub>DQ</sub> = I ⇒ r<sub>d</sub> = V<sub>T</sub>/I', 'HW3 HINT。'),
        st('AC (current source open, C short).', 'v<sub>o</sub> = v<sub>s</sub> · r<sub>d</sub>/(r<sub>d</sub> + R<sub>S</sub>) = v<sub>s</sub> · V<sub>T</sub>/(V<sub>T</sub> + I R<sub>S</sub>)', '分子分母同乘 I。'),
        st('(b) I = 1 mA.', '0.026/(0.026 + 0.26) = 0.0909', ''),
        st('(b) I = 0.1 mA.', '0.026/(0.026 + 0.026) = 0.5', ''),
        st('(b) I = 0.01 mA.', '0.026/(0.026 + 0.0026) = 0.909', '電流越小，r<sub>d</sub> 越大，分到的訊號越多。')
      ],
      ans: '0.0909、0.5、0.909', note: '自解，V<sub>T</sub> = 0.026 V。' }
  ];
  more.forEach(i => { window.__MT2EX.items.push(Object.assign({ sec: 'k6' }, i)); window.__HW3EX.items.push(Object.assign({}, i, { sec: 'hw3' })); });
})();
