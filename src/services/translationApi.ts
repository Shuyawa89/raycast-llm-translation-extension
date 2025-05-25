import { ChatCompletionRequest, ChatCompletionResponse, ApiConfig, ChatMessage } from "../types/translation";
import { createTranslationSystemPrompt } from "../utils/textProcessig";

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: "http://localhost:11434/v1", // Ollama OpenAI互換エンドポイント
  model: "qwen3:8b", // 使用するモデル
  apiKey: "API_KEY", // オンラインLLM使用時のAPI Key
};

class TranslationApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

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

  updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = {...this.config, ...newConfig };
  }

  getConfig(): ApiConfig {
    return { ...this.config };
  }
}
