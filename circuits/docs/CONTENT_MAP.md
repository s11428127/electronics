# 電路學 — 章節分類與上傳進度

課本依據：Charles K. Alexander & Matthew N. O. Sadiku,
*Fundamentals of Electric Circuits*（McGraw-Hill）

## 已完成

### CH11 交流功率分析 AC Power Analysis（課本 p.455–488）—— 拆成三頁（10/4）

| 頁 | 節次 | 內容 | 互動模組（`assets/ch11.js` 共用） | 可改數字例題（預設 = 課本） | 故事 |
|----|------|------|------|------|------|
| `ch11-part1.html` | 11.2、11.3 | 瞬時／平均功率、最大功率轉移 | ① 瞬時功率波形實驗室、② 阻抗匹配挑戰 | Ex 11.1、Ex 11.3、Ex 11.5（可切純電阻負載） | 20 個畫面／83 步 |
| `ch11-part2.html` | 11.4、11.5 | 有效值 rms、視在功率與功率因數 | ③ rms 三步驟、④ 相量圖與功率因數 | Ex 11.8（可換波形）、Ex 11.9、PP 11.9 | 20 個畫面／85 步 |
| `ch11-part3.html` | 11.6–11.9 | 複功率、功率守恆、功因校正、瓦特計與電費 | ⑤ 功率三角形、⑥ 三負載相加、⑦ 功因校正計算器、⑧ 電費計算器 | Ex 11.11、11.12、11.14、11.15、11.16、11.18 | 21 個畫面／87 步 |

- 每頁：故事模式 → 選小節 → 課程地圖（含上一頁複習）→ 各小節（導言、.eq、.derive、例題、.bench、.howto、.pitfall、課本 Example／Practice）→ 名詞對照 → 10 題測驗（選項打亂）。
- 故事謎題：PART 1「1200 還是 344 W？」、PART 2「110 V 與 41.7 A」、PART 3「一顆不耗電的電容讓電流變小」。
- 舊的 `ch11.html` 改成轉址頁（依 #小節 轉到新頁）；舊的學習紀錄、筆記不搬（使用者 10/4 決定）。

## 本章核心公式

```
p(t) = ½VmIm cos(θv−θi) + ½VmIm cos(2ωt + θv + θi)   ← p(t) 頻率是電壓的兩倍
P    = ½VmIm cos(θv−θi) = Vrms Irms cos(θv−θi)        ← 平均功率／實功率 (W)
ZL   = ZTh*  ⟹  Pmax = |VTh|² / (8 RTh)               ← 共軛匹配
       （負載限定純電阻時改為 RL = |ZTh|）
Xrms = √( (1/T)∫₀ᵀ x² dt )；弦波 Vm/√2、方波 Vm、三角/鋸齒 Vm/√3
S    = Vrms Irms (VA)；pf = P/S = cos(θv−θi)
S    = Vrms I*rms = P + jQ；|S| = √(P²+Q²) = I²rms Z = V²rms/Z*
Q > 0 電感性落後 lagging；Q < 0 電容性超前 leading；Q = 0 純電阻
S總 = ΣSi，P總 = ΣPi，Q總 = ΣQi，但 |S總| ≠ Σ|Si|    ← 考試陷阱
QC   = Q1 − Q2 = P(tan θ1 − tan θ2)；C = QC / (ω V²rms)
```

## 待上傳

其餘章節（CH1–CH10、CH12 以後）尚未上傳。丟新的講義過來時請一併說明是第幾章，
我會在 `circuits/assets/` 新增對應的 `chN.js` 並更新這張表與首頁的課程地圖。
