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
    { id: 'c23-se1', sec: 'series', kind: 'pp', no: '', tag: '自編練習', title: '串聯截波器：板書公式代數字',
      q: '串聯截波器，v<sub>i</sub> = 10 sin ωt V，V<sub>B</sub> = 4 V，V<sub>γ</sub> = 0.7 V。依板書公式求 v<sub>O</sub> 的最大、最小值。',
      en: 'A series clipper has v<sub>i</sub> = 10 sin ωt V, V<sub>B</sub> = 4 V and V<sub>γ</sub> = 0.7 V. Using the notes\' equations, find the maximum and minimum of v<sub>O</sub>.',
      hint: '分界點 V<sub>B</sub> − V<sub>γ</sub>。',
      steps: [st('分界點。', 'V<sub>B</sub> − V<sub>γ</sub> = 3.3 V', ''), st('v<sub>i</sub> &gt; 3.3 V：', 'v<sub>O</sub> = 0', ''), st('v<sub>i</sub> &lt; 3.3 V：', 'v<sub>O</sub> = v<sub>i</sub> − 3.3；最小 −13.3 V', '')],
      ans: '最大 0 V、最小 −13.3 V', note: '依板書推算，電路圖手寫不清，請確認極性。' },
    { id: 'c23-bd1', sec: 'bidir', kind: 'pp', no: 'Example 2.7', tag: 'Example 2.7（請確認數字）', title: '雙向截波器',
      q: '雙向截波器，V<sub>γ</sub> = 0，R<sub>1</sub> = R<sub>2</sub> = 10 kΩ，V<sub>B1</sub> = 2 V，V<sub>B2</sub> = 4 V，v<sub>i</sub> 峰值 6 V。求 v<sub>O</sub> 在三個區間的式子與最大、最小值。',
      en: 'A two-way clipper has V<sub>γ</sub> = 0, R<sub>1</sub> = R<sub>2</sub> = 10 kΩ, V<sub>B1</sub> = 2 V, V<sub>B2</sub> = 4 V and a 6 V peak input. Find v<sub>O</sub> in each region and its maximum and minimum.',
      hint: '上面那顆導通時 R<sub>1</sub>、R<sub>2</sub> 分壓。',
      steps: [st('中間：−4 &lt; v<sub>i</sub> &lt; 2。', 'v<sub>O</sub> = v<sub>i</sub>', '兩顆 OFF。'), st('v<sub>i</sub> &gt; 2：上面 ON。', 'v<sub>O</sub> = (v<sub>i</sub> − 2)/2 + 2 = ½v<sub>i</sub> + 1', 'R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>) = ½。'), st('v<sub>i</sub> &lt; −4：下面 ON。', 'v<sub>O</sub> = −4 V', ''), st('最大最小。', 'v<sub>O,max</sub> = ½·6 + 1 = 4 V，v<sub>O,min</sub> = −4 V', '')],
      ans: '最大 4 V、最小 −4 V', note: '板書手寫，R、V<sub>B</sub> 與峰值是我讀出來的，請確認；公式本身（分壓）已驗算。' },
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
