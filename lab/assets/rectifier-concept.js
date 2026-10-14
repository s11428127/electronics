/* ============================================================
   電子實習 第四章 整流器 — 觀念填充（自編練習，不用計算）
   三組各 8 題：原理（p.2–4）、整流電路（p.3、p.5–8）、實驗（課堂＋PSpice）
   選項正解寫第一個，hw.js 會打亂；選項不能有 <sub>／底線（S() 會自動拿掉底線）。
   ============================================================ */
(function () {
  'use strict';
  const S = o => ({ o: o.map(x => x.replace(/_/g, '')), a: 0 });
  const sub = t => t.replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>');
  const items = [];
  const K = (sec, n, link, title, q, en, b, ex, how) =>
    items.push({ id: 'rc-' + ({ '原理': 'a', '整流': 'b', '實驗': 'c' })[sec] + n, kind: 'cf', sec, no: sec + '-' + n, how: !!how, link, title: sub(title), q: sub(q), en: sub(en), b, ex: sub(ex) });
  const LA = 'rectifier.html#why', LB = 'rectifier.html#half', LF = 'rectifier.html#full', LC = 'rectifier.html#exp';

  K('原理', 1, LA, '整流器做什麼', '整流器把 {0} 轉成 {1}。', 'A rectifier converts ___ into ___.',
    [S(['交流電 AC', '直流電 DC', '光 light', '熱 heat']), S(['直流電 DC', '交流電 AC', '高頻 high frequency', '聲音 sound'])], '講義 p.2。利用的是二極體單向導電。');
  K('原理', 2, LA, '電源供應器的順序', '直流電源供應器的順序是：變壓器 → {0} → {1} → 穩壓。', 'A DC power supply goes: transformer → ___ → ___ → regulator.',
    [S(['整流 rectifier', '濾波 filter', '放大 amplifier', '穩壓 regulator']), S(['濾波 filter', '整流 rectifier', '放大 amplifier', '振盪 oscillator'])], '整流把負的翻掉或砍掉，濾波把駝峰填平，穩壓再把剩下的起伏壓住（下一章、第六章）。');
  K('原理', 3, LA, 'V_pp', 'V_pp 是 {0}，等於 {1}。', 'V_pp is the ___ and equals ___.',
    [S(['峰對峰值 peak-to-peak', '峰值 peak', '有效值 rms', '平均值 average']), S(['2V_m', 'V_m', '√2 V_m', 'V_m/2'])], '講義 p.4：從最低點量到最高點，所以是兩倍峰值。');
  K('原理', 4, LA, '有效值', '市電標示的 AC 110 V 是 {0}；三用電表 {1} 量到的也是它。', 'The 110 V on AC mains is the ___; the meter shows it on the ___ range.',
    [S(['有效值 rms value', '峰值 peak value', '平均值 average', '峰對峰值 peak-to-peak']), S(['AC 檔 AC', 'DC 檔 DC', 'Ω 檔 ohms', '電流檔 current'])], '講義 p.4。有效值＝「跟多少直流一樣熱」。');
  K('原理', 5, LA, '平均值', '三用電表 {0} 量到的是平均值；完整正弦波的平均值是 {1}。', 'The meter’s ___ range reads the average; a full sine wave averages to ___.',
    [S(['DC 檔 DC', 'AC 檔 AC', 'Ω 檔 ohms', 'Hz 檔 frequency']), S(['0', 'V_m', 'V_m/π', 'V_rms'])], '上半跟下半面積一樣，加起來抵消。整流的目的就是讓平均不再是 0。');
  K('原理', 6, LA, 'V_m 與 V_rms', '正弦波 V_m = {0} × V_rms。', 'For a sine wave, V_m = ___ × V_rms.',
    [S(['√2（約 1.414）', '2', 'π', '1/√2'])], '110 V 市電的峰值其實是 156 V。');
  K('原理', 7, LA, '講義的問題', '正弦波 V_pp = {0} V_rms。', 'For a sine wave, V_pp = ___ V_rms.',
    [S(['2√2（約 2.83）', '√2', '2', 'π/2'])], 'V_pp = 2V_m = 2√2 V_rms。你 10 Vpp → 3.54 V_rms。', true);
  K('原理', 8, LA, '攤平', '平均值可以想成把波形 {0} 之後的高度。', 'The average is the height after ___ the waveform.',
    [S(['攤平（面積不變）flattening it, keeping the area', '放大兩倍 doubling it', '只看最高點 taking the peak', '轉 90 度 rotating it'])], '面積 ÷ 週期 = 平均。半波只剩一個駝峰，攤平後只有 0.318 V_m。');

  K('整流', 1, LB, '半波的二極體', '半波整流在正半週二極體 {0}，負半週 {1}。', 'In a half-wave rectifier the diode is ___ in the positive half and ___ in the negative half.',
    [S(['順偏導通 forward biased, on', '逆偏截止 reverse biased, off', '崩潰 in breakdown', '短路燒掉 burned']), S(['逆偏截止 reverse biased, off', '順偏導通 forward biased, on', '崩潰 in breakdown', '半導通 half on'])], '講義 p.3：正半週形同短路、負半週形同斷路。');
  K('整流', 2, LB, '半波平均', '理想半波整流輸出平均 = {0} = {1}。', 'Ideal half-wave average = ___ = ___.',
    [S(['V_m/π', '2V_m/π', 'V_m/2', 'V_m/√2']), S(['0.45 V_rms', '0.9 V_rms', '0.707 V_rms', 'V_rms'])], '講義 p.3：(1/2π)∫₀<sup>π</sup> V_m sin ωt dωt。');
  K('整流', 3, LF, '全波平均', '理想全波整流輸出平均 = {0}，是半波的 {1}。', 'Ideal full-wave average = ___, which is ___ the half-wave value.',
    [S(['2V_m/π ≈ 0.637 V_m', 'V_m/π', 'V_m', 'V_m/2']), S(['兩倍 twice', '一樣 the same as', '一半 half of', '四倍 four times'])], '講義 p.5：負半週也翻上來，面積加倍。');
  K('整流', 4, LF, '漣波頻率', '60 Hz 輸入，半波輸出一秒鼓起 {0} 次，全波 {1} 次。', 'With a 60 Hz input, the half-wave output bumps ___ times per second and the full-wave ___ times.',
    [S(['60', '120', '30', '240']), S(['120', '60', '30', '240'])], '講義 p.8 表：漣波頻率半波 f_s、全波 2f_s。');
  K('整流', 5, LF, '中間抽頭', '中間抽頭式全波整流需要 {0} 顆二極體，正半週 {1} 導通。', 'A center-tapped full-wave rectifier uses ___ diodes; in the positive half ___ conducts.',
    [S(['2', '1', '4', '3']), S(['D1', 'D2', '兩顆都 both', '都不 neither'])], '講義 p.6：正半週 D1 導通 D2 截止，負半週反過來。');
  K('整流', 6, LF, '橋式', '橋式整流用 {0} 顆二極體，負半週 {1} 導通。', 'A bridge rectifier uses ___ diodes; in the negative half ___ conduct.',
    [S(['4', '2', '1', '6']), S(['D2、D3', 'D1、D4', 'D1、D2', '四顆 all four'])], '講義 p.7：正半週 D1D4、負半週 D2D3，流過負載的方向永遠一樣。');
  K('整流', 7, LF, 'PIV', '二極體逆向耐壓：半波 {0}、中間抽頭 {1}、橋式 V_m。', 'Diode PIV: half-wave ___, center-tapped ___, bridge V_m.',
    [S(['V_m', '2V_m', 'V_m/2', '0.7 V']), S(['2V_m', 'V_m', 'V_m/2', '4V_m'])], '講義 p.8 表。加了濾波電容後半波也變成 2V_m（電容撐住 +V_m，輸入又到 −V_m）。');
  K('整流', 8, LF, '橋式的代價', '橋式每半週電流要過 {0}，所以輸出峰值約 {1}。', 'In a bridge, current passes through ___ each half cycle, so the peak is about ___.',
    [S(['兩顆二極體 two diodes', '一顆二極體 one diode', '四顆二極體 four diodes', '沒有二極體 no diode']), S(['V_m − 1.4 V', 'V_m − 0.7 V', 'V_m', '2V_m'])], '你的 PSpice（VAMP 10 V、100 Ω）：半波峰值 9.19 V、橋式 8.39 V。');

  K('實驗', 1, LC, '看波形', '要同時看 V1 和 Vo 的波形，用 {0}。', 'To see V1 and Vo together, use the ___.',
    [S(['示波器（雙通道）oscilloscope', '三用電表 multimeter', '電源供應器 power supply', '頻率計 counter'])], '講義 p.9：示波器 CH2 看 V1、CH1 看 Vo。');
  K('實驗', 2, LC, '量 V1', '用三用電表量 V1 要切 {0}，讀到的是 {1}。', 'To measure V1 with the meter, use the ___ range; it reads the ___.',
    [S(['AC 檔 AC', 'DC 檔 DC', 'Ω 檔 ohms', '電流檔 current']), S(['有效值 rms', '峰值 peak', '平均值 average', '峰對峰值 peak-to-peak'])], 'V1 是完整正弦，DC 檔會讀到 0。你量 3.4639 V。');
  K('實驗', 3, LC, '量 Vo 平均', '量 Vo 的平均值要切 {0}。', 'To read the average of Vo, use the ___ range.',
    [S(['DC 檔 DC', 'AC 檔 AC', 'Ω 檔 ohms', '二極體檔 diode test'])], '講義 p.9：用三用電表（DC 檔位）量測 Vo: Vavg。');
  K('實驗', 4, LC, 'ACV 的讀值', '用 ACV 檔量半波輸出 Vo，讀到的是 {0}。', 'Measuring the half-wave Vo on ACV reads ___.',
    [S(['扣掉平均後的交流成分 the AC part only', '平均值 the average', '峰值 the peak', '0'])], '你的結報 ※：1.5714 V 是交流成分；平均 1.29 V 要用 DC 檔或由二極體電壓推。');
  K('實驗', 5, LC, '從二極體電壓推', 'V1 平均為 0 時，Vo 平均 = {0}。', 'If V1 averages to zero, the average of Vo = ___.',
    [S(['−（二極體 DC 讀值）minus the diode DC reading', '二極體 DC 讀值 the diode DC reading', 'V1 的有效值 V1 rms', '0'])], 'KVL：v1 = vD + vo，取平均 ⟹ Vo 平均 = −VD 平均。你量 −1.29 V → 1.29 V。', true);
  K('實驗', 6, LC, '峰值少了多少', '你的 Vo 峰值比 V1 峰值少約 {0}。', 'Your Vo peak was lower than V1 peak by about ___.',
    [S(['0.64 V（二極體壓降）0.64 V, the diode drop', '5 V', '0 V', '1.4 V'])], '9.92/2 = 4.96 V，4.96 − 4.32 = 0.64 V。');
  K('實驗', 7, 'rectifier.html#pspice', 'PSpice 分析', '整流器 PSpice 要看波形，選 {0} 分析。', 'To see rectifier waveforms in PSpice, choose ___ analysis.',
    [S(['Time Domain（Transient）', 'DC Sweep', 'AC Sweep', 'Bias Point'])], '講義 p.12：New Simulation Profile → Time Domain，設 Run to time。');
  K('實驗', 8, 'rectifier.html#pspice', 'Vsin 的 VAMP', 'PSpice 的 Vsin 設 VAMP = 10 V，代表 {0}。', 'In PSpice, VAMP = 10 V on Vsin means ___.',
    [S(['峰值 10 V（20 Vpp）a 10 V peak (20 Vpp)', '峰對峰 10 V a 10 Vpp', '有效值 10 V 10 V rms', '直流 10 V 10 V DC'])], 'VAMP 是振幅（峰值），跟課堂函數產生器設的 10 Vpp 不一樣，輸出峰值會大一倍。');

  window.__RECC = { name: 'rectc', items };
})();
