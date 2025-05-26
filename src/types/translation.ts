export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// OpenAI形式のチャットメッセージ
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// OpenAI形式のレスポンス形式
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

// OpenAIのレスポンス形式
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface TranslationRequest {
  originalText: string;
  translatedText: string;
  direction: TranslationDirection;
  model: string;
  processingTime?: string;
  tokenUseage?: {
    promptTokens: string;
    completionTokens: number;
    totalTokens: number;
  };
}

export type TranslationDirection = "日英" | "英日" | "自動判定";

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  direction: TranslationDirection;
  model: string;
  processingTime?: string;
}

export interface TranslationError {
  message: string;
  originalText: string;
  suggestions: string[];
}

export interface ApiConfig {
  baseUrl: string;
  model: string;
  apiKey?: string;
}
