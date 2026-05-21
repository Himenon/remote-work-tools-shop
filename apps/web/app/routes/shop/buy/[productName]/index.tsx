import { createRoute } from "honox/factory";
import { findProductSpec } from "@rwts/server/repository/product";
import BuyFormContainer from "@rwts/web/islands/BuyFormContainer";

export default createRoute(async (c) => {
  const productName = c.req.param("productName");
  if (!productName) {
    return c.notFound();
  }
  const spec = await findProductSpec(productName);

  if (!spec) {
    return c.notFound();
  }

  return c.render(<BuyFormContainer spec={spec} />, {
    title: `${spec.name} - RemoteWork Tools Shop`,
  });
});
