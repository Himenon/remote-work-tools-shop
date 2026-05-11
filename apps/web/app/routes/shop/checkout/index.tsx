import { createRoute } from "honox/factory";
import { findAllBagItems } from "@rwts/server/database/bag";
import { findAllProducts } from "@rwts/server/database/product";
import CheckoutPage from "@rwts/ui/page/CheckoutPage";
import CheckoutFormConnector from "@rwts/web/islands/CheckoutFormConnector";

export default createRoute((c) => {
  const items = findAllBagItems();
  const products = findAllProducts();

  const findProductName = (productId: string): string => {
    const found = products.find((p) => p.productId === productId);
    return found?.name ?? productId;
  };

  const isEmpty = items.length === 0;

  return c.render(
    <CheckoutPage items={items} findProductName={findProductName} checkoutFormConnector={<CheckoutFormConnector disabled={isEmpty} />} />,
    { title: "チェックアウト - RemoteWork Tools Shop" },
  );
});
