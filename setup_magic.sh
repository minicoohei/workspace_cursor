#!/bin/bash

# 🪄 SampleCursorProject_NEW - 魔法のセットアップスクリプト
# Cursorに貼り付けるだけで完全自動セットアップが開始されます

echo "✨ =================================================="
echo "🪄 SampleCursorProject_NEW 魔法のセットアップ開始！"
echo "✨ =================================================="
echo ""

# プロジェクトディレクトリの確認
if [ ! -f "setup_complete_environment.sh" ]; then
    echo "❌ エラー: プロジェクトディレクトリが正しくありません"
    echo "📁 正しいプロジェクトディレクトリで実行してください"
    exit 1
fi

echo "📍 現在のディレクトリ: $(pwd)"
echo "🎯 魔法のセットアップを開始します..."
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
    echo "⚠️  未知のOS環境です。Macとして処理を続行します..."
    OS_TYPE="mac"
fi

echo ""

# Node.jsの確認とインストール
echo "🔍 Node.js環境をチェック中..."

if ! command -v node &> /dev/null; then
    echo "📦 Node.jsがインストールされていません。自動インストールを開始..."
    
    case $OS_TYPE in
        "mac")
            echo "🍺 Homebrewを使用してNode.jsをインストールします..."
            if ! command -v brew &> /dev/null; then
                echo "📥 Homebrewをインストール中..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                
                # Homebrewのパスを追加
                if [[ -f "/opt/homebrew/bin/brew" ]]; then
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                elif [[ -f "/usr/local/bin/brew" ]]; then
                    eval "$(/usr/local/bin/brew shellenv)"
                fi
            fi
            
            echo "🟢 Node.jsをインストール中..."
            brew install node
            ;;
            
        "linux")
            echo "📦 Node.jsをインストール中..."
            if command -v apt &> /dev/null; then
                # Ubuntu/Debian
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command -v yum &> /dev/null; then
                # CentOS/RHEL
                curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                sudo yum install -y nodejs npm
            else
                echo "❌ パッケージマネージャーが見つかりません"
                echo "📝 手動でNode.jsをインストールしてください: https://nodejs.org/"
                exit 1
            fi
            ;;
            
        "windows")
            echo "🪟 WindowsでのNode.jsインストール手順:"
            echo "1. https://nodejs.org/ にアクセス"
            echo "2. LTS版をダウンロードしてインストール"
            echo "3. PowerShellを再起動"
            echo "4. このスクリプトを再実行"
            echo ""
            echo "💡 または、Chocolateyを使用:"
            echo "   choco install nodejs"
            echo ""
            read -p "Node.jsをインストールしましたか？ (y/N): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo "❌ Node.jsのインストール後に再実行してください"
                exit 1
            fi
            ;;
    esac
else
    NODE_VERSION=$(node --version)
    echo "✅ Node.js が既にインストールされています: $NODE_VERSION"
fi

# Node.jsの再確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsのインストールに失敗しました"
    echo "📝 手動でインストールしてください: https://nodejs.org/"
    exit 1
fi

# npmの確認
if ! command -v npm &> /dev/null; then
    echo "❌ npmが見つかりません"
    echo "📝 Node.jsを再インストールしてください"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm が利用可能です: $NPM_VERSION"
echo ""

# package.jsonの自動生成
if [ ! -f "package.json" ]; then
    echo "📦 package.jsonを自動生成中..."
    cat > package.json << 'EOF'
{
  "name": "samplecursorproject-setup",
  "version": "1.0.0",
  "description": "SampleCursorProject_NEW 魔法のセットアップツール",
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
  "keywords": ["cursor", "setup", "development", "magic"],
  "author": "SampleCursorProject_NEW",
  "license": "MIT"
}
EOF
    echo "✅ package.jsonを作成しました"
else
    echo "✅ package.jsonが既に存在します"
fi

echo ""

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ npm installに失敗しました"
    echo "🔄 再試行中..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ 依存関係のインストールに失敗しました"
        echo "🛠️  手動で実行してください: npm install"
        exit 1
    fi
fi

echo "✅ 依存関係のインストール完了"
echo ""

# ポートチェックと既存プロセス終了
echo "🔍 ポート3000をチェック中..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🔄 ポート3000で実行中のプロセスを終了します..."
    pkill -f "node setup-web/server.js" 2>/dev/null || true
    sleep 2
fi

# サーバーファイルの確認
if [ ! -f "setup-web/server.js" ]; then
    echo "❌ setup-web/server.jsが見つかりません"
    exit 1
fi

echo ""
echo "🚀 =================================================="
echo "✨ 魔法のWebセットアップツールを起動中..."
echo "🌐 URL: http://localhost:3000"
echo "🚀 =================================================="
echo ""
echo "💡 ブラウザが自動で開かない場合は、手動で以下にアクセス:"
echo "   👉 http://localhost:3000"
echo ""
echo "🛑 停止するには Ctrl+C を押してください"
echo ""

# ブラウザを自動で開く
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

# Node.jsサーバーを起動
node setup-web/server.js

# 終了処理
echo ""
echo "🛑 魔法のセットアップツールを停止しました"
echo "✨ ありがとうございました！" 