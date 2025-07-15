# 📅 タイムスタンプ機能使用ガイド

## 概要

このプロジェクトでは、ドキュメントの最終更新時刻を自動的に管理するためのタイムスタンプ機能を提供しています。

## 🔧 提供機能

### 1. タイムスタンプ取得スクリプト

- **ファイル**: `scripts/get_timestamp.py`
- **目的**: 日本時間（JST）でのタイムスタンプを様々な形式で取得

### 2. global.mdc 自動更新スクリプト

- **ファイル**: `scripts/update_global_timestamp.sh`
- **目的**: `.cursor/rules/global.mdc`ファイルのタイムスタンプを自動更新

### 3. MCP タイムサーバー

- **ディレクトリ**: `mcp-time/`
- **目的**: MCP プロトコル経由でタイムスタンプを提供

## 📝 使用方法

### タイムスタンプの取得

```bash
# フォーマット済みタイムスタンプ（デフォルト）
python3 scripts/get_timestamp.py
# 出力例: 最終更新: 2025-07-15 23:38:05 JST

# 各種フォーマット
python3 scripts/get_timestamp.py formatted    # 最終更新: YYYY-MM-DD HH:MM:SS JST
python3 scripts/get_timestamp.py current      # YYYY-MM-DD HH:MM:SS
python3 scripts/get_timestamp.py iso          # ISO 8601形式
python3 scripts/get_timestamp.py date         # YYYY-MM-DD
python3 scripts/get_timestamp.py time         # HH:MM:SS
```

### global.mdc ファイルの更新

```bash
# 自動更新（対話式）
bash scripts/update_global_timestamp.sh

# 自動更新（バックアップ削除を自動承認）
echo "y" | bash scripts/update_global_timestamp.sh
```

### MCP サーバーの起動

```bash
# 自動起動スクリプト使用
bash scripts/start-mcp-time.sh

# 直接起動
cd mcp-time/mcp-time && python3 src/main.py
```

## 🎯 ドキュメント作成時のルール

プロジェクトルールに従い、すべてのドキュメント作成・更新時には以下の形式でタイムスタンプを記載してください：

### Markdown ファイル

```markdown
---

最終更新: YYYY-MM-DD HH:MM:SS JST
```

### HTML ファイル

```html
<!-- 最終更新: YYYY-MM-DD HH:MM:SS JST -->
```

### その他のテキストファイル

```
# 最終更新: YYYY-MM-DD HH:MM:SS JST
```

## 🔧 トラブルシューティング

### MCP サーバーが動作しない場合

1. **必要なパッケージのインストール**

   ```bash
   pip3 install fastmcp pytz
   ```

2. **Python パスの確認**

   ```bash
   which python3
   python3 --version
   ```

3. **ポート競合の確認**
   ```bash
   lsof -i :3000  # または使用しているポート
   ```

### タイムスタンプが更新されない場合

1. **スクリプトの実行権限確認**

   ```bash
   ls -la scripts/get_timestamp.py
   ls -la scripts/update_global_timestamp.sh
   ```

2. **手動実行テスト**

   ```bash
   python3 scripts/get_timestamp.py formatted
   ```

3. **ファイルパスの確認**
   ```bash
   ls -la .cursor/rules/global.mdc
   ```

## 🚀 自動化の提案

### Git フックでの自動更新

```bash
# .git/hooks/pre-commit に追加
#!/bin/bash
echo "y" | bash scripts/update_global_timestamp.sh
git add .cursor/rules/global.mdc
```

### VS Code/Cursor での自動実行

- タスクランナーの設定
- 保存時の自動実行
- ショートカットキーの設定

## 📊 MCP サーバー機能

MCP サーバーは以下の関数を提供します：

- `get_current_time()`: 現在の日本時間
- `get_formatted_timestamp()`: フォーマット済みタイムスタンプ
- `get_iso_timestamp()`: ISO 8601 形式
- `get_date_only()`: 日付のみ
- `get_time_only()`: 時刻のみ

## 🎓 学習ポイント

### 初心者向け

- Python での日時処理
- シェルスクリプトの基本
- ファイル操作の自動化

### 中級者向け

- MCP プロトコルの理解
- 非同期処理の実装
- エラーハンドリングの実装

### 上級者向け

- 分散システムでの時刻同期
- タイムゾーン処理の最適化
- パフォーマンス改善

## 🔒 セキュリティ考慮事項

- タイムスタンプの改ざん防止
- ファイルアクセス権限の管理
- バックアップファイルの適切な削除

---

最終更新: 2025-07-15 23:38:05 JST
