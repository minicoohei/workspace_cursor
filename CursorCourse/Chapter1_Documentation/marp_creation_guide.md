# Cursor to Marp - プロジェクト版

CursorのAIアシスタントを使用して、MarkdownファイルからMarpスライドを簡単に生成するワークフローです。

## 📁 ファイル構造

```
SampleCursorProject_NEW/
├── .cursor/
│   ├── rules/
│   │   └── global.mdc                 # グローバルルール
│   └── settings.json                  # Cursor設定
├── ObsidianVault/
│   └── Templates/                     # テンプレートファイル群
│       ├── 0004_Marpテンプレート_基本.md
│       ├── 0005_Marpスライド生成ルール.md
│       ├── 0006_Marp作成ガイド_CursorAI版.md
│       ├── 0007_Marp作成ガイド_ObsidianVault版.md
│       └── 0008_プレゼンテーション実例_マルチエージェント研究.md
├── CursorCourse/
│   └── Chapter1_Documentation/
│       ├── marp_template.md           # Marpテンプレート
│       ├── marp_creation_guide.md     # このファイル
│       ├── slide_rules.md             # スライド生成ルール
│       └── presentation_example.md    # プレゼンテーション例
├── SmapleFile_input/                  # 入力ファイル用ディレクトリ
│   └── *.md                          # 変換したいMarkdownファイル
└── README.md                          # プロジェクト説明
```

## 🚀 セットアップ

### 1. 前提条件
- [Cursor](https://cursor.sh/)のインストール
- VS Code拡張機能「Marp for VS Code」の追加
- 推奨テーマの設定（オプション）

### 2. テーマ設定（オプション）
VS CodeのSettings > Markdown > Marp: Themesに以下を追加：
```
https://cunhapaulo.github.io/style/freud.css
```

### 3. 人気のテーマ
- gradient
- beamer
- border
- dracula
- speee
- plato
- heidegger

## 🎯 基本的な使い方

### Step 1: 入力ファイルの準備
1. `SmapleFile_input/`に変換したいMarkdownファイルを配置
2. または任意の場所にあるMarkdownファイルを使用

### Step 2: ルールの適用
CursorのAIチャットで以下のようにルールを設定：
```
@0005_Marpスライド生成ルール.md を使用してスライドを生成してください
```
または
```
@slide_rules.md を使用してスライドを生成してください
```

### Step 3: スライドの生成
CursorのAIチャットに以下のように指示：
```
@[対象ファイル名].md を元にスライド生成
```

## 📋 生成されるスライドの特徴

- **形式**: 16:9ワイド形式
- **スタイル**: 上下黒縁 + アクセントライン
- **フォント**: Noto Sans JP（日本語最適化）
- **構成**: タイトル → アジェンダ → 本文 → まとめ
- **文字数**: 見出し13文字以内、適切な情報量

## 🖼️ 画像の使用

1. 画像ファイルを適切なディレクトリに配置
   - `CursorCourse/Chapter1_Documentation/images/`
   - または相対パスで参照可能な場所
2. スライドでは相対パス`./images/filename.png`で参照
3. ロゴ画像は推奨

## ⚠️ 注意事項

### 日本語対応
- フォント: 'Noto Sans JP'使用
- 文字化け防止のためのエンコーディング対応

### スライド品質
- 1スライドあたり最大5個の要点
- 表は4列以内
- 箇条書きは2階層まで

### ファイル命名
- 自動生成されるファイル名: `YYYYMMDD_タイトル.md`
- 手動での調整も可能

## 🛠️ カスタマイズ

### テンプレートの編集
- `marp_template.md`: 基本構造のカスタマイズ
- `0004_Marpテンプレート_基本.md`: より詳細なテンプレート

### ルールの調整
- `slide_rules.md`: Chapter1用の生成ルール
- `0005_Marpスライド生成ルール.md`: ObsidianVault用の生成ルール

## 📊 活用例

### 技術プレゼンテーション
- エンジニア向け勉強会
- チーム内技術共有
- カンファレンス発表

### ビジネスプレゼンテーション
- 企画提案
- 進捗報告
- 研修資料

## 🔗 参考リンク

- [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- [Cursor-to-Marp 元リポジトリ](https://github.com/Kumaiu/cursor-to-marp)
- [Marp公式ドキュメント](https://marp.app/)

---
最終更新: 2025-07-10 21:57:00 JST