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
      const isModelIdExists = (modelId: string) => {
        return currentUserConfig.models.some((existingModel) => existingModel.id === modelId);
      };

      if (isModelIdExists(model.id)) {
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
}
