---
marp: true
size: 16:9
paginate: true
backgroundColor: "var(--color-bg)"
theme: default

style: |
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap");
  :root {
    --color-bg:      #ffffff;
    --color-text:    #202020;
    --color-accent:  #E60033;
    --color-border:  #000000;
    --border-h: 40px;
    --pad-v: 8%;
    --pad-h: 10%;
    --fs-title: 42pt;
    --fs-h2:    30pt;
    --fs-body:  20pt;
    --fs-note:  14pt;
  }

  section {
    font-family: "Noto Sans JP", sans-serif;
    color: var(--color-text);
    background: var(--color-bg);
    padding: var(--pad-v) var(--pad-h);
  }

  .wide-frame { position: relative; }
  .wide-frame::before,
  .wide-frame::after  {
    content: "";
    position: absolute;
    left: 0; right: 0;
    height: var(--border-h);
    background: var(--color-border);
  }
  .wide-frame::before { top: 0; }
  .wide-frame::after  { bottom: 0; }

  h1, h2 { font-weight: 700; }
  h1 { font-size: var(--fs-title); }
  h2 { font-size: var(--fs-h2); }
  p, ul, ol { font-size: var(--fs-body); }

  .accent-line {
    display: inline-block;
    padding-bottom: 4px;
    border-bottom: 6px solid var(--color-accent);
  }

  .logo {
    position: absolute;
    top: 60px;
    right: 60px;
    width: 120px;
  }

  /* 表組みのスタイル強化 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 18pt;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    border-radius: 8px;
    overflow: hidden;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 10px 12px;
    text-align: center;
  }
  
  th {
    background: linear-gradient(135deg, var(--color-accent), #ff4757);
    color: white;
    font-weight: bold;
    font-size: 18pt;
  }
  
  td {
    font-size: 16pt;
  }
  
  tr:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  tr:hover {
    background-color: #e3f2fd;
    transform: scale(1.01);
    transition: all 0.2s ease;
  }

  /* グラフ用スタイル */
  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }
  
  .bar-chart {
    display: flex;
    align-items: end;
    height: 200px;
    gap: 20px;
  }
  
  .bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }
  
  .bar-fill {
    background: linear-gradient(to top, var(--color-accent), #ff6b9d);
    border-radius: 6px 6px 0 0;
    width: 70px;
    display: flex;
    align-items: end;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12pt;
    padding: 6px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: transform 0.3s ease;
  }
  
  .bar-fill:hover {
    transform: translateY(-5px);
  }
  
  .bar-label {
    margin-top: 8px;
    font-size: 14pt;
    font-weight: bold;
    text-align: center;
    color: var(--color-text);
  }

---

<!-- _class: lead wide-frame -->

# <span class="accent-line">マルチエージェント研究</span>
## AI開発の新パラダイム

**Anthropic手法に学ぶ**
*2025年1月15日*

<img src="./images/logo.png" class="logo" alt="ロゴ">

---

<!-- _class: wide-frame -->

## <span class="accent-line">Agenda</span>

1. **マルチエージェントとは**
2. **驚異的な性能向上**
3. **システム設計原則**
4. **プロンプト戦略**
5. **評価・テスト手法**

---

<!-- _class: wide-frame -->

## <span class="accent-line">なぜ今必要か</span>

### 🔍 研究作業の本質的課題
- **予測不可能**: 固定パス対応不可
- **動的探索**: 発見ベース調整必須
- **情報爆発**: 単一Agent限界
- **複雑性増大**: 従来手法の破綻
- **効率要求**: 時間短縮の必要性

### 🚀 AIエージェントの特性
- **自律的判断**: 多ターン意思決定
- **並列処理**: 複数観点同時探索

---

<!-- _class: wide-frame -->

## <span class="accent-line">性能向上データ</span>

### 📊 Anthropic検証結果

| 評価指標 | 単一Agent | マルチAgent | 改善率 |
|---------|-----------|-------------|---------|
| **タスク成功率** | 100% (基準) | **190.2%** | **+90.2%** |
| **処理速度** | 100% (基準) | **110%** | **+10%** |
| **情報収集量** | 100% (基準) | **500%** | **+400%** |
| **Token使用量** | 1× (基準) | **15×** | **+1400%** |

<div class="chart-container">
  <div class="bar-chart">
    <div class="bar">
      <div class="bar-fill" style="height: 60px;">100%</div>
      <div class="bar-label">単一Agent<br/>成功率</div>
    </div>
    <div class="bar">
      <div class="bar-fill" style="height: 114px;">190%</div>
      <div class="bar-label">マルチAgent<br/>成功率</div>
    </div>
    <div class="bar">
      <div class="bar-fill" style="height: 180px;">500%</div>
      <div class="bar-label">情報収集量<br/>向上</div>
    </div>
  </div>
</div>

### 💡 成功の条件
- **並列調査**で真価発揮
- **高価値Task**でコスト正当化
- **大容量情報**で必須

---

<!-- _class: wide-frame -->

## <span class="accent-line">設計の核心</span>

### 🏗️ Orchestrator-Workerパターン

<div style="text-align: center; margin: 30px 0;">
  <div style="background: linear-gradient(135deg, #E60033, #ff6b9d); color: white; padding: 15px 25px; border-radius: 10px; margin: 10px auto; width: 300px; font-weight: bold;">
    📋 Lead Agent (統括・戦略)
  </div>
  <div style="font-size: 20pt; margin: 8px;">↓ 分解・委譲</div>
  <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0;">
    <div style="background: linear-gradient(135deg, #4CAF50, #81C784); color: white; padding: 12px 18px; border-radius: 8px; font-weight: bold;">🔍 Sub Agent A</div>
    <div style="background: linear-gradient(135deg, #2196F3, #64B5F6); color: white; padding: 12px 18px; border-radius: 8px; font-weight: bold;">🔍 Sub Agent B</div>
    <div style="background: linear-gradient(135deg, #FF9800, #FFB74D); color: white; padding: 12px 18px; border-radius: 8px; font-weight: bold;">🔍 Sub Agent C</div>
  </div>
  <div style="font-size: 20pt; margin: 8px;">↓ 結果統合</div>
  <div style="background: linear-gradient(135deg, #9C27B0, #BA68C8); color: white; padding: 15px 25px; border-radius: 10px; margin: 10px auto; width: 280px; font-weight: bold;">
    📝 Citation Agent (出典明記)
  </div>
  <div style="font-size: 20pt; margin: 8px;">↓</div>
  <div style="background: linear-gradient(135deg, #607D8B, #90A4AE); color: white; padding: 15px 25px; border-radius: 10px; margin: 10px auto; width: 200px; font-weight: bold;">
    ✅ 最終回答
  </div>
</div>

### ⚡ 並列化による高速化
- **Sub Agent**: 3-5個同時実行
- **Tool呼出**: 各Agent 3+並列
- **時間短縮**: 最大**90%削減**

---

<!-- _class: wide-frame -->

## <span class="accent-line">Agent数設計指針</span>

| 複雑度レベル | Agent数 | Tool呼出回数 | 処理時間 | 使用例 |
|-------------|---------|-------------|----------|---------|
| **🔍 簡単** | **1個** | **3-10回** | **5-15分** | 基本事実確認 |
| **⚖️ 中程度** | **2-4個** | **10-15回** | **15-30分** | 比較分析 |
| **🌐 複雑** | **10+個** | **20+回** | **30-60分** | 市場調査 |
| **🚀 超複雑** | **15+個** | **50+回** | **1-2時間** | 戦略立案 |

### 💡 スケール原則
- **過少投資防止**: 複雑Task手抜回避
- **過剰投資防止**: 簡単Taskリソース浪費
- **適応配分**: 複雑さ連動調整

---

<!-- _class: wide-frame -->

## <span class="accent-line">Prompt戦略の核心</span>

### 🎯 成功の5原則

| 原則 | 内容 | 効果 |
|------|------|------|
| **🔍 思考理解** | シミュレーション観察 | エージェント動作把握 |
| **📋 委譲技術** | 詳細Task記述 | 重複作業回避 |
| **🔧 Tool設計** | 適切なTool選択 | **40%効率向上** |
| **🌐 広範→絞込** | 段階的情報収集 | 精度向上 |
| **⚡ 並列処理** | 同時実行最大化 | **90%時間短縮** |

### 📝 実践Template
```
【戦略】Tool確認→複雑さ評価→Agent数決定
【指示】目標→Format→Tool→境界
【評価】結果検証→改善点抽出→次回反映
```

---

<!-- _class: wide-frame -->

## <span class="accent-line">評価戦略</span>

### 📊 3段階Approach

| Phase | 規模 | 手法 | 目的 |
|-------|------|------|------|
| **初期** | **20件** | 手動観察 | 大効果迅速検出 |
| **中期** | **100件** | LLM判定器 | Scale自動評価 |
| **精密** | **継続** | 人間評価 | Edge Case発見 |

### 🎯 LLM判定器5軸評価
- **事実性** / **引用精度** / **完全性**
- **情報源品質** / **効率性**
- **0.0-1.0Score** + **Pass/Fail**

---

<!-- _class: wide-frame -->

## <span class="accent-line">本番環境課題</span>

### ⚠️ 主要技術課題

| 課題 | 影響 | 対策 |
|------|------|------|
| **状態管理** | Error蓄積 | Checkpoint+適応処理 |
| **Debug困難** | 非決定実行 | 全Trace+監視 |
| **Deploy複雑** | 実行中断 | Rainbow Deploy |

### 🛡️ 実装必須機能
- **耐障害性**: 再開可能設計
- **観測性**: Real Time監視
- **段階Deploy**: 影響最小化

---

<!-- _class: wide-frame -->

## <span class="accent-line">活用判定指針</span>

### ✅ 効果的ケース
- 並列調査必要
- 情報量 > 単一Context
- 複雑Tool連携必須
- 高価値Task (Cost正当化可能)

### ❌ 避けるべきケース
- 共有Context必須
- Agent間密結合
- 単純Task (投資効果不良)

### 🚀 実装Steps
**小規模Prototype** → **段階拡張** → **本番化**

---

<!-- _class: wide-frame -->

## <span class="accent-line">まとめ & Next Action</span>

### 🎯 重要な洞察

| 要素 | 影響度 | 実装難易度 | 優先度 |
|------|--------|------------|--------|
| **Token量最適化** | **80%** | 中 | 🔥 高 |
| **並列処理設計** | **90%時短** | 高 | 🔥 高 |
| **Prompt設計** | 品質決定 | 中 | ⚡ 中 |
| **段階的評価** | 継続改善 | 低 | ✅ 低 |

### 🚀 実装ロードマップ

**Phase 1 (1-2週間)**: 20件TestCase作成・検証
**Phase 2 (2-4週間)**: Console環境構築・観察
**Phase 3 (1-2ヶ月)**: PromptTemplate適用・最適化
**Phase 4 (継続)**: 本番運用・スケールアップ

### 💡 成功への鍵
> **マルチAgentは複雑問題解決の新標準**
> 
> 投資対効果を見極めた戦略的導入が重要