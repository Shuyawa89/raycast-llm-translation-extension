/**
 * プリセットモデルの基本型
 * @property id モデルの一意なID
 * @property name モデル名
 * @property provider モデルの提供元
 * @property description モデルの説明
 * @property baseUrl モデルのエンドポイントURL
 * @property modelName モデルの識別名
 * @property requiresApiKey APIキーが必要かどうか
 * @property category モデルのカテゴリ（local または cloud）
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
 * ユーザが追加したカスタムモデルの型
 * @property isCustom カスタムモデルであることを示すフラグ（常にtrue）
 * @property createdAt 作成日時（ISO8601形式）
 */
export interface CustomModel extends PresetModel {
  isCustom: true;
  createdAt: string;
}

/**
 * モデルの設定情報
 * @property modelId モデルID
 * @property apiKey モデル用APIキー（任意）
 * @property isConfigured 設定が完了しているかどうか
 * @property lastUsed 最後に使用した日時（ISO8601形式、任意）
 */
export interface ModelConfig {
  modelId: string;
  apiKey?: string;
  isConfigured: boolean;  // 設定完了しているか
  lastUsed?: string;  // 最後に使用した日時
}

/**
 * ユーザの全体設定
 * @property models モデルIDをキーとしたモデル設定情報のマップ
 * @property customModels ユーザが追加したカスタムモデルの配列
 * @property defaultModelId デフォルトで使用するモデルID（任意）
 * @property lastUsedModelId 最後に使用したモデルID（任意）
 */
export interface UserConfig {
  models: Record<string, ModelConfig>;
  customModels: CustomModel[];
  defaultModelId?: string;
  lastUsedModelId?: string;
}

/**
 * カスタムモデル作成時の入力データ
 * @property name モデル名
 * @property baseUrl モデルのエンドポイントURL
 * @property modelName モデルの識別名
 * @property apiKey APIキー（任意）
 * @property description モデルの説明（任意）
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
 * @property success 操作が成功したかどうか
 * @property data 成功時の追加データ（任意）
 * @property error 失敗時のエラーメッセージ
 */
export type ModelOperationResult = {
  success: true;
  data?: unknown;
} | {
  success: false;
  error: string;
}

