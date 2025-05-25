import { ChatCompletionRequest, ChatCompletionResponse, ApiConfig, ChatMessage } from "../types/translation";
import { createTranslationSystemPrompt } from "../utils/textProcessig";

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: "http://localhost:11434/v1", // Ollama OpenAI互換エンドポイント
  model: "qwen3:8b", // 使用するモデル
  apiKey: "API_KEY", // オンラインLLM使用時のAPI Key
};

/**
 * 翻訳APIクライアントクラス
 * OllamaやOpenAI互換APIへのリクエストを管理する
 */
class TranslationApiClient {
  private config: ApiConfig;

  /**
   * コンストラクタ
   * @param config - API設定（省略時はデフォルト設定を使用）
   */
  constructor(config: ApiConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * チャット補完APIを呼び出し、翻訳結果を取得する
   * @param messages - チャットメッセージ配列（翻訳指示やユーザー入力など）
   * @returns ChatCompletionResponse型のAPIレスポンス
   * @throws APIエラー時は例外をスロー
   */
  async createChatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResponse> {
    const requestData: ChatCompletionRequest = {
      model: this.config.model,
      messages,
      stream: false,
      temperature: 0.1,
      max_tokens: 1000,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return (await response.json()) as ChatCompletionResponse;
  }

  /**
   * 設定を更新する
   * @param newConfig - 変更したい設定項目（部分的に指定可能）
   */
  updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = {...this.config, ...newConfig };
  }

  /**
   * 現在の設定を取得する
   * @returns 現在のApiConfigオブジェクト
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }
}