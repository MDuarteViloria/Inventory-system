import express from "express";
import cors from "cors";
import morgan from "morgan";

import config from "../../config.js";
import routerProducts from "./routers/products.js";
import routerConfig from "./routers/configuration.js";
import routerImages from "./routers/images.js";
import routerOrigins from "./routers/origins.js "
import routerLocations from "./routers/locations.js"
import routerCategories from "./routers/categories.js"
import routerProviders from "./routers/providers.js"
import routerInventory from "./routers/inventory.js"

export function createServer() {
  const app = express();

  // Middlewares
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));

  // Routers
  app.use("/products", routerProducts);
  app.use("/config", routerConfig)
  app.use("/images", routerImages)
  app.use("/locations", routerLocations)
  app.use("/origins", routerOrigins)
  app.use("/categories", routerCategories)
  app.use("/providers", routerProviders)
  app.use("/inventory", routerInventory)

  // Abrir servidor.
  app.listen(config.port, () =>
    console.log(`Server running on port ${config.port}`)
  );
}
