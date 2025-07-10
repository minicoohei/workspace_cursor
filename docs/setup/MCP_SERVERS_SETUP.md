# 🔌 MCPサーバー設定ガイド

## 📋 概要

このプロジェクトでは、以下のMCPサーバーが設定されています：

| サーバー名 | 用途 | 自動起動 | 必要な認証情報 |
|-----------|------|---------|---------------|
| mcp-time | タイムスタンプ提供 | ✅ | なし |
| jupyter | Jupyter Notebook操作 | ❌ | なし |
| github | GitHub連携 | ❌ | GITHUB_TOKEN |
| playwright | ブラウザ自動化 | ❌ | なし |
| slack | Slack連携 | ❌ | SLACK_BOT_TOKEN, SLACK_TEAM_ID |
| notion | Notion連携 | ❌ | NOTION_API_KEY |
| figma | Figmaデザイン連携 | ❌ | FIGMA_ACCESS_TOKEN |


## 🚀 セットアップ手順

### 1. 環境変数の設定

`.env.local`ファイルを作成して、必要な認証情報を設定：

```bash
# .env.local
GITHUB_TOKEN=your_github_personal_access_token
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_TEAM_ID=your_slack_team_id
NOTION_API_KEY=your_notion_api_key
FIGMA_ACCESS_TOKEN=your_figma_access_token
```

### 2. 各MCPサーバーの詳細設定

#### 📓 Jupyter MCPサーバー
```bash
# Python環境が必要
pip install mcp-jupyter

# または uvxを使用（推奨）
uvx mcp-jupyter
```

**使用例**:
- Notebookの作成・実行
- セルの操作
- 変数の確認

#### 🐙 GitHub MCPサーバー
1. GitHubでPersonal Access Tokenを作成
2. 必要な権限：`repo`, `read:user`
3. 環境変数に設定

**使用例**:
- リポジトリの作成・管理
- Issue/PRの操作
- コードの検索

#### 🎭 Playwright MCPサーバー
```bash
# 初回のみブラウザをインストール
npx playwright install
```

**使用例**:
- Webページのスクレイピング
- UIテストの自動化
- スクリーンショット取得

#### 💬 Slack MCPサーバー
1. Slack Appを作成
2. Bot User OAuth Tokenを取得
3. 必要なスコープ：`chat:write`, `channels:read`

**使用例**:
- メッセージの送信
- チャンネル情報の取得
- 通知の自動化

#### 📝 Notion MCPサーバー
1. Notion Integrationを作成
2. API Keyを取得
3. 対象ページでIntegrationを有効化

**使用例**:
- ページの作成・更新
- データベース操作
- コンテンツの同期

#### 🎨 Figma MCPサーバー
1. FigmaでPersonal Access Tokenを作成
2. 必要な権限：`file:read`

**使用例**:
- デザインファイルの取得
- コンポーネント情報の抽出
- アセットのエクスポート


## 🔧 MCPサーバーの管理

### 起動と停止
```bash
# Cursor設定画面から個別に起動/停止
# または、Cursorのコマンドパレットから操作
```

### トラブルシューティング

#### サーバーが起動しない場合
1. 必要な依存関係がインストールされているか確認
2. 環境変数が正しく設定されているか確認
3. Cursorのログを確認：View > Toggle Developer Tools > Console

#### 認証エラーの場合
1. トークンの有効期限を確認
2. 必要な権限が付与されているか確認
3. 環境変数名が正しいか確認

## 📚 使用例

### Jupyter Notebookの操作
```typescript
// Notebookを作成
await createNotebook("analysis.ipynb")

// セルを実行
await executeCell(0)
```

### GitHubリポジトリの操作
```typescript
// Issueを作成
await createIssue("Bug report", "Description...")

// PRをマージ
await mergePullRequest(123)
```

### Slackメッセージの送信
```typescript
// チャンネルにメッセージを送信
await postMessage("#general", "Hello from MCP!")
```

## 🛡️ セキュリティ注意事項

1. **認証情報の管理**
   - `.env.local`は必ず`.gitignore`に含める
   - トークンは定期的に更新
   - 最小限の権限のみ付与

2. **アクセス制御**
   - 本番環境のトークンは使用しない
   - テスト用の環境を用意
   - ログに認証情報を出力しない

---
最終更新: 2025-07-10 23:00:00 JST 