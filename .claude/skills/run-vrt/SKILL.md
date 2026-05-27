---
name: run-vrt
description: VRTを実施・更新する。「VRTを実施して」「VRTを更新して」「スクリーンショットを更新して」「ビジュアルリグレッションテストを実行して」と言われたときに実行
---

# VRT実行スキル

## 手順

1. `pnpm --filter @rwts/ui test:update` を実行してベースラインスクリーンショットを更新する
2. 更新されたスクリーンショットが `__screenshots__` ディレクトリに生成されたことを確認する
3. `pnpm --filter @rwts/ui test:vrt` を実行して全テストがパスすることを確認する
4. `__screenshots__` ディレクトリ以下の PNG ファイルを Git にコミット対象として扱う

## コマンド

```bash
pnpm --filter @rwts/ui test:update   # ベースラインスクリーンショットを生成・更新
pnpm --filter @rwts/ui test:vrt      # スクリーンショットを既存ベースラインと比較（CI向け）
```

## スクリーンショットの保存場所

```
src/ui/fields/XxxField/__screenshots__/XxxField.vrt.tsx/
  default-chromium-darwin.png
  disabled-chromium-darwin.png
  ...
```

## 合格基準

```
Test Files  31 passed (31)
     Tests 154 passed (154)
```

各コンポーネントの `__screenshots__/XxxField.vrt.tsx/` に対応する PNG が存在すること。

## 注意点

- `test:update` と `test:vrt` は別コマンド。更新後は必ず `test:vrt` で差分がないことを確認する
- ベースライン画像は Git 管理対象。更新後はコミットに含める
