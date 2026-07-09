import "@hono/react-renderer";
import type { JSX as ReactJSX } from "react";

declare module "@hono/react-renderer" {
  interface Props {
    title?: string;
  }
}

// React 19 でグローバル JSX namespace が廃止されたため、このプロジェクト専用に再宣言する。
// 廃止の背景: 複数の JSX ライブラリが共存する環境で型衝突が発生するため。
// 参照: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#the-jsx-namespace-in-typescript
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

  // CSS ファイルの副作用インポート（globals.css）を TypeScript が認識できるようにする
  module "*.css" {
    const content: Record<string, string>;
    export default content;
  }
}
