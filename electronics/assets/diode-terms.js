/* ============================================================
   電子學名詞圖鑑（10/27，使用者：介紹名詞都要附圖）—— CH1 PART 6（原講義 PART 5）＋ CH2 PART 1
   每個名詞一張圖（viewBox 0 0 640 300），註冊到 shared/tpic.js：
     set 'e16'（CH1 PART 6）：Q 點、小訊號、r_d、DC/AC 分析、失真
   set 'e17'（CH1 PART 7）：C_d、C_j、小訊號等效電路、t_s、t_f、光電元件、蕭特基、齊納
     set 'e21'：電源供應器方塊圖、變壓器、半波整流、轉移特性、v_D 波形、PIV
   需要：story.js、ch1-part5-kit.js（__K15）、shared/tpic.js
   ============================================================ */
(function () {
  'use strict';
  if (!window.__Story || !window.__K15 || !window.__TPIC) return;
  const K = window.__K15, D = K.D;
  const { T, axes, sine, f1 } = K;
  const IS = 1e-14, VT = 0.026;
  const iv = v => Math.max(0, IS * (Math.exp(v / VT) - 1) * 1e3);        /* mA */
  const vq = i => VT * Math.log(i * 1e-3 / IS);
  const AX = o => axes(80, 34, 430, 220, Object.assign({ v0: 0, v1: 0.8, i0: 0, i1: 6, vt: [[0.6, '0.6'], [0.7, '0.7']], it: [] }, o || {}));
  const chipL = (x, y, a, b, acc) => D.chip(x, y, a, b || '', null, { fs: 13, acc: !!acc });
  const NOTE = (s, y) => T(320, y || 290, s, { cls: 'ts', fs: 13 });
  const box = (x, y, w, h, s, cls) => '<rect class="' + (cls || 'card') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" filter="url(#st-sh)"/>' + T(x + w / 2, y + h / 2 + 5, s, { cls: 't', fs: 14 });

  /* Q 點（I = 2 mA） */
  const IQ = 2, VQ = vq(IQ), SL = IQ / VT;                 /* mA/V */
  function qBase(P) { return P.svg + P.curve(iv, 0, 0.78, null, 'lna') + P.dot(VQ, IQ, null, 6) + P.proj(VQ, IQ, null) + T(P.X(VQ) + 10, P.Y(IQ) - 8, 'Q', { cls: 'ta', fs: 15, a: 'start' }); }

  const cards = {
    q: { t: '工作點 Q', en: 'Q-POINT', plain: '沒有訊號時二極體停在哪一組 (電壓, 電流)。在圖上就是負載線和二極體曲線的交點。', rel: 'Q = (V<sub>DQ</sub>, I<sub>DQ</sub>)，由直流電路決定',
      svg: (() => { const P = AX({ v1: 2, vt: [[0.68, 'V<sub>DQ</sub>'], [2, 'V<sub>PS</sub>']], it: [[IQ, 'I<sub>DQ</sub>']] }); return P.svg + P.curve(iv, 0, 0.79, null, 'lna') + P.seg(0, 4.5, 2, 0, null, 'ln') + P.dot(VQ, IQ, null, 6) + P.proj(VQ, IQ, null) + T(P.X(1.3), P.Y(1.9), '負載線（外面的電路）', { cls: 'tm', fs: 13, a: 'start' }) + T(P.X(0.72), P.Y(5.4), '二極體曲線', { cls: 'ta', fs: 13, a: 'start' }); })() },
    ss: { t: '小訊號', en: 'SMALL SIGNAL', plain: '在工作點上疊一個很小的交流電壓 v<sub>d</sub>，電流就在 I<sub>DQ</sub> 上下晃一點點 i<sub>d</sub>。晃得夠小，那一小段曲線看起來是直的。', rel: 'v<sub>D</sub> = V<sub>DQ</sub> + v<sub>d</sub>，i<sub>D</sub> = I<sub>DQ</sub> + i<sub>d</sub>',
      svg: (() => { const P = AX({ it: [[IQ, 'I<sub>DQ</sub>']] }); let s = qBase(P);
        let dv = '', di = '';
        for (let n = 0; n <= 60; n++) { const u = n / 60, a = 0.012 * Math.sin(u * 4 * Math.PI); dv += (n ? ' L' : 'M') + f1(P.X(VQ + a)) + ' ' + f1(P.Y(0) + 6 + u * 38); di += (n ? ' L' : 'M') + f1(P.X(0) - 6 - u * 60) + ' ' + f1(P.Y(iv(VQ + a))); }
        return s + '<path class="ln" style="fill:none;stroke-width:2" d="' + dv + '"/><path class="lna" style="fill:none;stroke-width:2.2" d="' + di + '"/>' +
          T(P.X(VQ) + 22, P.Y(0) + 40, 'v<sub>d</sub>（小）', { cls: 't', fs: 13, a: 'start' }) + T(P.X(0) - 70, P.Y(IQ) - 22, 'i<sub>d</sub>', { cls: 'ta', fs: 13 }); })() },
    rd: { t: '增量電阻 r<sub>d</sub>', en: 'INCREMENTAL RESISTANCE', plain: '在 Q 點畫一條切線：電壓多 Δv、電流多 Δi。切線斜率 Δi/Δv = 1/r<sub>d</sub>。電流越大曲線越陡，r<sub>d</sub> 越小。', rel: 'r<sub>d</sub> = V<sub>T</sub> / I<sub>DQ</sub>（2 mA → 13 Ω）',
      svg: (() => { const P = AX({ it: [[IQ, 'I<sub>DQ</sub>']] }); const v1 = VQ - 0.035, v2 = VQ + 0.035;
        return qBase(P) + P.seg(v1, IQ - SL * 0.035, v2, IQ + SL * 0.035, null, 'ln', ' style="stroke-width:2.4"') +
          '<path class="ln dsh" style="fill:none" d="M' + P.X(VQ) + ' ' + P.Y(IQ) + ' H' + P.X(VQ + 0.02) + ' V' + P.Y(IQ + SL * 0.02) + '"/>' +
          T(P.X(VQ + 0.01), P.Y(IQ) + 16, 'Δv', { cls: 'tm', fs: 12 }) + T(P.X(VQ + 0.022) + 4, P.Y(IQ + SL * 0.01), 'Δi', { cls: 'tm', fs: 12, a: 'start' }) +
          chipL(430, 110, '切線斜率 = Δi/Δv = 1/r<sub>d</sub>', '', true); })() },
    dcac: { t: 'DC 分析、AC 分析', en: 'DC AND AC ANALYSIS', plain: '先 DC：交流源歸零（電壓源短路），二極體用 V<sub>γ</sub> 模型，求 Q 點。再 AC：直流電壓源短路（交流接地），二極體換成 r<sub>d</sub>，求交流訊號。最後兩個加起來。', rel: '總量 = 直流 + 交流（大寫下標 + 小寫下標）',
      svg: (() => {
        const mini = (x, title, dc) => {
          let s = '<path class="ln" style="fill:none" d="M' + x + ' 210 V90 H' + (x + 120) + ' M' + (x + 120) + ' 90 H' + (x + 180) + ' V210 H' + x + '"/>';
          s += dc ? '<line class="ln" x1="' + (x - 14) + '" y1="146" x2="' + (x + 14) + '" y2="146" style="stroke-width:2"/><line class="ln" x1="' + (x - 8) + '" y1="156" x2="' + (x + 8) + '" y2="156" style="stroke-width:3.4"/>' + T(x - 18, 156, 'V<sub>PS</sub>', { cls: 't', fs: 12, a: 'end' })
            : '<circle class="bgw" cx="' + x + '" cy="150" r="15"/>' + T(x, 155, '~', { cls: 't', fs: 18 }) + T(x - 20, 155, 'v<sub>i</sub>', { cls: 't', fs: 12, a: 'end' });
          s += dc ? '<path class="accw" style="stroke:var(--s-ink);stroke-width:2" d="M' + (x + 50) + ' 80 V100 L' + (x + 70) + ' 90 Z"/><line class="ln" x1="' + (x + 70) + '" y1="80" x2="' + (x + 70) + '" y2="100" style="stroke-width:2.6"/>' + T(x + 60, 72, 'V<sub>γ</sub>', { cls: 'ta', fs: 12 })
            : '<path class="ln" style="fill:none" d="M' + (x + 40) + ' 90 L' + (x + 46) + ' 82 L' + (x + 54) + ' 98 L' + (x + 62) + ' 82 L' + (x + 70) + ' 98 L' + (x + 76) + ' 90"/>' + T(x + 58, 72, 'r<sub>d</sub>', { cls: 'ta', fs: 13 });
          s += '<path class="ln" style="fill:none" d="M' + (x + 180) + ' 120 L' + (x + 172) + ' 126 L' + (x + 188) + ' 134 L' + (x + 172) + ' 142 L' + (x + 188) + ' 150 L' + (x + 180) + ' 156"/>' + T(x + 196, 142, 'R', { cls: 't', fs: 13, a: 'start' });
          return s + T(x + 90, 240, title, { cls: 'ta', fs: 15 });
        };
        return mini(90, 'DC：交流源短路、二極體 = V<sub>γ</sub>', true) + mini(380, 'AC：V<sub>PS</sub> 短路、二極體 = r<sub>d</sub>', false) + NOTE('先求 I<sub>DQ</sub>，才知道 r<sub>d</sub> = V<sub>T</sub>/I<sub>DQ</sub>', 280);
      })() },
    dist: { t: '失真', en: 'DISTORTION', plain: '交流訊號太大時，曲線彎的部分也被用到：往上晃的電流比往下晃的大很多，輸出被壓扁、上下不對稱。這時 r<sub>d</sub> 不再是定值，小訊號模型不準。', rel: '小訊號條件：|v<sub>d</sub>| ≪ V<sub>T</sub>（約 26 mV）',
      svg: (() => { const P = AX({ it: [[IQ, 'I<sub>DQ</sub>']] }); let s = qBase(P); let di = '';
        for (let n = 0; n <= 80; n++) { const u = n / 80, a = 0.025 * Math.sin(u * 4 * Math.PI); di += (n ? ' L' : 'M') + f1(P.X(0.05) + u * 150) + ' ' + f1(P.Y(iv(VQ + a))); }
        return s + '<path class="lna" style="fill:none;stroke-width:2.4" d="' + di + '"/>' + T(P.X(0.05) + 75, P.Y(5.8) + 4, '上面衝很高、下面只掉一點', { cls: 'ta', fs: 12.5 }) + chipL(470, 120, 'v<sub>d</sub> 太大（±25 mV）', '電流上下不對稱'); })() },
    cd: { t: '擴散電容 C<sub>d</sub>', en: 'DIFFUSION CAPACITANCE', plain: '順偏時兩邊中性區堆滿注入的少數載子（像倉庫的庫存）。電壓多一點 → 庫存多 ΔQ，電壓少一點 → 庫存少 ΔQ，就像電容在充放電。', rel: 'C<sub>d</sub> = dQ / dV<sub>D</sub>（順偏時主導）',
      svg: (() => { const ex = (x0, dir, A) => { let d = ''; for (let n = 0; n <= 40; n++) { const u = n / 40; d += (n ? ' L' : 'M') + f1(x0 + dir * u * 220) + ' ' + f1(250 - A * Math.exp(-u * 3)); } return d; };
        const band = (x0, dir) => { let up = ex(x0, dir, 180), lo = ex(x0, dir, 140); const pts = lo.slice(1).split(' L').reverse().join(' L'); return '<path class="accw" style="opacity:.9" d="' + up + ' L' + pts + ' Z"/>'; };
        return band(300, -1) + band(340, 1) + '<path class="ln" style="fill:none;stroke-width:2.2" d="' + ex(300, -1, 160) + '"/><path class="ln" style="fill:none;stroke-width:2.2" d="' + ex(340, 1, 160) + '"/>' +
          '<line class="ln2" x1="60" y1="250" x2="590" y2="250"/><line class="ln2 dsh" x1="300" y1="40" x2="300" y2="250"/><line class="ln2 dsh" x1="340" y1="40" x2="340" y2="250"/>' +
          T(150, 270, 'P 區：多出的電子', { cls: 'tm', fs: 13 }) + T(490, 270, 'N 區：多出的電洞', { cls: 'tm', fs: 13 }) + T(320, 34, '空乏區', { cls: 'ts', fs: 12 }) +
          chipL(470, 90, '±ΔQ（陰影）', '跟著 ±Δv 變', true); })() },
    cj: { t: '接面電容 C<sub>j</sub>', en: 'JUNCTION CAPACITANCE', plain: '空乏區兩邊是一層負離子、一層正離子，中間沒有自由載子，就像平行板電容。逆偏時空乏區變寬，C<sub>j</sub> 變小；順偏時變窄、變大。', rel: 'C = εA/W；任何偏壓下都存在，逆偏時主導',
      svg: (() => { let s = '<rect class="card" x="90" y="80" width="190" height="140" rx="6"/><rect class="card" x="360" y="80" width="190" height="140" rx="6"/><rect class="accw" x="280" y="80" width="80" height="140"/>';
        for (let r = 0; r < 5; r++) s += T(300, 104 + r * 26, '−', { cls: 'ta', fs: 18 }) + T(340, 104 + r * 26, '+', { cls: 'ta', fs: 18 });
        return s + T(185, 155, 'P', { cls: 't', fs: 22 }) + T(455, 155, 'N', { cls: 't', fs: 22 }) + D.arrow(282, 240, 358, 240, null, 'ln') + D.arrow(358, 240, 282, 240, null, 'ln') + T(320, 262, 'W（空乏區寬）', { cls: 'tm', fs: 13 }) +
          chipL(320, 52, '一層負離子 ＋ 一層正離子 ＝ 平行板電容', '', true); })() },
    sseq: { t: '小訊號等效電路', en: 'SMALL-SIGNAL EQUIVALENT CIRCUIT', plain: '交流分析時二極體換成：r<sub>d</sub>、擴散電容 C<sub>d</sub>、接面電容 C<sub>j</sub> 三個並聯，再串上晶片本身的電阻 r<sub>s</sub>。低頻時電容可以忽略，只剩 r<sub>d</sub>。', rel: 'Y = g<sub>d</sub> + jωC<sub>d</sub>（簡化版），完整版再並 C<sub>j</sub>、串 r<sub>s</sub>',
      svg: (() => { const y = [90, 150, 210];
        let s = '<path class="ln" style="fill:none" d="M110 150 H180 M180 90 V210 M420 90 V210 M420 150 H460 M520 150 H570"/>';
        s += '<path class="ln" style="fill:none" d="M180 90 H270 L276 82 L284 98 L292 82 L300 98 L308 82 L316 98 L322 90 H420"/>' + T(300, 74, 'r<sub>d</sub>', { cls: 'ta', fs: 14 });
        [150, 210].forEach((yy, i) => { s += '<path class="ln" style="fill:none" d="M180 ' + yy + ' H294 M306 ' + yy + ' H420"/><line class="ln" x1="294" y1="' + (yy - 14) + '" x2="294" y2="' + (yy + 14) + '" style="stroke-width:2.6"/><line class="ln" x1="306" y1="' + (yy - 14) + '" x2="306" y2="' + (yy + 14) + '" style="stroke-width:2.6"/>' + T(300, yy - 20, i ? 'C<sub>j</sub>' : 'C<sub>d</sub>', { cls: 'ta', fs: 14 }); });
        s += '<path class="ln" style="fill:none" d="M460 150 L466 142 L474 158 L482 142 L490 158 L498 142 L506 158 L512 150 H520"/>' + T(490, 130, 'r<sub>s</sub>', { cls: 't', fs: 14 });
        return s + T(300, 260, 'PN 接面本身', { cls: 'ts', fs: 12.5 }) + T(490, 190, '晶片、接觸電阻', { cls: 'ts', fs: 12.5 }); })() },
    ts: { t: '儲存時間 t<sub>s</sub>', en: 'STORAGE TIME', plain: '從順偏切到逆偏的瞬間，堆在兩邊的少數載子還沒清完，二極體繼續「導通」，反向電流幾乎固定在 −I<sub>R</sub>。像關了水龍頭，水管裡的水還會流一陣子。', rel: '0 &lt; t &lt; t<sub>s</sub>：i<sub>D</sub> ≈ −I<sub>R</sub> = −V<sub>R</sub>/R<sub>R</sub>，v<sub>D</sub> ≈ 0',
      svg: (() => swWave('ts'))() },
    tf: { t: '掉落時間 t<sub>f</sub>', en: 'FALL TIME', plain: '少數載子快清完時，空乏區開始恢復，反向電流從 −I<sub>R</sub> 慢慢降到 0（課本取降到 0.1 I<sub>R</sub>）。', rel: '關閉時間 = t<sub>s</sub> + t<sub>f</sub>（通常比導通時間長）',
      svg: (() => swWave('tf'))() },
    solar: { t: '太陽能電池', en: 'SOLAR CELL', plain: '光打在空乏區產生電子電洞對，內建電場把電子推到 N、電洞推到 P，<b>P 端堆正電（+）、N 端堆負電（−）</b>，像一顆電池：外面的電流從 P 流出、經過 R<sub>L</sub>、流回 N（電子方向剛好相反）。不用外加電源。', rel: '光 → 電；材料：Si、GaAs、III-V 化合物',
      svg: (() => pnPic('solar'))() },
    pd: { t: '光二極體', en: 'PHOTODIODE', plain: '原理跟太陽能電池一樣，但加<b>逆偏</b>：空乏區更寬、電場更強，光產生的電子電洞對被快速掃出。光越強，電流越大。', rel: '光 → 電（感測器）；I<sub>ph</sub> ∝ 入射光強度',
      svg: (() => pnPic('pd'))() },
    led: { t: '發光二極體 LED', en: 'LIGHT-EMITTING DIODE', plain: '加<b>順偏</b>：電子、電洞衝過接面，到對面跟多數載子復合，復合放出的能量變成光。跟光二極體剛好反過來。', rel: '電 → 光；加光學腔 → 雷射二極體',
      svg: (() => pnPic('led'))() },
    sbd: { t: '蕭特基二極體', en: 'SCHOTTKY BARRIER DIODE', plain: '金屬直接接 N 型半導體。電流靠多數載子越過接面，不堆少數載子 → 切換快；I<sub>S</sub> 大 → 同樣電流只要比較小的電壓。', rel: 'V<sub>γ</sub>（蕭特基）≈ 0.3 V &lt; V<sub>γ</sub>（pn）≈ 0.6 V',
      svg: (() => { const P = axes(300, 40, 300, 210, { v0: 0, v1: 0.8, i0: 0, i1: 6, vt: [[0.3, '0.3'], [0.6, '0.6']], it: [] });
        const fs = v => Math.max(0, 1e-8 * (Math.exp(v / VT) - 1) * 1e3), fp = v => Math.max(0, 1e-12 * (Math.exp(v / VT) - 1) * 1e3);
        return '<rect class="card" x="40" y="100" width="90" height="80" rx="4" style="stroke:var(--s-ink);stroke-width:1.6"/><rect class="accw" x="130" y="100" width="20" height="80"/><rect class="card" x="150" y="100" width="100" height="80" rx="4"/>' +
          T(85, 146, '金屬', { cls: 't', fs: 14 }) + T(200, 146, 'N 型', { cls: 't', fs: 14 }) + T(140, 200, '空乏區', { cls: 'ts', fs: 11 }) +
          P.svg + P.curve(fs, 0, 0.5, null, 'lna') + P.curve(fp, 0, 0.75, null, 'ln') + T(P.X(0.36), P.Y(5.6), '蕭特基', { cls: 'ta', fs: 13, a: 'end' }) + T(P.X(0.66), P.Y(5.6), 'pn', { cls: 't', fs: 13, a: 'start' }); })() },
    zd: { t: '齊納二極體與 r<sub>z</sub>', en: 'ZENER DIODE', plain: '刻意住在逆向崩潰區：電流變很多，電壓幾乎不變，所以拿來穩壓。崩潰那條線有一點點斜，斜率的倒數就是 r<sub>z</sub>（幾 Ω～幾十 Ω）。', rel: 'V<sub>Z</sub> = V<sub>Z0</sub> + I<sub>Z</sub> r<sub>z</sub>；r<sub>z</sub> → 0 時 V<sub>Z</sub> = V<sub>Z0</sub>',
      svg: (() => '<line class="ln" x1="60" y1="80" x2="590" y2="80"/><line class="ln" x1="460" y1="40" x2="460" y2="280"/>' + T(586, 70, 'v<sub>D</sub>', { cls: 'tm', fs: 12, a: 'end' }) + T(466, 50, 'i<sub>D</sub>', { cls: 'tm', fs: 12, a: 'start' }) +
        '<path class="lna" style="fill:none;stroke-width:2.6" d="M520 40 Q 500 78 460 80 L250 82 Q 236 84 232 100 L214 270"/>' +
        '<path class="ln dsh" style="fill:none" d="M232 100 V80"/>' + T(232, 70, 'V<sub>Z0</sub>', { cls: 't', fs: 13 }) +
        '<path class="ln dsh" style="fill:none" d="M222 190 H460"/>' + T(470, 194, 'I<sub>Z</sub>', { cls: 't', fs: 13, a: 'start' }) + '<circle class="acc" cx="222" cy="190" r="5"/>' +
        T(160, 230, '斜率 = 1/r<sub>z</sub>', { cls: 'ta', fs: 14, a: 'end' }) + chipL(330, 140, '電流變很多', '電壓幾乎不變 → 穩壓', true))() },

    /* ───── CH2 PART 1 ───── */
    psu: { t: '直流電源供應器', en: 'AC-TO-DC POWER SUPPLY', plain: '插座的交流電 → 變壓器降壓 → 整流（只留單一方向）→ 濾波（把起伏填平）→ 穩壓（固定在某個電壓）→ 給負載。', rel: '變壓器 → 整流 → 濾波 → 穩壓 → 負載',
      svg: (() => { const xs = [40, 160, 280, 400, 520], nm = ['變壓器', '整流', '濾波', '穩壓', '負載'];
        let s = '';
        xs.forEach((x, i) => { s += box(x, 80, 90, 56, nm[i], i === 1 ? 'accw' : 'card'); if (i) s += D.arrow(x - 30, 108, x - 4, 108, null, 'ln'); });
        const wv = (x, kind) => { let d = ''; for (let n = 0; n <= 40; n++) { const u = n / 40, a = Math.sin(u * 4 * Math.PI); let y = kind === 'ac' ? a : kind === 'hw' ? Math.max(0, a) : kind === 'rip' ? 0.8 + 0.12 * Math.abs(Math.sin(u * 4 * Math.PI)) : 0.85; d += (n ? ' L' : 'M') + f1(x + u * 80) + ' ' + f1(200 - y * 26); } return '<path class="lna" style="fill:none;stroke-width:2" d="' + d + '"/><line class="ln2" x1="' + x + '" y1="200" x2="' + (x + 80) + '" y2="200"/>'; };
        return s + wv(45, 'ac') + wv(165, 'hw') + wv(285, 'rip') + wv(405, 'dc') + wv(525, 'dc') + T(85, 240, '交流（降壓後）', { cls: 'ts', fs: 11.5 }) + T(205, 240, '脈動直流', { cls: 'ts', fs: 11.5 }) + T(325, 240, '有漣波', { cls: 'ts', fs: 11.5 }) + T(445, 240, '平穩直流', { cls: 'ts', fs: 11.5 }); })() },
    xfmr: { t: '變壓器、匝數比', en: 'TRANSFORMER & TURNS RATIO', plain: '兩組線圈繞在同一個鐵心上。一次側接市電，二次側給電路；圈數比幾倍，電壓就差幾倍。', rel: 'v<sub>I</sub> / v<sub>S</sub> = N<sub>1</sub> / N<sub>2</sub>',
      svg: (() => { const coil = (x, n, y0) => { let d = 'M' + x + ' ' + y0; for (let i = 0; i < n; i++) d += ' a14 ' + (100 / n / 2) + ' 0 0 1 0 ' + (100 / n); return '<path class="ln" style="fill:none;stroke-width:2.2" d="' + d + '"/>'; };
        return '<rect class="accw" x="300" y="70" width="40" height="140" rx="4"/>' + coil(280, 10, 90) + coil(360, 4, 90).replace('a14', 'a-14').replace(/a14/g, 'a-14') +
          '<path class="ln" style="fill:none" d="M280 90 H180 M280 190 H180 M360 90 H460 M360 190 H460"/>' + T(170, 145, 'v<sub>I</sub> = 110 V', { cls: 't', fs: 14, a: 'end' }) + T(470, 145, 'v<sub>S</sub>', { cls: 't', fs: 14, a: 'start' }) +
          T(250, 230, 'N<sub>1</sub>（圈多）', { cls: 'tm', fs: 13 }) + T(390, 230, 'N<sub>2</sub>（圈少）', { cls: 'tm', fs: 13 }) + chipL(320, 42, '圈數少 → 電壓低（降壓）', '', true); })() },
    hwr: { t: '半波整流', en: 'HALF-WAVE RECTIFIER', plain: '二極體只讓正半週過去：v<sub>S</sub> 超過 V<sub>γ</sub> 才導通，輸出 v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>；負半週二極體斷路，輸出 0。', rel: 'v<sub>S</sub> &gt; V<sub>γ</sub>：v<sub>O</sub> = v<sub>S</sub> − V<sub>γ</sub>；否則 v<sub>O</sub> = 0',
      svg: (() => sine(70, 110, 500, 60, { cls: 'ln dsh' }) + sine(70, 220, 500, 60, { cut: true, shift: 8 }) + '<line class="ln2" x1="70" y1="110" x2="580" y2="110"/><line class="ln2" x1="70" y1="220" x2="580" y2="220"/>' +
        T(60, 114, 'v<sub>S</sub>', { cls: 't', fs: 14, a: 'end' }) + T(60, 224, 'v<sub>O</sub>', { cls: 'ta', fs: 14, a: 'end' }) + T(450, 252, '負半週：二極體斷路，v<sub>O</sub> = 0', { cls: 'ts', fs: 12.5 }))() },
    vtc: { t: '電壓轉移特性', en: 'VOLTAGE TRANSFER CHARACTERISTIC', plain: '橫軸是輸入 v<sub>S</sub>、縱軸是輸出 v<sub>O</sub>。V<sub>γ</sub> 以前是平的（二極體不通），之後是斜率 1 的斜線。輸入波形照這張圖「翻譯」就得到輸出。', rel: 'v<sub>S</sub> ≤ V<sub>γ</sub>：v<sub>O</sub> = 0；v<sub>S</sub> &gt; V<sub>γ</sub>：斜率 1',
      svg: (() => D.arrow(80, 240, 580, 240, null, 'ln') + D.arrow(300, 270, 300, 40, null, 'ln') + T(580, 262, 'v<sub>S</sub>', { cls: 'tm', fs: 13, a: 'end' }) + T(308, 48, 'v<sub>O</sub>', { cls: 'tm', fs: 13, a: 'start' }) +
        '<path class="lna" style="fill:none;stroke-width:3" d="M90 240 H340 L540 60"/>' + T(340, 258, 'V<sub>γ</sub>', { cls: 'ta', fs: 13 }) + T(480, 150, '斜率 = 1', { cls: 'ta', fs: 14, a: 'start' }) + T(180, 228, '不導通：v<sub>O</sub> = 0', { cls: 'tm', fs: 13 }))() },
    vdw: { t: '二極體上的電壓 v<sub>D</sub>', en: 'DIODE VOLTAGE', plain: '正半週導通時二極體只吃 V<sub>γ</sub>（平頂）；負半週不導通，整個輸入電壓都落在二極體上（反向）。', rel: 'v<sub>D</sub> = v<sub>S</sub> − v<sub>O</sub>；最大逆偏 = V<sub>M</sub>（PIV）',
      svg: (() => { let d = ''; for (let n = 0; n <= 120; n++) { const u = n / 120, s = Math.sin(u * 4 * Math.PI); const v = s > 0.13 ? 0.13 : s; d += (n ? ' L' : 'M') + f1(70 + u * 500) + ' ' + f1(150 - v * 90); }
        return '<line class="ln2" x1="70" y1="150" x2="580" y2="150"/>' + sine(70, 150, 500, 90, { cls: 'ln dsh' }) + '<path class="lna" style="fill:none;stroke-width:2.6" d="' + d + '"/>' +
          T(60, 154, 'v<sub>D</sub>', { cls: 'ta', fs: 14, a: 'end' }) + T(190, 124, 'V<sub>γ</sub>（平頂）', { cls: 'ta', fs: 12.5 }) + T(320, 262, '−V<sub>M</sub>：最大逆偏 = PIV', { cls: 'ta', fs: 13 }); })() },
    piv: { t: '反向峰值電壓 PIV', en: 'PEAK INVERSE VOLTAGE', plain: '負半週時二極體要擋住整個反向電壓，最大就是輸入的峰值 V<sub>M</sub>。選二極體時耐壓要比它大，否則會崩潰。', rel: '半波整流：PIV = V<sub>M</sub>',
      svg: (() => { const P = axes(80, 50, 460, 200, { v0: -12, v1: 2, i0: -4, i1: 4, vt: [[-10, '−BV'], [-6, '−V<sub>M</sub>']], it: [] });
        const f = v => v > 0 ? Math.min(4, 1e-12 * Math.exp(v / VT) * 1e3) : v < -10 ? Math.max(-4, (v + 10) * 3) : 0;
        return P.svg + P.curve(f, -11.4, 0.75, null, 'lna') + '<path class="accw" style="opacity:.6" d="M' + P.X(-6) + ' ' + P.Y(-0.3) + ' H' + P.X(0) + ' V' + P.Y(0.3) + ' H' + P.X(-6) + ' Z"/>' +
          T(P.X(-3), P.Y(0.6), '二極體在這段擋電壓', { cls: 'ta', fs: 13 }) + T(P.X(-10.5), P.Y(-3.4), '崩潰！', { cls: 't', fs: 13, a: 'start' }) + chipL(430, 220, '耐壓 BV 要大於 V<sub>M</sub>', '', true); })() }
  };

  /* 開關暫態波形（t_s 或 t_f 塗色） */
  function swWave(hl) {
    const x0 = 80, yz = 150, IF = 70, IR = 70, ts = 150, tf = 100;
    let d = 'M' + x0 + ' ' + (yz - IF) + ' H200 V' + (yz + IR) + ' H' + (200 + ts);
    for (let n = 0; n <= 30; n++) { const u = n / 30; d += ' L' + f1(200 + ts + u * tf * 1.6) + ' ' + f1(yz + IR * Math.exp(-u * 3.2)); }
    return '<line class="ln2" x1="' + x0 + '" y1="' + yz + '" x2="600" y2="' + yz + '"/><line class="ln2" x1="' + x0 + '" y1="40" x2="' + x0 + '" y2="260"/>' +
      '<rect class="accw" x="' + (hl === 'ts' ? 200 : 200 + ts) + '" y="60" width="' + (hl === 'ts' ? ts : tf * 1.6) + '" height="190" style="opacity:.75"/>' +
      '<path class="lna" style="fill:none;stroke-width:2.8" d="' + d + '"/>' + T(70, yz - IF + 4, 'I<sub>F</sub>', { cls: 't', fs: 13, a: 'end' }) + T(70, yz + IR + 4, '−I<sub>R</sub>', { cls: 't', fs: 13, a: 'end' }) +
      T(200, yz - IF - 10, 't = 0 切到逆偏', { cls: 'tm', fs: 12 }) + T(200 + ts / 2, 266, 't<sub>s</sub>', { cls: hl === 'ts' ? 'ta' : 'tm', fs: 15 }) + T(200 + ts + tf * 0.8, 266, 't<sub>f</sub>', { cls: hl === 'tf' ? 'ta' : 'tm', fs: 15 }) +
      T(596, yz - 8, 't', { cls: 'tm', fs: 12, a: 'end' }) + T(86, 44, 'i<sub>D</sub>', { cls: 'tm', fs: 12, a: 'start' });
  }
  /* 光電三兄弟：pn 方塊＋光／電池／負載 */
  function pnPic(kind) {
    let s = '<rect class="card" x="150" y="80" width="140" height="80" rx="4" style="stroke:var(--s-ink);stroke-width:1.6"/><rect class="accw" x="290" y="80" width="60" height="80"/><rect class="card" x="350" y="80" width="140" height="80" rx="4" style="stroke:var(--s-ink);stroke-width:1.6"/>' +
      T(220, 126, 'p', { cls: 't', fs: 20 }) + T(420, 126, 'n', { cls: 't', fs: 20 }) + T(320, 176, '空乏區', { cls: 'ts', fs: 11 });
    const wavy = (x, y, up) => { let d = 'M' + x + ' ' + y; for (let i = 0; i < 6; i++) d += ' q 4 ' + (up ? -5 : 5) + ' 8 0'; return '<path class="lna" style="fill:none;stroke-width:2" d="' + d + '" transform="rotate(' + (up ? -60 : 60) + ' ' + x + ' ' + y + ')"/>'; };
    if (kind === 'led') s += [270, 320, 370].map(x => wavy(x, 70, true)).join('') + T(320, 40, '放出光', { cls: 'ta', fs: 13 });
    else s += [280, 320, 360].map(x => wavy(x - 20, 30, false)).join('') + T(410, 40, '光打進空乏區', { cls: 'ta', fs: 13, a: 'start' });
    s += '<path class="ln" style="fill:none" d="M150 120 H110 V240 H530 V120 H490"/>';
    if (kind === 'solar') s += '<path class="ln" style="fill:none" d="M300 240 L306 232 L314 248 L322 232 L330 248 L336 240"/>' + T(318, 270, 'R<sub>L</sub>（負載）', { cls: 't', fs: 13 }) + D.arrow(380, 232, 430, 232, null, 'lna') + T(405, 224, 'I（外部，p → R<sub>L</sub> → n）', { cls: 'ta', fs: 12, a: 'start' }) +
      T(132, 112, '+', { cls: 'ta', fs: 20 }) + T(508, 112, '−', { cls: 'ta', fs: 20 }) + T(220, 148, '電洞 ← ', { cls: 'tm', fs: 11 }) + T(420, 148, '→ 電子', { cls: 'tm', fs: 11 });
    else {
      const rev = kind === 'pd';
      s += '<line class="ln" x1="' + (rev ? 330 : 310) + '" y1="226" x2="' + (rev ? 330 : 310) + '" y2="254" style="stroke-width:2"/><line class="ln" x1="' + (rev ? 310 : 330) + '" y1="232" x2="' + (rev ? 310 : 330) + '" y2="248" style="stroke-width:3.4"/>' +
        '<rect x="312" y="230" width="16" height="20" style="fill:var(--s-card)"/>' + T(320, 276, rev ? '逆偏（p 接負）' : '順偏（p 接正）', { cls: 'ta', fs: 13 });
      if (rev) s += D.arrow(380, 232, 430, 232, null, 'lna') + T(440, 224, 'I<sub>ph</sub>', { cls: 'ta', fs: 13, a: 'start' });
      else s += D.arrow(200, 232, 250, 232, null, 'lna') + T(225, 224, 'I<sub>D</sub>', { cls: 'ta', fs: 13 });
    }
    return s;
  }

  window.__TPIC.add(cards, {
    e16: ['q', 'ss', 'rd', 'dcac', 'dist'],
    e17: ['cd', 'cj', 'sseq', 'ts', 'tf', 'solar', 'pd', 'led', 'sbd', 'zd'],
    e21: ['psu', 'xfmr', 'hwr', 'vtc', 'vdw', 'piv']
  }, { '工作點': 'q', '小訊號': 'ss', '增量電阻': 'rd', '交流接地': 'dcac', '失真': 'dist', '擴散電容': 'cd', '接面電容': 'cj', '儲存時間': 'ts', '掉落時間': 'tf',
    '太陽能電池': 'solar', '光二極體': 'pd', '發光二極體': 'led', '蕭特基二極體': 'sbd', '齊納電阻': 'zd', '齊納二極體': 'zd',
    '變壓器': 'xfmr', '匝數比': 'xfmr', '半波整流': 'hwr', '轉移特性': 'vtc', 'PIV': 'piv', '穩壓': 'psu' });
})();
