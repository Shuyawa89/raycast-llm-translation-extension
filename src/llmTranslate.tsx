import { useTranslation } from "./hooks/useTranslation";
import { ManualInputForm } from "./components/ManualInputForm";
import { TranslationResultView } from "./components/TranslationResultView";
import { TranslationActionList } from "./components/TranslationActionList";

export default function Command() {
  const {
    translationResult,
    isLoading,
    isInputForm,
    handleTranslate,
    resetTranslation,
    showManualInput,
    hideManualInput,
  } = useTranslation();

  // 結果があった場合の画面
  if (translationResult) {
    return <TranslationResultView markdown={translationResult} onBack={resetTranslation} />;
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
    <TranslationActionList isLoading={isLoading} onTranslate={handleTranslate} onShowManualInput={showManualInput} />
  );
}
