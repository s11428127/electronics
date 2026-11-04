/* ============================================================
   電子學 CH2 PART 2、3 共用：小測驗引擎 + 側欄捲動高亮 + 明暗主題 + 畫圖小工具
   window.__c2 = { quiz(Q, okMsg, badMsg), tools }
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, label, labelCJK, lerp, TAU } = E;
  const tools = {
    setHTML: (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; },
    dot: (ctx, x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fillStyle = col; ctx.fill(); },
    wide: w => w >= 560,
    dash: (ctx, x1, y1, x2, y2, col) => { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); },
    trace: (ctx, x0, x1, ym, A, f, col, lw, ds) => {
      ctx.save(); ctx.setLineDash(ds || []); ctx.strokeStyle = col; ctx.lineWidth = lw || 2; ctx.beginPath();
      for (let k = 0; k <= 240; k++) { const u = k / 240, y = ym - A * f(u); k ? ctx.lineTo(lerp(x0, x1, u), y) : ctx.moveTo(lerp(x0, x1, u), y); }
      ctx.stroke(); ctx.restore();
    },
    bars: (ctx, w, h, rows, fmt) => {
      const x0 = Math.max(w * 0.3, 120), x1 = w * 0.78, mx = Math.max(1e-9, ...rows.map(r => Math.abs(r[1])));
      rows.forEach(([nm, v, col], k) => {
        const y = h * ((k + 0.6) / (rows.length + 0.2)), len = Math.max(2, (x1 - x0) * Math.abs(v) / mx);
        ctx.fillStyle = col; ctx.fillRect(x0, y - 8, len, 16);
        labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '700');
        labelCJK(ctx, Math.min(x0 + len + 6, w - 70), y, fmt(v), col, 11, 'left', '700');
      });
    }
  };

  function quiz(Q, okMsg, badMsg) {
    const host = document.getElementById('quiz'); if (!host) return;
    let i = 0, score = 0, answered = false, ord = [];
    const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
    function render() {
      const q = Q[i];
      host.innerHTML = '<div class="bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div><div class="quiz-body"><div class="q-no">第 ' + (i + 1) + ' 題 / 共 ' + Q.length + ' 題</div><div class="q-text">' + q.zh + '</div><div class="q-en">' + q.en + '</div><div class="opts"></div><div class="explain" hidden></div></div>' +
        '<div class="quiz-foot"><span class="score">答對 ' + score + ' / ' + i + '</span><span class="spacer"></span><button class="btn" id="q-next" hidden>下一題 →</button></div>';
      const opts = host.querySelector('.opts');
      ord = shuffle(q.o.length);
      ord.forEach((src, k) => { const pair = q.o[src], b = document.createElement('button'); b.className = 'opt'; b.type = 'button'; b.innerHTML = '<i>' + 'ABCD'[k] + '</i><span>' + pair[0] + '<span class="en">' + pair[1] + '</span></span>'; b.addEventListener('click', () => pick(k)); opts.appendChild(b); });
      host.querySelector('#q-next').addEventListener('click', () => { i++; answered = false; i < Q.length ? render() : done(); });
      answered = false;
    }
    function pick(k) {
      if (answered) return; answered = true;
      const q = Q[i], A = ord.indexOf(q.a), btns = Array.prototype.slice.call(host.querySelectorAll('.opt'));
      btns.forEach((b, idx) => { b.disabled = true; if (idx === A) b.classList.add('right'); });
      if (k === A) score++; else btns[k].classList.add('wrong');
      const ex = host.querySelector('.explain'); ex.hidden = false;
      ex.innerHTML = '<b>' + (k === A ? '答對了。' : '正確答案是 ' + 'ABCD'[A] + '。') + '</b> ' + q.e;
      host.querySelector('.score').textContent = '答對 ' + score + ' / ' + (i + 1);
      const nx = host.querySelector('#q-next'); nx.hidden = false; nx.textContent = i === Q.length - 1 ? '看結果 →' : '下一題 →'; nx.classList.add('solid');
    }
    function done() {
      const pct = Math.round(score / Q.length * 100);
      host.innerHTML = '<div class="bar"><i style="width:100%"></i></div><div class="quiz-body" style="padding-bottom:18px"><div class="q-no">測驗結果</div><div class="q-text">答對 ' + score + ' / ' + Q.length + ' 題（' + pct + '%）</div>' +
        '<p style="color:var(--ink-2);margin:0 0 14px">' + (pct >= 90 ? okMsg : badMsg) + '</p><button class="btn solid" id="q-again" type="button">再測一次</button></div>';
      host.querySelector('#q-again').addEventListener('click', () => { i = 0; score = 0; render(); });
    }
    render();
  }

  /* 側欄捲動高亮 + 明暗主題 */
  (function () {
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

  window.__c2 = { quiz, tools };
})();
