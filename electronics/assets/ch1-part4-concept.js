/* ============================================================
   電子學 CH1 PART 4（§02～§06）觀念填充題（自編練習，不用計算）
   11/1 使用者：期中考 2（11/9）範圍 PART 4 §02 起，每一小節後面都要有填充題。
   每一小節 8 題；題目先中文，下面附英文（en）。選項正解寫第一個，hw.js 會打亂。
   下拉選項不能放 <sup>／<sub>、底線；次方用 ⁻¹⁴ 這種字元。每題考的點都在該節講義內文或陷阱框講過。
   用法：<div class="hw-list" data-bank="__CH14C" data-sec="iv"></div>
   ============================================================ */
(function () {
  'use strict';
  const P = 'ch1-part4.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  const NO = { iv: '02', dec: '03', ideal: '04', temp: '05', thermo: '06' };
  const sub = s => s.replace(/(^|[^A-Za-z])([A-Za-zγ])_([A-Za-z0-9γ]+)/g, '$1$2<sub>$3</sub>');
  const C = (sec, n, title, q, en, b, ex, how) =>
    items.push({ id: 'c14' + sec + '-' + n, kind: 'cf', sec, no: NO[sec] + '-' + n, how: !!how, link: P + '#' + sec, title: sub(title), q: sub(q), en: sub(en), b, ex });

  /* ═════════ 02 理想 I–V ═════════ */
  C('iv', 1, 'I–V 公式長什麼樣', '理想二極體的 I–V 關係：i_D = I_S × ( {0} − 1 )。', 'The ideal diode I–V relation is i_D = I_S × ( ___ − 1 ).',
    [S(['e 的 vD/(nVT) 次方 the exponential', 'vD/VT 的比值 the ratio vD/VT', 'vD 的平方 vD squared', 'ln(vD) the log of vD'])],
    'i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/nV<sub>T</sub></sup> − 1)，整個 CH1 最重要的一條式子。');
  C('iv', 2, '「−1」從哪來', '公式裡的「−1」來自扣掉原本就有的 p_n0：所以 v_D = 0 時，電流 {0}。', 'The “−1” comes from subtracting the equilibrium p_n0, so when v_D = 0 the current is ___.',
    [S(['等於 0 zero', '等於 IS', '無限大 infinite', '等於 −IS'])],
    'δp(0) = p<sub>n0</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1)；沒加電壓就沒有多出來的載子，電流 0。');
  C('iv', 3, '逆偏的電流', '逆偏（v_D ≪ −V_T）時 i_D ≈ {0}；負號代表 {1}。', 'Under reverse bias (v_D ≪ −V_T), i_D ≈ ___; the minus sign means ___.',
    [S(['−IS', '0', '+IS', '負無限大 −∞']), S(['方向跟 iD 的定義相反 opposite to the iD reference', '電流變小 the current is smaller', '二極體壞了 the diode is broken', '電壓是負的 the voltage is negative'])],
    '投影片 1-46：極小但不是 0。陷阱框：逆偏時電流 = 0 ✗。');
  C('iv', 4, '0.1 V 是什麼', '講義說「v_D > 0.1 V 時 i_D ≈ I_Se<sup>v_D/nV_T</sup>」，這個 0.1 V 是 {0}。', 'The note “for v_D > 0.1 V, i_D ≈ I_S e<sup>v_D/nV_T</sup>” — that 0.1 V is ___.',
    [S(['−1 可以忽略的數學門檻 the threshold where −1 is negligible', '導通電壓 the cut-in voltage', '崩潰電壓 the breakdown voltage', '內建電位 the built-in potential'])],
    'e<sup>0.1/0.026</sup> ≈ 47，忽略 −1 誤差約 2%。I<sub>S</sub> = 10⁻¹⁴ A 時 0.1 V 的電流還不到 1 pA，根本還沒導通。');
  C('iv', 5, 'I_S 多大', 'I_S 正比於 {0}，矽的 I_S 大約是 {1} 等級。', 'I_S is proportional to ___, and for silicon it is on the order of ___.',
    [S(['ni²', 'ni', 'Na', '溫度 T']), S(['10⁻¹⁸～10⁻¹² A', 'mA', 'A', 'kA'])],
    'p<sub>n0</sub> = n<sub>i</sub>²/N<sub>d</sub>、n<sub>p0</sub> = n<sub>i</sub>²/N<sub>a</sub>，所以 I<sub>S</sub> ∝ n<sub>i</sub>²，極小。這也是溫度效應的伏筆。');
  C('iv', 6, '放射係數', '放射係數 n 的範圍是 {0}；題目沒說就取 {1}。', 'The emission coefficient n ranges ___; if not given, use n = ___.',
    [S(['1～2', '0～1', '2～10', '任意值 any value']), S(['1', '2', '0', '1.5'])],
    '投影片 1-44 NOTE：低電流時空乏區復合影響大，n 接近 2；電流大時擴散主導，n 接近 1。');
  C('iv', 7, 'n 變大', '放射係數 n 越大，同一個電壓下電流 {0}。', 'With a larger n, the current at the same voltage is ___.',
    [S(['越小 smaller', '越大 larger', '不變 unchanged', '變負的 negative'])],
    '指數變成 v<sub>D</sub>/(nV<sub>T</sub>)，n 越大曲線越緩。陷阱框：n 越大電流越大 ✗。');
  C('iv', 8, '單位一致', '算 e 的次方時單位要一致：v_D = 0.7 V 就要除以 V_T = {0}。', 'Units must match in the exponent: with v_D = 0.7 V, divide by V_T = ___.',
    [S(['0.026 V', '26（mV 不換算）', '0.26 V', '2.6 V'])],
    '0.7/0.026 = 26.9，不是 0.7/26。算二極體電流流程第 1 步：確認 I<sub>S</sub>、n、V<sub>T</sub>（300 K 用 0.026 V）。', true);

  /* ═════════ 03 每 60 mV 變 10 倍 ═════════ */
  C('dec', 1, '60 mV', 'n = 1 時，二極體電流變 10 倍，v_D 增加約 {0}。', 'With n = 1, for the diode current to increase tenfold, v_D increases by about ___.',
    [S(['60 mV', '26 mV', '0.7 V', '10 mV'])],
    'Δv = V<sub>T</sub> ln 10 = 0.026 × 2.303 ≈ 0.0599 V。');
  C('dec', 2, '消掉了誰', '推 Δv 時把 i_2/i_1 相除，{0} 被消掉 —— 所以這個關係跟它無關。', 'Dividing i_2 by i_1 cancels ___, so the relation does not depend on it.',
    [S(['IS', 'VT', 'vD', 'n'])],
    'I<sub>S</sub> 每顆二極體都不一樣、很難準確知道，但比值關係跟它無關。');
  C('dec', 3, '用哪種對數', 'Δv_D = nV_T × {0}(i_2/i_1)。', 'Δv_D = nV_T × ___(i_2/i_1).',
    [S(['ln（自然對數）natural log', 'log₁₀', '平方 square', '開根號 square root'])],
    '指數的反函數是 ln。用 log₁₀ 的話要寫成 2.303·nV<sub>T</sub>·log₁₀。陷阱框：用 log 不用 ln ✗。');
  C('dec', 4, '2 倍、100 倍', '電流變 2 倍只要 {0}；變 100 倍要 {1}。', 'Doubling the current needs ___; ×100 needs ___.',
    [S(['約 18 mV', '60 mV', '120 mV', '36 mV']), S(['約 120 mV', '60 mV', '600 mV', '1.2 V'])],
    '0.026 × ln 2 ≈ 18 mV；100 倍 = 兩個 10 倍 = 2 × 60 mV。');
  C('dec', 5, 'n = 2', '如果 n = 2，每 {0} 電流變 10 倍。', 'If n = 2, the current changes tenfold every ___.',
    [S(['120 mV', '60 mV', '30 mV', '240 mV'])],
    'Δv = nV<sub>T</sub> ln 10，n = 2 就全部加倍。');
  C('dec', 6, '對數座標', '縱軸用對數刻度畫 I–V 曲線（Fig 1.18），順偏那段會變成 {0}。', 'On a log current scale (Fig 1.18), the forward-bias I–V curve becomes ___.',
    [S(['直線 a straight line', '圓弧 an arc', '拋物線 a parabola', '水平線 a horizontal line'])],
    '指數函數取對數就是直線：每 60 mV 往上一格（一個數量級）。');
  C('dec', 7, '電壓幾乎不動', '電流從 1 mA 變 10 mA，電壓才多 {0}，所以二極體導通後電壓 {1}。', 'From 1 mA to 10 mA the voltage rises only ___, so once on, the diode voltage ___.',
    [S(['0.06 V', '0.6 V', '6 V', '0.006 V']), S(['幾乎不動 barely changes', '加倍 doubles', '變 10 倍 rises tenfold', '變負的 goes negative'])],
    '這就是後面「定電壓降模型」能把二極體當成 0.7 V 電池的原因。');
  C('dec', 8, '什麼時候能用', '60 mV 規則只在 {0} 時成立。', 'The 60 mV rule holds only ___.',
    [S(['順偏且 −1 可忽略（vD ≳ 0.1 V）forward bias with −1 negligible', '逆偏 reverse bias', '崩潰區 breakdown', '任何電壓 any voltage'])],
    '推導第一步就把 −1 丟掉了。陷阱框：任何電壓都適用 ✗。', true);

  /* ═════════ 04 理想二極體模型 ═════════ */
  C('ideal', 1, '開關', '理想二極體模型：逆偏 = {0}，順偏 = {1}。', 'Ideal diode model: reverse bias = ___, forward bias = ___.',
    [S(['斷路 OFF open circuit', '短路 short circuit', '0.7 V 電池 a 0.7 V battery', '電阻 a resistor']),
     S(['短路 ON short circuit', '斷路 open circuit', '電流源 a current source', '電容 a capacitor'])],
    '把指數曲線簡化成開關：逆偏 OFF、順偏 ON。');
  C('ideal', 2, '為什麼 I_S 可以當 0', '逆偏電流 I_S ≈ 10⁻¹⁴ A 可以當成 0，因為它跟電路裡的 mA 差了約 {0} 個數量級。', 'The reverse current I_S ≈ 10⁻¹⁴ A can be taken as 0 because it is about ___ orders of magnitude below circuit currents in mA.',
    [S(['11', '3', '1', '30'])],
    '10⁻¹⁴ A 對 10⁻³ A：差 11 個數量級，比電阻的誤差還小。R<sub>R</sub> = V<sub>R</sub>/I<sub>R</sub> → ∞。');
  C('ideal', 3, '導通時電流多大', '理想二極體導通（短路）時，電流 {0}。', 'When the ideal diode conducts (short), its current is ___.',
    [S(['由外部電路決定，例如 VS/R set by the external circuit', '無限大 infinite', '等於 IS', '等於 0'])],
    '投影片 1-49 在 I<sub>F</sub> 旁標的「∞」是錯的（勘誤 ①）；短路只代表二極體本身不擋電流。');
  C('ideal', 4, '牆放在 0.7 V', '把導通那面「牆」放在 0.7 V（V_γ）的模型叫 {0}。', 'Placing the vertical “wall” at 0.7 V (V_γ) gives the ___.',
    [S(['定電壓降模型 constant-voltage-drop model', '理想二極體模型 ideal diode model', '小訊號模型 small-signal model', '崩潰模型 breakdown model'])],
    '牆放在 0 V = 理想二極體；放在 0.7 V = 定電壓降模型。');
  C('ideal', 5, '哪時候兩種模型差不多', '電源電壓 {0} 時，理想模型跟 0.7 V 模型算出來差不多。', 'The ideal model and the 0.7 V model give similar results when the supply voltage is ___.',
    [S(['比 0.7 V 大很多 much larger than 0.7 V', '跟 0.7 V 差不多 close to 0.7 V', '小於 0.7 V below 0.7 V', '等於 0 zero'])],
    '電源小的時候才一定要扣 0.7 V。陷阱框：0.7 V 模型永遠比理想模型好 ✗（V<sub>S</sub> ≫ 0.7 V 時差不多）。');
  C('ideal', 6, '解題第一步', '用理想模型解電路：先假設二極體 {0}，算出 i_D {1} 才表示假設成立。', 'To solve with the ideal model, first assume the diode is ___; the assumption holds if i_D ___.',
    [S(['導通 ON', '截止 OFF', '崩潰 in breakdown', '燒壞 burnt out']), S(['＞ 0', '＜ 0', '= 0', '無限大 is infinite'])],
    '標準流程第 1、2 步。', true);
  C('ideal', 7, '假設錯了', '假設 ON 卻算出 i_D < 0，就改假設 {0}，並檢查二極體兩端電壓 {1}。', 'If assuming ON gives i_D < 0, switch to ___ and check that the diode voltage is ___.',
    [S(['OFF（斷路，iD = 0）OFF (open)', '短路 a short', '崩潰 breakdown', '0.7 V 電池 a battery']), S(['＜ Vγ', '＞ Vγ', '= Vbi', '= VT'])],
    '標準流程第 3 步。', true);
  C('ideal', 8, '0.7 V 不是 V_bi', '導通電壓 V_γ ≈ 0.7 V 跟內建電位 V_bi {0}。', 'The cut-in voltage V_γ ≈ 0.7 V and the built-in potential V_bi are ___.',
    [S(['是不同的量 different quantities', '是同一個量 the same quantity', '剛好差 2 倍 off by exactly 2×', '都等於 VT both equal to VT'])],
    '陷阱框：0.7 V 就是 V<sub>bi</sub> ✗（PART 3 勘誤 ④）。');

  /* ═════════ 05 溫度效應 ═════════ */
  C('temp', 1, '−2 mV/°C', '固定 i_D 時，溫度每升 1 °C，v_D 大約 {0}。', 'At fixed i_D, each 1 °C rise changes v_D by about ___.',
    [S(['−2 mV（下降）decreases by 2 mV', '+2 mV（上升）increases by 2 mV', '不變 unchanged', '−60 mV'])],
    'dv<sub>D</sub>/dT ≈ −2 mV/°C。');
  C('temp', 2, '跟溫度有關的兩個量', 'i_D = I_S(e<sup>v_D/nV_T</sup> − 1) 裡跟溫度有關的是 V_T 和 {0}。', 'In i_D = I_S(e<sup>v_D/nV_T</sup> − 1), the temperature-dependent quantities are V_T and ___.',
    [S(['IS', 'n', 'vD', 'R'])],
    'V<sub>T</sub> = kT/e；I<sub>S</sub> ∝ n<sub>i</sub>²。');
  C('temp', 3, '多久翻倍', '講義：溫度每增加約 {0}，I_S 倍增。', 'Per the slides, I_S doubles for roughly every ___ rise.',
    [S(['5 °C', '1 °C', '50 °C', '100 °C'])],
    '300 → 305 K 算出來約 2.1 倍（實際逆偏電流約每 10 °C 翻倍）。');
  C('temp', 4, '誰贏', '溫度升高：V_T 變大讓 v_D {0}，I_S 變大讓 v_D {1}，最後 {2} 的影響贏。', 'As T rises, a larger V_T pushes v_D ___, a larger I_S pushes v_D ___, and ___ wins.',
    [S(['上升 up', '下降 down', '不變 unchanged']), S(['下降 down', '上升 up', '不變 unchanged']), S(['IS', 'VT', '兩者抵消 neither'])],
    '投影片 1-51：「I<sub>S</sub> 的增加通常遠比 V<sub>T</sub> 的增加顯著」。陷阱框：V<sub>T</sub> 變大所以 v<sub>D</sub> 變大 ✗。');
  C('temp', 5, '曲線往哪移', '溫度升高，I–V 曲線 {0}，同一電壓下電流 {1}。', 'As temperature rises, the I–V curve shifts ___, and the current at the same voltage ___.',
    [S(['往左 left', '往右 right', '不動 nowhere', '往下 down']), S(['變大 increases', '變小 decreases', '不變 stays the same', '變負 goes negative'])],
    '越熱載子越多，越「好過」。');
  C('temp', 6, '主角是哪一項', 'I_S ∝ T³e<sup>−E_g/kT</sup>：溫度效應的主角是 {0}，T³ 只貢獻約 5%。', 'In I_S ∝ T³e<sup>−E_g/kT</sup>, the dominant temperature term is ___; T³ contributes only ~5%.',
    [S(['能隙那項（e 的 −Eg/kT 次方）the band-gap exponential', 'T³', 'VT', '摻雜濃度 doping'])],
    '(305/300)³ ≈ 1.05，e 的次方 ≈ 2.0。');
  C('temp', 7, '鍺 vs 矽', '鍺的能隙（0.66 eV）比矽小，所以鍺的 I_S {0}。', 'Germanium has a smaller band gap (0.66 eV) than silicon, so its I_S is ___.',
    [S(['大好幾個數量級 several orders larger', '小很多 much smaller', '差不多 about the same', '等於 0 zero'])],
    '能隙小 → n<sub>i</sub> 大很多 → I<sub>S</sub> ∝ n<sub>i</sub>² 大很多（投影片 1-53）。');
  C('temp', 8, '精不精確', '−2 mV/°C 是 {0}。', 'The −2 mV/°C figure is ___.',
    [S(['經驗值（約 −1.5～−2.5 mV/°C）an empirical value', '精確的物理常數 an exact constant', '只在逆偏成立 valid only in reverse bias', '跟材料無關的定律 a material-independent law'])],
    '依電流與元件而定；下一節溫度計算出來是 −1.74 mV/K。');

  /* ═════════ 06 二極體溫度計 ═════════ */
  C('thermo', 1, '怎麼量溫度', '二極體溫度計：讓二極體流 {0}，量它的 {1} 反推溫度。', 'A diode thermometer drives the diode with ___ and measures its ___ to infer temperature.',
    [S(['固定電流 a constant current', '固定電壓 a constant voltage', '交流 an ac signal', '零電流 zero current']), S(['電壓 VD voltage', '電流 current', '電阻 resistance', '功率 power'])],
    '缺點反過來就是優點：v<sub>D</sub> 隨溫度幾乎線性下降。');
  C('thermo', 2, '近似定電流源', '課本用 15 V 電源 + 15 kΩ 就能近似定電流，因為 {0}。', 'A 15 V supply with 15 kΩ approximates a constant current because ___.',
    [S(['電源電壓遠大於 VD the supply is much larger than VD', '電阻很小 the resistor is small', '二極體逆偏 the diode is reverse biased', '溫度固定 the temperature is fixed'])],
    'V<sub>D</sub> 只變 0.1 V，I<sub>D</sub> 只變 0.7%。');
  C('thermo', 3, '1.12 V 是什麼', 'V_D ≈ 1.12 − 0.522(T/300) 裡的 1.12 V 是 {0}。', 'In V_D ≈ 1.12 − 0.522(T/300), the 1.12 V is ___.',
    [S(['矽的能隙 Eg/e silicon band gap', '內建電位 Vbi', '導通電壓 Vγ', '熱電壓 VT'])],
    '把 e<sup>−E<sub>g</sub>/kT</sup> 從 ln 裡拿出來，剛好變成常數 E<sub>g</sub>/e。');
  C('thermo', 4, '讀溫度', '量到的 V_D 越小，代表溫度越 {0}。', 'A smaller measured V_D means the temperature is ___.',
    [S(['高 higher', '低 lower', '不變 unchanged'])],
    '陷阱框：電壓越高溫度越高 ✗。');
  C('thermo', 5, 'T 的單位', '溫度計公式裡的 T 要用 {0}。', 'The T in the thermometer formula must be in ___.',
    [S(['絕對溫度 K kelvin', '攝氏 °C Celsius', '華氏 °F Fahrenheit', '任何單位都可以 any unit'])],
    '300 K ≈ 27 °C；°F 要再換算。');
  C('thermo', 6, '斜率', 'Fig 1.48 那條直線的斜率約 {0}。', 'The slope of the line in Fig 1.48 is about ___.',
    [S(['−1.74 mV/K', '+1.74 mV/K', '−60 mV/K', '−0.7 V/K'])],
    '−0.522/300 = −1.74 mV/K，跟上一節的 −2 mV/°C 同一個等級。');
  C('thermo', 7, '為什麼是直線', 'V_D 對 T 幾乎是直線，是因為 {0} 在 ln 裡面，隨溫度變得很慢。', 'V_D is nearly linear in T because ___ sits inside the ln and changes slowly with T.',
    [S(['T³', 'Eg', 'ID 的平方 ID²', '1.12 V'])],
    '溫度變 20%，ln(K·T³/I<sub>D</sub>) 才變一點點，所以在 300 K 附近當常數。');
  C('thermo', 8, '電流不固定的後果', '如果電流沒固定、變了 10 倍，電壓會差 60 mV，相當於溫度誤差約 {0}。', 'If the current is not held constant and changes tenfold, V_D shifts 60 mV — a temperature error of about ___.',
    [S(['30 多度 over 30 degrees', '0.1 度 0.1 degree', '3 度 3 degrees', '300 度 300 degrees'])],
    '60 mV ÷ 1.74 mV/K ≈ 34 K。陷阱框：電流不用固定 ✗。', true);

  window.__CH14C = { name: 'ch14c', items };
})();
