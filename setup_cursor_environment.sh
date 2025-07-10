#!/bin/bash

# ========================================
# Cursor環境セットアップスクリプト
# 初心者の方向けの自動設定ツール
# ========================================

echo "🚀 Cursor環境のセットアップを開始します..."
echo ""

# カラー設定
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# プロジェクトルートの確認
if [ ! -f ".cursorrules" ]; then
    echo -e "${RED}エラー: プロジェクトルートで実行してください${NC}"
    echo "使い方: cd SampleCursorProject_NEW && bash setup_cursor_environment.sh"
    exit 1
fi

echo -e "${GREEN}✓ プロジェクトルートを確認しました${NC}"
echo ""

# ========================================
# 1. Cursor設定ディレクトリの作成
# ========================================
echo "📁 Cursor設定ディレクトリを準備中..."

# .cursorディレクトリが存在しない場合は作成
if [ ! -d ".cursor" ]; then
    mkdir -p .cursor/rules
    echo -e "${GREEN}✓ .cursorディレクトリを作成しました${NC}"
else
    echo -e "${YELLOW}! .cursorディレクトリは既に存在します${NC}"
fi

# ========================================
# 2. Indexing Docs設定
# ========================================
echo ""
echo "📚 Indexing Docs設定を構成中..."

# indexing-docs.jsonの作成
cat > .cursor/indexing-docs.json << 'EOF'
{
  "version": "1.0",
  "documents": [
    {
      "name": "プロジェクト概要",
      "path": "README.md",
      "description": "SampleCursorProject_NEWの全体概要"
    },
    {
      "name": "Cursor初心者ガイド",
      "path": "cursor_beginner_guide.md",
      "description": "Cursor AIの基本的な使い方"
    },
    {
      "name": "安全ガイドライン",
      "path": "安全ガイドライン.md",
      "description": "初心者向けの安全な操作ガイド"
    },
    {
      "name": "議事録テンプレート",
      "path": "ObsidianVault/Templates/0002_議事録作成テンプレート.md",
      "description": "議事録作成の標準テンプレート"
    },
    {
      "name": "Marp作成ガイド",
      "path": "CursorCourse/Chapter1_Documentation/marp_creation_guide.md",
      "description": "Marpスライドの作成方法"
    },
    {
      "name": "要件定義ガイドライン",
      "path": "ObsidianVault/Templates/0003_要件定義ガイドライン.md",
      "description": "要件定義書の作成ガイド"
    },
    {
      "name": "MCPタイムサーバー",
      "path": "mcp-time/README.md",
      "description": "タイムスタンプ提供MCPサーバー"
    }
  ]
}
EOF

echo -e "${GREEN}✓ Indexing Docs設定を作成しました${NC}"

# ========================================
# 3. MCP設定の確認と作成
# ========================================
echo ""
echo "🔧 MCPサーバー設定を構成中..."

# mcp.jsonの確認と設定
if [ -f ".cursor/mcp.json" ]; then
    echo -e "${GREEN}✓ 既存のMCPサーバー設定を保持します${NC}"
    echo -e "${YELLOW}! 既存の設定: $(jq -r '.mcpServers | keys | join(", ")' .cursor/mcp.json 2>/dev/null || echo "設定確認エラー")${NC}"
else
    echo -e "${YELLOW}! mcp.jsonが存在しません。基本設定を作成します${NC}"
    
    # 基本的なmcp-timeサーバーのみ作成
    cat > .cursor/mcp.json << 'EOF'
{
  "mcpServers": {
    "mcp-time": {
      "command": "bash",
      "args": ["scripts/start-mcp-time.sh"],
      "env": {},
      "description": "日本時間のタイムスタンプを提供するMCPサーバー（Docker/Python自動選択）",
      "autoStart": true
    }
  }
}
EOF
    echo -e "${GREEN}✓ 基本MCPサーバー設定を作成しました${NC}"
fi

# ========================================
# 4. Project Rules設定
# ========================================
echo ""
echo "📋 Project Rules設定を構成中..."

# global.mdcが存在しない場合は.cursorrulesからコピー
if [ ! -f ".cursor/rules/global.mdc" ]; then
    if [ -f ".cursorrules" ]; then
        # ヘッダーを追加してコピー
        echo "---" > .cursor/rules/global.mdc
        echo "alwaysApply: true" >> .cursor/rules/global.mdc
        echo "description: Cursor初心者向け学習プロジェクトの統合ルール。kinopeee/cursorrules v5ベース + プロジェクト固有ルール" >> .cursor/rules/global.mdc
        echo "---" >> .cursor/rules/global.mdc
        echo "" >> .cursor/rules/global.mdc
        echo "<!-- Description: Cursor初心者向け学習プロジェクトの基本ルール。日本語対応、安全性最優先、ドキュメント最終更新時刻の自動記載を含む。 -->" >> .cursor/rules/global.mdc
        echo "" >> .cursor/rules/global.mdc
        cat .cursorrules >> .cursor/rules/global.mdc
        echo -e "${GREEN}✓ Project Rules設定を作成しました${NC}"
    fi
else
    echo -e "${YELLOW}! Project Rules設定は既に存在します${NC}"
fi

# ========================================
# 5. Docker環境の確認
# ========================================
echo ""
echo "🐳 Docker環境を確認中..."

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Dockerがインストールされています${NC}"
    
    # Docker Composeの確認
    if docker compose version &> /dev/null || docker-compose --version &> /dev/null; then
        echo -e "${GREEN}✓ Docker Composeが利用可能です${NC}"
        
        # MCPタイムサーバーのビルド
        echo ""
        echo "🔨 MCPタイムサーバーをビルド中..."
        cd mcp-time
        if docker compose build &> /dev/null; then
            echo -e "${GREEN}✓ MCPタイムサーバーのビルドが完了しました${NC}"
        else
            echo -e "${YELLOW}! MCPタイムサーバーのビルドに失敗しました（後で手動実行してください）${NC}"
        fi
        cd ..
    else
        echo -e "${RED}✗ Docker Composeがインストールされていません${NC}"
        echo "  MCPサーバーを使用するにはDocker Composeが必要です"
    fi
else
    echo -e "${RED}✗ Dockerがインストールされていません${NC}"
    echo "  MCPサーバーを使用するにはDockerが必要です"
    echo "  インストール方法: https://docs.docker.com/get-docker/"
fi

# ========================================
# 6. 完了メッセージ
# ========================================
echo ""
echo "========================================="
echo -e "${GREEN}✅ セットアップが完了しました！${NC}"
echo "========================================="
echo ""
echo "📝 次のステップ:"
echo ""
echo "1. Cursorを再起動してください"
echo "   - Cursorを完全に終了"
echo "   - プロジェクトフォルダを再度開く"
echo ""
echo "2. 設定の確認"
echo "   - Cmd/Ctrl + , で設定画面を開く"
echo "   - 'Indexing' セクションでドキュメントが登録されているか確認"
echo "   - 'MCP' セクションでmcp-timeサーバーが表示されているか確認"
echo ""
echo "3. Project Rulesの確認"
echo "   - 設定画面の 'Rules' セクション"
echo "   - 'global.mdc' が表示されているか確認"
echo ""

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  注意: Dockerがインストールされていないため、MCPサーバーは使用できません${NC}"
    echo ""
fi

echo "詳細なドキュメント:"
echo "- Cursor初心者ガイド: cursor_beginner_guide.md"
echo "- MCPセットアップ: mcp-time/MCP_CURSOR_SETUP.md"
echo ""
echo "Happy Coding! 🎉"

# 最終更新時刻
echo ""
echo "---"
echo "スクリプト最終更新: 2025-07-10 22:15:00 JST" 