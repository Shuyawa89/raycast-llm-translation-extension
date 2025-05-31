import { Action, ActionPanel, Detail } from "@raycast/api";

interface TranslationResultViewProps {
  markdown: string;
  onBack: () => void;
}

export function TranslationResultView({markdown, onBack}: TranslationResultViewProps) {
  return (
        <Detail
          markdown={markdown}
          actions={
            <ActionPanel>
              <Action title="リストに戻る" onAction={onBack} />
            </ActionPanel>
          }
        />
      );
}