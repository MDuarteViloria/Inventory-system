import express from "express";
import DB from "../database/connect-db.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Products'
  const sql = "SELECT * FROM Products";
  const database = new DB();

  try {
    const data = await database.query(sql);
    res.json(data.rows);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

// GET ONE BY ID
router.get("/:id", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Products'
  const sql = "SELECT * FROM Products WHERE id = ?";
  const database = new DB();

  try {
    const data = await database.query(sql, [req.params.id]);
    if (data.rows[0]) {
      res.json(data.rows[0]);
    } else {
      res
        .status(404)
        .json({ success: false, error: "No se encontraron resultados" });
    }
  } catch (e) {
    console.error("Error al consultar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al consultar la base de datos" });
  } finally {
    database.close();
  }
});

// ADD ONE
router.post("/", async (req, res) => {
  const { Name, Description, Code, BarCode, OriginProductId, LocationId } =
    req.body;

  if (!Name || !Description || !Code) {
    return res
      .status(400)
      .json({ success: false, error: "Todos los campos son obligatorios" });
  }

  const database = new DB();

  if (Code) {
    const sql = "SELECT * FROM Products WHERE (Code = ?)";
    const data = await database.query(sql, [Code]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El Code ya existe" });
    }
  }

  if (BarCode) {
    const sql = "SELECT * FROM Products WHERE (BarCode = ?)";
    const data = await database.query(sql, [BarCode]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El BarCode ya existe" });
    }
  }

  const sql =
    "INSERT INTO Products (Name, Description, Code, BarCode, OriginProductId, LocationId) VALUES (?, ?, ?, ?, ?, ?)";
  
  const sqlStock = "INSERT INTO StockProducts (Quantity, ProductId) VALUES (?, (SELECT id FROM Products WHERE Code = ?))";
  

  try {
    await database.query(sql, [
      Name,
      Description,
      Code,
      BarCode,
      OriginProductId,
      LocationId,
    ]);

    await database.query(sqlStock, [
      0,
      Code]);

    res.json({
      success: true,
    });
  } catch (e) {
    console.error("Error al insertar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al insertar en la base de datos" });
  } finally {
    database.close();
  }
});

// UPDATE ONE
router.patch("/:id", async (req, res) => {
  const {
    Name = null,
    Description = null,
    Code = null,
    BarCode = null,
    OriginProductId = null,
    LocationId = null,
  } = req.body;

  const database = new DB();

  if (Code) {
    const sql = "SELECT * FROM Products WHERE (Code = ?) AND id <> ?";
    const data = await database.query(sql, [Code, req.params.id]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El Code ya existe" });
    }
  }

  if (BarCode) {
    const sql = "SELECT * FROM Products WHERE (BarCode = ?) AND id <> ?";
    const data = await database.query(sql, [BarCode, req.params.id]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El BarCode ya existe" });
    }
  }

  const sql =
    "UPDATE Products SET Name = IFNULL(?, Name), Description = IFNULL(?, Description), Code = IFNULL(?, Code), BarCode = IFNULL(?, BarCode), OriginProductId = IFNULL(?, OriginProductId), LocationId = IFNULL(?, LocationId) WHERE id = ?";

  try {
    const dbRes = await database.query(sql, [
      Name,
      Description,
      Code,
      BarCode,
      OriginProductId,
      LocationId,
      req.params.id,
    ]);
    res.json({
      success: dbRes.ready,
    });
  } catch (e) {
    console.error("Error al actualizar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar la base de datos" });
  } finally {
    database.close();
  }
});

// DELETE ONE
router.delete("/:id", async (req, res) => {
  const database = new DB();

  const sql = "DELETE FROM Products WHERE id = ?";
  const sqlStock = "DELETE FROM StockProducts WHERE ProductId = ?";

  try {

    const dbProductRes = await database.query(sql, [req.params.id]);
    const dbStockProductRes = await database.query(sqlStock, [req.params.id]);

    if(dbStockProductRes.ready) {

    }

    res.json({
      success: dbProductRes.ready && dbStockProductRes.ready,
    });

  } catch (e) {
    console.error("Error al eliminar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar la base de datos" });
  } finally {
    database.close();
  }
});

export default router;
