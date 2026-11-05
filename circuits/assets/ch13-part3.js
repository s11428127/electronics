/* ============================================================
   電路學 CH13 PART 3（13.6 自耦、13.7 三相變壓器、13.9 應用）
   互動模組：cv-auto（抽頭位置與功率分配）、cv-3ph（四種接法的線電壓線電流）、cv-line（輸電電壓與線損）
   可互動例題：Example 13.11、13.12、13.16；觀念小測驗
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  if (!E || !X) return;
  const { C, Stage, label, labelCJK, liveExample, bindRange, setText } = E;
  const r3 = Math.sqrt(3);
  function bars(ctx, w, h, rows, x0) {
    const L = w - x0 - 100, rh = (h - 10) / rows.length;
    rows.forEach((r, i) => {
      const y = 6 + rh * i, len = Math.max(2, r[1] / r[4] * L);
      labelCJK(ctx, 8, y + rh * 0.55, r[0], r[3], 12.5, 'left', '700');
      ctx.fillStyle = r[3]; ctx.fillRect(x0, y + rh * 0.22, len, rh * 0.5);
      label(ctx, x0 + len + 6, y + rh * 0.55, r[2], r[3], 12, 'left', '700');
    });
  }

  /* ── 13.6 自耦 ── */
  (function auto() {
    const cv = document.getElementById('cv-auto'); if (!cv) return;
    let a = 0.4, up = false, S = 5000; const V1 = 400;
    const mb = document.getElementById('au-mode');
    const st = Stage(cv, { animate: false, ratio: 0.42, minH: 220, maxH: 300, draw(ctx, w, h) {
      /* a = 抽頭比例：降壓時 V2 = a V1；升壓時 V2 = V1 / a */
      const V2 = up ? V1 / a : V1 * a, I1 = S / V1, I2 = S / V2, Io = Math.abs(I2 - I1);
      const Smag = up ? (V2 - V1) * I2 : (V1 - V2) * I1;   /* 真正經過磁通「變壓」的那部分 = 非共用段的功率 */
      const vm = Math.max(V1, V2), im = Math.max(I1, I2);
      bars(ctx, w, h, [
        ['V₁', V1, V1 + ' V', C.ink, vm], ['V₂', V2, X.g(V2, 4) + ' V', C.accent, vm],
        ['I₁', I1, X.g(I1, 4) + ' A', C.ink, im], ['I₂', I2, X.g(I2, 4) + ' A', C.accent, im],
        ['共用段 I<sub>o</sub>', Io, X.g(Io, 4) + ' A', C['ink-3'], im],
        ['經過磁通的功率', Smag, X.g(Smag, 4) + ' VA', C.bad, S], ['總功率', S, S + ' VA', C.accent, S]
      ], w < 520 ? 110 : 150);
      setText('au-v2', X.g(V2, 4) + ' V'); setText('au-io', X.g(Io, 4) + ' A'); setText('au-frac', X.g(Smag / S * 100, 3) + '%');
    } });
    bindRange('au-a', v => Math.round(v * 100) + '%', v => { a = v; st.redraw(); });
    bindRange('au-s', v => v + ' VA', v => { S = v; st.redraw(); });
    if (mb) mb.addEventListener('click', () => { up = !up; mb.textContent = up ? '接法：升壓（輸入跨在抽頭那段）' : '接法：降壓（輸出跨在抽頭那段）'; st.redraw(); });
  })();

  /* ── 13.7 三相接法 ── */
  (function three() {
    const cv = document.getElementById('cv-3ph'); if (!cv) return;
    let kind = 'YD', n = 5, VLp = 83.14, S = 42000;
    const btns = Array.prototype.slice.call(document.querySelectorAll('[data-3ph]'));
    const st = Stage(cv, { animate: false, ratio: 0.4, minH: 210, maxH: 290, draw(ctx, w, h) {
      const kv = { YY: 1, DD: 1, YD: 1 / r3, DY: r3 }[kind], VLs = n * VLp * kv, ILp = S / (r3 * VLp), ILs = S / (r3 * VLs);
      const vm = Math.max(VLp, VLs), im = Math.max(ILp, ILs);
      bars(ctx, w, h, [['一次側線電壓 V<sub>Lp</sub>', VLp, X.g(VLp, 4) + ' V', C.ink, vm], ['二次側線電壓 V<sub>Ls</sub>', VLs, X.g(VLs, 4) + ' V', C.accent, vm],
        ['一次側線電流 I<sub>Lp</sub>', ILp, X.g(ILp, 4) + ' A', C.ink, im], ['二次側線電流 I<sub>Ls</sub>', ILs, X.g(ILs, 4) + ' A', C.accent, im]], w < 520 ? 140 : 190);
      setText('t3-f', { YY: 'V<sub>Ls</sub> = nV_Lp', DD: 'V<sub>Ls</sub> = nV_Lp', YD: 'V<sub>Ls</sub> = nV_Lp/√3', DY: 'V<sub>Ls</sub> = √3 nV_Lp' }[kind].replace(/_(\w+)/g, '<sub>$1</sub>'));
      setText('t3-each', X.g(S / 3000, 4) + ' kVA');
    } });
    btns.forEach(b => b.addEventListener('click', () => { kind = b.getAttribute('data-3ph'); btns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); st.redraw(); }));
    bindRange('t3-n', v => v, v => { n = v; st.redraw(); });
    bindRange('t3-v', v => v + ' V', v => { VLp = v; st.redraw(); });
  })();

  /* ── 13.9 輸電 ── */
  (function line() {
    const cv = document.getElementById('cv-line'); if (!cv) return;
    let lv = 3, R = 2; const S = 100000;
    const st = Stage(cv, { animate: false, ratio: 0.36, minH: 190, maxH: 260, draw(ctx, w, h) {
      const V = Math.pow(10, lv), I = S / V, P = I * I * R, pct = Math.min(100, P / S * 100);
      bars(ctx, w, h, [['線電流 I', I, X.g(I, 4) + ' A', C.ink, S / 1000], ['線損 I²R', Math.min(P, S), X.g(P, 4) + ' W', C.bad, S], ['送到的功率', Math.max(0, S - P), X.g(Math.max(0, S - P), 4) + ' W', C.accent, S]], w < 520 ? 110 : 140);
      setText('ln-v', X.g(V, 4) + ' V'); setText('ln-pct', X.g(pct, 3) + '%');
    } });
    bindRange('ln-lv', v => X.g(Math.pow(10, v), 3) + ' V', v => { lv = v; st.redraw(); });
    bindRange('ln-r', v => v + ' Ω', v => { R = v; st.redraw(); });
  })();

  /* ── Example 13.11 ── */
  liveExample('#ex-1311', {
    title: '例題 · 升壓自耦變壓器的三個電流（課本 Example 13.11）',
    ratio: 0.26, minH: 140, maxH: 190,
    givens: [
      { id: 'c1-n1', label: '下段 N<sub>1</sub>（接電源）', min: 20, max: 200, step: 10, value: 80, fmt: v => v + ' 匝' },
      { id: 'c1-n2', label: '上段 N<sub>2</sub>', min: 0, max: 300, step: 10, value: 120, fmt: v => v + ' 匝' },
      { id: 'c1-r', label: 'Z<sub>L</sub> 實部', min: 1, max: 30, step: 1, value: 8, fmt: v => v + ' Ω' },
      { id: 'c1-x', label: 'Z<sub>L</sub> 虛部', min: -20, max: 20, step: 1, value: 6, fmt: v => (v < 0 ? '−j' : 'j') + Math.abs(v) + ' Ω' }
    ],
    compute: g => {
      const N1 = g['c1-n1'], N2 = g['c1-n2'], ZL = X.c(g['c1-r'], g['c1-x']), V1 = X.p(120, 30);
      const V2 = X.sc(V1, (N1 + N2) / N1), I2 = X.div(V2, ZL), I1 = X.sc(I2, (N1 + N2) / N1), Io = X.sub(I2, I1), S2 = X.sc(ZL, Math.pow(X.mag(I2), 2));
      return { N1, N2, ZL, V2, I2, I1, Io, S2 };
    },
    question: (g, r) => '自耦變壓器：電源 120∠30° V rms 接在下段 ' + r.N1 + ' 匝，負載 Z<sub>L</sub> = ' + X.rect(r.ZL, 0) + ' Ω 跨在全部 ' + (r.N1 + r.N2) + ' 匝。求 I<sub>1</sub>、I<sub>2</sub>、I<sub>o</sub> 與負載複功率。',
    questionEn: (g, r) => 'An autotransformer has the 120∠30° V rms source across the lower ' + r.N1 + ' turns and Z<sub>L</sub> = ' + X.rect(r.ZL, 0) + ' Ω across all ' + (r.N1 + r.N2) + ' turns. Find I<sub>1</sub>, I<sub>2</sub>, I<sub>o</sub>, and the complex power supplied to the load.',
    steps: (g, r) => [
      { t: 'Step 1　V<sub>2</sub>（升壓）。', eq: 'V<sub>2</sub> = (' + (r.N1 + r.N2) + '/' + r.N1 + ') × 120∠30° = ' + X.pol(r.V2, 4, 2) + ' V', note: r.N2 === 0 ? 'N<sub>2</sub> = 0：沒有升壓，等於直接接上。' : '' },
      { t: 'Step 2　I<sub>2</sub>。', eq: 'I<sub>2</sub> = V<sub>2</sub>/Z<sub>L</sub> = ' + X.pol(r.I2, 4, 2) + ' A' },
      { t: 'Step 3　I<sub>1</sub>（電流反比）。', eq: 'I<sub>1</sub> = (' + (r.N1 + r.N2) + '/' + r.N1 + ')I<sub>2</sub> = ' + X.pol(r.I1, 4, 2) + ' A' },
      { t: 'Step 4　I<sub>o</sub>（抽頭 KCL）。', eq: 'I<sub>o</sub> = I<sub>2</sub> − I<sub>1</sub> = ' + X.pol(r.Io, 4, 2) + ' A' },
      { t: 'Step 5　複功率。', eq: 'S<sub>2</sub> = |I<sub>2</sub>|<sup>2</sup>Z<sub>L</sub> = ' + X.pol(r.S2, 4, 2) + ' VA' }
    ],
    answer: (g, r) => 'I<sub>1</sub> = ' + X.pol(r.I1, 4, 2) + ' A、I<sub>2</sub> = ' + X.pol(r.I2, 4, 2) + ' A、I<sub>o</sub> = ' + X.pol(r.Io, 4, 2) + ' A；S<sub>2</sub> = ' + X.pol(r.S2, 4, 2) + ' VA',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['I₁', X.mag(r.I1), X.g(X.mag(r.I1), 4) + ' A', C.ink, X.mag(r.I1)], ['I₂', X.mag(r.I2), X.g(X.mag(r.I2), 4) + ' A', C.accent, X.mag(r.I1)], ['|I<sub>o</sub>|', X.mag(r.Io), X.g(X.mag(r.Io), 4) + ' A', C['ink-3'], X.mag(r.I1)]], 80)
  });

  /* ── Example 13.12 ── */
  liveExample('#ex-1312', {
    title: '例題 · Y-Δ 三相變壓器（課本 Example 13.12）',
    ratio: 0.26, minH: 140, maxH: 190,
    givens: [
      { id: 'c2-s', label: '負載 S<sub>T</sub>', min: 6, max: 120, step: 3, value: 42, fmt: v => v + ' kVA' },
      { id: 'c2-v', label: '二次側線電壓 V<sub>Ls</sub>', min: 120, max: 480, step: 10, value: 240, fmt: v => v + ' V' },
      { id: 'c2-n', label: '匝數比 n（1 : n）', min: 1, max: 10, step: 0.5, value: 5, fmt: v => '1 : ' + v }
    ],
    compute: g => {
      const S = g['c2-s'] * 1000, VLs = g['c2-v'], n = g['c2-n'];
      const ILs = S / (r3 * VLs), ILp = n * ILs / r3, VLp = r3 * VLs / n;
      return { S, VLs, n, ILs, ILp, VLp, each: S / 3, Ips: ILs / r3 };
    },
    question: (g, r) => '平衡負載 ' + r.S / 1000 + ' kVA 由 Y-Δ 三相變壓器供電，匝數比 1 : ' + r.n + '、二次側線電壓 ' + r.VLs + ' V。求一次側線電壓、線電流，以及每個變壓器的 kVA 額定。',
    questionEn: (g, r) => 'A ' + r.S / 1000 + '-kVA balanced load is supplied by a Y-Δ three-phase transformer with turns ratio 1 : ' + r.n + ' and secondary line voltage ' + r.VLs + ' V. Find the primary line voltage and current, and the kVA rating of each transformer.',
    steps: (g, r) => [
      { t: 'Step 1　二次側線電流。', eq: 'I<sub>Ls</sub> = S<sub>T</sub>/(√3V<sub>Ls</sub>) = ' + X.g(r.ILs, 4) + ' A' },
      { t: 'Step 2　一次側線電流。', eq: 'I<sub>Lp</sub> = nI<sub>Ls</sub>/√3 = ' + X.g(r.ILp, 4) + ' A' },
      { t: 'Step 3　一次側線電壓。', eq: 'V<sub>Lp</sub> = √3V<sub>Ls</sub>/n = ' + X.g(r.VLp, 4) + ' V', note: r.VLp < r.VLs ? '一次側電壓比二次側低：這組是升壓。' : '一次側電壓比二次側高：這組是降壓。' },
      { t: 'Step 4　每個變壓器。', eq: 'S<sub>T</sub>/3 = ' + X.g(r.each / 1000, 4) + ' kVA（檢查：Δ 側每相 ' + r.VLs + ' V × ' + X.g(r.Ips, 4) + ' A）' }
    ],
    answer: (g, r) => 'V<sub>Lp</sub> = ' + X.g(r.VLp, 4) + ' V、I<sub>Lp</sub> = ' + X.g(r.ILp, 4) + ' A；每個 ' + X.g(r.each / 1000, 4) + ' kVA',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['V<sub>Lp</sub>', r.VLp, X.g(r.VLp, 4) + ' V', C.ink, Math.max(r.VLp, r.VLs)], ['V<sub>Ls</sub>', r.VLs, r.VLs + ' V', C.accent, Math.max(r.VLp, r.VLs)], ['I<sub>Lp</sub>', r.ILp, X.g(r.ILp, 4) + ' A', C.ink, Math.max(r.ILp, r.ILs)], ['I<sub>Ls</sub>', r.ILs, X.g(r.ILs, 4) + ' A', C.accent, Math.max(r.ILp, r.ILs)]], 70)
  });

  /* ── Example 13.16 ── */
  liveExample('#ex-1316', {
    title: '例題 · 喇叭的阻抗匹配（課本 Example 13.16）',
    ratio: 0.26, minH: 140, maxH: 190,
    givens: [
      { id: 'c6-s', label: '擴大機 Z<sub>Th</sub>', min: 4, max: 2000, step: 4, value: 192, fmt: v => v + ' Ω' },
      { id: 'c6-l', label: '喇叭 Z<sub>L</sub>', min: 2, max: 64, step: 1, value: 12, fmt: v => v + ' Ω' }
    ],
    compute: g => {
      const Rs = g['c6-s'], RL = g['c6-l'], n = Math.sqrt(RL / Rs);
      const P0 = RL / Math.pow(Rs + RL, 2) * 1e6, P1 = Math.pow(n / (n * n * Rs + RL), 2) * RL * 1e6;
      return { Rs, RL, n, P0, P1 };
    },
    question: (g, r) => '擴大機戴維寧阻抗 ' + r.Rs + ' Ω，喇叭 ' + r.RL + ' Ω。求最大功率傳輸所需的理想變壓器匝數比，並比較有、沒有變壓器時喇叭拿到的功率。',
    questionEn: (g, r) => 'The Thevenin impedance of the amplifier is ' + r.Rs + ' Ω and the speaker is ' + r.RL + ' Ω. Determine the turns ratio for maximum power transfer, and compare the speaker power with and without the transformer.',
    steps: (g, r) => [
      { t: 'Step 1　匹配條件。', eq: 'n<sup>2</sup> = Z<sub>L</sub>/Z<sub>Th</sub> = ' + r.RL + '/' + r.Rs + ' ⟹ n = ' + X.g(r.n, 4),
        note: r.n < 1 ? '內阻比喇叭大 → 降壓。' : r.n > 1 ? '內阻比喇叭小 → 升壓。' : '兩個一樣大 → 不用變壓器。' },
      { t: 'Step 2　沒有變壓器。', eq: 'P<sub>L</sub> = (V<sub>Th</sub>/(Z<sub>Th</sub> + Z<sub>L</sub>))<sup>2</sup>Z<sub>L</sub> = ' + X.g(r.P0, 4) + ' V<sub>Th</sub><sup>2</sup> μW' },
      { t: 'Step 3　有變壓器。', eq: 'P<sub>L</sub> = (nV<sub>Th</sub>/(n<sup>2</sup>Z<sub>Th</sub> + Z<sub>L</sub>))<sup>2</sup>Z<sub>L</sub> = ' + X.g(r.P1, 4) + ' V<sub>Th</sub><sup>2</sup> μW', after: '變成 ' + X.g(r.P1 / r.P0, 3) + ' 倍。' }
    ],
    answer: (g, r) => 'n = ' + X.g(r.n, 4) + '；功率 ' + X.g(r.P0, 4) + ' → ' + X.g(r.P1, 4) + ' V<sub>Th</sub><sup>2</sup> μW',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['沒有變壓器', r.P0, X.g(r.P0, 4) + ' μW', C.ink, r.P1], ['有變壓器', r.P1, X.g(r.P1, 4) + ' μW', C.accent, r.P1]], 100)
  });

  if (window.__ch12Quiz) window.__ch12Quiz([
    { zh: '自耦變壓器有幾個繞組？', en: 'How many windings does an autotransformer have?', o: [['一個（中間有抽頭）', 'one, with a tap'], ['兩個', 'two'], ['三個', 'three'], ['沒有', 'none']], a: 0, e: '一、二次側共用一個連續繞組。' },
    { zh: '自耦變壓器最大的缺點？', en: 'The major disadvantage of an autotransformer is:', o: [['沒有電氣隔離', 'no electrical isolation'], ['效率低', 'low efficiency'], ['只能降壓', 'step-down only'], ['很重', 'very heavy']], a: 0, e: '兩邊有導線相連。' },
    { zh: '降壓自耦 V₁/V₂ = ？', en: 'For a step-down autotransformer, V₁/V₂ =', o: [['(N₁ + N₂)/N₂', '(N₁ + N₂)/N₂'], ['N₁/(N₁ + N₂)', 'N₁/(N₁ + N₂)'], ['N₂/N₁', 'N₂/N₁'], ['1', '1']], a: 0, e: '輸入跨整個繞組。' },
    { zh: '同樣的線圈改接成自耦，功率額定通常？', en: 'Reconnecting the same coils as an autotransformer generally makes the power rating:', o: [['變大很多', 'much larger'], ['變小', 'smaller'], ['不變', 'the same'], ['變成零', 'zero']], a: 0, e: 'Example 13.10：48 VA → 1008 VA。' },
    { zh: '三相變壓器四種接法的總視在功率？', en: 'For any of the four three-phase connections, S_T =', o: [['√3 V<sub>L</sub>I<sub>L</sub>', '√3 V<sub>L</sub>I<sub>L</sub>'], ['3V<sub>L</sub>I<sub>L</sub>', '3V<sub>L</sub>I<sub>L</sub>'], ['V<sub>L</sub>I<sub>L</sub>', 'V<sub>L</sub>I<sub>L</sub>'], ['V<sub>L</sub>I<sub>L</sub>/√3', 'V<sub>L</sub>I<sub>L</sub>/√3']], a: 0, e: '式 13.69a。' },
    { zh: 'Δ-Y 接法 V<sub>Ls</sub> = ？', en: 'For the Δ-Y connection, V<sub>Ls</sub> =', o: [['√3 nV<sub>Lp</sub>', '√3 nV<sub>Lp</sub>'], ['nV<sub>Lp</sub>', 'nV<sub>Lp</sub>'], ['nV<sub>Lp</sub>/√3', 'nV<sub>Lp</sub>/√3'], ['V<sub>Lp</sub>/n', 'V<sub>Lp</sub>/n']], a: 0, e: '式 13.72a。' },
    { zh: '只為隔離用的變壓器 n = ？', en: 'An isolation transformer has n =', o: [['1', '1'], ['0', '0'], ['10', '10'], ['∞', '∞']], a: 0, e: '電壓不變。' },
    { zh: '擴大機 192 Ω 匹配 12 Ω 喇叭，n = ？', en: 'To match a 192-Ω amplifier to a 12-Ω speaker, n =', o: [['0.25', '0.25'], ['4', '4'], ['16', '16'], ['0.0625', '0.0625']], a: 0, e: 'n² = 12/192。' },
    { zh: '變壓器能擋掉什麼？', en: 'A transformer blocks:', o: [['直流', 'dc'], ['交流', 'ac'], ['高頻', 'high frequencies'], ['所有訊號', 'all signals']], a: 0, e: '直流不變化，感應不到（Example 13.15）。' },
    { zh: '為什麼用高壓輸電？', en: 'Why transmit power at high voltage?', o: [['電流小，I²R 損失小', 'smaller current, smaller I²R loss'], ['比較安全', 'it is safer'], ['頻率比較穩', 'more stable frequency'], ['電線比較好看', 'nicer wires']], a: 0, e: '同功率電壓高 10 倍，損失小 100 倍。' }
  ], ['CH13 全部讀完了，去 CH14 PART 1 看轉移函數（考到 14.3）。', '再去 CH13 章末練習題刷題，考試比較會考那些。', '先回故事模式看自耦變壓器那幾幕，再做一次。']);
})();
