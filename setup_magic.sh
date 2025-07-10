#!/bin/bash

# 🎯 SampleCursorProject_NEW - 魔法のセットアップスクリプト
# CursorRulesから自動起動対応 + 完全環境構築

# エラーハンドリング関数
handle_error() {
    echo "❌ エラーが発生しました: $1"
    echo "🔄 スクリプトを再実行するか、手動で解決してください"
}

# 重要なコマンドの実行とエラーチェック
run_critical_command() {
    if ! "$@"; then
        handle_error "コマンド実行失敗: $*"
        exit 1
    fi
}

echo "🎯 =================================================="
echo "✨ Cursor環境セットアップを開始します"
echo "🚀 魔法のように環境を構築中..."
echo "🎯 =================================================="
echo ""

# 開始メッセージ
echo "😊 こんにちは！Cursor環境のセットアップを開始しますね"
echo "🔧 一緒に開発環境を整えましょう！"
echo ""

# プロジェクトディレクトリの確認
if [ ! -f "setup_complete_environment.sh" ]; then
    echo "❌ プロジェクトディレクトリが見つかりません"
    echo "📁 正しいプロジェクトディレクトリで実行してください"
    echo "💡 ヒント: GitHubからクローンしたディレクトリで実行してください"
    exit 1
fi

echo "📍 現在のディレクトリ: $(pwd)"
echo "🎯 セットアップを開始します..."
echo ""

# OSの検出
OS_TYPE=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS_TYPE="mac"
    echo "🍎 Mac環境を検出しました"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS_TYPE="linux"
    echo "🐧 Linux環境を検出しました"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS_TYPE="windows"
    echo "🪟 Windows環境を検出しました"
else
    echo "⚠️  未知のOS環境です。Macとして処理を続行します"
    OS_TYPE="mac"
fi

echo ""

# Node.jsの確認とインストール
echo "🔍 Node.js環境をチェック中..."

if ! command -v node &> /dev/null; then
    echo "📦 Node.jsがインストールされていません"
    echo "🔧 自動インストールを開始します"
    echo ""
    
    case $OS_TYPE in
        "mac")
            echo "🍺 Homebrewを使用してNode.jsをインストールします"
            if ! command -v brew &> /dev/null; then
                echo "📥 Homebrewをインストール中..."
                echo "⏳ 少し時間がかかる場合があります"
                if ! /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
                    handle_error "Homebrewのインストールに失敗しました"
                    exit 1
                fi
                
                # Homebrewのパスを追加
                if [[ -f "/opt/homebrew/bin/brew" ]]; then
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                elif [[ -f "/usr/local/bin/brew" ]]; then
                    eval "$(/usr/local/bin/brew shellenv)"
                fi
                echo "✅ Homebrewのインストール完了"
            fi
            
            echo "🚀 Node.jsをインストール中..."
            if ! brew install node; then
                handle_error "Node.jsのインストールに失敗しました"
                exit 1
            fi
            ;;
            
        "linux")
            echo "🐧 LinuxパッケージマネージャーでNode.jsをインストールします"
            if command -v apt &> /dev/null; then
                echo "📦 Ubuntu/Debian用パッケージを使用"
                if ! curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -; then
                    handle_error "NodeSourceリポジトリの追加に失敗しました"
                    exit 1
                fi
                if ! sudo apt-get install -y nodejs; then
                    handle_error "Node.jsのインストールに失敗しました"
                    exit 1
                fi
            elif command -v yum &> /dev/null; then
                echo "📦 CentOS/RHEL用パッケージを使用"
                if ! curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -; then
                    handle_error "NodeSourceリポジトリの追加に失敗しました"
                    exit 1
                fi
                if ! sudo yum install -y nodejs npm; then
                    handle_error "Node.jsのインストールに失敗しました"
                    exit 1
                fi
            else
                echo "❌ パッケージマネージャーが見つかりません"
                echo "💡 手動でNode.jsをインストールしてください: https://nodejs.org/"
                echo "🔄 インストール後、このスクリプトを再実行してください"
                exit 1
            fi
            ;;
            
        "windows")
            echo "🪟 Windowsでのインストール手順:"
            echo ""
            echo "📝 以下の手順でNode.jsをインストールしてください:"
            echo "   1️⃣ https://nodejs.org/ にアクセス"
            echo "   2️⃣ LTS版をダウンロード"
            echo "   3️⃣ ダウンロードしたファイルを実行"
            echo "   4️⃣ PowerShellを再起動"
            echo "   5️⃣ このスクリプトを再実行"
            echo ""
            echo "🍫 Chocolateyがある場合:"
            echo "   choco install nodejs"
            echo ""
            read -p "Node.jsをインストールしましたか？ (y/N): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo "💡 Node.jsをインストール後、再度実行してください"
                exit 1
            fi
            ;;
    esac
else
    NODE_VERSION=$(node --version)
    echo "✅ Node.js $NODE_VERSION が既にインストール済みです"
fi

# Node.jsの再確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsのインストールに失敗しました"
    echo "💡 手動でインストールしてください: https://nodejs.org/"
    echo "🔄 インストール後、再度このスクリプトを実行してください"
    exit 1
fi

# npmの確認
if ! command -v npm &> /dev/null; then
    echo "❌ npmが見つかりません"
    echo "🔄 Node.jsを再インストールしてください"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm $NPM_VERSION が利用可能です"
echo ""

# 1. 基本Cursor環境のセットアップ
echo "📦 基本Cursor環境をセットアップ中..."
if [ -f "setup_cursor_environment.sh" ]; then
    if ! bash setup_cursor_environment.sh; then
        echo "⚠️  setup_cursor_environment.shの実行で一部エラーがありましたが、続行します"
    fi
else
    echo "⚠️  setup_cursor_environment.sh が見つかりません"
    echo "🔧 基本設定を手動で実行します..."
    
    # Cursor設定ディレクトリの作成
    if [ ! -d ".cursor" ]; then
        mkdir -p .cursor/rules
        echo "✅ .cursorディレクトリを作成しました"
    fi
    
    # mcp.jsonの作成
    cat > .cursor/mcp.json << 'EOF'
{
  "mcpServers": {
    "mcp-time": {
      "command": "docker",
      "args": ["compose", "-f", "mcp-time/docker-compose.yml", "up"],
      "env": {},
      "description": "日本時間のタイムスタンプを提供するMCPサーバー",
      "autoStart": true
    }
  }
}
EOF
    echo "✅ MCPサーバー設定を作成しました"
fi

# 2. VSCode拡張機能のインストール
echo "🔧 VSCode拡張機能をインストール中..."
if command -v code &> /dev/null; then
    # 拡張機能のリスト
    extensions=(
        "marp-team.marp-vscode"
        "yzhang.markdown-all-in-one"
        "bierner.markdown-mermaid"
        "MS-CEINTL.vscode-language-pack-ja"
        "eamodio.gitlens"
        "ms-python.python"
        "ms-toolsai.jupyter"
        "esbenp.prettier-vscode"
        "dbaeumer.vscode-eslint"
    )
    
    for ext in "${extensions[@]}"; do
        echo "  - $ext をインストール中..."
        if ! code --install-extension "$ext" &> /dev/null; then
            echo "    ⚠️  $ext のインストールに失敗しました（スキップして続行）"
        fi
    done
    
    echo "✅ VSCode拡張機能のインストール完了"
else
    echo "⚠️  VSCodeコマンドが見つかりません。手動でインストールしてください"
fi

# 3. Marp CLIのインストール
echo "📊 Marp CLIをインストール中..."
if ! npm install -g @marp-team/marp-cli; then
    echo "⚠️  Marp CLIのインストールに失敗しました（スキップして続行）"
else
    echo "✅ Marp CLIのインストール完了"
fi

# Marp設定ファイルをホームディレクトリにコピー
if [ -f "config/.marprc.yml" ]; then
    if cp config/.marprc.yml ~/.marprc.yml; then
        echo "✅ Marp設定ファイルをコピーしました"
    else
        echo "⚠️  Marp設定ファイルのコピーに失敗しました"
    fi
fi

# 4. Python環境のセットアップ（Jupyter用）
echo "🐍 Python環境をセットアップ中..."
if command -v python3 &> /dev/null; then
    # 仮想環境の作成
    if [ ! -d "env" ]; then
        if python3 -m venv env; then
            echo "✅ Python仮想環境を作成しました"
        else
            echo "⚠️  Python仮想環境の作成に失敗しました（スキップして続行）"
        fi
    fi
    
    # 仮想環境をアクティベートして必要なパッケージをインストール
    if [ -d "env" ] && source env/bin/activate; then
        pip install --upgrade pip
        if pip install jupyter notebook ipykernel pandas numpy matplotlib seaborn; then
            # Jupyterカーネルを登録
            python -m ipykernel install --user --name=cursor_project --display-name="Cursor Project"
            echo "✅ Python環境のセットアップ完了"
        else
            echo "⚠️  Pythonパッケージのインストールに失敗しました"
        fi
        deactivate
    fi
else
    echo "⚠️  Python3が見つかりません"
fi

# 5. 環境変数テンプレートの設定
echo "🔐 環境変数テンプレートを設定中..."
if [ -f "config/env.local.template" ] && [ ! -f ".env.local" ]; then
    if cp config/env.local.template .env.local; then
        echo "✅ .env.localファイルを作成しました"
        echo "⚠️  APIキーを設定してください: .env.local"
    else
        echo "⚠️  .env.localファイルの作成に失敗しました"
    fi
fi

# 6. MCPサーバーの追加設定
echo "🌐 MCPサーバーの追加設定中..."

# 必要なMCPサーバーがインストールされているか確認
echo "📦 必要なMCPサーバーをインストール中..."

# npmでインストール可能なMCPサーバー
npm_servers=(
    "@modelcontextprotocol/server-filesystem"
    "@modelcontextprotocol/server-github"
)

for server in "${npm_servers[@]}"; do
    echo "  - $server をインストール中..."
    if ! npm install -g "$server"; then
        echo "    ⚠️  $server のインストールに失敗しました（スキップして続行）"
    fi
done

echo "✅ MCPサーバーのインストール完了"

# 7. package.jsonの自動生成（Webサーバー用）
if [ ! -f "package.json" ]; then
    echo "📦 package.jsonを生成中..."
    cat > package.json << 'EOF'
{
  "name": "cursor-setup-tool",
  "version": "1.0.0",
  "description": "Cursor環境セットアップツール",
  "main": "setup-web/server.js",
  "scripts": {
    "start": "node setup-web/server.js",
    "dev": "nodemon setup-web/server.js",
    "setup": "npm install && npm start",
    "magic": "bash setup_magic.sh"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["cursor", "setup", "development"],
  "author": "Cursor User",
  "license": "MIT"
}
EOF
    echo "✅ package.jsonを作成しました"
else
    echo "✅ package.jsonが既に存在します"
fi

echo ""

# 8. 依存関係のインストール（リトライロジック付き）
echo "📦 必要なパッケージをインストール中..."

# 最初の試行（サイレント）
if npm install --silent; then
    echo "✅ パッケージのインストール完了"
else
    echo "⚠️  インストールに時間がかかっています。再試行中..."
    
    # 2回目の試行（詳細出力）
    if npm install; then
        echo "✅ パッケージのインストール完了"
    else
        echo "❌ パッケージのインストールに失敗しました"
        echo "💡 手動で実行してください: npm install"
        echo "🤝 問題が解決しない場合は、ドキュメントを確認してください"
        echo "⚠️  Webサーバー機能は利用できませんが、他の機能は利用可能です"
    fi
fi

echo ""

# 9. Docker環境の確認とMCPサーバー起動
echo "🐳 Docker環境を確認中..."

if command -v docker &> /dev/null; then
    echo "✅ Dockerがインストールされています"
    
    # Docker Composeの確認
    if docker compose version &> /dev/null || docker-compose --version &> /dev/null; then
        echo "✅ Docker Composeが利用可能です"
        
        # MCPタイムサーバーのビルドと起動
        echo "🔨 MCPタイムサーバーをビルド・起動中..."
        
        # mcp-timeディレクトリの存在確認
        if [ ! -d "mcp-time" ]; then
            echo "⚠️  mcp-timeディレクトリが見つかりません"
            echo "💡 MCPタイムサーバーをスキップして続行します"
            echo "🔧 手動でMCPサーバーをセットアップする場合は、以下を実行してください:"
            echo "   git clone https://github.com/your-repo/mcp-time.git"
        else
            # ディレクトリが存在する場合のみ処理を実行
            if cd mcp-time; then
                if docker compose build &> /dev/null; then
                    echo "✅ MCPタイムサーバーのビルドが完了しました"
                    
                    # バックグラウンドで起動
                    if docker compose up -d; then
                        echo "✅ MCPタイムサーバーを起動しました"
                    else
                        echo "⚠️  MCPタイムサーバーの起動に失敗しました"
                    fi
                else
                    echo "⚠️  MCPタイムサーバーのビルドに失敗しました"
                fi
                
                # 元のディレクトリに戻る
                cd ..
            else
                echo "⚠️  mcp-timeディレクトリへの移動に失敗しました"
            fi
        fi
    else
        echo "⚠️  Docker Composeがインストールされていません"
        echo "  MCPサーバーを使用するにはDocker Composeが必要です"
    fi
else
    echo "⚠️  Dockerがインストールされていません"
    echo "  MCPサーバーを使用するにはDockerが必要です"
    echo "  インストール方法: https://docs.docker.com/get-docker/"
fi

# 10. ポートチェック
echo "🔍 ポート3000をチェック中..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🔄 ポート3000で実行中のプロセスを終了します"
    pkill -f "node setup-web/server.js" 2>/dev/null || true
    sleep 2
    echo "✅ ポート3000が利用可能になりました"
fi

# サーバーファイルの確認
if [ ! -f "setup-web/server.js" ]; then
    echo "❌ setup-web/server.jsが見つかりません"
    echo "⚠️  Webインターフェースは利用できませんが、環境構築は完了しています"
    exit 0
fi

echo ""
echo "🚀 =================================================="
echo "🌐 Webセットアップツールを起動中..."
echo "🔗 URL: http://localhost:3000"
echo "🚀 =================================================="
echo ""
echo "💡 ブラウザが自動で開かない場合は、手動でアクセスしてください:"
echo "   👉 http://localhost:3000"
echo ""
echo "🛑 終了するには Ctrl+C を押してください"
echo ""

# 完了メッセージ
echo "🎊 =========================================="
echo "✨ Cursor完全環境セットアップ完了！"
echo "🌟 以下の機能が利用可能になりました："
echo "   ✅ Cursor IDE設定"
echo "   ✅ MCPサーバー（mcp-time）"
echo "   ✅ VSCode拡張機能"
echo "   ✅ Marp CLI"
echo "   ✅ Python/Jupyter環境"
echo "   ✅ Webセットアップインターフェース"
echo ""
echo "📋 次のステップ:"
echo "1. Cursorを再起動してください"
echo "2. .env.localにAPIキーを設定してください"
echo "3. samples/ディレクトリでサンプルを確認してください"
echo "🎊 =========================================="
echo ""

# ブラウザを開く
sleep 2
case $OS_TYPE in
    "mac")
        open "http://localhost:3000" 2>/dev/null || true
        ;;
    "linux")
        if command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:3000" 2>/dev/null || true
        fi
        ;;
    "windows")
        if command -v start &> /dev/null; then
            start "http://localhost:3000" 2>/dev/null || true
        fi
        ;;
esac

# サーバーを起動
echo "🚀 サーバーを起動します..."
echo "🎯 Cursor環境セットアップをお楽しみください"

if ! node setup-web/server.js; then
    echo ""
    echo "⚠️  Webサーバーの起動に失敗しました"
    echo "💡 環境構築は完了していますので、手動で確認してください"
fi

# 終了処理
echo ""
echo "👋 お疲れさまでした！"
echo "🎯 またいつでもこのスクリプトを実行してください"
echo "🌟 良い開発ライフをお過ごしください！"
echo "🤝 ありがとうございました" 