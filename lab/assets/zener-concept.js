/* ============================================================
   電子實習 第六章 稽納二極體 — 觀念填充（自編練習，不用計算）
   三組各 8 題：特性（p.2–4）、穩壓電路（p.5）、實驗（課堂實驗＋PSpice）
   選項正解寫第一個，hw.js 會打亂。下拉選項只能是純文字（不能有 <sub>、<sup>、底線）。
   ============================================================ */
(function () {
  'use strict';
  const S = o => ({ o: o.map(x => x.replace(/_/g, '')), a: 0 });
  const sub = t => t.replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>');
  const items = [];
  const K = (sec, n, link, title, q, en, b, ex, how) =>
    items.push({ id: 'zn-' + ({ '特性': 'a', '電路': 'b', '實驗': 'c' })[sec] + n, kind: 'cf', sec, no: sec + '-' + n, how: !!how, link, title: sub(title), q: sub(q), en: sub(en), b, ex: sub(ex) });
  const LA = 'zener.html#zd', LB = 'zener.html#circ', LC = 'zener.html#exp';

  /* ═════════ 特性 ═════════ */
  K('特性', 1, 'zener.html#reg', '穩壓電路在做什麼',
    '穩壓電路讓輸出電壓在 {0} 或 {1} 時盡量不變。',
    'A regulator keeps the output constant when ___ or ___ changes.',
    [S(['電源浮動 the supply varies', '溫度固定 temperature is fixed', '頻率加倍 frequency doubles', '電阻燒掉 a resistor burns']), S(['負載電流變化 the load current', '示波器換檔 the scope range', '二極體換色 the diode color', '探棒換邊 the probe side'])],
    '講義 p.2：即使電源有浮動，或是負載電流有變化時，盡可能使輸出電壓不變。');
  K('特性', 2, 'zener.html#reg', '電源供應器最後一關',
    '電源供應器的順序是 變壓 → 整流 → 濾波 → {0}。',
    'A power supply goes transformer → rectifier → filter → ___.',
    [S(['穩壓 regulator', '放大 amplifier', '整流 rectifier', '振盪 oscillator'])],
    '濾波後還剩一點漣波，負載變動也會讓電壓掉，最後用穩壓電路把它壓平。');
  K('特性', 3, LA, '稽納靠什麼穩壓',
    '稽納二極體是利用二極體的 {0} 效應來穩壓，所以在電路裡要 {1}。',
    'A Zener diode regulates using the ___ effect, so it is connected ___.',
    [S(['崩潰 breakdown', '整流 rectification', '電容 capacitance', '溫度 thermal']), S(['逆偏 reverse biased', '順偏 forward biased', '不用偏壓 unbiased', '串聯在負載後 in series after the load'])],
    '講義 p.3：利用崩潰效應設計穩壓器。陰極接高電位、反著接，才會進入崩潰區。');
  K('特性', 4, LA, '崩潰區的形狀',
    '電流大於 I_ZK 時，稽納的 V-I 特性曲線幾乎是 {0}，所以電流變很多、電壓 {1}。',
    'Above I_ZK the V-I curve is almost ___, so the voltage ___ while the current changes a lot.',
    [S(['一條直線（很陡）a straight steep line', '一條水平線 a flat line', '一個圓 a circle', '一個指數下降 an exponential decay']), S(['幾乎不變 barely changes', '跟著加倍 doubles', '變成零 drops to zero', '變成負的 turns negative'])],
    '講義 p.4。很陡的直線＝電壓幾乎固定，這就是它能穩壓的原因。');
  K('特性', 5, LA, '膝點電流',
    '流過稽納的電流永遠不得小於 {0}，否則 {1}。',
    'The Zener current must never fall below ___, otherwise ___.',
    [S(['I_ZK（膝點電流）knee current', 'I_MAX', 'I_S（逆向飽和電流）', '0.7 A']), S(['會離開穩壓區、電壓穩不住 regulation is lost', '二極體會燒掉 it burns out', '電源會短路 the source shorts', '變成順偏 it becomes forward biased'])],
    '講義 p.4。電流太小就在膝蓋下面；燒掉是電流太大（超過 I_MAX）的問題。');
  K('特性', 6, LA, '動態電阻',
    'r_z 叫做 {0}，關係式是 {1}。',
    'r_z is called the ___, and the relation is ___.',
    [S(['動態電阻 dynamic resistance', '負載電阻 load resistance', '串聯電阻 series resistance', '漏電阻 leakage resistance']), S(['ΔV = r_z × ΔI', 'V = r_z / I', 'ΔI = r_z × ΔV', 'P = r_z × I'])],
    '講義 p.4：ΔV = r_z ΔI。r_z 越小，電流變動造成的電壓變動越小。');
  K('特性', 7, LA, '等效電路',
    '在崩潰區，稽納可以等效成一顆電池 V_ZO {0} 一顆小電阻 r_z，所以 V_Z = {1}。',
    'In breakdown the Zener is modeled as a battery V_ZO ___ a small resistance r_z, so V_Z = ___.',
    [S(['串聯 in series with', '並聯 in parallel with', '取代 replacing', '反接 reversed across']), S(['V_ZO + r_z × I_Z', 'V_ZO − r_z × I_Z', 'r_z / I_Z', 'V_ZO × r_z'])],
    '講義 p.3–4 的等效電路與 V_z = V_zo + r_z × I_z。電流越大，電壓多一點點。');
  K('特性', 8, LA, '跟一般二極體的差別',
    '一般二極體 {0} 崩潰；稽納二極體 {1} 工作在崩潰區。',
    'An ordinary diode ___ breakdown; a Zener diode ___ in breakdown.',
    [S(['要避免 avoids', '一定會 always enters', '不會有 never has', '只在順偏時 only when forward biased']), S(['故意 is meant to operate', '不能 can never operate', '只有高溫時 operates only when hot', '只有順偏時 operates only forward'])],
    '一般二極體用 PIV 額定避開崩潰；稽納重摻雜、崩潰電壓低又準，故意住在崩潰區穩壓。');

  /* ═════════ 穩壓電路 ═════════ */
  K('電路', 1, LB, '電路長怎樣',
    '最簡單的稽納穩壓器：電源串一顆 {0}，稽納和負載 {1}。',
    'The simplest Zener regulator: the source feeds a series ___, and the Zener and load are ___.',
    [S(['電阻 R resistor', '電容 capacitor', '電感 inductor', '二極體 diode']), S(['並聯 in parallel', '串聯 in series', '反接 reversed', '分開接地 grounded separately'])],
    '講義 p.5 圖 6.5。負載並在稽納旁邊，所以負載電壓就是稽納電壓。');
  K('電路', 2, LB, '串聯電阻的角色',
    '串聯電阻 R 負責吃掉 {0}，像進水管上的節流閥。',
    'The series resistor R absorbs ___, like a throttle valve on the inlet pipe.',
    [S(['電源比 V_Z 多出來的電壓 the excess voltage above V_Z', '全部的電源電壓 the whole supply voltage', '負載電流 the load current', '漣波頻率 the ripple frequency'])],
    'V_R = V_S − V_Z。電源變大，R 就多吃一點，輸出不動。');
  K('電路', 3, LB, '電流分帳',
    '節點的電流關係是 I_R = {0}。',
    'At the node, I_R = ___.',
    [S(['I_Z + I_L', 'I_Z − I_L', 'I_L − I_Z', 'I_Z × I_L'])],
    'R 送下來的電流分成兩路：給負載 I_L、剩下的流進稽納 I_Z。');
  K('電路', 4, LB, '電源變大時',
    '稽納在穩壓時，電源電壓變大，多出來的電流主要流進 {0}，輸出電壓 {1}。',
    'When the supply rises during regulation, the extra current mainly flows into ___, and the output ___.',
    [S(['稽納 the Zener', '負載 the load', '電源 the source', '地線以外的地方 nowhere']), S(['幾乎不變 barely changes', '跟著變大 rises proportionally', '變成零 drops to zero', '變負 turns negative'])],
    '像溢流管：進水變多，多的從溢流管流走，水位不變。');
  K('電路', 5, LB, '負載變重時',
    '負載吃的電流變多，稽納的電流會 {0}。',
    'When the load draws more current, the Zener current ___.',
    [S(['變少 decreases', '變多 increases', '不變 stays the same', '反向 reverses'])],
    'I_R ≈ (V_S − V_Z)/R 幾乎固定，負載多拿多少，稽納就少拿多少。少到 I_ZK 以下就穩不住了。', true);
  K('電路', 6, LB, '有沒有崩潰（解法）',
    '判斷稽納有沒有崩潰：先 {0}，算 {1}，再跟 V_ZO 比。',
    'To check breakdown: first ___, compute ___, then compare with V_ZO.',
    [S(['把稽納拿掉 remove the Zener', '把電源拿掉 remove the source', '把 R 短路 short R', '把負載拿掉 remove the load']), S(['V_S × R_L / (R + R_L)', 'V_S × R / (R + R_L)', 'V_S / R', 'V_S × R_L'])],
    '講義 p.5 的判斷式。分壓 ≥ V_ZO 放回稽納才會崩潰。', true);
  K('電路', 7, LB, '只看電源夠不夠',
    '只檢查「V_S ≥ V_ZO」{0} 判斷稽納有沒有穩壓，因為 {1}。',
    'Checking only "V_S ≥ V_ZO" is ___ to decide regulation, because ___.',
    [S(['不足以 not enough', '就足以 enough', '一定錯誤 always wrong', '永遠正確 always right']), S(['負載會和 R 分壓、把電壓拉低 the load forms a divider with R', '稽納會順偏 the Zener turns forward', '電源有內阻 the source has no resistance', '頻率不同 the frequency differs'])],
    '講義 p.5 寫的穩壓條件 V_S ≥ V_zo 只是必要條件；真正要看的是分壓 V_S·R_L/(R+R_L) ≥ V_zo（PSpice V3 就是反例）。', true);
  K('電路', 8, LB, '沒崩潰時輸出是什麼',
    '稽納沒崩潰時，可以把它當成 {0}，輸出就是 {1}。',
    'When the Zener is not in breakdown it acts like ___, and the output is ___.',
    [S(['斷路 an open circuit', '短路 a short circuit', '電池 a battery', '電容 a capacitor']), S(['R 和 R_L 的分壓 the R–R_L divider voltage', 'V_Z', '0 V', '電源電壓 the full supply'])],
    '還沒崩潰時稽納幾乎沒電流，等於拿掉，輸出就是分壓；電源一晃它就跟著晃。');

  /* ═════════ 實驗 ═════════ */
  K('實驗', 1, LC, '實驗 1 改什麼',
    '實驗 1 固定 R1 = 1 kΩ，改變 {0}，量測 {1}。',
    'Experiment 1 fixes R1 = 1 kΩ, varies ___, and measures ___.',
    [S(['輸入電壓 V_S', '稽納型號', '頻率', '負載電容']), S(['稽納兩端電壓 V_D', '電源內阻', '示波器頻寬', '溫度'])],
    '講義 p.9：改變輸入電壓 Vs，量測輸出電壓，計算電流。');
  K('實驗', 2, LC, '電流怎麼來',
    '實驗 1 的 I_D 不用電流表，用 {0} 算。',
    'In Experiment 1, I_D is calculated from ___.',
    [S(['(V_S − V_D) / R1', 'V_D / R1', 'V_S / R1', 'V_D × R1'])],
    'R1 上的電壓 = V_S − V_D，除以 1 kΩ 就是流過稽納的電流。', true);
  K('實驗', 3, LC, '兩張 Excel 圖',
    '第一張圖 X 軸 {0}、Y 軸 V_D；第二張是 {1} 的 V-I 曲線。',
    'Plot 1: X = ___, Y = V_D; Plot 2: the V-I curve of ___.',
    [S(['V_S', 'I_D', '時間', '溫度']), S(['I_D 對 V_D', 'V_S 對 時間', 'V_D 對 溫度', 'I_D 對 頻率'])],
    '講義 p.9：VD 對 Vs 的曲線，以及 ID 對 VD 的 V-I 曲線。');
  K('實驗', 4, LC, 'V_S 小的時候',
    'V_S 只有 2 V 時，稽納還沒崩潰，V_D 會 {0}。',
    'With V_S = 2 V the Zener is not in breakdown, so V_D ___.',
    [S(['幾乎等於 V_S approximately equals V_S', '等於 5.1 V equals 5.1 V', '等於 0.7 V equals 0.7 V', '等於 0 V equals 0 V'])],
    '幾乎沒電流，電阻沒壓降，電源電壓全部在稽納上（模擬 1.995 V）。');
  K('實驗', 5, LC, '並負載那一組',
    'V_S = 15 V 時並 1 kΩ、10 kΩ、20 kΩ，V_D 會 {0}。',
    'With V_S = 15 V and 1k, 10k, 20k in parallel, V_D ___.',
    [S(['幾乎一樣（約 5 V） stays about 5 V', '跟負載成正比 scales with the load', '1 kΩ 時變成 0 V drops to 0 V at 1k', '變成 15 V becomes 15 V'])],
    '分壓都夠（最小 7.5 V），稽納都在穩壓；模擬 5.04、5.07、5.07 V。');
  K('實驗', 6, LC, '稽納怎麼接',
    '在麵包板上，稽納的陰極（有色環那端）要接 {0}。',
    'On the breadboard, the Zener cathode (banded end) goes to ___.',
    [S(['較高電位（R1 那端）the higher potential (R1 side)', '地 ground', '電源負端 the negative terminal', '隨便哪端 either end'])],
    '要反著接才會進入崩潰區。接反了它就是順偏，V_D 只會量到約 0.7 V。');
  K('實驗', 7, 'zener.html#pspice', 'PSpice V3',
    'PSpice V3 照講義接（R3 = 1k、負載 1k），分壓約 4.5 V，稽納 {0}，V3 約 {1}。',
    'With R3 = 1k and a 1k load, the divider gives about 4.5 V, so the Zener ___ and V3 is about ___.',
    [S(['沒崩潰 is not in breakdown', '在穩壓 regulates', '燒掉 burns out', '順偏 is forward biased']), S(['4.3 V', '5.1 V', '9.3 V', '0 V'])],
    '4.5 V < 5.1 V，稽納沒崩潰，V3 只是分壓（模擬 4.18～4.46 V）。負載換 10 kΩ 才會穩在約 5.03 V。', true);
  K('實驗', 8, 'zener.html#pspice', 'PSpice 元件',
    'PSpice 作業的稽納型號是 {0}，整流二極體是 {1}。',
    'In the PSpice homework the Zener is ___ and the rectifier diode is ___.',
    [S(['D1N5231（5.1 V）', 'D1N4007', 'D1N4148', 'D1N750']), S(['D1N4007（講義 p.6–8 寫 D1N4001）', 'D1N5231', 'D1N4148', 'Q2N2222'])],
    '講義 p.10。p.6–8 的示意圖寫 D1N4001，p.10 作業寫 D1N4007，兩顆在這個電路裡結果幾乎一樣。');

  window.__ZNC = { name: 'zenerc', items };
})();
