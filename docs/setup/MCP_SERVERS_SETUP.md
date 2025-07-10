# 🔌 MCPサーバー設定ガイド

## 📋 概要

このプロジェクトでは、以下のMCPサーバーが設定されています：

| サーバー名 | 用途 | 自動起動 | 必要な認証情報 |
|-----------|------|---------|---------------|
| mcp-time | タイムスタンプ提供 | ✅ | なし |
| filesystem | ファイルシステム操作 | ❌ | なし |
| github | GitHub連携 | ❌ | GITHUB_TOKEN |
| figma-developer-mcp | Figmaデザイン連携 | ❌ | FIGMA_ACCESS_TOKEN |

## 🚀 セットアップ手順

### 1. 環境変数の設定

`.env.local`ファイルを作成して、必要な認証情報を設定：

```bash
# .env.local
GITHUB_TOKEN=your_github_personal_access_token
FIGMA_ACCESS_TOKEN=your_figma_access_token
```

### 2. 各MCPサーバーの詳細設定

#### 📁 Filesystem MCPサーバー
- ファイルシステムの読み書き操作
- ディレクトリの作成・削除
- ファイル検索・移動

**使用例**:
- ファイルの作成・編集
- ディレクトリ構造の管理
- ファイル検索

#### 🐙 GitHub MCPサーバー
1. GitHubでPersonal Access Tokenを作成
2. 必要な権限：`repo`, `read:user`
3. 環境変数に設定

**使用例**:
- リポジトリの作成・管理
- Issue/PRの操作
- コードの検索

#### 🎨 Figma MCPサーバー
1. FigmaでPersonal Access Tokenを作成
2. 必要な権限：`file:read`

**使用例**:
- デザインファイルの取得
- コンポーネント情報の抽出
- アセットのエクスポート

#### ⏰ MCP-Time サーバー
- 日本時間のタイムスタンプ提供
- 自動起動設定済み
- Docker Composeで実行

**使用例**:
- 正確な日本時間の取得
- ドキュメントのタイムスタンプ
- ログ記録用時刻

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

### ファイルシステム操作
```typescript
// ファイルを作成
await createFile("example.txt", "Hello World")

// ディレクトリを作成
await createDirectory("new_folder")
```

### GitHubリポジトリの操作
```typescript
// Issueを作成
await createIssue("Bug report", "Description...")

// PRをマージ
await mergePullRequest(123)
```

### Figmaデザインファイルの操作
```typescript
// デザインファイルを取得
await getFigmaFile("fileKey")

// コンポーネントをエクスポート
await exportComponent("nodeId")
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

## 🗑️ 削除されたサーバー

以下のサーバーは使用頻度が低いため設定から削除されました：
- `postgres`: PostgreSQL操作用（必要時に再追加可能）
- `slack`: Slack連携用（必要時に再追加可能）
- `playwright`: ブラウザ自動化用（必要時に再追加可能）
- `notion`: Notion連携用（必要時に再追加可能）

必要に応じて、これらのサーバーを再度追加することができます。

---
最終更新: 2025-07-10 23:15:00 JST 