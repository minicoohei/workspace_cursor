# MCPタイムサーバー セットアップガイド

## 概要

このガイドでは、Cursorで現在時刻を正確に取得するためのMCPサーバーのセットアップ方法を説明します。

## 前提条件

- Docker Desktop がインストールされていること
- Cursor 0.45以降がインストールされていること

## セットアップ手順

### 1. Dockerコンテナの起動

```bash
# プロジェクトルートから実行
cd mcp-time
docker compose up -d
```

コンテナが正常に起動したか確認：
```bash
docker ps
# "mcp-time" コンテナが表示されることを確認
```

### 2. Cursorの設定

#### 2.1 設定画面を開く

1. Cursorのコマンドパレットを開く
   - Mac: `Cmd + Shift + P`
   - Windows/Linux: `Ctrl + Shift + P`
2. `Cursor Settings` と入力して選択

#### 2.2 MCPサーバーの追加

1. 設定画面で `MCP` セクションを探す
2. `Add new global MCP Server` をクリック
3. 開いた `mcp.json` に以下を追加：

```json
{
  "mcpServers": {
    "time": {
      "command": "docker",
      "args": [
        "compose",
        "-f",
        "/Users/kou1904/Documents/WorkSpace/SampleCursorProject_NEW/mcp-time/docker-compose.yml",
        "exec",
        "-i",
        "mcp-time",
        "poetry",
        "run",
        "python",
        "src/main.py"
      ]
    }
  }
}
```

**重要**: `-f` の後のパスは**絶対パス**で指定してください。上記の例を自分の環境に合わせて変更してください。

### 3. Cursorの再起動

設定を反映させるために、Cursorを完全に終了して再起動してください。

### 4. 動作確認

Cursorのチャットで以下を試してください：

```
現在時刻を教えて
```

正しく日本時間が表示されれば成功です。

## 提供される機能

MCPサーバーは以下の関数を提供します：

| 関数名 | 説明 | 戻り値の例 |
|--------|------|------------|
| `get_current_time()` | 現在の日本時間 | `2025-01-10 14:30:45` |
| `get_formatted_timestamp()` | ドキュメント用タイムスタンプ | `最終更新: 2025-01-10 14:30:45 JST` |
| `get_iso_timestamp()` | ISO 8601形式 | `2025-01-10T14:30:45+09:00` |
| `get_date_only()` | 日付のみ | `2025-01-10` |
| `get_time_only()` | 時刻のみ | `14:30:45` |

## 使用例

### ドキュメントへの最終更新時刻追加

```
このREADMEに最終更新時刻を追加して
```

### ファイル名に日付を含める

```
今日の日付でログファイルを作成して
```

### 作業記録の作成

```
現在時刻で作業開始記録を作成して
```

## トラブルシューティング

### Dockerコンテナが起動しない

```bash
# コンテナのログを確認
docker compose logs mcp-time

# コンテナを再ビルド
docker compose down
docker compose build --no-cache
docker compose up -d
```

### MCPサーバーに接続できない

1. Dockerコンテナが起動していることを確認
2. `mcp.json` のパスが正しいことを確認
3. Cursorを完全に再起動

### 時刻がずれている

コンテナのタイムゾーン設定を確認：
```bash
docker compose exec mcp-time date
# JST時刻が表示されることを確認
```

## メンテナンス

### コンテナの停止

```bash
cd mcp-time
docker compose down
```

### コンテナの更新

```bash
cd mcp-time
docker compose down
docker compose build --no-cache
docker compose up -d
```

### ログの確認

```bash
docker compose logs -f mcp-time
```

## 注意事項

- Dockerコンテナは常に起動している必要があります
- システム起動時に自動起動したい場合は、Docker Desktopの設定で自動起動を有効にしてください
- 複数のプロジェクトで使用する場合は、ポート番号の競合に注意してください

---
最終更新: 2025-07-10 21:57:00 JST 