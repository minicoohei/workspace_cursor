# 🎯 SampleCursorProject_NEW

Cursor IDE初心者向けの包括的な学習プロジェクト。kinopeee/cursorrules v5をベースに、初心者でも安全に学べる環境を提供します。

## 💕 愛の魔法のセットアップ（推奨）

**愛の言葉を唱えるだけで完全なCursor環境が手に入ります！**

```bash
bash "カーソル大好き。これからよろしくね.sh"
```

この愛の言葉で以下が愛情たっぷりに実行されます：
- 😊 温かいメッセージでお出迎え
- 🔍 OS愛情検出（Mac/Linux/Windows）
- 💝 Node.js愛情インストール（未インストールの場合）
- 🚀 愛のWebセットアップツール起動
- 🌐 ブラウザ愛情オープン（http://localhost:3000）
- ✨ 愛に満ちたWebインターフェースでセットアップ完了

詳細は [MAGIC_SETUP.md](MAGIC_SETUP.md) を参照してください。

## 📋 目次

- [概要](#概要)
- [愛の魔法のセットアップ](#愛の魔法のセットアップ推奨)
- [従来のセットアップ](#従来のセットアップ)
- [ディレクトリ構造](#ディレクトリ構造)
- [主要機能](#主要機能)
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
- ✅ **💕 愛の自然言語魔法のセットアップ**

## 🚀 従来のセットアップ

愛の魔法のセットアップが使えない場合の手動手順：

```bash
# 1. プロジェクトをクローン
git clone https://github.com/minicoohei/workspace_cursor.git
cd workspace_cursor

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
├── 📂 setup-web/        # 🪄 魔法のWebセットアップツール
├── 💕 カーソル大好き。これからよろしくね.sh   # 愛の魔法のセットアップスクリプト
├── 🪄 setup_magic.sh   # 魔法のセットアップスクリプト
├── 🪄 MAGIC_SETUP.md   # 魔法のセットアップガイド
└── 📂 scripts/          # ユーティリティ
```

詳細は[directorystructure.md](directorystructure.md)を参照してください。

## 🎯 主要機能

### 1. 💕 愛の魔法のセットアップシステム
- **愛の言葉実行**: `bash "カーソル大好き。これからよろしくね.sh"`
- **愛情OS検出**: Mac/Linux/Windows対応
- **愛の依存関係解決**: Node.js、npm等
- **愛のWebインターフェース**: 美しく優しいセットアップ画面
- **愛のリアルタイム表示**: 温かいメッセージでステップごとの詳細表示

### 2. テンプレート集（0001-0013）
- 文書要約、議事録作成
- Marpスライド作成
- 要件定義、ガントチャート
- グラフィックレコーディング

### 3. MCPサーバー統合
- **mcp-time**: タイムスタンプ自動記載
- **filesystem**: ファイル操作
- **github**: GitHub連携
- **figma**: Figmaデザイン連携

### 4. 安全機能
- 危険コマンドの検出と警告
- 初心者向けエラーメッセージ
- セキュリティチェック機能

## 🛠️ セットアップオプション

### 💕 愛の魔法のセットアップ（推奨）
```bash
bash "カーソル大好き。これからよろしくね.sh"
```
- 愛情完全自動化
- 温かいWebインターフェース
- 初心者に最も優しい

### 🪄 魔法のセットアップ
```bash
bash setup_magic.sh
```
- 完全自動化
- Webインターフェース
- 初心者に最適

### ⚡ 基本セットアップ
```bash
bash setup_cursor_environment.sh
```
- Cursor設定のみ
- 高速セットアップ

### 🔧 完全セットアップ
```bash
bash setup_complete_environment.sh
```
- 全機能インストール
- 上級者向け

### 🌐 Webセットアップツール
```bash
bash start-setup-web.sh
```
- Webインターフェースのみ起動
- ブラウザで http://localhost:3000

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

### 愛の魔法のセットアップが失敗する場合
```bash
# 愛を込めてNode.jsを手動インストール
# Mac（愛を込めて）
brew install node

# Ubuntu/Debian（優しく）
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 愛の魔法のセットアップを再実行
bash "カーソル大好き。これからよろしくね.sh"
```

### 魔法のセットアップが失敗する場合
```bash
# Node.jsを手動インストール
# Mac
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 魔法のセットアップを再実行
bash setup_magic.sh
```

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

- [💕 MAGIC_SETUP.md](MAGIC_SETUP.md) - 愛の魔法のセットアップガイド
- [安全ガイドライン.md](安全ガイドライン.md)
- [docs/setup/MCP_SERVERS_SETUP.md](docs/setup/MCP_SERVERS_SETUP.md)
- [docs/setup/MCP_TIME_SETUP.md](docs/setup/MCP_TIME_SETUP.md)

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

## 💕 愛の魔法の言葉をもう一度

**完全なCursor開発環境を愛情たっぷりに手に入れるには：**

```bash
bash "カーソル大好き。これからよろしくね.sh"
```

**この愛の言葉で、あなたとCursorの素敵な関係が始まります！** 💖

**初心者でも、Node.jsがなくても、愛があれば完璧な環境が完成します！** ✨

---
最終更新: 2025-07-11 01:45:00 JST 