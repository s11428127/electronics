# 電機系互動講義

把課堂投影片改寫成可以動手操作的網頁教材：每個觀念配一個可拉、可點、可玩的互動模組，而不是
一張靜態圖。純 HTML + CSS + Canvas，零相依套件、**不需要任何建置流程**，開對應科目的
`index.html` 就能看。

這個 repo 用一個資料夾放一個科目，彼此獨立、互不干擾，但共用同一套設計語彙與互動引擎
（`shared/`），所以每個科目長得像同一個系列。

## 科目

| 科目 | 資料夾 | 狀態 |
|------|--------|------|
| 電子學 | [`electronics/`](electronics/) | CH1 PART 1 已完成（見 [進度表](electronics/docs/CONTENT_MAP.md)） |
| 電路學 | `circuits/` | 尚未開始，等你丟第一份講義 |
| 工程數學 | `engineering-math/` | 尚未開始，等你丟第一份講義 |

## 結構

```
shared/
  app.css               設計語彙：色票、字體、版面（跨科目共用）
  app.js                互動引擎：Canvas 舞台、主題切換、繪圖原語（跨科目共用）
electronics/
  index.html            電子學首頁：課程地圖 + 各章互動模組
  assets/chN.js          每章一個檔案
  docs/CONTENT_MAP.md    章節分類與上傳進度
circuits/                （之後）電路學，結構同上
engineering-math/        （之後）工程數學，結構同上
```

## 新增一個科目的規則

1. 新資料夾 `<subject>/`，裡面一個 `index.html`（課程地圖 + 該科的互動模組）、
   `assets/`（每章一個 `chN.js`）、`docs/CONTENT_MAP.md`（章節分類與進度）。
2. `index.html` 用相對路徑 `../shared/app.css`、`../shared/app.js` 引用共用引擎，
   不要複製一份到科目資料夾裡——引擎改進時三科才能一起受益。
3. 每個科目的 `index.html` 都是「這一科的完整地圖」：想統整某科重點，打開那個科目的網站就好，
   不用在多科內容裡面找。

## 給下一個接手的人（含未來的我）

- 互動模組共用的畫圖工具、色票、明暗主題、滑桿綁定等，都在 `shared/app.js` 匯出的
  `window.__EE` 裡，寫新章節時直接解構取用（參考任一個 `chN.js` 開頭幾行）。
- 每個科目的 `docs/CONTENT_MAP.md` 是唯一該去更新進度狀態的地方；`index.html` 裡的
  課程地圖區塊只是它的視覺呈現。
