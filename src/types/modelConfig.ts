/**
 * プリセットモデルの基本型
 */
export interface PresetModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  baseUrl: string;
  modelName: string;
  requiresApiKey: boolean;
  category: "local" | "cloud";
}

/**
 * ユーザの追加したモデルの型
 */
export interface CustomModel extends PresetModel {
  isCustom: true;
  createdAt: string;
}

/**
 * モデルの設定情報
 */
export interface ModelConfig {
  modelId: string;
  apiKey?: string;
  isConfigured: boolean;  // 設定完了しているか
  lastUsed?: string;  // 最後に使用した日時
}

/**
 * ユーザの全体設定
 */
export interface UserConfig {
  models: Record<string, ModelConfig>;
  customModels: CustomModel[];
  defaultModelId?: string;
  lastUsedModelId?: string;
}

/**
 * カスタムモデル作成時の入力データ
 */
export interface CustomModelInput {
  name: string;
  baseUrl: string;
  modelName: string;
  apiKey?: string;
  description?: string;
}

/**
 * モデル操作の結果
 */
export type ModelOperationResult = {
  success: true;
  data?: unknown;
} | {
  success: false;
  error: string;
}