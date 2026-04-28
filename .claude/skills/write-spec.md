# write-spec スキル

## トリガー

「specを書いて」「テストを書いて」「spec ファイルを作って」と言われたときに使う。

## 前提知識

このプロジェクトのテストは **Vitest + Storybook ブラウザモード** で動作する。
`*.spec.tsx` ファイルは `composeStories` を使い、実際のブラウザ(Chromium)上でコンポーネントをレンダリングして検証する。

## ファイル配置

ストーリーファイルと同じディレクトリに配置する:

```
src/ui/form-fields/XxxField/
  XxxField.tsx
  XxxField.stories.tsx   ← ストーリー定義
  XxxField.spec.tsx      ← spec（ここに書く）
```

## 必須テンプレート

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

## 必須ルール

### インポート

- `describe`, `it`, `afterEach` は **`vitest`** からimportする（グローバルに頼らない）
- `expect`, `within` は **`storybook/test`** からimportする
- `expect` を `vitest` からimportすると `toBeInTheDocument()` 等が使えない

### DOM クエリ

- `Story.run()` は **void** を返す。返り値を受け取らない。
- `run()` の後に `within(document.body)` でDOMにアクセスする。

```tsx
// NG
const canvas = await Default.run();
canvas.getByText("..."); // canvas は undefined

// OK
await Default.run();
const canvas = within(document.body);
canvas.getByText("...");
```

### disabled 状態の検証

Base UI コンポーネント（`role="checkbox"`, `role="radio"`, `role="switch"`, `role="combobox"` の一部）は
`aria-disabled="true"` で無効化を表現する。

```tsx
// NG: Base UI のカスタム要素では動作しない
await expect(canvas.getByRole("checkbox")).toBeDisabled();

// OK
await expect(canvas.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
```

ネイティブ要素（`<input>`, `<button>`, `<select>` など）は `toBeDisabled()` が使える。

### 複数要素の検証

```tsx
const checkboxes: HTMLElement[] = canvas.getAllByRole("checkbox");
await Promise.all(checkboxes.map((checkbox: HTMLElement) => expect(checkbox).toHaveAttribute("aria-disabled", "true")));
```

## テスト実行と動作確認

```bash
pnpm test:run   # 非ウォッチ（AIエージェント・CI向け）
pnpm test       # ウォッチモード
```

spec ファイルを追加・変更したら必ず `pnpm test:run` を実行して確認すること。

### 合格基準

現時点（42テスト）ですべてパスすること:

```
Test Files  12 passed (12)
     Tests  42 passed (42)
```

新しい spec ファイルを1つ追加するたびにテスト数が増える。テスト数が減っていたら spec の include 設定を確認すること。

## よくある失敗パターン

| 症状                              | 原因                                   | 対処                                              |
| --------------------------------- | -------------------------------------- | ------------------------------------------------- |
| `canvas is undefined`             | `run()` の返り値を使っている           | `within(document.body)` を使う                    |
| `describe is not defined`         | グローバルに頼っている                 | `vitest` からimportする                           |
| `toBeDisabled()` が失敗           | Base UIのARIA無効化                    | `toHaveAttribute("aria-disabled", "true")` を使う |
| spec ファイルがテストに含まれない | `STORYBOOK_COMPONENT_PATHS` の設定漏れ | `vitest.config.ts` を確認する                     |

---

# write-vrt スキル

## トリガー

「VRTを書いて」「ビジュアルリグレッションテストを書いて」「スクリーンショットテストを追加して」と言われたときに使う。

## ファイル配置

```
src/ui/form-fields/XxxField/
  XxxField.tsx
  XxxField.stories.tsx
  XxxField.vrt.tsx      ← VRT（ここに書く）
  __screenshots__/      ← 生成されるベースライン画像（Git管理対象）
```

## 必須テンプレート

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

## 必須ルール

### インポート

- `expect` は **`vitest`** からimportする（`expect.element()` はVitest固有のブラウザ拡張のため）
- `within` は不要（VRTはDOM要素クエリをしない）

### スクリーンショット名

`toMatchScreenshot()` は **必ず名前を渡す**。引数なしだと同一ファイル内で名前が衝突する。

```tsx
// NG: 同じファイル内の全テストが "ComponentName-1" に衝突する
await expect.element(document.body).toMatchScreenshot();

// OK: 明示的な名前で一意にする
await expect.element(document.body).toMatchScreenshot("default");
await expect.element(document.body).toMatchScreenshot("disabled");
```

## テスト実行と動作確認

```bash
# 初回 / ベースライン更新
pnpm test:vrt:update

# 比較（CI・日常確認）
pnpm test:run
```

VRT ファイルを追加・変更したら `pnpm test:vrt:update` でベースラインを生成してから `pnpm test:run` で確認する。

### 合格基準

```
Test Files  18 passed (18)
     Tests  66 passed (66)
```

各コンポーネントの `__screenshots__/XxxField.vrt.tsx/` に正しい名前のPNGが存在すること。
