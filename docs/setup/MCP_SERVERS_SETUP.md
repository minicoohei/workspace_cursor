# 🔌 MCPサーバー設定ガイド

## 🚨 重複問題の解決

### 問題の概要
CursorのTools & IntegrationのMCP設定で同じサーバーが2つ表示される場合があります。
これは以下の原因で発生します：

1. **設定ファイル（`.cursor/mcp.json`）**による管理
2. **UI設定**による手動追加

### 解決手順

#### 1. 現在の設定をクリア
1. Cursor > Settings > Tools & Integration > MCP
2. 重複しているサーバーを**すべて削除**
3. 「Remove」ボタンでUI設定からサーバーを削除

#### 2. 設定ファイルから再設定
現在の設定ファイル（`.cursor/mcp.json`）には以下のサーバーのみが設定されています：

| サーバー名 | 用途 | 自動起動 | 設定方法 |
|-----------|------|---------|----------|
| mcp-time | 日本時間のタイムスタンプ提供 | ✅ | 設定ファイル |

#### 3. 追加サーバーの設定（必要に応じて）
以下のサーバーを追加したい場合は、**UI設定から追加**してください：

**Filesystem サーバー**
- Command: `npx`
- Args: `-y @modelcontextprotocol/server-filesystem /Users/kou1904/Documents`
- Description: ファイルシステム操作用MCPサーバー

**GitHub サーバー**
- Command: `npx`
- Args: `-y @modelcontextprotocol/server-github`
- Environment Variables: `GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_TOKEN}`
- Description: GitHub連携用MCPサーバー

**Figma サーバー**
- Command: `npx`
- Args: `-y figma-developer-mcp --stdio`
- Environment Variables: `FIGMA_API_KEY=${FIGMA_ACCESS_TOKEN}`
- Description: Figmaデザイン連携用MCPサーバー

## 📋 現在の設定

| サーバー名 | 用途 | 自動起動 | 必要な認証情報 |
|-----------|------|---------|---------------|
| mcp-time | タイムスタンプ提供 | ✅ | なし |

## 🚀 セットアップ手順

### 1. 環境変数の設定

`.env.local`ファイルを作成して、必要な認証情報を設定：

```bash
# .env.local
GITHUB_TOKEN=your_github_personal_access_token
FIGMA_ACCESS_TOKEN=your_figma_access_token
```

### 2. 各MCPサーバーの詳細設定

#### ⏰ MCP-Time サーバー
- 日本時間のタイムスタンプ提供
- 自動起動設定済み
- Docker Composeで実行

**使用例**:
- 正確な日本時間の取得
- ドキュメントのタイムスタンプ
- ログ記録用時刻

#### 📁 Filesystem MCPサーバー（オプション）
- ファイルシステムの読み書き操作
- ディレクトリの作成・削除
- ファイル検索・移動

**使用例**:
- ファイルの作成・編集
- ディレクトリ構造の管理
- ファイル検索

#### 🐙 GitHub MCPサーバー（オプション）
1. GitHubでPersonal Access Tokenを作成
2. 必要な権限：`repo`, `read:user`
3. 環境変数に設定

**使用例**:
- リポジトリの作成・管理
- Issue/PRの操作
- コードの検索

#### 🎨 Figma MCPサーバー（オプション）
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

### 重複防止のベストプラクティス
1. **設定ファイル**と**UI設定**の混在を避ける
2. 基本的なサーバーは設定ファイルで管理
3. 追加サーバーはUI設定で管理
4. 定期的に重複チェックを実行

### トラブルシューティング

#### サーバーが起動しない場合
1. 必要な依存関係がインストールされているか確認
2. 環境変数が正しく設定されているか確認
3. Cursorのログを確認：View > Toggle Developer Tools > Console

#### 認証エラーの場合
1. トークンの有効期限を確認
2. 必要な権限が付与されているか確認
3. 環境変数名が正しいか確認

#### 重複が発生した場合
1. UI設定からすべてのサーバーを削除
2. Cursorを再起動
3. 必要なサーバーのみを再追加

## 📚 使用例

### タイムスタンプの取得
```typescript
// 日本時間のタイムスタンプを取得
const timestamp = await getJapaneseTimestamp()
```

### ファイルシステム操作（オプション）
```typescript
// ファイルを作成
await createFile("example.txt", "Hello World")

// ディレクトリを作成
await createDirectory("new_folder")
```

### GitHubリポジトリの操作（オプション）
```typescript
// Issueを作成
await createIssue("Bug report", "Description...")

// PRをマージ
await mergePullRequest(123)
```

### Figmaデザインファイルの操作（オプション）
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
- `filesystem`: ファイルシステム操作用（必要時にUI設定で追加）
- `github`: GitHub連携用（必要時にUI設定で追加）
- `figma-developer-mcp`: Figmaデザイン連携用（必要時にUI設定で追加）
- `postgres`: PostgreSQL操作用（必要時に再追加可能）
- `slack`: Slack連携用（必要時に再追加可能）
- `playwright`: ブラウザ自動化用（必要時に再追加可能）
- `notion`: Notion連携用（必要時に再追加可能）

必要に応じて、これらのサーバーをUI設定から追加することができます。

---
最終更新: 2025-07-10 23:30:00 JST 