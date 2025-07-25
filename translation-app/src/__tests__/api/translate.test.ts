/**
 * @jest-environment node
 */
import { POST } from '@/app/api/translate/route';
import { LLMService } from '@/lib/llm-service';

// Mock the LLMService
jest.mock('@/lib/llm-service');

// Mock NextRequest
class MockNextRequest {
  method: string;
  url: string;
  headers: Headers;
  private body: string;

  constructor(url: string, init: RequestInit) {
    this.url = url;
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers);
    this.body = init.body as string;
  }

  async json() {
    return JSON.parse(this.body);
  }
}

describe('POST /api/translate', () => {
  let mockLLMService: jest.Mocked<LLMService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock instance of LLMService
    mockLLMService = {
      translateWithTones: jest.fn(),
    } as any;

    // Mock the LLMService constructor to return our mock instance
    (LLMService as jest.MockedClass<typeof LLMService>).mockImplementation(() => mockLLMService);
  });

  it('should successfully translate text with all tones', async () => {
    const mockTranslations = {
      formal: 'Good day',
      casual: 'Hey there',
      normal: 'Hello',
    };
    
    mockLLMService.translateWithTones.mockResolvedValueOnce(mockTranslations);

    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'こんにちは',
        provider: 'openai',
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      translations: mockTranslations,
    });
    expect(mockLLMService.translateWithTones).toHaveBeenCalledWith('こんにちは');
  });

  it('should use default provider when not specified', async () => {
    const mockTranslations = {
      formal: 'Good day',
      casual: 'Hey there',
      normal: 'Hello',
    };
    
    mockLLMService.translateWithTones.mockResolvedValueOnce(mockTranslations);

    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'こんにちは',
      }),
    });

    await POST(request as any);

    expect(LLMService).toHaveBeenCalledWith('openai');
  });

  it('should use Claude provider when specified', async () => {
    const mockTranslations = {
      formal: 'Good day',
      casual: 'Hey there',
      normal: 'Hello',
    };
    
    mockLLMService.translateWithTones.mockResolvedValueOnce(mockTranslations);

    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'こんにちは',
        provider: 'claude',
      }),
    });

    await POST(request as any);

    expect(LLMService).toHaveBeenCalledWith('claude');
  });

  it('should return 400 when text is missing', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Text is required',
    });
  });

  it('should return 400 when text is empty', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: '   ',
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Text is required',
    });
  });

  it('should return 400 for invalid provider', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'こんにちは',
        provider: 'invalid',
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Invalid provider. Use "openai" or "claude"',
    });
  });

  it('should handle translation service errors', async () => {
    mockLLMService.translateWithTones.mockRejectedValueOnce(new Error('API rate limit exceeded'));

    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'こんにちは',
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Translation failed',
      details: 'API rate limit exceeded',
    });
  });

  it('should handle invalid JSON in request body', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Invalid request body',
    });
  });

  it('should handle missing request body', async () => {
    const request = new MockNextRequest('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Invalid request body',
    });
  });
});