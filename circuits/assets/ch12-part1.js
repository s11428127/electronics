/* ============================================================
   電路學 CH12 PART 1（12.1 三相、12.2 平衡電壓與相序、12.3 Y-Y）
   可互動例題 + 觀念小測驗。互動模組（cv-gen、cv-seq、cv-vl）在 ch12.js。
   預設數字 = 課本 Example 12.1、Practice 12.1、Example 12.2、Practice 12.2
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  const { C, label, labelCJK, liveExample, lerp } = E;
  const RAD = Math.PI / 180;
  const n2 = (x, d) => X.num(x, d === undefined ? 2 : d);
  const sgn = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°';
  const A = d => '∠' + n2(X.wrap(d), 2).replace(/\.00$/, '') + '°';
  const PH = () => [C.accent, C['q-react'], C.ink];

  /* 小相量圖：vs = [{m, a, c, l}]，自動縮放 */
  function phasors(ctx, w, h, vs, opt) {
    opt = opt || {};
    const cx = opt.cx || w / 2, cy = h / 2, R = Math.max(10, Math.min(h / 2 - 18, (opt.rw || w / 2) - 40));
    const big = Math.max(...vs.map(v => v.m), 1e-9);
    E.axes12(ctx, cx, cy, R + 8);
    vs.forEach(v => E.vec12(ctx, cx, cy, v.m / big * R, v.a, v.c, v.l, v.w || 2.2));
  }

  /* ── 12.1：某一瞬間三相電壓相加 ───────────────────────── */
  liveExample('#ex-sum', {
    title: '例題 · 任一瞬間三相電壓加起來都是 0（自編練習）',
    ratio: 0.3, minH: 150, maxH: 200,
    givens: [
      { id: 'xs-vm', label: '振幅 V<sub>m</sub>', min: 50, max: 340, step: 10, value: 200, fmt: v => v + ' V' },
      { id: 'xs-t', label: '時刻 ωt', min: 0, max: 360, step: 5, value: 40, fmt: v => v + '°' }
    ],
    compute: g => {
      const Vm = g['xs-vm'], t = g['xs-t'];
      const a = Vm * Math.cos(t * RAD), b = Vm * Math.cos((t - 120) * RAD), c = Vm * Math.cos((t + 120) * RAD);
      return { Vm, t, a, b, c, s: a + b + c };
    },
    question: (g, r) => '三相電壓 v<sub>an</sub> = ' + r.Vm + ' cos ωt、v<sub>bn</sub> = ' + r.Vm + ' cos(ωt − 120°)、v<sub>cn</sub> = ' + r.Vm + ' cos(ωt + 120°) V。在 ωt = ' + r.t + '° 那一瞬間，三個電壓各是多少？加起來呢？',
    questionEn: (g, r) => 'Three-phase voltages are v<sub>an</sub> = ' + r.Vm + ' cos ωt, v<sub>bn</sub> = ' + r.Vm + ' cos(ωt − 120°), v<sub>cn</sub> = ' + r.Vm + ' cos(ωt + 120°) V. At the instant ωt = ' + r.t + '°, find each voltage and their sum.',
    steps: (g, r) => [
      { t: 'Step 1　a 相。', eq: 'v<sub>an</sub> = ' + r.Vm + ' cos ' + r.t + '° = ' + n2(r.a) + ' V' },
      { t: 'Step 2　b 相（晚 120°）。', eq: 'v<sub>bn</sub> = ' + r.Vm + ' cos(' + r.t + '° − 120°) = ' + n2(r.b) + ' V' },
      { t: 'Step 3　c 相（早 120°）。', eq: 'v<sub>cn</sub> = ' + r.Vm + ' cos(' + r.t + '° + 120°) = ' + n2(r.c) + ' V' },
      { t: 'Step 4　相加。', eq: n2(r.a) + ' + (' + n2(r.b) + ') + (' + n2(r.c) + ') = ' + n2(Math.abs(r.s) < 0.005 ? 0 : r.s) + ' V',
        after: (Math.abs(r.a) >= Math.abs(r.b) && Math.abs(r.a) >= Math.abs(r.c) ? '這一瞬間 a 相最大，b、c 合起來剛好跟它反向一樣大。' : Math.abs(r.b) >= Math.abs(r.c) ? '這一瞬間 b 相最大，a、c 合起來剛好抵掉它。' : '這一瞬間 c 相最大，a、b 合起來剛好抵掉它。') + '不管 ωt 拉到哪裡都是 0：三條線可以共用一條回程線，而且回程線上沒有電流。' }
    ],
    answer: (g, r) => 'v<sub>an</sub> = ' + n2(r.a) + ' V，v<sub>bn</sub> = ' + n2(r.b) + ' V，v<sub>cn</sub> = ' + n2(r.c) + ' V，相加 = 0',
    draw: (ctx, w, h, g, r) => {
      const col = PH(), my = h / 2, k = (h / 2 - 22) / r.Vm, bw = Math.min(60, w / 8);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(20, my); ctx.lineTo(w - 20, my); ctx.stroke();
      [r.a, r.b, r.c, r.s].forEach((v, i) => {
        const x = w * (0.2 + i * 0.2) - bw / 2, hh = v * k;
        ctx.fillStyle = i < 3 ? col[i] : C.ink; ctx.globalAlpha = i < 3 ? 0.85 : 1;
        ctx.fillRect(x, hh >= 0 ? my - hh : my, bw, Math.max(Math.abs(hh), i === 3 ? 2 : 0)); ctx.globalAlpha = 1;
        labelCJK(ctx, x + bw / 2, hh >= 0 ? my - hh - 9 : my - hh + 10, n2(Math.abs(v) < 0.005 ? 0 : v, 1), i < 3 ? col[i] : C.ink, 11, 'center', '700');
        label(ctx, x + bw / 2, h - 8, ['v<sub>an</sub>', 'v<sub>bn</sub>', 'v<sub>cn</sub>', '相加'][i] || '', i < 3 ? col[i] : C.ink, 11, 'center', '700');
      });
      labelCJK(ctx, w * 0.8, h - 8, '相加', C.ink, 11, 'center', '700');
    }
  });

  /* ── 12.2：判斷相序（課本 Example 12.1） ────────────────── */
  liveExample('#ex-seq', {
    title: '例題 · 判斷相序（課本 Example 12.1）',
    ratio: 0.42, minH: 190, maxH: 250,
    givens: [
      { id: 'xq-a', label: 'v<sub>an</sub> 的相角', min: -360, max: 360, step: 10, value: 10, fmt: sgn },
      { id: 'xq-b', label: 'v<sub>bn</sub> 的相角', min: -360, max: 360, step: 10, value: -230, fmt: sgn },
      { id: 'xq-c', label: 'v<sub>cn</sub> 的相角', min: -360, max: 360, step: 10, value: -110, fmt: sgn }
    ],
    compute: g => {
      const a = g['xq-a'], b = g['xq-b'], c = g['xq-c'];
      const db = X.wrap(a - b), dc = X.wrap(a - c);     /* 正 = 比 a 晚 */
      let kind = 'none';
      if (Math.abs(db - 120) < 0.5 && Math.abs(dc + 120) < 0.5) kind = 'abc';
      else if (Math.abs(dc - 120) < 0.5 && Math.abs(db + 120) < 0.5) kind = 'acb';
      return { a, b, c, A: X.wrap(a), B: X.wrap(b), Cc: X.wrap(c), db, dc, kind };
    },
    question: (g, r) => '判斷這組電壓的相序：v<sub>an</sub> = 200 cos(ωt ' + (r.a < 0 ? '− ' : '+ ') + Math.abs(r.a) + '°)、v<sub>bn</sub> = 200 cos(ωt ' + (r.b < 0 ? '− ' : '+ ') + Math.abs(r.b) + '°)、v<sub>cn</sub> = 200 cos(ωt ' + (r.c < 0 ? '− ' : '+ ') + Math.abs(r.c) + '°)。',
    questionEn: (g, r) => 'Determine the phase sequence of the set of voltages v<sub>an</sub> = 200 cos(ωt ' + (r.a < 0 ? '− ' : '+ ') + Math.abs(r.a) + '°), v<sub>bn</sub> = 200 cos(ωt ' + (r.b < 0 ? '− ' : '+ ') + Math.abs(r.b) + '°), v<sub>cn</sub> = 200 cos(ωt ' + (r.c < 0 ? '− ' : '+ ') + Math.abs(r.c) + '°).',
    steps: (g, r) => [
      { t: 'Step 1　換成相量，角度換到 −180°～180°。', eq: 'V<sub>an</sub> = 200' + A(r.a) + '、V<sub>bn</sub> = 200' + A(r.b) + '、V<sub>cn</sub> = 200' + A(r.c) },
      { t: 'Step 2　b、c 各比 a 晚多少？', eq: 'θ<sub>a</sub> − θ<sub>b</sub> = ' + n2(r.db, 0) + '°，θ<sub>a</sub> − θ<sub>c</sub> = ' + n2(r.dc, 0) + '°', note: '（正 = 比 a 晚，負 = 比 a 早）' },
      { t: 'Step 3　結論。', eq: r.kind === 'abc' ? 'b 比 a 晚 120° → a → b → c → <b>abc（正相序）</b>' : r.kind === 'acb' ? 'c 比 a 晚 120° → a → c → b → <b>acb（負相序）</b>' : '沒有剛好差 ±120° → <b>不是平衡三相</b>（沒有相序可言）',
        after: r.kind === 'none' ? '平衡三相的三個角度一定兩兩差 120°。把滑桿拉回 10°、−230°、−110° 試試。' : '把 b、c 兩個角度對調，相序就會反過來 —— 三相馬達把兩條線對調就倒轉，就是這個原因。' }
    ],
    answer: (g, r) => r.kind === 'abc' ? 'abc（正相序）' : r.kind === 'acb' ? 'acb（負相序）' : '不是平衡三相電壓',
    draw: (ctx, w, h, g, r) => {
      const col = PH();
      phasors(ctx, w, h, [{ m: 1, a: r.A, c: col[0], l: 'V<sub>an</sub>' }, { m: 1, a: r.B, c: col[1], l: 'V<sub>bn</sub>' }, { m: 1, a: r.Cc, c: col[2], l: 'V<sub>cn</sub>' }], { cx: w * 0.36, rw: w * 0.3 });
      labelCJK(ctx, w * 0.68, h * 0.4, r.kind === 'abc' ? 'abc 正相序' : r.kind === 'acb' ? 'acb 負相序' : '不是平衡三相', r.kind === 'none' ? C.bad : C.accent, 15, 'left', '700');
      labelCJK(ctx, w * 0.68, h * 0.4 + 24, '逆時針轉，角度大的先到', C['ink-3'], 11.5, 'left');
    }
  });

  /* ── 12.2：由一相推另外兩相（課本 Practice 12.1） ───────── */
  liveExample('#ex-from1', {
    title: '例題 · 知道一相，推另外兩相（課本 Practice 12.1）',
    ratio: 0.38, minH: 180, maxH: 240,
    givens: [
      { id: 'xf-v', label: '|V<sub>bn</sub>|', min: 50, max: 240, step: 10, value: 110, fmt: v => v + ' V' },
      { id: 'xf-t', label: 'V<sub>bn</sub> 的角度', min: -180, max: 180, step: 5, value: 30, fmt: sgn },
      { id: 'xf-s', label: '相序（0 = abc、1 = acb）', min: 0, max: 1, step: 1, value: 0, fmt: v => v ? 'acb' : 'abc' }
    ],
    compute: g => {
      const V = g['xf-v'], t = g['xf-t'], acb = g['xf-s'] === 1;
      return { V, t, acb, ta: acb ? t - 120 : t + 120, tc: acb ? t + 120 : t - 120 };
    },
    question: (g, r) => '已知 V<sub>bn</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° V，假設' + (r.acb ? '負相序（acb）' : '正相序（abc）') + '，求 V<sub>an</sub> 與 V<sub>cn</sub>。',
    questionEn: (g, r) => 'Given that V<sub>bn</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° V, find V<sub>an</sub> and V<sub>cn</sub>, assuming a ' + (r.acb ? 'negative (acb)' : 'positive (abc)') + ' sequence.',
    steps: (g, r) => [
      { t: 'Step 1　' + (r.acb ? 'acb：a → c → b，b 比 a 晚 240°（= 早 120°）。' : 'abc：a → b → c，b 比 a 晚 120°。'), eq: r.acb ? 'V<sub>bn</sub> = V<sub>an</sub>∠+120°　⟹　V<sub>an</sub> = V<sub>bn</sub>∠−120°' : 'V<sub>bn</sub> = V<sub>an</sub>∠−120°　⟹　V<sub>an</sub> = V<sub>bn</sub>∠+120°' },
      { t: 'Step 2　V<sub>an</sub>。', eq: 'V<sub>an</sub> = ' + r.V + '∠(' + n2(r.t, 0) + '° ' + (r.acb ? '−' : '+') + ' 120°) = ' + r.V + A(r.ta) + ' V' },
      { t: 'Step 3　V<sub>cn</sub>。', eq: 'V<sub>cn</sub> = ' + r.V + '∠(' + n2(r.t, 0) + '° ' + (r.acb ? '+' : '−') + ' 120°) = ' + r.V + A(r.tc) + ' V',
        after: '三個大小都是 ' + r.V + ' V、兩兩差 120°。' + (r.acb ? '跟 abc 比，只是 a、c 兩個答案對調。' : '') }
    ],
    answer: (g, r) => 'V<sub>an</sub> = ' + r.V + A(r.ta) + ' V，V<sub>cn</sub> = ' + r.V + A(r.tc) + ' V',
    draw: (ctx, w, h, g, r) => {
      const col = PH();
      phasors(ctx, w, h, [{ m: 1, a: r.ta, c: col[0], l: 'V<sub>an</sub>' }, { m: 1, a: r.t, c: col[1], l: 'V<sub>bn</sub>（已知）' }, { m: 1, a: r.tc, c: col[2], l: 'V<sub>cn</sub>' }]);
    }
  });

  /* ── 12.3：Y-Y 線電流（課本 Example 12.2） ──────────────── */
  liveExample('#ex-yy', {
    title: '例題 · 三線式 Y-Y 的線電流（課本 Example 12.2）',
    ratio: 0.4, minH: 190, maxH: 250,
    givens: [
      { id: 'xy-v', label: '相電壓 V<sub>p</sub>', min: 50, max: 240, step: 5, value: 110, fmt: v => v + ' V' },
      { id: 'xy-lr', label: '線路電阻', min: 0, max: 20, step: 0.5, value: 5, fmt: v => v + ' Ω' },
      { id: 'xy-lx', label: '線路電抗', min: -10, max: 10, step: 0.5, value: -2, fmt: v => (v < 0 ? '−j' : 'j') + Math.abs(v) + ' Ω' },
      { id: 'xy-r', label: '負載電阻', min: 1, max: 50, step: 1, value: 10, fmt: v => v + ' Ω' },
      { id: 'xy-x', label: '負載電抗', min: -30, max: 30, step: 1, value: 8, fmt: v => (v < 0 ? '−j' : 'j') + Math.abs(v) + ' Ω' }
    ],
    compute: g => {
      const Vp = g['xy-v'], Zl = X.c(g['xy-lr'], g['xy-lx']), ZL = X.c(g['xy-r'], g['xy-x']), ZY = X.add(Zl, ZL);
      const Ia = X.div(X.c(Vp, 0), ZY), I0 = X.div(X.c(Vp, 0), ZL);
      return { Vp, Zl, ZL, ZY, Ia, I0, ang: X.ang(Ia) };
    },
    question: (g, r) => '平衡三線式 Y-Y 系統：正相序電源 V<sub>an</sub> = ' + r.Vp + '∠0° V，每條線的線路阻抗 ' + X.rect(r.Zl, 1) + ' Ω，Y 接負載每相 ' + X.rect(r.ZL, 0) + ' Ω。求三個線電流。',
    questionEn: (g, r) => 'In a balanced three-wire Y-Y system, the positive-sequence source has V<sub>an</sub> = ' + r.Vp + '∠0° V, each line has an impedance of ' + X.rect(r.Zl, 1) + ' Ω, and the Y-connected load has ' + X.rect(r.ZL, 0) + ' Ω per phase. Calculate the line currents.',
    steps: (g, r) => [
      { t: 'Step 1　平衡 → 單相等效（只算 a 相）。', note: 'n、N 同電位，a 相自己成一個迴路。', eq: 'I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>' },
      { t: 'Step 2　線路和負載串聯。', eq: 'Z<sub>Y</sub> = (' + X.rect(r.Zl, 1) + ') + (' + X.rect(r.ZL, 0) + ') = ' + X.rect(r.ZY, 1) + ' = ' + X.pol(r.ZY, 5) + ' Ω' },
      { t: 'Step 3　歐姆定律。', eq: 'I<sub>a</sub> = ' + r.Vp + '∠0° ÷ ' + X.pol(r.ZY, 5) + ' = ' + X.pol(r.Ia, 3, 1) + ' A',
        after: r.ang < -0.5 ? '電流落後電壓 ' + n2(-r.ang, 1) + '°：整體偏電感性。' : r.ang > 0.5 ? '電流超前電壓 ' + n2(r.ang, 1) + '°：整體偏電容性。' : '電流跟電壓同相：電抗剛好抵消。' },
      { t: 'Step 4　正相序補齊。', eq: 'I<sub>b</sub> = I<sub>a</sub>∠−120° = ' + X.pol(X.mul(r.Ia, X.p(1, -120)), 3, 1) + ' A，I<sub>c</sub> = I<sub>a</sub>∠+120° = ' + X.pol(X.mul(r.Ia, X.p(1, 120)), 3, 1) + ' A' },
      { t: '對照　如果忽略線路阻抗：', eq: 'I<sub>a</sub> = ' + r.Vp + ' ÷ ' + X.pol(r.ZL, 4) + ' = ' + X.pol(r.I0, 3, 1) + ' A',
        after: X.mag(r.Zl) < 1e-9 ? '線路阻抗是 0，兩個答案一樣。' : '差了 ' + n2(Math.abs(1 - X.mag(r.Ia) / X.mag(r.I0)) * 100, 1) + '% —— 線路阻抗' + (X.mag(r.Zl) / X.mag(r.ZL) > 0.2 ? '佔的比例很大，不能忽略。' : '比負載小很多，忽略的話誤差不大（課本說沒給就當 0）。') }
    ],
    answer: (g, r) => 'I<sub>a</sub> = ' + X.pol(r.Ia, 3, 1) + ' A，I<sub>b</sub> = ' + X.pol(X.mul(r.Ia, X.p(1, -120)), 3, 1) + ' A，I<sub>c</sub> = ' + X.pol(X.mul(r.Ia, X.p(1, 120)), 3, 1) + ' A',
    draw: (ctx, w, h, g, r) => {
      const col = PH(), cx = w * 0.32, cy = h / 2, R = Math.max(10, Math.min(h / 2 - 18, w * 0.25));
      E.axes12(ctx, cx, cy, R + 8);
      E.vec12(ctx, cx, cy, R, 0, C.ink, 'V<sub>an</sub>', 1.8);
      const m = X.mag(r.Ia), k = R * 0.75 / Math.max(m, 1e-9);
      [0, -120, 120].forEach((d, i) => E.vec12(ctx, cx, cy, m * k, r.ang + d, col[i], 'I' + '<sub>' + 'abc'[i] + '</sub>', 2.4));
      labelCJK(ctx, w * 0.62, h * 0.35, '|I| = ' + n2(m, 2) + ' A', C.accent, 14, 'left', '700');
      labelCJK(ctx, w * 0.62, h * 0.35 + 24, '三個一樣長、差 120°', C['ink-2'], 11.5, 'left');
      labelCJK(ctx, w * 0.62, h * 0.35 + 46, '→ 加起來 0，中性線沒電流', C['ink-2'], 11.5, 'left');
    }
  });

  /* ── 12.3：線電壓（課本 Practice 12.2 (a)） ──────────────── */
  liveExample('#ex-vl', {
    title: '例題 · 由相電壓求線電壓（課本 Practice 12.2 (a)）',
    ratio: 0.42, minH: 190, maxH: 250,
    givens: [
      { id: 'xv-v', label: '|V<sub>an</sub>|', min: 50, max: 280, step: 5, value: 120, fmt: v => v + ' V' },
      { id: 'xv-t', label: 'V<sub>an</sub> 的角度', min: -180, max: 180, step: 5, value: 30, fmt: sgn },
      { id: 'xv-s', label: '相序（0 = abc、1 = acb）', min: 0, max: 1, step: 1, value: 0, fmt: v => v ? 'acb' : 'abc' }
    ],
    compute: g => {
      const V = g['xv-v'], t = g['xv-t'], acb = g['xv-s'] === 1, VL = Math.sqrt(3) * V;
      const tab = acb ? t - 30 : t + 30;
      return { V, t, acb, VL, tab, tbc: acb ? tab + 120 : tab - 120, tca: acb ? tab - 120 : tab + 120 };
    },
    question: (g, r) => 'Y 接平衡電源，' + (r.acb ? '負相序（acb）' : '正相序（abc）') + '，V<sub>an</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° V。求三個線電壓。',
    questionEn: (g, r) => 'A balanced Y-connected source has V<sub>an</sub> = ' + r.V + '∠' + n2(r.t, 0) + '° V in the ' + (r.acb ? 'negative (acb)' : 'positive (abc)') + ' sequence. Find the line voltages.',
    steps: (g, r) => [
      { t: 'Step 1　線電壓 = 兩個相電壓相減。', eq: 'V<sub>ab</sub> = V<sub>an</sub> − V<sub>bn</sub>' },
      { t: 'Step 2　大小 √3 倍、角度' + (r.acb ? '落後' : '超前') + ' 30°。', eq: 'V<sub>ab</sub> = √3 × ' + r.V + '∠(' + n2(r.t, 0) + '° ' + (r.acb ? '−' : '+') + ' 30°) = ' + n2(r.VL, 1) + A(r.tab) + ' V',
        after: r.acb ? 'acb 時 V<sub>bn</sub> 在 V<sub>an</sub> 的前面（+120°），相減的結果往後轉 30°。' : 'abc 時線電壓超前 30°（課本式 12.11a）。' },
      { t: 'Step 3　另外兩條照相序。', eq: 'V<sub>bc</sub> = ' + n2(r.VL, 1) + A(r.tbc) + ' V，V<sub>ca</sub> = ' + n2(r.VL, 1) + A(r.tca) + ' V' }
    ],
    answer: (g, r) => 'V<sub>ab</sub> = ' + n2(r.VL, 1) + A(r.tab) + ' V，V<sub>bc</sub> = ' + n2(r.VL, 1) + A(r.tbc) + ' V，V<sub>ca</sub> = ' + n2(r.VL, 1) + A(r.tca) + ' V',
    draw: (ctx, w, h, g, r) => {
      const col = PH(), cx = w * 0.4, cy = h / 2, R = Math.max(10, Math.min(h / 2 - 20, w * 0.3)) / Math.sqrt(3);
      E.axes12(ctx, cx, cy, R * 1.9);
      const tb = r.acb ? r.t + 120 : r.t - 120, tc = r.acb ? r.t - 120 : r.t + 120;
      E.vec12(ctx, cx, cy, R, r.t, col[0], 'V<sub>an</sub>', 2); E.vec12(ctx, cx, cy, R, tb, col[1], 'V<sub>bn</sub>', 2); E.vec12(ctx, cx, cy, R, tc, col[2], 'V<sub>cn</sub>', 2);
      E.vec12(ctx, cx, cy, R * Math.sqrt(3), r.tab, C.ink, 'V<sub>ab</sub>', 3);
      labelCJK(ctx, w * 0.72, h * 0.42, 'V<sub>L</sub> = ' + n2(r.VL, 1) + ' V', C.ink, 14, 'left', '700');
      labelCJK(ctx, w * 0.72, h * 0.42 + 22, '= √3 × ' + r.V + ' V', C['ink-2'], 11.5, 'left');
    }
  });

  /* ── 觀念小測驗 ─────────────────────────────────────────── */
  window.__ch12Quiz([
    { zh: '平衡三相電壓的三個相電壓，彼此相差多少度？', en: 'In a balanced three-phase set, the phase voltages are out of phase with each other by:',
      o: [['120°', '120°'], ['90°', '90°'], ['60°', '60°'], ['180°', '180°']], a: 0,
      e: '360° 平分成三份，每兩相差 120°。差 90° 的是兩相系統。' },
    { zh: '平衡三相電壓 V<sub>an</sub> + V<sub>bn</sub> + V<sub>cn</sub> 等於？', en: 'For balanced three-phase voltages, V<sub>an</sub> + V<sub>bn</sub> + V<sub>cn</sub> equals:',
      o: [['0', 'zero'], ['3V<sub>p</sub>', '3V<sub>p</sub>'], ['√3 V<sub>p</sub>', '√3 V<sub>p</sub>'], ['V<sub>p</sub>', 'V<sub>p</sub>']], a: 0,
      e: '三支一樣長、差 120° 的箭頭頭尾相接圍成正三角形，回到原點。時間式也是每一瞬間相加 = 0。' },
    { zh: 'V<sub>an</sub> = 220∠−100°、V<sub>bn</sub> = 220∠140° 的三相馬達，相序是？（課本 Review 12.1）', en: 'What is the phase sequence of a three-phase motor for which V<sub>AN</sub> = 220∠−100° V and V<sub>BN</sub> = 220∠140° V?',
      o: [['abc', 'abc'], ['acb', 'acb'], ['無法判斷', 'cannot be determined'], ['不是三相', 'not three-phase']], a: 0,
      e: '140° 換成同一圈是 −220°，剛好比 −100° 晚 120°：V<sub>BN</sub> = V<sub>AN</sub>∠−120° → b 是第二個 → abc。' },
    { zh: 'acb 相序、V<sub>an</sub> = 100∠−20°，則 V<sub>cn</sub> = ？（課本 Review 12.2）', en: 'If in an acb phase sequence, V<sub>an</sub> = 100∠−20°, then V<sub>cn</sub> is:',
      o: [['100∠−140°', '100∠−140°'], ['100∠100°', '100∠100°'], ['100∠−50°', '100∠−50°'], ['100∠10°', '100∠10°']], a: 0,
      e: 'acb：c 比 a 晚 120° → −20° − 120° = −140°。' },
    { zh: '平衡 Δ 負載換成等效 Y 負載，每相阻抗變成？', en: 'When a balanced Δ load is converted to an equivalent Y load, the impedance per phase becomes:',
      o: [['Z<sub>Δ</sub>/3', 'Z<sub>Δ</sub>/3'], ['3Z<sub>Δ</sub>', '3Z<sub>Δ</sub>'], ['Z<sub>Δ</sub>/√3', 'Z<sub>Δ</sub>/√3'], ['不變', 'unchanged']], a: 0,
      e: 'Z<sub>Y</sub> = Z<sub>Δ</sub><sup>2</sup>/(3Z<sub>Δ</sub>) = Z<sub>Δ</sub>/3。Y 比較小。' },
    { zh: '平衡 Y 接、abc 相序，線電壓 V<sub>ab</sub> 跟相電壓 V<sub>an</sub> 的關係？', en: 'For a balanced Y connection with abc sequence, the line voltage V<sub>ab</sub> relates to V<sub>an</sub> as:',
      o: [['√3 倍、超前 30°', '√3 times, leading by 30°'], ['√3 倍、落後 30°', '√3 times, lagging by 30°'], ['3 倍、同相', '3 times, in phase'], ['相等', 'equal']], a: 0,
      e: 'V<sub>ab</sub> = V<sub>an</sub> − V<sub>bn</sub> = √3 V<sub>p</sub>∠30°。' },
    { zh: '平衡 Y-Y 系統的中性線電流 I<sub>n</sub> 是？', en: 'In a balanced Y-Y system, the neutral current I<sub>n</sub> is:',
      o: [['0', 'zero'], ['等於線電流', 'equal to the line current'], ['線電流的 3 倍', 'three times the line current'], ['線電流的 √3 倍', '√3 times the line current']], a: 0,
      e: 'I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>) = 0：三個電流只差 120°，加起來抵消。所以中性線可以拿掉。' },
    { zh: '下列哪一個「不是」平衡系統的必要條件？（課本 Review 12.3）', en: 'Which of these is not a required condition for a balanced system?',
      o: [['I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub> = 0', 'I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub> = 0'], ['|V<sub>an</sub>| = |V<sub>bn</sub>| = |V<sub>cn</sub>|', '|V<sub>an</sub>| = |V<sub>bn</sub>| = |V<sub>cn</sub>|'], ['電源彼此差 120°', 'source voltages 120° out of phase'], ['三相負載阻抗相等', 'load impedances equal']], a: 0,
      e: 'I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub> = 0 是平衡的「結果」，而且不平衡的三線式也會滿足（沒有中性線，KCL 強迫它 = 0）。平衡的條件是電源等大差 120°、負載相等。' },
    { zh: '平衡 Y-Y 每相的總阻抗 Z<sub>Y</sub> 怎麼算？', en: 'In a balanced Y-Y system, the total impedance per phase Z<sub>Y</sub> is:',
      o: [['Z<sub>s</sub> + Z<sub>ℓ</sub> + Z<sub>L</sub>', 'Z<sub>s</sub> + Z<sub>ℓ</sub> + Z<sub>L</sub>'], ['只有 Z<sub>L</sub>', 'Z<sub>L</sub> only'], ['Z<sub>s</sub> ∥ Z<sub>ℓ</sub> ∥ Z<sub>L</sub>', 'Z<sub>s</sub> ∥ Z<sub>ℓ</sub> ∥ Z<sub>L</sub>'], ['3Z<sub>L</sub>', '3Z<sub>L</sub>']], a: 0,
      e: '發電機內阻、線路、負載在同一相上一路串著，直接相加（式 12.9）。' },
    { zh: '三相的「220 V」通常是指線電壓。Y 接時每相的相電壓約為？', en: 'A three-phase "220 V" usually refers to the line voltage. For a Y connection, the phase voltage is about:',
      o: [['127 V', '127 V'], ['220 V', '220 V'], ['381 V', '381 V'], ['73 V', '73 V']], a: 0,
      e: 'V<sub>p</sub> = V<sub>L</sub>/√3 = 220/1.732 = 127 V。381 是乘 √3 的錯誤做法。' }
  ], ['三相的基本功很穩，可以去 PART 2 學 Δ 接法了。',
      '大方向對了，把答錯的題目回去看「線電壓 = 兩相相減」那個互動。',
      '建議先回頭看故事模式的「加起來 = 0」和「線電壓」兩段，再把例題的數字拉一拉。']);
})();
