/* ============================================================
   電子學期中考 2 衝刺 —— 選擇題（考卷全英文 → 英文先，中文翻譯收在按鈕裡）
   老師 11/4 公布的選擇題範圍＋HW3 選擇題（PART1 有老師答案；PART2 自解，請確認）
   選項正解寫在第一個，hw.js 會打亂；選項不能有標籤、底線。
   window.__MT2C（name 'mt2c'）、window.__HW3C（同一份紀錄）
   ============================================================ */
(function () {
  'use strict';
  const items = [];
  const NO = { cfwd: 'A', cbrk: 'B', cq: 'C', ccd: 'D', coth: 'E', crr: 'F', hw3a: 'H1', hw3b: 'H2' };
  const LINK = { cfwd: 'ch1-part4.html', cbrk: 'ch1-part7.html', cq: 'ch1-part6.html', ccd: 'ch1-part7.html', coth: 'ch1-part7.html', crr: 'ch1-part7.html', hw3a: 'hw3.html', hw3b: 'hw3.html' };
  let n = {};
  const M = (sec, title, q, zh, o, ex, src) => {
    n[sec] = (n[sec] || 0) + 1;
    items.push({ id: 'mt2' + sec + '-' + n[sec], kind: 'cf', sec, no: NO[sec] + '-' + n[sec], calc: false, link: LINK[sec], title: (src ? src + ' · ' : '') + title, q, zh, b: [{ o: o.map(t => t.replace(/<\/?su[bp]>/g, '')), a: 0 }], ex });
  };

  /* ═════ A 順偏：擴散、少數載子、溫度 ═════ */
  M('cfwd', 'Forward-bias current', 'Under forward bias, the diode current is mainly due to {0}.', '順偏時，二極體電流主要來自 ___。',
    ['diffusion of injected minority carriers 注入少數載子的擴散', 'drift of carriers in the depletion region 空乏區的漂移', 'tunneling 穿隧', 'avalanche multiplication 累增倍增'], '順偏降低位障，多數載子越過接面後變成對面的少數載子，靠擴散流走。');
  M('cfwd', 'Barrier', 'Forward bias {0} the potential barrier of the junction.', '順偏會 ___ 接面的位障。',
    ['lowers 降低', 'raises 提高', 'does not change 不改變', 'reverses 反轉'], '外加電壓抵消內建電位。');
  M('cfwd', 'Excess minority carriers', 'Under forward bias, the excess minority-carrier concentration at the edge of the depletion region {0} with V<sub>D</sub>.', '順偏時，空乏區邊緣的過量少數載子濃度隨 V<sub>D</sub> ___。',
    ['increases exponentially 指數增加', 'decreases linearly 線性減少', 'stays constant 不變', 'drops to zero 變成 0'], 'p<sub>n</sub>(0) = p<sub>n0</sub>e<sup>V<sub>D</sub>/V<sub>T</sub></sup>。');
  M('cfwd', 'Diode equation', 'The ideal diode equation is {0}.', '理想二極體方程式是 ___。',
    ['iD = IS (e to the vD/VT minus 1) 指數式', 'iD = vD/R 歐姆定律', 'iD = IS vD 線性', 'iD = IS/vD 反比'], 'i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1)。');
  M('cfwd', 'Temperature and I_S', 'When temperature increases, the reverse saturation current I<sub>S</sub> {0}.', '溫度上升，逆向飽和電流 I<sub>S</sub> ___。',
    ['increases (about doubles every 5 °C) 增加（約每 5 °C 加倍）', 'decreases 減少', 'stays constant 不變', 'becomes zero 變 0'], '熱產生的載子變多（講義 1.6）。');
  M('cfwd', 'Temperature and V_D', 'At a constant forward current, the diode voltage {0} as temperature increases.', '固定順向電流時，溫度上升，二極體電壓 ___。',
    ['decreases by about 2 mV/°C 約每度降 2 mV', 'increases by about 2 mV/°C 約每度升 2 mV', 'stays constant 不變', 'doubles 加倍'], '溫度計就是用這個（CH1 PART 4 §06）。');
  M('cfwd', 'Thermal voltage', 'The thermal voltage V<sub>T</sub> = kT/q is about {0} at room temperature.', '室溫下熱電壓 V<sub>T</sub> = kT/q 約 ___。',
    ['26 mV', '0.7 V', '2 mV', '1 V'], '300 K 時約 0.026 V。');
  M('cfwd', 'Reverse bias current', 'Under reverse bias, the small current is carried by {0}.', '逆偏時的小電流由 ___ 形成。',
    ['minority carriers drifting across the junction 少數載子漂移', 'majority-carrier diffusion 多數載子擴散', 'photons 光子', 'holes in the metal 金屬中的電洞'], '就是 I<sub>S</sub>，少數載子被電場掃過去。');

  /* ═════ B 崩潰：齊納（撕）vs 累增（撞） ═════ */
  M('cbrk', 'Zener mechanism', 'Zener breakdown is caused by {0}.', '齊納崩潰的成因是 ___。',
    ['tunneling: a strong field tears electrons out of covalent bonds 穿隧（強電場把電子撕出來）', 'impact ionization by energetic carriers 高能載子撞擊游離', 'thermal runaway 熱失控', 'light absorption 吸光'], '「撕的」：重摻雜、空乏區很窄、電場很強。');
  M('cbrk', 'Avalanche mechanism', 'Avalanche breakdown is caused by {0}.', '累增崩潰的成因是 ___。',
    ['impact ionization: accelerated carriers collide and create more pairs 撞擊游離（撞出更多電子電洞對）', 'tunneling 穿隧', 'recombination 復合', 'diffusion 擴散'], '「撞的」：連鎖反應。');
  M('cbrk', 'Doping', 'Zener breakdown occurs in {0} junctions.', '齊納崩潰發生在 ___ 的接面。',
    ['heavily doped 重摻雜', 'lightly doped 輕摻雜', 'undoped 未摻雜', 'metal 金屬'], '重摻雜 → 空乏區窄 → 電場大。');
  M('cbrk', 'Voltage range', 'Zener breakdown usually dominates for breakdown voltages {0}.', '齊納崩潰通常主導 ___ 的崩潰電壓。',
    ['below about 5 V 小於約 5 V', 'above about 50 V 大於約 50 V', 'exactly 0.7 V 剛好 0.7 V', 'in forward bias 順偏時'], '高崩潰電壓多半是累增。');
  M('cbrk', 'Temperature coefficient', 'The breakdown voltage of avalanche breakdown {0} with temperature.', '累增崩潰電壓隨溫度 ___。',
    ['increases 上升（正溫度係數）', 'decreases 下降', 'does not change 不變', 'oscillates 震盪'], '溫度高、晶格振動大，載子較難加速到足夠能量；齊納則是負溫度係數。');
  M('cbrk', 'Zener in use', 'A Zener diode used as a regulator operates in {0}.', '齊納當穩壓用時工作在 ___。',
    ['the reverse breakdown region 逆向崩潰區', 'forward bias 順偏', 'cutoff with zero current 零電流截止', 'saturation 飽和'], '崩潰區電壓幾乎固定。');
  M('cbrk', 'Zener resistance', 'The Zener resistance r<sub>z</sub> is {0} of the I–V curve in breakdown.', '齊納電阻 r<sub>z</sub> 是崩潰區 I–V 曲線 ___。',
    ['the inverse of the slope 斜率的倒數', 'the slope 斜率', 'the area 面積', 'the intercept 截距'], 'r<sub>z</sub> 越小，電壓越穩。');
  M('cbrk', 'Series resistor', 'In a Zener reference circuit, the external resistor R is needed to {0}.', '齊納參考電路中，外接電阻 R 的作用是 ___。',
    ['limit the current in breakdown 限制崩潰區電流', 'raise the Zener voltage 提高齊納電壓', 'forward-bias the Zener 讓齊納順偏', 'store charge 儲存電荷'], 'Design Example 1.13 的 Comment。');

  /* ═════ C 工作點與失真 ═════ */
  M('cq', 'Q-point', 'The quiescent point (Q-point) of a diode circuit is {0}.', '二極體電路的靜態工作點 Q 是 ___。',
    ['the intersection of the load line and the diode I–V curve 負載線與特性曲線的交點', 'the origin 原點', 'the breakdown point 崩潰點', 'the cut-in voltage 切入電壓'], '兩條線的交點。');
  M('cq', 'Load line', 'The load line of a diode circuit is obtained from {0}.', '負載線由 ___ 得到。',
    ['KVL around the circuit 電路的 KVL', 'the diode equation 二極體方程式', 'KCL at the diode only 只看二極體的 KCL', 'Ohm\'s law for the diode 二極體歐姆定律'], 'V<sub>PS</sub> = I<sub>D</sub>R + V<sub>D</sub>。');
  M('cq', 'Small signal', 'The small-signal model is valid only when {0}.', '小訊號模型只有在 ___ 時成立。',
    ['the ac swing is small compared with V<sub>T</sub> 交流振幅比 V<sub>T</sub> 小很多', 'the ac swing is larger than V<sub>γ</sub> 交流比 V<sub>γ</sub> 大', 'the diode is reverse biased 逆偏時', 'the frequency is zero 頻率為 0'], '曲線在 Q 點附近才能當直線。');
  M('cq', 'Distortion', 'If the ac signal is too large, the output {0}.', '交流訊號太大時，輸出會 ___。',
    ['is distorted because the curve is not linear 失真（曲線不是直線）', 'is unchanged 不變', 'becomes dc 變直流', 'doubles in frequency 頻率加倍'], '超出線性範圍。');
  M('cq', 'Q-point choice', 'To avoid clipping of the ac swing, the Q-point should be chosen {0}.', '為了不讓交流被截掉，Q 點應選在 ___。',
    ['well inside the forward region, so the total signal never turns the diode off 順偏區裡面，交流加上去也不會關掉', 'right at V<sub>γ</sub> 剛好在 V<sub>γ</sub>', 'in reverse bias 逆偏', 'at zero current 零電流'], 'Q 點太低，負半週會掉到截止。');
  M('cq', 'r_d', 'The small-signal diffusion resistance is r<sub>d</sub> = {0}.', '小訊號擴散電阻 r<sub>d</sub> = ___。',
    ['VT / IDQ', 'IDQ / VT', 'VD / ID', 'VT × IDQ'], 'Q 點電流越大，r<sub>d</sub> 越小。');
  M('cq', 'Superposition', 'In ac + dc analysis, the total voltage v<sub>D</sub> equals {0}.', 'AC + DC 分析時，總電壓 v<sub>D</sub> = ___。',
    ['VDQ + vd (dc part plus ac part) 直流＋交流', 'VDQ × vd', 'vd only 只有交流', 'VDQ only 只有直流'], '先做 DC、再做 AC、最後相加。');
  M('cq', 'AC analysis sources', 'For ac analysis, independent dc voltage sources are {0}.', '做交流分析時，獨立直流電壓源 ___。',
    ['short-circuited 短路', 'open-circuited 開路', 'doubled 加倍', 'left unchanged 不動'], 'HW3 選擇第 2 題。');

  /* ═════ D 擴散電容 ═════ */
  M('ccd', 'Where', 'Diffusion capacitance is dominant {0}.', '擴散電容主要出現在 ___。',
    ['under forward bias 順偏', 'under reverse bias 逆偏', 'at breakdown only 只在崩潰', 'in a metal 金屬中'], 'HW3 PART1 第 10 題。');
  M('ccd', 'Origin', 'Diffusion capacitance comes from {0}.', '擴散電容來自 ___。',
    ['the change of stored minority-carrier charge in the neutral regions 中性區少數載子儲存電荷的變化', 'the width change of the depletion region 空乏區寬度變化', 'the metal contacts 金屬接點', 'avalanche 累增'], 'C<sub>d</sub> = dQ/dV<sub>D</sub>。');
  M('ccd', 'Junction vs diffusion', 'Junction capacitance C<sub>j</sub> is associated with {0}.', '接面電容 C<sub>j</sub> 跟 ___ 有關。',
    ['the depletion region charge (dominant in reverse bias) 空乏區電荷（逆偏為主）', 'stored minority carriers 儲存的少數載子', 'the load resistor 負載電阻', 'photons 光子'], '兩種電容要分清楚。');
  M('ccd', 'Proportional', 'Diffusion capacitance is approximately proportional to {0}.', '擴散電容約正比於 ___。',
    ['the dc forward current IDQ 直流順向電流', 'the reverse voltage 逆向電壓', 'the area of the metal 金屬面積', 'frequency 頻率'], 'C<sub>d</sub> ≈ τI<sub>DQ</sub>/(2V<sub>T</sub>)。');
  M('ccd', 'DC only', 'For a purely dc analysis, the diode capacitances {0}.', '只有直流時，二極體電容 ___。',
    ['need not be considered 不需要考慮', 'must be considered 一定要考慮', 'become short circuits 變短路', 'double 加倍'], 'HW3 第 1 題：直流時電容開路。');
  M('ccd', 'High frequency', 'At high frequency, diffusion capacitance {0}.', '高頻時，擴散電容會 ___。',
    ['limits the switching speed of the diode 限制開關速度', 'increases the reverse leakage 增加漏電流', 'raises the turn-on voltage 提高導通電壓', 'reduces the forward current 減少順向電流'], 'HW3 PART1 第 12 題（ANS C）。');
  M('ccd', 'Small-signal model', 'The small-signal equivalent circuit of a forward-biased diode is {0}.', '順偏二極體的小訊號等效電路是 ___。',
    ['r<sub>d</sub> in parallel with C<sub>d</sub> (and C<sub>j</sub>) r<sub>d</sub> 並聯 C<sub>d</sub>', 'r<sub>d</sub> in series with a battery r<sub>d</sub> 串電池', 'an open circuit 開路', 'a current source only 只有電流源'], 'HW3 第 1 題要你畫的。');
  M('ccd', 'Larger swing', 'If the ac component ΔV of v<sub>D</sub> becomes larger, the change of minority-carrier concentration in the P and N neutral regions becomes {0}.', '若 v<sub>D</sub> 的交流成分 ΔV 變大，P、N 中性區少數載子濃度的變化 ___。',
    ['larger 變大', 'smaller 變小', 'zero 變 0', 'unchanged 不變'], 'HW3 第 1 題的填空。');

  /* ═════ E 其他二極體 ═════ */
  M('coth', 'Solar cell', 'A solar cell converts {0}.', '太陽能電池把 ___。',
    ['light energy into electrical energy 光能轉電能', 'electrical energy into light 電能轉光', 'heat into light 熱轉光', 'ac into dc 交流轉直流'], 'PN 接面空乏區受光產生電子電洞對，被電場分開形成光電流。');
  M('coth', 'Solar cell region', 'In a solar cell, the electron–hole pairs that form the photocurrent are generated mainly in {0}.', '太陽能電池中形成光電流的電子電洞對主要產生在 ___。',
    ['the depletion region 空乏區', 'the metal contact 金屬接點', 'the load resistor 負載電阻', 'the package 封裝'], '空乏區有電場可以把它們分開。');
  M('coth', 'Photodiode bias', 'A photodiode is normally operated in {0}.', '光二極體通常操作在 ___。',
    ['reverse bias 逆偏', 'forward bias 順偏', 'breakdown 崩潰', 'oscillation 震盪'], '光電流就是逆向電流變大。');
  M('coth', 'LED', 'An LED emits light because {0}.', 'LED 發光是因為 ___。',
    ['electrons and holes recombine and release energy as photons 電子電洞復合放出光子', 'it absorbs photons 吸收光子', 'of thermal radiation 熱輻射', 'of tunneling 穿隧'], '要順偏。');
  M('coth', 'LED material', 'LEDs are usually made from {0}.', 'LED 通常用 ___ 做。',
    ['direct-bandgap compound semiconductors such as GaAs 直接能隙化合物半導體（GaAs）', 'silicon only 只有矽', 'copper 銅', 'glass 玻璃'], '矽是間接能隙，不太會發光。');
  M('coth', 'Schottky structure', 'A Schottky diode is formed by a junction between {0}.', '蕭特基二極體是 ___ 形成的接面。',
    ['a metal and a semiconductor 金屬與半導體', 'two semiconductors 兩種半導體', 'a semiconductor and an insulator 半導體與絕緣體', 'two metals 兩種金屬'], 'HW3 PART1 第 14 題。');
  M('coth', 'Schottky advantage', 'Compared with a pn diode, a Schottky diode has {0}.', '跟 PN 二極體比，蕭特基 ___。',
    ['a lower turn-on voltage (about 0.2–0.4 V) and faster switching 導通電壓低、切換快', 'a higher turn-on voltage 導通電壓高', 'a longer storage time 儲存時間長', 'no reverse current 沒有逆向電流'], '多數載子元件，沒有少數載子儲存。');
  M('coth', 'Schottky leakage', 'Compared with a pn diode, a Schottky diode has {0} reverse saturation current.', '跟 PN 二極體比，蕭特基的逆向飽和電流 ___。',
    ['a larger 較大', 'a smaller 較小', 'the same 一樣', 'zero 零'], '金屬–半導體接面（HW3 PART1 第 18 題）。');

  /* ═════ F 反向恢復（切換暫態） ═════ */
  M('crr', 'Right after switching', 'Right after a diode is switched from forward to reverse bias (t = 0⁺), the diode voltage stays near the forward value because {0}.', '二極體由順偏切到逆偏的瞬間，端電壓仍接近順偏值，因為 ___。',
    ['excess minority carriers are still stored near the junction 接面附近仍存著大量少數載子', 'the source has not reversed 電源還沒反轉', 'the built-in field disappears 內建電場消失', 'the resistor heats up 電阻發熱'], '要先把它們清掉。');
  M('crr', 'Reverse current', 'During the storage time, the reverse current is approximately {0}.', '儲存時間內，逆向電流約為 ___。',
    ['I<sub>R</sub> ≈ V<sub>R</sub>/R<sub>R</sub> (constant) 約固定 V<sub>R</sub>/R<sub>R</sub>', 'zero 零', 'I<sub>S</sub>', 'equal to I<sub>F</sub> in the same direction 等於順向電流同方向'], '講義 1.2.5：v<sub>D</sub> ≈ 0 ⇒ i<sub>D</sub> = −I<sub>R</sub> ≅ −V<sub>R</sub>/R<sub>R</sub>。');
  M('crr', 'Storage time', 'The storage time t<sub>s</sub> is the time {0}.', '儲存時間 t<sub>s</sub> 是 ___ 的時間。',
    ['for the excess minority carriers at the junction edge to drop to zero (equilibrium) 接面邊緣過量少數載子降到平衡值', 'for the current to fall to 10 % 電流降到 10%', 'to build the field 建立電場', 'for light emission 發光'], '第一階段。');
  M('crr', 'Fall time', 'The fall time t<sub>f</sub> is the time {0}.', '下降時間 t<sub>f</sub> 是 ___ 的時間。',
    ['for the reverse current to decay to about 10 % of I<sub>R</sub> while the depletion region widens 逆向電流衰減到約 10%（空乏區變寬）', 'to store charge 儲存電荷', 'to turn on 導通', 'to reach breakdown 崩潰'], '第二階段。');
  M('crr', 'Turn-off time', 'The total turn-off time is {0}.', '總關斷時間是 ___。',
    ['storage time plus fall time 儲存時間＋下降時間', 'rise time plus delay 上升＋延遲', 'storage time only 只有儲存時間', 'fall time only 只有下降時間'], 't<sub>off</sub> = t<sub>s</sub> + t<sub>f</sub>。');
  M('crr', 'On vs off', 'In general, the turn-off time is {0} the turn-on time.', '一般來說，關斷時間 ___ 導通時間。',
    ['longer than 比較長', 'shorter than 比較短', 'equal to 等於', 'zero compared with 遠小於'], '要清除儲存電荷。');
  M('crr', 'Origin', 'The reverse recovery current exists because {0}.', '反向恢復電流存在是因為 ___。',
    ['the stored minority carriers in P and N must be removed P、N 內的少數載子必須被移除', 'of parasitic wiring capacitance 外部寄生電容', 'majority carriers are re-injected 多數載子重新注入', 'of thermal noise 熱雜訊'], 'HW3 PART2 第 10 題。');
  M('crr', 'Faster switching', 'To switch faster, a good choice is {0}.', '要切換更快，好的選擇是 ___。',
    ['a Schottky diode (no minority-carrier storage) 蕭特基（沒有少數載子儲存）', 'a larger forward current 更大的順向電流', 'a solar cell 太陽能電池', 'a thicker depletion region in forward bias 順偏時更厚的空乏區'], '儲存電荷越少越快。');

  /* ═════ HW3 PART1（老師有答案）═════ */
  const H = 'HW3 PART1';
  M('hw3a', 'DC analysis', 'When doing dc analysis of a diode circuit, independent ac sources are treated as {0}.', '做二極體電路直流分析時，外加的獨立交流、直流信號源要如何處理？',
    ['ac voltage sources shorted, ac current sources opened 交流電壓源短路、交流電流源開路', 'dc voltage sources shorted, dc current sources opened 直流電壓源短路、直流電流源開路', 'dc voltage sources opened, dc current sources shorted 直流電壓源開路、直流電流源短路', 'ac voltage sources opened, ac current sources shorted 交流電壓源開路、交流電流源短路'], '老師答案 C。', H);
  M('hw3a', 'AC analysis', 'When doing ac analysis of a diode circuit, independent dc sources are treated as {0}.', '做二極體交流分析時，外加的獨立交流、直流信號源要如何處理？',
    ['dc voltage sources shorted, dc current sources opened 直流電壓源短路、直流電流源開路', 'dc voltage sources opened, dc current sources shorted 直流電壓源開路、直流電流源短路', 'ac voltage sources shorted, ac current sources opened 交流電壓源短路、交流電流源開路', 'ac voltage sources opened, ac current sources shorted 交流電壓源開路、交流電流源短路'], '老師答案 A。', H);
  M('hw3a', 'Name', 'In the small-signal model of a diode, the equivalent resistance is called {0}.', '在二極體的小信號模型中，等效電阻稱為？',
    ['the small-signal incremental (diffusion) resistance 小信號增量電阻（擴散電阻）', 'the static resistance 靜態電阻', 'the total resistance 總電阻', 'the reverse resistance 反向電阻'], '老師沒附答案，正解 B（自解）。', H);
  M('hw3a', 'Reverse current', 'In ac equivalent analysis, the reverse current of the diode is usually assumed to be {0}.', '進行交流等效分析時，通常假設二極體的反向電流為？',
    ['zero 零', 'infinite 無窮大', 'a constant 常數', 'proportional to voltage 正比於電壓'], '老師答案 B。', H);
  M('hw3a', 'Gain factors', 'In ac analysis, the main factors affecting the small-signal behavior of the diode are {0}.', '在交流分析中，影響二極體小信號增益的主要因素是？',
    ['both 1/r<sub>d</sub> and the Q-point position on the curve 1/r<sub>d</sub> 與工作點位置（A、B 都對）', 'only the bias frequency 只有頻率', 'none of the above 以上皆非', 'only the package 只有封裝'], '老師答案 A、B。', H);
  M('hw3a', 'Solar cell', 'The main function of a solar cell is to {0}.', '太陽能電池的主要功能是？',
    ['convert light energy into electrical energy 光能轉電能', 'convert electrical energy into light 電能轉光能', 'store electrical energy 儲存電能', 'amplify signals 增強信號'], '老師答案 A。', H);
  M('hw3a', 'Photodiode', 'The working principle of a photodiode is to {0}.', '受光二極體的工作原理是？',
    ['generate current by the photoelectric effect 利用光電效應產生電流', 'convert current into light 電流轉光', 'emit light at a specific wavelength 特定波長發光', 'operate in forward bias 工作在順偏'], '老師答案 A。', H);
  M('hw3a', 'LED', 'The light emission of an LED is mainly based on {0}.', 'LED 的發光原理主要是基於？',
    ['electron–hole recombination releasing energy as light 電子電洞重組放出光', 'the photoelectric effect 光電效應', 'thermal radiation 熱輻射', 'photon absorption 光子吸收'], '老師答案 B。', H);
  M('hw3a', 'Solar output', 'When a solar cell is illuminated more strongly, {0}.', '太陽能電池受光照時，輸出電壓與電流的關係是？',
    ['the output current increases with light 輸出電流隨光照增加', 'the output voltage decreases 輸出電壓減少', 'the output current decreases 輸出電流減少', 'nothing changes 不變'], '老師答案 D。', H);
  M('hw3a', 'Diffusion cap', 'Diffusion capacitance mainly appears in {0}.', '擴散電容主要出現在？',
    ['a forward-biased pn junction 正向偏壓下的 PN 接面', 'a reverse-biased pn junction 反向偏壓下的 PN 接面', 'a metal–semiconductor junction 金屬半導體接面', 'an insulating layer 絕緣層內部'], '老師答案 B。', H);
  M('hw3a', 'Diffusion cap origin', 'Under forward bias, the diffusion capacitance mainly comes from {0}.', '順偏時擴散電容主要來自？',
    ['carrier accumulation due to the forward current 正向電流帶來的載子積累', 'expansion of the space-charge region 空間電荷區擴展', 'avalanche under reverse bias 雪崩效應', 'gate capacitance 閘極電容'], '老師答案 A。', H);
  M('hw3a', 'High frequency', 'At high frequency, diffusion capacitance affects the diode because it {0}.', '高頻運作中擴散電容會影響二極體，因為它會？',
    ['limits the switching speed 限制開關速度', 'increases reverse leakage 增加漏電流', 'raises the turn-on voltage 提高導通電壓', 'reduces forward current 減少正向電流'], '老師答案 C。', H);
  M('hw3a', 'Switching time', 'The total switching time of a diode usually includes {0}.', '二極體總開關時間通常包括？',
    ['storage time and recovery (fall) time 儲存時間與恢復時間', 'storage time and diffusion time 儲存時間與擴散時間', 'reverse recovery and transit time 反向恢復與過渡時間', 'forward and reverse delay 正反向延遲'], '老師答案 C。', H);
  M('hw3a', 'Schottky structure', 'A Schottky diode is formed by joining {0}.', '蕭基二極體是由什麼接合形成？',
    ['a metal and a semiconductor 金屬與半導體', 'two different semiconductors 兩種半導體', 'a heavily doped pn junction 重摻雜 PN', 'a semiconductor and an insulator 半導體與絕緣體'], '老師答案 B。', H);
  M('hw3a', 'Schottky advantage', 'The main advantage of a Schottky diode over a pn diode is {0}.', '蕭基二極體相較 PN 的主要優勢是？',
    ['a low forward turn-on voltage 低正向導通電壓', 'a high breakdown voltage 高崩潰電壓', 'a long reverse recovery time 長反向恢復', 'a large capacitance 大電容'], '老師答案 B。', H);
  M('hw3a', 'Schottky V_on', 'The forward turn-on voltage of a Schottky diode is generally in the range {0}.', '蕭特基正向導通電壓一般在？',
    ['0.2 V to 0.4 V', '0.1 V to 0.3 V', '0.6 V to 0.8 V', '1.0 V to 1.2 V'], '老師答案 B。', H);
  M('hw3a', 'Schottky speed', 'Schottky diodes are used in high-speed switching because of their {0}.', '蕭特基常用於高速開關是因為？',
    ['high switching speed with no minority-carrier storage 高開關速度、無少數載子儲存', 'high breakdown voltage 高擊穿電壓', 'low reverse leakage 低漏電流', 'low operating temperature 低工作溫度'], '老師答案 C。', H);
  M('hw3a', 'Schottky leakage', 'Under reverse bias, a Schottky diode has {0} leakage current than a pn diode.', '逆偏時蕭基二極體的漏電流比 PN 二極體？原因？',
    ['a higher one, due to the metal–semiconductor junction 較高（金屬半導體接面）', 'a lower one, due to high doping 較低（高摻雜）', 'a lower one, due to similar structure 較低（結構相似）', 'the same one 相同'], '老師答案 B。', H);
  M('hw3a', 'Zener use', 'Zener diodes are mainly used for {0}.', '齊納二極體主要應用於？',
    ['voltage regulation 穩壓', 'current limiting 限制電流', 'providing forward bias 提供正向偏壓', 'enhancing frequency response 增強頻率響應'], '老師答案 B。', H);
  M('hw3a', 'Zener principle', 'The stable voltage of a reverse-biased Zener diode above a certain value relies on {0}.', '齊納逆偏超過特定電壓後的穩定電壓主要依賴？',
    ['Zener breakdown 齊納崩潰', 'carrier diffusion 載子擴散', 'diffusion capacitance 擴散電容', 'forward current 正向電流'], '老師答案 C。', H);
  M('hw3a', 'Zener voltage name', 'When the reverse bias exceeds the Zener diode\'s {0} voltage, it conducts and holds a stable voltage.', '反向偏壓超過齊納的 ___ 電壓時會導通並穩定電壓。',
    ['breakdown 崩潰', 'critical 臨界', 'forward 正向', 'gate 閘極'], '老師答案 B。', H);
  M('hw3a', 'Zener application', 'The main application of a Zener diode is as {0}.', '齊納二極體的主要應用是作為？',
    ['a reference voltage source and regulator 參考電壓源與穩壓器', 'a current amplifier 電流放大器', 'a signal amplifier 信號放大器', 'a switching element 開關元件'], '老師答案 C。', H);

  /* ═════ HW3 PART2（老師沒附答案，自解，請確認）═════ */
  const H2 = 'HW3 PART2';
  M('hw3b', 'Solar region', 'In a solar cell pn junction, the region where light generates electron–hole pairs is {0}.', '太陽能電池 PN 接面中，哪個區域受光產生電子電洞對？',
    ['the depletion region 空乏區', 'the P region P 區', 'the N region N 區', 'the neutral region 中性區'], '自解 A（講義 1.5.1：空乏區受光）。', H2);
  M('hw3b', 'Solar material', 'Materials commonly used for solar cells are {0}.', '太陽能電池常用材料是？',
    ['Si and GaAs', 'Cu and Fe', 'Ge and Al', 'Zn and CdS'], '自解 A（講義：Si、GaAs 與 III-V 化合物）。', H2);
  M('hw3b', 'Photodetector', 'The main energy conversion of a photodetector is {0}.', '光偵測器主要的能量轉換方向是？',
    ['optical signal to electrical signal 光訊號 → 電訊號', 'electrical to optical 電 → 光', 'optical to acoustic 光 → 聲', 'heat to light 熱 → 光'], '自解 A。', H2);
  M('hw3b', 'Photodiode bias', 'A photodiode is usually operated in {0}.', '光二極體操作時通常處於？',
    ['reverse bias 反向偏壓', 'forward bias 正向偏壓', 'zero bias 零偏壓', 'oscillation 震盪區'], '自解 B。', H2);
  M('hw3b', 'LED conversion', 'The main energy conversion of an LED is {0}.', 'LED 的主要能量轉換方向是？',
    ['electricity to light 電 → 光', 'light to electricity 光 → 電', 'heat to light 熱 → 光', 'light to heat 光 → 熱'], '自解 B。', H2);
  M('hw3b', 'LED mechanism', 'The direct physical mechanism of light emission in an LED is {0}.', 'LED 放光的直接物理機制是？',
    ['electron–hole recombination 電子電洞復合', 'band-gap absorption 能隙吸收', 'leakage current 漏電流', 'photon multiplication 光子倍增'], '自解 B。', H2);
  M('hw3b', 'Laser diode', 'The main structural difference between a laser diode and an LED is {0}.', '雷射二極體與 LED 的主要結構差別是？',
    ['an optical resonant cavity is added 加入光學共振腔', 'different material 材料不同', 'reverse-bias operation 改為逆偏', 'metal replaces semiconductor 金屬取代半導體'], '自解 B。', H2);
  M('hw3b', 'v_D at t = 0', 'At the instant a diode switches from forward to reverse bias (t = 0), v<sub>D</sub> stays near 0 V because {0}.', '二極體由順偏轉逆偏瞬間，v<sub>D</sub> 為何仍在 0 V 附近？',
    ['the junction is still full of minority carriers, so the conducting condition temporarily remains 接面仍充滿少數載子，導通條件暫時存在', 'the capacitance discharges too slowly 電容放電太慢', 'the external voltage has not fully reversed 外部電壓未完全反轉', 'the built-in field is neutralized 內建電場被中和'], '自解 B。', H2);
  M('hw3b', 't_s', 'The physical meaning of the storage time t<sub>s</sub> is {0}.', '儲存時間 t<sub>s</sub> 的物理意義是？',
    ['the time before the minority-carrier concentration drops to its equilibrium value 少數載子濃度降至平衡值前的時間', 'the time for the current to fall to 10 % 電流降到 10%', 'the time to build the field 電場建立', 'the time for v<sub>D</sub> to rise from 0 to the reverse voltage 接面電壓上升'], '自解 B。', H2);
  M('hw3b', 'I_R origin', 'The reverse recovery current I<sub>R</sub> is produced because {0}.', '反向恢復電流 I<sub>R</sub> 的產生原因是？',
    ['minority carriers in P and N must be removed P 與 N 內少數載子必須被移除', 'external parasitic capacitance discharges 寄生電容放電', 'majority carriers are re-injected 多數載子重新注入', 'thermal noise increases 熱雜訊增加'], '自解 C。', H2);
  M('hw3b', 'Turn-off', 'The turn-off time of a diode switched from forward to reverse includes {0}.', '關斷時間包含哪兩個時間？',
    ['storage time t<sub>s</sub> and fall time t<sub>f</sub> 儲存時間與下降時間', 'storage time and propagation delay 儲存與傳播延遲', 'rise time and fall time 上升與下降', 'turn-on time and storage time 導通與儲存'], '自解 B。', H2);
  M('hw3b', 'Schottky junction', 'The rectifying junction of a Schottky diode is formed by {0}.', '蕭特基二極體主要的整流接面由哪兩種材料形成？',
    ['a metal and an n-type semiconductor 金屬與 N 型半導體', 'p-type and n-type semiconductors P 與 N 型', 'a metal and a p-type semiconductor 金屬與 P 型', 'two semiconductors with different band gaps 不同能隙半導體'], '自解 C（課本的蕭特基是金屬接 n 型）。', H2);
  M('hw3b', 'Schottky property', 'Compared with a pn diode, a Schottky diode {0}.', '跟一般 PN 二極體比，蕭特基具有？',
    ['does not involve minority-carrier conduction, so it switches fast 不涉及少數載子導電、切換快', 'stores a lot of minority charge and switches slowly 大量少數載子、切換慢', 'has a wider depletion region and higher turn-on voltage 空乏區寬、導通電壓高', 'has a smaller reverse leakage 反向漏電較小'], '自解 B。', H2);
  M('hw3b', 'Schottky I_S', 'The reverse saturation current I<sub>S</sub> of a Schottky diode is larger than that of a pn diode because {0}.', '為何蕭特基的 I<sub>S</sub> 比 PN 二極體大？',
    ['the current is carried by plentiful majority carriers (electrons) over the metal–semiconductor barrier 金屬端有大量多數載子可提供電子', 'the band gap is larger 能隙較大', 'the depletion region has fewer carriers 空乏區載子少', 'minority carriers drift faster 少數載子漂移快'], '自解 A：電流由多數載子越過位障（熱離子發射），比 PN 的少數載子擴散大得多。', H2);

  window.__MT2C = { name: 'mt2c', items };
  window.__HW3C = { name: 'mt2c', items: items.filter(i => i.sec === 'hw3a' || i.sec === 'hw3b') };
})();
