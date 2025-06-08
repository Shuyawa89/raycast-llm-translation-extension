import { useEffect, useState, useCallback } from "react";
import { LlmModel } from "../types/llmModel";
import { ConfigStorage } from "../utils/configStorage";

export function useModelConfig() {
  const [models, setModels] = useState<LlmModel[]>([]);
  const [defaultModelId, setDefaultModelId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初回データ読み込み
  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userConfig = await ConfigStorage.loadUserConfig();

        setModels(userConfig.models);
        setDefaultModelId(userConfig.defaultModelId);
      } catch (error) {
        console.error("設定読み込みエラー", error);
        setError("設定の読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialConfig();
  }, []); // コンポーネントが初めて表示された時のみ実行

  const addModel = useCallback(async (model: LlmModel) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await ConfigStorage.addModel(model);

      if (result.success) {
        const userConfig = await ConfigStorage.loadUserConfig();
        setModels(userConfig.models);
        setDefaultModelId(userConfig.defaultModelId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    models,
    defaultModelId,
    isLoading,
    error,
    addModel,
  };
}
