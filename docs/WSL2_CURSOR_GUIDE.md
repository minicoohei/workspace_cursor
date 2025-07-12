# 🪟 WSL2 + Cursor 完全ガイド

## 🎯 WSL2とは？

**Windows Subsystem for Linux 2 (WSL2)**は、WindowsでLinux環境を動かすためのシステムです。

### 💡 なぜWSL2を使うのか？

**従来のWindows開発の問題：**
- 📁 パスの区切り文字（`\` vs `/`）
- 🔧 シェルスクリプトが直接実行できない
- 🐍 Python/Node.jsの環境構築が複雑
- 🐳 Docker の動作が不安定

**WSL2で解決される問題：**
- ✅ Linux環境なのでシェルスクリプトが直接実行可能
- ✅ Mac/Linux と同じ開発環境
- ✅ Docker が安定動作
- ✅ 高速なファイルアクセス

## 🚀 WSL2のインストール

### 1. WSL2の有効化
```powershell
# PowerShellを管理者として実行
wsl --install
```

### 2. 再起動
```powershell
# システムを再起動
Restart-Computer
```

### 3. Ubuntu設定
```bash
# 初回起動時にユーザー名とパスワードを設定
# 例: ユーザー名 = myuser, パスワード = mypassword
```

## 🔧 CursorとWSL2の連携

### 🎯 連携の仕組み

```
Windows（ホスト）
├── Cursor IDE (Windows版)
├── WSL2 (Linux環境)
│   ├── Ubuntu
│   ├── プロジェクトファイル
│   └── 開発環境
└── 両方が連携して動作
```

### 📁 ファイルシステムの関係

**Windowsからアクセス：**
```
C:\Users\YourName\Documents\work_space  →  Windows側
\\wsl$\Ubuntu\home\myuser\work_space   →  WSL2側
```

**WSL2からアクセス：**
```
/mnt/c/Users/YourName/Documents/work_space  →  Windows側
/home/myuser/work_space                     →  WSL2側
```

## 🛠️ 実際の使用方法

### 方法1: Windows側でCursorを開く（推奨）

```bash
# 1. Windows側のファイルエクスプローラーで
C:\Users\YourName\Documents\work_space

# 2. このフォルダを右クリック
# 3. 「Cursorで開く」を選択
```

### 方法2: WSL2側でCursorを開く

```bash
# 1. WSL2のターミナルで
cd /home/myuser/work_space

# 2. Cursorを起動
cursor .
```

### 方法3: Remote WSL 拡張機能を使用

```bash
# 1. Cursor拡張機能「Remote - WSL」をインストール
# 2. Ctrl+Shift+P → "Remote-WSL: New Window"
# 3. WSL2環境が自動で開く
```

## 🎯 プロジェクトでの実際の使用例

### 🌟 推奨ワークフロー

```bash
# 1. Windows側でプロジェクトをダウンロード
git clone https://github.com/your-repo/work_space.git
cd work_space

# 2. Cursorで開く
cursor .

# 3. WSL2ターミナルを開く（Cursor内で）
# Ctrl+Shift+` でターミナルを開く
# 右下の「+」→「WSL」を選択

# 4. セットアップスクリプトを実行
bash setup_magic.sh
```

### 📋 具体的な作業フロー

**1. プロジェクトを開く**
```bash
# Windows側
C:\Users\YourName\Documents\work_space
```

**2. CursorでWSL2ターミナルを開く**
```bash
# Cursorのターミナルで自動的にWSL2環境に
myuser@DESKTOP-XXX:/mnt/c/Users/YourName/Documents/work_space$
```

**3. セットアップ実行**
```bash
# シェルスクリプトが正常に動作
bash setup_magic.sh
```

**4. 開発作業**
```bash
# Node.jsアプリケーション起動
npm start

# Python環境
python3 app.py

# Jupyter Notebook
jupyter notebook
```

## 🎨 Cursor設定の最適化

### .vscode/settings.json の更新

```json
{
  "terminal.integrated.defaultProfile.windows": "WSL",
  "terminal.integrated.profiles.windows": {
    "WSL": {
      "path": "wsl.exe",
      "args": [],
      "icon": "terminal-linux"
    }
  },
  "remote.WSL.fileWatcher.polling": true,
  "files.watcherExclude": {
    "**/node_modules/**": true
  }
}
```

### 拡張機能の設定

**必須拡張機能：**
- 🔧 **Remote - WSL** - WSL2連携
- 🐍 **Python** - Python開発
- 🟢 **Node.js** - Node.js開発
- 🐳 **Docker** - コンテナ開発

## 🔍 トラブルシューティング

### よくある問題と解決法

#### 1. ファイルが見つからない
```bash
# 問題: Windows側のファイルがWSL2で見つからない
# 解決: 正しいパスを使用
cd /mnt/c/Users/YourName/Documents/work_space
```

#### 2. パーミッションエラー
```bash
# 問題: 実行権限がない
# 解決: 実行権限を付与
chmod +x setup_magic.sh
```

#### 3. Node.jsが見つからない
```bash
# 問題: WSL2でNode.jsが未インストール
# 解決: WSL2内でNode.jsをインストール
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4. 日本語文字化け
```bash
# 問題: 日本語が文字化けする
# 解決: 文字コードを設定
export LANG=ja_JP.UTF-8
echo 'export LANG=ja_JP.UTF-8' >> ~/.bashrc
```

## 📊 パフォーマンス最適化

### 🚀 高速化のコツ

**1. WSL2側にプロジェクトを配置**
```bash
# 高速: WSL2のファイルシステム
/home/myuser/work_space

# 低速: Windows側のファイルシステム
/mnt/c/Users/YourName/Documents/work_space
```

**2. .wslconfig の設定**
```ini
# C:\Users\YourName\.wslconfig
[wsl2]
memory=8GB
processors=4
swap=2GB
```

## 🎯 本プロジェクトでの最適な使用方法

### 🌟 推奨セットアップ

```bash
# 1. WSL2をインストール
wsl --install

# 2. WSL2でプロジェクトをクローン
cd ~
git clone https://github.com/your-repo/work_space.git
cd work_space

# 3. Windows側でCursorを開く
# エクスプローラーで \\wsl$\Ubuntu\home\myuser\work_space を開く
# 右クリック → 「Cursorで開く」

# 4. 魔法のセットアップ実行
bash setup_magic.sh
```

### 🎊 完了後の確認

```bash
# 1. Node.jsの確認
node --version

# 2. Python の確認
python3 --version

# 3. Webサーバーの起動
npm start

# 4. ブラウザでアクセス
# http://localhost:3000
```

## 📚 学習リソース

### 📖 公式ドキュメント
- [WSL2 公式ガイド](https://docs.microsoft.com/ja-jp/windows/wsl/)
- [Cursor WSL2 連携](https://cursor.sh/docs/wsl)

### 🎯 学習順序
1. **WSL2の基本理解**
2. **Cursor連携の設定**
3. **実際のプロジェクト開発**
4. **トラブルシューティング**

## 🤝 サポート

### 🆘 困った時は

**自動サポート（推奨）：**
```
Cursorで「WSL2で困っています」と入力
→ 自動的にサポートが開始されます
```

**手動確認：**
```bash
# システム情報の確認
wsl --list --verbose
wsl --status
```

## 💡 実践的なTips

### 🔧 開発効率化

**1. エイリアスの設定**
```bash
# ~/.bashrc に追加
alias ll='ls -la'
alias ..='cd ..'
alias setup='bash setup_magic.sh'
```

**2. Git設定**
```bash
# WSL2でGit設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**3. SSH鍵の設定**
```bash
# SSH鍵の生成
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
```

---

## 🎊 まとめ

**WSL2 + Cursor で実現できること：**
- ✅ Windows でも Mac/Linux 同様の開発環境
- ✅ シェルスクリプトが直接実行可能
- ✅ Docker が安定動作
- ✅ 高速なファイルアクセス
- ✅ 本プロジェクトの完全動作

**次のステップ：**
1. WSL2をインストール
2. プロジェクトをクローン
3. `bash setup_magic.sh` 実行
4. 開発開始！

WSL2は最初は複雑に見えますが、一度設定すれば **Windows最強の開発環境** になります！

---
最終更新: 2025-01-28 16:30:00 JST