# 📁 ディレクトリ構造

```
SampleCursorProject_NEW/
├── 📂 .cursor/                    # Cursor IDE設定
│   ├── 📄 mcp.json               # MCPサーバー設定
│   ├── 📂 rules/                 # Project Rules
│   │   └── 📄 global.mdc         # 統合ルール（kinopeee v5ベース）
│   └── 📄 indexing-docs.json     # ドキュメントインデックス
│
├── 📂 .vscode/                    # VSCode/Cursor拡張機能設定
│   ├── 📄 settings.json          # エディタ設定
│   └── 📄 extensions.json        # 推奨拡張機能リスト
│
├── 📂 config/                     # 各種設定ファイル
│   ├── 📄 env.local.template     # 環境変数テンプレート
│   └── 📄 .marprc.yml            # Marp CLI設定
│
├── 📂 docs/                       # ドキュメント
│   └── 📂 setup/                 # セットアップ関連
│       ├── 📄 MCP_SERVERS_SETUP.md    # MCPサーバー設定ガイド
│       ├── 📄 MCP_TIME_SETUP.md       # MCPタイムサーバーガイド
│       └── 📄 SECURITY_CHECK.md       # セキュリティチェック
│
├── 📂 samples/                    # サンプルファイル
│   ├── 📂 marp/                  # Marpスライドサンプル
│   │   └── 📄 marp_preview_sample.md
│   └── 📂 jupyter/               # Jupyterノートブックサンプル
│       └── 📄 jupyter_sample.ipynb
│
├── 📂 CursorCourse/              # Cursor学習コンテンツ
│   ├── 📂 Chapter1_Documentation/
│   ├── 📂 Chapter2_LiveCoding/
│   └── 📄 README.md
│
├── 📂 ObsidianVault/             # Obsidianドキュメント
│   ├── 📂 Templates/             # テンプレート集（0001-0013）
│   ├── 📂 Documents/
│   └── 📂 WorkLog/
│
├── 📂 mcp-time/                  # MCPタイムサーバー
│   ├── 📄 docker-compose.yml
│   ├── 📄 Dockerfile
│   └── 📂 mcp-time/
│       └── 📂 src/
│
├── 📂 scripts/                   # ユーティリティスクリプト
│   ├── 📄 build_slides.sh        # Marpビルドスクリプト
│   └── 📂 utils/
│
├── 📂 setup-web/                 # Webセットアップツール
│
├── 🔧 セットアップスクリプト
│   ├── 📄 setup_complete_environment.sh  # 完全環境セットアップ
│   ├── 📄 setup_cursor_environment.sh    # 基本Cursorセットアップ
│   ├── 📄 setup.sh                       # レガシーセットアップ
│   └── 📄 start-setup-web.sh             # Webセットアップ起動
│
├── 📄 README.md                  # プロジェクト概要
├── 📄 .cursorrules              # レガシーCursorルール
├── 📄 .gitignore                # Git除外設定
├── 📄 package.json              # Node.js設定
├── 📄 technologystack.md        # 技術スタック定義
└── 📄 安全ガイドライン.md        # 安全使用ガイド
```

## 📌 主要ディレクトリの説明

### 🎯 設定関連
- **`.cursor/`**: Cursor IDEの設定（MCP、Rules、インデックス）
- **`.vscode/`**: エディタ設定と拡張機能
- **`config/`**: 各種設定ファイル（環境変数、Marp等）

### 📚 ドキュメント
- **`docs/setup/`**: セットアップ関連のガイド
- **`samples/`**: 使用例とサンプルファイル
- **`ObsidianVault/Templates/`**: 0001-0013のテンプレート集

### 🛠️ 開発環境
- **`mcp-time/`**: タイムスタンプMCPサーバー
- **`scripts/`**: 便利なスクリプト集
- **`setup-web/`**: ブラウザベースのセットアップツール

### 🎓 学習コンテンツ
- **`CursorCourse/`**: 段階的な学習教材
- **`ObsidianVault/`**: ナレッジベース

## 🚀 クイックスタート

1. **プロジェクトをクローン**
2. **`bash setup_complete_environment.sh`を実行**
3. **`config/env.local.template`を`.env.local`にコピーして設定**
4. **Cursorを再起動**

---
最終更新: 2025-07-10 23:30:00 JST 