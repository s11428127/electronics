/* ============================================================
   電子實習 第四章 整流器濾波 — 觀念填充（自編練習，不用計算）
   三組各 8 題：原理（第 1–2 節）、漣波（第 3–5 節）、實驗（實驗流程＋PSpice）
   選項正解寫第一個，hw.js 會打亂。下拉選項只能是純文字（不能有 <sub>、<sup>、底線）。
   ============================================================ */
(function () {
  'use strict';
  const S = o => ({ o, a: 0 });
  const items = [];
  const K = (sec, n, link, title, q, en, b, ex, how) =>
    items.push({ id: 'fl-' + ({ '原理': 'a', '漣波': 'b', '實驗': 'c' })[sec] + n, kind: 'cf', sec, no: sec + '-' + n, how: !!how, link, title, q, en, b, ex });
  const LA = 'filter.html#how', LB = 'filter.html#ripple', LC = 'filter.html#exp';

  /* ═════════ 原理 ═════════ */
  K('原理', 1, 'filter.html#why', '脈動直流',
    '整流後的電壓 {0}，但大小一直在變，這叫 {1}。',
    'After rectification the voltage ___, but its magnitude keeps changing; this is called ___.',
    [S(['不會再變負 never goes negative', '變成完全平的 becomes perfectly flat', '頻率變兩倍 doubles in frequency', '變成負的 becomes negative']), S(['脈動直流 pulsating DC', '純直流 pure DC', '交流 AC', '漣波因數 ripple factor'])],
    '二極體只讓電往一個方向走，所以方向固定了；但大小還是一顆一顆的駝峰，所以要再濾波。');
  K('原理', 2, 'filter.html#why', '電源供應器的四個方塊',
    '電源供應器的順序是：變壓 → {0} → {1} → 穩壓。',
    'The order of a power supply is: transformer → ___ → ___ → regulator.',
    [S(['整流 rectifier', '濾波 filter', '穩壓 regulator', '放大 amplifier']), S(['濾波 filter', '整流 rectifier', '變壓 transformer', '振盪 oscillator'])],
    '先把交流變單方向（整流），再把起伏抹平（濾波），最後把電壓穩住（穩壓）。講義 p.2 的方塊圖。');
  K('原理', 3, 'filter.html#why', '函數產生器的 Vpp',
    '函數產生器設 Vpp = 10 V，代表正弦波的振幅是 {0}。',
    'A function generator set to 10 Vpp produces a sine wave whose amplitude is ___.',
    [S(['5 V', '10 V', '7.07 V', '3.54 V'])],
    '峰對峰值 = 2 × 振幅，所以 Vm = 10/2 = 5 V。7.07 V 是把 10 V 當 rms 的錯誤算法。');
  K('原理', 4, LA, '濾波電容怎麼接',
    '電容濾波是把電容 {0} 在負載兩端，它的角色像 {1}。',
    'In a capacitor filter, the capacitor is connected ___ the load, acting like ___.',
    [S(['並聯 in parallel with', '串聯 in series with', '取代 in place of', '反接 reversed across']), S(['水塔 a water tower', '閥門 a valve', '水管 a pipe', '水錶 a water meter'])],
    '電源高時把電容充滿，電源低時由電容供電給負載，就像水塔。二極體才是單向閥。');
  K('原理', 5, LA, '充電期間',
    '電源電壓上升、比電容電壓高的那一段，二極體 {0}，電容 {1}。',
    'While the source voltage rises above the capacitor voltage, the diode is ___ and the capacitor is ___.',
    [S(['順偏導通 forward-biased (on)', '逆偏截止 reverse-biased (off)', '崩潰 in breakdown', '開路 open']), S(['充電 charging', '放電 discharging', '不動 unchanged', '短路 shorted'])],
    '講義 p.3 Step 1：二極體導通，電源同時供電給負載並對電容充電，vs = vC = vo（少一個二極體壓降）。');
  K('原理', 6, LA, '為什麼二極體會截止',
    '過了峰值後電源電壓下降，但電容電壓還在高點，二極體的陽極比陰極 {0}，所以 {1}。',
    'After the peak the source drops while the capacitor stays high, so the diode anode is ___ than the cathode, and the diode ___.',
    [S(['低 lower', '高 higher', '一樣 equal', '先高後低 first higher then lower']), S(['逆偏截止 turns off (reverse-biased)', '順偏導通 turns on', '崩潰 breaks down', '燒掉 burns out'])],
    '電容不會瞬間放電，它把陰極「頂」在高電壓；電源一往下走，二極體就被反推關上。');
  K('原理', 7, LA, '放電期間',
    '二極體截止時，電容經由 {0} 放電，電壓按 {1} 往下掉。',
    'While the diode is off, the capacitor discharges through ___, and its voltage falls as ___.',
    [S(['負載電阻 R the load resistor R', '二極體 the diode', '電源 the source', '地線 ground only']), S(['指數 e 的負 t 除以 RC 次方 an exponential with time constant RC', '直線不變 a constant', '正弦波 a sine wave', '方波 a square wave'])],
    '只剩 C → R 的迴路，就是 RC 放電：vo = Vp × e 的 (−t/RC) 次方。');
  K('原理', 8, LA, '二極體什麼時候導通', 
    '加了電容後，二極體在每個週期只在 {0} 導通。',
    'With a filter capacitor, the diode conducts in each cycle only ___.',
    [S(['電源追上電容電壓到峰值那一小段 a short interval near the peak', '整個正半週 the whole positive half-cycle', '整個負半週 the whole negative half-cycle', '整個週期 the whole cycle'])],
    '要等電源電壓爬到比電容電壓高（t2）才導通，過了峰值就截止。電容越大，這一段越短。', true);

  /* ═════════ 漣波 ═════════ */
  K('漣波', 1, 'filter.html#rc', '漣波大小看什麼',
    '電容濾波的漣波大小主要由 {0} 跟電源週期 T 的比較決定。',
    'The ripple of a capacitor filter is mainly determined by comparing ___ with the source period T.',
    [S(['RC 乘積 the product RC', '只有 R R alone', '只有 C C alone', '二極體壓降 the diode drop'])],
    'ΔV ≈ Vp × T / (RC)。R 和 C 永遠以乘積出現，RC ≫ T 才會平。');
  K('漣波', 2, 'filter.html#rc', '1 kΩ×100 µF 對 10 kΩ×10 µF',
    'R = 1 kΩ、C = 100 µF 和 R = 10 kΩ、C = 10 µF 的漣波因數 {0}，因為 {1}。',
    'The ripple factors for (1 kΩ, 100 µF) and (10 kΩ, 10 µF) are ___, because ___.',
    [S(['差不多 about the same', '差 10 倍 10 times apart', '差 100 倍 100 times apart', '一個是 0 one is zero']), S(['RC 都是 0.1 s both have RC = 0.1 s', 'R 一樣 the R values match', 'C 一樣 the C values match', '頻率不同 the frequencies differ'])],
    '模擬兩組都是 14.7%。這是實驗表格要你自己發現的事。', true);
  K('漣波', 3, 'filter.html#rc', '講義 p.4 的兩句話',
    '固定電容時，負載 {0} 越大，負載電流越小，濾波效果越好。',
    'With C fixed, the larger the load ___, the smaller the load current and the better the filtering.',
    [S(['電阻 resistance', '電流 current', '功率 power', '電壓 voltage'])],
    '講義寫「負載越大」，意思是負載電阻越大。負載吃越多電流，漣波反而越大。');
  K('漣波', 4, 'filter.html#rc', '估算公式什麼時候失效',
    'ΔV ≈ Vp/(fRC) 只有在 {0} 時才準；若 RC 比週期小很多，電容 {1}。',
    'ΔV ≈ Vp/(fRC) is valid only when ___; if RC is much smaller than the period, the capacitor ___.',
    [S(['RC 遠大於 T RC is much larger than T', 'RC 等於 T RC equals T', 'RC 遠小於 T RC is much smaller than T', 'R 等於 C R equals C']), S(['很快就放光 discharges almost completely', '一直保持滿電 stays fully charged', '會反向充電 charges in reverse', '會燒掉 burns out'])],
    '推導假設電容只掉一點點、近似直線。RC 太小時電容早就放光，漣波接近整個 Vp。', true);
  K('漣波', 5, LB, '漣波因數的定義',
    '漣波因數的正式定義是漣波的 {0} 除以 {1}。',
    'The ripple factor is formally defined as the ___ of the ripple divided by the ___.',
    [S(['有效值 rms value', '峰對峰值 peak-to-peak value', '最大值 peak value', '平均值 average value']), S(['直流值 dc value', '峰值 peak value', '電源有效值 source rms', '電阻值 resistance'])],
    'r% = Vr(rms)/Vdc × 100%。課堂表格用的峰對峰版本是「簡化版」。');
  K('漣波', 6, LB, '正弦還是鋸齒',
    '講義 p.6 的 Vr(rms) = 振幅/√2 是把漣波當成 {0}；實際漣波比較像 {1}，rms 要除以 2√3。',
    'The handout\'s Vr(rms) = amplitude/√2 treats the ripple as ___; the actual ripple is closer to ___, whose rms is Vpp/(2√3).',
    [S(['正弦波 a sine wave', '鋸齒波 a sawtooth', '方波 a square wave', '直流 DC']), S(['鋸齒波 a sawtooth wave', '正弦波 a sine wave', '方波 a square wave', '脈衝 an impulse'])],
    '濾波後是「快速充上去、慢慢掉下來」，形狀像鋸齒。兩種算法差約 18%，寫報告要註明用哪一個。');
  K('漣波', 7, LB, '簡化漣波因數',
    '課堂表格用的簡化漣波因數是 {0}，它的數字會比 rms 版本 {1}。',
    'The simplified ripple factor used in class is ___, which is ___ than the rms version.',
    [S(['Vo(p-p) / Vdc', 'Vr(rms) / Vdc', 'Vdc / Vo(p-p)', 'Vmax / Vmin']), S(['大很多（約 3 倍）much larger (about 3x)', '小很多 much smaller', '一樣 equal', '永遠是 0 always zero'])],
    '峰對峰值是正弦 rms 的 2√2 ≈ 2.83 倍、鋸齒 rms 的 2√3 ≈ 3.46 倍。');
  K('漣波', 8, 'filter.html#cost', '電容越大的代價',
    '濾波電容越大，漣波越小，但二極體的 {0} 越大，因為 {1}。',
    'A larger filter capacitor gives less ripple but a larger diode ___, because ___.',
    [S(['峰值電流 peak current', '平均電流 average current', '逆向電壓 reverse voltage', '導通電壓 turn-on voltage']), S(['導通時間變短，要在更短時間補回同樣的電荷 it must deliver the same charge in a shorter time', '電容會短路 the capacitor shorts', '頻率變高 the frequency rises', '負載變大 the load grows'])],
    '一週期用掉的電荷 IDC×T 固定，導通時間越短，電流脈衝就越高。講義 p.5。');

  /* ═════════ 實驗 ═════════ */
  K('實驗', 1, LC, '量 Vo,dc',
    'Vo,dc 用三用電表的 {0} 檔量，量到的是 {1}。',
    'Vo,dc is measured with the multimeter on ___, which reads the ___.',
    [S(['DC 電壓 DC volts', 'AC 電壓 AC volts', '電阻 ohms', '電流 amps']), S(['平均值 average value', '有效值 rms value', '峰值 peak value', '峰對峰值 peak-to-peak value'])],
    '三用電表 DC 檔顯示平均值；AC 檔顯示（交流部分的）有效值。');
  K('實驗', 2, LC, 'AC 耦合',
    '漣波很小時，示波器 CH2 切成 {0}，可以把直流擋掉、調小 V/div 放大漣波；但這時 {1}。',
    'When the ripple is tiny, set CH2 to ___ to block the DC and zoom in; but then ___.',
    [S(['AC 耦合 AC coupling', 'DC 耦合 DC coupling', 'GND 接地 GND', 'X-Y 模式 X-Y mode']), S(['看不到直流值 the DC level is not shown', '漣波會變大 the ripple grows', '頻率會改變 the frequency changes', '二極體會燒掉 the diode burns'])],
    'AC 耦合只留交流部分，所以只能量峰對峰，Vo,dc 要回 DC 耦合或用三用電表量。', true);
  K('實驗', 3, LC, '探棒的地夾',
    '示波器兩支探棒的地夾要夾在 {0}，因為 {1}。',
    'The ground clips of both probes must go to ___, because ___.',
    [S(['同一個地 the same ground node', '各自的元件兩端 across each part', '電源正端 the source positive', '二極體兩端 across the diode']), S(['兩個通道的地在機器裡相連 both channel grounds are tied inside the scope', '這樣比較好看 it looks nicer', '地夾沒有功能 the clips do nothing', '可以量電流 it measures current'])],
    '夾在不同點等於用示波器的地線把電路某一段短路。', true);
  K('實驗', 4, LC, '電解電容',
    '電解電容有 {0}，負極（外殼有 − 白條）要接 {1}。',
    'An electrolytic capacitor is ___; its negative lead (marked with a − stripe) goes to ___.',
    [S(['極性 polarized', '固定電感 fixed inductance', '整流作用 rectifying action', '電阻值 resistance']), S(['地 ground', 'Vo', '二極體陽極 the diode anode', '函數產生器正端 the generator output'])],
    '接反會發熱、鼓起甚至爆開。+ 接 Vo、− 接地。');
  K('實驗', 5, LC, '二極體方向',
    '1N4002 有白環的那端是 {0}，在半波整流裡要朝向 {1}。',
    'The banded end of a 1N4002 is the ___, which should face ___ in the half-wave rectifier.',
    [S(['陰極 cathode', '陽極 anode', '閘極 gate', '基極 base']), S(['輸出 Vo the output Vo', '函數產生器 the generator', '地 ground', '電容負極 the capacitor negative'])],
    '電流從陽極流向陰極。接反的話 Vo 會變成負的駝峰。');
  K('實驗', 6, 'filter.html#pspice', 'PSpice 的 VAMPL',
    '講義寫 Vpp = 10 V，PSpice 的 VSIN 要設 VAMPL = {0}；分析類型選 {1}。',
    'For Vpp = 10 V, set VSIN VAMPL = ___ in PSpice, and choose ___ analysis.',
    [S(['5', '10', '7.07', '20']), S(['Time Domain（Transient）', 'DC Sweep', 'AC Sweep', 'Bias Point'])],
    'VAMPL 是振幅 = Vpp/2。要看隨時間變化的波形就用 Transient（暫態分析）。', true);
  K('實驗', 7, 'filter.html#pspice', 'PSpice 單位字首',
    '在 PSpice 輸入 100u 代表 {0}；輸入 1m 代表 {1}。',
    'In PSpice, 100u means ___ and 1m means ___.',
    [S(['100 微 100 × 10⁻⁶', '100 毫 100 × 10⁻³', '100 百萬 100 × 10⁶', '100 奈 100 × 10⁻⁹']), S(['1 毫 10⁻³', '1 百萬 10⁶', '1 微 10⁻⁶', '1 公尺 one meter'])],
    'PSpice 不分大小寫：m = milli（10⁻³），百萬要寫 meg。寫成 1M 也是 10⁻³，這是常見陷阱。');
  K('實驗', 8, 'filter.html#pspice', '橋式整流量 Vi',
    '橋式整流的電源兩端都沒有接地，所以畫 Vi 要用 {0}；它的輸出峰值比半波 {1}。',
    'In the bridge rectifier neither source terminal is grounded, so Vi must be shown with ___; its output peak is ___ than the half-wave one.',
    [S(['差動電壓探針 differential voltage markers', '單支對地探針 a single voltage marker', '電流探針 a current marker', '功率探針 a power marker']), S(['低（多一顆二極體壓降）lower (one more diode drop)', '高 higher', '一樣 the same', '高兩倍 twice as high'])],
    '單支探針量的是對地電壓，不是電源兩端的電壓。橋式每半週經過兩顆二極體，峰值約少 0.7～0.8 V。');

  window.__FLC = { name: 'filterc', items };
})();
