/* 法律 · 和解書・存證信函練習：產生器、20 格稿紙、範例 */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* 半形數字、英文 → 全形（存證信函一格一字，講義範例也是全形） */
  const fw = s => String(s).replace(/[0-9A-Za-z]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xFEE0))
    .replace(/,/g, '，').replace(/;/g, '；').replace(/:/g, '：').replace(/\(/g, '（').replace(/\)/g, '）').replace(/ /g, '');
  const NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  /* ───────── 存證信函 20 格稿紙 ─────────
     text 用「|」分三段：事實經過｜限期處理｜未處理後果（上色用，不佔格） */
  function grid(text, opt) {
    opt = opt || {};
    const cells = [];
    let seg = 1;
    for (const ch of Array.from(text)) {
      if (ch === '|') { seg++; continue; }
      if (ch === '\n') { while (cells.length % 20) cells.push({ c: '', s: 0 }); continue; }
      cells.push({ c: ch, s: seg });
    }
    const pages = Math.max(1, Math.ceil(cells.length / 200));
    let html = '';
    for (let p = 0; p < pages; p++) {
      if (pages > 1) html += '<p class="lt-pg">第 ' + (p + 1) + ' 頁／共 ' + pages + ' 頁</p>';
      html += '<div class="grid20" role="img" aria-label="存證信函稿紙第 ' + (p + 1) + ' 頁"><span class="hd">行＼格</span>';
      for (let i = 1; i <= 20; i++) html += '<span class="hd">' + i + '</span>';
      for (let r = 0; r < 10; r++) {
        html += '<span class="rn">' + NUM[r] + '</span>';
        for (let k = 0; k < 20; k++) {
          const x = cells[p * 200 + r * 20 + k];
          html += x && x.c ? '<span class="s' + (opt.plain ? 0 : x.s) + '">' + esc(x.c) + '</span>' : '<span></span>';
        }
      }
      html += '</div>';
    }
    return { html, n: cells.filter(x => x.c).length, pages };
  }
  window.__LG = { grid, fw };

  /* 頁面上寫死的範例：<div class="lt" data-t="…|…|…"> */
  document.querySelectorAll('.lt[data-t]').forEach(el => { el.innerHTML = grid(el.getAttribute('data-t')).html; });

  /* ───────── 和解書範本：挖空背誦 ───────── */
  document.querySelectorAll('[data-cloze]').forEach(btn => {
    const box = document.getElementById(btn.getAttribute('data-cloze'));
    btn.addEventListener('click', () => {
      const on = box.classList.toggle('cloze');
      box.querySelectorAll('.cz').forEach(z => z.classList.remove('show'));
      btn.textContent = on ? '👀 全部顯示' : '🙈 挖空背誦';
    });
    box.addEventListener('click', e => { const z = e.target.closest('.cz'); if (z && box.classList.contains('cloze')) z.classList.toggle('show'); });
  });

  /* ───────── 和解書產生器 ───────── */
  const TYPES = {
    car: {
      name: '車禍損害賠償', a: '王小明', b: '李大華', date: '115年10月3日', time: '上午8時15分',
      place: '新北市板橋區文化路一段與民族路口',
      act: '駕駛普通重型機車（車號ABC-1234，白色），不慎撞傷騎乘腳踏車之乙方',
      harm: '乙方左手肘擦傷，腳踏車前輪及車架變形', amt: '15000', pay: 'cash', drop: true, extra: ''
    },
    name: {
      name: '妨害名譽', a: '陳志強', b: '林美玲', date: '115年9月20日', time: '晚上10時許',
      place: '網路社群平台Instagram（甲方帳號之限時動態）',
      act: '張貼文字指稱乙方為「詐騙犯」，供不特定多數人觀看',
      harm: '乙方名譽受損，已向警察局提出妨害名譽告訴', amt: '20000', pay: 'inst', n: '2', drop: true,
      extra: '甲方應於本和解書簽訂後三日內刪除上開貼文，並以同一帳號公開張貼道歉聲明，置頂七日。'
    },
    copy: {
      name: '侵害著作權', a: '張家豪', b: '黃雅婷', date: '115年8月1日', time: '起',
      place: '甲方經營之網路賣場',
      act: '未經乙方同意，重製乙方拍攝之攝影著作「淡水夕照」，印製於明信片上販售',
      harm: '乙方著作財產權受侵害', amt: '30000', pay: 'wire', payDate: '115年11月30日', drop: true,
      extra: '甲方應於本和解書簽訂後三日內下架上開商品，並將庫存明信片全數交由乙方銷毀。'
    }
  };
  const F = id => $('#dg-' + id);
  const form = $('#deed-form');
  function fill(k) {
    const t = TYPES[k];
    ['name', 'a', 'b', 'date', 'time', 'place', 'act', 'harm', 'amt', 'n', 'payDate', 'extra'].forEach(f => { if (F(f)) F(f).value = t[f] || ''; });
    F('pay').value = t.pay; F('drop').checked = !!t.drop;
    F('signDate').value = '115年10月30日';
    F('n').value = t.n || '2'; if (!t.payDate) F('payDate').value = '115年11月30日';
    deed();
  }
  const cnNum = n => {
    n = Math.round(+n); if (!(n > 0)) return '';
    return Number(n).toLocaleString('en-US');
  };
  function deed() {
    if (!form) return;
    const v = id => (F(id) ? F(id).value.trim() : '');
    const blank = (x, ph) => x ? '<span class="blank">' + esc(x) + '</span>' : '<span class="miss">〔' + ph + '〕</span>';
    const amt = cnNum(v('amt'));
    const A = blank(v('a'), '甲方姓名'), B = blank(v('b'), '乙方姓名');
    const items = [];
    items.push('甲方於民國' + blank(v('date'), '日期') + blank(v('time'), '時間') + '，在' + blank(v('place'), '詳細地點') + '，' +
      blank(v('act'), '經過（含相關物件）') + '，造成' + blank(v('harm'), '損害情況') +
      '，雙方就上開事件以新臺幣' + blank(amt, '金額') + '元達成和解。');
    const pay = v('pay'), n = Math.max(1, Math.round(+v('n') || 1));
    if (pay === 'cash') items.push('雙方簽訂本和解書時，甲方同意賠償現金新臺幣' + blank(amt, '金額') + '元與乙方，由乙方如數收執，清點無誤，不另立收據。');
    else if (pay === 'wire') items.push('甲方同意於民國' + blank(v('payDate'), '付款期限') + '前，將新臺幣' + blank(amt, '金額') + '元一次匯入乙方指定之帳戶，以匯款紀錄為憑。');
    else {
      const per = amt ? Math.ceil(+v('amt') / n) : 0;
      items.push('甲方同意將新臺幣' + blank(amt, '金額') + '元分' + n + '期給付，每期新臺幣' + blank(per ? cnNum(per) : '', '每期金額') +
        '元，自民國' + blank(v('payDate'), '第一期日期') + '起，每月同日前匯入乙方指定之帳戶；任何一期未按時給付，視為全部到期，乙方得就未付餘額一次請求。');
    }
    if (v('extra')) items.push(esc(v('extra')));
    items.push('嗣後無論任何情形，乙方或任何其他人不得再向甲方要求其他賠償，並不得再有異議及告訴等情事' +
      (F('drop').checked ? '；乙方已提出之告訴，應於本和解書簽訂後' + (pay === 'cash' ? '' : '甲方付清全部金額後') + '無條件撤回。' : '。'));
    items.push('本和解書一式兩份，甲、乙雙方各執一份為憑。');
    const sd = v('signDate');
    const html = '<h4>和解書</h4>' +
      '<p>立和解書人：' + A + '（以下簡稱甲方）<br><span style="padding-left:6em"></span>' + B + '（以下簡稱乙方）</p>' +
      '<p>雙方茲因' + blank(v('name'), '事件名稱') + '事件，達成和解，條件如下：</p>' +
      items.map((t, i) => '<p class="it">' + NUM[i] + '、' + t + '</p>').join('') +
      '<p style="margin-top:14px">立和解書人：</p><div class="sig">' +
      '<div>甲方：' + A + '（簽名）<br>身分證字號：<br>住址：<br>聯絡電話：</div>' +
      '<div>乙方：' + B + '（簽名）<br>身分證字號：<br>住址：<br>聯絡電話：</div></div>' +
      '<p class="dt">中華民國' + blank(sd ? sd.replace(/^民國/, '') : '', '簽署日期') + '</p>';
    $('#deed-out').innerHTML = html;
    /* 人事時地物 檢查 */
    const chk = [
      ['人：甲方、乙方姓名都寫了（簽名欄還要身分證字號、住址、電話）', v('a') && v('b')],
      ['事：事件名稱＋經過寫清楚', v('name') && v('act').length >= 6],
      ['時：糾紛發生的日期＋時間', v('date') && v('time')],
      ['地：詳細地點', v('place').length >= 4],
      ['物：相關物件（車禍要車型、車號、顏色；著作要寫作品名）', /車號|「|」|帳號|商品|作品|物/.test(v('act') + v('place') + v('harm'))],
      ['損害情況（受傷、毀損）', v('harm')],
      ['賠償金額明確（新臺幣○元）', amt],
      ['收執／付款方式寫清楚', pay === 'cash' || v('payDate')],
      ['乙方不得再要求賠償、不得再提告訴', true],
      ['已經提告 → 寫「無條件撤回告訴」', F('drop').checked],
      ['一式兩份、各執一份', true],
      ['簽署和解書的日期', sd]
    ];
    $('#deed-chk').innerHTML = chk.map(c => '<li class="' + (c[1] ? 'ok' : 'no') + '">' + c[0] + '</li>').join('');
  }
  if (form) {
    form.addEventListener('input', deed);
    form.addEventListener('change', deed);
    document.querySelectorAll('[data-deed]').forEach(b => b.addEventListener('click', () => fill(b.getAttribute('data-deed'))));
    fill('car');
  }

  /* ───────── 存證信函產生器 ───────── */
  const LT = {
    debt: {
      fact: '台端於民國115年3月1日向本人借款新臺幣30000元，並有LINE對話紀錄為憑，約定於115年6月30日前清償，惟迄今仍未還款。',
      days: '十', req: '清償上開借款', cons: '本人將依法提起民事訴訟，並請求自催告期滿之日起依民法第203條計算之法定利息'
    },
    photo: {
      fact: '本人係攝影著作「淡水夕照」之著作人，享有著作財產權。台端於115年9月起，未經本人同意，將上開照片張貼於台端經營之粉絲專頁作為廣告使用，已涉嫌違反著作權法第92條。',
      days: '七', req: '刪除上開照片並回函說明', cons: '本人將依法提出刑、民事訴訟，以保權益'
    },
    rent: {
      fact: '本人於民國114年9月1日承租台端所有之○○市○○路○號○樓房屋，已於115年8月31日租期屆滿並點交返還，惟台端迄今仍未返還押租金新臺幣20000元。',
      days: '七', req: '返還上開押租金', cons: '本人將依法律途徑處理'
    }
  };
  const lf = $('#lt-form');
  const L = id => $('#lg-' + id);
  function lfill(k) {
    const t = LT[k];
    L('fact').value = t.fact; L('days').value = t.days; L('req').value = t.req; L('cons').value = t.cons;
    letter();
  }
  function letter() {
    if (!lf) return;
    const fact = L('fact').value.trim(), req = L('req').value.trim(), cons = L('cons').value.trim(), days = L('days').value;
    const txt = '敬啟者：' + fw(fact).replace(/^敬啟者：/, '') + '|限台端於函到' + days + '日內' + fw(req) +
      '，|若逾期仍未處理，' + fw(cons) + '，希勿自誤為禱！';
    const g = grid(txt);
    $('#lt-out').innerHTML = g.html;
    $('#lt-cnt').innerHTML = '共 <b>' + g.n + '</b> 字（含標點）→ <b>' + g.pages + '</b> 頁（每頁 200 格）' +
      (g.pages > 1 ? '，超過一頁要在每頁「本存證信函共○頁」寫清楚' : '');
    const chk = [
      ['① 事實經過：時間（民國○年○月○日）', /年|月|日/.test(fact)],
      ['① 事實經過：金額或標的（新臺幣○元、作品名、車號）', /元|「|車號|號/.test(fact)],
      ['① 事實經過：有什麼證據（借據、照片、對話紀錄、契約）', /據|照|紀錄|契約|存證|為憑|為證|點交/.test(fact)],
      ['① 依據的法條（有寫更有說服力）', /法第|條/.test(fact + cons)],
      ['② 限期處理：幾日內、做什麼', req.length > 1],
      ['③ 未處理後果：依法提告／法律途徑', /法|訴/.test(cons)]
    ];
    $('#lt-chk').innerHTML = chk.map(c => '<li class="' + (c[1] ? 'ok' : 'no') + '">' + c[0] + '</li>').join('');
  }
  if (lf) {
    lf.addEventListener('input', letter);
    lf.addEventListener('change', letter);
    document.querySelectorAll('[data-lt]').forEach(b => b.addEventListener('click', () => lfill(b.getAttribute('data-lt'))));
    lfill('debt');
  }

  /* 自由練習：自己打全文，看排進稿紙長怎樣 */
  const free = $('#lt-free');
  if (free) {
    const go = () => { const g = grid(fw(free.value), { plain: true }); $('#lt-free-out').innerHTML = g.html; $('#lt-free-cnt').textContent = '共 ' + g.n + ' 字 → ' + g.pages + ' 頁'; };
    free.addEventListener('input', go); go();
  }

  /* 列印前打開參考答案 */
  window.addEventListener('beforeprint', () => document.querySelectorAll('.exq details').forEach(d => { d.dataset.wasOpen = d.open ? '1' : ''; d.open = true; }));
  window.addEventListener('afterprint', () => document.querySelectorAll('.exq details').forEach(d => { d.open = d.dataset.wasOpen === '1'; }));

  /* 主題切換＋側欄高亮 */
  const btn = $('#theme-btn');
  if (btn) btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const isDark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    try { localStorage.setItem('ee-theme', isDark ? 'light' : 'dark'); } catch (e) {}
  });
  try { const t = localStorage.getItem('ee-theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch (e) {}
  const links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
  const map = new Map();
  links.forEach(a => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a); });
  const io = new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.classList.remove('on')); map.get(en.target).classList.add('on'); } }); }, { rootMargin: '-84px 0px -62% 0px', threshold: 0 });
  map.forEach((a, s) => io.observe(s));
})();
