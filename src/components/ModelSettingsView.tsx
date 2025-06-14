import { Action, ActionPanel, Alert, confirmAlert, List } from "@raycast/api";
import { useModelConfig } from "../hooks/useModelConfig";
import { LlmModel } from "../types/llmModel";
import { useState } from "react";
import { ApiKeyForm } from "./ApiKeyForm";

interface ModelSettingsViewProps {
  onBack: () => void;
}

export function ModelSettingsView({ onBack }: ModelSettingsViewProps) {
  const { models, defaultModelId, isLoading, error, addModel, removeModel, updateApiKey, resetToDefault } =
    useModelConfig();

  const [editingModel, setEditingModel] = useState<LlmModel | null>(null);

  const subTitle = (model: LlmModel): string => {
    let message = "";
    if (model.id === defaultModelId) message = "* ";
    message += model.requiresApiKey ? (model.apiKey ? "APIキー設定済み" : "APIキー未設定") : "APIキー不要";
    return message;
  };

  const handleDeleteModel = async (model: LlmModel): Promise<void> => {
    const confirmed = await confirmAlert({
      title: "モデルを削除しますか？",
      message: `「${model.name}」を削除します。この操作は取り消せません。`,
      primaryAction: {
        title: "削除",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      await removeModel(model.id);
    }
  };

  const handleSaveApiKey = async (apiKey: string): Promise<void> => {
    if (editingModel) {
      await updateApiKey(editingModel.id, apiKey);
      setEditingModel(null);
    }
  };

  const handleCancel = () => {
    setEditingModel(null);
  };

  if (editingModel) {
    return <ApiKeyForm model={editingModel} onSave={handleSaveApiKey} onCancel={handleCancel} />;
  }

  return (
    <List isLoading={isLoading}>
      {models.map((model) => (
        <List.Item
          key={model.id}
          title={model.id}
          subtitle={subTitle(model)}
          actions={
            <ActionPanel>
              <ActionPanel.Section title="ナビゲーション">
                <Action title="戻る" onAction={onBack} />
              </ActionPanel.Section>

              <ActionPanel.Section title={"モデル操作"}>
                <Action
                  title="新規モデル追加"
                  onAction={() => {
                    console.log("APIキー設定処理を実行する");
                  }}
                />
                <Action
                  title="デフォルトモデルの設定"
                  onAction={() => {
                    console.log("APIキー設定処理を実行する");
                  }}
                />
                <Action
                  title="APIキー設定"
                  onAction={() => {
                    setEditingModel(model);
                  }}
                />
                <Action
                  title="モデル削除"
                  style={Action.Style.Destructive}
                  onAction={() => {
                    handleDeleteModel(model);
                  }}
                />
              </ActionPanel.Section>

              <ActionPanel.Section title="設定">
                <Action title="設定をリセット" style={Action.Style.Destructive} onAction={resetToDefault} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
