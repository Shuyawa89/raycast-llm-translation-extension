import { useState } from "react";
import { showToast, Toast } from "@raycast/api";
import { translateText } from "../services/translationApi";
import {
  removeThinkTags,
  formatTokenUsage,
  generateErrorMarkdown,
  generateResultMarkdown,
  detectTranslationDirection,
  createSystemPrompt,
} from "../utils/textProcessing";

/**
 * 翻訳処理用のカスタムフック
 * LLM APIを使った翻訳処理、状態管理、エラーハンドリング、トースト表示などをまとめて行う
 *
 * @returns
 *   translationResult: 翻訳結果（Markdown形式の文字列またはエラー内容）
 *   isLoading: ローディング状態
 *   handleTranslate: 翻訳処理を実行する非同期関数
 */
export function useTranslation() {
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInputForm, setIsInputForm] = useState<boolean>(false);
  const [isModelSettings, setIsModelSettings] = useState<boolean>(false);

  /**
   * 翻訳処理を実行する
   * 指定したテキストをLLM APIで翻訳し、結果やエラーをMarkdown形式でstateに格納する
   *
   * @param text 翻訳対象のテキスト
   */
  const handleTranslate = async (text: string): Promise<void> => {
    const startTime = Date.now();

    setIsLoading(true);
    const direction = detectTranslationDirection(text);

    // 処置中の表示を更新
    showToast({
      style: Toast.Style.Animated,
      title: `${direction} 翻訳中...`,
      message: `"${text}" を処理しています`,
    });

    // LLMに流して、データを取得する
    try {
      const systemPrompt = createSystemPrompt(direction); // 翻訳方向を取得
      const result = await translateText(text, systemPrompt); //翻訳結果を取得
      const processingTime = Date.now() - startTime;

      const translatedText = result.choices[0]?.message?.content || "";
      const cleanedResponse = removeThinkTags(translatedText);
      const tokenUsage = formatTokenUsage(
        result.usage
          ? {
              promptTokens: result.usage.prompt_tokens,
              completionTokens: result.usage.completion_tokens,
              totalTokens: result.usage.total_tokens,
            }
          : undefined,
      );

      // 結果markdown作成
      const markdown = generateResultMarkdown(
        text,
        cleanedResponse,
        direction,
        result.model,
        `${processingTime}ms`,
        tokenUsage,
      );

      setTranslationResult(markdown);

      showToast({
        style: Toast.Style.Success,
        title: "翻訳完了",
        message: "結果を確認してください",
      });
    } catch (error: unknown) {
      console.error("Translation error", error);

      const errorMessage = error instanceof Error ? error.message : String(error);

      showToast({
        style: Toast.Style.Failure,
        title: "翻訳エラー",
        message: "API接続を確認してください",
      });

      const errorMarkDown = generateErrorMarkdown(errorMessage, text);
      setTranslationResult(errorMarkDown);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTranslation = (): void => {
    setTranslationResult(null);
  };

  const showManualInput = (): void => {
    setIsInputForm(true);
  };

  const hideManualInput = (): void => {
    setIsInputForm(false);
  };

  const showModelSettings = (): void => {
    setIsModelSettings(true);
  };

  const hideModelSettings = (): void => {
    setIsModelSettings(false);
  };

  return {
    translationResult,
    isLoading,
    isInputForm,
    isModelSettings,
    handleTranslate,
    resetTranslation,
    showManualInput,
    hideManualInput,
    showModelSettings,
    hideModelSettings,
  };
}
