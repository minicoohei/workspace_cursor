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