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
- 現有劇本：電子學 `ch1-part1～4-story.js`、電路學 `ch11-part1～3-story.js`、工數 `laplace-story.js`、`laplace2-story.js`、`ode-story.js`。
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
- Practice：題目＋**手寫板**（`__ANN.pad`，跟講義筆記同一支筆，不用進筆記模式就能寫，雲端同步；沒載 annot.js 才退回 `shared/pad.js`）；提示／答案／詳解先遮住。
  課本只給答案的，詳解自己解，**數值要用程式驗算**；跟課本答案有出入要寫 `note`。
- 電路圖一律用 `shared/schem.js` 重畫（`r l c z vs is wm wave`），不要截課本圖。
- 章節頁故事模式下方放「選小節」：`__EXB.picker(el, [{id, no, name, count}], {key, alwaysAll})`，選了只顯示那一節。
- 章末 Problems 使用者還沒要求，先不做。

## 觀念填充題（電路學 CH11 起）

- 使用者 10/6 要求：**每一小節 8 題**、用選的、**不用計算**（考觀念、知識，少量考「這題怎麼解」的解法）、中文題目下面附英文。
- 題庫一章一檔（例：`circuits/assets/ch11-concept.js` → `window.__CH11C`，`name:'ch11c'`），item `kind:'cf'`、`sec`、`en`、`how`（解法題）；作答元件同 `shared/hw.js`，選項自動打亂。
- 放法：每節最後加 `<div class="cf-wrap" id="cf-11-x">…<div class="hw-list" data-bank="__CH11C" data-sec="11.x"></div></div>`（放最後才不會讓筆跡錨點移位）；另做總複習頁 `ch11-review.html`。
- 紀錄存在 `<科目>/<bank.name>`（跨頁共用），要把它加進 `mistakes.html` 的 `data-chs`。選項同樣不能有 `<sup>`、底線。

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
