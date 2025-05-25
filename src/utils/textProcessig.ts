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
