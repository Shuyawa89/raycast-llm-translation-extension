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
