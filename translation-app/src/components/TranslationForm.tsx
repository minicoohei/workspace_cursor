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

      // Show demo message if in demo mode
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
