---
marp: true
theme: default
paginate: true
header: 'Cursor + Marp プレビュー'
footer: '© 2025 SampleCursorProject'
---

# Cursor内でMarpプレビュー 🎨

Cursorエディタ内で直接スライドをプレビューできます！

---

## Marpの特徴

- 📝 **Markdownベース**: シンプルな記法でスライド作成
- 🎨 **テーマ対応**: カスタムCSSでデザイン変更可能
- 📊 **数式対応**: LaTeX記法で数式表現
- 🖼️ **画像対応**: ドラッグ&ドロップで簡単挿入

---

## Cursor内プレビューの使い方

1. **Marp拡張機能をインストール**
   - 自動でインストール済み（setup_complete_environment.sh）

2. **プレビューを開く**
   - `Cmd/Ctrl + Shift + V`: プレビューパネル
   - または右上のプレビューアイコンをクリック

3. **リアルタイム更新**
   - 編集内容が即座にプレビューに反映

---

## コード例の表示

```python
# Pythonコード例
def create_presentation(title):
    """Marpプレゼンテーションを作成"""
    return f"""---
marp: true
---

# {title}

プレゼンテーション内容
"""
```

---

## 数式の表示

インライン数式: $E = mc^2$

ブロック数式：

$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$

---

## 画像の配置

![bg right:40% 80%](https://via.placeholder.com/400x300/3498db/ffffff?text=Sample+Image)

### 左側にテキスト

- 画像は右側に配置
- サイズ調整可能
- 背景画像としても使用可

---

## テーブル表示

| 機能 | Cursor | VSCode | その他 |
|------|--------|--------|--------|
| Marpプレビュー | ✅ | ✅ | ❌ |
| AI補完 | ✅ | ❌ | ❌ |
| MCP連携 | ✅ | ❌ | ❌ |

---

## カスタムスタイル

<style scoped>
h2 {
  color: #3498db;
  text-align: center;
}
p {
  text-align: center;
  font-size: 1.2em;
}
</style>

## 🎉 スライド作成を楽しもう！

Cursor + Marpで効率的なプレゼンテーション作成

---

## エクスポート機能

### 対応フォーマット

- 📄 **PDF**: 印刷・配布用
- 🌐 **HTML**: Web公開用
- 🖼️ **PNG/JPEG**: 画像として保存

### エクスポート方法

1. コマンドパレット（`Cmd/Ctrl + Shift + P`）
2. "Marp: Export Slide Deck"を選択
3. フォーマットを選択

---

## まとめ

- ✅ Cursor内で完結するスライド作成
- ✅ リアルタイムプレビュー
- ✅ 多様なエクスポート形式
- ✅ AI支援でコンテンツ作成も効率化

**Happy Presenting! 🎉**

---
最終更新: 2025-07-10 23:10:00 JST 