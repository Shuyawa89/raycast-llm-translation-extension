import { List, Action, ActionPanel, showToast, Toast } from "@raycast/api";

export default function Command() {
  const handleTranslate = (direction: string, text: string) => {
    showToast({
      style: Toast.Style.Success,
      title: `${direction} 翻訳開始`,
      message: `${text} を翻訳します`
    });
  };
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
