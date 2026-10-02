/* ============================================================
   工程數學 拉普拉斯轉換 2 —— 故事模式（10/2 課堂）
   寫法：跟電子學 CH1 PART 1 一樣淺 —— 先複習上一章，每個新觀念先給生活比喻
         （爬樓梯、翹翹板、拔河、旋轉門、安全區、電燈開關、果汁機、字典、迴力鏢、削鉛筆），
         「先整理一下」之後才放公式。
   主線謎題：ℒ(t⁵) = ？硬算要分部積分 5 次。
   答案：t⁵ 微 5 次變成常數 120，套「爬樓梯公式」一行得到 120/s⁶。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { arrow, chip, text } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const box = (cx, cy, w, h, label, key, acc, fs) => g(key, '<rect class="' + (acc ? 'accw' : 'card') + '" x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="10" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.5"/>' +
    T(cx, cy, label, { cls: acc ? 'ta' : 't', fs: fs || 14, dy: '.35em' }));
  const axes = (x0, y0, w, h, key, xl, yl) => g(key, arrow(x0, y0, x0 + w, y0, null, 'ln') + arrow(x0, y0, x0, y0 - h, null, 'ln') +
    (xl ? T(x0 + w + 6, y0, xl, { cls: 'tm', fs: 13, a: 'start', dy: '.35em' }) : '') + (yl ? T(x0 + 8, y0 - h + 4, yl, { cls: 'tm', fs: 13, a: 'start' }) : ''));

  /* ════════════ 00 謎題 ════════════ */
  const S0 = {
    t: '一個看起來很累的題目', en: 'THE QUESTION',
    svg: T(320, 118, 'ℒ(t⁵) = ?', { cls: 'ta', fs: 34, k: 'q' }) +
      T(320, 168, '= ∫₀<sup>∞</sup> t⁵ e<sup>−st</sup> dt', { fs: 20, k: 'int' }) +
      g('pp', [0, 1, 2, 3, 4].map(i => box(120 + i * 100, 228, 86, 38, '分部積分 ' + (i + 1), null, false, 12)).join('')) +
      chip(320, 296, '老師：不用積分，一行解決', '這一章就是在學這招', 'ans', { fs: 14, acc: true }),
    steps: [
      { sub: '先丟一個謎題：<b>t⁵ 的拉普拉斯轉換</b>是多少？', on: 'q' },
      { sub: '照定義硬算，就是這個積分。', on: 'int' },
      { sub: 't⁵ 要微 5 次才會不見，所以要<b>分部積分 5 次</b>……光想就累。', on: 'pp' },
      { sub: '老師說：<b>不用積分</b>。學完這一章，一行就能寫出答案。', on: 'ans' }
    ]
  };

  /* ════════════ 01 複習：翻譯機 ════════════ */
  const S1 = {
    t: '先複習：ℒ 是翻譯機', en: 'RECAP',
    svg: box(140, 160, 170, 64, 't 的世界', 'tw', false, 17) + box(500, 160, 170, 64, 's 的世界', 'sw', true, 17) +
      arrow(230, 160, 410, 160, 'ar', 'lna') + T(320, 146, 'ℒ（翻譯機）', { cls: 'ta', fs: 14, k: 'arL' }) +
      T(140, 238, '微分 f′(t)', { fs: 19, k: 'd1' }) + arrow(215, 238, 385, 238, 'ar2', 'lna') +
      T(500, 238, 'sF(s) − f(0)', { cls: 'ta', fs: 19, k: 'd2' }) +
      chip(320, 300, '上一章學到的', '微分 → 乘 s，再扣掉開頭的值', 'c', { fs: 13 }),
    steps: [
      { sub: '先複習上一章：拉普拉斯轉換像一台<b>翻譯機</b>，把 t 的世界翻到 s 的世界。', on: 'tw sw ar arL' },
      { sub: '它最厲害的地方：t 世界的<b>微分</b>……', on: 'd1' },
      { sub: '翻過去變成<b>乘 s，再扣掉開頭的值 f(0)</b>。微分不見了！', on: 'ar2 d2 c' }
    ]
  };

  /* ════════════ 02 爬樓梯 ════════════ */
  const stairs = '<polyline class="ln" style="fill:none;stroke-width:2.2" points="70,312 200,312 200,257 310,257 310,202 420,202 420,147 560,147"/>';
  const S2 = {
    t: '微分一次 = 爬一階樓梯', en: 'ONE STEP AT A TIME',
    svg: g('st', stairs) +
      T(120, 300, 'f', { fs: 18, k: 'l0' }) + T(230, 245, 'f′', { fs: 18, k: 'l1' }) +
      T(340, 190, 'f″', { fs: 18, k: 'l2' }) + T(450, 135, 'f‴', { fs: 18, k: 'l3' }) +
      '<g' + k('me') + '><circle class="acc" cx="172" cy="292" r="8"/></g>' +
      T(206, 292, '× s，− f(0)', { cls: 'ta', fs: 12, a: 'start', k: 'r1' }) +
      T(316, 237, '× s，− f′(0)', { cls: 'ta', fs: 12, a: 'start', k: 'r2' }) +
      T(426, 182, '× s，− f″(0)', { cls: 'ta', fs: 12, a: 'start', k: 'r3' }) +
      chip(170, 120, '每爬一階', '多乘一個 s、多扣一個初始值', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '用一個比喻：把「多微分一次」想成<b>往上爬一階樓梯</b>。', on: 'st l0 l1 l2 l3 me' },
      { sub: '從 f 爬到 f′：翻到 s 世界就是 <b>× s，再扣 f(0)</b>。', on: 'r1', mv: { me: [110, -55] } },
      { sub: '再爬一階到 f″：<b>再 × s，再扣 f′(0)</b>。', on: 'r2', mv: { me: [220, -110] } },
      { sub: '每爬一階，就多乘一個 s、多扣一個初始值。爬幾階就做幾次。', on: 'r3 c', mv: { me: [330, -165] } }
    ]
  };

  /* ════════════ 03 ℒ(f″) 套兩次 ════════════ */
  const S3 = {
    t: '爬兩階：ℒ(f″)', en: 'TWO STEPS',
    svg: T(320, 108, 'ℒ(f″) = ℒ( (f′)′ )', { fs: 20, k: 'a1' }) +
      T(320, 152, '= s·ℒ(f′) − f′(0)', { fs: 20, k: 'a2' }) +
      T(320, 196, '= s·[ sF(s) − f(0) ] − f′(0)', { fs: 20, k: 'a3' }) +
      T(320, 244, '= s²F(s) − s·f(0) − f′(0)', { cls: 'ta', fs: 22, k: 'a4' }) +
      chip(320, 300, '不用重新積分', '把上一章的公式套兩次', 'c', { fs: 13 }),
    steps: [
      { sub: '來真的算一次。f″ 就是「f′ 的微分」。', on: 'a1' },
      { sub: '先爬一階：把 f′ 當成新的 f，套公式。注意扣的是 <b>f′(0)</b>。', on: 'a2' },
      { sub: '裡面的 ℒ(f′) 再爬一階，換成 sF(s) − f(0)。', on: 'a3' },
      { sub: '乘開就好了。<b>完全沒有積分</b>，只是把舊公式套兩次。', on: 'a4 c' }
    ]
  };

  /* ════════════ 04 翹翹板 ════════════ */
  const cols = [150, 285, 405, 525];
  const S4 = {
    t: '看出規律：翹翹板', en: 'THE PATTERN',
    svg: T(320, 112, 'ℒ(f‴) = s³F(s) − s²f(0) − s f′(0) − f″(0)', { fs: 18, k: 'eq' }) +
      g('rowS', T(60, 175, 's 的次方', { cls: 'ts', fs: 12, a: 'start' }) + [3, 2, 1, 0].map((v, i) => T(cols[i], 175, String(v), { cls: 'ta', fs: 20 })).join('')) +
      arrow(170, 190, 510, 190, 'arS', 'lna') +
      g('rowF', T(60, 240, 'f 微幾次', { cls: 'ts', fs: 12, a: 'start' }) + ['—', '0', '1', '2'].map((v, i) => T(cols[i], 240, v, { fs: 20 })).join('')) +
      arrow(300, 255, 510, 255, 'arF', 'ln') +
      chip(320, 302, '像翹翹板：一邊少 1，另一邊多 1', '而且後面全部都是減號', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '爬三階的結果長這樣。看起來很長，但有規律。', on: 'eq' },
      { sub: '看 <b>s 的次方</b>：3、2、1、0，一路往下掉。', on: 'rowS arS' },
      { sub: '看 <b>f 微了幾次</b>：0、1、2，一路往上爬。', on: 'rowF arF' },
      { sub: '像翹翹板：一邊少 1、另一邊就多 1。<b>而且全部都是減號</b>。', on: 'c' }
    ]
  };

  /* ════════════ 05 先整理一下 ════════════ */
  const S5 = {
    t: '先整理一下', en: 'SUMMARY 1',
    svg: T(320, 140, 'ℒ(f⁽ⁿ⁾) = sⁿF(s) − s<sup>n−1</sup>f(0) − ⋯ − f<sup>(n−1)</sup>(0)', { cls: 'ta', fs: 19, k: 'f' }) +
      chip(190, 215, '第一項 sⁿF(s)', '爬幾階就幾個 s', 'c1', { fs: 13 }) +
      chip(450, 215, '後面扣 n 項', '全部都是減號', 'c2', { fs: 13 }) +
      chip(320, 290, '檢查：次方 + 微幾次 = n − 1', '每一項都一樣', 'c3', { fs: 13, acc: true }),
    steps: [
      { sub: '先整理一下。爬 n 階的公式長這樣。', on: 'f' },
      { sub: '第一項：<b>sⁿF(s)</b>。後面：<b>扣 n 項</b>，全部減號。', on: 'c1 c2' },
      { sub: '寫完自我檢查：每一項「s 的次方 + f 微幾次」都等於 n − 1。', on: 'c3' }
    ]
  };

  /* ════════════ 06 拔河 ════════════ */
  const S6 = {
    t: 'ℒ 一定算得出來嗎？', en: 'TUG OF WAR',
    svg: T(320, 108, '∫₀<sup>∞</sup> f(t) · e<sup>−σt</sup> dt', { fs: 22, k: 'q' }) +
      box(110, 196, 130, 52, 'e<sup>−σt</sup>', 'L', true, 18) +
      '<line class="ln" x1="175" y1="196" x2="465" y2="196" style="stroke-width:3"' + k('rope') + '/>' +
      '<g' + k('kn') + '><circle class="acc" cx="320" cy="196" r="9"/></g>' +
      box(530, 196, 130, 52, 'f(t)', 'R', false, 18) +
      T(110, 240, '往 0 拉', { cls: 'ts', fs: 12.5, k: 'L2' }) + T(530, 240, '往 ∞ 衝', { cls: 'ts', fs: 12.5, k: 'R2' }) +
      chip(320, 296, '左邊拉贏 → 乘起來 → 0：ℒ 存在', '右邊贏 → 乘起來 → ∞：ℒ 不存在', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '換一個問題：ℒ 的積分<b>一定算得出來嗎</b>？積分裡其實有兩股力量。', on: 'q' },
      { sub: '一邊是 <b>e<sup>−σt</sup></b>：t 越大越小，<b>往 0 拉</b>。', on: 'L L2 rope kn' },
      { sub: '另一邊是 <b>f(t)</b>：可能越長越大，<b>往無限大衝</b>。', on: 'R R2' },
      { sub: '像拔河。e<sup>−σt</sup> 拉贏，乘起來趨近 0，積分才算得出來。', on: 'c', mv: { kn: [-70, 0] } }
    ]
  };

  /* ════════════ 07 三個選手 ════════════ */
  const S7 = {
    t: '三個選手上場', en: 'WHO WINS?',
    svg: box(130, 125, 120, 46, 't²', 'n1', false, 20) + box(320, 125, 120, 46, 'e<sup>2t</sup>', 'n2', false, 20) + box(510, 125, 120, 46, 'e<sup>t²</sup>', 'n3', false, 20) +
      chip(130, 205, '多項式，跑得慢', '✓ σ &gt; 0 就拉得住', 'c1', { fs: 13 }) +
      chip(320, 205, '跟指數一樣快', '✓ σ &gt; 2 才拉得住', 'c2', { fs: 13 }) +
      chip(510, 205, '比所有指數都快', '✗ 再大的 σ 都不行', 'c3', { fs: 13 }) +
      T(320, 285, 'ℒ 存在的條件：lim f(t)e<sup>−σt</sup> = 0，σ &gt; a', { cls: 'ta', fs: 17, k: 'cond' }),
    steps: [
      { sub: '老師舉了三個選手，看 e<sup>−σt</sup> 拉不拉得住。', on: 'n1 n2 n3' },
      { sub: '<b>t²</b>：會長大但很慢，指數一定贏。σ 只要大於 0 就好。', on: 'c1' },
      { sub: '<b>e<sup>2t</sup></b>：也是指數，要比它更強，<b>σ 必須大於 2</b>。', on: 'c2' },
      { sub: '<b>e<sup>t²</sup></b>：長得比任何指數都快，拉不住 —— 它的 ℒ <b>不存在</b>。', on: 'c3 cond' }
    ]
  };

  /* ════════════ 08 旋轉門 ════════════ */
  const cx8 = 170, cy8 = 205, r8 = 78, a8 = 0.7;
  const S8 = {
    t: 's 是複數怎麼辦？', en: 'THE REVOLVING DOOR',
    svg: g('circ', '<line class="ln" x1="' + (cx8 - 100) + '" y1="' + cy8 + '" x2="' + (cx8 + 100) + '" y2="' + cy8 + '"/><line class="ln" x1="' + cx8 + '" y1="' + (cy8 + 100) + '" x2="' + cx8 + '" y2="' + (cy8 - 100) + '"/>' +
        '<circle class="ln" cx="' + cx8 + '" cy="' + cy8 + '" r="' + r8 + '" style="fill:none;stroke-width:1.6"/>' +
        '<line class="lna" x1="' + cx8 + '" y1="' + cy8 + '" x2="' + (cx8 + r8 * Math.cos(a8)).toFixed(1) + '" y2="' + (cy8 - r8 * Math.sin(a8)).toFixed(1) + '" style="stroke-width:2.2"/>' +
        '<circle class="acc" cx="' + (cx8 + r8 * Math.cos(a8)).toFixed(1) + '" cy="' + (cy8 - r8 * Math.sin(a8)).toFixed(1) + '" r="7"/>' +
        T(cx8 + 12, cy8 + r8 + 18, '半徑 1', { cls: 'ts', fs: 12, a: 'start' })) +
      T(450, 112, 'e<sup>−st</sup> = e<sup>−σt</sup> · e<sup>−jωt</sup>', { fs: 19, k: 'sp' }) +
      chip(450, 175, 'e<sup>−jωt</sup>：只會轉圈', '像旋轉門，轉再久也不會變大', 'c1', { fs: 13 }) +
      chip(450, 240, '長度永遠是 1', '|cos ωt − j sin ωt| = 1', 'c2', { fs: 13 }) +
      chip(450, 300, '只剩 e<sup>−σt</sup> 要管', '所以只看 σ', 'c3', { fs: 13, acc: true }),
    steps: [
      { sub: '可是 s 是<b>複數</b> s = σ + jω。e<sup>−st</sup> 可以拆成兩半。', on: 'sp' },
      { sub: '有 j 的那半 e<sup>−jωt</sup>，用尤拉公式看：它在半徑 1 的圓上<b>轉圈</b>。', on: 'circ c1' },
      { sub: '像旋轉門：轉多久都一樣大，<b>長度永遠是 1</b>。', on: 'c2' },
      { sub: '取絕對值時它直接變成 1，剩下的只要管實數的 <b>e<sup>−σt</sup></b>。', on: 'c3' }
    ]
  };

  /* ════════════ 09 收斂區 = 安全區 ════════════ */
  const S9 = {
    t: '收斂區：s 平面上的安全區', en: 'REGION OF CONVERGENCE',
    svg: g('ax', arrow(80, 215, 570, 215, null, 'ln') + arrow(230, 315, 230, 85, null, 'ln') +
        T(575, 215, 'σ', { cls: 'tm', fs: 14, a: 'start', dy: '.35em' }) + T(238, 92, 'jω', { cls: 'tm', fs: 14, a: 'start' })) +
      g('zone', '<rect class="accw" x="340" y="88" width="220" height="226" style="opacity:.55"/>' +
        '<line class="lna dsh" x1="340" y1="88" x2="340" y2="314" style="stroke-width:2"/>' +
        T(346, 232, 'σ = a', { cls: 'ta', fs: 13, a: 'start' }) + T(450, 120, '安全區 σ &gt; a', { cls: 'ta', fs: 15 })) +
      g('p1', '<circle class="acc" cx="460" cy="165" r="7"/>' + T(472, 160, 'ℒ 存在 ✓', { cls: 'ta', fs: 13, a: 'start' })) +
      g('p2', '<circle class="ln" cx="150" cy="265" r="7" style="fill:none;stroke-width:2"/>' + T(162, 260, '不存在 ✗', { cls: 'ts', fs: 13, a: 'start' })),
    steps: [
      { sub: '把所有可能的 s 畫成一張平面：橫軸 σ（實部）、直軸 ω（虛部）。', on: 'ax' },
      { sub: '剛剛說只看 σ：<b>σ 在 a 的右邊</b>就拉得住。這一整塊就是<b>安全區</b>（收斂區）。', on: 'zone' },
      { sub: 's 落在安全區裡 ℒ 就存在；落在外面就不存在。上下移動（改 ω）沒差。', on: 'p1 p2' }
    ]
  };

  /* ════════════ 10 查表卡 1：開關 ════════════ */
  const S10 = {
    t: '第一張查表卡：ℒ(1)', en: 'CARD 1',
    svg: axes(150, 270, 170, 150, 'ax', 't', 'u(t)') +
      '<polyline class="lna" style="fill:none;stroke-width:2.6" points="60,270 150,270 150,190 320,190"' + k('sw') + '/>' +
      T(140, 190, '1', { cls: 'ts', fs: 12, a: 'end', k: 'sw1' }) +
      chip(470, 120, 'u(t)：電燈開關', 't = 0 打開，之後一直是 1', 'c0', { fs: 13 }) +
      chip(470, 182, 'ℒ 只看 t ≥ 0', '所以 u(t) 和 1 轉出來一樣', 'c', { fs: 13 }) +
      T(470, 238, '∫₀<sup>∞</sup> e<sup>−st</sup> dt = 1/s', { fs: 17, k: 'calc' }) +
      box(470, 292, 200, 46, 'ℒ(1) = 1/s，σ &gt; 0', 'card', true, 16),
    steps: [
      { sub: '開始做查表卡。第一張：<b>u(t)</b>，像電燈開關，t = 0 那一刻打開，之後一直是 1。', on: 'ax sw sw1 c0' },
      { sub: 'ℒ 的積分從 0 開始，<b>只看 t ≥ 0</b>。所以 u(t) 跟常數 1 轉出來一樣。', on: 'c' },
      { sub: '直接積分：e<sup>−st</sup> 的積分是 1/s。', on: 'calc' },
      { sub: '第一張卡：<b>ℒ(1) = 1/s</b>。σ &gt; 0 才在安全區裡。', on: 'card' }
    ]
  };

  /* ════════════ 11 查表卡 2：e^(at) ════════════ */
  const S11 = {
    t: '第二張查表卡：ℒ(e<sup>at</sup>)', en: 'CARD 2',
    svg: T(320, 118, 'ℒ(e<sup>at</sup>) = ∫₀<sup>∞</sup> e<sup>at</sup> e<sup>−st</sup> dt', { fs: 20, k: 'a1' }) +
      T(320, 168, '= ∫₀<sup>∞</sup> e<sup>−(s−a)t</sup> dt', { fs: 20, k: 'a2' }) +
      chip(320, 225, '跟 ℒ(1) 一模一樣的積分', '只是 s 換成 s − a', 'c', { fs: 13 }) +
      box(320, 292, 270, 48, 'ℒ(e<sup>at</sup>) = 1/(s − a)，σ &gt; a', 'card', true, 16),
    steps: [
      { sub: '第二張：<b>e<sup>at</sup></b>。兩個指數可以合併。', on: 'a1 a2' },
      { sub: '合併完跟剛剛 ℒ(1) 的積分<b>一模一樣</b>，只是 s 換成 s − a。', on: 'c' },
      { sub: '所以答案也只是把 1/s 的 s 換掉：<b>1/(s − a)</b>，安全區變成 σ &gt; a。', on: 'card' }
    ]
  };

  /* ════════════ 12 線性：果汁機 ════════════ */
  const row = (y, l, r, key, acc) => g(key, T(110, y, l, { cls: acc ? 'ta' : 't', fs: 14, dy: '.35em' }) + arrow(175, y, 268, y, null, acc ? 'lna' : 'ln') +
    '<rect class="' + (acc ? 'accw' : 'card') + '" x="275" y="' + (y - 21) + '" width="90" height="42" rx="9" style="stroke:' + (acc ? 'var(--s-acc)' : 'var(--s-ink)') + ';stroke-width:1.5"/>' +
    T(320, y, 'ℒ', { cls: acc ? 'ta' : 't', fs: 17, dy: '.35em' }) + arrow(372, y, 455, y, null, acc ? 'lna' : 'ln') + T(530, y, r, { cls: acc ? 'ta' : 't', fs: 14, dy: '.35em' }));
  const S12 = {
    t: '線性：像一台果汁機', en: 'LINEARITY',
    svg: row(118, 'f（蘋果）', 'F（蘋果汁）', 'r1') + row(180, 'g（香蕉）', 'G（香蕉汁）', 'r2') +
      '<line class="ln dsh" x1="70" y1="215" x2="570" y2="215"' + k('sep') + '/>' +
      row(252, '2f + 3g', '2F + 3G', 'r3', true) +
      chip(320, 305, 'ℒ(af + bg) = aF + bG', '可以拆開各自算，再加回來', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '新觀念：<b>線性</b>。想像一台果汁機：放一顆蘋果，打出一杯蘋果汁。', on: 'r1' },
      { sub: '放一根香蕉，打出一杯香蕉汁。', on: 'r2' },
      { sub: '那「2 顆蘋果 + 3 根香蕉」一起打？就是 2 杯蘋果汁 + 3 杯香蕉汁，不會多出怪東西。', on: 'sep r3' },
      { sub: 'ℒ 就是這種機器。所以一長串加減的函數，可以<b>拆開、各自查表、再加回來</b>。', on: 'c' }
    ]
  };

  /* ════════════ 13 拆開查表 ════════════ */
  const S13 = {
    t: '拆開、查表、加回來', en: 'SPLIT &amp; LOOK UP',
    svg: T(320, 110, 'ℒ(2u(t) + 4 + e<sup>2t</sup>)', { fs: 22, k: 'q' }) +
      g('pc', box(140, 178, 150, 44, '2·ℒ(u) = 2/s', null, false, 14) + box(320, 178, 150, 44, '4·ℒ(1) = 4/s', null, false, 14) +
        box(500, 178, 170, 44, 'ℒ(e<sup>2t</sup>) = 1/(s − 2)', null, false, 14)) +
      T(320, 248, '= 6/s + 1/(s − 2)', { cls: 'ta', fs: 24, k: 'ans' }) +
      chip(320, 302, '常數 4 也要轉：4 = 4·1 → 4/s', '最常漏掉的一步', 'c', { fs: 13 }),
    steps: [
      { sub: '老師的例題：ℒ(2u(t) + 4 + e<sup>2t</sup>)。', on: 'q' },
      { sub: '用線性拆成三塊，<b>每一塊各查一張卡</b>。', on: 'pc' },
      { sub: '2/s 和 4/s 可以合併成 6/s。答案出來了。', on: 'ans' },
      { sub: '注意：常數 4 也要轉成 4/s，不能直接寫 4。', on: 'c' }
    ]
  };

  /* ════════════ 14 ℒ⁻¹：倒著查字典 ════════════ */
  const S14 = {
    t: 'ℒ⁻¹：字典倒著查', en: 'INVERSE TRANSFORM',
    svg: chip(320, 108, '字典可以中翻英，也可以英翻中', 'ℒ⁻¹ 就是從 s 翻回 t', 'c', { fs: 13 }) +
      g('tb', box(190, 170, 150, 40, 'u(t)、1', null, false, 15) + box(450, 170, 150, 40, '1/s', null, true, 15) +
        box(190, 222, 150, 40, 'e<sup>at</sup>', null, false, 15) + box(450, 222, 150, 40, '1/(s − a)', null, true, 15)) +
      arrow(370, 196, 270, 196, 'back', 'lna') + T(320, 186, 'ℒ⁻¹', { cls: 'ta', fs: 13, k: 'backL' }) +
      T(320, 290, 'ℒ⁻¹( 2/s − 4/(s − 2) ) = 2u(t) − 4e<sup>2t</sup>', { cls: 'ta', fs: 18, k: 'ex' }),
    steps: [
      { sub: '反過來：已經有 F(s)，想找回 f(t)？這叫 <b>ℒ⁻¹（反拉普拉斯轉換）</b>。', on: 'c tb' },
      { sub: '就像字典倒著查：在右邊找到長得一樣的，翻回左邊。', on: 'back backL' },
      { sub: '例題：2/s 翻回 2u(t)，4/(s − 2) 翻回 4e<sup>2t</sup>。', on: 'ex' }
    ]
  };

  /* ════════════ 15 迴力鏢 ════════════ */
  const S15 = {
    t: '聰明方法：cos 是迴力鏢', en: 'THE SMART WAY',
    svg: T(250, 112, 'f = cos ωt', { fs: 20, k: 'a1' }) +
      T(250, 162, 'f′ = −ω sin ωt', { fs: 20, k: 'a2' }) +
      T(250, 212, 'f″ = −ω² cos ωt = −ω² f', { cls: 'ta', fs: 20, k: 'a3' }) +
      g('bm', '<path class="lna" style="fill:none;stroke-width:2.2" d="M420 212 C 520 205, 520 115, 345 112"/>' +
        '<polyline class="lna" style="fill:none;stroke-width:2.2" points="356,104 345,112 357,120"/>') +
      chip(320, 290, '像迴力鏢：微兩次，飛回自己', '只是多了 −ω²', 'c', { fs: 13, acc: true }),
    steps: [
      { sub: '接下來是 cos ωt。直接積分要分部積分兩次，老師說：<b>不要做</b>。', on: 'a1' },
      { sub: '先微一次：變成 sin。', on: 'a2' },
      { sub: '再微一次：<b>又變回 cos</b>，只是多了 −ω²。', on: 'a3' },
      { sub: '像迴力鏢，微兩次就飛回自己。<b>這個特性就是聰明方法的關鍵</b>。', on: 'bm c' }
    ]
  };

  /* ════════════ 16 解出 cos、sin ════════════ */
  const S16 = {
    t: '兩邊取 ℒ，一行解出來', en: 'COS &amp; SIN',
    svg: T(320, 108, 'ℒ(f″) = −ω² ℒ(f)', { fs: 20, k: 'a1' }) +
      T(320, 152, 's²F − s·1 − 0 = −ω²F', { fs: 20, k: 'a2' }) +
      T(320, 196, '(s² + ω²) F = s', { fs: 20, k: 'a3' }) +
      box(195, 266, 240, 48, 'ℒ(cos ωt) = s/(s² + ω²)', 'cc', true, 15) +
      box(450, 266, 240, 48, 'ℒ(sin ωt) = ω/(s² + ω²)', 'ss', true, 15),
    steps: [
      { sub: '把「f″ = −ω²f」兩邊丟進翻譯機：左邊用爬樓梯公式，右邊用線性。', on: 'a1' },
      { sub: '代進初始值 f(0) = cos 0 = 1、f′(0) = 0。', on: 'a2' },
      { sub: '把 F 移到同一邊、除過去：<b>ℒ(cos ωt) = s/(s² + ω²)</b>。完全沒有積分！', on: 'a3 cc' },
      { sub: 'sin ωt 用同一招，只是初始值換成 0 和 ω：<b>ω/(s² + ω²)</b>。', on: 'ss' }
    ]
  };

  /* ════════════ 17 削鉛筆 ════════════ */
  const seq = ['t⁵', '5t⁴', '20t³', '60t²', '120t', '120'];
  const S17 = {
    t: 'tⁿ：削鉛筆', en: 'SHARPENING tⁿ',
    svg: seq.map((s, i) => box(70 + i * 100, 140, 78, 42, s, 'd' + i, i === 5, 15) + (i ? arrow(70 + (i - 1) * 100 + 40, 140, 70 + i * 100 - 41, 140, 'w' + i, 'ln') : '')).join('') +
      chip(320, 215, '每微一次削掉一截，最後剩常數', 't⁵ 微 5 次 = 5! = 120', 'c1', { fs: 13 }) +
      T(320, 285, 's⁵F(s) = 120/s　⇒　F(s) = 120/s⁶', { cls: 'ta', fs: 19, k: 'res' }),
    steps: [
      { sub: '最後回到謎題的 t⁵。它也能用聰明方法。', on: 'd0' },
      { sub: '每微一次，次方少 1，像<b>削鉛筆</b>，一次削掉一截。', on: 'w1 d1 w2 d2 w3 d3 w4 d4' },
      { sub: '微 5 次，t 不見了，只剩常數 <b>5! = 120</b>。初始值也全部是 0。', on: 'w5 d5 c1' },
      { sub: '爬 5 階的公式：s⁵F(s) = ℒ(120) = 120/s，除過去就好。', on: 'res' }
    ]
  };

  /* ════════════ 18 先整理一下：5 張卡 ════════════ */
  const cards = ['u(t)、1　→　1/s', 'e<sup>at</sup>　→　1/(s − a)', 'cos ωt　→　s/(s² + ω²)', 'sin ωt　→　ω/(s² + ω²)', 'tⁿ　→　n!/s<sup>n+1</sup>'];
  const S18 = {
    t: '先整理一下：5 張查表卡', en: 'SUMMARY 2',
    svg: cards.map((c, i) => box(320, 108 + i * 46, 320, 38, c, 'k' + (i + 1), i >= 2, 15)).join(''),
    steps: [
      { sub: '先整理一下。這一章做出了 5 張查表卡。前兩張是<b>直接積分</b>來的。', on: 'k1 k2' },
      { sub: '後三張是<b>聰明方法</b>：微幾次變回自己、或變成常數，再取 ℒ。', on: 'k3 k4 k5' },
      { sub: '加上線性「拆開、查表、加回來」，ℒ 和 ℒ⁻¹ 的題目就都會算了。' }
    ]
  };

  /* ════════════ 19 恍然大悟 ════════════ */
  const S19 = {
    t: '回到謎題', en: 'SOLVED',
    svg: T(320, 108, 'ℒ(t⁵) = ?', { fs: 30, k: 'q' }) +
      T(320, 158, '查第 5 張卡，n = 5 → 5!/s⁶', { fs: 20, k: 'a1' }) +
      T(320, 208, '= 120/s⁶', { cls: 'ta', fs: 32, k: 'a2' }) +
      chip(320, 258, '一行解決，不用分部積分 5 次', '謎題解開了', 'c', { fs: 14, acc: true }) +
      chip(320, 258, '下一步：用這些卡片解微分方程', '翻到 s 世界 → 解一次方程 → 查表翻回來', 'nx', { fs: 13 }),
    steps: [
      { sub: '回到開頭的謎題：ℒ(t⁵)。', on: 'q' },
      { sub: '直接查第 5 張卡：tⁿ → n!/s<sup>n+1</sup>，n = 5。', on: 'a1' },
      { sub: '5! = 120，答案 <b>120/s⁶</b>。不用分部積分 5 次，<b>謎題解開了</b>。', on: 'a2 c' },
      { sub: '下一步：拿這些卡片去解微分方程 —— 翻到 s 世界、解完、再查表翻回來。', off: 'c', on: 'nx' }
    ]
  };

  window.__laplace2Story = window.__Story('#story', {
    id: 'math-laplace2', title: '拉普拉斯轉換 2', after: '#map',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19]
  });
})();
