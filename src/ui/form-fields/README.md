# form-fields

react-hook-form と BaseUI を組み合わせたフォームフィールドコンポーネント群。

## 前提：FormProvider によるラップ

各フィールドコンポーネントは内部で `useFormContext()` を呼び出すため、呼び出し側で必ず `<FormProvider>` でラップすること。

```tsx
import { useForm, FormProvider } from "react-hook-form";
import { TextField } from "#ui/form-fields/TextField";

const methods = useForm({ defaultValues: { name: "" } });

return (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <TextField name="name" label="お名前" />
    </form>
  </FormProvider>
);
```

`control` を Props で受け渡す実装は行わない。フォームコンテキストが取得できない場合はランタイムエラーになるため、`<FormProvider>` の存在をコンポーネントツリーで保証すること。

## フィールドの内部構造

各フィールドは以下の責務で構成する。

```
Field.Root          ← disabled / invalid の状態管理とアクセシビリティのルート
  Field.Label       ← ラベルテキスト（htmlFor は BaseUI が自動付与）
  <BaseUI 入力>     ← useController の field を接続
  Field.Error       ← バリデーションエラーメッセージ（fieldState.error 時のみ表示）
```

### useFormContext + useController の取得パターン

```tsx
import { useController, useFormContext } from "react-hook-form";

const { control } = useFormContext();
const { field, fieldState } = useController({ name: props.name, control });
```

`field.value` / `field.onChange` / `field.onBlur` / `field.ref` を対応する BaseUI コンポーネントの Props に接続する。

### Field.Root の invalid Props

`invalid={Boolean(fieldState.error)}` を渡すことで、BaseUI の内部スタイル（aria-invalid 付与など）が有効になる。

## 新しいフィールドを追加するとき

1. `src/ui/form-fields/{ComponentName}/` ディレクトリを作成する
2. 以下の 3 ファイルを用意する：
   - `{ComponentName}.tsx` — コンポーネント本体
   - `{ComponentName}.stories.tsx` — Storybook ストーリー（`play` 関数でインタラクションをテスト）
   - `{ComponentName}.spec.tsx` — vitest テスト（`composeStories` でストーリーを再利用）
3. `package.json` の `#ui/form-fields/*` エイリアス経由でインポートできる

## コンポーネント一覧

| コンポーネント    | 対応 BaseUI                  | 仕様書の view     |
| ----------------- | ---------------------------- | ----------------- |
| TextField         | `Input`                      | —                 |
| RadioGroupField   | `RadioGroup` + `Radio`       | `"radio"`         |
| SingleSelectField | `Select`                     | `"single-select"` |
| MultiSelectField  | `CheckboxGroup` + `Checkbox` | `"multi-select"`  |
| SwitchField       | `Switch`                     | —                 |
| CheckboxField     | `Checkbox`                   | —                 |
