/* ============================================================
   電子學 CH2 PART 1 觀念填充題（自編練習，不用計算）
   每一小節 8 題。選項正解寫在第一個，hw.js 會打亂；選項不能有標籤、底線。
   用法：<div class="hw-list" data-bank="__CH21C" data-sec="psu"></div>
   ============================================================ */
(function () {
  'use strict';
  const P = 'ch2-part1.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  const NO = { psu: '01', xfmr: '02', hwr: '03', wave: '04' };
  const sub = s => s.replace(/(^|[^A-Za-z])([A-Za-zγ])_([A-Za-z0-9]+)/g, '$1$2<sub>$3</sub>');
  const C = (sec, n, title, q, en, b, ex, how) =>
    items.push({ id: 'c21' + sec + '-' + n, kind: 'cf', sec, no: NO[sec] + '-' + n, how: !!how, link: P + '#' + sec, title, q: sub(q), en: sub(en), b, ex });

  /* ═════════ 01 方塊圖 ═════════ */
  C('psu', 1, '電源供應器在做什麼', '直流電源供應器把 {0} 變成 {1}。', 'A dc power supply converts ___ into ___.',
    [S(['交流市電 the ac line', '直流電池 a dc battery', '光 light', '熱 heat']), S(['穩定的直流電壓 a steady dc voltage', '更高的交流 a higher ac voltage', '方波 a square wave', '光 light'])],
    '講義 2-2：ac to dc converter。');
  C('psu', 2, '第一級', '方塊圖的第一級是 {0}，把 110 V 降到適當的交流電壓。', 'The first block is ___, which steps the 110 V line down.',
    [S(['變壓器 the transformer', '整流電路 the rectifier', '濾波電路 the filter', '穩壓電路 the regulator'])], '講義 2-3：變壓器把市電 AC 110 V 提升或降低到適當的交流電壓。');
  C('psu', 3, '整流', '整流電路利用二極體 {0} 的特性，把交流變成 {1}。', 'The rectifier uses the diode\'s ___ to turn ac into ___.',
    [S(['單向導通 one-way conduction', '崩潰 breakdown', '電容 capacitance', '發光 light emission']), S(['脈動直流 pulsating dc', '平穩直流 smooth dc', '更大的交流 larger ac', '方波 a square wave'])], '講義 2-3。');
  C('psu', 4, '濾波', '濾波電路通常是在整流器輸出端加一顆 {0}，讓輸出比較 {1}。', 'A filter usually adds ___ at the rectifier output to make it ___.',
    [S(['電容 a capacitor', '電阻 a resistor', '二極體 a diode', '變壓器 a transformer']), S(['平穩 smoother', '更大 larger', '更快 faster', '交流 more ac'])], '講義 2-3：電容儲存電荷，在交流波動期間提供平穩的輸出。');
  C('psu', 5, '7805', '7805 是一種 {0}，輸出 {1}。', 'The 7805 is a ___ with an output of ___.',
    [S(['線性穩壓 IC linear regulator IC', '整流二極體 rectifier diode', '變壓器 transformer', '濾波電容 filter capacitor']), S(['5 V', '7.8 V', '110 V', '0.7 V'])], '講義 2-3：具回授控制，把輸入穩定調整為 5 V。');
  C('psu', 6, '屬於二極體電路的', '方塊圖中屬於「二極體電路」的是 {0}。', 'In the block diagram, the diode circuits are ___.',
    [S(['整流、濾波、穩壓 rectifier, filter and regulator', '只有變壓器 only the transformer', '只有負載 only the load', '變壓器和負載 transformer and load'])], '講義 2-2：The diode rectifier, filter, and voltage regulator are diode circuits.');
  C('psu', 7, '整流的兩種', '二極體整流電路分成 {0}。', 'Diode rectifiers are classified as ___.',
    [S(['半波整流與全波整流 half-wave and full-wave', '升壓與降壓 step-up and step-down', '順偏與逆偏 forward and reverse', '線性與非線性 linear and nonlinear'])], '講義 2-2。這一份講義先講半波。');
  C('psu', 8, '看波形認方塊', '看到「一顆一顆駝峰、都在零以上」的波形，它是 {0} 的輸出。', 'A waveform of humps that are all above zero is the output of ___.',
    [S(['整流電路 the rectifier', '變壓器 the transformer', '穩壓電路 the regulator', '市電 the line'])], '脈動直流 = 整流後、還沒濾波。', true);

  /* ═════════ 02 變壓器 ═════════ */
  C('xfmr', 1, '匝數比', '變壓器 v_S/v_I = {0}。', 'For a transformer, v_S/v_I = ___.',
    [S(['N2/N1', 'N1/N2', 'N1·N2', '1'])], '講義 2-5：電壓跟圈數成正比。');
  C('xfmr', 2, '一次側', '接市電的那一邊叫 {0}。', 'The side connected to the line is the ___.',
    [S(['一次側 primary', '二次側 secondary', '負載側 load side', '接地側 ground side'])], '講義 2-5：一次側 v<sub>I</sub> 為 110 V/60 Hz 的市電。');
  C('xfmr', 3, '降壓', 'N1 > N2 的變壓器是 {0} 變壓器。', 'A transformer with N1 > N2 is a ___ transformer.',
    [S(['降壓 step-down', '升壓 step-up', '隔離（1:1）isolation', '整流 rectifying'])], '二次側圈數少 → 電壓小。');
  C('xfmr', 4, '市電規格', '台灣市電是 {0}。', 'The household line in Taiwan is ___.',
    [S(['110 V（rms）、60 Hz', '110 V 峰值、50 Hz', '220 V 直流', '5 V 直流'])], '講義 2-5。峰值 110√2 ≈ 155.6 V。');
  C('xfmr', 5, 'rms 和峰值', '110 V 是 {0}，它的峰值約 {1}。', '110 V is the ___ value; its peak is about ___.',
    [S(['有效值 rms', '峰值 peak', '平均值 average', '峰對峰 peak-to-peak']), S(['155.6 V', '110 V', '77.8 V', '220 V'])], '弦波峰值 = rms × √2。', true);
  C('xfmr', 6, '匝數比的名稱', 'N1/N2 叫做 {0}。', 'N1/N2 is called the ___.',
    [S(['匝數比 turns ratio', '增益 gain', '漣波 ripple', '工作週期 duty cycle'])], '講義 2-5：transformer turn ratio。');
  C('xfmr', 7, '算匝數比', '要從 110 V（rms）得到 11 V（rms），匝數比 N1:N2 = {0}。', 'To get 11 V (rms) from 110 V (rms), N1:N2 = ___.',
    [S(['10 : 1', '1 : 10', '110 : 1', '1 : 1'])], '電壓比 = 匝數比：110/11 = 10。', true);
  C('xfmr', 8, '頻率', '變壓器改變的是電壓大小，{0}。', 'A transformer changes the voltage magnitude but ___.',
    [S(['頻率不變（還是 60 Hz 交流）the frequency stays 60 Hz', '把交流變直流 turns ac into dc', '把頻率加倍 doubles the frequency', '輸出方波 outputs a square wave'])], '二次側還是交流，要靠整流才變單向。');

  /* ═════════ 03 半波整流三種情況 ═════════ */
  C('hwr', 1, '情況 1', 'v_S < 0 時，二極體 {0}，v_O = {1}。', 'When v_S < 0, the diode is ___ and v_O = ___.',
    [S(['OFF', 'ON', '崩潰 in breakdown', '短路 shorted']), S(['0', 'v_S', 'v_S − Vγ', 'Vγ'].map(x => x.replace('_', '')))], '講義 2-6 情況 1：逆偏 → I<sub>D</sub> = 0。');
  C('hwr', 2, '情況 2', '0 < v_S < Vγ 時，二極體 {0}。', 'When 0 < v_S < Vγ, the diode is ___.',
    [S(['OFF（推不開門）off', 'ON', '崩潰 in breakdown', '一半導通 half on'])], '講義 2-6 情況 2：正的但不到 V<sub>γ</sub>。');
  C('hwr', 3, '情況 3', 'v_S > Vγ 時，二極體 ON，v_D = {0}，v_O = {1}。', 'When v_S > Vγ, the diode is on, v_D = ___ and v_O = ___.',
    [S(['Vγ', '0', 'vS', 'vO']), S(['vS − Vγ', 'vS', 'Vγ', '0'])], '講義 2-6 情況 3：i<sub>D</sub> = (v<sub>S</sub> − V<sub>γ</sub>)/R。');
  C('hwr', 4, 'OFF 時 v_D', '二極體 OFF 時，v_D = {0}。', 'When the diode is off, v_D = ___.',
    [S(['vS（整個輸入都在二極體上）vS', '0', 'Vγ', 'vO'])], '沒電流 → 電阻沒壓降 → KVL：v<sub>D</sub> = v<sub>S</sub>（講義 2-6 紅字）。');
  C('hwr', 5, 'VTC 的斜率', '轉移特性（VTC）在 v_S > Vγ 的斜率是 {0}。', 'The VTC slope for v_S > Vγ is ___.',
    [S(['1', '0', '無限大 infinite', 'R'])], 'v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>（Fig 2.2(b) Slope = 1）。');
  C('hwr', 6, 'VTC 是什麼', '電壓轉移特性（VTC）是 {0} 的關係圖。', 'The voltage transfer characteristic plots ___.',
    [S(['輸出 vO 對輸入 vS output vs input', '電流對電壓 current vs voltage', '電壓對時間 voltage vs time', '功率對頻率 power vs frequency'])], 'Fig 2.2(b)：橫軸 v<sub>S</sub>、縱軸 v<sub>O</sub>。');
  C('hwr', 7, 'VTC 的轉折點', 'VTC 從水平轉成斜線的地方在 v_S = {0}。', 'The VTC breaks from flat to sloped at v_S = ___.',
    [S(['Vγ', '0', 'VM', 'R'])], '前面兩種情況 v<sub>O</sub> 都是 0，超過 V<sub>γ</sub> 才往上。');
  C('hwr', 8, '解題流程', '分析半波整流的第一步：把二極體換成 {0}，再依 v_S 分情況。', 'First step in analyzing the rectifier: replace the diode with ___ and split into cases by v_S.',
    [S(['等效模型（rf = 0：Vγ 電池或斷路）its equivalent model', '電容 a capacitor', '電感 an inductor', '電流源 a current source'])], '講義 2-6 NOTE：加入二極體等效模型分析電路。', true);

  /* ═════════ 04 波形 ═════════ */
  C('wave', 1, '兩種方法', '從輸入畫輸出有兩種方法：(1) 根據分析公式；(2) 利用 {0}。', 'Two ways to get the output: (1) the analysis formulas; (2) the ___.',
    [S(['電壓轉移特性曲線 VTC', '負載線 load line', '頻率響應 frequency response', '相量圖 phasor diagram'])], '講義 2-7。');
  C('wave', 2, 'v_O 的形狀', '弦波輸入時，v_O 是 {0}。', 'With a sinusoidal input, v_O is ___.',
    [S(['只剩正半週、比輸入矮 Vγ 的駝峰 humps lower than the input by Vγ', '跟輸入一模一樣 identical to the input', '只剩負半週 only negative half-cycles', '一條水平線 a flat line'])], 'Fig 2.3(b)。');
  C('wave', 3, 'v_D 的關係', '任何時刻 v_D = {0}。', 'At any instant, v_D = ___.',
    [S(['vS − vO', 'vO − vS', 'vS + vO', 'Vγ'])], '講義 2-7 Note：KVL。');
  C('wave', 4, 'ON 時的 v_D', '二極體導通時，v_D 波形 {0}。', 'While the diode conducts, the v_D waveform ___.',
    [S(['平平地卡在 Vγ stays flat at Vγ', '跟著 vS 走 follows vS', '是 0 is zero', '是 −VM is −VM'])], 'Fig 2.3(c) 上面那段平的。');
  C('wave', 5, '負半週的 v_D', '負半週時 v_D {0}，谷底是 {1}。', 'In the negative half-cycle, v_D ___ and its minimum is ___.',
    [S(['跟著 vS 走 follows vS', '卡在 Vγ stays at Vγ', '是 0 is zero', '是 vO equals vO']), S(['−VM', '−Vγ', '0', '−2VM'])], '二極體 OFF，整個輸入都在它身上。');
  C('wave', 6, 'PIV', '半波整流（電阻負載）二極體的 PIV 至少要大於 {0}。', 'The diode PIV in a half-wave rectifier (resistive load) must exceed ___.',
    [S(['VM（輸入峰值）the input peak VM', 'Vγ', 'VM − Vγ', 'VM/2'])], 'CH1 PART 5：最大逆壓 &lt; PIV 才安全。', true);
  C('wave', 7, '負半週的輸出', '半波整流在負半週時，v_O = {0}。', 'In the negative half-cycle of a half-wave rectifier, v_O = ___.',
    [S(['0', 'vS', 'vS − Vγ', '−VM'])], '二極體逆偏 OFF，沒有電流，電阻上沒有壓降（講義 2-4 Summary）。');
  C('wave', 8, '方法二怎麼做', '用 VTC 畫波形：把每個時刻的 vS 在橫軸找到，{0}。', 'Using the VTC: locate each instant\'s vS on the horizontal axis and ___.',
    [S(['往上碰到 VTC 曲線，讀縱軸的 vO go up to the VTC and read vO', '讀斜率 read the slope', '取平均 take the average', '乘以 R multiply by R'])], '講義 2-7 的「方法二」箭頭：投影。', true);

  window.__CH21C = { name: 'ch21c', items };
})();
