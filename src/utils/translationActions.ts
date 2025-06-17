import { TranslationAction } from "../types/translation";

export const TRANSLATION_ACTIONS: TranslationAction[] = [
  {
    id: 'selected-text',
    title: '選択テキスト翻訳',
    subtitle: '言語を日←→英に翻訳します',
    icon: '💻',
    type: 'selected-text' as const
  },
  {
    id: 'manual-input',
    title: '手動入力翻訳',
    subtitle: '手動で入力した内容を翻訳します',
    icon: '✏️',
    type: 'manual-input' as const
  },
  {
    id: 'model-settings',
    title: 'モデル設定',
    subtitle: 'LLMモデルの追加・削除・APIキー設定',
    icon: '⚙️',
    type: 'model-settings' as const
  },
];
