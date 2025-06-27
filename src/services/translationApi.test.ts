import { translateText } from "./translationApi";
import { ConfigStorage } from "../utils/configStorage";
import OpenAI from "openai";

// ConfigStorageのモック
jest.mock("../utils/configStorage", () => ({
  ConfigStorage: {
    loadUserConfig: jest.fn(),
  },
}));

// OpenAIのモック
const mockCreateCompletion = jest.fn();
const mockOpenAIInstance = {
  chat: {
    completions: {
      create: mockCreateCompletion,
    },
  },
};

jest.mock("openai", () => {
  const actualOpenAI = jest.requireActual("openai");
  const mockAPIError = jest.fn(function (this: any, status, error, message, headers) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.headers = headers;
  }) as unknown as typeof actualOpenAI.APIError;

  return Object.assign(jest.fn(() => mockOpenAIInstance), {
    APIError: mockAPIError,
  });
});

// Mock the global Headers object
global.Headers = jest.fn(() => ({
  get: jest.fn(),
})) as unknown as typeof Headers;

describe("translationApi", () => {
  const mockConfigStorage = ConfigStorage as jest.Mocked<typeof ConfigStorage>;
  const mockOpenAI = OpenAI as jest.Mocked<typeof OpenAI>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigStorage.loadUserConfig.mockResolvedValue({
      models: [
        {
          id: "test-model",
          name: "Test Model",
          baseUrl: "https://api.test.com",
          modelName: "test-gpt",
          requiresApiKey: true,
          apiKey: "test-api-key",
        },
      ],
      defaultModelId: "test-model",
    });
  });

  describe("translateText", () => {
    it("正しいパラメータでOpenAI APIを呼び出し、翻訳されたテキストを返す", async () => {
      const mockResponse = {
        id: "chatcmpl-123",
        object: "chat.completion",
        created: 1678888888,
        model: "test-gpt",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "Translated text",
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      };

      mockCreateCompletion.mockResolvedValue(mockResponse);

      const text = "Hello";
      const systemPrompt = "Translate to Japanese.";
      const result = await translateText(text, systemPrompt);

      expect(mockOpenAI).toHaveBeenCalledWith({
        baseURL: "https://api.test.com",
        apiKey: "test-api-key",
      });
      expect(mockCreateCompletion).toHaveBeenCalledWith({
        model: "test-gpt",
        messages: [
          { role: "system", content: "Translate to Japanese." },
          { role: "user", content: "Hello /nothink" },
        ],
        stream: false,
        temperature: 0.1,
        max_tokens: 10000,
      });
      expect(result).toEqual(mockResponse);
    });

    it("デフォルトモデルが見つからない場合、エラーをスローする", async () => {
      mockConfigStorage.loadUserConfig.mockResolvedValue({
        models: [],
        defaultModelId: "non-existent-model",
      });

      await expect(translateText("Hello", "Prompt")).rejects.toThrow("デフォルトのモデル設定が見つかりません。");
    });

    it("OpenAI APIがエラーを返した場合、エラーをスローする", async () => {
      const mockError = new mockOpenAI.APIError(
        400,
        { error: { message: "Bad Request" } },
        "Bad Request",
        { status: 400, headers: new Headers() },
      );
      mockCreateCompletion.mockRejectedValue(mockError);

      await expect(translateText("Hello", "Prompt")).rejects.toThrow(
        `API error (400): Bad Request\n{\n  "error": {\n    "message": "Bad Request"\n  }\n}`,
      );
    });

    it("API以外の一般的なエラーの場合、エラーをスローする", async () => {
      const genericError = new Error("Network error");
      mockCreateCompletion.mockRejectedValue(genericError);

      await expect(translateText("Hello", "Prompt")).rejects.toThrow("Network error");
    });
  });
});



