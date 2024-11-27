import express from "express";
import bcrypt from "bcrypt";
import DB from "../database/connect-db.js";
import { decodeToken, generateToken } from "../controllers/Tokens.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;

    let SQL = "SELECT * FROM Users WHERE Username = ?";

    let sysPassword = null;

    const database = new DB();

    try {
      SQL = await database.query(SQL, [Username]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
      return;
    }

    if ((SQL.rows?.length ?? 0) > 0) {
      sysPassword = SQL.rows[0].Password;
      bcrypt.compare(Password, sysPassword, async (err, matched) => {
        if (err) {
          throw new Error(err);
        } else if (!matched) {
          res.status(401).send("Contraseña incorrecta.");
        } else {
          const permissionsSql =
            "SELECT IdPermission, ToGet, ToUpdate, ToDelete, ToInsert FROM UserPermissions WHERE IdUser = ?";
          const userPermissions = await database.query(permissionsSql, [
            SQL.rows[0].id,
          ]);

          res.cookie(
            "authorization",
            "JWT " +
              generateToken({
                id: SQL.rows[0].id,
                username: SQL.rows[0].Username,
                permissions: userPermissions.rows.map((x) => ({
                  id: x.IdPermission,
                  to: {
                    delete: x.ToDelete,
                    insert: x.ToInsert,
                    update: x.ToUpdate,
                    get: x.ToGet,
                  },
                })),
              }),
            { secure: false }
          );
          res.status(200).send("Exitoso");
        }
      });
    } else {
      res.status(401).send("Usuario no encontrado.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

router.get("/validate", async (req, res) => {
  if (req.cookies.authorization) {
    const database = new DB();

    const { data: cookieData } = await decodeToken(
      req.cookies.authorization.split(" ")[1]
    );

    const permissionsSql =
      "SELECT P.UniqueName, IdPermission, ToGet, ToUpdate, ToDelete, ToInsert FROM UserPermissions INNER JOIN Permissions P ON UserPermissions.IdPermission = P.id WHERE IdUser = ?";
    const userPermissions = await database.query(permissionsSql, [
      cookieData.id,
    ]);

    const userSql = "SELECT * FROM Users WHERE id = ?";
    const {rows: [user]} = await database.query(userSql, [
      cookieData.id,
    ]);

    res.cookie(
      "authorization",
      "JWT " +
        generateToken({
          id: user.id,
          username: user.Username,
          permissions: userPermissions.rows.map((x) => ({
            id: x.IdPermission,
            to: {
              delete: x.ToDelete,
              insert: x.ToInsert,
              update: x.ToUpdate,
              get: x.ToGet,
            },
          })),
        }),
      { secure: false }
    );
    res.status(200).json({
      user: { id: cookieData.id, username: user.Username, fullName: user.FullName },
      permissions: userPermissions.rows.map((x) => ({
        id: x.IdPermission,
        name: x.UniqueName,
        to: {
          delete: x.ToDelete,
          insert: x.ToInsert,
          update: x.ToUpdate,
          get: x.ToGet,
        },
      })),
    });
  } else {
    res.status(200).json({
      authenticated: false,
      permissions: [],
    });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("authorization");
  res.status(200).send("Exitoso");
});

export default router;
