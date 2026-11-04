/* ============================================================
   電子學 CH2 PART 3 觀念填充題（自編練習，不用計算）
   每一小節 8 題。正解寫在第一個，hw.js 會打亂；選項不能有標籤、底線。
   用法：<div class="hw-list" data-bank="__CH23C" data-sec="shunt"></div>
   ============================================================ */
(function () {
  'use strict';
  const P = 'ch2-part3.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  const NO = { shunt: '01', series: '02', bidir: '03', clamp: '04' };
  const sub = s => s.replace(/(^|[^A-Za-z])([A-Za-zγ])_([A-Za-z0-9γ]+)/g, '$1$2<sub>$3</sub>');
  const C = (sec, n, title, q, en, b, ex, how) =>
    items.push({ id: 'c23' + sec + '-' + n, kind: 'cf', sec, no: NO[sec] + '-' + n, how: !!how, link: P + '#' + sec, title, q: sub(q), en: sub(en), b: b.map(x => ({ o: x.o.map(t => t.replace(/_/g, '')), a: 0 })), ex });


  /* ═════════ 01 並聯截波 ═════════ */
  C('shunt', 1, '截波器做什麼', '截波器（clipper）的功能是把波形 {0}。', 'A clipper ___ the waveform.',
    [S(['超過某個電壓的部分削掉 cuts off the part beyond a level', '整個抬高 shifts it up', '放大 amplifies it', '變成直流 converts it to dc'])], '截波 = 削頭或削底。');
  C('shunt', 2, '並聯截波門檻', '並聯截波器的二極體在 v_i 大於 {0} 時導通。', 'The shunt clipper diode conducts when v_i exceeds ___.',
    [S(['V_B + V_γ', 'V_B − V_γ', 'V_γ', 'V_B'])], '輸入要推過電池加二極體。');
  C('shunt', 3, '導通時輸出', '並聯截波器導通時，v_O = {0}。', 'When the shunt diode conducts, v_O = ___.',
    [S(['V_B + V_γ', 'v_i', '0', 'v_i − V_γ'])], '二極體加電池把輸出釘住。');
  C('shunt', 4, '關閉時輸出', '二極體 OFF 時，v_O = {0}。', 'When the diode is off, v_O = ___.',
    [S(['v_i', 'V_B', '0', 'V_γ'])], '斷路，電阻沒壓降。');
  C('shunt', 5, 'V_B 變大', 'V_B 變大，被截掉的部分會 {0}。', 'A larger V_B makes the clipped part ___.',
    [S(['變少 smaller', '變多 larger', '不變 the same', '變成負的 negative'])], '門檻抬高。');
  C('shunt', 6, '輸入不夠大', '若輸入峰值小於 V_B + V_γ，輸出會 {0}。', 'If the input peak is below V_B + V_γ, the output ___.',
    [S(['等於輸入 equals the input', '全是 0 is zero', '變成直流 becomes dc', '被放大 is amplified'])], '二極體一直 OFF。');
  C('shunt', 7, '截哪一邊', '本節並聯截波器截掉的是 {0}。', 'This shunt clipper clips the ___.',
    [S(['正峰 positive peaks', '負峰 negative peaks', '兩邊都截 both peaks', '都不截 neither'])], '二極體順向對輸出的正方向。');
  C('shunt', 8, '看到什麼想到什麼', '分析截波電路的第一步是 {0}。', 'The first step in analysing a clipper is ___.',
    [S(['找出二極體開始導通的輸入電壓 find the input level at which the diode turns on', '算電容 compute the capacitance', '算頻率 compute the frequency', '畫 I-V 曲線 sketch the I-V curve'])], '先找分界點，再分兩段寫 v_O。', true);

  /* ═════════ 02 串聯截波 ═════════ */
  C('series', 1, '分界點', '板書的串聯截波器，分界點是 v_i = {0}。', 'The break point of the series clipper in the notes is v_i = ___.',
    [S(['V_B − V_γ', 'V_B + V_γ', 'V_γ', 'V_B'])], '請以老師的電路圖為準。');
  C('series', 2, '大於分界點', 'v_i 大於分界點時，v_O = {0}。', 'Above the break point, v_O = ___.',
    [S(['0', 'v_i', 'V_B', 'V_γ'])], '板書結果。');
  C('series', 3, '小於分界點', 'v_i 小於分界點時，v_O = {0}。', 'Below the break point, v_O = ___.',
    [S(['v_i − (V_B − V_γ)', 'v_i', '0', 'V_B'])], '整個輸入平移一個分界點。');
  C('series', 4, '串聯 vs 並聯', '串聯截波器的二極體與輸出的接法是 {0}。', 'In a series clipper the diode is connected ___.',
    [S(['串在訊號路徑上 in the signal path', '並在輸出旁 across the output', '接在電源旁 across the supply', '接地 to ground'])], '名稱就說明了接法。');
  C('series', 5, 'OFF 的意義', '二極體 OFF 的等效電路是 {0}。', 'The equivalent circuit of an off diode is ___.',
    [S(['斷路 an open circuit', '短路 a short circuit', '電池 a battery', '電阻 a resistor'])], 'CH1 的模型。');
  C('series', 6, 'ON 的意義', '二極體 ON 的等效電路是 {0}。', 'The equivalent circuit of an on diode (r_f = 0) is ___.',
    [S(['V_γ 電池 a V_γ battery', '斷路 an open circuit', '電阻 a resistor', '電容 a capacitor'])], '定電壓降模型。');
  C('series', 7, 'V_γ 的影響', '把 V_γ 看成 0（理想二極體）時，分界點變成 {0}。', 'With an ideal diode (V_γ = 0), the break point becomes ___.',
    [S(['V_B', '0', '−V_B', '2V_B'])], 'V_B − 0。');
  C('series', 8, '看到什麼想到什麼', '串聯截波題目的做法是 {0}。', 'To solve a series clipper, ___.',
    [S(['先找分界點，再分兩段寫 v_O find the break point, then write v_O for each region', '先算電容電壓 find the capacitor voltage first', '直接用 v_O = v_i use v_O = v_i', '用 KCL 解一階微分方程 solve a first-order ODE'])], '跟並聯同一套流程。', true);

  /* ═════════ 03 雙向截波 ═════════ */
  C('bidir', 1, '雙向', '雙向截波器同時截掉 {0}。', 'A two-way clipper clips ___.',
    [S(['正峰與負峰 both peaks', '只有正峰 only positive peaks', '只有負峰 only negative peaks', '都不截 neither'])], '上面一顆、下面一顆。');
  C('bidir', 2, '上限', '上限是 {0}。', 'The upper limit is ___.',
    [S(['V_B1 + V_γ1', 'V_B2 + V_γ2', '−(V_B2 + V_γ2)', 'V_B1'])], '');
  C('bidir', 3, '下限', '下限是 {0}。', 'The lower limit is ___.',
    [S(['−(V_B2 + V_γ2)', 'V_B2 + V_γ2', 'V_B1 + V_γ1', '0'])], '');
  C('bidir', 4, '中間', '兩顆都 OFF 時，v_O = {0}。', 'With both diodes off, v_O = ___.',
    [S(['v_i', '0', 'V_B1', '−V_B2'])], '');
  C('bidir', 5, 'R2 的作用', '加上 R_2 之後，超過上限的部分會 {0}。', 'With R_2 added, the part above the upper limit ___.',
    [S(['被 R_1、R_2 分壓，只留一部分 is divided by R_1 and R_2', '被完全截平 is cut flat', '被放大 is amplified', '變成負的 flips sign'])], '不是理想截平。');
  C('bidir', 6, '分壓比', '分壓比是 {0}。', 'The division ratio is ___.',
    [S(['R_2/(R_1 + R_2)', 'R_1/(R_1 + R_2)', 'R_1 R_2', '1/R_2'])], '');
  C('bidir', 7, 'R2 很小', 'R_2 趨近 0 時，上限那邊的輸出會 {0}。', 'As R_2 approaches 0, the output above the upper limit ___.',
    [S(['趨近理想截平 approaches flat clipping', '放大 grows', '變成 0 drops to zero', '不變 is unchanged'])], 'k = R_2/(R_1+R_2) → 0。');
  C('bidir', 8, '看到什麼想到什麼', '雙向截波題目要先判斷 {0}。', 'In a two-way clipper problem, first determine ___.',
    [S(['每顆二極體在哪個輸入範圍導通 where each diode turns on', '電容電壓 the capacitor voltage', '頻率 the frequency', '功率 the power'])], '三個區間。', true);

  /* ═════════ 04 箝位器 ═════════ */
  C('clamp', 1, '箝位器做什麼', '箝位器（clamper）把波形 {0}。', 'A clamper ___ the waveform.',
    [S(['整個上下平移，形狀不變 shifts up or down without changing its shape', '削掉頭 clips the top', '放大 amplifies', '整流成半波 half-wave rectifies'])], '直流準位改變。');
  C('clamp', 2, '用到的元件', '箝位器除了二極體，還需要 {0}。', 'Besides a diode, a clamper needs ___.',
    [S(['電容 a capacitor', '變壓器 a transformer', '電感 an inductor', '運算放大器 an op amp'])], '電容記住電壓。');
  C('clamp', 3, '電容電壓', '穩態時 V_C = {0}。', 'In steady state V_C = ___.',
    [S(['V_M − V_B − V_γ', 'V_M', 'V_B + V_γ', '2V_M'])], '');
  C('clamp', 4, '為什麼鎖住', '電容電壓之後不再變，是因為 {0}。', 'The capacitor voltage stops changing because ___.',
    [S(['二極體 OFF，電容沒有放電路徑 the diode is off and the capacitor cannot discharge', '電池把它鎖住 the battery locks it', '電阻很小 the resistor is small', '頻率很低 the frequency is low'])], '');
  C('clamp', 5, '輸出式', 'v_O = {0}。', 'v_O = ___.',
    [S(['v_i − V_C', 'v_i + V_C', 'V_C', 'v_i'])], '');
  C('clamp', 6, '最大值', '輸出最大值是 {0}。', 'The maximum output is ___.',
    [S(['V_B + V_γ', 'V_M', '2V_M', '0'])], '');
  C('clamp', 7, '最小值', '輸出最小值是 {0}。', 'The minimum output is ___.',
    [S(['−2V_M + V_B + V_γ', '−V_M', '−2V_M', 'V_B + V_γ'])], '');
  C('clamp', 8, '擺幅', '箝位後，輸出的峰對峰值 {0}。', 'After clamping, the peak-to-peak output ___.',
    [S(['不變，還是 2V_M stays 2V_M', '變成 V_M becomes V_M', '變成 0 becomes zero', '變成 4V_M becomes 4V_M'])], '只有平移。', true);

  window.__CH23C = { name: 'ch23c', items };
})();
