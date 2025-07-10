#!/bin/bash

# 🎯 SampleCursorProject_NEW - Webセットアップツール起動スクリプト

echo "🚀 Webセットアップツールを起動します..."

# プロジェクトルートディレクトリを取得
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

# setup-webディレクトリの確認
if [ ! -d "setup-web" ]; then
    echo "❌ エラー: setup-webディレクトリが見つかりません"
    exit 1
fi

# Python3の確認
if ! command -v python3 &> /dev/null; then
    echo "❌ エラー: Python3がインストールされていません"
    echo "Homebrewでインストールする場合: brew install python3"
    exit 1
fi

# ポート8080が使用中かチェック
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  ポート8080が既に使用されています"
    echo "別のプロセスを終了するか、別のポートを使用してください"
    exit 1
fi

# Webサーバーを起動
echo "📡 Webサーバーを起動中..."
echo "ブラウザで http://localhost:8080 にアクセスしてください"
echo ""
echo "終了するには Ctrl+C を押してください"
echo ""

# setup-webディレクトリに移動してサーバーを起動
cd setup-web
python3 -m http.server 8080

---
最終更新: 2025-07-10 23:45:00 JST 