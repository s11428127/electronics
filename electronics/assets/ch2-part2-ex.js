/* ============================================================
   電子學 CH2 PART 2 —— 例題與練習（Neamen Example 2.1、2.2 ＋ 自編練習）
   數值都用程式驗算過（見 docs/CONTENT_MAP.md）
   ============================================================ */
(function () {
  'use strict';
  const st = (t, eq, why) => ({ t, eq, why });
  const items = [
    { id: 'c22-chg1', sec: 'chg', kind: 'pp', no: 'Example 2.1', tag: 'Example 2.1', title: '電池充電器：最大電流、導通角、百分比、PIV',
      q: '圖中半波整流給電池充電：v<sub>S</sub> = 24 sin ωt V，電池 V<sub>B</sub> = 12 V，R = 100 Ω，二極體 V<sub>γ</sub> = 0.6 V。求 (a) 最大電流；(b) 二極體導通的 ωt 範圍；(c) 導通時間佔一週期百分比；(d) PIV。',
      en: 'In the battery-charger circuit, v<sub>S</sub> = 24 sin ωt V, V<sub>B</sub> = 12 V, R = 100 Ω and V<sub>γ</sub> = 0.6 V. Determine (a) the peak diode current, (b) the range of ωt over which the diode conducts, (c) the percentage of each cycle the diode conducts, (d) the PIV.',
      hint: '先寫導通條件 v<sub>S</sub> &gt; V<sub>B</sub> + V<sub>γ</sub>。',
      steps: [
        st('(a) 最大電流發生在 v<sub>S</sub> = V<sub>M</sub>。', 'i<sub>D,max</sub> = (24 − 0.6 − 12)/100 = 0.114 A = 114 mA', '電壓夠大時，電阻上分到 V<sub>M</sub> − V<sub>γ</sub> − V<sub>B</sub>。'),
        st('(b) 剛好導通的瞬間：v<sub>S</sub> = V<sub>B</sub> + V<sub>γ</sub>。', '24 sin ωt<sub>1</sub> = 12.6 ⇒ ωt<sub>1</sub> = sin<sup>−1</sup>(0.525) = 31.7°', '剛好導通時 i<sub>D</sub> = 0，所以電阻沒壓降。'),
        st('(b) 結束角對稱。', 'ωt<sub>2</sub> = 180° − 31.7° = 148.3°', 'sin 在 90° 左右對稱。'),
        st('(c) 百分比。', '(148.3° − 31.7°)/360° = 0.324 ⇒ 32.4 %', '一個週期 360°。'),
        st('(d) PIV 出現在負半週谷底。', 'PIV = V<sub>B</sub> + V<sub>M</sub> = 12 + 24 = 36 V', '電源 −24 V，電池 +12 V，二極體扛兩者之差的大小。')
      ],
      ans: '(a) 114 mA (b) 31.7°～148.3° (c) 32.4 % (d) 36 V',
      note: '課本原題，數值與課本一致（板書 Example 2.1）。' },
    { id: 'c22-chg2', sec: 'chg', kind: 'pp', no: '', tag: '自編練習', title: '電池換成 6 V，導通變長還是變短？',
      q: '同 Example 2.1，但電池改成 V<sub>B</sub> = 6 V。求導通角範圍與百分比，並說明跟 12 V 比誰導通比較久。',
      en: 'Repeat Example 2.1 with V<sub>B</sub> = 6 V. Find the conduction range and percentage, and compare with the 12 V case.',
      hint: '門檻變成 6 + 0.6 = 6.6 V。',
      steps: [
        st('門檻。', 'V<sub>B</sub> + V<sub>γ</sub> = 6.6 V', ''),
        st('起始角。', 'ωt<sub>1</sub> = sin<sup>−1</sup>(6.6/24) = 15.96°', ''),
        st('結束角與百分比。', 'ωt<sub>2</sub> = 164.04°，(164.04 − 15.96)/360 = 41.1 %', ''),
        st('比較。', '41.1 % &gt; 32.4 %', '電池電壓越低，門檻越低，二極體越早通、越晚關。')
      ],
      ans: '15.96°～164.04°，41.1 %（比 12 V 的 32.4 % 長）', note: '自編練習，程式驗算。' },
    { id: 'c22-fwc1', sec: 'fwc', kind: 'pp', no: '', tag: '自編練習', title: '中間抽頭：輸出峰值、PIV、死區',
      q: '中間抽頭全波整流，上下每半邊次級峰值都是 15 V，V<sub>γ</sub> = 0.7 V。求 v<sub>O</sub> 峰值、每顆二極體 PIV，以及輸出為 0 的 |v<sub>S</sub>| 範圍。',
      en: 'A center-tapped full-wave rectifier has 15 V peak on each half of the secondary and V<sub>γ</sub> = 0.7 V. Find the peak output, the diode PIV, and the range of |v<sub>S</sub>| where the output is zero.',
      hint: '每個瞬間只有一顆通：輸出 = |v<sub>S</sub>| − V<sub>γ</sub>。',
      steps: [
        st('輸出峰值。', 'V<sub>O,peak</sub> = 15 − 0.7 = 14.3 V', '只扣 1 個 V<sub>γ</sub>。'),
        st('PIV。', 'PIV = 2V<sub>m</sub> − V<sub>γ</sub> = 30 − 0.7 = 29.3 V', ''),
        st('死區。', '|v<sub>S</sub>| &lt; 0.7 V', '還沒爬過 V<sub>γ</sub> 時兩顆都不通。')
      ],
      ans: '14.3 V；PIV 29.3 V；死區 |v<sub>S</sub>| &lt; 0.7 V', note: '自編練習，公式為板書 PIV = 2V<sub>m</sub> − V<sub>γ</sub>。' },
    { id: 'c22-brg1', sec: 'brg', kind: 'pp', no: '', tag: '自編練習', title: '橋式：輸出峰值、PIV、死區',
      q: '橋式全波整流，次級峰值 15 V，V<sub>γ</sub> = 0.7 V。求 v<sub>O</sub> 峰值、每顆二極體 PIV，以及死區範圍。',
      en: 'A bridge full-wave rectifier has a 15 V secondary peak and V<sub>γ</sub> = 0.7 V. Find the peak output, the diode PIV, and the dead zone.',
      hint: '電流經過兩顆二極體。',
      steps: [
        st('輸出峰值。', 'V<sub>O,peak</sub> = 15 − 2(0.7) = 13.6 V', '一進一出，扣 2 個 V<sub>γ</sub>。'),
        st('PIV。', 'PIV = V<sub>m</sub> − V<sub>γ</sub> = 14.3 V', ''),
        st('死區。', '|v<sub>S</sub>| &lt; 1.4 V', '')
      ],
      ans: '13.6 V；PIV 14.3 V；死區 |v<sub>S</sub>| &lt; 1.4 V', note: '自編練習，公式為板書。' },
    { id: 'c22-cmp1', sec: 'cmp', kind: 'pp', no: 'Example 2.2', tag: 'Example 2.2', title: '中間抽頭與橋式：次級電壓、匝數比、PIV',
      q: '市電 120 V（rms），要整流出峰值 9 V 的輸出，V<sub>γ</sub> = 0.7 V。分別用中間抽頭與橋式全波整流，求 (a) 次級最大電壓；(b) 次級 rms；(c) 匝數比 N<sub>1</sub>/N<sub>2</sub>；(d) 每顆二極體 PIV。',
      en: 'The line voltage is 120 V (rms) and a 9 V peak output is needed with V<sub>γ</sub> = 0.7 V. For a center-tapped and a bridge full-wave rectifier, find (a) the maximum secondary voltage, (b) its rms value, (c) the turns ratio N<sub>1</sub>/N<sub>2</sub>, (d) the PIV of each diode.',
      hint: '中間抽頭扣 1 個 V<sub>γ</sub>，橋式扣 2 個。',
      steps: [
        st('(a) 次級最大電壓。', '中間抽頭：9 + 0.7 = 9.7 V　橋式：9 + 1.4 = 10.4 V', ''),
        st('(b) rms。', '9.7/√2 = 6.86 V　10.4/√2 = 7.35 V', '峰值 ÷ √2。'),
        st('(c) 匝數比。', '120√2 = 169.7 V；169.7/9.7 = 17.5　169.7/10.4 = 16.3', '一次側峰值 ÷ 二次側峰值。'),
        st('(d) PIV。', '中間抽頭：2(9.7) − 0.7 = 18.7 V　橋式：10.4 − 0.7 = 9.7 V', '橋式約一半。')
      ],
      ans: '中間抽頭：9.7 V、6.86 V、17.5、18.7 V；橋式：10.4 V、7.35 V、16.3、9.7 V', note: '課本原題，數值與板書表格一致。' }
  ];
  window.__CH22EX = window.__CH22EX || { book: 'Neamen', items: [] };
  window.__CH22EX.items = window.__CH22EX.items.concat(items);
})();
