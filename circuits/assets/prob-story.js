/* ============================================================
   章末練習題的「🎬 圖解詳解」（使用者 10/18：CH11、CH12 章末題也要故事；Review Question 不用）
   自動把每一題（tag 以 'Problem' 開頭）的「圖 ＋ 詳解步驟 ＋ 答案」做成故事：
     第 1 幕：題目圖（schem.js 重畫的那張）＋題目重點
     中間每幕：左邊縮小的圖、右邊計算卡，一步亮一段；字幕是那一步的「為什麼」
     最後一幕：答案卡
   載入順序：題庫（ch11-probN.js / ch12-probN.js）之後、exbook 建卡片之前（DOMContentLoaded 前都可以）。
   需要：story.js、ch12-kit.js（__K12）
   ============================================================ */
(function () {
  'use strict';
  const BANKS = ['__CH11PB', '__CH12PB'];
  const K = () => window.__K12;

  /* SVG 文字：只留 <sub>、<sup>，其他標籤拿掉 */
  const clean = s => String(s || '').replace(/<(?!\/?su[bp]>)[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const plainLen = s => clean(s).replace(/<[^>]+>/g, '').length;
  /* 去掉「Step 3　」前綴 */
  const head = t => clean(t).replace(/^Step\s*\d+\s*/, '').replace(/^[（(]?[a-z][)）]\s*/, m => m).trim();
  /* 長算式切成幾行（每行約 30 字以內）：在 ；、⇒、，、= 前後切 */
  function wrap(s, max) {
    max = max || 30;
    s = clean(s);
    if (plainLen(s) <= max) return s ? [s] : [];
    const parts = s.split(/(；|　⇒　| ⇒ |⇒|，(?=\S))/);
    const out = []; let cur = '';
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (/^(；|　⇒　| ⇒ |⇒|，)$/.test(p)) { cur += p.trim() === '⇒' ? ' ⇒' : p; continue; }
      if (cur && plainLen(cur + p) > max) { out.push(cur.trim()); cur = (/^\s*⇒/.test(parts[i - 1] || '') ? '⇒ ' : '') + p; }
      else cur += p;
    }
    if (cur.trim()) out.push(cur.trim());
    /* 還是太長就在「 = 」切 */
    const fin = [];
    out.forEach(line => {
      if (plainLen(line) <= max + 8) { fin.push(line); return; }
      const bits = line.split(/(?= = )/); let c = '';
      bits.forEach(b => { if (c && plainLen(c + b) > max) { fin.push(c.trim()); c = '　' + b.trim(); } else c += b; });
      if (c.trim()) fin.push(c.trim());
    });
    /* 最後一招：在（b）、、、空白附近硬切（<sub>…</sub> 當成一個字） */
    const hard = [];
    fin.forEach(line => {
      let rest = line;
      while (plainLen(rest) > max + 8) {
        const toks = rest.match(/<su[bp]>.*?<\/su[bp]>|[\s\S]/g) || [];
        let n = 0, cut = -1, idx = 0;
        for (let j = 0; j < toks.length; j++) {
          n += toks[j].length > 1 ? toks[j].replace(/<[^>]+>/g, '').length : 1;
          if (n > max) break;
          if (/^[、，　 ]$/.test(toks[j]) || /^[（(]$/.test(toks[j + 1] || '') && /[a-d]/.test(toks[j + 2] || '')) cut = j;
        }
        if (cut < 4) break;
        hard.push(toks.slice(0, cut + 1).join('').trim());
        rest = toks.slice(cut + 1).join('').trim();
      }
      if (rest) hard.push(rest);
    });
    return hard;
  }
  /* 一句話字幕：取「為什麼」的第一句（≤ 46 字） */
  function sub(st) {
    const s = String(st.why || '').replace(/<(?!\/?su[bp]>)[^>]+>/g, '').trim();
    if (!s) return clean(st.t).replace(/^Step\s*\d+\s*/, '');
    const toks = s.match(/<su[bp]>.*?<\/su[bp]>|[\s\S]/g) || [];
    let out = '', n = 0;
    for (const t of toks) {
      out += t; n++;
      if (n >= 12 && /^[。；！？]$/.test(t)) break;
      if (n >= 60) { out += '…'; break; }
    }
    return out;
  }
  /* 題目的 schem 圖放進故事畫面：x, y, w, h 的框裡（等比例置中） */
  function figIn(fig, x, y, w, h, key) {
    if (!fig) return '';
    const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(fig);
    const inner = fig.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    const vb = m ? m[1] + ' ' + m[2] : '0 0 400 200';
    return '<g data-k="' + key + '" style="color:var(--s-ink)"><svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="0 0 ' + vb +
      '" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="schem">' + inner + '</svg></g>';
  }
  /* 題目文字切成幾行（中文每行約 26 字） */
  function lines(txt, n) {
    const s = clean(txt); const out = []; let cur = '', len = 0;
    const toks = s.match(/<su[bp]>.*?<\/su[bp]>|./g) || [];
    toks.forEach(t => {
      const l = t.length > 1 ? t.replace(/<[^>]+>/g, '').length * 0.6 : (t.charCodeAt(0) > 0x2e80 ? 1 : 0.55);
      if (len + l > n && cur) { out.push(cur); cur = ''; len = 0; }
      cur += t; len += l;
    });
    if (cur) out.push(cur);
    return out;
  }

  function build(it) {
    const k = K(), { calc, sc } = k;
    const scenes = [];
    const hasFig = !!it.fig;
    const qLines = lines(it.q, hasFig ? 40 : 26);
    const qShow = qLines.slice(0, hasFig ? 2 : 6);
    if (qLines.length > qShow.length) qShow[qShow.length - 1] += '…';
    /* 第 1 幕：題目 */
    if (hasFig) {
      scenes.push(sc('題目', it.tag.toUpperCase(),
        figIn(it.fig, 50, 100, 540, 150, 'fig') + calc(60, 252, 520, qShow.map((l, i) => [l, 'q' + i, 'tm', 12.5]), { k: 'qq', lh: 20, a: 'middle' }),
        [{ sub: '先看題目的電路／圖。', on: 'fig' }, { sub: clean(it.q).length > 60 ? '要求的東西寫在下面（完整題目在卡片上）。' : clean(it.q), on: 'qq ' + qShow.map((_, i) => 'q' + i).join(' ') }]));
    } else {
      scenes.push(sc('題目', it.tag.toUpperCase(),
        calc(90, 110, 460, qShow.map((l, i) => [l, 'q' + i, i ? 't' : 't', 14]), { k: 'qq', lh: 27 }),
        [{ sub: '先把題目讀一遍。', on: 'qq ' + qShow.map((_, i) => 'q' + i).join(' ') }]));
    }
    /* 中間：每幕 1～2 步 */
    const steps = (it.steps || []).filter(s => s.t || s.eq);
    let i = 0, no = 0;
    while (i < steps.length) {
      const grp = [];
      let rowsN = 0;
      while (i < steps.length && grp.length < 2) {
        const r = wrap(steps[i].eq, hasFig ? 28 : 40).length + 1;
        if (grp.length && rowsN + r > 6) break;
        grp.push(steps[i]); rowsN += r; i++;
      }
      no++;
      const rows = [], stp = [];
      grp.forEach((st, gi) => {
        const keys = [];
        const h = head(st.t);
        if (h) { rows.push([h, 'r' + rows.length, 'ts', 12.5]); keys.push('r' + (rows.length - 1)); }
        wrap(st.eq, hasFig ? 28 : 40).forEach((l, li, arr) => { rows.push([l, 'r' + rows.length, li === arr.length - 1 ? 'ta' : 't', 14]); keys.push('r' + (rows.length - 1)); });
        stp.push({ sub: sub(st), on: (gi === 0 ? 'cc' + (hasFig ? ' fig' : '') + ' ' : '') + keys.join(' ') });
      });
      const title = (head(grp[0].t).replace(/[。：:]$/, '') || '第 ' + no + ' 步').slice(0, 16);
      const svg = (hasFig ? figIn(it.fig, 24, 110, 250, 180, 'fig') : '') +
        calc(hasFig ? 290 : 90, 106, hasFig ? 330 : 460, rows, { k: 'cc', lh: rows.length > 5 ? 25 : 28, a: 'start' });
      scenes.push(sc(title, 'STEP ' + no, svg, stp));
    }
    /* 最後：答案 */
    const ans = clean(it.ans).replace(/\s*([（(][b-f][)）])/g, '；$1').split(/；|(?<=\S)，(?=\S)/).map(s => s.trim()).filter(Boolean).slice(0, 5);
    const arows = []; ans.forEach(a => wrap(a, 40).forEach(l => arows.push(l)));
    scenes.push(sc('答案', 'ANSWER', calc(90, 112, 460, arows.slice(0, 6).map((r, j) => [r, 'a' + j, j === 0 ? 'ta' : 't', 15]), { title: '答案　ANSWER', a: 'middle', k: 'ans' }),
      [{ sub: '答案。', on: 'ans ' + arows.slice(0, 6).map((_, j) => 'a' + j).join(' ') }]));
    return scenes;
  }

  BANKS.forEach(b => {
    const bank = window[b];
    if (!bank || !bank.items) return;
    bank.items.forEach(it => {
      if (it.story || !/^Problem/.test(it.tag || '')) return;
      it.story = () => build(it);
    });
  });
})();
