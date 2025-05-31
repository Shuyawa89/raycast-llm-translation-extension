import { Action, ActionPanel, List } from "@raycast/api";
import { TRANSLATION_ACTIONS } from "../utils/translationActions";
import { getSelectedTextSafely } from "../utils/selectedTextUtils";
import { TranslationDirection } from "../types/translation";

interface TranslationActionListProps {
  isLoading: boolean;
  onTranslate: (direction: TranslationDirection, text: string) => Promise<void>;
  onShowManualInput: () => void;
}

export function TranslationActionList({isLoading, onTranslate, onShowManualInput}: TranslationActionListProps) {
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
                <Action
                  title="翻訳実行"
                  onAction={async () => {
                    if (action.type === "selected-text") {
                      const selectedText = getSelectedTextSafely();
                      const text = await selectedText;
                      onTranslate("自動判定", text || "");
                    } else if (action.type === "manual-text") {
                      onShowManualInput(); // 入力フォームを表示
                    }
                  }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List>
    );
}