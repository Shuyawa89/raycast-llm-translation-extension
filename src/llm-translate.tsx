import { List, Action, ActionPanel, showToast, Toast, Detail } from "@raycast/api";
import { useState } from "react";
import { removeThinkTags } from "./utils/textProcessig";


interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface TranslationRequest {
  model: string;
  system: string;
  prompt: string;
  stream: boolean;
}

export default function Command() {
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTranslate = async (direction: string, text: string): Promise<void> => {
    setIsLoading(true); // ローディング開始

    showToast({
      style: Toast.Style.Animated,
      title: `${direction} 翻訳開始`,
      message: `${text} を翻訳します`
    });

    try {
      const requestData: TranslationRequest = {
        model: "qwen3:8b",
        system: "You are a specialized translation AI. Your task is to translate between Japanese and English:\n- If the input text is in Japanese, translate it to English\n- If the input text is in English, translate it to Japanese\n- Maintain the original tone and context as much as possible\n- For mixed-language text, leave parts in their most appropriate language rather than forcing translation\n- Do not translate code, technical identifiers, or untranslatable content - leave them as-is\n- For technical terms, consider providing English terms in parentheses when translating to Japanese for better readability\n- Respond with only the translated text, no explanations or additional comments",
        prompt: `${text} /nothink`,
        stream: false
      }
      const response: Response = await fetch("http://localhost:11434/api/generate", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result: OllamaResponse = await response.json() as OllamaResponse; // 無理やり型を合わせてる

      // 🧹 <think>タグを除去する処理を追加
      const cleanedResponse = removeThinkTags(result.response);

      // 翻訳結果をstateに保存する
      setTranslationResult(`
# 翻訳完了

## 元のテキスト
${text}

## 翻訳結果
${cleanedResponse}

## 情報
- 翻訳方向: ${direction}
- 使用モデル: ${result.model}
- 処理時間: ${result.total_duration ? Math.round(result.total_duration / 1000000) + 'ms' : '不明'}
        `);
      showToast({
        style: Toast.Style.Success,
        title: "翻訳完了!",
        message: "結果を確認してください。"
      });

    } catch (error) {
      console.error('Translation error', error);

      showToast({
        style: Toast.Style.Failure,
        title: "翻訳エラー",
        message: "Ollamaが正常に起動しているか確認してください。"
      })

      setTranslationResult(`
# 翻訳エラー

## エラー内容
${error}

## 対処方法
1. Ollamaが起動しているか確認: \`ollama serve\`
2. Qwen3:8bモデルがインストールされているか確認
3. ネットワーク接続を確認

## 元のテキスト
${text}
      `);

    } finally {
      setIsLoading(false);
    };
  };

  // 結果があった場合の画面
  if (translationResult) {
    return (
      <Detail
        markdown={translationResult}
        actions={
          <ActionPanel>
            <Action
              title="リストに戻る"
              onAction={() => setTranslationResult(null)}
            />
          </ActionPanel>
        }
      />
    )
  }

  return (
    <List>
      <List.Item
        title="日本語→英語"
        subtitle="こんにちは→Hello"
        icon="🇯🇵"
        actions={
          <ActionPanel>
            <Action
              title="翻訳実行"
              onAction={() => handleTranslate("日英", "こんにちは")}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="英語→日本語"
        subtitle="Hello→こんにちは"
        icon="🇺🇸"
        actions={
          <ActionPanel>
            <Action
              title="翻訳実行"
              onAction={() => handleTranslate("英日", "Hello")}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
