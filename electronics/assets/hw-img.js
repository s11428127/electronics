/* ============================================================
   HW 原檔電路圖（使用者 11/6：「HW 計算題旁邊都要有我給你的檔案裡面的電路圖，全部照抄 HW；
   仿作業題一樣也要有電路。HW 檔案裡有的就要做出來，沒有的（像選擇題）不用」）
   - 圖片直接從 HW2、HW3 PDF 抽出來（img/hw/*.jpg），不重畫
   - 作業原題：換成原檔的圖；仿作業：用同一張原檔的圖，原圖上有數字的加註「數字以題目為準」
   - HW3 第 1 題（擴散電容填空）照原文加一張卡片；__HW3EX 依題號 1～7 排序
   - HW3 第 6 題（Exercise 2.1）原檔沒有圖 → 不動
   載入：放在 hw2-bank.js／mt2-calc.js／hw3-mock.js／ch2-figs.js 之後、DOMContentLoaded 之前
   ============================================================ */
(function () {
  'use strict';
  const P = 'img/hw/';
  const FIG = {
    hw2q1: { f: ['hw2-f1'], hw: 'HW2 第 1 題', cap: '圖 1' },
    hw2q2: { f: ['hw2-f2a', 'hw2-f2b', 'hw2-f2c'], hw: 'HW2 第 2 題', cap: '圖 2（a）（b）（c）', num: true },
    hw2q3: { f: ['hw2-f2a', 'hw2-f3b', 'hw2-f3c'], hw: 'HW2 第 3 題', cap: '圖 3（a）（b）（c）', num: true },
    hw3q1: { f: ['hw3-q1a', 'hw3-q1b'], hw: 'HW3 第 1 題', cap: '少數載子儲存電荷隨 v<sub>D</sub> 變化（上）、電路與 v<sub>D</sub> 波形（下）' },
    hw3q2: { f: ['hw3-q2'], hw: 'HW3 第 2 題', cap: 'figure (a)' },
    p146: { f: ['hw3-p146'], hw: 'HW3 第 3 題', cap: 'Figure P1.46' },
    p153: { f: ['hw3-p153'], hw: 'HW3 第 4 題', cap: 'Figure P1.53' },
    p157: { f: ['hw3-p157'], hw: 'HW3 第 5 題', cap: 'Figure P1.57', num: true },
    hw3q7: { f: ['hw3-q7'], hw: 'HW3 第 7 題', cap: 'figure 1' }
  };
  /* 題目 id → [圖, 是不是作業原題] */
  const MAP = {
    'w2h1': ['hw2q1', 1], 'w2h2': ['hw2q2', 1], 'w2h3': ['hw2q3', 1],
    'mt2-k1a': ['hw2q2', 1], 'mt2-k1b': ['hw2q3', 1],
    'hw3-q1': ['hw3q1', 1], 'mt2-k2b': ['hw3q2', 1], 'mt2-k6a': ['p146', 1], 'mt2-k6b': ['p153', 1], 'mt2-k3c': ['p157', 1], 'mt2-k4b': ['hw3q7', 1],
    'm3-146a': ['p146', 0], 'm3-146b': ['p146', 0], 'm3-acdc-a': ['hw3q2', 0], 'm3-acdc-b': ['hw3q2', 0],
    'm3-153a': ['p153', 0], 'm3-157a': ['p157', 0], 'm3-ct': ['hw3q7', 0]
  };
  for (let n = 1; n <= 10; n++) { MAP['w2s1-' + n] = ['hw2q1', 0]; MAP['w2s2-' + n] = ['hw2q2', 0]; MAP['w2s3-' + n] = ['hw2q3', 0]; }

  const imgs = F => '<div class="hwimg">' + F.f.map(f => '<a href="' + P + f + '.jpg" target="_blank" rel="noopener"><img src="' + P + f + '.jpg" alt="' + F.hw + ' 原檔電路圖" loading="lazy"></a>').join('') + '</div>';
  const capOf = (F, orig) => orig ? '📄 ' + F.hw + ' 原檔的圖：' + F.cap : '📄 電路同 ' + F.hw + '（原檔的圖' + (F.num ? '；圖上的數字以這題題目為準' : '') + '）';

  /* HW3 第 1 題（照原文） */
  const B = '<span class="hw-blank">＿＿＿＿</span>';
  const Q1 = { id: 'hw3-q1', sec: 'hw3', kind: 'pp', no: '', tag: 'HW3 第 1 題', title: 'Diffusion capacitance C<sub>d</sub> = dQ/dv<sub>D</sub>（填空＋畫等效電路）',
    q: '關於擴散電容 C<sub>d</sub> = dQ/dv<sub>D</sub>：二極體的電容性有兩個：接面電容（C<sub>j</sub>）與擴散電容（C<sub>d</sub>），只有直流是否要考慮，（是否需要考慮）' + B + '；若含有順偏加交流信號時（是否需要考慮）' + B + '。若 v<sub>D</sub> 之交流成分 ΔV 變大，在 P，N 兩中性區少數載子濃度，變大還是變小' + B + '，若 v<sub>D</sub> 之交流成分 ΔV 變小，在 P，N 兩中性區少數載子濃度，變大還是變小' + B + '，當 v<sub>D</sub> 交流成分，頻率變大，C<sub>d</sub> 變大還是變小' + B + '。若二極體交流電阻為 r<sub>d</sub>，二極體其小信號（AC）簡化模型為' + B + '（繪出其 AC（小信號）等效電路）',
    en: 'Figure: Change in minority carrier stored charge with a time-varying voltage superimposed on a dc quiescent diode voltage. The change in stored charge leads to a diode diffusion capacitance.',
    hint: '電容只對「變化」有反應：只有直流 → 不變 → 不用管；看左圖：電壓往上晃，少數載子曲線整條往上。',
    steps: [
      { t: '只有直流。', eq: '不需要考慮', why: '電容對直流是開路，Q 不變就沒有 dQ/dv。' },
      { t: '順偏加交流。', eq: '需要考慮', why: 'v<sub>D</sub> 一晃，邊界的少數載子跟著充放，就是 C<sub>d</sub>。' },
      { t: 'ΔV 變大。', eq: '少數載子濃度變大', why: '左圖粉紅色那圈：電壓往上，P、N 兩邊靠接面的濃度往上（指數關係）。' },
      { t: 'ΔV 變小。', eq: '少數載子濃度變小', why: '電壓往下，濃度跟著往下。' },
      { t: '頻率變大。', eq: 'C<sub>d</sub> 變小', why: '講義 1.4.1：高頻時少數載子來不及跟著充放，dQ 變小，C<sub>d</sub> 變小。' },
      { t: '小訊號模型。', eq: 'r<sub>d</sub> ∥ C<sub>d</sub>（r<sub>d</sub> 和 C<sub>d</sub> 並聯，必要時再並 C<sub>j</sub>）', why: '順偏時 C<sub>d</sub> 遠大於 C<sub>j</sub>；r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub>。' }
    ],
    ans: '不需要；需要；變大；變小；變小；r<sub>d</sub> 並聯 C<sub>d</sub>',
    note: '作業原文照抄；頻率那格依講義 1.4.1（請對照老師答案）。' };
  if (window.__HW3EX && window.__HW3EX.items && !window.__HW3EX.items.some(i => i.id === Q1.id)) {
    window.__HW3EX.items.unshift(Q1);
    const no = i => { const m = /HW3 第 (\d) 題/.exec(i.tag || ''); return m ? +m[1] : 99; };
    window.__HW3EX.items.sort((a, b) => no(a) - no(b));
  }

  ['__HW2', '__HW3EX', '__MT2EX', '__HW3MX', '__CH15EX', '__CH16EX', '__CH22EX'].forEach(name => {
    const bk = window[name]; if (!bk || !bk.items) return;
    const inline = name === '__HW2';   /* hw.js 的卡片沒有 figcaption，說明放進 fig 裡 */
    bk.items.forEach(it => {
      const m = MAP[it.id]; if (!m) return;
      const F = FIG[m[0]], cap = capOf(F, m[1]);
      if (inline) it.fig = imgs(F) + '<div class="hwimg-cap">' + cap + '</div>';
      else { it.fig = imgs(F); it.cap = cap; }
    });
  });

  if (!document.getElementById('hwimg-css')) {
    const s = document.createElement('style'); s.id = 'hwimg-css';
    s.textContent = '.hwimg{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;margin:6px 0}' +
      '.hwimg a{display:block;background:#fff;border-radius:10px;padding:8px;border:1px solid var(--line-soft,#ddd);max-width:100%;box-sizing:border-box}' +
      '.hwimg img{display:block;max-width:100%;height:auto;max-height:240px}' +
      '.hwimg-cap{text-align:center;font-size:12.5px;color:var(--ink-3);margin-top:4px}.hw-blank{letter-spacing:-1px;color:var(--accent)}';
    document.head.appendChild(s);
  }
})();
