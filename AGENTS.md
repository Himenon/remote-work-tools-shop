<!-- BEGIN:doc-first-rules -->

# ライブラリの挙動を調査するときはまず公式ドキュメントを読むこと

ソースコードの解析やトレースに入る前に、以下のライブラリは必ず公式ドキュメントを参照すること。
ドキュメントに答えが書いてある場合がほとんどであり、読まずに進めると数時間の無駄調査になる。

| ライブラリ   | ドキュメント URL                                              |
| ------------ | ------------------------------------------------------------- |
| Base UI      | https://base-ui.com/react/components/                         |
| Storybook    | https://storybook.js.org/docs                                 |
| Tailwind CSS | https://tailwindcss.com/docs/                                 |
| Vite         | https://vitejs.dev/guide/                                     |
| Vitest       | https://vitest.dev/guide/                                     |
| Next.js      | `node_modules/next/dist/docs/` または https://nextjs.org/docs |
| React        | https://react.dev/reference/react                             |

**調査手順（この順を守ること）**:

1. 公式ドキュメントで該当コンポーネント・API のページを読む
2. Props 一覧・使用例・注意事項を確認する
3. それでも解決しない場合に限り、ソースコードを参照する

<!-- END:doc-first-rules -->

<!-- BEGIN:breaking-changes-allowed -->

# 破壊的変更を許可する

このリポジトリはデモプロジェクトです。プロジェクト全体に及ぶ破壊的変更（ファイル削除、依存関係の変更、設計方針の転換など）を許可します。
スマートな解決策のためなら、既存コードを大胆に書き直してください。

<!-- END:breaking-changes-allowed -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:test-storybook-rules -->

# テスト・Storybook 実装ノウハウ

## テスト実行コマンド

```bash
pnpm test   # 非ウォッチモード（CI・AIエージェント向け）
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

## UIコンポーネント開発時の手順

コンポーネントの新規実装・修正・テスト作成を行う前に、以下の手順を守ること。

1. `pnpm storybook`（ポート 15023）でStorybookを起動する
2. **Storybook MCP**（MCPサーバー名: `storybook`）を使って既存コンポーネントとストーリーを確認する
   - 既存のストーリー名・Props・バリアントを把握してから実装を始める
   - `composeStories` で使用するストーリー名はMCPで確認した名前と一致させる
3. Storybookが起動していない場合は、MCPを呼ばずにソースコードを直接参照する

## vitest.config.ts の重要ポイント

- `process.env.STORYBOOK_COMPONENT_PATHS` でspecファイルのglobを設定することでテスト対象に追加できる
- `globals: true` により `describe`/`it` はグローバル利用可能だが、spec ファイルでは vitest から明示的にimportすること

## 動作確認項目

実装後に `pnpm test` を実行して以下を確認すること。

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

<!-- BEGIN:vrt-rules -->

## Visual Regression Testing (VRT)

### コマンド

```bash
pnpm test:update   # ベースラインスクリーンショットを生成・更新
pnpm test          # スクリーンショットを既存ベースラインと比較（CI向け）
```

### vrt ファイルの書き方

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
        threshold: 0.1,                  // ピクセル単位の差異許容閾値
        allowedMismatchedPixelRatio: 0.01, // 全体の1%以内の差異を許容
      },
    },
  },
},
```

### 動作確認項目

`pnpm test` を実行し以下を確認:

```
Test Files  18 passed (18)
     Tests  71 passed (71)
```

| 追加ファイル                | テスト数 |
| --------------------------- | -------- |
| `CheckboxField.vrt.tsx`     | 4        |
| `MultiSelectField.vrt.tsx`  | 4        |
| `RadioGroupField.vrt.tsx`   | 4        |
| `SingleSelectField.vrt.tsx` | 4        |
| `SwitchField.vrt.tsx`       | 4        |
| `TextField.vrt.tsx`         | 4        |

各コンポーネントに4枚のスクリーンショットが `__screenshots__` ディレクトリに生成されていることを確認する。

<!-- END:vrt-rules -->
