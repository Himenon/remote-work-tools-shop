# React Context の適切な設計と関心の分離

## 概要

React の Context は、**異なる関心事（責務）を一緒にまとめるべきではない**。
これは設計の基本原則（Separation of Concerns：関心の分離）である。

**重要な設計方針：**

1. まず**責務**で Context を分割する
2. パフォーマンス問題が実際に発生したら、**更新頻度**での分割を検討する

更新頻度の違いだけでは分割しない。同じ責務のスコープ内であれば、更新頻度が異なっても1つの Context にまとめて良い。

## 設計原則の優先順位

### 第一原則：責務による分離（必須）

**異なる責務は必ず別の Context に分ける**

1. **データの種類による分離**
   - テーマ設定（ThemeContext）
   - ユーザー情報（UserContext）
   - DataGrid の UI状態（DataGridStateContext）
   - フォームの状態（FormContext）

2. **ライフサイクルによる分離**
   - アプリケーション全体で使う（グローバル）
   - 特定の画面だけで使う（ローカル）
   - 特定のコンポーネントツリーだけで使う

3. **依存関係による分離**
   - 独立している値（他に依存しない）
   - 相互に依存する値（一緒に更新される）

### 第二原則：パフォーマンス問題が発生したら更新頻度で細分化（オプション）

**同じ責務内で、実際にパフォーマンス問題が発生した場合のみ検討**

同じ責務（例：DataGrid の状態）内でも：

- 頻繁に変わる値（選択状態）の変更が
- ほとんど変わらない値（API参照）を使うコンポーネントに影響する場合

→ この時点で初めて、更新頻度による細分化を検討する

**注意：** 最初から更新頻度で分けない。責務が同じなら1つにまとめておき、
問題が出てから分割を検討する（早すぎる最適化を避ける）。

## 不適切な設計例

### ❌ 悪い例：異なる責務を1つのContextに混在させる

```tsx
// ❌ 不適切：責務が異なる値を1つにまとめている
const AppContext = createContext({
  // テーマ設定の責務
  theme: "dark",
  setTheme: (theme) => {},

  // ユーザー情報の責務
  user: currentUser,
  setUser: (user) => {},

  // DataGrid UI状態の責務
  selectedRowIds,
  paginationModel,
  filterModel,
  setSelectedRowIds,
  setPaginationModel,
  setFilterModel,
});

return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
```

**問題点：**

- **責務が混在している**：テーマ、ユーザー、DataGrid は全く別の関心事
- DataGrid の選択状態が変わっただけで、テーマやユーザー情報を使うコンポーネントまで再レンダリングされる
- 各値の責務が不明確で保守しづらい
- 依存関係が不明瞭（何と何が関連しているのか分からない）

### なぜ問題なのか

```tsx
// 別のコンポーネントで
const ThemeConsumer = () => {
  const { theme } = useAppContext(); // テーマだけ使いたい
  // しかし selectedRowIds が変わるたびに再レンダリングされる！
};

const UserConsumer = () => {
  const { user } = useAppContext(); // ユーザー情報だけ使いたい
  // しかし filterModel が変わるたびに再レンダリングされる！
};
```

**Context の仕組み：**

- Context の value オブジェクトのいずれかのプロパティが変わると、value 全体が新しいオブジェクトになる
- その Context の Hook を呼び出しているすべてのコンポーネントが再レンダリングされる
- 使っていないプロパティの変更でも影響を受ける

## 適切な設計例

### ✅ 良い例：関心事ごとにContextを分割

```tsx
// ✅ 適切：安定した値（API参照）専用のContext
const ApiContext = createContext<{
  apiRef: React.MutableRefObject<GridApi>;
} | null>(null);

// ✅ 適切：設定情報専用のContext
const ThemeContext = createContext<{
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
} | null>(null);

// ✅ 適切：ユーザー情報専用のContext
const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
} | null>(null);

// ✅ 適切：UI状態（頻繁に変わる）専用のContext
const DataGridStateContext = createContext<{
  selectedRowIds: string[];
  setSelectedRowIds: (ids: string[]) => void;
  paginationModel: PaginationModel;
  setPaginationModel: (model: PaginationModel) => void;
  filterModel: FilterModel;
  setFilterModel: (model: FilterModel) => void;
} | null>(null);
```

**利点：**

- 各Contextの責務が明確
- 更新頻度に応じて適切に分離されている
- 必要な値だけを提供するContextを選択できる
- 意図が明確で保守しやすい

## 実装パターン

### 1. Context定義（関心事ごとに分離）

```tsx
/**
 * 安定した値（apiRef）のみを提供するContext
 * 更新頻度: ほぼ変わらない
 * 責務: API操作の参照を提供
 */
const MyApiContext = createContext<{
  apiRef: React.MutableRefObject<SomeApi>;
} | null>(null);

/**
 * 頻繁に変化するUI状態を提供するContext
 * 更新頻度: 頻繁に変わる
 * 責務: DataGridのUI状態管理
 */
const MyStateContext = createContext<{
  selectedRowIds: string[];
  setSelectedRowIds: (ids: string[]) => void;
  paginationModel: PaginationModel;
  setPaginationModel: (model: PaginationModel) => void;
  filterModel: FilterModel;
  setFilterModel: (model: FilterModel) => void;
} | null>(null);
```

### 2. Provider実装

```tsx
export const MyProvider: React.FC<Props> = ({ children }) => {
  const apiRef = useGridApiRef();
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [filterModel, setFilterModel] = useState<FilterModel>({ items: [] });

  // apiValueは安定している（apiRefが変わらない限り再生成されない）
  const apiValue = useMemo(() => ({ apiRef }), [apiRef]);

  // stateValueは状態が変わるたびに再生成される
  const stateValue = {
    selectedRowIds,
    setSelectedRowIds,
    paginationModel,
    setPaginationModel,
    filterModel,
    setFilterModel,
  };

  return (
    <MyApiContext.Provider value={apiValue}>
      <MyStateContext.Provider value={stateValue}>{children}</MyStateContext.Provider>
    </MyApiContext.Provider>
  );
};
```

### 3. 関心事ごとのカスタムHook

```tsx
/**
 * 安定した apiRef のみを取得する Hook
 * 用途: イベントハンドラで実行時に状態を取得する場合
 * 再レンダリング: されない
 */
export const useMyApi = () => {
  const context = useContext(MyApiContext);
  if (!context) {
    throw new Error("useMyApi must be used within MyProvider");
  }
  return context;
};

/**
 * 頻繁に変化するUI状態を取得する Hook
 * 用途: 状態を表示に使う場合
 * 再レンダリング: 状態変更時にされる
 */
export const useMyState = () => {
  const context = useContext(MyStateContext);
  if (!context) {
    throw new Error("useMyState must be used within MyProvider");
  }
  return context;
};

/**
 * すべての値を取得する Hook
 * 用途: 両方必要な場合、または後方互換性のため
 * 再レンダリング: 状態変更時にされる
 */
export const useMyContext = () => {
  const apiContext = useMyApi();
  const stateContext = useMyState();
  return {
    ...apiContext,
    ...stateContext,
  };
};
```

## 使用パターン

### パターン1：安定した値だけ使う（イベントハンドラで使用）

```tsx
const ParentComponent = () => {
  // ✅ apiRefだけ使う → UI状態変更時も再レンダリングされない
  const { apiRef } = useMyApi();

  const handleBulkAction = useCallback(() => {
    // 実行時に最新の選択行を取得
    const selectedIds = Array.from(apiRef.current.getSelectedRows().keys()) as string[];
    console.log("選択中:", selectedIds);
  }, [apiRef]);

  return <ChildComponent onAction={handleBulkAction} />;
};
```

**このパターンが適している場合：**

- イベントハンドラやコールバック内で値を使う
- 実行時に最新の値を取得すれば良い
- 表示に使わない

### パターン2：変化する値を表示に使う

```tsx
const DataGridComponent = () => {
  // ✅ 選択状態やページネーションを表示に使う → 再レンダリングが必要
  const { selectedRowIds, paginationModel } = useMyState();

  return (
    <div>
      <p>{selectedRowIds.length}件選択中</p>
      <DataGrid paginationModel={paginationModel} />
    </div>
  );
};
```

**このパターンが適している場合：**

- 状態を画面表示に使う
- 状態が変わったら表示も更新する必要がある
- 再レンダリングが必要

### パターン3：両方使う

```tsx
const HybridComponent = () => {
  // ✅ 両方必要な場合
  const { apiRef } = useMyApi();
  const { selectedRowIds } = useMyState();

  // または
  // const { apiRef, selectedRowIds } = useMyContext();

  return (
    <div>
      <p>{selectedRowIds.length}件選択中</p>
      <button onClick={() => apiRef.current.selectAll()}>すべて選択</button>
    </div>
  );
};
```

**このパターンが適している場合：**

- 状態を表示にもイベントハンドラにも使う
- 両方の値が必要

## Context の再レンダリングの仕組み

### Provider 傘下のすべてが再レンダリングされるわけではない

**重要：** Provider 傘下にあるだけでは再レンダリングされない。
**Context の Hook を呼び出したコンポーネントだけが再レンダリング対象**。

```tsx
<MyProvider>
  <ComponentA /> {/* ✅ 再レンダリングされない（Hookを使っていない） */}
  <ComponentB>
    {" "}
    {/* ✅ 再レンダリングされない（Hookを使っていない） */}
    <ComponentC /> {/* ❌ useMyState() を呼ぶ → 再レンダリング */}
  </ComponentB>
  <ComponentD /> {/* ❌ useMyState() を呼ぶ → 再レンダリング */}
</MyProvider>
```

**再レンダリングの範囲：**

- Hook を呼び出したコンポーネント
- そのコンポーネントの子孫（親が再レンダリングされたため）

### なぜ分割が重要なのか

```tsx
// ❌ 不適切な設計
const { apiRef } = useMyContext(); // すべての値を持つContext

// Context内部
const value = {
  apiRef, // 変わらない
  selectedRowIds, // これが変わる → value全体が新しいオブジェクトになる
};
// → apiRefだけ使いたいのに、selectedRowIds変更で再レンダリング
```

```tsx
// ✅ 適切な設計
const { apiRef } = useMyApi(); // apiRefだけのContext

// Context内部
const apiValue = useMemo(() => ({ apiRef }), [apiRef]); // 安定
// → selectedRowIds変更の影響を受けない
```

## 設計判断のチェックリスト

Context を設計する際の確認項目：

### 分割すべき状況

- [ ] 更新頻度が大きく異なる値が混在している
  - 例: 安定した ref と頻繁に変わる state
- [ ] 責務が異なる値が混在している
  - 例: テーマ設定とデータ選択状態
- [ ] 一部のコンポーネントは特定の値だけを使う
  - 例: イベントハンドラは apiRef だけ、表示は state だけ
- [ ] 異なるライフサイクルの値が混在している
  - 例: アプリ全体で使う設定と、特定画面だけの一時状態

### 実装時の注意点

- [ ] `useMemo` で安定した値の Context value を最適化
- [ ] 各 Context の責務を明確にドキュメント化
- [ ] 用途別のカスタムHookを提供（useMyApi, useMyState など）
- [ ] 後方互換性が必要なら統合Hookも提供（useMyContext）
- [ ] Provider は安定した値を外側にネスト

## まとめ

### 設計原則

1. **関心の分離（Separation of Concerns）**
   - 更新頻度が異なる値は別のContextに分ける
   - 責務が異なる値は別のContextに分ける
   - これは設計の基本であり、「最適化テクニック」ではない

2. **Context の仕組みを理解する**
   - Context の value のいずれかが変わると、その Context を使うすべてのコンポーネントが再レンダリングされる
   - Provider 傘下にあるだけでは再レンダリングされない
   - Hook を呼び出したコンポーネントだけが対象

3. **適切な粒度で分割する**
   - 安定した値（ref、定数、安定した関数）
   - たまに変わる値（設定、ユーザー情報）
   - 頻繁に変わる値（UI状態、入力値、選択状態）

### 期待される効果

1. **設計の明確化**
   - 各Contextの責務が明確
   - 依存関係が見えやすい
   - 保守性の向上

2. **パフォーマンス**
   - 不要な再レンダリングの防止（副次的な効果）
   - 必要な値だけを取得できる

3. **開発者体験**
   - 意図が明確で理解しやすい
   - 変更の影響範囲が予測しやすい
   - テストしやすい

**重要：** パフォーマンスは結果として得られるものであり、本質は「適切な設計」である。
