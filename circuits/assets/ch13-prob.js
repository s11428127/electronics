/* ============================================================
   電路學 CH13 章末練習題：Review Questions 13.1～13.10、Problems（跳過 e⁷d、＃ML、小筆電圖示的題目）
   出處：Alexander & Sadiku, Fundamentals of Electric Circuits, Chapter 13（使用者 11/5 提供）
   使用者 11/5：「照舊規則跳過」有 ML 圖示的題目；13.8 PSpice 整節跳過。
   有做的題號：13.1 3 4 5 6 12 14 15 19 22 29 30 32 36 37 39 40 44 60 67 71 74 75 85 86 88 89 90 91 92 93 94 95
   課本註腳：沒特別說明時電壓電流都是 rms。數值全部用程式（Python 複數、sympy）驗算過。
   需要：schem.js（__SCH）、ch13-kit.js（__K13）
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH, K = window.__K13;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, parts, pad) => pad ? S.svg(w + pad, h, ['<g transform="translate(' + pad + ',0)">'].concat(parts, ['</g>'])) : S.svg(w, h, parts);
  const T = (x, y, s, a, fs) => S.t(x, y, s, a || 'middle', ' font-size="' + (fs || 11) + '"');

  /* ---------- 圖 ---------- */
  /* 小耦合線圈（RQ 13.1、13.2） */
  const mini = (d2, i2in, tag) => [
    S.term(15, 30), S.w('15,30', '60,30'), S.term(15, 110), S.w('15,110', '60,110'),
    K.xf(60, 30, 110, { d1: 't', d2, M: 'M' }),
    S.w('86,30', '130,30'), S.term(130, 30), S.w('86,110', '130,110'), S.term(130, 110),
    K.ia(22, 48, 20, 'i_1'), i2in ? K.ia(124, 98, 20, 'i_2') : K.ia(98, 124, 20, 'i_2'), T(72, 132, tag)
  ].join('');
  const F = {
    rq1: G(320, 140, ['<g>' + mini('b', true, '(a)') + '</g>', '<g transform="translate(170,0)">' + mini('b', false, '(b)') + '</g>']),
    rq5: (() => {
      const one = (d2, tag) => [S.term(15, 30), S.w('15,30', '60,30'), S.term(15, 110), S.w('15,110', '60,110'),
        K.xf(60, 30, 110, { d1: 't', d2, n: 'N_1 : N_2' }), S.w('86,30', '130,30'), S.term(130, 30), S.w('86,110', '130,110'), S.term(130, 110),
        K.ia(22, 46, 20, 'I_1'), K.ia(124, 100, 20, 'I_2'), T(72, 132, tag)].join('');
      return G(320, 140, [one('t', '(a) V_1、V_2 都是上 +'), '<g transform="translate(170,0)">' + one('b', '(b)') + '</g>']);
    })(),
    rq7: (() => {
      const one = (aid, tag) => [S.term(10, 40), S.term(10, 120), S.w('10,40', '50,40'), S.w('10,120', '50,120'), T(10, 30, '50 V', 'start'),
        K.coil(50, 40, 120, 1), K.dt(42, 64), S.w('64,35', '64,125'), S.w('69,35', '69,125'),
        K.coil(84, 20, 70, -1), K.coil(84, 90, 140, -1), K.dt(92, 30), aid ? K.dt(92, 100) : K.dt(92, 130),
        T(98, 48, '2 V', 'start'), T(98, 118, '8 V', 'start'),
        S.w('84,20', '140,20'), S.term(140, 20), S.w('84,70', '84,90'), S.w('84,140', '140,140'), S.term(140, 140),
        K.pm(140, 62, 104, 'V_o'), T(75, 160, tag)].join('');
      return G(340, 170, [one(false, '(a) 下面線圈的點在下'), '<g transform="translate(180,0)">' + one(true, '(b) 下面線圈的點在上') + '</g>']);
    })(),
    f1372: G(340, 120, [S.term(15, 90), S.w('15,90', '60,90'), K.hcoil(60, 100, 90), S.w('100,90', '150,90'), K.hcoil(150, 190, 90), S.w('190,90', '240,90'), K.hcoil(240, 280, 90), S.w('280,90', '325,90'), S.term(325, 90),
      K.dt(58, 80), K.dt(192, 80), K.dt(238, 80), K.arcM(84, 166, 80, '8 H', 24), K.arcM(174, 256, 80, '10 H', 24), K.arcM(76, 264, 80, '4 H', 62),
      T(80, 112, '12 H'), T(170, 112, '16 H'), T(260, 112, '20 H')]),
    f1374: G(380, 150, [
      S.term(20, 30), S.w('20,30', '50,30'), K.hcoil(50, 100, 30), S.w('100,30', '150,30'), K.coil(150, 30, 120, 1), S.w('150,120', '20,120'), S.term(20, 120),
      K.dt(50, 20), K.dt(160, 50), T(75, 18, 'L_1'), T(170, 80, 'L_2', 'start'), K.arc2(80, 40, 140, 82, 92, 82, 'M', 96, 98), K.ia(20, 48, 136, 'L_eq'), T(90, 146, '(a)'),
      S.term(210, 30), S.term(210, 120), S.w('210,30', '330,30'), S.w('210,120', '330,120'), K.coil(260, 30, 120, 1), K.coil(330, 30, 120, -1),
      K.dt(252, 50), K.dt(338, 50), T(250, 80, 'L_1', 'end'), T(344, 80, 'L_2', 'start'), K.arcM(266, 324, 54, 'M', 20), K.ia(210, 238, 136, 'L_eq'), T(280, 146, '(b)')]),
    f1375: G(300, 150, [S.term(20, 40), S.w('20,40', '120,40'), S.term(20, 120), S.w('20,120', '120,120'), K.xf(120, 40, 120, { d1: 't', d2: 'b', M: 'M', l1: 'L_1', l2: 'L_2' }),
      S.w('146,40', '280,40'), S.term(280, 40), S.w('146,120', '280,120'), S.term(280, 120), K.pm(28, 62, 106, 'v_1'), K.pm(272, 62, 106, 'v_2'),
      K.ia(30, 62, 28, 'i_1'), K.ia(270, 238, 28, 'i_2')]),
    f1381: G(320, 150, [S.term(15, 40), S.w('15,40', '40,40'), K.hcoil(40, 90, 40), S.w('90,40', '130,40'), T(65, 28, '4 H'),
      K.xf(130, 40, 130, { d1: 't', d2: 'b', M: '8 H', l1: '12 H', l2: '16 H' }), S.w('130,130', '15,130'), S.term(15, 130),
      S.w('156,40', '260,40'), K.coil(260, 40, 130, 1), S.w('260,130', '156,130'), T(272, 90, '20 H', 'start'), K.ia(15, 42, 80, 'L_eq')]),
    f1383: G(400, 190, ['<g transform="translate(0,20)">',S.vs(30, 40, 150, '50∠90° V'), S.r(30, 40, 90, 40, '5 Ω'), K.hcoil(90, 140, 40), S.w('140,40', '180,40'), K.hcoil(180, 230, 40), S.c(230, 40, 280, 40, '−j3 Ω'),
      S.w('280,40', '340,40'), K.dt(92, 30), K.dt(228, 30), T(115, 60, 'j6 Ω'), T(205, 60, 'j8 Ω'), K.arcM(118, 202, 30, 'j2 Ω', 26),
      S.dot(160, 40), S.w('160,40', '160,74'), S.term(160, 74), T(170, 80, 'a', 'start', 12), S.term(160, 112), T(170, 116, 'b', 'start', 12), S.w('160,112', '160,150'),
      S.r(280, 40, 280, 150, '2 Ω', { side: 'l' }), S.dot(280, 40), S.dot(280, 150), S.is(340, 40, 150, '20∠0° A', { side: 'r' }), S.w('30,150', '340,150'), '</g>'], 80),
    f1384: G(350, 160, [S.vs(30, 40, 140, '100∠30° V'), S.r(30, 40, 110, 40, '20 Ω'), S.w('110,40', '170,40'), S.dot(140, 40), K.hcoil(170, 230, 40), S.w('230,40', '290,40'), S.term(290, 40), T(300, 44, 'a', 'start', 12),
      K.coil(140, 40, 140, 1), K.dt(130, 108), K.dt(232, 30), T(200, 28, 'j20 Ω'), T(126, 84, 'j10 Ω', 'end'), K.arc2(200, 52, 152, 96, 200, 100, 'j5 Ω', 222, 92),
      S.w('30,140', '290,140'), S.dot(140, 140), S.term(290, 140), T(300, 144, 'b', 'start', 12)], 85),
    f1388: G(300, 150, [S.term(20, 40), S.w('20,40', '110,40'), S.term(20, 120), S.w('20,120', '110,120'), K.xf(110, 40, 120, { d1: 'b', d2: 't', M: 'j25 Ω', l1: 'j40 Ω', l2: 'j30 Ω' }),
      S.w('136,40', '280,40'), S.term(280, 40), S.w('136,120', '280,120'), S.term(280, 120), K.pm(28, 62, 106, 'V_1'), K.pm(272, 62, 106, 'V_2'),
      K.ia(40, 70, 28, 'I_1'), K.ia(260, 230, 28, 'I_2')]),
    f1391: G(380, 250, [S.c(30, 30, 330, 30, '−j50 Ω'), K.ia(296, 330, 16, 'I_o'), S.w('30,30', '30,130'), S.w('330,30', '330,130'),
      S.vs(30, 130, 235, '50∠0° V'), S.w('30,130', '70,130'), K.hcoil(70, 120, 130), S.w('120,130', '240,130'), K.hcoil(240, 290, 130), S.w('290,130', '330,130'), S.dot(180, 130), S.dot(30, 130), S.dot(330, 130),
      K.coil(180, 130, 235, 1), S.r(330, 130, 330, 235, '100 Ω', { side: 'r' }), S.w('30,235', '330,235'),
      K.dt(68, 120), K.dt(292, 120), K.dt(170, 210), T(78, 154, 'j40 Ω'), T(282, 154, 'j60 Ω'), T(194, 226, 'j80 Ω', 'start'),
      K.arcM(100, 260, 118, 'j20 Ω', 56), K.arc2(110, 142, 172, 170, 116, 186, 'j10 Ω', 104, 204), K.arc2(250, 142, 190, 170, 244, 186, 'j30 Ω', 258, 204)], 80),
    f1398: G(330, 150, [S.vs(30, 40, 130, '165 cos 1000t V'), S.r(30, 40, 120, 40, '10 Ω'), K.xf(120, 40, 130, { d1: 't', d2: 't', M: 'k', l1: '30 mH', l2: '50 mH' }), S.w('30,130', '120,130'),
      S.w('146,40', '250,40'), S.r(250, 40, 250, 130, '20 Ω', { side: 'r' }), S.w('146,130', '250,130')], 110),
    f1399: G(380, 150, [S.term(20, 40), K.hcoil(20, 60, 40), T(40, 28, 'j40 Ω'), S.r(60, 40, 120, 40, '25 Ω'), S.w('120,40', '160,40'), K.xf(160, 40, 130, { d1: 't', d2: 't', M: 'j10 Ω', l1: 'j30 Ω', l2: 'j20 Ω' }),
      S.w('160,130', '20,130'), S.term(20, 130), K.ia(20, 48, 112, 'Z_in'), S.w('186,40', '230,40'), S.r(230, 40, 290, 40, '8 Ω'), S.c(290, 40, 290, 130, '−j6 Ω', { side: 'r' }), S.w('186,130', '290,130')]),
    f13101: G(330, 150, [S.term(20, 40), S.w('20,40', '60,40'), S.term(20, 130), S.w('20,130', '60,130'), K.ia(20, 48, 112, 'Z_in'),
      K.xf(60, 40, 130, { d1: 't', d2: 't', M: 'M_a', l1: 'L_a', l2: 'L_a' }), S.w('86,40', '170,40'), S.w('86,130', '170,130'),
      K.xf(170, 40, 130, { d1: 't', d2: 't', M: 'M_b', l1: 'L_b', l2: 'L_b' }), S.w('196,40', '270,40'), S.w('196,130', '270,130'), S.r(270, 40, 270, 130, 'R', { side: 'r' })]),
    f13105: (() => {
      const one = (d1, d2, i2in, tag) => [S.term(15, 30), S.w('15,30', '70,30'), S.term(15, 110), S.w('15,110', '70,110'), K.xf(70, 30, 110, { d1, d2, n: '1 : n' }),
        S.w('96,30', '150,30'), S.term(150, 30), S.w('96,110', '150,110'), S.term(150, 110), K.pm(22, 52, 96, 'V_1'), K.pm(143, 52, 96, 'V_2'),
        K.ia(24, 52, 20, 'I_1'), i2in ? K.ia(142, 114, 20, 'I_2') : K.ia(114, 142, 20, 'I_2'), T(82, 134, tag)].join('');
      return G(340, 290, ['<g>' + one('t', 'b', true, '(a)') + '</g>', '<g transform="translate(175,0)">' + one('b', 't', false, '(b)') + '</g>',
        '<g transform="translate(0,148)">' + one('b', 'b', false, '(c)') + '</g>', '<g transform="translate(175,148)">' + one('b', 'b', true, '(d)') + '</g>']);
    })(),
    f13109: G(330, 140, [S.w('30,40', '30,55'), S.c(30, 55, 30, 125, '', {}), T(18, 92, 'V_o', 'end'), T(18, 106, 'dc', 'end'), S.r(30, 40, 120, 40, 'R'), K.ia(62, 92, 62, 'i_1(t)'),
      K.xf(120, 40, 125, { d1: 't', d2: 'b', n: '1 : n' }), S.w('30,125', '120,125'), S.w('146,40', '250,40'), S.w('146,125', '250,125'),
      S.vs(250, 40, 125, 'V_m cos ωt', { side: 'r' }), K.ia(220, 186, 62, 'i_2(t)')], 40),
    f13125: G(420, 150, [S.vs(25, 40, 130, '120∠0° V'), S.r(25, 40, 85, 40, '4 Ω'), K.ia(40, 70, 60, 'I_1'), K.xf(105, 40, 130, { d1: 't', d2: 't', n: '1 : 4' }), S.w('85,40', '105,40'), S.w('25,130', '105,130'),
      S.w('131,40', '165,40'), S.r(165, 40, 165, 130, '10 Ω', { side: 'r' }), S.dot(165, 40), S.dot(165, 130), S.r(165, 40, 240, 40, '5 Ω'), K.ia(195, 225, 60, 'I_2'), S.w('131,130', '260,130'),
      S.w('240,40', '260,40'), K.xf(260, 40, 130, { d1: 't', d2: 't', n: '1 : 2' }), S.w('286,40', '360,40'), S.w('286,130', '360,130'), S.r(360, 40, 360, 130, '40 Ω', { side: 'r' }), K.ia(300, 330, 60, 'I_3')], 80),
    f13134: G(280, 180, [S.term(20, 30), S.term(20, 150), S.w('20,30', '120,30'), K.coil(120, 30, 90, -1), K.coil(120, 90, 150, -1), S.w('120,150', '20,150'),
      S.w('102,40', '102,140'), S.w('97,40', '97,140'), K.dt(130, 42), K.dt(130, 102), T(136, 62, 'N_1', 'start'), T(136, 122, 'N_2', 'start'),
      S.w('120,90', '200,90'), S.z(200, 90, 200, 150, 'Z_L', { side: 'r' }), S.w('200,150', '120,150'), K.ia(20, 48, 168, 'Z_in')]),
    f13146: G(300, 170, [S.term(30, 25), S.term(30, 75), S.term(30, 105), S.term(30, 155), S.w('30,25', '110,25'), S.w('30,75', '110,75'), S.w('30,105', '110,105'), S.w('30,155', '110,155'),
      K.coil(110, 25, 75, 1), K.coil(110, 105, 155, 1), S.w('128,20', '128,160'), S.w('133,20', '133,160'), K.coil(150, 25, 75, -1), K.coil(150, 105, 155, -1),
      S.w('150,25', '230,25'), S.w('150,75', '230,75'), S.w('150,105', '230,105'), S.w('150,155', '230,155'), S.term(230, 25), S.term(230, 75), S.term(230, 105), S.term(230, 155),
      K.dt(100, 34), K.dt(100, 146), K.dt(160, 34), K.dt(160, 114),
      T(40, 20, 'a', 'start'), T(40, 70, 'b', 'start'), T(40, 100, 'c', 'start'), T(40, 150, 'd', 'start'), T(220, 20, 'e', 'end'), T(220, 70, 'f', 'end'), T(220, 100, 'g', 'end'), T(220, 150, 'h', 'end'),
      T(22, 54, '110 V', 'end'), T(22, 134, '110 V', 'end'), T(240, 54, '32 V', 'start'), T(240, 134, '18 V', 'start')], 30),
    f13147: G(390, 140, [S.term(20, 30), S.term(20, 120), S.w('20,30', '100,30'), S.w('20,120', '100,120'), T(30, 80, '7200 V', 'start'), K.xf(100, 30, 120, { n: '1 : n' }),
      S.w('126,30', '320,30'), S.w('126,120', '320,120'), T(140, 80, '120 V', 'start'), S.r(200, 30, 200, 120, '144 Ω', { side: 'r' }), S.r(320, 30, 320, 120, '144 Ω', { side: 'r' }), T(275, 80, '⋯'), S.dot(200, 30), S.dot(200, 120)])
  };

  const RQ = (n, q, en, opts, a, why, fig) => ({ id: 'rq13-' + n, sec: 'rq', kind: 'pp', tag: 'Review Question 13.' + n, title: q.replace(/<[^>]+>/g, '').slice(0, 26),
    q: q + '<ol type="a" style="margin:6px 0 0;padding-left:22px">' + opts.map(o => '<li>' + o + '</li>').join('') + '</ol>', en, fig, cap: fig ? '課本圖重畫' : '',
    hint: '先看兩個電流是不是都流進（或都流出）有點的那端；理想變壓器看點的位置決定正負號。', steps: [st('想法。', '', why)], ans: '(' + a + ')' });
  const it = (no, sec, title, o) => Object.assign({ id: 'p13-' + no, sec, kind: 'pp', tag: 'Problem 13.' + no, title }, o);

  const items = [
    /* ═══════════ Review Questions（課本附答案） ═══════════ */
    RQ(1, '圖 13.69(a) 的兩個耦合線圈，互感電壓的極性是：', 'Refer to the two magnetically coupled coils of Fig. 13.69(a). The polarity of the mutual voltage is:', ['正', '負'], 'b',
      'i<sub>1</sub> 從有點的那端流進，i<sub>2</sub> 從沒點的那端流進 —— 一個進點、一個不進點，互感項取負。', F.rq1),
    RQ(2, '圖 13.69(b) 的兩個耦合線圈，互感電壓的極性是：', 'For the two magnetically coupled coils of Fig. 13.69(b), the polarity of the mutual voltage is:', ['正', '負'], 'a',
      'i<sub>2</sub> 從上面流出 = 從下面（有點）流進；i<sub>1</sub> 也從點流進 —— 兩個都進點，互感項取正。', F.rq1),
    RQ(3, 'L<sub>1</sub> = 2 H、L<sub>2</sub> = 8 H、M = 3 H 的兩個線圈，耦合係數是：', 'The coefficient of coupling for two coils having L<sub>1</sub> = 2 H, L<sub>2</sub> = 8 H, M = 3 H is:', ['0.1875', '0.75', '1.333', '5.333'], 'b',
      'k = M/√(L<sub>1</sub>L<sub>2</sub>) = 3/√16 = 0.75。'),
    RQ(4, '變壓器可以把哪一種電壓升壓或降壓？', 'A transformer is used in stepping down or stepping up:', ['直流電壓', '交流電壓', '直流和交流都可以'], 'b',
      '互感電壓 = M di/dt，要電流「在變」才有；直流的 di/dt = 0，傳不過去。'),
    RQ(5, '圖 13.70(a) 的理想變壓器 N<sub>2</sub>/N<sub>1</sub> = 10，V<sub>2</sub>/V<sub>1</sub> 是：', 'The ideal transformer in Fig. 13.70(a) has N<sub>2</sub>/N<sub>1</sub> = 10. The ratio V<sub>2</sub>/V<sub>1</sub> is:', ['10', '0.1', '−0.1', '−10'], 'd',
      '課本圖 (a) 一次側的點在上、二次側的點在下，V<sub>1</sub>、V<sub>2</sub> 都是上 +：一個 + 在點、一個 + 不在點 ⟹ V<sub>2</sub> = −nV<sub>1</sub> = −10V<sub>1</sub>。', F.rq5),
    RQ(6, '圖 13.70(b) 的理想變壓器 N<sub>2</sub>/N<sub>1</sub> = 10，I<sub>2</sub>/I<sub>1</sub> 是：', 'For the ideal transformer in Fig. 13.70(b), N<sub>2</sub>/N<sub>1</sub> = 10. The ratio I<sub>2</sub>/I<sub>1</sub> is:', ['10', '0.1', '−0.1', '−10'], 'b',
      '電流比跟匝數比相反：|I<sub>2</sub>/I<sub>1</sub>| = 1/n = 0.1；圖 (b) 中 I<sub>1</sub> 流進點、I<sub>2</sub> 流出點 ⟹ 取正。', F.rq5),
    RQ(7, '三繞組變壓器照圖 13.71(a) 接，輸出 V<sub>o</sub> 是：', 'A three-winding transformer is connected as portrayed in Fig. 13.71(a). The value of the output voltage V<sub>o</sub> is:', ['10', '6', '−6', '−10'], 'c',
      '兩個二次線圈串聯但點一上一下 ⟹ 互相抵消：V<sub>o</sub> = 2 − 8 = −6 V。', F.rq7),
    RQ(8, '三繞組變壓器照圖 13.71(b) 接，輸出 V<sub>o</sub> 是：', 'If the three-winding transformer is connected as in Fig. 13.71(b), the value of the output voltage V<sub>o</sub> is:', ['10', '6', '−6', '−10'], 'a',
      '兩個二次線圈串聯且點的方向一致 ⟹ 相加：V<sub>o</sub> = 2 + 8 = 10 V。', F.rq7),
    RQ(9, '要讓內阻 500 Ω 的電源匹配 15 Ω 的負載，需要：', 'In order to match a source with internal impedance of 500 Ω to a 15-Ω load, what is needed is:', ['升壓線性變壓器', '降壓線性變壓器', '升壓理想變壓器', '降壓理想變壓器', '自耦變壓器'], 'd',
      '要讓 15 Ω 從一次側看起來變成 500 Ω：Z<sub>L</sub>/n<sup>2</sup> = 500 ⟹ n<sup>2</sup> = 0.03，n &lt; 1，降壓。阻抗匹配用理想變壓器。'),
    RQ(10, '哪一種變壓器可以當隔離元件？', 'Which of these transformers can be used as an isolation device?', ['線性變壓器', '理想變壓器', '自耦變壓器', '以上都可以'], 'b',
      '課本答案 (b)：理想變壓器一、二次側之間沒有導線相連（隔離）；自耦變壓器一、二次側共用同一個繞組，不能隔離。'),

    /* ═══════════ 13.2 互感 ═══════════ */
    it(1, '13.2', '三個耦合線圈串聯的總電感', { fig: F.f1372, cap: '圖 13.72（重畫）',
      q: '求圖 13.72 三個耦合線圈的總電感。',
      en: 'For the three coupled coils in Fig. 13.72, calculate the total inductance.',
      hint: '電流從左流到右。每一對線圈各自判斷：兩個都從點進（或都從點出）＝ +2M，一進一出 ＝ −2M。',
      steps: [
        st('Step 1　看電流從哪一端進每個線圈。', '12 H：從點進；16 H：點在右邊，從沒點的那端進；20 H：從點進', '電流從左往右走，左端有點就是「從點進」。'),
        st('Step 2　每一對的正負號。', '12H–16H（8 H）：一進一出 ⟹ −；16H–20H（10 H）：一進一出 ⟹ −；12H–20H（4 H）：都進點 ⟹ +', '串聯時每一對互感貢獻 ±2M。'),
        st('Step 3　加起來。', 'L = 12 + 16 + 20 + 2(−8 − 10 + 4) = 48 − 28 = 20 H', '')
      ],
      ans: 'L = 20 H' }),
    it(3, '13.2', '串聯加成、串聯相消求 L<sub>1</sub>、L<sub>2</sub>、M', {
      q: '兩個線圈串聯加成（series-aiding）時總電感 500 mH，串聯相消（series-opposing）時 300 mH。若 L<sub>1</sub> 是 L<sub>2</sub> 的三倍，求 L<sub>1</sub>、L<sub>2</sub>、M 與耦合係數。',
      en: 'Two coils connected in series-aiding fashion have a total inductance of 500 mH. When connected in a series-opposing configuration, the coils have a total inductance of 300 mH. If the inductance of one coil (L<sub>1</sub>) is three times the other, find L<sub>1</sub>, L<sub>2</sub>, and M. What is the coupling coefficient?',
      hint: '加成：L<sub>1</sub> + L<sub>2</sub> + 2M；相消：L<sub>1</sub> + L<sub>2</sub> − 2M。兩式相減得 M、相加得 L<sub>1</sub> + L<sub>2</sub>。',
      steps: [
        st('Step 1　列兩條式子。', 'L<sub>1</sub> + L<sub>2</sub> + 2M = 500；L<sub>1</sub> + L<sub>2</sub> − 2M = 300', ''),
        st('Step 2　相減、相加。', '4M = 200 ⟹ M = 50 mH；L<sub>1</sub> + L<sub>2</sub> = 400 mH', ''),
        st('Step 3　L<sub>1</sub> = 3L<sub>2</sub>。', '4L<sub>2</sub> = 400 ⟹ L<sub>2</sub> = 100 mH、L<sub>1</sub> = 300 mH', ''),
        st('Step 4　耦合係數。', 'k = M/√(L<sub>1</sub>L<sub>2</sub>) = 50/√30000 = 0.2887', '')
      ],
      ans: 'L<sub>1</sub> = 300 mH、L<sub>2</sub> = 100 mH、M = 50 mH、k ≈ 0.2887' }),
    it(4, '13.2', '證明串聯、並聯的等效電感', { fig: F.f1374, cap: '圖 13.74（重畫）',
      q: '(a) 證明圖 13.74(a) 的耦合線圈 L<sub>eq</sub> = L<sub>1</sub> + L<sub>2</sub> + 2M。(b) 證明圖 13.74(b) 的耦合線圈 L<sub>eq</sub> = (L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>)/(L<sub>1</sub> + L<sub>2</sub> − 2M)。',
      en: '(a) For the coupled coils in Fig. 13.74(a), show that L<sub>eq</sub> = L<sub>1</sub> + L<sub>2</sub> + 2M. (b) For the coupled coils in Fig. 13.74(b), show that L<sub>eq</sub> = (L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>)/(L<sub>1</sub> + L<sub>2</sub> − 2M).',
      hint: '(a) 同一個電流 i 依序流過兩個線圈，都從點進。(b) 兩線圈並聯，電壓相同，總電流 i = i<sub>1</sub> + i<sub>2</sub>，兩個電流都從點進。',
      steps: [
        st('Step 1　(a) 兩個線圈電流都是 i、都從點進。', 'v = (L<sub>1</sub> di/dt + M di/dt) + (L<sub>2</sub> di/dt + M di/dt) = (L<sub>1</sub> + L<sub>2</sub> + 2M) di/dt', '兩個都從點進，互感項都取 +。'),
        st('Step 2　(a) 結論。', 'L<sub>eq</sub> = L<sub>1</sub> + L<sub>2</sub> + 2M', ''),
        st('Step 3　(b) 並聯，兩線圈電壓都是 v。', 'v = L<sub>1</sub> di<sub>1</sub>/dt + M di<sub>2</sub>/dt；v = M di<sub>1</sub>/dt + L<sub>2</sub> di<sub>2</sub>/dt', '點都在上、電流都從上面進。'),
        st('Step 4　(b) 解出 di<sub>1</sub>/dt、di<sub>2</sub>/dt。', 'di<sub>1</sub>/dt = v(L<sub>2</sub> − M)/(L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>)；di<sub>2</sub>/dt = v(L<sub>1</sub> − M)/(L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>)', '兩條聯立（克拉瑪）。'),
        st('Step 5　(b) 總電流。', 'di/dt = di<sub>1</sub>/dt + di<sub>2</sub>/dt = v(L<sub>1</sub> + L<sub>2</sub> − 2M)/(L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>) ⟹ L<sub>eq</sub> = v/(di/dt) = (L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>)/(L<sub>1</sub> + L<sub>2</sub> − 2M)', '')
      ],
      ans: '(a) L<sub>eq</sub> = L<sub>1</sub> + L<sub>2</sub> + 2M　(b) L<sub>eq</sub> = (L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>)/(L<sub>1</sub> + L<sub>2</sub> − 2M)（證明如詳解）' }),
    it(5, '13.2', '串聯、並聯能得到的最大等效電感', {
      q: '兩個線圈互相耦合，L<sub>1</sub> = 50 mH、L<sub>2</sub> = 120 mH、k = 0.5。求最大的等效電感：(a) 兩線圈串聯 (b) 兩線圈並聯。',
      en: 'Two coils are mutually coupled, with L<sub>1</sub> = 50 mH, L<sub>2</sub> = 120 mH, and k = 0.5. Calculate the maximum possible equivalent inductance if: (a) the two coils are connected in series (b) the coils are connected in parallel',
      hint: '先算 M = k√(L<sub>1</sub>L<sub>2</sub>)。串聯最大＝加成；並聯用 13.4 的公式，分母 L<sub>1</sub> + L<sub>2</sub> ∓ 2M，取讓結果最大的那個。',
      steps: [
        st('Step 1　互感。', 'M = 0.5 √(50 × 120) = 38.73 mH', ''),
        st('Step 2　(a) 串聯加成最大。', 'L = 50 + 120 + 2(38.73) = 247.5 mH', '相消會變 92.5 mH。'),
        st('Step 3　(b) 並聯兩種接法。', '(L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup>)/(L<sub>1</sub> + L<sub>2</sub> − 2M) = (6000 − 1500)/92.54 = 48.63 mH；另一種 4500/247.5 = 18.18 mH', '分子一樣是 L<sub>1</sub>L<sub>2</sub> − M<sup>2</sup> = 4500，分母越小越大。'),
        st('Step 4　取最大。', '(b) 最大 48.63 mH', '')
      ],
      ans: '(a) 247.5 mH　(b) 48.63 mH' }),
    it(6, '13.2', '給 v<sub>1</sub>、i<sub>2</sub> 求 i<sub>1</sub>、v<sub>2</sub>', { fig: F.f1375, cap: '圖 13.75（重畫）',
      q: '圖 13.75 中 L<sub>1</sub> = 40 mH、L<sub>2</sub> = 5 mH、k = 0.6。已知 v<sub>1</sub> = 20 cos(ωt) V、i<sub>2</sub> = 4 sin(ωt) A、ω = 2000 rad/s，求 i<sub>1</sub>(t) 和 v<sub>2</sub>(t)。',
      en: 'The coils in Fig. 13.75 have L<sub>1</sub> = 40 mH, L<sub>2</sub> = 5 mH, and coupling coefficient k = 0.6. Find i<sub>1</sub>(t) and v<sub>2</sub>(t), given that v<sub>1</sub> = 20 cos(ωt) V and i<sub>2</sub> = 4 sin(ωt) A, ω = 2,000 rad/s.',
      hint: 'i<sub>1</sub> 從點進；i<sub>2</sub> 從 L<sub>2</sub> 上端（沒點）進 ⟹ 互感項取負。v<sub>1</sub> = L<sub>1</sub> di<sub>1</sub>/dt − M di<sub>2</sub>/dt。',
      steps: [
        st('Step 1　互感。', 'M = 0.6 √(0.04 × 0.005) = 8.485 mH', ''),
        st('Step 2　列 v<sub>1</sub>。', 'v<sub>1</sub> = L<sub>1</sub> di<sub>1</sub>/dt − M di<sub>2</sub>/dt', '一個電流進點、一個不進點，互感項取負。'),
        st('Step 3　代入 di<sub>2</sub>/dt。', 'M di<sub>2</sub>/dt = 8.485m × 8000 cos(2000t) = 67.88 cos(2000t)', 'di<sub>2</sub>/dt = 4 × 2000 cos(2000t)。'),
        st('Step 4　解 i<sub>1</sub>。', 'L<sub>1</sub> di<sub>1</sub>/dt = 20 cos + 67.88 cos = 87.88 cos(2000t) ⟹ i<sub>1</sub> = 87.88/(0.04 × 2000) sin(2000t) = 1.099 sin(2000t) A', '積分 cos 得 sin/ω。'),
        st('Step 5　v<sub>2</sub>。', 'v<sub>2</sub> = L<sub>2</sub> di<sub>2</sub>/dt − M di<sub>1</sub>/dt = 0.005 × 8000 cos − 8.485m × 2197 cos = 40 cos − 18.64 cos = 21.36 cos(2000t) V', 'di<sub>1</sub>/dt = 1.099 × 2000 cos(2000t) = 2197 cos(2000t)。')
      ],
      ans: 'i<sub>1</sub>(t) ≈ 1.099 sin(2000t) A；v<sub>2</sub>(t) ≈ 21.36 cos(2000t) V' }),
    it(12, '13.2', '二次側接電感的等效電感', { fig: F.f1381, cap: '圖 13.81（重畫）',
      q: '求圖 13.81 電路的等效電感 L<sub>eq</sub>。',
      en: 'Determine the equivalent L<sub>eq</sub> in the circuit of Fig. 13.81.',
      hint: '一次側電流 I<sub>1</sub>、二次側迴路電流 I<sub>2</sub>，用 s（或 jω）列兩條迴路方程，消掉 I<sub>2</sub>。',
      steps: [
        st('Step 1　二次側迴路。', '0 = s(16 + 20) I<sub>2</sub> + s(8) I<sub>1</sub> ⟹ I<sub>2</sub> = −(8/36) I<sub>1</sub>', '取 I<sub>2</sub> 從 16 H 的點流進，兩個電流都進點 ⟹ 互感 +。'),
        st('Step 2　一次側。', 'V = s(4 + 12) I<sub>1</sub> + s(8) I<sub>2</sub> = s(16 − 64/36) I<sub>1</sub>', ''),
        st('Step 3　L<sub>eq</sub>。', 'L<sub>eq</sub> = 16 − 1.778 = 14.22 H', 'M 出現成 M<sup>2</sup>，點的位置不影響答案。')
      ],
      ans: 'L<sub>eq</sub> ≈ 14.22 H' }),
    it(14, '13.2', '有互感的戴維寧等效', { fig: F.f1383, cap: '圖 13.83（重畫）',
      q: '求圖 13.83 電路在 a-b 端的戴維寧等效電路。',
      en: 'Obtain the Thevenin equivalent circuit for the circuit in Fig. 13.83 at terminals a-b.',
      hint: 'a-b 開路時只有一條串聯路徑：電流 I 從左流到右，經過 j6（從點進）和 j8（從沒點進）⟹ 互感取負。',
      steps: [
        st('Step 1　開路時的串聯電流 I。', 'j50 = 5I + (j6 − j2)I + (j8 − j2)I − j3I + 2(I + 20)', '電流源 20 A 往上打進右邊節點，2 Ω 的電流是 I + 20。'),
        st('Step 2　解 I。', 'I(7 + j7) = −40 + j50 ⟹ I = 6.468∠83.66° A', ''),
        st('Step 3　V<sub>Th</sub> = V<sub>a</sub>。', 'V<sub>Th</sub> = j50 − I(5 + j4) = 22.14 + j15 = 26.75∠34.11° V', 'a 點在兩個線圈中間，從左邊算：電源電壓減掉 5 Ω 和 j6 線圈（含 −j2 互感）的壓降。'),
        st('Step 4　Z<sub>Th</sub>：電源歸零後從 a 看進去。', 'V = (5 + j6)I<sub>1</sub> + j2 I<sub>2</sub>；V = (2 + j5)I<sub>2</sub> + j2 I<sub>1</sub>', 'I<sub>1</sub> 從 a 往左、I<sub>2</sub> 從 a 往右，兩個都從沒點的那端進 ⟹ 互感 +。'),
        st('Step 5　解。', 'Z<sub>Th</sub> = V/(I<sub>1</sub> + I<sub>2</sub>) = 1.5 + j3.786 Ω', '')
      ],
      ans: 'V<sub>Th</sub> ≈ 26.75∠34.11° V；Z<sub>Th</sub> ≈ 1.5 + j3.786 Ω' }),
    it(15, '13.2', '有互感的諾頓等效', { fig: F.f1384, cap: '圖 13.84（重畫）',
      q: '求圖 13.84 電路在 a-b 端的諾頓等效電路。',
      en: 'Find the Norton equivalent for the circuit in Fig. 13.84 at terminals a-b.',
      hint: 'I<sub>N</sub>：a-b 短路，三個未知電流 I<sub>1</sub>（20 Ω）、I<sub>3</sub>（j10 往下）、I<sub>2</sub>（j20 往 a）。兩個電流都從沒點的那端進線圈。',
      steps: [
        st('Step 1　KCL。', 'I<sub>1</sub> = I<sub>2</sub> + I<sub>3</sub>', ''),
        st('Step 2　左迴路。', '100∠30° = 20I<sub>1</sub> + j10I<sub>3</sub> + j5I<sub>2</sub>', 'I<sub>3</sub>、I<sub>2</sub> 都從沒點的那端進 ⟹ 互感 +。'),
        st('Step 3　短路迴路（j10 和 j20 並聯在同一個節點）。', 'j10I<sub>3</sub> + j5I<sub>2</sub> = j20I<sub>2</sub> + j5I<sub>3</sub>', ''),
        st('Step 4　解。', 'I<sub>N</sub> = I<sub>2</sub> = 1.145∠6.37° A', ''),
        st('Step 5　Z<sub>N</sub>：電源短路，從 a 灌 1 A。', 'Z<sub>N</sub> = j20 − j5I<sub>3</sub> + V<sub>x</sub>，V<sub>x</sub> = 20I<sub>a</sub> = j10I<sub>3</sub> − j5，I<sub>a</sub> + I<sub>3</sub> = 1 ⟹ Z<sub>N</sub> = 1 + j19.5 Ω', '1 A 從 a 進 j20 是從點進；I<sub>3</sub> 往下是從沒點進 ⟹ 互感取負。')
      ],
      ans: 'I<sub>N</sub> ≈ 1.145∠6.37° A；Z<sub>N</sub> ≈ 1 + j19.5 Ω' }),
    it(19, '13.2', '耦合線圈的 T 型等效', { fig: F.f1388, cap: '圖 13.88（重畫）',
      q: '求一個可以取代圖 13.88 變壓器的 T 型等效電路。',
      en: 'Determine an equivalent T-section that can be used to replace the transformer in Fig. 13.88.',
      hint: 'T 型等效（兩個電流都從點進時）：L<sub>a</sub> = L<sub>1</sub> − M、L<sub>b</sub> = L<sub>2</sub> − M、L<sub>c</sub> = M。這題一個進點、一個不進點 ⟹ 把 M 換成 −M。',
      steps: [
        st('Step 1　看點。', 'I<sub>1</sub> 從上面（沒點）進、I<sub>2</sub> 從上面（有點）進 ⟹ 一進一出，M 取 −j25', '一次側的點在下、二次側的點在上。'),
        st('Step 2　套 T 型。', 'Z<sub>a</sub> = j40 − (−j25) = j65 Ω；Z<sub>b</sub> = j30 − (−j25) = j55 Ω；Z<sub>c</sub> = −j25 Ω', '中間那支是 −j25（像電容），這是正常的，只是數學等效。')
      ],
      ans: '兩邊串聯臂 j65 Ω（一次側）、j55 Ω（二次側），中間並聯臂 −j25 Ω' }),

    /* ═══════════ 13.3 耦合電路的能量 ═══════════ */
    it(22, '13.3', '三個線圈兩兩耦合', { fig: F.f1391, cap: '圖 13.91（重畫）',
      q: '求圖 13.91 電路中的電流 I<sub>o</sub>。',
      en: 'Find current I<sub>o</sub> in the circuit of Fig. 13.91.',
      hint: '三個網目：I<sub>1</sub>（左下，經過電源、j40、j80）、I<sub>2</sub>（右下，經過 j60、100 Ω、j80）、I<sub>3</sub>（上面，經過電容、j60、j40），都取順時針。每個線圈先寫出「流進點的電流」。',
      steps: [
        st('Step 1　流進點的電流。', 'j40（點在左）：I<sub>1</sub> − I<sub>3</sub>；j60（點在右）：I<sub>3</sub> − I<sub>2</sub>；j80（點在下）：I<sub>2</sub> − I<sub>1</sub>', '例：j60 往右的電流是 I<sub>2</sub> − I<sub>3</sub>，但點在右邊，流進點的是往左的 I<sub>3</sub> − I<sub>2</sub>。'),
        st('Step 2　每個線圈「點端對非點端」的電壓。', 'V<sub>40</sub> = j40(I<sub>1</sub> − I<sub>3</sub>) + j20(I<sub>3</sub> − I<sub>2</sub>) + j10(I<sub>2</sub> − I<sub>1</sub>)，V<sub>60</sub>、V<sub>80</sub> 同理', '自感 × 自己流進點的電流 ＋ 互感 × 對方流進點的電流。'),
        st('Step 3　三條 KVL。', '網目 1：V<sub>40</sub> − V<sub>80</sub> = 50；網目 2：−V<sub>60</sub> + V<sub>80</sub> + 100I<sub>2</sub> = 0；網目 3：−j50I<sub>3</sub> + V<sub>60</sub> − V<sub>40</sub> = 0', '順著網目方向走，從點走到非點是 +V、反過來是 −V。'),
        st('Step 4　解聯立。', 'I<sub>1</sub> = 0.2362∠37.06°、I<sub>2</sub> = 0.307∠105.26°、I<sub>3</sub> = 1.304∠62.98° A', ''),
        st('Step 5　I<sub>o</sub> 就是電容那條的電流。', 'I<sub>o</sub> = I<sub>3</sub> ≈ 1.304∠62.98° A', '')
      ],
      ans: 'I<sub>o</sub> ≈ 1.304∠62.98° A', note: '課本打 * 的挑戰題。三個線圈互感的正負號最容易錯，建議照「流進點的電流」一步一步寫。' }),

    /* ═══════════ 13.4 線性變壓器 ═══════════ */
    it(29, '13.4', '讓負載拿到 320 W 的耦合係數', { fig: F.f1398, cap: '圖 13.98（重畫）',
      q: '圖 13.98 中，求讓 10 Ω 電阻消耗 320 W 的耦合係數 k。用這個 k，求 t = 1.5 s 時耦合線圈儲存的能量。',
      en: 'In the circuit of Fig. 13.98, find the value of the coupling coefficient k that will make the 10-Ω resistor dissipate 320 W. For this value of k, find the energy stored in the coupled coils at t = 1.5 s.',
      hint: 'ω = 1000：j30、j50、jωM。電源是 165 cos（峰值），平均功率 P = ½|I<sub>1</sub>|<sup>2</sup>R。用反射阻抗求 I<sub>1</sub>。',
      steps: [
        st('Step 1　10 Ω 要 320 W。', '½|I<sub>1</sub>|<sup>2</sup>(10) = 320 ⟹ |I<sub>1</sub>| = 8 A（峰值）', ''),
        st('Step 2　一次側總阻抗。', '|Z| = 165/8 = 20.625 Ω；Z = 10 + j30 + (ωM)<sup>2</sup>/(20 + j50)', '反射阻抗 (ωM)<sup>2</sup>/Z<sub>22</sub>。'),
        st('Step 3　解 ωM。', '令 X = ωM，數值解 |10 + j30 + X<sup>2</sup>/(20 + j50)| = 20.625 ⟹ X = 33.86 Ω（M = 33.86 mH）', 'k ≤ 1 限制 X ≤ ω√(L<sub>1</sub>L<sub>2</sub>) = 38.73；這個範圍內 |Z| 先降後升，其實有兩個解：33.86 和 38.13。取第一個（課本解答一般給這個）。'),
        st('Step 4　k。', 'k = M/√(L<sub>1</sub>L<sub>2</sub>) = 33.86/√(30 × 50) = 0.8742', '另一個解 X = 38.13 對應 k = 0.9845，也會讓 10 Ω 剛好吃 320 W。'),
        st('Step 5　電流。', 'I<sub>1</sub> = 165/Z = 8∠−29.76° A；流進二次側點的電流 I<sub>2</sub> = −jωM I<sub>1</sub>/(20 + j50) = 5.030∠172.04° A', '二次側 KVL：jωL<sub>2</sub>I<sub>2</sub> + jωM I<sub>1</sub> + 20I<sub>2</sub> = 0。'),
        st('Step 6　t = 1.5 s 的能量。', 'i<sub>1</sub> = 8 cos(1500 − 29.76°) = −4.712 A；i<sub>2</sub> = 5.030 cos(1500 + 172.04°) = 1.241 A ⟹ w = ½L<sub>1</sub>i<sub>1</sub><sup>2</sup> + ½L<sub>2</sub>i<sub>2</sub><sup>2</sup> + Mi<sub>1</sub>i<sub>2</sub> = 0.1736 J', '1500 是弧度；兩個電流都定義成流進點，互感項取 +。')
      ],
      ans: 'k ≈ 0.8742（另一解 k ≈ 0.9845）；w(1.5 s) ≈ 0.1736 J（k = 0.8742 時）', note: '電壓是 165 cos(1000t)，用峰值算平均功率要乘 ½。數學上有兩個 k 都成立，程式驗算過。' }),
    it(30, '13.4', '反射阻抗 vs T 型等效求 Z<sub>in</sub>', { fig: F.f1399, cap: '圖 13.99（重畫）',
      q: '(a) 用反射阻抗求圖 13.99 電路的輸入阻抗。(b) 把線性變壓器換成 T 型等效再求一次。',
      en: '(a) Find the input impedance of the circuit in Fig. 13.99 using the concept of reflected impedance. (b) Obtain the input impedance by replacing the linear transformer by its T equivalent.',
      hint: 'Z<sub>R</sub> = ω<sup>2</sup>M<sup>2</sup>/Z<sub>22</sub>，Z<sub>22</sub> = 二次側線圈 + 負載。兩個點都在上 ⟹ T 型：L<sub>1</sub> − M、L<sub>2</sub> − M、M。',
      steps: [
        st('Step 1　(a) 二次側阻抗。', 'Z<sub>22</sub> = j20 + 8 − j6 = 8 + j14 Ω', ''),
        st('Step 2　(a) 反射阻抗。', 'Z<sub>R</sub> = (10)<sup>2</sup>/(8 + j14) = 3.077 − j5.385 Ω', 'ωM = 10，ω<sup>2</sup>M<sup>2</sup> = 100。'),
        st('Step 3　(a) 加起來。', 'Z<sub>in</sub> = j40 + 25 + j30 + Z<sub>R</sub> = 28.08 + j64.62 Ω', ''),
        st('Step 4　(b) T 型。', 'Z<sub>a</sub> = j30 − j10 = j20；Z<sub>b</sub> = j20 − j10 = j10；Z<sub>c</sub> = j10', ''),
        st('Step 5　(b) 化簡。', 'Z<sub>in</sub> = 25 + j40 + j20 + j10 ∥ (j10 + 8 − j6) = 28.08 + j64.62 Ω', '兩種方法答案一樣。')
      ],
      ans: 'Z<sub>in</sub> ≈ 28.08 + j64.62 Ω（兩種方法相同）' }),
    it(32, '13.4', '兩個線性變壓器串接', { fig: F.f13101, cap: '圖 13.101（重畫）',
      q: '兩個線性變壓器照圖 13.101 串接，證明 Z<sub>in</sub> = [ω<sup>2</sup>R(L<sub>a</sub><sup>2</sup> + L<sub>a</sub>L<sub>b</sub> − M<sub>a</sub><sup>2</sup>) + jω<sup>3</sup>(L<sub>a</sub><sup>2</sup>L<sub>b</sub> + L<sub>a</sub>L<sub>b</sub><sup>2</sup> − L<sub>a</sub>M<sub>b</sub><sup>2</sup> − L<sub>b</sub>M<sub>a</sub><sup>2</sup>)] / [ω<sup>2</sup>(L<sub>a</sub>L<sub>b</sub> + L<sub>b</sub><sup>2</sup> − M<sub>b</sub><sup>2</sup>) − jωR(L<sub>a</sub> + L<sub>b</sub>)]。',
      en: 'Two linear transformers are cascaded as shown in Fig. 13.101. Show that Z<sub>in</sub> = [ω<sup>2</sup>R(L<sub>a</sub><sup>2</sup> + L<sub>a</sub>L<sub>b</sub> − M<sub>a</sub><sup>2</sup>) + jω<sup>3</sup>(L<sub>a</sub><sup>2</sup>L<sub>b</sub> + L<sub>a</sub>L<sub>b</sub><sup>2</sup> − L<sub>a</sub>M<sub>b</sub><sup>2</sup> − L<sub>b</sub>M<sub>a</sub><sup>2</sup>)] / [ω<sup>2</sup>(L<sub>a</sub>L<sub>b</sub> + L<sub>b</sub><sup>2</sup> − M<sub>b</sub><sup>2</sup>) − jωR(L<sub>a</sub> + L<sub>b</sub>)].',
      hint: '從右邊往左一層一層反射：先求第二個變壓器一次側看進去的 Z<sub>2</sub>，它就是第一個變壓器的負載。',
      steps: [
        st('Step 1　第二個變壓器。', 'Z<sub>2</sub> = jωL<sub>b</sub> + ω<sup>2</sup>M<sub>b</sub><sup>2</sup>/(R + jωL<sub>b</sub>)', '反射阻抗公式。'),
        st('Step 2　第一個變壓器。', 'Z<sub>in</sub> = jωL<sub>a</sub> + ω<sup>2</sup>M<sub>a</sub><sup>2</sup>/(jωL<sub>a</sub> + Z<sub>2</sub>)', '第一個的二次側線圈 L<sub>a</sub> 串上 Z<sub>2</sub>。'),
        st('Step 3　通分。', '分子、分母同乘 (R + jωL<sub>b</sub>)，整理後就是題目的式子', '用 sympy 驗算過：Z<sub>in</sub> − 題目式子 = 0。')
      ],
      ans: '證明如詳解（兩次反射阻抗）' }),

    /* ═══════════ 13.5 理想變壓器 ═══════════ */
    it(36, '13.5', '四種接法的電壓、電流關係', { fig: F.f13105, cap: '圖 13.105（重畫）',
      q: '照課本圖 13.32 的做法，寫出圖 13.105 四個理想變壓器的端電壓與電流關係。',
      en: 'As done in Fig. 13.32, obtain the relationships between terminal voltages and currents for each of the ideal transformers in Fig. 13.105.',
      hint: '電壓：V<sub>1</sub>、V<sub>2</sub> 的 + 都在點（或都不在點）⟹ V<sub>2</sub> = nV<sub>1</sub>，否則 −n。電流：一個流進點、一個流出點 ⟹ I<sub>2</sub> = I<sub>1</sub>/n；都流進或都流出 ⟹ −I<sub>1</sub>/n。',
      steps: [
        st('Step 1　(a) 點：一次上、二次下。', 'V<sub>2</sub> = −nV<sub>1</sub>；I<sub>1</sub> 進點、I<sub>2</sub>（往左進上端）出點 ⟹ I<sub>2</sub> = I<sub>1</sub>/n', ''),
        st('Step 2　(b) 點：一次下、二次上。', 'V<sub>2</sub> = −nV<sub>1</sub>；I<sub>1</sub> 出點、I<sub>2</sub>（往右從上端流出）出點 ⟹ I<sub>2</sub> = −I<sub>1</sub>/n', ''),
        st('Step 3　(c) 點：都在下。', 'V<sub>2</sub> = nV<sub>1</sub>；I<sub>1</sub> 出點、I<sub>2</sub>（往右流出上端＝從下端點流進）進點 ⟹ I<sub>2</sub> = I<sub>1</sub>/n', ''),
        st('Step 4　(d) 點：都在下、I<sub>2</sub> 往左。', 'V<sub>2</sub> = nV<sub>1</sub>；I<sub>1</sub> 出點、I<sub>2</sub> 出點 ⟹ I<sub>2</sub> = −I<sub>1</sub>/n', ''),
        st('Step 5　檢查：理想變壓器不吃功率。', '每一種都有 V<sub>1</sub>I<sub>1</sub>* = 二次側送出的 V<sub>2</sub>I<sub>2</sub>*（照箭頭方向換算後）', '拿來檢查正負號有沒有配對。')
      ],
      ans: '(a) V<sub>2</sub> = −nV<sub>1</sub>、I<sub>2</sub> = I<sub>1</sub>/n　(b) V<sub>2</sub> = −nV<sub>1</sub>、I<sub>2</sub> = −I<sub>1</sub>/n　(c) V<sub>2</sub> = nV<sub>1</sub>、I<sub>2</sub> = I<sub>1</sub>/n　(d) V<sub>2</sub> = nV<sub>1</sub>、I<sub>2</sub> = −I<sub>1</sub>/n',
      note: '點的位置是從課本圖判讀；如果你的課本圖點不一樣，照提示的規則重判。' }),
    it(37, '13.5', '升壓變壓器的匝數比與電流', {
      q: '一個 480/2400 V rms 的升壓理想變壓器送 50 kW 給電阻性負載。求 (a) 匝數比 (b) 一次側電流 (c) 二次側電流。',
      en: 'A 480/2,400-V rms step-up ideal transformer delivers 50 kW to a resistive load. Calculate: (a) the turns ratio (b) the primary current (c) the secondary current',
      hint: 'n = V<sub>2</sub>/V<sub>1</sub>；理想變壓器兩邊功率相等，電阻負載 S = P。',
      steps: [
        st('Step 1　匝數比。', 'n = 2400/480 = 5', ''),
        st('Step 2　一次側電流。', 'I<sub>1</sub> = 50000/480 = 104.2 A', ''),
        st('Step 3　二次側電流。', 'I<sub>2</sub> = 50000/2400 = 20.83 A（= I<sub>1</sub>/n）', '')
      ],
      ans: '(a) n = 5　(b) 104.2 A　(c) 20.83 A' }),
    it(39, '13.5', '高壓側有串聯阻抗的變壓器', {
      q: '一個 1200/240 V rms 變壓器，高壓側有 60∠−30° Ω 的阻抗。低壓側接 0.8∠10° Ω 負載、一次側接 1200 V rms，求一次側與二次側電流。',
      en: 'A 1,200/240-V rms transformer has impedance 60∠−30° Ω on the high-voltage side. If the transformer is connected to a 0.8∠10°-Ω load on the low-voltage side, determine the primary and secondary currents when the transformer is connected to 1,200 V rms.',
      hint: 'n = 240/1200 = 0.2。負載反射到一次側：Z<sub>L</sub>/n<sup>2</sup>，再跟 60∠−30° 串聯。',
      steps: [
        st('Step 1　反射。', 'Z<sub>L</sub>/n<sup>2</sup> = 0.8∠10°/0.04 = 20∠10° Ω', ''),
        st('Step 2　總阻抗。', 'Z<sub>in</sub> = 60∠−30° + 20∠10° = 76.41∠−20.31° Ω', ''),
        st('Step 3　一次側電流。', 'I<sub>1</sub> = 1200/Z<sub>in</sub> = 15.70∠20.31° A', ''),
        st('Step 4　二次側電流。', 'I<sub>2</sub> = I<sub>1</sub>/n = 78.52∠20.31° A', '降壓 ⟹ 電流變大。')
      ],
      ans: 'I<sub>1</sub> ≈ 15.70∠20.31° A；I<sub>2</sub> ≈ 78.52∠20.31° A' }),
    it(40, '13.5', '戴維寧電源 + 理想變壓器送給負載的功率', {
      q: '匝數比 5 的理想變壓器，一次側接戴維寧參數 v<sub>Th</sub> = 10 cos 2000t V、R<sub>Th</sub> = 100 Ω 的電源，二次側接 200 Ω 負載。求負載的平均功率。',
      en: 'The primary of an ideal transformer with a turns ratio of 5 is connected to a voltage source with Thevenin parameters v<sub>Th</sub> = 10 cos 2000t V and R<sub>Th</sub> = 100 Ω. Determine the average power delivered to a 200-Ω load connected across the secondary winding.',
      hint: '200 Ω 反射到一次側 = 200/n<sup>2</sup>。理想變壓器不吃功率，一次側那個反射電阻吃的就是負載吃的。',
      steps: [
        st('Step 1　反射。', '200/25 = 8 Ω', ''),
        st('Step 2　一次側電流（峰值）。', 'I<sub>1</sub> = 10/(100 + 8) = 0.09259 A', ''),
        st('Step 3　功率。', 'P = ½(0.09259)<sup>2</sup>(8) = 34.29 mW', 'v<sub>Th</sub> 是峰值 10 V，平均功率乘 ½。')
      ],
      ans: 'P ≈ 34.29 mW' }),
    it(44, '13.5', '一次側有直流、二次側有交流', { fig: F.f13109, cap: '圖 13.109（重畫）',
      q: '求圖 13.109 理想變壓器電路中的 i<sub>1</sub>(t) 和 i<sub>2</sub>(t)。',
      en: 'In the ideal transformer circuit of Fig. 13.109, find i<sub>1</sub>(t) and i<sub>2</sub>(t).',
      hint: '變壓器只傳交流（變壓器線圈對直流像短路）。用疊加：直流只在一次側流 V<sub>o</sub>/R；交流由二次側電源 V<sub>m</sub> cos ωt 經變壓器反射過來。',
      steps: [
        st('Step 1　直流部分。', 'i<sub>1,dc</sub> = V<sub>o</sub>/R；二次側沒有直流電流', '直流的 di/dt = 0，線圈兩端沒電壓，也感應不到二次側。'),
        st('Step 2　交流：一次側電壓。', 'v<sub>1</sub> = −v<sub>2</sub>/n = −(V<sub>m</sub>/n) cos ωt', '一次側點在上、二次側點在下，兩邊電壓都取上 + ⟹ 差一個負號。'),
        st('Step 3　交流：一次側電流。', 'i<sub>1,ac</sub> = (0 − v<sub>1</sub>)/R = (V<sub>m</sub>/nR) cos ωt', ''),
        st('Step 4　二次側電流。', 'i<sub>2</sub> = i<sub>1,ac</sub>/n = (V<sub>m</sub>/n<sup>2</sup>R) cos ωt', 'i<sub>1</sub> 流進點、i<sub>2</sub>（往左進上端）流出點 ⟹ 取正。'),
        st('Step 5　合起來。', 'i<sub>1</sub>(t) = V<sub>o</sub>/R + (V<sub>m</sub>/nR) cos ωt', '')
      ],
      ans: 'i<sub>1</sub>(t) = V<sub>o</sub>/R + (V<sub>m</sub>/nR) cos ωt；i<sub>2</sub>(t) = (V<sub>m</sub>/n<sup>2</sup>R) cos ωt', note: '課本打 * 的挑戰題。正負號依圖上點的位置與 i<sub>2</sub> 箭頭判讀，請對照課本原圖確認。' }),
    it(60, '13.5', '兩個理想變壓器串接', { fig: F.f13125, cap: '圖 13.125（重畫）',
      q: '圖 13.125 中，(a) 求電流 I<sub>1</sub>、I<sub>2</sub>、I<sub>3</sub>；(b) 求 40 Ω 電阻消耗的功率。',
      en: 'Refer to the circuit in Fig. 13.125. (a) Find currents I<sub>1</sub>, I<sub>2</sub>, and I<sub>3</sub>. (b) Find the power dissipated in the 40-Ω resistor.',
      hint: '從最右邊往左反射：40 Ω 經 1:2 變 40/4；跟 5 Ω 串聯後並 10 Ω，再經 1:4 除以 16。',
      steps: [
        st('Step 1　40 Ω 反射到 1:2 一次側。', '40/2<sup>2</sup> = 10 Ω', ''),
        st('Step 2　化簡中間。', '(5 + 10) ∥ 10 = 6 Ω', ''),
        st('Step 3　反射到 1:4 一次側。', '6/4<sup>2</sup> = 0.375 Ω', ''),
        st('Step 4　I<sub>1</sub>。', 'I<sub>1</sub> = 120/(4 + 0.375) = 27.43 A', ''),
        st('Step 5　I<sub>2</sub>。', '第一個變壓器二次側電流 = I<sub>1</sub>/4 = 6.857 A，節點電壓 = 6.857 × 6 = 41.14 V ⟹ I<sub>2</sub> = 41.14/15 = 2.743 A', '點都在上、電流照箭頭方向 ⟹ 都是正。'),
        st('Step 6　I<sub>3</sub> 和功率。', 'I<sub>3</sub> = I<sub>2</sub>/2 = 1.371 A；P = 1.371<sup>2</sup> × 40 = 75.23 W', '')
      ],
      ans: '(a) I<sub>1</sub> ≈ 27.43 A、I<sub>2</sub> ≈ 2.743 A、I<sub>3</sub> ≈ 1.371 A　(b) P ≈ 75.23 W' }),

    /* ═══════════ 13.6 理想自耦變壓器 ═══════════ */
    it(67, '13.6', '40% 抽頭的降壓自耦變壓器', {
      q: '一個 40% 抽頭的自耦變壓器接 400 V、60 Hz 電源做降壓，二次側接 5 kVA、功率因數 1 的負載。求 (a) 二次側電壓 (b) 二次側電流 (c) 一次側電流。',
      en: 'An autotransformer with a 40 percent tap is supplied by an 400-V, 60-Hz source and is used for step-down operation. A 5-kVA load operating at unity power factor is connected to the secondary terminals. Find: (a) the secondary voltage, (b) the secondary current, (c) the primary current.',
      hint: '40% 抽頭 ⟹ 輸出電壓是輸入的 0.4 倍；理想時兩邊 S 相等。',
      steps: [
        st('Step 1　二次側電壓。', 'V<sub>2</sub> = 0.4 × 400 = 160 V', ''),
        st('Step 2　二次側電流。', 'I<sub>2</sub> = 5000/160 = 31.25 A', ''),
        st('Step 3　一次側電流。', 'I<sub>1</sub> = 5000/400 = 12.5 A', '')
      ],
      ans: '(a) 160 V　(b) 31.25 A　(c) 12.5 A' }),
    it(71, '13.6', '降壓自耦變壓器的輸入阻抗', { fig: F.f13134, cap: '圖 13.134（重畫）',
      q: '證明圖 13.134 自耦變壓器電路的 Z<sub>in</sub> = (1 + N<sub>1</sub>/N<sub>2</sub>)<sup>2</sup> Z<sub>L</sub>。',
      en: 'In the autotransformer circuit in Fig. 13.134, show that Z<sub>in</sub> = (1 + N<sub>1</sub>/N<sub>2</sub>)<sup>2</sup> Z<sub>L</sub>.',
      hint: '輸入端跨在整個繞組（N<sub>1</sub> + N<sub>2</sub> 匝）上，負載只跨在下面 N<sub>2</sub> 匝 ⟹ 降壓。',
      steps: [
        st('Step 1　電壓比。', 'V<sub>2</sub>/V<sub>1</sub> = N<sub>2</sub>/(N<sub>1</sub> + N<sub>2</sub>)', '每一匝電壓一樣。'),
        st('Step 2　電流比。', 'I<sub>2</sub>/I<sub>1</sub> = (N<sub>1</sub> + N<sub>2</sub>)/N<sub>2</sub>', '理想時 V<sub>1</sub>I<sub>1</sub> = V<sub>2</sub>I<sub>2</sub>。'),
        st('Step 3　Z<sub>in</sub>。', 'Z<sub>in</sub> = V<sub>1</sub>/I<sub>1</sub> = [(N<sub>1</sub> + N<sub>2</sub>)/N<sub>2</sub>]<sup>2</sup> V<sub>2</sub>/I<sub>2</sub> = (1 + N<sub>1</sub>/N<sub>2</sub>)<sup>2</sup> Z<sub>L</sub>', '')
      ],
      ans: 'Z<sub>in</sub> = (1 + N<sub>1</sub>/N<sub>2</sub>)<sup>2</sup> Z<sub>L</sub>（證明如詳解）' }),

    /* ═══════════ 13.7 三相變壓器 ═══════════ */
    it(74, '13.7', 'Δ-Δ 三相變壓器的線電流與相電流', {
      q: '圖 13.136 的三相變壓器，一次側接線電壓 2.4 kV rms 的三相電源，二次側供應 120 kW、功率因數 0.8 的平衡負載。求 (a) 變壓器接法 (b) I<sub>LS</sub>、I<sub>PS</sub> (c) I<sub>LP</sub>、I<sub>PP</sub> (d) 每一相的 kVA 額定。',
      en: 'Consider the three-phase transformer shown in Fig. 13.136. The primary is fed by a three-phase source with line voltage of 2.4 kV rms, while the secondary supplies a three-phase 120-kW balanced load at pf of 0.8. Determine: (a) the type of transformer connections, (b) the values of I<sub>LS</sub> and I<sub>PS</sub>, (c) the values of I<sub>LP</sub> and I<sub>PP</sub>, (d) the kVA rating of each phase of the transformer.',
      hint: '課本圖是三個 4:1 單相變壓器，一次、二次都接在兩條線之間 ⟹ Δ-Δ。Δ 接：V<sub>L</sub> = V<sub>p</sub>、I<sub>L</sub> = √3 I<sub>p</sub>。',
      steps: [
        st('Step 1　接法與電壓。', 'Δ-Δ；二次側線電壓 = 2400/4 = 600 V', '每個單相變壓器 4:1 降壓。'),
        st('Step 2　總視在功率。', 'S = 120/0.8 = 150 kVA', ''),
        st('Step 3　二次側。', 'I<sub>LS</sub> = 150000/(√3 × 600) = 144.3 A；I<sub>PS</sub> = 144.3/√3 = 83.33 A', ''),
        st('Step 4　一次側。', 'I<sub>LP</sub> = 150000/(√3 × 2400) = 36.08 A；I<sub>PP</sub> = 36.08/√3 = 20.83 A', ''),
        st('Step 5　每相額定。', '150/3 = 50 kVA', '')
      ],
      ans: '(a) Δ-Δ　(b) I<sub>LS</sub> ≈ 144.3 A、I<sub>PS</sub> ≈ 83.33 A　(c) I<sub>LP</sub> ≈ 36.08 A、I<sub>PP</sub> ≈ 20.83 A　(d) 50 kVA', note: '課本圖 13.136 沒有重畫（接線很密）；接法依課本圖判讀為 Δ-Δ，請對照原圖確認。' }),
    it(75, '13.7', 'Δ-Y 降壓變壓器', {
      q: '一組平衡三相變壓器以 Δ-Y 接法（圖 13.137）把線電壓從 4500 V rms 降到 900 V rms。若供應 120 kVA 負載，求 (a) 變壓器匝數比 (b) 一次側、二次側線電流。',
      en: 'A balanced three-phase transformer bank with the Δ-Y connection depicted in Fig. 13.137 is used to step down line voltages from 4,500 V rms to 900 V rms. If the transformer feeds a 120-kVA load, find: (a) the turns ratio for the transformer, (b) the line currents at the primary and secondary sides.',
      hint: '匝數比要用「每個線圈」的電壓：Δ 側線圈電壓 = 線電壓；Y 側線圈電壓 = 線電壓/√3。',
      steps: [
        st('Step 1　每個線圈的電壓。', '一次（Δ）：4500 V；二次（Y）：900/√3 = 519.6 V', ''),
        st('Step 2　匝數比。', 'n = 519.6/4500 = 0.1155（約 1 : 8.66）', ''),
        st('Step 3　線電流。', 'I<sub>L1</sub> = 120000/(√3 × 4500) = 15.40 A；I<sub>L2</sub> = 120000/(√3 × 900) = 76.98 A', '')
      ],
      ans: '(a) n ≈ 0.1155　(b) 一次側 15.40 A、二次側 76.98 A', note: '課本題目寫 120 kVA，但圖 13.137 的方塊寫 42 kVA；這裡照題目文字 120 kVA。若用 42 kVA：5.389 A、26.94 A。' }),

    /* ═══════════ 13.9 應用 ═══════════ */
    it(85, '13.9', '音響匹配喇叭的匝數', {
      q: '輸出阻抗 7.2 kΩ 的音響放大器要用變壓器匹配 8 Ω 喇叭，一次側 3000 匝，求二次側匝數。',
      en: 'A stereo amplifier circuit with an output impedance of 7.2 kΩ is to be matched to a speaker with an input impedance of 8 Ω by a transformer whose primary side has 3,000 turns. Calculate the number of turns required on the secondary side.',
      hint: '匹配：Z<sub>L</sub>/n<sup>2</sup> = 7200。',
      steps: [
        st('Step 1　n。', 'n<sup>2</sup> = 8/7200 ⟹ n = 1/30', ''),
        st('Step 2　匝數。', 'N<sub>2</sub> = 3000/30 = 100 匝', '')
      ],
      ans: 'N<sub>2</sub> = 100 匝' }),
    it(86, '13.9', '反射阻抗', {
      q: '一次側 2400 匝、二次側 48 匝的變壓器當阻抗匹配用。二次側接 3 Ω 負載，反射到一次側是多少？',
      en: 'A transformer having 2,400 turns on the primary and 48 turns on the secondary is used as an impedance-matching device. What is the reflected value of a 3-Ω load connected to the secondary?',
      hint: 'Z<sub>in</sub> = Z<sub>L</sub>/n<sup>2</sup>，n = N<sub>2</sub>/N<sub>1</sub>。',
      steps: [
        st('Step 1　n。', 'n = 48/2400 = 0.02', ''),
        st('Step 2　反射。', 'Z<sub>in</sub> = 3/0.02<sup>2</sup> = 7500 Ω', '')
      ],
      ans: '7.5 kΩ' }),
    it(88, '13.9', '降壓變壓器送給負載的功率', {
      q: 'n = 0.1 的降壓電力變壓器供給電阻負載 12.6 V rms。若一次側電流 2.5 A rms，負載吃多少功率？',
      en: 'A step-down power transformer with a turns ratio of n = 0.1 supplies 12.6 V rms to a resistive load. If the primary current is 2.5 A rms, how much power is delivered to the load?',
      hint: 'I<sub>2</sub> = I<sub>1</sub>/n。',
      steps: [
        st('Step 1　二次側電流。', 'I<sub>2</sub> = 2.5/0.1 = 25 A', ''),
        st('Step 2　功率。', 'P = 12.6 × 25 = 315 W', '電阻負載 pf = 1。')
      ],
      ans: '315 W' }),
    it(89, '13.9', '電力變壓器的額定電流', {
      q: '一個額定 10 kVA 的 240/120 V rms 電力變壓器，求匝數比、一次側電流與二次側電流。',
      en: 'A 240/120-V rms power transformer is rated at 10 kVA. Determine the turns ratio, the primary current, and the secondary current.',
      hint: 'n = V<sub>2</sub>/V<sub>1</sub>，I = S/V。',
      steps: [
        st('Step 1　n。', 'n = 120/240 = 0.5', ''),
        st('Step 2　電流。', 'I<sub>1</sub> = 10000/240 = 41.67 A；I<sub>2</sub> = 10000/120 = 83.33 A', '')
      ],
      ans: 'n = 0.5、I<sub>1</sub> ≈ 41.67 A、I<sub>2</sub> ≈ 83.33 A' }),
    it(90, '13.9', '由額定求匝數與電流', {
      q: '一個 4 kVA、2400/240 V rms 的變壓器，一次側 250 匝。求 (a) 匝數比 (b) 二次側匝數 (c) 一次、二次側電流。',
      en: 'A 4-kVA, 2,400/240-V rms transformer has 250 turns on the primary side. Calculate: (a) the turns ratio, (b) the number of turns on the secondary side, (c) the primary and secondary currents.',
      hint: 'n = 240/2400。',
      steps: [
        st('Step 1　n。', 'n = 0.1', ''),
        st('Step 2　N<sub>2</sub>。', 'N<sub>2</sub> = 0.1 × 250 = 25 匝', ''),
        st('Step 3　電流。', 'I<sub>1</sub> = 4000/2400 = 1.667 A；I<sub>2</sub> = 4000/240 = 16.67 A', '')
      ],
      ans: '(a) 0.1　(b) 25 匝　(c) 1.667 A、16.67 A' }),
    it(91, '13.9', '配電變壓器的 kVA 額定', {
      q: '一個 25000/240 V rms 配電變壓器的一次側電流額定 75 A。(a) 求 kVA 額定 (b) 求二次側電流。',
      en: 'A 25,000/240-V rms distribution transformer has a primary current rating of 75 A. (a) Find the transformer kVA rating. (b) Calculate the secondary current.',
      hint: 'S = V<sub>1</sub>I<sub>1</sub>。',
      steps: [
        st('Step 1　S。', 'S = 25000 × 75 = 1875 kVA', ''),
        st('Step 2　I<sub>2</sub>。', 'I<sub>2</sub> = 1875000/240 = 7812.5 A', '')
      ],
      ans: '(a) 1875 kVA　(b) 7812.5 A' }),
    it(92, '13.9', '輸電線接配電變壓器', {
      q: '4800 V rms 輸電線接一次側 1200 匝、二次側 28 匝的配電變壓器，二次側接 10 Ω 負載。求 (a) 二次側電壓 (b) 一次、二次側電流 (c) 負載功率。',
      en: 'A 4,800-V rms transmission line feeds a distribution transformer with 1,200 turns on the primary and 28 turns on the secondary. When a 10-Ω load is connected across the secondary, find: (a) the secondary voltage, (b) the primary and secondary currents, (c) the power supplied to the load.',
      hint: 'V<sub>2</sub> = V<sub>1</sub>N<sub>2</sub>/N<sub>1</sub>。',
      steps: [
        st('Step 1　V<sub>2</sub>。', 'V<sub>2</sub> = 4800 × 28/1200 = 112 V', ''),
        st('Step 2　電流。', 'I<sub>2</sub> = 112/10 = 11.2 A；I<sub>1</sub> = 11.2 × 28/1200 = 0.2613 A', ''),
        st('Step 3　功率。', 'P = 112<sup>2</sup>/10 = 1254.4 W', '')
      ],
      ans: '(a) 112 V　(b) I<sub>1</sub> ≈ 0.2613 A、I<sub>2</sub> = 11.2 A　(c) 1254.4 W' }),

    /* ═══════════ 綜合題 ═══════════ */
    it(93, 'cp', '四繞組變壓器怎麼接', { fig: F.f13146, cap: '圖 13.146（重畫）',
      q: '四繞組變壓器（圖 13.146）常用在可以接 110 V 或 220 V 的設備。說明要怎麼接才能：(a) 輸入 110 V、輸出 14 V；(b) 輸入 220 V、輸出 50 V。',
      en: 'A four-winding transformer (Fig. 13.146) is often used in equipment (e.g., PCs, VCRs) that may be operated from either 110 or 220 V. This makes the equipment suitable for both domestic and foreign use. Show which connections are necessary to provide: (a) an output of 14 V with an input of 110 V, (b) an output of 50 V with an input of 220 V.',
      hint: '有點的端子：a、d、e、g。串聯加成：把一個的「沒點端」接到另一個的「有點端」；相消：沒點接沒點。',
      steps: [
        st('Step 1　(a) 一次側。', '110 V 接在 a-b（或 c-d；也可以 a 接 d、b 接 c 兩個並聯）', '每個一次繞組都是 110 V。'),
        st('Step 2　(a) 二次側相消。', '把 f 接 h，從 e、g 輸出：32 − 18 = 14 V', 'f、h 都是沒點端，接在一起 ⟹ 兩個電壓相減。'),
        st('Step 3　(b) 一次側串聯。', '把 b 接 d，220 V 加在 a、c 之間', 'b 沒點、d 有點 ⟹ 加成，110 + 110 = 220。'),
        st('Step 4　(b) 二次側串聯加成。', '把 f 接 g，從 e、h 輸出：32 + 18 = 50 V', '')
      ],
      ans: '(a) 110 V 接 a-b；f 接 h，e-g 輸出 14 V　(b) b 接 d，220 V 接 a-c；f 接 g，e-h 輸出 50 V', note: '點的位置是從課本圖判讀（a、d、e、g 有點），請對照原圖確認。' }),
    it(94, 'cp', '一般變壓器改接成自耦變壓器', {
      q: '一個 440/110 V 的理想變壓器可以改接成 550/440 V 的理想自耦變壓器。有四種接法，其中兩種是錯的。求 (a) 錯誤接法的輸出電壓 (b) 正確接法的輸出電壓。',
      en: 'A 440/110-V ideal transformer can be connected to become a 550/440-V ideal autotransformer. There are four possible connections, two of which are wrong. Find the output voltage of: (a) a wrong connection, (b) the right connection.',
      hint: '兩個繞組串聯：加成得 440 + 110，相消得 440 − 110。',
      steps: [
        st('Step 1　正確（加成）。', '輸入 440 V 接在 440 V 繞組上，輸出跨兩個繞組：440 + 110 = 550 V', ''),
        st('Step 2　錯誤（相消）。', '110 V 繞組極性接反：440 − 110 = 330 V', '')
      ],
      ans: '(a) 330 V　(b) 550 V', note: '課本打 * 的挑戰題。四種接法：輸入接在 440 V 或 110 V 繞組 × 加成或相消；題目要 550/440，正確的是輸入 440 V、兩繞組加成。' }),
    it(95, 'cp', '十個燈泡並聯在變壓器上', { fig: F.f13147, cap: '圖 13.147（重畫）',
      q: '十個並聯燈泡由 7200/120 V 變壓器供電（圖 13.147），每個燈泡模型為 144 Ω。求 (a) 匝數比 n (b) 一次側電流。',
      en: 'Ten bulbs in parallel are supplied by a 7,200/120-V transformer as shown in Fig. 13.147, where the bulbs are modeled by the 144-Ω resistors. Find: (a) the turns ratio n, (b) the current through the primary winding.',
      hint: '十個 144 Ω 並聯 = 14.4 Ω。',
      steps: [
        st('Step 1　n。', 'n = 120/7200 = 1/60', ''),
        st('Step 2　負載功率。', 'P = 120<sup>2</sup>/14.4 = 1000 W', ''),
        st('Step 3　一次側電流。', 'I<sub>1</sub> = 1000/7200 = 0.1389 A', '理想變壓器兩邊功率相等。')
      ],
      ans: '(a) n = 1/60　(b) I<sub>1</sub> ≈ 0.1389 A' })
  ];

  window.__CH13PB = window.__CH13PB || { book: 'Alexander & Sadiku', items: [] };
  window.__CH13PB.items = window.__CH13PB.items.concat(items);
  window.__CH13PB.F = F;
})();
