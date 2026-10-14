/* ============================================================
   電子實習 第四章 整流器 —— 互動模組、可改數字例題、結果（含使用者 9/30 結報數據）、測驗
   二極體：1N4002（SPICE 模型 IS = 14.11 nA、N = 1.984、RS = 33.89 mΩ）
   使用者 9/30：V1 9.92 Vpp（59.95 Hz）、Vo 峰值 4.32 V、V1 AC 檔 3.4639 V、Vo ACV 檔 1.5714 V、二極體 DC −1.2906 V
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, bindRange, clamp, lerp } = E;
  const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  const TAU = Math.PI * 2, VT = 0.025865, SQ2 = Math.SQRT2;
  const SP = { n: 1.984, is: 14.11e-9, rs: 0.03389 };
  /* 使用者 9/30 結報（半波、1N4002、R1 = 1 kΩ、設定 10 Vpp 60 Hz） */
  const MY = { vpp: 9.92, v1ac: 3.4639, vopk: 4.32, vd: -1.2906, voac: 1.5714 };
  const vOf = (i, m) => i <= 0 ? 0 : m.n * VT * Math.log(i / m.is + 1) + i * m.rs;
  /* 串 R、nd 顆二極體：Vi = I·R + nd·V_D(I)；回傳輸出 Vo = I·R */
  function out(Vi, R, nd) {
    if (Vi <= 0) return 0;
    let lo = 0, hi = Vi / R;
    for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; (mid * R + nd * vOf(mid, SP) > Vi) ? hi = mid : lo = mid; }
    return (lo + hi) / 2 * R;
  }
  /* 一個週期取樣：fn(θ) → Vo；回傳峰值、平均、交流有效值、總有效值、導通比例 */
  function stats(fn, N) {
    N = N || 720; let s = 0, s2 = 0, pk = 0, on = 0;
    for (let k = 0; k < N; k++) { const v = fn(TAU * (k + 0.5) / N); s += v; s2 += v * v; if (v > pk) pk = v; if (v > 0.05) on++; }
    const avg = s / N, rms = Math.sqrt(s2 / N);
    return { pk, avg, rms, ac: Math.sqrt(Math.max(0, rms * rms - avg * avg)), on: on / N };
  }
  window.__REC = { MY, SP, out, stats };
  const dot = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fillStyle = col; ctx.fill(); };
  /* 波形座標框：t 為弧度（0..t1），v 為電壓 */
  function axes(ctx, x0, y0, x1, y1, v0, v1, o) {
    o = o || {};
    const X = t => lerp(x0, x1, t / o.t1), Y = v => lerp(y1, y0, (v - v0) / (v1 - v0));
    ctx.strokeStyle = C['line-soft'] || C.line; ctx.lineWidth = 1;
    (o.vt || []).forEach(v => { ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke(); label(ctx, x0 - 6, Y(v), String(v), C['ink-3'], 10, 'right'); });
    ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x1, Y(0)); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
    if (o.tl) labelCJK(ctx, x1, Y(0) + 13, o.tl, C['ink-3'], 10.5, 'right');
    if (o.vl) labelCJK(ctx, x0 + 6, y0 + 4, o.vl, C['ink-3'], 10.5, 'left');
    return { X, Y };
  }
  const plot = (ctx, F, fn, t1, col, lw, dash, fill) => {
    const N = 360; ctx.beginPath();
    for (let k = 0; k <= N; k++) { const t = t1 * k / N, x = F.X(t), y = F.Y(fn(t)); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    if (fill) { ctx.save(); ctx.lineTo(F.X(t1), F.Y(0)); ctx.lineTo(F.X(0), F.Y(0)); ctx.closePath(); ctx.globalAlpha = 0.16; ctx.fillStyle = fill; ctx.fill(); ctx.restore();
      ctx.beginPath(); for (let k = 0; k <= N; k++) { const t = t1 * k / N, x = F.X(t), y = F.Y(fn(t)); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }
    ctx.strokeStyle = col; ctx.lineWidth = lw || 2; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
  };
  const hline = (ctx, F, v, x0, x1, col, txt, side) => {
    ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(x0, F.Y(v)); ctx.lineTo(x1, F.Y(v)); ctx.stroke(); ctx.setLineDash([]);
    if (txt) labelCJK(ctx, side === 'l' ? x0 + 4 : x1 - 4, F.Y(v) - 9, txt, col, 11, side === 'l' ? 'left' : 'right', '700');
  };

  /* ══════════════════════════════════════════════════════════
     ① 四個數字：V_m、V_pp、V_rms、V_avg；把駝峰攤平
     ══════════════════════════════════════════════════════════ */
  (function valLab() {
    const cv = document.getElementById('cv-val'); if (!cv) return;
    let Vpp = 10, mode = 'sin', st = null;
    const f = (t, Vm) => { const s = Vm * Math.sin(t); return mode === 'sin' ? s : mode === 'half' ? Math.max(0, s) : Math.abs(s); };
    const num = Vm => ({ rms: mode === 'half' ? Vm / 2 : Vm / SQ2, avg: mode === 'sin' ? 0 : mode === 'half' ? Vm / Math.PI : 2 * Vm / Math.PI });
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.8 : 0.4, minH: 240, maxH: 340, draw(ctx, w, h) {
      const Vm = Vpp / 2, n = num(Vm), x0 = Math.max(40, w * 0.07), x1 = w - 14;
      const F = axes(ctx, x0, 26, x1, h - 20, -Vm * 1.15, Vm * 1.25, { t1: 2 * TAU, vt: [] });
      plot(ctx, F, t => f(t, Vm), 2 * TAU, C.accent, 2.6, null, C.accent);
      if (mode !== 'sin') plot(ctx, F, t => Vm * Math.sin(t), 2 * TAU, C['ink-3'], 1.2, [3, 4]);
      hline(ctx, F, Vm, x0, x1, C['ink-2'], 'V<sub>m</sub> = ' + Vm.toFixed(2) + ' V', 'r');
      hline(ctx, F, n.rms, x0, x1, C.warn, 'V<sub>rms</sub> = ' + n.rms.toFixed(2) + ' V', 'l');
      hline(ctx, F, n.avg, x0, x1, C.ink, 'V<sub>avg</sub> = ' + n.avg.toFixed(2) + ' V' + (mode === 'sin' ? '（上下抵消）' : '（攤平後的高度）'), 'r');
      /* V_pp 箭頭 */
      if (mode === 'sin') { const xa = F.X(TAU * 1.25); ctx.strokeStyle = C['ink-2']; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(xa, F.Y(Vm)); ctx.lineTo(xa, F.Y(-Vm)); ctx.stroke(); labelCJK(ctx, xa + 6, F.Y(-Vm * 0.55), 'V<sub>pp</sub> = ' + Vpp.toFixed(1) + ' V', C['ink-2'], 11.5, 'left', '700'); }
    } });
    function msg() {
      const Vm = Vpp / 2, n = num(Vm);
      setHTML('val-m', Vm.toFixed(2) + ' V'); setHTML('val-r', n.rms.toFixed(3) + ' V'); setHTML('val-a', n.avg.toFixed(3) + ' V');
      setHTML('val-msg', mode === 'sin' ? '完整正弦：上半跟下半面積一樣，<b>平均 = 0</b>（電表 DC 檔讀 0）。有效值 V<sub>m</sub>/√2 = ' + n.rms.toFixed(2) + ' V 是 AC 檔讀的；V<sub>pp</sub> = 2√2 V<sub>rms</sub> ≈ 2.83 V<sub>rms</sub>。'
        : mode === 'half' ? '半波：只留上半，攤平後只剩 <b>V<sub>m</sub>/π = 0.318 V<sub>m</sub> = ' + n.avg.toFixed(2) + ' V</b>（= 0.45 V<sub>rms</sub>，這裡的 V<sub>rms</sub> 指輸入正弦的 ' + (Vm / SQ2).toFixed(2) + ' V）。'
        : '全波：負半週翻上來，面積加倍，<b>2V<sub>m</sub>/π = 0.637 V<sub>m</sub> = ' + n.avg.toFixed(2) + ' V</b>（= 0.9 V<sub>rms</sub>）。');
      st.redraw();
    }
    bindRange('val-vpp', x => x.toFixed(1) + ' V', x => { Vpp = x; msg(); });
    document.querySelectorAll('[data-vm]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.vm; document.querySelectorAll('[data-vm]').forEach(x => x.classList.toggle('solid', x === b)); msg(); }));
  })();

  /* ══════════════════════════════════════════════════════════
     ② 半波：理想／定電壓降／真實 1N4002
     ══════════════════════════════════════════════════════════ */
  (function halfLab() {
    const cv = document.getElementById('cv-half'); if (!cv) return;
    let Vm = 4.96, model = 'real', st = null, cache = null;
    const fo = t => { const v = Vm * Math.sin(t); return model === 'ideal' ? Math.max(0, v) : model === 'cvd' ? Math.max(0, v - 0.7) : out(v, 1000, 1); };
    const table = () => { const N = 360, a = []; for (let k = 0; k <= N; k++) a.push(fo(TAU * k / N)); return a; };
    const look = t => { const u = ((t % TAU) + TAU) % TAU / TAU * 360, k = Math.floor(u); return lerp(cache[k], cache[Math.min(360, k + 1)], u - k); };
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.8 : 0.4, minH: 240, maxH: 340, draw(ctx, w, h) {
      if (!cache) cache = table();
      const s = stats(fo, 720), x0 = Math.max(40, w * 0.07), x1 = w - 14;
      const F = axes(ctx, x0, 26, x1, h - 20, -Vm * 1.12, Vm * 1.3, { t1: 2 * TAU, tl: 'ωt', vt: [] });
      plot(ctx, F, t => Vm * Math.sin(t), 2 * TAU, C['ink-3'], 1.4, [4, 4]);
      plot(ctx, F, look, 2 * TAU, C.accent, 2.8, null, C.accent);
      hline(ctx, F, s.avg, x0, x1, C.ink, '平均 ' + s.avg.toFixed(3) + ' V', 'r');
      labelCJK(ctx, F.X(TAU / 4), F.Y(Vm) - 12, '輸入峰值 ' + Vm.toFixed(2) + ' V', C['ink-2'], 11, 'center');
      labelCJK(ctx, F.X(TAU * 1.25) + 8, F.Y(s.pk) - 10, '輸出峰值 ' + s.pk.toFixed(3) + ' V', C.accent, 11.5, 'left', '700');
      labelCJK(ctx, F.X(TAU * 0.75), F.Y(-Vm * 0.5), '負半週：卡住，輸出 0', C['ink-3'], 11, 'center');
    } });
    function msg() {
      cache = null; const s = stats(fo, 720), ideal = Vm / Math.PI;
      setHTML('hf-pk', s.pk.toFixed(3) + ' V'); setHTML('hf-avg', s.avg.toFixed(3) + ' V'); setHTML('hf-on', (s.on * 360).toFixed(0) + '°');
      setHTML('hf-msg', (model === 'ideal' ? '理想二極體：峰值 = V<sub>m</sub>，平均 = V<sub>m</sub>/π = ' + ideal.toFixed(3) + ' V，剛好導通半圈 180°。'
        : (model === 'cvd' ? '扣 0.7 V：' : '真實 1N4002（R = 1 kΩ）：') + '峰值少了 ' + (Vm - s.pk).toFixed(2) + ' V，而且<b>只導通 ' + (s.on * 360).toFixed(0) + '°</b>（不到 180°），平均 ' + s.avg.toFixed(3) + ' V，比理想的 ' + ideal.toFixed(3) + ' V 少 ' + ((1 - s.avg / ideal) * 100).toFixed(0) + '%。') +
        (Math.abs(Vm - 4.96) < 0.01 && model === 'real' ? '<br>這就是你 9/30 的條件：你量到峰值 <b>4.32 V</b>、平均 <b>1.29 V</b>。' : ''));
      st.redraw();
    }
    bindRange('hf-vm', x => x.toFixed(2) + ' V', x => { Vm = x; msg(); });
    document.querySelectorAll('[data-hm]').forEach(b => b.addEventListener('click', () => { model = b.dataset.hm; document.querySelectorAll('[data-hm]').forEach(x => x.classList.toggle('solid', x === b)); msg(); }));
  })();

  /* ══════════════════════════════════════════════════════════
     ③ 全波：中間抽頭 vs 橋式；電路圖上亮起導通的二極體
     ══════════════════════════════════════════════════════════ */
  const SCH = {};
  (function schems() {
    const S = window.__SCH; if (!S) return;
    const G = (id, inner) => '<g data-p="' + id + '">' + inner + '</g>';
    /* 半波（講義 p.9 圖） */
    SCH.half = (lab, rl) => S.svg(300, 180, [S.vac(40, 40, 140, lab), S.d(40, 40, 170, 40, 'D1 1N4002'), S.w('170,40', '220,40'), S.r(220, 40, 220, 140, rl, { side: 'r' }),
      S.w('220,140', '40,140'), S.gnd(130, 140), S.term(220, 40), S.t(232, 34, 'Vo', 'start', ' font-weight="700"')]);
    /* 中間抽頭：變壓器 + D1、D2，中心抽頭接地 */
    SCH.ct = () => S.svg(330, 220, [S.vac(30, 50, 170, 'Vi'), S.w('30,50', '70,50'), S.w('30,170', '70,170'), S.l(70, 50, 70, 170),
      '<line x1="86" y1="60" x2="86" y2="160"/><line x1="92" y1="60" x2="92" y2="160"/>',
      G('t', S.l(110, 40, 110, 110)), G('b', S.l(110, 110, 110, 180)), S.w('110,110', '150,110'), S.gnd(150, 110),
      G('d1', S.d(110, 40, 220, 40, 'D1')), G('d2', S.d(110, 180, 220, 180, 'D2', { side: 'b' })), S.w('220,180', '250,180', '250,40'), S.w('220,40', '290,40'), S.dot(250, 40),
      S.r(290, 40, 290, 150, 'R', { side: 'r' }), S.gnd(290, 150), S.t(304, 34, 'Vo', 'start', ' font-weight="700"')]);
    /* 橋式：菱形四顆，負載放中間；正半週 D1、D4，負半週 D2、D3 */
    SCH.br = (lab, rl) => S.svg(330, 230, [S.vac(40, 60, 160, lab || 'Vi'), S.w('40,60', '40,110', '110,110'), S.w('40,160', '40,212', '270,212', '270,110', '230,110'),
      G('d1', S.d(110, 110, 170, 40)), G('d2', S.d(230, 110, 170, 40)), G('d3', S.d(170, 180, 110, 110)), G('d4', S.d(170, 180, 230, 110)),
      S.t(122, 66, 'D1', 'end'), S.t(218, 66, 'D2', 'start'), S.t(122, 160, 'D3', 'end'), S.t(218, 160, 'D4', 'start'),
      S.r(170, 40, 170, 180, rl || 'R', { side: 'r' }), S.dot(110, 110), S.dot(230, 110), S.dot(170, 40), S.dot(170, 180),
      S.t(170, 30, 'Vo +', 'middle', ' font-weight="700"')]);
    const put = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    put('schem-half', SCH.half('V1 10Vpp 60Hz', 'R1 1kΩ'));
    put('schem-ct', SCH.ct()); put('schem-br', SCH.br());
    put('schem-psh', SCH.half('Vsin VAMP=10V', 'R 100Ω'));
    put('schem-psb', SCH.br('VAMP=10V', 'R 100Ω'));
  })();

  (function fullLab() {
    const cv = document.getElementById('cv-full'), box = document.getElementById('full-sch'); if (!cv || !box) return;
    let type = 'br', Vm = 10, play = true, ph = 0.1, lastSide = null;
    const nd = () => type === 'br' ? 2 : 1;
    const fo = t => Math.max(0, Vm * Math.abs(Math.sin(t)) - 0.7 * nd());
    function paintSch(pos) {
      if (lastSide === type + pos) return; lastSide = type + pos;
      const onSet = type === 'br' ? (pos ? ['d1', 'd4'] : ['d2', 'd3']) : (pos ? ['d1', 't'] : ['d2', 'b']);
      box.querySelectorAll('[data-p]').forEach(g => { const on = onSet.indexOf(g.dataset.p) >= 0; g.style.color = on ? C.accent : ''; g.style.opacity = on ? '1' : '0.35'; g.style.strokeWidth = on ? '2.6' : ''; });
      setHTML('fw-on', type === 'br' ? (pos ? 'D1、D4' : 'D2、D3') : (pos ? 'D1（上半線圈）' : 'D2（下半線圈）'));
    }
    function build() { box.innerHTML = type === 'br' ? SCH.br() : SCH.ct(); lastSide = null; }
    Stage(cv, { ratio: w => w < 560 ? 0.62 : 0.32, minH: 200, maxH: 290, draw(ctx, w, h, dt) {
      if (play) ph = (ph + dt * 0.22) % 2;
      const t = ph * TAU, pos = Math.sin(t) >= 0; paintSch(pos);
      const x0 = Math.max(40, w * 0.07), x1 = w - 14;
      const F = axes(ctx, x0, 22, x1, h - 18, -Vm * 1.1, Vm * 1.25, { t1: 2 * TAU, tl: 'ωt', vt: [] });
      plot(ctx, F, s => Vm * Math.sin(s), 2 * TAU, C['ink-3'], 1.4, [4, 4]);
      plot(ctx, F, fo, 2 * TAU, C.accent, 2.8, null, C.accent);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(F.X(t), 22); ctx.lineTo(F.X(t), h - 18); ctx.stroke();
      dot(ctx, F.X(t), F.Y(fo(t)), 5.5, C.accent);
      labelCJK(ctx, x1 - 4, 34, pos ? '正半週' : '負半週 → 翻上來', C.ink, 12, 'right', '700');
    } });
    function msg() {
      const s = stats(fo, 720), ideal = 2 * Vm / Math.PI;
      setHTML('fw-pk', s.pk.toFixed(2) + ' V'); setHTML('fw-avg', s.avg.toFixed(2) + ' V'); setHTML('fw-piv', (type === 'br' ? Vm : 2 * Vm).toFixed(1) + ' V');
      setHTML('fw-msg', (type === 'br' ? '<b>橋式</b>：每半週電流要過<b>兩顆</b>二極體，峰值 V<sub>m</sub> − 1.4 V；二極體耐壓只要 V<sub>m</sub>，不用中間抽頭變壓器（最常用）。'
        : '<b>中間抽頭</b>：每半週只過一顆，峰值 V<sub>m</sub> − 0.7 V；但不導通的那顆要扛 <b>2V<sub>m</sub></b>，而且變壓器要兩倍圈數。') +
        '平均 ' + s.avg.toFixed(2) + ' V（理想 2V<sub>m</sub>/π = ' + ideal.toFixed(2) + ' V）；輸出一秒鼓起 120 次（2f）。');
    }
    build();
    bindRange('fw-vm', x => x.toFixed(1) + ' V', x => { Vm = x; msg(); });
    document.querySelectorAll('[data-fw]').forEach(b => b.addEventListener('click', () => { type = b.dataset.fw; document.querySelectorAll('[data-fw]').forEach(x => x.classList.toggle('solid', x === b)); build(); msg(); }));
    const pb = document.getElementById('fw-play'); if (pb) pb.addEventListener('click', () => { play = !play; pb.textContent = play ? '⏸ 暫停' : '▶ 播放'; });
    const sb = document.getElementById('fw-step'); if (sb) sb.addEventListener('click', () => { play = false; if (pb) pb.textContent = '▶ 播放'; ph = ((Math.floor(ph * 2) + 1) / 2 + 0.25) % 2; });
  })();

  /* ══════════════════════════════════════════════════════════
     ④ 結果：我的結報數據（可修改）＋ 模擬比較
     ══════════════════════════════════════════════════════════ */
  (function results() {
    const tb = document.querySelector('#meas tbody'); if (!tb) return;
    let store = null; const LS = 'ee-lab-rect-meas';
    const getAll = () => { if (store) return store.all(); try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; } };
    const put = (id, obj) => { if (store) { obj ? store.put(id, obj) : store.del(id); return; } try { const a = getAll(); if (obj) a[id] = obj; else delete a[id]; localStorage.setItem(LS, JSON.stringify(a)); } catch (e) {} };
    const ROWS = [
      { k: 'vpp', nm: 'V1 峰對峰值（示波器）', th: () => 10, sim: m => m.vpp },
      { k: 'v1ac', nm: 'V1 有效值（AC 檔）', th: () => 5 / SQ2, sim: m => m.vpp / 2 / SQ2 },
      { k: 'vopk', nm: 'Vo 峰值（示波器）', th: () => 5, sim: (m, s) => s.pk },
      { k: 'vd', nm: '二極體 DC 電壓', th: () => -5 / Math.PI, sim: (m, s) => -s.avg },
      { k: 'voavg', nm: 'Vo 平均 = −V<sub>D</sub>', th: () => 5 / Math.PI, sim: (m, s) => s.avg, calc: m => -m.vd },
      { k: 'voac', nm: 'Vo 交流成分（ACV 檔）', th: () => 5 * Math.sqrt(0.25 - 1 / (Math.PI * Math.PI)), sim: (m, s) => s.ac }
    ];
    ROWS.forEach(r => tb.insertAdjacentHTML('beforeend', '<tr data-k="' + r.k + '"><td style="text-align:left">' + r.nm + '</td><td class="num th">—</td><td class="num sim">—</td><td>' +
      (r.calc ? '<span class="num my">—</span>' : '<input type="number" inputmode="decimal" step="any" data-def="' + MY[r.k] + '" aria-label="' + r.k + '">') + '</td><td class="num df">—</td></tr>'));
    const read = () => { const m = {}; tb.querySelectorAll('input').forEach(el => { m[el.closest('tr').dataset.k] = parseFloat(el.value); }); return m; };
    let last = null;
    function calc() {
      const m = read(), Vm = (m.vpp > 0 ? m.vpp : 10) / 2, s = stats(t => out(Vm * Math.sin(t), 1000, 1), 720);
      last = { m, s, Vm };
      ROWS.forEach(r => { const tr = tb.querySelector('tr[data-k="' + r.k + '"]'), sim = r.sim(m, s), my = r.calc ? r.calc(m) : m[r.k];
        tr.querySelector('.th').textContent = r.th().toFixed(3); tr.querySelector('.sim').textContent = sim.toFixed(3);
        if (r.calc) tr.querySelector('.my').textContent = isNaN(my) ? '—' : my.toFixed(3);
        const d = (my - sim) / Math.abs(sim) * 100, df = tr.querySelector('.df');
        df.textContent = isNaN(d) ? '—' : (d >= 0 ? '+' : '') + d.toFixed(1) + '%'; df.className = 'num df ' + (Math.abs(d) <= 5 ? 'diff-ok' : 'diff-far'); });
      if (st) st.redraw();
    }
    function fill() {
      const it = getAll().m || {};
      tb.querySelectorAll('input').forEach(el => { if (document.activeElement === el) return; const k = el.closest('tr').dataset.k; el.value = it[k] !== undefined ? it[k] : el.dataset.def; });
      calc();
    }
    tb.addEventListener('input', () => { const o = {}; tb.querySelectorAll('input').forEach(el => { o[el.closest('tr').dataset.k] = el.value; }); put('m', o); calc(); });
    document.getElementById('meas-reset').addEventListener('click', () => { if (!confirm('改回結報的原始數據？')) return; put('m', null); fill(); });
    const cv = document.getElementById('cv-res');
    const st = cv ? Stage(cv, { animate: false, ratio: w => w < 560 ? 0.8 : 0.4, minH: 250, maxH: 350, draw(ctx, w, h) {
      if (!last) return;
      const { m, s, Vm } = last, x0 = Math.max(40, w * 0.07), x1 = w - 14;
      const F = axes(ctx, x0, 26, x1, h - 20, -Vm * 1.12, Vm * 1.3, { t1: 2 * TAU, tl: 'ωt', vt: [] });
      plot(ctx, F, t => Vm * Math.sin(t), 2 * TAU, C['ink-3'], 1.4, [4, 4]);
      plot(ctx, F, t => out(Vm * Math.sin(t), 1000, 1), 2 * TAU, C.accent, 2.6, null, C.accent);
      if (m.vopk > 0) { [TAU / 4, TAU * 1.25].forEach(t => dot(ctx, F.X(t), F.Y(m.vopk), 6, C.ink)); labelCJK(ctx, F.X(TAU * 1.25) + 10, F.Y(m.vopk) - 4, '你量的峰值 ' + m.vopk.toFixed(2) + ' V', C.ink, 11.5, 'left', '700'); }
      if (!isNaN(m.vd)) hline(ctx, F, -m.vd, x0, x1, C.ink, '你的平均 ' + (-m.vd).toFixed(2) + ' V', 'r');
      hline(ctx, F, Vm / Math.PI, x0, x1, C['ink-3'], '理想 V<sub>m</sub>/π ' + (Vm / Math.PI).toFixed(2) + ' V', 'l');
      labelCJK(ctx, x1 - 4, h - 8, '虛線：V1（' + (2 * Vm).toFixed(2) + ' Vpp）　藍：模擬 Vo', C['ink-2'], 11, 'center');
    } }) : null;
    fill();
    window.addEventListener('load', () => { if (!window.__SYNC) return; store = window.__SYNC.open('lab_rect_meas'); store.on(fill); fill(); });
  })();

  /* ══════════════════════════════════════════════════════════
     ⑤ PSpice（講義 p.10–11：VAMP = 10 V、R = 100 Ω）
     ══════════════════════════════════════════════════════════ */
  (function pspice() {
    const cv = document.getElementById('cv-ps'); if (!cv) return;
    let type = 'half', R = 100, st = null, cache = null;
    const fo = t => { const v = 10 * Math.sin(t); return type === 'half' ? out(v, R, 1) : out(Math.abs(v), R, 2); };
    st = Stage(cv, { animate: false, ratio: w => w < 560 ? 0.8 : 0.4, minH: 240, maxH: 340, draw(ctx, w, h) {
      if (!cache) { cache = []; for (let k = 0; k <= 360; k++) cache.push(fo(TAU * k / 360)); }
      const look = t => { const u = ((t % TAU) + TAU) % TAU / TAU * 360, k = Math.floor(u); return lerp(cache[k], cache[Math.min(360, k + 1)], u - k); };
      const x0 = Math.max(40, w * 0.07), x1 = w - 14, t1 = 3 * TAU;
      const F = axes(ctx, x0, 26, x1, h - 20, -11.5, 12.5, { t1, tl: '0 → 50 ms', vt: [-10, -5, 5, 10] });
      plot(ctx, F, t => 10 * Math.sin(t), t1, C['ink-3'], 1.4, [4, 4]);
      plot(ctx, F, look, t1, C.accent, 2.6, null, C.accent);
      const s = stats(fo, 720);
      labelCJK(ctx, x1 - 4, 36, (type === 'half' ? '半波' : '橋式') + '：峰值 ' + s.pk.toFixed(2) + ' V、平均 ' + s.avg.toFixed(2) + ' V', C.accent, 12, 'right', '700');
    } });
    function msg() {
      cache = null; const s = stats(fo, 720);
      setHTML('ps-msg', (type === 'half' ? '半波：50 ms 內 3 個駝峰，峰值 ' + s.pk.toFixed(2) + ' V（少一顆二極體的壓降）。'
        : '橋式：50 ms 內 6 個駝峰，峰值 ' + s.pk.toFixed(2) + ' V（少<b>兩顆</b>的壓降），但平均 ' + s.avg.toFixed(2) + ' V 幾乎是半波的兩倍。') +
        (R < 300 ? '電阻只有 ' + R + ' Ω，電流大、二極體壓降也比 0.7 V 大一點。' : ''));
      st.redraw();
    }
    bindRange('ps-r', x => x + ' Ω', x => { R = x; msg(); });
    document.querySelectorAll('[data-ps]').forEach(b => b.addEventListener('click', () => { type = b.dataset.ps; document.querySelectorAll('[data-ps]').forEach(x => x.classList.toggle('solid', x === b)); msg(); }));
  })();
})();

/* ============================================================
   可改數字例題
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE, { C, label, labelCJK, liveExample, lerp } = E;
  const TAU = Math.PI * 2, SQ2 = Math.SQRT2;
  function bars(ctx, w, h, rows, unit) {
    const x0 = Math.max(w * 0.3, 120), x1 = w * 0.86, mx = Math.max(1e-9, ...rows.map(r => Math.abs(r[1])));
    rows.forEach(([nm, v, col], k) => { const y = h * ((k + 0.6) / (rows.length + 0.2)), len = Math.max(2, (x1 - x0) * Math.abs(v) / mx);
      ctx.fillStyle = col; ctx.fillRect(x0, y - 7, len, 14); labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700'); label(ctx, x0 + len + 6, y, v.toFixed(3) + unit, col, 10.5, 'left', '700'); });
  }

  /* ── 例題 A：10 Vpp 換成 V_m、V_rms、V_avg ── */
  liveExample('#ex-val', {
    title: '例題 · 函數產生器設 V<sub>pp</sub>：算四個數字',
    ratio: 0.26, minH: 140, maxH: 190,
    givens: [{ id: 'xv-pp', label: '峰對峰值 V<sub>pp</sub>', min: 1, max: 40, step: 0.01, value: 10, fmt: v => v.toFixed(2) + ' V' }],
    compute: g => { const pp = g['xv-pp'], m = pp / 2; return { pp, m, rms: m / SQ2, h: m / Math.PI, f: 2 * m / Math.PI }; },
    question: (g, r) => '函數產生器設 <b>V<sub>pp</sub> = ' + r.pp.toFixed(2) + ' V</b> 的正弦波。求 V<sub>m</sub>、V<sub>rms</sub>（AC 檔讀值），以及經過理想半波、全波整流後的 V<sub>avg</sub>（DC 檔讀值）。最後回答講義的問題：V<sub>pp</sub> = ? V<sub>rms</sub>。',
    questionEn: (g, r) => 'A sine wave of V<sub>pp</sub> = ' + r.pp.toFixed(2) + ' V. Find V<sub>m</sub>, V<sub>rms</sub>, and V<sub>avg</sub> after ideal half-wave and full-wave rectification. Express V<sub>pp</sub> in terms of V<sub>rms</sub>.',
    steps: (g, r) => [
      { t: 'Step 1　峰值是峰對峰的一半。', eq: 'V<sub>m</sub> = V<sub>pp</sub>/2 = ' + r.pp.toFixed(2) + '/2 = ' + r.m.toFixed(3) + ' V' },
      { t: 'Step 2　有效值（正弦才成立）。', eq: 'V<sub>rms</sub> = V<sub>m</sub>/√2 = ' + r.m.toFixed(3) + '/1.414 = ' + r.rms.toFixed(3) + ' V', note: '電表 AC 檔讀的就是這個；市電 110 V 也是有效值。' },
      { t: 'Step 3　半波平均：駝峰攤平。', eq: 'V<sub>avg</sub> = V<sub>m</sub>/π = 0.318 × ' + r.m.toFixed(3) + ' = ' + r.h.toFixed(3) + ' V（= 0.45 V<sub>rms</sub>）' },
      { t: 'Step 4　全波平均：兩倍。', eq: 'V<sub>avg</sub> = 2V<sub>m</sub>/π = ' + r.f.toFixed(3) + ' V（= 0.9 V<sub>rms</sub>）' },
      { t: 'Step 5　回答講義的問題。', eq: 'V<sub>pp</sub> = 2V<sub>m</sub> = 2√2 V<sub>rms</sub> ≈ 2.83 V<sub>rms</sub>', note: r.pp === 10 ? '你 9/30 的設定：理論 V<sub>rms</sub> 3.54 V，你 AC 檔量 3.464 V（示波器其實只有 9.92 Vpp → 3.51 V）。' : '' }
    ],
    answer: (g, r) => 'V<sub>m</sub> = ' + r.m.toFixed(2) + ' V、V<sub>rms</sub> = ' + r.rms.toFixed(2) + ' V、半波 ' + r.h.toFixed(2) + ' V、全波 ' + r.f.toFixed(2) + ' V；V<sub>pp</sub> = 2√2 V<sub>rms</sub>',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['V<sub>m</sub>', r.m, C['ink-2']], ['V<sub>rms</sub>', r.rms, C.warn], ['全波 V<sub>avg</sub>', r.f, C.accent], ['半波 V<sub>avg</sub>', r.h, C.accent]], ' V')
  });

  /* ── 例題 B：半波考慮切入電壓（你的 9/30） ── */
  liveExample('#ex-half', {
    title: '例題 · 你的半波：為什麼平均只有 1.29 V？',
    ratio: 0.32, minH: 160, maxH: 220,
    givens: [
      { id: 'xh-m', label: '輸入峰值 V<sub>m</sub>', min: 1, max: 20, step: 0.01, value: 4.96, fmt: v => v.toFixed(2) + ' V' },
      { id: 'xh-g', label: '二極體壓降 V<sub>γ</sub>', min: 0, max: 0.9, step: 0.01, value: 0.64, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => { const m = g['xh-m'], vg = Math.min(g['xh-g'], m * 0.99), a = Math.asin(vg / m), avg = (2 * m * Math.cos(a) - vg * (Math.PI - 2 * a)) / TAU;
      return { m, vg, a, deg: a * 180 / Math.PI, pk: m - vg, avg, naive: (m - vg) / Math.PI, ideal: m / Math.PI, cond: 180 - 2 * a * 180 / Math.PI }; },
    question: (g, r) => '半波整流，輸入峰值 <b>V<sub>m</sub> = ' + r.m.toFixed(2) + ' V</b>，二極體導通時固定吃 <b>V<sub>γ</sub> = ' + r.vg.toFixed(2) + ' V</b>。求輸出峰值、導通角度與平均值，並跟理想的 V<sub>m</sub>/π 比。',
    questionEn: (g, r) => 'A half-wave rectifier has V<sub>m</sub> = ' + r.m.toFixed(2) + ' V and a diode drop V<sub>γ</sub> = ' + r.vg.toFixed(2) + ' V. Find the output peak, the conduction angle and the average output, and compare with V<sub>m</sub>/π.',
    steps: (g, r) => [
      { t: 'Step 1　峰值少一個 V<sub>γ</sub>。', eq: 'V<sub>o,peak</sub> = V<sub>m</sub> − V<sub>γ</sub> = ' + r.m.toFixed(2) + ' − ' + r.vg.toFixed(2) + ' = ' + r.pk.toFixed(2) + ' V' },
      { t: 'Step 2　電壓要先爬過 V<sub>γ</sub> 才導通。', eq: 'V<sub>m</sub> sin α = V<sub>γ</sub> ⟹ α = sin<sup>−1</sup>(' + r.vg.toFixed(2) + '/' + r.m.toFixed(2) + ') = ' + r.deg.toFixed(1) + '°', note: '前後各少 α，只導通 180° − 2α = ' + r.cond.toFixed(1) + '°。' },
      { t: 'Step 3　只在 α ～ π − α 積分。', eq: 'V<sub>avg</sub> = (1/2π)∫<sub>α</sub><sup>π−α</sup>(V<sub>m</sub> sin θ − V<sub>γ</sub>)dθ = [2V<sub>m</sub> cos α − V<sub>γ</sub>(π − 2α)]/2π' },
      { t: 'Step 4　代數字。', eq: 'V<sub>avg</sub> = [2 × ' + r.m.toFixed(2) + ' × ' + Math.cos(r.a).toFixed(4) + ' − ' + r.vg.toFixed(2) + ' × ' + (Math.PI - 2 * r.a).toFixed(4) + '] / 6.2832 = ' + r.avg.toFixed(3) + ' V' },
      { t: 'Step 5　跟兩種簡化比。', eq: '理想 V<sub>m</sub>/π = ' + r.ideal.toFixed(3) + ' V　｜　(V<sub>m</sub> − V<sub>γ</sub>)/π = ' + r.naive.toFixed(3) + ' V',
        note: r.vg / r.m < 0.05 ? 'V<sub>γ</sub> 只占 V<sub>m</sub> 的 ' + (r.vg / r.m * 100).toFixed(1) + '%：三個答案差不多，直接用 V<sub>m</sub>/π 就好。'
          : 'V<sub>γ</sub> 占 V<sub>m</sub> 的 ' + (r.vg / r.m * 100).toFixed(0) + '%：(V<sub>m</sub> − V<sub>γ</sub>)/π 高估了 ' + ((r.naive / r.avg - 1) * 100).toFixed(0) + '%（它假裝還是導通 180°），理想值更差。' + (Math.abs(r.m - 4.96) < 0.01 && Math.abs(r.vg - 0.64) < 0.005 ? '你的結報寫 (5 − 0.7)/π = 1.37 V 就是這個簡化；完整算是 1.27 V，跟你量的 <b>1.29 V</b> 只差 2%。' : '') }
    ],
    answer: (g, r) => '峰值 ' + r.pk.toFixed(2) + ' V、導通 ' + r.cond.toFixed(0) + '°、V<sub>avg</sub> ≈ ' + r.avg.toFixed(3) + ' V（理想 ' + r.ideal.toFixed(3) + ' V）',
    draw: (ctx, w, h, g, r) => {
      const x0 = 16, x1 = w - 16, ym = h * 0.62, A = h * 0.48, X = t => lerp(x0, x1, t / TAU), Y = v => ym - v / r.m * A;
      ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, ym); ctx.lineTo(x1, ym); ctx.stroke();
      ctx.setLineDash([4, 4]); ctx.beginPath(); for (let k = 0; k <= 200; k++) { const t = TAU * k / 200; k ? ctx.lineTo(X(t), Y(r.m * Math.sin(t))) : ctx.moveTo(X(t), Y(0)); } ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); for (let k = 0; k <= 200; k++) { const t = TAU * k / 200, v = Math.max(0, r.m * Math.sin(t) - r.vg); k ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)); }
      ctx.save(); ctx.lineTo(x1, ym); ctx.lineTo(x0, ym); ctx.closePath(); ctx.globalAlpha = 0.18; ctx.fillStyle = C.accent; ctx.fill(); ctx.restore();
      ctx.beginPath(); for (let k = 0; k <= 200; k++) { const t = TAU * k / 200, v = Math.max(0, r.m * Math.sin(t) - r.vg); k ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)); } ctx.strokeStyle = C.accent; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.strokeStyle = C.warn; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x0, Y(r.vg)); ctx.lineTo(X(Math.PI), Y(r.vg)); ctx.stroke(); ctx.setLineDash([]);
      [r.a, Math.PI - r.a].forEach(t => { ctx.strokeStyle = C.warn; ctx.beginPath(); ctx.moveTo(X(t), ym + 4); ctx.lineTo(X(t), Y(r.vg)); ctx.stroke(); });
      labelCJK(ctx, X(r.a) - 4, ym + 12, 'α', C.warn, 11, 'right', '700'); labelCJK(ctx, x0 + 4, Y(r.vg) - 8, 'V<sub>γ</sub>', C.warn, 11, 'left', '700');
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(r.avg)); ctx.lineTo(x1, Y(r.avg)); ctx.stroke(); ctx.setLineDash([]);
      labelCJK(ctx, x1 - 4, Y(r.avg) - 9, '平均 ' + r.avg.toFixed(2) + ' V', C.ink, 11, 'right', '700');
    }
  });

  /* ── 例題 C：全波（中間抽頭 vs 橋式） ── */
  liveExample('#ex-full', {
    title: '例題 · 全波整流：平均、峰值、二極體耐壓',
    ratio: 0.26, minH: 140, maxH: 190,
    givens: [
      { id: 'xf-t', label: '電路', min: 0, max: 1, step: 1, value: 1, fmt: v => v ? '橋式' : '中間抽頭' },
      { id: 'xf-m', label: 'V<sub>m</sub>（每半週加在電路上的峰值）', min: 2, max: 40, step: 0.1, value: 10, fmt: v => v.toFixed(1) + ' V' },
      { id: 'xf-g', label: '每顆壓降 V<sub>γ</sub>', min: 0, max: 0.9, step: 0.01, value: 0.7, fmt: v => v.toFixed(2) + ' V' }
    ],
    compute: g => { const br = g['xf-t'] === 1, m = g['xf-m'], n = br ? 2 : 1, vg = Math.min(n * g['xf-g'], m * 0.99), a = Math.asin(vg / m);
      return { br, m, n, vg1: g['xf-g'], vg, pk: m - vg, ideal: 2 * m / Math.PI, avg: (2 * m * Math.cos(a) - vg * (Math.PI - 2 * a)) / Math.PI, piv: br ? m : 2 * m, a }; },
    question: (g, r) => (r.br ? '橋式' : '中間抽頭式') + '全波整流，' + (r.br ? '輸入' : '每半邊線圈') + '峰值 <b>V<sub>m</sub> = ' + r.m.toFixed(1) + ' V</b>，每顆二極體導通吃 <b>' + r.vg1.toFixed(2) + ' V</b>。求輸出峰值、平均值，以及二極體要能承受的逆向電壓（PIV）。',
    questionEn: (g, r) => 'A ' + (r.br ? 'bridge' : 'center-tapped') + ' full-wave rectifier has V<sub>m</sub> = ' + r.m.toFixed(1) + ' V and ' + r.vg1.toFixed(2) + ' V per diode. Find the output peak, the average output and the diode PIV.',
    steps: (g, r) => [
      { t: 'Step 1　每半週電流過幾顆？', eq: r.br ? '橋式：兩顆（D1、D4 或 D2、D3）⟹ 扣 2V<sub>γ</sub> = ' + r.vg.toFixed(2) + ' V' : '中間抽頭：一顆（D1 或 D2）⟹ 扣 V<sub>γ</sub> = ' + r.vg.toFixed(2) + ' V' },
      { t: 'Step 2　峰值。', eq: 'V<sub>o,peak</sub> = ' + r.m.toFixed(1) + ' − ' + r.vg.toFixed(2) + ' = ' + r.pk.toFixed(2) + ' V' },
      { t: 'Step 3　平均：兩個駝峰，所以除以 π 不是 2π。', eq: 'V<sub>avg</sub> = [2V<sub>m</sub> cos α − ' + (r.br ? '2' : '') + 'V<sub>γ</sub>(π − 2α)]/π = ' + r.avg.toFixed(3) + ' V', note: '理想 2V<sub>m</sub>/π = ' + r.ideal.toFixed(3) + ' V。' },
      { t: 'Step 4　PIV（講義 p.8 表）。', eq: r.br ? 'PIV = V<sub>m</sub> = ' + r.piv.toFixed(1) + ' V' : 'PIV = 2V<sub>m</sub> = ' + r.piv.toFixed(1) + ' V',
        note: r.br ? '不導通的兩顆剛好並在輸入兩端，只扛 V<sub>m</sub>。' : '不導通的那顆一端接 −V<sub>m</sub>（自己那半邊線圈），另一端接輸出 +V<sub>m</sub>，加起來 2V<sub>m</sub>。' },
      { t: 'Step 5　怎麼選？', note: r.br ? (r.m < 5 ? 'V<sub>m</sub> 只有 ' + r.m.toFixed(1) + ' V，橋式吃掉兩顆 ' + r.vg.toFixed(1) + ' V 占了 ' + (r.vg / r.m * 100).toFixed(0) + '%，低壓時中間抽頭比較划算。' : '電壓夠高，兩顆的壓降不算什麼，橋式省掉中間抽頭變壓器、耐壓又低 → 最常用。') : '少一顆壓降，但要中間抽頭變壓器、二極體耐壓要 2V<sub>m</sub>。' }
    ],
    answer: (g, r) => '峰值 ' + r.pk.toFixed(2) + ' V、V<sub>avg</sub> ≈ ' + r.avg.toFixed(2) + ' V、PIV = ' + r.piv.toFixed(1) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['理想平均', r.ideal, C['ink-3']], ['實際平均', r.avg, C.accent], ['輸出峰值', r.pk, C['ink-2']], ['PIV', r.piv, C.warn]], ' V')
  });

  /* ── 例題 D：用二極體電壓反推 Vo 平均（你的結報 ※） ── */
  liveExample('#ex-meter', {
    title: '例題 · 你的結報 ※：只量二極體，怎麼知道 V<sub>o</sub> 平均？',
    ratio: 0.26, minH: 140, maxH: 190,
    givens: [
      { id: 'xm-d', label: '二極體 DC 讀值 V<sub>D</sub>', min: -5, max: 0, step: 0.0001, value: -1.2906, fmt: v => v.toFixed(4) + ' V' },
      { id: 'xm-o', label: 'V1 的直流偏移', min: -1, max: 1, step: 0.01, value: 0, fmt: v => v.toFixed(2) + ' V' },
      { id: 'xm-ac', label: 'V<sub>o</sub> 的 ACV 讀值', min: 0, max: 5, step: 0.0001, value: 1.5714, fmt: v => v.toFixed(4) + ' V' }
    ],
    compute: g => { const d = g['xm-d'], o = g['xm-o'], ac = g['xm-ac'], avg = o - d; return { d, o, ac, avg, tot: Math.sqrt(avg * avg + ac * ac) }; },
    question: (g, r) => '半波電路量到：二極體 DC 檔 <b>' + r.d.toFixed(4) + ' V</b>（紅棒接陽極），V1 的直流偏移 ' + r.o.toFixed(2) + ' V。V<sub>o</sub> 的平均（DC 檔該讀到的值）是多少？另外誤切 ACV 檔量 V<sub>o</sub> 讀到 ' + r.ac.toFixed(4) + ' V，這代表什麼？',
    questionEn: (g, r) => 'In a half-wave rectifier the diode reads ' + r.d.toFixed(4) + ' V DC and V1 has a DC offset of ' + r.o.toFixed(2) + ' V. Find the average of V<sub>o</sub>. What does the ACV reading of ' + r.ac.toFixed(4) + ' V on V<sub>o</sub> mean?',
    steps: (g, r) => [
      { t: 'Step 1　KVL 每一瞬間都成立。', eq: 'v<sub>1</sub>(t) = v<sub>D</sub>(t) + v<sub>o</sub>(t)' },
      { t: 'Step 2　兩邊取平均（DC 檔讀的就是平均）。', eq: '⟨v<sub>o</sub>⟩ = ⟨v<sub>1</sub>⟩ − ⟨v<sub>D</sub>⟩ = ' + r.o.toFixed(2) + ' − (' + r.d.toFixed(4) + ') = ' + r.avg.toFixed(4) + ' V', note: '正弦的平均是 0，所以 V<sub>o</sub> 平均 = −V<sub>D</sub>。' },
      { t: 'Step 3　ACV 檔只量交流成分。', eq: 'V<sub>ac</sub> = ' + r.ac.toFixed(4) + ' V（把平均 ' + r.avg.toFixed(3) + ' V 扣掉後剩下的起伏）', note: '所以 1.5714 不是 V<sub>avg</sub>，結報表 2 那格要寫 1.29 V。' },
      { t: 'Step 4　兩個加起來就是總有效值。', eq: 'V<sub>rms</sub> = √(V<sub>avg</sub><sup>2</sup> + V<sub>ac</sub><sup>2</sup>) = √(' + r.avg.toFixed(3) + '<sup>2</sup> + ' + r.ac.toFixed(3) + '<sup>2</sup>) = ' + r.tot.toFixed(3) + ' V',
        note: Math.abs(r.d + 1.2906) < 0.001 ? '理想半波 V<sub>rms</sub> = V<sub>m</sub>/2 = 2.48 V；你的 2.03 V 比較小，一樣是二極體壓降造成的。' : '' }
    ],
    answer: (g, r) => 'V<sub>o</sub> 平均 = ' + r.avg.toFixed(3) + ' V；ACV 讀值是交流成分，總有效值 ' + r.tot.toFixed(3) + ' V',
    draw: (ctx, w, h, g, r) => bars(ctx, w, h, [['平均（DC 檔）', r.avg, C.accent], ['交流成分（ACV）', r.ac, C.warn], ['總有效值', r.tot, C['ink-2']]], ' V')
  });
})();

/* ============================================================
   小測驗
   ============================================================ */
(function () {
  'use strict';
  const host = document.getElementById('quiz'); if (!host) return;
  const Q = [
    { zh: '整流器的功能是？', en: 'A rectifier converts:',
      o: [['把交流電轉成直流電', 'AC into DC'], ['把直流電轉成交流電', 'DC into AC'], ['把電壓升高', 'a low voltage into a high one'], ['把雜訊濾掉', 'noise into silence']], a: 0,
      e: '講義 p.2：將交流電（AC）轉換成直流電（DC）。' },
    { zh: '市電標示 AC 110 V，這個 110 V 是？', en: 'The "110 V" of AC mains is the:',
      o: [['有效值 V_rms', 'rms value'], ['峰值 V_m', 'peak value'], ['峰對峰值 V_pp', 'peak-to-peak value'], ['平均值 V_avg', 'average value']], a: 0,
      e: '講義 p.4：一般市電標示的 AC 110 V 或 AC 220 V 均為有效值。' },
    { zh: '正弦波 V_pp = ? V_rms', en: 'For a sine wave, V_pp = ? V_rms',
      o: [['2√2（約 2.83）', '2√2 (≈ 2.83)'], ['√2', '√2'], ['2', '2'], ['π', 'π']], a: 0,
      e: 'V<sub>pp</sub> = 2V<sub>m</sub>、V<sub>m</sub> = √2 V<sub>rms</sub> ⟹ V<sub>pp</sub> = 2√2 V<sub>rms</sub>。' },
    { zh: '理想半波整流的輸出平均值是？', en: 'The average output of an ideal half-wave rectifier is:',
      o: [['V_m/π ≈ 0.318 V_m', 'V_m/π ≈ 0.318 V_m'], ['2V_m/π', '2V_m/π'], ['V_m/√2', 'V_m/√2'], ['V_m/2', 'V_m/2']], a: 0,
      e: '講義 p.3：(1/2π)∫<sub>0</sub><sup>π</sup>V<sub>m</sub> sin ωt dωt = V<sub>m</sub>/π = 0.45 V<sub>rms</sub>。' },
    { zh: '全波整流的漣波頻率是輸入頻率的幾倍？', en: 'The ripple frequency of a full-wave rectifier is:',
      o: [['2 倍（2f）', '2f'], ['1 倍（f）', 'f'], ['一半', 'f/2'], ['4 倍', '4f']], a: 0,
      e: '講義 p.8 表：半波 f、全波 2f。60 Hz 進去，一秒鼓起 120 次。' },
    { zh: '中間抽頭式全波整流，每顆二極體要承受的逆向電壓（PIV）是？', en: 'In a center-tapped full-wave rectifier, each diode must withstand a PIV of:',
      o: [['2V_m', '2V_m'], ['V_m', 'V_m'], ['V_m/2', 'V_m/2'], ['0.7 V', '0.7 V']], a: 0,
      e: '講義 p.8 表：中間抽頭 2V<sub>m</sub>，半波和橋式都是 V<sub>m</sub>。' },
    { zh: '橋式整流在正半週時，哪兩顆二極體導通？（講義編號）', en: 'In the bridge rectifier (slide numbering), which diodes conduct in the positive half cycle?',
      o: [['D1、D4', 'D1 and D4'], ['D2、D3', 'D2 and D3'], ['D1、D2', 'D1 and D2'], ['四顆都導通', 'all four']], a: 0,
      e: '講義 p.7：正半週 D1D4 順偏導通，負半週 D2D3 導通。' },
    { zh: '你 9/30 量到 V1 = 9.92 Vpp、Vo 峰值只有 4.32 V，少掉的約 0.64 V 是？', en: 'V1 peaked at 4.96 V but Vo peaked at 4.32 V. The missing 0.64 V is:',
      o: [['二極體的順向壓降', 'the diode forward drop'], ['電阻的功率損耗', 'resistor power loss'], ['示波器的誤差', 'scope error'], ['電源的內阻', 'source resistance only']], a: 0,
      e: '二極體導通時兩端約 0.6～0.7 V，跟上一章量到的切入電壓一致。' },
    { zh: '量 Vo 時電表切到 ACV 檔，讀到 1.5714 V。這個數字代表？', en: 'Measuring Vo on the ACV range gave 1.5714 V. This is:',
      o: [['Vo 扣掉平均值後的交流成分有效值', 'the rms of the AC part of Vo'], ['Vo 的平均值', 'the average of Vo'], ['Vo 的峰值', 'the peak of Vo'], ['V1 的有效值', 'the rms of V1']], a: 0,
      e: 'ACV 檔會把直流擋掉，只量起伏。V<sub>o</sub> 平均要用 DC 檔，或由 −V<sub>D</sub> = 1.29 V 推得。' },
    { zh: 'PSpice 要看整流器的輸出波形，分析類型選？', en: 'To see the rectifier output waveform in PSpice, choose:',
      o: [['Time Domain（Transient）', 'Time Domain (Transient)'], ['DC Sweep', 'DC Sweep'], ['AC Sweep', 'AC Sweep'], ['Bias Point', 'Bias Point']], a: 0,
      e: '講義 p.12：New Simulation Profile → Time Domain，設定 Run to time。上一章 I-V 曲線才用 DC Sweep。' }
  ];
  let i = 0, score = 0, answered = false, ord = [];
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  const sub = s => s.replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>');
  function render() {
    const q = Q[i];
    host.innerHTML = '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div><div class="quiz-body"><div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div>' +
      '<div class="q-text">' + sub(q.zh) + '</div><div class="q-en">' + sub(q.en) + '</div><div class="opts"></div><div class="explain" hidden></div></div>' +
      '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span><button class="btn" id="q-next" hidden>下一題 →</button></div>';
    const opts = host.querySelector('.opts'); ord = shuffle(q.o.length);
    ord.forEach((src, k) => { const b = document.createElement('button'); b.className = 'opt'; b.type = 'button'; b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + sub(q.o[src][0]) + '<span class="en">' + sub(q.o[src][1]) + '</span></span>'; b.addEventListener('click', () => pick(k)); opts.appendChild(b); });
    host.querySelector('#q-next').addEventListener('click', () => { i++; i < Q.length ? render() : done(); });
    answered = false;
  }
  function pick(k) {
    if (answered) return; answered = true;
    const q = Q[i], A = ord.indexOf(q.a), btns = Array.prototype.slice.call(host.querySelectorAll('.opt'));
    btns.forEach((b, idx) => { b.disabled = true; if (idx === A) b.classList.add('right'); });
    if (k === A) score++; else btns[k].classList.add('wrong');
    const ex = host.querySelector('.explain'); ex.hidden = false; ex.innerHTML = '<b>' + (k === A ? '答對了。' : '正確答案是 ' + 'ABCD'[A] + '。') + '</b> ' + q.e;
    host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
    const nx = host.querySelector('#q-next'); nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →'; nx.classList.add('solid');
  }
  function done() {
    const pct = Math.round(score / Q.length * 100);
    host.innerHTML = '<div class="bar"><i style="width:100%"></i></div><div class="quiz-body" style="padding-bottom:18px"><div class="q-no">測驗結果</div><div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + pct + '%）</div>' +
      '<p style="color:var(--ink-2);margin:0 0 14px">' + (pct >= 80 ? '整流器通了，接著看濾波：把駝峰填平。' : '回去把故事模式「四個數字」「攤平」那幾個畫面再看一次。') + '</p><button class="btn solid" id="q-again" type="button">再測一次</button></div>';
    host.querySelector('#q-again').addEventListener('click', () => { i = 0; score = 0; render(); });
  }
  render();
})();

/* 側欄高亮 + 主題 */
(function () {
  'use strict';
  const links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
  if (links.length) {
    const map = new Map();
    links.forEach(a => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a); });
    const io = new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.remove('on')); map.get(en.target).classList.add('on'); } }); }, { rootMargin: '-84px 0px -62% 0px', threshold: 0 });
    map.forEach((a, s) => io.observe(s));
  }
  const btn = document.getElementById('theme-btn');
  if (btn) btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    try { localStorage.setItem('ee-theme', isDark ? 'light' : 'dark'); } catch (e) {}
  });
  try { const t = localStorage.getItem('ee-theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch (e) {}
})();
