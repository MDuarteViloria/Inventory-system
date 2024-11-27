import express from "express";
import DB from "../database/connect-db.js";
import config from "../../../config.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  const sql =
    "SELECT P.id, SP.Quantity, P.Name, P.Description, P.Code, P.BarCode, P.LocationId, P.OriginProductId FROM Products P INNER JOIN StockProducts SP ON P.id = SP.ProductId WHERE P.Deleted = FALSE";
  const database = new DB();

  try {
    let data = await database.query(sql);

    res.json(data.rows);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

router.get("/inventory-data", async (req, res) => {
  const sql =
    "SELECT (SELECT COUNT(*) FROM Products WHERE Deleted = FALSE) AS TotalProducts,(SELECT COUNT(*) FROM OutputsHeaders) AS TotalOutputs,(SELECT COUNT(*) FROM EntriesHeaders) AS TotalEntries;";
  const database = new DB();

  try {
    let data = await database.query(sql);

    res.json(data.rows[0]);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

export default router;
