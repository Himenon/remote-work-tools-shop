import type { JSX as ReactJSX } from "react";

// React 19 で JSX グローバル namespace が廃止された。
// 廃止の理由：JSX を使う複数の UI ライブラリ（Solid.js など）が共存する環境で
// グローバル型が汚染され、型の衝突が発生するため。
// 公式証跡: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#the-jsx-namespace-in-typescript
//
// このプロジェクトは React 専用のため、各ファイルで `import type { JSX } from "react"` を
// 書く手間を省く目的でグローバルに再宣言している。
declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type ElementClass = ReactJSX.ElementClass;
    type ElementAttributesProperty = ReactJSX.ElementAttributesProperty;
    type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
    type LibraryManagedAttributes<C, P> = ReactJSX.LibraryManagedAttributes<C, P>;
    type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
    type IntrinsicClassAttributes<T> = ReactJSX.IntrinsicClassAttributes<T>;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
  }
}
