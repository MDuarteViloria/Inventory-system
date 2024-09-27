import DB from "../database/connect-db";

export default async function CreateInventoryLog(Type) {
  const database = new DB();

  const sql = "INSERT INTO InventoryLog (Type) VALUES (?)";
  await database.query(sql, [Type]);

  database.close();
}
