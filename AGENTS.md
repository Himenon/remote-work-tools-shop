<!-- BEGIN:doc-first-rules -->

# ライブラリの挙動を調査するときはまず公式ドキュメントを読むこと

ソースコードの解析やトレースに入る前に、以下のライブラリは必ず公式ドキュメントを参照すること。
ドキュメントに答えが書いてある場合がほとんどであり、読まずに進めると数時間の無駄調査になる。

| ライブラリ   | ドキュメント URL                      |
| ------------ | ------------------------------------- |
| Base UI      | https://base-ui.com/react/components/ |
| Storybook    | https://storybook.js.org/docs         |
| Tailwind CSS | https://tailwindcss.com/docs/         |
| Vite         | https://vitejs.dev/guide/             |
| Vitest       | https://vitest.dev/guide/             |
| React        | https://react.dev/reference/react     |

**調査手順（この順を守ること）**:

1. 公式ドキュメントで該当コンポーネント・API のページを読む
2. Props 一覧・使用例・注意事項を確認する
3. それでも解決しない場合に限り、ソースコードを参照する

<!-- END:doc-first-rules -->

<!-- BEGIN:breaking-changes-allowed -->

# 破壊的変更を許可する

このリポジトリはデモプロジェクトです。プロジェクト全体に及ぶ破壊的変更（ファイル削除、依存関係の変更、設計方針の転換など）を許可します。
スマートな解決策のためなら、既存コードを大胆に書き直してください。

<!-- END:breaking-changes-allowed -->

<!-- BEGIN:test-storybook-rules -->

# テスト・Storybook 実装ノウハウ

## テスト実行コマンド

```bash
pnpm test   # 非ウォッチモード（CI・AIエージェント向け）
```

## UIコンポーネント開発時の手順

対象: `packages/ui`

コンポーネントの新規実装・修正・テスト作成を行う前に、以下の手順を守ること。

> **コンポーネントを新規作成・リファクタリングするときは `/make-component` スキルを呼び出すこと。**
> **Storybookストーリーを作成・修正するときは `/make-storybook` スキルを呼び出すこと。**
> **コンポーネントのテスト（spec・VRT）を書くときは `/make-component-test` スキルを呼び出すこと。**
> **TypeScriptの実装を終えたら `/check-ts-writing` スキルを呼び出し、書き方を確認すること。**

1. `pnpm storybook`（ポート 15023）でStorybookを起動する
2. **Storybook MCP**（MCPサーバー名: `storybook`）を使って既存コンポーネントとストーリーを確認する
   - 既存のストーリー名・Props・バリアントを把握してから実装を始める
   - `composeStories` で使用するストーリー名はMCPで確認した名前と一致させる
3. Storybookが起動していない場合は、MCPを呼ばずにソースコードを直接参照する

<!-- END:test-storybook-rules -->

<!-- BEGIN:vrt-rules -->

## Visual Regression Testing (VRT)

対象: `packages/ui`

> **VRT ファイルを書くときは `/make-component-test` スキルを呼び出すこと。**

```bash
pnpm --filter @rwts/ui test:update   # ベースラインスクリーンショットを生成・更新
pnpm --filter @rwts/ui test:vrt      # スクリーンショットを既存ベースラインと比較（CI向け）
```

<!-- END:vrt-rules -->

## 禁止ライブラリ

```bash
tsx: node --strip-types を使う
```

## 作業後の確認

リポジトリworkspaceのルートでlintとtestを実行してpassすること。

```bash
pnpm run lint
pnpm run test
```

## ユーザー入力は必ずバリデーションすること

ユーザーからのマウスのクリックや、キーボード入力（アドレスバー含む）によってアプリケーション上で扱うデータが変更される場合、必ずバリデーションを行ってください。
この入力を受け付ける境界を`form`と呼称します。

1. formのバリデーションのスキーマは `@packages/contract/form` で定義してください。
2. formに対するUIが必要な場合、`@packages/ui/src/form` にformのコンポーネントを実装してください。
3. formに対するUIが不要な場合、zodのsafeParse等のAPIを使って入力値をバリデーションしてください。

## 作業後

以下のコマンドを実行し、code formatとlintに従って修正を行うこと。

```bash
pnpm run fmt
pnpm run lint
```
