import { useTranslation } from "./hooks/useTranslation";
import { ManualInputForm } from "./components/ManualInputForm";
import { TranslationResultView } from "./components/TranslationResultView";
import { TranslationActionList } from "./components/TranslationActionList";
import { ModelSettingsView } from "./components/ModelSettingsView";

export default function Command() {
  const {
    translationResult,
    isLoading,
    isInputForm,
    isModelSettings,
    handleTranslate,
    resetTranslation,
    showManualInput,
    hideManualInput,
    showModelSettings,
    hideModelSettings,
  } = useTranslation();

  // 結果があった場合の画面
  if (translationResult) {
    return <TranslationResultView markdown={translationResult} onBack={resetTranslation} />;
  }

  // モデル設定の場合の画面
  if (isModelSettings) {
    return <ModelSettingsView onBack={hideModelSettings} />;
  }

  if (isInputForm) {
    return (
      <ManualInputForm
        onSubmit={(text: string) => {
          handleTranslate("自動判定", text); //翻訳実行
          hideManualInput();
        }}
        onCancel={hideManualInput}
      />
    );
  }
  return (
    <TranslationActionList
      isLoading={isLoading}
      onTranslate={handleTranslate}
      onShowManualInput={showManualInput}
      onShowModelSettings={showModelSettings}
    />
  );
}
