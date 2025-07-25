import { LLMService } from '@/lib/llm-service';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Mock the LLM libraries
jest.mock('openai');
jest.mock('@anthropic-ai/sdk');

describe('LLMService', () => {
  let service: LLMService;
  let mockOpenAIClient: jest.Mocked<OpenAI>;
  let mockAnthropicClient: jest.Mocked<Anthropic>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up environment variables for tests
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    
    // Create mock instances
    mockOpenAIClient = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    } as any;

    mockAnthropicClient = {
      messages: {
        create: jest.fn(),
      },
    } as any;

    // Mock the constructors
    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAIClient);
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => mockAnthropicClient);
  });

  describe('constructor', () => {
    it('should create instance with OpenAI provider by default', () => {
      service = new LLMService();
      expect(service).toBeDefined();
      expect(OpenAI).toHaveBeenCalledWith({
        apiKey: process.env.OPENAI_API_KEY,
      });
    });

    it('should create instance with Claude provider when specified', () => {
      service = new LLMService('claude');
      expect(service).toBeDefined();
      expect(Anthropic).toHaveBeenCalledWith({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    });

    it('should throw error if OpenAI API key is missing', () => {
      delete process.env.OPENAI_API_KEY;
      
      expect(() => new LLMService('openai')).toThrow('OpenAI API key is not configured');
      
      process.env.OPENAI_API_KEY = 'test-openai-key';
    });

    it('should throw error if Claude API key is missing', () => {
      delete process.env.ANTHROPIC_API_KEY;
      
      expect(() => new LLMService('claude')).toThrow('Anthropic API key is not configured');
      
      process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    });
  });

  describe('translate', () => {
    beforeEach(() => {
      process.env.OPENAI_API_KEY = 'test-openai-key';
      process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    });

    describe('with OpenAI provider', () => {
      beforeEach(() => {
        service = new LLMService('openai');
      });

      it('should call OpenAI API with correct parameters', async () => {
        const prompt = 'Translate this text';
        const mockResponse = {
          choices: [{
            message: {
              content: 'Translated text',
            },
          }],
        };
        
        mockOpenAIClient.chat.completions.create.mockResolvedValueOnce(mockResponse as any);
        
        const result = await service.translate(prompt);
        
        expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledWith({
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
        
        expect(result).toBe('Translated text');
      });

      it('should handle OpenAI API errors', async () => {
        const error = new Error('OpenAI API error');
        mockOpenAIClient.chat.completions.create.mockRejectedValueOnce(error);
        
        await expect(service.translate('test')).rejects.toThrow('Translation failed: OpenAI API error');
      });

      it('should handle empty response from OpenAI', async () => {
        const mockResponse = {
          choices: [{
            message: {
              content: '',
            },
          }],
        };
        
        mockOpenAIClient.chat.completions.create.mockResolvedValueOnce(mockResponse as any);
        
        await expect(service.translate('test')).rejects.toThrow('No translation received from OpenAI');
      });
    });

    describe('with Claude provider', () => {
      beforeEach(() => {
        service = new LLMService('claude');
      });

      it('should call Claude API with correct parameters', async () => {
        const prompt = 'Translate this text';
        const mockResponse = {
          content: [{
            text: 'Translated text',
          }],
        };
        
        mockAnthropicClient.messages.create.mockResolvedValueOnce(mockResponse as any);
        
        const result = await service.translate(prompt);
        
        expect(mockAnthropicClient.messages.create).toHaveBeenCalledWith({
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
        
        expect(result).toBe('Translated text');
      });

      it('should handle Claude API errors', async () => {
        const error = new Error('Claude API error');
        mockAnthropicClient.messages.create.mockRejectedValueOnce(error);
        
        await expect(service.translate('test')).rejects.toThrow('Translation failed: Claude API error');
      });

      it('should handle empty response from Claude', async () => {
        const mockResponse = {
          content: [{
            text: '',
          }],
        };
        
        mockAnthropicClient.messages.create.mockResolvedValueOnce(mockResponse as any);
        
        await expect(service.translate('test')).rejects.toThrow('No translation received from Claude');
      });
    });
  });

  describe('translateWithTones', () => {
    beforeEach(() => {
      process.env.OPENAI_API_KEY = 'test-openai-key';
      service = new LLMService('openai');
    });

    it('should translate text with all three tones', async () => {
      const text = 'こんにちは';
      const mockResponses = {
        formal: 'Good day',
        casual: 'Hey there',
        normal: 'Hello',
      };

      // Mock three successful API calls
      mockOpenAIClient.chat.completions.create
        .mockResolvedValueOnce({ choices: [{ message: { content: mockResponses.formal } }] } as any)
        .mockResolvedValueOnce({ choices: [{ message: { content: mockResponses.casual } }] } as any)
        .mockResolvedValueOnce({ choices: [{ message: { content: mockResponses.normal } }] } as any);

      const result = await service.translateWithTones(text);

      expect(result).toEqual({
        formal: 'Good day',
        casual: 'Hey there',
        normal: 'Hello',
      });

      expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledTimes(3);
    });

    it('should handle partial failures gracefully', async () => {
      const text = 'こんにちは';

      // Mock one success, one failure, one success
      mockOpenAIClient.chat.completions.create
        .mockResolvedValueOnce({ choices: [{ message: { content: 'Good day' } }] } as any)
        .mockRejectedValueOnce(new Error('API error'))
        .mockResolvedValueOnce({ choices: [{ message: { content: 'Hello' } }] } as any);

      const result = await service.translateWithTones(text);

      expect(result).toEqual({
        formal: 'Good day',
        casual: 'Translation error: API error',
        normal: 'Hello',
      });
    });

    it('should handle all failures', async () => {
      const text = 'こんにちは';
      const error = new Error('API error');

      mockOpenAIClient.chat.completions.create.mockRejectedValue(error);

      const result = await service.translateWithTones(text);

      expect(result).toEqual({
        formal: 'Translation error: API error',
        casual: 'Translation error: API error',
        normal: 'Translation error: API error',
      });
    });
  });
});