import { TranslationForm } from '@/components/TranslationForm';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          3段階翻訳アプリ
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          日本語を「硬い」「柔らかい」「普通」の3つのトーンで英語に翻訳します
        </p>
        <TranslationForm />
      </div>
    </main>
  );
}