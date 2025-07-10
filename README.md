# 🎯 SampleCursorProject_NEW

Cursor IDE初心者向けの包括的な学習プロジェクト。kinopeee/cursorrules v5をベースに、初心者でも安全に学べる環境を提供します。

## 📋 目次

- [概要](#概要)
- [クイックスタート](#クイックスタート)
- [ディレクトリ構造](#ディレクトリ構造)
- [主要機能](#主要機能)
- [セットアップ](#セットアップ)
- [使い方](#使い方)
- [トラブルシューティング](#トラブルシューティング)

## 🌟 概要

このプロジェクトは、Cursor IDEを使った開発を段階的に学べる教材です。

### 特徴
- ✅ 初心者向け安全設計（危険コマンドの警告）
- ✅ 13種類の実践的テンプレート
- ✅ 自動環境セットアップ
- ✅ MCPサーバー統合（タイムスタンプ、GitHub、Slack等）
- ✅ kinopeee/cursorrules v5統合

## 🚀 クイックスタート

```bash
# 1. プロジェクトをクローン
git clone https://github.com/yourusername/SampleCursorProject_NEW.git
cd SampleCursorProject_NEW

# 2. 完全環境セットアップを実行
bash setup_complete_environment.sh

# 3. 環境変数を設定
cp config/env.local.template .env.local
# .env.localを編集してAPIキーを設定

# 4. Cursorを再起動
```

## 📁 ディレクトリ構造

```
SampleCursorProject_NEW/
├── 📂 .cursor/          # Cursor IDE設定
├── 📂 .vscode/          # エディタ設定
├── 📂 config/           # 各種設定ファイル
├── 📂 docs/             # ドキュメント
├── 📂 samples/          # サンプルファイル
├── 📂 CursorCourse/     # 学習コンテンツ
├── 📂 ObsidianVault/    # ナレッジベース
├── 📂 mcp-time/         # MCPタイムサーバー
└── 📂 scripts/          # ユーティリティ
```

詳細は[directorystructure.md](directorystructure.md)を参照してください。

## 🎯 主要機能

### 1. テンプレート集（0001-0013）
- 文書要約、議事録作成
- Marpスライド作成
- 要件定義、ガントチャート
- グラフィックレコーディング

### 2. MCPサーバー統合
- **mcp-time**: タイムスタンプ自動記載
- **filesystem**: ファイル操作
- **github**: GitHub連携
- **slack**: Slack通知
- その他多数

### 3. 安全機能
- 危険コマンドの検出と警告
- 初心者向けエラーメッセージ
- セキュリティチェック機能

## 🛠️ セットアップ

### 基本セットアップ
```bash
bash setup_cursor_environment.sh
```

### 完全セットアップ（推奨）
```bash
bash setup_complete_environment.sh
```

### 手動セットアップ
詳細は以下のドキュメントを参照：
- [MCP_SERVERS_SETUP.md](docs/setup/MCP_SERVERS_SETUP.md)
- [MCP_TIME_SETUP.md](docs/setup/MCP_TIME_SETUP.md)

## 📖 使い方

### テンプレートの使用
```
@0001  # 文書要約テンプレートを参照
@0004  # Marpスライドテンプレートを参照
```

### MCPタイムサーバーの起動
```bash
cd mcp-time
docker-compose up -d
```

### Marpスライドの作成
```bash
cd samples/marp
marp marp_preview_sample.md -o output.html
```

## 🔧 トラブルシューティング

### Cursorが設定を認識しない
1. Cursorを完全に終了
2. `~/.cursor/` ディレクトリを確認
3. Cursorを再起動

### MCPサーバーが動作しない
1. Docker Desktopが起動しているか確認
2. ポート5000が使用されていないか確認
3. `docker-compose logs`でエラーを確認

### APIキーエラー
1. `.env.local`ファイルを確認
2. 環境変数名が正しいか確認
3. APIキーの有効性を確認

## 📚 関連ドキュメント

- [安全ガイドライン.md](安全ガイドライン.md)
- [technologystack.md](technologystack.md)
- [SECURITY_CHECK.md](docs/setup/SECURITY_CHECK.md)

## 🤝 貢献

プルリクエストを歓迎します！
1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---
最終更新: 2025-07-10 23:30:00 JST 