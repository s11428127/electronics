/* ============================================================
   電子學期中考 2 —— 考前故事（使用者 11/9：「用故事方式整理這次段考範圍的重點」）
   照 docs/MIDTERM2.md 老師清單走：6 類計算（Q 點兩法、AC+DC、Zener、橋式、中間抽頭、截波）
   ＋選擇題觀念（順偏與溫度、兩種崩潰、Q 點與失真、擴散電容、其他二極體、反向恢復）。
   數字都跟講義／HW3／midterm2 頁一樣（已驗算）。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15 || !window.__C2S) return;
  const K = window.__K15, D = K.D, g = K.g, T = K.T, calc = K.calc, sc = K.sc;
  const C = window.__C2S, W = C.W;
  const { chip, arrow } = D;
  const box = (x, y, w, h, key, inner) => g(key, K.card(x, y, w, h) + (inner || ''));

  /* ── 00 今天考什麼 ── */
  const S0 = sc('今天考什麼', 'THE EXAM MAP',
    box(40, 100, 270, 200, 'L', T(175, 126, '計算題（英文）', { cls: 'ta', fs: 15 }) +
      T(60, 156, '① 順偏找 Q 點（兩種方法）', { a: 'start', fs: 13 }) + T(60, 180, '② ★ AC + DC 分析', { a: 'start', fs: 13 }) +
      T(60, 204, '③ Zener 崩潰區（含 r<sub>z</sub>）', { a: 'start', fs: 13 }) + T(60, 228, '④ ★ 全波整流（橋式）', { a: 'start', fs: 13 }) +
      T(60, 252, '⑤ ★ 截波（雙向最重要）', { a: 'start', fs: 13 }) + T(60, 276, '⑥ HW 計算題', { a: 'start', fs: 13 })) +
    box(330, 100, 270, 200, 'R', T(465, 126, '選擇題（中文）', { cls: 'ta', fs: 15 }) +
      T(350, 156, '順偏：擴散、少數載子、溫度', { a: 'start', fs: 13 }) + T(350, 180, '齊納崩潰 vs 累增崩潰', { a: 'start', fs: 13 }) +
      T(350, 204, 'Q 點怎麼選、會不會失真', { a: 'start', fs: 13 }) + T(350, 228, '擴散電容', { a: 'start', fs: 13 }) +
      T(350, 252, '其他二極體（LED、光二極體…）', { a: 'start', fs: 13 }) + T(350, 276, '反向恢復時間', { a: 'start', fs: 13 })),
    [
      { sub: '老師手寫的清單分兩半：左邊是<b>計算題</b>，考卷用英文。', on: 'L' },
      { sub: '右邊是<b>選擇題</b>，用中文考觀念。', on: 'R' },
      { sub: '接下來一幕講一件事，照「先觀念、再計算」的順序走一遍。' }
    ]);

  /* ── 01 順偏：擴散＋溫度 ── */
  const S1 = sc('順偏到底在幹嘛', 'FORWARD BIAS',
    g('pn', '<rect class="bgw" x="90" y="120" width="200" height="110" rx="8"/><line class="ln2" x1="190" y1="120" x2="190" y2="230"/>' +
      T(140, 142, 'P', { cls: 'tm', fs: 16 }) + T(240, 142, 'N', { cls: 'tm', fs: 16 })) +
    g('e', D.e(220, 180) + D.e(250, 200) + D.e(205, 205) + arrow(215, 165, 160, 165, null, 'lna')) +
    g('h', D.h(160, 195) + D.h(130, 180) + arrow(165, 215, 220, 215, null, 'lna')) +
    chip(460, 140, '電子擴散到 P 區 → 變成少數載子', '電洞擴散到 N 區也一樣', 'c1', { fs: 12.5 }) +
    chip(460, 200, '電流主要靠「擴散」', '不是漂移', 'c2', { fs: 12.5 }) +
    chip(460, 270, '溫度 ↑ → 同樣電流只要更小的 V<sub>D</sub>', '約 −2 mV/°C', 'c3', { fs: 12.5, acc: true }),
    [
      { sub: '順偏時，空乏區變窄，載子終於翻得過去。', on: 'pn' },
      { sub: 'N 區的電子擴散到 P 區，到了那邊就是<b>少數載子</b>（被「注入」）。', on: 'e c1' },
      { sub: '電洞反方向也一樣。順偏電流靠的是<b>擴散</b>。', on: 'h c2' },
      { sub: '選擇題愛考溫度：溫度升高，同樣電流需要的 V<sub>D</sub> 變小，大約 <b>−2 mV/°C</b>。', on: 'c3' }
    ]);

  /* ── 02 計算①：Q 點兩種方法 ── */
  const P = K.axes(330, 120, 260, 170, { v0: 0, v1: 5.2, i0: 0, i1: 2.8e-3, xl: 'V<sub>D</sub>', yl: 'I<sub>D</sub>', vt: [[5, '5 V']], it: [[2.5e-3, '2.5 mA']] });
  const S2 = sc('計算 ①：找 Q 點', 'Q-POINT, TWO WAYS',
    K.circ(60, 140, 180, 130, { k: 'ck', vps: '5 V', r: '2 kΩ', model: 'd', cur: 'cur' }) +
    g('ax', P.svg) + P.seg(0, 2.5e-3, 5, 0, 'll', 'lna', ' style="stroke-width:2.2"') +
    T(540, 245, 'load line', { cls: 'ta', fs: 12, a: 'start', k: 'llL' }) +
    g('pw', '<path class="ln" style="fill:none;stroke-width:2.4" d="M' + P.X(0) + ' ' + P.Y(0) + ' H' + P.X(0.6) + ' L' + P.X(0.6 + 2.6e-3 * 10) + ' ' + P.Y(2.6e-3) + '"/>') +
    P.dot(0.622, 2.19e-3, 'q') +
    calc(410, 96, 205, [['I<sub>DQ</sub> = 4.4/2010 = 2.19 mA', 'r1'], ['V<sub>DQ</sub> = 0.6 + 2.19m × 10 = 0.622 V', 'r2']], { lh: 23, fs: 12.5 }),
    [
      { sub: '題目：5 V、2 kΩ，二極體化簡成 V<sub>γ</sub> = 0.6 V、r<sub>f</sub> = 10 Ω。', on: 'ck' },
      { sub: '方法一：<b>作圖</b>。電路給一條直線叫 load line：兩個端點 5 V 和 2.5 mA。', on: 'ax ll llL' },
      { sub: '二極體給另一條：0.6 V 之後斜率 1/r<sub>f</sub> 往上衝。', on: 'pw' },
      { sub: '兩條線的交點就是工作點 <b>Q</b>。', on: 'q cur' },
      { sub: '方法二：<b>代模型</b>。把二極體換成 0.6 V 電池＋10 Ω，一條 KVL 就算出 2.19 mA。', on: 'r1' },
      { sub: 'V<sub>DQ</sub> = 0.622 V。兩種方法答案<b>一樣</b>，因為解的是同兩條直線。', on: 'r2' }
    ]);

  /* ── 03 Q 點與失真 ── */
  const P3 = K.axes(80, 120, 250, 170, { v0: 0, v1: 1, i0: 0, i1: 1, xl: 'V<sub>D</sub>', yl: 'I<sub>D</sub>' });
  const ex = v => Math.min(1.2, 0.002 * (Math.exp(v * 7.5) - 1));
  const S3 = sc('Q 點選在哪裡？', 'CHOOSING Q',
    g('ax', P3.svg + P3.curve(ex, 0, 0.95, null)) +
    g('qg', P3.dot(0.78, ex(0.78), null, 6) + T(P3.X(0.78) - 10, P3.Y(ex(0.78)) - 8, 'Q 在直線段', { cls: 'ta', fs: 12, a: 'end' })) +
    g('qb', P3.dot(0.45, ex(0.45), null, 6, 'ln') + T(P3.X(0.45) + 8, P3.Y(ex(0.45)) - 10, 'Q 在膝蓋', { cls: 'ts', fs: 12, a: 'start' })) +
    chip(480, 150, 'Q 在比較直的地方', '小訊號上下擺 → 輸出也對稱', 'c1', { fs: 12.5 }) +
    chip(480, 215, 'Q 太低、在彎的地方', '上下擺的放大不一樣 → 失真', 'c2', { fs: 12.5 }) +
    chip(480, 280, '所以先選好 DC，再疊 AC', '小訊號要「夠小」', 'c3', { fs: 12.5, acc: true }),
    [
      { sub: '二極體曲線是彎的。小訊號會在 Q 點附近上下擺。', on: 'ax' },
      { sub: 'Q 選在比較直的地方，上下擺動被同樣對待，輸出不變形。', on: 'qg c1' },
      { sub: 'Q 選在膝蓋（彎的地方），上擺和下擺斜率差很多，輸出就<b>失真</b>。', on: 'qb c2' },
      { sub: '結論：DC 決定 Q 點，訊號要夠小才能用小訊號模型。', on: 'c3' }
    ]);

  /* ── 04 計算②：AC + DC ── */
  const S4 = sc('計算 ②：AC + DC（★）', 'AC + DC ANALYSIS',
    box(40, 100, 270, 92, 'dc', T(175, 124, 'Step 1　只看 DC（v<sub>i</sub> 關掉）', { cls: 'ta', fs: 13 }) +
      T(60, 152, 'I<sub>DQ</sub> = (8 − 0.7)/20k = 0.365 mA', { a: 'start', fs: 13 }) + T(60, 176, 'V<sub>O,DC</sub> = 0.365m × 20k = 7.3 V', { a: 'start', fs: 13 })) +
    box(40, 204, 270, 92, 'rd', T(175, 228, 'Step 2　算小訊號電阻', { cls: 'ta', fs: 13 }) +
      T(60, 256, 'r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub> = 26 mV/0.365 mA', { a: 'start', fs: 13 }) + T(60, 280, '　 = 71.2 Ω', { a: 'start', fs: 13 })) +
    box(330, 100, 270, 92, 'ac', T(465, 124, 'Step 3　只看 AC（8 V 接地）', { cls: 'ta', fs: 13 }) +
      T(350, 152, 'v<sub>d</sub> = 0.25 × 71.2/20071 = 0.887 mV', { a: 'start', fs: 13 }) + T(350, 176, 'v<sub>o</sub> = 0.249 sin ωt V', { a: 'start', fs: 13 })) +
    box(330, 204, 270, 92, 'sum', T(465, 228, 'Step 4　疊加', { cls: 'ta', fs: 13 }) +
      T(465, 262, 'v<sub>O</sub> = 7.3 + 0.249 sin ωt V', { cls: 't', fs: 15 })),
    [
      { sub: 'HW3 那題：8 V、20 kΩ、V<sub>γ</sub> = 0.7 V，再疊一個 0.25 sin ωt。', },
      { sub: '第一步只看 DC，把小訊號關掉：I<sub>DQ</sub> = 0.365 mA。', on: 'dc' },
      { sub: '第二步用 I<sub>DQ</sub> 算二極體的小訊號電阻 r<sub>d</sub> = 71.2 Ω。', on: 'rd' },
      { sub: '第三步只看 AC：8 V 接地，二極體換成 71.2 Ω，分壓。', on: 'ac' },
      { sub: '最後疊起來：DC 7.3 V 加上 0.249 V 的小波。<b>順序不能反</b>：沒有 I<sub>DQ</sub> 就算不出 r<sub>d</sub>。', on: 'sum' }
    ]);

  /* ── 05 擴散電容 ── */
  const S5 = sc('擴散電容', 'DIFFUSION CAPACITANCE',
    chip(170, 140, '順偏：注入一堆少數載子', '堆在接面兩側', 'c1', { fs: 13 }) +
    chip(170, 210, '電壓一變，堆的電荷量跟著變', 'ΔQ / ΔV → 像電容', 'c2', { fs: 13 }) +
    chip(470, 140, '擴散電容：順偏時大', '來自儲存的少數載子', 'c3', { fs: 13, acc: true }) +
    chip(470, 210, '接面電容：逆偏時主角', '來自空乏區的電荷', 'c4', { fs: 13 }) +
    chip(320, 285, '兩個都放進小訊號等效電路：r<sub>d</sub> 並聯電容', null, 'c5', { fs: 13 }),
    [
      { sub: '順偏時，少數載子被注入、堆在接面兩邊。', on: 'c1' },
      { sub: '電壓變一點，堆的電荷就跟著變，這就是電容的行為。', on: 'c2' },
      { sub: '這個叫<b>擴散電容</b>，順偏時才大。', on: 'c3' },
      { sub: '逆偏時主角換成<b>接面電容</b>（空乏區的電荷）。選擇題常考「哪個偏壓下誰比較大」。', on: 'c4' },
      { sub: '小訊號等效電路：r<sub>d</sub> 和電容並聯。', on: 'c5' }
    ]);

  /* ── 06 反向恢復 ── */
  const ax6 = '<path class="ln2" style="fill:none" d="M80 210 H560 M80 120 V300"/>';
  const iw = 'M80 160 H250 L252 260 H350 Q380 262 420 210 H560';
  const S6 = sc('反向恢復：關不掉的那一下', 'REVERSE RECOVERY',
    g('ax', ax6 + T(70, 164, 'I<sub>F</sub>', { cls: 'ts', fs: 12, a: 'end' }) + T(70, 264, '−I<sub>R</sub>', { cls: 'ts', fs: 12, a: 'end' }) + T(566, 214, 't', { cls: 'ts', fs: 12, a: 'start' })) +
    g('w', '<path class="lna" style="fill:none;stroke-width:2.6" d="' + iw + '"/>') +
    g('ts', '<path class="ln2" d="M252 280 H350" style="stroke-width:1.4"/>' + T(301, 296, 't<sub>s</sub> 儲存時間', { cls: 'ta', fs: 12 })) +
    g('tf', '<path class="ln2" d="M350 240 H420" style="stroke-width:1.4"/>' + T(440, 252, 't<sub>f</sub> 下降時間', { cls: 'ta', fs: 12, a: 'start' })) +
    T(250, 146, '這裡突然切到逆偏', { cls: 'ts', fs: 12, k: 'sw' }),
    [
      { sub: '二極體順偏導通，流著 I<sub>F</sub>。', on: 'ax' },
      { sub: '突然切到逆偏，照理應該馬上停。', on: 'sw' },
      { sub: '結果電流<b>反向</b>流了一段：之前堆的少數載子要先被抽乾。', on: 'w' },
      { sub: '抽乾那段叫<b>儲存時間 t<sub>s</sub></b>。', on: 'ts' },
      { sub: '接著慢慢降回 0，叫<b>下降時間 t<sub>f</sub></b>。所以關掉（turn-off）比打開（turn-on）慢。', on: 'tf' }
    ]);

  /* ── 07 兩種崩潰 ── */
  const S7 = sc('兩種崩潰：撕的 vs 撞的', 'ZENER vs AVALANCHE',
    box(40, 105, 270, 170, 'z', T(175, 132, '齊納崩潰（撕的）', { cls: 'ta', fs: 15 }) +
      T(60, 166, '摻雜很濃 → 空乏區很薄', { a: 'start', fs: 13 }) + T(60, 192, '電場超強，直接把電子', { a: 'start', fs: 13 }) +
      T(60, 214, '從鍵上「撕」過去（tunneling）', { a: 'start', fs: 13 }) + T(60, 248, '崩潰電壓比較低', { cls: 'ts', fs: 12.5, a: 'start' })) +
    box(330, 105, 270, 170, 'a', T(465, 132, '累增崩潰（撞的）', { cls: 'ta', fs: 15 }) +
      T(350, 166, '空乏區比較寬', { a: 'start', fs: 13 }) + T(350, 192, '載子被加速、撞出新的電子電洞', { a: 'start', fs: 13 }) +
      T(350, 214, '新的再去撞 → 雪崩（avalanche）', { a: 'start', fs: 13 }) + T(350, 248, '崩潰電壓比較高', { cls: 'ts', fs: 12.5, a: 'start' })),
    [
      { sub: '逆偏加太大會崩潰，原因有兩種。', },
      { sub: '<b>齊納崩潰</b>：空乏區很薄、電場超強，電子直接被「撕」過去。', on: 'z' },
      { sub: '<b>累增崩潰</b>：載子被加速去撞，越撞越多，像雪崩。', on: 'a' },
      { sub: '口訣：<b>齊納是撕的、累增是撞的</b>。' }
    ]);

  /* ── 08 計算③：Zener ── */
  const S8 = sc('計算 ③：Zener 穩壓', 'ZENER REGULATOR',
    W('M80 130 H200 M240 130 H340 V170 M340 230 V280 H80 V230 M80 170 V130', 'ck') + C.res(220, 130, false, 'ckR', 'R') +
    C.bat(80, 200, true, 'ckB', '10 V') + C.dio(340, 200, 'u', 'ckZ', '5.6 V') +
    calc(400, 110, 215, [['R = (10 − 5.6)/3 mA', 'r1'], ['　= 1.47 kΩ', 'r2'], ['P<sub>Z</sub> = 5.6 × 3 mA = 16.8 mW', 'r3'], ['有 r<sub>z</sub> = 10 Ω：', 'r4', 'ta'], ['V<sub>Z</sub> = 5.6 + 3m × 10 = 5.63 V', 'r5']], { lh: 26, fs: 13.5 }),
    [
      { sub: 'Design Example 1.13：10 V 電源、Zener 5.6 V，要 I<sub>Z</sub> = 3 mA。', on: 'ck ckR ckB ckZ' },
      { sub: 'Zener 崩潰後兩端幾乎固定，R 扛剩下的電壓：R = 4.4 V / 3 mA = 1.47 kΩ。', on: 'r1 r2' },
      { sub: 'Zener 吃掉的功率 P<sub>Z</sub> = 16.8 mW。', on: 'r3' },
      { sub: '老師說要考慮 r<sub>z</sub>：Zener 換成「5.6 V 電池＋10 Ω」，電壓變 5.63 V。', on: 'r4 r5' },
      { sub: 'HW3 Problem 1.57 也是 r<sub>z</sub> = 10 Ω，答案 5.685 V、±19.6 mV、5.658 V，記得回去看。' }
    ]);

  /* ── 09 其他二極體 ── */
  const S9 = sc('其他二極體', 'OTHER DIODE TYPES',
    chip(170, 130, '太陽能電池', '光照 → 產生電流（發電）', 'a', { fs: 13 }) +
    chip(470, 130, '光二極體', '逆偏，光越強逆向電流越大', 'b', { fs: 13 }) +
    chip(170, 205, 'LED', '順偏，電子電洞復合 → 發光', 'c', { fs: 13 }) +
    chip(470, 205, '蕭特基二極體', '金屬－半導體接面，V<sub>γ</sub> 小、切換快', 'd', { fs: 13 }) +
    chip(320, 280, '齊納二極體', '專門工作在逆偏崩潰區 → 穩壓', 'e', { fs: 13, acc: true }),
    [
      { sub: '選擇題：每種二極體「怎麼工作」。', on: 'a' },
      { sub: '光二極體是<b>逆偏</b>用，光一照逆向電流變大。', on: 'b' },
      { sub: 'LED 是<b>順偏</b>，復合時放出光。', on: 'c' },
      { sub: '蕭特基是金屬接半導體，導通電壓小、切換快。', on: 'd' },
      { sub: '齊納就是剛剛那個，專門在崩潰區穩壓。', on: 'e' }
    ]);

  /* ── 10 計算④：橋式 ── */
  const sinf = u => Math.sin(u * 4 * Math.PI);
  const S10 = sc('計算 ④：橋式全波整流（★）', 'BRIDGE RECTIFIER',
    g('ax1', C.axis(70, 170, 230, 55)) + C.wave(70, 170, 230, 50, sinf, 'vi', 'ln') + T(66, 120, 'v<sub>S</sub>', { cls: 'ts', fs: 12, a: 'end', k: 'vi' }) +
    g('ax2', C.axis(70, 290, 230, 55)) + C.wave(70, 290, 230, 50, u => Math.max(0, Math.abs(sinf(u)) - 0.25), 'vo', 'lna') + T(66, 240, 'v<sub>O</sub>', { cls: 'ts', fs: 12, a: 'end', k: 'vo' }) +
    calc(340, 110, 270, [['每半週期：兩顆 ON、兩顆 OFF', 'r1'], ['v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>', 'r2'], ['導通條件：|v<sub>S</sub>| > 2V<sub>γ</sub>', 'r3'], ['PIV = V<sub>m</sub> − V<sub>γ</sub>', 'r4', 'ta']], { lh: 30, fs: 14 }),
    [
      { sub: '輸入是正弦波 v<sub>S</sub>。', on: 'ax1 vi' },
      { sub: '橋式有四顆二極體：正半週兩顆導通，負半週換另外兩顆。', on: 'r1' },
      { sub: '每次電流都要經過<b>兩顆</b>，所以掉兩個 V<sub>γ</sub>：v<sub>O</sub> = |v<sub>S</sub>| − 2V<sub>γ</sub>。', on: 'r2 ax2 vo' },
      { sub: '|v<sub>S</sub>| 小於 2V<sub>γ</sub> 時四顆都 OFF，輸出 0（波形底下那段平的）。', on: 'r3' },
      { sub: 'PIV：關掉的那顆最多扛 V<sub>m</sub> − V<sub>γ</sub>（11/3 板書）。', on: 'r4' }
    ]);

  /* ── 11 中間抽頭（HW3 第 7 題） ── */
  const S11 = sc('中間抽頭全波整流', 'CENTER-TAPPED',
    g('ax', C.axis(70, 230, 230, 60)) + C.wave(70, 230, 230, 55, u => Math.max(0, Math.abs(sinf(u)) - 0.13), 'vo', 'lna') + T(66, 172, 'v<sub>O</sub>', { cls: 'ts', fs: 12, a: 'end', k: 'vo' }) +
    calc(340, 110, 270, [['每半週期只有一顆 ON', 'r1'], ['v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>', 'r2'], ['PIV = 2V<sub>m</sub> − V<sub>γ</sub>', 'r3', 'ta'], ['（比橋式大，因為只用半個線圈）', 'r4', 'ts']], { lh: 30, fs: 14 }),
    [
      { sub: 'HW3 第 7 題：中間抽頭變壓器，兩顆二極體輪流導通。', on: 'r1' },
      { sub: '每次只經過<b>一顆</b>：v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>，掉得比橋式少。', on: 'r2 ax vo' },
      { sub: '代價是 PIV 變大：關掉那顆要扛 <b>2V<sub>m</sub> − V<sub>γ</sub></b>。', on: 'r3 r4' },
      { sub: '比一比：橋式掉 2V<sub>γ</sub>、PIV 小；中間抽頭掉 1V<sub>γ</sub>、PIV 大。' }
    ]);

  /* ── 12 計算⑤：雙向截波 ── */
  const clip = u => Math.max(-0.5, Math.min(0.6, sinf(u)));
  const S12 = sc('計算 ⑤：雙向截波（最重要）', 'DOUBLE CLIPPER',
    g('ax', C.axis(70, 220, 260, 70)) + C.wave(70, 220, 260, 65, sinf, 'vi', 'ln2') +
    C.wave(70, 220, 260, 65, clip, 'vo', 'lna') +
    C.hline(70, 330, 220 - 65 * 0.6, 'h1', 'V<sub>B1</sub> + V<sub>γ</sub>') + C.hline(70, 330, 220 + 65 * 0.5, 'h2', '−(V<sub>B2</sub> + V<sub>γ</sub>)') +
    calc(360, 110, 250, [['v<sub>i</sub> > V<sub>B1</sub> + V<sub>γ</sub>：D1 ON', 'r1'], ['→ v<sub>O</sub> = V<sub>B1</sub> + V<sub>γ</sub>', 'r2'], ['v<sub>i</sub> < −(V<sub>B2</sub> + V<sub>γ</sub>)：D2 ON', 'r3'], ['→ v<sub>O</sub> = −(V<sub>B2</sub> + V<sub>γ</sub>)', 'r4'], ['中間：兩顆 OFF，v<sub>O</sub> = v<sub>i</sub>', 'r5'], ['D1、D2 不可能同時 ON', 'r6', 'ta']], { lh: 26, fs: 13 }),
    [
      { sub: '輸入是一個大正弦波（灰線）。', on: 'ax vi' },
      { sub: '上面那條路：v<sub>i</sub> 超過 V<sub>B1</sub> + V<sub>γ</sub>，D1 導通，輸出被<b>削平</b>在那裡。', on: 'h1 r1 r2' },
      { sub: '下面那條路：v<sub>i</sub> 低於 −(V<sub>B2</sub> + V<sub>γ</sub>)，D2 導通，底部也被削平。', on: 'h2 r3 r4' },
      { sub: '中間兩顆都 OFF，輸出就是輸入。', on: 'r5 vo' },
      { sub: '關鍵：D1、D2 <b>不可能同時 ON</b>，所以最多分三區，一區一區寫。', on: 'r6' }
    ]);

  /* ── 13 解題口訣 ── */
  const S13 = sc('考試時的固定流程', 'HOW TO SOLVE',
    calc(120, 100, 400, [['① 先猜每顆二極體 ON 還是 OFF', 'r1'], ['② ON 換成 V<sub>γ</sub>（＋r<sub>f</sub>），OFF 換成斷路', 'r2'], ['③ KVL 算電流、電壓', 'r3'], ['④ 回頭驗證：ON 的 I > 0？OFF 的 V < V<sub>γ</sub>？', 'r4'], ['⑤ 有 AC：先 DC 找 Q，再算 r<sub>d</sub>，最後疊加', 'r5', 'ta']], { lh: 28, fs: 14.5, title: '每一題都一樣' }),
    [
      { sub: '最後整理：不管是整流、截波、Zener，流程都一樣。', on: 'r1' },
      { sub: '猜完就把二極體換成模型。', on: 'r2' },
      { sub: '用 KVL 算。', on: 'r3' },
      { sub: '一定要<b>回頭驗證</b>猜得對不對，錯了就換一個猜法。', on: 'r4' },
      { sub: '有交流就照 AC + DC 的順序。下面的題目一題一題練，加油！', on: 'r5' }
    ]);

  __Story('#story', { id: 'mt2-story', title: '期中考 2 重點', after: '#plan', afterLabel: '往下看題目 ↓',
    scenes: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13] });
})();
