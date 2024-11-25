const [ node, path, Username, FullName, Password ] = process.argv;

import bcrypt from "bcrypt";
import DB from "../database/connect-db.js";

  const database = new DB();

  if (!FullName || !Password || !Username) {
    res.status(400).send("Debe enviar todos los datos");
  }

  try {
    await database.query("SELECT * FROM Users WHERE Username = ?", [
      Username,
    ]);

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        throw new Error(err);
      } else {
        bcrypt.hash(Password, salt, async (err, hash) => {
          if (err) {
            throw new Error(err);
          } else {
            const { rows } =await database.query(
              "INSERT INTO Users (Username, Fullname, Password) VALUES (?, ?, ?) RETURNING id",
              [Username, FullName, hash]
            );
            await database.query(
              "INSERT INTO UserPermissions (IdUser, IdPermission, ToDelete, ToGet, ToInsert, ToUpdate) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
              [rows[0].id, 1, 1, 1, 1, 1]
            );
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