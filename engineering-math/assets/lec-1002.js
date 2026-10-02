/* ============================================================
   工程數學 — 10/2 上課筆記
   互動：單位圓（尤拉公式）、ℒ(f⁽ⁿ⁾) 展開器、存在條件的極限比賽
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, disc, label, labelCJK, arrow, bindRange, setText, clamp, TAU, pointerPos, liveExample } = E;
  const MINUS = '−';
  const fix = (x, n) => (Math.abs(x) < 5e-13 ? 0 : x).toFixed(n === undefined ? 2 : n).replace('-', MINUS);

  /* ---------- 單位圓 ---------- */
  const cv = document.getElementById('cv-euler');
  if (cv) {
    let th = 40 * Math.PI / 180, R = 1, cx = 0, cy = 0;
    const st = Stage(cv, {
      ratio: w => (w < 520 ? 0.9 : 0.5), minH: 260, maxH: 380, animate: false,
      draw(ctx, w, h) {
        R = Math.max(0, Math.min(w * 0.3, h * 0.36));
        cx = w / 2; cy = h / 2;
        ctx.strokeStyle = C.line; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - R - 26, cy); ctx.lineTo(cx + R + 26, cy);
        ctx.moveTo(cx, cy + R + 22); ctx.lineTo(cx, cy - R - 22); ctx.stroke();
        label(ctx, cx + R + 18, cy - 10, 'Re', C['ink-3'], 11, 'center');
        label(ctx, cx + 16, cy - R - 16, 'Im', C['ink-3'], 11, 'center');
        ctx.strokeStyle = C['ink-3']; ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
        label(ctx, cx - R - 6, cy + 12, '−1', C['ink-3'], 10, 'right');
        label(ctx, cx + R + 4, cy + 12, '1', C['ink-3'], 10, 'left');
        const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th), my = cy + R * Math.sin(th);
        /* cos、sin 投影 */
        ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3'];
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, my); ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = C['p-real']; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
        ctx.strokeStyle = C['q-react']; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
        /* 角度弧 */
        ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.22, 0, -th, th > 0); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.16, 0, th, th < 0); ctx.stroke();
        /* 兩條半徑 */
        ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
        ctx.strokeStyle = C['ink-3']; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, my); ctx.stroke(); ctx.setLineDash([]);
        disc(ctx, px, py, 7, C.accent, C.paper);
        disc(ctx, px, my, 6, C.paper, C['ink-2']);
        const right = Math.cos(th) >= 0, ax = right ? 'left' : 'right', dx = right ? 12 : -12;
        label(ctx, px + dx, py + (Math.sin(th) >= 0 ? -12 : 12), 'e<sup>jθ</sup>', C.accent, 13, ax, '700');
        label(ctx, px + dx, my + (Math.sin(th) >= 0 ? 12 : -12), 'e<sup>−jθ</sup>', C['ink-2'], 13, ax, '700');
        label(ctx, (cx + px) / 2, cy + (Math.sin(th) >= 0 ? 14 : -14), 'cos θ', C['p-real'], 11, 'center', '600');
        label(ctx, px + (right ? -8 : 8), (cy + py) / 2, 'sin θ', C['q-react'], 11, right ? 'right' : 'left', '600');
      }
    });
    const sl = document.getElementById('eu-th');
    function sync(deg) {
      th = deg * Math.PI / 180;
      const c = Math.cos(th), s = Math.sin(th);
      setText('eu-p', fix(c) + (s < 0 ? ' − j' : ' + j') + fix(Math.abs(s)));
      setText('eu-m', fix(c) + (s < 0 ? ' + j' : ' − j') + fix(Math.abs(s)));
      const p2 = v => (v < 0 ? '(' + fix(v) + ')' : fix(v)) + '²';
      setText('eu-r', '√(' + p2(c) + ' + ' + p2(s) + ') = 1');
      st.redraw();
    }
    bindRange('eu-th', v => 'θ = ' + v.toFixed(0) + '°', sync);
    let drag = false;
    function at(ev) {
      const p = pointerPos(cv, ev);
      const deg = Math.round(Math.atan2(cy - p.y, p.x - cx) * 180 / Math.PI);
      sl.value = deg; sl.dispatchEvent(new Event('input'));
    }
    cv.addEventListener('pointerdown', ev => { drag = true; cv.setPointerCapture(ev.pointerId); at(ev); });
    cv.addEventListener('pointermove', ev => { if (drag) at(ev); });
    cv.addEventListener('pointerup', () => { drag = false; });
    cv.style.touchAction = 'none';
  }

  /* ---------- ℒ(f⁽ⁿ⁾) 展開器 ---------- */
  const sPow = k => (k === 0 ? '' : k === 1 ? 's' : 's<sup>' + k + '</sup>');
  const fDer = k => (k === 0 ? 'f(0)' : k === 1 ? 'f′(0)' : k === 2 ? 'f″(0)' : 'f<sup>(' + k + ')</sup>(0)');
  liveExample('#ex-nth', {
    title: '例題 · 自己選階數，展開高階導數的 ℒ',
    givens: [{ id: 'nth-n', label: '導數的階數 n', min: 1, max: 10, step: 1, value: 6, fmt: v => 'n = ' + v }],
    compute: g => {
      const n = g['nth-n'], tail = [];
      for (let k = 0; k < n; k++) tail.push(sPow(n - 1 - k) + fDer(k));
      return { n, tail };
    },
    question: (g, r) => '求 ℒ(f<sup>(' + r.n + ')</sup>(t)) = ?（板書 Ex. 用的是 n = 6 和 n = 10）',
    steps: (g, r) => [
      { t: 'Step 1　先寫第一項。', note: 'n 階就是 s 的 n 次方乘 F(s)。', eq: sPow(r.n) + 'F(s)' },
      { t: 'Step 2　數要扣幾項。', note: 'n 階扣 n 項，這題扣 ' + r.n + ' 項，全部是減號。', eq: r.tail.map((x, i) => '−（第 ' + (i + 1) + ' 項）').slice(0, 3).join(' ') + (r.n > 3 ? ' … 共 ' + r.n + ' 項' : '') },
      { t: 'Step 3　s 的次方往下數、f 的階數往上數。', note: 's 從 ' + (r.n - 1) + ' 數到 0，f 從 0 數到 ' + (r.n - 1) + '。上圖兩條線就是這個翹翹板。', eq: r.tail.join('、') },
      { t: 'Step 4　自我檢查。', note: r.n === 1 ? 'n = 1 只有一項 f(0)，次方 0 + 階數 0 = 0 = n − 1 ✓。' : '每一項「s 的次方 + f 的階數」都等於 n − 1 = ' + (r.n - 1) + ' ✓；最後一項 ' + fDer(r.n - 1) + ' 前面沒有 s。' }
    ],
    answer: (g, r) => 'ℒ(f<sup>(' + r.n + ')</sup>(t)) = ' + sPow(r.n) + 'F(s) − ' + r.tail.join(' − '),
    ratio: 0.3, minH: 150, maxH: 200,
    draw: (ctx, w, h, g, r) => {
      const n = r.n, padL = 34, padR = 14, top = 22, bot = h - 26;
      const W = Math.max(1, w - padL - padR), step = n > 1 ? W / (n - 1) : 0;
      const x = k => (n > 1 ? padL + k * step : padL + W / 2);
      const y = v => bot - (n > 1 ? v / (n - 1) : 0.5) * (bot - top);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL - 8, bot); ctx.lineTo(w - padR + 4, bot); ctx.stroke();
      label(ctx, padL - 12, top, String(n - 1), C['ink-3'], 10, 'right');
      label(ctx, padL - 12, bot, '0', C['ink-3'], 10, 'right');
      [[k => n - 1 - k, C.accent, 's 的次方'], [k => k, C['p-real'], 'f 的階數']].forEach(([fn, col, name], j) => {
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
        for (let k = 0; k < n; k++) { const X = x(k), Y = y(fn(k)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
        for (let k = 0; k < n; k++) disc(ctx, x(k), y(fn(k)), 4, col);
        labelCJK(ctx, j ? w - padR : padL, h - 10, name + (j ? ' ↗' : ' ↘'), col, 11, j ? 'right' : 'left', '600');
      });
      labelCJK(ctx, w / 2, h - 10, '第 1 項 → 第 ' + n + ' 項', C['ink-3'], 10, 'center');
    }
  });

  /* ---------- 極限比賽：f(t)·e^(−σt) ---------- */
  const FN = [
    { name: 't²', html: 't²', g: t => t * t },
    { name: 'e²ᵗ', html: 'e<sup>2t</sup>', g: t => Math.exp(2 * t) },
    { name: 'eᵗ²', html: 'e<sup>t²</sup>', g: t => Math.exp(t * t) }
  ];
  liveExample('#ex-lim', {
    title: '例題 · 板書三題極限：拉不拉得住？',
    givens: [
      { id: 'lim-f', label: '哪一題 f(t)', min: 1, max: 3, step: 1, value: 1, fmt: v => v + '. f(t) = ' + FN[v - 1].name },
      { id: 'lim-s', label: 'σ（s 的實部）', min: 0.5, max: 5, step: 0.5, value: 1, fmt: v => 'σ = ' + v.toFixed(1) }
    ],
    compute: g => {
      const k = g['lim-f'], s = g['lim-s'];
      let res;
      if (k === 1) res = 0;
      else if (k === 2) res = s > 2 ? 0 : s === 2 ? 1 : Infinity;
      else res = Infinity;
      return { k, s, res, f: FN[k - 1] };
    },
    question: (g, r) => '求 lim<sub>t→∞</sub> e<sup>−σt</sup> · ' + r.f.html + '，σ = ' + r.s.toFixed(1) + '。ℒ(' + r.f.html + ') 在這個 σ 存在嗎？',
    steps: (g, r) => {
      const s = r.s.toFixed(1);
      if (r.k === 1) return [
        { t: 'Step 1　改寫成分式。', note: '兩個都衝到 ∞，是 ∞/∞ 型。', eq: 'lim t² / e<sup>' + s + 't</sup>' },
        { t: 'Step 2　羅必達一次。', note: '上下各對 t 微分，還是 ∞/∞。', eq: 'lim 2t / (' + s + 'e<sup>' + s + 't</sup>)' },
        { t: 'Step 3　羅必達第二次。', note: '分子變常數，分母還在衝 ∞。', eq: 'lim 2 / (' + fix(r.s * r.s) + 'e<sup>' + s + 't</sup>) = 0' },
        { t: 'Step 4　結論。', note: '只要 σ > 0，不管多小，指數最後一定贏過多項式。σ 調到 0.5 看看：曲線先爬高，但最後還是被拉回 0。' }
      ];
      if (r.k === 2) return [
        { t: 'Step 1　指數合併。', note: '同底的指數相乘，次方相加。', eq: 'e<sup>−' + s + 't</sup>·e<sup>2t</sup> = e<sup>(2 − ' + s + ')t</sup> = e<sup>' + fix(2 - r.s, 1) + 't</sup>' },
        { t: 'Step 2　看指數係數的正負。', note: r.s > 2 ? '2 − σ < 0：指數往負的方向衝 → 0。' : r.s === 2 ? '2 − σ = 0：e<sup>0</sup> = 1，不衰減也不發散。' : '2 − σ > 0：指數往正的方向衝 → ∞。' },
        { t: 'Step 3　結論。', note: r.s > 2 ? 'σ > 2，拉得住，ℒ(e<sup>2t</sup>) = 1/(s − 2) 成立。' : 'σ ≤ 2 拉不住。把 σ 調到 2.5 以上就會收斂 —— 這就是「σ > a」裡 a = 2 的意思。' }
      ];
      return [
        { t: 'Step 1　指數合併。', eq: 'e<sup>−' + s + 't</sup>·e<sup>t²</sup> = e<sup>t² − ' + s + 't</sup> = e<sup>t(t − ' + s + ')</sup>' },
        { t: 'Step 2　看指數。', note: 't 一超過 ' + s + '，t(t − ' + s + ') 就變正，而且越來越大（是 t² 的速度）。' },
        { t: 'Step 3　結論。', note: '把 σ 拉到最大 5 也一樣，只是晚一點爆。e<sup>t²</sup> 長得比任何 e<sup>at</sup> 都快，找不到 a，ℒ(e<sup>t²</sup>) 不存在。' }
      ];
    },
    answer: (g, r) => r.res === 0 ? '極限 = <b>0</b> → ℒ 在 σ = ' + r.s.toFixed(1) + ' 存在。'
      : r.res === 1 ? '極限 = <b>1</b>（不是 0）→ σ = 2 剛好在邊界，ℒ 不存在。'
      : '極限 = <b>∞</b> → ℒ 在 σ = ' + r.s.toFixed(1) + ' 不存在。',
    ratio: 0.34, minH: 160, maxH: 220,
    draw: (ctx, w, h, g, r) => {
      const padL = 30, padR = 14, top = 20, bot = h - 24, T = 8, Ymax = 3;
      const W = Math.max(1, w - padL - padR);
      const X = t => padL + t / T * W, Y = v => bot - clamp(v / Ymax, 0, 1.04) * (bot - top);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, top - 6); ctx.lineTo(padL, bot); ctx.lineTo(w - padR, bot); ctx.stroke();
      label(ctx, padL - 6, Y(Ymax), String(Ymax), C['ink-3'], 10, 'right');
      label(ctx, padL - 6, bot, '0', C['ink-3'], 10, 'right');
      label(ctx, w - padR, bot + 12, 't', C['ink-3'], 10, 'right');
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
      let out = -1;
      for (let i = 0; i <= 240; i++) {
        const t = i / 240 * T, v = Math.exp(-r.s * t) * r.f.g(t);
        if (out < 0 && v > Ymax) out = t;
        i ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v));
        if (v > Ymax * 1.04) break;
      }
      ctx.stroke();
      labelCJK(ctx, w - padR, top, 'e<sup>−σt</sup>·' + r.f.html, C.accent, 12, 'right', '600');
      if (out >= 0) {
        arrow(ctx, X(out), Y(Ymax) + 14, X(out), top - 4, C.bad, 1.6);
        labelCJK(ctx, X(out) + 8, top + 18, '衝出畫面 → ∞', C.bad, 11, 'left', '600');
      } else {
        labelCJK(ctx, w - padR, bot - 12, r.res === 1 ? '停在 1' : '→ 0', C.ok, 11, 'right', '600');
      }
    }
  });
})();

/* ============================================================
   小測驗（中英對照）+ 導覽
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: 'ℒ(f″(t)) 等於什麼？', en: 'What is ℒ(f″(t))?',
      o: [['s²F(s) − s f(0) − f′(0)', 's²F(s) − s f(0) − f′(0)'], ['sF(s) − s f(0) − f′(0)', 'sF(s) − s f(0) − f′(0)'],
          ['s²F(s) − f(0) − s f′(0)', 's²F(s) − f(0) − s f′(0)'], ['s²F(s) + s f(0) + f′(0)', 's²F(s) + s f(0) + f′(0)']], a: 0,
      e: '把 f″ 看成 (f′)′ 套兩次定理：s[sF(s) − f(0)] − f′(0) = s²F(s) − s f(0) − f′(0)。你的 iPad 筆記就是漏了第一項的平方。' },
    { zh: 'ℒ(f⁽⁵⁾(t)) 展開後，扣掉的項裡第 3 項是什麼？', en: 'In the expansion of ℒ(f⁽⁵⁾(t)), what is the 3rd subtracted term?',
      o: [['s²f″(0)', 's²f″(0)'], ['s³f″(0)', 's³f″(0)'], ['s²f‴(0)', 's²f‴(0)'], ['s f″(0)', 's f″(0)']], a: 0,
      e: '扣的項依序是 s⁴f(0)、s³f′(0)、s²f″(0)、s f‴(0)、f⁽⁴⁾(0)。第 3 項 s 的次方 2、f 的階數 2，加起來 4 = n − 1 ✓。' },
    { zh: '推 ℒ(f″) 時，為什麼可以「套舊定理」而不用重新積分？', en: 'Why can we reuse the old theorem instead of integrating again when deriving ℒ(f″)?',
      o: [['因為 f″ = (f′)′，把 f′ 當成新的函數丟進 ℒ(g′) = sℒ(g) − g(0)', 'because f″ = (f′)′, so treat f′ as a new function g in ℒ(g′) = sℒ(g) − g(0)'],
          ['因為 f″ 一定是 0', 'because f″ is always 0'],
          ['因為拉普拉斯轉換不能積兩次', 'because the Laplace transform cannot be applied twice'],
          ['因為 s² = s·s', 'because s² = s·s']], a: 0,
      e: '定理對「任何」函數 g 都成立，所以 g 可以是 f′。套完會出現 ℒ(f′)，再套一次就好。這招一路用到 n 階。' },
    { zh: 'e<sup>−jθ</sup> 等於什麼？', en: 'What is e<sup>−jθ</sup> equal to?',
      o: [['cos θ − j sin θ', 'cos θ − j sin θ'], ['−cos θ − j sin θ', '−cos θ − j sin θ'], ['cos θ + j sin θ', 'cos θ + j sin θ'], ['sin θ − j cos θ', 'sin θ − j cos θ']], a: 0,
      e: 'e<sup>−jθ</sup> = cos(−θ) + j sin(−θ)。cos 是偶函數不變號，sin 是奇函數要變號，所以是 cos θ − j sin θ。在單位圓上就是 e<sup>jθ</sup> 上下翻過來的那一點。' },
    { zh: '共軛複根 α ± jβ 的解 e<sup>αt</sup>(A cos βt + B sin βt) 中，A、B 跟 C₁、C₂ 的關係是？', en: 'For roots α ± jβ, how are A, B related to C₁, C₂ in y = e<sup>αt</sup>(A cos βt + B sin βt)?',
      o: [['A = C₁ + C₂，B = j(C₁ − C₂)', 'A = C₁ + C₂, B = j(C₁ − C₂)'], ['A = C₁ − C₂，B = C₁ + C₂', 'A = C₁ − C₂, B = C₁ + C₂'],
          ['A = C₁C₂，B = C₁/C₂', 'A = C₁C₂, B = C₁/C₂'], ['A = j(C₁ + C₂)，B = C₁ − C₂', 'A = j(C₁ + C₂), B = C₁ − C₂']], a: 0,
      e: '用尤拉公式展開後，cos 的係數是 C₁ + C₂，sin 的係數是 j(C₁ − C₂)。C₁、C₂ 互為共軛時，A、B 都是實數。' },
    { zh: '證明 ℒ(f′) 時用到的積分技巧是什麼？', en: 'Which integration technique is used to prove ℒ(f′) = sF(s) − f(0)?',
      o: [['分部積分', 'integration by parts'], ['變數變換', 'substitution'], ['部分分式', 'partial fractions'], ['三角代換', 'trigonometric substitution']], a: 0,
      e: '∫₀<sup>∞</sup> e<sup>−st</sup> df(t) = e<sup>−st</sup>f(t)|₀<sup>∞</sup> − ∫₀<sup>∞</sup> f(t) d(e<sup>−st</sup>)。把對 f′ 的積分換成對 f 的積分，後者就是 F(s)。' },
    { zh: '為什麼 |e<sup>−jωt</sup>| = 1？', en: 'Why is |e<sup>−jωt</sup>| = 1?',
      o: [['因為它等於 cos ωt − j sin ωt，長度 √(cos² + sin²) = 1', 'because it equals cos ωt − j sin ωt, whose magnitude is √(cos² + sin²) = 1'],
          ['因為 ω = 0', 'because ω = 0'], ['因為 e<sup>0</sup> = 1', 'because e<sup>0</sup> = 1'], ['因為 t → ∞', 'because t → ∞']], a: 0,
      e: '它永遠落在單位圓上，只會轉圈、不會變長變短。所以取絕對值時它直接變成 1，複數 s 的問題就只剩實部 σ。' },
    { zh: '下列哪一個函數的拉普拉斯轉換不存在？', en: 'Which function does NOT have a Laplace transform?',
      o: [['e<sup>t²</sup>', 'e<sup>t²</sup>'], ['t²', 't²'], ['e<sup>2t</sup>', 'e<sup>2t</sup>'], ['sin t', 'sin t']], a: 0,
      e: 'e<sup>−σt</sup>·e<sup>t²</sup> = e<sup>t(t−σ)</sup>，t 超過 σ 之後指數變正，不管 σ 多大都 → ∞。t² 和 e<sup>2t</sup> 雖然也衝 ∞，但長得比某個指數慢，取夠大的 σ 就壓得住。' }
  ];
  let i = 0, score = 0, answered = false, ord = [];
  /* 選項順序每次打亂：題庫裡正解都寫在第一個，不打亂的話永遠是 A */
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };

  function render() {
    const q = Q[i];
    host.innerHTML =
      '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div>' +
      '<div class="quiz-body">' +
        '<div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
        '<div class="q-text">' + q.zh + '</div>' +
        '<div class="q-en">' + q.en + '</div>' +
        '<div class="opts"></div>' +
        '<div class="explain" hidden></div>' +
      '</div>' +
      '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span>' +
        '<button class="btn" id="q-next" hidden>下一題 →</button></div>';
    const opts = host.querySelector('.opts');
    ord = shuffle(q.o.length);
    ord.forEach((src, k) => {
      const pair = q.o[src];
      const b = document.createElement('button');
      b.className = 'opt'; b.type = 'button';
      b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + pair[0] + '<span class="en">' + pair[1] + '</span></span>';
      b.addEventListener('click', () => pick(k));
      opts.appendChild(b);
    });
    host.querySelector('#q-next').addEventListener('click', () => { i++; answered = false; i < Q.length ? render() : done(); });
    answered = false;
  }
  function pick(k) {
    if (answered) return; answered = true;
    const q = Q[i], A = ord.indexOf(q.a), btns = Array.prototype.slice.call(host.querySelectorAll('.opt'));
    btns.forEach((b, idx) => { b.disabled = true; if (idx === A) b.classList.add('right'); });
    if (k === A) score++; else btns[k].classList.add('wrong');
    const ex = host.querySelector('.explain');
    ex.hidden = false;
    ex.innerHTML = '<b>' + (k === A ? '答對了。' : '正確答案是 ' + 'ABCD'[A] + '。') + '</b> ' + q.e;
    host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
    const nx = host.querySelector('#q-next');
    nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →';
    nx.classList.add('solid');
  }
  function done() {
    const pct = Math.round(score / Q.length * 100);
    const verdict = pct >= 90 ? '這堂課的東西你都抓到了。'
      : pct >= 70 ? '主幹抓到了。答錯的回去看對應那一節的推導。'
      : '建議從第 02 節 ℒ(f″) 開始重看一次，後面全部都是同一招。';
    host.innerHTML =
      '<div class="bar"><i style="width:100%"></i></div>' +
      '<div class="quiz-body" style="padding-bottom:18px">' +
        '<div class="q-no">測驗結果</div>' +
        '<div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + pct + '%）</div>' +
        '<p style="color:var(--ink-2);margin:0 0 14px">' + verdict + '</p>' +
        '<button class="btn solid" id="q-again" type="button">再測一次</button>' +
      '</div>';
    host.querySelector('#q-again').addEventListener('click', () => { i = 0; score = 0; render(); });
  }
  render();
})();

/* 側欄捲動高亮 + 明暗主題切換 */
(function () {
  'use strict';
  const links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
  if (links.length) {
    const map = new Map();
    links.forEach(a => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a); });
    const io = new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.remove('on')); map.get(en.target).classList.add('on'); } });
    }, { rootMargin: '-84px 0px -62% 0px', threshold: 0 });
    map.forEach((a, s) => io.observe(s));
  }
  const btn = document.getElementById('theme-btn');
  if (btn) btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    try { localStorage.setItem('ee-theme', isDark ? 'light' : 'dark'); } catch (e) {}
  });
  try { const t = localStorage.getItem('ee-theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch (e) {}
})();
