---
description: 文書の要約作成時に実行してください
globs: ["**/*.md", "**/*.txt", "**/*.pdf"]
triggers: ["content-summary！！！"]
---

このファイルを参照したら「要約作成、はっじめるよー！！！！！！！」といってください。

# 要約作成ガイドライン

以下、要約作成時は絶対に守ってください。

- 元の文書の主要なポイントを漏らさないよう注意してください
- 読み手のレベルに応じて要約の詳細度を調整してください
- 「1. 文書分析 → 2. 構造化要約 → 3. レビュー＆調整 → 4. 最終出力」の順で作業を実施してください
- 各工程で、要約内容に問題がないかをかならずユーザーに確認を入れてから次に進むようにしてください

## 1. 文書分析
### 💡 Content Analysis: DOCUMENT_ANALYSIS

【タスク】
1. 文書の基本情報を把握
   - 文書種別（論文/記事/レポート/議事録など）
   - 文書の長さと構造
   - 対象読者層の推定
2. 主要テーマの特定
   - メインテーマ
   - サブテーマ
   - キーワード抽出
3. 文書の目的と結論の把握
   - 著者の主張
   - 提案内容
   - 結論・提言

## 2. 構造化要約
### 💡 Content Summary: STRUCTURED_SUMMARY

【要約レベル】
- **エグゼクティブサマリー**（100-200文字）
- **概要**（300-500文字）
- **詳細要約**（800-1200文字）

【要約構造】
- **背景・目的**
- **主要ポイント**（3-5項目）
- **結論・提言**
- **重要な数値・データ**（該当する場合）
- **次のアクション**（該当する場合）

## 3. レビュー＆調整
### 💡 Content Review: SUMMARY_REVIEW

【チェック項目】
- 原文の主要な情報が含まれているか
- 論理的な流れが保たれているか
- 読みやすさ・理解しやすさ
- 文字数制限内に収まっているか
- 専門用語の説明が適切か

【調整ポイント】
- 冗長な表現の削除
- 重要度に応じた情報の取捨選択
- 読み手に応じた表現の調整

## 4. 最終出力
### 💡 Content Output: FINAL_SUMMARY

【出力形式】
```markdown
# 要約

## 基本情報
- **文書タイトル**: [原文タイトル]
- **著者**: [著者名]
- **文書種別**: [種別]
- **要約作成日**: [日付]

## エグゼクティブサマリー
[100-200文字の超簡潔要約]

## 概要
[300-500文字の概要]

## 主要ポイント
1. **[ポイント1]**: [説明]
2. **[ポイント2]**: [説明]
3. **[ポイント3]**: [説明]

## 結論・提言
[結論と提言内容]

## 重要な数値・データ
- [データ1]
- [データ2]

## 次のアクション
- [アクション1]
- [アクション2]
```

## 要約タイプ別ガイド

### 学術論文
- 研究目的、手法、結果、考察を明確に
- 統計データや実験結果を重視
- 限界や今後の課題も含める

### ビジネス文書
- 意思決定に必要な情報を優先
- 数値目標や期限を明記
- アクションアイテムを明確に

### 技術文書
- 技術的な詳細と実装方法
- 前提条件や制約事項
- トラブルシューティング情報

### 会議議事録
- 決定事項と未決定事項を分離
- 担当者と期限を明記
- 次回までのアクションを整理

## 品質チェックリスト

- [ ] 原文の主要な論点がすべて含まれている
- [ ] 要約の各レベルが適切な文字数に収まっている
- [ ] 論理的な流れが保たれている
- [ ] 専門用語が適切に説明されている
- [ ] 読み手にとって理解しやすい表現になっている
- [ ] 重要な数値やデータが正確に記載されている