/* ============================================================
   電路學 CH13 PART 2（13.4 線性變壓器、13.5 理想變壓器）
   互動模組：cv-refl（反射阻抗在複數平面上怎麼加）、cv-ideal（理想變壓器：電壓、電流、阻抗）
   可互動例題：Example 13.4、Example 13.8；觀念小測驗
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, X = window.__CX;
  if (!E || !X) return;
  const { C, Stage, label, labelCJK, liveExample, bindRange, setText } = E;

  /* ── 13.4 反射阻抗 ── */
  (function refl() {
    const cv = document.getElementById('cv-refl'); if (!cv) return;
    let k = 0.7, RL = 20, XL = 0;
    const st = Stage(cv, { animate: false, ratio: 0.5, minH: 250, maxH: 340, draw(ctx, w, h) {
      const X1 = 20, X2 = 40, wM = k * Math.sqrt(X1 * X2);
      const Z11 = X.c(10, X1), Z22 = X.c(RL, X2 + XL), ZR = X.div(X.c(wM * wM, 0), Z22), Zin = X.add(Z11, ZR);
      const pts = [Z11, Zin, X.c(0, 0)];
      const xs = pts.map(p => p.re), ys = pts.map(p => p.im);
      const xmin = Math.min(0, ...xs) - 10, xmax = Math.max(...xs) + 30, ymin = Math.min(0, ...ys) - 15, ymax = Math.max(0, ...ys) + 15;
      const sc = Math.min((w - 60) / (xmax - xmin), (h - 50) / (ymax - ymin));
      const ox = 40 - xmin * sc, oy = 20 + ymax * sc, P = z => [ox + z.re * sc, oy - z.im * sc];
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(w - 10, oy); ctx.moveTo(ox, 10); ctx.lineTo(ox, h - 10); ctx.stroke();
      label(ctx, w - 14, oy - 6, 'R', C['ink-3'], 12, 'right'); label(ctx, ox + 6, 18, 'jX', C['ink-3'], 12, 'left');
      const [ax, ay] = P(Z11), [bx, by] = P(Zin);
      E.arrow(ctx, ox, oy, ax, ay, C.ink, 2.4); E.arrow(ctx, ax, ay, bx, by, C.accent, 2.6);
      ctx.setLineDash([5, 4]); E.arrow(ctx, ox, oy, bx, by, C['ink-3'], 1.6); ctx.setLineDash([]);
      labelCJK(ctx, (ox + ax) / 2 + 8, (oy + ay) / 2, '一次側 R₁ + jωL₁', C.ink, 12, 'left', '700');
      labelCJK(ctx, bx + 8, by - 8, 'Z<sub>in</sub>', C['ink-3'], 12, 'left', '700');
      setText('rf-wm', 'j' + X.g(wM, 3) + ' Ω'); setText('rf-zr', X.rect(ZR, 2) + ' Ω'); setText('rf-zin', X.pol(Zin, 4, 1) + ' Ω');
      labelCJK(ctx, Math.min(w - 150, bx + 10), by + 18, '反射阻抗 ' + X.rect(ZR, 1), C.accent, 12, 'left', '700');
    } });
    bindRange('rf-k', v => v.toFixed(2), v => { k = v; st.redraw(); });
    bindRange('rf-rl', v => v + ' Ω', v => { RL = v; st.redraw(); });
    bindRange('rf-xl', v => (v < 0 ? '−j' : 'j') + Math.abs(v) + ' Ω', v => { XL = v; st.redraw(); });
  })();

  /* ── 13.5 理想變壓器 ── */
  (function ideal() {
    const cv = document.getElementById('cv-ideal'); if (!cv) return;
    let n = 2, V1 = 120, RL = 20, dot = 1;
    const db = document.getElementById('id-dot');
    const st = Stage(cv, { animate: false, ratio: 0.45, minH: 230, maxH: 320, draw(ctx, w, h) {
      const V2 = dot * n * V1, I2 = V2 / RL, I1 = n * Math.abs(I2), Zin = RL / (n * n);
      const rows = [['一次側電壓 V₁', V1, ' V', C.ink], ['二次側電壓 V₂', V2, ' V', C.accent], ['一次側電流 I₁', I1, ' A', C.ink], ['二次側電流 |I₂|', Math.abs(I2), ' A', C.accent]];
      const narrow = w < 520, x0 = narrow ? 120 : 170, L = w - x0 - 90, rh = (h - 50) / 4;
      const vmax = Math.max(Math.abs(V1), Math.abs(V2)), imax = Math.max(I1, Math.abs(I2), 1e-9);
      rows.forEach((r, i) => {
        const y = 12 + rh * i, m = i < 2 ? vmax : imax, len = Math.abs(r[1]) / m * L;
        labelCJK(ctx, 8, y + rh * 0.5, r[0], r[3], 12.5, 'left', '700');
        ctx.fillStyle = r[3]; ctx.globalAlpha = i % 2 ? 1 : 0.8; ctx.fillRect(x0, y + rh * 0.2, Math.max(2, len), rh * 0.5); ctx.globalAlpha = 1;
        label(ctx, x0 + len + 6, y + rh * 0.5 + 4, X.g(r[1], 4) + r[2], r[3], 12, 'left', '700');
      });
      labelCJK(ctx, 8, h - 14, '電源看到的阻抗 Z<sub>in</sub> = R<sub>L</sub>/n² = ' + X.g(Zin, 4) + ' Ω（負載 ' + RL + ' Ω）', C.accent, 13, 'left', '700');
      setText('id-v2', X.g(V2, 4) + ' V'); setText('id-zin', X.g(Zin, 4) + ' Ω');
      setText('id-p', X.g(V1 * I1, 4) + ' W = ' + X.g(Math.abs(V2 * I2), 4) + ' W');
    } });
    bindRange('id-n', v => (v >= 1 ? v.toFixed(2) : v.toFixed(2)) + (v > 1 ? '（升壓）' : v < 1 ? '（降壓）' : '（隔離）'), v => { n = v; st.redraw(); });
    bindRange('id-v1', v => v + ' V', v => { V1 = v; st.redraw(); });
    bindRange('id-rl', v => v + ' Ω', v => { RL = v; st.redraw(); });
    if (db) db.addEventListener('click', () => { dot = -dot; db.textContent = dot > 0 ? '二次側的點：上（V₂ = +nV₁）' : '二次側的點：下（V₂ = −nV₁）'; st.redraw(); });
  })();

  /* ── Example 13.4 ── */
  liveExample('#ex-134', {
    title: '例題 · 反射阻抗求 Z<sub>in</sub>、I<sub>1</sub>（課本 Example 13.4）',
    ratio: 0.28, minH: 150, maxH: 200,
    givens: [
      { id: 'b4-m', label: 'ωM', min: 0, max: 28, step: 0.5, value: 5, fmt: v => 'j' + v + ' Ω' },
      { id: 'b4-r', label: 'Z<sub>L</sub> 實部', min: 0, max: 200, step: 5, value: 80, fmt: v => v + ' Ω' },
      { id: 'b4-x', label: 'Z<sub>L</sub> 虛部', min: -150, max: 150, step: 5, value: 60, fmt: v => (v < 0 ? '−j' : 'j') + Math.abs(v) + ' Ω' }
    ],
    compute: g => {
      const wM = g['b4-m'], ZL = X.c(g['b4-r'], g['b4-x']), Z1 = X.c(60, -100), Z2 = X.c(30, 40);
      const Z22 = X.add(X.add(X.c(0, 40), Z2), ZL), ZR = X.div(X.c(wM * wM, 0), Z22), Z11 = X.add(Z1, X.c(0, 20)), Zin = X.add(Z11, ZR);
      const I1 = X.div(X.p(50, 60), Zin);
      return { wM, ZL, Z22, ZR, Z11, Zin, I1, kk: wM / Math.sqrt(20 * 40) };
    },
    question: (g, r) => 'Z<sub>1</sub> = 60 − j100 Ω、Z<sub>2</sub> = 30 + j40 Ω、Z<sub>L</sub> = ' + X.rect(r.ZL, 0) + ' Ω，一次側 j20、二次側 j40、互感 j' + r.wM + ' Ω，電源 50∠60° V。求輸入阻抗與 I<sub>1</sub>。',
    questionEn: (g, r) => 'With Z<sub>1</sub> = 60 − j100 Ω, Z<sub>2</sub> = 30 + j40 Ω, Z<sub>L</sub> = ' + X.rect(r.ZL, 0) + ' Ω, coils j20 and j40, mutual reactance j' + r.wM + ' Ω and a 50∠60° V source, calculate the input impedance and current I<sub>1</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　二次側總阻抗。', eq: 'Z<sub>22</sub> = j40 + Z<sub>2</sub> + Z<sub>L</sub> = ' + X.rect(r.Z22, 1) + ' Ω' },
      { t: 'Step 2　反射阻抗。', eq: 'Z<sub>R</sub> = (' + r.wM + ')<sup>2</sup>/Z<sub>22</sub> = ' + X.rect(r.ZR, 3) + ' Ω',
        note: X.mag(r.ZR) < 0.02 * X.mag(r.Z11) ? '反射阻抗比一次側小很多 → 二次側幾乎感覺不到（M 太小或 Z<sub>22</sub> 太大）。' : '反射阻抗已經不能忽略了。' },
      { t: 'Step 3　Z<sub>in</sub>。', eq: 'Z<sub>in</sub> = 60 − j80 + Z<sub>R</sub> = ' + X.rect(r.Zin, 2) + ' = ' + X.pol(r.Zin, 5, 1) + ' Ω' },
      { t: 'Step 4　I<sub>1</sub>。', eq: 'I<sub>1</sub> = 50∠60°/Z<sub>in</sub> = ' + X.pol(r.I1, 4, 1) + ' A',
        after: r.kk > 1 ? '注意：ωM = ' + r.wM + ' 已經超過 √(20 × 40) = 28.3 的上限（k &gt; 1），現實做不到。' : 'k = ' + X.g(r.kk, 3) + '。' }
    ],
    answer: (g, r) => 'Z<sub>in</sub> = ' + X.pol(r.Zin, 5, 1) + ' Ω；I<sub>1</sub> = ' + X.pol(r.I1, 4, 1) + ' A',
    draw: (ctx, w, h, g, r) => {
      const a = X.mag(r.Z11), b = X.mag(r.ZR), mx = Math.max(a, b), L = w - 220;
      labelCJK(ctx, 10, h * 0.33 + 4, '|一次側|', C.ink, 12, 'left', '700'); labelCJK(ctx, 10, h * 0.7 + 4, '|反射阻抗|', C.accent, 12, 'left', '700');
      ctx.fillStyle = C.ink; ctx.fillRect(100, h * 0.33 - 9, a / mx * L, 18); ctx.fillStyle = C.accent; ctx.fillRect(100, h * 0.7 - 9, Math.max(2, b / mx * L), 18);
      label(ctx, 106 + a / mx * L, h * 0.33 + 4, X.g(a, 4) + ' Ω', C.ink, 12, 'left'); label(ctx, 106 + Math.max(2, b / mx * L), h * 0.7 + 4, X.g(b, 3) + ' Ω', C.accent, 12, 'left');
    }
  });

  /* ── Example 13.8 ── */
  liveExample('#ex-138', {
    title: '例題 · 理想變壓器：反射＋點的正負號（課本 Example 13.8）',
    ratio: 0.28, minH: 150, maxH: 200,
    givens: [
      { id: 'b8-n', label: '匝數比 n（1 : n）', min: 0.25, max: 5, step: 0.25, value: 2, fmt: v => '1 : ' + v },
      { id: 'b8-r', label: '負載 R<sub>L</sub>', min: 1, max: 100, step: 1, value: 20, fmt: v => v + ' Ω' },
      { id: 'b8-c', label: '電容 −jX<sub>C</sub>', min: 0, max: 20, step: 1, value: 6, fmt: v => '−j' + v + ' Ω' }
    ],
    compute: g => {
      const n = g['b8-n'], RL = g['b8-r'], Xc = g['b8-c'], ZR = RL / (n * n), Zin = X.c(4 + ZR, -Xc), I1 = X.div(X.c(120, 0), Zin);
      const I2 = X.sc(I1, -1 / n), Vo = X.sc(I2, RL), S = X.mul(X.c(120, 0), X.conj(I1));
      return { n, RL, Xc, ZR, Zin, I1, I2, Vo, S };
    },
    question: (g, r) => '120∠0° V rms、4 Ω、−j' + r.Xc + ' Ω，接 1 : ' + r.n + ' 理想變壓器（一次側點在下、二次側點在上），負載 ' + r.RL + ' Ω。求 I<sub>1</sub>、V<sub>o</sub> 和電源送出的複功率。',
    questionEn: (g, r) => 'A 120∠0° V rms source with 4 Ω and −j' + r.Xc + ' Ω feeds a 1 : ' + r.n + ' ideal transformer (primary dot at the bottom, secondary dot at the top) with a ' + r.RL + '-Ω load. Find I<sub>1</sub>, V<sub>o</sub>, and the complex power supplied by the source.',
    steps: (g, r) => [
      { t: 'Step 1　反射。', eq: 'Z<sub>R</sub> = ' + r.RL + '/' + r.n + '<sup>2</sup> = ' + X.g(r.ZR, 4) + ' Ω',
        note: r.n > 1 ? '升壓：負載看起來變小。' : r.n < 1 ? '降壓：負載看起來變大。' : 'n = 1：負載原封不動。' },
      { t: 'Step 2　I<sub>1</sub>。', eq: 'Z<sub>in</sub> = ' + X.rect(r.Zin, 2) + ' Ω ⟹ I<sub>1</sub> = ' + X.pol(r.I1, 4, 2) + ' A' },
      { t: 'Step 3　看點。', eq: 'I<sub>1</sub>、I<sub>2</sub> 都從點流出 ⟹ I<sub>2</sub> = −I<sub>1</sub>/n = ' + X.pol(r.I2, 4, 2) + ' A' },
      { t: 'Step 4　V<sub>o</sub>、S。', eq: 'V<sub>o</sub> = ' + r.RL + 'I<sub>2</sub> = ' + X.pol(r.Vo, 4, 2) + ' V；S = 120 I<sub>1</sub>* = ' + X.pol(r.S, 5, 2) + ' VA',
        after: '檢查：負載吃 |I<sub>2</sub>|<sup>2</sup>R<sub>L</sub> = ' + X.g(Math.pow(X.mag(r.I2), 2) * r.RL, 5) + ' W，跟一次側反射電阻吃的 |I<sub>1</sub>|<sup>2</sup>Z<sub>R</sub> = ' + X.g(Math.pow(X.mag(r.I1), 2) * r.ZR, 5) + ' W 一樣 —— 理想變壓器不吃功率。' }
    ],
    answer: (g, r) => 'I<sub>1</sub> = ' + X.pol(r.I1, 4, 2) + ' A；V<sub>o</sub> = ' + X.pol(r.Vo, 4, 2) + ' V；S = ' + X.pol(r.S, 5, 2) + ' VA',
    draw: (ctx, w, h, g, r) => {
      const mx = Math.max(r.RL, r.ZR), L = w - 200;
      labelCJK(ctx, 10, h * 0.33 + 4, '負載本人', C.ink, 12, 'left', '700'); labelCJK(ctx, 10, h * 0.7 + 4, '電源看到的', C.accent, 12, 'left', '700');
      ctx.fillStyle = C.ink; ctx.fillRect(100, h * 0.33 - 9, r.RL / mx * L, 18); ctx.fillStyle = C.accent; ctx.fillRect(100, h * 0.7 - 9, r.ZR / mx * L, 18);
      label(ctx, 106 + r.RL / mx * L, h * 0.33 + 4, r.RL + ' Ω', C.ink, 12, 'left'); label(ctx, 106 + r.ZR / mx * L, h * 0.7 + 4, X.g(r.ZR, 4) + ' Ω', C.accent, 12, 'left');
    }
  });

  if (window.__ch12Quiz) window.__ch12Quiz([
    { zh: '線性變壓器的反射阻抗？', en: 'The reflected impedance of a linear transformer is:', o: [['ω²M²/(R₂ + jωL₂ + Z<sub>L</sub>)', 'ω²M²/(R₂ + jωL₂ + Z<sub>L</sub>)'], ['Z<sub>L</sub>/n²', 'Z<sub>L</sub>/n²'], ['jωM', 'jωM'], ['ωM/Z<sub>L</sub>', 'ωM/Z<sub>L</sub>']], a: 0, e: '式 13.42。Z<sub>L</sub>/n² 是理想變壓器。' },
    { zh: '換掉線性變壓器的點的位置，Z<sub>in</sub> 會？', en: 'If the dots of a linear transformer are moved, Z<sub>in</sub>:', o: [['不變', 'does not change'], ['變號', 'changes sign'], ['變成兩倍', 'doubles'], ['變成零', 'becomes zero']], a: 0, e: '公式裡是 M²。' },
    { zh: 'T 型等效（標準方向）中間那支是？', en: 'In the T-equivalent (standard directions), the shunt inductance is:', o: [['M', 'M'], ['L₁ − M', 'L₁ − M'], ['L₂ − M', 'L₂ − M'], ['L₁L₂ − M²', 'L₁L₂ − M²']], a: 0, e: 'L<sub>a</sub> = L₁ − M、L<sub>b</sub> = L₂ − M、L<sub>c</sub> = M。' },
    { zh: '理想變壓器的耦合係數？', en: 'The coupling coefficient of an ideal transformer is:', o: [['1', '1'], ['0', '0'], ['0.5', '0.5'], ['∞', '∞']], a: 0, e: '完美耦合。' },
    { zh: 'n = N₂/N₁ = 0.05 的變壓器是？', en: 'A transformer with n = N₂/N₁ = 0.05 is a:', o: [['降壓變壓器', 'step-down transformer'], ['升壓變壓器', 'step-up transformer'], ['隔離變壓器', 'isolation transformer'], ['自耦變壓器', 'autotransformer']], a: 0, e: 'n &lt; 1。' },
    { zh: '理想變壓器 V₂ = nV₁，則 |I₂| = ？', en: 'For an ideal transformer with V₂ = nV₁, |I₂| = ?', o: [['|I₁|/n', '|I₁|/n'], ['n|I₁|', 'n|I₁|'], ['|I₁|', '|I₁|'], ['n²|I₁|', 'n²|I₁|']], a: 0, e: '功率守恆：電壓乘 n、電流除 n。' },
    { zh: 'I₁、I₂ 都流進點，電流關係用？', en: 'If I₁ and I₂ both enter the dotted terminals, use:', o: [['−n', '−n'], ['+n', '+n'], ['n²', 'n²'], ['1', '1']], a: 0, e: '電流規則跟電壓相反。' },
    { zh: '理想變壓器從一次側看到的 Z<sub>in</sub>？', en: 'The input impedance seen from the primary of an ideal transformer is:', o: [['Z<sub>L</sub>/n²', 'Z<sub>L</sub>/n²'], ['n²Z<sub>L</sub>', 'n²Z<sub>L</sub>'], ['Z<sub>L</sub>/n', 'Z<sub>L</sub>/n'], ['Z<sub>L</sub>', 'Z<sub>L</sub>']], a: 0, e: '式 13.60。' },
    { zh: '二次側反射到一次側時，電壓源要？', en: 'When reflecting the secondary to the primary, a voltage source is:', o: [['除以 n', 'divided by n'], ['乘以 n', 'multiplied by n'], ['除以 n²', 'divided by n²'], ['不變', 'unchanged']], a: 0, e: '阻抗 ÷ n²、電壓 ÷ n、電流 × n。' },
    { zh: '一、二次側之間有電阻相連時？', en: 'When a resistor connects the primary and secondary sides:', o: [['不能反射，用網目或節點分析', 'reflection fails; use mesh or nodal analysis'], ['照樣反射', 'reflect as usual'], ['電阻除以 n', 'divide the resistor by n'], ['變壓器失效', 'the transformer stops working']], a: 0, e: 'Example 13.9。' }
  ], ['變壓器都會了，去 PART 3 看自耦變壓器和應用。', '再玩一下理想變壓器的槓桿，把 n 拉到 0.5 和 4 看看。', '先回故事模式看「正負號：兩條規則」那幕，再做一次。']);
})();
