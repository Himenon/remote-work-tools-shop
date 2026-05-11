import { createRoute } from "honox/factory";
import { findAllBagItems } from "@rwts/server/database/bag";
import { findAllProducts } from "@rwts/server/database/product";
import BagPage from "@rwts/ui/page/BagPage";

export default createRoute((c) => {
  const items = findAllBagItems();
  const products = findAllProducts();

  const findProductName = (productId: string): string => {
    const found = products.find((p) => p.productId === productId);
    return found?.name ?? productId;
  };

  return c.render(<BagPage items={items} findProductName={findProductName} />, {
    title: "バッグ - RemoteWork Tools Shop",
  });
});
