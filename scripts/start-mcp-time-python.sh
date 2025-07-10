#!/bin/bash
# MCPタイムサーバー Python直接実行スクリプト

# カラー出力用の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐍 MCPタイムサーバーをPython直接実行モードで起動します...${NC}"

# 仮想環境の確認
VENV_DIR="$(dirname "$0")/../env/mcp-time"
if [ -d "$VENV_DIR" ]; then
    echo -e "${GREEN}✅ 仮想環境を使用します${NC}"
    source "$VENV_DIR/bin/activate"
else
    echo -e "${YELLOW}⚠️  仮想環境が見つかりません。グローバル環境を使用します${NC}"
    
    # 必要なパッケージがインストールされているかチェック
    if ! python3 -c "import fastmcp, pytz" 2>/dev/null; then
        echo -e "${RED}❌ 必要なパッケージがインストールされていません${NC}"
        echo -e "${YELLOW}💡 以下のコマンドを実行してください:${NC}"
        echo "bash scripts/install-mcp-requirements.sh"
        exit 1
    fi
fi

# MCPサーバーを直接実行
echo -e "${GREEN}🚀 MCPタイムサーバーを起動中...${NC}"
cd "$(dirname "$0")/../mcp-time/mcp-time/src"
python3 main.py 