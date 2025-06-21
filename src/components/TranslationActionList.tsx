import { Action, ActionPanel, List } from "@raycast/api";
import { TRANSLATION_ACTIONS } from "../utils/translationActions";
import { getSelectedTextSafely } from "../utils/selectedTextUtils";

interface TranslationActionListProps {
  isLoading: boolean;
  onTranslate: (text: string) => Promise<void>;
  onShowManualInput: () => void;
  onShowModelSettings: () => void;
}

export function TranslationActionList({
  isLoading,
  onTranslate,
  onShowManualInput,
  onShowModelSettings,
}: TranslationActionListProps) {
  const getActionTitle = (type: string): string => {
    switch (type) {
      case "selected-text":
        return "翻訳実行";
      case "manual-input":
        return "入力フォームを開く";
      case "model-settings":
        return "モデル設定を開く";
      default:
        return "実行";
    }
  };

  const actionHandlers: Record<string, () => Promise<void> | void> = {
    "selected-text": async () => {
      const selectedText = await getSelectedTextSafely();
      onTranslate(selectedText || "");
    },
    "manual-input": () => onShowManualInput(),
    "model-settings": () => onShowModelSettings(),
  };

  return (
    <List isLoading={isLoading}>
      {TRANSLATION_ACTIONS.map((action) => (
        <List.Item
          key={action.id}
          title={action.title}
          subtitle={action.subtitle}
          icon={action.icon}
          actions={
            <ActionPanel>
              <Action title={getActionTitle(action.type)} onAction={actionHandlers[action.type]} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
