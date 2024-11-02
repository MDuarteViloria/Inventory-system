import express from "express";
import DB from "../database/connect-db.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Providers'
  const sql = "SELECT * FROM Providers";
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

router.get("/:id", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Providers'
  const sql = "SELECT * FROM Providers WHERE id = ?";
  const database = new DB();

  try {
    let data = await database.query(sql, [req.params.id]);
    if(data.rows.length === 0) {
      return res.status(404).send("El proveedor no existe");
    } else {    
      res.json(data.rows[0]);
    }
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
})

router.patch("/:id", async (req, res) => {
  const { Name, Doc } = req.body;

  const database = new DB();

  const sql = "UPDATE Providers SET Name = IFNULL(?, Name), Doc = IFNULL(?, Doc) WHERE id = ?";

  try {
    await database.query(sql, [Name, Doc, req.params.id]);

    res.json({
      success: true,
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

// ADD ONE
router.post("/", async (req, res) => {
  const { Name, Doc } =
    req.body;

  if (!Name || !Doc) {
    return res
      .status(400)
      .json({ success: false, error: "Todos los campos son obligatorios" });
  }

  const database = new DB();

  const sql =
    "INSERT INTO Providers (Doc, Name) VALUES (?, ?)";

  try {
    await database.query(sql, [
      Doc,
      Name
    ]);

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

// DELETE ONE
router.delete("/:id", async (req, res) => {
  const database = new DB();

  const sql = "DELETE FROM Providers WHERE id = ?";

  try {
    const dbProviderRes = await database.query(sql, [req.params.id]);

    res.json({
      success: dbProviderRes.ready,
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
