/* ============================================================
   電路學 CH13 PART 1（13.2 互感、13.3 耦合電路的能量）
   互動模組：cv-dot（打點規則練習機）、cv-en（能量三項＋k）
   可互動例題：Example 13.1、Example 13.3；觀念小測驗（用 ch12.js 的 __ch12Quiz）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  if (!E || !X) return;
  const { C, Stage, label, labelCJK, liveExample, bindRange, setText } = E;
  const RAD = Math.PI / 180;
  const jx = v => (v < 0 ? '−j' : 'j') + X.g(Math.abs(v), 3);
  const solve2 = (a, b, c, d, e, f) => { /* [a b; c d][x y] = [e f] */
    const det = X.sub(X.mul(a, d), X.mul(b, c));
    return [X.div(X.sub(X.mul(e, d), X.mul(b, f)), det), X.div(X.sub(X.mul(a, f), X.mul(e, c)), det)];
  };

  /* 畫一個垂直線圈 */
  function coilV(ctx, x, y1, y2, dir, col) {
    const cl = Math.min(80, y2 - y1), y0 = y1 + (y2 - y1 - cl) / 2, r = cl / 8;
    ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y0);
    for (let i = 0; i < 4; i++) ctx.arc(x, y0 + r + 2 * r * i, r, -Math.PI / 2, Math.PI / 2, dir < 0);
    ctx.lineTo(x, y2); ctx.stroke();
    return [y0, y0 + cl];
  }
  const dotAt = (ctx, x, y) => { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.fill(); };

  /* ── 13.2 打點規則練習機 ── */
  (function dotToy() {
    const cv = document.getElementById('cv-dot'); if (!cv) return;
    const s = { d2: 'top', i1: 'in', i2: 'in' };
    const b1 = document.getElementById('dot-d2'), b2 = document.getElementById('dot-i1'), b3 = document.getElementById('dot-i2');
    const st = Stage(cv, { animate: false, ratio: 0.5, minH: 250, maxH: 340, draw(ctx, w, h) {
      const narrow = w < 520, cx = narrow ? w / 2 : w * 0.3, x1 = cx - 24, x2 = cx + 24, yt = h * 0.18, yb = h * 0.82;
      const [c1t, c1b] = coilV(ctx, x1, yt, yb, 1, C.ink), [c2t, c2b] = coilV(ctx, x2, yt, yb, -1, C.ink);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x1, yt); ctx.lineTo(x1 - 70, yt); ctx.moveTo(x1, yb); ctx.lineTo(x1 - 70, yb); ctx.moveTo(x2, yt); ctx.lineTo(x2 + 70, yt); ctx.moveTo(x2, yb); ctx.lineTo(x2 + 70, yb); ctx.stroke();
      dotAt(ctx, x1 - 13, c1t - 4); dotAt(ctx, x2 + 13, s.d2 === 'top' ? c2t - 4 : c2b + 4);
      /* 電流箭頭（都畫在上面那條線） */
      const ar = (xa, xb, y, txt) => { E.arrow(ctx, xa, y, xb, y, C.accent, 2.4); labelCJK(ctx, (xa + xb) / 2, y - 12, txt, C.accent, 13, 'center', '700'); };
      if (s.i1 === 'in') ar(x1 - 66, x1 - 22, yt - 14, 'i₁'); else ar(x1 - 22, x1 - 66, yt - 14, 'i₁');
      if (s.i2 === 'in') ar(x2 + 66, x2 + 22, yt - 14, 'i₂'); else ar(x2 + 22, x2 + 66, yt - 14, 'i₂');
      label(ctx, x1 - 74, (yt + yb) / 2, 'v₁', C.ink, 14, 'right', '700'); label(ctx, x2 + 74, (yt + yb) / 2, 'v₂', C.ink, 14, 'left', '700');
      label(ctx, x1 - 74, yt + 18, '+', C.ink, 14, 'right'); label(ctx, x1 - 74, yb - 8, '−', C.ink, 14, 'right');
      label(ctx, x2 + 74, yt + 18, '+', C.ink, 14, 'left'); label(ctx, x2 + 74, yb - 8, '−', C.ink, 14, 'left');
      /* 判斷：i1 流進點？i2 流進點？（i2 從上端流進；點在上 → 流進點） */
      const in1 = s.i1 === 'in', in2 = (s.i2 === 'in') === (s.d2 === 'top');
      const sign = in1 === in2 ? '+' : '−';
      /* v1、v2 都是上 + 下 −；i1 流進上端時 v1 = L1 di1/dt（被動符號），i2 流進上端時 v2 = L2 di2/dt */
      const s1 = in1 ? '' : '−', s2 = s.i2 === 'in' ? '' : '−';
      /* v1 的互感項：i2 流進線圈 2 的點 → 線圈 1 點端（上）為 + → v1 多 +M di2/dt */
      const m1 = in2 ? '+' : '−', m2 = in1 === (s.d2 === 'top') ? '+' : '−';
      const tx = narrow ? 12 : w * 0.58, ty = narrow ? h * 0.06 : h * 0.22;
      if (!narrow) {
        labelCJK(ctx, tx, ty, 'i₁ ' + (in1 ? '流進' : '流出') + '點、i₂ ' + (in2 ? '流進' : '流出') + '點', C.ink, 14, 'left', '700');
        labelCJK(ctx, tx, ty + 30, '→ 互感項取 ' + sign + 'M', C.accent, 18, 'left', '700');
        labelCJK(ctx, tx, ty + 72, 'v₁ = ' + s1 + 'L₁ di₁/dt ' + m1 + ' M di₂/dt', C.ink, 14, 'left');
        labelCJK(ctx, tx, ty + 100, 'v₂ = ' + s2 + 'L₂ di₂/dt ' + m2 + ' M di₁/dt', C.ink, 14, 'left');
        labelCJK(ctx, tx, ty + 136, '（v₁、v₂ 都量「上 +、下 −」）', C['ink-3'], 12, 'left');
      }
      setText('dot-sign', sign + 'M');
      setText('dot-v1', 'v₁ = ' + s1 + 'L₁ di₁/dt ' + m1 + ' M di₂/dt');
      setText('dot-v2', 'v₂ = ' + s2 + 'L₂ di₂/dt ' + m2 + ' M di₁/dt');
    } });
    const lab = () => {
      if (b1) b1.textContent = '線圈 2 的點：' + (s.d2 === 'top' ? '上' : '下');
      if (b2) b2.textContent = 'i₁：' + (s.i1 === 'in' ? '流進' : '流出') + '上端';
      if (b3) b3.textContent = 'i₂：' + (s.i2 === 'in' ? '流進' : '流出') + '上端';
    };
    if (b1) b1.addEventListener('click', () => { s.d2 = s.d2 === 'top' ? 'bot' : 'top'; lab(); st.redraw(); });
    if (b2) b2.addEventListener('click', () => { s.i1 = s.i1 === 'in' ? 'out' : 'in'; lab(); st.redraw(); });
    if (b3) b3.addEventListener('click', () => { s.i2 = s.i2 === 'in' ? 'out' : 'in'; lab(); st.redraw(); });
    lab();
  })();

  /* ── 13.3 能量三項 ── */
  (function energy() {
    const cv = document.getElementById('cv-en'); if (!cv) return;
    let L1 = 5, L2 = 4, k = 0.56, i1 = 3, i2 = -2, sg = 1;
    const sb = document.getElementById('en-sign');
    const st = Stage(cv, { animate: false, ratio: 0.42, minH: 220, maxH: 300, draw(ctx, w, h) {
      const M = k * Math.sqrt(L1 * L2), a = 0.5 * L1 * i1 * i1, b = 0.5 * L2 * i2 * i2, m = sg * M * i1 * i2, tot = a + b + m;
      const vals = [['½L₁i₁²', a, C.ink], ['½L₂i₂²', b, C.ink], [(sg > 0 ? '+' : '−') + 'M i₁ i₂', m, C.accent], ['總能量 w', tot, tot < -1e-9 ? C.bad : C.accent]];
      const max = Math.max(1, ...vals.map(v => Math.abs(v[1])));
      const x0 = Math.min(150, w * 0.3), mid = x0 + (w - x0 - 16) / 2, sc = Math.max(1, (w - x0 - 130) / 2) / max, rowH = (h - 30) / 4;
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mid, 10); ctx.lineTo(mid, h - 16); ctx.stroke();
      vals.forEach((v, i) => {
        const y = 14 + rowH * i, bh = Math.max(4, rowH * 0.5);
        labelCJK(ctx, 10, y + bh / 2 + 4, v[0], v[2], 13, 'left', '700');
        ctx.fillStyle = v[2]; ctx.globalAlpha = i === 3 ? 1 : 0.75;
        const L = v[1] * sc; ctx.fillRect(L >= 0 ? mid : mid + L, y, Math.abs(L), bh); ctx.globalAlpha = 1;
        label(ctx, L >= 0 ? mid + L + 6 : mid + L - 6, y + bh / 2 + 4, X.g(v[1], 3) + ' J', v[2], 12, L >= 0 ? 'left' : 'right', '700');
      });
      setText('en-m', X.g(M, 3) + ' H'); setText('en-w', X.g(tot, 4) + ' J');
      setText('en-min', '能量最小時（互感項取負、i₂/i₁ 最壞）仍 ≥ 0，因為 k ≤ 1');
    } });
    bindRange('en-l1', v => v + ' H', v => { L1 = v; st.redraw(); });
    bindRange('en-l2', v => v + ' H', v => { L2 = v; st.redraw(); });
    bindRange('en-k', v => v.toFixed(2), v => { k = v; st.redraw(); });
    bindRange('en-i1', v => v + ' A', v => { i1 = v; st.redraw(); });
    bindRange('en-i2', v => v + ' A', v => { i2 = v; st.redraw(); });
    if (sb) sb.addEventListener('click', () => { sg = -sg; sb.textContent = sg > 0 ? '互感項：+（同進同出）' : '互感項：−（一進一出）'; st.redraw(); });
  })();

  /* ── Example 13.1 ── */
  liveExample('#ex-131', {
    title: '例題 · 兩個網目、一組耦合線圈（課本 Example 13.1）',
    ratio: 0.3, minH: 150, maxH: 200,
    givens: [
      { id: 'a1-v', label: '電源 V', min: 2, max: 40, step: 1, value: 12, fmt: v => v + '∠0° V' },
      { id: 'a1-c', label: '電容 −jX<sub>C</sub>', min: 0, max: 10, step: 0.5, value: 4, fmt: v => '−j' + v + ' Ω' },
      { id: 'a1-l1', label: '線圈 1 jωL<sub>1</sub>', min: 1, max: 10, step: 0.5, value: 5, fmt: v => 'j' + v + ' Ω' },
      { id: 'a1-l2', label: '線圈 2 jωL<sub>2</sub>', min: 1, max: 10, step: 0.5, value: 6, fmt: v => 'j' + v + ' Ω' },
      { id: 'a1-m', label: '互感 jωM', min: 0, max: 7.5, step: 0.5, value: 3, fmt: v => 'j' + v + ' Ω' },
      { id: 'a1-r', label: '負載 R', min: 1, max: 30, step: 1, value: 12, fmt: v => v + ' Ω' }
    ],
    compute: g => {
      const V = g['a1-v'], Xc = g['a1-c'], X1 = g['a1-l1'], X2 = g['a1-l2'], XM = g['a1-m'], R = g['a1-r'];
      const kk = XM / Math.sqrt(X1 * X2);
      const z11 = X.c(0, X1 - Xc), z12 = X.c(0, -XM), z22 = X.c(R, X2);
      const [I1, I2] = solve2(z11, z12, z12, z22, X.c(V, 0), X.c(0, 0));
      return { V, Xc, X1, X2, XM, R, kk, z11, z22, I1, I2 };
    },
    question: (g, r) => '求電路的相量電流 I<sub>1</sub>、I<sub>2</sub>：電源 ' + r.V + '∠0° V、電容 −j' + r.Xc + ' Ω、線圈 j' + r.X1 + ' Ω 與 j' + r.X2 + ' Ω（點都在上）、互感 j' + r.XM + ' Ω、負載 ' + r.R + ' Ω。',
    questionEn: (g, r) => 'Calculate the phasor currents I<sub>1</sub> and I<sub>2</sub>: source ' + r.V + '∠0° V, capacitor −j' + r.Xc + ' Ω, coils j' + r.X1 + ' Ω and j' + r.X2 + ' Ω (dots on top), mutual reactance j' + r.XM + ' Ω, load ' + r.R + ' Ω.',
    steps: (g, r) => [
      { t: 'Step 1　判斷互感正負。', note: 'I<sub>1</sub> 從點流進線圈 1；I<sub>2</sub> 順時針從線圈 2 的點流出 → 一進一出。', eq: '互感項取 −j' + r.XM },
      { t: 'Step 2　迴路 1。', eq: '(' + X.rect(r.z11, 1) + ')I<sub>1</sub> − j' + r.XM + ' I<sub>2</sub> = ' + r.V },
      { t: 'Step 3　迴路 2。', eq: '−j' + r.XM + ' I<sub>1</sub> + (' + X.rect(r.z22, 1) + ')I<sub>2</sub> = 0' },
      { t: 'Step 4　解聯立。', eq: 'I<sub>1</sub> = ' + X.pol(r.I1, 4, 2) + ' A；I<sub>2</sub> = ' + X.pol(r.I2, 4, 2) + ' A',
        after: r.XM === 0 ? 'M = 0：兩個線圈沒有耦合，右邊沒有電源，I<sub>2</sub> = 0 —— 謎題的答案就是互感。'
          : r.kk > 1 ? '注意：這組數字的 k = ' + X.g(r.kk, 3) + ' &gt; 1，現實中不可能（M ≤ √(L<sub>1</sub>L<sub>2</sub>)），只是數學上還解得出來。'
          : 'k = ' + X.g(r.kk, 3) + (r.kk > 0.5 ? '（緊耦合）' : '（鬆耦合）') + '。M 越大，送到右邊的電流越大。' }
    ],
    answer: (g, r) => 'I<sub>1</sub> = ' + X.pol(r.I1, 4, 2) + ' A；I<sub>2</sub> = ' + X.pol(r.I2, 4, 2) + ' A',
    draw: (ctx, w, h, g, r) => {
      const m1 = X.mag(r.I1), m2 = X.mag(r.I2), mx = Math.max(m1, m2, 1e-9), x0 = 70, L = w - x0 - 80;
      labelCJK(ctx, 10, h * 0.35 + 5, '|I₁|', C.ink, 13, 'left', '700'); labelCJK(ctx, 10, h * 0.7 + 5, '|I₂|', C.accent, 13, 'left', '700');
      ctx.fillStyle = C.ink; ctx.fillRect(x0, h * 0.35 - 9, m1 / mx * L, 18); ctx.fillStyle = C.accent; ctx.fillRect(x0, h * 0.7 - 9, m2 / mx * L, 18);
      label(ctx, x0 + m1 / mx * L + 6, h * 0.35 + 5, X.g(m1, 4) + ' A', C.ink, 12, 'left', '700');
      label(ctx, x0 + m2 / mx * L + 6, h * 0.7 + 5, X.g(m2, 4) + ' A', C.accent, 12, 'left', '700');
    }
  });

  /* ── Example 13.3 ── */
  liveExample('#ex-133', {
    title: '例題 · 耦合係數與 t 時刻的能量（課本 Example 13.3）',
    ratio: 0.3, minH: 160, maxH: 210,
    givens: [
      { id: 'a3-l1', label: 'L<sub>1</sub>', min: 1, max: 10, step: 0.5, value: 5, fmt: v => v + ' H' },
      { id: 'a3-l2', label: 'L<sub>2</sub>', min: 1, max: 10, step: 0.5, value: 4, fmt: v => v + ' H' },
      { id: 'a3-m', label: 'M', min: 0, max: 6, step: 0.1, value: 2.5, fmt: v => v.toFixed(1) + ' H' },
      { id: 'a3-t', label: '時間 t', min: 0, max: 3, step: 0.05, value: 1, fmt: v => v.toFixed(2) + ' s' }
    ],
    compute: g => {
      const L1 = g['a3-l1'], L2 = g['a3-l2'], M0 = g['a3-m'], t = g['a3-t'], w0 = 4;
      const Mmax = Math.sqrt(L1 * L2), M = Math.min(M0, Mmax), k = M / Mmax;
      const z11 = X.c(10, w0 * L1), z12 = X.c(0, w0 * M), z22 = X.c(0, w0 * L2 - 4);
      const [I1, I2] = solve2(z11, z12, z12, z22, X.p(60, 30), X.c(0, 0));
      const ph = w0 * t / RAD;
      const i1 = X.mag(I1) * Math.cos((ph + X.ang(I1)) * RAD), i2 = X.mag(I2) * Math.cos((ph + X.ang(I2)) * RAD);
      const wa = 0.5 * L1 * i1 * i1, wb = 0.5 * L2 * i2 * i2, wm = M * i1 * i2;
      return { L1, L2, M, M0, Mmax, k, t, I1, I2, ph, i1, i2, wa, wb, wm, w: wa + wb + wm, z22 };
    },
    question: (g, r) => 'Example 13.3 的電路（10 Ω、L<sub>1</sub> = ' + r.L1 + ' H、L<sub>2</sub> = ' + r.L2 + ' H、M = ' + X.g(r.M, 3) + ' H、1/16 F），v = 60 cos(4t + 30°) V。求耦合係數，以及 t = ' + r.t.toFixed(2) + ' s 時耦合線圈儲存的能量。',
    questionEn: (g, r) => 'For the circuit of Example 13.3 with L<sub>1</sub> = ' + r.L1 + ' H, L<sub>2</sub> = ' + r.L2 + ' H, M = ' + X.g(r.M, 3) + ' H and v = 60 cos(4t + 30°) V, determine the coupling coefficient and the energy stored at t = ' + r.t.toFixed(2) + ' s.',
    steps: (g, r) => [
      { t: 'Step 1　耦合係數。', eq: 'k = M/√(L<sub>1</sub>L<sub>2</sub>) = ' + X.g(r.M, 3) + '/' + X.g(r.Mmax, 4) + ' = ' + X.g(r.k, 3),
        note: r.M0 > r.Mmax ? '你設的 M 超過上限 √(L<sub>1</sub>L<sub>2</sub>)，這裡自動壓到 k = 1。' : r.k > 0.5 ? 'k &gt; 0.5：緊耦合。' : 'k &lt; 0.5：鬆耦合。' },
      { t: 'Step 2　頻域網目方程（ω = 4）。', eq: '(10 + j' + X.g(4 * r.L1, 3) + ')I<sub>1</sub> + j' + X.g(4 * r.M, 3) + 'I<sub>2</sub> = 60∠30°；j' + X.g(4 * r.M, 3) + 'I<sub>1</sub> + (' + X.rect(r.z22, 1) + ')I<sub>2</sub> = 0' },
      { t: 'Step 3　解出相量。', eq: 'I<sub>1</sub> = ' + X.pol(r.I1, 4, 1) + ' A；I<sub>2</sub> = ' + X.pol(r.I2, 4, 1) + ' A' },
      { t: 'Step 4　代時間。', eq: '4t = ' + X.g(4 * r.t, 3) + ' rad = ' + X.g(r.ph, 4) + '°：i<sub>1</sub> = ' + X.g(r.i1, 4) + ' A、i<sub>2</sub> = ' + X.g(r.i2, 4) + ' A' },
      { t: 'Step 5　能量。', eq: 'w = ' + X.g(r.wa, 4) + ' + ' + X.g(r.wb, 4) + ' + (' + X.g(r.wm, 4) + ') = ' + X.g(r.w, 4) + ' J',
        after: '兩個電流都流進點，互感項取 +；這一刻 i<sub>1</sub>i<sub>2</sub> ' + (r.wm < 0 ? '&lt; 0，所以互感項反而讓總能量變少。' : '≥ 0，互感項讓總能量變多。') }
    ],
    answer: (g, r) => 'k = ' + X.g(r.k, 3) + '；w = ' + X.g(r.w, 4) + ' J',
    draw: (ctx, w, h, g, r) => {
      const vals = [['½L₁i₁²', r.wa, C.ink], ['½L₂i₂²', r.wb, C.ink], ['M i₁ i₂', r.wm, C.accent], ['w', r.w, C.accent]];
      const mx = Math.max(1e-9, ...vals.map(v => Math.abs(v[1]))), mid = w * 0.55, sc = (w * 0.36) / mx, rh = (h - 10) / 4;
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(mid, 4); ctx.lineTo(mid, h - 4); ctx.stroke();
      vals.forEach((v, i) => {
        const y = 6 + rh * i, L = v[1] * sc;
        labelCJK(ctx, 8, y + rh * 0.45, v[0], v[2], 12, 'left', '700');
        ctx.fillStyle = v[2]; ctx.fillRect(L >= 0 ? mid : mid + L, y + 2, Math.abs(L), rh * 0.55);
        label(ctx, L >= 0 ? mid + L + 4 : mid + L - 4, y + rh * 0.45, X.g(v[1], 3), v[2], 11, L >= 0 ? 'left' : 'right');
      });
    }
  });

  if (window.__ch12Quiz) window.__ch12Quiz([
    { zh: '互感電壓存在的條件？', en: 'Mutual voltage exists only when:', o: [['線圈靠近且電流在變化', 'the coils are close and the current is time-varying'], ['電流是直流', 'the current is dc'], ['兩個線圈用電線連接', 'the coils are wired together'], ['電阻很大', 'the resistance is large']], a: 0, e: 'v₂ = M di₁/dt。' },
    { zh: '電流從線圈 1 的點流進，線圈 2 的點端是？', en: 'Current enters the dotted terminal of coil 1. The dotted terminal of coil 2 is:', o: [['正', 'positive'], ['負', 'negative'], ['零', 'zero'], ['不一定', 'undetermined']], a: 0, e: '打點規則第一句。' },
    { zh: '兩個電流一個流進點、一個流出點，互感項取？', en: 'One current enters a dot and the other leaves a dot. The mutual term is:', o: [['−M', '−M'], ['+M', '+M'], ['0', '0'], ['2M', '2M']], a: 0, e: '同進同出 +、一進一出 −。' },
    { zh: '串聯加成的總電感？', en: 'Total inductance of series-aiding coils:', o: [['L₁ + L₂ + 2M', 'L₁ + L₂ + 2M'], ['L₁ + L₂ − 2M', 'L₁ + L₂ − 2M'], ['L₁ + L₂', 'L₁ + L₂'], ['L₁L₂/(L₁ + L₂)', 'L₁L₂/(L₁ + L₂)']], a: 0, e: '每個線圈多 M，共 2M。' },
    { zh: 'L₁ = 2 H、L₂ = 8 H、M = 3 H，k = ？', en: 'L₁ = 2 H, L₂ = 8 H, M = 3 H. k = ?', o: [['0.75', '0.75'], ['0.1875', '0.1875'], ['1.333', '1.333'], ['5.333', '5.333']], a: 0, e: 'k = 3/√16 = 0.75（Review Question 13.3）。' },
    { zh: 'M 的上限？', en: 'The upper limit of M is:', o: [['√(L₁L₂)', '√(L₁L₂)'], ['L₁ + L₂', 'L₁ + L₂'], ['L₁L₂', 'L₁L₂'], ['沒有上限', 'there is no limit']], a: 0, e: '被動電路能量 ≥ 0 推出來的。' },
    { zh: 'k > 0.5 稱為？', en: 'Coils with k > 0.5 are said to be:', o: [['緊耦合', 'tightly coupled'], ['鬆耦合', 'loosely coupled'], ['完美耦合', 'perfectly coupled'], ['不耦合', 'uncoupled']], a: 0, e: 'k = 1 才叫完美耦合。' },
    { zh: '耦合線圈儲存的能量多出哪一項？', en: 'Compared with two separate inductors, the stored energy has an extra term:', o: [['±M i₁ i₂', '±M i₁ i₂'], ['½M i₁²', '½M i₁²'], ['M(i₁ + i₂)', 'M(i₁ + i₂)'], ['沒有多', 'none']], a: 0, e: 'w = ½L₁i₁² + ½L₂i₂² ± M i₁ i₂。' },
    { zh: '頻域中互感項寫成？', en: 'In the frequency domain the mutual term is:', o: [['jωM I', 'jωM I'], ['M/jω', 'M/jω'], ['ωM', 'ωM'], ['M I', 'M I']], a: 0, e: 'd/dt → jω。' },
    { zh: 'Example 13.1 右邊沒有電源，I₂ 從哪來？', en: 'In Example 13.1 the right loop has no source. Where does I₂ come from?', o: [['線圈 1 透過互感感應的電壓', 'the voltage induced by coil 1 through M'], ['漏電', 'leakage'], ['電容放電', 'capacitor discharge'], ['它其實是 0', 'it is actually zero']], a: 0, e: 'M = 0 時 I₂ 就是 0（拉例題的 jωM 滑桿看看）。' }
  ], ['互感和打點規則都穩了，去 PART 2 看變壓器。', '打點規則再用練習機玩幾次，正負號就不會錯。', '先回故事模式看「打點規則」那三幕，再做一次。']);
})();
