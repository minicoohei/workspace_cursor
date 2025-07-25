#!/bin/bash

# ===========================================
# Claude Code 危険コマンドチェックスクリプト
# ===========================================

set -e

COMMAND="$1"
LOG_FILE="$HOME/.claude_safety.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# ログ関数
log_event() {
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
}

# アラート表示関数
show_alert() {
    local cmd="$1"
    local reason="$2"
    
    cat << EOF

🚨 ========================================
   CLAUDE CODE 安全アラート
🚨 ========================================

⚠️  危険なコマンドが検出されました

💀 検出コマンド: $cmd
🔍 危険理由: $reason

EOF
}

# gomi利用可能チェック
check_gomi() {
    if command -v gomi >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 安全な代替コマンド提案
suggest_safe_alternative() {
    local cmd="$1"
    
    # rm -rf の場合
    if [[ "$cmd" =~ rm.*-.*r.*f|rm.*-.*f.*r ]]; then
        if check_gomi; then
            local safe_cmd=$(echo "$cmd" | sed 's/rm -rf/gomi/g' | sed 's/rm -fr/gomi/g')
            echo "✅ 推奨する安全なコマンド:"
            echo "🛡️  $safe_cmd"
            echo ""
            echo "💡 gomi は削除したファイルを復元可能です"
            return 0
        else
            echo "❌ gomi がインストールされていません"
            echo "📥 インストール: brew install gomi"
            return 1
        fi
    fi
    
    return 1
}

# ユーザー確認
ask_user_confirmation() {
    local cmd="$1"
    local safe_cmd="$2"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🤔 どちらを実行しますか？"
    echo ""
    echo "1) 🛡️  安全なコマンド: $safe_cmd"
    echo "2) ⚠️  元のコマンド: $cmd"
    echo "3) ❌ キャンセル"
    echo ""
    read -p "選択してください (1/2/3): " choice
    
    case $choice in
        1)
            echo "✅ 安全なコマンドを実行します"
            log_event "SAFE_EXECUTION: $safe_cmd (原本: $cmd)"
            eval "$safe_cmd"
            exit 0
            ;;
        2)
            echo "⚠️  ユーザー確認済みで元のコマンドを実行します"
            read -p "📝 実行理由を入力してください: " reason
            log_event "DANGEROUS_CONFIRMED: $cmd (理由: $reason)"
            eval "$cmd"
            exit 0
            ;;
        3|*)
            echo "❌ コマンド実行をキャンセルしました"
            log_event "CANCELLED: $cmd"
            exit 1
            ;;
    esac
}

# メイン処理
main() {
    if [[ -z "$COMMAND" ]]; then
        echo "使用方法: $0 <command>"
        exit 1
    fi
    
    log_event "COMMAND_CHECK: $COMMAND"
    
    # 危険パターンチェック
    
    # 1. rm -rf パターン
    if [[ "$COMMAND" =~ rm.*-.*r.*f|rm.*-.*f.*r ]]; then
        show_alert "$COMMAND" "完全削除コマンド（復元不可能）"
        
        if suggest_safe_alternative "$COMMAND"; then
            safe_cmd=$(echo "$COMMAND" | sed 's/rm -rf/gomi/g' | sed 's/rm -fr/gomi/g')
            ask_user_confirmation "$COMMAND" "$safe_cmd"
        else
            echo "⛔ 危険なコマンドの実行をブロックします"
            log_event "BLOCKED: $COMMAND (gomi未インストール)"
            exit 1
        fi
    fi
    
    # 2. sudo rm パターン
    if [[ "$COMMAND" =~ sudo.*rm ]]; then
        show_alert "$COMMAND" "システムレベルの削除（高権限）"
        
        echo "🚫 sudo rm コマンドは実行をブロックします"
        echo "💡 システムファイルの削除は手動で慎重に行ってください"
        log_event "BLOCKED: $COMMAND (sudo rm)"
        exit 1
    fi
    
    # 3. chmod 777 パターン
    if [[ "$COMMAND" =~ chmod.*777 ]]; then
        show_alert "$COMMAND" "セキュリティリスク（全権限付与）"
        
        echo "🔒 chmod 777 は重大なセキュリティリスクです"
        read -p "🤔 本当に実行しますか？ (yes/No): " confirm
        
        if [[ "$confirm" == "yes" ]]; then
            echo "⚠️  ユーザー確認済みで実行します"
            log_event "DANGEROUS_CONFIRMED: $COMMAND (chmod 777)"
            eval "$COMMAND"
        else
            echo "✅ 安全のため実行をキャンセルしました"
            log_event "CANCELLED: $COMMAND (chmod 777)"
            exit 1
        fi
    fi
    
    # 4. curl | bash パターン
    if [[ "$COMMAND" =~ curl.*\|.*bash|wget.*\|.*bash ]]; then
        show_alert "$COMMAND" "未検証スクリプトの実行"
        
        echo "🔍 スクリプトの内容を事前に確認することを強く推奨します"
        read -p "🤔 スクリプトを確認しましたか？ (yes/No): " confirmed
        
        if [[ "$confirmed" == "yes" ]]; then
            echo "✅ 確認済みとして実行します"
            log_event "PIPE_CONFIRMED: $COMMAND"
            eval "$COMMAND"
        else
            echo "📋 まずスクリプトの内容を確認してください："
            local url=$(echo "$COMMAND" | grep -oE 'https?://[^ ]+')
            echo "🔗 $url"
            log_event "CANCELLED: $COMMAND (未確認スクリプト)"
            exit 1
        fi
    fi
    
    # 安全なコマンドは通常実行
    log_event "SAFE_EXECUTION: $COMMAND"
    eval "$COMMAND"
}

# スクリプト実行
main "$@" 