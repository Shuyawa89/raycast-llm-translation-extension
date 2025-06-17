import { Form, ActionPanel, Action } from "@raycast/api";
import { useState } from "react";
import { LlmModel } from "../types/llmModel";

interface AddModelFormProps {
  onSave: (model: LlmModel) => void;
  onCancel: () => void;
}

export function AddModelForm({ onSave, onCancel }: AddModelFormProps) {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");
  const [requiresApiKey, setRequiresApiKey] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const isValid = (value: string): boolean => {
    return value.trim().length > 0;
  };

  const isFormValid = (): boolean => {
    const requireParams = [id, name, baseUrl, modelName];
    return requireParams.every(isValid);
  };

  const getFieldError = (value: string, fieldName: string): string | undefined => {
    if (!isValid(value)) {
      return `${fieldName}は必須項目です`;
    }
    return undefined;
  };

  const handleSave = (): void => {
    if (isFormValid()) {
      const newModel: LlmModel = {
        id: id,
        name: name,
        baseUrl: baseUrl,
        modelName: modelName,
        requiresApiKey: requiresApiKey,
        apiKey: isValid(apiKey) ? apiKey.trim() : undefined,
        description: isValid(description) ? description.trim() : undefined,
      };
      onSave(newModel);
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="保存" onAction={handleSave} />
          <Action title="キャンセル" onAction={onCancel} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="id"
        title="モデルID *"
        placeholder="例: my-gpt4"
        value={id}
        onChange={setId}
        error={getFieldError(id, "モデルID")}
      />

      <Form.TextField
        id="name"
        title="モデル名 *"
        placeholder="例: OpenAIGPT-4"
        value={name}
        onChange={setName}
        error={getFieldError(name, "モデル名")}
      />

      <Form.TextField
        id="baseUrl"
        title="ベースURL *"
        placeholder="例: https://api.openai.com/v1"
        value={baseUrl}
        onChange={setBaseUrl}
        error={getFieldError(baseUrl, "ベースURL")}
      />

      <Form.TextField
        id="modelName"
        title="モデル識別名 *"
        placeholder="例: gpt-4"
        value={modelName}
        onChange={setModelName}
        error={getFieldError(modelName, "モデル識別名")}
      />

      <Form.Checkbox id="requiresApiKey" label="APIキーが必要" value={requiresApiKey} onChange={setRequiresApiKey} />

      {requiresApiKey && (
        <Form.TextField
          id="apiKey"
          title="APIキー（任意）"
          placeholder="APIキーを入力"
          value={apiKey}
          onChange={setApiKey}
          storeValue={false}
        />
      )}

      <Form.TextArea
        id="description"
        title="説明（任意）"
        placeholder="モデルの説明を入力"
        value={description}
        onChange={setDescription}
      />
    </Form>
  );
}
