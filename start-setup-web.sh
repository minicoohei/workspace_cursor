#!/bin/bash

# セットアップWebサーバー起動スクリプト
# SampleCursorProject_NEW - 完全環境セットアップツール

echo "🚀 セットアップWebサーバーを起動します..."
echo "📁 プロジェクトディレクトリ: $(pwd)"
echo ""

# Node.jsの存在確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません"
    echo "📦 Node.jsをインストールしてください:"
    echo "   Mac: brew install node"
    echo "   Ubuntu: sudo apt install nodejs npm"
    echo "   Windows: https://nodejs.org/ からダウンロード"
    exit 1
fi

# npmの存在確認
if ! command -v npm &> /dev/null; then
    echo "❌ npmがインストールされていません"
    echo "📦 npmをインストールしてください"
    exit 1
fi

# package.jsonの存在確認
if [ ! -f "package.json" ]; then
    echo "📦 package.jsonが見つかりません。作成します..."
    cat > package.json << EOF
{
  "name": "samplecursorproject-setup",
  "version": "1.0.0",
  "description": "SampleCursorProject_NEW セットアップツール",
  "main": "setup-web/server.js",
  "scripts": {
    "start": "node setup-web/server.js",
    "dev": "nodemon setup-web/server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["cursor", "setup", "development"],
  "author": "SampleCursorProject_NEW",
  "license": "MIT"
}
EOF
    echo "✅ package.jsonを作成しました"
fi

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm installに失敗しました"
        exit 1
    fi
    echo "✅ 依存関係のインストール完了"
else
    echo "✅ 依存関係は既にインストール済みです"
fi

# サーバーファイルの存在確認
if [ ! -f "setup-web/server.js" ]; then
    echo "❌ setup-web/server.jsが見つかりません"
    exit 1
fi

# ポート3000が使用中かチェック
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  ポート3000は既に使用中です"
    echo "🔄 既存のプロセスを終了してから再起動します..."
    
    # 既存のプロセスを終了
    pkill -f "node setup-web/server.js" 2>/dev/null || true
    sleep 2
fi

echo ""
echo "🌐 セットアップWebサーバーを起動中..."
echo "📍 URL: http://localhost:3000"
echo "🛑 停止するには Ctrl+C を押してください"
echo ""

# サーバー起動
cd "$(dirname "$0")"
node setup-web/server.js

# 終了処理
echo ""
echo "🛑 セットアップWebサーバーを停止しました" 