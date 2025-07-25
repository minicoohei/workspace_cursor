import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { TRANSLATION_PROMPTS, formatPrompt } from './prompts';

export type LLMProvider = 'openai' | 'claude';
export type TranslationTone = 'formal' | 'casual' | 'normal';
export type TranslationResult = {
  formal: string;
  casual: string;
  normal: string;
};

export class LLMService {
  private provider: LLMProvider;
  private openaiClient?: OpenAI;
  private anthropicClient?: Anthropic;

  constructor(provider: LLMProvider = 'openai') {
    this.provider = provider;

    if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key is not configured');
      }
      this.openaiClient = new OpenAI({ apiKey });
    } else if (provider === 'claude') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('Anthropic API key is not configured');
      }
      this.anthropicClient = new Anthropic({ apiKey });
    }
  }

  async translate(prompt: string): Promise<string> {
    try {
      if (this.provider === 'openai' && this.openaiClient) {
        const response = await this.openaiClient.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Provide only the translation without any explanations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        });

        const translation = response.choices[0]?.message?.content;
        if (!translation) {
          throw new Error('No translation received from OpenAI');
        }
        return translation;
      } else if (this.provider === 'claude' && this.anthropicClient) {
        const response = await this.anthropicClient.messages.create({
          model: 'claude-3-sonnet-20240229',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          system: 'You are a professional translator. Provide only the translation without any explanations.',
          max_tokens: 1000,
          temperature: 0.3,
        });

        const translation = response.content[0]?.text;
        if (!translation) {
          throw new Error('No translation received from Claude');
        }
        return translation;
      }

      throw new Error(`Invalid provider: ${this.provider}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Translation failed: ${error.message}`);
      }
      throw new Error('Translation failed: Unknown error');
    }
  }

  async translateWithTones(text: string): Promise<TranslationResult> {
    const tones: TranslationTone[] = ['formal', 'casual', 'normal'];
    const translations: Partial<TranslationResult> = {};

    // Translate with all three tones in parallel
    const promises = tones.map(async (tone) => {
      try {
        const prompt = formatPrompt(TRANSLATION_PROMPTS[tone], text);
        const translation = await this.translate(prompt);
        return { tone, translation };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { tone, translation: `Translation error: ${errorMessage.replace('Translation failed: ', '')}` };
      }
    });

    const results = await Promise.all(promises);
    
    // Organize results by tone
    results.forEach(({ tone, translation }) => {
      translations[tone] = translation;
    });

    return translations as TranslationResult;
  }
}