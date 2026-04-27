import type { JSX as ReactJSX } from "react";

// React 19 で JSX グローバル namespace が廃止された（他の JSX ライブラリとの型衝突を避けるため）。
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
