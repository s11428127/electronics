/* ============================================================
   電路學 CH13／CH14 觀念填充題（自編練習，不用計算）
   每一小節 8 題：13.2～13.7、13.9（13.8 PSpice 不做）、14.2、14.3。題目先中文，下面附英文。
   選項正解寫在第一個，hw.js 會打亂。下拉選項不能放 <sup>、底線。
   用法：<div class="hw-list" data-bank="__CH13C" data-sec="13.2"></div>
   ============================================================ */
(function () {
  'use strict';
  const P1 = 'ch13-part1.html', P2 = 'ch13-part2.html', P3 = 'ch13-part3.html', P4 = 'ch14-part1.html';
  const S = o => ({ o, a: 0 });
  const items = [];
  const C = (sec, n, link, title, q, en, b, ex, how) =>
    items.push({ id: 'c' + sec.replace('.', '') + '-' + n, kind: 'cf', sec, no: sec + '-' + n, how: !!how, link, title, q, en, b, ex });

  /* ═════════ 13.2 互感 ═════════ */
  const L2 = P1 + '#mut';
  C('13.2', 1, L2, '互感的定義',
    '一個線圈的 {0} 在鄰近線圈感應出電壓的能力，叫互感，單位是 {1}。',
    'Mutual inductance is the ability of one inductor to induce a voltage across a neighboring inductor by its ___; it is measured in ___.',
    [S(['電流變化 changing current', '固定電流 constant current', '電阻 resistance', '電荷 charge']), S(['亨利 henrys (H)', '法拉 farads (F)', '歐姆 ohms', '韋伯 webers'])],
    'v₂ = M di₁/dt：要電流「在變」才有感應電壓，M 跟 L 一樣用亨利。');
  C('13.2', 2, L2, '直流時',
    '兩個耦合線圈接直流電源，電流穩定後，互感電壓 {0}。',
    'When coupled coils are driven by a dc source, after the current settles the mutual voltage is ___.',
    [S(['為零 zero', '最大 maximum', '等於電源電壓 equal to the source voltage', '無限大 infinite'])],
    '直流穩態 di/dt = 0，所以 M di/dt = 0。課本：互感只在電路由「時變」電源驅動時存在。');
  C('13.2', 3, L2, '打點規則（一）',
    '電流從線圈 1 有點的那端流進，線圈 2 互感電壓的參考極性在線圈 2 有點那端是 {0}。',
    'If a current enters the dotted terminal of one coil, the reference polarity of the mutual voltage in the second coil is ___ at the dotted terminal of the second coil.',
    [S(['正 positive', '負 negative', '零 zero', '不一定 undetermined'])],
    '課本的打點規則原文：enters the dotted terminal → positive at the dotted terminal。');
  C('13.2', 4, L2, '打點規則（二）',
    '電流從線圈 1 有點的那端流出，線圈 2 有點那端的互感電壓參考極性是 {0}。',
    'If a current leaves the dotted terminal of one coil, the reference polarity of the mutual voltage in the second coil is ___ at its dotted terminal.',
    [S(['負 negative', '正 positive', '零 zero', '跟電流大小有關 dependent on the current magnitude'])],
    '流出點 → 對方點端為負。實際用法：兩個電流同進同出點取 +M，一進一出取 −M。');
  C('13.2', 5, L2, '點代表什麼',
    '電路圖上的點是用來代替畫出線圈的 {0}，由題目給定。',
    'The dots on a schematic replace drawing the ___ of the coils; they are given in the problem.',
    [S(['實際繞線方向 actual winding direction', '電阻值 resistance', '匝數 number of turns', '電流大小 current magnitude'])],
    '互感電壓的極性取決於兩個線圈怎麼繞（冷次定律＋右手定則），電路圖畫不出來，就用點表示。');
  C('13.2', 6, L2, '串聯加成',
    '兩個耦合線圈串聯，電流都從點流進（串聯加成），總電感 L = {0}。',
    'For two coupled coils in series-aiding connection, the total inductance is L = ___.',
    [S(['L1 + L2 + 2M', 'L1 + L2 − 2M', 'L1 + L2 + M', 'L1 + L2'])],
    '每個線圈多一個 +M di/dt，兩個線圈合計多 2M。', true);
  C('13.2', 7, L2, '串聯相消',
    '兩個耦合線圈串聯，一個從點流進、一個從點流出（串聯相消），總電感 L = {0}。',
    'For series-opposing connection, L = ___.',
    [S(['L1 + L2 − 2M', 'L1 + L2 + 2M', 'L1 − L2', '2M'])],
    '互感項變負：L = L₁ + L₂ − 2M。', true);
  C('13.2', 8, L2, '解法：相依電壓源',
    '分析有互感的電路時，課本建議把互感項看成 {0}，先寫大小 jωMI，再用打點規則決定 {1}。',
    'When analyzing coupled circuits, the text suggests modeling the mutual term as a ___ of value jωMI, and then using the dot convention to fix its ___.',
    [S(['相依電壓源 dependent voltage source', '獨立電流源 independent current source', '電阻 resistor', '短路 short circuit']), S(['極性（正負號）polarity', '頻率 frequency', '大小 magnitude', '相位 phase angle'])],
    '課本圖 13.8：把「大小」和「正負號」拆成兩個步驟，比較不會錯。', true);

  /* ═════════ 13.3 耦合電路的能量 ═════════ */
  const L3 = P1 + '#energy';
  C('13.3', 1, L3, '耦合線圈的能量',
    '耦合線圈儲存的能量 w = ½L1 i1² + ½L2 i2² ± M i1 i2；兩個電流同進同出點時互感項取 {0}，一進一出取 {1}。',
    'The energy stored in coupled coils is w = ½L1 i1² + ½L2 i2² ± M i1 i2; the mutual term is ___ when both currents enter (or leave) the dotted terminals, and ___ otherwise.',
    [S(['+（正）positive', '−（負）negative', '0', '不一定 undetermined']), S(['−（負）negative', '+（正）positive', '0', '不一定 undetermined'])],
    '多出來的 M i₁ i₂ 是兩個磁場互相加強（或抵消）的部分，正負號跟電路的互感項一樣用打點規則。');
  C('13.3', 2, L3, 'M 的上限',
    '互感 M 不能大於 {0}，因為被動電路儲存的能量不能 {1}。',
    'M cannot exceed ___, because the energy stored in a passive circuit cannot be ___.',
    [S(['√(L1 L2)（幾何平均）the geometric mean √(L1L2)', 'L1 + L2', '(L1 + L2)/2', 'L1 L2']), S(['是負的 negative', '是正的 positive', '是零 zero', '變化 changing'])],
    '把 ½L₁i₁² + ½L₂i₂² − M i₁i₂ ≥ 0 配方，得 M ≤ √(L₁L₂)。');
  C('13.3', 3, L3, '耦合係數',
    '耦合係數 k = {0}，範圍是 {1}。',
    'The coupling coefficient k = ___, with ___.',
    [S(['M / √(L1 L2)', 'M / (L1 + L2)', 'L1 / L2', 'M · L1 · L2']), S(['0 ≤ k ≤ 1', '−1 ≤ k ≤ 1', 'k ≥ 1', '0 ≤ k ≤ ∞'])],
    'k 表示 M 離上限 √(L₁L₂) 有多近。');
  C('13.3', 4, L3, 'k 的物理意義',
    'k 是一個線圈發出的磁通中，有多少比例 {0}。',
    'k is the fraction of the total flux emanating from one coil that ___.',
    [S(['穿過另一個線圈 links the other coil', '變成熱 turns into heat', '回到電源 returns to the source', '被鐵心吸收 is absorbed by the core'])],
    'k = φ₂₁/φ₁：全部磁通都穿過對方時 k = 1（完美耦合）。');
  C('13.3', 5, L3, '鬆耦合、緊耦合',
    'k {0} 0.5 稱為鬆耦合；k {1} 0.5 稱為緊耦合。',
    'Coils are loosely coupled when k ___ 0.5 and tightly coupled when k ___ 0.5.',
    [S(['小於 less than', '大於 greater than', '等於 equal to', '無關 unrelated to']), S(['大於 greater than', '小於 less than', '等於 equal to', '無關 unrelated to'])],
    '課本：k &lt; 0.5 loosely coupled、k &gt; 0.5 tightly coupled。');
  C('13.3', 6, L3, '哪一種是緊耦合',
    '收音機用的空心變壓器通常是 {0}；電力系統用的鐵心變壓器通常是 {1}。',
    'Air-core transformers in radio circuits are usually ___ coupled, while iron-core transformers in power systems are ___ coupled.',
    [S(['鬆耦合 loosely', '緊耦合 tightly', '完全不耦合 not', '負耦合 negatively']), S(['緊耦合 tightly', '鬆耦合 loosely', '不耦合 not', '負耦合 negatively'])],
    '鐵心把磁通集中起來，幾乎全部穿過兩個線圈。');
  C('13.3', 7, L3, '算能量要什麼',
    '要算某一時刻耦合線圈的能量，必須用該時刻的 {0}。',
    'To compute the stored energy at a given instant, you must use the ___ at that instant.',
    [S(['瞬時電流 instantaneous currents', '相量 phasors', '有效值 rms values', '平均值 average values'])],
    'Example 13.3：先在頻域解出相量，再換回時域 i(t)，代入 t = 1 s。', true);
  C('13.3', 8, L3, '能量題的步驟',
    '耦合電路能量題的順序是：先 {0}，再換回時域代入時間，最後用打點規則決定 M i1 i2 的正負。',
    'For energy problems: first ___, then convert back to the time domain at the given t, then use the dot convention for the sign of M i1 i2.',
    [S(['在頻域解出 I1、I2 solve for the phasors I1 and I2', '直接代 t solve with t directly', '算 k 就好 only find k', '取有效值 take rms values'])],
    '照 Example 13.3 的流程。', true);

  /* ═════════ 13.4 線性變壓器 ═════════ */
  const L4 = P2 + '#lin';
  C('13.4', 1, L4, '一次側、二次側',
    '直接接電源的線圈叫 {0}，接負載的線圈叫 {1}。',
    'The coil directly connected to the voltage source is the ___ winding; the coil connected to the load is the ___ winding.',
    [S(['一次側 primary', '二次側 secondary', '中性 neutral', '自耦 auto']), S(['二次側 secondary', '一次側 primary', '回授 feedback', '鐵心 core'])],
    '課本圖 13.19：左邊 primary、右邊 secondary。');
  C('13.4', 2, L4, '什麼叫線性',
    '線圈繞在 {0} 固定的材料（空氣、塑膠、木頭）上，稱為線性變壓器，又常叫 {1}。',
    'A transformer is linear if the coils are wound on a material whose ___ is constant; such transformers are often called ___ transformers.',
    [S(['磁導率 magnetic permeability', '電阻率 resistivity', '介電常數 permittivity', '溫度 temperature']), S(['空心 air-core', '鐵心 iron-core', '理想 ideal', '自耦 auto'])],
    '磁通跟電流成正比 → 線性。收音機、電視裡常用。');
  C('13.4', 3, L4, '反射阻抗',
    '線性變壓器從一次側看進去：Z<sub>in</sub> = R1 + jωL1 + {0}，第二項叫反射阻抗。',
    'For a linear transformer, Z<sub>in</sub> = R1 + jωL1 + ___; the second term is the reflected impedance.',
    [S(['ω²M² / (R2 + jωL2 + ZL)', 'ωM / (R2 + jωL2 + ZL)', 'ZL / n²', 'jωM'])],
    '式 13.41：二次側的總阻抗 Z₂₂ 越小，反射回來的越大。', true);
  C('13.4', 4, L4, '點的位置',
    '線性變壓器的輸入阻抗 {0} 點的位置影響，因為公式裡是 {1}。',
    'The input impedance of a linear transformer is ___ by the location of the dots, because it contains ___.',
    [S(['不受 not affected', '會受 affected', '只受一次側 only affected on the primary', '完全由 entirely determined']), S(['M²', 'M', '−M', '2M'])],
    'M 換成 −M 結果一樣（課本式 13.42 下方的說明）。');
  C('13.4', 5, L4, 'T 型等效',
    '兩個電流都流進點時，T 型等效的三支電感是：L<sub>a</sub> = {0}、L<sub>b</sub> = L2 − M、L<sub>c</sub> = M。',
    'For the T-equivalent (both currents entering the dots): L<sub>a</sub> = ___, L<sub>b</sub> = L2 − M, L<sub>c</sub> = M.',
    [S(['L1 − M', 'L1 + M', 'M', 'L1 L2 − M²'])],
    '式 13.46。換掉互感之後，就只剩一般的電感。', true);
  C('13.4', 6, L4, 'Π 型等效',
    'Π 型等效的三支電感分子都是 {0}。',
    'In the Π-equivalent, all three inductances have the same numerator ___.',
    [S(['L1 L2 − M²', 'L1 + L2', 'M²', 'L1 − M'])],
    '式 13.48：L<sub>A</sub> = (L₁L₂ − M²)/(L₂ − M)、L<sub>B</sub> = …/(L₁ − M)、L<sub>C</sub> = …/M。', true);
  C('13.4', 7, L4, '點反過來時',
    '套 T 型或 Π 型等效時，如果點或電流方向跟標準圖不同，要把 M 換成 {0}；這時等效電路裡可能出現 {1} 的電感。',
    'If the dots or current directions differ from the standard figure, replace M by ___; the equivalent may then contain a ___ inductance.',
    [S(['−M', '2M', 'M²', '0']), S(['負值 negative', '無限大 infinite', '零 zero', '虛數 imaginary'])],
    'Example 13.6：L<sub>c</sub> = −1 H，物理上做不出來，但數學上仍成立。');
  C('13.4', 8, L4, '為什麼要等效',
    '把耦合線圈換成 T 或 Π 等效的好處是：等效電路 {0}，可以直接用一般的網目、節點分析。',
    'Replacing coupled coils with a T or Π equivalent is convenient because the equivalent has ___.',
    [S(['沒有互感 no mutual inductance', '沒有電感 no inductors', '只有電阻 only resistors', '比較少節點 fewer nodes'])],
    '不用再管點和互感的正負號。', true);

  /* ═════════ 13.5 理想變壓器 ═════════ */
  const L5 = P2 + '#ideal';
  C('13.5', 1, L5, '理想變壓器的條件',
    '理想變壓器：線圈電抗 {0}、耦合係數 k = {1}、線圈沒有損失。',
    'An ideal transformer has coils with very ___ reactances, a coupling coefficient k = ___, and lossless coils.',
    [S(['非常大 large (L → ∞)', '非常小 small', '等於零 zero', '負的 negative']), S(['1', '0', '0.5', '∞'])],
    '課本三個條件：L₁、L₂、M → ∞；k = 1；R₁ = R₂ = 0。');
  C('13.5', 2, L5, '電壓比',
    '理想變壓器 V2/V1 = N2/N1 = n，n 叫 {0}。',
    'For an ideal transformer, V2/V1 = N2/N1 = n, where n is the ___.',
    [S(['匝數比 turns ratio', '耦合係數 coupling coefficient', '功率因數 power factor', '效率 efficiency'])],
    '同一個磁通穿過兩個線圈，每一匝的電壓一樣，所以電壓比 = 匝數比。');
  C('13.5', 3, L5, '電流比',
    '理想變壓器的電流比 I2/I1 = {0}，跟電壓比剛好相反。',
    'For an ideal transformer, I2/I1 = ___, the inverse of the voltage ratio.',
    [S(['1/n', 'n', 'n²', '1'])],
    '不吃功率：V₁I₁* = V₂I₂*。電壓升幾倍，電流就降幾倍。');
  C('13.5', 4, L5, '升壓、降壓、隔離',
    'n > 1 是 {0} 變壓器；n < 1 是降壓變壓器；n = 1 通常叫 {1} 變壓器。',
    'n > 1 gives a ___ transformer, n < 1 a step-down transformer, and n = 1 is generally called an ___ transformer.',
    [S(['升壓 step-up', '降壓 step-down', '自耦 auto', '三相 three-phase']), S(['隔離 isolation', '匹配 matching', '自耦 auto', '線性 linear'])],
    '額定寫成 V₁/V₂，例如 2400/120 V 就是降壓。');
  C('13.5', 5, L5, '電壓的正負號',
    'V1、V2 的 + 都在點那端（或都不在點），用 {0}；否則用 −n。',
    'If V1 and V2 are both positive (or both negative) at the dotted terminals, use ___; otherwise use −n.',
    [S(['+n', '−n', '1/n', 'n²'])],
    '課本兩條規則的第一條。', true);
  C('13.5', 6, L5, '電流的正負號',
    'I1、I2 都流進點（或都流出點）時，電流關係式用 {0}。',
    'If I1 and I2 both enter (or both leave) the dotted terminals, use ___ in the current relation.',
    [S(['−n', '+n', 'n²', '1'])],
    '跟電壓那條「剛好相反」，最容易背錯。Example 13.8：兩個都流出點 → I₂ = −I₁/n。', true);
  C('13.5', 7, L5, '反射阻抗（理想）',
    '理想變壓器從一次側看到的輸入阻抗 Z<sub>in</sub> = {0}。',
    'The input impedance of an ideal transformer seen from the primary is Z<sub>in</sub> = ___.',
    [S(['ZL / n²', 'n² ZL', 'ZL / n', 'n ZL'])],
    '式 13.60：負載被「反射」到一次側，除以 n²。阻抗匹配就靠這個。', true);
  C('13.5', 8, L5, '什麼時候不能反射',
    '用反射消去變壓器，只適用於一、二次側之間 {0} 的電路；否則要用網目或節點分析。',
    'Eliminating the transformer by reflection only works when there are ___ between the primary and secondary windings.',
    [S(['沒有外部連線 no external connections', '有共用電阻 shared resistors', '有中性線 a neutral wire', '有電容 capacitors'])],
    'Example 13.9：30 Ω 把兩邊連在一起，只能網目分析＋變壓器兩條關係式。', true);

  /* ═════════ 13.6 理想自耦變壓器 ═════════ */
  const L6 = P3 + '#auto';
  C('13.6', 1, L6, '自耦變壓器是什麼',
    '自耦變壓器只有 {0}，中間有一個 {1} 把一次側和二次側分開。',
    'An autotransformer has a single continuous ___ with a connection point called a ___.',
    [S(['一個連續的繞組 single winding', '兩個獨立繞組 two separate windings', '三個繞組 three windings', '沒有繞組 no winding']), S(['抽頭 tap', '鐵心 core', '點 dot', '中性點 neutral'])],
    '抽頭常常可以調，就能得到可變的輸出電壓。');
  C('13.6', 2, L6, '優點',
    '跟同樣大小的兩繞組變壓器比，自耦變壓器能傳 {0} 的視在功率，而且 {1}。',
    'Compared with a two-winding transformer, an autotransformer can transfer ___ apparent power and is ___.',
    [S(['更大 larger', '更小 smaller', '一樣 the same', '零 zero']), S(['更小、更輕 smaller and lighter', '更大、更重 larger and heavier', '比較貴 more expensive', '比較吵 noisier'])],
    'Example 13.10：同一組線圈改接成自耦，額定從 48 VA 變 1008 VA。');
  C('13.6', 3, L6, '缺點',
    '自耦變壓器最大的缺點是失去了 {0}。',
    'The major disadvantage of the autotransformer is the loss of ___.',
    [S(['電氣隔離 electrical isolation', '效率 efficiency', '升壓能力 step-up ability', '交流特性 ac behavior'])],
    '一、二次側共用一個繞組，有導線直接相連。');
  C('13.6', 4, L6, '耦合方式',
    '自耦變壓器的一、二次側不只 {0} 耦合，還有 {1} 耦合。',
    'The primary and secondary of an autotransformer are coupled not only ___ but also ___.',
    [S(['磁 magnetically', '電容 capacitively', '光 optically', '機械 mechanically']), S(['導電（直接相連）conductively', '光學 optically', '無線 wirelessly', '熱 thermally'])],
    '課本：not only coupled magnetically but also coupled conductively。');
  C('13.6', 5, L6, '降壓接法',
    '降壓自耦變壓器：輸入跨在整個繞組（N1 + N2），輸出跨在 N2，V1/V2 = {0}。',
    'For a step-down autotransformer, V1/V2 = ___.',
    [S(['(N1 + N2)/N2', 'N1/(N1 + N2)', 'N2/N1', 'N1/N2'])],
    '式 13.63。', true);
  C('13.6', 6, L6, '升壓接法',
    '升壓自耦變壓器：輸入跨在 N1，輸出跨在整個繞組，V1/V2 = {0}。',
    'For a step-up autotransformer, V1/V2 = ___.',
    [S(['N1/(N1 + N2)', '(N1 + N2)/N2', 'N2/N1', '1'])],
    '式 13.67：Example 13.11 的 80/200。', true);
  C('13.6', 7, L6, '電流比',
    '理想自耦變壓器兩邊複功率相等，所以電流比 I1/I2 = {0}。',
    'Since the complex power is the same on both sides, I1/I2 = ___.',
    [S(['V2/V1', 'V1/V2', '1', '(V1/V2)²'])],
    'S₁ = V₁I₁* = V₂I₂* = S₂。', true);
  C('13.6', 8, L6, '抽頭的電流',
    '自耦變壓器抽頭那段共用繞組上的電流 I<sub>o</sub> 用 {0} 求。',
    'The current I<sub>o</sub> in the common part of the winding is found from ___ at the tap.',
    [S(['抽頭的 KCL（I1 + Io = I2）KCL at the tap', '歐姆定律 Ohm’s law', '打點規則 the dot convention', '能量守恆 energy only'])],
    'Example 13.11：I<sub>o</sub> = I₂ − I₁ = 45∠173.13° A。', true);

  /* ═════════ 13.7 三相變壓器 ═════════ */
  const L7 = P3 + '#three';
  C('13.7', 1, L7, '兩種做法',
    '三相變壓器可以用 {0} 組成「變壓器組」，或用一個專門的三相變壓器；同樣 kVA 時後者 {1}。',
    'Three-phase transformation can use three ___ forming a bank, or a special three-phase transformer, which for the same kVA is ___.',
    [S(['三個單相變壓器 single-phase transformers', '三個電容 capacitors', '一個自耦變壓器 one autotransformer', '六個電阻 resistors']), S(['更小、更便宜 smaller and cheaper', '更大 larger', '更貴 more expensive', '更危險 more dangerous'])],
    '用三個單相變壓器時，三個的匝數比 n 必須一樣才平衡。');
  C('13.7', 2, L7, '四種接法',
    '三相變壓器的四種標準接法是：Y-Y、{0}、Y-Δ、Δ-Y。',
    'The four standard connections are Y-Y, ___, Y-Δ, and Δ-Y.',
    [S(['Δ-Δ', 'Y-N', 'T-Π', 'Δ-N'])],
    '一次、二次各自可以 Y 或 Δ。');
  C('13.7', 3, L7, '總功率',
    '不管哪一種接法，總視在功率都是 S<sub>T</sub> = {0}。',
    'For any connection, the total apparent power is S<sub>T</sub> = ___.',
    [S(['√3 VL IL', '3 VL IL', 'VL IL', 'VL IL / √3'])],
    '式 13.69a，跟 CH12 一樣，一次側、二次側都成立。', true);
  C('13.7', 4, L7, 'Y-Y、Δ-Δ',
    'Y-Y 或 Δ-Δ 接法：二次側線電壓 V<sub>Ls</sub> = {0}。',
    'For Y-Y or Δ-Δ connections, V<sub>Ls</sub> = ___.',
    [S(['n VLp', '√3 n VLp', 'n VLp / √3', 'VLp / n'])],
    '兩邊接法一樣，線電壓比就是每相的匝數比。', true);
  C('13.7', 5, L7, 'Y-Δ',
    'Y-Δ 接法：V<sub>Ls</sub> = {0}。',
    'For the Y-Δ connection, V<sub>Ls</sub> = ___.',
    [S(['n VLp / √3', 'n VLp', '√3 n VLp', 'VLp / (n√3)'])],
    'Y 側每相只有 V<sub>Lp</sub>/√3，Δ 側線電壓 = 相電壓 → 多一個 1/√3。', true);
  C('13.7', 6, L7, 'Δ-Y',
    'Δ-Y 接法：V<sub>Ls</sub> = {0}。',
    'For the Δ-Y connection, V<sub>Ls</sub> = ___.',
    [S(['√3 n VLp', 'n VLp', 'n VLp / √3', 'VLp'])],
    'Δ 側每相 = V<sub>Lp</sub>，Y 側線電壓 = √3 × 相電壓。', true);
  C('13.7', 7, L7, '開三角',
    'Δ-Δ 接法的特點：拆掉一個變壓器維修時，剩下兩個形成 {0}，還能供應較低容量的三相電。',
    'A unique feature of Δ-Δ: if one transformer is removed, the other two form an ___ that still supplies three-phase voltages at a reduced level.',
    [S(['開三角 open delta', '星形 wye', '自耦 autotransformer', '短路 short circuit'])],
    '課本 13.7 的說明。');
  C('13.7', 8, L7, '每個變壓器的額定',
    '平衡負載、理想變壓器時，三相變壓器組裡每一個變壓器的 kVA 額定 = {0}。',
    'For a balanced load with ideal transformers, each transformer in the bank is rated at ___.',
    [S(['總視在功率的 1/3 one third of ST', '總視在功率 ST', '√3 倍總功率 √3 ST', '總功率 ÷ √3 ST/√3'])],
    'Example 13.12：42/3 = 14 kVA。', true);

  /* ═════════ 13.9 應用 ═════════ */
  const L9 = P3 + '#app';
  C('13.9', 1, L9, '三大應用',
    '課本介紹變壓器的三個重要應用：隔離元件、{0}、電力配電系統。',
    'The three important applications discussed are isolation device, ___, and power distribution system.',
    [S(['匹配元件 matching device', '整流元件 rectifying device', '儲能元件 storage device', '振盪器 oscillator'])],
    '13.9.1、13.9.2、13.9.3。');
  C('13.9', 2, L9, '電氣隔離',
    '兩個裝置之間沒有 {0} 就叫電氣隔離；變壓器靠 {1} 傳能量，所以能隔離。',
    'Electrical isolation exists when there is no ___ between two devices; a transformer transfers energy by ___.',
    [S(['實體導線連接 physical connection', '磁場 magnetic field', '電壓 voltage', '頻率 frequency']), S(['磁耦合 magnetic coupling', '導線 wires', '電容 capacitors', '光 light'])],
    '整流電路前面加變壓器：降壓＋隔離，減少觸電風險。');
  C('13.9', 3, L9, '擋掉直流',
    '放大器兩級之間用變壓器耦合，是為了不讓前一級的 {0} 影響下一級的偏壓。',
    'A transformer coupling two amplifier stages prevents the ___ of one stage from affecting the bias of the next.',
    [S(['直流電壓 dc voltage', '交流訊號 ac signal', '頻率 frequency', '雜訊 noise'])],
    '只有交流訊號能透過磁耦合傳過去（Example 13.15）。');
  C('13.9', 4, L9, '隔離變壓器的 n',
    '只為了隔離用的變壓器，匝數比 n = {0}。',
    'When the sole purpose of a transformer is isolation, n = ___.',
    [S(['1', '0', '∞', '0.5'])],
    '電壓不變，只是兩邊沒有導線相連。');
  C('13.9', 5, L9, '量高壓',
    '量 13.2 kV 線路電壓時，用變壓器 {0} 再量，再用匝數比換回原來的電壓。',
    'To measure a 13.2-kV line voltage, a transformer is used to ___ before measuring, then the turns ratio gives the line voltage.',
    [S(['降壓到安全值並隔離 step down to a safe level and isolate', '升壓 step up', '整流 rectify', '濾波 filter'])],
    'Practice 13.15：13200/120 = 110。');
  C('13.9', 6, L9, '阻抗匹配條件',
    '用理想變壓器做最大功率匹配，條件是 R<sub>s</sub> = {0}。',
    'For maximum power transfer through an ideal transformer, R<sub>s</sub> = ___.',
    [S(['RL / n²', 'n² RL', 'RL / n', 'RL'])],
    '式 13.73：讓反射回來的負載等於電源內阻。', true);
  C('13.9', 7, L9, '升壓還是降壓',
    'R<sub>s</sub> > R<sub>L</sub>（例如擴大機接喇叭）時，匹配要用 {0} 變壓器。',
    'When R<sub>s</sub> > R<sub>L</sub>, the matching transformer must be ___.',
    [S(['降壓（n ＜ 1）step-down', '升壓（n ＞ 1）step-up', '隔離（n = 1）isolation', '自耦 auto'])],
    'n² = R<sub>L</sub>/R<sub>s</sub> &lt; 1。Example 13.16：n = 0.25。', true);
  C('13.9', 8, L9, '為什麼高壓輸電',
    '同樣功率用高電壓輸電，電流 {0}，線路的 I²R 損失 {1}。',
    'Transmitting the same power at a higher voltage makes the current ___ and the I²R line loss ___.',
    [S(['變小 smaller', '變大 larger', '不變 unchanged', '變成直流 dc']), S(['變小 smaller', '變大 larger', '不變 unchanged', '變成負的 negative'])],
    '課本：100 kVA 用 1000 V 要 100 A，用 10000 V 只要 10 A。這也是發電用交流的主要原因之一。');

  /* ═════════ 14.2 轉移函數（CH14 考到 14.3） ═════════ */
  const L42 = P4 + '#tf';
  C('14.2', 1, L42, '頻率響應',
    '電路的頻率響應是：輸入的 {0} 固定、改變 {1}，看電路的反應怎麼變。',
    'The frequency response of a circuit is obtained by keeping the ___ of a sinusoidal source constant and varying its ___.',
    [S(['振幅 amplitude', '頻率 frequency', '相位 phase', '電阻 resistance']), S(['頻率 frequency', '振幅 amplitude', '電阻 resistance', '時間常數 time constant'])],
    '課本 14.1：the variation in its behavior with change in signal frequency。');
  C('14.2', 2, L42, '轉移函數的定義',
    '轉移函數 H(ω) 是 {0} 相量對 {1} 相量的比，跟頻率有關。',
    'The transfer function H(ω) is the frequency-dependent ratio of a phasor ___ to a phasor ___.',
    [S(['輸出 output', '輸入 input', '電源內阻 source resistance', '功率 power']), S(['輸入 input', '輸出 output', '負載 load', '雜訊 noise'])],
    'H(ω) = Y(ω)/X(ω)，假設初始條件為零。');
  C('14.2', 3, L42, '四種轉移函數',
    'V<sub>o</sub>/V<sub>i</sub> 叫電壓增益，I<sub>o</sub>/I<sub>i</sub> 叫電流增益，V<sub>o</sub>/I<sub>i</sub> 叫 {0}，I<sub>o</sub>/V<sub>i</sub> 叫 {1}。',
    'V<sub>o</sub>/I<sub>i</sub> is called the transfer ___ and I<sub>o</sub>/V<sub>i</sub> the transfer ___.',
    [S(['轉移阻抗 impedance', '轉移導納 admittance', '電壓增益 voltage gain', '電流增益 current gain']), S(['轉移導納 admittance', '轉移阻抗 impedance', '電壓增益 voltage gain', '功率增益 power gain'])],
    '式 14.2a～d。電壓除電流是阻抗、電流除電壓是導納。');
  C('14.2', 4, L42, '怎麼求 H(ω)',
    '求轉移函數的第一步是把 R、L、C 換成 {0}，再用分壓、分流、網目等方法。',
    'To find H(ω), first replace R, L, C by their ___, then use any circuit technique.',
    [S(['阻抗 R、jωL、1/jωC impedances R, jωL, 1/jωC', '時域方程 time-domain equations', '電導 conductances only', '拉氏轉換表 Laplace tables'])],
    '跟 CH9、CH10 的相量分析一樣。', true);
  C('14.2', 5, L42, '零點',
    '讓分子 N(ω) = 0 的值叫 {0}，這時 H 等於 {1}。',
    'The roots of the numerator N(ω) = 0 are the ___ of H, where H becomes ___.',
    [S(['零點 zeros', '極點 poles', '轉折點 corners', '共振點 resonances']), S(['0', '無限大 infinite', '1', '−1'])],
    'Example 14.2：s(s + 2) = 0 → 零點 0、−2。');
  C('14.2', 6, L42, '極點',
    '讓分母 D(ω) = 0 的值叫 {0}，這時 H 變成 {1}。',
    'The roots of the denominator D(ω) = 0 are the ___ of H, where H becomes ___.',
    [S(['極點 poles', '零點 zeros', '頻寬 bandwidths', '增益 gains']), S(['無限大 infinite', '0', '1', '0.707'])],
    'Example 14.2：(s + 1)² = 0 → 二重極點 −1。');
  C('14.2', 7, L42, '為什麼換成 s',
    '算 H(ω) 時暫時把 jω 換成 {0}，是為了 {1}，最後再換回 jω。',
    'It is expedient to replace jω temporarily with ___ to avoid ___, and replace it back at the end.',
    [S(['s', 'ω', 'j', 'f']), S(['複雜的複數代數 complex algebra', '單位換算 unit conversion', '負數 negative numbers', '畫圖 plotting'])],
    '課本 14.2 的建議：寫成 s 的多項式比較好因式分解。', true);
  C('14.2', 8, L42, 'RC 低通在 ω<sub>0</sub>',
    'Example 14.1 的 RC 電路 H = 1/(1 + jωRC)，在 ω = ω<sub>0</sub> = 1/RC 時 |H| = {0}、相位 = {1}。',
    'For H = 1/(1 + jωRC), at ω = ω<sub>0</sub> = 1/RC, |H| = ___ and the phase is ___.',
    [S(['1/√2 ≈ 0.707', '1', '0.5', '0']), S(['−45°', '−90°', '0°', '45°'])],
    '1 + j1 的大小是 √2、角度 45°，倒數就是 0.707∠−45°。', true);

  /* ═════════ 14.3 分貝刻度 ═════════ */
  const L43 = P4 + '#db';
  C('14.3', 1, L43, '貝爾',
    '貝爾（bel）原本是用來量兩個 {0} 的比：G = log10(P2/P1)。',
    'The bel is used to measure the ratio of two levels of ___: G = log10(P2/P1).',
    [S(['功率 power', '電壓 voltage', '頻率 frequency', '電阻 resistance'])],
    '以電話發明人貝爾（Alexander Graham Bell）命名。');
  C('14.3', 2, L43, '分貝',
    '分貝是貝爾的 {0}：功率增益 G<sub>dB</sub> = {1} log10(P2/P1)。',
    'The decibel is ___ of a bel: G<sub>dB</sub> = ___ log10(P2/P1).',
    [S(['十分之一 one tenth', '十倍 ten times', '一百倍 a hundred times', '一半 half']), S(['10', '20', '1', '100'])],
    '式 14.5。');
  C('14.3', 3, L43, '功率兩倍',
    '功率變成兩倍大約是 {0}；變成一半大約是 {1}。',
    'Doubling the power is about ___, and halving it is about ___.',
    [S(['3 dB', '6 dB', '2 dB', '20 dB']), S(['−3 dB', '−6 dB', '0.5 dB', '−20 dB'])],
    '10 log 2 ≈ 3、10 log 0.5 ≈ −3：倒數的對數就是負號。');
  C('14.3', 4, L43, '電壓用 20',
    '電壓或電流的比換成分貝要乘 {0}，因為功率跟電壓的 {1} 成正比。',
    'For voltage or current ratios the factor is ___, because power is proportional to the ___ of voltage.',
    [S(['20', '10', '2', '100']), S(['平方 square', '平方根 square root', '倒數 reciprocal', '對數 logarithm'])],
    'P = V²/R：10 log (V₂²/V₁²) = 20 log (V₂/V₁)（R₁ = R₂ 時）。', true);
  C('14.3', 5, L43, '0 dB',
    '增益 0 dB 代表 {0}。',
    'A gain of 0 dB means ___.',
    [S(['輸出 = 輸入（比值 1）output equals input', '輸出為零 zero output', '輸出無限大 infinite output', '相位 0° zero phase'])],
    'log 1 = 0。');
  C('14.3', 6, L43, '20 dB 是幾倍',
    '電壓增益 20 dB 是 {0} 倍；40 dB 是 {1} 倍。',
    'A voltage gain of 20 dB is ___ times; 40 dB is ___ times.',
    [S(['10', '20', '100', '2']), S(['100', '40', '1000', '20'])],
    '每 20 dB 乘 10。Problem 14.7(c)：104.7 dB ≈ 1.718 × 10⁵。', true);
  C('14.3', 7, L43, '對數的好處',
    '用對數（dB）的好處之一：串接系統的總增益，在 dB 上是各級增益 {0}。',
    'One advantage of logarithms: the total gain of cascaded stages in dB is the ___ of the individual gains.',
    [S(['相加 sum', '相乘 product', '平均 average', '最大值 maximum'])],
    'log P₁P₂ = log P₁ + log P₂。這也是波德圖（14.4）好用的原因。');
  C('14.3', 8, L43, '分貝適用的對象',
    '分貝是「同一種量」的比，所以適合表示 {0}，不適合直接用在轉移阻抗、轉移導納。',
    'The decibel expresses a ratio of like quantities, so it applies to ___, not to transfer impedance or admittance.',
    [S(['電壓增益、電流增益 voltage and current gains', '轉移阻抗 transfer impedance', '轉移導納 transfer admittance', '電阻值 resistances'])],
    '課本 14.3 的提醒：式 14.2a、b 可以，14.2c、d 不行。');

  window.__CH13C = window.__CH13C || { name: 'ch13c', items: [] };
  window.__CH13C.items = window.__CH13C.items.concat(items);
})();
