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

⚠️ 危険なコマンドが検出されました

💀 検出コマンド: $cmd
🔍 危険理由: $reason

EOF
}

# gomi 利用可能チェック

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
if [[-z "$COMMAND"]]; then
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

# settings.json ベース Claude Code 安全設定

## 🎯 概要

Cursor/VSCode の `settings.json` を使って、Claude Code 利用時の危険コマンド検知・置換システムを統合的に管理します。

## 📁 ファイル構成

```
.vscode/
├── settings.json          # メイン設定ファイル
├── tasks.json             # カスタムタスク定義
└── keybindings.json       # キーバインド設定

scripts/
├── check-dangerous-command.sh    # 危険コマンドチェックスクリプト
├── setup-safety-hooks.sh         # 初期セットアップスクリプト
└── claude-terminal-wrapper.sh    # ターミナルラッパー
```

## 🚀 Step 1: 危険コマンドチェックスクリプト設置

### scripts/check-dangerous-command.sh の作成

前節で作成したスクリプトを配置し、実行権限を付与します。

```bash
# スクリプトディレクトリ作成
mkdir -p scripts

# 実行権限付与
chmod +x scripts/check-dangerous-command.sh

# パス確認
which check-dangerous-command.sh
```

## 🛠️ Step 2: settings.json 設定

### .vscode/settings.json

```json
{
  "// ==========================================": "",
  "// Claude Code 安全設定": "",
  "// ==========================================": "",

  "claude.safety": {
    "enabled": true,
    "hookScript": "${workspaceFolder}/scripts/check-dangerous-command.sh",
    "logFile": "${env:HOME}/.claude_safety.log",
    "level": "strict"
  },

  "// ターミナル統合設定": "",
  "terminal.integrated.profiles.osx": {
    "Claude-Safe-Bash": {
      "path": "/bin/bash",
      "args": [
        "--rcfile",
        "${workspaceFolder}/scripts/claude-terminal-wrapper.sh"
      ],
      "icon": "shield",
      "color": "terminal.ansiGreen"
    },
    "Claude-Safe-Zsh": {
      "path": "/bin/zsh",
      "args": [
        "-c",
        "source ${workspaceFolder}/scripts/claude-terminal-wrapper.sh && exec zsh"
      ],
      "icon": "shield",
      "color": "terminal.ansiGreen"
    }
  },

  "terminal.integrated.profiles.linux": {
    "Claude-Safe-Bash": {
      "path": "/bin/bash",
      "args": [
        "--rcfile",
        "${workspaceFolder}/scripts/claude-terminal-wrapper.sh"
      ],
      "icon": "shield",
      "color": "terminal.ansiGreen"
    }
  },

  "// デフォルトプロファイル": "",
  "terminal.integrated.defaultProfile.osx": "Claude-Safe-Zsh",
  "terminal.integrated.defaultProfile.linux": "Claude-Safe-Bash",

  "// ターミナル動作設定": "",
  "terminal.integrated.confirmOnExit": "hasChildProcesses",
  "terminal.integrated.enableBell": true,
  "terminal.integrated.bellDuration": 1000,

  "// Claude Code固有設定": "",
  "claude.commands": {
    "preExecutionHook": "${workspaceFolder}/scripts/check-dangerous-command.sh",
    "safeMode": true,
    "autoGomiSuggestion": true
  },

  "// セキュリティ設定": "",
  "security.workspace.trust.untrustedFiles": "prompt",
  "security.workspace.trust.banner": "always",

  "// ワークスペース固有": "",
  "files.watcherExclude": {
    "**/.claude_safety.log": true
  },

  "// エクスプローラー設定": "",
  "explorer.decorations.badges": true,
  "explorer.decorations.colors": true,

  "// エディター設定": "",
  "editor.rulers": [80, 120],
  "editor.bracketPairColorization.enabled": true,

  "// 危険パターンハイライト": "",
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "comment.line.danger",
        "settings": {
          "foreground": "#ff6b6b",
          "fontStyle": "bold"
        }
      }
    ]
  }
}
```

## 📋 Step 3: タスク定義（tasks.json）

### .vscode/tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🛡️ Claude Safety Check",
      "type": "shell",
      "command": "${workspaceFolder}/scripts/check-dangerous-command.sh",
      "args": ["${input:commandToCheck}"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "problemMatcher": []
    },
    {
      "label": "🚀 Claude Code Session Start",
      "type": "shell",
      "command": "echo",
      "args": [
        "🤖 Claude Code セッション開始\n🛡️ 安全フックが有効化されています\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      ],
      "group": "build",
      "presentation": {
        "echo": false,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "📊 Safety Log Analysis",
      "type": "shell",
      "command": "tail",
      "args": ["-n", "50", "$HOME/.claude_safety.log"],
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "new"
      }
    },
    {
      "label": "🧹 Safety Environment Setup",
      "type": "shell",
      "command": "${workspaceFolder}/scripts/setup-safety-hooks.sh",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true
      },
      "dependsOn": [],
      "runOptions": {
        "runOn": "folderOpen"
      }
    }
  ],
  "inputs": [
    {
      "id": "commandToCheck",
      "description": "チェックするコマンドを入力してください",
      "default": "rm -rf test/",
      "type": "promptString"
    }
  ]
}
```

## ⌨️ Step 4: キーバインド設定

### .vscode/keybindings.json

```json
[
  {
    "key": "ctrl+shift+s",
    "command": "workbench.action.tasks.runTask",
    "args": "🛡️ Claude Safety Check",
    "when": "terminalFocus"
  },
  {
    "key": "ctrl+shift+c",
    "command": "workbench.action.tasks.runTask",
    "args": "🚀 Claude Code Session Start"
  },
  {
    "key": "ctrl+shift+l",
    "command": "workbench.action.tasks.runTask",
    "args": "📊 Safety Log Analysis"
  },
  {
    "key": "ctrl+alt+t",
    "command": "workbench.action.terminal.newWithProfile",
    "args": {
      "profileName": "Claude-Safe-Zsh"
    }
  }
]
```

## 🔧 Step 5: ターミナルラッパースクリプト

### scripts/claude-terminal-wrapper.sh

```bash
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
```

## 🔄 Step 6: 自動セットアップスクリプト

### scripts/setup-safety-hooks.sh

```bash
#!/bin/bash

# ===========================================
# Claude Code 安全設定 自動セットアップ
# ===========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🛡️ Claude Code 安全設定をセットアップ中..."

# 1. gomiのインストール確認
if ! command -v gomi >/dev/null 2>&1; then
    echo "📥 gomiをインストール中..."
    if command -v brew >/dev/null 2>&1; then
        brew install gomi
    else
        echo "❌ Homebrewが見つかりません。手動でgomiをインストールしてください。"
        echo "   https://github.com/b4b4r07/gomi"
    fi
fi

# 2. 実行権限の付与
chmod +x "$SCRIPT_DIR/check-dangerous-command.sh"
chmod +x "$SCRIPT_DIR/claude-terminal-wrapper.sh"

# 3. .vscodeディレクトリの作成
mkdir -p "$WORKSPACE_ROOT/.vscode"

# 4. 設定ファイルの存在確認
if [ ! -f "$WORKSPACE_ROOT/.vscode/settings.json" ]; then
    echo "⚠️  settings.jsonが見つかりません。サンプル設定を確認してください。"
fi

# 5. ログファイルの初期化
touch "$HOME/.claude_safety.log"

# 6. 動作テスト
echo "🧪 動作テストを実行中..."
echo "test content" > /tmp/test_safety_file.txt

# テストコマンド実行
if "$SCRIPT_DIR/check-dangerous-command.sh" "ls /tmp/test_safety_file.txt" >/dev/null 2>&1; then
    echo "✅ 安全コマンドテスト: 正常"
else
    echo "❌ 安全コマンドテスト: 失敗"
fi

# クリーンアップ
rm -f /tmp/test_safety_file.txt

echo "🎉 Claude Code 安全設定のセットアップが完了しました！"
echo ""
echo "📋 次のステップ:"
echo "1. Cursor/VSCodeを再起動してください"
echo "2. Ctrl+Shift+C で Claude Codeセッションを開始"
echo "3. 新しいターミナルで安全機能をテスト"
echo ""
echo "🔗 詳細: https://your-repo.com/claude-safety-guide"
```

## 🧪 Step 7: 動作テスト

### 基本動作確認

```bash
# 1. セットアップスクリプト実行
./scripts/setup-safety-hooks.sh

# 2. Cursor/VSCode再起動

# 3. 新しいターミナル開く（安全プロファイル使用）

# 4. 危険コマンドテスト
rm -rf test_directory  # アラートが表示されるはず

# 5. タスク実行テスト
# Ctrl+Shift+P → "Tasks: Run Task" → "🛡️ Claude Safety Check"
```

### 期待される動作

```
🛡️ Claude Code 安全ターミナル起動
✅ 危険コマンド検知機能が有効です
✅ gomi (安全削除) 利用可能
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ rm -rf test_directory

🚨 ========================================
   CLAUDE CODE 安全アラート
🚨 ========================================

⚠️  危険なコマンドが検出されました

💀 検出コマンド: rm -rf test_directory
🔍 危険理由: 完全削除コマンド（復元不可能）

✅ 推奨する安全なコマンド:
🛡️  gomi test_directory

💡 gomi は削除したファイルを復元可能です

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤔 どちらを実行しますか？

1) 🛡️  安全なコマンド: gomi test_directory
2) ⚠️  元のコマンド: rm -rf test_directory
3) ❌ キャンセル

選択してください (1/2/3):
```

## 🔧 カスタマイズ・拡張

### 危険パターンの追加

`check-dangerous-command.sh` に新しいパターンを追加:

```bash
# Docker関連の危険コマンド
if [[ "$COMMAND" =~ docker.*rmi.*-f|docker.*system.*prune.*-f ]]; then
    show_alert "$COMMAND" "Docker強制削除"
    # 処理続行...
fi

# Git関連の危険コマンド
if [[ "$COMMAND" =~ git.*reset.*--hard.*HEAD~|git.*clean.*-fd ]]; then
    show_alert "$COMMAND" "Git履歴・ファイル強制削除"
    # 処理続行...
fi
```

### 設定レベルの調整

`settings.json` でレベル調整:

```json
{
  "claude.safety": {
    "level": "strict", // strict/normal/loose
    "autoBlock": ["sudo rm", "chmod 777"],
    "warnOnly": ["git reset --hard"],
    "ignore": ["rm -rf .git/", "rm -rf node_modules/"]
  }
}
```

## 📊 ログ分析・統計

### 安全統計の表示

```bash
# ログ分析コマンド
grep "BLOCKED" ~/.claude_safety.log | wc -l          # ブロック回数
grep "DANGEROUS_CONFIRMED" ~/.claude_safety.log | wc -l  # 危険実行回数
grep "SAFE_EXECUTION" ~/.claude_safety.log | wc -l   # 安全実行回数
```

### 統計タスクの追加

`tasks.json` に統計表示タスクを追加:

```json
{
  "label": "📈 Safety Statistics",
  "type": "shell",
  "command": "bash",
  "args": [
    "-c",
    "echo '📊 Claude Code安全統計:' && echo '🚫 ブロック: '$(grep 'BLOCKED' ~/.claude_safety.log | wc -l) && echo '⚠️ 警告: '$(grep 'DANGEROUS_CONFIRMED' ~/.claude_safety.log | wc -l) && echo '✅ 安全実行: '$(grep 'SAFE_EXECUTION' ~/.claude_safety.log | wc -l)"
  ]
}
```

## 🚨 トラブルシューティング

### よくある問題と解決法

#### 1. スクリプトが実行されない

```bash
# 実行権限確認
ls -la scripts/check-dangerous-command.sh

# 権限付与
chmod +x scripts/check-dangerous-command.sh
```

#### 2. ターミナルプロファイルが表示されない

```bash
# Cursor/VSCode再起動
# settings.jsonの構文確認
jq . .vscode/settings.json
```

#### 3. フックが動作しない

```bash
# 環境変数確認
echo $CLAUDE_SAFETY_ENABLED
echo $CLAUDE_SAFETY_HOOK

# ラッパースクリプト確認
source scripts/claude-terminal-wrapper.sh
```

## 📖 参考リソース

- [VSCode Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [VSCode Terminal Profiles](https://code.visualstudio.com/docs/terminal/profiles)
- [VSCode Settings Reference](https://code.visualstudio.com/docs/getstarted/settings)
- [Cursor IDE Settings](https://cursor.sh/docs)

---

**🛡️ settings.json ベースの統合的な安全設定で、Claude Code を安心して活用しましょう！**

この設定により、IDE レベルでの危険コマンド検知・置換が可能になり、一元的な安全管理を実現できます。

---

最終更新: 2025-01-28 20:00:00 JST
