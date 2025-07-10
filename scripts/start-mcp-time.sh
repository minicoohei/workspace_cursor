#!/bin/bash
# MCPタイムサーバー起動スクリプト

# カラー出力用の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 MCPタイムサーバーの起動を開始します...${NC}"

# Dockerがインストールされているかチェック
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Dockerがインストールされていません${NC}"
    echo -e "${YELLOW}📦 代替手段として直接Pythonで実行します...${NC}"
    
    # Python環境のチェック
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python3もインストールされていません${NC}"
        echo -e "${YELLOW}💡 解決方法:${NC}"
        echo "1. Dockerをインストール: https://docs.docker.com/desktop/install/mac-install/"
        echo "2. またはPython3をインストール: brew install python3"
        exit 1
    fi
    
    # Python直接実行モード
    echo -e "${GREEN}🐍 Python直接実行モードで起動します${NC}"
    
    # 必要なパッケージのインストール
    echo -e "${BLUE}📦 必要なパッケージをインストール中...${NC}"
    pip3 install fastmcp pytz 2>/dev/null || {
        echo -e "${YELLOW}⚠️  pip3でのインストールに失敗しました。pipを試します...${NC}"
        pip install fastmcp pytz 2>/dev/null || {
            echo -e "${RED}❌ パッケージのインストールに失敗しました${NC}"
            echo "手動でインストールしてください: pip3 install fastmcp pytz"
            exit 1
        }
    }
    
    # MCPサーバーを直接実行
    echo -e "${GREEN}🚀 MCPタイムサーバーを起動中...${NC}"
    cd "$(dirname "$0")/../mcp-time/mcp-time/src"
    python3 main.py
    
else
    # Docker実行モード
    echo -e "${GREEN}🐳 Docker実行モードで起動します${NC}"
    
    # Dockerが起動しているかチェック
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Dockerデーモンが起動していません${NC}"
        echo -e "${YELLOW}💡 Docker Desktopを起動してください${NC}"
        
        # macOSの場合、Docker Desktopを自動起動を試行
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo -e "${BLUE}🔄 Docker Desktopの起動を試行中...${NC}"
            open -a Docker
            echo -e "${YELLOW}⏳ Docker Desktopの起動を待っています（30秒）...${NC}"
            
            # 30秒間Docker起動を待機
            for i in {1..30}; do
                if docker info &> /dev/null; then
                    echo -e "${GREEN}✅ Docker Desktopが起動しました${NC}"
                    break
                fi
                sleep 1
                echo -n "."
            done
            echo ""
            
            # 再度チェック
            if ! docker info &> /dev/null; then
                echo -e "${RED}❌ Docker Desktopの起動に失敗しました${NC}"
                echo -e "${YELLOW}💡 手動でDocker Desktopを起動してから再実行してください${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}💡 手動でDockerを起動してから再実行してください${NC}"
            exit 1
        fi
    fi
    
    # Dockerコンテナが起動していない場合は起動
    if ! docker ps | grep -q "mcp-time"; then
        echo -e "${BLUE}🚀 MCPタイムサーバーコンテナを起動中...${NC}"
        cd "$(dirname "$0")/../mcp-time"
        docker compose up -d
        echo -e "${GREEN}✅ コンテナが起動しました${NC}"
        
        # 依存関係のインストール状況を確認
        if ! docker exec mcp-time python -c "import fastmcp, pytz" 2>/dev/null; then
            echo -e "${BLUE}📦 依存関係をインストール中...${NC}"
            docker exec mcp-time bash -c "cd /app/mcp-time/mcp-time && pip install fastmcp pytz"
            echo -e "${GREEN}✅ 依存関係のインストールが完了しました${NC}"
        fi
    fi
    
    # MCPサーバーを起動
    echo -e "${GREEN}🔄 MCPタイムサーバーを起動中...${NC}"
    docker exec -i mcp-time python /app/mcp-time/mcp-time/src/main.py
fi 