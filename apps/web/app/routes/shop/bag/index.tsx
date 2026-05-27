import { createRoute } from "honox/factory";
import { findAllBagItems } from "@rwts/server/repository/bag";
import { findAllProducts } from "@rwts/server/repository/product";
import BagPage from "@rwts/ui/page/BagPage";
import type { ProductListItem } from "@rwts/contract/client/product";

export default createRoute(async (c) => {
  const [items, products] = await Promise.all([findAllBagItems(), findAllProducts()]);

  const findProductName = (productId: string): string => {
    const found = products.find((p: ProductListItem) => p.productId === productId);
    return found?.name ?? productId;
  };

  return c.render(<BagPage items={items} findProductName={findProductName} />, {
    title: "バッグ - RemoteWork Tools Shop",
  });
});
