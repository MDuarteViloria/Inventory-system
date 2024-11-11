import express from "express";
import DB from "../database/connect-db.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Locations'
  const sql =
    "SELECT P.id, SP.Quantity, P.Name, P.Description, P.Code, P.BarCode, P.LocationId, P.OriginProductId FROM Products P INNER JOIN StockProducts SP ON P.id = SP.ProductId";
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

router.post("/entry", async () => {
  
})

router.post("/output", async () => {

})

export default router;
