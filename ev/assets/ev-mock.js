/* 電動車期中考：練習題（畫圖／寫字或打字／計算／選擇），每題下面有答案＋圖。
   內容只照講義 CH01～CH04＋11/11 四象限板書；效率、電池顆數是自編數字。 */
(function () {
  'use strict';
  var N = 0;
  function svg(h, body) {
    var id = 'evah' + (N++);
    return '<svg class="mf" viewBox="0 0 640 ' + h + '" role="img"><defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ah"/></marker></defs>' + body.replace(/MK/g, 'url(#' + id + ')') + '</svg>';
  }
  function bx(x, y, w, h, t, c) {
    var L = t.split('|'), cy = y + h / 2 - (L.length - 1) * 9 + 6, s = '<rect class="bx ' + (c || '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10"/>';
    L.forEach(function (l, i) { s += '<text class="bt ' + (c || '') + '" x="' + (x + w / 2) + '" y="' + (cy + i * 18) + '">' + l + '</text>'; });
    return s;
  }
  function ar(x1, y1, x2, y2, c, both) { return '<line class="ar ' + (c || '') + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" marker-end="MK"' + (both ? ' marker-start="MK"' : '') + '/>'; }
  function tx(x, y, t, c, a) { return '<text class="tx ' + (c || '') + '" x="' + x + '" y="' + y + '" text-anchor="' + (a || 'middle') + '">' + t + '</text>'; }
  function tiles(list) { return '<div class="pic">' + list.map(function (p) { return p === '→' ? '<span class="pa">→</span>' : '<span class="pt"><span class="pe">' + p[0] + '</span><span class="pw">' + p[1] + '</span></span>'; }).join('') + '</div>'; }

  var F = {
    arch: function () {
      var X = [10, 140, 270, 400, 530], T = ['電網', '車載|充電器', '高壓電池', '驅動控制', '馬達'], s = '';
      X.forEach(function (x, i) { s += bx(x, 30, 100, 48, T[i], i === 2 || i === 4 ? 'a' : ''); if (i) s += ar(X[i - 1] + 100, 54, x - 2, 54); });
      s += bx(530, 120, 100, 44, '變速箱') + ar(580, 78, 580, 118) + bx(530, 200, 100, 44, '車輪') + ar(580, 164, 580, 198);
      s += bx(270, 120, 100, 44, 'DC/DC') + ar(320, 78, 320, 118) + bx(270, 200, 100, 44, '12/24 V|低壓電池') + ar(320, 164, 320, 198);
      s += bx(400, 160, 100, 44, '油門、煞車') + ar(450, 160, 450, 80);
      return svg(260, s);
    },
    quad: function () {
      var s = ar(110, 150, 530, 150) + ar(320, 280, 320, 22) + tx(536, 155, 'ω 轉速', 'b', 'start') + tx(330, 26, 'T 轉矩', 'b', 'start');
      s += bx(360, 50, 150, 74, '一　ω＋ T＋|P＋ 前進驅動', 'a') + bx(130, 50, 150, 74, '二　ω− T＋|P− 倒車煞車');
      s += bx(130, 176, 150, 74, '三　ω− T−|P＋ 倒車驅動', 'a') + bx(360, 176, 150, 74, '四　ω＋ T−|P− 前進再生煞車');
      s += tx(320, 296, 'P = T × ω：同號 P＋ 吃電（驅動）、異號 P− 吐電（發電）', 's');
      return svg(305, s);
    },
    series: function () {
      var X = [10, 140, 270, 400, 530], T = ['燃料', '引擎', '發電機', '馬達', '車輪'], s = '';
      X.forEach(function (x, i) { s += bx(x, 30, 100, 46, T[i], i === 3 ? 'a' : ''); if (i) s += ar(X[i - 1] + 100, 53, x - 2, 53); });
      s += bx(335, 125, 100, 46, '電池') + ar(330, 76, 368, 123) + ar(410, 123, 445, 78, '', true);
      s += tx(320, 200, '引擎只負責發電，只有馬達推車輪', 's');
      return svg(215, s);
    },
    parallel: function () {
      var s = bx(10, 20, 100, 46, '燃料') + ar(110, 43, 148, 43) + bx(150, 20, 110, 46, '引擎') + ar(260, 43, 338, 88);
      s += bx(10, 130, 100, 46, '電池') + ar(110, 153, 148, 153, '', true) + bx(150, 130, 110, 46, '馬達', 'a') + ar(260, 153, 338, 112);
      s += bx(340, 76, 130, 46, '動力結合') + ar(470, 99, 518, 99) + bx(520, 76, 110, 46, '車輪');
      s += tx(320, 205, '引擎和馬達「都」能推車輪（目前最常見）', 's');
      return svg(215, s);
    },
    split: function () {
      var s = bx(10, 80, 110, 46, '引擎') + ar(120, 103, 158, 103) + bx(160, 80, 130, 46, '行星齒輪', 'a');
      s += ar(290, 103, 508, 103) + bx(510, 80, 120, 46, '車輪');
      s += ar(225, 126, 225, 168) + bx(160, 170, 130, 46, '發電機') + ar(290, 193, 338, 193) + bx(340, 170, 120, 46, '電池') + ar(460, 193, 508, 193) + bx(510, 170, 120, 46, '馬達') + ar(570, 170, 570, 128);
      s += tx(320, 30, '行星齒輪把引擎動力分兩路：直接推車輪＋帶發電機', 'b') + tx(320, 244, '兩種優點都有，但構造複雜', 's');
      return svg(255, s);
    },
    fleming: function () {
      var s = ar(320, 170, 320, 50, 'a') + ar(320, 170, 500, 170, 'a') + ar(320, 170, 200, 245, 'a');
      s += tx(330, 48, '拇指 F：導線運動（力）', 'b', 'start') + tx(505, 166, '食指 B：磁場', 'b', 'start') + tx(196, 262, '中指 I：電流', 'b', 'end');
      s += bx(10, 20, 170, 70, '🫲 左手定則|→ 馬達（電變動）', 'a') + bx(460, 220, 170, 70, '🫱 右手定則|→ 發電機（動變電）');
      return svg(300, s);
    },
    ampere: function () {
      var s = '<ellipse class="lp" cx="320" cy="120" rx="140" ry="42"/>' + ar(320, 210, 320, 30, 'a') + tx(332, 36, '電流 I', 'b', 'start');
      s += ar(200, 142, 230, 152) + ar(440, 98, 410, 88) + tx(470, 132, '沿迴路一圈', 's', 'start');
      s += tx(320, 240, '長度 × 磁場強度 一圈加起來 ＝ 圈住的電流 × 磁導率', 'b');
      return svg(255, s);
    },
    conv: function () {
      var s = '', R = [['電網（交流）', '車載充電器', '高壓電池（直流）', false], ['高壓電池（直流）', '逆變器', '馬達（交流）', true], ['高壓電池（高壓直流）', 'DC-DC 轉換器', '12/24 V（低壓直流）', false]];
      R.forEach(function (r, i) {
        var y = 14 + i * 76;
        s += bx(10, y, 170, 48, r[0]) + ar(180, y + 24, 228, y + 24) + bx(230, y, 180, 48, r[1], 'a') + ar(410, y + 24, 458, y + 24, '', r[3]) + bx(460, y, 170, 48, r[2]);
      });
      s += tx(435, 82, '↔ 煞車回充反過來', 's');
      return svg(245, s);
    },
    batt: function () {
      var s = '', i;
      for (i = 0; i < 4; i++) s += bx(20 + i * 66, 60, 56, 40, '12 V') + (i ? '<line class="ln" x1="' + (10 + i * 66) + '" y1="80" x2="' + (20 + i * 66) + '" y2="80"/>' : '');
      s += tx(150, 40, '串聯：一顆接一顆', 'b') + tx(150, 140, '電壓相加 → 48 V', 'a') + tx(150, 164, '電流一樣', 's');
      s += '<line class="ln" x1="380" y1="30" x2="380" y2="200"/><line class="ln" x1="600" y1="30" x2="600" y2="200"/>';
      for (i = 0; i < 4; i++) s += '<line class="ln" x1="380" y1="' + (48 + i * 44) + '" x2="460" y2="' + (48 + i * 44) + '"/>' + bx(460, 32 + i * 44, 70, 32, '12 V') + '<line class="ln" x1="530" y1="' + (48 + i * 44) + '" x2="600" y2="' + (48 + i * 44) + '"/>';
      s += tx(490, 20, '並聯：並排接', 'b') + tx(490, 222, '電壓不變 12 V、電流（容量）相加', 'a');
      return svg(235, s);
    },
    levels: function () {
      var T = ['啟停系統|停車熄火＋煞車回收', '中度混合|＋電動輔助', '重度混合|＋只用電行駛', '插電式混合|＋插座充電'], s = '';
      T.forEach(function (t, i) { s += bx(10 + i * 157, 150 - i * 40, 148, 64 + i * 40, t, i === 3 ? 'a' : ''); });
      s += ar(40, 236, 600, 236) + tx(320, 254, '越往右，電出的力越多（一級多一招）', 's');
      return svg(262, s);
    },
    eff: function () {
      var T = ['電網', '充電|92%', '電池|95%', '逆變器|97%', '馬達|93%', '車輪'], s = '';
      T.forEach(function (t, i) { var x = 5 + i * 106; s += bx(x, 30, 94, 56, t, i && i < 5 ? 'a' : ''); if (i) s += ar(x - 12, 58, x - 2, 58); });
      s += tx(320, 130, '總效率 ＝ 0.92 × 0.95 × 0.97 × 0.93 ≈ 0.788 ＝ 78.8%', 'b') + tx(320, 158, '一段一段「乘」，不是加（數字為自編）', 's');
      return svg(170, s);
    },
    linel: function () {
      var s = bx(10, 20, 110, 50, '48 V 電池') + '<line class="wire hot" x1="120" y1="45" x2="500" y2="45"/>' + bx(500, 20, 130, 50, '30 kW 負載');
      s += tx(310, 32, 'I ＝ 30000 ÷ 48 ＝ 625 A', 'b') + tx(310, 82, '損失 I²R ＝ 625² × 0.003 ≈ 1172 W 🔥', 'a');
      s += bx(10, 120, 110, 50, '350 V 電池') + '<line class="wire" x1="120" y1="145" x2="500" y2="145"/>' + bx(500, 120, 130, 50, '30 kW 負載');
      s += tx(310, 132, 'I ＝ 30000 ÷ 350 ≈ 86 A', 'b') + tx(310, 182, '損失 ≈ 85.7² × 0.003 ≈ 22 W', 'a');
      s += tx(320, 212, '線路電阻 3 mΩ：電壓高 → 電流小 → 損失小', 's');
      return svg(222, s);
    },
    cls: function () {
      var C = [['依動力來源', 'BEV 純電動|HEV 混合動力|PHEV 插電式|E-REV 增程型'], ['依混合程度', '啟停|中度|重度|插電式'], ['依連結方式', '串聯|並聯|功率分配']], s = bx(240, 8, 160, 40, '電動化車輛 EV／ECV', 'a');
      C.forEach(function (c, i) {
        var x = 10 + i * 215;
        s += ar(320, 48, x + 100, 70) + bx(x, 72, 200, 36, c[0]);
        c[1].split('|').forEach(function (t, j) { s += tx(x + 100, 132 + j * 22, t, 's'); });
      });
      return svg(225, s);
    },
    mg: function () {
      var s = bx(10, 14, 130, 44, '電能') + ar(140, 36, 238, 36) + bx(240, 14, 150, 44, '馬達', 'a') + ar(390, 36, 488, 36) + bx(490, 14, 140, 44, '機械能（轉）');
      s += bx(10, 84, 130, 44, '機械能（轉）') + ar(140, 106, 238, 106) + bx(240, 84, 150, 44, '發電機') + ar(390, 106, 488, 106) + bx(490, 84, 140, 44, '電能');
      s += bx(10, 154, 130, 44, '踩煞車|車子動能') + ar(140, 176, 238, 176) + bx(240, 154, 150, 44, '馬達變發電機', 'a') + ar(390, 176, 488, 176) + bx(490, 154, 140, 44, '充回電池');
      s += tx(320, 222, '原理一樣、方向相反；導線切割磁力線 → 感應電壓', 's');
      return svg(232, s);
    },
    adv: function () { return tiles([['🚭', '零廢氣'], ['🤫', '安靜'], ['🚦', '塞車省'], ['⬇️', '重心低'], ['🏠', '在家充'], ['💪', '起步 100% 扭矩'], ['⚙️', '效率 ＞ 75%'], ['💰', '長期便宜']]); },
    common: function () { return tiles([['💰', '第一年 BEV 最便宜'], ['⛽', '燃料 140 vs 1,140 英鎊'], ['♻️', 'ELV 95% 回收'], ['🤖', '自駕 0～5'], ['⚡', '高壓 ＞ 60 V DC']]); }
  };

  /* ---------- 題目 ---------- */
  var Q = [
    /* 畫圖題 */
    { id: 'd1', t: 'draw', no: 3, q: '畫出電動車的系統架構圖（從電網一路畫到車輪，含低壓系統）。', fig: 'arch',
      chk: ['電網 → 車載充電器 → 高壓電池', '高壓電池 → 驅動控制 → 馬達 → 變速箱 → 車輪', '高壓電池 → DC/DC → 12/24 V 低壓電池', '油門、煞車訊號 → 驅動控制'] },
    { id: 'd2', t: 'draw', no: 5, q: '畫出四象限控制圖：標出兩軸、四個象限的 ω、T、P 正負號和意義。', fig: 'quad',
      chk: ['橫軸 ω（轉速）、縱軸 T（轉矩）、P = T × ω', '一：ω＋T＋ P＋ 前進驅動', '二：ω−T＋ P− 倒車煞車', '三：ω−T− P＋ 倒車驅動', '四：ω＋T− P− 前進再生煞車'] },
    { id: 'd3', t: 'draw', no: 9, q: '畫出串聯式油電車的架構圖。', fig: 'series',
      chk: ['燃料 → 引擎 → 發電機', '發電機 → 電池／馬達', '只有馬達推車輪'] },
    { id: 'd4', t: 'draw', no: 9, q: '畫出並聯式油電車的架構圖。', fig: 'parallel',
      chk: ['燃料 → 引擎 → 動力結合', '電池 → 馬達 → 動力結合', '動力結合 → 車輪（兩個都能推）'] },
    { id: 'd5', t: 'draw', no: 9, q: '畫出功率分配式油電車的架構圖。', fig: 'split',
      chk: ['引擎 → 行星齒輪', '行星齒輪 → 車輪、行星齒輪 → 發電機 → 電池', '電池 → 馬達 → 車輪'] },
    { id: 'd6', t: 'draw', no: 6, q: '畫出弗萊明定則三根手指的方向，並標出左手、右手各用在哪裡。', fig: 'fleming',
      chk: ['拇指 F：運動方向', '食指 B：磁場方向', '中指 I：電流方向', '左手 → 馬達、右手 → 發電機'] },
    { id: 'd7', t: 'draw', no: 12, q: '用四顆 12 V 電池，分別畫出串聯和並聯，標出總電壓。（自編數字）', fig: 'batt',
      chk: ['串聯：頭尾相接，4 × 12 ＝ 48 V', '並聯：並排接在兩條線上，還是 12 V、電流（容量）相加'] },
    { id: 'd8', t: 'draw', no: 4, q: '畫出三種電力轉換設備，各自從哪裡轉到哪裡。', fig: 'conv',
      chk: ['車載充電器：電網 → 高壓電池', '逆變器：電池直流 → 馬達交流（煞車時反過來）', 'DC-DC：高壓直流 → 12/24 V'] },

    /* 寫字（打字或手寫）題 */
    { id: 'w1', t: 'write', no: 1, q: '電動化車輛有哪些分類？寫出英文縮寫。', fig: 'cls',
      kw: [['BEV'], ['HEV'], ['PHEV'], ['E-REV', 'EREV', '增程'], ['啟停'], ['中度'], ['重度'], ['插電'], ['串聯'], ['並聯'], ['功率分配']],
      ans: '依動力來源：<b>BEV 純電動車</b>、<b>HEV 混合動力車</b>、<b>PHEV 插電式混合動力車</b>、<b>E-REV 增程型電動車</b>（總稱 EV／ECV）。依混合程度：<b>啟停、中度、重度、插電式</b>。依連結方式：<b>串聯、並聯、功率分配</b>。' },
    { id: 'w2', t: 'write', no: 2, q: '寫出電動車的優點（越多越好）。', fig: 'adv',
      kw: [['零', '廢氣', '排放'], ['安靜'], ['走走停停', '塞車'], ['重心'], ['在家', '家裡'], ['扭矩'], ['效率'], ['成本', '便宜']],
      ans: '<b>零廢氣排放</b>、<b>安靜</b>、<b>走走停停的路況更節能舒適</b>、<b>重心低</b>、<b>可以在家充電</b>；馬達<b>起步就有 100% 扭矩</b>、電→機械<b>效率 ＞ 75%</b>、<b>長期使用成本低</b>。' },
    { id: 'w3', t: 'write', no: 4, q: '電動車有哪些重要的電力轉換設備？各做什麼？', fig: 'conv',
      kw: [['逆變器'], ['直流', 'DC'], ['交流', 'AC'], ['DC-DC', 'DC/DC'], ['12'], ['充電器']],
      ans: '<b>逆變器</b>：電池<b>直流 → 交流</b>給馬達，再生煞車時反過來充電。<b>DC-DC 轉換器</b>：高壓直流 → <b>12/24 V</b> 給低壓系統。<b>車載充電器</b>：把電網的電<b>充進電池</b>。' },
    { id: 'w4', t: 'write', no: 5, q: '說明四象限控制，以及 P 正、負的物理意義。', fig: 'quad',
      kw: [['ω', '轉速'], ['T', '轉矩'], ['P = T', 'T × ω', 'T×ω', 'Tω'], ['驅動'], ['煞車'], ['發電', '回充'], ['倒車']],
      ans: '<b>P = T × ω</b>。一象限 ω＋T＋ <b>前進驅動</b>；四象限 ω＋T− <b>前進再生煞車</b>；三象限 ω−T− <b>倒車驅動</b>；二象限 ω−T＋ <b>倒車煞車</b>。<b>P＋：馬達耗電推車</b>；<b>P−：馬達變發電機，動能變電能回充電池</b>。' },
    { id: 'w5', t: 'write', no: 6, q: '說明弗萊明左手、右手定則與安培定律。', fig: 'fleming', fig2: 'ampere',
      kw: [['食指'], ['磁場'], ['中指'], ['電流'], ['拇指'], ['運動', '力'], ['左手'], ['馬達'], ['右手'], ['發電機'], ['安培'], ['迴路', '一圈']],
      ans: '<b>食指磁場、中指電流、拇指運動方向</b>；<b>左手定則 → 馬達</b>，<b>右手定則 → 發電機</b>。安培定律：沿<b>封閉迴路</b>，<b>長度 × 磁場強度加總 ＝ 圈住的電流 × 磁導率</b>（電流會產生磁場）。' },
    { id: 'w6', t: 'write', no: 7, q: '說明電動機（馬達）與發電機的原理，以及電動車怎麼發電。', fig: 'mg',
      kw: [['電能'], ['機械能'], ['磁場'], ['切割', '磁力線'], ['感應'], ['煞車'], ['回收', '回充', '充回']],
      ans: '<b>馬達：電能 → 機械能</b>（兩個磁場互相推拉）；<b>發電機：機械能 → 電能</b>（導線<b>切割磁力線</b>產生<b>感應電壓</b>）。兩者原理相同、方向相反。<b>煞車時馬達變發電機</b>，把動能<b>回收存回電池</b>（再生煞車）。' },
    { id: 'w7', t: 'write', no: 8, q: '油電車依混合程度分哪幾種？說明差別。', fig: 'levels',
      kw: [['啟停'], ['熄火'], ['中度'], ['輔助'], ['重度'], ['只用電', '純電'], ['插電'], ['插座', '充電']],
      ans: '<b>啟停系統</b>：停車熄火＋煞車回收。<b>中度混合</b>：再加<b>電動輔助</b>。<b>重度混合</b>：可以<b>只用電行駛</b>。<b>插電式混合</b>：可以<b>插座充電</b>。目的：省油、少廢氣、提高扭矩與功率。' },
    { id: 'w8', t: 'write', no: 11, q: '為什麼電動車的驅動系統要用高電壓？用線損說明。', fig: 'linel',
      kw: [['I²R', 'I2R', '平方'], ['電流'], ['小'], ['損失', '線損'], ['功率']],
      ans: '線損 <b>＝ I²R</b>。<b>相同功率</b>下，<b>電壓越高 → 電流越小 → 損失越小</b>，而且跟電流<b>平方</b>成正比。例：30 kW、3 mΩ，48 V 損失約 1172 W，350 V 只有約 22 W。' },
    { id: 'w9', t: 'write', no: 12, q: '電池組什麼時候要串聯？什麼時候要並聯？', fig: 'batt',
      kw: [['串'], ['電壓'], ['相加'], ['並'], ['電流', '容量']],
      ans: '<b>串聯：電壓相加、電流一樣</b> → <b>需要高電壓</b>時用。<b>並聯：電壓不變、電流（容量）相加</b> → <b>需要大電流或大容量</b>時用。講義圖 4.38：同一批電池串起來 350 V、並起來 48 V。' },
    { id: 'w10', t: 'write', no: 10, q: '效率怎麼定義？從充電到馬達的總效率怎麼算？', fig: 'eff',
      kw: [['有用'], ['總', '輸入'], ['相乘', '乘']],
      ans: '效率 <b>η ＝ 有用功 ÷ 總能量</b>。能量要經過好幾段，<b>總效率 ＝ 每一段效率相乘</b>（不是相加）。' },

    /* 計算題 */
    { id: 'c1', t: 'calc', no: 10, q: '（自編）充電效率 92%、電池 95%、逆變器 97%、馬達 93%，總效率是多少 %？', fig: 'eff', v: 78.8, unit: '%',
      steps: ['總效率 ＝ 各段相乘', '0.92 × 0.95 ＝ 0.874', '0.874 × 0.97 ≈ 0.8478', '0.8478 × 0.93 ≈ 0.788 ＝ <b>78.8%</b>'] },
    { id: 'c2', t: 'calc', no: 10, q: '（自編）接上題，電網送出 100 kWh，最後有多少 kWh 推動車子？', fig: 'eff', v: 78.8, unit: 'kWh',
      steps: ['剩下 ＝ 輸入 × 總效率', '100 × 0.788 ≈ <b>78.8 kWh</b>，其他約 21.2 kWh 變成熱'] },
    { id: 'c3', t: 'calc', no: 10, q: '（自編）總效率 80%，充電 90%、馬達 95%，電池這一段效率是多少 %？', fig: 'eff', v: 93.6, unit: '%',
      steps: ['總 ＝ 充電 × 電池 × 馬達', '電池 ＝ 0.80 ÷ (0.90 × 0.95)', '＝ 0.80 ÷ 0.855 ≈ 0.936 ＝ <b>93.6%</b>'] },
    { id: 'c4', t: 'calc', no: 11, q: '30 kW 用 48 V 傳，線路電阻 3 mΩ，線損約多少 W？', fig: 'linel', v: 1172, unit: 'W',
      steps: ['I ＝ P ÷ V ＝ 30000 ÷ 48 ＝ 625 A', '損失 ＝ I²R ＝ 625² × 0.003', '＝ 390625 × 0.003 ≈ <b>1172 W</b>'] },
    { id: 'c5', t: 'calc', no: 11, q: '同樣 30 kW、3 mΩ，改用 350 V 傳，線損約多少 W？', fig: 'linel', v: 22.0, unit: 'W',
      steps: ['I ＝ 30000 ÷ 350 ≈ 85.7 A', '損失 ＝ 85.7² × 0.003 ≈ <b>22 W</b>', '比 48 V 少了約 50 倍'] },
    { id: 'c6', t: 'calc', no: 12, q: '（自編）四顆 12 V 電池串聯，總電壓是多少 V？', fig: 'batt', v: 48, unit: 'V',
      steps: ['串聯電壓相加', '12 × 4 ＝ <b>48 V</b>（並聯的話還是 12 V）'] },

    /* 選擇題（第一個是正解，出題時會打亂） */
    { id: 'm1', t: 'mc', no: 1, q: 'BEV 是哪一種車？', o: ['純電動車（只靠電池）', '插電式混合動力車', '混合動力車（不插電）', '增程型電動車'], fig: 'cls', ex: 'B ＝ Battery，只靠電池。' },
    { id: 'm2', t: 'mc', no: 1, q: 'PHEV 的 P 是什麼意思？', o: ['Plug-in：可以插電', 'Power：功率', 'Parallel：並聯', 'Petrol：汽油'], fig: 'cls', ex: 'P ＝ Plug 插頭：有引擎，也可以插電。' },
    { id: 'm3', t: 'mc', no: 1, q: 'E-REV 增程型電動車的引擎主要用來做什麼？', o: ['發電，延長行駛里程', '直接推車輪', '冷卻電池', '只給 12 V 系統用'], fig: 'series', ex: 'E ＝ Extended 延長：引擎只發電。' },
    { id: 'm4', t: 'mc', no: 4, q: '把電池的直流電轉成馬達用的交流電，靠哪個設備？', o: ['逆變器', 'DC-DC 轉換器', '車載充電器', '變速箱'], fig: 'conv', ex: '你講衝的「你」＝逆變器。' },
    { id: 'm5', t: 'mc', no: 4, q: '車燈等 12 V 系統的電從哪裡來？', o: ['高壓電池經 DC-DC 轉換器降壓', '逆變器', '直接接馬達', '車載充電器'], fig: 'conv', ex: '你講衝的「講」＝降壓（DC-DC）。' },
    { id: 'm6', t: 'mc', no: 5, q: 'ω＋、T−（第四象限）代表什麼？', o: ['前進再生煞車', '前進驅動', '倒車驅動', '倒車煞車'], fig: 'quad', ex: '異號 → P− → 吐電：前進中煞車回充。' },
    { id: 'm7', t: 'mc', no: 5, q: 'P = T × ω 是負的，代表馬達在做什麼？', o: ['當發電機，把動能變電能回充', '耗電推動車子', '停止不動', '過熱保護'], fig: 'quad', ex: '正吃電、負吐電。' },
    { id: 'm8', t: 'mc', no: 6, q: '弗萊明左手定則用在哪裡？', o: ['馬達', '發電機', '電池', 'DC-DC 轉換器'], fig: 'fleming', ex: '左馬右發。' },
    { id: 'm9', t: 'mc', no: 6, q: '弗萊明定則裡，食指代表什麼？', o: ['磁場方向', '電流方向', '運動方向', '電壓方向'], fig: 'fleming', ex: 'FBI：拇 F、食 B、中 I，B 是磁場。' },
    { id: 'm10', t: 'mc', no: 9, q: '引擎只負責發電、只有馬達推車輪的是哪一種架構？', o: ['串聯式', '並聯式', '功率分配式', '啟停系統'], fig: 'series', ex: '串＝引擎當發電機。' },
    { id: 'm11', t: 'mc', no: 9, q: '用行星齒輪把引擎動力分出去的是哪一種架構？', o: ['功率分配式', '串聯式', '並聯式', '純電動'], fig: 'split', ex: '分＝行星齒輪分蛋糕。' },
    { id: 'm12', t: 'mc', no: 8, q: '可以只用電行駛、但不能插座充電的是哪一級？', o: ['重度混合', '中度混合', '啟停系統', '插電式混合'], fig: 'levels', ex: '停、助、純、插：「純」＝重度。' },
    { id: 'm13', t: 'mc', no: 11, q: '傳同樣的功率，電壓提高，線損會？', o: ['變小', '變大', '不變', '先變大再變小'], fig: 'linel', ex: '電壓高 → 電流小 → I²R 小。' },
    { id: 'm14', t: 'mc', no: 12, q: '需要高電壓時，電池要怎麼接？', o: ['串聯', '並聯', '串並都一樣', '只用一顆'], fig: 'batt', ex: '串高壓、並大流。' },
    { id: 'm15', t: 'mc', no: 10, q: '從充電到馬達，總效率怎麼算？', o: ['每一段效率相乘', '每一段效率相加', '取平均', '取最小那一段'], fig: 'eff', ex: '一段一段乘，越乘越小。' },
    { id: 'm16', t: 'mc', no: 13, q: '歐盟 ELV 廢車輛指令要求回收再利用多少？', o: ['95%', '50%', '75%', '100%'], fig: 'common', ex: '95 救我。' },
    { id: 'm17', t: 'mc', no: 13, q: '講義表 1.3，第一年總成本哪一種最低？', o: ['BEV 純電動車', 'ICE 燃油車', 'PHEV 插電式', '三種一樣'], fig: 'common', ex: 'BEV 8,995 英鎊，比 ICE、PHEV 的 9,760 低。' },
    { id: 'm18', t: 'mc', no: 13, q: '自動駕駛分成幾級？', o: ['0～5 級', '1～3 級', '1～10 級', '0～3 級'], fig: 'common', ex: '0 到 5 自駕，5 ＝ 全自動。' },
    { id: 'm19', t: 'mc', no: 13, q: '對電動車來說，「高電壓」是指直流超過多少？', o: ['60 V', '12 V', '220 V', '1000 V'], fig: 'common', ex: '60 伏算高壓。' },
    { id: 'm20', t: 'mc', no: 2, q: '電動車馬達的扭矩特性是？', o: ['一起步就有 100% 扭矩', '要高轉速才有扭矩', '起步沒有扭矩', '只有一半扭矩'], fig: 'adv', ex: '起步就衝，加速好。' }
  ];

  /* ---------- 畫面 ---------- */
  var LS = 'ee-evmk:';
  function lsGet(k) { try { return localStorage.getItem(LS + k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v) { try { localStorage.setItem(LS + k, v); } catch (e) {} }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function figs(it) { return '<div class="mk-fig">' + F[it.fig]() + (it.fig2 ? F[it.fig2]() : '') + '</div>'; }
  var TAG = { draw: '✏️ 畫圖', write: '⌨️ 寫字／打字', calc: '🧮 計算', mc: '☑️ 選擇' };
  var REF = '<a class="mk-ref" href="review.html#k' + '{n}' + '">回重點 {n} 複習</a>';

  function card(it, i) {
    var h = '<div class="mk-card" id="mk-' + it.id + '"><div class="mk-h"><span class="mk-tag mk-' + it.t + '">' + TAG[it.t] + '</span><span class="mk-no">第 ' + (i + 1) + ' 題</span></div><p class="mk-q">' + it.q + '</p>';
    if (it.t === 'draw') h += '<div class="pad"></div><button class="btn mk-show" type="button">看答案</button>';
    if (it.t === 'write') h += '<textarea class="mk-ta" rows="4" placeholder="打字作答（會自動存）；或按下面「✍ 改用手寫」"></textarea><div class="mk-bar"><button class="btn mk-hand" type="button">✍ 改用手寫</button><button class="btn mk-show" type="button">對答案</button></div><div class="pad mk-hpad"></div>';
    if (it.t === 'calc') h += '<div class="mk-bar"><input class="mk-in" type="number" step="any" inputmode="decimal" placeholder="答案"> <span>' + it.unit + '</span><button class="btn mk-show" type="button">對答案</button></div>';
    if (it.t === 'mc') {
      var ord = shuffle(it.o.map(function (_, k) { return k; }));
      h += '<div class="mk-opts">' + ord.map(function (k, j) { return '<button class="mk-opt" type="button" data-k="' + k + '">' + 'ABCD'[j] + '. ' + it.o[k] + '</button>'; }).join('') + '</div>';
    }
    return h + '<div class="mk-ans" hidden></div></div>';
  }
  function answer(it, el, extra) {
    var a = el.querySelector('.mk-ans'), h = extra || '';
    if (it.t === 'draw') h += '<div class="mk-ok">✅ 對照：</div><ul class="mk-chk">' + it.chk.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>';
    if (it.t === 'write') h += '<div class="mk-ok">✅ 範例答案（藍字一定要寫到）</div><p class="mk-model">' + it.ans + '</p>';
    if (it.t === 'calc') h += '<ol class="mk-steps">' + it.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>';
    if (it.t === 'mc') h += '<p class="mk-model">✅ 答案：<b>' + it.o[0] + '</b>　' + it.ex + '</p>';
    h += figs(it) + REF.replace(/\{n\}/g, it.no);
    a.innerHTML = h; a.hidden = false;
  }
  function kwCheck(it, txt) {
    var t = txt.toLowerCase(), hit = 0, chips = it.kw.map(function (alts) {
      var ok = alts.some(function (w) { return t.indexOf(w.toLowerCase()) >= 0; });
      if (ok) hit++;
      return '<span class="mk-kw ' + (ok ? 'y' : 'n') + '">' + (ok ? '✓ ' : '✗ ') + alts[0] + '</span>';
    }).join('');
    return '<div class="mk-score">關鍵字寫到 <b>' + hit + ' / ' + it.kw.length + '</b>' + (txt.trim() ? '' : '（沒打字的話自己對照下面答案）') + '</div><div class="mk-kws">' + chips + '</div>';
  }
  function pad(host, id) { if (host && !host.dataset.on && window.__ANN && window.__ANN.pad) { host.dataset.on = 1; window.__ANN.pad(host, 'evmk-' + id); } }

  function build() {
    var root = document.getElementById('mk-root'); if (!root) return;
    var groups = [['draw', '✏️ 畫圖題', '在框裡畫（Pencil 直接畫），畫完按「看答案」對照。'], ['write', '⌨️ 寫字題', '打字或手寫都可以；按「對答案」會檢查你寫到幾個關鍵字。'], ['calc', '🧮 計算題', '輸入數字，誤差 1% 內算對。'], ['mc', '☑️ 選擇題', '點一個選項就會對答案。']];
    var html = '', n = 0;
    groups.forEach(function (g) {
      var items = Q.filter(function (q) { return q.t === g[0]; });
      html += '<section class="sec mk-sec" id="sec-' + g[0] + '"><h2>' + g[1] + '<span class="h2-en">' + g[0].toUpperCase() + '</span></h2><p class="mk-hint">' + g[2] + '</p>';
      items.forEach(function (it) { html += card(it, n++); });
      html += '</section>';
    });
    root.innerHTML = html;
    Q.forEach(function (it) {
      var el = document.getElementById('mk-' + it.id);
      if (it.t === 'draw') pad(el.querySelector('.pad'), it.id);
      if (it.t === 'write') {
        var ta = el.querySelector('.mk-ta'); ta.value = lsGet(it.id);
        ta.addEventListener('input', function () { lsSet(it.id, ta.value); });
        if (lsGet('h:' + it.id)) pad(el.querySelector('.mk-hpad'), it.id);
        el.querySelector('.mk-hand').addEventListener('click', function () { lsSet('h:' + it.id, '1'); pad(el.querySelector('.mk-hpad'), it.id); });
      }
      var sh = el.querySelector('.mk-show');
      if (sh) sh.addEventListener('click', function () {
        var ex = '';
        if (it.t === 'write') ex = kwCheck(it, el.querySelector('.mk-ta').value);
        if (it.t === 'calc') {
          var v = parseFloat(el.querySelector('.mk-in').value), ok = isFinite(v) && Math.abs(v - it.v) <= Math.abs(it.v) * 0.01 + 0.05;
          ex = '<div class="mk-res ' + (isFinite(v) ? (ok ? 'y' : 'n') : '') + '">' + (isFinite(v) ? (ok ? '✓ 對了！' : '✗ 再看一下，') : '') + '答案 ≈ <b>' + it.v + ' ' + it.unit + '</b></div>';
          el.classList.toggle('mk-right', ok); el.classList.toggle('mk-wrong', isFinite(v) && !ok);
        }
        answer(it, el, ex);
      });
      if (it.t === 'mc') el.querySelectorAll('.mk-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          var ok = b.dataset.k === '0';
          el.querySelectorAll('.mk-opt').forEach(function (x) { x.classList.remove('right', 'wrong'); if (x.dataset.k === '0') x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          el.classList.toggle('mk-right', ok); el.classList.toggle('mk-wrong', !ok);
          answer(it, el);
        });
      });
    });
  }
  window.__EVMK = { Q: Q, F: F };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
