/* ============================================================
   電路學章末題「題型故事」引擎（使用者 11/10）
   v2（同日）：使用者要「每個題目都有電路圖，解題每一步都畫出那一步用到的圖（KVL 迴路、化簡後的電路、相量圖…），不要每步都同一張」。
   __TypesStory('#tstory', { id, ch, title, bank: '__CH11PB', types: [...] })
   每個 type = { n, en, sec, ex, key, look, ask, f: [[公式, 字幕]], s: [[步驟, 字幕]], trap: [✗, ✓, 字幕],
                wk: { id: 題庫 id, figs: [題目圖, 第1步圖, 第2步圖…] } }   ← wk 由 chN-tyfig.js 補上
   figs 的每一張 = { w, h, p: [schem 零件字串…] }；null／缺 → 沿用上一張；figs[0] 缺 → 用題庫原本的 fig。
   每個題型 4 幕：題目（圖＋題幹）→ 公式 → 例題一步一步（每步換圖）→ 寫法步驟＋最常錯。
   畫圖小工具 window.__TY（HL 主色、DIM 變淡、loop 網目箭頭、ar 電流箭頭、xm 打叉、box 虛線框、note 主色字、thev 戴維寧等效…）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const k = key => (key ? ' data-k="' + key + '"' : '');
  const g = (key, inner) => '<g' + k(key) + '>' + inner + '</g>';
  const T = (x, y, s, o) => D.text(x, y, s, o);
  const strip = s => String(s || '').replace(/<(?!\/?su[bp]>)[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const escLt = s => s.replace(/&(?!(lt|gt|amp);)/g, '&amp;').replace(/<(?!\/?su[bp]>)/g, '&lt;');

  /* ── 斷行：<sub>…</sub> 當一個字 ── */
  function wrap(text, maxW, fs) {
    const toks = strip(text).match(/<su[bp]>.*?<\/su[bp]>|./g) || [];
    const lines = []; let cur = '', w = 0;
    toks.forEach(t => {
      const tw = D.textW(t.replace(/<[^>]+>/g, ''), fs) * (t.length > 1 && t[0] === '<' ? 0.7 : 1);
      if (w + tw > maxW && cur) {
        /* 往回找可以斷的地方（空白、；、，、＝），不要把數字切開 */
        const ts = cur.match(/<su[bp]>.*?<\/su[bp]>|./g); let cut = -1;
        for (let q = ts.length - 1; q > ts.length * 0.4; q--) if (/[ ；，、＝=⟹⇒]/.test(ts[q])) { cut = q; break; }
        if (cut > 0) { lines.push(ts.slice(0, cut + 1).join('')); cur = ts.slice(cut + 1).join(''); w = D.textW(cur.replace(/<[^>]+>/g, ''), fs); }
        else { lines.push(cur); cur = ''; w = 0; }
        if (t === ' ' && !cur) return;
      }
      cur += t; w += tw;
    });
    if (cur) lines.push(cur);
    return lines.map(escLt);
  }
  function card(x, y, w, blocks, key) {
    /* blocks = [[文字, fs, cls]]；回傳 { svg, h } */
    let s = '', yy = y + 12;
    blocks.forEach(b => {
      const fs = b[1] || 14, lines = wrap(b[0], w - 28, fs);
      lines.forEach(l => { yy += fs * 1.45; s += T(x + 14, yy, l, { cls: b[2] || 't', fs, a: 'start' }); });
      yy += 6;
    });
    const h = yy - y + 10;
    return { svg: g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"/>' + s), h };
  }
  function rows(x, y, w, list, opt) {
    opt = opt || {};
    const lh = opt.lh || 30, fs = opt.fs || 15, top = opt.title ? 30 : 10;
    let s = '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (top + list.length * lh + 8) + '" rx="12" filter="url(#st-sh)"/>';
    if (opt.title) s += T(x + 14, y + 21, opt.title, { cls: 'ts', fs: 12, a: 'start' });
    list.forEach((r, i) => {
      let f = r[3] || fs; const tw = D.textW(String(r[0]).replace(/<su[bp]>(.*?)<\/su[bp]>/g, '$1'), f);
      if (tw > w - 30) f = Math.max(10.5, f * (w - 30) / tw);
      s += T(x + 16, y + top + lh * i + lh * 0.7, r[0], { cls: r[2] || 't', fs: Math.round(f * 10) / 10, a: 'start', k: r[1] });
    });
    return g(opt.k, s);
  }
  const sc = (t, en, svg, steps) => ({ t, en, svg, steps });

  /* ── 把一張圖嵌進故事畫面 ── */
  function figIn(fig, x, y, w, h, key) {
    let vbw, vbh, inner;
    if (typeof fig === 'string') {
      const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(fig); vbw = m ? +m[1] : 400; vbh = m ? +m[2] : 200;
      inner = fig.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    } else { vbw = fig.w; vbh = fig.h; inner = fig.p.join(''); }
    return '<g data-k="' + key + '" style="color:var(--s-ink)"><svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="0 0 ' + vbw + ' ' + vbh +
      '" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="schem">' + inner + '</svg></g>';
  }

  function build(def) {
    const TY = def.types, scenes = [], B = window[def.bank];
    const n = TY.length, lh = n > 6 ? 25 : 30;
    scenes.push(sc(def.ch + ' 會考哪幾種題', 'QUESTION TYPES',
      rows(70, 100, 500, TY.map((t, i) => [(i + 1) + '. ' + t.n + '（' + t.sec + '）', 'm' + i, 't', 14.5]), { lh, title: '這一章的題型' }),
      [{ sub: def.intro || (def.ch + ' 的章末題，拆開來只有這 ' + n + ' 種。'), on: TY.map((_, i) => 'm' + i).slice(0, Math.ceil(n / 2)).join(' ') },
       { sub: '每一種都配一題真的章末題：先看電路圖，再一步一步解，每一步都有自己的圖。', on: TY.map((_, i) => 'm' + i).join(' ') }]));
    TY.forEach((t, i) => {
      const no = '題型 ' + (i + 1) + '：';
      const wk = t.wk || {}, it = B && wk.id ? B.items.find(x => x.id === wk.id) : null;
      const figs = (wk.figs || []).slice();
      const f0 = figs[0] || (it && it.fig) || null;
      const tag = it ? it.tag.replace('Problem ', 'Problem ') : ('Problem ' + t.ex[0]);
      /* 1 題目 */
      if (it) {
        const c = card(350, 100, 274, [[tag, 12.5, 'ts'], [it.q, 13.5], ['要你求：' + t.ask, 13, 'ta']], 'qc');
        scenes.push(sc(no + t.n, t.en,
          (f0 ? figIn(f0, 12, 98, 330, 210, 'qf') : '') + c.svg,
          [{ sub: '第 ' + (i + 1) + ' 種：' + t.n + '。拿真的章末題 ' + tag.replace('Problem ', '') + ' 來看。', on: 'qf' },
           { sub: '題目：' + strip(it.q).replace(/<[^>]+>/g, '').slice(0, 46) + (strip(it.q).length > 46 ? '…' : ''), on: 'qc' },
           { sub: '同類題還有：' + t.ex.join('、') + '。它要你求的是：' + t.ask + '。' }]));
      } else {
        scenes.push(sc(no + t.n, t.en,
          rows(70, 100, 500, t.look.map((l, j) => [l, 'l' + j, 't', 14.5]), { lh: 28, title: '題目長這樣', k: 'lk' }) +
          D.chip(320, 118 + 30 + t.look.length * 28 + 34, '要你求：' + t.ask, '同類題：' + t.ex.join('、'), 'ask', { fs: 14, acc: true }),
          [{ sub: '第 ' + (i + 1) + ' 種：' + t.n + '。', on: 'lk ' + t.look.map((_, j) => 'l' + j).join(' ') }, { sub: '它要你求的是：' + t.ask + '。', on: 'ask' }]));
      }
      /* 2 公式 */
      scenes.push(sc(t.n + '：要背的公式', 'KEY FORMULAS',
        rows(60, 100, 520, t.f.map((r, j) => [r[0], 'f' + j, j === 0 ? 'ta' : 't', 15.5]), { lh: Math.min(36, 190 / t.f.length), title: '公式' }),
        t.f.map((r, j) => ({ sub: r[1], on: 'f' + j }))));
      /* 3 例題一步一步（每步一張圖） */
      if (it && it.steps && it.steps.length) {
        let svg = '', steps = [], lastFig = f0, lastKey = null;
        it.steps.forEach((s, j) => {
          const fg = figs[j + 1] || null, fkey = fg ? 'sf' + j : null;
          if (fg) svg += figIn(fg, 12, 98, 330, 210, fkey);
          const title = strip(s.t).replace(/^Step\s*\d+\s*/, '').replace(/<[^>]+>/g, '');
          const c = card(350, 100, 274, [['第 ' + (j + 1) + ' / ' + it.steps.length + ' 步', 12, 'ts'], [title, 14.5, 'ta'], [s.eq, 13.5]], 'sc' + j);
          svg += c.svg;
          const why = strip(s.why || '').replace(/<[^>]+>/g, '').split(/(?<=[。；])/)[0];
          const on = 'sc' + j + (fkey ? ' ' + fkey : '') + (j === 0 && !fkey && f0 ? ' sf0b' : '');
          const off = (j > 0 ? 'sc' + (j - 1) : '') + (fkey && lastKey ? ' ' + lastKey : '');
          steps.push({ sub: (title + (why ? '　' + why : '')).slice(0, 70), on, off: off.trim() || undefined });
          if (fkey) lastKey = fkey;
          else if (j === 0 && f0) lastKey = 'sf0b';
        });
        if (!figs[1] && f0) svg = figIn(f0, 12, 98, 330, 210, 'sf0b') + svg;
        scenes.push(sc('例題：' + tag + ' 一步一步', 'WORKED EXAMPLE', svg, steps));
      }
      /* 4 寫法 */
      const sl = t.s.length, slh = Math.min(30, 150 / sl);
      scenes.push(sc(t.n + '：寫法步驟', 'HOW TO SOLVE',
        rows(60, 98, 520, t.s.map((r, j) => [(j + 1) + '. ' + r[0], 's' + j, 't', 14.5]), { lh: slh, title: '拿到題目照這樣寫' }) +
        D.chip(320, 98 + 30 + sl * slh + 40, t.trap[0] + '　→　' + t.trap[1], null, 'tr', { fs: 13.5, acc: true }),
        t.s.map((r, j) => ({ sub: r[1], on: 's' + j })).concat([{ sub: '最常錯：' + t.trap[2], on: 'tr' }])));
    });
    scenes.push(sc('總整理', 'RECAP',
      rows(60, 100, 520, TY.map((t, i) => [t.n + '：' + t.key, 'r' + i, 't', 14]), { lh: Math.min(26, 170 / n), title: '每種題型一句話' }),
      [{ sub: '最後一句話記住每種題型。', on: TY.map((_, i) => 'r' + i).join(' ') }]));
    scenes.push(sc('開始刷題', 'GO PRACTICE',
      D.chip(320, 150, '刷題順序：照小節一節一節來', '卡住就回來看那種題型的例題和寫法步驟', 'g1', { fs: 15, acc: true }) +
      D.chip(320, 220, '每題先在手寫板自己寫，再看提示、答案', '算錯按「算錯了」，會進錯題本', 'g2', { fs: 14 }),
      [{ sub: '往下挑小節開始刷題吧！', on: 'g1 g2' }]));
    return scenes;
  }

  /* ═════ 畫圖小工具（schem 座標） ═════ */
  const S = window.__SCH;
  const TY = {
    HL: (...p) => '<g style="color:var(--s-acc)" stroke-width="2.6">' + p.join('') + '</g>',
    DIM: (...p) => '<g opacity=".22">' + p.join('') + '</g>',
    note: (x, y, s, a, fs) => '<g style="color:var(--s-acc)">' + S.t(x, y, s, a || 'middle', ' font-size="' + (fs || 12.5) + '" font-weight="700"') + '</g>',
    txt: (x, y, s, a, fs) => S.t(x, y, s, a || 'middle', ' font-size="' + (fs || 12) + '"'),
    /* 網目箭頭：圓心 cx,cy 半徑 r，順時針（ccw = true 逆時針） */
    loop: (cx, cy, r, label, ccw) => {
      const a0 = -150 * Math.PI / 180, a1 = 150 * Math.PI / 180, sg = ccw ? -1 : 1;
      const p = a => [cx + r * Math.cos(a), cy + sg * r * Math.sin(a)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      const ang = Math.atan2(y1 - p(a1 - 0.2)[1], x1 - p(a1 - 0.2)[0]);
      const hd = (x, y, a) => { const s = 7; return 'M' + (x - s * Math.cos(a - 0.5)) + ' ' + (y - s * Math.sin(a - 0.5)) + ' L' + x + ' ' + y + ' L' + (x - s * Math.cos(a + 0.5)) + ' ' + (y - s * Math.sin(a + 0.5)); };
      return '<g style="color:var(--s-acc)" stroke-width="2"><path d="M' + x0 + ' ' + y0 + ' A' + r + ' ' + r + ' 0 1 ' + (ccw ? 0 : 1) + ' ' + x1 + ' ' + y1 + '" fill="none"/><path d="' + hd(x1, y1, ang) + '" fill="none"/>' +
        (label ? S.t(cx, cy + 4, label, 'middle', ' font-size="12" font-weight="700"') : '') + '</g>';
    },
    /* 電流／方向箭頭（任意方向） */
    ar: (x1, y1, x2, y2, label, lx, ly) => {
      const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
      return '<g style="color:var(--s-acc)" stroke-width="2"><path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - s * Math.cos(a - 0.5)) + ' ' + (y2 - s * Math.sin(a - 0.5)) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - s * Math.cos(a + 0.5)) + ' ' + (y2 - s * Math.sin(a + 0.5)) + '" fill="none"/>' +
        (label ? S.t(lx === undefined ? (x1 + x2) / 2 : lx, ly === undefined ? (y1 + y2) / 2 - 6 : ly, label, 'middle', ' font-size="12" font-weight="700"') : '') + '</g>';
    },
    xm: (x, y) => '<g style="color:var(--s-acc)" stroke-width="2.4"><path d="M' + (x - 9) + ' ' + (y - 9) + ' L' + (x + 9) + ' ' + (y + 9) + ' M' + (x + 9) + ' ' + (y - 9) + ' L' + (x - 9) + ' ' + (y + 9) + '" fill="none"/></g>',
    box: (x, y, w, h, label, lx, ly) => '<g style="color:var(--s-acc)"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="none" stroke-dasharray="5 4" stroke-width="1.6"/>' +
      (label ? S.t(lx === undefined ? x + w / 2 : lx, ly === undefined ? y - 5 : ly, label, 'middle', ' font-size="11.5" font-weight="700"') : '') + '</g>',
    /* 戴維寧等效：電壓源 vl、串 zl、接到負載 ll（左下角 x0,y0；高 h） */
    thev: (vl, zl, ll, o) => {
      o = o || {};
      const p = [S.vs(30, 30, 140, vl), S.z(30, 30, 160, 30, zl), S.w('160,30', '220,30'), S.w('30,140', '220,140')];
      p.push(ll ? (o.hl ? TY.HL(S.z(220, 30, 220, 140, ll, { side: 'r' })) : S.z(220, 30, 220, 140, ll, { side: 'r' })) : S.term(220, 30) + S.term(220, 140));
      if (o.cur) p.push(TY.ar(170, 46, 205, 46, o.cur));
      return { w: 390, h: 175, p: ['<g transform="translate(95,0)">'].concat(p, ['</g>']) };
    },
    /* 相量圖：原點 (cx,cy)，vec = [[大小比例(px), 角度(度), 標籤, 主色?]] */
    phasor: (cx, cy, vec, o) => {
      o = o || {};
      let s = S.w((cx - (o.ax || 110)) + ',' + cy, (cx + (o.ax || 110)) + ',' + cy) + S.w(cx + ',' + (cy - (o.ay || 80)), cx + ',' + (cy + (o.ay || 80)));
      vec.forEach(v => {
        const a = v[1] * Math.PI / 180, x = cx + v[0] * Math.cos(a), y = cy - v[0] * Math.sin(a);
        const lx = cx + (v[0] + 16) * Math.cos(a), ly = cy - (v[0] + 16) * Math.sin(a) + 4;
        const body = TY.arRaw(cx, cy, x, y) + S.t(lx, ly, v[2], Math.cos(a) > 0.3 ? 'start' : Math.cos(a) < -0.3 ? 'end' : 'middle', ' font-size="11.5"');
        s += v[3] ? '<g style="color:var(--s-acc)" stroke-width="2.2">' + body + '</g>' : body;
      });
      return s;
    },
    arRaw: (x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1), s = 7; return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - s * Math.cos(a - 0.5)) + ' ' + (y2 - s * Math.sin(a - 0.5)) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - s * Math.cos(a + 0.5)) + ' ' + (y2 - s * Math.sin(a + 0.5)) + '" fill="none"/>'; },
    /* 直角三角形（功率／阻抗三角形）：底 P、高 Q（Q>0 往上）；比例 sc；左下角 x0,y0 */
    tri: (x0, y0, P, Q, sc, lab) => {
      const x1 = x0 + P * sc, y1 = y0 - Q * sc;
      return '<path d="M' + x0 + ' ' + y0 + ' L' + x1 + ' ' + y0 + ' L' + x1 + ' ' + y1 + ' Z" fill="none"/>' +
        S.t((x0 + x1) / 2, y0 + (Q >= 0 ? 15 : -6), lab[0], 'middle', ' font-size="11.5"') + S.t(x1 + 6, (y0 + y1) / 2 + 4, lab[1], 'start', ' font-size="11.5"') +
        S.t((x0 + x1) / 2 - 8, (y0 + y1) / 2 + (Q >= 0 ? -6 : 14), lab[2], 'end', ' font-size="11.5"') + (lab[3] ? S.t(x0 + 26, y0 + (Q >= 0 ? -5 : 14), lab[3], 'start', ' font-size="11"') : '');
    }
  };
  window.__TY = TY;

  window.__TypesStory = function (sel, def) {
    return window.__Story(sel, { id: def.id, title: def.title, after: '#sec-pick', afterLabel: '往下開始刷題 ↓', scenes: build(def) });
  };
})();
