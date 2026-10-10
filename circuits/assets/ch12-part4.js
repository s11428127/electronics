/* ============================================================
   電路學 CH12 PART 4（12.9 PSpice、12.10 三相功率量測、家用配電）
   可互動例題 + 觀念小測驗。互動模組（cv-loop、cv-2w、cv-home）在 ch12.js。
   預設數字 = 課本 Example 12.11、12.14、12.15；觸電例題為自編（課本式 12.73）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  const { C, label, labelCJK, liveExample, lerp } = E;
  const RAD = Math.PI / 180, r3 = Math.sqrt(3);
  const n2 = (x, d) => X.num(x, d === undefined ? 2 : d);

  /* ── 12.9：PSpice 例題的手算驗證（課本 Example 12.11） ──── */
  liveExample('#ex-psp', {
    title: '例題 · 平衡 Y-Δ：PSpice 會印出什麼（課本 Example 12.11）',
    ratio: 0.28, minH: 150, maxH: 190,
    givens: [
      { id: 'xp-f', label: '頻率 f', min: 10, max: 400, step: 10, value: 60, fmt: v => v + ' Hz' },
      { id: 'xp-v', label: '相電壓', min: 50, max: 240, step: 10, value: 100, fmt: v => v + ' V' },
      { id: 'xp-rl', label: '線路電阻', min: 0, max: 10, step: 0.5, value: 1, fmt: v => v + ' Ω' },
      { id: 'xp-r', label: 'Δ 負載 R', min: 10, max: 300, step: 10, value: 100, fmt: v => v + ' Ω' },
      { id: 'xp-l', label: 'Δ 負載 L', min: 0, max: 0.5, step: 0.01, value: 0.2, fmt: v => v.toFixed(2) + ' H' }
    ],
    compute: g => {
      const f = g['xp-f'], V = g['xp-v'], Rl = g['xp-rl'], XL = 2 * Math.PI * f * g['xp-l'];
      const ZD = X.c(g['xp-r'], XL), Zt = X.add(X.c(Rl, 0), X.sc(ZD, 1 / 3)), Ia = X.div(X.c(V, 0), Zt);
      const VAN = X.mul(Ia, X.sc(ZD, 1 / 3)), VAB = X.mul(VAN, X.p(r3, 30)), IAB = X.div(VAB, ZD), IAC = X.neg(X.mul(IAB, X.p(1, 120)));
      return { f, V, Rl, XL, ZD, Zt, Ia, VAN, VAB, IAB, IAC };
    },
    question: (g, r) => '平衡 Y-Δ：三顆 ' + r.V + ' V（0°、−120°、120°）電源，每條線 ' + r.Rl + ' Ω，Δ 負載每相 ' + g['xp-r'] + ' Ω 串 ' + g['xp-l'].toFixed(2) + ' H，f = ' + r.f + ' Hz。用 PSpice 求 I<sub>aA</sub>、V<sub>AB</sub>、I<sub>AC</sub>（下面是手算驗證）。',
    questionEn: (g, r) => 'For the balanced Y-Δ circuit with ' + r.V + ' V sources, ' + r.Rl + ' Ω line resistance, and a Δ load of ' + g['xp-r'] + ' Ω in series with ' + g['xp-l'].toFixed(2) + ' H per phase, use PSpice to find the line current I<sub>aA</sub>, the phase voltage V<sub>AB</sub>, and the phase current I<sub>AC</sub>. Assume that the source frequency is ' + r.f + ' Hz.',
    steps: (g, r) => [
      { t: 'PSpice 設定：AC Sweep Total Pts = 1，Start = Final = ' + r.f + ' Hz。', eq: 'IPRINT 串在 a 線、串在 AC 那格；VPRINT2 跨 A、B', note: 'L 直接填 ' + g['xp-l'].toFixed(2) + ' H。' },
      { t: 'Step 1　手算：電抗與 Δ → Y。', eq: 'X<sub>L</sub> = 2π(' + r.f + ')(' + g['xp-l'].toFixed(2) + ') = ' + n2(r.XL, 2) + ' Ω；Z<sub>Δ</sub>/3 = ' + X.rect(X.sc(r.ZD, 1 / 3), 2) + ' Ω' },
      { t: 'Step 2　單相等效（串上線路）。', eq: 'I<sub>aA</sub> = ' + r.V + ' ÷ (' + X.rect(r.Zt, 2) + ') = ' + X.pol(r.Ia, 4, 2) + ' A' },
      { t: 'Step 3　負載的線電壓。', eq: 'V<sub>AN</sub> = I<sub>aA</sub>·Z<sub>Δ</sub>/3 = ' + X.pol(r.VAN, 4, 2) + ' → V<sub>AB</sub> = √3V<sub>AN</sub>∠30° = ' + X.pol(r.VAB, 4, 2) + ' V' },
      { t: 'Step 4　I<sub>AC</sub>（從 A 流到 C，跟 I<sub>CA</sub> 反向）。', eq: 'I<sub>AB</sub> = V<sub>AB</sub>/Z<sub>Δ</sub> = ' + X.pol(r.IAB, 4, 2) + '；I<sub>AC</sub> = −I<sub>CA</sub> = ' + X.pol(r.IAC, 4, 2) + ' A',
        after: 'PSpice 輸出檔會印 IM = ' + n2(X.mag(r.Ia), 3) + '、IP = ' + n2(X.ang(r.Ia), 2) + ' 這種格式。' + (r.Rl > 0 ? '線路 ' + r.Rl + ' Ω 讓 V<sub>AB</sub> 比 √3 × ' + r.V + ' = ' + n2(r3 * r.V, 1) + ' V 小一點。' : '') }
    ],
    answer: (g, r) => 'I<sub>aA</sub> = ' + X.pol(r.Ia, 4, 2) + ' A，V<sub>AB</sub> = ' + X.pol(r.VAB, 4, 2) + ' V，I<sub>AC</sub> = ' + X.pol(r.IAC, 4, 2) + ' A',
    draw: (ctx, w, h, g, r) => {
      const rows = [['FREQ', 'IM(V_PRINT1)', 'IP(V_PRINT1)'], [r.f.toExponential(3).toUpperCase(), X.mag(r.Ia).toExponential(3).toUpperCase(), X.ang(r.Ia).toExponential(3).toUpperCase()],
        ['FREQ', 'V(A,B)', 'VP(A,B)'], [r.f.toExponential(3).toUpperCase(), X.mag(r.VAB).toExponential(3).toUpperCase(), X.ang(r.VAB).toExponential(3).toUpperCase()]];
      ctx.fillStyle = C['surface-2']; ctx.fillRect(16, 10, w - 32, h - 20);
      rows.forEach((rw, i) => rw.forEach((c, j) => label(ctx, 30 + j * (w - 60) / 3, 30 + i * (h - 50) / 3, c.replace('V_PRINT1', 'V_PRINT1'), i % 2 ? C.accent : C['ink-3'], 11.5, 'left', i % 2 ? '700' : '500')));
    }
  });

  /* ── 12.10：由兩瓦特計讀數反推（課本 Example 12.14） ────── */
  liveExample('#ex-w14', {
    title: '例題 · 由兩瓦特計讀數反推負載（課本 Example 12.14）',
    ratio: 0.3, minH: 160, maxH: 210,
    givens: [
      { id: 'xw-p1', label: 'P<sub>1</sub>', min: -2000, max: 3000, step: 10, value: 1560, fmt: v => v + ' W' },
      { id: 'xw-p2', label: 'P<sub>2</sub>', min: -2000, max: 3000, step: 10, value: 2100, fmt: v => v + ' W' },
      { id: 'xw-v', label: '線電壓', min: 100, max: 480, step: 4, value: 220, fmt: v => v + ' V' },
      { id: 'xw-c', label: '負載接法（0 = Δ、1 = Y）', min: 0, max: 1, step: 1, value: 0, fmt: v => v ? 'Y' : 'Δ' }
    ],
    compute: g => {
      const P1 = g['xw-p1'], P2 = g['xw-p2'], VL = g['xw-v'], Y = g['xw-c'] === 1;
      const PT = P1 + P2, QT = r3 * (P2 - P1), th = Math.atan2(QT, PT) / RAD, S = Math.hypot(PT, QT);
      const Vp = Y ? VL / r3 : VL, Ip = S / 3 / Vp, Zp = Ip > 0 ? Vp / Ip : Infinity;
      return { P1, P2, VL, Y, PT, QT, th, S, Vp, Ip, Zp, bad: PT <= 0 };
    },
    question: (g, r) => '兩瓦特計法接在 ' + (r.Y ? 'Y' : 'Δ') + ' 接平衡負載上，讀數 P<sub>1</sub> = ' + r.P1 + ' W、P<sub>2</sub> = ' + r.P2 + ' W，線電壓 ' + r.VL + ' V。求每相平均功率、每相虛功率、功率因數、每相阻抗。',
    questionEn: (g, r) => 'The two-wattmeter method produces wattmeter readings P<sub>1</sub> = ' + r.P1 + ' W and P<sub>2</sub> = ' + r.P2 + ' W when connected to a ' + (r.Y ? 'wye' : 'delta') + '-connected load. If the line voltage is ' + r.VL + ' V, calculate: (a) the per-phase average power, (b) the per-phase reactive power, (c) the power factor, and (d) the phase impedance.',
    steps: (g, r) => r.bad ? [{ t: '注意', eq: 'P<sub>T</sub> = ' + r.PT + ' W ≤ 0', after: '負載不會吃負的總功率（那代表它是電源），把讀數調回來。' }] : [
      { t: 'Step 1　總功率與每相。', eq: 'P<sub>T</sub> = ' + r.P1 + ' + ' + r.P2 + ' = ' + r.PT + ' W → P<sub>p</sub> = ' + n2(r.PT / 3, 2) + ' W' },
      { t: 'Step 2　總虛功率與每相。', eq: 'Q<sub>T</sub> = √3(' + r.P2 + ' − (' + r.P1 + ')) = ' + n2(r.QT, 1) + ' VAR → Q<sub>p</sub> = ' + n2(r.QT / 3, 2) + ' VAR' },
      { t: 'Step 3　功因角。', eq: 'θ = tan<sup>−1</sup>(' + n2(r.QT, 1) + '/' + r.PT + ') = ' + n2(r.th, 2) + '° → pf = ' + n2(Math.cos(r.th * RAD), 4),
        after: Math.abs(r.P2 - r.P1) < 1e-9 ? 'P<sub>1</sub> = P<sub>2</sub>：純電阻。' : r.P2 > r.P1 ? 'P<sub>2</sub> &gt; P<sub>1</sub>：電感性、落後。' : 'P<sub>1</sub> &gt; P<sub>2</sub>：電容性、超前。' },
      { t: 'Step 4　每相阻抗（' + (r.Y ? 'Y：V<sub>p</sub> = V<sub>L</sub>/√3' : 'Δ：V<sub>p</sub> = V<sub>L</sub>') + '）。', eq: 'I<sub>p</sub> = P<sub>p</sub>/(V<sub>p</sub> cos θ) = ' + n2(r.Ip, 3) + ' A → Z<sub>p</sub> = ' + n2(r.Vp, 1) + '/' + n2(r.Ip, 3) + ' = ' + n2(r.Zp, 2) + '∠' + n2(r.th, 2) + '° Ω' }
    ],
    answer: (g, r) => r.bad ? '讀數不合理' : 'P<sub>p</sub> = ' + n2(r.PT / 3, 1) + ' W，Q<sub>p</sub> = ' + n2(r.QT / 3, 2) + ' VAR，pf = ' + n2(Math.cos(r.th * RAD), 4) + '，Z<sub>p</sub> = ' + n2(r.Zp, 2) + '∠' + n2(r.th, 2) + '° Ω',
    draw: (ctx, w, h, g, r) => {
      const my = h * 0.55, big = Math.max(Math.abs(r.P1), Math.abs(r.P2), Math.abs(r.PT), 1), k = (h * 0.4) / big, bw = Math.min(70, w / 7);
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(20, my); ctx.lineTo(w - 20, my); ctx.stroke();
      [['P₁', r.P1, C['q-react']], ['P₂', r.P2, C.ink], ['P₁+P₂', r.PT, C.accent]].forEach((b, i) => {
        const x = w * (0.22 + i * 0.25) - bw / 2, hh = b[1] * k;
        ctx.fillStyle = b[2]; ctx.fillRect(x, hh >= 0 ? my - hh : my, bw, Math.abs(hh));
        labelCJK(ctx, x + bw / 2, hh >= 0 ? my - hh - 9 : my - hh + 11, String(b[1]) + ' W', b[2], 11, 'center', '700');
        labelCJK(ctx, x + bw / 2, hh >= 0 ? my + 13 : my - 10, b[0], C['ink-2'], 11, 'center', '700');
      });
    }
  });

  /* ── 12.10：預測兩瓦特計讀數（課本 Example 12.15） ──────── */
  liveExample('#ex-w15', {
    title: '例題 · 預測兩瓦特計讀數（課本 Example 12.15）',
    ratio: 0.3, minH: 160, maxH: 210,
    givens: [
      { id: 'xv5-r', label: '每相 R', min: 1, max: 40, step: 1, value: 8, fmt: v => v + ' Ω' },
      { id: 'xv5-x', label: '每相 X', min: -40, max: 40, step: 1, value: 6, fmt: v => (v < 0 ? '−j' : 'j') + Math.abs(v) + ' Ω' },
      { id: 'xv5-v', label: '線電壓', min: 100, max: 480, step: 4, value: 208, fmt: v => v + ' V' },
      { id: 'xv5-c', label: '負載接法（0 = Y、1 = Δ）', min: 0, max: 1, step: 1, value: 0, fmt: v => v ? 'Δ' : 'Y' }
    ],
    compute: g => {
      const Z = X.c(g['xv5-r'], g['xv5-x']), VL = g['xv5-v'], D = g['xv5-c'] === 1, th = X.ang(Z);
      const IL = D ? r3 * VL / X.mag(Z) : VL / r3 / X.mag(Z);
      const P1 = VL * IL * Math.cos((th + 30) * RAD), P2 = VL * IL * Math.cos((th - 30) * RAD);
      return { Z, VL, D, th, IL, P1, P2 };
    },
    question: (g, r) => '圖 12.35 的平衡負載改成 ' + (r.D ? 'Δ' : 'Y') + ' 接，每相 ' + X.rect(r.Z, 0) + ' Ω，接在 ' + r.VL + ' V 線上。預測瓦特計 W<sub>1</sub>、W<sub>2</sub> 的讀數，並求 P<sub>T</sub>、Q<sub>T</sub>。',
    questionEn: (g, r) => 'The three-phase balanced load in Fig. 12.35 is ' + (r.D ? 'delta' : 'wye') + '-connected with impedance per phase of ' + X.rect(r.Z, 0) + ' Ω. If the load is connected to ' + r.VL + '-V lines, predict the readings of the wattmeters W<sub>1</sub> and W<sub>2</sub>. Find P<sub>T</sub> and Q<sub>T</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　負載角。', eq: 'Z = ' + X.pol(r.Z, 4) + ' Ω → θ = ' + n2(r.th, 2) + '°' },
      { t: 'Step 2　線電流（' + (r.D ? 'Δ：I<sub>p</sub> = V<sub>L</sub>/|Z|，I<sub>L</sub> = √3I<sub>p</sub>' : 'Y：I<sub>L</sub> = (V<sub>L</sub>/√3)/|Z|') + '）。', eq: 'I<sub>L</sub> = ' + n2(r.IL, 3) + ' A', after: Math.abs(r.IL - Math.round(r.IL)) < 0.02 && Math.abs(r.IL - Math.round(r.IL)) > 1e-6 ? '課本把它四捨五入成 ' + Math.round(r.IL) + ' A 再往下算，所以課本的讀數會差一點點（例：980.48 W、2478.1 W）。' : '' },
      { t: 'Step 3　兩個讀數。', eq: 'P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ + 30°) = ' + n2(r.P1, 2) + ' W；P<sub>2</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ − 30°) = ' + n2(r.P2, 2) + ' W',
        after: r.P1 < 0 ? 'θ &gt; 60°：P<sub>1</sub> 是負的（瓦特計反打），照樣相加。' : r.P2 < 0 ? 'θ &lt; −60°：P<sub>2</sub> 是負的。' : '' },
      { t: 'Step 4　總和。', eq: 'P<sub>T</sub> = ' + n2(r.P1 + r.P2, 2) + ' W，Q<sub>T</sub> = √3(P<sub>2</sub> − P<sub>1</sub>) = ' + n2(r3 * (r.P2 - r.P1), 2) + ' VAR',
        after: r.th > 0.5 ? 'P<sub>2</sub> &gt; P<sub>1</sub>：電感性，跟 +j 一致。' : r.th < -0.5 ? 'P<sub>1</sub> &gt; P<sub>2</sub>：電容性，跟 −j 一致。' : '純電阻：兩個讀數一樣。' }
    ],
    answer: (g, r) => 'W<sub>1</sub> = ' + n2(r.P1, 2) + ' W，W<sub>2</sub> = ' + n2(r.P2, 2) + ' W，P<sub>T</sub> = ' + n2(r.P1 + r.P2, 1) + ' W，Q<sub>T</sub> = ' + n2(r3 * (r.P2 - r.P1), 1) + ' VAR',
    draw: (ctx, w, h, g, r) => {
      /* P1、P2 隨 θ 的曲線，現在的位置打點 */
      const x0 = 40, x1 = w - 20, y0 = 12, y1 = h - 20, S = r.VL * r.IL, Xa = t => lerp(x0, x1, (t + 90) / 180), Ya = p => lerp(y1, y0, (p / S + 0.6) / 1.7);
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(x0, Ya(0)); ctx.lineTo(x1, Ya(0)); ctx.stroke();
      [[30, C['q-react'], 'P₁'], [-30, C.ink, 'P₂']].forEach(([d, c, n]) => {
        ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath();
        for (let t = -90; t <= 90; t += 2) { const x = Xa(t), y = Ya(S * Math.cos((t + d) * RAD)); t === -90 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); E.disc(ctx, Xa(r.th), Ya(S * Math.cos((r.th + d) * RAD)), 5, c);
        labelCJK(ctx, Xa(d > 0 ? 50 : -50), Ya(S * Math.cos((d > 0 ? 80 : -80) * RAD)) - 10, n, c, 12, 'center', '700');
      });
      label(ctx, x0, y1 + 10, '−90°', C['ink-3'], 10, 'left'); label(ctx, x1, y1 + 10, '+90°', C['ink-3'], 10, 'right'); labelCJK(ctx, (x0 + x1) / 2, y1 + 10, '負載角 θ', C['ink-3'], 10, 'center');
    }
  });

  /* ── 12.10.2：觸電電流（自編，課本式 12.73） ──────────── */
  liveExample('#ex-shock', {
    title: '例題 · 碰到火線會流多少電流（自編練習，課本式 12.73）',
    ratio: 0.22, minH: 120, maxH: 160,
    givens: [
      { id: 'xk-v', label: '人體兩點的電壓', min: 12, max: 240, step: 6, value: 120, fmt: v => v + ' V' },
      { id: 'xk-r', label: '人體電阻', min: 500, max: 100000, step: 500, value: 100000, fmt: v => (v >= 1000 ? (v / 1000) + ' kΩ' : v + ' Ω') }
    ],
    compute: g => ({ V: g['xk-v'], R: g['xk-r'], I: g['xk-v'] / g['xk-r'] * 1000 }),
    question: (g, r) => '人的身體可以看成一個電阻 R。碰到 ' + r.V + ' V 的火線、身體電阻 ' + (r.R >= 1000 ? r.R / 1000 + ' kΩ' : r.R + ' Ω') + '（' + (r.R >= 50000 ? '皮膚乾燥' : r.R <= 2000 ? '皮膚潮濕' : '一般') + '），流過身體的電流多大？危不危險？',
    questionEn: (g, r) => 'Treating the human body as a resistor R = ' + (r.R >= 1000 ? r.R / 1000 + ' kΩ' : r.R + ' Ω') + ', find the current through the body when it touches a ' + r.V + ' V line. Is it dangerous?',
    steps: (g, r) => [
      { t: 'Step 1　歐姆定律（式 12.73）。', eq: 'I = V/R = ' + r.V + ' / ' + r.R + ' = ' + n2(r.I, 2) + ' mA' },
      { t: 'Step 2　跟門檻比。', eq: r.I < 1 ? '&lt; 1 mA：通常無害' : r.I < 10 ? '1～10 mA：會麻、會痛' : '&gt; 10 mA：嚴重電擊，可能致命',
        after: r.R >= 50000 ? '皮膚乾燥時電阻很大；把電阻拉到 1 kΩ（濕手）看看會怎樣 —— 這就是浴室一定要裝 GFCI 的原因。' : '濕的時候電阻掉很多，電流暴增。GFCI 在約 5 mA 就會跳脫。' }
    ],
    answer: (g, r) => 'I = ' + n2(r.I, 2) + ' mA（' + (r.I < 1 ? '安全範圍' : r.I < 10 ? '有感、危險邊緣' : '危險') + '）',
    draw: (ctx, w, h, g, r) => {
      const x0 = 30, x1 = w - 30, X0 = v => lerp(x0, x1, Math.log10(Math.max(v, 0.01) / 0.01) / Math.log10(1000 / 0.01)), y = h / 2;
      ctx.fillStyle = C.ok; ctx.globalAlpha = 0.3; ctx.fillRect(x0, y - 7, X0(1) - x0, 14);
      ctx.fillStyle = C.warn; ctx.fillRect(X0(1), y - 7, X0(10) - X0(1), 14);
      ctx.fillStyle = C.bad; ctx.fillRect(X0(10), y - 7, x1 - X0(10), 14); ctx.globalAlpha = 1;
      [[1, '1 mA'], [10, '10 mA'], [100, '100 mA']].forEach(([v, s]) => { ctx.fillStyle = C.ink; ctx.fillRect(X0(v) - 1, y - 12, 2, 24); label(ctx, X0(v), y - 20, s, C['ink-2'], 10.5, 'center'); });
      E.disc(ctx, Math.min(x1, X0(r.I)), y, 8, C.accent);
      labelCJK(ctx, Math.max(x0 + 40, Math.min(x1 - 40, X0(r.I))), y + 24, n2(r.I, 2) + ' mA', C.accent, 12, 'center', '700');
    }
  });

  window.__ch12Quiz([
    { zh: 'PSpice 為什麼不接受 Δ 接電源？', en: 'Why does PSpice have trouble with a Δ-connected source?',
      o: [['它是一圈電壓源', 'it is a loop of voltage sources'], ['頻率太低', 'the frequency is too low'], ['它是非線性元件', 'it is nonlinear'], ['它沒有相序', 'it has no phase sequence']], a: 0,
      e: '迴路裡只有電壓源，方程式無解或不唯一 → 每顆串 1 μΩ。' },
    { zh: 'Δ 電源沒有接地點，PSpice 的標準做法？', en: 'The standard PSpice fix for the missing ground node of a Δ source is to:',
      o: [['加三個 1 MΩ 接成 Y，中心點接地', 'add Y-connected 1 MΩ resistors and ground the center'], ['把 a 線接地', 'ground line a'], ['不接地也可以', 'skip grounding'], ['串一個大電容', 'add a large capacitor']], a: 0,
      e: '大電阻幾乎不分走電流，又提供 0 節點。' },
    { zh: '題目只給 j5 Ω，PSpice 設 ω = 1 rad/s 時電感要填？', en: 'If an impedance of j5 Ω is given and ω = 1 rad/s is chosen, the inductance entered is:',
      o: [['5 H', '5 H'], ['0.2 H', '0.2 H'], ['5/(2π) H', '5/(2π) H'], ['31.4 H', '31.4 H']], a: 0,
      e: 'L = X/ω = 5/1 = 5 H。' },
    { zh: '三瓦特計法的適用範圍？', en: 'The three-wattmeter method works for:',
      o: [['平衡或不平衡、Y 或 Δ 都可以', 'balanced or unbalanced, Y or Δ'], ['只有平衡 Y', 'balanced Y only'], ['只有 Δ', 'Δ only'], ['只有純電阻', 'resistive loads only']], a: 0,
      e: '課本 12.10.1：regardless of whether the load is balanced or unbalanced, wye- or delta-connected。' },
    { zh: '兩瓦特計法中，總實功率等於？', en: 'In the two-wattmeter method, the total real power is:',
      o: [['P<sub>1</sub> + P<sub>2</sub>', 'P<sub>1</sub> + P<sub>2</sub>'], ['P<sub>2</sub> − P<sub>1</sub>', 'P<sub>2</sub> − P<sub>1</sub>'], ['√3(P<sub>1</sub> + P<sub>2</sub>)', '√3(P<sub>1</sub> + P<sub>2</sub>)'], ['3P<sub>1</sub>', '3P<sub>1</sub>']], a: 0,
      e: '式 12.62，平衡不平衡都成立（三線式）。' },
    { zh: '平衡負載，兩瓦特計讀數 P<sub>2</sub> &gt; P<sub>1</sub>，負載是？', en: 'For a balanced load with P<sub>2</sub> &gt; P<sub>1</sub>, the load is:',
      o: [['電感性', 'inductive'], ['電容性', 'capacitive'], ['純電阻', 'resistive'], ['無法判斷', 'undetermined']], a: 0,
      e: 'Q<sub>T</sub> = √3(P<sub>2</sub> − P<sub>1</sub>) &gt; 0。' },
    { zh: '平衡負載的總虛功率（兩瓦特計）？', en: 'For a balanced load, the total reactive power from the two readings is:',
      o: [['√3(P<sub>2</sub> − P<sub>1</sub>)', '√3(P<sub>2</sub> − P<sub>1</sub>)'], ['P<sub>2</sub> − P<sub>1</sub>', 'P<sub>2</sub> − P<sub>1</sub>'], ['√3(P<sub>1</sub> + P<sub>2</sub>)', '√3(P<sub>1</sub> + P<sub>2</sub>)'], ['(P<sub>2</sub> − P<sub>1</sub>)/√3', '(P<sub>2</sub> − P<sub>1</sub>)/√3']], a: 0,
      e: '式 12.69。' },
    { zh: '某一個瓦特計讀到負值，最可能的原因？', en: 'One wattmeter reads a negative value. The most likely reason is:',
      o: [['負載角超過 60°', 'the load angle exceeds 60°'], ['接線接錯', 'wrong wiring'], ['瓦特計壞了', 'a faulty meter'], ['負載是純電阻', 'the load is resistive']], a: 0,
      e: 'P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ + 30°)，θ &gt; 60° 時 cos 變負。照樣代數相加。' },
    { zh: '美國家用 120/240 V，兩條火線之間 240 V 的原因？', en: 'Why is there 240 V between the two hot wires in the US 120/240-V system?',
      o: [['兩個 120 V 相位相反', 'the two 120-V voltages are opposite in phase'], ['它是三相，√3 × 120 ≈ 208', 'it is three-phase'], ['變壓器升壓', 'a step-up transformer'], ['兩條線並聯', 'the wires are in parallel']], a: 0,
      e: 'V<sub>R</sub> = −V<sub>B</sub>，V<sub>BR</sub> = 2V<sub>B</sub> = 240 V（式 12.72）。' },
    { zh: 'GFCI（漏電斷路器）在什麼時候跳脫？', en: 'A GFCI trips when:',
      o: [['i<sub>R</sub> + i<sub>W</sub> + i<sub>B</sub> ≠ 0', 'i<sub>R</sub> + i<sub>W</sub> + i<sub>B</sub> ≠ 0'], ['電壓高於 120 V', 'the voltage exceeds 120 V'], ['電流大於 15 A', 'the current exceeds 15 A'], ['頻率改變', 'the frequency changes']], a: 0,
      e: '有電流沒回來（例如經過人體流進大地），出去和回來就對不上。' }
  ], ['CH12 全部完成！去總複習頁把 80 題觀念填充刷一遍。',
      '量測的公式差不多了，回去拉一下兩瓦特計的負載角，看 P₁ 什麼時候變負。',
      '先回故事模式看兩瓦特計那幾段，再做一次。']);
})();
