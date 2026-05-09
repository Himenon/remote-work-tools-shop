import "@rwts/ui/theme/globals.css";
import type { ElementType } from "react";
import { createClient } from "honox/client";

createClient({
  hydrate: async (elem, root) => {
    const { hydrateRoot } = await import("react-dom/client");
    hydrateRoot(root, elem);
  },
  createElement: async (type: unknown, props: unknown) => {
    const { createElement } = await import("react");
    return createElement(type as ElementType, props as object | null);
  },
});
