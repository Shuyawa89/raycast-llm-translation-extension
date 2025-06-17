import { LlmModel } from "../types/llmModel";

/**
 * プリセットモデル定義
 * 初期起動時にUserConfigに追加する
 */
export const DEFAULT_MODELS: LlmModel[] = [
  {
    id: "ollama-qwen3",
    name: "Qwen3 8B",
    baseUrl: "http://localhost:11434/v1",
    modelName: "qwen3:8b",
    requiresApiKey: false,
    description: "ローカル実行可能なモデル",
  },
  {
    id: "openai-gpt4.1-mini",
    name: "GPT-4.1-mini",
    baseUrl: "https://openrouter.ai/api/v1",
    modelName: "openai/gpt-4.1-mini",
    requiresApiKey: true,
    description: "高性能モデル（要APIキー）",
  },
  {
    id: "google-gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    baseUrl: "https://openrouter.ai/api/v1",
    modelName: "google/gemini-2.0-flash-exp:free",
    requiresApiKey: true,
    description: "高速応答モデル（要APIキー）",
  },
];

/**
 * デフォルトモデルID
 */
export const DEFAULT_MODEL_ID = "ollama-qwen3";
