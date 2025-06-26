import { getSelectedText, showToast, Toast } from "@raycast/api";
import { containsJapanese, checkTextLength, getSelectedTextSafely, CHARACTER_LIMIT } from "./selectedTextUtils";

describe("selectedTextUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("containsJapanese", () => {
    it("should return true if text contains Japanese characters", () => {
      expect(containsJapanese("こんにちは")).toBe(true);
      expect(containsJapanese("Hello こんにちは World")).toBe(true);
    });

    it("should return false if text does not contain Japanese characters", () => {
      expect(containsJapanese("Hello World")).toBe(false);
      expect(containsJapanese("12345")).toBe(false);
      expect(containsJapanese("!@#$%")).toBe(false);
    });
  });

  describe("checkTextLength", () => {
    it("should return isValid: true if text length is within limit", () => {
      const text = "a".repeat(CHARACTER_LIMIT - 1);
      expect(checkTextLength(text).isValid).toBe(true);
    });

    it("should return isValid: true if text length is exactly the limit", () => {
      const text = "a".repeat(CHARACTER_LIMIT);
      expect(checkTextLength(text).isValid).toBe(true);
    });

    it("should return isValid: false and message if text length exceeds limit", () => {
      const text = "a".repeat(CHARACTER_LIMIT + 1);
      const result = checkTextLength(text);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("テキストが長すぎます");
    });
  });

  describe("getSelectedTextSafely", () => {
    it("should return trimmed selected text if valid", async () => {
      getSelectedText.mockResolvedValue("  test text  ");
      const result = await getSelectedTextSafely();
      expect(result).toBe("test text");
      expect(showToast).not.toHaveBeenCalled();
    });

    it("should return null and show toast if selected text is empty", async () => {
      getSelectedText.mockResolvedValue(" ");
      const result = await getSelectedTextSafely();
      expect(result).toBeNull();
      expect(showToast).toHaveBeenCalledWith({
        style: Toast.Style.Failure,
        title: "選択範囲取得エラー",
        message: "テキストが選択されていません",
      });
    });

    it("should return null and show toast if selected text is too long", async () => {
      getSelectedText.mockResolvedValue("a".repeat(CHARACTER_LIMIT + 1));
      const result = await getSelectedTextSafely();
      expect(result).toBeNull();
      expect(showToast).toHaveBeenCalledWith({
        style: Toast.Style.Failure,
        title: "文字数エラー",
        message: expect.stringContaining("テキストが長すぎます"),
      });
    });

    it("should return null and show toast if getSelectedText throws an error", async () => {
      getSelectedText.mockRejectedValue(new Error("Read error"));
      const result = await getSelectedTextSafely();
      expect(result).toBeNull();
      expect(showToast).toHaveBeenCalledWith({
        style: Toast.Style.Failure,
        title: "選択エラー",
        message: "選択テキストの読み込みに失敗しました。",
      });
    });
  });
});
