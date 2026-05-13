import { createRoute } from "honox/factory";
import { findAllProducts } from "@rwts/database/product";

export default createRoute((c) => c.json(findAllProducts()));
