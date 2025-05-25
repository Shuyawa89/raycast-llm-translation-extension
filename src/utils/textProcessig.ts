
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
