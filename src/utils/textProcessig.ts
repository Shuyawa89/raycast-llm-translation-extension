/**
 * 入力テキストから<think>...</think>タグとその内容を全て除去する
 * 結果文字列の先頭と末尾の空白文字を削除する
 *
 * @param text - <think>タグを含む可能性のある入力文字列
 * @returns <think>タグが除去され、空白文字がトリムされた処理済み文字列
 */
export function removeThinkTags(text: string): string {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '')  // <think>...</think>を除去
    .trim();  // 前後の空白を除去
}

/**
 * ナノ秒単位の処理時間を人間が読みやすいミリ秒形式にフォーマットする
 *
 * @param nanoseconds - ナノ秒単位の処理時間（オプショナル）
 * @returns フォーマットされた処理時間文字列（例: "123ms"）。入力が未定義の場合は "不明" を返す
 */
export function formatProcessingTime(nanoseconds?: number): string {
    if (!nanoseconds) return '不明';
    return Math.round(nanoseconds / 1000000) + 'ms';
}



/**
 * 翻訳結果とメタデータを含むマークダウン形式の文字列を生成する
 *
 * @param originalText - 翻訳される元のテキスト
 * @param translatedText - 翻訳結果のテキスト
 * @param direction - 翻訳方向（例: "英語から日本語"）
 * @param model - 使用された翻訳モデルの名前または識別子
 * @param processingTime - 翻訳処理にかかった時間
 * @returns 翻訳結果とメタデータを含むフォーマットされたマークダウン文字列
 */
export function generateResultMarkdown(
    originalText: string,
    translatedText: string,
    direction: string,
    model: string,
    processingTime: string
): string{
    return (
        `
# 翻訳完了

## 元のテキスト
${originalText}

## 翻訳結果
${translatedText}

## 情報
- 翻訳方向: ${direction}
- 使用モデル: ${model}
- 処理時間: ${processingTime}
        `
    )
}

/**l
 * 翻訳エラーが発生した際のマークダウン形式のエラーメッセージを生成する
 *
 * @param errorMessage - 発生したエラーの詳細メッセージ
 * @param originalText - 翻訳しようとした元のテキスト
 * @returns エラー情報、対処方法、元のテキストを含むフォーマットされたマークダウン文字列
 */
export function generateErrorMarkdown(
    errorMessage: string,
    originalText: string
): string {
    return (
        `
# 翻訳エラー

## エラー内容
${errorMessage}

## 対処方法
1. Ollamaが起動しているか確認: \`ollama serve\`
2. Qwen3:8bモデルがインストールされているか確認
3. ネットワーク接続を確認

## 元のテキスト
${originalText}
      `
    )
}