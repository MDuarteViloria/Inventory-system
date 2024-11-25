import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import config from "../../config.js";
import routerProducts from "./routers/products.js";
import routerImages from "./routers/images.js";
import routerOrigins from "./routers/origins.js ";
import routerLocations from "./routers/locations.js";
import routerCategories from "./routers/categories.js";
import routerProviders from "./routers/providers.js";
import routerInventory from "./routers/inventory.js";
import routerUsers from "./routers/users.js";
import routerLogin from "./routers/login.js";
import { AuthMiddleware } from "./controllers/Tokens.js";

export async function createServer() {
  const app = express();

  // Middlewares
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));

  // Routers
  app.use("/auth", routerLogin);
  app.use("/products", await AuthMiddleware("PRODUCTOS"), routerProducts);
  app.use("/images", await AuthMiddleware("IMAGENES", ["GET"]), routerImages);
  app.use("/locations", await AuthMiddleware("UBICACIONES"), routerLocations);
  app.use("/origins", await AuthMiddleware("ORIGENES"), routerOrigins);
  app.use("/categories", await AuthMiddleware("CATEGORIAS"), routerCategories);
  app.use("/providers", await AuthMiddleware("PROVEEDORES"), routerProviders);
  app.use("/inventory", await AuthMiddleware("INVENTARIO"), routerInventory);
  app.use("/users", await AuthMiddleware("USUARIOS"), routerUsers);

  // Abrir servidor.
  app.listen(config.port, () =>
    console.log(`Server running on port ${config.port}`)
  );
}
