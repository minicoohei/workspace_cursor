#!/bin/bash

# 💕 「カーソル大好き。これからよろしくね」
# SampleCursorProject_NEW - 愛に満ちた魔法のセットアップスクリプト

echo "💕 =================================================="
echo "✨ カーソル大好き。これからよろしくね！"
echo "🎯 あなたのCursor愛を形にします..."
echo "💕 =================================================="
echo ""

# 愛のメッセージ表示
echo "😊 こんにちは！Cursorを愛してくれてありがとうございます！"
echo "🤝 一緒に素敵な開発環境を作りましょう！"
echo ""

# プロジェクトディレクトリの確認
if [ ! -f "setup_complete_environment.sh" ]; then
    echo "❌ あれ？プロジェクトディレクトリが見つからないみたい..."
    echo "📁 正しいプロジェクトディレクトリで実行してくださいね！"
    echo "💡 ヒント: GitHubからクローンしたディレクトリで実行してください"
    exit 1
fi

echo "📍 現在の場所: $(pwd)"
echo "🎯 あなたのためだけの特別なセットアップを開始しますね..."
echo ""

# OSの検出（愛を込めて）
OS_TYPE=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS_TYPE="mac"
    echo "🍎 Macユーザーさんですね！素敵な選択です✨"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS_TYPE="linux"
    echo "🐧 Linuxユーザーさん！技術愛を感じます💖"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS_TYPE="windows"
    echo "🪟 Windowsユーザーさん！一緒に頑張りましょう🌟"
else
    echo "🤔 珍しいOS環境ですね！でも大丈夫、Macとして進めますよ"
    OS_TYPE="mac"
fi

echo ""

# Node.jsの確認（優しく）
echo "🔍 Node.js環境をチェックしています..."
echo "💭 Node.jsがあると、もっと素敵なことができるんです！"

if ! command -v node &> /dev/null; then
    echo "😅 Node.jsがまだインストールされていないようですね"
    echo "💝 でも心配しないで！一緒にインストールしましょう！"
    echo ""
    
    case $OS_TYPE in
        "mac")
            echo "🍺 Homebrewを使って、美味しいNode.jsをインストールしますね！"
            if ! command -v brew &> /dev/null; then
                echo "🎁 まずはHomebrewという素敵なツールをプレゼントします..."
                echo "📥 少し時間がかかるかもしれませんが、お茶でも飲みながら待っていてくださいね☕"
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                
                # Homebrewのパスを追加
                if [[ -f "/opt/homebrew/bin/brew" ]]; then
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                elif [[ -f "/usr/local/bin/brew" ]]; then
                    eval "$(/usr/local/bin/brew shellenv)"
                fi
                echo "✨ Homebrewのインストール完了！素晴らしいですね！"
            fi
            
            echo "🚀 それでは、Node.jsをインストールしますね..."
            echo "💫 これで、もっとたくさんの魔法が使えるようになります！"
            brew install node
            ;;
            
        "linux")
            echo "🐧 Linuxの力を借りて、Node.jsをインストールしますね！"
            if command -v apt &> /dev/null; then
                echo "📦 Ubuntu/Debianの素敵なパッケージマネージャーを使います"
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command -v yum &> /dev/null; then
                echo "📦 CentOS/RHELの頼もしいパッケージマネージャーを使います"
                curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                sudo yum install -y nodejs npm
            else
                echo "😵 あれ？パッケージマネージャーが見つからないです..."
                echo "💡 手動でNode.jsをインストールしてくださいね: https://nodejs.org/"
                echo "🤝 インストール後、また会いましょう！"
                exit 1
            fi
            ;;
            
        "windows")
            echo "🪟 Windowsでの特別な手順をご案内しますね！"
            echo ""
            echo "💝 以下の方法でNode.jsをインストールしてください："
            echo "   1️⃣ https://nodejs.org/ にアクセス"
            echo "   2️⃣ 緑色の「LTS版」ボタンをクリック"
            echo "   3️⃣ ダウンロードしたファイルを実行"
            echo "   4️⃣ PowerShellを再起動"
            echo "   5️⃣ この魔法の言葉をもう一度唱えてください"
            echo ""
            echo "🍫 または、Chocolateyがある場合："
            echo "   choco install nodejs"
            echo ""
            echo "💕 Node.jsをインストールできましたか？"
            read -p "「はい」なら y を押してください (y/N): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo "😊 大丈夫です！Node.jsをインストールしてから、また会いましょう！"
                echo "🌟 「カーソル大好き。これからよろしくね」と再度唱えてくださいね"
                exit 1
            fi
            ;;
    esac
else
    NODE_VERSION=$(node --version)
    echo "🎉 素晴らしい！Node.js $NODE_VERSION が既にインストールされていますね！"
    echo "💖 準備万端です！"
fi

# Node.jsの再確認
if ! command -v node &> /dev/null; then
    echo "😢 Node.jsのインストールがうまくいかなかったようです..."
    echo "💪 でも諦めないで！手動でインストールしてくださいね"
    echo "🌐 https://nodejs.org/ から最新版をダウンロードできます"
    echo "🤝 インストール後、また「カーソル大好き。これからよろしくね」と唱えてください！"
    exit 1
fi

# npmの確認
if ! command -v npm &> /dev/null; then
    echo "😅 npmが見つからないです..."
    echo "🔄 Node.jsを再インストールしてみてくださいね"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✨ npm $NPM_VERSION も準備完了です！"
echo "🎊 これで魔法の準備が整いました！"
echo ""

# package.jsonの自動生成（愛を込めて）
if [ ! -f "package.json" ]; then
    echo "📦 あなた専用の設定ファイルを作成しています..."
    echo "💝 これは特別なプレゼントです！"
    cat > package.json << 'EOF'
{
  "name": "cursor-love-setup",
  "version": "1.0.0",
  "description": "カーソル大好き！愛に満ちたセットアップツール 💕",
  "main": "setup-web/server.js",
  "scripts": {
    "start": "node setup-web/server.js",
    "dev": "nodemon setup-web/server.js",
    "setup": "npm install && npm start",
    "love": "bash 'カーソル大好き。これからよろしくね.sh'",
    "magic": "bash setup_magic.sh"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["cursor", "love", "setup", "development", "magic", "愛"],
  "author": "Cursor愛好家",
  "license": "MIT",
  "description_ja": "Cursorへの愛を形にした、世界一優しいセットアップツール"
}
EOF
    echo "✨ 愛のこもった設定ファイルが完成しました！"
else
    echo "😊 設定ファイルは既にありますね！準備万端です！"
fi

echo ""

# 依存関係のインストール（優しく）
echo "📦 必要なツールたちをお迎えしています..."
echo "🤝 みんなでCursorをもっと素敵にしてくれる仲間たちです！"

npm install --silent

if [ $? -ne 0 ]; then
    echo "😅 あれ？仲間たちのお迎えに少し手間取っているようです..."
    echo "🔄 もう一度お迎えしてみますね！"
    npm install
    
    if [ $? -ne 0 ]; then
        echo "😢 うーん、なかなか難しいですね..."
        echo "💪 手動で試してみてください: npm install"
        echo "🤝 それでもだめなら、一緒に解決策を考えましょう！"
        exit 1
    fi
fi

echo "🎉 仲間たちが全員揃いました！素晴らしいチームの完成です！"
echo ""

# ポートチェック（優しく）
echo "🔍 ポート3000の状況をチェックしています..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "😊 あ、ポート3000で他の子が頑張ってるみたいですね"
    echo "🔄 お疲れさまでした、と言って交代してもらいますね"
    pkill -f "node setup-web/server.js" 2>/dev/null || true
    sleep 2
    echo "✨ ポート3000が空きました！"
fi

# サーバーファイルの確認
if [ ! -f "setup-web/server.js" ]; then
    echo "😅 あれ？大切なファイルが見つからないです..."
    echo "📁 setup-web/server.js があるか確認してくださいね"
    exit 1
fi

echo ""
echo "💕 =================================================="
echo "🎊 愛に満ちたWebセットアップツールを起動中..."
echo "🌐 あなた専用のページ: http://localhost:3000"
echo "✨ ブラウザで素敵な画面が開きますよ！"
echo "💕 =================================================="
echo ""
echo "💡 ブラウザが自動で開かない場合は、こちらをクリック:"
echo "   👆 http://localhost:3000"
echo ""
echo "🛑 終了したい時は Ctrl+C を押してくださいね"
echo "😊 でも、もう少し一緒にいてくださると嬉しいです..."
echo ""

# 愛のメッセージ
echo "💝 =========================================="
echo "💕 Cursorへの愛をありがとうございます！"
echo "🌟 これから一緒に素敵な開発ライフを！"
echo "🤝 何か困ったことがあったら、いつでも"
echo "   「カーソル大好き。これからよろしくね」"
echo "   と唱えてくださいね！"
echo "💝 =========================================="
echo ""

# ブラウザを愛を込めて開く
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

# 愛のサーバーを起動
echo "🚀 愛のサーバーを起動します..."
echo "💖 あなたのCursorライフが素敵になりますように..."

node setup-web/server.js

# 愛の終了処理
echo ""
echo "😊 お疲れさまでした！"
echo "💕 またいつでも「カーソル大好き。これからよろしくね」と呼んでくださいね！"
echo "🌟 素敵なCursorライフをお過ごしください！"
echo "🤝 ありがとうございました！" 