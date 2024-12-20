import path, { dirname } from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import permissionsList from "../../sources/permissionsList.js";
const sqlite = sqlite3.verbose();

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function createDB() {
  const route = path.resolve(__dirname, "../../sources/inventory-app.db");

  let existDB = fs.existsSync(route);

  if (existDB) {
    const tx = fs.readFileSync(route, { encoding: "utf-8" });
    if (tx === "") {
      fs.unlinkSync(route);
      existDB = false;
    }
  }
  

  // Si no existe la base de datos, la crea.
  if (!existDB) {
    const newDB = new sqlite.Database(route);
    // Lee el archivo create-database.sql y lo ejecuta en la base de datos creada.
    const SQL = fs.readFileSync(
      path.join(__dirname, "../../sources/create-database.sql"),
      { encoding: "utf-8" }
    );

    await new Promise((resolve) => newDB.exec(SQL, resolve));

    await Promise.all(
      permissionsList.map(async (permission) => {
        return await new Promise((resolve) =>
          newDB.exec(
            `INSERT INTO Permissions (UniqueName) VALUES ('${permission}')`,
            resolve
          )
        );
      })
    );

    await new Promise(x => newDB.close(x));
  }
}

createDB();