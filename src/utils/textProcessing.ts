import { TranslationDirection } from "../types/translation";

/**
 * 入力テキストから<think>...</think>タグとその内容を全て除去する
 * 結果文字列の先頭と末尾の空白文字を削除する
 * openai形式では不必要だが、互換性のために残しておく
 *
 * @param text - <think>タグを含む可能性のある入力文字列
 * @returns <think>タグが除去され、空白文字がトリムされた処理済み文字列
 */
export function removeThinkTags(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, "") // <think>...</think>を除去
    .trim() // 前後の空白を除去
    .replace(/\/nothink$/, ""); // 文末の"/nothink"タグを削除(thinkingモデル以外用)
}

/**
 * ナノ秒単位の処理時間を人間が読みやすいミリ秒形式にフォーマットする
 *
 * @param nanoseconds - ナノ秒単位の処理時間（オプショナル）
 * @returns フォーマットされた処理時間文字列（例: "123ms"）。入力が未定義の場合は "不明" を返す
 */
export function formatProcessingTime(nanoseconds?: number): string {
  if (!nanoseconds) return "不明";
  return Math.round(nanoseconds / 1000000) + "ms";
}

/**
 * トークン使用量情報を読みやすい日本語文字列にフォーマットする
 *
 * @param usage - トークン使用量統計を含むオプショナルなオブジェクト
 * @param usage.promptTokens - プロンプト/入力で使用されたトークン数
 * @param usage.completionTokens - 完了/出力で使用されたトークン数
 * @param usage.totalTokens - 使用されたトークンの総数
 * @returns トークン使用量を表示するフォーマットされた日本語文字列、usageが未定義の場合は "トークン情報なし" を返す
 */
export function formatTokenUsage(usage?: {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}): string {
  if (!usage) return "トークン情報なし";
  return `入力: ${usage.promptTokens}, 出力: ${usage.completionTokens}, 合計: ${usage.totalTokens}`;
}

/**
 * 翻訳結果をMarkdown形式で生成する
 *
 * @param originalText - 翻訳前の元のテキスト
 * @param translatedText - 翻訳後のテキスト
 * @param direction - 翻訳方向（例：en-ja, ja-en など）
 * @param model - 使用した翻訳モデル名
 * @param processingTime - 翻訳処理にかかった時間
 * @param tokenUsage - トークンの使用量（オプショナル）
 * @returns 翻訳結果の情報を含むMarkdown形式の文字列
 */
export function generateResultMarkdown(
  originalText: string,
  translatedText: string,
  direction: TranslationDirection,
  model: string,
  processingTime: string,
  tokenUsage?: string,
): string {
  return `
# 翻訳完了

## 翻訳結果
${translatedText}

## 元のテキスト
${originalText}

## 情報
- 翻訳方向: ${direction}
- 使用モデル: ${model}
- 処理時間: ${processingTime || "不明"}
- トークン使用量: ${tokenUsage || "不明"}
        `;
}

/**
 * 翻訳エラーが発生した際のマークダウン形式のエラーメッセージを生成する
 *
 * @param errorMessage - 発生したエラーの詳細メッセージ
 * @param originalText - 翻訳しようとした元のテキスト
 * @returns エラー情報、対処方法、元のテキストを含むフォーマットされたマークダウン文字列
 */
export function generateErrorMarkdown(errorMessage: string, originalText: string): string {
  return `
# 翻訳エラー

## エラー内容
${errorMessage}

1. **Ollama使用時**:
  - Ollamaが起動しているか確認: \`ollama serve\`
  - Qwen3:8bモデルがインストール済みか確認
2. **OpenAI API使用時**:
  - APIキーが正しく設定されているか確認
  - 使用量制限に達していないか確認
3. **共通**:
  - ネットワーク接続を確認

## 元のテキスト
${originalText}
      `;
}

/**
 * 英語から日本語にするシステムプロンプト
 */
export function createEnToJaSystemPrompt(): string {
  return `You are a specialized translation AI. Your task is to translate the given English text into natural, fluent, and accurate Japanese.

- Always translate from English to Japanese.
- Maintain the original tone and context as much as possible.
- Do not translate code, technical identifiers, or untranslatable content—leave them as-is.
- For technical terms, consider providing the English term in parentheses for clarity.
- Respond with only the translated Japanese text, no explanations or additional comments.`;
}

/**
 * 日本語から英語にするシステムプロンプト
 */
export function createJaToEnSystemPrompt(): string {
  return `You are a specialized translation AI. Your task is to translate the given Japanese text into natural, fluent, and accurate English.

- Always translate from Japanese to English.
- Maintain the original tone and context as much as possible.
- Do not translate code, technical identifiers, or untranslatable content—leave them as-is.
- For technical terms, consider providing the Japanese term in parentheses for clarity.
- Respond with only the translated English text, no explanations or additional comments.`;
}

/**
 * テキストが日本語を含むか判定する
 * @param text 判定対象のテキスト
 * @returns 日本語を含む場合true
 */
export function containsJapanese(text: string): boolean {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9faf\uff66-\uff9f]/.test(text);
}

/**
 * テキストが日本語を含むか判定し、翻訳方向を自動判定する
 * @param text 判定対象のテキスト
 * @returns TranslationDirection ("日→英" or "英→日")
 */
export function detectTranslationDirection(text: string): TranslationDirection {
  return containsJapanese(text) ? "日→英" : "英→日";
}

export function createSystemPrompt(direction: TranslationDirection): string {
  return direction === "日→英" ? createJaToEnSystemPrompt() : createEnToJaSystemPrompt();
}
