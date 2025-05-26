import { List, Action, ActionPanel, Detail } from "@raycast/api";
import { useTranslation } from "./hooks/useTranslation";

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
    </List>
  );
}
