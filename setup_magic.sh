#!/bin/bash

# 🎯 魔法のセットアップスクリプト - Webサーバー起動専用
# CursorRulesから自動起動対応

echo "🎯 =================================================="
echo "✨ 魔法のWebセットアップツールを起動します"
echo "🌐 ブラウザでMCP設定と環境構築を行います"
echo "🎯 =================================================="
echo ""

# 開始メッセージ
echo "😊 こんにちは！Webセットアップツールを起動しますね"
echo "🌐 ブラウザで簡単にMCP設定ができます！"
echo ""

# プロジェクトディレクトリの確認
if [ ! -f "start-setup-web.sh" ]; then
    echo "❌ プロジェクトディレクトリが見つかりません"
    echo "📁 正しいプロジェクトディレクトリで実行してください"
    echo "💡 ヒント: GitHubからクローンしたディレクトリで実行してください"
    exit 1
fi

echo "📍 現在のディレクトリ: $(pwd)"
echo "🎯 Webセットアップツールを起動します..."
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
                    echo "❌ Homebrewのインストールに失敗しました"
                    echo "💡 手動でNode.jsをインストールしてください: https://nodejs.org/"
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
                echo "❌ Node.jsのインストールに失敗しました"
                echo "💡 手動でインストールしてください: https://nodejs.org/"
                exit 1
            fi
            ;;
            
        "linux")
            echo "🐧 LinuxパッケージマネージャーでNode.jsをインストールします"
            if command -v apt &> /dev/null; then
                echo "📦 Ubuntu/Debian用パッケージを使用"
                if ! curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -; then
                    echo "❌ NodeSourceリポジトリの追加に失敗しました"
                    exit 1
                fi
                if ! sudo apt-get install -y nodejs; then
                    echo "❌ Node.jsのインストールに失敗しました"
                    exit 1
                fi
            elif command -v yum &> /dev/null; then
                echo "📦 CentOS/RHEL用パッケージを使用"
                if ! curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -; then
                    echo "❌ NodeSourceリポジトリの追加に失敗しました"
                    exit 1
                fi
                if ! sudo yum install -y nodejs npm; then
                    echo "❌ Node.jsのインストールに失敗しました"
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
            echo "❌ Node.jsが見つかりません"
            echo "💡 Node.jsをインストール後、再度実行してください"
            exit 1
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

# Webセットアップツールの起動
echo "🚀 =================================================="
echo "🌐 Webセットアップツールを起動中..."
echo "🔗 URL: http://localhost:3000"
echo "🚀 =================================================="
echo ""
echo "💡 ブラウザが自動で開きます..."
echo "💡 Webインターフェースで以下を設定できます："
echo "   ✅ MCPサーバー設定"
echo "   ✅ Cursor環境構築"
echo "   ✅ VSCode拡張機能インストール"
echo "   ✅ Python・Jupyter環境"
echo "🛑 終了するには Ctrl+C を押してください"
echo ""

# 完了メッセージ
echo "🎊 =========================================="
echo "✨ Node.js環境の準備が完了しました！"
echo "🌐 Webセットアップツールを起動します"
echo ""
echo "📋 次のステップ:"
echo "1. ブラウザでWebインターフェースにアクセス"
echo "2. 「完全環境セットアップ」または「基本セットアップ」を選択"
echo "3. リアルタイムで進行状況を確認"
echo "4. セットアップ完了後、Cursorを再起動"
echo "🎊 =========================================="
echo ""

# ブラウザを開く（非同期）
sleep 2
case $OS_TYPE in
    "mac")
        open "http://localhost:3000" 2>/dev/null &
        ;;
    "linux")
        if command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:3000" 2>/dev/null &
        fi
        ;;
    "windows")
        if command -v start &> /dev/null; then
            start "http://localhost:3000" 2>/dev/null &
        fi
        ;;
esac

# Webセットアップツールを起動
echo "🚀 Webセットアップツールを起動します..."
echo "🎯 ブラウザでMCP設定と環境構築を行ってください"
echo ""

# start-setup-web.shを実行
if bash start-setup-web.sh; then
    echo ""
    echo "👋 Webセットアップツールが正常に終了しました"
else
    echo ""
    echo "⚠️  Webセットアップツールの起動に失敗しました"
    echo "💡 手動で起動してください："
    echo "   bash start-setup-web.sh"
fi

# 終了処理
echo ""
echo "👋 お疲れさまでした！"
echo "🎯 Webブラウザでセットアップを続行してください"
echo "🌟 良い開発ライフをお過ごしください！"
echo "🤝 ありがとうございました" 