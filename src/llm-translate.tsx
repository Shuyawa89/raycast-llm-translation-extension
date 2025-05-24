import { List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item
        title="日本語→英語"
        subtitle="こんにちは→Hello"
        icon="🇯🇵"
      />
      <List.Item 
        title="英語→日本語"
        subtitle="Hello→こんにちは"
        icon="🇺🇸"
      />
    </List>
  );
}
