import { createRoute } from "honox/factory";
import { findAllBagItems } from "@rwts/server/repository/bag";
import { findAllProducts } from "@rwts/server/repository/product";
import CheckoutPage from "@rwts/ui/page/CheckoutPage";
import CheckoutFormConnector from "@rwts/web/islands/CheckoutFormConnector";
import type { ProductListItem } from "@rwts/contract/client/product";

export default createRoute(async (c) => {
  const [items, products] = await Promise.all([findAllBagItems(), findAllProducts()]);

  const findProductName = (productId: string): string => {
    const found = products.find((p: ProductListItem) => p.productId === productId);
    return found?.name ?? productId;
  };

  const isEmpty = items.length === 0;

  return c.render(
    <CheckoutPage items={items} findProductName={findProductName} checkoutFormConnector={<CheckoutFormConnector disabled={isEmpty} />} />,
    { title: "チェックアウト - RemoteWork Tools Shop" },
  );
});
