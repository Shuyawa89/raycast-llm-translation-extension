import { List, Action, ActionPanel, Detail } from "@raycast/api";
import { useTranslation } from "./hooks/useTranslation";
import { getSelectedTextSafely } from "./utils/selectedTextUtils";
import { TRANSLATION_ACTIONS } from "./utils/translationActions";
import { ManualInputForm } from "./components/ManualInputForm";

export default function Command() {
  const {
    translationResult,
    isLoading,
    isInputForm,
    handleTranslate,
    resetTranslation,
    showManualInput,
    hideManualInput,
  } = useTranslation();

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

  if (isInputForm) {
    return (
      <ManualInputForm
        onSubmit={(text: string) => {
          handleTranslate("自動判定", text); //翻訳実行
          hideManualInput();
        }}
        onCancel={() => {
          hideManualInput();
        }}
      />
    );
  }
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
                    handleTranslate("自動判定", text || "");
                  } else if (action.type === "manual-text") {
                    showManualInput(); // 入力フォームを表示
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
