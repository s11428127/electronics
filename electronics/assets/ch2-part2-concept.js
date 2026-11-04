/* ============================================================
   電子學 CH2 PART 2 觀念填充題（自編練習，不用計算）
   每一小節 8 題。正解寫在第一個，hw.js 會打亂；選項不能有標籤、底線。
   用法：<div class="hw-list" data-bank="__CH22C" data-sec="chg"></div>
   ============================================================ */
(function () {
  'use strict';
  const P = 'ch2-part2.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  const NO = { chg: '01', fwc: '02', brg: '03', cmp: '04' };
  const sub = s => s.replace(/(^|[^A-Za-z])([A-Za-zγ])_([A-Za-z0-9γ]+)/g, '$1$2<sub>$3</sub>');
  const C = (sec, n, title, q, en, b, ex, how) =>
    items.push({ id: 'c22' + sec + '-' + n, kind: 'cf', sec, no: NO[sec] + '-' + n, how: !!how, link: P + '#' + sec, title, q: sub(q), en: sub(en), b: b.map(x => ({ o: x.o.map(t => t.replace(/_/g, '')), a: 0 })), ex });

  /* ═════════ 01 電池充電器 ═════════ */
  C('chg', 1, '導通條件', '電池充電器的二極體要在 {0} 時才導通。', 'The charger diode conducts only when ___.',
    [S(['v_S 大於 V_B + V_γ v_S exceeds V_B + V_γ', 'v_S 大於 V_γ v_S exceeds V_γ', 'v_S 大於 0 v_S exceeds 0', 'v_S 小於 V_B v_S is below V_B'])], '要同時推開二極體和電池。');
  C('chg', 2, '電流公式', '導通時 i_D = {0}。', 'When conducting, i_D = ___.',
    [S(['(v_S − V_γ − V_B)/R', '(v_S − V_γ)/R', '(v_S + V_B)/R', 'v_S/R'])], '電阻分到的是 v_S 減掉二極體與電池的壓降。');
  C('chg', 3, '電池越大', '電池 V_B 越大，二極體導通的時間會 {0}。', 'A larger V_B makes the diode conduct for a ___ time.',
    [S(['越短 shorter', '越長 longer', '不變 the same', '變成永遠導通 forever'])], '門檻 V_B + V_γ 變高，越晚通、越早關。');
  C('chg', 4, '最大電流在哪', '最大電流發生在 {0}。', 'The peak current occurs when ___.',
    [S(['v_S 到峰值 V_M v_S is at its peak V_M', 'v_S 過零 v_S crosses zero', 'v_S 最負 v_S is most negative', '剛開始導通 conduction just starts'])], '剛導通時 i_D = 0。');
  C('chg', 5, '導通角對稱', '導通結束角 ωt_2 與起始角 ωt_1 的關係是 {0}。', 'The end angle ωt_2 relates to ωt_1 by ___.',
    [S(['ωt_2 = 180° − ωt_1', 'ωt_2 = ωt_1 + 180°', 'ωt_2 = 360° − ωt_1', 'ωt_2 = 2ωt_1'])], 'sin 在 90° 左右對稱。');
  C('chg', 6, 'PIV', '電池充電器二極體的 PIV 是 {0}。', 'The PIV of the charger diode is ___.',
    [S(['V_B + V_M', 'V_M', 'V_M − V_B', 'V_B'])], '負半週：電源 −V_M 加上電池 +V_B。');
  C('chg', 7, '百分比', '導通時間佔一週期的百分比是 {0}。', 'The fraction of the cycle the diode conducts is ___.',
    [S(['(ωt_2 − ωt_1)/360°', 'ωt_1/360°', '50%', 'V_B/V_M'])], 'Example 2.1：32.4 %。');
  C('chg', 8, '看到什麼想到什麼', '若 V_M 小於 V_B + V_γ，電池會 {0}。', 'If V_M is below V_B + V_γ, the battery ___.',
    [S(['完全充不到電 gets no charge', '充得更快 charges faster', '放電更快 discharges faster', '燒掉 burns out'])], '二極體整個週期都不通。', true);

  /* ═════════ 02 中間抽頭 ═════════ */
  C('fwc', 1, '輸出式', '中間抽頭全波整流 v_O = {0}。', 'For a center-tapped full-wave rectifier, v_O = ___.',
    [S(['|v_S| − V_γ', '|v_S| − 2V_γ', 'v_S − V_γ', '|v_S|'])], '每瞬間只有一顆二極體導通。');
  C('fwc', 2, '導通順序', '中間抽頭電路中，正半週與負半週 {0}。', 'In the center-tapped circuit, the two half-cycles use ___.',
    [S(['由不同的二極體導通 different diodes', '由同一顆二極體導通 the same diode', '兩顆同時導通 both diodes at once', '都不導通 no diode'])], '上半邊與下半邊輪流。');
  C('fwc', 3, '死區', '中間抽頭的死區是 {0}。', 'The dead zone of the center-tapped rectifier is ___.',
    [S(['|v_S| 小於 V_γ |v_S| below V_γ', '|v_S| 小於 2V_γ |v_S| below 2V_γ', '沒有死區 none', '|v_S| 大於 V_γ |v_S| above V_γ'])], '兩顆都還推不開。');
  C('fwc', 4, 'PIV', '中間抽頭每顆二極體的 PIV 是 {0}。', 'The PIV of each diode is ___.',
    [S(['2V_m − V_γ', 'V_m − V_γ', 'V_m', 'V_γ'])], '關著的邊 −V_m，導通邊輸出 V_m − V_γ。');
  C('fwc', 5, '頻率', '全波整流輸出的頻率是輸入的 {0}。', 'The output frequency is ___ the input frequency.',
    [S(['2 倍 twice', '1 倍 the same as', '一半 half of', '4 倍 four times'])], '負半週翻正，每週期兩顆駝峰。');
  C('fwc', 6, '峰值', '輸出峰值 V_O,peak = {0}。', 'The peak output is ___.',
    [S(['V_m − V_γ', 'V_m − 2V_γ', 'V_m', '2V_m − V_γ'])], '只扣一個 V_γ。');
  C('fwc', 7, '次級線圈', '中間抽頭電路的次級線圈需要 {0}。', 'The center-tapped secondary needs ___.',
    [S(['從中間引出一個抽頭 a tap at its center', '兩顆變壓器 two transformers', '四顆二極體 four diodes', '一顆電池 a battery'])], '抽頭接地，上下各一半。');
  C('fwc', 8, '與半波比', '相比半波整流，中間抽頭全波整流的優點是 {0}。', 'Compared with half-wave, the full-wave rectifier ___.',
    [S(['負半週也有輸出 uses both half-cycles', '不需要二極體 needs no diode', '沒有 V_γ 損失 has no V_γ loss', 'PIV 更小 has a lower PIV'])], '輸出的脈動頻率變兩倍，比較好濾。', true);

  /* ═════════ 03 橋式 ═════════ */
  C('brg', 1, '輸出式', '橋式全波整流 v_O = {0}。', 'For a bridge full-wave rectifier, v_O = ___.',
    [S(['|v_S| − 2V_γ', '|v_S| − V_γ', '|v_S| − 4V_γ', '|v_S|'])], '電流一進一出，經過兩顆。');
  C('brg', 2, '二極體數', '橋式整流需要 {0}。', 'A bridge rectifier needs ___.',
    [S(['4 顆二極體 four diodes', '2 顆二極體 two diodes', '1 顆二極體 one diode', '8 顆二極體 eight diodes'])], '四顆接成橋。');
  C('brg', 3, '死區', '橋式的死區是 {0}。', 'The bridge dead zone is ___.',
    [S(['|v_S| 小於 2V_γ |v_S| below 2V_γ', '|v_S| 小於 V_γ |v_S| below V_γ', '沒有 none', '|v_S| 大於 2V_γ |v_S| above 2V_γ'])], '要爬過兩個 V_γ。');
  C('brg', 4, 'PIV', '橋式每顆二極體的 PIV 是 {0}。', 'The bridge diode PIV is ___.',
    [S(['V_m − V_γ', '2V_m − V_γ', '2V_m', 'V_m − 2V_γ'])], '比中間抽頭小約一半。');
  C('brg', 5, '次級線圈', '同樣輸出下，橋式的次級圈數只要中間抽頭的 {0}。', 'For the same output, the bridge needs ___ of the secondary turns.',
    [S(['一半 half', '兩倍 twice', '三倍 three times', '一樣 the same'])], '中間抽頭只用到一半線圈，橋式整個次級都用到。');
  C('brg', 6, '導通路徑', '正半週時，橋式的電流路徑經過 {0}。', 'During the positive half-cycle, the current passes through ___.',
    [S(['兩顆二極體 two diodes', '一顆二極體 one diode', '四顆二極體 all four diodes', '沒有二極體 no diode'])], '一顆在進、一顆在出。');
  C('brg', 7, '峰值', '橋式輸出峰值 = {0}。', 'The peak bridge output is ___.',
    [S(['V_m − 2V_γ', 'V_m − V_γ', 'V_m', '2V_m − V_γ'])], '多吃一個 V_γ。');
  C('brg', 8, '缺點', '橋式相較中間抽頭，缺點是 {0}。', 'A drawback of the bridge versus the center-tapped circuit is ___.',
    [S(['多一個 V_γ 壓降、要 4 顆二極體 an extra V_γ drop and four diodes', 'PIV 較大 a larger PIV', '需要抽頭 a center tap', '輸出頻率較低 a lower output frequency'])], '低壓輸出時多的 V_γ 比例明顯。', true);

  /* ═════════ 04 比較與設計 ═════════ */
  C('cmp', 1, '設計第一步', '設計整流器，要先把 {0} 加上導通路徑的 V_γ，得到次級峰值。', 'To design, add the conduction-path V_γ to ___ to get the secondary peak.',
    [S(['想要的輸出峰值 the required peak output', '市電 rms the line rms', 'PIV the PIV', '匝數比 the turns ratio'])], '次級峰值 = 輸出峰值 + 損失。');
  C('cmp', 2, '中間抽頭次級', '想要 V_O 峰值，中間抽頭每半邊次級峰值要 {0}。', 'For a peak output V_O, each half of the center-tapped secondary needs a peak of ___.',
    [S(['V_O + V_γ', 'V_O + 2V_γ', 'V_O', '2V_O'])], '導通路徑一顆。');
  C('cmp', 3, '橋式次級', '想要 V_O 峰值，橋式的次級峰值要 {0}。', 'For a peak output V_O, the bridge secondary needs a peak of ___.',
    [S(['V_O + 2V_γ', 'V_O + V_γ', 'V_O', '2V_O'])], '導通路徑兩顆。');
  C('cmp', 4, '匝數比', '匝數比 N1/N2 = {0}。', 'The turns ratio N1/N2 = ___.',
    [S(['一次側峰值 ÷ 二次側峰值 primary peak ÷ secondary peak', '二次側 rms ÷ 一次側峰值 secondary rms ÷ primary peak', 'PIV ÷ V_γ PIV ÷ V_γ', '輸出 ÷ 輸入 rms output ÷ input rms'])], '同單位相比。');
  C('cmp', 5, 'rms 與峰值', '正弦波的 rms = {0}。', 'The rms value of a sine wave = ___.',
    [S(['峰值 ÷ √2 peak ÷ √2', '峰值 × √2 peak × √2', '峰值 ÷ 2 peak ÷ 2', '峰值 peak'])], '120 V rms 的峰值是 169.7 V。');
  C('cmp', 6, '選擇一', '為了讓二極體的耐壓要求低，應選 {0}。', 'To lower the diode voltage rating, choose ___.',
    [S(['橋式 bridge', '中間抽頭 center-tapped', '半波 half-wave', '都一樣 either one'])], '橋式 PIV 約一半。');
  C('cmp', 7, '選擇二', '為了少用二極體、而且負載電壓夠高，可以選 {0}。', 'To use fewer diodes, you can choose ___.',
    [S(['中間抽頭 center-tapped', '橋式 bridge', '兩個都不行 neither', '兩個一樣多 both use the same'])], '中間抽頭只要 2 顆，缺點是 PIV 較高、次級要抽頭。');
  C('cmp', 8, '看到什麼想到什麼', '題目要「算變壓器次級」時，第一個動作是 {0}。', 'To size the transformer secondary, the first step is ___.',
    [S(['判斷電流路徑經過幾顆二極體 count the diodes in the current path', '先算 PIV compute the PIV first', '先畫波形 draw the waveform first', '先算頻率 find the frequency'])], '幾顆決定扣幾個 V_γ。', true);

  window.__CH22C = { name: 'ch22c', items };
})();
