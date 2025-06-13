import { LlmModel } from "../types/llmModel";
import { useState } from "react";
import { Action, ActionPanel, Form } from "@raycast/api";

interface ApiKeyFormProps {
  model: LlmModel;
  registerApiKey: (apiKey: string) => void;
  cancel: () => void;
}

export function ApiKeyForm({model, registerApiKey, cancel}: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState<string>(model.apiKey || "");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="保存" onAction={() => registerApiKey(apiKey)} />
          <Action title="キャンセル" onAction={cancel} />
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