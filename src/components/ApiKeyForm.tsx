import { LlmModel } from "../types/llmModel";
import { useState } from "react";
import { Action, ActionPanel, Form } from "@raycast/api";

interface ApiKeyFormProps {
  model: LlmModel;
  onSave: (apiKey: string) => void;
  onCancel: () => void;
}

export function ApiKeyForm({ model, onSave, onCancel }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState<string>(model.apiKey || "");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="保存" onAction={() => onSave(apiKey)} />
          <Action title="キャンセル" onAction={onCancel} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="apiKey"
        title="APIキー"
        placeholder="APIキーを入力してください。"
        value={apiKey}
        onChange={setApiKey}
        storeValue={false}
      />
    </Form>
  );
}
