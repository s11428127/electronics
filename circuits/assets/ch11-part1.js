/* ============================================================
   電路學 CH11 PART 1（11.2 瞬時／平均功率、11.3 最大功率轉移）
   可互動例題 + 觀念小測驗。互動模組（cv-inst、cv-mpt）在 ch11.js。
   預設數字 = 課本 Example 11.1、11.3、11.5
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, arrow, disc, clamp, lerp, liveExample } = E;
  const RAD = Math.PI / 180;
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', '−');
  const ang = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '°';
  const angF = (v, n) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n === undefined ? 2 : n) + '°';
  const cpx = (re, im, n) => fix(re, n) + (im < 0 ? ' − j' : ' + j') + fix(Math.abs(im), n);

  /* ── 例題 1（課本 Example 11.1）：由 v(t)、i(t) 求 p(t) 與 P ─────────── */
  liveExample('#ex-avg', {
    title: '例題 · 由 v(t)、i(t) 求平均功率（課本 Example 11.1）',
    ratio: 0.3, minH: 150, maxH: 190,
    givens: [
      { id: 'xa-vm', label: '電壓振幅 Vm', min: 10, max: 300, step: 10, value: 120, fmt: v => v + ' V' },
      { id: 'xa-im', label: '電流振幅 Im', min: 1, max: 30, step: 1, value: 10, fmt: v => v + ' A' },
      { id: 'xa-tv', label: '電壓相角 θv', min: -90, max: 90, step: 5, value: 45, fmt: ang },
      { id: 'xa-ti', label: '電流相角 θi', min: -90, max: 90, step: 5, value: -10, fmt: ang }
    ],
    compute: g => {
      const Vm = g['xa-vm'], Im = g['xa-im'], tv = g['xa-tv'], ti = g['xa-ti'];
      const d = tv - ti, half = 0.5 * Vm * Im, P = half * Math.cos(d * RAD);
      return { Vm, Im, tv, ti, d, half, P, sum: tv + ti };
    },
    question: (g, r) => '已知 <b>v(t) = ' + r.Vm + ' cos(377t ' + (r.tv < 0 ? '− ' : '+ ') + Math.abs(r.tv) + '°) V</b>、<b>i(t) = ' + r.Im +
      ' cos(377t ' + (r.ti < 0 ? '− ' : '+ ') + Math.abs(r.ti) + '°) A</b>，求負載吸收的瞬時功率 p(t) 與平均功率 P。' +
      '<br><span style="font-size:13px;color:var(--ink-3)">↑ 把 θi 拉到跟 θv 一樣（純電阻）、或差 90°（純電感／電容），看 P 怎麼變。</span>',
    steps: (g, r) => [
      { t: 'Step 1　抓出四個數字。', note: '兩條都已經是 cos，可以直接讀：',
        eq: 'V<sub>m</sub> = ' + r.Vm + '、I<sub>m</sub> = ' + r.Im + '、θ<sub>v</sub> = ' + angF(r.tv, 0) + '、θ<sub>i</sub> = ' + angF(r.ti, 0) },
      { t: 'Step 2　算相位差。', note: '負號最容易漏，括號寫出來：',
        eq: 'θ<sub>v</sub> − θ<sub>i</sub> = ' + angF(r.tv, 0) + ' − (' + angF(r.ti, 0) + ') = ' + angF(r.d, 0) },
      { t: 'Step 3　積化和差，寫出 p(t)。', note: '常數項 = ½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub>−θ<sub>i</sub>)，擺盪項的頻率變成 2 × 377 = 754：',
        eq: 'p(t) = ' + fix(r.P, 2) + ' + ' + fix(r.half, 0) + ' cos(754t ' + (r.sum < 0 ? '− ' : '+ ') + Math.abs(r.sum) + '°) W' },
      { t: 'Step 4　平均功率 = 常數項。', note: '擺盪項一個週期平均為 0，只剩常數：',
        eq: 'P = ½ × ' + r.Vm + ' × ' + r.Im + ' × cos(' + angF(r.d, 0) + ') = ' + fix(r.half, 0) + ' × ' + fix(Math.cos(r.d * RAD), 4) + ' = ' + fix(r.P, 2) + ' W',
        after: Math.abs(r.d) < 0.01
          ? '<b style="color:var(--ok)">θ<sub>v</sub> = θ<sub>i</sub>：純電阻，cos 0° = 1，完全不打折</b>，送來的 ½V<sub>m</sub>I<sub>m</sub> 全部吃掉。'
          : Math.abs(Math.abs(r.d) - 90) < 0.01
          ? '<b style="color:var(--warn)">相差 90°：cos 90° = 0，P = 0</b>。這是純電感或純電容，能量借了又還，平均一點都沒吃掉。'
          : Math.abs(r.d) > 90
          ? '<b style="color:var(--bad)">相差超過 90°，P 變成負的</b> —— 這一端其實在<b>送出</b>功率，它是電源，不是負載。'
          : r.d > 0
          ? 'θ<sub>v</sub> − θ<sub>i</sub> &gt; 0：電流<b>落後</b>電壓 → <b>電感性</b>負載。只打了 cos ' + angF(r.d, 0) + ' = ' + fix(Math.cos(r.d * RAD), 3) + ' 折。'
          : 'θ<sub>v</sub> − θ<sub>i</sub> &lt; 0：電流<b>超前</b>電壓 → <b>電容性</b>負載。只打了 cos ' + angF(r.d, 0) + ' = ' + fix(Math.cos(r.d * RAD), 3) + ' 折。' }
    ],
    answer: (g, r) => 'p(t) = ' + fix(r.P, 2) + ' + ' + fix(r.half, 0) + ' cos(754t ' + (r.sum < 0 ? '− ' : '+ ') + Math.abs(r.sum) + '°) W；P = ' + fix(r.P, 2) + ' W' +
      '　（V<sub>m</sub>I<sub>m</sub> = ' + (r.Vm * r.Im) + '，但平均只吃 ' + fix(r.P, 2) + '）',
    /* p(t) 兩個電壓週期：藍綠 = 吸收、橘 = 送回電源；虛線 = 平均 P */
    draw: (ctx, w, h, g, r) => {
      const x0 = 46, x1 = w - 14, y0 = 16, y1 = h - 22;
      const lo = Math.min(0, r.P - r.half), hi = Math.max(0, r.P + r.half), pad = (hi - lo) * 0.12 || 1;
      const Y = v => lerp(y1, y0, (v - (lo - pad)) / (hi - lo + 2 * pad));
      const N = 240, X = i => lerp(x0, x1, i / N);
      const pv = i => r.P + r.half * Math.cos(2 * (i / N) * 2 * Math.PI + r.sum * RAD);
      [[1, C['p-real-w']], [-1, C['q-react-w']]].forEach(([s, col]) => {
        ctx.beginPath(); ctx.moveTo(x0, Y(0));
        for (let i = 0; i <= N; i++) { const v = pv(i); ctx.lineTo(X(i), Y(s > 0 ? Math.max(v, 0) : Math.min(v, 0))); }
        ctx.lineTo(x1, Y(0)); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      });
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.stroke();
      label(ctx, x0 - 6, Y(0), '0', C['ink-3'], 10, 'right');
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const y = Y(pv(i)); i ? ctx.lineTo(X(i), y) : ctx.moveTo(X(i), y); }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C['p-real']; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x0, Y(r.P)); ctx.lineTo(x1, Y(r.P)); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, x1 - 4, clamp(Y(r.P) - 10, y0 + 6, y1 - 6), 'P = ' + fix(r.P, 2) + ' W', C['p-real'], 11, 'right', '700');
      labelCJK(ctx, x0, h - 8, '藍綠 = 吸收　橘 = 送回電源', C['ink-3'], 10.5, 'left');
    }
  });

  /* ── 例題 2（課本 Example 11.3）：串聯 R–X，電源送出 = 電阻吸收 ─────── */
  liveExample('#ex-rc', {
    title: '例題 · 電源送出多少，電阻就吃多少（課本 Example 11.3）',
    ratio: 0.36, minH: 170, maxH: 210,
    givens: [
      { id: 'xr-vm', label: '電源振幅 Vm（相角固定 30°）', min: 1, max: 20, step: 1, value: 5, fmt: v => v + '∠30° V' },
      { id: 'xr-r', label: '電阻 R', min: 0.5, max: 20, step: 0.5, value: 4, fmt: v => v + ' Ω' },
      { id: 'xr-x', label: '電抗 X（負 = 電容、正 = 電感）', min: -20, max: 20, step: 0.5, value: -2,
        fmt: v => (v < 0 ? '−j' + Math.abs(v) : v > 0 ? '+j' + v : '0') + ' Ω' }
    ],
    compute: g => {
      const Vm = g['xr-vm'], R = g['xr-r'], X = g['xr-x'];
      const Zm = Math.hypot(R, X), Za = Math.atan2(X, R) / RAD;
      const Im = Vm / Zm, ti = 30 - Za;
      const Ps = 0.5 * Vm * Im * Math.cos((30 - ti) * RAD), PR = 0.5 * Im * Im * R;
      return { Vm, R, X, Zm, Za, Im, ti, Ps, PR, VR: Im * R };
    },
    question: (g, r) => '電壓源 <b>' + r.Vm + '∠30° V</b>（振幅）串聯 <b>' + r.R + ' Ω</b> 電阻與 <b>' + (r.X < 0 ? '−j' : '+j') + Math.abs(r.X) + '&nbsp;Ω</b>' +
      (r.X < 0 ? '（電容）' : r.X > 0 ? '（電感）' : '（沒有電抗）') + '。求電源供給的平均功率、電阻與' + (r.X < 0 ? '電容' : '電感') + '各吸收多少。',
    steps: (g, r) => [
      { t: 'Step 1　總阻抗化成極座標。', note: '串聯直接相加，相除用極座標最方便：',
        eq: 'Z = ' + cpx(r.R, r.X, 1) + ' = ' + fix(r.Zm, 3) + '∠' + angF(r.Za) + ' Ω' },
      { t: 'Step 2　電流 = 電壓 ÷ 阻抗。', note: '大小相除、角度相減：',
        eq: 'I = ' + r.Vm + '∠30° ÷ ' + fix(r.Zm, 3) + '∠' + angF(r.Za) + ' = ' + fix(r.Im, 3) + '∠' + angF(r.ti) + ' A' },
      { t: 'Step 3　電源送出的平均功率。', note: '用電源自己的電壓、電流：',
        eq: 'P<sub>源</sub> = ½ × ' + r.Vm + ' × ' + fix(r.Im, 3) + ' × cos(30° − ' + angF(r.ti) + ') = ' + fix(r.Ps, 3) + ' W' },
      { t: 'Step 4　電阻吸收。', note: '電阻上電壓電流同相，最快是 ½|I|²R：',
        eq: 'P<sub>R</sub> = ½ × ' + fix(r.Im, 3) + '² × ' + r.R + ' = ' + fix(r.PR, 3) + ' W' },
      { t: 'Step 5　' + (r.X < 0 ? '電容' : '電感') + '吸收 0，對帳。', note: '純電抗相差 90°，cos 90° = 0：',
        eq: 'P<sub>源</sub> = P<sub>R</sub> + 0　→　' + fix(r.Ps, 3) + ' = ' + fix(r.PR, 3) + ' ✓',
        after: r.X === 0 ? '現在電抗是 0，電路是純電阻，電流跟電壓同相。'
          : Math.abs(r.X) > 3 * r.R ? '<b style="color:var(--warn)">電抗比電阻大很多</b>：電流被電抗擋住變小，P 也跟著變小 —— 但送出去的還是全部由電阻吃掉。'
          : '電源送出的每一瓦都進了電阻；' + (r.X < 0 ? '電容' : '電感') + '只是在中間借了又還。' }
    ],
    answer: (g, r) => '電源供給 ' + fix(r.Ps, 3) + ' W；電阻吸收 ' + fix(r.PR, 3) + ' W；' + (r.X < 0 ? '電容' : '電感') + ' 0 W',
    /* 相量圖：V（墨色）與 I（藍） */
    draw: (ctx, w, h, g, r) => {
      const cx = Math.min(w * 0.3, 150), cy = h / 2, R0 = Math.max(10, Math.min(cy - 22, cx - 30));
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R0 - 6, cy); ctx.lineTo(cx + R0 + 6, cy); ctx.moveTo(cx, cy - R0 - 6); ctx.lineTo(cx, cy + R0 + 6); ctx.stroke();
      const vx = cx + R0 * Math.cos(30 * RAD), vy = cy - R0 * Math.sin(30 * RAD);
      const ri = R0 * 0.7, ix = cx + ri * Math.cos(r.ti * RAD), iy = cy - ri * Math.sin(r.ti * RAD);
      arrow(ctx, cx, cy, vx, vy, C.ink, 2.2); arrow(ctx, cx, cy, ix, iy, C.accent, 2.2);
      label(ctx, vx + 8, vy - 6, 'V', C.ink, 12, 'left', '700');
      label(ctx, ix + (Math.cos(r.ti * RAD) >= 0 ? 8 : -8), iy - 6, 'I', C.accent, 12, Math.cos(r.ti * RAD) >= 0 ? 'left' : 'right', '700');
      const tx = Math.min(cx + R0 + 30, w - 10);
      if (w - tx > 150) {
        labelCJK(ctx, tx, cy - 30, '電流' + (r.ti > 30.01 ? '超前' : r.ti < 29.99 ? '落後' : '同相於') + '電壓 ' + fix(Math.abs(r.ti - 30), 1) + '°', C['ink-2'], 12, 'left', '600');
        labelCJK(ctx, tx, cy - 4, 'P源 = ' + fix(r.Ps, 2) + ' W', C['p-real'], 12, 'left', '700');
        labelCJK(ctx, tx, cy + 20, 'P電阻 = ' + fix(r.PR, 2) + ' W', C['p-real'], 12, 'left', '700');
        labelCJK(ctx, tx, cy + 44, 'P' + (r.X < 0 ? '電容' : '電感') + ' = 0', C['ink-3'], 12, 'left', '600');
      }
    }
  });

  /* ── 例題 3（課本 Example 11.5 / 11.6）：共軛匹配 vs 純電阻負載 ──────── */
  liveExample('#ex-mpt', {
    title: '例題 · 負載怎麼選，功率最大（課本 Example 11.5 的戴維寧等效）',
    ratio: 0.34, minH: 170, maxH: 220,
    givens: [
      { id: 'xm-r', label: '戴維寧電阻 R<sub>Th</sub>', min: 0.5, max: 10, step: 0.001, value: 2.933, fmt: v => v.toFixed(3) + ' Ω' },
      { id: 'xm-x', label: '戴維寧電抗 X<sub>Th</sub>', min: -10, max: 10, step: 0.001, value: 4.467, fmt: v => (v < 0 ? '−j' : '+j') + Math.abs(v).toFixed(3) + ' Ω' },
      { id: 'xm-v', label: '|V<sub>Th</sub>|（振幅）', min: 1, max: 20, step: 0.001, value: 7.454, fmt: v => v.toFixed(3) + ' V' },
      { id: 'xm-m', label: '負載限制', min: 0, max: 1, step: 1, value: 0, fmt: v => v ? '只能用純電阻 R<sub>L</sub>' : '可以有電抗（R<sub>L</sub> + jX<sub>L</sub>）' }
    ],
    compute: g => {
      const R = g['xm-r'], X = g['xm-x'], V = g['xm-v'], m = g['xm-m'];
      const Pmax = V * V / (8 * R);
      const Psame = 0.5 * V * V * R / (Math.pow(2 * R, 2) + Math.pow(2 * X, 2));   /* 選 ZL = ZTh 的下場 */
      const Zm = Math.hypot(R, X);
      const Ir = V / Math.hypot(R + Zm, X), Pres = 0.5 * Ir * Ir * Zm;
      return { R, X, V, m, Pmax, Psame, Zm, Ir, Pres };
    },
    question: (g, r) => '某電路從負載端看進去的戴維寧等效為 <b>V<sub>Th</sub> = ' + r.V.toFixed(3) + ' V（振幅）</b>、<b>Z<sub>Th</sub> = ' + cpx(r.R, r.X, 3) + ' Ω</b>。' +
      (r.m ? '負載<b>只能是一個電阻 R<sub>L</sub></b>，' : '負載 Z<sub>L</sub> 可以自由選，') + '求讓負載得到最大平均功率的負載值與功率。' +
      '<br><span style="font-size:13px;color:var(--ink-3)">↑ 把「負載限制」拉到 1 看純電阻的情況；把 X<sub>Th</sub> 拉到 0，兩種答案會變一樣。</span>',
    steps: (g, r) => r.m ? [
      { t: 'Step 1　電抗抵銷不掉。', note: '負載沒有電抗（X<sub>L</sub> = 0），Z<sub>Th</sub> 的 ' + cpx(0, r.X, 3).replace(/^0\.000 /, '') + ' 只能留著，所以<b>不能</b>用 R<sub>L</sub> = R<sub>Th</sub>。' },
      { t: 'Step 2　回到通式，X<sub>L</sub> = 0 代進去。',
        eq: 'R<sub>L</sub> = √(R<sub>Th</sub><sup>2</sup> + X<sub>Th</sub><sup>2</sup>) = √(' + fix(r.R, 3) + '² + ' + fix(r.X, 3) + '²) = ' + fix(r.Zm, 3) + ' Ω' },
      { t: 'Step 3　算電流。', note: '總阻抗 = (R<sub>Th</sub> + R<sub>L</sub>) + jX<sub>Th</sub>：',
        eq: '|I| = ' + r.V.toFixed(3) + ' ÷ |' + cpx(r.R + r.Zm, r.X, 3) + '| = ' + fix(r.Ir, 4) + ' A' },
      { t: 'Step 4　P = ½|I|²R<sub>L</sub>（不能用 8R<sub>Th</sub> 那條）。',
        eq: 'P = ½ × ' + fix(r.Ir, 4) + '² × ' + fix(r.Zm, 3) + ' = ' + fix(r.Pres, 4) + ' W' },
      { t: 'Step 5　跟可以共軛匹配時比。',
        eq: '共軛匹配可拿 ' + fix(r.Pmax, 4) + ' W；純電阻只拿到 ' + fix(r.Pres / r.Pmax * 100, 1) + ' %',
        after: Math.abs(r.X) < 0.05 ? '<b style="color:var(--ok)">X<sub>Th</sub> ≈ 0</b>：本來就沒有電抗要抵銷，純電阻也能拿滿。'
          : '<b style="color:var(--warn)">電抗沒抵銷，一定拿不滿</b>；X<sub>Th</sub> 越大，損失越多。' }
    ] : [
      { t: 'Step 1　先抵銷電抗。', note: '分母的 (X<sub>Th</sub> + X<sub>L</sub>)² 最小是 0：',
        eq: 'X<sub>L</sub> = −X<sub>Th</sub> = ' + fix(-r.X, 3) + ' Ω' },
      { t: 'Step 2　再匹配電阻。',
        eq: 'R<sub>L</sub> = R<sub>Th</sub> = ' + fix(r.R, 3) + ' Ω　⟹　Z<sub>L</sub> = Z<sub>Th</sub>* = ' + cpx(r.R, -r.X, 3) + ' Ω' },
      { t: 'Step 3　總阻抗只剩 2R<sub>Th</sub>。',
        eq: '|I| = ' + r.V.toFixed(3) + ' ÷ (2 × ' + fix(r.R, 3) + ') = ' + fix(r.V / (2 * r.R), 4) + ' A' },
      { t: 'Step 4　最大功率。',
        eq: 'P<sub>max</sub> = |V<sub>Th</sub>|²/(8R<sub>Th</sub>) = ' + r.V.toFixed(3) + '² ÷ (8 × ' + fix(r.R, 3) + ') = ' + fix(r.Pmax, 4) + ' W' },
      { t: 'Step 5　如果照直流的直覺選 Z<sub>L</sub> = Z<sub>Th</sub>？',
        eq: 'P = ½|V<sub>Th</sub>|²R<sub>Th</sub> ÷ [(2R<sub>Th</sub>)² + (2X<sub>Th</sub>)²] = ' + fix(r.Psame, 4) + ' W（只有 ' + fix(r.Psame / r.Pmax * 100, 1) + ' %）',
        after: Math.abs(r.X) < 0.05 ? 'X<sub>Th</sub> ≈ 0 時共軛跟相等是同一件事，所以一樣是 100 %。'
          : '電抗沒有抵銷反而<b>疊加</b>成 2X<sub>Th</sub>，電流變小 —— 這就是為什麼一定要「共軛」。' }
    ],
    answer: (g, r) => r.m
      ? 'R<sub>L</sub> = |Z<sub>Th</sub>| = ' + fix(r.Zm, 3) + ' Ω，P = ' + fix(r.Pres, 4) + ' W'
      : 'Z<sub>L</sub> = ' + cpx(r.R, -r.X, 3) + ' Ω，P<sub>max</sub> = ' + fix(r.Pmax, 4) + ' W',
    /* P 對 R_L 的曲線：共軛（X_L = −X_Th）與純電阻（X_L = 0）兩條 */
    draw: (ctx, w, h, g, r) => {
      const x0 = 44, x1 = w - 16, y0 = 22, y1 = h - 26, Rmax = Math.max(4 * r.R, 2 * r.Zm, 4);
      const Pc = rl => 0.5 * r.V * r.V * rl / Math.pow(r.R + rl, 2);
      const Pr = rl => 0.5 * r.V * r.V * rl / (Math.pow(r.R + rl, 2) + r.X * r.X);
      const X = rl => lerp(x0, x1, rl / Rmax), Y = p => lerp(y1, y0, p / (r.Pmax * 1.12));
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      labelCJK(ctx, x1, y1 + 15, 'RL →', C['ink-3'], 10.5, 'right');
      [[Pc, C['p-real'], 0], [Pr, C['q-react'], 1]].forEach(([f, col, mm]) => {
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) { const rl = Rmax * i / 200, y = Y(f(rl)); i ? ctx.lineTo(X(rl), y) : ctx.moveTo(X(rl), y); }
        ctx.strokeStyle = col; ctx.lineWidth = r.m === mm ? 2.6 : 1.2; ctx.globalAlpha = r.m === mm ? 1 : 0.5; ctx.stroke(); ctx.globalAlpha = 1;
      });
      const bx = r.m ? r.Zm : r.R, bp = r.m ? r.Pres : r.Pmax, col = r.m ? C['q-react'] : C['p-real'];
      ctx.setLineDash([4, 4]); ctx.strokeStyle = col; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(X(bx), y1); ctx.lineTo(X(bx), Y(bp)); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(X(bx), Y(bp), 4.5, 0, 2 * Math.PI); ctx.fillStyle = col; ctx.fill();
      label(ctx, clamp(X(bx), x0 + 40, x1 - 40), Y(bp) - 12, fix(bp, 3) + ' W', col, 11, 'center', '700');
      labelCJK(ctx, x0 + 6, 12, '綠：XL = −XTh（共軛）', C['p-real'], 10.5, 'left', r.m ? '400' : '700');
      if (w > 360) labelCJK(ctx, x1, 12, '橘：XL = 0（純電阻）', C['q-react'], 10.5, 'right', r.m ? '700' : '400');
    }
  });

  /* ── 補課例題：串聯 R、L、C 的阻抗與電流（vs = 10 cos 4t、R = 5 Ω、C = 0.1 F，L 預設 0） ── */
  liveExample('#ex-zrc', {
    title: '例題 · 串聯 R、L、C：先換成阻抗，再算電流',
    ratio: 0.42, minH: 190, maxH: 240,
    givens: [
      { id: 'xz-w', label: '角頻率 ω（電源 10 cos ωt）', min: 1, max: 20, step: 1, value: 4, fmt: v => v + ' rad/s' },
      { id: 'xz-r', label: '電阻 R', min: 0.5, max: 20, step: 0.5, value: 5, fmt: v => v + ' Ω' },
      { id: 'xz-l', label: '電感 L（0 = 沒有電感）', min: 0, max: 2, step: 0.05, value: 0, fmt: v => (v ? v.toFixed(2) + ' H' : '沒有') },
      { id: 'xz-c', label: '電容 C', min: 0.02, max: 1, step: 0.01, value: 0.1, fmt: v => v.toFixed(2) + ' F' }
    ],
    compute: g => {
      const w = g['xz-w'], R = g['xz-r'], L = g['xz-l'], Cc = g['xz-c'];
      const XL = w * L, XC = -1 / (w * Cc), X = XL + XC, mag = Math.hypot(R, X), th = Math.atan2(X, R) / RAD, Im = 10 / mag;
      return { w, R, L, Cc, XL, XC, X, mag, th, Im };
    },
    question: (g, r) => '電源 <b>v<sub>s</sub> = 10 cos ' + r.w + 't V</b> 串聯 <b>R = ' + r.R + ' Ω</b>' + (r.L ? '、<b>L = ' + r.L.toFixed(2) + ' H</b>' : '') +
      '、<b>C = ' + r.Cc.toFixed(2) + ' F</b>。求總阻抗 Z，以及電流 i(t)。' +
      '<br><span style="font-size:13px;color:var(--ink-3)">↑ 把 L 拉上來，找找看哪個 L 會讓電感和電容的電抗<b>剛好抵銷</b>（電流最大）。</span>',
    steps: (g, r) => [
      { t: 'Step 1　從電源抓出 ω。', note: 'cos 裡面 t 前面的數字就是 ω（rad/s），不是 f：',
        eq: 'v<sub>s</sub> = 10 cos ' + r.w + 't　⟹　ω = ' + r.w + '，電源相量 V = 10∠0° V' },
      { t: 'Step 2　每個元件換成阻抗。', note: '電阻照抄；電感 jωL（正 j）；電容 −j/(ωC)（負 j）：',
        eq: 'Z<sub>R</sub> = ' + r.R + '　Z<sub>L</sub> = j(' + r.w + ' × ' + r.L.toFixed(2) + ') = j' + fix(r.XL, 3) +
          (r.L ? '' : '（沒有電感）') + '　Z<sub>C</sub> = −j / (' + r.w + ' × ' + r.Cc.toFixed(2) + ') = −j' + fix(-r.XC, 3) },
      { t: 'Step 3　串聯就相加：實部加實部、虛部加虛部。', note: r.L ? '電感的 +j 和電容的 −j 號碼相反，會互相抵掉一部分：' : '這題沒有電感（L = 0），虛部只剩電容的 −j：',
        eq: 'Z = ' + r.R + ' + j(' + fix(r.XL, 3) + ' − ' + fix(-r.XC, 3) + ') = ' + cpx(r.R, r.X, 3) + ' Ω' },
      { t: 'Step 4　換成「大小 ∠ 角度」。', note: '大小 = 總共擋多少；角度 = 電流會錯開幾度：',
        eq: '|Z| = √(' + r.R + '² + ' + fix(Math.abs(r.X), 3) + '²) = ' + fix(r.mag, 3) + ' Ω　θ = tan⁻¹(' + fix(r.X, 3) + ' / ' + r.R + ') = ' + angF(r.th, 2) },
      { t: 'Step 5　電流 = 電壓 ÷ 阻抗。', note: '除法：大小相除、角度相減（0° − θ）：',
        eq: 'I = 10∠0° ÷ ' + fix(r.mag, 3) + '∠' + angF(r.th, 2) + ' = ' + fix(r.Im, 3) + '∠' + angF(-r.th, 2) + ' A',
        after: Math.abs(r.X) < 0.05
          ? '<b style="color:var(--ok)">X ≈ 0：電感和電容的電抗剛好抵銷（共振）</b>。電路變成純電阻，電流最大 = 10 ÷ ' + r.R + ' = ' + fix(10 / r.R, 3) + ' A，而且跟電壓同步。11.3 的共軛匹配就是在做這件事。'
          : r.X < 0
          ? 'X &lt; 0：<b>電容性</b>，電流比電壓<b>早</b> ' + fix(-r.th, 2) + '° 到。' + (r.L ? '電感的 +j' + fix(r.XL, 2) + ' 抵掉了一部分，但電容還比較大。' : '只有電容在擋，所以電抗是負的。')
          : 'X &gt; 0：<b>電感性</b>，電流比電壓<b>晚</b> ' + fix(r.th, 2) + '° 到。電感的 +j' + fix(r.XL, 2) + ' 蓋過了電容的 −j' + fix(-r.XC, 2) + '。' }
    ],
    answer: (g, r) => 'Z = ' + cpx(r.R, r.X, 3) + ' Ω = ' + fix(r.mag, 3) + '∠' + angF(r.th, 2) + ' Ω；i(t) = ' + fix(r.Im, 3) + ' cos(' + r.w + 't ' + (r.th > 0 ? '− ' : '+ ') + Math.abs(r.th).toFixed(2) + '°) A',
    /* 阻抗平面：Z_R → Z_L → Z_C 頭接尾，粗箭頭是總和 Z */
    draw: (ctx, w, h, g, r) => {
      const top = Math.max(r.XL, 0.5, r.X), bot = Math.min(r.X, r.XL + r.XC, -0.5), span = top - bot;
      const s = Math.max(0.5, Math.min((w - 120) / Math.max(r.R, 1), (h - 40) / span));
      const ox = Math.max(30, (w - r.R * s) / 2 - 20), oy = 20 + top * s;
      const pt = (a, b) => [ox + a * s, oy - b * s];
      ctx.strokeStyle = C['line-soft']; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox - 10, oy); ctx.lineTo(ox + r.R * s + 30, oy); ctx.moveTo(ox, 8); ctx.lineTo(ox, h - 8); ctx.stroke();
      const [ax, ay] = pt(r.R, 0), [bx, by] = pt(r.R, r.XL), [cx, cy] = pt(r.R, r.X);
      arrow(ctx, ox, oy, ax, ay, C['p-real'], 2.6);
      label(ctx, (ox + ax) / 2, oy + (r.X < 0 ? -10 : 14), 'R = ' + r.R, C['p-real'], 11, 'center', '700');
      if (r.XL > 0.01) { arrow(ctx, ax, ay, bx, by, C['q-react'], 2.6); label(ctx, ax + 8, (ay + by) / 2, '+j' + fix(r.XL, 2) + '（L）', C['q-react'], 10.5, 'left', '700'); }
      arrow(ctx, bx + (r.XL > 0.01 ? 10 : 0), by, cx + (r.XL > 0.01 ? 10 : 0), cy, C['s-app'], 2.6);
      label(ctx, bx + (r.XL > 0.01 ? 18 : 8), (by + cy) / 2, '−j' + fix(-r.XC, 2) + '（C）', C['s-app'], 10.5, 'left', '700');
      ctx.setLineDash([5, 4]); arrow(ctx, ox, oy, cx, cy, C.ink, 2); ctx.setLineDash([]);
      disc(ctx, cx, cy, 5, C.ink, C.surface);
      label(ctx, clamp(cx - 12, 60, w - 10), cy + (r.X < 0 ? 16 : -12), 'Z = ' + cpx(r.R, r.X, 2), C.ink, 11.5, 'right', '700');
      labelCJK(ctx, w - 8, 14, '頭接尾相加 → 虛線就是 Z', C['ink-3'], 10.5, 'right');
    }
  });

  /* ── 觀念小測驗 ─────────────────────────────────────────── */
  window.__ch11Quiz([
    { zh: '在弦波穩態下，瞬時功率 p(t) 的頻率是電壓頻率的幾倍？',
      en: 'In sinusoidal steady state, the frequency of the instantaneous power p(t) is how many times that of the voltage?',
      o: [['兩倍', 'twice'], ['與電壓相同', 'the same as the voltage'], ['一半', 'half'], ['四倍', 'four times']], a: 0,
      e: 'p(t) = ½VmIm cos(θv−θi) + ½VmIm cos(2ωt + θv + θi)。第二項的角頻率是 2ω，所以 p(t) 擺得比電壓快一倍、週期只有一半。' },
    { zh: '純電感或純電容所吸收的平均功率是多少？',
      en: 'What is the average power absorbed by a purely inductive or purely capacitive element?',
      o: [['零', 'zero'], ['等於 ½VmIm', 'equal to ½VmIm'], ['等於 VmIm', 'equal to VmIm'], ['視頻率而定', 'depends on frequency']], a: 0,
      e: '純電抗元件的 θv − θi = ±90°，cos(±90°) = 0，故 P = 0。它們只是把能量借來還去，不消耗淨能量。' },
    { zh: 'v(t) = 120 cos(377t + 45°) V、i(t) = 10 cos(377t − 10°) A，平均功率 P 為？',
      en: 'Given v(t) = 120 cos(377t + 45°) V and i(t) = 10 cos(377t − 10°) A, the average power P is:',
      o: [['344.2 W', '344.2 W'], ['491.5 W', '491.5 W'], ['600 W', '600 W'], ['1200 W', '1200 W']], a: 0,
      e: 'θv − θi = 45° − (−10°) = 55°。P = ½ × 120 × 10 × cos 55° = 600 × 0.5736 = 344.2 W。算成 cos 35° 就會得到 491.5 W（負號漏掉）。' },
    { zh: 'p(t) 在某段時間是負的，代表什麼？',
      en: 'What does a negative value of p(t) during part of the cycle indicate?',
      o: [['那段時間能量從負載送回電源', 'energy is being returned from the load to the source'], ['負載在產生新能量', 'the load is generating new energy'],
          ['電路故障', 'the circuit is faulty'], ['平均功率一定是負的', 'the average power must be negative']], a: 0,
      e: '負的瞬時功率是電感、電容把先前存的能量還給電源，不是產生新的能量。只要還有電阻在，平均仍是正的。' },
    { zh: '電路中哪一種元件會吸收「平均」功率？',
      en: 'Which element absorbs nonzero average power?',
      o: [['電阻', 'resistor'], ['電感', 'inductor'], ['電容', 'capacitor'], ['三者都會', 'all three']], a: 0,
      e: '只有電阻的電壓電流同相（cos 0° = 1）。電感、電容相差 90°，平均為 0。所以 P = ½|I|²R，只看阻抗的實部。' },
    { zh: '電流 I（振幅）流過阻抗 Z = R + jX，平均功率 P = ½|I|²×？',
      en: 'A current I (amplitude) flows through Z = R + jX. The average power is P = ½|I|² × ?',
      o: [['R', 'R'], ['X', 'X'], ['|Z|', '|Z|'], ['R + X', 'R + X']], a: 0,
      e: '只有電阻消耗平均功率，所以乘的是實部 R，不是 |Z|。乘 X 得到的是虛功率（PART 3）。' },
    { zh: '阻抗 Z = 4 + j3 Ω，「總共擋多少」的大小 |Z| 是？',
      en: 'For an impedance Z = 4 + j3 Ω, what is its magnitude |Z|?',
      o: [['5 Ω', '5 Ω'], ['7 Ω', '7 Ω'], ['4 Ω', '4 Ω'], ['1 Ω', '1 Ω']], a: 0,
      e: '實部、虛部方向不同，不能直接加：|Z| = √(4² + 3²) = 5 Ω。像往東 4 步、往北 3 步，離起點是斜邊 5。' },
    { zh: '電容 C 在角頻率 ω 下的阻抗是？',
      en: 'The impedance of a capacitor C at angular frequency ω is:',
      o: [['−j/(ωC)', '−j/(ωC)'], ['jωC', 'jωC'], ['1/(ωC)', '1/(ωC)'], ['jωL', 'jωL']], a: 0,
      e: 'Z<sub>C</sub> = 1/(jωC)，上下同乘 j 得 −j/(ωC)：電抗是負的，電流超前電壓 90°。jωL 是電感。' },
    { zh: '戴維寧等效把負載以外的電路換成什麼？',
      en: 'A Thevenin equivalent replaces the rest of the circuit (seen from the load) with:',
      o: [['電壓源 VTh 串聯阻抗 ZTh', 'a voltage source VTh in series with an impedance ZTh'], ['電流源並聯阻抗', 'a current source in parallel with an impedance'],
          ['只有一個電壓源', 'a voltage source only'], ['只有一個阻抗', 'an impedance only']], a: 0,
      e: '從負載的 a、b 兩端看進去，再複雜的電源側都能縮成「VTh 串 ZTh」，像把發電廠縮成一個插座。電流源並聯阻抗是諾頓等效。' },
    { zh: '交流電路要把最大平均功率送給負載，負載阻抗 ZL 應該等於？',
      en: 'For maximum average power transfer to the load in an ac circuit, the load impedance ZL should equal:',
      o: [['ZTh 的共軛複數 ZTh*', 'the complex conjugate ZTh*'], ['ZTh', 'ZTh'], ['|ZTh|', 'the magnitude |ZTh|'], ['1/ZTh', 'the reciprocal 1/ZTh']], a: 0,
      e: 'ZL = ZTh* 表示 RL = RTh 且 XL = −XTh。先用 XL 把電抗抵銷讓電路呈純電阻，再用 RL 匹配電阻。' },
    { zh: '若負載被限定只能是純電阻，最大功率轉移的條件變成什麼？',
      en: 'If the load is restricted to be purely resistive, the condition for maximum power transfer becomes:',
      o: [['RL = |ZTh|', 'RL = |ZTh|'], ['RL = RTh', 'RL = RTh'], ['RL = XTh', 'RL = XTh'], ['RL = 0', 'RL = 0']], a: 0,
      e: '在 XL = 0 的限制下，對 RL 微分求極值得 RL = √(RTh² + XTh²) = |ZTh|，是戴維寧阻抗的「大小」，不是實部。' },
    { zh: 'VTh = 10 V（振幅）、ZTh = 4 + j3 Ω，共軛匹配時的最大平均功率為？',
      en: 'With VTh = 10 V (amplitude) and ZTh = 4 + j3 Ω, the maximum average power under conjugate matching is:',
      o: [['3.125 W', '3.125 W'], ['6.25 W', '6.25 W'], ['2 W', '2 W'], ['12.5 W', '12.5 W']], a: 0,
      e: 'Pmax = |VTh|²/(8RTh) = 100/32 = 3.125 W。若 VTh 是 rms 才用 4RTh（= 6.25 W）。選 ZL = ZTh 的話只有 2 W。' },
    { zh: 'i(t) = 33 sin(10t + 60°) A 寫成 cos 的形式是？',
      en: 'Expressed as a cosine, i(t) = 33 sin(10t + 60°) A is:',
      o: [['33 cos(10t − 30°)', '33 cos(10t − 30°)'], ['33 cos(10t + 150°)', '33 cos(10t + 150°)'], ['33 cos(10t + 60°)', '33 cos(10t + 60°)'], ['33 cos(10t − 60°)', '33 cos(10t − 60°)']], a: 0,
      e: 'sin x = cos(x − 90°)，所以 60° − 90° = −30°。先統一成 cos 才能讀相角，這是 Practice 11.1 的第一步。' }
  ], ['這一頁觀念很穩，可以往 PART 2 的有效值前進了。',
      '主幹抓到了，把答錯的題目回去把對應的例題數字拉一拉。',
      '建議先把故事模式再看一次，再玩「瞬時功率波形實驗室」，把 cos 打折的感覺抓回來。']);
})();
