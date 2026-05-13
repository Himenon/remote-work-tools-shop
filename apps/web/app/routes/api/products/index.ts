import { createRoute } from "honox/factory";
import { findAllProducts } from "@rwts/server/repository/product";

export default createRoute((c) => c.json(findAllProducts()));
