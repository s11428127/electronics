/* ============================================================
   電子實習 第四章 整流器濾波 —— 故事模式
   主線謎題：整流完是一顆一顆的駝峰，手機要平的直流，怎麼抹平？
   比喻：二極體＝單向閥、電容＝水塔、負載 R＝水龍頭。
   恍然大悟：實驗 6 組的 r%（326、120、120、14.7、14.7、1.5）→ 漣波只看 RC。
   數字：Vpp = 10 V → Vm = 5 V → Vp ≈ 4.3 V；T = 16.7 ms。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const TAU = 2 * Math.PI;
  const P = (fn, x0, x1, n) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + fn(x).toFixed(1); } return d; };
  const path = (d, cls, key, extra) => '<path class="' + cls + '" style="fill:none;' + (extra || '') + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  const card = (x, y, w, h, extra) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"' + (extra || '') + '/>';
  const box = (x, y, w, h, label, key, acc) => g(key, '<rect class="' + (acc ? 'accw' : 'bgw') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.6"/>' +
    T(x + w / 2, y + h / 2, label, { cls: acc ? 'ta' : 't', fs: 14, dy: '.35em' }));
  const sine = (x0, x1, yc, A, per) => P(x => yc - A * Math.sin(TAU * (x - x0) / per), x0, x1, 160);
  const half = (x0, x1, yc, A, per) => P(x => yc - Math.max(0, A * Math.sin(TAU * (x - x0) / per)), x0, x1, 200);
  /* 理想濾波：v = max(v·e^(−dθ/RC), v_in − Vγ)，rc 以「週期」為單位 */
  function filt(x0, x1, yc, A, Ag, per, rc, bridge) {
    let v = 0, d = '';
    const n = 400;
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n, s = A * Math.sin(TAU * (x - x0) / per), vin = bridge ? Math.abs(s) : s;
      if (i) v *= Math.exp(-((x1 - x0) / n / per) / rc);
      v = Math.max(v, vin - Ag, 0);
      d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (yc - v).toFixed(1);
    }
    return d;
  }
  /* 二極體符號（水平，往右導通） */
  const diode = (x, y, key, cls) => g(key, '<path class="' + (cls || 'ln') + '" d="M' + (x - 30) + ' ' + y + ' H' + (x - 10) + ' M' + (x + 10) + ' ' + y + ' H' + (x + 30) + '"/>' +
    '<path class="' + (cls === 'lna' ? 'accw' : 'bgw') + '" d="M' + (x - 10) + ' ' + (y - 11) + ' L' + (x - 10) + ' ' + (y + 11) + ' L' + (x + 10) + ' ' + y + ' Z" style="stroke:' + (cls === 'lna' ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.8"/>' +
    '<path class="' + (cls || 'ln') + '" d="M' + (x + 10) + ' ' + (y - 11) + ' V' + (y + 11) + '" style="stroke-width:2.4"/>');
  const src = (x, y, key) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="22"/>' + path('M' + (x - 12) + ' ' + y + ' C' + (x - 7) + ' ' + (y - 12) + ' ' + (x - 2) + ' ' + (y - 12) + ' ' + x + ' ' + y + ' S' + (x + 7) + ' ' + (y + 12) + ' ' + (x + 12) + ' ' + y, 'ln'));
  const capV = (x, y1, y2) => { const m = (y1 + y2) / 2; return '<path class="ln" d="M' + x + ' ' + y1 + ' V' + (m - 6) + ' M' + x + ' ' + (m + 6) + ' V' + y2 + '"/><path class="ln" style="stroke-width:3" d="M' + (x - 16) + ' ' + (m - 6) + ' H' + (x + 16) + ' M' + (x - 16) + ' ' + (m + 6) + ' H' + (x + 16) + '"/>'; };
  const resV = (x, y1, y2) => { const m = (y1 + y2) / 2; let d = 'M' + x + ' ' + y1 + ' V' + (m - 24); for (let i = 0; i < 6; i++) d += ' L' + (x + (i % 2 ? -8 : 8)) + ' ' + (m - 24 + (i + 0.5) * 8); d += ' L' + x + ' ' + (m + 24) + ' V' + y2; return '<path class="ln" style="fill:none" d="' + d + '"/>'; };
  const hbar = (x, y, w, h, cls) => '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + Math.max(0, w).toFixed(1) + '" height="' + h + '" rx="3"/>';

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '手機要的是平的', en: 'THE PUZZLE',
    svg: g('c1', T(125, 120, '插座：交流', { fs: 14 }) + path(sine(60, 190, 200, 42, 65), 'ln', null, 'stroke-width:2.4')) +
      g('a1', arrow(200, 200, 246, 200, null, 'lna') + T(223, 188, '整流', { cls: 'ta', fs: 12 })) +
      g('c2', T(320, 120, '整流後：一顆一顆', { fs: 14 }) + '<path class="ln2" d="M255 240 H385"/>' + path(half(255, 385, 240, 80, 65), 'lna', null, 'stroke-width:2.6')) +
      g('a2', arrow(395, 200, 441, 200, null, 'ln') + T(418, 188, '?', { cls: 'ta', fs: 16 })) +
      g('c3', T(530, 120, '手機要：平平的直流', { fs: 14 }) + '<rect class="bgw" x="505" y="140" width="50" height="90" rx="9"/><path class="ln2" d="M520 148 H540"/>' +
        '<path class="lna" d="M455 252 H605" style="stroke-width:2.6"/>' + T(530, 272, '5 V', { cls: 'ta', fs: 13 })) +
      chip(320, 292, '駝峰之間是 0 → 手機一下有電、一下沒電', null, 'q', { fs: 13, acc: true }),
    steps: [
      { sub: '插座給的是<b>交流</b>：電壓一下正、一下負，一秒來回 60 次。', on: 'c1' },
      { sub: '用二極體<b>整流</b>後，負的那半被擋掉，只剩一顆一顆的駝峰。', on: 'a1 c2' },
      { sub: '可是手機要的是一條<b>平平的直流</b>。', on: 'a2 c3' },
      { sub: '駝峰之間電壓是 0，手機會一下有電、一下沒電。<b>怎麼把駝峰抹平？</b>', on: 'q' }
    ]
  };

  /* ════════════ 01 二極體＝單向閥 ════════════ */
  const S1 = {
    t: '先複習：二極體是單向閥', en: 'DIODE = ONE-WAY VALVE',
    svg: diode(320, 200, 'dd') +
      g('fw', arrow(220, 150, 420, 150, null, 'lna') + T(320, 136, '順向：通過', { cls: 'ta', fs: 14 })) +
      g('bw', arrow(420, 252, 220, 252, null, 'ln') + T(320, 290, '反向：擋住', { fs: 14 }) + '<path class="ln" style="stroke-width:3" d="M308 240 L332 264 M332 240 L308 264"/>') +
      chip(140, 200, '像單向閥', '只能往一個方向開', 'cv', { fs: 13 }) +
      chip(510, 200, '交流的負半週', '會被擋下來', 'neg', { fs: 13, acc: true }),
    steps: [
      { sub: '先複習<b>二極體</b>：它像一個<b>單向閥</b>，只能往一個方向開。', on: 'dd cv' },
      { sub: '電流順著箭頭方向走 → 閥門打開，<b>通過</b>。', on: 'fw' },
      { sub: '反方向 → 閥門關上，<b>擋住</b>。', on: 'bw' },
      { sub: '所以交流接上去，負的那半週會被擋下來。', on: 'neg' }
    ]
  };

  /* ════════════ 02 半波整流 ════════════ */
  const S2 = {
    t: '半波整流：脈動直流', en: 'HALF-WAVE RECTIFIER',
    svg: g('in', T(70, 112, '輸入 v<sub>s</sub>', { fs: 12.5, a: 'start' }) + '<path class="ln2" d="M70 160 H430"/>' + path(sine(70, 430, 160, 40, 120), 'ln', null, 'stroke-width:2.2')) +
      g('out', T(70, 214, '輸出 v<sub>o</sub>', { cls: 'ta', fs: 12.5, a: 'start' }) + '<path class="ln2" d="M70 290 H430"/>') +
      g('pos', path(half(70, 430, 290, 60, 120), 'lna', null, 'stroke-width:2.6') + T(520, 160, '正半週 → 通過', { cls: 'ta', fs: 13 })) +
      g('neg', T(520, 192, '負半週 → 擋掉 = 0', { fs: 13 }) + '<path class="ln dsh" d="M130 290 H190 M250 290 H310 M370 290 H430" style="stroke-width:3"/>') +
      chip(520, 262, '脈動直流', '方向固定，大小一直跳', 'nm', { fs: 13, acc: true }),
    steps: [
      { sub: '把交流送進二極體（只用一顆，叫<b>半波整流</b>）。', on: 'in out' },
      { sub: '正半週：二極體順向，電壓照樣通過。', on: 'pos' },
      { sub: '負半週：二極體反向，擋住 → 輸出是 <b>0</b>。', on: 'neg' },
      { sub: '這種「不會變負、但一直跳」的電壓叫<b>脈動直流</b>。它還不能直接用。', on: 'nm' }
    ]
  };

  /* ════════════ 03 實驗的數字 ════════════ */
  const S3 = {
    t: '實驗的數字：10 V 變 4.3 V', en: 'THE LAB NUMBERS',
    svg: g('w', '<path class="ln2" d="M80 205 H300"/>' + path(sine(80, 300, 205, 80, 110), 'ln', null, 'stroke-width:2.2') +
        '<path class="ln2 dsh" d="M80 125 H300 M80 285 H300"/>' + arrow(320, 205, 320, 128, null, 'lna') + arrow(320, 205, 320, 282, null, 'lna')) +
      g('l1', T(470, 140, 'Vpp = 10 V', { fs: 18 }) + T(470, 164, '函數產生器（最高到最低）', { cls: 'tm', fs: 12 })) +
      g('l2', T(470, 206, 'V<sub>m</sub> = 5 V', { cls: 'ta', fs: 18 }) + T(470, 230, '振幅 = 峰對峰的一半', { cls: 'tm', fs: 12 })) +
      g('l3', T(470, 270, 'V<sub>p</sub> = 5 − 0.7 ≈ 4.3 V', { fs: 18 }) + T(470, 294, '扣掉二極體壓降', { cls: 'tm', fs: 12 })),
    steps: [
      { sub: '實驗用函數產生器當電源：<b>Vpp = 10 V</b>、60 Hz。', on: 'w l1' },
      { sub: 'Vpp 是「最高到最低」，所以最高點（振幅）只有 <b>5 V</b>。', on: 'l2' },
      { sub: '二極體要先吃掉約 0.7 V 才導通，輸出最高點約 <b>4.3 V</b>。', on: 'l3' },
      { sub: '記住這個 4.3 V，後面的漣波、表格都從它開始。' }
    ]
  };

  /* ════════════ 04 生活比喻：水塔 ════════════ */
  const drops = [90, 150, 210, 270, 330].map(x => '<circle class="acc" cx="' + x + '" cy="262" r="7"/>').join('');
  const S4 = {
    t: '生活比喻：家裡的水塔', en: 'THE WATER TOWER',
    svg: g('pipe', '<path class="ln" d="M60 252 H400 M60 272 H400"/>' + drops + T(200, 238, '自來水：一陣一陣來', { cls: 'tm', fs: 12.5 })) +
      g('house', '<path class="ln" style="fill:none" d="M400 290 V190 L480 140 L560 190 V290 Z"/>' + '<path class="ln" d="M430 262 H400 M520 240 H560 V250"/>' + T(480, 225, '家', { fs: 15 })) +
      chip(300, 140, '沒有水塔：水來才有、沒來就沒有', null, 'no', { fs: 12.5 }) +
      g('tower', '<rect class="accw" x="455" y="104" width="50" height="40" rx="4" style="stroke:var(--s-acc);stroke-width:1.8"/>' + '<path class="lna" d="M455 118 H505"/>' + T(530, 118, '水塔', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(320, 292, '水塔＝電容　單向閥＝二極體　水龍頭＝負載 R', null, 'map', { fs: 12.5, acc: true }),
    steps: [
      { sub: '想像自來水不是一直來，而是<b>一陣一陣</b>來（就像那些駝峰）。', on: 'pipe house' },
      { sub: '家裡沒有水塔：水來才有、沒來就沒有，洗澡洗到一半就斷水。', on: 'no' },
      { sub: '屋頂放一個<b>水塔</b>：水來的時候灌滿，沒來的時候由水塔供水。', on: 'tower', off: 'no' },
      { sub: '電路裡的水塔就是<b>電容</b>。單向閥是二極體，水龍頭是負載 R。', on: 'map' }
    ]
  };

  /* ════════════ 05 電路：電容並在負載旁 ════════════ */
  const S5 = {
    t: '電容並聯在負載旁邊', en: 'ADD A SHUNT CAPACITOR',
    svg: src(110, 200, 'vs') + g('w0', '<path class="ln" d="M110 178 V130 H170 M230 130 H450 V158 M450 242 V270 H110 V222 M330 130 V160 M330 240 V270"/>' +
        T(72, 205, 'v<sub>s</sub>', { fs: 13, a: 'end' }) + T(466, 128, 'v<sub>o</sub>', { cls: 'ta', fs: 13, a: 'start' })) + diode(200, 130, 'dd') +
      g('R', resV(330, 160, 240) + T(348, 205, 'R', { fs: 14, a: 'start' })) +
      g('cap', capV(450, 158, 242) + T(472, 205, 'C', { cls: 'ta', fs: 15, a: 'start' })) +
      chip(200, 100, '單向閥', null, 'm1', { fs: 12 }) + chip(330, 296, '水龍頭', null, 'm2', { fs: 12 }) + chip(560, 200, '水塔', null, 'm3', { fs: 12, acc: true }),
    steps: [
      { sub: '原本的半波整流：電源、二極體、負載 R。', on: 'vs w0 dd R' },
      { sub: '在 R 旁邊<b>並聯</b>一顆電容 C（兩端接在同一個地方）。', on: 'cap' },
      { sub: '對照水塔：二極體＝單向閥、R＝水龍頭、C＝水塔。', on: 'm1 m2 m3' }
    ]
  };

  /* 波形共用座標：x0 = 80、一個週期 300 px、中心線 y = 250、5 V = 100 px */
  const X0 = 80, PER = 300, YC = 200, AV = 95, AG = 13;
  const vsP = (x1) => path(sine(X0, x1, YC, AV, PER), 'ln dsh', null, 'stroke-width:1.6');
  const axis = '<path class="ln2" d="M' + X0 + ' ' + YC + ' H580"/>';
  const vRise = P(x => YC - Math.max(0, AV * Math.sin(TAU * (x - X0) / PER) - AG), X0, X0 + PER / 4, 60);
  const RCV = 1.6;   /* 故事裡的 RC = 1.6 個週期（掉得看得出來） */
  const vDecay = P(x => YC - (AV - AG) * Math.exp(-((x - X0 - PER / 4) / PER) / RCV), X0 + PER / 4, X0 + PER * 1.12, 80);

  /* ════════════ 06 Step 1 充電 ════════════ */
  const S6 = {
    t: 'Step 1：充電（二極體導通）', en: 'CHARGING',
    svg: axis + g('w', vsP(X0 + PER * 0.5) + T(X0 + PER * 0.5 + 10, YC + 30, '虛線 v<sub>s</sub>（電源）', { cls: 'tm', fs: 12, a: 'start' })) +
      g('on', '<rect class="accw" x="' + X0 + '" y="' + (YC - AV) + '" width="' + PER / 4 + '" height="' + AV + '" opacity=".7"/>' + T(X0 + PER / 8, YC + 20, '導通', { cls: 'ta', fs: 13 })) +
      g('flow', path(vRise, 'lna', null, 'stroke-width:3') + T(X0 - 6, YC - AV + 24, 'v<sub>o</sub> 跟著爬', { cls: 'ta', fs: 13, a: 'end' })) +
      g('pk', '<circle class="acc" cx="' + (X0 + PER / 4) + '" cy="' + (YC - AV + AG) + '" r="6"/>' + T(X0 + PER / 4, YC - AV + AG - 14, '4.3 V', { cls: 'ta', fs: 14 })) +
      chip(480, 150, '電源同時：供電給 R、灌滿 C', 'v<sub>s</sub> = v<sub>C</sub> = v<sub>o</sub>（少 0.7 V）', 'note', { fs: 12.5 }),
    steps: [
      { sub: '先看第一個四分之一週期：電源從 0 往上爬。', on: 'w' },
      { sub: '電源比電容高 → 二極體<b>導通</b>（閥門打開）。', on: 'on' },
      { sub: '電源一邊供電給 R，一邊把 C 灌滿，輸出跟著電源往上爬。', on: 'flow note' },
      { sub: '一路爬到最高點 <b>4.3 V</b>，水塔滿了。', on: 'pk' }
    ]
  };

  /* ════════════ 07 Step 2 放電 ════════════ */
  const S7 = {
    t: 'Step 2：放電（二極體截止）', en: 'DISCHARGING',
    svg: axis + vsP(X0 + PER * 1.12) + path(vRise, 'lna', null, 'stroke-width:3') +
      g('down', '<circle class="ink" cx="' + (X0 + PER * 0.42) + '" cy="' + (YC - AV * Math.sin(TAU * 0.42)).toFixed(1) + '" r="5"/>' + T(X0 + PER * 0.42 - 10, YC - AV * Math.sin(TAU * 0.42) + 22, '電源往下掉', { fs: 12.5, a: 'end' })) +
      g('dis', path(vDecay, 'lna', null, 'stroke-width:3') + T(X0 + PER * 0.86, YC - AV + AG - 22, 'C 慢慢放電給 R', { cls: 'ta', fs: 13 })) +
      chip(470, 248, '電容 4.3 V ＞ 電源 → 二極體被反推關上', null, 'off', { fs: 12.5, acc: true }) +
      g('exp', T(520, 290, 'v<sub>o</sub> = V<sub>p</sub>e<sup>−t/RC</sup>', { fs: 16 })),
    steps: [
      { sub: '過了最高點，電源開始往下掉。', on: 'down' },
      { sub: '可是電容還停在 4.3 V，比電源高 → 二極體被反推<b>關上</b>。', on: 'off' },
      { sub: '這時只剩電容自己供電給 R，電壓<b>慢慢</b>往下掉，不會一下掉到 0。', on: 'dis' },
      { sub: '掉的形狀是 RC 放電：v<sub>o</sub> = V<sub>p</sub>e<sup>−t/RC</sup>。', on: 'exp' }
    ]
  };

  /* ════════════ 08 下一個峰：補滿 → 鋸齒 ════════════ */
  const full = filt(X0, 560, YC, AV, AG, PER * 0.66, RCV / 0.66 * 0.66, false);
  const S8 = {
    t: '下一個週期：再補滿', en: 'TOP IT UP AGAIN',
    svg: axis + path(sine(X0, 560, YC, AV, PER * 0.66), 'ln dsh', 'vs', 'stroke-width:1.4') +
      g('saw', path(full, 'lna', null, 'stroke-width:3')) +
      g('t2', '<path class="ln2 dsh" d="M' + (X0 + PER * 0.66 * 1.17).toFixed(1) + ' ' + (YC - AV) + ' V' + YC + '"/>' + T(X0 + PER * 0.66 * 1.17, YC + 18, 't<sub>2</sub>', { fs: 13 })) +
      g('rip', '<path class="ln" d="M562 118 H588 M562 150 H588"/>' + arrow(575, 134, 575, 120, null, 'ln') + arrow(575, 134, 575, 148, null, 'ln') + T(592, 138, '漣波', { cls: 'ta', fs: 13, a: 'start' })) +
      chip(320, 290, '短短充一下、長長放一段', null, 'rep', { fs: 13 }),
    steps: [
      { sub: '下一個週期，電源又爬上來。', on: 'vs' },
      { sub: '在它<b>追上電容</b>的那一刻（t<sub>2</sub>），二極體再打開，把電容補滿。', on: 't2 saw' },
      { sub: '補一下就滿了，然後又關上、又慢慢掉 —— 一直重複。', on: 'rep' },
      { sub: '輸出變成接近平的直流，上面疊一點<b>鋸齒</b>。這個鋸齒就是<b>漣波</b>。', on: 'rip' }
    ]
  };

  /* ════════════ 09 先整理一下 ════════════ */
  const S9 = {
    t: '先整理一下', en: "LET'S RECAP",
    svg: T(100, 128, '① 充電：二極體導通，只有峰值前一小段', { fs: 15, a: 'start', k: 'r1' }) +
      T(100, 170, '② 放電：二極體截止，C 供電給 R，長長一段', { fs: 15, a: 'start', k: 'r2' }) +
      T(100, 212, '③ 漣波 ΔV ＝ 每個週期掉下去的量', { cls: 'ta', fs: 15, a: 'start', k: 'r3' }) +
      chip(320, 270, '想要更平 → 讓它每次掉少一點', null, 'go', { fs: 14, acc: true }),
    steps: [
      { sub: '整理一下：<b>充電</b>只發生在峰值前一小段。', on: 'r1' },
      { sub: '<b>放電</b>佔了大部分時間，電容自己撐著。', on: 'r2' },
      { sub: '每個週期掉下去的量就是<b>漣波 ΔV</b>。', on: 'r3' },
      { sub: '所以要更平，就是讓它每次掉少一點。掉多少由什麼決定？', on: 'go' }
    ]
  };

  /* ════════════ 10 水塔大小 = C ════════════ */
  const tower = (x, w, h, drop, key, lbl) => g(key, '<rect class="bgw" x="' + x + '" y="' + (250 - h) + '" width="' + w + '" height="' + h + '" rx="4"/>' +
    '<rect class="accw" x="' + (x + 2) + '" y="' + (250 - h + 2 + drop) + '" width="' + (w - 4) + '" height="' + (h - 4 - drop) + '" rx="3"/>' +
    '<path class="ln dsh" d="M' + (x - 8) + ' ' + (250 - h + 2) + ' H' + (x + w + 8) + '"/>' +
    arrow(x + w + 16, 250 - h + 2, x + w + 16, 250 - h + 2 + drop, null, 'lna') + T(x + w / 2, 272, lbl, { fs: 13 }));
  const S10 = {
    t: '水位掉多少：水塔大小 C', en: 'BIGGER TANK, SMALLER DROP',
    svg: tower(130, 60, 90, 50, 'sm', '小水塔（C 小）') + tower(380, 160, 90, 10, 'bg', '大水塔（C 大）') +
      chip(320, 120, '用掉一樣多的水', null, 'same', { fs: 13 }) +
      g('eq', T(320, 298, 'Q = C · ΔV　→　ΔV = Q / C', { cls: 'ta', fs: 16 })),
    steps: [
      { sub: '每個週期，負載 R 都會用掉差不多一樣多的「水」（電荷）。', on: 'same' },
      { sub: '小水塔（C 小）：用一下水位就掉很多。', on: 'sm' },
      { sub: '大水塔（C 大）：用一樣多的水，水位只掉一點點。', on: 'bg' },
      { sub: '寫成式子：<b>Q = C·ΔV</b>。電荷一樣，C 越大，掉的電壓 ΔV 越小。', on: 'eq' }
    ]
  };

  /* ════════════ 11 水龍頭 = R ════════════ */
  const S11 = {
    t: '水龍頭開多大：負載電阻 R', en: 'HOW FAST YOU DRAIN',
    svg: g('big', '<path class="ln" d="M110 140 H190 V170"/>' + '<rect class="acc" x="176" y="174" width="28" height="70" rx="4" opacity=".75"/>' + T(190, 272, 'R 小 → 電流大', { fs: 13 }) + T(190, 292, '水位掉很快', { cls: 'tm', fs: 12 })) +
      g('small', '<path class="ln" d="M380 140 H460 V170"/>' + '<rect class="acc" x="457" y="174" width="6" height="70" rx="2" opacity=".75"/>' + T(460, 272, 'R 大 → 電流小', { cls: 'ta', fs: 13 }) + T(460, 292, '水位掉很慢', { cls: 'tm', fs: 12 })) +
      chip(320, 112, '講義：「負載越大，濾波越好」＝ 負載電阻越大', null, 'note', { fs: 12.5, acc: true }),
    steps: [
      { sub: '另一邊是水龍頭：<b>R 小</b>代表電流大，像水龍頭開很大，水塔一下就見底。', on: 'big' },
      { sub: '<b>R 大</b>代表電流小，水位掉得很慢。', on: 'small' },
      { sub: '講義說「負載越大濾波越好」，指的是負載<b>電阻</b>越大（不是吃越多電）。', on: 'note' }
    ]
  };

  /* ════════════ 12 RC 一起看 ════════════ */
  const mini = (x0, rc, key, lbl, acc) => g(key, '<path class="ln2" d="M' + x0 + ' 215 H' + (x0 + 160) + '"/>' +
    path(sine(x0, x0 + 160, 215, 62, 70), 'ln dsh', null, 'stroke-width:1') +
    path(filt(x0, x0 + 160, 215, 62, 8, 70, rc, false), acc ? 'lna' : 'ln', null, 'stroke-width:2.6') + T(x0 + 80, 298, lbl, { cls: acc ? 'ta' : 't', fs: 13 }));
  const S12 = {
    t: 'R、C 一起看：RC 對上週期 T', en: 'TIME CONSTANT vs PERIOD',
    svg: chip(320, 116, '時間常數 τ = RC：放電的快慢　週期 T = 16.7 ms', null, 'tau', { fs: 12.5 }) +
      mini(50, 0.06, 'p1', 'RC = 1 ms') + mini(240, 0.6, 'p2', 'RC = 10 ms') + mini(430, 6, 'p3', 'RC = 100 ms', true),
    steps: [
      { sub: 'R 和 C 合在一起看：<b>時間常數 τ = RC</b>，代表電容放電有多慢。拿它跟週期 T = 16.7 ms 比。', on: 'tau' },
      { sub: 'RC = 1 ms，比週期小很多：電容一下就放光，跟沒濾差不多。', on: 'p1' },
      { sub: 'RC = 10 ms：撐了一下，還是掉很多。', on: 'p2' },
      { sub: 'RC = 100 ms：遠大於週期，幾乎不掉。<b>RC ≫ T 才會平。</b>', on: 'p3' }
    ]
  };

  /* ════════════ 13 公式 ════════════ */
  const S13 = {
    t: '算掉多少：ΔV ≈ V<sub>p</sub>/(fRC)', en: 'THE RIPPLE FORMULA',
    svg: T(320, 122, 'C·ΔV（電容掉的電荷）＝ I<sub>DC</sub>·T（負載拿走的）', { fs: 15, k: 'e1' }) +
      T(320, 166, 'ΔV ≈ I<sub>DC</sub>T / C ≈ V<sub>p</sub> / (fRC)', { cls: 'ta', fs: 20, k: 'e2' }) +
      T(320, 214, '1 kΩ、100 µF：4.3 ÷ (60 × 1000 × 0.0001) ≈ 0.72 V', { fs: 14, k: 'e3' }) +
      chip(320, 268, '模擬是 0.59 V：公式稍微高估（放電時間比 T 短一點）', null, 'e4', { fs: 12.5 }),
    steps: [
      { sub: '把水塔的話寫成算式：電容掉的電荷＝負載拿走的電荷。', on: 'e1' },
      { sub: '負載電流 I<sub>DC</sub> ≈ V<sub>p</sub>/R，整理一下：<b>ΔV ≈ V<sub>p</sub>/(fRC)</b>。R 和 C 永遠一起出現。', on: 'e2' },
      { sub: '帶實驗數字：1 kΩ、100 µF → 約 <b>0.72 V</b>。', on: 'e3' },
      { sub: '模擬是 0.59 V。公式假設放電放滿一整個週期，所以稍微高估。', on: 'e4' }
    ]
  };

  /* ════════════ 14 漣波因數 ════════════ */
  const S14 = {
    t: '漣波因數：漣波 ÷ 直流', en: 'RIPPLE FACTOR',
    svg: g('bars', hbar(120, 140, 300, 34, 'acc') + T(130, 162, 'V<sub>dc</sub> = 4.01 V', { fs: 13, a: 'start' }) +
        hbar(120, 186, 300 * 0.589 / 4.01, 34, 'ink3') + T(170, 208, 'V<sub>pp</sub> = 0.589 V', { fs: 13, a: 'start' })) +
      g('f', T(520, 172, 'r% = 0.589 ÷ 4.01', { fs: 15 }) + T(520, 200, '= 14.7%', { cls: 'ta', fs: 20 })) +
      chip(320, 262, '課堂表格：V<sub>pp</sub>/V<sub>dc</sub>（簡化版）', '正式定義用 rms：講義 /2√2、鋸齒 /2√3', 'ver', { fs: 13, acc: true }),
    steps: [
      { sub: '漣波 0.5 V 好不好？要看疊在多大的直流上。所以拿漣波<b>除以直流</b>。', on: 'bars' },
      { sub: '1 kΩ、100 µF：0.589 ÷ 4.01 = <b>14.7%</b>，這叫<b>漣波因數</b>。', on: 'f' },
      { sub: '課堂表格用峰對峰的「簡化版」。正式定義要用 rms，數字會小約 3 倍。', on: 'ver' }
    ]
  };

  /* ════════════ 15 代價：峰值電流 ════════════ */
  const pulse = (x0, wdt, hgt, key, lbl, acc) => g(key, '<path class="ln2" d="M' + x0 + ' 250 H' + (x0 + 200) + '"/>' +
    [0, 1, 2].map(i => { const c = x0 + 30 + i * 70; return '<path class="' + (acc ? 'acc' : 'ink3') + '" opacity=".8" d="M' + (c - wdt) + ' 250 L' + c + ' ' + (250 - hgt) + ' L' + (c + 4) + ' 250 Z"/>'; }).join('') +
    T(x0 + 100, 274, lbl, { cls: acc ? 'ta' : 't', fs: 13 }));
  const S15 = {
    t: '代價：二極體的瞬間電流', en: 'THE PRICE: PEAK CURRENT',
    svg: pulse(70, 24, 40, 'sm', 'C 小：開比較久、電流小') + pulse(370, 6, 108, 'bg', 'C 大：只開一瞬間、電流很猛', true) +
      chip(320, 112, '一個週期用掉的電荷一樣多，都要靠二極體補回來', null, 'q', { fs: 12.5 }) +
      chip(320, 298, '1 kΩ：10 µF → 17.8 mA，100 µF → 72.5 mA', null, 'num', { fs: 12.5, acc: true }),
    steps: [
      { sub: '電容越大越好嗎？每個週期用掉的電荷，都要靠二極體補回來。', on: 'q' },
      { sub: 'C 小：電壓掉得多，二極體開比較久，電流比較溫和。', on: 'sm' },
      { sub: 'C 大：只掉一點，二極體只開一瞬間 —— 同樣的電荷要在更短時間灌回去，<b>電流很猛</b>。', on: 'bg' },
      { sub: '模擬：1 kΩ 時 10 µF 峰值 17.8 mA，100 µF 變 72.5 mA。這就是講義 p.5 說的限制。', on: 'num' }
    ]
  };

  /* ════════════ 16 實驗預告 ════════════ */
  const rows = [['100 Ω', '10 µF', '1 ms'], ['100 Ω', '100 µF', '10 ms'], ['1 kΩ', '10 µF', '10 ms'], ['1 kΩ', '100 µF', '100 ms'], ['10 kΩ', '10 µF', '100 ms'], ['10 kΩ', '100 µF', '1 s']];
  const S16 = {
    t: '課堂實驗：6 組 R、C', en: 'THE SIX COMBINATIONS',
    svg: g('tb', card(150, 100, 340, 190) + T(220, 124, 'R1', { cls: 'tm', fs: 13 }) + T(320, 124, 'C1', { cls: 'tm', fs: 13 }) +
        rows.map((r, i) => T(220, 152 + i * 23, r[0], { fs: 14 }) + T(320, 152 + i * 23, r[1], { fs: 14 })).join('')) +
      g('rc', T(420, 124, 'RC', { cls: 'ta', fs: 13 }) + rows.map((r, i) => T(420, 152 + i * 23, r[2], { cls: 'ta', fs: 14 })).join('')) +
      g('pair', '<rect class="ring" x="160" y="161" width="320" height="44" rx="8"/><rect class="ring" x="160" y="207" width="320" height="44" rx="8"/>') +
      chip(565, 196, '猜猜看：', 'RC 一樣的兩組，漣波呢？', 'guess', { fs: 13, acc: true }),
    steps: [
      { sub: '課堂實驗：R1 換 100 Ω、1 kΩ、10 kΩ，C1 換 10 µF、100 µF，一共 <b>6 組</b>。', on: 'tb' },
      { sub: '把 RC 算出來：1 ms、10 ms、10 ms、100 ms、100 ms、1 s。', on: 'rc' },
      { sub: '中間有<b>兩對 RC 一樣</b>。', on: 'pair' },
      { sub: '猜猜看，RC 一樣的兩組，漣波會差多少？', on: 'guess' }
    ]
  };

  /* ════════════ 17 恍然大悟 ════════════ */
  const res = [326.1, 120.1, 119.5, 14.7, 14.7, 1.5];
  const bl = v => 320 * Math.log10(v / 0.8) / Math.log10(400 / 0.8);
  const S17 = {
    t: '恍然大悟：漣波只看 RC', en: 'THE ANSWER',
    svg: g('bars', rows.map((r, i) => { const y = 104 + i * 28;
        return T(178, y + 15, r[0] + '／' + r[1], { fs: 12.5, a: 'end' }) + hbar(190, y + 3, bl(res[i]), 18, i === 5 ? 'acc' : 'ink3') + T(196 + bl(res[i]), y + 16, res[i] + '%', { fs: 12.5, a: 'start', cls: i === 5 ? 'ta' : 't' }); }).join('')) +
      g('h1', '<rect class="ring" x="70" y="130" width="500" height="54" rx="8"/>') +
      g('h2', '<rect class="ring" x="70" y="186" width="500" height="54" rx="8"/>') +
      chip(320, 290, '謎題解開：加電容當水塔，RC 夠大就平', null, 'ans', { fs: 13.5, acc: true }),
    steps: [
      { sub: '模擬結果出來了。100 Ω／10 µF 是 326% —— 跟完全不濾的 314% 差不多，幾乎沒濾到。', on: 'bars' },
      { sub: 'RC 都是 10 ms 的兩組：120%、119.5%，<b>幾乎一樣</b>。', on: 'h1' },
      { sub: 'RC 都是 100 ms 的兩組：都是 <b>14.7%</b>。漣波只看 RC，不看 R、C 各自多少。', on: 'h2', off: 'h1' },
      { sub: '10 kΩ／100 µF（RC = 1 s）只剩 <b>1.5%</b>，幾乎是平的。', off: 'h2' },
      { sub: '謎題解開：<b>加一顆電容當水塔，RC 比週期大很多，輸出就平了。</b>', on: 'ans' }
    ]
  };

  /* ════════════ 18 下一步：橋式全波 ════════════ */
  const S18 = {
    t: '回家作業：橋式全波', en: 'WHAT’S NEXT',
    svg: g('hw', T(180, 116, '半波：一個週期補一次', { fs: 13 }) + '<path class="ln2" d="M60 230 H300"/>' + path(filt(60, 300, 230, 90, 10, 110, 0.7, false), 'ln', null, 'stroke-width:2.4')) +
      g('br', T(460, 116, '橋式：半個週期就補一次', { cls: 'ta', fs: 13 }) + '<path class="ln2" d="M340 230 H580"/>' + path(filt(340, 580, 230, 90, 18, 110, 0.7, true), 'lna', null, 'stroke-width:2.4')) +
      chip(320, 255, '放電時間少一半 → 漣波約砍半（但多一顆二極體壓降）', null, 'half', { fs: 12.5, acc: true }),
    steps: [
      { sub: '回家作業還有<b>橋式全波</b>：四顆二極體，負半週也翻上來用。', on: 'hw br' },
      { sub: '電容每<b>半個週期</b>就補一次，放電時間少一半 → 漣波約砍半。代價是多一顆二極體壓降。', on: 'half' },
      { sub: '往下看：推導、模擬器（可以切橋式）、實驗流程和 6 組結果。' }
    ]
  };

  window.__flStory = window.__Story('#story', {
    id: 'lab-filter', title: '整流器濾波', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18]
  });
})();
