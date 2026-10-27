/* ============================================================
   電子學 CH2 PART 1（原講義 CH2 PART 1 V1，投影片 2-1～2-7）—— 故事模式
   謎題：牆上的插座是 110 V 交流（一下 +155.6 V、一下 −155.6 V），手機只要 5 V 直流。中間發生了什麼？
   答案：變壓器降壓 → 二極體半波整流（只留正半週）→ 濾波 → 穩壓。這一段先把「整流」弄懂。
   寫法：先複習 CH1 的二極體模型，再拆一個真的充電器，最後才上三種情況、轉移特性和波形。
   需要：story.js、ch1-part5-kit.js（__K15）、ch1-part6-ex.js（__K16）、ch2-part1-ex.js（__K21）
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15 || !window.__K16 || !window.__K21) return;
  const K = window.__K15, D = K.D, Q = window.__K16, X = window.__K21;
  const { g, T, calc, sc, axes, sine, f1 } = K;
  const { chip, arrow } = D;
  const card = (x, y, w, h, key, inner) => g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" filter="url(#st-sh)"/>' + inner);
  const iv = v => 1e-14 * (Math.exp(v / 0.026) - 1) * 1e3;

  /* 00 謎題 */
  const plug = g('plug', '<rect class="card" x="70" y="130" width="120" height="120" rx="16" filter="url(#st-sh)"/><rect class="ln" x="105" y="165" width="8" height="26" style="fill:var(--s-ink)"/><rect class="ln" x="147" y="165" width="8" height="26" style="fill:var(--s-ink)"/>' +
    T(130, 230, '插座 110 V', { cls: 't', fs: 14 }));
  const phone = g('ph', '<rect class="card" x="470" y="120" width="80" height="140" rx="14" filter="url(#st-sh)"/><rect class="accw" x="480" y="135" width="60" height="100" rx="4"/>' + T(510, 252, '5 V', { cls: 'ta', fs: 14 }));
  const C0 = sc('插座和手機，講不同的話', 'THE QUESTION',
    plug + phone + sine(210, 180, 120, 34, { cls: 'ln', k: 'ac' }) + T(270, 130, '交流：一下正一下負', { cls: 'tm', fs: 12, k: 'acl' }) +
    g('dc', '<line class="lna" x1="360" y1="170" x2="450" y2="170" style="stroke-width:3"/>' + T(405, 150, '直流：一直 5 V', { cls: 'ta', fs: 12 })) +
    T(340, 290, '中間發生了什麼？', { cls: 'ta', fs: 20, k: 'q' }),
    [{ sub: '牆上的插座是 <b>110 V 交流</b>：一下 +155.6 V、一下 −155.6 V，一秒來回 60 次。', on: 'plug ac acl' },
     { sub: '手機只吃 <b>5 V 直流</b>：一直是正的、一直是 5 V。', on: 'ph dc' },
     { sub: '充電器在中間做了什麼？這一份講義從這裡開始（CH2 二極體電路）。', on: 'q' }]);

  /* 01 複習：單向門 */
  const PA = axes(120, 112, 400, 168, { v0: -0.6, v1: 0.8, i0: -0.4, i1: 3, vt: [[0.7, '0.7 V']], it: [] });
  const C1 = sc('先複習：二極體是單向門', 'RECAP · ONE-WAY DOOR',
    PA.svg + PA.curve(iv, -0.6, 0.75, 'cv') +
    chip(250, 160, '反著推：門關著', '電流 ≈ 0', 'c1', { fs: 13 }) + chip(470, 150, '順著推過 0.7 V：門開', '電流往上衝', 'c2', { fs: 13, acc: true }),
    [{ sub: '先複習 CH1：二極體的電流–電壓曲線。', on: 'cv' },
     { sub: '反著推：門關著，沒有電流。', on: 'c1' },
     { sub: '順著推、超過約 0.7 V：門打開。<b>只准單向通過</b> —— 這就是整流的秘密武器。', on: 'c2' }]);

  /* 02 複習：兩種模型 */
  const C2 = sc('複習：ON 是電池、OFF 是斷路', 'RECAP · MODELS',
    card(70, 116, 230, 150, 'A', T(185, 146, 'ON（v<sub>D</sub> 想超過 V<sub>γ</sub>）', { fs: 15, cls: 'ta' }) + Q.batH(185, 196) + '<line class="ln" x1="130" y1="196" x2="180" y2="196"/><line class="ln" x1="190" y1="196" x2="240" y2="196"/>' + T(185, 240, '= V<sub>γ</sub> 電池（r<sub>f</sub> = 0）', { cls: 'tm', fs: 13 })) +
    card(340, 116, 230, 150, 'B', T(455, 146, 'OFF', { fs: 15 }) + '<line class="ln" x1="400" y1="196" x2="445" y2="196"/><circle class="bgw" cx="447" cy="196" r="3"/><circle class="bgw" cx="463" cy="196" r="3"/><line class="ln" x1="465" y1="196" x2="510" y2="196"/>' + T(455, 240, '= 斷路，電流 0', { cls: 'tm', fs: 13 })),
    [{ sub: '再複習 CH1 PART 5 的定電壓降模型：導通時，二極體 = 一顆 <b>V<sub>γ</sub> ≈ 0.7 V 的電池</b>。', on: 'A' },
     { sub: '不導通時 = <b>斷路</b>。整份講義就靠這兩張圖。', on: 'B' }]);

  /* 03 拆充電器 */
  const blk = (x, key, a, b) => card(x, 140, 100, 80, key, T(x + 50, 172, a, { fs: 14, cls: 'ta' }) + T(x + 50, 196, b, { cls: 'tm', fs: 11.5 }));
  const C3 = sc('拆開一個充電器', 'INSIDE A CHARGER',
    blk(20, 'b1', '市電', 'AC 110 V') + blk(145, 'b2', '變壓器', '降壓') + blk(270, 'b3', '整流', '變單向') + blk(395, 'b4', '濾波', '弄平') + blk(520, 'b5', '穩壓', '穩成 5 V') +
    g('ar', [120, 245, 370, 495].map(x => arrow(x + 2, 180, x + 22, 180, null, 'ln')).join('')) +
    chip(320, 270, '講義 2-3：直流電源供應器的結構', 'Fig 2.1', 'c1', { fs: 13 }),
    [{ sub: '把充電器拆開，裡面分成幾段。', on: 'b1 c1' },
     { sub: '<b>變壓器</b>：把 110 V 降成十幾伏的交流。', on: 'ar b2' },
     { sub: '<b>整流</b>：用二極體讓電流只走一個方向。', on: 'b3' },
     { sub: '<b>濾波</b>：用電容把起起伏伏弄平；<b>穩壓</b>：例如 7805 IC，穩成 5 V。', on: 'b4 b5' }]);

  /* 04 每一級的波形 */
  const wv = (x, key, kind) => {
    let d = '';
    for (let n = 0; n <= 40; n++) {
      const u = n / 40, s = Math.sin(u * 4 * Math.PI);
      let v = kind === 0 ? s : kind === 1 ? 0.55 * s : kind === 2 ? Math.max(0, 0.55 * s) : kind === 3 ? 0.5 - 0.06 * ((u * 2) % 1) : 0.35;
      d += (n ? ' L' : 'M') + f1(x + 10 + u * 80) + ' ' + f1(270 - v * 30);
    }
    return '<path class="lna" style="fill:none;stroke-width:2.2" d="' + d + '"' + K.k(key) + '/>';
  };
  const C4 = sc('每一級出來長什麼樣', 'WAVEFORM AT EACH STAGE',
    blk(20, null, '市電', 'AC 110 V') + blk(145, null, '變壓器', '降壓') + blk(270, null, '整流', '變單向') + blk(395, null, '濾波', '弄平') + blk(520, null, '穩壓', '穩成 5 V') +
    [20, 145, 270, 395, 520].map(x => '<line class="ln2 dsh" x1="' + (x + 8) + '" y1="270" x2="' + (x + 92) + '" y2="270"/>').join('') +
    wv(20, 'w0', 0) + wv(145, 'w1', 1) + wv(270, 'w2', 2) + wv(395, 'w3', 3) + wv(520, 'w4', 4),
    [{ sub: '市電：大大的正弦波，有正有負。', on: 'w0' },
     { sub: '變壓器後：還是正弦，只是變小。', on: 'w1' },
     { sub: '整流後：負的那半被擋掉，只剩一顆一顆的駝峰 —— <b>脈動直流</b>。', on: 'w2' },
     { sub: '濾波後幾乎平了，穩壓後是一條直線 5 V（講義 2-3 下面那排小圖）。', on: 'w3 w4' }]);

  /* 05 先整理 */
  const C5 = sc('先整理一下', 'LET\'S RECAP',
    card(60, 116, 250, 130, 'A', T(185, 146, '變壓器', { fs: 16 }) + T(185, 176, '交流 → 小一點的交流', { cls: 'tm', fs: 13 }) + T(185, 204, '（不是二極體電路）', { cls: 'ts', fs: 12 })) +
    card(330, 116, 250, 130, 'B', T(455, 146, '整流、濾波、穩壓', { fs: 16, cls: 'ta' }) + T(455, 176, '都是二極體電路', { cls: 'tm', fs: 13 }) + T(455, 204, '（CH2 的主角）', { cls: 'ts', fs: 12 })) +
    chip(320, 282, '這一份講義：變壓器 + 半波整流', '下一份：全波整流、濾波', 'c1', { fs: 13, acc: true }),
    [{ sub: '先整理一下：變壓器只是把交流變小。', on: 'A' },
     { sub: '整流、濾波、穩壓都是<b>二極體電路</b>（講義 2-2）。', on: 'B' },
     { sub: '這一份講義先講兩件事：變壓器怎麼降壓、半波整流怎麼算。', on: 'c1' }]);

  /* 06 變壓器實物 */
  const C6 = sc('變壓器：鐵心上繞兩組線圈', 'THE TRANSFORMER',
    X.xfm(320, 200, 130, { k: 'tf', n1: 9, n2: 3, l1: '一次側 N<sub>1</sub> 圈', l2: '二次側 N<sub>2</sub> 圈' }) +
    sine(70, 200, 160, 50, { cls: 'ln', k: 'w1' }) + sine(420, 200, 160, 17, { k: 'w2' }) +
    T(150, 130, 'v<sub>I</sub>：市電', { cls: 't', fs: 13, k: 'l1' }) + T(500, 130, 'v<sub>S</sub>：變小了', { cls: 'ta', fs: 13, k: 'l2' }),
    [{ sub: '變壓器：一塊鐵心，上面繞兩組線圈。接市電的叫<b>一次側</b>，輸出的叫<b>二次側</b>。', on: 'tf' },
     { sub: '一次側接交流 v<sub>I</sub>……', on: 'w1 l1' },
     { sub: '二次側感應出另一個交流 v<sub>S</sub>。圈數少，電壓就小。', on: 'w2 l2' }]);

  /* 07 匝數比 */
  const C7 = sc('圈數比 = 電壓比', 'TURNS RATIO',
    calc(110, 112, 420, [['v<sub>S</sub> / v<sub>I</sub> = N<sub>2</sub> / N<sub>1</sub>', 'r1', 'ta', 18], ['N<sub>1</sub>/N<sub>2</sub> 叫匝數比', 'r2', 'tm'], ['市電峰值 110 × √2 = 155.6 V', 'r3'], ['10 : 1 → v<sub>S</sub> 峰值 15.56 V', 'r4', 'ta']], { k: 'cc', fs: 15, lh: 32 }),
    [{ sub: '電壓跟圈數成正比：v<sub>S</sub>/v<sub>I</sub> = N<sub>2</sub>/N<sub>1</sub>（講義 2-5）。', on: 'cc r1' },
     { sub: 'N<sub>1</sub>/N<sub>2</sub> 叫<b>匝數比</b>（turns ratio）。', on: 'r2' },
     { sub: '注意 110 V 是 rms，峰值是 110 × √2 = <b>155.6 V</b>。', on: 'r3' },
     { sub: '匝數比 10:1 → 二次側峰值 <b>15.56 V</b>。', on: 'r4' }]);

  /* 08 半波整流電路 */
  const C8 = sc('半波整流：一顆二極體 + 一顆電阻', 'HALF-WAVE RECTIFIER',
    X.fig22(150, 150, 280, 130, { k: 'cir' }) +
    chip(520, 120, 'Fig 2.2(a)', '變壓器 → 二極體 → 負載 R', 'c1', { fs: 13 }),
    [{ sub: '變壓器二次側接一顆二極體，再接負載電阻 R，輸出 v<sub>O</sub> 取在 R 上（Fig 2.2）。', on: 'cir c1' },
     { sub: '分析的方法：把二極體換成模型，看 v<sub>S</sub> 落在哪個範圍。一共<b>三種情況</b>。', on: '' }]);

  /* 09–11 三種情況 */
  const caseSc = (t, en, model, rows, subs) => sc(t, en,
    X.fig22(110, 150, 260, 130, { k: 'cir', model }) + calc(420, 128, 190, rows.map((r, i) => [r, 'r' + i, i === 0 ? 'tm' : i === rows.length - 1 ? 'ta' : 't']), { k: 'cc', fs: 14 }),
    subs);
  const C9 = caseSc('情況 ①：v<sub>S</sub> &lt; 0', 'CASE 1', 'off', ['v<sub>S</sub> &lt; 0：逆偏', 'OFF → I<sub>D</sub> = 0', 'v<sub>D</sub> = v<sub>S</sub>', 'v<sub>O</sub> = 0'],
    [{ sub: 'v<sub>S</sub> 是負的：二極體被反著推，<b>OFF</b>，換成斷路。', on: 'cir cc r0 r1' },
     { sub: '沒電流，電阻沒壓降，所以 v<sub>S</sub> 全部落在二極體上：v<sub>D</sub> = v<sub>S</sub>，<b>v<sub>O</sub> = 0</b>。', on: 'r2 r3' }]);
  const C10 = caseSc('情況 ②：0 &lt; v<sub>S</sub> &lt; V<sub>γ</sub>', 'CASE 2', 'off', ['正的，但 &lt; V<sub>γ</sub>', '推不開門 → OFF', 'v<sub>D</sub> = v<sub>S</sub>', 'v<sub>O</sub> = 0'],
    [{ sub: 'v<sub>S</sub> 是正的，可是還不到 0.7 V：門推不開，<b>還是 OFF</b>。', on: 'cir cc r0 r1' },
     { sub: '跟情況 ① 一樣：v<sub>D</sub> = v<sub>S</sub>、<b>v<sub>O</sub> = 0</b>。', on: 'r2 r3' }]);
  const C11 = caseSc('情況 ③：v<sub>S</sub> &gt; V<sub>γ</sub>', 'CASE 3', 'on', ['v<sub>S</sub> &gt; V<sub>γ</sub>：ON', 'v<sub>D</sub> = V<sub>γ</sub>', 'i<sub>D</sub> = (v<sub>S</sub> − V<sub>γ</sub>)/R', 'v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>'],
    [{ sub: 'v<sub>S</sub> 超過 V<sub>γ</sub>：門打開，<b>ON</b>，二極體換成 V<sub>γ</sub> 電池。', on: 'cir cc r0 r1' },
     { sub: '電阻拿到剩下的：i<sub>D</sub> = (v<sub>S</sub> − V<sub>γ</sub>)/R。', on: 'r2' },
     { sub: '<b>v<sub>O</sub> = i<sub>D</sub>R = v<sub>S</sub> − V<sub>γ</sub></b>：輸入扣掉 0.7 V（講義 2-6）。', on: 'r3' }]);

  /* 12 先整理：三種情況 */
  const C12 = sc('先整理一下：三種情況', 'THREE CASES',
    calc(90, 112, 460, [['① v<sub>S</sub> &lt; 0　　　　　OFF　v<sub>O</sub> = 0', 'r1'], ['② 0 &lt; v<sub>S</sub> &lt; V<sub>γ</sub>　OFF　v<sub>O</sub> = 0', 'r2'], ['③ v<sub>S</sub> &gt; V<sub>γ</sub>　　　ON　 v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>', 'r3', 'ta'], ['隨時：v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>', 'r4', 'tm']], { k: 'cc', fs: 15, lh: 34 }),
    [{ sub: '先整理一下。① ② 都是 OFF，輸出 0。', on: 'cc r1 r2' },
     { sub: '③ 才 ON，輸出 = 輸入 − 0.7 V。', on: 'r3' },
     { sub: '還有一條隨時成立：二極體電壓 = 輸入 − 輸出（KVL）。', on: 'r4' }]);

  /* 13 VTC */
  const PV = axes(150, 112, 340, 168, { v0: -6, v1: 6, i0: -0.5, i1: 6, vt: [[0.7, 'V<sub>γ</sub>'], [5, '5']], it: [[4.3, '4.3']], xl: 'v<sub>S</sub>', yl: 'v<sub>O</sub>' });
  const C13 = sc('畫成一張圖：轉移特性', 'TRANSFER CHARACTERISTIC',
    PV.svg + PV.seg(-6, 0, 0, 0, 's1', 'lna', ' style="stroke-width:3.4"') + PV.seg(0, 0, 0.7, 0, 's2', 'lna', ' style="stroke-width:3.4"') + PV.seg(0.7, 0, 6, 5.3, 's3', 'lna', ' style="stroke-width:3.4"') +
    T(PV.X(-3), PV.Y(0) - 12, '①', { cls: 'ta', fs: 15, k: 'l1' }) + T(PV.X(0.35), PV.Y(0) - 12, '②', { cls: 'ta', fs: 15, k: 'l2' }) + T(PV.X(3.6), PV.Y(2.9) - 14, '③ 斜率 = 1', { cls: 'ta', fs: 14, a: 'end', k: 'l3' }) +
    PV.dot(5, 4.3, 'q', 6) + PV.proj(5, 4.3, 'qp'),
    [{ sub: '把三種情況畫成「輸出 v<sub>O</sub> 對輸入 v<sub>S</sub>」：這叫<b>電壓轉移特性（VTC）</b>，Fig 2.2(b)。', on: 's1 l1' },
     { sub: '② 也是貼地：到 V<sub>γ</sub> 之前都是 0。', on: 's2 l2' },
     { sub: '③ 過了 V<sub>γ</sub>，一條斜率 1 的直線：輸入多 1 V、輸出多 1 V。', on: 's3 l3' },
     { sub: '例如 v<sub>S</sub> = 5 V → v<sub>O</sub> = 4.3 V。', on: 'q qp' }]);

  /* 14 方法二：VTC 投影 */
  const C14 = sc('弦波進去，駝峰出來', 'SINE IN, HUMPS OUT',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'in' }) + T(84, 128, '虛線 v<sub>S</sub>', { cls: 'tm', fs: 12, a: 'start', k: 'il' }) +
    sine(80, 200, 480, 60, { cut: true, shift: 5, k: 'out' }) +
    chip(470, 290, '方法一：用公式　方法二：用 VTC 投影', '講義 2-7', 'c1', { fs: 13 }),
    [{ sub: '現在讓 v<sub>S</sub> 是一個弦波（虛線）。', on: 'in il' },
     { sub: '每一個瞬間，都照三種情況（或在 VTC 上找到對應的 v<sub>O</sub>）：負的全部變 0，正的扣掉 0.7 V。', on: 'out' },
     { sub: '兩種方法得到同一個波形：一顆一顆的駝峰（Fig 2.3(b)）。', on: 'c1' }]);

  /* 15 v_D */
  let dD = '';
  for (let n = 0; n <= 120; n++) { const u = n / 120, v = Math.sin(u * 4 * Math.PI), vd = v > 0.07 ? 0.07 : v; dD += (n ? ' L' : 'M') + f1(80 + u * 480) + ' ' + f1(200 - vd * 60); }
  const C15 = sc('二極體自己身上的電壓', 'THE DIODE VOLTAGE',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'in' }) + '<path class="lna" style="fill:none;stroke-width:2.6" d="' + dD + '"' + K.k('vd') + '/>' +
    T(140, 186, 'V<sub>γ</sub>', { cls: 'ta', fs: 13, k: 'l1' }) +
    chip(470, 128, 'v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>', 'ON：卡在 V<sub>γ</sub>　OFF：= v<sub>S</sub>', 'c1', { fs: 13, acc: true }),
    [{ sub: '再看二極體自己：v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>（講義 2-7 Note）。', on: 'in c1' },
     { sub: 'ON 的時候，它被釘在 V<sub>γ</sub>（平的那一小段）。', on: 'vd l1' },
     { sub: 'OFF 的時候，整個 v<sub>S</sub> 都在它身上 —— 包括整個<b>負半週</b>（Fig 2.3(c)）。', on: '' }]);

  /* 16 PIV */
  const C16 = sc('負半週：二極體扛最多', 'PEAK INVERSE VOLTAGE',
    sine(80, 200, 480, 60, { cls: 'ln dsh', k: 'in' }) + '<path class="lna" style="fill:none;stroke-width:2.6" d="' + dD + '"/>' +
    g('pk', '<circle class="acc" cx="260" cy="260" r="7"/>' + T(272, 284, '−V<sub>M</sub>', { cls: 'ta', fs: 15, a: 'start' })) +
    chip(470, 128, 'PIV ≥ V<sub>M</sub>', 'CH1 PART 5：逆壓不能超過 PIV', 'c1', { fs: 14, acc: true }),
    [{ sub: '負半週谷底，二極體被反著加了整整 <b>V<sub>M</sub></b>（輸入峰值）。', on: 'pk' },
     { sub: '還記得 PIV 嗎？選二極體時，它的反向峰值電壓額定要大於 V<sub>M</sub>，不然會崩潰。', on: 'c1' }]);

  /* 17 恍然大悟 */
  const C17 = sc('恍然大悟', 'THE ANSWER',
    card(60, 104, 250, 130, 'A', T(185, 132, '變壓器 10:1', { fs: 15, cls: 'ta' }) + T(185, 160, '155.6 V → 15.56 V', { cls: 'tm', fs: 13 }) + T(185, 188, '還是交流', { cls: 'ts', fs: 12 })) +
    card(330, 104, 250, 130, 'B', T(455, 132, '半波整流', { fs: 15, cls: 'ta' }) + T(455, 160, '只留正半週、扣 0.7 V', { cls: 'tm', fs: 13 }) + T(455, 188, '峰值 14.86 V 的駝峰', { fs: 14 })) +
    chip(320, 262, '交流 → 單向的脈動直流 ✓', '還要濾波、穩壓才是 5 V（下一份講義）', 'ans', { fs: 13, acc: true }),
    [{ sub: '回到開頭：插座的 110 V 交流，先被變壓器降成 15.56 V 峰值的交流。', on: 'A' },
     { sub: '再被二極體半波整流：只剩正的駝峰，峰值 14.86 V。', on: 'B' },
     { sub: '<b>交流變成單向了。</b>剩下「弄平」和「穩住」，是下一份講義的事。', on: 'ans' }]);

  window.__ch2p1Story = window.__Story('#story', {
    id: 'ch2-part1', title: 'CH2 PART 1 半波整流', after: '#map',
    scenes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13, C14, C15, C16, C17]
  });
})();
