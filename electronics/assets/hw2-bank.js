/* ============================================================
   電子學 HW2（Issued 18/10/2026 · Due 27/10/2026）題庫 —— 10/27 加入
   第 1～3 題（只繳 1～3 題）：二極體直流分析（設計 R／V_PS、負載線、片段線性、定電壓降）
   kind:'hw' = 作業原題（選項照題目順序，正解位置分散）；kind:'sim' = 仿作業（自編，數字由公式算出，選項會打亂）
   講解在 CH1 PART 5 §04 負載線、§05 片段線性、§06 定電壓降
   ============================================================ */
(function () {
  'use strict';
  const P5 = 'ch1-part5.html';
  const S = (o, a) => ({ o, a: a || 0 });
  const r3 = x => { const a = Math.abs(x); if (a === 0) return '0'; const d = Math.max(0, 2 - Math.floor(Math.log10(a))); return (+x.toFixed(Math.min(d, 4))).toString(); };
  const mA = x => r3(x * 1e3) + ' mA', V = x => r3(x) + ' V', kO = x => r3(x / 1e3) + ' kΩ';
  /* 正解＋三個錯解，去掉重複 */
  const opts = (right, wrong) => { const o = [right]; wrong.forEach(w => { if (o.indexOf(w) < 0 && o.length < 4) o.push(w); }); return S(o); };

  /* ---- 圖（照作業重畫） ---- */
  const svgBox = (w, h, inner) => '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" style="font:12px sans-serif;max-width:100%" fill="none" stroke="currentColor">' + inner + '</svg>';
  const tx = (x, y, s, a) => '<text x="' + x + '" y="' + y + '" fill="currentColor" stroke="none"' + (a ? ' text-anchor="' + a + '"' : '') + '>' + s + '</text>';
  const sub = (a, b) => a + '<tspan font-size="9" dy="3">' + b + '</tspan><tspan dy="-3"></tspan>';
  /* 電源 V_PS — R — 二極體（接地）；model：'d' 二極體、'pwl' r_f + V_γ、'cvd' 只有 V_γ */
  function CKT(vps, r, model) {
    let s = '<path d="M30 110 V130 H210 V110 M30 74 V30 H70 M130 30 H210 V64"/>' +
      '<path d="M70 30 L76 22 L86 38 L96 22 L106 38 L116 22 L124 30 H130"/>' +
      '<line x1="16" y1="78" x2="44" y2="78" stroke-width="2"/><line x1="22" y1="88" x2="38" y2="88" stroke-width="3.4"/><path d="M30 74 V78 M30 88 V110"/>' +
      tx(8, 72, '+') + tx(8, 104, '−') + tx(48, 88, vps) + tx(100, 18, r, 'middle') + tx(140, 22, sub('I', 'D') + ' →') +
      '<path d="M120 135 V142 M112 142 H128 M116 146 H124"/>';
    if (model === 'pwl') s += '<path d="M210 64 L203 68 L217 74 L203 80 L217 86 L210 90 V94"/><line x1="198" y1="98" x2="222" y2="98" stroke-width="2"/><line x1="203" y1="106" x2="217" y2="106" stroke-width="3.4"/><path d="M210 106 V110"/>' + tx(226, 82, sub('r', 'f')) + tx(226, 106, sub('V', 'γ'));
    else if (model === 'cvd') s += '<path d="M210 64 V82"/><line x1="198" y1="82" x2="222" y2="82" stroke-width="2"/><line x1="203" y1="90" x2="217" y2="90" stroke-width="3.4"/><path d="M210 90 V110"/>' + tx(226, 92, sub('V', 'γ'));
    else s += '<path d="M210 64 V76 M210 96 V110"/><path d="M200 76 H220 L210 94 Z"/><line x1="200" y1="96" x2="220" y2="96" stroke-width="2"/>' + tx(226, 74, '+') + tx(226, 104, '−') + tx(228, 90, sub('V', 'D'));
    return svgBox(290, 152, s);
  }
  /* 負載線 + 簡化特性曲線（slopeTxt：'1/10' 或 '∞'） */
  function LL(slopeTxt) {
    return svgBox(260, 160, '<path d="M30 140 H250 M30 140 V10"/>' + tx(252, 136, sub('V', 'D'), 'end') + tx(36, 14, sub('I', 'D')) +
      '<path d="M30 30 L220 140" stroke-width="2"/>' + tx(150, 112, 'Load Line') + tx(10, 34, sub('I', 'INT')) + tx(220, 154, sub('V', 'INT'), 'middle') +
      (slopeTxt === '∞' ? '<path d="M70 140 V14" stroke-width="2"/>' : '<path d="M70 140 L96 14" stroke-width="2"/>') +
      tx(70, 154, sub('V', 'γ') + ' = 0.6', 'middle') + tx(104, 26, 'Slope = ' + slopeTxt) + '<circle cx="' + (slopeTxt === '∞' ? 70 : 77) + '" cy="' + (slopeTxt === '∞' ? 53 : 57) + '" r="4" fill="currentColor"/>' + tx(84, 60, 'Q'));
  }

  const items = [
    /* ═════════ 第 1 題：設計 R、V_PS，求 V_DQ、I_DQ ═════════ */
    { id: 'w2h1', hw: 1, kind: 'hw', title: '工作點設計：一條 KVL 四種問法', link: P5 + '#load',
      q: '圖 1 二極體電路。(1) 若 V<sub>PS</sub> = 5 V，工作點 V<sub>DQ</sub> = 0.6 V、I<sub>DQ</sub> = 2 mA，R = {0}。(2) 若 R = 2.2 kΩ，工作點 V<sub>DQ</sub> = 0.6 V、I<sub>DQ</sub> = 2 mA，V<sub>PS</sub> = {1}。(3) 若 V<sub>PS</sub> = 5 V、R = 2.2 kΩ，I<sub>DQ</sub> = 2 mA，V<sub>DQ</sub> = {2}。(4) 若 V<sub>PS</sub> = 5 V、R = 2.2 kΩ，V<sub>DQ</sub> = 0.6 V，I<sub>DQ</sub> = {3}。',
      b: [S(['2.5 kΩ', '2.2 kΩ', '2.8 kΩ', '0.3 kΩ'], 1), S(['4.4 V', '5.6 V', '5 V', '3.8 V'], 2), S(['0.6 V', '4.4 V', '0.7 V', '5 V'], 0), S(['2.27 mA', '2.5 mA', '1.73 mA', '2 mA'], 3)],
      fig: CKT('V<tspan font-size="9" dy="3">PS</tspan>', 'R', 'd'),
      ex: '四小題都是同一條 KVL：<b>V<sub>PS</sub> = I<sub>DQ</sub>·R + V<sub>DQ</sub></b>，只是未知數換來換去。(1) R = (5 − 0.6)/2 mA = 2.2 kΩ；(2) V<sub>PS</sub> = 2.2 kΩ × 2 mA + 0.6 = 5 V；(3) V<sub>DQ</sub> = 5 − 4.4 = 0.6 V；(4) I<sub>DQ</sub> = (5 − 0.6)/2.2 kΩ = 2 mA。你的作業四題都算對 ✓。' },

    /* ═════════ 第 2 題：片段線性（r_f = 10 Ω） ═════════ */
    { id: 'w2h2', hw: 2, kind: 'hw', title: '圖解法＋聯立解 vs 片段線性模型（r<sub>f</sub> = 10 Ω）', link: P5 + '#pwl',
      q: '圖 2：V<sub>PS</sub> = 5 V、R = 2 kΩ，簡化特性曲線在 V<sub>D</sub> &gt; V<sub>γ</sub>（0.6 V）之後是斜率 1/10 的直線。(1) 簡化特性曲線方程式：{0}。(2) 負載線（KVL）：{1}。(3) 負載線截距 I<sub>INT</sub> = {2}、V<sub>INT</sub> = {3}。(4) 聯立 (1)(2)：V<sub>DQ</sub> = {4}、I<sub>DQ</sub> = {5}。(5) 片段線性模型（V<sub>γ</sub> = 0.6 V、r<sub>f</sub> = 10 Ω）：I<sub>DQ</sub> = {6}、V<sub>DQ</sub> = {7}。(6) (4) 與 (5) 的答案 {8}。',
      b: [S(['ID = VD / 10', 'ID = (VD − 0.6) / 10', 'ID = 10 (VD − 0.6)', 'VD = 0.6 V'], 1), S(['5 = 2000 ID − VD', 'VD = 2000 ID', '5 = 2000 ID + VD', '5 = 10 ID + VD'], 2),
        S(['2.5 mA', '2.2 mA', '5 mA', '0.5 mA'], 0), S(['0.6 V', '5 V', '2.5 V', '4.4 V'], 1),
        S(['0.6 V', '0.622 V', '0.7 V', '5 V'], 1), S(['2.5 mA', '2.2 mA', '2.19 mA', '2.15 mA'], 2),
        S(['2.2 mA', '2.19 mA', '2.15 mA', '2.5 mA'], 1), S(['0.622 V', '0.6 V', '0.7 V', '0.62 mV'], 0),
        S(['不同', '相同'], 1)],
      fig: '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">' + CKT('5 V', '2 kΩ', 'd') + LL('1/10') + CKT('5 V', '2 kΩ', 'pwl') + '</div>',
      ex: '(1) 過 (0.6 V, 0)、斜率 1/10（A/V，也就是 r<sub>f</sub> = 10 Ω）：I<sub>D</sub> = (V<sub>D</sub> − 0.6)/10。(2) KVL：5 = 2000 I<sub>D</sub> + V<sub>D</sub>。(3) V<sub>D</sub> = 0 → I<sub>INT</sub> = 5/2k = 2.5 mA；I<sub>D</sub> = 0 → V<sub>INT</sub> = 5 V。(4) 代入：5 = 200(V<sub>D</sub> − 0.6) + V<sub>D</sub> → 201 V<sub>D</sub> = 125 → V<sub>DQ</sub> = 0.6219 V，I<sub>DQ</sub> = 0.0219/10 = 2.189 mA。(5) 5 = (2000 + 10) I<sub>D</sub> + 0.6 → I<sub>DQ</sub> = 4.4/2010 = 2.189 mA，V<sub>DQ</sub> = 0.6 + 10 × 2.189 m = 0.6219 V。(6) <b>相同</b>：片段線性模型就是把那條直線「做成元件」，兩種方法解的是同一組方程式。你的作業全部算對 ✓。' },

    /* ═════════ 第 3 題：定電壓降（r_f = 0） ═════════ */
    { id: 'w2h3', hw: 3, kind: 'hw', title: '圖解法＋聯立解 vs 定電壓降模型（r<sub>f</sub> = 0）', link: P5 + '#cvd',
      q: '圖 3：V<sub>PS</sub> = 5 V、R = 2 kΩ，簡化特性曲線 V<sub>D</sub> ≈ V<sub>γ</sub> = 0.6 V，導通後斜率為 ∞（垂直）。(1) 簡化特性曲線方程式：{0}。(2) 負載線：{1}。(3) I<sub>INT</sub> = {2}、V<sub>INT</sub> = {3}。(4) 聯立：V<sub>DQ</sub> = {4}、I<sub>DQ</sub> = {5}。(5) 片段線性模型（V<sub>γ</sub> = 0.6 V、r<sub>f</sub> = 0）：I<sub>DQ</sub> = {6}、V<sub>DQ</sub> = {7}。(6) (4) 與 (5) 的答案 {8}。',
      b: [S(['ID = VD / 0.6', 'VD = 0.6 V', 'ID = 0', 'VD = 0'], 1), S(['5 = 2000 ID + VD', '5 = 2000 ID', 'VD = 5 V', '5 = 2000 ID − VD'], 0),
        S(['2.2 mA', '5 mA', '2.5 mA', '0.3 mA'], 2), S(['5 V', '0.6 V', '4.4 V', '2.5 V'], 0),
        S(['0 V', '0.6 V', '4.4 V', '5 V'], 1), S(['2.5 mA', '2.19 mA', '2.2 mA', '0.3 mA'], 2),
        S(['2.2 mA', '2.5 mA', '2.19 mA', '0 mA'], 0), S(['0.622 V', '0.6 V', '0 V', '4.4 V'], 1),
        S(['相同', '不同'], 0)],
      fig: '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">' + CKT('5 V', '2 kΩ', 'd') + LL('∞') + CKT('5 V', '2 kΩ', 'cvd') + '</div>',
      ex: '(1) 斜率 ∞ = 一條垂直線：V<sub>D</sub> = 0.6 V（導通後電壓釘死，電流由外面電路決定）。(2) 一樣是 5 = 2000 I<sub>D</sub> + V<sub>D</sub>。(3) 截距同第 2 題：2.5 mA、5 V。(4) V<sub>D</sub> = 0.6 代入 → I<sub>DQ</sub> = 4.4/2000 = 2.2 mA。(5) 定電壓降模型 5 = 2000 I<sub>D</sub> + 0.6 → 2.2 mA、0.6 V。(6) 相同。跟第 2 題比，r<sub>f</sub> = 10 Ω 只讓電流從 2.2 降到 2.189 mA —— r<sub>f</sub> ≪ R 時可以忽略。你的作業全部算對 ✓。' }
  ];

  /* ═════════ 仿作業：數字由公式算，不手算 ═════════ */
  /* 第 1 題：四種問法 */
  [[9, 0.7, 2e-3, 'R'], [12, 0.7, 5e-3, 'R'], [3.3, 0.65, 1e-3, 'R'], [1.5e3, 0.7, 3e-3, 'V'], [4.7e3, 0.6, 1e-3, 'V'], [10, 1e3, 0.7, 'I'], [6, 2.2e3, 0.65, 'I'], [5, 1e3, 4.3e-3, 'VD'], [12, 3.3e3, 3.4e-3, 'VD'], [2, 1e3, 0.7, 'I']].forEach((c, n) => {
    let q, right, wrong, ex;
    if (c[3] === 'R') { const [vps, vd, i] = c, R = (vps - vd) / i; q = 'V<sub>PS</sub> = ' + vps + ' V，要讓工作點 V<sub>DQ</sub> = ' + vd + ' V、I<sub>DQ</sub> = ' + mA(i) + '，R = {0}。'; right = kO(R); wrong = [kO(vps / i), kO((vps + vd) / i), kO(vd / i)]; ex = 'R = (V<sub>PS</sub> − V<sub>DQ</sub>)/I<sub>DQ</sub> = (' + vps + ' − ' + vd + ')/' + mA(i) + ' = ' + kO(R) + '。'; }
    else if (c[3] === 'V') { const [R, vd, i] = c, v = i * R + vd; q = 'R = ' + kO(R) + '，要讓工作點 V<sub>DQ</sub> = ' + vd + ' V、I<sub>DQ</sub> = ' + mA(i) + '，V<sub>PS</sub> = {0}。'; right = V(v); wrong = [V(i * R), V(i * R - vd), V(v + vd)]; ex = 'V<sub>PS</sub> = I<sub>DQ</sub>R + V<sub>DQ</sub> = ' + V(i * R) + ' + ' + vd + ' = ' + V(v) + '。'; }
    else if (c[3] === 'I') { const [vps, R, vd] = c, i = (vps - vd) / R; q = 'V<sub>PS</sub> = ' + vps + ' V、R = ' + kO(R) + '，二極體導通 V<sub>DQ</sub> = ' + vd + ' V，I<sub>DQ</sub> = {0}。'; right = mA(i); wrong = [mA(vps / R), mA((vps + vd) / R), mA(vd / R)]; ex = 'I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>DQ</sub>)/R = ' + V(vps - vd) + ' ÷ ' + kO(R) + ' = ' + mA(i) + '。'; }
    else { const [vps, R, i] = c, vd = vps - i * R; q = 'V<sub>PS</sub> = ' + vps + ' V、R = ' + kO(R) + '，量到 I<sub>DQ</sub> = ' + mA(i) + '，二極體跨壓 V<sub>DQ</sub> = {0}。'; right = V(vd); wrong = [V(i * R), V(vps), V(vps + i * R)]; ex = 'V<sub>DQ</sub> = V<sub>PS</sub> − I<sub>DQ</sub>R = ' + vps + ' − ' + V(i * R) + ' = ' + V(vd) + '。'; }
    items.push({ id: 'w2s1-' + (n + 1), hw: 1, n: n + 1, kind: 'sim', link: P5 + '#load', q, b: [opts(right, wrong)], ex: ex + '（都是同一條 KVL：V<sub>PS</sub> = I<sub>DQ</sub>R + V<sub>DQ</sub>）' });
  });
  /* 第 2 題：片段線性 */
  [[5, 2e3, 0.6, 10], [5, 1e3, 0.7, 20], [10, 4.7e3, 0.7, 10], [3, 1e3, 0.6, 50], [12, 2.2e3, 0.65, 15], [5, 500, 0.7, 25], [9, 3.3e3, 0.6, 5], [2, 1e3, 0.6, 100], [15, 10e3, 0.7, 20], [6, 1.2e3, 0.65, 30]].forEach((c, n) => {
    const [vps, R, vg, rf] = c, i = (vps - vg) / (R + rf), vd = vg + i * rf;
    items.push({ id: 'w2s2-' + (n + 1), hw: 2, n: n + 1, kind: 'sim', link: P5 + '#pwl',
      q: 'V<sub>PS</sub> = ' + vps + ' V、R = ' + kO(R) + '，二極體用片段線性模型（V<sub>γ</sub> = ' + vg + ' V、r<sub>f</sub> = ' + rf + ' Ω）。負載線截距 I<sub>INT</sub> = {0}、V<sub>INT</sub> = {1}；Q 點 I<sub>DQ</sub> = {2}、V<sub>DQ</sub> = {3}。',
      b: [opts(mA(vps / R), [mA((vps - vg) / R), mA(vps / rf), mA(vg / R)]), opts(V(vps), [V(vg), V(vps - vg), V(vps / 2)]),
        opts(mA(i), [mA((vps - vg) / R), mA(vps / (R + rf)), mA((vps - vg) / rf)]), opts(V(vd), [V(vg), V(vps - i * R + vg), V(i * rf)])],
      ex: '截距：V<sub>D</sub> = 0 → I<sub>INT</sub> = V<sub>PS</sub>/R = ' + mA(vps / R) + '；I<sub>D</sub> = 0 → V<sub>INT</sub> = V<sub>PS</sub> = ' + vps + ' V。Q 點：I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/(R + r<sub>f</sub>) = ' + V(vps - vg) + ' ÷ ' + r3(R + rf) + ' Ω = ' + mA(i) + '，V<sub>DQ</sub> = V<sub>γ</sub> + I<sub>DQ</sub>r<sub>f</sub> = ' + V(vd) + '。' + (rf / R < 0.02 ? 'r<sub>f</sub> 比 R 小很多，V<sub>DQ</sub> 只比 V<sub>γ</sub> 多一點點。' : 'r<sub>f</sub> 跟 R 比起來不算小，V<sub>DQ</sub> 明顯比 V<sub>γ</sub> 大，不能忽略。') });
  });
  /* 第 3 題：定電壓降（含一題 V_PS < V_γ：不導通） */
  [[5, 2e3, 0.7], [9, 1e3, 0.7], [3.3, 680, 0.6], [12, 4.7e3, 0.7], [1.5, 1e3, 0.7], [0.5, 1e3, 0.6], [6, 2.2e3, 0.65], [24, 10e3, 0.7], [2, 100, 0.7], [10, 3.3e3, 0.6]].forEach((c, n) => {
    const [vps, R, vg] = c, on = vps > vg, i = on ? (vps - vg) / R : 0, vd = on ? vg : vps;
    items.push({ id: 'w2s3-' + (n + 1), hw: 3, n: n + 1, kind: 'sim', link: P5 + '#cvd',
      q: 'V<sub>PS</sub> = ' + vps + ' V、R = ' + kO(R) + '，二極體用定電壓降模型（V<sub>γ</sub> = ' + vg + ' V、r<sub>f</sub> = 0）。I<sub>DQ</sub> = {0}、V<sub>DQ</sub> = {1}。',
      b: [opts(on ? mA(i) : '0 mA', on ? [mA(vps / R), mA((vps + vg) / R), '0 mA'] : [mA((vps - vg) / R), mA(vps / R), mA(vg / R)]), opts(V(vd), on ? [V(vps), '0 V', V(vps - vg)] : [V(vg), '0 V', V(vps - vg)])],
      ex: on ? '先檢查：V<sub>PS</sub> = ' + vps + ' V &gt; V<sub>γ</sub>，二極體導通，V<sub>DQ</sub> = V<sub>γ</sub> = ' + vg + ' V；I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/R = ' + V(vps - vg) + ' ÷ ' + kO(R) + ' = ' + mA(i) + '。'
        : '先檢查：V<sub>PS</sub> = ' + vps + ' V 還沒到 V<sub>γ</sub> = ' + vg + ' V，二極體<b>不導通</b>（斷路）：I<sub>DQ</sub> = 0，電源電壓全部落在二極體上，V<sub>DQ</sub> = ' + vps + ' V。照公式硬算會得到負電流 —— 算之前要先判斷導不導通。' });
  });

  window.__HW2 = { name: 'HW2', idp: 'hw2-q', items };
})();
