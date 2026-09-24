/* ============================================================
   手寫筆記 —— 繪圖（編輯器與書櫃縮圖共用）
   紙張與墨水是「筆記內容」，不跟網站明暗主題變 —— 否則切換主題後，
   白色的字會跑到白色的紙上。網站介面的顏色仍一律吃 app.css 的 token。
   ============================================================ */
(function () {
  'use strict';
  const PW = 1000, PH = 1414, TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pw = pr => 0.45 + 0.85 * clamp(pr, 0, 1);       /* 壓力 → 粗細倍率（滑鼠固定 0.5 → 0.875 倍） */

  /* 紙張與墨水是「筆記內容」，不跟網站明暗主題變（否則換主題筆記就看不到了） */
  const PAPER = {
    dark:  { bg: '#2c2d31', line: 'rgba(255,255,255,0.075)', margin: 'rgba(255,120,120,0.30)', dot: 'rgba(255,255,255,0.22)', sel: '#56d4f5' },
    light: { bg: '#fdfcf8', line: 'rgba(40,70,130,0.13)', margin: 'rgba(220,70,70,0.35)', dot: 'rgba(40,70,130,0.30)', sel: '#1f6fd6' }
  };
  const INKS = {
    dark:  ['#f2f2f2', '#56d4f5', '#ff6b6b', '#ffd43b', '#69db7c', '#91a7ff'],
    light: ['#1d1f24', '#1f6fd6', '#d9342b', '#e67700', '#2b8a3e', '#7048e8']
  };
  const HLS = {
    dark:  ['#ffe066', '#63e6be', '#f783ac', '#74c0fc'],
    light: ['#ffe066', '#96f2d7', '#fcc2d7', '#a5d8ff']
  };
  /* ---------------- 紙張 ---------------- */
  function drawPaper(ctx, tpl, paper) {
    const P = PAPER[paper];
    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, PW, PH);
    if (tpl === 'grid') {
      ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.beginPath();
      for (let x = 25; x < PW; x += 25) { ctx.moveTo(x, 0); ctx.lineTo(x, PH); }
      for (let y = 25; y < PH; y += 25) { ctx.moveTo(0, y); ctx.lineTo(PW, y); }
      ctx.stroke();
    } else if (tpl === 'lines') {
      ctx.strokeStyle = P.line; ctx.lineWidth = 1.2; ctx.beginPath();
      for (let y = 110; y < PH - 20; y += 34) { ctx.moveTo(0, y); ctx.lineTo(PW, y); }
      ctx.stroke();
      ctx.strokeStyle = P.margin; ctx.beginPath(); ctx.moveTo(92, 0); ctx.lineTo(92, PH); ctx.stroke();
    } else if (tpl === 'dots') {
      ctx.fillStyle = P.dot;
      for (let y = 25; y < PH; y += 25) for (let x = 25; x < PW; x += 25) { ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4); }
    }
  }

  /* ---------------- 畫筆跡 ---------------- */
  function drawPiece(ctx, p, n, i, width, dx, dy) {
    const X = j => p[j * 3] + dx, Y = j => p[j * 3 + 1] + dy;
    ctx.beginPath();
    if (i === 0) {
      ctx.moveTo(X(0), Y(0)); ctx.lineTo((X(0) + X(1)) / 2, (Y(0) + Y(1)) / 2);
      ctx.lineWidth = width * pw(p[2]);
    } else if (i === n - 1) {
      ctx.moveTo((X(n - 2) + X(n - 1)) / 2, (Y(n - 2) + Y(n - 1)) / 2); ctx.lineTo(X(n - 1), Y(n - 1));
      ctx.lineWidth = width * pw(p[(n - 1) * 3 + 2]);
    } else {
      ctx.moveTo((X(i - 1) + X(i)) / 2, (Y(i - 1) + Y(i)) / 2);
      ctx.quadraticCurveTo(X(i), Y(i), (X(i) + X(i + 1)) / 2, (Y(i) + Y(i + 1)) / 2);
      ctx.lineWidth = width * pw(p[i * 3 + 2]);
    }
    ctx.stroke();
  }
  function drawStroke(ctx, s, dx, dy, colorOverride) {
    const p = s.pts, n = p.length / 3;
    if (!n) return;
    dx = dx || 0; dy = dy || 0;
    const col = colorOverride || s.color;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (s.tool === 'hl') {
      /* 螢光筆：半透明，整條一次 stroke()，接縫才不會疊出深色的點 */
      ctx.save(); ctx.globalAlpha = 0.36; ctx.strokeStyle = col; ctx.lineWidth = s.width;
      ctx.beginPath(); ctx.moveTo(p[0] + dx, p[1] + dy);
      if (n === 1) ctx.lineTo(p[0] + dx + 0.01, p[1] + dy);
      for (let i = 1; i < n - 1; i++) {
        ctx.quadraticCurveTo(p[i * 3] + dx, p[i * 3 + 1] + dy, (p[i * 3] + p[i * 3 + 3]) / 2 + dx, (p[i * 3 + 1] + p[i * 3 + 4]) / 2 + dy);
      }
      if (n > 1) ctx.lineTo(p[(n - 1) * 3] + dx, p[(n - 1) * 3 + 1] + dy);
      ctx.stroke(); ctx.restore();
      return;
    }
    ctx.strokeStyle = col; ctx.fillStyle = col;
    if (n === 1) {
      ctx.beginPath(); ctx.arc(p[0] + dx, p[1] + dy, Math.max(0.3, s.width * pw(p[2]) / 2), 0, TAU); ctx.fill();
      return;
    }
    for (let i = 0; i < n; i++) drawPiece(ctx, p, n, i, s.width, dx, dy);
  }

  window.__NotesDraw = { PW, PH, PAPER, INKS, HLS, drawPaper, drawPiece, drawStroke };
})();
