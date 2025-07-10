# MCPタイムサーバー セットアップガイド

## 🎯 概要

MCPタイムサーバーは、日本時間のタイムスタンプを提供するMCPサーバーです。
複数の実行方法をサポートしており、環境に応じて最適な方法を選択できます。

## 🚀 自動セットアップ（推奨）

### 方法1: 自動判定スクリプト
```bash
bash scripts/start-mcp-time.sh
```

このスクリプトは以下を自動で行います：
- Dockerの有無を確認
- Dockerがある場合：Docker経由で実行
- Dockerがない場合：Python直接実行に切り替え
- 必要な依存関係の自動インストール

## 🐳 Docker実行（推奨）

### 前提条件
- Docker Desktop がインストールされている
- Docker Desktop が起動している

### 利点
- 環境の分離
- 依存関係の問題なし
- 一貫した実行環境

### 実行方法
```bash
# 自動起動スクリプト使用
bash scripts/start-mcp-time.sh

# または手動実行
cd mcp-time
docker compose up -d
docker exec -i mcp-time python /app/mcp-time/mcp-time/src/main.py
```

## 🐍 Python直接実行

### 前提条件
- Python 3.11以上
- pip または pip3

### セットアップ
```bash
# 依存関係のインストール
bash scripts/install-mcp-requirements.sh

# MCPサーバー起動
bash scripts/start-mcp-time-python.sh
```

### 手動セットアップ
```bash
# 仮想環境作成（推奨）
python3 -m venv env/mcp-time
source env/mcp-time/bin/activate

# 依存関係インストール
pip install fastmcp pytz

# MCPサーバー起動
cd mcp-time/mcp-time/src
python3 main.py
```

## ⚙️ Cursor設定

### .cursor/mcp.json
```json
{
  "mcpServers": {
    "mcp-time": {
      "command": "bash",
      "args": ["scripts/start-mcp-time.sh"],
      "env": {},
      "description": "日本時間のタイムスタンプを提供するMCPサーバー（Docker/Python自動選択）",
      "autoStart": true
    },
    "mcp-time-python": {
      "command": "bash",
      "args": ["scripts/start-mcp-time-python.sh"],
      "env": {},
      "description": "日本時間のタイムスタンプを提供するMCPサーバー（Python直接実行）",
      "autoStart": false
    }
  }
}
```

### 設定の説明
- `mcp-time`: 自動判定（Docker優先、Python代替）
- `mcp-time-python`: Python直接実行専用

## 🔧 利用可能なツール

MCPサーバーが提供する時間関連ツール：

### get_current_time()
現在の日本時間を返します
```
例: 2025-01-28 15:30:45
```

### get_formatted_timestamp()
ドキュメント用のフォーマット済みタイムスタンプ
```
例: 最終更新: 2025-01-28 15:30:45 JST
```

### get_iso_timestamp()
ISO 8601形式のタイムスタンプ
```
例: 2025-01-28T15:30:45+09:00
```

### get_date_only()
現在の日付のみ
```
例: 2025-01-28
```

### get_time_only()
現在の時刻のみ
```
例: 15:30:45
```

## 🛠️ トラブルシューティング

### Dockerエラー
```bash
# Dockerデーモンが起動していない
❌ Dockerデーモンが起動していません
💡 Docker Desktopを起動してください

# 解決方法
open -a Docker  # macOSの場合
```

### Python環境エラー
```bash
# Python3がない
❌ Python3がインストールされていません
💡 解決方法: brew install python3

# 依存関係がない
❌ 必要なパッケージがインストールされていません
💡 解決方法: bash scripts/install-mcp-requirements.sh
```

### 権限エラー
```bash
# スクリプトが実行できない
chmod +x scripts/start-mcp-time.sh
chmod +x scripts/start-mcp-time-python.sh
chmod +x scripts/install-mcp-requirements.sh
```

## 📋 動作確認

### 1. スクリプトテスト
```bash
# 自動判定スクリプトのテスト
timeout 10 bash scripts/start-mcp-time.sh

# Python直接実行のテスト
timeout 10 bash scripts/start-mcp-time-python.sh
```

### 2. CursorでのMCPサーバー確認
1. Cursorを再起動
2. 設定画面でMCPサーバーの状態を確認
3. ドキュメント作成時にタイムスタンプツールを使用

## 🎉 完了

MCPタイムサーバーのセットアップが完了しました！
これで、どの環境でも安定してMCPサーバーを利用できます。

---
最終更新: 2025-01-28 15:45:00 JST 