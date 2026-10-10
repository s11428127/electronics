/* ============================================================
   電路學 CH12 PART 2（12.4 Y-Δ、12.5 Δ-Δ、12.6 Δ-Y）
   可互動例題 + 觀念小測驗。互動模組（cv-di、cv-dd、cv-conn）在 ch12.js。
   預設數字 = 課本 Example 12.3、12.4、12.5
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  const { C, labelCJK, liveExample } = E;
  const n2 = (x, d) => X.num(x, d === undefined ? 2 : d);
  const A = d => '∠' + n2(X.wrap(d), 2) + '°';
  const sgn = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°';
  const jx = v => (v < 0 ? '−j' : 'j') + Math.abs(v);
  const r3 = Math.sqrt(3);
  const PH = () => [C.accent, C['q-react'], C.ink];
  const rot = (z, d) => X.mul(z, X.p(1, d));

  /* 相量圖：相電流（細）＋線電流（粗） */
  function drawPL(ctx, w, h, ip, il, lblP, lblL, note) {
    const col = PH(), cx = w * 0.32, cy = h / 2, R = Math.max(10, Math.min(h / 2 - 18, w * 0.26));
    E.axes12(ctx, cx, cy, R + 8);
    const k = R / Math.max(X.mag(il), X.mag(ip), 1e-9);
    [0, -120, 120].forEach((d, i) => {
      E.vec12(ctx, cx, cy, X.mag(ip) * k, X.ang(ip) + d, col[i], i ? null : lblP, 1.6);
      E.vec12(ctx, cx, cy, X.mag(il) * k, X.ang(il) + d, col[i], i ? null : lblL, 3);
    });
    labelCJK(ctx, w * 0.62, h * 0.32, note[0], C.accent, 14, 'left', '700');
    labelCJK(ctx, w * 0.62, h * 0.32 + 24, note[1], C['ink-2'], 11.5, 'left');
    labelCJK(ctx, w * 0.62, h * 0.32 + 46, '細箭頭：相電流　粗箭頭：線電流', C['ink-3'], 11, 'left');
  }

  /* ── 12.4：Y-Δ（課本 Example 12.3） ─────────────────────── */
  liveExample('#ex-yd', {
    title: '例題 · Y-Δ 的相電流與線電流（課本 Example 12.3）',
    ratio: 0.4, minH: 190, maxH: 250,
    givens: [
      { id: 'xd-v', label: '|V<sub>an</sub>|', min: 50, max: 240, step: 5, value: 100, fmt: v => v + ' V' },
      { id: 'xd-t', label: 'V<sub>an</sub> 的角度', min: -90, max: 90, step: 5, value: 10, fmt: sgn },
      { id: 'xd-r', label: '負載每相 R', min: 1, max: 40, step: 1, value: 8, fmt: v => v + ' Ω' },
      { id: 'xd-x', label: '負載每相 X', min: -30, max: 30, step: 1, value: 4, fmt: v => jx(v) + ' Ω' }
    ],
    compute: g => {
      const Van = X.p(g['xd-v'], g['xd-t']), Z = X.c(g['xd-r'], g['xd-x']);
      const VAB = X.mul(Van, X.p(r3, 30)), IAB = X.div(VAB, Z), Ia = X.mul(IAB, X.p(r3, -30)), Ia2 = X.div(Van, X.sc(Z, 1 / 3));
      return { V: g['xd-v'], t: g['xd-t'], Van, Z, VAB, IAB, Ia, Ia2 };
    },
    question: (g, r) => 'abc 相序的平衡 Y 接電源 V<sub>an</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° V，接到每相 (' + X.rect(r.Z, 0) + ') Ω 的平衡 Δ 負載。求相電流與線電流。',
    questionEn: (g, r) => 'A balanced abc-sequence Y-connected source with V<sub>an</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° V is connected to a Δ-connected balanced load (' + X.rect(r.Z, 0) + ') Ω per phase. Calculate the phase and line currents.',
    steps: (g, r) => [
      { t: 'Step 1　負載阻抗換極座標。', eq: 'Z<sub>Δ</sub> = ' + X.rect(r.Z, 0) + ' = ' + X.pol(r.Z, 4) + ' Ω' },
      { t: 'Step 2　Δ 每格吃線電壓。', note: '√3 倍、超前 30°：', eq: 'V<sub>AB</sub> = √3 × ' + r.V + '∠(' + n2(r.t, 0) + '° + 30°) = ' + X.pol(r.VAB, 4) + ' V' },
      { t: 'Step 3　相電流。', eq: 'I<sub>AB</sub> = V<sub>AB</sub>/Z<sub>Δ</sub> = ' + X.pol(r.IAB, 4) + ' A；I<sub>BC</sub> = ' + X.pol(rot(r.IAB, -120), 4) + '，I<sub>CA</sub> = ' + X.pol(rot(r.IAB, 120), 4) + ' A' },
      { t: 'Step 4　線電流 = √3 倍、落後 30°。', eq: 'I<sub>a</sub> = √3 I<sub>AB</sub>∠−30° = ' + X.pol(r.Ia, 4) + ' A；I<sub>b</sub> = ' + X.pol(rot(r.Ia, -120), 4) + '，I<sub>c</sub> = ' + X.pol(rot(r.Ia, 120), 4) + ' A' },
      { t: '驗算　方法二：Δ 換 Y（Z<sub>Δ</sub>/3）。', eq: 'I<sub>a</sub> = ' + X.pol(r.Van, 4) + ' ÷ ' + X.pol(X.sc(r.Z, 1 / 3), 4) + ' = ' + X.pol(r.Ia2, 4) + ' A ✓',
        after: X.ang(r.Z) > 0.5 ? '負載電感性：相電流落後線電壓 ' + n2(X.ang(r.Z), 1) + '°。' : X.ang(r.Z) < -0.5 ? '負載電容性：相電流超前線電壓 ' + n2(-X.ang(r.Z), 1) + '°。' : '純電阻：相電流跟線電壓同相。' }
    ],
    answer: (g, r) => '相電流 ' + X.pol(r.IAB, 4) + ' A（另兩格轉 ∓120°）；線電流 ' + X.pol(r.Ia, 4) + ' A（另兩條轉 ∓120°）',
    draw: (ctx, w, h, g, r) => drawPL(ctx, w, h, r.IAB, r.Ia, 'I<sub>AB</sub>', 'I<sub>a</sub>', ['I<sub>L</sub> = ' + n2(X.mag(r.Ia), 2) + ' A', '= √3 × ' + n2(X.mag(r.IAB), 2) + ' A'])
  });

  /* ── 12.5：Δ-Δ（課本 Example 12.4） ─────────────────────── */
  liveExample('#ex-dd', {
    title: '例題 · Δ-Δ 的相電流與線電流（課本 Example 12.4）',
    ratio: 0.4, minH: 190, maxH: 250,
    givens: [
      { id: 'xe-v', label: 'V<sub>ab</sub>', min: 100, max: 480, step: 10, value: 330, fmt: v => v + '∠0° V' },
      { id: 'xe-r', label: '負載每相 R', min: 1, max: 50, step: 1, value: 20, fmt: v => v + ' Ω' },
      { id: 'xe-x', label: '負載每相 X', min: -40, max: 40, step: 1, value: -15, fmt: v => jx(v) + ' Ω' }
    ],
    compute: g => {
      const V = g['xe-v'], Z = X.c(g['xe-r'], g['xe-x']), IAB = X.div(X.c(V, 0), Z), Ia = X.mul(IAB, X.p(r3, -30));
      return { V, Z, IAB, Ia };
    },
    question: (g, r) => '每相 ' + X.rect(r.Z, 0) + ' Ω 的平衡 Δ 負載，接到正相序、V<sub>ab</sub> = ' + r.V + '∠0° V 的 Δ 接發電機。求負載的相電流與線電流。',
    questionEn: (g, r) => 'A balanced Δ-connected load having an impedance ' + X.rect(r.Z, 0) + ' Ω is connected to a Δ-connected, positive-sequence generator having V<sub>ab</sub> = ' + r.V + '∠0° V. Calculate the phase currents of the load and the line currents.',
    steps: (g, r) => [
      { t: 'Step 1　負載阻抗。', eq: 'Z<sub>Δ</sub> = ' + X.rect(r.Z, 0) + ' = ' + X.pol(r.Z, 4) + ' Ω' },
      { t: 'Step 2　沒有線路阻抗 → V<sub>AB</sub> = V<sub>ab</sub>。', eq: 'I<sub>AB</sub> = ' + r.V + '∠0° ÷ ' + X.pol(r.Z, 4) + ' = ' + X.pol(r.IAB, 4) + ' A',
        after: X.ang(r.Z) < -0.5 ? '電容性負載：電流超前電壓。' : X.ang(r.Z) > 0.5 ? '電感性負載：電流落後電壓。' : '純電阻：電流跟電壓同相。' },
      { t: 'Step 3　另兩格照正相序。', eq: 'I<sub>BC</sub> = ' + X.pol(rot(r.IAB, -120), 4) + ' A，I<sub>CA</sub> = ' + X.pol(rot(r.IAB, 120), 4) + ' A' },
      { t: 'Step 4　線電流。', eq: 'I<sub>a</sub> = √3 I<sub>AB</sub>∠−30° = ' + X.pol(r.Ia, 4) + ' A；I<sub>b</sub> = ' + X.pol(rot(r.Ia, -120), 4) + '，I<sub>c</sub> = ' + X.pol(rot(r.Ia, 120), 4) + ' A' }
    ],
    answer: (g, r) => '相電流 ' + X.pol(r.IAB, 4) + ' A；線電流 ' + X.pol(r.Ia, 4) + ' A（其他照 ∓120°）',
    draw: (ctx, w, h, g, r) => drawPL(ctx, w, h, r.IAB, r.Ia, 'I<sub>AB</sub>', 'I<sub>a</sub>', ['I<sub>L</sub> = ' + n2(X.mag(r.Ia), 2) + ' A', 'I<sub>p</sub> = ' + n2(X.mag(r.IAB), 2) + ' A'])
  });

  /* ── 12.6：Δ-Y（課本 Example 12.5） ─────────────────────── */
  liveExample('#ex-dy', {
    title: '例題 · Δ 電源接 Y 負載（課本 Example 12.5）',
    ratio: 0.4, minH: 190, maxH: 250,
    givens: [
      { id: 'xg-v', label: '線電壓 V<sub>L</sub>', min: 100, max: 480, step: 10, value: 210, fmt: v => v + ' V' },
      { id: 'xg-t', label: 'V<sub>ab</sub> 的角度', min: -60, max: 60, step: 5, value: 0, fmt: sgn },
      { id: 'xg-r', label: '負載每相 R', min: 1, max: 60, step: 1, value: 40, fmt: v => v + ' Ω' },
      { id: 'xg-x', label: '負載每相 X', min: -40, max: 40, step: 1, value: 25, fmt: v => jx(v) + ' Ω' }
    ],
    compute: g => {
      const V = g['xg-v'], t = g['xg-t'], Z = X.c(g['xg-r'], g['xg-x']), Van = X.p(V / r3, t - 30), Ia = X.div(Van, Z);
      return { V, t, Z, Van, Ia };
    },
    question: (g, r) => '每相 ' + X.rect(r.Z, 0) + ' Ω 的平衡 Y 負載，由線電壓 ' + r.V + ' V、正相序的平衡 Δ 接電源供電。以 V<sub>ab</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° 為參考，求相電流。',
    questionEn: (g, r) => 'A balanced Y-connected load with a phase impedance of ' + X.rect(r.Z, 0) + ' Ω is supplied by a balanced, positive sequence Δ-connected source with a line voltage of ' + r.V + ' V. Calculate the phase currents. Use V<sub>ab</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° as a reference.',
    steps: (g, r) => [
      { t: 'Step 1　負載阻抗。', eq: 'Z<sub>Y</sub> = ' + X.rect(r.Z, 0) + ' = ' + X.pol(r.Z, 4) + ' Ω' },
      { t: 'Step 2　Δ 電源 → 等效 Y：÷√3、往後 30°。', eq: 'V<sub>an</sub> = (' + r.V + '/√3)∠(' + n2(r.t, 0) + '° − 30°) = ' + X.pol(r.Van, 4) + ' V' },
      { t: 'Step 3　單相等效。', eq: 'I<sub>a</sub> = ' + X.pol(r.Van, 4) + ' ÷ ' + X.pol(r.Z, 4) + ' = ' + X.pol(r.Ia, 3) + ' A' },
      { t: 'Step 4　正相序補齊（角度換到 ±180° 以內）。', eq: 'I<sub>b</sub> = ' + X.pol(rot(r.Ia, -120), 3) + ' A，I<sub>c</sub> = ' + X.pol(rot(r.Ia, 120), 3) + ' A',
        after: 'Y 負載：相電流就是線電流。' + (Math.abs(X.ang(r.Ia) - 120) > 180 ? '（' + n2(X.ang(r.Ia), 1) + '° − 120° = ' + n2(X.ang(r.Ia) - 120, 1) + '°，加 360° 才落在 ±180° 內）' : '') }
    ],
    answer: (g, r) => 'I<sub>a</sub> = ' + X.pol(r.Ia, 3) + ' A，I<sub>b</sub> = ' + X.pol(rot(r.Ia, -120), 3) + ' A，I<sub>c</sub> = ' + X.pol(rot(r.Ia, 120), 3) + ' A',
    draw: (ctx, w, h, g, r) => {
      const cx = w * 0.32, cy = h / 2, R = Math.max(10, Math.min(h / 2 - 18, w * 0.26));
      E.axes12(ctx, cx, cy, R + 8);
      E.vec12(ctx, cx, cy, R, r.t, C['ink-3'], 'V<sub>ab</sub>', 1.6);
      E.vec12(ctx, cx, cy, R / r3, r.t - 30, C.ink, 'V<sub>an</sub>', 2.2);
      const k = R * 0.8 / Math.max(X.mag(r.Ia), 1e-9), col = PH();
      [0, -120, 120].forEach((d, i) => E.vec12(ctx, cx, cy, X.mag(r.Ia) * k, X.ang(r.Ia) + d, col[i], i ? null : 'I<sub>a</sub>', 2.4));
      labelCJK(ctx, w * 0.62, h * 0.35, 'V<sub>an</sub> = V<sub>ab</sub>/√3 ∠−30°', C.ink, 13, 'left', '700');
      labelCJK(ctx, w * 0.62, h * 0.35 + 24, '|I| = ' + n2(X.mag(r.Ia), 3) + ' A', C.accent, 13, 'left', '700');
    }
  });

  window.__ch12Quiz([
    { zh: 'Y-Δ 系統中，Δ 負載每相兩端的電壓是？', en: 'In a Y-Δ system, the voltage across each phase of the Δ load is:',
      o: [['線電壓', 'the line voltage'], ['相電壓', 'the phase voltage'], ['線電壓 / √3', 'line voltage / √3'], ['0', 'zero']], a: 0,
      e: 'Δ 每格兩端直接接在兩條線上（V<sub>AB</sub> = V<sub>ab</sub> = √3V<sub>p</sub>∠30°）。' },
    { zh: '平衡 Δ 負載，線電流與相電流的關係（abc）？', en: 'For a balanced Δ load (abc), the line current relates to the phase current as:',
      o: [['√3 倍，落後 30°', '√3 times, lagging by 30°'], ['√3 倍，超前 30°', '√3 times, leading by 30°'], ['相等', 'equal'], ['3 倍，同相', '3 times, in phase']], a: 0,
      e: 'I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub> = √3 I<sub>AB</sub>∠−30°。' },
    { zh: '用 Δ 換 Y 的單相等效（Z<sub>Δ</sub>/3）直接算出來的是？', en: 'The per-phase method with Z<sub>Δ</sub>/3 directly gives:',
      o: [['線電流', 'the line current'], ['Δ 的相電流', 'the Δ phase current'], ['線電壓', 'the line voltage'], ['總功率', 'the total power']], a: 0,
      e: '等效 Y 的電流就是線電流；Δ 裡面的相電流要再除 √3、∠+30°。' },
    { zh: 'Y 接電源 V<sub>an</sub> = 100∠10°，Δ 負載 8 + j4 Ω，相電流 I<sub>AB</sub> ≈？', en: 'With V<sub>an</sub> = 100∠10° and a Δ load of 8 + j4 Ω, the phase current I<sub>AB</sub> is about:',
      o: [['19.36∠13.43° A', '19.36∠13.43° A'], ['11.18∠−16.57° A', '11.18∠−16.57° A'], ['33.54∠−16.57° A', '33.54∠−16.57° A'], ['19.36∠−16.57° A', '19.36∠−16.57° A']], a: 0,
      e: 'V<sub>AB</sub> = 173.2∠40°，÷ 8.944∠26.57° = 19.36∠13.43°。33.54 是線電流；11.18 是誤用相電壓除 Z<sub>Δ</sub>。' },
    { zh: 'Δ 接電源的相電壓與線電壓？', en: 'For a Δ-connected source, the phase and line voltages are:',
      o: [['相等', 'the same'], ['線電壓是 √3 倍', 'line is √3 times larger'], ['線電壓是 1/√3', 'line is 1/√3'], ['差 90°', '90° apart']], a: 0,
      e: 'Δ 每顆電源本身就跨在兩條線之間。' },
    { zh: '實務上 Δ 接電源很少用，主要原因？', en: 'Δ-connected sources are rarely used in practice mainly because:',
      o: [['稍微不平衡就會有環流', 'a slight imbalance causes circulating current'], ['電壓太低', 'the voltage is too low'], ['沒辦法接負載', 'loads cannot be connected'], ['相序會改變', 'the sequence changes']], a: 0,
      e: '三顆電源繞成一圈，電壓加起來不是 0 時，只剩很小的內阻限制電流。' },
    { zh: '把 Δ 電源換成等效 Y 電源，V<sub>an</sub> = ？', en: 'Converting a Δ source to an equivalent Y source, V<sub>an</sub> = ?',
      o: [['V<sub>ab</sub>/√3 ∠−30°', 'V<sub>ab</sub>/√3 ∠−30°'], ['V<sub>ab</sub>/√3 ∠+30°', 'V<sub>ab</sub>/√3 ∠+30°'], ['√3 V<sub>ab</sub>∠30°', '√3 V<sub>ab</sub>∠30°'], ['V<sub>ab</sub>/3', 'V<sub>ab</sub>/3']], a: 0,
      e: '線電壓 = √3 相電壓、超前 30° 的反操作。' },
    { zh: 'Δ-Y 系統中 Y 負載的相電流與線電流？', en: 'In a Δ-Y system, the Y-load phase currents and line currents are:',
      o: [['相等', 'equal'], ['線電流 √3 倍', 'line is √3 times'], ['相電流 √3 倍', 'phase is √3 times'], ['差 30°', '30° apart']], a: 0,
      e: 'Y 負載每相跟它的線串在一起。' },
    { zh: '已知 Δ 負載的線電流 I<sub>a</sub> = 9.609∠35° A，相電流 I<sub>AB</sub> = ？', en: 'Given a Δ-load line current I<sub>a</sub> = 9.609∠35° A, I<sub>AB</sub> = ?',
      o: [['5.548∠65° A', '5.548∠65° A'], ['5.548∠5° A', '5.548∠5° A'], ['16.64∠5° A', '16.64∠5° A'], ['9.609∠65° A', '9.609∠65° A']], a: 0,
      e: '除 √3、角度 +30°（Practice 12.4）。' },
    { zh: '任何平衡三相電路最簡單的分析方法？', en: 'The easiest way to analyze any balanced three-phase circuit is to:',
      o: [['全部換成 Y-Y，用單相等效', 'transform to Y-Y and use the per-phase circuit'], ['全部換成 Δ-Δ', 'transform to Δ-Δ'], ['寫三個網目方程式', 'write three mesh equations'], ['用 PSpice', 'use PSpice']], a: 0,
      e: '課本 Summary 第 3 點。' }
  ], ['四種接法都抓到了，去 PART 3 看三相功率吧。',
      '大方向對了，回去看「線電流 = 兩個相電流相減」那個互動。',
      '先把故事模式的 √3、30° 那幾段再看一次，然後拉一拉 Example 12.3 的數字。']);
})();
