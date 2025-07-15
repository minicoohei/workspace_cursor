---
marp: true
theme: default
paginate: true
header: ''
footer: ''
style: |
  /* Minto風デザインテンプレート（正しい色味） */
  
  /* 基本設定 */
  section {
    background: #ffffff;
    color: #333333;
    font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', sans-serif;
    font-size: 24px;
    line-height: 1.6;
    padding: 60px 80px;
  }
  
  /* Mintoカラーパレット */
  :root {
    --minto-primary: #4ECDC4;
    --minto-secondary: #26D0CE;
    --minto-accent: #1BA3A3;
    --minto-light: #E0F7F5;
    --minto-gradient: linear-gradient(135deg, #4ECDC4 0%, #26D0CE 100%);
  }
  
  /* タイトルスライド */
  section.title {
    background: var(--minto-gradient);
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  section.title h1 {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 30px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  section.title h2 {
    font-size: 28px;
    font-weight: normal;
    opacity: 0.9;
    margin-bottom: 40px;
  }
  
  /* 会社情報グリッド */
  section.company-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 20px 30px;
    align-items: center;
  }
  
  .info-label {
    font-weight: bold;
    color: var(--minto-primary);
    font-size: 18px;
  }
  
  .info-value {
    font-size: 20px;
    color: #333;
  }
  
  /* 統計情報カード */
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    margin: 40px 0;
  }
  
  .stat-card {
    background: var(--minto-light);
    border: 2px solid var(--minto-primary);
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
    background: var(--minto-primary);
    color: white;
  }
  
  .stat-card:hover .stat-number,
  .stat-card:hover .stat-label {
    color: white;
  }
  
  .stat-number {
    font-size: 36px;
    font-weight: bold;
    color: var(--minto-primary);
    display: block;
    margin-bottom: 10px;
    transition: color 0.3s ease;
  }
  
  .stat-label {
    font-size: 16px;
    color: #666;
    font-weight: normal;
    transition: color 0.3s ease;
  }
  
  /* プロセスフロー */
  .process-flow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40px 0;
  }
  
  .process-step {
    flex: 1;
    text-align: center;
    position: relative;
  }
  
  .process-step:not(:last-child)::after {
    content: '→';
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    color: var(--minto-primary);
  }
  
  .step-circle {
    width: 60px;
    height: 60px;
    background: var(--minto-gradient);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
  }
  
  .step-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }
  
  .step-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
  
  /* 職種別構成 */
  .role-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    margin: 30px 0;
  }
  
  .role-item {
    background: var(--minto-light);
    border-left: 4px solid var(--minto-primary);
    padding: 20px;
    border-radius: 0 8px 8px 0;
    transition: all 0.3s ease;
  }
  
  .role-item:hover {
    background: var(--minto-primary);
    color: white;
    transform: translateX(5px);
  }
  
  .role-item:hover .role-title,
  .role-item:hover .role-count {
    color: white;
  }
  
  .role-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    transition: color 0.3s ease;
    line-height: 1.3;
  }
  
  .role-count {
    font-size: 20px;
    font-weight: bold;
    color: var(--minto-primary);
    transition: color 0.3s ease;
  }
  
  /* 円グラフ風表示 */
  .chart-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 40px 0;
  }
  
  .chart-item {
    text-align: center;
  }
  
  .chart-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-size: 24px;
    font-weight: bold;
    color: white;
    box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
  }
  
  .chart-primary { background: var(--minto-primary); }
  .chart-secondary { background: var(--minto-secondary); }
  .chart-accent { background: var(--minto-accent); }
  
  /* 強調ボックス */
  .highlight-box {
    background: var(--minto-gradient);
    color: white;
    padding: 30px;
    border-radius: 12px;
    margin: 30px 0;
    text-align: center;
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
  }
  
  .highlight-box h3 {
    font-size: 28px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  
  .highlight-box p {
    font-size: 18px;
    opacity: 0.9;
    line-height: 1.5;
  }
  
  /* 特徴リスト（猫のシルエット風） */
  .feature-list {
    background: var(--minto-light);
    padding: 30px;
    border-radius: 12px;
    margin: 30px 0;
    position: relative;
  }
  
  .feature-list::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid var(--minto-light);
  }
  
  /* リスト装飾 */
  ul li {
    margin-bottom: 12px;
    position: relative;
    padding-left: 25px;
  }
  
  ul li::before {
    content: '●';
    color: var(--minto-primary);
    position: absolute;
    left: 0;
    top: 0;
  }
  
  /* テーブル装飾 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 30px 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(78, 205, 196, 0.1);
  }
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid var(--minto-light);
  }
  
  th {
    background: var(--minto-primary);
    color: white;
    font-weight: bold;
  }
  
  tr:hover {
    background: var(--minto-light);
  }
  
  /* ページネーション */
  section::after {
    color: var(--minto-primary);
    font-weight: bold;
  }
---

<!-- _class: title -->
# Minto風デザインテンプレート

## 水野さん向け効率化講座
### 2025-07-15

---

## 📋 講座全体構成

| 回数 | 内容 | 時間 | 重点項目 |
|------|------|------|----------|
| **1回目** | 基盤構築とツール導入 | 2時間 | Cursor 環境・基本操作 |
| **2回目** | 高度な自動化と実践応用 | 2時間 | Claude Code・Live Coding |
| **3回目** | 統合・最適化（オプション） | 2時間 | 1~2回目＋更なる深掘り課題 |

---

<!-- _class: company-info -->
## 🏢 研修環境情報

<div class="info-grid">
  <div class="info-label">環境名</div>
  <div class="info-value">work_space</div>

  
  <div class="info-label">主要技術</div>
  <div class="info-value">Cursor, MCP, Claude Code, Tmux</div>
  
  <div class="info-label">所在地</div>
  <div class="info-value">~/Documents/WorkSpace/work_space</div>
  
  <div class="info-label">主要フォルダ</div>
  <div class="info-value">setup-web/, CursorCourse/, ObsidianVault/</div>
  
  <div class="info-label">テンプレート数</div>
  <div class="info-value">13種類（0001-0013）</div>
</div>

---

## 👥 学習内容別時間配分

<div class="role-grid">
  <div class="role-item">
    <div class="role-title">環境構築</div>
    <div class="role-count">30分</div>
  </div>
  <div class="role-item">
    <div class="role-title">ツール紹介<br/>Obsidian</div>
    <div class="role-count">20分</div>
  </div>
  <div class="role-item">
    <div class="role-title">自動化実践<br/>Marp</div>
    <div class="role-count">20分</div>
  </div>
  <div class="role-item">
    <div class="role-title">AquaVoice<br/>Draw.io</div>
    <div class="role-count">20分</div>
  </div>
  <div class="role-item">
    <div class="role-title">まとめ</div>
    <div class="role-count">10分</div>
  </div>
  <div class="role-item">
    <div class="role-title">質疑応答<br/>次回について</div>
    <div class="role-count">20分</div>
  </div>
</div>

---

## 🎯 講座の特徴

<div class="feature-list">

### 学習内容
- **環境構築**: Cursor + work_space セットアップ
- **ツール習得**: Obsidian, Marp, Draw.io 活用
- **自動化実践**: MCP連携と効率化

### 学習効果
- 統合された環境による効率化
- 実践的なスキル習得
- 継続的な改善サイクル

### 特徴
- 魔法のセットアップ機能
- 段階的な学習プロセス
- 個別サポート体制

</div>

---

## 🎯 重要ポイント

  <div class="highlight-box">
    <h3>受講者体験にこだわった学習プロセス</h3>
    <p>学習期間の目安は2〜4週間です。<br>
    すべての段階で丁寧なサポートを行い、<br>
    誠実なコミュニケーションを大切にしています。</p>
  </div>

### 学習の目標
- 習得ではなく、実務での活用がゴールだと考えています
- 実際の業務で活用していただくためにも、気になる点や解消しておきたい不安があれば、学習中にぜひご質問・ご相談ください

---

## 🛠️ 必須ツール一覧

- **Cursor**: メイン開発環境
- **Obsidian**: 情報管理・Wiki化
- **Draw.io**: 図表作成
- **Marp**: プレゼンテーション作成
- **AquaVoice**: 音声入力
- **MCP**: 外部サービス連携
- **GitHub Actions**: 自動化ワークフロー
- **Tmux**: ターミナル管理

---

## 🎉 まとめ

### 講座で身につくスキル
- ✅ Cursor環境での効率的開発
- ✅ MCP活用による外部サービス連携  
- ✅ 実務に即した自動化スクリプト作成
- ✅ 継続的な効率化改善サイクル

### 次のステップ
1. **短期（1ヶ月）**: 基本ツールの習熟
2. **中期（3ヶ月）**: 高度な自動化の実装  
3. **長期（6ヶ月）**: 独自システムの構築

**Happy Coding & Automation! 🚀**

---
最終更新: 2025-07-15 JST 