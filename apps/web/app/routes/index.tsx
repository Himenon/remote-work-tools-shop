import { createRoute } from "honox/factory";
import { findAllProducts } from "@rwts/server/database/product";
import ProductListPage from "@rwts/ui/page/ProductListPage";

export default createRoute((c) => {
  const products = findAllProducts();

  return c.render(<ProductListPage products={products} />, { title: "RemoteWork Tools Shop" });
});
