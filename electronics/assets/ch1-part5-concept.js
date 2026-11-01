/* ============================================================
   電子學 CH1 PART 5（原講義 PART 4 V3）觀念填充題（自編練習，不用計算）
   11/1 使用者：期中考 2（11/9）範圍內，每一小節後面都要有填充題。
   每一小節 8 題；題目先中文，下面附英文（en）。選項正解寫第一個，hw.js 會打亂。
   下拉選項不能放 <sup>／<sub>、底線。每題考的點都在該節講義內文或陷阱框講過。
   用法：<div class="hw-list" data-bank="__CH15C" data-sec="bd"></div>
   ============================================================ */
(function () {
  'use strict';
  const P = 'ch1-part5.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  const NO = { recap: '00', bd: '01', zen: '02', sw: '03', load: '04', pwl: '05', cvd: '06', mcmp: '06+', revb: '07' };
  const sub = s => s.replace(/(^|[^A-Za-z])([A-Za-zγ])_([A-Za-z0-9γ]+)/g, '$1$2<sub>$3</sub>');
  const C = (sec, n, title, q, en, b, ex, how) =>
    items.push({ id: 'c15' + sec + '-' + n, kind: 'cf', sec, no: NO[sec] + '-' + n, how: !!how, link: P + '#' + sec, title: sub(title), q: sub(q), en: sub(en), b, ex });

  /* ═════════ 00 複習：實際曲線與簡化模型 ═════════ */
  C('recap', 1, '三段', '實際二極體曲線（V3 Fig 1.20）：左邊是 {0}，中間是 {1}，右邊是 {2}。', 'On the practical diode curve, the left part is ___, the middle is ___, and the right is ___.',
    [S(['崩潰 breakdown', 'OFF（截止）cutoff', '導通 conduction']), S(['OFF（截止）cutoff', '崩潰 breakdown', '導通 conduction']), S(['導通 conduction', '崩潰 breakdown', 'OFF（截止）cutoff'])],
    '先把這張圖記熟：左邊崩潰、中間 OFF、右邊導通。');
  C('recap', 2, '兩種模型的導通電壓', '理想模型導通時 v_D = {0}；定電壓降模型導通時 v_D = {1}。', 'When conducting, the ideal model has v_D = ___ and the constant-voltage-drop model has v_D = ___.',
    [S(['0', 'Vγ ≈ 0.7 V', 'VT', 'Vbi']), S(['Vγ ≈ 0.7 V', '0', 'VT', 'Vbi'])],
    '牆放在 0 V ⟹ 理想；牆放在 V<sub>γ</sub> ⟹ 定電壓降。');
  C('recap', 3, '換成一面牆', '用 mA 尺度看，導通那段幾乎垂直，所以模型把它換成 {0}。', 'On a mA scale the conducting part is nearly vertical, so the models replace it with ___.',
    [S(['一面牆（垂直線）a vertical wall', '水平線 a horizontal line', '圓弧 an arc', '指數曲線 an exponential'])],
    'PART 4：每 60 mV 電流 × 10，所以電壓幾乎固定。');
  C('recap', 4, '水平那段', '模型裡 v_D < V_γ 的水平那段是 {0}，等效電阻 {1}。', 'In the models, the flat part for v_D < V_γ is ___ with an equivalent resistance of ___.',
    [S(['不導通（截止）not conducting', '導通 conducting']), S(['∞', '0', 'rf', 'R'])],
    '講義 1-93、1-95、1-97 寫成「導通」是筆誤（勘誤 ②）。');
  C('recap', 5, '電流有限', '定電壓降模型導通時，電流 {0}。', 'In the constant-voltage-drop model, the conducting current is ___.',
    [S(['由外部電路決定：(VPS − Vγ)/R set by the circuit', '無限大 infinite', '等於 IS', '等於 0'])],
    '陷阱框：導通時電流無限大 ✗。');
  C('recap', 6, '模型畫不畫崩潰', '理想、定電壓降、片段線性模型 {0} 崩潰那一段。', 'The ideal, constant-drop and piecewise-linear models ___ the breakdown region.',
    [S(['都沒有 all omit', '都有 all include', '只有理想模型有 only the ideal one includes', '只有片段線性有 only the PWL one includes'])],
    '它們只有 OFF、ON 兩段；崩潰要另外考慮。');
  C('recap', 7, '數學寫法', '定電壓降模型：v_D < V_γ ⟹ {0}；i_D > 0 ⟹ {1}。', 'Constant-drop model: v_D < V_γ ⟹ ___; i_D > 0 ⟹ ___.',
    [S(['iD = 0（OFF）', 'vD = Vγ', 'iD = ∞', 'vD = 0']), S(['vD = Vγ（ON）', 'iD = 0', 'vD = 0', 'iD = IS'])],
    '投影片 1-96、1-97（1-97 的「i<sub>D</sub> ≥ 0 V」多了一個 V，勘誤 ③）。');
  C('recap', 8, '什麼時候不能用理想模型', '電源電壓跟 0.7 V 差不多大時，{0}。', 'When the supply is comparable to 0.7 V, ___.',
    [S(['不要用理想模型，要扣 Vγ do not use the ideal model', '用理想模型就好 the ideal model is fine', '二極體一定崩潰 the diode breaks down', '改用 VT use VT instead'])],
    '電源比 0.7 V 大很多時兩種模型才差不多。', true);

  /* ═════════ 01 崩潰電壓與 PIV ═════════ */
  C('bd', 1, '電場', '逆偏 V_R 越加越大，空乏區的電場 {0}。', 'As the reverse bias V_R increases, the depletion-region field ___.',
    [S(['越強 gets stronger', '越弱 gets weaker', '不變 stays the same', '反向 reverses'])],
    'PART 3：逆偏把坡墊高、空乏區變寬，電場也變強。');
  C('bd', 2, '崩潰發生什麼事', '電場強到某個值，會破壞 {0}，產生大量 {1}。', 'When the field is strong enough it breaks ___, creating many ___.',
    [S(['共價鍵 covalent bonds', '原子核 nuclei', '金屬接點 metal contacts', '電源 the supply']), S(['電子電洞對 electron–hole pairs', '光子 photons', '離子 ions', '中子 neutrons'])],
    '投影片 1-106：電子被掃到 N 區、電洞被掃到 P 區，方向跟逆向電流一樣。');
  C('bd', 3, '崩潰時的電流', '崩潰時，{0} 電流突然大幅增加。', 'At breakdown, the ___ current suddenly increases sharply.',
    [S(['逆向 reverse', '順向 forward', '位移 displacement', '漏電 to zero'])],
    '陷阱框：崩潰電流是順向電流 ✗（是 N → P 方向流過二極體）。');
  C('bd', 4, '崩潰 ≠ 燒壞', '崩潰 {0} 損壞；只有 P = V·I 太大才會 {1}。', 'Breakdown ___ damage; only when P = V·I is too large does it ___.',
    [S(['不等於 is not', '等於 is']), S(['過熱燒毀 overheat and burn out', '變成齊納 become a Zener', '變成開路 become open', '回到順偏 return to forward bias'])],
    '1-106 NOTE (2)。限流得當就不會壞，齊納二極體就靠崩潰工作。');
  C('bd', 5, '一般二極體的 BV', '一般整流二極體的崩潰電壓大約 {0}。', 'A typical rectifier diode has a breakdown voltage of about ___.',
    [S(['50～200 V', '0.7 V', '26 mV', '5 V 以下 below 5 V'])],
    '投影片 1-111。');
  C('bd', 6, 'PIV', 'PIV 是 {0}。', 'PIV is ___.',
    [S(['反向峰值電壓（可安全承受的最大逆壓額定）peak inverse voltage', '順向導通電壓 forward voltage', '崩潰時的電流 breakdown current', '最大功率 maximum power'])],
    '額定 = 設計上保證能安全工作的值；實際最大逆壓不可超過 PIV。');
  C('bd', 7, '110 V 不夠', '家用 110 V（rms）接半波整流，二極體承受的最大逆壓約 {0}。', 'With 110 V rms mains in a half-wave rectifier, the diode’s maximum reverse voltage is about ___.',
    [S(['155.6 V（峰值）peak', '110 V', '77.8 V', '220 V'])],
    '110 × √2 = 155.6 V。陷阱框：PIV 110 V 就夠 ✗。', true);
  C('bd', 8, '選零件', '選二極體時，最大逆壓要 {0} PIV，實務上再留 {1} 餘裕。', 'When choosing a diode, the maximum reverse voltage must be ___ the PIV, with a practical margin of ___.',
    [S(['小於 less than', '大於 greater than', '等於 equal to']), S(['1.5～2 倍 1.5–2×', '不用留 none', '1% 1%', '10 倍 10×'])],
    '電源會浮動、會有突波。', true);

  /* ═════════ 02 累增 vs 齊納 ═════════ */
  C('zen', 1, '累增怎麼發生', '累增崩潰：少數載子在空乏區被電場 {0}，{1} 晶格打斷共價鍵。', 'In avalanche breakdown, carriers are ___ by the field and ___ the lattice, breaking bonds.',
    [S(['加速 accelerated', '減速 slowed', '停住 stopped']), S(['撞擊 collide with', '穿過 pass through', '避開 avoid'])],
    '投影片 1-107：撞擊游離。');
  C('zen', 2, '比喻', '累增崩潰 1 → 2 → 4 → 8 的連鎖反應，像 {0}；齊納崩潰比較像 {1}。', 'Avalanche (1 → 2 → 4 → 8) is like ___; Zener breakdown is more like ___.',
    [S(['雪崩、保齡球 an avalanche / bowling', '撕紙 tearing paper', '水龍頭 a tap', '收費站 a toll booth']), S(['撕紙（直接扯斷）tearing paper', '雪崩 an avalanche', '保齡球 bowling', '旋轉門 a revolving door'])],
    '撞斷（累增）vs 扯斷（齊納）。');
  C('zen', 3, '齊納崩潰', '齊納崩潰發生在 {0} 摻雜：空乏區 {1}，小逆偏就有極強電場直接把電子拉出共價鍵。', 'Zener breakdown occurs with ___ doping: the depletion region is ___, so a small bias gives a huge field.',
    [S(['高 heavy', '低 light']), S(['很窄 very narrow', '很寬 very wide'])],
    '投影片 1-108、1-109。');
  C('zen', 4, '摻雜與 BV', '摻雜越高，W {0}，崩潰電壓 |BV| {1}。', 'Higher doping makes W ___ and |BV| ___.',
    [S(['越窄 narrower', '越寬 wider', '不變 unchanged']), S(['越小 smaller', '越大 larger', '不變 unchanged'])],
    'W ∝ √(1/N<sub>A</sub> + 1/N<sub>D</sub>)，E ≈ V/W。結論 1-110：高摻雜 → BV1（小）。陷阱框：摻雜越高空乏區越寬 ✗。');
  C('zen', 5, '看 BV 判斷', 'BV 小於約 5 V 多半是 {0} 崩潰；大於約 7 V 多半是 {1} 崩潰。', 'BV below ~5 V is mostly ___ breakdown; above ~7 V mostly ___.',
    [S(['齊納 Zener', '累增 avalanche', '熱 thermal']), S(['累增 avalanche', '齊納 Zener', '熱 thermal'])],
    '中間兩種都有（課本延伸）。');
  C('zen', 6, '平均電場', '估計空乏區電場用 E ≈ {0}。', 'The depletion field is estimated as E ≈ ___.',
    [S(['V/W', 'V·W', 'W/V', 'V²'])],
    '平均電場；突變接面的最大電場約是它的 2 倍（補充）。');
  C('zen', 7, '齊納二極體不一定是齊納崩潰', '市售齊納二極體 V_Z 大於約 6 V 的，主要其實是 {0} 崩潰。', 'Commercial Zener diodes with V_Z above ~6 V actually break down mainly by ___.',
    [S(['累增 avalanche', '齊納 Zener', '熱 thermal', '光 photo'])],
    '只是統稱「齊納二極體」。');
  C('zen', 8, '判斷流程第一步', '判斷崩潰機制，第一步先看 {0}。', 'To decide the breakdown mechanism, first look at the ___.',
    [S(['摻雜濃度 doping', '電流大小 current', '溫度 temperature', '封裝顏色 package colour'])],
    '摻雜 → W → E → 誰先發生。', true);

  /* ═════════ 03 理想開關與半波整流 ═════════ */
  C('sw', 1, '什麼元件', '二極體是 {0} 二端元件。', 'A diode is a ___ two-terminal device.',
    [S(['非線性 nonlinear', '線性 linear', '主動放大 amplifying', '三端 three-terminal'])],
    '投影片 1-112：i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1)。');
  C('sw', 2, '參考方向', 'v_D 的 + 在 {0}，i_D 的方向是 {1}。', 'The + of v_D is at the ___, and i_D flows ___.',
    [S(['P 端（陽極）anode', 'N 端（陰極）cathode']), S(['P → N', 'N → P'])],
    '投影片 1-113：定義的 + − 與電流方向是不變的。');
  C('sw', 3, '電壓反過來', '外加電壓反過來時，變的是 {0}。', 'When the applied voltage is reversed, what changes is ___.',
    [S(['vD 的正負號 the sign of vD', 'vD 的 + − 定義 the + − reference', 'iD 的參考方向 the iD reference direction'])],
    '第 07 節逆偏的 Q 點就靠這個。');
  C('sw', 4, '半波整流', '半波整流：v_I > 0 時二極體 {0}，v_I < 0 時 {1}。', 'In a half-wave rectifier, the diode is ___ for v_I > 0 and ___ for v_I < 0.',
    [S(['ON', 'OFF']), S(['OFF', 'ON'])],
    '正半周通過、負半周截止（Fig 1.27）。');
  C('sw', 5, '輸出叫什麼', '半波整流的輸出方向不變、大小一直變，叫 {0}。', 'The half-wave output, one-directional but varying, is called ___.',
    [S(['脈動直流 pulsating dc', '純直流 pure dc', '交流 ac', '方波 a square wave'])],
    '陷阱框：脈動直流就是直流 ✗，還要濾波才平。');
  C('sw', 6, '輸出峰值', '定電壓降模型、輸入峰值 5 V，半波整流的輸出峰值是 {0}。', 'With the constant-drop model and a 5 V input peak, the output peak is ___.',
    [S(['4.3 V', '5 V', '5.7 V', '0.7 V'])],
    '5 − 0.7 = 4.3 V。陷阱框：輸出峰值 = 輸入峰值 ✗。');
  C('sw', 7, '導通多久', '用定電壓降模型時，二極體導通的時間 {0} 半個週期。', 'With the constant-drop model, the diode conducts for ___ half a period.',
    [S(['比…短一點 slightly less than', '剛好等於 exactly', '比…長 more than'])],
    'v<sub>I</sub> 超過 0.7 V 才導通：8.0° 到 172°，約 45.5%。');
  C('sw', 8, '逆壓多少', '二極體 OFF 時（負半周），它承受的逆壓等於 {0}，要拿去跟 PIV 比。', 'When the diode is OFF, the reverse voltage across it equals ___, to be compared with the PIV.',
    [S(['vI（輸入電壓）the input vI', '0', 'Vγ', 'vO'])],
    '電流 0，電阻沒壓降，整個輸入都落在二極體上。', true);

  /* ═════════ 04 負載線與 Q 點 ═════════ */
  C('load', 1, '負載線由誰決定', '負載線只由 {0} 決定。', 'The load line is set only by ___.',
    [S(['外面電路（VPS、R）the external circuit', '二極體 the diode', '溫度 temperature', 'IS'])],
    '陷阱框：負載線是二極體的特性 ✗。');
  C('load', 2, '斜率', '負載線 I_D = −V_D/R + V_PS/R 的斜率是 {0}。', 'The slope of the load line I_D = −V_D/R + V_PS/R is ___.',
    [S(['−1/R', '−R', '1/R', 'VPS'])],
    'y = mx + b 的形式。');
  C('load', 3, '兩個截距', '負載線的兩個截距是 (V_PS, 0) 和 {0}。', 'The two intercepts of the load line are (V_PS, 0) and ___.',
    [S(['(0, VPS/R)', '(0, VPS·R)', '(R, 0)', '(0, R)'])],
    'I<sub>D</sub> = 0 → V<sub>D</sub> = V<sub>PS</sub>；V<sub>D</sub> = 0 → I<sub>D</sub> = V<sub>PS</sub>/R。');
  C('load', 4, '講義的數字', 'V_PS = 5 V、R = 2 kΩ，縱軸截距是 {0}。', 'With V_PS = 5 V and R = 2 kΩ, the vertical intercept is ___.',
    [S(['2.5 mA', '10 mA', '2.5 A', '0.4 mA'])],
    '5 V ÷ 2 kΩ。陷阱框：縱軸截距是 V<sub>PS</sub>·R ✗。');
  C('load', 5, 'Q 點', 'Q 點是負載線跟 {0} 的交點。', 'The Q-point is the intersection of the load line and ___.',
    [S(['二極體特性曲線 the diode curve', '橫軸 the horizontal axis', '縱軸 the vertical axis', '另一條負載線 another load line'])],
    '兩條規矩都要滿足：元件和電路。');
  C('load', 6, 'R 變大', 'R 變大，負載線 {0}。', 'If R increases, the load line becomes ___.',
    [S(['變平 flatter', '變陡 steeper', '平移 shifted but parallel'])],
    '斜率 −1/R。陷阱框：R 變大負載線變陡 ✗。');
  C('load', 7, '疊代法', '疊代法：猜 V_D → KVL 算 I_D → V_D = V_T × {0}(I_D/I_S) → 重複。', 'Iteration: guess V_D → I_D from KVL → V_D = V_T × ___(I_D/I_S) → repeat.',
    [S(['ln', 'log₁₀', 'e 的次方 exp', '平方 square'])],
    '陷阱框：疊代時用 log ✗。從 0.6～0.7 V 開始猜，兩三輪就收斂。', true);
  C('load', 8, 'V_D 為什麼卡住', 'Q 點的 V_D 怎麼調都在 0.6 V 附近，因為 {0}。', 'The Q-point V_D stays near 0.6 V however you adjust it because ___.',
    [S(['二極體曲線很陡，電流幾乎只由 VPS 和 R 決定 the diode curve is very steep', '電阻很大 R is large', 'VPS 固定 VPS is fixed', '溫度很低 it is cold'])],
    '講義 1-119 Problem：反推 R = (5 − 0.62)/2.2 mA ≈ 2 kΩ。');

  /* ═════════ 05 片段線性模型 ═════════ */
  C('pwl', 1, '幾段', '片段線性模型用 {0} 段直線去描二極體的彎線。', 'The piecewise-linear model approximates the diode curve with ___ straight lines.',
    [S(['兩 two', '一 one', '三 three', '無限多 infinitely many'])],
    'OFF 一段、ON 一段。');
  C('pwl', 2, 'OFF 段', 'V_D < V_γ 的那段：{0}。', 'For V_D < V_γ: ___.',
    [S(['ID = 0（OFF）', 'ID = VD/rf', 'VD = 0', 'ID = IS'])],
    '投影片 1-120 ②：趨近 0、跟 V<sub>D</sub> 軸平行的直線。');
  C('pwl', 3, 'V_γ', 'V_γ 叫 {0}，一般是 {1}。', 'V_γ is called the ___ and is typically ___.',
    [S(['導通電壓（切入電壓）cut-in voltage', '崩潰電壓 breakdown voltage', '熱電壓 thermal voltage']), S(['0.6～0.7 V', '26 mV', '5 V', '50 V'])],
    '投影片 1-120。');
  C('pwl', 4, 'r_f', '順偏二極體電阻 r_f 一般是 {0}。', 'The forward diode resistance r_f is typically ___.',
    [S(['數十 Ω tens of ohms', '數十 kΩ tens of kilohms', '0', '數 MΩ megohms'])],
    '投影片 1-120 ①：斜率 1/r<sub>f</sub> 的直線。');
  C('pwl', 5, 'ON 段', '導通時 V_D = {0}。', 'When ON, V_D = ___.',
    [S(['Vγ + ID·rf', 'Vγ', 'ID·R', '0'])],
    '陷阱框：V<sub>D</sub> = V<sub>γ</sub> ✗（r<sub>f</sub> = 0 才是）。');
  C('pwl', 6, '串聯電路的電流', '串聯 V_PS、R、二極體（片段線性）時，I_D = {0}。', 'For V_PS, R and a PWL diode in series, I_D = ___.',
    [S(['(VPS − Vγ)/(R + rf)', 'VPS/R', '(VPS − Vγ)/rf', 'VPS/(R + rf)'])],
    '二極體換成「V<sub>γ</sub> 電池 + r<sub>f</sub>」，代進 KVL。陷阱框：分母只寫 R ✗。');
  C('pwl', 7, 'Example 1.9 的 V_D', 'Example 1.9（5 V、2 kΩ、V_γ = 0.6 V、r_f = 10 Ω）的 V_D = {0}。', 'In Example 1.9 (5 V, 2 kΩ, V_γ = 0.6 V, r_f = 10 Ω), V_D = ___.',
    [S(['0.622 V', '0.6 V', '0.7 V', '4.4 V'])],
    'I<sub>D</sub> = 2.19 mA，V<sub>D</sub> = 0.6 + 2.19 m × 10 = 0.622 V。');
  C('pwl', 8, '電池方向', '畫等效電路時，V_γ 電池的 + 端要在 {0}；算完要檢查 {1}。', 'In the equivalent circuit, the + of the V_γ battery is on the ___; afterwards check that ___.',
    [S(['陽極 P 側 the anode (P) side', '陰極 N 側 the cathode (N) side']), S(['ID ＞ 0（不然改 OFF）', 'ID ＜ 0', 'VD ＞ VPS', 'R ＞ rf'])],
    '模型代入法的標準流程。陷阱框：電池方向畫反 ✗、沒檢查假設 ✗。', true);

  /* ═════════ 06 定電壓降模型 ═════════ */
  C('cvd', 1, '它是誰的特例', '定電壓降模型是片段線性模型在 {0} 時的特例。', 'The constant-voltage-drop model is the special case of the PWL model with ___.',
    [S(['rf = 0', 'R = 0', 'Vγ = 0', 'VPS = 0'])],
    '斜線立成垂直線。陷阱框：定電壓降 = 片段線性 ✗（是特例）。');
  C('cvd', 2, '條件', '用定電壓降模型的條件是 {0}。', 'The condition for using the constant-drop model is ___.',
    [S(['rf ≪ R', 'rf ≫ R', 'R = 0', 'VPS ＜ Vγ'])],
    '投影片 1-123。');
  C('cvd', 3, 'Q 點公式', '定電壓降模型：V_DQ = {0}，I_DQ = {1}。', 'Constant-drop model: V_DQ = ___, I_DQ = ___.',
    [S(['Vγ', '0', 'VPS', 'VPS/2']), S(['(VPS − Vγ)/R', 'VPS/R', '∞', 'Vγ/R'])],
    '題目沒給 V<sub>γ</sub> 就用 0.7 V。');
  C('cvd', 4, '電流無限大？', '只看那條垂直線，好像電流 {0}；加上負載線後，電流 {1}。', 'Looking only at the vertical line the current seems ___; with the load line it is ___.',
    [S(['無限大 infinite', '等於 0 zero']), S(['有限，由負載線決定 finite, set by the load line', '仍然無限大 still infinite', '等於 IS'])],
    '投影片 1-124 NOTE (1)(2)。');
  C('cvd', 5, '負載線怎麼動', 'V_PS 改變時負載線 {0}；R 改變時負載線 {1}。', 'Changing V_PS makes the load line ___; changing R makes it ___.',
    [S(['平移 shift', '轉動 rotate']), S(['轉動 rotate', '平移 shift'])],
    'Fig 1.30 的 A～D 四條線，交點都在 0.7 V 那條垂直線上。');
  C('cvd', 6, '三個因素', 'Q 點由 (1) {0}、(2) 外接電阻、(3) 二極體 I–V 特性 決定。', 'The Q-point is set by (1) ___, (2) the external resistor, and (3) the diode I–V characteristic.',
    [S(['電源電壓 the supply voltage', '頻率 the frequency', '電容 a capacitor', '電感 an inductor'])],
    '投影片 1-125：(1)(2) 決定負載線，(3) 決定特性曲線。');
  C('cvd', 7, 'R 加倍', '定電壓降模型中，R 加倍，V_DQ {0}。', 'In the constant-drop model, doubling R makes V_DQ ___.',
    [S(['不變 unchanged', '加倍 double', '減半 halve', '變 0 zero'])],
    'V<sub>DQ</sub> 永遠是 V<sub>γ</sub>，只有電流變（B：1.075 mA 是 A 的一半）。');
  C('cvd', 8, '電源減半', 'V_PS 從 5 V 減到 2.5 V（R 不變），電流 {0}。', 'If V_PS drops from 5 V to 2.5 V (same R), the current becomes ___.',
    [S(['比一半還少 less than half', '剛好一半 exactly half', '比一半多 more than half', '不變 unchanged'])],
    '(2.5 − 0.7)/(5 − 0.7) = 0.42，因為 0.7 V 不跟著減。', true);

  /* ═════════ 06+ 片段線性 vs 定電壓降 ═════════ */
  C('mcmp', 1, '共同目的', '片段線性和定電壓降模型的共同目的是 {0}。', 'The shared purpose of the PWL and constant-drop models is ___.',
    [S(['把彎線換成直線，才能直接代 KVL replace the curve with lines so KVL can be solved directly', '描述崩潰 describe breakdown', '算溫度 compute temperature', '讓電流無限大 make the current infinite'])],
    '彎線要疊代或畫圖；換成直線，一條 KVL 解完。');
  C('mcmp', 2, '二極體換成什麼', '片段線性把二極體換成 {0}；定電壓降換成 {1}。', 'PWL replaces the diode with ___; constant-drop replaces it with ___.',
    [S(['Vγ 電池 + rf a battery plus rf', 'Vγ 電池 a battery only', '短路 a short']), S(['Vγ 電池 a battery only', 'Vγ 電池 + rf a battery plus rf', '短路 a short'])],
    '差別只有一顆小電阻 r<sub>f</sub>。');
  C('mcmp', 3, '差多少', '兩個模型算出的電流大約相差 {0}。', 'The two models’ currents differ by roughly ___.',
    [S(['rf/R', 'R/rf', 'Vγ/VPS', 'rf·R'])],
    'I<sub>定</sub>/I<sub>片</sub> = (R + r<sub>f</sub>)/R = 1 + r<sub>f</sub>/R。');
  C('mcmp', 4, 'Example 1.9', 'Example 1.9（R = 2 kΩ、r_f = 10 Ω）兩個模型只差約 {0}。', 'In Example 1.9 (R = 2 kΩ, r_f = 10 Ω), the two models differ by only about ___.',
    [S(['0.5%', '5%', '20%', '50%'])],
    '10/2000 = 0.5%（2.189 vs 2.200 mA）。');
  C('mcmp', 5, 'R 很小時', 'R = 50 Ω、r_f = 10 Ω 時，兩個模型的電流差約 {0}。', 'With R = 50 Ω and r_f = 10 Ω, the two models differ by about ___.',
    [S(['20%', '0.5%', '2%', '200%'])],
    '73.3 vs 88.0 mA。');
  C('mcmp', 6, '頭髮比喻', '「量身高要不要算頭髮」：量人可以不算，量螞蟻不行。對應到電路，量螞蟻就是 {0}。', 'In the hair analogy, measuring an ant corresponds to ___.',
    [S(['R 跟 rf 同等級，要用片段線性 R comparable to rf', 'R ≫ rf，用定電壓降 R much larger than rf', '二極體 OFF the diode off', '電源很大 a large supply'])],
    'R ≫ r<sub>f</sub> → 定電壓降；R 跟 r<sub>f</sub> 同等級 → 片段線性。');
  C('mcmp', 7, '題目給了 r_f', '題目有給 r_f 時要用 {0}。', 'If the problem gives r_f, use ___.',
    [S(['片段線性 the PWL model', '定電壓降 the constant-drop model', '理想模型 the ideal model'])],
    '陷阱框：給了 r<sub>f</sub> 還用定電壓降 ✗，答案會對不上。', true);
  C('mcmp', 8, '能不能省', '想確認 r_f 能不能省：算 r_f/R，不到 {0} 就放心省。', 'To check whether r_f can be dropped, compute r_f/R; below ___ it is safe.',
    [S(['1%', '50%', '100%', '10 倍 10×'])],
    '選模型的流程第 3 步。', true);

  /* ═════════ 07 逆偏的 Q 點 ═════════ */
  C('revb', 1, '定義變不變', '二極體反接時，V_D、I_D 的定義方向 {0}。', 'When the diode is reversed, the reference directions of V_D and I_D ___.',
    [S(['不變 stay the same', '跟著反過來 flip too'])],
    '投影片 1-113：變的是數值的正負。陷阱框：VD 的 + − 也反過來 ✗。');
  C('revb', 2, 'KVL', '二極體反接時，照原本的定義寫 KVL：{0} = I_D·R + V_D。', 'With the diode reversed, KVL in the original references reads ___ = I_D·R + V_D.',
    [S(['−VPS', 'VPS', '0', '2VPS'])],
    '從二極體的 + − 看，電源是 −V<sub>PS</sub>。');
  C('revb', 3, '負載線在哪', '反接時，負載線落在第 {0} 象限。', 'With the diode reversed, the load line lies in quadrant ___.',
    [S(['三 III', '一 I', '二 II', '四 IV'])],
    '截距 (−V<sub>PS</sub>, 0)、(0, −V<sub>PS</sub>/R)（1-126 右上圖）。');
  C('revb', 4, 'Q 點', 'V_PS = 5 V、R = 2 kΩ 反接，Q 點 = {0}。', 'With 5 V and 2 kΩ reversed, the Q-point is ___.',
    [S(['(−5 V, 0)', '(0, −2.5 mA)', '(5 V, 2.5 mA)', '(0.7 V, 2.15 mA)'])],
    '交在特性曲線的 OFF 段。');
  C('revb', 5, '截距不是答案', '(0, −2.5 mA) 是 {0}。', '(0, −2.5 mA) is ___.',
    [S(['負載線的截距，不是交點 an intercept, not the Q-point', '逆偏的 Q 點 the reverse-bias Q-point', '崩潰點 the breakdown point'])],
    '陷阱框：逆偏 Q 點是 (0, −2.5 mA) ✗。');
  C('revb', 6, '電壓落在哪', '逆偏時電阻上的壓降是 {0}，5 V 全部落在 {1} 上。', 'In reverse bias, the resistor drop is ___ and all 5 V appear across ___.',
    [S(['0', '5 V', '2.5 V']), S(['二極體 the diode', '電阻 the resistor', '電源內部 the source'])],
    '電流 0，電阻沒壓降。');
  C('revb', 7, '還要擔心什麼', '逆壓如果超過 BV，就要回到 {0} 來看。', 'If the reverse voltage exceeds BV, you must go back to ___.',
    [S(['崩潰（§01）breakdown', '導通 conduction', '溫度計 the thermometer', '小訊號 small signal'])],
    '逆偏題目的標準流程最後一步。');
  C('revb', 8, '解題最後一步', '逆偏題目算完 Q 點，最後要檢查 {0}。', 'After finding a reverse-bias Q-point, finally check ___.',
    [S(['|VD| 有沒有超過 BV／PIV whether |VD| exceeds BV/PIV', '電流是不是無限大 whether the current is infinite', 'VT 有沒有變 whether VT changed'])],
    '逆偏題目的標準流程第 4 步。', true);

  window.__CH15C = { name: 'ch15c', items };
})();
