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
    type: 'manual-text' as const
  }
];
