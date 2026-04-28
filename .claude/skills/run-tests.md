# run-tests スキル

## トリガー

「テストを実施して」「テストを実行して」「test を回して」「テストを走らせて」と言われたときに使う。

## 手順

1. `pnpm test:run` を実行する
2. 結果を確認し、失敗があれば原因を特定して修正する
3. 修正後に再度 `pnpm test:run` を実行して全テストがパスすることを確認する

## コマンド

```bash
pnpm test:run   # 非ウォッチモード（CI・AIエージェント向け）
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
| スクリーンショット差分      | VRT のベースラインが古い → `pnpm test:vrt:update` で更新              |

---

# run-vrt スキル

## トリガー

「VRTを実施して」「VRTを更新して」「スクリーンショットを更新して」「ビジュアルリグレッションテストを実行して」と言われたときに使う。

## 手順

1. `pnpm test:vrt:update` を実行してベースラインスクリーンショットを更新する
2. 更新されたスクリーンショットが `__screenshots__` ディレクトリに生成されたことを確認する
3. `pnpm test:run` を実行して全テストがパスすることを確認する
4. `__screenshots__` ディレクトリ以下の PNG ファイルを Git にコミット対象として扱う

## コマンド

```bash
pnpm test:vrt:update   # ベースラインスクリーンショットを生成・更新
pnpm test:run          # スクリーンショットを既存ベースラインと比較（CI向け）
```

## スクリーンショットの保存場所

```
src/ui/form-fields/XxxField/__screenshots__/XxxField.vrt.tsx/
  default-chromium-darwin.png
  disabled-chromium-darwin.png
  ...
```

## 合格基準

```
Test Files  18 passed (18)
     Tests  71 passed (71)
```

各コンポーネントの `__screenshots__/XxxField.vrt.tsx/` に対応する PNG が存在すること。

## 注意点

- `test:vrt:update` と `test:run` は別コマンド。更新後は必ず `test:run` で差分がないことを確認する
- ベースライン画像は Git 管理対象。更新後はコミットに含める
