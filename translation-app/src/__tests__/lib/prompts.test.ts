import { TRANSLATION_PROMPTS, formatPrompt } from '@/lib/prompts';

describe('Translation Prompts', () => {
  describe('TRANSLATION_PROMPTS', () => {
    it('should have formal, casual, and normal prompts', () => {
      expect(TRANSLATION_PROMPTS).toHaveProperty('formal');
      expect(TRANSLATION_PROMPTS).toHaveProperty('casual');
      expect(TRANSLATION_PROMPTS).toHaveProperty('normal');
    });

    it('should have prompts containing placeholder for text', () => {
      expect(TRANSLATION_PROMPTS.formal).toContain('{text}');
      expect(TRANSLATION_PROMPTS.casual).toContain('{text}');
      expect(TRANSLATION_PROMPTS.normal).toContain('{text}');
    });

    it('should have formal prompt with appropriate keywords', () => {
      const formalPrompt = TRANSLATION_PROMPTS.formal;
      expect(formalPrompt).toContain('専門的な翻訳者');
      expect(formalPrompt).toContain('ビジネス文書');
      expect(formalPrompt).toContain('学術論文');
      expect(formalPrompt).toContain('格式高い');
    });

    it('should have casual prompt with appropriate keywords', () => {
      const casualPrompt = TRANSLATION_PROMPTS.casual;
      expect(casualPrompt).toContain('フレンドリー');
      expect(casualPrompt).toContain('友人同士');
      expect(casualPrompt).toContain('親しみやすい');
      expect(casualPrompt).toContain('カジュアル');
    });

    it('should have normal prompt with appropriate keywords', () => {
      const normalPrompt = TRANSLATION_PROMPTS.normal;
      expect(normalPrompt).toContain('自然で標準的');
      expect(normalPrompt).toContain('フォーマルすぎず');
      expect(normalPrompt).toContain('カジュアルすぎない');
      expect(normalPrompt).toContain('バランス');
    });
  });

  describe('formatPrompt', () => {
    it('should replace {text} placeholder with provided text', () => {
      const template = '日本語: {text}\n英語:';
      const text = 'こんにちは';
      const result = formatPrompt(template, text);
      expect(result).toBe('日本語: こんにちは\n英語:');
    });

    it('should handle multiple {text} placeholders', () => {
      const template = 'First: {text}, Second: {text}';
      const text = 'test';
      const result = formatPrompt(template, text);
      expect(result).toBe('First: test, Second: test');
    });

    it('should handle empty text', () => {
      const template = '日本語: {text}';
      const result = formatPrompt(template, '');
      expect(result).toBe('日本語: ');
    });

    it('should handle text with special characters', () => {
      const template = '日本語: {text}';
      const text = '特殊文字!@#$%^&*()';
      const result = formatPrompt(template, text);
      expect(result).toBe('日本語: 特殊文字!@#$%^&*()');
    });

    it('should work with actual translation prompts', () => {
      const text = 'テストメッセージ';
      const formalResult = formatPrompt(TRANSLATION_PROMPTS.formal, text);
      const casualResult = formatPrompt(TRANSLATION_PROMPTS.casual, text);
      const normalResult = formatPrompt(TRANSLATION_PROMPTS.normal, text);

      expect(formalResult).toContain('テストメッセージ');
      expect(casualResult).toContain('テストメッセージ');
      expect(normalResult).toContain('テストメッセージ');

      expect(formalResult).not.toContain('{text}');
      expect(casualResult).not.toContain('{text}');
      expect(normalResult).not.toContain('{text}');
    });
  });
});