/* ============================================================
   電子學 CH1 PART 6 觀念填充題（自編練習，不用計算）
   每一小節 8 題，考觀念與「這類題目怎麼解」。題目先中文，下面附英文（en）。
   選項正解寫在第一個，hw.js 會打亂。下拉選項不能放 <sup>／<sub>、底線（符號直接寫 rd、IDQ、VT）。
   每一題考的點都在故事字幕或講義內文講過（10/27 逐題對照）。
   用法：<div class="hw-list" data-bank="__CH16C" data-sec="ss"></div>
   ============================================================ */
(function () {
  'use strict';
  const P = 'ch1-part6.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  const NO = { ss: '01', rd: '02', dcac: '03', qdes: '04', cap: '05', sseq: '06', sw: '07', opto: '08', sbd: '09', zd: '10' };
  /* C(小節, 第幾題, 標題, 中文題幹, 英文題幹, 空格, 解釋, 是否為解法題) */
  /* 題幹裡的 v_D、I_DQ 寫法 → 下標（選項不能有標籤，所以只轉題幹） */
  const sub = s => s.replace(/(^|[^A-Za-z])([A-Za-zγ])_([A-Za-z0-9]+)/g, '$1$2<sub>$3</sub>');
  const C = (sec, n, title, q, en, b, ex, how) =>
    items.push({ id: 'c16' + sec + '-' + n, kind: 'cf', sec, no: NO[sec] + '-' + n, how: !!how, link: P + '#' + sec, title, q: sub(q), en: sub(en), b, ex });

  /* ═════════ 01 小訊號 ═════════ */
  C('ss', 1, '直流與交流的分工',
    '二極體電路裡，直流電源決定 {0}；交流訊號讓二極體 {1}。',
    'In a diode circuit, the dc source sets ___, while the ac signal makes the diode ___.',
    [S(['工作點 Q（停在哪）the Q-point', '交流的頻率 the ac frequency', '二極體的材料 the diode material', '崩潰電壓 the breakdown voltage']),
     S(['在 Q 點附近小小地晃 swing slightly around Q', '直接崩潰 break down', '永遠 OFF stay off', '變成太陽能電池 become a solar cell'])],
    '直流把二極體擺在 Q 點（PART 5 的負載線交點），交流在 Q 點上下晃。');
  C('ss', 2, '符號的大小寫',
    'v_D 寫成 {0} 代表直流、{1} 代表交流、小寫加大寫下標代表總量。',
    'Uppercase symbol with uppercase subscript (e.g. V_DQ) denotes ___; lowercase with lowercase subscript (v_d) denotes ___.',
    [S(['大寫＋大寫下標（VDQ）uppercase/uppercase', '小寫＋小寫下標（vd）lowercase/lowercase', '小寫＋大寫下標（vD）lowercase/uppercase', '全部斜體 all italic']),
     S(['小寫＋小寫下標（vd）lowercase/lowercase', '大寫＋大寫下標（VDQ）uppercase/uppercase', '小寫＋大寫下標（vD）lowercase/uppercase', '加一撇 primed'])],
    'v<sub>D</sub> = V<sub>DQ</sub> + v<sub>d</sub>：總量 = 直流 + 交流。考卷靠大小寫分這三個量。');
  C('ss', 3, '小訊號的「小」',
    '「小訊號」的意思是二極體上的交流電壓 v_d 遠小於 {0}。',
    '"Small signal" means the ac diode voltage v_d is much smaller than ___.',
    [S(['熱電壓 VT ≈ 26 mV the thermal voltage', '電源電壓 VPS the supply voltage', '崩潰電壓 the breakdown voltage', '1 V'])],
    'e<sup>v<sub>d</sub>/V<sub>T</sub></sup> ≈ 1 + v<sub>d</sub>/V<sub>T</sub> 只有在 v<sub>d</sub> ≪ V<sub>T</sub> 時成立。直流可以很大，沒關係。');
  C('ss', 4, '為什麼可以當直線',
    '交流夠小時，Q 點附近那一小段指數曲線可以用 {0} 近似，所以二極體對交流像一顆 {1}。',
    'When the ac signal is small, the curve near Q can be approximated by ___, so the diode behaves like ___ for ac.',
    [S(['切線 the tangent line', '水平線 a horizontal line', '拋物線 a parabola', '垂直線 a vertical line']),
     S(['電阻 a resistor', '電容 a capacitor', '電池 a battery', '開關 a switch'])],
    '切線 = 直線 = 電流正比電壓 = 電阻的行為（講義 1-3 AC Model）。');
  C('ss', 5, '指數的加法',
    'i<sub>D</sub> = I<sub>S</sub>e<sup>(V<sub>DQ</sub> + v<sub>d</sub>)/V<sub>T</sub></sup> 可以拆成 {0}。',
    'i<sub>D</sub> = I<sub>S</sub>e<sup>(V<sub>DQ</sub> + v<sub>d</sub>)/V<sub>T</sub></sup> can be split into ___.',
    [S(['IDQ 乘上「e 的 vd/VT 次方」IDQ times exp(vd/VT)', 'IDQ 加上「e 的 vd/VT 次方」IDQ plus exp(vd/VT)', 'IS 除以 vd IS divided by vd', 'VDQ 乘 vd VDQ times vd'])],
    '指數的加法變乘法：e<sup>a+b</sup> = e<sup>a</sup>e<sup>b</sup>，直流那一項就是 I<sub>DQ</sub>。');
  C('ss', 6, '交流太大',
    '交流太大時，電流往上晃的量會 {0} 往下晃的量，這種波形變形叫 {1}。',
    'If the ac signal is too large, the upward current swing is ___ the downward swing; this waveform distortion is called ___.',
    [S(['大於 larger than', '小於 smaller than', '等於 equal to', '不一定 unrelated to']),
     S(['非線性失真 nonlinear distortion', '崩潰 breakdown', '整流 rectification', '共振 resonance'])],
    '指數曲線往上越來越陡：上半週被拉高、下半週被壓扁（模組 01、例題 01）。');
  C('ss', 7, 'Q 點變，斜率變',
    'Q 點位置不同 → 曲線斜率不同 → {0} 不同 → 交流響應不同。',
    'A different Q-point gives a different slope, hence a different ___ and a different ac response.',
    [S(['增量電阻 rd incremental resistance', '崩潰電壓 breakdown voltage', 'IS saturation current', '熱電壓 VT thermal voltage'])],
    '講義 1-3 的 NOTE。這就是為什麼交流分析之前一定要先做直流分析。', true);
  C('ss', 8, '拿到題目第一步',
    '題目給「直流＋小交流」，第一步是 {0}。',
    'Given a "dc plus small ac" problem, the first step is ___.',
    [S(['把每個量拆成直流和交流，先找 Q 點 split into dc and ac, find Q first', '直接把交流代進指數 plug the ac into the exponential', '先算交流增益 compute the ac gain first', '把二極體當短路 treat the diode as a short'])],
    '先 DC（Q 點、r<sub>d</sub>），再 AC，最後相加。', true);

  /* ═════════ 02 增量電阻 ═════════ */
  C('rd', 1, 'r_d 的定義',
    '增量電阻 r_d 是 Q 點 {0} 的倒數。',
    'The incremental resistance r_d is the reciprocal of ___ at the Q-point.',
    [S(['切線斜率 di/dv the tangent slope', '原點到 Q 的斜率 V/I the slope from the origin', '曲線下的面積 the area under the curve', 'IS'])],
    '切線斜率 = 增量電導 g<sub>d</sub>，倒數是 r<sub>d</sub>。原點到 Q 是直流電阻，不一樣。');
  C('rd', 2, '公式',
    'r_d = {0}。',
    'r_d = ___.',
    [S(['VT / IDQ', 'VDQ / IDQ', 'IDQ / VT', 'VT · IDQ'])],
    '微分後 g<sub>d</sub> = I<sub>DQ</sub>/V<sub>T</sub>，取倒數。');
  C('rd', 3, '電流越大',
    'I_DQ 越大，Q 點附近曲線越 {0}，r_d 越 {1}。',
    'The larger I_DQ is, the ___ the curve near Q, and the ___ r_d is.',
    [S(['陡 steeper', '平 flatter', '彎 more curved', '直 straighter']), S(['小 smaller', '大 larger', '不變 unchanged', '負 negative'])],
    'r<sub>d</sub> ∝ 1/I<sub>DQ</sub>：1 mA → 26 Ω、2 mA → 13 Ω。');
  C('rd', 4, '兩個倒數',
    '增量電阻 r_d 和 {0} 互為倒數。',
    'The incremental resistance r_d and ___ are reciprocals.',
    [S(['增量電導 gd incremental conductance', '擴散電容 diffusion capacitance', '熱電壓 thermal voltage', '工作點電流 Q-point current'])],
    '講義 1-4：增量電阻（擴散電阻）與增量電導（擴散電導）互為倒數。');
  C('rd', 5, '微分時圈起來的那塊',
    '對 i<sub>D</sub> 微分得 (I<sub>S</sub>/V<sub>T</sub>)e<sup>V<sub>DQ</sub>/V<sub>T</sub></sup>；其中 I<sub>S</sub>e<sup>V<sub>DQ</sub>/V<sub>T</sub></sup> 就是 {0}。',
    'Differentiating gives (I<sub>S</sub>/V<sub>T</sub>)e<sup>V<sub>DQ</sub>/V<sub>T</sub></sup>; the factor I<sub>S</sub>e<sup>V<sub>DQ</sub>/V<sub>T</sub></sup> is just ___.',
    [S(['IDQ', 'VDQ', 'VT', 'rd'])],
    '講義 1-11 紅筆圈的地方：順偏、指數 ≫ 1 時 I<sub>DQ</sub> ≈ I<sub>S</sub>e<sup>V<sub>DQ</sub>/V<sub>T</sub></sup>。');
  C('rd', 6, '講義 1-12 的數字',
    '講義 1-12 的例子（I_S = 1e−14 A、V_DQ = 0.6 V）算出 r_d 約 {0}。',
    'In the example on slide 1-12 (I_S = 1e−14 A, V_DQ = 0.6 V), r_d is about ___.',
    [S(['247 Ω', '26 Ω', '2.47 kΩ', '0.6 Ω'])],
    'I<sub>DQ</sub> = 105.24 μA，r<sub>d</sub> = 0.026/105.24 μA ≈ 247 Ω。微分法和近似法一樣（MATCHED）。');
  C('rd', 7, '單位陷阱',
    'r_d = 0.026 V / 0.88 mA，答案的單位直接是 {0}。',
    'r_d = 0.026 V / 0.88 mA gives an answer directly in ___.',
    [S(['kΩ（0.0295 kΩ）', 'Ω', 'MΩ', 'mΩ'])],
    'V ÷ mA = kΩ：0.0295 kΩ = 29.5 Ω。', true);
  C('rd', 8, '求 r_d 的流程',
    '題目只給電路沒給 I_DQ，求 r_d 要先 {0}。',
    'If the problem gives a circuit but not I_DQ, to find r_d you must first ___.',
    [S(['做 DC 分析求 IDQ do a dc analysis for IDQ', '做 AC 分析 do the ac analysis', '量崩潰電壓 measure the breakdown voltage', '假設 rd = 0 assume rd = 0'])],
    'r<sub>d</sub> 跟著 Q 點走，Q 點只能由直流電路決定。', true);

  /* ═════════ 03 DC + AC ═════════ */
  C('dcac', 1, 'DC 分析時的交流源',
    'DC 分析時，獨立交流電壓源設為 0 V，等效為 {0}；獨立交流電流源設為 0 A，等效為 {1}。',
    'In dc analysis, an independent ac voltage source becomes ___, and an independent ac current source becomes ___.',
    [S(['短路 a short circuit', '開路 an open circuit', 'rd', '電池 a battery']), S(['開路 an open circuit', '短路 a short circuit', 'rd', '電容 a capacitor'])],
    '講義 1-7：電壓源 0 V = 兩端電壓一樣 = 導線；電流源 0 A = 沒電流 = 斷開。');
  C('dcac', 2, 'AC 分析時的直流源',
    'AC 分析時，獨立直流電壓源的交流增量為 0，等效為 {0}，又叫 {1}。',
    'In ac analysis, an independent dc voltage source has zero ac increment, so it becomes ___, also called ___.',
    [S(['短路 a short circuit', '開路 an open circuit', 'rd', '電容 a capacitor']), S(['交流接地 ac ground', '虛短路 virtual short', '浮接 floating', '崩潰 breakdown'])],
    '直流電壓源的電壓不變，「變化量」是 0 → 交流看它是一條導線接到地。');
  C('dcac', 3, '二極體在兩張電路裡',
    'DC 電路裡二極體換成 {0}；AC 電路裡二極體換成 {1}。',
    'In the dc circuit the diode is replaced by ___; in the ac circuit by ___.',
    [S(['Vγ 電池（定電壓降）a Vγ battery', 'rd', '短路 a short', '電容 a capacitor']), S(['rd', 'Vγ 電池 a Vγ battery', '開路 an open', '電流源 a current source'])],
    '電池是直流的東西；交流只看得到斜率（r<sub>d</sub>）。');
  C('dcac', 4, '順序',
    '一定要先做 {0}，因為 {1}。',
    'You must do the ___ first, because ___.',
    [S(['DC 分析 dc analysis', 'AC 分析 ac analysis', '頻率響應 frequency response', '崩潰分析 breakdown analysis']),
     S(['rd 要用 IDQ 算 rd depends on IDQ', '交流比較大 ac is larger', '直流比較簡單所以隨便 dc is easier', '課本規定 the textbook says so'])],
    '講義 1-10：交流阻抗與直流工作點有關。');
  C('dcac', 5, 'Example 1.11 的 I_DQ',
    'Example 1.11（V_PS = 5 V、R = 5 kΩ、Vγ = 0.6 V）的 I_DQ 是 {0}。',
    'In Example 1.11 (V_PS = 5 V, R = 5 kΩ, Vγ = 0.6 V), I_DQ is ___.',
    [S(['0.88 mA', '1 mA', '0.12 mA', '4.4 mA'])],
    '(5 − 0.6)/5k = 0.88 mA；V<sub>O</sub> = 4.4 V；r<sub>d</sub> = 29.5 Ω。');
  C('dcac', 6, '交流輸出幾乎等於輸入',
    'Example 1.11 的 v_o ≈ 0.0995 sin ωt，幾乎等於 v_i = 0.1 sin ωt，因為 {0}。',
    'In Example 1.11, v_o ≈ 0.0995 sin ωt is almost equal to v_i because ___.',
    [S(['rd（29.5 Ω）遠小於 R（5 kΩ）rd ≪ R', 'rd 遠大於 R rd ≫ R', '二極體崩潰了 the diode broke down', '頻率很高 the frequency is high'])],
    'AC 電路是 r<sub>d</sub> 跟 R 分壓，r<sub>d</sub> 很小，交流幾乎全部落在 R 上。');
  C('dcac', 7, '為什麼能相加',
    'DC 和 AC 的結果可以直接相加（重疊），是因為在 Q 點小訊號線性化之後，AC 模型是 {0}。',
    'The dc and ac results can be added because, after small-signal linearization at Q, the ac model is ___.',
    [S(['線性電路 a linear circuit', '非線性電路 a nonlinear circuit', '開路 an open circuit', '時變的 time-varying'])],
    '講義 1-8：片段線性模型要先判斷在哪一段，整體仍非線性；Q 點確定後，二極體對交流是固定電阻 → 線性 → 可以重疊。');
  C('dcac', 8, '標準流程',
    'DC＋AC 題目的流程：DC 求 Q 點 → 算 {0} → AC 求交流 → 相加 → 檢查 v_d ≪ 26 mV。',
    'Procedure: dc for Q → compute ___ → ac analysis → add → check v_d ≪ 26 mV.',
    [S(['rd = VT/IDQ', 'Vγ', 'PIV', 'Cj'])],
    '講義 1-10 的步驟。', true);

  /* ═════════ 04 Q 點與失真 ═════════ */
  C('qdes', 1, '截止失真',
    'Q 點太低、交流太大，負半週把二極體推到 {0}，輸出被削平，叫 {1}。',
    'With a low Q-point and a large ac input, the negative half-cycle drives the diode into ___, clipping the output; this is ___.',
    [S(['OFF（截止）cutoff', '崩潰 breakdown', '飽和 saturation', '高頻 high frequency']), S(['截止失真 cutoff clipping', '交越失真 crossover distortion', '儲存時間 storage time', '整流 rectification'])],
    '講義 1-9：cutoff clipping。');
  C('qdes', 2, '不截止的條件',
    '用定電壓降模型，二極體在負半週谷底也不 OFF 的條件是 {0}。',
    'With the constant-voltage-drop model, the diode stays on at the negative peak if ___.',
    [S(['VPS − Vm > Vγ', 'VPS + Vm > Vγ', 'VPS > PIV', 'Vm > VT'])],
    '最低點推力 = V<sub>PS</sub> − V<sub>m</sub>，要大於 0.6～0.7 V。', true);
  C('qdes', 3, '要跟 26 mV 比的是誰',
    '判斷小訊號成不成立，要拿 {0} 跟 26 mV 比。',
    'To check the small-signal condition, compare ___ with 26 mV.',
    [S(['二極體兩端的交流 vd the ac voltage across the diode', '輸入的交流 vi the ac input', '電源 VPS the supply', '輸出直流 VO the dc output'])],
    'v<sub>d</sub> = v<sub>i</sub> · r<sub>d</sub>/(r<sub>d</sub> + R)，大部分交流落在 R 上。');
  C('qdes', 4, '偏壓點設計',
    'DC operating point design（偏壓點設計）就是 {0}。',
    'DC operating point (bias point) design means ___.',
    [S(['把 Q 點擺在讓交流有空間晃的地方 placing Q so the ac signal has room to swing', '讓二極體崩潰 making the diode break down', '把直流電源拿掉 removing the dc source', '讓 rd 等於 R making rd equal R'])],
    '講義 1-9 標題：DC operating point design 與輸入 AC 過大所形成的失真。');
  C('qdes', 5, '救截止失真',
    '要避免截止失真，可以 {0}。',
    'To avoid cutoff clipping, you can ___.',
    [S(['提高 VPS（Q 點）或減小輸入交流 raise VPS or reduce the ac input', '降低 VPS lower VPS', '換一顆 Vγ 更大的二極體 use a larger Vγ', '把 R 拿掉 remove R'])],
    'Q 點高一點、交流小一點，谷底才推得開。', true);
  C('qdes', 6, '非線性失真的樣子',
    '沒有截止但交流偏大時，輸出上下半週 {0}。',
    'Without cutoff but with a somewhat large ac signal, the output half-cycles are ___.',
    [S(['不對稱 asymmetric', '完全一樣 identical', '都被削平 both clipped', '變成方波 square waves'])],
    '指數曲線上彎：往上多、往下少。');
  C('qdes', 7, '截止 vs 崩潰',
    '小訊號電路的截止削波，是二極體 {0}，不是 {1}。',
    'Cutoff clipping in a small-signal circuit is the diode ___, not ___.',
    [S(['順偏被推到 OFF turned off from forward bias', '逆向崩潰 reverse breakdown', '溫度太高 overheating', '被短路 shorted']), S(['逆向崩潰 reverse breakdown', '截止 cutoff', 'OFF', '不導通 nonconducting'])],
    '總推力不到 V<sub>γ</sub> → OFF；跟逆偏超過 BV 的崩潰無關。');
  C('qdes', 8, '判斷流程',
    '判斷會不會失真的順序：算 Q 點 → 檢查 {0} → 檢查 vd 夠不夠小。',
    'To check for distortion: find Q → check ___ → check whether vd is small enough.',
    [S(['谷底會不會 OFF whether the diode turns off at the trough', 'PIV', '頻率 the frequency', '儲存時間 the storage time'])],
    '先看會不會截止（粗），再看非線性（細）。', true);

  /* ═════════ 05 兩種電容 ═════════ */
  C('cap', 1, '擴散電容的電荷在哪',
    '擴散電容的「電荷」是順偏時注入對面 {0} 的少數載子。',
    'The "charge" of the diffusion capacitance is the minority carriers injected into the ___ on the other side.',
    [S(['中性區 neutral region', '空乏區 depletion region', '金屬接點 metal contact', '電源 supply'])],
    '講義 1-14：注入的少數載子在中性區形成暫時性的儲存電荷，像電容板上的電荷。');
  C('cap', 2, '像倉庫',
    '順偏電壓增加 → 注入更多少數載子 → 儲存電荷 {0} → 類似電容 {1}。',
    'Increasing forward bias → more injected minority carriers → stored charge ___ → like a capacitor being ___.',
    [S(['增加 increases', '減少 decreases', '不變 stays the same', '消失 vanishes']), S(['充電 charged', '放電 discharged', '崩潰 broken down', '短路 shorted'])],
    '講義 1-13 NOTE。');
  C('cap', 3, '頻率升高',
    '頻率升高時，少數載子來不及跟著充放電，dQ {0}，擴散電容 {1}。',
    'At higher frequency the minority carriers cannot follow, so dQ ___ and the diffusion capacitance ___.',
    [S(['變小 decreases', '變大 increases', '不變 is unchanged', '變負 becomes negative']), S(['變小 decreases', '變大 increases', '不變 is unchanged', '變成接面電容 becomes Cj'])],
    '講義 1-15：C = dQ/dV，dQ 跟不上就變小。');
  C('cap', 4, '順偏的主角',
    '順偏＋交流訊號時，一般 {0}。',
    'Under forward bias with an ac signal, generally ___.',
    [S(['擴散電容 Cd ≫ 接面電容 Cj Cd ≫ Cj', '接面電容 Cj ≫ 擴散電容 Cd Cj ≫ Cd', '兩者相等 they are equal', '兩者都是 0 both are zero'])],
    '講義 1-18：擴散電容在順偏下通常是主導電容。（1-13 Remark 寫反，見勘誤 ①。）');
  C('cap', 5, '接面電容什麼時候在',
    '接面電容 Cj 在 {0} 都存在。',
    'The junction capacitance Cj exists ___.',
    [S(['DC、AC、順偏、逆偏 under dc, ac, forward and reverse bias', '只有逆偏 only under reverse bias', '只有順偏 only under forward bias', '只有高頻 only at high frequency'])],
    '講義 1-18 NOTE：空乏區一直都在；電容值由偏壓決定。');
  C('cap', 6, '逆偏剩誰',
    '逆偏時沒有注入，{0} 幾乎是 0，只剩 {1}。',
    'Under reverse bias there is no injection, so ___ is nearly zero and only ___ remains.',
    [S(['擴散電容 Cd', '接面電容 Cj', 'rd', 'VT']), S(['接面電容 Cj', '擴散電容 Cd', 'rs', 'IS'])],
    '沒有庫存就沒有 C<sub>d</sub>；空乏區的 C<sub>j</sub> 還在（PART 3 的變容二極體）。');
  C('cap', 7, 'C_d 跟電流',
    '課本式子 Cd = τ·IDQ/(2VT)：IDQ 越大，Cd 越 {0}。',
    'From Cd = τ·IDQ/(2VT), a larger IDQ gives a ___ Cd.',
    [S(['大 larger', '小 smaller', '不變 unchanged', '負 negative'])],
    '電流越大，注入越多，庫存越多。', true);
  C('cap', 8, '分辨題型',
    '題目問「逆偏的二極體電容」，要用 {0}；問「順偏高頻」，主要考慮 {1}。',
    'For "capacitance of a reverse-biased diode" use ___; for "forward bias at high frequency" mainly consider ___.',
    [S(['接面電容 Cj', '擴散電容 Cd', 'rd', 'PIV']), S(['擴散電容 Cd', '接面電容 Cj', '崩潰電壓 BV', 'IS'])],
    '先看偏壓方向，再決定哪一個電容是主角。', true);

  /* ═════════ 06 小訊號等效電路 ═════════ */
  C('sseq', 1, '並聯還是串聯',
    '簡化的小訊號等效電路是 rd 和 Cd {0}。',
    'The simplified small-signal model is rd ___ Cd.',
    [S(['並聯 in parallel with', '串聯 in series with', '取代 replaced by', '無關 unrelated to'])],
    '講義 1-16 Fig 1.38(a)：交流電流有兩條路，一條穿過（r<sub>d</sub>）、一條充放電（C<sub>d</sub>）。');
  C('sseq', 2, '導納',
    '並聯時把 {0} 相加：Y = gd + jωCd。',
    'For parallel elements, add the ___: Y = gd + jωCd.',
    [S(['導納 admittances', '阻抗 impedances', '電壓 voltages', '電荷 charges'])],
    '電導納（admittance）Y，g<sub>d</sub> = 1/r<sub>d</sub>。');
  C('sseq', 3, '頻率升高',
    '頻率升高，電容的阻抗 {0}，二極體的等效阻抗 {1}。',
    'As frequency rises, the capacitor impedance ___ and the diode equivalent impedance ___.',
    [S(['降低 decreases', '升高 increases', '不變 is unchanged', '變成無限大 becomes infinite']), S(['下降 decreases', '上升 increases', '不變 is unchanged', '變成 rd becomes rd'])],
    '講義 1-16 NOTE：擴散電容和電阻形成 RC 電路。');
  C('sseq', 4, '低頻時',
    '頻率很低時，電容像 {0}，二極體的交流阻抗約等於 {1}。',
    'At very low frequency the capacitor looks like ___, and the diode ac impedance is about ___.',
    [S(['斷路 an open circuit', '短路 a short circuit', '電池 a battery', '電阻 a resistor']), S(['rd', '0', 'Cd', 'R'])],
    '1/(ωC) 很大，交流都走 r<sub>d</sub>。');
  C('sseq', 5, '完整模型',
    '完整的小訊號等效電路（Fig 1.38(b)）還要加上接面電容 Cj 和 {0}。',
    'The complete small-signal model (Fig 1.38(b)) also includes Cj and ___.',
    [S(['中性區電阻 rs the neutral-region resistance rs', '崩潰電壓 BV', '光電流 Iph', '熱電壓 VT'])],
    '講義 1-16：C<sub>j</sub> 並聯、r<sub>s</sub>（p、n 中性區的電阻）串聯。');
  C('sseq', 6, '轉折點',
    '電阻那一支和電容那一支一樣大（1/rd = ωC）時的頻率，叫 {0}。',
    'The frequency at which 1/rd = ωC is called the ___.',
    [S(['轉折頻率 corner frequency', '共振頻率 resonant frequency', '截止電壓 cutoff voltage', '儲存時間 storage time'])],
    'f<sub>c</sub> = 1/(2πr<sub>d</sub>C)，這時 |Z| = r<sub>d</sub>/√2。', true);
  C('sseq', 7, '什麼時候可以只用 rd',
    '低頻的小訊號題目（例如 Example 1.11），二極體可以只用 {0} 代表。',
    'In low-frequency small-signal problems (e.g. Example 1.11), the diode can be modeled by ___ alone.',
    [S(['rd', 'Cd', 'Cj', 'rs 和 Cj rs and Cj'])],
    '電容只有高頻（或開關）才要考慮。', true);
  C('sseq', 8, '求阻抗的流程',
    '求高頻時的二極體阻抗：先 DC 求 IDQ → 算 rd、Cd → {0} → 取倒數。',
    'To find the diode impedance at high frequency: dc for IDQ → rd and Cd → ___ → take the reciprocal.',
    [S(['Y = 1/rd + jωC 相加 add the admittances', '把 rd 和 1/(ωC) 直接相加 add rd and 1/(ωC)', '只算 Cd only Cd', '只算 rd only rd'])],
    '並聯先加導納，再倒過來變阻抗。', true);

  /* ═════════ 07 開關暫態 ═════════ */
  C('sw', 1, '剛切到逆偏',
    '二極體從順偏切到逆偏的瞬間，接面裡還有大量 {0}，所以二極體仍像 {1}。',
    'Right after switching from forward to reverse, the junction still holds many ___, so the diode still acts like ___.',
    [S(['少數載子 minority carriers', '金屬原子 metal atoms', '光子 photons', '固定離子 fixed ions']), S(['短路 a short', '開路 an open', '電容 a capacitor', '崩潰的二極體 a broken-down diode'])],
    '講義 1-24：載子不可能瞬間消失，還能暫時支撐導通電流，v<sub>D</sub> ≈ 0。');
  C('sw', 2, '儲存時間內的電流',
    '儲存時間 ts 內，逆向恢復電流大約 {0}。',
    'During the storage time ts, the reverse recovery current is roughly ___.',
    [S(['固定在 IR ≈ VR/R constant at about VR/R', '0', '一直增加 increasing', '等於 IF equal to IF in the same direction'])],
    '講義 1-22：反向電流主要在「掃除」載子，短時間內幾乎保持恆定。');
  C('sw', 3, 'ts 的定義',
    '儲存時間 ts 是 {0} 所需的時間。',
    'The storage time ts is the time needed for ___.',
    [S(['少數載子濃度回到熱平衡 the minority carriers to return to equilibrium', '空乏區消失 the depletion region to vanish', '電流從 0 升到 IF the current to rise to IF', '二極體崩潰 breakdown'])],
    '講義 1-22：第一階段。');
  C('sw', 4, 'tf 在幹嘛',
    'ts 之後是掉落時間 tf：空乏區 {0}，反向電流 {1}。',
    'After ts comes the fall time tf: the depletion region ___ and the reverse current ___.',
    [S(['擴大重建 widens and rebuilds', '消失 disappears', '不變 stays the same', '變成金屬 becomes metallic']), S(['逐漸降到 0 decays to zero', '突然變大 jumps up', '變成順向 becomes forward', '保持 IR stays at IR'])],
    '講義 1-22、1-27：第二階段。位障升高、強電場擋住注入並掃走剩下的載子。');
  C('sw', 5, '開與關誰快',
    '一般而言，二極體的 turn-off time {0} turn-on time。',
    'In general, the diode turn-off time is ___ the turn-on time.',
    [S(['大於 greater than', '小於 less than', '等於 equal to', '無關 unrelated to'])],
    '關閉要先清庫存，所以比較慢（講義 1-22）。');
  C('sw', 6, 'ts 期間的電壓',
    'ts 期間二極體兩端電壓 vD {0}，外加的逆壓幾乎都落在 {1}。',
    'During ts the diode voltage vD is ___, and the applied reverse voltage appears mostly across ___.',
    [S(['接近 0 about zero', '等於 −VR equal to −VR', '等於 BV equal to BV', '很大的正值 large and positive']), S(['串聯電阻 R the series resistor', '二極體 the diode', '電源內阻 the source resistance', '空乏區 the depletion region'])],
    '講義 1-24：外部逆壓還沒「建立」起來。');
  C('sw', 7, '怎麼關得快',
    '想讓二極體關得快，可以 {0}。',
    'To make a diode turn off faster, you can ___.',
    [S(['加大反向電流 IR，或改用蕭特基 increase IR or use a Schottky diode', '加大順向電流 IF increase IF', '降低反向電壓 reduce VR', '加大少數載子壽命 increase the lifetime'])],
    '掃得越用力越快；蕭特基沒有少數載子庫存。', true);
  C('sw', 8, '讀波形',
    '看開關波形題目：電流先 +IF，切換後先 {0} 一段 ts，再在 tf 內歸零。',
    'Reading the switching waveform: current is +IF, then after switching it ___ for ts, then decays to zero in tf.',
    [S(['反向固定 −IR stays at −IR', '立刻變 0 drops to zero', '繼續 +IF stays at +IF', '振盪 oscillates'])],
    '講義 1-22 的波形。', true);

  /* ═════════ 08 光電元件 ═════════ */
  C('opto', 1, '太陽能電池',
    '太陽能電池：光照到空乏區產生 {0}，被電場分開形成光電流。',
    'Solar cell: light in the depletion region creates ___, which the field separates into a photocurrent.',
    [S(['電子電洞對 EHPs electron-hole pairs', '金屬離子 metal ions', '少數載子庫存 stored minority carriers', '熱電壓 thermal voltage'])],
    '講義 1-19（Fig 1.39）。');
  C('opto', 2, '材料',
    '太陽能電池的材料有 Si、GaAs 與 {0}；一般而言 {1} 的轉換效率較好。',
    'Solar cell materials include Si, GaAs and ___; generally ___ have better conversion efficiency.',
    [S(['III-V 化合物 III-V compounds', '銅 copper', '玻璃 glass', '塑膠 plastic']), S(['化合物半導體 compound semiconductors', '矽 silicon', '金屬 metals', '絕緣體 insulators'])],
    '講義 1-19 NOTE。III-V：IIIA 族（硼鋁鎵銦鉈）＋ VA 族（氮磷砷銻鉍）。');
  C('opto', 3, '光二極體的偏壓',
    '光二極體類似太陽能電池，但操作在 {0}，光電流正比於 {1}。',
    'A photodiode is like a solar cell but operates under ___, with photocurrent proportional to ___.',
    [S(['逆偏 reverse bias', '順偏 forward bias', '崩潰區 breakdown', '零偏 zero bias']), S(['入射光 the incident light', '溫度 temperature', '順向電壓 forward voltage', '頻率 frequency'])],
    '講義 1-20：光偵測器，光訊號 → 電訊號。');
  C('opto', 4, 'LED 的機制',
    'LED：順偏 → 電子電洞擴散過空乏區 → 多出的少數載子與多數載子 {0} → 放出 {1}。',
    'LED: forward bias → carriers diffuse across → excess minority carriers ___ with majority carriers → emit ___.',
    [S(['復合 recombine', '崩潰 break down', '分離 separate', '漂移 drift']), S(['光子 photons', '電子 electrons', '熱電壓 voltage', '離子 ions'])],
    '講義 1-20：復合時能量降低，用光的方式散出。');
  C('opto', 5, '能量方向',
    '太陽能電池和光二極體把 {0}；LED 把 {1}。',
    'Solar cells and photodiodes convert ___; LEDs convert ___.',
    [S(['光 → 電 light to electricity', '電 → 光 electricity to light', '熱 → 電 heat to electricity', '電 → 熱 electricity to heat']), S(['電 → 光 electricity to light', '光 → 電 light to electricity', '光 → 熱 light to heat', '電 → 聲 electricity to sound'])],
    '同一個 pn 接面，兩個方向。');
  C('opto', 6, '雷射二極體',
    'LED 加上 {0}，讓光來回反射放大、產生受激放射，就成為雷射二極體。',
    'Adding ___ to an LED, so light bounces back and forth and stimulated emission occurs, makes a laser diode.',
    [S(['光學腔 an optical cavity', '金屬接面 a metal contact', '散熱片 a heat sink', '電容 a capacitor'])],
    '講義 1-21 Application (1)。');
  C('opto', 7, '光通訊',
    '光通訊系統（Fig 1.40）：發射端用 {0}，經光纖，接收端用 {1}。',
    'In the optical system (Fig 1.40), the transmitter uses ___ and, through a fiber, the receiver uses ___.',
    [S(['LED（順偏）an LED, forward biased', '光二極體 a photodiode', '齊納二極體 a Zener diode', '太陽能電池 a solar cell']), S(['光二極體（逆偏）a photodiode, reverse biased', 'LED', '蕭特基二極體 a Schottky diode', '齊納二極體 a Zener diode'])],
    '講義 1-21 Application (2)。', true);
  C('opto', 8, '分辨三種',
    '題目說「不加電源、接負載就有電流」，指的是 {0}。',
    'A device that drives current into a load with no external supply is ___.',
    [S(['太陽能電池 a solar cell', '光二極體 a photodiode', 'LED', '蕭特基二極體 a Schottky diode'])],
    '太陽能電池本身就是電源；光二極體要逆偏、LED 要順偏。', true);

  /* ═════════ 09 蕭特基 ═════════ */
  C('sbd', 1, '結構',
    '蕭特基二極體是由 {0} 接觸中度摻雜的 {1} 型半導體形成的整流接面。',
    'A Schottky diode is a rectifying junction formed by ___ contacting a moderately doped ___-type semiconductor.',
    [S(['金屬 a metal', 'p 型半導體 p-type', '絕緣體 an insulator', '另一個 n 型 another n-type']), S(['n', 'p', '本質 intrinsic', 'III-V'])],
    '講義 1-28（Fig 1.41）。');
  C('sbd', 2, '空乏區怎麼來',
    'n 型半導體的電子流向金屬，直到 {0} 對齊，靠近金屬的 n 型留下帶 {1} 電的空乏區。',
    'Electrons flow from the n-type to the metal until the ___ align, leaving a ___-charged depletion region near the metal.',
    [S(['費米能階 Fermi levels', '價帶 valence bands', '電流 currents', '溫度 temperatures']), S(['正 positive', '負 negative', '不帶 no', '交替 alternating'])],
    '講義 1-28 NOTE。');
  C('sbd', 3, '導電機制',
    '蕭特基二極體靠 {0} 越過接面導電，所以 {1}。',
    'A Schottky diode conducts by ___ crossing the junction, so ___.',
    [S(['多數載子 majority carriers', '少數載子 minority carriers', '光子 photons', '離子 ions']),
     S(['幾乎沒有儲存時間 ts，切換快 almost no storage time, fast switching', '儲存時間很長 long storage time', '不能導通 it cannot conduct', '只能逆偏 it only works reversed'])],
    '講義 1-29：電子跑進金屬還是多數，不會變成要清的庫存。');
  C('sbd', 4, 'I_S 比較',
    '相同面積下，蕭特基的 IS {0} pn 接面的 IS，所以同樣電流下順向電壓較 {1}。',
    'For the same area, the Schottky IS is ___ the pn IS, so at the same current its forward voltage is ___.',
    [S(['遠大於 much larger than', '遠小於 much smaller than', '等於 equal to', '略小於 slightly smaller than']), S(['小 smaller', '大 larger', '一樣 the same', '負 negative'])],
    '講義 1-29（Fig 1.42）。');
  C('sbd', 5, '為什麼 I_S 大',
    'pn 的 IS 來自少數載子漂移所以很小；蕭特基的 IS 來自 {0}，所以很大。',
    'The pn IS comes from minority-carrier drift and is small; the Schottky IS comes from ___, so it is large.',
    [S(['金屬端大量的多數載子（電子）the many electrons in the metal', '光照 light', '崩潰 breakdown', '溫度 temperature'])],
    '講義 1-30。');
  C('sbd', 6, 'Example 1.12',
    'Example 1.12：IS 分別為 1e−12 A 和 1e−8 A，1 mA 時順向電壓約為 {0}。',
    'Example 1.12: with IS = 1e−12 A and 1e−8 A, the voltages at 1 mA are about ___.',
    [S(['0.539 V 與 0.299 V', '0.7 V 與 0.3 V', '0.299 V 與 0.539 V', '0.6 V 與 0.6 V'])],
    'V = V<sub>T</sub> ln(I/I<sub>S</sub>)：ln(10<sup>9</sup>)、ln(10<sup>5</sup>)。');
  C('sbd', 7, '每 10 倍',
    'IS 每大 10 倍，同樣電流下電壓少約 {0}。',
    'Each 10× increase in IS lowers the voltage at the same current by about ___.',
    [S(['60 mV', '26 mV', '0.7 V', '10 mV'])],
    'V<sub>T</sub> ln 10 = 0.026 × 2.303 ≈ 60 mV（PART 4 的口訣）。10<sup>4</sup> 倍 → 0.24 V。', true);
  C('sbd', 8, '用在哪',
    '蕭特基二極體高速、壓降小，大量用在 {0}。',
    'Being fast with a low drop, Schottky diodes are widely used in ___.',
    [S(['IC 設計 integrated circuit design', '高壓整流 high-voltage rectification', '穩壓參考 voltage references', '太陽能板 solar panels'])],
    '講義 1-29 結論。');

  /* ═════════ 10 齊納 ═════════ */
  C('zd', 1, '操作區',
    '齊納二極體一般操作在 {0}，目的是 {1}。',
    'A Zener diode normally operates in ___ in order to ___.',
    [S(['逆向崩潰區 reverse breakdown', '順偏區 forward bias', '截止區 cutoff', '飽和區 saturation']), S(['穩壓 regulate voltage', '發光 emit light', '整流 rectify', '放大 amplify'])],
    '講義 1-32。');
  C('zd', 2, '為什麼崩潰電壓低',
    '齊納二極體因為 {0}，所以崩潰電壓較低。',
    'A Zener diode has a low breakdown voltage because it is ___.',
    [S(['高摻雜 heavily doped', '低摻雜 lightly doped', '用金屬做的 made of metal', '照光 illuminated'])],
    '講義 1-32 旁註；PART 5：高摻雜 → 空乏區窄 → 小電壓就有強電場。');
  C('zd', 3, '直線模型',
    '崩潰區用直線描：VZ = VZ0 + IZ·rz，rz 叫 {0}，大小約 {1}。',
    'In breakdown, VZ = VZ0 + IZ·rz, where rz is the ___, typically ___.',
    [S(['齊納電阻（增量電阻）Zener (incremental) resistance', '負載電阻 load resistance', '順偏電阻 forward resistance', '熱電阻 thermal resistance']), S(['幾 Ω～數十 Ω a few to tens of ohms', '幾 kΩ kilohms', '幾 MΩ megohms', '0.7 V'])],
    '講義 1-32、1-33。r<sub>z</sub> → 0 時 V<sub>Z</sub> = V<sub>Z0</sub>。');
  C('zd', 4, '功率限制',
    '齊納二極體的 VZ 與 IZ 之積（功率）不可超過元件的 {0}。',
    'The product of VZ and IZ (power) must not exceed the device ___.',
    [S(['額定功率 power rating', '崩潰電壓 breakdown voltage', 'PIV', '頻率 frequency'])],
    '講義 1-32：功率太大會燒壞。');
  C('zd', 5, '電阻的角色',
    '齊納穩壓電路裡，外接電阻負責 {0}。',
    'In a Zener regulator, the external resistor ___.',
    [S(['限制電流 limits the current', '決定輸出電壓 sets the output voltage', '提供崩潰 causes breakdown', '濾波 filters'])],
    '講義 1-34：齊納二極體在崩潰區維持近似固定電壓，外接電阻負責限制電流。');
  C('zd', 6, '電源變了',
    '電源 VPS 在一定範圍內變大，齊納的輸出電壓 {0}，多出來的電壓落在 {1}。',
    'If VPS increases within a range, the Zener output ___, and the extra voltage appears across ___.',
    [S(['幾乎不變 stays nearly constant', '跟著變大 increases too', '變成 0 drops to zero', '變負 becomes negative']), S(['電阻 R the resistor R', '齊納二極體 the Zener diode', '負載 the load', '電源內部 the source'])],
    'Design Example 1.13 Comment：輸出維持 5.6 V。');
  C('zd', 7, '方向定義',
    '齊納的 VZ、IZ 定義跟一般二極體 {0}：IZ 從 {1} 流進去。',
    'The VZ and IZ references of a Zener are ___ those of an ordinary diode: IZ enters at the ___.',
    [S(['相反 opposite to', '一樣 the same as', '無關 unrelated to', '垂直 perpendicular to']), S(['陰極 cathode', '陽極 anode', '金屬端 metal side', '中間 middle'])],
    '講義 1-33 NOTE：定義與二極體不同，要注意。', true);
  C('zd', 8, 'Design Example 1.13 的流程',
    'Design Example 1.13 求 R 的做法：把齊納換成 {0}，再用 R = (VPS − VZ)/I。',
    'In Design Example 1.13, replace the Zener by ___ and then use R = (VPS − VZ)/I.',
    [S(['一顆 VZ 的電池（rz = 0）a VZ battery (rz = 0)', '短路 a short', '開路 an open', 'rd'])],
    'r<sub>z</sub> = 0：崩潰區是垂直的牆，齊納 = 5.6 V 電池；R = 4.4/3 mA = 1.47 kΩ。', true);

  window.__CH16C = { name: 'ch16c', items };
})();
