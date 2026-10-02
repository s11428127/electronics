/* ============================================================
   電路圖小工具：用幾個函式拼出課本的電路圖（SVG，線條吃 currentColor，暗色模式自動跟著變）
   用法：const S = window.__SCH;
         S.svg(360, 170, [ S.vs(40,40,130,'10∠0° V'), S.r(40,40,140,40,'4 Ω'), ... ])
   元件都畫在兩點之間（水平或垂直）；標籤：水平元件在上方、垂直元件在右邊（opt.side:'l' 放左邊）。
   標籤寫 'Z_L'、'R_L' 會變成下標。
   ============================================================ */
(function () {
  'use strict';
  const BODY = 40;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /* 'Z_L' → Z 加下標 L；其他字照抄 */
  const lab = s => esc(s).replace(/_([A-Za-z0-9]+)/g, '<tspan font-size="9.5" dy="3">$1</tspan><tspan dy="-3">​</tspan>');
  const text = (x, y, s, a, extra) => '<text x="' + x + '" y="' + y + '" text-anchor="' + (a || 'middle') + '" fill="currentColor" stroke="none" font-size="12"' + (extra || '') + '>' + lab(s) + '</text>';
  const line = (x1, y1, x2, y2, extra) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + (extra || '') + '/>';

  /* 沿著 (x1,y1)→(x2,y2) 畫一個元件：body(local) 是以 0..BODY 為長度、中心線 y=0 的圖形 */
  function along(x1, y1, x2, y2, body, label, opt) {
    opt = opt || {};
    const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const s = (L - BODY) / 2;
    const g = '<g transform="translate(' + x1 + ',' + y1 + ') rotate(' + a + ')">' +
      line(0, 0, s, 0) + '<g transform="translate(' + s + ',0)">' + body + '</g>' + line(s + BODY, 0, L, 0) + '</g>';
    let t = '';
    if (label) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, vert = Math.abs(x2 - x1) < Math.abs(y2 - y1);
      t = vert ? text(opt.side === 'l' ? mx - 13 : mx + 13, my + 4, label, opt.side === 'l' ? 'end' : 'start')
        : text(mx, opt.side === 'b' ? my + 20 : my - 11, label);
    }
    return g + t;
  }
  const zig = () => { let d = 'M0 0'; for (let i = 0; i < 6; i++) d += ' L' + (i * 6.67 + 3.33) + ' ' + (i % 2 ? 6 : -6); return '<path d="' + d + ' L40 0" fill="none"/>'; };
  const coil = () => { let d = 'M0 0'; for (let i = 0; i < 4; i++) d += ' a5 5 0 0 1 10 0'; return '<path d="' + d + '" fill="none"/>'; };
  const cap = () => line(0, 0, 17, 0) + line(17, -10, 17, 10, ' stroke-width="2"') + line(23, -10, 23, 10, ' stroke-width="2"') + line(23, 0, 40, 0);
  const boxz = () => '<rect x="4" y="-8" width="32" height="16" rx="2" fill="none"/>';

  const S = {
    r: (x1, y1, x2, y2, l, o) => along(x1, y1, x2, y2, zig(), l, o),
    l: (x1, y1, x2, y2, l, o) => along(x1, y1, x2, y2, coil(), l, o),
    c: (x1, y1, x2, y2, l, o) => along(x1, y1, x2, y2, cap(), l, o),
    z: (x1, y1, x2, y2, l, o) => along(x1, y1, x2, y2, boxz(), l, o),
    w: (...p) => '<polyline points="' + p.join(' ') + '" fill="none"/>',
    dot: (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="currentColor" stroke="none"/>',
    term: (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="3" fill="var(--surface, #fff)"/>',
    t: text,
    /* 垂直電壓源：x，上端 y1、下端 y2，+ 在上 */
    vs: (x, y1, y2, label, o) => {
      o = o || {}; const cy = (y1 + y2) / 2;
      return line(x, y1, x, cy - 14) + line(x, cy + 14, x, y2) + '<circle cx="' + x + '" cy="' + cy + '" r="14" fill="none"/>' +
        text(x, cy - 3, o.flip ? '−' : '+', 'middle', ' font-size="12"') + text(x, cy + 11, o.flip ? '+' : '−', 'middle', ' font-size="12"') +
        (label ? text(o.side === 'r' ? x + 19 : x - 19, cy + 4, label, o.side === 'r' ? 'start' : 'end') : '');
    },
    /* 垂直電流源：箭頭朝上（o.down 朝下） */
    is: (x, y1, y2, label, o) => {
      o = o || {}; const cy = (y1 + y2) / 2, u = o.down ? 1 : -1;
      return line(x, y1, x, cy - 14) + line(x, cy + 14, x, y2) + '<circle cx="' + x + '" cy="' + cy + '" r="14" fill="none"/>' +
        line(x, cy - 8 * u, x, cy + 8 * u) + '<polyline points="' + (x - 4) + ',' + (cy + 3 * u) + ' ' + x + ',' + (cy + 8 * u) + ' ' + (x + 4) + ',' + (cy + 3 * u) + '" fill="none"/>' +
        (label ? text(o.side === 'r' ? x + 19 : x - 19, cy + 4, label, o.side === 'r' ? 'start' : 'end') : '');
    },
    /* 串聯的瓦特計（電流線圈）＋往下一條虛線代表電壓線圈 */
    wm: (x1, y, x2, yv) => {
      const mx = (x1 + x2) / 2;
      return line(x1, y, mx - 16, y) + '<rect x="' + (mx - 16) + '" y="' + (y - 11) + '" width="32" height="22" rx="3" fill="none" stroke-width="1.6"/>' +
        text(mx, y + 4, 'W', 'middle', ' font-weight="700"') + line(mx + 16, y, x2, y) +
        (yv ? line(mx, y + 11, mx, yv, ' stroke-dasharray="4 3"') + text(mx + 4, (y + yv) / 2 + 6, '電壓線圈', 'start', ' font-size="10"') : '');
    },
    /* 波形：pts 為 [t, v] 陣列；ax = {t0,t1,v0,v1,ticks:[...], vt:[...], tl, vl} */
    wave: (w, h, pts, ax) => {
      const L = 34, R = w - 14, T = 14, B = h - 22;
      const X = t => L + (t - ax.t0) / (ax.t1 - ax.t0) * (R - L), Y = v => B - (v - ax.v0) / (ax.v1 - ax.v0) * (B - T);
      let o = line(L, Y(0), R, Y(0)) + line(L, B, L, T) + text(R + 2, Y(0) + 14, ax.tl || 't', 'end') + text(L + 4, T + 2, ax.vl || 'v(t)', 'start');
      (ax.ticks || []).forEach(tk => { const t = Array.isArray(tk) ? tk[0] : tk, s = Array.isArray(tk) ? tk[1] : String(tk);
        o += line(X(t), Y(0) - 3, X(t), Y(0) + 3) + text(X(t), Y(0) + 15, s, 'middle', ' font-size="10.5"'); });
      (ax.vt || []).forEach(v => { o += line(L - 3, Y(v), L + 3, Y(v)) + text(L - 6, Y(v) + 4, String(v), 'end', ' font-size="10.5"'); });
      o += '<polyline points="' + pts.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ') + '" fill="none" stroke-width="2" stroke="var(--accent)"/>';
      return o;
    },
    svg: (w, h, parts) => '<svg class="schem" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" style="max-width:100%;height:auto" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" font-family="inherit">' + parts.join('') + '</svg>'
  };
  window.__SCH = S;
})();
