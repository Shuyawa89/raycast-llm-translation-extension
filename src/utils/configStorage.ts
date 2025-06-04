import { LocalStorage } from "@raycast/api";
import { CustomModel, ModelConfig, ModelOperationResult, UserConfig } from "../types/modelConfig";
import { DEFAULT_MODEL_ID } from "./modelDefinitions";

/**
 * 設定ストレージキー定義
 */
const STORAGE_KEYS = {
  /** ユーザー設定全体 */
  USER_CONFIG: "user_config",
  /** モデル設定プレフィックス */
  MODEL_CONFIG_PREFIX: "model_",
} as const;

/**
 * Raycast LocalStorageを使用した設定永続化クラス
 * ユーザー設定、モデル設定、カスタムモデルの管理を行う
 */
export class ConfigStorage {
  /**
   * ユーザー設定全体を保存
   * @param config - 保存するユーザー設定
   * @returns 操作結果
   */
  static async saveConfig(config: UserConfig): Promise<ModelOperationResult> {
    // TODO: LocalStorage.setItemを使ってJSON形式で保存
    try {
      await LocalStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(config));
      return {success: true}
    } catch (error) {
      return {success: false, error: error instanceof Error ? error.message : String(error)};
    }
  }

  /**
   * ユーザー設定全体を読み込み
   * @returns ユーザー設定（存在しない場合はデフォルト設定）
   */
  static async loadConfig(): Promise<UserConfig> {
    // TODO: LocalStorage.getItemで設定を読み込み
    // 存在しない場合はデフォルト設定を返す
    // try-catchでエラーハンドリング
    try {
      const configJson = await LocalStorage.getItem<string>(STORAGE_KEYS.USER_CONFIG);
      if (configJson) {
        return JSON.parse(configJson) as UserConfig;
      }
    } catch (error) {
      console.error("設定読み込みエラー", error);
    }

    return {
      models: {},
      customModels: [],
      defaultModelId: DEFAULT_MODEL_ID
    };
  }

  /**
   * 特定モデルの設定を保存
   * @param modelId - モデルID
   * @param modelConfig - モデル設定
   * @returns 操作結果
   */
  static async saveModelConfig(modelId: string, modelConfig: ModelConfig): Promise<ModelOperationResult> {
    // TODO: 現在の設定を読み込んで、指定モデルの設定を更新後、全体を保存

  }

  /**
   * 特定モデルの設定を読み込み
   * @param modelId - モデルID
   * @returns モデル設定（存在しない場合は未設定状態）
   */
  static async loadModelConfig(modelId: string): Promise<ModelConfig> {
    // TODO: ユーザー設定を読み込んで、指定モデルの設定を返す
  }

  /**
   * カスタムモデルを追加
   * @param customModel - 追加するカスタムモデル
   * @returns 操作結果
   */
  static async addCustomModel(customModel: CustomModel): Promise<ModelOperationResult> {
    // TODO: 重複チェックしてからcustomModels配列に追加
  }

  /**
   * カスタムモデルを削除
   * @param modelId - 削除するモデルID
   * @returns 操作結果
   */
  static async removeCustomModel(modelId: string): Promise<ModelOperationResult> {
    // TODO: customModels配列から削除、関連設定もクリア
  }

  /**
   * デフォルトモデルを設定
   * @param modelId - デフォルトにするモデルID
   * @returns 操作結果
   */
  static async setDefaultModel(modelId: string): Promise<ModelOperationResult> {
    // TODO: defaultModelIdを更新
  }

  /**
   * 最後に使用したモデルを記録
   * @param modelId - 使用したモデルID
   * @returns 操作結果
   */
  static async updateLastUsedModel(modelId: string): Promise<ModelOperationResult> {
    // TODO: lastUsedModelIdと該当モデルのlastUsedを更新
  }

  /**
   * すべての設定をクリア（開発/デバッグ用）
   * @returns 操作結果
   */
  static async clearAllConfig(): Promise<ModelOperationResult> {
    // TODO: LocalStorage.removeItemで設定をクリア
  }
}
