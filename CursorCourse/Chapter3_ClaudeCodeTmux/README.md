# Chapter 3: Claude Code + Tmux 実践開発

## 🎯 この章で学ぶこと

現代の AI 開発現場で実際に使われている **Claude Code と Tmux を組み合わせた実践的な開発ワークフロー**を体験します。

### 🌟 学習内容

- **Tmux セッション管理**: 開発環境の永続化と効率的なマルチタスク
- **Claude Code 実装**: AI による高速プロトタイピング手法
- **AI 協調開発**: Cursor ⟷ Claude Code の連携技法
- **🛡️ 安全性保証**: 危険コマンド自動検知・置換システム
- **実践プロジェクト**: 3 段階翻訳アプリの開発

### 🏗️ 実践ワークフロー

```
1. Cursor (要件定義・レビュー)
   ↓
2. Tmux (セッション管理・環境統一)
   ↓
3. Claude Code (実装・プロトタイピング)
   ↓
4. 品質確認・反復改善
```

## 📚 コンテンツ構成

### 🛡️ **必須**: [安全 Hooks 設定](safety_hooks_setup.md)

**Claude Code 使用前に必ず設定してください**

- 危険コマンド（`rm -rf`等）の自動検知・アラート
- 安全な代替手段（`gomi`）への自動置換提案
- 初心者向け安全保護システム

### 1. [Tmux セットアップガイド](tmux_setup_guide.md)

- Tmux インストールと基本設定
- 開発用セッション構成
- 実用的なキーバインド設定

### 2. [Claude Code 基礎](claude_code_basics.md)

- Claude Code の特徴と使い方
- 効果的なプロンプト技法
- 実装品質の向上方法

### 3. [実践ワークフロー](workflow_practice.md)

- AI 協調開発の具体的手順
- ツール間連携のベストプラクティス
- 効率化テクニック

### 4. [翻訳アプリ実例](translation_app_example/)

- 実際のプロジェクトを通した学習
- Next.js + shadcn/ui + LLM API
- 完全動作するサンプルコード

### 5. [演習問題](exercises/)

- 段階的な学習課題
- 実力確認テスト
- 発展課題

## 🚀 始め方

### 前提条件

- Cursor IDE の基本操作（Chapter 1-2 完了推奨）
- Node.js v18+ がインストール済み
- ターミナル操作の基礎知識

### 🛡️ **Step 0: 安全設定（必須）**

```bash
# まず最初に安全フックを設定
# 詳細は safety_hooks_setup.md を参照

# gomiのインストール
brew install gomi

# 安全フック設定
curl -L https://raw.githubusercontent.com/your-repo/safety-hooks.sh | bash

# 設定確認
claude-start
```

### Step 1: セットアップ

```bash
# Tmux のインストール（macOS）
brew install tmux

# Tmux のインストール（Ubuntu/Debian）
sudo apt install tmux

# この章のディレクトリに移動
cd CursorCourse/Chapter3_ClaudeCodeTmux

# Cursor で開く
cursor .
```

## 🛡️ 安全性重視の学習環境

### 初心者向け安全保護機能

- ✅ **危険コマンド自動検知**: `rm -rf`, `sudo`, `chmod 777`等
- ✅ **安全代替提案**: `gomi`による復元可能削除
- ✅ **実行前確認**: 潜在的危険コマンドの事前警告
- ✅ **ログ記録**: 危険コマンド実行履歴の追跡

### 安全学習の流れ

```
1. 安全フック設定 → 2. 基礎学習 → 3. 実践開発 → 4. 安全確認
```

## 💡 学習のポイント

### 📝 実践重視の学習

- 理論だけでなく、実際に手を動かす
- 各ツールの特性を理解した使い分け
- プロジェクト完成までの一連の流れを体験

### 🤖 AI 協調開発の習得

- AI の得意・不得意を理解
- 適切な指示の出し方をマスター
- 人間と AI の役割分担を学習

### ⚡ 効率化の実感

- 従来手法との開発時間比較
- 品質を保ちながらの高速開発
- 継続的改善のサイクル体験

### 🛡️ 安全性の体得

- 危険操作の事前回避
- 安全なコマンド選択の習慣化
- 復元可能性を重視した操作

## 📊 習得目標

この章を完了すると、以下のスキルが身につきます：

- [ ] **Tmux マスター**: セッション管理による効率的な開発環境構築
- [ ] **Claude Code 活用**: AI を使った高速実装技法
- [ ] **ワークフロー設計**: AI 協調開発プロセスの構築・最適化
- [ ] **🛡️ 安全操作**: 危険回避と安全なコマンド運用
- [ ] **実践プロジェクト**: 完全動作する Web アプリケーションの開発
- [ ] **品質保証**: HITL（Human-in-the-Loop）による品質管理

## ⏱️ 推定学習時間

- **🛡️ 安全設定**: 30 分（必須・最優先）
- **基礎学習**: 2-3 時間（Tmux + Claude Code 基礎）
- **実践プロジェクト**: 4-6 時間（翻訳アプリ開発）
- **演習・発展**: 2-4 時間（追加課題）

**合計**: 8.5-13.5 時間

## 🎯 次のステップ

この章を修了したら：

1. **[Chapter 4: MultiAgent](../Chapter4_MultiAgent/)** に進む
2. より複雑なプロジェクトで応用練習
3. チーム開発でのワークフロー共有
4. 企業・組織での導入検討

## 🚨 重要：安全第一の方針

### 学習開始前の必須チェック

```bash
# 安全設定の確認
claude-start

# 危険コマンドテスト
rm -rf test_file  # アラートが表示されれば設定完了

# gomi動作確認
gomi test_file  # 安全削除が動作すれば準備完了
```

### 学習中の注意事項

- **Claude Code からの出力**は必ず内容を確認してから実行
- **危険アラート**が出た場合は必ず内容を理解してから判断
- **わからないコマンド**は実行前に調べる習慣をつける
- **定期的なバックアップ**で万が一に備える

## 🔗 関連リソース

- [Tmux 公式ドキュメント](https://github.com/tmux/tmux/wiki)
- [Claude API ドキュメント](https://docs.anthropic.com/)
- [Next.js 公式ガイド](https://nextjs.org/docs)
- [shadcn/ui コンポーネント](https://ui.shadcn.com/)
- [Gomi - 安全削除ツール](https://github.com/b4b4r07/gomi)

---

**🛡️🚀 安全性を確保した上で、Claude Code + Tmux で現代的な AI 協調開発を体験しましょう！**

**必ず [安全 Hooks 設定](safety_hooks_setup.md) から始めてください。**

---

最終更新: 2025-01-28 19:50:00 JST
