import { LocalStorage } from "@raycast/api";
import { ConfigStorage } from "./configStorage";
import { DEFAULT_MODEL_ID, DEFAULT_MODELS } from "./llmModelDefinitions";

describe("ConfigStorage", () => {
  beforeEach(() => {
    // LocalStorageのモックをリセット
    LocalStorage.getItem.mockClear();
    LocalStorage.setItem.mockClear();
    LocalStorage.removeItem.mockClear();
    LocalStorage.clear.mockClear();
  });

  describe("loadUserConfig", () => {
    it("ユーザーデータが保存されていない場合、デフォルト設定を返す", async () => {
      LocalStorage.getItem.mockResolvedValue(null);
      const config = await ConfigStorage.loadUserConfig();
      expect(config).toEqual({
        models: DEFAULT_MODELS,
        defaultModelId: DEFAULT_MODEL_ID,
      });
      expect(LocalStorage.getItem).toHaveBeenCalledWith("userConfigKey");
    });

    it("データが存在する場合、保存されたユーザー設定を返す", async () => {
      const storedConfig = {
        models: [{ id: "test", name: "Test Model", baseUrl: "url", modelName: "model", requiresApiKey: false }],
        defaultModelId: "test",
      };
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(storedConfig));
      const config = await ConfigStorage.loadUserConfig();
      expect(config).toEqual(storedConfig);
    });

    it("保存されたデータが無効なJSONの場合、デフォルト設定を返す", async () => {
      LocalStorage.getItem.mockResolvedValue("invalid json");
      const config = await ConfigStorage.loadUserConfig();
      expect(config).toEqual({
        models: DEFAULT_MODELS,
        defaultModelId: DEFAULT_MODEL_ID,
      });
    });
  });

  describe("saveUserConfig", () => {
    it("提供された設定を保存する", async () => {
      const configToSave = {
        models: [{ id: "new", name: "New Model", baseUrl: "url", modelName: "model", requiresApiKey: true }],
        defaultModelId: "new",
      };
      const result = await ConfigStorage.saveUserConfig(configToSave);
      expect(result.success).toBe(true);
      expect(LocalStorage.setItem).toHaveBeenCalledWith("userConfigKey", JSON.stringify(configToSave));
    });

    it("保存に失敗した場合、エラーを返す", async () => {
      LocalStorage.setItem.mockRejectedValue(new Error("Save error"));
      const configToSave = {
        models: [{ id: "new", name: "New Model", baseUrl: "url", modelName: "model", requiresApiKey: true }],
        defaultModelId: "new",
      };
      const result = await ConfigStorage.saveUserConfig(configToSave);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Save error");
    });
  });

  describe("addModel", () => {
    it("新しいモデルを追加する", async () => {
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(ConfigStorage["getDefaultUserConfig"]()));
      const newModel = { id: "new", name: "New Model", baseUrl: "url", modelName: "model", requiresApiKey: false };
      const result = await ConfigStorage.addModel(newModel);
      expect(result.success).toBe(true);
      expect(LocalStorage.setItem).toHaveBeenCalled();
      const savedConfig = JSON.parse(LocalStorage.setItem.mock.calls[0][1]);
      expect(savedConfig.models).toContainEqual(newModel);
    });

    it("モデルIDがすでに存在する場合、エラーを返す", async () => {
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(ConfigStorage["getDefaultUserConfig"]()));
      const existingModel = DEFAULT_MODELS[0];
      const result = await ConfigStorage.addModel(existingModel);
      expect(result.success).toBe(false);
      expect(result.error).toContain("すでに存在しています");
    });
  });

  describe("removeModel", () => {
    it("既存のモデルを削除する", async () => {
      const initialConfig = {
        models: [
          ...DEFAULT_MODELS,
          { id: "toRemove", name: "Remove Me", baseUrl: "url", modelName: "model", requiresApiKey: false },
        ],
        defaultModelId: DEFAULT_MODEL_ID,
      };
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(initialConfig));
      const result = await ConfigStorage.removeModel("toRemove");
      expect(result.success).toBe(true);
      const savedConfig = JSON.parse(LocalStorage.setItem.mock.calls[0][1]);
      expect(savedConfig.models).not.toContainEqual(expect.objectContaining({ id: "toRemove" }));
    });

    it("削除されたモデルがデフォルトだった場合、デフォルトモデルを変更する", async () => {
      const initialConfig = {
        models: [
          { id: "default", name: "Default", baseUrl: "url", modelName: "model", requiresApiKey: false },
          { id: "other", name: "Other", baseUrl: "url", modelName: "model", requiresApiKey: false },
        ],
        defaultModelId: "default",
      };
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(initialConfig));
      const result = await ConfigStorage.removeModel("default");
      expect(result.success).toBe(true);
      const savedConfig = JSON.parse(LocalStorage.setItem.mock.calls[0][1]);
      expect(savedConfig.defaultModelId).toBe("other");
    });

    it("モデルIDが存在しない場合、エラーを返す", async () => {
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(ConfigStorage["getDefaultUserConfig"]()));
      const result = await ConfigStorage.removeModel("nonExistent");
      expect(result.success).toBe(false);
      expect(result.error).toContain("存在しません");
    });

    it("全てのモデルを削除しようとした場合、エラーを返す", async () => {
      const singleModelConfig = {
        models: [{ id: "single", name: "Single", baseUrl: "url", modelName: "model", requiresApiKey: false }],
        defaultModelId: "single",
      };
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(singleModelConfig));
      const result = await ConfigStorage.removeModel("single");
      expect(result.success).toBe(false);
      expect(result.error).toContain("全てのモデルを削除することはできません");
    });
  });

  describe("updateModelApiKey", () => {
    it("既存のモデルのAPIキーを更新する", async () => {
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(ConfigStorage["getDefaultUserConfig"]()));
      const modelId = DEFAULT_MODEL_ID;
      const newApiKey = "new-api-key";
      const result = await ConfigStorage.updateModelApiKey(modelId, newApiKey);
      expect(result.success).toBe(true);
      const savedConfig = JSON.parse(LocalStorage.setItem.mock.calls[0][1]);
      const updatedModel = savedConfig.models.find((m) => m.id === modelId);
      expect(updatedModel.apiKey).toBe(newApiKey);
    });

    it("モデルIDが存在しない場合、エラーを返す", async () => {
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(ConfigStorage["getDefaultUserConfig"]()));
      const result = await ConfigStorage.updateModelApiKey("nonExistent", "key");
      expect(result.success).toBe(false);
      expect(result.error).toContain("存在しません");
    });
  });

  describe("resetToDefault", () => {
    it("設定をデフォルトにリセットする", async () => {
      const customConfig = {
        models: [{ id: "custom", name: "Custom", baseUrl: "url", modelName: "model", requiresApiKey: false }],
        defaultModelId: "custom",
      };
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(customConfig));
      const result = await ConfigStorage.resetToDefault();
      expect(result.success).toBe(true);
      expect(LocalStorage.setItem).toHaveBeenCalledWith(
        "userConfigKey",
        JSON.stringify({
          models: DEFAULT_MODELS,
          defaultModelId: DEFAULT_MODEL_ID,
        }),
      );
    });
  });

  describe("setDefaultModel", () => {
    it("新しいデフォルトモデルを設定する", async () => {
      const initialConfig = {
        models: [
          ...DEFAULT_MODELS,
          { id: "newDefault", name: "New Default", baseUrl: "url", modelName: "model", requiresApiKey: false },
        ],
        defaultModelId: DEFAULT_MODEL_ID,
      };
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(initialConfig));
      const result = await ConfigStorage.setDefaultModel("newDefault");
      expect(result.success).toBe(true);
      const savedConfig = JSON.parse(LocalStorage.setItem.mock.calls[0][1]);
      expect(savedConfig.defaultModelId).toBe("newDefault");
    });

    it("モデルIDが存在しない場合、エラーを返す", async () => {
      LocalStorage.getItem.mockResolvedValue(JSON.stringify(ConfigStorage["getDefaultUserConfig"]()));
      const result = await ConfigStorage.setDefaultModel("nonExistent");
      expect(result.success).toBe(false);
      expect(result.error).toContain("存在しません");
    });
  });
});
