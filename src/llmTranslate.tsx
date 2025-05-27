import { List, Action, ActionPanel, Detail } from "@raycast/api";
import { useTranslation } from "./hooks/useTranslation";
import { getSelectedTextSafely } from "./utils/selectedTextUtils";

export default function Command() {
  const {translationResult, isLoading, handleTranslate, resetTranslation } = useTranslation();

  // 結果があった場合の画面
  if (translationResult) {
    return (
      <Detail
        markdown={translationResult}
        actions={
          <ActionPanel>
            <Action title="リストに戻る" onAction={resetTranslation} />
          </ActionPanel>
        }
      />
    );
  }

  const selectedText = getSelectedTextSafely();

  return (
    <List isLoading={isLoading}>
      <List.Item
        title="日本語→英語"
        subtitle="こんにちは→Hello"
        icon="🇯🇵"
        actions={
          <ActionPanel>
            <Action title="翻訳実行" onAction={() => handleTranslate("日英", "こんにちは、はじめまして")} />
          </ActionPanel>
        }
      />
      <List.Item
        title="英語→日本語"
        subtitle="Hello→こんにちは"
        icon="🇺🇸"
        actions={
          <ActionPanel>
            <Action title="翻訳実行" onAction={() => handleTranslate("英日", "Hello, nice to meet you")} />
          </ActionPanel>
        }
      />
      <List.Item
        title="選択テキスト翻訳"
        subtitle="自動翻訳です"
        icon="😃"
        actions={
          <ActionPanel>
            <Action title="翻訳実行" onAction={async () => {
              const text = await selectedText;
              handleTranslate("自動判定", text || "")
              }
            }/>
          </ActionPanel>
        }
      />
    </List>
  );
}
