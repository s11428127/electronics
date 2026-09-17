# 電路學 — 章節分類與上傳進度

課本依據：Charles K. Alexander & Matthew N. O. Sadiku,
*Fundamentals of Electric Circuits*（McGraw-Hill）

## 已完成

### CH11 交流功率分析 AC Power Analysis（課本 p.455–488）

| 節次 | 中文 | English | 互動模組 |
|------|------|---------|----------|
| 11.1 | 導論 | Introduction | 首頁 Hero |
| 11.2 | 瞬時功率與平均功率 | Instantaneous and Average Power | ① 瞬時功率波形實驗室 |
| 11.3 | 最大平均功率轉移 | Maximum Average Power Transfer | ② 阻抗匹配挑戰 |
| 11.4 | 有效值／均方根值 | Effective or RMS Value | ③ rms 三步驟演示 |
| 11.5 | 視在功率與功率因數 | Apparent Power and Power Factor | ④ 相量圖與功率因數 |
| 11.6 | 複功率 | Complex Power | ⑤ 功率三角形（可拖曳） |
| 11.7 | 交流功率守恆 | Conservation of AC Power | ⑥ 三個負載的功率相加 |
| 11.8 | 功率因數校正 | Power Factor Correction | ⑦ 功因校正計算器 |
| 11.9 | 應用：功率量測與電費 | Applications | ⑧ 電費計算器 + 瓦特計說明 |
| 11.10 | 本章總結 | Summary | 名詞中英對照表 + 15 題測驗 |

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
