/* ============================================================
   電子學 CH1 PART 6 —— 課本例題與練習（Example 1.11、1.12、Design Example 1.13 ＋ 講義 1-12 ＋ 自編練習）
   出處：Neamen, Microelectronics: Circuit Analysis and Design, 4th ed., §1.2.5、§1.4、§1.5；
         課程原講義 PART 5（V3）投影片 1-1～1-34
   - 練習題標籤寫出處（講義第幾頁／自編練習），數值都用程式驗算過
   - 每一題都有 story：「🎬 圖解故事」（畫圖工具 ch1-part5-kit.js → __K15，本檔另外匯出 __K16）
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const KK = () => window.__K15;

  /* ---------- 故事用的小元件（橫的二極體、交流源、橫電池、Example 1.11 的電路） ---------- */
  const K16 = (function () {
    if (!window.__K15) return null;
    const K = window.__K15, D = K.D, T = K.T, g = K.g;
    const diodeH = (x, y, cls) => '<path class="' + (cls || 'accw') + '" style="stroke:var(--s-ink);stroke-width:2" d="M' + (x - 10) + ' ' + (y - 12) + ' V' + (y + 12) + ' L' + (x + 10) + ' ' + y + ' Z"/>' +
      '<line class="ln" x1="' + (x + 10) + '" y1="' + (y - 12) + '" x2="' + (x + 10) + '" y2="' + (y + 12) + '" style="stroke-width:2.6"/>';
    const acSrc = (x, y, cls) => '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="16" style="stroke:var(--s-ink);stroke-width:1.8"/>' +
      '<path class="' + (cls || 'ln') + '" style="fill:none" d="M' + (x - 9) + ' ' + y + ' C' + (x - 5) + ' ' + (y - 10) + ' ' + (x - 1) + ' ' + (y - 10) + ' ' + x + ' ' + y + ' S' + (x + 5) + ' ' + (y + 10) + ' ' + (x + 9) + ' ' + y + '"/>';
    const batH = (x, y) => '<line class="lna" x1="' + (x - 5) + '" y1="' + (y - 14) + '" x2="' + (x - 5) + '" y2="' + (y + 14) + '" style="stroke-width:2"/>' +
      '<line class="lna" x1="' + (x + 5) + '" y1="' + (y - 8) + '" x2="' + (x + 5) + '" y2="' + (y + 8) + '" style="stroke-width:3.6"/>';
    /* Example 1.11：左邊 v_i（上）串 V_PS（下），上面二極體，右邊 R（輸出 v_O）。mode：full | dc | ac */
    function c111(x0, y0, w, h, mode, opt) {
      opt = opt || {};
      const xr = x0 + w, yb = y0 + h, yA = y0 + h * 0.3, yB = y0 + h * 0.72, xe1 = x0 + w * 0.3, xe2 = x0 + w * 0.66, xm = (xe1 + xe2) / 2;
      let s = '<path class="ln" style="fill:none" d="M' + x0 + ' ' + (yA - 16) + ' V' + y0 + ' H' + xe1 + ' M' + xe2 + ' ' + y0 + ' H' + xr + ' V' + (y0 + h * 0.15) +
        ' M' + xr + ' ' + (y0 + h * 0.85) + ' V' + yb + ' H' + x0 + ' V' + (yB + 6) + ' M' + x0 + ' ' + (yA + 16) + ' V' + (yB - 6) + '"/>';
      s += K.res(xr, y0 + h * 0.15, h * 0.7, true) + T(xr + 14, y0 + h * 0.5 + 5, opt.r || 'R', { cls: 't', fs: 14, a: 'start' });
      if (opt.vo !== false) s += T(xr + 14, y0 + h * 0.5 + 24, 'v<sub>O</sub>', { cls: 'tm', fs: 13, a: 'start' });
      if (mode === 'dc') s += '<line class="lna" x1="' + x0 + '" y1="' + (yA - 16) + '" x2="' + x0 + '" y2="' + (yA + 16) + '" style="stroke-width:3"/>' + T(x0 - 12, yA + 5, 'v<sub>i</sub> = 0：短路', { cls: 'ta', fs: 12.5, a: 'end' });
      else s += acSrc(x0, yA) + T(x0 - 22, yA + 5, opt.vi || 'v<sub>i</sub>', { cls: 't', fs: 14, a: 'end' });
      if (mode === 'ac') s += '<line class="lna" x1="' + x0 + '" y1="' + (yB - 6) + '" x2="' + x0 + '" y2="' + (yB + 6) + '" style="stroke-width:3"/>' + T(x0 - 12, yB + 5, 'V<sub>PS</sub> → 交流接地', { cls: 'ta', fs: 12.5, a: 'end' });
      else s += K.bat(x0, yB) + T(x0 - 22, yB + 5, opt.vps || 'V<sub>PS</sub>', { cls: 't', fs: 14, a: 'end' });
      if (mode === 'dc') s += '<path class="ln" style="fill:none" d="M' + xe1 + ' ' + y0 + ' H' + (xm - 5) + ' M' + (xm + 5) + ' ' + y0 + ' H' + xe2 + '"/>' + batH(xm, y0) + T(xm, y0 - 22, opt.vg || 'V<sub>γ</sub> = 0.6 V', { cls: 'ta', fs: 13 });
      else if (mode === 'ac') s += K.res(xe1, y0, xe2 - xe1).replace('class="ln"', 'class="lna"') + T(xm, y0 - 18, opt.rd || 'r<sub>d</sub>', { cls: 'ta', fs: 13 });
      else s += '<path class="ln" style="fill:none" d="M' + xe1 + ' ' + y0 + ' H' + (xm - 10) + ' M' + (xm + 10) + ' ' + y0 + ' H' + xe2 + '"/>' + diodeH(xm, y0) + T(xm, y0 - 20, 'D', { cls: 'tm', fs: 13 });
      return g(opt.k, s);
    }
    /* 少數載子「倉庫」：p 區、空乏區、n 區，兩邊指數下降的濃度曲線；amp 決定高度 */
    function store(x0, y0, w, h, amp, key, cls) {
      const jl = x0 + w * 0.45, jr = x0 + w * 0.55, yb = y0 + h, H = h * 0.8 * amp, L = w * 0.13;
      let d = 'M' + x0 + ' ' + yb;
      for (let n = 0; n <= 30; n++) { const x = x0 + (jl - x0) * n / 30; d += ' L' + K.f1(x) + ' ' + K.f1(yb - H * Math.exp(-(jl - x) / L)); }
      d += ' L' + jl + ' ' + yb + ' Z M' + jr + ' ' + yb;
      for (let n = 0; n <= 30; n++) { const x = jr + (x0 + w - jr) * n / 30; d += ' L' + K.f1(x) + ' ' + K.f1(yb - H * Math.exp(-(x - jr) / L)); }
      d += ' L' + (x0 + w) + ' ' + yb + ' Z';
      return '<path class="' + (cls || 'accw') + '" style="stroke:var(--s-acc);stroke-width:2" d="' + d + '"' + K.k(key) + '/>';
    }
    function storeFrame(x0, y0, w, h) {
      const jl = x0 + w * 0.45, jr = x0 + w * 0.55;
      return '<rect class="bgw" x="' + jl + '" y="' + y0 + '" width="' + (jr - jl) + '" height="' + h + '" style="opacity:.6"/>' +
        '<line class="ln" x1="' + x0 + '" y1="' + (y0 + h) + '" x2="' + (x0 + w) + '" y2="' + (y0 + h) + '"/>' +
        T(x0 + w * 0.2, y0 + h + 20, 'p 區', { cls: 't', fs: 14 }) + T(x0 + w * 0.8, y0 + h + 20, 'n 區', { cls: 't', fs: 14 }) + T((jl + jr) / 2, y0 + h + 20, '空乏區', { cls: 'ts', fs: 11 });
    }
    /* 齊納電路：左電池、上電阻、右邊齊納（陰極朝上） */
    function zCirc(x0, y0, w, h, opt) {
      opt = opt || {};
      const xr = x0 + w, ym = y0 + h / 2;
      let s = '<path class="ln" style="fill:none" d="M' + x0 + ' ' + (ym - 6) + ' V' + y0 + ' H' + (x0 + w * 0.3) + ' M' + (x0 + w * 0.7) + ' ' + y0 + ' H' + xr + ' V' + (ym - 12) + ' M' + xr + ' ' + (ym + 12) + ' V' + (y0 + h) + ' H' + x0 + ' V' + (ym + 6) + '"/>';
      s += K.bat(x0, ym) + T(x0 - 22, ym + 5, opt.vps || 'V<sub>PS</sub>', { cls: 't', fs: 14, a: 'end' });
      s += K.res(x0 + w * 0.3, y0, w * 0.4) + T(x0 + w / 2, y0 - 14, opt.r || 'R', { cls: 't', fs: 14 });
      if (opt.model) s += '<line class="ln" x1="' + xr + '" y1="' + (ym - 12) + '" x2="' + xr + '" y2="' + (ym - 6) + '"/><line class="ln" x1="' + xr + '" y1="' + (ym + 6) + '" x2="' + xr + '" y2="' + (ym + 12) + '"/>' + K.bat(xr, ym) + T(xr + 22, ym + 5, opt.vz || 'V<sub>Z</sub>', { cls: 'ta', fs: 14, a: 'start' });
      else s += '<path class="accw" style="stroke:var(--s-ink);stroke-width:2" d="M' + (xr - 12) + ' ' + (ym + 10) + ' H' + (xr + 12) + ' L' + xr + ' ' + (ym - 10) + ' Z"/>' +
        '<path class="ln" style="fill:none;stroke-width:2.6" d="M' + (xr - 16) + ' ' + (ym - 6) + ' L' + (xr - 12) + ' ' + (ym - 10) + ' H' + (xr + 12) + ' L' + (xr + 16) + ' ' + (ym - 14) + '"/>' +
        T(xr + 22, ym + 5, opt.vz || 'V<sub>Z</sub>', { cls: 't', fs: 14, a: 'start' });
      return g(opt.k, s);
    }
    return { diodeH, acSrc, batH, c111, store, storeFrame, zCirc };
  })();
  window.__K16 = K16;

  /* ---------- 題目圖（schem.js） ---------- */
  const F111 = (vi, vps, r) => S.svg(420, 180, ['<g transform="translate(90,10)">',
    S.vac(40, 20, 80, vi || 'v_i'), S.vs(40, 80, 150, vps || 'V_PS'),
    S.w('40,20', '90,20'), S.d(90, 20, 170, 20, 'D'), S.w('170,20', '220,20'),
    S.r(220, 20, 220, 150, r || 'R'), S.w('220,150', '40,150'),
    S.term(270, 20), S.term(270, 150), S.w('220,20', '270,20'), S.w('220,150', '270,150'),
    S.t(282, 36, '+', 'start'), S.t(282, 142, '−', 'start'), S.t(282, 90, 'v_O', 'start'), '</g>']);
  const FSS = S.svg(360, 170, ['<g transform="translate(80,10)">',
    S.vac(40, 20, 80, 'v_d = 5 mV sin ωt'), S.vs(40, 80, 150, 'V_DQ = 0.65 V'),
    S.w('40,20', '160,20'), S.d(160, 20, 160, 150, ''), S.w('160,150', '40,150'),
    S.t(178, 70, '+', 'start'), S.t(178, 120, '−', 'start'), S.t(184, 96, 'v_D', 'start'), S.t(120, 12, 'i_D →', 'middle', ' font-size="11"'), '</g>']);
  const FZ = S.svg(380, 170, ['<g transform="translate(90,10)">',
    S.vs(40, 20, 150, 'V_PS = 10 V'), S.w('40,20', '90,20'), S.r(90, 20, 170, 20, 'R'), S.w('170,20', '220,20'),
    S.zd(220, 150, 220, 20, ''), S.w('220,150', '40,150'),
    S.t(240, 70, '+', 'start'), S.t(240, 120, '−', 'start'), S.t(246, 96, 'V_Z = 5.6 V', 'start'), S.t(150, 46, 'I →', 'middle', ' font-size="11"'), '</g>']);
  const FSW = S.svg(380, 170, ['<g transform="translate(90,10)">',
    S.vs(40, 20, 150, 'v_S：+5.7 V → −5 V'), S.w('40,20', '90,20'), S.r(90, 20, 170, 20, 'R = 1 kΩ'), S.w('170,20', '220,20'),
    S.d(220, 20, 220, 150, ''), S.w('220,150', '40,150'), S.t(150, 46, 'i_D →', 'middle', ' font-size="11"'), '</g>']);

  const VT = 0.026;
  const items = [
    /* ═══════════ 01 小訊號（自編） ═══════════ */
    { id: 'p6-ss', sec: 'ss', kind: 'pp', no: '', tag: '自編練習', title: '把電流拆成直流＋交流',
      q: '二極體 I<sub>S</sub> = 10<sup>−14</sup> A、V<sub>T</sub> = 0.026 V，兩端電壓 v<sub>D</sub>(t) = 0.65 + 0.005 sin ωt V。(a) 求 I<sub>DQ</sub>；(b) 求 r<sub>d</sub>；(c) 用小訊號近似寫出 i<sub>D</sub>(t)；(d) 用指數公式精確算電流的最大、最小值，看近似差多少。',
      en: 'A diode with I<sub>S</sub> = 10<sup>−14</sup> A has v<sub>D</sub>(t) = 0.65 + 0.005 sin ωt V. (a) Find I<sub>DQ</sub>. (b) Find r<sub>d</sub>. (c) Write i<sub>D</sub>(t) using the small-signal approximation. (d) Use the exponential equation to find the exact maximum and minimum currents and compare.',
      fig: FSS, cap: '直流 0.65 V 上面疊 5 mV 交流',
      hint: '直流只看 0.65 V；r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub>；交流 i<sub>d</sub> = v<sub>d</sub>/r<sub>d</sub>。精確值用 I<sub>DQ</sub>e<sup>±5/26</sup>。',
      steps: [
        st('(a) 直流。', 'I<sub>DQ</sub> = 10<sup>−14</sup> e<sup>0.65/0.026</sup> = 10<sup>−14</sup> × 7.20 × 10<sup>10</sup> = 0.720 mA', '0.65/0.026 = 25，e<sup>25</sup> ≈ 7.20 × 10<sup>10</sup>。'),
        st('(b) 增量電阻。', 'r<sub>d</sub> = 0.026/0.720 mA = 36.1 Ω', 'Q 點的切線斜率倒數。'),
        st('(c) 交流與總電流。', 'i<sub>d</sub> = 5 mV/36.1 Ω = 0.138 mA　⟹　i<sub>D</sub>(t) ≈ 0.720 + 0.138 sin ωt mA', '小訊號：對交流來說二極體是一顆 36.1 Ω 的電阻。'),
        st('(d) 精確值。', 'i<sub>max</sub> = 0.720e<sup>5/26</sup> = 0.873 mA（+0.153）　i<sub>min</sub> = 0.720e<sup>−5/26</sup> = 0.594 mA（−0.126）', '往上多晃 0.153、往下只晃 0.126：近似值 0.138 夾在中間，誤差約 10%。'),
        st('結論。', 'v<sub>d</sub>/V<sub>T</sub> = 5/26 ≈ 0.19', '5 mV 只算「勉強小」。要更準，交流要再小（例如 1 mV 誤差只剩 2%）。')
      ],
      ans: '(a) 0.720 mA (b) 36.1 Ω (c) i<sub>D</sub> ≈ 0.720 + 0.138 sin ωt mA (d) 0.873 mA / 0.594 mA，上下不對稱約 10%',
      note: '自編練習。數值用程式驗算：I<sub>DQ</sub> = 0.7200 mA、r<sub>d</sub> = 36.11 Ω、i<sub>d</sub> = 0.1385 mA、精確 +0.1527／−0.1260 mA。',
      story: () => {
        const { g, T, calc, sc, axes, ansScene, D } = KK();
        const IQ = 0.72, iv = v => 1e-14 * Math.exp(v / VT) * 1e3;
        const P = axes(80, 110, 250, 170, { v0: 0.55, v1: 0.7, i0: 0, i1: 1.6, vt: [[0.65, '0.65']], it: [[0.72, '0.72']] });
        return [
          sc('題目：直流上疊一點交流', 'THE QUESTION',
            P.svg + P.curve(iv, 0.55, 0.668, 'cv') + P.dot(0.65, IQ, 'q') + P.proj(0.65, IQ, 'pj') +
            g('wig', '<rect class="accw" x="' + P.X(0.645) + '" y="112" width="' + (P.X(0.655) - P.X(0.645)) + '" height="168" style="opacity:.5"/>') +
            calc(370, 120, 240, [['v<sub>D</sub> = 0.65 + 0.005 sin ωt', 'r1'], ['直流 0.65 V → Q 點', 'r2', 'tm'], ['交流 5 mV → 在 Q 旁邊晃', 'r3', 'tm']], { k: 'cc' }),
            [{ sub: '二極體兩端是 0.65 V 直流，上面疊一個 5 mV 的交流。', on: 'cv cc r1' },
             { sub: '直流決定 Q 點：先只看 0.65 V。', on: 'q pj r2' },
             { sub: '交流讓它在 Q 點旁邊<b>小小地晃</b>（藍色那一條）。', on: 'wig r3' }]),
          sc('先算直流，再算 r<sub>d</sub>', 'DC FIRST, THEN r<sub>d</sub>',
            calc(120, 112, 400, [['I<sub>DQ</sub> = 10<sup>−14</sup> e<sup>0.65/0.026</sup> = 0.720 mA', 'r1'], ['r<sub>d</sub> = 0.026 / 0.720 mA = 36.1 Ω', 'r2', 'ta'], ['i<sub>d</sub> = 5 mV / 36.1 Ω = 0.138 mA', 'r3', 'ta'], ['i<sub>D</sub>(t) ≈ 0.720 + 0.138 sin ωt mA', 'r4', 'ta']], { k: 'cc', fs: 15 }),
            [{ sub: '直流：0.65 ÷ 0.026 = 25，e<sup>25</sup> 乘 10<sup>−14</sup> → <b>0.720 mA</b>。', on: 'cc r1' },
             { sub: 'Q 點的 r<sub>d</sub> = 26 mV ÷ 0.720 mA = <b>36.1 Ω</b>。', on: 'r2' },
             { sub: '交流當成電阻：5 mV ÷ 36.1 Ω = <b>0.138 mA</b>。', on: 'r3' },
             { sub: '總電流 = 直流 + 交流。', on: 'r4' }]),
          sc('近似準不準？', 'HOW GOOD IS IT?',
            g('b1', '<rect class="acc" x="200" y="140" width="306" height="22" rx="4"/>' + T(190, 156, '往上 +0.153', { cls: 't', fs: 13, a: 'end' })) +
            g('b2', '<rect class="ln2" x="200" y="180" width="276" height="22" rx="4" style="fill:var(--s-ink3,#999)"/>' + T(190, 196, '直線近似 0.138', { cls: 't', fs: 13, a: 'end' })) +
            g('b3', '<rect class="accw" x="200" y="220" width="252" height="22" rx="4" style="stroke:var(--s-acc)"/>' + T(190, 236, '往下 −0.126', { cls: 't', fs: 13, a: 'end' })) +
            D.chip(320, 286, 'v<sub>d</sub> / V<sub>T</sub> = 5/26 ≈ 0.19', '只算「勉強小」，誤差約 10%', 'c1', { fs: 13 }),
            [{ sub: '用指數公式精確算：往上多 <b>0.153 mA</b>。', on: 'b1' },
             { sub: '直線近似說 0.138 mA。', on: 'b2' },
             { sub: '往下只少 <b>0.126 mA</b>：上下不對稱。', on: 'b3' },
             { sub: '因為 5 mV 跟 26 mV 比不算很小。交流越小，越對稱。', on: 'c1' }]),
          ansScene(['i<sub>D</sub>(t) ≈ 0.720 + 0.138 sin ωt mA', 'I<sub>DQ</sub> = 0.720 mA、r<sub>d</sub> = 36.1 Ω', '精確：+0.153／−0.126 mA'], ['答案：0.720 mA 直流上晃 ±0.138 mA。', '精確值上下不對稱約 10%。'])
        ];
      } },

    /* ═══════════ 02 r_d（講義 1-12） ═══════════ */
    { id: 'p6-rd', sec: 'rd', kind: 'ex', no: '', tag: '講義 1-11、1-12', title: '在 V<sub>DQ</sub> = 0.6 V 求 r<sub>d</sub>',
      q: '給定 I<sub>S</sub> = 1.0 × 10<sup>−14</sup> A、n = 1、V<sub>T</sub> = 0.026 V、V<sub>DQ</sub> = 0.600 V。對二極體特性在工作點微分，求 I<sub>DQ</sub>、增量電導與增量電阻 r<sub>d</sub>，再用近似式 r<sub>d</sub> ≈ nV<sub>T</sub>/I<sub>DQ</sub> 檢查。',
      en: 'Given I<sub>S</sub> = 1.0 × 10<sup>−14</sup> A, n = 1, V<sub>T</sub> = 0.026 V and V<sub>DQ</sub> = 0.600 V, differentiate the diode characteristic at the Q-point to find I<sub>DQ</sub>, the incremental conductance and the incremental resistance r<sub>d</sub>; check with r<sub>d</sub> ≈ nV<sub>T</sub>/I<sub>DQ</sub>.',
      idea: '切線斜率 di<sub>D</sub>/dv<sub>D</sub> 在 Q 點的值 = g<sub>d</sub>；倒數就是 r<sub>d</sub>。',
      steps: [
        st('先算工作點電流。', 'I<sub>DQ</sub> ≈ I<sub>S</sub>e<sup>V<sub>DQ</sub>/(nV<sub>T</sub>)</sup> = 10<sup>−14</sup> e<sup>0.600/0.026</sup> ≈ 1.0524 × 10<sup>−4</sup> A = 105.24 μA', '順偏、指數 ≫ 1，−1 丟掉。'),
        st('微分得增量電導。', 'di<sub>D</sub>/dv<sub>D</sub>|<sub>Q</sub> = (I<sub>S</sub>/nV<sub>T</sub>)e<sup>V<sub>DQ</sub>/(nV<sub>T</sub>)</sup> = (10<sup>−14</sup>/0.026) × 1.0524 × 10<sup>10</sup> ≈ 4.048 × 10<sup>−3</sup> A/V', '講義用紅筆圈起來：I<sub>S</sub>e<sup>V/V<sub>T</sub></sup> 就是 I<sub>DQ</sub>，所以 g<sub>d</sub> = I<sub>DQ</sub>/V<sub>T</sub>。'),
        st('取倒數。', 'r<sub>d</sub> = 1/(4.048 × 10<sup>−3</sup>) ≈ 247 Ω', '增量電阻與增量電導互為倒數。'),
        st('用近似式檢查。', 'r<sub>d</sub> ≈ 0.026/105.24 μA ≈ 247 Ω　MATCHED!!', '兩種算法同一個答案：考試直接用 V<sub>T</sub>/I<sub>DQ</sub>。')
      ],
      ans: 'I<sub>DQ</sub> ≈ 105.24 μA、g<sub>d</sub> ≈ 4.048 mA/V、r<sub>d</sub> ≈ 247 Ω',
      story: () => {
        const { g, T, calc, sc, axes, ansScene, D } = KK();
        const IQ = 0.10524, iv = v => 1e-14 * Math.exp(v / VT) * 1e3, gd = IQ / VT;
        const P = axes(80, 110, 260, 170, { v0: 0.5, v1: 0.66, i0: 0, i1: 0.5, vt: [[0.6, '0.6 V']], it: [[IQ, '105 μA']] });
        return [
          sc('在 0.6 V 那一點畫切線', 'TANGENT AT Q',
            P.svg + P.curve(iv, 0.5, 0.64, 'cv') + P.dot(0.6, IQ, 'q') + P.proj(0.6, IQ, 'pj') +
            P.seg(0.6 - IQ / gd, 0, 0.64, IQ + gd * 0.04, 'tg', 'ln', ' style="stroke-width:2.4"') +
            calc(380, 130, 220, [['斜率 = di<sub>D</sub>/dv<sub>D</sub>', 'r1'], ['= g<sub>d</sub>（增量電導）', 'r2', 'ta'], ['r<sub>d</sub> = 1/g<sub>d</sub>', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '二極體曲線，工作點在 V<sub>DQ</sub> = 0.6 V。', on: 'cv q pj' },
             { sub: '在 Q 點畫一條<b>切線</b>。', on: 'tg cc r1' },
             { sub: '切線斜率叫<b>增量電導 g<sub>d</sub></b>，倒數就是<b>增量電阻 r<sub>d</sub></b>。', on: 'r2 r3' }]),
          sc('代數字', 'PLUG IN',
            calc(110, 112, 420, [['I<sub>DQ</sub> = 10<sup>−14</sup> e<sup>0.6/0.026</sup> = 105.24 μA', 'r1'], ['g<sub>d</sub> = I<sub>DQ</sub>/V<sub>T</sub> = 4.048 × 10<sup>−3</sup> A/V', 'r2', 'ta'], ['r<sub>d</sub> = 1/g<sub>d</sub> = 247 Ω', 'r3', 'ta'], ['檢查：0.026 / 105.24 μA = 247 Ω ✓', 'r4', 'tm']], { k: 'cc', fs: 15 }),
            [{ sub: '先算 Q 點電流：<b>105.24 μA</b>。', on: 'cc r1' },
             { sub: '微分會掉出 1/V<sub>T</sub>，剩下的正好是 I<sub>DQ</sub>：g<sub>d</sub> = I<sub>DQ</sub>/V<sub>T</sub>。', on: 'r2' },
             { sub: '倒數：<b>247 Ω</b>。', on: 'r3' },
             { sub: '近似式 V<sub>T</sub>/I<sub>DQ</sub> 一行就得到同樣答案。', on: 'r4' }]),
          ansScene(['r<sub>d</sub> ≈ 247 Ω', 'I<sub>DQ</sub> ≈ 105.24 μA', 'g<sub>d</sub> ≈ 4.048 mA/V'], ['答案：r<sub>d</sub> ≈ 247 Ω。'])
        ];
      } },

    /* ═══════════ 03 Example 1.11 ═══════════ */
    { id: 'p6-111', sec: 'dcac', kind: 'ex', no: '1.11', tag: 'Example 1.11', title: '先 DC 再 AC',
      q: '分析下圖電路：V<sub>PS</sub> = 5 V、R = 5 kΩ、V<sub>γ</sub> = 0.6 V、v<sub>i</sub> = 0.1 sin ωt（V）。求直流 I<sub>DQ</sub>、V<sub>O</sub>，以及交流 i<sub>d</sub>、v<sub>o</sub>。',
      en: 'Analyze the circuit shown. Assume circuit and diode parameters of V<sub>PS</sub> = 5 V, R = 5 kΩ, V<sub>γ</sub> = 0.6 V, and v<sub>i</sub> = 0.1 sin ωt (V).',
      fig: F111('v_i = 0.1 sin ωt', 'V_PS = 5 V', 'R = 5 kΩ'), cap: 'Figure 1.35(a)：v<sub>i</sub> 跟 V<sub>PS</sub> 串聯',
      idea: '把電路拆成 DC 和 AC 兩張：DC 求 Q 點與 r<sub>d</sub>，AC 用 r<sub>d</sub> 算交流。',
      steps: [
        st('DC 分析：令 v<sub>i</sub> = 0，二極體換成 0.6 V。', 'I<sub>DQ</sub> = (V<sub>PS</sub> − V<sub>γ</sub>)/R = (5 − 0.6)/5 = 0.88 mA', '交流源歸零就是短路。'),
        st('直流輸出。', 'V<sub>O</sub> = I<sub>DQ</sub>R = 0.88 × 5 = 4.4 V'),
        st('Q 點的 r<sub>d</sub>。', 'r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub> = 0.026/0.88 = 0.0295 kΩ = 29.5 Ω', '交流阻抗跟直流工作點有關。'),
        st('AC 分析：令 V<sub>PS</sub> = 0，二極體換成 r<sub>d</sub>，寫 KVL。', 'v<sub>i</sub> = i<sub>d</sub>r<sub>d</sub> + i<sub>d</sub>R　⟹　i<sub>d</sub> = 0.1 sin ωt / (0.0295 + 5) ⟹ 19.9 sin ωt（μA）', '直流電壓源的交流增量是 0 → 短路。'),
        st('交流輸出。', 'v<sub>o</sub> = i<sub>d</sub>R = 0.0995 sin ωt（V）', 'r<sub>d</sub> ≪ R，交流幾乎全部落在 R 上。'),
        st('講義 NOTE：試繪 v<sub>O</sub>、i<sub>O</sub>、v<sub>D</sub>、i<sub>D</sub> 波形。', 'v<sub>O</sub> = 4.4 + 0.0995 sin ωt V；i<sub>D</sub> = 0.88 + 0.0199 sin ωt mA；v<sub>D</sub> ≈ 0.6 + 0.59 sin ωt mV', 'v<sub>D</sub> 的交流 = i<sub>d</sub>r<sub>d</sub> = 19.9 μA × 29.5 Ω ≈ 0.59 mV（≪ 26 mV，小訊號成立）。i<sub>O</sub> 就是流過 R 的 i<sub>D</sub>。')
      ],
      ans: 'I<sub>DQ</sub> = 0.88 mA、V<sub>O</sub> = 4.4 V、r<sub>d</sub> = 29.5 Ω、i<sub>d</sub> = 19.9 sin ωt μA、v<sub>o</sub> = 0.0995 sin ωt V',
      note: '程式精確值 v<sub>o</sub> = 0.0994 sin ωt V（課本把 i<sub>d</sub> 先四捨五入成 19.9 μA 再乘 5 kΩ 得 0.0995）。v<sub>D</sub> 的直流用定電壓降模型寫成 0.6 V。',
      story: () => {
        const { g, T, calc, sc, sine, ansScene, D } = KK();
        const C = window.__K16;
        return [
          sc('題目：兩個電源一起推', 'THE CIRCUIT',
            C.c111(150, 130, 170, 150, 'full', { k: 'cir', vi: '0.1 sin ωt', vps: '5 V', r: '5 kΩ' }) +
            D.chip(470, 160, '直流 5 V', '決定 Q 點', 'c1', { fs: 13 }) + D.chip(470, 225, '交流 0.1 V', '在 Q 點上晃', 'c2', { fs: 13, acc: true }),
            [{ sub: 'Example 1.11：交流 v<sub>i</sub> 跟直流 V<sub>PS</sub> 串在一起推二極體。', on: 'cir' },
             { sub: '直流 5 V 決定二極體停在哪（Q 點）。', on: 'c1' },
             { sub: '交流 0.1 V 讓它在 Q 點旁邊晃。兩個一起算太亂 → <b>拆開</b>。', on: 'c2' }]),
          sc('第一張：DC 電路', 'DC CIRCUIT',
            C.c111(150, 130, 150, 150, 'dc', { k: 'cir', vps: '5 V', r: '5 kΩ' }) +
            calc(380, 120, 230, [['I<sub>DQ</sub> = (5 − 0.6)/5k', 'r1'], ['= 0.88 mA', 'r2', 'ta'], ['V<sub>O</sub> = 0.88 × 5 = 4.4 V', 'r3', 'ta'], ['r<sub>d</sub> = 0.026/0.88m = 29.5 Ω', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: 'DC：交流源歸零 = <b>短路</b>，二極體換成 <b>0.6 V 電池</b>。', on: 'cir' },
             { sub: '一條 KVL：I<sub>DQ</sub> = 4.4 V ÷ 5 kΩ = <b>0.88 mA</b>。', on: 'cc r1 r2' },
             { sub: '直流輸出 V<sub>O</sub> = <b>4.4 V</b>。', on: 'r3' },
             { sub: '有了 Q 點，就能算 r<sub>d</sub> = <b>29.5 Ω</b>。', on: 'r4' }]),
          sc('第二張：AC 電路', 'AC CIRCUIT',
            C.c111(150, 130, 150, 150, 'ac', { k: 'cir', vi: '0.1 sin ωt', r: '5 kΩ', rd: 'r<sub>d</sub> = 29.5 Ω' }) +
            calc(380, 120, 230, [['0.1 = i<sub>d</sub>(29.5 + 5000)', 'r1'], ['i<sub>d</sub> = 19.9 μA', 'r2', 'ta'], ['v<sub>o</sub> = i<sub>d</sub>R = 0.0995 V', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: 'AC：直流電壓源的變化量是 0 → <b>交流接地</b>（短路）；二極體換成 <b>r<sub>d</sub></b>。', on: 'cir' },
             { sub: 'r<sub>d</sub> 跟 R 串聯：i<sub>d</sub> = 0.1 ÷ 5.0295 kΩ = <b>19.9 μA</b>。', on: 'cc r1 r2' },
             { sub: 'v<sub>o</sub> = 19.9 μA × 5 kΩ = <b>0.0995 V</b>。r<sub>d</sub> 很小，交流幾乎全到輸出。', on: 'r3' }]),
          sc('合起來', 'PUT THEM TOGETHER',
            '<line class="ln2 dsh" x1="80" y1="190" x2="580" y2="190"' + KK().k('dc') + '/>' + T(84, 182, 'V<sub>O</sub> = 4.4 V', { cls: 'tm', fs: 13, a: 'start', k: 'dcl' }) +
            sine(80, 190, 500, 26, { k: 'ac' }) +
            D.chip(330, 280, 'v<sub>O</sub>(t) = 4.4 + 0.0995 sin ωt V', '總量 = 直流 + 交流', 'c1', { fs: 14, acc: true }),
            [{ sub: '直流：一條 4.4 V 的水平線。', on: 'dc dcl' },
             { sub: '交流：在上面晃 ±0.0995 V（圖上放大畫）。', on: 'ac' },
             { sub: '總輸出 = 直流 + 交流。能這樣加，是因為小訊號下 AC 電路是線性的。', on: 'c1' }]),
          ansScene(['v<sub>O</sub> = 4.4 + 0.0995 sin ωt V', 'I<sub>DQ</sub> = 0.88 mA、r<sub>d</sub> = 29.5 Ω', 'i<sub>d</sub> = 19.9 sin ωt μA'], ['答案：先 DC 得 0.88 mA、4.4 V。', '再 AC 得 19.9 μA、0.0995 V。'])
        ];
      } },

    /* ═══════════ 04 Q 點太低（自編） ═══════════ */
    { id: 'p6-q', sec: 'qdes', kind: 'pp', no: '', tag: '自編練習', title: 'Q 點太低會怎樣',
      q: '同 Example 1.11 的電路，但 V<sub>PS</sub> 改成 1 V、v<sub>i</sub> = 0.5 sin ωt V（R = 5 kΩ、V<sub>γ</sub> = 0.6 V）。(a) 求 I<sub>DQ</sub>、r<sub>d</sub>；(b) 負半週二極體會不會 OFF？OFF 的部分大約佔一週期的多少？(c) V<sub>PS</sub> 至少要多大才不會截止？',
      en: 'Repeat Example 1.11 with V<sub>PS</sub> = 1 V and v<sub>i</sub> = 0.5 sin ωt V (R = 5 kΩ, V<sub>γ</sub> = 0.6 V). (a) Find I<sub>DQ</sub> and r<sub>d</sub>. (b) Does the diode turn off during the negative half-cycle, and for what fraction of the period? (c) What minimum V<sub>PS</sub> avoids cutoff?',
      fig: F111('v_i = 0.5 sin ωt', 'V_PS = 1 V', 'R = 5 kΩ'), cap: '同一個電路，直流變小、交流變大',
      hint: '二極體要 ON：V<sub>PS</sub> + v<sub>i</sub> &gt; 0.6 V。最低點 v<sub>i</sub> = −0.5 V。',
      steps: [
        st('(a) Q 點。', 'I<sub>DQ</sub> = (1 − 0.6)/5k = 0.08 mA　r<sub>d</sub> = 0.026/0.08m = 325 Ω'),
        st('(b) 最低點。', 'V<sub>PS</sub> − V<sub>m</sub> = 1 − 0.5 = 0.5 V &lt; 0.6 V　⟹　會 OFF', '谷底時推力不夠 0.6 V，二極體截止，輸出被削成 0。'),
        st('什麼時候 OFF。', '1 + 0.5 sin ωt &lt; 0.6　⟹　sin ωt &lt; −0.8　⟹　ωt 在 233.1°～306.9°', 'arcsin 0.8 = 53.13°，以 270° 為中心左右各 36.9°。'),
        st('佔多少。', '(306.9 − 233.1)/360 ≈ 20.5 %', '每一週期約有兩成時間輸出是 0（截止失真）。'),
        st('(c) 不截止的條件。', 'V<sub>PS</sub> − 0.5 &gt; 0.6　⟹　V<sub>PS</sub> &gt; 1.1 V', '另外，就算不截止，二極體上的 v<sub>d</sub> = 0.5 × 325/(325 + 5000) ≈ 30.5 mV，也已經超過 26 mV → 還會有非線性失真；Q 點要拉得更高。')
      ],
      ans: '(a) I<sub>DQ</sub> = 0.08 mA、r<sub>d</sub> = 325 Ω (b) 會 OFF，約 20.5% 的時間 (c) V<sub>PS</sub> &gt; 1.1 V（要小訊號成立還要更高）',
      note: '自編練習，用定電壓降模型判斷 ON/OFF。',
      story: () => {
        const { g, T, calc, sc, ansScene, D } = KK();
        let d1 = '', d2 = '';
        for (let n = 0; n <= 120; n++) { const u = n / 120, vi = 0.5 * Math.sin(u * 4 * Math.PI), x = 80 + u * 480; d1 += (n ? ' L' : 'M') + x.toFixed(1) + ' ' + (220 - (1 + vi) * 70).toFixed(1); d2 += (n ? ' L' : 'M') + x.toFixed(1) + ' ' + (220 - Math.max(0, 1 + vi - 0.6) * 70 * 2).toFixed(1); }
        return [
          sc('直流太小、交流太大', 'LOW Q-POINT',
            '<line class="ln2" x1="80" y1="220" x2="570" y2="220"/>' + '<line class="lna dsh" x1="80" y1="178" x2="570" y2="178"' + KK().k('th') + '/>' + T(574, 182, '0.6 V', { cls: 'ta', fs: 12, a: 'start', k: 'thl' }) +
            '<path class="ln" style="fill:none;stroke-width:2.4" d="' + d1 + '"' + KK().k('in') + '/>' + T(84, 132, 'V<sub>PS</sub> + v<sub>i</sub> = 1 + 0.5 sin ωt', { cls: 't', fs: 13, a: 'start', k: 'inl' }) +
            g('lo', '<circle class="acc" cx="' + (80 + 0.375 * 480) + '" cy="' + (220 - 0.5 * 70) + '" r="6"/>' + T(80 + 0.375 * 480 + 12, 220 - 0.5 * 70 + 18, '谷底 0.5 V', { cls: 'ta', fs: 13, a: 'start' })),
            [{ sub: '二極體拿到的推力 = 1 V 直流 + 0.5 V 交流。', on: 'in inl' },
             { sub: '要推開門，推力要超過 <b>0.6 V</b>。', on: 'th thl' },
             { sub: '谷底只剩 1 − 0.5 = <b>0.5 V</b>：推不開，二極體 OFF。', on: 'lo' }]),
          sc('輸出被削掉一塊', 'CUTOFF CLIPPING',
            '<line class="ln2" x1="80" y1="220" x2="570" y2="220"/>' + '<path class="lna" style="fill:none;stroke-width:2.6" d="' + d2 + '"' + KK().k('out') + '/>' +
            calc(150, 248, 340, [['sin ωt &lt; −0.8 → OFF：約 20.5% 的時間', 'r1', 'ta']], { k: 'cc', lh: 26 }) +
            D.chip(470, 130, '截止失真', 'cutoff clipping', 'c1', { fs: 13, acc: true }),
            [{ sub: '輸出（放大畫）：每一週期有一段被<b>削成 0</b>。', on: 'out' },
             { sub: '1 + 0.5 sin ωt &lt; 0.6 → sin ωt &lt; −0.8 → 每週期約 <b>20.5%</b>。', on: 'cc r1' },
             { sub: '這叫<b>截止失真</b>：Q 點太低，交流一大就被削。', on: 'c1' }]),
          sc('怎麼救', 'THE FIX',
            calc(130, 120, 380, [['不截止：V<sub>PS</sub> − 0.5 &gt; 0.6', 'r1'], ['⟹ V<sub>PS</sub> &gt; 1.1 V', 'r2', 'ta'], ['但 v<sub>d</sub> ≈ 30.5 mV &gt; 26 mV', 'r3', 'tm'], ['→ Q 點還要再拉高', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '要谷底也推得開：V<sub>PS</sub> − 0.5 要大於 0.6。', on: 'cc r1' },
             { sub: '所以 V<sub>PS</sub> 至少 <b>1.1 V</b>。', on: 'r2' },
             { sub: '另外 r<sub>d</sub> = 325 Ω，二極體上的交流約 30.5 mV，已經不算小。', on: 'r3' },
             { sub: '想要乾淨的輸出：直流拉高、交流變小。', on: 'r4' }]),
          ansScene(['會 OFF：約 20.5% 時間', 'I<sub>DQ</sub> = 0.08 mA、r<sub>d</sub> = 325 Ω', 'V<sub>PS</sub> 至少 1.1 V'], ['答案：會截止，每週期約兩成。', 'V<sub>PS</sub> 要大於 1.1 V。'])
        ];
      } },

    /* ═══════════ 05 兩種電容（自編） ═══════════ */
    { id: 'p6-cap', sec: 'cap', kind: 'pp', no: '', tag: '自編練習', title: '順偏、逆偏各剩哪個電容',
      q: '一顆二極體順偏在 I<sub>DQ</sub> = 2 mA，少數載子壽命 τ = 10 ns，這時接面電容 C<sub>j</sub> ≈ 3 pF。(a) 用 C<sub>d</sub> = τI<sub>DQ</sub>/(2V<sub>T</sub>) 求擴散電容；(b) 誰是主角？(c) 改成逆偏 5 V，哪一個電容還在？會變大還變小？',
      en: 'A diode is forward biased at I<sub>DQ</sub> = 2 mA with τ = 10 ns, and C<sub>j</sub> ≈ 3 pF. (a) Find C<sub>d</sub> = τI<sub>DQ</sub>/(2V<sub>T</sub>). (b) Which capacitance dominates? (c) Under a 5 V reverse bias, which capacitance remains, and does it increase or decrease?',
      hint: 'C<sub>d</sub> 跟著「注入的少數載子庫存」走；逆偏沒有注入。C<sub>j</sub> 是空乏區的電容，空乏區變寬 → 電容變小（PART 3）。',
      steps: [
        st('(a) 擴散電容。', 'C<sub>d</sub> = 10 ns × 2 mA / (2 × 0.026) = 385 pF', '課本式子（講義只寫 C<sub>d</sub> = dQ/dV 的觀念）。'),
        st('(b) 比一比。', 'C<sub>d</sub>/C<sub>j</sub> ≈ 385/3 ≈ 128', '順偏＋交流：C<sub>d</sub> ≫ C<sub>j</sub>（講義 1-18）。'),
        st('(c) 逆偏。', 'I<sub>DQ</sub> ≈ 0 ⟹ C<sub>d</sub> ≈ 0；只剩 C<sub>j</sub>', '沒有注入就沒有庫存。'),
        st('C<sub>j</sub> 變大還變小？', '逆偏 ⟹ 空乏區變寬 ⟹ C<sub>j</sub> 變小（比 3 pF 小）', '平行板電容：板距變大、電容變小（PART 3 的變容二極體）。')
      ],
      ans: '(a) C<sub>d</sub> ≈ 385 pF (b) C<sub>d</sub> ≫ C<sub>j</sub>（約 128 倍）(c) 只剩 C<sub>j</sub>，而且比 3 pF 小',
      note: '自編練習。C<sub>j</sub> 的數值只是示意；C<sub>d</sub> 公式是課本 §1.4 的延伸。',
      story: () => {
        const { g, T, calc, sc, ansScene, D } = KK();
        const C = window.__K16;
        return [
          sc('順偏：倉庫堆滿貨', 'FORWARD: FULL STOCK',
            C.storeFrame(90, 120, 300, 150) + C.store(90, 120, 300, 150, 0.9, 'st') +
            calc(420, 120, 190, [['庫存 = 注入的', 'r1', 'tm'], ['少數載子', 'r2', 'tm'], ['C<sub>d</sub> = ΔQ/ΔV', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '順偏時，電子衝進 p 區、電洞衝進 n 區，在那裡<b>堆成庫存</b>。', on: 'st cc r1 r2' },
             { sub: '電壓一變，庫存跟著變：ΔQ/ΔV 就是<b>擴散電容 C<sub>d</sub></b>。', on: 'r3' }]),
          sc('算一下', 'THE NUMBERS',
            calc(120, 120, 400, [['C<sub>d</sub> = τI<sub>DQ</sub>/(2V<sub>T</sub>)', 'r1'], ['= 10n × 2m / 0.052 = 385 pF', 'r2', 'ta'], ['C<sub>j</sub> ≈ 3 pF → C<sub>d</sub> 大約 128 倍', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '課本式子：電流越大、壽命越長，庫存越多。', on: 'cc r1' },
             { sub: 'C<sub>d</sub> ≈ <b>385 pF</b>。', on: 'r2' },
             { sub: '接面電容只有 3 pF：順偏時 <b>C<sub>d</sub> ≫ C<sub>j</sub></b>。', on: 'r3' }]),
          sc('逆偏：倉庫空了', 'REVERSE: EMPTY',
            C.storeFrame(90, 120, 300, 150) + C.store(90, 120, 300, 150, 0.04, 'st') +
            '<rect class="accw" x="210" y="120" width="60" height="150" style="opacity:.8"' + KK().k('dep') + '/>' +
            calc(420, 120, 190, [['C<sub>d</sub> ≈ 0', 'r1', 'ta'], ['只剩 C<sub>j</sub>', 'r2', 'ta'], ['空乏區變寬', 'r3', 'tm'], ['→ C<sub>j</sub> 變小', 'r4', 'tm']], { k: 'cc' }),
            [{ sub: '逆偏沒有注入，倉庫是空的 → <b>C<sub>d</sub> ≈ 0</b>。', on: 'st cc r1' },
             { sub: '空乏區還在，所以<b>只剩 C<sub>j</sub></b>。', on: 'r2' },
             { sub: '而且逆偏讓空乏區變寬（板子拉開），C<sub>j</sub> <b>變小</b>。', on: 'dep r3 r4' }]),
          ansScene(['C<sub>d</sub> ≈ 385 pF ≫ C<sub>j</sub>', '逆偏：C<sub>d</sub> ≈ 0，只剩 C<sub>j</sub>', 'C<sub>j</sub> 比 3 pF 小'], ['答案：順偏 C<sub>d</sub> 是主角。', '逆偏只剩 C<sub>j</sub>，而且變小。'])
        ];
      } },

    /* ═══════════ 06 等效電路（自編） ═══════════ */
    { id: 'p6-z', sec: 'sseq', kind: 'pp', no: '', tag: '自編練習', title: '二極體的轉折頻率',
      q: '二極體順偏在 I<sub>DQ</sub> = 1 mA，擴散電容 C<sub>d</sub> = 192 pF（忽略 C<sub>j</sub>、r<sub>s</sub>）。用小訊號等效電路 r<sub>d</sub> ∥ C<sub>d</sub>：(a) 求 r<sub>d</sub>；(b) 求 |Z| 降到 r<sub>d</sub>/√2 的頻率 f<sub>c</sub>；(c) f = 10f<sub>c</sub> 時 |Z| 是多少？',
      en: 'A diode is biased at I<sub>DQ</sub> = 1 mA with C<sub>d</sub> = 192 pF (neglect C<sub>j</sub> and r<sub>s</sub>). Using r<sub>d</sub> ∥ C<sub>d</sub>: (a) find r<sub>d</sub>; (b) find the frequency f<sub>c</sub> at which |Z| = r<sub>d</sub>/√2; (c) find |Z| at f = 10f<sub>c</sub>.',
      hint: '並聯加導納：Y = 1/r<sub>d</sub> + jωC<sub>d</sub>。兩項一樣大時 |Y| = √2/r<sub>d</sub>。',
      steps: [
        st('(a)', 'r<sub>d</sub> = 0.026/1 mA = 26 Ω'),
        st('(b) 轉折：電阻那一支 = 電容那一支。', '1/r<sub>d</sub> = 2πf<sub>c</sub>C<sub>d</sub>　⟹　f<sub>c</sub> = 1/(2π × 26 × 192p) ≈ 31.9 MHz', '這時 |Y| = √2/r<sub>d</sub>，|Z| = 26/√2 = 18.4 Ω。'),
        st('(c) 10 倍頻率。', '|Y| = (1/r<sub>d</sub>)√(1 + 10<sup>2</sup>)　⟹　|Z| = 26/√101 ≈ 2.59 Ω', '電容那支是電阻那支的 10 倍，交流幾乎都走電容。'),
        st('意義。', '低頻：二極體 ≈ 26 Ω；高頻：被電容「短路」', '這就是講義 1-16 NOTE 說的「頻率增加、等效阻抗下降」。')
      ],
      ans: '(a) 26 Ω (b) f<sub>c</sub> ≈ 31.9 MHz（|Z| = 18.4 Ω）(c) |Z| ≈ 2.59 Ω',
      note: '自編練習（C<sub>d</sub> = 192 pF 是 τ = 10 ns、1 mA 的課本式子結果）。',
      story: () => {
        const { g, T, calc, sc, ansScene, D, axes } = KK();
        const P = axes(100, 120, 300, 150, { v0: 5, v1: 10, i0: -0.2, i1: 1.6, vt: [[6, '1M'], [7, '10M'], [8, '100M'], [9, '1G']], it: [[Math.log10(26), '26'], [Math.log10(2.6), '2.6']], xl: 'f', yl: '|Z| (Ω)' });
        const fc = 1 / (2 * Math.PI * 26 * 192e-12);
        return [
          sc('交流眼中的二極體', 'WHAT AC SEES',
            g('rc', '<path class="ln" style="fill:none" d="M200 130 H440 M200 270 H440 M260 130 V170 M260 230 V270 M380 130 V180 M380 220 V270"/>' + KK().res(260, 170, 60, true) +
              '<line class="ln" x1="362" y1="194" x2="398" y2="194" style="stroke-width:2.4"/><line class="ln" x1="362" y1="206" x2="398" y2="206" style="stroke-width:2.4"/><line class="ln" x1="380" y1="180" x2="380" y2="194"/><line class="ln" x1="380" y1="206" x2="380" y2="220"/>' +
              T(240, 205, 'r<sub>d</sub>', { cls: 't', fs: 15, a: 'end' }) + T(410, 205, 'C<sub>d</sub>', { cls: 'ta', fs: 15, a: 'start' })) +
            D.chip(320, 300, 'Y = 1/r<sub>d</sub> + jωC<sub>d</sub>', '並聯：導納相加', 'c1', { fs: 13 }),
            [{ sub: '小訊號等效電路：r<sub>d</sub> 和 C<sub>d</sub> <b>並聯</b>，交流有兩條路可以走。', on: 'rc' },
             { sub: '並聯就把導納相加。', on: 'c1' }]),
          sc('轉折頻率', 'THE CORNER',
            calc(110, 112, 420, [['r<sub>d</sub> = 0.026/1m = 26 Ω', 'r1'], ['兩支一樣大：1/r<sub>d</sub> = 2πfC<sub>d</sub>', 'r2'], ['f<sub>c</sub> = 1/(2π·26·192p) ≈ 31.9 MHz', 'r3', 'ta'], ['10 f<sub>c</sub>：|Z| = 26/√101 ≈ 2.59 Ω', 'r4', 'ta']], { k: 'cc', fs: 15 }),
            [{ sub: 'r<sub>d</sub> = <b>26 Ω</b>。', on: 'cc r1' },
             { sub: '電阻那支和電容那支一樣「好走」的頻率，就是轉折點。', on: 'r2' },
             { sub: 'f<sub>c</sub> ≈ <b>31.9 MHz</b>，這時 |Z| = 26/√2 = 18.4 Ω。', on: 'r3' },
             { sub: '頻率再高 10 倍，|Z| 剩 <b>2.59 Ω</b>。', on: 'r4' }]),
          sc('畫成圖', 'THE PLOT',
            P.svg + P.curve(lf => Math.log10(26 / Math.sqrt(1 + Math.pow(Math.pow(10, lf) / fc, 2))), 5, 10, 'cv') +
            P.dot(Math.log10(fc), Math.log10(18.4), 'q', 6) + T(P.X(Math.log10(fc)) + 10, P.Y(Math.log10(18.4)) - 10, 'f<sub>c</sub>', { cls: 'ta', fs: 14, a: 'start', k: 'ql' }) +
            calc(430, 140, 180, [['低頻：26 Ω', 'r1'], ['高頻：往下掉', 'r2', 'ta']], { k: 'cc' }),
            [{ sub: '低頻平平的 = r<sub>d</sub>。', on: 'cv cc r1' },
             { sub: '過了 f<sub>c</sub> 一路往下：電容把它短路了。', on: 'q ql r2' }]),
          ansScene(['r<sub>d</sub> = 26 Ω', 'f<sub>c</sub> ≈ 31.9 MHz', '10f<sub>c</sub>：|Z| ≈ 2.59 Ω'], ['答案：轉折約 31.9 MHz。'])
        ];
      } },

    /* ═══════════ 07 開關暫態（自編） ═══════════ */
    { id: 'p6-ts', sec: 'sw', kind: 'pp', no: '', tag: '自編練習', title: '關掉一顆二極體要多久',
      q: '二極體串 R = 1 kΩ，電源從 +5.7 V 突然切到 −5 V。V<sub>γ</sub> = 0.7 V、少數載子壽命 τ = 20 ns。(a) 求順向電流 I<sub>F</sub>；(b) 剛切換時的反向電流 I<sub>R</sub>；(c) 用 t<sub>s</sub> ≈ τ ln(1 + I<sub>F</sub>/I<sub>R</sub>) 估儲存時間；(d) 換成蕭特基二極體，t<sub>s</sub> 大約多少？',
      en: 'A diode in series with R = 1 kΩ is switched from +5.7 V to −5 V. With V<sub>γ</sub> = 0.7 V and τ = 20 ns: (a) find I<sub>F</sub>; (b) find the reverse current I<sub>R</sub> just after switching; (c) estimate t<sub>s</sub> ≈ τ ln(1 + I<sub>F</sub>/I<sub>R</sub>); (d) estimate t<sub>s</sub> for a Schottky diode.',
      fig: FSW, cap: '電源在 t = 0 從 +5.7 V 跳到 −5 V',
      hint: '剛切換時二極體還是「近短路」（v<sub>D</sub> ≈ 0），−5 V 全部落在 R 上。',
      steps: [
        st('(a) 順偏。', 'I<sub>F</sub> = (5.7 − 0.7)/1k = 5 mA'),
        st('(b) 剛切換：儲存電荷還在，v<sub>D</sub> ≈ 0。', 'I<sub>R</sub> ≈ 5 V/1 kΩ = 5 mA（反方向）', '講義 1-24：接面還沒恢復成逆偏狀態，像短路一樣導電。'),
        st('(c) 儲存時間。', 't<sub>s</sub> ≈ 20 ns × ln(1 + 5/5) = 20 × 0.693 ≈ 13.9 ns', '近似式是課本延伸；重點是庫存越多（I<sub>F</sub> 大）越久、掃得越用力（I<sub>R</sub> 大）越快。'),
        st('(d) 蕭特基。', 't<sub>s</sub> ≈ 0', '多數載子導電，沒有少數載子庫存（講義 1-29）。')
      ],
      ans: '(a) 5 mA (b) 5 mA（反向）(c) t<sub>s</sub> ≈ 13.9 ns (d) 蕭特基 t<sub>s</sub> ≈ 0',
      note: '自編練習。t<sub>s</sub> 近似式出自電荷控制模型（課本延伸），講義只講觀念。',
      story: () => {
        const { g, T, calc, sc, ansScene, D } = KK();
        const X = t => 120 + t * 4.5, ts = 13.9;
        const iY = i => 200 - i * 12;
        let d = 'M' + X(-15) + ' ' + iY(5) + ' H' + X(0) + ' V' + iY(-5) + ' H' + X(ts);
        for (let n = 0; n <= 30; n++) { const t = ts + n * 1.5; d += ' L' + X(t).toFixed(1) + ' ' + iY(-5 * Math.exp(-(t - ts) / 4)).toFixed(1); }
        return [
          sc('水龍頭關了，水還在流', 'THE TAP IS OFF…',
            g('tap', '<rect class="card" x="90" y="130" width="200" height="40" rx="6" filter="url(#st-sh)"/><path class="lna" style="fill:none;stroke-width:6" d="M290 150 H330 V200"/>' + T(190, 156, '水管（存著水）', { cls: 't', fs: 13 })) +
            g('drip', '<path class="lna" style="fill:none;stroke-width:3" d="M330 206 V240 M324 252 V268 M336 260 V278"/>' + T(350, 250, '關了還滴一陣子', { cls: 'ta', fs: 13, a: 'start' })) +
            D.chip(320, 300, '二極體：順偏時存了一堆少數載子', '一切到逆偏，它們還在', 'c1', { fs: 13 }),
            [{ sub: '水管裡存著水，水龍頭一關，水還是會流一下。', on: 'tap' },
             { sub: '二極體順偏時也「存」了少數載子。', on: 'drip' },
             { sub: '一切到逆偏，它們還在 → 電流<b>反過來</b>流，把它們掃出去。', on: 'c1' }]),
          sc('算電流與時間', 'THE NUMBERS',
            '<line class="ln2" x1="100" y1="200" x2="420" y2="200"/>' + '<path class="lna" style="fill:none;stroke-width:2.6" d="' + d + '"' + KK().k('w') + '/>' +
            T(X(-8), iY(5) - 10, '+5 mA', { cls: 'ta', fs: 12, k: 'l1' }) + T(X(ts / 2), iY(-5) + 20, '−5 mA', { cls: 'ta', fs: 12, k: 'l2' }) +
            g('tsb', '<line class="ln dsh" x1="' + X(0) + '" y1="120" x2="' + X(0) + '" y2="280"/><line class="ln dsh" x1="' + X(ts) + '" y1="120" x2="' + X(ts) + '" y2="280"/>' + T((X(0) + X(ts)) / 2, 292, 't<sub>s</sub>', { cls: 'ta', fs: 14 })) +
            calc(430, 120, 190, [['I<sub>F</sub> = 5/1k = 5 mA', 'r1'], ['I<sub>R</sub> ≈ 5/1k = 5 mA', 'r2'], ['t<sub>s</sub> ≈ 20 ln 2', 'r3', 'ta'], ['≈ 13.9 ns', 'r4', 'ta']], { k: 'cc', fs: 14 }),
            [{ sub: '順偏：(5.7 − 0.7) ÷ 1 kΩ = <b>5 mA</b>。', on: 'cc r1 l1' },
             { sub: '剛切換，二極體還像短路：−5 V 全在 R 上 → 反向 <b>5 mA</b>。', on: 'r2 w l2' },
             { sub: '反向電流維持一段 <b>t<sub>s</sub> ≈ 13.9 ns</b>，掃完才掉下來。', on: 'r3 r4 tsb' }]),
          ansScene(['t<sub>s</sub> ≈ 13.9 ns', 'I<sub>F</sub> = I<sub>R</sub> = 5 mA', '蕭特基：t<sub>s</sub> ≈ 0'], ['答案：約 13.9 ns。', '蕭特基沒有庫存，幾乎是 0。'])
        ];
      } },

    /* ═══════════ 08 光通訊（自編） ═══════════ */
    { id: 'p6-opto', sec: 'opto', kind: 'pp', no: '', tag: '自編練習', title: '光纖通訊的兩端',
      q: 'Fig 1.40 的光通訊系統：發射端用 LED 把電訊號變成光，經光纖傳到接收端的光二極體。(a) LED 和光二極體各要順偏還是逆偏？(b) 光二極體每收到 1 mW 光產生 0.5 mA 光電流，現在收到 0.2 mW，光電流多少？(c) 光電流流過 10 kΩ 電阻，電壓多大？',
      en: 'In the optical system of Fig 1.40, an LED converts the electrical signal to light, which travels through an optical fiber to a photodiode. (a) How is each device biased? (b) The photodiode produces 0.5 mA per 1 mW of light; find the photocurrent for 0.2 mW. (c) What voltage does it develop across 10 kΩ?',
      hint: 'LED 要「注入」載子去復合；光二極體要強電場把光生載子掃出來。光電流 ∝ 光強。',
      steps: [
        st('(a) 偏壓。', 'LED：順偏　｜　光二極體：逆偏', 'LED 靠注入的少數載子復合發光；光二極體靠逆偏的強電場收集光生電子電洞（講義 1-20、1-21）。'),
        st('(b) 光電流 ∝ 光強。', 'I<sub>ph</sub> = 0.5 mA/mW × 0.2 mW = 0.1 mA'),
        st('(c) 變成電壓。', 'V = 0.1 mA × 10 kΩ = 1 V', '這就是接收端把光訊號變回電訊號。')
      ],
      ans: '(a) LED 順偏、光二極體逆偏 (b) 0.1 mA (c) 1 V',
      note: '自編練習，0.5 mA/mW 是假設的靈敏度。',
      story: () => {
        const { g, T, calc, sc, ansScene, D } = KK();
        const wave = (x, y) => { let d = 'M' + x + ' ' + y; for (let i = 0; i < 8; i++) d += ' q 6 -6 12 0 q 6 6 12 0'; return '<path class="lna" style="fill:none;stroke-width:2" d="' + d + '"/>'; };
        return [
          sc('電 → 光 → 電', 'ELECTRIC → LIGHT → ELECTRIC',
            g('tx', '<rect class="card" x="60" y="140" width="130" height="70" rx="10" filter="url(#st-sh)"/>' + T(125, 170, 'LED', { cls: 'ta', fs: 16 }) + T(125, 194, '順偏：電 → 光', { cls: 'tm', fs: 12 })) +
            g('fib', '<rect class="accw" x="190" y="168" width="260" height="14" rx="7"/>' + wave(210, 160) + T(320, 214, '光纖', { cls: 'ts', fs: 12 })) +
            g('rx', '<rect class="card" x="450" y="140" width="140" height="70" rx="10" filter="url(#st-sh)"/>' + T(520, 170, '光二極體', { cls: 'ta', fs: 15 }) + T(520, 194, '逆偏：光 → 電', { cls: 'tm', fs: 12 })),
            [{ sub: '發射端：<b>LED 順偏</b>，注入的載子復合放出光。', on: 'tx' },
             { sub: '光沿著光纖跑過去。', on: 'fib' },
             { sub: '接收端：<b>光二極體逆偏</b>，強電場把光生的電子電洞掃出來變成電流。', on: 'rx' }]),
          sc('算光電流', 'PHOTOCURRENT',
            calc(130, 120, 380, [['I<sub>ph</sub> ∝ 光強', 'r1', 'tm'], ['0.5 mA/mW × 0.2 mW = 0.1 mA', 'r2', 'ta'], ['0.1 mA × 10 kΩ = 1 V', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '光電流跟光強成正比。', on: 'cc r1' },
             { sub: '收到 0.2 mW → <b>0.1 mA</b>。', on: 'r2' },
             { sub: '流過 10 kΩ → <b>1 V</b> 的電壓訊號。', on: 'r3' }]),
          ansScene(['LED 順偏、光二極體逆偏', 'I<sub>ph</sub> = 0.1 mA', 'V = 1 V'], ['答案：LED 順偏、光二極體逆偏。'])
        ];
      } },

    /* ═══════════ 09 Example 1.12 ═══════════ */
    { id: 'p6-112', sec: 'sbd', kind: 'ex', no: '1.12', tag: 'Example 1.12', title: '同樣 1 mA，壓降差多少',
      q: 'pn 接面二極體與蕭特基二極體的 I<sub>S</sub> 分別為 10<sup>−12</sup> A 及 10<sup>−8</sup> A。求兩者各要產生 1 mA 所需的順向偏壓。',
      en: 'The reverse-saturation currents of a pn junction diode and a Schottky diode are 10<sup>−12</sup> A and 10<sup>−8</sup> A, respectively. Determine the forward-bias voltages required to produce 1 mA in each diode.',
      idea: '把二極體方程式反過來：v<sub>D</sub> = V<sub>T</sub> ln(i<sub>D</sub>/I<sub>S</sub>)。',
      steps: [
        st('反解電壓。', 'i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1) ⟹ v<sub>D</sub> = V<sub>T</sub> ln(i<sub>D</sub>/I<sub>S</sub> + 1)'),
        st('pn 接面。', 'V<sub>a</sub> = 0.026 × ln(10<sup>−3</sup>/10<sup>−12</sup>) = 0.026 × ln(10<sup>9</sup>) = 0.539 V'),
        st('蕭特基。', 'V<sub>a</sub> = 0.026 × ln(10<sup>−3</sup>/10<sup>−8</sup>) = 0.026 × ln(10<sup>5</sup>) = 0.299 V'),
        st('差多少。', 'ΔV = 0.539 − 0.299 = 0.240 V = V<sub>T</sub> ln(10<sup>4</sup>)', 'I<sub>S</sub> 差 10<sup>4</sup> 倍 → 每 10 倍 60 mV → 4 × 60 = 240 mV。')
      ],
      ans: 'pn：0.539 V；蕭特基：0.299 V（差約 0.24 V）',
      story: () => {
        const { g, T, calc, sc, axes, ansScene, D } = KK();
        const P = axes(80, 110, 290, 170, { v0: 0, v1: 0.65, i0: 0, i1: 2, vt: [[0.299, '0.299'], [0.539, '0.539']], it: [[1, '1 mA']] });
        return [
          sc('兩條曲線', 'TWO CURVES',
            P.svg + P.curve(v => 1e-8 * (Math.exp(v / VT) - 1) * 1e3, 0, 0.32, 'sb') + P.curve(v => 1e-12 * (Math.exp(v / VT) - 1) * 1e3, 0, 0.56, 'pn', 'ln') +
            P.seg(0, 1, 0.65, 1, 'h', 'ln2 dsh') + P.dot(0.299, 1, 'd1') + P.dot(0.539, 1, 'd2', 6, 'ln') +
            T(P.X(0.299) - 8, P.Y(1.7), '蕭特基', { cls: 'ta', fs: 14, a: 'end', k: 'l1' }) + T(P.X(0.539) + 10, P.Y(1.7), 'pn', { cls: 't', fs: 14, a: 'start', k: 'l2' }) +
            calc(400, 130, 210, [['I<sub>S</sub>：pn 10<sup>−12</sup> A', 'r1'], ['I<sub>S</sub>：蕭特基 10<sup>−8</sup> A', 'r2', 'ta'], ['差 10<sup>4</sup> 倍', 'r3', 'tm']], { k: 'cc' }),
            [{ sub: '黑線是 pn，I<sub>S</sub> = 10<sup>−12</sup> A。', on: 'pn l2 cc r1' },
             { sub: '藍線是蕭特基，I<sub>S</sub> = 10<sup>−8</sup> A，大了 10<sup>4</sup> 倍 → 曲線整條往左。', on: 'sb l1 r2 r3' },
             { sub: '在 1 mA 那條橫線上，各自的電壓差多少？', on: 'h d1 d2' }]),
          sc('代公式', 'PLUG IN',
            calc(110, 112, 420, [['V = V<sub>T</sub> ln(I/I<sub>S</sub>)', 'r1', 'tm'], ['pn：0.026 ln(10<sup>9</sup>) = 0.539 V', 'r2'], ['蕭特基：0.026 ln(10<sup>5</sup>) = 0.299 V', 'r3', 'ta'], ['差 0.24 V = 4 × 60 mV', 'r4', 'ta']], { k: 'cc', fs: 15 }),
            [{ sub: '二極體方程式反過來解電壓。', on: 'cc r1' },
             { sub: 'pn：<b>0.539 V</b>。', on: 'r2' },
             { sub: '蕭特基：<b>0.299 V</b>。', on: 'r3' },
             { sub: 'I<sub>S</sub> 每大 10 倍，電壓少 60 mV：差 4 個 10 倍 → <b>0.24 V</b>。', on: 'r4' }]),
          ansScene(['pn：0.539 V', '蕭特基：0.299 V', '差約 0.24 V'], ['答案：0.539 V 和 0.299 V。'])
        ];
      } },

    /* ═══════════ 10 Design Example 1.13 ═══════════ */
    { id: 'p6-113', sec: 'zd', kind: 'ex', no: '1.13', tag: 'Design Example 1.13', title: '齊納電路的限流電阻',
      q: '考慮下圖的簡單定電壓參考電路。齊納二極體崩潰電壓 V<sub>Z</sub> = 5.6 V、齊納電阻 r<sub>z</sub> = 0，V<sub>PS</sub> = 10 V。要把二極體電流限制在 3 mA，R 要多大？齊納二極體消耗多少功率？',
      en: 'Consider the circuit shown. Assume that the Zener diode breakdown voltage is V<sub>Z</sub> = 5.6 V and the Zener resistance is r<sub>z</sub> = 0. The current in the diode is to be limited to 3 mA. Design R and find the power dissipated in the Zener diode.',
      fig: FZ, cap: 'Figure 1.45：齊納二極體操作在崩潰區',
      idea: 'r<sub>z</sub> = 0 的齊納 = 一顆 5.6 V 的電池（陰極接高電位）。',
      steps: [
        st('電流由電阻上的電壓決定。', 'I = (V<sub>PS</sub> − V<sub>Z</sub>)/R', '齊納兩端被釘在 5.6 V，多出來的落在 R 上。'),
        st('解 R。', 'R = (10 − 5.6)/3 = 1.47 kΩ'),
        st('齊納的功率。', 'P<sub>Z</sub> = I<sub>Z</sub>V<sub>Z</sub> = (3)(5.6) = 16.8 mW', '齊納要撐得住 16.8 mW 才不會壞。'),
        st('Comment。', 'V<sub>PS</sub> 在一定範圍內變動，輸出仍維持 5.6 V', '外接電阻限流、齊納穩壓 → 定電壓輸出（下一章會再用）。')
      ],
      ans: 'R = 1.47 kΩ、P<sub>Z</sub> = 16.8 mW',
      story: () => {
        const { g, T, calc, sc, ansScene, D } = KK();
        const C = window.__K16;
        return [
          sc('題目：反著接、住在崩潰區', 'ZENER IN BREAKDOWN',
            C.zCirc(130, 140, 180, 130, { k: 'cir', vps: '10 V', r: 'R = ?', vz: '5.6 V' }) +
            D.chip(480, 160, '陰極接高電位', '逆偏、故意崩潰', 'c1', { fs: 13 }) + D.chip(480, 235, '電流要限制在 3 mA', 'R 負責限流', 'c2', { fs: 13, acc: true }),
            [{ sub: '10 V 電源、一顆電阻、一顆齊納二極體。', on: 'cir' },
             { sub: '齊納<b>反著接</b>：陰極在上。它住在崩潰區，兩端被釘在 5.6 V。', on: 'c1' },
             { sub: '要把電流限制在 3 mA，R 要多大？', on: 'c2' }]),
          sc('齊納 = 5.6 V 電池', 'ZENER = 5.6 V BATTERY',
            C.zCirc(130, 140, 180, 130, { k: 'cir', vps: '10 V', r: 'R', vz: '5.6 V', model: true }) +
            calc(400, 120, 210, [['R 上：10 − 5.6 = 4.4 V', 'r1'], ['R = 4.4 / 3 mA', 'r2'], ['= 1.47 kΩ', 'r3', 'ta'], ['P<sub>Z</sub> = 3m × 5.6 = 16.8 mW', 'r4', 'ta']], { k: 'cc', fs: 14 }),
            [{ sub: 'r<sub>z</sub> = 0：崩潰區是一面垂直的牆 → 齊納換成 <b>5.6 V 電池</b>。', on: 'cir' },
             { sub: '剩下的 4.4 V 都在 R 上。', on: 'cc r1' },
             { sub: 'R = 4.4 V ÷ 3 mA = <b>1.47 kΩ</b>。', on: 'r2 r3' },
             { sub: '齊納吃掉 3 mA × 5.6 V = <b>16.8 mW</b>，要撐得住。', on: 'r4' }]),
          ansScene(['R = 1.47 kΩ', 'P<sub>Z</sub> = 16.8 mW', '輸出穩在 5.6 V'], ['答案：R = 1.47 kΩ、P<sub>Z</sub> = 16.8 mW。'])
        ];
      } }
  ];

  window.__CH16EX = window.__CH16EX || { book: 'Neamen', items: [] };
  window.__CH16EX.items = window.__CH16EX.items.concat(items);
})();
