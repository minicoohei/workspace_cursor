import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranslationForm } from '@/components/TranslationForm';

// Mock the fetch API
global.fetch = jest.fn();

describe('TranslationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form with all elements', () => {
    render(<TranslationForm />);
    
    expect(screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '翻訳する' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should have default provider selected as OpenAI', () => {
    render(<TranslationForm />);
    
    const providerSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(providerSelect.value).toBe('openai');
  });

  it('should allow switching between providers', async () => {
    const user = userEvent.setup();
    render(<TranslationForm />);
    
    const providerSelect = screen.getByRole('combobox');
    await user.selectOptions(providerSelect, 'claude');
    
    expect((providerSelect as HTMLSelectElement).value).toBe('claude');
  });

  it('should disable translate button when input is empty', () => {
    render(<TranslationForm />);
    
    const translateButton = screen.getByRole('button', { name: '翻訳する' });
    expect(translateButton).toBeDisabled();
  });

  it('should enable translate button when input has text', async () => {
    const user = userEvent.setup();
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...');
    const translateButton = screen.getByRole('button', { name: '翻訳する' });
    
    await user.type(input, 'こんにちは');
    
    expect(translateButton).not.toBeDisabled();
  });

  it('should clear input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...') as HTMLTextAreaElement;
    await user.type(input, 'こんにちは');
    
    expect(input.value).toBe('こんにちは');
    
    const clearButton = screen.getByRole('button', { name: 'クリア' });
    await user.click(clearButton);
    
    expect(input.value).toBe('');
  });

  it('should show loading state while translating', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({
          success: true,
          translations: {
            formal: 'Good day',
            casual: 'Hey',
            normal: 'Hello'
          }
        })
      }), 100))
    );
    
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...');
    const translateButton = screen.getByRole('button', { name: '翻訳する' });
    
    await user.type(input, 'こんにちは');
    await user.click(translateButton);
    
    expect(screen.getByText('翻訳中...')).toBeInTheDocument();
    expect(translateButton).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.queryByText('翻訳中...')).not.toBeInTheDocument();
    });
  });

  it('should display translation results after successful translation', async () => {
    const user = userEvent.setup();
    const mockTranslations = {
      formal: 'Good day',
      casual: 'Hey there',
      normal: 'Hello'
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        translations: mockTranslations
      })
    });
    
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...');
    const translateButton = screen.getByRole('button', { name: '翻訳する' });
    
    await user.type(input, 'こんにちは');
    await user.click(translateButton);
    
    await waitFor(() => {
      expect(screen.getByText('フォーマル')).toBeInTheDocument();
      expect(screen.getByText('Good day')).toBeInTheDocument();
      expect(screen.getByText('カジュアル')).toBeInTheDocument();
      expect(screen.getByText('Hey there')).toBeInTheDocument();
      expect(screen.getByText('普通')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('should show copy buttons for each translation', async () => {
    const user = userEvent.setup();
    const mockTranslations = {
      formal: 'Good day',
      casual: 'Hey there',
      normal: 'Hello'
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        translations: mockTranslations
      })
    });
    
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...');
    await user.type(input, 'こんにちは');
    await user.click(screen.getByRole('button', { name: '翻訳する' }));
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button', { name: /コピー/ });
      expect(copyButtons).toHaveLength(3);
    });
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Translation failed',
        details: 'API rate limit exceeded'
      })
    });
    
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...');
    const translateButton = screen.getByRole('button', { name: '翻訳する' });
    
    await user.type(input, 'こんにちは');
    await user.click(translateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/翻訳エラー/)).toBeInTheDocument();
      expect(screen.getByText(/API rate limit exceeded/)).toBeInTheDocument();
    });
  });

  it('should handle network errors', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...');
    const translateButton = screen.getByRole('button', { name: '翻訳する' });
    
    await user.type(input, 'こんにちは');
    await user.click(translateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it('should make API call with correct parameters', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        translations: {
          formal: 'Good day',
          casual: 'Hey',
          normal: 'Hello'
        }
      })
    });
    
    render(<TranslationForm />);
    
    const input = screen.getByPlaceholderText('翻訳したい日本語テキストを入力してください...');
    const providerSelect = screen.getByRole('combobox');
    
    await user.selectOptions(providerSelect, 'claude');
    await user.type(input, 'テストテキスト');
    await user.click(screen.getByRole('button', { name: '翻訳する' }));
    
    expect(global.fetch).toHaveBeenCalledWith('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'テストテキスト',
        provider: 'claude',
      }),
    });
  });
});