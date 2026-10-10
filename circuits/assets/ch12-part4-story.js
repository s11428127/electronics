/* ============================================================
   電路學 CH12 PART 4 —— 故事模式（12.9 PSpice、12.10 功率量測、家用配電）
   謎題（課本 Practice 12.14）：兩瓦特計讀數 P1 = −560 W、P2 = 800 W —— 瓦特計接反了嗎？
   答案：沒接錯。P1 = VL IL cos(θ + 30°)，θ = 84° > 60° 時就是負的；總功率照樣 −560 + 800 = 240 W。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12) return;
  const K = window.__K12, D = K.D;
  const { g, T, calc, ph, sc } = K;
  const { chip, arrow } = D;
  const RAD = Math.PI / 180;
  const f1 = x => Math.round(x * 10) / 10;
  const meter = (x, y, lbl, val, key, neg) => g(key, '<rect class="bgw" x="' + (x - 48) + '" y="' + (y - 30) + '" width="96" height="60" rx="10"/>' +
    T(x, y - 8, lbl, { cls: 'tm', fs: 12 }) + T(x, y + 18, val, { cls: neg ? 'ta' : 't', fs: 18 }));
  const triD = (cx, cy, r, key) => g(key, '<path class="ln" style="fill:none;stroke-width:2.2" d="M' + cx + ' ' + (cy - r) + ' L' + f1(cx + r * 0.866) + ' ' + (cy + r / 2) + ' L' + f1(cx - r * 0.866) + ' ' + (cy + r / 2) + ' Z"/>' +
    [[cx + r * 0.433, cy - r / 4], [cx, cy + r / 2], [cx - r * 0.433, cy - r / 4]].map(p => K.src(f1(p[0]), f1(p[1]), 12)).join(''));
  const lines3 = (x0, x1, ys, key) => g(key, ys.map((y, i) => '<line class="ln" x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '"/>' + T(x0 - 8, y + 4, 'abc'[i], { cls: 'ts', fs: 12, a: 'end' })).join(''));

  /* 00 謎題 */
  const S0 = sc('瓦特計反打了？', 'THE PUZZLE',
    meter(210, 180, 'W₁', '−560 W', 'm1', true) + meter(430, 180, 'W₂', '800 W', 'm2') +
    chip(320, 270, '線電壓 208 V、平衡負載', '', 'c', { fs: 13.5 }) + T(320, 120, '指針往反方向打 → 接錯了嗎？', { cls: 'ta', fs: 15, k: 'q' }),
    [{ sub: '用兩個瓦特計量一個平衡三相負載（課本 Practice 12.14）。', on: 'c' },
     { sub: 'W₂ 讀 800 W，正常。', on: 'm2' },
     { sub: 'W₁ 卻讀 <b>−560 W</b>：指針往反方向打。', on: 'm1' },
     { sub: '是接反了嗎？總功率又該怎麼算？', on: 'q' }]);

  /* 01 複習：瓦特計 */
  const S1 = sc('先複習：瓦特計', 'RECAP: WATTMETER',
    g('ckt', '<path class="ln" style="fill:none" d="M90 189 V150 H230 M310 150 H520 M520 260 H90 V221"/>' + K.src(90, 205, 16) + '<rect class="bgw" x="230" y="135" width="80" height="30" rx="5"/>' + T(270, 155, 'W', { fs: 15 }) + K.zbox(520, 150, 520, 260, '負載', { fs: 13 })) +
    g('vc', '<path class="ln dsh" style="fill:none" d="M270 165 V260"/>' + T(278, 225, '電壓線圈（並聯）', { cls: 'tm', fs: 12, a: 'start' })) +
    T(270, 125, '電流線圈（串聯）', { cls: 'tm', fs: 12, k: 'cc1' }) +
    calc(390, 190, 112, [['P = Re(V I*)', 'r1', 'ta', 13], ['= VI cos θ', 'r2', 't', 13]], { k: 'cc', lh: 22 }),
    [{ sub: 'CH11 學過：瓦特計有兩組線圈。電流線圈<b>串</b>在線上量電流。', on: 'ckt cc1' },
     { sub: '電壓線圈<b>並</b>在兩點之間量電壓。', on: 'vc' },
     { sub: '讀數 = 電壓 × 電流 × 兩者夾角的 cos。夾角超過 90°，cos 就是負的。', on: 'cc r1 r2' }]);

  /* 02 PSpice */
  const S2 = sc('先說 PSpice', 'PSPICE',
    chip(170, 140, 'VAC', 'ACMAG 大小、ACPHASE 相角', 'c1', { fs: 15 }) +
    chip(460, 140, 'IPRINT', '串在線上量電流', 'c2', { fs: 15 }) +
    chip(170, 225, 'VPRINT2', '跨兩點量電壓', 'c3', { fs: 15 }) +
    chip(460, 225, 'AC Sweep', '只算一個頻率：Pts = 1', 'c4', { fs: 15 }),
    [{ sub: '12.9 先講用電腦解三相：電源用 VAC，填大小和相角（0、−120、120）。', on: 'c1' },
     { sub: '量電流用 IPRINT（像電流表，串進去）；量電壓用 VPRINT2。', on: 'c2 c3' },
     { sub: 'AC Sweep 只算一個頻率點。跟解單相交流一模一樣。', on: 'c4' }]);

  /* 03 麻煩一 */
  const S3 = sc('Δ 電源的麻煩一：一圈電壓源', 'A LOOP OF SOURCES',
    triD(190, 215, 85, 'tri') + g('loop', '<circle class="lna dsh" style="fill:none" cx="190" cy="228" r="32"/>') +
    chip(460, 150, '還記得旋轉門嗎？', 'PART 2：三顆電源繞一圈 → 環流', 'c1', { fs: 13.5 }) +
    chip(460, 240, '解法：每顆串 1 μΩ', '小到不影響答案，但方程式有解了', 'c2', { fs: 13.5, acc: true }),
    [{ sub: 'Δ 電源三顆接成一圈，圈裡只有電壓源、沒有電阻。', on: 'tri' },
     { sub: '電腦解方程式會卡住（電流可以是任何值、或無限大）—— 就是 PART 2 的環流問題。', on: 'loop c1' },
     { sub: '解法：每顆串一個 <b>1 μΩ</b> 的小電阻。', on: 'c2' }]);

  /* 04 麻煩二 */
  const S4 = sc('麻煩二：沒有地', 'NO GROUND',
    triD(190, 215, 85, 'tri') + g('y', '<path class="ln dsh" style="fill:none" d="M190 130 L190 215 M' + f1(190 + 73.6) + ' 257.5 L190 215 M' + f1(190 - 73.6) + ' 257.5 L190 215"/><circle class="acc" cx="190" cy="215" r="5"/>') +
    T(200, 238, '0（地）', { cls: 'ta', fs: 13, a: 'start', k: 'gl' }) +
    chip(460, 200, '加三個 1 MΩ 接成 Y', '中心點當地；電阻超大，幾乎沒電流', 'c1', { fs: 13.5 }),
    [{ sub: 'PSpice 一定要有一個接地（0 節點），Δ 電源卻沒有中性點。', on: 'tri' },
     { sub: '加三個<b>超大</b>電阻（1 MΩ）接成 Y，中心點就是地。', on: 'y gl c1' }]);

  /* 05 ω = 1 */
  const S5 = sc('只給阻抗？設 ω = 1', 'THE ω = 1 TRICK',
    calc(110, 112, 420, [['PSpice 要填 L、C，題目只給 jX', 'r1', 'tm'], ['X<sub>L</sub> = ωL → L = X<sub>L</sub>/ω', 'r2'], ['ω = 1：L 的數字 = X<sub>L</sub>', 'r3', 'ta'], ['j5 Ω → 5 H；−j40 Ω → C = 1/40 F', 'r4']], { k: 'cc', a: 'middle' }),
    [{ sub: '題目常常只寫 j5 Ω，PSpice 卻要你填電感值。', on: 'cc r1' },
     { sub: '挑一個最好算的頻率：<b>ω = 1 rad/s</b>，L 的數字就等於電抗。', on: 'r2 r3' },
     { sub: '電容也一樣：C = 1/X。', on: 'r4' }]);

  /* 06 整理 */
  const S6 = sc('先整理一下', 'SO FAR',
    calc(110, 108, 420, [['PSpice 解三相 = 解單相交流', 'r1'], ['Δ 電源：每顆串 1 μΩ', 'r2', 'ta'], ['再加三個 1 MΩ 接 Y 當地', 'r3', 'ta'], ['只給阻抗：ω = 1', 'r4'], ['算完一定手算驗證', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
    [{ sub: 'PSpice 的重點就這幾條。', on: 'cc r1 r2 r3' },
     { sub: '只給阻抗用 ω = 1；最後用單相等效或網目分析驗算一次。', on: 'r4 r5' },
     { sub: '接下來回到謎題：三相的功率要怎麼「量」？', on: '' }]);

  /* 07 三瓦特計 */
  const ys = [140, 195, 250];
  const S7 = sc('三瓦特計法', 'THREE WATTMETERS',
    lines3(90, 470, ys, 'ln') + g('box', '<rect class="bgw" x="470" y="120" width="90" height="150" rx="10"/>' + T(515, 200, '負載', { fs: 14 })) +
    g('ms', ys.map((y, i) => '<rect class="bgw" x="200" y="' + (y - 13) + '" width="54" height="26" rx="5"/>' + T(227, y + 5, 'W' + (i + 1), { fs: 13 })).join('')) +
    g('vc', ys.map(y => '<path class="ln dsh" style="fill:none" d="M227 ' + (y + 13) + ' V' + (y + 27) + ' H330"/>').join('') + '<path class="ln dsh" d="M330 167 V277"/><circle class="acc" cx="330" cy="290" r="6"/>' + T(342, 294, 'o（參考點）', { cls: 'ta', fs: 13, a: 'start' })) +
    T(320, 112, 'P<sub>T</sub> = P<sub>1</sub> + P<sub>2</sub> + P<sub>3</sub>', { cls: 'ta', fs: 15, k: 'eq' }),
    [{ sub: '最直接的方法：三條線各串一個瓦特計。', on: 'ln box ms' },
     { sub: '三個電壓線圈的另一端都接到同一個<b>參考點 o</b>。', on: 'vc' },
     { sub: '三個讀數相加 = 總功率。平衡、不平衡、Y、Δ 都能用。', on: 'eq' }]);

  /* 08 o 移到 b */
  const S8 = sc('把 o 放在 b 線上', 'MOVE o TO LINE b',
    lines3(90, 470, ys, 'ln') + g('box', '<rect class="bgw" x="470" y="120" width="90" height="150" rx="10"/>' + T(515, 200, '負載', { fs: 14 })) +
    g('m1', '<rect class="bgw" x="200" y="127" width="54" height="26" rx="5"/>' + T(227, 145, 'W1', { fs: 13 }) + '<path class="ln dsh" style="fill:none" d="M227 153 V195"/>') +
    g('m3', '<rect class="bgw" x="200" y="237" width="54" height="26" rx="5"/>' + T(227, 255, 'W2', { fs: 13 }) + '<path class="ln dsh" style="fill:none" d="M227 237 V195"/>') +
    g('m2', '<rect class="bgw" x="300" y="182" width="54" height="26" rx="5"/>' + T(327, 200, '0 W', { cls: 'ta', fs: 13 })) +
    '<circle class="acc" cx="227" cy="195" r="5"/>' +
    chip(320, 300, '中間那個讀 0 → 拿掉 → 兩瓦特計法', '', 'c', { fs: 13.5, acc: true }),
    [{ sub: '參考點 o 可以隨便選。選在 b 線上會怎樣？', on: 'ln box m1 m3' },
     { sub: 'b 線那個瓦特計的電壓線圈兩端都是 b：電壓 = 0，<b>讀數 = 0</b>。', on: 'm2' },
     { sub: '讀 0 的就不用裝了 —— 這就是最常用的<b>兩瓦特計法</b>。', on: 'c' }]);

  /* 09 兩個讀數 */
  const S9 = sc('兩個讀數各是多少', 'P₁ AND P₂',
    ph(190, 215, 80, [{ a: 0, m: 0.8, l: 'V<sub>an</sub>', c: 'ln dsh', k: 'van' }, { a: 30, l: 'V<sub>ab</sub>', c: 'ln', k: 'vab' }, { a: -40, m: 0.75, l: 'I<sub>a</sub>', k: 'ia' }], { k: 'ax', ax: 110 }) +
    calc(350, 120, 265, [['W₁ 看 V<sub>ab</sub> 和 I<sub>a</sub>', 'r1'], ['夾角 = θ + 30°', 'r2', 'ta'], ['P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ + 30°)', 'r3'], ['P<sub>2</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ − 30°)', 'r4']], { k: 'cc' }),
    [{ sub: 'W₁ 的電流是 I<sub>a</sub>，電壓是 V<sub>ab</sub>（a 對 b）。', on: 'ax vab ia cc r1' },
     { sub: 'I<sub>a</sub> 比 V<sub>an</sub> 晚 θ，V<sub>ab</sub> 又比 V<sub>an</sub> 早 30° → 夾角 <b>θ + 30°</b>。', on: 'van r2' },
     { sub: 'W₂（I<sub>c</sub> 和 V<sub>cb</sub>）算出來是 θ − 30°。', on: 'r3 r4' }]);

  /* 10 相加相減 */
  const S10 = sc('相加、相減', 'SUM AND DIFFERENCE',
    calc(90, 112, 460, [['P<sub>1</sub> + P<sub>2</sub> = √3 V<sub>L</sub>I<sub>L</sub>cos θ = P<sub>T</sub>', 'r1', 'ta'], ['P<sub>2</sub> − P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub>sin θ', 'r2'], ['Q<sub>T</sub> = √3 (P<sub>2</sub> − P<sub>1</sub>)', 'r3', 'ta'], ['P<sub>2</sub> &gt; P<sub>1</sub> 電感性；= 電阻；&lt; 電容性', 'r4']], { k: 'cc', a: 'middle' }),
    [{ sub: '兩個 cos 相加（和角公式）：剛好是 PART 3 的總功率！', on: 'cc r1' },
     { sub: '相減再乘 √3：總虛功率。', on: 'r2 r3' },
     { sub: '所以光看兩個讀數誰大，就知道負載是電感性還是電容性。', on: 'r4' }]);

  /* 11 解謎 */
  const S11 = sc('解謎：負的讀數', 'THE NEGATIVE READING',
    g('curve', (() => { let d = ''; for (let t = 0; t <= 90; t += 2) { const x = 80 + t * 4.4, y = 210 - 80 * Math.cos((t + 30) * RAD); d += (t ? ' L' : 'M') + f1(x) + ' ' + f1(y); } return '<path class="lna" style="fill:none" d="' + d + '"/>'; })()) +
    '<line class="ln2" x1="80" y1="210" x2="480" y2="210"/>' + T(484, 214, 'θ', { cls: 'ts', fs: 13, a: 'start' }) +
    g('mark', '<line class="ln dsh" x1="' + (80 + 60 * 4.4) + '" y1="110" x2="' + (80 + 60 * 4.4) + '" y2="300"/>' + T(80 + 60 * 4.4, 106, 'θ = 60°', { cls: 't', fs: 12 })) +
    T(130, 128, 'P₁ ∝ cos(θ + 30°)', { cls: 'ta', fs: 13, k: 'lb' }) +
    calc(400, 236, 220, [['θ = tan<sup>−1</sup>(2356/240)', 'r1', 't', 13], ['= 84.18° → P₁ &lt; 0', 'r2', 'ta', 13]], { k: 'cc', lh: 22 }),
    [{ sub: 'P₁ 跟著 cos(θ + 30°) 走。', on: 'curve lb' },
     { sub: '<b>θ 超過 60°</b>，θ + 30° 超過 90°，cos 變負 —— 讀數就是負的。', on: 'mark' },
     { sub: '這題 θ = 84°（幾乎純電感）：P₁ 本來就該是負的，<b>沒有接錯</b>。總功率照樣代數相加：−560 + 800 = 240 W。', on: 'cc r1 r2' }]);

  /* 12 家用 */
  const S12 = sc('最後：家裡的電', 'HOME WIRING',
    chip(150, 150, '電線桿 12,000 V', '', 'c1', { fs: 14 }) + g('a1', arrow(235, 150, 300, 150, null, 'lna')) +
    chip(390, 150, '降壓變壓器', 'step-down transformer', 'c2', { fs: 14 }) + g('a2', arrow(390, 178, 390, 210, null, 'lna')) +
    chip(390, 240, '120 / 240 V 三條線', '黑（火）、白（中性）、紅（火）', 'c3', { fs: 14, acc: true }),
    [{ sub: '12.10.2：電線桿上是高壓（例如 12,000 V）。', on: 'c1' },
     { sub: '門口的<b>變壓器</b>把它降下來。', on: 'a1 c2' },
     { sub: '送進家裡的是三條線：黑、白、紅 —— 叫<b>單相三線制</b>。', on: 'a2 c3' }]);

  /* 13 蹺蹺板 */
  const S13 = sc('兩條火線之間為什麼是 240 V', 'WHY 240 V',
    g('see', '<line class="ln" style="stroke-width:6" x1="110" y1="150" x2="330" y2="250"/><path class="acc" d="M205 260 L235 260 L220 200 Z"/>') +
    T(110, 136, '黑 +120', { cls: 't', fs: 13, k: 'b' }) + T(330, 274, '紅 −120', { cls: 't', fs: 13, k: 'r' }) + T(244, 196, '白 0', { cls: 'ta', fs: 13, a: 'start', k: 'w' }) +
    calc(380, 130, 230, [['V<sub>B</sub> = 120∠0°', 'r1'], ['V<sub>R</sub> = 120∠180°', 'r2'], ['V<sub>BR</sub> = 2 × 120 = 240 V', 'r3', 'ta'], ['（不是三相的 √3 倍）', 'r4', 'tm']], { k: 'cc' }),
    [{ sub: '變壓器兩個 120 V 線圈串聯，中間點接地當<b>中性線</b>（白，0 V）。', on: 'see w' },
     { sub: '像蹺蹺板：一端往上 120、另一端就往下 120 —— 黑、紅兩條<b>相位相反</b>。', on: 'b r cc r1 r2' },
     { sub: '兩端差 240 V。燈接 120 V，冷氣、烤箱接 240 V。', on: 'r3 r4' }]);

  /* 14 GFCI */
  const S14 = sc('漏電斷路器 GFCI', 'GFCI',
    lines3(110, 480, [180, 220, 260], 'ln') + g('box', '<rect class="lna dsh" style="fill:none" x="180" y="164" width="60" height="112" rx="8"/>' + T(210, 292, 'GFCI', { cls: 'ta', fs: 13 })) +
    g('leak', '<path class="lna dsh" style="fill:none" d="M380 180 V300"/>' + T(390, 240, '經過人體 → 大地', { cls: 'ta', fs: 12, a: 'start' })) +
    calc(260, 102, 240, [['正常：出去 = 回來', 'r1', 'tm'], ['i<sub>B</sub> + i<sub>W</sub> + i<sub>R</sub> = 0', 'r2']], { k: 'cc', lh: 22 }) +
    T(600, 298, '總和 ≠ 0 → 跳脫！', { cls: 'ta', fs: 14, a: 'end', k: 'trip' }),
    [{ sub: '浴室、戶外的插座有<b>漏電斷路器</b>：一直在比「出去的電流」和「回來的電流」。', on: 'ln box cc r1 r2' },
     { sub: '有人碰到火線，一點電流經過人體流進大地，<b>沒有回來</b>。', on: 'leak' },
     { sub: '三條線的電流加起來不再是 0 → 馬上斷電。超過 10 mA 流過人體就很危險。', on: 'trip' }]);

  /* 15 恍然大悟 */
  const S15 = sc('恍然大悟', 'THE AHA',
    calc(90, 106, 460, [['W₁ = −560 W 沒接錯：θ = 84° &gt; 60°', 'r1', 'ta'], ['P<sub>T</sub> = P<sub>1</sub> + P<sub>2</sub> = 240 W', 'r2'], ['Q<sub>T</sub> = √3(P<sub>2</sub> − P<sub>1</sub>) = 2.356 kVAR', 'r3'], ['家裡：兩個反相 120 V → 240 V', 'r4'], ['CH12 完成 → 去總複習刷 80 題', 'r5', 'tm']], { k: 'cc', a: 'middle', lh: 26 }),
    [{ sub: '謎題解開：負載角超過 60°，W₁ 本來就會讀負的。', on: 'cc r1' },
     { sub: '總功率照樣代數相加；相減乘 √3 得到虛功率。', on: 'r2 r3' },
     { sub: '家裡的 240 V 是兩個反相的 120 V。CH12 到這裡全部結束！', on: 'r4 r5' }]);

  __Story('#story', { id: 'cir-ch12-p4', title: 'CH12 PART 4 PSpice、量測與配電', after: '#psp',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15] });
})();
