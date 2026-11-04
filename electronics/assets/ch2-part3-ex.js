/* ============================================================
   電子學 CH2 PART 3 —— 例題與練習（板書 Example 2.7 ＋ 自編練習）
   ============================================================ */
(function () {
  'use strict';
  const st = (t, eq, why) => ({ t, eq, why });
  const items = [
    { id: 'c23-sh1', sec: 'shunt', kind: 'pp', no: '', tag: '自編練習', title: '並聯截波器：輸出範圍',
      q: '並聯截波器，v<sub>i</sub> = 10 sin ωt V，V<sub>B</sub> = 4 V，V<sub>γ</sub> = 0.7 V。求 v<sub>O</sub> 的最大、最小值。',
      en: 'A shunt clipper has v<sub>i</sub> = 10 sin ωt V, V<sub>B</sub> = 4 V and V<sub>γ</sub> = 0.7 V. Find the maximum and minimum of v<sub>O</sub>.',
      hint: '門檻 = V<sub>B</sub> + V<sub>γ</sub>。',
      steps: [st('門檻。', 'V<sub>B</sub> + V<sub>γ</sub> = 4.7 V', ''), st('v<sub>i</sub> 超過 4.7 V 時被截。', 'v<sub>O,max</sub> = 4.7 V', ''), st('負半週完整。', 'v<sub>O,min</sub> = −10 V', 'OFF 時 v<sub>O</sub> = v<sub>i</sub>。')],
      ans: '最大 4.7 V、最小 −10 V', note: '自編練習；板書公式 v<sub>O</sub> = V<sub>B</sub> + V<sub>γ</sub>（v<sub>i</sub> 大於它時）。' },
    { id: 'c23-sh2', sec: 'shunt', kind: 'pp', no: '', tag: '自編練習（照板書參考 ①）', title: '二極體反接：削掉底部',
      q: 'In the reference shunt clipper with the diode reversed, V<sub>B</sub> = 2 V, V<sub>γ</sub> = 0.7 V and v<sub>i</sub> = 5 sin ωt V. Find the break point, v<sub>O</sub> in each region, and the output range.',
      en: '<details class="hw-zh dv-ui"><summary>中文翻譯</summary><div>並聯截波「參考 ①」（二極體反接），V<sub>B</sub> = 2 V、V<sub>γ</sub> = 0.7 V、v<sub>i</sub> = 5 sin ωt V。求分界點、各區 v<sub>O</sub> 與輸出範圍。</div></details>',
      hint: '板書：v<sub>i</sub> &lt; V<sub>B</sub> − V<sub>γ</sub> 時 D 通。',
      steps: [
        st('分界點。', 'V<sub>B</sub> − V<sub>γ</sub> = 1.3 V', ''),
        st('v<sub>i</sub> &lt; 1.3 V。', 'D 通 ⇒ v<sub>O</sub> = 1.3 V', '底部被削平。'),
        st('v<sub>i</sub> ≥ 1.3 V。', 'D 不通 ⇒ v<sub>O</sub> = v<sub>i</sub>', ''),
        st('範圍。', '1.3 V ～ 5 V', '')
      ],
      ans: '分界 1.3 V；v<sub>O</sub> 在 1.3 V ～ 5 V', note: '自編練習。' },
    { id: 'c23-se1', sec: 'series', kind: 'pp', no: '', tag: '自編練習', title: '串聯截波器：板書公式代數字',
      q: '串聯截波器，v<sub>i</sub> = 10 sin ωt V，V<sub>B</sub> = 4 V，V<sub>γ</sub> = 0.7 V。依板書公式求 v<sub>O</sub> 的最大、最小值。',
      en: 'A series clipper has v<sub>i</sub> = 10 sin ωt V, V<sub>B</sub> = 4 V and V<sub>γ</sub> = 0.7 V. Using the notes\' equations, find the maximum and minimum of v<sub>O</sub>.',
      hint: '分界點 V<sub>B</sub> − V<sub>γ</sub>。',
      steps: [st('分界點。', 'V<sub>B</sub> − V<sub>γ</sub> = 3.3 V', ''), st('v<sub>i</sub> &gt; 3.3 V：', 'v<sub>O</sub> = 0', ''), st('v<sub>i</sub> &lt; 3.3 V：', 'v<sub>O</sub> = v<sub>i</sub> − 3.3；最小 −13.3 V', '')],
      ans: '最大 0 V、最小 −13.3 V', note: '自編練習，公式照板書。' },
    { id: 'c23-bd1', sec: 'bidir', kind: 'pp', no: 'Example 2.7', tag: 'Example 2.7（板書）', title: '雙向截波器',
      q: '雙向截波器，V<sub>γ</sub> = 0，R<sub>1</sub> = R<sub>2</sub> = 10 kΩ，V<sub>B1</sub> = 2 V，V<sub>B2</sub> = 4 V，v<sub>i</sub> 峰值 6 V。求 v<sub>O</sub> 在三個區間的式子與最大、最小值。',
      en: 'A two-way clipper has V<sub>γ</sub> = 0, R<sub>1</sub> = R<sub>2</sub> = 10 kΩ, V<sub>B1</sub> = 2 V, V<sub>B2</sub> = 4 V and a 6 V peak input. Find v<sub>O</sub> in each region and its maximum and minimum.',
      hint: '上面那顆導通時 R<sub>1</sub>、R<sub>2</sub> 分壓。',
      steps: [st('中間：−4 &lt; v<sub>i</sub> &lt; 2。', 'v<sub>O</sub> = v<sub>i</sub>', '兩顆 OFF。'), st('v<sub>i</sub> &gt; 2：上面 ON。', 'v<sub>O</sub> = (v<sub>i</sub> − 2)/2 + 2 = ½v<sub>i</sub> + 1', 'R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>) = ½。'), st('v<sub>i</sub> &lt; −4：下面 ON。', 'v<sub>O</sub> = −4 V', ''), st('最大最小。', 'v<sub>O,max</sub> = ½·6 + 1 = 4 V，v<sub>O,min</sub> = −4 V', '')],
      ans: '最大 4 V、最小 −4 V', note: '板書原題，數字已對過。' },
    { id: 'c23-bd2', sec: 'bidir', kind: 'pp', no: '', tag: '自編練習（照板書）', title: '基本雙向截波：上下限與三段輸出',
      q: 'Two-way clipper: V<sub>B1</sub> = 3 V, V<sub>B2</sub> = 2 V, V<sub>γ1</sub> = V<sub>γ2</sub> = 0.7 V, v<sub>i</sub> = 8 sin ωt V (no R<sub>2</sub>). (a) Find the condition for each diode to conduct. (b) Write v<sub>O</sub> in each region. (c) Find the maximum and minimum of v<sub>O</sub>.',
      en: '<details class="hw-zh dv-ui"><summary>中文翻譯</summary><div>雙向截波：V<sub>B1</sub> = 3 V、V<sub>B2</sub> = 2 V、V<sub>γ1</sub> = V<sub>γ2</sub> = 0.7 V、v<sub>i</sub> = 8 sin ωt V（沒有 R<sub>2</sub>）。(a) 兩顆二極體各在什麼條件導通 (b) 各區的 v<sub>O</sub> (c) v<sub>O</sub> 的最大、最小值。</div></details>',
      hint: '先列 D<sub>1</sub>、D<sub>2</sub> 四種組合，排除「都 on」。',
      steps: [
        st('D<sub>1</sub> 剛要導通。', 'v<sub>i</sub> − 0.7 − 3 = 0 ⇒ v<sub>i</sub> &gt; 3.7 V 時 D<sub>1</sub> 通', ''),
        st('D<sub>2</sub> 剛要導通。', 'v<sub>i</sub> + 0.7 + 2 = 0 ⇒ v<sub>i</sub> &lt; −2.7 V 時 D<sub>2</sub> 通', ''),
        st('三段。', 'v<sub>i</sub> &gt; 3.7：v<sub>O</sub> = 3.7 V；v<sub>i</sub> &lt; −2.7：v<sub>O</sub> = −2.7 V；中間 v<sub>O</sub> = v<sub>i</sub>', '都 on 不可能。'),
        st('最大最小。', '最大 3.7 V、最小 −2.7 V', '峰值 8 V 兩邊都超過，所以上下都被削。')
      ],
      ans: '上限 3.7 V、下限 −2.7 V；中間 v<sub>O</sub> = v<sub>i</sub>', note: '自編練習，只用板書的公式。' },
    { id: 'c23-cl1', sec: 'clamp', kind: 'pp', no: '', tag: '自編練習', title: '箝位器：電容電壓與輸出範圍',
      q: '箝位器，v<sub>i</sub> = 5 sin ωt V，V<sub>B</sub> = 1 V，V<sub>γ</sub> = 0.7 V。求穩態 V<sub>C</sub> 與 v<sub>O</sub> 的最大、最小值。',
      en: 'A clamper has v<sub>i</sub> = 5 sin ωt V, V<sub>B</sub> = 1 V and V<sub>γ</sub> = 0.7 V. Find the steady-state V<sub>C</sub> and the maximum and minimum of v<sub>O</sub>.',
      hint: '電容在輸入峰值時被鎖住。',
      steps: [st('V<sub>C</sub>。', 'V<sub>M</sub> − V<sub>B</sub> − V<sub>γ</sub> = 5 − 1 − 0.7 = 3.3 V', ''), st('輸出。', 'v<sub>O</sub> = v<sub>i</sub> − 3.3', ''), st('最大最小。', '最大 1.7 V；最小 −10 + 1.7 = −8.3 V', '擺幅還是 10 V。')],
      ans: 'V<sub>C</sub> = 3.3 V；最大 1.7 V、最小 −8.3 V', note: '自編練習；公式為板書 v<sub>O,max</sub> = V<sub>B</sub> + V<sub>γ</sub>，v<sub>O,min</sub> = −2V<sub>M</sub> + V<sub>B</sub> + V<sub>γ</sub>。' }
  ];
  window.__CH23EX = window.__CH23EX || { book: 'Neamen', items: [] };
  window.__CH23EX.items = window.__CH23EX.items.concat(items);
})();
