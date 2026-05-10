import "@rwts/ui/theme/globals.css";
import type { ReactNode } from "react";
import { createClient } from "honox/client";

createClient({
  hydrate: async (elem, root) => {
    const { hydrateRoot } = await import("react-dom/client");
    // HonoX は elem を DOM Node として型付けするが、@hono/react-renderer 使用時の実値は ReactElement。
    // HonoX 内部型と React 型のブリッジ境界のため型キャストが必要。
    hydrateRoot(root, elem as unknown as ReactNode);
  },
  createElement: async (type, props) => {
    const { createElement } = await import("react");
    // HonoX の CreateElement 型は Node を返すことを要求するが、
    // @hono/react-renderer 使用時の実値は ReactElement。
    // HonoX 内部型と React 型のブリッジ境界のため型キャストが必要。
    return createElement(type, props) as unknown as Node;
  },
});
