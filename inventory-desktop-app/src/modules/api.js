import express from "express";
import cors from "cors";
import morgan from "morgan";

import config from "../../config.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: 10000000000 }));
app.use(morgan("dev"));

// Routers
// app.use("/inventory", images);

//Abrir servidor.
app.listen(config.port, () =>
  console.log(`Server running in port ${config.port}`)
);