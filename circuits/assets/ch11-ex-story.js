/* ============================================================
   電路學 CH11 課本例題／練習題的「🎬 圖解故事」（使用者 10/18：照 CH12 一樣，每題都要）
   掛在 window.__CH11EX.items 上（依 id），exbook 按了才畫。
   每題 3～5 幕：題目畫成圖 → 一步一步算（計算卡一行一行亮＋阻抗平面／功率三角形／波形）→ 答案卡。
   數字全部跟 ch11-ex.js 的詳解一致（那邊已用程式驗算過）。
   需要：story.js、ch12-kit.js（__K12）、rv-kit.js（__RV）
   ============================================================ */
(function () {
  'use strict';
  const BANK = window.__CH11EX;
  if (!BANK) return;
  const RV = () => window.__RV;
  const f1 = x => Math.round(x * 10) / 10;
  const RAD = Math.PI / 180;

  /* ── 共用畫面 ── */
  /* 計算卡一幕：rows = [[文字, class?, 字級?]]；steps = [[字幕, 這一步亮到第幾列(含)]]；extra = 其他 SVG（左邊的圖） */
  function cs(t, en, rows, steps, extra, opt) {
    const R = RV(); opt = opt || {};
    const x = opt.x !== undefined ? opt.x : (extra ? 340 : 110), w = opt.w || (extra ? 280 : 420);
    const svg = (extra || '') + R.calc(x, opt.y || 108, w, rows.map((r, i) => [r[0], 'r' + i, r[1] || 't', r[2]]), { k: 'cc', lh: opt.lh || 30, a: extra ? 'start' : 'middle', fs: opt.fs });
    let last = -1;
    return R.sc(t, en, svg, steps.map((s, i) => {
      const upto = s[1] === undefined ? rows.length - 1 : s[1];
      const keys = []; for (let n = last + 1; n <= upto; n++) keys.push('r' + n);
      last = Math.max(last, upto);
      return { sub: s[0], on: (i === 0 ? 'cc fig ' : '') + keys.join(' ') + (s[2] ? ' ' + s[2] : '') };
    }));
  }
  /* 答案卡 */
  function ans(rows, sub) {
    const R = RV();
    return R.sc('答案', 'ANSWER', R.calc(110, 112, 420, rows.map((r, i) => [r, 'a' + i, i === 0 ? 'ta' : 't', i === 0 ? 16 : 15]), { title: '答案　ANSWER', a: 'middle', k: 'ans' }),
      [{ sub, on: 'ans ' + rows.map((_, i) => 'a' + i).join(' ') }]);
  }
  /* 一般電路（梯子畫法）：o = { x0, dx, yt, yb, src: {v|i, l}, parts: [{s:標籤}|{p:標籤, p2:第二個串在下面}|{v:'標籤'}|{i:'標籤'}|{w:1}|{n:'標籤'}] }
     s = 串在上面的阻抗、p = 往下接的分支、v/i = 往下接的電源、w = 瓦特計、n = 上面那條線的文字 */
  function ckt(o, key) {
    const R = RV(), D = R.D;
    const yt = o.yt || 130, yb = o.yb || 270, ym = (yt + yb) / 2, dx = o.dx || 90;
    let x = o.x0 || 70, s = '';
    const vsrc = (xx, l, side) => '<path class="ln" d="M' + xx + ' ' + yt + ' V' + (ym - 16) + ' M' + xx + ' ' + (ym + 16) + ' V' + yb + '"/>' + R.src(xx, ym, 16) +
      (l ? R.T(side === 'r' ? xx + 22 : xx - 22, ym + 5, l, { cls: 't', fs: 12.5, a: side === 'r' ? 'start' : 'end' }) : '');
    const isrc = (xx, l, side) => '<path class="ln" d="M' + xx + ' ' + yt + ' V' + (ym - 16) + ' M' + xx + ' ' + (ym + 16) + ' V' + yb + '"/>' +
      '<circle class="bgw" cx="' + xx + '" cy="' + ym + '" r="16"/>' + D.arrow(xx, ym + 9, xx, ym - 9, null, 'ln') +
      (l ? R.T(side === 'r' ? xx + 22 : xx - 22, ym + 5, l, { cls: 't', fs: 12.5, a: side === 'r' ? 'start' : 'end' }) : '');
    const x0 = x;
    if (o.src) s += o.src.i ? isrc(x, o.src.i, 'l') : vsrc(x, o.src.v, 'l');
    /* 電源後面直接接分支：先拉一段線，免得疊在電源上 */
    if (o.src && o.parts[0] && !o.parts[0].s && !o.parts[0].w) { s += '<path class="ln" d="M' + x + ' ' + yt + ' H' + (x + 90) + '"/>'; x += 90; }
    o.parts.forEach((p, i) => {
      const last = i === o.parts.length - 1;
      if (p.s) { s += R.zbox(x, yt, x + dx, yt, p.s, { fs: 12.5, lc: 't', hl: p.hl }); x += dx; }
      else if (p.w) { s += '<path class="ln" d="M' + x + ' ' + yt + ' H' + (x + 22) + ' M' + (x + 58) + ' ' + yt + ' H' + (x + dx) + '"/><rect class="accw" x="' + (x + 22) + '" y="' + (yt - 16) + '" width="36" height="32" rx="6" style="stroke:var(--s-acc);stroke-width:1.8"/>' + R.T(x + 40, yt + 5, 'W', { cls: 'ta', fs: 15 }); x += dx; }
      else {
        if (p.p !== undefined) {
          if (p.p2) s += R.zbox(x, yt, x, ym, p.p, { fs: 12.5, lc: p.hl ? 'ta' : 't', hl: p.hl }) + R.zbox(x, ym, x, yb, p.p2, { fs: 12.5, lc: 't' });
          else s += R.zbox(x, yt, x, yb, p.p, { fs: 12.5, lc: p.hl ? 'ta' : 't', hl: p.hl });
        } else if (p.v) s += vsrc(x, p.v, 'r');
        else if (p.i) s += isrc(x, p.i, 'r');
        if (x !== x0) s += R.dot(x, yt) + R.dot(x, yb);
        const gp = p.gap !== undefined ? p.gap : 70;
        if (!last && gp) { s += '<path class="ln" d="M' + x + ' ' + yt + ' H' + (x + gp) + '"/>'; x += gp; }
      }
    });
    s += '<path class="ln" d="M' + x0 + ' ' + yb + ' H' + x + '"/>';
    return R.g(key || 'fig', s + (o.extra || ''));
  }
  /* 阻抗（或任何複數）平面：zs = [{re, im, l, k, c}]，比例 sc px/單位，原點 (ox, oy) */
  function zp(ox, oy, sc, zs, opt) {
    const R = RV(), D = R.D; opt = opt || {};
    let s = R.g(opt.k || 'zax', D.arrow(ox - 10, oy, ox + (opt.w || 240), oy, null, 'ln2') + D.arrow(ox, oy + (opt.down || 100), ox, oy - (opt.up || 120), null, 'ln2') +
      R.T(ox + (opt.w || 240), oy + 16, '實部', { cls: 'ts', fs: 11, a: 'end' }) + R.T(ox + 6, oy - (opt.up || 120) + 10, 'j', { cls: 'ts', fs: 12, a: 'start' }));
    zs.forEach(z => {
      const x = f1(ox + z.re * sc), y = f1(oy - z.im * sc);
      s += R.g(z.k, D.arrow(z.fx !== undefined ? f1(ox + z.fx * sc) : ox, z.fy !== undefined ? f1(oy - z.fy * sc) : oy, x, y, null, z.c || 'lna') +
        (z.l ? R.T(x + (z.lx || 8), y + (z.ly !== undefined ? z.ly : (z.im >= 0 ? -6 : 16)), z.l, { cls: z.lc || (z.c === 'ln' ? 't' : 'ta'), fs: 12.5, a: z.la || 'start' }) : ''));
    });
    return s;
  }
  /* 功率三角形（比例 sc px/單位）＋標籤 */
  const ptri = (ox, oy, P, Q, sc, lp, lq, ls, keys) => RV().tri(ox, oy, P, Q, sc, Object.assign({ lp, lq, ls }, keys || { kp: 'tp', kq: 'tq', ks: 'ts' }));
  /* 波形：fn(t) t∈[0,1] → −1～1，畫在 (x, y0) 中線、半高 h */
  const wv = (x, y0, w, h, fn, cls, key, extra) => RV().g(key, '<line class="ln2" x1="' + x + '" y1="' + y0 + '" x2="' + (x + w) + '" y2="' + y0 + '"/>' + RV().curve(fn, x, w, y0, h, cls || 'lna', null, 200) + (extra || ''));
  /* 長條（電費）：items = [[標籤, 數值, class]]，總長 scale px/單位 */
  function bars(x, y, sc, items, key) {
    const R = RV(); let s = '', cx = x;
    items.forEach((it, i) => {
      const w = Math.max(2, it[1] * sc);
      s += R.g(key + i, '<rect class="' + (it[2] || 'accw') + '" x="' + f1(cx) + '" y="' + y + '" width="' + f1(w) + '" height="34" rx="4" style="stroke:var(--s-acc);stroke-width:1.4"/>' +
        R.T(f1(cx + w / 2), y + 22, it[0], { cls: it[2] === 'acc' ? 'card' : 't', fs: 12 }));
      cx += w;
    });
    return s;
  }
  const chip = (x, y, a, b, k, o) => RV().D.chip(x, y, a, b, k, o);

  /* ── 每一題的故事 ── */
  const ST = {
    /* ═════ 11.2 ═════ */
    'ex11-1': () => {
      const R = RV();
      const W = (fn, cls, k) => wv(70, 200, 500, 60, fn, cls, k);
      return [
        R.sc('兩條弦波相乘', 'MULTIPLY v AND i',
          W(t => Math.cos(2 * Math.PI * 2 * t + 45 * RAD), 'ln', 'wv') + W(t => Math.cos(2 * Math.PI * 2 * t - 10 * RAD), 'lna', 'wi') +
          R.T(80, 128, 'v = 120 cos(377t + 45°)（黑）', { cls: 't', fs: 12.5, a: 'start', k: 'lv' }) + R.T(360, 128, 'i = 10 cos(377t − 10°)（藍）', { cls: 'ta', fs: 12.5, a: 'start', k: 'li' }) +
          chip(320, 292, '瞬時功率 p(t) = v(t) × i(t)', '', 'c1', { fs: 13.5, acc: true }),
          [{ sub: '題目給一個網路的電壓 v(t) 和電流 i(t)，兩個都是 377 rad/s 的弦波。', on: 'wv lv wi li' },
           { sub: '每一瞬間的功率，就是那一瞬間的電壓乘電流。', on: 'c1' }]),
        cs('積化和差', 'PRODUCT TO SUM',
          [['p = 1200 cos(377t + 45°) cos(377t − 10°)'], ['cos A cos B = ½[cos(A + B) + cos(A − B)]', 'tm'], ['= 600 cos(754t + 35°) + 600 cos 55°'], ['p(t) = 344.2 + 600 cos(754t + 35°) W', 'ta']],
          [['120 × 10 = 1200，兩個 cos 相乘。', 0], ['用積化和差拆成「加起來」。', 1], ['A − B 的 377t 抵消 → 變常數；A + B 變成兩倍頻。', 2], ['整理：一個常數 + 一個兩倍頻的弦波。', 3]]),
        R.sc('平均功率 = 那個常數', 'THE AVERAGE',
          wv(70, 250, 500, 50, t => (344.2 + 600 * Math.cos(2 * Math.PI * 4 * t + 35 * RAD)) / 944.2 * 1.6 - 0.58, 'lna', 'pw') +
          R.g('avg', '<line class="ln dsh" x1="70" y1="' + f1(250 - 50 * (344.2 / 944.2 * 1.6 - 0.58)) + '" x2="570" y2="' + f1(250 - 50 * (344.2 / 944.2 * 1.6 - 0.58)) + '"/>' + R.T(575, f1(250 - 50 * (344.2 / 944.2 * 1.6 - 0.58)) + 4, '344.2 W', { cls: 't', fs: 13, a: 'end' })) +
          R.calc(110, 106, 420, [['P = ½V<sub>m</sub>I<sub>m</sub> cos(θ<sub>v</sub> − θ<sub>i</sub>)', 'r0'], ['= ½(120)(10) cos 55° = 344.2 W', 'r1', 'ta']], { k: 'cc', a: 'middle', lh: 28 }),
          [{ sub: 'p(t) 繞著一條水平線上下晃，頻率是電壓的兩倍。', on: 'pw' },
           { sub: '兩倍頻那一項平均為 0，剩下的常數就是<b>平均功率</b>。', on: 'avg' },
           { sub: '公式版：½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub> − θ<sub>i</sub>) = 344.2 W。', on: 'cc r0 r1' }]),
        ans(['p(t) = 344.2 + 600 cos(754t + 35°) W', 'P = 344.2 W'], '答案：平均功率 344.2 W。')
      ];
    },
    'pp11-1': () => {
      const R = RV();
      return [
        R.sc('先把 sin 換成 cos', 'SIN TO COS',
          R.ph(170, 205, 80, [{ a: 60, l: 'sin 的 60°', c: 'ln dsh', k: 'p0' }, { a: -30, l: 'cos 的 −30°', k: 'p1' }, { a: 20, m: 0.9, l: 'v：20°', c: 'ln', k: 'pv' }], { k: 'ax' }) +
          R.calc(340, 120, 280, [['sin x = cos(x − 90°)', 'r0', 'tm'], ['i = 33 sin(10t + 60°)', 'r1'], ['= 33 cos(10t − 30°)', 'r2', 'ta']], { k: 'cc' }),
          [{ sub: '電流給的是 sin。相位要比較，必須先統一成 cos。', on: 'ax p0 cc r0 r1' },
           { sub: 'sin 換 cos：角度減 90°。60° − 90° = −30°。', on: 'p1 r2' },
           { sub: '電壓在 20°、電流在 −30°：差 50°。', on: 'pv' }]),
        cs('照 Example 11.1 做', 'SAME RECIPE',
          [['p = 330 × 33 cos(10t + 20°) cos(10t − 30°)'], ['= 5445[cos(20t − 10°) + cos 50°]'], ['p(t) = 3500 + 5445 cos(20t − 10°) W', 'ta'], ['P = 5445 cos 50° = 3.5 kW', 'ta']],
          [['相乘：330 × 33 = 10890。', 0], ['積化和差，一半是 5445。', 1], ['常數 5445 cos 50° = 3500。', 2], ['常數就是平均功率：3.5 kW。', 3]]),
        ans(['p(t) = 3.5 + 5.445 cos(20t − 10°) kW', 'P = 3.5 kW'], '答案：P = 3.5 kW。')
      ];
    },
    'ex11-2': () => {
      const R = RV();
      return [
        R.sc('阻抗畫在平面上', 'THE IMPEDANCE',
          zp(150, 140, 1.9, [{ re: 30, im: 0, l: '30', k: 'zr', c: 'ln', ly: 18 }, { re: 30, im: -70, fx: 30, fy: 0, l: '−j70', k: 'zx', c: 'ln dsh', ly: -60 }, { re: 30, im: -70, l: '76.16∠−66.8°', k: 'zz', ly: 6, lx: -10, la: 'end' }], { up: 30, down: 150, w: 120 }) +
          R.calc(340, 120, 280, [['Z = 30 − j70 Ω', 'r0'], ['|Z| = √(30<sup>2</sup> + 70<sup>2</sup>) = 76.16', 'r1'], ['Z = 76.16∠−66.8° Ω', 'r2', 'ta']], { k: 'cc' }),
          [{ sub: '阻抗 30 − j70：實部 30（電阻），虛部 −70（電容性）。', on: 'zax zr zx cc r0' },
           { sub: '要做除法，先換成極座標：長度 76.16、角度 −66.8°。', on: 'zz r1 r2' }]),
        cs('電流與平均功率', 'CURRENT AND POWER',
          [['I = V/Z = 120∠0° / 76.16∠−66.8°'], ['= 1.576∠66.8° A', 'ta'], ['P = ½(120)(1.576) cos 66.8°'], ['= 37.24 W', 'ta'], ['驗算：½|I|<sup>2</sup>R = ½(1.576)<sup>2</sup>(30) ≈ 37.2 W', 'tm']],
          [['歐姆定律：大小相除、角度相減。', 1], ['平均功率：½V<sub>m</sub>I<sub>m</sub>cos(差角)。', 3], ['也可以只看電阻：½|I|<sup>2</sup>R，電容平均不吃功率。', 4]]),
        ans(['P = 37.24 W'], '答案：37.24 W。')
      ];
    },
    'pp11-2': () => {
      const R = RV();
      return [
        R.sc('只有實部會吃功率', 'ONLY R ABSORBS',
          zp(150, 150, 3.4, [{ re: 37.09, im: -14.98, l: '40∠−22°', k: 'zz' }, { re: 37.09, im: 0, l: 'R = 37.09', k: 'zr', c: 'ln', ly: -8 }], { up: 40, down: 90, w: 170 }) +
          R.calc(360, 120, 260, [['R = 40 cos(−22°) = 37.09 Ω', 'r0'], ['P = ½|I|<sup>2</sup>R', 'r1'], ['= ½(33)<sup>2</sup>(37.09)', 'r2'], ['= 20.19 kW', 'r3', 'ta']], { k: 'cc' }),
          [{ sub: '已知電流 33∠30° A 和阻抗 40∠−22° Ω。', on: 'zax zz' },
           { sub: '平均功率只消耗在電阻上：取 Z 的實部 37.09 Ω。', on: 'zr cc r0' },
           { sub: 'P = ½|I|<sup>2</sup>R（33 A 是峰值，所以乘 ½）= 20.19 kW。', on: 'r1 r2 r3' }]),
        ans(['P = 20.19 kW'], '答案：20.19 kW。')
      ];
    },
    'ex11-3': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT', R.single({ x: 140, y: 135, w: 300, h: 130, v: '5∠30° V', z: ['4 Ω', '−j2 Ω'], i: 'I', k: 'fig', top: '', bot: '' }),
          [{ sub: '電壓源 5∠30° V，串一個 4 Ω 電阻、一個 −j2 Ω 電容。', on: 'fig' },
           { sub: '問：電源送出多少平均功率？電阻吃多少？', on: '' }]),
        cs('算電流', 'THE CURRENT', [['I = 5∠30° / (4 − j2)'], ['= 5∠30° / 4.472∠−26.57°'], ['= 1.118∠56.57° A', 'ta']], [['串聯：總阻抗 4 − j2。', 0], ['換成極座標再相除。', 2]]),
        R.sc('誰吃了功率', 'WHO ABSORBS',
          chip(170, 140, '電源送出', '½(5)(1.118) cos(30° − 56.57°) = 2.5 W', 'b1', { fs: 14 }) +
          chip(170, 200, '電阻吃掉', '½|I|<sup>2</sup>(4) = 2.5 W', 'b2', { fs: 14, acc: true }) +
          chip(170, 260, '電容', 'cos 90° = 0 → 0 W', 'b3', { fs: 14 }) +
          R.T(470, 205, '2.5 = 2.5 + 0 ✓', { cls: 'ta', fs: 20, k: 'ok' }),
          [{ sub: '電源：½V<sub>m</sub>I<sub>m</sub>cos(θ<sub>v</sub> − θ<sub>i</sub>) = 2.5 W。', on: 'b1' },
           { sub: '電阻上電壓電流同相：2.5 W。', on: 'b2' },
           { sub: '電容電壓電流差 90°，平均 0 W。電源送的全部給了電阻。', on: 'b3 ok' }]),
        ans(['電源供給 2.5 W', '電阻吸收 2.5 W（電容 0 W）'], '答案：都是 2.5 W。')
      ];
    },
    'pp11-3': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT', R.single({ x: 140, y: 135, w: 300, h: 130, v: '320∠45° V', z: ['3 Ω', 'j1 Ω'], i: 'I', k: 'fig', top: '', bot: '' }),
          [{ sub: '跟 Example 11.3 一樣的串聯電路，只是電容換成電感 j1 Ω。', on: 'fig' }]),
        cs('電流與功率', 'CURRENT AND POWER',
          [['I = 320∠45° / (3 + j1) = 101.2∠26.57° A'], ['P<sub>R</sub> = ½|I|<sup>2</sup>(3) = 15.36 kW', 'ta'], ['P<sub>L</sub> = 0', 'ta'], ['P<sub>源</sub> = ½(320)(101.2) cos 18.43° = 15.36 kW', 'ta']],
          [['總阻抗 3 + j1 = 3.162∠18.43°，相除。', 0], ['電阻：½|I|<sup>2</sup>R。', 1], ['電感只存放能量，平均 0。', 2], ['電源送出的剛好等於電阻吃的。', 3]]),
        ans(['電阻 15.36 kW', '電感 0 W', '電源供給 15.36 kW'], '答案：功率守恆，15.36 kW。')
      ];
    },
    'ex11-4': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT',
          ckt({ x0: 110, dx: 140, src: { i: '4∠0° A' }, parts: [{ s: '20 Ω' }, { p: 'j10 Ω', gap: 0 }, { s: '−j5 Ω' }, { v: '60∠30° V' }] }, 'fig') +
          R.loopA(180, 200, 28, 'I<sub>1</sub>', 'l1') + R.loopA(330, 200, 28, 'I<sub>2</sub>', 'l2'),
          [{ sub: '左邊是 4 A 電流源，右邊是 60∠30° V 電壓源，中間 20 Ω、j10、−j5。', on: 'fig' },
           { sub: '設兩個網目電流 I<sub>1</sub>、I<sub>2</sub>。', on: 'l1 l2' }]),
        cs('網目分析', 'MESH CURRENTS',
          [['I<sub>1</sub> = 4 A（電流源在外圍）'], ['網目 2：(j10 − j5)I<sub>2</sub> − j10I<sub>1</sub> + 60∠30° = 0'], ['I<sub>2</sub> = 2 + j10.39 = 10.58∠79.1° A', 'ta']],
          [['網目 1 只有電流源經過：I<sub>1</sub> = 4 A。', 0], ['網目 2 繞一圈寫 KVL，j10 是共用的。', 1], ['解出 I<sub>2</sub>。', 2]]),
        R.sc('每個元件的功率', 'POWER OF EACH ELEMENT',
          R.calc(90, 106, 460, [['電流源：−½(184.98)(4) cos 6.21° = −367.8 W', 'r0', 'ta'], ['20 Ω：½(4)<sup>2</sup>(20) = 160 W', 'r1'], ['j10、−j5：0 W', 'r2'],
            ['電壓源：½(60)(10.58) cos(−49.1°) = 207.8 W', 'r3'], ['−367.8 + 160 + 207.8 = 0 ✓', 'r4', 'ta']], { k: 'cc', a: 'middle', lh: 30 }),
          [{ sub: '電流源電流從 + 端流出：負號，它在<b>供給</b> 367.8 W。', on: 'cc r0' },
           { sub: '電阻吃 160 W；電感、電容平均 0。', on: 'r1 r2' },
           { sub: '電壓源算出正的 207.8 W —— 它在<b>被充電</b>（吸收）。', on: 'r3' },
           { sub: '全部加起來 = 0，功率守恆。', on: 'r4' }]),
        ans(['電流源供給 367.8 W', '電壓源吸收 207.8 W', '20 Ω 吸收 160 W；L、C 0 W'], '答案：電流源一個在供電，其他人吃。')
      ];
    },
    'pp11-4': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT',
          ckt({ x0: 110, dx: 140, src: { v: '40∠0° V' }, parts: [{ s: '8 Ω' }, { p: '−j2 Ω', gap: 0 }, { s: 'j4 Ω' }, { v: '20∠90° V' }] }, 'fig') +
          R.loopA(180, 200, 28, 'I<sub>1</sub>', 'l1') + R.loopA(330, 200, 28, 'I<sub>2</sub>', 'l2'),
          [{ sub: '兩個電壓源，中間的 −j2 被兩個網目共用。', on: 'fig' }, { sub: '設網目電流 I<sub>1</sub>、I<sub>2</sub>（都順時針）。', on: 'l1 l2' }]),
        cs('網目分析', 'MESH CURRENTS',
          [['−40 + 8I<sub>1</sub> − j2(I<sub>1</sub> − I<sub>2</sub>) = 0'], ['j4I<sub>2</sub> + j20 − j2(I<sub>2</sub> − I<sub>1</sub>) = 0 → I<sub>1</sub> + I<sub>2</sub> = −10'], ['I<sub>1</sub> = 3 + j4 = 5∠53.13° A', 'ta'], ['I<sub>2</sub> = −13 − j4 A', 'ta']],
          [['左網目 KVL。', 0], ['右網目 KVL，整理成 I<sub>1</sub> + I<sub>2</sub> = −10。', 1], ['代回去解出兩個電流。', 3]]),
        cs('五個元件', 'FIVE ELEMENTS',
          [['8 Ω：½(25)(8) = 100 W'], ['40 V：−½(40)(3) = −60 W（供給）', 'ta'], ['j20 V：½Re(j20·I<sub>2</sub>*) = −40 W（供給）', 'ta'], ['j4、−j2：0 W'], ['−60 − 40 + 100 = 0 ✓', 'ta']],
          [['電阻：½|I<sub>1</sub>|<sup>2</sup>R。', 0], ['40 V 的電流從 + 端流出 → 供給 60 W。', 1], ['j20 V 算出負的 → 其實也在供給 40 W。', 2], ['電感、電容 0；總和 0。', 4]]),
        ans(['40 V 電源 −60 W；j20 V 電源 −40 W', '8 Ω 100 W；其他 0 W'], '答案：兩個電源一起供 100 W 給電阻。')
      ];
    },

    /* ═════ 11.3 ═════ */
    'ex11-5': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT',
          ckt({ x0: 100, dx: 110, src: { v: '10∠0° V' }, parts: [{ s: '4 Ω' }, { p: '8 Ω', p2: '−j6 Ω', gap: 0 }, { s: 'j5 Ω' }, { p: 'Z<sub>L</sub>', hl: 1 }] }, 'fig'),
          [{ sub: '負載 Z<sub>L</sub> 接在右邊。問：Z<sub>L</sub> 選多少，拿到的平均功率最大？', on: 'fig' },
           { sub: '做法：先把 Z<sub>L</sub> 左邊整坨縮成戴維寧等效。', on: '' }]),
        cs('戴維寧等效', 'THÉVENIN',
          [['Z<sub>Th</sub> = j5 + 4 ∥ (8 − j6)'], ['= 2.933 + j4.467 Ω', 'ta'], ['V<sub>Th</sub> = (8 − j6)/(12 − j6) × 10'], ['= 7.454∠−10.3° V', 'ta']],
          [['電壓源短路，從 Z<sub>L</sub> 往回看：4 Ω 並 (8 − j6)，再串 j5。', 1], ['開路時 j5 沒電流，V<sub>Th</sub> = (8 − j6) 支路的分壓。', 3]]),
        R.sc('共軛匹配', 'CONJUGATE MATCH',
          zp(130, 205, 18, [{ re: 2.933, im: 4.467, l: 'Z<sub>Th</sub>', k: 'z1' }, { re: 2.933, im: -4.467, l: 'Z<sub>L</sub> = Z<sub>Th</sub>*', k: 'z2', c: 'ln' }], { up: 100, down: 100, w: 140 }) +
          R.calc(340, 120, 280, [['Z<sub>L</sub> = 2.933 − j4.467 Ω', 'r0', 'ta'], ['電抗互相抵消', 'r1', 'tm'], ['P<sub>max</sub> = |V<sub>Th</sub>|<sup>2</sup>/(8R<sub>Th</sub>)', 'r2'], ['= 7.454<sup>2</sup>/(8 × 2.933) = 2.368 W', 'r3', 'ta']], { k: 'cc' }),
          [{ sub: 'Z<sub>Th</sub> 在上半平面（電感性）。', on: 'zax z1' },
           { sub: '最大功率：Z<sub>L</sub> 取它的<b>共軛</b> —— 對實軸鏡射。電抗抵消、電阻相等。', on: 'z2 cc r0 r1' },
           { sub: 'P<sub>max</sub> = |V<sub>Th</sub>|<sup>2</sup>/(8R<sub>Th</sub>) = 2.368 W。', on: 'r2 r3' }]),
        ans(['Z<sub>L</sub> = 2.933 − j4.467 Ω', 'P<sub>max</sub> = 2.368 W'], '答案：共軛匹配，2.368 W。')
      ];
    },
    'pp11-5': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT',
          ckt({ x0: 80, dx: 100, parts: [{ p: '8 Ω', gap: 0 }, { s: '−j4 Ω' }, { i: '12 A', gap: 0 }, { s: 'j10 Ω' }, { p: '5 Ω', gap: 80 }, { p: 'Z<sub>L</sub>', hl: 1 }] }, 'fig'),
          [{ sub: '12 A 電流源在中間，負載 Z<sub>L</sub> 在最右邊。', on: 'fig' }]),
        cs('戴維寧等效', 'THÉVENIN',
          [['Z<sub>Th</sub> = 5 ∥ (8 − j4 + j10) = 5 ∥ (8 + j6)'], ['= 3.415 + j0.7317 Ω', 'ta'], ['分流：I = 12 × (8 − j4)/(13 + j6) = 7.496∠−51.34° A'], ['V<sub>Th</sub> = 5I = 37.48∠−51.34° V', 'ta']],
          [['電流源開路：8、−j4、j10 串成一條，再並 5 Ω。', 1], ['12 A 分成左右兩路，流向右邊那路的電流。', 2], ['V<sub>Th</sub> = 5 Ω 上的電壓。', 3]]),
        cs('共軛匹配', 'CONJUGATE MATCH',
          [['Z<sub>L</sub> = Z<sub>Th</sub>* = 3.415 − j0.7317 Ω', 'ta'], ['P<sub>max</sub> = 37.48<sup>2</sup>/(8 × 3.415) ≈ 51.4 W', 'ta'], ['（課本寫 51.47 W，差在四捨五入）', 'tm']],
          [['負載取共軛。', 0], ['最大功率約 51.4 W。', 2]]),
        ans(['Z<sub>L</sub> = 3.415 − j0.7317 Ω', 'P<sub>max</sub> ≈ 51.4 W'], '答案：51.4 W。')
      ];
    },
    'ex11-6': () => {
      const R = RV();
      return [
        R.sc('負載只能是電阻', 'RESISTIVE LOAD ONLY',
          ckt({ x0: 100, dx: 100, src: { v: '150∠30° V' }, parts: [{ s: '40 Ω' }, { s: '−j30 Ω' }, { p: 'j20 Ω', gap: 90 }, { p: 'R<sub>L</sub>', hl: 1 }] }, 'fig'),
          [{ sub: '這次負載是純電阻 R<sub>L</sub>，沒辦法做共軛匹配。', on: 'fig' }]),
        cs('戴維寧等效', 'THÉVENIN',
          [['Z<sub>Th</sub> = (40 − j30) ∥ j20 = 9.412 + j22.35 Ω', 'ta'], ['V<sub>Th</sub> = j20/(40 − j10) × 150∠30° = 72.76∠134° V', 'ta']],
          [['電源短路：(40 − j30) 並 j20。', 0], ['開路電壓 = j20 上的分壓。', 1]]),
        R.sc('R<sub>L</sub> = |Z<sub>Th</sub>|', 'MATCH THE MAGNITUDE',
          zp(110, 250, 5, [{ re: 9.412, im: 22.35, l: 'Z<sub>Th</sub>', k: 'z1' }, { re: 24.25, im: 0, l: 'R<sub>L</sub> = 24.25', k: 'z2', c: 'ln', ly: 18, lx: -40 }], { up: 140, down: 20, w: 170 }) +
          R.g('arc', '<path class="ln2 dsh" style="fill:none" d="M' + f1(110 + 9.412 * 5) + ' ' + f1(250 - 22.35 * 5) + ' A121.25 121.25 0 0 1 ' + f1(110 + 24.25 * 5) + ' 250"/>') +
          R.calc(340, 120, 280, [['R<sub>L</sub> = |Z<sub>Th</sub>| = 24.25 Ω', 'r0', 'ta'], ['I = V<sub>Th</sub>/(Z<sub>Th</sub> + R<sub>L</sub>) = 1.8∠100.42° A', 'r1'], ['P = ½(1.8)<sup>2</sup>(24.25) = 39.29 W', 'r2', 'ta']], { k: 'cc' }),
          [{ sub: 'Z<sub>Th</sub> 是一支斜的箭頭。', on: 'zax z1' },
           { sub: '只能放電阻時，條件改成：R<sub>L</sub> = Z<sub>Th</sub> 的<b>長度</b>（把箭頭轉到實軸上）。', on: 'arc z2 cc r0' },
           { sub: '再算電流和功率：39.29 W。', on: 'r1 r2' }]),
        ans(['R<sub>L</sub> = 24.25 Ω', 'P<sub>max</sub> = 39.29 W'], '答案：R<sub>L</sub> = |Z<sub>Th</sub>|。')
      ];
    },
    'pp11-6': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT',
          ckt({ x0: 120, dx: 88, src: { v: '120∠60° V' }, parts: [{ s: '80 Ω' }, { s: 'j60 Ω' }, { p: '90 Ω', gap: 75 }, { p: '−j30 Ω', gap: 75 }, { p: 'R<sub>L</sub>', hl: 1 }] }, 'fig'),
          [{ sub: '可調電阻 R<sub>L</sub> 在最右邊，調到吸收最大功率。', on: 'fig' }]),
        cs('戴維寧等效', 'THÉVENIN',
          [['90 ∥ (−j30) = 9 − j27 Ω'], ['Z<sub>Th</sub> = (80 + j60) ∥ (9 − j27) = 17.18 − j24.57 Ω', 'ta'], ['V<sub>Th</sub> = (9 − j27)/(89 + j33) × 120∠60° = 35.98∠−31.91° V', 'ta']],
          [['先把兩個並聯合併。', 0], ['再跟 (80 + j60) 並聯。', 1], ['分壓求開路電壓。', 2]], null, { fs: 13.5 }),
        cs('純電阻負載', 'RESISTIVE LOAD',
          [['R<sub>L</sub> = |Z<sub>Th</sub>| = √(17.18<sup>2</sup> + 24.57<sup>2</sup>) ≈ 30 Ω', 'ta'], ['I = 35.98∠−31.91° / (47.16 − j24.57) = 0.6765 A'], ['P = ½(0.6765)<sup>2</sup>(30) = 6.86 W', 'ta']],
          [['R<sub>L</sub> 取 Z<sub>Th</sub> 的長度。', 0], ['負載電流。', 1], ['最大功率 6.86 W。', 2]]),
        ans(['R<sub>L</sub> ≈ 30 Ω', 'P<sub>max</sub> ≈ 6.863 W'], '答案：30 Ω、6.86 W。')
      ];
    },

    /* ═════ 11.4 ═════ */
    'ex11-7': () => {
      const R = RV();
      const fn = t => { const u = (t * 2) % 1 * 4; return u < 2 ? 5 * u / 10 : -1; };
      const sq = t => { const v = fn(t); return v * v; };
      return [
        R.sc('波形', 'THE WAVEFORM',
          wv(80, 180, 480, 60, fn, 'lna', 'w1') + R.T(80, 112, 'i(t)：0～2 s 從 0 爬到 10，2～4 s 是 −10，週期 4 s', { cls: 't', fs: 13, a: 'start', k: 'l1' }),
          [{ sub: '電流波形：前 2 秒斜線爬到 10 A，後 2 秒是 −10 A，週期 T = 4 s。', on: 'w1 l1' }]),
        R.sc('平方 → 平均 → 開根號', 'SQUARE, MEAN, ROOT',
          wv(80, 270, 260, 70, t => sq(t * 0.5), 'lna', 'w2') + R.T(80, 186, 'i<sup>2</sup>（負的也變正）', { cls: 'ta', fs: 12.5, a: 'start', k: 'l2' }) +
          R.calc(360, 108, 260, [['I<sub>rms</sub><sup>2</sup> = ¼[∫₀² 25t<sup>2</sup> dt + ∫₂⁴ 100 dt]', 'r0'], ['= ¼(200/3 + 200) = 66.67', 'r1'], ['I<sub>rms</sub> = 8.165 A', 'r2', 'ta']], { k: 'cc', lh: 30, fs: 13.5 }),
          [{ sub: '先平方：−10 變成 100，負號不見了。', on: 'w2 l2' },
           { sub: '一個週期內取平均：分兩段積分再除以 4。', on: 'cc r0 r1' },
           { sub: '開根號：I<sub>rms</sub> = 8.165 A。', on: 'r2' }]),
        cs('接上 2 Ω', 'INTO 2 Ω', [['P = I<sub>rms</sub><sup>2</sup>R = 66.67 × 2', ''], ['= 133.3 W', 'ta'], ['用 rms 算功率，不用再乘 ½', 'tm']], [['用有效值算功率，跟直流一樣。', 2]]),
        ans(['I<sub>rms</sub> = 8.165 A', 'P = 133.3 W'], '答案：8.165 A、133.3 W。')
      ];
    },
    'pp11-7': () => {
      const R = RV();
      const tri = t => { const u = (t * 3) % 1 * 2; return u < 1 ? u : 2 - u; };
      return [
        R.sc('三角波', 'TRIANGLE WAVE', wv(80, 250, 480, 120, tri, 'lna', 'w1') + R.T(80, 118, 'i = 16t（0～1 s）、16(2 − t)（1～2 s），峰值 16 A', { cls: 't', fs: 13, a: 'start', k: 'l1' }),
          [{ sub: '三角波：上升、下降對稱，週期 2 s、峰值 16 A。', on: 'w1 l1' }]),
        cs('只算一半就好', 'USE SYMMETRY',
          [['I<sub>rms</sub><sup>2</sup> = ∫₀¹ (16t)<sup>2</sup> dt = 256/3 = 85.33'], ['I<sub>rms</sub> = 9.238 A = 16/√3', 'ta'], ['P = 85.33 × 9 = 768 W', 'ta']],
          [['上升段和下降段的 i<sup>2</sup> 一樣 → 只算 0～1 秒。', 0], ['三角波的 rms = 峰值 / √3。', 1], ['接 9 Ω：768 W。', 2]]),
        ans(['I<sub>rms</sub> = 9.238 A', 'P = 768 W'], '答案：9.238 A、768 W。')
      ];
    },
    'ex11-8': () => {
      const R = RV();
      const hw = t => { const u = (t * 1.5) % 1; return u < 0.5 ? Math.sin(u * 2 * Math.PI) : 0; };
      return [
        R.sc('半波整流', 'HALF-WAVE', wv(80, 240, 480, 110, hw, 'lna', 'w1') + R.T(80, 112, 'v = 10 sin t（0～π），0（π～2π）', { cls: 't', fs: 13, a: 'start', k: 'l1' }),
          [{ sub: '正弦波的負半週被砍掉：一半時間 10 sin t、一半時間 0。', on: 'w1 l1' }]),
        cs('平方的平均', 'MEAN SQUARE',
          [['V<sub>rms</sub><sup>2</sup> = (1/2π)∫₀<sup>π</sup> 100 sin<sup>2</sup> t dt'], ['sin<sup>2</sup> t = ½(1 − cos 2t)', 'tm'], ['= 25 → V<sub>rms</sub> = 5 V', 'ta'], ['P = 25/10 = 2.5 W', 'ta']],
          [['後半週是 0，只積前半。', 0], ['sin<sup>2</sup> 用半角公式換掉。', 1], ['半波整流 rms = 峰值 / 2。', 2], ['接 10 Ω：2.5 W。', 3]]),
        ans(['V<sub>rms</sub> = 5 V', 'P = 2.5 W'], '答案：5 V、2.5 W。')
      ];
    },
    'pp11-8': () => {
      const R = RV();
      return [
        R.sc('全波整流', 'FULL-WAVE', wv(80, 250, 480, 120, t => Math.abs(Math.sin(t * 3 * Math.PI)), 'lna', 'w1') + R.T(80, 112, 'v = |100 sin t|，週期 π', { cls: 't', fs: 13, a: 'start', k: 'l1' }),
          [{ sub: '負半週被翻上來：每 π 就重複一次。', on: 'w1 l1' }]),
        cs('平方跟原本一樣', 'SAME SQUARE',
          [['V<sub>rms</sub><sup>2</sup> = (1/π)∫₀<sup>π</sup> 10000 sin<sup>2</sup> t dt = 5000'], ['V<sub>rms</sub> = 70.71 V = 100/√2', 'ta'], ['P = 5000/6 = 833.3 W', 'ta']],
          [['平方之後，翻上來的跟原本一模一樣。', 0], ['所以 rms 跟沒整流的正弦波一樣：峰值 / √2。', 1], ['接 6 Ω：833.3 W。', 2]]),
        ans(['V<sub>rms</sub> = 70.71 V', 'P = 833.3 W'], '答案：70.71 V、833.3 W。')
      ];
    },

    /* ═════ 11.5 ═════ */
    'ex11-9': () => {
      const R = RV();
      return [
        R.sc('電流領先 30°', 'CURRENT LEADS',
          R.ph(170, 205, 80, [{ a: -20, l: 'V：−20°', c: 'ln', k: 'pv' }, { a: 10, m: 0.7, l: 'I：10°', k: 'pi' }], { k: 'ax' }) +
          R.calc(340, 120, 280, [['S = V<sub>rms</sub>I<sub>rms</sub> = (120/√2)(4/√2) = 240 VA', 'r0'], ['pf = cos(−20° − 10°) = 0.866', 'r1', 'ta'], ['電流領先 → 超前（電容性）', 'r2', 'tm']], { k: 'cc', fs: 13.5 }),
          [{ sub: '電壓 120∠−20°、電流 4∠10°：電流比電壓早 30°。', on: 'ax pv pi' },
           { sub: '視在功率 = 有效值相乘：240 VA。', on: 'cc r0' },
           { sub: 'pf = cos 30° = 0.866，電流領先 → 超前。', on: 'r1 r2' }]),
        R.sc('反推元件', 'FIND R AND C',
          zp(130, 150, 3.4, [{ re: 25.98, im: 0, l: 'R = 25.98', k: 'zr', c: 'ln', ly: -8 }, { re: 25.98, im: -15, fx: 25.98, fy: 0, l: '−j15', k: 'zx', c: 'ln dsh' }, { re: 25.98, im: -15, l: '30∠−30°', k: 'zz', ly: 6, lx: -10, la: 'end' }], { up: 30, down: 80, w: 130 }) +
          R.calc(340, 120, 280, [['Z = 120∠−20° / 4∠10° = 30∠−30° Ω', 'r0'], ['= 25.98 − j15 Ω', 'r1'], ['C = 1/(15 × 100π) = 212.2 μF', 'r2', 'ta']], { k: 'cc', fs: 13.5 }),
          [{ sub: 'Z = V/I = 30∠−30° Ω。', on: 'zax zz cc r0' },
           { sub: '實部是電阻 25.98 Ω，虛部 −15 是電容。', on: 'zr zx r1' },
           { sub: '1/(ωC) = 15，ω = 100π → C = 212.2 μF。', on: 'r2' }]),
        ans(['S = 240 VA，pf = 0.866（leading）', '25.98 Ω 串聯 212.2 μF'], '答案：電阻串電容。')
      ];
    },
    'pp11-9': () => {
      const R = RV();
      return [
        R.sc('pf 只看阻抗角', 'pf FROM THE ANGLE',
          zp(130, 230, 2.6, [{ re: 60, im: 40, l: '72.11∠33.69°', k: 'zz' }], { up: 130, down: 20, w: 180 }) +
          R.calc(360, 120, 260, [['Z = 60 + j40 = 72.11∠33.69° Ω', 'r0'], ['pf = cos 33.69° = 0.8321', 'r1', 'ta'], ['角度為正 → 落後（電感性）', 'r2', 'tm']], { k: 'cc', fs: 13.5 }),
          [{ sub: '阻抗 60 + j40 在上半平面：電感性。', on: 'zax zz cc r0' }, { sub: 'pf = cos(阻抗角) = 0.8321，落後。', on: 'r1 r2' }]),
        cs('視在功率', 'APPARENT POWER',
          [['V<sub>rms</sub> = 320/√2 = 226.3 V'], ['I<sub>rms</sub> = 226.3/72.11 = 3.138 A'], ['S = 710 VA（= 710∠33.69°）', 'ta']], [['先換有效值。', 1], ['相乘：710 VA。', 2]]),
        ans(['pf = 0.8321（lagging）', 'S = 710∠33.69° VA'], '答案：0.8321 落後、710 VA。')
      ];
    },
    'ex11-10': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT', ckt({ x0: 130, dx: 120, src: { v: '30∠0° V rms' }, parts: [{ s: '6 Ω' }, { p: '−j2 Ω', gap: 100 }, { p: '4 Ω' }] }, 'fig'),
          [{ sub: '6 Ω 串上「−j2 並 4 Ω」。問：從電源看進去的 pf、送出的功率。', on: 'fig' }]),
        cs('總阻抗與 pf', 'TOTAL Z AND pf',
          [['Z = 6 + 4 ∥ (−j2) = 6.8 − j1.6 Ω'], ['= 7∠−13.24° Ω'], ['pf = cos 13.24° = 0.9734（超前）', 'ta'], ['P = I<sub>rms</sub><sup>2</sup>R = 4.286<sup>2</sup> × 6.8 = 125 W', 'ta']],
          [['並聯先合併，再加 6 Ω。', 1], ['阻抗角為負 → 電容性 → 超前。', 2], ['電流 30/7 = 4.286 A，只算實部的功率：125 W。', 3]]),
        ans(['pf = 0.9734（leading）', 'P = 125 W'], '答案：0.9734 超前、125 W。')
      ];
    },
    'pp11-10': () => {
      const R = RV();
      return [
        R.sc('題目畫成圖', 'THE CIRCUIT', ckt({ x0: 120, dx: 110, src: { v: '165∠0° V rms' }, parts: [{ s: '10 Ω' }, { p: 'j4 Ω', gap: 0 }, { s: '8 Ω' }, { p: '−j6 Ω' }] }, 'fig'),
          [{ sub: '10 Ω 串上「j4 並 (8 − j6)」。', on: 'fig' }]),
        cs('總阻抗、pf、功率', 'Z, pf, P',
          [['j4 ∥ (8 − j6) = 1.882 + j4.471 Ω'], ['Z = 11.882 + j4.471 = 12.69∠20.62° Ω'], ['pf = cos 20.62° = 0.936（落後）', 'ta'], ['P = 13.0<sup>2</sup> × 11.882 = 2.008 kW', 'ta']],
          [['並聯先算。', 0], ['加上 10 Ω。', 1], ['角度為正 → 落後。', 2], ['I = 165/12.69 = 13.0 A，P = I<sup>2</sup>R。', 3]]),
        ans(['pf = 0.936（lagging）', 'P = 2.008 kW'], '答案：0.936 落後、2.008 kW。')
      ];
    },

    /* ═════ 11.6 ═════ */
    'ex11-11': () => {
      const R = RV();
      return [
        cs('複功率', 'COMPLEX POWER',
          [['V<sub>rms</sub> = (60/√2)∠−10°，I<sub>rms</sub> = (1.5/√2)∠50°'], ['S = V<sub>rms</sub>I<sub>rms</sub>* = 45∠−60° VA', 'ta'], ['= 22.5 − j38.97 VA']],
          [['先換成 rms 相量。', 0], ['S = VI*：電流的角度要變號。', 1], ['換成直角座標。', 2]]),
        R.sc('功率三角形', 'POWER TRIANGLE',
          ptri(110, 140, 22.5, -38.97, 3.6, 'P = 22.5 W', 'Q = −38.97 VAR', '|S| = 45 VA') +
          R.calc(360, 120, 260, [['P = 22.5 W', 'r0'], ['Q = −38.97 VAR（電容性）', 'r1'], ['pf = cos 60° = 0.5 超前', 'r2', 'ta'], ['Z = 40∠−60° Ω', 'r3']], { k: 'cc' }),
          [{ sub: '實部 P = 22.5 W：真正被用掉的。', on: 'tp cc r0' },
           { sub: '虛部 Q = −38.97 VAR，往下 → 電容性。', on: 'tq r1' },
           { sub: '斜邊 |S| = 45 VA；pf = 0.5 超前。阻抗 Z = V/I = 40∠−60°。', on: 'ts r2 r3' }]),
        ans(['S = 45∠−60° VA，|S| = 45 VA', 'P = 22.5 W，Q = −38.97 VAR', 'pf = 0.5（leading），Z = 40∠−60° Ω'], '答案一次全部。')
      ];
    },
    'pp11-11': () => {
      const R = RV();
      return [
        R.sc('複功率與三角形', 'COMPLEX POWER',
          ptri(110, 270, 15.05, 41.35, 3.6, 'P = 15.05 W', 'Q = 41.35 VAR', '44 VA') +
          R.calc(330, 120, 290, [['S = 110∠85° × 0.4∠−15° = 44∠70° VA', 'r0'], ['P = 15.05 W，Q = 41.35 VAR', 'r1'], ['pf = cos 70° = 0.342 落後', 'r2', 'ta'], ['Z = 110∠85°/0.4∠15° = 275∠70° Ω', 'r3']], { k: 'cc', fs: 13.5 }),
          [{ sub: '已經是 rms：S = VI*，mA 記得換成 A。', on: 'cc r0' },
           { sub: 'P、Q 是三角形的兩股。', on: 'tp tq ts r1' },
           { sub: 'Q 為正 → 電感性 → 落後；阻抗 275∠70° Ω。', on: 'r2 r3' }]),
        ans(['S = 44∠70° VA，|S| = 44 VA', 'P = 15.05 W，Q = 41.35 VAR', 'pf = 0.342（lagging），Z = 94.06 + j258.4 Ω'], '答案一次全部。')
      ];
    },
    'ex11-12': () => {
      const R = RV();
      return [
        R.sc('由 kVA 與 pf 拆出 P、Q', 'SPLIT S INTO P AND Q',
          ptri(90, 270, 10.272, 6.204, 16, 'P = 10.272 kW', 'Q = 6.204 kVAR', 'S = 12 kVA') +
          R.calc(392, 120, 230, [['θ = cos<sup>−1</sup> 0.856 = 31.13°', 'r0'], ['P = 12 × 0.856 = 10.272 kW', 'r1'], ['Q = 12 × sin θ = 6.204 kVAR', 'r2', 'ta']], { k: 'cc', fs: 13.5 }),
          [{ sub: '先由 pf 求角度：31.13°。', on: 'ts cc r0' },
           { sub: '三角形的底：P = S cos θ。', on: 'tp r1' },
           { sub: '高：Q = S sin θ；落後 → Q 為正。（課本把 Q 單位寫成 kVA，應為 kVAR）', on: 'tq r2' }]),
        cs('電流與阻抗', 'CURRENT AND IMPEDANCE',
          [['I<sub>rms</sub>* = S/V = 100∠31.13° A'], ['I<sub>rms</sub> = 100∠−31.13° A → I<sub>m</sub> = 141.4 A', 'ta'], ['Z = 120/100∠−31.13° = 1.2∠31.13° Ω', 'ta']],
          [['S = VI* → 先拿到 I 的共軛。', 0], ['取共軛、乘 √2 得峰值。', 1], ['Z = V/I。', 2]]),
        ans(['P = 10.272 kW，Q = 6.204 kVAR', 'I<sub>m</sub> = 141.4 A', 'Z = 1.2∠31.13° Ω'], '答案一次全部。')
      ];
    },
    'pp11-12': () => {
      const R = RV();
      return [
        R.sc('已知 Q 求 S', 'FROM Q TO S',
          ptri(110, 120, 26.8, -100, 1.6, 'P', 'Q = −100 kVAR', '|S| = 103.53 kVA') +
          R.calc(330, 120, 290, [['pf = cos(−75°) = 0.2588 超前', 'r0', 'ta'], ['|S| = |Q|/sin 75° = 103.53 kVA', 'r1', 'ta'], ['V<sub>rms</sub> = √(|S|·|Z|) = 5.087 kV', 'r2', 'ta']], { k: 'cc', fs: 13.5 }),
          [{ sub: '阻抗角 −75°：電容性，超前，pf = 0.2588。', on: 'cc r0' },
           { sub: '三角形：已知高 100 kVAR 和角度 75°，斜邊 = 100/sin 75°。', on: 'tq ts tp r1' },
           { sub: '|S| = V<sup>2</sup>/|Z| → V = √(|S|·|Z|) = 5.087 kV。', on: 'r2' }]),
        ans(['pf = 0.2588（leading）', '|S| = 103.53 kVA', 'V<sub>rms</sub> = 5.087 kV'], '答案一次全部。')
      ];
    },

    /* ═════ 11.7 ═════ */
    'ex11-13': () => {
      const R = RV();
      return [
        R.sc('電源、線路、負載', 'SOURCE, LINE, LOAD',
          ckt({ x0: 130, dx: 110, src: { v: '220∠0° V rms' }, parts: [{ s: '4 Ω' }, { s: 'j2 Ω', gap: 0 }, { p: '15 Ω', p2: '−j10 Ω' }] }, 'fig') +
          R.T(130, 300, '電源', { cls: 'ts', fs: 12, k: 'n1' }) + R.T(240, 300, '線路', { cls: 'ts', fs: 12, k: 'n1' }) + R.T(350, 300, '負載', { cls: 'ts', fs: 12, k: 'n1' }),
          [{ sub: '電源經過傳輸線（4 + j2 Ω）送到負載（15 − j10 Ω）。', on: 'fig n1' }]),
        cs('先算電流', 'THE CURRENT', [['Z = (4 + j2) + (15 − j10) = 19 − j8 Ω'], ['I = 220 / 20.62∠−22.83° = 10.67∠22.83° A', 'ta']], [['串聯直接加。', 0], ['相除。', 1]]),
        R.sc('三份複功率', 'THREE COMPLEX POWERS',
          R.calc(90, 106, 460, [['電源：S = V I* = 2163.5 − j910.8 VA', 'r0', 'ta'], ['線路：|I|<sup>2</sup>(4 + j2) = 455.4 + j227.7 VA', 'r1'], ['負載：|I|<sup>2</sup>(15 − j10) = 1708 − j1139 VA', 'r2'], ['線路 + 負載 ≈ 電源 ✓', 'r3', 'ta']], { k: 'cc', a: 'middle', lh: 32 }),
          [{ sub: '電源送出 S = VI*。', on: 'cc r0' }, { sub: '串聯元件用 |I|<sup>2</sup>Z 最快。', on: 'r1 r2' }, { sub: '加起來 = 電源送出的：複功率守恆。', on: 'r3' }]),
        ans(['電源 2163.5 W、910.8 VAR（leading）', '線路 455.4 W、227.7 VAR', '負載 1708 W、1139 VAR（leading）'], '答案：複功率守恆。')
      ];
    },
    'pp11-13': () => {
      const R = RV();
      return [
        R.sc('從 60 Ω 倒推', 'WORK BACKWARD',
          ckt({ x0: 120, dx: 120, src: { v: 'V' }, parts: [{ s: '20 Ω' }, { p: '30 Ω', p2: '−j10 Ω', gap: 120 }, { p: 'j20 Ω', p2: '60 Ω', hl: 0 }] }, 'fig'),
          [{ sub: '只知道 60 Ω 吃了 240 W。從它倒推回電源。', on: 'fig' }]),
        cs('一步一步倒推', 'BACKWARD STEPS',
          [['|I<sub>2</sub>|<sup>2</sup>·60 = 240 → I<sub>2</sub> = 2∠0° A'], ['V<sub>p</sub> = 2(60 + j20) = 120 + j40 V'], ['I<sub>1</sub> = V<sub>p</sub>/(30 − j10) = 3.2 + j2.4 A'], ['I = 5.2 + j2.4 A'], ['V = 20I + V<sub>p</sub> = 240.7∠21.45° V', 'ta']],
          [['60 Ω 的電流。', 0], ['並聯兩端的電壓。', 1], ['另一支路電流。', 2], ['KCL 加起來。', 3], ['再加 20 Ω 的壓降：V。', 4]], null, { fs: 13.5 }),
        cs('各支路複功率', 'EACH BRANCH',
          [['20 Ω：|I|<sup>2</sup>·20 = 656 VA'], ['(30 − j10)：16(30 − j10) = 480 − j160 VA'], ['(60 + j20)：4(60 + j20) = 240 + j80 VA'], ['總和 1376 − j80 VA', 'ta']],
          [['每條用 |I|<sup>2</sup>Z。', 2], ['加起來就是電源送出的。', 3]]),
        ans(['V = 240.7∠21.45° V', '656、480 − j160、240 + j80 VA', '總 1376 − j80 VA'], '答案：倒推完成。')
      ];
    },
    'ex11-14': () => {
      const R = RV();
      return [
        R.sc('兩個並聯負載', 'TWO LOADS', ckt({ x0: 150, dx: 110, src: { v: '120∠10° V rms' }, parts: [{ p: 'Z<sub>1</sub> = 60∠−30°', gap: 160 }, { p: 'Z<sub>2</sub> = 40∠45°' }] }, 'fig'),
          [{ sub: 'Z<sub>1</sub>（電容性）、Z<sub>2</sub>（電感性）並聯在 120 V 上。', on: 'fig' }]),
        R.sc('三角形頭尾接起來', 'ADD THE TRIANGLES',
          R.g('t1', R.D.arrow(80, 220, f1(80 + 207.85 * 0.55), f1(220 + 120 * 0.55), null, 'ln') + R.T(130, 270, 'S<sub>1</sub> = 207.85 − j120', { cls: 't', fs: 12.5, a: 'start' })) +
          R.g('t2', R.D.arrow(f1(80 + 207.85 * 0.55), f1(220 + 120 * 0.55), f1(80 + 462.4 * 0.55), f1(220 - 134.6 * 0.55), null, 'lna') + R.T(f1(80 + 462.4 * 0.55) - 10, f1(220 - 134.6 * 0.55) - 8, 'S<sub>2</sub> = 254.6 + j254.6', { cls: 'ta', fs: 12.5, a: 'end' })) +
          R.g('tt', R.D.arrow(80, 220, f1(80 + 462.4 * 0.55), f1(220 - 134.6 * 0.55), null, 'ln dsh') + R.T(260, 196, 'S<sub>t</sub> = 462.4 + j134.6', { cls: 't', fs: 13 })) +
          R.calc(410, 230, 210, [['|S<sub>t</sub>| = 481.6 VA', 'r0', 'ta'], ['≠ 240 + 360 = 600', 'r1', 'tm']], { k: 'cc', lh: 28 }),
          [{ sub: '每個負載的複功率：S = V<sup>2</sup>/Z*。S<sub>1</sub> 往下（電容性）。', on: 't1' },
           { sub: 'S<sub>2</sub> 往上（電感性）。複功率是箭頭，頭尾接起來相加。', on: 't2' },
           { sub: '總和 S<sub>t</sub> = 462.4 + j134.6。', on: 'tt' },
           { sub: '注意：|S<sub>t</sub>| = 481.6，不是 240 + 360。視在功率不能直接加。', on: 'cc r0 r1' }]),
        ans(['|S| = 481.6 VA、P = 462.4 W', 'Q = 134.6 VAR、pf = 0.96（lagging）'], '答案：複功率相加，視在功率不行。')
      ];
    },
    'pp11-14': () => {
      const R = RV();
      return [
        cs('兩個負載的 Q', 'Q OF EACH LOAD',
          [['負載 1：2 kW、pf 0.75 超前 → Q<sub>1</sub> = −1.764 kVAR'], ['負載 2：4 kW、pf 0.95 落後 → Q<sub>2</sub> = +1.315 kVAR'], ['S = 6 + j(−1.764 + 1.315) = 6 − j0.449 kVA', 'ta'], ['pf = 6/6.017 = 0.9972（超前）', 'ta']],
          [['Q = P tan θ；超前取負。', 0], ['落後取正。', 1], ['P 加 P、Q 加 Q。', 2], ['總 Q 為負 → 超前。', 3]]),
        ans(['pf = 0.9972（leading）', 'S = 6 − j0.4495 kVA'], '答案：0.9972 超前。')
      ];
    },

    /* ═════ 11.8 ═════ */
    'ex11-15': () => {
      const R = RV();
      return [
        R.sc('校正前後的三角形', 'BEFORE AND AFTER',
          ptri(90, 270, 4, 3, 40, 'P = 4 kW', 'Q<sub>1</sub> = 3 kVAR', 'S<sub>1</sub> = 5 kVA', { kp: 'tp', kq: 'tq', ks: 'ts' }) +
          R.g('t2', R.D.arrow(90, 270, 250, f1(270 - 1.3144 * 40), null, 'lna') + R.T(170, 236, 'S<sub>2</sub> = 4.21 kVA', { cls: 'ta', fs: 12.5 })) +
          R.g('qc', '<line class="lna" style="stroke-width:4" x1="242" y1="150" x2="242" y2="' + f1(270 - 1.3144 * 40) + '"/>' + R.T(258, 160, 'Q<sub>C</sub> = 1685.6 VAR', { cls: 'ta', fs: 13, a: 'start' })) +
          R.calc(400, 120, 220, [['θ<sub>1</sub> = 36.87° → Q<sub>1</sub> = 3000', 'r0'], ['θ<sub>2</sub> = 18.19° → Q<sub>2</sub> = 1314.4', 'r1'], ['Q<sub>C</sub> = 1685.6 VAR', 'r2', 'ta']], { k: 'cc', fs: 13 }),
          [{ sub: '校正前：P = 4 kW、pf 0.8 → Q<sub>1</sub> = 3000 VAR。', on: 'tp tq ts cc r0' },
           { sub: '並聯電容不改變 P。pf 拉到 0.95 → Q<sub>2</sub> = 1314.4 VAR。', on: 't2 r1' },
           { sub: '電容要吃掉的就是差：Q<sub>C</sub> = 1685.6 VAR。', on: 'qc r2' }]),
        cs('電容值', 'THE CAPACITOR',
          [['C = Q<sub>C</sub>/(ωV<sub>rms</sub><sup>2</sup>)'], ['= 1685.6/(2π·60·120<sup>2</sup>)'], ['= 310.5 μF', 'ta'], ['耐壓要大於峰值 ≈ 170 V', 'tm']],
          [['電容的 Q = ωCV<sup>2</sup>，倒過來。', 1], ['C = 310.5 μF。', 3]]),
        ans(['C = 310.5 μF'], '答案：310.5 μF。')
      ];
    },
    'pp11-15': () => {
      const R = RV();
      return [
        cs('校正到 pf = 1', 'TO UNITY pf',
          [['pf = 1 → Q<sub>2</sub> = 0'], ['Q<sub>C</sub> = 140 kVAR（全部吃掉）'], ['C = 140000/(2π·60·110<sup>2</sup>)'], ['= 30.69 mF', 'ta']],
          [['校正到 1：三角形被壓平，Q 全部抵消。', 1], ['C = Q<sub>C</sub>/(ωV<sup>2</sup>) = 30.69 mF。這題連 P 都不用算。', 3]]),
        ans(['C = 30.69 mF'], '答案：30.69 mF。')
      ];
    },

    /* ═════ 11.9 ═════ */
    'ex11-16': () => {
      const R = RV();
      return [
        R.sc('瓦特計量誰', 'WHAT THE WATTMETER READS',
          ckt({ x0: 135, dx: 100, src: { v: '150∠0° V rms' }, parts: [{ s: '12 Ω' }, { s: 'j10 Ω' }, { w: 1 }, { p: '8 Ω', p2: '−j6 Ω', hl: 1 }] }, 'fig'),
          [{ sub: '瓦特計的電流線圈串在負載前面、電壓線圈跨在負載上。', on: 'fig' },
           { sub: '所以它讀的是 (8 − j6) Ω 負載吃的平均功率。', on: '' }]),
        cs('算負載功率', 'LOAD POWER',
          [['I = 150/(20 + j4) A'], ['S = VI* = 150<sup>2</sup>(8 − j6)/416 = 432.7 − j324.5 VA'], ['讀數 = Re(S) = 432.7 W', 'ta'], ['（課本把 S 寫成 423.7，實部應為 432.7）', 'tm']],
          [['總阻抗 (12 + j10) + (8 − j6) = 20 + j4。', 0], ['負載複功率。', 1], ['瓦特計讀實部：432.7 W。', 3]]),
        ans(['432.7 W'], '答案：432.7 W。')
      ];
    },
    'pp11-16': () => {
      const R = RV();
      return [
        R.sc('瓦特計在電源出口', 'METER AT THE SOURCE',
          ckt({ x0: 135, dx: 90, src: { v: '120∠30° V rms' }, parts: [{ w: 1 }, { s: '4 Ω' }, { s: '−j2 Ω' }, { p: 'j9 Ω', gap: 80 }, { p: '12 Ω' }] }, 'fig'),
          [{ sub: '瓦特計接在電源出口 → 讀的是整個電路吃的功率。', on: 'fig' }]),
        cs('整個電路的功率', 'TOTAL POWER',
          [['j9 ∥ 12 = 4.32 + j5.76 Ω'], ['Z = 8.32 + j3.76 Ω，|Z|<sup>2</sup> = 83.36'], ['|I|<sup>2</sup> = 120<sup>2</sup>/83.36 = 172.7'], ['P = 172.7 × 8.32 = 1437 W', 'ta']],
          [['並聯先合併。', 0], ['加上串聯的部分。', 1], ['只看實部：P = |I|<sup>2</sup>R。', 3]]),
        ans(['1.437 kW'], '答案：1.437 kW。')
      ];
    },
    'ex11-17': () => {
      const R = RV();
      return [
        R.sc('兩段式電費', 'TWO-PART RATE',
          bars(70, 150, 0.0256, [['需量 $8,000', 8000, 'acc'], ['前 5 萬度 $4,000', 4000], ['其餘 $7,500', 7500]], 'b') +
          R.calc(110, 210, 420, [['需量：$5 × 1600 kW = $8,000', 'r0'], ['電能：$0.08 × 50,000 + $0.05 × 150,000', 'r1'], ['合計 $19,500', 'r2', 'ta']], { k: 'cc', a: 'middle', lh: 28 }),
          [{ sub: '電費分兩部分。第一部分「需量費」：看最大需量 1600 kW。', on: 'b0 cc r0' },
           { sub: '第二部分「電能費」：200 MWh = 200,000 度，前 5 萬度較貴。', on: 'b1 b2 r1' },
           { sub: '加起來 $19,500。', on: 'r2' }]),
        ans(['$19,500'], '答案：$19,500。')
      ];
    },
    'pp11-17': () => {
      const R = RV();
      return [
        R.sc('同一個費率', 'SAME RATE',
          bars(70, 150, 0.0026, [['需量 $160,000', 160000, 'acc'], ['', 4000], ['$22,500', 22500]], 'b') +
          R.calc(110, 210, 420, [['需量：$5 × 32,000 = $160,000', 'r0'], ['電能：$4,000 + $0.05 × 450,000 = $26,500', 'r1'], ['合計 $186,500', 'r2', 'ta']], { k: 'cc', a: 'middle', lh: 28 }),
          [{ sub: '造紙廠最大需量很大：需量費就佔了大部分。', on: 'b0 cc r0' }, { sub: '電能費：前 5 萬度 8 美分、其餘 45 萬度 5 美分。', on: 'b1 b2 r1' }, { sub: '合計 $186,500。', on: 'r2' }]),
        ans(['$186,500'], '答案：$186,500。')
      ];
    },
    'ex11-18': () => {
      const R = RV();
      return [
        cs('功因罰款', 'PF PENALTY',
          [['用電：300 kW × 520 h = 156,000 kWh'], ['pf 0.80 比 0.85 低 5 個 0.01 → 罰 0.5%'], ['156,000 × 0.5% = 780 度 → 156,780 度'], ['$0.06 × 156,780 = $9,406.80', 'ta']],
          [['先算一個月用了幾度。', 0], ['pf 太低要罰：每低 0.01 罰 0.1%。', 1], ['罰款換成多算的度數。', 2], ['乘電價。', 3]]),
        ans(['$9,406.80'], '答案：$9,406.80。')
      ];
    },
    'pp11-18': () => {
      const R = RV();
      return [
        cs('功因減免', 'PF CREDIT',
          [['用電：800 × 20 × 26 = 416,000 kWh'], ['pf 0.88 比 0.85 高 3 個 0.01 → 減免 0.3%'], ['416,000 − 1,248 = 414,752 度'], ['$0.06 × 414,752 = $24,885.12', 'ta']],
          [['一個月用電。', 0], ['pf 比標準高 → 這次是減免。', 1], ['少算 1,248 度。', 2], ['乘電價。', 3]]),
        ans(['$24,885.12'], '答案：$24,885.12。')
      ];
    }
  };

  BANK.items.forEach(it => { if (ST[it.id]) it.story = ST[it.id]; });
})();
