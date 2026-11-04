/* ============================================================
   仿 HW2、HW3（使用者 11/4：練習題、計算題、每節填充都照作業出）
   - 計算題換數字、公式只用講義／作業上出現過的
   - 填充題照 HW3 選擇題 PART1、PART2 與第 1 題填空改寫，英文先、中文翻譯收起來
   - 數值都用程式驗算過；載入順序：放在各頁 exbook.js 之後（hw.js、exbook.js 在 DOMContentLoaded 才 render）
   掛到既有題庫：__CH15EX、__CH16EX、__CH22EX（計算）、__CH16C（填充）
   ============================================================ */
(function () {
  'use strict';
  const st = (t, eq, why) => ({ t, eq, why });
  const zh = s => '<details class="hw-zh dv-ui"><summary>中文翻譯</summary><div>' + s + '</div></details>';
  const ALL = [];
  const pushEx = (bank, items) => { items.forEach(i => ALL.push(Object.assign({}, i, { sec: 'hw3m' }))); const b = window[bank]; if (b && b.items) items.forEach(i => { if (!b.items.some(x => x.id === i.id)) b.items.push(i); }); };

  /* ═════ 計算題（仿作業） ═════ */
  pushEx('__CH15EX', [
    { id: 'm3-146a', sec: 'cvd', kind: 'pp', no: '', tag: '仿 HW3 第 3 題（P1.46）', title: 'Keep the diode on over a supply range',
      q: 'The diode has V<sub>γ</sub> = 0.7 V. R<sub>1</sub> is in series with the supply and R<sub>2</sub> is in parallel with the diode. The diode must stay "on" for 6 V ≤ V<sub>PS</sub> ≤ 12 V with I<sub>D</sub>(min) = 1 mA, and the diode power must not exceed 7 mW. Determine R<sub>1</sub> and R<sub>2</sub>.',
      en: zh('V<sub>γ</sub> = 0.7 V；R<sub>1</sub> 串電源、R<sub>2</sub> 並二極體。V<sub>PS</sub> 在 6～12 V 都要導通，I<sub>D</sub> 最小 1 mA，二極體功率不超過 7 mW。求 R<sub>1</sub>、R<sub>2</sub>。'),
      hint: 'V<sub>PS</sub> 最小時 I<sub>D</sub> 最小；V<sub>PS</sub> 最大時 I<sub>D</sub> 最大 = P/V<sub>γ</sub>。',
      steps: [
        st('Maximum diode current.', 'I<sub>D,max</sub> = 7 mW / 0.7 V = 10 mA', '功率 = 電壓 × 電流。'),
        st('KCL at V<sub>PS</sub> = 6 V.', '(6 − 0.7)/R<sub>1</sub> = 1 mA + 0.7/R<sub>2</sub>', 'R<sub>1</sub> 的電流分給二極體和 R<sub>2</sub>。'),
        st('KCL at V<sub>PS</sub> = 12 V.', '(12 − 0.7)/R<sub>1</sub> = 10 mA + 0.7/R<sub>2</sub>', ''),
        st('Subtract.', '6/R<sub>1</sub> = 9 mA ⇒ R<sub>1</sub> = 667 Ω', 'R<sub>2</sub> 的電流兩式一樣（電壓都是 0.7 V），相減就消掉。'),
        st('Back-substitute.', '0.7/R<sub>2</sub> = 5.3/667 − 1 mA = 6.95 mA ⇒ R<sub>2</sub> = 101 Ω', '')
      ],
      ans: 'R<sub>1</sub> ≈ 667 Ω、R<sub>2</sub> ≈ 101 Ω', note: '仿 HW3 第 3 題換數字，程式驗算。' },
    { id: 'm3-146b', sec: 'cvd', kind: 'pp', no: '', tag: '仿 HW3 第 3 題（P1.46）', title: 'Same design, another set of numbers',
      q: 'Repeat with V<sub>γ</sub> = 0.6 V, 4 V ≤ V<sub>PS</sub> ≤ 8 V, I<sub>D</sub>(min) = 1.5 mA and a maximum diode power of 6 mW.',
      en: zh('同一個電路改成 V<sub>γ</sub> = 0.6 V、V<sub>PS</sub> 4～8 V、I<sub>D</sub> 最小 1.5 mA、二極體功率上限 6 mW。'),
      hint: '先算 I<sub>D,max</sub> = 6 mW/0.6 V。',
      steps: [
        st('I<sub>D,max</sub>.', '6 mW/0.6 V = 10 mA', ''),
        st('Two KCL equations.', '3.4/R<sub>1</sub> = 1.5 mA + 0.6/R<sub>2</sub>；7.4/R<sub>1</sub> = 10 mA + 0.6/R<sub>2</sub>', ''),
        st('Subtract.', '4/R<sub>1</sub> = 8.5 mA ⇒ R<sub>1</sub> = 471 Ω', ''),
        st('R<sub>2</sub>.', '0.6/R<sub>2</sub> = 3.4/471 − 1.5 mA = 5.73 mA ⇒ R<sub>2</sub> = 105 Ω', '')
      ],
      ans: 'R<sub>1</sub> ≈ 471 Ω、R<sub>2</sub> ≈ 105 Ω', note: '仿作業，程式驗算。' }
  ]);

  pushEx('__CH16EX', [
    { id: 'm3-acdc-a', sec: 'dcac', kind: 'pp', no: '', tag: '仿 HW3 第 2 題', title: 'AC + DC: V<sub>PS</sub> = 6 V, R = 10 kΩ, v<sub>i</sub> = 0.2 sin ωt',
      q: 'The diode circuit has V<sub>PS</sub> = 6 V, R = 10 kΩ, V<sub>γ</sub> = 0.7 V and v<sub>i</sub> = 0.2 sin ωt (V) in series. (a) Determine (V<sub>DQ</sub>, I<sub>DQ</sub>). (b) Determine r<sub>d</sub>. (c) Draw the AC equivalent circuit. (d) Determine v<sub>D</sub>, i<sub>D</sub> and v<sub>O</sub>.',
      en: zh('V<sub>PS</sub> = 6 V、R = 10 kΩ、V<sub>γ</sub> = 0.7 V，串一個 v<sub>i</sub> = 0.2 sin ωt。(a) 直流工作點 (b) r<sub>d</sub> (c) 交流等效電路 (d) v<sub>D</sub>、i<sub>D</sub>、v<sub>O</sub>。'),
      hint: 'DC：交流電壓源短路；AC：直流電壓源短路、二極體換 r<sub>d</sub>。',
      steps: [
        st('(a) DC.', 'V<sub>DQ</sub> = 0.7 V；I<sub>DQ</sub> = (6 − 0.7)/10k = 0.53 mA', ''),
        st('(b) r<sub>d</sub>.', 'r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub> = 26 mV/0.53 mA = 49.1 Ω', ''),
        st('(c) AC circuit.', 'v<sub>i</sub> 串 r<sub>d</sub> 串 R（V<sub>PS</sub> 短路）', ''),
        st('(d) AC parts.', 'i<sub>d</sub> = 0.2/(10k + 49.1) = 19.9 sin ωt μA；v<sub>d</sub> = 0.976 sin ωt mV；v<sub>o</sub> = 0.199 sin ωt V', ''),
        st('(d) Totals.', 'v<sub>D</sub> = 0.7 V + 0.976 sin ωt mV；i<sub>D</sub> = 0.53 mA + 19.9 sin ωt μA；v<sub>O</sub> = 5.3 + 0.199 sin ωt V', '直流加交流。')
      ],
      ans: 'I<sub>DQ</sub> = 0.53 mA、r<sub>d</sub> = 49.1 Ω、v<sub>O</sub> = 5.3 + 0.199 sin ωt V', note: '仿 HW3 第 2 題，程式驗算。' },
    { id: 'm3-acdc-b', sec: 'dcac', kind: 'pp', no: '', tag: '仿 HW3 第 2 題', title: 'AC + DC: V<sub>PS</sub> = 12 V, R = 4.7 kΩ, v<sub>i</sub> = 0.5 sin ωt',
      q: 'Repeat with V<sub>PS</sub> = 12 V, R = 4.7 kΩ, V<sub>γ</sub> = 0.6 V and v<sub>i</sub> = 0.5 sin ωt (V). Find I<sub>DQ</sub>, r<sub>d</sub>, i<sub>d</sub>, v<sub>d</sub> and v<sub>O</sub>.',
      en: zh('同樣的電路改成 V<sub>PS</sub> = 12 V、R = 4.7 kΩ、V<sub>γ</sub> = 0.6 V、v<sub>i</sub> = 0.5 sin ωt。求 I<sub>DQ</sub>、r<sub>d</sub>、i<sub>d</sub>、v<sub>d</sub>、v<sub>O</sub>。'),
      hint: '同一套流程。',
      steps: [
        st('DC.', 'I<sub>DQ</sub> = (12 − 0.6)/4.7k = 2.43 mA', ''),
        st('r<sub>d</sub>.', '26 mV/2.43 mA = 10.7 Ω', '電流越大，r<sub>d</sub> 越小。'),
        st('AC.', 'i<sub>d</sub> = 0.5/(4.7k + 10.7) = 106 sin ωt μA；v<sub>d</sub> = 1.14 sin ωt mV；v<sub>o</sub> = 0.499 sin ωt V', ''),
        st('Total.', 'v<sub>O</sub> = 11.4 + 0.499 sin ωt V', '')
      ],
      ans: 'I<sub>DQ</sub> = 2.43 mA、r<sub>d</sub> = 10.7 Ω、v<sub>O</sub> = 11.4 + 0.499 sin ωt V', note: '仿作業，程式驗算。' },
    { id: 'm3-153a', sec: 'rd', kind: 'pp', no: '', tag: '仿 HW3 第 4 題（P1.53）', title: 'Current-source bias: how much signal reaches the diode',
      q: 'A diode is biased by a constant current I; the signal v<sub>s</sub> is coupled through R<sub>S</sub> = 520 Ω and a large capacitor. Using v<sub>o</sub>/v<sub>s</sub> = V<sub>T</sub>/(V<sub>T</sub> + I R<sub>S</sub>), find v<sub>o</sub>/v<sub>s</sub> for I = 2 mA, 0.5 mA and 0.05 mA.',
      en: zh('定電流 I 偏壓二極體，訊號經 R<sub>S</sub> = 520 Ω 和大電容耦合。用 v<sub>o</sub>/v<sub>s</sub> = V<sub>T</sub>/(V<sub>T</sub> + IR<sub>S</sub>)，求 I = 2、0.5、0.05 mA 時的 v<sub>o</sub>/v<sub>s</sub>。'),
      hint: 'r<sub>d</sub> = V<sub>T</sub>/I，跟 R<sub>S</sub> 分壓。',
      steps: [
        st('I = 2 mA.', '0.026/(0.026 + 1.04) = 0.0244', 'r<sub>d</sub> = 13 Ω，比 R<sub>S</sub> 小很多，訊號幾乎都掉在 R<sub>S</sub>。'),
        st('I = 0.5 mA.', '0.026/(0.026 + 0.26) = 0.0909', ''),
        st('I = 0.05 mA.', '0.026/(0.026 + 0.026) = 0.5', 'r<sub>d</sub> = 520 Ω = R<sub>S</sub>，剛好一半。')
      ],
      ans: '0.0244、0.0909、0.5', note: '仿作業；式子是 HW3 第 4 題給的。' },
    { id: 'm3-157a', sec: 'zd', kind: 'pp', no: '', tag: '仿 HW3 第 5 題（P1.57）', title: 'Zener with r<sub>z</sub>: no load, ±1 V, and with a load',
      q: 'A Zener diode has V<sub>Z</sub> = 6.2 V at I<sub>Z</sub> = 0.2 mA and r<sub>z</sub> = 5 Ω. R = 1 kΩ and V<sub>PS</sub> = 12 V. (a) Find V<sub>O</sub> with no load. (b) Find the change in V<sub>O</sub> if V<sub>PS</sub> changes by ±1 V. (c) Find V<sub>O</sub> with R<sub>L</sub> = 1.5 kΩ.',
      en: zh('齊納在 I<sub>Z</sub> = 0.2 mA 時 V<sub>Z</sub> = 6.2 V、r<sub>z</sub> = 5 Ω；R = 1 kΩ、V<sub>PS</sub> = 12 V。(a) 無負載 V<sub>O</sub> (b) V<sub>PS</sub> 變 ±1 V 時 V<sub>O</sub> 變多少 (c) R<sub>L</sub> = 1.5 kΩ 時的 V<sub>O</sub>。'),
      hint: '模型：V<sub>Z</sub> = V<sub>Z0</sub> + I<sub>Z</sub>r<sub>z</sub>。',
      steps: [
        st('V<sub>Z0</sub>.', '6.2 − (0.2 mA)(5 Ω) = 6.199 V', ''),
        st('(a) No load.', 'I<sub>Z</sub> = (12 − 6.199)/(1000 + 5) = 5.77 mA；V<sub>O</sub> = 6.199 + 5.77 m × 5 = 6.228 V', ''),
        st('(b) ±1 V.', 'ΔV<sub>O</sub> = ±1 × 5/1005 = ±4.98 mV', 'r<sub>z</sub> 和 R 分壓。'),
        st('(c) R<sub>L</sub> = 1.5 kΩ.', '(12 − V<sub>O</sub>)/1000 = (V<sub>O</sub> − 6.199)/5 + V<sub>O</sub>/1500 ⇒ V<sub>O</sub> = 6.207 V', '節點方程式。')
      ],
      ans: '(a) 6.228 V (b) ±4.98 mV (c) 6.207 V', note: '仿 HW3 第 5 題，程式驗算。' }
  ]);

  pushEx('__CH22EX', [
    { id: 'm3-ex21', sec: 'chg', kind: 'pp', no: '', tag: '仿 HW3 第 6 題（Exercise 2.1 型）', title: 'Battery charger: peak current, PIV, fraction of cycle',
      q: 'A half-wave battery charger has v<sub>S</sub> = 18 sin ωt V, V<sub>B</sub> = 9 V, R = 50 Ω and V<sub>γ</sub> = 0.7 V. Determine (1) the peak diode current, (2) the maximum reverse-bias diode voltage, (3) the fraction of the cycle over which the diode is conducting.',
      en: zh('電池充電器 v<sub>S</sub> = 18 sin ωt V、V<sub>B</sub> = 9 V、R = 50 Ω、V<sub>γ</sub> = 0.7 V。求 (1) 二極體峰值電流 (2) 最大逆偏電壓 (3) 一週期中導通的比例。'),
      hint: '導通條件 v<sub>S</sub> &gt; V<sub>B</sub> + V<sub>γ</sub>。',
      steps: [
        st('(1) Peak current.', '(18 − 0.7 − 9)/50 = 0.166 A = 166 mA', ''),
        st('(2) PIV.', 'V<sub>B</sub> + V<sub>M</sub> = 9 + 18 = 27 V', ''),
        st('(3) Conduction angles.', 'ωt<sub>1</sub> = sin<sup>−1</sup>(9.7/18) = 32.6°，ωt<sub>2</sub> = 147.4°', ''),
        st('(3) Fraction.', '(147.4 − 32.6)/360 = 31.9 %', '')
      ],
      ans: '(1) 166 mA (2) 27 V (3) 31.9 %', note: '仿 HW3 第 6 題，程式驗算。' },
    { id: 'm3-ct', sec: 'fwc', kind: 'pp', no: '', tag: '仿 HW3 第 7 題', title: 'Center-tapped rectifier: derive, then plug in numbers',
      q: 'For the center-tapped full-wave rectifier with V<sub>M</sub> = 20 V (each half), V<sub>γ</sub> = 0.7 V and R = 2 kΩ, find (1) the conduction conditions and expressions for i<sub>L</sub> and v<sub>O</sub>, (2) the transfer characteristic break points, (3) the peak v<sub>O</sub> and i<sub>L</sub>, (4) the PIV of each diode.',
      en: zh('中間抽頭全波整流，每半邊 V<sub>M</sub> = 20 V、V<sub>γ</sub> = 0.7 V、R = 2 kΩ。(1) 導通條件與 i<sub>L</sub>、v<sub>O</sub> (2) 轉移特性的轉折點 (3) v<sub>O</sub>、i<sub>L</sub> 峰值 (4) 每顆 PIV。'),
      hint: '照 HW3 第 7 題的推導格式：正半週、負半週各三種情況。',
      steps: [
        st('(1) Positive half.', 'v<sub>S</sub> &gt; V<sub>γ</sub>：D<sub>1</sub> on，i<sub>L</sub> = (v<sub>S</sub> − 0.7)/2k，v<sub>O</sub> = v<sub>S</sub> − 0.7；否則 0', ''),
        st('(1) Negative half.', '−v<sub>S</sub> &gt; V<sub>γ</sub>：D<sub>2</sub> on，i<sub>L</sub> = (−v<sub>S</sub> − 0.7)/2k，v<sub>O</sub> = −v<sub>S</sub> − 0.7；否則 0', ''),
        st('(2) VTC.', '轉折點 v<sub>S</sub> = ±0.7 V，兩邊斜率 ±1', ''),
        st('(3) Peaks.', 'v<sub>O,max</sub> = 19.3 V，i<sub>L,max</sub> = 9.65 mA', ''),
        st('(4) PIV.', '2V<sub>M</sub> − V<sub>γ</sub> = 39.3 V', '')
      ],
      ans: '轉折 ±0.7 V；19.3 V、9.65 mA；PIV 39.3 V', note: '仿 HW3 第 7 題，程式驗算。' }
  ]);

  window.__HW3MX = { book: 'Neamen', items: ALL };

  /* ═════ 填充題（仿 HW3 選擇題、第 1 題填空）═════ */
  const C = window.__CH16C || (window.__HW3MC = { name: 'ch16c', items: [] });
  if (C && C.items) {
    const S = o => ({ o, a: 0 });
    let k = 0;
    const M = (sec, link, title, q, zhq, opts, ex) => {
      k++;
      if (C.items.some(x => x.id === 'm3cf-' + k)) return;
      C.items.push({ id: 'm3cf-' + k, kind: 'cf', sec, no: '仿 HW3-' + k, calc: false, link, title: '仿 HW3 · ' + title, q, zh: zhq, b: [S(opts)], ex });
    };
    const P6 = 'ch1-part6.html', P7 = 'ch1-part7.html';
    M('dcac', P6 + '#dcac', 'DC analysis', 'For dc analysis of a diode circuit, an independent ac current source is {0}.', '做直流分析時，獨立交流電流源要 ___。',
      ['opened 開路', 'shorted 短路', 'doubled 加倍', 'unchanged 不動'], '仿 HW3 PART1 第 1 題：交流電壓源短路、交流電流源開路。');
    M('dcac', P6 + '#dcac', 'AC analysis', 'For ac analysis, an independent dc current source is {0}.', '做交流分析時，獨立直流電流源要 ___。',
      ['opened 開路', 'shorted 短路', 'doubled 加倍', 'unchanged 不動'], '仿 HW3 PART1 第 2 題：直流電壓源短路、直流電流源開路。');
    M('rd', P6 + '#rd', 'Name of r_d', 'In the diode small-signal model, the equivalent resistance r<sub>d</sub> is called the {0}.', '小信號模型裡的等效電阻 r<sub>d</sub> 叫做 ___。',
      ['small-signal incremental (diffusion) resistance 小信號增量電阻', 'static resistance 靜態電阻', 'reverse resistance 反向電阻', 'total resistance 總電阻'], '仿 HW3 PART1 第 3 題。');
    M('rd', P6 + '#rd', 'Reverse current in ac analysis', 'In ac equivalent analysis, the reverse current of the diode is usually assumed to be {0}.', '交流等效分析時，二極體的反向電流通常假設為 ___。',
      ['zero 零', 'infinite 無窮大', 'a constant 常數', 'proportional to voltage 正比於電壓'], '仿 HW3 PART1 第 4 題。');
    M('qdes', P6 + '#qdes', 'What sets the small-signal behavior', 'The small-signal behavior of the diode is mainly set by 1/r<sub>d</sub> and {0}.', '影響二極體小信號表現的，主要是 1/r<sub>d</sub> 和 ___。',
      ['the Q-point position on the curve 工作點在曲線上的位置', 'the bias frequency 頻率', 'the package 封裝', 'nothing else 沒有別的'], '仿 HW3 PART1 第 5 題（答案 A、B）。');
    M('cap', P7 + '#cap', 'DC only', 'If only dc is applied, the diode capacitances {0}.', '只有直流時，二極體的電容 ___。',
      ['need not be considered 不需要考慮', 'must be considered 一定要考慮', 'become short circuits 變短路', 'double 加倍'], '仿 HW3 第 1 題填空。');
    M('cap', P7 + '#cap', 'Forward bias + ac', 'With forward bias plus an ac signal, the diffusion capacitance {0}.', '順偏再加交流訊號時，擴散電容 ___。',
      ['must be considered 要考慮', 'can always be ignored 都可以忽略', 'becomes negative 變負的', 'disappears 消失'], '仿 HW3 第 1 題填空。');
    M('cap', P7 + '#cap', 'Smaller ΔV', 'If the ac component ΔV of v<sub>D</sub> becomes smaller, the change of minority-carrier concentration in the P and N neutral regions becomes {0}.', '若 v<sub>D</sub> 的交流成分 ΔV 變小，P、N 中性區少數載子濃度的變化 ___。',
      ['smaller 變小', 'larger 變大', 'zero 變 0', 'unchanged 不變'], '仿 HW3 第 1 題填空。');
    M('cap', P7 + '#cap', 'Frequency up', 'When the frequency of the ac component of v<sub>D</sub> increases, C<sub>d</sub> {0}.', 'v<sub>D</sub> 交流成分的頻率變大時，C<sub>d</sub> ___。',
      ['decreases 變小', 'increases 變大', 'is unchanged 不變', 'becomes infinite 無窮大'], '仿 HW3 第 1 題填空；講義：頻率升高 dQ 來不及，C<sub>d</sub> 變小。');
    M('sseq', P7 + '#sseq', 'AC model', 'If the diode ac resistance is r<sub>d</sub>, its simplified small-signal model is {0}.', '二極體交流電阻為 r<sub>d</sub>，它的小信號簡化模型是 ___。',
      ['r_d in parallel with C_d r_d 並聯 C_d', 'r_d in series with C_d r_d 串聯 C_d', 'a battery only 只有電池', 'an open circuit 開路'], '仿 HW3 第 1 題「繪出 AC 等效電路」。');
    M('sw', P7 + '#sw', 'v_D at t = 0', 'Right after switching from forward to reverse bias (t = 0), v<sub>D</sub> stays near 0 V because {0}.', '由順偏轉逆偏的瞬間，v<sub>D</sub> 仍在 0 V 附近，因為 ___。',
      ['the junction is still full of stored minority carriers 接面仍充滿少數載子', 'the capacitor discharges too slowly 電容放電太慢', 'the source has not reversed 外部電壓沒反轉', 'the built-in field disappears 內建電場消失'], '仿 HW3 PART2 第 8 題。');
    M('sw', P7 + '#sw', 'Turn-off time', 'The turn-off time of a diode includes the storage time t<sub>s</sub> and {0}.', '二極體的關斷時間包含儲存時間 t<sub>s</sub> 和 ___。',
      ['the fall time t_f 下降時間', 'the rise time 上升時間', 'the delay time 延遲時間', 'the turn-on time 導通時間'], '仿 HW3 PART2 第 11 題。');
    M('opto', P7 + '#opto', 'Photodiode', 'A photodiode converts {0}.', '光二極體把 ___。',
      ['light signals into electrical signals 光訊號變電訊號', 'electrical signals into light 電變光', 'light into sound 光變聲', 'heat into light 熱變光'], '仿 HW3 PART2 第 3 題。');
    M('opto', P7 + '#opto', 'Solar cell and light', 'When a solar cell receives more light, its output current {0}.', '太陽能電池照光越強，輸出電流 ___。',
      ['increases 增加', 'decreases 減少', 'stays the same 不變', 'reverses 反向'], '仿 HW3 PART1 第 9 題。');
    M('sbd', P7 + '#sbd', 'Schottky V_on', 'The forward turn-on voltage of a Schottky diode is generally about {0}.', '蕭特基二極體的順向導通電壓一般約 ___。',
      ['0.2 to 0.4 V', '0.6 to 0.8 V', '1.0 to 1.2 V', '0.05 V'], '仿 HW3 PART1 第 16 題。');
    M('sbd', P7 + '#sbd', 'Schottky junction', 'The rectifying junction of a Schottky diode is formed by a metal and {0}.', '蕭特基二極體的整流接面由金屬和 ___ 形成。',
      ['an n-type semiconductor N 型半導體', 'a p-type semiconductor P 型半導體', 'an insulator 絕緣體', 'another metal 另一種金屬'], '仿 HW3 PART2 第 12 題（講義：金屬接 N 型）。');
    M('zd', P7 + '#zd', 'Zener application', 'The main application of a Zener diode is as {0}.', '齊納二極體的主要應用是 ___。',
      ['a reference voltage source and regulator 參考電壓源與穩壓器', 'a current amplifier 電流放大器', 'a switching element 開關元件', 'a light source 光源'], '仿 HW3 PART1 第 22 題。');
    M('zd', P7 + '#zd', 'Zener principle', 'The stable voltage of a Zener diode in reverse bias relies on {0}.', '齊納逆偏時能穩住電壓，靠的是 ___。',
      ['Zener breakdown 齊納崩潰', 'carrier diffusion 載子擴散', 'diffusion capacitance 擴散電容', 'forward current 順向電流'], '仿 HW3 PART1 第 20 題。');
    C.items.forEach(i => { if (i.id.indexOf('m3cf-') === 0) i.b[0].o = i.b[0].o.map(t => t.replace(/<\/?su[bp]>/g, '').replace(/_/g, '')); });
    window.__HW3MC = { name: 'ch16c', items: C.items.filter(i => i.id.indexOf('m3cf-') === 0).map(i => Object.assign({}, i, { sec: 'hw3m' })) };
  }
})();
