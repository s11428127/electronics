/* ============================================================
   電路學 CH11 觀念填充題（自編練習，不用計算）
   使用者 10/6 要求：像電子學那種下拉選單填充題、每一小節 8 題、考觀念與知識，約 1/3 考「這類題目怎麼解」。
   題目先中文，下面附英文（en）。選項正解寫在第一個，hw.js 會打亂。下拉選項不能放 <sup>（用 ² 這種上標字元）。
   用法：<div class="hw-list" data-bank="__CH11C" data-sec="11.2"></div>
   ============================================================ */
(function () {
  'use strict';
  const P1 = 'ch11-part1.html', P2 = 'ch11-part2.html', P3 = 'ch11-part3.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  /* C(小節, 第幾題, 連結, 標題, 中文題幹, 英文題幹, 空格, 解釋, 是否為解法題) */
  const C = (sec, n, link, title, q, en, b, ex, how) =>
    items.push({ id: 'c' + sec.replace('.', '') + '-' + n, kind: 'cf', sec, no: sec + '-' + n, how: !!how, link, title, q, en, b, ex });

  /* ═════════ 11.2 瞬時功率與平均功率 ═════════ */
  const L2 = P1 + '#inst';
  C('11.2', 1, L2, '瞬時功率的定義',
    '瞬時功率 p(t) 等於 {0}；在弦波穩態下，它擺動的角頻率是電壓的 {1}。',
    'The instantaneous power p(t) equals ___; in sinusoidal steady state it oscillates at ___ the angular frequency of the voltage.',
    [S(['v(t)·i(t)', 'v(t) + i(t)', 'v(t)/i(t)', 'v(t)²/R']), S(['兩倍 twice', '一倍 the same', '一半 half', '四倍 four times'])],
    'p = v·i。積化和差後 p(t) = ½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub>−θ<sub>i</sub>) + ½V<sub>m</sub>I<sub>m</sub>cos(2ωt + θ<sub>v</sub> + θ<sub>i</sub>)，擺盪項是 2ω。');
  C('11.2', 2, L2, '平均功率是什麼',
    '平均功率 P 是 p(t) 在 {0} 內的平均值，單位是 {1}。',
    'The average power P is the average of p(t) over ___, and its unit is ___.',
    [S(['一個週期 one period', '一瞬間 an instant', '無限長時間 infinite time', '半個週期 half a period']), S(['瓦特 W', '伏安 VA', '乏 VAR', '焦耳 J'])],
    'P = (1/T)∫p dt。擺盪項一個週期平均為 0，只剩常數項 ½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub>−θ<sub>i</sub>)，單位是 W。');
  C('11.2', 3, L2, '純電阻',
    '純電阻的電壓與電流相位差 θ<sub>v</sub> − θ<sub>i</sub> = {0}，所以 p(t) {1}。',
    'For a purely resistive load, θ<sub>v</sub> − θ<sub>i</sub> = ___, so p(t) is ___.',
    [S(['0°', '90°', '−90°', '45°']), S(['永遠 ≥ 0 always nonnegative', '有正有負 sometimes negative', '永遠 = 0 always zero', '永遠 < 0 always negative'])],
    '同相時正×正、負×負都是正的，電阻任何時刻都在吸收能量、變成熱。');
  C('11.2', 4, L2, '純電感、純電容',
    '純電感或純電容的相位差是 {0}，平均功率 {1}，因為能量只是 {2}。',
    'For a purely inductive or capacitive element the phase difference is ___, the average power is ___, because the energy is only ___.',
    [S(['±90°', '0°', '180°', '45°']), S(['等於 0 zero', '等於 ½VmIm', '等於 VmIm', '是負的 negative']),
     S(['在電源與元件之間借了又還 exchanged back and forth', '變成熱 dissipated as heat', '儲存起來不再釋放 stored permanently', '送到地線 sent to ground'])],
    'cos(±90°) = 0。p(t) 一半時間正（存進磁場／電場）、一半時間負（還給電源），正負面積相等。');
  C('11.2', 5, L2, 'p(t) 是負的代表什麼',
    '某段時間 p(t) < 0，代表那段時間 {0}。',
    'When p(t) < 0 during part of the cycle, it means that ___.',
    [S(['能量從負載送回電源 energy flows back to the source', '負載在產生新的能量 the load generates energy', '電路故障 the circuit is faulty', '平均功率一定是負的 P must be negative'])],
    '負的瞬時功率是電感、電容把先前存的能量還給電源，不是產生新能量；只要有電阻，平均還是正的。');
  C('11.2', 6, L2, '公式裡用的是振幅還是 rms',
    'P = ½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub>−θ<sub>i</sub>) 裡的 V<sub>m</sub>、I<sub>m</sub> 是 {0}；如果題目給的是 rms 值，公式要 {1}。',
    'In P = ½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub>−θ<sub>i</sub>), V<sub>m</sub> and I<sub>m</sub> are ___; if rms values are given, the formula should ___.',
    [S(['振幅（峰值）amplitudes', 'rms 值 rms values', '平均值 average values', '瞬時值 instantaneous values']), S(['拿掉 ½ drop the ½', '再乘 ½ multiply by another ½', '乘 √2 multiply by √2', '不用改 stay the same'])],
    '½V<sub>m</sub>I<sub>m</sub> = (V<sub>m</sub>/√2)(I<sub>m</sub>/√2) = V<sub>rms</sub>I<sub>rms</sub>，用 rms 時 ½ 已經被吃掉了。');
  C('11.2', 7, L2, '解法：題目給 sin',
    '題目給 i(t) = 33 sin(10t + 60°)，要用 P 的公式之前，第一步是 {0}。',
    'Given i(t) = 33 sin(10t + 60°), the first step before using the power formula is to ___.',
    [S(['把 sin 換成 cos：sin x = cos(x − 90°) convert to cosine', '直接讀 θi = 60° read θi = 60°', '把 sin 換成 cos：sin x = cos(x + 90°)', '先取 rms take the rms value'])],
    '兩條波都要寫成 cos 才能比相位：33 sin(10t + 60°) = 33 cos(10t − 30°)，所以 θ<sub>i</sub> = −30°。', true);
  C('11.2', 8, L2, '解法：已知電流與阻抗',
    '已知電流振幅 |I| 和阻抗 Z = R + jX，要求 Z 吸收的平均功率，最快用 {0}，因為 {1}。',
    'Given the current amplitude |I| and impedance Z = R + jX, the fastest way to find the average power absorbed is ___, because ___.',
    [S(['P = ½|I|²R', 'P = ½|I|²|Z|', 'P = ½|I|²X', 'P = |I|²R']), S(['只有電阻消耗平均功率 only R absorbs average power', '電抗吸收全部功率 X absorbs all power', '|Z| 最大 |Z| is largest', '不需要知道 R R is not needed'])],
    '電感、電容平均吸收 0，所以只看實部 R；|I| 是振幅所以要乘 ½（用 rms 才是 I<sub>rms</sub>²R）。', true);

  /* ═════════ 11.3 最大平均功率轉移 ═════════ */
  const L3 = P1 + '#mpt';
  C('11.3', 1, L3, '共軛匹配',
    '負載可以是任意阻抗時，要拿到最大平均功率，負載阻抗 Z<sub>L</sub> 應該等於 {0}。',
    'When the load may be any impedance, maximum average power transfer requires Z<sub>L</sub> = ___.',
    [S(['ZTh 的共軛 ZTh*', 'ZTh', '|ZTh|', '1/ZTh'])],
    'Z<sub>L</sub> = Z<sub>Th</sub>*，也就是實部相同、虛部變號。');
  C('11.3', 2, L3, '共軛匹配的兩個條件',
    '共軛匹配可以拆成兩個條件：R<sub>L</sub> = {0}，X<sub>L</sub> = {1}。',
    'Conjugate matching means R<sub>L</sub> = ___ and X<sub>L</sub> = ___.',
    [S(['RTh', '|ZTh|', '0', '2RTh']), S(['−XTh', 'XTh', '0', '2XTh'])],
    '先用 X<sub>L</sub> = −X<sub>Th</sub> 把電抗抵銷，剩下的純電阻再 R<sub>L</sub> = R<sub>Th</sub>（跟直流一樣）。');
  C('11.3', 3, L3, '為什麼要抵銷電抗',
    '選 X<sub>L</sub> = −X<sub>Th</sub> 是為了讓迴路的總電抗 {0}，電流 {1}。',
    'Choosing X<sub>L</sub> = −X<sub>Th</sub> makes the total reactance ___, so the current is ___.',
    [S(['等於 0 zero', '加倍 doubled', '等於 RTh', '變成負的 negative']), S(['最大 maximized', '最小 minimized', '等於 0 zero', '跟 X 無關 independent of X'])],
    'P 的分母有 (X<sub>Th</sub> + X<sub>L</sub>)²，平方最小是 0；電抗消掉後電路是純電阻，電流最大。');
  C('11.3', 4, L3, '負載只能是電阻',
    '如果負載限定只能是純電阻，最大功率的條件變成 R<sub>L</sub> = {0}。',
    'If the load is restricted to a pure resistance, the condition becomes R<sub>L</sub> = ___.',
    [S(['|ZTh| = √(RTh² + XTh²)', 'RTh', 'XTh', 'RTh + XTh'])],
    'X<sub>L</sub> = 0 抵銷不了電抗，對 R<sub>L</sub> 微分得 R<sub>L</sub> = |Z<sub>Th</sub>|。這時拿到的功率比共軛匹配少。');
  C('11.3', 5, L3, 'P<sub>max</sub> 公式的 8',
    'P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>) 裡的 V<sub>Th</sub> 是 {0}；如果 V<sub>Th</sub> 是 rms 值，要改成 {1}。',
    'In P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>), V<sub>Th</sub> is ___; if V<sub>Th</sub> is an rms value, use ___.',
    [S(['振幅 amplitude', 'rms 值 rms value', '平均值 average value', '開路電流 open-circuit current']), S(['|VTh|²/(4RTh)', '|VTh|²/(2RTh)', '|VTh|²/(16RTh)', '|VTh|²/RTh'])],
    '8 = ½（振幅轉平均）× 4（總阻抗 2R<sub>Th</sub> 的平方）。用 rms 就沒有那個 ½。');
  C('11.3', 6, L3, '解法：求 ZTh',
    '求戴維寧阻抗 Z<sub>Th</sub> 時，獨立電壓源要 {0}，獨立電流源要 {1}，再從負載端看進去。',
    'To find Z<sub>Th</sub>, independent voltage sources are ___ and independent current sources are ___, then look in from the load terminals.',
    [S(['短路 shorted', '開路 opened', '保留 kept', '加倍 doubled']), S(['開路 opened', '短路 shorted', '保留 kept', '換成電阻 replaced by a resistor'])],
    '電源歸零：電壓源 = 0 V 等於一條導線（短路），電流源 = 0 A 等於斷開（開路）。', true);
  C('11.3', 7, L3, '解法：求 VTh',
    '求 V<sub>Th</sub> 的做法是把負載 {0}，算那兩端的 {1}。',
    'To find V<sub>Th</sub>, ___ the load and compute the ___ across its terminals.',
    [S(['拿掉 remove', '短路 short', '加倍 double', '保留 keep']), S(['開路電壓 open-circuit voltage', '短路電流 short-circuit current', '平均功率 average power', '阻抗 impedance'])],
    'V<sub>Th</sub> 就是負載端開路時的電壓；之後才決定 Z<sub>L</sub>。', true);
  C('11.3', 8, L3, '解法：哪時候能用 P<sub>max</sub> 公式',
    'P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>) 只能用在 {0}；負載只能是電阻時要 {1}。',
    'P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>) is valid only for ___; for a resistive-only load you must ___.',
    [S(['共軛匹配 conjugate matching', '任何負載 any load', '純電阻負載 a resistive load', '純電抗負載 a reactive load']),
     S(['先算電流再用 P = ½|I|²RL compute I first, then ½|I|²RL', '直接套同一條公式 use the same formula', '把 8 換成 4 replace 8 by 4', '令 P = 0 set P to zero'])],
    '只有共軛匹配時總阻抗才剛好是 2R<sub>Th</sub>；其他情況要回到 I = V<sub>Th</sub>/(Z<sub>Th</sub> + Z<sub>L</sub>)。', true);

  /* ═════════ 11.4 有效值 ═════════ */
  const L4 = P2 + '#rms';
  C('11.4', 1, L4, '有效值的定義',
    '一個週期性電流的有效值，是能對同一個電阻送出 {0} 的 {1} 值。',
    'The effective value of a periodic current is the ___ value that delivers ___ to the same resistor.',
    [S(['相同平均功率 the same average power', '相同最大電流 the same peak current', '相同電壓 the same voltage', '相同頻率 the same frequency']), S(['直流 dc', '峰值 peak', '平均 average', '瞬時 instantaneous'])],
    '比的是「發熱」：交流接電阻發多少熱，找一個發一樣多熱的直流，那個直流值就是有效值。');
  C('11.4', 2, L4, 'rms 的三個步驟',
    'rms 的算法照名字倒著唸：先 {0}，再 {1}，最後 {2}。',
    'Root-mean-square, read backwards: first ___, then ___, finally ___.',
    [S(['平方 square', '開根號 root', '取平均 mean', '微分 differentiate']), S(['取一週期平均 take the mean over a period', '平方 square', '開根號 root', '取最大值 take the peak']), S(['開根號 take the square root', '平方 square', '取平均 take the mean', '除以 √2 divide by √2'])],
    'X<sub>rms</sub> = √((1/T)∫x² dt)：square → mean → root。先平均再平方就錯了（弦波平均是 0）。');
  C('11.4', 3, L4, '弦波的有效值',
    '弦波的有效值等於 {0}，這個 √2 來自 cos² 的平均值是 {1}。',
    'The rms value of a sinusoid is ___; the √2 comes from the average of cos² being ___.',
    [S(['Vm/√2', 'Vm', 'Vm/√3', 'Vm/2']), S(['½', '1', '0', '⅓'])],
    'cos²x = ½(1 + cos2x)，一週期平均 = ½，開根號得 1/√2。');
  C('11.4', 4, L4, '非弦波的有效值',
    '振幅 V<sub>m</sub> 的方波，有效值是 {0}；三角波或鋸齒波是 {1}。',
    'For a square wave of amplitude V<sub>m</sub> the rms value is ___; for a triangular or sawtooth wave it is ___.',
    [S(['Vm', 'Vm/√2', 'Vm/√3', 'Vm/2']), S(['Vm/√3', 'Vm/√2', 'Vm', 'Vm/2'])],
    '方波平方後一直是 V<sub>m</sub>²；三角波平方的平均是 V<sub>m</sub>²/3。√2 只對弦波成立。');
  C('11.4', 5, L4, '整流波形',
    '半波整流正弦波的有效值是 {0}；全波整流是 {1}。',
    'The rms value of a half-wave rectified sine is ___; of a full-wave rectified sine it is ___.',
    [S(['Vm/2', 'Vm/√2', 'Vm/π', 'Vm']), S(['Vm/√2', 'Vm/2', 'Vm/√3', '2Vm/π'])],
    '全波整流平方後跟弦波一模一樣 → V<sub>m</sub>/√2；半波只剩一半時間有值 → 平方的平均再打一半 → V<sub>m</sub>/2。');
  C('11.4', 6, L4, '插座的 110 V',
    '台灣插座標的 110 V 是 {0}，電壓的最高點大約是 {1}。',
    'The 110 V rating of a household outlet is the ___ value; the peak voltage is about ___.',
    [S(['有效值 rms', '峰值 peak', '平均值 average', '瞬時值 instantaneous']), S(['155 V', '110 V', '78 V', '220 V'])],
    '電力系統講電壓預設都是 rms；峰值 = 110 × √2 ≈ 155 V。');
  C('11.4', 7, L4, 'rms 讓公式變乾淨',
    '用 rms 表示時，平均功率 P = {0}；½ {1}。',
    'In terms of rms values, the average power is P = ___; the ½ ___.',
    [S(['Vrms Irms cos(θv − θi)', '½ Vrms Irms cos(θv − θi)', 'Vrms Irms sin(θv − θi)', '2 Vrms Irms cos(θv − θi)']),
     S(['已經被 rms 吸收，不用再乘 is absorbed by the rms values', '還是要乘 must still be applied', '變成 ¼ becomes ¼', '變成 √2 becomes √2'])],
    '½V<sub>m</sub>I<sub>m</sub> = (V<sub>m</sub>/√2)(I<sub>m</sub>/√2)。這就是發明有效值的目的：公式長得跟直流 P = VI 一樣。');
  C('11.4', 8, L4, '解法：分段波形的 rms',
    '分段波形求 rms 時，把一個週期切成幾段分別積分 x² 再相加，最後要除以 {0}。',
    'For a piecewise waveform, integrate x² over each segment, add them, and divide by ___.',
    [S(['整個週期 T the full period T', '那一段的長度 the segment length', '半個週期 half the period', '段數 the number of segments'])],
    '平均一定是「一整個週期」的平均；算完記得檢查 rms 介於 0 和最高點之間。', true);

  /* ═════════ 11.5 視在功率與功率因數 ═════════ */
  const L5 = P2 + '#pf';
  C('11.5', 1, L5, '視在功率',
    '視在功率 S = {0}，單位是 {1}；它代表電線、發電機要扛的量。',
    'The apparent power is S = ___, with unit ___; it is what the wires and generator must carry.',
    [S(['Vrms × Irms', 'Vrms Irms cos θ', 'Vrms Irms sin θ', 'Vm × Im']), S(['伏安 VA', '瓦特 W', '乏 VAR', '歐姆 Ω'])],
    '「看起來像功率」所以叫 apparent；刻意用 VA 不用 W，提醒它不是真的被用掉的功率。');
  C('11.5', 2, L5, '功率因數的定義',
    '功率因數 pf = {0} = {1}。',
    'The power factor is pf = ___ = ___.',
    [S(['P / S', 'S / P', 'Q / S', 'P / Q']), S(['cos(θv − θi)', 'sin(θv − θi)', 'tan(θv − θi)', 'cos(θv + θi)'])],
    'P = S·cos(θ<sub>v</sub>−θ<sub>i</sub>)，所以 pf = P/S = cos(θ<sub>v</sub>−θ<sub>i</sub>)，沒有單位。');
  C('11.5', 3, L5, 'pf 的範圍',
    '對被動負載，功率因數的範圍是 {0}；純電阻 pf = {1}。',
    'For a passive load the power factor lies between ___; for a purely resistive load pf = ___.',
    [S(['0 到 1 0 and 1', '−1 到 1 −1 and 1', '1 到 ∞ 1 and ∞', '0 到 90 0 and 90']), S(['1', '0', '0.707', '∞'])],
    'pf = cos θ、|θ| ≤ 90°。算出 pf > 1 通常是 P 和 S 弄反了。');
  C('11.5', 4, L5, '電流落後',
    '電流落後電壓的負載是 {0}，功率因數稱為 {1}。',
    'A load whose current lags the voltage is ___, and its power factor is ___.',
    [S(['電感性 inductive', '電容性 capacitive', '純電阻 resistive', '純電抗 purely reactive']), S(['落後 lagging', '超前 leading', '單位 unity', '負的 negative'])],
    'θ<sub>v</sub> − θ<sub>i</sub> > 0。馬達、冷氣、變壓器都是線圈 → 電感性、落後功因。');
  C('11.5', 5, L5, '電流超前',
    '電流超前電壓的負載是 {0}，阻抗的虛部 X {1}。',
    'A load whose current leads the voltage is ___, and the reactance X is ___.',
    [S(['電容性 capacitive', '電感性 inductive', '純電阻 resistive', '開路 open']), S(['< 0 negative', '> 0 positive', '= 0 zero', '無法判斷 undetermined'])],
    '口訣 ELI the ICE man：電容 C 中電流 I 在電壓 E 前面（超前）；X<sub>C</sub> = −1/(ωC) < 0。');
  C('11.5', 6, L5, '阻抗角 = 功因角',
    '負載阻抗 Z 的角度等於 {0}，所以題目只給 Z 也能直接求出 {1}。',
    'The angle of the load impedance Z equals ___, so pf can be found directly from Z.',
    [S(['θv − θi', 'θv + θi', 'θi − θv 的兩倍', '90°']), S(['功率因數 the power factor', '視在功率 the apparent power', '電流大小 the current magnitude', '頻率 the frequency'])],
    'Z = V/I：大小相除、角度相減 → ∠Z = θ<sub>v</sub> − θ<sub>i</sub>。例：Z = 20 + j20 → 45° → pf = 0.707 落後。');
  C('11.5', 7, L5, '為什麼要標落後／超前',
    '只寫「pf = 0.8」是不夠的，因為 {0}。',
    'Writing only "pf = 0.8" is insufficient because ___.',
    [S(['cos(+θ) = cos(−θ)，分不出電感性還是電容性 cos is even', 'pf 一定大於 1 pf exceeds 1', '0.8 沒有單位 it has no unit', '功因會隨時間改變 pf varies with time'])],
    'cos(+36.87°) = cos(−36.87°) = 0.8，一個電感性、一個電容性，後面算 Q 和功因校正方向完全相反。');
  C('11.5', 8, L5, '解法：反推串聯元件',
    '由 Z = V/I 反推串聯負載：Z 的實部是 {0}；虛部為負代表 {1}，元件值用 {2}。',
    'To identify a series load from Z = V/I: the real part is ___; a negative imaginary part means ___, found from ___.',
    [S(['電阻 R the resistance', '電感 L the inductance', '電容 C the capacitance', '電導 G']),
     S(['電容 a capacitor', '電感 an inductor', '電阻 a resistor', '短路 a short']),
     S(['C = 1/(ω|X|)', 'L = |X|/ω', 'C = ω|X|', 'C = |X|/ω'])],
    'X<sub>C</sub> = −1/(ωC) → C = 1/(ω|X|)；虛部為正則是電感 L = X/ω。課本 Example 11.9 就是這樣做。', true);

  /* ═════════ 11.6 複功率 ═════════ */
  const L6 = P3 + '#tri';
  C('11.6', 1, L6, '複功率的定義',
    '複功率 S = {0}（V、I 用 rms 相量）。',
    'The complex power is S = ___ (rms phasors).',
    [S(['V · I*', 'V · I', 'V* · I', 'V / I'])],
    '電流要取共軛：S = V<sub>rms</sub>I*<sub>rms</sub> = P + jQ。');
  C('11.6', 2, L6, '為什麼要共軛',
    '取 I* 是為了讓相乘後的角度變成 {0}；不取共軛會得到 {1}。',
    'Using I* makes the angle of the product ___; without the conjugate it would be ___.',
    [S(['θv − θi', 'θv + θi', 'θi − θv', '0']), S(['θv + θi', 'θv − θi', '90°', '0'])],
    '複數相乘角度相加；把 I 的角度變號，加起來就變成相減，實部才會是 P。');
  C('11.6', 3, L6, 'S 的實部與虛部',
    'S = P + jQ 中，實部是 {0}，虛部是 {1}。',
    'In S = P + jQ, the real part is ___ and the imaginary part is ___.',
    [S(['實功率 P real power', '虛功率 Q reactive power', '視在功率 apparent power', '功率因數 power factor']), S(['虛功率 Q reactive power', '實功率 P real power', '視在功率 apparent power', '阻抗 impedance'])],
    '一個 S 在手：實部 P、虛部 Q、大小 |S|、角度的 cos 是 pf。');
  C('11.6', 4, L6, '三個單位',
    '虛功率 Q 的單位是 {0}，視在功率 |S| 的單位是 {1}。',
    'The unit of reactive power Q is ___ and of apparent power |S| is ___.',
    [S(['乏 VAR', '瓦特 W', '伏安 VA', '焦耳 J']), S(['伏安 VA', '乏 VAR', '瓦特 W', '歐姆 Ω'])],
    'P：W、Q：VAR、|S|：VA。三個單位故意不同，寫錯會扣分。');
  C('11.6', 5, L6, 'Q 的正負',
    'Q > 0 的負載是 {0}；Q < 0 的負載是 {1}。',
    'A load with Q > 0 is ___; a load with Q < 0 is ___.',
    [S(['電感性（落後）inductive', '電容性（超前）capacitive', '純電阻 resistive', '在發電 generating']), S(['電容性（超前）capacitive', '電感性（落後）inductive', '純電阻 resistive', '開路 open'])],
    'Q = V<sub>rms</sub>I<sub>rms</sub>sin(θ<sub>v</sub>−θ<sub>i</sub>)：電感 θ > 0 → Q > 0；電容 θ < 0 → Q < 0。');
  C('11.6', 6, L6, 'S = I²Z',
    '由 S = I²<sub>rms</sub>Z = I²<sub>rms</sub>(R + jX) 可知：P = {0}，Q = {1}。',
    'From S = I²<sub>rms</sub>(R + jX): P = ___ and Q = ___.',
    [S(['I²R', 'I²X', 'I²|Z|', 'V²/R']), S(['I²X', 'I²R', 'I²|Z|', '0'])],
    '電阻決定 P、電抗決定 Q。功率三角形跟阻抗三角形同一個形狀，只差一個 I²。');
  C('11.6', 7, L6, '功率三角形',
    '功率三角形中，P 是橫邊、Q 是直邊，斜邊是 {0}，夾角的 cos 是 {1}。',
    'In the power triangle with P horizontal and Q vertical, the hypotenuse is ___ and the cosine of the angle is ___.',
    [S(['|S| 視在功率', 'P', 'Q', 'pf']), S(['功率因數 pf', '視在功率 |S|', '虛功率 Q', '電流 I'])],
    '|S|² = P² + Q²、cos θ = P/|S| = pf。');
  C('11.6', 8, L6, '解法：選哪條 S 公式',
    '給電壓 V 和阻抗 Z（並聯負載），最快用 {0}；給電流 I 和 Z（串聯），最快用 {1}。',
    'Given V and Z (parallel load), use ___; given I and Z (series), use ___.',
    [S(['S = V²/Z*', 'S = V²/Z', 'S = V·I', 'S = I²Z']), S(['S = |I|²Z', 'S = |I|²Z*', 'S = V²/Z*', 'S = I/Z'])],
    '三條算出來一樣，挑步驟最少的；分母要 Z*（共軛）。另外由 S 反推電流時 I* = S/V，拿到的是共軛，角度要再變號。', true);

  /* ═════════ 11.7 交流功率守恆 ═════════ */
  const L7 = P3 + '#cons';
  C('11.7', 1, L7, '功率守恆',
    '不論負載串聯還是並聯，電源送出的複功率等於 {0}。',
    'Whether loads are in series or parallel, the complex power supplied by the source equals ___.',
    [S(['各負載複功率的總和 the sum of the loads’ complex powers', '最大那個負載的複功率 the largest load', '各負載視在功率的總和 the sum of |S|', '0'])],
    'S = S<sub>1</sub> + S<sub>2</sub> + …，包括傳輸線在內的所有元件。');
  C('11.7', 2, L7, '哪些可以直接相加',
    '多個負載時，可以直接相加的是 {0}；不能直接相加的是 {1}。',
    'For several loads, ___ can be added directly, but ___ cannot.',
    [S(['P 和 Q P and Q', '視在功率 |S| apparent powers', '功率因數 power factors', '電流大小 current magnitudes']), S(['視在功率 |S| apparent power', 'P', 'Q', '複功率 S'])],
    'S、P、Q 都可以相加；|S| 是長度不能加，pf 也不能平均。');
  C('11.7', 3, L7, '為什麼 |S| 不能加',
    '因為複功率 S 是 {0}，視在功率 |S| 是它的 {1}。',
    'Because S is a ___ and |S| is its ___.',
    [S(['向量（複數）a vector', '純量 a scalar', '常數 a constant', '角度 an angle']), S(['長度 length', '角度 angle', '實部 real part', '虛部 imaginary part'])],
    '方向不同的向量頭接尾，合起來的長度比兩段長度相加短（三角不等式）。');
  C('11.7', 4, L7, '|S| 什麼時候剛好可以加',
    '只有在 {0} 時，Σ|S<sub>i</sub>| 才剛好等於 |S<sub>總</sub>|。',
    'Σ|S<sub>i</sub>| equals |S<sub>total</sub>| only when ___.',
    [S(['所有負載的功因角都相同 all loads have the same pf angle', '負載是並聯的 loads are in parallel', '負載是串聯的 loads are in series', '頻率是 60 Hz f = 60 Hz'])],
    '所有 S<sub>i</sub> 方向相同時，向量相加等於長度相加。');
  C('11.7', 5, L7, '電感與電容的 Q 相加',
    '電容性負載的 Q 是 {0}，跟電感性負載的 Q 相加時會 {1}。',
    'The Q of a capacitive load is ___, so adding it to an inductive load’s Q ___.',
    [S(['負的 negative', '正的 positive', '0 zero', '無限大 infinite']), S(['部分抵銷 partially cancels', '加倍 doubles', '沒有影響 has no effect', '變成 P becomes P'])],
    '這正是 11.8 功因校正的原理：用電容的 −Q 抵銷馬達的 +Q。');
  C('11.7', 6, L7, '證明用的定律',
    '並聯負載的守恆證明用 {0}（電壓相同、電流相加）；串聯用 {1}。',
    'The proof for parallel loads uses ___; for series loads it uses ___.',
    [S(['KCL', 'KVL', '歐姆定律 Ohm’s law', '戴維寧定理 Thevenin']), S(['KVL', 'KCL', '歐姆定律 Ohm’s law', '重疊定理 superposition'])],
    '並聯：I = I<sub>1</sub> + I<sub>2</sub>，取共軛分配進 V·I*；串聯：V = V<sub>1</sub> + V<sub>2</sub>，乘 I*。');
  C('11.7', 7, L7, '解法：多負載的順序',
    '多負載題目第一步是 {0}；最後才 {1}。',
    'For multi-load problems, first ___; only at the end ___.',
    [S(['把每個負載化成一對 (P, Q) convert each load to (P, Q)', '把各負載的 |S| 相加 add the |S| values', '把 pf 平均 average the pfs', '先求總電流 find the total current']),
     S(['取 |S| = √(P² + Q²) take |S| = √(P² + Q²)', '把 pf 相加 add the pfs', '把 Q 取絕對值 take |Q|', '除以 √2 divide by √2'])],
    '給 P 和 pf → Q = P tan θ；給 |S| 和 pf → P = |S|cos θ、Q = |S|sin θ。Q 的正負照電感／電容。', true);
  C('11.7', 8, L7, '解法：合併功率因數',
    '兩個負載合併後的功率因數要用 {0}，不能 {1}。',
    'The combined power factor must be computed as ___, not by ___.',
    [S(['P總 / |S總|', 'pf₁ + pf₂', 'pf₁ × pf₂', 'Q總 / P總']), S(['把兩個 pf 平均 averaging the two pfs', '先算 P總 computing P first', '先算 Q總 computing Q first', '畫功率三角形 drawing the triangle'])],
    '總 Q 的正負決定合併後是落後還是超前。', true);

  /* ═════════ 11.8 功率因數校正 ═════════ */
  const L8 = P3 + '#pfc';
  C('11.8', 1, L8, '並聯什麼',
    '電感性負載（如馬達）要做功因校正，應該在負載旁 {0} 一個 {1}。',
    'To correct the pf of an inductive load, connect a ___ in ___ with the load.',
    [S(['並聯 parallel', '串聯 series']), S(['電容 capacitor', '電感 inductor', '電阻 resistor', '二極體 diode'])],
    '電容的 Q 是負的，抵銷馬達的 +Q；並聯才不會改變負載兩端的電壓。');
  C('11.8', 2, L8, '校正後誰變、誰不變',
    '並聯電容校正後，P {0}，Q {1}，線電流 {2}。',
    'After shunt-capacitor correction, P ___, Q ___, and the line current ___.',
    [S(['不變 is unchanged', '變大 increases', '變小 decreases', '變成 0 becomes zero']), S(['變小 decreases', '變大 increases', '不變 is unchanged', '變號 changes sign']), S(['變小 decreases', '變大 increases', '不變 is unchanged', '變成 0 becomes zero'])],
    '功率三角形底邊 P 固定、高 Q 變矮 → 斜邊 |S| 變短 → I = |S|/V 變小。');
  C('11.8', 3, L8, '為什麼 P 不變',
    '加電容不會改變 P，因為理想電容 {0}。',
    'Adding the capacitor does not change P because an ideal capacitor ___.',
    [S(['平均功率為 0 absorbs zero average power', '電阻很大 has large resistance', '電壓很小 has small voltage', '只在直流下工作 works only at dc'])],
    '電容的電壓電流相差 90°，cos 90° = 0。');
  C('11.8', 4, L8, '電容要吃掉多少 Q',
    '電容要提供的虛功率 Q<sub>C</sub> = {0} = P(tan θ<sub>1</sub> − tan θ<sub>2</sub>)，其中 θ<sub>1</sub> 是 {1}。',
    'The required Q<sub>C</sub> = ___ = P(tan θ<sub>1</sub> − tan θ<sub>2</sub>), where θ<sub>1</sub> is ___.',
    [S(['Q₁ − Q₂', 'Q₂ − Q₁', 'Q₁ + Q₂', 'P − Q₁']), S(['校正前（較大）的功因角 the original (larger) angle', '校正後的功因角 the new angle', '電容的角度 the capacitor angle', '90°'])],
    '舊減新，因為要變小；順序寫反會算出負的電容。');
  C('11.8', 5, L8, '電容值公式',
    '電容值 C = Q<sub>C</sub> / {0}，其中 ω = {1}，V 用 rms。',
    'The capacitance is C = Q<sub>C</sub> / ___, where ω = ___ and V is rms.',
    [S(['(ω V²)', '(ω V)', '(V²/ω)', '(2ω V²)']), S(['2πf', 'f', 'f/2π', '60'])],
    'Q<sub>C</sub> = V²/|X<sub>C</sub>| = ωCV² → C = Q<sub>C</sub>/(ωV²)。直接拿 60 當 ω 會差 2π 倍。');
  C('11.8', 6, L8, '為什麼要校正',
    '電力公司要求工廠維持高功因，主要因為功因低時 {0}。',
    'Utilities require a high power factor mainly because a low pf ___.',
    [S(['同樣的 P 需要更大電流，線損 I²R 變大 requires more current and larger I²R losses', '電表會量錯 makes meters inaccurate', 'P 會變小 reduces P', '電壓會變成直流 turns the voltage into dc'])],
    'I = P/(V·pf)；線損跟 I² 成正比。課本 11.15：pf 0.8 → 0.95，電流少 16%、線損少 29%。');
  C('11.8', 7, L8, '電容越大越好嗎',
    '並聯的電容太大，會讓負載 {0}，線電流 {1}。',
    'If the shunt capacitor is too large, the load becomes ___ and the line current ___.',
    [S(['校正過頭、變成超前（電容性）overcorrected, leading', '剛好單位功因 exactly unity', '更電感性 more inductive', '開路 open']), S(['又變大 increases again', '變成 0 becomes zero', '持續變小 keeps decreasing', '不變 is unchanged'])],
    'Q 被壓成負的，|S| 又變大。目標通常是 0.9～0.95 落後，或剛好 1。');
  C('11.8', 8, L8, '解法：負載本來是電容性',
    '如果負載本來就是電容性（超前），要提高功因應該並聯 {0}。',
    'If the load is already capacitive (leading), to improve the pf you should connect ___ in parallel.',
    [S(['電感 an inductor', '電容 a capacitor', '電阻 a resistor', '電壓源 a voltage source'])],
    '用電感的 +Q 抵銷電容的 −Q：L = V²<sub>rms</sub>/(ωQ<sub>L</sub>)。', true);

  /* ═════════ 11.9 應用：瓦特計與電費 ═════════ */
  const L9 = P3 + '#app';
  C('11.9', 1, L9, '三種儀器',
    '瓦特計量 {0}；乏計量 {1}；電表（電度表）量 {2}。',
    'A wattmeter measures ___; a varmeter measures ___; a kilowatt-hour meter measures ___.',
    [S(['平均功率 P average power', '虛功率 Q reactive power', '用電度數 kWh energy', '視在功率 |S|']), S(['虛功率 Q reactive power', '平均功率 P', '用電度數 kWh', '電流 current']), S(['用電度數 kWh energy consumed', '平均功率 P', '虛功率 Q', '功率因數 pf'])],
    '電費是按 kWh（能量）收的；工廠還會看 Q 決定要裝多少補償電容。');
  C('11.9', 2, L9, '電流線圈',
    '瓦特計的電流線圈 {0} 在負載上，阻抗 {1}。',
    'The current coil of a wattmeter is connected in ___ with the load and has ___ impedance.',
    [S(['串聯 series', '並聯 parallel']), S(['極低（理想 0）very low', '極高（理想 ∞）very high', '等於負載 equal to the load', '可變 variable'])],
    '串進去像一條導線，不會改變電路的電流。');
  C('11.9', 3, L9, '電壓線圈',
    '瓦特計的電壓線圈 {0} 在負載兩端，阻抗 {1}。',
    'The voltage coil is connected in ___ across the load and has ___ impedance.',
    [S(['並聯 parallel', '串聯 series']), S(['極高（理想 ∞）very high', '極低（理想 0）very low', '等於負載 equal to the load', '負的 negative'])],
    '並上去像斷路，幾乎不分走電流。');
  C('11.9', 4, L9, '為什麼要這樣接',
    '電流線圈像短路、電壓線圈像開路，所以接上瓦特計 {0}。',
    'Because the current coil acts like a short and the voltage coil like an open, the wattmeter ___.',
    [S(['不會干擾原電路 does not disturb the circuit', '會讓電流加倍 doubles the current', '會讓功率變 0 makes P zero', '會改變功率因數 changes the pf'])],
    '量到的才是原電路真正的功率。');
  C('11.9', 5, L9, '讀數是什麼',
    '瓦特計的讀數等於線圈所接那一段的 {0}，也就是 {1}。',
    'The wattmeter reading equals ___ of the section it is connected to, i.e. ___.',
    [S(['平均功率 average power', '視在功率 apparent power', '虛功率 reactive power', '峰值功率 peak power']), S(['Re(S) = Vrms Irms cos(θv − θi)', '|S| = Vrms Irms', 'Im(S)', 'Vm Im'])],
    '指針有慣性，停在 v·i 的平均值。只讀線圈接的那一段，不含別的元件（課本 Example 11.16 不含線路那段）。', true);
  C('11.9', 6, L9, '1 度電',
    '電費單上的 1 度 = {0}。',
    'One “unit” on an electricity bill equals ___.',
    [S(['1 kWh', '1 kW', '1 W', '1 kVA'])],
    '度是能量（功率 × 時間）：1000 W 用 1 小時就是 1 度。MWh 要先 × 1000 換成 kWh。');
  C('11.9', 7, L9, '兩段式電費',
    '大用戶的兩段式電費 = {0} + {1}。',
    'A two-part tariff = ___ + ___.',
    [S(['固定（需量）費 fixed (demand) charge', '功因罰款 pf penalty', '虛功率費 VAR charge', '電壓費 voltage charge']), S(['電能費（按 kWh）energy charge', '電流費 current charge', '頻率費 frequency charge', '功率因數 pf'])],
    '固定費依最大需量（kW 或 kVA）收，反映發電輸電設備的成本；電能費依用掉的度數收，常常分級。');
  C('11.9', 8, L9, '功因罰款',
    '依課本的簡化費率，pf 低於門檻（例 0.85）會 {0}，高於門檻會 {1}。',
    'Under the textbook’s simplified tariff, a pf below the threshold (e.g. 0.85) results in ___, and above it results in ___.',
    [S(['罰款 a penalty', '減免 a credit', '斷電 disconnection', '沒有影響 no effect']), S(['減免 a credit', '罰款 a penalty', '斷電 disconnection', '加倍收費 a double charge'])],
    '每差 0.01 調整電能費的 0.1%（Example 11.18）。理由：pf 低 → 電流大 → 線損大。', true);

  window.__CH11C = { name: 'ch11c', items };
})();
