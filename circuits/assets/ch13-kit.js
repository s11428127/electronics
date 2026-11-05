/* ============================================================
   CH13 互感／變壓器電路圖工具（__K13），疊在 shared/schem.js（__SCH）上
   - coil(x, y1, y2, dir)：垂直線圈（dir 1 = 鼓包朝右、-1 = 朝左），y1→y2 之間畫 4 圈
   - hcoil(x1, x2, y)：水平線圈
   - xf(x, y1, y2, o)：一組耦合線圈（左線圈在 x、右線圈在 x+g）
       o = { d1:'t'|'b', d2:'t'|'b'（點在上或下）, M:'j2 Ω'（畫弧線）, n:'1:n'（理想變壓器，畫鐵心）,
             l1, l2（線圈旁標籤）, g（兩線圈間距，預設 26）, cl（線圈長度，預設 40） }
     回傳 SVG 字串；兩個線圈的上下端點：左 (x, y1)/(x, y2)、右 (x+g, y1)/(x+g, y2)
   - dt(x, y)：打點（實心圓）
   - arcM(x1, x2, y, label, h)：兩個線圈之間的互感弧（雙箭頭）
   - ia(x1, x2, y, label)：水平電流箭頭（x1→x2）；iv(x, y1, y2, label)：垂直電流箭頭
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const P = (x, y) => x + ',' + y;
  function coil(x, y1, y2, dir) {
    dir = dir || 1; const L = y2 - y1, cl = Math.min(40, L), y0 = y1 + (L - cl) / 2, r = cl / 8;
    let d = 'M' + x + ' ' + y0;
    for (let i = 0; i < 4; i++) d += ' a' + r + ' ' + r + ' 0 0 ' + (dir > 0 ? 1 : 0) + ' 0 ' + (2 * r);
    return S.w(P(x, y1), P(x, y0)) + '<path d="' + d + '" fill="none"/>' + S.w(P(x, y0 + cl), P(x, y2));
  }
  function hcoil(x1, x2, y) {
    const L = x2 - x1, cl = Math.min(40, L), x0 = x1 + (L - cl) / 2, r = cl / 8;
    let d = 'M' + x0 + ' ' + y;
    for (let i = 0; i < 4; i++) d += ' a' + r + ' ' + r + ' 0 0 1 ' + (2 * r) + ' 0';
    return S.w(P(x1, y), P(x0, y)) + '<path d="' + d + '" fill="none"/>' + S.w(P(x0 + cl, y), P(x2, y));
  }
  const dt = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="currentColor" stroke="none"/>';
  const head = (x, y, ang) => {
    const a = ang * Math.PI / 180, s = 6;
    const p1 = [x - s * Math.cos(a - 0.45), y - s * Math.sin(a - 0.45)], p2 = [x - s * Math.cos(a + 0.45), y - s * Math.sin(a + 0.45)];
    return '<path d="M' + p1.join(' ') + ' L' + x + ' ' + y + ' L' + p2.join(' ') + '" fill="none"/>';
  };
  function arcM(x1, x2, y, label, h) {
    h = h || 16; const mx = (x1 + x2) / 2;
    return '<path d="M' + x1 + ' ' + y + ' C' + x1 + ' ' + (y - h) + ' ' + x2 + ' ' + (y - h) + ' ' + x2 + ' ' + y + '" fill="none"/>' +
      head(x1, y, 90) + head(x2, y, 90) + (label ? S.t(mx, y - h - 2, label, 'middle', ' font-size="11"') : '');
  }
  function xf(x, y1, y2, o) {
    o = o || {}; const g = o.g || 26, xr = x + g, mid = (y1 + y2) / 2, cl = o.cl || 40, ct = mid - cl / 2, cb = mid + cl / 2;
    let s = coil(x, y1, y2, 1) + coil(xr, y1, y2, -1);
    if (o.d1) s += dt(x - 8, o.d1 === 't' ? ct - 4 : cb + 4);
    if (o.d2) s += dt(xr + 8, o.d2 === 't' ? ct - 4 : cb + 4);
    if (o.n !== undefined) {
      s += S.w(P(x + g / 2 - 2.5, ct), P(x + g / 2 - 2.5, cb)) + S.w(P(x + g / 2 + 2.5, ct), P(x + g / 2 + 2.5, cb));
      if (o.n) s += S.t(x + g / 2, y1 - 6, o.n, 'middle', ' font-size="11"');
    }
    if (o.M) s += arcM(x + 4, xr - 4, ct - 2, o.M, o.h || 18);
    if (o.l1) s += S.t(x - 12, mid + 4, o.l1, 'end', ' font-size="11"');
    if (o.l2) s += S.t(xr + 12, mid + 4, o.l2, 'start', ' font-size="11"');
    return s;
  }
  function ia(x1, x2, y, label) {
    return S.w(P(x1, y), P(x2, y)) + head(x2, y, x2 > x1 ? 0 : 180) + (label ? S.t((x1 + x2) / 2, y - 5, label, 'middle', ' font-size="11"') : '');
  }
  function iv(x, y1, y2, label) {
    return S.w(P(x, y1), P(x, y2)) + head(x, y2, y2 > y1 ? 90 : -90) + (label ? S.t(x + 5, (y1 + y2) / 2 + 4, label, 'start', ' font-size="11"') : '');
  }
  /* 端子 + 標籤 */
  const tm = (x, y) => S.term(x, y);
  /* 電壓極性 +/−（上下） */
  const pm = (x, yt, yb, label) => S.t(x, yt, '+', 'middle', ' font-size="12"') + S.t(x, yb, '−', 'middle', ' font-size="12"') + (label ? S.t(x, (yt + yb) / 2 + 4, label, 'middle', ' font-size="11.5"') : '');
  /* 任意兩點之間的互感弧（二次貝茲曲線，控制點 cx,cy），標籤放在 lx,ly */
  function arc2(x1, y1, x2, y2, cx, cy, label, lx, ly) {
    const a1 = Math.atan2(y1 - cy, x1 - cx) * 180 / Math.PI, a2 = Math.atan2(y2 - cy, x2 - cx) * 180 / Math.PI;
    return '<path d="M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2 + '" fill="none"/>' + head(x1, y1, a1) + head(x2, y2, a2) +
      (label ? S.t(lx, ly, label, 'middle', ' font-size="11"') : '');
  }
  window.__K13 = { coil, hcoil, dt, arcM, arc2, xf, ia, iv, tm, pm, head };
})();
