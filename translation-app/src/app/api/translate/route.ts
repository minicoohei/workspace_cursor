import { NextRequest, NextResponse } from 'next/server';
import { LLMService, LLMProvider } from '@/lib/llm-service';

// Demo用のサンプル翻訳結果
const getDemoTranslations = (inputText: string) => {
  return {
    formal: `I would like to respectfully request your kind assistance with the following matter: "${inputText}". This is a professional translation demonstrating formal tone in English.`,
    casual: `Hey! So you want me to translate "${inputText}"? Here's a casual, friendly version for you! This is super relaxed and conversational.`,
    normal: `Could you please help translate "${inputText}"? This is a standard, balanced translation that's neither too formal nor too casual.`
  };
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { text, provider = 'openai' } = body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // Validate provider
    if (provider !== 'openai' && provider !== 'claude') {
      return NextResponse.json(
        { success: false, error: 'Invalid provider. Use "openai" or "claude"' },
        { status: 400 }
      );
    }

    // Check if API keys are available
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY;
    
    // If no API keys are available, use demo mode
    if (!hasOpenAIKey && !hasClaudeKey) {
      console.log('🎯 Demo mode: No API keys found, returning sample translations');
      
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const translations = getDemoTranslations(text);
      
      return NextResponse.json({
        success: true,
        translations,
        demo: true,
        message: 'Demo mode: Using sample translations (API keys not configured)'
      });
    }

    // Try to create LLM service instance
    try {
      const llmService = new LLMService(provider as LLMProvider);
      
      // Translate with all tones
      const translations = await llmService.translateWithTones(text);

      return NextResponse.json({
        success: true,
        translations,
      });
    } catch (serviceError) {
      console.log('🎯 Falling back to demo mode due to service error:', serviceError);
      
      // If service creation fails (e.g., missing API key for selected provider), fall back to demo
      const translations = getDemoTranslations(text);
      
      return NextResponse.json({
        success: true,
        translations,
        demo: true,
        message: `Demo mode: API key for ${provider} not configured`
      });
    }
  } catch (error) {
    console.error('Translation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Translation failed',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}