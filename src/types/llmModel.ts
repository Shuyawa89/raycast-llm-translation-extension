/**
 * LLM Modelの情報を表す型
 * @property id モデルの一意なID
 * @property name モデル名
 * @property baseUrl モデルのエンドポイントURL
 * @property modelName モデルの識別名
 * @property requiresApiKey APIキーが必要かどうか
 * @property apiKey モデル用APIキー（任意）
 * @property description モデルの説明（任意）
 */
export interface LlmModel {
  id: string;
  name: string;
  baseUrl: string;
  modelName: string;
  requiresApiKey: boolean;
  apiKey?: string;
  description?: string;
}

/**
 * ユーザー設定情報
 * @property models 利用可能なLLMモデルの配列
 * @property defaultModelId デフォルトで使用するモデルID
 */
export interface UserConfig{
  models: LlmModel[];
  defaultModelId: string;
}

/**
 * 操作結果を表す型
 * @property success 操作が成功したかどうか
 * @property error 失敗時のエラーメッセージ
 */
export type OperationResult = {
  success: true;
} | {
  success: false;
  error: string;
};

