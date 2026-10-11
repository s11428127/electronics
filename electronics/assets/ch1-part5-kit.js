/* ============================================================
   電子學 CH1 PART 5 —— 故事模式的畫圖小工具（主故事＋每題例題的圖解故事共用）
   全部回傳 SVG 字串，座標用故事的 640 × 400 畫面；顏色一律用 class（墨色 + 一個藍）。
   window.__K15 = { D, g, T, k, card, calc, sc, ansScene, axes, circ, diodeSym, bat, res, sine }
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const k = key => (key ? ' data-k="' + key + '"' : '');
  const g = (key, inner, attrs) => '<g' + k(key) + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => D.text(x, y, s, o);
  const f1 = x => (Math.round(x * 10) / 10);

  const card = (x, y, w, h, extra) => '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"' + (extra || '') + '/>';

  /* 計算卡：rows = [[文字, key, class, 字級]]；每一列可以有自己的 key */
  function calc(x, y, w, rows, opt) {
    opt = opt || {};
    const lh = opt.lh || 27, fs = opt.fs || 15, top = opt.title ? 30 : 12;
    const h = top + rows.length * lh + 6;
    let s = card(x, y, w, h);
    if (opt.title) s += T(x + 14, y + 22, opt.title, { cls: 'ts', fs: 11.5, a: 'start' });
    rows.forEach((r, i) => {
      const a = opt.a || 'start', tx = a === 'middle' ? x + w / 2 : x + 16;
      let f = r[3] || fs; const tw = D.textW(String(r[0]).replace(/<su[bp]>(.*?)<\/su[bp]>/g, '$1'), f) * 1.06;
      if (tw > w - 26) f = Math.max(10, f * (w - 26) / tw);
      s += T(tx, y + top + lh * i + lh * 0.68, r[0], { cls: r[2] || 't', fs: Math.round(f * 10) / 10, a, k: r[1] });
    });
    return g(opt.k, s);
  }
  const sc = (t, en, svg, steps) => ({ t, en, svg, steps });

  /* 最後一幕：答案卡，一行一行亮 */
  function ansScene(rows, subs, y) {
    const svg = calc(110, y || 112, 420, rows.map((r, i) => [r, 'a' + i, i === 0 ? 'ta' : 't', i === 0 ? 16 : 15]), { title: '答案　ANSWER', a: 'middle', k: 'ans' });
    return sc('答案', 'ANSWER', svg, subs.map((s, i) => ({ sub: s, on: (i === 0 ? 'ans ' : '') + 'a' + i + (i === subs.length - 1 && rows.length > subs.length ? ' ' + rows.slice(subs.length).map((_, j) => 'a' + (subs.length + j)).join(' ') : '') })));
  }

  /* I–V 座標：回傳畫圖小工具。opt: { v0, v1, i0, i1, k, xl, yl, vt:[[v,'標']], it:[[i,'標']] } */
  function axes(x0, y0, w, h, opt) {
    const X = v => f1(x0 + (v - opt.v0) / (opt.v1 - opt.v0) * w);
    const Y = i => f1(y0 + h - (i - opt.i0) / (opt.i1 - opt.i0) * h);
    const ox = X(Math.max(opt.v0, Math.min(opt.v1, 0))), oy = Y(Math.max(opt.i0, Math.min(opt.i1, 0)));
    let s = D.arrow(x0 - 4, oy, x0 + w + 12, oy, null, 'ln') + D.arrow(ox, y0 + h + 4, ox, y0 - 12, null, 'ln') +
      T(x0 + w + 12, oy + 18, opt.xl || 'V<sub>D</sub>', { cls: 'tm', fs: 12, a: 'end' }) +
      T(ox + 8, y0 - 6, opt.yl || 'I<sub>D</sub>', { cls: 'tm', fs: 12, a: 'start' });
    (opt.vt || []).forEach(t => { s += '<line class="ln2" x1="' + X(t[0]) + '" y1="' + (oy - 4) + '" x2="' + X(t[0]) + '" y2="' + (oy + 4) + '"/>' + T(X(t[0]), oy + 17, t[1], { cls: 'ts', fs: 11 }); });
    (opt.it || []).forEach(t => { s += '<line class="ln2" x1="' + (ox - 4) + '" y1="' + Y(t[0]) + '" x2="' + (ox + 4) + '" y2="' + Y(t[0]) + '"/>' + T(ox - 7, Y(t[0]) + 4, t[1], { cls: 'ts', fs: 11, a: 'end' }); });
    const P = {
      X, Y, svg: g(opt.k, s),
      /* 曲線：fn(v) → i，在 [va, vb] 上取樣；超出縱軸範圍就截掉 */
      curve: (fn, va, vb, key, cls) => {
        let d = '', on = false;
        for (let n = 0; n <= 80; n++) {
          const v = va + (vb - va) * n / 80, i = fn(v);
          if (i > opt.i1 * 1.02 || i < opt.i0 * 1.02 - 1e-12) { on = false; continue; }
          d += (on ? ' L' : ' M') + X(v) + ' ' + Y(i); on = true;
        }
        return '<path class="' + (cls || 'lna') + '" style="fill:none;stroke-width:2.6" d="' + d.trim() + '"' + k(key) + '/>';
      },
      seg: (va, ia, vb, ib, key, cls, extra) => '<line class="' + (cls || 'ln') + '" x1="' + X(va) + '" y1="' + Y(ia) + '" x2="' + X(vb) + '" y2="' + Y(ib) + '"' + (extra || '') + k(key) + '/>',
      dot: (v, i, key, r, cls) => '<circle class="' + (cls || 'acc') + '" cx="' + X(v) + '" cy="' + Y(i) + '" r="' + (r || 6) + '"' + k(key) + '/>',
      /* 虛線投影到兩軸 */
      proj: (v, i, key) => g(key, '<path class="ln2 dsh" style="fill:none" d="M' + X(v) + ' ' + Y(i) + ' V' + oy + ' M' + X(v) + ' ' + Y(i) + ' H' + ox + '"/>')
    };
    return P;
  }

  /* 元件（都畫成水平或垂直；回傳 SVG） */
  const res = (x, y, len, vert) => {           /* 從 (x,y) 開始，往右（或往下）len 長，中間 40 是鋸齒 */
    const s = (len - 40) / 2; let d = '';
    for (let i = 0; i <= 6; i++) { const t = s + i * 40 / 6, o = (i === 0 || i === 6) ? 0 : (i % 2 ? -7 : 7); d += (i ? ' L' : 'M') + (vert ? (x + o) + ' ' + (y + t) : (x + t) + ' ' + (y + o)); }
    return '<path class="ln" style="fill:none" d="' + (vert ? 'M' + x + ' ' + y + ' V' + (y + s) : 'M' + x + ' ' + y + ' H' + (x + s)) + ' ' + d.replace(/^M/, 'L') + (vert ? ' L' + x + ' ' + (y + s + 40) + ' V' + (y + len) : ' L' + (x + s + 40) + ' ' + y + ' H' + (x + len)) + '"/>';
  };
  /* 二極體：垂直，陽極在上（down = true 表示電流往下＝尖端朝下）；中心 (x, y) */
  const diodeSym = (x, y, up) => {
    const d = up ? -1 : 1;
    return '<path class="accw" style="stroke:var(--s-ink);stroke-width:2" d="M' + (x - 13) + ' ' + (y - 10 * d) + ' H' + (x + 13) + ' L' + x + ' ' + (y + 10 * d) + ' Z"/>' +
      '<line class="ln" x1="' + (x - 13) + '" y1="' + (y + 10 * d) + '" x2="' + (x + 13) + '" y2="' + (y + 10 * d) + '" style="stroke-width:2.6"/>';
  };
  /* 電池：垂直，正端在上；中心 (x, y) */
  const bat = (x, y, flip) => {
    const a = flip ? 6 : -6;
    return '<line class="ln" x1="' + (x - 16) + '" y1="' + (y + a) + '" x2="' + (x + 16) + '" y2="' + (y + a) + '"/>' +
      '<line class="ln" x1="' + (x - 9) + '" y1="' + (y - a) + '" x2="' + (x + 9) + '" y2="' + (y - a) + '" style="stroke-width:3.4"/>' +
      '<rect x="' + (x - 18) + '" y="' + (y - 5) + '" width="36" height="10" style="fill:var(--s-bg,transparent);opacity:0"/>';
  };

  /* 串聯迴路：左電源、上電阻、右二極體（或模型）。opt: { k, vps, r, rev, model:'d'|'cvd'|'pwl'|'open'|'short', vg, rf, cur(電流箭頭 key), vd(電壓標 key) }
     迴路範圍 x..x+w、y..y+h */
  function circ(x, y, w, h, opt) {
    opt = opt || {};
    const xr = x + w, ym = y + h / 2;
    let s = '<path class="ln" style="fill:none" d="M' + x + ' ' + (ym - 18) + ' V' + y + ' H' + (x + w * 0.3) + ' M' + (x + w * 0.7) + ' ' + y + ' H' + xr + ' V' + (ym - 40) +
      ' M' + xr + ' ' + (ym + 40) + ' V' + (y + h) + ' H' + x + ' V' + (ym + 18) + '"/>';
    s += '<line class="ln" x1="' + x + '" y1="' + (ym - 18) + '" x2="' + x + '" y2="' + (ym - 6) + '"/><line class="ln" x1="' + x + '" y1="' + (ym + 6) + '" x2="' + x + '" y2="' + (ym + 18) + '"/>';
    s += bat(x, ym, opt.neg);
    s += T(x - 22, ym - 8, opt.neg ? '−' : '+', { fs: 15, a: 'end' }) + T(x - 22, ym + 16, opt.neg ? '+' : '−', { fs: 15, a: 'end' });
    if (opt.vps) s += T(x + 24, ym + 5, opt.vps, { cls: 't', fs: 14, a: 'start' });
    s += res(x + w * 0.3, y, w * 0.4);
    if (opt.r) s += T(x + w / 2, y - 14, opt.r, { cls: 't', fs: 14 });
    const m = opt.model || 'd';
    if (m === 'd') s += '<line class="ln" x1="' + xr + '" y1="' + (ym - 40) + '" x2="' + xr + '" y2="' + (ym + 40) + '"/>' + diodeSym(xr, ym, opt.rev);
    else if (m === 'open') s += '<line class="ln" x1="' + xr + '" y1="' + (ym - 40) + '" x2="' + xr + '" y2="' + (ym - 10) + '"/><line class="ln" x1="' + xr + '" y1="' + (ym + 10) + '" x2="' + xr + '" y2="' + (ym + 40) + '"/>' +
      '<circle class="bgw" cx="' + xr + '" cy="' + (ym - 10) + '" r="3"/><circle class="bgw" cx="' + xr + '" cy="' + (ym + 10) + '" r="3"/>';
    else if (m === 'short') s += '<line class="lna" x1="' + xr + '" y1="' + (ym - 40) + '" x2="' + xr + '" y2="' + (ym + 40) + '" style="stroke-width:3"/>';
    else if (m === 'cvd') s += '<line class="ln" x1="' + xr + '" y1="' + (ym - 40) + '" x2="' + xr + '" y2="' + (ym - 6) + '"/><line class="ln" x1="' + xr + '" y1="' + (ym + 6) + '" x2="' + xr + '" y2="' + (ym + 40) + '"/>' +
      bat(xr, ym) + T(xr + 22, ym + 5, opt.vg || 'V<sub>γ</sub>', { cls: 'ta', fs: 13, a: 'start' });
    else if (m === 'pwl') s += '<line class="ln" x1="' + xr + '" y1="' + (ym - 40) + '" x2="' + xr + '" y2="' + (ym - 34) + '"/>' + res(xr, ym - 34, 36, true) +
      '<line class="ln" x1="' + xr + '" y1="' + (ym + 2) + '" x2="' + xr + '" y2="' + (ym + 10) + '"/>' + bat(xr, ym + 16) + '<line class="ln" x1="' + xr + '" y1="' + (ym + 22) + '" x2="' + xr + '" y2="' + (ym + 40) + '"/>' +
      T(xr + 14, ym - 12, opt.rf || 'r<sub>f</sub>', { cls: 'ta', fs: 13, a: 'start' }) + T(xr + 22, ym + 22, opt.vg || 'V<sub>γ</sub>', { cls: 'ta', fs: 13, a: 'start' });
    if (opt.vd !== false && (m === 'd' || m === 'open')) s += g(opt.vd || null, T(xr - 22, ym - 22, '+', { cls: 'tm', fs: 14, a: 'end' }) + T(xr - 22, ym + 30, '−', { cls: 'tm', fs: 14, a: 'end' }) + T(xr - 26, ym + 5, 'V<sub>D</sub>', { cls: 'tm', fs: 13, a: 'end' }));
    let out = g(opt.k, s);
    if (opt.cur) out += g(opt.cur, D.arrow(x + w * 0.76, y - 1, x + w * 0.92, y - 1, null, 'lna') + T(x + w * 0.84, y - 12, 'I<sub>D</sub>', { cls: 'ta', fs: 13 }));
    return out;
  }

  /* 正弦（或整流後）波形：x0..x0+w，中線 ym，振幅 A（像素）；cut：負半周的處理 'none'|'zero'；shift：往下平移（像素，模擬 0.7 V） */
  function sine(x0, ym, w, A, opt) {
    opt = opt || {};
    let d = '';
    for (let n = 0; n <= 120; n++) {
      const u = n / 120, s = Math.sin(u * 4 * Math.PI);
      let v = A * s;
      if (opt.cut) v = Math.max(0, v - (opt.shift || 0));
      d += (n ? ' L' : 'M') + f1(x0 + u * w) + ' ' + f1(ym - v);
    }
    return '<path class="' + (opt.cls || 'lna') + '" style="fill:none;stroke-width:2.4" d="' + d + '"' + k(opt.k) + '/>';
  }

  window.__K15 = { D, g, T, k, card, calc, sc, ansScene, axes, circ, diodeSym, bat, res, sine, f1 };
})();
