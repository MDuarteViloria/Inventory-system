import jwt from "jsonwebtoken";
import { authOptions } from "../../sources/auth-options.js";
import DB from "../database/connect-db.js";

export async function AuthMiddleware(permissionName, IgnoreMethods = []) {
  const sql = "SELECT * FROM Permissions WHERE UniqueName = ?";
  const database = new DB();

  let permissionId;

  try {
    if (permissionName) {
      let data = await database.query(sql, [permissionName]);

      permissionId = data.rows[0].id;

      if (!permissionId) {
        return (req, res, next) => {
          res.status(401).send("No tienes permiso para acceder a esta ruta");
        };
      }
    }

    return async (req, res, next) => {
      if (!req.cookies.authorization) {
        return res.status(403).send("No estas logueado");
      }
      const { data } = await decodeToken(
        req.cookies.authorization.split(" ")[1]
      );

      const userData = await database.query(
        "SELECT * FROM Users WHERE id = ?",
        [data.id]
      );

      req.locals = { user: userData.rows[0] };

      if (!userData.rows[0]) {
        return res.status(403).send("No estas logueado");
      } else if (!permissionName) return next();

      const permissions = data.permissions;

      if (!permissions)
        return res
          .status(401)
          .send("No tienes permiso para acceder a esta ruta");

      if (permissions.map((x) => x.id).includes(1)) return next();

      if (!permissions?.map((x) => x.id)?.includes(permissionId)) {
        res.status(401).send("No tienes permiso para acceder a esta ruta");
      } else {
        const permissionUserData = permissions.find(
          (x) => x.id === permissionId
        );

        switch (req.method) {
          case "GET":
            if (permissionUserData.to.get || IgnoreMethods.includes("GET"))
              return next();
            return res
              .status(401)
              .send("No tienes permiso para acceder a esta ruta");
          case "POST":
            if (permissionUserData.to.insert || IgnoreMethods.includes("POST"))
              return next();
            return res
              .status(401)
              .send("No tienes permiso para acceder a esta ruta");
          case "PATCH":
            if (permissionUserData.to.update || IgnoreMethods.includes("PATCH"))
              return next();
            return res
              .status(401)
              .send("No tienes permiso para acceder a esta ruta");
          case "DELETE":
            if (
              permissionUserData.to.delete ||
              IgnoreMethods.includes("DELETE")
            )
              return next();
            return res
              .status(401)
              .send("No tienes permiso para acceder a esta ruta");
          default:
            return res
              .status(401)
              .send("No tienes permiso para acceder a esta ruta");
        }
      }
    };
  } catch (e) {
    console.error("Error al consultar:", e);
    return (req, res, next) => {
      res.status(404).send("Error al consultar la base de datos");
    };
  } finally {
    database.close();
  }
}

export function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, authOptions.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return reject(null);
      } else {
        return resolve(decoded);
      }
    });
  });
}

export function generateToken(data) {
  return jwt.sign({ data }, authOptions.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: authOptions.jwtOptions.expiresIn,
  });
}
