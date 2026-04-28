<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:test-storybook-rules -->

# テスト・Storybook 実装ノウハウ

## テスト実行コマンド

```bash
pnpm test:run   # 非ウォッチモード（CI・AIエージェント向け）
pnpm test       # ウォッチモード（開発中）
```

## テスト構成

- **テストランナー**: Vitest + Playwright (Chromium) のブラウザモード
- **フレームワーク**: `@storybook/addon-vitest` で Storybook と統合
- **ストーリーファイル**: `*.stories.tsx` — Storybook UI に表示されるストーリー
- **スペックファイル**: `*.spec.tsx` — `composeStories` を使ったコンポーネント単体テスト

スペックファイルは `vitest.config.ts` の `STORYBOOK_COMPONENT_PATHS` 環境変数でテスト対象に追加されており、storybookプロジェクトと同じブラウザ環境で実行される。

## spec ファイルの書き方

```tsx
import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";
import * as Stories from "./XxxField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("XxxField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("ラベルテキスト")).toBeInTheDocument();
  });
});
```

### 重要: `run()` の返り値

`Story.run()` は **void** を返す。`canvas = await Story.run()` は動作しない。
`run()` 後は `within(document.body)` でDOM要素にアクセスする。

### 重要: DOM のクリーンアップ

`runStory` は次の `run()` 呼び出し時に前回のコンテナを自動で削除する。
`afterEach(cleanup)` は不要。ただし `document.body` を使うため、テスト間の DOM 残留に注意。

### 重要: Base UI の disabled 状態

Base UI コンポーネント (`role="checkbox"`, `role="radio"`, `role="switch"` 等) は
HTML の `disabled` 属性ではなく **`aria-disabled="true"`** で無効化状態を表現する。
`toBeDisabled()` は効かない。代わりに以下を使う:

```tsx
// NG: Base UI のカスタムコンポーネントでは動作しない
await expect(canvas.getByRole("checkbox")).toBeDisabled();

// OK: aria-disabled を直接検証する
await expect(canvas.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");

// 複数要素の場合
const checkboxes: HTMLElement[] = canvas.getAllByRole("checkbox");
await Promise.all(checkboxes.map((checkbox: HTMLElement) => expect(checkbox).toHaveAttribute("aria-disabled", "true")));
```

ネイティブのフォーム要素 (`<input>`, `<button>` など) は `toBeDisabled()` が使える。

## Storybook 設定

- 設定ディレクトリ: `.storybook/`
- ストーリー対象: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- スペックファイルはStorybookのUI上には表示されない（`stories` フィールドに含まない）

## vitest.config.ts の重要ポイント

- `process.env.STORYBOOK_COMPONENT_PATHS` でspecファイルのglobを設定することでテスト対象に追加できる
- `globals: true` により `describe`/`it` はグローバル利用可能だが、spec ファイルでは vitest から明示的にimportすること

<!-- END:test-storybook-rules -->
