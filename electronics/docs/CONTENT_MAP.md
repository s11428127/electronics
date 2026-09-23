# 章節分類與上傳進度

課本依據：Donald A. Neamen, *Microelectronics: Circuit Analysis and Design*, 4th ed.（McGraw-Hill）
課程：2026 Fall

## 全書 16 章

| 章 | 英文章名 | 中文 | 狀態 |
|---|---------|------|------|
| 1 | Semiconductor Materials and Diodes | 半導體材料與二極體 | **PART 1、PART 2 已完成** |
| 2 | Diode Circuits | 二極體電路 | 待上傳 |
| 3 | The Field-Effect Transistor | 場效電晶體 FET | 待上傳 |
| 4 | Basic FET Amplifiers | 基本 FET 放大器 | 待上傳 |
| 5 | The Bipolar Junction Transistor | 雙極接面電晶體 BJT | 待上傳 |
| 6 | Basic BJT Amplifiers | 基本 BJT 放大器 | 待上傳 |
| 7 | Frequency Response | 頻率響應 | 待上傳 |
| 8 | Output Stages and Power Amplifiers | 輸出級與功率放大器 | 待上傳 |
| 9 | Ideal Op-Amps and Op-Amp Circuits | 理想運算放大器與 Op-Amp 電路 | 待上傳 |
| 10 | IC Biasing and Active Loads | 積體電路偏壓與主動負載 | 待上傳 |
| 11 | Differential and Multistage Amplifiers | 差動與多級放大器 | 待上傳 |
| 12 | Feedback and Stability | 回授與穩定度 | 待上傳 |
| 13 | Operational Amplifier Circuits | 運算放大器電路 | 待上傳 |
| 14 | Nonideal Effects in Op-Amp Circuits | 運算放大器的非理想效應 | 待上傳 |
| 15 | Applications and Design of ICs | 積體電路應用與設計 | 待上傳 |
| 16 | Digital Electronics | 數位電子學 | 待上傳 |

## CH1 小節拆解

| 小節 | 內容 | 狀態 |
|------|------|------|
| 1.1.1 | Intrinsic Semiconductors 本質半導體 | ✅ CH1 PART 1 |
| 1.1.2 | Extrinsic Semiconductors 非本質半導體 | ✅ N 型於 PART 1、P 型與定量分析於 PART 2 |
| 1.1.3 | Drift and Diffusion Current 漂移與擴散電流 | ✅ CH1 PART 2 |
| 1.1.4 | Excess Carriers 過剩載子 | 待上傳 |
| 1.2 | The pn Junction pn 接面 | 待上傳 |
| 1.3 | Diode Circuits: DC Analysis and Models | 待上傳 |
| 1.4 | Diode Circuits: AC Equivalent Circuit | 待上傳 |
| 1.5 | Other Diode Types（Schottky、Zener…） | 待上傳 |
| 1.6 | Design Application: Diode Thermometer | 待上傳 |

## CH1_PART1 逐頁對照（投影片 p.1–30）

| 投影片 | 主題 | 對應互動模組 |
|--------|------|-------------|
| p.1–2 | 課程封面、本章目標 | 首頁 Hero |
| p.3 | Notation：AC / DC / 脈動直流 | 01 訊號極性實驗室 |
| p.4–5 | 原子結構（碳）、週期表族別 | 02 原子殼層建構器 |
| p.6 | CH1 目錄 1.1–1.6 | 課程地圖 |
| p.7–9 | 半導體分類、元素/化合物半導體、E-MOSFET 補充 | 課程地圖說明 |
| p.10–15 | 殼層電子數、價電子、2n²、八隅體規則 | 02 原子殼層建構器 |
| p.16–17 | 離子鍵（Na + Cl） | 03 化學鍵實驗台 |
| p.18–19 | 共價鍵（Si 四面體、二維圖示） | 03 化學鍵實驗台、04 矽晶格 |
| p.20–21 | 能帶、Ec / Ev / Eg、三類材料能隙比較 | 05 能帶圖 |
| p.22–23 | 溫度與共價鍵、電子伏特 | 04 矽晶格熱擾動 |
| p.24 | Movement of Holes 電洞移動 | 06 電洞移動挑戰 |
| p.25–26 | ni = B·T^(3/2)·exp(−Eg/2kT)、室溫數值 | 07 ni 計算器 |
| p.27–30 | N 型：施體磷、P⁺ 離子、n ≈ Nd | 08 N 型摻雜實驗室 |

## CH1_PART2 逐頁對照（投影片 p.31–55）

| 投影片 | 主題 | 對應互動模組 |
|--------|------|-------------|
| p.31–32 | P 型：受體硼 B、B⁻ 負離子 | 01 N/P 型摻雜對照實驗室 |
| p.33–35 | 電子流 vs 電洞流、n/p 型總整理 | 02 總整理表 |
| p.36–39 | 元素 vs 化合物半導體觀念釐清 | 02 觀念釐清推導 |
| p.37 | 摻雜濃度 5×10²² × 10⁻⁸ = 5×10¹⁴ | 02 例題 |
| p.40–41 | 質量作用定律、Example 1.2 | 03 載子濃度計算器 |
| p.42–45 | 漂移電流、v_d 與 μ、J_n / J_p | 04 漂移方向實驗室 |
| p.46–48 | J = Q/t 的推導（補充教材） | 04 推導 |
| p.49–51 | 總漂移電流、σ 與 ρ、Example 1.3 | 05 導電度計算器 |
| p.52–54 | 擴散電流、Example 1.4 | 06 擴散電流實驗室 |
| p.55 | Brief Summary：總電流密度四項 | 07 四項組合器 |

## CH1_PART2 核心公式

```
質量作用定律   n₀·p₀ = nᵢ²（熱平衡，與摻雜量無關）
n 型          n₀ ≅ N_d ，p₀ = nᵢ²/N_d          （需 N_d ≫ nᵢ）
p 型          p₀ ≅ N_a ，n₀ = nᵢ²/N_a          （需 N_a ≫ nᵢ）
完整解         n₀ = N_d/2 + √((N_d/2)² + nᵢ²)
漂移速度       v_dn = −μ_n E（與 E 反向）  v_dp = +μ_p E（與 E 同向）
漂移電流密度   J_n = e·n·μ_n·E    J_p = e·p·μ_p·E    兩者皆與 E 同向
總漂移        J = e(n·μ_n + p·μ_p)E ≡ σE = (1/ρ)E
導電度/電阻率  σ = e(n·μ_n + p·μ_p) [(Ω·cm)⁻¹]，ρ = 1/σ [Ω·cm]
擴散電流密度   J_n = +e·D_n·(dn/dx)    J_p = −e·D_p·(dp/dx)
矽的常數       μ_n = 1350、μ_p = 480 cm²/(V·s)；D_n = 35、D_p = 12 cm²/s
總電流密度     J = e(nμ_n + pμ_p)E + e·D_n(dn/dx) − e·D_p(dp/dx)
```

## 講義勘誤紀錄（CH1 PART 2）

1. **載子移動率單位寫成立方**（投影片 p.44 與 p.45，出現兩次）：
   寫成 `μ_n = 1350 cm³/(V−sec)`、`μ_p = 480 cm³/(V−sec)`，
   正確為 **cm²/(V·s)**。由 μ = v/E 反推：(cm/s)/(V/cm) = cm²/(V·s)。
   佐證：同份講義 p.50 貼的課本 Example 1.3 原文即寫 cm²/V–s。數值本身正確。

已重算並確認正確：p.37 摻雜濃度、Example 1.2(a)(b)、p.44 J_n 兩次變號、
Example 1.3（σ = 1.73、J = 173 A/cm²、A = 5.78×10⁻⁶ cm²）、
p.53 擴散公式正負號、Example 1.4（187 A/cm²）。

## CH1 PART 1 補充推導（後續加上）

應要求補上三段完整推導，不只給結論公式：

1. **ni 公式裡的 T^(3/2) 與 2kT 的「2」從哪來**：
   N_c、N_v ∝ T^(3/2) → n·p = N_cN_v·e^(−Eg/kT) → nᵢ² 就是它 →
   開根號後 e 的指數變成 −Eg/**2**kT、T^(3/2)·T^(3/2) 開根號回到 T^(3/2)，
   其餘常數全部打包進 B。
2. **n₀p₀ = nᵢ² 與摻雜量無關的證明**。
3. **n₀ = N_d/2 + √((N_d/2)² + nᵢ²) → n₀ ≈ N_d 的完整推導與成立條件**。

另加兩個可調數字的互動例題：`#ex-ni`（拉 T 與 Eg 看兩項各自的貢獻，附對數長條圖）、
`#ex-np`（拉 N_d 與 T，顯示近似 n₀ ≈ N_d 的誤差百分比與何時失效）。

## 下一份檔案預期銜接

1.1.4 過剩載子（Excess Carriers）→ 1.2 pn 接面（The pn Junction）。
