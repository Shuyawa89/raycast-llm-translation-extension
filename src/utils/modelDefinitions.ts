import { PresetModel } from "../types/modelConfig";

export const PRESET_MODELS: PresetModel[] = [
  {
    id: "ollama-qwen3",
    name: "Qwen3 8B",
    provider: "Ollama",
    description: "Qwen3 8B",
    baseUrl: "http://localhost:11434/v1",
    modelName: "qwen3:8b",
    requiresApiKey: false,
    category: "local",
  },
  {
    id: "openai-gpt4.1-mini",
    name: "GPT4.1-mini",
    provider: "OpenAi",
    description: "バランスのいい性能、コストパフォーマンス・有料",
    baseUrl: "https://openrouter.ai/api/v1",
    modelName: "openai/gpt-4.1-mini",
    requiresApiKey: true,
    category: "cloud",
  },
  {
    id: "google-gemini-2.0-flash",
    name: "gemini-2.0-flash",
    provider: "Google",
    description: "バランスのいい性能、応答性・無料",
    baseUrl: "https://openrouter.ai/api/v1",
    modelName: "google/gemini-2.0-flash-exp:free",
    requiresApiKey: true,
    category: "cloud",
  },
];

export const DEFAULT_MODEL_ID = "ollama-qwen3";