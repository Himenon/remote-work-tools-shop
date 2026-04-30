---
name: check-ts-writing
description: TypeScriptの書き方をレビューするときに利用します。「TypeScriptをチェックして」「tsの書き方を確認して」「check-ts-writingを実行して」で実行できます。
metadata:
  context: fork
  author: Himenon
  allowed-tools:
    - Read
    - Edit
    - Bash
---

# TypeScript 書き方チェック

実装後のTypeScriptコードを以下の観点でレビューし、問題があれば修正を提案または実施する。

## チェック項目

### 1. `typeof` による型抽出を避ける

`React.ComponentProps<typeof X>` のように `typeof` でコンポーネントから型を間接的に抽出していないか確認する。

**問題のあるパターン:**

```tsx
// NG: typeof で型を間接抽出している
const props: React.ComponentProps<typeof SomeComponent> = { ... };
const props: React.ComponentProps<typeof Namespace.Root> = { ... };
```

**修正手順:**

1. 対象ライブラリの型定義ファイル（`.d.ts`）または公式ドキュメントを確認する
2. コンポーネントが Props 型を直接エクスポートしていないか調べる
3. 見つかった場合はそちらを使う

```tsx
// OK: ライブラリが export している Props 型を直接使う
const props: SomeComponent.Props = { ... };
const props: Namespace.Root.Props = { ... };

// ジェネリクスが必要な場合は型引数を明示する
const props: Select.Root.Props<string> = { ... };
```

**調査方法:**

```bash
# 型定義ファイルで Props の export を確認する
grep -n "export.*Props" node_modules/@some-library/dist/index.d.ts
grep -rn "namespace.*{" node_modules/@some-library/dist/ComponentName.d.ts
```

---

### 2. 三項演算子より `Record` 型のマッピングを優先する

string literal の条件分岐に三項演算子を初手で使っていないか確認する。

**問題のあるパターン:**

```tsx
// NG: 三項演算子で string literal を分岐している
const className = orientation === "vertical" ? "flex flex-col gap-2" : "flex flex-row gap-4";

// NG: ネストした三項演算子
const label = type === "a" ? "A" : type === "b" ? "B" : "C";
```

**修正手順:**

1. 条件の key が string literal union 型かどうか確認する
2. `Record<KeyType, ValueType>` でマッピングオブジェクトを定義する
3. 型安全にキーで値を取得する

```tsx
// OK: Record 型でマッピングする
const classNameByOrientation: Record<"vertical" | "horizontal", string> = {
  vertical: "flex flex-col gap-2",
  horizontal: "flex flex-row gap-4",
};
const className = classNameByOrientation[orientation];

// OK: ユニオン型のキーが全て網羅されていれば型安全
type Status = "active" | "inactive" | "pending";
const labelByStatus: Record<Status, string> = {
  active: "有効",
  inactive: "無効",
  pending: "保留中",
};
```

**`Record` を使えないケース（三項演算子が許容される場面）:**

- 条件が boolean の場合（`isLoading ? "..." : "..."`）
- 条件が string literal union 以外の型の場合
- マッピングの value が関数呼び出しやコンポーネントのレンダリングを含む複雑な式の場合

---

## 実行手順

1. 対象ファイルを `Read` で読む
2. 上記のチェック項目に該当する箇所を列挙する
3. 修正案を提示し、ユーザーの確認を得てから `Edit` で修正する
4. `pnpm tsc --noEmit` で型エラーがないことを確認する
