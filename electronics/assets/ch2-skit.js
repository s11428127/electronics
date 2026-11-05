/* ============================================================
   電子學 CH2 故事模式畫圖工具（__C2S）—— 11/5 使用者說 PART 2、3 故事太抽象，重寫時用
   座標用故事的 640 × 400 畫面；只用 class（墨色 + 一個主色）
   - W(d, key, cls)：導線路徑
   - dio(x, y, dir, key, lab, on)：二極體，dir = 'r'|'l'|'u'|'d'（電流能走的方向＝尖端方向），本體長 28
   - res(x, y, vert, key, lab)：電阻（中心 x,y，長 40）
   - vac(x, y, key, lab)：交流源（圓圈裡一個 ~），半徑 16
   - bat(x, y, plusTop, key, lab)：垂直電池（中心 x,y，長線 = +）
   - cap(x, y, vert, key, lab)：電容
   - flow(d, key, cls)：沿路徑流動的電流點（.dots）
   - st(x, y, on, key)：ON / OFF 小標
   - wave(x0, ym, w, A, fn, key, cls, n)：波形 fn(u)，u ∈ [0, 1]，回傳 -1..1 的值
   - axis(x0, ym, w, h, key)：波形用的座標軸
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15) return;
  const K = window.__K15, D = K.D, g = K.g, T = K.T;
  const k = key => (key ? ' data-k="' + key + '"' : '');
  const f1 = x => Math.round(x * 10) / 10;
  const W = (d, key, cls) => '<path class="' + (cls || 'ln') + '" style="fill:none"' + k(key) + ' d="' + d + '"/>';
  const ROT = { r: 0, d: 90, l: 180, u: 270 };
  function dio(x, y, dir, key, lab, on) {
    const a = typeof dir === 'number' ? dir : ROT[dir || 'r'];
    const body = '<path class="' + (on ? 'acc' : 'accw') + '" style="stroke:var(--s-ink);stroke-width:2" d="M-12 -11 L-12 11 L12 0 Z"/>' +
      '<line class="ln" x1="12" y1="-11" x2="12" y2="11" style="stroke-width:2.8"/><line class="ln" x1="-14" y1="0" x2="-12" y2="0"/><line class="ln" x1="12" y1="0" x2="14" y2="0"/>';
    let s = '<g transform="translate(' + x + ' ' + y + ') rotate(' + a + ')">' + body + '</g>';
    if (lab && typeof lab === 'object') s += T(x + lab[1], y + lab[2], lab[0], { cls: 't', fs: 13, a: lab[3] || 'middle' });
    else if (lab) { const o = (dir === 'u' || dir === 'd') ? [18, 5, 'start'] : [0, -16, 'middle']; s += T(x + o[0], y + o[1], lab, { cls: 't', fs: 13, a: o[2] }); }
    return g(key, s);
  }
  function res(x, y, vert, key, lab) {
    let d = '';
    for (let i = 0; i <= 6; i++) { const t = -20 + i * 40 / 6, o = (i === 0 || i === 6) ? 0 : (i % 2 ? -7 : 7); d += (i ? ' L' : 'M') + (vert ? f1(x + o) + ' ' + f1(y + t) : f1(x + t) + ' ' + f1(y + o)); }
    let s = W(d);
    if (lab) s += vert ? T(x + 14, y + 5, lab, { cls: 't', fs: 13, a: 'start' }) : T(x, y - 14, lab, { cls: 't', fs: 13 });
    return g(key, s);
  }
  const vac = (x, y, key, lab) => g(key, '<circle class="bgw" cx="' + x + '" cy="' + y + '" r="16"/>' +
    '<path class="ln" style="fill:none;stroke-width:1.8" d="M' + (x - 9) + ' ' + y + ' C' + (x - 5) + ' ' + (y - 9) + ' ' + (x - 1) + ' ' + (y - 9) + ' ' + x + ' ' + y + ' S' + (x + 5) + ' ' + (y + 9) + ' ' + (x + 9) + ' ' + y + '"/>' +
    (lab ? T(x - 22, y + 5, lab, { cls: 't', fs: 13, a: 'end' }) : ''));
  function bat(x, y, plusTop, key, lab, side) {
    const a = plusTop ? -5 : 5;
    let s = '<line class="ln" x1="' + (x - 15) + '" y1="' + (y + a) + '" x2="' + (x + 15) + '" y2="' + (y + a) + '"/>' +
      '<line class="ln" x1="' + (x - 8) + '" y1="' + (y - a) + '" x2="' + (x + 8) + '" y2="' + (y - a) + '" style="stroke-width:3.6"/>' +
      T(x + (side === 'l' ? -20 : 20), y + (plusTop ? -6 : 14), '+', { cls: 'tm', fs: 12 });
    if (lab) s += T(x + (side === 'l' ? -24 : 24), y + 5, lab, { cls: 't', fs: 13, a: side === 'l' ? 'end' : 'start' });
    return g(key, s);
  }
  const cap = (x, y, vert, key, lab) => g(key, vert
    ? '<line class="ln" x1="' + (x - 14) + '" y1="' + (y - 4) + '" x2="' + (x + 14) + '" y2="' + (y - 4) + '" style="stroke-width:2.6"/><line class="ln" x1="' + (x - 14) + '" y1="' + (y + 4) + '" x2="' + (x + 14) + '" y2="' + (y + 4) + '" style="stroke-width:2.6"/>' + (lab ? T(x + 20, y + 5, lab, { cls: 't', fs: 13, a: 'start' }) : '')
    : '<line class="ln" x1="' + (x - 4) + '" y1="' + (y - 14) + '" x2="' + (x - 4) + '" y2="' + (y + 14) + '" style="stroke-width:2.6"/><line class="ln" x1="' + (x + 4) + '" y1="' + (y - 14) + '" x2="' + (x + 4) + '" y2="' + (y + 14) + '" style="stroke-width:2.6"/>' + (lab ? T(x, y - 20, lab, { cls: 't', fs: 13 }) : ''));
  const flow = (d, key, cls) => '<g' + k(key) + '><path class="dots ' + (cls || '') + '" d="' + d + '"/></g>';
  const st = (x, y, on, key) => T(x, y, on ? 'ON' : 'OFF', { cls: on ? 'ta' : 'ts', fs: 12, k: key });
  function wave(x0, ym, w, A, fn, key, cls, n) {
    n = n || 160; let d = '';
    for (let i = 0; i <= n; i++) { const u = i / n; d += (i ? ' L' : 'M') + f1(x0 + u * w) + ' ' + f1(ym - A * fn(u)); }
    return '<path class="' + (cls || 'lna') + '" style="fill:none;stroke-width:2.6"' + k(key) + ' d="' + d + '"/>';
  }
  const axis = (x0, ym, w, h, key) => g(key, '<path class="ln2" style="fill:none" d="M' + x0 + ' ' + (ym - h) + ' V' + (ym + h) + ' M' + x0 + ' ' + ym + ' H' + (x0 + w) + '"/>' + T(x0 + w + 4, ym + 4, 't', { cls: 'ts', fs: 11, a: 'start' }));
  const hline = (x0, x1, y, key, lab) => g(key, '<line class="lna dsh" x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" style="stroke-width:1.6"/>' + (lab ? T(x1, y - 6, lab, { cls: 'ta', fs: 12, a: 'end' }) : ''));
  /* 變壓器次級的一個線圈（垂直，鼓包朝左） */
  function coil(x, y1, y2, dir) {
    const L = y2 - y1, cl = Math.min(56, L), y0 = y1 + (L - cl) / 2, r = cl / 8;
    let d = 'M' + x + ' ' + y1 + ' V' + y0;
    for (let i = 0; i < 4; i++) d += ' a' + r + ' ' + r + ' 0 0 ' + ((dir || -1) > 0 ? 1 : 0) + ' 0 ' + (2 * r);
    return W(d + ' V' + y2);
  }
  const sin2 = u => Math.sin(u * 4 * Math.PI);  /* 兩個週期 */
  window.__C2S = { W, dio, res, vac, bat, cap, flow, st, wave, axis, hline, coil, sin2, f1 };
})();
