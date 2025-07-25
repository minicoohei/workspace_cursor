# 🛡️ Claude Code 安全システム

Claude Code が誤って`rm -rf`を実行しても、自動的に`gomi`（復元可能な削除）に変換するシンプルな安全システムです。

## 🚀 クイックスタート

```bash
# 1. セットアップ（初回のみ）
./claude_safety_unified.sh

# 2. 有効化
source ~/.zshrc

# 完了！
```

## 🎯 動作内容

- `rm -rf anything` → 自動的に `gomi anything` に変換
- 削除したファイルは復元可能
- 通常の`rm`は影響なし

## 🗑️ ゴミ箱操作

```bash
gomi list     # 削除ファイル一覧
gomi restore  # ファイルを復元
gomi empty    # ゴミ箱を空に
```

## 📝 仕組み

`.zshrc`に以下の関数が追加されます：

```bash
rm() {
    if [[ "$*" =~ -rf|-fr ]]; then
        echo "🔄 rm -rf → gomi (復元可能な削除)"
        command gomi "$@"
    else
        command /bin/rm "$@"
    fi
}
```

## ⚠️ 注意事項

- Claude Code のフック機能は現在動作しないため、シェル関数で対応
- `gomi`は`brew install gomi`でインストール
- 元の`rm`を使いたい場合は`/bin/rm`を直接実行

---

最終更新: 2025-07-25 18:05:00 JST
