import express from "express";
import cors from "cors";
import morgan from "morgan";

import config from "../../config.js";
import routerProducts from "./routers/products.js";
import routerConfig from "./routers/configuration.js";

export function createServer() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));

  // Routers
  app.use("/products", routerProducts);
  app.use("/config", routerConfig)

  // Abrir servidor.
  app.listen(config.port, () =>
    console.log(`Server running on port ${config.port}`)
  );
}
