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

## 動作確認項目

実装後に `pnpm test:run` を実行して以下を確認すること。

### 期待されるテスト結果

```
Test Files  12 passed (12)
     Tests  42 passed (42)
```

| ファイル                        | テスト数 | 内容                                         |
| ------------------------------- | -------- | -------------------------------------------- |
| `CheckboxField.stories.tsx`     | 4        | ストーリー表示確認                           |
| `CheckboxField.spec.tsx`        | 3        | ラベル・要素・disabled検証                   |
| `MultiSelectField.stories.tsx`  | 3        | ストーリー表示確認                           |
| `MultiSelectField.spec.tsx`     | 3        | ラベル・選択肢・disabled検証                 |
| `RadioGroupField.stories.tsx`   | 3        | ストーリー表示確認                           |
| `RadioGroupField.spec.tsx`      | 3        | ラベル・選択肢・disabled検証                 |
| `SingleSelectField.stories.tsx` | 4        | ストーリー表示確認（ドロップダウン開閉含む） |
| `SingleSelectField.spec.tsx`    | 3        | ラベル・プレースホルダー・disabled検証       |
| `SwitchField.stories.tsx`       | 4        | ストーリー表示確認                           |
| `SwitchField.spec.tsx`          | 3        | ラベル・要素・disabled検証                   |
| `TextField.stories.tsx`         | 3        | ストーリー表示確認                           |
| `TextField.spec.tsx`            | 3        | ラベル・入力欄・disabled検証                 |

### Base UI portal のストーリー実装注意点

Base UI の `Select`（SingleSelectField）はドロップダウンを **portal** で `canvasElement` の外にレンダリングする。
ストーリーの play 関数でドロップダウン内の要素を検索するときは `within(document.body)` を使う:

```tsx
// NG: portal 内の要素は canvasElement の外にある
const canvas = within(canvasElement);
await expect(canvas.getByText("選択肢")).toBeInTheDocument();

// OK: document.body 全体から探す
const body = within(document.body);
await expect(body.getByText("選択肢")).toBeInTheDocument();
```

<!-- END:test-storybook-rules -->
