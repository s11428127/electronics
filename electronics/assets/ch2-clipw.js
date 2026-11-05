/* ============================================================
   電子學 CH2 PART 3 截波／箝位波形圖（__C2W）—— 使用者 11/6：「故事和講義多加一點圖、波形的圖片」
   講義：自動插在 ch2-part3.html 各節推導後面（class 含 piv-fig → annot.js 的 EXCL，不影響筆跡錨點）
     shunt：基本（V_B = 4、V_γ = 0.7，削在 4.7）、參考①（V_B = 3：削下面 2.3）、參考②（V_B = 3：最高 −2.3）
     series：V_B = 3、V_γ = 0.7 → 分界點 2.3；ON 時 v_O = v_i − 2.3，OFF 時 0；最低 −12.3
     bidir：Example 2.7（V_B1 = 2、V_B2 = 4、V_γ = 0、峰值 6）無 R₂ ／ 有 R₂（½v_i + 1，最高 4）＋ VTC
     clamp：V_M = 5、V_B = 1、V_γ = 0.7 → V_C = 3.3，最高 1.7、最低 −8.3（含第一次充電的暫態）
   顏色一律 CSS 變數（暗色模式跟著變）
   ============================================================ */
(function () {
  'use strict';
  const TAU = Math.PI * 2, N = 400;
  const s2 = u => Math.sin(2 * TAU * u);
  const subs = s => String(s).replace(/_([A-Za-z0-9γ]+)/g, '<tspan baseline-shift="sub" font-size="75%">$1</tspan>');
  const t = (x, y, s, o) => { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 12) + '" text-anchor="' + (o.a || 'start') + '" fill="' + (o.c || 'var(--ink-2)') + '"' + (o.b ? ' font-weight="700"' : '') + ' stroke="var(--surface)" stroke-width="4" paint-order="stroke">' + subs(s) + '</text>'; };
  const svg = (W, H, s) => '<svg class="schem piv-svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" style="max-width:100%;height:auto" font-family="inherit">' + s + '</svg>';

  /* 波形圖：輸入（虛線）、輸出（粗藍）、二極體 ON 的時段塗色 */
  function fig(o) {
    const W = 640, x0 = 56, x1 = 560, y0 = 52, y1 = y0 + (o.h || 210), H = y1 + 26 + 18 * (o.notes || []).length;
    const X = u => x0 + (x1 - x0) * u, Y = v => y0 + (y1 - y0) * (o.vmax - v) / (o.vmax - o.vmin);
    const path = fn => { let d = '', pen = false; for (let i = 0; i <= N; i++) { const u = i / N, v = fn(u); if (v == null || !isFinite(v)) { pen = false; continue; } d += (pen ? 'L' : 'M') + X(u).toFixed(1) + ' ' + Y(v).toFixed(1) + ' '; pen = true; } return d; };
    let s = '';
    /* ON 時段 */
    (o.on || []).forEach(B => {
      let a = null;
      for (let i = 0; i <= N; i++) {
        const u = i / N, in_ = B.f(u);
        if (in_ && a === null) a = u;
        if ((!in_ || i === N) && a !== null) {
          const b = in_ ? u : (i - 1) / N;
          s += '<rect x="' + X(a).toFixed(1) + '" y="' + y0 + '" width="' + (X(b) - X(a)).toFixed(1) + '" height="' + (y1 - y0) + '" fill="' + B.c + '" opacity="0.10"/>';
          if (X(b) - X(a) > 28) s += t((X(a) + X(b)) / 2, B.top ? y0 + 14 : y1 - 6, B.lab, { a: 'middle', fs: 11, c: B.c, b: true });
          a = null;
        }
      }
    });
    for (let v = o.vmin; v <= o.vmax + 1e-9; v += o.step) s += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + x1 + '" y2="' + Y(v) + '" stroke="var(--line-soft)"/>' + t(x0 - 8, Y(v) + 4, (+v.toFixed(1)) + '', { a: 'end', c: 'var(--ink-3)', fs: 11 });
    s += '<line x1="' + x0 + '" y1="' + Y(0) + '" x2="' + x1 + '" y2="' + Y(0) + '" stroke="var(--ink-2)" stroke-width="1.4"/>' + t(x1 + 6, Y(0) + 4, 'ωt →', { c: 'var(--ink-3)', fs: 10.5 });
    (o.lines || []).forEach(L => { s += '<line x1="' + x0 + '" y1="' + Y(L.v) + '" x2="' + x1 + '" y2="' + Y(L.v) + '" stroke="' + (L.c || 'var(--warn)') + '" stroke-width="1.4" stroke-dasharray="6 4"/>' + t(x1 + 6, Y(L.v) + 4, L.lab, { c: L.c || 'var(--warn)', fs: 11.5, b: true }); });
    s += '<path d="' + path(u => o.vm * s2(u)) + '" fill="none" stroke="var(--ink-3)" stroke-width="1.5" stroke-dasharray="5 4"/>';
    if (o.helper) s += '<path d="' + path(o.helper.f) + '" fill="none" stroke="var(--ok)" stroke-width="1.6" stroke-dasharray="2 3"/>';
    s += '<path d="' + path(o.out) + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
    (o.marks || []).forEach(M => { s += '<circle cx="' + X(M.u) + '" cy="' + Y(M.v) + '" r="4.5" fill="' + (M.c || 'var(--accent)') + '"/>' + t(X(M.u) + (M.dx || 8), Y(M.v) + (M.dy || 4), M.lab, { fs: 12, b: true, c: M.c || 'var(--accent)', a: M.a }); });
    (o.arrows || []).forEach(A => {
      const xa = X(A.u), ya = Y(A.v1), yb = Y(A.v2), dir = yb > ya ? 1 : -1;
      s += '<line x1="' + xa + '" y1="' + ya + '" x2="' + xa + '" y2="' + (yb - dir * 2) + '" stroke="var(--ink)" stroke-width="1.6"/><path d="M' + (xa - 4) + ' ' + (yb - dir * 8) + ' L' + xa + ' ' + yb + ' L' + (xa + 4) + ' ' + (yb - dir * 8) + '" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' +
        t(xa + 7, (ya + yb) / 2 + 4, A.lab, { fs: 12, b: true, c: 'var(--ink)' });
    });
    /* 圖例 */
    const lg = [['5 4', 'var(--ink-3)', 1.5, '輸入 v_i'], ['', 'var(--accent)', 3, '輸出 v_O']];
    if (o.helper) lg.push(['2 3', 'var(--ok)', 1.6, o.helper.lab]);
    let lx = x0;
    lg.forEach(L => { s += '<line x1="' + lx + '" y1="18" x2="' + (lx + 24) + '" y2="18" stroke="' + L[1] + '" stroke-width="' + L[2] + '"' + (L[0] ? ' stroke-dasharray="' + L[0] + '"' : '') + '/>' + t(lx + 30, 22, L[3], { fs: 11.5 }); lx += 40 + L[3].replace(/_/g, '').length * 10.5; });
    if (o.tag) s += t(W - 8, 22, o.tag, { a: 'end', fs: 11.5, c: 'var(--ink-3)' });
    (o.notes || []).forEach((n, i) => { s += t(x0, y1 + 26 + 18 * i, n, { fs: 12, c: i ? 'var(--ink-3)' : 'var(--ink-2)' }); });
    return svg(W, H, s);
  }

  /* VTC：橫軸 v_i、縱軸 v_O */
  function vtc() {
    const W = 640, H = 330, cx = 300, cy = 150, sc = 20;
    const X = v => cx + v * sc, Y = v => cy - v * sc;
    let s = '';
    for (let v = -6; v <= 6; v += 2) { s += '<line x1="' + X(v) + '" y1="' + Y(5) + '" x2="' + X(v) + '" y2="' + Y(-5) + '" stroke="var(--line-soft)"/>' + t(X(v), Y(-5) + 16, v + '', { a: 'middle', fs: 11, c: 'var(--ink-3)' }); }
    for (let v = -4; v <= 4; v += 2) { s += '<line x1="' + X(-6) + '" y1="' + Y(v) + '" x2="' + X(6) + '" y2="' + Y(v) + '" stroke="var(--line-soft)"/>' + t(X(-6) - 8, Y(v) + 4, v + '', { a: 'end', fs: 11, c: 'var(--ink-3)' }); }
    s += '<line x1="' + X(-6.4) + '" y1="' + cy + '" x2="' + X(6.6) + '" y2="' + cy + '" stroke="var(--ink-2)" stroke-width="1.4"/><line x1="' + cx + '" y1="' + Y(5.2) + '" x2="' + cx + '" y2="' + Y(-5.2) + '" stroke="var(--ink-2)" stroke-width="1.4"/>' +
      t(X(6.6) + 4, cy + 4, 'v_i', { fs: 13, b: true }) + t(cx + 6, Y(5.2) + 4, 'v_O', { fs: 13, b: true });
    const p = pts => 'M' + pts.map(q => X(q[0]).toFixed(1) + ' ' + Y(q[1]).toFixed(1)).join(' L');
    s += '<path d="' + p([[2, 2], [6, 4]]) + '" fill="none" stroke="var(--ok)" stroke-width="2.4" stroke-dasharray="6 4"/>';
    s += '<path d="' + p([[-6, -4], [-4, -4], [2, 2], [6, 2]]) + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
    s += t(X(-5.2), Y(-4) - 16, 'D_2 ON：釘在 −4', { a: 'middle', fs: 12, b: true, c: 'var(--accent)' }) +
      t(X(-0.6), Y(-0.6) + 26, '都 OFF：v_O = v_i（斜率 1）', { a: 'start', fs: 12, b: true, c: 'var(--ink)' }) +
      t(X(4.1), Y(2) + 18, 'D_1 ON：釘在 2', { a: 'middle', fs: 12, b: true, c: 'var(--accent)' }) +
      t(X(4.3), Y(4) - 8, '有 R_2：斜率 ½，最高 4', { a: 'middle', fs: 12, b: true, c: 'var(--ok)' });
    s += '<circle cx="' + X(2) + '" cy="' + Y(2) + '" r="4.5" fill="var(--warn)"/><circle cx="' + X(-4) + '" cy="' + Y(-4) + '" r="4.5" fill="var(--warn)"/>' +
      t(X(2) - 8, Y(2) - 8, '分界點 v_i = 2', { a: 'end', fs: 11.5, c: 'var(--warn)', b: true }) + t(X(-4) + 8, Y(-4) + 18, '分界點 v_i = −4', { fs: 11.5, c: 'var(--warn)', b: true });
    s += t(40, H - 30, '把「每個 v_i 進去會出來多少 v_O」畫成一條線，叫 VTC（電壓轉移特性）。不用畫時間，三段直接看出來。', { fs: 12 }) +
      t(40, H - 12, 'Example 2.7：V_B1 = 2 V、V_B2 = 4 V、V_γ = 0；綠虛線是多串 R_1 = R_2 時的上段 v_O = ½v_i + 1。', { fs: 12, c: 'var(--ink-3)' });
    return svg(W, H, s);
  }

  const A = 'var(--accent)', B = 'var(--warn)';
  const FIG = {
    sh0: () => fig({ vm: 10, vmin: -10, vmax: 10, step: 5, tag: 'V_B = 4 V、V_γ = 0.7 V',
      out: u => Math.min(10 * s2(u), 4.7), on: [{ f: u => 10 * s2(u) > 4.7, lab: 'D ON', c: A, top: true }],
      lines: [{ v: 4.7, lab: '4.7 V' }], marks: [{ u: 0.3, v: -6, lab: 'D OFF：v_O = v_i', dx: 12, dy: 4 }],
      notes: ['塗色那幾段 D ON：輸出被釘在 V_B + V_γ = 4.7 V（上面被削平）。', '沒塗色的時候 D OFF：R 沒電流，輸出 = 輸入。'] }),
    sh1: () => fig({ vm: 10, vmin: -10, vmax: 10, step: 5, tag: '參考①：二極體反過來（V_B = 3 V）',
      out: u => Math.max(10 * s2(u), 2.3), on: [{ f: u => 10 * s2(u) < 2.3, lab: 'D ON', c: A }],
      lines: [{ v: 2.3, lab: '2.3 V' }],
      notes: ['尖端朝上：輸入掉到 V_B − V_γ = 2.3 V 以下才 ON → 削掉的是「下面」。', '輸出最低就是 2.3 V，上面照著輸入走。'] }),
    sh2: () => fig({ vm: 10, vmin: -10, vmax: 10, step: 5, tag: '參考②：電池反過來（V_B = 3 V）',
      out: u => Math.min(10 * s2(u), -2.3), on: [{ f: u => 10 * s2(u) > -2.3, lab: 'D ON', c: A, top: true }],
      lines: [{ v: -2.3, lab: '−2.3 V' }],
      notes: ['電池 + 在下：門檻變成 V_γ − V_B = −2.3 V，連 0 以上都被削掉。', '大部分時間 D 都 ON，輸出最高只有 −2.3 V。'] }),
    se: () => fig({ vm: 10, vmin: -15, vmax: 10, step: 5, h: 230, tag: 'V_B = 3 V、V_γ = 0.7 V',
      out: u => { const v = 10 * s2(u); return v < 2.3 ? v - 2.3 : 0; }, on: [{ f: u => 10 * s2(u) < 2.3, lab: 'D ON', c: A, top: true }],
      helper: { f: u => 10 * s2(u) - 2.3, lab: 'v_i − 2.3（輸入往下搬）' },
      lines: [{ v: 2.3, lab: '分界 2.3' }], marks: [{ u: 0.375, v: -12.3, lab: '最低 −10 − 2.3 = −12.3 V', dx: 10, dy: 5 }, { u: 0.125, v: 0, lab: 'D OFF：v_O = 0', dy: 20, a: 'middle', dx: 0 }],
      notes: ['輸入高過分界點 V_B − V_γ = 2.3 V：D OFF、整條路斷掉，輸出 = 0。', '輸入低於 2.3 V：D ON，輸出 = 輸入整條往下搬 2.3 V（綠點線），所以輸出永遠 ≤ 0。'] }),
    bd0: () => fig({ vm: 6, vmin: -6, vmax: 6, step: 2, tag: 'Example 2.7（無 R_2）',
      out: u => Math.max(-4, Math.min(2, 6 * s2(u))),
      on: [{ f: u => 6 * s2(u) > 2, lab: 'D_1 ON', c: A, top: true }, { f: u => 6 * s2(u) < -4, lab: 'D_2 ON', c: B }],
      lines: [{ v: 2, lab: '上限 2 V' }, { v: -4, lab: '下限 −4 V' }],
      notes: ['藍色時段 D_1 ON → 釘在上限 V_B1 = 2 V；橘色時段 D_2 ON → 釘在下限 −V_B2 = −4 V。', '沒塗色的時候兩顆都 OFF：輸出 = 輸入。兩顆不會同時 ON，所以只有三種時段。'] }),
    bd1: () => fig({ vm: 6, vmin: -6, vmax: 6, step: 2, tag: 'Example 2.7（D_1 支路多串 R_2，R_1 = R_2）',
      out: u => { const v = 6 * s2(u); return v > 2 ? 0.5 * v + 1 : Math.max(v, -4); },
      on: [{ f: u => 6 * s2(u) > 2, lab: 'D_1 ON', c: A }, { f: u => 6 * s2(u) < -4, lab: 'D_2 ON', c: B }],
      lines: [{ v: 2, lab: '2 V' }, { v: -4, lab: '−4 V' }], marks: [{ u: 0.125, v: 4, lab: '最高 ½·6 + 1 = 4 V', dy: -8, a: 'middle', dx: 0 }],
      notes: ['D_1 ON 時超過 2 V 的部分被 R_1、R_2 分一半：v_O = ½v_i + 1 → 上面不再是平的，最高 4 V。', '下面那顆沒串 R_2，還是平平地釘在 −4 V。'] }),
    cl: () => fig({ vm: 5, vmin: -10, vmax: 5, step: 2.5, h: 230, tag: 'V_M = 5 V、V_B = 1 V、V_γ = 0.7 V',
      out: u => { const v = 5 * s2(u); if (u <= 0.125) return Math.min(v, 1.7); return v - 3.3; },
      on: [{ f: u => u <= 0.125 && 5 * s2(u) > 1.7, lab: '充電', c: A, top: true }],
      lines: [{ v: 1.7, lab: '最高 1.7' }, { v: -8.3, lab: '最低 −8.3' }], arrows: [{ u: 0.625, v1: 5, v2: 1.7, lab: '整條往下搬 V_C = 3.3 V' }],
      notes: ['一開始輸入爬上峰值那一小段 D ON、電容被充到 V_C = V_M − V_B − V_γ = 3.3 V。', '之後 D 一直 OFF，電容鎖住：v_O = v_i − 3.3，形狀不變、整個往下搬。', '最高 V_B + V_γ = 1.7 V；最低 −2V_M + V_B + V_γ = −8.3 V。'] }),
    vtc
  };

  window.__C2W = { fig, vtc, FIG };

  function insert() {
    if (location.pathname.indexOf('ch2-part3') < 0) return;
    const place = (secId, list) => {
      const sec = document.getElementById(secId); if (!sec || sec.querySelector('.c2w-fig')) return;
      const ds = sec.querySelectorAll(':scope > .derive'), after = ds[ds.length - 1] || sec.querySelector(':scope > .eq');
      if (!after) return;
      let ref = after;
      list.forEach(([k, cap]) => {
        const f = document.createElement('figure'); f.className = 'schem-box piv-fig c2w-fig';
        f.innerHTML = '<div>' + FIG[k]() + '</div><figcaption>' + cap + '</figcaption>';
        ref.parentNode.insertBefore(f, ref.nextSibling); ref = f;
      });
    };
    place('shunt', [['sh0', '📈 波形：基本並聯截波（上面削平在 4.7 V）'], ['sh1', '📈 波形：參考①（二極體反過來 → 削下面）'], ['sh2', '📈 波形：參考②（電池反過來 → 最高 V<sub>γ</sub> − V<sub>B</sub>）']]);
    place('series', [['se', '📈 波形：串聯截波（OFF 時 0、ON 時往下平移 V<sub>B</sub> − V<sub>γ</sub>）']]);
    place('bidir', [['bd0', '📈 波形：Example 2.7 三個時段'], ['bd1', '📈 波形：Example 2.7 加 R<sub>2</sub>（上段變斜的）'], ['vtc', '📈 換個角度：v<sub>O</sub> 對 v<sub>i</sub>（VTC）']]);
    place('clamp', [['cl', '📈 波形：箝位器（先充電，之後整條往下搬）']]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insert); else insert();
})();
