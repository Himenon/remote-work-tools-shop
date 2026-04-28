---
name: write-vrt
description: VRTファイルを書く。「VRTを書いて」「ビジュアルリグレッションテストを書いて」「スクリーンショットテストを追加して」と言われたときに実行
---

# write-vrt スキル

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
     Tests  71 passed (71)
```

各コンポーネントの `__screenshots__/XxxField.vrt.tsx/` に正しい名前のPNGが存在すること。
