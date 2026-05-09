import { createRoute } from "honox/factory";
import { findProductSpec } from "@rwts/server/database/product";
import BuyFormConnector from "../../../../islands/BuyFormConnector";

export default createRoute((c) => {
  const productName = c.req.param("productName");
  const spec = findProductSpec(productName);

  if (!spec) {
    return c.notFound();
  }

  return c.render(<BuyFormConnector spec={spec} />, {
    title: `${spec.name} - RemoteWork Tools Shop`,
  });
});
