import { getSelectedText, showToast, Toast } from "@raycast/api";

export const CHARACTER_LIMIT = 5000;

/**
 * 選択されたテキストが日本語を含むかどうかをチェックする
 * @param text 選択されたテキスト
 * @returns 日本語を含む場合はtrue、それ以外はfalse
 */
export function containsJapanese(text: string): boolean {
  const japaneseRegex = /[\u3040-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/;
  return japaneseRegex.test(text);
}

/**
 * テキストの文字数制限をチェックする
 * @param text 選択されたテキスト
 * @returns 文字数が制限内であればtrue、超えている場合はfalse。超えている場合はエラーメッセージも載せる
 */
export function checkTextLength(text: string): {isValid: boolean, message?: string} {
  if( text.length > CHARACTER_LIMIT){
    return {
      isValid: false,
      message: `テキストが長すぎます。 ${text.length}文字 > ${CHARACTER_LIMIT}文字制限`
    }
  }

  return {isValid: true};
}

export async function getSelectedTextSafely(): Promise<string | null> {
  try {
    const text = await getSelectedText();

    if(!text || text.trim().length === 0){
      showToast({
        style: Toast.Style.Failure,
        title: "選択範囲取得エラー",
        message: "テキストが選択されていません"
      });
      return null;
    }

    const lengthCheck = checkTextLength(text);
    if(!lengthCheck.isValid) {
      showToast({
        style: Toast.Style.Failure,
        title: "文字数エラー",
        message: lengthCheck.message
      });
      return null;
    }
    return text.trim();

  } catch (error) {
    console.error('Selected text read error', error);
    showToast({
      style: Toast.Style.Failure,
      title: "選択エラー",
      message: "選択テキストの読み込みに失敗しました。"
    });
    return null
  }
}