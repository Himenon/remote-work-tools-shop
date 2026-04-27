# プロダクト設計

本プロジェクトは「Remote Work Tools Shop」という、リモートワークのための商品サイトを作成する。

注意：このサービスはWebエンジニアのための練習用のプロダクトである。

## 画面

`{サイトタイトル}`: RemoteWork Tools Shop

### トップページ（商品一覧ページ）

URI: `/`
ページタイトル: `{サイトタイトル}`

- 商品一覧
  - 商品名
  - 税込み（3桁カンマ表示）
  - 販促文章（72字以内）
  - 商品画像
  - 購入導線（ `/shop/buy/{productName}` へ遷移）

### 製品の購入画面

URI: `/shop/buy/{productName}`
ページタイトル: `{productName} - {サイトタイトル}`
`{productName}`: 製品名

フォーム入力

- 商品名
- スペック入力フィールド (`i=0 ~ product.spec.categories.length`)
  - スペックカテゴリ名 (`product.spec.categories[i].name`)
  - `product.spec.categories[i].view` に応じた表示形式
  - `product.spec.categories[i].specs[j]`の表示
- ギフト設定（`GiftOptionField`）
  - checkbox: ギフト設定有効/無効
- バッグへ追加（ `button[type~submit]` ）

### バッグ

URI: `/shop/bag`
ページタイトル: `バッグ - {サイトタイトル}`

### チェックアウト

URI: `/shop/checkout`
ページタイトル: `チェックアウト - {サイトタイトル}`

## API

### GET: `/products`

商品一覧

### GET: `/product/{productName}/spec`

商品のスペックを返すAPI。以下のようなI/Fをしており、`ProductSpec`がレスポンスに含まれて返ってくる。

```ts
interface Spec {
  /** Specのカテゴリ */
  category: string;
  /**
   * @example メモリー16GB
   * @example Apple M4（10core）
   **/
  name: string;
  /** スペックごとの価格 */
  cost: number;
}

type SpecSelectView = |
  | "radio"
  | "single-select"
  | "multi-select"
  | "indicator";

interface SpecCategory {
  /** カテゴリ名 */
  name: string;
  specs: Spec[];
  /** specを選択する際の選択肢 */
  view: SpecSelectView;
}

interface CustomizableSpec {
  meta: {
    /** sortCategory の配列。表示順に利用する */
    specSortKey: string[];
  }
  categories: {
   /** specのカテゴリごとに選べるSpecが複数存在する */
    [specCategory: string]: SpecCategory;
  }

}

interface Laptop {
  category: "Laptop";
  /** 商品ID */
  productId: string;
  /** スペックを最小構成としたときの価格 */
  price: number;
  /** 商品名 */
  name: string;
  /** 購入時にカスタム可能なスペック一覧 */
  spec: CustomizableSpec;
}

interface SmartPhone {
  category: "SmartPhone";
  /** 商品ID */
  productId: string;
  /** スペックを最小構成としたときの価格 */
  price: number;
  /** 商品名 */
  name: string;
  /** 購入時にカスタム可能なスペック一覧 */
  spec: CustomizableSpec;
}

interface Desk {
  category: "Desk";
  /** 商品ID */
  productId: string;
  /** スペックを最小構成としたときの価格 */
  price: number;
  /** 商品名 */
  name: string;
  /** 購入時にカスタム可能なスペック一覧 */
  spec: CustomizableSpec;
}

interface Microphone {
  category: "Microphone";
  /** 商品ID */
  productId: string;
  /** スペックを最小構成としたときの価格 */
  price: number;
  /** 商品名 */
  name: string;
  /** 購入時にカスタム可能なスペック一覧 */
  spec: CustomizableSpec;
}

export type ProductSpec = Laptop | SmartPhone | Desk | Microphone;
```

### POST: `/add/bag`

- 商品をバッグへ追加する。
- 商品の個数を選択できる。
- バッグへ追加できる商品の種類数は最大10種類とする。

```ts
interface CustomizedProduct {
  productId: string;
  specs: {};
}

/** バッグに追加する商品のペイロード */
interface AddBagPayload {
  /** カスタムされたプロダクト */
  product: CustomizedProduct;
  /** カスタムしたプロダクトの個数 */
  count: number;
}
```

### GET: `/show/bag`

バッグに入っている商品を一覧で表示する。最大10個返ってくる。

```ts
interface ProductsInBag {
  items: {
    /** カスタムされたプロダクト */
    product: CustomizedProduct;
    /** カスタムしたプロダクトの個数 */
    count: number;
  }[];
}
```

### POST: `/checkout`

商品の決済処理を実行する。
