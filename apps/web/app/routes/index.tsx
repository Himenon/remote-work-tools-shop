import { createRoute } from "honox/factory";
import { findAllProducts } from "@rwts/server/repository/product";
import ProductListPage from "@rwts/ui/page/ProductListPage";

export default createRoute(async (c) => {
  const products = await findAllProducts();

  return c.render(<ProductListPage products={products} />, { title: "RemoteWork Tools Shop" });
});
