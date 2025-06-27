import {
  removeThinkTags,
  formatTokenUsage,
  detectTranslationDirection,
  createSystemPrompt,
  containsJapanese,
} from "./textProcessing";

describe("textProcessing", () => {
  describe("removeThinkTags", () => {
    it("should remove <think> tags and trim whitespace", () => {
      const input = "  <think>some thoughts</think>  translated text /nothink  ";
      const expected = "translated text";
      expect(removeThinkTags(input).replace(/\/nothink$/, "").trim()).toBe(expected);
    });
  });

  describe("formatTokenUsage", () => {
    it("should format token usage correctly", () => {
      const usage = { promptTokens: 10, completionTokens: 20, totalTokens: 30 };
      const expected = "入力: 10, 出力: 20, 合計: 30";
      expect(formatTokenUsage(usage)).toBe(expected);
    });

    it('should return "トークン情報なし" when usage is undefined', () => {
      expect(formatTokenUsage(undefined)).toBe("トークン情報なし");
    });
  });

  describe("detectTranslationDirection", () => {
    it('should detect Japanese to English translation', () => {
      const text = "こんにちは";
      expect(detectTranslationDirection(text)).toBe("日→英");
    });

    it('should detect English to Japanese translation', () => {
      const text = "Hello";
      expect(detectTranslationDirection(text)).toBe("英→日");
    });
  });

  describe("createSystemPrompt", () => {
    it('should create a Japanese to English system prompt', () => {
      const direction = "日→英";
      const prompt = createSystemPrompt(direction);
      expect(prompt).toContain("translate the given Japanese text into natural, fluent, and accurate English");
    });

    it('should create an English to Japanese system prompt', () => {
      const direction = "英→日";
      const prompt = createSystemPrompt(direction);
      expect(prompt).toContain("translate the given English text into natural, fluent, and accurate Japanese");
    });
  });

  describe("containsJapanese", () => {
    it("should return true for text containing Japanese", () => {
      const text = "これは日本語です";
      expect(containsJapanese(text)).toBe(true);
    });

    it("should return false for text not containing Japanese", () => {
      const text = "This is English";
      expect(containsJapanese(text)).toBe(false);
    });
  });
});
