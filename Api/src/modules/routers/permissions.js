import express from "express";
import DB from "../database/connect-db.js";
const router = express.Router();

router.patch("/", async (req, res) => {
  try {
    let { UserId, Permissions } = req.body;
    Permissions = Permissions.filter((x) => x !== 1 && Number.isInteger(x));

    if (!UserId || !Permissions) {
      res.status(400).send("Error");
      return;
    }

    let delSQL =
      "DELETE FROM UserPermissions WHERE IdUser = ? AND IdPermission <> 1";
    let SQL =
      "INSERT INTO UserPermissions (IdUser, IdPermission) VALUES (?, ?)";

    const database = new DB();

    try {
      await database.query(delSQL, [UserId]);

      for (let perm of Permissions) {
        await database.query(SQL, [UserId, perm]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
      return;
    }
    
    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

router.get("/", async (req, res) => {
  const database = new DB();

  try {
    let data = await database.query("SELECT * FROM Permissions");
    res.json(data.rows);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

router.get("/reset", () => {})

export default router;
