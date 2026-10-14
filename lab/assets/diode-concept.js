/* ============================================================
   電子實習 第三章 二極體特性 — 觀念填充（自編練習，不用計算）
   三組各 8 題：原理（p.2–3）、特性曲線（p.4）、實驗（課堂＋PSpice）
   選項正解寫第一個，hw.js 會打亂；選項不能有 <sub>／底線（S() 會自動拿掉底線）。
   ============================================================ */
(function () {
  'use strict';
  const S = o => ({ o: o.map(x => x.replace(/_/g, '')), a: 0 });
  const sub = t => t.replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>');
  const items = [];
  const K = (sec, n, link, title, q, en, b, ex, how) =>
    items.push({ id: 'dd-' + ({ '原理': 'a', '特性': 'b', '實驗': 'c' })[sec] + n, kind: 'cf', sec, no: sec + '-' + n, how: !!how, link, title: sub(title), q: sub(q), en: sub(en), b, ex: sub(ex) });
  const LA = 'diode.html#pn', LB = 'diode.html#iv', LC = 'diode.html#exp';

  K('原理', 1, LA, '二極體是什麼', '二極體由 {0} 接合而成，是允許電流 {1} 的雙端元件。', 'A diode is made of ___ and lets current flow ___.',
    [S(['P 型和 N 型半導體 p- and n-type semiconductor', '兩塊金屬 two metals', '電容和電阻 a capacitor and a resistor', '兩塊 N 型 two n-type pieces']), S(['單方向流動 in one direction only', '雙向一樣大 equally both ways', '只在交流時 only for AC', '完全不 not at all'])],
    '講義 p.2：PN 接面半導體，電流單方向流動。');
  K('原理', 2, LA, '陽極與陰極', 'P 側叫 {0}，N 側叫 {1}。', 'The p side is the ___ and the n side is the ___.',
    [S(['陽極 anode', '陰極 cathode', '閘極 gate', '基極 base']), S(['陰極 cathode', '陽極 anode', '射極 emitter', '汲極 drain'])], '陽極 A（+）、陰極 K（−）。電路符號三角形指向陰極。');
  K('原理', 3, LA, '色環', '實物二極體上有色環的那端是 {0}。', 'The banded end of a real diode is the ___.',
    [S(['陰極 cathode', '陽極 anode', '正極 positive terminal', '沒有意義 meaningless'])], '色環對應符號上那條槓（陰極）。接錯方向就變成反偏。');
  K('原理', 4, LA, '順偏怎麼接', '順偏時，陽極接電源 {0}、陰極接電源 {1}。', 'In forward bias the anode goes to the ___ terminal and the cathode to the ___ terminal.',
    [S(['正 positive', '負 negative', '地 ground only', '交流 AC']), S(['負 negative', '正 positive', '交流 AC', '空接 open'])], '講義圖 3.4(a)。順著三角形的方向推電流。');
  K('原理', 5, LA, '順偏電流', '順偏時電流 I = {0}。', 'In forward bias, I = ___.',
    [S(['(V − V_D) / R', 'V / R', 'V_D / R', '(V + V_D) / R'])], '電阻上的電壓是 V − V_D（講義 p.3）。', true);
  K('原理', 6, LA, '反偏', '反偏時電流 {0}，二極體兩端電壓 {1} 電源電壓。', 'In reverse bias the current is ___ and the diode voltage is ___ the supply.',
    [S(['幾乎為零 nearly zero', '很大 very large', '等於 V/R equal to V/R', '跟順偏一樣 same as forward']), S(['約等於 about equal to', '遠小於 much less than', '兩倍於 twice', '一半於 half of'])], '電阻沒電流就沒壓降，電壓全落在二極體上（講義圖 3.4(b) V_D = V）。');
  K('原理', 7, LA, '限流電阻', '電路串一顆電阻的目的是 {0}。', 'The series resistor is there to ___.',
    [S(['限制二極體導通後的電流 limit the current after turn-on', '讓二極體反偏 reverse-bias the diode', '提高切入電壓 raise the cut-in voltage', '量電壓 measure voltage'])], '導通後二極體只吃約 0.7 V，其餘電壓要靠電阻扛，否則電流會太大燒掉。');
  K('原理', 8, LA, '單向旋轉門', '把二極體比喻成 {0} 最貼切。', 'A diode is best compared to ___.',
    [S(['單向旋轉門 a one-way turnstile', '水龍頭 a faucet', '水塔 a water tower', '電池 a battery'])], '一個方向推得過，反方向卡住。');

  K('特性', 1, LB, '方程式', '二極體方程式是 I = {0}。', 'The diode equation is I = ___.',
    [S(['I_S(e^(V/ηV_T) − 1)', 'V / R', 'I_S × V', 'I_S(1 − e^(V/V_T))'])], '講義 p.4。順偏時 e 項主導，反偏時 I → −I_S。');
  K('特性', 2, LB, 'I_S', 'I_S 叫做 {0}，數值 {1}。', 'I_S is the ___ and its value is ___.',
    [S(['逆向飽和電流 reverse saturation current', '順向電流 forward current', '崩潰電流 breakdown current', '短路電流 short-circuit current']), S(['非常小 very small', '很大 very large', '等於 1 A exactly 1 A', '隨電壓指數增加 exponential in voltage'])], '反偏時只剩少數載子造成的極小電流。');
  K('特性', 3, LB, 'η', '講義說 η 矽取 {0}、鍺取 {1}；實際元件通常在 1～2 之間。', 'The slides take η = ___ for Si and ___ for Ge; real devices are usually between 1 and 2.',
    [S(['2', '1', '0.5', '10']), S(['1', '2', '0.2', '0.6'])], '講義 p.4。你的 1N4004 擬合出 η ≈ 1.78。');
  K('特性', 4, LB, '熱電壓', 'V_T = {0}，27 °C 時約 {1}。', 'V_T = ___, which is about ___ at 27 °C.',
    [S(['(273 + T)/11600', 'T/273', '11600/T', '0.7 V 固定']), S(['26 mV', '0.6 V', '2.6 V', '1 V'])], '講義 p.4：(273 + 27)/11600 = 0.0259 V。');
  K('特性', 5, LB, '切入電壓', '切入電壓 V_r：矽約 {0}、鍺約 {1}。', 'Cut-in voltage V_r: Si about ___, Ge about ___.',
    [S(['0.6 V', '0.2 V', '1.2 V', '5 V']), S(['0.2 V', '0.6 V', '0.05 V', '1 V'])], '講義 p.4。鍺的能隙小，門檻低。');
  K('特性', 6, LB, '指數', '順偏過了切入電壓後，電流隨電壓 {0} 增加。', 'Above cut-in, the forward current increases ___ with voltage.',
    [S(['指數地 exponentially', '線性地 linearly', '平方地 quadratically', '不會 not at all'])], '你的數據：每 ×10 約多 0.1 V。');
  K('特性', 7, LB, '反偏電流', '反偏電壓從 5 V 加到 30 V，逆向電流 {0}。', 'From 5 V to 30 V reverse, the reverse current ___.',
    [S(['幾乎不變（飽和）stays almost constant', '線性增加 rises linearly', '指數增加 rises exponentially', '變成負無限大 diverges'])], '所以叫「飽和」電流；你量到都是 0.000～0.003 mA。');
  K('特性', 8, LB, '崩潰', '反向電壓超過 {0}，電流會突然大增。1N4004 的額定反向耐壓約 {1}。', 'Above the ___, the reverse current rises sharply. The 1N4004 is rated for about ___.',
    [S(['崩潰電壓 breakdown voltage', '切入電壓 cut-in voltage', '熱電壓 thermal voltage', '峰值電壓 peak voltage']), S(['400 V', '30 V', '0.6 V', '5 V'])], '本實驗只加到 30 V，遠低於 400 V，所以看不到崩潰。');

  K('實驗', 1, LC, '量電流', '量二極體電流 A1：電表切 {0}，{1} 在迴路中。', 'To measure A1, set the meter to ___ and connect it ___.',
    [S(['DCA', 'DCV', 'ACV', 'Ω']), S(['串聯 in series', '並聯 in parallel', '跨在電源上 across the supply', '不用接 unconnected'])], '電流要穿過電表；電流檔並聯等於短路，會燒保險絲。');
  K('實驗', 2, LC, '量電壓', '量二極體電壓 Vd：電表切 {0}，{1} 在二極體兩端。', 'To measure Vd, set the meter to ___ and connect it ___ the diode.',
    [S(['DCV', 'DCA', 'ACA', 'Ω']), S(['並聯 across', '串聯 in series with', '串在電源前 before the supply', '接地 to ground only'])], '電壓是兩點之間的差，所以並聯。');
  K('實驗', 3, LC, 'Excel 的軸', '順偏特性曲線：X 軸 {0}、Y 軸 {1}。', 'Forward curve: X = ___, Y = ___.',
    [S(['Vd', 'Vi', 'A1', '時間']), S(['A1', 'Vd', 'Vi', 'R'])], '講義 p.5：X-Vd、Y-A1。');
  K('實驗', 4, LC, '順偏怎麼調', '順偏調 Vi 時要 {0}，因為過了切入電壓電流會一下子衝很快。', 'When raising Vi in forward bias, go ___, because the current shoots up past cut-in.',
    [S(['慢慢調 slowly', '一次調到 30 V all the way to 30 V', '先反接 reversed first', '快速來回 back and forth quickly'])], '你的心得也寫了：0.6 V 以後很難剛好調到要的電流。');
  K('實驗', 5, LC, '反偏電流讀值', '反偏量到 0.001～0.003 mA，比較合理的解讀是 {0}。', 'A reverse reading of 0.001–0.003 mA most likely means ___.',
    [S(['已經到電表最後一位，真正的電流可能更小 it is at the meter’s resolution; the true current may be smaller', '二極體壞掉 the diode is broken', '接成順偏 it was forward biased', '電阻太大 the resistor is too large'])], '50 mA 檔最小解析度 0.001 mA；1N4004 的逆向電流通常是 nA～μA 等級。');
  K('實驗', 6, LC, '反偏 Vd', '反偏時 Vd {0} Vi，因為 {1}。', 'In reverse bias Vd ___ Vi because ___.',
    [S(['約等於 ≈', '遠小於 ≪', '約一半 ≈ half of', '約兩倍 ≈ twice']), S(['電流幾乎為零，電阻沒壓降 no current, no drop across R', '二極體導通 the diode conducts', '電表內阻很大 the meter is ideal', '電源有內阻 the source has resistance'])], '你的數據：20 V → 19.997 V。');
  K('實驗', 7, 'diode.html#pspice', 'PSpice 分析', 'PSpice 畫 I-V 曲線選 {0} 分析，掃描對象是 {1}。', 'In PSpice choose ___ analysis, sweeping ___.',
    [S(['DC Sweep', 'Time Domain', 'AC Sweep', 'Bias Point']), S(['電壓源 V1 the voltage source V1', '電阻值 the resistor', '溫度 temperature', '頻率 frequency'])], '講義 p.8：DC Sweep → Voltage Source → V1、Linear。');
  K('實驗', 8, 'diode.html#pspice', 'PSpice X 軸', 'PSpice 跑完預設 X 軸是電源電壓，要改成 {0} 才是 V-I 曲線。', 'By default the X axis is the source voltage; change it to ___ for the V-I curve.',
    [S(['二極體電壓 V(D1:1) the diode voltage', '電阻電壓 the resistor voltage', '時間 time', '電流 I(D1)'])], '講義 p.11：Plot → Axis Settings → Axis Variable → V(D1:1)。');

  window.__DIC = { name: 'diodec', items };
})();
