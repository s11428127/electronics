/* ============================================================
   電路學 CH12 課本例題與練習題（下半：12.7～12.10，Example 12.6–12.15、Practice 12.6–12.15）
   跟 ch12-ex.js 同一個題庫 window.__CH12EX；每一題都有 story（🎬 圖解故事）
   數值都用程式驗算過；課本筆誤寫在 note。
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, F = window.__CH12F;
  const w = S.w, B = (x1, y, x2) => w(x1 + ',' + y, x2 + ',' + y);
  const st = (t, eq, why) => ({ t, eq, why });
  const KK = () => window.__K12;
  function ansScene(rows, subs, y) {
    const K = KK();
    const svg = K.calc(100, y || 112, 440, rows.map((r, i) => [r, 'a' + i, i === 0 ? 'ta' : 't', i === 0 ? 16 : 15]), { title: '答案　ANSWER', a: 'middle', k: 'ans' });
    return K.sc('答案', 'ANSWER', svg, subs.map((s, i) => ({ sub: s, on: (i === 0 ? 'ans ' : '') + 'a' + i + (i === subs.length - 1 && rows.length > subs.length ? ' ' + rows.slice(subs.length).map((_, j) => 'a' + (subs.length + j)).join(' ') : '') })));
  }
  /* 橫條（守恆用）：x 中心線、比例 s，值可正可負 */
  const hbar = (x, y, v, s, cls, lbl, key) => {
    const K = KK(), wd = Math.abs(v) * s;
    return K.g(key, '<rect class="' + cls + '" x="' + (v >= 0 ? x : x - wd).toFixed(1) + '" y="' + (y - 9) + '" width="' + wd.toFixed(1) + '" height="18" rx="3"/>' +
      K.T(v >= 0 ? x + wd + 6 : x - wd - 6, y + 5, lbl, { cls: 't', fs: 12.5, a: v >= 0 ? 'start' : 'end' }));
  };

  /* ---------------- 題目圖 ---------------- */
  const fig22 = S.svg(470, 175, [B(40, 40, 430), B(40, 85, 430), B(40, 130, 430), S.t(30, 44, 'a', 'end'), S.t(30, 89, 'b', 'end'), S.t(30, 134, 'c', 'end'),
    '<rect x="150" y="22" width="90" height="126" rx="6" fill="var(--surface)"/>', S.t(195, 82, '平衡負載 1'), S.t(195, 100, '30 kW, pf 0.6'),
    '<rect x="290" y="22" width="90" height="126" rx="6" fill="var(--surface)"/>', S.t(335, 82, '平衡負載 2'), S.t(335, 100, '45 kVAR, pf 0.8'),
    S.t(240, 168, '240 kV rms、60 Hz 三相線路（abc）')]);
  /* 瓦特計在三條線上（Example 12.13：電壓線圈接中性點） */
  function figW3() {
    const y = [40, 100, 160], x0 = 52, xs = 128, x1 = 440, xl = 336;
    const p = [w(x0 + ',' + y[0], x0 + ',' + y[2]), S.t(x0 - 8, 104, 'n', 'end')];
    const vs = ['100∠0° V', '100∠120° V', '100∠−120° V'], z = ['15 Ω', '10 + j5 Ω', '6 − j8 Ω'];
    y.forEach((yy, i) => {
      p.push(B(x0, yy, x0 + 24), '<circle cx="' + (x0 + 37) + '" cy="' + yy + '" r="13" fill="none"/>', S.t(x0 + 37, yy + 4, '~'), S.t(x0 + 22, yy - 17, vs[i], 'start', ' font-size="11"'), B(x0 + 50, yy, xs));
      p.push(S.wm(xs, yy, xs + 90), S.t(xs + 45, yy - 15, 'W' + (i + 1), 'middle', ' font-size="11" font-weight="700"'), B(xs + 90, yy, xl), S.z(xl, yy, x1, yy, z[i]), S.t(xl - 4, yy - 5, 'ABC'[i], 'end', ' font-size="10.5"'));
    });
    p.push(w(x1 + ',' + y[0], x1 + ',' + y[2]), S.t(x1 + 8, 104, 'N', 'start'), w(x0 + ',' + y[2], x0 + ',190', x1 + ',190', x1 + ',' + y[2]), S.t(240, 186, '中性線（電壓線圈的另一端都接這裡）'));
    return S.svg(470, 205, p);
  }
  /* 兩瓦特計法（圖 12.35）：W1 在 a 線、W2 在 c 線，電壓線圈都接到 b 線 */
  function fig2W(load) {
    const y = [40, 100, 160], x0 = 40, x1 = 440;
    const p = [S.t(x0 - 6, 44, 'a', 'end'), S.t(x0 - 6, 104, 'b', 'end'), S.t(x0 - 6, 164, 'c', 'end'),
      B(x0, y[0], 130), S.wm(130, y[0], 210), B(210, y[0], x1), B(x0, y[1], x1), B(x0, y[2], 130), S.wm(130, y[2], 210), B(210, y[2], x1),
      S.t(170, 24, 'W1', 'middle', ' font-weight="700"'), S.t(170, 192, 'W2', 'middle', ' font-weight="700"'),
      '<line x1="170" y1="51" x2="170" y2="100" stroke-dasharray="4 3"/>', '<line x1="170" y1="149" x2="170" y2="100" stroke-dasharray="4 3"/>', S.dot(170, 100),
      S.t(180, 80, '電壓線圈 → b', 'start', ' font-size="10"'),
      '<rect x="' + (x1 - 70) + '" y="24" width="90" height="152" rx="6" fill="var(--surface)"/>', S.t(x1 - 25, 92, '三相負載'), S.t(x1 - 25, 110, load || 'Z_Y')];
    return S.svg(480, 200, p);
  }

  const items = [
    /* ═══════════ 12.7 平衡三相功率 ═══════════ */
    { id: 'ex12-6', sec: '12.7', kind: 'ex', no: '12.6', title: '電源、線路、負載的複功率',
      q: '回到 Example 12.2 的電路（圖 12.13）。求電源端與負載端的總平均功率、虛功率、複功率。',
      en: 'Refer to the circuit in Fig. 12.13 (in Example 12.2). Determine the total average power, reactive power, and complex power at the source and at the load.',
      fig: F.F3({ src: 'Y', load: 'Y', vs: ['110∠0° V', '110∠−120° V', '110∠−240° V'], zl: '5 − j2 Ω', z: '10 + j8 Ω' }), cap: '同圖 12.13；Example 12.2 算過 I<sub>a</sub> = 6.81∠−21.8° A',
      idea: '平衡系統三相一樣，算一相再乘 3。電源「吸收」的是負的（它在送出），S<sub>s</sub> = −3V<sub>p</sub>I<sub>p</sub>*；負載用 S = 3|I<sub>p</sub>|²Z<sub>p</sub>。最後檢查守恆：電源 + 線路 + 負載 = 0。',
      steps: [
        st('拿 a 相的數字。', 'V<sub>p</sub> = 110∠0° V，I<sub>p</sub> = 6.81∠−21.8° A', '電流是 Example 12.2 的答案。'),
        st('電源吸收的複功率（被動符號：電流從 + 端流出，所以加負號）。', 'S<sub>s</sub> = −3V<sub>p</sub>I<sub>p</sub>* = −3(110∠0°)(6.81∠21.8°) = −2247∠21.8° = −(2087 + j834.6) VA', '負的 = 實際上在送出功率：送出 2087 W、834.6 VAR。'),
        st('負載吸收：用 S = 3|I<sub>p</sub>|²Z<sub>p</sub>。', 'Z<sub>p</sub> = 10 + j8 = 12.81∠38.66° Ω；S<sub>L</sub> = 3(6.81)²(12.81∠38.66°) = 1782∠38.66° = 1392 + j1113 VA', '負載吃 1391.7 W 和 1113.3 VAR。'),
        st('差額被線路吃掉。', 'S<sub>ℓ</sub> = 3|I<sub>p</sub>|²Z<sub>ℓ</sub> = 3(6.81)²(5 − j2) = 695.6 − j278.3 VA', '線路有電阻 5 Ω（耗 695.6 W），又是電容性 −j2（提供 278.3 VAR）。'),
        st('守恆檢查。', 'S<sub>s</sub> + S<sub>ℓ</sub> + S<sub>L</sub> = 0', '−2087 + 695.6 + 1392 ≈ 0；−834.6 − 278.3 + 1113 ≈ 0。')
      ],
      ans: '電源 S<sub>s</sub> = −(2087 + j834.6) VA（送出 2087 W、834.6 VAR）；負載 S<sub>L</sub> = 1392 + j1113 VA（吸收 1391.7 W、1113.3 VAR）；線路 695.6 − j278.3 VA',
      story: () => {
        const K = KK(), { T, g, calc, sc } = K, D = K.D;
        return [
          sc('先拿 a 相的數字', 'ONE PHASE × 3', K.single({ x: 90, y: 140, w: 230, h: 120, v: '110∠0°', z: ['5 − j2', '10 + j8'], i: 'I<sub>a</sub>', k: 'ckt' }) +
            calc(350, 120, 265, [['V<sub>p</sub> = 110∠0° V', 'r1'], ['I<sub>p</sub> = 6.81∠−21.8° A', 'r2', 'ta'], ['（Example 12.2 算過）', 'r3', 'tm'], ['三相一樣 → 算一相 × 3', 'r4']], { k: 'cc' }),
            [{ sub: '同一個電路（Example 12.2）。', on: 'ckt cc r1' },
             { sub: 'a 相電流已經算過：6.81∠−21.8° A。', on: 'r2 r3' },
             { sub: '平衡系統三相功率一樣，<b>算一相乘 3</b>。', on: 'r4' }]),
          sc('電源：送出多少', 'AT THE SOURCE', calc(60, 112, 520, [['S<sub>s</sub> = −3 V<sub>p</sub> I<sub>p</sub>*', 'r1'], ['= −3 (110∠0°)(6.81∠+21.8°)', 'r2'], ['= −2247∠21.8° VA', 'r3'], ['= −(2087 + j834.6) VA', 'r4', 'ta'], ['負號 = 電源在「送出」：2087 W、834.6 VAR', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
            [{ sub: '複功率 = V × I 的<b>共軛</b>（CH11 學過）。', on: 'cc r1' },
             { sub: 'I* 就是角度變號：∠−21.8° → ∠+21.8°。', on: 'r2' },
             { sub: '3 × 110 × 6.81 = 2247。', on: 'r3' },
             { sub: '拆成實部、虛部。', on: 'r4' },
             { sub: '前面的負號：電流從電源 + 端<b>流出</b>，照被動符號規則，吸收的是負的 —— 其實就是在送。', on: 'r5' }]),
          sc('負載與線路吸收多少', 'LOAD AND LINE', calc(30, 112, 285, [['負載 S<sub>L</sub> = 3|I<sub>p</sub>|²Z<sub>L</sub>', 'r1'], ['= 3(6.81)²(10 + j8)', 'r2'], ['= 1392 + j1113 VA', 'r3', 'ta']], { k: 'c1' }) +
            calc(330, 112, 285, [['線路 S<sub>ℓ</sub> = 3|I<sub>p</sub>|²Z<sub>ℓ</sub>', 'q1'], ['= 3(6.81)²(5 − j2)', 'q2'], ['= 695.6 − j278.3 VA', 'q3', 'ta']], { k: 'c2' }) +
            D.chip(320, 290, 'S = |I|²Z：電阻決定 P、電抗決定 Q', '', 'tip', { fs: 13 }),
            [{ sub: '負載：電流平方乘阻抗（S = |I|²Z）。', on: 'c1 r1 r2' },
             { sub: '負載吃 1392 W、1113 VAR。', on: 'r3' },
             { sub: '線路也是阻抗，一樣算。', on: 'c2 q1 q2' },
             { sub: '線路吃 695.6 W，但 −j2 是電容性 → Q 是負的。', on: 'q3 tip' }]),
          sc('守恆：三個加起來 = 0', 'CONSERVATION', (() => {
            const k = 0.11, X = 320, bx = (a, b, y, cls, key) => K.g(key, '<rect class="' + cls + '" x="' + Math.min(a, b).toFixed(1) + '" y="' + (y - 10) + '" width="' + Math.abs(b - a).toFixed(1) + '" height="20" rx="3"/>');
            const L = (x, y, t, key) => T(x, y, t, { cls: 't', fs: 12, k: key });
            return '<line class="ln" x1="' + X + '" y1="128" x2="' + X + '" y2="300"/>' +
              T(40, 175, 'P', { cls: 'tm', fs: 15, a: 'start' }) + T(40, 267, 'Q', { cls: 'tm', fs: 15, a: 'start' }) +
              bx(X - 2087 * k, X, 170, 'acc', 'b1') + L(X - 2087 * k / 2, 150, '電源 −2087 W', 'b1') +
              bx(X, X + 695.6 * k, 170, 'ink3', 'b2') + L(X + 695.6 * k / 2, 150, '線路 695.6', 'b2') +
              bx(X + 695.6 * k, X + 2087.6 * k, 170, 'ink2', 'b3') + L(X + (695.6 + 1392 / 2) * k, 150, '負載 1392', 'b3') +
              bx(X - 834.6 * k, X, 262, 'acc', 'c1') + L(X - 834.6 * k / 2, 292, '電源 −834.6', 'c1') +
              bx(X - 1112.9 * k, X - 834.6 * k, 262, 'ink3', 'c2') + L(X - (834.6 + 278.3 / 2) * k - 26, 292, '線路 −278.3', 'c2') +
              bx(X, X + 1113 * k, 262, 'ink2', 'c3') + L(X + 1113 * k / 2, 292, '負載 1113', 'c3');
          })(),
            [{ sub: '把三個 P 排在中線兩邊：電源 −2087 W 在左邊。', on: 'b1' },
             { sub: '右邊：線路 695.6 + 負載 1392，長度剛好補滿 2087。', on: 'b2 b3' },
             { sub: 'Q 也一樣：左邊電源 −834.6、線路 −278.3，右邊負載 +1113。', on: 'c1 c2 c3' },
             { sub: '這就是 CH11 的<b>交流功率守恆</b>：S<sub>s</sub> + S<sub>ℓ</sub> + S<sub>L</sub> = 0。', on: '' }]),
          ansScene(['電源 S<sub>s</sub> = −(2087 + j834.6) VA', '負載 S<sub>L</sub> = 1392 + j1113 VA', '線路 S<sub>ℓ</sub> = 695.6 − j278.3 VA'],
            ['電源送出 2087 W、834.6 VAR。', '負載吃 1391.7 W、1113.3 VAR，其餘被線路吃掉。'])
        ];
      } },
    { id: 'pp12-6', sec: '12.7', kind: 'pp', no: '12.6', title: 'Practice 12.2 的複功率',
      q: '對 Practice Problem 12.2 的 Y-Y 電路，求電源端與負載端的複功率。',
      en: 'For the Y-Y circuit in Practice Prob. 12.2, calculate the complex power at the source and at the load.',
      hint: 'I<sub>a</sub> = 3.75∠−8.66° A（Practice 12.2）。S<sub>s</sub> = −3V<sub>an</sub>I<sub>a</sub>*，S<sub>L</sub> = 3|I<sub>a</sub>|²(24 + j19)。',
      steps: [
        st('電源。', 'S<sub>s</sub> = −3(120∠30°)(3.75∠8.66°) = −1350∠38.66° = −(1054.2 + j843.3) VA'),
        st('負載。', 'S<sub>L</sub> = 3(3.75)²(24 + j19) = 1012 + j801.6 VA'),
        st('差額 = 發電機內阻＋線路。', '3(3.75)²[(0.4 + j0.3) + (0.6 + j0.7)] = 42.2 + j42.2 VA', '1054.2 − 1012 = 42.2 ✓')
      ],
      ans: 'S<sub>s</sub> = −(1054.2 + j843.3) VA，S<sub>L</sub> = 1012 + j801.6 VA',
      note: '用 I<sub>a</sub> = 3.748 A（不先四捨五入）會得到 −(1053.7 + j842.9) 與 1011.5 + j800.8，差別只是四捨五入。',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('一相 × 3', 'ONE PHASE × 3', calc(40, 112, 560, [['I<sub>a</sub> = 3.75∠−8.66° A（Practice 12.2）', 'r1', 'tm'], ['S<sub>s</sub> = −3 (120∠30°)(3.75∠+8.66°) = −1350∠38.66°', 'r2'], ['= −(1054.2 + j843.3) VA', 'r3', 'ta'], ['S<sub>L</sub> = 3 (3.75)² (24 + j19) = 1012 + j801.6 VA', 'r4', 'ta'], ['差 42.2 + j42.2 VA：發電機內阻＋線路吃掉', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
            [{ sub: '電流沿用 Practice 12.2。', on: 'cc r1' },
             { sub: '電源：−3 V I*（共軛：角度變號）。', on: 'r2 r3' },
             { sub: '負載：3|I|²Z。', on: 'r4' },
             { sub: '兩者的差就是路上（內阻＋線路）吃掉的。', on: 'r5' }]),
          ansScene(['S<sub>s</sub> = −(1054.2 + j843.3) VA', 'S<sub>L</sub> = 1012 + j801.6 VA'], ['答案如上；負號代表電源在送出。'])
        ];
      } },
    { id: 'ex12-7', sec: '12.7', kind: 'ex', no: '12.7', title: '馬達的功率因數',
      q: '三相馬達可以看成平衡 Y 負載。某三相馬達在線電壓 220 V、線電流 18.2 A 時吃 5.6 kW。求馬達的功率因數。',
      en: 'A three-phase motor can be regarded as a balanced Y-load. A three-phase motor draws 5.6 kW when the line voltage is 220 V and the line current is 18.2 A. Determine the power factor of the motor.',
      idea: '三相視在功率 |S| = √3 V<sub>L</sub>I<sub>L</sub>，pf = P/|S|。',
      steps: [
        st('視在功率。', 'S = √3 V<sub>L</sub>I<sub>L</sub> = √3(220)(18.2) = 6935.13 VA', '三相總視在功率用線值：√3 × 線電壓 × 線電流。'),
        st('實功率 = S cos θ。', 'P = S cos θ = 5600 W'),
        st('功率因數。', 'pf = P/S = 5600/6935.13 = 0.8075')
      ],
      ans: 'pf = 0.8075（馬達是電感性，落後）',
      story: () => {
        const K = KK(), { T, calc, sc } = K;
        return [
          sc('杯子有多大：視在功率', 'APPARENT POWER', calc(40, 120, 300, [['|S| = √3 V<sub>L</sub> I<sub>L</sub>', 'r1'], ['= √3 × 220 × 18.2', 'r2'], ['= 6935 VA', 'r3', 'ta']], { k: 'cc' }) +
            K.tri(400, 280, 5600, 4091, 0.03, { kp: 'p', kq: 'q', ks: 's', lp: 'P = 5600 W', ls: '|S| = 6935 VA', lq: 'Q' }),
            [{ sub: '三相的視在功率：<b>√3 × 線電壓 × 線電流</b>。', on: 'cc r1 r2' },
             { sub: '= 6935 VA：這是斜邊。', on: 'r3 s' },
             { sub: '馬達真的吃掉的是 5600 W：這是底邊。', on: 'p q' }]),
          sc('pf = 底 ÷ 斜邊', 'PF = P / |S|', calc(120, 130, 400, [['pf = cos θ = P / |S|', 'r1'], ['= 5600 / 6935.13', 'r2'], ['= 0.8075', 'r3', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '功率因數 = 底邊 ÷ 斜邊。', on: 'cc r1' },
             { sub: '代數字。', on: 'r2' },
             { sub: '0.8075；馬達是線圈 → 電感性、落後。', on: 'r3' }]),
          ansScene(['pf = 0.8075（落後）'], ['答案：0.8075。'])
        ];
      } },
    { id: 'pp12-7', sec: '12.7', kind: 'pp', no: '12.7', title: '馬達要多少線電流',
      q: '30 kW、功率因數 0.85 落後的三相馬達，接在線電壓 440 V 的平衡電源上。求所需線電流。',
      en: 'Calculate the line current required for a 30-kW three-phase motor having a power factor of 0.85 lagging if it is connected to a balanced source with a line voltage of 440 V.',
      hint: 'P = √3 V<sub>L</sub>I<sub>L</sub> cos θ，解 I<sub>L</sub>。',
      steps: [
        st('P = √3 V<sub>L</sub>I<sub>L</sub> pf。', 'I<sub>L</sub> = P / (√3 V<sub>L</sub> pf) = 30000 / (√3 × 440 × 0.85)'),
        st('', 'I<sub>L</sub> = 46.31 A')
      ],
      ans: '46.31 A',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('把公式倒過來', 'SOLVE FOR I<sub>L</sub>', calc(110, 120, 420, [['P = √3 V<sub>L</sub> I<sub>L</sub> cos θ', 'r1'], ['I<sub>L</sub> = P / (√3 V<sub>L</sub> cos θ)', 'r2'], ['= 30000 / (1.732 × 440 × 0.85)', 'r3'], ['= 46.31 A', 'r4', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '三相實功率：√3 V<sub>L</sub> I<sub>L</sub> cos θ。', on: 'cc r1' },
             { sub: '要求電流，就把它移到左邊。', on: 'r2' },
             { sub: '代數字（30 kW = 30000 W）。', on: 'r3' },
             { sub: '46.31 A。', on: 'r4' }]),
          ansScene(['I<sub>L</sub> = 46.31 A'], ['答案：46.31 A。'])
        ];
      } },
    { id: 'ex12-8', sec: '12.7', kind: 'ex', no: '12.8', title: '兩組負載＋功因校正',
      q: '兩組平衡負載接在 240 kV rms、60 Hz 的線路上。負載 1 吃 30 kW、pf 0.6 落後；負載 2 吃 45 kVAR、pf 0.8 落後。abc 相序。求 (a) 合併負載的複功率、實功率、虛功率 (b) 線電流 (c) 要把 pf 拉到 0.9 落後，Δ 接並聯的三顆電容各需多少 kVAR、電容值多少。',
      en: 'Two balanced loads are connected to a 240-kV rms 60-Hz line, as shown in Fig. 12.22(a). Load 1 draws 30 kW at a power factor of 0.6 lagging, while load 2 draws 45 kVAR at a power factor of 0.8 lagging. Assuming the abc sequence, determine: (a) the complex, real, and reactive powers absorbed by the combined load, (b) the line currents, and (c) the kVAR rating of the three capacitors Δ-connected in parallel with the load that will raise the power factor to 0.9 lagging and the capacitance of each capacitor.',
      fig: fig22, cap: '圖 12.22(a)',
      idea: '每組負載先化成一對 (P, Q)，複功率直接相加。線電流 I<sub>L</sub> = |S|/(√3 V<sub>L</sub>)。功因校正跟 CH11 一樣：Q<sub>C</sub> = P(tan θ<sub>old</sub> − tan θ<sub>new</sub>)，三顆平分；Δ 接的電容兩端是線電壓。',
      steps: [
        st('(a) 負載 1：P<sub>1</sub> = 30 kW、cos θ<sub>1</sub> = 0.6 → sin θ<sub>1</sub> = 0.8。', 'S<sub>1</sub> = 30/0.6 = 50 kVA，Q<sub>1</sub> = 50(0.8) = 40 kVAR → S<sub>1</sub> = 30 + j40 kVA'),
        st('負載 2：Q<sub>2</sub> = 45 kVAR、cos θ<sub>2</sub> = 0.8 → sin θ<sub>2</sub> = 0.6。', 'S<sub>2</sub> = 45/0.6 = 75 kVA，P<sub>2</sub> = 75(0.8) = 60 kW → S<sub>2</sub> = 60 + j45 kVA'),
        st('相加（複功率可以直接加）。', 'S = S<sub>1</sub> + S<sub>2</sub> = 90 + j85 kVA = 123.8∠43.36° kVA', 'pf = cos 43.36° = 0.727 落後；P = 90 kW，Q = 85 kVAR。'),
        st('(b) 線電流：S = √3 V<sub>L</sub>I<sub>L</sub>。', 'I<sub>L</sub> = 123,800 / (√3 × 240,000) = 297.8 mA', '分開算再相加也一樣：I<sub>a1</sub> = 120.28∠−53.13° mA、I<sub>a2</sub> = 180.42∠−36.87° mA，相加 297.8∠−43.36° mA。'),
        st('落後 → 電流角度是負的。', 'I<sub>a</sub> = 297.8∠−43.36° mA，I<sub>b</sub> = 297.8∠−163.36° mA，I<sub>c</sub> = 297.8∠76.64° mA'),
        st('(c) 要補的虛功率。', 'Q<sub>C</sub> = P(tan θ<sub>old</sub> − tan θ<sub>new</sub>) = 90,000(tan 43.36° − tan 25.84°) = 41.4 kVAR', 'θ<sub>new</sub> = cos<sup>−1</sup> 0.9 = 25.84°。'),
        st('三顆電容平分。', 'Q′<sub>C</sub> = 41.4/3 = 13.8 kVAR（每顆）'),
        st('Δ 接 → 每顆電容兩端是線電壓 240 kV。', 'C = Q′<sub>C</sub> / (ωV<sup>2</sup><sub>rms</sub>) = 13,800 / [(2π·60)(240,000)<sup>2</sup>] = 635.5 pF')
      ],
      ans: '(a) S = 90 + j85 kVA = 123.8∠43.36° kVA，P = 90 kW，Q = 85 kVAR　(b) I<sub>a</sub> = 297.8∠−43.36° mA，I<sub>b</sub> = 297.8∠−163.36° mA，I<sub>c</sub> = 297.8∠76.64° mA　(c) 每顆 13.8 kVAR，C = 635.5 pF',
      note: '課本 (b) 結尾寫「I<sub>b2</sub> and I<sub>ca</sub>」是筆誤，指的是 I<sub>b</sub>、I<sub>c</sub>；S<sub>2</sub> = 45 kVA/0.6 那裡的 45 是 kVAR。',
      story: () => {
        const K = KK(), { T, g, calc, sc } = K, D = K.D;
        const s = 0.0016;
        return [
          sc('兩組負載', 'TWO LOADS', g('box', '<rect class="bgw" x="120" y="128" width="150" height="120" rx="10"/><rect class="bgw" x="370" y="128" width="150" height="120" rx="10"/>') +
            T(195, 180, '負載 1', { fs: 16, k: 'l1' }) + T(195, 206, '30 kW　pf 0.6', { cls: 'tm', fs: 13, k: 'l1b' }) +
            T(445, 180, '負載 2', { fs: 16, k: 'l2' }) + T(445, 206, '45 kVAR　pf 0.8', { cls: 'tm', fs: 13, k: 'l2b' }) +
            D.chip(320, 290, '240 kV、60 Hz 三相線路', '兩組都是落後（電感性）', 'ln', { fs: 13.5 }),
            [{ sub: '同一條 240 kV 線路上掛了兩組平衡負載。', on: 'box ln' },
             { sub: '負載 1 給的是 <b>P</b> 和 pf。', on: 'l1 l1b' },
             { sub: '負載 2 給的卻是 <b>Q</b> 和 pf —— 先把兩組都化成 (P, Q)。', on: 'l2 l2b' }]),
          sc('各畫一個功率三角形', 'TWO TRIANGLES', K.tri(70, 285, 30000, 40000, 0.0036, { kp: 'p1', kq: 'q1', ks: 's1', lp: '30 kW', lq: '40 kVAR', ls: '50 kVA' }) +
            K.tri(330, 285, 60000, 45000, 0.0036, { kp: 'p2', kq: 'q2', ks: 's2', lp: '60 kW', lq: '45 kVAR', ls: '75 kVA' }) +
            T(140, 120, '負載 1：S = P/cos θ', { cls: 'tm', fs: 12.5, k: 't1' }) + T(450, 120, '負載 2：S = Q/sin θ', { cls: 'tm', fs: 12.5, k: 't2' }),
            [{ sub: '負載 1：pf 0.6 → sin θ = 0.8。斜邊 = 30 ÷ 0.6 = 50 kVA。', on: 'p1 s1 t1' },
             { sub: 'Q<sub>1</sub> = 50 × 0.8 = 40 kVAR。', on: 'q1' },
             { sub: '負載 2：pf 0.8 → sin θ = 0.6。斜邊 = 45 ÷ 0.6 = 75 kVA。', on: 'q2 s2 t2' },
             { sub: 'P<sub>2</sub> = 75 × 0.8 = 60 kW。', on: 'p2' }]),
          sc('頭尾接起來相加', 'ADD THEM', K.tri(110, 290, 90000, 85000, s, { kp: 'p', kq: 'q', ks: 's', lp: 'P = 90 kW', lq: 'Q = 85 kVAR', ls: '|S| = 123.8 kVA' }) +
            calc(370, 120, 250, [['S = (30 + j40) + (60 + j45)', 'r1'], ['= 90 + j85 kVA', 'r2'], ['= 123.8∠43.36° kVA', 'r3', 'ta'], ['pf = cos 43.36° = 0.727', 'r4']], { k: 'cc' }),
            [{ sub: '複功率可以直接相加：P 加 P、Q 加 Q。', on: 'cc r1 r2 p q' },
             { sub: '斜邊 123.8 kVA，角度 43.36°。', on: 's r3' },
             { sub: '合併後 pf = 0.727 落後（注意：不是 0.6 和 0.8 的平均）。', on: 'r4' }]),
          sc('(b) 線電流', 'LINE CURRENT', calc(80, 116, 480, [['|S| = √3 V<sub>L</sub> I<sub>L</sub>', 'r1'], ['I<sub>L</sub> = 123,800 / (√3 × 240,000) = 297.8 mA', 'r2', 'ta'], ['落後 43.36° → I<sub>a</sub> = 297.8∠−43.36° mA', 'r3'], ['I<sub>b</sub> = 297.8∠−163.36°　I<sub>c</sub> = 297.8∠76.64°', 'r4']], { k: 'cc', a: 'middle' }),
            [{ sub: '三相視在功率 = √3 × 線電壓 × 線電流。', on: 'cc r1' },
             { sub: '電壓非常高（240 kV），所以電流只有 0.3 A。', on: 'r2' },
             { sub: '電流落後電壓 43.36°（以 V<sub>an</sub> 為 0°）。', on: 'r3' },
             { sub: '其他兩條照 abc 相序。', on: 'r4' }]),
          sc('(c) 用電容把 Q 削掉一截', 'PF CORRECTION', K.tri(90, 290, 90000, 85000, s, { kp: 'p', kq: 'q', ks: 's', lp: '90 kW', ls: '舊 pf 0.727' }) +
            g('new', '<path class="lna" style="fill:none;stroke-width:2.6" d="M90 290 L' + (90 + 90000 * s).toFixed(1) + ' ' + (290 - 43600 * s).toFixed(1) + '"/>') +
            g('cut', '<path class="ln dsh" style="fill:none" d="M' + (90 + 90000 * s + 14) + ' ' + (290 - 85000 * s) + ' V' + (290 - 43600 * s).toFixed(1) + '"/>') +
            T(90 + 90000 * s + 22, 290 - 64300 * s, 'Q<sub>C</sub> = 41.4 kVAR', { cls: 'ta', fs: 13, a: 'start', k: 'qc' }) +
            calc(385, 116, 240, [['θ<sub>new</sub> = cos<sup>−1</sup>0.9 = 25.84°', 'r1'], ['Q<sub>C</sub> = P(tan θ<sub>old</sub> − tan θ<sub>new</sub>)', 'r2'], ['= 90k(0.9444 − 0.4843)', 'r3'], ['= 41.4 kVAR', 'r4', 'ta'], ['每顆 41.4/3 = 13.8 kVAR', 'r5']], { k: 'cc' }),
            [{ sub: '目標 pf 0.9：新的斜邊角度 25.84°。', on: 'p q s cc r1 new' },
             { sub: 'P 不變，Q 要從 85 降到 43.6 kVAR。', on: 'r2 r3 cut' },
             { sub: '電容提供 −41.4 kVAR。', on: 'r4 qc' },
             { sub: '三顆電容平分：每顆 13.8 kVAR。', on: 'r5' }]),
          sc('電容值', 'CAPACITANCE', calc(80, 120, 480, [['Δ 接 → 每顆跨在兩條線之間：V = 240 kV', 'r1', 'tm'], ['C = Q′<sub>C</sub> / (ω V<sup>2</sup>)', 'r2'], ['= 13,800 / [(2π·60)(240,000)<sup>2</sup>]', 'r3'], ['= 635.5 pF', 'r4', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '電容接成 Δ：兩端吃的是<b>線電壓</b> 240 kV。', on: 'cc r1' },
             { sub: 'CH11 的公式：Q = ωCV²。', on: 'r2 r3' },
             { sub: '電壓這麼高，只要 635.5 pF。', on: 'r4' }]),
          ansScene(['S = 90 + j85 kVA = 123.8∠43.36° kVA', 'I<sub>a</sub> = 297.8∠−43.36° mA（I<sub>b</sub>、I<sub>c</sub> 各轉 ∓120°）', '每顆電容 13.8 kVAR，C = 635.5 pF'],
            ['(a) P = 90 kW、Q = 85 kVAR。', '(b) 線電流 297.8 mA。(c) 每顆 13.8 kVAR、635.5 pF。'])
        ];
      } },
    { id: 'pp12-8', sec: '12.7', kind: 'pp', no: '12.8', title: '把功因拉到 1',
      q: '圖 12.22(a) 的兩組平衡負載改接 840 V rms、60 Hz 線路。負載 1 是 Y 接，每相 30 + j40 Ω；負載 2 是平衡三相馬達，吃 48 kW、pf 0.8 落後。abc 相序。求 (a) 合併負載的複功率 (b) Δ 接並聯的三顆電容各需多少 kVAR，才能把 pf 拉到 1 (c) 功因為 1 時從電源拉的電流。',
      en: 'Assume that the two balanced loads in Fig. 12.22(a) are supplied by an 840-V rms 60-Hz line. Load 1 is Y-connected with 30 + j40 Ω per phase, while load 2 is a balanced three-phase motor drawing 48 kW at a power factor of 0.8 lagging. Assuming the abc sequence, calculate: (a) the complex power absorbed by the combined load, (b) the kVAR rating of each of the three capacitors Δ-connected in parallel with the load to raise the power factor to unity, and (c) the current drawn from the supply at unity power factor condition.',
      hint: '負載 1：S<sub>1</sub> = 3V<sub>p</sub><sup>2</sup>/Z*，V<sub>p</sub> = 840/√3。負載 2：Q<sub>2</sub> = P tan θ。pf = 1 代表 Q 全部抵掉。',
      steps: [
        st('負載 1（Y 接，每相電壓 V<sub>p</sub> = 840/√3 = 484.97 V）。', 'S<sub>1</sub> = 3V<sub>p</sub><sup>2</sup> / Z<sub>1</sub>* = 3(235,200) / (30 − j40) = 8467.2 + j11,289.6 VA'),
        st('負載 2。', 'S<sub>2</sub> = 48,000 + j48,000·tan(cos<sup>−1</sup>0.8) = 48,000 + j36,000 VA'),
        st('(a) 合併。', 'S = 56.47 + j47.29 kVA'),
        st('(b) pf = 1 → 電容要抵掉全部 Q，三顆平分。', 'Q′<sub>C</sub> = 47.29/3 = 15.76 kVAR'),
        st('(c) 剩下 |S| = P。', 'I = 56,467 / (√3 × 840) = 38.81 A')
      ],
      ans: '(a) 56.47 + j47.29 kVA　(b) 每顆 15.76 kVAR　(c) 38.81 A',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('兩組化成 (P, Q)', 'TO (P, Q)', calc(30, 112, 580, [['負載 1：V<sub>p</sub> = 840/√3 = 484.97 V', 'r1', 'tm'], ['S<sub>1</sub> = 3V<sub>p</sub><sup>2</sup>/Z* = 705,600/(30 − j40) = 8467 + j11,290', 'r2'], ['負載 2：S<sub>2</sub> = 48,000 + j36,000（Q = P tan θ）', 'r3'], ['S = 56.47 + j47.29 kVA', 'r4', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'Y 接負載每相吃相電壓 840/√3。', on: 'cc r1' },
             { sub: '用 S = 3V²/Z*（分母共軛！）。', on: 'r2' },
             { sub: '馬達：pf 0.8 → tan θ = 0.75 → Q = 36 kVAR。', on: 'r3' },
             { sub: '相加。', on: 'r4' }]),
          sc('pf = 1：Q 全部抵掉', 'UNITY PF', K.tri(80, 280, 56467, 47290, 0.0034, { kp: 'p', kq: 'q', ks: 's', lp: 'P = 56.47 kW', lq: '−47.29 kVAR' }) +
            calc(360, 122, 255, [['每顆 47.29/3 = 15.76 kVAR', 'r1', 'ta'], ['之後 |S| = P', 'r2'], ['I = 56,467/(√3 × 840)', 'r3'], ['= 38.81 A', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: 'pf = 1 代表三角形被壓扁：Q 歸零。', on: 'p q s cc r1' },
             { sub: '剩下的斜邊就是 P。', on: 'r2' },
             { sub: '線電流 = P/(√3 V<sub>L</sub>) = 38.81 A。', on: 'r3 r4' }]),
          ansScene(['S = 56.47 + j47.29 kVA', '每顆電容 15.76 kVAR', 'I = 38.81 A'], ['答案如上。'])
        ];
      } },

    /* ═══════════ 12.8 不平衡三相系統 ═══════════ */
    { id: 'ex12-9', sec: '12.8', kind: 'ex', no: '12.9', title: '不平衡 Y 負載的中性線電流',
      q: '圖中不平衡 Y 負載的電壓是平衡的 100 V、acb 相序。Z<sub>A</sub> = 15 Ω、Z<sub>B</sub> = 10 + j5 Ω、Z<sub>C</sub> = 6 − j8 Ω。求線電流與中性線電流。',
      en: 'The unbalanced Y-load of Fig. 12.23 has balanced voltages of 100 V and the acb sequence. Calculate the line currents and the neutral current. Take Z<sub>A</sub> = 15 Ω, Z<sub>B</sub> = 10 + j5 Ω, Z<sub>C</sub> = 6 − j8 Ω.',
      fig: F.F3({ src: 'Y', load: 'Y', vs: ['100∠0° V', '100∠120° V', '100∠−120° V'], z: ['15 Ω', '10 + j5 Ω', '6 − j8 Ω'], n: true }), cap: '四線式：有中性線，每相各自用歐姆定律',
      idea: '有中性線 → 每相負載兩端就是各自的相電壓，三相各算各的（不能只算一相）。中性線電流 = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>)。',
      steps: [
        st('acb 相序：V<sub>BN</sub> 在 +120°、V<sub>CN</sub> 在 −120°。', 'V<sub>AN</sub> = 100∠0°、V<sub>BN</sub> = 100∠120°、V<sub>CN</sub> = 100∠−120° V'),
        st('a 相。', 'I<sub>a</sub> = 100∠0° / 15 = 6.67∠0° A'),
        st('b 相。', 'I<sub>b</sub> = 100∠120° / (10 + j5) = 100∠120° / 11.18∠26.56° = 8.94∠93.44° A'),
        st('c 相。', 'I<sub>c</sub> = 100∠−120° / (6 − j8) = 100∠−120° / 10∠−53.13° = 10∠−66.87° A'),
        st('中性線：節點 N 的 KCL。', 'I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>) = −(6.67 − 0.54 + j8.92 + 3.93 − j9.2) = −10.06 + j0.28 = 10.06∠178.4° A', '不平衡 → 三個電流加起來不再是 0，多出來的從中性線回去。')
      ],
      ans: 'I<sub>a</sub> = 6.67∠0° A，I<sub>b</sub> = 8.94∠93.44° A，I<sub>c</sub> = 10∠−66.87° A，I<sub>n</sub> = 10.06∠178.4° A',
      story: () => {
        const K = KK(), { T, g, ph, sys3, calc, sc } = K, D = K.D;
        const base = { src: 'Y', load: 'Y', x0: 80, x1: 560, y: [130, 185, 240], vs: ['100∠0°', '100∠120°', '100∠−120°'], z: ['15', '10 + j5', '6 − j8'], n: true };
        return [
          sc('三個負載不一樣', 'UNBALANCED LOAD', sys3(Object.assign({}, base, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl', n: 'n' } })),
            [{ sub: '電源還是平衡的：三個 100 V，acb 相序。', on: 'src lbl line' },
             { sub: '但三個負載<b>都不一樣</b>：15、10 + j5、6 − j8 Ω。', on: 'load' },
             { sub: '有中性線（四線式）：每個負載兩端都正好是自己那一相的電壓。', on: 'n' }]),
          sc('三相各算各的', 'THREE OHM’S LAWS', calc(40, 108, 560, [['I<sub>a</sub> = 100∠0° ÷ 15 = 6.67∠0° A', 'r1'], ['I<sub>b</sub> = 100∠120° ÷ 11.18∠26.56° = 8.94∠93.44° A', 'r2'], ['I<sub>c</sub> = 100∠−120° ÷ 10∠−53.13° = 10∠−66.87° A', 'r3'], ['不平衡：不能「算一相乘 3」', 'r4', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'a 相：純電阻，電流跟電壓同相。', on: 'cc r1' },
             { sub: 'b 相：acb 相序的 V<sub>BN</sub> 在 +120°。', on: 'r2' },
             { sub: 'c 相：V<sub>CN</sub> 在 −120°。', on: 'r3' },
             { sub: '三個大小、角度都不一樣 —— 平衡時的捷徑不能用了。', on: 'r4' }]),
          sc('加起來不是 0', 'THE NEUTRAL CURRENT', ph(250, 205, 10, [{ a: 0, m: 6.67, l: 'I<sub>a</sub>', k: 'pa', c: 'ln' }, { a: 93.44, m: 8.94, l: 'I<sub>b</sub>', k: 'pb', c: 'ln' }, { a: -66.87, m: 10, l: 'I<sub>c</sub>', k: 'pc', c: 'ln' },
            { a: 178.4, m: 10.06, l: 'I<sub>n</sub>', k: 'pn', lc: 'ta' }], { k: 'ax', ax: 118, noTick: true }) +
            calc(440, 116, 180, [['I<sub>a</sub>+I<sub>b</sub>+I<sub>c</sub>', 'r1'], ['= 10.06 − j0.28', 'r2'], ['I<sub>n</sub> = −(總和)', 'r3'], ['= 10.06∠178.4° A', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '把三個電流畫在一起：不再是對稱的三支。', on: 'ax pa pb pc' },
             { sub: '加起來 = 10.06 − j0.28，<b>不是 0</b>。', on: 'cc r1 r2' },
             { sub: '多出來的電流只能從中性線流回去：I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>)。', on: 'r3 r4 pn' }]),
          ansScene(['I<sub>a</sub> = 6.67∠0°、I<sub>b</sub> = 8.94∠93.44°、I<sub>c</sub> = 10∠−66.87° A', 'I<sub>n</sub> = 10.06∠178.4° A'],
            ['三條線電流各不相同。', 'I<sub>n</sub> 跟線電流一樣大：不平衡時中性線不能拿掉。'])
        ];
      } },
    { id: 'pp12-9', sec: '12.8', kind: 'pp', no: '12.9', title: '不平衡 Δ 負載的線電流',
      q: '圖中不平衡 Δ 負載由 440 V、正相序的平衡線電壓供電，以 V<sub>ab</sub> 為參考。求線電流。',
      en: 'The unbalanced Δ-load of Fig. 12.24 is supplied by balanced line-to-line voltages of 440 V in the positive sequence. Find the line currents. Take V<sub>ab</sub> as reference.',
      fig: F.F3({ src: 'D', load: 'D', vs: ['440∠0° V', '440∠−120° V', '440∠120° V'], z: ['10 − j5 Ω', '16 Ω', '8 + j6 Ω'] }), cap: '圖 12.24：AB 之間 10 Ω 串 −j5 Ω、BC 之間 16 Ω、CA 之間 8 Ω 串 j6 Ω',
      hint: 'Δ 每相吃線電壓：先算三個相電流 I<sub>AB</sub>、I<sub>BC</sub>、I<sub>CA</sub>，再用節點 KCL：I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>…（不平衡不能用 √3∠−30°）。',
      steps: [
        st('三個相電流（各用自己的阻抗）。', 'I<sub>AB</sub> = 440∠0° / (10 − j5) = 39.36∠26.57° A；I<sub>BC</sub> = 440∠−120° / 16 = 27.5∠−120° A；I<sub>CA</sub> = 440∠120° / (8 + j6) = 44∠83.13° A'),
        st('節點 A。', 'I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub> = 39.71∠−41.07° A'),
        st('節點 B。', 'I<sub>b</sub> = I<sub>BC</sub> − I<sub>AB</sub> = 64.12∠−139.77° A'),
        st('節點 C。', 'I<sub>c</sub> = I<sub>CA</sub> − I<sub>BC</sub> = 70.13∠74.27° A')
      ],
      ans: '39.71∠−41.06° A、64.12∠−139.8° A、70.13∠74.27° A',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('三個相電流', 'PHASE CURRENTS', calc(40, 112, 560, [['I<sub>AB</sub> = 440∠0° ÷ (10 − j5) = 39.36∠26.57° A', 'r1'], ['I<sub>BC</sub> = 440∠−120° ÷ 16 = 27.5∠−120° A', 'r2'], ['I<sub>CA</sub> = 440∠120° ÷ (8 + j6) = 44∠83.13° A', 'r3'], ['三個不一樣大 → 不能用 √3∠−30° 捷徑', 'r4', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'Δ 每一格都吃一個線電壓，各除自己的阻抗。', on: 'cc r1' },
             { sub: 'BC 那格是純電阻 16 Ω。', on: 'r2' },
             { sub: 'CA 那格 8 + j6 Ω。', on: 'r3' },
             { sub: '三個大小不一樣：√3 那條捷徑只有平衡時成立。', on: 'r4' }]),
          sc('每個節點做 KCL', 'KCL AT EACH NODE', calc(60, 112, 520, [['I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub> = 39.71∠−41.07° A', 'r1'], ['I<sub>b</sub> = I<sub>BC</sub> − I<sub>AB</sub> = 64.12∠−139.77° A', 'r2'], ['I<sub>c</sub> = I<sub>CA</sub> − I<sub>BC</sub> = 70.13∠74.27° A', 'r3'], ['檢查：I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub> = 0（三線式）', 'r4', 'tm']], { k: 'cc', a: 'middle' }),
            [{ sub: '節點 A：流進來的線電流 = 流出去的 I<sub>AB</sub> − 流進來的 I<sub>CA</sub>。', on: 'cc r1' },
             { sub: '節點 B、C 一樣。', on: 'r2 r3' },
             { sub: '三線式沒有中性線，三個加起來一定是 0。', on: 'r4' }]),
          ansScene(['I<sub>a</sub> = 39.71∠−41.07° A', 'I<sub>b</sub> = 64.12∠−139.77° A', 'I<sub>c</sub> = 70.13∠74.27° A'], ['答案如上（課本 −41.06°、−139.8° 是四捨五入）。'])
        ];
      } },
    { id: 'ex12-10', sec: '12.8', kind: 'ex', no: '12.10', title: '三線式不平衡：網目分析',
      q: '圖中不平衡電路，求 (a) 線電流 (b) 負載吸收的總複功率 (c) 電源吸收的總複功率。',
      en: 'For the unbalanced circuit in Fig. 12.25, find: (a) the line currents, (b) the total complex power absorbed by the load, and (c) the total complex power absorbed by the source.',
      fig: F.F3({ src: 'Y', load: 'Y', vs: ['120∠0° rms', '120∠−120° rms', '120∠120° rms'], z: ['j5 Ω', '10 Ω', '−j10 Ω'] }), cap: '圖 12.25（課本圖上的單位印成 W，應為 Ω）；沒有中性線',
      idea: '沒有中性線、負載又不平衡 → N 點不再是 0 V，不能各相單獨用歐姆定律。改用網目分析：兩個網目電流 I<sub>1</sub>（a-A-N-B-b-n）、I<sub>2</sub>（b-B-N-C-c-n）。',
      steps: [
        st('網目 1（KVL）。', '120∠−120° − 120∠0° + (10 + j5)I<sub>1</sub> − 10I<sub>2</sub> = 0　→　(10 + j5)I<sub>1</sub> − 10I<sub>2</sub> = 120√3∠30°', '120∠0° − 120∠−120° 就是線電壓 V<sub>ab</sub> = 120√3∠30°。'),
        st('網目 2。', '−10I<sub>1</sub> + (10 − j10)I<sub>2</sub> = 120√3∠−90°'),
        st('克拉瑪公式：行列式。', 'Δ = (10 + j5)(10 − j10) − 100 = 50 − j50 = 70.71∠−45°；Δ<sub>1</sub> = 4015∠−45°；Δ<sub>2</sub> = 3023.4∠−20.1°'),
        st('網目電流。', 'I<sub>1</sub> = Δ<sub>1</sub>/Δ = 56.78∠0° A，I<sub>2</sub> = Δ<sub>2</sub>/Δ = 42.75∠24.9° A'),
        st('線電流 = 網目電流的組合。', 'I<sub>a</sub> = I<sub>1</sub> = 56.78 A，I<sub>b</sub> = I<sub>2</sub> − I<sub>1</sub> = 25.46∠135° A，I<sub>c</sub> = −I<sub>2</sub> = 42.75∠−155.1° A'),
        st('(b) 負載各相 S = |I|²Z。', 'S<sub>A</sub> = (56.78)²(j5) = j16,120；S<sub>B</sub> = (25.46)²(10) = 6480；S<sub>C</sub> = (42.75)²(−j10) = −j18,276 VA'),
        st('', 'S<sub>L</sub> = 6480 − j2156 VA', '不平衡：總功率 = 三相各自相加，不是 3 倍。'),
        st('(c) 電源各相 S = −V I*。', 'S<sub>a</sub> = −6813.6；S<sub>b</sub> = 790 − j2951.1；S<sub>c</sub> = −456.03 + j5109.7 VA → S<sub>s</sub> = −6480 + j2156 VA', 'S<sub>s</sub> + S<sub>L</sub> = 0：功率守恆。')
      ],
      ans: '(a) I<sub>a</sub> = 56.78∠0° A，I<sub>b</sub> = 25.46∠135° A，I<sub>c</sub> = 42.75∠−155.1° A　(b) S<sub>L</sub> = 6480 − j2156 VA　(c) S<sub>s</sub> = −6480 + j2156 VA',
      note: '課本小筆誤：圖上 j5 W、10 W、−j10 W 的 W 應為 Ω；(c) 寫 S<sub>c</sub> = −V<sub>bn</sub>I<sub>c</sub>*，應為 V<sub>cn</sub>（數字是用 V<sub>cn</sub> 算的）。不先四捨五入的話 Q 是 ∓2160 VAR。',
      story: () => {
        const K = KK(), { T, g, sys3, calc, sc } = K, D = K.D;
        const base = { src: 'Y', load: 'Y', x0: 80, x1: 560, vs: ['120∠0°', '120∠−120°', '120∠120°'], z: ['j5', '10', '−j10'] };
        const up = Object.assign({}, base, { y: [124, 170, 216] });
        return [
          sc('沒有中性線的不平衡', 'NO NEUTRAL', sys3(Object.assign({}, base, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            D.chip(320, 298, 'N 點的電壓不是 0 了', '不能各相單獨用歐姆定律', 'q', { fs: 13.5, acc: true }),
            [{ sub: '平衡的電源，接三個完全不同的負載：j5、10、−j10 Ω。', on: 'src lbl line load' },
             { sub: '沒有中性線：N 點會「浮」起來，V<sub>AN</sub> 不再等於 V<sub>an</sub>。', on: 'q' },
             { sub: '只好老實解整個電路：用<b>網目分析</b>。', on: '' }]),
          sc('兩個網目', 'TWO MESHES', sys3(Object.assign({}, up, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            g('m1', '<path class="lna" style="fill:none" d="M300 129 a18 18 0 1 1 -1 0" /><path class="lna" d="M300 129 l5 -4 M300 129 l5 4"/>') + T(330, 155, 'I<sub>1</sub>', { cls: 'ta', fs: 14, a: 'start', k: 'm1t' }) +
            g('m2', '<path class="lna" style="fill:none" d="M300 175 a18 18 0 1 1 -1 0" /><path class="lna" d="M300 175 l5 -4 M300 175 l5 4"/>') + T(330, 201, 'I<sub>2</sub>', { cls: 'ta', fs: 14, a: 'start', k: 'm2t' }) +
            calc(130, 238, 380, [['(10 + j5)I<sub>1</sub> − 10I<sub>2</sub> = 120√3∠30°', 'e1', 't', 14], ['−10I<sub>1</sub> + (10 − j10)I<sub>2</sub> = 120√3∠−90°', 'e2', 't', 14]], { k: 'cc', lh: 22, a: 'middle' }),
            [{ sub: '上面的網目 I<sub>1</sub>：a → A → N → B → b → n → a。', on: 'src lbl line load m1 m1t' },
             { sub: '下面的網目 I<sub>2</sub>：b → B → N → C → c → n → b。', on: 'm2 m2t' },
             { sub: 'KVL 寫出兩條方程式（右邊剛好是線電壓）。', on: 'cc e1 e2' }]),
          sc('克拉瑪公式', "CRAMER'S RULE", calc(60, 108, 520, [['Δ = (10 + j5)(10 − j10) − (−10)(−10)', 'r1'], ['= 50 − j50 = 70.71∠−45°', 'r2'], ['I<sub>1</sub> = Δ<sub>1</sub>/Δ = 4015∠−45° ÷ 70.71∠−45° = 56.78 A', 'r3', 'ta'], ['I<sub>2</sub> = Δ<sub>2</sub>/Δ = 3023.4∠−20.1° ÷ 70.71∠−45°', 'r4'], ['= 42.75∠24.9° A', 'r5', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '係數行列式 Δ。', on: 'cc r1 r2' },
             { sub: '把右邊換進第 1 欄 → Δ<sub>1</sub> → I<sub>1</sub>。', on: 'r3' },
             { sub: '換進第 2 欄 → Δ<sub>2</sub> → I<sub>2</sub>。', on: 'r4 r5' }]),
          sc('網目電流 → 線電流', 'MESH → LINE', sys3(Object.assign({}, up, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            calc(130, 246, 380, [['I<sub>a</sub> = I<sub>1</sub>　I<sub>b</sub> = I<sub>2</sub> − I<sub>1</sub>　I<sub>c</sub> = −I<sub>2</sub>', 'r1', 't', 13.5]], { k: 'cc', lh: 24, a: 'middle' }),
            [{ sub: '線 a 上只有 I<sub>1</sub> 流過：I<sub>a</sub> = 56.78 A。', on: 'src lbl line load cc r1' },
             { sub: '線 b 被兩個網目共用（方向相反）：I<sub>b</sub> = I<sub>2</sub> − I<sub>1</sub> = 25.46∠135° A。', on: '' },
             { sub: '線 c 只有 I<sub>2</sub>，方向相反：I<sub>c</sub> = −I<sub>2</sub> = 42.75∠−155.1° A。', on: '' }]),
          sc('功率：一相一相加', 'POWER, PHASE BY PHASE', '<line class="ln" x1="360" y1="118" x2="360" y2="226"/>' +
            K.T(40, 140, '負載 S<sub>A</sub>（j5）', { cls: 'tm', fs: 12.5, a: 'start' }) + hbar(360, 140, 16120, 0.007, 'ink3', 'j16,120', 'b1') +
            K.T(40, 175, '負載 S<sub>B</sub>（10 Ω）', { cls: 'tm', fs: 12.5, a: 'start' }) + hbar(360, 175, 6480, 0.007, 'acc', '6480 W', 'b2') +
            K.T(40, 210, '負載 S<sub>C</sub>（−j10）', { cls: 'tm', fs: 12.5, a: 'start' }) + hbar(360, 210, -18276, 0.007, 'ink3', '−j18,276', 'b3') +
            calc(150, 236, 340, [['S<sub>L</sub> = 6480 − j2156 VA', 'r1', 'ta'], ['S<sub>s</sub> = −6480 + j2156 VA（守恆 ✓）', 'r2']], { k: 'cc', lh: 24, a: 'middle' }),
            [{ sub: 'A 相是純電感：只有 Q。', on: 'b1' },
             { sub: 'B 相是純電阻：只有 P = 6480 W —— 整個負載的實功率全在這。', on: 'b2' },
             { sub: 'C 相是純電容：負的 Q。', on: 'b3' },
             { sub: '加起來 S<sub>L</sub> = 6480 − j2156 VA；電源那邊算出來剛好相反。', on: 'cc r1 r2' }]),
          ansScene(['I<sub>a</sub> = 56.78∠0°、I<sub>b</sub> = 25.46∠135°、I<sub>c</sub> = 42.75∠−155.1° A', 'S<sub>L</sub> = 6480 − j2156 VA', 'S<sub>s</sub> = −6480 + j2156 VA'],
            ['(a) 線電流如上。', '(b)(c) 負載吸收 = 電源送出：功率守恆。'])
        ];
      } },
    { id: 'pp12-10', sec: '12.8', kind: 'pp', no: '12.10', title: 'Δ-Δ 不平衡負載',
      q: '求圖中不平衡三相電路的線電流，以及負載吸收的實功率。',
      en: 'Find the line currents in the unbalanced three-phase circuit of Fig. 12.26 and the real power absorbed by the load.',
      fig: F.F3({ src: 'D', load: 'D', vs: ['220∠0° V', '220∠120° V', '220∠−120° V'], z: ['−j5 Ω', 'j10 Ω', '10 Ω'] }), cap: '圖 12.26（注意：照圖上的極性，V<sub>bc</sub> = 220∠120°、V<sub>ca</sub> = 220∠−120°，是負相序）',
      hint: '沒有線路阻抗：V<sub>AB</sub> = V<sub>ab</sub>…。先算三個相電流，再 KCL。只有 10 Ω 那格吃實功率。',
      steps: [
        st('相電流。', 'I<sub>AB</sub> = 220∠0°/(−j5) = 44∠90°；I<sub>BC</sub> = 220∠120°/(j10) = 22∠30°；I<sub>CA</sub> = 220∠−120°/10 = 22∠−120° A'),
        st('KCL。', 'I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub> = 64.0∠80.1° A；I<sub>b</sub> = I<sub>BC</sub> − I<sub>AB</sub> = 38.1∠−60° A；I<sub>c</sub> = I<sub>CA</sub> − I<sub>BC</sub> = 42.5∠−135° A'),
        st('實功率只有電阻那格。', 'P = |I<sub>CA</sub>|²(10) = 22² × 10 = 4840 W = 4.84 kW')
      ],
      ans: '64∠80.1° A、38.1∠−60° A、42.5∠−135° A；P = 4.84 kW',
      note: '這題的電源照圖上的 + − 號是 V<sub>bc</sub> = 220∠120°、V<sub>ca</sub> = 220∠−120°（acb）。若誤當成 abc，會算出 27.3∠66.2° 之類的錯答案。',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('相電流 → 線電流', 'PHASE → LINE', calc(40, 108, 560, [['I<sub>AB</sub> = 220∠0° ÷ (−j5) = 44∠90° A', 'r1'], ['I<sub>BC</sub> = 220∠120° ÷ j10 = 22∠30° A', 'r2'], ['I<sub>CA</sub> = 220∠−120° ÷ 10 = 22∠−120° A', 'r3'], ['I<sub>a</sub> = 64∠80.1°　I<sub>b</sub> = 38.1∠−60°　I<sub>c</sub> = 42.5∠−135°', 'r4', 'ta'], ['P = 22² × 10 = 4840 W（只有電阻吃 P）', 'r5']], { k: 'cc', a: 'middle' }),
            [{ sub: '先看電源極性：這題 V<sub>bc</sub> 在 +120°（負相序），照圖抄。', on: 'cc r1' },
             { sub: '每格除自己的阻抗。', on: 'r2 r3' },
             { sub: '每個節點 KCL（I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>…）。', on: 'r4' },
             { sub: '電感、電容不吃平均功率：P 全在 10 Ω。', on: 'r5' }]),
          ansScene(['I<sub>a</sub> = 64∠80.1° A', 'I<sub>b</sub> = 38.1∠−60°、I<sub>c</sub> = 42.5∠−135° A', 'P = 4.84 kW'], ['答案如上。'])
        ];
      } },

    /* ═══════════ 12.9 PSpice ═══════════ */
    { id: 'ex12-11', sec: '12.9', kind: 'ex', no: '12.11', title: 'PSpice：平衡 Y-Δ',
      q: '用 PSpice 求圖中平衡 Y-Δ 電路的線電流 I<sub>aA</sub>、相電壓 V<sub>AB</sub>、相電流 I<sub>AC</sub>。電源頻率 60 Hz。',
      en: 'For the balanced Y-Δ circuit in Fig. 12.27, use PSpice to find the line current I<sub>aA</sub>, the phase voltage V<sub>AB</sub>, and the phase current I<sub>AC</sub>. Assume that the source frequency is 60 Hz.',
      fig: F.F3({ src: 'Y', load: 'D', vs: ['100∠0° V', '100∠−120° V', '100∠120° V'], zl: '1 Ω', z: '100 Ω + 0.2 H' }), cap: '圖 12.27：線路 1 Ω，Δ 負載每相 100 Ω 串 0.2 H',
      idea: 'PSpice 設定：VAC 電源設 ACMAG／ACPHASE，量電流用 IPRINT（串在線上），量兩點電壓差用 VPRINT2；AC Sweep 只算 60 Hz 一個點。下面也用手算（單相等效）對答案。',
      steps: [
        st('畫電路：三顆 VAC（100 V，0°、−120°、120°），三個 1 Ω 線路電阻，Δ 負載（R 100、L 0.2H）。', '', 'PSpice 直接吃電感值，不用自己換成 jωL。'),
        st('放 IPRINT 量 I<sub>aA</sub> 和 I<sub>AC</sub>、VPRINT2 接在 A、B 之間量 V<sub>AB</sub>；屬性 AC = yes、MAG = yes、PHASE = yes。', '', '只印大小和相角。'),
        st('Analysis → Setup → AC Sweep：Total Pts = 1，Start Freq = Final Freq = 60。', '', '只要一個頻率的穩態答案。'),
        st('模擬，輸出檔讀到：', 'I<sub>aA</sub> = 2.35∠−36.2° A，V<sub>AB</sub> = 169.9∠30.81° V，I<sub>AC</sub> = 1.357∠−66.2° A'),
        st('手算對答案：X<sub>L</sub> = 2π(60)(0.2) = 75.4 Ω，Z<sub>Δ</sub>/3 = 33.33 + j25.13 Ω。', 'I<sub>aA</sub> = 100∠0° / (1 + 33.33 + j25.13) = 100 / 42.55∠36.2° = 2.35∠−36.2° A ✓'),
        st('', 'V<sub>AB</sub> = √3 (I<sub>aA</sub> Z<sub>Δ</sub>/3)∠30° = 169.9∠30.81° V；I<sub>AB</sub> = V<sub>AB</sub>/Z<sub>Δ</sub> = 1.357∠−6.2°，I<sub>AC</sub> = −I<sub>CA</sub> = 1.357∠−66.2° A ✓', 'I<sub>AC</sub> 是從 A 流到 C，方向跟 I<sub>CA</sub> 相反，所以多一個負號（= 轉 180°）。')
      ],
      ans: 'I<sub>aA</sub> = 2.35∠−36.2° A，V<sub>AB</sub> = 169.9∠30.81° V，I<sub>AC</sub> = 1.357∠−66.2° A',
      story: () => {
        const K = KK(), { T, g, calc, sc, sys3 } = K, D = K.D;
        return [
          sc('PSpice 要的東西', 'WHAT PSPICE NEEDS', sys3({ src: 'Y', load: 'D', x0: 80, x1: 560, vs: ['100∠0°', '100∠−120°', '100∠120°'], zl: '1 Ω', z: '100 + 0.2H', k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } }) +
            D.chip(160, 300, 'VAC：ACMAG、ACPHASE', '', 'c1', { fs: 12.5 }) + D.chip(350, 300, 'IPRINT 串在線上', '', 'c2', { fs: 12.5 }) + D.chip(520, 300, 'VPRINT2 跨 A、B', '', 'c3', { fs: 12.5 }),
            [{ sub: '電源用 VAC：大小 100、相角 0、−120、120。', on: 'src lbl c1' },
             { sub: '量電流：IPRINT 像一個電流表，<b>串</b>在要量的那條線上。', on: 'line c2' },
             { sub: '量兩點之間的電壓：VPRINT2 兩隻腳夾在 A、B。', on: 'load c3' }]),
          sc('只算 60 Hz 一個點', 'AC SWEEP AT 60 Hz', calc(90, 112, 460, [['Analysis → Setup → AC Sweep', 'r1'], ['Total Pts = 1', 'r2'], ['Start Freq = 60　Final Freq = 60', 'r3'], ['輸出：I<sub>aA</sub> = 2.35∠−36.2°', 'r4', 'ta'], ['V<sub>AB</sub> = 169.9∠30.81°　I<sub>AC</sub> = 1.357∠−66.2°', 'r5', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'AC Sweep 本來是掃頻率，這裡只要一個頻率：起點 = 終點 = 60。', on: 'cc r1 r2 r3' },
             { sub: '輸出檔印出大小（IM、V）和相角（IP、VP）。', on: 'r4 r5' }]),
          sc('手算對答案', 'CHECK BY HAND', K.single({ x: 70, y: 140, w: 240, h: 120, v: '100∠0°', z: ['1', 'Z<sub>Δ</sub>/3'], i: 'I<sub>aA</sub>', k: 'ckt' }) +
            calc(340, 108, 275, [['X<sub>L</sub> = 2π·60·0.2 = 75.4 Ω', 'r1'], ['Z<sub>Δ</sub>/3 = 33.33 + j25.13', 'r2'], ['總和 = 42.55∠36.2° Ω', 'r3'], ['I<sub>aA</sub> = 2.35∠−36.2° A ✓', 'r4', 'ta'], ['V<sub>AB</sub> = 169.9∠30.81° ✓', 'r5', 'ta']], { k: 'cc' }),
            [{ sub: '電腦算的要會手算驗證：Δ 換 Y，單相等效。', on: 'ckt cc r1' },
             { sub: '每相 Z<sub>Δ</sub>/3，再串 1 Ω 線路。', on: 'r2 r3' },
             { sub: '線電流 2.35∠−36.2° A —— 跟 PSpice 一樣。', on: 'r4' },
             { sub: '再推回 V<sub>AB</sub>、I<sub>AC</sub>（= −I<sub>CA</sub>）也對得上。', on: 'r5' }]),
          ansScene(['I<sub>aA</sub> = 2.35∠−36.2° A', 'V<sub>AB</sub> = 169.9∠30.81° V', 'I<sub>AC</sub> = 1.357∠−66.2° A'], ['答案如上：PSpice 跟手算一致。'])
        ];
      } },
    { id: 'pp12-11', sec: '12.9', kind: 'pp', no: '12.11', title: 'PSpice：Y-Y，f = 100 Hz',
      q: '圖中平衡 Y-Y 電路，用 PSpice 求線電流 I<sub>bB</sub> 與相電壓 V<sub>AN</sub>。f = 100 Hz。',
      en: 'Refer to the balanced Y-Y circuit of Fig. 12.29. Use PSpice to find the line current I<sub>bB</sub> and the phase voltage V<sub>AN</sub>. Take f = 100 Hz.',
      fig: F.F3({ src: 'Y', load: 'Y', vs: ['120∠60° V', '120∠−60° V', '120∠180° V'], zl: '2 Ω + 1.6 mH', z: '10 Ω + 10 mH' }), cap: '圖 12.29',
      hint: '手算驗證：X = 2πfL。Z<sub>ℓ</sub> = 2 + j1.005，Z<sub>L</sub> = 10 + j6.283。',
      steps: [
        st('PSpice：VAC 三顆（120 V，60°、−60°、180°），IPRINT 串在 b 線，VPRINT2 跨 A、N；AC Sweep 100 Hz 一點。', ''),
        st('手算：電抗。', 'Z<sub>ℓ</sub> = 2 + j2π(100)(1.6m) = 2 + j1.005 Ω；Z<sub>L</sub> = 10 + j2π(100)(10m) = 10 + j6.283 Ω'),
        st('單相等效。', 'I<sub>aA</sub> = 120∠60° / (12 + j7.288) = 120∠60° / 14.04∠31.27° = 8.547∠28.73° A'),
        st('I<sub>bB</sub> 晚 120°。', 'I<sub>bB</sub> = 8.547∠−91.27° A'),
        st('V<sub>AN</sub> = I<sub>aA</sub> Z<sub>L</sub>。', 'V<sub>AN</sub> = 8.547∠28.73° × 11.81∠32.14° = 100.9∠60.87° V')
      ],
      ans: 'V<sub>AN</sub> = 100.9∠60.87° V，I<sub>bB</sub> = 8.547∠−91.27° A',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('手算驗證 PSpice', 'CHECK BY HAND', calc(40, 108, 560, [['X = 2πfL：1.6 mH → 1.005 Ω，10 mH → 6.283 Ω', 'r1'], ['Z<sub>ℓ</sub> + Z<sub>L</sub> = 12 + j7.288 = 14.04∠31.27° Ω', 'r2'], ['I<sub>aA</sub> = 120∠60° ÷ 14.04∠31.27° = 8.547∠28.73° A', 'r3'], ['I<sub>bB</sub> = 8.547∠−91.27° A（晚 120°）', 'r4', 'ta'], ['V<sub>AN</sub> = I<sub>aA</sub> × 11.81∠32.14° = 100.9∠60.87° V', 'r5', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'PSpice 直接吃 mH；手算要先換成電抗：X = 2πfL。', on: 'cc r1' },
             { sub: '線路＋負載串聯。', on: 'r2' },
             { sub: 'a 相電流。', on: 'r3' },
             { sub: 'b 相照相序晚 120°。', on: 'r4' },
             { sub: '負載兩端電壓 = 電流 × 負載阻抗。', on: 'r5' }]),
          ansScene(['V<sub>AN</sub> = 100.9∠60.87° V', 'I<sub>bB</sub> = 8.547∠−91.27° A'], ['答案如上。'])
        ];
      } },
    { id: 'ex12-12', sec: '12.9', kind: 'ex', no: '12.12', title: 'PSpice：不平衡 Δ-Δ',
      q: '圖中不平衡 Δ-Δ 電路，用 PSpice 求發電機電流 I<sub>ab</sub>、線電流 I<sub>bB</sub>、相電流 I<sub>BC</sub>。',
      en: 'Consider the unbalanced Δ-Δ circuit in Fig. 12.30. Use PSpice to find the generator current I<sub>ab</sub>, the line current I<sub>bB</sub>, and the phase current I<sub>BC</sub>.',
      fig: F.F3({ src: 'D', load: 'D', vs: ['208∠10° V', '208∠−110° V', '208∠130° V'], zl: '2 + j5 Ω', z: ['50 Ω', 'j30 Ω', '−j40 Ω'] }), cap: '圖 12.30：每條線 2 Ω 串 j5 Ω；負載 AB 50 Ω、BC j30 Ω、CA −j40 Ω',
      idea: 'PSpice 處理 Δ 電源的兩個麻煩：(1) 三顆電壓源接成一圈，PSpice 不接受 → 每顆串 1 μΩ；(2) 沒有接地點 → 加三個 1 MΩ 接成 Y，中心當地。題目沒給頻率、只給阻抗 → 設 ω = 1 rad/s，L = X、C = 1/X。',
      steps: [
        st('Δ 電源每相串一個 1 μΩ 電阻。', '', '一圈都是電壓源 → 環路方程式矛盾（或電流無限大），PSpice 會報錯。串一個極小電阻幾乎不影響答案。'),
        st('加三個 1 MΩ 接成 Y，中心點當 0 節點（地）。', '', 'PSpice 一定要有地；1 MΩ 很大，流過的電流可以忽略。'),
        st('頻率選 ω = 1 rad/s（f = 1/2π = 0.159155 Hz）。', 'L = X<sub>L</sub>/ω = X<sub>L</sub>，C = 1/(ωX<sub>C</sub>) = 1/X<sub>C</sub>', '例如 j5 Ω → 5 H、j30 → 30 H、−j40 → C = 0.025 F。'),
        st('AC Sweep：Total Pts = 1，Start = Final = 0.159155 Hz。輸出：', 'I<sub>ab</sub> = 5.959∠−177.2° A，I<sub>bB</sub> = 9.106∠168.5° A，I<sub>BC</sub> = 5.5∠172.5° A', '課本這一行把 I<sub>ab</sub> 印成 5.595，輸出檔和驗算都是 5.959。'),
        st('網目驗算（三個順時針迴路）。', '(54 + j10)I<sub>1</sub> − (2 + j5)I<sub>2</sub> − 50I<sub>3</sub> = 208∠10°；−(2 + j5)I<sub>1</sub> + (4 + j40)I<sub>2</sub> − j30I<sub>3</sub> = 208∠−110°；−50I<sub>1</sub> − j30I<sub>2</sub> + (50 − j10)I<sub>3</sub> = 0'),
        st('', 'I<sub>bB</sub> = −I<sub>1</sub> + I<sub>2</sub> = 9.106∠168.47° A ✓；I<sub>BC</sub> = I<sub>2</sub> − I<sub>3</sub> = 5.5∠172.46° A ✓'),
        st('發電機電流要給電源一點內阻才唯一（加 0.01 Ω、第四個迴路）。', 'I<sub>ab</sub> = −I<sub>1</sub> + I<sub>4</sub> = 5.958∠−177.18° A ✓', '三顆內阻一樣、電壓平衡 → 沒有環流，也可以直接 I<sub>ab</sub> = (I<sub>bB</sub> − I<sub>aA</sub>)/3。')
      ],
      ans: 'I<sub>ab</sub> = 5.959∠−177.2° A，I<sub>bB</sub> = 9.106∠168.5° A，I<sub>BC</sub> = 5.5∠172.5° A',
      note: '課本筆誤：「I<sub>ab</sub> = 5.595∠−177.2° A」應為 5.959（PSpice 輸出 5.959E+00，後面驗算 5.958）。',
      story: () => {
        const K = KK(), { T, g, calc, sc } = K, D = K.D;
        const tri = (cx, cy, r, key, extra) => g(key, '<path class="ln" style="fill:none" d="M' + cx + ' ' + (cy - r) + ' L' + (cx + r * 0.866) + ' ' + (cy + r / 2) + ' L' + (cx - r * 0.866) + ' ' + (cy + r / 2) + ' Z"/>' +
          [[cx + r * 0.433, cy - r / 4], [cx, cy + r / 2], [cx - r * 0.433, cy - r / 4]].map(p => K.src(p[0], p[1], 12)).join('') + (extra || ''));
        return [
          sc('麻煩一：一圈都是電壓源', 'A LOOP OF SOURCES', tri(200, 205, 90, 'tri') +
            D.chip(450, 150, 'PSpice 不接受', '三顆加起來只要差一點點，電流就無限大', 'c1', { fs: 13.5, acc: true }) +
            D.chip(450, 235, '解法：每顆串 1 μΩ', '小到不影響答案，但讓迴路有電阻', 'c2', { fs: 13.5 }),
            [{ sub: 'Δ 電源：三顆電壓源頭尾接成一圈。', on: 'tri' },
             { sub: '迴路裡只有電壓源、沒有電阻 → 電路方程式會出問題。', on: 'c1' },
             { sub: '解法：每顆串一個 <b>1 μΩ</b>。', on: 'c2' }]),
          sc('麻煩二：沒有地', 'NO GROUND NODE', tri(200, 205, 90, 'tri', '') +
            g('y', '<path class="ln dsh" style="fill:none" d="M200 115 L200 205 M' + (200 + 77.9) + ' 250 L200 205 M' + (200 - 77.9) + ' 250 L200 205"/>' + '<circle class="acc" cx="200" cy="205" r="5"/>') +
            T(214, 228, '0（地）', { cls: 'ta', fs: 13, a: 'start', k: 'gl' }) +
            D.chip(450, 190, '加三個 1 MΩ 接成 Y', '中心點當地；電阻很大，幾乎沒電流', 'c1', { fs: 13.5 }),
            [{ sub: 'PSpice 一定要有一個 0 節點，Δ 電源沒有中性點。', on: 'tri' },
             { sub: '加三個超大電阻（1 MΩ）接成 Y，中心點就是地。', on: 'y gl c1' }]),
          sc('麻煩三：只給阻抗', 'ω = 1 TRICK', calc(110, 112, 420, [['題目沒給頻率，PSpice 卻要 L、C', 'r1', 'tm'], ['設 ω = 1 rad/s（f = 0.159155 Hz）', 'r2'], ['L = X<sub>L</sub>/ω = X<sub>L</sub>：j5 → 5 H，j30 → 30 H', 'r3'], ['C = 1/(ωX<sub>C</sub>)：−j40 → 0.025 F', 'r4']], { k: 'cc', a: 'middle' }),
            [{ sub: 'PSpice 的元件要填電感、電容值，不收「j5 Ω」。', on: 'cc r1' },
             { sub: '挑一個最好算的頻率：ω = 1。', on: 'r2' },
             { sub: '這樣 L 的數字就等於電抗。', on: 'r3' },
             { sub: 'C = 1/X。', on: 'r4' }]),
          sc('結果與驗算', 'RESULTS', calc(50, 108, 540, [['I<sub>bB</sub> = 9.106∠168.5° A', 'r1', 'ta'], ['I<sub>BC</sub> = 5.5∠172.5° A', 'r2', 'ta'], ['I<sub>ab</sub> = 5.959∠−177.2° A（課本印成 5.595）', 'r3', 'ta'], ['網目分析：I<sub>bB</sub> = −I<sub>1</sub> + I<sub>2</sub>，I<sub>BC</sub> = I<sub>2</sub> − I<sub>3</sub> ✓', 'r4'], ['沒有環流時 I<sub>ab</sub> = (I<sub>bB</sub> − I<sub>aA</sub>)/3 ✓', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
            [{ sub: 'PSpice 輸出線電流、負載相電流。', on: 'cc r1 r2' },
             { sub: '發電機電流 5.959 A —— 課本把數字順序印反了。', on: 'r3' },
             { sub: '用三個網目手算驗證：對得上。', on: 'r4' },
             { sub: '發電機電流也可以這樣快速驗算。', on: 'r5' }]),
          ansScene(['I<sub>ab</sub> = 5.959∠−177.2° A', 'I<sub>bB</sub> = 9.106∠168.5° A', 'I<sub>BC</sub> = 5.5∠172.5° A'], ['答案如上。'])
        ];
      } },
    { id: 'pp12-12', sec: '12.9', kind: 'pp', no: '12.12', title: 'PSpice：不平衡 Δ-Δ（無線路阻抗）',
      q: '圖中不平衡電路，用 PSpice 求發電機電流 I<sub>ca</sub>、線電流 I<sub>cC</sub>、相電流 I<sub>AB</sub>。',
      en: 'For the unbalanced circuit in Fig. 12.32, use PSpice to find the generator current I<sub>ca</sub>, the line current I<sub>cC</sub>, and the phase current I<sub>AB</sub>.',
      fig: F.F3({ src: 'D', load: 'D', vs: ['220∠−30° V', '220∠−150° V', '220∠90° V'], z: ['10 + j10 Ω', '10 − j10 Ω', '10 Ω'] }), cap: '圖 12.32：AB 10 Ω 串 j10、BC 10 Ω 串 −j10、CA 10 Ω；沒有線路阻抗',
      hint: '沒有線路阻抗 → 負載直接吃電源電壓。發電機電流：三顆內阻一樣（PSpice 的 1 μΩ）→ 沒有環流 → I<sub>ca</sub> = (I<sub>aA</sub> − I<sub>cC</sub>)/3。',
      steps: [
        st('負載相電流。', 'I<sub>AB</sub> = 220∠−30°/(10 + j10) = 15.56∠−75° A；I<sub>BC</sub> = 220∠−150°/(10 − j10) = 15.56∠−105° A；I<sub>CA</sub> = 220∠90°/10 = 22∠90° A'),
        st('線電流。', 'I<sub>aA</sub> = I<sub>AB</sub> − I<sub>CA</sub> = 4.027 − j37.03 A；I<sub>cC</sub> = I<sub>CA</sub> − I<sub>BC</sub> = 4.027 + j37.03 = 37.25∠83.79° A'),
        st('發電機電流（從 c 流到 a）。', 'I<sub>ca</sub> = (I<sub>aA</sub> − I<sub>cC</sub>)/3 = (−j74.06)/3 = 24.68∠−90° A', '節點 a：I<sub>aA</sub> = I<sub>ca</sub> − I<sub>ab</sub>，節點 c：I<sub>cC</sub> = I<sub>bc</sub> − I<sub>ca</sub>，再用 I<sub>ab</sub> + I<sub>bc</sub> + I<sub>ca</sub> = 0（沒有環流）。')
      ],
      ans: 'I<sub>ca</sub> = 24.68∠−90° A，I<sub>cC</sub> = 37.25∠83.79° A，I<sub>AB</sub> = 15.55∠−75.01° A',
      note: '理想 Δ 電源（沒有內阻）的發電機電流其實不是唯一的（可以疊加任意環流）；PSpice 給每顆一樣的 1 μΩ，才得到課本這組答案。',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('先負載、再線、最後發電機', 'LOAD → LINE → SOURCE', calc(30, 108, 580, [['I<sub>AB</sub> = 220∠−30° ÷ (10 + j10) = 15.56∠−75° A', 'r1', 'ta'], ['I<sub>CA</sub> = 22∠90°，I<sub>BC</sub> = 15.56∠−105° A', 'r2'], ['I<sub>cC</sub> = I<sub>CA</sub> − I<sub>BC</sub> = 37.25∠83.79° A', 'r3', 'ta'], ['沒有環流：I<sub>ca</sub> = (I<sub>aA</sub> − I<sub>cC</sub>)/3', 'r4'], ['= 24.68∠−90° A', 'r5', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '沒有線路阻抗：每格負載直接吃電源電壓。', on: 'cc r1' },
             { sub: '另外兩格。', on: 'r2' },
             { sub: '節點 C 的 KCL 得到線電流。', on: 'r3' },
             { sub: '三顆電源內阻一樣（PSpice 的 1 μΩ）→ 電流平均分攤、沒有繞圈的環流。', on: 'r4 r5' }]),
          ansScene(['I<sub>ca</sub> = 24.68∠−90° A', 'I<sub>cC</sub> = 37.25∠83.79° A', 'I<sub>AB</sub> = 15.56∠−75° A'], ['答案如上。'])
        ];
      } },

    /* ═══════════ 12.10 三相功率量測 ═══════════ */
    { id: 'ex12-13', sec: '12.10', kind: 'ex', no: '12.13', title: '三瓦特計法',
      q: '三個瓦特計 W<sub>1</sub>、W<sub>2</sub>、W<sub>3</sub> 分別接在 a、b、c 相，量 Example 12.9 不平衡 Y 負載吸收的總功率。(a) 預測三個讀數 (b) 求總功率。',
      en: 'Three wattmeters W<sub>1</sub>, W<sub>2</sub>, and W<sub>3</sub> are connected, respectively, to phases a, b, and c to measure the total power absorbed by the unbalanced wye-connected load in Example 12.9 (see Fig. 12.23). (a) Predict the wattmeter readings. (b) Find the total power absorbed.',
      fig: figW3(), cap: '圖 12.36：電流線圈串在各線上，電壓線圈接到中性點',
      idea: '每個瓦特計讀 P = Re(V I*) = |V||I|cos(θ<sub>V</sub> − θ<sub>I</sub>)，V 是它電壓線圈兩端的電壓、I 是流過電流線圈的電流。電壓和電流沿用 Example 12.9。',
      steps: [
        st('沿用 Example 12.9。', 'V<sub>AN</sub> = 100∠0°、V<sub>BN</sub> = 100∠120°、V<sub>CN</sub> = 100∠−120° V；I<sub>a</sub> = 6.67∠0°、I<sub>b</sub> = 8.94∠93.44°、I<sub>c</sub> = 10∠−66.87° A'),
        st('W<sub>1</sub>。', 'P<sub>1</sub> = 100 × 6.67 × cos(0° − 0°) = 667 W'),
        st('W<sub>2</sub>。', 'P<sub>2</sub> = 100 × 8.94 × cos(120° − 93.44°) = 800 W'),
        st('W<sub>3</sub>。', 'P<sub>3</sub> = 100 × 10 × cos(−120° + 66.87°) = 600 W'),
        st('(b) 總功率 = 三個讀數相加。', 'P<sub>T</sub> = 667 + 800 + 600 = 2067 W'),
        st('驗算：只有電阻吃實功率。', 'P<sub>T</sub> = 6.67²(15) + 8.94²(10) + 10²(6) = 667 + 800 + 600 = 2067 W ✓')
      ],
      ans: '(a) 667 W、800 W、600 W　(b) 2067 W',
      story: () => {
        const K = KK(), { T, g, calc, sc } = K, D = K.D;
        return [
          sc('三個瓦特計各管一相', 'ONE METER PER PHASE', g('ms', [130, 190, 250].map((y, i) => '<rect class="bgw" x="190" y="' + (y - 16) + '" width="60" height="32" rx="6"/>' + T(220, y + 5, 'W' + (i + 1), { fs: 14 }) + '<path class="ln" d="M90 ' + y + ' H190 M250 ' + y + ' H440"/>').join('')) +
            g('zs', [['15 Ω', 130], ['10 + j5', 190], ['6 − j8', 250]].map(z => '<rect class="bgw" x="440" y="' + (z[1] - 9) + '" width="44" height="18" rx="3"/>' + T(462, z[1] - 16, z[0], { cls: 'tm', fs: 12 })).join('') + '<path class="ln" d="M484 130 V250"/>' + T(494, 195, 'N', { fs: 13, a: 'start' })) +
            D.chip(320, 300, '電壓線圈都接到中性點 N', '量到的就是各相的相電壓', 'c', { fs: 13.5 }),
            [{ sub: '三條線各串一個瓦特計（電流線圈）。', on: 'ms' },
             { sub: '接 Example 12.9 的不平衡 Y 負載。', on: 'zs' },
             { sub: '電壓線圈的另一端都接中性點：每個瓦特計看到的是自己那一相。', on: 'c' }]),
          sc('每個讀 V I cos', 'READ Re(VI*)', calc(40, 108, 560, [['P = |V||I| cos(θ<sub>V</sub> − θ<sub>I</sub>)', 'r1', 'tm'], ['P<sub>1</sub> = 100 × 6.67 × cos(0° − 0°) = 667 W', 'r2'], ['P<sub>2</sub> = 100 × 8.94 × cos(120° − 93.44°) = 800 W', 'r3'], ['P<sub>3</sub> = 100 × 10 × cos(−120° + 66.87°) = 600 W', 'r4'], ['P<sub>T</sub> = 667 + 800 + 600 = 2067 W', 'r5', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '瓦特計讀的是實功率：電壓 × 電流 × 兩者夾角的 cos。', on: 'cc r1' },
             { sub: 'W<sub>1</sub>：純電阻，夾角 0。', on: 'r2' },
             { sub: 'W<sub>2</sub>、W<sub>3</sub>。', on: 'r3 r4' },
             { sub: '總功率 = 三個相加。', on: 'r5' }]),
          sc('驗算：只有電阻吃 P', 'CHECK', calc(60, 120, 520, [['15 Ω：6.67² × 15 = 667 W', 'r1'], ['10 Ω：8.94² × 10 = 800 W', 'r2'], ['6 Ω：10² × 6 = 600 W', 'r3'], ['一模一樣 ✓', 'r4', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '換個方法：電感、電容不吃平均功率，只要算電阻的 I²R。', on: 'cc r1' },
             { sub: '三個電阻各自算。', on: 'r2 r3' },
             { sub: '跟瓦特計讀數完全一樣。', on: 'r4' }]),
          ansScene(['P<sub>1</sub> = 667 W、P<sub>2</sub> = 800 W、P<sub>3</sub> = 600 W', 'P<sub>T</sub> = 2067 W'], ['答案如上。'])
        ];
      } },
    { id: 'pp12-13', sec: '12.10', kind: 'pp', no: '12.13', title: '把參考點接到 B',
      q: '對 Practice Problem 12.9 的電路（圖 12.24）重做 Example 12.13。提示：把圖 12.33 的參考點 o 接到 B。',
      en: 'Repeat Example 12.13 for the network in Fig. 12.24 (see Practice Prob. 12.9). Hint: Connect the reference point o in Fig. 12.33 to point B.',
      hint: 'o 接到 B → W<sub>2</sub> 的電壓線圈兩端都是 B，讀 0。P<sub>1</sub> = Re(V<sub>AB</sub>I<sub>a</sub>*)，P<sub>3</sub> = Re(V<sub>CB</sub>I<sub>c</sub>*)。',
      steps: [
        st('W<sub>2</sub> 電壓線圈兩端同一點。', 'P<sub>2</sub> = 0'),
        st('W<sub>1</sub>：V<sub>AB</sub> = 440∠0°，I<sub>a</sub> = 39.71∠−41.07° A。', 'P<sub>1</sub> = 440 × 39.71 × cos(41.07°) = 13.17 kW'),
        st('W<sub>3</sub>：V<sub>CB</sub> = −V<sub>BC</sub> = 440∠60°，I<sub>c</sub> = 70.13∠74.27° A。', 'P<sub>3</sub> = 440 × 70.13 × cos(60° − 74.27°) = 29.90 kW'),
        st('總和；驗算 I²R。', 'P<sub>T</sub> = 13.17 + 0 + 29.90 = 43.08 kW；39.36²(10) + 27.5²(16) + 44²(8) = 43.08 kW ✓')
      ],
      ans: '(a) 13.175 kW、0 W、29.91 kW　(b) 43.08 kW',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('o 接 B：少一個瓦特計', 'TWO METERS ENOUGH', calc(40, 108, 560, [['W<sub>2</sub> 電壓線圈兩端都是 B → P<sub>2</sub> = 0', 'r1'], ['P<sub>1</sub> = |V<sub>AB</sub>||I<sub>a</sub>| cos(0° + 41.07°) = 13.17 kW', 'r2'], ['P<sub>3</sub> = |V<sub>CB</sub>||I<sub>c</sub>| cos(60° − 74.27°) = 29.90 kW', 'r3'], ['P<sub>T</sub> = 43.08 kW', 'r4', 'ta'], ['驗算 I²R：39.36²·10 + 27.5²·16 + 44²·8 = 43.08 kW ✓', 'r5', 'tm']], { k: 'cc', a: 'middle' }),
            [{ sub: '參考點 o 選在 B：W<sub>2</sub> 量到 0 V，等於不用裝 —— 這就是兩瓦特計法的由來。', on: 'cc r1' },
             { sub: 'W<sub>1</sub> 看線電壓 V<sub>AB</sub> 和 I<sub>a</sub>。', on: 'r2' },
             { sub: 'W<sub>3</sub> 看 V<sub>CB</sub> = 440∠60° 和 I<sub>c</sub>。', on: 'r3' },
             { sub: '相加。', on: 'r4' },
             { sub: '用電阻 I²R 驗算一樣。', on: 'r5' }]),
          ansScene(['P<sub>1</sub> = 13.17 kW、P<sub>2</sub> = 0、P<sub>3</sub> = 29.90 kW', 'P<sub>T</sub> = 43.08 kW'], ['答案如上。'])
        ];
      } },
    { id: 'ex12-14', sec: '12.10', kind: 'ex', no: '12.14', title: '由兩瓦特計讀數反推負載',
      q: '兩瓦特計法接在 Δ 接負載上，讀數 P<sub>1</sub> = 1560 W、P<sub>2</sub> = 2100 W。線電壓 220 V。求 (a) 每相平均功率 (b) 每相虛功率 (c) 功率因數 (d) 每相阻抗。',
      en: 'The two-wattmeter method produces wattmeter readings P<sub>1</sub> = 1560 W and P<sub>2</sub> = 2100 W when connected to a delta-connected load. If the line voltage is 220 V, calculate: (a) the per-phase average power, (b) the per-phase reactive power, (c) the power factor, and (d) the phase impedance.',
      fig: fig2W('Δ 接'), cap: '兩瓦特計法',
      idea: 'P<sub>T</sub> = P<sub>1</sub> + P<sub>2</sub>，Q<sub>T</sub> = √3(P<sub>2</sub> − P<sub>1</sub>)，tan θ = Q<sub>T</sub>/P<sub>T</sub>。Δ 負載的相電壓 = 線電壓。',
      steps: [
        st('(a) 總實功率，再除 3。', 'P<sub>T</sub> = 1560 + 2100 = 3660 W → P<sub>p</sub> = 1220 W'),
        st('(b) 總虛功率，再除 3。', 'Q<sub>T</sub> = √3(2100 − 1560) = 935.3 VAR → Q<sub>p</sub> = 311.77 VAR'),
        st('(c) 功率角。', 'θ = tan<sup>−1</sup>(935.3/3660) = 14.33° → pf = cos θ = 0.9689 落後', 'P<sub>2</sub> &gt; P<sub>1</sub> → Q &gt; 0 → 電感性、落後。'),
        st('(d) Δ 負載：V<sub>p</sub> = V<sub>L</sub> = 220 V；由 P<sub>p</sub> = V<sub>p</sub>I<sub>p</sub> cos θ 求 I<sub>p</sub>。', 'I<sub>p</sub> = 1220 / (220 × 0.9689) = 5.723 A'),
        st('', 'Z<sub>p</sub> = V<sub>p</sub>/I<sub>p</sub> = 220/5.723 = 38.44 Ω → Z<sub>p</sub> = 38.44∠14.33° Ω', '阻抗角 = 功因角。')
      ],
      ans: '(a) 1220 W　(b) 311.77 VAR　(c) 0.9689 落後　(d) 38.44∠14.33° Ω',
      story: () => {
        const K = KK(), { T, g, calc, sc } = K;
        const bar = (x, v, lbl, cls, key) => g(key, '<rect class="' + cls + '" x="' + x + '" y="' + (280 - v * 0.04).toFixed(1) + '" width="54" height="' + (v * 0.04).toFixed(1) + '" rx="4"/>' + T(x + 27, 272 - v * 0.04, String(v) + ' W', { cls: 't', fs: 13 }) + T(x + 27, 298, lbl, { cls: 'tm', fs: 13 }));
        return [
          sc('兩個讀數', 'TWO READINGS', bar(90, 1560, 'P<sub>1</sub>', 'ink3', 'b1') + bar(170, 2100, 'P<sub>2</sub>', 'acc', 'b2') + bar(250, 3660, 'P<sub>1</sub> + P<sub>2</sub>', 'ink2', 'b3') + '<line class="ln" x1="70" y1="280" x2="330" y2="280"/>' +
            calc(360, 118, 255, [['P<sub>T</sub> = P<sub>1</sub> + P<sub>2</sub> = 3660 W', 'r1'], ['Q<sub>T</sub> = √3 (P<sub>2</sub> − P<sub>1</sub>)', 'r2'], ['= √3 × 540 = 935.3 VAR', 'r3', 'ta'], ['P<sub>2</sub> &gt; P<sub>1</sub> → 電感性', 'r4', 'tm']], { k: 'cc' }),
            [{ sub: '兩瓦特計讀數：1560 W、2100 W。', on: 'b1 b2' },
             { sub: '加起來就是總實功率 3660 W（不管平不平衡）。', on: 'b3 cc r1' },
             { sub: '相減乘 √3 是總虛功率（平衡負載才成立）。', on: 'r2 r3' },
             { sub: 'P<sub>2</sub> 比較大 → Q 是正的 → 電感性。', on: 'r4' }]),
          sc('功因角與每相', 'ANGLE AND PER PHASE', K.tri(80, 280, 3660, 935.3, 0.05, { kp: 'p', kq: 'q', ks: 's', lp: '3660 W', lq: '935.3 VAR' }) +
            calc(350, 112, 265, [['θ = tan<sup>−1</sup>(935.3/3660) = 14.33°', 'r1'], ['pf = 0.9689 落後', 'r2', 'ta'], ['P<sub>p</sub> = 3660/3 = 1220 W', 'r3'], ['Q<sub>p</sub> = 935.3/3 = 311.77 VAR', 'r4']], { k: 'cc' }),
            [{ sub: '畫成功率三角形：底 3660、高 935.3。', on: 'p q s' },
             { sub: '角度 14.33°，pf = 0.9689。', on: 'cc r1 r2' },
             { sub: '平衡負載：每相是總數的三分之一。', on: 'r3 r4' }]),
          sc('每相阻抗', 'PHASE IMPEDANCE', calc(100, 112, 440, [['Δ 負載：V<sub>p</sub> = V<sub>L</sub> = 220 V', 'r1', 'tm'], ['P<sub>p</sub> = V<sub>p</sub> I<sub>p</sub> cos θ → I<sub>p</sub> = 1220/(220 × 0.9689)', 'r2'], ['I<sub>p</sub> = 5.723 A', 'r3'], ['|Z<sub>p</sub>| = 220/5.723 = 38.44 Ω', 'r4'], ['Z<sub>p</sub> = 38.44∠14.33° Ω', 'r5', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'Δ 接：每相兩端就是線電壓 220 V。', on: 'cc r1' },
             { sub: '用每相功率反推每相電流。', on: 'r2 r3' },
             { sub: '阻抗大小 = 電壓 ÷ 電流。', on: 'r4' },
             { sub: '阻抗角 = 功因角 14.33°。', on: 'r5' }]),
          ansScene(['P<sub>p</sub> = 1220 W　Q<sub>p</sub> = 311.77 VAR', 'pf = 0.9689 落後', 'Z<sub>p</sub> = 38.44∠14.33° Ω'], ['答案如上。'])
        ];
      } },
    { id: 'pp12-14', sec: '12.10', kind: 'pp', no: '12.14', title: '有一個瓦特計讀負的',
      q: '圖 12.35 的平衡系統，V<sub>L</sub> = 208 V，瓦特計讀數 P<sub>1</sub> = −560 W、P<sub>2</sub> = 800 W。求 (a) 總平均功率 (b) 總虛功率 (c) 功率因數 (d) 每相阻抗。阻抗是電感性還是電容性？',
      en: 'Let the line voltage V<sub>L</sub> = 208 V and the wattmeter readings of the balanced system in Fig. 12.35 be P<sub>1</sub> = −560 W and P<sub>2</sub> = 800 W. Determine: (a) the total average power, (b) the total reactive power, (c) the power factor, (d) the phase impedance. Is the impedance inductive or capacitive?',
      fig: fig2W('Y 接 Z_Y'), cap: '圖 12.35（Y 接負載）',
      hint: 'P<sub>T</sub> = P<sub>1</sub> + P<sub>2</sub>（P<sub>1</sub> 帶負號），Q<sub>T</sub> = √3(P<sub>2</sub> − P<sub>1</sub>)。Y 負載：I<sub>p</sub> = I<sub>L</sub> = |S|/(√3V<sub>L</sub>)，Z = V<sub>p</sub>/I<sub>p</sub>。',
      steps: [
        st('(a)', 'P<sub>T</sub> = −560 + 800 = 240 W'),
        st('(b)', 'Q<sub>T</sub> = √3(800 + 560) = 2355.6 VAR = 2.356 kVAR'),
        st('(c)', 'θ = tan<sup>−1</sup>(2355.6/240) = 84.18° → pf = 0.1014'),
        st('(d) |S| = √(240² + 2355.6²) = 2367.8 VA；Y 接 I<sub>p</sub> = I<sub>L</sub> = 2367.8/(√3 × 208) = 6.572 A。', 'Z<sub>p</sub> = (208/√3)/6.572 = 18.27∠84.18° Ω', 'P<sub>2</sub> &gt; P<sub>1</sub> → 電感性。')
      ],
      ans: '(a) 240 W　(b) 2.356 kVAR　(c) 0.1014　(d) 18.25∠84.18° Ω，電感性',
      note: '不先四捨五入是 18.27∠84.18° Ω；課本 18.25 是中間值四捨五入的結果。θ &gt; 60° 時 P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ + 30°) 會變負：瓦特計反打不是接錯。',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('負的讀數也要照加', 'NEGATIVE READING', calc(50, 108, 540, [['P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub> cos(θ + 30°)：θ &gt; 60° 就變負', 'r1', 'tm'], ['P<sub>T</sub> = −560 + 800 = 240 W', 'r2'], ['Q<sub>T</sub> = √3 (800 − (−560)) = 2356 VAR', 'r3'], ['θ = tan<sup>−1</sup>(2356/240) = 84.18°，pf = 0.1014', 'r4', 'ta'], ['Z<sub>p</sub> = 120.1 V ÷ 6.572 A = 18.27∠84.18° Ω（電感性）', 'r5']], { k: 'cc', a: 'middle' }),
            [{ sub: 'P<sub>1</sub> 是負的不是接錯：負載角超過 60° 就會這樣。', on: 'cc r1' },
             { sub: '照樣代數相加。', on: 'r2' },
             { sub: '減法也是：800 − (−560) = 1360。', on: 'r3' },
             { sub: '幾乎是純電感（84°）：pf 只有 0.1。', on: 'r4' },
             { sub: 'Y 接：相電壓 208/√3，相電流 = 線電流。', on: 'r5' }]),
          ansScene(['P<sub>T</sub> = 240 W　Q<sub>T</sub> = 2.356 kVAR', 'pf = 0.1014', 'Z<sub>p</sub> ≈ 18.25∠84.18° Ω，電感性'], ['答案如上。'])
        ];
      } },
    { id: 'ex12-15', sec: '12.10', kind: 'ex', no: '12.15', title: '預測兩瓦特計讀數',
      q: '圖 12.35 的三相平衡負載每相 Z<sub>Y</sub> = 8 + j6 Ω，接在 208 V 線上。預測瓦特計 W<sub>1</sub>、W<sub>2</sub> 的讀數，並求 P<sub>T</sub>、Q<sub>T</sub>。',
      en: 'The three-phase balanced load in Fig. 12.35 has impedance per phase of Z<sub>Y</sub> = 8 + j6 Ω. If the load is connected to 208-V lines, predict the readings of the wattmeters W<sub>1</sub> and W<sub>2</sub>. Find P<sub>T</sub> and Q<sub>T</sub>.',
      fig: fig2W('Z_Y = 8 + j6 Ω'), cap: '圖 12.35',
      idea: 'P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub> cos(θ + 30°)、P<sub>2</sub> = V<sub>L</sub>I<sub>L</sub> cos(θ − 30°)，θ 是負載阻抗角。',
      steps: [
        st('阻抗角。', 'Z<sub>Y</sub> = 8 + j6 = 10∠36.87° Ω → θ = 36.87°'),
        st('線電流（Y：I<sub>L</sub> = V<sub>p</sub>/|Z<sub>Y</sub>|）。', 'I<sub>L</sub> = (208/√3)/10 = 12 A'),
        st('W<sub>1</sub>。', 'P<sub>1</sub> = 208 × 12 × cos(36.87° + 30°) = 980.48 W'),
        st('W<sub>2</sub>。', 'P<sub>2</sub> = 208 × 12 × cos(36.87° − 30°) = 2478.1 W', 'P<sub>2</sub> &gt; P<sub>1</sub> → 電感性（跟 +j6 一致）。'),
        st('總和與虛功率。', 'P<sub>T</sub> = 3.459 kW，Q<sub>T</sub> = √3(1497.6) = 2.594 kVAR')
      ],
      ans: 'W<sub>1</sub> = 980.48 W，W<sub>2</sub> = 2478.1 W，P<sub>T</sub> = 3.459 kW，Q<sub>T</sub> = 2.594 kVAR',
      story: () => {
        const K = KK(), { T, g, calc, sc } = K;
        return [
          sc('先拿 θ 和 I<sub>L</sub>', 'θ AND I<sub>L</sub>', calc(100, 120, 440, [['Z<sub>Y</sub> = 8 + j6 = 10∠36.87° Ω → θ = 36.87°', 'r1'], ['V<sub>p</sub> = 208/√3 = 120.1 V', 'r2'], ['I<sub>L</sub> = 120.1/10 = 12 A', 'r3', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: '負載角 θ 就是阻抗角。', on: 'cc r1' },
             { sub: 'Y 接：每相吃 208/√3。', on: 'r2' },
             { sub: '線電流 12 A。', on: 'r3' }]),
          sc('θ ± 30°', 'θ ± 30°', calc(60, 112, 520, [['P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub> cos(θ + 30°) = 2496 cos 66.87° = 980.48 W', 'r1'], ['P<sub>2</sub> = V<sub>L</sub>I<sub>L</sub> cos(θ − 30°) = 2496 cos 6.87° = 2478.1 W', 'r2'], ['P<sub>T</sub> = 3.459 kW', 'r3', 'ta'], ['Q<sub>T</sub> = √3 (2478.1 − 980.48) = 2.594 kVAR', 'r4', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'W<sub>1</sub> 看 V<sub>ab</sub> 和 I<sub>a</sub>：夾角 θ + 30°。', on: 'cc r1' },
             { sub: 'W<sub>2</sub> 看 V<sub>cb</sub> 和 I<sub>c</sub>：夾角 θ − 30°。', on: 'r2' },
             { sub: '相加 = 總實功率。', on: 'r3' },
             { sub: '相減 × √3 = 總虛功率。', on: 'r4' }]),
          ansScene(['W<sub>1</sub> = 980.48 W　W<sub>2</sub> = 2478.1 W', 'P<sub>T</sub> = 3.459 kW　Q<sub>T</sub> = 2.594 kVAR'], ['答案如上。'])
        ];
      } },
    { id: 'pp12-15', sec: '12.10', kind: 'pp', no: '12.15', title: 'Δ 接、電容性負載',
      q: '若圖 12.35 的負載改成 Δ 接，每相 Z<sub>p</sub> = 30 − j40 Ω，V<sub>L</sub> = 440 V。預測 W<sub>1</sub>、W<sub>2</sub> 讀數，並求 P<sub>T</sub>、Q<sub>T</sub>。',
      en: 'If the load in Fig. 12.35 is delta-connected with impedance per phase of Z<sub>p</sub> = 30 − j40 Ω and V<sub>L</sub> = 440 V, predict the readings of the wattmeters W<sub>1</sub> and W<sub>2</sub>. Calculate P<sub>T</sub> and Q<sub>T</sub>.',
      hint: 'Δ：I<sub>p</sub> = V<sub>L</sub>/|Z<sub>p</sub>|，I<sub>L</sub> = √3 I<sub>p</sub>。θ = −53.13°（電容性）。',
      steps: [
        st('相電流、線電流。', '|Z<sub>p</sub>| = 50 Ω，I<sub>p</sub> = 440/50 = 8.8 A，I<sub>L</sub> = √3(8.8) = 15.24 A'),
        st('θ = −53.13°。', 'P<sub>1</sub> = 440 × 15.24 × cos(−23.13°) = 6.167 kW；P<sub>2</sub> = 440 × 15.24 × cos(−83.13°) = 0.8021 kW'),
        st('總和。', 'P<sub>T</sub> = 6.969 kW，Q<sub>T</sub> = √3(0.8021 − 6.167) = −9.292 kVAR', 'P<sub>1</sub> &gt; P<sub>2</sub> → 電容性，Q 是負的。')
      ],
      ans: 'W<sub>1</sub> = 6.167 kW，W<sub>2</sub> = 0.8021 kW，P<sub>T</sub> = 6.969 kW，Q<sub>T</sub> = −9.292 kVAR',
      story: () => {
        const K = KK(), { calc, sc } = K;
        return [
          sc('電容性：P<sub>1</sub> 比較大', 'CAPACITIVE', calc(50, 108, 540, [['Δ：I<sub>p</sub> = 440/50 = 8.8 A，I<sub>L</sub> = 15.24 A', 'r1'], ['θ = −53.13°（−j40 電容性）', 'r2'], ['P<sub>1</sub> = 6704 cos(−23.13°) = 6.167 kW', 'r3'], ['P<sub>2</sub> = 6704 cos(−83.13°) = 0.802 kW', 'r4'], ['P<sub>T</sub> = 6.969 kW　Q<sub>T</sub> = −9.292 kVAR', 'r5', 'ta']], { k: 'cc', a: 'middle' }),
            [{ sub: 'Δ 接：相電流 × √3 = 線電流。', on: 'cc r1' },
             { sub: '阻抗角是負的：電容性。', on: 'r2' },
             { sub: 'θ + 30° = −23.13°。', on: 'r3' },
             { sub: 'θ − 30° = −83.13°：讀數很小。', on: 'r4' },
             { sub: 'P<sub>1</sub> &gt; P<sub>2</sub> → Q 是負的（電容性）。', on: 'r5' }]),
          ansScene(['W<sub>1</sub> = 6.167 kW　W<sub>2</sub> = 0.8021 kW', 'P<sub>T</sub> = 6.969 kW　Q<sub>T</sub> = −9.292 kVAR'], ['答案如上。'])
        ];
      } }
  ];

  window.__CH12EX = window.__CH12EX || { book: 'Alexander & Sadiku', items: [] };
  window.__CH12EX.items = window.__CH12EX.items.concat(items);
})();
