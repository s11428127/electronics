/* ============================================================
   電路學 CH1～CH10 複習故事 —— 共用畫圖小工具（10/17）
   建在 __K12（g T calc ph src zbox sc card）上面，多了：
     el('r'|'c'|'l', x1, y1, x2, y2, 標籤, opt)  電阻／電容／電感（水平或垂直）
     bat(x, y, 標籤, opt)   直流電源（直的，+ 在上）；isrc(x, y, 標籤, opt) 電流源（箭頭朝上）
     wire(d, key)           導線；dots(d, key, 'ac'|'rev'|'slow') 流動的電流點
     ladder(cur, opt)       CH1～CH12 階梯（cur = 現在這一章）
     strike(x1, y, x2, key) 把錯的寫法劃掉
     meter(x, y, 'V'|'A', key)  電表；curve(fn, x0, w, y0, h, cls, key) 函數曲線
   window.__RV
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12) return;
  const K = window.__K12, D = K.D;
  const { g, T } = K;
  const f1 = x => Math.round(x * 10) / 10;
  const kk = key => (key ? ' data-k="' + key + '"' : '');

  /* 元件本體（水平、中心在原點、長 L） */
  const BODY = {
    r: L => { let d = 'M' + (-L / 2) + ' 0'; const n = 6, w = L / n; for (let i = 0; i < n; i++) d += ' L' + f1(-L / 2 + w * (i + 0.5)) + ' ' + (i % 2 ? 7 : -7); return '<path class="ln" d="' + d + ' L' + (L / 2) + ' 0"/>'; },
    c: () => '<line class="ln" style="stroke-width:2.6" x1="-4" y1="-13" x2="-4" y2="13"/><line class="ln" style="stroke-width:2.6" x1="4" y1="-13" x2="4" y2="13"/>',
    l: L => { let d = 'M' + (-L / 2) + ' 0'; for (let i = 0; i < 4; i++) d += ' a' + (L / 8) + ' ' + (L / 8) + ' 0 0 1 ' + (L / 4) + ' 0'; return '<path class="ln" d="' + d + '"/>'; }
  };
  /* opt: { k, side: 'a'|'b'（水平：標籤在上／下）, 'r'|'l'（垂直：右／左）, lc 標籤 class, fs, hl 主色 } */
  function el(type, x1, y1, x2, y2, lbl, opt) {
    opt = opt || {};
    const L = type === 'c' ? 8 : (opt.L || 40);
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(dy, dx) * 180 / Math.PI;
    const a = [f1(mx - ux * L / 2), f1(my - uy * L / 2)], b = [f1(mx + ux * L / 2), f1(my + uy * L / 2)];
    let s = '<path class="ln" d="M' + x1 + ' ' + y1 + ' L' + a[0] + ' ' + a[1] + ' M' + b[0] + ' ' + b[1] + ' L' + x2 + ' ' + y2 + '"/>' +
      '<g transform="translate(' + f1(mx) + ' ' + f1(my) + ') rotate(' + f1(ang) + ')"' + (opt.hl ? ' class="hlel"' : '') + '>' + BODY[type](L) + '</g>';
    if (lbl) {
      const vert = Math.abs(dy) > Math.abs(dx), fs = opt.fs || 13;
      if (vert) {
        const left = opt.side === 'l';
        s += T(f1(mx + (left ? -18 : 18)), f1(my + fs * 0.35), lbl, { cls: opt.lc || 't', fs, a: left ? 'end' : 'start' });
      } else {
        s += T(f1(mx), f1(opt.side === 'b' ? my + 18 + fs * 0.7 : my - 16), lbl, { cls: opt.lc || 't', fs });
      }
    }
    return g(opt.k, s);
  }
  /* 直流電源：中心 (x, y)，直的；長板 = +（在上） */
  function bat(x, y, lbl, opt) {
    opt = opt || {};
    const s = '<path class="ln" d="M' + x + ' ' + (y - 30) + ' V' + (y - 5) + ' M' + x + ' ' + (y + 5) + ' V' + (y + 30) + '"/>' +
      '<line class="ln" style="stroke-width:2.6" x1="' + (x - 14) + '" y1="' + (y - 5) + '" x2="' + (x + 14) + '" y2="' + (y - 5) + '"/>' +
      '<line class="ln" style="stroke-width:4" x1="' + (x - 7) + '" y1="' + (y + 5) + '" x2="' + (x + 7) + '" y2="' + (y + 5) + '"/>' +
      T(x + 18, y - 9, '+', { cls: 'ts', fs: 13, a: 'start' }) +
      (lbl ? T(opt.side === 'r' ? x + 22 : x - 20, y + 5, lbl, { cls: opt.lc || 't', fs: opt.fs || 13, a: opt.side === 'r' ? 'start' : 'end' }) : '');
    return g(opt.k, s);
  }
  /* 橫的直流電源：中心 (x, y)，左右各接到 x±30；opt.plusRight = + 在右邊（長板在右） */
  function batH(x, y, lbl, opt) {
    opt = opt || {};
    const r = opt.plusRight ? 1 : -1;
    return g(opt.k, '<path class="ln" d="M' + (x - 30) + ' ' + y + ' H' + (x - 5) + ' M' + (x + 5) + ' ' + y + ' H' + (x + 30) + '"/>' +
      '<line class="ln" style="stroke-width:2.6" x1="' + (x + 5 * r) + '" y1="' + (y - 14) + '" x2="' + (x + 5 * r) + '" y2="' + (y + 14) + '"/>' +
      '<line class="ln" style="stroke-width:4" x1="' + (x - 5 * r) + '" y1="' + (y - 7) + '" x2="' + (x - 5 * r) + '" y2="' + (y + 7) + '"/>' +
      T(x + 16 * r, y - 10, '+', { cls: 'ts', fs: 12 }) + T(x - 16 * r, y - 10, '−', { cls: 'ts', fs: 12 }) +
      (lbl ? T(x, opt.above ? y - 20 : y + 30, lbl, { cls: opt.lc || 't', fs: opt.fs || 13 }) : ''));
  }
  /* 繞圈箭頭（網目電流，順時針）：中心 (cx, cy)、半徑 r */
  const loopA = (cx, cy, r, lbl, key) => g(key, '<path class="lna" style="fill:none" d="M' + cx + ' ' + (cy - r) + ' A' + r + ' ' + r + ' 0 1 1 ' + (cx - r) + ' ' + cy + '"/>' +
    '<polyline class="lna" style="fill:none" points="' + (cx - r - 5) + ',' + (cy + 7) + ' ' + (cx - r) + ',' + cy + ' ' + (cx - r + 5) + ',' + (cy + 7) + '"/>' +
    (lbl ? T(cx, cy + 5, lbl, { cls: 'ta', fs: 15 }) : ''));
  /* 交流電源（~）：中心 (x, y)，直的，上下各接一段線到 y±30 */
  function vac(x, y, lbl, opt) {
    opt = opt || {};
    return g(opt.k, '<path class="ln" d="M' + x + ' ' + (y - 30) + ' V' + (y - 16) + ' M' + x + ' ' + (y + 16) + ' V' + (y + 30) + '"/>' + K.src(x, y, 16) +
      (lbl ? T(opt.side === 'r' ? x + 24 : x - 24, y + 5, lbl, { cls: opt.lc || 't', fs: opt.fs || 13, a: opt.side === 'r' ? 'start' : 'end' }) : ''));
  }
  /* 電流源：圓圈 + 往上箭頭 */
  function isrc(x, y, lbl, opt) {
    opt = opt || {};
    return g(opt.k, '<path class="ln" d="M' + x + ' ' + (y - 30) + ' V' + (y - 16) + ' M' + x + ' ' + (y + 16) + ' V' + (y + 30) + '"/>' +
      '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="16"/>' + (opt.down ? D.arrow(x, y - 9, x, y + 9, null, 'ln') : D.arrow(x, y + 9, x, y - 9, null, 'ln')) +
      (lbl ? T(opt.side === 'r' ? x + 24 : x - 24, y + 5, lbl, { cls: opt.lc || 't', fs: opt.fs || 13, a: opt.side === 'r' ? 'start' : 'end' }) : ''));
  }
  /* 相依電源（菱形）：opt.v = true 電壓型（裡面 + −），否則電流型（箭頭朝上） */
  function dsrc(x, y, lbl, opt) {
    opt = opt || {};
    const r = 17;
    return g(opt.k, '<path class="ln" d="M' + x + ' ' + (y - 30) + ' V' + (y - r) + ' M' + x + ' ' + (y + r) + ' V' + (y + 30) + '"/>' +
      '<path class="bgw" d="M' + x + ' ' + (y - r) + ' L' + (x + r) + ' ' + y + ' L' + x + ' ' + (y + r) + ' L' + (x - r) + ' ' + y + ' Z"/>' +
      (opt.v ? T(x, y - 3, '+', { cls: 't', fs: 12 }) + T(x, y + 11, '−', { cls: 't', fs: 12 }) : D.arrow(x, y + 9, x, y - 9, null, 'ln')) +
      (lbl ? T(opt.side === 'l' ? x - 24 : x + 24, y + 5, lbl, { cls: opt.lc || 't', fs: opt.fs || 13, a: opt.side === 'l' ? 'end' : 'start' }) : ''));
  }
  const wire = (d, key, cls) => '<path class="' + (cls || 'ln') + '" style="fill:none" d="' + d + '"' + kk(key) + '/>';
  /* 流動的電流點：沿著 path 跑；'ac' = 來回晃（交流） */
  const dots = (d, key, cls) => '<g' + kk(key) + '><path class="dots ' + (cls || '') + '" d="' + d + '"/></g>';
  const dot = (x, y, key) => '<circle class="ink" cx="' + x + '" cy="' + y + '" r="3.6"' + kk(key) + '/>';
  const gnd = (x, y, key) => g(key, '<path class="ln" d="M' + x + ' ' + (y - 10) + ' V' + y + ' M' + (x - 12) + ' ' + y + ' H' + (x + 12) + ' M' + (x - 7) + ' ' + (y + 5) + ' H' + (x + 7) + ' M' + (x - 2.5) + ' ' + (y + 10) + ' H' + (x + 2.5) + '"/>');
  const meter = (x, y, s, key) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="16"/>' + T(x, y + 5, s || 'V', { cls: 't', fs: 14 }));
  const strike = (x1, y, x2, key) => '<line class="lna" style="stroke-width:3.2" x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '"' + kk(key) + '/>';
  /* 函數曲線：fn(t) t∈[0,1] → 值（往上為正） */
  function curve(fn, x0, w, y0, h, cls, key, n) {
    let d = ''; n = n || 120;
    for (let i = 0; i <= n; i++) { const t = i / n; d += (i ? ' L' : 'M') + f1(x0 + t * w) + ' ' + f1(y0 - h * fn(t)); }
    return '<path class="' + (cls || 'lna') + '" style="fill:none" d="' + d + '"' + kk(key) + '/>';
  }
  /* 座標軸：原點 (x, y)，往右 w、往上 h（down 往下延伸） */
  const axes = (x, y, w, h, key, o) => {
    o = o || {};
    return g(key, D.arrow(x, y + (o.down || 0), x, y - h, null, 'ln2') + D.arrow(x - 4, y, x + w, y, null, 'ln2') +
      (o.xl ? T(x + w, y + 18, o.xl, { cls: 'ts', fs: 12, a: 'end' }) : '') + (o.yl ? T(x + 8, y - h + 4, o.yl, { cls: 'ts', fs: 12, a: 'start' }) : ''));
  };

  /* CH1～CH12 階梯：cur = 現在這一章；opt.k 整座、opt.km 「你在這裡」、opt.hl = [章號…] 另外標起來（key 'lad-hl'） */
  const NAMES = ['單位', '定律', '解法', '化簡', '運放', 'L、C', '一階', '二階', '相量', '交流', '功率', '三相'];
  function ladder(cur, opt) {
    opt = opt || {};
    const x0 = opt.x0 || 52, w = opt.w || 45, yb = 305, y0 = opt.y0 || 262, dy = opt.dy || 12;
    let s = '', hl = '';
    NAMES.forEach((n, i) => {
      const no = i + 1, x = x0 + i * w, y = y0 - i * dy, on = no === cur;
      s += '<rect class="' + (on ? 'acc' : no < cur ? 'accw' : 'card') + '" x="' + (x + 1) + '" y="' + y + '" width="' + (w - 2) + '" height="' + (yb - y) + '" rx="4"' +
        (on || no < cur ? '' : ' style="stroke:var(--s-line);stroke-width:1.2"') + '/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 15) + '" class="mono" font-size="10.5" text-anchor="middle" style="fill:' + (on ? 'var(--s-card)' : 'var(--s-ink3)') + ';font-weight:600">CH' + no + '</text>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 31) + '" font-size="11.5" text-anchor="middle" style="fill:' + (on ? 'var(--s-card)' : 'var(--s-ink)') + ';font-weight:700">' + n + '</text>';
      if ((opt.hl || []).indexOf(no) >= 0) hl += '<rect class="ring" style="stroke-width:2.4" x="' + (x - 1) + '" y="' + (y - 3) + '" width="' + (w + 2) + '" height="' + (yb - y + 3) + '" rx="6"/>';
    });
    const xc = x0 + (cur - 1) * w + w / 2, yc = y0 - (cur - 1) * dy;
    const mk = cur < 1 ? '' : '<circle class="acc" cx="' + xc + '" cy="' + (yc - 12) + '" r="5"/>' + T(xc, yc - 22, '你在這裡', { cls: 'ta', fs: 11.5 });
    return g(opt.k, s) + g(opt.km, mk) + (hl ? g('lad-hl', hl) : '');
  }

  window.__RV = Object.assign({}, K, { el, bat, batH, loopA, vac, isrc, dsrc, wire, dots, dot, gnd, meter, strike, curve, axes, ladder, f1 });
})();
