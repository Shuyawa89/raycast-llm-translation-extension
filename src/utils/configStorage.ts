import { LlmModel, OperationResult, UserConfig } from "../types/llmModel";
import { LocalStorage } from "@raycast/api";
import { DEFAULT_MODEL_ID, DEFAULT_MODELS } from "./llmModelDefinitions";

const USER_CONFIG_KEY = "userConfigKey";
export class ConfigStorage {
  private static getDefaultUserConfig(): UserConfig {
    return {
      models: DEFAULT_MODELS,
      defaultModelId: DEFAULT_MODEL_ID,
    };
  }

  private static modelExists(models: LlmModel[], modelId: string): boolean {
    return models.some((model) => model.id === modelId);
  }

  static async loadUserConfig(): Promise<UserConfig> {
    try {
      const userData = await LocalStorage.getItem<string>(USER_CONFIG_KEY);
      if (!userData) {
        return this.getDefaultUserConfig();
      }
      const userConfig = JSON.parse(userData) as UserConfig;
      return userConfig;
    } catch (error) {
      console.error("ユーザ設定読み込みエラー", error);
    }
    return this.getDefaultUserConfig();
  }

  static async saveUserConfig(config: UserConfig): Promise<OperationResult> {
    try {
      await LocalStorage.setItem(USER_CONFIG_KEY, JSON.stringify(config));
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  static async addModel(model: LlmModel): Promise<OperationResult> {
    try {
      const currentUserConfig = await this.loadUserConfig();

      if (this.modelExists(currentUserConfig.models, model.id)) {
        throw new Error("指定されたモデルIDを持つモデルはすでに存在しています。");
      }

      currentUserConfig.models = [...currentUserConfig.models, model];
      await this.saveUserConfig(currentUserConfig);

      return { success: true };
    } catch (error) {
      console.error("モデル追加エラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  static async removeModel(modelId: string): Promise<OperationResult> {
    try {
      const currentUserConfig = await this.loadUserConfig();
      if (!this.modelExists(currentUserConfig.models, modelId)) {
        // 指定したidが存在しない場合
        throw new Error("指定されたモデルIDを持つモデルは存在しません");
      }

      const newModels = currentUserConfig.models.filter((existingModel: LlmModel) => {
        return existingModel.id !== modelId;
      });

      if (newModels.length === 0) {
        throw new Error("全てのモデルを削除することはできません");
      }

      if (modelId === currentUserConfig.defaultModelId) {
        // デフォルトモデルが削除対象の場合の処理
        const newDefault = newModels.find((model) => !model.requiresApiKey) || newModels[0];
        currentUserConfig.defaultModelId = newDefault.id;
      }
      currentUserConfig.models = newModels;
      await this.saveUserConfig(currentUserConfig);

      return {
        success: true,
      };
    } catch (error) {
      console.error("モデル削除エラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  static async updateModelApiKey(modelId: string, apiKey: string): Promise<OperationResult> {
    try {
      const currentUserConfig = await this.loadUserConfig();

      if (!this.modelExists(currentUserConfig.models, modelId)) {
        throw new Error("指定されたモデルIDを持つモデルは存在しません");
      }

      currentUserConfig.models = currentUserConfig.models.map((model) => {
        if (model.id === modelId) {
          return { ...model, apiKey: apiKey };
        }
        return model;
      });

      await this.saveUserConfig(currentUserConfig);

      return { success: true };
    } catch (error) {
      console.error("ApiKey更新エラー:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
