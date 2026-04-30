---
name: make-storybook
description: Storybookストーリーを新規作成・修正するときに利用します。「Storybookを用意して」「Storybookを作って」「ストーリーを追加して」で実行できます。
metadata:
  author: Himenon
  allowed-tools:
    - Read
    - Write
    - Grep
---

# Storybookストーリーの実装

型安全なStorybookストーリーを作成します。

- **配置場所**: 対象コンポーネントと同じディレクトリ
- **ファイル名**: `コンポーネント名.stories.tsx`
- **設定ディレクトリ**: `.storybook/`
- **ストーリー対象**: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- **フレームワーク**: `@storybook/nextjs-vite`

## 出力言語

コードコメント・Story の name は日本語で記述する。

## 実装テンプレート

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { Component } from "./Component";

type T = typeof Component;
type Story = StoryObj<T>;

const args: ComponentPropsWithoutRef<T> = {
  // 必須 Props をここに列挙する
};

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ShowsLabel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("ラベルテキスト")).toBeInTheDocument();
  },
};

export default {
  component: Component,
  args,
} satisfies Meta<T>;
```

### 型定義の書き方

- `type T = typeof Component` で型を一度だけ宣言し再利用する
- `ComponentPropsWithoutRef<T>` で args の型を定義する
- `Meta` / `StoryObj` は `@storybook/nextjs-vite` からインポートする（`@storybook/react` は不可）

### `export default` の書き方

```tsx
// Good: inline で satisfies を使う
export default {
  component: Component,
  args,
} satisfies Meta<T>;

// Bad: 変数に代入してから export しない
const meta = { component: Component, args } satisfies Meta<T>;
export default meta;
```

## react-hook-form を使うコンポーネントのデコレーター

フォームフィールドは `FormProvider` でラップする必要がある。
`meta` の `component` を直接ラップするか、Story ごとにデコレーターを付ける。

```tsx
import { FormProvider, useForm } from "react-hook-form";

// meta 側でデフォルトのラップを定義する（推奨）
export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: "" } });
    return (
      <FormProvider {...methods}>
        <Component {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;

// 特定 Story だけ初期値を変えたい場合は decorator を使う
export const WithDefaultValue: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { fieldName: "初期値" } });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
};
```

## エラー表示ストーリー

`SetFormErrorOnMount` ヘルパーを使ってエラー状態を再現する。

```tsx
import { SetFormErrorOnMount } from "#test-helper/storybook";

export const ShowsErrorMessage: Story = {
  render: (props) => {
    const methods = useForm({ defaultValues: { fieldName: "" } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="fieldName" message="入力は必須です">
          <Component {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("入力は必須です")).toBeInTheDocument();
  },
};
```

## play 関数の注意点

### Base UI portal（Select のドロップダウン等）

Base UI の `Select` はドロップダウンを portal で `canvasElement` の外にレンダリングする。
portal 内の要素を検索するときは `within(document.body)` を使う。

```tsx
// NG: portal 内の要素は canvasElement の外にある
const canvas = within(canvasElement);
await canvas.getByText("選択肢");

// OK: document.body 全体から探す
const body = within(document.body);
await body.getByText("選択肢");
```

### Base UI の disabled 状態

Base UI のカスタムコンポーネント（`role="checkbox"`, `role="radio"`, `role="switch"` 等）は
`aria-disabled="true"` で無効化を表現する。`toBeDisabled()` は使えない。

```tsx
// OK
await expect(canvas.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
```

## テストデータの作り方

### 文字列

```tsx
const longText = "日本語の文字列".repeat(10);
const longTextEn = "abcdefg ".repeat(10);
```

### 配列

- [ ] 空の配列のストーリーを用意する
- [ ] 要素が1つのストーリーを用意する
- [ ] 通常の個数のストーリーを用意する
- [ ] 100件など多い個数のストーリーを用意する

```tsx
const item: ItemProps = {
  /* 最小限の値 */
};
const items: ItemProps[] = [item]; // 要素が1つ

// Bad: items[0] が undefined になり型エラーになる場合がある
const items: ItemProps[] = [];
```

### イベントハンドラー

`onClick` などは `fn()` を使う。

```tsx
import { fn } from "storybook/test";

export default {
  component: Component,
  args: {
    onClick: fn(),
  },
} satisfies Meta<T>;
```

## チェックリスト

- [ ] `@storybook/nextjs-vite` からインポートしている
- [ ] `type T = typeof Component` + `ComponentPropsWithoutRef<T>` で型定義している
- [ ] Story の name（エクスポート名）が日本語またはわかりやすい英語で記述されている
- [ ] `Default` ストーリーが存在する
- [ ] `Disabled` ストーリーが存在する（disabled Props がある場合）
- [ ] エラー表示ストーリーが存在する（バリデーションがある場合）
- [ ] TypeScript の型エラーがない
