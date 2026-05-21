import { createRoute } from "honox/factory";
import { findAllBagItems } from "@rwts/server/repository/bag";
import { findAllProducts } from "@rwts/server/repository/product";
import CheckoutPage from "@rwts/ui/page/CheckoutPage";
import CheckoutFormContainer from "@rwts/web/islands/CheckoutFormContainer";
import type { ProductListItem } from "@rwts/contract/client/product";

export default createRoute(async (c) => {
  const [items, products] = await Promise.all([findAllBagItems(), findAllProducts()]);

  const findProductName = (productId: string): string => {
    const found = products.find((p: ProductListItem) => p.productId === productId);
    return found?.name ?? productId;
  };

  const EMPTY_ITEMS_LENGTH = 0;
  const isEmpty = items.length === EMPTY_ITEMS_LENGTH;

  return c.render(
    <CheckoutPage items={items} findProductName={findProductName} checkoutFormContainer={<CheckoutFormContainer disabled={isEmpty} />} />,
    { title: "チェックアウト - RemoteWork Tools Shop" },
  );
});
