# 📚 3 段階翻訳アプリ開発研修 - 実用的な LLM アプリを作ろう

## 🎯 研修概要

この研修では、日本語テキストを「フォーマル・カジュアル・普通」の 3 つのトーンで英語翻訳する Web アプリケーションを、**Next.js + shadcn/ui + LLM API**を使って実装します。

現代の AI 開発において重要な「LLM 統合」「UI/UX 設計」「エラーハンドリング」を実践的に学べる内容です。

### 📋 学習内容

- Next.js 15（App Router）の実践的な使用法
- shadcn/ui による美しい UI 実装
- OpenAI API / Claude API との連携
- プロンプトエンジニアリングの基礎
- エラーハンドリングとフォールバック設計
- TypeScript での型安全な開発

### 🎓 対象者

- React/Next.js の基礎知識がある方
- LLM アプリ開発に興味がある方
- 実用的な Web アプリ開発スキルを身につけたい方

---

## 🛠️ Phase 1: 環境準備

### 必要なツール

```bash
# Node.js (v18以上)
node --version

# npm or yarn
npm --version
```

### プロジェクト作成

```bash
# Next.jsプロジェクト作成
npx create-next-app@latest translation-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd translation-app
```

### shadcn/ui セットアップ

```bash
# shadcn/ui 初期化
npx shadcn@latest init

# 必要なコンポーネントを一括インストール
npx shadcn@latest add button input textarea card badge alert skeleton
```

### 依存関係追加

```bash
# LLM SDK + アイコン
npm install openai @anthropic-ai/sdk lucide-react
```

**💡 学習ポイント 1: モダンなフロントエンド開発環境**

- App Router による効率的なルーティング
- shadcn/ui によるコンポーネント駆動開発
- TypeScript による型安全性の確保

---

## 📝 Phase 2: 翻訳プロンプト設計

### プロンプトファイル作成

`src/lib/prompts.ts`

```typescript
export const TRANSLATION_PROMPTS = {
  formal: `あなたは専門的な翻訳者です。以下の日本語を、ビジネス文書や学術論文に適した格式高い英語に翻訳してください。
敬語や丁寧語はformalな表現に、専門用語は適切な英語表現に変換してください。

日本語: {text}

英語:`,

  casual: `あなたはフレンドリーな翻訳者です。以下の日本語を、友人同士の会話や親しみやすいコミュニケーションに適した英語に翻訳してください。
カジュアルで親近感のある表現を使用してください。

日本語: {text}

英語:`,

  normal: `以下の日本語を、自然で標準的な英語に翻訳してください。
フォーマルすぎず、カジュアルすぎない、バランスの取れた表現を使用してください。

日本語: {text}

英語:`,
};

export const formatPrompt = (template: string, text: string): string => {
  return template.replace(/{text}/g, text);
};
```

**💡 学習ポイント 2: プロンプトエンジニアリング**

- 明確な役割定義（専門的翻訳者 vs フレンドリー翻訳者）
- 具体的な出力指示（フォーマル vs カジュアル）
- テンプレート化による再利用性

---

## 🔌 Phase 3: LLM サービスクラス実装

### LLM サービス作成

`src/lib/llm-service.ts`

```typescript
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { TRANSLATION_PROMPTS, formatPrompt } from "./prompts";

export type LLMProvider = "openai" | "claude";
export type TranslationTone = "formal" | "casual" | "normal";
export type TranslationResult = {
  formal: string;
  casual: string;
  normal: string;
};

export class LLMService {
  private provider: LLMProvider;
  private openaiClient?: OpenAI;
  private anthropicClient?: Anthropic;

  constructor(provider: LLMProvider = "openai") {
    this.provider = provider;

    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is not configured");
      }
      this.openaiClient = new OpenAI({ apiKey });
    } else if (provider === "claude") {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error("Anthropic API key is not configured");
      }
      this.anthropicClient = new Anthropic({ apiKey });
    }
  }

  async translate(prompt: string): Promise<string> {
    try {
      if (this.provider === "openai" && this.openaiClient) {
        const response = await this.openaiClient.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content:
                "You are a professional translator. Provide only the translation without any explanations.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        });

        const translation = response.choices[0]?.message?.content;
        if (!translation) {
          throw new Error("No translation received from OpenAI");
        }
        return translation;
      } else if (this.provider === "claude" && this.anthropicClient) {
        const response = await this.anthropicClient.messages.create({
          model: "claude-3-sonnet-20240229",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          system:
            "You are a professional translator. Provide only the translation without any explanations.",
          max_tokens: 1000,
          temperature: 0.3,
        });

        const translation = response.content[0]?.text;
        if (!translation) {
          throw new Error("No translation received from Claude");
        }
        return translation;
      }

      throw new Error(`Invalid provider: ${this.provider}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Translation failed: ${error.message}`);
      }
      throw new Error("Translation failed: Unknown error");
    }
  }

  async translateWithTones(text: string): Promise<TranslationResult> {
    const tones: TranslationTone[] = ["formal", "casual", "normal"];
    const translations: Partial<TranslationResult> = {};

    // 3つのトーンで並列翻訳
    const promises = tones.map(async (tone) => {
      try {
        const prompt = formatPrompt(TRANSLATION_PROMPTS[tone], text);
        const translation = await this.translate(prompt);
        return { tone, translation };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          tone,
          translation: `Translation error: ${errorMessage.replace(
            "Translation failed: ",
            ""
          )}`,
        };
      }
    });

    const results = await Promise.all(promises);

    results.forEach(({ tone, translation }) => {
      translations[tone] = translation;
    });

    return translations as TranslationResult;
  }
}
```

**💡 学習ポイント 3: 並列処理とエラー処理**

- Promise.all による効率的な並列 API 呼び出し
- 各プロバイダー固有の API 仕様への対応
- 段階的なエラーハンドリング設計

---

## 🌐 Phase 4: API Route 実装

### 翻訳 API エンドポイント

`src/app/api/translate/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { LLMService, LLMProvider } from "@/lib/llm-service";

// Demo用のサンプル翻訳結果
const getDemoTranslations = (inputText: string) => {
  return {
    formal: `I would like to respectfully request your kind assistance with the following matter: "${inputText}". This is a professional translation demonstrating formal tone in English.`,
    casual: `Hey! So you want me to translate "${inputText}"? Here's a casual, friendly version for you! This is super relaxed and conversational.`,
    normal: `Could you please help translate "${inputText}"? This is a standard, balanced translation that's neither too formal nor too casual.`,
  };
};

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { text, provider = "openai" } = body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    if (provider !== "openai" && provider !== "claude") {
      return NextResponse.json(
        { success: false, error: 'Invalid provider. Use "openai" or "claude"' },
        { status: 400 }
      );
    }

    // APIキー確認とDemo機能
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY;

    if (!hasOpenAIKey && !hasClaudeKey) {
      console.log(
        "🎯 Demo mode: No API keys found, returning sample translations"
      );

      // リアルなAPI体験のための遅延
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const translations = getDemoTranslations(text);

      return NextResponse.json({
        success: true,
        translations,
        demo: true,
        message:
          "Demo mode: Using sample translations (API keys not configured)",
      });
    }

    try {
      const llmService = new LLMService(provider as LLMProvider);
      const translations = await llmService.translateWithTones(text);

      return NextResponse.json({
        success: true,
        translations,
      });
    } catch (serviceError) {
      console.log(
        "🎯 Falling back to demo mode due to service error:",
        serviceError
      );

      const translations = getDemoTranslations(text);

      return NextResponse.json({
        success: true,
        translations,
        demo: true,
        message: `Demo mode: API key for ${provider} not configured`,
      });
    }
  } catch (error) {
    console.error("Translation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: "Translation failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
```

**💡 学習ポイント 4: 実用的な API 設計**

- Demo 機能による開発体験の向上
- 段階的なフォールバック機能
- 適切な HTTP ステータスコードの使用

---

## 🎨 Phase 5: UI コンポーネント実装

### メイン翻訳フォーム

`src/components/TranslationForm.tsx`

```typescript
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, AlertCircle } from "lucide-react";

type TranslationResult = {
  formal: string;
  casual: string;
  normal: string;
};

type Provider = "openai" | "claude";

export function TranslationForm() {
  const [text, setText] = useState("");
  const [provider, setProvider] = useState<Provider>("openai");
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<TranslationResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedTone, setCopiedTone] = useState<string | null>(null);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);
    setTranslations(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          provider,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Translation failed");
      }

      setTranslations(data.translations);

      if (data.demo) {
        console.log("🎯 Demo mode:", data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (
    tone: keyof TranslationResult,
    translation: string
  ) => {
    try {
      await navigator.clipboard.writeText(translation);
      setCopiedTone(tone);
      setTimeout(() => setCopiedTone(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toneLabels = {
    formal: "フォーマル",
    casual: "カジュアル",
    normal: "普通",
  };

  const toneColors = {
    formal: "default" as const,
    casual: "secondary" as const,
    normal: "outline" as const,
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>日本語→英語 翻訳</CardTitle>
          <CardDescription>
            日本語テキストを3つのトーン（フォーマル・カジュアル・普通）で英語に翻訳します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="text" className="text-sm font-medium">
              翻訳したいテキスト
            </label>
            <Textarea
              id="text"
              placeholder="翻訳したい日本語テキストを入力してください..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="provider" className="text-sm font-medium">
              LLMプロバイダー
            </label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="claude">Claude (Anthropic)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTranslate}
              disabled={!text.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? "翻訳中..." : "翻訳する"}
            </Button>
            <Button
              onClick={() => {
                setText("");
                setTranslations(null);
                setError(null);
              }}
              variant="outline"
            >
              クリア
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>翻訳エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Card>
          <CardContent className="p-6 space-y-4">
            {(["formal", "casual", "normal"] as const).map((tone) => (
              <div key={tone} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {translations && (
        <Card>
          <CardHeader>
            <CardTitle>翻訳結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(Object.keys(translations) as Array<keyof TranslationResult>).map(
              (tone) => (
                <div key={tone} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={toneColors[tone]}>{toneLabels[tone]}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(tone, translations[tone])}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedTone === tone ? "コピー済み" : "コピー"}
                    </Button>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm">{translations[tone]}</p>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

**💡 学習ポイント 5: React Hooks と UX 設計**

- useState による状態管理の実践
- ローディング状態とエラー状態の適切な表示
- クリップボード API の活用

---

## 🏠 Phase 6: メインページ統合

### ホームページ実装

`src/app/page.tsx`

```typescript
import { TranslationForm } from "@/components/TranslationForm";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">3段階翻訳アプリ</h1>
        <p className="text-center text-muted-foreground mb-12">
          日本語を「硬い」「柔らかい」「普通」の3つのトーンで英語に翻訳します
        </p>
        <TranslationForm />
      </div>
    </main>
  );
}
```

---

## 🚀 Phase 7: 動作確認とテスト

### 開発サーバー起動

```bash
npm run dev
```

### 基本動作テスト

1. **http://localhost:3000** にアクセス
2. 以下のテストケースで動作確認

**テストケース 1（日常会話）:**

```
こんにちは！今日は良い天気ですね。一緒にお茶でも飲みませんか？
```

**テストケース 2（ビジネス）:**

```
会議の件でご連絡いたします。来週火曜日の午後2時からの会議室Aでの打ち合わせについて、資料の準備をお願いいたします。
```

**テストケース 3（技術文書）:**

```
機械学習モデルの精度向上のため、データの前処理とハイパーパラメータの調整を実施し、クロスバリデーションによる評価を行いました。
```

### API 直接テスト

```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"おはようございます！","provider":"openai"}'
```

**💡 学習ポイント 6: 段階的テスト手法**

- UI 動作確認
- API 単体テスト
- 異常系の動作確認

---

## 🔧 発展課題

### レベル 1: 基本カスタマイズ

1. **カラーテーマ変更**: shadcn/ui のテーマカスタマイズ
2. **翻訳言語追加**: 英語 → 日本語翻訳の実装
3. **文字数制限**: 長文テキストの分割処理

### レベル 2: 機能拡張

1. **翻訳履歴**: LocalStorage を使用した履歴機能
2. **お気に入り**: よく使う翻訳結果の保存
3. **エクスポート**: 翻訳結果の CSV/JSON 出力

### レベル 3: 高度な機能

1. **リアルタイム翻訳**: WebSocket を使用したライブ翻訳
2. **音声入力**: Web Speech API との統合
3. **多言語対応**: i18n を使用した国際化

---

## 🛡️ トラブルシューティング

### よくある問題と解決法

**Q: shadcn/ui コンポーネントが表示されない**

```bash
# components.jsonの確認
cat components.json

# 必要なコンポーネントの再インストール
npx shadcn@latest add button card
```

**Q: API 呼び出しが CORS エラーになる**

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
        ],
      },
    ];
  },
};
```

**Q: TypeScript エラーが解決しない**

```bash
# 型定義の確認と再生成
npm run build
npx tsc --noEmit
```

---

## 📊 研修成果の確認

### 実装完了チェックリスト

- [ ] Next.js 環境構築完了
- [ ] shadcn/ui 統合完了
- [ ] LLM サービスクラス実装
- [ ] API Route 実装
- [ ] UI コンポーネント実装
- [ ] エラーハンドリング実装
- [ ] Demo 機能動作確認
- [ ] 基本テストケース通過

### スキル習得確認

- [ ] プロンプトエンジニアリングの理解
- [ ] 並列処理の実装
- [ ] エラーハンドリングの設計
- [ ] shadcn/ui の活用
- [ ] TypeScript での型安全な開発

---

## 🎉 まとめ

この研修を通じて、以下の実用的なスキルを習得できました：

1. **モダンな Web アプリ開発**: Next.js + TypeScript + shadcn/ui
2. **LLM アプリケーション開発**: API の統合とプロンプト設計
3. **実用的な UX 設計**: ローディング、エラー処理、Demo 機能
4. **メンテナブルなコード**: TypeScript、エラーハンドリング、モジュール設計

### 次のステップ

- API キーを取得して実際の LLM と連携
- 発展課題に取り組んでスキルアップ
- 他の LLM サービス（Gemini、Ollama 等）との統合
- プロダクション環境へのデプロイ（Vercel、Railway 等）

### 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)

---

**🚀 実用的な LLM アプリ開発スキルの習得、お疲れさまでした！**

この研修で身につけたスキルを活用して、さらに高度な AI アプリケーションの開発に挑戦してください。

---

_この記事は実際に動作するサンプルコードを含んでいます。GitHub 等でソースコードを公開している場合は、併せてご活用ください。_

---

最終更新: 2025-01-28 17:30:00 JST
