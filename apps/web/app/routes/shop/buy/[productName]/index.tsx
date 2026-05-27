import { createRoute } from "honox/factory";
import { findProductSpec } from "@rwts/server/repository/product";
import BuyFormConnector from "@rwts/web/islands/BuyFormConnector";

export default createRoute(async (c) => {
  const productName = c.req.param("productName");
  if (!productName) {
    return c.notFound();
  }
  const spec = await findProductSpec(productName);

  if (!spec) {
    return c.notFound();
  }

  return c.render(<BuyFormConnector spec={spec} />, {
    title: `${spec.name} - RemoteWork Tools Shop`,
  });
});
