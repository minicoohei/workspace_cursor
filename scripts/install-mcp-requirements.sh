#!/bin/bash
# MCPタイムサーバー依存関係インストールスクリプト

# カラー出力用の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 MCPタイムサーバーの依存関係をインストールします...${NC}"

# Python環境のチェック
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3がインストールされていません${NC}"
    echo -e "${YELLOW}💡 解決方法:${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS: brew install python3"
        echo "または: https://www.python.org/downloads/ からインストール"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Ubuntu/Debian: sudo apt-get install python3 python3-pip"
        echo "CentOS/RHEL: sudo yum install python3 python3-pip"
    else
        echo "https://www.python.org/downloads/ からインストール"
    fi
    exit 1
fi

# pipの確認
if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
    echo -e "${RED}❌ pipがインストールされていません${NC}"
    echo -e "${YELLOW}💡 解決方法:${NC}"
    echo "python3 -m ensurepip --upgrade"
    exit 1
fi

# 仮想環境の作成（推奨）
VENV_DIR="$(dirname "$0")/../env/mcp-time"
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${BLUE}🔧 仮想環境を作成中...${NC}"
    python3 -m venv "$VENV_DIR"
fi

# 仮想環境のアクティベート
echo -e "${BLUE}🔄 仮想環境をアクティベート中...${NC}"
source "$VENV_DIR/bin/activate"

# 必要なパッケージのインストール
echo -e "${BLUE}📦 必要なパッケージをインストール中...${NC}"
pip install --upgrade pip
pip install fastmcp pytz

echo -e "${GREEN}✅ 依存関係のインストールが完了しました${NC}"
echo -e "${YELLOW}💡 次回から以下のコマンドでMCPサーバーを起動できます:${NC}"
echo "source $VENV_DIR/bin/activate && python $(dirname "$0")/../mcp-time/mcp-time/src/main.py" 