/* ============================================================
   作業題／仿作業題作答元件
   用法：<div class="hw-list" data-bank="__HW1" data-hw="1,2,4" data-sims="1"></div>
         題庫放在 window.__HW1 = { items: [...] }（例：electronics/assets/hw1-bank.js）
   每一題：{ id, hw, kind:'hw'|'sim'|'cf'（觀念填充，用 data-sec 掛）, sec, no, how, en（英文題幹）, title, q:'含 {0} {1} 空格的題幹', b:[空格…], ex:'解釋', fig, link }
   空格：{ o:['選項',…], a: 正解 index }（下拉選單）或 { f:'參考答案' }（自己寫，按「對答案」才顯示）
   作業原題的選項照作業原本的順序；仿作業的選項每次打亂（正解在題庫裡都寫第一個也沒關係）。
   ============================================================ */
(function () {
  'use strict';
  const shuffle = n => { const o = Array.from({ length: n }, (_, k) => k); for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return o; };
  const strip = s => String(s).replace(/<[^>]+>/g, '');


  /* 答題回饋（使用者 11/4）：答對閃綠＋打勾＋一句話；答錯輕晃＋正解螢光；錯過再答對＝訂正成功 */
  const YES = ['對！', '穩', '這題你會了', '答對了', '漂亮', '沒問題'];
  function feedback(el, ok, tot) {
    if (!tot) return;
    let fb = el.querySelector('.hw-fb');
    if (!fb) { fb = document.createElement('span'); fb.className = 'hw-fb'; fb.setAttribute('role', 'status'); el.querySelector('.hw-act').appendChild(fb); }
    const all = ok === tot, fixed = all && (el.dataset.missed === '1' || el.classList.contains('trk-wrong'));
    if (!all) el.dataset.missed = '1';
    el.classList.remove('fb-ok', 'fb-bad', 'fb-fix'); fb.classList.remove('pop');
    void el.offsetWidth;
    if (all) {
      el.classList.add(fixed ? 'fb-fix' : 'fb-ok');
      fb.innerHTML = fixed ? '✓ 訂正成功' : '✓ ' + YES[Math.floor(Math.random() * YES.length)];
      fb.className = 'hw-fb ' + (fixed ? 'fix' : 'ok');
    } else {
      el.classList.add('fb-bad');
      fb.innerHTML = '再看一次 ↓';
      fb.className = 'hw-fb bad';
      const a = el.querySelector('.hw-ans');
      if (a && !a.hidden && a.getBoundingClientRect().bottom > innerHeight) a.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    void fb.offsetWidth; fb.classList.add('pop');
  }

  /* 11/6 使用者：段考選擇、填充題用中文（老師說只有計算題英文）→ 英文先的填充題（有 zh）改成中文先：
     題幹用 zh（___ 換成空格），選項只留中文那一半，英文原文收進「English」。___ 數量對不上就照舊英文先。 */
  const CJK = /[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/;
  const STOP = /^(is|in|it|if|ice|the|and|for|or|on|of|to|a|an)$/i;
  const EN2ZH = { 'amplifier': '放大器', 'capacitor': '電容', 'constant-current source': '定電流源', 'constant-voltage source': '定電壓源',
    'decrease': '減少', 'decreases': '減少', 'equal': '相等', 'exponential': '指數', 'exponentially': '指數地', 'high': '高', 'in breakdown': '崩潰',
    'increase': '增加', 'increases': '增加', 'infinite': '無限大', 'inversely': '成反比', 'kelvin': '克氏溫度（K）', 'larger': '大', 'linearly': '線性地',
    'low': '低', 'negative': '負的', 'not at all': '完全不會', 'off': 'OFF（截止）', 'quadratically': '平方關係', 'rectifier': '整流器', 'resistor': '電阻',
    'reverse': '逆向', 'saturated': '飽和', 'short circuit': '短路', 'shorted': '短路', 'slowly': '緩慢地', 'smaller': '小', 'stay the same': '不變',
    'stays constant': '不變', 'the band gap': '能隙', 'unknown': '未知', 'volts': '伏特', 'zero': '零', '0 A exactly': '剛好 0 A',
    '1.12 − 0.598, the 300 K reading': '1.12 − 0.598（300 K 的讀數）' };
  const zhOpt = s => {
    if (!CJK.test(s)) {
      const k = String(s).trim();
      if (EN2ZH[k]) return EN2ZH[k];
      return k.replace(/(\d)( ?[mμ]?V)? to (\d)/g, '$1$2～$3').replace(/^(\w+) and (\w+)$/, '$1 和 $2');
    }
    const t = String(s).split(' '); let i = t.findIndex(x => CJK.test(x));
    if (i <= 0) return s;
    /* 中文那半前面的符號（r_d、N、1/r_d、V_T）要一起留：往前最多收一個 */
    const prev = t[i - 1];
    if ((/^[0-9./]*[A-Z][A-Za-z0-9]{0,3}$/.test(prev) || /^[0-9./]*(r|v|i)[A-Za-z]{1,2}$/.test(prev)) && !STOP.test(prev)) i--;
    return t.slice(i).join(' ');
  };
  function zhFirst(it) {
    if (it.kind !== 'cf' || !it.zh) return it;
    const parts = String(it.zh).split(/_{3,}|＿{2,}/);
    let q;
    if (parts.length - 1 === it.b.length) q = parts.map((p, i) => p + (i < it.b.length ? '{' + i + '}' : '')).join('');
    else if (parts.length === 1 && it.b.length === 1) q = it.zh + ' {0}';   /* 中文是問句（HW3 選擇題）：選單接在後面 */
    else return it;
    const en = String(it.q).replace(/\{\d+\}/g, '___');
    q = q.replace(/([A-Za-z])_([A-Za-z0-9]{1,3})/g, '$1<sub>$2</sub>');
    /* 標題是英文的就不顯示（題幹已經是中文）；「來源 · 英文標題」只留來源 */
    let title = it.title || '';
    if (!CJK.test(title)) title = '';
    else { const seg = title.split(' · '); if (seg.length > 1 && !CJK.test(seg[seg.length - 1])) title = seg.slice(0, -1).join(' · '); }
    return Object.assign({}, it, { q, title, zh: null, en: null, enFold: en, b: it.b.map(b => b.o ? Object.assign({}, b, { o: b.o.map(zhOpt) }) : b) });
  }

  function card(it, bankName) {
    it = zhFirst(it);
    const el = document.createElement('div');
    el.className = 'hw-card ' + (it.kind === 'hw' ? 'is-hw' : 'is-sim');
    el.id = 'hw-' + it.id;
    /* 學習紀錄：同一份作業的紀錄不管在哪一頁做，都存在「<科目>/hw1」那一份 */
    const seg = location.pathname.split('/').filter(Boolean);
    el.dataset.trkDoc = (seg.length > 1 ? seg[seg.length - 2] : 'root') + '/' + String(bankName).toLowerCase();
    const badge = it.kind === 'hw'
      ? '<span class="hw-badge hw">📝 ' + bankName + ' 第 ' + it.hw + ' 題 · 作業原題</span>'
      : it.kind === 'cf'
      ? '<span class="hw-badge sim">觀念填充 ' + it.no + (it.calc ? ' · 計算' : it.how ? ' · 解法' : ' · 觀念') + (it.zh ? ' · EN' : '') + '</span>'
      : '<span class="hw-badge sim">仿作業 ' + it.hw + '-' + it.n + ' · 自編練習</span>';
    let html = it.q, blanks = [];
    it.b.forEach((b, i) => {
      let w;
      if (b.o) {
        const ord = it.kind !== 'hw' ? shuffle(b.o.length) : b.o.map((_, k) => k);
        w = '<select class="hw-sel" data-i="' + i + '" aria-label="第 ' + (i + 1) + ' 格"><option value="">（選）</option>' +
          ord.map(k => '<option value="' + k + '">' + strip(b.o[k]) + '</option>').join('') + '</select>';
      } else {
        w = '<span class="hw-free" data-i="' + i + '">（' + (i + 1) + '）＿＿＿</span>';
      }
      blanks.push(b);
      html = html.replace('{' + i + '}', w);
    });
    el.innerHTML = '<div class="hw-head">' + badge + (it.title ? '<b>' + it.title + '</b>' : '') + '</div>' +
      '<div class="hw-q">' + html + '</div>' + (it.zh ? '<details class="hw-zh dv-ui"><summary>中文翻譯</summary><div>' + it.zh + '</div></details>' : it.en ? '<div class="q-en hw-en">' + it.en + '</div>' : it.enFold ? '<details class="hw-zh dv-ui"><summary>English</summary><div>' + it.enFold + '</div></details>' : '') + (it.fig ? '<div class="hw-fig">' + it.fig + '</div>' : '') +
      '<div class="hw-act"><button class="btn solid hw-check" type="button">對答案</button><button class="btn hw-reset" type="button">重做</button>' +
      (it.link ? '<a class="hw-link" href="' + it.link + '">回到講解 →</a>' : '') + '<span class="hw-score"></span></div>' +
      '<div class="hw-ans" hidden></div>';
    const ans = el.querySelector('.hw-ans'), score = el.querySelector('.hw-score');
    el.querySelector('.hw-check').addEventListener('click', () => {
      let ok = 0, tot = 0;
      el.querySelectorAll('.hw-sel').forEach(s => {
        const b = blanks[+s.dataset.i]; tot++;
        s.classList.remove('ok', 'bad');
        const right = s.value !== '' && +s.value === b.a;
        s.classList.add(right ? 'ok' : 'bad'); if (right) ok++;
        let tip = s.nextElementSibling;
        if (!tip || !tip.classList.contains('hw-right')) { tip = document.createElement('span'); tip.className = 'hw-right'; s.after(tip); }
        tip.innerHTML = right ? '' : '→ ' + b.o[b.a];
      });
      el.querySelectorAll('.hw-free').forEach(f => { f.classList.add('shown'); f.innerHTML = '（' + (+f.dataset.i + 1) + '）' + blanks[+f.dataset.i].f; });
      score.textContent = tot ? '選擇題對 ' + ok + ' / ' + tot + ' 格' : '';
      ans.hidden = !it.ex; if (it.ex) ans.innerHTML = '<b>解釋：</b>' + it.ex;
      feedback(el, ok, tot);
      if (window.__EE && window.__EE.wireTerms) window.__EE.wireTerms();
    });
    el.querySelector('.hw-reset').addEventListener('click', () => {
      const fresh = card(it, bankName); el.replaceWith(fresh);
    });
    return el;
  }

  function mount(host) {
    const bank = window[host.dataset.bank || '__HW1'];
    if (!bank) return;
    /* 觀念填充：data-sec="11.2" → 這一節的全部題目，直接列出 */
    if (host.dataset.sec) {
      const want = host.dataset.sec.split(',').map(x => x.trim());
      bank.items.filter(it => want.indexOf(it.sec) >= 0).forEach(it => host.appendChild(card(it, bank.name)));
      if (!host.previousElementSibling || !host.previousElementSibling.classList.contains('hw-tools')) host.before(tools());
      return;
    }
    const nums = (host.dataset.hw || '').split(',').map(s => +s.trim()).filter(Boolean);
    const withSims = host.dataset.sims !== '0';
    nums.forEach(n => {
      const orig = bank.items.filter(it => it.hw === n && it.kind === 'hw');
      const sims = bank.items.filter(it => it.hw === n && it.kind === 'sim');
      const grp = document.createElement('div');
      grp.className = 'hw-group'; grp.id = (bank.idp || 'hw-q') + n;   /* HW2 起用 bank.idp（'hw2-q'），避免跟 HW1 的錨點撞名 */
      orig.forEach(it => grp.appendChild(card(it, bank.name)));
      if (withSims && sims.length) {
        const d = document.createElement('details');
        d.className = 'hw-more';
        d.innerHTML = '<summary>再練 ' + sims.length + ' 題（仿作業第 ' + n + ' 題，自編）</summary>';
        sims.forEach(it => d.appendChild(card(it, bank.name)));
        grp.appendChild(d);
      }
      host.appendChild(grp);
    });
  }

  /* 工具列：全部重做（選項重新洗牌）／只重做錯過的／打亂題目順序；紀錄（錯幾次）都不會被清掉 */
  function tools(page) {
    const t = document.createElement('div');
    t.className = 'hw-tools'; if (page) t.dataset.hwScope = 'page';
    t.innerHTML = '<span class="hw-sum"></span><span class="spacer"></span>' +
      '<button class="btn" type="button" data-hw-act="all" title="全部卡片清空重來，選項順序重新洗牌；你的作答紀錄與錯題次數不會被清掉">🔄 全部重做</button>' +
      '<button class="btn" type="button" data-hw-act="bad" title="只重做曾經答錯的題目">↺ 只重做錯過的</button>' +
      '<button class="btn" type="button" data-hw-act="shuf" title="把題目順序打亂">🔀 打亂順序</button><span class="hw-tip" role="status"></span>';
    return t;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-hw-act]'); if (!b) return;
    const bar = b.closest('.hw-tools'); if (!bar) return;
    const page = bar.dataset.hwScope === 'page';
    const hosts = page ? Array.prototype.slice.call(document.querySelectorAll('.hw-list[data-sec]')) : [bar.nextElementSibling];
    const tip = bar.querySelector('.hw-tip'), say = s => { if (tip) { tip.textContent = s; clearTimeout(tip.__t); tip.__t = setTimeout(() => { tip.textContent = ''; }, 3500); } };
    const act = b.dataset.hwAct;
    if (act === 'shuf') {
      hosts.forEach(h => { if (!h) return; shuffle(h.children.length).map(i => h.children[i]).forEach(c => h.appendChild(c)); });
      say('題目順序已打亂'); return;
    }
    let cards = [];
    hosts.forEach(h => { if (h) cards = cards.concat(Array.prototype.slice.call(h.querySelectorAll('.hw-card'))); });
    if (act === 'bad') cards = cards.filter(c => c.classList.contains('trk-wrong') || c.classList.contains('trk-fixed'));
    if (!cards.length) { say(act === 'bad' ? '還沒有錯過的題目 👍' : ''); return; }
    cards.forEach(c => { const r = c.querySelector('.hw-reset'); if (r) r.click(); });
    say('已重做 ' + cards.length + ' 題，選項重新洗牌');
  });

  function init() { document.querySelectorAll('.hw-list').forEach(mount); document.querySelectorAll('.hw-tools-slot').forEach(s => s.replaceWith(tools(true))); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.__HW = { mount };
})();
