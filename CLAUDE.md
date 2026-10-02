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
   `files` 要帶上所有頁面與 `notes/`，capabilities 見下方「手寫筆記的規矩」）。

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
- 驗證：除了四種寬度，還要把每一步截圖拼成總表看過（標籤有沒有疊在一起、東西有沒有出現）。
- 同頁面加 `<body data-look="clean">` 會套用同一套乾淨外觀（標題卡 + 英文小字 `.h2-en`）。
- SVG 文字裡的 `<`、`>` 一定要寫成 `&lt;`、`&gt;`，否則整個畫面 parse 失敗（踩過的坑）。
- 下標用 `fx(['i','D',' = I','S'])` 這種寫法：下標後面的字要跟回基線的 tspan 放一起，空的 tspan 的 dy 不會生效。
- 現有劇本：電子學 `ch1-part1～4-story.js`、電路學 `ch11-story.js`、工數 `laplace-story.js`、`laplace2-story.js`、`ode-story.js`。

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
- 使用者已經看過的章節不要動；同主題的新進度**開新的一章**（例：`laplace.html` 看過 → 10/2 開 `laplace2.html`）。
- 開頭「複習」若屬於別章的內容（例：共軛複根屬 ODE），只留在上課筆記，不放進本章重點。

## 作業題與考試範圍

- 作業題庫一份作業一個檔（例：`electronics/assets/hw1-bank.js`），作答元件 `shared/hw.js`：
  頁面放 `<div class="hw-list" data-hw="1,2,4"></div>` 就會長出「作業原題（紫標籤）＋ 仿作業（灰標籤、收在『再練 N 題』裡）」。
  作業原題的選項照作業原本順序；仿作業的選項會自動打亂。**下拉選項不能放 `<sup>`，次方用 ¹⁰ 這種上標字元。**
- 一定要分清楚「作業原題」和「自編練習」（使用者要求標註）。
- 每題作業放進對應單元：該節 eyebrow 加 `<a class="hw-tag" href="#hw-qN">📝 HW1 第 N 題</a>`，章末加 `#hw` 區塊；
  另外做一頁 `<subject>/hwN.html` 考前總複習。
- 考試範圍：範圍內的章節 hero 放 `✓ 考試範圍` chip；範圍終點放 `.scope-end` 提示框，之後的節 eyebrow 加 `<span class="scope-no">還沒教到</span>`；
  故事模式在終點插一個「⛳ 考試範圍到這裡」畫面。還沒教到的作業題先不放，在總複習頁列出來。

## 原講義 PART 標註

老師的講義 PART 跟網頁的頁不一定一一對應（例：原講義 PART 3 前 18 頁跟 PART 2 同主題，併進 CH1 PART 2 頁）。
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
<subject>/<chapter>.html      章節內容頁（例：ch1-part1.html、ch11.html、laplace.html）
<subject>/<chapter>-<MMDD>.html  該章某堂課的純板書上課筆記（例：laplace2-1002.html）
<subject>/assets/<chapter>.js 每章一個 JS
<subject>/docs/CONTENT_MAP.md 進度表
notes/                        手寫筆記（GoodNotes 式，給 iPad + Apple Pencil）
  index.html                  書櫃；note.html 編輯器
  assets/store.js             儲存：IndexedDB（本機）+ claude.ai 上的 db 同步（data/users/<id>）
  assets/render.js            紙張與筆跡繪圖（編輯器與縮圖共用）
  assets/ink.js               編輯器：筆／螢光筆／橡皮擦／套索、按住拉直線、縮放、講義並排
  assets/library.js           書櫃；裡面的 CHAPTERS 清單是「可綁定的章節」
```

### 手寫筆記的規矩

- **新增章節時，要把它加進 `notes/assets/library.js` 的 `CHAPTERS`**，新增筆記本時才選得到。
  （章節頁右上的「✎ 筆記」按鈕由 `shared/app.js` 自動產生，不用手動加。）
- 章節頁被筆記頁用 iframe 嵌入時網址帶 `?embed=1`，`app.js` 會加上 `.embed` class 隱藏頂欄。
- 筆跡座標一律存**頁面座標**（寬 1000、高 1414），不存像素。
- 紙色與墨水色是「筆記內容」，定義在 `render.js`，**不跟網站明暗主題變**（例外於「顏色從 C 取」）；
  介面 chrome 仍一律吃 app.css token。
- 發佈 artifact 時要帶 `capabilities: {db:{}, user:{}, downloads:true}`，雲端同步與匯出才會動。
  （宣告 db 之後 artifact 只能在組織內分享、不能公開。）

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
