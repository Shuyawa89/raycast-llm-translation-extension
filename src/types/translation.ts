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
  role: "system" | "user" | "assistant";
  content: string;
}

// OpenAIのレスポンス形式
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    // 配列で帰ってくるが通常は一件のみ
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
  tokenUsage?: {
    promptTokens: string;
    completionTokens: number;
    totalTokens: number;
  };
}

export type TranslationDirection = "日→英" | "英→日";

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

export interface TranslationAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: "selected-text" | "manual-input" | "model-settings";
}
