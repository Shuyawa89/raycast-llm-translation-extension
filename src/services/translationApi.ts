import OpenAI from "openai";
import { ChatCompletionResponse, ChatMessage } from "../types/translation";
import { ConfigStorage } from "../utils/configStorage";

/**
 * テキストを翻訳する
 * システムプロンプトとユーザー入力を組み合わせてAPIへリクエストし、翻訳結果を取得する
 *
 * @param text 翻訳対象のテキスト
 * @param systemPrompt システムプロンプト
 * @returns Promise<ChatCompletionResponse> 翻訳結果（OpenAI形式のレスポンス）
 */
export async function translateText(text: string, systemPrompt: string): Promise<ChatCompletionResponse> {
  // UserConfigからモデル設定を取得して反映する
  const userConfig = await ConfigStorage.loadUserConfig();
  const model = userConfig.models.find((m) => m.id === userConfig.defaultModelId);

  if (!model) {
    throw new Error("デフォルトのモデル設定が見つかりません。");
  }

  const openai = new OpenAI({
    baseURL: model.baseUrl,
    apiKey: model.apiKey || "ollama", // Ollamaの場合はAPIキーは不要
  });

  // システムプロンプトと翻訳対象テキストを配列にまとめておく
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: text + " /nothink",
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: model.modelName,
      messages,
      stream: false,
      temperature: 0.1,
      max_tokens: 10000,
    });

    // openai-nodeのレスポンスを既存のChatCompletionResponse型にキャストする
    return response as unknown as ChatCompletionResponse;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI APIからのエラーレスポンスを処理
      const errorMessage = `API error (${error.status}): ${error.message}\n${JSON.stringify(error.error, null, 2)}`;
      throw new Error(errorMessage);
    }
    // その他のエラー（ネットワークエラーなど）
    throw error;
  }
}
