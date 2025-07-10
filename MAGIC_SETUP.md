# ✨ 魔法のセットアップ - SampleCursorProject_NEW

## 🪄 魔法の言葉（Cursorに貼り付けてください）

Cursorのターミナルで以下のコマンドを実行するだけで、すべてが自動で始まります：

```bash
bash setup_magic.sh
```

## 🎯 この魔法の言葉で何が起こるか

1. **🔍 環境チェック**
   - OS自動検出（Mac/Linux/Windows）
   - Node.js存在確認

2. **📦 自動インストール**
   - Node.jsが未インストール → 自動インストール
   - 依存関係の自動インストール
   - package.json自動生成

3. **🚀 Webツール起動**
   - Node.jsサーバー自動起動
   - ブラウザ自動オープン（http://localhost:3000）
   - 美しいWebインターフェース表示

4. **✨ セットアップ実行**
   - Webから「完全環境セットアップ」ボタンクリック
   - リアルタイム進行状況表示
   - 自動でCursor環境完成

## 🛠️ OS別サポート

### 🍎 Mac
- Homebrew自動インストール
- Node.js自動インストール
- ブラウザ自動オープン

### 🐧 Linux
- NodeSource repository追加
- apt/yum対応
- xdg-open対応

### 🪟 Windows
- インストール手順ガイド
- Chocolatey対応案内
- 手動確認フロー

## 🎉 完了後の状態

- ✅ Cursor IDE完全設定済み
- ✅ VSCode拡張機能インストール済み
- ✅ Marp環境構築済み
- ✅ Jupyter環境構築済み
- ✅ MCPサーバー設定済み
- ✅ Git hooks設定済み
- ✅ セキュリティ設定適用済み

---

## 🚨 トラブルシューティング

### Node.jsインストールに失敗した場合
```bash
# Mac
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# https://nodejs.org/ からダウンロード
```

### 権限エラーが発生した場合
```bash
# スクリプトに実行権限を付与
chmod +x setup_magic.sh

# 再実行
bash setup_magic.sh
```

### ポート3000が使用中の場合
```bash
# 既存プロセスを終了
pkill -f "node setup-web/server.js"

# 再実行
bash setup_magic.sh
```

---

## 💡 上級者向け

### 直接Node.jsサーバー起動
```bash
npm run start
```

### 開発モード（自動リロード）
```bash
npm run dev
```

### 完全リセット
```bash
rm -rf node_modules package-lock.json
bash setup_magic.sh
```

---

**🪄 魔法の言葉をもう一度：**
```bash
bash setup_magic.sh
```

**たったこれだけで、完全なCursor開発環境が手に入ります！** ✨

---
最終更新: 2025-07-11 01:30:00 JST 