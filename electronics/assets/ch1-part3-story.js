/* ============================================================
   電子學 CH1 PART 3（投影片 1-16～1-37）—— 故事模式
   寫法：照 PART 1 的節奏 —— 前半只講直覺（擠過去、碰到抵消、留下離子、擋板、旋轉門），
         「先整理一下」之後才加數字和公式。
   開頭先補兩塊拼圖（投影片 1-16～1-18，10/3 從 PART 2 搬過來）：
     小謎題：電子、電洞的 D、μ 差將近 3 倍，相除卻都是 0.026 → 愛因斯坦關係；照一道光 → 多出載子。
   主線謎題：電池反接，1 V 跟 10 V 的電流都只有約 10⁻¹⁴ A，一動也不動。為什麼？
   答案：逆偏把位障墊高，多數載子過不去；剩下的電流只靠「數量固定」的少數載子。
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story) return;
  const D = window.__Story.draw;
  const { e, h, line, text, arrow, chip } = D;
  const k = key => ' data-k="' + key + '"';
  const g = (key, inner, attrs) => '<g' + (key ? k(key) : '') + (attrs || '') + '>' + inner + '</g>';
  const T = (x, y, s, o) => text(x, y, s, o);
  const rnd = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const ring = (x, y, sign) => '<circle class="ring" cx="' + x + '" cy="' + y + '" r="8"/>' + T(x, y, sign, { cls: 'ta', fs: 12, dy: '.35em' });
  const ringGray = (x, y, sign) => '<circle cx="' + x + '" cy="' + y + '" r="8" style="fill:none;stroke:var(--s-line);stroke-width:1.3"/>' + T(x, y, sign, { cls: 'ts', fs: 12, dy: '.35em' });

  /* pn 塊：x 90～550、y 118～242，接面在 320 */
  const X0 = 90, X1 = 550, XM = 320, Y0 = 118, Y1 = 242;
  const ROWS = [136, 166, 196, 226];
  function ions(cols, sign, gray) {
    let s = '';
    cols.forEach(dx => ROWS.forEach(y => { s += (gray ? ringGray : ring)(XM + dx, y, sign); }));
    return s;
  }
  function carriers(kind, x0, x1, n, seed, avoid) {
    const r = rnd(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = Y0 + 12 + r() * (Y1 - Y0 - 24);
      if (avoid && Math.abs(x - XM) < avoid) continue;
      s += kind === 'h' ? h(x.toFixed(1), y.toFixed(1), null, 6) : e(x.toFixed(1), y.toFixed(1), null, 5.5);
    }
    return s;
  }
  const slabs = (key, bare) => g(key, '<rect class="bgw" x="' + X0 + '" y="' + Y0 + '" width="' + (XM - X0) + '" height="' + (Y1 - Y0) + '" rx="8"/>' +
    '<rect class="bgw" x="' + XM + '" y="' + Y0 + '" width="' + (X1 - XM) + '" height="' + (Y1 - Y0) + '" rx="8"/>') +
    (bare ? '' : T((X0 + XM) / 2, Y0 - 10, 'P 型', { cls: 't', fs: 14, k: key + 'Lp' }) + T((XM + X1) / 2, Y0 - 10, 'N 型', { cls: 't', fs: 14, k: key + 'Ln' }));
  const depl = (key, half) => '<rect' + k(key) + ' x="' + (XM - half) + '" y="' + Y0 + '" width="' + (2 * half) + '" height="' + (Y1 - Y0) + '" class="card" style="stroke:var(--s-ink);stroke-dasharray:5 4;stroke-width:1.2"/>';

  const dim = keys => keys.split(' ').reduce((o, kk) => (o[kk] = 0.15, o), {});
  const sCurve = top => {
    let d = 'M90 270 H250';
    for (let i = 0; i <= 30; i++) { const u = i / 30, y = 270 - (270 - top) * (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)); d += ' L' + (250 + u * 140).toFixed(1) + ' ' + y.toFixed(1); }
    return d + ' L550 ' + top;
  };

  /* ════════════ 00 謎題 ════════════ */
  function diode(x, y, key) {
    return g(key, '<rect class="bgw" x="' + (x - 70) + '" y="' + (y - 26) + '" width="70" height="52" rx="6"/>' +
      '<rect class="bgw" x="' + x + '" y="' + (y - 26) + '" width="70" height="52" rx="6"/>' +
      T(x - 35, y, 'p', { fs: 18, dy: '.35em' }) + T(x + 35, y, 'n', { fs: 18, dy: '.35em' }));
  }
  const S0 = {
    t: '反接的電池', en: 'THE QUESTION',
    svg: diode(320, 140, 'd') +
      g('wire', '<path class="ln" d="M250 140 H150 V280 H300 M340 280 H490 V140 H390"/>' +
        '<line class="ln" x1="304" y1="266" x2="304" y2="294" style="stroke-width:3.4"/><line class="ln" x1="336" y1="258" x2="336" y2="302"/>' +
        T(290, 262, '−', { fs: 18 }) + T(352, 254, '+', { fs: 18 })) +
      T(420, 302, 'V_R = 1 V', { cls: 't', fs: 15, a: 'start', k: 'v' }) +
      g('am', '<circle class="bgw" cx="490" cy="210" r="30"/>' + T(490, 210, 'A', { fs: 18, dy: '.35em' })) +
      chip(150, 96, 'P 接負、N 接正', '反著接 = 逆向偏壓', 'cR', { fs: 12.5 }) +
      T(448, 200, '電流', { cls: 'tm', fs: 12, a: 'end', k: 'iL' }) + T(448, 226, '≈ 10⁻¹⁴ A', { cls: 'ta', fs: 17, a: 'end', k: 'i' }) +
      T(320, 240, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: '主線謎題：P、N 黏在一起就是<b>二極體</b>。接上電池 —— 但是<b>反著接</b>。', on: 'd wire v cR' },
      { sub: '電流錶幾乎不動：只有大約 <b>10⁻¹⁴ A</b>，一百兆分之一安培。', on: 'am iL i' },
      { sub: '把電池加到 <b>10 V</b>，電壓變 10 倍 —— 電流<b>還是一樣</b>，一動也不動。', txt: { v: 'V_R = 10 V' } },
      { sub: '電壓加大、電流卻不變，很奇怪。要搞懂，得先看 P 跟 N 黏在一起的時候，發生了什麼事。', op: dim('d wire v cR am iL i'), on: 'q' }
    ]
  };

  /* ════════════ 01 兩塊材料 ════════════ */
  const blockL = g('bl', '<rect class="bgw" x="' + (X0 - 30) + '" y="' + Y0 + '" width="' + (XM - X0) + '" height="' + (Y1 - Y0) + '" rx="8"/>' +
    carriers('h', X0 - 20, XM - 40, 18, 3) + T((X0 + XM) / 2 - 30, Y0 - 10, 'P 型', { cls: 't', fs: 14 }));
  const blockR = g('br', '<rect class="bgw" x="' + (XM + 30) + '" y="' + Y0 + '" width="' + (X1 - XM) + '" height="' + (Y1 - Y0) + '" rx="8"/>' +
    carriers('e', XM + 40, X1 + 20, 18, 7) + T((XM + X1) / 2 + 30, Y0 - 10, 'N 型', { cls: 't', fs: 14 }));
  const S1 = {
    t: '兩塊材料', en: 'P-TYPE AND N-TYPE',
    svg: blockL + blockR +
      chip(175, 290, '電洞很多', 'P 型的多數載子', 'cp', { fs: 12.5 }) + chip(465, 290, '電子很多', 'N 型的多數載子', 'cn', { fs: 12.5 }),
    steps: [
      { sub: '先準備兩塊材料。左邊 <b>P 型</b>：裡面電洞很多。', on: 'bl cp' },
      { sub: '右邊 <b>N 型</b>：裡面電子很多。兩塊都是電中性，各自安安靜靜。', on: 'br cn' },
      { sub: '現在，把它們<b>黏在一起</b>。', off: 'cp cn', mv: { bl: [30, 0], br: [-30, 0] } }
    ]
  };

  /* ════════════ 02 擠過去 ════════════ */
  const base = bare => slabs('s', bare) + g('hF', carriers('h', X0 + 10, XM - 60, 16, 3)) + g('eF', carriers('e', XM + 60, X1 - 10, 16, 7));
  const S2 = {
    t: '一接上：擠過去', en: 'DIFFUSION ACROSS THE JUNCTION',
    svg: base() + g('hN', carriers('h', XM - 58, XM - 10, 6, 5)) + g('eN', carriers('e', XM + 10, XM + 58, 6, 9)) +
      g('a1', arrow(250, 96, 390, 96, null, 'lna') + T(320, 86, '電洞 → N', { cls: 'ta', fs: 12 })) +
      g('a2', arrow(390, 268, 250, 268, null, 'ln') + T(320, 286, '電子 → P', { cls: 't', fs: 12 })) +
      chip(320, 318, '就是 PART 2 的「擠」（擴散）', '從擠的地方往空的地方跑', 'cD', { fs: 12.5, acc: true }),
    steps: [
      { sub: '一接上，接面兩邊差很多：P 這邊擠滿電洞，N 那邊幾乎沒有電洞。', on: 's sLp sLn hF hN eF eN' },
      { sub: '還記得 PART 2 的「<b>擠</b>」嗎？電洞自然往 N 那邊跑 ——', on: 'a1', mv: { hN: [70, 0] } },
      { sub: '電子也一樣，往 P 那邊跑。', on: 'a2', mv: { eN: [-70, 0] } },
      { sub: '這就是 PART 2 的<b>擴散</b>：不用任何人推，濃度差自己就會讓它們動。', on: 'cD' }
    ]
  };

  /* ════════════ 03 碰到就抵消 ════════════ */
  const S3 = {
    t: '碰到就抵消', en: 'RECOMBINATION',
    svg: base() + g('hX', carriers('h', XM + 12, XM + 60, 6, 5)) + g('eX', carriers('e', XM - 60, XM - 12, 6, 9)) +
      g('f1', '<circle class="ring" cx="350" cy="160" r="14"/><circle class="ring" cx="372" cy="214" r="14"/><circle class="ring" cx="340" cy="232" r="12"/>') +
      g('f2', '<circle class="ring" cx="290" cy="150" r="14"/><circle class="ring" cx="270" cy="206" r="14"/><circle class="ring" cx="298" cy="226" r="12"/>') +
      chip(320, 300, '接面附近的載子越來越少', null, 'cL', { fs: 13, acc: true }),
    steps: [
      { sub: '跑到 N 區的電洞，一進去就撞上滿滿的電子 ——', on: 's sLp sLn hF eF hX' },
      { sub: '一碰就抵消（<b>復合</b>），兩個一起不見了。', off: 'hX', on: 'f1', cls: { f1: 'pulse' } },
      { sub: '跑到 P 區的電子也一樣，撞上電洞就一起消失。', off: 'f1', on: 'eX' },
      { sub: '結果：接面附近能動的載子<b>越來越少</b>。', off: 'eX', on: 'f2 cL', cls: { f2: 'pulse' } }
    ]
  };

  /* ════════════ 04 留下來的離子 ════════════ */
  const S4 = {
    t: '人走了，原子還在', en: 'FIXED IONS LEFT BEHIND',
    svg: base() + g('gP', ions([-12, -30, -48], '−', true)) + g('gN', ions([12, 30, 48], '+', true)) +
      g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      chip(150, 292, 'B⁻：帶負電', '電洞走了 = 硼收了一個電子', 'cB', { fs: 12.5 }) + chip(490, 292, 'P⁺：帶正電', '磷的電子走了', 'cP', { fs: 12.5 }) +
      chip(320, 88, '固定在晶格上，一動也不動', null, 'cFix', { fs: 13, acc: true }),
    steps: [
      { sub: '可是原子本身<b>不會跑</b>。接面附近的磷、硼都還留在原地。', on: 's sLp sLn hF eF gP gN' },
      { sub: 'N 這邊的磷：它的電子跑掉了 → 留下帶<b>正電</b>的 <b>P⁺</b>。', off: 'gN', on: 'iN cP' },
      { sub: 'P 這邊的硼：電洞跑掉了（等於硼收了一個電子）→ 留下帶<b>負電</b>的 <b>B⁻</b>。', off: 'gP', on: 'iP cB' },
      { sub: '這些離子被固定在晶格上，<b>一動也不動</b>。', on: 'cFix', cls: { iP: 'pulse', iN: 'pulse' } }
    ]
  };

  /* ════════════ 05 空乏區 ════════════ */
  const S5 = {
    t: '空乏區：空掉的一條', en: 'DEPLETION REGION',
    svg: base() + depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      chip(320, 300, '空乏區 depletion region', '只有固定的離子，沒有能動的載子', 'cD', { fs: 13, acc: true }) +
      chip(320, 88, '沒有載子 → 不導電', '像河中間一段乾掉的河床', 'cN', { fs: 12.5 }),
    steps: [
      { sub: '看中間這一條：能動的載子全跑光了，只剩固定的離子。', on: 's sLp sLn hF eF iP iN dz' },
      { sub: '「空乏」就是「空掉了」—— 這一條叫<b>空乏區</b>。', on: 'cD' },
      { sub: '沒有載子，就<b>不導電</b>。像一條河中間，突然出現一段乾掉的河床。', on: 'cN' }
    ]
  };

  /* ════════════ 06 內建電場＝擋板 ════════════ */
  const wall = '<rect' + k('wall') + ' x="314" y="112" width="12" height="136" rx="3" class="acc" opacity=".45"/>';
  const S6 = {
    t: '內建電場：一塊擋板', en: 'BUILT-IN ELECTRIC FIELD',
    svg: base() + depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) + wall +
      g('E', arrow(372, 268, 268, 268, null, 'lna') + T(320, 288, '電場：從 + 指向 −（N → P）', { cls: 'ta', fs: 12.5 })) +
      chip(100, 90, '一邊 −', 'B⁻', 'cM', { fs: 12.5 }) + chip(540, 90, '一邊 +', 'P⁺', 'cPl', { fs: 12.5 }) +
      chip(320, 322, '內建電場 = 一塊擋板', '立在接面中間', 'cW', { fs: 13, acc: true }),
    steps: [
      { sub: '空乏區的左邊是一排<b>負離子</b>、右邊是一排<b>正離子</b>。', on: 's sLp sLn hF eF dz iP iN cM cPl' },
      { sub: '正負電荷之間會產生<b>電場</b>，方向從正指向負 —— 也就是<b>由 N 指向 P</b>。', on: 'E' },
      { sub: '這叫<b>內建電場</b>。它就像一塊<b>擋板</b>，立在接面正中間。', on: 'wall cW' }
    ]
  };

  /* ════════════ 07 擋板擋住誰 ════════════ */
  const S7 = {
    t: '擋板擋住誰？', en: 'THE FIELD PUSHES BACK',
    svg: base(1) + depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) + wall +
      g('E', arrow(372, 268, 268, 268, null, 'lna')) +
      g('hb', h(150, 82, null, 6.5) + arrow(162, 76, 212, 76, null, 'ln') + arrow(212, 90, 162, 90, null, 'lna')) +
      T(150, 106, '電洞想過去 → 被推回來', { cls: 't', fs: 12, k: 'cH' }) +
      g('eb', e(490, 82, null, 6) + arrow(478, 76, 428, 76, null, 'ln') + arrow(428, 90, 478, 90, null, 'lna')) +
      T(490, 106, '電子想過去 → 被推回來', { cls: 't', fs: 12, k: 'cE' }) +
      chip(320, 304, '擠過去越多 → 離子越多 → 擋板越高', '最後高到擠不過去為止', 'cG', { fs: 13, acc: true }),
    steps: [
      { sub: '電洞還想往右擠過去 —— 可是擋板（電場）把它<b>推回來</b>。', on: 's hF eF dz iP iN wall E hb cH' },
      { sub: '電子想往左擠過去 —— <b>也被推回來</b>。', on: 'eb cE' },
      { sub: '擠過去的越多 → 留下的離子越多 → 擋板越高。最後擋板高到<b>擠不過去</b>為止。', on: 'cG' }
    ]
  };

  /* ════════════ 08 旋轉門：動態熱平衡 ════════════ */
  const S8 = {
    t: '兩邊一樣多：動態熱平衡', en: 'DYNAMIC EQUILIBRIUM',
    svg: slabs('s', 1) + g('hF', carriers('h', X0 + 10, XM - 60, 16, 3)) + g('eF', carriers('e', XM + 60, X1 - 10, 16, 7)) +
      depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      g('dif', arrow(230, 92, 410, 92, null, 'ln') + T(420, 92, '擴散（翻過去的多數載子）', { cls: 't', fs: 12.5, a: 'start', dy: '.35em' })) +
      g('dri', arrow(410, 276, 230, 276, null, 'lna') + T(220, 276, '漂移（被拉過去的少數載子）', { cls: 'ta', fs: 12.5, a: 'end', dy: '.35em' })) +
      g('mn', h(470, 200, null, 6) + arrow(462, 200, 380, 200, null, 'lna') + e(170, 160, null, 5.5) + arrow(178, 160, 262, 160, null, 'lna')) +
      chip(320, 318, '兩股一樣大、方向相反 → 總電流 = 0', null, 'cEq', { fs: 13, acc: true }) +
      chip(320, 318, '像兩邊人數一樣多的旋轉門', '一直有人在過，但兩邊人數不變', 'cDoor', { fs: 13, acc: true }),
    steps: [
      { sub: '擋板不是密不透風：偶爾有<b>能量特別大</b>的多數載子翻過去。這是<b>擴散電流</b>。', on: 's hF eF dz iP iN dif', op: { hF: 0.3, eF: 0.3 } },
      { sub: '反過來，<b>少數載子</b>（N 區零星的電洞、P 區零星的電子）一碰到擋板，反而被電場<b>拉過去</b>。這是<b>漂移電流</b>。', on: 'mn dri' },
      { sub: '兩股電流<b>一樣大、方向相反</b>，加起來總電流 = 0。', on: 'cEq' },
      { sub: '像兩邊人數一樣多的旋轉門：一直有人在過，但兩邊人數不變。這叫<b>動態熱平衡</b>。', off: 'cEq', on: 'cDoor' }
    ]
  };

  /* ════════════ 09 觀念整理 ════════════ */
  const card = (x, key, title, l1, l2) => g(key, '<rect class="card" x="' + x + '" y="100" width="176" height="150" rx="14" filter="url(#st-sh)"/>' +
    T(x + 88, 134, title, { cls: 'ta', fs: 17 }) + T(x + 88, 176, l1, { cls: 'tm', fs: 13 }) + T(x + 88, 204, l2, { cls: 'tm', fs: 13 }));
  const S9 = {
    t: '先整理一下', en: 'SO FAR',
    svg: card(40, 'A', '空乏區', '載子跑光、只剩離子', '不導電') +
      card(232, 'B', '內建電場', 'N → P，像一塊擋板', '擋住多數載子') +
      card(424, 'C', '熱平衡', '擴散 = 漂移', '總電流 = 0') +
      chip(320, 296, '觀念到這裡就齊了', '接下來：把「擋板多高」變成可以算的數字', 'cN', { fs: 13, acc: true }),
    steps: [
      { sub: '整理一下。P 跟 N 一接上，中間長出<b>空乏區</b>：載子跑光、只剩離子。', on: 'A' },
      { sub: '離子產生<b>內建電場</b>，像擋板一樣擋住多數載子。', on: 'B' },
      { sub: '擴散跟漂移打平，總電流 = 0，這是<b>熱平衡</b>。', on: 'C' },
      { sub: '觀念就這三個。接下來加一點數學：擋板到底<b>多高</b>？', on: 'cN' }
    ]
  };

  /* ════════════ 逆偏：擋板更高 ════════════ */
  const SR = {
    t: '逆偏：擋板更高', en: 'REVERSE BIAS RAISES THE BARRIER',
    svg: g('ax', arrow(70, 290, 70, 96, null, 'ln') + T(78, 98, '電位', { cls: 'tm', fs: 12, a: 'start' }) + T(150, 300, 'P 側', { cls: 'ts', fs: 12 }) + T(480, 300, 'N 側', { cls: 'ts', fs: 12 })) +
      '<path class="lna" style="stroke-width:3;fill:none" d="' + sCurve(170) + '"' + k('cv') + '/>' +
      '<path class="lna" style="stroke-width:3;fill:none" d="' + sCurve(104) + '"' + k('cv2') + '/>' +
      g('vb', '<path class="ln" d="M560 270 H585 M560 170 H585"/>' + arrow(578, 262, 578, 178, null, 'lna') + arrow(578, 178, 578, 262, null, 'lna') + T(570, 220, 'V_bi', { cls: 'ta', fs: 15, a: 'end' })) +
      g('vb2', '<path class="ln" d="M560 270 H585 M560 104 H585"/>' + arrow(578, 262, 578, 112, null, 'lna') + arrow(578, 112, 578, 262, null, 'lna') + T(570, 190, 'V_bi + V_R', { cls: 'ta', fs: 15, a: 'end' })) +
      g('ball', h(200, 258, null, 9)) +
      chip(230, 150, '多數載子更爬不上去', '擴散電流 ≈ 0', 'cNo', { fs: 12.5, acc: true }),
    steps: [
      { sub: '這一段先看<b>逆偏</b>（P 接負、N 接正）。這是熱平衡時那道坡，高 V<sub>bi</sub>。', on: 'ax cv vb ball' },
      { sub: '逆偏時，外加電場跟擋板<b>同方向</b> → 坡被墊得更高：<b>V<sub>bi</sub> + V<sub>R</sub></b>。', op: { cv: 0.2 }, off: 'vb', on: 'cv2 vb2' },
      { sub: '多數載子更爬不上去了 —— 擴散電流幾乎是 <b>0</b>。', on: 'cNo' }
    ]
  };

  /* ════════════ 05 電位障 ════════════ */
  let curve5 = 'M90 270 L250 270';
  for (let i = 0; i <= 30; i++) { const u = i / 30, y = 270 - 130 * (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)); curve5 += ' L' + (250 + u * 140).toFixed(1) + ' ' + y.toFixed(1); }
  curve5 += ' L550 140';
  const P5 = {
    t: '電位障：一道坡', en: 'POTENTIAL BARRIER',
    svg: g('ax', arrow(70, 290, 70, 100, null, 'ln') + T(78, 100, '電位', { cls: 'tm', fs: 12, a: 'start' }) + T(150, 300, 'P 側', { cls: 'ts', fs: 12 }) + T(480, 300, 'N 側', { cls: 'ts', fs: 12 })) +
      '<path class="lna" style="stroke-width:3" d="' + curve5 + '"' + k('cv') + '/>' +
      g('vb', '<path class="ln" d="M560 270 H585 M560 140 H585"/>' + arrow(578, 262, 578, 148, null, 'lna') + arrow(578, 148, 578, 262, null, 'lna') + T(570, 205, 'V_bi', { cls: 'ta', fs: 16, a: 'end' })) +
      g('ball', h(200, 258, null, 9)) +
      chip(240, 126, '多數載子要翻過這道坡', '坡越高，擴散越難', 'cU', { fs: 12.5 }) +
      chip(450, 102, '矽：約 0.6～0.8 V', '內建電壓 built-in voltage', 'cV', { fs: 12.5 }),
    steps: [
      { sub: '先把「擋板」換成一張圖：畫出兩側的<b>電位</b>，N 側比 P 側高出一截，像一道<b>坡</b>。', on: 'ax cv vb' },
      { sub: '這個高度差叫<b>內建電壓 V<sub>bi</sub></b>。P 區的電洞要擴散到 N 區，得先爬上這道坡。', on: 'ball cU' },
      { sub: '大部分電洞爬不上去，只有少數能量夠大的翻得過去。', mv: { ball: [90, -60] } },
      { sub: '矽的 V<sub>bi</sub> 大約 0.6～0.8 V。注意：它是 <b>built</b>-in（內建的），不是 build-in。', mv: { ball: [0, 0] }, on: 'cV' }
    ]
  };

  /* ════════════ 06 ln 的威力 ════════════ */
  const P6 = {
    t: '內建電壓怎麼算', en: 'V_bi = V_T · ln(NaNd / nᵢ²)',
    svg: T(320, 112, 'V<tspan font-size="13" dy="5">bi</tspan><tspan dy="-5"> = V</tspan><tspan font-size="13" dy="5">T</tspan><tspan dy="-5"> · ln( N</tspan><tspan font-size="13" dy="5">a</tspan><tspan dy="-5">N</tspan><tspan font-size="13" dy="5">d</tspan><tspan dy="-5"> / n</tspan><tspan font-size="13" dy="5">i</tspan><tspan font-size="12" dy="-14">2</tspan><tspan dy="9"> )</tspan>', { cls: 't', fs: 25, k: 'f' }) +
      chip(320, 152, 'V_T = kT/e ≈ 26 mV（熱電壓）', '就是開頭愛因斯坦關係的那個 kT/e', 'cVt', { fs: 12.5 }) +
      T(320, 206, '(0.026) · ln[ (10¹⁶)(10¹⁷) / (1.5×10¹⁰)² ]', { cls: 'tm', fs: 16, k: 's1' }) +
      T(320, 238, '= 0.026 × 29.1 = 0.757 V', { cls: 'ta', fs: 22, k: 's2' }) +
      chip(320, 296, 'N_a 乘 10 倍 → V_bi 只多 60 mV', 'ln 把十幾個數量級壓成一個小數字', 'cLn', { fs: 13, acc: true }),
    steps: [
      { sub: '坡有多高？只跟兩件事有關：<b>兩邊摻多少</b>、<b>溫度</b>。寫成公式長這樣 ——', on: 'f' },
      { sub: 'V<sub>T</sub> = kT/e 叫<b>熱電壓</b>，室溫約 26 mV —— 就是上一段愛因斯坦關係裡的那個 kT/e。', on: 'cVt' },
      { sub: '代課本 Example 1.5：N<sub>a</sub> = 10¹⁶、N<sub>d</sub> = 10¹⁷ ——', off: 'cVt', on: 's1' },
      { sub: '得到 <b>0.757 V</b>。', on: 's2' },
      { sub: '因為取了 ln，摻雜差 10 倍，V<sub>bi</sub> 只差 <b>60 mV</b>。所以不管怎麼摻，矽的 V<sub>bi</sub> 都在 0.6～0.8 V 附近。', on: 'cLn' }
    ]
  };

  /* ════════════ 07 接法 ════════════ */
  function circuit(cx, key, rev) {
    const x0 = cx - 120, x1 = cx + 120;
    return g(key, '<rect class="bgw" x="' + (cx - 60) + '" y="112" width="60" height="44" rx="5"/><rect class="bgw" x="' + cx + '" y="112" width="60" height="44" rx="5"/>' +
      T(cx - 30, 134, 'p', { fs: 16, dy: '.35em' }) + T(cx + 30, 134, 'n', { fs: 16, dy: '.35em' }) +
      '<path class="ln" d="M' + (cx - 60) + ' 134 H' + x0 + ' V220 H' + (cx - 10) + ' M' + (cx + 10) + ' 220 H' + x1 + ' V134 H' + (cx + 60) + '"/>' +
      '<line class="ln" x1="' + (cx + (rev ? -6 : 6)) + '" y1="208" x2="' + (cx + (rev ? -6 : 6)) + '" y2="232" style="stroke-width:3.4"/>' +
      '<line class="ln" x1="' + (cx + (rev ? 6 : -6)) + '" y1="200" x2="' + (cx + (rev ? 6 : -6)) + '" y2="240"/>' +
      T(cx - 22, 202, rev ? '−' : '+', { fs: 16 }) + T(cx + 22, 202, rev ? '+' : '−', { fs: 16 }));
  }
  const P7 = {
    t: '順向還是逆向', en: 'FORWARD VS REVERSE BIAS',
    svg: circuit(170, 'fw', false) + circuit(470, 'rv', true) +
      T(170, 96, '順向偏壓', { cls: 'ta', fs: 15, k: 'fwL' }) + T(470, 96, '逆向偏壓', { cls: 't', fs: 15, k: 'rvL' }) +
      chip(170, 278, 'P 接 +、N 接 −', '外加電場跟內建電場「反向」', 'cF', { fs: 12.5 }) +
      chip(470, 278, 'P 接 −、N 接 +', '外加電場跟內建電場「同向」', 'cR', { fs: 12.5 }) +
      chip(320, 318, '記法：P 接 Positive 就是順向', '這一段先看逆偏，順偏在 PART 4', 'cM', { fs: 12.5, acc: true }),
    steps: [
      { sub: '現在接上電池。接法只有兩種 ——', on: 'fw fwL rv rvL' },
      { sub: '<b>順向偏壓</b>：P 接正、N 接負。外加電場跟內建電場反方向，把坡<b>壓低</b>。', on: 'cF' },
      { sub: '<b>逆向偏壓</b>：P 接負、N 接正。外加電場跟內建電場同方向，把坡<b>墊高</b>。', on: 'cR' },
      { sub: '記法：<b>P 接 Positive 就是順向</b>。這一段先看逆偏，順偏留到 PART 4。', on: 'cM' }
    ]
  };

  /* ════════════ 08 逆偏：空乏區變寬 ════════════ */
  const P8 = {
    t: '逆偏：空乏區變寬', en: 'REVERSE BIAS · WIDER DEPLETION',
    svg: slabs('s', 1) + g('hF', carriers('h', X0 + 10, XM - 110, 14, 3)) + g('hM', carriers('h', XM - 108, XM - 62, 5, 13)) +
      g('eF', carriers('e', XM + 110, X1 - 10, 14, 7)) + g('eM', carriers('e', XM + 62, XM + 108, 5, 15)) +
      depl('dz', 58) + depl('dz2', 104) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      g('iP2', ions([-66, -84], '−')) + g('iN2', ions([66, 84], '+')) +
      g('E1', arrow(372, 268, 268, 268, null, 'lna') + T(320, 286, 'Ē', { cls: 'ta', fs: 13 })) +
      g('E2', arrow(430, 300, 210, 300, null, 'lna') + T(440, 300, 'E_total = Ē + E_A', { cls: 'ta', fs: 13, a: 'start', dy: '.35em' })) +
      chip(150, 88, '位障：V_bi → V_bi + V_R', null, 'cB', { fs: 12.5 }) +
      chip(470, 88, 'W ∝ √(V_bi + V_R)', '越拉越難變寬', 'cW', { fs: 12.5 }),
    steps: [
      { sub: '坡變高，空乏區也跟著變：外加電場跟內建電場同方向，總電場<b>變強</b>。', on: 's hF hM eF eM dz iP iN E1' },
      { sub: '更強的電場把空乏區邊緣的電洞往左拉、電子往右拉 ——', off: 'E1', on: 'E2', mv: { hM: [-50, 0], eM: [50, 0] } },
      { sub: '露出更多離子，<b>空乏區變寬</b>。', off: 'hM eM dz', on: 'dz2 iP2 iN2' },
      { sub: '坡也從 V<sub>bi</sub> 墊高到 <b>V<sub>bi</sub> + V<sub>R</sub></b>。寬度跟它的平方根成正比，所以電壓越大越難再變寬。', on: 'cB cW' }
    ]
  };

  /* ════════════ 09 只剩少數載子 ════════════ */
  const P9 = {
    t: '只剩少數載子：I_S', en: 'REVERSE SATURATION CURRENT',
    svg: slabs('s', 1) + g('hF', carriers('h', X0 + 10, XM - 110, 14, 3)) + g('eF', carriers('e', XM + 110, X1 - 10, 14, 7)) +
      depl('dz2', 104) + g('iP', ions([-12, -30, -48, -66, -84], '−')) + g('iN', ions([12, 30, 48, 66, 84], '+')) +
      g('blk', h(196, 182, null, 7) + arrow(204, 182, 236, 182, null, 'ln') + T(196, 206, '過不去', { cls: 't', fs: 11.5 })) +
      h(450, 150, 'mh', 8) + e(190, 216, 'me', 7.5) +
      chip(320, 88, '少數載子：被電場「順風」帶過去', 'N 區的電洞、P 區的電子', 'cM', { fs: 12.5 }) +
      chip(320, 296, 'i_D ≈ −I_S（矽約 10⁻¹⁴ A）', '數量受限於少數載子，跟 V_R 無關', 'cI', { fs: 13, acc: true }) +
      chip(320, 296, '像水塔只剩一點點水', '閘門開再大，流出來的也就那麼多', 'cW', { fs: 12.5 }),
    steps: [
      { sub: '坡太高了：P 區的電洞、N 區的電子（多數載子）<b>統統翻不過去</b>，擴散電流 ≈ 0。', on: 's hF eF dz2 iP iN blk' },
      { sub: '剩下的只有<b>少數載子</b>：N 區零星的電洞、P 區零星的電子。這個電場對它們是順風。', on: 'mh me cM' },
      { sub: '它們先擴散到空乏區邊緣，再被電場一掃就過去了。', mv: { mh: [-260, 0], me: [260, 0] } },
      { sub: '少數載子本來就少得可憐，所以電流極小：這叫<b>逆向飽和電流 I<sub>S</sub></b>。', on: 'cI' },
      { sub: '像水塔裡只剩一點點水：閘門開再大，流出來的也就那麼多。電壓加大，I<sub>S</sub> <b>也不會變大</b>。', off: 'cI', on: 'cW' }
    ]
  };

  /* ════════════ 10 空乏區＝電容 ════════════ */
  const plate = (x, key) => '<rect' + (key ? k(key) : '') + ' x="' + (x - 4) + '" y="112" width="8" height="136" class="ink" rx="2"/>';
  const P10 = {
    t: '空乏區就是一顆電容', en: 'JUNCTION CAPACITANCE',
    svg: slabs('s') + depl('dz', 58) + g('iP', ions([-12, -30, -48], '−')) + g('iN', ions([12, 30, 48], '+')) +
      g('cap', plate(255, null) + plate(385, null) + '<rect x="262" y="118" width="116" height="124" class="accw" opacity=".6"/>' +
        T(320, 262, '絕緣層（空乏區）', { cls: 'ta', fs: 13 }) + T(175, 262, 'P 區（導體）＝ 極板', { cls: 'tm', fs: 12 }) + T(465, 262, 'N 區（導體）＝ 極板', { cls: 'tm', fs: 12 })) +
      T(320, 92, 'C = εA / d', { cls: 'ta', fs: 22, k: 'f' }) +
      chip(320, 312, 'd 就是空乏區寬度 W', 'V_R ↑ → W ↑ → C ↓', 'cD', { fs: 13, acc: true }),
    steps: [
      { sub: '再看一次空乏區：沒有載子 → 不導電 → 像一層<b>絕緣體</b>。', on: 's sLp sLn dz iP iN' },
      { sub: '兩側的 P 區和 N 區可以導電，像兩塊<b>極板</b>。中間夾一層絕緣體 —— 這不就是電容嗎？', on: 'cap' },
      { sub: '平行板電容：<b>C = εA/d</b>。', on: 'f' },
      { sub: '這裡的 d 就是空乏區寬度 W。逆偏越大 → W 越寬 → <b>電容越小</b>。', on: 'cD' }
    ]
  };

  /* ════════════ 11 C_j 公式 ════════════ */
  let cj = '';
  for (let i = 0; i <= 60; i++) { const v = i / 6, c = Math.pow(1 + v / 0.637, -0.5); cj += (i ? ' L' : 'M') + (120 + v * 40).toFixed(1) + ' ' + (290 - 160 * c).toFixed(1); }
  const P11 = {
    t: '接面電容 C_j', en: 'C_j = C_j0 (1 + V_R / V_bi)^−1/2',
    svg: T(320, 100, 'C<tspan font-size="13" dy="5">j</tspan><tspan dy="-5"> = C</tspan><tspan font-size="13" dy="5">j0</tspan><tspan dy="-5"> · (1 + V</tspan><tspan font-size="13" dy="5">R</tspan><tspan dy="-5"> / V</tspan><tspan font-size="13" dy="5">bi</tspan><tspan dy="-5">)</tspan><tspan font-size="13" dy="-12">−1/2</tspan>', { cls: 't', fs: 24, k: 'f' }) +
      g('ax', arrow(120, 290, 540, 290, null, 'ln') + arrow(120, 290, 120, 120, null, 'ln') + T(540, 306, 'V_R', { cls: 'ts', fs: 12 }) + T(128, 122, 'C_j', { cls: 'ts', fs: 12, a: 'start' })) +
      '<path class="lna" style="stroke-width:2.8" d="' + cj + '"' + k('cv') + '/>' +
      g('p1', '<circle class="e" cx="160" cy="' + (290 - 160 * 0.624).toFixed(1) + '" r="6"/>' + T(172, 290 - 160 * 0.624 - 12, '1 V：0.312 pF', { cls: 'ta', fs: 12.5, a: 'start' })) +
      g('p5', '<circle class="e" cx="320" cy="' + (290 - 160 * 0.336).toFixed(1) + '" r="6"/>' + T(332, 290 - 160 * 0.336 - 12, '5 V：0.168 pF', { cls: 'ta', fs: 12.5, a: 'start' })) +
      chip(430, 160, 'Example 1.6', 'V_bi = 0.637 V、C_j0 = 0.5 pF', 'cEx', { fs: 12.5 }),
    steps: [
      { sub: '把 W ∝ √(V<sub>bi</sub> + V<sub>R</sub>) 代進 C = εA/W，再用 V<sub>R</sub> = 0 時的 C<sub>j0</sub> 當基準 ——', on: 'f' },
      { sub: '畫出來：逆偏越大，電容越小，而且一開始掉得最快。', on: 'ax cv' },
      { sub: '課本 Example 1.6：V<sub>R</sub> = 1 V 時 <b>0.312 pF</b> ——', on: 'cEx p1' },
      { sub: 'V<sub>R</sub> = 5 V 時只剩 <b>0.168 pF</b>。都是 pF 等級，很小。', on: 'p5' }
    ]
  };

  /* ════════════ 12 變容二極體 ════════════ */
  let dial = '';
  for (let v = 60; v <= 130; v += 10) dial += line(70 + (v - 60) * 7, 214, 70 + (v - 60) * 7, 226, null, 'ln') + T(70 + (v - 60) * 7, 244, String(v), { cls: 'ts mono', fs: 11 });
  const fX = f => 70 + (f - 60) * 7;
  const P12 = {
    t: '變容二極體：用電壓調頻率', en: 'VARACTOR DIODE',
    svg: T(320, 104, 'f = 1 / (2π√(L·C<tspan font-size="12" dy="4">j</tspan><tspan dy="-4">))</tspan>', { cls: 't', fs: 22, k: 'f' }) +
      g('dial', '<rect x="' + fX(88) + '" y="196" width="' + (fX(108) - fX(88)) + '" height="36" class="accw"/>' + dial + line(70, 214, 560, 214, null, 'ln') +
        T(fX(98), 188, 'FM 88～108 MHz', { cls: 'ta', fs: 12 })) +
      '<line class="lna"' + k('ptr') + ' x1="' + fX(65) + '" y1="196" x2="' + fX(65) + '" y2="232" style="stroke-width:3.2"/>' +
      T(320, 272, 'V_R = 0 V → 65 MHz', { cls: 'ta', fs: 13, k: 'pl' }) +
      chip(320, 150, 'V_R ↑ → C_j ↓ → f ↑', '轉電壓就能選台', 'cR', { fs: 13, acc: true }) +
      chip(320, 314, '收音機、手機的調諧電路', '不用機械式的可變電容', 'cU', { fs: 12.5 }),
    steps: [
      { sub: '電壓可以改電容，這件事很好用：LC 電路的<b>共振頻率</b> f = 1/(2π√LC)。', on: 'f' },
      { sub: '把變容二極體當成 C。V<sub>R</sub> = 0 時電容最大，頻率最低（這裡是 65 MHz）。', on: 'dial ptr pl' },
      { sub: '把逆偏加到 3 V：C<sub>j</sub> 變小，頻率爬到 98.5 MHz —— 進到 FM 廣播頻段了。', on: 'cR', mv: { ptr: [fX(98.5) - fX(65), 0] }, txt: { pl: 'V_R = 3 V → 98.5 MHz' } },
      { sub: '轉電壓就能選台。這種刻意拿來當電容的二極體叫<b>變容二極體</b>（varactor）。', on: 'cU' }
    ]
  };

  /* ════════════ 13 恍然大悟 ════════════ */
  const P13 = {
    t: '恍然大悟', en: 'THE ANSWER',
    svg: T(320, 220, '?', { cls: 'ta', fs: 110, k: 'q' }) +
      g('L', '<rect class="card" x="70" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(188, 124, '多數載子', { fs: 16 }) + T(188, 156, '要翻過 V_bi + V_R 的坡', { cls: 'tm', fs: 13 }) +
        T(188, 182, 'V_R 越大越翻不過去', { cls: 'tm', fs: 13 }) + T(188, 222, '電流 ≈ 0', { cls: 'ts', fs: 14 })) +
      g('R', '<rect class="card" x="334" y="96" width="236" height="150" rx="14" filter="url(#st-sh)"/>' +
        T(452, 124, '少數載子', { fs: 16 }) + T(452, 156, '電場本來就把它們全掃過去', { cls: 'tm', fs: 13 }) +
        T(452, 182, '多加電壓也不會變多', { cls: 'tm', fs: 13 }) + T(452, 222, '電流 = I_S（固定）', { cls: 'ta', fs: 14 })) +
      chip(320, 282, '謎題解開了 ✓', '1 V 和 10 V 都只有 I_S —— 它被少數載子的「供應量」卡住', 'ans', { fs: 13, acc: true }) +
      chip(320, 282, '下一段 PART 4：順向偏壓', '把坡壓低，電流會怎樣？（每多 60 mV 就變 10 倍）', 'next', { fs: 13 }),
    steps: [
      { sub: '回到開頭：反接 1 V 或 10 V，電流都卡在 10⁻¹⁴ A，為什麼？', on: 'q' },
      { sub: '多數載子：逆偏把坡墊到 V<sub>bi</sub> + V<sub>R</sub>，根本翻不過去，貢獻 ≈ 0。', off: 'q', on: 'L' },
      { sub: '少數載子：電場本來就把跑到邊緣的<b>全部</b>掃過去了。電壓再大，它們的數量也不會變多。', on: 'R' },
      { sub: '所以電流被少數載子的「供應量」卡住，固定在 I<sub>S</sub> —— 這就是「飽和」。<b>謎題解開了。</b>', on: 'ans' },
      { sub: '下一段 PART 4：反過來把坡<b>壓低</b>（順向偏壓），電流會怎樣？', off: 'ans', on: 'next' }
    ]
  };

  /* ════════════════════════════════════════════════════════════
     開頭兩塊拼圖：愛因斯坦關係（1-16）、多出載子（1-17～1-18）
     ════════════════════════════════════════════════════════════ */
  const zig = (x0, y0, n, key, cls, seed, sw) => {
    let d = 'M' + x0 + ' ' + y0, x = x0; const r = rnd(seed);
    for (let i = 0; i < n; i++) { x += 8 + r() * 14; const y = y0 + (r() - 0.5) * 30; d += ' L' + x.toFixed(1) + ' ' + y.toFixed(1); }
    return '<path class="' + cls + '" style="fill:none;stroke-width:' + (sw || 2) + '" d="' + d + '"' + (key ? k(key) : '') + '/>';
  };
  const box = (x, y, w, hh, key, inner) => g(key, '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="14" filter="url(#st-sh)"/>' + inner);

  /* ── A0 小謎題：奇怪的巧合 ── */
  const A0 = {
    t: '奇怪的巧合', en: 'A STRANGE COINCIDENCE',
    svg: box(90, 96, 210, 150, 'cE', T(195, 126, '電子', { fs: 17 }) + e(150, 120, null, 6) +
        T(195, 170, 'μₙ = 1350', { cls: 'ta', fs: 18 }) + T(195, 206, 'Dₙ = 35', { cls: 'ta', fs: 18 })) +
      box(340, 96, 210, 150, 'cH', T(445, 126, '電洞', { fs: 17 }) + h(400, 120, null, 6.5) +
        T(445, 170, 'μₚ = 480', { cls: 't', fs: 18 }) + T(445, 206, 'Dₚ = 12', { cls: 't', fs: 18 })) +
      chip(320, 280, '電子樣樣都快將近 3 倍', null, 'c3', { fs: 13 }) +
      g('rE', T(195, 236, '35 ÷ 1350 = 0.026', { cls: 'ta', fs: 14 })) + g('rH', T(445, 236, '12 ÷ 480 = 0.025', { cls: 't', fs: 14 })) +
      chip(320, 280, '相除之後幾乎一樣！', '巧合嗎？', 'cSame', { fs: 13, acc: true }) +
      T(320, 210, '?', { cls: 'ta', fs: 110, k: 'q' }),
    steps: [
      { sub: 'PART 2 用過兩組數字：電子的 μ 跟 D，電洞的 μ 跟 D。', on: 'cE cH' },
      { sub: '電子不管哪一項，都比電洞快<b>將近 3 倍</b>。', on: 'c3' },
      { sub: '可是把 D 除以 μ：電子 <b>0.026</b>，電洞 <b>0.025</b> —— 幾乎一樣！', off: 'c3', on: 'rE rH cSame' },
      { sub: '這是巧合嗎？先複習一下 PART 2 的兩招。', op: dim('cE cH rE rH cSame'), on: 'q' }
    ]
  };

  /* ── A1 複習：推和擠 ── */
  const A1 = {
    t: '先複習：推和擠', en: 'RECAP · DRIFT AND DIFFUSION',
    svg: box(70, 96, 236, 170, 'L', T(188, 124, '第一招：被推（漂移）', { fs: 15 }) +
        arrow(110, 160, 266, 160, null, 'lna') + T(188, 150, '電場 E', { cls: 'ta', fs: 12 }) +
        e(150, 196, null, 6) + arrow(162, 196, 232, 196, null, 'ln') + T(188, 236, '跑多快看 μ（移動率）', { cls: 'tm', fs: 13 })) +
      box(334, 96, 236, 170, 'R', T(452, 124, '第二招：被擠（擴散）', { fs: 15 }) +
        e(410, 170, null, 5) + e(426, 182, null, 5) + e(416, 196, null, 5) + e(432, 160, null, 5) + e(404, 188, null, 5) +
        arrow(446, 176, 520, 176, null, 'ln') + e(536, 176, null, 5) +
        T(452, 236, '散多快看 D（擴散係數）', { cls: 'tm', fs: 13 })) +
      chip(320, 300, '看起來是兩件不同的事', null, 'cTwo', { fs: 13 }),
    steps: [
      { sub: '第一招<b>推</b>：電場推著載子跑。跑多快，看<b>移動率 μ</b>。', on: 'L' },
      { sub: '第二招<b>擠</b>：擠的地方往空的地方散開。散多快，看<b>擴散係數 D</b>。', on: 'R' },
      { sub: '一個是被推、一個是自己散，看起來是兩件不同的事。', on: 'cTwo' }
    ]
  };

  /* ── A2 比喻：同一條走廊 ── */
  const A2 = {
    t: '同一條走廊', en: 'THE SAME HALLWAY',
    svg: g('h1', '<rect class="bgw" x="60" y="106" width="380" height="56" rx="10"/>' + zig(74, 134, 17, null, 'lna', 52, 2.4)) +
      T(66, 98, '空走廊：很少撞到人', { cls: 'ta', fs: 13, a: 'start', k: 'h1L' }) +
      g('h2', '<rect class="bgw" x="60" y="198" width="380" height="56" rx="10"/>' + (function () {
        let s = ''; const r = rnd(41);
        for (let i = 0; i < 30; i++) s += '<circle class="ink3" cx="' + (72 + r() * 356).toFixed(1) + '" cy="' + (206 + r() * 40).toFixed(1) + '" r="3"/>';
        return s;
      })() + zig(74, 226, 6, null, 'ln', 70, 2.2)) +
      T(66, 190, '擠滿人的走廊：一直撞', { cls: 't', fs: 13, a: 'start', k: 'h2L' }) +
      chip(540, 134, '推得快，也散得快', '兩個都快', 'c1', { fs: 12.5, acc: true }) + chip(540, 226, '推不動，也散不開', '兩個都慢', 'c2', { fs: 12.5 }) +
      chip(320, 288, 'μ 和 D 都在看同一件事：一路上撞不撞', null, 'cSame', { fs: 13, acc: true }),
    steps: [
      { sub: '想像你在學校走廊上。<b>空走廊</b>：幾乎不會撞到人。', on: 'h1 h1L' },
      { sub: '有人推你，你跑很快；你自己晃來晃去，也很快就散到遠處。<b>兩個都快。</b>', on: 'c1' },
      { sub: '<b>下課擠滿人的走廊</b>：一直撞到人。', on: 'h2 h2L' },
      { sub: '推你也推不動，自己也散不開。<b>兩個都慢。</b>', on: 'c2' },
      { sub: '所以 μ 和 D 其實在看<b>同一件事</b>：一路上撞不撞。一個大，另一個一定也大。', on: 'cSame' }
    ]
  };

  /* ── A3 先整理 → 愛因斯坦關係 ── */
  const A3 = {
    t: '愛因斯坦關係', en: 'EINSTEIN RELATION',
    svg: chip(320, 104, '先整理一下：撞得少 → D、μ 都大；撞得多 → 都小', null, 'sum', { fs: 13 }) +
      T(320, 176, 'D / μ = kT / e', { cls: 'ta', fs: 34, k: 'f' }) +
      chip(320, 222, '≈ 0.026 V（室溫 300 K）', '只跟溫度 T 有關，跟材料、電子或電洞都無關', 'v', { fs: 13, acc: true }) +
      chip(170, 296, '驗算', '35/1350 ≈ 12/480 ≈ 0.026 ✓', 'chk', { fs: 12.5 }) +
      chip(470, 296, '記住這個 0.026 V', '等一下改名叫「熱電壓 V_T」', 'vt', { fs: 12.5 }),
    steps: [
      { sub: '先整理一下：撞得少的載子，D 和 μ 都大；撞得多的，兩個都小。', on: 'sum' },
      { sub: '所以兩個的<b>比值是固定的</b>，這叫<b>愛因斯坦關係</b>：D/μ = kT/e。', on: 'f' },
      { sub: '室溫算出來約 <b>0.026 V</b>，<b>只跟溫度有關</b> —— 電子、電洞都一樣。', on: 'v' },
      { sub: '回到開頭：35/1350 ≈ 12/480 ≈ 0.026，<b>不是巧合</b> ✓', on: 'chk' },
      { sub: '記住這個 0.026 V，等一下它會換個名字出現：<b>熱電壓 V<sub>T</sub></b>。', on: 'vt' }
    ]
  };

  /* ── A4 照一道光 ── */
  const rA = rnd(29); let majA = '', minA = '', pE = '', pH = '';
  for (let i = 0; i < 34; i++) majA += e((84 + rA() * 300).toFixed(1), (130 + rA() * 120).toFixed(1), null, 3.4);
  [[110, 200], [330, 150]].forEach(([x, y]) => { minA += h(x, y, null, 5.5); });
  const pairsA = [[130, 160], [190, 228], [250, 150], [300, 214], [160, 246], [280, 180], [220, 190]];
  pairsA.forEach(([x, y]) => { pE += e(x, y, null, 5); pH += h(x + 16, y + 10, null, 5.5); });
  const A4 = {
    t: '照一道光', en: 'SHINE A LIGHT',
    svg: g('box', '<rect class="bgw" x="70" y="118" width="330" height="146" rx="10"/>') + g('maj', majA) + g('min', minA) +
      T(395, 108, 'N 型矽', { cls: 'tm', fs: 12.5, a: 'end', k: 'boxL' }) +
      chip(520, 150, '電子（多數）：很多', null, 'cM', { fs: 12 }) + chip(520, 196, '電洞（少數）：很少', null, 'cm', { fs: 12 }) +
      g('light', g(null, arrow(130, 74, 150, 112, null, 'lna') + arrow(230, 74, 250, 112, null, 'lna') + arrow(330, 74, 350, 112, null, 'lna'), ' class="glow"')) +
      g('pe', pE) + g('ph', pH) +
      chip(520, 250, '多出一批電子–電洞對', '成對產生：δn = δp', 'cPair', { fs: 12.5, acc: true }) +
      chip(235, 300, '這批叫「多出載子」excess carriers', null, 'cName', { fs: 13, acc: true }),
    steps: [
      { sub: '第二塊拼圖。一塊安安靜靜的 <b>N 型矽</b>：電子很多 ——', on: 'box maj boxL cM' },
      { sub: '電洞很少。這是 PART 2 的熱平衡。', on: 'min cm' },
      { sub: '照一道光進去：光的能量<b>打斷共價鍵</b>，跟熱擾動一樣，一次生出一對。', on: 'light pe ph' },
      { sub: '多出來的電子跟電洞<b>一樣多</b>：δn = δp。', on: 'cPair' },
      { sub: '這批多出來的，叫<b>多出載子</b>。', on: 'cName' }
    ]
  };

  /* ── A5 誰感覺得到？ ── */
  const lvBar = (y, key, w0, w1, cls, lbl, a, b) => g(key,
    T(90, y + 5, lbl, { fs: 14, a: 'end' }) +
    '<rect class="bgw" x="100" y="' + (y - 12) + '" width="' + w0 + '" height="24" rx="4"/>') +
    T(110 + w0, y + 5, a, { cls: 'tm', fs: 12, a: 'start', k: key + 'a' }) +
    g(key + 'x', '<rect class="' + cls + '" x="100" y="' + (y - 12) + '" width="' + w1 + '" height="24" rx="4" style="opacity:.6"/>' +
    T(110 + w1, y + 5, b, { cls: 'ta', fs: 13, a: 'start' }));
  const A5 = {
    t: '誰感覺得到？', en: 'WHO NOTICES?',
    svg: T(100, 104, '長度 = 數量級（差 10 倍才長一格）', { cls: 'ts', fs: 11.5, a: 'start', k: 'ax' }) +
      lvBar(126, 'bM', 320, 324, 'accw', '電子', '10¹⁶', '10¹⁶ + 10¹⁴：只多 1%') +
      lvBar(204, 'bm', 80, 280, 'accw', '電洞', '10⁴', '10¹⁴：暴增一百億倍！') +
      chip(460, 160, '像萬人演唱會多來 100 人', '根本沒感覺', 'aM', { fs: 12 }) +
      chip(460, 238, '像空教室突然擠滿人', '一眼就看得出來', 'am', { fs: 12 }) +
      chip(320, 288, '多出載子主要改變的是「少數載子」', null, 'cC', { fs: 13, acc: true }),
    steps: [
      { sub: '多出來的電子跟電洞一樣多，比如各 10¹⁴ 個。<b>誰感覺得到？</b>', on: 'ax bM bm bMa bma' },
      { sub: '電子本來就有 10¹⁶：多 10¹⁴ 只多 <b>1%</b>。像萬人演唱會多來 100 人，<b>沒感覺</b>。', off: 'bMa', on: 'bMx aM' },
      { sub: '電洞本來只有 10⁴：一下變 10¹⁴，暴增<b>一百億倍</b>。像空教室突然擠滿人。', off: 'bma', on: 'bmx am' },
      { sub: '所以照光、注入這種事，主要改變的是<b>少數載子</b>。PART 4 會一直用到這句話。', on: 'cC' }
    ]
  };

  /* ── A6 關燈之後：復合與生命週期 ── */
  let curveA = 'M380 140';
  for (let i = 1; i <= 40; i++) curveA += ' L' + (380 + i * 5).toFixed(1) + ' ' + (262 - 122 * Math.exp(-i / 10)).toFixed(1);
  let flashA = ''; pairsA.forEach(([x, y]) => { flashA += '<circle class="ring" cx="' + (x + 8) + '" cy="' + (y + 5) + '" r="10"/>'; });
  const A6 = {
    t: '關燈之後', en: 'RECOMBINATION AND LIFETIME',
    svg: g('box', '<rect class="bgw" x="40" y="118" width="300" height="146" rx="10"/>') +
      g('pe', pE.replace(/cx="(\d+)/g, (m, x) => 'cx="' + (x - 30))) + g('ph', pH.replace(/cx="(\d+)/g, (m, x) => 'cx="' + (x - 30))) +
      g('fl', flashA.replace(/cx="(\d+)/g, (m, x) => 'cx="' + (x - 30))) +
      chip(190, 290, '電子掉回空位：復合', '一次消失一對', 'cR', { fs: 12.5 }) +
      g('ax', arrow(380, 266, 590, 266, null, 'ln') + arrow(380, 266, 380, 120, null, 'ln') + T(590, 284, '時間', { cls: 'ts', fs: 12 }) + T(388, 120, '多出來的', { cls: 'tm', fs: 12, a: 'start' })) +
      '<path class="lna" d="' + curveA + '"' + k('cv') + '/>' +
      chip(485, 296, '平均撐多久 = 生命週期 τ', '過一個 τ 剩約 37%', 'cTau', { fs: 12.5, acc: true }) +
      chip(190, 290, '兩塊拼圖到齊 ✓', 'kT/e、多出載子，等一下都會用到', 'next', { fs: 12.5, acc: true }),
    steps: [
      { sub: '把光關掉。多出來的電子會一個個<b>掉回空位</b>，跟電洞一起消失 —— 這叫<b>復合</b>。', on: 'box pe ph' },
      { sub: '每次復合，一個電子加一個電洞<b>一起不見</b>。', off: 'pe ph', on: 'fl cR', cls: { fl: 'pulse' } },
      { sub: '多出來的量越來越少，最後回到原本的熱平衡。', off: 'fl', on: 'ax cv' },
      { sub: '平均能撐多久，叫<b>生命週期 τ</b>。過一個 τ 大約剩 37%。', on: 'cTau' },
      { sub: '兩塊拼圖到齊了。它們等一下都會用到 —— 現在，來看一個<b>奇怪的電池</b>。', off: 'cR', on: 'next' }
    ]
  };

  window.__ch1p3Story = window.__Story('#story', {
    id: 'ch1-part3', title: 'CH1 PART 3 pn 接面', after: '#map',
    scenes: [A0, A1, A2, A3, A4, A5, A6, S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, P5, P6, P7, SR, P8, P9, P10, P11, P12, P13]
  });
})();
