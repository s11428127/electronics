/* ============================================================
   電路學 CH12 章末練習題（1/2）：Review Questions 12.1～12.10、Section 12.2～12.6
   出處：Alexander & Sadiku, Fundamentals of Electric Circuits, Chapter 12 Problems（使用者 10/16 提供）
   跳過：e⁷d 12.6、12.12、12.20、12.26；ML 12.13；小筆電 12.14、12.15、12.22、12.25、12.27
   課本註腳：沒特別說明時電壓電流都是 rms。數值全部用程式（Python 複數）驗算過。
   三相電路圖用 tp()：電源在左（Y：左端接在一起＝n；Δ：電源接在線與線之間），線路在中間，負載在右（Y 或 Δ）。
   ============================================================ */
(function () {
  'use strict';
  const S = window.__SCH;
  const st = (t, eq, why) => ({ t, eq, why });
  const G = (w, h, dx, dy, parts) => S.svg(w + 110, h, ['<g transform="translate(' + (dx + 40) + ',' + dy + ')">'].concat(parts, ['</g>']));
  /* 水平電壓源（+ 在右，o.flip：+ 在左） */
  const vsh = (x1, x2, y, label, o) => {
    o = o || {}; const cx = (x1 + x2) / 2;
    return S.w(x1 + ',' + y, (cx - 14) + ',' + y) + S.w((cx + 14) + ',' + y, x2 + ',' + y) + '<circle cx="' + cx + '" cy="' + y + '" r="14" fill="none"/>' +
      S.t(cx - 6, y + 4, o.flip ? '+' : '−', 'middle', ' font-size="12"') + S.t(cx + 6, y + 4, o.flip ? '−' : '+', 'middle', ' font-size="12"') + (label ? S.t(cx, y - 20, label, 'middle', ' font-size="11"') : '');
  };
  const Y3 = [30, 100, 170];
  /* 三相電路：o = { src:'Y'|'D'|'gen', sl:[a,b,c 電源標籤], line:[標籤×3] 或 null, load:'Y'|'D', ll:[三個負載標籤], neutral:true, names:true, cur:true } */
  function tp(o) {
    const p = [], L = ['a', 'b', 'c'], U = ['A', 'B', 'C'];
    const x0 = o.src === 'D' ? 60 : 150, xl = o.line ? 270 : 190, xL = xl + 40;
    if (o.src === 'Y') {
      p.push(S.w('20,' + Y3[0], '20,' + Y3[2]), S.t(10, Y3[1] + 4, 'n', 'end'));
      Y3.forEach((y, i) => p.push(S.w('20,' + y, '40,' + y), vsh(40, 110, y, o.sl[i]), S.w('110,' + y, x0 + ',' + y)));
    } else if (o.src === 'D') {
      p.push(S.vs(60, Y3[0], Y3[1], o.sl[0], { side: 'r' }), S.vs(60, Y3[1], Y3[2], o.sl[1], { side: 'r' }), S.vs(10, Y3[0], Y3[2], o.sl[2], { flip: true }),
        S.w('10,' + Y3[0], '60,' + Y3[0]), S.w('10,' + Y3[2], '60,' + Y3[2]));
    } else {
      p.push(S.box(0, Y3[0] - 15, 110, Y3[2] - Y3[0] + 30, o.sl || ['三相', '電源']));
      Y3.forEach(y => p.push(S.w('110,' + y, x0 + ',' + y)));
    }
    Y3.forEach((y, i) => {
      if (o.names !== false) p.push(S.t(x0 + 6, y - 6, L[i], 'start', ' font-size="11"'));
      if (o.line) p.push(S.z(x0 + 30, y, x0 + 100, y, o.line[i]), S.w(x0 + ',' + y, (x0 + 30) + ',' + y), S.w((x0 + 100) + ',' + y, xL + ',' + y));
      else p.push(S.w(x0 + ',' + y, xL + ',' + y));
      if (o.cur) p.push(S.t(xL - 30, y + 16, 'I_' + L[i] + ' →', 'middle', ' font-size="10.5"'));
      p.push(S.t(xL - 6, y - 6, U[i], 'end', ' font-size="11"'), S.dot(xL, y));
    });
    if (o.load === 'Y') {
      const xs = xL + 90;
      p.push(S.z(xL, Y3[0], xs, Y3[1], ''), S.z(xL, Y3[1], xs, Y3[1], ''), S.z(xL, Y3[2], xs, Y3[1], ''), S.dot(xs, Y3[1]), S.t(xs + 8, Y3[1] + 4, 'N', 'start'));
      p.push(S.t(xL + 52, Y3[0] + 18, o.ll[0], 'start', ' font-size="11"'), S.t(xL + 4, Y3[1] + 18, o.ll[1], 'start', ' font-size="11"'), S.t(xL + 52, Y3[2] - 12, o.ll[2], 'start', ' font-size="11"'));
      if (o.neutral) p.push(S.w(xs + ',' + Y3[1], xs + ',' + (Y3[2] + 40), '20,' + (Y3[2] + 40), '20,' + Y3[2]), S.t(xs - 60, Y3[2] + 34, '中性線', 'middle', ' font-size="10.5"'));
    } else {
      const x2 = xL + 80;
      p.push(S.z(xL, Y3[0], xL, Y3[1], o.ll[0], { side: 'r' }), S.z(xL, Y3[1], xL, Y3[2], o.ll[1], { side: 'r' }), S.w(xL + ',' + Y3[0], x2 + ',' + Y3[0]), S.w(xL + ',' + Y3[2], x2 + ',' + Y3[2]), S.z(x2, Y3[0], x2, Y3[2], o.ll[2], { side: 'r' }));
    }
    return G(xL + 170 + (o.src === 'D' ? 40 : 0), Y3[2] + (o.neutral ? 65 : 45), o.src === 'D' ? 40 : 0, 15, p);
  }

  const F = {
    f1242: tp({ src: 'Y', sl: ['440∠0° V', '440∠−120° V', '440∠120° V'], load: 'Y', ll: ['6 − j8 Ω', '6 − j8 Ω', '6 − j8 Ω'], cur: true }),
    f1243: tp({ src: 'Y', sl: ['440∠0° V', '440∠−120° V', '440∠120° V'], line: ['2 Ω', '2 Ω', '2 Ω'], load: 'Y', ll: ['25 − j10 Ω', '20 Ω', '10 + j5 Ω'], neutral: true }),
    f1244: tp({ src: 'Y', sl: ['V_an', 'V_bn', 'V_cn'], load: 'D', ll: ['Z_p', 'Z_p', 'Z_p'] }),
    f1249: tp({ src: 'gen', sl: ['三相 Y 接', '發電機', '(+) 相序'], load: 'D', ll: ['12 + j9 Ω', '12 + j9 Ω', '12 + j9 Ω'] }),
    f1250: tp({ src: 'D', sl: ['173∠0° V', '173∠−120° V', '173∠120° V'], load: 'D', ll: ['30 + j10 Ω', '30 + j10 Ω', '30 + j10 Ω'] }),
    f1252: tp({ src: 'D', sl: ['230∠0° V', '230∠−120° V', '230∠120° V'], load: 'D', ll: ['Z_L', 'Z_L', 'Z_L'] })
  };

  const RQ = (n, q, en, opts, a, why) => ({ id: 'rq12-' + n, sec: 'rq', kind: 'pp', tag: 'Review Question 12.' + n, title: q.replace(/<[^>]+>/g, '').slice(0, 26),
    q: q + '<ol type="a" style="margin:6px 0 0;padding-left:22px">' + opts.map(o => '<li>' + o + '</li>').join('') + '</ol>', en,
    hint: '想清楚 Y 接、Δ 接各自哪個量相等、差幾倍、差幾度。', steps: [st('想法。', '', why)], ans: '(' + a + ')' });
  const it = (no, sec, title, o) => Object.assign({ id: 'p12-' + no, sec, kind: 'pp', tag: 'Problem 12.' + no, title }, o);

  const items = [
    /* ═══════════ Review Questions（課本附答案） ═══════════ */
    RQ(1, 'V<sub>AN</sub> = 220∠−100° V、V<sub>BN</sub> = 220∠140° V 的三相馬達，相序是？', 'What is the phase sequence of a three-phase motor for which V<sub>AN</sub> = 220∠−100° V and V<sub>BN</sub> = 220∠140° V?', ['abc', 'acb'], 'a', '−100° − 140° = −240° ≡ +120°：V<sub>AN</sub> 超前 V<sub>BN</sub> 120°，正相序 abc。'),
    RQ(2, 'acb 相序中，若 V<sub>an</sub> = 100∠−20°，則 V<sub>cn</sub> 為：', 'If in an acb phase sequence, V<sub>an</sub> = 100∠−20°, then V<sub>cn</sub> is:', ['100∠−140°', '100∠100°', '100∠−50°', '100∠10°'], 'a', 'acb：a 後面是 c，V<sub>cn</sub> 落後 V<sub>an</sub> 120°：−20° − 120° = −140°。'),
    RQ(3, '下列何者「不是」平衡系統的必要條件？', 'Which of these is not a required condition for a balanced system:', ['|V<sub>an</sub>| = |V<sub>bn</sub>| = |V<sub>cn</sub>|', 'I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub> = 0', 'V<sub>an</sub> + V<sub>bn</sub> + V<sub>cn</sub> = 0', '電源電壓彼此差 120°', '三相負載阻抗相等'], 'c', '平衡要的是：電源大小相等、彼此差 120°、三相負載相等。(c) 是這些條件「推出來的結果」，不是另外要求的條件（課本答案 c）。'),
    RQ(4, 'Y 接負載中，線電流和相電流相等。', 'In a Y-connected load, the line current and phase current are equal.', ['True', 'False'], 'a', 'Y 接：每條線只接一個相，I<sub>L</sub> = I<sub>p</sub>。'),
    RQ(5, 'Δ 接負載中，線電流和相電流相等。', 'In a Δ-connected load, the line current and phase current are equal.', ['True', 'False'], 'b', 'Δ 接：線電流 = 兩個相電流相減，I<sub>L</sub> = √3 I<sub>p</sub>。'),
    RQ(6, 'Y-Y 系統中，線電壓 220 V 對應的相電壓是：', 'In a Y-Y system, a line voltage of 220 V produces a phase voltage of:', ['381 V', '311 V', '220 V', '156 V', '127 V'], 'e', 'V<sub>p</sub> = V<sub>L</sub>/√3 = 220/1.732 = 127 V。'),
    RQ(7, 'Δ-Δ 系統中，相電壓 100 V 對應的線電壓是：', 'In a Δ-Δ system, a phase voltage of 100 V produces a line voltage of:', ['58 V', '71 V', '100 V', '173 V', '141 V'], 'c', 'Δ 接的相就跨在兩條線之間：V<sub>L</sub> = V<sub>p</sub>。'),
    RQ(8, 'Y 接負載由 abc 相序供電時，線電壓落後對應的相電壓 30°。', 'When a Y-connected load is supplied by voltages in abc phase sequence, the line voltages lag the corresponding phase voltages by 30°.', ['True', 'False'], 'b', 'abc：V<sub>ab</sub> = √3 V<sub>an</sub>∠30°，線電壓「超前」30°。'),
    RQ(9, '平衡三相電路中，總瞬時功率等於平均功率。', 'In a balanced three-phase circuit, the total instantaneous power is equal to the average power.', ['True', 'False'], 'a', '三個相的 2ω 成分互相抵消，總瞬時功率是常數 = 平均功率。'),
    RQ(10, '平衡 Δ 負載的總功率求法跟平衡 Y 負載一樣。', 'The total power supplied to a balanced Δ-load is found in the same way as for a balanced Y-load.', ['True', 'False'], 'a', '兩種都是 P = √3 V<sub>L</sub>I<sub>L</sub> cos θ。'),

    /* ═══════════ 12.2 平衡三相電壓 ═══════════ */
    it(1, '12.2', '由線電壓求相電壓', {
      q: '平衡 Y 接三相發電機的 V<sub>ab</sub> = 400 V，分別在 (a) abc、(b) acb 相序下求相電壓。',
      en: 'If V<sub>ab</sub> = 400 V in a balanced Y-connected three-phase generator, find the phase voltages, assuming the phase sequence is: (a) abc (b) acb',
      hint: 'V<sub>p</sub> = V<sub>L</sub>/√3。取 V<sub>ab</sub> = 400∠0°：abc 時 V<sub>an</sub> 落後 V<sub>ab</sub> 30°，acb 時超前 30°。',
      steps: [
        st('Step 1　大小。', 'V<sub>p</sub> = 400/√3 = 230.9 V', ''),
        st('Step 2　(a) abc。', 'V<sub>an</sub> = 230.9∠−30°、V<sub>bn</sub> = 230.9∠−150°、V<sub>cn</sub> = 230.9∠90° V', 'V<sub>ab</sub> = √3 V<sub>an</sub>∠30° ⟹ V<sub>an</sub> = V<sub>ab</sub>∠−30°/√3。'),
        st('Step 3　(b) acb。', 'V<sub>an</sub> = 230.9∠30°、V<sub>bn</sub> = 230.9∠150°、V<sub>cn</sub> = 230.9∠−90° V', 'acb 時 V<sub>ab</sub> = √3 V<sub>an</sub>∠−30°。')
      ],
      ans: '(a) 230.9∠−30°、230.9∠−150°、230.9∠90° V　(b) 230.9∠30°、230.9∠150°、230.9∠−90° V（以 V<sub>ab</sub> 為 0° 參考）' }),
    it(2, '12.2', '判斷相序、求 V<sub>bn</sub>', {
      q: 'V<sub>an</sub> = 120∠30° V、V<sub>cn</sub> = 120∠−90° V 的平衡三相電路是什麼相序？求 V<sub>bn</sub>。',
      en: 'What is the phase sequence of a balanced three-phase circuit for which V<sub>an</sub> = 120∠30° V and V<sub>cn</sub> = 120∠−90° V? Find V<sub>bn</sub>.',
      hint: '看誰「落後」誰 120°：a 後面緊跟著落後 120° 的那個，就是第二個字母。',
      steps: [
        st('Step 1　比相位。', '30° − (−90°) = 120°：V<sub>cn</sub> 落後 V<sub>an</sub> 120°', ''),
        st('Step 2　相序。', 'a → c → b，acb（負相序）', 'abc 的話落後 120° 的應該是 b。'),
        st('Step 3　V<sub>bn</sub>。', 'V<sub>bn</sub> = V<sub>an</sub>∠+120° = 120∠150° V', '再落後 120°：−90° − 120° = −210° ≡ 150°。')
      ],
      ans: 'acb 相序；V<sub>bn</sub> = 120∠150° V' }),
    it(3, '12.2', '由 V<sub>bn</sub>、V<sub>cn</sub> 判斷相序', {
      q: 'V<sub>bn</sub> = 440∠130° V、V<sub>cn</sub> = 440∠10° V 的平衡三相電路相序為何？求 V<sub>an</sub>。',
      en: 'Determine the phase sequence of a balanced three-phase circuit in which V<sub>bn</sub> = 440∠130° V and V<sub>cn</sub> = 440∠10° V. Obtain V<sub>an</sub>.',
      hint: 'abc：b 超前 c 120°、a 超前 b 120°。',
      steps: [
        st('Step 1　比相位。', '130° − 10° = 120°：V<sub>bn</sub> 超前 V<sub>cn</sub> 120°', ''),
        st('Step 2　相序。', 'abc（正相序）', ''),
        st('Step 3　V<sub>an</sub>。', 'V<sub>an</sub> = V<sub>bn</sub>∠+120° = 440∠250° = 440∠−110° V', '')
      ],
      ans: 'abc 相序；V<sub>an</sub> = 440∠−110° V' }),
    it(4, '12.2', 'Y 接負載的線電流', {
      q: 'abc 相序、V<sub>L</sub> = 440 V 的三相系統供電給 Y 接負載，Z<sub>L</sub> = 40∠30° Ω。求線電流。',
      en: 'A three-phase system with abc sequence and V<sub>L</sub> = 440 V feeds a Y-connected load with Z<sub>L</sub> = 40∠30° Ω. Find the line currents.',
      hint: '取 V<sub>ab</sub> = 440∠0°，則 V<sub>an</sub> = 254∠−30°；Y 接 I<sub>a</sub> = V<sub>an</sub>/Z<sub>L</sub>。',
      steps: [
        st('Step 1　相電壓。', 'V<sub>an</sub> = (440/√3)∠−30° = 254.0∠−30° V', ''),
        st('Step 2　線電流。', 'I<sub>a</sub> = 254.0∠−30° / 40∠30° = 6.351∠−60° A', 'Y 接：線電流 = 相電流。'),
        st('Step 3　其他兩相。', 'I<sub>b</sub> = 6.351∠−180° A、I<sub>c</sub> = 6.351∠60° A', '依序落後 120°。')
      ],
      ans: 'I<sub>a</sub> = 6.351∠−60° A、I<sub>b</sub> = 6.351∠180° A、I<sub>c</sub> = 6.351∠60° A', note: '題目沒給參考角度，這裡以 V<sub>ab</sub> = 440∠0° 為參考；若改用 V<sub>an</sub> 為 0°，三個角度都加 30°。' }),
    it(5, '12.2', '時域的相電壓 → 線電壓', {
      q: 'Y 接負載端的三個線對中性點電壓為 v<sub>AN</sub> = 120 cos(ωt + 32°) V、v<sub>BN</sub> = 120 cos(ωt − 88°) V、v<sub>CN</sub> = 120 cos(ωt + 152°) V。寫出線電壓 v<sub>AB</sub>、v<sub>BC</sub>、v<sub>CA</sub> 的時域式。',
      en: 'For a Y-connected load, the time-domain expressions for three line-to-neutral voltages at the terminals are: v<sub>AN</sub> = 120 cos(ωt + 32°) V, v<sub>BN</sub> = 120 cos(ωt − 88°) V, v<sub>CN</sub> = 120 cos(ωt + 152°) V. Write the time-domain expressions for the line-to-line voltages v<sub>AB</sub>, v<sub>BC</sub>, and v<sub>CA</sub>.',
      hint: '先確認相序（32° → −88° 落後 120°，abc），線電壓 = √3 × 相電壓、超前 30°。',
      steps: [
        st('Step 1　相序。', '32° − (−88°) = 120° ⟹ abc', ''),
        st('Step 2　大小與相位。', '√3 × 120 = 207.8；每個加 30°', 'V<sub>AB</sub> = V<sub>AN</sub> − V<sub>BN</sub> = √3 V<sub>AN</sub>∠30°。'),
        st('Step 3　寫出來。', 'v<sub>AB</sub> = 207.8 cos(ωt + 62°)、v<sub>BC</sub> = 207.8 cos(ωt − 58°)、v<sub>CA</sub> = 207.8 cos(ωt + 182°) = 207.8 cos(ωt − 178°) V', '')
      ],
      ans: 'v<sub>AB</sub> = 207.8 cos(ωt + 62°) V；v<sub>BC</sub> = 207.8 cos(ωt − 58°) V；v<sub>CA</sub> = 207.8 cos(ωt − 178°) V' }),

    /* ═══════════ 12.3 平衡 Y-Y ═══════════ */
    it(7, '12.3', 'Y-Y（沒有中性線）的線電流', { fig: F.f1242, cap: '圖 12.42（重畫）',
      q: '求圖 12.42 三相電路的線電流。',
      en: 'Obtain the line currents in the three-phase circuit of Fig. 12.42.',
      hint: '平衡 Y-Y：中性點 N 與 n 同電位，直接單相計算 I<sub>a</sub> = V<sub>an</sub>/Z。',
      steps: [
        st('Step 1　單相等效。', 'I<sub>a</sub> = 440∠0° / (6 − j8) = 440/10∠−53.13° = 44∠53.13° A', '平衡時 N 和 n 等電位，有沒有中性線都一樣。'),
        st('Step 2　其他兩相。', 'I<sub>b</sub> = 44∠−66.87° A、I<sub>c</sub> = 44∠173.13° A', '')
      ],
      ans: 'I<sub>a</sub> = 44∠53.13° A、I<sub>b</sub> = 44∠−66.87° A、I<sub>c</sub> = 44∠173.13° A' }),
    it(8, '12.3', '含線路阻抗的 Y-Y', {
      q: '平衡 Y-Y 系統，電源 abc 相序、V<sub>an</sub> = 100∠20° V rms。每相線路阻抗 0.6 + j1.2 Ω、負載每相 10 + j14 Ω。求線電流與負載電壓。',
      en: 'In a balanced three-phase wye-wye system, the source is an abc-sequence of voltages and V<sub>an</sub> = 100∠20° V rms. The line impedance per phase is (0.6 + j1.2) Ω, while the per phase impedance of the load is (10 + j14) Ω. Calculate the line currents and the load voltages.',
      hint: '單相：I<sub>a</sub> = V<sub>an</sub>/(Z<sub>line</sub> + Z<sub>L</sub>)；V<sub>AN</sub> = I<sub>a</sub>Z<sub>L</sub>。',
      steps: [
        st('Step 1　總阻抗。', '10.6 + j15.2 = 18.53∠55.11° Ω', ''),
        st('Step 2　線電流。', 'I<sub>a</sub> = 100∠20° / 18.53∠55.11° = 5.396∠−35.11° A；I<sub>b</sub> = 5.396∠−155.11°、I<sub>c</sub> = 5.396∠84.89° A', ''),
        st('Step 3　負載電壓。', 'V<sub>AN</sub> = I<sub>a</sub>(10 + j14) = 92.84∠19.35° V；V<sub>BN</sub> = 92.84∠−100.65°、V<sub>CN</sub> = 92.84∠139.35° V', '線路吃掉一點電壓。')
      ],
      ans: 'I<sub>a</sub> ≈ 5.396∠−35.11° A（另兩相 ∓120°）；V<sub>AN</sub> ≈ 92.84∠19.35° V（另兩相 ∓120°）' }),
    it(9, '12.3', 'Y-Y 四線式：線電流與中性線電流', {
      q: '平衡 Y-Y 四線式系統，相電壓 V<sub>an</sub> = 120∠0°、V<sub>bn</sub> = 120∠−120°、V<sub>cn</sub> = 120∠120° V。負載每相 19 + j13 Ω、線路每相 1 + j2 Ω。求線電流與中性線電流。',
      en: 'A balanced Y-Y four-wire system has phase voltages V<sub>an</sub> = 120∠0°, V<sub>bn</sub> = 120∠−120°, V<sub>cn</sub> = 120∠120° V. The load impedance per phase is 19 + j13 Ω, and the line impedance per phase is 1 + j2 Ω. Solve for the line currents and neutral current.',
      hint: '每相總阻抗 20 + j15 = 25∠36.87°。平衡 → 中性線電流 0。',
      steps: [
        st('Step 1　線電流。', 'I<sub>a</sub> = 120/25∠36.87° = 4.8∠−36.87° A；I<sub>b</sub> = 4.8∠−156.87°、I<sub>c</sub> = 4.8∠83.13° A', ''),
        st('Step 2　中性線。', 'I<sub>n</sub> = −(I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub>) = 0', '三個大小相等、差 120°，加起來是 0。')
      ],
      ans: 'I<sub>a</sub> = 4.8∠−36.87° A、I<sub>b</sub> = 4.8∠−156.87° A、I<sub>c</sub> = 4.8∠83.13° A；I<sub>n</sub> = 0' }),
    it(10, '12.3', '不平衡 Y-Y 四線式的中性線電流', { fig: F.f1243, cap: '圖 12.43（重畫；n 與 N 之間有中性線）',
      q: '求圖 12.43 中性線上的電流。',
      en: 'For the circuit in Fig. 12.43, determine the current in the neutral line.',
      hint: '中性線沒有阻抗 → n、N 同電位，每一相自己一個迴路，各算各的再相加。',
      steps: [
        st('Step 1　a 相。', 'I<sub>a</sub> = 440 / (2 + 25 − j10) = 15.28∠20.32° A', ''),
        st('Step 2　b 相。', 'I<sub>b</sub> = 440∠−120° / (2 + 20) = 20∠−120° A', ''),
        st('Step 3　c 相。', 'I<sub>c</sub> = 440∠120° / (2 + 10 + j5) = 33.85∠97.38° A', ''),
        st('Step 4　中性線。', 'I<sub>a</sub> + I<sub>b</sub> + I<sub>c</sub> = 21.55∠90.05° A，從 N 流回 n', '負載不平衡，三個電流加起來不是 0，多的從中性線回去。')
      ],
      ans: '中性線電流 |I<sub>n</sub>| ≈ 21.55 A（從 N 回到 n 的方向為 21.55∠90.05° A）' }),

    /* ═══════════ 12.4 平衡 Y-Δ ═══════════ */
    it(11, '12.4', 'Y-Δ：線電壓與線電流', { fig: F.f1244, cap: '圖 12.44（重畫）',
      q: '圖 12.44 的 Y-Δ 系統，電源正相序 V<sub>an</sub> = 240∠0° V，負載每相 Z<sub>p</sub> = 2 − j3 Ω。求線電壓 V<sub>L</sub> 與線電流 I<sub>L</sub>。',
      en: 'In the Y-Δ system shown in Fig. 12.44, the source is a positive sequence with V<sub>an</sub> = 240∠0° V and phase impedance Z<sub>p</sub> = 2 − j3 Ω. Calculate the line voltage V<sub>L</sub> and the line current I<sub>L</sub>.',
      hint: 'Δ 換成 Y：Z<sub>Y</sub> = Z<sub>Δ</sub>/3，然後單相算。',
      steps: [
        st('Step 1　線電壓。', 'V<sub>ab</sub> = √3 × 240∠30° = 415.7∠30° V', ''),
        st('Step 2　Δ 換 Y。', 'Z<sub>Y</sub> = (2 − j3)/3 = 0.667 − j1 Ω', ''),
        st('Step 3　線電流。', 'I<sub>a</sub> = 240 / (0.667 − j1) = 199.7∠56.31° A', '')
      ],
      ans: 'V<sub>L</sub> ≈ 415.7 V（V<sub>ab</sub> = 415.7∠30° V）；I<sub>L</sub> ≈ 199.7 A（I<sub>a</sub> = 199.7∠56.31° A）' }),
    it(16, '12.4', '由 Δ 相電流求線電流與阻抗', {
      q: '平衡 Δ 接負載的相電流 I<sub>AC</sub> = 5∠−30° A。(a) 假設正相序，求三個線電流。(b) 若線電壓 V<sub>AB</sub> = 110∠0° V，求負載阻抗。',
      en: 'A balanced delta-connected load has a phase current I<sub>AC</sub> = 5∠−30° A. (a) Determine the three line currents assuming that the circuit operates in the positive phase sequence. (b) Calculate the load impedance if the line voltage is V<sub>AB</sub> = 110∠0° V.',
      hint: 'I<sub>CA</sub> = −I<sub>AC</sub>；正相序 I<sub>CA</sub> = I<sub>AB</sub>∠120°；I<sub>a</sub> = √3 I<sub>AB</sub>∠−30°。',
      steps: [
        st('Step 1　換方向。', 'I<sub>CA</sub> = −I<sub>AC</sub> = 5∠150° A', ''),
        st('Step 2　I<sub>AB</sub>。', 'I<sub>AB</sub> = I<sub>CA</sub>∠−120° = 5∠30° A', ''),
        st('Step 3　(a) 線電流。', 'I<sub>a</sub> = √3 × 5∠(30° − 30°) = 8.66∠0° A；I<sub>b</sub> = 8.66∠−120°、I<sub>c</sub> = 8.66∠120° A', ''),
        st('Step 4　(b) 阻抗。', 'Z<sub>Δ</sub> = V<sub>AB</sub>/I<sub>AB</sub> = 110∠0° / 5∠30° = 22∠−30° Ω', '')
      ],
      ans: '(a) 8.66∠0°、8.66∠−120°、8.66∠120° A　(b) Z<sub>Δ</sub> = 22∠−30° Ω' }),
    it(17, '12.4', '由線電流求 Δ 相電流', {
      q: '平衡 Δ 接負載的線電流 I<sub>a</sub> = 5∠−25° A，求相電流 I<sub>AB</sub>、I<sub>BC</sub>、I<sub>CA</sub>。',
      en: 'A balanced delta-connected load has line current I<sub>a</sub> = 5∠−25° A. Find the phase currents I<sub>AB</sub>, I<sub>BC</sub>, and I<sub>CA</sub>.',
      hint: 'I<sub>a</sub> = √3 I<sub>AB</sub>∠−30° ⟹ I<sub>AB</sub> = I<sub>a</sub>∠30°/√3（正相序）。',
      steps: [
        st('Step 1　I<sub>AB</sub>。', 'I<sub>AB</sub> = (5/√3)∠(−25° + 30°) = 2.887∠5° A', ''),
        st('Step 2　其他。', 'I<sub>BC</sub> = 2.887∠−115° A、I<sub>CA</sub> = 2.887∠125° A', '')
      ],
      ans: 'I<sub>AB</sub> = 2.887∠5° A、I<sub>BC</sub> = 2.887∠−115° A、I<sub>CA</sub> = 2.887∠125° A（假設正相序）' }),
    it(18, '12.4', 'Y 發電機接 Δ 負載的相電流', { fig: F.f1249, cap: '圖 12.49（重畫）',
      q: '圖 12.49 中 V<sub>an</sub> = 220∠60° V，求負載相電流 I<sub>AB</sub>、I<sub>BC</sub>、I<sub>CA</sub>。',
      en: 'If V<sub>an</sub> = 220∠60° V in the network of Fig. 12.49, find the load phase currents I<sub>AB</sub>, I<sub>BC</sub>, and I<sub>CA</sub>.',
      hint: 'V<sub>AB</sub> = √3 V<sub>an</sub>∠30°；Z<sub>Δ</sub> = 12 + j9 = 15∠36.87° Ω。',
      steps: [
        st('Step 1　線電壓。', 'V<sub>AB</sub> = √3 × 220∠90° = 381.1∠90° V', ''),
        st('Step 2　相電流。', 'I<sub>AB</sub> = 381.1∠90° / 15∠36.87° = 25.40∠53.13° A', ''),
        st('Step 3　其他。', 'I<sub>BC</sub> = 25.40∠−66.87° A、I<sub>CA</sub> = 25.40∠173.13° A', '')
      ],
      ans: 'I<sub>AB</sub> = 25.40∠53.13° A、I<sub>BC</sub> = 25.40∠−66.87° A、I<sub>CA</sub> = 25.40∠173.13° A' }),

    /* ═══════════ 12.5 平衡 Δ-Δ ═══════════ */
    it(19, '12.5', 'Δ-Δ 的相電流與線電流', { fig: F.f1250, cap: '圖 12.50（重畫）',
      q: '計算圖 12.50 Δ-Δ 電路的相電流與線電流。',
      en: 'For the Δ-Δ circuit of Fig. 12.50, calculate the phase and line currents.',
      hint: 'Δ-Δ：每相負載直接跨在一個電源上，I<sub>AB</sub> = V<sub>ab</sub>/Z。',
      steps: [
        st('Step 1　相電流。', 'I<sub>AB</sub> = 173∠0° / (30 + j10) = 5.471∠−18.43° A；I<sub>BC</sub> = 5.471∠−138.43°、I<sub>CA</sub> = 5.471∠101.57° A', ''),
        st('Step 2　線電流。', 'I<sub>a</sub> = √3 I<sub>AB</sub>∠−30° = 9.476∠−48.43° A；I<sub>b</sub> = 9.476∠−168.43°、I<sub>c</sub> = 9.476∠71.57° A', '')
      ],
      ans: '相電流 5.471 A（∠−18.43°、−138.43°、101.57°）；線電流 9.476 A（∠−48.43°、−168.43°、71.57°）' }),
    it(21, '12.5', 'Δ 電源接 Δ 負載', { fig: F.f1252, cap: '圖 12.52（重畫）',
      q: '三台 230 V 發電機組成 Δ 接電源，接到每相 Z<sub>L</sub> = 10 + j8 Ω 的平衡 Δ 負載（圖 12.52）。(a) 求 I<sub>AC</sub>。(b) 求 I<sub>b</sub>。',
      en: 'Three 230-volt generators form a delta connected source which is connected to a balanced delta connected load of Z<sub>L</sub> = (10 + j8) Ω per phase as shown in Fig. 12.52. (a) Determine the value of I<sub>AC</sub>. (b) What is the value of I<sub>b</sub>?',
      hint: 'Z<sub>L</sub> = 12.81∠38.66°。注意 I<sub>AC</sub> 是從 A 流向 C，= V<sub>AC</sub>/Z = −V<sub>CA</sub>/Z。',
      steps: [
        st('Step 1　(a) I<sub>AC</sub>。', 'V<sub>AC</sub> = −V<sub>CA</sub> = 230∠−60° V；I<sub>AC</sub> = 230∠−60° / 12.81∠38.66° = 17.96∠−98.66° A', ''),
        st('Step 2　相電流 I<sub>AB</sub>、I<sub>BC</sub>。', 'I<sub>AB</sub> = 17.96∠−38.66° A、I<sub>BC</sub> = 17.96∠−158.66° A', ''),
        st('Step 3　(b) I<sub>b</sub>。', 'I<sub>b</sub> = I<sub>BC</sub> − I<sub>AB</sub> = 31.11∠171.34° A', '大小 √3 × 17.96。')
      ],
      ans: '(a) I<sub>AC</sub> ≈ 17.96∠−98.66° A　(b) I<sub>b</sub> ≈ 31.11∠171.34° A' }),
    it(23, '12.5', 'Δ 負載＋兩瓦特計', {
      q: '線電壓 208 V（rms）的平衡三相系統供電給 Z<sub>p</sub> = 25∠60° Ω 的 Δ 接負載。(a) 求線電流。(b) 用接在 A、C 線上的兩個瓦特計，求負載的總功率。',
      en: 'A three-phase balanced system with a line voltage of 208 V (rms) feeds a delta-connected load with Z<sub>p</sub> = 25∠60° Ω. (a) Find the line currents. (b) Determine the total power applied to the load using two wattmeters connected to A and C lines.',
      hint: 'I<sub>p</sub> = 208/25；I<sub>L</sub> = √3 I<sub>p</sub>。兩瓦特計：P<sub>1</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ + 30°)、P<sub>2</sub> = V<sub>L</sub>I<sub>L</sub>cos(θ − 30°)。',
      steps: [
        st('Step 1　相電流。', 'I<sub>p</sub> = 208/25 = 8.32 A', ''),
        st('Step 2　(a) 線電流。', 'I<sub>L</sub> = √3 × 8.32 = 14.41 A（取 V<sub>AB</sub> = 208∠0°：I<sub>a</sub> = 14.41∠−90°、I<sub>b</sub> = 14.41∠150°、I<sub>c</sub> = 14.41∠30° A）', ''),
        st('Step 3　兩瓦特計。', 'P<sub>1</sub> = 208 × 14.41 × cos 90° = 0；P<sub>2</sub> = 208 × 14.41 × cos 30° = 2596 W', 'θ = 60°。pf = 0.5 時其中一個剛好讀 0。'),
        st('Step 4　(b) 總功率。', 'P = P<sub>1</sub> + P<sub>2</sub> = 2.596 kW', '驗算：3 × 8.32² × 25 cos 60° = 2596 W。')
      ],
      ans: '(a) I<sub>L</sub> ≈ 14.41 A　(b) P ≈ 2.596 kW（兩個瓦特計讀 0 與 2.596 kW）' }),
    it(24, '12.5', 'Δ 電源、線路阻抗、Δ 負載', {
      q: '平衡 Δ 接電源相電壓 V<sub>ab</sub> = 416∠30° V、正相序，接到平衡 Δ 負載。負載每相 60∠30° Ω、線路每相 1 + j1 Ω。求線電流與相電流。',
      en: 'A balanced delta-connected source has phase voltage V<sub>ab</sub> = 416∠30° V and a positive phase sequence. If this is connected to a balanced delta-connected load, find the line and phase currents. Take the load impedance per phase as 60∠30° Ω and line impedance per phase as 1 + j1 Ω.',
      hint: '有線路阻抗就不能直接用 V<sub>ab</sub>/Z<sub>Δ</sub>。全部換成 Y：V<sub>an</sub> = V<sub>ab</sub>∠−30°/√3、Z<sub>Y</sub> = Z<sub>Δ</sub>/3。',
      steps: [
        st('Step 1　等效 Y 電源。', 'V<sub>an</sub> = (416/√3)∠0° = 240.2∠0° V', ''),
        st('Step 2　等效 Y 負載。', 'Z<sub>Y</sub> = 20∠30° = 17.32 + j10 Ω', ''),
        st('Step 3　線電流。', 'I<sub>a</sub> = 240.2 / (18.32 + j11) = 11.24∠−30.98° A；I<sub>b</sub> = 11.24∠−150.98°、I<sub>c</sub> = 11.24∠89.02° A', ''),
        st('Step 4　Δ 負載相電流。', 'I<sub>AB</sub> = I<sub>a</sub>∠30°/√3 = 6.489∠−0.98° A；I<sub>BC</sub> = 6.489∠−120.98°、I<sub>CA</sub> = 6.489∠119.02° A', '')
      ],
      ans: '線電流 11.24 A（∠−30.98°、−150.98°、89.02°）；相電流 6.489 A（∠−0.98°、−120.98°、119.02°）' }),

    /* ═══════════ 12.6 平衡 Δ-Y ═══════════ */
    it(28, '12.6', 'Y 負載：線電流與相電壓', {
      q: 'Y 接負載的線電壓大小 440 V、正相序、60 Hz。若負載平衡 Z<sub>1</sub> = Z<sub>2</sub> = Z<sub>3</sub> = 25∠30°，求所有線電流與相電壓。',
      en: 'The line-to-line voltages in a Y-load have a magnitude of 440 V and are in the positive sequence at 60 Hz. If the loads are balanced with Z<sub>1</sub> = Z<sub>2</sub> = Z<sub>3</sub> = 25∠30°, find all line currents and phase voltages.',
      hint: '取 V<sub>AB</sub> = 440∠0°：V<sub>AN</sub> = 254∠−30°。',
      steps: [
        st('Step 1　相電壓。', 'V<sub>AN</sub> = 254.0∠−30°、V<sub>BN</sub> = 254.0∠−150°、V<sub>CN</sub> = 254.0∠90° V', ''),
        st('Step 2　線電流。', 'I<sub>a</sub> = 254.0∠−30° / 25∠30° = 10.16∠−60° A；I<sub>b</sub> = 10.16∠−180°、I<sub>c</sub> = 10.16∠60° A', '')
      ],
      ans: '相電壓 254.0 V（∠−30°、−150°、90°）；線電流 10.16 A（∠−60°、180°、60°）', note: '以 V<sub>AB</sub> = 440∠0° 為參考。' })
  ];

  window.__CH12PB = window.__CH12PB || { book: 'Alexander & Sadiku', items: [] };
  window.__CH12PB.items = window.__CH12PB.items.concat(items);
  window.__CH12PB.tp = tp; window.__CH12PB.G = G; window.__CH12PB.vsh = vsh;
})();
