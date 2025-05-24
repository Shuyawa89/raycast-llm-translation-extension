import { List, Action, ActionPanel, showToast, Toast, Detail } from "@raycast/api";
import { useState } from "react";

export default function Command() {
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTranslate = async (direction: string, text: string): Promise<void> => {
    setIsLoading(true); // ローディング開始

    showToast({
      style: Toast.Style.Animated,
      title: `${direction} 翻訳開始`,
      message: `${text} を翻訳します`
    });

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "qwen3:8b",
          system: "You are a specialized translation AI. Your task is to translate between Japanese and English:\n- If the input text is in Japanese, translate it to English\n- If the input text is in English, translate it to Japanese\n- Maintain the original tone and context as much as possible\n- For mixed-language text, leave parts in their most appropriate language rather than forcing translation\n- Do not translate code, technical identifiers, or untranslatable content - leave them as-is\n- For technical terms, consider providing English terms in parentheses when translating to Japanese for better readability\n- Respond with only the translated text, no explanations or additional comments",
          prompt: `${text} /nothink`,
          stream: false
        })
      });

      if (!response.ok) throw new Error('HTTP error! status: ${response.status}');

      const result = await response.json();

    } catch (error){
      console.log(error);
    } finally {
      console.log("hoge");
    };

    setTimeout(() => {
      const mockResult = direction === "日英" ? "Hello, nice to meet you!" : "こんにちは、初めまして！";
      setTranslationResult(`
# 翻訳完了

## 元のテキスト
${text}

## 翻訳結果
${mockResult}

## 情報
- 翻訳方向: ${direction}
- 処理時間: 2秒（模擬）
      `);

      setIsLoading(false);  // ローディング完了

      showToast({
        style: Toast.Style.Success,
        title: "翻訳完了!",
        message: "結果を確認してください。"
      });
    }, 2000);
  };

  // 結果があった場合の画面
  if(translationResult) {
    return (
      <Detail
        markdown={translationResult}
        actions={
          <ActionPanel>
            <Action
              title="リストに戻る"
              onAction={() => setTranslationResult(null)}
            />
          </ActionPanel>
        }
      />
    )
  }

  return (
    <List>
      <List.Item
        title="日本語→英語"
        subtitle="こんにちは→Hello"
        icon="🇯🇵"
        actions={
          <ActionPanel>
            <Action
              title="翻訳実行"
              onAction={() => handleTranslate("日英", "こんにちは")}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="英語→日本語"
        subtitle="Hello→こんにちは"
        icon="🇺🇸"
        actions={
          <ActionPanel>
            <Action
              title="翻訳実行"
              onAction={() => handleTranslate("英日", "Hello")}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
