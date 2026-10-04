/* ============================================================
   電子學 第一次期中考複習（10/5）—— 老師範例：半導體整合計算題組
   本質矽 → 摻雜 → 多數／少數載子 → 漂移電流密度 → pn 接面 V_bi → 逆偏接面電容
   - 上方「改數字」面板：T、N_a、N_d、E、V_R、C_j0 一改，五題的題目、詳解、答案整條鏈一起重算
   - 每題是一張 .xb-card.is-pp（學習紀錄／錯題本自動收），手寫板用 __ANN.pad
   - 常數照老師題目：k = 86×10⁻⁶ eV/K、E_g = 1.10 eV、B = 5.23×10¹⁵、q = 1.60×10⁻¹⁹ C
   - 跟參考解答一樣：前一步的結果四捨五入到 3 位有效數字再帶進下一步（nᵢ = 1.50×10¹⁰、V_bi = 0.692 V）
   ============================================================ */
(function () {
  'use strict';
  const E = window.__EE;
  const { C, Stage, label, labelCJK, lerp, clamp, sci } = E;
  const K = 86e-6, B = 5.23e15, EG = 1.10, Q = 1.6e-19, MUN = 1350, MUP = 480;
  const ORIG = { T: 300, Na: 1e16, Nd: 8e15, E: 100, VR: 5, Cj0: 0.5 };
  const DOPES = [1e14, 2e14, 5e14, 1e15, 2e15, 5e15, 8e15, 1e16, 2e16, 5e16, 1e17, 2e17, 5e17, 1e18];
  const FIELDS = [10, 20, 50, 100, 200, 500, 1000];
  const st = Object.assign({}, ORIG);
  const r3 = x => +x.toPrecision(3);
  const f = (x, d) => (+x).toFixed(d === undefined ? 3 : d);
  const s3 = x => sci(x, 2);              /* 1.50×10¹⁰ */
  const nice = x => (x >= 0.01 && x < 1e4 ? (+x.toPrecision(4)).toString() : s3(x));
  const changed = () => Object.keys(ORIG).some(k => st[k] !== ORIG[k]);

  function compute() {
    const c = {};
    c.T = st.T; c.T15 = Math.pow(st.T, 1.5); c.arg = -EG / (2 * K * st.T); c.ex = Math.exp(c.arg);
    c.niRaw = B * c.T15 * c.ex; c.ni = r3(c.niRaw); c.ni2 = c.ni * c.ni;
    c.VT = 0.026 * st.T / 300;
    const maj = N => (N / c.ni >= 100 ? N : N / 2 + Math.sqrt(N * N / 4 + c.ni2));
    c.rA = st.Na / c.ni; c.rD = st.Nd / c.ni;
    c.pp0 = maj(st.Na); c.np0 = c.ni2 / c.pp0;
    c.nn0 = maj(st.Nd); c.pn0 = c.ni2 / c.nn0;
    c.JnP = Q * c.np0 * MUN * st.E; c.JpP = Q * c.pp0 * MUP * st.E; c.JP = c.JnP + c.JpP;
    c.JnN = Q * c.nn0 * MUN * st.E; c.JpN = Q * c.pn0 * MUP * st.E; c.JN = c.JnN + c.JpN;
    c.sP = c.JP / st.E; c.sN = c.JN / st.E;
    c.ratio = st.Na * st.Nd / c.ni2; c.ln = Math.log(c.ratio); c.VbiRaw = c.VT * c.ln; c.Vbi = r3(c.VbiRaw);
    c.vr = st.VR / c.Vbi; c.one = 1 + c.vr; c.sq = Math.sqrt(c.one); c.Cj = st.Cj0 / c.sq;
    c.xn = st.Na / (st.Na + st.Nd); /* N 側占 W 的比例 */
    return c;
  }
  let c = compute();

  /* ---------------- 五題 ---------------- */
  const QS = [
    { id: 'q1', sec: 'q1', no: 1, title: '本質載子濃度 nᵢ',
      q: () => '利用本質載子濃度公式，計算矽在 <b>T = ' + st.T + ' K</b> 時的本質載子濃度 nᵢ（單位 cm⁻³）。請列出代入過程。',
      hint: () => '拆成三個因子分開算：T<sup>3/2</sup>、指數 −E<sub>g</sub>/(2kT)、e 的次方，最後三個相乘。',
      steps: () => [
        { t: '寫出公式。', eq: 'nᵢ = B · T<sup>3/2</sup> · e<sup>−E<sub>g</sub>/(2kT)</sup>', why: '題目給的關係式。三個因子分開算，按計算機比較不會按錯。' },
        { t: '算 T<sup>3/2</sup>。', eq: st.T + '<sup>3/2</sup> = ' + st.T + ' × √' + st.T + ' = ' + f(c.T15, 2), why: 'x<sup>3/2</sup> = x·√x，先開根號再乘回去。' },
        { t: '算指數。', eq: '−E<sub>g</sub>/(2kT) = −1.10 / (2 × 86×10⁻⁶ × ' + st.T + ') = ' + f(c.arg, 3), why: 'E<sub>g</sub> 用 eV、k 用 eV/K，單位剛好消掉。<b>分母的 2 不要漏</b>，漏掉會差到十個數量級。' },
        { t: '算 e 的次方。', eq: 'e<sup>' + f(c.arg, 3) + '</sup> = ' + s3(c.ex), why: '指數每差 1，結果就差 e ≈ 2.7 倍，所以上一步要算準一點。' },
        { t: '三個相乘。', eq: 'nᵢ = 5.23×10¹⁵ × ' + f(c.T15, 2) + ' × ' + s3(c.ex) + ' = ' + s3(c.niRaw) + ' ≈ <b>' + s3(c.ni) + ' cm⁻³</b>',
          why: st.T === 300 ? '本質矽裡電子、電洞一樣多：n₀ = p₀ = nᵢ。這個 1.50×10¹⁰ 就是之後每一步的基準。'
            : '溫度 ' + st.T + ' K 時 nᵢ 是 300 K（1.50×10¹⁰）的 ' + nice(c.ni / 1.5e10) + ' 倍 —— 溫度只改一點，指數項就讓 nᵢ 差很多。' }
      ],
      ans: () => 'nᵢ ≈ ' + s3(c.ni) + ' cm⁻³（本質矽 n₀ = p₀ = nᵢ）' },

    { id: 'q2', sec: 'q2', no: 2, title: '摻雜後的多數與少數載子', fig: 'cv-conc',
      q: () => '(a) P 型（N<sub>a</sub> = ' + s3(st.Na) + ' cm⁻³）的多數載子電洞濃度 p<sub>p0</sub> 與少數載子電子濃度 n<sub>p0</sub>。<br>' +
        '(b) N 型（N<sub>d</sub> = ' + s3(st.Nd) + ' cm⁻³）的多數載子電子濃度 n<sub>n0</sub> 與少數載子電洞濃度 p<sub>n0</sub>。',
      hint: () => '多數載子 ≈ 摻雜濃度；少數載子用質量作用定律 n₀p₀ = nᵢ² 反推。',
      steps: () => {
        const okA = c.rA >= 100, okD = c.rD >= 100;
        return [
          { t: '先算 nᵢ²。', eq: 'nᵢ² = (' + s3(c.ni) + ')² = ' + s3(c.ni2) + ' cm⁻⁶', why: '等一下兩邊的少數載子都要用到。單位是 cm⁻⁶（濃度的平方）。' },
          { t: '(a) P 型的多數載子：電洞。', eq: 'p<sub>p0</sub> ' + (okA ? '≈ N<sub>a</sub> = ' : '= N<sub>a</sub>/2 + √((N<sub>a</sub>/2)² + nᵢ²) = ') + s3(c.pp0) + ' cm⁻³',
            why: okA ? '每顆硼收一個電子、留下一個電洞。N<sub>a</sub> 是 nᵢ 的 ' + s3(c.rA) + ' 倍，熱產生的那一點點可以忽略。'
              : '<b>注意：</b>N<sub>a</sub> 只比 nᵢ 大 ' + nice(c.rA) + ' 倍，「p ≈ N<sub>a</sub>」不夠準，要用電中性＋質量作用定律解二次方程式。' },
          { t: '(a) P 型的少數載子：電子。', eq: 'n<sub>p0</sub> = nᵢ² / p<sub>p0</sub> = ' + s3(c.ni2) + ' / ' + s3(c.pp0) + ' = <b>' + s3(c.np0) + ' cm⁻³</b>', why: '熱平衡時 n₀p₀ = nᵢ²：電洞多了，電子就跟著變少（翹翹板）。' },
          { t: '(b) N 型的多數載子：電子。', eq: 'n<sub>n0</sub> ' + (okD ? '≈ N<sub>d</sub> = ' : '= N<sub>d</sub>/2 + √((N<sub>d</sub>/2)² + nᵢ²) = ') + s3(c.nn0) + ' cm⁻³',
            why: okD ? '每顆磷放出一個自由電子。N<sub>d</sub> 是 nᵢ 的 ' + s3(c.rD) + ' 倍。' : '<b>注意：</b>N<sub>d</sub> 只比 nᵢ 大 ' + nice(c.rD) + ' 倍，近似不夠準，用二次方程式的解。' },
          { t: '(b) N 型的少數載子：電洞。', eq: 'p<sub>n0</sub> = nᵢ² / n<sub>n0</sub> = ' + s3(c.ni2) + ' / ' + s3(c.nn0) + ' = <b>' + s3(c.pn0) + ' cm⁻³</b>',
            why: '多數跟少數差了 ' + Math.round(Math.log10(c.nn0 / c.pn0)) + ' 個數量級。' + (st.Na > st.Nd ? 'P 型摻得比較重，所以 P 型的少數載子（' + s3(c.np0) + '）比 N 型的（' + s3(c.pn0) + '）少。' : st.Na < st.Nd ? 'N 型摻得比較重，所以 N 型的少數載子比較少。' : '兩邊摻一樣多，少數載子也一樣多。') }
        ];
      },
      ans: () => '(a) p<sub>p0</sub> = ' + s3(c.pp0) + '、n<sub>p0</sub> = ' + s3(c.np0) + ' cm⁻³　(b) n<sub>n0</sub> = ' + s3(c.nn0) + '、p<sub>n0</sub> = ' + s3(c.pn0) + ' cm⁻³' },

    { id: 'q3', sec: 'q3', no: 3, title: '漂移電流密度（接合前）',
      q: () => '兩塊半導體尚未接合，各加 <b>E = ' + st.E + ' V/cm</b> 的均勻電場。用 J = q(nμ<sub>n</sub> + pμ<sub>p</sub>)E（μ<sub>n</sub> = 1350、μ<sub>p</sub> = 480 cm²/V·s）計算：<br>' +
        '(a) P 型的漂移電流密度 J<sub>P</sub>，主要由哪種載子貢獻？　(b) N 型的 J<sub>N</sub>，主要由哪種載子貢獻？',
      hint: () => '電子那項、電洞那項分開算，再比大小。用第 2 題的濃度。',
      steps: () => [
        { t: '寫出公式，拆成兩項。', eq: 'J = q·n·μ<sub>n</sub>·E（電子）＋ q·p·μ<sub>p</sub>·E（電洞）', why: '兩種載子都被電場推、電流方向都順著電場，所以是相加。' },
        { t: '(a) P 型：電子那項。', eq: '1.6×10⁻¹⁹ × ' + s3(c.np0) + ' × 1350 × ' + st.E + ' = ' + s3(c.JnP) + ' A/cm²', why: '電子在 P 型是少數載子，數量少到這項幾乎是 0。' },
        { t: '(a) P 型：電洞那項。', eq: '1.6×10⁻¹⁹ × ' + s3(c.pp0) + ' × 480 × ' + st.E + ' = <b>' + nice(c.JpP) + ' A/cm²</b>', why: '電洞是多數載子，電流幾乎全靠它：J<sub>P</sub> ≈ q·p·μ<sub>p</sub>·E。' },
        { t: '(b) N 型：電子那項。', eq: '1.6×10⁻¹⁹ × ' + s3(c.nn0) + ' × 1350 × ' + st.E + ' = <b>' + nice(c.JnN) + ' A/cm²</b>', why: '電子是 N 型的多數載子：J<sub>N</sub> ≈ q·n·μ<sub>n</sub>·E。' },
        { t: '(b) N 型：電洞那項。', eq: '1.6×10⁻¹⁹ × ' + s3(c.pn0) + ' × 480 × ' + st.E + ' = ' + s3(c.JpN) + ' A/cm²', why: '少數載子的貢獻小到可以忽略（不是 0，但差了二十幾個數量級）。' },
        { t: '比較兩塊。', eq: 'J<sub>N</sub> / J<sub>P</sub> = ' + nice(c.JN / c.JP) + '　（σ<sub>P</sub> = ' + nice(c.sP) + '、σ<sub>N</sub> = ' + nice(c.sN) + ' (Ω·cm)⁻¹）',
          why: c.JN > c.JP ? (st.Nd <= st.Na ? 'N 型摻得比較少，電流卻比較大 —— 因為電子的移動率是電洞的 2.8 倍（1350 vs 480）。' : 'N 型摻得多、電子又跑得快，電流大很多。')
            : 'P 型摻得夠多，多到蓋過電洞移動率比較小的劣勢。' }
      ],
      ans: () => '(a) J<sub>P</sub> ≈ ' + nice(c.JP) + ' A/cm²（主要是電洞）　(b) J<sub>N</sub> ≈ ' + nice(c.JN) + ' A/cm²（主要是電子）' },

    { id: 'q4', sec: 'q4', no: 4, title: 'pn 接面內建電壓 V<sub>bi</sub>',
      q: () => '把上面的 P 型與 N 型接成<button class="tm" data-t="突變接面">突變</button> pn 接面，不加偏壓、達熱平衡時，計算內建電壓 V<sub>bi</sub>（V<sub>T</sub> = ' + f(c.VT, 4).replace(/0+$/, '') + ' V）。',
      hint: () => '先算 ln 裡面的比值 N<sub>a</sub>N<sub>d</sub>/nᵢ²，再取<b>自然對數</b>，最後乘 V<sub>T</sub>。',
      steps: () => [
        { t: '寫出公式。', eq: 'V<sub>bi</sub> = V<sub>T</sub> · ln(N<sub>a</sub>N<sub>d</sub> / nᵢ²)', why: '兩邊多數載子濃度差越大，擴散越兇，要越大的坡才擋得住。' },
        { t: '算括號裡的比值。', eq: '(' + s3(st.Na) + ' × ' + s3(st.Nd) + ') / ' + s3(c.ni2) + ' = ' + s3(c.ratio), why: '用第 2 題算過的 nᵢ²。' },
        { t: '取自然對數。', eq: 'ln(' + s3(c.ratio) + ') = ' + f(c.ln, 2), why: '是 <b>ln</b>（以 e 為底），不是 log。用 log 會得到 ' + f(Math.log10(c.ratio), 2) + '，答案變成 ' + f(c.VT * Math.log10(c.ratio), 2) + ' V，錯。' },
        { t: '乘上 V<sub>T</sub>。', eq: 'V<sub>bi</sub> = ' + f(c.VT, 4).replace(/0+$/, '') + ' × ' + f(c.ln, 2) + ' = ' + f(c.VbiRaw, 4) + ' ≈ <b>' + c.Vbi + ' V</b>',
          why: c.Vbi > 0.6 && c.Vbi < 0.85 ? '矽的 V<sub>bi</sub> 通常在 0.6～0.8 V，合理。擴散留下的離子形成電場，坡高就是這個值。'
            : c.Vbi <= 0.6 ? '摻雜比較淡（或溫度高、nᵢ 大），坡比較矮。' : '摻雜很濃，坡比較高。摻雜放大 10 倍，V<sub>bi</sub> 只多約 0.06 V（ln 長得很慢）。' }
      ],
      ans: () => 'V<sub>bi</sub> ≈ ' + c.Vbi + ' V' },

    { id: 'q5', sec: 'q5', no: 5, title: '逆向偏壓下的接面電容', fig: 'cv-cj',
      q: () => '(a) 加 <b>V<sub>R</sub> = ' + st.VR + ' V</b> 的逆向偏壓，已知 V<sub>R</sub> = 0 時 C<sub>j0</sub> = ' + st.Cj0 + ' pF，求接面電容 C<sub>j</sub>。<br>(b) 簡述 V<sub>R</sub> 增加時，空乏區寬度 W 與 C<sub>j</sub> 怎麼變。',
      hint: () => '用第 4 題的 V<sub>bi</sub>。指數 −1/2 = 除以根號。',
      steps: () => [
        { t: '寫出公式。', eq: 'C<sub>j</sub> = C<sub>j0</sub> (1 + V<sub>R</sub>/V<sub>bi</sub>)<sup>−1/2</sup>', why: '負的 1/2 次方：括號越大，電容越小。' },
        { t: '算 V<sub>R</sub>/V<sub>bi</sub>。', eq: st.VR + ' / ' + c.Vbi + ' = ' + f(c.vr, 2), why: 'V<sub>R</sub> 代正值（題目已經說是逆偏）。' },
        { t: '加 1、開根號。', eq: '√(1 + ' + f(c.vr, 2) + ') = √' + f(c.one, 2) + ' = ' + f(c.sq, 3), why: '(…)<sup>−1/2</sup> 就是 1/√(…)。' },
        { t: '算 C<sub>j</sub>。', eq: 'C<sub>j</sub> = ' + st.Cj0 + ' / ' + f(c.sq, 3) + ' = <b>' + f(c.Cj, 3) + ' pF</b>', why: st.VR === 0 ? 'V<sub>R</sub> = 0 時就是 C<sub>j0</sub> 本身。' : '從 ' + st.Cj0 + ' pF 降到 ' + f(c.Cj, 3) + ' pF，剩 ' + Math.round(c.Cj / st.Cj0 * 100) + '%。' },
        { t: '(b) 趨勢：為什麼會變小。', eq: 'V<sub>R</sub>↑ → 要露出更多離子才擋得住 → W↑（W ∝ √(V<sub>bi</sub> + V<sub>R</sub>)）→ C<sub>j</sub> ≈ εA/W ↓',
          why: '空乏區像電容中間的絕緣層、兩側像極板。逆偏把極板拉開，所以電容變小。這裡 W 變成原本的 ' + f(c.sq, 2) + ' 倍。' }
      ],
      ans: () => '(a) C<sub>j</sub> ≈ ' + f(c.Cj, 3) + ' pF　(b) V<sub>R</sub>↑ → W↑ → C<sub>j</sub>↓' }
  ];

  const cards = {};
  function stepsHTML(list) {
    return list.map((s, i) => '<li data-i="' + i + '"><b>' + s.t + '</b><span class="d-eq">' + s.eq + '</span>' + (s.why ? '<div class="why">' + s.why + '</div>' : '') + '</li>').join('');
  }
  function build(qd) {
    const host = document.getElementById('card-' + qd.id); if (!host) return;
    const el = document.createElement('article');
    el.className = 'xb-card is-pp mt-card'; el.id = 'xb-mt1-' + qd.id;
    el.innerHTML = '<header class="xb-head"><span class="xb-tag teacher">老師範例 · 第 ' + qd.no + ' 題</span><b>' + qd.title + '</b></header>' +
      '<div class="xb-q"></div><p class="mt-changed" hidden>你改過數字了，答案跟老師的參考解答不同；按上面的「↺ 回到老師原題」可以還原。</p>' +
      (qd.fig ? '<div class="stage-wrap mt-fig"><canvas id="' + qd.fig + '"></canvas></div>' : '') +
      '<div class="pad"></div>' +
      '<div class="xb-act"><button class="btn" data-a="hint" type="button">💡 提示</button><button class="btn solid" data-a="next" type="button">看下一步 ▸</button>' +
      '<button class="btn" data-a="sol" type="button">全部展開</button><button class="btn" data-a="reset" type="button">收起</button><span class="xb-prog"></span></div>' +
      '<div class="xb-hint" hidden></div><ol class="xb-steps"></ol>' +
      '<div class="xb-ans" hidden><b>答案：</b><span class="mt-a"></span>' +
      '<div class="xb-self">我自己這次：<button type="button" data-s="1">✓ 算對了</button><button type="button" data-s="0">✗ 算錯了</button></div></div>';
    host.appendChild(el);
    const card = { el, qd, n: 0 };
    cards[qd.id] = card;
    el.querySelector('.xb-act').addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      const a = b.dataset.a, total = el.querySelectorAll('.xb-steps > li').length;
      if (a === 'hint') { const h = el.querySelector('.xb-hint'); h.hidden = !h.hidden; b.classList.toggle('on', !h.hidden); return; }
      card.n = a === 'next' ? Math.min(total, card.n + 1) : a === 'sol' ? total : 0;
      show(card);
    });
    if (window.__ANN && window.__ANN.pad) window.__ANN.pad(el.querySelector('.pad'), 'mt1-' + qd.id);
    else if (window.__PAD) window.__PAD.mount(el.querySelector('.pad'), 'mt1-' + qd.id);
  }
  function show(card) {
    const el = card.el, lis = el.querySelectorAll('.xb-steps > li'), done = card.n >= lis.length;
    lis.forEach((li, i) => { li.hidden = i >= card.n; });
    el.querySelector('.xb-ans').hidden = !done;
    el.querySelector('[data-a="next"]').hidden = done;
    el.querySelector('.xb-prog').textContent = done ? '' : '第 ' + card.n + ' / ' + lis.length + ' 步';
  }
  function fill() {
    c = compute();
    QS.forEach(qd => {
      const card = cards[qd.id]; if (!card) return;
      const el = card.el;
      el.querySelector('.xb-q').innerHTML = qd.q();
      el.querySelector('.xb-hint').innerHTML = '<b>提示：</b>' + qd.hint();
      el.querySelector('.xb-steps').innerHTML = stepsHTML(qd.steps());
      el.querySelector('.mt-a').innerHTML = qd.ans();
      el.querySelector('.mt-changed').hidden = !changed();
      show(card);
    });
    /* 總覽的因果鏈 */
    const set = (id, h) => { const x = document.getElementById(id); if (x) x.innerHTML = h; };
    set('ch-ni', s3(c.ni)); set('ch-p', 'p<sub>p0</sub> ' + s3(c.pp0) + '<br>n<sub>p0</sub> ' + s3(c.np0));
    set('ch-n', 'n<sub>n0</sub> ' + s3(c.nn0) + '<br>p<sub>n0</sub> ' + s3(c.pn0));
    set('ch-j', 'J<sub>P</sub> ' + nice(c.JP) + '<br>J<sub>N</sub> ' + nice(c.JN));
    set('ch-vbi', c.Vbi + ' V'); set('ch-cj', f(c.Cj, 3) + ' pF');
    const note = document.getElementById('mt-note');
    if (note) note.innerHTML = changed() ? '目前是<b>你改過的數字</b>，五題的題目、詳解、答案都已經跟著重算。' : '目前是<b>老師原題</b>的數字，答案可以對參考解答。';
    if (conc) conc.redraw(); if (cj) cj.redraw();
    if (window.__EE.wireTerms) window.__EE.wireTerms();
  }

  /* ---------------- 改數字面板 ---------------- */
  function idxOf(arr, v) { let b = 0; arr.forEach((x, i) => { if (Math.abs(Math.log(x / v)) < Math.abs(Math.log(arr[b] / v))) b = i; }); return b; }
  const ctl = [
    ['mt-T', () => st.T, v => { st.T = v; }, v => v + ' K'],
    ['mt-Na', () => idxOf(DOPES, st.Na), v => { st.Na = DOPES[v]; }, v => s3(DOPES[v]) + ' cm⁻³'],
    ['mt-Nd', () => idxOf(DOPES, st.Nd), v => { st.Nd = DOPES[v]; }, v => s3(DOPES[v]) + ' cm⁻³'],
    ['mt-E', () => idxOf(FIELDS, st.E), v => { st.E = FIELDS[v]; }, v => FIELDS[v] + ' V/cm'],
    ['mt-VR', () => st.VR, v => { st.VR = v; }, v => v + ' V'],
    ['mt-Cj0', () => st.Cj0, v => { st.Cj0 = v; }, v => v.toFixed(2) + ' pF']
  ];
  function syncCtl() {
    ctl.forEach(([id, get, , fmt]) => { const el = document.getElementById(id); if (!el) return; el.value = get(); const o = document.querySelector('output[for="' + id + '"]'); if (o) o.textContent = fmt(+el.value); });
  }
  ctl.forEach(([id, , setv, fmt]) => {
    const el = document.getElementById(id); if (!el) return;
    el.addEventListener('input', () => { setv(+el.value); const o = document.querySelector('output[for="' + id + '"]'); if (o) o.textContent = fmt(+el.value); fill(); });
  });
  const rb = document.getElementById('mt-reset');
  if (rb) rb.addEventListener('click', () => { Object.assign(st, ORIG); syncCtl(); fill(); });

  /* ---------------- 圖：四個濃度（對數長度） ---------------- */
  let conc = null, cj = null;
  QS.forEach(build);
  const cvC = document.getElementById('cv-conc');
  if (cvC) conc = Stage(cvC, { animate: false, ratio: 0.34, minH: 170, maxH: 230, draw(ctx, w, h) {
    const x0 = w * 0.2, x1 = w * 0.95, lo = 2, hi = 19;
    const X = v => lerp(x0, x1, clamp((Math.log10(Math.max(v, 1)) - lo) / (hi - lo), 0, 1));
    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    for (let kx = lo; kx <= hi; kx += (w < 520 ? 4 : 2)) {
      const x = X(Math.pow(10, kx)); ctx.beginPath(); ctx.moveTo(x, h * 0.08); ctx.lineTo(x, h * 0.8); ctx.stroke();
      label(ctx, x, h * 0.9, '10' + E.sup(kx), C['ink-3'], 9.5);
    }
    const rows = [['nᵢ', c.ni, C['ink-3']], ['P 型 電洞', c.pp0, C.hole], ['P 型 電子', c.np0, C.accent], ['N 型 電子', c.nn0, C.accent], ['N 型 電洞', c.pn0, C.hole]];
    rows.forEach(([nm, v, col], i) => {
      const y = lerp(h * 0.14, h * 0.74, i / (rows.length - 1));
      ctx.fillStyle = col; ctx.globalAlpha = /電子|電洞/.test(nm) && (nm.indexOf('P 型 電子') === 0 || nm.indexOf('N 型 電洞') === 0) ? 0.45 : 0.9;
      ctx.fillRect(x0, y - 6, Math.max(2, X(v) - x0), 12); ctx.globalAlpha = 1;
      labelCJK(ctx, x0 - 8, y, nm, col, 11.5, 'right', '600');
    });
    labelCJK(ctx, x1, h * 0.985, '長度 = 數量級：少數載子跟多數差了十幾格', C['ink-3'], 10.5, 'right');
  }});

  /* ---------------- 圖：C_j 隨 V_R ---------------- */
  const cvJ = document.getElementById('cv-cj');
  if (cvJ) cj = Stage(cvJ, { animate: false, ratio: 0.36, minH: 180, maxH: 240, draw(ctx, w, h) {
    const x0 = w * 0.13, x1 = w * 0.95, y0 = h * 0.1, y1 = h * 0.78, vmax = 20;
    const X = v => lerp(x0, x1, v / vmax), Y = cc => lerp(y1, y0, cc / Math.max(0.1, st.Cj0));
    ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    [0, 5, 10, 15, 20].forEach(v => label(ctx, X(v), y1 + 13, v + ' V', C['ink-3'], 10));
    label(ctx, x0 - 6, Y(st.Cj0), st.Cj0.toFixed(2), C['ink-3'], 10, 'right');
    label(ctx, x0 - 6, Y(st.Cj0 / 2), (st.Cj0 / 2).toFixed(2), C['ink-3'], 10, 'right');
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i <= 80; i++) { const v = vmax * i / 80, y = Y(st.Cj0 / Math.sqrt(1 + v / c.Vbi)); i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y); }
    ctx.stroke();
    const px = X(Math.min(vmax, st.VR)), py = Y(c.Cj);
    ctx.setLineDash([4, 4]); ctx.strokeStyle = C['ink-3']; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, y1); ctx.lineTo(px, py); ctx.lineTo(x0, py); ctx.stroke(); ctx.setLineDash([]);
    E.disc(ctx, px, py, 5.5, C.accent, C.surface);
    labelCJK(ctx, px + (st.VR > 13 ? -10 : 10), py - 14, '接面電容 ' + f(c.Cj, 3) + ' pF', C.accent, 12, st.VR > 13 ? 'right' : 'left', '700');
    labelCJK(ctx, x1, h * 0.96, '逆偏電壓（V）→　電容越來越小，但降得越來越慢', C['ink-3'], 10.5, 'right');
  }});

  syncCtl(); fill();
  window.__MT1 = { st, fill, compute: () => c };
})();
