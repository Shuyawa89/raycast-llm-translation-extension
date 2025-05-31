import { Action, ActionPanel, Form } from "@raycast/api";
import { useState } from "react";

interface ManualInputFormProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export function ManualInputForm({ onSubmit, onCancel }: ManualInputFormProps) {
  const [inputText, setInputText] = useState<string>("");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action
            title="翻訳実行"
            onAction={() => {
              if (inputText.trim()) {
                onSubmit(inputText.trim());
              }
            }}
          />
          <Action title="キャンセル" onAction={onCancel} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="translation-text"
        title="翻訳したいテキスト"
        placeholder="ここに翻訳したいテキストを入力してください..."
        value={inputText}
        onChange={setInputText}
      />
    </Form>
  );
}
