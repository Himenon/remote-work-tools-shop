---
name: make-component
description: React Componentの新規実装、またはリファクタリング、コードレビューを行うときに利用します。「コンポーネントを作って」「Reactのコンポーネントを作って」「コンポーネントを実装して」「Reactのコンポーネントを実装」「コンポーネントをリファクタして」で実行できます。
metadata:
  context: fork
  author: Himenon
  allowed-tools:
    - Read
    - Write
    - Grep
---

# React ComponentのPropsとComponentの実装

あなたはReactのコンポーネントの実装を可読性と拡張性を考慮した実装ができ、命名による責務分離ができる専門家です。

## 対象ファイル

- $ARGUMENTS が指示の場合は、その指示に加えて本SKILLを利用してください。
- $ARGUMENTS がディレクトリを示す場合は、ディレクトリに含まれるコンポーネント全体をリファクタリングまたは新規実装してください。
- $ARGUMENTS のファイルが存在する場合は、依存する子コンポーネントも含めてリファクタリングを行います。
- $ARGUMENTS のファイルが存在しない場合は、指示に従って新規実装を行ってください。

## ファイルの変更操作

- 既存のファイルが存在する場合は上書きをしてください

## 作業ログ出力

- 日本語で出力してください。

## Reactのコンポーネントの実装のガイドライン

以下のガイドラインを順に確認してください。

1. [コンポーネントの実装パターン](./reference/component-composition-patterns.md)
2. [PropsのI/F設計](./reference/props-interface-design.md)
3. [Propsの実装方法](./reference/props-implementation-design.md)
4. [ドメインをコンポーネントと結合](./reference/binding-domain-and-component.md)
5. [コンポーネントに依存しない処理の分離](./reference/separation-of-logic-and-view.md)
6. [関心の分離](./reference/separation-of-concept.md)
7. [ReactのContextの実装方法](./reference/react-context.md)
8. `/no-use-effect`を変更したファイルに実行し、`useEffect`の削除を試みる。
9. [コードコメントの書き方](./reference/code-comments.md)
10. [Factoryコンポーネントのお作法](./reference/factory-component.md)

## チェックリスト

各ガイドラインのチェックリストを確認してください。

1. [コンポーネントの実装パターン](./reference/component-composition-patterns.md)
2. [PropsのI/F設計](./reference/props-interface-design.md)
3. [Propsの実装方法](./reference/props-implementation-design.md)
4. [ドメインをコンポーネントと結合](./reference/binding-domain-and-component.md)
5. [コンポーネントに依存しない処理の分離](./reference/separation-of-logic-and-view.md)
6. [関心の分離](./reference/separation-of-concept.md)
7. [ReactのContextの実装方法](./reference/react-context.md)
8. `/no-use-effect`を変更したファイルに実行し、`useEffect`の削除を試みる。
9. [コードコメントの書き方](./reference/code-comments.md)

## 不要な処理の削除

`useEffect`の利用を極力しないために以下のSKILLを実行してください。

- [ ] `/no-use-effect`を変更したファイルに実行し、`useEffect`の削除を試みる。
