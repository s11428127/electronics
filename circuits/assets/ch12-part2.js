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
  /* ── 12.4 先補課：同一台馬達接 Y 或 Δ（數字 = 課本 Example 12.3） ── */
  liveExample('#ex-dreal', {
    title: '例題 · 同一組負載，接 Y 和接 Δ 差多少（數字取自課本 Example 12.3）',
    ratio: 0.36, minH: 170, maxH: 230,
    givens: [
      { id: 'xd-vl', label: '線電壓 V<sub>L</sub>', min: 100, max: 480, step: 0.1, value: 173.2, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xd-r', label: '每格電阻', min: 1, max: 40, step: 1, value: 8, fmt: v => v + ' Ω' },
      { id: 'xd-x', label: '每格電抗', min: -20, max: 20, step: 1, value: 4, fmt: v => jx(v) + ' Ω' }
    ],
    compute: g => {
      const VL = g['xd-vl'], Z = X.c(g['xd-r'], g['xd-x']), m = X.mag(Z);
      const IY = VL / r3 / m, Ip = VL / m, IL = r3 * Ip;
      return { VL, Z, m, IY, Ip, IL, SY: 3 * (VL / r3) * IY, SD: 3 * VL * Ip };
    },
    question: (g, r) => '三相電源線電壓 ' + n2(r.VL, 1) + ' V。三格一樣的負載，每格 ' + X.rect(r.Z, 0) + ' Ω。(a) 接成 Y；(b) 接成 Δ。各求每格的電壓、每格的電流、線電流。',
    questionEn: (g, r) => 'A three-phase source has a line voltage of ' + n2(r.VL, 1) + ' V. Three identical loads of ' + X.rect(r.Z, 0) + ' Ω each are connected (a) in Y, (b) in delta. Find the voltage across each load, the current in each load, and the line current.',
    steps: (g, r) => [
      { t: 'Step 1　每格阻抗的大小。', eq: '|Z| = √(' + g['xd-r'] + '² + ' + g['xd-x'] + '²) = ' + n2(r.m, 3) + ' Ω' },
      { t: 'Step 2　(a) Y 接：每格夾火線和中性點。', note: '吃相電壓 = 線電壓 / √3；Y 接沒有岔路，線電流 = 每格的電流。', eq: 'V<sub>p</sub> = ' + n2(r.VL, 1) + ' / 1.732 = ' + n2(r.VL / r3, 1) + ' V，I<sub>L</sub> = I<sub>p</sub> = ' + n2(r.VL / r3, 1) + ' / ' + n2(r.m, 3) + ' = ' + n2(r.IY, 2) + ' A' },
      { t: 'Step 3　(b) Δ 接：每格直接夾兩條火線。', note: '吃線電壓，所以每格的電流是 Y 接的 √3 倍。', eq: 'I<sub>p</sub> = ' + n2(r.VL, 1) + ' / ' + n2(r.m, 3) + ' = ' + n2(r.Ip, 2) + ' A' },
      { t: 'Step 4　Δ 的線電流：兩格的電流在角上會合。', note: '節點 A：I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>，兩支差 120° 相減 = √3 倍。', eq: 'I<sub>L</sub> = √3 × ' + n2(r.Ip, 2) + ' = ' + n2(r.IL, 2) + ' A' },
      { t: 'Step 5　比一比。', eq: 'Δ 的線電流 ÷ Y 的線電流 = ' + n2(r.IL, 2) + ' / ' + n2(r.IY, 2) + ' = ' + n2(r.IL / r.IY, 2),
        after: '同一組負載接成 Δ，線電流和功率都是 Y 接的 3 倍（電壓 √3 倍 × 電流 √3 倍）。大馬達啟動時先接 Y、轉起來再換 Δ（星三角啟動），就是用這個 3 倍把啟動電流壓到三分之一。' + (Math.abs(r.VL - 173.2) < 0.1 && g['xd-r'] === 8 && g['xd-x'] === 4 ? '這組數字就是 Example 12.3：Δ 的 19.36 A、33.54 A 對得上。' : '') }
    ],
    answer: (g, r) => '(a) Y：每格 ' + n2(r.VL / r3, 1) + ' V，I<sub>p</sub> = I<sub>L</sub> = ' + n2(r.IY, 2) + ' A；(b) Δ：每格 ' + n2(r.VL, 1) + ' V，I<sub>p</sub> = ' + n2(r.Ip, 2) + ' A，I<sub>L</sub> = ' + n2(r.IL, 2) + ' A',
    draw: (ctx, w, h, g, r) => {
      const x0 = Math.min(130, w * 0.3), x1 = w - 60, k = (x1 - x0) / Math.max(r.IL, 1e-9);
      const rows = [['Y：線電流', r.IY, C.ink], ['Δ：每格電流', r.Ip, C['q-react']], ['Δ：線電流', r.IL, C.accent]];
      const bh = Math.max(10, Math.min(22, h / 7));
      rows.forEach((row, i) => {
        const y = h * (0.24 + i * 0.27);
        labelCJK(ctx, x0 - 8, y, row[0], row[2], 11.5, 'right', '700');
        ctx.fillStyle = row[2]; ctx.globalAlpha = 0.85; ctx.fillRect(x0, y - bh / 2, Math.max(0, row[1] * k), bh); ctx.globalAlpha = 1;
        labelCJK(ctx, x0 + row[1] * k + 6, y, n2(row[1], 2) + ' A', row[2], 11.5, 'left', '700');
      });
    }
  });

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
  /* ── 12.6 先補課：沿迴路 aANBba 寫 KVL（課本 Example 12.5 的數字） ── */
  liveExample('#ex-walk', {
    title: '例題 · 沿迴路走一圈寫 KVL 求線電流（課本 Example 12.5，方法一）',
    ratio: 0.4, minH: 190, maxH: 250,
    givens: [
      { id: 'xw-v', label: 'Δ 電源 |V<sub>ab</sub>|（線電壓）', min: 100, max: 480, step: 10, value: 210, fmt: v => v + ' V' },
      { id: 'xw-r', label: 'Y 負載每相 R', min: 1, max: 60, step: 1, value: 40, fmt: v => v + ' Ω' },
      { id: 'xw-x', label: 'Y 負載每相 X', min: -40, max: 40, step: 1, value: 25, fmt: v => jx(v) + ' Ω' }
    ],
    compute: g => {
      const Vab = X.c(g['xw-v'], 0), Z = X.c(g['xw-r'], g['xw-x']);
      const D = X.div(Vab, Z);                       /* I_a − I_b */
      const Ia = X.mul(D, X.p(1 / r3, -30)), Ib = rot(Ia, -120);
      const Van = X.p(g['xw-v'] / r3, -30), Ia2 = X.div(Van, Z);
      return { Vab, Z, D, Ia, Ib, Ia2, zang: X.ang(Z) };
    },
    question: (g, r) => '平衡 Δ 電源（正相序）V<sub>ab</sub> = ' + g['xw-v'] + '∠0° V，接 Y 負載每相 ' + X.rect(r.Z, 0) + ' Ω，沒有線路阻抗。沿迴路 aANBba 寫 KVL，求線電流 I<sub>a</sub>。',
    questionEn: (g, r) => 'A balanced positive-sequence Δ source with V<sub>ab</sub> = ' + g['xw-v'] + '∠0° V feeds a Y load of ' + X.rect(r.Z, 0) + ' Ω per phase (no line impedance). Apply KVL around loop aANBba to find the line current I<sub>a</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　讀路線：a → A → N → B → b → 回到 a。', note: '小寫 = 電源端、大寫 = 負載端、N = 負載中性點。', eq: '經過：電線、a 相負載、b 相負載、電線、電源 V<sub>ab</sub>' },
      { t: 'Step 2　一段一段記電壓。', note: '順著電流過阻抗 +ZI；逆著電流 −ZI；電源從 − 走到 + 記 −V。', eq: '0 + Z<sub>Y</sub>I<sub>a</sub> − Z<sub>Y</sub>I<sub>b</sub> + 0 − V<sub>ab</sub> = 0' },
      { t: 'Step 3　移項。', eq: 'I<sub>a</sub> − I<sub>b</sub> = V<sub>ab</sub> / Z<sub>Y</sub> = ' + g['xw-v'] + '∠0° ÷ ' + X.pol(r.Z, 4) + ' = ' + X.pol(r.D, 4) + ' A' },
      { t: 'Step 4　平衡：I<sub>b</sub> = I<sub>a</sub>∠−120°。', note: '兩支差 120° 的箭頭相減 = √3 倍、轉 +30°（跟線電壓同一個幾何）。', eq: 'I<sub>a</sub> − I<sub>b</sub> = I<sub>a</sub>(1 − 1∠−120°) = √3 I<sub>a</sub>∠30°' },
      { t: 'Step 5　解出 I<sub>a</sub>。', eq: 'I<sub>a</sub> = ' + X.pol(r.D, 4) + ' ÷ (√3∠30°) = ' + X.pol(r.Ia, 3, 2) + ' A',
        after: Math.abs(r.zang) < 0.5 ? '負載是純電阻，I<sub>a</sub> 就落後 V<sub>ab</sub> 剛好 30°（全部來自 Δ→Y 的那 30°）。' : r.zang > 0 ? '負載偏電感：I<sub>a</sub> 比 V<sub>ab</sub> 晚了 30° + ' + n2(r.zang, 1) + '°（30° 來自線電壓和相電壓的差，其餘是負載角）。' : '負載偏電容：負載角是負的，把電流往前拉，I<sub>a</sub> 只比 V<sub>ab</sub> 晚 30° − ' + n2(-r.zang, 1) + '°。' },
      { t: '對照　方法二（換等效 Y 電源）。', eq: 'V<sub>an</sub> = ' + g['xw-v'] + '/√3∠−30° = ' + n2(g['xw-v'] / r3, 2) + '∠−30° V，I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub> = ' + X.pol(r.Ia2, 3, 2) + ' A',
        after: '兩個方法答案一樣。考試時方法二比較快；方法一用來看懂公式從哪來。' }
    ],
    answer: (g, r) => 'I<sub>a</sub> = ' + X.pol(r.Ia, 3, 2) + ' A（I<sub>b</sub> = ' + X.pol(r.Ib, 3, 2) + ' A）',
    draw: (ctx, w, h, g, r) => {
      const cx = w * 0.3, cy = h / 2, R = Math.max(10, Math.min(h / 2 - 18, w * 0.22));
      const m = X.mag(r.D), k = R / Math.max(m, 1e-9);
      E.axes12(ctx, cx, cy, R + 8);
      const ia = E.vec12(ctx, cx, cy, X.mag(r.Ia) * k, X.ang(r.Ia), C.accent, 'I<sub>a</sub>', 2.4);
      E.vec12(ctx, cx, cy, X.mag(r.Ib) * k, X.ang(r.Ib), C['q-react'], 'I<sub>b</sub>', 2);
      E.vec12(ctx, ia[0], ia[1], X.mag(r.Ib) * k, X.ang(r.Ib) + 180, C['ink-3'], '', 1.4);
      E.vec12(ctx, cx, cy, m * k, X.ang(r.D), C.ink, 'I<sub>a</sub> − I<sub>b</sub>', 2.2);
      labelCJK(ctx, w * 0.62, h * 0.35, '|I<sub>a</sub> − I<sub>b</sub>| = √3 |I<sub>a</sub>|', C.ink, 12.5, 'left', '700');
      labelCJK(ctx, w * 0.62, h * 0.35 + 24, n2(m, 2) + ' = 1.732 × ' + n2(X.mag(r.Ia), 2), C['ink-2'], 11.5, 'left');
    }
  });

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

/* 排列切換：題目先（預設）／觀念先。只換 body 的 class，CSS 負責排順序 */
(function () {
  const b = document.getElementById('pf-toggle'); if (!b) return;
  let on = true;
  try { on = localStorage.getItem('ee-pf-ch12p2') !== '0'; } catch (e) {}
  const set = () => {
    document.body.classList.toggle('prob-first', on);
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? '排列：題目先 ✓（點一下改回觀念先）' : '排列：觀念先（點一下改成題目先）';
  };
  set();
  b.addEventListener('click', () => { on = !on; try { localStorage.setItem('ee-pf-ch12p2', on ? '1' : '0'); } catch (e) {} set(); });
})();
