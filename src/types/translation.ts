/**
 * Ollama APIからのレスポンス形式
 */
export interface OllamaResponse {
  /** 使用したモデル名 */
  model: string;
  /** レスポンス生成日時 */
  created_at: string;
  /** 生成されたテキスト */
  response: string;
  /** 生成完了フラグ */
  done: boolean;
  /** 次のリクエスト用のコンテキスト */
  context?: number[];
  /** 総処理時間（ナノ秒） */
  total_duration?: number;
  /** モデル読み込み時間（ナノ秒） */
  load_duration?: number;
  /** プロンプト評価トークン数 */
  prompt_eval_count?: number;
  /** プロンプト評価時間（ナノ秒） */
  prompt_eval_duration?: number;
  /** 生成トークン数 */
  eval_count?: number;
  /** 生成時間（ナノ秒） */
  eval_duration?: number;
}

/**
 * OpenAI形式のチャットメッセージ
 */
export interface ChatMessage {
  /** メッセージの送信者 */
  role: 'system' | 'user' | 'assistant';
  /** メッセージ内容 */
  content: string;
}

/**
 * OpenAI形式のチャット完了リクエスト
 */
export interface ChatCompletionRequest {
  /** 使用するモデル名 */
  model: string;
  /** 会話メッセージリスト */
  messages: ChatMessage[];
  /** ストリーミング応答フラグ */
  stream?: boolean;
  /** 応答のランダム性（0.0-2.0） */
  temperature?: number;
  /** 最大生成トークン数 */
  max_tokens?: number;
  /** 核サンプリング確率（0.0-1.0） */
  top_p?: number;
}

/**
 * OpenAI形式のチャット完了レスポンス
 */
export interface ChatCompletionResponse {
  /** レスポンスID */
  id: string;
  /** オブジェクトタイプ */
  object: string;
  /** 作成日時（Unix timestamp） */
  created: number;
  /** 使用したモデル名 */
  model: string;
  /** 生成されたメッセージ選択肢（通常は1つ） */
  choices: {
    /** 選択肢のインデックス */
    index: number;
    /** 生成されたメッセージ */
    message: {
      /** メッセージの送信者 */
      role: string;
      /** メッセージ内容 */
      content: string;
    };
    /** 完了理由 */
    finish_reason: string;
  }[];
  /** トークン使用量情報 */
  usage?: {
    /** プロンプトに使用されたトークン数 */
    prompt_tokens: number;
    /** 完了に使用されたトークン数 */
    completion_tokens: number;
    /** 合計トークン数 */
    total_tokens: number;
  };
}

/**
 * 翻訳リクエストの情報
 */
export interface TranslationRequest {
  /** 元のテキスト */
  originalText: string;
  /** 翻訳されたテキスト */
  translatedText: string;
  /** 翻訳方向 */
  direction: TranslationDirection;
  /** 使用したモデル名 */
  model: string;
  /** 処理時間 */
  processingTime?: string;
  /** トークン使用量 */
  tokenUsage?: {
    /** プロンプトトークン数 */
    promptTokens: string;
    /** 完了トークン数 */
    completionTokens: number;
    /** 合計トークン数 */
    totalTokens: number;
  };
}

/**
 * 翻訳方向の種類
 */
export type TranslationDirection = "日英" | "英日" | "自動判定";

/**
 * 翻訳結果
 */
export interface TranslationResult {
  /** 元のテキスト */
  originalText: string;
  /** 翻訳されたテキスト */
  translatedText: string;
  /** 翻訳方向 */
  direction: TranslationDirection;
  /** 使用したモデル名 */
  model: string;
  /** 処理時間 */
  processingTime?: string;
}

/**
 * 翻訳エラー情報
 */
export interface TranslationError {
  /** エラーメッセージ */
  message: string;
  /** 翻訳しようとしたテキスト */
  originalText: string;
  /** 対処方法の提案 */
  suggestions: string[];
}

/**
 * API設定情報
 */
export interface ApiConfig {
  /** APIのベースURL */
  baseUrl: string;
  /** 使用するモデル名 */
  model: string;
  /** APIキー（オプション） */
  apiKey?: string;
}

/**
 * 翻訳アクション項目
 */
export interface TranslationAction {
  /** アクションID */
  id: string;
  /** アクションのタイトル */
  title: string;
  /** アクションの説明 */
  subtitle: string;
  /** アイコン名 */
  icon: string;
  /** アクションの種類 */
  type: 'selected-text' | 'manual-input';
}
