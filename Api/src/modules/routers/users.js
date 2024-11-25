import express from "express";
import DB from "../database/connect-db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../controllers/Tokens.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Providers'
  const sql = "SELECT id, FullName, Username FROM Users";
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

// GET ONE
router.get("/:id", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Providers'
  const sql = "SELECT id, FullName, Username FROM Users WHERE id = ?";
  const database = new DB();

  try {
    let data = await database.query(sql, [req.params.id]);
    if (data.rows.length === 0) {
      return res.status(404).send("El usuario no existe");
    } else {
      res.json(data.rows[0]);
    }
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

// EDIT ONE
router.patch("/:id", async (req, res) => {
  const { FullName, Username, Password } = req.body;

  const database = new DB();

  const sql =
    "UPDATE Users SET FullName = IFNULL(?, FullName), Username = IFNULL(?, Username) WHERE id = ?";

  try {
    await database.query(sql, [FullName, Username, req.params.id]);

    if (Password) {
      if (Password.length < 8) {
        res.status(400).send("La contraseña debe tener al menos 8 caracteres.");
        return;
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          throw new Error(err);
        } else {
          bcrypt.hash(Password, salt, async (err, hash) => {
            if (err) {
              throw new Error(err);
            } else {
              let SQL = await database.query(
                "UPDATE Users SET Password = ? WHERE id = ?",
                [Username, hash]
              );

              res.cookie(
                "authorization",
                "JWT " + generateToken({ id: SQL[0].id }),
                { secure: false }
              );

              res.json({
                success: true,
                id: SQL.rows[0].id,
              });
            }
          });
        }
      });
    }

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
  const { Username, FullName, Password } = req.body;

  const database = new DB();

  if (!FullName || !Password || !Username) {
    res.status(400).send("Debe enviar todos los datos");
    return;
  }

  try {
    let SQL = await database.query("SELECT * FROM Users WHERE Username = ?", [
      Username,
    ]);

    if (SQL.rows.length > 0) {
      res.status(400).send("El usuario ya existe.");
      return;
    }

    if (Password.length < 8) {
      res.status(400).send("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.json({ success: false, error: err });
        throw new Error(err);
      } else {
        bcrypt.hash(Password, salt, async (err, hash) => {
          if (err) {
            throw new Error(err);
          } else {
            let SQL = await database.query(
              "INSERT INTO Users (Username, Fullname, Password) VALUES (?, ?, ?) RETURNING id",
              [Username, FullName, hash]
            );

            res.json({
              success: true,
              id: SQL.rows[0].id,
            });
          }
        });
      }
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

  const sql = "DELETE FROM Users WHERE id = ?";

  try {
    const dbUserRes = await database.query(sql, [req.params.id]);

    res.json({
      success: dbUserRes.ready,
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
