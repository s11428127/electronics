/* ============================================================
   電子學 CH2 PIV 波形圖（__C2PIV）—— 使用者 11/5：「PIV 到底是什麼」→ 直接畫圖、波形，加進故事和講義
   畫「二極體兩端電壓 v_D = 陽極 − 陰極」對時間的波形（兩個週期）；v_D < 0 = 被逆偏，最低點 = PIV。
   - 充電器（Example 2.1）：V_M = 24、V_B = 12、V_γ = 0.6 → PIV = 36 V
   - 中間抽頭（關著的 D₂）：V_m = 15、V_γ = 0.7 → 2V_m − V_γ = 29.3 V（以中間抽頭為 0 V）
   - 橋式（關著的 D₃，D₄ 一樣）：V_m = 15、V_γ = 0.7 → V_m − V_γ = 14.3 V（照 11/3 板書：以右角為 0 V）
     |v_S| < 2V_γ 四顆都 OFF，取對稱 v_D3 = −v_S/2（兩顆 OFF 平分），跟導通區接得起來。
   講義：自動插在 ch2-part2.html 的 chg、fwc、brg 小節的 PIV 推導後面，cmp 小節放「中間抽頭 vs 橋式」疊圖
   故事：__C2PIV.story(kind, keys) 回傳故事畫面用的 SVG（只用 class）
   ============================================================ */
(function () {
  'use strict';
  const TAU = Math.PI * 2, N = 320;
  const KIND = {
    chg: {
      title: '電池充電器（Example 2.1）：二極體 D 兩端電壓', vmin: -40, vmax: 30,
      vs: u => 24 * Math.sin(2 * TAU * u),
      an: u => Math.min(24 * Math.sin(2 * TAU * u), 12.6), ca: () => 12,
      vd: u => Math.min(24 * Math.sin(2 * TAU * u), 12.6) - 12,
      pk: 0.375, piv: 36, anV: -24, caV: 12,
      lab: { an: '陽極（接電源）', ca: '陰極（接電池 +12 V）' },
      note: '電源在谷底 −24 V、電池還是 +12 V：陰極 − 陽極 = 12 − (−24) = 36 V'
    },
    ct: {
      title: '中間抽頭：關著的那顆 D₂ 兩端電壓', vmin: -40, vmax: 30,
      vs: u => 15 * Math.sin(2 * TAU * u),
      an: u => -15 * Math.sin(2 * TAU * u), ca: u => Math.max(Math.abs(15 * Math.sin(2 * TAU * u)) - 0.7, 0),
      vd: u => -15 * Math.sin(2 * TAU * u) - Math.max(Math.abs(15 * Math.sin(2 * TAU * u)) - 0.7, 0),
      pk: 0.125, piv: 29.3, anV: -15, caV: 14.3,
      lab: { an: '陽極（下半線圈 = −v_S）', ca: '陰極（輸出 |v_S| − V_γ）' },
      note: '陽極在線圈底 −15 V、陰極在輸出 +14.3 V：差 2V_m − V_γ = 29.3 V（跨整個次級）'
    },
    br: {
      title: '橋式：關著的 D₃ 兩端電壓（D₄ 一樣）', vmin: -40, vmax: 30,
      vs: u => 15 * Math.sin(2 * TAU * u),
      an: () => 0, ca: u => { const v = 15 * Math.sin(2 * TAU * u); return v > 1.4 ? v - 0.7 : NaN; },
      vd: u => { const v = 15 * Math.sin(2 * TAU * u); return v > 1.4 ? 0.7 - v : v < -1.4 ? 0.7 : -v / 2; },
      pk: 0.125, piv: 14.3, anV: 0, caV: 14.3,
      lab: { an: '陽極（右角，當 0 V）', ca: '陰極（上角 = v_S − V_γ）' },
      note: '陰極在 V_m − V_γ = 14.3 V、陽極在 0 V（11/3 板書）：差 V_m − V_γ = 14.3 V，只跨一個 v_S'
    }
  };
  const subs = s => String(s).replace(/_([A-Za-zγ]+)/g, '<tspan baseline-shift="sub" font-size="75%">$1</tspan>');

  /* ── 講義版（顏色用 CSS 變數，暗色模式跟著變） ── */
  function page(kind) {
    const K = KIND[kind];
    const W = 640, H = 330, x0 = 62, x1 = 596, y0 = 58, y1 = 262;
    const X = u => x0 + (x1 - x0) * u, Y = v => y0 + (y1 - y0) * (K.vmax - v) / (K.vmax - K.vmin);
    const path = fn => { let d = '', pen = false; for (let i = 0; i <= N; i++) { const u = i / N, v = fn(u); if (!isFinite(v)) { pen = false; continue; } d += (pen ? 'L' : 'M') + X(u).toFixed(1) + ' ' + Y(v).toFixed(1) + ' '; pen = true; } return d; };
    const t = (x, y, s, o) => { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 12) + '" text-anchor="' + (o.a || 'start') + '" fill="' + (o.c || 'var(--ink-2)') + '"' + (o.b ? ' font-weight="700"' : '') + (o.halo ? ' stroke="var(--surface)" stroke-width="4" paint-order="stroke"' : '') + '>' + subs(s) + '</text>'; };
    let s = '';
    for (let v = -40; v <= 30; v += 10) { s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + x1 + '" y2="' + Y(v) + '" stroke="var(--line-soft)" stroke-width="1"/>' + t(x0 - 8, Y(v) + 4, v + '', { a: 'end', c: 'var(--ink-3)', fs: 11 }); }
    s += '<line x1="' + x0 + '" y1="' + Y(0) + '" x2="' + x1 + '" y2="' + Y(0) + '" stroke="var(--ink-2)" stroke-width="1.4"/>' + t(x1 + 6, Y(0) + 4, '0 V', { c: 'var(--ink-3)', fs: 11 }) + t(x1 + 6, Y(0) + 18, 'ωt →', { c: 'var(--ink-3)', fs: 10 });
    /* 逆偏區塗色 */
    let fill = 'M' + X(0) + ' ' + Y(0) + ' ';
    for (let i = 0; i <= N; i++) { const u = i / N; fill += 'L' + X(u).toFixed(1) + ' ' + Y(Math.min(0, K.vd(u))).toFixed(1) + ' '; }
    s += '<path d="' + fill + 'L' + X(1) + ' ' + Y(0) + ' Z" fill="var(--accent)" opacity="0.12" stroke="none"/>';
    s += '<path d="' + path(K.vs) + '" fill="none" stroke="var(--ink-3)" stroke-width="1.5" stroke-dasharray="5 4"/>';
    if (kind !== 'br') s += '<path d="' + path(K.an) + '" fill="none" stroke="var(--warn)" stroke-width="1.8" stroke-dasharray="7 4" opacity="' + (kind === 'chg' ? 0 : 1) + '"/>';
    s += '<path d="' + path(K.ca) + '" fill="none" stroke="var(--ok)" stroke-width="2"/>';
    if (kind === 'br') s += '<path d="' + path(K.an) + '" fill="none" stroke="var(--warn)" stroke-width="1.8" stroke-dasharray="7 4"/>';
    s += '<path d="' + path(K.vd) + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
    /* 那一瞬間：陽極、陰極兩點的距離 */
    const xp = X(K.pk), xb = xp + 34;
    s += '<circle cx="' + xp + '" cy="' + Y(K.anV) + '" r="4.5" fill="var(--warn)"/><circle cx="' + xp + '" cy="' + Y(K.caV) + '" r="4.5" fill="var(--ok)"/>' +
      '<line x1="' + xp + '" y1="' + Y(K.anV) + '" x2="' + xb + '" y2="' + Y(K.anV) + '" stroke="var(--ink-3)" stroke-dasharray="2 3"/><line x1="' + xp + '" y1="' + Y(K.caV) + '" x2="' + xb + '" y2="' + Y(K.caV) + '" stroke="var(--ink-3)" stroke-dasharray="2 3"/>' +
      '<line x1="' + xb + '" y1="' + (Y(K.caV) + 6) + '" x2="' + xb + '" y2="' + (Y(K.anV) - 6) + '" stroke="var(--ink)" stroke-width="1.6"/>' +
      '<path d="M' + (xb - 4) + ' ' + (Y(K.caV) + 8) + ' L' + xb + ' ' + Y(K.caV) + ' L' + (xb + 4) + ' ' + (Y(K.caV) + 8) + ' M' + (xb - 4) + ' ' + (Y(K.anV) - 8) + ' L' + xb + ' ' + Y(K.anV) + ' L' + (xb + 4) + ' ' + (Y(K.anV) - 8) + '" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
      t(xb + 8, (Y(K.caV) + Y(K.anV)) / 2 + 4, '差 ' + K.piv + ' V', { b: true, c: 'var(--ink)', fs: 13, halo: true });
    s += '<line x1="' + xp + '" y1="' + Y(0) + '" x2="' + xp + '" y2="' + Y(-K.piv) + '" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="4 3"/>' +
      '<circle cx="' + xp + '" cy="' + Y(-K.piv) + '" r="6" fill="var(--bad)"/>' + t(xp + 12, Y(-K.piv) + 20, 'PIV = ' + K.piv + ' V', { b: true, c: 'var(--bad)', fs: 15, halo: true });
    /* 圖例 */
    const lg = [['5 4', 'var(--ink-3)', 1.5, '電源 v_S'], ['7 4', 'var(--warn)', 1.8, K.lab.an], ['', 'var(--ok)', 2, K.lab.ca], ['', 'var(--accent)', 3, 'v_D = 陽極 − 陰極']];
    if (kind === 'chg') lg[1] = null;
    let lx = x0, ly = 22;
    lg.filter(Boolean).forEach(L => {
      const w = 34 + L[3].replace(/_/g, '').length * 11.5;
      if (lx + w > x1 + 30) { lx = x0; ly += 18; }
      s += '<line x1="' + lx + '" y1="' + (ly - 4) + '" x2="' + (lx + 24) + '" y2="' + (ly - 4) + '" stroke="' + L[1] + '" stroke-width="' + L[2] + '"' + (L[0] ? ' stroke-dasharray="' + L[0] + '"' : '') + '/>' + t(lx + 30, ly, L[3], { fs: 11.5, c: 'var(--ink-2)' });
      lx += w;
    });
    s += t(x0, H - 30, '藍色塗色 = 二極體被逆偏（OFF）的時候；藍線最低點的深度就是 PIV。', { fs: 11.5, c: 'var(--ink-3)' }) + t(x0, H - 12, K.note, { fs: 11.5, c: 'var(--ink-2)' });
    return '<svg class="schem piv-svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" style="max-width:100%;height:auto" font-family="inherit">' + s + '</svg>';
  }

  /* 中間抽頭 vs 橋式：同一個 V_m 疊在一起比深度 */
  function compare() {
    const W = 640, H = 300, x0 = 62, x1 = 596, y0 = 40, y1 = 246, vmin = -35, vmax = 20;
    const X = u => x0 + (x1 - x0) * u, Y = v => y0 + (y1 - y0) * (vmax - v) / (vmax - vmin);
    const path = fn => { let d = ''; for (let i = 0; i <= N; i++) { const u = i / N; d += (i ? 'L' : 'M') + X(u).toFixed(1) + ' ' + Y(fn(u)).toFixed(1) + ' '; } return d; };
    const t = (x, y, s, o) => { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 12) + '" text-anchor="' + (o.a || 'start') + '" fill="' + (o.c || 'var(--ink-2)') + '"' + (o.b ? ' font-weight="700"' : '') + ' stroke="var(--surface)" stroke-width="4" paint-order="stroke">' + subs(s) + '</text>'; };
    let s = '';
    for (let v = -30; v <= 20; v += 10) s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + x1 + '" y2="' + Y(v) + '" stroke="var(--line-soft)"/>' + t(x0 - 8, Y(v) + 4, v + '', { a: 'end', c: 'var(--ink-3)', fs: 11 });
    s += '<line x1="' + x0 + '" y1="' + Y(0) + '" x2="' + x1 + '" y2="' + Y(0) + '" stroke="var(--ink-2)" stroke-width="1.4"/>';
    s += '<path d="' + path(KIND.ct.vd) + '" fill="none" stroke="var(--warn)" stroke-width="3"/><path d="' + path(KIND.br.vd) + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
    s += '<circle cx="' + X(0.125) + '" cy="' + Y(-29.3) + '" r="5.5" fill="var(--warn)"/>' + t(X(0.125) + 12, Y(-29.3) + 5, '中間抽頭 PIV = 2V_m − V_γ = 29.3 V', { b: true, c: 'var(--warn)', fs: 13 }) +
      '<circle cx="' + X(0.125) + '" cy="' + Y(-14.3) + '" r="5.5" fill="var(--accent)"/>' + t(X(0.125) + 12, Y(-14.3) + 5, '橋式 PIV = V_m − V_γ = 14.3 V', { b: true, c: 'var(--accent)', fs: 13 });
    s += t(x0, 22, '同一個 V_m = 15 V、V_γ = 0.7 V：關著的二極體兩端電壓（越往下 = 被逆偏越兇）', { fs: 12, c: 'var(--ink-2)' }) +
      t(x0, H - 14, '橋式的凹陷只有中間抽頭的一半 → 同樣的輸出，橋式可以用耐壓低一半的二極體。', { fs: 12, c: 'var(--ink-2)' });
    return '<svg class="schem piv-svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" style="max-width:100%;height:auto" font-family="inherit">' + s + '</svg>';
  }

  /* ── 故事版（640 × 400 畫面裡的一塊；只用 class） ── */
  function story(kind, o) {
    o = o || {};
    const K = KIND[kind], x0 = o.x || 330, x1 = x0 + (o.w || 280), y0 = o.y || 105, y1 = y0 + (o.h || 190);
    const X = u => x0 + (x1 - x0) * u, Y = v => y0 + (y1 - y0) * (K.vmax - v) / (K.vmax - K.vmin);
    const kk = k => (k ? ' data-k="' + k + '"' : '');
    const path = (fn, cls, k, extra) => { let d = '', pen = false; for (let i = 0; i <= N; i++) { const u = i / N, v = fn(u); if (!isFinite(v)) { pen = false; continue; } d += (pen ? 'L' : 'M') + X(u).toFixed(1) + ' ' + Y(v).toFixed(1) + ' '; pen = true; } return '<path class="' + cls + '" style="fill:none;' + (extra || '') + '"' + kk(k) + ' d="' + d + '"/>'; };
    const T = (x, y, str, c) => window.__Story.draw.text(x, y, str, c);
    let s = '<g' + kk('pax') + '><line class="ln2" x1="' + x0 + '" y1="' + Y(0) + '" x2="' + x1 + '" y2="' + Y(0) + '"/><line class="ln2" x1="' + x0 + '" y1="' + Y(K.vmax) + '" x2="' + x0 + '" y2="' + Y(K.vmin) + '"/>' +
      T(x0 - 6, Y(0) + 4, '0', { cls: 'ts', fs: 11, a: 'end' }) + '</g>';
    s += path(K.vs, 'ln2 dsh', 'pvs');
    s += path(K.ca, 'ln', 'pca', 'stroke-width:2');
    if (kind !== 'chg') s += path(K.an, 'ln dsh', 'pan', 'stroke-width:1.6');
    let fill = 'M' + X(0) + ' ' + Y(0) + ' ';
    for (let i = 0; i <= N; i++) { const u = i / N; fill += 'L' + X(u).toFixed(1) + ' ' + Y(Math.min(0, K.vd(u))).toFixed(1) + ' '; }
    s += '<g' + kk('pvd') + '><path class="e" style="opacity:.15" d="' + fill + 'L' + X(1) + ' ' + Y(0) + ' Z"/>' + path(K.vd, 'lna', '', 'stroke-width:3') + '</g>';
    const xp = X(K.pk), xb = xp + 26;
    s += '<g' + kk('pbr') + '><circle class="ink" cx="' + xp + '" cy="' + Y(K.anV) + '" r="4"/><circle class="ink" cx="' + xp + '" cy="' + Y(K.caV) + '" r="4"/>' +
      '<line class="ln" x1="' + xb + '" y1="' + Y(K.caV) + '" x2="' + xb + '" y2="' + Y(K.anV) + '" style="stroke-width:1.6"/>' + '<rect class="bgw" style="stroke:none" x="' + (xb + 3) + '" y="' + ((Y(K.caV) + Y(K.anV)) / 2 - 9) + '" width="64" height="18" rx="4"/>' + T(xb + 6, (Y(K.caV) + Y(K.anV)) / 2 + 4, '差 ' + K.piv + ' V', { cls: 't', fs: 12, a: 'start' }) + '</g>';
    s += '<g' + kk('ppk') + '><circle class="acc" cx="' + xp + '" cy="' + Y(-K.piv) + '" r="6"/>' + T(xp + 10, Y(-K.piv) + 18, 'PIV = ' + K.piv + ' V', { cls: 'ta', fs: 14, a: 'start' }) + '</g>';
    return s;
  }

  window.__C2PIV = { page, compare, story, KIND };

  /* ── 講義：自動插圖 ── */
  function insert() {
    const P = document.body && document.body.dataset && location.pathname.indexOf('ch2-part2') >= 0;
    if (!P) return;
    const place = (secId, html, cap) => {
      const sec = document.getElementById(secId); if (!sec || sec.querySelector('.piv-fig')) return;
      const ds = Array.prototype.slice.call(sec.querySelectorAll(':scope > .derive')).filter(d => /PIV/.test(d.textContent));
      const after = ds[ds.length - 1] || sec.querySelector(':scope > .eq');
      if (!after) return;
      const f = document.createElement('figure'); f.className = 'schem-box piv-fig';
      f.innerHTML = '<div>' + html + '</div><figcaption>' + cap + '</figcaption>';
      after.parentNode.insertBefore(f, after.nextSibling);
    };
    place('chg', page('chg'), '📉 PIV 波形：充電器的二極體兩端電壓（Example 2.1 的數字）');
    place('fwc', page('ct'), '📉 PIV 波形：中間抽頭關著的那顆（V<sub>m</sub> = 15 V）');
    place('brg', page('br'), '📉 PIV 波形：橋式關著的那顆（板書數字 V<sub>m</sub> = 15 V）');
    place('cmp', compare(), '📉 兩種全波的 PIV 疊在一起比');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insert); else insert();
})();
