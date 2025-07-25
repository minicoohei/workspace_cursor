#!/bin/bash

# ===========================================
# Claude Code 統合安全システム v3.0
# ===========================================
# rm -rf を gomi に自動変換する最もシンプルで確実な方法

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛡️ Claude Code 統合安全システム セットアップ開始..."

# 1. gomiインストール確認
install_gomi() {
    if ! command -v gomi &> /dev/null; then
        echo "📦 gomiをインストール中..."
        if command -v brew &> /dev/null; then
            brew install gomi
        else
            echo "❌ Homebrewが必要です"
            exit 1
        fi
    fi
    echo "✅ gomi: 準備完了"
}

# 2. シェル設定（最小限で効果的）
setup_shell() {
    local shell_config=""
    
    # シェル検出
    if [[ "$SHELL" == *"zsh"* ]]; then
        shell_config="$HOME/.zshrc"
    elif [[ "$SHELL" == *"bash"* ]]; then
        shell_config="$HOME/.bashrc"
    else
        echo "❌ サポート外のシェル: $SHELL"
        exit 1
    fi
    
    # バックアップ
    cp "$shell_config" "${shell_config}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # 既存設定をクリーン
    sed -i '' '/# CLAUDE SAFETY START/,/# CLAUDE SAFETY END/d' "$shell_config" 2>/dev/null || true
    
    # 新規設定追加
    cat >> "$shell_config" << 'EOF'

# CLAUDE SAFETY START
# rm -rf を自動的に gomi に変換
rm() {
    # -rf パターンを検出
    if [[ "$*" =~ -rf|-fr ]] || ([[ "$*" =~ -r ]] && [[ "$*" =~ -f ]]); then
        echo "🔄 rm -rf → gomi (復元可能な削除)"
        command gomi "$@"
    else
        command /bin/rm "$@"
    fi
}
export -f rm
# CLAUDE SAFETY END

EOF
    
    echo "✅ 設定完了: $shell_config"
}

# 3. 動作確認
test_setup() {
    echo ""
    echo "🧪 動作テスト..."
    
    # テスト用ファイル作成
    local test_file="/tmp/test_safety_$$"
    echo "test" > "$test_file"
    
    # 新しいシェルでテスト
    if bash -c "source ~/.zshrc 2>/dev/null || source ~/.bashrc 2>/dev/null; rm -rf $test_file 2>&1 | grep -q gomi"; then
        echo "✅ 動作確認: OK"
    else
        echo "⚠️  手動で source ~/.zshrc を実行してください"
    fi
    
    # クリーンアップ
    gomi empty --all -f 2>/dev/null || true
}

# 4. 使用方法
show_usage() {
    cat << 'EOF'

🎉 セットアップ完了！

📋 使い方:
1. source ~/.zshrc  (または source ~/.bashrc)
2. これで rm -rf が自動的に gomi に変換されます

🗑️ ゴミ箱操作:
• gomi list    - 削除ファイル一覧
• gomi restore - ファイル復元
• gomi empty   - ゴミ箱を空に

💡 Claude Codeが rm -rf を実行しても安全です！

EOF
}

# メイン処理
main() {
    install_gomi
    setup_shell
    test_setup
    show_usage
}

main "$@" 