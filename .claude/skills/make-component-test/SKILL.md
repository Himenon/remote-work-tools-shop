---
name: make-component-test
description: Reactコンポーネントのテスト（spec・VRT）を書くときに利用します。「テストを書いて」「specを書いて」「VRTを書いて」「コンポーネントのテストを実装して」で実行できます。
metadata:
  context: fork
  author: Himenon
  allowed-tools:
    - Read
    - Write
    - Bash
---

# コンポーネントテストの実装

## テスト実行コマンド

```bash
pnpm test   # 非ウォッチモード（CI・AIエージェント向け）
```

## テスト構成

- **テストランナー**: Vitest + Playwright (Chromium) のブラウザモード
- **フレームワーク**: `@storybook/addon-vitest` で Storybook と統合
- **ストーリーファイル**: `*.stories.tsx` — Storybook UI に表示されるストーリー
- **スペックファイル**: `*.spec.tsx` — `composeStories` を使ったコンポーネント単体テスト

スペックファイルは `vitest.config.ts` の `STORYBOOK_COMPONENT_PATHS` 環境変数でテスト対象に追加されており、Storybook プロジェクトと同じブラウザ環境で実行される。

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
`run()` 後は `within(document.body)` で DOM 要素にアクセスする。

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

### 重要: Base UI portal のストーリー実装

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

## VRT（ビジュアルリグレッションテスト）ファイルの書き方

```bash
pnpm test:update   # ベースラインスクリーンショットを生成・更新
pnpm test          # スクリーンショットを既存ベースラインと比較（CI向け）
```

ファイル名: `*.vrt.tsx`

```tsx
import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./XxxField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("XxxField のビジュアルスナップショット", () => {
  it("初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });
  it("操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });
});
```

### 重要: スクリーンショット名は必ず指定する

`toMatchScreenshot()` を引数なしで呼ぶと、同一ファイル内の全テストが `ComponentName-1` というファイル名に衝突する。
**必ず** `toMatchScreenshot("name")` のように明示的な名前を渡すこと。

### スクリーンショットの保存場所

```
src/ui/fields/XxxField/__screenshots__/XxxField.vrt.tsx/
  default-chromium-darwin.png
  disabled-chromium-darwin.png
  ...
```

ベースライン画像は Git に **コミットする**（比較のための正解画像として使う）。

### VRT 設定（vitest.config.ts）

```ts
browser: {
  expect: {
    toMatchScreenshot: {
      comparatorOptions: {
        threshold: 0.1,                    // ピクセル単位の差異許容閾値
        allowedMismatchedPixelRatio: 0.01, // 全体の1%以内の差異を許容
      },
    },
  },
},
```

## 動作確認

テスト実装後に `pnpm test` を実行し、全テストが通ることを確認すること。
