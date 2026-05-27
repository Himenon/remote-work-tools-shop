---
name: run-tests
description: テストを実施・実行する。「テストを実施して」「テストを実行して」「test を回して」「テストを走らせて」と言われたときに実行
---

# テスト実行スキル

## 手順

1. `pnpm test` を実行する
2. 結果を確認し、失敗があれば原因を特定して修正する
3. 修正後に再度 `pnpm test` を実行して全テストがパスすることを確認する

## コマンド

```bash
pnpm test   # 非ウォッチモード（CI・AIエージェント向け）
```

## 合格基準

現時点では以下の結果が期待される:

```
Test Files  18 passed (18)
     Tests  71 passed (71)
```

ファイル数・テスト数は spec/vrt ファイルの追加に伴い増加する。
テスト数が減っていたら `vitest.config.ts` の `STORYBOOK_COMPONENT_PATHS` 設定を確認すること。

## 失敗時の対応

| 症状                        | 確認箇所                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| `canvas is undefined`       | `run()` の返り値を使っていないか確認 → `within(document.body)` を使う |
| `toBeDisabled()` が失敗     | Base UI コンポーネントは `aria-disabled="true"` で検証する            |
| spec ファイルがテスト対象外 | `vitest.config.ts` の `STORYBOOK_COMPONENT_PATHS` を確認              |
| スクリーンショット差分      | VRT のベースラインが古い → `pnpm test:update` で更新                  |
