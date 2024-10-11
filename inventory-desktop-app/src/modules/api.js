import express from "express";
import cors from "cors";
import morgan from "morgan";

import config from "../../config.js";
import routerProducts from "./routers/products.js";
import routerConfig from "./routers/configuration.js";

export function createServer() {
  const app = express();

  // Middlewares

  app.use((req,res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  })
  app.use(cors({ origin: "*", credentials: true }));
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
