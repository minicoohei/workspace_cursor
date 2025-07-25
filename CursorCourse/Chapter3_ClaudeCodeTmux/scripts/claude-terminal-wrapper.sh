#!/bin/bash

# ===========================================
# Claude Code ターミナルラッパー
# ===========================================

# 元のシェル設定を読み込み
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi

if [ -f "$HOME/.zshrc" ]; then
    source "$HOME/.zshrc"
fi

# Claude Code安全設定
export CLAUDE_SAFETY_ENABLED=true
export CLAUDE_SAFETY_HOOK="$(dirname "$0")/check-dangerous-command.sh"
export CLAUDE_SAFETY_LOG="$HOME/.claude_safety.log"

# コマンドインターセプト関数
claude_safe_exec() {
    local cmd="$*"
    
    # 危険コマンドかチェック
    if [[ "$cmd" =~ rm.*-.*r.*f|sudo.*rm|chmod.*777|curl.*\|.*bash ]]; then
        echo "🛡️ Claude Safety: 危険コマンドを検知しました"
        "$CLAUDE_SAFETY_HOOK" "$cmd"
    else
        # 安全なコマンドはそのまま実行
        eval "$cmd"
    fi
}

# rmコマンドのオーバーライド
rm() {
    claude_safe_exec "rm $*"
}

# sudoコマンドのオーバーライド
sudo() {
    if [[ "$1" == "rm" ]]; then
        claude_safe_exec "sudo $*"
    else
        command sudo "$@"
    fi
}

# chmodコマンドのオーバーライド
chmod() {
    if [[ "$*" =~ 777 ]]; then
        claude_safe_exec "chmod $*"
    else
        command chmod "$@"
    fi
}

# セッション開始メッセージ
echo "🛡️ Claude Code 安全ターミナル起動"
echo "✅ 危険コマンド検知機能が有効です"

# gomi利用可能性チェック
if command -v gomi >/dev/null 2>&1; then
    echo "✅ gomi (安全削除) 利用可能"
else
    echo "⚠️  gomi未インストール - 'brew install gomi' を推奨"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" 