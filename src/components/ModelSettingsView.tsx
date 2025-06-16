import { Action, ActionPanel, Alert, confirmAlert, List } from "@raycast/api";
import { useModelConfig } from "../hooks/useModelConfig";
import { LlmModel } from "../types/llmModel";
import { useState } from "react";
import { ApiKeyForm } from "./ApiKeyForm";

interface ModelSettingsViewProps {
  onBack: () => void;
}

export function ModelSettingsView({ onBack }: ModelSettingsViewProps) {
  const {
    models,
    defaultModelId,
    isLoading,
    error,
    addModel,
    removeModel,
    updateApiKey,
    resetToDefault,
    setDefaultModel,
  } = useModelConfig();

  const [editingModel, setEditingModel] = useState<LlmModel | null>(null);
  const [selectedModel, setSelectedModel] = useState<LlmModel | null>(null);

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

  if (selectedModel) {
    return (
      <List>
        <List.Item
          title="APIキー設定"
          subtitle={selectedModel.apiKey ? "設定済み" : "未設定"}
          actions={
            <ActionPanel>
              <Action
                title="設定する"
                onAction={() => {
                  setEditingModel(selectedModel);
                  setSelectedModel(null);
                }}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="デフォルトモデルに設定"
          subtitle={selectedModel.id === defaultModelId ? "現在のデフォルト" : "デフォルトに設定"}
          actions={
            <ActionPanel>
              <Action
                title="デフォルトに設定"
                onAction={() => {
                  setDefaultModel(selectedModel.id);
                }}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="モデル削除"
          subtitle="このモデルを削除します"
          actions={
            <ActionPanel>
              <Action
                title="削除"
                style={Action.Style.Destructive}
                onAction={() => {
                  handleDeleteModel(selectedModel);
                  setSelectedModel(null);
                }}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="戻る"
          actions={
            <ActionPanel>
              <Action title="リストに戻る" onAction={() => setSelectedModel(null)} />
            </ActionPanel>
          }
        />
      </List>
    );
  }
  return (
    <List isLoading={isLoading}>
      <List.Item
        title="➕ 新規モデル追加"
        subtitle="新しいLLMモデルを追加"
        actions={
          <ActionPanel>
            <Action title="追加" onAction={() => console.log("新規モデル追加")} />
          </ActionPanel>
        }
      />
      <List.Item
        title="🔄 設定をリセット"
        subtitle="すべての設定を初期化"
        actions={
          <ActionPanel>
            <Action title="リセット" style={Action.Style.Destructive} onAction={resetToDefault} />
          </ActionPanel>
        }
      />
      <List.Item
        title="⬅️ 戻る"
        subtitle="翻訳画面に戻る"
        actions={
          <ActionPanel>
            <Action title="戻る" onAction={onBack} />
          </ActionPanel>
        }
      />
      {models.map((model) => (
        <List.Item
          key={model.id}
          title={model.id}
          subtitle={subTitle(model)}
          actions={
            <ActionPanel>
              <Action
                title="詳細・操作"
                onAction={() => {
                  console.log("詳細画面へ", model.name);
                  setSelectedModel(model);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
