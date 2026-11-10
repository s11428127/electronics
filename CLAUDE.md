# 這個 repo 的固定做法（每次收到新講義都照這個走）

使用者是電機系大二學生，會**持續**丟各科講義（電子學／電路學／工程數學）過來。
目標是把講義變成「看得懂、動得了」的互動網頁，不是投影片截圖的複製品。

## 每次收到新講義的標準流程

1. **先讀完講義**（PDF 用 `pdftotext -layout`；圖片直接看）。
2. **檢查內容有沒有寫錯** —— 使用者會要求這件事。公式、符號、正負號都要驗算過再回報。
   不確定的（手寫看不清楚）要說「請確認」，不要斷言。
3. 找出這份講義屬於哪一科、哪一章，更新該科 `docs/CONTENT_MAP.md` 與首頁課程地圖。
4. 依下面的「章節頁規格」寫內容。
5. **驗證**：起 `npx http-server -p 8099 -s .`，用 Playwright 在 **320 / 390 / 680 / 1180** 四種
   寬度載入，確認：無 console 錯誤、無水平捲動、測驗可互動。
6. commit + push 到指定分支，然後**重新發佈 artifact**（同一個 URL，用 art2 bundle；
   `files` 要帶上改過的頁面與 shared 檔；不要傳 `capabilities`，沿用已存的 db／user／downloads）。

## 章節頁規格（每一節都要有，缺一不可）

順序固定：

1. **小節標題 + 一段白話導言**（這一節到底在解決什麼問題）
2. **`.eq` 結論公式**
3. **`.derive` 逐步推導** —— 每一步都是「算式 + 一句話說為什麼要這樣做」。
   **不可以只給結論**。使用者明確說過「講得太抽象」，推導是必要的。
4. **`.bench` 互動模組** —— canvas 動畫／可拖曳／小遊戲。抽象的觀念要用動畫講。
5. **可互動例題** —— 用 `__EE.liveExample('#id', {...})`，**不要寫死的靜態例題**。
   使用者抱怨過「例題好抽象」：只把數字算給他看是不夠的，他要能**自己改數字**。
   ```js
   liveExample('#ex-xxx', {
     title: '例題 · 標題',
     givens: [{ id:'g1', label:'已知條件', min, max, step, value, fmt: v=>'…' }],
     compute: g => ({ ...算出來的東西 }),
     question: (g,r) => '題幹（數字用 r 帶入）',
     steps:    (g,r) => [{ t:'Step 1　做什麼。', note:'為什麼', eq:'算式' }],
     answer:   (g,r) => '答案',
     draw:     (ctx,w,h,g,r) => {}   // 選用：配一張跟著變的圖
   });
   ```
   - 題目預設值用**課本原始例題**（可對答案），但滑桿要讓他能推到極端去看會發生什麼事。
   - 結論那一步要**隨數字改變講法**（例如近似成不成立、該不該忽略某項）。
   - 抽象的量（濃度、數量級、功率比）盡量配一張 `draw` 的圖，把「差幾個 0」變成看得見的距離。
6. **`.howto` 解題步驟** —— 拿到這類題目的標準流程。
7. **`.pitfall` 常見錯誤** —— 用 `<span class="x">✗</span>` / `<span class="o">✓</span>` 標示。
8. 章末：**名詞中英對照表 `.glossary`** + **中英對照小測驗**。

## 閱讀偏好（使用者 10/12）

- 使用者說「講義字太多讀不下去，**故事的方法很適合我**」。新內容一律**故事優先**：導言、說明都寫短，一段不超過兩三句；能畫的就畫進故事或互動模組。
- **推導已全站改成故事卡**（`shared/app.js` 最後一段）：`.derive` 每一步只露出算式＋第一句白話，長說明收進「看詳細」，按「下一步」（或點目前那張卡）才出下一張；寫筆記模式自動全部攤開。寫 `.why` 時**第一句就要是重點**（第一句會被拿來當白話，16 字以內的句子會連下一句一起顯示）。
- 加的按鈕都是 `.dv-ui`（annot.js 的 `EXCL` 有它，不影響筆跡錨點）。
- **電路學講義收合（使用者 10/18：要跟工數一樣字少）**：`shared/app.js` 最後一段，只套 `data-subject="circuits"` 且有 `.derive` 的講義頁 —— 可調數字例題 `.example.live` 一次一步（`ex:render` 事件讓拉滑桿重算時保留看到第幾步，答案最後才出現）；`section.sec > p`、`.note`、`.lede`、hero `.sub` 超過 70 字只露第一句＋「看詳細」。寫筆記模式全部攤開。

## 電腦版排版（10/12）

- `shared/app.css`、`shared/story.css` 檔尾有「電腦版放大」區塊（≥ 1200 px 字 ×1.14、版寬 1400；≥ 1600 px 字 ×1.24、版寬 1560），由 `tools/desktop-css.py` **自動產生**：改了 CSS 裡的 font-size 或新增元件後，重跑 `python3 tools/desktop-css.py shared/app.css shared/story.css`，不要手改那一段。新 CSS 規則要加在那個區塊**前面**。

## 故事模式（每一章都要有）

使用者看過電子學 CH1 PART 1 後確認：**節奏、大小都 OK，所有章節（三科）都要加**。做法是：
**每章開頭一段「故事模式」**（一次一個畫面、一句字幕、點一下或滑一下前進、可自動播放、
不配音），**下面原本的推導／互動／例題／測驗全部保留**，並套同一套乾淨外觀（`data-look="clean"`、
每個 h2 加 `<span class="h2-en">ENGLISH</span>`）。

- 引擎：`shared/story.js`（`__Story('#story', {id, title, after, scenes})`）+ `shared/story.css`。
  每章的劇本放在 `<subject>/assets/<chapter>-story.js`。
- 一個 scene = `{ t: 中文標題, en: 'ENGLISH TITLE', svg: 畫面, steps: [...] }`；
  每個 step = `{ sub: '一句字幕', on, off, mv: {key:[dx,dy,scale]}, cls, op, txt }`。
  有 `data-k` 的元素一開始隱藏，由 steps 累加控制（往前、往後、跳段落都一致）。
- 畫面座標固定 `viewBox 0 0 640 400`；上方約 70 留給標題卡、下方約 60 留給字幕，
  **圖畫在 y 75～330 之間**。
- 視覺語彙（照影片）：只用「墨色 + 一個藍」；電子＝實心藍點、電洞＝虛線藍圈、
  原子＝黑底白字圓；說明用 `chip()` 小標籤；顏色一律用 CSS class（`.e .h .ln .t .ta…`），不寫死色碼。
- **`lattice()` 只會替 `opt.keyed` 列出的原子／電子個別加 key**；全部加 key 的話整片晶格會隱形
  （踩過的坑）。要讓某顆電子動，用 `skip` 把它從晶格拿掉、另外畫一顆有 key 的。
- 持續動畫（`shake` `pulse` `conv` `flow`）作用在 **子元素**，不要跟 `mv` 用在同一個元素上。
- 劇本寫法：開頭丟一個**用講義數字做成的謎題**，中間一步一步建立觀念（多用生活比喻），
  最後一段「恍然大悟」回頭解謎，再預告下一段。字幕一句話、口語、數字跟講義一致。
- **難度要跟 PART 1 一樣淺**（使用者說 PART 2～4 第一版「太難」）：
  - 一個畫面只講一件事，每個新觀念先給**生活比喻**（椅子、收費站、捷運車廂、擋板、旋轉門、水塔），
    再畫半導體裡的樣子，**最後**才放公式和數字。
  - 新段落先**複習上一段**一兩個畫面再往下走。
  - 觀念講完、公式出場前，放一個「先整理一下」畫面當分水嶺。
  - 字幕避免一句塞兩個新名詞；新名詞第一次出現要用白話解釋它在幹嘛。
  - 每段大約 17～21 個畫面、70～90 步。
- **使用者說某一步之後聽不懂**：在那一步前面插一段「先補課」畫面（先講生活例子，再講電路；最後一幕「先整理一下」接回原本劇情），頁面上同時加一節 `#basics` 式的補課小節（照章節頁規格）。例：電路學 CH11 PART 1 的 K1～K12、CH12 PART 1 的 K1～K11（Y-Y 實際怎麼接，10/18）。電子學 CH1 PART 6 的 K1～K5（小訊號圖怎麼讀，10/31：曲線右上、電壓波形畫在橫軸下面、電流波形畫在縱軸左邊——**交流在曲線上的意思一定要畫成這種完整的圖**，不要只畫一個框）。
- **講接法、電路結構要先講實物**（使用者 10/18：Y-Y「實際長什麼樣子」太抽象）：先畫實體（線圈頭尾、電線桿、接線盒、電錶夾哪兩點），再「拉直」成課本的梯子圖。
- **題目先（使用者 10/20：「觀念講太抽象，題目有電路圖比較懂」）**：CH12 PART 2 主故事改成直接走課本 Example（`__CH12EX` 那幾題的圖解故事串起來＋每題一幕「這題學到什麼」＋最後「三題比一比」），原本觀念版故事移到頁尾 `#story2`。頁面 `<body class="prob-first">`＋小節加 `.pf`：CSS `order` 把 `.exbook` 排到 h2 後面（只改視覺順序、不動 DOM，筆跡不移位），hero 有「排列」切換（localStorage `ee-pf-ch12p2`）。之後覺得抽象的章節照這招。
- **名詞一定要配圖（使用者 10/20：相電壓、線電壓、電流全部搞混，介紹要附電路圖）**：CH12 的名詞圖鑑 `circuits/assets/ch12-terms.js`（`__CH12T`）——每個名詞一張電路圖，圖上標出「它是哪裡」（電錶夾哪兩點、電流箭頭在哪條線）。頁面 `<div class="tpic" data-set="p1～p4">`（每頁故事下面一節 `#terms-pic`）；故事用 `__CH12T.scenes([...])`（PART 2 題目版、PART 3 開頭）；名詞彈窗附圖用 `window.__TERMFIG[名詞] = () => svg`（`app.js` 的 term-pop 會顯示）。新章節照做：新名詞先畫圖卡。
- **觀念填充題考到的點，故事或講義一定要講過**（使用者 10/18）：新增填充題時逐題對照故事字幕與講義文字。
- 驗證：除了四種寬度，還要把每一步截圖拼成總表看過（標籤有沒有疊在一起、東西有沒有出現）。
- 同頁面加 `<body data-look="clean">` 會套用同一套乾淨外觀（標題卡 + 英文小字 `.h2-en`）。
- SVG 文字裡的 `<`、`>` 一定要寫成 `&lt;`、`&gt;`，否則整個畫面 parse 失敗（踩過的坑）。
- 下標用 `fx(['i','D',' = I','S'])` 這種寫法：下標後面的字要跟回基線的 tspan 放一起，空的 tspan 的 dy 不會生效。
- 現有劇本：電子學 `ch1-part1～7-story.js`、`ch1-part4-thermo-story.js`（§06 溫度計補課，11/1）（PART 6 原本一頁兩段，10/31 使用者要求把故事二和後半講義拆成 `ch1-part7.html`；共用 `ch1-part6.js`／`-ex.js`／`-concept.js`，測驗題 `p: 7` 給 PART 7）、`ch2-part1-story.js`、電路學 `ch11-part1～3-story.js`、`ch12-part1～4-story.js`、工數 `laplace-story.js`、`laplace2-story.js`、`ode-story.js`、電子實習 `diode-story.js`、`rectifier-story.js`、`filter-story.js`、`zener-story.js`、電子學期中考 2 重點 `mt2-story.js`（midterm2.html 開頭，14 幕，11/9）。
- 工數期中考（11/12 週三 19:00，可帶小抄）：`engineering-math/midterm.html`＝其他班考古題 13 小題逐步詳解（`assets/mid-ex.js` → `__EMMID`，五種題型 t1～t5，sympy 驗算）＋開頭故事 `assets/mid-story.js`（17 幕：翻譯機 t 世界↔s 世界、字典、兩種位移、拆開／配方、ODE、電路換裝、摺積火車過月台）＋工具箱＋朋友筆記勘誤。使用者說「看懂題目後再寫小抄」。
- 版面實測（看截圖總表得到的）：標題卡蓋到約 y 92（x 200～440），兩行字幕從約 y 312 開始，最後一幕的「從頭再看／往下看」按鈕在 y 285 以下 → **內容放 y 100～305，最後一幕放到 270 為止**。

## 上課筆記（板書照片）的做法

使用者會在上課時分批傳**黑板照片**（加 iPad 筆記截圖）。規則：

- **等他說「這是今天所有內容／可以開始做了」才動手**；中途每批只回報驗算結果與「請確認」，不要先改網站。
- 一堂課產出兩樣東西：
  1. **純板書上課筆記** `<subject>/<chapter>-<MMDD>.html`（例：`laplace2-1002.html`）——
     照老師順序、**不加任何解釋**；寫錯的地方直接寫正確版，旁邊放
     `<button class="fix" type="button" data-was="原本寫的">更正</button>`（點開看原本）；
     板書沒寫的答案用 `<span class="add">補</span>` 標出。版面用 `.board` / `.bl`（`.in` 縮排、`.tx` 一般文字）。
  2. **章節重點頁**（故事模式＋推導＋互動＋測驗，照「章節頁規格」），hero 放
     `<div class="lec-links"><a href="<chapter>-<MMDD>.html">📝 M/D 上課筆記（純板書）</a></div>`，每堂課一個按鈕。
- 科目首頁**只放章節卡片**，不要替單堂筆記另開卡片；上課筆記從章節頁點進去。
- 一章內容太多就拆成 PART（電路學 CH11 10/4 拆成 part1～3，舊 `ch11.html` 留轉址頁）；拆頁時互動模組共用一支 `<chapter>.js`（沒有對應 canvas 就跳過），每頁另有 `<chapter>-partN.js`（例題＋測驗）。
- 使用者已經看過的章節不要動；同主題的新進度**開新的一章**（例：`laplace.html` 看過 → 10/2 開 `laplace2.html`）。
- 開頭「複習」若屬於別章的內容（例：共軛複根屬 ODE），只留在上課筆記，不放進本章重點。

## 作業題與考試範圍

- 作業題庫一份作業一個檔（例：`electronics/assets/hw1-bank.js`），作答元件 `shared/hw.js`：
  頁面放 `<div class="hw-list" data-hw="1,2,4"></div>` 就會長出「作業原題（紫標籤）＋ 仿作業（灰標籤、收在『再練 N 題』裡）」。
  作業原題的選項照作業原本順序；仿作業的選項會自動打亂。HW1 範圍內每題 10 題仿作業（10/4 從 5 題加到 10 題）。**下拉選項不能放 `<sup>`，次方用 ¹⁰ 這種上標字元。**
- 一定要分清楚「作業原題」和「自編練習」（使用者要求標註）。
- **作業計算題的電路圖照抄 HW 原檔（使用者 11/6）**：從作業 PDF 抽出圖（`pdfimages -j`）放 `electronics/img/hw/`，`assets/hw-img.js` 的 `MAP` 依題目 id 換上原圖（作業原題＋對應的仿作業；原圖有數字的仿題加註「數字以題目為準」）。選擇題、原檔沒圖的題不用。新作業進來照做，頁面在 sync.js 前載入 hw-img.js。
- 每題作業放進對應單元：該節 eyebrow 加 `<a class="hw-tag" href="#hw-qN">📝 HW1 第 N 題</a>`，章末加 `#hw` 區塊；
  另外做一頁 `<subject>/hwN.html` 考前總複習。
- 考試範圍：範圍內的章節 hero 放 `✓ 考試範圍` chip；範圍終點放 `.scope-end` 提示框，之後的節 eyebrow 加 `<span class="scope-no">還沒教到</span>`；
  故事模式在終點插一個「⛳ 考試範圍到這裡」畫面。還沒教到的作業題先不放，在總複習頁列出來。

- 課本練習題頁 `electronics/practice1.html`（題庫 `assets/ch1-practice.js` → `__CH1PR`，exbook 卡片，`tag` 自訂標籤如 'TYU 1.3'）：作業指定進階題、Exercise、TYU、章末習題、Review Questions；**題目先中文、下面 `.q-en` 放課本英文原文**（使用者 10/5 要求）。課本沒附答案的自己解、程式驗算。

## 考前複習頁（例：`electronics/midterm1.html`）

- 老師給的範例題組做成一頁：故事模式（約 10 個畫面，用題目數字走一遍）→ 題目與已知（可改數字面板，整條鏈一起重算）→ 每小題一張 `.xb-card.is-pp`
  （紫色「老師範例」標籤、手寫板 `__ANN.pad`、提示／看下一步／全部展開、答案＋「算對了／算錯了」，自動進錯題本）→ 公式總表 `.fs-row` → 觀念速查 `.mt-qa`。
- 參考解答一定要用程式驗算；跟參考解答一樣，每一步四捨五入到 3 位有效數字再帶下一步。
- 仿題組（`#sets`）：`makeSet(st, tw, opt)` 共用同一套五題模板 `makeQS`；變化點 `tw.q3`＝base｜sigma｜IA｜ein、`tw.q5`＝fwd｜rev。
  固定組 A～D 在 `SETS`（數字改了要用程式重算對過），🎲 隨機組用 `randomSet()`（N 只挑 ≥ 1000 nᵢ）。卡片標「仿題組 X／隨機仿題」，錯題本顯示「自編練習」。
- 新的複習頁要加進該科 `mistakes.html` 的 `data-chs`、科目首頁考試範圍提示框的 `.lec-links`。
- 故事模式的 SVG 文字現在支援 `<sub>…</sub>`（`supSvg` 同一招），不要再寫 `V_bi` 這種底線。

## 課本例題（Example）與練習題（Practice Problem）

- 使用者要求：**每一章的 Example 和 Practice Problem 都要整理**，放進章節頁的各小節最下面。
  題庫一章一檔（例：`circuits/assets/ch11-ex.js` → `window.__CH11EX`），元件 `shared/exbook.js`：
  `<div class="exbook" data-bank="__CH11EX" data-sec="11.2"></div>`。
- Example：照課本解法拆成「做什麼 + 算式 + 為什麼」，按「看下一步」一步步打開。
- **電路學所有例題題目都要有英文版在中文下面**（使用者 10/7 要求）：exbook 卡片寫 `en: '…'`（顯示在 `.xb-q` 裡的 `.q-en`）；可改數字例題 `liveExample` 加 `questionEn: (g, r) => '…'`（數字跟中文題幹用同一組變數）。新章節照做。
- Practice：題目＋**手寫板**（`__ANN.pad`，跟講義筆記同一支筆，不用進筆記模式就能寫，雲端同步；沒載 annot.js 才退回 `shared/pad.js`）；提示／答案／詳解先遮住。
  課本只給答案的，詳解自己解，**數值要用程式驗算**；跟課本答案有出入要寫 `note`。
- 電路圖一律用 `shared/schem.js` 重畫（`r l c z vs is wm wave`），不要截課本圖。
- 章節頁故事模式下方放「選小節」：`__EXB.picker(el, [{id, no, name, count}], {key, alwaysAll})`，選了只顯示那一節。
- 章末 Problems 使用者還沒要求，先不做。
- **例題圖解故事（使用者 10/10 要求，CH12 起每題都要）**：exbook item 加 `story: () => [scenes]`，卡片會多一顆「🎬 看圖解故事／圖解詳解」，按了才建 `__Story`（id `xb-<題目 id>`）。
  每題 3～6 幕：題目畫成圖 → 化簡（單相等效、換接法）→ 一步一步算（計算卡一行一行亮＋相量圖／功率三角形）→ 答案卡。最後一幕字幕要短（不然會被「從頭再看」按鈕蓋到）。
  CH11 的 36 題（10/18 補上）放在 `circuits/assets/ch11-ex-story.js`，依 id 掛到 `__CH11EX.items`（不動原題庫；用 `__RV` 的 `ckt()` 梯子電路、`zp()` 阻抗平面、`ptri()` 功率三角形）。三相用的畫圖工具在 `circuits/assets/ch12-kit.js`（`__K12`）；電子學二極體電路（I–V 座標、負載線、串聯迴路、波形）在 `electronics/assets/ch1-part5-kit.js`（`__K15`）。驗證：每題每一步截圖，再挑每幕最後一步拼總表看。

## 章末練習題（使用者 10/16，電路學 CH11 起）

- 使用者給課本章末題 PDF：**題號旁有 e⁷d（Design a problem）或 ＃ML（PSpice／MultiSim）圖示的不做**；只有綠色小筆電圖示的也不做。圖示是向量圖，用 `pdftotext -bbox` 找題號位置、裁圖拼總表人工確認。
- 一章一頁總複習 `<chapter>-problems.html`（不放進章節頁），題庫分幾個檔 `assets/<chapter>-probN.js` → `window.__CH11PB`（`concat`），每題 exbook `kind:'pp'`、`tag:'Problem 11.x'`／`'Review Question 11.x'`、`en` 英文原文、`fig` 用 schem.js 重畫、`steps` 逐步詳解、跟課本或題意有出入寫 `note`。
- schem.js 10/16 新增：`dvs`／`dis`（菱形相依電壓／電流源，垂直）、`dvsh`／`dish`（水平）、`opamp(x, y, {plusTop})`、`box(x, y, w, h, [多行字])`（負載方塊）。圖要截圖拼總表檢查標籤有沒有被裁掉（`S.svg` 寬度要留給右側標籤）。
- 新頁面加進 `mistakes.html` 的 `data-chs`、科目首頁 `.lec-links`、章節頁 hero `.lec-links`。
- **章末題圖解詳解（使用者 10/18）**：`circuits/assets/prob-story.js` 自動把 tag 以 `Problem` 開頭的題目（Review Question 不做）做成故事：題目圖（schem 圖嵌進故事畫面）→ 每幕 1～2 步（左圖右計算卡，字幕取 `why` 第一句）→ 答案卡。題庫寫 `steps` 時 `eq` 用「；」「⇒」分段，故事才切得漂亮。
- **章末題英文先（使用者 11/7）**：題庫設 `enFirst: true`（`exbook.js`），卡片題目顯示 `en`、中文 `q` 收進「中文翻譯」，`q` 裡的選項清單（`<ol>`）留在英文下面。CH11～14 的 `__CH1xPB` 都已設。
- **題型故事（使用者 11/10，刷題前看）**：`circuits/assets/types-story.js`（`__TypesStory`）＋每章資料 `chN-types.js`（`__TYPESN`：每種題型 長怎樣／公式／寫法＋最常錯），放在 ch11～14-problems.html 的 `#types-sec`（sec-pick 前）。**每題、每一步都要有圖（使用者 11/10：圖形比較好記，不要每步都同一張全電路）**：`chN-tyfig.js` 替每個題型掛 `wk = {id: 題庫 id, figs: [題目圖, 第 1 步圖, …]}`——每步畫該步對應的部分（短路電源、網目迴路、戴維寧等效、單相等效、相量圖、功率三角形、反射阻抗、T 等效、波形、dB 刻度），共用 `window.__TY`（HL 高亮、note、loop、ar、thev、phasor、tri）。**v3（使用者 11/10：先用講義 Example 複習，寫過的題目印象深）**：`chN-tyex.js` 設 `type.wks = [{bank:'__CHNEX', id, figs, fm, more}]`（`fm`＝每步用到的公式，顯示在計算卡 📐；`more`＝講義再練的 Practice），一型可以兩題（例 12.4＋12.5）；講義沒例題的型才留章末題（P12.45、P13.3、P14.7）；舊章末題故事用 `__TY.attach('__CHNPB', wks)` 搬進那題卡片的「🎬 圖解詳解」。12.10 兩瓦特計不考已從題型故事拿掉。problems 頁要多載 `chN-ex*.js`。
- 現有：電路學 `ch11-problems.html`（`ch11-prob1～3.js`，86 題）、`ch12-problems.html`（`ch12-prob1～2.js`，64 題；三相電路圖用 `__CH12PB.tp({src:'Y'|'D'|'gen', load:'Y'|'D', line, neutral})`）。節標題旁有圖示＝整節都跳過（CH12 的 12.9 PSpice）。

## 電路學期中考（使用者 11/5：考到 14.3，比較會考章末 Problems）

- 範圍 CH11 ～ 14.3。CH13 做三頁講義 `ch13-part1～3.html` ＋ `ch13-problems.html`（43 題）＋ `ch13-review.html`（CH13～14 觀念填充 72 題，`__CH13C` name `ch13c`）；CH14 做 `ch14-part1.html`（14.1～14.3，含 `.scope-end`「⛳ 考到這裡」）＋ `ch14-problems.html`（7 題）。詳細見 `circuits/docs/CONTENT_MAP.md`。
- 互感、變壓器電路圖用 `circuits/assets/ch13-kit.js`（`__K13.xf(x, y1, y2, {d1, d2, M, n, l1, l2})` 一組耦合線圈，`n` 有值就畫鐵心；`arcM`、`arc2` 互感弧）；故事用 `ch13-skit.js`（`__S13`）。點的位置一定要放大原圖確認再畫。
- 例題圖解故事：bank 設 `autoAll: true`，`prob-story.js` 會替 Example／Practice 全部自動產生（CH13EX、CH14EX）。
- 章末題照舊規則：e⁷d、＃ML、小筆電圖示的不做（使用者 11/5 再確認一次，即使 ML 題很多）。
- **不考的節（使用者 11/8）：12.9、12.10、13.8、13.9 不考、不用看、練習不用寫**。做法：`<section class="sec skip-sec">`（CSS `::before` 橫幅＋內容變淡，不動 DOM、筆跡不移位）、eyebrow 加 `<span class="scope-no">⛔ 不考，不用看</span>`、側欄連結加 `<em class="rail-skip">不考</em>`；已標：`ch12-part4`（整頁，hero 有 `.skip-chip`）、`ch12-problems #p1210`、`ch12-review #r129 #r1210`、`ch13-part3 #app`（故事在 Example 13.12 後插「⛳ 考試範圍到這裡」）、`ch13-problems #p139`、`ch13-review #r139`。13.8 本來就沒做。

## 電路學 CH1～CH10 複習（使用者 10/17，只有故事）

- 使用者給課本 CH1～CH10 原書章節，要「複習」：**只有故事 ＋ 總結卡**，不要題目、不要講義內容、不要推導節。篇幅比 CH11、12 短，但每章開頭要講「這章要幹嘛」。
- 一章一頁 `circuits/chN.html`，由 `tools/rv-pages.py` 依 `circuits/docs/rv-pages.json` 產生（也會重寫首頁 `#rv-chaps` 卡片）；只手寫 `circuits/assets/chN-story.js`。複雜的章（CH3、CH4、CH7、CH8）同一頁兩段故事（`#story`、`#story2`）。
- 故事結構：用課本例題數字出謎題 → 「這一章要幹嘛」（`ladder(n)` 章節階梯）→ 生活比喻講觀念 → 「先整理一下」→ 公式 → 劃掉常見錯誤（`strike()`）→ 回頭解謎 → 恍然大悟＋「還缺什麼 → 下一章」。
- 影片（電子大小事）學來的手法：`__Story` 的 `stamp`（右上角章節章）、`dots(d, key, 'ac'|'slow')` 流動電流點、同一張圖用 `mv` 縮小移到旁邊給計算卡空間。共用工具 `circuits/assets/rv-kit.js`（`__RV`：`el r/c/l`、`bat`、`batH`、`vac`、`isrc`（`down`）、`dsrc`、`loopA`、`ladder`、`strike`、`curve`、`axes`）。
- 電路學首頁：課程地圖故事（`assets/map-story.js`）＋一章一張卡；多頁的章（CH11、CH12）用 `details.chap-fold` 摺疊卡，點開才列出各頁（`a.chap.mini`）。章節階梯／上一章下一章在 `assets/rv-nav.js`。

## 觀念填充題（電路學 CH11 起）

- 使用者 10/6 要求：**每一小節 8 題**、用選的、**不用計算**（考觀念、知識，少量考「這題怎麼解」的解法）、中文題目下面附英文。
- 題庫一章一檔（例：`circuits/assets/ch11-concept.js` → `window.__CH11C`，`name:'ch11c'`），item `kind:'cf'`、`sec`、`en`、`how`（解法題）；作答元件同 `shared/hw.js`，選項自動打亂。
- 放法：每節最後加 `<div class="cf-wrap" id="cf-11-x">…<div class="hw-list" data-bank="__CH11C" data-sec="11.x"></div></div>`（放最後才不會讓筆跡錨點移位）；另做總複習頁 `ch11-review.html`。
- 紀錄存在 `<科目>/<bank.name>`（跨頁共用），要把它加進 `mistakes.html` 的 `data-chs`。選項同樣不能有 `<sup>`、底線。
- 使用者 10/7 要求：**可以全部重做、並記錄每題錯過幾次**。
  - `data-sec` 的 `.hw-list` 上面 hw.js 會自動長出 `.hw-tools` 工具列：🔄 全部重做（選項重新洗牌）、↺ 只重做錯過的、🔀 打亂順序；總複習頁 hero 放 `<div class="hw-tools-slot"></div>` 會長出整頁（72 題）的那一條。重做不會清掉紀錄。
  - 紀錄多一個欄位 `n`＝累計答錯次數（舊紀錄答錯過但沒 `n` → 當 1 次）。`answer(k, key, ok, extra, {nocount})`：同一張卡片沒按「重做」就重複按「對答案」只算一次。標籤顯示「· 錯 N 次」；錯題本同狀態內錯最多次的排前面，並有「常錯（≥ 2 次）」篩選。

## 電子實習（`lab/`，10/7 新科目）

- 主色 `#c2571a`（暗色 `#f09a5e`），`<body data-subject="lab">`。首頁章節順序（10/12 指定）：二極體特性（CH3）→ 整流器（CH4）→ 濾波（CH4）→ 稽納二極體（CH6）。一個實驗一頁，固定順序：
  **故事模式 → 原理（照章節頁規格）→ 🔬 實驗流程（器材、接線圖、步驟、示波器設定、出包點）→ 📈 結果 → 💻 PSpice 回家作業 → 名詞、測驗**。
- 使用者 10/7：**沒有實測數據時先放模擬結果**（程式模擬、Python 長時間跑穩態驗算，數字寫進 `docs/CONTENT_MAP.md`）；結果節附「我的實測」輸入表（`__SYNC.open('lab_<實驗>_meas')`），自動算並跟模擬比。
- 講義公式有兩種版本時**兩個都列**、說明差別（例：漣波 rms 正弦 /2√2 vs 鋸齒 /2√3 vs 課堂簡化 Vpp/Vdc）。
- 電路圖用 `shared/schem.js`，10/7 新增 `d`（二極體，尖端朝第二點＝陰極）、`gnd`、`vac`（交流源）；10/12 新增 `zd`（稽納）。
- 使用者會給自己的實驗報告（電路圖＋數據）：收到後填進該頁「我的實測」的預設對照、在結果節比較模擬與實測。
  做法（10/14 四份結報）：輸入框 `data-def` 放結報數字、按鈕「改回結報數據」；結果節加 `.note.key`「你的數據說了什麼」（數字錯、檔位錯、接線問題要點出來，不確定寫請確認）＋照片 `.lab-photos`（`figure > img + figcaption`，截圖類用 `img.contain`，點一下放大；照片縮到 ≤ 1200 px 放 `lab/img/`）；標題前加 `<span class="my-tag">我的</span>`。
- canvas 的 `label`/`labelCJK` 現在也支援 `<sub>`。

## 法律（`law/`，10/31 新科目）

- 主色 `#8a2b3a`（暗色 `#e58b99`），`<body data-subject="law">`。**不做故事模式**（使用者指定）。
- `notes.html` 直立式上課筆記（照講義檔名日期，一講一張 `.paper.lec`，列印 A4 每講換頁）：只收黃色螢光 `mark.hy`、淺藍螢光 `mark.hc`、紅字 `.rd`、法條 `.law` ＋白話 `.expl`；講義沒有的用 `.add-note`。每講最後 `.exq` 自編題＋三段式長答案（依據 → 本案 → 結論，使用者說考試手寫要寫很多字）。
- `writing.html`（`writing.js`）：和解書範本挖空、產生器（人事時地物檢查）、存證信函 20 格稿紙 `__LG.grid('事實|限期|後果')`。樣式在 `law/law.css`。
- **考試只能看手寫筆記（使用者 11/1）**：`copy.html` 是給他抄到 iPad 的精簡版（速查表＋表格，字越少越好，`.ltab.qt`、`.qs`；不放課程規範）。上面有「🙈 挖空練習」（`body.cloze`：mark／.rd／表格粗體變灰格點開）和「📄 空白表格」（`body.blank-sheet`：使用者 11/1 要求**不要任何字、只要格子**——表格以外全部隱藏，表格所有格子（含表頭、第一欄）都清空，只留框線，可列印）；`notes.html` 是詳細版。新講義兩邊都要加（精簡版只留螢光筆／紅字／法條關鍵字＋刑度，順便補進速查表）。
- 新講義進來照日期加一張 `.paper.lec`，更新 `law/docs/CONTENT_MAP.md`、`law/index.html` 數字。

## 人類與環境安全（`env/`，11/3 新通識）

- 主色 `#3d7a2a`（暗 `#9bd47f`），`<body data-subject="env">`；考試不能看筆記 → 只做 `review.html` 一頁考前速讀（表格＋口訣、申論範例 `.exq`、電影《Minamata》對照、快速自測 `details`、挖空 `body.cloze`）。版面沿用 `../law/law.css`＋`env.css`。不做故事模式。**每節最後有 8 題選擇填充（使用者 11/10）**：`env/assets/review-cf.js`（`__ENVCF` name `env-cf`，sec＝section id，hw.js），共 80 題，只考該節寫過的內容。`env/essay.html` 申論生存包（使用者 11/10 說內容太難記）：五張骨架卡（口訣＋畫面）＋萬用灌水句＋組裝示範（螢光＝要背、灰字＝灌水）＋電影心得五段大綱；每張卡下面有選擇填充（`env/assets/essay-cf.js` → `__ENVES` name `env-es`，sec k1～k5、film，49 題；卡 3 含傳統 vs 非傳統「來源→手段→危害」表）。`env/mock.html` 模擬考（`assets/mock.js`）：每份＝題一（五種申論題隨機抽）＋題二電影，整篇範例答案關鍵字挖空 `[[正解|干擾…]]`，選的／打字（給首字）、挖空一半／大部分／全部，成績存 localStorage `ee-env-mock`。

## 英文（`english/`，11/8 新科目）

- 主色 `#1f6f9a`（暗 `#7cc4ea`），`<body data-subject="english">`。不做故事模式。期中考 `review.html`：題庫 `assets/mid-bank.js`（`__ENG1` name `eng-mid1`，hw.js 卡片）＝老師單字表英英定義（雙向）＋課本練習（照 answer key）＋課文原句挖空。資料在 `english/docs/`（EXAM、VOCAB、KEYS）；課本照片不放進 repo。

## 電動車（`ev/`，11/5 新課，還沒做頁面）

- **考試重點寫在 `ev/docs/EXAM.md`（使用者 11/5 口述，一定要記住）**：選擇題＋問答題；問答題考分類與英文縮寫、優點、系統架構圖、電力轉換設備、「四項」物理意義、弗萊明左右手與安培定律、發電原理、油電車混合程度分類、串並聯架構圖、充電→電池→馬達效率計算、電力線內阻與電壓、電池串並聯；3 題常識選擇（成本最高的部分）。等使用者給照片再做頁面。

## 學習紀錄（`shared/track.js`）

- 每個章節頁、科目首頁的**最後一個 script** 放 `<script src="../shared/track.js"></script>`（新頁面也要加）。
- 自動記：小節內有互動（pointerdown/input/change）或停留 30 秒；故事切到某畫面（`story:view` 事件）；
  測驗點選項（看 `.opt.right/.wrong`）；作業按「對答案」；Example 按看下一步；Practice 看答案／寫手寫板／按「算對了／算錯了」。
  每一筆都有 ✕ 可刪；小節可手動「✓ 標記讀過」；hero 有「清除這一頁的紀錄」。
- 紀錄 key：`sec:<section id>`、`sc:<故事標題>`、`q:<題幹 hash>`、`hw:<卡片 id>`（存在 `<科目>/hw1`）、`ex:`／`pp:<卡片 id>`。
  **改小節 id、故事標題、題幹文字會讓舊紀錄對不上**，非必要不要改。
- 不追蹤的小節 id：`story-sec quiz-sec glossary check hw map scope ref later p1…p9`；整頁不追小節用 `<body data-trk-sec="0">`。
- 題目紀錄：`ok`＝最近一次對錯，`w`＝第一次答錯的時間（之後答對也保留）。標籤：答錯＝紅底、答錯後訂正＝橘（「✗ M/D 答錯 → ✓ M/D 訂正」）、答對＝綠；
  卡片加 `.trk-wrong`／`.trk-fixed` 左邊色條。作答一律走 `answer()`，不要直接 `set()`。hero 另有「清除題目紀錄」（只清 q/ex/pp/hw）。
- 作答時另存 `s`（短標題）、`u`（回原題的連結）、`d`（題目、你選的、正解、解釋）給錯題本用。
- 預設已讀放在 `SEED`（套一次就記在 `seed.v1`，使用者刪掉不會補回）。
- 儲存：localStorage `ee-trk:<科目/檔名>` + 雲端 `data/users/<id>/trk_<科目_檔名>`；每筆帶時間，合併取新的，刪除是墓碑 `{t, x:1}`。

## 錯題本

- 每科 `<subject>/mistakes.html`（`#mk-book` 的 `data-chs` 列出 `[[科目/檔名, 名稱]…]`，作業那份放最後）；
  科目首頁有 `a.chap.mk-card[data-trk-skip]` 卡片；每個章節頁底部由 track.js 自動長出 `#mistakes`「這一章的錯題」。
- **新增章節時要把它加進該科 `mistakes.html` 的 `data-chs`**。
- 收「最近一次答錯（紅）」和「答錯後訂正（橘）」；點「回原題重做」用 `u` 跳回去（收在 `<details>` 裡的會自動打開）。

## 講義上寫筆記（`shared/annot.js` + `shared/sync.js`）

- 使用者 10/3 決定：**書櫃式筆記本（舊 `notes/`）收掉**，只留「直接寫在講義上」。
- 章節頁在 track.js 前面載入 `sync.js`、`annot.js`。右下「✍ 寫筆記」進入筆記模式，工具列釘在畫面上方（照 GoodNotes）：
  復原／重做｜筆（再點一次開設定：鋼筆 f／原子筆 b／畫筆 r、粗細 0.2–4 px、筆畫穩定 0–100%）、螢光筆、整筆橡皮擦、便條｜三段粗細｜六色｜☝ 手指寫、🗑 清除本頁、完成。
  設定存 localStorage `ee-pen`（使用者習慣很細的線，預設 0.8、最細 0.2）。
- Pencil／滑鼠寫字，手指照常捲動；在按鈕上寫字會擋掉那次 click。
  **Apple Pencil 側邊連點兩下網頁收不到**（Apple 只開放給原生 App）→ 替代：**兩指點一下 = 暫時橡皮擦，擦完一次自動切回原本的筆**；
  直接按「擦」才會一直是橡皮擦（使用者 10/3 指定）。有橡皮擦鍵的筆（`buttons & 32`）按著鍵寫直接擦。
- 筆畫穩定＝指數平滑（`a = 1 − 0.92·stab`），放開時補幾點追上筆尖；鋼筆／畫筆用壓力畫成填色外框。
- 筆跡錨在「開始那一段」（`ATOM` 題目卡、bench、例題…整塊算一段；`BLOCK` 段落、li…），座標 = 那段寬度的比例 × z（10000；第一版是 1000）。
  錨點 key = `<最近有 id 的祖先>:<第幾個區塊>`，**改頁面結構會讓舊筆跡移位**；track 等動態插入的東西放在 `EXCL`，不算進索引。
- 便條＝只能手寫的一塊區域（`#ann-nb-*`），「新增空間」＝題目下面一塊區域（`#ann-sp-*`，只在 `.hw-card .xb-card .quiz .example` 有 id 的下面，筆記模式才出現按鈕）；
  兩者都是錨點，用同一支筆寫，刪掉時連上面的筆跡一起刪（可復原）。
- 筆跡資料欄位**不能叫 `t`**（`t` 是同步用的時間戳，踩過的坑）：種類用 `y`。
- 儲存：`__SYNC.open('ann_<科目/檔名>')`，本機 `ee-sync:` + 雲端 `sync_<name>`（> 200 KB 自動切 `__1`、`__2`…，沒變的份不重寫）；
  每項帶 t，刪除是墓碑，45 天後清掉。
- Practice 題手寫板 = `__ANN.pad(host, 'xb-<題目 id>')`：`.ann-pad-body.ann-free`（id `ann-pad-*`）是錨點，`.ann-free` 不用進筆記模式就能寫；
  自己的小工具列（筆 ▾、螢光、擦、復原／重做、手指寫、加高、清除），高度存 `ph:<id>`。舊手寫板 localStorage `ee-pad:*` 第一次打開會搬過來然後刪掉。

## 電子學名詞圖鑑（10/27 起，通用版）

- `shared/tpic.js`（`__TPIC`）：`__TPIC.add(cards, sets, figs)`；cards = `{ key: { t, en, plain, rel, svg } }`（svg 是 viewBox 0 0 640 300 的內容），頁面 `<div class="tpic" data-set="e16"></div>`，故事用 `__TPIC.scenes([key…])`，第三個參數把 `terms.js` 名詞對到卡片（彈窗附圖）。
- 電子學卡片在 `electronics/assets/diode-terms.js`（set `e16` = CH1 PART 6、`e17` = CH1 PART 7、`e21` = CH2 PART 1），要先載 story.js、`ch1-part5-kit.js`、`tpic.js`。新章節把新名詞加一張卡、新 set。
- **電子學期中考 2（11/9）**：範圍 CH1 PART 4 §02 ～ CH2 PART 1；每節都有 8 題觀念填充（PART 4 每節再加 7 題「英文先＋計算」：item 寫 `zh`（中文翻譯，hw.js 收進「中文翻譯」按鈕）、`calc: true`；使用者 11/1 要求之後加碼題都英文先）；**11/6 改：老師說只有計算題英文，選擇／填充題一律中文** → hw.js `zhFirst` 會把有 `zh` 的填充題自動改成中文先（選項只留中文半邊，英文收進「English」），新題目還是可以照舊寫 `q` 英文＋`zh` 中文（`___` 數量要跟空格數一樣）（`ch14c`、`ch15c`、`ch16c`、`ch21c`），總複習 `electronics/review2.html`。之後新增的電子學小節也要附 8 題觀念填充並加進總複習頁。
- **練習、計算、每節填充照作業出（使用者 11/4）**：`electronics/assets/hw3-mock.js` 把「仿 HW3」計算題（換數字）掛進 `__CH15EX`（cvd）、`__CH16EX`（dcac、rd、zd）、`__CH22EX`（chg、fwc），把照 HW3 選擇題改寫的英文填充掛進 `__CH16C`；`hw3.html` 有 `#mock` 總覽。各頁要在 `exbook.js` 後面載入它。新作業進來照這招做仿題。
- **段考範圍都要有電路圖，尤其 CH2（使用者 11/5）**：`electronics/assets/ch2-figs.js`（`__C2F`，用 schem.js 照板書接法畫 12 張：hwr、hwrT、chg、ct、bridge、shunt、ref1、ref2、series、bidir、bidirR2、clamp）會自動在 CH2 每節導言後插圖（`.c2f-row`），並把圖掛到 CH2 題庫、衝刺頁、HW3 沒有圖的題目上（`.c2f-q`）。新增 CH2 題目不用手動放圖；新電路加一個 key、在 `SEC`／`pick` 對好就行。載入在 exbook.js（及 hw3-mock.js）之後。
- **講義沒給公式就不算（使用者 11/4）**：講義只講觀念、沒有計算公式的小節（例：CH1 PART 7 的 01～04 節：兩種電容、小訊號等效電路、開關暫態、光電元件）**不放自編計算題、不放課本延伸公式**（例 C<sub>d</sub> = τI/(2V<sub>T</sub>)、f<sub>c</sub>、t<sub>s</sub> 公式、LED 限流），故事和互動也不要編數字；只考觀念。新內容先對照講義原文確認有沒有那條公式再寫。
- 電子學 CH1 PART 6 起照「觀念先（故事優先）」的做法，**不是**題目先（使用者 10/27：先用電子學之前的方式）；每節也有觀念填充（8 題）。

- **電子學 CH2 PART 2、3（11/4，期中考 2 範圍延伸）**：使用者給手寫板書掃描（整流器、截波／箝位）。`ch2-part2.html`（電池充電器、中間抽頭、橋式、比較）與 `ch2-part3.html`（並聯／串聯／雙向截波、箝位器），共用 `assets/ch2-common.js`（`__c2.quiz`、`__c2.tools`）。手寫看不清的地方寫在頁面「講義檢查」請使用者確認，不要斷言；練習沒有圖解故事。總複習 `review2.html` 現為 355 題（11/4 依考試重點加碼橋式 6 題、截波 10 題英文計算）。

- **期中考 2 考試重點（使用者 11/4 口述，一定要記住）**：寫在 `electronics/docs/MIDTERM2.md`（6 類計算題＋7 類選擇題、整張考卷全英文）。做電子學期中考 2 相關的任何東西前先讀它。衝刺頁 `electronics/midterm2.html`（計算 `assets/mt2-calc.js` → `__MT2EX`、英文先選擇 `assets/mt2-choice.js` → `__MT2C` name `mt2c`）＋ `hw3.html`（同兩份題庫的 HW3 子集 `__HW3EX`、`__HW3C`）。截波板書使用者之後會給 → 補進 `k5`。

## 原講義 PART 標註

老師的講義 PART 跟網頁的頁不一定一一對應（例：原講義 PART 3 前 15 頁跟 PART 2 同主題，併進 CH1 PART 2 頁；1-16～1-18 使用者要放回 PART 3）。
**同一份原講義的內容，原則上放在對應的網頁 PART**；要跨 PART 合併前先問使用者。
**每一節的 eyebrow 前面加 `<span class="part-tag">原講義 PART x</span>`**，讓使用者知道這段來自哪份講義；
對照表寫在該科 `docs/CONTENT_MAP.md`。

## 測驗

- 題庫裡正解寫在第一個（`a: 0`）沒關係，**render 時一定要打亂選項順序**（`shuffle` + `ord`），
  否則答案永遠是 A（踩過的坑）。

## 語言慣例

- 講解**一律中文**（繁體）。
- **畫面上不要出現 `^`**（使用者看不懂 `e^(2t)`）：次方一律寫 `<sup>…</sup>`，例 `e<sup>2t</sup>`、`∫₀<sup>∞</sup>`。
  HTML 直接用；canvas 的 `label`/`labelCJK` 會自動畫上標；故事模式 `text()`/`chip()`/標題會自動轉 SVG 上標；
  JS 塞進 DOM 的字串要用 `innerHTML`（或 `setText`）不要用 `textContent`。工數與 `terms.js` 已全換，電子學尚未換。
- **專有名詞要可以點開看白話解釋**（使用者抱怨過「專有名詞不好理解」）：
  寫成 `<button class="tm" data-t="數量級">數量級</button>`，
  解釋統一註冊在 `shared/terms.js`，每一條要有：
  `zh` 中文、`en` 英文、`plain` 白話（**盡量用生活比喻**）、`unit` 單位或符號、
  `why` 為什麼要發明這個詞。
  每頁都要載入 `<script src="../shared/terms.js"></script>`（放在 app.js 之後）。
  **新章節出現新名詞時，先加進字典再用。**連「數量級」「濃度」這種看似常識的詞也要收，
  它們正是卡住理解的地方。
- 測驗題**中英對照**：題幹中文、下方 `.q-en` 附英文原句，選項也中英並列。
  理由：使用者**考試用英文、讀書用中文**。
- 語氣：像學長在講解，直接、具體、不要客套。

## 檔案結構

三層導覽：**主頁（選科目）→ 科目首頁（選章節）→ 章節頁（實際內容）**。
使用者抱怨過「點進去科目太亂」，所以**一章一頁**，不要把整科塞在同一頁。

```
index.html                    主頁：科目選單
shared/app.css                設計語彙 + 所有教學元件
shared/app.js                 互動引擎，匯出 window.__EE
<subject>/index.html          科目首頁：**章節選單**（.chap 卡片 + .progress 進度）
<subject>/<chapter>.html      章節內容頁（例：ch1-part1.html、ch11-part1.html、laplace.html）
<subject>/<chapter>-<MMDD>.html  該章某堂課的純板書上課筆記（例：laplace2-1002.html）
<subject>/assets/<chapter>.js 每章一個 JS
<subject>/docs/CONTENT_MAP.md 進度表
```

### 其他

- 頁面被 iframe 嵌入時網址帶 `?embed=1`，`app.js` 會加上 `.embed` class 隱藏頂欄。
- 發佈 artifact 不要傳 `capabilities`（已存 `db`、`user`、`downloads`，學習紀錄與筆記同步要用）。

- 科目主色用 `<body data-subject="…">`，chrome 一律吃 `--accent`。
  電子學 `#2a55e0` 藍｜電路學 `#0f7a66` 墨綠｜工程數學 `#6a4bbc` 紫。
- 子頁用 `../shared/app.css`、`../shared/app.js`，**不要複製引擎**。
- 每頁 topbar 用**麵包屑**，不是單一的返回連結：
  ```html
  <nav class="crumbs" aria-label="所在位置">
    <a href="../index.html">主頁</a><span>›</span><a href="index.html">電子學</a><span>›</span><b>CH1 PART 2</b>
  </nav>
  ```
- 新增章節時要同步更新該科 `index.html` 的章節卡片與 `.progress` 數字。

## 寫互動模組的注意事項

- 用 `window.__EE` 的 `Stage(canvas, {ratio, minH, maxH, animate, draw})`；
  `animate:false` 的靜態圖用 `st.redraw()` 重畫。
- **所有半徑／尺寸都要夾住下限**（`Math.max(0, r)`）。窄版面會算出負值讓 canvas 丟例外。
- **粒子位置存 0~1 的比例，不要在 draw 裡用當下的 w 換算後存成像素。**
  第一次 paint 時版面可能還沒算好（`clientWidth` 為 0 → w 被夾成 1），
  這時換算出來的座標全部擠在一起，之後同速移動的粒子會永遠疊在同一點。
- 箭頭與文字標籤要**畫在容器框內**並預留行高，否則會被裁掉或互相重疊；
  同一列放兩組標示時分左右兩欄（例如 0.27 / 0.73 的位置）。
- 畫布內容要**水平置中**、縱軸依實際資料範圍決定，不要留大片空白。
- 顏色一律從 `C` 取（`C.accent`、`C['p-real']`…），不要寫死色碼，否則暗色模式會壞。
- 第一眼（未互動時）就要有東西可看，不能是空畫布。
- 彈出式 UI（名詞解釋之類）用**頁面座標**（`scrollX/scrollY` + `position:absolute`），
  不要用 `position:fixed` 然後在 scroll 時關掉 —— 手機上輕輕一滑就消失會很難用。

## 不要做的事

- 不要只給結論公式就跳去互動 —— 這被抱怨過。
- 不要用英文寫解說。
- 不要把引擎複製到各科資料夾。
- 不要在沒驗證過（Playwright 四種寬度）就說「做好了」。
