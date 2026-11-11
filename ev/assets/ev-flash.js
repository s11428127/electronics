/* 電動車期中考：翻卡自測（主動回想）。資料 window.__EVFL 由 review.html 內嵌。 */
(function () {
  var host = document.getElementById('fl'), D = window.__EVFL;
  if (!host || !D) return;
  var q, i, open, done;
  function start() { q = D.map(function (_, k) { return k; }); done = 0; open = false; draw(); }
  function draw() {
    if (!q.length) {
      host.innerHTML = '<div class="fl-card"><div class="fl-q">🎉 13 張全部記得！</div><div class="fl-sp">隔幾個小時再考一次，記得最牢。</div></div><div class="fl-bar"><button class="btn" type="button" data-a="re">🔄 從頭再考</button></div>';
      return;
    }
    var c = D[q[0]];
    var h = '<div class="fl-card" data-a="flip"><div class="fl-sp">' + c.sp + '</div><div class="fl-q">' + c.q + '</div>';
    if (open) h += '<div class="fl-back"><div class="fl-k">' + c.k + '</div>' + c.pic + '<div class="fl-m">' + c.m.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div></div>';
    else h += '<div class="fl-sp">（先在心裡講答案，點卡片翻面）</div>';
    h += '</div><div class="fl-bar">' + (open
      ? '<button class="btn" type="button" data-a="ok">✓ 記得</button><button class="btn" type="button" data-a="no">✗ 再考一次</button><a class="btn" href="#' + c.sid + '">看這節</a>'
      : '<button class="btn" type="button" data-a="flip">翻面</button>') + '</div><div class="fl-n">剩 ' + q.length + ' 張 · 記住 ' + done + ' 張</div>';
    host.innerHTML = h;
  }
  host.addEventListener('click', function (e) {
    var t = e.target.closest('[data-a]'); if (!t) return;
    var a = t.getAttribute('data-a');
    if (a === 'flip') { open = !open; }
    else if (a === 'ok') { q.shift(); done++; open = false; }
    else if (a === 'no') { var x = q.shift(); q.splice(Math.min(2, q.length), 0, x); open = false; }
    else if (a === 're') { start(); return; }
    draw();
  });
  start();
})();
