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

# 4. settings.jsonのサンプル作成
if [ ! -f "$WORKSPACE_ROOT/.vscode/settings.json" ]; then
    echo "📝 settings.jsonサンプルを作成中..."
    cat > "$WORKSPACE_ROOT/.vscode/settings.json" << 'EOF'
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
  
  "// セキュリティ設定": "",
  "security.workspace.trust.untrustedFiles": "prompt",
  "security.workspace.trust.banner": "always"
}
EOF
fi

# 5. tasks.jsonのサンプル作成
if [ ! -f "$WORKSPACE_ROOT/.vscode/tasks.json" ]; then
    echo "📋 tasks.jsonサンプルを作成中..."
    cat > "$WORKSPACE_ROOT/.vscode/tasks.json" << 'EOF'
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
        "panel": "shared"
      }
    },
    {
      "label": "🚀 Claude Code Session Start",
      "type": "shell",
      "command": "echo",
      "args": [
        "🤖 Claude Code セッション開始\\n🛡️ 安全フックが有効化されています\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      ],
      "group": "build",
      "presentation": {
        "echo": false,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
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
EOF
fi

# 6. ログファイルの初期化
touch "$HOME/.claude_safety.log"

# 7. 動作テスト
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

echo ""
echo "🎉 Claude Code 安全設定のセットアップが完了しました！"
echo ""
echo "📋 次のステップ:"
echo "1. Cursor/VSCodeを再起動してください"
echo "2. 'Ctrl+Shift+P' → 'Tasks: Run Task' → '🚀 Claude Code Session Start'"
echo "3. 新しいターミナルで安全機能をテスト:"
echo "   $ rm -rf test_directory  # アラートが表示されます"
echo ""
echo "🔧 キーボードショートカット:"
echo "- Ctrl+Alt+T: 安全ターミナル起動" 
echo "- Ctrl+Shift+S: 危険コマンドチェック (ターミナル内)"
echo ""
echo "📊 ログ確認:"
echo "$ tail -f ~/.claude_safety.log"
echo ""
echo "🔗 詳細ガイド: CursorCourse/Chapter3_ClaudeCodeTmux/settings_json_safety.md" 