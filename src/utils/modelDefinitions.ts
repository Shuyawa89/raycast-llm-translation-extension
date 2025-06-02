import { PresetModel } from "../types/modelConfig";

export const PRESET_MODELS: PresetModel[] = [
  {
    id: "ollama-qwen3",
    name: "Qwen3 8B",
    provider: "Ollama",
    description: "Qwen3 8B",
    modelName: "qwen3:8b",
    requiresApiKey: false,
    category: "local",
  },
  {
    id: "openai-gpt4.1-mini",
    name: "GPT4.1-mini",
    provider: "OpenAI",
    description: "バランスのいい性能、コストパフォーマンス・有料",
    modelName: "gpt-4.1-mini-2025-04-14",
    requiresApiKey: true,
    category: "cloud",
  },
  {
    id: "google-gemini-2.0-flash",
    name: "gemini-2.0-flash",
    provider: "OpenRouter",
    description: "バランスのいい性能、応答性・無料",
    modelName: "google/gemini-2.0-flash-exp:free",
    requiresApiKey: true,
    category: "cloud",
  },
];