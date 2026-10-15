/* ============================================================
   電子學 CH1 PART 4 —— 課本例題與練習（Example 1.7、Exercise 1.7、TYU 1.7、TYU 1.8、§1.6 Design Application ＋ 自編練習）
   出處：Neamen, Microelectronics: Circuit Analysis and Design, 4th ed., §1.2.3～1.2.5、§1.6；
         原講義 PART 4 投影片 1-38～1-54
   - 練習題標籤寫出處（課本題號／自編練習），數值都用程式驗算過
   - 每一題都有 story：「🎬 圖解故事」（畫圖工具共用 ch1-part5-kit.js → __K15）
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const KK = () => window.__K15;

  /* 電源 — R — 二極體 串聯；rev：二極體反接 */
  function F(vps, r, opt) {
    opt = opt || {};
    const p = [
      S.vs(50, 30, 140, vps),
      S.w('50,30', '110,30'), S.r(110, 30, 190, 30, r), S.w('190,30', '250,30'),
      opt.rev ? S.d(250, 140, 250, 30, '') : S.d(250, 30, 250, 140, ''),
      S.w('250,140', '50,140'),
      S.t(272, 74, '+', 'middle'), S.t(272, 108, '−', 'middle'), S.t(282, 92, 'V_D', 'start'),
      S.t(222, 22, 'I_D →', 'middle', ' font-size="11"')
    ];
    return S.svg(400, 160, ['<g transform="translate(70,0)">'].concat(p, ['</g>']));
  }
  /* 單顆二極體加電壓 v_D（沒有外部電路） */
  function FD(lbl) {
    const p = [S.w('20,60', '60,60'), S.d(60, 60, 160, 60, ''), S.w('160,60', '200,60'), S.term(20, 60), S.term(200, 60),
      S.t(20, 40, '+', 'middle'), S.t(200, 40, '−', 'middle'), S.t(110, 92, lbl || 'v_D', 'middle'), S.t(110, 30, 'i_D →', 'middle', ' font-size="11"')];
    return S.svg(400, 110, ['<g transform="translate(90,0)">'].concat(p, ['</g>']));
  }

  const items = [
    /* ═══════════ 01 順偏：少數載子注入（自編） ═══════════ */
    { id: 'p4-inj', sec: 'fwd', kind: 'pp', no: '', tag: '自編練習（投影片 1-43）', title: '順偏 0.6 V，接面邊緣的電洞變多少？',
      q: '矽 pn 接面，N 側 N<sub>d</sub> = 10<sup>16</sup> cm<sup>−3</sup>，n<sub>i</sub> = 1.5×10<sup>10</sup> cm<sup>−3</sup>，V<sub>T</sub> = 0.026 V。加順偏 v<sub>D</sub> = 0.6 V，N 側空乏區邊緣的少數載子（電洞）濃度 p<sub>n</sub>(0) 是多少？跟 N<sub>d</sub> 比起來算不算「低注入」？',
      en: 'A silicon pn junction has N<sub>d</sub> = 10<sup>16</sup> cm<sup>−3</sup> on the n side (n<sub>i</sub> = 1.5×10<sup>10</sup> cm<sup>−3</sup>, V<sub>T</sub> = 0.026 V). With a forward bias of 0.6 V, find the minority hole concentration p<sub>n</sub>(0) at the edge of the space-charge region. Is this low injection?',
      hint: '先用質量作用定律求平衡時的 p<sub>n0</sub>，再乘上 e<sup>v<sub>D</sub>/V<sub>T</sub></sup>。',
      steps: [
        st('平衡時 N 側的電洞（質量作用定律）。', 'p<sub>n0</sub> = n<sub>i</sub><sup>2</sup>/N<sub>d</sub> = (1.5×10<sup>10</sup>)<sup>2</sup>/10<sup>16</sup> = 2.25×10<sup>4</sup> cm<sup>−3</sup>', 'N 型裡電洞是少數，少得可憐。'),
        st('順偏把坡壓低 0.6 V，邊緣濃度乘上指數倍數。', 'e<sup>0.6/0.026</sup> = e<sup>23.08</sup> ≈ 1.05×10<sup>10</sup>', '投影片 1-43：p<sub>n</sub>(0) = p<sub>n0</sub>e<sup>v<sub>D</sub>/V<sub>T</sub></sup>。'),
        st('相乘。', 'p<sub>n</sub>(0) = 2.25×10<sup>4</sup> × 1.05×10<sup>10</sup> ≈ 2.37×10<sup>14</sup> cm<sup>−3</sup>', '一口氣多了 10 個 0。'),
        st('跟多數載子比。', '2.37×10<sup>14</sup> / 10<sup>16</sup> ≈ 2.4%', '還遠小於 N<sub>d</sub>，算低注入，課本的公式成立。')
      ],
      ans: 'p<sub>n</sub>(0) ≈ 2.37×10<sup>14</sup> cm<sup>−3</sup>（是平衡時的 10<sup>10</sup> 倍，但只有 N<sub>d</sub> 的 2.4%，仍是低注入）',
      story: () => {
        const { g, T, calc, sc, ansScene } = KK();
        const bar = (x, h, lab, key, acc) => g(key, '<rect class="' + (acc ? 'acc' : 'bgw') + '" x="' + x + '" y="' + (290 - h) + '" width="70" height="' + h + '" rx="4" style="stroke:var(--s-ink);stroke-width:1.5"/>' + T(x + 35, 284 - h, lab, { cls: acc ? 'ta' : 't', fs: 13 }));
        return [
          sc('平衡：N 側幾乎沒有電洞', 'EQUILIBRIUM',
            calc(70, 118, 300, [['p<sub>n0</sub> = n<sub>i</sub><sup>2</sup> / N<sub>d</sub>', 'r1'], ['= (1.5×10<sup>10</sup>)<sup>2</sup> / 10<sup>16</sup>', 'r2'], ['= 2.25×10<sup>4</sup> cm<sup>−3</sup>', 'r3', 'ta']], { k: 'cc', title: '質量作用定律' }) +
            '<line class="ln2" x1="400" y1="290" x2="600" y2="290"/>' + bar(420, 6, 'p<sub>n0</sub>', 'b1') + bar(510, 180, 'N<sub>d</sub> 10<sup>16</sup>', 'b2'),
            [{ sub: 'N 側的電子是多數：10<sup>16</sup> 個。', on: 'b2' },
             { sub: '電洞是少數：用 n<sub>i</sub><sup>2</sup>/N<sub>d</sub> 算。', on: 'cc r1 r2' },
             { sub: '只有 2.25×10<sup>4</sup> 個，比電子少 12 個 0（柱子幾乎看不見）。', on: 'r3 b1' }]),
          sc('順偏：坡壓低，電洞湧進來', 'INJECTION',
            calc(110, 118, 420, [['坡壓低 v<sub>D</sub> = 0.6 V', 'r1'], ['邊緣濃度 × e<sup>v<sub>D</sub>/V<sub>T</sub></sup>', 'r2'], ['e<sup>0.6/0.026</sup> = e<sup>23.08</sup> ≈ 1.05×10<sup>10</sup>', 'r3', 'ta'], ['p<sub>n</sub>(0) = 2.25×10<sup>4</sup> × 1.05×10<sup>10</sup> ≈ 2.37×10<sup>14</sup>', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '就像收費站降價：門檻低了 0.6 V，翻過去的人暴增。', on: 'cc r1' },
             { sub: '每低 26 mV，邊緣濃度就乘 e 倍。', on: 'r2' },
             { sub: '0.6 V 等於乘了 10<sup>10</sup> 倍。', on: 'r3' },
             { sub: '所以 p<sub>n</sub>(0) ≈ 2.37×10<sup>14</sup> cm<sup>−3</sup>。', on: 'r4' }]),
          sc('還是「低注入」嗎？', 'LOW INJECTION?',
            '<line class="ln2" x1="150" y1="290" x2="490" y2="290"/>' + bar(190, 6, '注入前', 'b1') + bar(285, 4.3 + 0.024 * 180, '2.37×10<sup>14</sup>', 'b2', true) + bar(380, 180, 'N<sub>d</sub>', 'b3') +
            T(320, 128, '2.37×10<sup>14</sup> / 10<sup>16</sup> ≈ 2.4%', { cls: 'ta', fs: 16, k: 'r' }),
            [{ sub: '把注入後的電洞跟多數載子 N<sub>d</sub> 放一起比。', on: 'b1 b2 b3' },
             { sub: '只有 2.4%：電子還是壓倒性多數，叫<b>低注入</b>，課本公式成立。', on: 'r' }]),
          ansScene(['p<sub>n</sub>(0) ≈ 2.37×10<sup>14</sup> cm<sup>−3</sup>', '是平衡時的 10<sup>10</sup> 倍', '只有 N<sub>d</sub> 的 2.4% → 低注入'], ['答案：約 2.37×10<sup>14</sup> cm<sup>−3</sup>，仍是低注入。'])
        ];
      } },

    /* ═══════════ 02 理想 I–V：Example 1.7 ═══════════ */
    { id: 'ex1-7b', sec: 'iv', kind: 'ex', no: '1.7', title: '用二極體方程式算電流（順偏與逆偏）',
      q: 'pn 接面在 T = 300 K，I<sub>S</sub> = 10<sup>−14</sup> A、n = 1。求 v<sub>D</sub> = +0.70 V 與 v<sub>D</sub> = −0.70 V 時的二極體電流。',
      en: 'Consider a pn junction at T = 300 K in which I<sub>S</sub> = 10<sup>−14</sup> A and n = 1. Find the diode current for v<sub>D</sub> = +0.70 V and v<sub>D</sub> = −0.70 V.',
      fig: FD('v_D = ±0.70 V'), cap: '只看二極體本身：加 v<sub>D</sub>，求 i<sub>D</sub>',
      idea: '直接代 i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/nV<sub>T</sub></sup> − 1)。正的 v<sub>D</sub> 讓 e 項變超大，負的讓 e 項趨近 0。',
      steps: [
        st('熱電壓。', 'V<sub>T</sub> = kT/e ≈ 0.026 V（300 K）', '室溫的固定值，投影片 1-44。'),
        st('順偏：先算指數。', 'v<sub>D</sub>/V<sub>T</sub> = 0.70/0.026 = 26.92　⟹　e<sup>26.92</sup> ≈ 4.93×10<sup>11</sup>', 'e 的 27 次方，大到 −1 可以直接丟掉。'),
        st('順偏電流。', 'i<sub>D</sub> = 10<sup>−14</sup> × (4.93×10<sup>11</sup> − 1) ≈ 4.93 mA', 'I<sub>S</sub> 雖然只有 10<sup>−14</sup>，乘上 10<sup>11</sup> 就變 mA 等級。'),
        st('逆偏：指數變負。', 'e<sup>−26.92</sup> ≈ 2×10<sup>−12</sup> ≈ 0', '負的大次方幾乎是 0。'),
        st('逆偏電流。', 'i<sub>D</sub> = 10<sup>−14</sup> × (0 − 1) ≈ −10<sup>−14</sup> A', '只剩 −I<sub>S</sub>：方向反過來、小到幾乎是 0。')
      ],
      ans: 'v<sub>D</sub> = +0.70 V：i<sub>D</sub> ≈ 4.93 mA；v<sub>D</sub> = −0.70 V：i<sub>D</sub> ≈ −10<sup>−14</sup> A',
      note: '程式驗算：e<sup>0.7/0.026</sup> = 4.927×10<sup>11</sup> → 4.927 mA。同樣 0.7 V，正反接電流差了 10<sup>11</sup> 倍 —— 這就是「整流」。',
      story: () => {
        const { T, calc, sc, axes, ansScene } = KK();
        const P = axes(330, 116, 260, 170, { v0: -0.8, v1: 0.8, i0: -0.6, i1: 5.6, vt: [[-0.7, '−0.7'], [0.7, '0.7']], it: [[4.93, '4.93 mA']] });
        const iv = v => 1e-14 * (Math.exp(v / 0.026) - 1) * 1e3;
        return [
          sc('一條公式管兩個方向', 'ONE EQUATION',
            calc(60, 120, 250, [['i<sub>D</sub> = I<sub>S</sub>(e<sup>v<sub>D</sub>/V<sub>T</sub></sup> − 1)', 'r1', 'ta'], ['I<sub>S</sub> = 10<sup>−14</sup> A', 'r2'], ['V<sub>T</sub> = 0.026 V', 'r3']], { k: 'cc' }) +
            P.svg + P.curve(iv, -0.8, 0.72, 'cv'),
            [{ sub: '二極體方程式：電流是電壓的指數函數。', on: 'cc r1' },
             { sub: '這題給 I<sub>S</sub> = 10<sup>−14</sup> A、室溫 V<sub>T</sub> = 0.026 V。', on: 'r2 r3' },
             { sub: '畫出來：左邊貼地、右邊在 0.6 V 之後突然衝上去。', on: 'cv' }]),
          sc('順偏 +0.70 V', 'FORWARD',
            P.svg + P.curve(iv, -0.8, 0.72, null) + P.proj(0.7, 4.93, 'pj') + P.dot(0.7, 4.93, 'q') +
            calc(40, 120, 270, [['0.70 / 0.026 = 26.92', 'r1'], ['e<sup>26.92</sup> ≈ 4.93×10<sup>11</sup>', 'r2'], ['× 10<sup>−14</sup> → 4.93 mA', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '代 +0.70 V：指數是 26.92。', on: 'cc r1' },
             { sub: 'e 的 27 次方 ≈ 5×10<sup>11</sup>，「−1」可以不管。', on: 'r2' },
             { sub: '乘上極小的 I<sub>S</sub>，剛好變成 <b>4.93 mA</b>。', on: 'r3 pj q' }]),
          sc('逆偏 −0.70 V', 'REVERSE',
            P.svg + P.curve(iv, -0.8, 0.72, null) + P.dot(-0.7, 0, 'q') +
            T(P.X(-0.7), P.Y(0) - 14, '≈ −10<sup>−14</sup> A', { cls: 'ta', fs: 13, k: 'ql' }) +
            calc(40, 120, 270, [['e<sup>−26.92</sup> ≈ 0', 'r1'], ['i<sub>D</sub> ≈ 10<sup>−14</sup>(0 − 1)', 'r2'], ['= −10<sup>−14</sup> A', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '反過來加 −0.70 V：e 的負 27 次方幾乎是 0。', on: 'cc r1' },
             { sub: '括號裡只剩 −1。', on: 'r2' },
             { sub: '電流 = −I<sub>S</sub> = −10<sup>−14</sup> A，<b>幾乎是 0</b>。', on: 'r3 q ql' }]),
          ansScene(['+0.70 V：i<sub>D</sub> ≈ 4.93 mA', '−0.70 V：i<sub>D</sub> ≈ −10<sup>−14</sup> A', '同樣 0.7 V，差 10<sup>11</sup> 倍'], ['答案：4.93 mA 與 −10<sup>−14</sup> A。'])
        ];
      } },

    { id: 'ex1-7p', sec: 'iv', kind: 'pp', no: '', tag: 'Exercise 1.7', title: '反過來：要多少電流，就要多少電壓',
      q: '(a) 矽 pn 接面，T = 300 K，I<sub>S</sub> = 2×10<sup>−14</sup> A。要產生 (i) I<sub>D</sub> = 50 µA、(ii) I<sub>D</sub> = 1 mA，各需要多大的順偏電壓？(b) I<sub>S</sub> 改成 2×10<sup>−12</sup> A 再算一次。',
      en: '(a) A silicon pn junction at T = 300 K has a reverse-saturation current of I<sub>S</sub> = 2×10<sup>−14</sup> A. Determine the required forward-bias voltage to produce a current of (i) I<sub>D</sub> = 50 µA and (ii) I<sub>D</sub> = 1 mA. (b) Repeat part (a) for I<sub>S</sub> = 2×10<sup>−12</sup> A.',
      fig: FD('v_D = ?'), cap: '給電流求電壓',
      hint: '順偏時 −1 可以丟掉：I<sub>D</sub> ≈ I<sub>S</sub>e<sup>V<sub>D</sub>/V<sub>T</sub></sup> ⟹ V<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub>)。',
      steps: [
        st('把公式反過來解 V<sub>D</sub>。', 'V<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub>)', '兩邊取 ln，指數就掉下來。'),
        st('(a)(i) 50 µA。', 'V<sub>D</sub> = 0.026 ln(50×10<sup>−6</sup> / 2×10<sup>−14</sup>) = 0.026 × ln(2.5×10<sup>9</sup>) = 0.026 × 21.64 = 0.563 V', ''),
        st('(a)(ii) 1 mA。', 'V<sub>D</sub> = 0.026 × ln(5×10<sup>10</sup>) = 0.026 × 24.64 = 0.641 V', '電流 ×20，電壓只多 78 mV。'),
        st('(b) I<sub>S</sub> 大 100 倍。', '50 µA：0.026 × ln(2.5×10<sup>7</sup>) = 0.443 V　｜　1 mA：0.026 × ln(5×10<sup>8</sup>) = 0.521 V', 'I<sub>S</sub> ×100 → 同樣電流，電壓少 0.026 × ln 100 = 0.120 V。')
      ],
      ans: '(a) (i) 0.563 V、(ii) 0.641 V；(b) (i) 0.443 V、(ii) 0.521 V（與課本答案一致）',
      story: () => {
        const { T, calc, sc, axes, ansScene } = KK();
        const P = axes(370, 116, 225, 170, { v0: 0.3, v1: 0.7, i0: 0, i1: 1.2, xl: 'V<sub>D</sub>', vt: [[0.443, '.443'], [0.521, '.521'], [0.563, '.563'], [0.641, '.641']], it: [[1, '1 mA']] });
        const ivA = v => 2e-14 * Math.exp(v / 0.026) * 1e3, ivB = v => 2e-12 * Math.exp(v / 0.026) * 1e3;
        return [
          sc('把公式翻過來', 'SOLVE FOR V<sub>D</sub>',
            calc(110, 120, 420, [['I<sub>D</sub> = I<sub>S</sub>e<sup>V<sub>D</sub>/V<sub>T</sub></sup>', 'r1'], ['兩邊取 ln：ln(I<sub>D</sub>/I<sub>S</sub>) = V<sub>D</sub>/V<sub>T</sub>', 'r2'], ['V<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub>)', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '這次給電流、要電壓：把指數公式倒過來用。', on: 'cc r1' },
             { sub: '取 ln，指數就掉下來。', on: 'r2' },
             { sub: '得到 V<sub>D</sub> = V<sub>T</sub> ln(I<sub>D</sub>/I<sub>S</sub>)。', on: 'r3' }]),
          sc('(a) I<sub>S</sub> = 2×10<sup>−14</sup> A', 'PART (a)',
            P.svg + P.curve(ivA, 0.3, 0.66, 'ca') + P.dot(0.563, 0.05, 'q1') + P.dot(0.641, 1, 'q2') +
            calc(40, 120, 270, [['50 µA → 0.026 × 21.64', 'r1'], ['= 0.563 V', 'r2', 'ta'], ['1 mA → 0.026 × 24.64', 'r3'], ['= 0.641 V', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '50 µA：ln(2.5×10<sup>9</sup>) = 21.64。', on: 'cc r1 ca' },
             { sub: '乘 0.026，得 0.563 V。', on: 'r2 q1' },
             { sub: '1 mA：ln(5×10<sup>10</sup>) = 24.64 → 0.641 V。', on: 'r3 r4 q2' }]),
          sc('(b) I<sub>S</sub> 大 100 倍', 'PART (b)',
            P.svg + P.curve(ivA, 0.3, 0.66, null, 'ln2') + P.curve(ivB, 0.3, 0.56, 'cb') + P.dot(0.443, 0.05, 'q1') + P.dot(0.521, 1, 'q2') +
            calc(40, 120, 270, [['50 µA → 0.443 V', 'r1', 'ta'], ['1 mA → 0.521 V', 'r2', 'ta'], ['都少了 0.120 V', 'r3']], { k: 'cc' }),
            [{ sub: 'I<sub>S</sub> 變 100 倍，整條曲線往左平移。', on: 'cb' },
             { sub: '同樣 50 µA、1 mA，只要 0.443 V、0.521 V。', on: 'cc r1 r2 q1 q2' },
             { sub: '都少 0.026 × ln 100 = 0.120 V —— 平移量固定。', on: 'r3' }]),
          ansScene(['(a) 0.563 V、0.641 V', '(b) 0.443 V、0.521 V'], ['答案跟課本一致。'])
        ];
      } },

    { id: 'tyu1-7b', sec: 'iv', kind: 'pp', no: '', tag: 'TYU 1.7', title: '三個順偏電壓、兩個逆偏電壓',
      q: '矽 pn 接面二極體，T = 300 K，I<sub>S</sub> = 10<sup>−16</sup> A。(a) 求順偏 (i) V<sub>D</sub> = 0.55 V、(ii) 0.65 V、(iii) 0.75 V 的電流。(b) 求逆偏 (i) V<sub>D</sub> = −0.55 V、(ii) −2.5 V 的電流。',
      en: 'A silicon pn junction diode at T = 300 K has I<sub>S</sub> = 10<sup>−16</sup> A. (a) Determine the forward-bias diode current for (i) V<sub>D</sub> = 0.55 V, (ii) 0.65 V, and (iii) 0.75 V. (b) Find the reverse-bias diode current for (i) V<sub>D</sub> = −0.55 V and (ii) −2.5 V.',
      hint: '順偏代 I<sub>S</sub>e<sup>V<sub>D</sub>/V<sub>T</sub></sup>；逆偏只要幾個 V<sub>T</sub> 以上，電流就是 −I<sub>S</sub>。',
      steps: [
        st('(a)(i) 0.55 V。', 'e<sup>0.55/0.026</sup> = e<sup>21.15</sup> = 1.54×10<sup>9</sup> → i = 0.154 µA', ''),
        st('(a)(ii) 0.65 V。', 'e<sup>25.0</sup> = 7.20×10<sup>10</sup> → i = 7.20 µA', '多 0.1 V，電流 ×47。'),
        st('(a)(iii) 0.75 V。', 'e<sup>28.85</sup> = 3.37×10<sup>12</sup> → i = 0.337 mA', '再多 0.1 V，又 ×47。'),
        st('(b) 逆偏。', 'e<sup>−21.15</sup>、e<sup>−96</sup> 都 ≈ 0 → i ≈ −I<sub>S</sub> = −10<sup>−16</sup> A', '逆偏電流飽和：不管 −0.55 V 還是 −2.5 V 都一樣，所以叫「飽和」電流。')
      ],
      ans: '(a) 0.154 µA、7.20 µA、0.337 mA；(b) 兩個都是 −10<sup>−16</sup> A（與課本答案一致）',
      story: () => {
        const { g, T, calc, sc, ansScene } = KK();
        /* 對數尺：10<sup>−16</sup> A ～ 10<sup>−3</sup> A */
        const X = lg => 80 + (lg + 16) / 13 * 480;
        const tick = (lg, lab) => '<line class="ln2" x1="' + X(lg) + '" y1="236" x2="' + X(lg) + '" y2="244"/>' + T(X(lg), 262, lab, { cls: 'ts', fs: 11 });
        const mark = (lg, lab, key, y, a) => g(key, '<circle class="acc" cx="' + X(lg) + '" cy="240" r="6"/>' + (y < 230 ? '<line class="ln2" x1="' + X(lg) + '" y1="232" x2="' + X(lg) + '" y2="' + (y + 6) + '"/>' : '') + T(X(lg) + (a === 'end' ? 4 : a === 'start' ? -4 : 0), y, lab, { cls: 'ta', fs: 12.5, a: a || 'middle' }));
        const axis = '<line class="ln" x1="80" y1="240" x2="560" y2="240"/>' + tick(-16, '10<sup>−16</sup>') + tick(-12, '10<sup>−12</sup>') + tick(-9, 'nA') + tick(-6, 'µA') + tick(-3, 'mA');
        return [
          sc('電流差多少個 0？', 'ORDERS OF MAGNITUDE',
            axis + calc(140, 112, 360, [['i = I<sub>S</sub>e<sup>V<sub>D</sub>/0.026</sup>，I<sub>S</sub> = 10<sup>−16</sup> A', 'r1']], { k: 'cc' }) +
            mark(Math.log10(1.54e-7), '0.55 V：0.154 µA', 'm1', 214, 'end') + mark(Math.log10(7.2e-6), '0.65 V：7.20 µA', 'm2', 288) + mark(Math.log10(3.37e-4), '0.75 V：0.337 mA', 'm3', 184, 'end'),
            [{ sub: '電流從 10<sup>−16</sup> 到 mA，差了 13 個 0，所以用「對數尺」畫。', on: 'cc r1' },
             { sub: '0.55 V：0.154 µA。', on: 'm1' },
             { sub: '0.65 V：7.20 µA —— 多 0.1 V，電流 ×47。', on: 'm2' },
             { sub: '0.75 V：0.337 mA —— 再 ×47。', on: 'm3' }]),
          sc('逆偏：卡在 −I<sub>S</sub>', 'REVERSE SATURATION',
            axis + mark(-16, '−0.55 V 與 −2.5 V：都是 −10<sup>−16</sup> A', 'm4', 214, 'start') +
            calc(140, 112, 360, [['e<sup>−21</sup>、e<sup>−96</sup> 都 ≈ 0', 'r1'], ['i ≈ −I<sub>S</sub>，跟電壓無關', 'r2', 'ta']], { k: 'cc' }),
            [{ sub: '逆偏時 e 的次方是負的大數，幾乎是 0。', on: 'cc r1' },
             { sub: '電流停在 −I<sub>S</sub>，加 −0.55 V 或 −2.5 V 都一樣 —— 「飽和」。', on: 'r2 m4' }]),
          ansScene(['0.154 µA、7.20 µA、0.337 mA', '逆偏：−10<sup>−16</sup> A（兩個都是）'], ['答案跟課本一致。'])
        ];
      } },

    /* ═══════════ 03 60 mV／decade（自編） ═══════════ */
    { id: 'p4-dec', sec: 'dec', kind: 'pp', no: '', tag: '自編練習（投影片 1-48）', title: '電流 ×10、×100、÷10，電壓各變多少？',
      q: '一顆矽二極體（n = 1，V<sub>T</sub> = 0.026 V）在 I<sub>D</sub> = 1 mA 時 V<sub>D</sub> = 0.650 V。(a) 電流變 10 mA、0.1 mA 時 V<sub>D</sub> 各是多少？(b) V<sub>D</sub> 多 0.12 V，電流變幾倍？(c) 若 n = 2，(a) 的答案變成多少？',
      en: 'A silicon diode (n = 1, V<sub>T</sub> = 0.026 V) has V<sub>D</sub> = 0.650 V at I<sub>D</sub> = 1 mA. (a) Find V<sub>D</sub> at 10 mA and 0.1 mA. (b) By what factor does the current change if V<sub>D</sub> increases by 0.12 V? (c) Repeat (a) for n = 2.',
      hint: '兩點相除，I<sub>S</sub> 消掉：ΔV<sub>D</sub> = nV<sub>T</sub> ln(I<sub>2</sub>/I<sub>1</sub>)。',
      steps: [
        st('兩點相除。', 'I<sub>2</sub>/I<sub>1</sub> = e<sup>(V<sub>2</sub> − V<sub>1</sub>)/nV<sub>T</sub></sup>　⟹　ΔV<sub>D</sub> = nV<sub>T</sub> ln(I<sub>2</sub>/I<sub>1</sub>)', '不用知道 I<sub>S</sub>。'),
        st('(a) ×10 與 ÷10。', 'ΔV = 0.026 × ln 10 = 0.0599 V　⟹　10 mA：0.710 V；0.1 mA：0.590 V', '這就是「60 mV／decade」。'),
        st('(b) 多 0.12 V。', 'I<sub>2</sub>/I<sub>1</sub> = e<sup>0.12/0.026</sup> = e<sup>4.62</sup> ≈ 101', '0.12 V ≈ 兩個 60 mV → 兩個 ×10 = ×100。'),
        st('(c) n = 2。', 'ΔV = 2 × 0.0599 = 0.120 V　⟹　10 mA：0.770 V；0.1 mA：0.530 V', 'n = 2 時每 decade 要 120 mV，曲線比較「鈍」。')
      ],
      ans: '(a) 0.710 V、0.590 V；(b) 約 101 倍（≈ 100）；(c) 0.770 V、0.530 V',
      story: () => {
        const { g, T, calc, sc, ansScene } = KK();
        /* 對數座標上的一條直線 */
        const X = v => 140 + (v - 0.5) / 0.3 * 400, Y = lg => 290 - (lg + 2) / 4 * 180;
        const ax = '<line class="ln" x1="140" y1="290" x2="560" y2="290"/><line class="ln" x1="140" y1="290" x2="140" y2="104"/>' +
          [-1, 0, 1, 2].map(l => '<line class="ln2" x1="136" y1="' + Y(l) + '" x2="560" y2="' + Y(l) + '" style="opacity:.4"/>' + T(130, Y(l) + 4, ['0.1', '1', '10', '100'][l + 1] + ' mA', { cls: 'ts', fs: 11, a: 'end' })).join('') +
          T(560, 308, 'V<sub>D</sub>', { cls: 'tm', fs: 12, a: 'end' });
        const ln = (n, key, cls) => '<line class="' + cls + '" x1="' + X(0.65 - 0.0599 * n) + '" y1="' + Y(-1) + '" x2="' + X(0.65 + 0.0599 * n * 1.4) + '" y2="' + Y(1.4) + '" style="stroke-width:2.6"' + (key ? ' data-k="' + key + '"' : '') + '/>';
        const pt = (v, lg, lab, key) => g(key, '<circle class="acc" cx="' + X(v) + '" cy="' + Y(lg) + '" r="6"/>' + T(X(v) + 10, Y(lg) + 18, lab, { cls: 'ta', fs: 12, a: 'start' }));
        return [
          sc('對數座標上是一條直線', 'A STRAIGHT LINE ON LOG SCALE',
            ax + ln(1, 'l1', 'lna') + pt(0.65, 0, '0.650 V', 'p0') + pt(0.71, 1, '0.710 V', 'p1') + pt(0.59, -1, '0.590 V', 'p2'),
            [{ sub: '電流用對數刻度畫，指數曲線就變成一條直線（Fig 1.18）。', on: 'l1 p0' },
             { sub: '電流 ×10：往右 60 mV → 0.710 V。', on: 'p1' },
             { sub: '電流 ÷10：往左 60 mV → 0.590 V。', on: 'p2' }]),
          sc('多 0.12 V 是幾倍？', 'TWO DECADES',
            calc(110, 120, 420, [['0.12 V ÷ 0.06 V ≈ 2 個 decade', 'r1'], ['10 × 10 = 100 倍', 'r2', 'ta'], ['精確：e<sup>0.12/0.026</sup> = e<sup>4.62</sup> ≈ 101', 'r3']], { k: 'cc' }),
            [{ sub: '每 60 mV 就 ×10，0.12 V 是兩段。', on: 'cc r1' },
             { sub: '所以約 100 倍。', on: 'r2' },
             { sub: '精確算是 101 倍，差不多。', on: 'r3' }]),
          sc('n = 2：線變斜', 'n = 2',
            ax + ln(1, null, 'ln2') + ln(2, 'l2', 'lna') + pt(0.77, 1, '0.770 V', 'p1') + pt(0.53, -1, '0.530 V', 'p2'),
            [{ sub: 'n = 2 時每 decade 要 120 mV：線變斜。', on: 'l2' },
             { sub: '10 mA → 0.770 V；0.1 mA → 0.530 V。', on: 'p1 p2' }]),
          ansScene(['(a) 0.710 V、0.590 V', '(b) ≈ 100 倍', '(c) 0.770 V、0.530 V'], ['答案：每 decade 60 mV（n = 2 時 120 mV）。'])
        ];
      } },

    /* ═══════════ 04 理想二極體模型（自編） ═══════════ */
    { id: 'p4-ideal', sec: 'ideal', kind: 'pp', no: '', tag: '自編練習（投影片 1-49）', title: '理想二極體：正接、反接各是多少？',
      q: '5 V 電源、1 kΩ 電阻、一顆二極體串聯。(a) 用理想二極體模型，二極體正接時 I<sub>D</sub>、V<sub>D</sub> 是多少？(b) 反接時呢？(c) 若改用「導通固定 0.7 V」，(a) 的電流變多少？',
      en: 'A 5 V source, a 1 kΩ resistor and a diode are in series. (a) Using the ideal diode model, find I<sub>D</sub> and V<sub>D</sub> with the diode forward-connected. (b) Repeat with the diode reversed. (c) Repeat (a) assuming a constant 0.7 V drop when on.',
      fig: F('5 V', '1 kΩ'), cap: '正接；(b) 把二極體反過來',
      hint: '理想模型：ON = 短路（V<sub>D</sub> = 0），OFF = 斷路（I<sub>D</sub> = 0）。先猜狀態，再檢查。',
      steps: [
        st('(a) 正接 → 猜 ON → 換成短路。', 'V<sub>D</sub> = 0　⟹　I<sub>D</sub> = 5 V / 1 kΩ = 5 mA', '電流 &gt; 0，跟 ON 的假設一致。'),
        st('(b) 反接 → 猜 OFF → 換成斷路。', 'I<sub>D</sub> = 0　⟹　電阻沒壓降，V<sub>D</sub> = −5 V', '5 V 全部反著落在二極體上；V<sub>D</sub> &lt; 0，跟 OFF 一致。'),
        st('(c) 導通固定 0.7 V。', 'I<sub>D</sub> = (5 − 0.7) / 1k = 4.3 mA', '比理想模型少 14%；電源越大，差距越小。')
      ],
      ans: '(a) I<sub>D</sub> = 5 mA、V<sub>D</sub> = 0；(b) I<sub>D</sub> = 0、V<sub>D</sub> = −5 V；(c) 4.3 mA',
      story: () => {
        const { T, calc, sc, circ, ansScene } = KK();
        return [
          sc('正接：開關閉合', 'FORWARD = SHORT',
            circ(90, 140, 170, 130, { k: 'c1', vps: '5 V', r: '1 kΩ', cur: 'cur' }) + circ(90, 140, 170, 130, { k: 'c2', vps: '5 V', r: '1 kΩ', model: 'short', vd: false }) +
            calc(340, 130, 260, [['ON → 短路，V<sub>D</sub> = 0', 'r1'], ['I<sub>D</sub> = 5 / 1k = 5 mA', 'r2', 'ta']], { k: 'cc' }),
            [{ sub: '正接：順著三角形推，二極體 ON。', on: 'c1 cur' },
             { sub: '理想模型把 ON 的二極體換成一條導線。', off: 'c1', on: 'c2 cc r1' },
             { sub: '5 V 全部給電阻：I<sub>D</sub> = 5 mA。', on: 'r2' }]),
          sc('反接：開關打開', 'REVERSE = OPEN',
            circ(90, 140, 170, 130, { k: 'c1', vps: '5 V', r: '1 kΩ', rev: true }) + circ(90, 140, 170, 130, { k: 'c2', vps: '5 V', r: '1 kΩ', model: 'open' }) +
            calc(340, 130, 260, [['OFF → 斷路，I<sub>D</sub> = 0', 'r1'], ['電阻沒壓降', 'r2'], ['V<sub>D</sub> = −5 V', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '反接：二極體 OFF。', on: 'c1' },
             { sub: '換成斷路：沒有電流。', off: 'c1', on: 'c2 cc r1' },
             { sub: '電阻沒電流就沒壓降，5 V 全部反著落在二極體上。', on: 'r2 r3' }]),
          sc('更準一點：扣 0.7 V', 'CONSTANT DROP',
            circ(90, 140, 170, 130, { k: 'c1', vps: '5 V', r: '1 kΩ', model: 'cvd', vg: '0.7 V' }) +
            calc(340, 130, 260, [['I<sub>D</sub> = (5 − 0.7)/1k', 'r1'], ['= 4.3 mA', 'r2', 'ta'], ['比理想少 14%', 'r3']], { k: 'cc' }),
            [{ sub: '實際的矽二極體導通時會吃掉約 0.7 V。', on: 'c1' },
             { sub: '電流變 4.3 mA。', on: 'cc r1 r2' },
             { sub: '電源只有 5 V，0.7 V 佔 14%，不能隨便忽略。', on: 'r3' }]),
          ansScene(['(a) 5 mA、V<sub>D</sub> = 0', '(b) 0、V<sub>D</sub> = −5 V', '(c) 4.3 mA'], ['答案：ON 短路、OFF 斷路。'])
        ];
      } },

    /* ═══════════ 05 溫度效應：TYU 1.8 ═══════════ */
    { id: 'tyu1-8b', sec: 'temp', kind: 'pp', no: '', tag: 'TYU 1.8', title: '溫度升 100 °C，V<sub>D</sub> 掉多少？',
      q: '矽二極體在固定電流下，順偏電壓大約每 °C 下降 2 mV。若 25 °C、I<sub>D</sub> = 1 mA 時 V<sub>D</sub> = 0.650 V，求 125 °C、同樣 1 mA 時的 V<sub>D</sub>。',
      en: 'Recall that the forward-bias diode voltage decreases approximately by 2 mV/°C for silicon diodes with a given current. If V<sub>D</sub> = 0.650 V at I<sub>D</sub> = 1 mA for a temperature of 25 °C, determine the diode voltage at I<sub>D</sub> = 1 mA for T = 125 °C.',
      hint: 'ΔV<sub>D</sub> = −2 mV/°C × ΔT。',
      steps: [
        st('溫差。', 'ΔT = 125 − 25 = 100 °C', ''),
        st('電壓變化。', 'ΔV<sub>D</sub> = −2 mV/°C × 100 = −0.200 V', '溫度一高 I<sub>S</sub> 暴增，同樣電流只要更小的電壓。'),
        st('新的 V<sub>D</sub>。', 'V<sub>D</sub> = 0.650 − 0.200 = 0.450 V', '')
      ],
      ans: 'V<sub>D</sub> ≈ 0.450 V（與課本答案一致）',
      story: () => {
        const { g, T, calc, sc, axes, ansScene } = KK();
        const P = axes(330, 116, 260, 170, { v0: 0.3, v1: 0.75, i0: 0, i1: 1.5, vt: [[0.45, '0.45'], [0.65, '0.65']], it: [[1, '1 mA']] });
        const c25 = v => 1e-3 * Math.exp((v - 0.65) / 0.0257) * 1e3, c125 = v => 1e-3 * Math.exp((v - 0.45) / 0.0343) * 1e3;
        return [
          sc('溫度一高，曲線往左', 'CURVE SHIFTS LEFT',
            P.svg + P.curve(c25, 0.3, 0.66, 'a') + P.curve(c125, 0.3, 0.465, 'b', 'ln') +
            T(P.X(0.665) + 6, P.Y(1.1), '25 °C', { cls: 'ta', fs: 12.5, a: 'start', k: 'la' }) + T(P.X(0.38), P.Y(1.4), '125 °C', { cls: 't', fs: 12.5, k: 'lb' }) +
            calc(30, 120, 240, [['熱 → I<sub>S</sub> 暴增', 'r1'], ['同樣電流，電壓更小', 'r2', 'ta']], { k: 'cc' }),
            [{ sub: '25 °C 的曲線：1 mA 在 0.650 V。', on: 'a la' },
             { sub: '加熱：熱產生的載子變多，I<sub>S</sub> 暴增。', on: 'cc r1' },
             { sub: '整條曲線往左移：同樣 1 mA，電壓變小。', on: 'b lb r2' }]),
          sc('每 °C 少 2 mV', '−2 mV/°C',
            P.svg + P.curve(c25, 0.3, 0.66, null) + P.curve(c125, 0.3, 0.465, null, 'ln') +
            P.seg(0.45, 1, 0.65, 1, 'ar', 'lna', ' style="stroke-width:3"') + P.dot(0.65, 1, 'p1') + P.dot(0.45, 1, 'p2') +
            calc(30, 120, 240, [['ΔT = 100 °C', 'r1'], ['ΔV = −2 mV × 100 = −0.2 V', 'r2', 'ta'], ['0.650 − 0.200 = 0.450 V', 'r3', 'ta']], { k: 'cc' }),
            [{ sub: '從 25 °C 到 125 °C：升 100 °C。', on: 'cc r1 p1' },
             { sub: '每 °C 少 2 mV，共少 0.2 V。', on: 'r2 ar' },
             { sub: '新的 V<sub>D</sub> = 0.450 V。', on: 'r3 p2' }]),
          ansScene(['V<sub>D</sub> ≈ 0.450 V', '（125 °C、1 mA）'], ['答案：0.450 V。'])
        ];
      } },

    /* ═══════════ 06 溫度計：§1.6 Design Application ═══════════ */
    { id: 'p4-thermo', sec: 'thermo', kind: 'pp', no: '', tag: '課本 §1.6 Design Application', title: '二極體溫度計：0～100 °F 時 V<sub>D</sub> 是多少？',
      q: '課本 Fig 1.47：15 V 電源、R = 15 kΩ、一顆矽二極體（300 K 時 I<sub>S</sub> = 10<sup>−13</sup> A）。(a) 求 300 K 時的 V<sub>D</sub> 與 I<sub>D</sub>。(b) 用 V<sub>D</sub> = 1.12 − 0.522(T/300) 求 0 °F（255.2 K）與 100 °F（310.8 K）時的 V<sub>D</sub>。(c) 量到 V<sub>D</sub> = 0.620 V，溫度是多少？',
      en: 'Consider the diode thermometer of Fig 1.47 (15 V, R = 15 kΩ, I<sub>S</sub> = 10<sup>−13</sup> A at 300 K). (a) Find V<sub>D</sub> and I<sub>D</sub> at 300 K. (b) Using V<sub>D</sub> = 1.12 − 0.522(T/300), find V<sub>D</sub> at 0 °F (255.2 K) and 100 °F (310.8 K). (c) If V<sub>D</sub> = 0.620 V, what is the temperature?',
      fig: F('15 V', '15 kΩ'), cap: '課本 Fig 1.47：二極體溫度計',
      hint: '(a) 疊代：先猜 0.6 V 算電流，再用 V<sub>T</sub> ln(I/I<sub>S</sub>) 修正。(c) 把公式反過來解 T。',
      steps: [
        st('(a) 先猜 V<sub>D</sub> = 0.6 V。', 'I<sub>D</sub> = (15 − 0.6)/15k = 0.960 mA　→　V<sub>D</sub> = 0.026 ln(0.96m/10<sup>−13</sup>) = 0.5976 V', '再算一次電流幾乎不變：I<sub>D</sub> = 0.960 mA。電源 15 V 很大，電流幾乎固定 —— 溫度計要的就是這個。'),
        st('(b) 0 °F = 255.2 K。', 'V<sub>D</sub> = 1.12 − 0.522 × 255.2/300 = 0.676 V', ''),
        st('(b) 100 °F = 310.8 K。', 'V<sub>D</sub> = 1.12 − 0.522 × 310.8/300 = 0.579 V', '整個範圍只差約 0.1 V，而且是直線。'),
        st('(c) 反推溫度。', 'T = 300 × (1.12 − 0.620)/0.522 = 287.4 K ≈ 14.2 °C', '電壓越低，溫度越高。')
      ],
      ans: '(a) V<sub>D</sub> ≈ 0.598 V、I<sub>D</sub> ≈ 0.960 mA；(b) 0.676 V、0.579 V；(c) 約 287 K（14 °C）',
      note: '課本公式 (1.40) 的 0.522 = 1.12 − 0.598，就是 (a) 算出的 300 K 電壓。程式驗算：(a) 0.59762 V、0.9602 mA；(c) 287.36 K。',
      story: () => {
        const { g, T, calc, sc, circ, ansScene } = KK();
        const X = Tk => 120 + (Tk - 250) / 70 * 420, Y = v => 290 - (v - 0.56) / 0.14 * 170;
        const ax = '<line class="ln" x1="120" y1="290" x2="560" y2="290"/><line class="ln" x1="120" y1="290" x2="120" y2="110"/>' +
          T(560, 308, 'T（K）', { cls: 'tm', fs: 12, a: 'end' }) + T(128, 112, 'V<sub>D</sub>', { cls: 'tm', fs: 12, a: 'start' });
        const pt = (Tk, lab, key, side) => { const v = 1.12 - 0.522 * Tk / 300; return g(key, '<circle class="acc" cx="' + X(Tk) + '" cy="' + Y(v) + '" r="6"/>' + T(X(Tk) + 10, Y(v) - 12, lab, { cls: 'ta', fs: 12, a: 'start' })); };
        return [
          sc('15 V 撐住固定電流', 'NEARLY CONSTANT CURRENT',
            circ(80, 140, 170, 130, { k: 'c1', vps: '15 V', r: '15 kΩ', cur: 'cur' }) +
            calc(330, 120, 280, [['猜 0.6 V → I = 0.960 mA', 'r1'], ['V<sub>D</sub> = 0.026 ln(0.96m/10<sup>−13</sup>)', 'r2'], ['= 0.5976 V', 'r3', 'ta'], ['電流幾乎固定 0.96 mA', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '溫度計電路：15 V、15 kΩ、一顆二極體。', on: 'c1 cur' },
             { sub: '疊代：猜 0.6 V，電流 0.960 mA。', on: 'cc r1' },
             { sub: '反推 V<sub>D</sub> = 0.5976 V，幾乎沒變。', on: 'r2 r3' },
             { sub: '15 V 比 0.6 V 大很多，二極體電壓怎麼變電流都差不多 —— <b>固定電流</b>。', on: 'r4' }]),
          sc('V<sub>D</sub> 跟溫度是一條直線', 'LINEAR IN T',
            ax + '<line class="lna" x1="' + X(250) + '" y1="' + Y(1.12 - 0.522 * 250 / 300) + '" x2="' + X(320) + '" y2="' + Y(1.12 - 0.522 * 320 / 300) + '" style="stroke-width:2.6" data-k="ln"/>' +
            pt(255.2, '0 °F：0.676 V', 'p1') + pt(310.8, '100 °F：0.579 V', 'p2', true),
            [{ sub: '電流固定時，V<sub>D</sub> = 1.12 − 0.522(T/300)，是一條往下的直線。', on: 'ln' },
             { sub: '0 °F（255.2 K）：0.676 V。', on: 'p1' },
             { sub: '100 °F（310.8 K）：0.579 V —— 整段只差約 0.1 V。', on: 'p2' }]),
          sc('量電壓，反推溫度', 'READ THE TEMPERATURE',
            calc(110, 120, 420, [['T = 300 × (1.12 − V<sub>D</sub>) / 0.522', 'r1'], ['V<sub>D</sub> = 0.620 V', 'r2'], ['T = 300 × 0.500 / 0.522 = 287.4 K', 'r3', 'ta'], ['≈ 14 °C', 'r4', 'ta']], { k: 'cc' }),
            [{ sub: '把直線倒過來：量到電壓就知道溫度。', on: 'cc r1' },
             { sub: '量到 0.620 V。', on: 'r2' },
             { sub: '代進去：287.4 K，大約 14 °C。', on: 'r3 r4' }]),
          ansScene(['(a) 0.598 V、0.960 mA', '(b) 0.676 V、0.579 V', '(c) ≈ 287 K（14 °C）'], ['答案：電壓越低，溫度越高。'])
        ];
      } }
  ];

  window.__CH14EX = { book: 'Neamen', items };
})();
