/* ============================================================
   電路學 CH12 三相電路 —— 故事模式的畫圖小工具（主故事＋每題例題的圖解故事共用）
   全部回傳 SVG 字串，座標用故事的 640 × 400 畫面；顏色一律用 class（墨色 + 一個主色）。
   window.__K12 = { g, T, card, calc, ph, sys3, single, tri, wave3, src, zbox, sc }
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const RAD = Math.PI / 180;
  const k = key => (key ? ' data-k="' + key + '"' : '');
  const g = (key, inner, attrs) => '<g' + k(key) + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => D.text(x, y, s, o);
  const f1 = x => (Math.round(x * 10) / 10);

  /* 白色圓角卡片 */
  const card = (x, y, w, h, extra) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"' + (extra || '') + '/>';

  /* 計算卡：rows = [[文字, key, class, 字級]]；每一列可以有自己的 key，一步一步亮出來
     opt: { k: 整張卡的 key, title, lh 行高, fs 字級, a: 'start'|'middle' } */
  function calc(x, y, w, rows, opt) {
    opt = opt || {};
    const lh = opt.lh || 27, fs = opt.fs || 15, top = opt.title ? 30 : 12;
    const h = top + rows.length * lh + 6;
    let s = card(x, y, w, h);
    if (opt.title) s += T(x + 14, y + 22, opt.title, { cls: 'ts', fs: 11.5, a: 'start' });
    rows.forEach((r, i) => {
      const a = opt.a || 'start', tx = a === 'middle' ? x + w / 2 : x + 16;
      /* 太長就縮小字（估算字寬，中文 1 字、英數 0.6 字），不讓字跑出卡片 */
      let f = r[3] || fs; const tw = D.textW(String(r[0]).replace(/<su[bp]>(.*?)<\/su[bp]>/g, '$1'), f) * 1.06;
      if (tw > w - 26) f = Math.max(10, f * (w - 26) / tw);
      s += T(tx, y + top + lh * i + lh * 0.68, r[0], { cls: r[2] || 't', fs: Math.round(f * 10) / 10, a, k: r[1] });
    });
    return g(opt.k, s);
  }

  /* 相量圖：中心 (cx, cy)，半徑 R；vecs = [{a 角度°, m 相對長度 0~1, l 標籤, k key, c 'lna'|'ln'|'ln dsh', lc 標籤 class, lo 標籤離尖端距離, ld:[dx,dy] 標籤微調}]
     opt: { k 座標軸 key, ring 畫參考圓, ax 座標軸長 } */
  function ph(cx, cy, R, vecs, opt) {
    opt = opt || {};
    const ax = opt.ax || R + 14;
    let s = g(opt.k, '<line class="ln2" x1="' + (cx - ax) + '" y1="' + cy + '" x2="' + (cx + ax) + '" y2="' + cy + '"/>' +
      '<line class="ln2" x1="' + cx + '" y1="' + (cy - ax) + '" x2="' + cx + '" y2="' + (cy + ax) + '"/>' +
      (opt.ring ? '<circle class="ln2 dsh" cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="fill:none"/>' : '') +
      (opt.noTick ? '' : T(cx + ax - 2, cy + 15, '0°', { cls: 'ts', fs: 10.5, a: 'end' })));
    vecs.forEach(v => {
      const a = v.a * RAD, L = R * (v.m === undefined ? 1 : v.m);
      const x2 = cx + L * Math.cos(a), y2 = cy - L * Math.sin(a);
      const x1 = v.from ? v.from[0] : cx, y1 = v.from ? v.from[1] : cy;
      const ex = v.from ? v.from[0] + L * Math.cos(a) : x2, ey = v.from ? v.from[1] - L * Math.sin(a) : y2;
      const lo = v.lo || 16, c = Math.cos(a);
      const lx = ex + lo * Math.cos(a) + (v.ld ? v.ld[0] : 0), ly = ey - lo * Math.sin(a) + 5 + (v.ld ? v.ld[1] : 0);
      s += g(v.k, D.arrow(f1(x1), f1(y1), f1(ex), f1(ey), null, v.c || 'lna') +
        (v.l ? T(f1(lx), f1(ly), v.l, { cls: v.lc || (v.c === 'ln' ? 't' : 'ta'), fs: v.fs || 13, a: v.la || (c > 0.35 ? 'start' : c < -0.35 ? 'end' : 'middle') }) : ''));
    });
    return s;
  }

  /* 交流電源圓圈（裡面一個 ~） */
  const src = (x, y, r, key) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="' + (r || 13) + '"/>' +
    '<path class="ln" style="fill:none;stroke-width:1.6" d="M' + (x - 7) + ' ' + y + ' C' + (x - 4) + ' ' + (y - 7) + ' ' + (x - 1) + ' ' + (y - 7) + ' ' + x + ' ' + y + ' S' + (x + 4) + ' ' + (y + 7) + ' ' + (x + 7) + ' ' + y + '"/>');
  /* 阻抗方塊：水平 (x1,y)→(x2,y) 或垂直；中間一個框 */
  function zbox(x1, y1, x2, y2, lbl, opt) {
    opt = opt || {};
    const vert = Math.abs(x2 - x1) < Math.abs(y2 - y1), L = 34, Wd = 15;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    let s;
    if (vert) {
      s = '<path class="ln" d="M' + x1 + ' ' + y1 + ' V' + (my - L / 2) + ' M' + x1 + ' ' + (my + L / 2) + ' V' + y2 + '"/>' +
        '<rect class="' + (opt.hl ? 'accw' : 'bgw') + '" x="' + (mx - Wd / 2) + '" y="' + (my - L / 2) + '" width="' + Wd + '" height="' + L + '" rx="3"' + (opt.hl ? ' style="stroke:var(--s-acc);stroke-width:1.8"' : '') + '/>' +
        (lbl ? T(opt.side === 'l' ? mx - 13 : mx + 13, my + 5, lbl, { cls: opt.lc || 'tm', fs: opt.fs || 12, a: opt.side === 'l' ? 'end' : 'start' }) : '');
    } else {
      s = '<path class="ln" d="M' + x1 + ' ' + y1 + ' H' + (mx - L / 2) + ' M' + (mx + L / 2) + ' ' + y1 + ' H' + x2 + '"/>' +
        '<rect class="' + (opt.hl ? 'accw' : 'bgw') + '" x="' + (mx - L / 2) + '" y="' + (my - Wd / 2) + '" width="' + L + '" height="' + Wd + '" rx="3"' + (opt.hl ? ' style="stroke:var(--s-acc);stroke-width:1.8"' : '') + '/>' +
        (lbl ? T(mx, opt.side === 'b' ? my + 24 : my - 14, lbl, { cls: opt.lc || 'tm', fs: opt.fs || 12 }) : '');
    }
    return g(opt.k, s);
  }

  /* 整個三相系統（梯子畫法，跟課本 Fig 12.3、12.30 同一種擺法）
     opt = { src:'Y'|'D', load:'Y'|'D', x0 左, x1 右, y:[三條線的 y], vs:[三個電源標籤], zl:線路阻抗標籤（可省）,
             z:負載標籤（字串或三個）, n: 畫中性線, k:{src, line, load, n, lbl}, hl: 0|1|2 把某一相塗主色 } */
  function sys3(o) {
    const x0 = o.x0 || 70, x1 = o.x1 || 570, y = o.y || [140, 200, 260];
    const K = o.k || {};
    const vs = o.vs || ['', '', ''], zz = Array.isArray(o.z) ? o.z : [o.z || 'Z', o.z || 'Z', o.z || 'Z'];
    const nm = ['a', 'b', 'c'], NM = ['A', 'B', 'C'];
    let S = '', L = '', Ld = '', N = '', lb = '';
    const xs = x0 + 70;                     /* 電源出口 */
    const xl = o.load === 'D' ? x1 - 100 : x1 - 90;   /* 負載入口 */
    if (o.src !== 'D') {
      /* Y 接電源：左邊一條 n 匯流排，每一相一顆電源 */
      S += '<path class="ln" d="M' + x0 + ' ' + (y[0]) + ' V' + y[2] + '"/>';
      y.forEach((yy, i) => {
        S += '<path class="ln" d="M' + x0 + ' ' + yy + ' H' + (x0 + 22) + ' M' + (x0 + 48) + ' ' + yy + ' H' + xs + '"/>' + src(x0 + 35, yy, 13);
        S += T(x0 + 22, yy - 17, vs[i], { cls: 'tm', fs: 11.5, a: 'start' });
      });
      S += T(x0 - 8, (y[0] + y[2]) / 2 + 4, 'n', { cls: 't', fs: 14, a: 'end' });
    } else {
      /* Δ 接電源：a-b、b-c 兩顆直的，c-a 一顆長的在最左 */
      S += '<path class="ln" d="M' + x0 + ' ' + y[0] + ' H' + xs + ' M' + x0 + ' ' + y[2] + ' H' + xs + ' M' + (x0 + 40) + ' ' + y[1] + ' H' + xs + '"/>';
      S += '<path class="ln" d="M' + x0 + ' ' + y[0] + ' V' + ((y[0] + y[2]) / 2 - 13) + ' M' + x0 + ' ' + ((y[0] + y[2]) / 2 + 13) + ' V' + y[2] + '"/>' + src(x0, (y[0] + y[2]) / 2, 13);
      S += '<path class="ln" d="M' + (x0 + 40) + ' ' + y[0] + ' V' + ((y[0] + y[1]) / 2 - 12) + ' M' + (x0 + 40) + ' ' + ((y[0] + y[1]) / 2 + 12) + ' V' + y[1] + '"/>' + src(x0 + 40, (y[0] + y[1]) / 2, 12);
      S += '<path class="ln" d="M' + (x0 + 40) + ' ' + y[1] + ' V' + ((y[1] + y[2]) / 2 - 12) + ' M' + (x0 + 40) + ' ' + ((y[1] + y[2]) / 2 + 12) + ' V' + y[2] + '"/>' + src(x0 + 40, (y[1] + y[2]) / 2, 12);
      S += T(x0 + 58, (y[0] + y[1]) / 2 + 4, vs[0], { cls: 'tm', fs: 11, a: 'start' }) + T(x0 + 58, (y[1] + y[2]) / 2 + 4, vs[1], { cls: 'tm', fs: 11, a: 'start' }) +
        T(x0 - 18, (y[0] + y[2]) / 2 + 4, vs[2], { cls: 'tm', fs: 11, a: 'end' });
    }
    y.forEach((yy, i) => { lb += T(xs + 4, yy + 16, nm[i], { cls: 'ts', fs: 12, a: 'start' }) + T(xl - 4, yy + 16, NM[i], { cls: 'ts', fs: 12, a: 'end' }); });
    /* 線路 */
    y.forEach((yy, i) => {
      if (o.zl) L += zbox(xs, yy, xl, yy, i === 0 ? o.zl : '', { fs: 11.5 });
      else L += '<path class="ln" d="M' + xs + ' ' + yy + ' H' + xl + '"/>';
    });
    if (o.load !== 'D') {
      y.forEach((yy, i) => { Ld += zbox(xl, yy, x1, yy, zz[i], { fs: 11.5, hl: o.hlz === i }); });
      Ld += '<path class="ln" d="M' + x1 + ' ' + y[0] + ' V' + y[2] + '"/>' + T(x1 + 8, (y[0] + y[2]) / 2 + 4, 'N', { cls: 't', fs: 14, a: 'start' });
    } else {
      const xa = xl + 40, xb = xa, xc = x1;
      Ld += '<path class="ln" d="M' + xl + ' ' + y[0] + ' H' + xc + ' M' + xl + ' ' + y[1] + ' H' + xb + ' M' + xl + ' ' + y[2] + ' H' + xc + '"/>';
      Ld += zbox(xa, y[0], xa, y[1], zz[0], { fs: 11, side: 'l', hl: o.hlz === 0 }) + zbox(xb, y[1], xb, y[2], zz[1], { fs: 11, side: 'l', hl: o.hlz === 1 }) + zbox(xc, y[0], xc, y[2], zz[2], { fs: 11, hl: o.hlz === 2 });
      Ld += D.dot ? '' : '';
    }
    if (o.n) N = '<path class="ln dsh" d="M' + x0 + ' ' + y[2] + ' V' + (y[2] + 30) + ' H' + x1 + ' V' + y[2] + '"/>' + T((x0 + x1) / 2, y[2] + 26, '中性線', { cls: 'ts', fs: 11 });
    let H = '';
    if (o.hl !== undefined) {
      const yy = y[o.hl];
      H = '<path class="lna" style="stroke-width:4;opacity:.55" d="M' + (o.src !== 'D' ? x0 + 48 : x0 + 40) + ' ' + yy + ' H' + (o.load !== 'D' ? x1 : xl) + '"/>';
    }
    return g(K.src, S) + g(K.line, L) + g(K.load, Ld) + g(K.n, N) + g(K.lbl, lb) + g(K.hl, H);
  }

  /* 單相等效電路：電源 + 一個（或兩個串聯）阻抗 + 回程線
     opt = { x, y 上緣, w, h, v 電源標籤, z:[標籤…], k, i 電流標籤, hlz } */
  function single(o) {
    const x = o.x || 150, y = o.y || 130, w = o.w || 300, h = o.h || 130, zs = o.z || ['Z'];
    let s = '<path class="ln" d="M' + x + ' ' + y + ' V' + (y + h / 2 - 16) + ' M' + x + ' ' + (y + h / 2 + 16) + ' V' + (y + h) + ' H' + (x + w) + '"/>' + src(x, y + h / 2, 16);
    s += T(x + 24, y + h / 2 + 5, o.v || 'V', { cls: 't', fs: 14, a: 'start' });
    const seg = w / zs.length;
    zs.forEach((z, i) => { s += zbox(x + seg * i, y, x + seg * (i + 1), y, z, { fs: 13, lc: 't' }); });
    s += '<path class="ln" d="M' + (x + w) + ' ' + y + ' V' + (y + h) + '"/>';
    if (o.i) s += D.arrow(x + 16, y + 22, x + 62, y + 22, null, 'lna') + T(x + 68, y + 27, o.i, { cls: 'ta', fs: 13, a: 'start' });
    s += T(x - 8, y - 6, o.top || 'a', { cls: 'ts', fs: 12, a: 'end' }) + T(x - 8, y + h + 14, o.bot || 'n', { cls: 'ts', fs: 12, a: 'end' });
    return g(o.k, s);
  }

  /* 功率三角形：原點 (ox, oy)，比例 s（px/單位）；Q > 0 往上 */
  function tri(ox, oy, P, Q, s, o) {
    o = o || {};
    const px = ox + P * s, qy = oy - Q * s;
    return g(o.kp, D.arrow(ox, oy, f1(px), oy, null, 'ln') + (o.lp ? T((ox + px) / 2, oy + (Q >= 0 ? 20 : -10), o.lp, { cls: 't', fs: 13 }) : '')) +
      g(o.kq, D.arrow(f1(px), oy, f1(px), f1(qy), null, 'lna') + (o.lq ? T(px + 10, (oy + qy) / 2 + 4, o.lq, { cls: 'ta', fs: 13, a: 'start' }) : '')) +
      g(o.ks, D.arrow(ox, oy, f1(px), f1(qy), null, 'ln dsh') + (o.ls ? T((ox + px) / 2 - 10, (oy + qy) / 2 - 8, o.ls, { cls: 't', fs: 13, a: 'end' }) : ''));
  }

  /* 三條弦波：x, y 中線, w, h 半高；ph = [相角…]；keys = [k…]；cls = [class…] */
  function wave3(x, y, w, h, phs, keys, cls, cyc) {
    cyc = cyc || 1.5;
    let s = '<line class="ln2" x1="' + x + '" y1="' + y + '" x2="' + (x + w) + '" y2="' + y + '"/>';
    phs.forEach((p, i) => {
      let d = '';
      for (let n = 0; n <= 90; n++) { const t = n / 90, xx = x + t * w, yy = y - h * Math.cos(2 * Math.PI * cyc * t + p * RAD); d += (n ? ' L' : 'M') + f1(xx) + ' ' + f1(yy); }
      s += '<path class="' + (cls ? cls[i] : 'lna') + '" style="fill:none" d="' + d + '"' + k(keys ? keys[i] : null) + '/>';
    });
    return s;
  }

  /* 一個 scene 的捷徑 */
  const sc = (t, en, svg, steps) => ({ t, en, svg, steps });

  window.__K12 = { D, g, T, k, card, calc, ph, src, zbox, sys3, single, tri, wave3, sc, RAD };
})();
