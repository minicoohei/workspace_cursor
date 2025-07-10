#!/bin/bash

# セットアップWebツール起動スクリプト

# カラー出力用の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 セットアップWebツールを起動します...${NC}"

# 現在のディレクトリを確認
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${GREEN}📁 プロジェクトディレクトリ: ${SCRIPT_DIR}${NC}"

# Node.jsの確認
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.jsがインストールされていません${NC}"
    echo -e "${YELLOW}💡 Node.jsをインストールしてください:${NC}"
    echo "  macOS: brew install node"
    echo "  Windows: winget install OpenJS.NodeJS"
    echo "  Linux: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# npmの確認
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npmがインストールされていません${NC}"
    echo -e "${YELLOW}💡 Node.jsと一緒にnpmをインストールしてください${NC}"
    exit 1
fi

# setup-webディレクトリに移動
cd "${SCRIPT_DIR}/setup-web"

# package.jsonの確認・作成
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}📦 package.jsonが見つかりません。作成します...${NC}"
    
    cat > package.json << 'EOF'
{
  "name": "setup-web-tool",
  "version": "1.0.0",
  "description": "Cursor環境セットアップWebツール",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "keywords": ["cursor", "setup", "development"],
  "author": "SampleCursorProject_NEW",
  "license": "MIT"
}
EOF
    
    echo -e "${GREEN}✅ package.jsonを作成しました${NC}"
fi

# 依存関係のインストール
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 依存関係をインストール中...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 依存関係のインストールが完了しました${NC}"
    else
        echo -e "${RED}❌ 依存関係のインストールに失敗しました${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ 依存関係は既にインストールされています${NC}"
fi

# ポート確認
PORT=3000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
    echo -e "${YELLOW}⚠️  ポート$PORTは既に使用されています${NC}"
    echo -e "${YELLOW}💡 既存のプロセスを終了するか、別のポートを使用してください${NC}"
    
    # 既存のプロセスを確認
    PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t)
    if [ ! -z "$PID" ]; then
        echo -e "${BLUE}🔍 ポート$PORTを使用中のプロセス: PID $PID${NC}"
        read -p "このプロセスを終了しますか？ (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill $PID
            echo -e "${GREEN}✅ プロセスを終了しました${NC}"
            sleep 2
        else
            echo -e "${YELLOW}⚠️  別のポートを使用してください${NC}"
            exit 1
        fi
    fi
fi

# サーバー起動
echo -e "${BLUE}🚀 セットアップWebサーバーを起動中...${NC}"
echo -e "${GREEN}📍 URL: http://localhost:$PORT${NC}"
echo -e "${YELLOW}💡 ブラウザで上記URLにアクセスしてください${NC}"
echo -e "${YELLOW}💡 停止するには Ctrl+C を押してください${NC}"
echo ""

# ブラウザを自動で開く（macOSの場合）
if [[ "$OSTYPE" == "darwin"* ]]; then
    sleep 2
    open "http://localhost:$PORT" &
fi

# サーバー起動
node server.js 