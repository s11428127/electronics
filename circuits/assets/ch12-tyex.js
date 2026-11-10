/* CH12 題型故事 v3（使用者 11/10）：先用講義 Example（你寫過的）講，每一步換一張圖＋這一步用到的公式。
   原本的章末題故事搬進那一題卡片；12.10（兩瓦特計）不考，從題型故事拿掉；「線路損失、送端電壓」講義沒有 → 保留 Problem 12.45。 */
(function () {
  'use strict';
  const S = window.__SCH, Y = window.__TY, D = window.__TYPES12;
  if (!S || !Y || !D || !D.h) return;
  const { HL, DIM, note, loop, ar, box, phasor, arRaw, tri, txt } = Y;
  const { spe, delta, star, tri3, mini, F } = D.h;
  const W = (...a) => S.w(...a);
  const EX = '__CH12EX';

  Y.attach('__CH12PB', D.types.map(t => t.wk).filter(Boolean));

  const ph = (vec, nt, o) => ({ w: 330, h: 207, p: [phasor(160, 95, vec, Object.assign({ ax: 130, ay: 85 }, o || {}))].concat(nt ? [note(165, 203, nt)] : []) });
  const conv = (l, mid, r) => ({ w: 340, h: 207, p: [l, HL(ar(140, 85, 195, 85, mid, 167, 77)), HL(r)] });

  /* ═══ 題型 1：Example 12.1（相序） ═══ */
  const rot = '<g style="color:var(--s-acc)" stroke-width="2"><path d="M' + (160 + 85 * Math.cos(0.17)) + ' ' + (95 - 85 * Math.sin(0.17)) + ' A85 85 0 0 1 ' + (160 + 85 * Math.cos(-1.92)) + ' ' + (95 - 85 * Math.sin(-1.92)) + '" fill="none" stroke-dasharray="5 4"/></g>';
  const w121 = { bank: EX, id: 'ex12-1', more: 'Practice 12.1（由一相推另兩相）',
    fm: ['v = V<sub>m</sub> cos(ωt + φ) → V = V<sub>m</sub>∠φ', '角度 ± 360° 方向不變', '順時針轉：誰先經過參考線誰就領先', 'a → b → c 是 abc；a → c → b 是 acb'],
    figs: [null,
      ph([[70, 10, 'V_an ∠10°', true], [70, -230, 'V_bn ∠−230°'], [70, -110, 'V_cn ∠−110°']], '三個相量畫出來'),
      ph([[70, 10, 'V_an ∠10°'], [70, 130, 'V_bn ∠130°', true], [70, -110, 'V_cn ∠−110°']], '−230° + 360° = 130°：同一個方向'),
      { w: 330, h: 207, p: [phasor(160, 95, [[70, 10, 'a'], [70, 130, 'b'], [70, -110, 'c']], { ax: 130, ay: 85 }), rot, note(165, 203, '從 a 往順時針（落後）走：先碰到 c 再碰到 b')] },
      { w: 330, h: 207, p: [note(165, 80, 'a → c → b', 'middle', 22), note(165, 120, 'acb（負相序）', 'middle', 17), txt(165, 160, 'abc 的話 b 要在 a 後面 120°', 'middle', 12)] }] };

  /* ═══ 題型 2：Example 12.2（Y-Y） ═══ */
  const w122 = { bank: EX, id: 'ex12-2', more: 'Practice 12.2（發電機有內阻）',
    fm: ['平衡 → 只算 a 相（單相等效）', '串聯：Z<sub>Y</sub> = Z線 + Z負載', 'I = V/Z：大小相除、角度相減', '正相序：I<sub>b</sub> = I<sub>a</sub>∠−120°', 'I<sub>c</sub> = I<sub>a</sub>∠+120°'],
    figs: [null,
      spe('110∠0° V', '5 − j2 Ω', '10 + j8 Ω', { loop: 'I_a', add: [note(135, 186, 'n、N 同電位 → 想成有一條線接起來')] }),
      spe('110∠0° V', '5 − j2 Ω', '10 + j8 Ω', { hl: 'all', add: [note(135, 186, 'Z_Y = 15 + j6 = 16.155∠21.8° Ω')] }),
      spe('110∠0° V', '5 − j2 Ω', '10 + j8 Ω', { add: [ar(160, 44, 210, 44, 'I_a', 185, 22), note(135, 186, 'I_a = 110∠0° ÷ 16.155∠21.8° = 6.81∠−21.8° A')] }),
      ph([[70, -21.8, 'I_a ∠−21.8°'], [70, -141.8, 'I_b ∠−141.8°', true]], 'I_b = I_a 再轉 −120°'),
      ph([[70, -21.8, 'I_a ∠−21.8°'], [70, -141.8, 'I_b ∠−141.8°'], [70, 98.2, 'I_c ∠98.2°', true]], '三個大小都 6.81 A，差 120°')] };

  /* ═══ 題型 3：Example 12.3（Y-Δ） ═══ */
  const d123 = (hi, add) => delta(['8 + j4', '8 + j4', '8 + j4'], hi, add);
  const w123 = { bank: EX, id: 'ex12-3', more: 'Practice 12.3（已知線電壓）',
    fm: ['Z = R + jX → |Z|∠tan⁻¹(X/R)', 'V<sub>L</sub> = √3 V<sub>p</sub>，超前 30°（abc）', 'Δ 每相跨的是線電壓：I<sub>AB</sub> = V<sub>AB</sub>/Z<sub>Δ</sub>', '另兩相轉 ∓120°', 'Δ：I<sub>L</sub> = √3 I<sub>p</sub>，落後 30°', '另兩相轉 ∓120°', 'Δ → Y：Z<sub>Y</sub> = Z<sub>Δ</sub>/3'],
    figs: [null,
      d123([0, 1, 2], [note(150, 203, 'Z_Δ = 8 + j4 = 8.944∠26.57° Ω')]),
      ph([[50, 10, 'V_an = 100∠10°'], [86, 40, 'V_AB = 173.2∠40°', true]], '線電壓 = √3 × 100，角度 10° + 30°'),
      d123([0], [ar(80, 120, 125, 45, 'I_AB', 85, 70), note(40, 85, 'V_AB', 'end'), note(150, 203, 'I_AB = 173.2∠40° ÷ 8.944∠26.57° = 19.36∠13.43° A')]),
      ph([[70, 13.43, 'I_AB ∠13.43°', true], [70, -106.57, 'I_BC ∠−106.57°'], [70, 133.43, 'I_CA ∠133.43°']], '大小都 19.36 A，差 120°'),
      ph([[50, 13.43, 'I_AB'], [50, -46.57, '−I_CA'], [87, -16.57, 'I_a', true]], 'I_a = I_AB − I_CA = 33.53∠−16.57°（√3 倍、轉 −30°）'),
      ph([[70, -16.57, 'I_a ∠−16.57°', true], [70, -136.57, 'I_b ∠−136.57°'], [70, 103.43, 'I_c ∠103.43°']], '線電流 33.53 A'),
      spe('100∠10° V', null, '2.981∠26.57°', { loop: 'I_a', add: [note(135, 186, 'I_a = 100∠10° ÷ 2.981∠26.57° = 33.54∠−16.57° ✓')] })] };

  /* ═══ 題型 4：Example 12.4（Δ-Δ）＋ 12.5（Δ-Y） ═══ */
  const d124 = (hi, add) => delta(['20 − j15', '20 − j15', '20 − j15'], hi, add);
  const w124 = { bank: EX, id: 'ex12-4', more: 'Practice 12.4（由線電流反推）',
    fm: ['Z = 25∠tan⁻¹(−15/20) = 25∠−36.87°', 'Δ-Δ 中間沒有線路：V<sub>AB</sub> = V<sub>ab</sub>', '正相序：轉 −120°、+120°', 'I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°', '另兩相轉 ∓120°'],
    figs: [null,
      d124([0, 1, 2], [note(150, 203, 'Z_Δ = 20 − j15 = 25∠−36.87° Ω')]),
      d124([0], [ar(80, 120, 125, 45, 'I_AB', 85, 70), note(40, 85, '330∠0°', 'end'), note(150, 203, 'I_AB = 330∠0° ÷ 25∠−36.87° = 13.2∠36.87° A')]),
      ph([[70, 36.87, 'I_AB ∠36.87°', true], [70, -83.13, 'I_BC ∠−83.13°'], [70, 156.87, 'I_CA ∠156.87°']], '大小 13.2 A，差 120°'),
      ph([[50, 36.87, 'I_AB = 13.2∠36.87°'], [87, 6.87, 'I_a', true]], 'I_a = 13.2√3 ∠(36.87° − 30°) = 22.86∠6.87° A'),
      ph([[70, 6.87, 'I_a ∠6.87°', true], [70, -113.13, 'I_b ∠−113.13°'], [70, 126.87, 'I_c ∠126.87°']], '線電流 22.86 A')] };
  const w125 = { bank: EX, id: 'ex12-5', more: 'Practice 12.5（Δ-Y 線電流）',
    fm: ['Z = 47.17∠32°', '題目說以 V<sub>ab</sub> 為參考 → 0°', 'Δ → Y：V<sub>an</sub> = V<sub>ab</sub>/√3 ∠−30°', 'I<sub>a</sub> = V<sub>an</sub>/Z<sub>Y</sub>', 'Y 負載：線電流 = 相電流；轉 ∓120°'],
    figs: [null,
      { w: 330, h: 207, p: [HL(star(165, 95, ['40 + j25', '40 + j25', '40 + j25'])), note(165, 195, 'Z_Y = 40 + j25 = 47.17∠32° Ω')] },
      { w: 330, h: 207, p: [HL(tri3(165, 95, '~')), note(165, 195, 'Δ 電源：V_ab = 210∠0° V（參考）')] },
      conv(tri3(80, 85, '~', 'V_ab = 210∠0°'), '÷√3', star(260, 85, ['a', 'b', 'c'], 'V_an = 121.2∠−30°')),
      spe('121.2∠−30° V', null, '47.17∠32° Ω', { loop: 'I_a', add: [note(135, 186, 'I_a = 121.2∠−30° ÷ 47.17∠32° = 2.57∠−62° A')] }),
      ph([[70, -62, 'I_a ∠−62°', true], [70, 178, 'I_b ∠178°'], [70, 58, 'I_c ∠58°']], '−62° − 120° = −182° = 178°')] };

  /* ═══ 題型 5：Example 12.8（兩組負載＋功因校正） ═══ */
  const vsum = (o) => { const sc = 1.25, x0 = 40, y0 = 180, A = [x0 + 30 * sc, y0 - 40 * sc], B = [A[0] + 60 * sc, A[1] - 45 * sc];
    return [W('30,' + y0, '320,' + y0), arRaw(x0, y0, A[0], A[1]), S.t(A[0] + 10, (y0 + A[1]) / 2 + 12, 'S₁ = 30 + j40', 'start', ' font-size="11"'), arRaw(A[0], A[1], B[0], B[1]), S.t(B[0] - 50, (A[1] + B[1]) / 2 - 8, 'S₂ = 60 + j45', 'end', ' font-size="11"'),
      HL(arRaw(x0, y0, B[0], B[1])), note(B[0] + 8, B[1] + 30, 'S = 90 + j85', 'start'), note(B[0] + 8, B[1] + 48, '= 123.8∠43.36°', 'start', 11.5)]; };
  const cmp = () => { const sc = 1.6, x0 = 50, y0 = 180, x1 = x0 + 90 * sc;
    return [tri(x0, y0, 90, 85, sc, ['P = 90 kW', '', '', '']), S.t(x1 + 8, y0 - 85 * sc + 10, '85', 'start', ' font-size="11"'), HL(tri(x0, y0, 90, 43.6, sc, ['', '', '', ''])), S.t(x1 + 8, y0 - 43.6 * sc / 2, '43.6', 'start', ' font-size="11"'),
      HL('<path d="M' + (x1 + 3) + ' ' + (y0 - 85 * sc) + ' L' + (x1 + 3) + ' ' + (y0 - 43.6 * sc) + '" stroke-width="5"/>'), note(x1 + 40, y0 - 64 * sc, 'Q_C = 41.4 kVAR', 'start', 12)]; };
  const dc = (hi, add) => delta(['C', 'C', 'C'], hi, add);
  const w128 = { bank: EX, id: 'ex12-8', more: 'Practice 12.8（拉到 pf = 1）、Example 12.7、Practice 12.7',
    fm: ['|S| = P/pf，Q = |S| sin θ', '已知 Q：|S| = Q/sin θ，P = |S| cos θ', '複功率直接相加：S = S₁ + S₂', '|S| = √3 V<sub>L</sub>I<sub>L</sub>', '落後 → 電流角度 = −θ；再轉 ∓120°', 'Q<sub>C</sub> = P(tan θ<sub>舊</sub> − tan θ<sub>新</sub>)', '三顆電容平分', 'C = Q′<sub>C</sub>/(ωV²)；Δ 接 → V 用線電壓'],
    figs: [null,
      { w: 330, h: 207, p: [HL(tri(60, 180, 30, 40, 3.2, ['P₁ = 30 kW', 'Q₁ = 40 kVAR', '', ''])), note(230, 70, '|S₁| = 30/0.6 = 50 kVA', 'middle', 12), note(230, 92, 'sin θ₁ = 0.8', 'middle', 12)] },
      { w: 330, h: 207, p: [HL(tri(40, 170, 60, 45, 2.3, ['P₂ = 60 kW', 'Q₂ = 45 kVAR', '', ''])), note(240, 70, '|S₂| = 45/0.6 = 75 kVA', 'middle', 12), note(240, 92, 'P₂ = 75 × 0.8 = 60', 'middle', 12)] },
      { w: 330, h: 207, p: vsum() },
      { w: 330, h: 207, p: [W('30,50', '300,50'), W('30,95', '300,95'), W('30,140', '300,140'), S.t(22, 54, 'a', 'end'), S.t(22, 99, 'b', 'end'), S.t(22, 144, 'c', 'end'), ar(60, 38, 120, 38, 'I_L', 90, 30),
        '<path d="M200 50 L200 95" stroke-dasharray="4 3"/>', S.t(206, 76, '240 kV', 'start', ' font-size="11"'), note(165, 180, 'I_L = 123,800 / (√3 × 240,000) = 297.8 mA')] },
      ph([[70, -43.36, 'I_a ∠−43.36°', true], [70, -163.36, 'I_b ∠−163.36°'], [70, 76.64, 'I_c ∠76.64°']], '落後 43.36° → I_a 角度 −43.36°'),
      { w: 330, h: 207, p: cmp().concat([note(60, 30, 'θ 從 43.36° 降到 25.84°', 'start')]) },
      dc([0, 1, 2], [note(150, 203, '41.4 ÷ 3 = 13.8 kVAR（每顆）')]),
      dc([0], [note(40, 85, '240 kV', 'end'), note(150, 203, 'C = 13,800 / (377 × 240,000²) = 635.5 pF')])] };

  /* ═══ 題型 6：Example 12.9（不平衡 Y、中性線電流） ═══ */
  const m129 = k => ({ w: 360, h: 190, p: [hl0(k === 0, mini(20, '100∠0°', '15', k > 0 ? 'I_a = 6.67∠0°' : 'I_a = ?')), hl0(k === 1, mini(135, '100∠120°', '10 + j5', k > 1 ? 'I_b = 8.94∠93.44°' : 'I_b = ?')),
    hl0(k === 2, mini(250, '100∠−120°', '6 − j8', k > 2 ? 'I_c = 10∠−66.87°' : 'I_c = ?')), note(180, 180, ['I_a = 100∠0° ÷ 15 = 6.67∠0° A', 'I_b = 100∠120° ÷ 11.18∠26.56° = 8.94∠93.44° A', 'I_c = 100∠−120° ÷ 10∠−53.13° = 10∠−66.87° A'][k], 'middle', 11.5)] });
  const hl0 = (on, x) => on ? HL(x) : x;
  const ksum = () => { const sc = 13, x0 = 90, y0 = 145, P = (m, a) => [m * Math.cos(a * Math.PI / 180) * sc, -m * Math.sin(a * Math.PI / 180) * sc];
    const a = P(6.67, 0), b = P(8.94, 93.44), c = P(10, -66.87), A = [x0 + a[0], y0 + a[1]], B = [A[0] + b[0], A[1] + b[1]], C = [B[0] + c[0], B[1] + c[1]];
    return [arRaw(x0, y0, A[0], A[1]), S.t((x0 + A[0]) / 2, y0 + 14, 'I_a', 'middle', ' font-size="11"'), arRaw(A[0], A[1], B[0], B[1]), S.t(B[0] - 6, (A[1] + B[1]) / 2, 'I_b', 'end', ' font-size="11"'),
      arRaw(B[0], B[1], C[0], C[1]), S.t((B[0] + C[0]) / 2 + 8, (B[1] + C[1]) / 2, 'I_c', 'start', ' font-size="11"'), HL(arRaw(C[0], C[1], x0, y0)), note((x0 + C[0]) / 2, y0 + 30, 'I_n（把它拉回起點）')]; };
  const w129 = { bank: EX, id: 'ex12-9', more: 'Practice 12.9（不平衡 Δ）、Example 12.10（網目）',
    fm: ['acb：V<sub>BN</sub> 在 +120°、V<sub>CN</sub> 在 −120°', '有中性線 → 每相自己一個迴路：I = V/Z', 'I<sub>b</sub> = V<sub>BN</sub>/Z<sub>B</sub>', 'I<sub>c</sub> = V<sub>CN</sub>/Z<sub>C</sub>', '節點 N 的 KCL：I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>)'],
    figs: [null,
      ph([[70, 0, 'V_AN ∠0°'], [70, 120, 'V_BN ∠120°', true], [70, -120, 'V_CN ∠−120°', true]], 'acb：b、c 的位置跟 abc 對調'),
      m129(0), m129(1), m129(2),
      { w: 330, h: 207, p: ksum().concat([note(165, 203, '不平衡：三個加起來不是 0 → I_n = 10.06∠178.4° A')]) }] };

  /* 12.10 不考：拿掉兩瓦特計那一型 */
  const ix = D.types.findIndex(t => /12\.10/.test(t.sec));
  [[w121], [w122], [w123], [w124, w125], [w128], [w129]].forEach((ws, i) => { D.types[i].wks = ws; });
  if (ix >= 0) D.types.splice(ix, 1);
  D.intro = 'CH12 的題目拆開來是這 ' + D.types.length + ' 種（12.10 兩瓦特計不考，拿掉了）。每種先複習講義 Example。';
})();
