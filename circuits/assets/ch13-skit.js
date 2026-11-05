/* ============================================================
   CH13／CH14 故事模式畫圖工具（__S13），座標用故事的 640 × 400 畫面，顏色只用 class
   疊在 __K12（g、T、calc、sc、src、zbox）與 __Story.draw（chip、arrow）上
   - coil(x, y1, y2, dir, key, cls)：垂直線圈（dir 1 鼓包朝右，-1 朝左），中間 4 圈
   - hcoil(x1, x2, y, key, cls)：水平線圈
   - dot(x, y, key)：打點（實心）
   - marc(x1, x2, y, label, h, key)：互感雙箭頭弧
   - xf(x, y1, y2, o)：一組耦合線圈（o: d1, d2 'top'|'bot', M, n（畫鐵心）, g 間距, key, l1, l2）
   - wire(d, key, cls)：路徑
   - iarr(x1, y1, x2, y2, label, key)：電流箭頭（主色）
   - core(x, y, w, h, key)：鐵心方框（真實變壓器的口字形）
   - winding(x, y1, y2, side, n, key)：繞在鐵心柱上的線圈（實物圖）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K12) return;
  const K = window.__K12, D = K.D, g = K.g, T = K.T;
  const k = key => (key ? ' data-k="' + key + '"' : '');
  const wire = (d, key, cls) => '<path class="' + (cls || 'ln') + '"' + k(key) + ' d="' + d + '"/>';
  function coil(x, y1, y2, dir, key, cls) {
    dir = dir || 1; const L = y2 - y1, cl = Math.min(56, L), y0 = y1 + (L - cl) / 2, r = cl / 8;
    let d = 'M' + x + ' ' + y1 + ' V' + y0;
    for (let i = 0; i < 4; i++) d += ' a' + r + ' ' + r + ' 0 0 ' + (dir > 0 ? 1 : 0) + ' 0 ' + (2 * r);
    d += ' V' + y2;
    return wire(d, key, cls);
  }
  function hcoil(x1, x2, y, key, cls) {
    const L = x2 - x1, cl = Math.min(56, L), x0 = x1 + (L - cl) / 2, r = cl / 8;
    let d = 'M' + x1 + ' ' + y + ' H' + x0;
    for (let i = 0; i < 4; i++) d += ' a' + r + ' ' + r + ' 0 0 1 ' + (2 * r) + ' 0';
    d += ' H' + x2;
    return wire(d, key, cls);
  }
  const dot = (x, y, key) => '<circle class="ink"' + k(key) + ' cx="' + x + '" cy="' + y + '" r="4.5"/>';
  function head(x, y, ang, cls) {
    const a = ang * Math.PI / 180, s = 8;
    const p1 = [x - s * Math.cos(a - 0.45), y - s * Math.sin(a - 0.45)], p2 = [x - s * Math.cos(a + 0.45), y - s * Math.sin(a + 0.45)];
    return '<path class="' + (cls || 'ln') + '" d="M' + p1.map(v => v.toFixed(1)).join(' ') + ' L' + x + ' ' + y + ' L' + p2.map(v => v.toFixed(1)).join(' ') + '"/>';
  }
  function marc(x1, x2, y, label, h, key) {
    h = h || 24; const mx = (x1 + x2) / 2;
    return g(key, '<path class="lna" d="M' + x1 + ' ' + y + ' C' + x1 + ' ' + (y - h) + ' ' + x2 + ' ' + (y - h) + ' ' + x2 + ' ' + y + '"/>' + head(x1, y, 90, 'lna') + head(x2, y, 90, 'lna') +
      (label ? T(mx, y - h * 0.75 - 6, label, { cls: 'ta', fs: 14 }) : ''));
  }
  function xf(x, y1, y2, o) {
    o = o || {}; const gp = o.g || 34, xr = x + gp, mid = (y1 + y2) / 2, cl = Math.min(56, y2 - y1), ct = mid - cl / 2, cb = mid + cl / 2;
    let s = coil(x, y1, y2, 1) + coil(xr, y1, y2, -1);
    if (o.d1) s += dot(x - 11, o.d1 === 'top' ? ct - 2 : cb + 2, o.kd1);
    if (o.d2) s += dot(xr + 11, o.d2 === 'top' ? ct - 2 : cb + 2, o.kd2);
    if (o.n !== undefined) {
      s += '<path class="ln" d="M' + (x + gp / 2 - 3) + ' ' + ct + ' V' + cb + ' M' + (x + gp / 2 + 3) + ' ' + ct + ' V' + cb + '"/>';
      if (o.n) s += T(x + gp / 2, y1 - 8, o.n, { cls: 't', fs: 13 });
    }
    if (o.M) s += marc(x + 5, xr - 5, ct - 4, o.M, o.h || 26, o.kM);
    if (o.l1) s += T(x - 18, mid + 5, o.l1, { cls: 't', fs: 13, a: 'end' });
    if (o.l2) s += T(xr + 18, mid + 5, o.l2, { cls: 't', fs: 13, a: 'start' });
    return g(o.key, s);
  }
  function iarr(x1, y1, x2, y2, label, key, lpos) {
    const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const lp = lpos || [(x1 + x2) / 2, Math.min(y1, y2) - 8];
    return g(key, '<path class="lna" d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '"/>' + head(x2, y2, ang, 'lna') + (label ? T(lp[0], lp[1], label, { cls: 'ta', fs: 13 }) : ''));
  }
  /* 口字形鐵心 */
  const core = (x, y, w, h, key) => g(key, '<rect class="ln" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="stroke-width:3"/>' +
    '<rect class="ln" x="' + (x + 26) + '" y="' + (y + 26) + '" width="' + (w - 52) + '" height="' + (h - 52) + '" rx="3" style="stroke-width:3"/>');
  /* 繞在鐵心柱上的線圈：柱的中心 x、寬 26；n 圈（斜線） */
  function winding(x, y1, y2, n, key, cls) {
    let d = ''; const step = (y2 - y1) / n;
    for (let i = 0; i < n; i++) { const y = y1 + i * step; d += 'M' + (x - 18) + ' ' + (y + step * 0.8).toFixed(1) + ' L' + (x + 18) + ' ' + y.toFixed(1) + ' '; }
    return wire(d, key, (cls || 'lna') + '" style="stroke-width:2.6');
  }
  /* 磁力線（虛線圈） */
  const flux = (x, y, w, h, key) => '<rect class="lna dsh"' + k(key) + ' x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + Math.min(w, h) / 2 + '" style="fill:none"/>';
  window.__S13 = { coil, hcoil, dot, head, marc, xf, wire, iarr, core, winding, flux };
})();
