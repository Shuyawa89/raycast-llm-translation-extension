# LLM翻訳 Raycast拡張機能

LLMを活用した日英/英日翻訳機能を提供するRaycast拡張機能です。

## 目的

- **生産性向上**: 日常的な翻訳作業の効率化
- **拡張性**: 将来的なLLM機能（要約、解説など）追加の基盤構築

## 前提条件

### LLM API設定（いずれか選択）

#### Option A: Ollama（推奨・無料）
```bash
# Ollamaのインストール
brew install ollama

# Ollamaサーバー起動
ollama serve

# Qwen3モデルのダウンロード
ollama pull qwen3:8b
```

#### Option B: OpenAI API
- OpenAI APIキーの取得
- `src/services/translationApi.ts`での設定変更が必要
  - 将来的にenvファイルへ切り出します。

## 機能

### 1. 選択テキスト翻訳
- システム上で選択したテキストを自動的に翻訳
- 言語を自動判定して適切な方向に翻訳
- 翻訳結果をMarkdown形式で表示

### 2. 手動入力翻訳
- フォームから自由にテキストを入力して翻訳
- 長文テキストにも対応
- リアルタイムでの入力プレビュー

### 3. 翻訳結果表示
- 元テキストと翻訳結果の対比表示
- 使用モデル、処理時間、トークン使用量の表示
- エラー時の詳細情報と対処方法の表示

## 使い方

1. **Raycastを開く**: `Cmd + Space`
2. **拡張機能を検索**: "llmTranslate"と入力
3. **翻訳タイプを選択**:
   - 「選択テキスト翻訳」: 事前にテキストを選択してから実行
   - 「手動入力翻訳」: フォームでテキストを入力
4. **結果確認**: Markdown形式で翻訳結果を確認
5. **リストに戻る**: Actionパネルから「リストに戻る」を選択

## 設定

### API設定の変更
`src/services/translationApi.ts`でAPI設定を変更できます：

```typescript
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: "http://localhost:11434/v1", // Ollama
  model: "qwen3:8b",
  apiKey: "API_KEY", // OpenAI API使用時
};
```

## 技術スタック

- **Framework**: React + TypeScript
- **Platform**: Raycast API
- **LLM**: Ollama (qwen3:8b) / OpenAI API
- **Styling**: Raycast Native Components

## 今後の拡張予定

- 要約作成機能
- 文章解説機能
- 言語学習支援機能
- 翻訳履歴管理

## 開発

```bash
# 開発モード
npm run dev

# ビルド
npm run build

# リント
npm run lint
```
