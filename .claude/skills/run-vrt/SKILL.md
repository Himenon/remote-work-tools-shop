---
name: run-vrt
description: VRTを実施・更新する。「VRTを実施して」「VRTを更新して」「スクリーンショットを更新して」「ビジュアルリグレッションテストを実行して」と言われたときに実行
---

# VRT実行スキル

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
