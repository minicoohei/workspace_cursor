#!/bin/bash

# 🎯 SampleCursorProject_NEW 完全環境セットアップスクリプト
# このスクリプトは、Cursor、VSCode拡張機能、Marp、Jupyter、MCPサーバーなど
# すべての開発環境を自動的にセットアップします

set -e

echo "🚀 SampleCursorProject_NEW 完全環境セットアップを開始します..."

# プロジェクトルートディレクトリを取得
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

# 1. 基本Cursor環境のセットアップ
echo "📦 基本Cursor環境をセットアップ中..."
if [ -f "setup_cursor_environment.sh" ]; then
    bash setup_cursor_environment.sh
else
    echo "⚠️  setup_cursor_environment.sh が見つかりません"
fi

# 2. VSCode拡張機能のインストール
echo "🔧 VSCode拡張機能をインストール中..."
if command -v code &> /dev/null; then
    # Marp関連
    code --install-extension marp-team.marp-vscode
    
    # Markdown関連
    code --install-extension yzhang.markdown-all-in-one
    code --install-extension bierner.markdown-mermaid
    
    # 日本語サポート
    code --install-extension MS-CEINTL.vscode-language-pack-ja
    
    # Git関連
    code --install-extension eamodio.gitlens
    
    # Python/Jupyter
    code --install-extension ms-python.python
    code --install-extension ms-toolsai.jupyter
    
    # 開発支援
    code --install-extension esbenp.prettier-vscode
    code --install-extension dbaeumer.vscode-eslint
    
    echo "✅ VSCode拡張機能のインストール完了"
else
    echo "⚠️  VSCodeコマンドが見つかりません。手動でインストールしてください"
fi

# 3. Marp CLIのインストール
echo "📊 Marp CLIをインストール中..."
if command -v npm &> /dev/null; then
    npm install -g @marp-team/marp-cli
    echo "✅ Marp CLIのインストール完了"
    
    # Marp設定ファイルをホームディレクトリにコピー
    if [ -f "config/.marprc.yml" ]; then
        cp config/.marprc.yml ~/.marprc.yml
        echo "✅ Marp設定ファイルをコピーしました"
    fi
else
    echo "⚠️  npmが見つかりません。Node.jsをインストールしてください"
fi

# 4. Python環境のセットアップ（Jupyter用）
echo "🐍 Python環境をセットアップ中..."
if command -v python3 &> /dev/null; then
    # 仮想環境の作成
    if [ ! -d "env" ]; then
        python3 -m venv env
        echo "✅ Python仮想環境を作成しました"
    fi
    
    # 仮想環境をアクティベートして必要なパッケージをインストール
    source env/bin/activate
    pip install --upgrade pip
    pip install jupyter notebook ipykernel pandas numpy matplotlib seaborn
    
    # Jupyterカーネルを登録
    python -m ipykernel install --user --name=cursor_project --display-name="Cursor Project"
    
    deactivate
    echo "✅ Python環境のセットアップ完了"
else
    echo "⚠️  Python3が見つかりません"
fi

# 5. 環境変数テンプレートの設定
echo "🔐 環境変数テンプレートを設定中..."
if [ -f "config/env.local.template" ] && [ ! -f ".env.local" ]; then
    cp config/env.local.template .env.local
    echo "✅ .env.localファイルを作成しました"
    echo "⚠️  APIキーを設定してください: .env.local"
fi

# 6. Git hooksの設定（セキュリティチェック）
echo "🔒 Git hooksを設定中..."
if [ -d ".git" ]; then
    # pre-commitフックの作成
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# セキュリティチェック: 大きなファイルや機密情報の検出

# 50MB以上のファイルをチェック
large_files=$(find . -type f -size +50M -not -path "./.git/*" -not -path "./env/*" -not -path "./node_modules/*")
if [ ! -z "$large_files" ]; then
    echo "⚠️  警告: 50MB以上のファイルが検出されました:"
    echo "$large_files"
    echo "本当にコミットしますか？ (y/N)"
    read response
    if [ "$response" != "y" ]; then
        exit 1
    fi
fi

# APIキーのパターンをチェック
if git diff --cached --name-only | xargs grep -E "(api_key|API_KEY|secret|SECRET|token|TOKEN)" 2>/dev/null; then
    echo "⚠️  警告: APIキーまたは機密情報が含まれている可能性があります"
    echo "本当にコミットしますか？ (y/N)"
    read response
    if [ "$response" != "y" ]; then
        exit 1
    fi
fi
EOF
    
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooksの設定完了"
fi

# 7. ビルドスクリプトの権限設定
echo "🔨 ビルドスクリプトの権限を設定中..."
if [ -f "scripts/build_slides.sh" ]; then
    chmod +x scripts/build_slides.sh
    echo "✅ ビルドスクリプトの権限設定完了"
fi

# 8. MCPサーバーの追加設定
echo "🌐 MCPサーバーの追加設定中..."

# MCPサーバー設定の確認（プロジェクト内の設定を使用）
MCP_CONFIG_FILE=".cursor/mcp.json"
if [ -f "$MCP_CONFIG_FILE" ]; then
    echo "✅ MCPサーバー設定ファイルが存在します"
    echo "📋 現在の設定: $(jq -r '.mcpServers | keys | join(", ")' "$MCP_CONFIG_FILE" 2>/dev/null || echo "設定確認エラー")"
    
    # 必要なMCPサーバーがインストールされているか確認
    echo "📦 必要なMCPサーバーをインストール中..."
    
    # npmでインストール可能なMCPサーバー
    npm_servers=(
        "@modelcontextprotocol/server-filesystem"
        "@modelcontextprotocol/server-github" 
        "@modelcontextprotocol/server-slack"
        "@gongrzhe/server-gmail-autoauth-mcp"
        "@cocal/google-calendar-mcp"
        "@mcpservers/playwright"
        "@executeautomation/mcp-postgres"
    )
    
    for server in "${npm_servers[@]}"; do
        echo "  - $server をインストール中..."
        npm install -g "$server" || echo "    ⚠️  $server のインストールに失敗しました"
    done
    
    echo "✅ MCPサーバーのインストール完了"
else
    echo "⚠️  MCPサーバー設定ファイルが見つかりません"
fi

# 9. 最終確認
echo ""
echo "🎉 セットアップが完了しました！"
echo ""
echo "📋 次のステップ:"
echo "1. .env.local ファイルにAPIキーを設定してください"
echo "2. Cursorを再起動してください"
echo "3. samples/ ディレクトリでサンプルを確認してください"
echo ""
echo "📚 ドキュメント:"
echo "- セットアップガイド: docs/setup/"
echo "- テンプレート: ObsidianVault/Templates/"
echo "- サンプル: samples/"
echo ""
echo "🚀 Happy Coding with Cursor!"

---
最終更新: 2025-07-10 23:30:00 JST 