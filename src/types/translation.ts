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

export interface TranslationRequest {
  model: string;
  system: string;
  prompt: string;
  stream: boolean;
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
