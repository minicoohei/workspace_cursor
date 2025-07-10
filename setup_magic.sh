#!/bin/bash

# 🎯 SampleCursorProject_NEW - 魔法のセットアップスクリプト
# CursorRulesから自動起動対応

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

# Node.jsの確認
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
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                
                # Homebrewのパスを追加
                if [[ -f "/opt/homebrew/bin/brew" ]]; then
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                elif [[ -f "/usr/local/bin/brew" ]]; then
                    eval "$(/usr/local/bin/brew shellenv)"
                fi
                echo "✅ Homebrewのインストール完了"
            fi
            
            echo "🚀 Node.jsをインストール中..."
            brew install node
            ;;
            
        "linux")
            echo "🐧 LinuxパッケージマネージャーでNode.jsをインストールします"
            if command -v apt &> /dev/null; then
                echo "📦 Ubuntu/Debian用パッケージを使用"
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command -v yum &> /dev/null; then
                echo "📦 CentOS/RHEL用パッケージを使用"
                curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                sudo yum install -y nodejs npm
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

# package.jsonの自動生成
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

# 依存関係のインストール
echo "📦 必要なパッケージをインストール中..."

npm install --silent

if [ $? -ne 0 ]; then
    echo "⚠️  インストールに時間がかかっています。再試行中..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ パッケージのインストールに失敗しました"
        echo "💡 手動で実行してください: npm install"
        echo "🤝 問題が解決しない場合は、ドキュメントを確認してください"
        exit 1
    fi
fi

echo "✅ パッケージのインストール完了"
echo ""

# ポートチェック
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
    exit 1
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
echo "✨ Cursorセットアップツールの準備完了！"
echo "🌟 これから快適な開発環境をお楽しみください"
echo "🤝 何か問題があれば、いつでもこのスクリプトを実行してください"
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

node setup-web/server.js

# 終了処理
echo ""
echo "👋 お疲れさまでした！"
echo "🎯 またいつでもこのスクリプトを実行してください"
echo "🌟 良い開発ライフをお過ごしください！"
echo "🤝 ありがとうございました" 