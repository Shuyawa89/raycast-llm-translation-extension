import { getSelectedText, showToast, Toast } from "@raycast/api";
import { containsJapanese, checkTextLength, getSelectedTextSafely, CHARACTER_LIMIT } from "./selectedTextUtils";

describe("selectedTextUtils", () => {
  // getSelectedTextをJestのモック関数としてキャスト
  const mockGetSelectedText = getSelectedText as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("containsJapanese", () => {
    it("日本語の文字を含む場合、trueを返す", () => {
      expect(containsJapanese("こんにちは")).toBe(true);
      expect(containsJapanese("Hello こんにちは World")).toBe(true);
    });

    it("日本語の文字を含まない場合、falseを返す", () => {
      expect(containsJapanese("Hello World")).toBe(false);
      expect(containsJapanese("12345")).toBe(false);
      expect(containsJapanese("!@#$%")).toBe(false);
    });
  });

  describe("checkTextLength", () => {
    it("テキストの長さが制限内の場合、isValid: trueを返す", () => {
      const text = "a".repeat(CHARACTER_LIMIT - 1);
      expect(checkTextLength(text).isValid).toBe(true);
    });

    it("テキストの長さが制限と全く同じ場合、isValid: trueを返す", () => {
      const text = "a".repeat(CHARACTER_LIMIT);
      expect(checkTextLength(text).isValid).toBe(true);
    });

    it("テキストの長さが制限を超える場合、isValid: falseとメッセージを返す", () => {
      const text = "a".repeat(CHARACTER_LIMIT + 1);
      const result = checkTextLength(text);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("テキストが長すぎます");
    });
  });

  describe("getSelectedTextSafely", () => {
    it("有効な場合、トリムされた選択テキストを返す", async () => {
      mockGetSelectedText.mockResolvedValue("  test text  ");
      const result = await getSelectedTextSafely();
      expect(result).toBe("test text");
      expect(showToast).not.toHaveBeenCalled();
    });

    it("選択テキストが空の場合、nullを返し、トーストを表示する", async () => {
      mockGetSelectedText.mockResolvedValue(" ");
      const result = await getSelectedTextSafely();
      expect(result).toBeNull();
      expect(showToast).toHaveBeenCalledWith({
        style: Toast.Style.Failure,
        title: "選択範囲取得エラー",
        message: "テキストが選択されていません",
      });
    });

    it("選択テキストが長すぎる場合、nullを返し、トーストを表示する", async () => {
      mockGetSelectedText.mockResolvedValue("a".repeat(CHARACTER_LIMIT + 1));
      const result = await getSelectedTextSafely();
      expect(result).toBeNull();
      expect(showToast).toHaveBeenCalledWith({
        style: Toast.Style.Failure,
        title: "文字数エラー",
        message: expect.stringContaining("テキストが長すぎます"),
      });
    });

    it("getSelectedTextがエラーをスローした場合、nullを返し、トーストを表示する", async () => {
      mockGetSelectedText.mockRejectedValue(new Error("Read error"));
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
