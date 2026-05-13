import { createRoute } from "honox/factory";
import { findAllProducts } from "@rwts/server/repository/product";

export default createRoute(async (c) => c.json(await findAllProducts()));
