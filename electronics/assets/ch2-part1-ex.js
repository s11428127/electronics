/* ============================================================
   電子學 CH2 PART 1 —— 例題與練習（講義 2-6、2-7 的分析 ＋ 自編練習）
   出處：Neamen, Microelectronics, 4th ed., §2.1.1；課程原講義 CH2 PART 1（V1）投影片 2-1～2-7
   - 講義這一段沒有編號的 Example；練習題標「講義 2-x」或「自編練習」，數值都用程式驗算過
   - 每一題都有 story（「🎬 圖解詳解」），畫圖工具 __K15、__K16，本檔另外匯出 __K21（變壓器）
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const KK = () => window.__K15;

  /* 故事用：變壓器（兩個線圈 + 鐵心），中心 (x, y)，高 h */
  const K21 = (function () {
    if (!window.__K15) return null;
    const K = window.__K15, T = K.T;
    function xfm(x, y, h, opt) {
      opt = opt || {};
      const n1 = opt.n1 || 5, n2 = opt.n2 || 3, top = y - h / 2;
      const coil = (cx, n, dir) => { let d = 'M' + cx + ' ' + top; const s = h / n; for (let k = 0; k < n; k++) d += ' a' + (s / 2) + ' ' + (s / 2) + ' 0 0 ' + (dir > 0 ? 1 : 0) + ' 0 ' + s; return '<path class="ln" style="fill:none;stroke-width:2" d="' + d + '"/>'; };
      return K.g(opt.k, coil(x - 16, n1, -1) + coil(x + 16, n2, 1) +
        '<line class="ln" x1="' + (x - 3) + '" y1="' + top + '" x2="' + (x - 3) + '" y2="' + (top + h) + '" style="stroke-width:2.4"/><line class="ln" x1="' + (x + 3) + '" y1="' + top + '" x2="' + (x + 3) + '" y2="' + (top + h) + '" style="stroke-width:2.4"/>' +
        (opt.l1 !== false ? T(x - 22, top - 8, opt.l1 || 'N<sub>1</sub>', { cls: 't', fs: 13, a: 'end' }) : '') + (opt.l2 !== false ? T(x + 22, top - 8, opt.l2 || 'N<sub>2</sub>', { cls: 'ta', fs: 13, a: 'start' }) : ''));
    }
    /* Fig 2.2：變壓器 → 二極體 → R（v_O） */
    function fig22(x0, y0, w, h, opt) {
      opt = opt || {};
      const Q = window.__K16, xm = x0 + 40, xd = x0 + w * 0.55, xr = x0 + w, yb = y0 + h;
      let s = xfm(xm, y0 + h / 2, h, { n1: 6, n2: 4, l1: opt.l1, l2: opt.l2 }) +
        '<path class="ln" style="fill:none" d="M' + (xm + 16) + ' ' + y0 + ' H' + (xd - 10) + ' M' + (xd + 10) + ' ' + y0 + ' H' + xr + ' V' + (y0 + h * 0.15) + ' M' + xr + ' ' + (y0 + h * 0.85) + ' V' + yb + ' H' + (xm + 16) + '"/>' +
        K.res(xr, y0 + h * 0.15, h * 0.7, true) + T(xr + 14, y0 + h / 2 + 5, 'R', { cls: 't', fs: 14, a: 'start' }) + T(xr + 14, y0 + h / 2 + 24, 'v<sub>O</sub>', { cls: 'ta', fs: 13, a: 'start' });
      s += opt.model === 'on' ? Q.batH(xd, y0) + T(xd, y0 - 20, 'V<sub>γ</sub>', { cls: 'ta', fs: 13 })
        : opt.model === 'off' ? '<line class="ln" x1="' + (xd - 10) + '" y1="' + y0 + '" x2="' + (xd - 6) + '" y2="' + y0 + '"/><circle class="bgw" cx="' + (xd - 6) + '" cy="' + y0 + '" r="3"/><circle class="bgw" cx="' + (xd + 6) + '" cy="' + y0 + '" r="3"/>' + T(xd, y0 - 16, '斷路', { cls: 'ta', fs: 13 })
        : Q.diodeH(xd, y0) + T(xd, y0 - 20, '+ v<sub>D</sub> −', { cls: 'tm', fs: 12 });
      s += T(xm + 30, y0 + h / 2 + 5, 'v<sub>S</sub>', { cls: 't', fs: 13, a: 'start' });
      return K.g(opt.k, s);
    }
    return { xfm, fig22 };
  })();
  window.__K21 = K21;

  const F22 = S.svg(420, 170, ['<g transform="translate(40,10)">',
    S.l(60, 20, 60, 140, ''), S.l(110, 140, 110, 20, ''),
    '<line x1="82" y1="20" x2="82" y2="140"/><line x1="88" y1="20" x2="88" y2="140"/>',
    S.w('60,20', '20,20'), S.w('60,140', '20,140'), S.term(20, 20), S.term(20, 140), S.t(14, 84, 'v_I', 'end'),
    S.t(60, 12, 'N_1', 'middle'), S.t(110, 12, 'N_2', 'middle'), S.t(124, 84, 'v_S', 'start'),
    S.w('110,20', '170,20'), S.d(170, 20, 250, 20, ''), S.t(210, 10, '+ v_D −', 'middle', ' font-size="11"'), S.w('250,20', '300,20'),
    S.r(300, 20, 300, 140, 'R'), S.w('300,140', '110,140'),
    S.term(350, 20), S.term(350, 140), S.w('300,20', '350,20'), S.w('300,140', '350,140'), S.t(358, 84, 'v_O', 'start'), '</g>']);

  const items = [
    /* ═══════════ 方塊圖（自編） ═══════════ */
    { id: 'c21-psu', sec: 'psu', kind: 'pp', no: '', tag: '自編練習', title: '從插座到 5 V：每一級多少伏',
      q: '一個電源供應器：市電 110 V（rms）→ 匝數比 N<sub>1</sub>:N<sub>2</sub> = 10:1 的變壓器 → 半波整流（V<sub>γ</sub> = 0.7 V）→ 濾波 → 7805（輸出 5 V，輸入至少要約 7 V）。(a) 市電峰值；(b) 二次側峰值；(c) 整流輸出峰值；(d) 峰值夠 7805 用嗎？',
      en: 'A supply: 110 V (rms) line → 10:1 transformer → half-wave rectifier (V<sub>γ</sub> = 0.7 V) → filter → 7805 (5 V output, needs about 7 V input). Find (a) the line peak, (b) the secondary peak, (c) the rectified peak, and (d) whether the peak is enough for the 7805.',
      hint: '先把 rms 換成峰值（× √2），再除以匝數比，再扣 0.7 V。',
      steps: [
        st('(a) 市電峰值。', '110 × √2 = 155.6 V', '110 V 是有效值。'),
        st('(b) 變壓器降壓。', 'V<sub>S</sub> = 155.6 / 10 = 15.56 V', 'v<sub>S</sub>/v<sub>I</sub> = N<sub>2</sub>/N<sub>1</sub>（講義 2-5）。'),
        st('(c) 半波整流。', 'V<sub>O,peak</sub> = 15.56 − 0.7 = 14.86 V', 'ON 時二極體吃掉 V<sub>γ</sub>。'),
        st('(d) 比 7 V。', '14.86 V &gt; 7 V ✓', '峰值夠。輸出是脈動的，谷底會掉到 0，所以中間一定要有濾波電容撐住（下一份講義）。')
      ],
      ans: '(a) 155.6 V (b) 15.56 V (c) 14.86 V (d) 峰值夠（但要靠濾波撐住谷底）',
      note: '自編練習；7805 的「至少約 7 V」是常見的壓差規格（約 2 V），講義只說它把輸入穩成 5 V。',
      story: () => {
        const { g, T, calc, sc, sine, ansScene, D } = KK();
        const box = (x, key, a, b) => g(key, '<rect class="card" x="' + x + '" y="130" width="100" height="70" rx="10" filter="url(#st-sh)"/>' + T(x + 50, 160, a, { fs: 14, cls: 'ta' }) + T(x + 50, 184, b, { cls: 'tm', fs: 12 }));
        return [
          sc('一路走下去', 'STAGE BY STAGE',
            box(20, 'b1', '市電', '155.6 V 峰值') + box(145, 'b2', '變壓器 10:1', '15.56 V') + box(270, 'b3', '半波整流', '14.86 V 峰值') + box(395, 'b4', '濾波', '撐住谷底') + box(520, 'b5', '7805', '5 V') +
            g('ar', [120, 245, 370, 495].map(x => D.arrow(x + 2, 165, x + 22, 165, null, 'ln')).join('')) +
            calc(130, 226, 380, [['110 × √2 = 155.6 → ÷ 10 = 15.56 → − 0.7 = 14.86 V', 'r1', 'ta']], { k: 'cc', lh: 28, fs: 14 }),
            [{ sub: '市電 110 V 是 rms，峰值 = 110 × √2 = <b>155.6 V</b>。', on: 'b1' },
             { sub: '變壓器 10:1：峰值變成 <b>15.56 V</b>。', on: 'ar b2' },
             { sub: '半波整流再扣 0.7 V：<b>14.86 V</b>。', on: 'b3 cc r1' },
             { sub: '比 7805 需要的 7 V 大，峰值夠。谷底靠濾波撐住，最後 7805 穩成 5 V。', on: 'b4 b5' }]),
          ansScene(['整流峰值 14.86 V ≥ 7 V', '市電 155.6 V、二次側 15.56 V'], ['答案：14.86 V，夠 7805 用（谷底要靠濾波）。'])
        ];
      } },

    /* ═══════════ 變壓器（自編） ═══════════ */
    { id: 'c21-xf', sec: 'xfmr', kind: 'pp', no: '', tag: '自編練習', title: '12 V 的變壓器',
      q: '想用 110 V（rms）市電得到 12 V（rms）的二次側電壓。(a) 匝數比 N<sub>1</sub>:N<sub>2</sub>？(b) 二次側峰值多少？(c) 接半波整流（V<sub>γ</sub> = 0.7 V），輸出峰值多少？',
      en: 'A transformer converts the 110 V (rms) line to 12 V (rms). Find (a) N<sub>1</sub>:N<sub>2</sub>, (b) the secondary peak voltage, and (c) the peak output of a half-wave rectifier with V<sub>γ</sub> = 0.7 V.',
      fig: F22, cap: 'Fig 2.2(a)：變壓器加二極體',
      hint: 'rms 比 rms 就好：N<sub>1</sub>/N<sub>2</sub> = 110/12。峰值再乘 √2。',
      steps: [
        st('(a) 匝數比。', 'N<sub>1</sub>/N<sub>2</sub> = v<sub>I</sub>/v<sub>S</sub> = 110/12 ≈ 9.17', '電壓比 = 匝數比，同樣用 rms 比。'),
        st('(b) 峰值。', 'V<sub>S,peak</sub> = 12√2 ≈ 16.97 V'),
        st('(c) 整流輸出峰值。', '16.97 − 0.7 ≈ 16.27 V', '常見陷阱：拿 12 V 直接減 0.7 —— 12 V 是 rms，峰值要乘 √2。')
      ],
      ans: '(a) ≈ 9.17 : 1 (b) 16.97 V (c) 16.27 V',
      note: '自編練習。',
      story: () => {
        const { g, T, calc, sc, ansScene, D } = KK();
        return [
          sc('變壓器：圈數決定電壓', 'TURNS SET THE VOLTAGE',
            window.__K21.xfm(170, 200, 120, { k: 'tf', n1: 9, n2: 3, l1: 'N<sub>1</sub>（110 V）', l2: 'N<sub>2</sub>（12 V）' }) +
            calc(330, 130, 280, [['v<sub>S</sub>/v<sub>I</sub> = N<sub>2</sub>/N<sub>1</sub>', 'r1'], ['N<sub>1</sub>/N<sub>2</sub> = 110/12 ≈ 9.17', 'r2', 'ta'], ['峰值：12√2 = 16.97 V', 'r3', 'ta'], ['整流後：16.97 − 0.7 = 16.27 V', 'r4', 'ta']], { k: 'cc', fs: 14 }),
            [{ sub: '變壓器兩邊的電壓，跟圈數成正比（講義 2-5）。', on: 'tf cc r1' },
             { sub: '110 V 要變 12 V：一次側圈數是二次側的 <b>9.17 倍</b>。', on: 'r2' },
             { sub: '12 V 是 rms，峰值要乘 √2：<b>16.97 V</b>。', on: 'r3' },
             { sub: '半波整流後的峰值：<b>16.27 V</b>。', on: 'r4' }]),
          ansScene(['N<sub>1</sub>:N<sub>2</sub> ≈ 9.17 : 1', '峰值 16.97 V → 整流 16.27 V'], ['答案：約 9.17:1。'])
        ];
      } },

    /* ═══════════ 三種情況（講義 2-6） ═══════════ */
    { id: 'c21-hw', sec: 'hwr', kind: 'pp', no: '', tag: '講義 2-6', title: '三種情況各算一次',
      q: 'Fig 2.2 的半波整流（二極體模型 r<sub>f</sub> = 0、V<sub>γ</sub> = 0.7 V），R = 1 kΩ。分別在 v<sub>S</sub> = −3 V、0.4 V、5 V 時，求 i<sub>D</sub>、v<sub>O</sub>、v<sub>D</sub>。',
      en: 'For the half-wave rectifier of Fig 2.2 (r<sub>f</sub> = 0, V<sub>γ</sub> = 0.7 V, R = 1 kΩ), find i<sub>D</sub>, v<sub>O</sub> and v<sub>D</sub> when v<sub>S</sub> = −3 V, 0.4 V and 5 V.',
      fig: F22, cap: 'Fig 2.2(a)',
      hint: '先跟 0、V<sub>γ</sub> 比，決定 ON/OFF；OFF 時電流 0，v<sub>D</sub> = v<sub>S</sub>。',
      steps: [
        st('v<sub>S</sub> = −3 V：情況 1（v<sub>S</sub> &lt; 0）。', 'OFF：i<sub>D</sub> = 0、v<sub>O</sub> = 0、v<sub>D</sub> = −3 V', '逆偏。整個 v<sub>S</sub> 落在二極體上。'),
        st('v<sub>S</sub> = 0.4 V：情況 2（0 &lt; v<sub>S</sub> &lt; V<sub>γ</sub>）。', 'OFF：i<sub>D</sub> = 0、v<sub>O</sub> = 0、v<sub>D</sub> = 0.4 V', '正的，但推不開門。'),
        st('v<sub>S</sub> = 5 V：情況 3（v<sub>S</sub> &gt; V<sub>γ</sub>）。', 'ON：i<sub>D</sub> = (5 − 0.7)/1k = 4.3 mA、v<sub>O</sub> = 4.3 V、v<sub>D</sub> = 0.7 V', '二極體 = 0.7 V 電池。'),
        st('檢查。', '每一種都滿足 v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>', 'KVL：二極體和電阻分掉 v<sub>S</sub>（講義 2-7 Note）。')
      ],
      ans: '−3 V：0、0、−3 V｜0.4 V：0、0、0.4 V｜5 V：4.3 mA、4.3 V、0.7 V',
      story: () => {
        const { g, T, calc, sc, ansScene } = KK();
        const F = m => window.__K21.fig22(130, 150, 240, 120, { k: 'cir', model: m });
        return [
          sc('v<sub>S</sub> = −3 V：逆偏', 'CASE 1',
            F('off') + calc(420, 130, 190, [['① v<sub>S</sub> &lt; 0', 'r1', 'tm'], ['OFF → i<sub>D</sub> = 0', 'r2'], ['v<sub>O</sub> = 0', 'r3', 'ta'], ['v<sub>D</sub> = −3 V', 'r4', 'ta']], { k: 'cc', fs: 14 }),
            [{ sub: 'v<sub>S</sub> 是負的：二極體逆偏，<b>OFF</b>，換成斷路。', on: 'cir cc r1 r2' },
             { sub: '沒電流，電阻沒壓降：v<sub>O</sub> = 0；−3 V 全部落在二極體上。', on: 'r3 r4' }]),
          sc('v<sub>S</sub> = 0.4 V：推不開門', 'CASE 2',
            F('off') + calc(420, 130, 190, [['② 0 &lt; v<sub>S</sub> &lt; 0.7', 'r1', 'tm'], ['還是 OFF', 'r2'], ['v<sub>O</sub> = 0', 'r3', 'ta'], ['v<sub>D</sub> = 0.4 V', 'r4', 'ta']], { k: 'cc', fs: 14 }),
            [{ sub: '0.4 V 是正的，可是不到 0.7 V，門推不開，<b>還是 OFF</b>。', on: 'cir cc r1 r2' },
             { sub: 'v<sub>O</sub> = 0，v<sub>D</sub> = 0.4 V。', on: 'r3 r4' }]),
          sc('v<sub>S</sub> = 5 V：導通', 'CASE 3',
            F('on') + calc(420, 130, 190, [['③ v<sub>S</sub> &gt; 0.7', 'r1', 'tm'], ['i<sub>D</sub> = 4.3/1k = 4.3 mA', 'r2'], ['v<sub>O</sub> = 4.3 V', 'r3', 'ta'], ['v<sub>D</sub> = 0.7 V', 'r4', 'ta']], { k: 'cc', fs: 14 }),
            [{ sub: '5 V 超過 0.7 V：<b>ON</b>，二極體換成 0.7 V 電池。', on: 'cir cc r1' },
             { sub: '電阻拿到 5 − 0.7 = 4.3 V，電流 4.3 mA。', on: 'r2 r3 r4' }]),
          ansScene(['5 V：4.3 mA、4.3 V、0.7 V', '0.4 V：0、0、0.4 V', '−3 V：0、0、−3 V'], ['答案：只有超過 0.7 V 才有輸出。'])
        ];
      } },

    /* ═══════════ 波形（講義 2-7） ═══════════ */
    { id: 'c21-wave', sec: 'wave', kind: 'pp', no: '', tag: '講義 2-7', title: '畫 v<sub>O</sub>、v<sub>D</sub> 波形',
      q: '半波整流，v<sub>S</sub> = 10 sin ωt V，V<sub>γ</sub> = 0.7 V（r<sub>f</sub> = 0）。(a) 畫出 v<sub>O</sub>、v<sub>D</sub> 波形；(b) v<sub>O</sub> 峰值；(c) 每週期導通的角度範圍；(d) 二極體承受的最大逆向電壓。',
      en: 'For a half-wave rectifier with v<sub>S</sub> = 10 sin ωt V and V<sub>γ</sub> = 0.7 V, (a) sketch v<sub>O</sub> and v<sub>D</sub>, (b) find the peak of v<sub>O</sub>, (c) find the conduction interval, and (d) find the peak inverse voltage across the diode.',
      fig: F22, cap: 'Fig 2.3：輸入弦波',
      hint: '方法一用公式（三種情況），方法二用 VTC 把 v<sub>S</sub> 投影到 v<sub>O</sub>。v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>。',
      steps: [
        st('(a) v<sub>O</sub>：只留超過 0.7 V 的部分，再往下移 0.7 V。', 'v<sub>O</sub> = v<sub>S</sub> − 0.7（v<sub>S</sub> &gt; 0.7）；其他時候 0', 'Fig 2.3(b)：一顆一顆的駝峰。'),
        st('(a) v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>。', 'ON：v<sub>D</sub> = 0.7 V（平的）；OFF：v<sub>D</sub> = v<sub>S</sub>（跟著輸入走，包含整個負半週）', 'Fig 2.3(c)。'),
        st('(b) 峰值。', 'v<sub>O,max</sub> = 10 − 0.7 = 9.3 V'),
        st('(c) 導通區間。', 'sin ωt = 0.07 ⟹ ωt = 4.01°～175.99°（約 47.8% 的時間）', '比半週期少一點點。'),
        st('(d) 最大逆向電壓。', 'v<sub>D,min</sub> = −10 V ⟹ PIV = 10 V', '負半週谷底，二極體 OFF，承受整個 −10 V。')
      ],
      ans: '(b) 9.3 V (c) 4.01°～175.99°（約 47.8%）(d) 10 V；v<sub>D</sub>：ON 時 0.7 V、OFF 時 = v<sub>S</sub>',
      story: () => {
        const { g, T, calc, sc, sine, ansScene, D } = KK();
        const vsD = (ym, A) => sine(80, ym, 480, A, { cls: 'ln dsh', k: null });
        let dD = '';
        for (let n = 0; n <= 120; n++) { const u = n / 120, v = 10 * Math.sin(u * 4 * Math.PI), vd = v > 0.7 ? 0.7 : v; dD += (n ? ' L' : 'M') + (80 + u * 480).toFixed(1) + ' ' + (200 - vd * 7).toFixed(1); }
        return [
          sc('v<sub>O</sub>：只剩駝峰', 'OUTPUT',
            g('in', vsD(200, 70)) + sine(80, 200, 480, 70, { cut: true, shift: 4.9, k: 'out' }) +
            T(84, 124, '虛線 v<sub>S</sub>：峰值 10 V', { cls: 'tm', fs: 12, a: 'start', k: 'l1' }) + T(200, 140, '9.3 V', { cls: 'ta', fs: 14, k: 'l2' }) +
            D.chip(440, 290, 'ON：v<sub>O</sub> = v<sub>S</sub> − 0.7', 'OFF：v<sub>O</sub> = 0', 'c1', { fs: 13 }),
            [{ sub: '輸入 v<sub>S</sub> = 10 sin ωt（虛線）。', on: 'in l1' },
             { sub: '超過 0.7 V 才 ON，輸出 = v<sub>S</sub> − 0.7：峰值 <b>9.3 V</b>；其他時候 0。', on: 'out l2 c1' }]),
          sc('v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>', 'DIODE VOLTAGE',
            g('in', vsD(200, 70)) + '<path class="lna" style="fill:none;stroke-width:2.6" d="' + dD + '"' + KK().k('vd') + '/>' +
            T(140, 186, '0.7 V', { cls: 'ta', fs: 13, k: 'l1' }) + T(257, 282, '−10 V = PIV', { cls: 'ta', fs: 13, k: 'l2' }),
            [{ sub: '二極體電壓 = 輸入 − 輸出。ON 時卡在 <b>0.7 V</b>（平的那段）。', on: 'in vd l1' },
             { sub: 'OFF 時沒電流，v<sub>D</sub> = v<sub>S</sub>：整個負半週都在二極體上，谷底 <b>−10 V</b>。', on: 'l2' }]),
          ansScene(['v<sub>O</sub> 峰值 9.3 V', '導通 4.01°～175.99°', 'PIV = 10 V'], ['答案：峰值 9.3 V、PIV 10 V。'])
        ];
      } }
  ];

  window.__CH21EX = window.__CH21EX || { book: 'Neamen', items: [] };
  window.__CH21EX.items = window.__CH21EX.items.concat(items);
})();
