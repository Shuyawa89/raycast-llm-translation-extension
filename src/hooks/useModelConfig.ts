import { useEffect, useState } from "react";
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

        console.log("設定読み込み完了");
      } catch (error) {
        console.error("設定読み込みエラー", error);
        setError("設定の読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialConfig();
  }, []); // コンポーネントが初めて表示された時のみ実行

  return {
    models,
    defaultModelId,
    isLoading,
    error,
  };
}
