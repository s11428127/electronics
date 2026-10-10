/* ============================================================
   電路學 CH12 課本例題與練習題（上半：12.2～12.6，Example 12.1–12.5、Practice 12.1–12.5）
   課本：Alexander & Sadiku, Fundamentals of Electric Circuits, Ch.12 Three-Phase Circuits
   - Example：照課本解法拆成「做什麼 + 算式 + 為什麼」；Practice：課本只給答案，詳解自己解（數值用程式驗算過）
   - 每一題都有 story：「🎬 圖解故事」把解題過程畫成一格一格的電路圖、相量圖（按了才畫）
   - 電路圖用 shared/schem.js 重畫；故事的畫圖工具在 ch12-kit.js（__K12）
   下半（12.7～12.10）在 ch12-ex2.js，兩支都塞進 window.__CH12EX.items
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const w = S.w, B = (x1, y, x2) => w(x1 + ',' + y, x2 + ',' + y);

  /* ---------------- 靜態電路圖（題目圖） ---------------- */
  /* 水平電壓源：+ 在右 */
  const hs = (x, y, lbl) => '<circle cx="' + x + '" cy="' + y + '" r="13" fill="none"/>' + S.t(x - 6, y + 4, '−', 'middle', ' font-size="11"') + S.t(x + 6, y + 4, '+', 'middle', ' font-size="11"') +
    (lbl ? S.t(x, y - 18, lbl) : '');
  /* 三相系統：o = { src:'Y'|'D', load:'Y'|'D', vs:[3], zl, z:[3] 或字串, n, W } */
  function F3(o) {
    const y = [40, 100, 160], x0 = o.src === 'D' ? 110 : 52, W = o.W || 480, x1 = W - 40;
    const xs = x0 + (o.src === 'D' ? 70 : 76), xl = o.load === 'D' ? x1 - 120 : x1 - 104;
    const z = Array.isArray(o.z) ? o.z : [o.z, o.z, o.z];
    const p = [];
    if (o.src !== 'D') {
      p.push(w(x0 + ',' + y[0], x0 + ',' + y[2]));
      y.forEach((yy, i) => { p.push(B(x0, yy, x0 + 24), hs(x0 + 37, yy, o.vs[i]), B(x0 + 50, yy, xs)); });
      p.push(S.t(x0 - 8, 104, 'n', 'end'));
    } else {
      p.push(S.vs(x0 + 40, y[0], y[1], o.vs[0], { side: 'r' }), S.vs(x0 + 40, y[1], y[2], o.vs[1], { side: 'r' }), S.vs(x0, y[0], y[2], o.vs[2], { flip: true }),
        B(x0, y[0], xs), B(x0 + 40, y[1], xs), B(x0, y[2], xs), S.dot(x0 + 40, y[0]), S.dot(x0 + 40, y[2]));
    }
    y.forEach((yy, i) => {
      p.push(o.zl ? S.z(xs, yy, xl, yy, i === 0 ? o.zl : '') : B(xs, yy, xl));
      p.push(S.t(xs + 2, yy - 5, 'abc'[i], 'start', ' font-size="10.5"'), S.t(xl - 2, yy - 5, 'ABC'[i], 'end', ' font-size="10.5"'));
    });
    if (o.load !== 'D') {
      y.forEach((yy, i) => p.push(S.z(xl, yy, x1, yy, z[i])));
      p.push(w(x1 + ',' + y[0], x1 + ',' + y[2]), S.t(x1 + 8, 104, 'N', 'start'));
      if (o.n) p.push(w(x0 + ',' + y[2], x0 + ',190', x1 + ',190', x1 + ',' + y[2]), S.t((x0 + x1) / 2, 186, '中性線'));
    } else {
      const xa = xl + 50;
      p.push(B(xl, y[0], x1), B(xl, y[1], xa), B(xl, y[2], x1), S.dot(xa, y[0]), S.dot(xa, y[1]), S.dot(xa, y[2]), S.dot(x1, y[0]), S.dot(x1, y[2]),
        S.z(xa, y[0], xa, y[1], z[0], { side: 'l' }), S.z(xa, y[1], xa, y[2], z[1], { side: 'l' }), S.z(x1, y[0], x1, y[2], z[2]));
    }
    return S.svg(W + (o.load === 'D' ? 70 : 20), o.n ? 205 : 185, p);
  }
  /* 靜態相量圖：vs = [[角度, 標籤]] */
  function FP(vs, R) {
    R = R || 70; const cx = 150, cy = 95;
    let p = [w((cx - R - 15) + ',' + cy, (cx + R + 15) + ',' + cy), w(cx + ',' + (cy - R - 15), cx + ',' + (cy + R + 15))];
    vs.forEach(v => {
      const a = v[0] * Math.PI / 180, x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);
      const h1 = [x - 9 * Math.cos(a - 0.4), y + 9 * Math.sin(a - 0.4)], h2 = [x - 9 * Math.cos(a + 0.4), y + 9 * Math.sin(a + 0.4)];
      p.push('<line x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="var(--accent)" stroke-width="2"/>' +
        '<polyline points="' + h1.map(n => n.toFixed(1)).join(',') + ' ' + x.toFixed(1) + ',' + y.toFixed(1) + ' ' + h2.map(n => n.toFixed(1)).join(',') + '" stroke="var(--accent)" stroke-width="2"/>');
      p.push(S.t(cx + (R + 22) * Math.cos(a), cy - (R + 22) * Math.sin(a) + 4, v[1], Math.cos(a) > 0.3 ? 'start' : Math.cos(a) < -0.3 ? 'end' : 'middle'));
    });
    return S.svg(300, 190, p);
  }

  const st = (t, eq, why) => ({ t, eq, why });
  const KK = () => window.__K12;
  /* 故事最後一幕：答案卡，一行一行亮 */
  function ansScene(rows, subs, y) {
    const K = KK();
    const svg = K.calc(110, y || 112, 420, rows.map((r, i) => [r, 'a' + i, i === 0 ? 'ta' : 't', i === 0 ? 16 : 15]), { title: '答案　ANSWER', a: 'middle', k: 'ans' });
    return K.sc('答案', 'ANSWER', svg, subs.map((s, i) => ({ sub: s, on: (i === 0 ? 'ans ' : '') + 'a' + i + (i === subs.length - 1 && rows.length > subs.length ? ' ' + rows.slice(subs.length).map((_, j) => 'a' + (subs.length + j)).join(' ') : '') })));
  }

  const items = [
    /* ═══════════ 12.2 平衡三相電壓 ═══════════ */
    { id: 'ex12-1', sec: '12.2', kind: 'ex', no: '12.1', title: '判斷相序',
      q: '判斷下列這組電壓的相序：v<sub>an</sub> = 200 cos(ωt + 10°)、v<sub>bn</sub> = 200 cos(ωt − 230°)、v<sub>cn</sub> = 200 cos(ωt − 110°)。',
      en: 'Determine the phase sequence of the set of voltages v<sub>an</sub> = 200 cos(ωt + 10°), v<sub>bn</sub> = 200 cos(ωt − 230°), v<sub>cn</sub> = 200 cos(ωt − 110°).',
      fig: FP([[10, 'V_an 10°'], [130, 'V_bn −230° = 130°'], [-110, 'V_cn −110°']]), cap: '三個相量（−230° 跟 130° 是同一個方向）',
      idea: '相序 = 誰先到最大值。換成相量後看角度：角度越大的越「領先」。從 V<sub>an</sub> 開始，往順時針（越來越晚）數下去遇到誰。',
      steps: [
        st('換成相量。', 'V<sub>an</sub> = 200∠10°、V<sub>bn</sub> = 200∠−230°、V<sub>cn</sub> = 200∠−110° V', 'cos 裡面的相角直接就是相量的角度。'),
        st('把 −230° 換成同一個方向的角度。', '−230° + 360° = 130°　→　V<sub>bn</sub> = 200∠130°', '加減 360° 是同一個方向，這樣比較好比大小。'),
        st('比角度。', 'V<sub>an</sub>（10°）比 V<sub>cn</sub>（−110°）早 120°；V<sub>cn</sub>（−110°）比 V<sub>bn</sub>（−230°）早 120°', '每一個都比上一個晚 120° —— 順序 a → c → b。'),
        st('結論。', 'a → c → b　⟹　acb（負相序）', 'V<sub>an</sub> 領先 V<sub>cn</sub>，V<sub>cn</sub> 再領先 V<sub>bn</sub>，就是 acb。')
      ],
      ans: 'acb 相序（負相序）',
      story: () => {
        const K = KK(), { T, g, ph, wave3, calc, sc } = K, D = K.D;
        return [
          sc('題目：三個電壓', 'THREE VOLTAGES',
            wave3(70, 200, 500, 80, [10, -230, -110], ['wa', 'wb', 'wc'], ['lna', 'ln', 'ln dsh'], 1.3) +
            T(70, 112, 'v<sub>an</sub>（藍）', { cls: 'ta', fs: 13, a: 'start', k: 'la' }) + T(220, 112, 'v<sub>bn</sub>（實線）', { cls: 't', fs: 13, a: 'start', k: 'lb' }) + T(380, 112, 'v<sub>cn</sub>（虛線）', { cls: 't', fs: 13, a: 'start', k: 'lc' }) +
            D.chip(320, 300, '誰先到最高點？', '這就是相序', 'q', { fs: 14, acc: true }),
            [{ sub: '三個電壓都是 200 V、同一個頻率，只差在<b>相角</b>：10°、−230°、−110°。', on: 'wa la' },
             { sub: '畫在一起：三條一樣的波，只是左右錯開。', on: 'wb lb wc lc' },
             { sub: '<b>相序</b>就是它們輪流到達最高點的順序。', on: 'q' }]),
          sc('換成相量', 'TO PHASORS',
            ph(170, 205, 85, [{ a: 10, l: 'V<sub>an</sub>', k: 'pa' }, { a: 130, l: 'V<sub>bn</sub>', k: 'pb', c: 'ln' }, { a: -110, l: 'V<sub>cn</sub>', k: 'pc', c: 'ln dsh' }], { k: 'ax' }) +
            calc(330, 118, 280, [['V<sub>an</sub> = 200∠10°', 'r1'], ['V<sub>bn</sub> = 200∠−230°', 'r2'], ['　　 = 200∠130°（+360°）', 'r3', 'ta'], ['V<sub>cn</sub> = 200∠−110°', 'r4']], { k: 'cc' }),
            [{ sub: '先把每個 cos 換成相量：角度直接抄下來。', on: 'ax cc r1 pa' },
             { sub: 'V<sub>bn</sub> 是 −230°，轉太多圈不好比。', on: 'r2' },
             { sub: '<b>加 360°</b> 是同一個方向：−230° = 130°。', on: 'r3 pb' },
             { sub: 'V<sub>cn</sub> = 200∠−110°。三支箭頭剛好各差 120°。', on: 'r4 pc' }]),
          sc('誰比誰早', 'WHO LEADS',
            ph(170, 205, 85, [{ a: 10, l: 'a', k: 'pa' }, { a: 130, l: 'b', c: 'ln', k: 'pb' }, { a: -110, l: 'c', c: 'ln dsh', k: 'pc' }], { k: 'ax' }) +
            g('arc1', '<path class="lna" style="fill:none" d="M' + (170 + 50 * Math.cos(10 * Math.PI / 180)).toFixed(1) + ' ' + (205 - 50 * Math.sin(10 * Math.PI / 180)).toFixed(1) + ' A50 50 0 0 1 ' + (170 + 50 * Math.cos(-110 * Math.PI / 180)).toFixed(1) + ' ' + (205 + 50 * Math.sin(110 * Math.PI / 180)).toFixed(1) + '"/>') +
            calc(330, 118, 280, [['相量逆時針轉，', 'r1', 'tm'], ['角度大的先到。', 'r2', 'tm'], ['a（10°）→ c（−110°）', 'r3', 'ta'], ['c（−110°）→ b（−230°）', 'r4', 'ta'], ['順序：a → c → b', 'r5']], { k: 'cc' }),
            [{ sub: '相量是<b>逆時針</b>在轉的，所以角度大的那支先經過最高點。', on: 'ax pa pb pc cc r1 r2' },
             { sub: '從 a（10°）往<b>順時針</b>（越來越晚）走 120°，碰到的是 c（−110°）。', on: 'arc1 r3' },
             { sub: '再往後 120° 才是 b（−230°）。', on: 'r4' },
             { sub: '所以輪流到最高點的順序是 <b>a → c → b</b>。', on: 'r5' }]),
          ansScene(['acb　負相序（negative sequence）', 'V<sub>an</sub> 領先 V<sub>cn</sub> 120°', 'V<sub>cn</sub> 領先 V<sub>bn</sub> 120°'],
            ['答案：<b>acb</b>，負相序。', '判斷法：從 a 開始，看誰「晚 120°」——晚 120° 的就是下一個。'])
        ];
      } },
    { id: 'pp12-1', sec: '12.2', kind: 'pp', no: '12.1', title: '由一相推另外兩相',
      q: '已知 V<sub>bn</sub> = 110∠30° V，假設正相序（abc），求 V<sub>an</sub> 與 V<sub>cn</sub>。',
      en: 'Given that V<sub>bn</sub> = 110∠30° V, find V<sub>an</sub> and V<sub>cn</sub>, assuming a positive (abc) sequence.',
      hint: 'abc 相序：V<sub>bn</sub> 比 V<sub>an</sub> 晚 120°，V<sub>cn</sub> 又比 V<sub>bn</sub> 晚 120°。',
      steps: [
        st('abc 相序：a 最早，b 晚 120°，c 再晚 120°。', 'V<sub>bn</sub> = V<sub>an</sub>∠−120°　⟹　V<sub>an</sub> = V<sub>bn</sub>∠+120°', '知道 b，往前推 120° 就是 a。'),
        st('算 V<sub>an</sub>。', 'V<sub>an</sub> = 110∠(30° + 120°) = 110∠150° V'),
        st('算 V<sub>cn</sub>（比 b 晚 120°）。', 'V<sub>cn</sub> = 110∠(30° − 120°) = 110∠−90° V'),
        st('檢查：三個角度 150°、30°、−90° 各差 120°，加起來 = 0。', '')
      ],
      ans: 'V<sub>an</sub> = 110∠150° V，V<sub>cn</sub> = 110∠−90° V',
      story: () => {
        const K = KK(), { ph, calc, sc } = K;
        return [
          sc('知道 b，推 a 和 c', 'FROM ONE PHASE', ph(170, 205, 85, [{ a: 30, l: 'V<sub>bn</sub> 30°', k: 'pb', c: 'ln' }, { a: 150, l: 'V<sub>an</sub> 150°', k: 'pa' }, { a: -90, l: 'V<sub>cn</sub> −90°', k: 'pc', c: 'ln dsh' }], { k: 'ax' }) +
            calc(340, 120, 270, [['abc：a 最早', 'r1', 'tm'], ['V<sub>an</sub> = V<sub>bn</sub>∠+120°', 'r2'], ['= 110∠150° V', 'r3', 'ta'], ['V<sub>cn</sub> = V<sub>bn</sub>∠−120°', 'r4'], ['= 110∠−90° V', 'r5', 'ta']], { k: 'cc' }),
            [{ sub: '題目只給 V<sub>bn</sub> = 110∠30°。', on: 'ax pb cc' },
             { sub: 'abc 相序：a 比 b <b>早</b> 120°，所以往逆時針轉 120°。', on: 'r1 r2' },
             { sub: 'V<sub>an</sub> = 110∠150°。', on: 'r3 pa' },
             { sub: 'c 比 b <b>晚</b> 120°，往順時針轉：V<sub>cn</sub> = 110∠−90°。', on: 'r4 r5 pc' }]),
          ansScene(['V<sub>an</sub> = 110∠150° V', 'V<sub>cn</sub> = 110∠−90° V'], ['答案：V<sub>an</sub> = 110∠150°、V<sub>cn</sub> = 110∠−90°。'])
        ];
      } },

    /* ═══════════ 12.3 平衡 Y-Y ═══════════ */
    { id: 'ex12-2', sec: '12.3', kind: 'ex', no: '12.2', title: '三線式 Y-Y 的線電流',
      q: '計算圖中三線式 Y-Y 系統的線電流。',
      en: 'Calculate the line currents in the three-wire Y-Y system of Fig. 12.13.',
      fig: F3({ src: 'Y', load: 'Y', vs: ['110∠0° V', '110∠−120° V', '110∠−240° V'], zl: '5 − j2 Ω', z: '10 + j8 Ω' }), cap: '圖 12.13　三線式 Y-Y（每條線 5 − j2 Ω，每相負載 10 + j8 Ω）',
      idea: '平衡系統只要算一相（單相等效電路），其他兩相用相序補。線路阻抗和負載阻抗是串聯的，先加起來。',
      steps: [
        st('三相平衡 → 換成 a 相的單相等效電路。', 'I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>', '平衡時 n 跟 N 同電位，就算沒有中性線，也可以想成有一條線把它們接起來，a 相自己成一個迴路。'),
        st('Z<sub>Y</sub> = 線路 + 負載（串聯）。', 'Z<sub>Y</sub> = (5 − j2) + (10 + j8) = 15 + j6 = 16.155∠21.8° Ω', '電流從 a 出發，先經過線路再經過負載，串聯直接相加。'),
        st('歐姆定律。', 'I<sub>a</sub> = 110∠0° / 16.155∠21.8° = 6.81∠−21.8° A', '相除：大小相除、角度相減。'),
        st('電源是正相序，電流也是正相序。', 'I<sub>b</sub> = I<sub>a</sub>∠−120° = 6.81∠−141.8° A', ''),
        st('', 'I<sub>c</sub> = I<sub>a</sub>∠−240° = 6.81∠−261.8° = 6.81∠98.2° A', '−261.8° + 360° = 98.2°，同一個方向。')
      ],
      ans: 'I<sub>a</sub> = 6.81∠−21.8° A，I<sub>b</sub> = 6.81∠−141.8° A，I<sub>c</sub> = 6.81∠98.2° A',
      story: () => {
        const K = KK(), { T, g, ph, sys3, single, calc, sc } = K, D = K.D;
        const base = { src: 'Y', load: 'Y', x0: 80, x1: 560, vs: ['110∠0°', '110∠−120°', '110∠120°'], zl: '5 − j2 Ω', z: '10 + j8 Ω' };
        return [
          sc('題目畫成圖', 'THE CIRCUIT', sys3(Object.assign({}, base, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            D.chip(320, 296, '要求：I<sub>a</sub>、I<sub>b</sub>、I<sub>c</sub>', '三條線上的電流', 'q', { fs: 14, acc: true }),
            [{ sub: '左邊是 Y 接電源：三顆 110 V，彼此差 120°。', on: 'src lbl' },
             { sub: '中間三條線，每條都有<b>線路阻抗</b> 5 − j2 Ω。', on: 'line' },
             { sub: '右邊是 Y 接負載，每相 10 + j8 Ω。沒有中性線（三線式）。', on: 'load' },
             { sub: '要求的是三條線上的電流。', on: 'q' }]),
          sc('平衡 → 只看 a 相', 'ONE PHASE IS ENOUGH', sys3(Object.assign({}, base, { hl: 0, k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl', hl: 'hl' } })) +
            g('nn', '<path class="lna dsh" style="fill:none" d="M80 260 V292 H560 V260"/>') + T(320, 312, '平衡時 n 跟 N 同電位，想像有一條線', { cls: 'ta', fs: 12.5, k: 'nl' }),
            [{ sub: '三相的電源一樣大、阻抗一樣，只是時間錯開 120°。', on: 'src lbl line load' },
             { sub: '所以三相的電流也只是「同一個電流錯開 120°」—— <b>只要算 a 相</b>。', on: 'hl' },
             { sub: '平衡時 n 和 N 一樣高，可以假裝有一條線接起來，a 相自己成一個迴路。', on: 'nn nl' }]),
          sc('單相等效電路', 'PER-PHASE CIRCUIT', single({ x: 90, y: 135, w: 230, h: 125, v: '110∠0°', z: ['5 − j2', '10 + j8'], i: 'I<sub>a</sub>', k: 'ckt' }) +
            calc(360, 118, 255, [['Z<sub>Y</sub> = 線路 + 負載', 'r1', 'tm'], ['= (5 − j2) + (10 + j8)', 'r2'], ['= 15 + j6 Ω', 'r3'], ['= 16.155∠21.8° Ω', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '只剩一顆電源、兩個串聯的阻抗。', on: 'ckt' },
             { sub: '串聯 → 直接相加：實部加實部、虛部加虛部。', on: 'cc r1 r2' },
             { sub: '15 + j6 Ω。', on: 'r3' },
             { sub: '換成極座標：√(15² + 6²) = 16.155，tan<sup>−1</sup>(6/15) = 21.8°。', on: 'r4' }]),
          sc('歐姆定律', "OHM'S LAW", ph(470, 205, 90, [{ a: 0, l: 'V<sub>an</sub>', c: 'ln', k: 'pv' }, { a: -21.8, m: 0.62, l: 'I<sub>a</sub>', k: 'pi' }], { k: 'ax' }) +
            calc(40, 118, 300, [['I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>', 'r1'], ['= 110∠0° ÷ 16.155∠21.8°', 'r2'], ['= 6.81∠−21.8° A', 'r3', 'ta'], ['大小相除、角度相減', 'r4', 'tm']], { k: 'cc' }),
            [{ sub: 'I<sub>a</sub> = V<sub>an</sub> / Z<sub>Y</sub>。', on: 'cc r1 ax pv' },
             { sub: '代數字。', on: 'r2' },
             { sub: '110 ÷ 16.155 = 6.81；0° − 21.8° = −21.8°。', on: 'r3 r4 pi' },
             { sub: '電流比電壓<b>晚 21.8°</b>：負載偏電感（+j）。', on: '' }]),
          sc('用相序補齊', 'USE THE SEQUENCE', ph(190, 205, 90, [{ a: -21.8, l: 'I<sub>a</sub>', k: 'pa' }, { a: -141.8, l: 'I<sub>b</sub>', c: 'ln', k: 'pb' }, { a: 98.2, l: 'I<sub>c</sub>', c: 'ln dsh', k: 'pc' }], { k: 'ax' }) +
            calc(345, 120, 270, [['I<sub>b</sub> = I<sub>a</sub>∠−120°', 'r1'], ['= 6.81∠−141.8° A', 'r2', 'ta'], ['I<sub>c</sub> = I<sub>a</sub>∠+120°', 'r3'], ['= 6.81∠98.2° A', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '電源是正相序（abc），電流也照 abc 排。', on: 'ax pa cc' },
             { sub: 'I<sub>b</sub> 比 I<sub>a</sub> 晚 120°。', on: 'r1 r2 pb' },
             { sub: 'I<sub>c</sub> 再晚 120°（= 早 120°）：−21.8° + 120° = 98.2°。', on: 'r3 r4 pc' },
             { sub: '三支箭頭一樣長、各差 120°：加起來剛好 0，所以不需要中性線。', on: '' }]),
          ansScene(['I<sub>a</sub> = 6.81∠−21.8° A', 'I<sub>b</sub> = 6.81∠−141.8° A', 'I<sub>c</sub> = 6.81∠98.2° A'],
            ['答案：三條線電流一樣大 6.81 A，各差 120°。', '關鍵只有一步：<b>線路阻抗跟負載阻抗串聯相加</b>。'])
        ];
      } },
    { id: 'pp12-2', sec: '12.3', kind: 'pp', no: '12.2', title: '有發電機內阻的 Y-Y',
      q: 'Y 接平衡三相發電機每相阻抗 0.4 + j0.3 Ω，接到每相 24 + j19 Ω 的 Y 接平衡負載；發電機和負載之間的線路每相 0.6 + j0.7 Ω。正相序、V<sub>an</sub> = 120∠30° V，求 (a) 線電壓 (b) 線電流。',
      en: 'A Y-connected balanced three-phase generator with an impedance of 0.4 + j0.3 Ω per phase is connected to a Y-connected balanced load with an impedance of 24 + j19 Ω per phase. The line joining the generator and the load has an impedance of 0.6 + j0.7 Ω per phase. Assuming a positive sequence for the source voltages and that V<sub>an</sub> = 120∠30° V, find: (a) the line voltages, (b) the line currents.',
      fig: F3({ src: 'Y', load: 'Y', vs: ['120∠30° V', '120∠−90° V', '120∠150° V'], zl: '(0.4+j0.3)+(0.6+j0.7) Ω', z: '24 + j19 Ω' }), cap: '線路方塊 = 發電機內阻 + 線路阻抗（串聯）',
      hint: '線電壓：V<sub>ab</sub> = √3 V<sub>an</sub>∠+30°。線電流：Z<sub>Y</sub> = Z<sub>s</sub> + Z<sub>ℓ</sub> + Z<sub>L</sub> 三個串聯。',
      steps: [
        st('(a) 線電壓 = √3 × 相電壓，超前 30°。', 'V<sub>ab</sub> = √3(120)∠(30° + 30°) = 207.8∠60° V', '線電壓是兩個相電壓相減，大小變 √3 倍、往前轉 30°。'),
        st('另外兩條照正相序。', 'V<sub>bc</sub> = 207.8∠−60° V，V<sub>ca</sub> = 207.8∠180° V'),
        st('(b) 每相總阻抗 = 內阻 + 線路 + 負載。', 'Z<sub>Y</sub> = (0.4 + j0.3) + (0.6 + j0.7) + (24 + j19) = 25 + j20 = 32.02∠38.66° Ω'),
        st('歐姆定律。', 'I<sub>a</sub> = 120∠30° / 32.02∠38.66° = 3.75∠−8.66° A'),
        st('相序補齊。', 'I<sub>b</sub> = 3.75∠−128.66° A，I<sub>c</sub> = 3.75∠111.34° A')
      ],
      ans: '(a) 207.8∠60° V、207.8∠−60° V、207.8∠−180° V　(b) 3.75∠−8.66° A、3.75∠−128.66° A、3.75∠111.34° A',
      note: '線電壓題目問的是電源端（V<sub>an</sub> 是發電機內部電壓）；這裡照課本直接用 √3V<sub>an</sub>∠30°。',
      story: () => {
        const K = KK(), { ph, single, calc, sc } = K;
        return [
          sc('(a) 線電壓', 'LINE VOLTAGES', ph(170, 215, 55, [{ a: 30, l: 'V<sub>an</sub>', k: 'pa', c: 'ln' }, { a: -90, l: 'V<sub>bn</sub>', k: 'pb', c: 'ln' }, { a: 60, m: 1.73, l: 'V<sub>ab</sub>', k: 'pab' }, { a: 90, m: 1, from: [170 + 55 * Math.cos(30 * Math.PI / 180), 215 - 55 * Math.sin(30 * Math.PI / 180)], l: '−V<sub>bn</sub>', c: 'ln dsh', k: 'nb', ld: [0, 0] }], { k: 'ax', ax: 100 }) +
            calc(345, 118, 270, [['V<sub>ab</sub> = V<sub>an</sub> − V<sub>bn</sub>', 'r1'], ['= √3 V<sub>p</sub>∠(30° + 30°)', 'r2'], ['= 207.8∠60° V', 'r3', 'ta'], ['V<sub>bc</sub> = 207.8∠−60°', 'r4'], ['V<sub>ca</sub> = 207.8∠180°', 'r5']], { k: 'cc' }),
            [{ sub: '線電壓 = 兩條線之間的電壓 = 兩個相電壓<b>相減</b>。', on: 'ax pa pb cc r1' },
             { sub: '減 V<sub>bn</sub> 就是加一個反方向的箭頭。', on: 'nb' },
             { sub: '合起來大小變 <b>√3 倍</b>、往前轉 30°：207.8∠60°。', on: 'pab r2 r3' },
             { sub: '另外兩條照 abc 順序各晚 120°。', on: 'r4 r5' }]),
          sc('(b) 三個阻抗串聯', 'THREE IN SERIES', single({ x: 70, y: 140, w: 270, h: 120, v: '120∠30°', z: ['Z<sub>s</sub>', 'Z<sub>ℓ</sub>', 'Z<sub>L</sub>'], i: 'I<sub>a</sub>', k: 'ckt' }) +
            calc(370, 112, 245, [['Z<sub>Y</sub> = Z<sub>s</sub> + Z<sub>ℓ</sub> + Z<sub>L</sub>', 'r1'], ['= 25 + j20 Ω', 'r2'], ['= 32.02∠38.66° Ω', 'r3'], ['I<sub>a</sub> = 120∠30° ÷ Z<sub>Y</sub>', 'r4'], ['= 3.75∠−8.66° A', 'r5', 'ta']], { k: 'cc' }),
            [{ sub: '發電機內阻、線路、負載：電流一路串著走過去。', on: 'ckt' },
             { sub: '三個直接相加：0.4 + 0.6 + 24 = 25，0.3 + 0.7 + 19 = 20。', on: 'cc r1 r2 r3' },
             { sub: '歐姆定律：120 ÷ 32.02 = 3.75，30° − 38.66° = −8.66°。', on: 'r4 r5' }]),
          ansScene(['V<sub>ab</sub> = 207.8∠60°、V<sub>bc</sub> = 207.8∠−60°、V<sub>ca</sub> = 207.8∠180° V', 'I<sub>a</sub> = 3.75∠−8.66° A', 'I<sub>b</sub> = 3.75∠−128.66° A　I<sub>c</sub> = 3.75∠111.34° A'],
            ['(a) 線電壓 = √3 × 120 = 207.8 V，各差 120°。', '(b) 線電流 3.75 A，照相序補齊。'])
        ];
      } },

    /* ═══════════ 12.4 平衡 Y-Δ ═══════════ */
    { id: 'ex12-3', sec: '12.4', kind: 'ex', no: '12.3', title: 'Y-Δ 的相電流與線電流',
      q: 'abc 相序的平衡 Y 接電源 V<sub>an</sub> = 100∠10° V，接到每相 (8 + j4) Ω 的平衡 Δ 負載。求相電流與線電流。',
      en: 'A balanced abc-sequence Y-connected source with V<sub>an</sub> = 100∠10° V is connected to a Δ-connected balanced load (8 + j4) Ω per phase. Calculate the phase and line currents.',
      fig: F3({ src: 'Y', load: 'D', vs: ['100∠10° V', '100∠−110° V', '100∠130° V'], z: '8 + j4 Ω' }), cap: 'Y 接電源 → Δ 接負載',
      idea: '方法一：Δ 負載每相跨在兩條線之間，吃的是<b>線電壓</b>，先求 V<sub>AB</sub> 再除 Z<sub>Δ</sub>。方法二：把 Δ 換成 Y（Z<sub>Δ</sub>/3），用單相等效直接算線電流。',
      steps: [
        st('方法一：先寫負載阻抗。', 'Z<sub>Δ</sub> = 8 + j4 = 8.944∠26.57° Ω'),
        st('線電壓（Δ 負載每相兩端就是線電壓）。', 'V<sub>AB</sub> = V<sub>ab</sub> = √3 V<sub>an</sub>∠30° = 173.2∠40° V', '線電壓 = √3 倍、超前 30°：10° + 30° = 40°。'),
        st('相電流 = 線電壓 ÷ Z<sub>Δ</sub>。', 'I<sub>AB</sub> = 173.2∠40° / 8.944∠26.57° = 19.36∠13.43° A'),
        st('另外兩相照順序。', 'I<sub>BC</sub> = 19.36∠−106.57° A，I<sub>CA</sub> = 19.36∠133.43° A'),
        st('線電流 = √3 × 相電流，落後 30°。', 'I<sub>a</sub> = √3(19.36)∠(13.43° − 30°) = 33.53∠−16.57° A', '節點 A 的 KCL：I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>，兩個差 120° 的相量相減 → √3 倍、轉 −30°。'),
        st('', 'I<sub>b</sub> = 33.53∠−136.57° A，I<sub>c</sub> = 33.53∠103.43° A'),
        st('方法二（單相等效）驗算。', 'I<sub>a</sub> = V<sub>an</sub> / (Z<sub>Δ</sub>/3) = 100∠10° / 2.981∠26.57° = 33.54∠−16.57° A', 'Δ → Y：每相阻抗變成三分之一。一步就拿到線電流。')
      ],
      ans: '相電流 19.36∠13.43°、19.36∠−106.57°、19.36∠133.43° A；線電流 33.53∠−16.57°、33.53∠−136.57°、33.53∠103.43° A',
      story: () => {
        const K = KK(), { T, g, ph, sys3, single, calc, sc } = K, D = K.D;
        const base = { src: 'Y', load: 'D', x0: 80, x1: 560, vs: ['100∠10°', '100∠−110°', '100∠130°'], z: '8 + j4' };
        return [
          sc('題目畫成圖', 'THE CIRCUIT', sys3(Object.assign({}, base, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            D.chip(300, 300, '求：相電流 I<sub>AB</sub>… 和線電流 I<sub>a</sub>…', '兩種電流都要', 'q', { fs: 13.5, acc: true }),
            [{ sub: 'Y 接電源：V<sub>an</sub> = 100∠10°，abc 相序。', on: 'src lbl line' },
             { sub: '負載是 <b>Δ 接</b>：三個 8 + j4 Ω 頭尾接成三角形。', on: 'load' },
             { sub: 'Δ 的每個阻抗<b>跨在兩條線之間</b>（A-B、B-C、C-A）。', on: '' },
             { sub: '要求：流過每個阻抗的<b>相電流</b>，和線上的<b>線電流</b>。', on: 'q' }]),
          sc('方法一：負載吃線電壓', 'Δ SEES LINE VOLTAGE', sys3(Object.assign({}, base, { hlz: 0, k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            D.chip(220, 300, 'V<sub>AB</sub> = √3 × 100∠(10° + 30°) = 173.2∠40° V', '', 'v', { fs: 13.5, acc: true }),
            [{ sub: '藍色那格阻抗的兩端，一端接 A、一端接 B。', on: 'src lbl line load' },
             { sub: '所以它吃到的是<b>線電壓</b> V<sub>AB</sub> = √3 V<sub>an</sub>∠+30° = 173.2∠40° V。', on: 'v' }]),
          sc('相電流', 'PHASE CURRENTS', ph(470, 205, 85, [{ a: 13.43, l: 'I<sub>AB</sub>', k: 'p1' }, { a: -106.57, l: 'I<sub>BC</sub>', c: 'ln', k: 'p2' }, { a: 133.43, l: 'I<sub>CA</sub>', c: 'ln dsh', k: 'p3' }], { k: 'ax' }) +
            calc(30, 112, 320, [['Z<sub>Δ</sub> = 8 + j4 = 8.944∠26.57°', 'r1'], ['I<sub>AB</sub> = V<sub>AB</sub> / Z<sub>Δ</sub>', 'r2'], ['= 173.2∠40° ÷ 8.944∠26.57°', 'r3'], ['= 19.36∠13.43° A', 'r4', 'ta'], ['I<sub>BC</sub>、I<sub>CA</sub>：各轉 ∓120°', 'r5', 'tm']], { k: 'cc' }),
            [{ sub: '負載阻抗換極座標：8.944∠26.57° Ω。', on: 'cc r1 ax' },
             { sub: '相電流 = 線電壓 ÷ 阻抗。', on: 'r2 r3' },
             { sub: 'I<sub>AB</sub> = 19.36∠13.43° A。', on: 'r4 p1' },
             { sub: '另外兩相各晚 120°：19.36∠−106.57°、19.36∠133.43°。', on: 'r5 p2 p3' }]),
          sc('線電流：節點 A 的 KCL', 'KCL AT NODE A', ph(200, 205, 62, [{ a: 13.43, l: 'I<sub>AB</sub>', k: 'p1', c: 'ln' }, { a: 133.43, l: 'I<sub>CA</sub>', k: 'p3', c: 'ln' }, { a: -46.57, from: [200 + 62 * Math.cos(13.43 * Math.PI / 180), 205 - 62 * Math.sin(13.43 * Math.PI / 180)], l: '−I<sub>CA</sub>', c: 'ln dsh', k: 'm3' }, { a: -16.57, m: 1.732, l: 'I<sub>a</sub>', k: 'pa' }], { k: 'ax', ax: 120 }) +
            calc(360, 112, 255, [['I<sub>a</sub> = I<sub>AB</sub> − I<sub>CA</sub>', 'r1'], ['= √3 I<sub>AB</sub>∠−30°', 'r2'], ['= 33.53∠−16.57° A', 'r3', 'ta'], ['I<sub>b</sub> = 33.53∠−136.57°', 'r4'], ['I<sub>c</sub> = 33.53∠103.43°', 'r5']], { k: 'cc' }),
            [{ sub: '節點 A：從線上流進來的 I<sub>a</sub>，分給 AB 那格、再收回 CA 那格流來的。', on: 'ax p1 p3 cc r1' },
             { sub: '減 I<sub>CA</sub> = 加一支反方向的箭頭。', on: 'm3' },
             { sub: '結果：<b>√3 倍</b>、往後轉 30°。', on: 'pa r2 r3' },
             { sub: '另外兩條照順序補齊。', on: 'r4 r5' }]),
          sc('方法二：Δ 換成 Y', 'METHOD 2: Δ → Y', single({ x: 80, y: 140, w: 240, h: 120, v: '100∠10°', z: ['Z<sub>Δ</sub>/3'], i: 'I<sub>a</sub>', k: 'ckt' }) +
            calc(350, 118, 265, [['Z<sub>Δ</sub>/3 = 2.981∠26.57° Ω', 'r1'], ['I<sub>a</sub> = 100∠10° ÷ 2.981∠26.57°', 'r2'], ['= 33.54∠−16.57° A', 'r3', 'ta'], ['跟方法一一樣 ✓', 'r4', 'tm']], { k: 'cc' }),
            [{ sub: '換一條路：把 Δ 負載換成等效的 Y，每相只剩 <b>Z<sub>Δ</sub>/3</b>。', on: 'ckt cc r1' },
             { sub: '變成 Y-Y，用單相等效一步就算出線電流。', on: 'r2 r3' },
             { sub: '跟方法一一樣（最後一位差一點是四捨五入）。', on: 'r4' }]),
          ansScene(['相電流 19.36 A：∠13.43°、∠−106.57°、∠133.43°', '線電流 33.53 A：∠−16.57°、∠−136.57°、∠103.43°', 'I<sub>L</sub> = √3 I<sub>p</sub>，線電流落後相電流 30°'],
            ['相電流 19.36 A，線電流是它的 √3 倍 33.53 A。', '記住 Δ 負載：<b>吃線電壓、線電流 = √3 相電流</b>。'])
        ];
      } },
    { id: 'pp12-3', sec: '12.4', kind: 'pp', no: '12.3', title: '已知線電壓的 Y-Δ',
      q: '平衡 Y 接電源的一個線電壓 V<sub>AB</sub> = 120∠−20° V，接到每相 20∠40° Ω 的 Δ 接負載，abc 相序。求相電流與線電流。',
      en: 'One line voltage of a balanced Y-connected source is V<sub>AB</sub> = 120∠−20° V. If the source is connected to a Δ-connected load of 20∠40° Ω, find the phase and line currents. Assume the abc sequence.',
      fig: F3({ src: 'Y', load: 'D', vs: ['', '', ''], z: '20∠40° Ω' }), cap: '已知 V<sub>AB</sub> = 120∠−20° V',
      hint: 'Δ 負載直接吃 V<sub>AB</sub>：I<sub>AB</sub> = V<sub>AB</sub>/Z<sub>Δ</sub>。線電流 = √3 I<sub>AB</sub>∠−30°。',
      steps: [
        st('相電流。', 'I<sub>AB</sub> = 120∠−20° / 20∠40° = 6∠−60° A'),
        st('照 abc 補齊。', 'I<sub>BC</sub> = 6∠−180° A，I<sub>CA</sub> = 6∠60° A'),
        st('線電流 = √3 倍、落後 30°。', 'I<sub>a</sub> = 6√3∠(−60° − 30°) = 10.392∠−90° A'),
        st('', 'I<sub>b</sub> = 10.392∠150° A，I<sub>c</sub> = 10.392∠30° A')
      ],
      ans: '相電流 6∠−60°、6∠−180°、6∠60° A；線電流 10.392∠−90°、10.392∠150°、10.392∠30° A',
      story: () => {
        const K = KK(), { ph, calc, sc } = K;
        return [
          sc('相電流 → 線電流', 'PHASE → LINE', ph(190, 200, 45, [{ a: -60, l: 'I<sub>AB</sub>', k: 'p1', c: 'ln' }, { a: 180, l: 'I<sub>BC</sub>', k: 'p2', c: 'ln' }, { a: 60, l: 'I<sub>CA</sub>', k: 'p3', c: 'ln' }, { a: -90, m: 1.732, l: 'I<sub>a</sub>', k: 'pa' }], { k: 'ax', ax: 110 }) +
            calc(350, 112, 265, [['I<sub>AB</sub> = 120∠−20° ÷ 20∠40°', 'r1'], ['= 6∠−60° A', 'r2', 'ta'], ['I<sub>BC</sub> = 6∠−180°　I<sub>CA</sub> = 6∠60°', 'r3', 't', 13.5], ['I<sub>a</sub> = √3 × 6∠(−60° − 30°)', 'r4'], ['= 10.392∠−90° A', 'r5', 'ta']], { k: 'cc' }),
            [{ sub: 'Δ 負載直接吃線電壓：I<sub>AB</sub> = V<sub>AB</sub> / Z<sub>Δ</sub>。', on: 'ax cc r1' },
             { sub: '120 ÷ 20 = 6，−20° − 40° = −60°。', on: 'r2 p1' },
             { sub: '另外兩相照 abc 各轉 120°。', on: 'r3 p2 p3' },
             { sub: '線電流 = √3 倍、往後 30°：10.392∠−90°。', on: 'r4 r5 pa' }]),
          ansScene(['I<sub>AB</sub> = 6∠−60°、I<sub>BC</sub> = 6∠−180°、I<sub>CA</sub> = 6∠60° A', 'I<sub>a</sub> = 10.392∠−90° A', 'I<sub>b</sub> = 10.392∠150°、I<sub>c</sub> = 10.392∠30° A'],
            ['相電流 6 A，線電流 6√3 = 10.392 A。'])
        ];
      } },

    /* ═══════════ 12.5 平衡 Δ-Δ ═══════════ */
    { id: 'ex12-4', sec: '12.5', kind: 'ex', no: '12.4', title: 'Δ-Δ 的相電流與線電流',
      q: '每相 20 − j15 Ω 的平衡 Δ 負載，接到正相序、V<sub>ab</sub> = 330∠0° V 的 Δ 接發電機。求負載的相電流與線電流。',
      en: 'A balanced Δ-connected load having an impedance 20 − j15 Ω is connected to a Δ-connected, positive-sequence generator having V<sub>ab</sub> = 330∠0° V. Calculate the phase currents of the load and the line currents.',
      fig: F3({ src: 'D', load: 'D', vs: ['330∠0° V', '330∠−120° V', '330∠120° V'], z: '20 − j15 Ω' }), cap: 'Δ 接電源 → Δ 接負載（沒有線路阻抗）',
      idea: '沒有線路阻抗時，負載每相兩端就是電源的相電壓：V<sub>AB</sub> = V<sub>ab</sub>。相電流 = V<sub>AB</sub>/Z<sub>Δ</sub>，線電流 = √3 倍、落後 30°。',
      steps: [
        st('負載阻抗。', 'Z<sub>Δ</sub> = 20 − j15 = 25∠−36.87° Ω', '課本這裡印成 −36.57°，下一行又用 −36.87°；正確是 tan<sup>−1</sup>(−15/20) = −36.87°。'),
        st('V<sub>AB</sub> = V<sub>ab</sub>（中間沒有東西分壓）。', 'I<sub>AB</sub> = 330∠0° / 25∠−36.87° = 13.2∠36.87° A'),
        st('照正相序。', 'I<sub>BC</sub> = 13.2∠−83.13° A，I<sub>CA</sub> = 13.2∠156.87° A'),
        st('Δ 負載的線電流 = √3 × 相電流，落後 30°。', 'I<sub>a</sub> = (13.2∠36.87°)(√3∠−30°) = 22.86∠6.87° A'),
        st('', 'I<sub>b</sub> = 22.86∠−113.13° A，I<sub>c</sub> = 22.86∠126.87° A')
      ],
      ans: '相電流 13.2∠36.87°、13.2∠−83.13°、13.2∠156.87° A；線電流 22.86∠6.87°、22.86∠−113.13°、22.86∠126.87° A',
      note: '課本把 Z<sub>Δ</sub> 的角度印成 25∠−36.57°，應為 −36.87°（後面的計算用的是對的 −36.87°）。',
      story: () => {
        const K = KK(), { T, g, ph, sys3, calc, sc } = K, D = K.D;
        const base = { src: 'D', load: 'D', x0: 120, x1: 560, vs: ['330∠0°', '330∠−120°', '330∠120°'], z: '20 − j15' };
        return [
          sc('題目畫成圖', 'THE CIRCUIT', sys3(Object.assign({}, base, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            D.chip(330, 300, '電源每相 = 線電壓 = 330 V', 'Δ 電源每顆都跨在兩條線之間', 'q', { fs: 13.5, acc: true }),
            [{ sub: '電源也是 Δ：三顆 330 V 接成三角形。', on: 'src lbl' },
             { sub: 'Δ 電源的每顆<b>本身就跨在兩條線之間</b>，所以相電壓 = 線電壓。', on: 'q' },
             { sub: '負載是 Δ，每相 20 − j15 Ω；中間沒有線路阻抗。', on: 'line load' }]),
          sc('相電流', 'PHASE CURRENTS', ph(470, 205, 80, [{ a: 36.87, l: 'I<sub>AB</sub>', k: 'p1' }, { a: -83.13, l: 'I<sub>BC</sub>', c: 'ln', k: 'p2' }, { a: 156.87, l: 'I<sub>CA</sub>', c: 'ln dsh', k: 'p3' }], { k: 'ax' }) +
            calc(30, 112, 320, [['Z<sub>Δ</sub> = 20 − j15 = 25∠−36.87°', 'r1'], ['V<sub>AB</sub> = V<sub>ab</sub> = 330∠0°', 'r2'], ['I<sub>AB</sub> = 330∠0° ÷ 25∠−36.87°', 'r3'], ['= 13.2∠36.87° A', 'r4', 'ta'], ['（電容性：電流超前）', 'r5', 'tm']], { k: 'cc' }),
            [{ sub: '負載阻抗：25∠−36.87° Ω（課本印成 −36.57°，是筆誤）。', on: 'cc r1 ax' },
             { sub: '中間沒有線路阻抗 → 負載兩端就是 330∠0°。', on: 'r2' },
             { sub: 'I<sub>AB</sub> = 13.2∠36.87° A。', on: 'r3 r4 p1' },
             { sub: '角度是正的：負載 −j15 是電容性，電流<b>超前</b>電壓。', on: 'r5' },
             { sub: '另外兩相照正相序。', on: 'p2 p3' }]),
          sc('線電流', 'LINE CURRENTS', ph(200, 205, 55, [{ a: 36.87, l: 'I<sub>AB</sub>', k: 'p1', c: 'ln' }, { a: 6.87, m: 1.732, l: 'I<sub>a</sub>', k: 'pa' }], { k: 'ax', ax: 110 }) +
            calc(350, 118, 265, [['I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°', 'r1'], ['= 22.86∠6.87° A', 'r2', 'ta'], ['I<sub>b</sub> = 22.86∠−113.13°', 'r3'], ['I<sub>c</sub> = 22.86∠126.87°', 'r4']], { k: 'cc' }),
            [{ sub: 'Δ 負載：線電流永遠是相電流的 √3 倍、落後 30°。', on: 'ax p1 cc r1' },
             { sub: '13.2 × 1.732 = 22.86，36.87° − 30° = 6.87°。', on: 'pa r2' },
             { sub: '照順序補齊。', on: 'r3 r4' }]),
          ansScene(['相電流 13.2 A：∠36.87°、∠−83.13°、∠156.87°', '線電流 22.86 A：∠6.87°、∠−113.13°、∠126.87°'],
            ['相電流 13.2 A、線電流 22.86 A。', 'Δ-Δ 最好算：電源電壓直接就是負載電壓。'])
        ];
      } },
    { id: 'pp12-4', sec: '12.5', kind: 'pp', no: '12.4', title: '由線電流反推',
      q: '正相序平衡 Δ 接電源供電給平衡 Δ 接負載。負載每相 18 + j12 Ω，I<sub>a</sub> = 9.609∠35° A，求 I<sub>AB</sub> 與 V<sub>AB</sub>。',
      en: 'A positive-sequence, balanced Δ-connected source supplies a balanced Δ-connected load. If the impedance per phase of the load is 18 + j12 Ω and I<sub>a</sub> = 9.609∠35° A, find I<sub>AB</sub> and V<sub>AB</sub>.',
      hint: '反過來用 I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°：I<sub>AB</sub> = I<sub>a</sub> / (√3∠−30°)。',
      steps: [
        st('線電流 → 相電流：除以 √3、往前轉 30°。', 'I<sub>AB</sub> = 9.609∠35° / (√3∠−30°) = 5.548∠65° A'),
        st('負載阻抗換極座標。', 'Z<sub>Δ</sub> = 18 + j12 = 21.63∠33.69° Ω'),
        st('V<sub>AB</sub> = I<sub>AB</sub> Z<sub>Δ</sub>。', 'V<sub>AB</sub> = 5.548∠65° × 21.63∠33.69° = 120∠98.69° V')
      ],
      ans: 'I<sub>AB</sub> = 5.548∠65° A，V<sub>AB</sub> = 120∠98.69° V',
      story: () => {
        const K = KK(), { ph, calc, sc } = K;
        return [
          sc('倒著走', 'WORK BACKWARD', ph(190, 205, 50, [{ a: 35, m: 1.732, l: 'I<sub>a</sub>', k: 'pa', c: 'ln' }, { a: 65, l: 'I<sub>AB</sub>', k: 'p1' }, { a: 98.69, m: 1.6, l: 'V<sub>AB</sub>（另一比例）', k: 'pv', c: 'ln dsh' }], { k: 'ax', ax: 110 }) +
            calc(350, 112, 265, [['I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°', 'r1', 'tm'], ['I<sub>AB</sub> = 9.609∠35° ÷ √3∠−30°', 'r2'], ['= 5.548∠65° A', 'r3', 'ta'], ['V<sub>AB</sub> = I<sub>AB</sub> × 21.63∠33.69°', 'r4'], ['= 120∠98.69° V', 'r5', 'ta']], { k: 'cc' }),
            [{ sub: '題目給的是線電流，要倒推相電流：', on: 'ax pa cc r1' },
             { sub: '除以 √3、角度 <b>加</b> 30°。', on: 'r2 r3 p1' },
             { sub: '再乘負載阻抗就是相電壓 = 線電壓。', on: 'r4 r5 pv' }]),
          ansScene(['I<sub>AB</sub> = 5.548∠65° A', 'V<sub>AB</sub> = 120∠98.69° V'], ['答案：I<sub>AB</sub> = 5.548∠65°、V<sub>AB</sub> = 120∠98.69°。'])
        ];
      } },

    /* ═══════════ 12.6 平衡 Δ-Y ═══════════ */
    { id: 'ex12-5', sec: '12.6', kind: 'ex', no: '12.5', title: 'Δ 電源接 Y 負載',
      q: '每相 40 + j25 Ω 的平衡 Y 負載，由線電壓 210 V、正相序的平衡 Δ 接電源供電。以 V<sub>ab</sub> 為參考，求相電流。',
      en: 'A balanced Y-connected load with a phase impedance of 40 + j25 Ω is supplied by a balanced, positive sequence Δ-connected source with a line voltage of 210 V. Calculate the phase currents. Use V<sub>ab</sub> as a reference.',
      fig: F3({ src: 'D', load: 'Y', vs: ['210∠0° V', '210∠−120° V', '210∠120° V'], z: '40 + j25 Ω' }), cap: 'Δ 接電源 → Y 接負載',
      idea: '把 Δ 電源換成等效 Y：V<sub>an</sub> = V<sub>ab</sub>/√3∠−30°。之後就是 Y-Y，單相等效直接算。Y 負載的相電流 = 線電流。',
      steps: [
        st('負載阻抗。', 'Z<sub>Y</sub> = 40 + j25 = 47.17∠32° Ω'),
        st('電源電壓（參考）。', 'V<sub>ab</sub> = 210∠0° V'),
        st('Δ 電源 → Y：除以 √3、往後轉 30°。', 'V<sub>an</sub> = (210/√3)∠−30° = 121.2∠−30° V', '跟「線電壓 = √3 相電壓、超前 30°」反過來。'),
        st('單相等效。', 'I<sub>a</sub> = 121.2∠−30° / 47.17∠32° = 2.57∠−62° A', '課本分母印成 47.12，數值是 47.17。'),
        st('照正相序補齊。', 'I<sub>b</sub> = I<sub>a</sub>∠−120° = 2.57∠−182° = 2.57∠178° A，I<sub>c</sub> = 2.57∠58° A', '課本把 I<sub>b</sub> 寫成 2.57∠−178°；−62° − 120° = −182°，換成 −180°～180° 是 +178°。')
      ],
      ans: 'I<sub>a</sub> = 2.57∠−62° A，I<sub>b</sub> = 2.57∠178° A（= ∠−182°），I<sub>c</sub> = 2.57∠58° A（Y 負載：相電流 = 線電流）',
      note: '課本兩處筆誤：分母 47.12∠32° 應為 47.17∠32°；I<sub>b</sub> = 2.57∠−178° 應為 2.57∠−182°（= ∠178°）。',
      story: () => {
        const K = KK(), { T, g, ph, sys3, single, calc, sc } = K, D = K.D;
        const base = { src: 'D', load: 'Y', x0: 120, x1: 560, vs: ['210∠0°', '210∠−120°', '210∠120°'], z: '40 + j25' };
        return [
          sc('題目畫成圖', 'THE CIRCUIT', sys3(Object.assign({}, base, { k: { src: 'src', line: 'line', load: 'load', lbl: 'lbl' } })) +
            D.chip(330, 300, '問題：Δ 沒有中性點 n', '沒辦法直接畫單相等效', 'q', { fs: 13.5, acc: true }),
            [{ sub: 'Δ 電源，線電壓 210 V，以 V<sub>ab</sub> = 210∠0° 當參考。', on: 'src lbl line' },
             { sub: 'Y 負載，每相 40 + j25 Ω。', on: 'load' },
             { sub: 'Δ 電源<b>沒有中性點</b>，單相等效電路的「n」在哪？', on: 'q' }]),
          sc('Δ 電源 → 等效 Y', 'Δ SOURCE → Y', ph(190, 205, 70, [{ a: 0, m: 1.25, l: 'V<sub>ab</sub>', k: 'pab', c: 'ln' }, { a: -30, m: 0.72, l: 'V<sub>an</sub>', k: 'pan' }], { k: 'ax', ax: 110 }) +
            calc(350, 118, 265, [['V<sub>an</sub> = V<sub>ab</sub> / √3 ∠−30°', 'r1'], ['= 210/√3 ∠(0° − 30°)', 'r2'], ['= 121.2∠−30° V', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '想像一個 Y 電源，它產生的<b>線電壓</b>跟原本的 Δ 一模一樣。', on: 'ax pab cc' },
             { sub: 'Y 的線電壓 = √3 相電壓、超前 30°；反過來就是除 √3、往後轉 30°。', on: 'r1 r2 pan' },
             { sub: 'V<sub>an</sub> = 121.2∠−30° V。', on: 'r3' }]),
          sc('單相等效', 'PER-PHASE', single({ x: 80, y: 140, w: 230, h: 120, v: '121.2∠−30°', z: ['40 + j25'], i: 'I<sub>a</sub>', k: 'ckt' }) +
            calc(345, 112, 270, [['Z<sub>Y</sub> = 47.17∠32° Ω', 'r1'], ['I<sub>a</sub> = 121.2∠−30° ÷ 47.17∠32°', 'r2'], ['= 2.57∠−62° A', 'r3', 'ta'], ['I<sub>b</sub> = 2.57∠−182° = ∠178°', 'r4'], ['I<sub>c</sub> = 2.57∠58°', 'r5']], { k: 'cc' }),
            [{ sub: '變成普通的 Y-Y，取 a 相。', on: 'ckt cc r1' },
             { sub: 'I<sub>a</sub> = 2.57∠−62° A。', on: 'r2 r3' },
             { sub: '−62° − 120° = −182°，等於 +178°（課本寫成 −178° 是筆誤）。', on: 'r4' },
             { sub: 'I<sub>c</sub> = −62° + 120° = 58°。', on: 'r5' }]),
          ansScene(['I<sub>a</sub> = 2.57∠−62° A', 'I<sub>b</sub> = 2.57∠178° A', 'I<sub>c</sub> = 2.57∠58° A', 'Y 負載：相電流就是線電流'],
            ['答案：三相電流 2.57 A。', '口訣：<b>Δ 電源先換 Y（÷√3、−30°）</b>，之後全部是 Y-Y。'])
        ];
      } },
    { id: 'pp12-5', sec: '12.6', kind: 'pp', no: '12.5', title: 'Δ-Y 線電流',
      q: '平衡 Δ-Y 電路中，V<sub>ab</sub> = 240∠15° V、Z<sub>Y</sub> = (12 + j15) Ω。求線電流。',
      en: 'In a balanced Δ-Y circuit, V<sub>ab</sub> = 240∠15° and Z<sub>Y</sub> = (12 + j15) Ω. Calculate the line currents.',
      hint: 'V<sub>an</sub> = V<sub>ab</sub>/√3∠−30°，再除 Z<sub>Y</sub>。',
      steps: [
        st('Δ → 等效 Y。', 'V<sub>an</sub> = (240/√3)∠(15° − 30°) = 138.56∠−15° V'),
        st('負載阻抗。', 'Z<sub>Y</sub> = 12 + j15 = 19.21∠51.34° Ω'),
        st('線電流。', 'I<sub>a</sub> = 138.56∠−15° / 19.21∠51.34° = 7.21∠−66.34° A'),
        st('照正相序。', 'I<sub>b</sub> = 7.21∠−186.34° = 7.21∠173.66° A，I<sub>c</sub> = 7.21∠53.66° A')
      ],
      ans: '7.21∠−66.34° A、7.21∠173.66° A、7.21∠53.66° A',
      story: () => {
        const K = KK(), { ph, calc, sc } = K;
        return [
          sc('兩步：先換 Y，再除阻抗', 'TWO STEPS', ph(180, 205, 60, [{ a: 15, m: 1.4, l: 'V<sub>ab</sub>', k: 'pab', c: 'ln' }, { a: -15, m: 0.81, l: 'V<sub>an</sub>', k: 'pan', c: 'ln dsh' }, { a: -66.34, m: 1.1, l: 'I<sub>a</sub>', k: 'pa' }], { k: 'ax', ax: 110 }) +
            calc(340, 112, 275, [['V<sub>an</sub> = 240/√3 ∠(15° − 30°)', 'r1'], ['= 138.56∠−15° V', 'r2', 'ta'], ['Z<sub>Y</sub> = 19.21∠51.34° Ω', 'r3'], ['I<sub>a</sub> = 7.21∠−66.34° A', 'r4', 'ta'], ['I<sub>b</sub> ∠173.66°　I<sub>c</sub> ∠53.66°', 'r5']], { k: 'cc' }),
            [{ sub: 'Δ 電源先換成等效 Y：÷√3、往後轉 30°。', on: 'ax pab cc r1 r2 pan' },
             { sub: '負載阻抗 19.21∠51.34° Ω。', on: 'r3' },
             { sub: '相除：7.21∠−66.34° A。', on: 'r4 pa' },
             { sub: '另外兩條照順序：−186.34° 換成 173.66°。', on: 'r5' }]),
          ansScene(['I<sub>a</sub> = 7.21∠−66.34° A', 'I<sub>b</sub> = 7.21∠173.66° A', 'I<sub>c</sub> = 7.21∠53.66° A'], ['答案：線電流 7.21 A，各差 120°。'])
        ];
      } }
  ];

  window.__CH12EX = window.__CH12EX || { book: 'Alexander & Sadiku', items: [] };
  window.__CH12EX.items = window.__CH12EX.items.concat(items);
  window.__CH12F = { F3, FP, hs };
})();
