# fields

react-hook-form と BaseUI を組み合わせたフォームフィールドコンポーネント群。

## 前提：FormProvider によるラップ

各フィールドコンポーネントは内部で `useController()` を呼び出すため、呼び出し側で必ず `<FormProvider>` でラップすること。

```tsx
import { useForm, FormProvider } from "react-hook-form";
import { TextField } from "#ui/fields/TextField";

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

### useController の取得パターン

```tsx
import { useController } from "react-hook-form";

const { field, fieldState } = useController({ name: props.name });
```

`FormProvider` 配下では `control` を明示せずとも `useController` がコンテキストから自動取得する。
`field.value` / `field.onChange` / `field.onBlur` / `field.ref` を対応する BaseUI コンポーネントの Props に接続する。

### Field.Root の invalid Props

`invalid={Boolean(fieldState.error)}` を渡すことで、BaseUI の内部スタイル（aria-invalid 付与など）が有効になる。

## 新しいフィールドを追加するとき

1. `src/ui/fields/{ComponentName}/` ディレクトリを作成する
2. 以下の 3 ファイルを用意する：
   - `{ComponentName}.tsx` — コンポーネント本体
   - `{ComponentName}.stories.tsx` — Storybook ストーリー（`play` 関数でインタラクションをテスト）
   - `{ComponentName}.spec.tsx` — vitest テスト（`composeStories` でストーリーを再利用）
3. `package.json` の `#ui/fields/*` エイリアス経由でインポートできる

## Field.Error を使うときの必須設定

### `match={true}` を必ず渡すこと

Base UI の `Field.Error` は、**独自の `FormContext`（Base UI の `<Form>` コンポーネントが提供するもの）** を参照して表示の可否を判断する。
表示条件は次の通りであり、どちらも満たされない場合は `mounted = false` となり `null` を返す。

```
rendered = Boolean(formError)            // Base UI の FormContext.errors に値がある
         || validityData.state.valid === false  // Base UI 独自のバリデーションが実行された
```

このプロジェクトでは Base UI の `Form` を使わず react-hook-form の `FormProvider` を使うため、
**どちらの条件も常に false** になる。`Field.Error` は children を渡しても何も表示しない。

**対処**: `match={true}` を渡す。これにより `rendered` が強制的に `true` になり、
children で渡したエラーメッセージが表示される。

```tsx
// NG: Field.Error が常に null を返す
{
  fieldState.error?.message && <Field.Error>{fieldState.error.message}</Field.Error>;
}

// OK: match={true} で強制表示
{
  fieldState.error?.message && <Field.Error match={true}>{fieldState.error.message}</Field.Error>;
}
```

---

## テストで setError を使うときの必須パターン

### `SetFormErrorOnMount` はフィールドを「包む」こと

`src/ui/fields/_test-helpers.tsx` の `SetFormErrorOnMount` は Storybook のストーリーで
マウント直後にエラーをセットするためのヘルパーコンポーネントである。

**兄弟要素として配置してはならない。**

React のレイアウトエフェクトは **子 → 親** の順に実行される。
`useFormState`（`useController` の内部）はレイアウトエフェクトで購読（subscribe）を設定する。
購読の設定より先に `setError` が呼ばれると、通知を受け取る購読者がいないため状態更新が発生せず、
エラーが画面に反映されない。

フィールドコンポーネントを `SetFormErrorOnMount` で包むことで、
フィールド（子）のレイアウトエフェクトが先に実行されて購読が設定され、
その後に `SetFormErrorOnMount`（親）のレイアウトエフェクトで `setError` が呼ばれる。

```tsx
// NG: SetFormErrorOnMount が兄弟かつ先行 → setError 実行時に購読者がいない
<FormProvider {...methods}>
  <SetFormErrorOnMount name="agree" message="..." />
  <CheckboxField {...props} />
</FormProvider>

// OK: フィールドを包む親として配置 → 購読設定後に setError が実行される
<FormProvider {...methods}>
  <SetFormErrorOnMount name="agree" message="...">
    <CheckboxField {...props} />
  </SetFormErrorOnMount>
</FormProvider>
```

---

## コンポーネント一覧

| コンポーネント       | 対応 BaseUI                  | 仕様書の view     |
| -------------------- | ---------------------------- | ----------------- |
| TextField            | `Input`                      | —                 |
| RadioGroupField      | `RadioGroup` + `Radio`       | `"radio"`         |
| SingleSelectField    | `Select`                     | `"single-select"` |
| MultiSelectField     | `CheckboxGroup` + `Checkbox` | `"multi-select"`  |
| SwitchField          | `Switch`                     | —                 |
| CheckboxField        | `Checkbox`                   | —                 |
| NumberSlideField     | `Slider` + `Fieldset`        | —                 |
| QuantityStepperField | `NumberField`                | —                 |
